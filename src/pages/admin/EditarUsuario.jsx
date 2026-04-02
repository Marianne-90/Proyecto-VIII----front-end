import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBranches } from "../../services/branchesApi";
import { getUsers, updateUser } from "../../services/usersApi";

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [user, setUser] = useState(null);
  const [branches, setBranches] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branchId, setBranchId] = useState("");
  const [role, setRole] = useState("staff");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setLoadError("");

      try {
        const [branchItems, userItems] = await Promise.all([
          getBranches(),
          getUsers(),
        ]);

        if (!isMounted) return;

        const currentUser =
          userItems.find((item) => String(item.id) === String(id)) || null;

        setBranches(branchItems);
        setUser(currentUser);
        setName(currentUser?.name || "");
        setEmail(currentUser?.email || "");
        setPassword("");
        setBranchId(currentUser?.branchId ?? branchItems[0]?.id ?? "");
        setRole(currentUser?.role === "admin" ? "admin" : "staff");
      } catch (fetchError) {
        if (!isMounted) return;
        setLoadError(
          fetchError?.response?.data?.message ||
            "No se pudo cargar la informacion del usuario."
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="page">
        <div className="admin-card">
          <h1>Editar usuario</h1>
          <p>Cargando los datos del usuario...</p>
        </div>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="page">
        <div className="admin-card">
          <h1>Editar usuario</h1>
          <p className="error-text">{loadError}</p>
          <Link className="btn" to="/admin/usuarios">
            Volver al listado
          </Link>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="page">
        <div className="admin-card">
          <h1>Usuario no encontrado</h1>
          <Link className="btn" to="/admin/usuarios">
            Volver al listado
          </Link>
        </div>
      </section>
    );
  }

  const onSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Nombre es requerido.");
    if (!email.trim()) return setError("Email es requerido.");
    if (!branchId) return setError("Sucursal es requerida.");

    try {
      await updateUser(user.id, {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        branchId,
        role,
      });

      navigate("/admin/usuarios", { replace: true });
    } catch (saveError) {
      const backendMessage = saveError?.response?.data?.message;
      const validationErrors = saveError?.response?.data?.errors;
      const firstValidationError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;

      setError(
        firstValidationError || backendMessage || "No se pudo actualizar el usuario."
      );
    }
  };

  return (
    <section className="page">
      <div className="admin-header">
        <h1>Editar usuario</h1>
        <p>
          Identificador: <code>{user.id}</code>
        </p>
      </div>

      <div className="admin-panel">
        {error && <p className="error-text">{error}</p>}

        <form className="form" onSubmit={onSave}>
          <label className="field">
            <span>Nombre</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Marta García"
            />
          </label>

          <label className="field">
            <span>Correo electrónico</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="empleado@pizzeria.es"
            />
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              placeholder="Déjala en blanco si no quieres cambiarla"
            />
          </label>

          <label className="field">
            <span>Perfil</span>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="staff">Personal</option>
              <option value="admin">Administrador</option>
            </select>
          </label>

          <label className="field">
            <span>Sucursal</span>
            <select value={branchId} onChange={(e) => setBranchId(e.target.value)}>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>

          <div className="actions-row">
            <button className="btn" type="submit">
              Guardar cambios
            </button>
            <Link className="btn btn--ghost" to="/admin/usuarios">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
