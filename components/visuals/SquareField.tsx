"use client";

import { useEffect, useRef, type RefObject } from "react";

const PITCH = 40;
const SIZE = 16;
const RADIUS = 200;
const SAND = "#DDD9D0";

type Sq = { x: number; y: number; rot: number; dx: number; dy: number; a: number; t: number };

/**
 * A field of small sand squares, slightly out of order. Near the cursor they settle
 * into a grid. Monochrome, no glow. Pauses off-screen and when idle.
 */
export function SquareField({
  containerRef,
  onReady,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  onReady: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const box = containerRef.current;
    if (!canvas || !box) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let squares: Sq[] = [];
    let raf = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };
    let last = performance.now();

    const rand = (seed: number) => {
      const s = Math.sin(seed * 12.9898) * 43758.5453;
      return s - Math.floor(s);
    };

    const build = () => {
      const r = box.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      squares = [];
      const cols = Math.ceil(w / PITCH) + 1;
      const rows = Math.ceil(h / PITCH) + 1;
      const ox = (w / 2) % PITCH;
      const oy = (h / 2) % PITCH;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = ox + i * PITCH - PITCH / 2;
          const y = oy + j * PITCH - PITCH / 2;
          // Edge fade: elliptical, same shape as the static fallback mask.
          const nx = (x - w / 2) / (w * 0.7);
          const ny = (y - h / 2) / (h * 0.7);
          const d = Math.sqrt(nx * nx + ny * ny);
          const a = d < 0.4 ? 1 : Math.max(0, 1 - (d - 0.4) / 0.6);
          if (a <= 0.02) continue;
          const seed = i * 131 + j * 977;
          squares.push({
            x,
            y,
            rot: (rand(seed) - 0.5) * 0.5,
            dx: (rand(seed + 1) - 0.5) * 8,
            dy: (rand(seed + 2) - 0.5) * 8,
            a,
            t: 0,
          });
        }
      }
    };

    const draw = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const k = 1 - Math.pow(0.001, dt / 600); // smooth easing toward target
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = SAND;
      let moving = false;
      for (const s of squares) {
        const dist = Math.hypot(s.x - mouse.x, s.y - mouse.y);
        const target = dist < RADIUS ? 1 - dist / RADIUS : 0;
        const next = s.t + (target - s.t) * k;
        if (Math.abs(next - s.t) > 0.0005) moving = true;
        s.t = next;
        const e = 1 - s.t; // 1 = loose, 0 = aligned
        ctx.globalAlpha = s.a;
        ctx.save();
        ctx.translate(s.x + s.dx * e, s.y + s.dy * e);
        ctx.rotate(s.rot * e);
        ctx.beginPath();
        ctx.roundRect(-SIZE / 2, -SIZE / 2, SIZE, SIZE, 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      raf = moving && visible ? requestAnimationFrame(draw) : 0;
    };

    const kick = () => {
      if (!raf && visible) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      kick();
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      kick();
    };

    build();
    draw(performance.now());
    onReady();

    const ro = new ResizeObserver(() => {
      build();
      draw(performance.now());
    });
    ro.observe(box);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(box);
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
    };
  }, [containerRef, onReady]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 animate-[fade-in_700ms_ease_both]"
    />
  );
}
