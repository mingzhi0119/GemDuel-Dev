# Surface Asset Autonomous Extra Styles Prompt Manifest - 2026-04-27

## Source Constraints

This manifest starts a third autonomous GemDuel surface-art candidate library with four additional style groups beyond the existing runtime styles and the prior new-style pass. This is a candidate-library pass only: no runtime files, code, preview routes, or tests are changed.

Confirmed constraints from the current repo:

- Shell background is the single full-board table surface; no separate tablecloth, playmat, or center-panel background slot.
- TopBar uses a 120px logical header and needs quiet overlay zones near 25%, 50%, and 75% width.
- PlayerZone art must work left-anchored for P1 and right-anchored for P2; no baked card slots, deck silhouettes, controls, labels, or numbers.
- GemPanel canvas is `1254x1254`; visual grid lines must land at x=`100,305,515,726,938,1141` and y=`104,308,512,717,917,1132`.
- Market and royal card backs use `FEATURED_CARD_SAMPLE_SIZE` `1086x1448` and downsample into `FEATURED_CARD_SIZE` `150x200`.
- React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, and gameplay affordances.
- Global avoid list: no text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked gems, baked UI, labels, counters, card-slot silhouettes, or click markers.

## Output Locations

- Prompt manifest: `docs/art/surface-asset-autonomous-extra-styles-prompts-2026-04-27.md`
- Scoring report: `docs/art/surface-asset-autonomous-extra-styles-library-2026-04-27.md`
- Candidate archive root: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/`

## Style Groups

| Style                  | Display name         | Recipe                                                                                                                                                          |
| ---------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `stormglass-reliquary` | Stormglass Reliquary | smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing |
| `verdant-bronze`       | Verdant Bronze       | deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing                          |
| `solar-enamel`         | Solar Enamel         | cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing             |
| `sakura-obsidian`      | Sakura Obsidian      | black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing                 |

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

### stormglass-reliquary-shell-background-a

- Slot: `shell-background`
- Style: `stormglass-reliquary`
- Variant: `a`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/stormglass-reliquary/a/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Stormglass Reliquary full-board table surface for GemDuel. This is the single shell background behind the centered gameplay stage, not a playmat or tablecloth.
Scene/backdrop: stormglass tabletop, black stone field, pewter rim, restrained violet stormlight only along the perimeter.
Style/medium: premium game UI surface, smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing.
Composition/framing: 16:9 full-board table surface. Keep the centered gameplay stage subdued and low-noise; stronger atmosphere may sit at edges, corners, and perimeter trim only. No separate playmat rectangle or center-panel background.
Lighting/mood: controlled readable contrast, material depth, no overexposed center. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, cards, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, card slots, deck silhouettes, separate tablecloth, separate playmat.
```

### stormglass-reliquary-shell-background-b

- Slot: `shell-background`
- Style: `stormglass-reliquary`
- Variant: `b`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/stormglass-reliquary/b/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Stormglass Reliquary full-board table surface for GemDuel. This is the single shell background behind the centered gameplay stage, not a playmat or tablecloth.
Scene/backdrop: stormglass tabletop, black stone field, pewter rim, restrained violet stormlight only along the perimeter.
Style/medium: premium game UI surface, smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing.
Composition/framing: 16:9 full-board table surface. Keep the centered gameplay stage subdued and low-noise; stronger atmosphere may sit at edges, corners, and perimeter trim only. No separate playmat rectangle or center-panel background.
Lighting/mood: controlled readable contrast, material depth, no overexposed center. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, cards, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, card slots, deck silhouettes, separate tablecloth, separate playmat.
```

### stormglass-reliquary-topbar-a

- Slot: `topbar`
- Style: `stormglass-reliquary`
- Variant: `a`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/topbar/stormglass-reliquary/a/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Stormglass Reliquary ultra-wide panoramic header strip for the 120px logical TopBar.
Scene/backdrop: smoky glass header rail, pewter cap pieces, thin violet stormlight edge lines.
Style/medium: premium game UI header strip, smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing.
Composition/framing: very wide 32:3 strip composition, not a square concept image. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs only at edges, corners, and thin borders. No black bars or white bars.
Lighting/mood: controlled contrast, no central glare, no bright wash over overlay zones. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, central emblem blocking overlay zones, badge shapes that look like UI, letterbox bars.
```

### stormglass-reliquary-topbar-b

- Slot: `topbar`
- Style: `stormglass-reliquary`
- Variant: `b`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/topbar/stormglass-reliquary/b/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Stormglass Reliquary ultra-wide panoramic header strip for the 120px logical TopBar.
Scene/backdrop: smoky glass header rail, pewter cap pieces, thin violet stormlight edge lines.
Style/medium: premium game UI header strip, smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing.
Composition/framing: very wide 32:3 strip composition, not a square concept image. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs only at edges, corners, and thin borders. No black bars or white bars.
Lighting/mood: controlled contrast, no central glare, no bright wash over overlay zones. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, central emblem blocking overlay zones, badge shapes that look like UI, letterbox bars.
```

### stormglass-reliquary-player-zone-a

- Slot: `player-zone`
- Style: `stormglass-reliquary`
- Variant: `a`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/player-zone/stormglass-reliquary/a/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Stormglass Reliquary ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: stormglass player rail, rain-polished black stone center, pewter trim, violet glow at far edges only.
Style/medium: premium game UI environment rail, smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing.
Composition/framing: very wide 96:13 horizontal band, not a square concept image. Keep quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration belongs only near extreme edges, corners, and thin top/bottom borders. No black bars or white bars.
Lighting/mood: readable center lanes, controlled edge highlights. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked card frames, card slots, deck silhouettes, placeholder rectangles, fake controls, labels, numbers, letterbox bars.
```

