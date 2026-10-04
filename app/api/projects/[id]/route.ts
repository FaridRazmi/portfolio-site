import { NextResponse } from "next/server";
import {
  getProjects,
  updateProject,
  deleteProject,
} from "@/lib/data-store";
import { isAuthorized } from "@/app/api/_auth";
import { validateProject } from "@/lib/validation";
import { clampRect, overlaps } from "@/lib/grid";

// PUT /api/projects/[id]
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const patch = validateProject(body, true);
  if (!patch)
    return NextResponse.json({ error: "Invalid project data" }, { status: 400 });

  const projects = await getProjects();
  const current = projects.find((p) => p.id === id);
  if (!current)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const rect = clampRect({
    col: patch.col ?? current.col,
    row: patch.row ?? current.row,
    colSpan: patch.colSpan ?? current.colSpan,
    rowSpan: patch.rowSpan ?? current.rowSpan,
  });
  const clash = projects.find(
    (p) =>
      p.id !== id &&
      overlaps(
        rect,
        { col: p.col, row: p.row, colSpan: p.colSpan, rowSpan: p.rowSpan },
      ),
  );
  if (clash)
    return NextResponse.json(
      { error: `Position overlaps "${clash.title}"` },
      { status: 409 },
    );

  await updateProject(id, { ...patch, ...rect });
  const updated = (await getProjects()).find((p) => p.id === id);
  return NextResponse.json(updated);
}

// DELETE /api/projects/[id]
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const exists = (await getProjects()).find((p) => p.id === id);
  if (!exists)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
