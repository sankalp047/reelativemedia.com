# Reelative Media — design system

## Current: "Spectrum" (22 Sep 2026)

The fourth system. Midnight ground, cloud/mist light bands, and ONE accent
family: the colours already inside the logo mark — indigo `#3A1AE3`, violet
`#6F24E5`, magenta `#B426B5`, pink `#F44394` — run as a gradient on anything
FILLED and used as a single solid on anything that has to be READ. The full,
measured rule set lives at the top of `src/app/globals.css`; this is the short
version.

| | on a DARK ground | on a LIGHT band |
|---|---|---|
| Solid accent (counters, links, icons, labels) | **pink** — 5.68 on midnight, 5.28 on well | **violet** — 6.51 on cloud, 5.84 on mist |
| Headline accent line (`accent` prop on `Kinetic` / `SectionHead`) | `--g-voice-dark` periwinkle→lilac→pink, stops 5.59 / 5.04 / 5.68 | `--g-voice-light` indigo→magenta→pink, stops 8.17 / 5.12 / 3.28 (large text only) |
| Fills (`btn-primary`, `bg-brand`: buttons, badges, discs, rules) | `--g-brand` indigo→magenta→**berry**, WHITE type: 8.62 / 5.41 / 4.64 | same |

- **Never swap the solids.** Pink on cloud is 3.28; violet on midnight is 2.86.
- **A fill takes white, never midnight or cloud.** The fill gradient ends in
  berry `#D62D7D`, one step deeper than the logo pink, because white on the
  logo pink is 3.46 and fails for button text.
- **`--g-voice` resolves from the ground** (`.bg-cloud/.bg-mist/.bg-haze` →
  light stops; `.bg-midnight/.bg-abyss/.bg-well/.bg-stock`, `[data-ground="dark"]`
  and `card-ink` → dark stops), so a component only ever says *which line*.
- **The nav bar is cloud, always.** The wordmark's type is navy and there is no
  knockout of it; on a midnight bar it was invisible. Same value as the System
  band, so the bar and the band are one sheet.
- **System and FilmStrip stay light bands** for the reasons under "Why the site
  is light" below, and the System footage is graded to its own cream
  (`#FDEFD7`, 1.08 on cloud, 17:1 on midnight) — regrade before ever moving it.
- **The Proof reels and the System scroll sequence are unchanged by design**;
  only the play disc and the active-step rule took the new tokens.

Two defects the migration to this system exposed and fixed, worth knowing so
they are not reintroduced: `--color-slate` had been declared as a second
`--color-pewter` and silently resolved to nothing (every `text-slate` inherited
its ground), and the custom cursor was an ink disc in an ink ring on a page that
is 60% dark.

---

The sections below describe the PREVIOUS system, "Alabaster & Cognac", and are
kept because the layout, type and background arguments in them still hold. Read
any colour name in them as historical.

# Previous: "Alabaster & Cognac"

Adopted 17 Sep 2026. Third and current system, replacing "Ink & Brass" (a dark
near-black palette) which itself replaced the light "poster" palette. The
structure, layout and motion have survived all three; only colour and type have
changed.

Direction in one line: **warm alabaster paper, one Didone voice, one cognac
accent, and the footage as the only other colour on the page.**

## Why the site is light

This is not a taste call, and it is worth knowing the argument before anyone
proposes going dark again.

Every asset this site owns is already dark. The ten business stills in
`public/images/strip/` average under 80 luminance. The film canister is a black
cylinder. The 35mm film stock in section 3 is `#08080A`.

On the previous near-black ground the film stock measured **1.04:1** against the
page. The strip had no edge — it read as a hole cut in the screen, and the same
was true to a lesser degree of every poster and still on the site. On alabaster
the same untouched film measures **17.74:1** and reads as 35mm lying on a light
table.

The footage stops competing with the page and starts being the only colour on it.

## Type

Two families, one job each, four variable files — lighter than the single
two-axis Roboto Flex file they replace.

| | family | `next/font/google` | axes |
|---|---|---|---|
| Display | **Newsreader** | `Newsreader` | `opsz` (+ `wght` by default), normal + italic |
| Text | **Instrument Sans** | `Instrument_Sans` | `wdth` (+ `wght` by default), normal + italic |

**The division of labour is absolute.** Newsreader is the voice: hero, page H1s,
section headlines, the statement, prices, the plate numbers, the footer wordmark.
Instrument Sans is everything a customer has to read in order to buy something:
body, ledes, card titles, package rows, table cells, form labels, nav, buttons.
A price in Newsreader, its terms in Instrument Sans. The moment package inclusions
get set in the serif, the site becomes a lookbook and stops selling.