### stormglass-reliquary-player-zone-b

- Slot: `player-zone`
- Style: `stormglass-reliquary`
- Variant: `b`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/player-zone/stormglass-reliquary/b/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Stormglass Reliquary ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: stormglass player rail, rain-polished black stone center, pewter trim, violet glow at far edges only.
Style/medium: premium game UI environment rail, smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing.
Composition/framing: very wide 96:13 horizontal band, not a square concept image. Keep quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration belongs only near extreme edges, corners, and thin top/bottom borders. No black bars or white bars.
Lighting/mood: readable center lanes, controlled edge highlights. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked card frames, card slots, deck silhouettes, placeholder rectangles, fake controls, labels, numbers, letterbox bars.
```

### stormglass-reliquary-gem-panel-a

- Slot: `gem-panel`
- Style: `stormglass-reliquary`
- Variant: `a`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/gem-panel/stormglass-reliquary/a/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Stormglass Reliquary square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: smoky storm-glass board substrate, pewter dividers, faint violet refraction outside the 5x5 cells.
Style/medium: premium board-game UI panel, smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame; no perspective skew.
Lighting/mood: controlled edge highlights, readable cells, no overexposure. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all gems, labels, counts, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked gems, gem tokens, cell icons, click markers, selection rings, symbols inside cells, oversized border.
```

### stormglass-reliquary-gem-panel-b

- Slot: `gem-panel`
- Style: `stormglass-reliquary`
- Variant: `b`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/gem-panel/stormglass-reliquary/b/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Stormglass Reliquary square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: smoky storm-glass board substrate, pewter dividers, faint violet refraction outside the 5x5 cells.
Style/medium: premium board-game UI panel, smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame; no perspective skew.
Lighting/mood: controlled edge highlights, readable cells, no overexposure. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all gems, labels, counts, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked gems, gem tokens, cell icons, click markers, selection rings, symbols inside cells, oversized border.
```

### stormglass-reliquary-market-card-back-l1-a

- Slot: `market-card-back-l1`
- Style: `stormglass-reliquary`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l1/stormglass-reliquary/a/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier, visibly simplest in the L1/L2/L3 set for the Stormglass Reliquary market card-back family.
Scene/backdrop: stormglass card back, pewter frame, rain-dark center, restrained violet stormlight jewel accents.
Style/medium: premium vertical card-back illustration, smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use simple trim, modest accent density, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### stormglass-reliquary-market-card-back-l1-b

- Slot: `market-card-back-l1`
- Style: `stormglass-reliquary`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l1/stormglass-reliquary/b/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier, visibly simplest in the L1/L2/L3 set for the Stormglass Reliquary market card-back family.
Scene/backdrop: stormglass card back, pewter frame, rain-dark center, restrained violet stormlight jewel accents.
Style/medium: premium vertical card-back illustration, smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use simple trim, modest accent density, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### stormglass-reliquary-market-card-back-l2-a

- Slot: `market-card-back-l2`
- Style: `stormglass-reliquary`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l2/stormglass-reliquary/a/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier, visibly richer than L1 but quieter than L3 in the L1/L2/L3 set for the Stormglass Reliquary market card-back family.
Scene/backdrop: stormglass card back, pewter frame, rain-dark center, restrained violet stormlight jewel accents.
Style/medium: premium vertical card-back illustration, smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use more ornament than L1, stronger trim, mid-tier accent material. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### stormglass-reliquary-market-card-back-l2-b

- Slot: `market-card-back-l2`
- Style: `stormglass-reliquary`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l2/stormglass-reliquary/b/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier, visibly richer than L1 but quieter than L3 in the L1/L2/L3 set for the Stormglass Reliquary market card-back family.
Scene/backdrop: stormglass card back, pewter frame, rain-dark center, restrained violet stormlight jewel accents.
Style/medium: premium vertical card-back illustration, smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use more ornament than L1, stronger trim, mid-tier accent material. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### stormglass-reliquary-market-card-back-l3-a

- Slot: `market-card-back-l3`
- Style: `stormglass-reliquary`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l3/stormglass-reliquary/a/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier, most luxurious market deck back in the L1/L2/L3 set for the Stormglass Reliquary market card-back family.
Scene/backdrop: stormglass card back, pewter frame, rain-dark center, restrained violet stormlight jewel accents.
Style/medium: premium vertical card-back illustration, smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use highest-prestige market ornament, richer glow, denser jewel or metal accents while preserving a readable center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### stormglass-reliquary-market-card-back-l3-b

- Slot: `market-card-back-l3`
- Style: `stormglass-reliquary`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l3/stormglass-reliquary/b/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier, most luxurious market deck back in the L1/L2/L3 set for the Stormglass Reliquary market card-back family.
Scene/backdrop: stormglass card back, pewter frame, rain-dark center, restrained violet stormlight jewel accents.
Style/medium: premium vertical card-back illustration, smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use highest-prestige market ornament, richer glow, denser jewel or metal accents while preserving a readable center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### stormglass-reliquary-royal-card-back-a

- Slot: `royal-card-back`
- Style: `stormglass-reliquary`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/royal-card-back/stormglass-reliquary/a/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal-card-back UI asset, exact 1086x1448 PNG.
Primary request: create a Stormglass Reliquary prestige card back for RoyalCourt previews, stronger and more ceremonial than the market backs.
Scene/backdrop: sovereign stormglass card back, ceremonial pewter reliquary frame, restrained violet lightning trapped in crownlike bevels.
Style/medium: premium royal card-back illustration, smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing.
Composition/framing: full vertical prestige card back with powerful sovereign identity, ornate frame, and readable calm center. No baked gameplay UI.
Lighting/mood: controlled prestige glow, readable at 150x200 display, not washed out. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all RoyalCourt labels, card details, counts, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, readable royal text, baked gems, controls, excessive clutter.
```

