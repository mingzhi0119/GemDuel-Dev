# Surface Asset Autonomous Mythic-Styles Prompt Manifest - 2026-04-27

This is the fifth autonomous surface-art candidate batch. It intentionally does not overwrite any previous candidate libraries or runtime assets.

## Scope

- Source workflow: docs/art/long-autonomous-surface-asset-generation-codex-prompt-2026-04-27.md plus C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md.
- Archive root: assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/.
- Candidate count: 4 styles x 8 slots x 2 variants = 64 PNG candidates.
- Candidate library only: no runtime asset replacement, no source-code changes, no preview-route changes.
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

- `aurora-steel` - Aurora Steel: blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols.
- `basalt-aquamarine` - Basalt Aquamarine: matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft.
- `porcelain-cinnabar` - Porcelain Cinnabar: deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish.
- `astral-orchid` - Astral Orchid: deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps.

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

- `aurora-steel` worker: SAM-AS-SHELL-A, SAM-AS-SHELL-B, SAM-AS-TOP-A, SAM-AS-TOP-B, SAM-AS-PZ-A, SAM-AS-PZ-B, SAM-AS-GP-A, SAM-AS-GP-B, SAM-AS-L1-A, SAM-AS-L1-B, SAM-AS-L2-A, SAM-AS-L2-B, SAM-AS-L3-A, SAM-AS-L3-B, SAM-AS-ROYAL-A, SAM-AS-ROYAL-B
- `basalt-aquamarine` worker: SAM-BA-SHELL-A, SAM-BA-SHELL-B, SAM-BA-TOP-A, SAM-BA-TOP-B, SAM-BA-PZ-A, SAM-BA-PZ-B, SAM-BA-GP-A, SAM-BA-GP-B, SAM-BA-L1-A, SAM-BA-L1-B, SAM-BA-L2-A, SAM-BA-L2-B, SAM-BA-L3-A, SAM-BA-L3-B, SAM-BA-ROYAL-A, SAM-BA-ROYAL-B
- `porcelain-cinnabar` worker: SAM-PC-SHELL-A, SAM-PC-SHELL-B, SAM-PC-TOP-A, SAM-PC-TOP-B, SAM-PC-PZ-A, SAM-PC-PZ-B, SAM-PC-GP-A, SAM-PC-GP-B, SAM-PC-L1-A, SAM-PC-L1-B, SAM-PC-L2-A, SAM-PC-L2-B, SAM-PC-L3-A, SAM-PC-L3-B, SAM-PC-ROYAL-A, SAM-PC-ROYAL-B
- `astral-orchid` worker: SAM-AO-SHELL-A, SAM-AO-SHELL-B, SAM-AO-TOP-A, SAM-AO-TOP-B, SAM-AO-PZ-A, SAM-AO-PZ-B, SAM-AO-GP-A, SAM-AO-GP-B, SAM-AO-L1-A, SAM-AO-L1-B, SAM-AO-L2-A, SAM-AO-L2-B, SAM-AO-L3-A, SAM-AO-L3-B, SAM-AO-ROYAL-A, SAM-AO-ROYAL-B

## Prompt Manifest

## Style Group: Aurora Steel (`aurora-steel`)

### SAM-AS-SHELL-A

- Style: `aurora-steel` / Aurora Steel
- Slot: `shell-background`
- Variant: `A`
- Target dimensions: `3840x2160`
- Required filename: `shell-background.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/shell-background/aurora-steel/A/shell-background.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, single full-board shell background, exact final PNG target 3840x2160.
Prompt id: SAM-AS-SHELL-A.
Primary request: create a Aurora Steel style asset for the GemDuel slot shell-background.png. The style identity is blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols. Use charcoal steel plates, thin aurora-green rim light, cool violet undertone.
Project constraints: single full-board table surface behind centered gameplay stage; keep the center subdued and low-noise; stronger atmosphere may live on far edges and corners; no separate playmat, tablecloth, card slots, controls, labels, or counters. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be calmer and environmental, with a deliberately subdued middle 60 percent for the gameplay stage.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, sci-fi HUD marks, circuit traces, neon signage, readable waveform marks, barcode-like stripes, bright cyberpunk UI panels.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AS-SHELL-B

- Style: `aurora-steel` / Aurora Steel
- Slot: `shell-background`
- Variant: `B`
- Target dimensions: `3840x2160`
- Required filename: `shell-background.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/shell-background/aurora-steel/B/shell-background.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, single full-board shell background, exact final PNG target 3840x2160.
Prompt id: SAM-AS-SHELL-B.
Primary request: create a Aurora Steel style asset for the GemDuel slot shell-background.png. The style identity is blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols. Use dark gunmetal, muted northern-light sheen, satin black bevels.
Project constraints: single full-board table surface behind centered gameplay stage; keep the center subdued and low-noise; stronger atmosphere may live on far edges and corners; no separate playmat, tablecloth, card slots, controls, labels, or counters. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be moodier at the perimeter, still calm in the center, with no baked gameplay structures.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, sci-fi HUD marks, circuit traces, neon signage, readable waveform marks, barcode-like stripes, bright cyberpunk UI panels.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AS-TOP-A

- Style: `aurora-steel` / Aurora Steel
- Slot: `topbar`
- Variant: `A`
- Target dimensions: `3840x360`
- Required filename: `topbar.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/topbar/aurora-steel/A/topbar.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, panoramic TopBar skin, exact final PNG target 3840x360.
Prompt id: SAM-AS-TOP-A.
Primary request: create a Aurora Steel style asset for the GemDuel slot topbar.png. The style identity is blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols. Use charcoal steel plates, thin aurora-green rim light, cool violet undertone.
Project constraints: very wide 32:3 horizontal banner for a 120px logical top bar; quiet readable zones around 25 percent, 50 percent, and 75 percent width; ornament only near far edges, corners, and thin borders; no central crest, no black bars, no white bars, no text, no icons, no counters, no button shapes. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A must be a true panoramic ribbon, flat and quiet through the middle, with only thin edge trim and corner material detail.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, sci-fi HUD marks, circuit traces, neon signage, readable waveform marks, barcode-like stripes, bright cyberpunk UI panels.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AS-TOP-B

- Style: `aurora-steel` / Aurora Steel
- Slot: `topbar`
- Variant: `B`
- Target dimensions: `3840x360`
- Required filename: `topbar.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/topbar/aurora-steel/B/topbar.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, panoramic TopBar skin, exact final PNG target 3840x360.
Prompt id: SAM-AS-TOP-B.
Primary request: create a Aurora Steel style asset for the GemDuel slot topbar.png. The style identity is blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols. Use dark gunmetal, muted northern-light sheen, satin black bevels.
Project constraints: very wide 32:3 horizontal banner for a 120px logical top bar; quiet readable zones around 25 percent, 50 percent, and 75 percent width; ornament only near far edges, corners, and thin borders; no central crest, no black bars, no white bars, no text, no icons, no counters, no button shapes. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B must preserve a very wide strip composition, with subtle dimensional edge rails and three quiet React text zones.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, sci-fi HUD marks, circuit traces, neon signage, readable waveform marks, barcode-like stripes, bright cyberpunk UI panels.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AS-PZ-A

- Style: `aurora-steel` / Aurora Steel
- Slot: `player-zone`
- Variant: `A`
- Target dimensions: `3840x520`
- Required filename: `player-zone.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/player-zone/aurora-steel/A/player-zone.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, ultra-wide PlayerZone rail skin, exact final PNG target 3840x520.
Prompt id: SAM-AS-PZ-A.
Primary request: create a Aurora Steel style asset for the GemDuel slot player-zone.png. The style identity is blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols. Use charcoal steel plates, thin aurora-green rim light, cool violet undertone.
Project constraints: very wide 96:13 horizontal player rail usable for P1 and P2 anchoring; quiet center bands for React-rendered card stacks, reserved cards, inventory gems, counters, badges, and active-player rings; no baked card frames, card slots, deck silhouettes, controls, labels, numbers, or hover markers. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A must be a long rail with no vertical card-like features; decoration should stay at extreme ends and along a thin bottom edge.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, sci-fi HUD marks, circuit traces, neon signage, readable waveform marks, barcode-like stripes, bright cyberpunk UI panels.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AS-PZ-B

- Style: `aurora-steel` / Aurora Steel
- Slot: `player-zone`
- Variant: `B`
- Target dimensions: `3840x520`
- Required filename: `player-zone.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/player-zone/aurora-steel/B/player-zone.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, ultra-wide PlayerZone rail skin, exact final PNG target 3840x520.
Prompt id: SAM-AS-PZ-B.
Primary request: create a Aurora Steel style asset for the GemDuel slot player-zone.png. The style identity is blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols. Use dark gunmetal, muted northern-light sheen, satin black bevels.
Project constraints: very wide 96:13 horizontal player rail usable for P1 and P2 anchoring; quiet center bands for React-rendered card stacks, reserved cards, inventory gems, counters, badges, and active-player rings; no baked card frames, card slots, deck silhouettes, controls, labels, numbers, or hover markers. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be a smoother long tabletop rail, with asymmetric edge atmosphere and no card placeholders or UI silhouettes.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, sci-fi HUD marks, circuit traces, neon signage, readable waveform marks, barcode-like stripes, bright cyberpunk UI panels.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AS-GP-A

