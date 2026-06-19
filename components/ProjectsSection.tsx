"use client";

import { useState, useEffect } from "react";
import ProjectsSectionClient from "@/components/ProjectsSectionClient";
import type { Project } from "@/components/admin/types";

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((ps: Project[]) =>
        setProjects(ps.sort((a, b) => a.order - b.order)),
      );
  }, []);

  if (!projects) return null;
  return <ProjectsSectionClient projects={projects} />;
}
