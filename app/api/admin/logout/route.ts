import { NextResponse } from "next/server";
import { clearSessionCookieHeader } from "@/app/api/_auth";

// POST /api/admin/logout — clear the admin session cookie
export async function POST() {
  return NextResponse.json(
    { ok: true },
    { headers: { "Set-Cookie": clearSessionCookieHeader() } },
  );
}
