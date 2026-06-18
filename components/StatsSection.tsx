import fs from "fs";
import path from "path";
import StatsSectionClient from "@/components/StatsSectionClient";
import { StatsData } from "@/components/admin/types";

export default function StatsSection() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "stats.json"),
    "utf-8",
  );
  const data: StatsData = JSON.parse(raw);

  return <StatsSectionClient data={data} />;
}
