import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+91[6-9]\d{9}$/, "Phone must be Indian mobile (+91XXXXXXXXXX)")
    .optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128),
  role: z
    .enum(["patient", "pharmacist", "admin", "rider"])
    .default("patient"),
  // Pharmacist-specific
  pharmacistRegNo: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const otpVerifySchema = z.object({
  phone: z.string().min(10),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  age: z.number().int().min(1).max(150).optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  abhaId: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+91[6-9]\d{9}$/, "Phone must be Indian mobile (+91XXXXXXXXXX)")
    .optional(),
});
