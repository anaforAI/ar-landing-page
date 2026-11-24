"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { EASE } from "@/components/motion/MotionProvider";
import { CheckIcon, DocIcon, GithubMark, JiraMark, MeetMark } from "@/components/ui/icons";

type V = Record<string, string | string[]>;
const s = (v: V, k: string) => v[k] as string;

export function HowVisual({ index, v, symbol }: { index: number; v: V; symbol?: ReactNode }) {
  switch (index) {
    case 0:
      return <Connect v={v} symbol={symbol} />;
    case 1:
      return <Correlate v={v} />;
    case 2:
      return <Interpret v={v} />;
    default:
      return <Deliver v={v} />;
  }
}

/** Runs a sequence of phases once after mount. */
function usePhases(count: number, step = 550, start = 250) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const ids: number[] = [];
    for (let i = 1; i <= count; i++) ids.push(window.setTimeout(() => setPhase(i), start + (i - 1) * step));
    return () => ids.forEach(clearTimeout);
  }, [count, step, start]);
  return phase;
}

const tile =
  "rounded-[8px] border border-paper/10 bg-ink px-4 py-3 text-[14px] text-paper shadow-[0_1px_2px_rgb(0_0_0/0.3)]";

/* 01 — Connect: three sources and the knowledge base flow into Anafor. */
function Connect({ v, symbol }: { v: V; symbol?: ReactNode }) {
  const sources = [
    { icon: <GithubMark aria-hidden="true" width={16} height={16} />, label: "GitHub" },
    { icon: <JiraMark aria-hidden="true" width={16} height={16} />, label: "Jira" },
    { icon: <MeetMark aria-hidden="true" width={16} height={16} />, label: "Google Meet" },
    { icon: <DocIcon width={16} height={16} />, label: s(v, "knowledge"), sub: s(v, "knowledgeItems") },
  ];
  const ys = [17, 38, 59, 82];
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {ys.map((y, i) => (
          <motion.path
            key={y}
            d={`M50 ${y} C 61 ${y}, 61 50, 72 50`}
            fill="none"
            stroke="var(--anafor-teal-light)"
            strokeWidth={0.22}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.35 + i * 0.12 }}
          />
        ))}
      </svg>
      {sources.map((src, i) => (
        <motion.div
          key={src.label}
          className={`${tile} absolute left-[7%] w-[43%] -translate-y-1/2`}
          style={{ top: `${ys[i]}%` }}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
        >
          <span className="flex items-center gap-2 text-paper/90">
            <span className="text-paper/60">{src.icon}</span>
            {src.label}
          </span>
          {src.sub && <span className="ui-label mt-1 block text-paper/50">{src.sub}</span>}
        </motion.div>
      ))}
      <motion.div
        className="absolute left-[72%] top-1/2 grid h-[88px] w-[88px] -translate-y-1/2 place-items-center rounded-[12px] border border-paper/15 bg-ink"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.9 }}
      >
        <span className="lift-in block h-10 w-10 [&>span]:block [&>span]:h-full [&_svg]:h-full [&_svg]:w-full">
          {symbol}
        </span>
      </motion.div>
    </div>
  );
}

