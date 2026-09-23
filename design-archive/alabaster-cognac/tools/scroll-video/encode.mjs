// Encodes rendered PNG frames into the sequences the page loads.
// usage: node tools/scroll-video/encode.mjs --in <pngDir> --out public/scroll/system/desktop --name desktop [--quality 58] [--proxy 240]
import sharp from "sharp";
import { readdirSync, mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";

const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => a.startsWith("--") ? [a.slice(2), arr[i + 1] ?? "true"] : []).filter(Boolean));
const IN = resolve(args.in);
const OUT = resolve(args.out);
const NAME = args.name ?? "desktop";
const Q = Number(args.quality ?? 58);
const PROXY_W = Number(args.proxy ?? 240);
mkdirSync(OUT, { recursive: true });

const files = readdirSync(IN).filter((f) => /^f_\d+\.png$/.test(f)).sort();
if (!files.length) throw new Error("no frames in " + IN);
const meta = await sharp(join(IN, files[0])).metadata();
console.log(`${files.length} frames, ${meta.width}×${meta.height} → ${OUT}`);

let avifBytes = 0, webpBytes = 0, proxyBytes = 0;
const CONC = 6;
let next = 0;
async function worker() {
  while (next < files.length) {
    const i = next++;
    const src = join(IN, files[i]);
    const base = `f_${String(i).padStart(4, "0")}`;
    const img = sharp(src);
    const [a, w, p] = await Promise.all([
      img.clone().avif({ quality: Q, effort: 4, chromaSubsampling: "4:2:0" }).toBuffer(),
      img.clone().webp({ quality: Q + 12, effort: 4 }).toBuffer(),
      img.clone().resize({ width: PROXY_W }).webp({ quality: 60 }).toBuffer(),
    ]);
    writeFileSync(join(OUT, base + ".avif"), a);
    writeFileSync(join(OUT, base + ".webp"), w);
    writeFileSync(join(OUT, base + ".p.webp"), p);
    avifBytes += a.length; webpBytes += w.length; proxyBytes += p.length;
    if (i % 50 === 0) console.log("encoded", i);
  }
}
await Promise.all(Array.from({ length: CONC }, worker));

const manifestPath = resolve("src/lib/scroll-video-manifest.json");
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
manifest[NAME] = { base: "/" + args.out.replace(/^public\//, "").replace(/\/$/, ""), frames: files.length, width: meta.width, height: meta.height, proxyWidth: PROXY_W };
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
const mb = (b) => (b / 1048576).toFixed(2) + " MB";
console.log(`avif ${mb(avifBytes)} · webp ${mb(webpBytes)} · proxy ${mb(proxyBytes)} · manifest → ${manifestPath}`);
