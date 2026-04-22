"use client";
import { Project } from "@/components/admin/types";

interface Props {
  project: Partial<Project>;
}

const ACCENT = "#c8f135";

export default function ProjectCardPreview({ project }: Props) {
  const {
    title = "Project Title",
    description = "A short description of this project will appear here.",
    tags = [],
    accent = ACCENT,
    image = "",
  } = project;

  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(145deg, rgba(20,20,20,0.95), rgba(12,12,12,0.98))",
        border: "1px solid #222",
        borderTop: `2px solid ${accent}`,
        borderRadius: 10,
        padding: "1.4rem 1.6rem",
        overflow: "hidden",
        minHeight: 160,
        boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 32px ${accent}22`,
      }}
    >
      {/* Accent top glow bar */}
      <div
        style={{
          position: "absolute",
          top: -1,
          left: "2rem",
          width: 40,
          height: 2,
          background: accent,
          boxShadow: `0 0 14px ${accent}`,
        }}
      />

      {/* Mouse-over gradient (static preview) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 30% 40%, ${accent}10 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* Image */}
      {image && (
        <div
          style={{
            width: "100%",
            height: 90,
            borderRadius: 6,
            overflow: "hidden",
            marginBottom: "0.75rem",
            background: "#0c0c0c",
          }}
        >
          <img
            src={image}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "1rem",
          fontWeight: 600,
          color: "#e8e8e8",
          letterSpacing: "-0.02em",
          marginBottom: "0.4rem",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.78rem",
          color: "#555",
          lineHeight: 1.6,
          marginBottom: "1rem",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {description}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        {tags.map((tag: string, i: number) => (
          <span
            key={i}
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              padding: "2px 8px",
              border: "1px solid #222",
              borderRadius: 100,
              color: "#555",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
