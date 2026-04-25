# Shared Card Overlay Assets

These are reusable modular card UI overlay assets for all card families, not only royal cards.

## Groups

- `TopCloths/`: top fabric strips for the upper card band.
- `PointRibbons/`: upper-left point ribbons with blank centers for `CardNumbers/`
  score digits. Long ribbons support score plus two ability medallions, medium
  ribbons support score plus one ability medallion, and short ribbons support
  score only.
- `BonusGemBadges/`: upper-right gem badge backs. Existing gem PNGs should be composited into the blank center, except `bonus-gem-badge-back-joker.png`, which is a complete integrated badge.
- `CostTokens/`: lower-left cost token backs. `CardNumbers/` provide the value digits; gem PNGs are placed independently near the token's right edge.
- `CardNumbers/`: pre-rendered digits extracted from `assets/card/overlays/CardNumbers/Number.png`.
  These replace editable Figma text for card cost values and upper-left score
  values.
- `CrownBadges/`: top-center crown badges for 1, 2, and 3 crowns.
- `AbilityMedallions/`: ability icons such as extra turn, privilege, steal, and bonus gem.
- `Source/`: source sprite sheets and regenerated chroma-key sources for these shared overlay assets.
- `Composites/`: contact sheets for visual QA of the shared overlay set.

## Conventions

- Final files are transparent PNG cutouts.
- Do not bake readable text or numbers into non-number overlay art; use
  `CardNumbers/` for score and cost digits.
- Color variants are `red`, `blue`, `green`, `black`, `white`, `pearl`, and `gold` where applicable.
- Top cloth assets use `1100x310` PNG canvases. Their visible subject width is fixed to `1086px`, placed at `x=7`, with the subject top fixed at `y=10`; height is preserved from the source aspect ratio and is not vertically stretched.
- Current top cloths are cut from the user-provided `ig_*.png` sources in `TopCloths/`; `top-cloth-*.png` are the processed transparent outputs.
- Current cost tokens are cropped directly from `CostTokens/cost-token.png`
  into transparent `320x320` square canvases.
- Current crown badges keep their original `1254x1254` resolution. Only the
  black matte is removed into transparency; Figma scales the full-resolution
  sources in the helper.
- The current bonus-gem ability medallion was regenerated from a magenta
  ImageGen source with an oversized plus sign so the extra-gem meaning remains
  legible after card-size reduction.
- The current extra-turn ability medallion was regenerated from a magenta
  ImageGen source with an oversized beveled gold loop arrow for thumbnail
  readability.
- Shared overlay normalization rules live in `overlay-normalization-spec.md`.
  `TopCloths/` keep their current standard; all other overlay groups should use
  the canvas, visible-bound, and anchor targets defined there.
