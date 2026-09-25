"use client";

import { useEffect, useRef, useState } from "react";
import { Marker } from "@/components/ui/Marker";
import { Kinetic } from "@/components/ui/Kinetic";
import { GridRules } from "@/components/ui/GridRules";
import { SEGMENTS, SEGMENTS_NOTE } from "@/lib/data";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * The business types as a 35mm contact strip unrolling out of a film canister.
 *
 * Desktop: the canister is fixed at the left and the film scrubs horizontally
 * behind it while the section is pinned.
 * Phones: the canister lies on its side at the top and the film unrolls
 * vertically beneath it, riding the page's own scroll.
 *
 * Frames are 3:2, the real 35mm ratio.
 *
 * The section stands on CLOUD, the light band, and this is the whole argument
 * for keeping light bands at all: the film is the darkest thing the site owns
 * (#08080A), and on the midnight page it measures 1.02:1 — no edge, a hole cut
 * in the screen. On the cloud band the strip becomes an object, the sprockets
 * become holes with the table showing through them, and the footage is the only
 * colour on screen. Do not move this section onto a dark ground.
 */

/* The film stock itself. The VALUE IS UNCHANGED — only the name moved, because
   `INK` now collides with --color-ink, which is dark type on a light ground, and
   `background: INK` on a midnight page reads as a mistake. Against the midnight
   page ground this stock sits at 1.02:1 and the strip is a hole cut in the
   screen; on the cloud band it is 18.97:1 and reads as 35mm on a light table. */
const STOCK = "#08080A";

/* ---------------- desktop geometry ---------------- */
const FRAME_H = 262;
const RAIL_H = 24;
/** Labels and padding stacked above and below the frame, inside the black. */
const FILM_CHROME = 52;
const FILM_H = RAIL_H * 2 + FRAME_H + FILM_CHROME;

/* Canister render, trimmed to its opaque bounds. Body only, no film tab, so it
   centres on the film and the strip carries its own blank leader. */
const CANISTER_RATIO = 0.456;
const CANISTER_H = 490;
const CANISTER_W = Math.round(CANISTER_H * CANISTER_RATIO);
const CANISTER_LEFT = 40;
/* The cap sits on top of the body, so centring the image on the film leaves the
   body reading low. Nudge up by roughly half the cap's share of the height. */
const CANISTER_OPTICAL_LIFT = 30;
const CANISTER_TOP = Math.round((FILM_H - CANISTER_H) / 2) - CANISTER_OPTICAL_LIFT;
const CANISTER_OVERHANG = Math.round((CANISTER_H - FILM_H) / 2) + CANISTER_OPTICAL_LIFT;
const STRIP_TOP_GAP = CANISTER_OVERHANG + 18;
/* The film is clipped just inside the canister's right edge, so as it scrubs
   left it disappears into the canister instead of running out the other side. */
const CANISTER_RIGHT = CANISTER_LEFT + CANISTER_W;
const FILM_CLIP_LEFT = CANISTER_RIGHT - 30;
const LEADER_W_LG = 80;
const CLOSER_W = 430;

/* ---------------- phone geometry ----------------
   Measured off the render by brightness profile: the silver cap takes the first
   17% of the length and the felt lip the last 10%, leaving 73% of body. The film
   spans exactly that body so it reads as coming out of the canister's mouth
   rather than being wider than the canister itself. */
const CAP_FRAC = 0.17;
const FELT_FRAC = 0.1;
const BODY_FRAC = 1 - CAP_FRAC - FELT_FRAC;
/** Canister length on phones, as a share of the viewport. */
const CAN_LEN_M = "94vw";
const RAIL_W_M = 14;
const FRAME_PAD_M = 6;

const sprocketTile = (w: number, h: number) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect x="${(w - Math.min(18, w - 6)) / 2}" y="${(h - Math.min(14, h - 8)) / 2}" width="${Math.min(18, w - 6)}" height="${Math.min(14, h - 8)}" rx="3" fill="%23F7F9FC"/></svg>`,
  ).replace(/%2523/g, "%23");

const SPROCKETS_H = sprocketTile(34, RAIL_H);
const SPROCKETS_V = sprocketTile(RAIL_W_M, 26);

function RailH() {
  return (
    <div
      className="w-full shrink-0"
      style={{
        height: RAIL_H,
        backgroundColor: STOCK,
        /* A lit top edge and a shadowed bottom one turn a flat black bar into a
           stamped rail. box-shadow does not participate in layout, so the rail
           height and the track's scrollWidth are both unchanged. */
        boxShadow: "inset 0 1px 0 rgba(244,241,234,0.10), inset 0 -1px 0 rgba(0,0,0,0.9)",
        backgroundImage: `url("${SPROCKETS_H}")`,
        backgroundRepeat: "repeat-x",
        backgroundSize: `34px ${RAIL_H}px`,
      }}
      aria-hidden="true"
    />
  );
}

function CanisterImg({ w, h, fill = false }: { w: number; h: number; fill?: boolean }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // onError alone is not enough: if the request fails before React hydrates the
  // handler is attached too late. Check the decoded size on mount as well.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div
        className="placeholder-block flex flex-col items-center justify-center gap-2 rounded-[2px] text-center"
        style={fill ? { width: "100%", height: "100%" } : { width: w, height: h }}
        role="img"
        aria-label="Placeholder: Reelative film canister"
      >
        <span className="mono text-graphite">Canister</span>
        <span className="mono text-[10px] text-graphite">public/images/canister.png</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src="/images/canister.png"
      alt=""
      aria-hidden="true"
      width={w}
      height={h}
      onError={() => setFailed(true)}
      className="select-none object-contain"
      style={fill ? { width: "100%", height: "100%" } : { width: w, height: h }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Desktop                                                             */
/* ------------------------------------------------------------------ */

function DesktopStrip({
  trackRef,
  closerRef,
  onTrackScroll,
}: {
  trackRef: React.RefObject<HTMLDivElement | null>;
  closerRef: React.RefObject<HTMLDivElement | null>;
  onTrackScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      className="relative z-10 hidden shrink-0 lg:block"
      style={{ marginTop: STRIP_TOP_GAP }}
      data-cursor="DRAG"
    >
      {/* Two decorations, both out of flow, both zero risk. The hairline is the
          horizon the strip lies on: it runs full-bleed below the header block and
          the canister stands across it. The ellipse is the canister's contact
          shadow. Literals rather than derived values on purpose — this layer must
          never be mistaken for the strip's own measurements, and it can never be
          the reason a measurement moves. Both sit at z-0, under the film. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0" aria-hidden="true">
        <div className="absolute inset-x-0 h-px bg-rule" style={{ top: -26 }} />
        <div
          className="absolute"
          style={{
            left: -60,
            top: 358,
            width: 423,
            height: 80,
            background: "radial-gradient(50% 42% at 50% 50%, rgba(25,21,16,0.18), transparent 72%)",
          }}
        />
      </div>

      {/* Fixed canister. It cannot live inside the track: GSAP transforms that,
          and a transformed ancestor would carry it along. */}
      <div className="pointer-events-none absolute z-20" style={{ top: CANISTER_TOP, left: CANISTER_LEFT }}>
        <CanisterImg w={CANISTER_W} h={CANISTER_H} />
      </div>

      {/* Clipped just inside the canister so the film never runs out the left */}
      <div className="relative z-10 overflow-hidden pb-2" style={{ marginLeft: FILM_CLIP_LEFT }}>
        <div ref={trackRef} onScroll={onTrackScroll} className="no-scrollbar flex items-start motion-reduce:overflow-x-auto">
          <div className="flex shrink-0 flex-col">
            <RailH />
            <div className="flex" data-ground="dark" style={{ background: STOCK }}>
              <div className="shrink-0" style={{ width: LEADER_W_LG }} aria-hidden="true" />
              {SEGMENTS.map((s, i) => (
                <figure key={s.id} className="relative shrink-0 border-r-[3px] px-3 pb-2 pt-1.5 after:pointer-events-none after:absolute after:inset-0 after:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.9)]" style={{ background: STOCK, borderColor: STOCK }}>
                  {/* The name is the most useful line in the section, so it is the
                      brightest thing on the stock: cloud on #08080A is 18.97:1. The
                      index is the one sanctioned repeat of the accent — a counting
                      sequence reads as one instance, not ten. */}
                  <figcaption className="mono mb-1.5 flex items-center justify-between gap-4 text-[10px] text-cloud">
                    <span>{s.name}</span>
                    <span className="text-pink">[{String(i + 1).padStart(2, "0")}]</span>
                  </figcaption>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt=""
                    width={1080}
                    height={720}
                    loading="lazy"
                    className="block object-cover"
                    style={{ height: FRAME_H, width: FRAME_H * 1.5 }}
                  />
                  <p className="mono mt-1.5 text-[10px] text-steel">{s.reel}</p>
                </figure>
              ))}

              {/* The closing line is the last panel of the film, so the sprocket
                  rails run straight across it instead of it sitting on paper. */}
              <div ref={closerRef} className="flex shrink-0 flex-col justify-center px-10" style={{ width: CLOSER_W, background: STOCK }}>
                <p className="t-statement max-w-[13ch] !text-[clamp(24px,2.2vw,34px)] text-cloud">
                  One shoot covers every one of these.
                </p>
                <a href="#system" className="link-underline mt-6 inline-block self-start eyebrow text-pink">
                  See how the system works →
                </a>
              </div>
            </div>
            <RailH />

            {/* Captions on paper, under the film */}
            <div className="flex">
              <div className="shrink-0" style={{ width: LEADER_W_LG }} aria-hidden="true" />
              {/* The catalogue plate caption. The block's width is the figure
                  pitch and is load-bearing for alignment — untouched. Inside it,
                  three registers: an italic Bodoni plate number, the name as a
                  tracked label, and the promise as an actual sentence. */}
              {SEGMENTS.map((s, i) => (
                <div key={s.id} className="shrink-0 px-3 pt-2.5" style={{ width: FRAME_H * 1.5 + 27 }}>
                  <div className="h-px w-full bg-rule" aria-hidden="true" />
                  <div className="mt-2.5 flex items-baseline gap-2.5">
                    <span className="t-plate text-pewter">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mono text-[10px] text-pewter">{s.name}</span>
                  </div>
                  {/* t-body's own 62ch measure is 391px at 13px, which is inside
                      this block's 396px content box: every one of the ten
                      sentences sets on one line and the caption row stays a
                      uniform height. No max-width override needed. */}
                  <p className="t-body mt-1 !text-[13px] text-graphite">
                    {s.graphic}, then {s.action.toLowerCase()}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Phones                                                              */
/* ------------------------------------------------------------------ */

function MobileStrip({
  canisterRef,
  filmWrapRef,
  filmRef,
}: {
  canisterRef: React.RefObject<HTMLDivElement | null>;
  filmWrapRef: React.RefObject<HTMLDivElement | null>;
  filmRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      className="relative z-10 mt-5 lg:hidden"
      style={
        {
          "--can-len": CAN_LEN_M,
          "--can-thick": `calc(var(--can-len) * ${CANISTER_RATIO})`,
          "--film-w": `calc(var(--can-len) * ${BODY_FRAC})`,
          "--film-left": `calc(var(--can-len) * ${FELT_FRAC})`,
        } as React.CSSProperties
      }
    >
      {/* Canister and film share one centred column so the film always lines up
          with the canister's body, whatever the viewport width. */}
      <div className="mx-auto" style={{ width: "var(--can-len)" }}>
        <div
          ref={canisterRef}
          className="relative"
          style={{ width: "var(--can-len)", height: "var(--can-thick)", transform: "rotate(90deg)" }}
        >
          <div
            className="absolute left-1/2 top-1/2"
            style={{ width: "var(--can-thick)", height: "var(--can-len)", transform: "translate(-50%, -50%)" }}
          >
            <CanisterImg w={0} h={0} fill />
          </div>
        </div>

        {/* The film, exactly as wide as the canister body. The wrapper is the
            window it gets pulled through; the inner strip is what moves. */}
        <div
          ref={filmWrapRef}
          className="-mt-3"
          style={{ marginLeft: "var(--film-left)", width: "var(--film-w)" }}
        >
        {/* column-reverse: the leader is the first thing pulled out so it ends
            up hanging lowest, with each later frame emerging above it. Source
            order stays 01→10 for reading and assistive tech. */}
        <div ref={filmRef} className="relative flex flex-col-reverse" data-ground="dark" style={{ background: STOCK }}>
          <div
            className="order-first"
            style={{ height: 52, background: STOCK, clipPath: "polygon(0 0, 66% 0, 100% 38%, 100% 100%, 0 100%)" }}
            aria-hidden="true"
          />

          {(["left", "right"] as const).map((side) => (
            <div
              key={side}
              className="absolute top-0 z-10 h-full"
              style={{
                [side]: 0,
                width: RAIL_W_M,
                backgroundImage: `url("${SPROCKETS_V}")`,
                backgroundRepeat: "repeat-y",
                backgroundSize: `${RAIL_W_M}px 26px`,
              }}
              aria-hidden="true"
            />
          ))}

          <div
            className="flex flex-col-reverse"
            style={{ paddingLeft: RAIL_W_M + FRAME_PAD_M, paddingRight: RAIL_W_M + FRAME_PAD_M }}
          >
            {SEGMENTS.map((s, i) => (
              <figure key={s.id} className="relative pb-4 after:pointer-events-none after:absolute after:inset-0 after:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.9)]">
                <figcaption className="mono mb-1 flex items-center justify-between gap-2 text-[9px] text-cloud">
                  <span>{s.name}</span>
                  <span className="text-pink">[{String(i + 1).padStart(2, "0")}]</span>
                </figcaption>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt=""
                  width={1080}
                  height={720}
                  loading="lazy"
                  className="block w-full object-cover"
                  style={{ aspectRatio: "3 / 2" }}
                />
                <p className="mono mt-1 text-[9px] text-slate">{s.reel}</p>
                <p className="t-body mt-1 !text-[12px] text-steel">
                  {s.graphic} · {s.action}
                </p>
              </figure>
            ))}

            <div className="border-t border-rule-dark pb-9 pt-7">
              <p className="t-statement max-w-[14ch] !text-[26px] text-cloud">One shoot covers every one of these.</p>
              <a href="#system" className="link-underline mt-5 inline-block eyebrow text-pink">
                See how the system works →
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function FilmStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const closerRef = useRef<HTMLDivElement>(null);
  const canisterRef = useRef<HTMLDivElement>(null);
  const filmWrapRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const setProgress = (p: number) => {
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
    if (counterRef.current) {
      const n = Math.min(SEGMENTS.length, Math.max(1, Math.round(p * (SEGMENTS.length - 1)) + 1));
      counterRef.current.textContent = `${String(n).padStart(2, "0")} / ${String(SEGMENTS.length).padStart(2, "0")}`;
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    setProgress(0);

    const mm = gsap.matchMedia();

    // Desktop: pin and scrub the film sideways.
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current;
      if (!track) return;

      // Scrub until the closing panel is centred on screen, not until the film
      // runs out. Ending on scrollWidth left it parked against the right edge
      // and the section handed over to Packages while it was still half read.
      const distance = () => {
        const closer = closerRef.current;
        if (!closer) return Math.max(0, track.scrollWidth - window.innerWidth + 60);
        const tx = Number(gsap.getProperty(track, "x")) || 0;
        const r = closer.getBoundingClientRect();
        const restLeft = r.left - tx;
        return Math.max(0, Math.round(restLeft + r.width / 2 - window.innerWidth / 2));
      };
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(distance(), window.innerHeight * 1.5)}`,
          pin: true,
          scrub: 1,
          /* NO anticipatePin. It pins EARLY, using predicted scroll velocity to
             hide the one-frame flicker native scrolling can show as an element
             becomes position:fixed. Lenis does not scroll natively — it
             interpolates toward a target and drives ScrollTrigger.update itself
             — so there is no flicker to hide, and the prediction overshoots.
             Measured at 1440x900: the pin engaged 68px early and the section
             snapped 85px in a single frame while the scroll advanced 17px, a
             5:1 jump landing hard at top:0. That is the "comes from below and
             is suddenly there" artefact. Without it the pin lands on the
             frame the scroll actually reaches it. */
          invalidateOnRefresh: true,
          onUpdate: (st) => setProgress(st.progress),
        },
      });
    });

    // Phones: the canister tips in, then the section pins while the film
    // unrolls out of it. Once the film has come out the pin releases and the
    // page travels on down the strip.
    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      const can = canisterRef.current;
      const film = filmRef.current;
      if (!can || !film) return;

      gsap.fromTo(
        can,
        { rotate: 52, scale: 0.7, yPercent: -30 },
        {
          rotate: 90,
          scale: 1,
          yPercent: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top 38%",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        },
      );

      // A true carousel: the canister and the window below it stay put while
      // the whole strip travels downward through the window. Each frame emerges
      // at the canister's mouth, crosses the screen and leaves at the bottom,
      // so the film is visibly pulled out rather than unveiled in place.
      //
      // The strip is laid out column-reverse, so its lowest element is the
      // leader. Moving the strip DOWN therefore brings frame 01 out first and
      // the rest in order. Laid out normally, downward travel ran the film
      // backwards.
      const wrap = filmWrapRef.current;
      if (!wrap) return;

      let reveal = 0;
      let filmH = 0;
      const measure = () => {
        const wrapTop = wrap.getBoundingClientRect().top - section.getBoundingClientRect().top;
        reveal = Math.max(280, Math.round(window.innerHeight - wrapTop - 12));
        wrap.style.height = `${reveal}px`;
        wrap.style.overflow = "hidden";
        filmH = film.scrollHeight;
      };
      // At rest the strip sits entirely above the window: all you see is the
      // empty canister.
      const travelTo = (p: number) => {
        film.style.transform = `translate3d(0, ${Math.round(-filmH + p * filmH)}px, 0)`;
      };

      measure();
      travelTo(0);

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max(filmH, window.innerHeight)}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          measure();
          travelTo(self.progress);
        },
        onUpdate: (self) => travelTo(self.progress),
      });
    });

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      window.clearTimeout(t);
      mm.revert();
    };
  }, []);

  const onTrackScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative z-10 flex min-h-svh flex-col overflow-hidden bg-cloud pb-16 pt-10 lg:h-svh lg:justify-center lg:py-0"
      aria-labelledby="strip-heading"
    >
      <GridRules className="z-0 opacity-50" />

      <div className="wrap relative z-10 flex shrink-0 flex-col lg:pt-[calc(var(--nav-h)+40px)]">
        <Marker className="self-start">03 — What we make</Marker>

        {/* DESKTOP: the headline indents to column 4 and the note sits hard
            right on its first baseline. The width between and below them stays
            empty — on a light ground that emptiness is the whole effect, so
            resist filling it.

            PHONES: the opposite. Both measures are uncapped, because there is
            only one column and a 16ch headline on a 430px screen left 29% of
            the width unused and pushed the text onto a third line, which in
            turn pushed the canister and the film that much further down the
            screen. The caps are therefore scoped to lg and up, where the
            twelve-column grid is what controls the measure anyway. */}
        <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 lg:mt-8 lg:grid-cols-12 lg:gap-y-4">
          <Kinetic
            as="h2"
            text={"Built for businesses people can see, visit and trust."}
            className="t-h2 text-ink !text-[clamp(30px,4.2vw,64px)] lg:col-span-5 lg:col-start-4 lg:max-w-[16ch]"
            stagger={0.014}
          />
          <p className="t-body !max-w-none !text-[13px] text-pewter lg:col-span-3 lg:col-start-10 lg:mt-[clamp(10px,calc(3.36vw_-_14px),37px)] lg:!max-w-[32ch] lg:justify-self-end lg:text-right">
            {SEGMENTS_NOTE}
          </p>
        </div>
        <span id="strip-heading" className="sr-only">What we make</span>
      </div>

      <DesktopStrip trackRef={trackRef} closerRef={closerRef} onTrackScroll={onTrackScroll} />
      <MobileStrip canisterRef={canisterRef} filmWrapRef={filmWrapRef} filmRef={filmRef} />

      {/* Ruler tracks the horizontal scrub, so it is desktop only */}
      <div className="wrap relative z-10 mt-3 hidden shrink-0 items-center gap-5 lg:flex">
        {/* w-[7ch] is kept as a second belt over `num`'s tabular figures: the
            counter ticks live and must not reflow the rule beside it. */}
        <span className="num w-[7ch] shrink-0 text-[13px] text-ink">
          <span ref={counterRef}>01 / {String(SEGMENTS.length).padStart(2, "0")}</span>
        </span>
        <div className="relative flex h-5 flex-1 items-end gap-[6px] overflow-hidden" aria-hidden="true">
          {Array.from({ length: 52 }).map((_, i) => (
            <span
              key={i}
              className={`w-px shrink-0 ${i % 6 === 0 ? "h-3.5 bg-edge" : "h-1.5 bg-rule"}`}
            />
          ))}
          <div ref={fillRef} className="absolute bottom-0 left-0 h-px w-full origin-left bg-brand" style={{ transform: "scaleX(0)" }} />
        </div>
        <span className="mono shrink-0 text-pewter">Drag or scroll</span>
      </div>
    </section>
  );
}
