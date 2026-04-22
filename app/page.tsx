import ProjectsSection from "@/components/ProjectsSection";
import HomeClient from "@/components/HomeClient";

export default function Home() {
  return (
    <HomeClient projectsSlot={<ProjectsSection />} />
  );
}