| Utility | family | size | use |
|---|---|---|---|
| `t-mega` | Newsreader opsz 72 / 400 | clamp(50px, 11vw, 188px) | Hero wordmark |
| `t-display` | Newsreader opsz 72 / 400 | clamp(40px, 7.2vw, 118px) | Route H1s |
| `t-h2` | Newsreader opsz 48 / 400 | clamp(30px, 4.4vw, 68px) | Section headlines |
| `t-statement` | Newsreader opsz 72 / 400 *italic* | clamp(32px, 5.6vw, 96px) | The three full-bleed claims |
| `t-price` | Newsreader opsz 36 / 500 | set at call site | The five package prices only |
| `t-plate` | Newsreader opsz 18 / 500 *italic* | 24px | Section 3 plate numbers only |
| `t-h3` | Instrument Sans 600 | clamp(18px, 1.5vw, 22px) | Card and step titles |
| `t-lead` | Instrument Sans 400 | clamp(19px, 1.6vw, 24px) | The paragraph under a headline |
| `t-body` | Instrument Sans 400 | clamp(16px, 1.05vw, 17.5px) | **Every paragraph on the site** |
| `eyebrow` | Instrument Sans 600 | 11px / 0.18em | Labels |
| `mono` | Instrument Sans wdth 82 / 500 | 11px / 0.16em | Counters, meta, row keys |
| `num` | Instrument Sans 500, tabular | inherited | Anything that ticks or aligns |

### The rule that answers "not premium"

**Body copy is never uppercase, never condensed, never above weight 400.**

The old system ran *all* running text in condensed 500-weight uppercase.
Uppercase destroys word-shape so the eye has to spell rather than read;
condensed width signals "fit more in"; heavy weight signals "shout". All three
are the vocabulary of a sale poster. Sentence case at normal width, weight 400,
1.62 leading is what an expensive brand does, because it assumes you will read it.

Uppercase is **rationed**: labels at ≤12px with 0.16–0.22em tracking, which is
what `eyebrow` and `mono` are for. Never a sentence, never a headline, and never
a proper noun at display size — the FunAsia station names are Title Case.

### Why Newsreader, and not a Didone

The display face was Bodoni Moda first. It was beautiful at 100px and tiring
everywhere else: a Didone's hairlines go spindly the moment the size drops, which
is why that scale needed a hard 24px floor and a low-DPI weight bump just to
survive. Newsreader is a variable TEXT face with real optical sizes (6–72), so it
holds its colour from a 12px label to a 188px hero with neither crutch. Readable
first, elegant second — which is the brief.

`opsz` is still bound explicitly on every display utility (an unbound optical
size is the number one way a variable serif ships broken) and
`font-synthesis: none` is global, so nobody can fake a weight the family lacks.

Smoothing is scoped to the display utilities. `-webkit-font-smoothing:
antialiased` on 16px body text costs perceived weight on macOS, and the whole
anti-heavy thesis depends on the text face holding its designed colour.

## Colour

| Token | Value | Role |
|---|---|---|
| `chalk` | `#FBF9F4` | Lifted surface: cards, the call sheet |
| `alabaster` | `#F4F1EA` | **The page ground** |
| `parchment` | `#EAE4D8` | Alternate band: WhatWeDo, Packages |
| `linen` | `#DED6C6` | Recessed: input wells, row stripes, image mats |
| `noir` | `#14120E` | The dark wells: Statement, FinalCTA, TrustMarquee |
| `obsidian` | `#0A0907` | Footer base, the Hero letterbox bar |
| `well` | `#1F1B15` | Card/input surface inside a dark well |
| `stock` | `#08080A` | The 35mm film in section 3 |
| `scrim-floor` | `#1C1913` | **Not a paint.** The luminance ceiling asserted at build time |
| `ink` | `#191510` | Primary type on light. AAA on all four light grounds |
| `graphite` | `#52493C` | Secondary type on light |
| `slate` | `#635A4B` | Meta type on light |
| `bone` | `#F4F1EA` | Primary type on dark. Same value as alabaster **by design** |
| `bone-dim` | `#BDB6A6` | Secondary type in a well |
| `ash` | `#A69E90` | Meta type in a well and on the film stock |
| `cognac` | `#7A4A1E` | **The** accent, light-ground form |
| `cognac-hi` | `#C18A4E` | The accent, dark-ground form |
| `rule` / `rule-dark` | `#D9D2C2` / `#2A2720` | **Decorative** hairlines |
| `edge` / `edge-dark` | `#7A6F5C` / `#736B5C` | **Interactive** boundaries |
| `edge-media` | `#A7A5A0` | Interactive boundary over footage |

