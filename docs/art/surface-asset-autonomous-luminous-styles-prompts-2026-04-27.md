# Surface Asset Autonomous Luminous Styles Prompt Manifest - 2026-04-27

## Scope

This is the eighth independent Image Gen candidate-library pass for GemDuel surface art. It follows `docs/art/long-autonomous-surface-asset-generation-codex-prompt-2026-04-27.md` and `C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md`.
This pass is candidate generation only. Do not replace runtime assets under `apps/desktop/public/assets/surfaces`, do not edit renderer code, and do not change card sizing constants.

## Repo Constraints Captured Before Generation

- Shell background is the single full-board table surface, target `3840x2160`.
- TopBar skin target is `3840x360`; keep readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI.
- PlayerZone skin target is `3840x520`; artwork anchors left for P1 and right for P2. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers.
- Gem panel target is `1254x1254`; the required visual grid lines are `x=100,305,515,726,938,1141` and `y=104,308,512,717,917,1132`.
- Market and Royal card backs use the `FEATURED_CARD_SAMPLE_SIZE` canvas, `1086x1448`, and downsample into the shared `FEATURED_CARD_SIZE` `150x200` runtime box.
- React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances.
- Global avoid list: no text, no numbers, no Chinese, no English, no Roman numerals, no logo, no watermark, no fake alphabet, no readable script, no fake glyph writing, no UI labels.

## Output Paths

