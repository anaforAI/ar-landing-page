"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { GithubMark, JiraMark, MeetMark, MiroMark } from "@/components/ui/icons";
import { siGithub, siGooglemeet, siJira, siMiro } from "simple-icons";
import { EvidenceChip, type EvidenceState } from "@/components/ui/EvidenceChip";

/**
 * Organizational knowledge convergence, in four scroll-driven phases:
 * 1. Fragmentation: four sources, four perspectives, no visible relationship.
 * 2. Contextualization: shared concepts light up and relationships are drawn between fragments.
 * 3. Intelligence: the Anafor Intelligence Engine emerges where the relationships meet.
 * 4. Understanding: one consolidated insight, separating observed facts from inference.
 *
 * Everything is driven by a single CSS variable, --p (0..1), written on scroll. Each element
 * reads its own window (--a start, --w width) in CSS (see .cv-* in globals.css). Progress only
 * moves forward, so the final insight stays put. Without JS or with reduced motion, --p stays 1
 * and the complete, final state is rendered. Conceptual: it does not depict the implementation.
 */

type Card = { key: string; source: string; tag: string; title: string; meta: string };
type Row = { state: EvidenceState; label: string; text: string; source: string };
export type FragmentLabels = {
  label: string;
  phases: string[];
  captions: string[];
  cards: Card[];
  relations: { top: string; left: string; right: string; bottom: string };
  engine: string;
  nodes: string[];
  insight: { label: string; initiative: string; statement: string; rows: Row[]; note: string };
};

/** Phase starts on the 0..1 progress. */
const PHASES = [0, 0.2, 0.42, 0.68];

/** Official brand colors (simple-icons). */
const BRAND: Record<string, string> = {
  meet: `#${siGooglemeet.hex}`,
  miro: `#${siMiro.hex}`,
  jira: `#${siJira.hex}`,
  github: `#${siGithub.hex}`,
};

const ICONS: Record<string, ReactNode> = {
  meet: <MeetMark aria-hidden="true" width={16} height={16} />,
  // Miro's logo is the navy mark on a yellow tile.
  miro: (
    <span className="grid h-4 w-4 place-items-center rounded-[3px] bg-[#FFD02F]">
      <MiroMark aria-hidden="true" width={11} height={11} />
    </span>
  ),
  jira: <JiraMark aria-hidden="true" width={16} height={16} />,
  github: <GithubMark aria-hidden="true" width={16} height={16} />,
};

/** Desktop placement (lg+): four corners around the engine, plus a small resting scatter. */
const PLACE = [
  { pos: "lg:left-0 lg:top-[25%]", dx: "-18px", dy: "14px", rot: "-2.5deg" },
  { pos: "lg:left-0 lg:top-[75%]", dx: "-10px", dy: "-12px", rot: "2deg" },
  { pos: "lg:right-0 lg:top-[25%]", dx: "16px", dy: "16px", rot: "2.5deg" },
  { pos: "lg:right-0 lg:top-[75%]", dx: "12px", dy: "-14px", rot: "-1.5deg" },
];

const win = (a: number, w: number) => ({ "--a": a, "--w": w }) as CSSProperties;

