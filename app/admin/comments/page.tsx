"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminPinGate from "@/components/admin/AdminPinGate";
import { CommentsData, Comment } from "@/components/admin/types";

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        background: type === "success" ? "#c8f135" : "#f74a4a",
        color: type === "success" ? "#000" : "#fff",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 600,
        fontSize: "0.85rem",
        padding: "0.6rem 1.5rem",
        borderRadius: 100,
        zIndex: 999,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        whiteSpace: "nowrap",
      }}
    >
      {msg}
    </div>
  );
}

export default function AdminCommentsPage() {
  const router = useRouter();
  const [pin, setPin] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchData = useCallback(async (authPin: string) => {
    const res = await fetch("/api/comments", {
      headers: { Authorization: `Bearer ${authPin}` },
    });
    const json: CommentsData = await res.json();
    setComments(json.comments);
  }, []);

  const onAuth = useCallback(
    (p: string) => {
      setPin(p);
      fetchData(p);
    },
    [fetchData],
  );

  const handleDelete = async (c: Comment) => {
    if (!confirm(`Delete comment from "${c.name}"?`)) return;
    await fetch("/api/comments", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pin}`,
      },
      body: JSON.stringify({ id: c.id }),
    });
    setComments((cs) => cs.filter((x) => x.id !== c.id));
    showToast("Comment deleted");
    router.refresh();
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!pin || comments.length === 0) return <AdminPinGate onAuth={onAuth} />;

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 900 }}>
      <h2
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "#e8e8e8",
          marginBottom: "2rem",
          letterSpacing: "-0.02em",
        }}
      >
        Comments ({comments.length})
      </h2>

      {comments.map((c) => (
        <div
          key={c.id}
          style={{
            background: "rgba(18,18,18,0.95)",
            border: "1px solid #1e1e1e",
            borderRadius: 12,
            padding: "1.25rem 1.5rem",
            marginBottom: "0.75rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#e8e8e8",
                }}
              >
                {c.name}
              </span>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.7rem",
                  color: "#444",
                }}
              >
                {formatDate(c.timestamp)}
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.85rem",
                color: "#aaa",
                lineHeight: 1.6,
              }}
            >
              {c.message}
            </p>
          </div>
          <button
            onClick={() => handleDelete(c)}
            style={{
              background: "none",
              border: "1px solid #222",
              color: "#444",
              cursor: "pointer",
              borderRadius: 6,
              padding: "4px 12px",
              fontSize: "0.72rem",
              fontFamily: "'Space Grotesk', sans-serif",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "#f74a4a";
              (e.target as HTMLButtonElement).style.color = "#f74a4a";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "#222";
              (e.target as HTMLButtonElement).style.color = "#444";
            }}
          >
            Delete
          </button>
        </div>
      ))}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
