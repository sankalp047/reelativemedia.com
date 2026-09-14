# Scroll video brief — "One Frame, One Month"

Covers sections **02 — The System** and **03 — What we do** on the homepage. The card animations currently built in code are replaced by one scroll-scrubbed video. The copy stays in HTML (crisp, indexable, editable). The video carries everything else.

Assumption: "part 2 to part 3" means the numbered eyebrows `02 — THE SYSTEM` through `03 — WHAT WE DO`. The Statement section before it can act as the on-ramp (its black frames are the first frames of this video).

---

## Why a scrubbed video, done right, beats code

Scroll-scrubbed video only looks expensive when three things are true:

1. **One camera move, zero cuts.** Scroll is a dolly track. The visitor is driving the camera, so any cut breaks the illusion that they are in control.
2. **Holds.** The camera decelerates into eight rest points where the copy sits. At a hold the scene still breathes (a flame flickers, a reflection drifts, dust moves) so a stopped scroll never looks like a frozen frame.
3. **Physical materials.** Glass, brushed metal, paper, warm screens, real shadows. The brand gradient appears only as a reflection on a surface, never as a fill.

Everything Apple, Linear and Lusion do in these sections comes down to those three rules plus a heavy frame budget. The concept below is designed around them.

---

## Concept

The unit of Reelative's work is a single frame of video. The sequence follows one frame, the naan shot from the hero, as it becomes a month of content and then leaves the studio for the city.

The world is a dark studio table under a single warm practical, the same light language as the hero clip. The hero object is a **glass slab**, 9:16, with the naan shot glowing inside it. Over the scroll the slab is planned, shot, multiplied into a month, scored, and finally released over the Dallas skyline at night, where it splits into three streams: Create, Distribute, Amplify.

Nothing is labelled. No text, no UI, no logos. Every idea is carried by an object and by light.

---

## The move, beat by beat (28 s master, 24 fps, 672 frames)

Scroll runs over ~560vh of pinned section. Percentages are scroll progress. Holds are where the copy appears and the camera almost stops.

