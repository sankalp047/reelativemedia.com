# AI prompts for the placeholder imagery

Every image and clip on the site is currently a generated gradient. This file
has a prompt for each one, mapped to the file it replaces.

**How to use.** Paste the STYLE BLOCK, then the subject line for the asset you
want, then the NEGATIVE line. Ratios are listed per group.

---

## STYLE BLOCK — prepend to every people/place prompt

> Photorealistic frame from a professionally shot vertical social video. Full-frame
> mirrorless camera, 35mm lens at f/2.0, shallow depth of field with a soft
> background falloff. Natural window light as the key with a gentle bounce fill,
> warm neutral white balance, true-to-life skin tones, mild film grain. Candid
> documentary feel, not a stock photo, not posed at the camera. Clean composition
> with empty headroom in the top third for on-screen captions. Dallas–Fort Worth,
> Texas setting, present day.

## NEGATIVE — append to every prompt

> no text, no lettering, no captions, no watermarks, no logos, no brand names, no
> signage text, no UI overlays, no distorted hands, no extra fingers, no plastic
> skin, no HDR halos, no heavy vignette, no stock-photo smiles

**Ratios:** reels and testimonials 9:16 · events 4:3 · creator portraits 1:1 ·
hero montage 16:9 plus a 9:16 crop.

---

## 1. Reel posters — 9:16

Twelve stills, one per card. Replaces `public/posters/reel-01.jpg` … `reel-12.jpg`
(and the first frame of each `public/video/reel-NN.mp4`). The mix is deliberately
multicultural: FunAsia's audience is South Asian DFW, and that should show.

| File | Prompt subject |
|---|---|
| `reel-01` | A chef's hands lifting a cast-iron skillet of sizzling fajitas over a pass in a busy Frisco restaurant kitchen, steam catching the window light, blurred service line behind. |
| `reel-02` | A South Asian woman dentist in navy scrubs mid-sentence to camera-left in a bright modern Plano dental clinic, chair and monitor softly out of focus behind her. |
| `reel-03` | Extreme close-up of hands turning a gold and ruby bangle under a jeweller's lamp on a dark velvet tray, Irving boutique interior bokeh behind. |
| `reel-04` | A real estate agent walking through the front door of a new-build Prosper home into a sunlit open-plan living room, camera following from behind at hip height. |
| `reel-05` | A lawyer in shirtsleeves leaning forward at a walnut desk in a downtown Dallas office, mid-explanation, window blinds casting soft lines, bookcase blurred behind. |
| `reel-06` | Overhead of a plate of pani puri and chaat being assembled on a steel counter at a Richardson chaat house, hands sprinkling sev, tamarind chutney glistening. |
| `reel-07` | A calm Southlake med spa treatment room, an aesthetician's gloved hands preparing a facial tool on a white tray, eucalyptus and soft daylight, no client face visible. |
| `reel-08` | A bridal consultant adjusting the dupatta on a heavily embroidered red and gold lehenga on a mannequin in a Carrollton bridal showroom, mirrors and warm lamps behind. |
| `reel-09` | A mortgage advisor and a young couple at a small table, laptop between them, the advisor pointing at the screen, McKinney office with a window behind. |
| `reel-10` | A CPA at a standing desk in an Irving office, two monitors with soft unreadable glow, reaching for a coffee, late afternoon light raking across the desk. |
| `reel-11` | A huge pot of dum biryani being opened in a Plano kitchen, steam billowing up, saffron rice and lamb visible, cook's hand holding the lid to one side. |
| `reel-12` | A pediatric dentist kneeling to eye level with a small child in a colourful Frisco clinic, both laughing, toy display blurred behind, bright and friendly. |

## 2. Testimonial stills — 9:16

Replaces `public/posters/testimonial-01.jpg` … `-03.jpg`. Frame each as a seated
interview: subject slightly off-centre, looking just past the lens, their own
business softly out of focus behind them.

1. **Restaurant owner, Frisco.** A man in his forties in a chef's jacket seated in
   his own dining room before service, warm pendant lights behind him.
