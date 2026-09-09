import { Router } from "express";
import { mongoose } from "../db";
import { asyncHandler } from "../middleware/errorHandler";

export const healthRouter = Router();

healthRouter.get(
  "/health",
  asyncHandler(async (_req, res) => {
    // Quick DB connectivity check
    let dbStatus = "unknown";
    try {
      const state = mongoose.connection.readyState;
      dbStatus = state === 1 ? "connected" : state === 2 ? "connecting" : "disconnected";
    } catch {
      dbStatus = "disconnected";
    }

    res.json({
      status: "ok",
      service: "Genmedi Clinical Engine",
      timestamp: new Date().toISOString(),
      aiReady: Boolean(process.env.GEMINI_API_KEY),
      database: dbStatus,
    });
  })
);
