import { useId } from "react";

/**
 * Reelative mark: gradient play button + wordmark.
 * PLACEHOLDER geometry until the official SVG arrives; colours match the brand gradient.
 */
export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  const id = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5B2EFF" />
          <stop offset="0.55" stopColor="#E23FA7" />
          <stop offset="1" stopColor="#FF7A1A" />
        </linearGradient>
      </defs>
      <path
        d="M14 10.5c0-4.7 5.1-7.7 9.2-5.3l32 18.5c4.1 2.4 4.1 8.2 0 10.6l-32 18.5c-4.1 2.4-9.2-.6-9.2-5.3v-37z"
        fill={`url(#${id}-g)`}
      />
    </svg>
  );
}

export function Logo({ className = "", markSize = 32 }: { className?: string; markSize?: number }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark size={markSize} />
      <span className="font-display font-extrabold leading-none tracking-[-0.01em]" style={{ fontSize: markSize * 0.62 }}>
        REELATIVE
        <span className="ml-1.5 font-display font-bold text-muted" style={{ fontSize: markSize * 0.36, letterSpacing: "0.16em" }}>
          MEDIA
        </span>
      </span>
    </span>
  );
}
