"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Comment } from "@/components/admin/types";

interface Props {
  initialComments: Comment[];
}

export default function CommentsSectionClient({ initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Hydrate with latest from server on mount (in case static page is stale)
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setName("");
        setMessage("");
        setSent(true);
        setTimeout(() => setSent(false), 3000);
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSending(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <section
      style={{
        padding: "6rem 2rem",
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
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
            LEAVE A THOUGHT
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "var(--fg)",
            marginBottom: "2rem",
          }}
        >
          Share your thoughts
        </motion.h2>

        {/* Comment form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
            marginBottom: "3rem",
          }}
        >
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "0.75rem 1rem",
              color: "var(--fg)",
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />

          <textarea
            placeholder="Write your comment..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={500}
            required
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "0.75rem 1rem",
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--muted)",
              }}
            >
              {message.length}/500
            </span>

            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="magnetic-btn"
              style={{ cursor: sending ? "default" : "pointer" }}
            >
              {sent ? (
                <span>✓ Posted!</span>
              ) : sending ? (
                <span>Posting…</span>
              ) : (
                <>
                  <span>Post comment</span>
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

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "var(--border)",
            marginBottom: "2.5rem",
          }}
        />

        {/* Comments list */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {comments.length === 0 && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                color: "var(--muted)",
                textAlign: "center",
                padding: "3rem 1rem",
              }}
            >
              No comments yet. Be the first to share your thoughts!
            </p>
          )}

          {comments.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "1.25rem 1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  {/* Avatar circle */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: `hsl(${((c.name.charCodeAt(0) || 0) * 37) % 360}, 40%, 25%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "var(--fg)",
                      flexShrink: 0,
                    }}
                  >
                    {(c.name || "A")[0].toUpperCase()}
                  </div>

                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--fg)",
                    }}
                  >
                    {c.name}
                  </span>
                </div>

                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.72rem",
                    color: "var(--muted)",
                  }}
                >
                  {formatDate(c.timestamp)}
                </span>
              </div>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: "var(--fg)",
                  lineHeight: 1.7,
                  opacity: 0.85,
                }}
              >
                {c.message}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
