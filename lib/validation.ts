import type { Project } from "@/lib/data-store";

function isStr(v: unknown): v is string {
  return typeof v === "string";
}

function isNum(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function isStrArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every(isStr);
}

/**
 * Validates an incoming project payload. With `partial = true` only present
 * fields are checked (used for PUT patches); otherwise required fields are
 * enforced. Returns a clean object or null when invalid.
 */
export function validateProject(
  raw: unknown,
  partial: true,
): Partial<Project> | null;
export function validateProject(
  raw: unknown,
  partial: false,
): (Partial<Project> & Pick<Project, "title" | "description">) | null;
export function validateProject(
  raw: unknown,
  partial: boolean,
): (Partial<Project> & Pick<Project, "title" | "description">) | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;

  const out: Partial<Project> = {};

  if (r.title !== undefined) {
    if (!isStr(r.title)) return null;
    out.title = r.title.slice(0, 500);
  } else if (!partial) {
    return null;
  }

  if (r.description !== undefined) {
    if (!isStr(r.description)) return null;
    out.description = r.description.slice(0, 5000);
  } else if (!partial) {
    return null;
  }

  if (r.tags !== undefined) {
    if (!isStrArray(r.tags)) return null;
    out.tags = r.tags.map((t) => t.slice(0, 80)).slice(0, 20);
  }

  for (const key of ["col", "row", "colSpan", "rowSpan", "order"] as const) {
    if (r[key] !== undefined) {
      if (!isNum(r[key])) return null;
      out[key] = Math.floor(r[key]);
    }
  }

  if (r.accent !== undefined) {
    if (!isStr(r.accent)) return null;
    out.accent = r.accent.slice(0, 32);
  }

  if (r.link !== undefined) {
    if (!isStr(r.link)) return null;
    if (r.link && !/^(https?:\/\/|\/)/.test(r.link)) return null;
    out.link = r.link.slice(0, 2000);
  }

  if (r.image !== undefined) {
    if (!isStr(r.image)) return null;
    out.image = r.image.slice(0, 2_000_000);
  }

  if (r.id !== undefined && isStr(r.id)) out.id = r.id.slice(0, 100);

  return out as Partial<Project> & Pick<Project, "title" | "description">;
}
