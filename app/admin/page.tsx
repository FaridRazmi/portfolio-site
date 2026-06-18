"use client";
import AdminPinGate from "@/components/admin/AdminPinGate";
import { useState, useCallback } from "react";

const CARDS = [
  {
    label: "Projects",
    desc: "Manage portfolio projects, images, and grid layout.",
    href: "/admin/projects",
  },
  {
    label: "About",
    desc: "Edit bio, personal details, and tech stack.",
    href: "/admin/about",
  },
  {
    label: "Stats",
    desc: "Update the animated stat counters.",
    href: "/admin/stats",
  },
  {
    label: "Testimonials",
    desc: "Manage peer reviews and quotes.",
    href: "/admin/testimonials",
  },
  {
    label: "Hero",
    desc: "Edit scroll-linked hero overlay cards.",
    href: "/admin/hero",
  },
  {
    label: "Contact",
    desc: "Update CTA section heading, subtitle, and email.",
    href: "/admin/contact",
  },
  {
    label: "Site Settings",
    desc: "Brand name, footer, navbar links, SEO metadata.",
    href: "/admin/settings",
  },
];

export default function AdminDashboard() {
  const [pin, setPin] = useState<string | null>(null);

  const onAuth = useCallback((p: string) => {
    setPin(p);
  }, []);

  if (!pin) return <AdminPinGate onAuth={onAuth} />;

  return (
    <div style={{ padding: "3rem 2rem" }}>
      <h1
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "1.8rem",
          fontWeight: 700,
          color: "#e8e8e8",
          marginBottom: "0.5rem",
          letterSpacing: "-0.02em",
        }}
      >
        Dashboard
      </h1>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.85rem",
          color: "#444",
          marginBottom: "2.5rem",
        }}
      >
        Manage all site content from one place.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {CARDS.map((c) => (
          <a
            key={c.href}
            href={c.href}
            style={{
              background: "rgba(18,18,18,0.95)",
              border: "1px solid #1e1e1e",
              borderRadius: 12,
              padding: "1.75rem",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#c8f135";
              e.currentTarget.style.background = "rgba(24,24,24,0.95)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1e1e1e";
              e.currentTarget.style.background = "rgba(18,18,18,0.95)";
            }}
          >
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "1rem",
                fontWeight: 600,
                color: "#e8e8e8",
                marginBottom: "0.5rem",
                letterSpacing: "-0.01em",
              }}
            >
              {c.label}
            </h3>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8rem",
                color: "#555",
                lineHeight: 1.6,
              }}
            >
              {c.desc}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
