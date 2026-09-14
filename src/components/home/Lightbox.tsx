"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { getLenis } from "@/lib/lenis-store";
import { EXPO } from "@/lib/motion";

export type LightboxItem = {
  id: string;
  src: string;
  poster: string;
  title: string;
  meta: string;
};

type Props = {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
};

/**
 * Full-height 9:16 player. Sound on. Arrow keys / vertical swipe move between
 * items (TikTok-style); Esc, backdrop click, or swipe-down on the first item closes.
 * Loaded lazily via next/dynamic.
 */
export default function Lightbox({ items, index, onClose, onIndex }: Props) {
  const open = index !== null;
  const item = open ? items[index] : null;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsTapForSound, setNeedsTapForSound] = useState(false);

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
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
      document.body.style.overflow = "";
    };
  }, [open, onClose, next, prev]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !item) return;
    v.muted = false;
    v.currentTime = 0;
    v.play()
      .then(() => setNeedsTapForSound(false))
      .catch(() => {
        v.muted = true;
        setNeedsTapForSound(true);
        v.play().catch(() => {});
      });
  }, [item]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const dy = info.offset.y;
    const vy = info.velocity.y;
    if (dy < -80 || vy < -500) next();
    else if (dy > 80 || vy > 500) {
      if (index === 0) onClose();
      else prev();
    }
  };

  return (
    <AnimatePresence>
      {open && item ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Reel: ${item.title}`}
          data-lenis-prevent
        >
          <button
            type="button"
            onClick={onClose}
            className="chip absolute right-5 top-5 z-10 !bg-black/40"
            aria-label="Close"
          >
            Close [esc]
          </button>

          <div className="absolute left-5 top-5 z-10 flex items-center gap-3">
            <span className="mono text-white/80">
              Reel [{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}]
            </span>
          </div>

          <motion.div
            key={item.id}
            className="relative aspect-[9/16] h-[min(88svh,900px)] max-w-[94vw] overflow-hidden rounded-[24px] bg-elevated shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
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
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              poster={item.poster}
              playsInline
              loop
              controls={false}
              preload="auto"
            >
              <source src={item.src} type="video/mp4" />
            </video>
            {needsTapForSound ? (
              <button
                type="button"
                className="chip absolute left-1/2 top-5 -translate-x-1/2 !bg-black/50"
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
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 p-6"
              style={{ background: "linear-gradient(to top, rgba(10,10,15,0.85), rgba(10,10,15,0))" }}
            >
              <p className="text-[17px] font-semibold">{item.title}</p>
              <p className="mono mt-1 text-white/60">{item.meta}</p>
            </div>
          </motion.div>

          <div className="absolute inset-x-0 bottom-5 hidden items-center justify-center gap-6 md:flex" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="chip" onClick={prev} aria-label="Previous reel">
              ← Prev
            </button>
            <button type="button" className="chip" onClick={next} aria-label="Next reel">
              Next →
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
