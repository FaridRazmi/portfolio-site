import fs from "fs";
import path from "path";
import AboutSectionClient from "@/components/AboutSectionClient";
import { AboutData } from "@/components/admin/types";

export default function AboutSection() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "about.json"),
    "utf-8",
  );
  const data: AboutData = JSON.parse(raw);

  return <AboutSectionClient data={data} />;
}
