"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ApiError,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  apiLogin,
  apiLogout,
  apiRegister,
  fetchMe,
} from "@/lib/api";

type AuthState =
  | { status: "loading" }
  | { status: "authenticated"; user: AuthUser }
  | { status: "unauthenticated" };

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    fetchMe()
      .then((user) => setState({ status: "authenticated", user }))
      .catch(() => setState({ status: "unauthenticated" }));
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const user = await apiLogin(payload);
    setState({ status: "authenticated", user });
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const user = await apiRegister(payload);
    setState({ status: "authenticated", user });
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (e) {
      if (!(e instanceof ApiError)) throw e;
    }
    setState({ status: "unauthenticated" });
  }, []);

  const value: AuthContextValue = {
    user: state.status === "authenticated" ? state.user : null,
    loading: state.status === "loading",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
