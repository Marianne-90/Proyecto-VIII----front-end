import { createContext, useContext, useEffect, useState } from "react";
import {
  clearAuthToken,
  getAuthToken,
  http,
  setAuthToken,
} from "../services/http";

const AuthContext = createContext(null);

function normalizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    branchId: user.branch_id ?? null,
    branch: user.branch ?? null,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const token = getAuthToken();

      if (!token) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const { data } = await http.get("/me");
        if (!isMounted) return;
        setUser(normalizeUser(data));
      } catch (error) {
        clearAuthToken();
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async ({ email, password }) => {
    try {
      const { data } = await http.post("/login", { email, password });
      const nextUser = normalizeUser(data.user);

      setAuthToken(data.token);
      setUser(nextUser);

      return { success: true };
    } catch (error) {
      clearAuthToken();
      setUser(null);

      return {
        success: false,
        message:
          error?.response?.data?.message || "No se ha podido iniciar sesión.",
      };
    }
  };

  const logout = async () => {
    try {
      if (getAuthToken()) {
        await http.post("/logout");
      }
    } catch (error) {
      const status = error?.response?.status;
      if (status !== 401) {
        console.error("No se pudo cerrar sesión en el backend", error);
      }
    } finally {
      clearAuthToken();
      setUser(null);
    }
  };

  const refreshUser = async () => {
    const { data } = await http.get("/me");
    const nextUser = normalizeUser(data);
    setUser(nextUser);
    return nextUser;
  };

  const value = {
    user,
    role: user?.role || null,
    branchId: user?.branchId || null,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  if (isLoading) {
    return <div className="loading-full">Comprobando tu sesión...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  return ctx;
}
