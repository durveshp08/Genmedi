import mongoose from "mongoose";
import dotenv from "dotenv";

// This module can be evaluated before the application entry point in ESM.
// Load local development settings here before reading DATABASE_URL.
dotenv.config({ override: process.env.NODE_ENV !== "production" });
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/genmedi";
const RECONNECT_DELAY_MS = 10_000;
let reconnectTimer: NodeJS.Timeout | undefined;

/**
 * Connect without taking down the HTTP API if Atlas is temporarily unavailable.
 * Routes can return a normal error while this module retries in the background,
 * and `/api/health` continues to report the actual connection state.
 */
export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return;
  }

  try {
    await mongoose.connect(DATABASE_URL, { serverSelectionTimeoutMS: 10_000 });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    scheduleReconnect();
  }
}

function scheduleReconnect(): void {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = undefined;
    void connectDatabase();
  }, RECONNECT_DELAY_MS);
  reconnectTimer.unref();
}

// Log disconnection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
  scheduleReconnect();
});

void connectDatabase();

export { mongoose };
