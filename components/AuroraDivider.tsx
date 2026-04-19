"use client";
import Aurora from "./Aurora";

export default function AuroraDivider() {
  return (
    <div style={{ position: "relative", height: "40vh", minHeight: "300px", width: "100%", overflow: "hidden" }}>
      <Aurora colorStops={["#c8f135", "#4af7c2", "#7c6af7"]} blend={0.6} amplitude={1.2} speed={0.8} />
      
      {/* Top and bottom fade to blend with the background seamlessly */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, var(--bg) 0%, transparent 15%, transparent 85%, var(--bg) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
