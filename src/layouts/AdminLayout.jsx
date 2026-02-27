import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Cerrar sidebar al pasar a desktop (si cambias el tamaño)
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 900) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  return (
    <div className="admin-shell">
      {/* Topbar */}
      <header className="admin-topbar">
        <button className="icon-btn" onClick={toggleSidebar} aria-label="Menú">
          ☰
        </button>
        <div className="admin-topbar__title">Admin</div>
        <div className="admin-topbar__spacer" />
        <button className="btn" onClick={openSidebar}>
          Abrir menú
        </button>
      </header>

      {/* Overlay (móvil) */}
      <div
        className={`admin-overlay ${isSidebarOpen ? "is-open" : ""}`}
        onClick={closeSidebar}
        role="button"
        aria-label="Cerrar menú"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Escape") closeSidebar();
        }}
      />

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}