# Reelative Media website — session brief

Paste this as the first message of a new Claude Code session opened in `~/Developer/reeltives`.

---

## Who we are building for

Reelative Media is a short-form video and social media content agency in Dallas–Fort Worth. It is a FunAsia Network company. FunAsia is an established South Asian and multicultural media group in DFW with four radio brands: FunAsia, Radio Sangam (104.1 FM / 104.9 HD4), Radio Caravan, and Vanakkam FM (104.9 HD2). Phone: 469-424-3188.

The pitch: local businesses (restaurants, medical and dental, jewelry and retail, real estate, professional services) struggle to post consistently. Reelative sells a monthly content system: one planned shoot produces a month of reels and graphics, Reelative publishes them, and reports on results. The differentiator is amplification through FunAsia radio, social, events, and creators. The site's job is to *prove* the line "content people remember," not describe it.

Monthly packages (3-month minimum, onboarding $350–$500):

| | Launch | Growth | Scale | Smart Reach |
|---|---|---|---|---|
| Price | $995 | $1,750 | $2,950 | $4,500 |
| Reels | 4 | 8 | 12 | 16 |
| Graphics | 4 | 8 | 12 | 12 |
| Capture | Guided / quarterly | 1 local shoot | 2 local shoots | 2 local shoots |
| Paid campaigns | Add-on | Add-on | Managed | Managed |
| FunAsia boost | Add-on | Add-on | Add-on | Included |

Add-ons: extra reel $200, half-day shoot $650, landing page $1,250+, local SEO + reviews $500/mo, paid media management 15% or $500 min, multilingual adaptation $95/asset.

Source deck: `/Users/sankalpsingh/Documents/User Data Set - FunAsia /REELATIVE MEDIA - CLIENT PITCH.pptx` (20 slides). Brand logo is a violet → magenta → orange gradient play-button mark with a "REELATIVE MEDIA" wordmark.

## What already exists in this folder

- `docs/homepage-spec.md` — the full homepage spec: design tokens, every section with copy and motion, assets list, tech stack, and a reference-site study. **Read it in full before writing any code.**
- Nothing else. The project is empty and not a git repo yet.

## Design direction (decided)

Dark, cinematic, video-first, big type, restrained gradient, motion that feels like an edit cut.

- Background `#0A0A0F`, elevated `#12121A`, text `#F5F5F7`, muted `#9A9AAF`.
- Gradient `linear-gradient(135deg, #5B2EFF, #E23FA7 55%, #FF7A1A)` used only on logo, primary buttons, one highlighted package card, and the final CTA blob.
- Fonts: Syne 800 for display, Inter for body, JetBrains Mono for eyebrow labels like `01 — THE WORK`.
- Homepage order: nav → hero reel montage → trust marquee (clients + FunAsia brands) → pinned horizontal reels slider → scroll-reveal statement → sticky four-step system → Create/Distribute/Amplify cards → stats + video testimonials → packages → FunAsia advantage → content-audit CTA with form → footer.

## Reference sites (studied in the browser on Sep 14, 2026)

These three are the taste anchors. The client will judge the site against them.

### studioloop.com.br
- Stack: Next.js, self-hosted `.webm` clips, Google Analytics. No Instagram embeds.
- Hero: dark chocolate-brown background with floating, slightly tilted portfolio cards (books, notebooks, a 3D orange loop shape) that drift on scroll. Small nav top-right, logo top-left.
- Below the hero, a numbered service list (`(01) Video & Social Content`, `(02) Design`, `(03) 3D & Motion`, `(04) AI Video`, `(05) Live Events`) at huge size. Each row mixes a sans word with an italic serif word in orange. Rows pin and highlight one at a time as you scroll, with thin divider lines between them.
- Bracketed mono labels as section chrome: `[ FROM BRASIL TO EVERYWHERE ]`, `[ Who we are ]`, `CREATIVITY AS A SERVICE`, year on the right.
- Page rhythm is a sandwich: dark hero → cream middle (about text, client logo row with Netflix, TikTok, Topps, Food52) → dark footer with the portfolio cards again and a wavy divider.
- Newsletter pill and "Start a Project" CTA. Footer has email, WhatsApp, and a "join the loop" button.
- Borrow: the pinned numbered list, the serif-italic accent inside sans headlines, bracketed mono labels, dark/light sandwich, floating cards in the hero.
- Skip: cream body background (we stay dark), the newsletter pill.

