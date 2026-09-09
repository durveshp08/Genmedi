import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User, Session } from "../models";
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists");
    }

    // Check if phone already exists (if provided)
    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        throw new ApiError(409, "An account with this phone number already exists");
      }
    }

    // Check pharmacist reg number uniqueness
    if (pharmacistRegNo) {
      const existingReg = await User.findOne({ pharmacistRegNo });
      if (existingReg) {
        throw new ApiError(409, "This pharmacist registration number is already registered");
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const userDoc = await User.create({
      name,
      email,
      phone: phone || null,
      passwordHash,
      role: role || "patient",
      pharmacistRegNo: pharmacistRegNo || null,
    });

    const user = {
      id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone,
      role: userDoc.role,
      abhaId: userDoc.abhaId,
      pharmacistRegNo: userDoc.pharmacistRegNo,
      pharmacistVerified: userDoc.pharmacistVerified,
      createdAt: userDoc.createdAt,
    };

    // Generate tokens
    const authUser: AuthUser = {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone || null,
      role: userDoc.role,
      abhaId: userDoc.abhaId || null,
      pharmacistRegNo: userDoc.pharmacistRegNo || null,
      pharmacistVerified: userDoc.pharmacistVerified,
    };

    const accessToken = generateAccessToken(authUser);
    const refreshToken = generateRefreshToken(authUser);

    // Store refresh token in session table
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await Session.create({
      token: refreshToken,
      expiresAt,
      userId: userDoc._id,
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
    const userDoc = await User.findOne({ email }).select(
      "name email phone role abhaId pharmacistRegNo pharmacistVerified passwordHash"
    );

    if (!userDoc) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, userDoc.passwordHash);
    if (!validPassword) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Generate tokens
    const authUser: AuthUser = {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone || null,
      role: userDoc.role,
      abhaId: userDoc.abhaId || null,
      pharmacistRegNo: userDoc.pharmacistRegNo || null,
      pharmacistVerified: userDoc.pharmacistVerified,
    };

    const accessToken = generateAccessToken(authUser);
    const refreshToken = generateRefreshToken(authUser);

    // Store refresh token session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await Session.create({
      token: refreshToken,
      expiresAt,
      userId: userDoc._id,
    });

    // Return user without passwordHash
    const safeUser = {
      id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone,
      role: userDoc.role,
      abhaId: userDoc.abhaId,
      pharmacistRegNo: userDoc.pharmacistRegNo,
      pharmacistVerified: userDoc.pharmacistVerified,
    };

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
      await Session.deleteMany({ token: refreshToken }).catch(() => {});
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
    const session = await Session.findOne({
      token: refreshToken,
      userId: decoded.id,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      throw new ApiError(401, "Session expired or revoked — please login again");
    }

    // Get fresh user data
    const userDoc = await User.findById(decoded.id).select(
      "name email phone role abhaId pharmacistRegNo pharmacistVerified"
    );

    if (!userDoc) {
      throw new ApiError(401, "User no longer exists");
    }

    // Generate new access token
    const authUser: AuthUser = {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone || null,
      role: userDoc.role,
      abhaId: userDoc.abhaId || null,
      pharmacistRegNo: userDoc.pharmacistRegNo || null,
      pharmacistVerified: userDoc.pharmacistVerified,
    };
    const newAccessToken = generateAccessToken(authUser);

    res.json({
      accessToken: newAccessToken,
      user: {
        id: userDoc._id,
        name: userDoc.name,
        email: userDoc.email,
        phone: userDoc.phone,
        role: userDoc.role,
        abhaId: userDoc.abhaId,
        pharmacistRegNo: userDoc.pharmacistRegNo,
        pharmacistVerified: userDoc.pharmacistVerified,
      },
    });
  })
);

// ─── GET /me — Get current user profile ─────────────────────
authRouter.get(
  "/me",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    const userDoc = await User.findById(req.user!.id).select("-passwordHash").lean();

    if (!userDoc) {
      throw new ApiError(404, "User not found");
    }

    res.json(userDoc);
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
