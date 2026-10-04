export const revalidate = 60;

import ProjectsSection from "@/components/ProjectsSection";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CommentsSection from "@/components/CommentsSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AuroraDivider from "@/components/AuroraDivider";
import HomeClient from "@/components/HomeClient";
import { getHeroOverlays } from "@/lib/data-store";

export default async function Home() {
  const heroOverlays = await getHeroOverlays();

  return (
    <HomeClient
      heroOverlays={heroOverlays}
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
