import { Router } from "express";
import { Medicine } from "../models";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { validate } from "../middleware/validate";
import { medicineSearchSchema, medicineIdSchema } from "../validators/medicines";

export const medicinesRouter = Router();

/**
 * GET /api/medicines
 * List all medicines with optional search and filtering.
 */
medicinesRouter.get(
  "/",
  validate(medicineSearchSchema, "query"),
  asyncHandler(async (req, res) => {
    const { q, therapeuticClass, inStock, limit = 50, offset = 0 } = req.query as any;

    const filter: any = {};

    // Full-text search across brand name, generic name, and therapeutic class
    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [
        { brandName: regex },
        { genericName: regex },
        { therapeuticClass: regex },
        { indication: regex },
      ];
    }

    if (therapeuticClass) {
      filter.therapeuticClass = new RegExp(therapeuticClass, "i");
    }

    if (inStock !== undefined) {
      filter.inStock = inStock;
    }

    const [medicines, total] = await Promise.all([
      Medicine.find(filter)
        .sort({ brandName: 1 })
        .skip(Number(offset))
        .limit(Number(limit))
        .lean(),
      Medicine.countDocuments(filter),
    ]);

    res.json({ data: medicines, total, limit: Number(limit), offset: Number(offset) });
  })
);

/**
 * GET /api/medicines/:id
 * Get a single medicine by ID.
 */
medicinesRouter.get(
  "/:id",
  validate(medicineIdSchema, "params"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const medicine = await Medicine.findById(id).lean();

    if (!medicine) {
      throw new ApiError(404, `Medicine with ID "${id}" not found`);
    }

    res.json(medicine);
  })
);
