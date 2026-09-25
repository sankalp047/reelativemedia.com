import { SegmentsCarousel } from "@/components/home/SegmentsCarousel";
import { getReels, type Reel } from "@/lib/stream";
import { SEGMENTS, SEGMENTS_NOTE, streamHls, streamPoster } from "@/lib/data";

/**
 * Decides WHERE the reels come from and WHICH band each belongs to;
 * SegmentsCarousel decides how they look.
 *
 * Both exports are server components, so the Cloudflare token stays on the
 * server and the browser only receives a finished list. They each call
 * getReels(), which is one network request between them: Next dedupes
 * identical fetches within a render, and the result is cached besides.
 *
 * THE FALLBACK IS THE POINT OF SPLITTING THIS OUT. If Cloudflare is down, the
 * token is wrong, or the env vars are missing on a new deploy, getReels returns
 * nothing and the main band quietly serves the built-in list instead. A
 * marketing homepage does not get to go blank because someone else's API had a
 * bad minute, and a missing environment variable should not be a visible
 * outage. Behind the scenes has no fallback by design: an empty BTS band simply
 * does not render, which is better than inventing one.
 */

/** Built from the committed data, used only when Cloudflare gives us nothing. */
function fallbackReels(): Reel[] {
  return SEGMENTS.filter((s) => s.streamId).map((s) => ({
    id: s.id,
    name: s.name,
    info: s.reel,
    section: "reels" as const,
    poster: s.poster ?? streamPoster(s.streamId as string),
    src: streamHls(s.streamId as string),
    aspect: s.aspect ?? "9/16",
    customPoster: Boolean(s.poster),
    durationSec: 0,
  }));
}

export async function Segments() {
  const live = await getReels();
  const reels = (live.length ? live : fallbackReels()).filter((r) => r.section === "reels");
  return (
    <SegmentsCarousel
      reels={reels}
      id="segments"
      eyebrow="Segments"
      lines={["Built for businesses people", "can see, visit and trust."]}
      intro={SEGMENTS_NOTE}
      label="The businesses we make content for"
    />
  );
}

/**
 * The same carousel, filtered to the reels tagged `section: bts`.
 *
 * It renders nothing at all when no video carries that tag, so the band
 * appears the moment the first one is tagged and vanishes if they all go. A
 * mist ground separates it from the cloud band above without changing any of
 * the card tokens, which assume a light surface.
 */
export async function BehindTheScenes() {
  const reels = (await getReels()).filter((r) => r.section === "bts");
  return (
    <SegmentsCarousel
      reels={reels}
      id="bts"
      eyebrow="BTS"
      /* One line, not two. A supporting band does not need a headline that
         occupies 146px before anyone sees a card. */
      lines={["Behind the scenes."]}
      accent={[0]}
      compact
      intro="How the reels above get made."
      ground="bg-mist"
      label="Behind the scenes"
    />
  );
}
