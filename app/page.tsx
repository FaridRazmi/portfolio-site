"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";

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
  const [loading, setLoading] = useState(true);

  const handlePreloaderComplete = useCallback(() => {
    setLoading(false);
  }, []);

  const handleFramesLoaded = useCallback(() => {
    // frames loaded, could animate something here
  }, []);

  return (
    <>
      {/* Preloader */}
      {loading && (
        <Preloader totalFrames={144} onComplete={handlePreloaderComplete} />
      )}

      {/* Main site */}
      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Fixed navbar */}
            <Navbar />

            {/* ── HERO: Sequence scroll (500vh tall) ── */}
            <SequenceScroll onLoaded={handleFramesLoaded} />

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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
