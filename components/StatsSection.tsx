"use client";

import { useState, useEffect } from "react";
import StatsSectionClient from "@/components/StatsSectionClient";
import type { StatsData } from "@/components/admin/types";

export default function StatsSection() {
  const [data, setData] = useState<StatsData | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return null;
  return <StatsSectionClient data={data} />;
}
