import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("123456");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = login({ email, password });

    setSubmitting(false);

    if (result.success) {
      const from = location.state?.from || "/admin/inventario";
      navigate(from, { replace: true });
    } else {
      setError(result.message || "Error al iniciar sesión");
    }
  };

  return (
    <section className="page">
      <div className="admin-card">
        <h1>Admin Login</h1>
        <p>Autenticación de prueba con credenciales fijas.</p>
        <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
          Email: <code>admin@demo.com</code> — Password: <code>123456</code>
        </p>

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
              placeholder="admin@demo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </section>
  );
}