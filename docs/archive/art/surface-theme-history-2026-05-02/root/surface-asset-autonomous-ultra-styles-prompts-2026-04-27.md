# Surface Asset Autonomous Ultra-Styles Prompt Manifest - 2026-04-27

This is the fourth autonomous surface-art candidate batch. It intentionally does not overwrite the previous candidate libraries or any runtime assets.

## Scope

- Source workflow: docs/art/long-autonomous-surface-asset-generation-codex-prompt-2026-04-27.md plus C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md.
- Archive root: assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/.
- Candidate count: 4 styles x 8 slots x 2 variants = 64 PNG candidates.
- This is a candidate library only: no runtime asset replacement, no source-code changes, no preview-route changes.
- Workers must use the built-in image_gen path only. No CLI/API fallback is authorized.

## Shared Project Constraints

- Surface runtime assets live under /assets/surfaces/anime-themes/<theme>/<mode>/<filename>.png; this pass archives candidates only.
- shell-background.png is the single full-board background. There is no separate playmat or tablecloth slot.
- TopBar uses a 120px logical header and the candidate target is 3840x360.
- PlayerZone art is rendered with background-size: cover; it must not bake card frames, card slots, deck silhouettes, controls, labels, or numbers.
- Gem panel target is 1254x1254 with grid anchors x=100,305,515,726,938,1141 and y=104,308,512,717,917,1132.
- Featured card artwork uses FEATURED_CARD_SAMPLE_SIZE 1086x1448, downsampled by React into FEATURED_CARD_SIZE 150x200.
- React renders all labels, counts, levels, gems, hover rings, selection states, buttons, badges, card data, and gameplay affordances.
- Global avoid list: no text, no numbers, no Chinese, no English, no Roman numerals, no logo, no watermark, no fake alphabet, no readable script, no fake glyph writing, no UI labels, no counters, no controls, no baked gameplay markers.

## Styles

- `midnight-navigator` - Midnight Navigator: midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings.
- `glacier-silver` - Glacier Silver: deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast.
- `crimson-onyx` - Crimson Onyx: black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material.
- `ivory-verdigris` - Ivory Verdigris: aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft.

## Target Slots

| Slot                  | Required archive filename |      Target |
| --------------------- | ------------------------- | ----------: |
| `shell-background`    | `shell-background.png`    | `3840x2160` |
| `topbar`              | `topbar.png`              |  `3840x360` |
| `player-zone`         | `player-zone.png`         |  `3840x520` |
| `gem-panel`           | `gem-panel.png`           | `1254x1254` |
| `market-card-back-l1` | `market-card-back-l1.png` | `1086x1448` |
| `market-card-back-l2` | `market-card-back-l2.png` | `1086x1448` |
| `market-card-back-l3` | `market-card-back-l3.png` | `1086x1448` |
| `royal-card-back`     | `royal-card-back.png`     | `1086x1448` |

## Worker Assignment

- `midnight-navigator` worker: SAU-MN-SHELL-A, SAU-MN-SHELL-B, SAU-MN-TOP-A, SAU-MN-TOP-B, SAU-MN-PZ-A, SAU-MN-PZ-B, SAU-MN-GP-A, SAU-MN-GP-B, SAU-MN-L1-A, SAU-MN-L1-B, SAU-MN-L2-A, SAU-MN-L2-B, SAU-MN-L3-A, SAU-MN-L3-B, SAU-MN-ROYAL-A, SAU-MN-ROYAL-B
- `glacier-silver` worker: SAU-GS-SHELL-A, SAU-GS-SHELL-B, SAU-GS-TOP-A, SAU-GS-TOP-B, SAU-GS-PZ-A, SAU-GS-PZ-B, SAU-GS-GP-A, SAU-GS-GP-B, SAU-GS-L1-A, SAU-GS-L1-B, SAU-GS-L2-A, SAU-GS-L2-B, SAU-GS-L3-A, SAU-GS-L3-B, SAU-GS-ROYAL-A, SAU-GS-ROYAL-B
- `crimson-onyx` worker: SAU-CO-SHELL-A, SAU-CO-SHELL-B, SAU-CO-TOP-A, SAU-CO-TOP-B, SAU-CO-PZ-A, SAU-CO-PZ-B, SAU-CO-GP-A, SAU-CO-GP-B, SAU-CO-L1-A, SAU-CO-L1-B, SAU-CO-L2-A, SAU-CO-L2-B, SAU-CO-L3-A, SAU-CO-L3-B, SAU-CO-ROYAL-A, SAU-CO-ROYAL-B
- `ivory-verdigris` worker: SAU-IV-SHELL-A, SAU-IV-SHELL-B, SAU-IV-TOP-A, SAU-IV-TOP-B, SAU-IV-PZ-A, SAU-IV-PZ-B, SAU-IV-GP-A, SAU-IV-GP-B, SAU-IV-L1-A, SAU-IV-L1-B, SAU-IV-L2-A, SAU-IV-L2-B, SAU-IV-L3-A, SAU-IV-L3-B, SAU-IV-ROYAL-A, SAU-IV-ROYAL-B

## Prompt Manifest

## Style Group: Midnight Navigator (`midnight-navigator`)

### SAU-MN-SHELL-A

- Style: `midnight-navigator` / Midnight Navigator
- Slot: `shell-background`
- Variant: `A`
- Target dimensions: `3840x2160`
- Required filename: `shell-background.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/shell-background/midnight-navigator/A/shell-background.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, single full-board shell background, exact final PNG target 3840x2160.
Prompt id: SAU-MN-SHELL-A.
Primary request: create a Midnight Navigator style asset for the GemDuel slot shell-background.png. The style identity is midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings. Use brass edge light, deep navy leather, quiet starless polish.
Project constraints: single full-board table surface behind centered gameplay stage; keep the center subdued and low-noise; stronger atmosphere may live on far edges and corners; no separate playmat, tablecloth, card slots, controls, labels, or counters. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be calmer and more environmental, with the center deliberately low contrast for gameplay readability.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, readable maps, map labels, compass letters, coordinates, longitude or latitude labels, chart symbols, glyph writing, navigation text.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-MN-SHELL-B

- Style: `midnight-navigator` / Midnight Navigator
- Slot: `shell-background`
- Variant: `B`
- Target dimensions: `3840x2160`
- Required filename: `shell-background.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/shell-background/midnight-navigator/B/shell-background.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, single full-board shell background, exact final PNG target 3840x2160.
Prompt id: SAU-MN-SHELL-B.
Primary request: create a Midnight Navigator style asset for the GemDuel slot shell-background.png. The style identity is midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings. Use blackened blue enamel, muted bronze rails, subdued orbital geometry.
Project constraints: single full-board table surface behind centered gameplay stage; keep the center subdued and low-noise; stronger atmosphere may live on far edges and corners; no separate playmat, tablecloth, card slots, controls, labels, or counters. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be moodier and deeper at the edges, still with a subdued central play area and no baked gameplay structures.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, readable maps, map labels, compass letters, coordinates, longitude or latitude labels, chart symbols, glyph writing, navigation text.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-MN-TOP-A

