"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { LogoMark, Wordmark } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { NAV_LINKS, SITE } from "@/lib/site";
import { EXPO } from "@/lib/motion";
import { getLenis } from "@/lib/lenis-store";

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

/**
 * THE BAR IS CLOUD, ALWAYS — the same #F7F9FC as the System band — in both of
 * its states, over the dark hero and once scrolled. It used to be transparent
 * over the hero and a midnight scrim after, and that hid the wordmark: the
 * type in reelative-wordmark.webp is navy (#041230) and simply vanished on a
 * midnight bar, along with the ink-on-ink menu button. A light bar is the
 * ground the logo was drawn for, so the gradient mark, the navy type and the
 * ink links all read without a knockout version of anything.
 *
 * Inactive links are text-graphite (7.18:1 on cloud); the current page is
 * text-ink (18.62:1) plus a 1px spectrum rule beneath it. The state is carried
 * by aria-current as well, so colour is never the only indicator.
 *
 * `text-ink` is set on the header itself: it sits outside every bg-* ground,
 * so without it the bar would inherit the body's cloud type.
 */
const linkCls =
  "eyebrow relative inline-block transition-colors duration-300 after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:bg-brand after:transition-transform after:duration-500 after:content-['']";
const linkIdle = "text-graphite hover:text-ink after:scale-x-0";
const linkActive = "text-ink after:scale-x-100";

/**
 * One nav item points off-site. next/link would render a working anchor, but it
 * would also try to prefetch and client-navigate a third-party origin, and it
 * gives no target/rel — so an external destination gets a plain anchor with
 * noopener, the same treatment the footer's station links get.
 */
function NavItem({
  href,
  external,
  className,
  onClick,
  children,
  ...rest
}: {
  href: string;
  external?: boolean;
  className: string;
  onClick?: () => void;
  children: React.ReactNode;
} & { "aria-current"?: "page" | undefined }) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}

export function Nav() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => !href.includes("#") && pathname === href;

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    if (open) return;
    setHidden(y > prev && y > 180);
  });

  // Reset the bar on route change by adjusting state during render, which React
  // prefers over a setState inside an effect.
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setHidden(false);
    setOpen(false);
  }

  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] text-ink"
        animate={{ y: hidden && !open ? -96 : 0 }}
        transition={{ duration: reduce ? 0 : 0.6, ease: EXPO }}
      >
        {/* Opaque from the first pixel of scroll and before it. The only thing
            that changes once scrolled is a soft cast shadow, so the bar reads
            as lifting off the page rather than appearing. */}
        <div
          className={`absolute inset-0 border-b border-rule bg-cloud/94 backdrop-blur-[14px] transition-shadow duration-500 ${
            scrolled && !open ? "shadow-[0_12px_32px_-22px_rgba(7,11,23,0.5)]" : ""
          }`}
          aria-hidden="true"
        />
        <nav className="wrap relative flex h-full items-center justify-between gap-4" aria-label="Primary">
          {/* ONE left cluster, not three siblings. The bar is justify-between,
              so every direct child becomes a distribution point: adding the
              symbol as its own child pushed the menu button to the middle of the
              bar, straight under the centred wordmark. Grouping keeps it
              [left] … [right] with the type floating between them. */}
          <div className="relative z-10 flex shrink-0 items-center gap-5">
            {/* The gradient symbol. The lockup used to carry the symbol and the
                type together in the centre; they are split now, so this is the
                only place the symbol appears and the centre is type alone. */}
            <Link
              href="/"
              className="shrink-0"
              aria-label="Reelative Media — home"
              onClick={() => setOpen(false)}
            >
              <LogoMark size={34} />
            </Link>

            {/* Page links on wide screens, menu button below */}
            <ul className="hidden shrink-0 items-center gap-7 xl:flex">
            {NAV_LINKS.slice(0, 3).map((l) => (
              <li key={l.href}>
                <NavItem
                  href={l.href}
                  external={"external" in l ? l.external : undefined}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`${linkCls} ${isActive(l.href) ? linkActive : linkIdle}`}
                >
                  {l.label}
                </NavItem>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="btn btn-secondary !px-4 !py-2.5 !text-[11px] xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="flex flex-col gap-[3px]">
              <motion.span className="block h-px w-3.5 bg-current" animate={{ rotate: open ? 45 : 0, y: open ? 2 : 0 }} />
              <motion.span className="block h-px w-3.5 bg-current" animate={{ rotate: open ? -45 : 0, y: open ? -2 : 0 }} />
            </span>
            {/* Icon-only on the narrowest screens. With the symbol now taking
                the far left, a labelled button runs to x=178 at 375px wide and
                the centred wordmark starts at 142 — they overlap. Dropping the
                word buys ~50px, which is more than the collision. The button
                keeps its aria-expanded/aria-controls and the label stays from
                sm up, so nothing is lost to assistive tech. */}
            <span className="hidden sm:inline">{open ? "Close" : "Menu"}</span>
            <span className="sr-only sm:hidden">{open ? "Close menu" : "Open menu"}</span>
          </button>
          </div>

          {/* Centre: the type on its own, a step larger than the lockup used to
              render it. In the old lockup at height 30 the type came out at
              21px; 26 here is the same type set bigger, not a bigger image.
              aria-hidden and no link: the symbol to its left is already the
              labelled home link, so repeating it would give screen readers two
              identical destinations in one bar. */}
          <span className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2" aria-hidden="true">
            <span className="md:hidden"><Wordmark height={21} alt="" /></span>
            <span className="hidden md:inline-flex"><Wordmark height={26} alt="" /></span>
          </span>

          {/* Right: remaining links + CTA */}
          <div className="relative z-10 flex shrink-0 items-center gap-7">
            <ul className="hidden items-center gap-7 xl:flex">
              {NAV_LINKS.slice(3).map((l) => (
                <li key={l.href}>
                  <NavItem
                    href={l.href}
                    external={"external" in l ? l.external : undefined}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={`${linkCls} ${isActive(l.href) ? linkActive : linkIdle}`}
                  >
                    {l.label}
                  </NavItem>
                </li>
              ))}
            </ul>
            <ButtonLink href="#audit" className="hidden !py-2.5 !px-5 !text-[11px] md:inline-flex">
              Book an audit
            </ButtonLink>
            <a
              href={SITE.phoneTel}
              className="btn btn-secondary !h-10 !w-10 !p-0 md:hidden"
              aria-label={`Call ${SITE.phone}`}
            >
              <PhoneIcon />
            </a>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-cloud px-5 pb-8 pt-28 text-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >

            <motion.ul
              className="relative flex flex-col"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } }, hidden: {} }}
            >
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  className="border-b border-rule"
                  variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EXPO } } }}
                >
                  <NavItem
                    href={l.href}
                    external={"external" in l ? l.external : undefined}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className="flex items-baseline gap-4 py-3.5"
                  >
                    <span className="mono text-pewter">[{String(i + 1).padStart(2, "0")}]</span>
                    <span className="t-display !text-[clamp(38px,13vw,72px)] text-ink">{l.label}</span>
                  </NavItem>
                </motion.li>
              ))}
            </motion.ul>

            <div className="relative mt-auto flex flex-col gap-3 pt-8">
              <ButtonLink href="#audit" onClick={() => setOpen(false)} className="w-full">
                Book a content audit
              </ButtonLink>
              <a href={SITE.phoneTel} className="mono text-center text-pewter">
                Or call {SITE.phone}
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
