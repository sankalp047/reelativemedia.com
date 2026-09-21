
/* ------------------------------------------------------------------ */
/* Schedule data                                                       */
/* ------------------------------------------------------------------ */

const DAYS = 28;
const STRATEGY = 1;                             // day 2
const SHOOT = 10;                               // day 11
const PLAN_DAYS = [4, 8, 13, 16, 20, 23, 26];   // days 5, 9, 14, 17, 21, 24, 27
const REVIEW = 27;                              // day 28

const VERDICT: Record<number, "keep" | "stop" | "test" | "amplify"> = {
  4: "keep", 8: "test", 13: "keep", 16: "amplify", 20: "stop", 23: "keep", 26: "amplify",
};

/**
 * Three named tints, named for what they mean on the sheet. The old map keyed
 * on violet / magenta / orange — colour names from two palettes ago that no
 * longer described anything they resolved to. Every value is a palette token:
 * cognac for capture, cognac-hi for publish, graphite for review.
 */
const TINT = {
  capture: "#7A4A1E",   // --color-cognac
  publish: "#C18A4E",   // --color-cognac-hi
  review: "#52493C",    // --color-graphite
  /* NOT transparent. `none` means "planned, not yet actioned" (a content day)
     and "stopped" — both are real states that need a visible neutral mark.
     A transparent one just read as a missing swatch. */
  none: "#7A6F5C",      // --color-edge
} as const;

type Tint = keyof typeof TINT;
type Shape = "circle" | "square" | "triangle";
type Cell = { label?: string; shape?: Shape; tint?: Tint; boxed?: boolean; dim?: boolean };

const VERDICT_LABEL = { keep: "Keep", stop: "Stop", test: "Test", amplify: "Amplify" } as const;
const VERDICT_TINT: Record<string, Tint> = { keep: "review", stop: "none", test: "capture", amplify: "publish" };

function cellFor(i: number, step: number): Cell {
  if (step === 0) {
    if (i === STRATEGY) return { label: "Strategy call", shape: "circle", tint: "capture" };
    if (PLAN_DAYS.includes(i)) return { shape: "square", tint: "none" };
    return {};
  }
  if (step === 1) {
    if (i === STRATEGY) return { label: "Strategy call", shape: "circle", tint: "capture", dim: true };
    if (i === SHOOT) return { label: "Shoot day", shape: "circle", tint: "capture", boxed: true };
    if (PLAN_DAYS.includes(i)) return { shape: "square", tint: "none" };
    return {};
  }
  if (step === 2) {
    if (i === STRATEGY) return { shape: "circle", tint: "capture", dim: true };
    if (i === SHOOT) return { label: "Shoot day", shape: "circle", tint: "capture", boxed: true };
    if (PLAN_DAYS.includes(i)) return { label: "Publish", shape: "square", tint: "publish" };
    return {};
  }
  if (i === SHOOT) return { shape: "circle", tint: "capture", dim: true };
  if (i === REVIEW) return { label: "Review", shape: "triangle", tint: "review", boxed: true };
  if (PLAN_DAYS.includes(i)) {
    const v = VERDICT[i];
    return { label: VERDICT_LABEL[v], shape: "square", tint: VERDICT_TINT[v] };
  }
  return {};
}

const LEGEND: Record<number, { shape: Shape; tint: Tint; label: string }[]> = {
  0: [
    { shape: "circle", tint: "capture", label: "Capture" },
    { shape: "square", tint: "none", label: "Content day" },
  ],
  1: [
    { shape: "circle", tint: "capture", label: "Capture" },
    { shape: "square", tint: "none", label: "Content day" },
  ],
  2: [
    { shape: "circle", tint: "capture", label: "Capture" },
    { shape: "square", tint: "publish", label: "Publish" },
  ],
  3: [
    { shape: "square", tint: "review", label: "Keep" },
    { shape: "square", tint: "none", label: "Stop" },
    { shape: "square", tint: "capture", label: "Test" },
    { shape: "square", tint: "publish", label: "Amplify" },
  ],
};

const STATUS = ["Planned", "Shoot day set", "Published", "Reviewed"];

/* ------------------------------------------------------------------ */
/* Sheet furniture                                                     */
/* ------------------------------------------------------------------ */

/** Registration marks. Slate, not bone — on paper a bone crosshair is invisible. */
function Crosshair({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`absolute h-4 w-4 ${className}`} fill="none" stroke="var(--color-slate)" strokeWidth="1.2" aria-hidden="true">
      <circle cx="12" cy="12" r="6.5" />
      <path d="M12 0v7M12 17v7M0 12h7M17 12h7" />
    </svg>
  );
}

/**
 * A spent day drops its fill and keeps only its edge, rather than sitting a
 * 0.35 alpha over a tuned colour. An outline is a knowable colour; a composite
 * is not, and the edge token already carries its own 3:1 against every ground
 * the sheet uses.
 */
