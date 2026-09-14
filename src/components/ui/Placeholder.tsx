/**
 * Clearly-labelled placeholder block for assets that do not exist yet.
 * Never ships to production with content behind it.
 */
export function Placeholder({
  label,
  sub,
  className = "",
  ratio = "9 / 16",
  rounded = "rounded-[24px]",
}: {
  label: string;
  sub?: string;
  className?: string;
  ratio?: string;
  rounded?: string;
}) {
  return (
    <div
      className={`placeholder-block flex flex-col items-center justify-center gap-2 text-center ${rounded} ${className}`}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`Placeholder: ${label}`}
    >
      <span className="mono text-muted">{label}</span>
      {sub ? <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted/60">{sub}</span> : null}
    </div>
  );
}

export function PlaceholderTag({ children = "Placeholder", className = "" }: { children?: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-dashed border-white/25 bg-black/40 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/70 backdrop-blur-sm ${className}`}
    >
      {children}
    </span>
  );
}
