import crypto from "crypto";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 1000 * 60 * 5; // 5 minutes

// In-process failed-attempt tracker. On serverless this resets on cold
// starts; it still slows brute force within a warm instance. A distributed
// lockout would require a DB table — documented in README.
const attempts: Map<string, { count: number; firstAt: number }> = new Map();

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export function getAdminPin(): string | null {
  const pin = process.env.ADMIN_PIN;
  if (!pin) return null;
  return pin;
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Equalize timing without leaking the length difference.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry) return false;
  if (now - entry.firstAt > WINDOW_MS) {
    attempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now });
  } else {
    entry.count += 1;
  }
}

/**
 * Verifies a request's admin identity. Accepts either:
 *  - `Authorization: Bearer <pin>` (existing admin UI flow), or
 *  - a valid httpOnly `admin_session` cookie (issued by /api/admin/login).
 *
 * Fails closed: if ADMIN_PIN is not configured, no request is authorized.
 * Timing-safe comparison and per-IP rate limiting protect the PIN path.
 */
export function isAuthorized(req: Request): boolean {
  // 1. Cookie session (no PIN exposure).
  const cookie = parseCookies(req.headers.get("cookie"));
  const token = cookie[COOKIE_NAME];
  if (token && verifySessionToken(token)) return true;

  // 2. Bearer PIN.
  const auth = req.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return false;

  const pin = getAdminPin();
  if (!pin) return false; // fail closed: no default PIN

  const ip = clientIp(req);
  if (isRateLimited(ip)) return false;

  const provided = auth.slice("Bearer ".length).trim();
  if (timingSafeEqualStr(provided, pin)) {
    attempts.delete(ip);
    return true;
  }
  recordFailure(ip);
  return false;
}

// Backwards-compatible alias used by routes.
export function checkPin(req: Request): boolean {
  return isAuthorized(req);
}

// ---------- Session cookie ----------

function sessionSecret(): string {
  // Reuse ADMIN_PIN as the signing secret if ADMIN_AUTH_SECRET isn't set,
  // so a single env var is sufficient to enable sessions.
  return process.env.ADMIN_AUTH_SECRET ?? getAdminPin() ?? "";
}

export function issueSessionToken(): string {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  const sig = crypto
    .createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): boolean {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = crypto
    .createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export function sessionCookieHeader(): string {
  return `${COOKIE_NAME}=${issueSessionToken()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

export function clearSessionCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}

function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    out[k] = v;
  }
  return out;
}
