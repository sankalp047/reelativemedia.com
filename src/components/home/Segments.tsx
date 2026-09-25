import { SegmentsCarousel } from "@/components/home/SegmentsCarousel";
import { getReels, type Reel } from "@/lib/stream";
import { SEGMENTS, streamHls, streamPoster } from "@/lib/data";

/**
 * Decides WHERE the reels come from; SegmentsCarousel decides how they look.
 *
 * A server component, so the Cloudflare token stays on the server and the
 * browser only ever receives the finished list. The fetch is cached, so this
 * costs one Cloudflare request every ten minutes rather than one per visitor.
 *
 * THE FALLBACK IS THE POINT OF SPLITTING THIS OUT. If Cloudflare is down, the
 * token is wrong, or the env vars are missing on a new deploy, `getReels`
 * returns nothing and the section quietly serves the built-in list instead. A
 * marketing homepage does not get to go blank because someone else's API had a
 * bad minute, and a missing environment variable should not be a visible
 * outage.
 */

/** Built from the committed data, used only when Cloudflare gives us nothing. */
function fallbackReels(): Reel[] {
  return SEGMENTS.filter((s) => s.streamId).map((s) => ({
    id: s.id,
    name: s.name,
    info: s.reel,
    poster: s.poster ?? streamPoster(s.streamId as string),
    src: streamHls(s.streamId as string),
    aspect: s.aspect ?? "9/16",
    customPoster: Boolean(s.poster),
    durationSec: 0,
  }));
}

export async function Segments() {
  const live = await getReels();
  return <SegmentsCarousel reels={live.length ? live : fallbackReels()} />;
}
