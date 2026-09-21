"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * One ScrollTrigger sweep over every `[data-parallax]` element on the page.
 *
 * Mounted once in the root layout, so it covers every route. It re-scans on
 * navigation, because the App Router swaps the tree without remounting layout.
 *
 * USAGE
 *   <div data-parallax="90" />        drifts 90px across its section's pass
 *   <div data-parallax="-40" />       negative leads the scroll instead
 *
 * The drift is CENTRED: the element sits at -d/2 as its section enters from the
 * bottom and +d/2 as it leaves the top, so it is at its natural position when
 * the section is centred. Anchoring at 0 instead would make every element jump
 * on first paint.
 *
 * The trigger is the element's nearest `[data-parallax-scope]`, else its nearest
 * section — so the drift maps to that section's travel rather than the whole
 * document.
 *
 * THINGS THIS DELIBERATELY DOES NOT TOUCH
 * - Anything inside FilmStrip. Section 3 is under a standing client constraint
 *   and is pinned by its own ScrollTrigger; a competing transform on a pinned
 *   subtree fights the pin. Nothing in that file carries the attribute, and the
 *   guard below enforces it even if someone adds one later.
 * - Elements framer-motion already drives (the FunAsia rings, every Reveal /
 *   Stagger / Kinetic wrapper). Two libraries writing the same transform is a
 *   race. Annotate a plain wrapper instead.
 * - Anything under prefers-reduced-motion.
 */
export function Parallax() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]")).filter(
      (el) =>
        // Never animate inside a ScrollTrigger pin. A competing transform on a
        // pinned subtree fights the pin, and ScrollTrigger wraps anything it
        // pins in a .pin-spacer — so this is structural rather than a hardcoded
        // id, and it covers FilmStrip plus anything pinned later.
        !el.closest(".pin-spacer") &&
        // Belt and braces for section 3 specifically, which is sealed: its
        // section carries id="work" AND the canister. Checking both means the
        // /work ROUTE (no canister) is not caught by the id alone.
        !(el.closest("#work") && el.closest("#work")?.querySelector('img[src*="canister"]')),
    );
    if (!nodes.length) return;

    const ctx = gsap.context(() => {
      nodes.forEach((el) => {
        const distance = Number(el.dataset.parallax);
        if (!Number.isFinite(distance) || distance === 0) return;

        const trigger =
          el.closest<HTMLElement>("[data-parallax-scope]") ?? el.closest("section") ?? el;

        gsap.fromTo(
          el,
          { y: -distance / 2 },
          {
            y: distance / 2,
            ease: "none",
            scrollTrigger: {
              trigger,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    });

    // Late-loading media changes section heights, which invalidates every
    // start/end above. One refresh after the first paint settles is enough.
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
