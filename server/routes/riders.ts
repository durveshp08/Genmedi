import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { authenticateToken } from "../middleware/auth";

export const ridersRouter = Router();

// ─── GET / ───────────────────────────────────────────────────
ridersRouter.get(
  "/",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    // In production, this would query a Rider table
    // For now, return mock rider data
    const riders = [
      {
        id: "rider-1",
        name: "Ramesh Kumar",
        phone: "+91 98450 12345",
        vehicle: "Hero Electric Optima",
        vehicleNumber: "KA-05-HJ-1234",
        status: "active",
        currentOrderId: "order-123",
        rating: 4.8,
        completedOrders: 245,
        hubId: "hub-048",
        lastLocation: { lat: 12.9716, lng: 77.5946 },
      },
      {
        id: "rider-2",
        name: "Suresh Reddy",
        phone: "+91 98450 67890",
        vehicle: "Ather 450X",
        vehicleNumber: "KA-05-HJ-5678",
        status: "idle",
        currentOrderId: null,
        rating: 4.6,
        completedOrders: 189,
        hubId: "hub-048",
        lastLocation: { lat: 12.9756, lng: 77.5986 },
      },
      {
        id: "rider-3",
        name: "Anil Singh",
        phone: "+91 98450 11122",
        vehicle: "Bajaj Chetak",
        vehicleNumber: "KA-05-HJ-9012",
        status: "active",
        currentOrderId: "order-456",
        rating: 4.9,
        completedOrders: 312,
        hubId: "hub-048",
        lastLocation: { lat: 12.9686, lng: 77.5916 },
      },
    ];

    res.json({ data: riders, total: riders.length });
  })
);

// ─── POST /assign ─────────────────────────────────────────────
ridersRouter.post(
  "/assign",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const { orderId, riderId } = req.body;

    if (!orderId || !riderId) {
      throw new ApiError(400, "orderId and riderId are required");
    }

    // In production, this would update the Order and Rider records
    res.json({
      success: true,
      message: `Order ${orderId} assigned to rider ${riderId}`,
    });
  })
);

// ─── GET /:id ──────────────────────────────────────────────────
ridersRouter.get(
  "/:id",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // In production, this would query the Rider table
    const rider = {
      id,
      name: "Ramesh Kumar",
      phone: "+91 98450 12345",
      vehicle: "Hero Electric Optima",
      vehicleNumber: "KA-05-HJ-1234",
      status: "active",
      currentOrderId: "order-123",
      rating: 4.8,
      completedOrders: 245,
      hubId: "hub-048",
      lastLocation: { lat: 12.9716, lng: 77.5946 },
      batteryLevel: 78,
      temperature: 4.2,
    };

    res.json(rider);
  })
);

// ─── PATCH /:id/status ────────────────────────────────────────
ridersRouter.patch(
  "/:id/status",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "idle", "offline", "break"].includes(status)) {
      throw new ApiError(400, "Invalid status");
    }

    res.json({
      success: true,
      message: `Rider ${id} status updated to ${status}`,
    });
  })
);
