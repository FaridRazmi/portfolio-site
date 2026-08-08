"use client";
import React, { useEffect, useRef, useMemo } from "react";
import { motion } from "motion/react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HeroOverlay } from "@/components/admin/types";

interface Props {
  overlays: HeroOverlay[];
  onLoaded?: () => void;
}

function Scene({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particlesCount = 2000;
  const particlesPosition = useMemo(() => {
    const p = new Float32Array(particlesCount * 3);
    // Simple LCG pseudo-random generator to remain pure during render
    let seed = 1;
    const lcg = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let i = 0; i < particlesCount; i++) {
      p[i * 3 + 0] = (lcg() - 0.5) * 40;
      p[i * 3 + 1] = (lcg() - 0.5) * 40;
      p[i * 3 + 2] = (lcg() - 0.5) * 40;
    }
    return p;
  }, []);

  useFrame((state, delta) => {
    const p = scrollProgress.current;

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.rotation.x += delta * 0.15;

      const targetY = p * Math.PI * 4;
      const targetZ = p * 15;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetY,
        0.1,
      );
      meshRef.current.position.z = THREE.MathUtils.lerp(
        meshRef.current.position.z,
        targetZ,
        0.1,
      );
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.05;
      const targetZ = p * 30;
      particlesRef.current.position.z = THREE.MathUtils.lerp(
        particlesRef.current.position.z,
        targetZ,
        0.1,
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlesPosition, 3]}
            count={particlesCount}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#4af7c2" transparent opacity={0.4} />
      </points>

      <group ref={meshRef} position={[0, -2, -10]}>
        <mesh>
          <torusKnotGeometry args={[8, 2, 256, 32]} />
          <meshStandardMaterial
            color="#111111"
            wireframe
            wireframeLinewidth={2}
          />
        </mesh>

        <mesh>
          <icosahedronGeometry args={[5, 1]} />
          <meshBasicMaterial
            color="#c8f135"
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>
      </group>
    </>
  );
}

