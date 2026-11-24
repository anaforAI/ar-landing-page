"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const SquareField = dynamic(() => import("./SquareField").then((m) => m.SquareField), { ssr: false });

/** Static pattern of sand squares (works without JS, and under reduced motion). */
const PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect x='12' y='12' width='16' height='16' rx='2' fill='%23DDD9D0'/%3E%3C/svg%3E\")";

export function HeroField({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(false);
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    // Lazy: only load the canvas once the browser is idle.
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    const id = w.requestIdleCallback ? w.requestIdleCallback(() => setInteractive(true)) : window.setTimeout(() => setInteractive(true), 1200);
    return () => {
      if (!w.requestIdleCallback) clearTimeout(id);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-[12px] px-5 py-14 md:min-h-[400px]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          backgroundImage: PATTERN,
          backgroundPosition: "center",
          opacity: ready ? 0 : 1,
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000 40%, transparent 100%)",
        }}
      />
      {interactive && <SquareField containerRef={ref} onReady={handleReady} />}
      {children}
    </div>
  );
}
