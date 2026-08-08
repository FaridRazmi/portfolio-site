import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/app/api/_auth";
import { getStats, setStats } from "@/lib/data-store";

// GET /api/stats
export async function GET() {
  return NextResponse.json({ stats: await getStats() });
}

// PUT /api/stats
export async function PUT(req: Request) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const stats = body?.stats;
  if (!Array.isArray(stats))
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  await setStats(stats);
  revalidatePath("/", "layout");
  return NextResponse.json(body);
}
