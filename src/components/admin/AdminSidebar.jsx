import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const linkClass = ({ isActive }) => `side-link ${isActive ? "is-active" : ""}`;

export default function AdminSidebar({ isOpen, onClose }) {
  const { role, isAuthenticated } = useAuth();
  const isAdmin = role === "admin";

  return (
    <aside
      className={`admin-sidebar ${isOpen ? "is-open" : ""}`}
      aria-hidden={!isOpen}
    >
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__title">Panel</div>
        <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
      </div>

      <div className="admin-sidebar__content">
        <nav className="side-nav">
          {!isAuthenticated && (
            <>
              <div className="side-section">Acceso</div>
              <NavLink to="/admin/login" className={linkClass}>
                Login
              </NavLink>
              <div className="side-divider" />
              <NavLink to="/" className="side-link side-link--muted">
                ← Volver al sitio
              </NavLink>
            </>
          )}

          {isAuthenticated && (
            <>
              <div className="side-section">Gestión</div>

              <NavLink to="/admin/inventario" className={linkClass}>
                Inventario
              </NavLink>

 
              {isAdmin && (
                <NavLink to="/admin/sucursales" className={linkClass}>
                  Sucursales
                </NavLink>
              )}


              {isAdmin && (
                <NavLink to="/admin/usuarios" className={linkClass}>
                  Usuarios
                </NavLink>
              )}

              <div className="side-divider" />

              <NavLink to="/" className="side-link side-link--muted">
                ← Volver al sitio
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
}