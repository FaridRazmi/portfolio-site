export const dynamic = "force-dynamic";

import { getContact } from "@/lib/data-store";
import ContactPageClient from "@/app/contact/ContactPageClient";
import Navbar from "@/components/Navbar";

export default async function ContactPage() {
  const data = await getContact();
  return (
    <>
      <Navbar />
      <ContactPageClient data={data} />
    </>
  );
}
