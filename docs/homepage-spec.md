# Reelative Media — Homepage Design Spec

Reelative Media is a short-form content and social media agency in Dallas–Fort Worth, owned by FunAsia Network (South Asian and multicultural radio group). The homepage must *prove* the pitch "content people remember" rather than describe it. The site is the portfolio.

Design direction in one line: **dark, cinematic, video-first, big type, restrained gradient, motion that feels like an edit cut.**

---

## 1. Design tokens

### Colors
| Token | Value | Use |
|---|---|---|
| `bg` | `#0A0A0F` | Page background (near-black, slight blue) |
| `bg-elevated` | `#12121A` | Cards, nav on scroll, footer |
| `bg-funasia` | `#0E0818` | FunAsia section background (deep purple-black) |
| `text` | `#F5F5F7` | Primary text |
| `text-muted` | `#9A9AAF` | Secondary text, captions |
| `line` | `rgba(255,255,255,0.10)` | Borders, dividers |
| `grad-start` | `#5B2EFF` | Logo violet |
| `grad-mid` | `#E23FA7` | Logo magenta |
| `grad-end` | `#FF7A1A` | Logo orange |
| `accent` | `#E23FA7` | Links, focus rings, active states |

Brand gradient: `linear-gradient(135deg, #5B2EFF 0%, #E23FA7 55%, #FF7A1A 100%)`.

Rule: the gradient appears only on (a) the logo mark, (b) primary buttons, (c) one highlighted package card border, (d) the final CTA background blob. Never as section backgrounds, never on headings.

Optional texture: a 3–4% opacity film-grain overlay (fixed, pointer-events none) across the whole page.

### Typography (Google Fonts)
| Role | Font | Weight | Size |
|---|---|---|---|
| Display / H1 | Syne | 800 | `clamp(56px, 9vw, 144px)`, line-height 0.95, letter-spacing -0.02em |
| H2 | Syne | 700 | `clamp(36px, 5vw, 72px)`, line-height 1.0 |
| H3 | Inter | 600 | 28px |
| Body | Inter | 400 | 18px, line-height 1.6 |
| Small | Inter | 400 | 14px |
| Eyebrow / labels / numbers | JetBrains Mono | 500 | 12px, uppercase, letter-spacing 0.18em |

Eyebrow pattern used above every H2: `01 — THE WORK`, `02 — THE SYSTEM`, etc.

### Layout
- Container max-width 1320px, 12-column grid, 24px gutters, 24px side padding on mobile.
- Section vertical padding: 128px desktop, 80px mobile.
- Radius: 24px for video cards and large cards, 12px for small cards, 999px for buttons and chips.
- Video cards are always 9:16.

### Buttons
- **Primary**: gradient fill, white text, pill, 16px Inter 600, padding 16px 28px. Hover: scale 1.02, soft glow `0 0 40px rgba(226,63,167,0.35)`.
- **Secondary**: transparent, 1px `rgba(255,255,255,0.2)` border, white text. Hover: border `rgba(255,255,255,0.6)`.
- **Text link**: white with animated underline that draws left→right on hover.

### Motion
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out). Durations 0.6–0.9s. Stagger 60ms between siblings.
- Reveal pattern: elements fade up 24px with a clip-path mask on headlines (each line reveals from its own baseline).
- Smooth scroll via Lenis. Pinned/scrubbed sections via GSAP ScrollTrigger (or Framer Motion `useScroll`).
- Respect `prefers-reduced-motion`: disable pinning, parallax, autoplay loops; keep simple fades.
- Custom cursor (desktop only): 12px dot; grows to a 72px circle with the word "PLAY" over any video card, and "DRAG" over the horizontal reels row.

---

## 2. Global elements

