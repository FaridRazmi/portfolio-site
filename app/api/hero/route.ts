import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { checkPin } from "@/app/api/_auth";

const DATA_FILE = path.join(process.cwd(), "data", "hero.json");

function readHero() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeHero(data: unknown) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// GET /api/hero
export async function GET() {
  const hero = readHero();
  return NextResponse.json(hero);
}

// PUT /api/hero
export async function PUT(req: Request) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  writeHero(body);
  revalidatePath("/");
  return NextResponse.json(body);
}
