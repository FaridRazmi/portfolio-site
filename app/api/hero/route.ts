import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkPin } from "@/app/api/_auth";
import { getHeroOverlays, setHeroOverlays } from "@/lib/data-store";

// GET /api/hero
export async function GET() {
  return NextResponse.json({ overlays: getHeroOverlays() });
}

// PUT /api/hero
export async function PUT(req: Request) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  setHeroOverlays(body.overlays);
  revalidatePath("/", "layout");
  return NextResponse.json(body);
}