- Style: `aurora-steel` / Aurora Steel
- Slot: `gem-panel`
- Variant: `A`
- Target dimensions: `1254x1254`
- Required filename: `gem-panel.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/gem-panel/aurora-steel/A/gem-panel.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, front-facing square gem board substrate, exact final PNG target 1254x1254.
Prompt id: SAM-AS-GP-A.
Primary request: create a Aurora Steel style asset for the GemDuel slot gem-panel.png. The style identity is blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols. Use charcoal steel plates, thin aurora-green rim light, cool violet undertone.
Project constraints: orthographic square 5x5 board substrate; exact visual grid line anchors: vertical x=100,305,515,726,938,1141 and horizontal y=104,308,512,717,917,1132; empty readable wells only; no baked gems, click markers, symbols, labels, or tokens. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should prioritize exact grid alignment, empty wells, and low visual noise.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, sci-fi HUD marks, circuit traces, neon signage, readable waveform marks, barcode-like stripes, bright cyberpunk UI panels.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AS-GP-B

- Style: `aurora-steel` / Aurora Steel
- Slot: `gem-panel`
- Variant: `B`
- Target dimensions: `1254x1254`
- Required filename: `gem-panel.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/gem-panel/aurora-steel/B/gem-panel.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, front-facing square gem board substrate, exact final PNG target 1254x1254.
Prompt id: SAM-AS-GP-B.
Primary request: create a Aurora Steel style asset for the GemDuel slot gem-panel.png. The style identity is blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols. Use dark gunmetal, muted northern-light sheen, satin black bevels.
Project constraints: orthographic square 5x5 board substrate; exact visual grid line anchors: vertical x=100,305,515,726,938,1141 and horizontal y=104,308,512,717,917,1132; empty readable wells only; no baked gems, click markers, symbols, labels, or tokens. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be a stricter low-noise alternative with crisp divider grooves exactly on the required grid anchors.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, sci-fi HUD marks, circuit traces, neon signage, readable waveform marks, barcode-like stripes, bright cyberpunk UI panels.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AS-L1-A

- Style: `aurora-steel` / Aurora Steel
- Slot: `market-card-back-l1`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l1.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l1/aurora-steel/A/market-card-back-l1.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, lowest tier, exact final PNG target 1086x1448.
Prompt id: SAM-AS-L1-A.
Primary request: create a Aurora Steel style asset for the GemDuel slot market-card-back-l1.png. The style identity is blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols. Use charcoal steel plates, thin aurora-green rim light, cool violet undertone.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family as the other market backs; visibly simplest tier through lower ornament density and calmer trim only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the simplest member; communicate low tier only through restrained ornament and material quietness, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be plain and disciplined with one non-symbolic central material motif and sparse trim.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, sci-fi HUD marks, circuit traces, neon signage, readable waveform marks, barcode-like stripes, bright cyberpunk UI panels.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AS-L1-B

- Style: `aurora-steel` / Aurora Steel
- Slot: `market-card-back-l1`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l1.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l1/aurora-steel/B/market-card-back-l1.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, lowest tier, exact final PNG target 1086x1448.
Prompt id: SAM-AS-L1-B.
Primary request: create a Aurora Steel style asset for the GemDuel slot market-card-back-l1.png. The style identity is blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols. Use dark gunmetal, muted northern-light sheen, satin black bevels.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family as the other market backs; visibly simplest tier through lower ornament density and calmer trim only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the simplest member; communicate low tier only through restrained ornament and material quietness, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be understated, relying on material quality and a clean border instead of ornament density.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, sci-fi HUD marks, circuit traces, neon signage, readable waveform marks, barcode-like stripes, bright cyberpunk UI panels.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AS-L2-A

- Style: `aurora-steel` / Aurora Steel
- Slot: `market-card-back-l2`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l2.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l2/aurora-steel/A/market-card-back-l2.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, middle tier, exact final PNG target 1086x1448.
Prompt id: SAM-AS-L2-A.
Primary request: create a Aurora Steel style asset for the GemDuel slot market-card-back-l2.png. The style identity is blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols. Use charcoal steel plates, thin aurora-green rim light, cool violet undertone.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L3; visibly richer mid-tier accent by material depth and moderate ornament only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must sit between L1 and L3; communicate middle tier only through moderate ornament and accent richness, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should add moderate trim and material contrast while preserving the same silhouette language.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, sci-fi HUD marks, circuit traces, neon signage, readable waveform marks, barcode-like stripes, bright cyberpunk UI panels.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AS-L2-B

- Style: `aurora-steel` / Aurora Steel
- Slot: `market-card-back-l2`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l2.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l2/aurora-steel/B/market-card-back-l2.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, middle tier, exact final PNG target 1086x1448.
Prompt id: SAM-AS-L2-B.
Primary request: create a Aurora Steel style asset for the GemDuel slot market-card-back-l2.png. The style identity is blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols. Use dark gunmetal, muted northern-light sheen, satin black bevels.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L3; visibly richer mid-tier accent by material depth and moderate ornament only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must sit between L1 and L3; communicate middle tier only through moderate ornament and accent richness, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should read as a richer companion to L1 using mid-density trim and a confident abstract material motif.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, sci-fi HUD marks, circuit traces, neon signage, readable waveform marks, barcode-like stripes, bright cyberpunk UI panels.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AS-L3-A

- Style: `aurora-steel` / Aurora Steel
- Slot: `market-card-back-l3`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l3.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l3/aurora-steel/A/market-card-back-l3.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, highest market tier, exact final PNG target 1086x1448.
Prompt id: SAM-AS-L3-A.
Primary request: create a Aurora Steel style asset for the GemDuel slot market-card-back-l3.png. The style identity is blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols. Use charcoal steel plates, thin aurora-green rim light, cool violet undertone.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L2; most luxurious market tier by trim, jewel density, edge glow, and prestige material only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the richest market member; communicate high tier only through premium trim and controlled jewel-like accents, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should feel premium through layered trim and controlled jewel-like accents without becoming noisy.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, sci-fi HUD marks, circuit traces, neon signage, readable waveform marks, barcode-like stripes, bright cyberpunk UI panels.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AS-L3-B

- Style: `aurora-steel` / Aurora Steel
- Slot: `market-card-back-l3`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l3.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l3/aurora-steel/B/market-card-back-l3.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, highest market tier, exact final PNG target 1086x1448.
Prompt id: SAM-AS-L3-B.
Primary request: create a Aurora Steel style asset for the GemDuel slot market-card-back-l3.png. The style identity is blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols. Use dark gunmetal, muted northern-light sheen, satin black bevels.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L2; most luxurious market tier by trim, jewel density, edge glow, and prestige material only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the richest market member; communicate high tier only through premium trim and controlled jewel-like accents, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be the most ornate market back but still readable when downsampled to a 150x200 display box.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, sci-fi HUD marks, circuit traces, neon signage, readable waveform marks, barcode-like stripes, bright cyberpunk UI panels.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AS-ROYAL-A

