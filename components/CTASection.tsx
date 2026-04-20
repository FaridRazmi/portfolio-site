"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  dur: Math.random() * 8 + 4,
  delay: Math.random() * 4,
}));

export default function CTASection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formState,
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          subject: `New Portfolio Message from ${formState.name}`
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSent(true);
        setFormState({ name: "", email: "", message: "" });
        setTimeout(() => setSent(false), 4000);
      } else {
        alert("Failed to send message: " + (json.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Failed to submit form:", err);
      alert("An error occurred. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="cta-section"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Animated particles background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, #111 0%, #0c0c0c 100%)",
        }}
      >
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background:
                p.id % 3 === 0
                  ? "var(--accent)"
                  : p.id % 3 === 1
                    ? "var(--accent-2)"
                    : "#7c6af7",
              opacity: 0.4,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: p.dur,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Gradient rings */}
        <div
          style={{
            position: "absolute",
            inset: "50%",
            width: "600px",
            height: "600px",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,241,53,0.04) 0%, transparent 70%)",
            animation: "pulse-ring 6s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
      `}</style>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "760px",
          margin: "0 auto",
          padding: "0 2rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              justifyContent: "center",
              marginBottom: "1.5rem",
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
              GET IN TOUCH
            </span>
            <div
              style={{
                width: "32px",
                height: "1px",
                background: "var(--accent)",
              }}
            />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.8rem, 7vw, 6rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              marginBottom: "1.5rem",
            }}
            className="gradient-text"
          >
            Let&apos;s build
            <br />
            something great.
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "var(--muted)",
              lineHeight: 1.7,
              marginBottom: "3rem",
            }}
          >
            Whether you have a project in mind, a job opportunity, or just want
            to connect — my inbox is always open.
          </p>
        </motion.div>

        {/* Contact form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              {
                id: "name",
                label: "Name",
                type: "text",
                placeholder: "Your name",
              },
              {
                id: "email",
                label: "Email",
                type: "email",
                placeholder: "your@email.com",
              },
            ].map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  style={{
                    display: "block",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    color: "var(--muted)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {field.label.toUpperCase()}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required
                  value={field.id === "name" ? formState.name : formState.email}
                  onChange={(e) =>
                    setFormState((s) => ({ ...s, [field.id]: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    color: "var(--fg)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--accent)")
                  }
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            ))}
          </div>

          <div>
            <label
              htmlFor="message"
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                color: "var(--muted)",
                marginBottom: "0.4rem",
              }}
            >
              MESSAGE
            </label>
            <textarea
              id="message"
              placeholder="Tell me about your project..."
              required
              rows={5}
              value={formState.message}
              onChange={(e) =>
                setFormState((s) => ({ ...s, message: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                color: "var(--fg)",
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                outline: "none",
                resize: "vertical",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "0.5rem",
            }}
          >
            <a
              href="mailto:faridrazmi30@gmail.com"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                color: "var(--muted)",
                textDecoration: "none",
              }}
            >
              Or email directly → faridrazmi30@gmail.com
            </a>

            <button
              type="submit"
              className="magnetic-btn"
              style={{ cursor: "pointer" }}
            >
              {sent ? (
                <>
                  <span>✓ Sent!</span>
                </>
              ) : (
                <>
                  <span>{sending ? "Sending..." : "Send message"}</span>
                  {!sending && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
