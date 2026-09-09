import { Router, Request, Response } from "express";
import { complianceService } from "../services/compliance";
import { asyncHandler } from "../middleware/errorHandler";
import { authenticateToken } from "../middleware/auth";

export const complianceRouter = Router();

// ─── GET /records ─────────────────────────────────────────────
complianceRouter.get(
  "/records",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const { type, limit } = req.query;
    const records = complianceService.getRecords(
      type as "disha" | "cdsco" | "abha" | undefined,
      limit ? parseInt(limit as string) : 100
    );
    res.json({ data: records, total: records.length });
  })
);

// ─── POST /disha/data-access ────────────────────────────────────
complianceRouter.post(
  "/disha/data-access",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const { userId, dataType, purpose } = req.body;
    const record = complianceService.logDataAccess(userId, dataType, purpose);
    res.json({ success: true, record });
  })
);

// ─── POST /abha/link ───────────────────────────────────────────
complianceRouter.post(
  "/abha/link",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const { abhaId, userId, consentGiven } = req.body;
    const record = complianceService.logABHALinkage(abhaId, userId, consentGiven);
    res.json({ success: true, record });
  })
);

// ─── GET /report ───────────────────────────────────────────────
complianceRouter.get(
  "/report",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const report = complianceService.generateReport(
      new Date(startDate as string),
      new Date(endDate as string)
    );
    res.json(report);
  })
);
