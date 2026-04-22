import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function checkPin(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const pin = process.env.ADMIN_PIN ?? "1234";
  return auth === `Bearer ${pin}`;
}

export async function POST(req: Request) {
  if (!checkPin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}.${ext}`;
  const dest = path.join(process.cwd(), "public", "projects", filename);

  fs.writeFileSync(dest, buffer);

  return NextResponse.json({ url: `/projects/${filename}` });
}
