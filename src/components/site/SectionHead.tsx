import type { ReactNode } from "react";
import { Kinetic } from "@/components/ui/Kinetic";
import { Marker } from "@/components/ui/Marker";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  eyebrow: string;
  /** Use \n to control the line breaks of the kinetic headline. */
  lines: string[];
  intro?: ReactNode;
  className?: string;
  invert?: boolean;
  /** Which of `lines` takes the voice gradient. See Kinetic. */
  accent?: number[];
};

/** Marker label + kinetic headline + optional intro, the header every section opens with. */
export function SectionHead({ eyebrow, lines, intro, className = "", invert = false, accent }: Props) {
  return (
    <div className={className}>
      <Marker className="mb-7" tone={invert ? "dark" : "light"}>
        {eyebrow}
      </Marker>
      <Kinetic as="h2" text={lines.join("\n")} className="t-h2" accent={accent} />
      {intro ? (
        <Reveal delay={0.12}>
          {/* t-lead carries its own 46ch measure; the old max-w + t-body-caps pair
              is gone, and the composited text-cloud/80 is now a named token. */}
          <p className={`t-lead mt-8 ${invert ? "text-slate" : "text-graphite"}`}>{intro}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
