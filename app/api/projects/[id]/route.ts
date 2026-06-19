import { NextResponse } from "next/server";
import { getProjects, updateProject, deleteProject } from "@/lib/data-store";

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
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  updateProject(id, body);
  const updated = getProjects().find((p) => p.id === id);
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

// DELETE /api/projects/[id]
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const exists = getProjects().find((p) => p.id === id);
  if (!exists)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  deleteProject(id);
  return NextResponse.json({ ok: true });
}
