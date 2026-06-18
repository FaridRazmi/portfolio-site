import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkPin } from "@/app/api/_auth";

const DATA_FILE = path.join(process.cwd(), "data", "testimonials.json");

// DELETE /api/testimonials/:id
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const data = JSON.parse(raw);
  data.testimonials = data.testimonials.filter(
    (t: { id: string }) => t.id !== id,
  );
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
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
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  const data = JSON.parse(raw);
  const idx = data.testimonials.findIndex((t: { id: string }) => t.id === id);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  data.testimonials[idx] = { ...data.testimonials[idx], ...body };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  return NextResponse.json(data.testimonials[idx]);
}
