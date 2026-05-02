# Surface Asset Autonomous New Styles Prompt Manifest - 2026-04-27

## Source Constraints

This manifest expands the autonomous GemDuel surface-art candidate library with four new style groups, per the user clarification that new styles are allowed and not limited to the existing four runtime themes.

This remains a candidate-library pass only: do not overwrite runtime files under `apps/desktop/public/assets/surfaces`, do not change code, and do not add preview routes.

Confirmed constraints from the current repo:

- Shell background is the single full-board table surface; no playmat/tablecloth slot.
- TopBar uses a 120px logical header and needs quiet overlay zones near 25%, 50%, and 75% width.
- PlayerZone art must work left-anchored for P1 and right-anchored for P2; no baked card slots, card frames, controls, labels, or numbers.
- GemPanel canvas is `1254x1254`; visual grid lines must land at x=`100,305,515,726,938,1141` and y=`104,308,512,717,917,1132`.
- Market and royal card backs use `FEATURED_CARD_SAMPLE_SIZE` `1086x1448` and downsample into `FEATURED_CARD_SIZE` `150x200`.
- React renders all labels, counts, levels, gems, buttons, hover rings, selection states, and gameplay affordances.
- Global avoid list: no text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked gems, baked UI, labels, counters, card-slot silhouettes, or click markers.

## Output Locations

- Prompt manifest: `docs/art/surface-asset-autonomous-new-styles-prompts-2026-04-27.md`
- Scoring report: `docs/art/surface-asset-autonomous-new-styles-library-2026-04-27.md`
- Candidate archive root: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/`

## Style Groups

| Style           | Display name  | Recipe                                                                                                                         |
| --------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `moonlit-jade`  | Moonlit Jade  | dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing |
| `ember-forge`   | Ember Forge   | dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials           |
| `pearl-opaline` | Pearl Opaline | opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material             |
| `neon-noir`     | Neon Noir     | dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs               |

## Slot Targets

| Slot                  | Required archive filename |    Target |
| --------------------- | ------------------------- | --------: |
| `shell-background`    | `shell-background.png`    | 3840x2160 |
| `topbar`              | `topbar.png`              |  3840x360 |
| `player-zone`         | `player-zone.png`         |  3840x520 |
| `gem-panel`           | `gem-panel.png`           | 1254x1254 |
| `market-card-back-l1` | `market-card-back-l1.png` | 1086x1448 |
| `market-card-back-l2` | `market-card-back-l2.png` | 1086x1448 |
| `market-card-back-l3` | `market-card-back-l3.png` | 1086x1448 |
| `royal-card-back`     | `royal-card-back.png`     | 1086x1448 |

## Prompt Manifest

### moonlit-jade-shell-background-a

- Slot: `shell-background`
- Style: `moonlit-jade`
- Variant: `a`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/moonlit-jade/a/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Moonlit Jade full-board table surface for GemDuel. This is the single shell background behind the centered gameplay stage, not a playmat or tablecloth.
Scene/backdrop: moonlit jade and black lacquer full-board table, celadon stone edge pieces, brushed silver inlay, cool teal moon highlights.
Style/medium: premium game UI surface, dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing.
Composition/framing: 16:9 full-board table surface. Keep the centered gameplay stage area subdued and low-noise; stronger atmosphere may sit at edges, corners, and perimeter trim only. No separate playmat rectangle or center-panel background.
Lighting/mood: controlled readable contrast, material depth, no overexposed center. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, cards, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, card slots, deck silhouettes, separate tablecloth, separate playmat.
```

### moonlit-jade-shell-background-b

- Slot: `shell-background`
- Style: `moonlit-jade`
- Variant: `b`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/moonlit-jade/b/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Moonlit Jade full-board table surface for GemDuel. This is the single shell background behind the centered gameplay stage, not a playmat or tablecloth.
Scene/backdrop: moonlit jade and black lacquer full-board table, celadon stone edge pieces, brushed silver inlay, cool teal moon highlights.
Style/medium: premium game UI surface, dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing.
Composition/framing: 16:9 full-board table surface. Keep the centered gameplay stage area subdued and low-noise; stronger atmosphere may sit at edges, corners, and perimeter trim only. No separate playmat rectangle or center-panel background.
Lighting/mood: controlled readable contrast, material depth, no overexposed center. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, cards, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, card slots, deck silhouettes, separate tablecloth, separate playmat.
```

### moonlit-jade-topbar-a

- Slot: `topbar`
- Style: `moonlit-jade`
- Variant: `a`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/topbar/moonlit-jade/a/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Moonlit Jade panoramic header strip for the 120px logical TopBar.
Scene/backdrop: jade and black lacquer header rail, brushed silver border, cool moonlit teal accents.
Style/medium: premium game UI header strip, dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing.
Composition/framing: ultra-wide strip with quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
Lighting/mood: controlled contrast, no central glare, no bright wash over overlay zones. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, central emblem blocking overlay zones, badge shapes that look like UI.
```

### moonlit-jade-topbar-b

