import { Logo } from "@/components/ui/Logo";
import { FUNASIA_BRANDS } from "@/lib/data";
import { SITE } from "@/lib/site";

/**
 * Footer links are the TEXT face at 15px in slate (7.86:1 on abyss), not
 * the uppercase t-body-caps they used to be — a column of uppercase links is the
 * single densest patch of poster vocabulary left on the site. The underline is
 * the shared `link-underline`, which draws in the spectrum gradient.
 *
 * The Services and Company link columns are gone. Every destination in them was
 * an anchor to a section already reachable from the nav, so the footer was
 * repeating the page's own table of contents twice over. What is left is the two
 * things the footer is actually for: the network it belongs to, and how to reach
 * it. The FooterLink helper went with them — it existed to switch between
 * next/link and a plain anchor, and nothing here routes any more.
 */
const FOOTER_LINK = "link-underline t-body !text-[15px] text-slate hover:text-cloud transition-colors duration-300";

export function Footer() {
  return (
    // No top border: the FinalCTA well runs straight into this one, and a rule
    // between two dark grounds only announces the seam.
    <footer className="relative z-10 bg-abyss" data-ground="dark" aria-label="Footer">
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:py-24">
        <div>
          <p className="eyebrow mb-6 text-steel">FunAsia Network</p>
          <ul className="flex flex-col gap-3">
            {FUNASIA_BRANDS.map((b) => (
              <li key={b.id}>
                <a href={b.href} target="_blank" rel="noopener noreferrer" className={FOOTER_LINK}>
                  {b.name}
                </a>
                <span className="mono ml-2 text-steel">{b.meta}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-6 text-steel">Contact</p>
          <ul className="flex flex-col gap-3">
            <li><a href={SITE.phoneTel} className={FOOTER_LINK}>{SITE.phone}</a></li>
            <li><a href={`mailto:${SITE.salesEmail}`} className={FOOTER_LINK}>{SITE.salesEmail}</a></li>
            <li className="t-body !text-[15px] text-steel">{SITE.address}</li>
            {/* Social icons — parked. All four were href="#", so they looked
                like working links and went nowhere, which is worse than not
                showing them: a visitor who clicks Instagram and stays on the
                footer assumes the site is broken. Restore by uncommenting and
                replacing each "#" with the real profile URL.
            <li className="flex gap-2 pt-3" aria-label="Social">
              {["IG", "FB", "YT", "LI"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="mono flex h-9 w-9 items-center justify-center rounded-[2px] border border-edge-dark text-steel transition-colors duration-300 hover:bg-cloud hover:text-ink"
                  aria-label={`${s} (link pending)`}
                >
                  {s}
                </a>
              ))}
            </li>
            */}
          </ul>
        </div>
      </div>

      {/* Oversized wordmark, set in Bodoni Moda — which has opsz and wght only,
          no wdth axis, so the old inline "wdth" 62 request was silently doing
          nothing. line-height must stay at or above 1 and the tracking must stay
          NEGATIVE: a tracked Didone caps line is the failure mode. The negative
          bottom margin trims the empty descender space this all-caps word never
          uses. RE-VERIFY THE CLIP at 390px and at 1440px — Bodoni's caps sit
          differently in the line box than the face this was tuned against, so
          the overflow-hidden parent can eat the cap tops or leave a gap. */}
      <div className="overflow-hidden border-t border-rule-dark">
        <p
          className="wrap select-none font-display"
          style={{
            color: "var(--color-rule-dark)",
            fontSize: "clamp(42px, 16.4vw, 232px)",
            lineHeight: 1,
            marginBottom: "-0.14em",
            fontOpticalSizing: "none",
            fontVariationSettings: '"opsz" 96, "wght" 400',
            letterSpacing: "-0.01em",
          }}
          aria-hidden="true"
        >
          REELATIVE
        </p>
      </div>

      <div className="wrap flex flex-col gap-5 border-t border-rule-dark py-7 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {/* The ONLY place on the site that takes the cloud knockout lockup. */}
          <Logo height={24} tone="dark" />
          <span className="hidden h-4 w-px bg-rule-dark md:block" />
          <p className="t-body !text-[13px] text-steel">Reelative Media is a part of FunAsia Network</p>
        </div>
        {/* Privacy and Terms are gone. Both pointed at "#", so they looked like
            working links and went nowhere — worse than not offering them, since
            a visitor who clicks one and stays put assumes the site is broken.
            Put them back only alongside real pages. */}
        <p className="mono text-steel">© {new Date().getFullYear()} Reelative Media. All rights reserved.</p>
      </div>
    </footer>
  );
}
