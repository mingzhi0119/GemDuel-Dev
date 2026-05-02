# Surface Asset Autonomous Legendary Styles Prompt Manifest - 2026-04-27

## Scope

This is the sixth independent Image Gen candidate-library pass for GemDuel surface
art. It follows `docs/art/long-autonomous-surface-asset-generation-codex-prompt-2026-04-27.md`
and `C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md`.

This pass is candidate generation only. Do not replace runtime assets under
`apps/desktop/public/assets/surfaces`, do not edit renderer code, and do not
change card sizing constants.

## Repo Constraints Captured Before Generation

- Shell background is the single full-board table surface, target `3840x2160`.
- TopBar skin target is `3840x360`; keep readable zones near 25%, 50%, and 75%
  width for React-rendered score, crown, and turn UI.
- PlayerZone skin target is `3840x520`; artwork anchors left for P1 and right for
  P2. No baked card frames, card slots, deck silhouettes, controls, labels, or
  numbers.
- Gem panel target is `1254x1254`; the required visual grid lines are
  `x=100,305,515,726,938,1141` and `y=104,308,512,717,917,1132`.
- Market and Royal card backs use the `FEATURED_CARD_SAMPLE_SIZE` canvas,
  `1086x1448`, and downsample into the shared `FEATURED_CARD_SIZE` `150x200`
  runtime box.
- React renders all labels, counts, levels, gems, buttons, hover rings,
  selection states, score badges, card text, and gameplay affordances.
- Global avoid list: no text, no numbers, no Chinese, no English, no Roman
  numerals, no logo, no watermark, no fake alphabet, no readable script, no fake
  glyph writing, no UI labels.

## Output Paths

- Prompt manifest: `docs/art/surface-asset-autonomous-legendary-styles-prompts-2026-04-27.md`
- Scoring report: `docs/art/surface-asset-autonomous-legendary-styles-library-2026-04-27.md`
- Archive root: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/`

## Style Groups

| Style              | Slug                 | Direction                                                                                                   |
| ------------------ | -------------------- | ----------------------------------------------------------------------------------------------------------- |
| Lapis Sunburst     | `lapis-sunburst`     | Deep lapis lazuli, brushed brass, warm sunburst inlay, restrained premium tabletop luxury.                  |
| Volcanic Rose Gold | `volcanic-rose-gold` | Black basalt, smoky obsidian, rose-gold inlay, controlled ember glow, high contrast without noisy centers.  |
| Opal Rain          | `opal-rain`          | Rain-polished gunmetal, opal iridescence, cool teal and pale magenta highlights, glassy but not washed out. |
| Bamboo Ink         | `bamboo-ink`         | Dark lacquered bamboo, jade resin, matte black ink-flow abstraction, organic calm with precise UI geometry. |

## Prompt Catalog

### LS-SHELL-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/shell-background/lapis-sunburst/shell-background-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Lapis Sunburst, deep lapis lazuli stone, brushed brass rails, warm sunburst inlay at the far edges, premium board-game tabletop, subtle walnut undertone. Variant A: confident symmetrical table surface with calm low-noise center and richer atmosphere only at corners and outer borders. Constraints: React renders every label, count, gem, button, hover ring, level, score, and UI affordance. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyph writing, separate playmat, tablecloth slot, busy center, harsh glare, baked UI.
```

### LS-SHELL-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/shell-background/lapis-sunburst/shell-background-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Lapis Sunburst, deep blue lapis stone, satin brass edge channels, subtle gold light rays embedded as non-text material seams, premium tabletop. Variant B: quieter alternate composition with broader matte center, stronger lapis texture toward the perimeter, and thin brass corner ornaments. Constraints: React renders every label, count, gem, button, hover ring, level, score, and UI affordance. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyph writing, separate playmat, tablecloth slot, busy center, harsh glare, baked UI.
```

### LS-TOPBAR-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/topbar/lapis-sunburst/topbar-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG panoramic header strip. Style: Lapis Sunburst, deep lapis base with brushed brass trim and warm sunburst inlay only near ends and thin borders. Variant A: elegant symmetrical header, quiet readable overlay zones around 25%, 50%, and 75% width, decoration pushed to edges and corners. Constraints: React renders scores, crowns, turn state, labels, icons, counts, and all UI text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyph writing, central emblem blocking UI, high glare, dense patterns in the three readable zones.
```

