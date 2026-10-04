import { NextResponse } from "next/server";
import {
  getProjects,
  addProject,
  setProjects,
  type Project,
} from "@/lib/data-store";
import { isAuthorized } from "@/app/api/_auth";
import { validateProject } from "@/lib/validation";
import { clampRect, findFreeSlot, overlaps } from "@/lib/grid";

// GET /api/projects
export async function GET() {
  return NextResponse.json(await getProjects());
}

// POST /api/projects  — create new
export async function POST(req: Request) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const project = validateProject(body, false);
  if (!project)
    return NextResponse.json({ error: "Invalid project data" }, { status: 400 });

  const existing = await getProjects();
  const rect = clampRect(project);
  const clashes = existing.some((p) =>
    overlaps(rect, { col: p.col, row: p.row, colSpan: p.colSpan, rowSpan: p.rowSpan }),
  );
  // Stale clients may submit an occupied position; auto-place instead of
  // silently stacking cards on the homepage.
  const position = clashes
    ? findFreeSlot(
        existing.map((p) => ({
          col: p.col,
          row: p.row,
          colSpan: p.colSpan,
          rowSpan: p.rowSpan,
        })),
        rect.colSpan,
        rect.rowSpan,
      )
    : { col: rect.col, row: rect.row };

  const newProject: Project = {
    ...project,
    id: `p-${Date.now()}`,
    order: existing.length,
    tags: project.tags ?? [],
    accent: project.accent ?? "#c8f135",
    link: project.link ?? "",
    image: project.image ?? "",
    col: position.col,
    row: position.row,
    colSpan: rect.colSpan,
    rowSpan: rect.rowSpan,
  };

  await addProject(newProject);
  return NextResponse.json(newProject, { status: 201 });
}

// PUT /api/projects  — bulk reorder
export async function PUT(req: Request) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!Array.isArray(body) || body.some((p) => !validateProject(p, true)))
    return NextResponse.json({ error: "Invalid project list" }, { status: 400 });

  await setProjects(body);
  return NextResponse.json({ ok: true });
}
