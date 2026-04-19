"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const STATS: StatItem[] = [
  {
    value: 342,
    suffix: "+",
    label: "Commits",
    description: "Across personal & open-source repos",
  },
  {
    value: 4,
    suffix: "",
    label: "AI Models Trained",
    description: "Computer vision, NLP & generative",
  },
  {
    value: 12,
    suffix: "",
    label: "Projects Shipped",
    description: "From ESP32 to full-stack SaaS",
  },
  {
    value: 999,
    suffix: "+",
    label: "Cups of Coffee",
    description: "Powering late-night sessions",
  },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [displayed, setDisplayed] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;

    const duration = 1800; // ms
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Ease out cubic
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(eased * target);
      setDisplayed(current);
      if (step >= steps) {
        clearInterval(timer);
        setDisplayed(target);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {displayed.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section
      id="stats"
      style={{ padding: "8rem 2rem", background: "var(--bg)" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
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
            BY THE NUMBERS
          </span>
        </motion.div>

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            borderTop: "1px solid var(--border)",
          }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                padding: "3rem 2rem",
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                className="stat-number gradient-text"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "var(--fg)",
                  marginTop: "0.75rem",
                  marginBottom: "0.25rem",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--muted)",
                  fontFamily: "var(--font-body)",
                  lineHeight: 1.5,
                }}
              >
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