/** "Retry failed [payment] webhooks" → the bracketed concepts become highlightable terms. */
function Terms({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]+\])/).map((part, i) =>
        part.startsWith("[") ? (
          <span key={i} className="cv-term">
            {part.slice(1, -1)}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function Fragments({ labels }: { labels: FragmentLabels }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let max = 0;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts when the figure enters the lower part of the viewport, completes when its bottom is in view.
      const start = vh * 0.85;
      const end = vh * 0.9 - r.height;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
      if (p > max) {
        max = p;
        el.style.setProperty("--p", p.toFixed(4));
      }
      if (max >= 1) stop();
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const stop = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("lenis-scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };

    el.style.setProperty("--p", "0");
    el.dataset.live = "";
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("lenis-scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      stop();
      cancelAnimationFrame(raf);
    };
  }, []);

  const { cards, relations, insight } = labels;

  return (
    <figure ref={root} className="cv relative mx-auto max-w-[1080px]" aria-label={labels.label}>
      {/* Attentional guide: where we are in the story. */}
      <div aria-hidden="true" className="mx-auto max-w-[720px] text-center">
        <ol className="grid grid-cols-4 gap-2 sm:gap-3">
          {labels.phases.map((name, i) => {
            const a = PHASES[i];
            const w = Math.max(0.06, (PHASES[i + 1] ?? 0.97) - a - 0.04);
            return (
              <li key={name} className="cv-s cv-phase text-left" style={win(a, w)}>
                <span className="block h-px w-full bg-sand">
                  <span className="cv-fill block h-px origin-left bg-teal" />
                </span>
                <span className="ui-label mt-3 block text-[11px] sm:text-[13px]">
                  <span className="hidden text-stone sm:inline">0{i + 1} </span>
                  {name}
                </span>
              </li>
            );
          })}
        </ol>
        <div className="mt-6 grid min-h-[3.2em] text-[16px] leading-[1.45] text-stone md:text-[17px]">
          {labels.captions.map((c, i) => (
            <p
              key={i}
              className="cv-s cv-x [grid-area:1/1]"
              style={
                {
                  ...win(i === 0 ? -1 : PHASES[i] - 0.02, 0.06),
                  "--b": PHASES[i + 1] ? PHASES[i + 1] - 0.06 : 2,
                  "--wb": 0.05,
                } as CSSProperties
              }
            >
              {c}
            </p>
          ))}
        </div>
      </div>

      {/* Stage: a stacked grid on small screens, a convergence field on large ones. */}
      <div className="relative mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:block lg:aspect-[1080/460]">
        {/* Relationships between fragments (phase 2) and convergence into the engine (phase 3). */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
          viewBox="0 0 1080 460"
          fill="none"
        >
          <g className="cv-s cv-dim" style={win(0.56, 0.1)}>
            {[
              "M270 80 C 420 14, 660 14, 810 80",
              "M270 140 C 345 140, 345 320, 270 320",
              "M810 140 C 735 140, 735 320, 810 320",
              "M270 380 C 420 446, 660 446, 810 380",
            ].map((d, i) => (
              <path
                key={d}
                d={d}
                pathLength={1}
                className="cv-s cv-draw cv-link"
                style={win(0.22 + i * 0.03, 0.14)}
              />
            ))}
          </g>
          {[
            "M270 105 C 370 105, 390 142, 452 142",
            "M270 355 C 370 355, 390 318, 452 318",
            "M810 105 C 710 105, 690 142, 628 142",
            "M810 355 C 710 355, 690 318, 628 318",
          ].map((d, i) => (
            <path
              key={d}
              d={d}
              pathLength={1}
              className="cv-s cv-draw cv-flow"
              style={win(0.48 + i * 0.025, 0.12)}
            />
          ))}
        </svg>

        {/* Shared concepts, named on each relationship. */}
        {(
          [
            ["top", "left-1/2 top-[6.6%]", 0.3],
            ["left", "left-[30%] top-1/2", 0.33],
            ["right", "left-[70%] top-1/2", 0.36],
            ["bottom", "left-1/2 top-[93.4%]", 0.39],
          ] as const
        ).map(([k, pos, a]) => (
          <span
            key={k}
            aria-hidden="true"
            className={`cv-s cv-chip ui-label absolute hidden whitespace-nowrap rounded-full border border-sand bg-paper px-2.5 py-1 text-[11px] text-teal lg:block ${pos}`}
            style={win(a, 0.08)}
          >
            <span className="cv-chip-in block">{relations[k]}</span>
          </span>
        ))}

        {/* The four fragments. */}
        {cards.map((c, i) => (
          <div key={c.key} className={`lg:absolute lg:w-[25%] lg:-translate-y-1/2 ${PLACE[i].pos}`}>
            <article
              className="cv-s cv-frag card p-5 lg:p-6"
              style={{ ...win(0, 0.2), "--dx": PLACE[i].dx, "--dy": PLACE[i].dy, "--rot": PLACE[i].rot } as CSSProperties}
            >
              <p className="ui-label flex items-center gap-2 text-stone">
                <span style={{ color: BRAND[c.key] }}>{ICONS[c.key]}</span>
                {c.tag}
                <span className="sr-only">({c.source})</span>
              </p>
              <p className="mt-4 text-[17px] font-medium leading-snug tracking-[-0.02em]">
                <Terms text={c.title} />
              </p>
              <p className="ui-label mt-4 text-stone">
                <Terms text={c.meta} />
              </p>
            </article>
          </div>
        ))}

        {/* Mobile: the four sources converge into the engine below. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none col-span-full -mb-2 h-[72px] w-full lg:hidden"
          viewBox="0 0 400 72"
          preserveAspectRatio="none"
          fill="none"
        >
          {["M50 0 C 50 48, 200 30, 200 72", "M150 0 C 150 44, 200 36, 200 72", "M250 0 C 250 44, 200 36, 200 72", "M350 0 C 350 48, 200 30, 200 72"].map(
            (d, i) => (
              <path
                key={d}
                d={d}
                pathLength={1}
                vectorEffect="non-scaling-stroke"
                className="cv-s cv-draw cv-flow"
                style={win(0.4 + i * 0.02, 0.1)}
              />
            ),
          )}
        </svg>

        {/* The protagonist. */}
        <div className="col-span-full mx-auto w-full max-w-[320px] lg:absolute lg:left-1/2 lg:top-1/2 lg:w-[32%] lg:max-w-none lg:-translate-x-1/2 lg:-translate-y-1/2">
          <Engine nodes={labels.nodes} />
          <p
            className="cv-s cv-rise ui-label -mt-5 text-center text-teal lg:absolute lg:left-1/2 lg:top-[88%] lg:mt-0 lg:-translate-x-1/2 lg:whitespace-nowrap"
            style={win(0.56, 0.08)}
          >
            {labels.engine}
          </p>
        </div>
      </div>

      {/* Phase 4: the consolidated understanding. */}
      <div aria-hidden="true" className="flex justify-center">
        <span className="cv-s cv-stem mt-5 block h-10 w-px origin-top bg-teal lg:mt-2" style={win(0.68, 0.06)} />
      </div>
      <div className="cv-s cv-rise card mx-auto max-w-[760px] p-6 md:p-8" style={win(0.71, 0.07)}>
        <p className="ui-label flex items-center gap-2 text-teal">
          <QuarterMark />
          {insight.label} · {insight.initiative}
        </p>
        <p className="display mt-5 text-[24px] leading-[1.25] md:text-[28px]">{insight.statement}</p>
        <ul className="mt-6">
          {insight.rows.map((r, i) => (
            <li
              key={r.state}
              className={`cv-s cv-rise grid gap-3 border-t py-4 sm:grid-cols-[132px_1fr] sm:gap-5 ${
                r.state === "hypothesis" ? "border-dashed border-sand" : "border-sand"
              }`}
              style={win(0.77 + i * 0.05, 0.06)}
            >
              <span>
                <EvidenceChip state={r.state} label={r.label} size="sm" />
              </span>
              <span>
                <span className={`block text-[16px] leading-[1.45] ${r.state === "verified" ? "text-ink" : "text-ink/75"}`}>
                  {r.text}
                </span>
                <span className="ui-label mt-1.5 block text-stone">{r.source}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="cv-s cv-rise border-t border-sand pt-4 text-[14px] leading-[1.5] text-stone" style={win(0.92, 0.06)}>
          {insight.note}
        </p>
      </div>
    </figure>
  );
}

/**
 * The Anafor Intelligence Engine: a semantic network that assembles itself around the symbol.
 * Outer labeled nodes face the four fragments (labels sit above/below, clear of the incoming lines); inner nodes and cross-relations build in steps,
 * and the symbol's lifted quarter settles into place last (the brand's motion signature).
 */
const OUTER = [
  { x: -71, y: -71, lx: 0, ly: -13, anchor: "middle" },
  { x: -71, y: 71, lx: 0, ly: 21, anchor: "middle" },
  { x: 71, y: -71, lx: 0, ly: -13, anchor: "middle" },
  { x: 71, y: 71, lx: 0, ly: 21, anchor: "middle" },
] as const;
const INNER = [
  { x: 0, y: -58 },
  { x: -54, y: -6 },
  { x: 52, y: 10 },
  { x: -20, y: 54 },
  { x: 30, y: -40 },
  { x: 24, y: 50 },
];
/** Edges as [from, to] where 0..3 are outer nodes, 4..9 inner, "c" the center. */
const EDGES: [number | "c", number | "c"][] = [
  [0, 5], [0, 4], [2, 8], [2, 4], [1, 5], [1, 7], [3, 9], [3, 6],
  [4, 8], [5, 7], [6, 9], [7, 9], [4, "c"], [6, "c"], [5, "c"], [7, "c"], [0, 3], [1, 2],
];

function Engine({ nodes }: { nodes: string[] }) {
  const pts = [...OUTER.map(({ x, y }) => ({ x, y })), ...INNER];
  const at = (k: number | "c") => (k === "c" ? { x: 0, y: 0 } : pts[k]);
  return (
    <svg aria-hidden="true" viewBox="-140 -140 280 280" className="block h-auto w-full overflow-visible" fill="none">
      <g className="cv-s cv-fade" style={win(0.42, 0.08)}>
        <circle r="100" className="cv-ring" />
        <circle r="56" className="cv-ring" />
      </g>
      {EDGES.map(([a, b], i) => {
        const p = at(a);
        const q = at(b);
        const cross = i >= 16; // long semantic relations bend around the core
        const d = cross
          ? `M${p.x} ${p.y} Q ${(p.x + q.x) / 2 + (p.y > 0 ? 34 : -34)} ${(p.y + q.y) / 2 + (p.x > 0 ? -34 : 34)} ${q.x} ${q.y}`
          : `M${p.x} ${p.y} L${q.x} ${q.y}`;
        return (
          <path
            key={i}
            d={d}
            pathLength={1}
            className={`cv-s cv-draw ${cross ? "cv-edge-x" : "cv-edge"}`}
            style={win(cross ? 0.6 : 0.46 + (i % 8) * 0.012, 0.08)}
          />
        );
      })}
      {INNER.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={3} className="cv-s cv-fade cv-node" style={win(0.45 + i * 0.012, 0.05)} />
      ))}
      {OUTER.map((n, i) => (
        <g key={i} className="cv-s cv-fade" style={win(0.5 + i * 0.02, 0.06)}>
          <circle cx={n.x} cy={n.y} r={5} className="cv-node-outer" />
          <text x={n.x + n.lx} y={n.y + n.ly} textAnchor={n.anchor} className="cv-node-label">
            {nodes[i]}
          </text>
        </g>
      ))}
      <g className="cv-s cv-core" style={win(0.42, 0.1)}>
        <rect x="-34" y="-34" width="68" height="68" rx="12" className="cv-core-box" />
        <g transform="translate(-20 -20) scale(0.3846)" fill="var(--anafor-teal)">
          <path d="M0 20A4 4 0 0 1 4 16H48A40 40 0 0 0 88 56V100A4 4 0 0 1 84 104H4A4 4 0 0 1 0 100Z" />
          <path className="cv-s cv-quarter" style={win(0.5, 0.08)} d="M64 0H100A4 4 0 0 1 104 4V40A40 40 0 0 1 64 0Z" />
        </g>
      </g>
    </svg>
  );
}

function QuarterMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 104 104" width={14} height={14} fill="currentColor">
      <path d="M0 20A4 4 0 0 1 4 16H48A40 40 0 0 0 88 56V100A4 4 0 0 1 84 104H4A4 4 0 0 1 0 100Z" />
      <path d="M64 0H100A4 4 0 0 1 104 4V40A40 40 0 0 1 64 0Z" />
    </svg>
  );
}
