import { Router } from "express";
import { StockistHub } from "../models";
import { asyncHandler, ApiError } from "../middleware/errorHandler";

export const hubsRouter = Router();

/**
 * GET /api/hubs
 * List all stockist hubs, optionally sorted by distance.
 */
hubsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const hubs = await StockistHub.find().sort({ distanceKm: 1 }).lean();

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

    const hub = await StockistHub.findById(id).lean();

    if (!hub) {
      throw new ApiError(404, `Stockist hub with ID "${id}" not found`);
    }

    res.json(hub);
  })
);
