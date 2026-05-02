# Surface Asset Autonomous Prismatic Styles Prompt Manifest - 2026-04-27

## Scope

This is the seventh independent Image Gen candidate-library pass for GemDuel
surface art. It follows `docs/art/long-autonomous-surface-asset-generation-codex-prompt-2026-04-27.md`
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

- Prompt manifest: `docs/art/surface-asset-autonomous-prismatic-styles-prompts-2026-04-27.md`
- Scoring report: `docs/art/surface-asset-autonomous-prismatic-styles-library-2026-04-27.md`
- Archive root: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/`

## Style Groups

| Style              | Slug                 | Direction                                                                                           |
| ------------------ | -------------------- | --------------------------------------------------------------------------------------------------- |
| Celestial Copper   | `celestial-copper`   | Midnight star-metal, oxidized copper, restrained constellation geometry as non-text material seams. |
| Frosted Amberglass | `frosted-amberglass` | Frosted glass, pale amber resin, satin silver, readable luminous tabletop without white wash.       |
| Moss Agate         | `moss-agate`         | Deep green agate, mossy stone, antique silver, organic mineral calm with precise UI geometry.       |
| Nocturne Pearl     | `nocturne-pearl`     | Black pearl, moonlit shell, platinum edgework, soft violet-blue sheen and high prestige.            |

## Prompt Catalog

### CC-SHELL-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/shell-background/celestial-copper/shell-background-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Celestial Copper, midnight star-metal table, oxidized copper inlay, restrained constellation geometry as non-text material seams, premium fantasy board-game surface. Variant A: symmetrical surface with calm low-noise center and richer copper atmosphere only at corners and outer borders. React renders all labels, counts, gems, buttons, levels, score, rings, and UI affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, separate playmat, tablecloth slot, baked UI, busy center, harsh glare.
```

### CC-SHELL-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/shell-background/celestial-copper/shell-background-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Celestial Copper, dark blue-black metal, aged copper rails, faint star-map seams that are abstract material marks only. Variant B: broader matte center, thin copper cornerwork, subtle cosmic edge glow, no implied UI panels. React renders all labels, counts, gems, buttons, levels, score, rings, and UI affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, separate playmat, tablecloth slot, baked UI, busy center, harsh glare.
```

### CC-TOPBAR-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/topbar/celestial-copper/topbar-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG panoramic header strip. Style: Celestial Copper, midnight metal strip, oxidized copper trim, tiny star-metal reflections near ends only. Variant A: quiet readable overlay zones around 25%, 50%, and 75% width, ornament pushed to edges and thin borders. React renders scores, crowns, turn state, labels, icons, counts, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, central emblem blocking UI, dense center patterns, high glare.
```

### CC-TOPBAR-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/topbar/celestial-copper/topbar-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG panoramic header strip. Style: Celestial Copper, dark astral metal, hairline copper rails, soft blue-copper rim light. Variant B: low-profile header with especially calm mid-strip and readable zones at 25%, 50%, and 75% width. React renders scores, crowns, turn state, labels, icons, counts, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, central emblem blocking UI, dense center patterns, high glare.
```

### CC-PLAYER-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/player-zone/celestial-copper/player-zone-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG ultra-wide player rail that works anchored left for P1 or right for P2. Style: Celestial Copper, midnight star-metal rail, oxidized copper edgework, soft cosmic reflections. Variant A: quiet central bands for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings, with ornament only at extreme edges and thin borders. React renders all cards, slots, counters, labels, buttons, badges, rings, gems, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyphs, card frames, card slots, deck silhouettes, controls, labels, rectangles, busy center.
```

### CC-PLAYER-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/player-zone/celestial-copper/player-zone-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG ultra-wide player rail that works anchored left for P1 or right for P2. Style: Celestial Copper, matte dark metal, copper side rails, faint constellation-like material seams near outer edges only. Variant B: broad calm center, mirror-safe edge ornaments, no implied card positions. React renders all cards, slots, counters, labels, buttons, badges, rings, gems, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyphs, card frames, card slots, deck silhouettes, controls, labels, rectangles, busy center.
```

### CC-GEM-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/gem-panel/celestial-copper/gem-panel-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG, front-facing orthographic square. Style: Celestial Copper, midnight metal board, oxidized copper grid grooves, soft blue edge light. Variant A: clear 5x5 empty wells with compact frame. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. React renders all gems, highlights, labels, counts, buttons, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyph writing, baked gem tokens, click markers, symbols inside cells, oversized frame, perspective skew.
```