### stormglass-reliquary-royal-card-back-b

- Slot: `royal-card-back`
- Style: `stormglass-reliquary`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/royal-card-back/stormglass-reliquary/b/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal-card-back UI asset, exact 1086x1448 PNG.
Primary request: create a Stormglass Reliquary prestige card back for RoyalCourt previews, stronger and more ceremonial than the market backs.
Scene/backdrop: sovereign stormglass card back, ceremonial pewter reliquary frame, restrained violet lightning trapped in crownlike bevels.
Style/medium: premium royal card-back illustration, smoky storm glass, rain-polished black stone, pewter filigree, muted violet lightning trapped inside bevels, solemn premium reliquary materials without writing.
Composition/framing: full vertical prestige card back with powerful sovereign identity, ornate frame, and readable calm center. No baked gameplay UI.
Lighting/mood: controlled prestige glow, readable at 150x200 display, not washed out. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all RoyalCourt labels, card details, counts, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, readable royal text, baked gems, controls, excessive clutter.
```

### verdant-bronze-shell-background-a

- Slot: `shell-background`
- Style: `verdant-bronze`
- Variant: `a`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/verdant-bronze/a/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Verdant Bronze full-board table surface for GemDuel. This is the single shell background behind the centered gameplay stage, not a playmat or tablecloth.
Scene/backdrop: deep forest gaming table, dark hardwood, oxidized bronze rails, moss-agate edge inlays, low-noise play center.
Style/medium: premium game UI surface, deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing.
Composition/framing: 16:9 full-board table surface. Keep the centered gameplay stage subdued and low-noise; stronger atmosphere may sit at edges, corners, and perimeter trim only. No separate playmat rectangle or center-panel background.
Lighting/mood: controlled readable contrast, material depth, no overexposed center. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, cards, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, card slots, deck silhouettes, separate tablecloth, separate playmat.
```

### verdant-bronze-shell-background-b

- Slot: `shell-background`
- Style: `verdant-bronze`
- Variant: `b`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/verdant-bronze/b/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Verdant Bronze full-board table surface for GemDuel. This is the single shell background behind the centered gameplay stage, not a playmat or tablecloth.
Scene/backdrop: deep forest gaming table, dark hardwood, oxidized bronze rails, moss-agate edge inlays, low-noise play center.
Style/medium: premium game UI surface, deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing.
Composition/framing: 16:9 full-board table surface. Keep the centered gameplay stage subdued and low-noise; stronger atmosphere may sit at edges, corners, and perimeter trim only. No separate playmat rectangle or center-panel background.
Lighting/mood: controlled readable contrast, material depth, no overexposed center. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, cards, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, card slots, deck silhouettes, separate tablecloth, separate playmat.
```

### verdant-bronze-topbar-a

- Slot: `topbar`
- Style: `verdant-bronze`
- Variant: `a`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/topbar/verdant-bronze/a/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Verdant Bronze ultra-wide panoramic header strip for the 120px logical TopBar.
Scene/backdrop: forest leather header strip, oxidized bronze trim, small moss-agate highlights at corners.
Style/medium: premium game UI header strip, deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing.
Composition/framing: very wide 32:3 strip composition, not a square concept image. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs only at edges, corners, and thin borders. No black bars or white bars.
Lighting/mood: controlled contrast, no central glare, no bright wash over overlay zones. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, central emblem blocking overlay zones, badge shapes that look like UI, letterbox bars.
```

### verdant-bronze-topbar-b

- Slot: `topbar`
- Style: `verdant-bronze`
- Variant: `b`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/topbar/verdant-bronze/b/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Verdant Bronze ultra-wide panoramic header strip for the 120px logical TopBar.
Scene/backdrop: forest leather header strip, oxidized bronze trim, small moss-agate highlights at corners.
Style/medium: premium game UI header strip, deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing.
Composition/framing: very wide 32:3 strip composition, not a square concept image. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs only at edges, corners, and thin borders. No black bars or white bars.
Lighting/mood: controlled contrast, no central glare, no bright wash over overlay zones. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, central emblem blocking overlay zones, badge shapes that look like UI, letterbox bars.
```

### verdant-bronze-player-zone-a

- Slot: `player-zone`
- Style: `verdant-bronze`
- Variant: `a`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/player-zone/verdant-bronze/a/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Verdant Bronze ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: dark hardwood and forest leather player rail, oxidized bronze edge trim, quiet center lanes.
Style/medium: premium game UI environment rail, deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing.
Composition/framing: very wide 96:13 horizontal band, not a square concept image. Keep quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration belongs only near extreme edges, corners, and thin top/bottom borders. No black bars or white bars.
Lighting/mood: readable center lanes, controlled edge highlights. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked card frames, card slots, deck silhouettes, placeholder rectangles, fake controls, labels, numbers, letterbox bars.
```

### verdant-bronze-player-zone-b

