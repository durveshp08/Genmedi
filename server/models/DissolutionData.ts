import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDissolutionData extends Document {
  timeMinutes: number;
  innovatorRelease: number;
  genericRelease: number;
  toleranceLower: number;
  toleranceUpper: number;
  medicineId: Types.ObjectId;
}

const DissolutionDataSchema = new Schema<IDissolutionData>({
  timeMinutes: { type: Number, required: true },
  innovatorRelease: { type: Number, required: true },
  genericRelease: { type: Number, required: true },
  toleranceLower: { type: Number, required: true },
  toleranceUpper: { type: Number, required: true },
  medicineId: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
});

// Compound unique index matching the Prisma @@unique
DissolutionDataSchema.index({ medicineId: 1, timeMinutes: 1 }, { unique: true });

export const DissolutionData = mongoose.model<IDissolutionData>(
  "DissolutionData",
  DissolutionDataSchema
);
