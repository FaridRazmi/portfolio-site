import { getAbout } from "@/lib/data-store";
import AboutSectionClient from "@/components/AboutSectionClient";

export default function AboutSection() {
  const data = getAbout();
  return <AboutSectionClient data={data} />;
}
