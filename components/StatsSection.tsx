import { getStats } from "@/lib/data-store";
import StatsSectionClient from "@/components/StatsSectionClient";

export default function StatsSection() {
  const data = { stats: getStats() };
  return <StatsSectionClient data={data} />;
}
