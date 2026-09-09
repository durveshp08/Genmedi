import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type {
  AuthUser,
  AuthState,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "../types/auth";

// ─── Token Storage ──────────────────────────────────────────

const TOKEN_KEY = "genmedi_access_token";
const REFRESH_KEY = "genmedi_refresh_token";

function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function getStoredRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

function storeTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// ─── Helper: fetch with auth ────────────────────────────────

async function authFetch<T>(
  url: string,
  options: { method?: string; body?: unknown; token?: string | null } = {}
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as any).error || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Context ────────────────────────────────────────────────

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const isAuthenticated = user !== null;

  // ── Load user on mount ──────────────────────────────────
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    authFetch<AuthUser>("/api/auth/me", { token })
      .then((userData) => {
        setUser(userData);
      })
      .catch(async () => {
        // Try refresh
        const refreshToken = getStoredRefreshToken();
        if (refreshToken) {
          try {
            const refreshResult = await authFetch<{
              accessToken: string;
              user: AuthUser;
            }>("/api/auth/refresh", {
              method: "POST",
              body: { refreshToken },
            });
            localStorage.setItem(TOKEN_KEY, refreshResult.accessToken);
            setUser(refreshResult.user);
          } catch {
            clearTokens();
          }
        } else {
          clearTokens();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ── Login ───────────────────────────────────────────────
  const login = useCallback(async (credentials: LoginCredentials) => {
    setError(null);
    setLoading(true);

    try {
      const result = await authFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: credentials,
      });

      storeTokens(result.accessToken, result.refreshToken);
      setUser(result.user);
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Register ────────────────────────────────────────────
  const register = useCallback(async (data: RegisterData) => {
    setError(null);
    setLoading(true);

    try {
      const result = await authFetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: data,
      });

      storeTokens(result.accessToken, result.refreshToken);
      setUser(result.user);
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ──────────────────────────────────────────────
  const logout = useCallback(async () => {
    const refreshToken = getStoredRefreshToken();

    try {
      await authFetch("/api/auth/logout", {
        method: "POST",
        body: { refreshToken },
        token: getStoredToken(),
      });
    } catch {
      // Server error on logout is non-critical
    }

    clearTokens();
    setUser(null);
    setError(null);
  }, []);

  // ── Refresh User ────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      const userData = await authFetch<AuthUser>("/api/auth/me", { token });
      setUser(userData);
    } catch {
      // Token might be expired, try refresh
      const refreshToken = getStoredRefreshToken();
      if (refreshToken) {
        try {
          const refreshResult = await authFetch<{
            accessToken: string;
            user: AuthUser;
          }>("/api/auth/refresh", {
            method: "POST",
            body: { refreshToken },
          });
          localStorage.setItem(TOKEN_KEY, refreshResult.accessToken);
          setUser(refreshResult.user);
        } catch {
          clearTokens();
          setUser(null);
        }
      }
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

/**
 * Returns the stored access token for API calls.
 */
export function getAccessToken(): string | null {
  return getStoredToken();
}
