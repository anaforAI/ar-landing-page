"use client";

import { motion } from "motion/react";
import { parseEm } from "@/lib/rich";
import { EASE } from "./MotionProvider";

type Props = {
  source: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
};

/** Words rise 16px with a fade, 40ms stagger, once, when the heading enters the viewport. */
export function RevealHeading({ source, as = "h2", id, className }: Props) {
  const Tag = motion[as];
  const tokens = parseEm(source);
  let i = 0;
  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ staggerChildren: 0.04 }}
    >
      {tokens.map((t, k) => {
        if (/^\s+$/.test(t.text)) return t.text;
        const idx = i++;
        const word = (
          <motion.span
            key={k}
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
            }}
            data-i={idx}
          >
            {t.text}
          </motion.span>
        );
        return t.em ? <em key={k}>{word}</em> : word;
      })}
    </Tag>
  );
}
