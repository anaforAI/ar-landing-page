"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { EASE } from "./MotionProvider";

/** Section content fades in (and rises 12px) once. */
export function Reveal({
  delay = 0,
  y = 12,
  children,
  ...rest
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
