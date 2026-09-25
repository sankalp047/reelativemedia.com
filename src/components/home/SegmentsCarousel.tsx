"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { SectionHead } from "@/components/site/SectionHead";
import { Item, Stagger } from "@/components/ui/Reveal";
import type { LightboxItem } from "@/components/home/Lightbox";
import type { Reel } from "@/lib/stream";

const Lightbox = dynamic(() => import("@/components/home/Lightbox"), { ssr: false });

/**
 * The reel carousel. It renders whatever it is handed; the server component
 * beside it decides where those reels come from (see Segments.tsx).
 *
 * Each card is a reel. Clicking one opens the same player the site uses
 * everywhere else. The heading and the line under it come from the video's own
 * name in Cloudflare, so re-captioning a card is a rename in the dashboard.
 *
 * It opens as a CAROUSEL of five on desktop, two on tablets and one on phones,
 * with a button that expands to the full grid.
 *
 * WHY IT DOES NOT SCROLL
 * The track is moved with a transform, not by a scroll container. A horizontal
 * scroller inside a vertically scrolling page is the thing phones handle worst:
 * the gesture is ambiguous, so the page and the track fight over every diagonal
 * swipe. Buttons are unambiguous.
 *
 * HOW THE PAGING MATHS WORKS
 * Slide widths are pure CSS, so the first page is laid out correctly by the
 * server before any JavaScript runs — `perPage` only affects how far the track
 * moves and how many dots are drawn. The last page is CLAMPED to the final full
 * screenful, so it is never a short row beside empty columns.
 *
 * AUTOPLAY IS HEAVILY QUALIFIED. It stops for good the moment anyone touches a
 * control, and never starts while the section is off-screen, the pointer is
 * over it, focus is inside it, a reel is playing, the grid is expanded, or the
 * visitor asked for reduced motion.
 *
 * FOCUS AND OFF-SCREEN SLIDES: each card holds a play button, so slides waiting
 * outside the window leave the tab order and are hidden from assistive tech.
 * Otherwise tabbing would move focus to a control nobody can see.
 */

const AUTOPLAY_MS = 5200;

const MQ_LG = "(min-width: 1024px)";
const MQ_SM = "(min-width: 640px)";
const MQ_RM = "(prefers-reduced-motion: reduce)";

const subscribeMedia = (cb: () => void) => {
  const mqs = [MQ_LG, MQ_SM, MQ_RM].map((q) => window.matchMedia(q));
  mqs.forEach((m) => m.addEventListener("change", cb));
  return () => mqs.forEach((m) => m.removeEventListener("change", cb));
};
const getPerPage = () =>
  window.matchMedia(MQ_LG).matches ? 5 : window.matchMedia(MQ_SM).matches ? 2 : 1;
const getPerPageServer = () => 5;
const getReduce = () => window.matchMedia(MQ_RM).matches;
const getReduceServer = () => false;

function PlayButton() {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
      {/* A spectrum fill takes WHITE: 4.64 at the gradient's deepest stop. */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d="M8 5.5v13l11-6.5z" />
      </svg>
    </span>
  );
}

