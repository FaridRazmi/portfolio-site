"use client";
import React, { useEffect, useRef, useMemo } from "react";
import { motion } from "motion/react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const OVERLAYS = [
  {
    start: 0,
    end: 0.22,
    align: "center" as const,
    heading: "Reid",
    sub: "Software Engineer & Creative Technologist",
  },
  {
    start: 0.25,
    end: 0.48,
    align: "left" as const,
    heading: "Systems & Security",
    sub: "Architecting scalable backends and high-performance systems in C++ and Python.",
  },
  {
    start: 0.52,
    end: 0.75,
    align: "right" as const,
    heading: "AI & ML Pipelines",
    sub: "Training models and building generative AI pipelines with PyTorch & Diffusers.",
  },
  {
    start: 0.78,
    end: 1.0,
    align: "center" as const,
    heading: "Let's compile\nyour next idea.",
    sub: "Available for freelance, collabs, and full-time roles.",
    isCTA: true as const,
  },
];

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
    for (let i = 0; i < particlesCount; i++) {
      p[i * 3 + 0] = (Math.random() - 0.5) * 40;
      p[i * 3 + 1] = (Math.random() - 0.5) * 40;
      p[i * 3 + 2] = (Math.random() - 0.5) * 40;
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
            count={particlesCount}
            array={particlesPosition}
            itemSize={3}
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

export default function SequenceScroll({ onLoaded }: { onLoaded: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const overlayRefs = useRef<(HTMLDivElement | null)[]>(
    new Array(OVERLAYS.length).fill(null),
  );

  const containerTopRef = useRef(0);
  const scrollableRef = useRef(0);
  const scrollYRef = useRef(0);
  const rafPending = useRef(false);
  const lastProgress = useRef(-1);
  const progressRef = useRef(0);

  const updateOverlays = (p: number) => {
    progressRef.current = p;
    OVERLAYS.forEach((item, i) => {
      const el = overlayRefs.current[i];
      if (!el) return;

      const visible = p >= item.start && p <= item.end;
      let op = 0;
      let ty = 0;

      if (visible) {
        const fadeIn = (p - item.start) / 0.08;
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

    onLoaded();

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

        {OVERLAYS.map((item, i) => (
          <div
            key={i}
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
                transform: "translateY(28px)",
                textAlign: item.align,
                maxWidth: 660,
                willChange: "opacity, transform",
              }}
            >
              <div
                style={{
                  background: "rgba(8, 8, 8, 0.72)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  border: "1px solid rgba(200, 241, 53, 0.15)",
                  borderLeft:
                    item.align === "left" || item.align === "center"
                      ? "3px solid #c8f135"
                      : "1px solid rgba(200, 241, 53, 0.15)",
                  borderRight:
                    item.align === "right"
                      ? "3px solid #c8f135"
                      : "1px solid rgba(200, 241, 53, 0.15)",
                  borderRadius: "12px",
                  padding: "2rem 2.5rem",
                  boxShadow:
                    "0 8px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,241,53,0.05) inset",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.25em",
                    color: "#c8f135",
                    margin: "0 0 0.75rem",
                    textTransform: "uppercase",
                  }}
                >
                  {item.align === "center" && i === 0
                    ? "Portfolio"
                    : item.align === "left"
                      ? "Expertise · 01"
                      : item.align === "right"
                        ? "Expertise · 02"
                        : "Let's Connect"}
                </div>

                <h2
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.03,
                    color: "#ffffff",
                    whiteSpace: "pre-line",
                    textShadow:
                      "0 2px 8px rgba(0,0,0,0.8), 0 0 40px rgba(200,241,53,0.08)",
                  }}
                >
                  {item.heading}
                </h2>

                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
                    color: "rgba(232,232,232,0.88)",
                    marginTop: "1rem",
                    lineHeight: 1.65,
                    fontWeight: 400,
                    letterSpacing: "0.01em",
                  }}
                >
                  {item.sub}
                </p>

                {"isCTA" in item && item.isCTA && (
                  <div style={{ marginTop: "2rem" }}>
                    <a href="#contact" className="magnetic-btn">
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
        ))}

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
