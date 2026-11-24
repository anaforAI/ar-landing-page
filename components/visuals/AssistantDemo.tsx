"use client";

import { useEffect, useRef, useState } from "react";
import { EvidenceChip, type EvidenceState } from "@/components/ui/EvidenceChip";
import { ArrowRight } from "@/components/ui/icons";

type Segment = { state: EvidenceState; text: string };
type Demo = {
  label: string;
  title: string;
  questionLabel: string;
  question: string;
  ask: string;
  again: string;
  thinking: string;
  answerLabel: string;
  answer: Segment[];
  sourcesLabel: string;
  sources: string;
  permissionsNote: string;
};

type Phase = "idle" | "thinking" | "streaming" | "done";

/** Keyboard-operable mock of the assistant. Streams a sample answer that separates facts, interpretations and hypotheses. */
export function AssistantDemo({
  demo: raw,
  stateLabels,
  sampleLabel,
}: {
  demo: Record<string, unknown>;
  stateLabels: Record<EvidenceState, string>;
  sampleLabel: string;
}) {
  const demo = raw as unknown as Demo;
  const [phase, setPhase] = useState<Phase>("idle");
  const [shown, setShown] = useState<number[]>([]); // words shown per segment
  const timers = useRef<number[]>([]);

  const words = demo.answer.map((s) => s.text.split(" "));

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const run = () => {
    clear();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(words.map((w) => w.length));
      setPhase("done");
      return;
    }
    setShown([]);
    setPhase("thinking");
    let t = 700;
    const push = (fn: () => void, at: number) => timers.current.push(window.setTimeout(fn, at));
    push(() => setPhase("streaming"), t);
    words.forEach((seg, si) => {
      t += 260; // pause before each segment
      seg.forEach((_, wi) => {
        t += 38;
        push(() => {
          setShown((prev) => {
            const next = [...prev];
            next[si] = wi + 1;
            return next;
          });
        }, t);
      });
    });
    push(() => setPhase("done"), t + 250);
  };

  const busy = phase === "thinking" || phase === "streaming";

  return (
    <div className="card overflow-hidden" role="group" aria-label={demo.label}>
      <div className="flex items-center justify-between gap-4 border-b border-sand px-5 py-3.5">
        <p className="flex items-center gap-2.5 text-[14px] font-medium tracking-[-0.01em]">
          <svg aria-hidden="true" viewBox="64 0 40 40" className="h-3 w-3 text-teal" fill="currentColor">
            <path d="M64 0H100A4 4 0 0 1 104 4V40A40 40 0 0 1 64 0Z" />
          </svg>
          {demo.title}
        </p>
        <span className="ui-label rounded-[4px] border border-sand px-2 py-1 text-stone">
          {sampleLabel}
        </span>
      </div>

      <div className="p-5 sm:p-7">
        <p id="demo-q-label" className="ui-label text-stone">
          {demo.questionLabel}
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <p className="flex-1 rounded-[8px] border border-sand bg-paper px-4 py-3 text-[16px] leading-snug">
            {demo.question}
          </p>
          <button
            type="button"
            onClick={run}
            disabled={busy}
            aria-describedby="demo-q-label"
            className="btn btn-primary btn-sm shrink-0 disabled:cursor-progress disabled:opacity-70"
          >
            {phase === "done" ? demo.again : demo.ask}
            <ArrowRight className="btn-arrow" />
          </button>
        </div>

        <div aria-live="polite" aria-busy={busy} className="mt-6 min-h-[296px] sm:min-h-[248px]">
          {phase === "idle" && (
            <div className="space-y-2.5 pt-2" aria-hidden="true">
              <span className="block h-2 w-full rounded-full bg-sand/60" />
              <span className="block h-2 w-11/12 rounded-full bg-sand/60" />
              <span className="block h-2 w-3/5 rounded-full bg-sand/60" />
            </div>
          )}
          {phase === "thinking" && (
            <p className="ui-label flex items-center gap-2 text-stone">
              <span className="inline-block h-2 w-2 animate-pulse rounded-[1px] bg-teal" aria-hidden="true" />
              {demo.thinking}
            </p>
          )}
          {(phase === "streaming" || phase === "done") && (
            <div>
              <p className="sr-only">{demo.answerLabel}</p>
              <ol className="space-y-4">
                {demo.answer.map((seg, si) =>
                  (shown[si] ?? 0) > 0 || phase === "done" ? (
                    <li key={si} className="animate-[fade-in_300ms_ease_both]">
                      <EvidenceChip state={seg.state} label={stateLabels[seg.state]} size="sm" />
                      <p className="mt-2 text-[16px] leading-[1.55]">
                        {phase === "done" ? seg.text : words[si].slice(0, shown[si]).join(" ")}
                      </p>
                    </li>
                  ) : null,
                )}
              </ol>
              {phase === "done" && (
                <div className="mt-6 animate-[fade-in_400ms_ease_both] border-t border-sand pt-4">
                  <p className="ui-label text-stone">
                    {demo.sourcesLabel} · <span className="text-ink">{demo.sources}</span>
                  </p>
                  <p className="mt-2 text-[13px] text-stone">{demo.permissionsNote}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
