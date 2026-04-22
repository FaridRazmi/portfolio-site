"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamic imports — client only
const Preloader = dynamic(() => import("@/components/Preloader"), {
  ssr: false,
});
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const SequenceScroll = dynamic(() => import("@/components/SequenceScroll"), {
  ssr: false,
});
const AboutSection = dynamic(() => import("@/components/AboutSection"), {
  ssr: false,
});
const ProjectsSection = dynamic(() => import("@/components/ProjectsSection"), {
  ssr: false,
});
const StatsSection = dynamic(() => import("@/components/StatsSection"), {
  ssr: false,
});
const TestimonialsSection = dynamic(
  () => import("@/components/TestimonialsSection"),
  { ssr: false },
);
const CTASection = dynamic(() => import("@/components/CTASection"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const AuroraDivider = dynamic(() => import("@/components/AuroraDivider"), {
  ssr: false,
});

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(true);

  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  return (
    <>
      {/* Slim top-bar preloader — overlays content, gone in ~600ms */}
      {showPreloader && (
        <Preloader totalFrames={99} onComplete={handlePreloaderComplete} />
      )}

      {/* Main site — rendered immediately, no gate */}
      <Navbar />

      {/* ── HERO: Sequence scroll (500vh tall) ── */}
      <SequenceScroll onLoaded={() => {}} />

      {/* ── REST OF PORTFOLIO ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          background: "var(--bg)",
        }}
      >
        {/* About */}
        <AboutSection />

        <AuroraDivider />

        {/* Projects */}
        <ProjectsSection />

        {/* Stats */}
        <StatsSection />

        {/* Testimonials */}
        <TestimonialsSection />

        <AuroraDivider />

        {/* CTA / Contact */}
        <CTASection />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
