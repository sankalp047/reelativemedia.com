"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EXPO, fadeUp, lineMask, stagger } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
};

/** Fade-up 24px reveal when the element enters the viewport. */
export function Reveal({ children, className = "", delay = 0, amount = 0.3 }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.8, ease: EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container: children rendered as <Item> reveal 60ms apart. */
export function Stagger({
  children,
  className = "",
  delay = 0.06,
  delayChildren = 0,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  delayChildren?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={stagger(delay, delayChildren)}
    >
      {children}
    </motion.div>
  );
}

export function Item({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

/**
 * Headline whose lines reveal from their own baseline behind a clip mask.
 * Pass explicit lines to control the break points.
 */
export function MaskedLines({
  lines,
  className = "",
  as: Tag = "h2",
  delay = 0,
  amount = 0.4,
}: {
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={stagger(0.09, delay)}
    >
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <motion.span className="block" variants={lineMask}>
              {line}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  );
}
