import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthorized, clientIp } from "@/app/api/_auth";
import { getComments, addComment, deleteComment } from "@/lib/data-store";

// Comment-specific rate limiter, kept separate from the admin-login limiter so
// visitor commenting can never lock an admin out (or vice versa).
const commentAttempts = new Map<string, { count: number; firstAt: number }>();
const COMMENT_MAX = 10;
const COMMENT_WINDOW_MS = 1000 * 60 * 5;

function commentRateLimited(ip: string): boolean {
  const entry = commentAttempts.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > COMMENT_WINDOW_MS) {
    commentAttempts.delete(ip);
    return false;
  }
  return entry.count >= COMMENT_MAX;
}

function recordComment(ip: string) {
  const now = Date.now();
  const entry = commentAttempts.get(ip);
  if (!entry || now - entry.firstAt > COMMENT_WINDOW_MS) {
    commentAttempts.set(ip, { count: 1, firstAt: now });
  } else {
    entry.count += 1;
  }
}

// GET /api/comments — public
export async function GET() {
  return NextResponse.json({ comments: await getComments() });
}

// POST /api/comments — public (visitors can comment), rate limited per IP
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (commentRateLimited(ip))
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });

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
  recordComment(ip);
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
