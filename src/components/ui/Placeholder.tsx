/**
 * Clearly-labelled placeholder block for assets that do not exist yet.
 * Reads as an empty frame on paper, never as a dark hole — see the
 * `placeholder-block` utility in globals.css.
 * Never ships to production with content behind it.
 */
export function Placeholder({
  label,
  sub,
  className = "",
  ratio = "9 / 16",
  rounded = "rounded-[2px]",
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
      <span className="mono text-graphite">{label}</span>
      {sub ? <span className="mono text-slate">{sub}</span> : null}
    </div>
  );
}

export function PlaceholderTag({ children = "Placeholder", className = "" }: { children?: string; className?: string }) {
  return (
    <span
      className={`mono inline-flex items-center rounded-[2px] border border-dashed border-edge bg-chalk px-2 py-1 text-graphite ${className}`}
    >
      {children}
    </span>
  );
}
