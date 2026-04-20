"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  col: number;
  row: number;
  colSpan: number;
  rowSpan: number;
  accent: string;
}

const PROJECTS: Project[] = [
  {
    id: "p1",
    title: "ESP32 IoT Gateway",
    description:
      "Custom firmware for ESP32 microcontroller integrating BLE/WiFi sensor aggregation, MQTT pub-sub, and OTA updates. Written in C++ with FreeRTOS.",
    tags: ["C++", "FreeRTOS", "MQTT", "ESP32"],
    col: 1,
    row: 1,
    colSpan: 5,
    rowSpan: 2,
    accent: "#4af7c2",
  },
  {
    id: "p2",
    title: "AI Image Generator",
    description:
      "Developed an AI-based image generation tool that converts text prompts into images",
    tags: ["PyTorch", "Diffusers", "FastAPI", "LoRA"],
    col: 6,
    row: 1,
    colSpan: 4,
    rowSpan: 1,
    accent: "#c8f135",
  },
  {
    id: "p3",
    title: "ReidTech SaaS",
    description:
      "Full-stack Next.js SaaS platform with Stripe, Supabase auth, and role-based access control. Deployed on Vercel Edge.",
    tags: ["Next.js", "Supabase", "Stripe", "TypeScript"],
    col: 10,
    row: 1,
    colSpan: 3,
    rowSpan: 2,
    accent: "#7c6af7",
  },
  {
    id: "p4",
    title: "User Location Email Sender Web App",
    description:
      "Developed a web application that detects a user's location using browser geolocation and automatically sends the location data via Gmail",
    tags: ["Javascript", "Geolocation API", "EmailJS", "Gmail"],
    col: 6,
    row: 2,
    colSpan: 4,
    rowSpan: 1,
    accent: "#f74a4a",
  },
  {
    id: "p5",
    title: "CLI Dev Tooling",
    description:
      "Custom Rust-based CLI tool that automates git workflows, scaffolding, and deploys across environments.",
    tags: ["Rust", "CLI", "Git", "DevOps"],
    col: 1,
    row: 3,
    colSpan: 4,
    rowSpan: 1,
    accent: "#f7a24a",
  },
  {
    id: "p6",
    title: "Real-Time Hand Sign to Text Recognition",
    description:
      "Developed a real-time hand sign recognition system that converts hand gestures into text using computer vision and machine learning",
    tags: ["Python", "OpenCV", "MediaPipe", "TensorFlow"],
    col: 5,
    row: 3,
    colSpan: 4,
    rowSpan: 1,
    accent: "#4ac4f7",
  },
  {
    id: "p7",
    title: "Portfolio OS",
    description:
      "This very site — a scrollytelling Next.js portfolio with scroll-linked 3D frame sequences and Awwwards-grade UI.",
    tags: ["Next.js", "Motion", "Canvas", "Lenis"],
    col: 9,
    row: 3,
    colSpan: 4,
    rowSpan: 1,
    accent: "#c8f135",
  },
];

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
      {/* Accent glow top-left */}
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

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
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
    </motion.div>
  );
}

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      style={{ padding: "8rem 0", background: "var(--bg)" }}
    >
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
              style={{
                width: "32px",
                height: "1px",
                background: "var(--accent)",
              }}
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

        {/* Bento grid styling wrapper */}
        <style>{`
          @media (min-width: 769px) {
            ${PROJECTS.map(
              (p) => `
              #${p.id} {
                grid-column: ${p.col} / span ${p.colSpan};
                grid-row: ${p.row} / span ${p.rowSpan};
              }
            `
            ).join("")}
          }
        `}</style>

        {/* Bento grid */}
        <div
          className="bento-grid"
          style={{ borderRadius: "4px", overflow: "hidden" }}
        >
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