### LS-TOPBAR-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/topbar/lapis-sunburst/topbar-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG panoramic header strip. Style: Lapis Sunburst, lapis lazuli slab, hairline brass rails, small sunlit jewel facets near the far left and far right only. Variant B: alternate low-profile trim with especially calm mid-strip and readable zones at 25%, 50%, and 75% width. Constraints: React renders scores, crowns, turn state, labels, icons, counts, and all UI text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyph writing, central emblem blocking UI, high glare, dense patterns in the three readable zones.
```

### LS-PLAYER-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/player-zone/lapis-sunburst/player-zone-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG ultra-wide player rail that works anchored left for P1 or right for P2. Style: Lapis Sunburst, deep lapis tabletop, brushed brass side trim, restrained warm sunburst material highlights at outer corners. Variant A: quiet central bands for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings, with ornament only at extreme edges and thin borders. Constraints: React renders all cards, slots, counters, labels, buttons, badges, rings, gems, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyphs, card frames, card slots, deck silhouettes, controls, labels, rectangles, busy center.
```

### LS-PLAYER-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/player-zone/lapis-sunburst/player-zone-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG ultra-wide player rail that works anchored left for P1 or right for P2. Style: Lapis Sunburst, matte lapis surface, thin brass separators, soft blue-gold rim light. Variant B: broader calm center, asymmetric but mirror-safe edge ornaments, no implied card positions. Constraints: React renders all cards, slots, counters, labels, buttons, badges, rings, gems, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyphs, card frames, card slots, deck silhouettes, controls, labels, rectangles, busy center.
```

### LS-GEM-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/gem-panel/lapis-sunburst/gem-panel-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG, front-facing orthographic square. Style: Lapis Sunburst, lapis lazuli board, brushed brass grid grooves, warm edge light, premium tabletop. Variant A: clear 5x5 empty wells with compact frame. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Cells must be empty and readable. Constraints: React renders all gems, highlights, labels, counts, buttons, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyph writing, baked gem tokens, click markers, symbols inside cells, oversized frame, perspective skew.
```

### LS-GEM-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/gem-panel/lapis-sunburst/gem-panel-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG, front-facing orthographic square. Style: Lapis Sunburst, darker lapis wells, satin brass separators, subtle sunburst highlights only on the outer frame. Variant B: lower-noise playable grid and stronger empty-cell readability. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Constraints: React renders all gems, highlights, labels, counts, buttons, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyph writing, baked gem tokens, click markers, symbols inside cells, oversized frame, perspective skew.
```

### LS-L1-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l1/lapis-sunburst/market-card-back-l1-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Lapis Sunburst, same family as L2 and L3, deep lapis field with simple brushed brass border. Variant A: visibly lowest tier through restrained trim, few jewel facets, quiet center, no labels. Constraints: React renders level, count, labels, hover, and UI text later; this is only the card-back art. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### LS-L1-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l1/lapis-sunburst/market-card-back-l1-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Lapis Sunburst, same family as L2 and L3, matte lapis panel, minimal brass rim, faint sunlit material seams. Variant B: alternate lowest-tier composition, simple and readable at 150x200 runtime size. Constraints: React renders level, count, labels, hover, and UI text later; this is only the card-back art. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### LS-L2-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l2/lapis-sunburst/market-card-back-l2-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Lapis Sunburst, same silhouette as L1 and L3, lapis stone, brushed brass, warm jewel inlays. Variant A: visibly mid tier by adding richer border layers and moderate sunburst accents while keeping center readable. Constraints: React renders level, count, labels, hover, and UI text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### LS-L2-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l2/lapis-sunburst/market-card-back-l2-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Lapis Sunburst, shared L1/L2/L3 frame language, lapis core, warm brass inner rails, controlled blue-gold glow. Variant B: alternate mid-tier design, more ornament than L1 but clearly less luxurious than L3. Constraints: React renders level, count, labels, hover, and UI text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### LS-L3-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l3/lapis-sunburst/market-card-back-l3-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Lapis Sunburst, same set as L1 and L2, deep lapis, luminous brass, high-prestige jewel facets. Variant A: most luxurious market tier through layered trim, richer inlay density, controlled indigo and gold glow, still no readable symbols. Constraints: React renders level, count, labels, hover, and UI text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### LS-L3-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l3/lapis-sunburst/market-card-back-l3-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Lapis Sunburst, shared vertical silhouette with L1 and L2, ornate brass frame, lapis sunburst center, polished jewel accents. Variant B: alternate highest-tier card back, elegant and high contrast at 150x200 runtime size. Constraints: React renders level, count, labels, hover, and UI text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### LS-ROYAL-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/royal-card-back/lapis-sunburst/royal-card-back-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG vertical prestige card back. Style: Lapis Sunburst, sovereign lapis stone, brushed gold crown-like geometry as abstract material only, radiant edge inlay, deeper royal identity than market backs. Variant A: strong prestige frame with readable blank center and no baked UI. Constraints: React renders all royal labels, counts, hover states, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, literal labels, level marks, card face details.
```

