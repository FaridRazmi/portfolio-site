import { NextResponse } from "next/server";
import { isAuthorized } from "@/app/api/_auth";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export async function POST(req: Request) {
  if (!isAuthorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  if (!ALLOWED_MIME.has(file.type))
    return NextResponse.json(
      { error: "Unsupported file type" },
      { status: 400 },
    );

  if (file.size > MAX_UPLOAD_BYTES)
    return NextResponse.json(
      { error: "File too large (max 5 MB)" },
      { status: 413 },
    );

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  return NextResponse.json({ url: dataUrl });
}