- Slot: `topbar`
- Style: `moonlit-jade`
- Variant: `b`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/topbar/moonlit-jade/b/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Moonlit Jade panoramic header strip for the 120px logical TopBar.
Scene/backdrop: jade and black lacquer header rail, brushed silver border, cool moonlit teal accents.
Style/medium: premium game UI header strip, dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing.
Composition/framing: ultra-wide strip with quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
Lighting/mood: controlled contrast, no central glare, no bright wash over overlay zones. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, central emblem blocking overlay zones, badge shapes that look like UI.
```

### moonlit-jade-player-zone-a

- Slot: `player-zone`
- Style: `moonlit-jade`
- Variant: `a`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/player-zone/moonlit-jade/a/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Moonlit Jade ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: jade-lacquer player rail, celadon stone surface, silver edge trim, cool teal highlights.
Style/medium: premium game UI environment rail, dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing.
Composition/framing: ultra-wide horizontal band with quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration belongs only near extreme edges, corners, and thin top/bottom borders.
Lighting/mood: readable center lanes, controlled edge highlights. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked card frames, card slots, deck silhouettes, placeholder rectangles, fake controls, labels, numbers.
```

### moonlit-jade-player-zone-b

- Slot: `player-zone`
- Style: `moonlit-jade`
- Variant: `b`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/player-zone/moonlit-jade/b/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Moonlit Jade ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: jade-lacquer player rail, celadon stone surface, silver edge trim, cool teal highlights.
Style/medium: premium game UI environment rail, dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing.
Composition/framing: ultra-wide horizontal band with quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration belongs only near extreme edges, corners, and thin top/bottom borders.
Lighting/mood: readable center lanes, controlled edge highlights. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked card frames, card slots, deck silhouettes, placeholder rectangles, fake controls, labels, numbers.
```

### moonlit-jade-gem-panel-a

- Slot: `gem-panel`
- Style: `moonlit-jade`
- Variant: `a`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/gem-panel/moonlit-jade/a/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Moonlit Jade square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: celadon jade board substrate, black lacquer outer frame, brushed silver dividers, cool moonlit edge highlights.
Style/medium: premium board-game UI panel, dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame; no perspective skew.
Lighting/mood: controlled edge highlights, readable cells, no overexposure. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all gems, labels, counts, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked gems, gem tokens, cell icons, click markers, selection rings, symbols inside cells, oversized border.
```

### moonlit-jade-gem-panel-b

- Slot: `gem-panel`
- Style: `moonlit-jade`
- Variant: `b`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/gem-panel/moonlit-jade/b/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Moonlit Jade square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: celadon jade board substrate, black lacquer outer frame, brushed silver dividers, cool moonlit edge highlights.
Style/medium: premium board-game UI panel, dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame; no perspective skew.
Lighting/mood: controlled edge highlights, readable cells, no overexposure. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all gems, labels, counts, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked gems, gem tokens, cell icons, click markers, selection rings, symbols inside cells, oversized border.
```

### moonlit-jade-market-card-back-l1-a

- Slot: `market-card-back-l1`
- Style: `moonlit-jade`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l1/moonlit-jade/a/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier, visibly simplest in the L1/L2/L3 set for the Moonlit Jade market card-back family.
Scene/backdrop: jade lacquer card back, brushed silver frame, celadon inlay, cool teal jewel accents.
Style/medium: premium vertical card-back illustration, dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use simple trim, modest accent density, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### moonlit-jade-market-card-back-l1-b

- Slot: `market-card-back-l1`
- Style: `moonlit-jade`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l1/moonlit-jade/b/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier, visibly simplest in the L1/L2/L3 set for the Moonlit Jade market card-back family.
Scene/backdrop: jade lacquer card back, brushed silver frame, celadon inlay, cool teal jewel accents.
Style/medium: premium vertical card-back illustration, dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use simple trim, modest accent density, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### moonlit-jade-market-card-back-l2-a

- Slot: `market-card-back-l2`
- Style: `moonlit-jade`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l2/moonlit-jade/a/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier, richer than L1 but less luxurious than L3 for the Moonlit Jade market card-back family.
Scene/backdrop: jade lacquer card back, brushed silver frame, celadon inlay, cool teal jewel accents.
Style/medium: premium vertical card-back illustration, dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use moderate ornament density, mid-tier accent material, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### moonlit-jade-market-card-back-l2-b

- Slot: `market-card-back-l2`
- Style: `moonlit-jade`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l2/moonlit-jade/b/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier, richer than L1 but less luxurious than L3 for the Moonlit Jade market card-back family.
Scene/backdrop: jade lacquer card back, brushed silver frame, celadon inlay, cool teal jewel accents.
Style/medium: premium vertical card-back illustration, dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use moderate ornament density, mid-tier accent material, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### moonlit-jade-market-card-back-l3-a

- Slot: `market-card-back-l3`
- Style: `moonlit-jade`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l3/moonlit-jade/a/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier, most luxurious in the L1/L2/L3 set with the strongest prestige accents for the Moonlit Jade market card-back family.
Scene/backdrop: jade lacquer card back, brushed silver frame, celadon inlay, cool teal jewel accents.
Style/medium: premium vertical card-back illustration, dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use richest trim, highest jewel density, strongest controlled glow, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### moonlit-jade-market-card-back-l3-b

- Slot: `market-card-back-l3`
- Style: `moonlit-jade`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l3/moonlit-jade/b/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier, most luxurious in the L1/L2/L3 set with the strongest prestige accents for the Moonlit Jade market card-back family.
Scene/backdrop: jade lacquer card back, brushed silver frame, celadon inlay, cool teal jewel accents.
Style/medium: premium vertical card-back illustration, dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use richest trim, highest jewel density, strongest controlled glow, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### moonlit-jade-royal-card-back-a

- Slot: `royal-card-back`
- Style: `moonlit-jade`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/royal-card-back/moonlit-jade/a/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create a Moonlit Jade sovereign prestige card back for RoyalCourt previews, stronger and more ceremonial than the market backs.
Scene/backdrop: sovereign jade-and-silver card back, black lacquer depth, moonlit court prestige without symbols.
Style/medium: premium royal card-back illustration, dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing.
Composition/framing: full vertical prestige card back with a powerful sovereign identity, ornate frame, and readable calm center. No baked gameplay UI.
Lighting/mood: controlled prestige glow, readable at 150x200 display, not washed out. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all RoyalCourt labels, card details, counts, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, readable royal text, baked gems, controls, excessive clutter.
```

