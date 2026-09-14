"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import { EXPO, lineMask, stagger } from "@/lib/motion";

const H1_LINES = ["Content people", "remember."];

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      {muted ? (
        <>
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      ) : (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M19 5a9 9 0 0 1 0 14" />
        </>
      )}
    </svg>
  );
}

export function Hero() {
  preload("/posters/hero-16x9.jpg", { as: "image", fetchPriority: "high" });

  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end start"] });
  // Sticky phase is progress 0 → 0.33 (wrapper is 150svh, hero 100svh). The frame
  // shrinks into a rounded card (the "cut"), then parallaxes away at 0.8× speed.
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const radius = useTransform(scrollYProgress, [0, 0.3], [0, 32]);
  const dim = useTransform(scrollYProgress, [0.05, 0.3], [0, 0.55]);
  const videoY = useTransform(scrollYProgress, [0.3, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 0.28], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Opacity is written straight to the DOM (scroll-scrubbed values, no re-render).
  useMotionValueEvent(dim, "change", (v) => {
    if (dimRef.current) dimRef.current.style.opacity = String(v);
  });
  useMotionValueEvent(contentOpacity, "change", (v) => {
    if (contentRef.current) contentRef.current.style.opacity = String(v);
  });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    if (reduce) {
      v.pause();
      return;
    }
    const play = () => v.play().catch(() => {});
    if (v.readyState >= 2) play();
    else v.addEventListener("loadeddata", play, { once: true });

    // Pause while off-screen to save battery.
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? play() : v.pause()),
      { threshold: 0.05 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  return (
    <div ref={wrapRef} id="top" className={reduce ? "relative h-svh" : "relative h-[130svh] lg:h-[150svh]"}>
      <section className="sticky top-0 h-svh overflow-hidden" aria-label="Intro">
        <motion.div
          className="absolute inset-0 overflow-hidden bg-base"
          style={reduce ? undefined : { scale, borderRadius: radius }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div className="absolute inset-0" style={reduce ? undefined : { y: videoY }}>
            <video
              ref={videoRef}
              className="h-full w-full scale-[1.06] object-cover"
              poster="/posters/hero-16x9.jpg"
              muted
              loop
              playsInline
              preload="metadata"
              autoPlay={!reduce}
              aria-hidden="true"
              tabIndex={-1}
            >
              <source src="/video/hero-9x16.mp4" media="(max-aspect-ratio: 3/4)" type="video/mp4" />
              <source src="/video/hero-16x9.mp4" type="video/mp4" />
            </video>
          </motion.div>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,15,0.15) 0%, rgba(10,10,15,0.05) 35%, rgba(10,10,15,0.55) 62%, rgba(10,10,15,0.92) 100%)",
            }}
            aria-hidden="true"
          />
          <div ref={dimRef} className="pointer-events-none absolute inset-0 bg-base" style={{ opacity: 0 }} aria-hidden="true" />
        </motion.div>

        <div className="wrap pointer-events-none absolute inset-x-0 top-24">
          <PlaceholderTag>Placeholder montage · real reel montage pending</PlaceholderTag>
        </div>

        <motion.div
          ref={contentRef}
          className="wrap relative flex h-full flex-col justify-end pb-24 md:pb-28"
          style={reduce ? undefined : { y: contentY }}
        >
          <motion.div initial={reduce ? false : "hidden"} animate="show" variants={stagger(0.12, 0.5)}>
            <motion.p className="eyebrow mb-6" variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EXPO } } }}>
              <span className="inline-flex flex-wrap gap-x-4 gap-y-2">
                <span>A FunAsia company</span>
                <span aria-hidden="true">·</span>
                <span>Dallas–Fort Worth</span>
              </span>
            </motion.p>
            <h1 className="t-display">
              {H1_LINES.map((line) => (
                <span key={line} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                  <motion.span className="block" variants={lineMask}>
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              className="mt-7 max-w-[560px] text-[18px] leading-[1.55] text-muted md:text-[20px]"
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EXPO } } }}
            >
              Short-form reels, smarter distribution and measurable growth for DFW businesses.
            </motion.p>
            <motion.div
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EXPO } } }}
            >
              <ButtonLink href="#audit">Book your content audit</ButtonLink>
              <ButtonLink href="#work" variant="secondary">
                Watch the work <span aria-hidden="true">↓</span>
              </ButtonLink>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex" aria-hidden="true">
          <span className="mono text-[10px] text-muted">Scroll</span>
          <span className="block h-12 w-px overflow-hidden bg-white/10">
            <span className="block h-full w-full origin-top bg-white/70 animate-scroll-cue" />
          </span>
        </div>

        <button
          type="button"
          onClick={toggleSound}
          className="chip absolute bottom-8 right-6 z-10 !py-2.5 lg:right-10"
          aria-pressed={!muted}
          aria-label={muted ? "Unmute hero video" : "Mute hero video"}
        >
          <SoundIcon muted={muted} />
          <span>Sound:[{muted ? "off" : "on"}]</span>
        </button>
      </section>
    </div>
  );
}
