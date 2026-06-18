"use client";
import { TestimonialsData } from "@/components/admin/types";

interface Props {
  data: TestimonialsData;
}

export default function TestimonialsSectionClient({ data }: Props) {
  const { testimonials } = data;

  // Duplicate for seamless loop
  const all = [...testimonials, ...testimonials];

  return (
    <section
      style={{
        padding: "8rem 0",
        overflow: "hidden",
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <div
        style={{ padding: "0 2rem", maxWidth: "1200px", margin: "0 auto 4rem" }}
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
            PEER REVIEWS
          </span>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "var(--fg)",
          }}
        >
          Trusted by builders
        </h2>
      </div>

      {/* Infinite scroll track */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Fade masks */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "160px",
            background: "linear-gradient(to right, var(--bg), transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "160px",
            background: "linear-gradient(to left, var(--bg), transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div className="testimonial-track">
          {all.map((t, i) => (
            <div
              key={t.id + "-" + i}
              style={{
                flex: "0 0 min(400px, 85vw)",
                marginRight: "1px",
                background: "var(--card)",
                padding: "2.5rem 2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "2rem",
                border: "1px solid var(--border)",
                cursor: "default",
              }}
            >
              {/* Quote */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: "var(--fg)",
                  lineHeight: 1.7,
                  opacity: 0.85,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Attribution */}
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--fg)",
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    marginTop: "0.2rem",
                  }}
                >
                  {t.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
