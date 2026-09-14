import { Eyebrow } from "@/components/ui/Eyebrow";
import { Item, MaskedLines, Reveal, Stagger } from "@/components/ui/Reveal";
import { SERVICES } from "@/lib/data";

const TINT: Record<string, { bg: string; fg: string }> = {
  violet: { bg: "rgba(91,46,255,0.16)", fg: "#9C7BFF" },
  magenta: { bg: "rgba(226,63,167,0.16)", fg: "#F06AC2" },
  orange: { bg: "rgba(255,122,26,0.16)", fg: "#FF9A52" },
};

function Icon({ name }: { name: string }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "create")
    return (
      <svg {...common} aria-hidden="true">
        <rect x="3" y="7" width="13" height="11" rx="2.5" />
        <path d="m16 11 5-3v8l-5-3z" />
        <circle cx="9.5" cy="12.5" r="2" />
      </svg>
    );
  if (name === "distribute")
    return (
      <svg {...common} aria-hidden="true">
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="18" cy="18" r="2.5" />
        <path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" />
      </svg>
    );
  return (
    <svg {...common} aria-hidden="true">
      <path d="M3 11v2a2 2 0 0 0 2 2h2l6 4V5L7 9H5a2 2 0 0 0-2 2z" />
      <path d="M17 9a4 4 0 0 1 0 6" />
      <path d="M20 6.5a8 8 0 0 1 0 11" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7.4 5.8 10 11 4.5" />
    </svg>
  );
}

export function Services() {
  return (
    <section className="relative z-10 bg-base section-pad" aria-labelledby="services-heading">
      <div className="wrap">
        <Eyebrow className="mb-5">03 — What we do</Eyebrow>
        <MaskedLines as="h2" lines={["Create the content.", "Distribute it.", "Amplify what works."]} className="t-h2" />
        <span id="services-heading" className="sr-only">What we do</span>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-20">
          {SERVICES.map((s) => {
            const t = TINT[s.tint];
            return (
              <Item key={s.key} className="h-full">
                <article className="grad-border-hover flex h-full flex-col rounded-[24px] bg-elevated p-8 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 lg:p-10">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: t.bg, color: t.fg }}>
                    <Icon name={s.key} />
                  </span>
                  <h3 className="t-h3 mt-7">{s.title}</h3>
                  <ul className="mt-6 flex flex-col gap-3">
                    {s.items.map((it) => (
                      <li key={it} className="flex items-start gap-3 text-[16px] text-primary/85">
                        <span className="mt-[5px] shrink-0" style={{ color: t.fg }}>
                          <Check />
                        </span>
                        {it}
                      </li>
                    ))}
                  </ul>
                  {"platforms" in s ? (
                    <div className="mt-8 flex flex-wrap gap-2" aria-label="Platforms">
                      {s.platforms.map((p) => (
                        <span key={p} className="mono flex h-9 min-w-9 items-center justify-center rounded-full border border-line px-2 text-[10px] text-muted">
                          {p}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              </Item>
            );
          })}
        </Stagger>

        <Reveal className="mt-10">
          <p className="max-w-[640px] text-[16px] text-muted">
            Start with consistent content. Add media only where it improves the business result.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
