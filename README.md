# Reelative Media — website

Homepage for Reelative Media, the short-form content agency of the FunAsia Network (Dallas–Fort Worth).
Spec: [docs/homepage-spec.md](docs/homepage-spec.md). Session brief: [docs/new-session-brief.md](docs/new-session-brief.md).

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS 4 · Framer Motion 13 · GSAP 3 + ScrollTrigger · Lenis.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Structure

```
src/app/            layout (fonts, metadata, JSON-LD), page, globals.css (tokens), actions.ts (audit form)
src/components/home/  one component per homepage section, in page order
                      (02 The System + 03 What we do are one scroll-scrubbed frame sequence: ScrollVideo.tsx)
tools/scroll-video/  offline renderer for that sequence: scene.html (GSAP timeline in the site's design system),
                      render.mjs (frames via headless Chrome), encode.mjs (AVIF/WebP/proxy + manifest)
public/scroll/system/ the encoded frames the page loads (desktop 2560×1440, mobile 1080×1920) + mp4 fallback
src/components/ui/    Button, Cursor, Eyebrow, Logo, Placeholder, Reveal (motion primitives)
src/components/providers/SmoothScroll.tsx  Lenis wired into the GSAP ticker
src/lib/data.ts     all copy/data: reels, packages, add-ons, stats, testimonials, brands
public/video, public/posters   PLACEHOLDER clips (generated gradients) — replace before launch
```

Design tokens live in `globals.css` under `@theme` (colors `base`, `elevated`, `funasia`, `primary`, `muted`, `line`; fonts `display`/`sans`/`mono`) plus utilities `t-display`, `t-h2`, `t-h3`, `t-statement`, `eyebrow`, `mono`, `btn-primary`, `btn-secondary`, `chip`, `grad-border`, `wrap`, `section-pad`.

## Re-rendering the 02–03 scroll video

The sections "The System" and "What we do" are a video, not code: every word and every motion lives in
`tools/scroll-video/scene.html`. Edit copy or motion there, then:

```bash
npm run video:render -- --frames 300 --scale 1.3333333 --out /tmp/frames-desktop
npm run video:encode -- --in /tmp/frames-desktop --out public/scroll/system/desktop --name desktop
npm run video:render -- --layout mobile --frames 240 --scale 2 --out /tmp/frames-mobile
npm run video:encode -- --in /tmp/frames-mobile --out public/scroll/system/mobile --name mobile --proxy 180
```

`encode.mjs` rewrites `src/lib/scroll-video-manifest.json`; the page reads frame counts and paths from it.
The renderer needs Google Chrome installed (system Chrome, no download).

## Placeholders to replace before launch

Everything below is flagged in the UI with a dashed "placeholder" chip.

| Asset | Where | Replace in |
|---|---|---|
| ~~Hero montage~~ — done: 12s Seedance 2.5 render (Magnific), loop point cross-dissolved, 16:9 + 9:16 crop, jpg posters | `public/video/hero-*.mp4`, `public/posters/hero-*.jpg` | `Hero.tsx` |
| 12–20 client reels (9:16 mp4 < 6 MB + posters, client name, category, views) | `public/video/reel-*.mp4` | `REELS` in `src/lib/data.ts` (set `placeholder: false`) |
| Client logos (monochrome white SVG) | — | `CLIENT_LOGOS` + `TrustMarquee.tsx` |
| FunAsia, Radio Sangam, Radio Caravan, Vanakkam FM logos (SVG) | — | `FunAsia.tsx`, `TrustMarquee.tsx`, `Footer.tsx` |
| 3 filmed testimonials with captions (one in Hindi/Telugu/Tamil) | `public/video/testimonial-*.mp4` | `TESTIMONIALS` in `src/lib/data.ts` |
| Real numbers for "views generated" and "reels delivered" | — | `STATS` in `src/lib/data.ts` |
| 3 event photos, 4 creator portraits | — | `FunAsia.tsx` |
| Reelative logo SVG (current mark is drawn to match the gradient) | — | `src/components/ui/Logo.tsx` |
| Site URL, email, social links, privacy/terms pages | — | `src/lib/site.ts`, `Footer.tsx` |

## Before launch

- Audit form (`src/app/actions.ts`) currently validates, rate-limits in memory and logs to the server console. Wire Resend + HubSpot/Sheet and a durable rate limit.
- Move reels to Mux or Cloudflare Stream; keep `preload="none"` + posters.
- Add GA4 / Meta Pixel events (reel play, lightbox open, package CTA, form submit, phone tap) and CallRail number swap.
- Build the Work, Packages and About pages (nav links currently anchor to homepage sections; "About" anchors to the footer).
