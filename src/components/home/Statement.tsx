"use client";

import { Kinetic } from "@/components/ui/Kinetic";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The full-bleed claim: one oversized kinetic line in the italic Didone,
 * then the three supporting lines set as real sentences.
 *
 * Sections separate by VALUE rather than hue, and this is the deepest step —
 * flat midnight carrying the one generated photographic ground on the site at
 * half strength. The ground is asserted at build time to stay under the
 * --scrim-floor luminance ceiling, so every colour below is quoted against
 * that floor rather than against a photographic average.
 *
 * background-attachment is SCROLL, never fixed: fixed thrashes on iOS and
 * fights Lenis.
 */
export function Statement() {
  return (
    <section
      className="relative z-10 overflow-hidden bg-midnight text-cloud section-pad"
      data-ground="dark"
      aria-label="What we bring"
    >
      {/* The salon ground. Normal blending at 0.5 can only interpolate between
          midnight and the file's asserted maximum, so the composite stays below
          the scrim floor. Phones get the 1200px cut.
          A CSS background rather than an <img>: it is purely decorative, and
          bg-cover/bg-center is the same declaration FinalCTA uses. */}
      <div
        aria-hidden="true"
        data-parallax="110"
        className="pointer-events-none absolute inset-x-0 -inset-y-[14%] z-0 bg-[url('/images/ground/salon-1200.webp')] bg-cover bg-center bg-no-repeat opacity-50 md:bg-[url('/images/ground/salon-2400.webp')]"
      />

      <div data-parallax="-40" className="wrap relative z-10">
        <p className="eyebrow mb-8 text-steel">What we bring</p>
        <Kinetic
          as="p"
          text={"Consistency\nand creativity."}
          className="t-statement max-w-[15ch]"
          stagger={0.024}
          accent={[1]}
        />
        <div className="mt-12 grid gap-8 border-t border-rule-dark pt-8 md:grid-cols-3 lg:mt-20">
          {[
            "Posting gets pushed behind customers, staff and operations.",
            "Ideas, footage, approvals and publishing live in different places.",
            "Reelative gives you the team, calendar and rhythm to stay visible every month.",
          ].map((line, i) => (
            <Reveal key={line} delay={i * 0.08}>
              <p className="t-body flex gap-3 text-slate">
                {/* A counting sequence is the one place the accent repeats. */}
                <span className="mono shrink-0 text-pink">[{String(i + 1).padStart(2, "0")}]</span>
                <span>{line}</span>
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
