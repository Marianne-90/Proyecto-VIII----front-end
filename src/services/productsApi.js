import { http } from "./http";

export function normalizeProduct(product) {
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    description: product.description ?? "",
    price: Number(product.price ?? 0),
    stock: Number(product.stock ?? 0),
    branchId: product.branch_id ?? null,
    branch: product.branch ?? null,
  };
}

export async function getProducts(params = {}) {
  const { data } = await http.get("/products", { params });
  const items = Array.isArray(data?.data) ? data.data : [];
  return items.map(normalizeProduct);
}

export async function createProduct(payload) {
  const requestBody = {
    name: payload.name,
    sku: payload.sku,
    description: payload.description || null,
    price: Number(payload.price),
    stock: Number(payload.stock),
    branch_id: payload.branchId,
  };

  const { data } = await http.post("/products", requestBody);
  return {
    message: data?.message || "Producto creado",
    data: normalizeProduct(data?.data),
  };
}

export async function updateProduct(id, payload) {
  const requestBody = {
    name: payload.name,
    sku: payload.sku,
    description: payload.description || null,
    price: Number(payload.price),
    stock: Number(payload.stock),
    branch_id: payload.branchId,
  };

  const { data } = await http.put(`/products/${id}`, requestBody);
  return {
    message: data?.message || "Producto actualizado",
    data: normalizeProduct(data?.data),
  };
}

export async function deleteProduct(id) {
  const { data } = await http.delete(`/products/${id}`);
  return {
    message: data?.message || "Producto eliminado",
  };
}
