"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const COPY =
  "The problem is consistency, not creativity. Posting gets pushed behind customers, staff and operations. Ideas, footage, approvals and publishing live in different places. Reelative gives you the team, calendar and rhythm to stay visible every month.";

/** Words fill from 18% to 100% opacity as the reader scrolls (scrubbed). */
export function Statement() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = gsap.utils.toArray<HTMLElement>(".statement-word", el);
      gsap.fromTo(
        words,
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.4 },
        },
      );
    });
    return () => mm.revert();
  }, []);

  const words = COPY.split(" ");

  return (
    <section ref={ref} className="relative z-10 bg-base motion-safe:h-[170vh]" aria-label="Why consistency matters">
      <div className="sticky top-0 flex h-svh items-center">
        <div className="wrap">
          <p className="t-statement mx-auto max-w-[1100px] text-center">
            {words.map((w, i) => (
              <span key={i} className="statement-word inline-block whitespace-pre">
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
