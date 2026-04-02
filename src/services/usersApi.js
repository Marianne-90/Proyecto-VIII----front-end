import { http } from "./http";

export function normalizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    branchId: user.branch_id ?? null,
    branch: user.branch ?? null,
  };
}

export async function getUsers(params = {}) {
  const { data } = await http.get("/users", { params });
  const items = Array.isArray(data?.data) ? data.data : [];
  return items.map(normalizeUser);
}

export async function createUser(payload) {
  const requestBody = {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role,
    branch_id: payload.branchId || null,
  };

  const { data } = await http.post("/users", requestBody);
  return {
    message: data?.message || "Usuario creado",
    data: normalizeUser(data?.data),
  };
}

export async function updateUser(id, payload) {
  const requestBody = {
    name: payload.name,
    email: payload.email,
    role: payload.role,
    branch_id: payload.branchId || null,
  };

  if (payload.password) {
    requestBody.password = payload.password;
  }

  const { data } = await http.put(`/users/${id}`, requestBody);
  return {
    message: data?.message || "Usuario actualizado",
    data: normalizeUser(data?.data),
  };
}

export async function deleteUser(id) {
  const { data } = await http.delete(`/users/${id}`);
  return {
    message: data?.message || "Usuario eliminado",
  };
}