- Style: `aurora-steel` / Aurora Steel
- Slot: `royal-card-back`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `royal-card-back.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/royal-card-back/aurora-steel/A/royal-card-back.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, royal prestige card back, exact final PNG target 1086x1448.
Prompt id: SAM-AS-ROYAL-A.
Primary request: create a Aurora Steel style asset for the GemDuel slot royal-card-back.png. The style identity is blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols. Use charcoal steel plates, thin aurora-green rim light, cool violet undertone.
Project constraints: sovereign prestige card back for RoyalCourt preview on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; stronger royal identity than market backs through material and composition, not text; no text, numbers, Roman numerals, labels, crown letters, icons, or UI elements. This royal back must feel more sovereign and prestigious than the three market backs while remaining from the same premium GemDuel surface-art universe.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should use a centered sovereign medallion-like abstract material shape, stronger frame depth, and no literal marks.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, sci-fi HUD marks, circuit traces, neon signage, readable waveform marks, barcode-like stripes, bright cyberpunk UI panels.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AS-ROYAL-B

- Style: `aurora-steel` / Aurora Steel
- Slot: `royal-card-back`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `royal-card-back.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/royal-card-back/aurora-steel/B/royal-card-back.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, royal prestige card back, exact final PNG target 1086x1448.
Prompt id: SAM-AS-ROYAL-B.
Primary request: create a Aurora Steel style asset for the GemDuel slot royal-card-back.png. The style identity is blackened brushed steel, cold graphite, restrained aurora green and violet edge light, premium metalwork without sci-fi UI symbols. Use dark gunmetal, muted northern-light sheen, satin black bevels.
Project constraints: sovereign prestige card back for RoyalCourt preview on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; stronger royal identity than market backs through material and composition, not text; no text, numbers, Roman numerals, labels, crown letters, icons, or UI elements. This royal back must feel more sovereign and prestigious than the three market backs while remaining from the same premium GemDuel surface-art universe.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be the most ceremonial piece in the style group, with a strong frame and noble material hierarchy but no UI-badge shapes.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, sci-fi HUD marks, circuit traces, neon signage, readable waveform marks, barcode-like stripes, bright cyberpunk UI panels.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

## Style Group: Basalt Aquamarine (`basalt-aquamarine`)

### SAM-BA-SHELL-A

- Style: `basalt-aquamarine` / Basalt Aquamarine
- Slot: `shell-background`
- Variant: `A`
- Target dimensions: `3840x2160`
- Required filename: `shell-background.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/shell-background/basalt-aquamarine/A/shell-background.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, single full-board shell background, exact final PNG target 3840x2160.
Prompt id: SAM-BA-SHELL-A.
Primary request: create a Basalt Aquamarine style asset for the GemDuel slot shell-background.png. The style identity is matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft. Use black basalt slabs, aquamarine veins, wet-stone edge highlights.
Project constraints: single full-board table surface behind centered gameplay stage; keep the center subdued and low-noise; stronger atmosphere may live on far edges and corners; no separate playmat, tablecloth, card slots, controls, labels, or counters. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be calmer and environmental, with a deliberately subdued middle 60 percent for the gameplay stage.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, water droplets that look like tokens, shell icons, fish or creature shapes, map symbols, bright tropical wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-BA-SHELL-B

- Style: `basalt-aquamarine` / Basalt Aquamarine
- Slot: `shell-background`
- Variant: `B`
- Target dimensions: `3840x2160`
- Required filename: `shell-background.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/shell-background/basalt-aquamarine/B/shell-background.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, single full-board shell background, exact final PNG target 3840x2160.
Prompt id: SAM-BA-SHELL-B.
Primary request: create a Basalt Aquamarine style asset for the GemDuel slot shell-background.png. The style identity is matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft. Use deep sea basalt, turquoise mineral seams, dark pewter trim.
Project constraints: single full-board table surface behind centered gameplay stage; keep the center subdued and low-noise; stronger atmosphere may live on far edges and corners; no separate playmat, tablecloth, card slots, controls, labels, or counters. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be moodier at the perimeter, still calm in the center, with no baked gameplay structures.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, water droplets that look like tokens, shell icons, fish or creature shapes, map symbols, bright tropical wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-BA-TOP-A

- Style: `basalt-aquamarine` / Basalt Aquamarine
- Slot: `topbar`
- Variant: `A`
- Target dimensions: `3840x360`
- Required filename: `topbar.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/topbar/basalt-aquamarine/A/topbar.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, panoramic TopBar skin, exact final PNG target 3840x360.
Prompt id: SAM-BA-TOP-A.
Primary request: create a Basalt Aquamarine style asset for the GemDuel slot topbar.png. The style identity is matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft. Use black basalt slabs, aquamarine veins, wet-stone edge highlights.
Project constraints: very wide 32:3 horizontal banner for a 120px logical top bar; quiet readable zones around 25 percent, 50 percent, and 75 percent width; ornament only near far edges, corners, and thin borders; no central crest, no black bars, no white bars, no text, no icons, no counters, no button shapes. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A must be a true panoramic ribbon, flat and quiet through the middle, with only thin edge trim and corner material detail.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, water droplets that look like tokens, shell icons, fish or creature shapes, map symbols, bright tropical wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-BA-TOP-B

- Style: `basalt-aquamarine` / Basalt Aquamarine
- Slot: `topbar`
- Variant: `B`
- Target dimensions: `3840x360`
- Required filename: `topbar.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/topbar/basalt-aquamarine/B/topbar.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, panoramic TopBar skin, exact final PNG target 3840x360.
Prompt id: SAM-BA-TOP-B.
Primary request: create a Basalt Aquamarine style asset for the GemDuel slot topbar.png. The style identity is matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft. Use deep sea basalt, turquoise mineral seams, dark pewter trim.
Project constraints: very wide 32:3 horizontal banner for a 120px logical top bar; quiet readable zones around 25 percent, 50 percent, and 75 percent width; ornament only near far edges, corners, and thin borders; no central crest, no black bars, no white bars, no text, no icons, no counters, no button shapes. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B must preserve a very wide strip composition, with subtle dimensional edge rails and three quiet React text zones.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, water droplets that look like tokens, shell icons, fish or creature shapes, map symbols, bright tropical wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-BA-PZ-A

- Style: `basalt-aquamarine` / Basalt Aquamarine
- Slot: `player-zone`
- Variant: `A`
- Target dimensions: `3840x520`
- Required filename: `player-zone.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/player-zone/basalt-aquamarine/A/player-zone.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, ultra-wide PlayerZone rail skin, exact final PNG target 3840x520.
Prompt id: SAM-BA-PZ-A.
Primary request: create a Basalt Aquamarine style asset for the GemDuel slot player-zone.png. The style identity is matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft. Use black basalt slabs, aquamarine veins, wet-stone edge highlights.
Project constraints: very wide 96:13 horizontal player rail usable for P1 and P2 anchoring; quiet center bands for React-rendered card stacks, reserved cards, inventory gems, counters, badges, and active-player rings; no baked card frames, card slots, deck silhouettes, controls, labels, numbers, or hover markers. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A must be a long rail with no vertical card-like features; decoration should stay at extreme ends and along a thin bottom edge.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, water droplets that look like tokens, shell icons, fish or creature shapes, map symbols, bright tropical wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-BA-PZ-B

- Style: `basalt-aquamarine` / Basalt Aquamarine
- Slot: `player-zone`
- Variant: `B`
- Target dimensions: `3840x520`
- Required filename: `player-zone.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/player-zone/basalt-aquamarine/B/player-zone.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, ultra-wide PlayerZone rail skin, exact final PNG target 3840x520.
Prompt id: SAM-BA-PZ-B.
Primary request: create a Basalt Aquamarine style asset for the GemDuel slot player-zone.png. The style identity is matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft. Use deep sea basalt, turquoise mineral seams, dark pewter trim.
Project constraints: very wide 96:13 horizontal player rail usable for P1 and P2 anchoring; quiet center bands for React-rendered card stacks, reserved cards, inventory gems, counters, badges, and active-player rings; no baked card frames, card slots, deck silhouettes, controls, labels, numbers, or hover markers. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be a smoother long tabletop rail, with asymmetric edge atmosphere and no card placeholders or UI silhouettes.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, water droplets that look like tokens, shell icons, fish or creature shapes, map symbols, bright tropical wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-BA-GP-A

