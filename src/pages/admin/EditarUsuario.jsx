import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BRANCHES, getUserById, updateUser } from "../../services/usersStore";

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useMemo(() => getUserById(id), [id]);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(user?.password || "");
  const [branchId, setBranchId] = useState(user?.branchId || BRANCHES[0]?.id || "");
  const [error, setError] = useState("");

  if (!user) {
    return (
      <section className="page">
        <div className="admin-card">
          <h1>Usuario no encontrado</h1>
          <Link className="btn" to="/admin/usuarios">
            Volver
          </Link>
        </div>
      </section>
    );
  }

  const onSave = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Nombre es requerido.");
    if (!email.trim()) return setError("Email es requerido.");
    if (!branchId) return setError("Sucursal es requerida.");

    const res = updateUser(user.id, {
      name: name.trim(),
      email: email.trim(),
      password, // demo
      branchId,
    });

    if (!res.ok) return setError(res.error);

    navigate("/admin/usuarios", { replace: true });
  };

  return (
    <section className="page">
      <div className="admin-header">
        <h1>Editar usuario</h1>
        <p>ID: <code>{user.id}</code></p>
      </div>

      <div className="admin-panel">
        {error && <p className="error-text">{error}</p>}

        <form className="form" onSubmit={onSave}>
          <label className="field">
            <span>Nombre</span>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </label>

          <label className="field">
            <span>Contraseña (demo)</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="text" />
          </label>

          <label className="field">
            <span>Sucursal</span>
            <select value={branchId} onChange={(e) => setBranchId(e.target.value)}>
              {BRANCHES.map((b) => (
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