2. **Dental clinic director, Plano.** A South Asian woman in her thirties in a
   white coat seated in her clinic reception, clean and bright, plants behind.
3. **Jewellery boutique owner, Irving.** A woman in her fifties in a silk kurta
   seated beside a lit display cabinet, gold catching the light behind her.

## 3. Event photos — 4:3

For the FunAsia "events and activations" tile. Wide, candid, crowd energy.

1. An outdoor Diwali mela at dusk in a DFW plaza, strings of lights, families
   walking between food stalls, a small stage glowing in the background.
2. A radio station roadshow tent at a community fair, branded-free canopy, a host
   with a handheld mic talking to a small crowd in daylight.
3. A packed indoor concert hall from the side of the stage, hands up in the
   audience, warm stage wash, motion blur in the crowd.

## 4. Creator portraits — 1:1

Four head-and-shoulders portraits for the creator-partnerships tile. Plain warm
backdrop, soft key, relaxed half-smile, eyes to camera. Vary age, gender and
South Asian / Latino / East Asian / white backgrounds to reflect DFW.

## 5. Hero montage — 16:9 and a 9:16 crop

Already generated once. If you re-cut it, prompt for a **single slow camera move
with no hard cuts** so it scrubs cleanly, 8–12 seconds:

> Slow dolly-in through a small business at golden hour while a two-person video
> crew works: one operator on a gimbal, one adjusting a light stand. Warm
> practical lighting, dust in the air, staff going about their work in the
> background. One continuous move, no cuts, no text.

---

## 6. The decorative marks (satellites) — 1:1

These are the twelve shapes in `src/components/ui/Satellite.tsx`, currently drawn
by hand. They are the weakest thing on the site. Generate better ones, vectorise
them, and drop them back into that component.

**Read this first.** Each mark is recoloured per placement through the `tint`
prop (violet / magenta / orange / paper). If you bake a colour into the artwork
you lose that. So generate every icon in **one flat colour plus black outline**,
vectorise, then replace that one fill with the tint variable. Keep the artwork on
a 100 × 100 canvas with about 8 units of margin so the existing sizes still work.

### STYLE BLOCK — prepend to every icon subject

> Flat vector icon in a bold graphic sticker style. One single centred object,
> straight-on front view, no perspective and no rotation. Every shape and every
> interior detail carries a uniform pure black contour of even weight with rounded
> joins and caps. Solid flat fills only. No gradients, no shading, no highlights,
> no ambient occlusion, no texture. Crisp geometric construction, chunky friendly
> proportions, generous negative space, still legible at 80 pixels. Perfectly
> centred with even margins on a plain flat off-white background. Square 1:1.

### NEGATIVE — append to every icon subject

> no text, no letters, no numbers, no watermark, no signature, no gradient, no
> drop shadow, no glow, no 3d, no bevel, no photorealism, no sketch or pencil
> lines, no crosshatching, no grain, no paper texture, no multiple objects, no
> background scenery, no border frame, no perspective, no hairline strokes, no
> broken or tapering outlines

### Subjects — one per mark

