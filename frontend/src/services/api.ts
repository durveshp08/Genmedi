/**
 * Genmedi API Service Layer
 *
 * Centralized, typed API client for all frontend ↔ backend communication.
 * Replaces direct mock data imports with fetch calls to Express API routes.
 * Includes JWT authentication headers and auto-refresh on 401.
 */

import type {
  Medicine,
  StockistHub,
  Prescription,
  OrderTracking,
  PriorityException,
  DissolutionCurveData,
} from "../types";

import type {
  AuthUser,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  UserAllergy,
  UserAddress,
} from "../types/auth";

// ─── API Configuration ───────────────────────────────────────

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ─── Token Helpers ──────────────────────────────────────────

const TOKEN_KEY = "genmedi_access_token";
const REFRESH_KEY = "genmedi_refresh_token";

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

// ─── Types for API responses ────────────────────────────────

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit?: number;
  offset?: number;
}

interface MedicineSearchParams {
  q?: string;
  therapeuticClass?: string;
  inStock?: boolean;
  limit?: number;
  offset?: number;
}

interface CreateOrderParams {
  prescriptionId?: string;
  customerAddress: string;
  deliverySpeed: "fast_45" | "standard";
  items: {
    medicineId: string;
    quantity: number;
    isGeneric: boolean;
  }[];
}

interface PharmacistQueryParams {
  question?: string;
  molecule?: string;
  brandName?: string;
  patientContext?: {
    name?: string;
    age?: number;
    gender?: string;
    allergies?: string[];
  };
}

interface PharmacistResponse {
  reply: string;
  source: string;
  timestamp: string;
}

interface DissolutionResponse {
  medicineId: string;
  medicineName: string;
  data: DissolutionCurveData[];
}

interface CreatePrescriptionParams {
  doctorName: string;
  doctorRegNo: string;
  doctorClinic: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientAbhaId: string;
  date: string;
  diagnosis: string;
  items: {
    brandName: string;
    molecule: string;
    dosage: string;
    frequency: string;
    duration: string;
    brandPrice: number;
    genericPrice: number;
    genericSubstitute: string;
    savingsPercent: number;
    bioIndex: number;
    allergyFlag?: boolean;
  }[];
}

// ─── Core fetch helper ──────────────────────────────────────

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