- Style: `basalt-aquamarine` / Basalt Aquamarine
- Slot: `gem-panel`
- Variant: `A`
- Target dimensions: `1254x1254`
- Required filename: `gem-panel.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/gem-panel/basalt-aquamarine/A/gem-panel.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, front-facing square gem board substrate, exact final PNG target 1254x1254.
Prompt id: SAM-BA-GP-A.
Primary request: create a Basalt Aquamarine style asset for the GemDuel slot gem-panel.png. The style identity is matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft. Use black basalt slabs, aquamarine veins, wet-stone edge highlights.
Project constraints: orthographic square 5x5 board substrate; exact visual grid line anchors: vertical x=100,305,515,726,938,1141 and horizontal y=104,308,512,717,917,1132; empty readable wells only; no baked gems, click markers, symbols, labels, or tokens. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should prioritize exact grid alignment, empty wells, and low visual noise.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, water droplets that look like tokens, shell icons, fish or creature shapes, map symbols, bright tropical wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-BA-GP-B

- Style: `basalt-aquamarine` / Basalt Aquamarine
- Slot: `gem-panel`
- Variant: `B`
- Target dimensions: `1254x1254`
- Required filename: `gem-panel.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/gem-panel/basalt-aquamarine/B/gem-panel.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, front-facing square gem board substrate, exact final PNG target 1254x1254.
Prompt id: SAM-BA-GP-B.
Primary request: create a Basalt Aquamarine style asset for the GemDuel slot gem-panel.png. The style identity is matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft. Use deep sea basalt, turquoise mineral seams, dark pewter trim.
Project constraints: orthographic square 5x5 board substrate; exact visual grid line anchors: vertical x=100,305,515,726,938,1141 and horizontal y=104,308,512,717,917,1132; empty readable wells only; no baked gems, click markers, symbols, labels, or tokens. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be a stricter low-noise alternative with crisp divider grooves exactly on the required grid anchors.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, water droplets that look like tokens, shell icons, fish or creature shapes, map symbols, bright tropical wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-BA-L1-A

- Style: `basalt-aquamarine` / Basalt Aquamarine
- Slot: `market-card-back-l1`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l1.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l1/basalt-aquamarine/A/market-card-back-l1.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, lowest tier, exact final PNG target 1086x1448.
Prompt id: SAM-BA-L1-A.
Primary request: create a Basalt Aquamarine style asset for the GemDuel slot market-card-back-l1.png. The style identity is matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft. Use black basalt slabs, aquamarine veins, wet-stone edge highlights.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family as the other market backs; visibly simplest tier through lower ornament density and calmer trim only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the simplest member; communicate low tier only through restrained ornament and material quietness, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be plain and disciplined with one non-symbolic central material motif and sparse trim.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, water droplets that look like tokens, shell icons, fish or creature shapes, map symbols, bright tropical wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-BA-L1-B

- Style: `basalt-aquamarine` / Basalt Aquamarine
- Slot: `market-card-back-l1`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l1.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l1/basalt-aquamarine/B/market-card-back-l1.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, lowest tier, exact final PNG target 1086x1448.
Prompt id: SAM-BA-L1-B.
Primary request: create a Basalt Aquamarine style asset for the GemDuel slot market-card-back-l1.png. The style identity is matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft. Use deep sea basalt, turquoise mineral seams, dark pewter trim.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family as the other market backs; visibly simplest tier through lower ornament density and calmer trim only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the simplest member; communicate low tier only through restrained ornament and material quietness, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be understated, relying on material quality and a clean border instead of ornament density.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, water droplets that look like tokens, shell icons, fish or creature shapes, map symbols, bright tropical wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-BA-L2-A

- Style: `basalt-aquamarine` / Basalt Aquamarine
- Slot: `market-card-back-l2`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l2.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l2/basalt-aquamarine/A/market-card-back-l2.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, middle tier, exact final PNG target 1086x1448.
Prompt id: SAM-BA-L2-A.
Primary request: create a Basalt Aquamarine style asset for the GemDuel slot market-card-back-l2.png. The style identity is matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft. Use black basalt slabs, aquamarine veins, wet-stone edge highlights.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L3; visibly richer mid-tier accent by material depth and moderate ornament only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must sit between L1 and L3; communicate middle tier only through moderate ornament and accent richness, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should add moderate trim and material contrast while preserving the same silhouette language.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, water droplets that look like tokens, shell icons, fish or creature shapes, map symbols, bright tropical wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-BA-L2-B

- Style: `basalt-aquamarine` / Basalt Aquamarine
- Slot: `market-card-back-l2`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l2.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l2/basalt-aquamarine/B/market-card-back-l2.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, middle tier, exact final PNG target 1086x1448.
Prompt id: SAM-BA-L2-B.
Primary request: create a Basalt Aquamarine style asset for the GemDuel slot market-card-back-l2.png. The style identity is matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft. Use deep sea basalt, turquoise mineral seams, dark pewter trim.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L3; visibly richer mid-tier accent by material depth and moderate ornament only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must sit between L1 and L3; communicate middle tier only through moderate ornament and accent richness, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should read as a richer companion to L1 using mid-density trim and a confident abstract material motif.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, water droplets that look like tokens, shell icons, fish or creature shapes, map symbols, bright tropical wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-BA-L3-A

- Style: `basalt-aquamarine` / Basalt Aquamarine
- Slot: `market-card-back-l3`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l3.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l3/basalt-aquamarine/A/market-card-back-l3.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, highest market tier, exact final PNG target 1086x1448.
Prompt id: SAM-BA-L3-A.
Primary request: create a Basalt Aquamarine style asset for the GemDuel slot market-card-back-l3.png. The style identity is matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft. Use black basalt slabs, aquamarine veins, wet-stone edge highlights.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L2; most luxurious market tier by trim, jewel density, edge glow, and prestige material only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the richest market member; communicate high tier only through premium trim and controlled jewel-like accents, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should feel premium through layered trim and controlled jewel-like accents without becoming noisy.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, water droplets that look like tokens, shell icons, fish or creature shapes, map symbols, bright tropical wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-BA-L3-B

- Style: `basalt-aquamarine` / Basalt Aquamarine
- Slot: `market-card-back-l3`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l3.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l3/basalt-aquamarine/B/market-card-back-l3.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, highest market tier, exact final PNG target 1086x1448.
Prompt id: SAM-BA-L3-B.
Primary request: create a Basalt Aquamarine style asset for the GemDuel slot market-card-back-l3.png. The style identity is matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft. Use deep sea basalt, turquoise mineral seams, dark pewter trim.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L2; most luxurious market tier by trim, jewel density, edge glow, and prestige material only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the richest market member; communicate high tier only through premium trim and controlled jewel-like accents, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be the most ornate market back but still readable when downsampled to a 150x200 display box.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, water droplets that look like tokens, shell icons, fish or creature shapes, map symbols, bright tropical wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-BA-ROYAL-A

- Style: `basalt-aquamarine` / Basalt Aquamarine
- Slot: `royal-card-back`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `royal-card-back.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/royal-card-back/basalt-aquamarine/A/royal-card-back.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, royal prestige card back, exact final PNG target 1086x1448.
Prompt id: SAM-BA-ROYAL-A.
Primary request: create a Basalt Aquamarine style asset for the GemDuel slot royal-card-back.png. The style identity is matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft. Use black basalt slabs, aquamarine veins, wet-stone edge highlights.
Project constraints: sovereign prestige card back for RoyalCourt preview on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; stronger royal identity than market backs through material and composition, not text; no text, numbers, Roman numerals, labels, crown letters, icons, or UI elements. This royal back must feel more sovereign and prestigious than the three market backs while remaining from the same premium GemDuel surface-art universe.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should use a centered sovereign medallion-like abstract material shape, stronger frame depth, and no literal marks.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, water droplets that look like tokens, shell icons, fish or creature shapes, map symbols, bright tropical wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-BA-ROYAL-B

- Style: `basalt-aquamarine` / Basalt Aquamarine
- Slot: `royal-card-back`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `royal-card-back.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/royal-card-back/basalt-aquamarine/B/royal-card-back.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, royal prestige card back, exact final PNG target 1086x1448.
Prompt id: SAM-BA-ROYAL-B.
Primary request: create a Basalt Aquamarine style asset for the GemDuel slot royal-card-back.png. The style identity is matte volcanic basalt, aquamarine mineral inlay, sea-dark stone, cyan glass accents, rugged but elegant tabletop craft. Use deep sea basalt, turquoise mineral seams, dark pewter trim.
Project constraints: sovereign prestige card back for RoyalCourt preview on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; stronger royal identity than market backs through material and composition, not text; no text, numbers, Roman numerals, labels, crown letters, icons, or UI elements. This royal back must feel more sovereign and prestigious than the three market backs while remaining from the same premium GemDuel surface-art universe.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be the most ceremonial piece in the style group, with a strong frame and noble material hierarchy but no UI-badge shapes.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, water droplets that look like tokens, shell icons, fish or creature shapes, map symbols, bright tropical wash.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

