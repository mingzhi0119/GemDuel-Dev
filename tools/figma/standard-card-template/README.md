# GemDuel Standard Card Template Figma Helper

This development plugin creates the current non-Royal standard card template for Figma.
It follows the original-style layered card anatomy and no longer uses card-frame PNGs.

## Run It

1. Open Figma Desktop.
2. Go to `Plugins > Development > Import plugin from manifest...`.
3. Select `tools/figma/standard-card-template/manifest.json`.
4. Run `GemDuel Standard Card Template`.

The plugin creates page `03_Templates` and a root frame named
`template/card/standard-basic`.

## Current Template Rules

- Root card frame is `1086x1448`, matching the generated card art ratio.
- The card shape comes from Figma rounded clipping, not a frame image.
- Do not use `assets/archive/card-frames/L1_Edge.png`, `assets/archive/card-frames/L2_Edge.png`, or runtime whole-card PNGs in this helper.
- Old card-frame resources stay in the repo as archive/reference assets only.
- Overlay PNGs are embedded directly into `code.js` so the plugin can run without reading local files at runtime.

## Embedded Overlay Inventory

- `TopCloths`: 7 color variants
- `PointRibbons`: 7 color variants
- `CostTokens`: 7 color variants
- `BonusGemBadges`: 7 color variants
- `CardFaces`: 1 demo source face (`l2-wh-50`) from `assets/card/faces/source`
- `Gems`: 7 runtime gem PNGs from `apps/desktop/public/assets/gems`
- `CrownBadges`: 3 gold badge variants for 1, 2, and 3 crowns
- `AbilityMedallions`: 3 ability variants
- `CardNumbers`: 10 pre-rendered digit variants from `assets/card/overlays/CardNumbers/Number.png`

## Generated Layer Tree

```text
Page: 03_Templates

template/card/standard-basic
├── layer-01-card-face
│   └── slot/card-face-art
├── layer-02-cloth-and-cost
│   ├── overlay/top-cloth
│   ├── overlay/cost-token-1
│   ├── overlay/cost-token-2
│   ├── overlay/cost-token-3
│   └── overlay/cost-token-4
├── layer-03-badges
│   ├── overlay/point-ribbon
│   ├── overlay/ability-medallion-1-optional
│   ├── overlay/ability-medallion-2-optional
│   ├── overlay/crown-badge
│   ├── overlay/bonus-gem-badge-1
│   └── overlay/bonus-gem-badge-2-optional
├── slots
│   ├── slot/point-value
│   ├── slot/cost-value-1
│   ├── slot/cost-gem-1
│   ├── slot/cost-value-2
│   ├── slot/cost-gem-2
│   ├── slot/cost-value-3
│   ├── slot/cost-gem-3
│   ├── slot/cost-value-4
│   ├── slot/cost-gem-4
│   ├── slot/bonus-gem-1
│   ├── slot/bonus-gem-2
│   ├── slot/ability-1
│   └── slot/ability-2
└── demo/l2-wh-50
```

The demo uses real catalog card `l2-wh-50` as the base layout sample: 2 points,
white bonus, 1 crown, costs red 2, green 2, black 2, and pearl 1, plus a
temporary two-ability display using `again` and `privilege` for visual review.
Cost values and the upper-left
score value use `CardNumbers` image assets, not editable Figma text. Demo gems
use the runtime gem PNGs instead of temporary ellipse placeholders. Cost tokens
are single round ImageGen-derived assets with a thin gold rim and no right-side
mount circle. The score digit is displayed larger than the cost digits, and cost
digits are centered on the token's core circle rather than the full token
canvas. The score value and two optional ability medallion slots are centered
on the point ribbon centerline (`x=140`) and use matching `140x140` circular
slots. The crown badge layer uses a single reserved top-center placement and
selects the embedded 1, 2, or 3 crown high-resolution source by `DEMO_CARD.crowns`.
Positioning is intentionally a first-pass Figma layout for manual adjustment.
