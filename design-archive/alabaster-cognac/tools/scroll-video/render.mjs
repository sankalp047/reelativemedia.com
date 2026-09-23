// Renders tools/scroll-video/scene.html frame by frame with the system Chrome.
// usage: node tools/scroll-video/render.mjs [--frames 300] [--out public/scroll/system] [--sample 0,0.1,...] [--scale 1.3333]
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => a.startsWith("--") ? [a.slice(2), arr[i + 1] ?? "true"] : []).filter(Boolean));
const FRAMES = Number(args.frames ?? 300);
const OUT = resolve(args.out ?? "tools/scroll-video/out");
const SCALE = Number(args.scale ?? 4 / 3); // 1920×1080 scene → 2560×1440 frames
const SAMPLE = args.sample ? args.sample.split(",").map(Number) : null;
const MOBILE = args.layout === "mobile";
const W = MOBILE ? 540 : 1920, H = MOBILE ? 960 : 1080;
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--no-sandbox", "--allow-file-access-from-files", "--hide-scrollbars", "--force-color-profile=srgb"],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: SCALE });
page.on("pageerror", (e) => console.error("PAGE ERROR", e.message));
await page.goto("file://" + resolve("tools/scroll-video/scene.html") + (MOBILE ? "?layout=mobile" : ""), { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 500));
const duration = await page.evaluate(() => window.SCENE.duration);
console.log("timeline seconds:", duration.toFixed(2));

const progresses = SAMPLE ?? Array.from({ length: FRAMES }, (_, i) => i / (FRAMES - 1));
for (let i = 0; i < progresses.length; i++) {
  const p = progresses[i];
  await page.evaluate((p) => window.SCENE.seek(p), p);
  await new Promise((r) => setTimeout(r, 16));
  const name = SAMPLE ? `sample_${String(Math.round(p * 1000)).padStart(4, "0")}.png` : `f_${String(i).padStart(4, "0")}.png`;
  await page.screenshot({ path: `${OUT}/${name}`, clip: { x: 0, y: 0, width: W, height: H } });
  if (i % 25 === 0 || SAMPLE) console.log("frame", i, "p=", p.toFixed(3));
}
await browser.close();
console.log("done →", OUT);
