import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";

// ─── Extend Express Request ────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  abhaId: string | null;
  pharmacistRegNo: string | null;
  pharmacistVerified: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "genmedi-dev-secret-key-change-in-production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "genmedi-dev-refresh-secret-change-in-production";

// ─── Generate Tokens ────────────────────────────────────────

export function generateAccessToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
}

export function generateRefreshToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyAccessToken(token: string): jwt.JwtPayload {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
}

export function verifyRefreshToken(token: string): jwt.JwtPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as jwt.JwtPayload;
}

// ─── Middleware: Authenticate Token ─────────────────────────

/**
 * Verifies the JWT access token from Authorization header.
 * Attaches the full user object to req.user.
 * Returns 401 if token is missing or invalid.
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = verifyAccessToken(token);

    User.findById(decoded.id)
      .select("name email phone role abhaId pharmacistRegNo pharmacistVerified")
      .lean()
      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }
        req.user = {
          id: (user as any)._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || null,
          role: user.role,
          abhaId: user.abhaId || null,
          pharmacistRegNo: user.pharmacistRegNo || null,
          pharmacistVerified: user.pharmacistVerified,
        };
        next();
      })
      .catch((err) => {
        console.error("[Auth] Database error:", err);
        return res.status(500).json({ error: "Authentication failed" });
      });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired", code: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}

// ─── Middleware: Optional Auth ──────────────────────────────

/**
 * Like authenticateToken, but doesn't reject if no token is present.
 * If a valid token is provided, attaches user to req.user.
 * If no token or invalid token, continues without user.
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);

    User.findById(decoded.id)
      .select("name email phone role abhaId pharmacistRegNo pharmacistVerified")
      .lean()
      .then((user) => {
        if (user) {
          req.user = {
            id: (user as any)._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone || null,
            role: user.role,
            abhaId: user.abhaId || null,
            pharmacistRegNo: user.pharmacistRegNo || null,
            pharmacistVerified: user.pharmacistVerified,
          };
        }
        next();
      })
      .catch(() => {
        next();
      });
  } catch {
    next();
  }
}

// ─── Middleware: Require Role ────────────────────────────────

/**
 * Checks that the authenticated user has one of the specified roles.
 * Must be used AFTER authenticateToken middleware.
 *
 * Usage: requireRole("admin", "pharmacist")
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Insufficient permissions",
        requiredRoles: roles,
        currentRole: req.user.role,
      });
    }

    next();
  };
}
