import { z } from "zod";

/** Body for POST /api/prescriptions */
export const createPrescriptionSchema = z.object({
  doctorName: z.string().min(1, "Doctor name is required"),
  doctorRegNo: z.string().min(1, "Doctor registration number is required"),
  doctorClinic: z.string().min(1, "Clinic name is required"),
  patientName: z.string().min(1, "Patient name is required"),
  patientAge: z.number().int().min(0).max(150),
  patientGender: z.string().min(1),
  patientAbhaId: z.string().min(1, "ABHA ID is required"),
  date: z.string().min(1),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  items: z
    .array(
      z.object({
        brandName: z.string().min(1),
        molecule: z.string().min(1),
        dosage: z.string().min(1),
        frequency: z.string().min(1),
        duration: z.string().min(1),
        brandPrice: z.number().min(0),
        genericPrice: z.number().min(0),
        genericSubstitute: z.string().min(1),
        savingsPercent: z.number().min(0).max(100),
        bioIndex: z.number().min(0).max(100),
        allergyFlag: z.boolean().optional().default(false),
      })
    )
    .min(1, "At least one prescription item is required"),
});

/** Path parameters for GET/PATCH /api/prescriptions/:id */
export const prescriptionIdSchema = z.object({
  id: z.string().min(1, "Prescription ID is required"),
});

/** Body for PATCH /api/prescriptions/:id/verify */
export const verifyPrescriptionSchema = z.object({
  pharmacistName: z.string().min(1, "Pharmacist name is required"),
  pharmacistRegNo: z.string().min(1, "Registration number is required"),
});
