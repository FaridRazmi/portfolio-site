import { NextResponse } from "next/server";
import { isAuthorized, sessionCookieHeader, clientIp, isRateLimited } from "@/app/api/_auth";

// POST /api/admin/login — verify PIN, issue httpOnly session cookie
export async function POST(req: Request) {
  if (!process.env.ADMIN_AUTH_SECRET) {
    return NextResponse.json(
      { error: "Server misconfigured: ADMIN_AUTH_SECRET is not set" },
      { status: 500 },
    );
  }

  const { pin } = await req.json().catch(() => ({ pin: undefined }));
  if (typeof pin !== "string" || !pin) {
    return NextResponse.json({ error: "PIN required" }, { status: 400 });
  }

  // Surface the lockout clearly instead of a generic 401, so the UI can tell
  // the user "too many attempts" rather than "wrong PIN".
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429 },
    );
  }

  // Preserve the client's IP headers on the probe so rate limiting keys off
  // the real IP (not "unknown"), matching the rest of the auth flow.
  const probe = new Request(req.url, {
    headers: {
      authorization: `Bearer ${pin}`,
      "x-forwarded-for": req.headers.get("x-forwarded-for") ?? "",
      "x-real-ip": req.headers.get("x-real-ip") ?? "",
    },
  });
  if (!isAuthorized(probe)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { ok: true },
    { headers: { "Set-Cookie": sessionCookieHeader() } },
  );
}
