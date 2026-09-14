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
src/components/ui/    Button, Cursor, Eyebrow, Logo, Placeholder, Reveal (motion primitives)
src/components/providers/SmoothScroll.tsx  Lenis wired into the GSAP ticker
src/lib/data.ts     all copy/data: reels, packages, add-ons, stats, testimonials, brands
public/video, public/posters   PLACEHOLDER clips (generated gradients) — replace before launch
```

Design tokens live in `globals.css` under `@theme` (colors `base`, `elevated`, `funasia`, `primary`, `muted`, `line`; fonts `display`/`sans`/`mono`) plus utilities `t-display`, `t-h2`, `t-h3`, `t-statement`, `eyebrow`, `mono`, `btn-primary`, `btn-secondary`, `chip`, `grad-border`, `wrap`, `section-pad`.

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
