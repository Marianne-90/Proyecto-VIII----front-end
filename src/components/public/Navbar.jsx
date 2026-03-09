import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.jpg"; // ajusta la ruta si cambia


const linkClass = ({ isActive }) => `navlink ${isActive ? "is-active" : ""}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Cierra con ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className="public-navbar">
      <div className="public-navbar__inner container">
        <div className="brand">
          <NavLink to="/" onClick={close} className="brand__link">
            <img src={logo} alt="La Nonnesa Pizza Party" className="brand__logo" />
          </NavLink>
          <span className="brand__dot" />
          <span className="brand__name">La Nonnesa <span className="pizza">Pizza Party.</span></span>
        </div>

        {/* Botón móvil */}
        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="public-nav"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        {/* Navegación */}
        <nav id="public-nav" className={`nav ${open ? "is-open" : ""}`}>
          <NavLink to="/" className={linkClass} end onClick={close}>
            Home
          </NavLink>
          <NavLink to="/carta" className={linkClass} onClick={close}>
            Menú
          </NavLink>
          <NavLink to="/especialidades" className={linkClass} onClick={close}>
            Especialidades
          </NavLink>
          <NavLink to="/reservar" className={linkClass} onClick={close}>
            Reserva y Contacto
          </NavLink>
          <NavLink to="/admin/login" className="navlink navlink--admin" onClick={close}>
            Admin
          </NavLink>
        </nav>
      </div>

      {/* Overlay móvil (click para cerrar) */}
      <div
        className={`nav-overlay ${open ? "is-open" : ""}`}
        onClick={close}
        aria-hidden={!open}
      />
    </header>
  );
}