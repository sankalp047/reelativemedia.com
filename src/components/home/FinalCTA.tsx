import { AuditForm } from "@/components/home/AuditForm";
import { MaskedLines, Reveal, Item, Stagger } from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";

const STEPS = [
  "We review your current social presence",
  "We identify the strongest monthly stories",
  "We recommend the right package and first shoot",
];

export function FinalCTA() {
  return (
    <section id="audit" className="relative z-10 flex min-h-[90vh] items-center overflow-hidden bg-base section-pad" aria-labelledby="audit-heading">
      <div
        className="grad-fill pointer-events-none absolute left-1/2 top-[38%] aspect-square w-[min(80vw,900px)] rounded-full opacity-60 blur-[120px] motion-safe:animate-blob"
        style={{ transform: "translate(-50%, -50%)" }}
        aria-hidden="true"
      />

      <div className="wrap relative">
        <div className="mx-auto max-w-[1100px] text-center">
          <MaskedLines
            as="h2"
            lines={["Let's turn your", "business into", "content people", "remember."]}
            className="t-display !text-[clamp(40px,6.2vw,92px)]"
          />
          <span id="audit-heading" className="sr-only">Book a content audit</span>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-[560px] text-[18px] text-muted md:text-[20px]">
              Your first conversation is a practical content audit, not a sales presentation.
            </p>
          </Reveal>
        </div>

        <Stagger className="mx-auto mt-14 grid max-w-[1000px] gap-6 md:grid-cols-3" amount={0.3}>
          {STEPS.map((s, i) => (
            <Item key={s} className="flex items-start gap-4 border-t border-line pt-5 text-left">
              <span className="mono text-primary">0{i + 1}</span>
              <span className="text-[16px] text-primary/85">{s}</span>
            </Item>
          ))}
        </Stagger>

        <div className="mx-auto mt-14 flex max-w-[560px] flex-col gap-8">
          <a
            href={SITE.phoneTel}
            className="link-underline order-first self-center font-display text-[28px] font-bold tracking-[-0.02em] md:order-last md:text-[32px]"
          >
            Or call {SITE.phone}
          </a>
          <Reveal amount={0.15}>
            <AuditForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
