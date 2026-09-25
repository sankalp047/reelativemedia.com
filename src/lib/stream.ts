import "server-only";

/**
 * The reels, read from Cloudflare Stream rather than from a hardcoded list.
 *
 * Cloudflare is the single source of truth. Upload a video, name it, and it is
 * on the site — no code edit, no deploy. Delete it there and the card goes with
 * it, so the page can never point at a video that no longer exists.
 *
 * TWO WAYS TO CAPTION A CARD, and the richer one wins.
 *
 * 1. NAMED FIELDS on the video's `meta` object, which is an arbitrary
 *    key-value store Cloudflare keeps per video:
 *
 *      meta.business  the big line
 *      meta.info      the small line under it
 *      meta.order     pins the card to a fixed position, lower first.
 *                     WITHOUT one, a video joins the rotation — see below.
 *      meta.hidden    "true" keeps it off the site entirely
 *      meta.poster    https URL of a custom cover image
 *
 *    meta.poster exists because CLOUDFLARE STREAM CANNOT STORE A COVER IMAGE.
 *    Its thumbnails are always a frame of the video, chosen by timestamp, and
 *    there is no endpoint to upload your own. So the image lives anywhere you
 *    like — Firebase Storage, R2, the repo — and only its URL is kept here.
 *    Set it and the card uses it; leave it empty and the card falls back to
 *    Cloudflare's own frame, so this is per-video and entirely optional.
 *
 *    These need an API call to set, because the dashboard only exposes the
 *    name. Use tools/stream/set-meta.mjs.
 *
 * 2. THE NAME, for when you only have the dashboard:
 *
 *      01. Business name | Business info
 *
 *    The numeric prefix is optional and sets order. A name with no pipe still
 *    shows, using the whole name as the heading and no second line, so a fresh
 *    upload appears immediately rather than vanishing until someone learns the
 *    convention.
 *
 * Field 1 always beats field 2, so you can start in the dashboard and move to
 * structured fields later without anything changing on the page.
 *
 * ORDERED REELS ARE PINNED; THE REST ROTATE. Anything carrying meta.order sits
 * exactly where you put it, every time. Everything else is shuffled, so a reel
 * that would otherwise sit permanently on page two gets its turn at the front.
 * With nine reels and five on a page, four of them would never be seen
 * otherwise.
 *
 * The shuffle happens when the page is REGENERATED, not per visitor, and that
 * is the right trade rather than a limitation. Reshuffling per request would
 * mean either no caching — a Cloudflare call on every page view — or
 * reordering in the browser after load, which flickers and trips React's
 * hydration check. This way it costs nothing, every visitor inside a window
 * sees the same page, which matters when you are telling someone on the phone
 * to look at the second one, and over a day every reel leads many times.
 *
 * PORTRAIT VERSUS LANDSCAPE IS DETECTED, NOT DECLARED. Stream reports the
 * source dimensions, so a landscape reel opens in a landscape player on its own
 * and nobody has to remember to flag it.
 *
 * FAILURE IS NOT ALLOWED TO REACH THE PAGE. Every error path returns an empty
 * array and the caller falls back to the built-in list. A marketing homepage
 * must not go blank because a third-party API had a bad minute.
 */

export type Reel = {
  id: string;
  /** The heading. Left of the pipe. */
  name: string;
  /** The line underneath. Right of the pipe, empty if there is no pipe. */
  info: string;
  poster: string;
  src: string;
  /** Derived from the source dimensions Stream reports. Describes the VIDEO,
   *  and therefore the shape the player opens at. */
  aspect: "9/16" | "16/9";
  /**
   * True when `poster` came from meta.poster rather than from Cloudflare.
   *
   * It matters because a custom cover is artwork drawn for the card, so it
   * should fill the frame, while a Cloudflare frame of a LANDSCAPE video has to
   * be letterboxed or it loses most of the shot. In other words the poster's
   * shape and the video's shape stop being the same question.
   */
  customPoster: boolean;
  durationSec: number;
};

/** Only absolute http(s) URLs. A typo should fall back to the Stream frame
 *  rather than render a broken image on the homepage. */
function validPoster(raw: string): string {
  if (!raw) return "";
  try {
    const u = new URL(raw);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : "";
  } catch {
    return "";
  }
}

/** Cloudflare returns every meta value as a string. */
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

