import { NextResponse } from "next/server";
import { isAuthorized } from "@/app/api/_auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
const BUCKET = "project-images";
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

  // Store in Supabase Storage when available — data URLs bloat every DB row
  // and every public page payload.
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    const ext = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "bin";
    const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });
    if (error?.message?.includes("not found")) {
      await supabase.storage.createBucket(BUCKET, { public: true });
      const retry = await supabase.storage
        .from(BUCKET)
        .upload(path, bytes, { contentType: file.type, upsert: false });
      if (retry.error) throw retry.error;
    } else if (error) {
      throw error;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  }

  // ponytail: dev/no-Supabase fallback, move fully to Storage once configured
  const base64 = Buffer.from(bytes).toString("base64");
  return NextResponse.json({
    url: `data:${file.type};base64,${base64}`,
  });
}
