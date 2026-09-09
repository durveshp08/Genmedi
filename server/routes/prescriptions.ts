import { Router } from "express";
import { prisma } from "../db";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { validate } from "../middleware/validate";
import {
  createPrescriptionSchema,
  prescriptionIdSchema,
  verifyPrescriptionSchema,
} from "../validators/prescriptions";
import crypto from "crypto";

export const prescriptionsRouter = Router();

/**
 * Converts a Prisma prescription (with items) to the frontend Prescription type.
 */
function toPrescriptionResponse(rx: any) {
  return {
    id: rx.id,
    doctorName: rx.doctorName,
    doctorRegNo: rx.doctorRegNo,
    doctorClinic: rx.doctorClinic,
    patientName: rx.patientName,
    patientAge: rx.patientAge,
    patientGender: rx.patientGender,
    patientAbhaId: rx.patientAbhaId,
    date: rx.date,
    diagnosis: rx.diagnosis,
    status: rx.status,
    pharmacistSignature: rx.pharmacistName
      ? {
          name: rx.pharmacistName,
          regNo: rx.pharmacistRegNo,
          timestamp: rx.pharmacistTimestamp,
          sha256Hash: rx.pharmacistHash,
        }
      : undefined,
    items: (rx.items || []).map((item: any) => ({
      id: item.id,
      brandName: item.brandName,
      molecule: item.molecule,
      dosage: item.dosage,
      frequency: item.frequency,
      duration: item.duration,
      brandPrice: item.brandPrice,
      genericPrice: item.genericPrice,
      genericSubstitute: item.genericSubstitute,
      savingsPercent: item.savingsPercent,
      bioIndex: item.bioIndex,
      allergyFlag: item.allergyFlag,
    })),
  };
}

/**
 * GET /api/prescriptions
 * List all prescriptions with their items.
 */
prescriptionsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const prescriptions = await prisma.prescription.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      data: prescriptions.map(toPrescriptionResponse),
      total: prescriptions.length,
    });
  })
);

/**
 * GET /api/prescriptions/:id
 * Get a single prescription with its items.
 */
prescriptionsRouter.get(
  "/:id",
  validate(prescriptionIdSchema, "params"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const rx = await prisma.prescription.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!rx) {
      throw new ApiError(404, `Prescription with ID "${id}" not found`);
    }

    res.json(toPrescriptionResponse(rx));
  })
);

/**
 * POST /api/prescriptions
 * Create a new prescription with items.
 */
prescriptionsRouter.post(
  "/",
  validate(createPrescriptionSchema, "body"),
  asyncHandler(async (req, res) => {
    const { items, ...rxData } = req.body;

    const rx = await prisma.prescription.create({
      data: {
        ...rxData,
        status: "pending_review",
        items: {
          create: items,
        },
      },
      include: { items: true },
    });

    res.status(201).json(toPrescriptionResponse(rx));
  })
);

/**
 * PATCH /api/prescriptions/:id/verify
 * Verify a prescription with pharmacist signature.
 */
prescriptionsRouter.patch(
  "/:id/verify",
  validate(prescriptionIdSchema, "params"),
  validate(verifyPrescriptionSchema, "body"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { pharmacistName, pharmacistRegNo } = req.body;

    const existing = await prisma.prescription.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, `Prescription with ID "${id}" not found`);
    }

    const timestamp = new Date().toISOString();
    const hashInput = `${id}:${pharmacistName}:${pharmacistRegNo}:${timestamp}`;
    const sha256Hash = crypto.createHash("sha256").update(hashInput).digest("hex");

    const rx = await prisma.prescription.update({
      where: { id },
      data: {
        status: "verified",
        pharmacistName,
        pharmacistRegNo,
        pharmacistTimestamp: timestamp,
        pharmacistHash: sha256Hash,
      },
      include: { items: true },
    });

    res.json(toPrescriptionResponse(rx));
  })
);
