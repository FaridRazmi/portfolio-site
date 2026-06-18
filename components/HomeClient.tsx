"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

const Preloader = dynamic(() => import("@/components/Preloader"), {
  ssr: false,
});

interface Props {
  projectsSlot: React.ReactNode;
  aboutSlot: React.ReactNode;
  statsSlot: React.ReactNode;
  testimonialsSlot: React.ReactNode;
  ctaSlot: React.ReactNode;
  footerSlot: React.ReactNode;
  navbarSlot: React.ReactNode;
  sequenceScrollSlot: React.ReactNode;
  auroraDividerSlot: React.ReactNode;
}

export default function HomeClient({
  projectsSlot,
  aboutSlot,
  statsSlot,
  testimonialsSlot,
  ctaSlot,
  footerSlot,
  navbarSlot,
  sequenceScrollSlot,
  auroraDividerSlot,
}: Props) {
  const [showPreloader, setShowPreloader] = useState(true);

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  return (
    <>
      {showPreloader && (
        <Preloader totalFrames={99} onComplete={handlePreloaderComplete} />
      )}

      {navbarSlot}
      {sequenceScrollSlot}

      <div
        style={{ position: "relative", zIndex: 10, background: "var(--bg)" }}
      >
        {aboutSlot}
        {auroraDividerSlot}

        {projectsSlot}

        {statsSlot}
        {testimonialsSlot}
        {auroraDividerSlot}
        {ctaSlot}
        {footerSlot}
      </div>
    </>
  );
}
