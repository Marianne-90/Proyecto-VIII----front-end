import { getCookie, setCookie } from "./cookies";

const USERS_COOKIE = "demo_users_v1";

/**
 * Sucursales dummy.
 * En Laravel: tabla branches/sucursales y relación users.branch_id
 */
export const BRANCHES = [
  { id: "mx-roma", name: "CDMX - Roma" },
  { id: "mx-polanco", name: "CDMX - Polanco" },
  { id: "gdl-centro", name: "GDL - Centro" },
  { id: "mty-sanpedro", name: "MTY - San Pedro" },
];

/**
 * Seed inicial dummy.
 * En Laravel: usuarios en DB con password hash.
 */
const SEED_USERS = [
  {
    id: "u-1",
    name: "Admin Demo",
    email: "admin@demo.com",
    password: "123456",
    role: "admin",
    branchId: "mx-roma",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "u-2",
    name: "Operador 1",
    email: "operador1@demo.com",
    password: "123456",
    role: "staff",
    branchId: "gdl-centro",
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
  return "u-" + Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

export function loadUsers() {
  const raw = getCookie(USERS_COOKIE);
  if (!raw) {
    setCookie(USERS_COOKIE, JSON.stringify(SEED_USERS), 30);
    return [...SEED_USERS];
  }
  const users = safeParse(raw, []);
  if (!Array.isArray(users) || users.length === 0) {
    setCookie(USERS_COOKIE, JSON.stringify(SEED_USERS), 30);
    return [...SEED_USERS];
  }
  return users;
}

export function saveUsers(users) {
  setCookie(USERS_COOKIE, JSON.stringify(users), 30);
}

export function listUsers({ q = "", branchId = "" } = {}) {
  const users = loadUsers();
  const query = q.trim().toLowerCase();

  return users
    .filter((u) => {
      const matchesQuery =
        !query ||
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query);
      const matchesBranch = !branchId || u.branchId === branchId;
      return matchesQuery && matchesBranch;
    })
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getUserById(id) {
  const users = loadUsers();
  return users.find((u) => u.id === id) || null;
}

/**
 * Login dummy contra el store (cookies).
 * En Laravel: POST /api/login -> session/token
 */
export function authenticateUser(email, password) {
  const users = loadUsers();
  const e = email.trim().toLowerCase();
  const u = users.find((x) => x.email.trim().toLowerCase() === e);

  if (!u) return { ok: false, error: "Usuario no existe." };
  if ((u.password ?? "") !== (password ?? "")) {
    return { ok: false, error: "Password incorrecta." };
  }

  // Importante: devolvemos user completo (demo). En prod no devolver password.
  return { ok: true, user: u };
}

export function createUser({ name, email, password, branchId, role = "staff" }) {
  const users = loadUsers();

  const emailNormalized = email.trim().toLowerCase();
  if (users.some((u) => u.email.trim().toLowerCase() === emailNormalized)) {
    return { ok: false, error: "Ya existe un usuario con ese email." };
  }

  const now = new Date().toISOString();
  const user = {
    id: newId(),
    name: name.trim(),
    email: emailNormalized,
    password: password ?? "",
    role: role === "admin" ? "admin" : "staff",
    branchId,
    createdAt: now,
    updatedAt: now,
  };

  users.push(user);
  saveUsers(users);
  return { ok: true, user };
}

export function updateUser(id, patch) {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return { ok: false, error: "Usuario no encontrado." };

  const emailNormalized = patch.email ? patch.email.trim().toLowerCase() : null;

  if (emailNormalized) {
    const taken = users.some(
      (u) => u.id !== id && u.email.trim().toLowerCase() === emailNormalized
    );
    if (taken) return { ok: false, error: "Ese email ya está en uso." };
  }

  const now = new Date().toISOString();
  const next = {
    ...users[idx],
    ...patch,
    ...(emailNormalized ? { email: emailNormalized } : {}),
    updatedAt: now,
  };

  // normalizar rol a admin/staff
  if (next.role !== "admin") next.role = "staff";

  users[idx] = next;
  saveUsers(users);
  return { ok: true, user: users[idx] };
}

export function deleteUser(id) {
  const users = loadUsers();
  const next = users.filter((u) => u.id !== id);
  if (next.length === users.length) return { ok: false, error: "Usuario no encontrado." };
  saveUsers(next);
  return { ok: true };
}

export function branchName(branchId) {
  return BRANCHES.find((b) => b.id === branchId)?.name || "—";
}