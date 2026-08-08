import { NextResponse } from "next/server";
import {
  getProjects,
  addProject,
  setProjects,
  type Project,
} from "@/lib/data-store";
import { isAuthorized } from "@/app/api/_auth";
import { validateProject } from "@/lib/validation";

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
  const newProject: Project = {
    id: `p-${Date.now()}`,
    order: existing.length,
    tags: [],
    col: 1,
    row: 1,
    colSpan: 4,
    rowSpan: 1,
    accent: "#c8f135",
    link: "",
    image: "",
    ...project,
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