| Shape key | Prompt subject |
|---|---|
| `clapper` | A film clapperboard seen straight on, its hinged top stick open about 25 degrees above a plain rectangular slate, four bold diagonal stripes across the stick, the slate face left completely blank. |
| `iris` | A camera lens aperture seen head on: a filled circle with six straight iris blades sweeping inward to form one clean hexagonal opening at the centre, the opening left pale. |
| `ringlight` | A ring light seen head on: one thick even annulus with a perfectly round hole through the middle, standing on a short straight post with a small flat base. |
| `awning` | A striped shop awning seen straight on: a half-dome canopy with alternating wide vertical stripes and a scalloped lower edge of six evenly rounded arcs. |
| `frame` | A tall vertical 9:16 video frame: one rounded rectangle, with four separate L-shaped corner brackets floating just outside its four corners. |
| `reticle` | An autofocus reticle: four separate L-shaped corner brackets arranged as a square with a clear gap between each one, and a single small solid dot exactly at the centre. |
| `scrubber` | A video timeline scrubber seen straight on: one long horizontal rounded track, the left portion filled, a large round playhead knob sitting on the track, a row of short evenly spaced tick marks beneath it. |
| `waveform` | An audio waveform: seven vertical rounded bars of varying height, symmetrical about the centre, tallest in the middle, evenly spaced, all centred on one horizontal axis. |
| `record` | A record button: one thick outlined ring with a solid filled circle centred inside it, concentric, with a generous even gap between the ring and the circle. |
| `cable` | A single coiled audio cable drawn as one continuous thick rope of even width, looping over itself twice with both ends open, completely flat with no perspective. |
| `tripod` | A camera tripod seen from the front: a small rectangular head on top, three straight legs splayed evenly and symmetrically, one horizontal spreader bar across the middle of the legs. |
| `softbox` | A softbox light tilted about 15 degrees: a rectangular softbox with a pale diffusion panel inset in a solid frame, mounted on one straight pole with a small tripod base. |

### Lock the style first — generate the set as one sheet

Style drifts between separate generations. Make one sheet, pick the look, then
re-generate each mark individually against it.

> A 4 by 3 grid of twelve flat vector icons on one plain off-white sheet, all in a
> single consistent style: a film clapperboard, a camera lens aperture, a ring
> light, a striped shop awning with a scalloped edge, a tall vertical video frame
> with corner brackets, an autofocus reticle, a video scrubber bar with a round
> knob, an audio waveform of seven bars, a record button, a coiled cable, a camera
> tripod, a softbox light on a stand. Every icon has a uniform pure black contour
> of the same weight and solid flat fills. Equal visual weight and equal optical
> size, each icon centred in its own cell, even spacing, no labels and no text.

### Three style directions to try

Run the sheet prompt three times with one of these appended, and pick one.

1. **Hard-shadow sticker.** `Each icon carries a hard offset shadow in solid
   black, displaced six units down and right, with no blur at all, like a
   screen-printed sticker.`
2. **Risograph.** `Printed as a two-colour risograph: visible halftone dot
   texture, slight ink misregistration, and a darker overprint where the two inks
   overlap.` Drop "no texture" and "no grain" from the negative for this one.
3. **Chunky isometric.** `Chunky isometric three-quarter view on a 30 degree
   axis, each face a single flat tone with no more than three tones per object,
   thick black contour retained.` Drop "no perspective" and "no 3d" for this one.

### Models and settings

- **Recraft** is the strongest of these at genuine vector icons and exports SVG
  directly. Use its icon or vector-art style.
- **Ideogram** and **Flux** hold flat fills and even contours well. Midjourney
  needs `--style raw --stylize 50` or it adds texture and lighting.
- Generate at 1024 × 1024 or larger, one icon per image for the finals.

### Then vectorise and wire in

1. Trace to SVG (Magnific `images_to_svg`, Recraft's SVG export, or Illustrator
   Image Trace set to about six colours with white ignored).
2. Normalise to a `0 0 100 100` viewBox and delete the background rectangle.
3. Set every contour to one stroke width so the marks match each other.
4. Replace the single flat fill with `{fill}` in `Satellite.tsx` so the `tint`
   prop keeps working, and leave the outline hard-coded to `INK`.

---

## Do NOT generate these with AI

- **Client logos** (`CLIENT_LOGOS`) — these belong to real businesses. Ask each
  client for an SVG and permission to display it.
- **The five FunAsia station logos** — real brand marks. Get them from FunAsia.
- **The Reelative logo** — the current mark is drawn to match the gradient. Have
  the real one supplied as SVG.

The decorative marks in section 6 are the exception: they represent nothing real,
so generating them carries no misrepresentation risk.

## Before launch

These images are **placeholders, not portfolio**. The cards sit next to view
counts like "1.2M views". Generated imagery presented as delivered client work
with real performance numbers would misrepresent the business to prospects.
Either swap in real client reels with real numbers before launch, or keep the
"placeholder" chips visible and drop the counts until the real work lands.
