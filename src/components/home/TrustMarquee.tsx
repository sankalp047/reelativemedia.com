import { FUNASIA_BRANDS } from "@/lib/data";

function Row({ children, reverse = false, label }: { children: React.ReactNode; reverse?: boolean; label: string }) {
  return (
    <div
      className="group relative overflow-hidden py-3"
      aria-label={label}
      /* The names dissolve into the noir at both edges instead of being
         guillotined by the overflow box. Decorative only — it changes no
         geometry and no timing. */
      style={{
        maskImage: "linear-gradient(to right, transparent 0, #000 96px, #000 calc(100% - 96px), transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0, #000 96px, #000 calc(100% - 96px), transparent 100%)",
      }}
    >
      <div
        className={`flex w-max items-center gap-10 pr-10 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} group-hover:[animation-play-state:paused] motion-reduce:animate-none`}
      >
        {children}
        <div className="flex items-center gap-10" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * The radio brands run as the crawl at the bottom of the Hero frame.
 *
 * THE TOP BORDER IS DELETED ON PURPOSE. This band sits flush against the
 * Hero's lower letterbox bar with nothing between them — that unbroken
 * dark handoff is what turns a logo-soup strip into the bottom of the
 * frame. Do not reinstate a rule, a margin or a gap above this section.
 */
export function TrustMarquee() {
  return (
    <section className="relative z-10 bg-noir" data-ground="dark" aria-label="Trusted across DFW">
      <div className="wrap flex items-baseline justify-between border-b border-rule-dark py-3">
        <p className="eyebrow text-ash">Backed across DFW</p>
        <p className="mono hidden text-ash sm:block">[ FunAsia Network brands ]</p>
      </div>

      <Row label="FunAsia Network brands" reverse>
        {FUNASIA_BRANDS.map((b) => (
          <span key={b.id} className="flex items-baseline gap-2.5 whitespace-nowrap">
            {/* Title case, not caps: these are proper nouns, and a tracked
                Didone caps line is the single most common way this pairing
                goes wrong. Floor raised to 24px — Bodoni never goes below it. */}
            <span className="t-h2 !text-[clamp(24px,2vw,28px)] text-bone">{b.name}</span>
            <span className="mono text-ash">{b.meta}</span>
          </span>
        ))}
      </Row>
    </section>
  );
}