### remyshoots.co.za
- Stack: Next.js, but the entire site is one full-screen WebGL canvas. Videos play as textures inside the canvas. Mono type (Roboto Mono) for all UI, Helvetica for the wordmark.
- Opens with a preloader: a percentage counter, a ruler ticker along the bottom, then a gate with "ENTER WITH SOUND" and "[enter without]".
- After entering, the whole page is a horizontal work slider. Scroll wheel or drag moves it. The center item is in full color, the neighbors are desaturated and pushed back. A caption under the slider shows the project name and meta like `MOTION[01:25] · EVENTS` or `STILLS[9] · LIFESTYLE`.
- UI chrome: `WORKS(21)`, `STILLS(13)`, `MOTION(8)` as nav counts; `SLIDER GRID LIST` view toggles; `FISHEYE:[OFF]`, `SOUND:[OFF]`, `GESTURES:[OFF]` toggles; a client logo (Under Armour, Nike, adidas) that swaps per project; custom hand cursors for grab and drag.
- Borrow: the horizontal work slider with a color center and gray neighbors, the mono counts and toggles as a visual signature, the project caption pattern, the bottom ruler, the sound gate idea (optional, as a small toggle rather than a full gate).
- Skip: rendering the whole site in WebGL (kills SEO, accessibility, and mobile), no visible pricing, no clear CTA path. We build the slider in DOM with GSAP instead.

### marina-zakharova.netlify.app
- Stack: Vite single-page app, 13,000 px tall, 296 images, two self-hosted `.webm` videos (team video, footer loop). One canvas used only for the loader. No Instagram embeds.
- Hero: a pink screen where a star-shaped mask cuts through to reveal the sky-and-clouds page underneath. Headline "Designing brands that shine" set in condensed caps plus a script word, on paper-cutout white shapes.
- Then long pinned scrollytelling: a yellow section holds for three screens while folders labeled Branding, Packaging, Naming, Animation, 3D and 2D Illustration fly in from the edges and settle. Headlines assemble word by word as sticker cutouts.
- A marquee of services runs between sections. Portfolio filters are chips (pet care, food & beverage, health & wellness, lifestyle & eco) with product shots hung on a clothesline with clips.
- Pricing cards are styled as receipts or tickets with barcodes, "from $1000 / $1600 / $4000". CTA section "New here? Let's meet" with a free first consultation. Testimonials titled "Love letters from our clients" over a flower photo.
- Borrow: the mask reveal from hero into content, pinned sections where elements fly in and settle, the sticker-cutout headline treatment (translated into our dark style as clipped or outlined type), the chip filters, the "first conversation is free" CTA framing.
- Skip: the pink and yellow palette, the page weight (too heavy for phone-first restaurant owners), the receipt styling.

### Decisions from the study
- **Self-hosted video, never Instagram embeds.** None of the three embed Instagram. Embeds are slow, carry Meta UI and consent banners, break the design, and cannot be driven by scroll or hover.
- **Scroll-scrubbed video needs its own clip.** Normal reels with fast cuts do not scrub well. Shoot or cut a 6–10 second clip with one slow camera move and no cuts.
- **Combine:** Remy's horizontal slider for the reels section (DOM + GSAP, not WebGL), Loop's pinned numbered list for the four-step system, Marina's mask reveal for the hero-to-content transition, Loop's dark/light rhythm overall, Remy's mono labels and bottom ruler as the visual signature.
- More references if needed: `awwwards.com/websites/scrolling/` and `awwwards.com/websites/video-production/`.

## Technical decisions (decided)

- Next.js App Router + TypeScript + Tailwind CSS.
- Framer Motion for reveals, GSAP + ScrollTrigger for pinned and scrubbed sections, Lenis for smooth scroll.
- Video is self-hosted mp4/webm. **No Instagram embeds.** Reels will be pulled from Instagram once, re-encoded, and hosted (Mux or Cloudflare Stream in production; local `/public/video` placeholders for now).
- Scroll-scrubbed hero needs a dedicated clip: 6–10 seconds, one slow camera move, no cuts, exported as a webp image sequence or keyframe-every-frame mp4. Until we have it, use a normal autoplay loop.
- Mobile first. LCP under 2.5s, hero poster is the LCP element, lazy-load everything below the fold. Respect `prefers-reduced-motion`.
- No stock photography anywhere. Use clearly labeled placeholder blocks until real assets arrive.

## Tools available

- Magnific MCP is connected in this project (`claude mcp get magnific` shows Connected). Use it for upscaling or generating placeholder imagery where useful.
- Browser tools are available for visual QA of the running dev server.

## Assets we do not have yet (use placeholders, flag them)

Hero montage video, 12–20 client reels with posters, client logos, the four FunAsia radio logos as SVG, three filmed testimonials, event photos, creator portraits, the Reelative logo as SVG.

## What to do in this session

1. Read `docs/homepage-spec.md` end to end.
2. Scaffold the Next.js project in this folder (`npx create-next-app@latest . --typescript --tailwind --app --src-dir --eslint`), init git, and add Framer Motion, GSAP, and Lenis.
3. Set up design tokens (Tailwind theme + CSS variables), fonts via `next/font/google`, and the global grain overlay.
4. Build the homepage section by section in the order above, one component per section under `src/components/home/`. Use placeholder 9:16 video blocks and placeholder logos.
5. Run the dev server, open it in the browser, and visually QA every section on desktop and mobile widths before reporting back.
6. Report what is built, what is placeholder, and what assets are still needed.

Do not ask for confirmation on routine choices. Make the call, note it, keep going.