- Style: `midnight-navigator` / Midnight Navigator
- Slot: `topbar`
- Variant: `A`
- Target dimensions: `3840x360`
- Required filename: `topbar.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/topbar/midnight-navigator/A/topbar.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, panoramic TopBar skin, exact final PNG target 3840x360.
Prompt id: SAU-MN-TOP-A.
Primary request: create a Midnight Navigator style asset for the GemDuel slot topbar.png. The style identity is midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings. Use brass edge light, deep navy leather, quiet starless polish.
Project constraints: very wide horizontal header strip for a 120px logical top bar; quiet readable zones around 25 percent, 50 percent, and 75 percent width; ornament only near edges, corners, and thin borders; no black bars, white bars, text, icons, counters, or button shapes. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be thin-border focused, with nearly flat readable mid sections and stronger ornament at the far left and right edges.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, readable maps, map labels, compass letters, coordinates, longitude or latitude labels, chart symbols, glyph writing, navigation text.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-MN-TOP-B

- Style: `midnight-navigator` / Midnight Navigator
- Slot: `topbar`
- Variant: `B`
- Target dimensions: `3840x360`
- Required filename: `topbar.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/topbar/midnight-navigator/B/topbar.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, panoramic TopBar skin, exact final PNG target 3840x360.
Prompt id: SAU-MN-TOP-B.
Primary request: create a Midnight Navigator style asset for the GemDuel slot topbar.png. The style identity is midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings. Use blackened blue enamel, muted bronze rails, subdued orbital geometry.
Project constraints: very wide horizontal header strip for a 120px logical top bar; quiet readable zones around 25 percent, 50 percent, and 75 percent width; ornament only near edges, corners, and thin borders; no black bars, white bars, text, icons, counters, or button shapes. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should use a slightly more dimensional rail and corner ornament while preserving three quiet React text zones.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, readable maps, map labels, compass letters, coordinates, longitude or latitude labels, chart symbols, glyph writing, navigation text.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-MN-PZ-A

- Style: `midnight-navigator` / Midnight Navigator
- Slot: `player-zone`
- Variant: `A`
- Target dimensions: `3840x520`
- Required filename: `player-zone.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/player-zone/midnight-navigator/A/player-zone.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, ultra-wide PlayerZone rail skin, exact final PNG target 3840x520.
Prompt id: SAU-MN-PZ-A.
Primary request: create a Midnight Navigator style asset for the GemDuel slot player-zone.png. The style identity is midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings. Use brass edge light, deep navy leather, quiet starless polish.
Project constraints: ultra-wide player rail usable for P1 and P2 anchoring; quiet center bands for React-rendered card stacks, reserved cards, inventory gems, counters, badges, and active-player rings; no baked card frames, card slots, deck silhouettes, controls, labels, numbers, or hover markers. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be especially quiet through the middle third, with decoration limited to extreme ends and a thin bottom rail.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, readable maps, map labels, compass letters, coordinates, longitude or latitude labels, chart symbols, glyph writing, navigation text.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-MN-PZ-B

- Style: `midnight-navigator` / Midnight Navigator
- Slot: `player-zone`
- Variant: `B`
- Target dimensions: `3840x520`
- Required filename: `player-zone.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/player-zone/midnight-navigator/B/player-zone.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, ultra-wide PlayerZone rail skin, exact final PNG target 3840x520.
Prompt id: SAU-MN-PZ-B.
Primary request: create a Midnight Navigator style asset for the GemDuel slot player-zone.png. The style identity is midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings. Use blackened blue enamel, muted bronze rails, subdued orbital geometry.
Project constraints: ultra-wide player rail usable for P1 and P2 anchoring; quiet center bands for React-rendered card stacks, reserved cards, inventory gems, counters, badges, and active-player rings; no baked card frames, card slots, deck silhouettes, controls, labels, numbers, or hover markers. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should use a smoother tabletop rail with asymmetric edge atmosphere, no card placeholders, and no UI silhouettes.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, readable maps, map labels, compass letters, coordinates, longitude or latitude labels, chart symbols, glyph writing, navigation text.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-MN-GP-A

- Style: `midnight-navigator` / Midnight Navigator
- Slot: `gem-panel`
- Variant: `A`
- Target dimensions: `1254x1254`
- Required filename: `gem-panel.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/gem-panel/midnight-navigator/A/gem-panel.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, front-facing square gem board substrate, exact final PNG target 1254x1254.
Prompt id: SAU-MN-GP-A.
Primary request: create a Midnight Navigator style asset for the GemDuel slot gem-panel.png. The style identity is midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings. Use brass edge light, deep navy leather, quiet starless polish.
Project constraints: orthographic square 5x5 board substrate; exact visual grid line anchors: vertical x=100,305,515,726,938,1141 and horizontal y=104,308,512,717,917,1132; empty readable wells only; no baked gems, click markers, symbols, labels, or tokens. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should prioritize exact grid alignment and empty cell readability over decoration.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, readable maps, map labels, compass letters, coordinates, longitude or latitude labels, chart symbols, glyph writing, navigation text.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-MN-GP-B

- Style: `midnight-navigator` / Midnight Navigator
- Slot: `gem-panel`
- Variant: `B`
- Target dimensions: `1254x1254`
- Required filename: `gem-panel.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/gem-panel/midnight-navigator/B/gem-panel.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, front-facing square gem board substrate, exact final PNG target 1254x1254.
Prompt id: SAU-MN-GP-B.
Primary request: create a Midnight Navigator style asset for the GemDuel slot gem-panel.png. The style identity is midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings. Use blackened blue enamel, muted bronze rails, subdued orbital geometry.
Project constraints: orthographic square 5x5 board substrate; exact visual grid line anchors: vertical x=100,305,515,726,938,1141 and horizontal y=104,308,512,717,917,1132; empty readable wells only; no baked gems, click markers, symbols, labels, or tokens. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be a stricter low-noise alternative with crisp divider grooves exactly on the required grid anchors.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, readable maps, map labels, compass letters, coordinates, longitude or latitude labels, chart symbols, glyph writing, navigation text.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-MN-L1-A

- Style: `midnight-navigator` / Midnight Navigator
- Slot: `market-card-back-l1`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l1.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l1/midnight-navigator/A/market-card-back-l1.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, lowest tier, exact final PNG target 1086x1448.
Prompt id: SAU-MN-L1-A.
Primary request: create a Midnight Navigator style asset for the GemDuel slot market-card-back-l1.png. The style identity is midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings. Use brass edge light, deep navy leather, quiet starless polish.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family as the other market backs; visibly simplest tier through lower ornament density and calmer trim only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the simplest member; communicate low tier only through restrained ornament and material quietness, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be plain and disciplined with one central abstract motif and sparse trim.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, readable maps, map labels, compass letters, coordinates, longitude or latitude labels, chart symbols, glyph writing, navigation text.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-MN-L1-B

- Style: `midnight-navigator` / Midnight Navigator
- Slot: `market-card-back-l1`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l1.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l1/midnight-navigator/B/market-card-back-l1.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, lowest tier, exact final PNG target 1086x1448.
Prompt id: SAU-MN-L1-B.
Primary request: create a Midnight Navigator style asset for the GemDuel slot market-card-back-l1.png. The style identity is midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings. Use blackened blue enamel, muted bronze rails, subdued orbital geometry.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family as the other market backs; visibly simplest tier through lower ornament density and calmer trim only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the simplest member; communicate low tier only through restrained ornament and material quietness, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be even more understated, relying on material quality and a clean border rather than decoration.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, readable maps, map labels, compass letters, coordinates, longitude or latitude labels, chart symbols, glyph writing, navigation text.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-MN-L2-A

- Style: `midnight-navigator` / Midnight Navigator
- Slot: `market-card-back-l2`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l2.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l2/midnight-navigator/A/market-card-back-l2.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, middle tier, exact final PNG target 1086x1448.
Prompt id: SAU-MN-L2-A.
Primary request: create a Midnight Navigator style asset for the GemDuel slot market-card-back-l2.png. The style identity is midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings. Use brass edge light, deep navy leather, quiet starless polish.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L3; visibly richer mid-tier accent by material depth and moderate ornament only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must sit between L1 and L3; communicate middle tier only through moderate ornament and accent richness, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should add moderate trim and material contrast while preserving the same silhouette language.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, readable maps, map labels, compass letters, coordinates, longitude or latitude labels, chart symbols, glyph writing, navigation text.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-MN-L2-B

- Style: `midnight-navigator` / Midnight Navigator
- Slot: `market-card-back-l2`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l2.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l2/midnight-navigator/B/market-card-back-l2.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, middle tier, exact final PNG target 1086x1448.
Prompt id: SAU-MN-L2-B.
Primary request: create a Midnight Navigator style asset for the GemDuel slot market-card-back-l2.png. The style identity is midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings. Use blackened blue enamel, muted bronze rails, subdued orbital geometry.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L3; visibly richer mid-tier accent by material depth and moderate ornament only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must sit between L1 and L3; communicate middle tier only through moderate ornament and accent richness, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should read as a richer companion to L1 using mid-density trim and a more confident central abstract motif.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, readable maps, map labels, compass letters, coordinates, longitude or latitude labels, chart symbols, glyph writing, navigation text.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-MN-L3-A

