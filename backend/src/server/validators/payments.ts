import { z } from "zod";

export const createOrderSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("INR"),
  receipt: z.string().optional(),
  notes: z.record(z.string(), z.any()).optional(),
});

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export const refundSchema = z.object({
  paymentId: z.string(),
  amount: z.number().positive().optional(),
});
