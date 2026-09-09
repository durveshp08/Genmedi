// ─── Auth Types ─────────────────────────────────────────────

export type UserRole = "patient" | "pharmacist" | "admin" | "rider";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  age?: number | null;
  gender?: string | null;
  abhaId?: string | null;
  avatarUrl?: string | null;
  pharmacistRegNo?: string | null;
  pharmacistLicense?: string | null;
  pharmacistVerified?: boolean;
  allergies?: UserAllergy[];
  addresses?: UserAddress[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserAllergy {
  id: string;
  allergen: string;
  severity: "mild" | "moderate" | "severe";
  notes?: string | null;
  userId: string;
}

export interface UserAddress {
  id: string;
  label: string;
  address: string;
  city: string;
  pincode: string;
  isDefault: boolean;
  userId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRole;
  pharmacistRegNo?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// ─── Role-Tab Access Map ────────────────────────────────────

import type { TabType } from "../types";

export const ROLE_TAB_ACCESS: Record<UserRole, TabType[]> = {
  patient: [
    "discover",
    "rx_vault",
    "checkout",
    "tracking",
    "ai_pharmacist",
    "health_vault",
  ],
  pharmacist: [
    "discover",
    "rx_vault",
    "checkout",
    "tracking",
    "ai_pharmacist",
    "health_vault",
    "clinical_reviewer",
    "bioequivalence_studio",
  ],
  admin: [
    "discover",
    "rx_vault",
    "checkout",
    "tracking",
    "ai_pharmacist",
    "health_vault",
    "clinical_reviewer",
    "admin_ops",
    "bioequivalence_studio",
    "exception_resolution",
    "pharmacy_hub",
    "architecture",
  ],
  rider: [
    "discover",
    "tracking",
  ],
};

/**
 * Check if a user role has access to a specific tab.
 * If no user (not authenticated), allow all consumer tabs for browsing.
 */
export function canAccessTab(role: UserRole | undefined, tab: TabType): boolean {
  if (!role) {
    // Unauthenticated users can browse consumer-facing tabs
    const publicTabs: TabType[] = ["discover", "ai_pharmacist", "architecture"];
    return publicTabs.includes(tab);
  }
  return ROLE_TAB_ACCESS[role]?.includes(tab) ?? false;
}
