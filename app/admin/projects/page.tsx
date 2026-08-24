"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminPinGate from "@/components/admin/AdminPinGate";
import ProjectFormPanel from "@/components/admin/ProjectFormPanel";
import { Project } from "@/components/admin/types";

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
        fontFamily: "var(--font-heading)",
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

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [panel, setPanel] = useState<"new" | Project | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data.sort((a: Project, b: Project) => a.order - b.order));
    setLoading(false);
    setLoaded(true);
  }, []);

  const onAuth = useCallback(() => {
    fetchProjects();
  }, [fetchProjects]);

  const saveReorder = async (ordered: Project[]) => {
    const updated = ordered.map((p, i) => ({ ...p, order: i }));
    setProjects(updated);
    await fetch("/api/projects", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updated),
    });
    router.refresh();
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Delete "${project.title}"?`)) return;
    await fetch(`/api/projects/${project.id}`, {
      method: "DELETE",
    });
    setProjects((ps) => ps.filter((p) => p.id !== project.id));
    showToast("Project deleted");
    router.refresh();
  };

  const handleSave = (saved: Project) => {
    setProjects((ps) => {
      const exists = ps.find((p) => p.id === saved.id);
      if (exists) return ps.map((p) => (p.id === saved.id ? saved : p));
      return [...ps, saved];
    });
    setPanel(null);
    showToast(panel === "new" ? "Project created!" : "Changes saved!");
    router.refresh();
  };

  // Drag-to-reorder handlers
  const onDragStart = (id: string) => setDraggingId(id);
  const onDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverId(id);
  };
  const onDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }
    const list = [...projects];
    const fromIdx = list.findIndex((p) => p.id === draggingId);
    const toIdx = list.findIndex((p) => p.id === targetId);
    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved);
    setDraggingId(null);
    setDragOverId(null);
    saveReorder(list);
  };

  if (!loaded) return <AdminPinGate onAuth={onAuth} />;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0c0c0c",
        color: "#e8e8e8",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #1a1a1a",
          padding: "1.25rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(13,13,13,0.97)",
          position: "sticky",
          top: 0,
          zIndex: 30,
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            href="/"
            style={{
              color: "#444",
              textDecoration: "none",
              fontSize: "0.8rem",
              fontFamily: "var(--font-heading)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← Portfolio
          </Link>
          <span style={{ color: "#222" }}>|</span>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#e8e8e8",
            }}
          >
            Projects Admin
          </span>
          <span
            style={{
              background: "rgba(200,241,53,0.1)",
              border: "1px solid rgba(200,241,53,0.25)",
              color: "#c8f135",
              fontSize: "0.65rem",
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              letterSpacing: "0.12em",
              padding: "2px 8px",
              borderRadius: 100,
            }}
          >
            DEV ONLY
          </span>
        </div>
        <button
          onClick={() => setPanel("new")}
          style={{
            background: "#c8f135",
            color: "#000",
            border: "none",
            borderRadius: 8,
            padding: "0.55rem 1.25rem",
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          + Add Project
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 2rem" }}>
        <p
          style={{
            fontSize: "0.78rem",
            color: "#333",
            marginBottom: "1.5rem",
            fontFamily: "var(--font-heading)",
          }}
        >
          Drag rows to reorder. Changes save automatically.
        </p>

        {loading ? (
          <div style={{ color: "#333", padding: "4rem", textAlign: "center" }}>Loading…</div>
        ) : (
          <div
            style={{
              background: "rgba(14,14,14,0.95)",
              border: "1px solid #1a1a1a",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "32px 200px 1fr 200px 90px 90px",
                gap: "1rem",
                padding: "0.75rem 1.25rem",
                borderBottom: "1px solid #1a1a1a",
                background: "#111",
              }}
            >
              {["", "Title", "Description", "Tags", "Grid", ""].map((h, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    color: "#444",
                    textTransform: "uppercase",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {projects.map((p) => (
              <div
                key={p.id}
                draggable
                onDragStart={() => onDragStart(p.id)}
                onDragOver={(e) => onDragOver(e, p.id)}
                onDrop={() => onDrop(p.id)}
                onDragEnd={() => { setDraggingId(null); setDragOverId(null); }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 200px 1fr 200px 90px 90px",
                  gap: "1rem",
                  padding: "0.75rem 1.25rem",
                  borderBottom: "1px solid #131313",
                  alignItems: "center",
                  background:
                    draggingId === p.id
                      ? "rgba(200,241,53,0.04)"
                      : dragOverId === p.id
                        ? "rgba(200,241,53,0.08)"
                        : "transparent",
                  cursor: "grab",
                  transition: "background 0.15s",
                }}
              >
                {/* Drag handle */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    opacity: 0.3,
                    cursor: "grab",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{ width: 16, height: 1.5, background: "#e8e8e8", borderRadius: 2 }}
                    />
                  ))}
                </div>

                {/* Title + image dot */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                  {p.image ? (
                    <img
                      src={p.image}
                      alt=""
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 4,
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 4,
                        background: `${p.accent}22`,
                        border: `1px solid ${p.accent}44`,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "#e8e8e8",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.title}
                  </span>
                </div>

                {/* Description (truncated) */}
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#444",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.description}
                </span>

                {/* Tags */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                    overflow: "hidden",
                    maxHeight: 40,
                  }}
                >
                  {p.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: "0.6rem",
                        padding: "1px 6px",
                        border: "1px solid #222",
                        borderRadius: 100,
                        color: "#555",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                  {p.tags.length > 3 && (
                    <span style={{ fontSize: "0.6rem", color: "#333" }}>
                      +{p.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Grid info */}
                <span style={{ fontSize: "0.68rem", color: "#333", fontVariantNumeric: "tabular-nums" }}>
                  c{p.col}×{p.colSpan} r{p.row}×{p.rowSpan}
                </span>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => setPanel(p)}
                    style={{
                      background: "none",
                      border: "1px solid #222",
                      color: "#666",
                      cursor: "pointer",
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: "0.72rem",
                      fontFamily: "var(--font-heading)",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.borderColor = "#c8f135";
                      (e.target as HTMLButtonElement).style.color = "#c8f135";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.borderColor = "#222";
                      (e.target as HTMLButtonElement).style.color = "#666";
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    style={{
                      background: "none",
                      border: "1px solid #222",
                      color: "#444",
                      cursor: "pointer",
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: "0.72rem",
                      fontFamily: "var(--font-heading)",
                      transition: "all 0.15s",
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
                    Del
                  </button>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <div
                style={{
                  padding: "4rem",
                  textAlign: "center",
                  color: "#333",
                  fontFamily: "var(--font-heading)",
                }}
              >
                No projects yet.{" "}
                <button
                  onClick={() => setPanel("new")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#c8f135",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textDecoration: "underline",
                  }}
                >
                  Add your first one →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Slide-over form */}
      {panel !== null && (
        <ProjectFormPanel
          project={panel === "new" ? undefined : (panel as Project)}
          onSave={handleSave}
          onClose={() => setPanel(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
