"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { ContactData } from "@/components/admin/types";

interface Props {
  data: ContactData;
}

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  dur: Math.random() * 8 + 4,
  delay: Math.random() * 4,
}));

export default function ContactPageClient({ data }: Props) {
  const {
    heading,
    subtitle,
    email,
    web3formsAccessKey,
    sectionLabel,
    github,
    linkedin,
  } = data;
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [botcheck, setBotcheck] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = (): boolean => {
    const next: { email?: string } = {};
    if (!EMAIL_REGEX.test(formState.email)) {
      next.email = "Please enter a valid email address.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (botcheck) {
      // Silently "succeed" to not tip off bots
      setSent(true);
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 4000);
      return;
    }

    // Schema validation
    if (!validate()) return;

    setSending(true);
    try {
      const access_key = web3formsAccessKey;
      if (!access_key || access_key === "YOUR_WEB3FORMS_ACCESS_KEY_HERE") {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setSent(true);
        setFormState({ name: "", email: "", message: "" });
        setBotcheck(false);
        setTimeout(() => setSent(false), 4000);
        setSending(false);
        return;
      }
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
          access_key,
          subject: `New Portfolio Message from ${formState.name}`,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSent(true);
        setFormState({ name: "", email: "", message: "" });
        setBotcheck(false);
        setErrors({});
        setTimeout(() => setSent(false), 4000);
      } else {
        alert("Failed to send message: " + (json.message || "Unknown error"));
      }
    } catch (err) {
      alert("An error occurred. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
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
            animate={{ y: [-20, 20, -20], opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: p.dur,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: "50%",
            width: "400px",
            height: "400px",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,241,53,0.04) 0%, transparent 70%)",
            animation: "pulse-ring 6s ease-in-out infinite",
          }}
        />
      </div>
      <style>{`@keyframes pulse-ring { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.5} 50%{transform:translate(-50%,-50%) scale(1.15);opacity:1} }`}</style>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "800px",
          margin: "0 auto",
          padding: "8rem 2rem 4rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
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
              {sectionLabel}
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
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              marginBottom: "1.5rem",
              whiteSpace: "pre-line",
              textAlign: "center",
            }}
            className="gradient-text"
          >
            {heading}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "var(--muted)",
              lineHeight: 1.7,
              marginBottom: "3rem",
              textAlign: "center",
            }}
          >
            {subtitle}
          </p>
        </motion.div>

        {/* Contact form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            textAlign: "left",
          }}
        >
          {/* Honeypot — hidden from humans, visible to bots */}
          <div
            style={{
              position: "absolute",
              left: "-9999px",
              opacity: 0,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              checked={botcheck}
              onChange={(e) => setBotcheck(e.target.checked)}
            />
          </div>
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
                  onChange={(e) => {
                    setFormState((s) => ({ ...s, [field.id]: e.target.value }));
                    if (field.id === "email" && errors.email) {
                      setErrors({});
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    background: "var(--card)",
                    border: `1px solid ${field.id === "email" && errors.email ? "#ef4444" : "var(--border)"}`,
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
                  onBlur={(e) =>
                    (e.target.style.borderColor =
                      field.id === "email" && errors.email
                        ? "#ef4444"
                        : "var(--border)")
                  }
                />
                {field.id === "email" && errors.email && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: "0.7rem",
                      marginTop: "0.25rem",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {errors.email}
                  </p>
                )}
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
              href={`mailto:${email}`}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                color: "var(--muted)",
                textDecoration: "none",
              }}
            >
              Or email directly → {email}
            </a>
            <button
              type="submit"
              className="magnetic-btn"
              style={{ cursor: "pointer" }}
            >
              {sent ? (
                <span>✓ Sent!</span>
              ) : sending ? (
                <span>Sending…</span>
              ) : (
                <>
                  <span>Send message</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "2.5rem",
            marginTop: "3rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              color: "var(--muted)",
              letterSpacing: "0.1em",
              marginBottom: "1.25rem",
              textTransform: "uppercase",
            }}
          >
            Find me on
          </p>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "2rem" }}
          >
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.75rem 1.5rem",
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 100,
                  color: "var(--fg)",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(200,241,53,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* GitHub icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.75rem 1.5rem",
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 100,
                  color: "var(--fg)",
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(200,241,53,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* LinkedIn icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
