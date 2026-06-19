import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { checkPin } from "@/app/api/_auth";

const DATA_FILE = path.join(process.cwd(), "data", "comments.json");

function readComments() {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeComments(data: unknown) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// GET /api/comments — public
export async function GET() {
  const data = readComments();
  return NextResponse.json(data);
}

// POST /api/comments — public (visitors can comment)
export async function POST(req: Request) {
  const body = await req.json();
  const data = readComments();

  const newComment = {
    id: `c-${Date.now()}`,
    name: body.name?.trim() || "Anonymous",
    message: body.message?.trim() || "",
    timestamp: new Date().toISOString(),
  };

  if (!newComment.message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  data.comments.unshift(newComment);
  writeComments(data);
  revalidatePath("/");

  return NextResponse.json(newComment, { status: 201 });
}

// DELETE /api/comments — admin only (bulk by id)
export async function DELETE(req: Request) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id } = body;
  const data = readComments();
  data.comments = data.comments.filter((c: { id: string }) => c.id !== id);
  writeComments(data);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
