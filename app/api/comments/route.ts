import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkPin } from "@/app/api/_auth";
import { getComments, addComment, deleteComment } from "@/lib/data-store";

// GET /api/comments — public
export async function GET() {
  return NextResponse.json({ comments: getComments() });
}

// POST /api/comments — public (visitors can comment)
export async function POST(req: Request) {
  const body = await req.json();

  const newComment = {
    id: `c-${Date.now()}`,
    name: body.name?.trim() || "Anonymous",
    message: body.message?.trim() || "",
    timestamp: new Date().toISOString(),
  };

  if (!newComment.message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  addComment(newComment);
  revalidatePath("/", "layout");
  return NextResponse.json(newComment, { status: 201 });
}

// DELETE /api/comments — admin only (bulk by id)
export async function DELETE(req: Request) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id } = body;
  deleteComment(id);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
