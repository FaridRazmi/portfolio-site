import { NextResponse } from "next/server";
import { getProjects, addProject, setProjects } from "@/lib/data-store";

function checkPin(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const pin = process.env.ADMIN_PIN ?? "1234";
  return auth === `Bearer ${pin}`;
}

// GET /api/projects
export async function GET() {
  return NextResponse.json(getProjects());
}

// POST /api/projects  — create new
export async function POST(req: Request) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const projects = getProjects();

  const newProject = {
    ...body,
    id: `p-${Date.now()}`,
    order: projects.length,
  };

  addProject(newProject);
  return NextResponse.json(newProject, { status: 201 });
}

// PUT /api/projects  — bulk reorder
export async function PUT(req: Request) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  setProjects(body);
  return NextResponse.json({ ok: true });
}
