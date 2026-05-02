# Surface Asset Autonomous Artisan Styles Prompt Manifest - 2026-04-27

## Scope

This is the ninth independent Image Gen candidate-library pass for GemDuel surface art. It follows `docs/art/long-autonomous-surface-asset-generation-codex-prompt-2026-04-27.md` and `C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md`.

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

- Prompt manifest: `docs/art/surface-asset-autonomous-artisan-styles-prompts-2026-04-27.md`
- Scoring report: `docs/art/surface-asset-autonomous-artisan-styles-library-2026-04-27.md`
- Archive root: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/`

## Style Groups

| Style               | Slug                  | Direction                                                                                                                  |
| ------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Cerulean Cloisonne  | `cerulean-cloisonne`  | Deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing.              |
| Garnet Meteorite    | `garnet-meteorite`    | Dark meteorite iron, garnet crystal, smoky nickel trim, fiery red highlights kept controlled and readable.                 |
| Mistwood Silverleaf | `mistwood-silverleaf` | Cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop.                      |
| Prism Slate         | `prism-slate`         | Matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. |

## Prompt Catalog

### CL-SHELL-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/cerulean-cloisonne/shell-background-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Cerulean Cloisonne, deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing. Variant A: symmetrical enamel table with calm low-noise center and richer brass-wire atmosphere only at corners and outer borders. Keep the center subdued and low-noise for the gameplay stage; edges may carry stronger atmosphere. No separate playmat or tablecloth slot. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### CL-SHELL-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/cerulean-cloisonne/shell-background-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Cerulean Cloisonne, deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing. Variant B: broader matte blue enamel center, thin brass perimeter channels, porcelain edge highlights, and no implied UI panels. Keep the center subdued and low-noise for the gameplay stage; edges may carry stronger atmosphere. No separate playmat or tablecloth slot. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### CL-TOPBAR-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/topbar/cerulean-cloisonne/topbar-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG artwork for the panoramic header strip. Style: Cerulean Cloisonne, deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing. Variant A: cerulean enamel panoramic strip with quiet readable overlay zones around 25%, 50%, and 75% width, brass wire detail only at far ends and thin borders. Keep quiet readable overlay zones around 25%, 50%, and 75% width for React score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### CL-TOPBAR-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/topbar/cerulean-cloisonne/topbar-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG artwork for the panoramic header strip. Style: Cerulean Cloisonne, deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing. Variant B: low-profile blue porcelain header, calm mid-strip, hairline brass rails, and small enamel glints near the ends. Keep quiet readable overlay zones around 25%, 50%, and 75% width for React score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### CL-PLAYER-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/player-zone/cerulean-cloisonne/player-zone-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG artwork for the ultra-wide player rail that works anchored left for P1 or right for P2. Style: Cerulean Cloisonne, deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing. Variant A: quiet central bands for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings, with brass/enamel detail only at extreme edges and thin borders. Keep quiet center bands for overlays; no baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, or numbers. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### CL-PLAYER-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/player-zone/cerulean-cloisonne/player-zone-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG artwork for the ultra-wide player rail that works anchored left for P1 or right for P2. Style: Cerulean Cloisonne, deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing. Variant B: broad calm enamel rail, mirror-safe edge ornaments, no implied card positions, and subdued porcelain-brass cornerwork. Keep quiet center bands for overlays; no baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, or numbers. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### CL-GEM-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/gem-panel/cerulean-cloisonne/gem-panel-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG artwork for the front-facing orthographic square board. Style: Cerulean Cloisonne, deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing. Variant A: clear 5x5 empty wells, compact brass frame, cerulean enamel separators, and porcelain cell substrate. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Empty readable 5x5 wells only; no baked gems, markers, or symbols inside cells. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### CL-GEM-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/gem-panel/cerulean-cloisonne/gem-panel-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG artwork for the front-facing orthographic square board. Style: Cerulean Cloisonne, deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing. Variant B: lower-noise playable grid, deeper blue empty wells, thin brass dividers, and cloisonne material kept outside the playfield. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Empty readable 5x5 wells only; no baked gems, markers, or symbols inside cells. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### CL-L1-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l1/cerulean-cloisonne/market-card-back-l1-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Cerulean Cloisonne, deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing. Variant A: same family as L2 and L3, blue enamel field with simple brass border; visibly lowest tier through restrained trim and quiet center. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### CL-L1-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l1/cerulean-cloisonne/market-card-back-l1-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Cerulean Cloisonne, deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing. Variant B: matte cerulean card back, minimal brass rim, faint porcelain shine; alternate lowest-tier composition readable at 150x200. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### CL-L2-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l2/cerulean-cloisonne/market-card-back-l2-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Cerulean Cloisonne, deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing. Variant A: same silhouette as L1 and L3, layered brass border and controlled enamel highlights; visibly mid tier with more trim than L1 and less luxury than L3. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### CL-L2-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l2/cerulean-cloisonne/market-card-back-l2-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Cerulean Cloisonne, deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing. Variant B: shared L1/L2/L3 frame language, porcelain-blue center, brass rails, moderate inlay detail; alternate mid-tier composition. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### CL-L3-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l3/cerulean-cloisonne/market-card-back-l3-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Cerulean Cloisonne, deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing. Variant A: same set as L1 and L2, ornate brass-wire frame, rich cerulean enamel facets, highest market-tier polish without readable symbols. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### CL-L3-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l3/cerulean-cloisonne/market-card-back-l3-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Cerulean Cloisonne, deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing. Variant B: shared vertical silhouette with L1 and L2, richer enamel and brass border, elegant high contrast at 150x200 runtime size. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### CL-ROYAL-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/royal-card-back/cerulean-cloisonne/royal-card-back-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG artwork for the vertical prestige card back. Style: Cerulean Cloisonne, deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing. Variant A: sovereign cerulean-cloisonne prestige card back, abstract crown-like brass inlay, porcelain-blue halo, deeper royal identity than market backs. Make it more sovereign/prestige-coded than market backs, with a readable blank center and no baked UI. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### CL-ROYAL-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/royal-card-back/cerulean-cloisonne/royal-card-back-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG artwork for the vertical prestige card back. Style: Cerulean Cloisonne, deep cerulean enamel, brass wire inlay, porcelain gloss, precise artisan board-game material without writing. Variant B: ceremonial blue enamel tablet with brass mantle, calm center, and premium border stronger than market L3. Make it more sovereign/prestige-coded than market backs, with a readable blank center and no baked UI. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### GM-SHELL-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/garnet-meteorite/shell-background-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Garnet Meteorite, dark meteorite iron, garnet crystal, smoky nickel trim, controlled fiery red highlights with readable dark material. Variant A: symmetrical meteorite-iron table with calm low-noise center and richer garnet atmosphere only at corners and outer borders. Keep the center subdued and low-noise for the gameplay stage; edges may carry stronger atmosphere. No separate playmat or tablecloth slot. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### GM-SHELL-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/garnet-meteorite/shell-background-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Garnet Meteorite, dark meteorite iron, garnet crystal, smoky nickel trim, controlled fiery red highlights with readable dark material. Variant B: broad dark iron center, fractured garnet perimeter channels, smoky nickel edge trim, and no implied UI panels. Keep the center subdued and low-noise for the gameplay stage; edges may carry stronger atmosphere. No separate playmat or tablecloth slot. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### GM-TOPBAR-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/topbar/garnet-meteorite/topbar-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG artwork for the panoramic header strip. Style: Garnet Meteorite, dark meteorite iron, garnet crystal, smoky nickel trim, controlled fiery red highlights with readable dark material. Variant A: dark meteorite header strip with quiet readable overlay zones around 25%, 50%, and 75% width, garnet and nickel detail only at ends and thin borders. Keep quiet readable overlay zones around 25%, 50%, and 75% width for React score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### GM-TOPBAR-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/topbar/garnet-meteorite/topbar-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG artwork for the panoramic header strip. Style: Garnet Meteorite, dark meteorite iron, garnet crystal, smoky nickel trim, controlled fiery red highlights with readable dark material. Variant B: low-noise iron-garnet header, calm mid-strip, controlled red highlights near far edges, and readable score zones. Keep quiet readable overlay zones around 25%, 50%, and 75% width for React score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### GM-PLAYER-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/player-zone/garnet-meteorite/player-zone-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG artwork for the ultra-wide player rail that works anchored left for P1 or right for P2. Style: Garnet Meteorite, dark meteorite iron, garnet crystal, smoky nickel trim, controlled fiery red highlights with readable dark material. Variant A: quiet central bands for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings, with garnet meteorite material only at extreme edges and thin borders. Keep quiet center bands for overlays; no baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, or numbers. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### GM-PLAYER-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/player-zone/garnet-meteorite/player-zone-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG artwork for the ultra-wide player rail that works anchored left for P1 or right for P2. Style: Garnet Meteorite, dark meteorite iron, garnet crystal, smoky nickel trim, controlled fiery red highlights with readable dark material. Variant B: broad calm iron rail, mirror-safe garnet edge ornaments, no implied card positions, and faint smoky nickel edge glow. Keep quiet center bands for overlays; no baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, or numbers. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### GM-GEM-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/gem-panel/garnet-meteorite/gem-panel-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG artwork for the front-facing orthographic square board. Style: Garnet Meteorite, dark meteorite iron, garnet crystal, smoky nickel trim, controlled fiery red highlights with readable dark material. Variant A: clear 5x5 empty wells, compact meteorite frame, garnet grid grooves, and controlled red edge light. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Empty readable 5x5 wells only; no baked gems, markers, or symbols inside cells. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### GM-GEM-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/gem-panel/garnet-meteorite/gem-panel-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG artwork for the front-facing orthographic square board. Style: Garnet Meteorite, dark meteorite iron, garnet crystal, smoky nickel trim, controlled fiery red highlights with readable dark material. Variant B: lower-noise playable grid, dark empty cells, thin nickel separators, garnet accents kept outside the playfield. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Empty readable 5x5 wells only; no baked gems, markers, or symbols inside cells. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### GM-L1-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l1/garnet-meteorite/market-card-back-l1-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Garnet Meteorite, dark meteorite iron, garnet crystal, smoky nickel trim, controlled fiery red highlights with readable dark material. Variant A: same family as L2 and L3, meteorite field with simple garnet-nickel border; visibly lowest tier through restrained trim and quiet center. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### GM-L1-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l1/garnet-meteorite/market-card-back-l1-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Garnet Meteorite, dark meteorite iron, garnet crystal, smoky nickel trim, controlled fiery red highlights with readable dark material. Variant B: matte dark iron card back, minimal garnet rim, faint pitted metal texture; alternate lowest-tier composition readable at 150x200. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### GM-L2-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l2/garnet-meteorite/market-card-back-l2-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Garnet Meteorite, dark meteorite iron, garnet crystal, smoky nickel trim, controlled fiery red highlights with readable dark material. Variant A: same silhouette as L1 and L3, layered garnet border and controlled nickel accents; visibly mid tier with more trim than L1 and less luxury than L3. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### GM-L2-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l2/garnet-meteorite/market-card-back-l2-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Garnet Meteorite, dark meteorite iron, garnet crystal, smoky nickel trim, controlled fiery red highlights with readable dark material. Variant B: shared L1/L2/L3 frame language, dark iron center, garnet rails, moderate meteorite detail; alternate mid-tier composition. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### GM-L3-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l3/garnet-meteorite/market-card-back-l3-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Garnet Meteorite, dark meteorite iron, garnet crystal, smoky nickel trim, controlled fiery red highlights with readable dark material. Variant A: same set as L1 and L2, ornate garnet frame, smoky nickel trim, highest market-tier prestige through richer facets and glow control. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### GM-L3-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l3/garnet-meteorite/market-card-back-l3-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Garnet Meteorite, dark meteorite iron, garnet crystal, smoky nickel trim, controlled fiery red highlights with readable dark material. Variant B: shared vertical silhouette with L1 and L2, deeper garnet crystal border, elegant high contrast at 150x200 runtime size. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### GM-ROYAL-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/royal-card-back/garnet-meteorite/royal-card-back-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG artwork for the vertical prestige card back. Style: Garnet Meteorite, dark meteorite iron, garnet crystal, smoky nickel trim, controlled fiery red highlights with readable dark material. Variant A: sovereign garnet-meteorite card back, abstract crown-like crystal geometry, smoky red halo, deeper royal identity than market backs. Make it more sovereign/prestige-coded than market backs, with a readable blank center and no baked UI. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### GM-ROYAL-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/royal-card-back/garnet-meteorite/royal-card-back-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG artwork for the vertical prestige card back. Style: Garnet Meteorite, dark meteorite iron, garnet crystal, smoky nickel trim, controlled fiery red highlights with readable dark material. Variant B: ceremonial meteorite tablet with luminous garnet mantle, calm center, and premium border stronger than market L3. Make it more sovereign/prestige-coded than market backs, with a readable blank center and no baked UI. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### MS-SHELL-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/mistwood-silverleaf/shell-background-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Mistwood Silverleaf, cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop material. Variant A: symmetrical mistwood table with calm low-noise center and richer silverleaf atmosphere only at corners and outer borders. Keep the center subdued and low-noise for the gameplay stage; edges may carry stronger atmosphere. No separate playmat or tablecloth slot. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### MS-SHELL-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/mistwood-silverleaf/shell-background-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Mistwood Silverleaf, cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop material. Variant B: broad dark wood center, silverleaf edge channels, muted sage-blue mist near perimeter, and no implied UI panels. Keep the center subdued and low-noise for the gameplay stage; edges may carry stronger atmosphere. No separate playmat or tablecloth slot. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### MS-TOPBAR-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/topbar/mistwood-silverleaf/topbar-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG artwork for the panoramic header strip. Style: Mistwood Silverleaf, cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop material. Variant A: misted wood and silverleaf panoramic strip with quiet readable overlay zones around 25%, 50%, and 75% width, ornament pushed to ends and thin borders. Keep quiet readable overlay zones around 25%, 50%, and 75% width for React score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### MS-TOPBAR-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/topbar/mistwood-silverleaf/topbar-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG artwork for the panoramic header strip. Style: Mistwood Silverleaf, cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop material. Variant B: low-profile blue-gray wood header, calm mid-strip, subtle silver rails, and soft mist only near far edges. Keep quiet readable overlay zones around 25%, 50%, and 75% width for React score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### MS-PLAYER-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/player-zone/mistwood-silverleaf/player-zone-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG artwork for the ultra-wide player rail that works anchored left for P1 or right for P2. Style: Mistwood Silverleaf, cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop material. Variant A: quiet central bands for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings, with silverleaf wood detail only at extreme edges and thin borders. Keep quiet center bands for overlays; no baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, or numbers. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### MS-PLAYER-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/player-zone/mistwood-silverleaf/player-zone-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG artwork for the ultra-wide player rail that works anchored left for P1 or right for P2. Style: Mistwood Silverleaf, cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop material. Variant B: broad calm wood rail, mirror-safe edge ornaments, no implied card positions, and subdued silverleaf corner trim. Keep quiet center bands for overlays; no baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, or numbers. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### MS-GEM-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/gem-panel/mistwood-silverleaf/gem-panel-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG artwork for the front-facing orthographic square board. Style: Mistwood Silverleaf, cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop material. Variant A: clear 5x5 empty wells, compact silverleaf frame, muted wood separators, and cool blue-gray cell substrate. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Empty readable 5x5 wells only; no baked gems, markers, or symbols inside cells. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### MS-GEM-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/gem-panel/mistwood-silverleaf/gem-panel-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG artwork for the front-facing orthographic square board. Style: Mistwood Silverleaf, cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop material. Variant B: lower-noise playable grid, matte mistwood wells, silver separators, wood texture kept outside the playfield. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Empty readable 5x5 wells only; no baked gems, markers, or symbols inside cells. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### MS-L1-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l1/mistwood-silverleaf/market-card-back-l1-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Mistwood Silverleaf, cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop material. Variant A: same family as L2 and L3, dark wood field with simple silverleaf border; visibly lowest tier through restrained trim and quiet center. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### MS-L1-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l1/mistwood-silverleaf/market-card-back-l1-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Mistwood Silverleaf, cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop material. Variant B: matte mistwood card back, minimal silver rim, faint sage-blue grain; alternate lowest-tier composition readable at 150x200. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### MS-L2-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l2/mistwood-silverleaf/market-card-back-l2-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Mistwood Silverleaf, cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop material. Variant A: same silhouette as L1 and L3, layered silverleaf border and controlled mist highlight; visibly mid tier with more trim than L1 and less luxury than L3. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### MS-L2-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l2/mistwood-silverleaf/market-card-back-l2-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Mistwood Silverleaf, cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop material. Variant B: shared L1/L2/L3 frame language, dark wood center, silver rails, moderate leaf detail; alternate mid-tier composition. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### MS-L3-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l3/mistwood-silverleaf/market-card-back-l3-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Mistwood Silverleaf, cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop material. Variant A: same set as L1 and L2, ornate silverleaf frame, blue-gray mist accents, highest market-tier richness with clean downsample readability. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### MS-L3-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l3/mistwood-silverleaf/market-card-back-l3-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Mistwood Silverleaf, cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop material. Variant B: shared vertical silhouette with L1 and L2, richer silverleaf border, elegant high contrast at 150x200 runtime size. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### MS-ROYAL-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/royal-card-back/mistwood-silverleaf/royal-card-back-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG artwork for the vertical prestige card back. Style: Mistwood Silverleaf, cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop material. Variant A: sovereign mistwood-silverleaf prestige card back, abstract crown-like leaf geometry, cool silver halo, deeper royal identity than market backs. Make it more sovereign/prestige-coded than market backs, with a readable blank center and no baked UI. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### MS-ROYAL-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/royal-card-back/mistwood-silverleaf/royal-card-back-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG artwork for the vertical prestige card back. Style: Mistwood Silverleaf, cool misted dark wood, silver leaf trim, muted sage and blue-gray atmosphere, quiet premium tabletop material. Variant B: ceremonial dark wood tablet with silverleaf mantle, calm center, and premium border stronger than market L3. Make it more sovereign/prestige-coded than market backs, with a readable blank center and no baked UI. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PS-SHELL-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/prism-slate/shell-background-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Prism Slate, matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. Variant A: symmetrical charcoal slate table with calm low-noise center and richer spectral refraction only at corners and outer borders. Keep the center subdued and low-noise for the gameplay stage; edges may carry stronger atmosphere. No separate playmat or tablecloth slot. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PS-SHELL-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/shell-background/prism-slate/shell-background-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Prism Slate, matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. Variant B: broader matte slate center, titanium perimeter rails, subtle prism edge light, and no implied UI panels. Keep the center subdued and low-noise for the gameplay stage; edges may carry stronger atmosphere. No separate playmat or tablecloth slot. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PS-TOPBAR-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/topbar/prism-slate/topbar-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG artwork for the panoramic header strip. Style: Prism Slate, matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. Variant A: charcoal slate panoramic strip with quiet readable overlay zones around 25%, 50%, and 75% width, spectral detail only at far ends and thin borders. Keep quiet readable overlay zones around 25%, 50%, and 75% width for React score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PS-TOPBAR-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/topbar/prism-slate/topbar-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG artwork for the panoramic header strip. Style: Prism Slate, matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. Variant B: low-profile slate header, calm mid-strip, titanium hairlines, and small prism glints near the ends. Keep quiet readable overlay zones around 25%, 50%, and 75% width for React score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PS-PLAYER-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/player-zone/prism-slate/player-zone-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG artwork for the ultra-wide player rail that works anchored left for P1 or right for P2. Style: Prism Slate, matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. Variant A: quiet central bands for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings, with prism-slate material only at extreme edges and thin borders. Keep quiet center bands for overlays; no baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, or numbers. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PS-PLAYER-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/player-zone/prism-slate/player-zone-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG artwork for the ultra-wide player rail that works anchored left for P1 or right for P2. Style: Prism Slate, matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. Variant B: broad calm charcoal rail, mirror-safe prism edge ornaments, no implied card positions, and subdued titanium cornerwork. Keep quiet center bands for overlays; no baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, or numbers. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PS-GEM-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/gem-panel/prism-slate/gem-panel-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG artwork for the front-facing orthographic square board. Style: Prism Slate, matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. Variant A: clear 5x5 empty wells, compact titanium frame, dark slate separators, and subtle prism edge light outside wells. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Empty readable 5x5 wells only; no baked gems, markers, or symbols inside cells. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PS-GEM-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/gem-panel/prism-slate/gem-panel-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG artwork for the front-facing orthographic square board. Style: Prism Slate, matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. Variant B: lower-noise playable grid, matte slate empty cells, titanium dividers, spectral material kept outside the playfield. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. Empty readable 5x5 wells only; no baked gems, markers, or symbols inside cells. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PS-L1-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l1/prism-slate/market-card-back-l1-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Prism Slate, matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. Variant A: same family as L2 and L3, charcoal slate field with simple titanium border; visibly lowest tier through restrained trim and quiet center. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PS-L1-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l1/prism-slate/market-card-back-l1-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Prism Slate, matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. Variant B: matte slate card back, minimal titanium rim, faint spectral edge; alternate lowest-tier composition readable at 150x200. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PS-L2-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l2/prism-slate/market-card-back-l2-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Prism Slate, matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. Variant A: same silhouette as L1 and L3, layered titanium border and controlled prism accents; visibly mid tier with more trim than L1 and less luxury than L3. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PS-L2-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l2/prism-slate/market-card-back-l2-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Prism Slate, matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. Variant B: shared L1/L2/L3 frame language, dark slate center, titanium rails, moderate prism detail; alternate mid-tier composition. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PS-L3-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l3/prism-slate/market-card-back-l3-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Prism Slate, matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. Variant A: same set as L1 and L2, ornate titanium frame, spectral prism facets, highest market-tier polish with controlled glow. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PS-L3-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/market-card-back-l3/prism-slate/market-card-back-l3-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG artwork for the vertical card-back artwork on the featured-card sample canvas. Style: Prism Slate, matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. Variant B: shared vertical silhouette with L1 and L2, richer prism-titanium border, elegant high contrast at 150x200 runtime size. L1, L2, and L3 must read as one set through shared silhouette, frame language, material family, and motif; communicate tier progression only through richness of trim, material, jewel density, and glow. No text, numerals, Roman numerals, labels, level marks, or UI elements. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PS-ROYAL-A

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/royal-card-back/prism-slate/royal-card-back-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG artwork for the vertical prestige card back. Style: Prism Slate, matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. Variant A: sovereign prism-slate prestige card back, abstract crown-like titanium geometry, spectral halo, deeper royal identity than market backs. Make it more sovereign/prestige-coded than market backs, with a readable blank center and no baked UI. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```

### PS-ROYAL-B

Archive filename: `assets/art-library/surface-autonomous-artisan-styles-candidates/2026-04-27/royal-card-back/prism-slate/royal-card-back-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG artwork for the vertical prestige card back. Style: Prism Slate, matte charcoal slate, spectral prism edge refractions, titanium trim, modern high-contrast tabletop without neon overload. Variant B: ceremonial charcoal slate tablet with prism mantle, calm center, and premium border stronger than market L3. Make it more sovereign/prestige-coded than market backs, with a readable blank center and no baked UI. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, score badges, card text, and gameplay affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, baked UI, labels, high glare.
```