- Style: `midnight-navigator` / Midnight Navigator
- Slot: `market-card-back-l3`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l3.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l3/midnight-navigator/A/market-card-back-l3.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, highest market tier, exact final PNG target 1086x1448.
Prompt id: SAU-MN-L3-A.
Primary request: create a Midnight Navigator style asset for the GemDuel slot market-card-back-l3.png. The style identity is midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings. Use brass edge light, deep navy leather, quiet starless polish.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L2; most luxurious market tier by trim, jewel density, edge glow, and prestige material only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the richest market member; communicate high tier only through premium trim and controlled jewel-like accents, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should feel premium through layered trim and controlled glow without becoming noisy.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, readable maps, map labels, compass letters, coordinates, longitude or latitude labels, chart symbols, glyph writing, navigation text.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-MN-L3-B

- Style: `midnight-navigator` / Midnight Navigator
- Slot: `market-card-back-l3`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l3.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l3/midnight-navigator/B/market-card-back-l3.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, highest market tier, exact final PNG target 1086x1448.
Prompt id: SAU-MN-L3-B.
Primary request: create a Midnight Navigator style asset for the GemDuel slot market-card-back-l3.png. The style identity is midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings. Use blackened blue enamel, muted bronze rails, subdued orbital geometry.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L2; most luxurious market tier by trim, jewel density, edge glow, and prestige material only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the richest market member; communicate high tier only through premium trim and controlled jewel-like accents, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be the most ornate market back but still readable when downsampled to a 150x200 display box.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, readable maps, map labels, compass letters, coordinates, longitude or latitude labels, chart symbols, glyph writing, navigation text.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-MN-ROYAL-A

- Style: `midnight-navigator` / Midnight Navigator
- Slot: `royal-card-back`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `royal-card-back.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/royal-card-back/midnight-navigator/A/royal-card-back.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, royal prestige card back, exact final PNG target 1086x1448.
Prompt id: SAU-MN-ROYAL-A.
Primary request: create a Midnight Navigator style asset for the GemDuel slot royal-card-back.png. The style identity is midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings. Use brass edge light, deep navy leather, quiet starless polish.
Project constraints: sovereign prestige card back for RoyalCourt preview on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; stronger royal identity than market backs through material and composition, not text; no text, numbers, Roman numerals, labels, crown letters, icons, or UI elements. This royal back must feel more sovereign and prestigious than the three market backs while remaining from the same premium GemDuel surface-art universe.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should use a centered sovereign medallion-like abstract shape, stronger frame depth, and no literal text or level marks.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, readable maps, map labels, compass letters, coordinates, longitude or latitude labels, chart symbols, glyph writing, navigation text.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-MN-ROYAL-B

- Style: `midnight-navigator` / Midnight Navigator
- Slot: `royal-card-back`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `royal-card-back.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/royal-card-back/midnight-navigator/B/royal-card-back.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, royal prestige card back, exact final PNG target 1086x1448.
Prompt id: SAU-MN-ROYAL-B.
Primary request: create a Midnight Navigator style asset for the GemDuel slot royal-card-back.png. The style identity is midnight navy lacquer, dark vellum, aged brass, compass-like abstract geometry, captain table mood, no maps or readable chart markings. Use blackened blue enamel, muted bronze rails, subdued orbital geometry.
Project constraints: sovereign prestige card back for RoyalCourt preview on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; stronger royal identity than market backs through material and composition, not text; no text, numbers, Roman numerals, labels, crown letters, icons, or UI elements. This royal back must feel more sovereign and prestigious than the three market backs while remaining from the same premium GemDuel surface-art universe.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be the most ceremonial piece in the style group, with a strong frame and noble material hierarchy but no symbols that look like UI badges.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, readable maps, map labels, compass letters, coordinates, longitude or latitude labels, chart symbols, glyph writing, navigation text.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

## Style Group: Glacier Silver (`glacier-silver`)

### SAU-GS-SHELL-A

- Style: `glacier-silver` / Glacier Silver
- Slot: `shell-background`
- Variant: `A`
- Target dimensions: `3840x2160`
- Required filename: `shell-background.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/shell-background/glacier-silver/A/shell-background.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, single full-board shell background, exact final PNG target 3840x2160.
Prompt id: SAU-GS-SHELL-A.
Primary request: create a Glacier Silver style asset for the GemDuel slot shell-background.png. The style identity is deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast. Use frosted silver trim, smoky blue ice, crisp low-glare glass.
Project constraints: single full-board table surface behind centered gameplay stage; keep the center subdued and low-noise; stronger atmosphere may live on far edges and corners; no separate playmat, tablecloth, card slots, controls, labels, or counters. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be calmer and more environmental, with the center deliberately low contrast for gameplay readability.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, snowflake icons that read as UI markers, whitewash glare, overexposed icy haze, frozen text-like scratches.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-GS-SHELL-B

- Style: `glacier-silver` / Glacier Silver
- Slot: `shell-background`
- Variant: `B`
- Target dimensions: `3840x2160`
- Required filename: `shell-background.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/shell-background/glacier-silver/B/shell-background.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, single full-board shell background, exact final PNG target 3840x2160.
Prompt id: SAU-GS-SHELL-B.
Primary request: create a Glacier Silver style asset for the GemDuel slot shell-background.png. The style identity is deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast. Use deep teal glacier shadow, platinum bevels, controlled cold glow.
Project constraints: single full-board table surface behind centered gameplay stage; keep the center subdued and low-noise; stronger atmosphere may live on far edges and corners; no separate playmat, tablecloth, card slots, controls, labels, or counters. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be moodier and deeper at the edges, still with a subdued central play area and no baked gameplay structures.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, snowflake icons that read as UI markers, whitewash glare, overexposed icy haze, frozen text-like scratches.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-GS-TOP-A

- Style: `glacier-silver` / Glacier Silver
- Slot: `topbar`
- Variant: `A`
- Target dimensions: `3840x360`
- Required filename: `topbar.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/topbar/glacier-silver/A/topbar.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, panoramic TopBar skin, exact final PNG target 3840x360.
Prompt id: SAU-GS-TOP-A.
Primary request: create a Glacier Silver style asset for the GemDuel slot topbar.png. The style identity is deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast. Use frosted silver trim, smoky blue ice, crisp low-glare glass.
Project constraints: very wide horizontal header strip for a 120px logical top bar; quiet readable zones around 25 percent, 50 percent, and 75 percent width; ornament only near edges, corners, and thin borders; no black bars, white bars, text, icons, counters, or button shapes. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be thin-border focused, with nearly flat readable mid sections and stronger ornament at the far left and right edges.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, snowflake icons that read as UI markers, whitewash glare, overexposed icy haze, frozen text-like scratches.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-GS-TOP-B

- Style: `glacier-silver` / Glacier Silver
- Slot: `topbar`
- Variant: `B`
- Target dimensions: `3840x360`
- Required filename: `topbar.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/topbar/glacier-silver/B/topbar.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, panoramic TopBar skin, exact final PNG target 3840x360.
Prompt id: SAU-GS-TOP-B.
Primary request: create a Glacier Silver style asset for the GemDuel slot topbar.png. The style identity is deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast. Use deep teal glacier shadow, platinum bevels, controlled cold glow.
Project constraints: very wide horizontal header strip for a 120px logical top bar; quiet readable zones around 25 percent, 50 percent, and 75 percent width; ornament only near edges, corners, and thin borders; no black bars, white bars, text, icons, counters, or button shapes. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should use a slightly more dimensional rail and corner ornament while preserving three quiet React text zones.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, snowflake icons that read as UI markers, whitewash glare, overexposed icy haze, frozen text-like scratches.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-GS-PZ-A

