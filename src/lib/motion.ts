import type { Transition, Variants } from "framer-motion";

export const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const reveal: Transition = { duration: 0.8, ease: EXPO };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: reveal },
};

export const stagger = (delay = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren } },
});

export const lineMask: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EXPO } },
};
