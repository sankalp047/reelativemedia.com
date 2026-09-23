import type { ReactNode } from "react";

export type IconName =
  | "pin"
  | "globe"
  | "radio"
  | "people"
  | "trend"
  | "cart"
  | "bars"
  | "search"
  | "star"
  | "video"
  | "educate"
  | "prove"
  | "promote"
  | "humanize"
  | "calendar"
  | "chat"
  | "box"
  | "gear"
  | "arrowUp"
  | "check";

const PATHS: Record<IconName, ReactNode> = {
  pin: (
    <>
      <path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  radio: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <circle cx="8.5" cy="14" r="2.5" />
      <path d="M14 12h4M14 16h4M7 8l10-4" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M14.5 18.5a4 4 0 0 1 6.5-2.5" />
    </>
  ),
  trend: (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6.2" />
      <circle cx="9.5" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
    </>
  ),
  bars: <path d="M5 20v-6M10 20V9M15 20v-4M20 20V4" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  star: <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9-4.3-4.1 5.9-.8z" />,
  video: (
    <>
      <rect x="3" y="7" width="13" height="10" rx="2" />
      <path d="M16 11l5-3v8l-5-3z" />
    </>
  ),
  educate: (
    <>
      <path d="M3 9.5L12 5l9 4.5-9 4.5z" />
      <path d="M6.5 11.3V16c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-4.7M21 9.5v5" />
    </>
  ),
  prove: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5" />
    </>
  ),
  promote: (
    <>
      <path d="M3 11v2a1 1 0 0 0 1 1h2l6 4V6L6 10H4a1 1 0 0 0-1 1z" />
      <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
    </>
  ),
  humanize: <path d="M12 20s-7-4.4-7-9.5A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.5C19 15.6 12 20 12 20z" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  chat: <path d="M4 5h16v10H9l-5 4z" />,
  box: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
    </>
  ),
  arrowUp: <path d="M12 20V4M5 11l7-7 7 7" />,
  check: <path d="M4.5 12.5l5 5 10-10.5" />,
};

export function Icon({ name, size = 22, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

/* The outlined disc is the default. A spectrum fill takes WHITE (4.64 at its
   deepest stop); an ink fill takes cloud. Ink on the gradient is banned. */
const TINTS = {
  outline: "border-edge text-graphite",
  brand: "bg-brand text-white",
  ink: "bg-ink text-cloud",
} as const;

/** 48px outlined disc with a line icon. */
export function IconBadge({
  name,
  tint = "outline",
  className = "",
}: {
  name: IconName;
  tint?: keyof typeof TINTS;
  className?: string;
}) {
  return (
    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-edge ${TINTS[tint]} ${className}`}>
      <Icon name={name} />
    </span>
  );
}
