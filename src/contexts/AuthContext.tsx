import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { api, STORAGE_KEYS, setTokens, clearTokens } from "../lib/api";
import type { AuthUser, AuthResponse, LoginPayload, RegisterPayload } from "../types/api";

interface AuthContextValue {
  user:       AuthUser | null;
  isLoading:  boolean;
  isLoggedIn: boolean;
  login:      (payload: LoginPayload)    => Promise<void>;
  register:   (payload: RegisterPayload) => Promise<void>;
  logout:     () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const hydrateUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<AuthUser | null>(hydrateUser);
  const [isLoading, setIsLoading] = useState(false);

  const persistUser = (u: AuthUser) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
    setUser(u);
  };

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get<AuthUser>("/auth/me");
      persistUser(data);
    } catch {
      // ignore — interceptor handles 401
    }
  }, []);

  /* Hydrate user from API on mount if we have a token */
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && !user) {
      refreshUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const { data } = await api.post<AuthResponse>("/auth/login", payload);
      setTokens(data.accessToken, data.refreshToken);
      persistUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const { data } = await api.post<AuthResponse>("/auth/register", payload);
      setTokens(data.accessToken, data.refreshToken);
      persistUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
