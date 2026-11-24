"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/components/motion/MotionProvider";
import { EvidenceChip, type EvidenceState } from "@/components/ui/EvidenceChip";

type Row = { name: string; meta: string; status: string; tone: string };
export type LeaderTab = { key: string; label: string; body: string; mockTitle: string; rows: Row[] };

export function LeaderTabs({
  tabs,
  tabsLabel,
  sampleLabel,
  stateLabels,
  idPrefix = "leaders",
}: {
  tabs: LeaderTab[];
  tabsLabel: string;
  sampleLabel: string;
  stateLabels: Record<string, string>;
  /** Stable id prefix (deterministic on server and client, unlike useId). */
  idPrefix?: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = idPrefix;

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = tabs.length - 1;
    let next = active;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
    refs.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  };

  const tab = tabs[active];

  return (
    <div>
      <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
        <div
          role="tablist"
          aria-label={tabsLabel}
          onKeyDown={onKey}
          className="inline-flex min-w-max gap-1 rounded-full border border-sand bg-paper p-1"
        >
          {tabs.map((t, i) => (
            <button
              key={t.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`${id}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative min-h-[44px] whitespace-nowrap rounded-full px-5 text-[15px] transition-colors duration-300 ${
                i === active ? "text-paper" : "text-ink/70 hover:text-ink"
              }`}
            >
              {i === active && (
                <motion.span
                  layoutId={`${id}-pill`}
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ duration: 0.4, ease: EASE }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        tabIndex={0}
        className="mt-10 rounded-[12px] md:mt-12"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab.key}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6"
          >
            <div className="lg:col-span-4">
              <h3 className="text-[28px] font-medium leading-[1.15] tracking-[-0.03em] md:text-[32px]">{tab.label}</h3>
              <p className="lead mt-4">{tab.body}</p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <Mock tab={tab} sampleLabel={sampleLabel} stateLabels={stateLabels} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Mock({
  tab,
  sampleLabel,
  stateLabels,
}: {
  tab: LeaderTab;
  sampleLabel: string;
  stateLabels: Record<string, string>;
}) {
  return (
    <div className="card overflow-hidden" aria-label={`${tab.mockTitle}, ${sampleLabel}`} role="figure">
      <div className="flex items-center justify-between gap-4 border-b border-sand px-5 py-3.5">
        <p className="text-[14px] font-medium tracking-[-0.01em]">{tab.mockTitle}</p>
        <span className="ui-label rounded-[4px] border border-sand px-2 py-1 text-stone">
          {sampleLabel}
        </span>
      </div>
      <div className="p-5 sm:p-6">{renderBody(tab, stateLabels)}</div>
    </div>
  );
}

function StatusPill({ status, tone }: { status: string; tone: string }) {
  if (!status) return null;
  const isAlert = tone === "alert";
  return (
    <span className="ui-label inline-flex items-center gap-1.5 whitespace-nowrap text-stone">
      <span
        aria-hidden="true"
        className={`inline-block h-1.5 w-1.5 rounded-full ${isAlert ? "bg-ember" : "bg-teal"}`}
      />
      {status}
    </span>
  );
}

function renderBody(tab: LeaderTab, stateLabels: Record<string, string>) {
  switch (tab.key) {
    case "vp": {
      const widths = ["78%", "56%", "22%"];
      return (
        <ul className="space-y-5">
          {tab.rows.map((r, i) => (
            <li key={r.name}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[15px] font-medium">{r.name}</span>
                <StatusPill status={r.status} tone={r.tone} />
              </div>
              <div className="mt-2 h-2 rounded-full bg-paper">
                <motion.div
                  className="h-2 rounded-full bg-teal"
                  initial={{ width: 0 }}
                  animate={{ width: widths[i] }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.08 }}
                />
              </div>
              <p className="ui-label mt-2 text-stone">{r.meta}</p>
            </li>
          ))}
        </ul>
      );
    }
    case "cto": {
      const shares = [46, 30, 24];
      const colors = ["bg-teal", "bg-ink", "bg-sand"];
      return (
        <div>
          <div className="flex h-3 gap-0.5 overflow-hidden rounded-full">
            {shares.map((s, i) => (
              <motion.span
                key={i}
                className={`${colors[i]} h-full`}
                initial={{ flexGrow: 0.001 }}
                animate={{ flexGrow: s }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              />
            ))}
          </div>
          <ul className="mt-6 divide-y divide-sand">
            {tab.rows.map((r, i) => (
              <li key={r.name} className="flex items-center justify-between gap-4 py-3">
                <span className="flex items-center gap-3 text-[15px]">
                  <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-[2px] ${colors[i]}`} />
                  {r.name}
                </span>
                <span className="ui-label text-stone">{r.meta}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    case "product":
      return (
        <ol className="relative space-y-3 before:absolute before:bottom-4 before:left-[7px] before:top-4 before:w-px before:bg-sand">
          {tab.rows.map((r) => (
            <li key={r.name} className="relative flex items-start gap-4">
              <span
                aria-hidden="true"
                className={`relative mt-1.5 h-[15px] w-[15px] rounded-full border-[1.5px] ${
                  r.tone === "ok" ? "border-teal bg-teal" : "border-stone bg-white"
                }`}
              />
              <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-[8px] border border-sand px-4 py-3">
                <span className="text-[15px] font-medium">{r.name}</span>
                <span className="ui-label text-stone">{r.meta}</span>
              </div>
            </li>
          ))}
        </ol>
      );
    case "exec":
      return (
        <ul className="space-y-4">
          {tab.rows.map((r) => {
            const key = (r.tone || "verified") as EvidenceState;
            return (
              <li key={r.name} className="border-b border-sand pb-4 last:border-0 last:pb-0">
                <p className="display text-[22px] leading-[1.25]">{r.name}</p>
                <div className="mt-2">
                  <EvidenceChip state={key} label={stateLabels[key] ?? r.meta} size="sm" />
                </div>
              </li>
            );
          })}
        </ul>
      );
    default:
      return (
        <ul className="divide-y divide-sand">
          {tab.rows.map((r) => (
            <li key={r.name} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-[15px] font-medium">{r.name}</p>
                <p className="ui-label mt-1 text-stone">{r.meta}</p>
              </div>
              <StatusPill status={r.status} tone={r.tone} />
            </li>
          ))}
        </ul>
      );
  }
}
