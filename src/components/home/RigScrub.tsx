"use client";

import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";
import manifest from "@/lib/scroll-video-manifest.json";

type Variant = { base: string; frames: number; width: number; height: number; proxyWidth: number };
const RIG = (manifest as { rig?: Variant }).rig;

/** The footage's own backdrop, flattened to one value at build time.
 *  Must stay identical to --color-studio, or the frame edge becomes visible
 *  against the section ground and the whole illusion collapses. */
const STUDIO = "#fdefd7";

const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const mq = window.matchMedia(RM);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(RM).matches;

let avifSupport: Promise<boolean> | null = null;
function supportsAvif() {
  if (!avifSupport) {
    avifSupport = new Promise((res) => {
      const img = new Image();
      img.onload = () => res(img.width > 0);
      img.onerror = () => res(false);
      img.src =
        "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
    });
  }
  return avifSupport;
}

/**
 * The System pane: a 121-frame sequence scrubbed by the section's own runway.
 *
 * The rig glides in from the right, crosses to the left, and the television,
 * tablet and phone arrive in the space it vacates — one shoot, three platforms.
 *
 * WHY A FRAME SEQUENCE AND NOT A <video>
 * Seeking a <video> by currentTime is unreliable under a scrub: Safari in
 * particular coalesces seeks and drops frames, so the motion stutters exactly
 * when someone scrolls slowly enough to look. Decoded stills are exact.
 *
 * WHY THIS TAKES A REF INSTEAD OF A PROGRESS PROP
 * Scroll progress changes every frame. Passing it as a prop would re-render the
 * whole System section at 60fps for a canvas write that React cannot help with.
 * This reads the runway itself and paints directly — zero renders while scrubbing.
 *
 * The backdrop was flattened to a single value at build time (see the grade in
 * the commit that added /public/scroll/rig) so it meets --color-studio exactly.
 * Nothing here should letterbox, but the canvas is cleared to STUDIO anyway so a
 * mid-load or odd aspect never shows a dark band.
 */
export function RigScrub({
  runwayRef,
  scrub,
}: {
  runwayRef: RefObject<HTMLDivElement | null>;
  scrub: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useSyncExternalStore(subscribeRM, getRM, () => false);
  const live = scrub && !reduced && Boolean(RIG);

  useEffect(() => {
    if (!live || !RIG) return;
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const runway = runwayRef.current;
    if (!box || !canvas || !runway) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const { base, frames, proxyWidth } = RIG;
    void proxyWidth;
    let ext = "webp";
    const full: (HTMLImageElement | null)[] = new Array(frames).fill(null);
    const proxy: (HTMLImageElement | null)[] = new Array(frames).fill(null);
    let current = 0;
    let drawn = -1;
    let disposed = false;
    let dpr = Math.min(2, window.devicePixelRatio || 1);

    const pad = (i: number) => String(i).padStart(4, "0");
    const load = (src: string) =>
      new Promise<HTMLImageElement | null>((res) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => res(img);
        img.onerror = () => res(null);
        img.src = src;
      });

    const draw = (force = false) => {
      if (disposed) return;
      const img = full[current] ?? proxy[current];
      if (!img) return;
      if (!force && drawn === current && img === full[current]) return;
      ctx.fillStyle = STUDIO;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Contain, never cover. Content reaches to within 0.8% of the right edge
      // of frame and 2.1% of the left, so a cover-fit crops the television and
      // the gimbal handle — there is no safe margin to take.
      const s = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const dw = Math.round(img.naturalWidth * s);
      const dh = Math.round(img.naturalHeight * s);
      // Flush to the RIGHT edge rather than centred: the box bleeds to the edge
      // of the window, and anchoring there is what carries the shadow off the
      // screen. Whatever is left over on the left fills with STUDIO, which is
      // the backdrop's own value, so the pane has no boundary on that side.
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, canvas.width - dw, Math.round((canvas.height - dh) / 2), dw, dh);
      if (img === full[current]) drawn = current;
    };

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = box.clientWidth;
      const h = box.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      draw(true);
    };

    // Full frames load nearest-to-playhead first, so the frames someone is
    // actually looking at sharpen before the ones they have not reached.
    let active = 0;
    const MAX = 6;
    const pending = new Set<number>();
    const pump = () => {
      if (disposed) return;
      while (active < MAX) {
        let best = -1;
        let bestD = Infinity;
        for (let i = 0; i < frames; i++) {
          if (full[i] || pending.has(i)) continue;
          const d = Math.abs(i - current);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
        if (best < 0) return;
        pending.add(best);
        active++;
        void load(`${base}/f_${pad(best)}.${ext}`).then((img) => {
          active--;
          pending.delete(best);
          if (img) {
            full[best] = img;
            if (best === current) draw();
          }
          pump();
        });
      }
    };

    void (async () => {
      ext = (await supportsAvif()) ? "avif" : "webp";
      if (disposed) return;
      void load(`${base}/f_0000.${ext}`).then((img) => {
        if (img) {
          full[0] = img;
          draw();
        }
      });
      // The proxy pass is 0.35MB for the whole sequence, so the scrub is never
      // empty even on a slow connection — it just sharpens as the full frames land.
      for (let i = 0; i < frames; i += 12) {
        await Promise.all(
          Array.from({ length: Math.min(12, frames - i) }, (_, k) =>
            load(`${base}/f_${pad(i + k)}.p.webp`).then((img) => {
              proxy[i + k] = img;
              if (i + k === current) draw();
            }),
          ),
        );
        if (disposed) return;
      }
      pump();
    })();

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    // The runway is the same element that drives the step list, so the frame and
    // the highlighted step can never disagree.
    let queued = false;
    const sync = () => {
      queued = false;
      const r = runway.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const f = Math.round(p * (frames - 1));
      if (f !== current) {
        current = f;
        draw();
        pump();
      }
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(sync);
    };

    // A hidden tab has no rAF and its scroll events are suppressed, so the
    // canvas can be showing a frame from wherever the playhead was when the tab
    // was backgrounded. Re-sync on the way back rather than waiting for the
    // next scroll, which may never come if they return and read without moving.
    const onVisible = () => {
      if (document.visibilityState === "visible") sync();
    };

    const raf = requestAnimationFrame(sync);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisible);
      ro.disconnect();
    };
  }, [live, runwayRef]);

  return (
    /* Square on phones, where it sits in normal flow and nothing else defines a
       height. On desktop it stretches to the full height of the grid row so the
       footage occupies the whole right-hand side rather than floating as an
       inset panel. The frame is fitted to the WIDTH and the leftover height is
       filled with STUDIO — the same value as the backdrop and the section
       ground — so extending the pane extends the studio rather than adding
       bars. It is not cropped to fill: content reaches to within 0.8% of the
       right edge of frame, so a cover-fit would cut the television in half. */
    <div ref={boxRef} className="relative aspect-square w-full lg:aspect-auto lg:h-full">
      {live ? (
        <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
      ) : (
        /* Phones have no runway to scrub and reduced-motion users get no motion,
           so both see the payoff frame: the rig plus all three platforms. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/scroll/rig-final.webp"
          alt="A camera rig on a gimbal beside a television, a tablet and a phone, each playing the same video."
          width={1100}
          height={1100}
          className="block h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}
