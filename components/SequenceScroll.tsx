import fs from "fs";
import path from "path";
import SequenceScrollClient from "@/components/SequenceScrollClient";
import { HeroData } from "@/components/admin/types";

export default function SequenceScroll() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "hero.json"),
    "utf-8",
  );
  const data: HeroData = JSON.parse(raw);

  return <SequenceScrollClient overlays={data.overlays} />;
}
