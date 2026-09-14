# Scroll video brief — sections 02 and 03 ("The Month")

## What this is

One scroll-scrubbed video that replaces the code-driven animation in **02 — The System** and **03 — What we do**. It is not a film. It is the site's own interface, animating: the same black, the same three typefaces, the same mono labels, chips, 1px lines and 24px cards the rest of the page uses. When it plays, the visitor should not be able to tell where the HTML ends and the video begins.

All of the copy in those two sections lives inside the video: the eyebrows, the two H2s, the four steps and their one-liners, the closing line, the three cards with their twelve bullets, the platform chips, the footer line. The HTML keeps a visually-hidden copy of the same text for search engines and screen readers. Nothing else in these sections is code.

Made in After Effects (or an equivalent motion tool) by a motion designer, exported as a frame sequence, scrubbed with scroll. Scroll is the playhead.

## The idea: one month, assembled in front of you

The whole piece is built around a single persistent object: a **month grid**, 4 weeks by 7 days, drawn as 28 dots on the right side of the frame. It appears in the first second and never leaves. Every step of the system does something visible to it:

1. The strategy call places the plan on it as tagged days.
2. The shoot fills one day and produces twelve raw clips.
3. The clips and graphics land across the four weeks until the month is full.
4. The full month flattens into a scorecard.

Then the scorecard's "amplify" bar stretches into a horizontal pipeline with three nodes, Create → Distribute → Amplify, and section 03 plays out along that line.

Nothing in the piece is decorative. Every element on screen is a piece of information from the copy, or the structure that holds it.

## Motion language (this is what makes it look expensive)

- **No cuts, only transformations.** A card does not disappear and get replaced; it collapses into the thing that follows. The checklist becomes a day on the grid. The shot list becomes twelve tiles. The tiles become bars. The bar becomes the pipeline.
- **Everything slides 24px and fades, draws, types, or counts.** Four verbs, used consistently. Cards slide up 24px with expo-out over 700 ms. Lines draw left to right. Mono labels type in at 30 characters per second with a blinking cursor. Numbers count up.
- **Staggers of 60 ms** between siblings, never more. Groups arrive as one gesture.
- **1px lines, 24px radius, 12px mono at 0.18em tracking.** Exactly the site tokens. Cards are `#12121A` on `#0A0A0F`, borders `rgba(255,255,255,0.10)`.
- **Colour only as state.** The gradient appears only on the one thing that is active right now: a check filling, the current node, the amplify bar. Everything else is white, muted grey and 10% lines.
- **Holds that breathe.** Eight rest points where the copy is fully on screen. At a hold the piece never freezes: a cursor blinks, a waveform moves, a counter idles, a dot pulses.
- **Reverse-safe.** Scrolling up runs the same motion backwards. Typing untypes, lines undraw. That is fine and feels responsive; it is why there are no cuts.
- **Never a pure white frame, never a flash.** Peak brightness 70%. No lens flares, no particles, no 3D, no glass, no camera moves other than a slow 2D pan and scale of the canvas between scenes.

## Scene by scene

Master: 30 s at 30 fps, 900 frames, 2560×1440. The section pins for about 600vh. Scroll percentages below. Copy in bold is text that is inside the video.

### 02 — The System

**Scene 1 · 0–10% · The claim**
Black. `02 — THE SYSTEM` types in, mono, top left. The H2 **One focused shoot can power your whole month.** slides up line by line out of masks. Under it, **We plan the stories before the camera arrives, so every minute of capture produces usable content.** fades in. On the right, 28 dim dots draw in row by row, 4×7, with mono row labels **W1 W2 W3 W4** and the header **MONTH · 4 WEEKS · 28 DAYS**.
Hold A at 10%.

**Scene 2 · 10–24% · Step 01 Strategy call**
The H2 shrinks and slides to the top-left as a small mono breadcrumb. A left rail appears with the four steps stacked, **01 — Strategy call** lit, the rest muted, a thin progress line beside them. A card slides in, centre-left: header **STEP 01 · STRATEGY CALL · 00:32:10** with a small live waveform, then four rows type in, **Offers · Priorities · Audience · Content angles**. As each row completes, its check fills with the gradient and a tag flies out of the card and lands on a day in the grid, lighting that dot magenta. Six dots lit by the end. Body line under the card: **Offers, priorities, audience and content angles.**
Hold B at 24%: cursor blinking on the last row, waveform moving.

**Scene 3 · 24–38% · Step 02 Planned shoot**
The card collapses to one dot on the grid, and that dot enlarges into a new card: **STEP 02 · SHOOT DAY · THU 14**. A shot list of twelve rows types in, mono numbers **01–12**, each labelled from the four categories **PEOPLE · PRODUCTS · DEMONSTRATIONS · CUSTOMER MOMENTS** with a timecode. A progress chip counts **01 / 12 → 12 / 12** and a gradient bar fills. Every completed row produces a small 9:16 tile that stacks on the right of the card. Body line: **People, products, demonstrations and customer moments.**
Hold C at 38%: twelve tiles stacked, bar full.