- Style: `glacier-silver` / Glacier Silver
- Slot: `player-zone`
- Variant: `A`
- Target dimensions: `3840x520`
- Required filename: `player-zone.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/player-zone/glacier-silver/A/player-zone.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, ultra-wide PlayerZone rail skin, exact final PNG target 3840x520.
Prompt id: SAU-GS-PZ-A.
Primary request: create a Glacier Silver style asset for the GemDuel slot player-zone.png. The style identity is deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast. Use frosted silver trim, smoky blue ice, crisp low-glare glass.
Project constraints: ultra-wide player rail usable for P1 and P2 anchoring; quiet center bands for React-rendered card stacks, reserved cards, inventory gems, counters, badges, and active-player rings; no baked card frames, card slots, deck silhouettes, controls, labels, numbers, or hover markers. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be especially quiet through the middle third, with decoration limited to extreme ends and a thin bottom rail.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, snowflake icons that read as UI markers, whitewash glare, overexposed icy haze, frozen text-like scratches.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-GS-PZ-B

- Style: `glacier-silver` / Glacier Silver
- Slot: `player-zone`
- Variant: `B`
- Target dimensions: `3840x520`
- Required filename: `player-zone.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/player-zone/glacier-silver/B/player-zone.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, ultra-wide PlayerZone rail skin, exact final PNG target 3840x520.
Prompt id: SAU-GS-PZ-B.
Primary request: create a Glacier Silver style asset for the GemDuel slot player-zone.png. The style identity is deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast. Use deep teal glacier shadow, platinum bevels, controlled cold glow.
Project constraints: ultra-wide player rail usable for P1 and P2 anchoring; quiet center bands for React-rendered card stacks, reserved cards, inventory gems, counters, badges, and active-player rings; no baked card frames, card slots, deck silhouettes, controls, labels, numbers, or hover markers. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should use a smoother tabletop rail with asymmetric edge atmosphere, no card placeholders, and no UI silhouettes.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, snowflake icons that read as UI markers, whitewash glare, overexposed icy haze, frozen text-like scratches.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-GS-GP-A

- Style: `glacier-silver` / Glacier Silver
- Slot: `gem-panel`
- Variant: `A`
- Target dimensions: `1254x1254`
- Required filename: `gem-panel.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/gem-panel/glacier-silver/A/gem-panel.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, front-facing square gem board substrate, exact final PNG target 1254x1254.
Prompt id: SAU-GS-GP-A.
Primary request: create a Glacier Silver style asset for the GemDuel slot gem-panel.png. The style identity is deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast. Use frosted silver trim, smoky blue ice, crisp low-glare glass.
Project constraints: orthographic square 5x5 board substrate; exact visual grid line anchors: vertical x=100,305,515,726,938,1141 and horizontal y=104,308,512,717,917,1132; empty readable wells only; no baked gems, click markers, symbols, labels, or tokens. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should prioritize exact grid alignment and empty cell readability over decoration.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, snowflake icons that read as UI markers, whitewash glare, overexposed icy haze, frozen text-like scratches.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-GS-GP-B

- Style: `glacier-silver` / Glacier Silver
- Slot: `gem-panel`
- Variant: `B`
- Target dimensions: `1254x1254`
- Required filename: `gem-panel.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/gem-panel/glacier-silver/B/gem-panel.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, front-facing square gem board substrate, exact final PNG target 1254x1254.
Prompt id: SAU-GS-GP-B.
Primary request: create a Glacier Silver style asset for the GemDuel slot gem-panel.png. The style identity is deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast. Use deep teal glacier shadow, platinum bevels, controlled cold glow.
Project constraints: orthographic square 5x5 board substrate; exact visual grid line anchors: vertical x=100,305,515,726,938,1141 and horizontal y=104,308,512,717,917,1132; empty readable wells only; no baked gems, click markers, symbols, labels, or tokens. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be a stricter low-noise alternative with crisp divider grooves exactly on the required grid anchors.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, snowflake icons that read as UI markers, whitewash glare, overexposed icy haze, frozen text-like scratches.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-GS-L1-A

- Style: `glacier-silver` / Glacier Silver
- Slot: `market-card-back-l1`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l1.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l1/glacier-silver/A/market-card-back-l1.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, lowest tier, exact final PNG target 1086x1448.
Prompt id: SAU-GS-L1-A.
Primary request: create a Glacier Silver style asset for the GemDuel slot market-card-back-l1.png. The style identity is deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast. Use frosted silver trim, smoky blue ice, crisp low-glare glass.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family as the other market backs; visibly simplest tier through lower ornament density and calmer trim only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the simplest member; communicate low tier only through restrained ornament and material quietness, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be plain and disciplined with one central abstract motif and sparse trim.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, snowflake icons that read as UI markers, whitewash glare, overexposed icy haze, frozen text-like scratches.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-GS-L1-B

- Style: `glacier-silver` / Glacier Silver
- Slot: `market-card-back-l1`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l1.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l1/glacier-silver/B/market-card-back-l1.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, lowest tier, exact final PNG target 1086x1448.
Prompt id: SAU-GS-L1-B.
Primary request: create a Glacier Silver style asset for the GemDuel slot market-card-back-l1.png. The style identity is deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast. Use deep teal glacier shadow, platinum bevels, controlled cold glow.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family as the other market backs; visibly simplest tier through lower ornament density and calmer trim only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the simplest member; communicate low tier only through restrained ornament and material quietness, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be even more understated, relying on material quality and a clean border rather than decoration.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, snowflake icons that read as UI markers, whitewash glare, overexposed icy haze, frozen text-like scratches.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-GS-L2-A

- Style: `glacier-silver` / Glacier Silver
- Slot: `market-card-back-l2`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l2.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l2/glacier-silver/A/market-card-back-l2.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, middle tier, exact final PNG target 1086x1448.
Prompt id: SAU-GS-L2-A.
Primary request: create a Glacier Silver style asset for the GemDuel slot market-card-back-l2.png. The style identity is deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast. Use frosted silver trim, smoky blue ice, crisp low-glare glass.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L3; visibly richer mid-tier accent by material depth and moderate ornament only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must sit between L1 and L3; communicate middle tier only through moderate ornament and accent richness, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should add moderate trim and material contrast while preserving the same silhouette language.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, snowflake icons that read as UI markers, whitewash glare, overexposed icy haze, frozen text-like scratches.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-GS-L2-B

- Style: `glacier-silver` / Glacier Silver
- Slot: `market-card-back-l2`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l2.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l2/glacier-silver/B/market-card-back-l2.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, middle tier, exact final PNG target 1086x1448.
Prompt id: SAU-GS-L2-B.
Primary request: create a Glacier Silver style asset for the GemDuel slot market-card-back-l2.png. The style identity is deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast. Use deep teal glacier shadow, platinum bevels, controlled cold glow.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L3; visibly richer mid-tier accent by material depth and moderate ornament only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must sit between L1 and L3; communicate middle tier only through moderate ornament and accent richness, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should read as a richer companion to L1 using mid-density trim and a more confident central abstract motif.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, snowflake icons that read as UI markers, whitewash glare, overexposed icy haze, frozen text-like scratches.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-GS-L3-A

- Style: `glacier-silver` / Glacier Silver
- Slot: `market-card-back-l3`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l3.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l3/glacier-silver/A/market-card-back-l3.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, highest market tier, exact final PNG target 1086x1448.
Prompt id: SAU-GS-L3-A.
Primary request: create a Glacier Silver style asset for the GemDuel slot market-card-back-l3.png. The style identity is deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast. Use frosted silver trim, smoky blue ice, crisp low-glare glass.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L2; most luxurious market tier by trim, jewel density, edge glow, and prestige material only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the richest market member; communicate high tier only through premium trim and controlled jewel-like accents, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should feel premium through layered trim and controlled glow without becoming noisy.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, snowflake icons that read as UI markers, whitewash glare, overexposed icy haze, frozen text-like scratches.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-GS-L3-B

