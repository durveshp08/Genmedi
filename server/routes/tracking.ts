import { Router, Request, Response } from "express";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { authenticateToken } from "../middleware/auth";
import { getTrackingServer } from "../websocket/tracking";

export const trackingRouter = Router();

// ─── POST /update-location ─────────────────────────────────
trackingRouter.post(
  "/update-location",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const { orderId, lat, lng, speedKmh, temperature, etaMinutes } = req.body;

    if (!orderId || !lat || !lng) {
      throw new ApiError(400, "orderId, lat, and lng are required");
    }

    const trackingServer = getTrackingServer();
    trackingServer.updateRider(orderId, {
      orderId,
      lat,
      lng,
      speedKmh: speedKmh || 0,
      temperature: temperature || 4,
      etaMinutes: etaMinutes || 15,
      timestamp: Date.now(),
    });

    res.json({ success: true, message: "Location updated" });
  })
);

// ─── GET /location/:orderId ───────────────────────────────────
trackingRouter.get(
  "/location/:orderId",
  asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.params;

    // Return current location (in production, this would query the database)
    res.json({
      orderId,
      lat: 12.9716,
      lng: 77.5946,
      speedKmh: 20,
      temperature: 4.2,
      etaMinutes: 15,
      timestamp: Date.now(),
    });
  })
);
