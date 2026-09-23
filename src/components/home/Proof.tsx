"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { SectionHead } from "@/components/site/SectionHead";
import { Item, Stagger } from "@/components/ui/Reveal";
import type { LightboxItem } from "@/components/home/Lightbox";
import { TESTIMONIALS, streamHls, streamPoster } from "@/lib/data";

const Lightbox = dynamic(() => import("@/components/home/Lightbox"), { ssr: false });

/* No glow. This section is meant to look exactly as it did apart from the token
   colours, and a 24px pink cast over the client's own poster art is a new
   effect, not a token swap. The gradient fill is the whole change here. */
function PlayButton() {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
      {/* A spectrum fill takes WHITE: 4.64 at the deepest stop. */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
        <path d="M8 5.5v13l11-6.5z" />
      </svg>
    </span>
  );
}

export function Proof() {
  const [open, setOpen] = useState<number | null>(null);
  const items: LightboxItem[] = useMemo(
    () =>
      /* No title/meta: the attribution was placeholder text, so the lightbox
         renders the video alone rather than captioning it with invented names. */
      TESTIMONIALS.map((t) => ({
        id: t.id,
        src: streamHls(t.streamId),
        poster: "poster" in t ? t.poster : streamPoster(t.streamId),
        aspect: "aspect" in t ? t.aspect : undefined,
      })),
    [],
  );

  return (
    <section className="relative z-10 overflow-hidden bg-midnight section-pad" aria-labelledby="results-heading">

      <div className="wrap relative z-10">
        <SectionHead invert eyebrow="04 — Results" lines={["You see what happened,", "and what to do next."]} />
        <span id="results-heading" className="sr-only">Results</span>

        {/* rule-dark, not rule: --color-rule is the LIGHT band's hairline and
            measures 14.22:1 on midnight — it was the brightest line in the
            section. border-edge on the cards below is correct and stays: it is
            an interactive boundary at 3.61 on midnight, where edge-dark would
            be 2.63. */}
        <Stagger className="mt-14 grid gap-8 border-t border-rule-dark pt-12 md:grid-cols-3 lg:mt-20" amount={0.15}>
          {TESTIMONIALS.map((t, i) => (
            <Item key={t.id}>
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="group relative w-full overflow-hidden rounded-[2px] border border-edge bg-haze"
                  style={{ aspectRatio: "9 / 16", rotate: i % 2 === 0 ? "-1.4deg" : "1.2deg" }}
                  data-cursor="PLAY"
                  aria-label={`Play reel ${i + 1} of ${TESTIMONIALS.length}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={"poster" in t ? t.poster : streamPoster(t.streamId)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <PlayButton />
                  </span>
                </button>
              </div>
            </Item>
          ))}
        </Stagger>
      </div>

      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  );
}
