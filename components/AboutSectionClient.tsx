"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { AboutData } from "@/components/admin/types";

interface Props {
  data: AboutData;
}

export default function AboutSectionClient({ data }: Props) {
  const { bioWords, details, techStack } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const [wordProgress, setWordProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = Math.max(
        0,
        Math.min(1, (viewH - rect.top) / (rect.height + viewH * 0.5)),
      );
      setWordProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about-section">
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "4rem",
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
            ABOUT
          </span>
        </motion.div>

        {/* Scroll-reveal paragraph */}
        <p
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1.3,
            color: "var(--fg)",
          }}
        >
          {bioWords.map((word, i) => {
            const wordStart = (i / bioWords.length) * 0.8;
            const wordEnd = ((i + 1) / bioWords.length) * 0.8 + 0.1;
            const opacity = Math.max(
              0.1,
              Math.min(1, (wordProgress - wordStart) / (wordEnd - wordStart)),
            );

            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  marginRight: "0.4em",
                  opacity,
                  transform: `translateY(${(1 - opacity) * 6}px)`,
                  transition: "opacity 0.1s, transform 0.1s",
                }}
              >
                {word}
              </span>
            );
          })}
        </p>

        {/* Details grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            marginTop: "6rem",
            paddingTop: "3rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          {details.map(({ label, value }) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  color: "var(--muted)",
                  marginBottom: "0.4rem",
                }}
              >
                {label.toUpperCase()}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.05rem",
                  fontWeight: 500,
                  color: "var(--fg)",
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tech stack pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            marginTop: "3rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {techStack.map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                padding: "6px 14px",
                border: "1px solid var(--border)",
                borderRadius: "100px",
                color: "var(--fg)",
                background: "var(--card)",
                letterSpacing: "0.02em",
              }}
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
