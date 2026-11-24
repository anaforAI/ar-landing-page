"use client";

import { useEffect, useRef } from "react";
import { GithubMark, JiraMark, MeetMark } from "@/components/ui/icons";

type Labels = Record<string, string>;

/** Scattered state (desktop / mobile). Scroll aligns them into an ordered row. */
const SCATTER = [
  { d: "translate(-56px, 48px) rotate(-7deg)", m: "translate(-14px, 0) rotate(-4deg)" },
  { d: "translate(0, -56px) rotate(5deg)", m: "translate(16px, 0) rotate(3deg)" },
  { d: "translate(64px, 72px) rotate(-3deg)", m: "translate(-10px, 0) rotate(-2deg)" },
];

export function Fragments({ labels }: { labels: Labels }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-fragment]"));
    const line = el.querySelector<HTMLElement>("[data-line]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      cards.forEach((c) => (c.style.transform = "none"));
      if (line) line.style.transform = "scaleX(1)";
      return;
    }

    let cleanup = () => {};
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 90%", end: "center 50%", scrub: 0.6 },
        });
        tl.to(cards, { x: 0, y: 0, rotate: 0, ease: "power2.out", stagger: 0.06, duration: 1 }, 0);
        if (line) tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: "power1.out", duration: 0.5 }, 0.7);
      }, el);
      const refresh = () => ScrollTrigger.update();
      window.addEventListener("lenis-scroll", refresh);
      cleanup = () => {
        window.removeEventListener("lenis-scroll", refresh);
        ctx.revert();
      };
    })();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  const cards = [
    { icon: <GithubMark aria-hidden="true" />, tag: labels.prTag, title: labels.prTitle, meta: labels.prMeta },
    { icon: <JiraMark aria-hidden="true" />, tag: labels.ticketTag, title: labels.ticketTitle, meta: labels.ticketMeta },
    { icon: <MeetMark aria-hidden="true" />, tag: labels.noteTag, title: labels.noteTitle, meta: labels.noteMeta },
  ];

  return (
    <div ref={root} role="img" aria-label={labels.label} className="relative mx-auto max-w-[1080px] py-10 md:py-16">
      <span
        data-line
        aria-hidden="true"
        className="absolute left-[16.6%] right-[16.6%] top-1/2 hidden h-px origin-left scale-x-0 bg-teal md:block"
      />
      <div className="relative grid gap-5 md:grid-cols-3 md:gap-10">
        {cards.map((c, i) => (
          <div
            key={c.tag}
            data-fragment
            className="card p-6 will-change-transform"
            style={{ transform: `var(--scatter-${i})` }}
          >
            <p className="ui-label flex items-center gap-2 text-stone">
              <span className="text-stone">{c.icon}</span>
              {c.tag}
            </p>
            <p className="mt-4 text-[18px] font-medium leading-snug tracking-[-0.02em]">{c.title}</p>
            <p className="ui-label mt-4 text-stone">{c.meta}</p>
          </div>
        ))}
      </div>
      <style>{`
        [data-fragment]{}
        :root{--scatter-0:${SCATTER[0].m};--scatter-1:${SCATTER[1].m};--scatter-2:${SCATTER[2].m}}
        @media (min-width:768px){:root{--scatter-0:${SCATTER[0].d};--scatter-1:${SCATTER[1].d};--scatter-2:${SCATTER[2].d}}}
        @media (prefers-reduced-motion: reduce){[data-fragment]{transform:none!important}}
      `}</style>
    </div>
  );
}
