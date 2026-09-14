"use client";

import { useEffect, useRef } from "react";
import { PlaceholderTag } from "@/components/ui/Placeholder";
import type { Reel } from "@/lib/data";

type Props = {
  reel: Reel;
  onOpen: () => void;
  className?: string;
  style?: React.CSSProperties;
};

/** 9:16 reel card. Plays muted on hover (desktop) or when centred (touch). */
export function ReelCard({ reel, onOpen, className = "", style }: Props) {
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
    <article
      className={`group relative shrink-0 overflow-hidden rounded-[24px] bg-elevated ${className}`}
      style={{ aspectRatio: "9 / 16", ...style }}
      data-cursor="PLAY"
      onPointerEnter={(e) => e.pointerType === "mouse" && play()}
      onPointerLeave={(e) => e.pointerType === "mouse" && pause()}
    >
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 h-full w-full text-left"
        aria-label={`Play reel: ${reel.client}, ${reel.category}`}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
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
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.1) 45%, rgba(10,10,15,0) 100%)" }}
          aria-hidden="true"
        />

        {reel.placeholder ? (
          <PlaceholderTag className="absolute left-4 top-4">Placeholder reel</PlaceholderTag>
        ) : null}
        {reel.views ? (
          <span className="chip absolute right-4 top-4 !border-white/15 !bg-black/35 !px-3 !py-1.5 !text-[10px] !text-white/85 backdrop-blur-sm">
            {reel.views}
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
          <span className="text-[16px] font-semibold leading-tight text-primary">{reel.client}</span>
          <span className="flex items-center gap-2">
            <span className="chip !px-2.5 !py-1 !text-[10px]">{reel.category}</span>
            <span className="mono text-[10px] text-white/55">
              {reel.city} · [{reel.duration}]
            </span>
          </span>
        </div>
      </button>
    </article>
  );
}
