import { NextResponse } from "next/server";
import { checkPin } from "@/app/api/_auth";
import { getSiteConfig, setSiteConfig } from "@/lib/data-store";

// GET /api/site-config
export async function GET() {
  return NextResponse.json(getSiteConfig());
}

// PUT /api/site-config
export async function PUT(req: Request) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  setSiteConfig(body);
  return NextResponse.json(body);
}
