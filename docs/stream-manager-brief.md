# Build brief — a local manager for the Reelative Media video library

Hand this whole file to Claude Code in an EMPTY folder. It is self-contained:
everything needed to build the tool is here, and no other repository has to be
read.

---

## 1. What you are building

A small local web app for one person to manage a Cloudflare Stream video
library. It is an internal tool, not a public site. It runs on localhost and is
never deployed.

It must let the operator:

- **See every video** as a grid of poster thumbnails, so they can tell at a
  glance which video is which. This is the whole point. The videos are named
  things like `IMG_7914.mp4` and `sals.MOV`, and nobody can work out what
  those are from a list of filenames.
- **See, next to each thumbnail, the captions currently stored on it**, so the
  operator can tell what the public website is displaying right now.
- **Edit those captions** and save them back to Cloudflare.
- **See clearly which videos are still uncaptioned**, since those are the work
  queue.
- **Play a video** to check what it actually contains before captioning it.
- **Show a diff or at least a clear before-and-after** when a change is saved,
  because the operator has been bitten by editing the wrong video.

Nice to have, in this order: uploading new videos, bulk edit, undo.

---

## 2. The critical part: this data is read by a live website

A public marketing site already reads this same Cloudflare library and renders
a card per video. **The field names below are a contract.** If you invent
different ones, the website will silently ignore everything the operator types.

Each Stream video carries a `meta` object, which Cloudflare describes as a
user-modifiable key-value store. Every value is a **string**. The website reads
exactly these keys:

| key | meaning | example |
|---|---|---|
| `business` | the big line on the card | `Badmaash Indian Restaurant` |
| `info` | the small line underneath | `Richardson, TX` |
| `order` | sort position, lower first, absent sorts last | `1` |
| `hidden` | the string `true` removes the card from the site without deleting the video | `true` |
| `poster` | absolute https URL of a custom cover image | a Firebase Storage URL |
| `name` | Cloudflare's own name field, shown in their dashboard | `IMG_7914.mp4` |

Two fallbacks the website applies, which your UI should make visible so the
operator understands what they will see:

1. If `business` is empty, the site parses `name` using the convention
   `01. Business name | Business info`. The numeric prefix is optional and
   sets order. If there is no pipe, the whole name becomes the heading with no
   second line, and any file extension is stripped.
2. If `poster` is empty, the site uses Cloudflare's own generated thumbnail.

So a video with no meta at all still appears on the site, captioned with its
filename. That is why the operator needs this tool.

---

## 3. Cloudflare API reference

Base URL: `https://api.cloudflare.com/client/v4`

Account ID: `cca9a1e6cffbd1da3bd5fb2e68d6cb52`

Auth header on every request: `Authorization: Bearer <TOKEN>`

### List every video

```
GET /accounts/{account_id}/stream?limit=1000
```

Returns `{ success, result: [...] }`. Useful fields per video:

| field | use |
|---|---|
| `uid` | the 32-char video id |
| `meta` | the key-value object above |
| `thumbnail` | generated poster image URL |
| `playback.hls` | HLS manifest for playback |
| `readyToStream` | false while encoding; nothing to show yet |
| `input.width` / `input.height` | source dimensions, so portrait vs landscape is detectable |
| `duration` | seconds |
| `created` | RFC 3339 timestamp |

Other query params that exist: `status`, `search` (partial match on
`meta.name`), `creator`, `asc`, `start`, `end`.

### Read one video

```
GET /accounts/{account_id}/stream/{uid}
```

### Update a video's meta

```
POST /accounts/{account_id}/stream/{uid}
Content-Type: application/json

{ "meta": { "business": "...", "info": "...", "order": "1" } }
```

**POSTing `meta` replaces the whole object.** Any key you omit is destroyed.
Always read the current meta first, merge your changes over it, then post the
merged result. Getting this wrong wipes captions the operator already typed.

### Delete a video

```
DELETE /accounts/{account_id}/stream/{uid}
```

**Permanent, with no undo.** Require an explicit typed confirmation in the UI.
Some of these videos are client work and Cloudflare may be the only copy.

---

## 4. Tokens and secrets

Two tokens, created at Cloudflare, My Profile, API Tokens, Create Custom Token.
Permission row is Account, then Stream, then Read or Edit. Scope to the one
account.

| env var | scope | used for |
|---|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | not a secret | every request |
| `CLOUDFLARE_STREAM_TOKEN` | Stream **Read** | listing and viewing |
| `CLOUDFLARE_STREAM_WRITE_TOKEN` | Stream **Edit** | saving changes |

Rules, which matter because a token was already leaked once on this project:

- Keep both in `.env.local` and gitignore it. Never commit either.
- Never expose a token to the browser. All Cloudflare calls go through your own
  server route or server action. **A token in client JavaScript is a token
  published to the world.**
- Never print a token to the console or into a log file.
- Prefer the read token for anything that only reads.

---

## 5. Constraints you cannot design around

- **Cloudflare Stream cannot store a cover image.** Its thumbnails are always a
  frame of the video, selected with `thumbnailTimestampPct`, a value from 0 to
  1 set via the update endpoint. There is no endpoint to upload your own image.
  That is why custom covers are hosted elsewhere and only the URL is kept in
  `meta.poster`. Do not waste time looking for an upload endpoint.
- **Uploads never go through your server.** Use a direct creator upload: your
  server requests a one-time URL, the browser sends the file straight to
  Cloudflare. Simple upload is capped at 200MB; larger files need the resumable
  tus protocol. You must reserve a `maxDurationSeconds` up front.
- **The API is rate-limited per account.** Cache list responses; do not poll in
  a tight loop.
- **A freshly uploaded video has `readyToStream: false`** for a minute or two
  while it encodes, with no thumbnail. Show that state rather than a broken
  image.
- **Every meta value is a string.** `order` is `"1"`, not `1`.

---

## 6. The library as it stands today

Nine videos. Four are captioned, five are not. The uncaptioned ones are the work
queue.

| video id | filename | source | secs | business | info | custom cover |
|---|---|---|---|---|---|---|
| `a00017ba33ff639bf2b5864f1bab212b` | IMG_7914.mp4 | 1080x1920 | 76 | Badmaash Indian Restaurant | Richardson, TX | yes |
| `bc53986a0f0dfc220b43674961711a03` | marc.mp4 | 1920x1080 | 176 | Marc Samuels Jewelers | Product close-up and craftsmanship | no |
| `27a2e8d44e4cc363ba04420bd3f676b1` | omar.mov | 2160x3840 | 45 | Omar Khawaja Law | Five mistakes people make after an accident | no |
| `a533b5837d4882f1b6496982a047f28a` | IMG_4714.mov | 1440x2560 | 59 | Omar Khawaja Law | Three things to do immediately after an accident | no |
| `02fc0c4c2158dd913a80992a3c907923` | IMG_7968.mp4 | 1080x1920 | 147 | — | — | no |
| `5a4a4b0e842b513a580fc41b9187b745` | IMG_7997.MOV | 1080x1920 | 32 | — | — | no |
| `80c482fe855fd147ea2bdfee65bc0eb3` | music.MOV | 1080x1920 | 24 | — | — | no |
| `ed2e7aa95c05ede9207f6393aed130b6` | sals.MOV | 1080x1920 | 31 | — | — | no |
| `fa5b5bedc694492611b3bd5c9c873a23` | IMG_7962.mov | 1080x1920 | 31 | — | — | no |

Known context on the uncaptioned five, gathered by looking at their poster
frames:

- `sals.MOV` shows a camera rig. The filename suggests a business name.
- `IMG_7968.mp4` shows a woman presenting in a showroom with a red logo, and
  runs 2.5 minutes. It looks like real client work.
- `music.MOV`, `IMG_7997.MOV` and `IMG_7962.mov` are Reelative's own brand
  reels, not client work. They probably want `hidden: true`.

Playback host for this account: `customer-fmhmyy4djjklusvj.cloudflarestream.com`

- Poster: `https://customer-fmhmyy4djjklusvj.cloudflarestream.com/{uid}/thumbnails/thumbnail.jpg`
- HLS: `https://customer-fmhmyy4djjklusvj.cloudflarestream.com/{uid}/manifest/video.m3u8`

HLS does not play natively in Chrome or Firefox. Use `hls.js`, or embed
Cloudflare's own iframe player at
`https://customer-fmhmyy4djjklusvj.cloudflarestream.com/{uid}/iframe`, which
is simpler and fine for an internal tool.

---

## 7. Suggested build

Next.js App Router with TypeScript, because the website it serves is already
that and the operator has it installed. A single page is enough.

- Server component or server action fetches the list. Token stays server-side.
- Grid of cards: poster image, filename, duration, portrait or landscape badge,
  and the current `business` / `info` / `order` / `hidden` values.
- Uncaptioned videos visually marked and sorted to the top.
- Inline edit per card, saving through a server action that reads, merges and
  posts the meta.
- After saving, show what changed, old value to new value.
- A preview button that opens the Cloudflare iframe player.

Keep it one screen. It is a tool for one person, not a product.

---

## 8. Do not

- Do not deploy this anywhere.
- Do not put any token in client-side code.
- Do not delete videos without a typed confirmation.
- Do not rename the meta keys in section 2.
- Do not replace the meta object without merging first.