export default function SequenceScrollClient({ overlays, onLoaded }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const overlayRefs = useRef<(HTMLDivElement | null)[]>(
    new Array(overlays.length).fill(null),
  );

  const containerTopRef = useRef(0);
  const scrollableRef = useRef(0);
  const scrollYRef = useRef(0);
  const rafPending = useRef(false);
  const lastProgress = useRef(-1);
  const progressRef = useRef(0);
  const inViewRef = useRef(true);

  const updateOverlays = (p: number) => {
    progressRef.current = p;
    overlays.forEach((item, i) => {
      const el = overlayRefs.current[i];
      if (!el) return;

      const visible = p >= item.start && p <= item.end;
      let op = 0;
      let ty = 0;

      if (visible) {
        const fadeInRaw = (p - item.start) / 0.08;
        const fadeIn = item.start === 0 ? Math.max(1, fadeInRaw) : fadeInRaw;
        const fadeOut = 1 - (p - (item.end - 0.08)) / 0.08;
        op = Math.max(0, Math.min(1, Math.min(fadeIn, fadeOut)));
        ty = (1 - op) * (p < item.start + 0.08 ? 28 : -18);
      }

      el.style.opacity = String(op);
      el.style.transform = `translateY(${ty}px)`;
      const parent = el.parentElement;
      if (parent) parent.style.pointerEvents = op > 0.05 ? "auto" : "none";
    });

    const si = document.getElementById("scroll-indicator");
    if (si) si.style.opacity = p < 0.04 ? "1" : "0";
  };

  const cacheGeometry = () => {
    const container = containerRef.current;
    if (!container) return;
    let top = 0;
    let el: HTMLElement | null = container;
    while (el) {
      top += el.offsetTop;
      el = el.offsetParent as HTMLElement | null;
    }
    containerTopRef.current = top;
    scrollableRef.current = container.offsetHeight - window.innerHeight;
  };

  const tick = () => {
    rafPending.current = false;
    const scrollable = scrollableRef.current;
    if (scrollable <= 0) return;

    const p = Math.max(
      0,
      Math.min(1, (scrollYRef.current - containerTopRef.current) / scrollable),
    );

    if (Math.abs(p - lastProgress.current) < 0.0003) return;
    lastProgress.current = p;
    updateOverlays(p);
  };

  useEffect(() => {
    setTimeout(cacheGeometry, 500);

    const onResize = () => {
      cacheGeometry();
      scrollYRef.current = window.scrollY;
      tick();
    };

    const onScroll = () => {
      scrollYRef.current = window.scrollY;
      if (!rafPending.current) {
        rafPending.current = true;
        requestAnimationFrame(tick);
      }
    };

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    scrollYRef.current = window.scrollY;
    requestAnimationFrame(tick);

    onLoaded?.();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", height: "500vh" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{ position: "absolute", inset: 0, background: "#0c0c0c" }}
        />

        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <Canvas
            camera={{ position: [0, 0, 15], fov: 45 }}
            gl={{ antialias: true }}
          >
            <Scene scrollProgress={progressRef} />
          </Canvas>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 5,
            background:
              "radial-gradient(ellipse at center, transparent 25%, rgba(12,12,12,0.85) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "35%",
            pointerEvents: "none",
            zIndex: 6,
            background:
              "linear-gradient(to bottom, transparent, rgba(12,12,12,0.65))",
          }}
        />

        <style>{`
          @keyframes shimmer-swipe {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(400%); }
          }
          @keyframes pulse-dot {
            0%, 100% { opacity: 1; box-shadow: 0 0 6px 2px #c8f135; }
            50%        { opacity: 0.4; box-shadow: 0 0 2px 1px #c8f135; }
          }
        `}</style>

        {overlays.map((item, i) => {
          const label = item.label;
          const accentBorderLeft =
            item.align === "left" || item.align === "center"
              ? "2px solid rgba(200,241,53,0.7)"
              : "1px solid rgba(200,241,53,0.12)";
          const accentBorderRight =
            item.align === "right"
              ? "2px solid rgba(200,241,53,0.7)"
              : "1px solid rgba(200,241,53,0.12)";

          return (
            <div
              key={item.id}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  item.align === "left"
                    ? "flex-start"
                    : item.align === "right"
                      ? "flex-end"
                      : "center",
                padding: "0 6vw",
                pointerEvents: "none",
              }}
            >
              <div
                ref={(el) => {
                  overlayRefs.current[i] = el;
                }}
                style={{
                  opacity: 0,
                  transform:
                    "translateY(28px) perspective(800px) rotateX(2deg)",
                  textAlign: item.align,
                  maxWidth: 680,
                  willChange: "opacity, transform",
                }}
              >
                {/* Card */}
                <div
                  style={{
                    position: "relative",
                    background:
                      "linear-gradient(145deg, rgba(18,18,18,0.92) 0%, rgba(8,8,8,0.88) 100%)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(200,241,53,0.12)",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    borderLeft: accentBorderLeft,
                    borderRight: accentBorderRight,
                    borderRadius: "16px",
                    padding: "2.2rem 2.6rem",
                    boxShadow: [
                      "0 2px 0 rgba(255,255,255,0.04) inset",
                      "0 -1px 0 rgba(0,0,0,0.5) inset",
                      "0 1px 0 rgba(200,241,53,0.18)",
                      "0 8px 32px rgba(0,0,0,0.6)",
                      "0 24px 80px rgba(0,0,0,0.5)",
                      "0 0 60px rgba(200,241,53,0.06)",
                    ].join(", "),
                    overflow: "hidden",
                  }}
                >
                  {/* Shimmer sweep */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "25%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.045) 50%, transparent 100%)",
                      animation: "shimmer-swipe 4s ease-in-out infinite",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Label pill */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: "rgba(200,241,53,0.07)",
                      border: "1px solid rgba(200,241,53,0.22)",
                      borderRadius: "100px",
                      padding: "0.25rem 0.75rem 0.25rem 0.5rem",
                      marginBottom: "1.1rem",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#c8f135",
                        display: "block",
                        animation: "pulse-dot 2s ease-in-out infinite",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "0.62rem",
                        fontWeight: 600,
                        letterSpacing: "0.22em",
                        color: "#c8f135",
                        textTransform: "uppercase",
                      }}
                    >
                      {label}
                    </span>
                  </div>

                  {/* Heading with gradient fill */}
                  {i === 0 ? (
                    <h1
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "clamp(2.2rem, 5.2vw, 4.8rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                        lineHeight: 1.05,
                        whiteSpace: "pre-line",
                        background:
                          "linear-gradient(160deg, #ffffff 0%, #d8d8d8 45%, rgba(200,241,53,0.85) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter:
                          "drop-shadow(0 2px 12px rgba(0,0,0,0.9)) drop-shadow(0 0 32px rgba(200,241,53,0.14))",
                      }}
                    >
                      {item.heading}
                    </h1>
                  ) : (
                    <h2
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "clamp(2.2rem, 5.2vw, 4.8rem)",
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                        lineHeight: 1.05,
                        whiteSpace: "pre-line",
                        background:
                          "linear-gradient(160deg, #ffffff 0%, #d8d8d8 45%, rgba(200,241,53,0.85) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter:
                          "drop-shadow(0 2px 12px rgba(0,0,0,0.9)) drop-shadow(0 0 32px rgba(200,241,53,0.14))",
                      }}
                    >
                      {item.heading}
                    </h2>
                  )}

                  {/* Divider line */}
                  <div
                    style={{
                      marginTop: "1.2rem",
                      height: "1px",
                      background:
                        "linear-gradient(90deg, rgba(200,241,53,0.35) 0%, rgba(200,241,53,0.06) 60%, transparent 100%)",
                    }}
                  />

                  {/* Subtitle */}
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(0.95rem, 1.7vw, 1.15rem)",
                      marginTop: "1rem",
                      lineHeight: 1.7,
                      fontWeight: 400,
                      letterSpacing: "0.01em",
                      background:
                        "linear-gradient(180deg, rgba(232,232,232,0.92) 0%, rgba(180,180,180,0.7) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {item.sub}
                  </p>

                  {item.isCTA && (
                    <div style={{ marginTop: "2rem" }}>
                      <a href="/contact" className="magnetic-btn">
                        <span>Get in touch</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M3 8h10M9 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div
          id="scroll-indicator"
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            zIndex: 20,
            opacity: 1,
            transition: "opacity 0.5s",
          }}
        >
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              color: "rgba(232,232,232,0.4)",
            }}
          >
            SCROLL
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "1px",
              height: "40px",
              background:
                "linear-gradient(to bottom, rgba(200,241,53,0.8), transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
