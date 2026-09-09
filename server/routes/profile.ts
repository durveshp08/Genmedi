import { Router, Request, Response } from "express";
import { prisma } from "../db";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { validate } from "../middleware/validate";
import { authenticateToken } from "../middleware/auth";
import { updateProfileSchema } from "../validators/auth";
import {
  allergyCreateSchema,
  addressCreateSchema,
  addressUpdateSchema,
} from "../validators/profile";

export const profileRouter = Router();

// All profile routes require authentication
profileRouter.use(authenticateToken);

// ─── GET / — Full user profile with allergies & addresses ───
profileRouter.get(
  "/",
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
        allergies: {
          orderBy: { allergen: "asc" },
        },
        addresses: {
          orderBy: { isDefault: "desc" },
        },
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

// ─── PATCH / — Update profile fields ────────────────────────
profileRouter.patch(
  "/",
  validate(updateProfileSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, age, gender, abhaId, phone } = req.body;

    // Check phone uniqueness if changing
    if (phone) {
      const existing = await prisma.user.findFirst({
        where: { phone, id: { not: req.user!.id } },
      });
      if (existing) {
        throw new ApiError(409, "Phone number already in use by another account");
      }
    }

    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name !== undefined && { name }),
        ...(age !== undefined && { age }),
        ...(gender !== undefined && { gender }),
        ...(abhaId !== undefined && { abhaId }),
        ...(phone !== undefined && { phone }),
      },
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
        pharmacistVerified: true,
        updatedAt: true,
      },
    });

    res.json(updated);
  })
);

// ─── Allergies ──────────────────────────────────────────────

profileRouter.get(
  "/allergies",
  asyncHandler(async (req: Request, res: Response) => {
    const allergies = await prisma.userAllergy.findMany({
      where: { userId: req.user!.id },
      orderBy: { allergen: "asc" },
    });
    res.json({ data: allergies, total: allergies.length });
  })
);

profileRouter.post(
  "/allergies",
  validate(allergyCreateSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { allergen, severity, notes } = req.body;

    // Check for duplicate
    const existing = await prisma.userAllergy.findFirst({
      where: { userId: req.user!.id, allergen },
    });
    if (existing) {
      throw new ApiError(409, `Allergy '${allergen}' is already in your profile`);
    }

    const allergy = await prisma.userAllergy.create({
      data: {
        allergen,
        severity,
        notes: notes || null,
        userId: req.user!.id,
      },
    });

    res.status(201).json(allergy);
  })
);

profileRouter.delete(
  "/allergies/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Verify ownership
    const allergy = await prisma.userAllergy.findFirst({
      where: { id, userId: req.user!.id },
    });
    if (!allergy) {
      throw new ApiError(404, "Allergy not found");
    }

    await prisma.userAllergy.delete({ where: { id } });
    res.json({ message: "Allergy removed", id });
  })
);

// ─── Addresses ──────────────────────────────────────────────

profileRouter.get(
  "/addresses",
  asyncHandler(async (req: Request, res: Response) => {
    const addresses = await prisma.userAddress.findMany({
      where: { userId: req.user!.id },
      orderBy: { isDefault: "desc" },
    });
    res.json({ data: addresses, total: addresses.length });
  })
);

profileRouter.post(
  "/addresses",
  validate(addressCreateSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { label, address, city, pincode, isDefault } = req.body;

    // If setting as default, unset all other defaults first
    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false },
      });
    }

    // If this is the first address, make it default
    const addressCount = await prisma.userAddress.count({
      where: { userId: req.user!.id },
    });

    const newAddress = await prisma.userAddress.create({
      data: {
        label,
        address,
        city,
        pincode,
        isDefault: isDefault || addressCount === 0,
        userId: req.user!.id,
      },
    });

    res.status(201).json(newAddress);
  })
);

profileRouter.patch(
  "/addresses/:id",
  validate(addressUpdateSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Verify ownership
    const existing = await prisma.userAddress.findFirst({
      where: { id, userId: req.user!.id },
    });
    if (!existing) {
      throw new ApiError(404, "Address not found");
    }

    const { label, address, city, pincode, isDefault } = req.body;

    // If setting as default, unset all other defaults
    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId: req.user!.id, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.userAddress.update({
      where: { id },
      data: {
        ...(label !== undefined && { label }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(pincode !== undefined && { pincode }),
        ...(isDefault !== undefined && { isDefault }),
      },
    });

    res.json(updated);
  })
);

profileRouter.delete(
  "/addresses/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await prisma.userAddress.findFirst({
      where: { id, userId: req.user!.id },
    });
    if (!existing) {
      throw new ApiError(404, "Address not found");
    }

    await prisma.userAddress.delete({ where: { id } });

    // If deleted address was default, make the first remaining one default
    if (existing.isDefault) {
      const firstRemaining = await prisma.userAddress.findFirst({
        where: { userId: req.user!.id },
      });
      if (firstRemaining) {
        await prisma.userAddress.update({
          where: { id: firstRemaining.id },
          data: { isDefault: true },
        });
      }
    }

    res.json({ message: "Address removed", id });
  })
);

profileRouter.patch(
  "/addresses/:id/default",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Verify ownership
    const existing = await prisma.userAddress.findFirst({
      where: { id, userId: req.user!.id },
    });
    if (!existing) {
      throw new ApiError(404, "Address not found");
    }

    // Unset all defaults
    await prisma.userAddress.updateMany({
      where: { userId: req.user!.id },
      data: { isDefault: false },
    });

    // Set this as default
    const updated = await prisma.userAddress.update({
      where: { id },
      data: { isDefault: true },
    });

    res.json(updated);
  })
);
