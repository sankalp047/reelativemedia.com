"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The section label.
 *
 * `rule` (the default) is a 40px hairline that draws in from the left, a 12px
 * gap, then the label. It replaces the highlighter swipe, which was the
 * loudest surviving piece of the old poster vocabulary.
 *
 * `swipe` is kept for the rare place a filled label is wanted. A spectrum fill
 * takes WHITE type (4.64 at the gradient's deepest stop); ink on it bottoms
 * out at 2.28 and is banned.
 *
 * The rule is the spectrum gradient on BOTH tones: it is non-text, and the
 * gradient's every stop clears 3:1 on midnight and on cloud alike.
 */
export function Marker({
  children,
  className = "",
  variant = "rule",
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  variant?: "rule" | "swipe";
  /** `dark` is for the two dark wells (Hero over video, FinalCTA). */
  tone?: "light" | "dark";
}) {
  const reduce = useReducedMotion();

  if (variant === "swipe") {
    return (
      <span className={`relative inline-block px-2 py-0.5 ${className}`}>
        <motion.span
          className="absolute inset-x-0 inset-y-0 -z-10 origin-left bg-brand"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        />
        <span className="relative eyebrow text-white">{children}</span>
      </span>
    );
  }

  const ruleColor = "bg-brand";
  // slate, not steel: steel is 7.05:1 on flat midnight but only 3.45:1 over the
  // worst-case Hero scrim, which is below AA for an 11px label. slate is
  // 4.53 there and 9.27 on midnight.
  const labelColor = tone === "dark" ? "text-slate" : "text-graphite";

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <motion.span
        className={`block h-px w-10 shrink-0 origin-left ${ruleColor}`}
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />
      <span className={`eyebrow ${labelColor}`}>{children}</span>
    </span>
  );
}