### moonlit-jade-royal-card-back-b

- Slot: `royal-card-back`
- Style: `moonlit-jade`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/royal-card-back/moonlit-jade/b/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create a Moonlit Jade sovereign prestige card back for RoyalCourt previews, stronger and more ceremonial than the market backs.
Scene/backdrop: sovereign jade-and-silver card back, black lacquer depth, moonlit court prestige without symbols.
Style/medium: premium royal card-back illustration, dark moonlit jade, celadon stone, black lacquer, brushed silver, cool teal highlights, refined tabletop luxury without writing.
Composition/framing: full vertical prestige card back with a powerful sovereign identity, ornate frame, and readable calm center. No baked gameplay UI.
Lighting/mood: controlled prestige glow, readable at 150x200 display, not washed out. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all RoyalCourt labels, card details, counts, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, readable royal text, baked gems, controls, excessive clutter.
```

### ember-forge-shell-background-a

- Slot: `shell-background`
- Style: `ember-forge`
- Variant: `a`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/ember-forge/a/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Ember Forge full-board table surface for GemDuel. This is the single shell background behind the centered gameplay stage, not a playmat or tablecloth.
Scene/backdrop: obsidian forge table, cooled lava stone, hammered dark metal, copper-brass edge trim, ember glow at far edges.
Style/medium: premium game UI surface, dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials.
Composition/framing: 16:9 full-board table surface. Keep the centered gameplay stage area subdued and low-noise; stronger atmosphere may sit at edges, corners, and perimeter trim only. No separate playmat rectangle or center-panel background.
Lighting/mood: controlled readable contrast, material depth, no overexposed center. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, cards, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, card slots, deck silhouettes, separate tablecloth, separate playmat.
```

### ember-forge-shell-background-b

- Slot: `shell-background`
- Style: `ember-forge`
- Variant: `b`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/ember-forge/b/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Ember Forge full-board table surface for GemDuel. This is the single shell background behind the centered gameplay stage, not a playmat or tablecloth.
Scene/backdrop: obsidian forge table, cooled lava stone, hammered dark metal, copper-brass edge trim, ember glow at far edges.
Style/medium: premium game UI surface, dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials.
Composition/framing: 16:9 full-board table surface. Keep the centered gameplay stage area subdued and low-noise; stronger atmosphere may sit at edges, corners, and perimeter trim only. No separate playmat rectangle or center-panel background.
Lighting/mood: controlled readable contrast, material depth, no overexposed center. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, cards, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, card slots, deck silhouettes, separate tablecloth, separate playmat.
```

### ember-forge-topbar-a

- Slot: `topbar`
- Style: `ember-forge`
- Variant: `a`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/topbar/ember-forge/a/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Ember Forge panoramic header strip for the 120px logical TopBar.
Scene/backdrop: forged metal header strip, copper rails, dark stone base, subtle ember highlights at corners.
Style/medium: premium game UI header strip, dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials.
Composition/framing: ultra-wide strip with quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
Lighting/mood: controlled contrast, no central glare, no bright wash over overlay zones. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, central emblem blocking overlay zones, badge shapes that look like UI.
```

### ember-forge-topbar-b

- Slot: `topbar`
- Style: `ember-forge`
- Variant: `b`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/topbar/ember-forge/b/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Ember Forge panoramic header strip for the 120px logical TopBar.
Scene/backdrop: forged metal header strip, copper rails, dark stone base, subtle ember highlights at corners.
Style/medium: premium game UI header strip, dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials.
Composition/framing: ultra-wide strip with quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
Lighting/mood: controlled contrast, no central glare, no bright wash over overlay zones. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, central emblem blocking overlay zones, badge shapes that look like UI.
```

### ember-forge-player-zone-a

- Slot: `player-zone`
- Style: `ember-forge`
- Variant: `a`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/player-zone/ember-forge/a/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Ember Forge ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: hammered metal and cooled lava player rail, copper edge trim, ember rim light only at extremes.
Style/medium: premium game UI environment rail, dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials.
Composition/framing: ultra-wide horizontal band with quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration belongs only near extreme edges, corners, and thin top/bottom borders.
Lighting/mood: readable center lanes, controlled edge highlights. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked card frames, card slots, deck silhouettes, placeholder rectangles, fake controls, labels, numbers.
```

