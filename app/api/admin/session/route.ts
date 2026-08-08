import { NextResponse } from "next/server";
import { isAuthorized } from "@/app/api/_auth";

// GET /api/admin/session — check whether the request has a valid admin session
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
