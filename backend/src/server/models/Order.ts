import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrderStage {
  title: string;
  time: string;
  completed: boolean;
  active: boolean;
  description: string;
}

export interface IOrder extends Document {
  status: string;
  etaMinutes: number;
  riderName: string;
  riderPhone: string;
  riderRating: number;
  vehicle: string;
  currentSpeedKmh: number;
  boxTemperatureCelsius: number;
  handoverOtp: string;
  hubName: string;
  hubAddress: string;
  customerAddress: string;
  tamperSealBarcode: string;
  stages: IOrderStage[];
  prescriptionId?: Types.ObjectId | string | null;
  createdAt: Date;
  updatedAt: Date;
}

const OrderStageSchema = new Schema<IOrderStage>(
  {
    title: { type: String, required: true },
    time: { type: String, required: true },
    completed: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    description: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    status: { type: String, default: "order_placed" },
    etaMinutes: { type: Number, required: true },
    riderName: { type: String, required: true },
    riderPhone: { type: String, default: "" },
    riderRating: { type: Number, default: 0 },
    vehicle: { type: String, required: true },
    currentSpeedKmh: { type: Number, default: 0 },
    boxTemperatureCelsius: { type: Number, default: 4.0 },
    handoverOtp: { type: String, required: true },
    hubName: { type: String, required: true },
    hubAddress: { type: String, default: "" },
    customerAddress: { type: String, required: true },
    tamperSealBarcode: { type: String, required: true },
    stages: { type: [OrderStageSchema], default: [] },
    prescriptionId: { type: Schema.Types.ObjectId, ref: "Prescription", default: null },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
