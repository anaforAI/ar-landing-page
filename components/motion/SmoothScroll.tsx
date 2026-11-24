"use client";

import { useEffect } from "react";

/** Lenis with lerp 0.1. Skipped entirely under prefers-reduced-motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let destroyed = false;
    let lenis: import("lenis").default | undefined;

    import("lenis").then(({ default: Lenis }) => {
      if (destroyed) return;
      lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 } });
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      // Keep GSAP ScrollTrigger in sync if it is loaded.
      lenis.on("scroll", () => window.dispatchEvent(new Event("lenis-scroll")));
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);
  return null;
}
