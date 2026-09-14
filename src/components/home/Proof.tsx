"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Item, MaskedLines, Stagger } from "@/components/ui/Reveal";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import type { LightboxItem } from "@/components/home/Lightbox";
import { STATS, TESTIMONIALS, type Stat } from "@/lib/data";
import { EXPO } from "@/lib/motion";

const Lightbox = dynamic(() => import("@/components/home/Lightbox"), { ssr: false });

function StatValue({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || stat.value === null) return;
    if (!inView) return;
    if (reduce) {
      el.textContent = String(stat.value);
      return;
    }
    const controls = animate(0, stat.value, {
      duration: 1.6,
      ease: EXPO,
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, reduce, stat.value]);

  return (
    <span className="font-display whitespace-nowrap text-[clamp(40px,5.6vw,84px)] font-extrabold leading-none tracking-[-0.04em]">
      {stat.prefix}
      <span ref={ref}>{stat.value === null ? "[X]" : reduce ? stat.value : 0}</span>
      <span className={stat.suffix.startsWith(" ") ? "text-[0.5em] text-muted" : ""}>{stat.suffix}</span>
    </span>
  );
}

function PlayButton() {
  return (
    <span className="grad-fill flex h-16 w-16 items-center justify-center rounded-full shadow-[0_0_40px_rgba(226,63,167,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
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
        meta: `${t.city.toUpperCase()} · ${t.language.toUpperCase()}`,
      })),
    [],
  );

  return (
    <section className="relative z-10 bg-base section-pad" aria-labelledby="results-heading">
      <div className="wrap">
        <Eyebrow className="mb-5">04 — Results</Eyebrow>
        <MaskedLines as="h2" lines={["You see what happened,", "and what to do next."]} className="t-h2" />
        <span id="results-heading" className="sr-only">Results</span>

        <Stagger className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-10 lg:mt-20 lg:grid-cols-4">
          {STATS.map((s) => (
            <Item key={s.label} className="flex flex-col gap-3">
              <StatValue stat={s} />
              <span className="mono text-muted">{s.label}</span>
              {s.placeholder ? <PlaceholderTag className="self-start">Needs real number</PlaceholderTag> : null}
            </Item>
          ))}
        </Stagger>

        <Stagger className="mt-20 grid gap-8 md:grid-cols-3 lg:mt-28" amount={0.15}>
          {TESTIMONIALS.map((t, i) => (
            <Item key={t.id}>
              <figure className="flex flex-col">
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="group relative w-full overflow-hidden rounded-[24px] bg-elevated"
                  style={{ aspectRatio: "9 / 16" }}
                  data-cursor="PLAY"
                  aria-label={`Play testimonial from ${t.name}, ${t.business}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.poster} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-base/20" aria-hidden="true" />
                  <PlaceholderTag className="absolute left-4 top-4">Testimonial to be filmed</PlaceholderTag>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <PlayButton />
                  </span>
                  <span className="mono absolute bottom-4 left-4 text-white/70">{t.language}</span>
                </button>
                <figcaption className="mt-6">
                  <blockquote className="text-[18px] leading-[1.5] text-primary/90">“{t.quote}”</blockquote>
                  <p className="mt-4 text-[15px] font-semibold">{t.name}</p>
                  <p className="text-[14px] text-muted">
                    {t.business} · {t.city}
                  </p>
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