- Slot: `player-zone`
- Style: `verdant-bronze`
- Variant: `b`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/player-zone/verdant-bronze/b/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Verdant Bronze ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: dark hardwood and forest leather player rail, oxidized bronze edge trim, quiet center lanes.
Style/medium: premium game UI environment rail, deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing.
Composition/framing: very wide 96:13 horizontal band, not a square concept image. Keep quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration belongs only near extreme edges, corners, and thin top/bottom borders. No black bars or white bars.
Lighting/mood: readable center lanes, controlled edge highlights. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked card frames, card slots, deck silhouettes, placeholder rectangles, fake controls, labels, numbers, letterbox bars.
```

### verdant-bronze-gem-panel-a

- Slot: `gem-panel`
- Style: `verdant-bronze`
- Variant: `a`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/gem-panel/verdant-bronze/a/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Verdant Bronze square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: moss-agate and dark hardwood square board, oxidized bronze dividers, empty readable wells.
Style/medium: premium board-game UI panel, deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame; no perspective skew.
Lighting/mood: controlled edge highlights, readable cells, no overexposure. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all gems, labels, counts, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked gems, gem tokens, cell icons, click markers, selection rings, symbols inside cells, oversized border.
```

### verdant-bronze-gem-panel-b

- Slot: `gem-panel`
- Style: `verdant-bronze`
- Variant: `b`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/gem-panel/verdant-bronze/b/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Verdant Bronze square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: moss-agate and dark hardwood square board, oxidized bronze dividers, empty readable wells.
Style/medium: premium board-game UI panel, deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame; no perspective skew.
Lighting/mood: controlled edge highlights, readable cells, no overexposure. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all gems, labels, counts, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked gems, gem tokens, cell icons, click markers, selection rings, symbols inside cells, oversized border.
```

### verdant-bronze-market-card-back-l1-a

- Slot: `market-card-back-l1`
- Style: `verdant-bronze`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l1/verdant-bronze/a/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier, visibly simplest in the L1/L2/L3 set for the Verdant Bronze market card-back family.
Scene/backdrop: verdant bronze card back, dark leather center, oxidized bronze frame, moss-agate accents.
Style/medium: premium vertical card-back illustration, deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use simple trim, modest accent density, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### verdant-bronze-market-card-back-l1-b

- Slot: `market-card-back-l1`
- Style: `verdant-bronze`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l1/verdant-bronze/b/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier, visibly simplest in the L1/L2/L3 set for the Verdant Bronze market card-back family.
Scene/backdrop: verdant bronze card back, dark leather center, oxidized bronze frame, moss-agate accents.
Style/medium: premium vertical card-back illustration, deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use simple trim, modest accent density, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### verdant-bronze-market-card-back-l2-a

- Slot: `market-card-back-l2`
- Style: `verdant-bronze`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l2/verdant-bronze/a/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier, visibly richer than L1 but quieter than L3 in the L1/L2/L3 set for the Verdant Bronze market card-back family.
Scene/backdrop: verdant bronze card back, dark leather center, oxidized bronze frame, moss-agate accents.
Style/medium: premium vertical card-back illustration, deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use more ornament than L1, stronger trim, mid-tier accent material. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### verdant-bronze-market-card-back-l2-b

- Slot: `market-card-back-l2`
- Style: `verdant-bronze`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l2/verdant-bronze/b/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier, visibly richer than L1 but quieter than L3 in the L1/L2/L3 set for the Verdant Bronze market card-back family.
Scene/backdrop: verdant bronze card back, dark leather center, oxidized bronze frame, moss-agate accents.
Style/medium: premium vertical card-back illustration, deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use more ornament than L1, stronger trim, mid-tier accent material. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### verdant-bronze-market-card-back-l3-a

- Slot: `market-card-back-l3`
- Style: `verdant-bronze`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l3/verdant-bronze/a/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier, most luxurious market deck back in the L1/L2/L3 set for the Verdant Bronze market card-back family.
Scene/backdrop: verdant bronze card back, dark leather center, oxidized bronze frame, moss-agate accents.
Style/medium: premium vertical card-back illustration, deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use highest-prestige market ornament, richer glow, denser jewel or metal accents while preserving a readable center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### verdant-bronze-market-card-back-l3-b

- Slot: `market-card-back-l3`
- Style: `verdant-bronze`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l3/verdant-bronze/b/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier, most luxurious market deck back in the L1/L2/L3 set for the Verdant Bronze market card-back family.
Scene/backdrop: verdant bronze card back, dark leather center, oxidized bronze frame, moss-agate accents.
Style/medium: premium vertical card-back illustration, deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use highest-prestige market ornament, richer glow, denser jewel or metal accents while preserving a readable center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### verdant-bronze-royal-card-back-a

- Slot: `royal-card-back`
- Style: `verdant-bronze`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/royal-card-back/verdant-bronze/a/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal-card-back UI asset, exact 1086x1448 PNG.
Primary request: create a Verdant Bronze prestige card back for RoyalCourt previews, stronger and more ceremonial than the market backs.
Scene/backdrop: ceremonial verdant bronze royal card back, deeper forest leather, richer moss-agate crest-like ornament without readable symbols.
Style/medium: premium royal card-back illustration, deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing.
Composition/framing: full vertical prestige card back with powerful sovereign identity, ornate frame, and readable calm center. No baked gameplay UI.
Lighting/mood: controlled prestige glow, readable at 150x200 display, not washed out. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all RoyalCourt labels, card details, counts, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, readable royal text, baked gems, controls, excessive clutter.
```

### verdant-bronze-royal-card-back-b

