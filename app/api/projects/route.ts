import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "projects.json");

function readProjects() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeProjects(data: unknown) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function checkPin(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const pin = process.env.ADMIN_PIN ?? "1234";
  return auth === `Bearer ${pin}`;
}

// GET /api/projects
export async function GET() {
  const projects = readProjects();
  return NextResponse.json(projects);
}

// POST /api/projects  — create new
export async function POST(req: Request) {
  if (!checkPin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const projects = readProjects();

  const newProject = {
    ...body,
    id: `p-${Date.now()}`,
    order: projects.length,
  };

  projects.push(newProject);
  writeProjects(projects);

  return NextResponse.json(newProject, { status: 201 });
}

// PUT /api/projects  — bulk reorder
export async function PUT(req: Request) {
  if (!checkPin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  writeProjects(body);

  return NextResponse.json({ ok: true });
}
