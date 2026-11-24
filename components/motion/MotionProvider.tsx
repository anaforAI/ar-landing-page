"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

export const EASE = [0.2, 0.7, 0.2, 1] as const;

/** reducedMotion="user": transforms are dropped, opacity fades remain. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASE, duration: 0.6 }}>
      {children}
    </MotionConfig>
  );
}