- Slot: `royal-card-back`
- Style: `verdant-bronze`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/royal-card-back/verdant-bronze/b/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal-card-back UI asset, exact 1086x1448 PNG.
Primary request: create a Verdant Bronze prestige card back for RoyalCourt previews, stronger and more ceremonial than the market backs.
Scene/backdrop: ceremonial verdant bronze royal card back, deeper forest leather, richer moss-agate crest-like ornament without readable symbols.
Style/medium: premium royal card-back illustration, deep forest green leather, oxidized bronze, carved dark hardwood, moss-agate inlay, practical premium board-game craft without writing.
Composition/framing: full vertical prestige card back with powerful sovereign identity, ornate frame, and readable calm center. No baked gameplay UI.
Lighting/mood: controlled prestige glow, readable at 150x200 display, not washed out. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all RoyalCourt labels, card details, counts, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, readable royal text, baked gems, controls, excessive clutter.
```

### solar-enamel-shell-background-a

- Slot: `shell-background`
- Style: `solar-enamel`
- Variant: `a`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/solar-enamel/a/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Solar Enamel full-board table surface for GemDuel. This is the single shell background behind the centered gameplay stage, not a playmat or tablecloth.
Scene/backdrop: cobalt enamel and ivory ceramic game table, warm brushed gold rim, calm readable center.
Style/medium: premium game UI surface, cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing.
Composition/framing: 16:9 full-board table surface. Keep the centered gameplay stage subdued and low-noise; stronger atmosphere may sit at edges, corners, and perimeter trim only. No separate playmat rectangle or center-panel background.
Lighting/mood: controlled readable contrast, material depth, no overexposed center. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, cards, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, card slots, deck silhouettes, separate tablecloth, separate playmat.
```

### solar-enamel-shell-background-b

- Slot: `shell-background`
- Style: `solar-enamel`
- Variant: `b`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/solar-enamel/b/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Solar Enamel full-board table surface for GemDuel. This is the single shell background behind the centered gameplay stage, not a playmat or tablecloth.
Scene/backdrop: cobalt enamel and ivory ceramic game table, warm brushed gold rim, calm readable center.
Style/medium: premium game UI surface, cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing.
Composition/framing: 16:9 full-board table surface. Keep the centered gameplay stage subdued and low-noise; stronger atmosphere may sit at edges, corners, and perimeter trim only. No separate playmat rectangle or center-panel background.
Lighting/mood: controlled readable contrast, material depth, no overexposed center. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, cards, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, card slots, deck silhouettes, separate tablecloth, separate playmat.
```

### solar-enamel-topbar-a

- Slot: `topbar`
- Style: `solar-enamel`
- Variant: `a`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/topbar/solar-enamel/a/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Solar Enamel ultra-wide panoramic header strip for the 120px logical TopBar.
Scene/backdrop: cobalt enamel header strip, ivory ceramic inset, thin warm gold edge trim, no emblems in overlay zones.
Style/medium: premium game UI header strip, cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing.
Composition/framing: very wide 32:3 strip composition, not a square concept image. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs only at edges, corners, and thin borders. No black bars or white bars.
Lighting/mood: controlled contrast, no central glare, no bright wash over overlay zones. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, central emblem blocking overlay zones, badge shapes that look like UI, letterbox bars.
```

### solar-enamel-topbar-b

- Slot: `topbar`
- Style: `solar-enamel`
- Variant: `b`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/topbar/solar-enamel/b/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Solar Enamel ultra-wide panoramic header strip for the 120px logical TopBar.
Scene/backdrop: cobalt enamel header strip, ivory ceramic inset, thin warm gold edge trim, no emblems in overlay zones.
Style/medium: premium game UI header strip, cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing.
Composition/framing: very wide 32:3 strip composition, not a square concept image. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs only at edges, corners, and thin borders. No black bars or white bars.
Lighting/mood: controlled contrast, no central glare, no bright wash over overlay zones. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, central emblem blocking overlay zones, badge shapes that look like UI, letterbox bars.
```

### solar-enamel-player-zone-a

- Slot: `player-zone`
- Style: `solar-enamel`
- Variant: `a`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/player-zone/solar-enamel/a/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Solar Enamel ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: cobalt enamel and ivory player rail, gold edge trim, quiet satin center for React overlays.
Style/medium: premium game UI environment rail, cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing.
Composition/framing: very wide 96:13 horizontal band, not a square concept image. Keep quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration belongs only near extreme edges, corners, and thin top/bottom borders. No black bars or white bars.
Lighting/mood: readable center lanes, controlled edge highlights. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked card frames, card slots, deck silhouettes, placeholder rectangles, fake controls, labels, numbers, letterbox bars.
```

### solar-enamel-player-zone-b

- Slot: `player-zone`
- Style: `solar-enamel`
- Variant: `b`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/player-zone/solar-enamel/b/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Solar Enamel ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: cobalt enamel and ivory player rail, gold edge trim, quiet satin center for React overlays.
Style/medium: premium game UI environment rail, cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing.
Composition/framing: very wide 96:13 horizontal band, not a square concept image. Keep quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration belongs only near extreme edges, corners, and thin top/bottom borders. No black bars or white bars.
Lighting/mood: readable center lanes, controlled edge highlights. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked card frames, card slots, deck silhouettes, placeholder rectangles, fake controls, labels, numbers, letterbox bars.
```

### solar-enamel-gem-panel-a

- Slot: `gem-panel`
- Style: `solar-enamel`
- Variant: `a`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/gem-panel/solar-enamel/a/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Solar Enamel square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: cobalt enamel square board with ivory wells, warm gold dividers, precise empty 5x5 playfield.
Style/medium: premium board-game UI panel, cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame; no perspective skew.
Lighting/mood: controlled edge highlights, readable cells, no overexposure. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all gems, labels, counts, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked gems, gem tokens, cell icons, click markers, selection rings, symbols inside cells, oversized border.
```