### ember-forge-player-zone-b

- Slot: `player-zone`
- Style: `ember-forge`
- Variant: `b`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/player-zone/ember-forge/b/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Ember Forge ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: hammered metal and cooled lava player rail, copper edge trim, ember rim light only at extremes.
Style/medium: premium game UI environment rail, dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials.
Composition/framing: ultra-wide horizontal band with quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration belongs only near extreme edges, corners, and thin top/bottom borders.
Lighting/mood: readable center lanes, controlled edge highlights. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked card frames, card slots, deck silhouettes, placeholder rectangles, fake controls, labels, numbers.
```

### ember-forge-gem-panel-a

- Slot: `gem-panel`
- Style: `ember-forge`
- Variant: `a`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/gem-panel/ember-forge/a/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Ember Forge square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: dark forge-stone board substrate, copper separators, compact hammered metal frame, ember glow outside cells only.
Style/medium: premium board-game UI panel, dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame; no perspective skew.
Lighting/mood: controlled edge highlights, readable cells, no overexposure. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all gems, labels, counts, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked gems, gem tokens, cell icons, click markers, selection rings, symbols inside cells, oversized border.
```

### ember-forge-gem-panel-b

- Slot: `gem-panel`
- Style: `ember-forge`
- Variant: `b`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/gem-panel/ember-forge/b/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Ember Forge square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: dark forge-stone board substrate, copper separators, compact hammered metal frame, ember glow outside cells only.
Style/medium: premium board-game UI panel, dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame; no perspective skew.
Lighting/mood: controlled edge highlights, readable cells, no overexposure. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all gems, labels, counts, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked gems, gem tokens, cell icons, click markers, selection rings, symbols inside cells, oversized border.
```

### ember-forge-market-card-back-l1-a

- Slot: `market-card-back-l1`
- Style: `ember-forge`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l1/ember-forge/a/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier, visibly simplest in the L1/L2/L3 set for the Ember Forge market card-back family.
Scene/backdrop: forged metal card back, copper trim, dark stone center, ember accents.
Style/medium: premium vertical card-back illustration, dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use simple trim, modest accent density, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### ember-forge-market-card-back-l1-b

- Slot: `market-card-back-l1`
- Style: `ember-forge`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l1/ember-forge/b/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier, visibly simplest in the L1/L2/L3 set for the Ember Forge market card-back family.
Scene/backdrop: forged metal card back, copper trim, dark stone center, ember accents.
Style/medium: premium vertical card-back illustration, dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use simple trim, modest accent density, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### ember-forge-market-card-back-l2-a

- Slot: `market-card-back-l2`
- Style: `ember-forge`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l2/ember-forge/a/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier, richer than L1 but less luxurious than L3 for the Ember Forge market card-back family.
Scene/backdrop: forged metal card back, copper trim, dark stone center, ember accents.
Style/medium: premium vertical card-back illustration, dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use moderate ornament density, mid-tier accent material, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### ember-forge-market-card-back-l2-b

- Slot: `market-card-back-l2`
- Style: `ember-forge`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l2/ember-forge/b/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier, richer than L1 but less luxurious than L3 for the Ember Forge market card-back family.
Scene/backdrop: forged metal card back, copper trim, dark stone center, ember accents.
Style/medium: premium vertical card-back illustration, dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use moderate ornament density, mid-tier accent material, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### ember-forge-market-card-back-l3-a

- Slot: `market-card-back-l3`
- Style: `ember-forge`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l3/ember-forge/a/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier, most luxurious in the L1/L2/L3 set with the strongest prestige accents for the Ember Forge market card-back family.
Scene/backdrop: forged metal card back, copper trim, dark stone center, ember accents.
Style/medium: premium vertical card-back illustration, dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use richest trim, highest jewel density, strongest controlled glow, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### ember-forge-market-card-back-l3-b

- Slot: `market-card-back-l3`
- Style: `ember-forge`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l3/ember-forge/b/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier, most luxurious in the L1/L2/L3 set with the strongest prestige accents for the Ember Forge market card-back family.
Scene/backdrop: forged metal card back, copper trim, dark stone center, ember accents.
Style/medium: premium vertical card-back illustration, dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use richest trim, highest jewel density, strongest controlled glow, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### ember-forge-royal-card-back-a

- Slot: `royal-card-back`
- Style: `ember-forge`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/royal-card-back/ember-forge/a/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create a Ember Forge sovereign prestige card back for RoyalCourt previews, stronger and more ceremonial than the market backs.
Scene/backdrop: sovereign forged-metal card back, dark obsidian, rich copper-brass prestige frame, controlled ember jewels.
Style/medium: premium royal card-back illustration, dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials.
Composition/framing: full vertical prestige card back with a powerful sovereign identity, ornate frame, and readable calm center. No baked gameplay UI.
Lighting/mood: controlled prestige glow, readable at 150x200 display, not washed out. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all RoyalCourt labels, card details, counts, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, readable royal text, baked gems, controls, excessive clutter.
```