async function fetchJSON<T>(
  url: string,
  options: {
    method?: string;
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
    auth?: boolean; // default true — include auth header if token exists
  } = {}
): Promise<T> {
  const { method = "GET", body, params, auth = true } = options;

  // Build URL with query parameters
  let fullUrl = url;
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl += `?${queryString}`;
    }
  }

  const headers: Record<string, string> = {};
  if (body) headers["Content-Type"] = "application/json";

  // Attach auth token if available
  if (auth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${fullUrl}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle 401 — try token refresh
  if (response.status === 401 && auth) {
    const errorData = await response.json().catch(() => ({}));

    if ((errorData as any).code === "TOKEN_EXPIRED") {
      // Attempt auto-refresh
      const newToken = await attemptRefresh();
      if (newToken) {
        // Retry the original request with new token
        const retryHeaders: Record<string, string> = {};
        if (body) retryHeaders["Content-Type"] = "application/json";
        retryHeaders["Authorization"] = `Bearer ${newToken}`;

        const retryResponse = await fetch(`${API_URL}${fullUrl}`, {
          method,
          headers: retryHeaders,
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!retryResponse.ok) {
          const retryError = await retryResponse.json().catch(() => ({}));
          throw new Error(
            (retryError as any).error || `API request failed: ${retryResponse.status}`
          );
        }

        return retryResponse.json() as Promise<T>;
      }
    }

    throw new Error((errorData as any).error || "Authentication required");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as any).error || `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

async function attemptRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  // If already refreshing, queue this request
  if (isRefreshing) {
    return new Promise<string>((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const newToken = data.accessToken;
    setToken(newToken);

    // Resolve queued requests
    refreshQueue.forEach((resolve) => resolve(newToken));
    refreshQueue = [];

    return newToken;
  } catch {
    return null;
  } finally {
    isRefreshing = false;
  }
}

// ─── API Client ─────────────────────────────────────────────

export const api = {
  /** Health check */
  health: {
    check: () =>
      fetchJSON<{ status: string; service: string; timestamp: string; aiReady: boolean; database: string }>(
        "/api/health",
        { auth: false }
      ),
  },

  /** Authentication */
  auth: {
    register: (data: RegisterData) =>
      fetchJSON<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: data,
        auth: false,
      }),

    login: (credentials: LoginCredentials) =>
      fetchJSON<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: credentials,
        auth: false,
      }),

    logout: (refreshToken: string) =>
      fetchJSON<{ message: string }>("/api/auth/logout", {
        method: "POST",
        body: { refreshToken },
      }),

    refresh: (refreshToken: string) =>
      fetchJSON<{ accessToken: string; user: AuthUser }>("/api/auth/refresh", {
        method: "POST",
        body: { refreshToken },
        auth: false,
      }),

    me: () => fetchJSON<AuthUser>("/api/auth/me"),

    verifyOtp: (phone: string, otp: string) =>
      fetchJSON<{ verified: boolean; phone: string; message: string }>(
        "/api/auth/verify-otp",
        { method: "POST", body: { phone, otp }, auth: false }
      ),
  },

  /** User Profile */
  profile: {
    get: () => fetchJSON<AuthUser>("/api/profile"),

    update: (data: { name?: string; age?: number; gender?: string; abhaId?: string; phone?: string }) =>
      fetchJSON<AuthUser>("/api/profile", { method: "PATCH", body: data }),

    // Allergies
    listAllergies: () =>
      fetchJSON<{ data: UserAllergy[]; total: number }>("/api/profile/allergies").then(
        (res) => res.data
      ),

    addAllergy: (data: { allergen: string; severity: string; notes?: string }) =>
      fetchJSON<UserAllergy>("/api/profile/allergies", { method: "POST", body: data }),

    removeAllergy: (id: string) =>
      fetchJSON<{ message: string; id: string }>(`/api/profile/allergies/${id}`, {
        method: "DELETE",
      }),

    // Addresses
    listAddresses: () =>
      fetchJSON<{ data: UserAddress[]; total: number }>("/api/profile/addresses").then(
        (res) => res.data
      ),

    addAddress: (data: { label: string; address: string; city: string; pincode: string; isDefault?: boolean }) =>
      fetchJSON<UserAddress>("/api/profile/addresses", { method: "POST", body: data }),

    updateAddress: (id: string, data: Partial<{ label: string; address: string; city: string; pincode: string; isDefault: boolean }>) =>
      fetchJSON<UserAddress>(`/api/profile/addresses/${id}`, { method: "PATCH", body: data }),

    removeAddress: (id: string) =>
      fetchJSON<{ message: string; id: string }>(`/api/profile/addresses/${id}`, {
        method: "DELETE",
      }),

    setDefaultAddress: (id: string) =>
      fetchJSON<UserAddress>(`/api/profile/addresses/${id}/default`, { method: "PATCH" }),
  },

  /** Medicines */
  medicines: {
    list: (params?: MedicineSearchParams) =>
      fetchJSON<PaginatedResponse<Medicine>>("/api/medicines", { params: params as any, auth: false }).then(
        (res) => res.data
      ),

    getById: (id: string) => fetchJSON<Medicine>(`/api/medicines/${id}`, { auth: false }),
  },

  /** Stockist Hubs */
  hubs: {
    list: () =>
      fetchJSON<PaginatedResponse<StockistHub>>("/api/hubs", { auth: false }).then((res) => res.data),

    getById: (id: string) => fetchJSON<StockistHub>(`/api/hubs/${id}`, { auth: false }),
  },

  /** Prescriptions */
  prescriptions: {
    list: () =>
      fetchJSON<PaginatedResponse<Prescription>>("/api/prescriptions").then((res) => res.data),

    getById: (id: string) => fetchJSON<Prescription>(`/api/prescriptions/${id}`),

    create: (data: CreatePrescriptionParams) =>
      fetchJSON<Prescription>("/api/prescriptions", { method: "POST", body: data }),

    verify: (id: string, pharmacistName: string, pharmacistRegNo: string) =>
      fetchJSON<Prescription>(`/api/prescriptions/${id}/verify`, {
        method: "PATCH",
        body: { pharmacistName, pharmacistRegNo },
      }),
  },

  /** Orders */
  orders: {
    list: () =>
      fetchJSON<PaginatedResponse<OrderTracking>>("/api/orders").then((res) => res.data),

    getById: (id: string) => fetchJSON<OrderTracking>(`/api/orders/${id}`),

    create: (data: CreateOrderParams) =>
      fetchJSON<OrderTracking>("/api/orders", { method: "POST", body: data }),

    updateStatus: (id: string, status: string) =>
      fetchJSON<OrderTracking>(`/api/orders/${id}/status`, {
        method: "PATCH",
        body: { status },
      }),
  },

  /** Priority Exceptions */
  exceptions: {
    list: () =>
      fetchJSON<PaginatedResponse<PriorityException>>("/api/exceptions").then((res) => res.data),

    listAll: () =>
      fetchJSON<PaginatedResponse<PriorityException>>("/api/exceptions/all").then(
        (res) => res.data
      ),

    resolve: (id: string) =>
      fetchJSON<PriorityException>(`/api/exceptions/${id}/resolve`, { method: "PATCH" }),
  },

  /** Dissolution Data */
  dissolution: {
    getByMedicine: (medicineId: string) =>
      fetchJSON<DissolutionResponse>(`/api/dissolution/${medicineId}`, { auth: false }).then((res) => res.data),
  },

  /** AI Pharmacist */
  pharmacist: {
    query: (data: PharmacistQueryParams) =>
      fetchJSON<PharmacistResponse>("/api/pharmacist/query", { method: "POST", body: data }),
  },

  /** Prescription OCR */
  ocr: {
    parse: (fileName: string) =>
      fetchJSON<any>("/api/ocr/parse", { method: "POST", body: { fileName } }),
  },

  /** Payments */
  payments: {
    createOrder: (data: { amount: number; currency?: string; receipt?: string; notes?: Record<string, string> }) =>
      fetchJSON<{
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
        subtotal: number;
        deliveryFee: number;
        gst: number;
        total: number;
      }>("/api/payments/create-order", { method: "POST", body: data }),

    verifyPayment: (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
      fetchJSON<{ success: boolean; paymentId: string; amount: number; status: string }>("/api/payments/verify-payment", {
        method: "POST",
        body: data,
      }),

    refund: (data: { paymentId: string; amount?: number }) =>
      fetchJSON<{ refundId: string; amount: number; status: string }>("/api/payments/refund", {
        method: "POST",
        body: data,
      }),

    getPricing: (subtotal: number, deliverySpeed: "fast_45" | "standard" = "standard") =>
      fetchJSON<{ subtotal: number; deliveryFee: number; gst: number; total: number; savings: number }>("/api/payments/pricing", {
        params: { subtotal, deliverySpeed },
      }),
  },

  /** Tracking */
  tracking: {
    updateLocation: (data: { orderId: string; lat: number; lng: number; speedKmh?: number; temperature?: number; etaMinutes?: number }) =>
      fetchJSON<{ success: boolean; message: string }>("/api/tracking/update-location", {
        method: "POST",
        body: data,
      }),

    getLocation: (orderId: string) =>
      fetchJSON<{ orderId: string; lat: number; lng: number; speedKmh: number; temperature: number; etaMinutes: number; timestamp: number }>(`/api/tracking/location/${orderId}`, { auth: false }),
  },

  /** Riders */
  riders: {
    list: () =>
      fetchJSON<{ data: any[]; total: number }>("/api/riders"),

    assign: (data: { orderId: string; riderId: string }) =>
      fetchJSON<{ success: boolean; message: string }>("/api/riders/assign", {
        method: "POST",
        body: data,
      }),

    get: (id: string) =>
      fetchJSON<any>(`/api/riders/${id}`),

    updateStatus: (id: string, status: "active" | "idle" | "offline" | "break") =>
      fetchJSON<{ success: boolean; message: string }>(`/api/riders/${id}/status`, {
        method: "PATCH",
        body: { status },
      }),
  },

  /** Drug Interactions */
  interactions: {
    check: (medications: string[]) =>
      fetchJSON<{
        medications: string[];
        interactions: any[];
        total: number;
        hasContraindications: boolean;
        hasMajor: boolean;
      }>("/api/interactions/check", {
        method: "POST",
        body: { medications },
      }),

    getSeverityLevels: () =>
      fetchJSON<{ severities: Array<{ value: string; label: string; description: string }> }>("/api/interactions/severity-levels"),
  },
};