The wells are the page inverted, not a second palette — that is why `bone` and
`alabaster` are the same value.

### The traps. These were measured, not eyeballed.

- **A COGNAC fill takes BONE (6.59:1). A COGNAC-HI fill takes INK (6.07:1).**
  Ink on cognac is 2.44:1 and bone on cognac-hi is 2.65:1. This *inverts* the
  rule the old brass palette used, so any code carried over from it is wrong by
  default. Both failures look fine in a screenshot and both fail an audit.
- **`rule` and `edge` are not interchangeable.** `rule` is decorative and has no
  contrast requirement (it is 1.33:1 on alabaster by design). `edge` is an
  interactive boundary tuned to clear 3:1. Putting `rule` on an input border is
  an accessibility bug, not a style choice.
- **`edge-dark` is not safe over footage.** It was tuned against the flat `well`
  and measures 1.74:1 over a scrimmed video highlight. Use `edge-media` there.
- **Never stack opacity on a tuned colour.** A composited colour is not a
  knowable colour, and it is how the previous two systems kept drifting under the
  line. Alpha-modified bone needs ≥0.49 to clear 4.5:1 for small text on any
  ground. The only permitted `opacity` uses are on GridRules, on the two
  photographic ground layers, and the Nav's scroll fade — none of which is type.

### Rhythm and restraint

Sections separate by **value, not hue**:
`alabaster → noir(band) → noir(well) → alabaster → parchment → alabaster →
parchment → alabaster → noir(well) → obsidian`.

The one place two darks touch is deliberate and is the strongest structural idea
on the page: the Hero's lower letterbox bar hands straight off to the
TrustMarquee ticker, so the FunAsia radio brands read as the crawl at the bottom
of the frame. **Do not put a rule or a margin between them.**

**Cognac appears at most twice per viewport** (cognac-hi likewise), plus one
counting sequence — the ten film-frame indices count as one. This is a count, not
a vibe. The failure mode is gradual: a cognac heading here, a cognac icon there,
and within two sprints it is a second brand colour and the page is brown.

Hairlines are **1px**. Corners are **2px** — a soft radius is the vocabulary of a
SaaS template; a 2px corner is a printed edge. Genuinely circular things
(icon discs, the cursor) may stay round.

## Backgrounds

Four grounds, two generated textures, one generated photograph. Nothing else. No
stock, no new photography, and no gradient used as decoration — the only gradient
in the system is the Hero scrim, which is functional.

- **`.grain`** — warm dark noise at `multiply` 0.055. Load-bearing, not
  decorative: a flat 8-bit light fill at 1440px is exactly where a screen
  announces that it is a screen. (It was mid-grey `screen` for the dark system;
  `screen` *fogs* a light page.)
- **`laid`** — Packages only. Anisotropic `feTurbulence` (0.75 × 0.035) so the
  noise reads as thread direction rather than film grain. This is what makes the
  price table read as printed card stock. Zero bytes, no request.
- **`grid-rules`** — six vertical hairlines, Hero and FilmStrip only. Should read
  as drafting, not as pattern.
- **`public/images/ground/salon-*.webp`** — behind the Statement and FinalCTA
  wells at opacity 0.5. Generated by `npm run grounds:build` from
  `public/images/strip/jewellery.webp` (the warmest of the ten, and referenced
  nowhere in `src/`). 8 KB.

**The ground assertion is the point.** `tools/grounds/build.mjs` reads the
written file back raw, computes per-pixel relative luminance, and throws if any
pixel exceeds `L(--scrim-floor)`. Every contrast figure quoted over a dark well
is computed against that ceiling rather than against a photographic average. The
failure mode for a blurred dark photo behind text is not the photo — it is the
day somebody dials the crush back so you can "see the shot" and silently
invalidates every number in this document. The assertion makes that fail the
build instead.

## Parallax

`ui/Parallax.tsx` is mounted once in the root layout and drives every
`[data-parallax]` element on the page through one ScrollTrigger sweep. It
re-scans on navigation, because the App Router swaps the tree without
remounting the layout.

```
<div data-parallax="110" />   drifts 110px across its section's pass
<div data-parallax="-40" />   negative LEADS the scroll instead
```

**The convention: grounds lag, content leads.** A photographic ground takes
`110` and the content block over it takes `-40`, which puts 150px of relative
separation between them through the section. The depth cue is the *gap between
the two*, not the movement of either on its own. Keep content drift small —
`-30` to `-40` is 15–20px either side of its natural position.

The drift is **centred**: an element sits at `-d/2` as its section enters from
the bottom and `+d/2` as it leaves the top, so it is at its natural position
when the section is centred. Anchoring at 0 would make everything jump on first
paint.

