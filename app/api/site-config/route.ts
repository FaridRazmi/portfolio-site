import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkPin } from "@/app/api/_auth";

const DATA_FILE = path.join(process.cwd(), "data", "site-config.json");

function readConfig() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeConfig(data: unknown) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// GET /api/site-config
export async function GET() {
  const config = readConfig();
  return NextResponse.json(config);
}

// PUT /api/site-config
export async function PUT(req: Request) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  writeConfig(body);
  return NextResponse.json(body);
}
