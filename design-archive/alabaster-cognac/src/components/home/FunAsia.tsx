"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Marker } from "@/components/ui/Marker";
import { Kinetic } from "@/components/ui/Kinetic";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Item, Stagger } from "@/components/ui/Reveal";
import { FUNASIA_BRANDS } from "@/lib/data";

/**
 * Sized to one screen on desktop, because the sections from the system down
 * stack as cards and anything past the fold gets clipped by the next one.
 *
 * This section used to be a dark well. It is paper now: the network
 * credentials are the most concrete claim on the page and they should read as
 * a document, not as a mood. The five stations carry the section — they are
 * the one claim here that needs no hedging, so they are set in the display
 * face, in title case, as the proper nouns they are. The placeholder event
 * photos and creator portrait circles that used to fill two of the tiles are
 * gone — fake pictures were weakening the one part of the page that is real.
 */

const PILLARS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "radio",
    title: "Radio brands",
    body: "Five stations reaching established South Asian and multicultural audiences across DFW.",
  },
  {
    icon: "chat",
    title: "Social channels",
    body: "Amplify your content through FunAsia's own platforms and engaged community following.",
  },
  {
    icon: "calendar",
    title: "Events & activations",
    body: "Connect your brand to live events, cultural moments and community gatherings.",
  },
  {
    icon: "people",
    title: "Creator partnerships",
    body: "Tap into FunAsia talent and creator relationships to extend your message with authentic voices.",
  },
];

function Rings() {
  const rings = [140, 300, 460, 620, 780, 940, 1100, 1260];
  return (
    <svg viewBox="0 0 2600 2600" className="h-full w-full" aria-hidden="true">
      {rings.map((r) => (
        <circle key={r} cx="1300" cy="1300" r={r} fill="none" stroke="rgba(25,21,16,0.07)" strokeWidth="3" />
      ))}
      <circle cx="1300" cy="1300" r="40" fill="rgba(25,21,16,0.07)" />
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
    <section
      ref={ref}
      id="funasia"
      className="relative z-10 overflow-hidden bg-alabaster py-16 text-ink lg:flex lg:h-svh lg:flex-col lg:justify-center lg:py-0"
      aria-labelledby="funasia-heading"
    >
      {/* A dark line on paper at 0.07 needs the help, hence 0.5 rather than 0.16. */}
      <motion.div
        className="pointer-events-none absolute -right-[26vw] top-1/2 aspect-square w-[80vw] -translate-y-1/2 opacity-[0.5]"
        style={reduce ? undefined : { rotate, scale }}
        aria-hidden="true"
      >
        <div className="h-full w-full motion-safe:animate-rings">
          <Rings />
        </div>
      </motion.div>

      <div data-parallax="-30" className="wrap relative z-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-end xl:gap-16">
          <div>
            <Marker className="mb-5">06 — The FunAsia advantage</Marker>
            <Kinetic
              as="h2"
              text={"More than a content agency.\nA media ecosystem."}
              className="t-h2 !text-[clamp(26px,2.9vw,46px)]"
            />
            <span id="funasia-heading" className="sr-only">The FunAsia advantage</span>
            <p className="t-lead mt-6 text-graphite">
              Reelative Media is a FunAsia company, giving clients access to one of the most established multicultural
              media networks in DFW.
            </p>
          </div>

          {/* The stations, listed plainly. This is the concrete part. */}
          <ul className="flex flex-col border-t border-rule">
            {FUNASIA_BRANDS.map((b, i) => (
              <li key={b.id} className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5">
                <span className="flex items-baseline gap-3">
                  <span className="mono text-slate">{String(i + 1).padStart(2, "0")}</span>
                  {/* Title case, not caps: these are proper nouns, and a tracked
                      Didone caps line is how this pairing goes wrong. */}
                  <span className="t-h2 !text-[clamp(20px,2vw,28px)] leading-none text-ink">{b.name}</span>
                </span>
                <span className="mono shrink-0 text-slate">{b.meta}</span>
              </li>
            ))}
          </ul>
        </div>

        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4" amount={0.15}>
          {PILLARS.map((p) => (
            <Item key={p.title} className="h-full">
              <article className="card-ink flex h-full flex-col p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-edge text-cognac">
                  <Icon name={p.icon} size={18} />
                </span>
                <h3 className="t-h3 mt-5">{p.title}</h3>
                <p className="t-body mt-2 !text-[15px] text-graphite">{p.body}</p>
              </article>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