### ember-forge-royal-card-back-b

- Slot: `royal-card-back`
- Style: `ember-forge`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/royal-card-back/ember-forge/b/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create a Ember Forge sovereign prestige card back for RoyalCourt previews, stronger and more ceremonial than the market backs.
Scene/backdrop: sovereign forged-metal card back, dark obsidian, rich copper-brass prestige frame, controlled ember jewels.
Style/medium: premium royal card-back illustration, dark forged metal, cooled lava stone, copper and brass trim, ember glow at edges, tactile heavy board-game materials.
Composition/framing: full vertical prestige card back with a powerful sovereign identity, ornate frame, and readable calm center. No baked gameplay UI.
Lighting/mood: controlled prestige glow, readable at 150x200 display, not washed out. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all RoyalCourt labels, card details, counts, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, readable royal text, baked gems, controls, excessive clutter.
```

### pearl-opaline-shell-background-a

- Slot: `shell-background`
- Style: `pearl-opaline`
- Variant: `a`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/pearl-opaline/a/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Pearl Opaline full-board table surface for GemDuel. This is the single shell background behind the centered gameplay stage, not a playmat or tablecloth.
Scene/backdrop: opaline pearl tabletop, frosted glass edge materials, champagne silver trim, pale aqua and rose highlights.
Style/medium: premium game UI surface, opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material.
Composition/framing: 16:9 full-board table surface. Keep the centered gameplay stage area subdued and low-noise; stronger atmosphere may sit at edges, corners, and perimeter trim only. No separate playmat rectangle or center-panel background.
Lighting/mood: controlled readable contrast, material depth, no overexposed center. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, cards, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, card slots, deck silhouettes, separate tablecloth, separate playmat.
```

### pearl-opaline-shell-background-b

- Slot: `shell-background`
- Style: `pearl-opaline`
- Variant: `b`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/pearl-opaline/b/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Pearl Opaline full-board table surface for GemDuel. This is the single shell background behind the centered gameplay stage, not a playmat or tablecloth.
Scene/backdrop: opaline pearl tabletop, frosted glass edge materials, champagne silver trim, pale aqua and rose highlights.
Style/medium: premium game UI surface, opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material.
Composition/framing: 16:9 full-board table surface. Keep the centered gameplay stage area subdued and low-noise; stronger atmosphere may sit at edges, corners, and perimeter trim only. No separate playmat rectangle or center-panel background.
Lighting/mood: controlled readable contrast, material depth, no overexposed center. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, cards, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, card slots, deck silhouettes, separate tablecloth, separate playmat.
```

### pearl-opaline-topbar-a

- Slot: `topbar`
- Style: `pearl-opaline`
- Variant: `a`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/topbar/pearl-opaline/a/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Pearl Opaline panoramic header strip for the 120px logical TopBar.
Scene/backdrop: frosted opal header strip, pearl surface, champagne silver border, restrained aqua and rose edge light.
Style/medium: premium game UI header strip, opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material.
Composition/framing: ultra-wide strip with quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
Lighting/mood: controlled contrast, no central glare, no bright wash over overlay zones. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, central emblem blocking overlay zones, badge shapes that look like UI.
```

### pearl-opaline-topbar-b

- Slot: `topbar`
- Style: `pearl-opaline`
- Variant: `b`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/topbar/pearl-opaline/b/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Pearl Opaline panoramic header strip for the 120px logical TopBar.
Scene/backdrop: frosted opal header strip, pearl surface, champagne silver border, restrained aqua and rose edge light.
Style/medium: premium game UI header strip, opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material.
Composition/framing: ultra-wide strip with quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
Lighting/mood: controlled contrast, no central glare, no bright wash over overlay zones. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, central emblem blocking overlay zones, badge shapes that look like UI.
```

### pearl-opaline-player-zone-a

- Slot: `player-zone`
- Style: `pearl-opaline`
- Variant: `a`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/player-zone/pearl-opaline/a/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Pearl Opaline ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: pearl opaline player rail, frosted glass and champagne silver trim, calm luminous center lanes.
Style/medium: premium game UI environment rail, opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material.
Composition/framing: ultra-wide horizontal band with quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration belongs only near extreme edges, corners, and thin top/bottom borders.
Lighting/mood: readable center lanes, controlled edge highlights. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked card frames, card slots, deck silhouettes, placeholder rectangles, fake controls, labels, numbers.
```

### pearl-opaline-player-zone-b