### LS-ROYAL-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/royal-card-back/lapis-sunburst/royal-card-back-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG vertical prestige card back. Style: Lapis Sunburst, lapis royal tablet, ornate brass court frame, warm sunlit jewel mantle, more ceremonial than market L3. Variant B: alternate sovereign composition, calm center and pronounced premium border. Constraints: React renders all royal labels, counts, hover states, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, literal labels, level marks, card face details.
```

### VRG-SHELL-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/shell-background/volcanic-rose-gold/shell-background-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Volcanic Rose Gold, black basalt slab, smoky obsidian polish, rose-gold inlay, controlled ember glow at the perimeter. Variant A: dramatic but readable table surface with calm center and stronger volcanic atmosphere only near corners and outer borders. Constraints: React renders every label, count, gem, button, hover ring, level, score, and UI affordance. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake scripts, fake glyphs, separate playmat, tablecloth slot, busy center, white-hot glare, baked UI.
```

### VRG-SHELL-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/shell-background/volcanic-rose-gold/shell-background-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Volcanic Rose Gold, charcoal basalt, rose-gold seams, faint ember beneath polished stone, smoky vignette. Variant B: quieter alternate with extra matte center, thin rose-metal edge channels, and no implied UI panels. Constraints: React renders every label, count, gem, button, hover ring, level, score, and UI affordance. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake scripts, fake glyphs, separate playmat, tablecloth slot, busy center, white-hot glare, baked UI.
```

### VRG-TOPBAR-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/topbar/volcanic-rose-gold/topbar-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG panoramic header strip. Style: Volcanic Rose Gold, matte black basalt strip, rose-gold trim, restrained ember glow near edge fillets. Variant A: high-contrast header with quiet readable overlay zones around 25%, 50%, and 75% width, decoration only at ends and thin borders. Constraints: React renders scores, crowns, turn state, labels, icons, counts, and all UI text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake scripts, fake glyph writing, central emblem, hot glare, dense center patterns.
```

### VRG-TOPBAR-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/topbar/volcanic-rose-gold/topbar-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG panoramic header strip. Style: Volcanic Rose Gold, smoky obsidian panel, subtle rose-metal rails, ember dots as material reflections only at far edges. Variant B: calmer alternate header with clear readable zones at 25%, 50%, and 75% width. Constraints: React renders scores, crowns, turn state, labels, icons, counts, and all UI text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake scripts, fake glyph writing, central emblem, hot glare, dense center patterns.
```

### VRG-PLAYER-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/player-zone/volcanic-rose-gold/player-zone-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG ultra-wide player rail that works anchored left for P1 or right for P2. Style: Volcanic Rose Gold, polished basalt rail, rose-gold rim, subdued ember at outer corners. Variant A: quiet central bands for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings, no implied slots. Constraints: React renders all cards, slots, counters, labels, buttons, badges, rings, gems, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyphs, card frames, card slots, deck silhouettes, controls, labels, rectangles, busy center.
```

### VRG-PLAYER-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/player-zone/volcanic-rose-gold/player-zone-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG ultra-wide player rail that works anchored left for P1 or right for P2. Style: Volcanic Rose Gold, smoky stone, rose-metal edge fillets, low ember glow, premium dark tabletop. Variant B: alternate broad quiet center and soft edge ornaments only, mirror-safe for both players. Constraints: React renders all cards, slots, counters, labels, buttons, badges, rings, gems, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyphs, card frames, card slots, deck silhouettes, controls, labels, rectangles, busy center.
```

### VRG-GEM-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/gem-panel/volcanic-rose-gold/gem-panel-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG, front-facing orthographic square. Style: Volcanic Rose Gold, black basalt board, rose-gold divider grooves, faint ember rim light. Variant A: clear 5x5 empty wells with compact frame. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Cells must be empty and readable. Constraints: React renders all gems, highlights, labels, counts, buttons, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyph writing, baked gem tokens, click markers, symbols inside cells, oversized frame, perspective skew.
```

