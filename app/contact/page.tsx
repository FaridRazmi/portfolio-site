import fs from "fs";
import path from "path";
import ContactPageClient from "@/app/contact/ContactPageClient";
import Navbar from "@/components/Navbar";
import { ContactData } from "@/components/admin/types";

export default function ContactPage() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "contact.json"),
    "utf-8",
  );
  const data: ContactData = JSON.parse(raw);

  return (
    <>
      <Navbar />
      <ContactPageClient data={data} />
    </>
  );
}
