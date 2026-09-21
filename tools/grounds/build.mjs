/**
 * Builds the photographic ground used behind the two dark wells (Statement,
 * FinalCTA).
 *
 * Why a generated file rather than a flat colour: a large dark rectangle at
 * 1440px is exactly where a screen announces that it is a screen. This gives
 * the wells three or four faint warm blooms so they read as a lit room rather
 * than as a CSS fill. Nobody reads it as an image.
 *
 * Source is public/images/strip/jewellery.webp — the warmest and most specular
 * of the ten business stills (mean RGB 95/38/34), and free to consume because
 * nothing in src/ references public/images/strip/ at all (SEGMENTS.image points
 * at public/images/segments/).
 *
 * Do NOT greyscale-then-tint. Keeping a third of the source's own amber is what
 * makes it warm; a greyscale pipeline comes out neutral and dead.
 *
 * THE ASSERTION IS THE POINT. The failure mode for a blurred dark photo behind
 * text is not the photo — it is the day somebody decides it looks too dark,
 * dials the crush back so you can "see the shot", and silently invalidates
 * every contrast figure in docs/design-system.md. This script reads the written
 * file back raw, computes per-pixel relative luminance, and throws if any pixel
 * exceeds the --scrim-floor ceiling. That turns the guarantee into something CI
 * enforces rather than something a reviewer remembers.
 *
 *   npm run grounds:build
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/images/strip/jewellery.webp";
const OUT_DIR = "public/images/ground";

/** --scrim-floor #1C1913. Every contrast figure quoted over a well is
 *  computed against THIS value, not against the image's average. */
const CEIL_RGB = [0x1c, 0x19, 0x13];

const lin = (c) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const relLum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const CEIL = relLum(...CEIL_RGB);

/* These constants are load-bearing. The assertion below exists to make
   loosening them fail the build rather than fail quietly. */
const SATURATION = 0.34;
const BLUR = 48;
const LINEAR_SLOPE = 0.13;
const LINEAR_OFFSET = -3;

const VARIANTS = [
  [2400, 1350, `${OUT_DIR}/salon-2400.webp`],
  [1200, 675, `${OUT_DIR}/salon-1200.webp`],
];

await mkdir(OUT_DIR, { recursive: true });

let failed = false;

for (const [width, height, out] of VARIANTS) {
  // Note: the source is 1080x720, so this is an upscaled 16:9 crop, not a
  // photograph. At blur sigma 48 that is visually irrelevant — but do not
  // "fix" the resolution later, because it would invalidate the assertion.
  await sharp(SRC)
    .resize({ width, height, fit: "cover", position: "centre" })
    .modulate({ saturation: SATURATION })
    .blur(BLUR)
    .linear(LINEAR_SLOPE, LINEAR_OFFSET)
    .webp({ quality: 70, effort: 6 })
    .toFile(out);

  const { data, info } = await sharp(out).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  let maxL = 0;
  let sum = [0, 0, 0];
  const px = info.width * info.height;
  for (let i = 0; i < data.length; i += ch) {
    const l = relLum(data[i], data[i + 1], data[i + 2]);
    if (l > maxL) maxL = l;
    sum[0] += data[i];
    sum[1] += data[i + 1];
    sum[2] += data[i + 2];
  }
  const mean = sum.map((s) => (s / px).toFixed(1)).join(" / ");
  const ok = maxL <= CEIL;
  const headroom = (((CEIL - maxL) / CEIL) * 100).toFixed(0);
  console.log(
    `${ok ? "ok  " : "FAIL"} ${out}  ${info.width}x${info.height}  ` +
      `maxL ${maxL.toFixed(5)} / ceil ${CEIL.toFixed(5)} (${headroom}% headroom)  ` +
      `mean RGB ${mean}`,
  );
  if (!ok) failed = true;
}

if (failed) {
  console.error(
    `\nA generated ground exceeds the --scrim-floor ceiling L(#1C1913) = ${CEIL.toFixed(5)}.\n` +
      `Every contrast figure quoted over the dark wells is computed against that value,\n` +
      `so this is not a cosmetic warning — the numbers in docs/design-system.md would be\n` +
      `wrong. Restore the crush constants rather than raising the ceiling.`,
  );
  process.exit(1);
}