- Slot: `player-zone`
- Style: `pearl-opaline`
- Variant: `b`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/player-zone/pearl-opaline/b/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Pearl Opaline ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: pearl opaline player rail, frosted glass and champagne silver trim, calm luminous center lanes.
Style/medium: premium game UI environment rail, opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material.
Composition/framing: ultra-wide horizontal band with quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration belongs only near extreme edges, corners, and thin top/bottom borders.
Lighting/mood: readable center lanes, controlled edge highlights. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked card frames, card slots, deck silhouettes, placeholder rectangles, fake controls, labels, numbers.
```

### pearl-opaline-gem-panel-a

- Slot: `gem-panel`
- Style: `pearl-opaline`
- Variant: `a`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/gem-panel/pearl-opaline/a/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Pearl Opaline square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: opal pearl board substrate, frosted empty wells, champagne silver dividers, pale aqua edge glints.
Style/medium: premium board-game UI panel, opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame; no perspective skew.
Lighting/mood: controlled edge highlights, readable cells, no overexposure. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all gems, labels, counts, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked gems, gem tokens, cell icons, click markers, selection rings, symbols inside cells, oversized border.
```

### pearl-opaline-gem-panel-b

- Slot: `gem-panel`
- Style: `pearl-opaline`
- Variant: `b`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/gem-panel/pearl-opaline/b/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Pearl Opaline square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: opal pearl board substrate, frosted empty wells, champagne silver dividers, pale aqua edge glints.
Style/medium: premium board-game UI panel, opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame; no perspective skew.
Lighting/mood: controlled edge highlights, readable cells, no overexposure. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all gems, labels, counts, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked gems, gem tokens, cell icons, click markers, selection rings, symbols inside cells, oversized border.
```

### pearl-opaline-market-card-back-l1-a

- Slot: `market-card-back-l1`
- Style: `pearl-opaline`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l1/pearl-opaline/a/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier, visibly simplest in the L1/L2/L3 set for the Pearl Opaline market card-back family.
Scene/backdrop: pearl opaline card back, frosted glass frame, champagne silver trim, subtle aqua and rose accents.
Style/medium: premium vertical card-back illustration, opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use simple trim, modest accent density, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### pearl-opaline-market-card-back-l1-b

- Slot: `market-card-back-l1`
- Style: `pearl-opaline`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l1/pearl-opaline/b/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier, visibly simplest in the L1/L2/L3 set for the Pearl Opaline market card-back family.
Scene/backdrop: pearl opaline card back, frosted glass frame, champagne silver trim, subtle aqua and rose accents.
Style/medium: premium vertical card-back illustration, opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use simple trim, modest accent density, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### pearl-opaline-market-card-back-l2-a

- Slot: `market-card-back-l2`
- Style: `pearl-opaline`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l2/pearl-opaline/a/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier, richer than L1 but less luxurious than L3 for the Pearl Opaline market card-back family.
Scene/backdrop: pearl opaline card back, frosted glass frame, champagne silver trim, subtle aqua and rose accents.
Style/medium: premium vertical card-back illustration, opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use moderate ornament density, mid-tier accent material, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### pearl-opaline-market-card-back-l2-b

- Slot: `market-card-back-l2`
- Style: `pearl-opaline`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l2/pearl-opaline/b/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier, richer than L1 but less luxurious than L3 for the Pearl Opaline market card-back family.
Scene/backdrop: pearl opaline card back, frosted glass frame, champagne silver trim, subtle aqua and rose accents.
Style/medium: premium vertical card-back illustration, opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use moderate ornament density, mid-tier accent material, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### pearl-opaline-market-card-back-l3-a

- Slot: `market-card-back-l3`
- Style: `pearl-opaline`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l3/pearl-opaline/a/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier, most luxurious in the L1/L2/L3 set with the strongest prestige accents for the Pearl Opaline market card-back family.
Scene/backdrop: pearl opaline card back, frosted glass frame, champagne silver trim, subtle aqua and rose accents.
Style/medium: premium vertical card-back illustration, opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use richest trim, highest jewel density, strongest controlled glow, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### pearl-opaline-market-card-back-l3-b

- Slot: `market-card-back-l3`
- Style: `pearl-opaline`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l3/pearl-opaline/b/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier, most luxurious in the L1/L2/L3 set with the strongest prestige accents for the Pearl Opaline market card-back family.
Scene/backdrop: pearl opaline card back, frosted glass frame, champagne silver trim, subtle aqua and rose accents.
Style/medium: premium vertical card-back illustration, opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use richest trim, highest jewel density, strongest controlled glow, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### pearl-opaline-royal-card-back-a

- Slot: `royal-card-back`
- Style: `pearl-opaline`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/royal-card-back/pearl-opaline/a/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create a Pearl Opaline sovereign prestige card back for RoyalCourt previews, stronger and more ceremonial than the market backs.
Scene/backdrop: sovereign pearl-opal card back, luminous champagne silver frame, regal frosted glass prestige.
Style/medium: premium royal card-back illustration, opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material.
Composition/framing: full vertical prestige card back with a powerful sovereign identity, ornate frame, and readable calm center. No baked gameplay UI.
Lighting/mood: controlled prestige glow, readable at 150x200 display, not washed out. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all RoyalCourt labels, card details, counts, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, readable royal text, baked gems, controls, excessive clutter.
```

### pearl-opaline-royal-card-back-b

