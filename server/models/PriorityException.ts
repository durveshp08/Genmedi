import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPriorityException extends Document {
  type: string;
  severity: string;
  description: string;
  slaRemainingMins: number;
  riderName?: string;
  status: string;
  timestamp: string;
  orderId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PriorityExceptionSchema = new Schema<IPriorityException>(
  {
    type: { type: String, required: true },
    severity: { type: String, required: true },
    description: { type: String, required: true },
    slaRemainingMins: { type: Number, required: true },
    riderName: { type: String, default: null },
    status: { type: String, default: "active" },
    timestamp: { type: String, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  },
  { timestamps: true }
);

PriorityExceptionSchema.index({ status: 1, slaRemainingMins: 1 });

export const PriorityException = mongoose.model<IPriorityException>(
  "PriorityException",
  PriorityExceptionSchema
);
