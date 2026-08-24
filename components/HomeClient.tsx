"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

const Preloader = dynamic(() => import("@/components/Preloader"), {
  ssr: false,
});

const SequenceScroll = dynamic(() => import("@/components/SequenceScroll"), {
  ssr: false,
});

interface Props {
  projectsSlot: React.ReactNode;
  aboutSlot: React.ReactNode;
  statsSlot: React.ReactNode;
  testimonialsSlot: React.ReactNode;
  commentsSlot: React.ReactNode;
  footerSlot: React.ReactNode;
  navbarSlot: React.ReactNode;
  sequenceScrollSlot?: React.ReactNode;
  auroraDividerSlot: React.ReactNode;
}

export default function HomeClient({
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
      <SequenceScroll />

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
