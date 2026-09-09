import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler";

export const ocrRouter = Router();

/**
 * POST /api/ocr/parse
 * Prescription OCR Simulation / Parsing Endpoint.
 * Currently returns simulated data — will be replaced with Google Vision API in future.
 */
ocrRouter.post(
  "/parse",
  asyncHandler(async (req, res) => {
    const { fileName } = req.body;

    res.json({
      rxId: "RX-" + Math.floor(100000 + Math.random() * 900000),
      doctor: {
        name: "Dr. S. Bannerjee",
        qualification: "MD (Medicine), Reg #KA-29481",
        clinic: "Apollo Clinic, Indiranagar, Bengaluru",
      },
      patient: {
        name: "Rahul Verma",
        age: 34,
        gender: "Male",
        diagnosis: "Acute Maxillary Bacterial Sinusitis",
        allergies: ["Penicillin (Severe)"],
      },
      extractedMolecules: [
        {
          prescribedBrand: "Augmentin 625 Duo",
          molecule: "Amoxicillin 500mg + Clavulanic Acid 125mg",
          dosage: "1 Tab BD x 5 days",
          brandPrice: 204.0,
          genericSubstitute: "Amoxyclav 625 (WHO-GMP)",
          genericPrice: 64.2,
          savingsPercent: 68,
          bioIndex: 99.8,
          allergyWarning: true,
        },
        {
          prescribedBrand: "Pan-D Capsule",
          molecule: "Pantoprazole 40mg + Domperidone 30mg SR",
          dosage: "1 Cap OD Before Food x 5 days",
          brandPrice: 168.0,
          genericSubstitute: "Pantop-D Generic (NABL Audited)",
          genericPrice: 42.5,
          savingsPercent: 75,
          bioIndex: 99.4,
          allergyWarning: false,
        },
        {
          prescribedBrand: "Allegra 120mg",
          molecule: "Fexofenadine Hydrochloride 120mg",
          dosage: "1 Tab OD at night x 5 days",
          brandPrice: 198.5,
          genericSubstitute: "Fexofenadine 120 Generic",
          genericPrice: 58.0,
          savingsPercent: 71,
          bioIndex: 99.6,
          allergyWarning: false,
        },
      ],
      timestamp: new Date().toISOString(),
    });
  })
);
