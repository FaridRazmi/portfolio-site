import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/app/api/_auth";
import {
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
  type Testimonial,
} from "@/lib/data-store";

// DELETE /api/testimonials/:id
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteTestimonial(id);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

// PUT /api/testimonials/:id
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object")
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  const list = await getTestimonials();
  if (!list.find((t) => t.id === id))
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const patch: Partial<Testimonial> = {};
  if (typeof body.quote === "string") patch.quote = body.quote.trim();
  if (typeof body.name === "string") patch.name = body.name.trim();
  if (typeof body.role === "string") patch.role = body.role.trim();
  await updateTestimonial(id, patch);
  const updated = (await getTestimonials()).find((t) => t.id === id);
  revalidatePath("/", "layout");
  return NextResponse.json(updated);
}
