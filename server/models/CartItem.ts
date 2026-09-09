import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICartItem extends Document {
  quantity: number;
  isGeneric: boolean;
  sessionId: string;
  medicineId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    quantity: { type: Number, default: 1 },
    isGeneric: { type: Boolean, default: true },
    sessionId: { type: String, required: true },
    medicineId: { type: Schema.Types.ObjectId, ref: "Medicine", required: true },
  },
  { timestamps: true }
);

// Compound unique index matching the Prisma @@unique
CartItemSchema.index({ sessionId: 1, medicineId: 1, isGeneric: 1 }, { unique: true });

export const CartItem = mongoose.model<ICartItem>("CartItem", CartItemSchema);
