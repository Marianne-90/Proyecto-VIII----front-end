import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBranches } from "../../services/branchesApi";
import { createUser, deleteUser, getUsers } from "../../services/usersApi";

export default function Usuarios() {
  const [q, setQ] = useState("");
  const [branchId, setBranchId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Form crear usuario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newRole, setNewRole] = useState("staff");
  const [newBranchId, setNewBranchId] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setLoadError("");

      try {
        const [branchItems, userItems] = await Promise.all([
          getBranches(),
          getUsers({
            q: q || undefined,
            branch_id: branchId || undefined,
          }),
        ]);

        if (!isMounted) return;

        setBranches(branchItems);
        setUsers(userItems);
        setNewBranchId((current) => current || branchItems[0]?.id || "");
      } catch (error) {
        if (!isMounted) return;
        setLoadError(
          error?.response?.data?.message || "No se ha podido cargar el personal."
        );
        setUsers([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void refreshKey;
    loadData();

    return () => {
      isMounted = false;
    };
  }, [q, branchId, refreshKey]);

  const getBranchName = (id) => {
    const branch = branches.find((item) => String(item.id) === String(id));
    return branch?.name || "—";
  };

  const onCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) return setFormError("Nombre es requerido.");
    if (!email.trim()) return setFormError("Email es requerido.");
    if (!newBranchId) return setFormError("Sucursal es requerida.");

    try {
      await createUser({
        name: name.trim(),
        email: email.trim(),
        password,
        branchId: newBranchId,
        role: newRole,
      });

      setName("");
      setEmail("");
      setPassword("");
      setNewRole("staff");
      setNewBranchId(branches[0]?.id || "");
      setRefreshKey((k) => k + 1);
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      const validationErrors = error?.response?.data?.errors;
      const firstValidationError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;

      setFormError(
        firstValidationError || backendMessage || "No se pudo crear el usuario."
      );
    }
  };

  const onDelete = async (id, emailToShow) => {
    const ok = window.confirm(`¿Eliminar usuario ${emailToShow}?`);
    if (!ok) return;

    try {
      await deleteUser(id);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      alert(
        error?.response?.data?.message || "No se pudo eliminar el usuario."
      );
    }
  };

  return (
    <section className="page">
      <div className="admin-header">
        <h1>Usuarios</h1>
        <p>Gestiona el personal y los accesos del panel de la pizzería.</p>
      </div>

      <div className="admin-grid">
        <div className="admin-panel">
          <div className="admin-panel__header">
            <h2>Listado</h2>
            <div className="admin-filters">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por nombre o correo electrónico…"
                aria-label="Buscar"
              />
              <select value={branchId} onChange={(e) => setBranchId(e.target.value)} aria-label="Sucursal">
                <option value="">Todas las sucursales</option>
                {branches.map((b) => (
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
                {loading && (
                  <tr>
                    <td colSpan="5" style={{ color: "var(--muted)" }}>
                      Cargando el personal...
                    </td>
                  </tr>
                )}

                {!loading && loadError && (
                  <tr>
                    <td colSpan="5" className="error-text">
                      {loadError}
                    </td>
                  </tr>
                )}

                {!loading && !loadError && users.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ color: "var(--muted)" }}>
                      No hay personal que coincida con la búsqueda.
                    </td>
                  </tr>
                )}

                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{getBranchName(u.branchId)}</td>
                    <td>{u.role === "admin" ? "Administrador" : "Personal"}</td>
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
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Marta García" />
            </label>

            <label className="field">
              <span>Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="empleado@pizzeria.es"
                type="email"
              />
            </label>

            <label className="field">
              <span>Contraseña</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                type="password"
              />
            </label>

            <label className="field">
              <span>Perfil</span>
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <option value="staff">Personal</option>
                <option value="admin">Administrador</option>
              </select>
            </label>

            <label className="field">
              <span>Sucursal</span>
              <select value={newBranchId} onChange={(e) => setNewBranchId(e.target.value)}>
                {branches.map((b) => (
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
