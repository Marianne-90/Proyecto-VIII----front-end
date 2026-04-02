import { useEffect, useState } from "react";
import {
  createBranch,
  deleteBranch,
  getBranches,
  updateBranch,
} from "../../services/branchesApi";
import { getUsers } from "../../services/usersApi";

export default function Sucursales() {
  const [q, setQ] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // create form
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState("");

  // edit state
  const [editing, setEditing] = useState(null); // {id, name, code}
  const [editError, setEditError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadBranches() {
      setLoading(true);
      setLoadError("");

      try {
        const [items, userItems] = await Promise.all([getBranches(), getUsers()]);
        if (!isMounted) return;

        const query = q.trim().toLowerCase();
        const filtered = items.filter((branch) => {
          if (!query) return true;
          return (
            branch.name?.toLowerCase().includes(query) ||
            branch.code?.toLowerCase().includes(query) ||
            String(branch.id).toLowerCase().includes(query)
          );
        });

        setBranches(filtered);
        setUsers(userItems);
      } catch (error) {
        if (!isMounted) return;
        setLoadError(
          error?.response?.data?.message || "No se han podido cargar las sucursales."
        );
        setBranches([]);
        setUsers([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadBranches();

    return () => {
      isMounted = false;
    };
  }, [q, refreshKey]);

  const onCreate = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      await createBranch({
        name: name.trim(),
        code: code.trim(),
      });

      setName("");
      setCode("");
      setRefreshKey((k) => k + 1);
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      const validationErrors = error?.response?.data?.errors;
      const firstValidationError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;

      setFormError(
        firstValidationError || backendMessage || "No se pudo crear la sucursal."
      );
    }
  };

  const startEdit = (b) => {
    setEditError("");
    setEditing({ id: b.id, name: b.name, code: b.code });
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditError("");
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setEditError("");

    try {
      await updateBranch(editing.id, {
        name: editing.name.trim(),
        code: editing.code.trim(),
      });

      setEditing(null);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      const validationErrors = error?.response?.data?.errors;
      const firstValidationError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;

      setEditError(
        firstValidationError || backendMessage || "No se pudo actualizar la sucursal."
      );
    }
  };

  const onDelete = async (b) => {
    const ok = window.confirm(`¿Eliminar sucursal "${b.name}"?`);
    if (!ok) return;

    try {
      await deleteBranch(b.id);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      alert(
        error?.response?.data?.message || "No se pudo eliminar la sucursal."
      );
    }
  };

  const countUsersByBranch = (branchId) => {
    return users.filter((user) => String(user.branchId) === String(branchId)).length;
  };

  return (
    <section className="page">
      <div className="admin-header">
        <h1>Sucursales</h1>
        <p>Gestiona las sucursales desde las que opera la pizzería.</p>
      </div>

      <div className="admin-grid">
        {/* LIST */}
        <div className="admin-panel">
          <div className="admin-panel__header">
            <h2>Listado</h2>
            <div className="admin-filters">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por nombre o código…"
                aria-label="Buscar sucursal"
              />
            </div>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Código</th>
                  <th>Usuarios</th>
                  <th className="col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="4" style={{ color: "var(--muted)" }}>
                      Cargando las sucursales...
                    </td>
                  </tr>
                )}

                {!loading && loadError && (
                  <tr>
                    <td colSpan="4" className="error-text">
                      {loadError}
                    </td>
                  </tr>
                )}

                {!loading && !loadError && branches.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ color: "var(--muted)" }}>
                      No hay sucursales que coincidan con la búsqueda actual.
                    </td>
                  </tr>
                )}

                {branches.map((b) => {
                  const usersCount = countUsersByBranch(b.id);

                  return (
                    <tr key={b.id}>
                      <td>{b.name}</td>
                      <td>
                        <code>{b.code}</code>
                      </td>
                      <td>{usersCount}</td>
                      <td className="col-actions">
                        <button className="btn btn--small" onClick={() => startEdit(b)}>
                          Editar
                        </button>
                        <button
                          className="btn btn--small btn--danger"
                          onClick={() => onDelete(b)}
                          title="Eliminar sucursal"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p style={{ marginTop: "0.75rem", color: "var(--muted)" }}>
            El número de usuarios se calcula a partir del listado real del personal asignado a cada sucursal.
          </p>
        </div>

        {/* CREATE / EDIT */}
        <div className="admin-panel">
          {!editing && (
            <>
              <div className="admin-panel__header">
                <h2>Crear sucursal</h2>
              </div>

              {formError && <p className="error-text">{formError}</p>}

              <form className="form" onSubmit={onCreate}>
                <label className="field">
                  <span>Nombre</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Madrid Centro" />
                </label>

                <label className="field">
                  <span>Código</span>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ej. MAD-CENTRO"
                  />
                </label>

                <button className="btn" type="submit">
                  Crear sucursal
                </button>
              </form>
            </>
          )}

          {editing && (
            <>
              <div className="admin-panel__header">
                <h2>Editar sucursal</h2>
              </div>

              <p style={{ marginTop: 0, color: "var(--muted)" }}>
                Identificador: <code>{editing.id}</code>
              </p>

              {editError && <p className="error-text">{editError}</p>}

              <form className="form" onSubmit={saveEdit}>
                <label className="field">
                  <span>Nombre</span>
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing((v) => ({ ...v, name: e.target.value }))}
                  />
                </label>

                <label className="field">
                  <span>Código</span>
                  <input
                    value={editing.code}
                    onChange={(e) => setEditing((v) => ({ ...v, code: e.target.value }))}
                  />
                </label>

                <div className="actions-row">
                  <button className="btn" type="submit">
                    Guardar cambios
                  </button>
                  <button className="btn btn--ghost" type="button" onClick={cancelEdit}>
                    Cancelar
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
