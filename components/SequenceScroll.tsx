"use client";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";

const TOTAL_FRAMES = 144;
const FRAME_PATH = (i: number) =>
  `/sequence/render-frame-${String(i).padStart(3, "0")}.png`;

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

export default function SequenceScroll({ onLoaded }: { onLoaded: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Direct refs to each overlay's inner content div — for zero-rerender DOM updates
  const overlayRefs = useRef<(HTMLDivElement | null)[]>(
    new Array(OVERLAYS.length).fill(null),
  );

  const frames = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null),
  );
  const loaded = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const lastDrawn = useRef(0);

  // Cached geometry — only recalculate on resize
  const containerTopRef = useRef(0);
  const scrollableRef = useRef(0);

  // Scroll state
  const scrollYRef = useRef(0);
  const rafPending = useRef(false);
  const lastProgress = useRef(-1);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // ─── Cover-fit draw ────────────────────────────────────────────────────────
  const drawFrame = (idx: number) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const { width: cw, height: ch } = canvas;
    if (!cw || !ch) return;

    // Nearest-available fallback
    let fi = idx;
    if (!loaded.current[fi]) {
      for (let d = 1; d < TOTAL_FRAMES; d++) {
        if (fi - d >= 0 && loaded.current[fi - d]) { fi = fi - d; break; }
        if (fi + d < TOTAL_FRAMES && loaded.current[fi + d]) { fi = fi + d; break; }
      }
    }
    const img = frames.current[fi];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const sw = img.naturalWidth * scale;
    const sh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
    lastDrawn.current = fi;
  };

  // ─── Direct DOM overlay update — ZERO React re-renders ────────────────────
  const updateOverlays = (p: number) => {
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
      // pointer-events on parent
      const parent = el.parentElement;
      if (parent) parent.style.pointerEvents = op > 0.05 ? "auto" : "none";
    });

    // Scroll indicator
    const si = document.getElementById("scroll-indicator");
    if (si) si.style.opacity = p < 0.04 ? "1" : "0";
  };

  // ─── Cache geometry (cheap, only on resize/mount) ─────────────────────────
  const cacheGeometry = () => {
    const container = containerRef.current;
    if (!container) return;
    // Walk offsetParent — no reflow needed after first paint
    let top = 0;
    let el: HTMLElement | null = container;
    while (el) {
      top += el.offsetTop;
      el = el.offsetParent as HTMLElement | null;
    }
    containerTopRef.current = top;
    scrollableRef.current = container.offsetHeight - window.innerHeight;
  };

  // ─── rAF tick — only fires when scroll changes ────────────────────────────
  const tick = () => {
    rafPending.current = false;
    const scrollable = scrollableRef.current;
    if (scrollable <= 0) return;

    const p = Math.max(
      0,
      Math.min(1, (scrollYRef.current - containerTopRef.current) / scrollable),
    );

    // Skip if nothing changed (deduplicate)
    if (Math.abs(p - lastProgress.current) < 0.0003) return;
    lastProgress.current = p;

    drawFrame(Math.round(p * (TOTAL_FRAMES - 1)));
    updateOverlays(p);
  };

  // ─── Resize canvas ────────────────────────────────────────────────────────
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctxRef.current = canvas.getContext("2d");
    cacheGeometry();
    drawFrame(lastDrawn.current);
  };

  useEffect(() => {
    resizeCanvas();

    const onResize = () => {
      resizeCanvas();
      // Re-run tick after resize to redraw at correct position
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

    // Initial draw based on current scroll position
    scrollYRef.current = window.scrollY;
    requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Preload images ───────────────────────────────────────────────────────
  useEffect(() => {
    let done = 0;
    let signaled = false;
    const signal = () => {
      if (!signaled) { signaled = true; onLoaded(); }
    };
    // Re-cache geometry after dynamic imports settle
    setTimeout(cacheGeometry, 500);

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const frameIdx = i;
      const img = new window.Image();
      img.onload = () => {
        frames.current[frameIdx] = img;
        loaded.current[frameIdx] = true;
        done++;
        if (frameIdx === 0) {
          resizeCanvas();
          drawFrame(0);
        }
        if (done >= 20) signal();
      };
      img.onerror = () => {
        done++;
        if (done >= TOTAL_FRAMES) signal();
      };
      img.src = FRAME_PATH(i + 1);
    }
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
        {/* Bg fill */}
        <div style={{ position: "absolute", inset: 0, background: "#0c0c0c" }} />

        {/* Frame canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            willChange: "contents",
          }}
        />

        {/* Stronger vignette for contrast */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 5,
            background:
              "radial-gradient(ellipse at center, transparent 25%, rgba(12,12,12,0.75) 100%)",
          }}
        />

        {/* Bottom gradient fade — helps text pop */}
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
              "linear-gradient(to bottom, transparent, rgba(12,12,12,0.55))",
          }}
        />

        {/* Text overlays — opacity/transform driven via DOM refs, NOT React state */}
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
            {/* Inner content — this div gets opacity/transform set directly */}
            <div
              ref={(el) => { overlayRefs.current[i] = el; }}
              style={{
                opacity: 0,
                transform: "translateY(28px)",
                textAlign: item.align,
                maxWidth: 660,
                willChange: "opacity, transform",
              }}
            >
              {/* Frosted glass backdrop */}
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
                {/* Overline label */}
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.25em",
                    color: "#c8f135",
                    marginBottom: "0.75rem",
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
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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

        {/* Scroll indicator */}
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
