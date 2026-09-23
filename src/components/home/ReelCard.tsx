"use client";

import { useEffect, useRef } from "react";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import type { Reel } from "@/lib/data";

type Props = {
  reel: Reel;
  onOpen: () => void;
  className?: string;
  style?: React.CSSProperties;
  index?: number;
};

/**
 * 9:16 reel, mounted like a print: a haze mat, a 1px decorative rule around the
 * image, and an `edge` boundary on the outside because the whole card is a button.
 * Plays muted on hover (desktop) or when centred (touch).
 */
export function ReelCard({ reel, onOpen, className = "", style, index }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  };
  const pause = () => videoRef.current?.pause();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.intersectionRatio >= 0.75 ? play() : pause()), {
      threshold: [0, 0.75],
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={`group relative shrink-0 ${className}`} style={style}>
      <div
        className="@container relative overflow-hidden rounded-[2px] border border-edge bg-haze p-[5px] shadow-[0_3px_12px_-8px_rgba(25,21,16,0.30)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:shadow-[0_26px_52px_-30px_rgba(25,21,16,0.45)]"
        style={{ aspectRatio: "9 / 16" }}
        data-cursor="PLAY"
        onPointerEnter={(e) => e.pointerType === "mouse" && play()}
        onPointerLeave={(e) => e.pointerType === "mouse" && pause()}
      >
        <button
          type="button"
          onClick={onOpen}
          className="absolute inset-[5px] overflow-hidden rounded-[1px] text-left ring-1 ring-rule"
          aria-label={`Play reel: ${reel.client}, ${reel.category}`}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            poster={reel.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={reel.src} type="video/mp4" />
          </video>

          {reel.placeholder ? <PlaceholderTag className="absolute left-3 top-3">Placeholder</PlaceholderTag> : null}
          {reel.views ? (
            <span className="eyebrow absolute right-3 top-3 rounded-[2px] bg-well px-2.5 py-1.5 text-ink">
              {reel.views}
            </span>
          ) : null}
        </button>
      </div>

      <figcaption className="mt-3.5 flex items-baseline gap-2.5">
        {index !== undefined ? <span className="mono shrink-0 text-pewter">[{String(index + 1).padStart(2, "0")}]</span> : null}
        <span className="min-w-0">
          <span className="t-h3 block !text-[16px] text-ink">{reel.client}</span>
          <span className="mono mt-1.5 block text-pewter">
            {reel.city} · {reel.category} · [{reel.duration}]
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