### VRG-GEM-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/gem-panel/volcanic-rose-gold/gem-panel-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG, front-facing orthographic square. Style: Volcanic Rose Gold, smoky obsidian wells, rose-gold separators, very controlled ember glow outside the playfield. Variant B: lower-noise playable grid and stronger empty-cell readability. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Constraints: React renders all gems, highlights, labels, counts, buttons, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyph writing, baked gem tokens, click markers, symbols inside cells, oversized frame, perspective skew.
```

### VRG-L1-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l1/volcanic-rose-gold/market-card-back-l1-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Volcanic Rose Gold, same family as L2 and L3, black basalt field with simple rose-gold border. Variant A: visibly lowest tier through restrained trim, low jewel density, quiet center. Constraints: React renders level, count, labels, hover, and UI text later; this is only the card-back art. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### VRG-L1-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l1/volcanic-rose-gold/market-card-back-l1-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Volcanic Rose Gold, matte basalt card back, thin rose-metal rim, faint smoky texture. Variant B: alternate lowest-tier composition, simple and readable at 150x200 runtime size. Constraints: React renders level, count, labels, hover, and UI text later; this is only the card-back art. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### VRG-L2-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l2/volcanic-rose-gold/market-card-back-l2-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Volcanic Rose Gold, same silhouette as L1 and L3, basalt core, rose-metal layered border, controlled ember inlay. Variant A: visibly mid tier with more trim than L1 and less luxury than L3. Constraints: React renders level, count, labels, hover, and UI text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### VRG-L2-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l2/volcanic-rose-gold/market-card-back-l2-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Volcanic Rose Gold, shared L1/L2/L3 frame language, black stone center, rose-gold rails, soft ember accents. Variant B: alternate mid-tier design with moderate ornament and clean downsample readability. Constraints: React renders level, count, labels, hover, and UI text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### VRG-L3-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l3/volcanic-rose-gold/market-card-back-l3-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Volcanic Rose Gold, same set as L1 and L2, black obsidian, rose-gold inlay, controlled ruby ember facets. Variant A: most luxurious market tier through layered trim, richer jewel density, strong premium contrast, still no readable symbols. Constraints: React renders level, count, labels, hover, and UI text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### VRG-L3-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l3/volcanic-rose-gold/market-card-back-l3-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Volcanic Rose Gold, shared vertical silhouette with L1 and L2, ornate rose-metal frame, obsidian center, ember jewel accents. Variant B: alternate highest-tier card back, high prestige while readable at 150x200 runtime size. Constraints: React renders level, count, labels, hover, and UI text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### VRG-ROYAL-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/royal-card-back/volcanic-rose-gold/royal-card-back-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG vertical prestige card back. Style: Volcanic Rose Gold, sovereign obsidian slab, rose-gold crown-like abstract material geometry, restrained ember halo, stronger royal identity than market backs. Variant A: ceremonial frame with readable blank center and no baked UI. Constraints: React renders all royal labels, counts, hover states, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake glyphs, literal labels, level marks, card face details.
```

### VRG-ROYAL-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/royal-card-back/volcanic-rose-gold/royal-card-back-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG vertical prestige card back. Style: Volcanic Rose Gold, black basalt royal tablet, rose-metal court frame, deep ember jewels, more ceremonial than market L3. Variant B: alternate sovereign composition with calm center and pronounced premium border. Constraints: React renders all royal labels, counts, hover states, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake glyphs, literal labels, level marks, card face details.
```

### OR-SHELL-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/shell-background/opal-rain/shell-background-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Opal Rain, rain-polished gunmetal, opal iridescence, cool teal and pale magenta highlights, glassy wet-stone material without white wash. Variant A: refined rainy tabletop with calm low-noise center and richer atmosphere only at corners and outer borders. Constraints: React renders every label, count, gem, button, hover ring, level, score, and UI affordance. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyph writing, separate playmat, tablecloth slot, busy center, overbright glare, baked UI.
```

