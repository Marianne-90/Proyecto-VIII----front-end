import { useMemo, useState } from "react";
import {
  createBranch,
  deleteBranch,
  listBranches,
  updateBranch,
} from "../../services/branchesStore";
import { countUsersByBranch } from "../../services/usersStore";

export default function Sucursales() {
  const [q, setQ] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // create form
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState("");

  // edit state
  const [editing, setEditing] = useState(null); // {id, name, code}
  const [editError, setEditError] = useState("");

  const branches = useMemo(() => {
    void refreshKey;
    return listBranches({ q });
  }, [q, refreshKey]);

  const onCreate = (e) => {
    e.preventDefault();
    setFormError("");

    const res = createBranch({ name, code });
    if (!res.ok) {
      setFormError(res.error);
      return;
    }

    setName("");
    setCode("");
    setRefreshKey((k) => k + 1);
  };

  const startEdit = (b) => {
    setEditError("");
    setEditing({ id: b.id, name: b.name, code: b.code });
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditError("");
  };

  const saveEdit = (e) => {
    e.preventDefault();
    setEditError("");

    const res = updateBranch(editing.id, { name: editing.name, code: editing.code });
    if (!res.ok) {
      setEditError(res.error);
      return;
    }

    setEditing(null);
    setRefreshKey((k) => k + 1);
  };

  const onDelete = (b) => {
    const usersCount = countUsersByBranch(b.id);
    if (usersCount > 0) {
      alert(`No puedes eliminar "${b.name}" porque tiene ${usersCount} usuario(s) asociados.`);
      return;
    }

    const ok = window.confirm(`¿Eliminar sucursal "${b.name}"?`);
    if (!ok) return;

    const res = deleteBranch(b.id);
    if (!res.ok) alert(res.error);
    setRefreshKey((k) => k + 1);
  };

  return (
    <section className="page">
      <div className="admin-header">
        <h1>Sucursales</h1>
        <p>CRUD dummy en cookies. Regla: no se puede eliminar si hay usuarios asociados.</p>
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
                placeholder="Buscar por nombre/código…"
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
                {branches.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ color: "var(--muted)" }}>
                      No hay sucursales.
                    </td>
                  </tr>
                )}

                {branches.map((b) => {
                  const usersCount = countUsersByBranch(b.id);
                  const cantDelete = usersCount > 0;

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
                          disabled={cantDelete}
                          title={
                            cantDelete
                              ? "No se puede eliminar: hay usuarios asociados"
                              : "Eliminar sucursal"
                          }
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
            Tip: si quieres eliminar una sucursal, primero reasigna o elimina sus usuarios.
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
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. CDMX - Sur" />
                </label>

                <label className="field">
                  <span>Código</span>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ej. mx-sur (si lo dejas vacío se genera desde el nombre)"
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
                ID (fijo): <code>{editing.id}</code>
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