### solar-enamel-gem-panel-b

- Slot: `gem-panel`
- Style: `solar-enamel`
- Variant: `b`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/gem-panel/solar-enamel/b/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Solar Enamel square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: cobalt enamel square board with ivory wells, warm gold dividers, precise empty 5x5 playfield.
Style/medium: premium board-game UI panel, cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame; no perspective skew.
Lighting/mood: controlled edge highlights, readable cells, no overexposure. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all gems, labels, counts, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked gems, gem tokens, cell icons, click markers, selection rings, symbols inside cells, oversized border.
```

### solar-enamel-market-card-back-l1-a

- Slot: `market-card-back-l1`
- Style: `solar-enamel`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l1/solar-enamel/a/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier, visibly simplest in the L1/L2/L3 set for the Solar Enamel market card-back family.
Scene/backdrop: solar enamel card back, cobalt enamel field, ivory ceramic frame, warm gold trim with tiered ornament density.
Style/medium: premium vertical card-back illustration, cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use simple trim, modest accent density, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### solar-enamel-market-card-back-l1-b

- Slot: `market-card-back-l1`
- Style: `solar-enamel`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l1/solar-enamel/b/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier, visibly simplest in the L1/L2/L3 set for the Solar Enamel market card-back family.
Scene/backdrop: solar enamel card back, cobalt enamel field, ivory ceramic frame, warm gold trim with tiered ornament density.
Style/medium: premium vertical card-back illustration, cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use simple trim, modest accent density, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### solar-enamel-market-card-back-l2-a

- Slot: `market-card-back-l2`
- Style: `solar-enamel`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l2/solar-enamel/a/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier, visibly richer than L1 but quieter than L3 in the L1/L2/L3 set for the Solar Enamel market card-back family.
Scene/backdrop: solar enamel card back, cobalt enamel field, ivory ceramic frame, warm gold trim with tiered ornament density.
Style/medium: premium vertical card-back illustration, cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use more ornament than L1, stronger trim, mid-tier accent material. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### solar-enamel-market-card-back-l2-b

- Slot: `market-card-back-l2`
- Style: `solar-enamel`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l2/solar-enamel/b/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier, visibly richer than L1 but quieter than L3 in the L1/L2/L3 set for the Solar Enamel market card-back family.
Scene/backdrop: solar enamel card back, cobalt enamel field, ivory ceramic frame, warm gold trim with tiered ornament density.
Style/medium: premium vertical card-back illustration, cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use more ornament than L1, stronger trim, mid-tier accent material. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### solar-enamel-market-card-back-l3-a

- Slot: `market-card-back-l3`
- Style: `solar-enamel`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l3/solar-enamel/a/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier, most luxurious market deck back in the L1/L2/L3 set for the Solar Enamel market card-back family.
Scene/backdrop: solar enamel card back, cobalt enamel field, ivory ceramic frame, warm gold trim with tiered ornament density.
Style/medium: premium vertical card-back illustration, cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use highest-prestige market ornament, richer glow, denser jewel or metal accents while preserving a readable center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### solar-enamel-market-card-back-l3-b

- Slot: `market-card-back-l3`
- Style: `solar-enamel`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l3/solar-enamel/b/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier, most luxurious market deck back in the L1/L2/L3 set for the Solar Enamel market card-back family.
Scene/backdrop: solar enamel card back, cobalt enamel field, ivory ceramic frame, warm gold trim with tiered ornament density.
Style/medium: premium vertical card-back illustration, cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use highest-prestige market ornament, richer glow, denser jewel or metal accents while preserving a readable center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### solar-enamel-royal-card-back-a

- Slot: `royal-card-back`
- Style: `solar-enamel`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/royal-card-back/solar-enamel/a/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal-card-back UI asset, exact 1086x1448 PNG.
Primary request: create a Solar Enamel prestige card back for RoyalCourt previews, stronger and more ceremonial than the market backs.
Scene/backdrop: royal solar enamel card back, cobalt and ivory ceremonial frame, rich brushed-gold prestige without text or numerals.
Style/medium: premium royal card-back illustration, cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing.
Composition/framing: full vertical prestige card back with powerful sovereign identity, ornate frame, and readable calm center. No baked gameplay UI.
Lighting/mood: controlled prestige glow, readable at 150x200 display, not washed out. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all RoyalCourt labels, card details, counts, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, readable royal text, baked gems, controls, excessive clutter.
```

### solar-enamel-royal-card-back-b

- Slot: `royal-card-back`
- Style: `solar-enamel`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/royal-card-back/solar-enamel/b/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal-card-back UI asset, exact 1086x1448 PNG.
Primary request: create a Solar Enamel prestige card back for RoyalCourt previews, stronger and more ceremonial than the market backs.
Scene/backdrop: royal solar enamel card back, cobalt and ivory ceremonial frame, rich brushed-gold prestige without text or numerals.
Style/medium: premium royal card-back illustration, cobalt enamel, ivory ceramic, warm brushed gold, restrained sunlit bevels, bright premium tabletop material with controlled contrast and no writing.
Composition/framing: full vertical prestige card back with powerful sovereign identity, ornate frame, and readable calm center. No baked gameplay UI.
Lighting/mood: controlled prestige glow, readable at 150x200 display, not washed out. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all RoyalCourt labels, card details, counts, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, readable royal text, baked gems, controls, excessive clutter.
```

### sakura-obsidian-shell-background-a

- Slot: `shell-background`
- Style: `sakura-obsidian`
- Variant: `a`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/sakura-obsidian/a/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Sakura Obsidian full-board table surface for GemDuel. This is the single shell background behind the centered gameplay stage, not a playmat or tablecloth.
Scene/backdrop: black obsidian and smoked lacquer tabletop, rose quartz edge pieces, calm dark play center.
Style/medium: premium game UI surface, black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing.
Composition/framing: 16:9 full-board table surface. Keep the centered gameplay stage subdued and low-noise; stronger atmosphere may sit at edges, corners, and perimeter trim only. No separate playmat rectangle or center-panel background.
Lighting/mood: controlled readable contrast, material depth, no overexposed center. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, cards, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, card slots, deck silhouettes, separate tablecloth, separate playmat.
```

