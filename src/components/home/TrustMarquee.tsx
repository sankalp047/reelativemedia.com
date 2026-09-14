import { CLIENT_LOGOS, FUNASIA_BRANDS } from "@/lib/data";

function Row({ children, reverse = false, label }: { children: React.ReactNode; reverse?: boolean; label: string }) {
  return (
    <div className="group relative overflow-hidden" aria-label={label}>
      <div
        className={`flex w-max items-center gap-14 pr-14 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} group-hover:[animation-play-state:paused] motion-reduce:animate-none`}
      >
        {children}
        <div className="flex items-center gap-14" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

export function TrustMarquee() {
  return (
    <section className="relative z-10 border-y border-line bg-base py-8" aria-label="Trusted across DFW">
      <div className="wrap mb-6 flex items-center justify-between">
        <p className="eyebrow">Trusted across DFW</p>
        <p className="mono hidden text-muted/60 sm:block">[ Clients · FunAsia Network brands ]</p>
      </div>

      <Row label="Client logos">
        {CLIENT_LOGOS.map((c) => (
          <span
            key={c.id}
            className="mono flex h-10 items-center rounded-full border border-dashed border-white/20 px-5 text-white/45 opacity-90 transition-colors duration-500 hover:border-white/60 hover:text-white"
          >
            [ {c.label} ]
          </span>
        ))}
      </Row>

      <div className="h-6" />

      <Row label="FunAsia Network brands" reverse>
        {FUNASIA_BRANDS.map((b) => (
          <span key={b.id} className="flex items-baseline gap-3 whitespace-nowrap">
            <span className="font-display text-[22px] font-extrabold tracking-[-0.01em] text-primary/80">{b.name}</span>
            <span className="mono text-muted/70">{b.meta}</span>
          </span>
        ))}
      </Row>
    </section>
  );
}
