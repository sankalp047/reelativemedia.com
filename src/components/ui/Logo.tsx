/**
 * The real Reelative Media lockup, extracted from the client pitch deck and cut
 * out with a border flood fill (a plain white key would have punched through the
 * white play triangle inside the mark).
 *
 * Source assets in `public/logo/`:
 *   reelative-media.webp       526×120, the original light-ground cutout
 *   reelative-media.png        1052×240, raster with broad compatibility
 *   reelative-mark.png         the symbol on its own
 *   reelative-media-dark.webp  526×120, the dark-ground knockout
 *   reelative-media-dark.png   1052×240
 *   reelative-mark-dark.png    the symbol on its own
 *
 * The `-dark` set is derived from the raster master for the Ink & Brass ground:
 * the wordmark was dark navy and disappeared on #0e0e11, so it is knocked out to
 * bone through its own alpha; the mark's edge pixels were matted against white,
 * so they are un-premultiplied and the leftover speckle on the silhouette is
 * cleared. The gradient mark is the one place saturated colour still survives.
 *
 * It is still a raster derived from a raster — get the vector original from the
 * client and regenerate both sets from that before print or large display use.
 */

/** Full lockup aspect: 1337 × 305 in the trimmed source. */
const LOCKUP_RATIO = 1337 / 305;
/** Symbol only. */
const MARK_RATIO = 151 / 128;
/** Wordmark only: 737 × 171, cut from the 1052×240 raster master. */
const WORDMARK_RATIO = 737 / 171;

export function Logo({
  className = "",
  height = 28,
  alt = "Reelative Media",
  tone = "light",
}: {
  className?: string;
  height?: number;
  alt?: string;
  /** `dark` is the bone knockout, for the footer well only. */
  tone?: "light" | "dark";
}) {
  const width = Math.round(height * LOCKUP_RATIO);
  const src = tone === "dark" ? "/logo/reelative-media-dark.webp" : "/logo/reelative-media.webp";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ height, width }}
      decoding="async"
    />
  );
}

/**
 * The wordmark on its own, for when the symbol is already on screen separately —
 * the nav puts the gradient mark at the left and this in the centre, so showing
 * the full lockup there would repeat the symbol.
 *
 * Cut from `reelative-media.png` at the measured ink bounding box (x 314–1050,
 * y 55–225): the symbol occupies columns 3–285 and the type 314–1050, with a
 * clean 28px gutter between them, so the split needed no masking.
 *
 * Light ground only. There is no dark knockout of this crop yet — the footer
 * still uses the full <Logo tone="dark" /> lockup.
 */
export function Wordmark({
  className = "",
  height = 26,
  alt = "Reelative Media",
}: {
  className?: string;
  height?: number;
  alt?: string;
}) {
  const width = Math.round(height * WORDMARK_RATIO);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo/reelative-wordmark.webp"
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ height, width }}
      decoding="async"
    />
  );
}

export function LogoMark({
  className = "",
  size = 28,
  tone = "light",
}: {
  className?: string;
  size?: number;
  tone?: "light" | "dark";
}) {
  const width = Math.round(size * MARK_RATIO);
  const src = tone === "dark" ? "/logo/reelative-mark-dark.png" : "/logo/reelative-mark.png";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={width}
      height={size}
      className={className}
      style={{ height: size, width }}
      decoding="async"
      aria-hidden="true"
    />
  );
}