| Scroll | Frames | Beat | Camera | What happens in frame | HTML copy (lower-left) |
|---|---|---|---|---|---|
| 0–8% | 0–54 | Open | High 60° down-angle, slow dolly in | Black. A single glass slab lies on a dark table, the naan clip glowing inside it, one thin orange rim light along its edge. Dust in the beam. | — |
| **8% hold A** | 54 | The claim | Settles | Slab alone, right of center. | `02 — THE SYSTEM` · "One focused shoot can power your whole month." · intro paragraph |
| 8–20% | 54–134 | Strategy | Tracks right, lowers to eye level | Four small brass pins rise from the table around the slab. Threads of magenta light connect them one by one into a plan. | — |
| **20% hold B** | 134 | Step 01 | Settles | Pins and threads complete, slab still flat. | Step 01 · Strategy call · "Offers, priorities, audience and content angles." |
| 20–34% | 134–228 | Shoot | Slow orbit 20° | The threads tighten and pull the slab upright. A gimbal rig, silhouetted, slides in from the right and the slab becomes its monitor. Tandoor flame flickers inside; slow-motion sparks. | — |
| **34% hold C** | 228 | Step 02 | Settles | Rig and monitor, flame breathing. | Step 02 · Planned shoot · "People, products, demonstrations and customer moments." |
| 34–50% | 228–336 | The deal | Pulls back and rises to 45° | The monitor slab splits. Twelve slabs peel off it like cards dealt from a deck and fan across the table into a 4×3 grid: four columns, four weeks. Each carries a different warm tint (the site's reel tints). Twelve smaller square slabs slide under them, the graphics. | — |
| **50% hold D** | 336 | Step 03, the wow | Settles | A full month laid out in glass, lit from within. | Step 03 · Month of assets · "Reels, graphics, captions and platform variants." |
| 50–62% | 336–416 | Scoring | Rises toward top-down | Four slabs lift higher than the rest, forming a bar chart in glass: keep, stop, test, amplify. The "stop" slab dims and sinks back to the table. The "amplify" slab pulses orange. | — |
| **62% hold E** | 416 | Step 04 | Settles | The scorecard, one dark bar, one bright. | Step 04 · Clear scorecard · "What worked, what changed and what comes next." then "One strategist. One calendar. One approval window." |
| 62–74% | 416–497 | Reveal | Pulls back, cranes up and over | The table edge falls away. It was a rooftop ledge. Below and beyond: Dallas at night, deep blue-black, a few magenta neon signs far off, red aircraft-warning lights blinking on the towers. The twelve slabs rest on the ledge like a row of lanterns. | — |
| **74% hold F** | 497 | The shift | Settles wide | Ledge right of center, city beyond, lower-left third dark sky. | `03 — WHAT WE DO` · "Create the content. Distribute it. Amplify what works." |
| 74–83% | 497–557 | Create | Slow push toward the ledge | Slabs stack, a blade of light trims them, thin light bars (captions) slide in under each one. The stack becomes tight, finished. | Card 1 fades in: Create |
| 83–92% | 557–618 | Distribute | Pans across the skyline | Slabs lift off the ledge and shrink into phone-sized rectangles that land in windows across the city, lighting up one by one. | Card 2 fades in: Distribute |
| 92–100% | 618–672 | Amplify | Pulls wide, final rise | From a radio mast on the tallest tower, concentric rings (the same ring motif as the FunAsia section) ripple outward. Each ring brightens the windows it crosses in a wave of magenta to orange. | Card 3 fades in: Amplify |
| **100% hold G** | 672 | Landing | Settles | Wide skyline, three lanes of light left to right, ledge bottom right, sky calm. | Footer line: "Start with consistent content. Add media only where it improves the business result." |

Total moving time about 22 s, holds about 6 s. The holds are not freezes: 12–24 frames of idle motion each (flame, dust, a reflection sliding on glass).

---

## Rules (shared with the hero clip)

- No text, no titles, no UI, no logos anywhere in the render. Ideas are objects and light only.
- Lower-left third of every frame stays dark and calm. Subjects right of center. This is where the copy lives.
- Peak brightness around 70%, no pure white. Deep shadows. Warm skin-tone palette on materials.
- Magenta and orange appear only as light sources and their reflections: threads, rim lights, neon, rings, the amplify pulse. Never as a flat fill.
- One light direction for the whole table sequence. When the ledge reveals the city, the practical stays and the city adds ambient blue-black from below.
- Film grain added in post, not in the render.
- **Render without heavy motion blur.** Scrubbing speed is set by the visitor, so 180° blur baked into frames smears when they scroll slowly. Use 60–90° shutter, or none, and let depth of field carry the cinematic feel.
- Ease every camera segment expo-out into its hold so slow scrolling near a hold feels weighted.

---

## Technical delivery

**Masters**
- 16:9 master at 1600×900, 672 frames, 16-bit EXR or ProRes, ACES workflow.
- 4:5 mobile master at 1080×1350 with its own camera, not a crop. Same beats, subjects centered, copy sits below the video on phones.
- One 24 fps H.264 mp4 of each for the reduced-motion fallback and for social.

**Scrub sequence (what the page actually loads)**
- Desktop: every 2nd frame → 336 frames, AVIF at 1600×900, q≈55, ≈35 KB each, ≈12 MB total. Plus a 320×180 proxy sequence (≈2 KB each, under 1 MB) that loads first so the section scrubs instantly, with full frames swapped in as they arrive, nearest-to-current-frame first.
- Mobile: every 3rd frame → 224 frames at 1080×1350, ≈5 MB. Loads only after the hero is interactive.
- WebP fallback where AVIF is unsupported.
- Mapping: ~15 px of scroll per frame on desktop. Section pinned for ~560vh. Holds mapped to fixed scroll positions so the HTML copy triggers on exact frames, listed above.
- Reduced motion: no pinning, the mp4 plays once per chapter on entry, copy in a normal vertical stack.

**Grade**
- Same LUT as the hero clip so the two videos read as one production.

---

## How to produce it

**Recommended: 3D render.** Blender (Cycles) or Cinema 4D with Redshift. A motion designer, roughly ten working days: two for blocking the camera path and holds as a greyscale animatic (approve pacing on the live site before any look-dev), five for materials, lighting and simulation (the card deal, the ring ripples), three for render, grade and export. This is the only path that gives exact holds, perfect object consistency and 4K headroom later.

**Optional hybrid.** Use the hero's live-action naan and tandoor clips as the textures inside the glass slabs. The two videos then share footage, which is what ties the page together.

**Fast animatic with the Magnific connector (1–2 days, for pacing only).** Generate the eight hold frames as stills, then Seedance 2.5 image-to-video from hold to hold with start and end keyframes, 5 s each, "very slow dolly, no cuts, objects do not change", concatenate, extract frames, scrub on the site. It will drift in object detail and cannot guarantee holds, so treat it as a proof of pacing, not the deliverable.

Style suffix for every still prompt: `dark studio table, single warm practical light, glass and brushed metal, magenta and orange only as light sources and reflections, deep shadows, shallow depth of field, photoreal, no text, no logos, no people, lower-left third dark and empty, subject right of center`

Hold prompts:
- A: `A single vertical glass slab lying on a dark table, a warm food video glowing inside it, thin orange rim light along its edge, dust in the beam`
- B: `The same glass slab with four small brass pins standing around it, thin magenta threads of light connecting the pins`
- C: `The glass slab standing upright as the monitor of a silhouetted camera gimbal rig, a tandoor flame glowing inside the glass, tiny sparks`
- D: `Twelve vertical glass slabs fanned into a four by three grid across a dark table, each glowing a different warm tint, twelve smaller square slabs beneath them`
- E: `Four glass slabs raised to different heights like a bar chart, one dim and sunk low, one pulsing orange, seen from above`
- F: `A dark rooftop ledge with a row of glowing glass slabs, Dallas skyline at night beyond, distant magenta neon, red aircraft lights on towers`
- G: `Wide Dallas skyline at night, concentric rings of magenta and orange light rippling out from a radio mast, windows lighting up in waves, a ledge with glass slabs bottom right`
