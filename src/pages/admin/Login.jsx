import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Si ya está logueado, no tiene sentido ver el login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/inventario", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await login({ email, password });
    setSubmitting(false);

    if (result.success) {
      const from = location.state?.from || "/admin/inventario";
      navigate(from, { replace: true });
    } else {
      setError(result.message || "No se ha podido iniciar sesión.");
    }
  };

  return (
    <section className="page">
      <div className="admin-card">
        <h1>Acceso al panel</h1>
        <p>Inicia sesión para gestionar productos, usuarios y sucursales de la pizzería.</p>

        {error && (
          <p style={{ color: "#ff6b6b", marginTop: "0.75rem" }}>
            {error}
          </p>
        )}

        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="tu-correo@pizzeria.es"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input
              type="password"
              placeholder="Introduce tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Accediendo..." : "Entrar"}
          </button>
        </form>
      </div>
    </section>
  );
}