### sakura-obsidian-shell-background-b

- Slot: `shell-background`
- Style: `sakura-obsidian`
- Variant: `b`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/shell-background/sakura-obsidian/b/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Sakura Obsidian full-board table surface for GemDuel. This is the single shell background behind the centered gameplay stage, not a playmat or tablecloth.
Scene/backdrop: black obsidian and smoked lacquer tabletop, rose quartz edge pieces, calm dark play center.
Style/medium: premium game UI surface, black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing.
Composition/framing: 16:9 full-board table surface. Keep the centered gameplay stage subdued and low-noise; stronger atmosphere may sit at edges, corners, and perimeter trim only. No separate playmat rectangle or center-panel background.
Lighting/mood: controlled readable contrast, material depth, no overexposed center. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all labels, counts, levels, gems, buttons, hover rings, selection states, controls, cards, and gameplay affordances. The bitmap must contain no baked UI or readable content.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, card slots, deck silhouettes, separate tablecloth, separate playmat.
```

### sakura-obsidian-topbar-a

- Slot: `topbar`
- Style: `sakura-obsidian`
- Variant: `a`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/topbar/sakura-obsidian/a/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Sakura Obsidian ultra-wide panoramic header strip for the 120px logical TopBar.
Scene/backdrop: obsidian lacquer header strip, rose quartz corner accents, soft pearl edge light.
Style/medium: premium game UI header strip, black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing.
Composition/framing: very wide 32:3 strip composition, not a square concept image. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs only at edges, corners, and thin borders. No black bars or white bars.
Lighting/mood: controlled contrast, no central glare, no bright wash over overlay zones. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, central emblem blocking overlay zones, badge shapes that look like UI, letterbox bars.
```

### sakura-obsidian-topbar-b

- Slot: `topbar`
- Style: `sakura-obsidian`
- Variant: `b`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/topbar/sakura-obsidian/b/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Sakura Obsidian ultra-wide panoramic header strip for the 120px logical TopBar.
Scene/backdrop: obsidian lacquer header strip, rose quartz corner accents, soft pearl edge light.
Style/medium: premium game UI header strip, black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing.
Composition/framing: very wide 32:3 strip composition, not a square concept image. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs only at edges, corners, and thin borders. No black bars or white bars.
Lighting/mood: controlled contrast, no central glare, no bright wash over overlay zones. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, central emblem blocking overlay zones, badge shapes that look like UI, letterbox bars.
```

### sakura-obsidian-player-zone-a

- Slot: `player-zone`
- Style: `sakura-obsidian`
- Variant: `a`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/player-zone/sakura-obsidian/a/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Sakura Obsidian ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: obsidian player rail, smoked lacquer surface, rose quartz trim only at far edges and corners.
Style/medium: premium game UI environment rail, black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing.
Composition/framing: very wide 96:13 horizontal band, not a square concept image. Keep quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration belongs only near extreme edges, corners, and thin top/bottom borders. No black bars or white bars.
Lighting/mood: readable center lanes, controlled edge highlights. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked card frames, card slots, deck silhouettes, placeholder rectangles, fake controls, labels, numbers, letterbox bars.
```

### sakura-obsidian-player-zone-b

- Slot: `player-zone`
- Style: `sakura-obsidian`
- Variant: `b`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/player-zone/sakura-obsidian/b/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Sakura Obsidian ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: obsidian player rail, smoked lacquer surface, rose quartz trim only at far edges and corners.
Style/medium: premium game UI environment rail, black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing.
Composition/framing: very wide 96:13 horizontal band, not a square concept image. Keep quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration belongs only near extreme edges, corners, and thin top/bottom borders. No black bars or white bars.
Lighting/mood: readable center lanes, controlled edge highlights. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked card frames, card slots, deck silhouettes, placeholder rectangles, fake controls, labels, numbers, letterbox bars.
```

### sakura-obsidian-gem-panel-a

- Slot: `gem-panel`
- Style: `sakura-obsidian`
- Variant: `a`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/gem-panel/sakura-obsidian/a/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Sakura Obsidian square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: black obsidian square board, rose quartz dividers, pearl-lit empty wells aligned to strict grid.
Style/medium: premium board-game UI panel, black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame; no perspective skew.
Lighting/mood: controlled edge highlights, readable cells, no overexposure. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all gems, labels, counts, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked gems, gem tokens, cell icons, click markers, selection rings, symbols inside cells, oversized border.
```

### sakura-obsidian-gem-panel-b

