import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

// Database connection (MongoDB via Mongoose)
import "./server/db";

// Route modules
import { healthRouter } from "./server/routes/health";
import { medicinesRouter } from "./server/routes/medicines";
import { hubsRouter } from "./server/routes/hubs";
import { prescriptionsRouter } from "./server/routes/prescriptions";
import { ordersRouter } from "./server/routes/orders";
import { exceptionsRouter } from "./server/routes/exceptions";
import { pharmacistRouter } from "./server/routes/pharmacist";
import { ocrRouter } from "./server/routes/ocr";
import { dissolutionRouter } from "./server/routes/dissolution";
import { authRouter } from "./server/routes/auth";
import { profileRouter } from "./server/routes/profile";
import { paymentsRouter } from "./server/routes/payments";
import { trackingRouter } from "./server/routes/tracking";
import { ridersRouter } from "./server/routes/riders";
import { interactionsRouter } from "./server/routes/interactions";
import { complianceRouter } from "./server/routes/compliance";
import { getTrackingServer } from "./server/websocket/tracking";

// Middleware
import { errorHandler } from "./server/middleware/errorHandler";
import { auditLogger } from "./server/middleware/audit";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Initialize WebSocket tracking server
const trackingServer = getTrackingServer();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// ─── Security & Audit Middleware ─────────────────────────────
app.use(auditLogger);

// ─── API Routes ─────────────────────────────────────────────
app.use("/api", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/medicines", medicinesRouter);
app.use("/api/hubs", hubsRouter);
app.use("/api/prescriptions", prescriptionsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/exceptions", exceptionsRouter);
app.use("/api/pharmacist", pharmacistRouter);
app.use("/api/ocr", ocrRouter);
app.use("/api/dissolution", dissolutionRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/tracking", trackingRouter);
app.use("/api/riders", ridersRouter);
app.use("/api/interactions", interactionsRouter);
app.use("/api/compliance", complianceRouter);

// ─── Global Error Handler (must be after routes) ────────────
app.use(errorHandler);

// ─── Vite Middleware or Static Serving ──────────────────────
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Genmedi fullstack server running on http://localhost:${PORT}`);
  });
}

startServer();
