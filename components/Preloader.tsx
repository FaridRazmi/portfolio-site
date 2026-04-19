"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PreloaderProps {
  totalFrames: number;
  onComplete: () => void;
}

const TERMINAL_LINES = [
  "> Initializing ReidTech OS...",
  "> Loading 3D renderer...",
  "> Mounting asset pipeline...",
  "> Compiling portfolio modules...",
  "> All systems nominal.",
];

export default function Preloader({ totalFrames, onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Simulate loading with artificial progress
    let current = 0;
    intervalRef.current = setInterval(() => {
      current += Math.random() * 3 + 1;
      if (current >= 100) {
        current = 100;
        clearInterval(intervalRef.current!);
        setTimeout(() => setDone(true), 600);
        setTimeout(() => onComplete(), 1400);
      }
      setProgress(Math.floor(current));

      // Add terminal lines at certain thresholds
      const lineIdx = Math.floor((current / 100) * TERMINAL_LINES.length);
      setDisplayedLines(TERMINAL_LINES.slice(0, lineIdx + 1));
    }, 60);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <div style={{ width: "min(340px, 90vw)" }}>
            {/* Terminal window */}
            <div
              style={{
                background: "#0c0c0c",
                border: "1px solid #222",
                borderRadius: "8px",
                overflow: "hidden",
                marginBottom: "2rem",
              }}
            >
              {/* Window bar */}
              <div
                style={{
                  background: "#161616",
                  padding: "0.6rem 1rem",
                  display: "flex",
                  gap: "6px",
                  alignItems: "center",
                  borderBottom: "1px solid #222",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#ff5f56",
                    display: "block",
                  }}
                />
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#ffbd2e",
                    display: "block",
                  }}
                />
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#27c93f",
                    display: "block",
                  }}
                />
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: "monospace",
                    fontSize: "0.7rem",
                    color: "#444",
                  }}
                >
                  reidtech_os — bash
                </span>
              </div>

              {/* Terminal body */}
              <div
                style={{
                  padding: "1.25rem",
                  fontFamily: "'Fira Code', 'Courier New', monospace",
                  fontSize: "0.75rem",
                  lineHeight: "1.8",
                  minHeight: "160px",
                }}
              >
                {displayedLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      color:
                        i === displayedLines.length - 1 ? "#c8f135" : "#666",
                    }}
                  >
                    {line}
                    {i === displayedLines.length - 1 && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        style={{ marginLeft: "2px" }}
                      >
                        _
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "#444",
                  letterSpacing: "0.1em",
                }}
              >
                LOADING ASSETS
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "#c8f135",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                {progress}%
              </span>
            </div>
            <div className="preloader-bar">
              <div
                className="preloader-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
