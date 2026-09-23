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
 * `swipe` is kept for the rare place a filled label is wanted, but note the
 * fill rule INVERTED with the palette: a cognac fill takes BONE (6.59:1).
 * Ink on cognac is 2.44:1. The previous version hard-coded `text-ink` on the
 * swipe because bone on brass was 2.1:1 — carrying that over while changing
 * the fill would have been a live accessibility failure, not a nitpick.
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
          className="absolute inset-x-0 inset-y-0 -z-10 origin-left bg-cognac"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        />
        <span className="relative eyebrow text-bone">{children}</span>
      </span>
    );
  }

  const ruleColor = tone === "dark" ? "bg-cognac-hi" : "bg-cognac";
  // bone-dim, not ash: ash is 7.05:1 on flat noir but only 3.45:1 over the
  // worst-case Hero scrim, which is below AA for an 11px label. bone-dim is
  // 4.53 there and 9.27 on noir.
  const labelColor = tone === "dark" ? "text-bone-dim" : "text-graphite";

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