- Style: `glacier-silver` / Glacier Silver
- Slot: `market-card-back-l3`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l3.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l3/glacier-silver/B/market-card-back-l3.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, highest market tier, exact final PNG target 1086x1448.
Prompt id: SAU-GS-L3-B.
Primary request: create a Glacier Silver style asset for the GemDuel slot market-card-back-l3.png. The style identity is deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast. Use deep teal glacier shadow, platinum bevels, controlled cold glow.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L2; most luxurious market tier by trim, jewel density, edge glow, and prestige material only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the richest market member; communicate high tier only through premium trim and controlled jewel-like accents, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be the most ornate market back but still readable when downsampled to a 150x200 display box.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, snowflake icons that read as UI markers, whitewash glare, overexposed icy haze, frozen text-like scratches.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-GS-ROYAL-A

- Style: `glacier-silver` / Glacier Silver
- Slot: `royal-card-back`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `royal-card-back.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/royal-card-back/glacier-silver/A/royal-card-back.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, royal prestige card back, exact final PNG target 1086x1448.
Prompt id: SAU-GS-ROYAL-A.
Primary request: create a Glacier Silver style asset for the GemDuel slot royal-card-back.png. The style identity is deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast. Use frosted silver trim, smoky blue ice, crisp low-glare glass.
Project constraints: sovereign prestige card back for RoyalCourt preview on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; stronger royal identity than market backs through material and composition, not text; no text, numbers, Roman numerals, labels, crown letters, icons, or UI elements. This royal back must feel more sovereign and prestigious than the three market backs while remaining from the same premium GemDuel surface-art universe.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should use a centered sovereign medallion-like abstract shape, stronger frame depth, and no literal text or level marks.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, snowflake icons that read as UI markers, whitewash glare, overexposed icy haze, frozen text-like scratches.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-GS-ROYAL-B

- Style: `glacier-silver` / Glacier Silver
- Slot: `royal-card-back`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `royal-card-back.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/royal-card-back/glacier-silver/B/royal-card-back.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, royal prestige card back, exact final PNG target 1086x1448.
Prompt id: SAU-GS-ROYAL-B.
Primary request: create a Glacier Silver style asset for the GemDuel slot royal-card-back.png. The style identity is deep glacial blue, frosted silver, smoky ice glass, cold crystal facets, dark enough for foreground contrast. Use deep teal glacier shadow, platinum bevels, controlled cold glow.
Project constraints: sovereign prestige card back for RoyalCourt preview on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; stronger royal identity than market backs through material and composition, not text; no text, numbers, Roman numerals, labels, crown letters, icons, or UI elements. This royal back must feel more sovereign and prestigious than the three market backs while remaining from the same premium GemDuel surface-art universe.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be the most ceremonial piece in the style group, with a strong frame and noble material hierarchy but no symbols that look like UI badges.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, snowflake icons that read as UI markers, whitewash glare, overexposed icy haze, frozen text-like scratches.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

## Style Group: Crimson Onyx (`crimson-onyx`)

### SAU-CO-SHELL-A

- Style: `crimson-onyx` / Crimson Onyx
- Slot: `shell-background`
- Variant: `A`
- Target dimensions: `3840x2160`
- Required filename: `shell-background.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/shell-background/crimson-onyx/A/shell-background.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, single full-board shell background, exact final PNG target 3840x2160.
Prompt id: SAU-CO-SHELL-A.
Primary request: create a Crimson Onyx style asset for the GemDuel slot shell-background.png. The style identity is black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material. Use polished onyx plates, thin crimson inlay, gunmetal shadow.
Project constraints: single full-board table surface behind centered gameplay stage; keep the center subdued and low-noise; stronger atmosphere may live on far edges and corners; no separate playmat, tablecloth, card slots, controls, labels, or counters. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be calmer and more environmental, with the center deliberately low contrast for gameplay readability.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, blood imagery, horror marks, readable runes, excessive red haze, bright orange fire wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-CO-SHELL-B

- Style: `crimson-onyx` / Crimson Onyx
- Slot: `shell-background`
- Variant: `B`
- Target dimensions: `3840x2160`
- Required filename: `shell-background.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/shell-background/crimson-onyx/B/shell-background.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, single full-board shell background, exact final PNG target 3840x2160.
Prompt id: SAU-CO-SHELL-B.
Primary request: create a Crimson Onyx style asset for the GemDuel slot shell-background.png. The style identity is black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material. Use dark ruby lacquer, black steel frame, restrained ember rim light.
Project constraints: single full-board table surface behind centered gameplay stage; keep the center subdued and low-noise; stronger atmosphere may live on far edges and corners; no separate playmat, tablecloth, card slots, controls, labels, or counters. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be moodier and deeper at the edges, still with a subdued central play area and no baked gameplay structures.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, blood imagery, horror marks, readable runes, excessive red haze, bright orange fire wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-CO-TOP-A

- Style: `crimson-onyx` / Crimson Onyx
- Slot: `topbar`
- Variant: `A`
- Target dimensions: `3840x360`
- Required filename: `topbar.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/topbar/crimson-onyx/A/topbar.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, panoramic TopBar skin, exact final PNG target 3840x360.
Prompt id: SAU-CO-TOP-A.
Primary request: create a Crimson Onyx style asset for the GemDuel slot topbar.png. The style identity is black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material. Use polished onyx plates, thin crimson inlay, gunmetal shadow.
Project constraints: very wide horizontal header strip for a 120px logical top bar; quiet readable zones around 25 percent, 50 percent, and 75 percent width; ornament only near edges, corners, and thin borders; no black bars, white bars, text, icons, counters, or button shapes. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be thin-border focused, with nearly flat readable mid sections and stronger ornament at the far left and right edges.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, blood imagery, horror marks, readable runes, excessive red haze, bright orange fire wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-CO-TOP-B

- Style: `crimson-onyx` / Crimson Onyx
- Slot: `topbar`
- Variant: `B`
- Target dimensions: `3840x360`
- Required filename: `topbar.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/topbar/crimson-onyx/B/topbar.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, panoramic TopBar skin, exact final PNG target 3840x360.
Prompt id: SAU-CO-TOP-B.
Primary request: create a Crimson Onyx style asset for the GemDuel slot topbar.png. The style identity is black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material. Use dark ruby lacquer, black steel frame, restrained ember rim light.
Project constraints: very wide horizontal header strip for a 120px logical top bar; quiet readable zones around 25 percent, 50 percent, and 75 percent width; ornament only near edges, corners, and thin borders; no black bars, white bars, text, icons, counters, or button shapes. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should use a slightly more dimensional rail and corner ornament while preserving three quiet React text zones.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, blood imagery, horror marks, readable runes, excessive red haze, bright orange fire wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-CO-PZ-A

- Style: `crimson-onyx` / Crimson Onyx
- Slot: `player-zone`
- Variant: `A`
- Target dimensions: `3840x520`
- Required filename: `player-zone.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/player-zone/crimson-onyx/A/player-zone.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, ultra-wide PlayerZone rail skin, exact final PNG target 3840x520.
Prompt id: SAU-CO-PZ-A.
Primary request: create a Crimson Onyx style asset for the GemDuel slot player-zone.png. The style identity is black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material. Use polished onyx plates, thin crimson inlay, gunmetal shadow.
Project constraints: ultra-wide player rail usable for P1 and P2 anchoring; quiet center bands for React-rendered card stacks, reserved cards, inventory gems, counters, badges, and active-player rings; no baked card frames, card slots, deck silhouettes, controls, labels, numbers, or hover markers. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be especially quiet through the middle third, with decoration limited to extreme ends and a thin bottom rail.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, blood imagery, horror marks, readable runes, excessive red haze, bright orange fire wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-CO-PZ-B

- Style: `crimson-onyx` / Crimson Onyx
- Slot: `player-zone`
- Variant: `B`
- Target dimensions: `3840x520`
- Required filename: `player-zone.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/player-zone/crimson-onyx/B/player-zone.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, ultra-wide PlayerZone rail skin, exact final PNG target 3840x520.
Prompt id: SAU-CO-PZ-B.
Primary request: create a Crimson Onyx style asset for the GemDuel slot player-zone.png. The style identity is black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material. Use dark ruby lacquer, black steel frame, restrained ember rim light.
Project constraints: ultra-wide player rail usable for P1 and P2 anchoring; quiet center bands for React-rendered card stacks, reserved cards, inventory gems, counters, badges, and active-player rings; no baked card frames, card slots, deck silhouettes, controls, labels, numbers, or hover markers. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should use a smoother tabletop rail with asymmetric edge atmosphere, no card placeholders, and no UI silhouettes.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, blood imagery, horror marks, readable runes, excessive red haze, bright orange fire wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-CO-GP-A

