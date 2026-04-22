import fs from "fs";
import path from "path";
import ProjectsSectionClient from "@/components/ProjectsSectionClient";
import { Project } from "@/components/admin/types";

export default function ProjectsSection() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "projects.json"),
    "utf-8",
  );
  const projects: Project[] = JSON.parse(raw).sort(
    (a: Project, b: Project) => a.order - b.order,
  );

  return <ProjectsSectionClient projects={projects} />;
}
