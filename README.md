# Reelative Media — website

Website for Reelative Media, the short-form content agency of the FunAsia Network (Dallas–Fort Worth).

Design system: [docs/design-system.md](docs/design-system.md) — "Alabaster & Cognac", adopted 17 Sep 2026.
Warm alabaster paper, one Newsreader voice, one cognac accent, and the footage as the only other colour.
Read it before touching colour or type: the contrast traps in it were measured, not eyeballed.
Content (copy only): [docs/content-prompt.md](docs/content-prompt.md). The original dark spec in
[docs/homepage-spec.md](docs/homepage-spec.md) is superseded and kept as history.

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS 4 · Framer Motion 13 · GSAP 3 + ScrollTrigger · Lenis ·
Newsreader (variable, `opsz`) for display and Instrument Sans (variable, `wdth`) for text.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
npm run grounds:build   # regenerate the two dark-well grounds (asserts a luminance ceiling)
```

## Structure

```
src/app/            layout (fonts, metadata, JSON-LD, Nav + Footer), globals.css (tokens), actions.ts (audit form)
                    page.tsx (home) · work/ · system/ · packages/ · about/ · not-found.tsx · sitemap.ts · robots.ts
src/components/home/  one component per homepage section, in page order
                      Nav, Footer and FinalCTA (audit form) are shared by every page
                      ScrollVideo.tsx is NOT mounted — see "The retired scroll video" below
src/components/site/  inner-page primitives: PageHero, SectionHead, Callout, PackageGrid (cards < xl, comparison table ≥ xl)
src/components/work/  ReelGrid (filterable grid of every reel + lightbox) for /work
tools/scroll-video/  offline renderer for that sequence: scene.html (GSAP timeline in the site's design system),
                      render.mjs (frames via headless Chrome), encode.mjs (AVIF/WebP/proxy + manifest)
public/scroll/system/ the encoded frames the page loads (desktop 2560×1440, mobile 1080×1920) + mp4 fallback
src/components/ui/    Kinetic (split-text headlines), Marker (section label — a cognac rule, not a swipe),
                      GridRules, Button, Cursor, Eyebrow, Icon, Logo, Placeholder, Reveal
tools/grounds/       build.mjs — generates public/images/ground/ and THROWS if any pixel exceeds the
                      --scrim-floor luminance ceiling the contrast figures are quoted against
src/components/providers/SmoothScroll.tsx  Lenis wired into the GSAP ticker
src/lib/data.ts     all copy/data, transcribed from the client pitch deck (PDF, 16 Sep 2026): reels, packages,
                    add-ons, expanded services, content jobs and examples, scorecard, onboarding, 90-day plan, brands
src/lib/site.ts     contact details, nav links, indexable routes
public/video, public/posters   PLACEHOLDER clips (generated gradients) — replace before launch
```

## Pages

| Route | Deck slides it carries |
|---|---|
| `/` | Hero, what we make (business types), statement, the system, what we do, packages, FunAsia advantage, content audit. **Results is commented out** in `page.tsx` until real testimonials exist |
| `/work` | Reel grid with filters, content strategy (educate / prove / promote / humanize), content examples by business |
| `/system` | What gets in the way, the four steps, four-week process + service rhythm, what we do, monthly scorecard, onboarding |
| `/packages` | Five-package comparison (6-month minimum), optional growth services, expanded services, first 90 days |
| `/about` | The opportunity (8.5M), why Reelative, FunAsia advantage, why now |

Every page ends with the content-audit form (`#audit`), so the nav button works everywhere.
Package reel counts are shown exactly as the deck states them ("2 + 1", "6 + 1 podcast"); the deck does not define the "+ n".

## The retired scroll video

**Removed from the homepage on 17 Sep 2026.** The frames bake in the old dark design and its old
typeface, so after the redesign it read as a section from a different site. `ScrollVideo.tsx`, the
manifest, `tools/scroll-video/` and the 32 MB of assets under `public/scroll/` are all still in the
repo — re-add `<ScrollVideo />` to `src/app/page.tsx` to bring it back.

The content it carried was rebuilt as real sections instead: `System.tsx` and `WhatWeDo.tsx`. The
month grid the video was built around survives there as DOM — a sticky 28-day calendar that changes
state as each of the four steps scrolls past. Deliberately no asset counters: the video showed
"12 reels", which came from the superseded PowerPoint and overstates every package in the current
deck. Section content and its provenance: `docs/system-section-content.md`.

The sections "The System" and "What we do" were a video, not code. The final sequences were generated with
Seedance 2.5 (Magnific) from keyframes rendered out of `tools/scroll-video/scene.html`: one 4 s clip per
transition between the eight holds, concatenated and sampled to frames (see docs/system-scroll-video-brief.md).
To change copy, edit the scene, re-render the hold stills (`--sample` with the hold times) and regenerate the
affected clips. The scene can also be rendered directly as a fallback:

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
| 12–20 client reels (9:16 mp4 < 6 MB + posters, client name, category, views) — **`/work` only; the homepage no longer claims a portfolio** | `public/video/reel-*.mp4` | `REELS` in `src/lib/data.ts` (set `placeholder: false`) |
| Client logos (monochrome white SVG) | — | `CLIENT_LOGOS` + `TrustMarquee.tsx` |
| FunAsia, Radio Sangam, Radio Caravan, Vanakkam FM logos (SVG) | — | `FunAsia.tsx`, `TrustMarquee.tsx`, `Footer.tsx` |
| 3 filmed testimonials with captions (one in Hindi/Telugu/Tamil) | `public/video/testimonial-*.mp4` | `TESTIMONIALS` in `src/lib/data.ts` |
| 3 event photos, 4 creator portraits | — | `FunAsia.tsx` |
| ~~Reelative logo~~ — done: the real lockup, extracted from the client deck and cut out. A **vector original is still worth getting** for dark backgrounds and print | `public/logo/` | `src/components/ui/Logo.tsx` |
| Sections 02–03 video still carries the **old** dark design and typeface | `public/scroll/system/` | re-render + regenerate (paid) |
| Site URL, email, social links, privacy/terms pages | — | `src/lib/site.ts`, `Footer.tsx` |

## The "what we make" section

Pre-launch there is no portfolio, so the homepage's first section shows the ten
business types Reelative sells to and what a month looks like for each: a reel
idea, a graphic idea and the action it drives. Data is `SEGMENTS` in
`src/lib/data.ts`; the section is `src/components/home/Work.tsx` and keeps the
pinned horizontal scrub the reel slider used.

The card imagery in `public/images/segments/` is AI-generated subject and mood
photography — interiors and objects, deliberately **never people** — so it
cannot be read as delivered client work. The prompts are in
`docs/ai-asset-prompts.md` section 1. Once real shoots land, swap this section
for actual reels and the honesty caveat goes away.

**`/work` still shows the twelve placeholder reels with view counts.** That page
needs the same treatment before launch.

## Before launch

- Audit form (`src/app/actions.ts`) currently validates, rate-limits in memory and logs to the server console. Wire Resend + HubSpot/Sheet and a durable rate limit.
- Move reels to Mux or Cloudflare Stream; keep `preload="none"` + posters.
- Add GA4 / Meta Pixel events (reel play, lightbox open, package CTA, form submit, phone tap) and CallRail number swap.
- Privacy and Terms pages, social profile links and the Careers mailbox are still placeholders (`Footer.tsx`).
- The favicon is still the Next.js default (`src/app/favicon.ico`). `public/logo/reelative-mark.png` is the symbol on its own, ready to generate one from.
