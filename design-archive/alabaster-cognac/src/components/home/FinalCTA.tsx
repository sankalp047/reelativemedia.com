import { AuditForm } from "@/components/home/AuditForm";
import { Kinetic } from "@/components/ui/Kinetic";
import { Marker } from "@/components/ui/Marker";
import { Item, Reveal, Stagger } from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";

const STEPS = [
  "We review your current social presence",
  "We identify the strongest monthly stories",
  "We recommend the right package and first shoot",
];

/**
 * The closing dark well.
 *
 * Ground is flat --color-noir with the generated salon photograph laid over it
 * at opacity 0.5 and NORMAL blending — the same treatment as the Statement.
 * Because normal blending at 0.5 can only interpolate between noir (L 0.00613)
 * and the file's own maximum (L 0.00900), the composited worst case stays below
 * the --scrim-floor ceiling, so every ratio below is quoted against #1C1913:
 * bone 15.54, bone-dim 8.69, ash 6.61, cognac-hi 5.85.
 */
export function FinalCTA() {
  return (
    <section
      id="audit"
      data-ground="dark"
      className="relative z-10 overflow-hidden bg-noir text-bone section-pad"
      aria-labelledby="audit-heading"
    >
      {/* The one generated photograph. 1200 to phones, 2400 from md up.
          Never background-attachment: fixed — it thrashes on iOS and fights Lenis. */}
      <div
        aria-hidden="true"
        data-parallax="110"
        className="pointer-events-none absolute inset-x-0 -inset-y-[14%] z-0 bg-[url('/images/ground/salon-1200.webp')] bg-cover bg-center bg-no-repeat opacity-50 md:bg-[url('/images/ground/salon-2400.webp')]"
      />

      <div data-parallax="-40" className="wrap relative z-10">
        <Marker className="mb-7" tone="dark">Next step</Marker>
        <Kinetic
          as="h2"
          text={"Let's turn your business\ninto content\npeople remember."}
          className="t-statement max-w-[20ch] !text-[clamp(34px,6vw,96px)] text-bone"
          stagger={0.018}
        />
        <span id="audit-heading" className="sr-only">Book a content audit</span>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-16">
          <div>
            <Reveal>
              <p className="t-lead text-bone-dim">
                Your first conversation is a practical content audit, not a sales presentation.
              </p>
            </Reveal>
            <Stagger className="mt-10 flex flex-col border-t border-rule-dark" amount={0.3}>
              {STEPS.map((s, i) => (
                <Item key={s}>
                  <p className="t-body flex items-start gap-4 border-b border-rule-dark py-4 text-bone">
                    <span className="mono shrink-0 text-cognac-hi">[{String(i + 1).padStart(2, "0")}]</span>
                    <span>{s}</span>
                  </p>
                </Item>
              ))}
            </Stagger>
            {/* The two routes, said out loud. The form on the right is the one
                most people take, but a business owner who will not type a phone
                number into a form should not have to hunt for an address —
                email and phone both sit here as first-class options.
                cognac-hi is 5.85:1 on this well; bone is 15.54. */}
            <Reveal className="mt-10" delay={0.1}>
              <p className="eyebrow mb-4 text-ash">Two ways to reach us</p>
              <a
                href={`mailto:${SITE.salesEmail}?subject=${encodeURIComponent("Content enquiry — Reelative Media")}`}
                className="link-underline t-h2 block !text-[clamp(22px,2.6vw,36px)] text-bone"
              >
                {SITE.salesEmail}
              </a>
              <a href={SITE.phoneTel} className="link-underline t-h2 mt-3 block !text-[clamp(22px,2.6vw,36px)] text-bone">
                {SITE.phone}
              </a>
              <p className="t-body mt-5 !text-[14px] text-bone-dim">
                Or leave a name and number on the right and a strategist calls you back within one business day.
              </p>
            </Reveal>
          </div>

          <Reveal amount={0.15}>
            <AuditForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
