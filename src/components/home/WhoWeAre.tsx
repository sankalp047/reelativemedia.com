"use client";

import { useEffect, useRef } from "react";
import { Kinetic } from "@/components/ui/Kinetic";
import { Marker } from "@/components/ui/Marker";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SITE } from "@/lib/site";
import { WHO_WE_ARE } from "@/lib/who-we-are";

/**
 * The introduction: a looping clip on the left, who we are on the right.
 *
 * It sits between the hero and the reels, so it is the first thing that
 * explains the business in words. Everything below it is evidence.
 *
 * THE GROUND IS MIDNIGHT, and that is a rhythm decision rather than a taste
 * one. The hero above is dark and the reel band below is cloud, so a dark band
 * here gives one continuous opening before the page steps into light. Making
 * it light instead would put two pale bands against each other and the seam
 * would disappear.
 *
 * THE VIDEO AUTOPLAYS, WHICH BROWSERS ONLY ALLOW ON THREE CONDITIONS: muted,
 * playsInline, and a user-gesture-free policy that every engine grants to
 * silent video. All three are set, and `muted` is also assigned on the element
 * in an effect because React has historically dropped the attribute on
 * hydration, which is enough for Safari to refuse to start.
 *
 * It also pauses whenever it is off screen. A loop that keeps decoding while
 * someone reads the pricing section four bands down is spending battery on
 * nothing, and on a phone that is the difference people feel as "this site is
 * heavy".
 *
 * REDUCED MOTION GETS THE POSTER AND NO PLAYBACK. A looping clip is exactly the
 * kind of unrequested movement that setting exists to stop.
 */

const ASPECT: Record<string, string> = {
  "9/16": "177.78%",
  "4/5": "125%",
  "16/9": "56.25%",
  "1/1": "100%",
};

export function WhoWeAre() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Assigned here as well as in JSX: React has dropped `muted` on hydration
    // before, and an unmuted autoplay is simply refused.
    v.muted = true;
    v.defaultMuted = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }

    const play = () => void v.play().catch(() => {});
    if (v.readyState >= 2) play();
    else v.addEventListener("loadeddata", play, { once: true });

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : v.pause()), {
      threshold: 0.05,
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="who-we-are"
      data-ground="dark"
      className="relative z-10 bg-midnight section-pad"
      aria-labelledby="who-we-are-heading"
    >
      <div className="wrap">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* THE CLIP. Order is explicit so it leads on desktop but falls
              BELOW the copy on phones: on a narrow screen the words are what
              earn the scroll, and a tall video above them pushes every one of
              them off the first screen. */}
          <Reveal className="order-2 lg:order-1">
            {/* CAPPED WIDTH. A 9:16 clip given the full half-column would be
                over 1100px tall on a wide screen and tower over the copy beside
                it. Held near phone width it reads as a phone, which is the
                right note for a reels agency, and the two columns balance. */}
            <div className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-[2px] border border-edge-dark bg-well lg:mx-0 lg:max-w-[370px]">
              <div style={{ paddingTop: ASPECT[WHO_WE_ARE.aspect] }} aria-hidden="true" />
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                poster={WHO_WE_ARE.poster}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                aria-hidden="true"
                tabIndex={-1}
              >
                <source src={WHO_WE_ARE.src} type="video/mp4" />
              </video>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Marker tone="dark" className="mb-5">
              {WHO_WE_ARE.eyebrow}
            </Marker>
            <Kinetic
              as="h2"
              text={WHO_WE_ARE.lines.join("\n")}
              className="t-h2 !text-[clamp(28px,3.2vw,52px)] text-cloud"
              accent={[1]}
            />
            <span id="who-we-are-heading" className="sr-only">
              Who we are
            </span>

            <Reveal delay={0.1}>
              <p className="t-lead mt-6 text-slate">{WHO_WE_ARE.lead}</p>
            </Reveal>

            <Reveal delay={0.16}>
              <ul className="mt-8 flex flex-col border-t border-rule-dark">
                {WHO_WE_ARE.points.map((p, i) => (
                  <li key={p} className="flex gap-4 border-b border-rule-dark py-3.5">
                    {/* A counting sequence is the one place the accent repeats. */}
                    <span className="mono shrink-0 pt-1 text-pink">
                      [{String(i + 1).padStart(2, "0")}]
                    </span>
                    <span className="t-body !text-[15px] text-cloud">{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href={SITE.phoneTel} aria-label={`Call ${SITE.phone}`}>
                  Call us
                </ButtonLink>
                <ButtonLink href="#segments" variant="secondary">
                  See the work <span aria-hidden="true">↓</span>
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
