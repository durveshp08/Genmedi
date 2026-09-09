import mongoose, { Schema, Document } from "mongoose";

export interface IStockistHub extends Document {
  name: string;
  address: string;
  distanceKm: number;
  fastDeliveryAvailable: boolean;
  estimatedDeliveryMins: number;
  inStockQuantity: number;
  rating: number;
  verifiedByCdsco: boolean;
  pricePerStrip: number;
  createdAt: Date;
  updatedAt: Date;
}

const StockistHubSchema = new Schema<IStockistHub>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    distanceKm: { type: Number, required: true },
    fastDeliveryAvailable: { type: Boolean, default: false },
    estimatedDeliveryMins: { type: Number, required: true },
    inStockQuantity: { type: Number, required: true },
    rating: { type: Number, required: true },
    verifiedByCdsco: { type: Boolean, default: true },
    pricePerStrip: { type: Number, required: true },
  },
  { timestamps: true }
);

export const StockistHub = mongoose.model<IStockistHub>("StockistHub", StockistHubSchema);