### OR-SHELL-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/shell-background/opal-rain/shell-background-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Opal Rain, dark gunmetal table, subtle rain-sheen, opal edge refractions, soft teal-pink material glints. Variant B: quieter alternate with matte center, rim highlights, and no implied UI panels. Constraints: React renders every label, count, gem, button, hover ring, level, score, and UI affordance. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyph writing, separate playmat, tablecloth slot, busy center, overbright glare, baked UI.
```

### OR-TOPBAR-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/topbar/opal-rain/topbar-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG panoramic header strip. Style: Opal Rain, rain-polished gunmetal strip, opal rim highlights, cool teal and pale magenta glass accents near ends only. Variant A: readable header with quiet overlay zones around 25%, 50%, and 75% width, decoration at edges and thin borders. Constraints: React renders scores, crowns, turn state, labels, icons, counts, and all UI text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, central emblem, high glare, dense center patterns.
```

### OR-TOPBAR-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/topbar/opal-rain/topbar-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG panoramic header strip. Style: Opal Rain, smoky gunmetal panel, thin opal glass rails, tiny rain-sheen reflections at the far left and far right. Variant B: calmer alternate header with very clear readable zones at 25%, 50%, and 75% width. Constraints: React renders scores, crowns, turn state, labels, icons, counts, and all UI text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, central emblem, high glare, dense center patterns.
```

### OR-PLAYER-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/player-zone/opal-rain/player-zone-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG ultra-wide player rail that works anchored left for P1 or right for P2. Style: Opal Rain, gunmetal rail, opal wet-stone edge, controlled teal and pale magenta iridescence. Variant A: quiet central bands for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings, with decoration only at extreme edges and thin borders. Constraints: React renders all cards, slots, counters, labels, buttons, badges, rings, gems, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyphs, card frames, card slots, deck silhouettes, controls, labels, rectangles, busy center.
```

### OR-PLAYER-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/player-zone/opal-rain/player-zone-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG ultra-wide player rail that works anchored left for P1 or right for P2. Style: Opal Rain, matte rain-dark metal, subtle opal corner inlays, faint wet reflections. Variant B: alternate broad quiet center, edge-only ornament, mirror-safe for both players. Constraints: React renders all cards, slots, counters, labels, buttons, badges, rings, gems, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyphs, card frames, card slots, deck silhouettes, controls, labels, rectangles, busy center.
```

### OR-GEM-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/gem-panel/opal-rain/gem-panel-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG, front-facing orthographic square. Style: Opal Rain, rain-polished gunmetal board, opal divider grooves, muted teal and pale magenta edge light. Variant A: clear 5x5 empty wells with compact frame. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Cells must be empty and readable. Constraints: React renders all gems, highlights, labels, counts, buttons, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyph writing, baked gem tokens, click markers, symbols inside cells, oversized frame, perspective skew.
```

### OR-GEM-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/gem-panel/opal-rain/gem-panel-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG, front-facing orthographic square. Style: Opal Rain, darker gunmetal wells, pearly opal separators, soft wet-stone rim glow outside the playfield. Variant B: lower-noise playable grid and stronger empty-cell readability. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Constraints: React renders all gems, highlights, labels, counts, buttons, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyph writing, baked gem tokens, click markers, symbols inside cells, oversized frame, perspective skew.
```

### OR-L1-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l1/opal-rain/market-card-back-l1-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Opal Rain, same family as L2 and L3, dark gunmetal field with simple opal edge. Variant A: visibly lowest tier through restrained trim, few iridescent facets, quiet center. Constraints: React renders level, count, labels, hover, and UI text later; this is only the card-back art. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### OR-L1-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l1/opal-rain/market-card-back-l1-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Opal Rain, matte rain-dark card, thin glassy opal rim, faint wet-metal texture. Variant B: alternate lowest-tier composition, simple and readable at 150x200 runtime size. Constraints: React renders level, count, labels, hover, and UI text later; this is only the card-back art. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### OR-L2-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l2/opal-rain/market-card-back-l2-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Opal Rain, same silhouette as L1 and L3, gunmetal core, layered opal glass border, cool teal and pale magenta reflections. Variant A: visibly mid tier with more trim than L1 and less luxury than L3. Constraints: React renders level, count, labels, hover, and UI text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### OR-L2-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l2/opal-rain/market-card-back-l2-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Opal Rain, shared L1/L2/L3 frame language, rain-polished metal center, opal rails, soft iridescent accents. Variant B: alternate mid-tier design with moderate ornament and clean downsample readability. Constraints: React renders level, count, labels, hover, and UI text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### OR-L3-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l3/opal-rain/market-card-back-l3-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Opal Rain, same set as L1 and L2, dark gunmetal, luminous opal inlay, rich teal-magenta glass facets. Variant A: most luxurious market tier through layered trim, richer jewel density, controlled glow, still no readable symbols. Constraints: React renders level, count, labels, hover, and UI text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### OR-L3-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l3/opal-rain/market-card-back-l3-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Opal Rain, shared vertical silhouette with L1 and L2, ornate opal glass frame, rain-dark metal center, polished jewel accents. Variant B: alternate highest-tier card back, elegant and high contrast at 150x200 runtime size. Constraints: React renders level, count, labels, hover, and UI text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### OR-ROYAL-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/royal-card-back/opal-rain/royal-card-back-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG vertical prestige card back. Style: Opal Rain, sovereign gunmetal tablet, opal crown-like abstract material geometry, rain-glass halo, deeper royal identity than market backs. Variant A: strong prestige frame with readable blank center and no baked UI. Constraints: React renders all royal labels, counts, hover states, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, literal labels, level marks, card face details.
```

