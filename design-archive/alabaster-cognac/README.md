# Alabaster & Cognac — archived design

A snapshot of the site as it stood at commit `25daedd`, before the move to the
dark "Reelative Electric" palette.

Kept as files as well as git history because the palette is the kind of thing
you want to look at side by side, not reconstruct from a diff.

## What defined it

Warm alabaster paper (`#F4F1EA`) as the page ground, one cognac accent
(`#7A4A1E` on light, `#C18A4E` on dark wells), Newsreader for the voice and
Instrument Sans for anything a customer had to read in order to buy.

The light ground was not a taste decision. Every asset the site owns is dark —
the business stills average under 80 luminance, the canister is a black
cylinder, and the 35mm film stock in the strip is `#08080A`. On a near-black
ground that film stock sat at **1.04:1** against the page: the strip had no edge
and read as a hole cut in the screen. On alabaster the same untouched footage
reads **17.74:1** and becomes an object on a light table.

That trade-off is worth re-reading before anyone reverses this decision again.

## Things tuned to the old ground

- `--color-studio` (`#FDEFD7`) is not a chosen colour. It is the backdrop the
  System rig footage was lit on, measured off the frames and flattened at build
  time so the sequence has no visible edge against the page. The 121 frames in
  `public/scroll/rig/` are graded to it. Change the section ground and that
  footage has to be regraded or it becomes a bright rectangle.
- Every contrast ratio quoted in `globals.css` is measured against these
  grounds.

## Restoring

    git checkout 25daedd -- src public tools docs

