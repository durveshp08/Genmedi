import { Router } from "express";
import { PriorityException, Order } from "../models";
import { asyncHandler, ApiError } from "../middleware/errorHandler";

export const exceptionsRouter = Router();

/**
 * Converts a Mongoose exception to the frontend PriorityException type.
 */
function toExceptionResponse(exc: any, hubName?: string) {
  return {
    id: exc._id,
    orderId: exc.orderId,
    hub: hubName ?? "Unknown Hub",
    type: exc.type,
    severity: exc.severity,
    description: exc.description,
    slaRemainingMins: exc.slaRemainingMins,
    riderName: exc.riderName,
    status: exc.status,
    timestamp: exc.timestamp,
  };
}

/**
 * GET /api/exceptions
 * List all active/resolving exceptions.
 */
exceptionsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const exceptions = await PriorityException.find({ status: { $ne: "resolved" } })
      .sort({ slaRemainingMins: 1 })
      .lean();

    // Fetch associated order hub names
    const orderIds = [...new Set(exceptions.map((e) => e.orderId.toString()))];
    const orders = await Order.find({ _id: { $in: orderIds } })
      .select("hubName")
      .lean();
    const hubMap = new Map(orders.map((o) => [o._id.toString(), o.hubName]));

    res.json({
      data: exceptions.map((exc) =>
        toExceptionResponse(exc, hubMap.get(exc.orderId.toString()))
      ),
      total: exceptions.length,
    });
  })
);

/**
 * GET /api/exceptions/all
 * List all exceptions (including resolved).
 */
exceptionsRouter.get(
  "/all",
  asyncHandler(async (_req, res) => {
    const exceptions = await PriorityException.find()
      .sort({ createdAt: -1 })
      .lean();

    const orderIds = [...new Set(exceptions.map((e) => e.orderId.toString()))];
    const orders = await Order.find({ _id: { $in: orderIds } })
      .select("hubName")
      .lean();
    const hubMap = new Map(orders.map((o) => [o._id.toString(), o.hubName]));

    res.json({
      data: exceptions.map((exc) =>
        toExceptionResponse(exc, hubMap.get(exc.orderId.toString()))
      ),
      total: exceptions.length,
    });
  })
);

/**
 * PATCH /api/exceptions/:id/resolve
 * Resolve an exception.
 */
exceptionsRouter.patch(
  "/:id/resolve",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const existing = await PriorityException.findById(id);
    if (!existing) {
      throw new ApiError(404, `Exception with ID "${id}" not found`);
    }

    const exception = await PriorityException.findByIdAndUpdate(
      id,
      { status: "resolved" },
      { new: true }
    ).lean();

    const order = await Order.findById(exception!.orderId)
      .select("hubName")
      .lean();

    res.json(toExceptionResponse(exception, order?.hubName));
  })
);
