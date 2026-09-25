#!/usr/bin/env node
/**
 * Set the caption fields on a Cloudflare Stream video.
 *
 *   node tools/stream/set-meta.mjs list
 *   node tools/stream/set-meta.mjs <videoId> --business "Badmaash Indian Restaurant" --info "Richardson, TX" --order 1
 *   node tools/stream/set-meta.mjs <videoId> --hidden true
 *   node tools/stream/set-meta.mjs <videoId> --poster "https://firebasestorage.../cover.jpg"
 *   node tools/stream/set-meta.mjs <videoId> --poster ""      # back to the Stream frame
 *
 * WHY THIS EXISTS. The Stream dashboard only lets you edit a video's NAME, but
 * the API accepts an arbitrary key-value `meta` object per video. The site
 * reads meta.business, meta.info, meta.order and meta.hidden, falling back to
 * parsing the name when they are absent. See src/lib/stream.ts.
 *
 * NEEDS AN EDIT TOKEN. The site's own token is scoped to Stream:Read, which is
 * correct — it never writes. Writing needs a token with Stream:Edit, supplied
 * as CLOUDFLARE_STREAM_WRITE_TOKEN so the two can never be confused and the
 * read-only one stays the thing that ships to the server.
 *
 * Reads .env.local itself, so nothing has to be exported into the shell.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const env = {};
  try {
    for (const line of readFileSync(resolve(".env.local"), "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* fall through to process.env */
  }
  return { ...env, ...process.env };
}

const env = loadEnv();
const ACCOUNT = env.CLOUDFLARE_ACCOUNT_ID;
// Falls back to the read token so `list` works without creating a second one.
const WRITE = env.CLOUDFLARE_STREAM_WRITE_TOKEN;
const READ = env.CLOUDFLARE_STREAM_TOKEN;

if (!ACCOUNT) {
  console.error("CLOUDFLARE_ACCOUNT_ID is missing from .env.local");
  process.exit(1);
}

const api = (path, token, init) =>
  fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/stream${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  }).then((r) => r.json());

const [target, ...rest] = process.argv.slice(2);

if (!target || target === "list") {
  const token = READ || WRITE;
  if (!token) {
    console.error("No token in .env.local");
    process.exit(1);
  }
  const body = await api("?limit=1000", token);
  if (!body.success) {
    console.error("Failed:", JSON.stringify(body.errors));
    process.exit(1);
  }
  console.log(
    ["uid", "ready", "business", "info", "order", "hidden", "poster", "name"]
      .map((h) => h.toUpperCase())
      .join("  |  "),
  );
  for (const v of body.result) {
    const m = v.meta ?? {};
    console.log(
      [
        v.uid,
        v.readyToStream ? "yes" : "NO",
        m.business ?? "",
        m.info ?? "",
        m.order ?? "",
        m.hidden ?? "",
        m.poster ? "custom" : "",
        m.name ?? "",
      ].join("  |  "),
    );
  }
  process.exit(0);
}

if (!WRITE) {
  console.error(
    "Writing needs CLOUDFLARE_STREAM_WRITE_TOKEN in .env.local — a token scoped to Account > Stream > Edit.\n" +
      "The site's CLOUDFLARE_STREAM_TOKEN is read-only on purpose and is not used here.",
  );
  process.exit(1);
}

// --business "x" --info "y" --order 1 --hidden true --name "z"
const meta = {};
for (let i = 0; i < rest.length; i += 2) {
  const key = rest[i]?.replace(/^--/, "");
  const value = rest[i + 1];
  if (!key || value === undefined) {
    console.error(`Missing value for --${key}`);
    process.exit(1);
  }
  meta[key] = value;
}
if (!Object.keys(meta).length) {
  console.error("Nothing to set. Try --business \"Name\" --info \"Detail\"");
  process.exit(1);
}

// Merge rather than replace: POSTing meta overwrites the whole object, so an
// unmentioned key would be silently dropped.
const current = await api(`/${target}`, WRITE);
if (!current.success) {
  console.error("Could not read that video:", JSON.stringify(current.errors));
  process.exit(1);
}
const merged = { ...(current.result.meta ?? {}), ...meta };

const res = await api(`/${target}`, WRITE, {
  method: "POST",
  body: JSON.stringify({ meta: merged }),
});
if (!res.success) {
  console.error("Failed:", JSON.stringify(res.errors));
  process.exit(1);
}
console.log("Updated", target);
console.log(res.result.meta);