- Style: `crimson-onyx` / Crimson Onyx
- Slot: `gem-panel`
- Variant: `A`
- Target dimensions: `1254x1254`
- Required filename: `gem-panel.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/gem-panel/crimson-onyx/A/gem-panel.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, front-facing square gem board substrate, exact final PNG target 1254x1254.
Prompt id: SAU-CO-GP-A.
Primary request: create a Crimson Onyx style asset for the GemDuel slot gem-panel.png. The style identity is black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material. Use polished onyx plates, thin crimson inlay, gunmetal shadow.
Project constraints: orthographic square 5x5 board substrate; exact visual grid line anchors: vertical x=100,305,515,726,938,1141 and horizontal y=104,308,512,717,917,1132; empty readable wells only; no baked gems, click markers, symbols, labels, or tokens. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should prioritize exact grid alignment and empty cell readability over decoration.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, blood imagery, horror marks, readable runes, excessive red haze, bright orange fire wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-CO-GP-B

- Style: `crimson-onyx` / Crimson Onyx
- Slot: `gem-panel`
- Variant: `B`
- Target dimensions: `1254x1254`
- Required filename: `gem-panel.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/gem-panel/crimson-onyx/B/gem-panel.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, front-facing square gem board substrate, exact final PNG target 1254x1254.
Prompt id: SAU-CO-GP-B.
Primary request: create a Crimson Onyx style asset for the GemDuel slot gem-panel.png. The style identity is black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material. Use dark ruby lacquer, black steel frame, restrained ember rim light.
Project constraints: orthographic square 5x5 board substrate; exact visual grid line anchors: vertical x=100,305,515,726,938,1141 and horizontal y=104,308,512,717,917,1132; empty readable wells only; no baked gems, click markers, symbols, labels, or tokens. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be a stricter low-noise alternative with crisp divider grooves exactly on the required grid anchors.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, blood imagery, horror marks, readable runes, excessive red haze, bright orange fire wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-CO-L1-A

- Style: `crimson-onyx` / Crimson Onyx
- Slot: `market-card-back-l1`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l1.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l1/crimson-onyx/A/market-card-back-l1.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, lowest tier, exact final PNG target 1086x1448.
Prompt id: SAU-CO-L1-A.
Primary request: create a Crimson Onyx style asset for the GemDuel slot market-card-back-l1.png. The style identity is black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material. Use polished onyx plates, thin crimson inlay, gunmetal shadow.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family as the other market backs; visibly simplest tier through lower ornament density and calmer trim only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the simplest member; communicate low tier only through restrained ornament and material quietness, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be plain and disciplined with one central abstract motif and sparse trim.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, blood imagery, horror marks, readable runes, excessive red haze, bright orange fire wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-CO-L1-B

- Style: `crimson-onyx` / Crimson Onyx
- Slot: `market-card-back-l1`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l1.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l1/crimson-onyx/B/market-card-back-l1.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, lowest tier, exact final PNG target 1086x1448.
Prompt id: SAU-CO-L1-B.
Primary request: create a Crimson Onyx style asset for the GemDuel slot market-card-back-l1.png. The style identity is black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material. Use dark ruby lacquer, black steel frame, restrained ember rim light.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family as the other market backs; visibly simplest tier through lower ornament density and calmer trim only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the simplest member; communicate low tier only through restrained ornament and material quietness, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be even more understated, relying on material quality and a clean border rather than decoration.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, blood imagery, horror marks, readable runes, excessive red haze, bright orange fire wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-CO-L2-A

- Style: `crimson-onyx` / Crimson Onyx
- Slot: `market-card-back-l2`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l2.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l2/crimson-onyx/A/market-card-back-l2.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, middle tier, exact final PNG target 1086x1448.
Prompt id: SAU-CO-L2-A.
Primary request: create a Crimson Onyx style asset for the GemDuel slot market-card-back-l2.png. The style identity is black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material. Use polished onyx plates, thin crimson inlay, gunmetal shadow.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L3; visibly richer mid-tier accent by material depth and moderate ornament only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must sit between L1 and L3; communicate middle tier only through moderate ornament and accent richness, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should add moderate trim and material contrast while preserving the same silhouette language.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, blood imagery, horror marks, readable runes, excessive red haze, bright orange fire wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-CO-L2-B

- Style: `crimson-onyx` / Crimson Onyx
- Slot: `market-card-back-l2`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l2.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l2/crimson-onyx/B/market-card-back-l2.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, middle tier, exact final PNG target 1086x1448.
Prompt id: SAU-CO-L2-B.
Primary request: create a Crimson Onyx style asset for the GemDuel slot market-card-back-l2.png. The style identity is black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material. Use dark ruby lacquer, black steel frame, restrained ember rim light.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L3; visibly richer mid-tier accent by material depth and moderate ornament only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must sit between L1 and L3; communicate middle tier only through moderate ornament and accent richness, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should read as a richer companion to L1 using mid-density trim and a more confident central abstract motif.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, blood imagery, horror marks, readable runes, excessive red haze, bright orange fire wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-CO-L3-A

- Style: `crimson-onyx` / Crimson Onyx
- Slot: `market-card-back-l3`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l3.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l3/crimson-onyx/A/market-card-back-l3.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, highest market tier, exact final PNG target 1086x1448.
Prompt id: SAU-CO-L3-A.
Primary request: create a Crimson Onyx style asset for the GemDuel slot market-card-back-l3.png. The style identity is black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material. Use polished onyx plates, thin crimson inlay, gunmetal shadow.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L2; most luxurious market tier by trim, jewel density, edge glow, and prestige material only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the richest market member; communicate high tier only through premium trim and controlled jewel-like accents, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should feel premium through layered trim and controlled glow without becoming noisy.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, blood imagery, horror marks, readable runes, excessive red haze, bright orange fire wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-CO-L3-B

- Style: `crimson-onyx` / Crimson Onyx
- Slot: `market-card-back-l3`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l3.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l3/crimson-onyx/B/market-card-back-l3.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, highest market tier, exact final PNG target 1086x1448.
Prompt id: SAU-CO-L3-B.
Primary request: create a Crimson Onyx style asset for the GemDuel slot market-card-back-l3.png. The style identity is black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material. Use dark ruby lacquer, black steel frame, restrained ember rim light.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L2; most luxurious market tier by trim, jewel density, edge glow, and prestige material only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the richest market member; communicate high tier only through premium trim and controlled jewel-like accents, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be the most ornate market back but still readable when downsampled to a 150x200 display box.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, blood imagery, horror marks, readable runes, excessive red haze, bright orange fire wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-CO-ROYAL-A