### CC-GEM-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/gem-panel/celestial-copper/gem-panel-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG, front-facing orthographic square. Style: Celestial Copper, dark astral wells, copper separators, subtle star-metal edgework only outside the playfield. Variant B: lower-noise playable grid and strong empty-cell readability. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. React renders all gems, highlights, labels, counts, buttons, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyph writing, baked gem tokens, click markers, symbols inside cells, oversized frame, perspective skew.
```

### CC-L1-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l1/celestial-copper/market-card-back-l1-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Celestial Copper, same family as L2 and L3, dark metal field with simple oxidized copper border. Variant A: visibly lowest tier through restrained trim, few star-metal facets, quiet center. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### CC-L1-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l1/celestial-copper/market-card-back-l1-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Celestial Copper, matte midnight metal, minimal copper rim, faint abstract star-seam material marks. Variant B: alternate lowest-tier composition, simple and readable at 150x200 runtime size. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### CC-L2-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l2/celestial-copper/market-card-back-l2-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Celestial Copper, same silhouette as L1 and L3, dark star-metal core, layered copper border, controlled blue-copper glow. Variant A: visibly mid tier with more trim than L1 and less luxury than L3. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### CC-L2-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l2/celestial-copper/market-card-back-l2-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Celestial Copper, shared L1/L2/L3 frame language, midnight center, copper rails, restrained astral facets. Variant B: alternate mid-tier card back with moderate ornament and clean downsample readability. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### CC-L3-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l3/celestial-copper/market-card-back-l3-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Celestial Copper, same set as L1 and L2, ornate copper frame, deep indigo star-metal, high-prestige jewel facets. Variant A: most luxurious market tier through richer inlay density and controlled glow, still no readable symbols. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### CC-L3-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l3/celestial-copper/market-card-back-l3-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Celestial Copper, shared vertical silhouette with L1 and L2, layered copper frame, midnight star-metal center, polished blue-gold facets. Variant B: alternate highest-tier card back, elegant and high contrast at 150x200 runtime size. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### CC-ROYAL-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/royal-card-back/celestial-copper/royal-card-back-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG vertical prestige card back. Style: Celestial Copper, sovereign midnight metal, oxidized copper crown-like abstract material geometry, blue star-metal halo, deeper royal identity than market backs. Variant A: strong prestige frame with readable blank center and no baked UI. React renders royal labels, counts, hover states, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, literal labels, level marks, card face details.
```

### CC-ROYAL-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/royal-card-back/celestial-copper/royal-card-back-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG vertical prestige card back. Style: Celestial Copper, dark royal tablet, ornate copper court frame, luminous astral mantle, more ceremonial than market L3. Variant B: alternate sovereign composition with calm center and pronounced premium border. React renders royal labels, counts, hover states, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, literal labels, level marks, card face details.
```

### FA-SHELL-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/shell-background/frosted-amberglass/shell-background-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Frosted Amberglass, frosted translucent glass, pale amber resin inlay, satin silver rails, luminous but not white-washed. Variant A: clean premium table with subdued center and warmer amber atmosphere only at outer borders. React renders all labels, counts, gems, buttons, levels, score, rings, and UI affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, separate playmat, tablecloth slot, baked UI, busy center, overexposure.
```

### FA-SHELL-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/shell-background/frosted-amberglass/shell-background-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Frosted Amberglass, smoked frosted glass, amber edge resin, brushed silver trim, soft studio glow. Variant B: quieter alternate with broader matte center, translucent amber perimeter, and no implied UI panels. React renders all labels, counts, gems, buttons, levels, score, rings, and UI affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, separate playmat, tablecloth slot, baked UI, busy center, overexposure.
```

### FA-TOPBAR-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/topbar/frosted-amberglass/topbar-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG panoramic header strip. Style: Frosted Amberglass, frosted glass strip, amber resin edge, satin silver hairlines. Variant A: quiet readable overlay zones around 25%, 50%, and 75% width, ornament at ends and thin borders only. React renders scores, crowns, turn state, labels, icons, counts, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, central emblem blocking UI, dense center patterns, white wash.
```

