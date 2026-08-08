export const dynamic = "force-dynamic";

import ProjectsSection from "@/components/ProjectsSection";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CommentsSection from "@/components/CommentsSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AuroraDivider from "@/components/AuroraDivider";
import HomeClient from "@/components/HomeClient";

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
      auroraDividerSlot={<AuroraDivider />}
    />
  );
}
