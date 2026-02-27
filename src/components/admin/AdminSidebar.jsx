import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) => `side-link ${isActive ? "is-active" : ""}`;

export default function AdminSidebar({ isOpen, onClose }) {
  return (
    <aside className={`admin-sidebar ${isOpen ? "is-open" : ""}`}>
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__title">Panel</div>
        <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
      </div>

      <div className="admin-sidebar__content">
        <nav className="side-nav">
          <div className="side-section">Acceso</div>
          <NavLink to="/admin/login" className={linkClass}>
            Login
          </NavLink>

          <div className="side-section">Gestión</div>
          <NavLink to="/admin/inventario" className={linkClass}>
            Inventario
          </NavLink>
          <NavLink to="/admin/sucursales" className={linkClass}>
            Sucursales
          </NavLink>

          <div className="side-divider" />

          <NavLink to="/" className="side-link side-link--muted">
            ← Volver al sitio
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}