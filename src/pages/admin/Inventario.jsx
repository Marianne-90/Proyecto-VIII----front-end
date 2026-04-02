import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getBranches } from "../../services/branchesApi";
import {
  createProduct as createProductApi,
  deleteProduct as deleteProductApi,
  getProducts,
  updateProduct as updateProductApi,
} from "../../services/productsApi";

export default function Inventario() {
  const { user, role, branchId: myBranchId } = useAuth();
  const isAdmin = role === "admin";
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  // Filtros
  const [q, setQ] = useState("");
  const [filterBranchId, setFilterBranchId] = useState(""); // admin only ("" = todas)
  const [filterSku, setFilterSku] = useState(""); // SKU exacto
  const [refreshKey, setRefreshKey] = useState(0);

  // Editor (crear/editar)
  const [editing, setEditing] = useState(null); // null o {id,...}
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadBranches() {
      setBranchesLoading(true);

      try {
        const items = await getBranches();
        if (!isMounted) return;
        setBranches(items);
      } catch (error) {
        if (!isMounted) return;
        setBranches([]);
      } finally {
        if (isMounted) setBranchesLoading(false);
      }
    }

    loadBranches();

    return () => {
      isMounted = false;
    };
  }, []);

  const getBranchName = (branchId) => {
    const branch = branches.find((item) => String(item.id) === String(branchId));
    return branch?.name || "—";
  };

  const effectiveBranchFilter = useMemo(() => {
    // staff: filtro forzado a su sucursal
    if (!isAdmin) return myBranchId;
    return filterBranchId;
  }, [isAdmin, filterBranchId, myBranchId]);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setProductsLoading(true);
      setProductsError("");

      try {
        const items = await getProducts({
          q: q || undefined,
          sku: filterSku || undefined,
          branch_id: effectiveBranchFilter || undefined,
        });

        if (!isMounted) return;
        setProducts(items);
      } catch (error) {
        if (!isMounted) return;
        setProducts([]);
        setProductsError(
          error?.response?.data?.message || "No se pudieron cargar los productos."
        );
      } finally {
        if (isMounted) setProductsLoading(false);
      }
    }

    void refreshKey;
    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [q, filterSku, effectiveBranchFilter, refreshKey]);

  const skuOptions = useMemo(() => {
    const map = new Map();

    for (const product of products) {
      if (!map.has(product.sku)) {
        map.set(product.sku, { sku: product.sku, name: product.name });
      }
    }

    return Array.from(map.values()).sort((a, b) => a.sku.localeCompare(b.sku));
  }, [products]);

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

  const onSave = async (e) => {
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

    try {
      if (editing.mode === "create") {
        await createProductApi(payload);
      } else {
        await updateProductApi(editing.id, payload);
      }

      setEditing(null);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      const validationErrors = error?.response?.data?.errors;
      const firstValidationError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;

      setFormError(
        firstValidationError || backendMessage || "No se pudo guardar el producto."
      );
    }
  };

  const onDelete = async (p) => {
    const ok = window.confirm(`¿Eliminar "${p.name}" (${p.sku})?`);
    if (!ok) return;

    try {
      await deleteProductApi(p.id);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      alert(
        error?.response?.data?.message || "No se pudo eliminar el producto."
      );
    }
  };

  return (
    <section className="page">
      <div className="admin-header">
        <h1>Inventario de productos</h1>
        <p>
          {isAdmin ? (
            <>
              Como <b>administrador</b>, puedes consultar y gestionar los productos de todas las sucursales.
            </>
          ) : (
            <>
              Como personal de tienda, solo puedes gestionar los productos de tu sucursal:{" "}
              <b>{getBranchName(myBranchId)}</b>
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
                placeholder="Buscar por nombre, referencia o descripción…"
                aria-label="Buscar texto"
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button className="btn" onClick={openCreate}>
              + Añadir producto
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
              Productos mostrados: <b>{products.length}</b>
            </div>
          </div>

          {branchesLoading && (
            <p style={{ marginTop: "0.75rem", color: "var(--muted)" }}>
              Cargando las sucursales...
            </p>
          )}

          {productsLoading && (
            <p style={{ marginTop: "0.75rem", color: "var(--muted)" }}>
              Cargando el inventario...
            </p>
          )}

          {!productsLoading && productsError && (
            <p className="error-text" style={{ marginTop: "0.75rem" }}>
              {productsError || "No se ha podido cargar el inventario."}
            </p>
          )}

          <div className="table-wrap" style={{ marginTop: "0.75rem" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Referencia</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Sucursal</th>
                  <th className="col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {!productsLoading && !productsError && products.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ color: "var(--muted)" }}>
                      No hay productos que coincidan con la búsqueda actual.
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
                    <td>{getBranchName(p.branchId)}</td>
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
            <h2>{editing ? (editing.mode === "create" ? "Añadir producto" : "Editar producto") : "Detalle del producto"}</h2>
          </div>

          {!editing && (
            <p style={{ color: "var(--muted)" }}>
              Selecciona “Añadir producto” o edita uno existente para empezar.
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
                    placeholder="Ej. Pizza barbacoa"
                  />
                </label>

                <label className="field">
                  <span>Referencia</span>
                  <input
                    value={editing.sku}
                    onChange={(e) => setEditing((v) => ({ ...v, sku: e.target.value }))}
                    placeholder="Ej. PIZ-BARB"
                  />
                </label>

                <label className="field">
                  <span>Descripción</span>
                  <input
                    value={editing.description}
                    onChange={(e) => setEditing((v) => ({ ...v, description: e.target.value }))}
                    placeholder="Ingredientes o notas del producto"
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
                      <option value={myBranchId}>{getBranchName(myBranchId)}</option>
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
                  Los productos se gestionan directamente desde el sistema principal de la pizzería.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