- Style: `crimson-onyx` / Crimson Onyx
- Slot: `royal-card-back`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `royal-card-back.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/royal-card-back/crimson-onyx/A/royal-card-back.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, royal prestige card back, exact final PNG target 1086x1448.
Prompt id: SAU-CO-ROYAL-A.
Primary request: create a Crimson Onyx style asset for the GemDuel slot royal-card-back.png. The style identity is black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material. Use polished onyx plates, thin crimson inlay, gunmetal shadow.
Project constraints: sovereign prestige card back for RoyalCourt preview on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; stronger royal identity than market backs through material and composition, not text; no text, numbers, Roman numerals, labels, crown letters, icons, or UI elements. This royal back must feel more sovereign and prestigious than the three market backs while remaining from the same premium GemDuel surface-art universe.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should use a centered sovereign medallion-like abstract shape, stronger frame depth, and no literal text or level marks.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, blood imagery, horror marks, readable runes, excessive red haze, bright orange fire wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-CO-ROYAL-B

- Style: `crimson-onyx` / Crimson Onyx
- Slot: `royal-card-back`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `royal-card-back.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/royal-card-back/crimson-onyx/B/royal-card-back.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, royal prestige card back, exact final PNG target 1086x1448.
Prompt id: SAU-CO-ROYAL-B.
Primary request: create a Crimson Onyx style asset for the GemDuel slot royal-card-back.png. The style identity is black onyx, deep crimson enamel, gunmetal bevels, ruby edge light, sober high-prestige fantasy table material. Use dark ruby lacquer, black steel frame, restrained ember rim light.
Project constraints: sovereign prestige card back for RoyalCourt preview on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; stronger royal identity than market backs through material and composition, not text; no text, numbers, Roman numerals, labels, crown letters, icons, or UI elements. This royal back must feel more sovereign and prestigious than the three market backs while remaining from the same premium GemDuel surface-art universe.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be the most ceremonial piece in the style group, with a strong frame and noble material hierarchy but no symbols that look like UI badges.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, blood imagery, horror marks, readable runes, excessive red haze, bright orange fire wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

## Style Group: Ivory Verdigris (`ivory-verdigris`)

### SAU-IV-SHELL-A

- Style: `ivory-verdigris` / Ivory Verdigris
- Slot: `shell-background`
- Variant: `A`
- Target dimensions: `3840x2160`
- Required filename: `shell-background.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/shell-background/ivory-verdigris/A/shell-background.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, single full-board shell background, exact final PNG target 3840x2160.
Prompt id: SAU-IV-SHELL-A.
Primary request: create a Ivory Verdigris style asset for the GemDuel slot shell-background.png. The style identity is aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft. Use ivory stone grain, oxidized copper trim, soft teal patina.
Project constraints: single full-board table surface behind centered gameplay stage; keep the center subdued and low-noise; stronger atmosphere may live on far edges and corners; no separate playmat, tablecloth, card slots, controls, labels, or counters. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be calmer and more environmental, with the center deliberately low contrast for gameplay readability.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, paper labels, map-like inscriptions, bright chalky wash, museum placards, decorative writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-IV-SHELL-B

- Style: `ivory-verdigris` / Ivory Verdigris
- Slot: `shell-background`
- Variant: `B`
- Target dimensions: `3840x2160`
- Required filename: `shell-background.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/shell-background/ivory-verdigris/B/shell-background.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, single full-board shell background, exact final PNG target 3840x2160.
Prompt id: SAU-IV-SHELL-B.
Primary request: create a Ivory Verdigris style asset for the GemDuel slot shell-background.png. The style identity is aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft. Use aged marble, worn bronze-green edge work, restrained pearl highlights.
Project constraints: single full-board table surface behind centered gameplay stage; keep the center subdued and low-noise; stronger atmosphere may live on far edges and corners; no separate playmat, tablecloth, card slots, controls, labels, or counters. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be moodier and deeper at the edges, still with a subdued central play area and no baked gameplay structures.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, paper labels, map-like inscriptions, bright chalky wash, museum placards, decorative writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-IV-TOP-A

- Style: `ivory-verdigris` / Ivory Verdigris
- Slot: `topbar`
- Variant: `A`
- Target dimensions: `3840x360`
- Required filename: `topbar.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/topbar/ivory-verdigris/A/topbar.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, panoramic TopBar skin, exact final PNG target 3840x360.
Prompt id: SAU-IV-TOP-A.
Primary request: create a Ivory Verdigris style asset for the GemDuel slot topbar.png. The style identity is aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft. Use ivory stone grain, oxidized copper trim, soft teal patina.
Project constraints: very wide horizontal header strip for a 120px logical top bar; quiet readable zones around 25 percent, 50 percent, and 75 percent width; ornament only near edges, corners, and thin borders; no black bars, white bars, text, icons, counters, or button shapes. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be thin-border focused, with nearly flat readable mid sections and stronger ornament at the far left and right edges.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, paper labels, map-like inscriptions, bright chalky wash, museum placards, decorative writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-IV-TOP-B

- Style: `ivory-verdigris` / Ivory Verdigris
- Slot: `topbar`
- Variant: `B`
- Target dimensions: `3840x360`
- Required filename: `topbar.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/topbar/ivory-verdigris/B/topbar.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, panoramic TopBar skin, exact final PNG target 3840x360.
Prompt id: SAU-IV-TOP-B.
Primary request: create a Ivory Verdigris style asset for the GemDuel slot topbar.png. The style identity is aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft. Use aged marble, worn bronze-green edge work, restrained pearl highlights.
Project constraints: very wide horizontal header strip for a 120px logical top bar; quiet readable zones around 25 percent, 50 percent, and 75 percent width; ornament only near edges, corners, and thin borders; no black bars, white bars, text, icons, counters, or button shapes. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should use a slightly more dimensional rail and corner ornament while preserving three quiet React text zones.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, paper labels, map-like inscriptions, bright chalky wash, museum placards, decorative writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-IV-PZ-A

- Style: `ivory-verdigris` / Ivory Verdigris
- Slot: `player-zone`
- Variant: `A`
- Target dimensions: `3840x520`
- Required filename: `player-zone.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/player-zone/ivory-verdigris/A/player-zone.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, ultra-wide PlayerZone rail skin, exact final PNG target 3840x520.
Prompt id: SAU-IV-PZ-A.
Primary request: create a Ivory Verdigris style asset for the GemDuel slot player-zone.png. The style identity is aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft. Use ivory stone grain, oxidized copper trim, soft teal patina.
Project constraints: ultra-wide player rail usable for P1 and P2 anchoring; quiet center bands for React-rendered card stacks, reserved cards, inventory gems, counters, badges, and active-player rings; no baked card frames, card slots, deck silhouettes, controls, labels, numbers, or hover markers. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be especially quiet through the middle third, with decoration limited to extreme ends and a thin bottom rail.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, paper labels, map-like inscriptions, bright chalky wash, museum placards, decorative writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-IV-PZ-B

- Style: `ivory-verdigris` / Ivory Verdigris
- Slot: `player-zone`
- Variant: `B`
- Target dimensions: `3840x520`
- Required filename: `player-zone.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/player-zone/ivory-verdigris/B/player-zone.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, ultra-wide PlayerZone rail skin, exact final PNG target 3840x520.
Prompt id: SAU-IV-PZ-B.
Primary request: create a Ivory Verdigris style asset for the GemDuel slot player-zone.png. The style identity is aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft. Use aged marble, worn bronze-green edge work, restrained pearl highlights.
Project constraints: ultra-wide player rail usable for P1 and P2 anchoring; quiet center bands for React-rendered card stacks, reserved cards, inventory gems, counters, badges, and active-player rings; no baked card frames, card slots, deck silhouettes, controls, labels, numbers, or hover markers. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should use a smoother tabletop rail with asymmetric edge atmosphere, no card placeholders, and no UI silhouettes.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, paper labels, map-like inscriptions, bright chalky wash, museum placards, decorative writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-IV-GP-A

