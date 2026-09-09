import { Router, Request, Response } from "express";
import { interactionEngine } from "../services/drugInteractions";
import { asyncHandler } from "../middleware/errorHandler";
import { z } from "zod";

export const interactionsRouter = Router();

const checkInteractionsSchema = z.object({
  medications: z.array(z.string()).min(2, "At least 2 medications required"),
});

// ─── POST /check ───────────────────────────────────────────────
interactionsRouter.post(
  "/check",
  asyncHandler(async (req: Request, res: Response) => {
    const { medications } = checkInteractionsSchema.parse(req.body);

    const interactions = interactionEngine.checkInteractions(medications);

    res.json({
      medications,
      interactions: interactions.map((i) => ({
        ...i,
        severityLabel: interactionEngine.getSeverityLabel(i.severity),
        severityColor: interactionEngine.getSeverityColor(i.severity),
      })),
      total: interactions.length,
      hasContraindications: interactions.some((i) => i.severity === "contraindicated"),
      hasMajor: interactions.some((i) => i.severity === "major"),
    });
  })
);

// ─── GET /severity-levels ───────────────────────────────────────
interactionsRouter.get(
  "/severity-levels",
  asyncHandler(async (_req: Request, res: Response) => {
    res.json({
      severities: [
        { value: "contraindicated", label: "Contraindicated", description: "Do not use together - life-threatening risk" },
        { value: "major", label: "Major", description: "Significant interaction - may require therapy modification" },
        { value: "moderate", label: "Moderate", description: "Potential interaction - monitor closely" },
        { value: "minor", label: "Minor", description: "Minimal clinical significance" },
        { value: "unknown", label: "Unknown", description: "Insufficient data available" },
      ],
    });
  })
);