function ReelCard({
  reel,
  n,
  onPlay,
  focusable,
}: {
  reel: Reel;
  n: number;
  onPlay: () => void;
  focusable: boolean;
}) {
  return (
    <article className="flex h-full flex-col">
      {/* The whole frame is the control, and the art is the reel's own poster
          frame from Cloudflare. Which frame that is, is set per video in the
          Stream dashboard, so nothing here changes to re-pick it.

          The frame is 9:16. A CUSTOM cover always fills it, because artwork
          supplied for the card was drawn to this shape. A Cloudflare frame of a
          LANDSCAPE reel is letterboxed instead of cropped, since losing the
          sides of a 16:9 frame throws away most of the shot and a band of mat
          is the cheaper compromise. Give that video a custom cover and the
          letterboxing goes away. bg-haze is the mat and the loading state. */}
      <button
        type="button"
        onClick={onPlay}
        tabIndex={focusable ? 0 : -1}
        aria-label={`Play the ${reel.name} reel`}
        className="group relative block w-full overflow-hidden rounded-[2px] border border-rule bg-haze"
      >
        <div style={{ paddingTop: "177.78%" }} aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={reel.poster}
          alt=""
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full ${
            !reel.customPoster && reel.aspect === "16/9" ? "object-contain" : "object-cover"
          }`}
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <PlayButton />
        </span>
        {/* The chip sits on unpredictable photography, so it is an opaque cloud
            block rather than a tint: ink on it is 18.62:1 whatever is behind. */}
        <span className="mono absolute left-2.5 top-2.5 rounded-full border border-rule bg-cloud px-2 py-1 text-ink">
          {String(n).padStart(2, "0")}
        </span>
      </button>

      <h3 className="t-h3 mt-4 text-ink">{reel.name}</h3>
      {reel.info ? <p className="t-body mt-1.5 !text-[14px] text-graphite">{reel.info}</p> : null}
    </article>
  );
}

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === "prev" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  );
}

type Props = {
  reels: Reel[];
  /** Anchor id, and the prefix for the heading's id. */
  id: string;
  eyebrow: string;
  lines: string[];
  intro: string;
  /** Ground class. The card tokens assume a LIGHT band either way. */
  ground?: string;
  /** Names the carousel for assistive tech. */
  label: string;
  /** Which of `lines` takes the voice gradient. */
  accent?: number[];
  /** A supporting band: smaller header, and it sits close to the section
   *  above instead of opening its own full-height chapter. */
  compact?: boolean;
};

export function SegmentsCarousel({
  reels,
  id,
  eyebrow,
  lines,
  intro,
  ground = "bg-cloud",
  label,
  accent = [1],
  compact = false,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const perPage = useSyncExternalStore(subscribeMedia, getPerPage, getPerPageServer);
  const reduce = useSyncExternalStore(subscribeMedia, getReduce, getReduceServer);

  const total = reels.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  // DERIVED, not stored: turning a phone sideways changes perPage and can leave
  // `page` past the end, and clamping here avoids a second source of truth.
  const current = Math.min(page, pageCount - 1);
  const maxStart = Math.max(0, total - perPage);
  const start = Math.min(current * perPage, maxStart);

  const items: LightboxItem[] = useMemo(
    () =>
      reels.map((r) => ({
        id: r.id,
        src: r.src,
        poster: r.poster,
        aspect: r.aspect,
        title: r.name,
        meta: r.info || undefined,
      })),
    [reels],
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (expanded || engaged || reduce || paused || !inView || open !== null || pageCount < 2) return;
    const id = window.setInterval(
      () => setPage((p) => (Math.min(p, pageCount - 1) + 1) % pageCount),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(id);
  }, [expanded, engaged, reduce, paused, inView, open, pageCount]);

  const go = (next: number) => {
    setEngaged(true);
    setPage(((next % pageCount) + pageCount) % pageCount);
  };

  const showCarousel = !expanded;
  const showPaging = showCarousel && pageCount > 1;
  const showViewAll = total > perPage || expanded;

  if (!total) return null;

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative z-10 ${ground} ${
        compact ? "pb-24 pt-14 lg:pb-32 lg:pt-16" : "section-pad"
      }`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="wrap">
        <SectionHead eyebrow={eyebrow} lines={lines} intro={intro} accent={accent} compact={compact} />
        <span id={`${id}-heading`} className="sr-only">
          {label}
        </span>

        <div
          className={
            compact
              ? "mt-8 border-t border-rule pt-8"
              : "mt-14 border-t border-rule pt-12 lg:mt-20"
          }
        >
          {/* The id lives on a wrapper present in BOTH states, so the expand
              button's aria-controls never points at nothing. */}
          <div id={`${id}-list`}>
            {showCarousel ? (
              // CLIP, NOT HIDDEN. `overflow: hidden` still makes a scroll
              // container, so anything that scrolls a slide into view sets
              // scrollLeft and shifts the track behind the transform that owns
              // its position. The symptom is the first card losing its left
              // edge and never getting it back.
              <div
                className="overflow-clip"
                role="group"
                aria-roledescription="carousel"
                aria-label={label}
                onPointerEnter={() => setPaused(true)}
                onPointerLeave={() => setPaused(false)}
                onFocusCapture={() => setPaused(true)}
                onBlurCapture={() => setPaused(false)}
              >
                {/* -mx-3 cancels the slides' own gutters so the first and last
                    card sit flush with the column, and the percentage widths
                    stay exact — a `gap` would break the paging maths. */}
                <Stagger className="-mx-3" amount={0.1}>
                  <div
                    className="flex"
                    style={{
                      transform: `translate3d(-${start * (100 / perPage)}%, 0, 0)`,
                      transition: reduce ? "none" : "transform 0.7s var(--ease-expo)",
                    }}
                  >
                    {reels.map((r, i) => {
                      const inWindow = i >= start && i < start + perPage;
                      return (
                        <Item key={r.id} className="w-full shrink-0 px-3 sm:w-1/2 lg:w-1/5">
                          <div aria-hidden={!inWindow}>
                            <ReelCard
                              reel={r}
                              n={i + 1}
                              focusable={inWindow}
                              onPlay={() => setOpen(i)}
                            />
                          </div>
                        </Item>
                      );
                    })}
                  </div>
                </Stagger>
              </div>
            ) : (
              <Stagger className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5" amount={0.05}>
                {reels.map((r, i) => (
                  <Item key={r.id}>
                    <ReelCard reel={r} n={i + 1} focusable onPlay={() => setOpen(i)} />
                  </Item>
                ))}
              </Stagger>
            )}
          </div>

          {showPaging || showViewAll ? (
            <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              {showPaging ? (
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => go(current - 1)}
                      aria-label="Previous reels"
                      className="flex h-11 w-11 items-center justify-center rounded-[2px] border border-edge text-ink transition-colors duration-300 hover:bg-ink hover:text-cloud"
                    >
                      <Arrow dir="prev" />
                    </button>
                    <button
                      type="button"
                      onClick={() => go(current + 1)}
                      aria-label="Next reels"
                      className="flex h-11 w-11 items-center justify-center rounded-[2px] border border-edge text-ink transition-colors duration-300 hover:bg-ink hover:text-cloud"
                    >
                      <Arrow dir="next" />
                    </button>
                  </div>

                  {/* The active dot is WIDER as well as darker, so position is
                      not carried by colour alone. */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: pageCount }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => go(i)}
                        aria-label={`Go to page ${i + 1} of ${pageCount}`}
                        aria-current={i === current ? "true" : undefined}
                        className={`h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          i === current ? "w-7 bg-ink" : "w-1.5 bg-edge hover:bg-graphite"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="sr-only" aria-live="polite">
                    Page {current + 1} of {pageCount}
                  </p>
                </div>
              ) : (
                <span aria-hidden="true" />
              )}

              {showViewAll ? (
                <button
                  type="button"
                  onClick={() => {
                    setExpanded((v) => !v);
                    setEngaged(true);
                    setPage(0);
                  }}
                  aria-expanded={expanded}
                  aria-controls={`${id}-list`}
                  className="btn btn-secondary"
                >
                  {expanded ? "Show fewer" : `View all ${total}`}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  );
}
