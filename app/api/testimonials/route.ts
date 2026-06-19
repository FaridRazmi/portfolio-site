import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkPin } from "@/app/api/_auth";
import {
  getTestimonials,
  addTestimonial,
  setTestimonials,
} from "@/lib/data-store";

// GET /api/testimonials
export async function GET() {
  return NextResponse.json({ testimonials: getTestimonials() });
}

// PUT /api/testimonials (bulk update all testimonials)
export async function PUT(req: Request) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  setTestimonials(body.testimonials ?? body);
  revalidatePath("/", "layout");
  return NextResponse.json(body);
}

// POST /api/testimonials (add new testimonial)
export async function POST(req: Request) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const newTestimonial = { ...body, id: `t${Date.now()}` };
  addTestimonial(newTestimonial);
  revalidatePath("/", "layout");
  return NextResponse.json(newTestimonial, { status: 201 });
}