### FA-TOPBAR-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/topbar/frosted-amberglass/topbar-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG panoramic header strip. Style: Frosted Amberglass, smoked translucent panel, amber glass glints near far edges, subtle silver rails. Variant B: low-noise header with clear readable zones at 25%, 50%, and 75% width. React renders scores, crowns, turn state, labels, icons, counts, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, central emblem blocking UI, dense center patterns, white wash.
```

### FA-PLAYER-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/player-zone/frosted-amberglass/player-zone-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG ultra-wide player rail that works anchored left for P1 or right for P2. Style: Frosted Amberglass, smoked frosted rail, amber resin corners, satin silver trim. Variant A: quiet central bands for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings, with ornament only at extreme edges and thin borders. React renders all cards, slots, counters, labels, buttons, badges, rings, gems, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyphs, card frames, card slots, deck silhouettes, controls, labels, rectangles, busy center.
```

### FA-PLAYER-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/player-zone/frosted-amberglass/player-zone-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG ultra-wide player rail that works anchored left for P1 or right for P2. Style: Frosted Amberglass, matte translucent glass, pale amber resin edge, cool silver separators. Variant B: broad calm center, edge-only ornament, mirror-safe for both players. React renders all cards, slots, counters, labels, buttons, badges, rings, gems, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyphs, card frames, card slots, deck silhouettes, controls, labels, rectangles, busy center.
```

### FA-GEM-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/gem-panel/frosted-amberglass/gem-panel-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG, front-facing orthographic square. Style: Frosted Amberglass, smoked glass board, amber resin grid grooves, satin silver rim. Variant A: clear 5x5 empty wells with compact frame. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. React renders all gems, highlights, labels, counts, buttons, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyph writing, baked gem tokens, click markers, symbols inside cells, oversized frame, perspective skew, white wash.
```

### FA-GEM-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/gem-panel/frosted-amberglass/gem-panel-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG, front-facing orthographic square. Style: Frosted Amberglass, darker frosted wells, amber separators, subtle silver edgework only outside playfield. Variant B: lower-noise playable grid and strong empty-cell readability. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. React renders all gems, highlights, labels, counts, buttons, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyph writing, baked gem tokens, click markers, symbols inside cells, oversized frame, perspective skew, white wash.
```

### FA-L1-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l1/frosted-amberglass/market-card-back-l1-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Frosted Amberglass, same family as L2 and L3, smoky glass field with simple amber-silver border. Variant A: visibly lowest tier through restrained trim, few glass facets, quiet center. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### FA-L1-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l1/frosted-amberglass/market-card-back-l1-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Frosted Amberglass, matte frosted card, minimal amber rim, faint silver edge. Variant B: alternate lowest-tier composition, simple and readable at 150x200 runtime size. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### FA-L2-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l2/frosted-amberglass/market-card-back-l2-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Frosted Amberglass, same silhouette as L1 and L3, smoked glass core, layered amber border, satin silver accents. Variant A: visibly mid tier with more trim than L1 and less luxury than L3. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### FA-L2-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l2/frosted-amberglass/market-card-back-l2-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Frosted Amberglass, shared L1/L2/L3 frame language, frosted center, amber rails, soft silver glints. Variant B: alternate mid-tier card back with moderate ornament and clean downsample readability. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### FA-L3-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l3/frosted-amberglass/market-card-back-l3-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Frosted Amberglass, same set as L1 and L2, ornate amberglass frame, smoky violet-gold core, high-prestige glass facets. Variant A: most luxurious market tier through richer inlay density and controlled glow. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### FA-L3-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l3/frosted-amberglass/market-card-back-l3-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Frosted Amberglass, shared silhouette with L1 and L2, layered amber-silver frame, smoked glass center, polished facets. Variant B: alternate highest-tier card back, elegant and high contrast at 150x200 runtime size. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### FA-ROYAL-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/royal-card-back/frosted-amberglass/royal-card-back-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG vertical prestige card back. Style: Frosted Amberglass, sovereign smoked glass tablet, amber crown-like abstract material geometry, satin silver halo, deeper royal identity than market backs. Variant A: prestige frame with readable blank center and no baked UI. React renders royal labels, counts, hover states, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, literal labels, level marks, card face details.
```

