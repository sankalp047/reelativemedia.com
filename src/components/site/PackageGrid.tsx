import { ButtonLink } from "@/components/ui/Button";
import { Item, Reveal, Stagger } from "@/components/ui/Reveal";
import { PACKAGES, PACKAGE_FINE_PRINT, PACKAGE_ROWS, type Package } from "@/lib/data";

const HEAD_H = "h-[148px]";
const ROW_H = "h-14";
/** The prices sit in five separate columns; the cell is floored so no column
 *  can collapse narrower than "$1,750" and knock the baseline row out of line. */
const PRICE_W = "min-w-[5ch]";

/**
 * There is deliberately NO alternating row fill here.
 *
 * The rows used to carry `odd:bg-haze` bled to each card's edge with a
 * negative margin. Because the columns are separate cards with a gutter between
 * them, those bands crossed the gutters while the cards ran vertically — two
 * grids fighting, which read as plaid. Worse, the label column's bands floated
 * as disconnected blocks on the page ground.
 *
 * Rows now separate by hairline only, and every column (labels included) shares
 * the same ROW_H and HEAD_H, so the baselines line up straight across without
 * anything having to be painted. Depth comes from the plate, not from stripes.
 */

function MostPopular() {
  return (
    <span className="eyebrow absolute -top-[11px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[2px] bg-brand px-3 py-[5px] !text-[10px] shadow-[0_2px_6px_-2px_rgba(25,21,16,0.35)]">
      Most popular
    </span>
  );
}

/** Stacked card, used below the xl breakpoint. Here the cards are independent,
 *  so the featured one may physically lift. */
function PackageCard({ p, ctaHref }: { p: Package; ctaHref: string }) {
  return (
    <article
      className={`relative flex h-full flex-col p-6 ${
        p.highlighted ? "plate-featured md:-translate-y-2" : "plate plate-raised"
      }`}
      aria-label={`${p.name} package`}
    >
      {p.highlighted ? <MostPopular /> : null}
      {/* violet, the light-ground accent: 6.51 on the cloud plate at 11px. */}
      <span className="eyebrow text-violet">{p.name}</span>
      <p className={`t-price ${PRICE_W} mt-4 text-[50px] leading-none text-ink`}>
        {p.price}
        <span className="mono ml-2 align-baseline text-pewter">/mo</span>
      </p>
      <dl className="mt-7 flex flex-col border-t border-rule">
        {PACKAGE_ROWS.map((r) => (
          <div
            key={r.key}
            className="-mx-6 flex items-baseline justify-between gap-4 border-b border-rule px-6 py-3.5 last:border-b-0"
          >
            <dt className="mono text-pewter">{r.label}</dt>
            <dd className="t-body !text-[15px] text-right text-ink">{p.rows[r.key]}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto pt-7">
        <ButtonLink href={ctaHref} variant={p.highlighted ? "primary" : "secondary"} className="w-full">
          Start with {p.name}
        </ButtonLink>
      </div>
    </article>
  );
}

/** One column of the comparison table (xl and up).
 *  NOTE: no translate or scale on the featured column — its rows must stay on
 *  the same baselines as the other four or the table stops being comparable. */
function PackageColumn({ p, ctaHref }: { p: Package; ctaHref: string }) {
  return (
    <article
      className={`relative flex h-full flex-col px-5 pb-5 pt-6 ${
        p.highlighted ? "plate-featured" : "plate plate-raised"
      }`}
      aria-label={`${p.name} package`}
    >
      {p.highlighted ? <MostPopular /> : null}
      <div className={`${HEAD_H} flex flex-col`}>
        <span className="eyebrow text-violet">{p.name}</span>
        <p className={`t-price ${PRICE_W} mt-5 whitespace-nowrap text-[42px] leading-none text-ink`}>{p.price}</p>
        <span className="mono mt-2.5 text-pewter">per month</span>
      </div>
      <ul className="flex flex-col">
        {PACKAGE_ROWS.map((r) => (
          <li
            key={r.key}
            className={`${ROW_H} t-body !text-[15px] -mx-5 flex items-center border-t border-rule px-5 text-ink`}
          >
            <span className="sr-only">{r.label}: </span>
            {p.rows[r.key]}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-7">
        <ButtonLink
          href={ctaHref}
          variant={p.highlighted ? "primary" : "secondary"}
          className="w-full !px-3 !py-3.5 !text-[11px]"
          aria-label={`Start with ${p.name}`}
        >
          Get started
        </ButtonLink>
      </div>
    </article>
  );
}

/** The five monthly packages: cards on phones and tablets, a comparison table on wide screens. */
export function PackageGrid({ ctaHref = "#audit" }: { ctaHref?: string }) {
  return (
    <>
      <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:hidden" amount={0.1}>
        {PACKAGES.map((p) => (
          <Item key={p.slug} className="h-full">
            <PackageCard p={p} ctaHref={ctaHref} />
          </Item>
        ))}
      </Stagger>

      <Stagger className="hidden xl:grid xl:grid-cols-[168px_repeat(5,minmax(0,1fr))] xl:gap-5" amount={0.1}>
        {/* The label rail is NOT a plate: it sits on the page ground so the five
            plates read as objects laid on the sheet rather than as a sixth cell.
            It carries NO hairlines: on the ground they read as stray dashes
            rather than as table rules. The shared ROW_H and HEAD_H are what keep
            the labels on the same baselines as the cells. */}
        <Item className="pt-6">
          <div className={`${HEAD_H} flex flex-col justify-end pb-5`}>
            <span className="mono text-pewter">Monthly</span>
          </div>
          <ul className="flex flex-col">
            {PACKAGE_ROWS.map((r) => (
              <li
                key={r.key}
                className={`${ROW_H} mono flex items-center justify-end pr-4 text-right text-pewter`}
              >
                {r.label}
              </li>
            ))}
          </ul>
        </Item>
        {PACKAGES.map((p) => (
          <Item key={p.slug} className="h-full">
            <PackageColumn p={p} ctaHref={ctaHref} />
          </Item>
        ))}
      </Stagger>
    </>
  );
}

export function PackageFinePrint({ className = "" }: { className?: string }) {
  return (
    <Reveal className={className}>
      {/* Terms, not a label: a fourteen-word sentence cannot be uppercase
          condensed `mono` (see the uppercase rationing rule). */}
      <p className="t-body !text-[14px] text-pewter">{PACKAGE_FINE_PRINT.join(" · ")}.</p>
    </Reveal>
  );
}
