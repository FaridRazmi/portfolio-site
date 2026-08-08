import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/app/api/_auth";
import {
  getTestimonials,
  addTestimonial,
  setTestimonials,
} from "@/lib/data-store";

// GET /api/testimonials
export async function GET() {
  return NextResponse.json({ testimonials: await getTestimonials() });
}

// PUT /api/testimonials (bulk update all testimonials)
export async function PUT(req: Request) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const list = body?.testimonials ?? body;
  if (!Array.isArray(list))
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  await setTestimonials(list);
  revalidatePath("/", "layout");
  return NextResponse.json(body);
}

// POST /api/testimonials (add new testimonial)
export async function POST(req: Request) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object")
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  const newTestimonial = {
    ...body,
    id: typeof body.id === "string" ? body.id : `t${Date.now()}`,
  };
  await addTestimonial(newTestimonial);
  revalidatePath("/", "layout");
  return NextResponse.json(newTestimonial, { status: 201 });
}