### FA-ROYAL-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/royal-card-back/frosted-amberglass/royal-card-back-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG vertical prestige card back. Style: Frosted Amberglass, amberglass royal tablet, ornate silver court frame, luminous glass mantle, more ceremonial than market L3. Variant B: alternate sovereign composition with calm center and pronounced premium border. React renders royal labels, counts, hover states, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, literal labels, level marks, card face details.
```

### MA-SHELL-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/shell-background/moss-agate/shell-background-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Moss Agate, deep green agate slab, mossy mineral veins, antique silver rails, organic calm with precise premium board-game finish. Variant A: low-noise center with richer mineral texture at corners and outer borders. React renders all labels, counts, gems, buttons, levels, score, rings, and UI affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, separate playmat, tablecloth slot, baked UI, busy center.
```

### MA-SHELL-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/shell-background/moss-agate/shell-background-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Moss Agate, dark green agate table, smoky moss inclusions, tarnished silver edge channels. Variant B: broader matte center, stronger stone character near perimeter, no implied UI panels. React renders all labels, counts, gems, buttons, levels, score, rings, and UI affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, separate playmat, tablecloth slot, baked UI, busy center.
```

### MA-TOPBAR-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/topbar/moss-agate/topbar-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG panoramic header strip. Style: Moss Agate, deep green stone strip, antique silver trim, mossy veins near ends only. Variant A: quiet readable overlay zones around 25%, 50%, and 75% width, decoration pushed to edges and thin borders. React renders scores, crowns, turn state, labels, icons, counts, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, central emblem blocking UI, dense center patterns.
```

### MA-TOPBAR-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/topbar/moss-agate/topbar-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG panoramic header strip. Style: Moss Agate, dark mineral panel, thin silver rails, subtle green agate edge glow. Variant B: especially calm middle strip and readable zones at 25%, 50%, and 75% width. React renders scores, crowns, turn state, labels, icons, counts, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, central emblem blocking UI, dense center patterns.
```

### MA-PLAYER-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/player-zone/moss-agate/player-zone-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG ultra-wide player rail that works anchored left for P1 or right for P2. Style: Moss Agate, deep green stone rail, antique silver edgework, soft moss-mineral texture. Variant A: quiet central bands for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings, with ornament only at extreme edges and thin borders. React renders all cards, slots, counters, labels, buttons, badges, rings, gems, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyphs, card frames, card slots, deck silhouettes, controls, labels, rectangles, busy center.
```

### MA-PLAYER-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/player-zone/moss-agate/player-zone-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG ultra-wide player rail that works anchored left for P1 or right for P2. Style: Moss Agate, matte agate surface, tarnished silver side rails, subdued organic veining only near edges. Variant B: broad calm center, edge-only ornament, mirror-safe for both players. React renders all cards, slots, counters, labels, buttons, badges, rings, gems, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyphs, card frames, card slots, deck silhouettes, controls, labels, rectangles, busy center.
```

### MA-GEM-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/gem-panel/moss-agate/gem-panel-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG, front-facing orthographic square. Style: Moss Agate, deep green agate board, antique silver grid grooves, subtle moss texture outside cells. Variant A: clear 5x5 empty wells with compact frame. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. React renders all gems, highlights, labels, counts, buttons, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyph writing, baked gem tokens, click markers, symbols inside cells, oversized frame, perspective skew.
```

