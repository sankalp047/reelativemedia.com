/** Faint vertical column rules used as page texture, like the reference's canvas grid. */
export function GridRules({ columns = 6, className = "" }: { columns?: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="wrap relative h-full">
        <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <span key={i} className="border-l border-line last:border-r" />
          ))}
        </div>
      </div>
    </div>
  );
}
