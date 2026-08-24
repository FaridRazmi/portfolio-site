"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminPinGate from "@/components/admin/AdminPinGate";
import { HeroData, HeroOverlay } from "@/components/admin/types";

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

const inputStyle: React.CSSProperties = {
  background: "#0c0c0c",
  border: "1px solid #222",
  borderRadius: 8,
  padding: "0.5rem 0.75rem",
  color: "#e8e8e8",
  fontFamily: "var(--font-body)",
  fontSize: "0.85rem",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: "0.65rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  color: "#555",
  textTransform: "uppercase",
  marginBottom: 4,
  display: "block",
};

export default function AdminHeroPage() {
  const router = useRouter();
  const [overlays, setOverlays] = useState<HeroOverlay[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/hero");
    const json: HeroData = await res.json();
    setOverlays(json.overlays);
    setLoaded(true);
  }, []);

  const onAuth = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const updateOverlay = (
    idx: number,
    field: keyof HeroOverlay,
    val: unknown,
  ) => {
    setOverlays((o) =>
      o.map((item, i) => (i === idx ? { ...item, [field]: val } : item)),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/hero", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ overlays }),
    });
    showToast("Hero section updated!");
    setSaving(false);
    router.refresh();
  };

  if (!loaded) return <AdminPinGate onAuth={onAuth} />;

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 900 }}>
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "#e8e8e8",
          marginBottom: "2rem",
          letterSpacing: "-0.02em",
        }}
      >
        Edit Hero Overlays
      </h2>

      {overlays.map((o, i) => (
        <div
          key={o.id}
          style={{
            background: "rgba(18,18,18,0.95)",
            border: "1px solid #1e1e1e",
            borderRadius: 12,
            padding: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "#c8f135",
              letterSpacing: "0.1em",
              marginBottom: "1rem",
              textTransform: "uppercase",
            }}
          >
            Overlay {i + 1}: {o.label}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            <div>
              <label style={labelStyle}>Heading</label>
              <input
                style={inputStyle}
                value={o.heading}
                onChange={(e) => updateOverlay(i, "heading", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Label</label>
              <input
                style={inputStyle}
                value={o.label}
                onChange={(e) => updateOverlay(i, "label", e.target.value)}
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={labelStyle}>Subtitle</label>
              <input
                style={inputStyle}
                value={o.sub}
                onChange={(e) => updateOverlay(i, "sub", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Scroll Start (0–1)</label>
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                style={inputStyle}
                value={o.start}
                onChange={(e) =>
                  updateOverlay(i, "start", parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Scroll End (0–1)</label>
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                style={inputStyle}
                value={o.end}
                onChange={(e) =>
                  updateOverlay(i, "end", parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <label style={labelStyle}>Alignment</label>
              <select
                style={inputStyle}
                value={o.align}
                onChange={(e) => updateOverlay(i, "align", e.target.value)}
              >
                <option value="center">Center</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "end" }}>
              <label
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "0.78rem",
                  color: "#ccc",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={o.isCTA}
                  onChange={(e) => updateOverlay(i, "isCTA", e.target.checked)}
                  style={{ accentColor: "#c8f135" }}
                />
                Show CTA Button
              </label>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          background: "#c8f135",
          color: "#000",
          border: "none",
          borderRadius: 8,
          padding: "0.75rem 2rem",
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          fontSize: "0.9rem",
          cursor: "pointer",
        }}
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
