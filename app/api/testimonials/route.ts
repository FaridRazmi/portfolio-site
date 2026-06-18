import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkPin } from "@/app/api/_auth";

const DATA_FILE = path.join(process.cwd(), "data", "testimonials.json");

function readTestimonials() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeTestimonials(data: unknown) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// GET /api/testimonials
export async function GET() {
  const data = readTestimonials();
  return NextResponse.json(data);
}

// PUT /api/testimonials (bulk update all testimonials)
export async function PUT(req: Request) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  writeTestimonials(body);
  return NextResponse.json(body);
}

// POST /api/testimonials (add new testimonial)
export async function POST(req: Request) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const data = readTestimonials();
  const newTestimonial = { ...body, id: `t${Date.now()}` };
  data.testimonials.push(newTestimonial);
  writeTestimonials(data);
  return NextResponse.json(newTestimonial, { status: 201 });
}
