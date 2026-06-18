"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { NavLink, SocialLink } from "@/components/admin/types";

interface Props {
  brandName: string;
  brandSuffix: string;
  navLinks: NavLink[];
  socials: SocialLink[];
}

export default function NavbarClient({
  brandName,
  brandSuffix,
  navLinks,
  socials,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <a href="/" className="nav-logo" onClick={close}>
          {brandName}
          <span style={{ color: "var(--accent)" }}>{brandSuffix}</span>
        </a>

        {/* Desktop nav links — hidden on mobile */}
        <div className="nav-desktop-links">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-desktop-link"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                fontWeight: 400,
                color: "var(--muted)",
                textDecoration: "none",
                transition: "color 0.2s",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "var(--fg)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "var(--muted)")
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Hamburger button — hidden on desktop */}
        <button
          className={`menu-btn ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Fullscreen menu — only visible on mobile */}
      <div
        className={`fullscreen-menu ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        {/* Nav links */}
        <nav
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "0.25rem",
          }}
        >
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="menu-nav-link"
              data-text={link.label}
              onClick={close}
              initial={{ opacity: 0, x: -40 }}
              animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
              transition={{
                duration: 0.5,
                delay: menuOpen ? i * 0.07 + 0.2 : 0,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 400,
                  color: "var(--muted)",
                  letterSpacing: "0.1em",
                  marginRight: "1.5rem",
                  fontFamily: "var(--font-body)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {link.label}
            </motion.a>
          ))}
        </nav>

        {/* Footer of menu */}
        <motion.div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
          initial={{ opacity: 0 }}
          animate={menuOpen ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: menuOpen ? 0.5 : 0, duration: 0.4 }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              color: "var(--muted)",
            }}
          >
            Available for work ·{" "}
            <span style={{ color: "var(--accent)" }}>Open</span>
          </p>

          <div style={{ display: "flex", gap: "1.5rem" }}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  color: "var(--muted)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--fg)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--muted)")
                }
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
