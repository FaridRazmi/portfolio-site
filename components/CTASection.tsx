import fs from "fs";
import path from "path";
import CTASectionClient from "@/components/CTASectionClient";
import { ContactData } from "@/components/admin/types";

export default function CTASection() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "contact.json"),
    "utf-8",
  );
  const data: ContactData = JSON.parse(raw);

  return <CTASectionClient data={data} />;
}
