import mongoose, { Schema, Document } from "mongoose";

export interface IMedicine extends Document {
  brandName: string;
  brandManufacturer: string;
  brandPrice: number;
  genericName: string;
  genericManufacturer: string;
  genericPrice: number;
  dosage: string;
  therapeuticClass: string;
  indication: string;
  bioIndex: number;
  savingsPercent: number;
  inStock: boolean;
  whoGmpCertified: boolean;
  nablAudited: boolean;
  cdscoApproved: boolean;
  dissolutionTimeMinutes: number;
  aucRatio: number;
  cmaxRatio: number;
  allergenFlags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    brandName: { type: String, required: true },
    brandManufacturer: { type: String, required: true },
    brandPrice: { type: Number, required: true },
    genericName: { type: String, required: true },
    genericManufacturer: { type: String, required: true },
    genericPrice: { type: Number, required: true },
    dosage: { type: String, required: true },
    therapeuticClass: { type: String, required: true },
    indication: { type: String, required: true },
    bioIndex: { type: Number, required: true },
    savingsPercent: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    whoGmpCertified: { type: Boolean, default: true },
    nablAudited: { type: Boolean, default: true },
    cdscoApproved: { type: Boolean, default: true },
    dissolutionTimeMinutes: { type: Number, required: true },
    aucRatio: { type: Number, required: true },
    cmaxRatio: { type: Number, required: true },
    allergenFlags: { type: [String], default: undefined },
  },
  { timestamps: true }
);

// Text index for search
MedicineSchema.index({
  brandName: "text",
  genericName: "text",
  therapeuticClass: "text",
  indication: "text",
});

export const Medicine = mongoose.model<IMedicine>("Medicine", MedicineSchema);
