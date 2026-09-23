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
  /**
   * Zero-based indices of the lines set in the voice gradient — the ONE accent
   * line of a headline. The gradient resolves per ground (see --g-voice in
   * globals.css), so a caller only says which line, never which colours.
   */
  accent?: number[];
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
  accent,
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const accentKey = accent?.join(",") ?? "";

  /* The accent line's gradient. Every character is its own box, so the
     gradient is painted per character and POSITIONED as one run: this measures
     the line's text run and writes its width and each character's offset into
     it as --k-bs / --k-bp, which the k-accent rules in globals.css read.
     Measured in layout px — the client rects are divided by the line's own
     scale factor — because the hero scales its headline with a transform and a
     scaled offset would tear the gradient. Re-measured whenever the element
     resizes (font load, viewport change). */
  useEffect(() => {
    const el = ref.current;
    if (!el || !accentKey) return;
    const lines = Array.from(el.querySelectorAll<HTMLElement>(".k-accent"));
    if (!lines.length) return;

    const measure = () => {
      for (const line of lines) {
        const chars = Array.from(line.querySelectorAll<HTMLElement>(".k-char"));
        if (!chars.length) continue;
        const lr = line.getBoundingClientRect();
        const scale = line.offsetWidth > 0 && lr.width > 0 ? lr.width / line.offsetWidth : 1;
        /* The .k-solid rects, NOT the .k-char rects. The solid carries 0.2em of
           horizontal padding so that overhanging italic ink still has a
           background to be clipped out of (see the .k-accent rules in
           globals.css), and a background is positioned from the PADDING box —
           so the padded box is the one whose geometry the gradient has to be
           built from, or every character is offset by that padding. */
        const solids = chars.map((c) => c.querySelector<HTMLElement>(".k-solid") ?? c);
        const rects = solids.map((s) => s.getBoundingClientRect());
        const first = Math.min(...rects.map((r) => r.left));
        const last = Math.max(...rects.map((r) => r.right));
        const run = Math.max(1, (last - first) / scale);
        chars.forEach((c, i) => {
          c.style.setProperty("--k-bs", `${run}px 100%`);
          c.style.setProperty("--k-bp", `${-((rects[i].left - first) / scale)}px 0`);
        });
      }
    };

    measure();
    document.fonts?.ready.then(() => measure()).catch(() => {});
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [accentKey, text]);

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
        <span key={li} className={`block${accent?.includes(li) ? " k-accent" : ""}`} aria-hidden="true">
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