### Navigation
- Fixed top, 80px tall, transparent at top of page. After 40px scroll: `bg-elevated` at 80% opacity + `backdrop-blur(16px)` + bottom `line` border.
- Left: Reelative logo (gradient play mark + wordmark, height 32px).
- Center (desktop): Work · System · Packages · FunAsia · About.
- Right: primary button "Book a content audit". On mobile, replace with a phone icon button that calls 469-424-3188.
- Mobile: hamburger → full-screen overlay, links in Syne at 48px, staggered in, with the CTA and phone number at the bottom.
- Hide nav on scroll-down, show on scroll-up.

### Footer
- Top row: oversized "REELATIVE" wordmark in Syne at ~14vw, 8% opacity, clipped at bottom of viewport.
- Four columns: Services (Reels, Graphics, Paid campaigns, Landing pages, Multilingual), Company (Work, Packages, About, Careers, Contact), FunAsia Network (FunAsia, Radio Sangam, Radio Caravan, Vanakkam FM — each linking out), Contact (phone, email, DFW address, social icons).
- Bottom line: "Reelative Media is a FunAsia Network company." with the FunAsia Network logo. Copyright, privacy, terms.

---

## 3. Sections, in order

### 3.1 Hero — full-screen reel montage
**Goal**: the visitor feels like they just watched a trailer.

- Height 100svh. Background: muted, looping montage of the agency's best reels. 8–12 second cuts, 1080p, target under 4 MB (webm + mp4 fallback). Poster image (webp) shown until video is ready. A separate 9:16 crop is served on mobile.
- Overlay: vertical gradient from transparent (top) to `bg` at 90% (bottom 45%) so text stays legible.
- Content, bottom-left aligned inside the container:
  - Eyebrow: `A FUNASIA COMPANY  ·  DALLAS–FORT WORTH`
  - H1 (two lines): **Content people remember.**
  - Sub (Inter 20px, muted, max-width 560px): "Short-form reels, smarter distribution and measurable growth for DFW businesses."
  - Buttons: Primary "Book your content audit" · Secondary "Watch the work ↓"
- Bottom-right: sound toggle (muted icon, pill). Bottom-center: thin scroll cue line that animates.
- Motion: video fades in from black over 1.2s; eyebrow, then each H1 line, then sub, then buttons stagger in with mask reveal. Subtle parallax: video moves at 0.8× scroll speed.

### 3.2 Trust marquee
- Label above, mono: `TRUSTED ACROSS DFW`.
- Two rows of logos scrolling infinitely in opposite directions, 40s per loop, pause on hover.
- Row 1: client logos (grayscale, 45% opacity, full color on hover).
- Row 2: FunAsia Network brands: FunAsia, Radio Sangam 104.1 FM / 104.9 HD4, Radio Caravan, Vanakkam FM 104.9 HD2.
- Height ~160px total, `line` border top and bottom.

### 3.3 The Work — pinned horizontal reels
**This is the "wow" section.**

- Eyebrow `01 — THE WORK`. H2: "Built for businesses people can see, visit and trust."
- Filter chips (pill, mono): All · Restaurants · Medical & Dental · Jewelry & Retail · Real Estate · Professional Services.
- Desktop: section pins for ~250vh while a horizontal row of 12–20 9:16 video cards (each 360×640px, 24px gap) scrubs left as the user scrolls down. Cards have a slight staggered vertical offset (alternating ±24px) for rhythm.
- Mobile: no pinning. A native horizontal scroll-snap row, cards 78vw wide, with peeking next card.
- Each card: poster image; on hover (desktop) or when centered (mobile) the muted reel plays. Bottom-left overlay: client name (Inter 600 16px) + category chip. Top-right: optional view-count chip (`1.2M views`).
- Click/tap opens a lightbox: sound on, full-height 9:16 player, arrow keys / swipe to move between reels (vertical swipe on mobile, like TikTok). Close on Esc / swipe-down.
- Below the row: text link "See all work →".

