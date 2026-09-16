"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { NAV_LINKS, SITE } from "@/lib/site";
import { EXPO } from "@/lib/motion";
import { getLenis } from "@/lib/lenis-store";

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

export function Nav() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    if (open) return;
    setHidden(y > prev && y > 160);
  });

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
        className="fixed inset-x-0 top-0 z-50 h-[var(--nav-h)]"
        animate={{ y: hidden && !open ? -88 : 0 }}
        transition={{ duration: reduce ? 0 : 0.6, ease: EXPO }}
      >
        <div
          className={`absolute inset-0 border-b border-line bg-elevated/80 backdrop-blur-[16px] transition-opacity duration-500 ${
            scrolled && !open ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
        <nav className="wrap relative flex h-full items-center justify-between" aria-label="Primary">
          <a href="#top" className="relative z-10 flex shrink-0 items-center" aria-label="Reelative Media — home">
            <span className="md:hidden"><Logo markSize={24} /></span>
            <span className="hidden md:inline-flex"><Logo markSize={32} /></span>
          </a>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 xl:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-underline text-[15px] font-medium text-primary/85 hover:text-primary">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="relative z-10 flex shrink-0 items-center gap-2">
            <ButtonLink href="#audit" className="hidden md:inline-flex !py-3.5 !px-6 text-[15px]">
              Book a content audit
            </ButtonLink>
            <a
              href={SITE.phoneTel}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-primary md:hidden"
              aria-label={`Call ${SITE.phone}`}
            >
              <PhoneIcon />
            </a>
            <button
              type="button"
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-white/20 xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <motion.span className="block h-px w-5 bg-white" animate={{ rotate: open ? 45 : 0, y: open ? 3.5 : 0 }} />
              <motion.span className="block h-px w-5 bg-white" animate={{ rotate: open ? -45 : 0, y: open ? -3.5 : 0 }} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-base px-6 pb-8 pt-28"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.ul
              className="flex flex-col gap-2"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } }, hidden: {} }}
            >
              {NAV_LINKS.map((l) => (
                <motion.li
                  key={l.href}
                  variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EXPO } } }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block font-display text-[48px] font-extrabold leading-[1.05] tracking-[-0.02em]"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <div className="mt-auto flex flex-col gap-4">
              <ButtonLink href="#audit" onClick={() => setOpen(false)} className="w-full">
                Book a content audit
              </ButtonLink>
              <a href={SITE.phoneTel} className="mono text-center text-muted">
                Or call {SITE.phone}
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
