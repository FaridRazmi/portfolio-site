"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminPinGate from "@/components/admin/AdminPinGate";
import { StatsData, StatItem } from "@/components/admin/types";

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

export default function AdminStatsPage() {
  const router = useRouter();
  const [pin, setPin] = useState<string | null>(null);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loaded, setLoaded] = useState(false);
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
    const res = await fetch("/api/stats", {
      headers: { Authorization: `Bearer ${authPin}` },
    });
    const json: StatsData = await res.json();
    setStats(json.stats);
    setLoaded(true);
  }, []);

  const onAuth = useCallback(
    (p: string) => {
      setPin(p);
      fetchData(p);
    },
    [fetchData],
  );

  const updateStat = (
    idx: number,
    field: keyof StatItem,
    val: string | number,
  ) => {
    setStats((s) =>
      s.map((item, i) => (i === idx ? { ...item, [field]: val } : item)),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/stats", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pin}`,
      },
      body: JSON.stringify({ stats }),
    });
    showToast("Stats updated!");
    setSaving(false);
    router.refresh();
  };

  if (!loaded) return <AdminPinGate onAuth={onAuth} />;

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
        Edit Stats
      </h2>

      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            background: "rgba(18,18,18,0.95)",
            border: "1px solid #1e1e1e",
            borderRadius: 12,
            padding: "1.5rem",
            marginBottom: "1rem",
            display: "grid",
            gridTemplateColumns: "80px 80px 1fr 1fr",
            gap: "1rem",
            alignItems: "end",
          }}
        >
          <div>
            <label
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.65rem",
                color: "#555",
                display: "block",
                marginBottom: 4,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Value
            </label>
            <input
              type="number"
              style={inputStyle}
              value={s.value}
              onChange={(e) =>
                updateStat(i, "value", parseInt(e.target.value) || 0)
              }
            />
          </div>
          <div>
            <label
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.65rem",
                color: "#555",
                display: "block",
                marginBottom: 4,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Suffix
            </label>
            <input
              style={inputStyle}
              value={s.suffix}
              onChange={(e) => updateStat(i, "suffix", e.target.value)}
              placeholder="+"
            />
          </div>
          <div>
            <label
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.65rem",
                color: "#555",
                display: "block",
                marginBottom: 4,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Label
            </label>
            <input
              style={inputStyle}
              value={s.label}
              onChange={(e) => updateStat(i, "label", e.target.value)}
            />
          </div>
          <div>
            <label
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.65rem",
                color: "#555",
                display: "block",
                marginBottom: 4,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Description
            </label>
            <input
              style={inputStyle}
              value={s.description}
              onChange={(e) => updateStat(i, "description", e.target.value)}
            />
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
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "0.9rem",
          cursor: "pointer",
          marginTop: "1rem",
        }}
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
