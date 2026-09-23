"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

type Props = {
  /** Plain text. Use \n to force line breaks. */
  text: string;
  as?: Tag;
  className?: string;
  /** Seconds before the first character moves. */
  delay?: number;
  /** Seconds between characters. */
  stagger?: number;
  /** Draw the trailing echo copy behind each character. */
  ghost?: boolean;
  style?: CSSProperties;
};

/**
 * Split-text headline: every character rises into place on a stagger, each
 * trailing a faint duplicate that lags behind and fades as it catches up.
 *
 * Playback is driven by an IntersectionObserver rather than ScrollTrigger —
 * ScrollTrigger's refresh ordering (it shares a ticker with Lenis, and the
 * pinned sections call refresh) left late characters stranded at their start
 * offset, which then collided with whatever followed the headline.
 *
 * The full string is exposed via aria-label; the split spans are decorative.
 *
 * The trailing echo is a CSS pseudo-element rather than a duplicate span, and
 * has to stay one — see the comment at the character map below.
 */
export function Kinetic({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.02,
  ghost = true,
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const solids = el.querySelectorAll<HTMLElement>(".k-solid");
    // The echo is a ::after pseudo-element, so there is nothing to select. GSAP
    // animates two custom properties on .k-char instead and the pseudo-element
    // reads them — see the k-char::after rule in globals.css.
    const chars = el.querySelectorAll<HTMLElement>(".k-char");
    if (!solids.length) {
      el.dataset.ready = "true";
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.ready = "true";
      return;
    }

    let played = false;
    let ctx: gsap.Context | null = null;

    const play = () => {
      if (played) return;
      played = true;
      el.dataset.ready = "true";
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay });
        tl.fromTo(
          solids,
          { yPercent: 108, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger, clearProps: "transform,opacity" },
          0,
        );
        if (ghost && chars.length) {
          tl.fromTo(
            chars,
            { "--k-ghost-y": "168%", "--k-ghost-o": 0.16 },
            { "--k-ghost-y": "0%", "--k-ghost-o": 0, duration: 1.15, ease: "expo.out", stagger },
            0.06,
          );
        }
      }, el);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          play();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      ctx?.revert();
    };
  }, [delay, stagger, text, ghost]);

  const lines = text.split("\n");

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`kinetic ${className}`}
      style={style}
      data-ready="false"
      aria-label={text.replace(/\n/g, " ")}
    >
      {lines.map((line, li) => (
        /* aria-hidden STAYS. The research suggested removing it so extractors
           keep the subtree, but Kinetic also renders as <p> and <span>, and a
           generic element's aria-label is ignored by most screen readers — so
           dropping it would make those cases announce the headline one letter
           at a time. That is a certain regression for real users traded against
           a speculative gain with parsers that honour aria-hidden; Google is
           documented not to. The doubling fix above is what actually mattered. */
        <span key={li} className="block" aria-hidden="true">
          {line.split(" ").map((word, wi, arr) => (
            <span key={wi} className="k-word">
              {/* data-ch feeds the ::after echo. It must NOT be a second span
                  holding the same character: that put every headline into the
                  HTML twice and made the hero extract as
                  "CCoonntteennttppeeoopplleerreemmeemmbbeerr.." for any crawler
                  reading the markup without running the page. */}
              {[...word].map((ch, ci) => (
                <span key={ci} className="k-char" data-ch={ghost ? ch : undefined}>
                  <span className="k-solid">{ch}</span>
                </span>
              ))}
              {wi < arr.length - 1 ? " " : null}
            </span>
          ))}
          {/* Lines are separate block spans, so a text extractor that ignores
              CSS runs them together — "can\npower" became "canpower". An
              explicit space is the only thing that survives tag-stripping. */}
          {li < lines.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
