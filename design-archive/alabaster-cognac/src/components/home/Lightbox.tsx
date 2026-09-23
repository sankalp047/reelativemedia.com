"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { getLenis } from "@/lib/lenis-store";
import { EXPO } from "@/lib/motion";

export type LightboxItem = {
  id: string;
  src: string;
  poster: string;
  /** Optional. Omitted while there is no real attribution to show — an empty
   *  caption bar is better than one filled with invented names. */
  title?: string;
  meta?: string;
  /** The shape the player opens at. Defaults to the 9:16 reel. A landscape
   *  film gets "16/9" so it fills its window instead of being pillarboxed into
   *  a portrait one — the CARD stays 9:16 regardless. */
  aspect?: "9/16" | "16/9";
};

type Props = {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
};

/**
 * `chip` is tuned for the paper grounds (graphite on alabaster, hover to an ink
 * fill). Inside the lightbox every chip sits on a near-obsidian scrim, so the
 * whole set is re-pointed at the dark half of the palette: a `well` fill that is
 * effectively invisible against the scrim, carried by an `edge-dark` boundary at
 * 3.23:1 — the interactive-boundary token, not the decorative one — with bone
 * type at 15.11:1, inverting to a bone fill with ink type on hover.
 */
const DARK_CHIP =
  "chip !border-edge-dark !bg-well !text-bone hover:!border-bone hover:!bg-bone hover:!text-ink";

/**
 * Full-height 9:16 player. Sound on.
 *
 * Sources are Cloudflare Stream HLS manifests. Safari and iOS play .m3u8 in a
 * plain <video>; Chrome and Firefox do not, so hls.js attaches Media Source
 * Extensions for them. That is the whole reason the dependency is here — the
 * alternative was Cloudflare's own iframe player, which would have replaced
 * this component entirely and taken the swipe navigation, the mat, the caption
 * overlay and the tap-for-sound handling with it.
 *
 * hls.js is imported dynamically inside the effect, so its ~35KB only loads for
 * someone who actually opens a reel, not on first paint. Arrow keys / vertical swipe move between
 * items (TikTok-style); Esc, backdrop click, or swipe-down on the first item closes.
 * Loaded lazily via next/dynamic.
 */
