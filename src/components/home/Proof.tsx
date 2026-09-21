"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { SectionHead } from "@/components/site/SectionHead";
import { Item, Stagger } from "@/components/ui/Reveal";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import type { LightboxItem } from "@/components/home/Lightbox";
import { TESTIMONIALS } from "@/lib/data";

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
      TESTIMONIALS.map((t) => ({
        id: t.id,
        src: t.src,
        poster: t.poster,
        title: `${t.name} · ${t.business}`,
        meta: `${t.city} · ${t.language}`,
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
              <figure className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="group relative w-full overflow-hidden rounded-[2px] border border-edge bg-linen"
                  style={{ aspectRatio: "9 / 16", rotate: i % 2 === 0 ? "-1.4deg" : "1.2deg" }}
                  data-cursor="PLAY"
                  aria-label={`Play testimonial from ${t.name}, ${t.business}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.poster} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  <PlaceholderTag className="absolute left-3 top-3">To be filmed</PlaceholderTag>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <PlayButton />
                  </span>
                  <span className="mono absolute bottom-3 left-3 rounded-[2px] bg-bone px-2.5 py-1 text-ink">
                    {t.language}
                  </span>
                </button>
                <figcaption className="mt-5">
                  <blockquote className="t-body text-ink">“{t.quote}”</blockquote>
                  <p className="t-h3 mt-4 text-ink">{t.name}</p>
                  <p className="mono mt-1 text-slate">{t.business} · {t.city}</p>
                </figcaption>
              </figure>
            </Item>
          ))}
        </Stagger>
      </div>

      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  );
}
