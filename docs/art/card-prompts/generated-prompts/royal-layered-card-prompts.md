# Royal Layered Card Prompts

These prompts target modular card construction inspired by the original card anatomy: base card face, upper cloth, point ribbon, crown badge, bonus gem badge, cost token, and ability medallion. Numbers and labels remain separate overlay assets, not baked into the artwork.

## Output Map

Base cards:

- `assets/card/generated/royal-layered/from-pic/base/royal-trophy-3pts-base.png`
- `assets/card/generated/royal-layered/from-pic/base/royal-scepter-2pts-extra-turn-base.png`
- `assets/card/generated/royal-layered/from-pic/base/royal-scroll-2pts-privilege-base.png`
- `assets/card/generated/royal-layered/from-pic/base/royal-saber-2pts-steal-base.png`

Shared overlay assets:

- `assets/card/overlays/TopCloths/top-cloth-{color}.png`
- `assets/card/overlays/PointRibbons/point-ribbon-{color}.png`
- `assets/card/overlays/PointRibbons/point-ribbon-{color}-medium.png`
- `assets/card/overlays/PointRibbons/point-ribbon-{color}-short.png`
- `assets/card/overlays/BonusGemBadges/bonus-gem-badge-back-{color}.png`
- `assets/card/overlays/CostTokens/cost-token-back-{color}.png`
- `assets/card/overlays/CrownBadges/crown-badge-gold-one-crown.png`
- `assets/card/overlays/CrownBadges/crown-badge-gold-two-crowns.png`
- `assets/card/overlays/CrownBadges/crown-badge-gold-three-crowns.png`
- `assets/card/overlays/AbilityMedallions/ability-extra-turn-medallion.png`
- `assets/card/overlays/AbilityMedallions/ability-privilege-medallion.png`
- `assets/card/overlays/AbilityMedallions/ability-steal-medallion.png`
- `assets/card/overlays/AbilityMedallions/ability-bonus-gem-medallion.png`

Color variants: `red`, `blue`, `green`, `black`, `white`, `pearl`, `gold`.

## Shared Base Prompt

Create bottom-layer fantasy card-face artwork in a strict vertical 3:4 aspect ratio, 1086x1448. This is only the base art layer for a modular card, not the final UI. Show `{subject}` as the main royal focal scene in the middle and lower-middle area. Leave the top 20% visually calm for a later colored cloth overlay, leave the upper-left and upper-right corners low-detail for later ribbon and gem badge overlays, and leave the lower-left edge low-detail for later cost tokens. Use elegant royal lighting, palace materials, marble, gold trim, velvet shadows, and polished gem reflections. Do not include numbers, text, icons, cost circles, point ribbons, crowns in UI positions, bonus gem badges, top cloth panels, or watermarks.

## Base Subjects

- `royal-trophy-3pts-base`: a magnificent gold, pearl, and crystal royal trophy on a marble dais, sovereign victory mood, no ability symbolism.
- `royal-scepter-2pts-extra-turn-base`: a jeweled royal scepter above a clockwork ceremonial dais with subtle looping golden energy suggesting an extra turn.
- `royal-scroll-2pts-privilege-base`: a sealed royal decree scroll on a gilded lectern in a palace archive, authority and privilege mood, no readable writing.
- `royal-saber-2pts-steal-base`: a jeweled royal saber in a treasury scene with covert theft tension, precious relic being seized, no gore.

## Shared Overlay Prompt

Create an isolated game-card UI overlay asset on a perfectly flat solid `#00ff00` chroma-key background for background removal. The background must be one uniform color with no shadows, gradients, texture, reflections, or lighting variation. Do not use `#00ff00` anywhere in the asset. No text, no numbers, no watermark.

## Overlay Prompts

- `top-cloth-{color}`: A near-rectangular royal fabric panel for the top band of a vertical card. Final PNG canvas is `1100x310`; the visible subject width is fixed to `1086px` at `x=7`, with top margin `10px`. Preserve the source aspect ratio without vertical stretching. Slightly curved lower edge, brocade texture, soft bevel, subtle gold stitching, `{color}` identity.
- `point-ribbon-{color}`: A long vertical hanging point ribbon for the upper-left of a card, tapered banner bottom, rich fabric, gold trim, blank center area for a white number and two ability medallions, `{color}` identity, readable at small card size.
- `point-ribbon-{color}-medium`: A medium vertical hanging point ribbon for the upper-left of a card, newly composed rather than cropped from the long ribbon, tapered banner bottom, rich fabric, gold trim, blank center area for a white number and one ability medallion, `{color}` identity, readable at small card size.
- `point-ribbon-{color}-short`: A short vertical hanging point ribbon for the upper-left of a card, newly composed rather than cropped from the long ribbon, tapered banner bottom, rich fabric, gold trim, blank center area for a white number only, `{color}` identity, readable at small card size.
- `crown-badge-gold-{one,two,three}-crowns`: A small top-center crown badge: polished gold crown count on a compact ivory-and-gold plaque, royal but not oversized, clean silhouette, suitable for overlaying above a card's top cloth.
- `bonus-gem-badge-back-{color}`: A circular top-right bonus gem badge background with raised rim, colored outer border, softly lit inner backing, `{color}` identity, empty center for placing an existing gem image, premium board-game token style.
- `cost-token-back-{color}`: A single true-circle lower-left cost token background, `{color}` identity, thin polished gold rim, subtle internal floral or damask pattern, blank center for a separate number asset. No right-side small circle, no side badge, no gem mount, no text, no numbers. The `pearl` variant must be luminous pearl pink, not beige, cream, ivory, tan, or sand.
- `ability-extra-turn-medallion`: A small circular ability medallion showing a royal extra-turn symbol: oversized beveled gold looping arrow on a royal purple medallion, no text, no numbers, crisp icon silhouette that remains readable at thumbnail size. Use a solid magenta chroma-key background when regenerating this asset so the gold arrow and purple medallion stay visually separate from the removable background.
- `ability-privilege-medallion`: A small circular ability medallion showing a royal privilege symbol: sealed scroll or decree icon in gold and parchment tones, no readable writing, crisp icon silhouette.
- `ability-steal-medallion`: A small circular ability medallion showing a steal symbol: jeweled saber and subtle shadow-hand motif, royal treasury mood, no gore, no text, crisp icon silhouette.
- `ability-bonus-gem-medallion`: A small circular ability medallion showing a bonus gem symbol: luminous faceted gem cluster with an oversized polished gold plus sign, royal treasury mood, no text, no numbers, crisp icon silhouette. Use a solid magenta chroma-key background when regenerating this asset so the plus sign and gem cluster stay visually separate from the removable background.