/* 02 — Correlate: a PR with COM-103 snaps into its subtask, then the link climbs to the objective. */
function Correlate({ v }: { v: V }) {
  const phase = usePhases(4, 380, 700);
  const chain = [
    { k: s(v, "objective"), t: s(v, "objectiveTitle") },
    { k: s(v, "epic"), t: s(v, "epicTitle") },
    { k: s(v, "subtask"), t: s(v, "subtaskTitle") },
  ];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-0 px-8" aria-hidden="true">
      {chain.map((c, i) => {
        const lit = phase >= 4 - i; // subtask lights first, then epic, then objective
        return (
          <div key={c.k} className="flex w-full max-w-[340px] flex-col items-center">
            <div
              className={`${tile} w-full transition-[border-color] duration-500 ${lit ? "border-teal-light/70" : ""}`}
            >
              <span className="ui-label text-paper/50">{c.k}</span>
              <span className="mt-1 block">{c.t}</span>
            </div>
            <span
              className={`h-7 w-px transition-colors duration-500 ${lit ? "bg-teal-light" : "bg-paper/15"}`}
            />
          </div>
        );
      })}
      <motion.div
        className={`${tile} relative w-full max-w-[340px] border-teal-light/70`}
        initial={{ opacity: 0, y: 56, rotate: -4, x: 24 }}
        animate={{ opacity: 1, y: 0, rotate: 0, x: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
      >
        <span className="ui-label flex items-center gap-2 text-paper/50">
          <GithubMark aria-hidden="true" width={12} height={12} />
          {s(v, "pr")}
        </span>
        <span className="mt-1 block">
          <span className="rounded-[4px] bg-teal px-1.5 py-0.5 font-mono text-[12px] text-paper">COM-103</span>{" "}
          {s(v, "prTitle").replace("COM-103 ", "")}
        </span>
        <motion.span
          className="ui-label absolute -top-[30px] right-0 flex items-center gap-1.5 text-teal-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
        >
          <span className="marker marker-verified h-2 w-2" />
          {s(v, "linked")}
        </motion.span>
      </motion.div>
    </div>
  );
}

/* 03 — Interpret: a card passes through Analyze → Validate → Publish. */
function Interpret({ v }: { v: V }) {
  const phase = usePhases(5, 520, 300);
  const stages = [s(v, "analyze"), s(v, "validate"), s(v, "publish")];
  const stageIndex = phase <= 1 ? 0 : phase <= 3 ? 1 : 2;
  const checks = v.checks as string[];
  return (
    <div className="absolute inset-0 flex flex-col justify-center px-8" aria-hidden="true">
      <div className="grid grid-cols-3 gap-3">
        {stages.map((st, i) => (
          <div key={st} className="flex flex-col items-center gap-3">
            <span
              className={`ui-label transition-colors duration-500 ${i <= stageIndex ? "text-teal-light" : "text-paper/55"}`}
            >
              {String(i + 1).padStart(2, "0")} · {st}
            </span>
            <span
              className={`h-px w-full transition-colors duration-500 ${i <= stageIndex ? "bg-teal-light" : "bg-paper/15"}`}
            />
          </div>
        ))}
      </div>
      <div className="relative mt-10 h-[220px]">
        <motion.div
          className={`${tile} absolute top-0 w-[46%] p-5`}
          animate={{ left: ["0%", "27%", "54%"][stageIndex] }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="ui-label text-paper/50">{s(v, "narrative")}</span>
          <span className="mt-2 block text-[15px] leading-snug">{s(v, "narrativeText")}</span>
          <ul className="mt-4 space-y-1.5 border-t border-paper/10 pt-3">
            {checks.map((c, i) => (
              <li
                key={c}
                className={`ui-label flex items-center gap-2 transition-opacity duration-300 ${phase >= 2 + (i > 0 ? 1 : 0) ? "text-teal-light opacity-100" : "opacity-25"}`}
              >
                <CheckIcon width={12} height={12} />
                {c}
              </li>
            ))}
          </ul>
          <span
            className={`ui-label mt-3 flex items-center gap-2 transition-opacity duration-500 ${phase >= 5 ? "text-paper opacity-100" : "opacity-0"}`}
          >
            <span className="marker marker-verified h-2 w-2 text-teal-light" />
            {s(v, "publish")}
          </span>
        </motion.div>
      </div>
    </div>
  );
}

/* 04 — Deliver: daily, weekly and monthly reports plus the assistant with sources. */
function Deliver({ v }: { v: V }) {
  const reports = [
    { k: s(v, "daily"), t: s(v, "dailyText") },
    { k: s(v, "weekly"), t: s(v, "weeklyText") },
    { k: s(v, "monthly"), t: s(v, "monthlyText") },
  ];
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-6 px-8" aria-hidden="true">
      <div className="grid grid-cols-3 gap-3">
        {reports.map((r, i) => (
          <motion.div
            key={r.k}
            className={`${tile} p-4`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.12 }}
          >
            <span className="ui-label text-teal-light">{r.k}</span>
            <span className="mt-2 block text-[14px] leading-snug text-paper/85">{r.t}</span>
            <span className="mt-3 block space-y-1.5">
              <span className="block h-1 w-full rounded-full bg-paper/10" />
              <span className="block h-1 w-3/4 rounded-full bg-paper/10" />
            </span>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="ml-auto max-w-[78%] rounded-[12px] rounded-br-[4px] bg-paper/10 px-4 py-3 text-[14px] text-paper"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
      >
        {s(v, "assistantQ")}
      </motion.div>
      <motion.div
        className={`${tile} max-w-[86%] rounded-bl-[4px] p-4`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 0.85 }}
      >
        <span className="block text-[14px] leading-snug">{s(v, "assistantA")}</span>
        <span className="ui-label mt-3 flex items-center gap-2 border-t border-paper/10 pt-3 text-paper/55">
          <span className="marker marker-verified h-2 w-2 text-teal-light" />
          {s(v, "assistantSources")}
        </span>
      </motion.div>
    </div>
  );
}