## Style Group: Porcelain Cinnabar (`porcelain-cinnabar`)

### SAM-PC-SHELL-A

- Style: `porcelain-cinnabar` / Porcelain Cinnabar
- Slot: `shell-background`
- Variant: `A`
- Target dimensions: `3840x2160`
- Required filename: `shell-background.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/shell-background/porcelain-cinnabar/A/shell-background.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, single full-board shell background, exact final PNG target 3840x2160.
Prompt id: SAM-PC-SHELL-A.
Primary request: create a Porcelain Cinnabar style asset for the GemDuel slot shell-background.png. The style identity is deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish. Use cream porcelain depth, cinnabar red lacquer edging, restrained cobalt glazing.
Project constraints: single full-board table surface behind centered gameplay stage; keep the center subdued and low-noise; stronger atmosphere may live on far edges and corners; no separate playmat, tablecloth, card slots, controls, labels, or counters. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be calmer and environmental, with a deliberately subdued middle 60 percent for the gameplay stage.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, calligraphy, brush writing, ceramic maker marks, labels, stamps, seals, readable decorative inscriptions, paper tags.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-PC-SHELL-B

- Style: `porcelain-cinnabar` / Porcelain Cinnabar
- Slot: `shell-background`
- Variant: `B`
- Target dimensions: `3840x2160`
- Required filename: `shell-background.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/shell-background/porcelain-cinnabar/B/shell-background.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, single full-board shell background, exact final PNG target 3840x2160.
Prompt id: SAM-PC-SHELL-B.
Primary request: create a Porcelain Cinnabar style asset for the GemDuel slot shell-background.png. The style identity is deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish. Use dark porcelain shadow, black lacquer rails, controlled red enamel highlights.
Project constraints: single full-board table surface behind centered gameplay stage; keep the center subdued and low-noise; stronger atmosphere may live on far edges and corners; no separate playmat, tablecloth, card slots, controls, labels, or counters. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be moodier at the perimeter, still calm in the center, with no baked gameplay structures.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, calligraphy, brush writing, ceramic maker marks, labels, stamps, seals, readable decorative inscriptions, paper tags.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-PC-TOP-A

- Style: `porcelain-cinnabar` / Porcelain Cinnabar
- Slot: `topbar`
- Variant: `A`
- Target dimensions: `3840x360`
- Required filename: `topbar.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/topbar/porcelain-cinnabar/A/topbar.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, panoramic TopBar skin, exact final PNG target 3840x360.
Prompt id: SAM-PC-TOP-A.
Primary request: create a Porcelain Cinnabar style asset for the GemDuel slot topbar.png. The style identity is deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish. Use cream porcelain depth, cinnabar red lacquer edging, restrained cobalt glazing.
Project constraints: very wide 32:3 horizontal banner for a 120px logical top bar; quiet readable zones around 25 percent, 50 percent, and 75 percent width; ornament only near far edges, corners, and thin borders; no central crest, no black bars, no white bars, no text, no icons, no counters, no button shapes. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A must be a true panoramic ribbon, flat and quiet through the middle, with only thin edge trim and corner material detail.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, calligraphy, brush writing, ceramic maker marks, labels, stamps, seals, readable decorative inscriptions, paper tags.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-PC-TOP-B

- Style: `porcelain-cinnabar` / Porcelain Cinnabar
- Slot: `topbar`
- Variant: `B`
- Target dimensions: `3840x360`
- Required filename: `topbar.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/topbar/porcelain-cinnabar/B/topbar.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, panoramic TopBar skin, exact final PNG target 3840x360.
Prompt id: SAM-PC-TOP-B.
Primary request: create a Porcelain Cinnabar style asset for the GemDuel slot topbar.png. The style identity is deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish. Use dark porcelain shadow, black lacquer rails, controlled red enamel highlights.
Project constraints: very wide 32:3 horizontal banner for a 120px logical top bar; quiet readable zones around 25 percent, 50 percent, and 75 percent width; ornament only near far edges, corners, and thin borders; no central crest, no black bars, no white bars, no text, no icons, no counters, no button shapes. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B must preserve a very wide strip composition, with subtle dimensional edge rails and three quiet React text zones.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, calligraphy, brush writing, ceramic maker marks, labels, stamps, seals, readable decorative inscriptions, paper tags.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-PC-PZ-A

- Style: `porcelain-cinnabar` / Porcelain Cinnabar
- Slot: `player-zone`
- Variant: `A`
- Target dimensions: `3840x520`
- Required filename: `player-zone.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/player-zone/porcelain-cinnabar/A/player-zone.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, ultra-wide PlayerZone rail skin, exact final PNG target 3840x520.
Prompt id: SAM-PC-PZ-A.
Primary request: create a Porcelain Cinnabar style asset for the GemDuel slot player-zone.png. The style identity is deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish. Use cream porcelain depth, cinnabar red lacquer edging, restrained cobalt glazing.
Project constraints: very wide 96:13 horizontal player rail usable for P1 and P2 anchoring; quiet center bands for React-rendered card stacks, reserved cards, inventory gems, counters, badges, and active-player rings; no baked card frames, card slots, deck silhouettes, controls, labels, numbers, or hover markers. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A must be a long rail with no vertical card-like features; decoration should stay at extreme ends and along a thin bottom edge.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, calligraphy, brush writing, ceramic maker marks, labels, stamps, seals, readable decorative inscriptions, paper tags.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-PC-PZ-B

- Style: `porcelain-cinnabar` / Porcelain Cinnabar
- Slot: `player-zone`
- Variant: `B`
- Target dimensions: `3840x520`
- Required filename: `player-zone.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/player-zone/porcelain-cinnabar/B/player-zone.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, ultra-wide PlayerZone rail skin, exact final PNG target 3840x520.
Prompt id: SAM-PC-PZ-B.
Primary request: create a Porcelain Cinnabar style asset for the GemDuel slot player-zone.png. The style identity is deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish. Use dark porcelain shadow, black lacquer rails, controlled red enamel highlights.
Project constraints: very wide 96:13 horizontal player rail usable for P1 and P2 anchoring; quiet center bands for React-rendered card stacks, reserved cards, inventory gems, counters, badges, and active-player rings; no baked card frames, card slots, deck silhouettes, controls, labels, numbers, or hover markers. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be a smoother long tabletop rail, with asymmetric edge atmosphere and no card placeholders or UI silhouettes.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, calligraphy, brush writing, ceramic maker marks, labels, stamps, seals, readable decorative inscriptions, paper tags.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-PC-GP-A

- Style: `porcelain-cinnabar` / Porcelain Cinnabar
- Slot: `gem-panel`
- Variant: `A`
- Target dimensions: `1254x1254`
- Required filename: `gem-panel.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/gem-panel/porcelain-cinnabar/A/gem-panel.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, front-facing square gem board substrate, exact final PNG target 1254x1254.
Prompt id: SAM-PC-GP-A.
Primary request: create a Porcelain Cinnabar style asset for the GemDuel slot gem-panel.png. The style identity is deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish. Use cream porcelain depth, cinnabar red lacquer edging, restrained cobalt glazing.
Project constraints: orthographic square 5x5 board substrate; exact visual grid line anchors: vertical x=100,305,515,726,938,1141 and horizontal y=104,308,512,717,917,1132; empty readable wells only; no baked gems, click markers, symbols, labels, or tokens. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should prioritize exact grid alignment, empty wells, and low visual noise.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, calligraphy, brush writing, ceramic maker marks, labels, stamps, seals, readable decorative inscriptions, paper tags.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-PC-GP-B

- Style: `porcelain-cinnabar` / Porcelain Cinnabar
- Slot: `gem-panel`
- Variant: `B`
- Target dimensions: `1254x1254`
- Required filename: `gem-panel.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/gem-panel/porcelain-cinnabar/B/gem-panel.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, front-facing square gem board substrate, exact final PNG target 1254x1254.
Prompt id: SAM-PC-GP-B.
Primary request: create a Porcelain Cinnabar style asset for the GemDuel slot gem-panel.png. The style identity is deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish. Use dark porcelain shadow, black lacquer rails, controlled red enamel highlights.
Project constraints: orthographic square 5x5 board substrate; exact visual grid line anchors: vertical x=100,305,515,726,938,1141 and horizontal y=104,308,512,717,917,1132; empty readable wells only; no baked gems, click markers, symbols, labels, or tokens. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be a stricter low-noise alternative with crisp divider grooves exactly on the required grid anchors.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, calligraphy, brush writing, ceramic maker marks, labels, stamps, seals, readable decorative inscriptions, paper tags.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-PC-L1-A

