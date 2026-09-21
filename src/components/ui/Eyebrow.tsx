/**
 * The 11px uppercase label at 0.18em. Colour is deliberately NOT set here: the
 * `eyebrow` utility stopped hard-coding --color-primary, so every call site now
 * inherits from its ground. On paper that resolves to ink; inside a dark well
 * the parent must supply text-bone / text-bone-dim / text-ash explicitly.
 */
export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}
