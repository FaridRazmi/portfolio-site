import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "projects.json");

function readProjects() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeProjects(data: unknown) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function checkPin(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const pin = process.env.ADMIN_PIN ?? "1234";
  return auth === `Bearer ${pin}`;
}

// PUT /api/projects/[id]
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!checkPin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const projects = readProjects();
  const idx = projects.findIndex((p: { id: string }) => p.id === id);

  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  projects[idx] = { ...projects[idx], ...body, id };
  writeProjects(projects);

  return NextResponse.json(projects[idx]);
}

// DELETE /api/projects/[id]
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!checkPin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const projects = readProjects();
  const filtered = projects.filter((p: { id: string }) => p.id !== id);

  if (filtered.length === projects.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  writeProjects(filtered);
  return NextResponse.json({ ok: true });
}
