import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";
import { Item, MaskedLines, Reveal, Stagger } from "@/components/ui/Reveal";
import { ADDONS, PACKAGES } from "@/lib/data";

export function Packages() {
  return (
    <section id="packages" className="relative z-10 bg-base section-pad" aria-labelledby="packages-heading">
      <div className="wrap">
        <Eyebrow className="mb-5">05 — Packages</Eyebrow>
        <MaskedLines as="h2" lines={["Choose the package that", "matches your growth stage."]} className="t-h2" />
        <span id="packages-heading" className="sr-only">Packages</span>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4 lg:mt-20" amount={0.1}>
          {PACKAGES.map((p) => (
            <Item key={p.name} className="h-full">
              <article
                className={`relative flex h-full flex-col rounded-[24px] bg-elevated p-7 lg:p-8 ${
                  p.highlighted ? "grad-border" : "border border-line"
                }`}
              >
                {p.highlighted ? (
                  <span className="grad-fill absolute -top-3 left-7 rounded-full px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white">
                    Most popular
                  </span>
                ) : null}
                <span className="mono text-muted">{p.name}</span>
                <p className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-display text-[56px] font-bold leading-none tracking-[-0.03em]">{p.price}</span>
                  <span className="text-[14px] text-muted">/month</span>
                </p>
                <div className="my-7 h-px bg-line" />
                <dl className="flex flex-col">
                  {p.lines.map((l) => (
                    <div key={l.label} className="flex items-baseline justify-between gap-4 border-b border-line py-3 text-[14px] last:border-b-0">
                      <dt className="text-muted">{l.label}</dt>
                      <dd className="text-right font-medium">{l.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-auto pt-8">
                  <ButtonLink href="#audit" variant={p.highlighted ? "primary" : "secondary"} className="w-full">
                    Start with {p.name}
                  </ButtonLink>
                </div>
              </article>
            </Item>
          ))}
        </Stagger>

        <Reveal className="mt-8">
          <p className="text-[14px] text-muted">
            3-month minimum · one-time onboarding $350–$500 · ad spend and premium media inventory quoted separately.
          </p>
        </Reveal>

        <Reveal className="mt-10" delay={0.1}>
          <p className="eyebrow mb-4">Add-ons</p>
          <ul className="flex flex-wrap gap-2">
            {ADDONS.map((a) => (
              <li key={a} className="chip cursor-default">
                {a}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
