import { http } from "./http";

export function normalizeBranch(branch) {
  if (!branch) return null;

  return {
    id: branch.id,
    name: branch.name,
    code: branch.code,
  };
}

export async function getBranches(params = {}) {
  const { data } = await http.get("/branches", { params });
  const items = Array.isArray(data?.data) ? data.data : [];
  return items.map(normalizeBranch);
}

export async function createBranch(payload) {
  const { data } = await http.post("/branches", payload);
  return {
    message: data?.message || "Sucursal creada",
    data: normalizeBranch(data?.data),
  };
}

export async function updateBranch(id, payload) {
  const { data } = await http.put(`/branches/${id}`, payload);
  return {
    message: data?.message || "Sucursal actualizada",
    data: normalizeBranch(data?.data),
  };
}

export async function deleteBranch(id) {
  const { data } = await http.delete(`/branches/${id}`);
  return {
    message: data?.message || "Sucursal eliminada",
  };
}

export function branchLabel(branch) {
  if (!branch) return "—";
  return branch.name || branch.code || `Sucursal #${branch.id}`;
}
