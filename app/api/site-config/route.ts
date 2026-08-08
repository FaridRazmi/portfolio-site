import { NextResponse } from "next/server";
import { isAuthorized } from "@/app/api/_auth";
import { getSiteConfig, setSiteConfig } from "@/lib/data-store";

// GET /api/site-config
export async function GET() {
  return NextResponse.json(await getSiteConfig());
}

// PUT /api/site-config
export async function PUT(req: Request) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object")
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  await setSiteConfig(body);
  return NextResponse.json(body);
}
