import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkPin } from "@/app/api/_auth";
import { getAbout, setAbout } from "@/lib/data-store";

// GET /api/about
export async function GET() {
  return NextResponse.json(getAbout());
}

// PUT /api/about
export async function PUT(req: Request) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  setAbout(body);
  revalidatePath("/", "layout");
  return NextResponse.json(body);
}
