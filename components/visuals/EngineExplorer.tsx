"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { EngineVisual, INTRO_STEPS, type EngineLabels } from "./EngineVisual";

export type Capability = { key: string; name: string; body: string; stage: string };

/**
 * The engine first builds itself (fragments, domains, relationships, interpretation, evidence),
 * then the capabilities become an editorial index: the active one is emphasized in the engine.
 */
const VISUAL_MODE: Record<string, number> = { evidence: 4, cross: 3, human: 6 };

export function EngineExplorer({
  capabilities,
  labels,
  listLabel,
  stageLabel,
  introSteps,
  pauseLabel,
  playLabel,
  symbol,
}: {
  capabilities: Capability[];
  labels: EngineLabels;
  listLabel: string;
  stageLabel: string;
  introSteps: string[];
  pauseLabel: string;
  playLabel: string;
  symbol: ReactNode;
}) {
  const [active, setActive] = useState(-1);
  const [intro, setIntro] = useState(-1);
  const [skip, setSkip] = useState(false);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAuto(false);
      setActive(0);
    }
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Walk through the capabilities until the visitor picks one.
  useEffect(() => {
    if (!inView) return;
    const stop = () => setAuto(false);
    window.addEventListener("wheel", stop, { passive: true, once: true });
    window.addEventListener("touchmove", stop, { passive: true, once: true });
    return () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
    };
  }, [inView]);

  const built = intro >= INTRO_STEPS;
  useEffect(() => {
    if (built) setActive((a) => (a < 0 ? 0 : a));
  }, [built]);
  useEffect(() => {
    if (!auto || hover || !inView || !built) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % capabilities.length), 5200);
    return () => clearInterval(id);
  }, [auto, hover, inView, built, capabilities.length]);

  const pick = (i: number) => {
    setAuto(false);
    setSkip(true);
    setActive(i);
  };

  const caption =
    intro >= 0 && intro < INTRO_STEPS
      ? { step: `${intro + 1}/${INTRO_STEPS}`, text: introSteps[intro] }
      : active >= 0
        ? { step: "", text: capabilities[active].name }
        : null;

  const visualMode = active >= 0 ? (VISUAL_MODE[capabilities[active].key] ?? active) : -1;

  return (
    <div ref={root} className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-6">
      <div className="lg:order-2 lg:col-span-7 lg:col-start-6">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+40px)]">
          <div className="mx-auto max-w-[620px]">
            <EngineVisual mode={visualMode} labels={labels} symbol={symbol} skipIntro={skip} onStage={setIntro} />
            <div className="mt-4 flex min-h-[20px] items-center justify-center gap-3">
              <p className="ui-label flex items-center gap-2 text-teal-light" aria-live="polite">
                {caption && (
                  <>
                    {caption.step ? (
                      <span className="text-paper/55">{caption.step}</span>
                    ) : (
                      <span className="marker marker-verified h-2 w-2" />
                    )}
                    <span key={caption.text}>{caption.text}</span>
                  </>
                )}
              </p>
              {built && (
                <button
                  type="button"
                  className="ui-label rounded-full border border-paper/25 px-3 py-1 text-paper/80 hover:text-paper"
                  aria-pressed={auto}
                  onClick={() => setAuto((value) => !value)}
                >
                  {auto ? pauseLabel : playLabel}
                </button>
              )}
            </div>
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
                  <span className={`mt-2 block text-[15px] leading-[1.55] text-paper/65 ${on ? "" : "hidden"}`}>
                    {c.body}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