### MA-GEM-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/gem-panel/moss-agate/gem-panel-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG, front-facing orthographic square. Style: Moss Agate, darker green wells, silver separators, quiet agate frame only outside playfield. Variant B: lower-noise playable grid and strong empty-cell readability. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. React renders all gems, highlights, labels, counts, buttons, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyph writing, baked gem tokens, click markers, symbols inside cells, oversized frame, perspective skew.
```

### MA-L1-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l1/moss-agate/market-card-back-l1-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Moss Agate, same family as L2 and L3, deep green agate field with simple antique silver border. Variant A: visibly lowest tier through restrained trim, few mineral facets, quiet center. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### MA-L1-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l1/moss-agate/market-card-back-l1-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Moss Agate, matte green stone, minimal silver rim, faint organic mineral veins. Variant B: alternate lowest-tier composition, simple and readable at 150x200 runtime size. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### MA-L2-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l2/moss-agate/market-card-back-l2-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Moss Agate, same silhouette as L1 and L3, agate core, layered silver border, controlled emerald glow. Variant A: visibly mid tier with more trim than L1 and less luxury than L3. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### MA-L2-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l2/moss-agate/market-card-back-l2-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Moss Agate, shared L1/L2/L3 frame language, green mineral center, silver rails, soft mossy facets. Variant B: alternate mid-tier card back with moderate ornament and clean downsample readability. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### MA-L3-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l3/moss-agate/market-card-back-l3-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Moss Agate, same set as L1 and L2, ornate antique silver frame, deep agate center, high-prestige emerald facets. Variant A: most luxurious market tier through richer inlay density and controlled glow. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### MA-L3-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l3/moss-agate/market-card-back-l3-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Moss Agate, shared silhouette with L1 and L2, layered silver-green frame, dark agate center, polished mineral facets. Variant B: alternate highest-tier card back, elegant and high contrast at 150x200 runtime size. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### MA-ROYAL-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/royal-card-back/moss-agate/royal-card-back-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG vertical prestige card back. Style: Moss Agate, sovereign green agate tablet, antique silver crown-like abstract material geometry, deeper royal identity than market backs. Variant A: strong prestige frame with readable blank center and no baked UI. React renders royal labels, counts, hover states, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, literal labels, level marks, card face details.
```

### MA-ROYAL-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/royal-card-back/moss-agate/royal-card-back-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG vertical prestige card back. Style: Moss Agate, dark agate royal tablet, ornate silver court frame, emerald mineral mantle, more ceremonial than market L3. Variant B: alternate sovereign composition with calm center and pronounced premium border. React renders royal labels, counts, hover states, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, literal labels, level marks, card face details.
```

### NP-SHELL-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/shell-background/nocturne-pearl/shell-background-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Nocturne Pearl, black pearl tabletop, moonlit shell sheen, platinum rails, soft violet-blue reflections, high prestige. Variant A: calm low-noise center and richer pearlescent atmosphere only at corners and outer borders. React renders all labels, counts, gems, buttons, levels, score, rings, and UI affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, separate playmat, tablecloth slot, baked UI, busy center, overbright glare.
```

### NP-SHELL-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/shell-background/nocturne-pearl/shell-background-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background. Create exact 3840x2160 PNG artwork for the single full-board table surface behind the centered gameplay stage. Style: Nocturne Pearl, smoky black shell, platinum edge channels, moonlit pearl reflections, subdued violet-blue rim light. Variant B: broader matte center, stronger pearl texture near perimeter, no implied UI panels. React renders all labels, counts, gems, buttons, levels, score, rings, and UI affordances. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, separate playmat, tablecloth slot, baked UI, busy center, overbright glare.
```

### NP-TOPBAR-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/topbar/nocturne-pearl/topbar-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG panoramic header strip. Style: Nocturne Pearl, black pearl strip, platinum trim, soft violet-blue sheen near ends only. Variant A: quiet readable overlay zones around 25%, 50%, and 75% width, decoration pushed to edges and thin borders. React renders scores, crowns, turn state, labels, icons, counts, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, central emblem blocking UI, dense center patterns, high glare.
```

### NP-TOPBAR-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/topbar/nocturne-pearl/topbar-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin. Create exact 3840x360 PNG panoramic header strip. Style: Nocturne Pearl, smoky pearl panel, platinum hairlines, moonlit shell glints at far edges. Variant B: especially calm middle strip and readable zones at 25%, 50%, and 75% width. React renders scores, crowns, turn state, labels, icons, counts, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyph writing, central emblem blocking UI, dense center patterns, high glare.
```

### NP-PLAYER-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/player-zone/nocturne-pearl/player-zone-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG ultra-wide player rail that works anchored left for P1 or right for P2. Style: Nocturne Pearl, black pearl rail, platinum edgework, moonlit violet-blue reflections. Variant A: quiet central bands for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings, with ornament only at extreme edges and thin borders. React renders all cards, slots, counters, labels, buttons, badges, rings, gems, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyphs, card frames, card slots, deck silhouettes, controls, labels, rectangles, busy center.
```

