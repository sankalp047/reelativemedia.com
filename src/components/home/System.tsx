"use client";

import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MaskedLines, Reveal } from "@/components/ui/Reveal";
import { SYSTEM_STEPS } from "@/lib/data";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/* ---------- tiny illustrative visuals ---------- */

function Checklist({ active }: { active: boolean }) {
  const rows = [true, true, true, false];
  return (
    <div className="flex w-full flex-col gap-3 rounded-[12px] border border-line bg-base/60 p-4">
      {rows.map((done, i) => (
        <div key={i} className="flex items-center gap-3" style={{ transitionDelay: `${i * 80}ms` }}>
          <span
            className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors duration-500 ${
              done && active ? "border-transparent bg-[#5B2EFF]" : "border-white/25"
            }`}
          >
            {done ? (
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="1.8">
                <path d="M2 5.2 4.2 7.4 8 3" />
              </svg>
            ) : null}
          </span>
          <span className="h-1.5 rounded bg-white/15" style={{ width: `${[72, 54, 64, 40][i]}%` }} />
        </div>
      ))}
    </div>
  );
}

function ShotList({ active }: { active: boolean }) {
  const tints = ["#2C1550", "#5A1B48", "#6B3417"];
  return (
    <div className="w-full rounded-[12px] border border-line bg-base/60 p-4">
      <p className="mono mb-3 text-[10px] text-muted/70">Shot list · 01 / 12</p>
      <div className="flex gap-2">
        {tints.map((t, i) => (
          <div
            key={i}
            className="flex-1 rounded-[8px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              aspectRatio: "9 / 12",
              background: `linear-gradient(160deg, ${t}, #0A0A0F)`,
              transform: active ? "translateY(0)" : "translateY(12px)",
              opacity: active ? 1 : 0.5,
              transitionDelay: `${i * 90}ms`,
            }}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <span className="h-1.5 w-3/4 rounded bg-white/15" />
        <span className="h-1.5 w-1/2 rounded bg-white/10" />
      </div>
    </div>
  );
}

function AssetGrid({ active }: { active: boolean }) {
  const tints = ["#5B2EFF", "#E23FA7", "#FF7A1A"];
  return (
    <div className="grid w-full grid-cols-3 gap-2">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="rounded-[8px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            aspectRatio: "1 / 1",
            background: `linear-gradient(160deg, ${tints[i % 3]}55, #12121A)`,
            transform: active ? "scale(1) rotate(0deg)" : "scale(0.85) rotate(-6deg)",
            opacity: active ? 1 : 0.4,
            transitionDelay: `${i * 50}ms`,
          }}
        />
      ))}
    </div>
  );
}

function Scorecard({ active }: { active: boolean }) {
  const bars = [
    { label: "keep", h: 86, c: "#5B2EFF" },
    { label: "stop", h: 34, c: "#3A3A4A" },
    { label: "test", h: 58, c: "#E23FA7" },
    { label: "amplify", h: 100, c: "#FF7A1A" },
  ];
  return (
    <div className="w-full rounded-[12px] border border-line bg-base/60 p-4">
      <div className="flex items-end gap-3">
        {bars.map((b, i) => (
          <div key={b.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-24 w-full items-end">
              <div
                className="w-full rounded-t-[4px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  height: `${b.h}%`,
                  background: b.c,
                  transformOrigin: "bottom",
                  transform: active ? "scaleY(1)" : "scaleY(0.15)",
                  transitionDelay: `${i * 80}ms`,
                }}
              />
            </div>
            <span className="mono text-[9px] text-muted/80">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const VISUALS = { checklist: Checklist, shotlist: ShotList, grid: AssetGrid, chart: Scorecard } as const;

/* ---------- section ---------- */

export function System() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const col = cardsRef.current;
    if (!col) return;
    const mm = gsap.matchMedia();
    mm.add(
      { desktop: "(min-width: 1024px)", reduce: "(prefers-reduced-motion: reduce)" },
      (ctx) => {
        const { desktop: isDesktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
        setDesktop(isDesktop && !reduce);
        if (!isDesktop || reduce) return;

        const cards = gsap.utils.toArray<HTMLElement>("[data-step]", col);
        cards.forEach((card, i) => {
          ScrollTrigger.create({
            trigger: card,
            start: "top 55%",
            end: "bottom 55%",
            onEnter: () => setActive(i),
            onEnterBack: () => setActive(i),
          });
        });
        if (fillRef.current) {
          gsap.fromTo(
            fillRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: col, start: "top 55%", end: "bottom 55%", scrub: true },
            },
          );
        }
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <section id="system" className="relative z-10 bg-base section-pad" aria-labelledby="system-heading">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Sticky column */}
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-32">
            <Eyebrow className="mb-5">02 — The system</Eyebrow>
            <MaskedLines as="h2" lines={["One focused shoot", "can power your", "whole month."]} className="t-h2 !text-[clamp(36px,3.9vw,56px)]" />
            <span id="system-heading" className="sr-only">The system</span>
            <Reveal delay={0.2}>
              <p className="mt-7 max-w-[440px] text-muted">
                We plan the stories before the camera arrives, so every minute of capture produces usable content.
              </p>
            </Reveal>

            <div className="mt-10 hidden lg:flex lg:items-start lg:gap-5">
              <div className="relative ml-[7px] h-[232px] w-px bg-white/10">
                <div ref={fillRef} className="absolute inset-0 origin-top bg-white" style={{ transform: "scaleY(0)" }} />
                {SYSTEM_STEPS.map((s, i) => (
                  <span
                    key={s.n}
                    className={`absolute -left-[7px] flex h-[15px] w-[15px] items-center justify-center rounded-full border transition-all duration-500 ${
                      i <= active ? "border-white bg-white" : "border-white/25 bg-base"
                    }`}
                    style={{ top: `${(i / (SYSTEM_STEPS.length - 1)) * 100}%`, transform: "translateY(-50%)" }}
                  />
                ))}
              </div>
              <ol className="flex h-[232px] flex-col justify-between">
                {SYSTEM_STEPS.map((s, i) => (
                  <li key={s.n} className={`mono transition-colors duration-500 ${i === active ? "text-primary" : "text-muted/60"}`}>
                    {s.n} — {s.title}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="flex flex-col gap-6 lg:col-span-6 lg:gap-8 lg:py-[10vh]">
          {SYSTEM_STEPS.map((s, i) => {
            const Visual = VISUALS[s.visual];
            const isActive = !desktop || i === active;
            return (
              <article
                key={s.n}
                data-step={i}
                className="grid gap-8 rounded-[24px] bg-elevated p-7 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:grid-cols-[1.2fr_1fr] md:p-12"
                style={{ opacity: isActive ? 1 : 0.5, transform: `scale(${isActive ? 1 : 0.96})` }}
              >
                <div className="flex flex-col">
                  <span className="mono text-muted">Step {s.n}</span>
                  <h3 className="t-h3 mt-5">{s.title}</h3>
                  <p className="mt-4 text-muted">{s.body}</p>
                </div>
                <div className="flex w-full items-center md:max-w-[300px] md:justify-self-end">
                  <Visual active={isActive} />
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <Reveal className="wrap mt-16 lg:mt-24">
        <p className="font-display text-[24px] font-bold leading-tight tracking-[-0.01em]">
          One strategist. One calendar. One approval window.
        </p>
      </Reveal>
    </section>
  );
}