- Slot: `royal-card-back`
- Style: `pearl-opaline`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/royal-card-back/pearl-opaline/b/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create a Pearl Opaline sovereign prestige card back for RoyalCourt previews, stronger and more ceremonial than the market backs.
Scene/backdrop: sovereign pearl-opal card back, luminous champagne silver frame, regal frosted glass prestige.
Style/medium: premium royal card-back illustration, opal pearl, frosted glass, champagne silver, pale aqua and rose highlights, bright but controlled premium material.
Composition/framing: full vertical prestige card back with a powerful sovereign identity, ornate frame, and readable calm center. No baked gameplay UI.
Lighting/mood: controlled prestige glow, readable at 150x200 display, not washed out. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all RoyalCourt labels, card details, counts, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, readable royal text, baked gems, controls, excessive clutter.
```

### neon-noir-shell-background-a

- Slot: `shell-background`
- Style: `neon-noir`
- Variant: `a`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/neon-noir/a/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Neon Noir full-board table surface for GemDuel. This is the single shell background behind the centered gameplay stage, not a playmat or tablecloth.
Scene/backdrop: smoked glass noir game table, graphite metal, cyan and magenta neon only at perimeter and corners.
Style/medium: premium game UI surface, dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs.
Composition/framing: 16:9 full-board table surface. Keep the centered gameplay stage area subdued and low-noise; stronger atmosphere may sit at edges, corners, and perimeter trim only. No separate playmat rectangle or center-panel background.
Lighting/mood: controlled readable contrast, material depth, no overexposed center. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, cards, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, card slots, deck silhouettes, separate tablecloth, separate playmat.
```

### neon-noir-shell-background-b

- Slot: `shell-background`
- Style: `neon-noir`
- Variant: `b`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/shell-background/neon-noir/b/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Neon Noir full-board table surface for GemDuel. This is the single shell background behind the centered gameplay stage, not a playmat or tablecloth.
Scene/backdrop: smoked glass noir game table, graphite metal, cyan and magenta neon only at perimeter and corners.
Style/medium: premium game UI surface, dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs.
Composition/framing: 16:9 full-board table surface. Keep the centered gameplay stage area subdued and low-noise; stronger atmosphere may sit at edges, corners, and perimeter trim only. No separate playmat rectangle or center-panel background.
Lighting/mood: controlled readable contrast, material depth, no overexposed center. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, cards, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, card slots, deck silhouettes, separate tablecloth, separate playmat.
```

### neon-noir-topbar-a

- Slot: `topbar`
- Style: `neon-noir`
- Variant: `a`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/topbar/neon-noir/a/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Neon Noir panoramic header strip for the 120px logical TopBar.
Scene/backdrop: smoked glass header strip, graphite border rails, subtle cyan-magenta neon edge lines.
Style/medium: premium game UI header strip, dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs.
Composition/framing: ultra-wide strip with quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
Lighting/mood: controlled contrast, no central glare, no bright wash over overlay zones. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, central emblem blocking overlay zones, badge shapes that look like UI.
```

### neon-noir-topbar-b

- Slot: `topbar`
- Style: `neon-noir`
- Variant: `b`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/topbar/neon-noir/b/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Neon Noir panoramic header strip for the 120px logical TopBar.
Scene/backdrop: smoked glass header strip, graphite border rails, subtle cyan-magenta neon edge lines.
Style/medium: premium game UI header strip, dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs.
Composition/framing: ultra-wide strip with quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
Lighting/mood: controlled contrast, no central glare, no bright wash over overlay zones. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, central emblem blocking overlay zones, badge shapes that look like UI.
```

### neon-noir-player-zone-a

- Slot: `player-zone`
- Style: `neon-noir`
- Variant: `a`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/player-zone/neon-noir/a/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Neon Noir ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: dark smoked-glass player rail, graphite metal trim, cyan-magenta neon glow at far edges only.
Style/medium: premium game UI environment rail, dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs.
Composition/framing: ultra-wide horizontal band with quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration belongs only near extreme edges, corners, and thin top/bottom borders.
Lighting/mood: readable center lanes, controlled edge highlights. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked card frames, card slots, deck silhouettes, placeholder rectangles, fake controls, labels, numbers.
```

### neon-noir-player-zone-b

- Slot: `player-zone`
- Style: `neon-noir`
- Variant: `b`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/player-zone/neon-noir/b/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Neon Noir ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: dark smoked-glass player rail, graphite metal trim, cyan-magenta neon glow at far edges only.
Style/medium: premium game UI environment rail, dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs.
Composition/framing: ultra-wide horizontal band with quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration belongs only near extreme edges, corners, and thin top/bottom borders.
Lighting/mood: readable center lanes, controlled edge highlights. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked card frames, card slots, deck silhouettes, placeholder rectangles, fake controls, labels, numbers.
```

### neon-noir-gem-panel-a

- Slot: `gem-panel`
- Style: `neon-noir`
- Variant: `a`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/gem-panel/neon-noir/a/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Neon Noir square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: smoked glass board substrate, graphite separators, cyan-magenta glow outside the 5x5 cells only.
Style/medium: premium board-game UI panel, dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame; no perspective skew.
Lighting/mood: controlled edge highlights, readable cells, no overexposure. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all gems, labels, counts, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked gems, gem tokens, cell icons, click markers, selection rings, symbols inside cells, oversized border.
```

