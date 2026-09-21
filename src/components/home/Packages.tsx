import { SectionHead } from "@/components/site/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { PackageFinePrint, PackageGrid } from "@/components/site/PackageGrid";
import { ADDONS } from "@/lib/data";

export function Packages() {
  return (
    <section
      id="packages"
      className="relative z-10 bg-parchment laid section-pad"
      aria-labelledby="packages-heading"
    >
      <div data-parallax="-30" className="wrap">
        <SectionHead eyebrow="04 — Packages" lines={["Choose the package that", "matches your growth stage."]} />
        <span id="packages-heading" className="sr-only">Packages</span>

        <div className="mt-14 lg:mt-20">
          <PackageGrid />
        </div>
        <PackageFinePrint className="mt-8" />

        <Reveal className="mt-12" delay={0.1}>
          {/* "Compare every package →" used to sit on the right here, linking to
              the packages page. That page is gone and every package is already
              in the grid directly above, so the link had nowhere to send anyone.
              The row is now just the add-ons. */}
          <div className="border-t border-rule pt-6">
            <p className="eyebrow mb-4 text-graphite">Optional growth services</p>
            <ul className="flex flex-wrap gap-2">
              {ADDONS.map((a) => (
                <li key={a.name} className="chip group cursor-default">
                  {a.name} <span className="text-slate group-hover:text-bone-dim">{a.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