function Marker({ shape, tint, dim }: { shape?: Shape; tint?: Tint; dim?: boolean }) {
  if (!shape) return null;
  const fill = dim ? "transparent" : TINT[tint ?? "none"];
  if (shape === "triangle") {
    return (
      <span
        className="inline-block h-0 w-0 shrink-0 border-x-[4px] border-b-[7px] border-x-transparent"
        style={{ borderBottomColor: fill === "transparent" ? "var(--color-ink)" : fill }}
        aria-hidden="true"
      />
    );
  }
  return (
    <span
      className={`inline-block h-[7px] w-[7px] shrink-0 ${shape === "circle" ? "rounded-full" : "rounded-[1px]"}`}
      style={
        fill === "transparent"
          ? { boxShadow: "inset 0 0 0 1.5px var(--color-edge)" }
          : { background: fill }
      }
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------ */
/* The sheet                                                           */
/* ------------------------------------------------------------------ */

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const FACTS = [
  { k: "Strategist", v: "One" },
  { k: "Approval", v: "48 hours" },
  { k: "First edits", v: "3 business days" },
  { k: "Revisions", v: "Two rounds" },
];

/** The schedule sheet: document furniture plus the 28-day grid and its legend. */
export function CallSheet({ step }: { step: number }) {
  return (
    <article className="plate relative overflow-hidden">
      <Crosshair className="left-2.5 top-2.5" />
      <Crosshair className="right-2.5 top-2.5" />
      <Crosshair className="bottom-2.5 left-2.5" />
      <Crosshair className="bottom-2.5 right-2.5" />

      <div className="flex">
        <div className="flex w-8 shrink-0 flex-col items-center justify-evenly border-r border-rule py-8" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="h-3 w-3 rounded-full bg-alabaster"
              style={{ boxShadow: "inset 0 1px 2px rgba(25, 21, 16, 0.22), 0 1px 0 rgba(255, 255, 255, 0.9)" }}
            />
          ))}
        </div>

        <div className="min-w-0 flex-1 px-5 py-6 lg:px-6">
          <div className="flex items-start justify-between gap-4 border-b border-rule pb-3">
            <p className="mono leading-[1.5]">
              Content month
              <br />
              <span className="text-slate">Monthly schedule</span>
            </p>
            <p className="mono text-right leading-[1.5]">
              RM-001
              <br />
              <span className="text-slate">Rev A</span>
            </p>
          </div>

          <dl className="mt-0 grid grid-cols-2 border-b border-rule sm:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.k} className="border-r border-rule py-2.5 pr-3 last:border-r-0">
                <dt className="mono text-[10px] text-slate">{f.k}</dt>
                <dd className="t-body mt-1 !text-[14px]">{f.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="t-h3">Four weeks · 28 days</h3>
            <p className="mono text-slate">{STATUS[step]}</p>
          </div>

          <div className="mt-3 grid grid-cols-7 border-l border-t border-rule">
            {WEEKDAYS.map((d) => (
              <div key={d} className="border-b border-r border-rule bg-linen px-2 py-1.5">
                <span className="mono text-[10px] text-ink">{d}</span>
              </div>
            ))}
            {Array.from({ length: DAYS }).map((_, i) => {
              const c = cellFor(i, step);
              const marked = Boolean(c.shape || c.label);
              // Marked days used to take a linen fill. With seven or eight of
              // them scattered across 28 cells that produced a random
              // checkerboard and destroyed the rhythm of the month — you could
              // not see the weeks any more. The only banding now is the WEEKEND
              // COLUMNS, which is a real structure in a schedule. A marked day
              // is carried by its day number going to ink and by the marker
              // sitting inline with its label.
              const weekend = i % 7 >= 5;
              return (
                <div
                  key={i}
                  className={`relative min-h-[66px] border-b border-r border-rule px-2 py-1.5 xl:min-h-[78px] ${
                    weekend ? "bg-sheet-shade" : ""
                  }`}
                >
                  {c.boxed ? (
                    <span className="pointer-events-none absolute inset-0 border-2 border-cognac" aria-hidden="true" />
                  ) : null}
                  <span
                    className={`num relative block text-[12.5px] leading-none ${
                      marked ? "text-ink" : "text-slate"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {c.label || c.shape ? (
                    <span className="relative mt-2 flex items-center gap-1.5">
                      <Marker shape={c.shape} tint={c.tint} dim={c.dim} />
                      {c.label ? (
                        <span className="mono block text-[9.5px] leading-[1.25] text-ink">{c.label}</span>
                      ) : null}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-rule pt-3">
            <span className="mono text-slate">Symbols</span>
            {(LEGEND[step] ?? LEGEND[0]).map((l) => (
              <span key={l.label} className="mono flex items-center gap-2 text-[10px]">
                <Marker shape={l.shape} tint={l.tint} />
                {l.label}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-rule pt-3">
            <p className="mono text-slate">RM-001 · Content month</p>
            <p className="mono text-slate">Page 1 of 1</p>
          </div>
        </div>
      </div>
    </article>
  );
}
