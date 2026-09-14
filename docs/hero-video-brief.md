# Hero background video brief — "Camera to Customer"

The hero video sits muted behind the site headline. It contains **no text, no titles, no logos**. It shows what Reelative does, in action, end to end.

## Concept

A 12-second seamless loop that follows one piece of content through the whole Reelative system: the shoot, the edit, the post, the customer walking in. Every cut is a hand-off from one screen to the next so it reads as one continuous motion.

## Shot list (12 s, 24 fps, shoot 60–120 fps for slow motion)

| Time | Beat | Shot |
|---|---|---|
| 0.0–2.5 | Capture | Slow push-in on a gimbal operator in a dark restaurant kitchen, tandoor flames behind. The camera monitor shows the shot: a chef pulling naan in slow motion. |
| 2.5–4.0 | Edit | Match cut to that naan clip on an editing timeline. A hand drags a clip, scrubs, adds a cut. Screens glowing in a dark room. |
| 4.0–5.5 | Post | The same clip on a phone, a thumb hits share. Quick stack of three phone screens in three hands: a car, a waiting room, a couch. |
| 5.5–7.5 | Reaction | Slow motion: a woman on the couch pauses, taps, smiles, turns the phone to show someone. |
| 7.5–9.5 | Result | The restaurant door opens. That same woman walks in, phone in hand. The chef looks up. |
| 9.5–12.0 | Loop | The gimbal operator is already there, turning to film her reaction. Push back into the monitor. Cuts invisibly to 0.0. |

Optional 36-second version: repeat the same six beats for a jeweler (customer arrives to try on the ring she saw) and a dentist (a dad books from the waiting-room reel).

## Rules

- Zero on-screen text. Phone UI is fine, but blur or crop any readable captions.
- Text on the site sits bottom-left. Keep the bottom-left third dark and calm in every shot; put subjects right of center.
- No pure white frames; peak brightness around 70%.
- Grade: deep shadows, warm skin, magenta and orange highlights from practical lights (tandoor, neon, screens).
- Real faces, real DFW businesses, ideally current FunAsia clients. No AI-generated people.
- 24 fps look, 180° shutter, light film grain, no jitter or whip pans.

## Delivery

- 1920×1080 (16:9) for desktop and a separately framed 1080×1920 (9:16) for mobile.
- H.264 mp4 plus VP9 webm, no audio track, under 4 MB each.
- First frame exported as a webp poster (the page's LCP element).
- Scroll-scrub option: export beat 1 alone as a 6-second push-in with no cuts, 150 webp frames at 1440px wide.

## Fast first version

Film the human beats with a phone on a gimbal in one afternoon at one client restaurant. Generate only the no-face inserts with AI and upscale with Magnific:

Style suffix for every prompt: `cinematic, shallow depth of field, 24fps motion blur, warm practical lighting with magenta and orange highlights, dark background, film grain, no text, no logos, no people`

- `Tandoor flames rising in slow motion inside a dark restaurant kitchen`
- `Close-up of naan bread being pulled from a clay oven with tongs, slow motion, steam`
- `Video editing timeline on a monitor in a dark room, clips being dragged, screen glow`
- `A restaurant front door opening from inside toward bright afternoon light, camera pushes forward`
