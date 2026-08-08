"use client";
import { useState, useCallback } from "react";
import { Project } from "./types";
import ProjectCardPreview from "./ProjectCardPreview";

interface Props {
  project?: Project;
  onSave: (p: Project) => void;
  onClose: () => void;
}

const EMPTY: Omit<Project, "id" | "order"> = {
  title: "",
  description: "",
  tags: [],
  col: 1,
  row: 1,
  colSpan: 4,
  rowSpan: 1,
  accent: "#c8f135",
  link: "",
  image: "",
};

const ACCENT_PRESETS = [
  "#c8f135", "#4af7c2", "#7c6af7", "#f74a4a", "#f7a24a", "#4ac4f7", "#f7c84a",
];

function GridEditorCell({
  col, row, colSpan, rowSpan, accent,
  onDragStart, activeDragging,
}: {
  col: number; row: number; colSpan: number; rowSpan: number; accent: string;
  onDragStart: (position: { col: number; row: number }) => void;
  activeDragging: { col: number; row: number } | null;
}) {
  const COLS = 12;
  const ROWS = 3;
  const cells: React.ReactNode[] = [];

  for (let r = 1; r <= ROWS; r++) {
    for (let c = 1; c <= COLS; c++) {
      const inCard =
        c >= col && c < col + colSpan && r >= row && r < row + rowSpan;
      const isOrigin = c === col && r === row;
      const isHover =
        activeDragging &&
        c >= activeDragging.col &&
        c < activeDragging.col + colSpan &&
        r >= activeDragging.row &&
        r < activeDragging.row + rowSpan;

      cells.push(
        <div
          key={`${r}-${c}`}
          draggable={isOrigin}
          onDragStart={() => onDragStart({ col: c, row: r })}
          style={{
            border: `1px solid ${inCard || isHover ? "transparent" : "#1e1e1e"}`,
            borderRadius: 3,
            background: inCard ? `${accent}33` : isHover ? `${accent}22` : "#111",
            cursor: isOrigin ? "grab" : "default",
            outline: isOrigin ? `2px solid ${accent}` : undefined,
            transition: "background 0.15s",
          }}
        />,
      );
    }
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 24px)`,
        gap: 3,
      }}
    >
      {cells}
    </div>
  );
}

export default function ProjectFormPanel({ project, onSave, onClose }: Props) {
  const isEdit = !!project;
  const [form, setForm] = useState<Omit<Project, "id" | "order">>(
    project
      ? {
          title: project.title,
          description: project.description,
          tags: project.tags,
          col: project.col,
          row: project.row,
          colSpan: project.colSpan,
          rowSpan: project.rowSpan,
          accent: project.accent,
          link: project.link,
          image: project.image,
        }
      : EMPTY,
  );
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragPos, setDragPos] = useState<{ col: number; row: number } | null>(null);
  const [dropTarget, setDropTarget] = useState<{ col: number; row: number } | null>(null);

  const set = (key: keyof typeof EMPTY, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    set("tags", form.tags.filter((t) => t !== tag));

  const uploadImage = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/projects/upload", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    set("image", data.url);
    setUploading(false);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!dropTarget) return;
      setForm((f) => ({
        ...f,
        col: Math.max(1, Math.min(12 - f.colSpan + 1, dropTarget.col)),
        row: Math.max(1, Math.min(3 - f.rowSpan + 1, dropTarget.row)),
      }));
      setDragPos(null);
      setDropTarget(null);
    },
    [dropTarget],
  );

  const save = async () => {
    setSaving(true);
    const url = isEdit ? `/api/projects/${project!.id}` : "/api/projects";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        order: project?.order ?? 999,
      }),
    });
    const saved = await res.json();
    onSave(saved);
    setSaving(false);
  };

  const inputStyle: React.CSSProperties = {
    background: "#0c0c0c",
    border: "1px solid #222",
    borderRadius: 8,
    padding: "0.6rem 0.85rem",
    color: "#e8e8e8",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.85rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    color: "#555",
    textTransform: "uppercase",
    marginBottom: 6,
    display: "block",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 40,
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(900px, 95vw)",
          height: "100vh",
          background: "rgba(13,13,13,0.97)",
          borderLeft: "1px solid #1e1e1e",
          zIndex: 50,
          overflowY: "auto",
          display: "flex",
          gap: 0,
        }}
      >
        {/* Form side */}
        <div
          style={{
            flex: 1,
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            overflowY: "auto",
            borderRight: "1px solid #1a1a1a",
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
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "#e8e8e8",
                letterSpacing: "-0.02em",
              }}
            >
              {isEdit ? "Edit Project" : "New Project"}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "1px solid #222",
                color: "#555",
                cursor: "pointer",
                borderRadius: 8,
                width: 32,
                height: 32,
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>Title</label>
            <input
              style={inputStyle}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Project name"
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What does this project do?"
            />
          </div>

          {/* Tags */}
          <div>
            <label style={labelStyle}>Tags</label>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag…"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <button
                onClick={addTag}
                style={{
                  background: "#c8f135",
                  color: "#000",
                  border: "none",
                  borderRadius: 8,
                  padding: "0 1rem",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                +
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(200,241,53,0.08)",
                    border: "1px solid rgba(200,241,53,0.2)",
                    borderRadius: 100,
                    padding: "2px 10px 2px 6px",
                    fontSize: "0.72rem",
                    color: "#c8f135",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#c8f135",
                      cursor: "pointer",
                      padding: 0,
                      fontSize: "0.8rem",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Link */}
          <div>
            <label style={labelStyle}>Link (optional)</label>
            <input
              style={inputStyle}
              value={form.link}
              onChange={(e) => set("link", e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>

          {/* Image upload */}
          <div>
            <label style={labelStyle}>Thumbnail Image</label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) uploadImage(file);
              }}
              onClick={() => document.getElementById("img-input")!.click()}
              style={{
                border: "1px dashed #333",
                borderRadius: 8,
                padding: "1.5rem",
                textAlign: "center",
                cursor: "pointer",
                background: form.image ? "#0c0c0c" : "transparent",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {form.image ? (
                <>
                  <img
                    src={form.image}
                    alt="preview"
                    style={{
                      width: "100%",
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); set("image", ""); }}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "rgba(0,0,0,0.7)",
                      border: "1px solid #333",
                      color: "#e8e8e8",
                      borderRadius: 6,
                      padding: "2px 8px",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                    }}
                  >
                    Remove
                  </button>
                </>
              ) : (
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.8rem",
                    color: "#444",
                  }}
                >
                  {uploading ? "Uploading…" : "Drop image or click to upload"}
                </span>
              )}
            </div>
            <input
              id="img-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(file);
              }}
            />
          </div>

          {/* Accent color */}
          <div>
            <label style={labelStyle}>Accent Color</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="color"
                value={form.accent}
                onChange={(e) => set("accent", e.target.value)}
                style={{
                  width: 40,
                  height: 36,
                  borderRadius: 8,
                  border: "1px solid #222",
                  background: "none",
                  padding: 2,
                  cursor: "pointer",
                }}
              />
              <input
                style={{ ...inputStyle, width: 120 }}
                value={form.accent}
                onChange={(e) => set("accent", e.target.value)}
                placeholder="#c8f135"
              />
              <div style={{ display: "flex", gap: 6 }}>
                {ACCENT_PRESETS.map((c) => (
                  <button
                    key={c}
                    onClick={() => set("accent", c)}
                    title={c}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: c,
                      border: form.accent === c ? "2px solid #fff" : "2px solid transparent",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Grid position — visual editor */}
          <div>
            <label style={labelStyle}>Grid Position (drag to reposition)</label>
            <div
              style={{
                background: "#0c0c0c",
                border: "1px solid #1e1e1e",
                borderRadius: 10,
                padding: "1rem",
                marginBottom: "0.75rem",
              }}
              onDragOver={(e) => {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const innerW = rect.width - 32;
                const innerH = rect.height - 32;
                const c = Math.max(1, Math.min(12, Math.ceil((x / innerW) * 12)));
                const r = Math.max(1, Math.min(3, Math.ceil((y / innerH) * 3)));
                setDropTarget({ col: c, row: r });
              }}
              onDrop={handleDrop}
            >
              <GridEditorCell
                col={form.col}
                row={form.row}
                colSpan={form.colSpan}
                rowSpan={form.rowSpan}
                accent={form.accent}
                onDragStart={(pos) => setDragPos(pos)}
                activeDragging={dropTarget}
              />
            </div>
            {/* Numeric fallback */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              {(["col", "row", "colSpan", "rowSpan"] as const).map((k) => (
                <div key={k}>
                  <label style={{ ...labelStyle, marginBottom: 4 }}>
                    {k === "col" ? "Col" : k === "row" ? "Row" : k === "colSpan" ? "Col Span" : "Row Span"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={k === "col" ? 12 : k === "row" ? 10 : k === "colSpan" ? 12 : 5}
                    style={{ ...inputStyle, textAlign: "center" }}
                    value={form[k]}
                    onChange={(e) => set(k, parseInt(e.target.value) || 1)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: "0.5rem" }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                background: "none",
                border: "1px solid #222",
                color: "#555",
                borderRadius: 8,
                padding: "0.75rem",
                fontFamily: "'Space Grotesk', sans-serif",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving || !form.title}
              style={{
                flex: 2,
                background: form.title ? "#c8f135" : "#1a1a1a",
                color: form.title ? "#000" : "#444",
                border: "none",
                borderRadius: 8,
                padding: "0.75rem",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                cursor: form.title ? "pointer" : "default",
                transition: "all 0.2s",
              }}
            >
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </div>

        {/* Live preview side */}
        <div
          style={{
            width: 300,
            flexShrink: 0,
            padding: "2rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: "#444",
              textTransform: "uppercase",
            }}
          >
            Live Preview
          </h3>
          <ProjectCardPreview project={{ ...form, id: project?.id ?? "preview", order: 0 }} />

          <div
            style={{
              background: "#0c0c0c",
              border: "1px solid #1a1a1a",
              borderRadius: 8,
              padding: "0.75rem 1rem",
              fontSize: "0.72rem",
              fontFamily: "'Space Grotesk', sans-serif",
              color: "#444",
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: "#666" }}>Grid</strong>
            <br />
            Col {form.col} – {form.col + form.colSpan - 1} &nbsp;·&nbsp; Span {form.colSpan}
            <br />
            Row {form.row} – {form.row + form.rowSpan - 1} &nbsp;·&nbsp; Span {form.rowSpan}
          </div>
        </div>
      </div>
    </>
  );
}
