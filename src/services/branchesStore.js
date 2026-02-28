import { getCookie, setCookie } from "./cookies";

const BRANCHES_COOKIE = "demo_branches_v1";

/**
 * Seed inicial
 * Nota: uso id = code para mantener compatibilidad con los branchId viejos (mx-roma, etc.).
 */
const SEED_BRANCHES = [
  { id: "mx-roma", name: "CDMX - Roma", code: "mx-roma", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "mx-polanco", name: "CDMX - Polanco", code: "mx-polanco", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "gdl-centro", name: "GDL - Centro", code: "gdl-centro", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "mty-sanpedro", name: "MTY - San Pedro", code: "mty-sanpedro", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function normalizeCode(code) {
  return String(code || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
}

export function loadBranches() {
  const raw = getCookie(BRANCHES_COOKIE);
  if (!raw) {
    setCookie(BRANCHES_COOKIE, JSON.stringify(SEED_BRANCHES), 30);
    return [...SEED_BRANCHES];
  }
  const branches = safeParse(raw, []);
  if (!Array.isArray(branches) || branches.length === 0) {
    setCookie(BRANCHES_COOKIE, JSON.stringify(SEED_BRANCHES), 30);
    return [...SEED_BRANCHES];
  }
  return branches;
}

export function saveBranches(branches) {
  setCookie(BRANCHES_COOKIE, JSON.stringify(branches), 30);
}

export function listBranches({ q = "" } = {}) {
  const branches = loadBranches();
  const query = q.trim().toLowerCase();

  return branches
    .filter((b) => {
      if (!query) return true;
      return (
        b.name?.toLowerCase().includes(query) ||
        b.code?.toLowerCase().includes(query) ||
        b.id?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => (a.name > b.name ? 1 : -1));
}

export function getBranchById(id) {
  const branches = loadBranches();
  return branches.find((b) => b.id === id) || null;
}

export function branchName(branchId) {
  return getBranchById(branchId)?.name || "—";
}

export function createBranch({ name, code }) {
  const branches = loadBranches();

  const nextCode = normalizeCode(code || name);
  if (!nextCode) return { ok: false, error: "Código inválido." };

  const exists = branches.some((b) => b.code === nextCode || b.id === nextCode);
  if (exists) return { ok: false, error: "Ya existe una sucursal con ese código." };

  const now = new Date().toISOString();
  const branch = {
    id: nextCode, // id = code
    name: String(name || "").trim(),
    code: nextCode,
    createdAt: now,
    updatedAt: now,
  };

  if (!branch.name) return { ok: false, error: "Nombre es requerido." };

  branches.push(branch);
  saveBranches(branches);
  return { ok: true, branch };
}

export function updateBranch(id, patch) {
  const branches = loadBranches();
  const idx = branches.findIndex((b) => b.id === id);
  if (idx === -1) return { ok: false, error: "Sucursal no encontrada." };

  const nextName = patch.name != null ? String(patch.name).trim() : branches[idx].name;
  const nextCode = patch.code != null ? normalizeCode(patch.code) : branches[idx].code;

  if (!nextName) return { ok: false, error: "Nombre es requerido." };
  if (!nextCode) return { ok: false, error: "Código inválido." };

  // Por simplicidad y compatibilidad: NO cambiamos id en edits.
  // Permitimos cambiar code, pero debe ser único. (En backend probablemente id numérico y code editable)
  const taken = branches.some((b) => b.id !== id && (b.code === nextCode));
  if (taken) return { ok: false, error: "Ese código ya está en uso." };

  const now = new Date().toISOString();
  branches[idx] = {
    ...branches[idx],
    name: nextName,
    code: nextCode,
    updatedAt: now,
  };

  saveBranches(branches);
  return { ok: true, branch: branches[idx] };
}

export function deleteBranch(id) {
  const branches = loadBranches();
  const next = branches.filter((b) => b.id !== id);
  if (next.length === branches.length) return { ok: false, error: "Sucursal no encontrada." };
  saveBranches(next);
  return { ok: true };
}