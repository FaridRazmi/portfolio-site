"use client";

interface Props {
  brandName: string;
  brandSuffix: string;
  tagline: string;
  copyrightName: string;
}

export default function FooterClient({
  brandName,
  brandSuffix,
  tagline,
  copyrightName,
}: Props) {
  return (
    <footer className="footer">
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.1rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--fg)",
            textDecoration: "none",
          }}
        >
          {brandName}
          <span style={{ color: "var(--accent)" }}>{brandSuffix}</span>
        </a>

        {/* Center */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            color: "var(--muted)",
            textAlign: "center",
          }}
        >
          {tagline}
          <br />© {new Date().getFullYear()} {copyrightName}. All rights
          reserved.
        </p>

        {/* Right: back to top */}
        <a
          href="#"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            color: "var(--muted)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.color = "var(--fg)")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.color = "var(--muted)")
          }
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 9V3M3 6l3-3 3 3"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to top
        </a>
      </div>
    </footer>
  );
}
