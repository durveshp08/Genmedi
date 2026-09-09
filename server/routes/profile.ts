import { Router, Request, Response } from "express";
import { User } from "../models";
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
    const user = await User.findById(req.user!.id).select("-passwordHash").lean();

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
      const existing = await User.findOne({
        phone,
        _id: { $ne: req.user!.id },
      });
      if (existing) {
        throw new ApiError(409, "Phone number already in use by another account");
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (age !== undefined) updateData.age = age;
    if (gender !== undefined) updateData.gender = gender;
    if (abhaId !== undefined) updateData.abhaId = abhaId;
    if (phone !== undefined) updateData.phone = phone;

    const updated = await User.findByIdAndUpdate(
      req.user!.id,
      updateData,
      { new: true }
    )
      .select("name email phone role age gender abhaId avatarUrl pharmacistRegNo pharmacistVerified updatedAt")
      .lean();

    res.json(updated);
  })
);

// ─── Allergies ──────────────────────────────────────────────

profileRouter.get(
  "/allergies",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.user!.id).select("allergies").lean();
    const allergies = (user?.allergies || []).sort((a, b) =>
      a.allergen.localeCompare(b.allergen)
    );
    res.json({ data: allergies, total: allergies.length });
  })
);

profileRouter.post(
  "/allergies",
  validate(allergyCreateSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { allergen, severity, notes } = req.body;

    const user = await User.findById(req.user!.id);
    if (!user) throw new ApiError(404, "User not found");

    // Check for duplicate
    const existing = user.allergies.find((a) => a.allergen === allergen);
    if (existing) {
      throw new ApiError(409, `Allergy '${allergen}' is already in your profile`);
    }

    user.allergies.push({
      allergen,
      severity,
      notes: notes || null,
    } as any);
    await user.save();

    const newAllergy = user.allergies[user.allergies.length - 1];
    res.status(201).json(newAllergy);
  })
);

profileRouter.delete(
  "/allergies/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(req.user!.id);
    if (!user) throw new ApiError(404, "User not found");

    const allergyIndex = user.allergies.findIndex(
      (a) => a._id.toString() === id
    );
    if (allergyIndex === -1) {
      throw new ApiError(404, "Allergy not found");
    }

    user.allergies.splice(allergyIndex, 1);
    await user.save();

    res.json({ message: "Allergy removed", id });
  })
);

// ─── Addresses ──────────────────────────────────────────────

profileRouter.get(
  "/addresses",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.user!.id).select("addresses").lean();
    const addresses = (user?.addresses || []).sort((a, b) =>
      a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
    );
    res.json({ data: addresses, total: addresses.length });
  })
);

profileRouter.post(
  "/addresses",
  validate(addressCreateSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { label, address, city, pincode, isDefault } = req.body;

    const user = await User.findById(req.user!.id);
    if (!user) throw new ApiError(404, "User not found");

    // If setting as default, unset all other defaults first
    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    // If this is the first address, make it default
    const makeDefault = isDefault || user.addresses.length === 0;

    user.addresses.push({
      label,
      address,
      city,
      pincode,
      isDefault: makeDefault,
    } as any);
    await user.save();

    const newAddress = user.addresses[user.addresses.length - 1];
    res.status(201).json(newAddress);
  })
);

profileRouter.patch(
  "/addresses/:id",
  validate(addressUpdateSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(req.user!.id);
    if (!user) throw new ApiError(404, "User not found");

    const addr = user.addresses.find((a) => a._id.toString() === id);
    if (!addr) {
      throw new ApiError(404, "Address not found");
    }

    const { label, address, city, pincode, isDefault } = req.body;

    // If setting as default, unset all other defaults
    if (isDefault) {
      user.addresses.forEach((a) => {
        if (a._id.toString() !== id) a.isDefault = false;
      });
    }

    if (label !== undefined) addr.label = label;
    if (address !== undefined) addr.address = address;
    if (city !== undefined) addr.city = city;
    if (pincode !== undefined) addr.pincode = pincode;
    if (isDefault !== undefined) addr.isDefault = isDefault;

    await user.save();
    res.json(addr);
  })
);

profileRouter.delete(
  "/addresses/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(req.user!.id);
    if (!user) throw new ApiError(404, "User not found");

    const addrIndex = user.addresses.findIndex((a) => a._id.toString() === id);
    if (addrIndex === -1) {
      throw new ApiError(404, "Address not found");
    }

    const wasDefault = user.addresses[addrIndex].isDefault;
    user.addresses.splice(addrIndex, 1);

    // If deleted address was default, make the first remaining one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json({ message: "Address removed", id });
  })
);

profileRouter.patch(
  "/addresses/:id/default",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(req.user!.id);
    if (!user) throw new ApiError(404, "User not found");

    const addr = user.addresses.find((a) => a._id.toString() === id);
    if (!addr) {
      throw new ApiError(404, "Address not found");
    }

    // Unset all defaults, then set this one
    user.addresses.forEach((a) => (a.isDefault = false));
    addr.isDefault = true;

    await user.save();
    res.json(addr);
  })
);