A drifting background must overflow its section or the drift exposes the
section edge. The two grounds use `inset-x-0 -inset-y-[14%]` inside an
`overflow-hidden` section, which measures 39px of overlap at the tightest
point.

### What it will not touch

- **Anything inside a ScrollTrigger pin.** A competing transform on a pinned
  subtree fights the pin. The filter excludes `.pin-spacer` descendants, which
  is structural rather than a hardcoded id and covers section 3 plus anything
  pinned later.
- **Elements framer-motion already drives** — the FunAsia rings, and every
  `Reveal` / `Stagger` / `Kinetic` wrapper. Two libraries writing the same
  transform is a race. Annotate a plain wrapper around them instead; that is
  why the targets are the `wrap` divs and not the motion components inside.
- **The System section**, which has a sticky pane and scroll-synced steps that
  a drift would fight.
- **`prefers-reduced-motion`**, which returns before any tween is created.

## Section 3 is sealed

`src/components/home/FilmStrip.tsx` is under a standing client constraint: **the
film canister image, the reel frames and the entire GSAP scrub animation and its
geometry constants must not change.** Only colour, type and out-of-flow
decoration are in scope.

Sealed: `FRAME_H`, `RAIL_H`, `FILM_CHROME`, `FILM_H`, `CANISTER_*`,
`STRIP_TOP_GAP`, `FILM_CLIP_LEFT`, `LEADER_W_LG`, `CLOSER_W`, `CAP_FRAC`,
`FELT_FRAC`, `BODY_FRAC`, `CAN_LEN_M`, `RAIL_W_M`, `FRAME_PAD_M`, the rect maths
inside `sprocketTile`, both `gsap.matchMedia` blocks, both ScrollTriggers,
`distance()`, `measure()`, `travelTo()`, `setProgress`, `onTrackScroll`, the
column-reverse ordering, the leader `clipPath`, the `-mt-3` tuck and the mobile
`rotate(90deg)` wrapper.

Two consequences worth knowing:

- **`STOCK` keeps the value `#08080A` byte-for-byte.** The constant was renamed
  from `INK` only because that name now collides with `--color-ink`, which is
  *dark type on a light ground*.
- **Emphasis is added with `box-shadow`, never border or padding.** Box-shadow
  does not participate in layout, so the track's `scrollWidth` — which the scrub
  distance is computed from — is unchanged.

The file is currently **untracked in git**, so `git diff` shows nothing for it.
Verify changes by reading it against the constants above.

## Gotchas

- **`letterbox` deliberately declares no `position`.** Tailwind v4 sorts custom
  utilities *after* core ones, so a `position: relative` there beat the `sticky`
  class on the Hero and un-pinned the whole un-crop animation.
- **The next/font CSS variable is `--font-sans-v`, not `--font-sans`** — the
  latter collides with Tailwind v4's own `@theme` token.
- **Never pass a static `weight` array alongside `axes`** in a next/font config.
  It throws at build time. `wght` is the default variable axis on both families.
- **The Hero copy rail is on paper, not on the video.** It sits below and left of
  the cropped card, and `copyOpacity` fades it to 0 over the first 28% of scroll,
  so it is gone before the card un-crops. It takes dark type. On phones
  `insetBottom` is 34 (not 12) specifically to keep it clear of the card.
- **The serif's descenders are deeper than Roboto Flex's.** The `kinetic` utility
  carries `padding-bottom: 0.26em` (up from 0.2em) so headlines do not clip, and
  `.k-ghost` dropped to 0.16 opacity because a *dark* ghost on paper at 0.28 is
  much heavier than the light ghost that value was tuned for.
- **The logo has two lockups and `Logo` defaults to the light one.**
  `reelative-media-dark.webp` has a bone wordmark and vanishes on alabaster; only
  the Footer passes `tone="dark"`. Both files are rasters de-matted from
  `reelative-media.png` — get the vector original from the client before print or
  large-display use.
- **The gradient logo mark is the only saturated colour on the site.** That is
  deliberate. `--brand-gradient` is now flat cognac so no surviving `grad-*` call
  site can reintroduce a saturated primary.

## Migration aliases

`bg-paper`, `bg-base`, `bg-band`, `bg-elevated`, `bg-raised`, `bg-deep`,
`text-primary`, `text-muted`, `text-faint` and the `brass*` family are aliases
kept so ~90 call sites compile through the migration. **They are meant to be
deleted.** Grep for them, plus `t-body-caps`, `1.5px` and `rounded-full` on
non-circular elements, before calling the migration finished.