export default function Lightbox({ items, index, onClose, onIndex }: Props) {
  const open = index !== null;
  const item = open ? items[index] : null;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsTapForSound, setNeedsTapForSound] = useState(false);

  /**
   * Stop the video, THEN close.
   *
   * Closing used to rely on the element unmounting to end playback, which meant
   * audio kept going for the whole 0.3s exit animation — and if that animation
   * is ever interrupted or slowed, longer. Pausing first makes "stop playing"
   * immediate and independent of the animation finishing.
   */
  const stopAndClose = useCallback(() => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
    onClose();
  }, [onClose]);

  const next = useCallback(() => {
    if (index === null) return;
    onIndex((index + 1) % items.length);
  }, [index, items.length, onIndex]);
  const prev = useCallback(() => {
    if (index === null) return;
    onIndex((index - 1 + items.length) % items.length);
  }, [index, items.length, onIndex]);

  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stopAndClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
      document.body.style.overflow = "";
    };
  }, [open, stopAndClose, next, prev]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !item) return;
    let disposed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let hls: any = null;

    const start = () => {
      if (disposed) return;
      v.muted = false;
      v.currentTime = 0;
      v.play()
        .then(() => setNeedsTapForSound(false))
        .catch(() => {
          // Autoplay with sound is blocked until the user has interacted with
          // the page. Fall back to muted and offer the unmute chip.
          v.muted = true;
          setNeedsTapForSound(true);
          v.play().catch(() => {});
        });
    };

    if (v.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari and iOS: native HLS, no library needed.
      v.src = item.src;
      start();
    } else {
      void import("hls.js").then(({ default: Hls }) => {
        if (disposed) return;
        if (!Hls.isSupported()) {
          // No MSE either — nothing will play this. Better to set the source and
          // let the browser show its own error than to fail silently.
          v.src = item.src;
          start();
          return;
        }
        hls = new Hls({ capLevelToPlayerSize: true });
        hls.loadSource(item.src);
        hls.attachMedia(v);
        hls.on(Hls.Events.MANIFEST_PARSED, start);
      });
    }

    return () => {
      disposed = true;
      hls?.destroy();
    };
  }, [item]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const dy = info.offset.y;
    const vy = info.velocity.y;
    if (dy < -80 || vy < -500) next();
    else if (dy > 80 || vy > 500) {
      if (index === 0) stopAndClose();
      else prev();
    }
  };

  return (
    <AnimatePresence>
      {open && item ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: "rgba(10, 9, 7, 0.92)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={stopAndClose}
          role="dialog"
          aria-modal="true"
          aria-label={item.title ? `Reel: ${item.title}` : "Reel"}
          data-ground="dark"
          data-lenis-prevent
        >
          {/* Close sits top-LEFT as a cross. It keeps the dark-chip border and
              fill rather than being a bare glyph, because at narrower widths the
              plate grows to 94vw and slides under it — a borderless × would land
              on the video itself and become unreadable. Square, so it reads as a
              control rather than a word. Esc still closes. */}
          <button
            type="button"
            onClick={stopAndClose}
            className={`${DARK_CHIP} absolute left-5 top-5 z-20 !h-11 !w-11 !px-0 !py-0 flex items-center justify-center`}
            aria-label="Close reel"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>

          <div className="absolute right-5 top-5 z-20 flex items-center gap-3">
            <span className="mono text-ash">
              Reel [{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}]
            </span>
          </div>

          <motion.div
            key={item.id}
            /* Portrait is height-led (fill the viewport, let width follow);
               landscape is width-led. Sizing a 16:9 film by height would make
               it wider than the screen on any normal window. */
            className={`relative rounded-[2px] bg-linen p-[8px] shadow-[0_44px_120px_-24px_rgba(4,3,2,0.70)] ${
              item.aspect === "16/9"
                ? "aspect-video w-[min(94vw,1280px)] max-h-[88svh]"
                : "aspect-[9/16] h-[min(88svh,900px)] max-w-[94vw]"
            }`}
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -16 }}
            transition={{ duration: 0.5, ease: EXPO }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.25}
            onDragEnd={onDragEnd}
            onClick={(e) => e.stopPropagation()}
          >
            {/* The mat's inner hairline. Decorative, so it takes `rule`, not `edge`. */}
            <div className="relative h-full w-full overflow-hidden rounded-[1px] ring-1 ring-rule">
              <video
                ref={videoRef}
                className={`h-full w-full ${item.aspect === "16/9" ? "object-contain" : "object-cover"}`}
                poster={item.poster}
                playsInline
                loop
                controls={false}
                preload="auto"
              />
              {item.title || item.meta ? (
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 p-6"
                  style={{ background: "linear-gradient(to top, rgba(10,9,7,0.88), rgba(10,9,7,0))" }}
                >
                  {item.title ? <p className="t-h3 text-bone">{item.title}</p> : null}
                  {item.meta ? <p className="num mt-1.5 text-[12.5px] tracking-[0.04em] text-ash">{item.meta}</p> : null}
                </div>
              ) : null}
            </div>
            {needsTapForSound ? (
              <button
                type="button"
                className={`${DARK_CHIP} absolute left-1/2 top-6 -translate-x-1/2`}
                onClick={() => {
                  const v = videoRef.current;
                  if (!v) return;
                  v.muted = false;
                  setNeedsTapForSound(false);
                }}
              >
                Tap for sound
              </button>
            ) : null}
          </motion.div>

          <div className="absolute inset-x-0 bottom-5 hidden items-center justify-center gap-6 md:flex" onClick={(e) => e.stopPropagation()}>
            <button type="button" className={DARK_CHIP} onClick={prev} aria-label="Previous reel">
              ← Prev
            </button>
            <button type="button" className={DARK_CHIP} onClick={next} aria-label="Next reel">
              Next →
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
