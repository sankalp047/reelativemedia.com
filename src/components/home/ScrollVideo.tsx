"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import manifest from "@/lib/scroll-video-manifest.json";
import { SERVICES, SYSTEM_STEPS } from "@/lib/data";

type Variant = { base: string; frames: number; width: number; height: number; proxyWidth: number };
type Manifest = { desktop?: Variant; mobile?: Variant };
const M = manifest as Manifest;


const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const mq = window.matchMedia(RM);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getRM = () => window.matchMedia(RM).matches;
const getRMServer = () => false;

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
 * Sections 02 + 03 as one scroll-scrubbed frame sequence rendered offline from
 * tools/scroll-video/scene.html. The copy lives in the frames; a visually-hidden
 * copy below keeps it indexable and readable by assistive tech.
 */
export function ScrollVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useSyncExternalStore(subscribeRM, getRM, getRMServer);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const isPortrait = window.matchMedia("(max-aspect-ratio: 3/4)").matches;
    const variant = (isPortrait && M.mobile) || M.desktop;
    if (!variant) return;
    const { base, frames, proxyWidth } = variant;
    const PX_PER_FRAME = isPortrait ? 14 : 18;

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

    const fit = (img: HTMLImageElement) => {
      const cw = canvas.width, ch = canvas.height;
      const s = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = Math.round(img.naturalWidth * s), dh = Math.round(img.naturalHeight * s);
      return { dx: Math.round((cw - dw) / 2), dy: Math.round((ch - dh) / 2), dw, dh };
    };

    const draw = (force = false) => {
      if (disposed) return;
      const img = full[current] ?? proxy[current];
      if (!img) return;
      if (!force && drawn === current && img === full[current]) return;
      ctx.fillStyle = "#0A0A0F";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const { dx, dy, dw, dh } = fit(img);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, dx, dy, dw, dh);
      if (img === full[current]) drawn = current;
    };

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = section.clientWidth, h = section.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      draw(true);
    };

    // Loading: proxies first (tiny), then full frames nearest to the playhead.
    let active = 0;
    const MAX = 6;
    const pending = new Set<number>();
    const pump = () => {
      if (disposed) return;
      while (active < MAX) {
        let best = -1, bestD = Infinity;
        for (let i = 0; i < frames; i++) {
          if (full[i] || pending.has(i)) continue;
          const d = Math.abs(i - current);
          if (d < bestD) { bestD = d; best = i; }
        }
        if (best < 0) return;
        pending.add(best);
        active++;
        load(`${base}/f_${pad(best)}.${ext}`).then((img) => {
          active--;
          pending.delete(best);
          if (img) { full[best] = img; if (best === current) draw(); }
          pump();
        });
      }
    };

    (async () => {
      ext = (await supportsAvif()) ? "avif" : "webp";
      if (disposed) return;
      // first frame at full quality as early as possible
      load(`${base}/f_0000.${ext}`).then((img) => { if (img) { full[0] = img; draw(); } });
      // proxies in batches
      for (let i = 0; i < frames; i += 12) {
        await Promise.all(
          Array.from({ length: Math.min(12, frames - i) }, (_, k) =>
            load(`${base}/f_${pad(i + k)}.p.webp`).then((img) => { proxy[i + k] = img; if (i + k === current) draw(); }),
          ),
        );
        if (disposed) return;
      }
      pump();
    })();

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${frames * PX_PER_FRAME}`,
      pin: true,
      scrub: 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const f = Math.round(self.progress * (frames - 1));
        if (f !== current) { current = f; draw(); pump(); }
      },
    });
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    void proxyWidth;

    return () => {
      disposed = true;
      window.clearTimeout(t);
      ro.disconnect();
      st.kill();
      gsap.killTweensOf(canvas);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="system"
      className="relative z-10 h-svh w-full overflow-hidden bg-base"
      aria-labelledby="system-heading"
    >
      {reduced ? (
        <video className="h-full w-full object-contain" controls muted playsInline preload="metadata" poster={`${M.desktop?.base}/f_0000.webp`}>
          <source src="/scroll/system/desktop.mp4" type="video/mp4" />
        </video>
      ) : (
        <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
      )}

      {/* Indexable copy of everything inside the frames */}
      <div className="sr-only">
        <p>02 — The system</p>
        <h2 id="system-heading">One focused shoot can power your whole month.</h2>
        <p>We plan the stories before the camera arrives, so every minute of capture produces usable content.</p>
        <ol>
          {SYSTEM_STEPS.map((s) => (
            <li key={s.n}>
              <h3>Step {s.n} · {s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
        <p>One strategist. One calendar. One approval window.</p>
        <p>03 — What we do</p>
        <h2 id="services-heading">Create the content. Distribute it. Amplify what works.</h2>
        {SERVICES.map((s) => (
          <div key={s.key}>
            <h3>{s.title}</h3>
            <ul>{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </div>
        ))}
        <p>Start with consistent content. Add media only where it improves the business result.</p>
      </div>
    </section>
  );
}
