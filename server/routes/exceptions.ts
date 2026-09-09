import { Router } from "express";
import { prisma } from "../db";
import { asyncHandler, ApiError } from "../middleware/errorHandler";

export const exceptionsRouter = Router();

/**
 * Converts a Prisma exception to the frontend PriorityException type.
 */
function toExceptionResponse(exc: any) {
  return {
    id: exc.id,
    orderId: exc.orderId,
    hub: exc.order?.hubName ?? "Unknown Hub",
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
    const exceptions = await prisma.priorityException.findMany({
      where: { status: { not: "resolved" } },
      include: { order: { select: { hubName: true } } },
      orderBy: { slaRemainingMins: "asc" },
    });

    res.json({
      data: exceptions.map(toExceptionResponse),
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
    const exceptions = await prisma.priorityException.findMany({
      include: { order: { select: { hubName: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      data: exceptions.map(toExceptionResponse),
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

    const existing = await prisma.priorityException.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, `Exception with ID "${id}" not found`);
    }

    const exception = await prisma.priorityException.update({
      where: { id },
      data: { status: "resolved" },
      include: { order: { select: { hubName: true } } },
    });

    res.json(toExceptionResponse(exception));
  })
);
