import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { validate } from "../middleware/validate";
import {
  authenticateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  AuthUser,
} from "../middleware/auth";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  otpVerifySchema,
} from "../validators/auth";

export const authRouter = Router();

// ─── POST /register — Create new user account ──────────────
authRouter.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone, password, role, pharmacistRegNo } = req.body;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists");
    }

    // Check if phone already exists (if provided)
    if (phone) {
      const existingPhone = await prisma.user.findFirst({ where: { phone } });
      if (existingPhone) {
        throw new ApiError(409, "An account with this phone number already exists");
      }
    }

    // Check pharmacist reg number uniqueness
    if (pharmacistRegNo) {
      const existingReg = await prisma.user.findFirst({
        where: { pharmacistRegNo },
      });
      if (existingReg) {
        throw new ApiError(409, "This pharmacist registration number is already registered");
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        role: role || "patient",
        pharmacistRegNo: pharmacistRegNo || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        abhaId: true,
        pharmacistRegNo: true,
        pharmacistVerified: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      abhaId: user.abhaId,
      pharmacistRegNo: user.pharmacistRegNo,
      pharmacistVerified: user.pharmacistVerified,
    };

    const accessToken = generateAccessToken(authUser);
    const refreshToken = generateRefreshToken(authUser);

    // Store refresh token in session table
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await prisma.session.create({
      data: {
        token: refreshToken,
        expiresAt,
        userId: user.id,
      },
    });

    res.status(201).json({
      user,
      accessToken,
      refreshToken,
    });
  })
);

// ─── POST /login — Authenticate user ───────────────────────
authRouter.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        abhaId: true,
        pharmacistRegNo: true,
        pharmacistVerified: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Generate tokens
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      abhaId: user.abhaId,
      pharmacistRegNo: user.pharmacistRegNo,
      pharmacistVerified: user.pharmacistVerified,
    };

    const accessToken = generateAccessToken(authUser);
    const refreshToken = generateRefreshToken(authUser);

    // Store refresh token session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.session.create({
      data: {
        token: refreshToken,
        expiresAt,
        userId: user.id,
      },
    });

    // Return user without passwordHash
    const { passwordHash: _, ...safeUser } = user;

    res.json({
      user: safeUser,
      accessToken,
      refreshToken,
    });
  })
);

// ─── POST /logout — Invalidate session ─────────────────────
authRouter.post(
  "/logout",
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Delete the session associated with this refresh token
      await prisma.session
        .deleteMany({ where: { token: refreshToken } })
        .catch(() => {});
    }

    res.json({ message: "Logged out successfully" });
  })
);

// ─── POST /refresh — Exchange refresh token for new access token ───
authRouter.post(
  "/refresh",
  validate(refreshSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    // Verify refresh token signature
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    // Check if session exists and is not expired
    const session = await prisma.session.findFirst({
      where: {
        token: refreshToken,
        userId: decoded.id,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session) {
      throw new ApiError(401, "Session expired or revoked — please login again");
    }

    // Get fresh user data
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        abhaId: true,
        pharmacistRegNo: true,
        pharmacistVerified: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    // Generate new access token
    const authUser: AuthUser = user;
    const newAccessToken = generateAccessToken(authUser);

    res.json({
      accessToken: newAccessToken,
      user,
    });
  })
);

// ─── GET /me — Get current user profile ─────────────────────
authRouter.get(
  "/me",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        age: true,
        gender: true,
        abhaId: true,
        avatarUrl: true,
        pharmacistRegNo: true,
        pharmacistLicense: true,
        pharmacistVerified: true,
        allergies: true,
        addresses: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.json(user);
  })
);

// ─── POST /verify-otp — Simulated OTP verification ─────────
authRouter.post(
  "/verify-otp",
  validate(otpVerifySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { phone, otp } = req.body;

    // In development, accept "123456" as the valid OTP
    // In production, this would verify against an OTP service (Twilio/MSG91)
    const isValid = otp === "123456";

    if (!isValid) {
      throw new ApiError(400, "Invalid OTP code");
    }

    console.log(`[OTP] Verified OTP for phone ${phone} (simulated)`);

    res.json({
      verified: true,
      phone,
      message: "Phone number verified successfully",
    });
  })
);