### NP-PLAYER-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/player-zone/nocturne-pearl/player-zone-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone rail. Create exact 3840x520 PNG ultra-wide player rail that works anchored left for P1 or right for P2. Style: Nocturne Pearl, matte black shell surface, platinum side rails, subdued pearlescent flow near edges only. Variant B: broad calm center, edge-only ornament, mirror-safe for both players. React renders all cards, slots, counters, labels, buttons, badges, rings, gems, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyphs, card frames, card slots, deck silhouettes, controls, labels, rectangles, busy center.
```

### NP-GEM-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/gem-panel/nocturne-pearl/gem-panel-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG, front-facing orthographic square. Style: Nocturne Pearl, black pearl board, platinum grid grooves, moonlit shell edge light. Variant A: clear 5x5 empty wells with compact frame. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. React renders all gems, highlights, labels, counts, buttons, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyph writing, baked gem tokens, click markers, symbols inside cells, oversized frame, perspective skew.
```

### NP-GEM-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/gem-panel/nocturne-pearl/gem-panel-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate. Create exact 1254x1254 PNG, front-facing orthographic square. Style: Nocturne Pearl, darker pearl wells, platinum separators, soft violet-blue sheen only outside playfield. Variant B: lower-noise playable grid and strong empty-cell readability. Geometry is strict: visual vertical grid lines at x=100,305,515,726,938,1141 and horizontal grid lines at y=104,308,512,717,917,1132. React renders all gems, highlights, labels, counts, buttons, and text. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyph writing, baked gem tokens, click markers, symbols inside cells, oversized frame, perspective skew.
```

### NP-L1-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l1/nocturne-pearl/market-card-back-l1-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Nocturne Pearl, same family as L2 and L3, black pearl field with simple platinum border. Variant A: visibly lowest tier through restrained trim, few pearl facets, quiet center. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### NP-L1-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l1/nocturne-pearl/market-card-back-l1-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Nocturne Pearl, matte black shell, minimal platinum rim, faint pearl sheen. Variant B: alternate lowest-tier composition, simple and readable at 150x200 runtime size. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### NP-L2-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l2/nocturne-pearl/market-card-back-l2-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Nocturne Pearl, same silhouette as L1 and L3, black pearl core, layered platinum border, controlled violet-blue glow. Variant A: visibly mid tier with more trim than L1 and less luxury than L3. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### NP-L2-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l2/nocturne-pearl/market-card-back-l2-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Nocturne Pearl, shared L1/L2/L3 frame language, dark shell center, platinum rails, soft pearl facets. Variant B: alternate mid-tier card back with moderate ornament and clean downsample readability. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### NP-L3-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l3/nocturne-pearl/market-card-back-l3-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Nocturne Pearl, same set as L1 and L2, ornate platinum frame, black pearl center, high-prestige violet-blue facets. Variant A: most luxurious market tier through richer inlay density and controlled glow. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### NP-L3-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/market-card-back-l3/nocturne-pearl/market-card-back-l3-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3. Create exact 1086x1448 PNG vertical card-back artwork on the featured-card sample canvas. Style: Nocturne Pearl, shared silhouette with L1 and L2, layered platinum-pearl frame, dark shell center, polished moonlit facets. Variant B: alternate highest-tier card back, elegant and high contrast at 150x200 runtime size. React renders level, count, labels, hover, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, baked UI, level marks, badges, card face details.
```

### NP-ROYAL-A

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/royal-card-back/nocturne-pearl/royal-card-back-a.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG vertical prestige card back. Style: Nocturne Pearl, sovereign black pearl tablet, platinum crown-like abstract material geometry, moonlit halo, deeper royal identity than market backs. Variant A: strong prestige frame with readable blank center and no baked UI. React renders royal labels, counts, hover states, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, literal labels, level marks, card face details.
```

### NP-ROYAL-B

Archive filename: `assets/art-library/surface-autonomous-prismatic-styles-candidates/2026-04-27/royal-card-back/nocturne-pearl/royal-card-back-b.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back. Create exact 1086x1448 PNG vertical prestige card back. Style: Nocturne Pearl, dark pearl royal tablet, ornate platinum court frame, violet-blue shell mantle, more ceremonial than market L3. Variant B: alternate sovereign composition with calm center and pronounced premium border. React renders royal labels, counts, hover states, and text later. Avoid text, numbers, Chinese, English, Roman numerals, logos, watermarks, readable scripts, fake alphabets, fake glyphs, literal labels, level marks, card face details.
```
