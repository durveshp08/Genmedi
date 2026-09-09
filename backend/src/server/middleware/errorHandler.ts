import { Request, Response, NextFunction } from "express";

/**
 * Global error handler middleware.
 * Must be registered AFTER all route handlers.
 * Catches thrown errors and unhandled promise rejections from async routes.
 */
export function errorHandler(
  err: Error & { statusCode?: number; details?: unknown },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode ?? 500;
  const message = err.message || "Internal server error";

  console.error(`[API Error] ${statusCode} — ${message}`, err.stack);

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err.details,
    }),
  });
}

/**
 * Wraps an async route handler to automatically catch errors
 * and forward them to the error handler middleware.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Creates a custom API error with a status code.
 */
export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "ApiError";
  }
}