### OR-ROYAL-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/royal-card-back/opal-rain/royal-card-back-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG vertical prestige card back. Style: Opal Rain, rain-dark royal tablet, ornate opal court frame, luminous teal-pink jewel mantle, more ceremonial than market L3. Variant B: alternate sovereign composition with calm center and pronounced premium border. Constraints: React renders all royal labels, counts, hover states, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyphs, literal labels, level marks, card face details.
```

### BI-SHELL-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/shell-background/bamboo-ink/shell-background-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Bamboo Ink, dark lacquered bamboo, jade resin seams, matte black ink-flow abstraction as material texture only, precise premium tabletop. Variant A: organic but controlled board surface with calm low-noise center and richer atmosphere only at corners and outer borders. Constraints: React renders every label, count, gem, button, hover ring, level, score, and UI affordance. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, calligraphy, readable scripts, fake glyph writing, separate playmat, tablecloth slot, busy center, baked UI.
```

### BI-SHELL-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/shell-background/bamboo-ink/shell-background-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Bamboo Ink, lacquered charcoal bamboo, jade edge resin, subtle non-writing ink-flow grain, quiet tabletop. Variant B: quieter alternate with broader matte center, stronger bamboo material along the perimeter, and no implied UI panels. Constraints: React renders every label, count, gem, button, hover ring, level, score, and UI affordance. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, calligraphy, readable scripts, fake glyph writing, separate playmat, tablecloth slot, busy center, baked UI.
```

### BI-TOPBAR-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/topbar/bamboo-ink/topbar-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG panoramic header strip. Style: Bamboo Ink, dark lacquered bamboo strip, jade resin edge accents, non-writing ink-flow material texture near ends only. Variant A: elegant calm header with readable overlay zones around 25%, 50%, and 75% width, decoration pushed to edges and thin borders. Constraints: React renders scores, crowns, turn state, labels, icons, counts, and all UI text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, calligraphy, readable scripts, fake glyph writing, central emblem, dense center patterns.
```

### BI-TOPBAR-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/topbar/bamboo-ink/topbar-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG panoramic header strip. Style: Bamboo Ink, matte black bamboo panel, jade rail highlights, subtle ink-wash grain that is not writing. Variant B: calmer alternate header with especially clear readable zones at 25%, 50%, and 75% width. Constraints: React renders scores, crowns, turn state, labels, icons, counts, and all UI text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, calligraphy, readable scripts, fake glyph writing, central emblem, dense center patterns.
```

### BI-PLAYER-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/player-zone/bamboo-ink/player-zone-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG ultra-wide player rail that works anchored left for P1 or right for P2. Style: Bamboo Ink, dark lacquered bamboo rail, jade resin trim, calm non-writing ink-flow edge texture. Variant A: quiet central bands for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings, with ornament only at extreme edges and thin borders. Constraints: React renders all cards, slots, counters, labels, buttons, badges, rings, gems, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, calligraphy, fake glyphs, card frames, card slots, deck silhouettes, controls, labels, rectangles, busy center.
```