### 3.4 Statement — scroll-reveal text
- Full-width, centered, no other elements. Syne 700 at `clamp(32px, 4.5vw, 64px)`, max-width 1100px.
- Copy: "The problem is consistency, not creativity. Posting gets pushed behind customers, staff and operations. Ideas, footage, approvals and publishing live in different places. Reelative gives you the team, calendar and rhythm to stay visible every month."
- Motion: every word starts at 18% opacity and fills to 100% as it crosses the middle of the viewport (scrubbed to scroll). Section height ~150vh so the read is paced.

### 3.5 The System — sticky scrollytelling
- Eyebrow `02 — THE SYSTEM`. H2: "One focused shoot can power your whole month."
- Two-column layout (5/7). Left column is sticky: H2, one paragraph ("We plan the stories before the camera arrives, so every minute of capture produces usable content."), and a vertical progress line with four dots that light up as steps pass.
- Right column: four tall cards (`bg-elevated`, 24px radius, 48px padding) that scroll past. Each card: mono step number, H3, one line of body, and a small illustrative visual on the right:
  1. **Strategy call** — "Offers, priorities, audience and content angles." Visual: a simple checklist UI.
  2. **Planned shoot** — "People, products, demonstrations and customer moments." Visual: a shot-list card with thumbnails.
  3. **Month of assets** — "Reels, graphics, captions and platform variants." Visual: a 3×3 grid of tiny asset thumbnails fanning in.
  4. **Clear scorecard** — "What worked, what changed and what comes next." Visual: mini bar chart with keep / stop / test / amplify labels.
- The active card is full opacity; others 50%. Cards scale from 0.96 to 1.0 as they become active.
- Closing line under the column, Syne 24px: "One strategist. One calendar. One approval window."
- Mobile: stack; sticky column becomes a normal heading; cards in a vertical list.

### 3.6 Create · Distribute · Amplify
- Eyebrow `03 — WHAT WE DO`. H2: "Create the content. Distribute it. Amplify what works."
- Three equal cards (`bg-elevated`, 24px radius, 40px padding). On hover: card lifts 6px and a 1px gradient border fades in.
- Card content: an icon in a 48px circle (violet / magenta / orange tint respectively), H3, four-item list with small check marks.
  - **Create**: Short-form reels · Motion and static graphics · Scripts and captions · Multilingual adaptations
  - **Distribute**: Instagram and Facebook · YouTube Shorts · TikTok where suitable · Google and WhatsApp assets (show platform icons in a row)
  - **Amplify**: Paid social campaigns · Landing pages and lead tracking · FunAsia radio and social · Events and creator partnerships
- Footer line, muted: "Start with consistent content. Add media only where it improves the business result."

### 3.7 Proof — numbers and testimonials
- Eyebrow `04 — RESULTS`. H2: "You see what happened, and what to do next."
- Row of four large stat callouts (Syne 800 at 96px, count-up animation on enter, mono label below). Use real numbers when available; placeholders until then:
  - `[X]M` views generated for clients
  - `[X]+` reels delivered
  - `3 days` first edits after capture
  - `48 hr` client approval window
- Below: three video testimonial cards, 9:16, poster with a play button in the gradient. Under each: quote (Inter 18px), owner name, business, city. One testimonial in Hindi/Telugu/Tamil with English subtitles to demonstrate multicultural fluency.
- **Content required**: testimonials do not exist in the deck. This section needs 3 filmed client testimonials before launch. Do not use stock.

### 3.8 Packages
- Eyebrow `05 — PACKAGES`. H2: "Choose the package that matches your growth stage."
- Four cards in a row (2×2 on tablet, stacked on mobile). **Scale** is highlighted with a 1px gradient border and a "Most popular" chip.
- Each card: name (mono), price (Syne 700 at 56px) + "/month", divider, five line items with label and value, primary button "Start with {name}" (secondary style on non-highlighted cards).

| | Launch | Growth | Scale | Smart Reach |
|---|---|---|---|---|
| Investment | $995 | $1,750 | $2,950 | $4,500 |
| Reels | 4 | 8 | 12 | 16 |
| Graphics | 4 | 8 | 12 | 12 |
| Content capture | Guided / quarterly | 1 local shoot | 2 local shoots | 2 local shoots |
| Paid campaigns | Add-on | Add-on | Managed | Managed |
| FunAsia boost | Add-on | Add-on | Add-on | Included allowance |

