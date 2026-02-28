import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BRANCHES, branchName, createUser, deleteUser, listUsers } from "../../services/usersStore";

export default function Usuarios() {
  const [q, setQ] = useState("");
  const [branchId, setBranchId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Form crear usuario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [newBranchId, setNewBranchId] = useState(BRANCHES[0]?.id || "");
  const [newRole, setNewRole] = useState("staff");
  const [formError, setFormError] = useState("");

  const users = useMemo(() => {
    void refreshKey;
    return listUsers({ q, branchId });
  }, [q, branchId, refreshKey]);

  const onCreate = (e) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) return setFormError("Nombre es requerido.");
    if (!email.trim()) return setFormError("Email es requerido.");
    if (!newBranchId) return setFormError("Sucursal es requerida.");

    const res = createUser({
      name,
      email,
      password,
      branchId: newBranchId,
      role: newRole,
    });

    if (!res.ok) return setFormError(res.error);

    setName("");
    setEmail("");
    setPassword("123456");
    setNewBranchId(BRANCHES[0]?.id || "");
    setNewRole("staff");
    setRefreshKey((k) => k + 1);
  };

  const onDelete = (id, emailToShow) => {
    const ok = window.confirm(`¿Eliminar usuario ${emailToShow}?`);
    if (!ok) return;

    const res = deleteUser(id);
    if (!res.ok) alert(res.error);
    setRefreshKey((k) => k + 1);
  };

  return (
    <section className="page">
      <div className="admin-header">
        <h1>Usuarios</h1>
        <p>Crear, editar y asignar sucursal (demo con cookies). Staff no tiene acceso.</p>
      </div>

      <div className="admin-grid">
        <div className="admin-panel">
          <div className="admin-panel__header">
            <h2>Listado</h2>
            <div className="admin-filters">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por nombre/email…"
                aria-label="Buscar"
              />
              <select value={branchId} onChange={(e) => setBranchId(e.target.value)} aria-label="Sucursal">
                <option value="">Todas las sucursales</option>
                {BRANCHES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Sucursal</th>
                  <th>Rol</th>
                  <th className="col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ color: "var(--muted)" }}>
                      No hay usuarios que coincidan.
                    </td>
                  </tr>
                )}

                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{branchName(u.branchId)}</td>
                    <td>{u.role || "staff"}</td>
                    <td className="col-actions">
                      <Link className="btn btn--small" to={`/admin/usuarios/${u.id}`}>
                        Editar
                      </Link>
                      <button
                        className="btn btn--small btn--danger"
                        onClick={() => onDelete(u.id, u.email)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel__header">
            <h2>Crear usuario</h2>
          </div>

          {formError && <p className="error-text">{formError}</p>}

          <form className="form" onSubmit={onCreate}>
            <label className="field">
              <span>Nombre</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Juan Pérez" />
            </label>

            <label className="field">
              <span>Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@demo.com"
                type="email"
              />
            </label>

            <label className="field">
              <span>Contraseña (demo)</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="123456"
                type="text"
              />
            </label>

            <label className="field">
              <span>Rol</span>
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <option value="staff">staff</option>
                <option value="admin">admin</option>
              </select>
            </label>

            <label className="field">
              <span>Sucursal</span>
              <select value={newBranchId} onChange={(e) => setNewBranchId(e.target.value)}>
                {BRANCHES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>

            <button className="btn" type="submit">
              Crear usuario
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}