- Style: `porcelain-cinnabar` / Porcelain Cinnabar
- Slot: `market-card-back-l1`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l1.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l1/porcelain-cinnabar/A/market-card-back-l1.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, lowest tier, exact final PNG target 1086x1448.
Prompt id: SAM-PC-L1-A.
Primary request: create a Porcelain Cinnabar style asset for the GemDuel slot market-card-back-l1.png. The style identity is deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish. Use cream porcelain depth, cinnabar red lacquer edging, restrained cobalt glazing.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family as the other market backs; visibly simplest tier through lower ornament density and calmer trim only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the simplest member; communicate low tier only through restrained ornament and material quietness, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be plain and disciplined with one non-symbolic central material motif and sparse trim.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, calligraphy, brush writing, ceramic maker marks, labels, stamps, seals, readable decorative inscriptions, paper tags.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-PC-L1-B

- Style: `porcelain-cinnabar` / Porcelain Cinnabar
- Slot: `market-card-back-l1`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l1.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l1/porcelain-cinnabar/B/market-card-back-l1.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, lowest tier, exact final PNG target 1086x1448.
Prompt id: SAM-PC-L1-B.
Primary request: create a Porcelain Cinnabar style asset for the GemDuel slot market-card-back-l1.png. The style identity is deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish. Use dark porcelain shadow, black lacquer rails, controlled red enamel highlights.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family as the other market backs; visibly simplest tier through lower ornament density and calmer trim only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the simplest member; communicate low tier only through restrained ornament and material quietness, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be understated, relying on material quality and a clean border instead of ornament density.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, calligraphy, brush writing, ceramic maker marks, labels, stamps, seals, readable decorative inscriptions, paper tags.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-PC-L2-A

- Style: `porcelain-cinnabar` / Porcelain Cinnabar
- Slot: `market-card-back-l2`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l2.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l2/porcelain-cinnabar/A/market-card-back-l2.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, middle tier, exact final PNG target 1086x1448.
Prompt id: SAM-PC-L2-A.
Primary request: create a Porcelain Cinnabar style asset for the GemDuel slot market-card-back-l2.png. The style identity is deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish. Use cream porcelain depth, cinnabar red lacquer edging, restrained cobalt glazing.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L3; visibly richer mid-tier accent by material depth and moderate ornament only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must sit between L1 and L3; communicate middle tier only through moderate ornament and accent richness, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should add moderate trim and material contrast while preserving the same silhouette language.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, calligraphy, brush writing, ceramic maker marks, labels, stamps, seals, readable decorative inscriptions, paper tags.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-PC-L2-B

- Style: `porcelain-cinnabar` / Porcelain Cinnabar
- Slot: `market-card-back-l2`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l2.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l2/porcelain-cinnabar/B/market-card-back-l2.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, middle tier, exact final PNG target 1086x1448.
Prompt id: SAM-PC-L2-B.
Primary request: create a Porcelain Cinnabar style asset for the GemDuel slot market-card-back-l2.png. The style identity is deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish. Use dark porcelain shadow, black lacquer rails, controlled red enamel highlights.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L3; visibly richer mid-tier accent by material depth and moderate ornament only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must sit between L1 and L3; communicate middle tier only through moderate ornament and accent richness, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should read as a richer companion to L1 using mid-density trim and a confident abstract material motif.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, calligraphy, brush writing, ceramic maker marks, labels, stamps, seals, readable decorative inscriptions, paper tags.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-PC-L3-A

- Style: `porcelain-cinnabar` / Porcelain Cinnabar
- Slot: `market-card-back-l3`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l3.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l3/porcelain-cinnabar/A/market-card-back-l3.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, highest market tier, exact final PNG target 1086x1448.
Prompt id: SAM-PC-L3-A.
Primary request: create a Porcelain Cinnabar style asset for the GemDuel slot market-card-back-l3.png. The style identity is deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish. Use cream porcelain depth, cinnabar red lacquer edging, restrained cobalt glazing.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L2; most luxurious market tier by trim, jewel density, edge glow, and prestige material only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the richest market member; communicate high tier only through premium trim and controlled jewel-like accents, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should feel premium through layered trim and controlled jewel-like accents without becoming noisy.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, calligraphy, brush writing, ceramic maker marks, labels, stamps, seals, readable decorative inscriptions, paper tags.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-PC-L3-B

- Style: `porcelain-cinnabar` / Porcelain Cinnabar
- Slot: `market-card-back-l3`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l3.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l3/porcelain-cinnabar/B/market-card-back-l3.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, highest market tier, exact final PNG target 1086x1448.
Prompt id: SAM-PC-L3-B.
Primary request: create a Porcelain Cinnabar style asset for the GemDuel slot market-card-back-l3.png. The style identity is deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish. Use dark porcelain shadow, black lacquer rails, controlled red enamel highlights.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L2; most luxurious market tier by trim, jewel density, edge glow, and prestige material only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the richest market member; communicate high tier only through premium trim and controlled jewel-like accents, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be the most ornate market back but still readable when downsampled to a 150x200 display box.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, calligraphy, brush writing, ceramic maker marks, labels, stamps, seals, readable decorative inscriptions, paper tags.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-PC-ROYAL-A

- Style: `porcelain-cinnabar` / Porcelain Cinnabar
- Slot: `royal-card-back`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `royal-card-back.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/royal-card-back/porcelain-cinnabar/A/royal-card-back.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, royal prestige card back, exact final PNG target 1086x1448.
Prompt id: SAM-PC-ROYAL-A.
Primary request: create a Porcelain Cinnabar style asset for the GemDuel slot royal-card-back.png. The style identity is deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish. Use cream porcelain depth, cinnabar red lacquer edging, restrained cobalt glazing.
Project constraints: sovereign prestige card back for RoyalCourt preview on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; stronger royal identity than market backs through material and composition, not text; no text, numbers, Roman numerals, labels, crown letters, icons, or UI elements. This royal back must feel more sovereign and prestigious than the three market backs while remaining from the same premium GemDuel surface-art universe.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should use a centered sovereign medallion-like abstract material shape, stronger frame depth, and no literal marks.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, calligraphy, brush writing, ceramic maker marks, labels, stamps, seals, readable decorative inscriptions, paper tags.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-PC-ROYAL-B

- Style: `porcelain-cinnabar` / Porcelain Cinnabar
- Slot: `royal-card-back`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `royal-card-back.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/royal-card-back/porcelain-cinnabar/B/royal-card-back.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, royal prestige card back, exact final PNG target 1086x1448.
Prompt id: SAM-PC-ROYAL-B.
Primary request: create a Porcelain Cinnabar style asset for the GemDuel slot royal-card-back.png. The style identity is deep porcelain glaze, cinnabar lacquer, cobalt-blue accent, black lacquer trim, antique premium board-game finish. Use dark porcelain shadow, black lacquer rails, controlled red enamel highlights.
Project constraints: sovereign prestige card back for RoyalCourt preview on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; stronger royal identity than market backs through material and composition, not text; no text, numbers, Roman numerals, labels, crown letters, icons, or UI elements. This royal back must feel more sovereign and prestigious than the three market backs while remaining from the same premium GemDuel surface-art universe.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be the most ceremonial piece in the style group, with a strong frame and noble material hierarchy but no UI-badge shapes.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, calligraphy, brush writing, ceramic maker marks, labels, stamps, seals, readable decorative inscriptions, paper tags.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

