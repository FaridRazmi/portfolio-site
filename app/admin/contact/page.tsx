"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminPinGate from "@/components/admin/AdminPinGate";
import { ContactData } from "@/components/admin/types";

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

export default function AdminContactPage() {
  const router = useRouter();
  const [pin, setPin] = useState<string | null>(null);
  const [data, setData] = useState<ContactData | null>(null);
  const [form, setForm] = useState<ContactData>({
    heading: "",
    subtitle: "",
    email: "",
    web3formsAccessKey: "",
    sectionLabel: "",
    github: "",
    linkedin: "",
  });
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
    const res = await fetch("/api/contact-config", {
      headers: { Authorization: `Bearer ${authPin}` },
    });
    const json: ContactData = await res.json();
    setData(json);
    setForm(json);
  }, []);

  const onAuth = useCallback(
    (p: string) => {
      setPin(p);
      fetchData(p);
    },
    [fetchData],
  );

  const update = (field: keyof ContactData, val: string) => {
    setForm((f) => ({ ...f, [field]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/contact-config", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pin}`,
      },
      body: JSON.stringify(form),
    });
    setData(form);
    showToast("Contact section updated!");
    setSaving(false);
    router.refresh();
  };

  if (!pin || !data) return <AdminPinGate onAuth={onAuth} />;

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 700 }}>
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
        Edit Contact Page
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <label style={labelStyle}>Section Label</label>
          <input
            style={inputStyle}
            value={form.sectionLabel}
            onChange={(e) => update("sectionLabel", e.target.value)}
            placeholder="GET IN TOUCH"
          />
        </div>
        <div>
          <label style={labelStyle}>Heading</label>
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            value={form.heading}
            onChange={(e) => update("heading", e.target.value)}
            placeholder="Let's build\nsomething great."
          />
          <span
            style={{
              fontSize: "0.7rem",
              color: "#444",
              marginTop: 4,
              display: "block",
            }}
          >
            Use {"\n"} for line breaks
          </span>
        </div>
        <div>
          <label style={labelStyle}>Subtitle</label>
          <textarea
            style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
            value={form.subtitle}
            onChange={(e) => update("subtitle", e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Contact Email</label>
          <input
            style={inputStyle}
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label style={labelStyle}>Web3Forms Access Key</label>
          <input
            style={inputStyle}
            value={form.web3formsAccessKey}
            onChange={(e) => update("web3formsAccessKey", e.target.value)}
            placeholder="YOUR_WEB3FORMS_ACCESS_KEY_HERE"
          />
          <span
            style={{
              fontSize: "0.7rem",
              color: "#444",
              marginTop: 4,
              display: "block",
            }}
          >
            Get yours at web3forms.com. Leave as placeholder for dev mode.
          </span>
        </div>

        <div
          style={{
            height: "1px",
            background: "#1a1a1a",
            margin: "0.5rem 0",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <label style={labelStyle}>GitHub URL</label>
            <input
              style={inputStyle}
              value={form.github}
              onChange={(e) => update("github", e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label style={labelStyle}>LinkedIn URL</label>
            <input
              style={inputStyle}
              value={form.linkedin}
              onChange={(e) => update("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
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
          marginTop: "2rem",
        }}
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