### BI-PLAYER-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/player-zone/bamboo-ink/player-zone-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG ultra-wide player rail that works anchored left for P1 or right for P2. Style: Bamboo Ink, matte lacquered bamboo, jade edge resin, subdued black ink material flow outside the center. Variant B: alternate broad quiet center, edge-only ornament, mirror-safe for both players. Constraints: React renders all cards, slots, counters, labels, buttons, badges, rings, gems, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, calligraphy, fake glyphs, card frames, card slots, deck silhouettes, controls, labels, rectangles, busy center.
```

### BI-GEM-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/gem-panel/bamboo-ink/gem-panel-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG, front-facing orthographic square. Style: Bamboo Ink, dark lacquered bamboo board, jade resin divider grooves, subtle black ink-flow texture only in outer frame. Variant A: clear 5x5 empty wells with compact frame. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Cells must be empty and readable. Constraints: React renders all gems, highlights, labels, counts, buttons, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, calligraphy, fake glyph writing, baked gem tokens, click markers, symbols inside cells, oversized frame, perspective skew.
```

### BI-GEM-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/gem-panel/bamboo-ink/gem-panel-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG, front-facing orthographic square. Style: Bamboo Ink, darker bamboo wells, jade separators, calm lacquered surface, ink-flow material only outside playfield. Variant B: lower-noise playable grid and stronger empty-cell readability. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Constraints: React renders all gems, highlights, labels, counts, buttons, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, calligraphy, fake glyph writing, baked gem tokens, click markers, symbols inside cells, oversized frame, perspective skew.
```

### BI-L1-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l1/bamboo-ink/market-card-back-l1-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Bamboo Ink, same family as L2 and L3, dark lacquered bamboo field with simple jade rim. Variant A: visibly lowest tier through restrained trim, few resin facets, quiet center. Constraints: React renders level, count, labels, hover, and UI text later; this is only the card-back art. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, calligraphy, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### BI-L1-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l1/bamboo-ink/market-card-back-l1-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Bamboo Ink, matte bamboo card back, thin jade resin rim, faint non-writing ink-flow texture. Variant B: alternate lowest-tier composition, simple and readable at 150x200 runtime size. Constraints: React renders level, count, labels, hover, and UI text later; this is only the card-back art. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, calligraphy, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### BI-L2-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l2/bamboo-ink/market-card-back-l2-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Bamboo Ink, same silhouette as L1 and L3, lacquered bamboo core, layered jade border, restrained ink-flow material texture. Variant A: visibly mid tier with more trim than L1 and less luxury than L3. Constraints: React renders level, count, labels, hover, and UI text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, calligraphy, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### BI-L2-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l2/bamboo-ink/market-card-back-l2-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Bamboo Ink, shared L1/L2/L3 frame language, dark bamboo center, jade rails, soft lacquer highlights. Variant B: alternate mid-tier design with moderate ornament and clean downsample readability. Constraints: React renders level, count, labels, hover, and UI text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, calligraphy, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### BI-L3-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l3/bamboo-ink/market-card-back-l3-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Bamboo Ink, same set as L1 and L2, lacquered bamboo, luminous jade inlay, rich resin facets. Variant A: most luxurious market tier through layered trim, richer material density, controlled glow, still no readable symbols. Constraints: React renders level, count, labels, hover, and UI text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, calligraphy, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### BI-L3-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/market-card-back-l3/bamboo-ink/market-card-back-l3-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Bamboo Ink, shared vertical silhouette with L1 and L2, ornate jade resin frame, dark lacquer center, polished bamboo grain. Variant B: alternate highest-tier card back, elegant and high contrast at 150x200 runtime size. Constraints: React renders level, count, labels, hover, and UI text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, calligraphy, readable scripts, fake glyphs, baked UI, level marks, badges, card face details.
```

### BI-ROYAL-A

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/royal-card-back/bamboo-ink/royal-card-back-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG vertical prestige card back. Style: Bamboo Ink, sovereign lacquered bamboo tablet, jade crown-like abstract material geometry, black ink-flow texture that is not writing, deeper royal identity than market backs. Variant A: strong prestige frame with readable blank center and no baked UI. Constraints: React renders all royal labels, counts, hover states, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, calligraphy, readable scripts, fake glyphs, literal labels, level marks, card face details.
```

### BI-ROYAL-B

Archive filename: `assets/art-library/surface-autonomous-legendary-styles-candidates/2026-04-27/royal-card-back/bamboo-ink/royal-card-back-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG vertical prestige card back. Style: Bamboo Ink, dark bamboo royal tablet, ornate jade court frame, calm lacquered center, more ceremonial than market L3. Variant B: alternate sovereign composition with quiet center and pronounced premium border. Constraints: React renders all royal labels, counts, hover states, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, calligraphy, readable scripts, fake glyphs, literal labels, level marks, card face details.
```
