"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

const FINE_POINTER = "(pointer: fine)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(FINE_POINTER);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const getSnapshot = () => window.matchMedia(FINE_POINTER).matches;
const getServerSnapshot = () => false;

/**
 * Desktop-only custom cursor: a 12px dot that grows to a 72px labelled circle
 * over any element carrying `data-cursor="PLAY" | "DRAG" | ...`.
 *
 * Two-part construction, because the cursor crosses both halves of the palette
 * in one drag: an INK disc, which carries it on alabaster/chalk/linen (16.10:1
 * on the page ground), inside a 1px ALABASTER ring, which carries it on the
 * 35mm stock in section 3 (17.74:1) where the disc itself is 1.10:1 and would
 * otherwise vanish under the `data-cursor="DRAG"` hand-off in DesktopStrip.
 * The label is alabaster either way. `mix-blend-difference` is deliberately
 * gone: differenced against warm paper it returned a near-white disc.
 */
export function Cursor() {
  const reduce = useReducedMotion();
  const finePointer = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const enabled = finePointer && !reduce;
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 60, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 900, damping: 60, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as Element | null)?.closest?.("[data-cursor]");
      setLabel(el ? el.getAttribute("data-cursor") : null);
    };
    const up = () => setDown(false);
    const dn = () => setDown(true);
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.body.classList.remove("has-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const big = label !== null;
  const size = big ? 72 : 12;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full bg-ink text-alabaster ring-1 ring-alabaster"
        animate={{ width: size, height: size, scale: down ? 0.85 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <motion.span
          className="mono text-[10px] tracking-[0.2em]"
          animate={{ opacity: big ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
