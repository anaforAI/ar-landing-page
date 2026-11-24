"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The Intelligence Engine, drawn as a living system: fragments drift in, settle into three
 * knowledge domains (Engineering, Product, Business) and get connected through the center.
 * `mode` (0..6) emphasizes one capability. Conceptual only: it does not depict the real
 * implementation.
 */

export type EngineLabels = { engineering: string; product: string; business: string; human: string };

type Vec = { x: number; y: number };
type Node = { dx: number; dy: number; ph: number; kind: 0 | 1 | 2; flash: number; nb: number[] };
type Frag = { sx: number; sy: number; d: number; n: number; t: number; speed: number; rot: number; bend: number };
type Arc = { a: [number, number]; b: [number, number]; life: number; dur: number };
type Pulse = { d: number; t: number; speed: number };
type Weights = { rings: number; orbit: number; semantic: number; cross: number; evidence: number; flow: number; human: number };

const C: Vec = { x: 0.5, y: 0.555 };
const R = 0.31;
const ANGLES = [-90, 150, 30].map((a) => (a * Math.PI) / 180); // engineering, product, business
const HUBS: Vec[] = ANGLES.map((a) => ({ x: C.x + R * Math.cos(a), y: C.y + R * Math.sin(a) }));
const HUMAN: Vec = { x: 0.88, y: 0.25 };
const RINGS = [0.1, 0.15, 0.205];
const BASE: Weights = { rings: 0.35, orbit: 0, semantic: 0.35, cross: 0.3, evidence: 0, flow: 0.45, human: 0 };
const KEYS: (keyof Weights)[] = ["rings", "orbit", "semantic", "cross", "evidence", "flow", "human"];

function target(mode: number): Weights {
  const w = { ...BASE };
  const k = KEYS[mode];
  if (k) w[k] = 1;
  return w;
}