### neon-noir-gem-panel-b

- Slot: `gem-panel`
- Style: `neon-noir`
- Variant: `b`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/gem-panel/neon-noir/b/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Neon Noir square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: smoked glass board substrate, graphite separators, cyan-magenta glow outside the 5x5 cells only.
Style/medium: premium board-game UI panel, dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame; no perspective skew.
Lighting/mood: controlled edge highlights, readable cells, no overexposure. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all gems, labels, counts, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked gems, gem tokens, cell icons, click markers, selection rings, symbols inside cells, oversized border.
```

### neon-noir-market-card-back-l1-a

- Slot: `market-card-back-l1`
- Style: `neon-noir`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l1/neon-noir/a/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier, visibly simplest in the L1/L2/L3 set for the Neon Noir market card-back family.
Scene/backdrop: neon-noir card back, graphite frame, smoked glass center, cyan and magenta jewel-edge light.
Style/medium: premium vertical card-back illustration, dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use simple trim, modest accent density, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### neon-noir-market-card-back-l1-b

- Slot: `market-card-back-l1`
- Style: `neon-noir`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l1/neon-noir/b/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier, visibly simplest in the L1/L2/L3 set for the Neon Noir market card-back family.
Scene/backdrop: neon-noir card back, graphite frame, smoked glass center, cyan and magenta jewel-edge light.
Style/medium: premium vertical card-back illustration, dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use simple trim, modest accent density, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### neon-noir-market-card-back-l2-a

- Slot: `market-card-back-l2`
- Style: `neon-noir`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l2/neon-noir/a/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier, richer than L1 but less luxurious than L3 for the Neon Noir market card-back family.
Scene/backdrop: neon-noir card back, graphite frame, smoked glass center, cyan and magenta jewel-edge light.
Style/medium: premium vertical card-back illustration, dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use moderate ornament density, mid-tier accent material, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### neon-noir-market-card-back-l2-b

- Slot: `market-card-back-l2`
- Style: `neon-noir`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l2/neon-noir/b/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier, richer than L1 but less luxurious than L3 for the Neon Noir market card-back family.
Scene/backdrop: neon-noir card back, graphite frame, smoked glass center, cyan and magenta jewel-edge light.
Style/medium: premium vertical card-back illustration, dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use moderate ornament density, mid-tier accent material, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### neon-noir-market-card-back-l3-a

- Slot: `market-card-back-l3`
- Style: `neon-noir`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l3/neon-noir/a/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier, most luxurious in the L1/L2/L3 set with the strongest prestige accents for the Neon Noir market card-back family.
Scene/backdrop: neon-noir card back, graphite frame, smoked glass center, cyan and magenta jewel-edge light.
Style/medium: premium vertical card-back illustration, dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use richest trim, highest jewel density, strongest controlled glow, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### neon-noir-market-card-back-l3-b

- Slot: `market-card-back-l3`
- Style: `neon-noir`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l3/neon-noir/b/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier, most luxurious in the L1/L2/L3 set with the strongest prestige accents for the Neon Noir market card-back family.
Scene/backdrop: neon-noir card back, graphite frame, smoked glass center, cyan and magenta jewel-edge light.
Style/medium: premium vertical card-back illustration, dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use richest trim, highest jewel density, strongest controlled glow, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### neon-noir-royal-card-back-a

- Slot: `royal-card-back`
- Style: `neon-noir`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/royal-card-back/neon-noir/a/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create a Neon Noir sovereign prestige card back for RoyalCourt previews, stronger and more ceremonial than the market backs.
Scene/backdrop: sovereign neon-noir card back, graphite prestige frame, dark glass depth, controlled cyan-magenta royal glow.
Style/medium: premium royal card-back illustration, dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs.
Composition/framing: full vertical prestige card back with a powerful sovereign identity, ornate frame, and readable calm center. No baked gameplay UI.
Lighting/mood: controlled prestige glow, readable at 150x200 display, not washed out. Variant A should emphasize the clearest primary identity for this style.
Constraints: React renders all RoyalCourt labels, card details, counts, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, readable royal text, baked gems, controls, excessive clutter.
```

### neon-noir-royal-card-back-b

- Slot: `royal-card-back`
- Style: `neon-noir`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/royal-card-back/neon-noir/b/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create a Neon Noir sovereign prestige card back for RoyalCourt previews, stronger and more ceremonial than the market backs.
Scene/backdrop: sovereign neon-noir card back, graphite prestige frame, dark glass depth, controlled cyan-magenta royal glow.
Style/medium: premium royal card-back illustration, dark smoked glass, graphite metal, cyan and magenta neon edge light, sleek game-table noir, no signage or glyphs.
Composition/framing: full vertical prestige card back with a powerful sovereign identity, ornate frame, and readable calm center. No baked gameplay UI.
Lighting/mood: controlled prestige glow, readable at 150x200 display, not washed out. Variant B should be a distinct alternate composition with the same constraints and material family.
Constraints: React renders all RoyalCourt labels, card details, counts, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, readable royal text, baked gems, controls, excessive clutter.
```
