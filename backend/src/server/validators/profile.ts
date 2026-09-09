import { z } from "zod";

export const allergyCreateSchema = z.object({
  allergen: z.string().min(1, "Allergen name is required").max(200),
  severity: z.enum(["mild", "moderate", "severe"]),
  notes: z.string().max(500).optional(),
});

export const addressCreateSchema = z.object({
  label: z.string().min(1, "Label is required").max(50), // "Home", "Office", etc.
  address: z.string().min(5, "Address is required").max(500),
  city: z.string().min(1, "City is required").max(100),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  isDefault: z.boolean().optional().default(false),
});

export const addressUpdateSchema = z.object({
  label: z.string().min(1).max(50).optional(),
  address: z.string().min(5).max(500).optional(),
  city: z.string().min(1).max(100).optional(),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits").optional(),
  isDefault: z.boolean().optional(),
});
