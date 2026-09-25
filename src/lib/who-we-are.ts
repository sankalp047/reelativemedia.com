/**
 * The "who we are" band's video and copy, in one place so neither needs a
 * component edit to change.
 *
 * SWAP THE VIDEO HERE. `src` takes any direct MP4 URL, which covers both cases
 * you asked about: a file committed to /public/video, or a Firebase Storage
 * download URL. Paste the Firebase URL in and nothing else changes.
 *
 * It is deliberately NOT a Cloudflare Stream id. Stream serves HLS, which
 * Chrome and Firefox cannot play without hls.js attaching Media Source
 * Extensions, and loading that library for a silent looping background is a
 * lot of machinery for a decorative clip. A plain MP4 plays everywhere with no
 * JavaScript at all.
 *
 * KEEP IT SMALL. This autoplays for every visitor on the second screen of the
 * page, so it is pure download cost whether or not anyone watches it. Under
 * about 3MB, and encode it muted — a silent track still ships bytes.
 */
export const WHO_WE_ARE = {
  /** Direct MP4. Swap in a Firebase Storage URL any time; nothing else moves. */
  src: "/video/who-we-are.mp4",
  /** Shown before the video decodes and whenever motion is turned off. */
  poster: "/posters/who-we-are.jpg",
  /**
   * The card's shape. The clip is CROPPED to fill it, so this has to match the
   * footage or content is lost.
   *
   * 9/16 here, and not by default. The clip is a full-frame portrait reel with
   * the logo at the top and a phone number at the bottom of its closing frame;
   * a 4:5 card cut both of them off. Check the first and last second of any
   * replacement before narrowing this.
   */
  aspect: "9/16" as "9/16" | "4/5" | "16/9" | "1/1",

  eyebrow: "Who we are",
  /** Two lines. The second takes the voice gradient. */
  lines: ["A content team", "inside a media network."],
  /** The lede. One paragraph, no more — the sections below do the detail. */
  lead:
    "Reelative Media makes short-form video for Dallas–Fort Worth businesses. We plan, shoot and edit a month of reels from a single shoot day, publish them across Instagram, Facebook, YouTube and TikTok, and report on what worked.",
  /**
   * Three plain facts. Not claims, and no numbers we cannot stand behind —
   * an invented statistic is the fastest way to lose a room.
   */
  points: [
    "One planned shoot day produces a month of content.",
    "A strategist, a calendar and one approval window.",
    "Backed by FunAsia Network's radio, social and events reach across DFW.",
  ],
} as const;
