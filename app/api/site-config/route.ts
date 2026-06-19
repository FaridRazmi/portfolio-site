import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
  revalidatePath("/");
  return NextResponse.json(body);
}
