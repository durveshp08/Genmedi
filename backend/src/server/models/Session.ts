import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISession extends Document {
  token: string;
  expiresAt: Date;
  userId: Types.ObjectId;
  createdAt: Date;
}

const SessionSchema = new Schema<ISession>({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

// TTL index for automatic session cleanup
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model<ISession>("Session", SessionSchema);
