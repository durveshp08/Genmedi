import { Router } from "express";
import { Medicine, DissolutionData } from "../models";
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
    const medicine = await Medicine.findById(medicineId).lean();
    if (!medicine) {
      throw new ApiError(404, `Medicine with ID "${medicineId}" not found`);
    }

    const data = await DissolutionData.find({ medicineId })
      .sort({ timeMinutes: 1 })
      .select("timeMinutes innovatorRelease genericRelease toleranceLower toleranceUpper -_id")
      .lean();

    res.json({
      medicineId,
      medicineName: medicine.brandName,
      data,
    });
  })
);
