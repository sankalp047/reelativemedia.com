"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Item, MaskedLines, Reveal, Stagger } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { FUNASIA_BRANDS } from "@/lib/data";

function Rings() {
  const rings = [140, 300, 460, 620, 780, 940, 1100, 1260];
  return (
    <svg viewBox="0 0 2600 2600" className="h-full w-full" aria-hidden="true">
      {rings.map((r) => (
        <circle key={r} cx="1300" cy="1300" r={r} fill="none" stroke="#fff" strokeWidth="1.5" />
      ))}
      <circle cx="1300" cy="1300" r="40" fill="#fff" opacity="0.6" />
    </svg>
  );
}

export function FunAsia() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.95]);

  return (
    <section ref={ref} id="funasia" className="relative z-10 overflow-hidden bg-funasia section-pad" aria-labelledby="funasia-heading">
      <motion.div
        className="pointer-events-none absolute -right-[30vw] top-1/2 aspect-square w-[110vw] -translate-y-1/2 opacity-[0.06] md:-right-[25vw] md:w-[80vw]"
        style={reduce ? undefined : { rotate, scale }}
        aria-hidden="true"
      >
        <div className="h-full w-full motion-safe:animate-rings">
          <Rings />
        </div>
      </motion.div>

      <div className="wrap relative">
        <Eyebrow className="mb-5">06 — The FunAsia advantage</Eyebrow>
        <MaskedLines as="h2" lines={["More than a content agency.", "A media ecosystem."]} className="t-h2" />
        <span id="funasia-heading" className="sr-only">The FunAsia advantage</span>
        <Reveal delay={0.15}>
          <p className="mt-7 max-w-[640px] text-muted">
            Reelative Media is a FunAsia company, giving clients access to one of the most established multicultural media networks in DFW.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-20" amount={0.15}>
          <Item className="h-full">
            <article className="flex h-full flex-col rounded-[24px] bg-white/[0.04] p-8 lg:p-10">
              <div className="flex flex-wrap gap-2">
                {FUNASIA_BRANDS.map((b) => (
                  <span key={b.id} className="flex flex-col rounded-[12px] border border-dashed border-white/20 px-4 py-3">
                    <span className="font-display text-[15px] font-extrabold">{b.name}</span>
                    <span className="mono text-[9px] text-muted/70">{b.meta} · logo pending</span>
                  </span>
                ))}
              </div>
              <h3 className="t-h3 mt-8">Radio brands</h3>
              <p className="mt-3 text-muted">FunAsia radio reaches established South Asian and multicultural audiences across DFW.</p>
            </article>
          </Item>

          <Item className="h-full">
            <article className="flex h-full flex-col rounded-[24px] bg-white/[0.04] p-8 lg:p-10">
              <div className="flex flex-wrap gap-2">
                {["IG", "FB", "YT", "WA"].map((p) => (
                  <span key={p} className="mono flex h-11 w-11 items-center justify-center rounded-full border border-line text-[11px] text-muted">
                    {p}
                  </span>
                ))}
                <span className="chip !py-0">Community following</span>
              </div>
              <h3 className="t-h3 mt-8">Social channels</h3>
              <p className="mt-3 text-muted">Amplify your content through FunAsia&apos;s own social platforms and engaged community following.</p>
            </article>
          </Item>

          <Item className="h-full">
            <article className="flex h-full flex-col rounded-[24px] bg-white/[0.04] p-8 lg:p-10">
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((n) => (
                  <Placeholder key={n} label={`Event ${n}`} sub="photo" ratio="4 / 3" rounded="rounded-[12px]" />
                ))}
              </div>
              <h3 className="t-h3 mt-8">Events &amp; activations</h3>
              <p className="mt-3 text-muted">Connect your brand to live events, cultural moments and community gatherings.</p>
            </article>
          </Item>

          <Item className="h-full">
            <article className="flex h-full flex-col rounded-[24px] bg-white/[0.04] p-8 lg:p-10">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="placeholder-block flex h-16 w-16 items-center justify-center rounded-full !border-solid !border-funasia bg-elevated"
                    role="img"
                    aria-label={`Placeholder: creator portrait ${n}`}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted">C{n}</span>
                  </div>
                ))}
              </div>
              <h3 className="t-h3 mt-8">Creator partnerships</h3>
              <p className="mt-3 text-muted">Tap into FunAsia talent and creator relationships to extend your message with authentic voices.</p>
            </article>
          </Item>
        </Stagger>
      </div>
    </section>
  );
}
