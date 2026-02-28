import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { BRANCHES, branchName } from "../../services/usersStore";

export default function Inventario() {
  const { role, branchId: myBranchId } = useAuth();
  const isAdmin = role === "admin";

  // Admin puede filtrar; staff queda fijo
  const [selectedBranchId, setSelectedBranchId] = useState("");

  const effectiveBranchId = useMemo(() => {
    if (isAdmin) return selectedBranchId; // "" = todas
    return myBranchId; // staff: solo su sucursal
  }, [isAdmin, selectedBranchId, myBranchId]);

  return (
    <section className="page">
      <h1>Inventario</h1>

      {isAdmin ? (
        <div style={{ display: "grid", gap: "0.5rem", maxWidth: 420 }}>
          <p>
            Como <b>admin</b>, puedes ver inventario de <b>todas</b> las sucursales.
          </p>

          <label className="field">
            <span>Filtrar por sucursal</span>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
            >
              <option value="">Todas las sucursales</option>
              {BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>

          <div className="admin-card" style={{ width: "100%" }}>
            <p style={{ margin: 0 }}>
              Viendo:{" "}
              <b>{effectiveBranchId ? branchName(effectiveBranchId) : "Todas"}</b>
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.5rem", maxWidth: 520 }}>
          <p>
            Como <b>staff</b>, solo puedes ver la sucursal asignada a tu usuario.
          </p>

          <div className="admin-card" style={{ width: "100%" }}>
            <p style={{ margin: 0 }}>
              Tu sucursal: <b>{branchName(effectiveBranchId)}</b>
            </p>
          </div>
        </div>
      )}

      <div style={{ marginTop: "1rem" }} className="admin-panel">
        <h2 style={{ marginTop: 0 }}>Listado (placeholder)</h2>
        <p>
          Aquí luego conectaremos a Laravel para traer productos por sucursal:
          <br />
          <code>GET /api/inventario?branch_id=...</code>
        </p>

        <div className="admin-card" style={{ width: "100%" }}>
          <p style={{ margin: 0 }}>
            Branch actual (efectiva):{" "}
            <b>{effectiveBranchId ? effectiveBranchId : "ALL"}</b>
          </p>
        </div>
      </div>
    </section>
  );
}