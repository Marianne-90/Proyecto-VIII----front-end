import { getCookie, setCookie } from "./cookies";

const PRODUCTS_COOKIE = "demo_products_v1";

const SEED_PRODUCTS = [
  {
    id: "p-1",
    name: "Pizza Margarita",
    sku: "PIZ-MARG",
    description: "Clásica con tomate y mozzarella",
    price: 129.0,
    stock: 20,
    branchId: "mx-roma",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p-2",
    name: "Pizza Pepperoni",
    sku: "PIZ-PEPP",
    description: "Pepperoni + queso",
    price: 149.0,
    stock: 12,
    branchId: "mx-polanco",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p-3",
    name: "Hamburguesa Clásica",
    sku: "HAM-CLAS",
    description: "Res, lechuga, tomate",
    price: 119.0,
    stock: 15,
    branchId: "gdl-centro",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p-4",
    name: "Refresco 355ml",
    sku: "BEB-REF-355",
    description: "Sabor cola",
    price: 25.0,
    stock: 60,
    branchId: "mx-roma",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p-5",
    name: "Papas Fritas",
    sku: "SNK-PAP",
    description: "Porción mediana",
    price: 39.0,
    stock: 30,
    branchId: "mty-sanpedro",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function newId() {
  return "p-" + Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

function normalizeSku(sku) {
  return String(sku || "").trim().toUpperCase().replace(/\s+/g, "-");
}

function canAccessBranch(actor, branchId) {
  if (!actor) return false;
  if (actor.role === "admin") return true;
  return actor.role === "staff" && actor.branchId === branchId;
}

export function loadProducts() {
  const raw = getCookie(PRODUCTS_COOKIE);
  if (!raw) {
    setCookie(PRODUCTS_COOKIE, JSON.stringify(SEED_PRODUCTS), 30);
    return [...SEED_PRODUCTS];
  }
  const products = safeParse(raw, []);
  if (!Array.isArray(products) || products.length === 0) {
    setCookie(PRODUCTS_COOKIE, JSON.stringify(SEED_PRODUCTS), 30);
    return [...SEED_PRODUCTS];
  }
  return products;
}

export function saveProducts(products) {
  setCookie(PRODUCTS_COOKIE, JSON.stringify(products), 30);
}

/**
 * Listado con filtros:
 * - q: texto libre (name, sku, description)
 * - branchId: sucursal exacta
 * - sku: sku exacto
 * - actor: para aplicar alcance de staff
 */
export function listProducts({ q = "", branchId = "", sku = "", actor } = {}) {
  const products = loadProducts();
  const query = q.trim().toLowerCase();
  const skuExact = normalizeSku(sku);

  return products
    .filter((p) => {
      // Enforce alcance por rol
      if (actor?.role === "staff" && p.branchId !== actor.branchId) return false;

      const matchesBranch = !branchId || p.branchId === branchId;
      const matchesSku = !skuExact || normalizeSku(p.sku) === skuExact;

      const haystack = `${p.name || ""} ${p.sku || ""} ${p.description || ""}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);

      return matchesBranch && matchesSku && matchesQuery;
    })
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getProductById(id) {
  const products = loadProducts();
  return products.find((p) => p.id === id) || null;
}

export function createProduct(data, { actor } = {}) {
  if (!actor) return { ok: false, error: "No autenticado." };

  const name = String(data?.name || "").trim();
  const sku = normalizeSku(data?.sku);
  const description = String(data?.description || "").trim();
  const price = Number(data?.price);
  const stock = Number(data?.stock);
  const branchId = String(data?.branchId || "").trim();

  if (!name) return { ok: false, error: "Nombre es requerido." };
  if (!sku) return { ok: false, error: "SKU es requerido." };
  if (!branchId) return { ok: false, error: "Sucursal es requerida." };
  if (!Number.isFinite(price) || price < 0) return { ok: false, error: "Precio inválido." };
  if (!Number.isFinite(stock) || stock < 0) return { ok: false, error: "Stock inválido." };

  // Enforce rol
  if (!canAccessBranch(actor, branchId)) {
    return { ok: false, error: "No tienes permisos para crear productos en esa sucursal." };
  }

  const products = loadProducts();

  // SKU único por sucursal (decisión práctica). En backend puedes hacer unique(sku, branch_id)
  const taken = products.some((p) => normalizeSku(p.sku) === sku && p.branchId === branchId);
  if (taken) return { ok: false, error: "Ya existe un producto con ese SKU en esa sucursal." };

  const now = new Date().toISOString();
  const product = {
    id: newId(),
    name,
    sku,
    description,
    price,
    stock,
    branchId,
    createdAt: now,
    updatedAt: now,
  };

  products.push(product);
  saveProducts(products);
  return { ok: true, product };
}

export function updateProduct(id, patch, { actor } = {}) {
  if (!actor) return { ok: false, error: "No autenticado." };

  const products = loadProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return { ok: false, error: "Producto no encontrado." };

  const current = products[idx];

  // Enforce: staff solo puede editar productos de su sucursal
  if (!canAccessBranch(actor, current.branchId)) {
    return { ok: false, error: "No tienes permisos para editar este producto." };
  }

  const nextName = patch.name != null ? String(patch.name).trim() : current.name;
  const nextSku = patch.sku != null ? normalizeSku(patch.sku) : normalizeSku(current.sku);
  const nextDesc = patch.description != null ? String(patch.description).trim() : current.description;
  const nextPrice = patch.price != null ? Number(patch.price) : Number(current.price);
  const nextStock = patch.stock != null ? Number(patch.stock) : Number(current.stock);

  // BranchId: admin puede mover, staff NO.
  const requestedBranchId = patch.branchId != null ? String(patch.branchId).trim() : current.branchId;

  if (!nextName) return { ok: false, error: "Nombre es requerido." };
  if (!nextSku) return { ok: false, error: "SKU es requerido." };
  if (!Number.isFinite(nextPrice) || nextPrice < 0) return { ok: false, error: "Precio inválido." };
  if (!Number.isFinite(nextStock) || nextStock < 0) return { ok: false, error: "Stock inválido." };

  if (actor.role === "staff" && requestedBranchId !== current.branchId) {
    return { ok: false, error: "Staff no puede cambiar la sucursal de un producto." };
  }

  if (!canAccessBranch(actor, requestedBranchId)) {
    return { ok: false, error: "No tienes permisos sobre la sucursal destino." };
  }

  // Validación SKU único por sucursal
  const taken = products.some(
    (p) =>
      p.id !== id &&
      p.branchId === requestedBranchId &&
      normalizeSku(p.sku) === nextSku
  );
  if (taken) return { ok: false, error: "Ese SKU ya existe en la sucursal seleccionada." };

  const now = new Date().toISOString();
  products[idx] = {
    ...current,
    name: nextName,
    sku: nextSku,
    description: nextDesc,
    price: nextPrice,
    stock: nextStock,
    branchId: requestedBranchId,
    updatedAt: now,
  };

  saveProducts(products);
  return { ok: true, product: products[idx] };
}

export function deleteProduct(id, { actor } = {}) {
  if (!actor) return { ok: false, error: "No autenticado." };

  const products = loadProducts();
  const target = products.find((p) => p.id === id);
  if (!target) return { ok: false, error: "Producto no encontrado." };

  if (!canAccessBranch(actor, target.branchId)) {
    return { ok: false, error: "No tienes permisos para eliminar este producto." };
  }

  const next = products.filter((p) => p.id !== id);
  saveProducts(next);
  return { ok: true };
}

/** Para construir un selector de producto (SKU) */
export function listUniqueSkus({ actor, branchId = "" } = {}) {
  const items = listProducts({ actor, branchId, q: "", sku: "" });
  const map = new Map();
  for (const p of items) {
    const key = normalizeSku(p.sku);
    if (!map.has(key)) map.set(key, { sku: key, name: p.name });
  }
  return Array.from(map.values()).sort((a, b) => (a.sku > b.sku ? 1 : -1));
}