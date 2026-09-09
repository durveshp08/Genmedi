import { Router } from "express";
import { prisma } from "../db";
import { asyncHandler, ApiError } from "../middleware/errorHandler";

export const dissolutionRouter = Router();

/**
 * GET /api/dissolution/:medicineId
 * Get dissolution curve data for a specific medicine.
 */
dissolutionRouter.get(
  "/:medicineId",
  asyncHandler(async (req, res) => {
    const { medicineId } = req.params;

    // Verify medicine exists
    const medicine = await prisma.medicine.findUnique({ where: { id: medicineId } });
    if (!medicine) {
      throw new ApiError(404, `Medicine with ID "${medicineId}" not found`);
    }

    const data = await prisma.dissolutionData.findMany({
      where: { medicineId },
      orderBy: { timeMinutes: "asc" },
      select: {
        timeMinutes: true,
        innovatorRelease: true,
        genericRelease: true,
        toleranceLower: true,
        toleranceUpper: true,
      },
    });

    res.json({
      medicineId,
      medicineName: medicine.brandName,
      data,
    });
  })
);
