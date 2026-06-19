import { getContact } from "@/lib/data-store";
import CTASectionClient from "@/components/CTASectionClient";

export default function CTASection() {
  const data = getContact();
  return <CTASectionClient data={data} />;
}
