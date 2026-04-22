"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

const Preloader = dynamic(() => import("@/components/Preloader"), { ssr: false });
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const SequenceScroll = dynamic(() => import("@/components/SequenceScroll"), { ssr: false });
const AboutSection = dynamic(() => import("@/components/AboutSection"), { ssr: false });
const StatsSection = dynamic(() => import("@/components/StatsSection"), { ssr: false });
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"), { ssr: false });
const CTASection = dynamic(() => import("@/components/CTASection"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const AuroraDivider = dynamic(() => import("@/components/AuroraDivider"), { ssr: false });

export default function HomeClient({ projectsSlot }: { projectsSlot: React.ReactNode }) {
  const [showPreloader, setShowPreloader] = useState(true);

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  return (
    <>
      {showPreloader && (
        <Preloader totalFrames={99} onComplete={handlePreloaderComplete} />
      )}

      <Navbar />
      <SequenceScroll onLoaded={() => {}} />

      <div style={{ position: "relative", zIndex: 10, background: "var(--bg)" }}>
        <AboutSection />
        <AuroraDivider />

        {/* Projects slot — rendered as server component from page.tsx */}
        {projectsSlot}

        <StatsSection />
        <TestimonialsSection />
        <AuroraDivider />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
