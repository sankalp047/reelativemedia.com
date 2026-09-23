"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Marker } from "@/components/ui/Marker";
import { RigScrub } from "@/components/home/RigScrub";
import { Kinetic } from "@/components/ui/Kinetic";
import { SYSTEM_CLOSING, SYSTEM_STEPS } from "@/lib/data";

/**
 * The footage is the SECTION, not a panel inside it: the 121-frame sequence is
 * painted edge to edge behind everything and the copy sits on top of it. One
 * runway drives both — the four steps light up as you scroll while the rig
 * glides in from the right, crosses to the left, and the television, tablet and
 * phone arrive in the space it vacates.
 *
 * WHY THIS CAN BE A FULL-BLEED BACKGROUND AT ALL
 * The take was shot on a white sweep and is flat-fielded at build time to
 * --color-cloud, the exact value of the section ground (see RigScrub). So the
 * frame may letterbox in either axis at any viewport shape and no edge is ever
 * visible: what reads is one continuous studio, not a video in a box.
 *
 * HOW THE COPY STAYS READABLE, AND WHY IT IS NOT JUST A SCRIM
 * Measured on the graded frames, subject ink reaches 25.9% from the left of
 * frame at its furthest (frame 59), and ink type over the black camera body is
 * 1.00:1 — so something has to keep the rig off the text. The first attempt was
 * a long scrim across the copy column, and it worked for contrast but looked
 * wrong: it washed the camera down to a watermark for a third of the scroll.
 *
 * So the geometry does the work instead. The footage layer is inset from the
 * left to where the copy ends, and its own plate — the same cloud as the
 * section — fills everything left of it, so there is still no visible boundary
 * anywhere and the section still reads as one continuous studio. The rig now
 * enters to the RIGHT of the copy at full strength: 26% of a box that starts at
 * 26% of the screen puts its leftmost ink at about 45%, while the copy column
 * ends at 39% (1440px) or 44% (1920px).
 *
 * The scrim that remains is a short one and is insurance, not the mechanism: it
 * covers the narrower breakpoints, where the copy column takes a larger share
 * of the width and the rig's soft shadow can still reach it.
 *
 * THE FOOTAGE IS DESKTOP ONLY, and that is a product decision rather than an
 * oversight — it was tried on phones and taken out. Phones get the copy on its
 * own, which is the part that carries the meaning.
 *
 * One DOM tree serves both layouts and the copy is never duplicated — a second
 * mobile copy would repeat the heading and its id.
 *
 * Step collapsing is CSS-driven: on phones every step stays open, because there
 * is no pinned pane to drive a step-by-step reveal.
 *
 * No overflow-hidden anywhere up this tree — it would become the scroll
 * container for the sticky layer and break it.
 */
const DESKTOP = "(min-width: 1024px)";
const subscribeDesktop = (cb: () => void) => {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getDesktop = () => window.matchMedia(DESKTOP).matches;

/** Short and gentle: the footage inset does the real work. See the note above. */
const SCRIM =
  "linear-gradient(to right, #f7f9fc 0%, #f7f9fc 28%, rgba(247,249,252,0.64) 40%, rgba(247,249,252,0) 52%)";

export function System() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const [scrubbed, setScrubbed] = useState(0);
  const isDesktop = useSyncExternalStore(subscribeDesktop, getDesktop, () => false);

  // Phones have no pane to scrub, so they show every step open. Derived rather
  // than written to state, which keeps the effect free of a synchronous setState.
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
    <section id="system" className="relative z-10 bg-cloud" aria-labelledby="system-heading">
      <div ref={runwayRef} className="relative lg:h-[340vh]">
        <div className="section-pad relative z-10 lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:py-0">
          {/* The footage. Inset from the left to clear the copy column — the
              plate that fills the rest is the section's own ground, so the inset
              is invisible and the section still reads as one full-bleed studio.
              Behind the copy in paint order and pointer-events-none. */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden lg:left-[26%] lg:block xl:left-[22%]"
            aria-hidden="true"
          >
            <RigScrub runwayRef={runwayRef} scrub={isDesktop} />
          </div>
          {/* The copy's ground. Invisible over the plate, which is the same
              colour — it only resolves the frames where the rig arrives under
              the text. */}
          <div
            className="pointer-events-none absolute inset-0 z-[1] hidden lg:block"
            style={{ background: SCRIM }}
            aria-hidden="true"
          />

          <div className="wrap relative z-10 w-full">
            {/* Half the old grid is gone: the copy is a single left column and
                the footage runs underneath the whole section. This max-width is
                what the scrim's contrast maths assumes — see the note above. */}
            <div className="flex flex-col lg:max-w-[520px] xl:max-w-[560px]">
              <Marker className="mb-5">01 — The system</Marker>
              <Kinetic
                as="h2"
                text={"One focused shoot can\npower your whole month."}
                className="t-h2 !text-[clamp(26px,2.7vw,42px)] text-ink"
                accent={[1]}
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
                          on ? "border-violet text-ink" : "border-transparent lg:text-pewter"
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
          </div>
        </div>
      </div>
    </section>
  );
}
