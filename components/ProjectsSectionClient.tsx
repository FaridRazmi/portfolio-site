"use client";
import { useRef } from "react";
import { motion } from "motion/react";
import { Project } from "@/components/admin/types";

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
  };

  return (
    <motion.div
      id={project.id}
      ref={ref}
      className="bento-card"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: project.rowSpan > 1 ? "280px" : "180px" }}
    >
      {/* Accent glow top */}
      <div
        style={{
          position: "absolute",
          top: "-1px",
          left: "2rem",
          width: "40px",
          height: "2px",
          background: project.accent,
          boxShadow: `0 0 20px ${project.accent}`,
        }}
      />

      {/* Thumbnail */}
      {project.image && (
        <div
          style={{
            width: "100%",
            height: 100,
            borderRadius: 6,
            overflow: "hidden",
            marginBottom: "0.75rem",
            background: "#0c0c0c",
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "var(--fg)",
          marginBottom: "0.5rem",
          letterSpacing: "-0.02em",
        }}
      >
        {project.title}
      </h3>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.82rem",
          color: "var(--muted)",
          lineHeight: 1.65,
          marginBottom: "1.25rem",
        }}
      >
        {project.description}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "auto" }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.65rem",
              letterSpacing: "0.08em",
              padding: "3px 10px",
              border: "1px solid var(--border)",
              borderRadius: "100px",
              color: "var(--muted)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* External link */}
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            fontSize: "0.65rem",
            color: project.accent,
            textDecoration: "none",
            fontFamily: "var(--font-body)",
            letterSpacing: "0.08em",
            opacity: 0.7,
          }}
        >
          ↗
        </a>
      )}
    </motion.div>
  );
}

export default function ProjectsSectionClient({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" style={{ padding: "8rem 0", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "3rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{ width: "32px", height: "1px", background: "var(--accent)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                color: "var(--muted)",
              }}
            >
              SELECTED WORK
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "var(--fg)",
            }}
          >
            Things I&apos;ve built
          </h2>
        </motion.div>

        {/* Bento grid CSS */}
        <style>{`
          @media (min-width: 769px) {
            ${projects
              .map(
                (p) => `
              #${p.id} {
                grid-column: ${p.col} / span ${p.colSpan};
                grid-row: ${p.row} / span ${p.rowSpan};
              }
            `,
              )
              .join("")}
          }
        `}</style>

        <div
          className="bento-grid"
          style={{ borderRadius: "4px", overflow: "hidden" }}
        >
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
