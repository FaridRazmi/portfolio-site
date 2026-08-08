import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/app/api/_auth";
import { getHeroOverlays, setHeroOverlays } from "@/lib/data-store";

// GET /api/hero
export async function GET() {
  return NextResponse.json({ overlays: await getHeroOverlays() });
}

// PUT /api/hero
export async function PUT(req: Request) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const overlays = body?.overlays;
  if (!Array.isArray(overlays))
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  await setHeroOverlays(overlays);
  revalidatePath("/", "layout");
  return NextResponse.json(body);
}
