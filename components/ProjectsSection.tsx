import { getProjects } from "@/lib/data-store";
import ProjectsSectionClient from "@/components/ProjectsSectionClient";

export default function ProjectsSection() {
  const projects = getProjects().sort((a, b) => a.order - b.order);
  return <ProjectsSectionClient projects={projects} />;
}