- Prompt manifest: `docs/art/surface-asset-autonomous-luminous-styles-prompts-2026-04-27.md`
- Scoring report: `docs/art/surface-asset-autonomous-luminous-styles-library-2026-04-27.md`
- Archive root: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/`

## Style Groups

| Style             | Slug                | Direction                                                                                                            |
| ----------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Arctic Rosequartz | `arctic-rosequartz` | Icy silver, pale rose quartz, frosted pink crystal, restrained luminous polish without white wash.                   |
| Thunder Amethyst  | `thunder-amethyst`  | Storm-dark amethyst, graphite stone, electric silver edge light, dramatic but readable fantasy UI material.          |
| Sunken Brass      | `sunken-brass`      | Deep sea patina, aged brass, teal oxidization, dark enamel and submerged treasure materials without maps or writing. |
| Paper Lantern     | `paper-lantern`     | Warm washi texture, lacquered charcoal, soft lantern glow, vermilion and gold accents with no characters or glyphs.  |

## Prompt Catalog

### AR-SHELL-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/arctic-rosequartz/shell-background-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Arctic Rosequartz, icy silver table material, pale rose quartz inlay, frosted pink crystal edges, restrained luminous polish without white wash. Variant A: symmetrical pale-crystal table with calm low-noise center and stronger rosequartz shimmer only at corners and outer borders. Keep the center subdued and low-noise for the gameplay stage; edges may carry stronger atmosphere. No separate playmat or tablecloth slot. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### AR-SHELL-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/arctic-rosequartz/shell-background-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Arctic Rosequartz, icy silver table material, pale rose quartz inlay, frosted pink crystal edges, restrained luminous polish without white wash. Variant B: cooler silver-pink alternate with broad matte center, thin quartz edgework, and subtle frozen-glass atmosphere around the perimeter. Keep the center subdued and low-noise for the gameplay stage; edges may carry stronger atmosphere. No separate playmat or tablecloth slot. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### AR-TOPBAR-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/topbar/arctic-rosequartz/topbar-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG artwork for the panoramic header strip. Style: Arctic Rosequartz, icy silver table material, pale rose quartz inlay, frosted pink crystal edges, restrained luminous polish without white wash. Variant A: frosted silver-pink panoramic strip with quiet readable overlay zones around 25%, 50%, and 75% width, ornament pushed to far ends and thin borders. Keep quiet readable overlay zones around 25%, 50%, and 75% width for React score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### AR-TOPBAR-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/topbar/arctic-rosequartz/topbar-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG artwork for the panoramic header strip. Style: Arctic Rosequartz, icy silver table material, pale rose quartz inlay, frosted pink crystal edges, restrained luminous polish without white wash. Variant B: low-profile ice quartz header with especially calm mid-strip, hairline silver rails, and minimal rose glow near the ends. Keep quiet readable overlay zones around 25%, 50%, and 75% width for React score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### AR-PLAYER-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/player-zone/arctic-rosequartz/player-zone-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG artwork for the ultra-wide player rail that works anchored left for P1 or right for P2. Style: Arctic Rosequartz, icy silver table material, pale rose quartz inlay, frosted pink crystal edges, restrained luminous polish without white wash. Variant A: quiet central bands for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings, with rosequartz shimmer only at extreme edges and thin borders. Keep quiet center bands for overlays; no baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, or numbers. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### AR-PLAYER-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/player-zone/arctic-rosequartz/player-zone-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG artwork for the ultra-wide player rail that works anchored left for P1 or right for P2. Style: Arctic Rosequartz, icy silver table material, pale rose quartz inlay, frosted pink crystal edges, restrained luminous polish without white wash. Variant B: broad calm silver-pink rail, mirror-safe edge ornaments, no implied card positions, and subtle frosted crystal material near outer corners. Keep quiet center bands for overlays; no baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, or numbers. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### AR-GEM-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/gem-panel/arctic-rosequartz/gem-panel-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG artwork for the front-facing orthographic square board. Style: Arctic Rosequartz, icy silver table material, pale rose quartz inlay, frosted pink crystal edges, restrained luminous polish without white wash. Variant A: clear 5x5 empty wells, compact silver frame, pale rosequartz separators, and subdued icy crystal edge light. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Empty readable 5x5 wells only; no baked gems, markers, or symbols inside cells. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### AR-GEM-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/gem-panel/arctic-rosequartz/gem-panel-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG artwork for the front-facing orthographic square board. Style: Arctic Rosequartz, icy silver table material, pale rose quartz inlay, frosted pink crystal edges, restrained luminous polish without white wash. Variant B: lower-noise playable grid, frosted empty cells, stronger silver dividers, and rosequartz material kept outside the playfield. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Empty readable 5x5 wells only; no baked gems, markers, or symbols inside cells. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### AR-L1-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l1/arctic-rosequartz/market-card-back-l1-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Arctic Rosequartz, icy silver table material, pale rose quartz inlay, frosted pink crystal edges, restrained luminous polish without white wash. Variant A: same family as L2 and L3, pale frosted card field with simple silver-rose border; visibly lowest tier through restrained trim and quiet center. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### AR-L1-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l1/arctic-rosequartz/market-card-back-l1-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Arctic Rosequartz, icy silver table material, pale rose quartz inlay, frosted pink crystal edges, restrained luminous polish without white wash. Variant B: matte silver-pink card back, minimal quartz rim, faint frosted material depth; alternate lowest-tier composition readable at 150x200. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### AR-L2-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l2/arctic-rosequartz/market-card-back-l2-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Arctic Rosequartz, icy silver table material, pale rose quartz inlay, frosted pink crystal edges, restrained luminous polish without white wash. Variant A: same silhouette as L1 and L3, layered silver-rose border and controlled quartz glow; visibly mid tier with more trim than L1 and less luxury than L3. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### AR-L2-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l2/arctic-rosequartz/market-card-back-l2-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Arctic Rosequartz, icy silver table material, pale rose quartz inlay, frosted pink crystal edges, restrained luminous polish without white wash. Variant B: shared L1/L2/L3 frame language, frosted center, rosequartz rails, modest crystal accents; alternate mid-tier composition. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### AR-L3-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l3/arctic-rosequartz/market-card-back-l3-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Arctic Rosequartz, icy silver table material, pale rose quartz inlay, frosted pink crystal edges, restrained luminous polish without white wash. Variant A: same set as L1 and L2, ornate silver frame, rosequartz facets, highest market-tier polish with controlled glow and no readable symbols. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### AR-L3-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l3/arctic-rosequartz/market-card-back-l3-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Arctic Rosequartz, icy silver table material, pale rose quartz inlay, frosted pink crystal edges, restrained luminous polish without white wash. Variant B: shared vertical silhouette with L1 and L2, richer icy crystal border, elegant high contrast at 150x200 runtime size. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### AR-ROYAL-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/royal-card-back/arctic-rosequartz/royal-card-back-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG artwork for the vertical prestige card back. Style: Arctic Rosequartz, icy silver table material, pale rose quartz inlay, frosted pink crystal edges, restrained luminous polish without white wash. Variant A: sovereign silver-rose prestige card back, abstract crown-like crystal geometry, moonlit ice halo, deeper royal identity than market backs. Make it more sovereign/prestige-coded than market backs, with a readable blank center and no baked UI. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### AR-ROYAL-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/royal-card-back/arctic-rosequartz/royal-card-back-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG artwork for the vertical prestige card back. Style: Arctic Rosequartz, icy silver table material, pale rose quartz inlay, frosted pink crystal edges, restrained luminous polish without white wash. Variant B: ceremonial rosequartz tablet with platinum frame, luminous arctic mantle, calm center, and premium border stronger than market L3. Make it more sovereign/prestige-coded than market backs, with a readable blank center and no baked UI. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### TA-SHELL-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/thunder-amethyst/shell-background-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Thunder Amethyst, storm-dark graphite stone, deep amethyst crystal, electric silver edge light, dramatic but readable fantasy board-game material. Variant A: symmetrical storm-stone table with calm low-noise center and richer violet lightning atmosphere only at corners and outer borders. Keep the center subdued and low-noise for the gameplay stage; edges may carry stronger atmosphere. No separate playmat or tablecloth slot. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### TA-SHELL-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/thunder-amethyst/shell-background-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Thunder Amethyst, storm-dark graphite stone, deep amethyst crystal, electric silver edge light, dramatic but readable fantasy board-game material. Variant B: broader graphite center, thin amethyst perimeter channels, subtle storm glow near the edges, and no implied UI panels. Keep the center subdued and low-noise for the gameplay stage; edges may carry stronger atmosphere. No separate playmat or tablecloth slot. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### TA-TOPBAR-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/topbar/thunder-amethyst/topbar-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG artwork for the panoramic header strip. Style: Thunder Amethyst, storm-dark graphite stone, deep amethyst crystal, electric silver edge light, dramatic but readable fantasy board-game material. Variant A: dark amethyst header strip with quiet readable overlay zones around 25%, 50%, and 75% width, electric silver detail only at ends and thin borders. Keep quiet readable overlay zones around 25%, 50%, and 75% width for React score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### TA-TOPBAR-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/topbar/thunder-amethyst/topbar-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG artwork for the panoramic header strip. Style: Thunder Amethyst, storm-dark graphite stone, deep amethyst crystal, electric silver edge light, dramatic but readable fantasy board-game material. Variant B: low-noise graphite-violet header, calm mid-strip, controlled storm highlights near far edges, and readable score zones. Keep quiet readable overlay zones around 25%, 50%, and 75% width for React score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### TA-PLAYER-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/player-zone/thunder-amethyst/player-zone-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG artwork for the ultra-wide player rail that works anchored left for P1 or right for P2. Style: Thunder Amethyst, storm-dark graphite stone, deep amethyst crystal, electric silver edge light, dramatic but readable fantasy board-game material. Variant A: quiet central bands for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings, with amethyst storm material only at extreme edges and thin borders. Keep quiet center bands for overlays; no baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, or numbers. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### TA-PLAYER-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/player-zone/thunder-amethyst/player-zone-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG artwork for the ultra-wide player rail that works anchored left for P1 or right for P2. Style: Thunder Amethyst, storm-dark graphite stone, deep amethyst crystal, electric silver edge light, dramatic but readable fantasy board-game material. Variant B: broad calm graphite rail, mirror-safe amethyst edge ornaments, no implied card positions, and faint electric silver edge glow. Keep quiet center bands for overlays; no baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, or numbers. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### TA-GEM-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/gem-panel/thunder-amethyst/gem-panel-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG artwork for the front-facing orthographic square board. Style: Thunder Amethyst, storm-dark graphite stone, deep amethyst crystal, electric silver edge light, dramatic but readable fantasy board-game material. Variant A: clear 5x5 empty wells, compact graphite frame, amethyst grid grooves, and controlled violet edge light. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Empty readable 5x5 wells only; no baked gems, markers, or symbols inside cells. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### TA-GEM-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/gem-panel/thunder-amethyst/gem-panel-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG artwork for the front-facing orthographic square board. Style: Thunder Amethyst, storm-dark graphite stone, deep amethyst crystal, electric silver edge light, dramatic but readable fantasy board-game material. Variant B: lower-noise playable grid, dark empty cells, bright but thin silver separators, storm-amethyst accents kept outside the playfield. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Empty readable 5x5 wells only; no baked gems, markers, or symbols inside cells. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### TA-L1-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l1/thunder-amethyst/market-card-back-l1-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Thunder Amethyst, storm-dark graphite stone, deep amethyst crystal, electric silver edge light, dramatic but readable fantasy board-game material. Variant A: same family as L2 and L3, graphite field with simple amethyst-silver border; visibly lowest tier through restrained trim and quiet center. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### TA-L1-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l1/thunder-amethyst/market-card-back-l1-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Thunder Amethyst, storm-dark graphite stone, deep amethyst crystal, electric silver edge light, dramatic but readable fantasy board-game material. Variant B: matte storm graphite card back, minimal violet rim, faint crystal facets; alternate lowest-tier composition readable at 150x200. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### TA-L2-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l2/thunder-amethyst/market-card-back-l2-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Thunder Amethyst, storm-dark graphite stone, deep amethyst crystal, electric silver edge light, dramatic but readable fantasy board-game material. Variant A: same silhouette as L1 and L3, layered amethyst border and controlled electric silver accents; visibly mid tier with more trim than L1 and less luxury than L3. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### TA-L2-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l2/thunder-amethyst/market-card-back-l2-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Thunder Amethyst, storm-dark graphite stone, deep amethyst crystal, electric silver edge light, dramatic but readable fantasy board-game material. Variant B: shared L1/L2/L3 frame language, graphite center, violet rails, moderate storm-glass detail; alternate mid-tier composition. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### TA-L3-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l3/thunder-amethyst/market-card-back-l3-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Thunder Amethyst, storm-dark graphite stone, deep amethyst crystal, electric silver edge light, dramatic but readable fantasy board-game material. Variant A: same set as L1 and L2, ornate amethyst frame, electric silver trim, highest market-tier prestige through richer facets and glow control. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### TA-L3-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l3/thunder-amethyst/market-card-back-l3-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Thunder Amethyst, storm-dark graphite stone, deep amethyst crystal, electric silver edge light, dramatic but readable fantasy board-game material. Variant B: shared vertical silhouette with L1 and L2, deeper violet crystal border, elegant high contrast at 150x200 runtime size. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### TA-ROYAL-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/royal-card-back/thunder-amethyst/royal-card-back-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG artwork for the vertical prestige card back. Style: Thunder Amethyst, storm-dark graphite stone, deep amethyst crystal, electric silver edge light, dramatic but readable fantasy board-game material. Variant A: sovereign thunder-amethyst card back, abstract crown-like storm crystal geometry, electric silver halo, deeper royal identity than market backs. Make it more sovereign/prestige-coded than market backs, with a readable blank center and no baked UI. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### TA-ROYAL-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/royal-card-back/thunder-amethyst/royal-card-back-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG artwork for the vertical prestige card back. Style: Thunder Amethyst, storm-dark graphite stone, deep amethyst crystal, electric silver edge light, dramatic but readable fantasy board-game material. Variant B: ceremonial graphite-amethyst tablet with luminous storm mantle, calm center, and premium border stronger than market L3. Make it more sovereign/prestige-coded than market backs, with a readable blank center and no baked UI. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### SB-SHELL-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/sunken-brass/shell-background-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Sunken Brass, deep sea patina, aged brass, teal oxidization, dark enamel, submerged treasure material without maps or writing. Variant A: symmetrical dark enamel table with calm low-noise center and richer brass-patina atmosphere only at corners and outer borders. Keep the center subdued and low-noise for the gameplay stage; edges may carry stronger atmosphere. No separate playmat or tablecloth slot. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### SB-SHELL-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/sunken-brass/shell-background-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Sunken Brass, deep sea patina, aged brass, teal oxidization, dark enamel, submerged treasure material without maps or writing. Variant B: broad dark teal center, aged brass rails, subtle underwater patina glow near perimeter, and no implied UI panels. Keep the center subdued and low-noise for the gameplay stage; edges may carry stronger atmosphere. No separate playmat or tablecloth slot. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### SB-TOPBAR-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/topbar/sunken-brass/topbar-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG artwork for the panoramic header strip. Style: Sunken Brass, deep sea patina, aged brass, teal oxidization, dark enamel, submerged treasure material without maps or writing. Variant A: aged brass and dark teal panoramic strip with quiet readable overlay zones around 25%, 50%, and 75% width, ornament pushed to ends and thin borders. Keep quiet readable overlay zones around 25%, 50%, and 75% width for React score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### SB-TOPBAR-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/topbar/sunken-brass/topbar-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG artwork for the panoramic header strip. Style: Sunken Brass, deep sea patina, aged brass, teal oxidization, dark enamel, submerged treasure material without maps or writing. Variant B: low-profile patina header with especially calm mid-strip, dark enamel center, and tarnished brass rails near far edges. Keep quiet readable overlay zones around 25%, 50%, and 75% width for React score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### SB-PLAYER-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/player-zone/sunken-brass/player-zone-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG artwork for the ultra-wide player rail that works anchored left for P1 or right for P2. Style: Sunken Brass, deep sea patina, aged brass, teal oxidization, dark enamel, submerged treasure material without maps or writing. Variant A: quiet central bands for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings, with brass-patina material only at extreme edges and thin borders. Keep quiet center bands for overlays; no baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, or numbers. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### SB-PLAYER-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/player-zone/sunken-brass/player-zone-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG artwork for the ultra-wide player rail that works anchored left for P1 or right for P2. Style: Sunken Brass, deep sea patina, aged brass, teal oxidization, dark enamel, submerged treasure material without maps or writing. Variant B: broad calm dark teal rail, mirror-safe edge ornaments, no implied card positions, and subdued oxidized brass cornerwork. Keep quiet center bands for overlays; no baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, or numbers. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### SB-GEM-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/gem-panel/sunken-brass/gem-panel-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG artwork for the front-facing orthographic square board. Style: Sunken Brass, deep sea patina, aged brass, teal oxidization, dark enamel, submerged treasure material without maps or writing. Variant A: clear 5x5 empty wells, compact aged-brass frame, teal patina separators, and dark enamel cell substrate. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Empty readable 5x5 wells only; no baked gems, markers, or symbols inside cells. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### SB-GEM-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/gem-panel/sunken-brass/gem-panel-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG artwork for the front-facing orthographic square board. Style: Sunken Brass, deep sea patina, aged brass, teal oxidization, dark enamel, submerged treasure material without maps or writing. Variant B: lower-noise playable grid, dark empty wells, tarnished brass dividers, patina details kept outside the playfield. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Empty readable 5x5 wells only; no baked gems, markers, or symbols inside cells. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### SB-L1-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l1/sunken-brass/market-card-back-l1-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Sunken Brass, deep sea patina, aged brass, teal oxidization, dark enamel, submerged treasure material without maps or writing. Variant A: same family as L2 and L3, dark enamel field with simple aged-brass border; visibly lowest tier through restrained trim and quiet center. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### SB-L1-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l1/sunken-brass/market-card-back-l1-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Sunken Brass, deep sea patina, aged brass, teal oxidization, dark enamel, submerged treasure material without maps or writing. Variant B: matte dark teal card back, minimal tarnished brass rim, faint patina texture; alternate lowest-tier composition readable at 150x200. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### SB-L2-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l2/sunken-brass/market-card-back-l2-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Sunken Brass, deep sea patina, aged brass, teal oxidization, dark enamel, submerged treasure material without maps or writing. Variant A: same silhouette as L1 and L3, layered brass border and controlled teal patina accents; visibly mid tier with more trim than L1 and less luxury than L3. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### SB-L2-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l2/sunken-brass/market-card-back-l2-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Sunken Brass, deep sea patina, aged brass, teal oxidization, dark enamel, submerged treasure material without maps or writing. Variant B: shared L1/L2/L3 frame language, dark enamel center, brass rails, moderate patina detail; alternate mid-tier composition. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### SB-L3-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l3/sunken-brass/market-card-back-l3-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Sunken Brass, deep sea patina, aged brass, teal oxidization, dark enamel, submerged treasure material without maps or writing. Variant A: same set as L1 and L2, ornate aged-brass frame, teal oxidized jewel accents, highest market-tier richness with controlled glow. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### SB-L3-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l3/sunken-brass/market-card-back-l3-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Sunken Brass, deep sea patina, aged brass, teal oxidization, dark enamel, submerged treasure material without maps or writing. Variant B: shared vertical silhouette with L1 and L2, richer submerged-brass border, elegant high contrast at 150x200 runtime size. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### SB-ROYAL-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/royal-card-back/sunken-brass/royal-card-back-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG artwork for the vertical prestige card back. Style: Sunken Brass, deep sea patina, aged brass, teal oxidization, dark enamel, submerged treasure material without maps or writing. Variant A: sovereign sunken-brass prestige card back, abstract crown-like patina geometry, dark teal halo, deeper royal identity than market backs. Make it more sovereign/prestige-coded than market backs, with a readable blank center and no baked UI. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### SB-ROYAL-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/royal-card-back/sunken-brass/royal-card-back-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG artwork for the vertical prestige card back. Style: Sunken Brass, deep sea patina, aged brass, teal oxidization, dark enamel, submerged treasure material without maps or writing. Variant B: ceremonial aged-brass tablet with oxidized teal mantle, calm center, and premium border stronger than market L3. Make it more sovereign/prestige-coded than market backs, with a readable blank center and no baked UI. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PL-SHELL-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/paper-lantern/shell-background-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Paper Lantern, warm washi texture, lacquered charcoal, soft lantern glow, vermilion and muted gold accents, no characters or glyphs. Variant A: symmetrical lacquered tabletop with calm low-noise center and richer lantern warmth only at corners and outer borders. Keep the center subdued and low-noise for the gameplay stage; edges may carry stronger atmosphere. No separate playmat or tablecloth slot. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PL-SHELL-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/shell-background/paper-lantern/shell-background-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Paper Lantern, warm washi texture, lacquered charcoal, soft lantern glow, vermilion and muted gold accents, no characters or glyphs. Variant B: broad matte charcoal center, soft washi-paper perimeter, thin vermilion-gold rails, and no implied UI panels. Keep the center subdued and low-noise for the gameplay stage; edges may carry stronger atmosphere. No separate playmat or tablecloth slot. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PL-TOPBAR-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/topbar/paper-lantern/topbar-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG artwork for the panoramic header strip. Style: Paper Lantern, warm washi texture, lacquered charcoal, soft lantern glow, vermilion and muted gold accents, no characters or glyphs. Variant A: lacquered charcoal and warm washi panoramic strip with quiet readable overlay zones around 25%, 50%, and 75% width, ornament pushed to ends and thin borders. Keep quiet readable overlay zones around 25%, 50%, and 75% width for React score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PL-TOPBAR-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/topbar/paper-lantern/topbar-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG artwork for the panoramic header strip. Style: Paper Lantern, warm washi texture, lacquered charcoal, soft lantern glow, vermilion and muted gold accents, no characters or glyphs. Variant B: low-noise lantern-warm header with especially calm mid-strip, subtle vermilion rails, and soft paper glow near far edges. Keep quiet readable overlay zones around 25%, 50%, and 75% width for React score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PL-PLAYER-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/player-zone/paper-lantern/player-zone-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG artwork for the ultra-wide player rail that works anchored left for P1 or right for P2. Style: Paper Lantern, warm washi texture, lacquered charcoal, soft lantern glow, vermilion and muted gold accents, no characters or glyphs. Variant A: quiet central bands for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings, with washi-lacquer material only at extreme edges and thin borders. Keep quiet center bands for overlays; no baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, or numbers. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PL-PLAYER-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/player-zone/paper-lantern/player-zone-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG artwork for the ultra-wide player rail that works anchored left for P1 or right for P2. Style: Paper Lantern, warm washi texture, lacquered charcoal, soft lantern glow, vermilion and muted gold accents, no characters or glyphs. Variant B: broad calm charcoal rail, mirror-safe lantern edge ornaments, no implied card positions, and muted gold corner trim. Keep quiet center bands for overlays; no baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, or numbers. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PL-GEM-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/gem-panel/paper-lantern/gem-panel-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG artwork for the front-facing orthographic square board. Style: Paper Lantern, warm washi texture, lacquered charcoal, soft lantern glow, vermilion and muted gold accents, no characters or glyphs. Variant A: clear 5x5 empty wells, compact lacquered frame, warm gold dividers, and quiet washi-paper cell substrate. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Empty readable 5x5 wells only; no baked gems, markers, or symbols inside cells. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PL-GEM-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/gem-panel/paper-lantern/gem-panel-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG artwork for the front-facing orthographic square board. Style: Paper Lantern, warm washi texture, lacquered charcoal, soft lantern glow, vermilion and muted gold accents, no characters or glyphs. Variant B: lower-noise playable grid, matte charcoal wells, vermilion-gold separators, paper texture kept outside the playfield. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Empty readable 5x5 wells only; no baked gems, markers, or symbols inside cells. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PL-L1-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l1/paper-lantern/market-card-back-l1-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Paper Lantern, warm washi texture, lacquered charcoal, soft lantern glow, vermilion and muted gold accents, no characters or glyphs. Variant A: same family as L2 and L3, lacquered charcoal field with simple warm gold border; visibly lowest tier through restrained trim and quiet center. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PL-L1-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l1/paper-lantern/market-card-back-l1-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Paper Lantern, warm washi texture, lacquered charcoal, soft lantern glow, vermilion and muted gold accents, no characters or glyphs. Variant B: matte washi-lacquer card back, minimal vermilion rim, faint paper texture; alternate lowest-tier composition readable at 150x200. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PL-L2-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l2/paper-lantern/market-card-back-l2-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Paper Lantern, warm washi texture, lacquered charcoal, soft lantern glow, vermilion and muted gold accents, no characters or glyphs. Variant A: same silhouette as L1 and L3, layered warm gold border and controlled lantern glow; visibly mid tier with more trim than L1 and less luxury than L3. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PL-L2-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l2/paper-lantern/market-card-back-l2-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Paper Lantern, warm washi texture, lacquered charcoal, soft lantern glow, vermilion and muted gold accents, no characters or glyphs. Variant B: shared L1/L2/L3 frame language, charcoal center, vermilion rails, moderate paper-lantern detail; alternate mid-tier composition. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PL-L3-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l3/paper-lantern/market-card-back-l3-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Paper Lantern, warm washi texture, lacquered charcoal, soft lantern glow, vermilion and muted gold accents, no characters or glyphs. Variant A: same set as L1 and L2, ornate lacquer-gold frame, soft lantern glow, highest market-tier richness with clean downsample readability. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PL-L3-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/market-card-back-l3/paper-lantern/market-card-back-l3-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Paper Lantern, warm washi texture, lacquered charcoal, soft lantern glow, vermilion and muted gold accents, no characters or glyphs. Variant B: shared vertical silhouette with L1 and L2, richer gold-lacquer border, elegant high contrast at 150x200 runtime size. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PL-ROYAL-A

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/royal-card-back/paper-lantern/royal-card-back-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG artwork for the vertical prestige card back. Style: Paper Lantern, warm washi texture, lacquered charcoal, soft lantern glow, vermilion and muted gold accents, no characters or glyphs. Variant A: sovereign paper-lantern prestige card back, abstract crown-like lacquer geometry, warm gold halo, deeper royal identity than market backs. Make it more sovereign/prestige-coded than market backs, with a readable blank center and no baked UI. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PL-ROYAL-B

Archive filename: `assets/art-library/surface-autonomous-luminous-styles-candidates/2026-04-27/royal-card-back/paper-lantern/royal-card-back-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG artwork for the vertical prestige card back. Style: Paper Lantern, warm washi texture, lacquered charcoal, soft lantern glow, vermilion and muted gold accents, no characters or glyphs. Variant B: ceremonial lacquered tablet with lantern-gold mantle, calm center, and premium border stronger than market L3. Make it more sovereign/prestige-coded than market backs, with a readable blank center and no baked UI. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```
