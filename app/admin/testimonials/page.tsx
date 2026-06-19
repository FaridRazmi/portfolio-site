"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminPinGate from "@/components/admin/AdminPinGate";
import { TestimonialsData, Testimonial } from "@/components/admin/types";

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
  padding: "0.5rem 0.75rem",
  color: "#e8e8e8",
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.85rem",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "0.65rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  color: "#555",
  textTransform: "uppercase",
  marginBottom: 4,
  display: "block",
};

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [pin, setPin] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [panel, setPanel] = useState<"new" | Testimonial | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchData = useCallback(async (authPin: string) => {
    const res = await fetch("/api/testimonials", {
      headers: { Authorization: `Bearer ${authPin}` },
    });
    const json: TestimonialsData = await res.json();
    setTestimonials(json.testimonials);
    setLoaded(true);
  }, []);

  const onAuth = useCallback(
    (p: string) => {
      setPin(p);
      fetchData(p);
    },
    [fetchData],
  );

  const handleDelete = async (t: Testimonial) => {
    if (!confirm(`Delete testimonial from "${t.name}"?`)) return;
    await fetch(`/api/testimonials/${t.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${pin}` },
    });
    setTestimonials((ts) => ts.filter((x) => x.id !== t.id));
    showToast("Testimonial deleted");
    router.refresh();
  };

  const handleSave = (saved: Testimonial) => {
    setTestimonials((ts) => {
      const exists = ts.find((t) => t.id === saved.id);
      if (exists) return ts.map((t) => (t.id === saved.id ? saved : t));
      return [...ts, saved];
    });
    setPanel(null);
    showToast(panel === "new" ? "Testimonial added!" : "Changes saved!");
    router.refresh();
  };

  if (!loaded) return <AdminPinGate onAuth={onAuth} />;

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 900 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#e8e8e8",
            letterSpacing: "-0.02em",
          }}
        >
          Testimonials
        </h2>
        <button
          onClick={() => setPanel("new")}
          style={{
            background: "#c8f135",
            color: "#000",
            border: "none",
            borderRadius: 8,
            padding: "0.55rem 1.25rem",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          + Add Testimonial
        </button>
      </div>

      {testimonials.map((t) => (
        <div
          key={t.id}
          style={{
            background: "rgba(18,18,18,0.95)",
            border: "1px solid #1e1e1e",
            borderRadius: 12,
            padding: "1.25rem 1.5rem",
            marginBottom: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.85rem",
                color: "#ccc",
                marginBottom: "0.4rem",
                lineHeight: 1.5,
              }}
            >
              &ldquo;{t.quote}&rdquo;
            </p>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#e8e8e8",
              }}
            >
              {t.name}
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.72rem",
                color: "#555",
                marginLeft: "0.75rem",
              }}
            >
              {t.role}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button
              onClick={() => setPanel(t)}
              style={{
                background: "none",
                border: "1px solid #222",
                color: "#666",
                cursor: "pointer",
                borderRadius: 6,
                padding: "4px 12px",
                fontSize: "0.72rem",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(t)}
              style={{
                background: "none",
                border: "1px solid #222",
                color: "#444",
                cursor: "pointer",
                borderRadius: 6,
                padding: "4px 12px",
                fontSize: "0.72rem",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Del
            </button>
          </div>
        </div>
      ))}

      {panel !== null && (
        <TestimonialFormPanel
          testimonial={panel === "new" ? undefined : (panel as Testimonial)}
          pin={pin!}
          onSave={handleSave}
          onClose={() => setPanel(null)}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}

function TestimonialFormPanel({
  testimonial,
  pin,
  onSave,
  onClose,
}: {
  testimonial?: Testimonial;
  pin: string;
  onSave: (t: Testimonial) => void;
  onClose: () => void;
}) {
  const isEdit = !!testimonial;
  const [form, setForm] = useState({
    quote: testimonial?.quote ?? "",
    name: testimonial?.name ?? "",
    role: testimonial?.role ?? "",
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const url = isEdit
      ? `/api/testimonials/${testimonial!.id}`
      : "/api/testimonials";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pin}`,
      },
      body: JSON.stringify(form),
    });
    const saved = await res.json();
    onSave(saved);
    setSaving(false);
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 60,
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(500px, 95vw)",
          height: "100vh",
          background: "rgba(13,13,13,0.97)",
          borderLeft: "1px solid #1e1e1e",
          zIndex: 70,
          padding: "2rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#e8e8e8",
            }}
          >
            {isEdit ? "Edit Testimonial" : "New Testimonial"}
          </h3>
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
            }}
          >
            ✕
          </button>
        </div>
        <div>
          <label style={labelStyle}>Quote</label>
          <textarea
            style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
            value={form.quote}
            onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
            placeholder="What did they say?"
          />
        </div>
        <div>
          <label style={labelStyle}>Name</label>
          <input
            style={inputStyle}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Person's name"
          />
        </div>
        <div>
          <label style={labelStyle}>Role</label>
          <input
            style={inputStyle}
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            placeholder="e.g. CTO at Company"
          />
        </div>
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
            disabled={saving || !form.quote || !form.name}
            style={{
              flex: 2,
              background: form.quote && form.name ? "#c8f135" : "#1a1a1a",
              color: form.quote && form.name ? "#000" : "#444",
              border: "none",
              borderRadius: 8,
              padding: "0.75rem",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              cursor: form.quote && form.name ? "pointer" : "default",
            }}
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Testimonial"}
          </button>
        </div>
      </div>
    </>
  );
}
