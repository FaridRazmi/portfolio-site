"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

import SequenceScrollClient from "@/components/SequenceScrollClient";
import type { HeroOverlay } from "@/components/admin/types";

const Preloader = dynamic(() => import("@/components/Preloader"), {
  ssr: false,
});

interface Props {
  heroOverlays: HeroOverlay[];
  projectsSlot: React.ReactNode;
  aboutSlot: React.ReactNode;
  statsSlot: React.ReactNode;
  testimonialsSlot: React.ReactNode;
  commentsSlot: React.ReactNode;
  footerSlot: React.ReactNode;
  navbarSlot: React.ReactNode;
  auroraDividerSlot: React.ReactNode;
}

export default function HomeClient({
  heroOverlays,
  projectsSlot,
  aboutSlot,
  statsSlot,
  testimonialsSlot,
  commentsSlot,
  footerSlot,
  navbarSlot,
  auroraDividerSlot,
}: Props) {
  // ponytail: fake progress bar only on first visit per tab, add permanent removal if nobody loves it
  const [showPreloader, setShowPreloader] = useState(
    () =>
      typeof window !== "undefined" &&
      !sessionStorage.getItem("preloader-seen"),
  );

  const handlePreloaderComplete = useCallback(() => {
    sessionStorage.setItem("preloader-seen", "1");
    setShowPreloader(false);
  }, []);

  return (
    <>
      {showPreloader && (
        <Preloader totalFrames={99} onComplete={handlePreloaderComplete} />
      )}

      {navbarSlot}
      <SequenceScrollClient overlays={heroOverlays} />

      <div
        style={{ position: "relative", zIndex: 10, background: "var(--bg)" }}
      >
        {aboutSlot}
        {auroraDividerSlot}

        {projectsSlot}

        {statsSlot}
        {testimonialsSlot}
        {commentsSlot}
        {auroraDividerSlot}
        {footerSlot}
      </div>
    </>
  );
}
