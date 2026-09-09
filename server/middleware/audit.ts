import { Request, Response, NextFunction } from "express";

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId?: string;
  userRole?: string;
  action: string;
  method: string;
  path: string;
  ip: string;
  userAgent: string;
  statusCode: number;
  responseTime: number;
}

const auditLogs: AuditLog[] = [];

export function auditLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const userId = (req as any).user?.id;
  const userRole = (req as any).user?.role;

  // Capture original json method
  const originalJson = res.json;

  res.json = function (body) {
    const responseTime = Date.now() - startTime;
    
    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId,
      userRole,
      action: `${req.method} ${req.path}`,
      method: req.method,
      path: req.path,
      ip: req.ip || req.socket.remoteAddress || "unknown",
      userAgent: req.get("user-agent") || "unknown",
      statusCode: res.statusCode,
      responseTime,
    };

    auditLogs.push(log);
    console.log(`[AUDIT] ${log.action} - User: ${userId || "anonymous"} - ${responseTime}ms`);

    return originalJson.call(this, body);
  };

  next();
}

export function getAuditLogs(limit = 100) {
  return auditLogs.slice(-limit).reverse();
}

export function getAuditLogsByUser(userId: string, limit = 50) {
  return auditLogs.filter((log) => log.userId === userId).slice(-limit).reverse();
}
