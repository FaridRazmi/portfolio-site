import { NextResponse } from "next/server";
import { isAuthorized, sessionCookieHeader } from "@/app/api/_auth";

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

  const probe = new Request(req.url, {
    headers: { authorization: `Bearer ${pin}` },
  });
  if (!isAuthorized(probe)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { ok: true },
    { headers: { "Set-Cookie": sessionCookieHeader() } },
  );
}