- Slot: `gem-panel`
- Style: `sakura-obsidian`
- Variant: `b`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/gem-panel/sakura-obsidian/b/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Sakura Obsidian square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: black obsidian square board, rose quartz dividers, pearl-lit empty wells aligned to strict grid.
Style/medium: premium board-game UI panel, black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame; no perspective skew.
Lighting/mood: controlled edge highlights, readable cells, no overexposure. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all gems, labels, counts, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, baked gems, gem tokens, cell icons, click markers, selection rings, symbols inside cells, oversized border.
```

### sakura-obsidian-market-card-back-l1-a

- Slot: `market-card-back-l1`
- Style: `sakura-obsidian`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l1/sakura-obsidian/a/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier, visibly simplest in the L1/L2/L3 set for the Sakura Obsidian market card-back family.
Scene/backdrop: sakura obsidian card back, smoked black lacquer center, rose quartz frame, pale pearl highlights.
Style/medium: premium vertical card-back illustration, black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use simple trim, modest accent density, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### sakura-obsidian-market-card-back-l1-b

- Slot: `market-card-back-l1`
- Style: `sakura-obsidian`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l1/sakura-obsidian/b/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier, visibly simplest in the L1/L2/L3 set for the Sakura Obsidian market card-back family.
Scene/backdrop: sakura obsidian card back, smoked black lacquer center, rose quartz frame, pale pearl highlights.
Style/medium: premium vertical card-back illustration, black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use simple trim, modest accent density, calm center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### sakura-obsidian-market-card-back-l2-a

- Slot: `market-card-back-l2`
- Style: `sakura-obsidian`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l2/sakura-obsidian/a/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier, visibly richer than L1 but quieter than L3 in the L1/L2/L3 set for the Sakura Obsidian market card-back family.
Scene/backdrop: sakura obsidian card back, smoked black lacquer center, rose quartz frame, pale pearl highlights.
Style/medium: premium vertical card-back illustration, black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use more ornament than L1, stronger trim, mid-tier accent material. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### sakura-obsidian-market-card-back-l2-b

- Slot: `market-card-back-l2`
- Style: `sakura-obsidian`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l2/sakura-obsidian/b/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier, visibly richer than L1 but quieter than L3 in the L1/L2/L3 set for the Sakura Obsidian market card-back family.
Scene/backdrop: sakura obsidian card back, smoked black lacquer center, rose quartz frame, pale pearl highlights.
Style/medium: premium vertical card-back illustration, black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use more ornament than L1, stronger trim, mid-tier accent material. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### sakura-obsidian-market-card-back-l3-a

- Slot: `market-card-back-l3`
- Style: `sakura-obsidian`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l3/sakura-obsidian/a/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier, most luxurious market deck back in the L1/L2/L3 set for the Sakura Obsidian market card-back family.
Scene/backdrop: sakura obsidian card back, smoked black lacquer center, rose quartz frame, pale pearl highlights.
Style/medium: premium vertical card-back illustration, black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use highest-prestige market ornament, richer glow, denser jewel or metal accents while preserving a readable center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### sakura-obsidian-market-card-back-l3-b

- Slot: `market-card-back-l3`
- Style: `sakura-obsidian`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/market-card-back-l3/sakura-obsidian/b/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier, most luxurious market deck back in the L1/L2/L3 set for the Sakura Obsidian market card-back family.
Scene/backdrop: sakura obsidian card back, smoked black lacquer center, rose quartz frame, pale pearl highlights.
Style/medium: premium vertical card-back illustration, black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing.
Composition/framing: full vertical card back using a shared silhouette, frame language, and material family across L1/L2/L3. Use highest-prestige market ornament, richer glow, denser jewel or metal accents while preserving a readable center. Do not use text, numerals, Roman numerals, or level marks to communicate tier.
Lighting/mood: readable at 150x200 runtime display, controlled highlights, no white wash. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all market labels, counts, levels, deck UI, and overlays. This is a 1086x1448 design/sampling canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, card labels, baked gems, rank symbols, icons that resemble UI.
```

### sakura-obsidian-royal-card-back-a

- Slot: `royal-card-back`
- Style: `sakura-obsidian`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/royal-card-back/sakura-obsidian/a/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal-card-back UI asset, exact 1086x1448 PNG.
Primary request: create a Sakura Obsidian prestige card back for RoyalCourt previews, stronger and more ceremonial than the market backs.
Scene/backdrop: ceremonial sakura obsidian royal card back, black lacquer and rose quartz sovereign frame, richer pearl prestige without readable marks.
Style/medium: premium royal card-back illustration, black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing.
Composition/framing: full vertical prestige card back with powerful sovereign identity, ornate frame, and readable calm center. No baked gameplay UI.
Lighting/mood: controlled prestige glow, readable at 150x200 display, not washed out. Variant A should emphasize the cleanest primary identity for this style.
Constraints: React renders all RoyalCourt labels, card details, counts, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, readable royal text, baked gems, controls, excessive clutter.
```

### sakura-obsidian-royal-card-back-b

- Slot: `royal-card-back`
- Style: `sakura-obsidian`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-extra-styles-candidates/2026-04-27/royal-card-back/sakura-obsidian/b/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal-card-back UI asset, exact 1086x1448 PNG.
Primary request: create a Sakura Obsidian prestige card back for RoyalCourt previews, stronger and more ceremonial than the market backs.
Scene/backdrop: ceremonial sakura obsidian royal card back, black lacquer and rose quartz sovereign frame, richer pearl prestige without readable marks.
Style/medium: premium royal card-back illustration, black obsidian, rose quartz, smoked lacquer, pale pink pearl highlights, elegant Japanese-inspired material restraint without glyphs or writing.
Composition/framing: full vertical prestige card back with powerful sovereign identity, ornate frame, and readable calm center. No baked gameplay UI.
Lighting/mood: controlled prestige glow, readable at 150x200 display, not washed out. Variant B should be a distinct alternate composition with the same material family and constraints.
Constraints: React renders all RoyalCourt labels, card details, counts, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, controls, baked gameplay markers, high-glare wash, noisy functional center, level marks, readable royal text, baked gems, controls, excessive clutter.
```
