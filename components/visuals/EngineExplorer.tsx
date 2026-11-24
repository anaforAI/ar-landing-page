"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { EngineVisual, type EngineLabels } from "./EngineVisual";

export type Capability = { key: string; name: string; body: string; stage: string };

/** Capabilities as an editorial index; the active one is emphasized in the engine. */
export function EngineExplorer({
  capabilities,
  labels,
  listLabel,
  stageLabel,
  symbol,
}: {
  capabilities: Capability[];
  labels: EngineLabels;
  listLabel: string;
  stageLabel: string;
  symbol: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Walk through the capabilities until the visitor picks one.
  useEffect(() => {
    if (!auto || hover || !inView) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % capabilities.length), 5200);
    return () => clearInterval(id);
  }, [auto, hover, inView, capabilities.length]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <div ref={root} className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-6">
      <div className="lg:order-2 lg:col-span-7 lg:col-start-6">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+40px)]">
          <div className="mx-auto max-w-[620px]">
            <EngineVisual mode={active} labels={labels} symbol={symbol} />
            <p className="ui-label mt-4 flex items-center justify-center gap-2 text-teal-light" aria-hidden="true">
              <span className="marker marker-verified h-2 w-2" />
              {capabilities[active].name}
            </p>
          </div>
        </div>
      </div>

      <div className="lg:order-1 lg:col-span-5">
        <h3 className="eyebrow">{listLabel}</h3>
        <ol
          className="mt-6 border-t border-paper/12"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {capabilities.map((c, i) => {
            const on = i === active;
            return (
              <li key={c.key} className="border-b border-paper/12">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => pick(i)}
                  onFocus={() => pick(i)}
                  className="group relative block w-full py-5 pl-5 pr-2 text-left"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-5 bottom-5 w-[2px] transition-colors duration-500 ${
                      on ? "bg-teal-light" : "bg-paper/12 group-hover:bg-paper/30"
                    }`}
                  />
                  <span className="flex items-baseline gap-x-3">
                    <span className={`ui-label shrink-0 transition-colors duration-500 ${on ? "text-teal-light" : "text-paper/55"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-[19px] font-medium tracking-[-0.01em] transition-colors duration-500 ${
                        on ? "text-paper" : "text-paper/75 group-hover:text-paper"
                      }`}
                    >
                      {c.name}
                    </span>
                    {c.stage && (
                      <span className="ui-label shrink-0 self-center rounded-[4px] border border-paper/20 px-1.5 py-0.5 text-paper/70">
                        {stageLabel}
                      </span>
                    )}
                  </span>
                  <span className="mt-2 block text-[15px] leading-[1.55] text-paper/65">{c.body}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
