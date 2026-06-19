import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkPin } from "@/app/api/_auth";
import {
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/data-store";

// DELETE /api/testimonials/:id
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  deleteTestimonial(id);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

// PUT /api/testimonials/:id
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  updateTestimonial(id, body);
  const updated = getTestimonials().find((t) => t.id === id);
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json(updated);
}
