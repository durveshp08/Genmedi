import mongoose, { Schema, Document, Types } from "mongoose";

// ─── UserAllergy subdocument ───────────────────────────────
export interface IUserAllergy {
  _id: Types.ObjectId;
  allergen: string;
  severity: string;
  notes?: string;
}

const UserAllergySchema = new Schema<IUserAllergy>({
  allergen: { type: String, required: true },
  severity: { type: String, required: true },
  notes: { type: String, default: null },
});

// ─── UserAddress subdocument ───────────────────────────────
export interface IUserAddress {
  _id: Types.ObjectId;
  label: string;
  address: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

const UserAddressSchema = new Schema<IUserAddress>({
  label: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

// ─── User document ─────────────────────────────────────────
export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
  role: string;
  age?: number | null;
  gender?: string | null;
  abhaId?: string | null;
  avatarUrl?: string | null;
  pharmacistRegNo?: string | null;
  pharmacistLicense?: string | null;
  pharmacistVerified: boolean;
  allergies: IUserAllergy[];
  addresses: IUserAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: null, sparse: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "patient" },
    age: { type: Number, default: null },
    gender: { type: String, default: null },
    abhaId: { type: String, default: null, sparse: true },
    avatarUrl: { type: String, default: null },
    pharmacistRegNo: { type: String, default: null, sparse: true },
    pharmacistLicense: { type: String, default: null },
    pharmacistVerified: { type: Boolean, default: false },
    allergies: { type: [UserAllergySchema], default: [] },
    addresses: { type: [UserAddressSchema], default: [] },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
