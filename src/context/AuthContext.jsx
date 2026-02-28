import { createContext, useContext, useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "../services/cookies";
import { authenticateUser, getUserById } from "../services/usersStore";

const AuthContext = createContext(null);

const AUTH_COOKIE = "demo_auth_v1";

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar sesión desde cookie
  useEffect(() => {
    const raw = getCookie(AUTH_COOKIE);
    const data = raw ? safeParse(raw, null) : null;

    if (data?.userId) {
      const u = getUserById(data.userId);
      if (u) {
        setUser({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,       // admin | staff
          branchId: u.branchId,
          token: data.token || "demo-token",
        });
      } else {
        deleteCookie(AUTH_COOKIE);
      }
    }

    setIsLoading(false);
  }, []);

  // Dummy login: email/password contra usersStore
  const login = ({ email, password }) => {
    const res = authenticateUser(email, password);
    if (!res.ok) {
      return { success: false, message: res.error };
    }

    const fakeToken = "demo-token";
    setCookie(
      AUTH_COOKIE,
      JSON.stringify({ userId: res.user.id, token: fakeToken }),
      30
    );

    setUser({
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
      role: res.user.role,
      branchId: res.user.branchId,
      token: fakeToken,
    });

    return { success: true };
  };

  const logout = () => {
    deleteCookie(AUTH_COOKIE);
    setUser(null);
  };

  const value = {
    user,
    role: user?.role || null,
    branchId: user?.branchId || null,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  if (isLoading) {
    return <div className="loading-full">Cargando sesión...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  return ctx;
}