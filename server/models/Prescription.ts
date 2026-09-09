import mongoose, { Schema, Document, Types } from "mongoose";

// ─── PrescriptionItem subdocument ──────────────────────────
export interface IPrescriptionItem {
  _id: Types.ObjectId;
  brandName: string;
  molecule: string;
  dosage: string;
  frequency: string;
  duration: string;
  brandPrice: number;
  genericPrice: number;
  genericSubstitute: string;
  savingsPercent: number;
  bioIndex: number;
  allergyFlag: boolean;
  createdAt: Date;
}

const PrescriptionItemSchema = new Schema<IPrescriptionItem>(
  {
    brandName: { type: String, required: true },
    molecule: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    brandPrice: { type: Number, required: true },
    genericPrice: { type: Number, required: true },
    genericSubstitute: { type: String, required: true },
    savingsPercent: { type: Number, required: true },
    bioIndex: { type: Number, required: true },
    allergyFlag: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// ─── Prescription document ─────────────────────────────────
export interface IPrescription extends Document {
  doctorName: string;
  doctorRegNo: string;
  doctorClinic: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientAbhaId: string;
  date: string;
  diagnosis: string;
  status: string;
  pharmacistName?: string;
  pharmacistRegNo?: string;
  pharmacistTimestamp?: string;
  pharmacistHash?: string;
  items: IPrescriptionItem[];
  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionSchema = new Schema<IPrescription>(
  {
    doctorName: { type: String, required: true },
    doctorRegNo: { type: String, required: true },
    doctorClinic: { type: String, required: true },
    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true },
    patientGender: { type: String, required: true },
    patientAbhaId: { type: String, required: true },
    date: { type: String, required: true },
    diagnosis: { type: String, required: true },
    status: { type: String, default: "pending_review" },
    pharmacistName: { type: String, default: null },
    pharmacistRegNo: { type: String, default: null },
    pharmacistTimestamp: { type: String, default: null },
    pharmacistHash: { type: String, default: null },
    items: { type: [PrescriptionItemSchema], default: [] },
  },
  { timestamps: true }
);

export const Prescription = mongoose.model<IPrescription>("Prescription", PrescriptionSchema);