- Fine print, muted 14px: "3-month minimum · one-time onboarding $350–$500 · ad spend and premium media inventory quoted separately."
- Add-ons as a single row of chips (wrap on mobile), mono: Extra reel $200 · Half-day shoot $650 · Landing page $1,250+ · Local SEO + reviews $500/mo · Paid media management 15% / $500 min · Multilingual adaptation $95/asset.

### 3.9 The FunAsia Advantage
- Full-bleed section with `bg-funasia` background. Behind the content: slow-animating concentric SVG rings (radio waves) at 6% opacity, radiating from the right edge.
- Eyebrow `06 — THE FUNASIA ADVANTAGE`. H2: "More than a content agency. A media ecosystem."
- Intro, max-width 640px: "Reelative Media is a FunAsia company, giving clients access to one of the most established multicultural media networks in DFW."
- 2×2 tile grid (each tile `rgba(255,255,255,0.04)` background, 24px radius):
  1. **Radio brands** — the four station logos in a row. "FunAsia radio reaches established South Asian and multicultural audiences across DFW."
  2. **Social channels** — "Amplify your content through FunAsia's own social platforms and engaged community following."
  3. **Events & activations** — a 3-photo strip from real events. "Connect your brand to live events, cultural moments and community gatherings."
  4. **Creator partnerships** — a row of 4 circular creator portraits. "Tap into FunAsia talent and creator relationships to extend your message with authentic voices."
- Tiles reveal with stagger; the ring animation is scrubbed slightly by scroll.

### 3.10 Final CTA — book a content audit
- Height ~90vh, centered content. Background: one large gradient blob (radial, blurred 120px, 60% opacity) that drifts slowly (20s loop) behind the text.
- H2 (Syne at display size): "Let's turn your business into content people remember."
- Sub: "Your first conversation is a practical content audit, not a sales presentation."
- Three-step row, mono numbers: 1 We review your current social presence · 2 We identify the strongest monthly stories · 3 We recommend the right package and first shoot.
- Form (max-width 560px, `bg-elevated` card, 24px radius): Business name · Your name · Phone · Business type (select: Restaurant, Medical / Dental, Jewelry / Retail, Real Estate, Professional Services, Other) · Instagram handle (optional). Primary button, full width: "Book my content audit".
- Under the form: "Or call 469-424-3188" as a large text link (tel:). On mobile the phone link sits above the form.
- Success state replaces the form: "Got it. A strategist will call you within one business day." with a checkmark animation.

---

## 4. Page order summary

1. Nav
2. Hero (reel montage)
3. Trust marquee
4. The Work (pinned horizontal reels)
5. Statement (scroll-reveal text)
6. The System (sticky scrollytelling)
7. Create · Distribute · Amplify
8. Proof (stats + video testimonials)
9. Packages
10. The FunAsia Advantage
11. Final CTA + form
12. Footer

Optional: a slim "First 90 days" timeline band (Foundation / Optimization / Growth) between Packages and FunAsia. Keep it off the homepage unless the page feels short; it belongs on the Packages page.

---

## 5. Assets required before build

- Hero montage: 16:9 and 9:16 versions, under 4 MB each, plus webp posters.
- 12–20 client reels (mp4, 9:16, under 6 MB each) with webp posters, client name, category.
- Client logos (SVG, monochrome white versions).
- FunAsia Network logos: FunAsia, Radio Sangam, Radio Caravan, Vanakkam FM (SVG or high-res PNG on transparent).
- 3 filmed testimonials with captions/subtitles.
- 3+ event photos, 4 creator portraits, 1 team photo (About page).
- Reelative logo: gradient mark + white wordmark (SVG).

No stock photography anywhere on the site.

---