/** Deterministic random, so the static frame is stable. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function buildClusters(): Node[][] {
  const r = rng(7);
  return HUBS.map(() => {
    const nodes: Node[] = [];
    for (let i = 0; i < 12; i++) {
      const a = r() * Math.PI * 2;
      const d = 0.018 + Math.sqrt(r()) * 0.068;
      nodes.push({ dx: Math.cos(a) * d, dy: Math.sin(a) * d, ph: r() * 6.28, kind: (i % 3) as 0 | 1 | 2, flash: 0, nb: [] });
    }
    nodes.forEach((n, i) => {
      n.nb = nodes
        .map((m, j) => ({ j, d: Math.hypot(m.dx - n.dx, m.dy - n.dy) }))
        .filter((o) => o.j > i)
        .sort((p, q) => p.d - q.d)
        .slice(0, 2)
        .map((o) => o.j);
    });
    return nodes;
  });
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.trim().replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function EngineVisual({ mode, labels, symbol }: { mode: number; labels: EngineLabels; symbol?: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);
  const redraw = useRef<() => void>(() => {});

  useEffect(() => {
    modeRef.current = mode;
    redraw.current();
  }, [mode]);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const css = getComputedStyle(document.documentElement);
    const TEAL = hexToRgb(css.getPropertyValue("--anafor-teal-light") || "#4FA89A");
    const PAPER = hexToRgb(css.getPropertyValue("--anafor-paper") || "#F5F3EE");
    const rgba = (c: [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a))})`;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clusters = buildClusters();
    const w: Weights = { ...target(modeRef.current) };
    const frags: Frag[] = [];
    const pulses: Pulse[] = [];
    const arcs: Arc[] = [];
    const r = rng(42);
    let S = 0;
    let time = 0;
    let fragAcc = 0;
    let pulseAcc = 0;

    const nodePos = (d: number, i: number): Vec => {
      const n = clusters[d][i];
      const j = reduce ? 0 : 0.006;
      return {
        x: HUBS[d].x + n.dx + Math.sin(time * 0.6 + n.ph) * j,
        y: HUBS[d].y + n.dy + Math.cos(time * 0.5 + n.ph) * j,
      };
    };
    const px = (v: number) => v * S;

    const spawnArc = () => {
      const da = Math.floor(r() * 3);
      const db = (da + 1 + Math.floor(r() * 2)) % 3;
      arcs.push({ a: [da, Math.floor(r() * 12)], b: [db, Math.floor(r() * 12)], life: 0, dur: 2.4 + r() * 1.6 });
    };
    const spawnFrag = () => {
      const a = r() * Math.PI * 2;
      // the domain whose angle is closest
      let d = 0;
      let best = 9;
      ANGLES.forEach((ang, i) => {
        const diff = Math.abs(Math.atan2(Math.sin(a - ang), Math.cos(a - ang)));
        if (diff < best) {
          best = diff;
          d = i;
        }
      });
      frags.push({
        sx: C.x + Math.cos(a) * 0.72,
        sy: C.y + Math.sin(a) * 0.72,
        d,
        n: Math.floor(r() * 12),
        t: 0,
        speed: 0.22 + r() * 0.18,
        rot: (r() - 0.5) * 2.4,
        bend: (r() - 0.5) * 0.25,
      });
    };

    const resize = () => {
      const rect = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      S = rect.width;
      cv.width = Math.round(S * dpr);
      cv.height = Math.round(S * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const square = (x: number, y: number, s: number, rot = 0) => {
      ctx.save();
      ctx.translate(x, y);
      if (rot) ctx.rotate(rot);
      ctx.fillRect(-s / 2, -s / 2, s, s);
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, S, S);
      const unit = S / 140; // ~4px at 560px
      ctx.lineWidth = 1;

      // Layered context rings around the center
      RINGS.forEach((rr, i) => {
        ctx.strokeStyle = rgba(PAPER, 0.05 + 0.1 * w.rings);
        ctx.beginPath();
        ctx.arc(px(C.x), px(C.y), px(rr), 0, Math.PI * 2);
        ctx.stroke();
        const a0 = time * (0.18 + i * 0.07) * (i % 2 ? -1 : 1) + i;
        ctx.strokeStyle = rgba(TEAL, 0.12 + 0.6 * w.rings);
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(px(C.x), px(C.y), px(rr), a0, a0 + 0.35 + 0.5 * w.rings);
        ctx.stroke();
        ctx.lineWidth = 1;
      });

      // Spokes from each domain to the center
      HUBS.forEach((h) => {
        const ang = Math.atan2(h.y - C.y, h.x - C.x);
        ctx.strokeStyle = rgba(PAPER, 0.1);
        ctx.beginPath();
        ctx.moveTo(px(h.x), px(h.y));
        ctx.lineTo(px(C.x + Math.cos(ang) * RINGS[2]), px(C.y + Math.sin(ang) * RINGS[2]));
        ctx.stroke();
      });

      // Signals travelling toward the center
      ctx.fillStyle = rgba(TEAL, 0.9);
      pulses.forEach((p) => {
        const h = HUBS[p.d];
        const ang = Math.atan2(h.y - C.y, h.x - C.x);
        const ex = C.x + Math.cos(ang) * RINGS[0];
        const ey = C.y + Math.sin(ang) * RINGS[0];
        ctx.globalAlpha = Math.sin(Math.PI * p.t);
        square(px(h.x + (ex - h.x) * p.t), px(h.y + (ey - h.y) * p.t), unit * 0.6);
      });
      ctx.globalAlpha = 1;

      // Cross-domain relationships, bent through the center
      arcs.forEach((arc) => {
        const a = nodePos(arc.a[0], arc.a[1]);
        const b = nodePos(arc.b[0], arc.b[1]);
        const k = arc.life / arc.dur;
        const alpha = Math.sin(Math.PI * k) * (0.18 + 0.55 * w.cross);
        ctx.strokeStyle = rgba(TEAL, alpha);
        ctx.beginPath();
        ctx.moveTo(px(a.x), px(a.y));
        ctx.quadraticCurveTo(px(C.x), px(C.y), px(b.x), px(b.y));
        ctx.stroke();
        const tt = Math.min(1, k * 1.4);
        const qx = (1 - tt) * (1 - tt) * a.x + 2 * (1 - tt) * tt * C.x + tt * tt * b.x;
        const qy = (1 - tt) * (1 - tt) * a.y + 2 * (1 - tt) * tt * C.y + tt * tt * b.y;
        ctx.fillStyle = rgba(TEAL, alpha * 1.6);
        square(px(qx), px(qy), unit * 0.7);
      });

      // Domains: semantic links and nodes
      clusters.forEach((nodes, d) => {
        ctx.strokeStyle = rgba(TEAL, 0.06 + 0.42 * w.semantic);
        nodes.forEach((n, i) => {
          const p = nodePos(d, i);
          n.nb.forEach((j) => {
            const q = nodePos(d, j);
            ctx.beginPath();
            ctx.moveTo(px(p.x), px(p.y));
            ctx.lineTo(px(q.x), px(q.y));
            ctx.stroke();
          });
        });
        nodes.forEach((n, i) => {
          const p = nodePos(d, i);
          const s = unit * (1.3 + n.flash * 0.6);
          const x = px(p.x);
          const y = px(p.y);
          // plain node
          ctx.fillStyle = rgba(n.flash > 0.05 ? TEAL : PAPER, (0.7 + 0.3 * n.flash) * (1 - w.evidence));
          square(x, y, s);
          // evidence markers: verified (filled), inferred (half), hypothesis (outline)
          if (w.evidence > 0.01) {
            const e = w.evidence;
            const sz = s * 1.35;
            ctx.strokeStyle = rgba(TEAL, e);
            ctx.lineWidth = 1.25;
            ctx.strokeRect(x - sz / 2, y - sz / 2, sz, sz);
            ctx.fillStyle = rgba(TEAL, e);
            if (n.kind === 0) ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
            if (n.kind === 1) ctx.fillRect(x - sz / 2, y - sz / 2, sz / 2, sz);
            ctx.lineWidth = 1;
          }
        });
      });

      // Fragments arriving and settling into a domain
      frags.forEach((f) => {
        const tgt = nodePos(f.d, f.n);
        const e = 1 - Math.pow(1 - f.t, 3);
        const mx = (f.sx + tgt.x) / 2 + (tgt.y - f.sy) * f.bend;
        const my = (f.sy + tgt.y) / 2 - (tgt.x - f.sx) * f.bend;
        const x = (1 - e) * (1 - e) * f.sx + 2 * (1 - e) * e * mx + e * e * tgt.x;
        const y = (1 - e) * (1 - e) * f.sy + 2 * (1 - e) * e * my + e * e * tgt.y;
        const settled = f.t > 0.75;
        ctx.fillStyle = settled ? rgba(TEAL, 0.9) : rgba(PAPER, 0.18 + 0.3 * f.t);
        square(px(x), px(y), unit * (1.3 - 0.3 * f.t), f.rot * (1 - e));
      });

      // Multiple analytical perspectives orbiting the center
      if (w.orbit > 0.01) {
        for (let k = 0; k < 3; k++) {
          const a = time * (0.35 + k * 0.08) + (k * Math.PI * 2) / 3;
          const ox = C.x + Math.cos(a) * RINGS[2];
          const oy = C.y + Math.sin(a) * RINGS[2];
          const h = HUBS[k];
          ctx.strokeStyle = rgba(TEAL, 0.35 * w.orbit);
          ctx.beginPath();
          ctx.moveTo(px(ox), px(oy));
          ctx.lineTo(px(h.x), px(h.y));
          ctx.stroke();
          ctx.strokeStyle = rgba(TEAL, w.orbit);
          ctx.lineWidth = 1.5;
          const s = unit * 2;
          ctx.strokeRect(px(ox) - s / 2, px(oy) - s / 2, s, s);
          ctx.lineWidth = 1;
        }
      }

      // Human expertise joining the loop
      if (w.human > 0.01) {
        const ang = Math.atan2(HUMAN.y - C.y, HUMAN.x - C.x);
        const ex = C.x + Math.cos(ang) * RINGS[2];
        const ey = C.y + Math.sin(ang) * RINGS[2];
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = rgba(PAPER, 0.45 * w.human);
        ctx.beginPath();
        ctx.moveTo(px(HUMAN.x), px(HUMAN.y));
        ctx.lineTo(px(ex), px(ey));
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.strokeStyle = rgba(PAPER, 0.9 * w.human);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px(HUMAN.x), px(HUMAN.y), unit * 1.6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 1;
        const tt = (time * 0.45) % 1;
        const back = Math.floor(time * 0.45) % 2 === 1;
        const k = back ? 1 - tt : tt;
        ctx.fillStyle = rgba(TEAL, w.human * Math.sin(Math.PI * tt));
        square(px(HUMAN.x + (ex - HUMAN.x) * k), px(HUMAN.y + (ey - HUMAN.y) * k), unit * 0.8);
      }
    };

    const step = (dt: number) => {
      time += dt;
      const tw = target(modeRef.current);
      const k = 1 - Math.pow(0.04, dt); // smooth, frame-rate independent
      KEYS.forEach((key) => (w[key] += (tw[key] - w[key]) * k));

      fragAcc += dt * (1.2 + 4.5 * w.flow);
      while (fragAcc > 1) {
        fragAcc -= 1;
        if (frags.length < 60) spawnFrag();
      }
      pulseAcc += dt * (0.9 + 2.5 * w.flow);
      while (pulseAcc > 1) {
        pulseAcc -= 1;
        pulses.push({ d: Math.floor(r() * 3), t: 0, speed: 0.35 + r() * 0.2 });
      }
      if (r() < dt * (0.35 + 2.2 * w.cross) && arcs.length < 10) spawnArc();

      for (let i = frags.length - 1; i >= 0; i--) {
        const f = frags[i];
        f.t += dt * f.speed;
        if (f.t >= 1) {
          clusters[f.d][f.n].flash = 1;
          frags.splice(i, 1);
        }
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].t += dt * pulses[i].speed;
        if (pulses[i].t >= 1) pulses.splice(i, 1);
      }
      for (let i = arcs.length - 1; i >= 0; i--) {
        arcs[i].life += dt;
        if (arcs[i].life >= arcs[i].dur) arcs.splice(i, 1);
      }
      clusters.forEach((nodes) => nodes.forEach((n) => (n.flash = Math.max(0, n.flash - dt * 1.4))));
    };

    let raf = 0;
    let last = 0;
    let visible = false;
    const loop = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduce || raf || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // Static composition (reduced motion, and the first paint)
    const staticFrame = () => {
      Object.assign(w, target(modeRef.current));
      if (!arcs.length) for (let i = 0; i < 4; i++) {
        spawnArc();
        arcs[arcs.length - 1].life = arcs[arcs.length - 1].dur * (0.35 + i * 0.08);
      }
      draw();
    };

    resize();
    staticFrame();
    redraw.current = () => {
      if (reduce) staticFrame();
    };

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "100px" },
    );
    io.observe(el);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const labelPos = [
    { x: HUBS[0].x, y: HUBS[0].y - 0.135, key: "engineering" as const },
    { x: HUBS[1].x, y: HUBS[1].y + 0.135, key: "product" as const },
    { x: HUBS[2].x, y: HUBS[2].y + 0.135, key: "business" as const },
  ];

  return (
    <div ref={wrap} className="relative aspect-square w-full select-none" aria-hidden="true">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      {labelPos.map((l) => (
        <span
          key={l.key}
          className="ui-label absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-paper/70"
          style={{ left: `${l.x * 100}%`, top: `${l.y * 100}%` }}
        >
          {labels[l.key]}
        </span>
      ))}
      <span
        className={`ui-label absolute w-[28%] -translate-x-full -translate-y-full text-right text-paper/70 transition-opacity duration-500 ${
          mode === 6 ? "opacity-100" : "opacity-0"
        }`}
        style={{ left: `${(HUMAN.x + 0.03) * 100}%`, top: `${(HUMAN.y - 0.035) * 100}%` }}
      >
        {labels.human}
      </span>
      <div className="absolute left-1/2 top-1/2 grid aspect-square w-[15%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[12px] border border-paper/15 bg-ink">
        <span className="lift-in block h-[46%] w-[46%] [&>span]:block [&>span]:h-full [&_svg]:h-full [&_svg]:w-full">
          {symbol}
        </span>
      </div>
    </div>
  );
}
