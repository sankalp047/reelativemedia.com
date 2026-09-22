"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { SectionHead } from "@/components/site/SectionHead";
import { Item, Stagger } from "@/components/ui/Reveal";
import type { LightboxItem } from "@/components/home/Lightbox";
import { TESTIMONIALS, streamHls, streamPoster } from "@/lib/data";

const Lightbox = dynamic(() => import("@/components/home/Lightbox"), { ssr: false });

function PlayButton() {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-cognac bg-cognac transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
      {/* A cognac fill takes BONE. The old ink glyph on brass was 2.44:1. */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#f4f1ea" aria-hidden="true">
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
    <section className="relative z-10 overflow-hidden bg-parchment section-pad" aria-labelledby="results-heading">

      <div className="wrap relative z-10">
        <SectionHead eyebrow="04 — Results" lines={["You see what happened,", "and what to do next."]} />
        <span id="results-heading" className="sr-only">Results</span>

        <Stagger className="mt-14 grid gap-8 border-t border-rule pt-12 md:grid-cols-3 lg:mt-20" amount={0.15}>
          {TESTIMONIALS.map((t, i) => (
            <Item key={t.id}>
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="group relative w-full overflow-hidden rounded-[2px] border border-edge bg-linen"
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
