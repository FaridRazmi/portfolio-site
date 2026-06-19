import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkPin } from "@/app/api/_auth";
import { getStats, setStats } from "@/lib/data-store";

// GET /api/stats
export async function GET() {
  return NextResponse.json({ stats: getStats() });
}

// PUT /api/stats
export async function PUT(req: Request) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  setStats(body.stats);
  revalidatePath("/", "layout");
  return NextResponse.json(body);
}
