"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { preload } from "react-dom";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { Kinetic } from "@/components/ui/Kinetic";
import { Marker } from "@/components/ui/Marker";
import { GridRules } from "@/components/ui/GridRules";

/**
 * The card opens up: the hero montage starts as a framed card on the ground and
 * is un-cropped to full bleed as you scroll, with the wordmark scaling over it.
 */
export function Hero() {
  preload("/posters/hero-16x9.jpg", { as: "image", fetchPriority: "high" });

  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  /** Phone bottom inset, as a % of viewport height. Measured, not guessed —
   *  see the comment on insetBottom below. */
  const [phoneInsetBottom, setPhoneInsetBottom] = useState(34);
  /** The copy rail's height as a % of the viewport. Everything about how the
   *  hero fits is derived from this one measurement. */
  const [railPct, setRailPct] = useState(30);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // The copy rail's height is fixed in PIXELS (a label, two lines of body and
  // one or two buttons) but the card's insets are PERCENTAGES, so any single
  // percentage is wrong at some viewport height. Measured, not guessed.
  //
  // This runs at EVERY width, not just phones. Phone landscape (844x390) is not
  // `narrow` — it takes the 12% desktop inset — and there the rail overlapped
  // the card by ~70px. Short desktop windows do the same.
  useEffect(() => {
    const measure = () => {
      const h = copyRef.current?.offsetHeight ?? 0;
      const vh = window.innerHeight || 1;
      /* +28 rather than +16: 16px cleared the rail's box but left the card
         sitting almost on the text. This is the visible gap between the bottom
         of the card and the top of the rail, so it wants to be a real margin,
         not a rounding allowance. */
      const pct = ((h + 28) / vh) * 100;
      setRailPct(pct);
      setPhoneInsetBottom(Math.min(52, Math.max(30, Math.round(pct))));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* Past ~55% of the viewport there is no card left worth cropping — a letterbox
     sliver of video reads worse than no crop at all. The hero then gives up on
     the card, goes full bleed, and the copy rail sits ON the footage, so it has
     to take the dark-ground tones.
     This is also true under prefers-reduced-motion, whose paint path has always
     been inset(0%): the rail was graphite-on-footage for those users. */
  const onVideo = Boolean(reduce) || railPct > 55;

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end start"] });

  // Card → full bleed over the first 55% of the scroll through the hero.
  // On phones the card is nearly full width, so the bottom inset is deeper to
  // keep the copy rail on paper instead of on top of the video.
  const insetX = narrow ? 5 : 25;
  const insetTop = narrow ? 6 : 12;
  /* The measured rail ALWAYS wins on desktop, never a flat fallback.
     This used to keep a flat 12% whenever railPct was under 30, on the theory
     that a card inset 25% left and right leaves the rail's copy in the margins
     beside it. That theory is wrong: at 1920x1100 the paragraph spans x 280-700
     and the card starts at x 480, so 220px of the copy sits under the card, and
     the buttons (x 1138-1640) sit under it too. With the flat 12% the card's
     bottom landed 22px INSIDE the rail's box, leaving 17px to the text — which
     reads as touching.
     max(12) keeps the old floor for a tall window with a short rail; min(46)
     stops a very short window from collapsing the card to a sliver. */
  const insetBottom = narrow ? phoneInsetBottom : Math.min(46, Math.max(12, Math.ceil(railPct)));
  const t = useTransform(scrollYProgress, [0, 0.55], [0, 1], { clamp: true });

  const headlineScale = useTransform(t, [0, 1], [1, 1.3]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.5], [0, -70]);


  // Scroll-scrubbed clip-path, frame box and opacities are written straight to
  // the DOM: in framer-motion 13 a MotionValue passed as style.opacity never
  // updates, while transforms do.
  useMotionValueEvent(copyOpacity, "change", (v) => {
    if (reduce) return;   // the rail does not fade for reduced-motion users
    if (copyRef.current) copyRef.current.style.opacity = String(v);
  });
  useMotionValueEvent(t, "change", (v) => {
    // Without this guard the un-crop still scrubbed while the card was meant to
    // be full bleed: the effect below paints that state once, then the first
    // scroll snapped the card back to its cropped inset and animated it open.
    if (onVideo) return;
    const x = insetX * (1 - v);
    const top = insetTop * (1 - v);
    const bottom = insetBottom * (1 - v);
    const r = 2 * (1 - v);
    if (clipRef.current) {
      clipRef.current.style.clipPath = `inset(${top}% ${x}% ${bottom}% ${x}% round ${r}px)`;
    }
    if (headRef.current) {
      headRef.current.style.top = `${top}%`;
      headRef.current.style.bottom = `${bottom}%`;
    }
    if (frameRef.current) {
      frameRef.current.style.top = `${top}%`;
      frameRef.current.style.bottom = `${bottom}%`;
      frameRef.current.style.left = `${x}%`;
      frameRef.current.style.right = `${x}%`;
      frameRef.current.style.borderRadius = `${r}px`;
      frameRef.current.style.opacity = String(1 - v);
    }
  });

  useEffect(() => {
    // Paint the starting crop before any scrolling happens.
    if (clipRef.current) {
      clipRef.current.style.clipPath = onVideo
        ? "inset(0% 0% 0% 0% round 0px)"
        : `inset(${insetTop}% ${insetX}% ${insetBottom}% ${insetX}% round 2px)`;
    }
    if (headRef.current) {
      // Full bleed still reserves the rail's band: the headline centres in what
      // is left above it rather than in the whole frame, or the two collide on
      // a short viewport.
      headRef.current.style.top = onVideo ? "0%" : `${insetTop}%`;
      headRef.current.style.bottom = onVideo ? `${Math.min(70, railPct)}%` : `${insetBottom}%`;
    }
    // No card means no frame around it.
    if (frameRef.current) {
      frameRef.current.style.opacity = onVideo ? "0" : "1";
      if (!onVideo) {
        frameRef.current.style.top = `${insetTop}%`;
        frameRef.current.style.bottom = `${insetBottom}%`;
        frameRef.current.style.left = `${insetX}%`;
        frameRef.current.style.right = `${insetX}%`;
      }
    }
  }, [insetX, insetTop, insetBottom, onVideo, railPct]);

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

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : v.pause()), { threshold: 0.05 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <div ref={wrapRef} id="top" className={reduce ? "relative h-svh" : "relative h-[190svh]"}>
      <section
        className="letterbox sticky top-0 h-svh overflow-hidden bg-midnight"
        // data-ground: the copy rail sits on midnight, and the outlined "What we
        // make" button takes its type from the ground — without this it was ink
        // on midnight, an empty box.
        data-ground="dark"
        // `letterbox` deliberately declares no `position` (see globals.css) so it
        // cannot beat the `sticky` class and un-pin the un-crop. The bars are
        // pseudo-elements and do not participate in layout.
        style={{ "--bar": "34px" } as CSSProperties}
        aria-label="Intro"
      >
        <GridRules className="opacity-60" />

        {/* Two soft spectrum glows in the margins beside the card — violet at
            the top left, pink at the right. They sit UNDER the clip layer, so
            the footage covers them where it is and the un-crop swallows them
            as the card goes full bleed. Plain radial gradients, no filter(): a
            blur on a 70vh element is a compositing cost for nothing. Both are
            placed clear of the copy rail and the top-right meta label, so no
            text ever sits on a tinted ground. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[12vw] -top-[18vh] h-[70vh] w-[70vh] rounded-full"
          style={{ background: "radial-gradient(circle at center, rgba(111,36,229,0.5) 0%, rgba(111,36,229,0) 64%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[14vw] top-[10vh] h-[76vh] w-[76vh] rounded-full"
          style={{ background: "radial-gradient(circle at center, rgba(244,67,148,0.42) 0%, rgba(244,67,148,0) 64%)" }}
        />

        {/* The video, cropped to a card then un-cropped */}
        <div ref={clipRef} className="absolute inset-0 will-change-[clip-path]">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
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
          {/* The scrim. A flat base plus a vertical gradient: 0.622 composite at
              the top label, 0.514 through the headline band, 0.773 at the copy
              rail. This is what carries the type, not a stroke on the glyphs. */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "rgba(20,18,14,0.46)" }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(20,18,14,0.30) 0%, rgba(20,18,14,0.10) 26%, rgba(20,18,14,0.10) 50%, rgba(20,18,14,0.58) 100%)",
            }}
            aria-hidden="true"
          />
        </div>

        {/* Hairline frame around the card — drawn against the dark video, so it
            is a light line. --color-rule would vanish here. */}
        <div
          ref={frameRef}
          className="pointer-events-none absolute border border-[rgba(244,241,234,0.22)]"
          style={{ borderRadius: 2 }}
          aria-hidden="true"
        />

        {/* Wordmark over the card */}
        <motion.div
          ref={headRef}
          className="pointer-events-none absolute inset-x-0 flex items-center justify-center px-4"
          style={reduce ? undefined : { scale: headlineScale }}
        >
          <Kinetic
            as="h1"
            text={"Content\npeople\nremember."}
            className="t-mega max-w-[min(88vw,1080px)] text-center text-cloud !text-[clamp(38px,7vw,132px)]"
            stagger={0.026}
            delay={0.15}
            // "remember." in the dark voice gradient. Its darkest stop is 5.59
            // on flat midnight and 3.3 over the measured worst-case scrim.
            accent={[2]}
          />
        </motion.div>

        {/* Copy rail at the bottom. NOTE: this sits on MIDNIGHT, not on the
            video — it is below and left of the cropped card, and copyOpacity
            fades it to 0 over the first 28% of scroll, so it is gone before the
            card un-crops to full bleed. Slate type; the section carries
            data-ground="dark", so the outlined button takes cloud. */}
        <motion.div
          ref={copyRef}
          className="wrap pointer-events-none absolute inset-x-0 bottom-0 pb-[58px]"
          style={reduce ? undefined : { y: copyY }}
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="pointer-events-auto max-w-[420px]">
              <Marker tone="dark" className="mb-4">A FunAsia company · DFW</Marker>
              <p className={`t-body ${onVideo ? "text-cloud" : "text-slate"}`}>
                Short-form reels, smarter distribution and measurable growth for DFW businesses.
              </p>
            </div>
            <div className="pointer-events-auto flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <ButtonLink href="#audit">Book your content audit</ButtonLink>
              <ButtonLink href="#work" variant={onVideo ? "invert" : "secondary"}>
                What we make <span aria-hidden="true">↓</span>
              </ButtonLink>
            </div>
          </div>
        </motion.div>

        {/* A "Loop:[on] · Sound:[none]" label used to sit at the top right. It
            described the video player rather than the business, so it spent the
            most valuable corner of the page on a caption nobody needed. */}
      </section>
    </div>
  );
}
