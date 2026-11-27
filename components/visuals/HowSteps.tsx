"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useScroll, useSpring } from "motion/react";
import { EASE } from "@/components/motion/MotionProvider";
import { Reveal } from "@/components/motion/Reveal";
import { HowVisual } from "./HowVisuals";

type Step = { number: string; title: string; body: string };
type V = Record<string, string | string[]>;

export function HowSteps({
  steps,
  v,
  progressLabel,
  symbol,
}: {
  steps: Step[];
  v: V;
  progressLabel: string;
  symbol: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 60%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const [pct, setPct] = useState(0);

  useEffect(() => progress.on("change", (p) => setPct(Math.round(p * 100))), [progress]);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!items) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="mt-16 lg:mt-24 lg:grid lg:grid-cols-12 lg:gap-6">
      {/* Text column */}
      <ol ref={listRef} className="lg:col-span-5">
        {steps.map((s, i) => (
          <li
            key={s.number}
            data-step={i}
            aria-current={active === i ? "step" : undefined}
            className="border-t border-paper/15 py-10 first:border-t-0 first:pt-0 lg:flex lg:min-h-0 lg:flex-col lg:justify-center lg:border-t-0 lg:py-16"
          >
            <Reveal>
              <p className="ui-label text-teal-light">{s.number}</p>
              <h3
                className={`mt-4 text-[32px] font-medium leading-[1.1] tracking-[-0.03em] transition-colors duration-500 lg:text-[40px] ${
                  active === i ? "text-paper" : "lg:text-paper/40"
                }`}
              >
                {s.title}
              </h3>
              <p
                className={`mt-4 max-w-[440px] text-[17px] leading-[1.55] transition-colors duration-500 md:text-[18px] ${
                  active === i ? "text-paper/75" : "text-paper/75 lg:text-paper/55"
                }`}
              >
                {s.body}
              </p>
            </Reveal>
            {/* Mobile: the visual sits with its step */}
            <div className="mt-8 lg:hidden">
              <MobileVisual>
                <HowVisual index={i} v={v} symbol={symbol} />
              </MobileVisual>
            </div>
          </li>
        ))}
      </ol>

      {/* Sticky visual column (desktop) */}
      <div className="hidden lg:col-span-6 lg:col-start-7 lg:block">
        <div className="sticky top-[calc(50vh-260px)]">
          <div
            className="mb-6 h-px w-full bg-paper/15"
            role="progressbar"
            aria-label={progressLabel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
          >
            <motion.div className="h-px origin-left bg-teal-light" style={{ scaleX: progress }} />
          </div>
          <div className="relative h-[520px] overflow-hidden rounded-[12px] bg-graphite">
            <AnimatePresence initial={false}>
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <HowVisual index={active} v={v} symbol={symbol} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-6 flex gap-2" aria-hidden="true">
            {steps.map((s, i) => (
              <span
                key={s.number}
                className={`ui-label transition-colors duration-500 ${i === active ? "text-paper" : "text-paper/55"}`}
              >
                {s.number}
                {i < steps.length - 1 && <span className="ml-2 text-paper/20">/</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Mobile: mount the visual only when it scrolls into view, so its animation is seen. */
function MobileVisual({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  return (
    <div ref={ref} className="relative h-[300px] w-full overflow-hidden rounded-[12px] bg-graphite">
      {inView && children}
    </div>
  );
}