type StreamVideo = {
  uid: string;
  readyToStream?: boolean;
  thumbnail?: string;
  duration?: number;
  created?: string;
  meta?: Record<string, string>;
  playback?: { hls?: string; dash?: string };
  input?: { width?: number; height?: number };
};

const ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID;
const TOKEN = process.env.CLOUDFLARE_STREAM_TOKEN;

/** Ten minutes in production: Cloudflare rate-limits per account, and a
 *  marketing page does not need second-by-second accuracy about its own video
 *  library.
 *
 *  ZERO IN DEVELOPMENT, deliberately. Captions are written from the command
 *  line and checked in the browser, and a ten-minute wait between the two makes
 *  that loop unusable — you cannot tell a slow cache from a failed write. */
const REVALIDATE_SECONDS = process.env.NODE_ENV === "production" ? 600 : 0;

/** "01. Badmaash | Richardson" -> order 1, rest "Badmaash | Richardson" */
function splitName(raw: string): { order: number; name: string; info: string } {
  let rest = raw.trim();
  let order = Number.POSITIVE_INFINITY;

  const prefix = rest.match(/^(\d{1,3})[.)]\s*/);
  if (prefix) {
    order = Number(prefix[1]);
    rest = rest.slice(prefix[0].length);
  }

  const pipe = rest.indexOf("|");
  if (pipe === -1) {
    // No convention yet. Use the whole thing, minus a file extension so a raw
    // camera upload reads as "IMG_7914" rather than "IMG_7914.mp4".
    return { order, name: rest.replace(/\.[a-z0-9]{2,4}$/i, "").trim(), info: "" };
  }
  return {
    order,
    name: rest.slice(0, pipe).trim(),
    info: rest.slice(pipe + 1).trim(),
  };
}

/** Fisher-Yates. Runs once per page regeneration, never per request, so the
 *  order is stable for everyone inside a cache window. */
function shuffle<T>(xs: T[]): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function getReels(): Promise<Reel[]> {
  if (!ACCOUNT || !TOKEN) return [];

  let videos: StreamVideo[];
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/stream?limit=1000`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );
    if (!res.ok) {
      console.error("[stream] HTTP", res.status);
      return [];
    }
    const body = (await res.json()) as { success?: boolean; result?: StreamVideo[] };
    if (!body.success || !Array.isArray(body.result)) {
      console.error("[stream] unsuccessful response");
      return [];
    }
    videos = body.result;
  } catch (err) {
    console.error("[stream] fetch failed:", err);
    return [];
  }

  const entries = videos
    // Still encoding means there is nothing to play and no thumbnail to show.
    .filter((v) => v.readyToStream && v.uid)
    // "true" on meta.hidden parks a video without deleting it.
    .filter((v) => str(v.meta?.hidden).toLowerCase() !== "true")
    .map((v) => {
      const meta = v.meta ?? {};
      const parsed = splitName(str(meta.name));
      // Named fields win over anything parsed out of the name.
      const name = str(meta.business) || parsed.name;
      const info = str(meta.info) || parsed.info;
      const explicitOrder = Number(str(meta.order));
      const order = Number.isFinite(explicitOrder) && str(meta.order) !== ""
        ? explicitOrder
        : parsed.order;
      const w = v.input?.width ?? 0;
      const h = v.input?.height ?? 0;
      const custom = validPoster(str(meta.poster));
      return {
        order,
        created: v.created ?? "",
        reel: {
          id: v.uid,
          name: name || v.uid.slice(0, 8),
          info,
          customPoster: Boolean(custom),
          poster:
            custom ||
            v.thumbnail ||
            `https://customer-fmhmyy4djjklusvj.cloudflarestream.com/${v.uid}/thumbnails/thumbnail.jpg`,
          src:
            v.playback?.hls ??
            `https://customer-fmhmyy4djjklusvj.cloudflarestream.com/${v.uid}/manifest/video.m3u8`,
          aspect: w > h ? ("16/9" as const) : ("9/16" as const),
          durationSec: Math.round(v.duration ?? 0),
        },
      };
    })
    .slice();

  // Pinned first, in the order given. Everything else is shuffled, so a reel
  // that would otherwise live permanently on page two gets its turn in front.
  const pinned = entries.filter((e) => Number.isFinite(e.order)).sort((a, b) => a.order - b.order);
  const loose = shuffle(entries.filter((e) => !Number.isFinite(e.order)));
  return [...pinned, ...loose].map((e) => e.reel);
}
