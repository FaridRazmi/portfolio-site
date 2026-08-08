import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/app/api/_auth";
import { getAbout, setAbout } from "@/lib/data-store";

// GET /api/about
export async function GET() {
  return NextResponse.json(await getAbout());
}

// PUT /api/about
export async function PUT(req: Request) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object")
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  await setAbout(body);
  revalidatePath("/", "layout");
  return NextResponse.json(body);
}
