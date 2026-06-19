import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { checkPin } from "@/app/api/_auth";
import { getContact, setContact } from "@/lib/data-store";

// GET /api/contact-config
export async function GET() {
  return NextResponse.json(getContact());
}

// PUT /api/contact-config
export async function PUT(req: Request) {
  if (!checkPin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  setContact(body);
  revalidatePath("/contact");
  return NextResponse.json(body);
}
