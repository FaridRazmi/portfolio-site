import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/app/api/_auth";
import { getComments, addComment, deleteComment } from "@/lib/data-store";

// GET /api/comments — public
export async function GET() {
  return NextResponse.json({ comments: await getComments() });
}

// POST /api/comments — public (visitors can comment)
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const name =
    typeof body?.name === "string" ? body.name.trim().slice(0, 100) : "";
  const message =
    typeof body?.message === "string" ? body.message.trim().slice(0, 2000) : "";

  const newComment = {
    id: `c-${Date.now()}`,
    name: name || "Anonymous",
    message,
    timestamp: new Date().toISOString(),
  };

  if (!newComment.message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  await addComment(newComment);
  revalidatePath("/", "layout");
  return NextResponse.json(newComment, { status: 201 });
}

// DELETE /api/comments — admin only (bulk by id)
export async function DELETE(req: Request) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { id } = body ?? {};
  if (typeof id !== "string")
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  await deleteComment(id);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
