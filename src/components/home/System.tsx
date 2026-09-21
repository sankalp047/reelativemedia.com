"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Marker } from "@/components/ui/Marker";
import { RigScrub } from "@/components/home/RigScrub";
import { Kinetic } from "@/components/ui/Kinetic";
import { SYSTEM_CLOSING, SYSTEM_STEPS } from "@/lib/data";

/**
 * Information on the left, the footage on the right, sized to one screen on
 * desktop. The same runway drives both: the four steps light up as you scroll,
 * and the rig sequence scrubs frame by frame alongside them — the camera glides
 * in from the right, crosses to the left, and the television, tablet and phone
 * arrive in the space it vacates.
 *
 * The section's ground is --color-studio rather than the page's alabaster. That
 * is the backdrop the footage was lit on, measured and flattened at build time,
 * so the sequence has no visible frame against the page and reads as objects on
 * the page rather than a video in a box. The two grounds are the same
 * luminance, so this is a hue shift, not a band.
 *
 * THE FOOTAGE IS DESKTOP ONLY. It was tried on phones as a sticky background
 * behind the copy and it did not work: the frame is 1:1, so on a 375x812 screen
 * it can only ever fill the width — a third of the height — and the copy is
 * taller than the viewport, so it covered the footage as soon as it scrolled up.
 * Phones get the copy on its own, which is the part that carries the meaning.
 * Do not reintroduce it here without portrait source; cropping the square to fit
 * takes 218px off each side and loses the rig and the screens.
 *
 * One DOM tree serves both layouts and the copy is never duplicated — a second
 * mobile copy would repeat the heading and its id.
 *
 * Step collapsing is CSS-driven: on phones every step stays open, because there
 * is no pinned pane to drive a step-by-step reveal.
 *
 * No overflow-hidden anywhere up this tree — it would become the scroll
 * container for the sticky pane and break it.
 *
 * Deliberately no asset counters. The retired video showed "12 reels", a number
 * from the superseded deck that overstates every package in the current one.
 */
const DESKTOP = "(min-width: 1024px)";
const subscribeDesktop = (cb: () => void) => {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getDesktop = () => window.matchMedia(DESKTOP).matches;

export function System() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const [scrubbed, setScrubbed] = useState(0);
  const isDesktop = useSyncExternalStore(subscribeDesktop, getDesktop, () => false);

  // Phones have no pane to scrub, so they show the finished schedule and every
  // step open. Derived rather than written to state, which keeps the effect free
  // of a synchronous setState.
  const step = isDesktop ? scrubbed : SYSTEM_STEPS.length - 1;

  useEffect(() => {
    const runway = runwayRef.current;
    if (!runway || !isDesktop) return;

    const sync = () => {
      const r = runway.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / total));
      setScrubbed(Math.min(SYSTEM_STEPS.length - 1, Math.floor(p * SYSTEM_STEPS.length)));
    };

    // Deferred so the first read is not a synchronous setState in the effect.
    const raf = requestAnimationFrame(sync);
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [isDesktop]);

  return (
    <section id="system" className="relative z-10 bg-studio" aria-labelledby="system-heading">
      <div ref={runwayRef} className="relative lg:h-[340vh]">
        <div className="section-pad relative z-10 lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:py-0">
          {/* h-full on desktop so the pane has the whole viewport height to fill
              rather than only the copy column's height. items-center still
              centres the copy; the pane opts out with self-stretch. */}
          <div className="wrap grid w-full items-center gap-10 lg:h-full lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] xl:gap-16">
            <div className="flex flex-col">
              <Marker className="mb-5">01 — The system</Marker>
              <Kinetic
                as="h2"
                text={"One focused shoot can\npower your whole month."}
                className="t-h2 !text-[clamp(26px,2.7vw,42px)] text-ink"
              />
              <span id="system-heading" className="sr-only">The system</span>
              <p className="t-lead mt-6 text-graphite">
                We plan the stories before the camera arrives, so every minute of capture produces usable content.
              </p>

              <ol className="mt-8 flex flex-col border-t border-rule">
                {SYSTEM_STEPS.map((s, i) => {
                  const on = i === step;
                  return (
                    <li key={s.n} className="border-b border-rule">
                      <div
                        className={`flex gap-4 border-l-2 py-3 pl-4 transition-colors duration-500 lg:py-2.5 ${
                          on ? "border-cognac text-ink" : "border-transparent lg:text-slate"
                        }`}
                        aria-current={on ? "step" : undefined}
                      >
                        <span className="num w-6 shrink-0 pt-0.5 text-[14px]">{s.n}</span>
                        <div className="min-w-0">
                          <h3 className="t-h3">{s.title}</h3>
                          {/* Open on phones, collapsed on desktop unless active */}
                          <div className={on ? "" : "lg:hidden"}>
                            <p className="t-body mt-2 !text-[15px]">{s.body}</p>
                            <p className="t-body mt-1 !text-[15px] text-graphite">{s.detail}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <p className="t-h2 mt-10 !text-[clamp(24px,2.4vw,34px)] text-ink">{SYSTEM_CLOSING}</p>
            </div>

            {/* self-stretch so the pane takes the row's full height, and
                bleed-right so it runs past the wrap's gutter to the edge of the
                window. The footage is anchored to that edge, so its shadow
                leaves the screen instead of stopping at a column boundary.
                hidden below lg: phones get no footage at all. */}
            <div className="hidden lg:block lg:self-stretch lg:bleed-right">
              <RigScrub runwayRef={runwayRef} scrub={isDesktop} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
