"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";

interface PreloaderProps {
  totalFrames: number;
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const progress = useMotionValue(0);
  const width = useTransform(progress, [0, 100], ["0%", "100%"]);
  const opacity = useMotionValue(1);
  const called = useRef(false);

  useEffect(() => {
    // Rush to ~70% quickly, then snap to 100 and fade out
    const step1 = animate(progress, 72, {
      duration: 0.35,
      ease: [0.25, 1, 0.5, 1],
    });

    const t = setTimeout(() => {
      animate(progress, 100, {
        duration: 0.25,
        ease: "easeIn",
        onComplete: () => {
          animate(opacity, 0, {
            duration: 0.3,
            delay: 0.08,
            onComplete: () => {
              if (!called.current) {
                called.current = true;
                onComplete();
              }
            },
          });
        },
      });
    }, 380);

    return () => {
      step1.stop();
      clearTimeout(t);
    };
  }, [onComplete, progress, opacity]);

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--bg)",
        opacity,
        pointerEvents: "none",
      }}
    >
      {/* Slim top progress bar */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "2px",
          width,
          background:
            "linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 100%)",
          boxShadow: "0 0 12px var(--accent)",
          zIndex: 10000,
          transformOrigin: "left",
        }}
      />

      {/* Tiny dot at leading edge */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: width,
          width: "5px",
          height: "2px",
          background: "var(--accent)",
          boxShadow: "0 0 8px 3px var(--accent)",
          zIndex: 10001,
          transform: "translateX(-100%)",
        }}
      />
    </motion.div>
  );
}
