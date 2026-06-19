"use client";

import { useState, useEffect } from "react";
import SequenceScrollClient from "@/components/SequenceScrollClient";
import type { HeroOverlay } from "@/components/admin/types";

export default function SequenceScroll() {
  const [overlays, setOverlays] = useState<HeroOverlay[] | null>(null);

  useEffect(() => {
    fetch("/api/hero")
      .then((r) => r.json())
      .then((d) => setOverlays(d.overlays));
  }, []);

  if (!overlays) return null;
  return <SequenceScrollClient overlays={overlays} />;
}
