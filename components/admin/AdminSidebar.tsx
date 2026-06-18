"use client";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Projects", href: "/admin/projects" },
  { label: "About", href: "/admin/about" },
  { label: "Stats", href: "/admin/stats" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Hero", href: "/admin/hero" },
  { label: "Contact", href: "/admin/contact" },
  { label: "Site Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        background: "#0a0a0a",
        borderRight: "1px solid #1a1a1a",
        minHeight: "100vh",
        padding: "1.5rem 0",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        overflowY: "auto",
        zIndex: 35,
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: "0 1.25rem 1.5rem",
          borderBottom: "1px solid #1a1a1a",
          marginBottom: "1rem",
        }}
      >
        <a
          href="/"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "#e8e8e8",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Reid<span style={{ color: "#c8f135" }}>.</span>
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              color: "#444",
              marginLeft: "0.5rem",
              letterSpacing: "0.1em",
            }}
          >
            ADMIN
          </span>
        </a>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {SECTIONS.map((s) => {
          const isActive =
            s.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(s.href);
          return (
            <a
              key={s.href}
              href={s.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.55rem 1.25rem",
                margin: "0 0.5rem",
                borderRadius: 8,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.82rem",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#c8f135" : "#555",
                textDecoration: "none",
                background: isActive ? "rgba(200,241,53,0.06)" : "transparent",
                borderLeft: isActive
                  ? "2px solid #c8f135"
                  : "2px solid transparent",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.target as HTMLAnchorElement).style.color = "#999";
                  (e.target as HTMLAnchorElement).style.background =
                    "rgba(255,255,255,0.02)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.target as HTMLAnchorElement).style.color = "#555";
                  (e.target as HTMLAnchorElement).style.background =
                    "transparent";
                }
              }}
            >
              {s.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
