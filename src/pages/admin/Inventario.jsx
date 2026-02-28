import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { listBranches, branchName } from "../../services/branchesStore";
import {
  createProduct,
  deleteProduct,
  listProducts,
  listUniqueSkus,
  updateProduct,
} from "../../services/productsStore";

export default function Inventario() {
  const { user, role, branchId: myBranchId } = useAuth();
  const isAdmin = role === "admin";

  const branches = useMemo(() => listBranches(), []);

  // Filtros
  const [q, setQ] = useState("");
  const [filterBranchId, setFilterBranchId] = useState(""); // admin only ("" = todas)
  const [filterSku, setFilterSku] = useState(""); // SKU exacto
  const [refreshKey, setRefreshKey] = useState(0);

  // Editor (crear/editar)
  const [editing, setEditing] = useState(null); // null o {id,...}
  const [formError, setFormError] = useState("");

  const actor = useMemo(() => {
    return {
      id: user?.id,
      role,
      branchId: myBranchId,
    };
  }, [user?.id, role, myBranchId]);

  const effectiveBranchFilter = useMemo(() => {
    // staff: filtro forzado a su sucursal
    if (!isAdmin) return myBranchId;
    return filterBranchId;
  }, [isAdmin, filterBranchId, myBranchId]);

  const products = useMemo(() => {
    void refreshKey;
    return listProducts({
      actor,
      q,
      branchId: effectiveBranchFilter,
      sku: filterSku,
    });
  }, [actor, q, effectiveBranchFilter, filterSku, refreshKey]);

  const skuOptions = useMemo(() => {
    // SKU selector respeta el branch actual (admin puede filtrar por sucursal, staff está forzado)
    return listUniqueSkus({ actor, branchId: effectiveBranchFilter });
  }, [actor, effectiveBranchFilter, refreshKey]);

  const openCreate = () => {
    setFormError("");
    const defaultBranch = isAdmin ? (effectiveBranchFilter || branches[0]?.id || "") : myBranchId;

    setEditing({
      mode: "create",
      id: "",
      name: "",
      sku: "",
      description: "",
      price: 0,
      stock: 0,
      branchId: defaultBranch,
    });
  };

  const openEdit = (p) => {
    setFormError("");
    setEditing({
      mode: "edit",
      id: p.id,
      name: p.name,
      sku: p.sku,
      description: p.description || "",
      price: p.price,
      stock: p.stock,
      branchId: p.branchId,
    });
  };

  const closeEditor = () => {
    setEditing(null);
    setFormError("");
  };

  const onSave = (e) => {
    e.preventDefault();
    setFormError("");

    if (!editing) return;

    const payload = {
      name: editing.name,
      sku: editing.sku,
      description: editing.description,
      price: editing.price,
      stock: editing.stock,
      branchId: editing.branchId,
    };

    const res =
      editing.mode === "create"
        ? createProduct(payload, { actor })
        : updateProduct(editing.id, payload, { actor });

    if (!res.ok) {
      setFormError(res.error);
      return;
    }

    setEditing(null);
    setRefreshKey((k) => k + 1);
  };

  const onDelete = (p) => {
    const ok = window.confirm(`¿Eliminar "${p.name}" (${p.sku})?`);
    if (!ok) return;

    const res = deleteProduct(p.id, { actor });
    if (!res.ok) {
      alert(res.error);
      return;
    }
    setRefreshKey((k) => k + 1);
  };

  return (
    <section className="page">
      <div className="admin-header">
        <h1>Inventario / Productos</h1>
        <p>
          {isAdmin ? (
            <>
              Rol <b>admin</b>: ves y gestionas todas las sucursales.
            </>
          ) : (
            <>
              Rol <b>staff</b>: solo puedes gestionar tu sucursal:{" "}
              <b>{branchName(myBranchId)}</b>
            </>
          )}
        </p>
      </div>

      <div className="admin-grid">
        {/* LISTADO + FILTROS */}
        <div className="admin-panel">
          <div className="admin-panel__header">
            <h2>Productos</h2>

            <div className="admin-filters">
              {/* Sucursal (solo admin) */}
              {isAdmin && (
                <select
                  value={filterBranchId}
                  onChange={(e) => setFilterBranchId(e.target.value)}
                  aria-label="Filtrar por sucursal"
                >
                  <option value="">Todas las sucursales</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Producto por SKU exacto */}
              <select
                value={filterSku}
                onChange={(e) => setFilterSku(e.target.value)}
                aria-label="Filtrar por producto (SKU)"
              >
                <option value="">Todos los productos (SKU)</option>
                {skuOptions.map((o) => (
                  <option key={o.sku} value={o.sku}>
                    {o.sku} — {o.name}
                  </option>
                ))}
              </select>

              {/* Búsqueda texto */}
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar (nombre, sku, descripción)…"
                aria-label="Buscar texto"
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button className="btn" onClick={openCreate}>
              + Nuevo producto
            </button>

            <button
              className="btn btn--ghost"
              onClick={() => {
                setQ("");
                setFilterSku("");
                if (isAdmin) setFilterBranchId("");
              }}
            >
              Limpiar filtros
            </button>

            <div style={{ marginLeft: "auto", color: "var(--muted)", fontSize: "0.9rem" }}>
              Mostrando: <b>{products.length}</b>
            </div>
          </div>

          <div className="table-wrap" style={{ marginTop: "0.75rem" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>SKU</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Sucursal</th>
                  <th className="col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ color: "var(--muted)" }}>
                      No hay productos que coincidan con los filtros.
                    </td>
                  </tr>
                )}

                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      {p.description ? (
                        <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                          {p.description}
                        </div>
                      ) : null}
                    </td>
                    <td>
                      <code>{p.sku}</code>
                    </td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td>{branchName(p.branchId)}</td>
                    <td className="col-actions">
                      <button className="btn btn--small" onClick={() => openEdit(p)}>
                        Editar
                      </button>
                      <button className="btn btn--small btn--danger" onClick={() => onDelete(p)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* EDITOR */}
        <div className="admin-panel">
          <div className="admin-panel__header">
            <h2>{editing ? (editing.mode === "create" ? "Crear producto" : "Editar producto") : "Editor"}</h2>
          </div>

          {!editing && (
            <p style={{ color: "var(--muted)" }}>
              Selecciona “Nuevo producto” o “Editar” en un producto para empezar.
            </p>
          )}

          {editing && (
            <>
              {formError && <p className="error-text">{formError}</p>}

              <form className="form" onSubmit={onSave}>
                <label className="field">
                  <span>Nombre</span>
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing((v) => ({ ...v, name: e.target.value }))}
                    placeholder="Ej. Tacos al pastor"
                  />
                </label>

                <label className="field">
                  <span>SKU</span>
                  <input
                    value={editing.sku}
                    onChange={(e) => setEditing((v) => ({ ...v, sku: e.target.value }))}
                    placeholder="Ej. TAC-PAST"
                  />
                </label>

                <label className="field">
                  <span>Descripción</span>
                  <input
                    value={editing.description}
                    onChange={(e) => setEditing((v) => ({ ...v, description: e.target.value }))}
                    placeholder="Opcional"
                  />
                </label>

                <label className="field">
                  <span>Precio</span>
                  <input
                    type="number"
                    step="0.01"
                    value={editing.price}
                    onChange={(e) => setEditing((v) => ({ ...v, price: e.target.value }))}
                  />
                </label>

                <label className="field">
                  <span>Stock</span>
                  <input
                    type="number"
                    step="1"
                    value={editing.stock}
                    onChange={(e) => setEditing((v) => ({ ...v, stock: e.target.value }))}
                  />
                </label>

                <label className="field">
                  <span>Sucursal</span>
                  <select
                    value={editing.branchId}
                    onChange={(e) => setEditing((v) => ({ ...v, branchId: e.target.value }))}
                    disabled={!isAdmin} // ✅ staff no puede cambiar ni elegir otra sucursal
                    title={!isAdmin ? "Staff solo puede usar su sucursal asignada" : ""}
                  >
                    {isAdmin ? (
                      branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))
                    ) : (
                      <option value={myBranchId}>{branchName(myBranchId)}</option>
                    )}
                  </select>
                </label>

                <div className="actions-row">
                  <button className="btn" type="submit">
                    {editing.mode === "create" ? "Crear" : "Guardar"}
                  </button>
                  <button className="btn btn--ghost" type="button" onClick={closeEditor}>
                    Cancelar
                  </button>
                </div>

                <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  Nota: validaciones y permisos se aplican también en el store (dummy) para simular backend.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}