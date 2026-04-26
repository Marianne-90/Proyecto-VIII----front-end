/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import { useAuth } from "../context/useAuth.js";

const DESKTOP_BREAKPOINT = 900;

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Cerrar sidebar al navegar (móvil / drawer)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Cerrar sidebar al pasar a desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Cerrar con ESC y bloquear scroll del body cuando está abierto en móvil
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsSidebarOpen(false);
    };

    const isMobile = window.innerWidth < DESKTOP_BREAKPOINT;
    if (isSidebarOpen && isMobile) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isSidebarOpen]);

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  return (
    <div className="admin-shell">
      {/* Topbar */}
      <header className="admin-topbar">
        <button
          className="icon-btn"
          onClick={toggleSidebar}
          aria-label="Abrir/Cerrar menú"
        >
          ☰
        </button>

        <div className="admin-topbar__title">Panel de gestión</div>

        <div className="admin-topbar__spacer" />

        {isAuthenticated && (
          <div className="admin-topbar__right">
            <span className="admin-user-label">
              {user?.email || user?.name || "Usuario"}
            </span>
            <button className="btn" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </header>

      {/* Overlay (móvil) */}
      <div
        className={`admin-overlay ${isSidebarOpen ? "is-open" : ""}`}
        onClick={closeSidebar}
        aria-hidden={!isSidebarOpen}
      />

      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