## 6. Tech recommendations

- **Framework**: Next.js (App Router) + TypeScript + Tailwind CSS.
- **Motion**: Framer Motion for reveals; GSAP + ScrollTrigger for the pinned Work section and the statement text scrub; Lenis for smooth scroll.
- **Video**: Mux or Cloudflare Stream for reels (adaptive, lazy). Hero montage self-hosted, `preload="none"` with poster; start loading after first paint.
- **Fonts**: `next/font/google` for Syne, Inter, JetBrains Mono; `display: swap`.
- **Forms**: server action → email via Resend and a row in HubSpot or a Google Sheet. Add honeypot + rate limit.
- **Call tracking**: CallRail dynamic number swap on the phone links (the deck promises tracked calls).
- **Analytics**: GA4 + Meta Pixel; events for reel play, lightbox open, package CTA click, form submit, phone tap.
- **SEO**: title "Reelative Media — Short-form content and social media for DFW businesses"; LocalBusiness schema; Open Graph image is a still from the hero montage.

## 7. Performance and accessibility budget

- LCP under 2.5s on 4G: the hero poster is the LCP element, not the video. Preload it.
- Total JS under 250 KB gzipped on the homepage; lazy-load the lightbox and GSAP.
- All videos muted by default with visible sound controls; testimonials captioned.
- Contrast: `text-muted` on `bg` is ~7:1; never go lighter than `#8A8A9F` on dark.
- Focus rings: 2px `accent` outline with 2px offset on every interactive element.
- Reduced motion: no pinning, no autoplay loops, no parallax; fades only.

---

## 8. Reference sites (studied Sep 14, 2026)

| Site | Stack | What to borrow | What to skip |
|---|---|---|---|
| studioloop.com.br | Next.js, self-hosted webm | Dark-to-cream "sandwich" (dark hero and footer, light middle), editorial serif italic + sans headline pairing, numbered service list that pins and highlights on scroll, floating tilted cards in the hero, bracketed mono labels like `[ FROM BRASIL TO EVERYWHERE ]`, wavy section divider, client-logo row | Cream body background (we stay dark), Portuguese-heavy copy density |
| remyshoots.co.za | Next.js, WebGL canvas (Three.js-style), mono type | "Enter with sound" gate, full-screen horizontal work slider driven by scroll and drag, center item in color with neighbors desaturated, mono UI chrome (`WORKS(21)`, `SOUND:[OFF]`), ruler/ticker at bottom, project meta caption under the slider, custom hand cursors | Entire site as one canvas (bad for SEO and mobile), no visible pricing or CTA path |
| marina-zakharova.netlify.app | Vite, GSAP-style pinned sections, self-hosted webm | Star-shaped mask reveal on the hero, very long pinned scrollytelling (folders flying in, headlines assembling), marquee of services, paper-cutout sticker styling, ticket-style pricing cards, "new here? let's meet" CTA | Pink/yellow palette, 296 images and 13k px page (too heavy for a phone-first client base) |

Awwwards categories worth browsing for more: `awwwards.com/websites/scrolling/` and `awwwards.com/websites/video-production/`.

### Decisions from the study
- **Video, not Instagram embeds.** All three sites self-host `.webm`/`.mp4` and none embed Instagram. Instagram embeds are slow, break the design, require consent banners, and cannot be scroll-controlled. Pull reels from Instagram once, re-encode, host on Mux or Cloudflare Stream.
- **Scroll-driven video needs a dedicated asset.** For a scrubbed hero (video frames tied to scroll position) shoot or cut a 6–10 second clip with a single slow camera move and no cuts, export as an image sequence (120–200 webp frames at 1440px) or a keyframe-every-frame mp4. Normal reels with hard cuts do not scrub well.
- **Pattern mix for Reelative**: Remy's work slider for section 3.3, Loop's pinned numbered list for section 3.5, Marina's mask reveal for the hero transition, Loop's dark/light sandwich for overall rhythm.
