"use client";
import { useState, useEffect } from "react";

interface Props {
  onAuth: () => void;
}

export default function AdminPinGate({ onAuth }: Props) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [checking, setChecking] = useState(true);

  // On mount, check whether an httpOnly session cookie already exists.
  // The PIN is never stored in sessionStorage/localStorage — only the
  // server-issued signed cookie grants access.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/session")
      .then((r) => {
        if (!cancelled && r.ok) onAuth();
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [onAuth]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    if (res.ok) {
      onAuth();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPin("");
    }
  };

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0c0c0c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#555",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "0.85rem",
          letterSpacing: "0.08em",
        }}
      >
        Checking…
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0c0c0c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          background: "rgba(18,18,18,0.95)",
          border: "1px solid #222",
          borderRadius: 16,
          padding: "3rem 3.5rem",
          width: 360,
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,241,53,0.06) inset",
          animation: shake ? "shake 0.4s ease" : undefined,
        }}
      >
        <style>{`
          @keyframes shake {
            0%,100%{transform:translateX(0)}
            20%{transform:translateX(-8px)}
            40%{transform:translateX(8px)}
            60%{transform:translateX(-6px)}
            80%{transform:translateX(6px)}
          }
        `}</style>

        <div>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#e8e8e8",
              letterSpacing: "-0.02em",
              marginBottom: "0.4rem",
            }}
          >
            Admin Access
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.82rem",
              color: "#555",
            }}
          >
            Enter your admin PIN to manage projects.
          </p>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <input
            autoFocus
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            style={{
              background: "#0c0c0c",
              border: `1px solid ${error ? "rgba(247,74,74,0.5)" : "#222"}`,
              borderRadius: 8,
              padding: "0.75rem 1rem",
              color: "#e8e8e8",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1rem",
              outline: "none",
              letterSpacing: "0.3em",
            }}
          />
          {error && (
            <span
              style={{
                fontSize: "0.75rem",
                color: "#f74a4a",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Incorrect PIN. Try again.
            </span>
          )}
        </div>

        <button
          type="submit"
          style={{
            background: pin ? "#c8f135" : "#1a1a1a",
            color: pin ? "#000" : "#555",
            border: "none",
            borderRadius: 8,
            padding: "0.8rem",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: pin ? "pointer" : "default",
            transition: "all 0.2s",
          }}
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
