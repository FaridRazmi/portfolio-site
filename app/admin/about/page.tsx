"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminPinGate from "@/components/admin/AdminPinGate";
import { AboutData } from "@/components/admin/types";

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

export default function AdminAboutPage() {
  const router = useRouter();
  const [pin, setPin] = useState<string | null>(null);
  const [data, setData] = useState<AboutData | null>(null);
  const [bioText, setBioText] = useState("");
  const [details, setDetails] = useState([{ label: "", value: "" }]);
  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchData = useCallback(async (authPin: string) => {
    const res = await fetch("/api/about", {
      headers: { Authorization: `Bearer ${authPin}` },
    });
    const json: AboutData = await res.json();
    setData(json);
    setBioText(json.bioWords.join(" "));
    setDetails(
      json.details.length > 0 ? json.details : [{ label: "", value: "" }],
    );
    setTechStack(json.techStack);
  }, []);

  const onAuth = useCallback(
    (p: string) => {
      setPin(p);
      fetchData(p);
    },
    [fetchData],
  );

  const addDetail = () => setDetails((d) => [...d, { label: "", value: "" }]);
  const removeDetail = (i: number) =>
    setDetails((d) => d.filter((_, idx) => idx !== i));
  const updateDetail = (i: number, field: "label" | "value", val: string) =>
    setDetails((d) =>
      d.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)),
    );

  const addTech = () => {
    const t = techInput.trim();
    if (t && !techStack.includes(t)) setTechStack((s) => [...s, t]);
    setTechInput("");
  };
  const removeTech = (tech: string) =>
    setTechStack((s) => s.filter((t) => t !== tech));

  const handleSave = async () => {
    setSaving(true);
    const bioWords = bioText.split(/\s+/).filter(Boolean);
    const payload: AboutData = {
      name: data?.name ?? "Reid",
      bioWords,
      details: details.filter((d) => d.label || d.value),
      techStack,
    };
    await fetch("/api/about", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pin}`,
      },
      body: JSON.stringify(payload),
    });
    setData(payload);
    showToast("About section updated!");
    setSaving(false);
    router.refresh();
  };

  if (!pin || !data) return <AdminPinGate onAuth={onAuth} />;

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 800 }}>
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
        Edit About Section
      </h2>

      {/* Bio words */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={labelStyle}>Bio Text (space-separated words)</label>
        <textarea
          style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
          value={bioText}
          onChange={(e) => setBioText(e.target.value)}
        />
        <span
          style={{
            fontSize: "0.7rem",
            color: "#444",
            marginTop: 4,
            display: "block",
          }}
        >
          {bioText.split(/\s+/).filter(Boolean).length} words
        </span>
      </div>

      {/* Details */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={labelStyle}>Personal Details</label>
        {details.map((d, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 8,
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: 1 }}>
              <input
                style={inputStyle}
                placeholder="Label"
                value={d.label}
                onChange={(e) => updateDetail(i, "label", e.target.value)}
              />
            </div>
            <div style={{ flex: 2 }}>
              <input
                style={inputStyle}
                placeholder="Value"
                value={d.value}
                onChange={(e) => updateDetail(i, "value", e.target.value)}
              />
            </div>
            {details.length > 1 && (
              <button
                onClick={() => removeDetail(i)}
                style={{
                  background: "none",
                  border: "1px solid #222",
                  color: "#f74a4a",
                  borderRadius: 6,
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addDetail}
          style={{
            background: "none",
            border: "1px dashed #333",
            color: "#c8f135",
            borderRadius: 8,
            padding: "6px 14px",
            cursor: "pointer",
            fontSize: "0.78rem",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          + Add Detail
        </button>
      </div>

      {/* Tech Stack */}
      <div style={{ marginBottom: "2rem" }}>
        <label style={labelStyle}>Tech Stack</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Add technology..."
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addTech())
            }
          />
          <button
            onClick={addTech}
            style={{
              background: "#c8f135",
              color: "#000",
              border: "none",
              borderRadius: 8,
              padding: "0 1rem",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            +
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {techStack.map((t) => (
            <span
              key={t}
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
              {t}
              <button
                onClick={() => removeTech(t)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#c8f135",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "0.8rem",
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          background: "#c8f135",
          color: "#000",
          border: "none",
          borderRadius: 8,
          padding: "0.75rem 2rem",
          fontFamily: "'Space Grotesk', sans-serif",
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