## Style Group: Astral Orchid (`astral-orchid`)

### SAM-AO-SHELL-A

- Style: `astral-orchid` / Astral Orchid
- Slot: `shell-background`
- Variant: `A`
- Target dimensions: `3840x2160`
- Required filename: `shell-background.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/shell-background/astral-orchid/A/shell-background.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, single full-board shell background, exact final PNG target 3840x2160.
Prompt id: SAM-AO-SHELL-A.
Primary request: create a Astral Orchid style asset for the GemDuel slot shell-background.png. The style identity is deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps. Use dark orchid crystal, silver bevels, soft plum glow.
Project constraints: single full-board table surface behind centered gameplay stage; keep the center subdued and low-noise; stronger atmosphere may live on far edges and corners; no separate playmat, tablecloth, card slots, controls, labels, or counters. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be calmer and environmental, with a deliberately subdued middle 60 percent for the gameplay stage.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, constellation diagrams, star-map labels, astrology symbols, zodiac signs, moon phase icons, readable runes, magical writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AO-SHELL-B

- Style: `astral-orchid` / Astral Orchid
- Slot: `shell-background`
- Variant: `B`
- Target dimensions: `3840x2160`
- Required filename: `shell-background.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/shell-background/astral-orchid/B/shell-background.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, single full-board shell background, exact final PNG target 3840x2160.
Prompt id: SAM-AO-SHELL-B.
Primary request: create a Astral Orchid style asset for the GemDuel slot shell-background.png. The style identity is deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps. Use midnight purple enamel, pale orchid highlights, restrained moon-silver trim.
Project constraints: single full-board table surface behind centered gameplay stage; keep the center subdued and low-noise; stronger atmosphere may live on far edges and corners; no separate playmat, tablecloth, card slots, controls, labels, or counters. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be moodier at the perimeter, still calm in the center, with no baked gameplay structures.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, constellation diagrams, star-map labels, astrology symbols, zodiac signs, moon phase icons, readable runes, magical writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AO-TOP-A

- Style: `astral-orchid` / Astral Orchid
- Slot: `topbar`
- Variant: `A`
- Target dimensions: `3840x360`
- Required filename: `topbar.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/topbar/astral-orchid/A/topbar.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, panoramic TopBar skin, exact final PNG target 3840x360.
Prompt id: SAM-AO-TOP-A.
Primary request: create a Astral Orchid style asset for the GemDuel slot topbar.png. The style identity is deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps. Use dark orchid crystal, silver bevels, soft plum glow.
Project constraints: very wide 32:3 horizontal banner for a 120px logical top bar; quiet readable zones around 25 percent, 50 percent, and 75 percent width; ornament only near far edges, corners, and thin borders; no central crest, no black bars, no white bars, no text, no icons, no counters, no button shapes. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A must be a true panoramic ribbon, flat and quiet through the middle, with only thin edge trim and corner material detail.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, constellation diagrams, star-map labels, astrology symbols, zodiac signs, moon phase icons, readable runes, magical writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AO-TOP-B

- Style: `astral-orchid` / Astral Orchid
- Slot: `topbar`
- Variant: `B`
- Target dimensions: `3840x360`
- Required filename: `topbar.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/topbar/astral-orchid/B/topbar.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, panoramic TopBar skin, exact final PNG target 3840x360.
Prompt id: SAM-AO-TOP-B.
Primary request: create a Astral Orchid style asset for the GemDuel slot topbar.png. The style identity is deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps. Use midnight purple enamel, pale orchid highlights, restrained moon-silver trim.
Project constraints: very wide 32:3 horizontal banner for a 120px logical top bar; quiet readable zones around 25 percent, 50 percent, and 75 percent width; ornament only near far edges, corners, and thin borders; no central crest, no black bars, no white bars, no text, no icons, no counters, no button shapes. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B must preserve a very wide strip composition, with subtle dimensional edge rails and three quiet React text zones.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, constellation diagrams, star-map labels, astrology symbols, zodiac signs, moon phase icons, readable runes, magical writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AO-PZ-A

- Style: `astral-orchid` / Astral Orchid
- Slot: `player-zone`
- Variant: `A`
- Target dimensions: `3840x520`
- Required filename: `player-zone.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/player-zone/astral-orchid/A/player-zone.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, ultra-wide PlayerZone rail skin, exact final PNG target 3840x520.
Prompt id: SAM-AO-PZ-A.
Primary request: create a Astral Orchid style asset for the GemDuel slot player-zone.png. The style identity is deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps. Use dark orchid crystal, silver bevels, soft plum glow.
Project constraints: very wide 96:13 horizontal player rail usable for P1 and P2 anchoring; quiet center bands for React-rendered card stacks, reserved cards, inventory gems, counters, badges, and active-player rings; no baked card frames, card slots, deck silhouettes, controls, labels, numbers, or hover markers. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A must be a long rail with no vertical card-like features; decoration should stay at extreme ends and along a thin bottom edge.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, constellation diagrams, star-map labels, astrology symbols, zodiac signs, moon phase icons, readable runes, magical writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AO-PZ-B

- Style: `astral-orchid` / Astral Orchid
- Slot: `player-zone`
- Variant: `B`
- Target dimensions: `3840x520`
- Required filename: `player-zone.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/player-zone/astral-orchid/B/player-zone.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, ultra-wide PlayerZone rail skin, exact final PNG target 3840x520.
Prompt id: SAM-AO-PZ-B.
Primary request: create a Astral Orchid style asset for the GemDuel slot player-zone.png. The style identity is deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps. Use midnight purple enamel, pale orchid highlights, restrained moon-silver trim.
Project constraints: very wide 96:13 horizontal player rail usable for P1 and P2 anchoring; quiet center bands for React-rendered card stacks, reserved cards, inventory gems, counters, badges, and active-player rings; no baked card frames, card slots, deck silhouettes, controls, labels, numbers, or hover markers. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be a smoother long tabletop rail, with asymmetric edge atmosphere and no card placeholders or UI silhouettes.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, constellation diagrams, star-map labels, astrology symbols, zodiac signs, moon phase icons, readable runes, magical writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AO-GP-A

- Style: `astral-orchid` / Astral Orchid
- Slot: `gem-panel`
- Variant: `A`
- Target dimensions: `1254x1254`
- Required filename: `gem-panel.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/gem-panel/astral-orchid/A/gem-panel.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, front-facing square gem board substrate, exact final PNG target 1254x1254.
Prompt id: SAM-AO-GP-A.
Primary request: create a Astral Orchid style asset for the GemDuel slot gem-panel.png. The style identity is deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps. Use dark orchid crystal, silver bevels, soft plum glow.
Project constraints: orthographic square 5x5 board substrate; exact visual grid line anchors: vertical x=100,305,515,726,938,1141 and horizontal y=104,308,512,717,917,1132; empty readable wells only; no baked gems, click markers, symbols, labels, or tokens. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should prioritize exact grid alignment, empty wells, and low visual noise.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, constellation diagrams, star-map labels, astrology symbols, zodiac signs, moon phase icons, readable runes, magical writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AO-GP-B

- Style: `astral-orchid` / Astral Orchid
- Slot: `gem-panel`
- Variant: `B`
- Target dimensions: `1254x1254`
- Required filename: `gem-panel.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/gem-panel/astral-orchid/B/gem-panel.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, front-facing square gem board substrate, exact final PNG target 1254x1254.
Prompt id: SAM-AO-GP-B.
Primary request: create a Astral Orchid style asset for the GemDuel slot gem-panel.png. The style identity is deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps. Use midnight purple enamel, pale orchid highlights, restrained moon-silver trim.
Project constraints: orthographic square 5x5 board substrate; exact visual grid line anchors: vertical x=100,305,515,726,938,1141 and horizontal y=104,308,512,717,917,1132; empty readable wells only; no baked gems, click markers, symbols, labels, or tokens. This slot should harmonize with the card backs and gem panel from the same style, but it must remain a passive background substrate.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be a stricter low-noise alternative with crisp divider grooves exactly on the required grid anchors.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, constellation diagrams, star-map labels, astrology symbols, zodiac signs, moon phase icons, readable runes, magical writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AO-L1-A

