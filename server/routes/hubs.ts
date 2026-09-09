import { Router } from "express";
import { prisma } from "../db";
import { asyncHandler, ApiError } from "../middleware/errorHandler";

export const hubsRouter = Router();

/**
 * GET /api/hubs
 * List all stockist hubs, optionally sorted by distance.
 */
hubsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const hubs = await prisma.stockistHub.findMany({
      orderBy: { distanceKm: "asc" },
    });

    res.json({ data: hubs, total: hubs.length });
  })
);

/**
 * GET /api/hubs/:id
 * Get a single stockist hub by ID.
 */
hubsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const hub = await prisma.stockistHub.findUnique({ where: { id } });

    if (!hub) {
      throw new ApiError(404, `Stockist hub with ID "${id}" not found`);
    }

    res.json(hub);
  })
);
