import { Router, Request, Response } from "express";
import { Order, StockistHub } from "../models";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { validate } from "../middleware/validate";
import { authenticateToken } from "../middleware/auth";
import { createOrderSchema, orderIdSchema, updateOrderStatusSchema } from "../validators/orders";

// Order lifecycle state machine
type OrderStatus =
  | "pending"
  | "confirmed"
  | "payment_pending"
  | "paid"
  | "processing"
  | "pharmacist_review"
  | "verified"
  | "packing"
  | "ready_for_pickup"
  | "dispatched"
  | "out_for_delivery"
  | "near_location"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "exception";

const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["payment_pending", "cancelled"],
  payment_pending: ["paid", "cancelled"],
  paid: ["processing", "refunded"],
  processing: ["pharmacist_review", "exception"],
  pharmacist_review: ["verified", "cancelled"],
  verified: ["packing"],
  packing: ["ready_for_pickup"],
  ready_for_pickup: ["dispatched"],
  dispatched: ["out_for_delivery"],
  out_for_delivery: ["near_location", "delivered", "exception"],
  near_location: ["delivered"],
  delivered: [],
  cancelled: [],
  refunded: [],
  exception: ["processing", "cancelled"],
};

function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_TRANSITIONS[from]?.includes(to) ?? false;
}

export const ordersRouter = Router();

/**
 * Converts a Mongoose order to the frontend OrderTracking type.
 */
function toOrderResponse(order: any) {
  return {
    orderId: order._id,
    status: order.status,
    etaMinutes: order.etaMinutes,
    riderName: order.riderName,
    riderPhone: order.riderPhone,
    riderRating: order.riderRating,
    vehicle: order.vehicle,
    currentSpeedKmh: order.currentSpeedKmh,
    boxTemperatureCelsius: order.boxTemperatureCelsius,
    handoverOtp: order.handoverOtp,
    hubName: order.hubName,
    hubAddress: order.hubAddress,
    customerAddress: order.customerAddress,
    tamperSealBarcode: order.tamperSealBarcode,
    stages: order.stages,
  };
}

/**
 * GET /api/orders
 * List all orders.
 */
ordersRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    res.json({
      data: orders.map(toOrderResponse),
      total: orders.length,
    });
  })
);

/**
 * GET /api/orders/:id
 * Get a single order with tracking data.
 */
ordersRouter.get(
  "/:id",
  validate(orderIdSchema, "params"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findById(id).lean();

    if (!order) {
      throw new ApiError(404, `Order with ID "${id}" not found`);
    }

    res.json(toOrderResponse(order));
  })
);

/**
 * POST /api/orders
 * Place a new order.
 */
ordersRouter.post(
  "/",
  validate(createOrderSchema, "body"),
  asyncHandler(async (req, res) => {
    const { prescriptionId, customerAddress, deliverySpeed, items } = req.body;

    // Generate order metadata
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    const tamperSeal = `TS-IND-${Math.floor(1000 + Math.random() * 9000)}-X`;

    // Find nearest hub
    const hubFilter: any = {};
    if (deliverySpeed === "fast_45") {
      hubFilter.fastDeliveryAvailable = true;
    }
    const hub = await StockistHub.findOne(hubFilter).sort({ distanceKm: 1 }).lean();

    const etaMinutes = deliverySpeed === "fast_45" ? (hub?.estimatedDeliveryMins ?? 45) : 90;

    const stages = [
      {
        title: "Rx Verified & Clinical Clearance",
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST",
        completed: false,
        active: true,
        description: "Awaiting pharmacist verification and clinical sign-off",
      },
      {
        title: "Hub Dispensing & Tamper-Sealing",
        time: "Pending",
        completed: false,
        active: false,
        description: "Batch matching, cold-chain sensor check & barcode sealing",
      },
      {
        title: "Rider Picked Up & OTP Handshake",
        time: "Pending",
        completed: false,
        active: false,
        description: "Express rider will verify pickup OTP at hub bay",
      },
      {
        title: "45-Min Express Transit (Live GPS)",
        time: "Pending",
        completed: false,
        active: false,
        description: "Live GPS tracking with thermal monitoring",
      },
      {
        title: "Doorstep Delivery & OTP Verification",
        time: "Pending",
        completed: false,
        active: false,
        description: `Provide OTP ${otp} to rider for tamper seal unsealing`,
      },
    ];

    const order = await Order.create({
      status: "order_placed",
      etaMinutes,
      riderName: "Assigning rider...",
      riderPhone: "",
      riderRating: 0,
      vehicle: "Pending assignment",
      currentSpeedKmh: 0,
      boxTemperatureCelsius: 4.0,
      handoverOtp: otp,
      hubName: hub?.name ?? "Nearest Available Hub",
      hubAddress: hub?.address ?? "",
      customerAddress,
      tamperSealBarcode: tamperSeal,
      stages,
      prescriptionId: prescriptionId || null,
    });

    res.status(201).json(toOrderResponse(order.toObject()));
  })
);

/**
 * PATCH /api/orders/:id/status
 * Update order status with state machine validation.
 */
ordersRouter.patch(
  "/:id/status",
  authenticateToken,
  validate(updateOrderStatusSchema, "body"),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const userRole = req.user?.role;

    const order = await Order.findById(id);

    if (!order) {
      throw new ApiError(404, `Order with ID "${id}" not found`);
    }

    // Validate state transition
    if (!canTransition(order.status as OrderStatus, status as OrderStatus)) {
      throw new ApiError(400, `Invalid status transition from ${order.status} to ${status}`);
    }

    // Role-based validation for certain transitions
    const restrictedTransitions: Record<string, string[]> = {
      pharmacist_review: ["pharmacist", "admin"],
      refunded: ["admin"],
      exception: ["admin"],
    };

    if (restrictedTransitions[status] && userRole && !restrictedTransitions[status].includes(userRole)) {
      throw new ApiError(403, `Role ${userRole} is not authorized to transition to ${status}`);
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    res.json(toOrderResponse(updated));
  })
);
