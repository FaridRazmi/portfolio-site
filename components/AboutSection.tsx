"use client";

import { useState, useEffect } from "react";
import AboutSectionClient from "@/components/AboutSectionClient";
import type { AboutData } from "@/components/admin/types";

export default function AboutSection() {
  const [data, setData] = useState<AboutData | null>(null);

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return null;
  return <AboutSectionClient data={data} />;
}
