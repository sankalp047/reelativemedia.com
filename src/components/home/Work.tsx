"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MaskedLines } from "@/components/ui/Reveal";
import { ReelCard } from "@/components/home/ReelCard";
import type { LightboxItem } from "@/components/home/Lightbox";
import { CATEGORIES, REELS, type Category } from "@/lib/data";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const Lightbox = dynamic(() => import("@/components/home/Lightbox"), { ssr: false });

type Filter = "All" | Category;
const FILTERS: Filter[] = ["All", ...CATEGORIES];
const TICKS = Array.from({ length: 48 });

export function Work() {
  const [filter, setFilter] = useState<Filter>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const reels = useMemo(() => (filter === "All" ? REELS : REELS.filter((r) => r.category === filter)), [filter]);
  const items: LightboxItem[] = useMemo(
    () =>
      reels.map((r) => ({
        id: r.id,
        src: r.src,
        poster: r.poster,
        title: r.client,
        meta: `${r.category.toUpperCase()} [${r.duration}] · ${r.city.toUpperCase()}`,
      })),
    [reels],
  );

  const setProgress = (p: number) => {
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
    if (counterRef.current) {
      const n = Math.min(reels.length, Math.max(1, Math.round(p * (reels.length - 1)) + 1));
      counterRef.current.textContent = `${String(n).padStart(2, "0")} / ${String(reels.length).padStart(2, "0")}`;
    }
  };

  // Desktop: pin the section and scrub the track horizontally.
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    setProgress(0);

    const mm = gsap.matchMedia();
    mm.add(
      { desktop: "(min-width: 1024px)", reduce: "(prefers-reduced-motion: reduce)" },
      (ctx) => {
        const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
        if (!desktop || reduce) return;

        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 40);

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(distance(), window.innerHeight * 1.5)}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (st) => setProgress(st.progress),
          },
        });
      },
    );

    // Give fonts/layout a beat to settle, then measure.
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      window.clearTimeout(t);
      mm.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reels.length]);

  // Mobile: mirror native scroll position into the ruler.
  const onTrackScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    const el = e.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="work"
        className="relative z-10 flex min-h-svh flex-col justify-center overflow-hidden bg-base py-20 lg:h-svh lg:py-0"
        aria-labelledby="work-heading"
      >
        <div className="wrap flex flex-col lg:pt-[calc(var(--nav-h)+8px)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Eyebrow>01 — The work</Eyebrow>
              <span className="mono hidden text-muted/60 xl:inline">· Works({REELS.length})</span>
            </div>
            <div className="no-scrollbar -mx-6 flex gap-2 overflow-x-auto px-6 lg:mx-0 lg:px-0" role="group" aria-label="Filter reels">
              {FILTERS.map((f) => (
                <button key={f} type="button" className="chip" data-active={filter === f} onClick={() => setFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <MaskedLines
            as="h2"
            lines={["Built for businesses people", "can see, visit and trust."]}
            className="t-h2 mt-5 !text-[clamp(34px,4.2vw,60px)]"
          />
          <span id="work-heading" className="sr-only">
            The work
          </span>
        </div>

        <div className="relative mt-8 lg:mt-8" data-cursor="DRAG">
          <div
            ref={trackRef}
            onScroll={onTrackScroll}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 pt-6 lg:snap-none lg:gap-6 lg:overflow-visible lg:px-10 lg:pb-6 lg:pt-4"
            style={{ scrollPaddingLeft: 24 }}
          >
            {reels.map((reel, i) => (
              <ReelCard
                key={reel.id}
                reel={reel}
                onOpen={() => setLightbox(i)}
                className="w-[78vw] snap-center sm:w-[52vw] md:w-[40vw] lg:h-[min(640px,calc(100svh-420px))] lg:w-auto"
              />
            ))}
            <div className="hidden shrink-0 self-stretch lg:block lg:w-[40vw]" aria-hidden="true">
              <div className="flex h-full flex-col justify-center pr-10">
                <p className="t-h3 max-w-[14ch]">That is a month of content from one shoot.</p>
                <a href="#audit" className="link-underline mt-6 self-start text-[16px] font-semibold">
                  See all work →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Ruler */}
        <div className="wrap mt-6 flex items-center gap-5 lg:mt-2 lg:pb-6">
          <span className="mono w-[7ch] text-muted">
            <span ref={counterRef}>01 / {String(reels.length).padStart(2, "0")}</span>
          </span>
          <div className="relative flex h-6 flex-1 items-end gap-[6px] overflow-hidden" aria-hidden="true">
            {TICKS.map((_, i) => (
              <span key={i} className={`w-px shrink-0 bg-white/20 ${i % 6 === 0 ? "h-4" : "h-2"}`} />
            ))}
            <div ref={fillRef} className="absolute bottom-0 left-0 h-px w-full origin-left bg-white" style={{ transform: "scaleX(0)" }} />
          </div>
          <span className="mono hidden text-muted/70 md:inline">
            <span className="hidden lg:inline">Scroll:[drag]</span>
            <span className="lg:hidden">Swipe:[→]</span>
          </span>
          <a href="#audit" className="link-underline text-[15px] font-semibold lg:hidden">
            See all work →
          </a>
        </div>
      </section>

      <Lightbox items={items} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
    </>
  );
}