- Style: `ivory-verdigris` / Ivory Verdigris
- Slot: `gem-panel`
- Variant: `A`
- Target dimensions: `1254x1254`
- Required filename: `gem-panel.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/gem-panel/ivory-verdigris/A/gem-panel.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, front-facing square gem board substrate, exact final PNG target 1254x1254.
Prompt id: SAU-IV-GP-A.
Primary request: create a Ivory Verdigris style asset for the GemDuel slot gem-panel.png. The style identity is aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft. Use ivory stone grain, oxidized copper trim, soft teal patina.
Project constraints: orthographic square 5x5 board substrate; exact visual grid line anchors: vertical x=100,305,515,726,938,1141 and horizontal y=104,308,512,717,917,1132; empty readable wells only; no baked gems, click markers, symbols, labels, or tokens. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should prioritize exact grid alignment and empty cell readability over decoration.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, paper labels, map-like inscriptions, bright chalky wash, museum placards, decorative writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-IV-GP-B

- Style: `ivory-verdigris` / Ivory Verdigris
- Slot: `gem-panel`
- Variant: `B`
- Target dimensions: `1254x1254`
- Required filename: `gem-panel.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/gem-panel/ivory-verdigris/B/gem-panel.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, front-facing square gem board substrate, exact final PNG target 1254x1254.
Prompt id: SAU-IV-GP-B.
Primary request: create a Ivory Verdigris style asset for the GemDuel slot gem-panel.png. The style identity is aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft. Use aged marble, worn bronze-green edge work, restrained pearl highlights.
Project constraints: orthographic square 5x5 board substrate; exact visual grid line anchors: vertical x=100,305,515,726,938,1141 and horizontal y=104,308,512,717,917,1132; empty readable wells only; no baked gems, click markers, symbols, labels, or tokens. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be a stricter low-noise alternative with crisp divider grooves exactly on the required grid anchors.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, paper labels, map-like inscriptions, bright chalky wash, museum placards, decorative writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-IV-L1-A

- Style: `ivory-verdigris` / Ivory Verdigris
- Slot: `market-card-back-l1`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l1.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l1/ivory-verdigris/A/market-card-back-l1.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, lowest tier, exact final PNG target 1086x1448.
Prompt id: SAU-IV-L1-A.
Primary request: create a Ivory Verdigris style asset for the GemDuel slot market-card-back-l1.png. The style identity is aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft. Use ivory stone grain, oxidized copper trim, soft teal patina.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family as the other market backs; visibly simplest tier through lower ornament density and calmer trim only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the simplest member; communicate low tier only through restrained ornament and material quietness, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be plain and disciplined with one central abstract motif and sparse trim.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, paper labels, map-like inscriptions, bright chalky wash, museum placards, decorative writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-IV-L1-B

- Style: `ivory-verdigris` / Ivory Verdigris
- Slot: `market-card-back-l1`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l1.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l1/ivory-verdigris/B/market-card-back-l1.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, lowest tier, exact final PNG target 1086x1448.
Prompt id: SAU-IV-L1-B.
Primary request: create a Ivory Verdigris style asset for the GemDuel slot market-card-back-l1.png. The style identity is aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft. Use aged marble, worn bronze-green edge work, restrained pearl highlights.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family as the other market backs; visibly simplest tier through lower ornament density and calmer trim only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the simplest member; communicate low tier only through restrained ornament and material quietness, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be even more understated, relying on material quality and a clean border rather than decoration.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, paper labels, map-like inscriptions, bright chalky wash, museum placards, decorative writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-IV-L2-A

- Style: `ivory-verdigris` / Ivory Verdigris
- Slot: `market-card-back-l2`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l2.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l2/ivory-verdigris/A/market-card-back-l2.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, middle tier, exact final PNG target 1086x1448.
Prompt id: SAU-IV-L2-A.
Primary request: create a Ivory Verdigris style asset for the GemDuel slot market-card-back-l2.png. The style identity is aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft. Use ivory stone grain, oxidized copper trim, soft teal patina.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L3; visibly richer mid-tier accent by material depth and moderate ornament only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must sit between L1 and L3; communicate middle tier only through moderate ornament and accent richness, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should add moderate trim and material contrast while preserving the same silhouette language.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, paper labels, map-like inscriptions, bright chalky wash, museum placards, decorative writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-IV-L2-B

- Style: `ivory-verdigris` / Ivory Verdigris
- Slot: `market-card-back-l2`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l2.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l2/ivory-verdigris/B/market-card-back-l2.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, middle tier, exact final PNG target 1086x1448.
Prompt id: SAU-IV-L2-B.
Primary request: create a Ivory Verdigris style asset for the GemDuel slot market-card-back-l2.png. The style identity is aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft. Use aged marble, worn bronze-green edge work, restrained pearl highlights.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L3; visibly richer mid-tier accent by material depth and moderate ornament only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must sit between L1 and L3; communicate middle tier only through moderate ornament and accent richness, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should read as a richer companion to L1 using mid-density trim and a more confident central abstract motif.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, paper labels, map-like inscriptions, bright chalky wash, museum placards, decorative writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-IV-L3-A

- Style: `ivory-verdigris` / Ivory Verdigris
- Slot: `market-card-back-l3`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l3.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l3/ivory-verdigris/A/market-card-back-l3.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, highest market tier, exact final PNG target 1086x1448.
Prompt id: SAU-IV-L3-A.
Primary request: create a Ivory Verdigris style asset for the GemDuel slot market-card-back-l3.png. The style identity is aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft. Use ivory stone grain, oxidized copper trim, soft teal patina.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L2; most luxurious market tier by trim, jewel density, edge glow, and prestige material only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the richest market member; communicate high tier only through premium trim and controlled jewel-like accents, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should feel premium through layered trim and controlled glow without becoming noisy.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, paper labels, map-like inscriptions, bright chalky wash, museum placards, decorative writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-IV-L3-B

- Style: `ivory-verdigris` / Ivory Verdigris
- Slot: `market-card-back-l3`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l3.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/market-card-back-l3/ivory-verdigris/B/market-card-back-l3.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, highest market tier, exact final PNG target 1086x1448.
Prompt id: SAU-IV-L3-B.
Primary request: create a Ivory Verdigris style asset for the GemDuel slot market-card-back-l3.png. The style identity is aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft. Use aged marble, worn bronze-green edge work, restrained pearl highlights.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L2; most luxurious market tier by trim, jewel density, edge glow, and prestige material only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the richest market member; communicate high tier only through premium trim and controlled jewel-like accents, never through text or numerals.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be the most ornate market back but still readable when downsampled to a 150x200 display box.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, paper labels, map-like inscriptions, bright chalky wash, museum placards, decorative writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-IV-ROYAL-A

- Style: `ivory-verdigris` / Ivory Verdigris
- Slot: `royal-card-back`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `royal-card-back.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/royal-card-back/ivory-verdigris/A/royal-card-back.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, royal prestige card back, exact final PNG target 1086x1448.
Prompt id: SAU-IV-ROYAL-A.
Primary request: create a Ivory Verdigris style asset for the GemDuel slot royal-card-back.png. The style identity is aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft. Use ivory stone grain, oxidized copper trim, soft teal patina.
Project constraints: sovereign prestige card back for RoyalCourt preview on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; stronger royal identity than market backs through material and composition, not text; no text, numbers, Roman numerals, labels, crown letters, icons, or UI elements. This royal back must feel more sovereign and prestigious than the three market backs while remaining from the same premium GemDuel surface-art universe.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should use a centered sovereign medallion-like abstract shape, stronger frame depth, and no literal text or level marks.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, paper labels, map-like inscriptions, bright chalky wash, museum placards, decorative writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAU-IV-ROYAL-B

- Style: `ivory-verdigris` / Ivory Verdigris
- Slot: `royal-card-back`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `royal-card-back.png`
- Planned archive path: `assets/art-library/surface-autonomous-ultra-styles-candidates/2026-04-27/royal-card-back/ivory-verdigris/B/royal-card-back.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, royal prestige card back, exact final PNG target 1086x1448.
Prompt id: SAU-IV-ROYAL-B.
Primary request: create a Ivory Verdigris style asset for the GemDuel slot royal-card-back.png. The style identity is aged ivory stone, patinated verdigris copper, muted teal oxide, antique marble, warm neutral game-table craft. Use aged marble, worn bronze-green edge work, restrained pearl highlights.
Project constraints: sovereign prestige card back for RoyalCourt preview on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; stronger royal identity than market backs through material and composition, not text; no text, numbers, Roman numerals, labels, crown letters, icons, or UI elements. This royal back must feel more sovereign and prestigious than the three market backs while remaining from the same premium GemDuel surface-art universe.
Composition: design the artwork for the exact requested canvas, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be the most ceremonial piece in the style group, with a strong frame and noble material hierarchy but no symbols that look like UI badges.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, paper labels, map-like inscriptions, bright chalky wash, museum placards, decorative writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```
