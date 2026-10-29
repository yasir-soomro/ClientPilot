"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentOwner,
  loginOwner,
  logoutOwner,
  AuthApiError,
} from "./service";
import type { LoginInput, Owner } from "./types";

export type AuthState =
  | { status: "loading" }
  | { status: "authenticated"; owner: Owner }
  | { status: "unauthenticated" }
  | { status: "error"; message: string };

type AuthContextValue = {
  state: AuthState;
  refresh: () => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Unable to verify your session. Please try again.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading" });
  const requestId = useRef(0);

  const verifySession = useCallback(async () => {
    const currentRequestId = ++requestId.current;
    try {
      const owner = await getCurrentOwner();
      if (requestId.current === currentRequestId) {
        setState({ status: "authenticated", owner });
      }
    } catch (error) {
      if (requestId.current !== currentRequestId) {
        return;
      }
      if (error instanceof AuthApiError && error.status === 401) {
        setState({ status: "unauthenticated" });
      } else {
        setState({ status: "error", message: errorMessage(error) });
      }
    }
  }, []);

  const refresh = useCallback(async () => {
    setState({ status: "loading" });
    await verifySession();
  }, [verifySession]);

  const login = useCallback(async (input: LoginInput) => {
    const currentRequestId = ++requestId.current;
    try {
      const owner = await loginOwner(input);
      if (requestId.current === currentRequestId) {
        setState({ status: "authenticated", owner });
      }
    } catch (error) {
      if (requestId.current === currentRequestId) {
        await verifySession();
      }
      throw error;
    }
  }, [verifySession]);

  const logout = useCallback(async () => {
    const currentRequestId = ++requestId.current;
    try {
      await logoutOwner();
    } catch (error) {
      if (!(error instanceof AuthApiError && error.status === 401)) {
        throw error;
      }
    }
    if (requestId.current === currentRequestId) {
      setState({ status: "unauthenticated" });
    }
  }, []);

  useEffect(() => {
    const currentRequestId = ++requestId.current;
    getCurrentOwner()
      .then((owner) => {
        if (requestId.current === currentRequestId) {
          setState({ status: "authenticated", owner });
        }
      })
      .catch((error: unknown) => {
        if (requestId.current !== currentRequestId) {
          return;
        }
        if (error instanceof AuthApiError && error.status === 401) {
          setState({ status: "unauthenticated" });
        } else {
          setState({ status: "error", message: errorMessage(error) });
        }
      });
    return () => {
      if (requestId.current === currentRequestId) {
        requestId.current += 1;
      }
    };
  }, []);

  useEffect(() => {
    function handleExpiredSession() {
      requestId.current += 1;
      setState({ status: "unauthenticated" });
    }

    window.addEventListener("clientpilot:auth-expired", handleExpiredSession);
    return () => {
      window.removeEventListener("clientpilot:auth-expired", handleExpiredSession);
    };
  }, []);

  useEffect(() => {
    function revalidateSession() {
      void refresh();
    }

    function revalidateRestoredPage(event: PageTransitionEvent) {
      if (event.persisted) {
        revalidateSession();
      }
    }

    window.addEventListener("popstate", revalidateSession);
    window.addEventListener("pageshow", revalidateRestoredPage);
    return () => {
      window.removeEventListener("popstate", revalidateSession);
      window.removeEventListener("pageshow", revalidateRestoredPage);
    };
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ state, refresh, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
