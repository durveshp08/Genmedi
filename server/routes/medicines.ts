import { Router } from "express";
import { prisma } from "../db";
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
    const { q, therapeuticClass, inStock, limit, offset } = req.query as any;

    const where: any = {};

    // Full-text search across brand name, generic name, and therapeutic class
    if (q) {
      where.OR = [
        { brandName: { contains: q } },
        { genericName: { contains: q } },
        { therapeuticClass: { contains: q } },
        { indication: { contains: q } },
      ];
    }

    if (therapeuticClass) {
      where.therapeuticClass = { contains: therapeuticClass };
    }

    if (inStock !== undefined) {
      where.inStock = inStock;
    }

    const [medicines, total] = await Promise.all([
      prisma.medicine.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { brandName: "asc" },
      }),
      prisma.medicine.count({ where }),
    ]);

    // Parse allergenFlags from JSON string back to array
    const parsed = medicines.map((m) => ({
      ...m,
      allergenFlags: m.allergenFlags ? JSON.parse(m.allergenFlags) : undefined,
    }));

    res.json({ data: parsed, total, limit, offset });
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

    const medicine = await prisma.medicine.findUnique({ where: { id } });

    if (!medicine) {
      throw new ApiError(404, `Medicine with ID "${id}" not found`);
    }

    res.json({
      ...medicine,
      allergenFlags: medicine.allergenFlags
        ? JSON.parse(medicine.allergenFlags)
        : undefined,
    });
  })
);
