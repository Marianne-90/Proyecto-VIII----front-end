import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("user_email");

    if (token && email) {
      setUser({
        name: "Admin Demo",
        email,
        token,
      });
    }

    setIsLoading(false);
  }, []);

  // Dummy login: credenciales fijas
  const login = ({ email, password }) => {
    if (email === "admin@demo.com" && password === "123456") {
      const fakeToken = "demo-token";

      localStorage.setItem("token", fakeToken);
      localStorage.setItem("user_email", email);

      setUser({
        name: "Admin Demo",
        email,
        token: fakeToken,
      });

      return { success: true };
    }

    return {
      success: false,
      message: "Credenciales inválidas (usa admin@demo.com / 123456)",
    };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  if (isLoading) {
    return (
      <div className="loading-full">
        Cargando sesión...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }
  return ctx;
}