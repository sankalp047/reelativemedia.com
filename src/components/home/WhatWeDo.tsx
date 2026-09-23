import { Marker } from "@/components/ui/Marker";
import { Kinetic } from "@/components/ui/Kinetic";
import { Icon } from "@/components/ui/Icon";
import { Item, Stagger } from "@/components/ui/Reveal";
import { SERVICES, SERVICES_CALLOUT } from "@/lib/data";

/** Node centres, so the rail dots sit over the middle of each card. */
const NODE_X = ["16.666%", "50%", "83.333%"];

/**
 * Three services as a pipeline: one rail, three nodes, three cards under their
 * own node. Sized to sit inside a single screen on desktop, because the
 * sections from here down stack as cards and a card that runs past the fold
 * gets clipped by the next one.
 *
 * Ground is mist; the cards are well, so the pipeline reads as three
 * lifted plates on a mat rather than as three more divs.
 */
export function WhatWeDo() {
  return (
    <section
      id="what-we-do"
      className="relative z-10 overflow-hidden bg-mist py-16 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:py-0"
      aria-labelledby="services-heading"
    >

      <div data-parallax="-30" className="wrap relative z-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <Marker className="mb-5">02 — What we do</Marker>
            {/* text-ink, not text-cloud: this headline is on the MIST band.
                The rename left it cloud-on-mist, a measured 1.11:1 — the
                headline of the services section was invisible. */}
            <Kinetic
              as="h2"
              text={"Create the content.\nDistribute it.\nAmplify what works."}
              className="t-h2 text-ink !text-[clamp(26px,3.2vw,50px)]"
              accent={[2]}
            />
            <span id="services-heading" className="sr-only">What we do</span>
          </div>
          <p className="t-lead text-graphite lg:pb-2">{SERVICES_CALLOUT}</p>
        </div>

        {/* The rail */}
        <div className="relative mt-10 hidden h-px bg-rule md:block lg:mt-12" aria-hidden="true">
          {SERVICES.map((s, i) => (
            <span
              key={s.key}
              className="absolute -top-[7.5px] h-4 w-4 -translate-x-1/2 rounded-full bg-brand"
              style={{ left: NODE_X[i] }}
            />
          ))}
        </div>

        <Stagger className="mt-7 grid gap-5 md:mt-9 md:grid-cols-3" amount={0.15}>
          {SERVICES.map((s) => (
            <Item key={s.key} className="h-full">
              <article className="card-ink flex h-full flex-col overflow-hidden">
                <span className="block h-[3px] w-full bg-brand" aria-hidden="true" />
                <div className="flex flex-1 flex-col p-6 lg:p-7">
                  <span className="t-h3 text-cloud">{s.title}</span>
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {s.items.map((it) => (
                      <li key={it} className="t-body flex items-start gap-3 text-slate !text-[15px]">
                        <Icon name="check" size={14} className="mt-[5px] shrink-0 text-pink" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  {"platforms" in s ? (
                    <ul className="mt-auto flex flex-wrap gap-1.5 pt-6" aria-label="Platforms">
                      {s.platforms.map((p) => (
                        <li
                          key={p}
                          className="mono flex h-7 w-7 items-center justify-center rounded-[2px] border border-edge text-[10px] text-steel"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