- Style: `astral-orchid` / Astral Orchid
- Slot: `market-card-back-l1`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l1.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l1/astral-orchid/A/market-card-back-l1.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, lowest tier, exact final PNG target 1086x1448.
Prompt id: SAM-AO-L1-A.
Primary request: create a Astral Orchid style asset for the GemDuel slot market-card-back-l1.png. The style identity is deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps. Use dark orchid crystal, silver bevels, soft plum glow.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family as the other market backs; visibly simplest tier through lower ornament density and calmer trim only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the simplest member; communicate low tier only through restrained ornament and material quietness, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should be plain and disciplined with one non-symbolic central material motif and sparse trim.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, constellation diagrams, star-map labels, astrology symbols, zodiac signs, moon phase icons, readable runes, magical writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AO-L1-B

- Style: `astral-orchid` / Astral Orchid
- Slot: `market-card-back-l1`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l1.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l1/astral-orchid/B/market-card-back-l1.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, lowest tier, exact final PNG target 1086x1448.
Prompt id: SAM-AO-L1-B.
Primary request: create a Astral Orchid style asset for the GemDuel slot market-card-back-l1.png. The style identity is deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps. Use midnight purple enamel, pale orchid highlights, restrained moon-silver trim.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family as the other market backs; visibly simplest tier through lower ornament density and calmer trim only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the simplest member; communicate low tier only through restrained ornament and material quietness, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be understated, relying on material quality and a clean border instead of ornament density.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, constellation diagrams, star-map labels, astrology symbols, zodiac signs, moon phase icons, readable runes, magical writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AO-L2-A

- Style: `astral-orchid` / Astral Orchid
- Slot: `market-card-back-l2`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l2.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l2/astral-orchid/A/market-card-back-l2.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, middle tier, exact final PNG target 1086x1448.
Prompt id: SAM-AO-L2-A.
Primary request: create a Astral Orchid style asset for the GemDuel slot market-card-back-l2.png. The style identity is deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps. Use dark orchid crystal, silver bevels, soft plum glow.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L3; visibly richer mid-tier accent by material depth and moderate ornament only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must sit between L1 and L3; communicate middle tier only through moderate ornament and accent richness, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should add moderate trim and material contrast while preserving the same silhouette language.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, constellation diagrams, star-map labels, astrology symbols, zodiac signs, moon phase icons, readable runes, magical writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AO-L2-B

- Style: `astral-orchid` / Astral Orchid
- Slot: `market-card-back-l2`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l2.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l2/astral-orchid/B/market-card-back-l2.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, middle tier, exact final PNG target 1086x1448.
Prompt id: SAM-AO-L2-B.
Primary request: create a Astral Orchid style asset for the GemDuel slot market-card-back-l2.png. The style identity is deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps. Use midnight purple enamel, pale orchid highlights, restrained moon-silver trim.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L3; visibly richer mid-tier accent by material depth and moderate ornament only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must sit between L1 and L3; communicate middle tier only through moderate ornament and accent richness, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should read as a richer companion to L1 using mid-density trim and a confident abstract material motif.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, constellation diagrams, star-map labels, astrology symbols, zodiac signs, moon phase icons, readable runes, magical writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AO-L3-A

- Style: `astral-orchid` / Astral Orchid
- Slot: `market-card-back-l3`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l3.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l3/astral-orchid/A/market-card-back-l3.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, highest market tier, exact final PNG target 1086x1448.
Prompt id: SAM-AO-L3-A.
Primary request: create a Astral Orchid style asset for the GemDuel slot market-card-back-l3.png. The style identity is deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps. Use dark orchid crystal, silver bevels, soft plum glow.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L2; most luxurious market tier by trim, jewel density, edge glow, and prestige material only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the richest market member; communicate high tier only through premium trim and controlled jewel-like accents, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should feel premium through layered trim and controlled jewel-like accents without becoming noisy.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, constellation diagrams, star-map labels, astrology symbols, zodiac signs, moon phase icons, readable runes, magical writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AO-L3-B

- Style: `astral-orchid` / Astral Orchid
- Slot: `market-card-back-l3`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `market-card-back-l3.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/market-card-back-l3/astral-orchid/B/market-card-back-l3.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, market card back, highest market tier, exact final PNG target 1086x1448.
Prompt id: SAM-AO-L3-B.
Primary request: create a Astral Orchid style asset for the GemDuel slot market-card-back-l3.png. The style identity is deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps. Use midnight purple enamel, pale orchid highlights, restrained moon-silver trim.
Project constraints: card back on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; same family silhouette as L1 and L2; most luxurious market tier by trim, jewel density, edge glow, and prestige material only; no text, numbers, Roman numerals, level marks, labels, icons, or UI elements. For the market back family, this image must be the richest market member; communicate high tier only through premium trim and controlled jewel-like accents, never through text or numerals.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be the most ornate market back but still readable when downsampled to a 150x200 display box.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, constellation diagrams, star-map labels, astrology symbols, zodiac signs, moon phase icons, readable runes, magical writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AO-ROYAL-A

- Style: `astral-orchid` / Astral Orchid
- Slot: `royal-card-back`
- Variant: `A`
- Target dimensions: `1086x1448`
- Required filename: `royal-card-back.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/royal-card-back/astral-orchid/A/royal-card-back.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, royal prestige card back, exact final PNG target 1086x1448.
Prompt id: SAM-AO-ROYAL-A.
Primary request: create a Astral Orchid style asset for the GemDuel slot royal-card-back.png. The style identity is deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps. Use dark orchid crystal, silver bevels, soft plum glow.
Project constraints: sovereign prestige card back for RoyalCourt preview on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; stronger royal identity than market backs through material and composition, not text; no text, numbers, Roman numerals, labels, crown letters, icons, or UI elements. This royal back must feel more sovereign and prestigious than the three market backs while remaining from the same premium GemDuel surface-art universe.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant A should use a centered sovereign medallion-like abstract material shape, stronger frame depth, and no literal marks.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, constellation diagrams, star-map labels, astrology symbols, zodiac signs, moon phase icons, readable runes, magical writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```

### SAM-AO-ROYAL-B

- Style: `astral-orchid` / Astral Orchid
- Slot: `royal-card-back`
- Variant: `B`
- Target dimensions: `1086x1448`
- Required filename: `royal-card-back.png`
- Planned archive path: `assets/art-library/surface-autonomous-mythic-styles-candidates/2026-04-27/royal-card-back/astral-orchid/B/royal-card-back.png`

```text
Use case: stylized-concept.
Asset type: GemDuel surface UI candidate, royal prestige card back, exact final PNG target 1086x1448.
Prompt id: SAM-AO-ROYAL-B.
Primary request: create a Astral Orchid style asset for the GemDuel slot royal-card-back.png. The style identity is deep orchid crystal, plum velvet shadow, silver starlight material, abstract celestial geometry without constellations or readable star maps. Use midnight purple enamel, pale orchid highlights, restrained moon-silver trim.
Project constraints: sovereign prestige card back for RoyalCourt preview on FEATURED_CARD_SAMPLE_SIZE 1086x1448 canvas; stronger royal identity than market backs through material and composition, not text; no text, numbers, Roman numerals, labels, crown letters, icons, or UI elements. This royal back must feel more sovereign and prestigious than the three market backs while remaining from the same premium GemDuel surface-art universe.
Composition: design the artwork for the exact requested canvas and aspect ratio, front-facing and production-ready, with stable margins and no later reliance on app-rendered masks. Variant B should be the most ceremonial piece in the style group, with a strong frame and noble material hierarchy but no UI-badge shapes.
Readability: React renders all labels, card levels, counts, gems, buttons, hover rings, selection states, active-player frames, score/crown/turn UI, and gameplay affordances. Keep the underlying bitmap calm enough for those React overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, readable letters, logos, watermarks, fake alphabet, fake glyph writing, readable script, UI labels, counters, controls, button shapes, selection markers, baked gameplay icons, baked gems, card-slot silhouettes, placeholder rectangles, click markers, constellation diagrams, star-map labels, astrology symbols, zodiac signs, moon phase icons, readable runes, magical writing.
Output: single clean bitmap artwork only, no border padding outside the requested image, no mockup, no screenshot, no UI overlay.
```
