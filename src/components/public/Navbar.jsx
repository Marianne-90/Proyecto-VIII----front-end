import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `navlink ${isActive ? "is-active" : ""}`;

export default function Navbar() {
  return (
    <header className="public-navbar">
      <div className="public-navbar__inner container">
        <div className="brand">
          <span className="brand__dot" />
          <span className="brand__name">La Nonnesa Pizza Party.</span>
        </div>

        <nav className="nav">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/menu" className={linkClass}>
            Menú
          </NavLink>
          <NavLink to="/promos" className={linkClass}>
            Promos
          </NavLink>
          <NavLink to="/contacto" className={linkClass}>
            Contacto
          </NavLink>
          <NavLink to="/admin/login" className="navlink navlink--admin">
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}