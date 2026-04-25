# Card Overlay Normalization Spec

This spec defines the production geometry for shared transparent card overlay
PNGs. It is intended to keep Figma placement consistent across color variants.

## Global Rules

- Final assets are transparent PNG cutouts.
- Do not bake readable text or numbers into non-number overlay art; score and
  cost digits live in `CardNumbers/`.
- Normalize by the visible alpha bounds, using alpha greater than 8 as the
  subject boundary.
- Preserve group-specific anchor points so Figma layers can be swapped without
  per-color x/y correction.
- `TopCloths/` are already standardized and must stay unchanged.

## Group Geometry

| Group | Canvas | Visible subject target | Placement in canvas | Anchor |
| --- | --- | --- | --- | --- |
| `TopCloths/` | `1100x310` | `1086px` wide, variable height | `x=7`, `top=10` | Top band left edge at `x=7` |
| `PointRibbons/` long | `270x572` | `238x540` | `x=16`, `y=16` | Top-center of visible ribbon |
| `PointRibbons/` medium | `270x452` | `238x420` | `x=16`, `y=16` | Top-center of visible ribbon |
| `PointRibbons/` short | `270x332` | `238x300` | `x=16`, `y=16` | Top-center of visible ribbon |
| `BonusGemBadges/` | `320x320` | `276x276` | `x=22`, `y=22` | Center point `160,160` |
| `BonusGemBadges/` Joker | `320x320` | `276x276` integrated full badge | `x=22`, `y=22` | Center point `160,160` |
| `CostTokens/` | `320x320` | True circular token, about `260-267px` | Centered around `160,160` | Core circle center |
| `CardNumbers/` | `256x256` | `220px` high, variable width | Centered at `128,128` | Number visual center |
| `CrownBadges/` | Native by count: 1 crown `1254x1254`, 2 crowns `1700x1254`, 3 crowns `1700x1550` | Native high-resolution badge, variable by crown count | Preserve source scale, black matte keyed to alpha | Top-center of count-specific render box |
| `AbilityMedallions/` | `428x458` | `396x425` | `x=16`, `y=16` | Medallion center |

## Notes

- `BonusGemBadges/` use the new `320x320` canvas even though their source
  files were smaller. This gives every color the same center anchor and enough
  perimeter breathing room.
- `bonus-gem-badge-back-joker.png` is a complete integrated Joker badge with
  its own gold rim and gem cluster. The renderer places it as the badge asset
  and must not add a separate gold badge back, gem fill, or inner symbol on top
  of it.
- `PointRibbons/`, `BonusGemBadges/`, `CostTokens/`, and `AbilityMedallions/`
  may receive minor non-uniform scaling during normalization when source aspect
  ratios differ by color. The visual priority is consistent Figma placement and
  equal perceived size across variants.
- `PointRibbons/` use three independently generated heights, not crops of the
  long asset: long `point-ribbon-{color}.png` for score plus two ability
  medallions, medium `point-ribbon-{color}-medium.png` for score plus one
  ability medallion, and short `point-ribbon-{color}-short.png` for score only.
- `CostTokens/` are direct crops from `CostTokens/cost-token.png` into square
  transparent canvases. The source token pixels are not downscaled during
  extraction, preserving the gold rim clarity. They are single round tokens
  with a thin gold outer rim and subtle internal patterning. They must not
  include a right-side gem mount, secondary small circle, numbers, icons, or
  text. The `pearl` variant is pearl pink, not beige, cream, ivory, tan, or
  sand.
- `CrownBadges/` contains separate 1, 2, and 3 crown gold variants. The 2 and 3
  crown files do not share the single-crown canvas size and should stay on their
  native transparent canvases after black matte removal. Do not downsample the
  source files; the Python renderer uses count-specific top-center display boxes:
  1 crown `x=421 y=26 w=244 h=244`, 2 crowns `x=373 y=10 w=340 h=244`, and
  3 crowns `x=373 y=0 w=340 h=310`.
- `CardNumbers/` are extracted from `assets/card/overlays/CardNumbers/Number.png`, a 5-by-2 digit sheet with
  digits `0-4` on the first row and `5-9` on the second row. The green key is
  removed into transparency; the source sheet remains unchanged. Every final
  digit PNG uses the same transparent `256x256` canvas so Figma can swap digits
  without text rendering or per-digit placement changes. Use the same source
  for cost values and upper-left score values; score values should be displayed
  larger than cost values.
