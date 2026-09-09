import { Router, Request, Response } from "express";
import Razorpay from "razorpay";
import { prisma } from "../db";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { validate } from "../middleware/validate";
import { authenticateToken } from "../middleware/auth";
import { createOrderSchema } from "../validators/payments";

export const paymentsRouter = Router();

// ─── Razorpay Instance ──────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "secret_placeholder",
});

// ─── POST /create-order ─────────────────────────────────────
paymentsRouter.post(
  "/create-order",
  authenticateToken,
  validate(createOrderSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { amount, currency = "INR", receipt, notes } = req.body;

    // Calculate pricing
    const subtotal = amount;
    const deliveryFee = subtotal >= 500 ? 0 : 49; // Free delivery above ₹500
    const gst = Math.round((subtotal + deliveryFee) * 0.18); // 18% GST
    const total = subtotal + deliveryFee + gst;

    // Create Razorpay order
    const options = {
      amount: total * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `genmedi_${Date.now()}`,
      notes: {
        ...notes,
        userId: req.user?.id,
        deliveryFee,
        gst,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      subtotal,
      deliveryFee,
      gst,
      total,
    });
  })
);

// ─── POST /verify-payment ───────────────────────────────────
paymentsRouter.post(
  "/verify-payment",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify signature
    const crypto = require("crypto");
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      throw new ApiError(400, "Invalid payment signature");
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpayPaymentId);

    if (payment.status !== "captured") {
      throw new ApiError(400, "Payment not captured");
    }

    res.json({
      success: true,
      paymentId: payment.id,
      amount: payment.amount,
      status: payment.status,
    });
  })
);

// ─── POST /refund ────────────────────────────────────────────
paymentsRouter.post(
  "/refund",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const { paymentId, amount } = req.body;

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? amount * 100 : undefined, // Amount in paise if specified
    });

    res.json({
      refundId: refund.id,
      amount: refund.amount,
      status: refund.status,
    });
  })
);

// ─── GET /pricing ───────────────────────────────────────────
paymentsRouter.get(
  "/pricing",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const { subtotal, deliverySpeed = "standard" } = req.query;

    const subtotalNum = Number(subtotal) || 0;
    const deliveryFee = deliverySpeed === "fast_45" ? 99 : subtotalNum >= 500 ? 0 : 49;
    const gst = Math.round((subtotalNum + deliveryFee) * 0.18);
    const total = subtotalNum + deliveryFee + gst;

    res.json({
      subtotal: subtotalNum,
      deliveryFee,
      gst,
      total,
      savings: subtotalNum > 0 ? Math.round((subtotalNum * 0.7)) : 0, // Assuming 70% savings with generics
    });
  })
);