**Scene 4 · 38–52% · Step 03 Month of assets (the payoff)**
The canvas scales out. The twelve tiles fly from the stack onto the grid, three per week, landing with a small overshoot. Twelve square tiles (the graphics) slide in beside them. A one-line caption bar draws under each reel. Behind each reel, two more tiles fan out slightly and mono chips **IG · FB · YT** appear: the platform variants. Header counters tick: **12 REELS · 12 GRAPHICS · 4 WEEKS**. Body line: **Reels, graphics, captions and platform variants.**
Hold D at 52%: the full month, every day accounted for.

**Scene 5 · 52–64% · Step 04 Clear scorecard**
The grid's rows flatten: every tile drops onto a baseline and becomes a bar. The bars sort themselves into four groups with mono labels and counts: **KEEP 5 · STOP 2 · TEST 3 · AMPLIFY 2**. Stop dims to 30%. Amplify lights with the gradient and grows a little taller. Body line types: **What worked, what changed and what comes next.**
Hold E at 64%.

**Scene 6 · 64–70% · The closing line**
The scorecard shrinks to a thumbnail. Three tokens slide in on a single line: a person dot, a calendar icon (the grid shrunk to 28 pixels), a **48 HR** chip. Under them: **One strategist. One calendar. One approval window.**
Hold F at 70%.

### 03 — What we do

**Scene 7 · 70–76% · The pipeline**
The amplify bar stretches horizontally across the whole frame into a 1px line with three nodes: **CREATE · DISTRIBUTE · AMPLIFY** in mono, the first lit. `03 — WHAT WE DO` types in. The H2 **Create the content. Distribute it. Amplify what works.** slides up in three lines, each line landing as its node lights.
Hold G at 76%.

**Scene 8 · 76–84% · Create**
The Create node opens into a card. Four bullets type in with checks: **Short-form reels · Motion and static graphics · Scripts and captions · Multilingual adaptations**. Each bullet has a 40px micro-widget beside it: a 9:16 frame with a play mark; a square that flips from motion to static; a caption bar that types; the caption bar switching script (Latin, then Devanagari, then Tamil).

**Scene 9 · 84–92% · Distribute**
The reel from Create duplicates into six and each copy travels along the line into one of six chips: **IG · FB · YT · TT · G · WA**. Chips light as they receive. Bullets type in: **Instagram and Facebook · YouTube Shorts · TikTok where suitable · Google and WhatsApp assets**.

**Scene 10 · 92–100% · Amplify and close**
From the chips a second line rises. Four bullets with widgets: **Paid social campaigns** (a spend meter ticking), **Landing pages and lead tracking** (a small form card, a lead counter), **FunAsia radio and social** (a waveform with **104.1 FM** in mono), **Events and creator partnerships** (four avatar dots joining the line). The three nodes settle in a row. Under them: **Start with consistent content. Add media only where it improves the business result.**
Hold H at 100%. The section unpins.

## Holds and copy timing

| Hold | Scroll | On screen |
|---|---|---|
| A | 10% | 02 eyebrow, H2, intro, empty month grid |
| B | 24% | Step 01 card complete, six days tagged |
| C | 38% | Step 02 shot list 12/12, tile stack |
| D | 52% | Full month: 12 reels, 12 graphics, captions, variants |
| E | 64% | Scorecard: keep / stop / test / amplify |
| F | 70% | One strategist. One calendar. One approval window. |
| G | 76% | 03 eyebrow, H2, pipeline with three nodes |
| H | 100% | Three cards complete, footer line |

## Delivery

- Master 2560×1440 at 30 fps, 900 frames, ProRes 4444 with the exact background `#0A0A0F` so edges vanish against the page. Fonts: Syne 700/800, Inter 400/500/600, JetBrains Mono 500, the same Google Fonts files the site loads.
- Layout inside the video uses the site's 1320px container centred in a 1440-wide safe area, so text lines up with the page grid on the common desktop widths. Minimum text size 14px at 1x; mono labels 12px.
- Page loads every 3rd frame: 300 AVIF frames at 2560×1440, ≈40 KB each, ≈12 MB, preceded by a 320-wide proxy sequence that scrubs instantly. WebP fallback.
- Mobile: a separate 1080×1920 master with a single-column layout, same scenes, 200 frames, ≈5 MB. The grid becomes 7 columns by 4 rows at smaller scale; cards stack.
- Reduced motion: the mp4 plays once per scene on entry; no pinning.
- Visually-hidden HTML holds all the copy. Section pinned ~600vh, holds bound to exact frame numbers.

## Storyboard

`docs/storyboard/` holds eight frames rendered in the site's real design system (tokens, fonts, components), one per hold. They are the layout targets for the motion designer: every element on screen at that hold, at its final position.

## Fast path

The whole piece can also be produced without After Effects: build the animation as a deterministic timeline in HTML/CSS with the site's own components, and render it offline frame by frame in headless Chrome into the same frame sequence. No animation code ships to the page; the output is identical to what a motion designer would deliver, and it guarantees the fonts, colours and pixel grid match the site exactly. Roughly two to three days.
