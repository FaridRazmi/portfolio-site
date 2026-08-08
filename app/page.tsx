export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CommentsSection from "@/components/CommentsSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AuroraDivider from "@/components/AuroraDivider";
import HomeClient from "@/components/HomeClient";

const ProjectsSection = dynamicImport(() => import("@/components/ProjectsSection"), { ssr: false });
const SequenceScroll = dynamicImport(() => import("@/components/SequenceScroll"), { ssr: false });

export default function Home() {
  return (
    <HomeClient
      projectsSlot={<ProjectsSection />}
      aboutSlot={<AboutSection />}
      statsSlot={<StatsSection />}
      testimonialsSlot={<TestimonialsSection />}
      commentsSlot={<CommentsSection />}
      footerSlot={<Footer />}
      navbarSlot={<Navbar />}
      sequenceScrollSlot={<SequenceScroll />}
      auroraDividerSlot={<AuroraDivider />}
    />
  );
}
