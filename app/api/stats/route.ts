import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { checkPin } from "@/app/api/_auth";

const DATA_FILE = path.join(process.cwd(), "data", "stats.json");

function readStats() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeStats(data: unknown) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// GET /api/stats
export async function GET() {
  const stats = readStats();
  return NextResponse.json(stats);
}

// PUT /api/stats
export async function PUT(req: Request) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  writeStats(body);
  revalidatePath("/");
  return NextResponse.json(body);
}
