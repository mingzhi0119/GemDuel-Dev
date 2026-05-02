# Surface Asset Autonomous Prompt Manifest - 2026-04-27

## Source Constraints

This manifest implements the candidate-library pass requested by
`docs/art/long-autonomous-surface-asset-generation-codex-prompt-2026-04-27.md`.

Inspected source anchors:

- `AGENTS.md`
- `docs/guides/frontend-layout-guide.md`
- `apps/desktop/public/assets/surfaces/README.md`
- `apps/desktop/src/app/shell/surfaceTheme.ts`
- `apps/desktop/src/app/shell/surfaceArtwork.ts`
- `apps/desktop/src/app/shell/playerZoneSurfaceStyles.ts`
- `packages/ui/src/components/card/cardSizing.ts`
- `packages/ui/src/components/Card.tsx`
- `packages/ui/src/components/market/MarketDeckBack.tsx`
- `docs/art/surface-anime-asset-library-2026-04-26.md`
- `docs/art/surface-anime-gem-panel-refined-prompts-2026-04-26.md`
- `docs/art/surface-anime-player-zone-refined-2026-04-26.md`

Runtime constraints confirmed from code and docs:

- Existing surface styles are `royal-luxury`, `clean-boardgame`, `crystal-anime`, and `dark-arcane`.
- This pass archives candidates only under `assets/art-library/surface-autonomous-candidates/2026-04-27/`.
- Do not overwrite runtime files under `apps/desktop/public/assets/surfaces`.
- Shell background is the single full-board table surface; there is no separate playmat/tablecloth slot.
- TopBar uses a 120px logical header and must preserve readable score/crown/turn zones.
- PlayerZone art is anchored left for P1 and right for P2; no baked card frames, slots, controls, labels, or numbers.
- GemPanel uses a 1254x1254 square substrate with visual grid lines at x=`100,305,515,726,938,1141` and y=`104,308,512,717,917,1132`.
- Featured card backs use `FEATURED_CARD_SAMPLE_SIZE` `1086x1448` and runtime display box `FEATURED_CARD_SIZE` `150x200`.
- React renders all labels, counts, icons, card levels, gems, controls, hover rings, selection states, and gameplay affordances.
- Global avoid list: no text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked gems, baked UI, labels, counters, card-slot silhouettes, or click markers.

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

## Style Recipes

| Style             | Display name    | Recipe                                                                                                                            |
| ----------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `royal-luxury`    | Royal Luxury    | Deep palace tabletop, blackened metal, burnished gold, crown/court material language, premium prestige, controlled high contrast. |
| `clean-boardgame` | Clean Boardgame | Modern premium tabletop, matte stone, satin metal, restrained brass or ivory trim, low-noise practical readability.               |
| `crystal-anime`   | Crystal Anime   | Translucent gemstone materials, prismatic glass, crisp anime light, readable dark base, energetic but controlled glow.            |
| `dark-arcane`     | Dark Arcane     | Obsidian table, dark brass, restrained magical ambience, non-linguistic geometry only, dim jewel glow, no fake writing.           |

## Prompt Manifest

### royal-luxury-shell-background-a

- Slot: `shell-background`
- Style: `royal-luxury`
- Variant: `a`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/royal-luxury/a/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Royal Luxury full-board table surface for GemDuel. This is the only large shell background behind the centered gameplay stage, not a separate playmat or tablecloth.
Scene/backdrop: deep palace tabletop made from blackened metal, burnished gold trim, dark lacquer, and restrained crown-court materials.
Style/medium: premium game UI illustration, high-end tabletop surface, polished but low-noise.
Composition/framing: 16:9 full-board background, centered gameplay area remains subdued and readable; stronger atmosphere and ornament may sit near edges, corners, and outer border only.
Lighting/mood: controlled dark royal contrast, soft edge highlights, no high-glare wash.
Constraints: React renders all gameplay UI, cards, labels, counts, gems, buttons, hover rings, and overlays. Keep the center calm enough for the scaled gameplay shell.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, card slots, deck silhouettes, baked controls, busy center, separate playmat rectangle.
```

### royal-luxury-shell-background-b

- Slot: `shell-background`
- Style: `royal-luxury`
- Variant: `b`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/royal-luxury/b/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create an alternate Royal Luxury full-board table surface for GemDuel with a quieter middle and more ceremonial edge framing.
Scene/backdrop: black palace table, antique gold inlay, subtle crown-court motifs on the perimeter, dark velvet-metal material depth.
Style/medium: premium fantasy board-game UI background, restrained royal ornament.
Composition/framing: 16:9 front-facing table surface, low-noise center for the gameplay stage; edge and corner decoration only, no separate panel shape in the middle.
Lighting/mood: dark, legible, refined, controlled gold rim light.
Constraints: React renders all labels, counts, icons, cards, gameplay affordances, and overlays. The bitmap must remain a background surface only.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, card slots, deck silhouettes, controls, high-glare center, fake playmat border.
```

### royal-luxury-topbar-a

- Slot: `topbar`
- Style: `royal-luxury`
- Variant: `a`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/topbar/royal-luxury/a/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Royal Luxury panoramic header strip for the 120px logical TopBar.
Scene/backdrop: burnished gold palace trim, dark lacquered metal, subtle crown-court accents.
Style/medium: premium game UI strip, sharp material polish, restrained ornament.
Composition/framing: ultra-wide header strip with quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
Lighting/mood: controlled dark gold contrast, no central glare.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, badge shapes, central object blocking overlay zones.
```

### royal-luxury-topbar-b

- Slot: `topbar`
- Style: `royal-luxury`
- Variant: `b`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/topbar/royal-luxury/b/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create an alternate Royal Luxury panoramic header strip with darker court-metal materials and very quiet overlay bands.
Scene/backdrop: blackened steel, antique gold filigree on the border, subtle crown material language at far edges.
Style/medium: premium tabletop UI header, clean and readable.
Composition/framing: ultra-wide strip; keep score/crown/turn readable zones at 25%, 50%, and 75% width subdued. Decoration stays at extreme edges and thin border rails.
Lighting/mood: low-glare dark royal mood, crisp gold edge light.
Constraints: React renders all labels, counts, scores, icons, controls, and turn UI later.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, central medallion, bright wash.
```

### royal-luxury-player-zone-a

- Slot: `player-zone`
- Style: `royal-luxury`
- Variant: `a`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/player-zone/royal-luxury/a/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Royal Luxury ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: dark palace rail, black lacquer, burnished gold trim, subtle crown-court materials.
Style/medium: premium game UI environment rail, elegant and restrained.
Composition/framing: ultra-wide horizontal band with quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration only near extreme edges, corners, and thin top/bottom borders.
Lighting/mood: dark readable gold accents, no bright wash.
Constraints: React renders all cards, labels, counters, inventory gems, badges, controls, rings, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, counters.
```

### royal-luxury-player-zone-b

- Slot: `player-zone`
- Style: `royal-luxury`
- Variant: `b`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/player-zone/royal-luxury/b/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create an alternate Royal Luxury player rail with a cleaner center and stronger ceremonial outer edge trim.
Scene/backdrop: blackened court-metal rail, antique gold edge inlay, dark premium tabletop material.
Style/medium: polished board-game UI rail, luxurious but practical.
Composition/framing: ultra-wide band, left and right anchoring compatible. Keep all functional center bands calm; push detail to corners, edge trim, and far side ornaments.
Lighting/mood: controlled gold rim light, dark readable center.
Constraints: React renders player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked card frames, card slots, deck silhouettes, UI controls, labels, numbers, placeholder rectangles.
```

### royal-luxury-gem-panel-a

- Slot: `gem-panel`
- Style: `royal-luxury`
- Variant: `a`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/gem-panel/royal-luxury/a/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Royal Luxury square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: dark palace tabletop panel, burnished gold trim, blackened metal, restrained crown-court materials on the outer frame.
Style/medium: premium board-game UI panel, high-contrast royal metal, polished bevels.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame.
Lighting/mood: controlled edge highlights, readable center, no overexposure.
Constraints: React renders all gems, labels, counts, levels, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked gems, cell icons, click markers, selection rings, oversized border, noisy center.
```

### royal-luxury-gem-panel-b

- Slot: `gem-panel`
- Style: `royal-luxury`
- Variant: `b`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/gem-panel/royal-luxury/b/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create an alternate Royal Luxury square 5x5 gem board panel with darker court-metal frame and very low-noise cell wells.
Scene/backdrop: black steel, antique gold inlay, subtle crown-court accents in corners and outer rim only.
Style/medium: premium fantasy board-game component, crisp bevels and material depth.
Composition/framing: orthographic square panel. Align dividers to x=100,305,515,726,938,1141 and y=104,308,512,717,917,1132. Keep the 5x5 cells empty and readable, with no large border drift.
Lighting/mood: dark high contrast, soft gold edge light, calm center.
Constraints: React renders all gameplay gems, labels, counts, click states, and selection effects.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked gems, symbols inside cells, click markers, oversized margins, busy center.
```

### royal-luxury-market-card-back-l1-a

- Slot: `market-card-back-l1`
- Style: `royal-luxury`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l1/royal-luxury/a/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier Royal Luxury market card back. It must belong to the same L1/L2/L3 set but look simpler than L2 and L3.
Scene/backdrop: dark royal card back with modest black lacquer, restrained gold trim, simple court-material motif.
Style/medium: premium vertical card-back illustration, clean symmetrical frame.
Composition/framing: full vertical card back with shared set silhouette, readable blank center, modest ornament density. No text or level marks; tier is communicated only through simpler material richness.
Lighting/mood: controlled dark gold, low glare, readable at 150x200 runtime display.
Constraints: React renders all labels, counts, levels, card UI, and deck count overlays. This is a 1086x1448 source canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, gems, controls, high-noise center.
```

### royal-luxury-market-card-back-l1-b

- Slot: `market-card-back-l1`
- Style: `royal-luxury`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l1/royal-luxury/b/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create an alternate lowest-tier Royal Luxury market card back, simple and restrained, coherent with richer L2/L3 siblings.
Scene/backdrop: blackened court metal, plain gold border, subtle crown-court material hints without symbols or labels.
Style/medium: premium game card back, symmetrical, low ornament.
Composition/framing: vertical card back, shared set silhouette and frame language, open calm center, fewer jewels and weaker glow than higher tiers.
Lighting/mood: dark royal, soft edge highlights, readable after downsampling to 150x200.
Constraints: React renders all market deck labels, level text, counts, and UI states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI elements, baked gems, busy center.
```

### royal-luxury-market-card-back-l2-a

- Slot: `market-card-back-l2`
- Style: `royal-luxury`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l2/royal-luxury/a/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier Royal Luxury market card back. It must match the L1/L3 set while showing more ornament and prestige than L1 but less than L3.
Scene/backdrop: dark palace card back, richer gold trim, medium jewel inlay, polished court-metal frame.
Style/medium: premium vertical card-back illustration, symmetrical fantasy board-game asset.
Composition/framing: shared card-back silhouette and frame language; readable center; moderate ornament density and glow. No text or numeric level indicators.
Lighting/mood: controlled amber-gold prestige, not overbright.
Constraints: React renders all market labels, counts, levels, and overlays. Candidate must remain legible at 150x200 display size.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, controls, noisy center.
```

### royal-luxury-market-card-back-l2-b

- Slot: `market-card-back-l2`
- Style: `royal-luxury`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l2/royal-luxury/b/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create an alternate mid-tier Royal Luxury market card back, coherent with L1/L3 and visibly medium prestige.
Scene/backdrop: antique gold and black steel card back, medium court ornament, refined inlay without writing.
Style/medium: premium game-card back, symmetrical, polished.
Composition/framing: vertical card back, shared set silhouette, modestly ornate border, readable center. More detailed than L1 and clearly less luxurious than L3.
Lighting/mood: warm controlled gold light, low glare.
Constraints: React renders all text, level labels, counts, and hover states. Image is source art for a 150x200 display box.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI elements, card labels, baked gems, over-busy center.
```

### royal-luxury-market-card-back-l3-a

- Slot: `market-card-back-l3`
- Style: `royal-luxury`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l3/royal-luxury/a/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier Royal Luxury market card back. It must match the L1/L2 set while looking most luxurious.
Scene/backdrop: sovereign dark palace card back, rich gold filigree, jewel accents, prestigious court-metal frame.
Style/medium: premium vertical card-back illustration, ornate but readable, high-tier fantasy board-game asset.
Composition/framing: shared card-back silhouette and frame language; strongest ornament at border and corners, readable center, no text or level marks. Tier progression comes from trim richness, jewel density, and stronger glow.
Lighting/mood: deep royal gold with controlled prestige glow, no white wash.
Constraints: React renders all labels, counts, levels, and UI overlays. Must remain legible at 150x200 runtime display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, controls, illegible clutter.
```

### royal-luxury-market-card-back-l3-b

- Slot: `market-card-back-l3`
- Style: `royal-luxury`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l3/royal-luxury/b/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create an alternate highest-tier Royal Luxury market card back, most prestigious in the L1/L2/L3 set.
Scene/backdrop: black lacquer, antique gold, dense royal inlay, jewel-like corner accents, sovereign court materials.
Style/medium: ornate premium card-back art, symmetrical and polished.
Composition/framing: vertical card back, same set silhouette as lower tiers, richest trim and glow, readable blank center, no textual tier indicator.
Lighting/mood: controlled dramatic royal glow, high prestige but not overexposed.
Constraints: React renders all labels, counts, level text, and deck UI. Source canvas is 1086x1448 and downsampled into 150x200 display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, excessive clutter.
```

### royal-luxury-royal-card-back-a

- Slot: `royal-card-back`
- Style: `royal-luxury`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/royal-card-back/royal-luxury/a/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create a sovereign Royal Luxury card back for RoyalCourt previews, stronger royal identity than market backs.
Scene/backdrop: dark palace sovereignty, crown-court materials, burnished gold, blackened steel, jewel-like prestige accents.
Style/medium: premium royal card-back illustration, ornate symmetrical frame.
Composition/framing: full vertical card back with a powerful sovereign identity, ornate frame, readable center, no baked gameplay UI.
Lighting/mood: deep royal prestige, controlled glow, not washed out.
Constraints: React renders all RoyalCourt labels, card data, UI states, and overlays. This is source art for featured-card downsampling.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, level marks, baked gems, controls, illegible detail.
```

### royal-luxury-royal-card-back-b

- Slot: `royal-card-back`
- Style: `royal-luxury`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/royal-card-back/royal-luxury/b/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create an alternate sovereign Royal Luxury card back with the clearest premium RoyalCourt identity.
Scene/backdrop: black palace metal, antique gold frame, ceremonial crown-court motifs as material design, jewel-accented border.
Style/medium: premium fantasy card back, polished, symmetrical, more prestigious than market backs.
Composition/framing: full vertical card back, powerful royal frame and calm center, no text or level marks.
Lighting/mood: controlled dark gold, regal and readable at 150x200 display.
Constraints: React renders all UI labels, card details, counts, and overlay states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, baked gems, controls, high-noise center.
```

### clean-boardgame-shell-background-a

- Slot: `shell-background`
- Style: `clean-boardgame`
- Variant: `a`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/clean-boardgame/a/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Clean Boardgame full-board table surface for GemDuel. This is the only large shell background behind the centered gameplay stage.
Scene/backdrop: modern premium tabletop, matte stone, satin metal, restrained brass or ivory trim.
Style/medium: practical board-game UI illustration, low noise, production-readable.
Composition/framing: 16:9 full-board table surface with subdued center for the gameplay shell and slightly stronger material detail around edges and corners. No separate playmat or center panel.
Lighting/mood: calm studio lighting, readable in both dark and light app contexts, no glare.
Constraints: React renders all gameplay UI, cards, labels, counts, gems, controls, hover rings, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, card slots, baked controls, gray overlay panels, busy center, separate playmat rectangle.
```

### clean-boardgame-shell-background-b

- Slot: `shell-background`
- Style: `clean-boardgame`
- Variant: `b`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/clean-boardgame/b/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create an alternate Clean Boardgame full-board surface with warmer tabletop materials and a quiet center.
Scene/backdrop: premium matte stone table, subtle slate separators, thin bronze or ivory material accents.
Style/medium: modern board-game UI background, restrained and useful.
Composition/framing: full 16:9 tabletop surface; center stays low-contrast for the game stage; edge trim and material variation around perimeter only.
Lighting/mood: calm neutral light, subtle shadows, no high-glare or white wash.
Constraints: React renders all gameplay pieces, cards, labels, buttons, counts, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, card slots, baked controls, playmat rectangle, noisy center.
```

### clean-boardgame-topbar-a

- Slot: `topbar`
- Style: `clean-boardgame`
- Variant: `a`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/topbar/clean-boardgame/a/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Clean Boardgame panoramic header strip for the 120px logical TopBar.
Scene/backdrop: matte stone and satin metal UI strip, restrained brass trim, neutral tabletop materials.
Style/medium: modern premium board-game UI header, low-noise and readable.
Composition/framing: ultra-wide strip with quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament remains at edges, corners, and thin borders.
Lighting/mood: practical neutral contrast, soft shadows, no glare.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, central badge, noisy overlay zones.
```

### clean-boardgame-topbar-b

- Slot: `topbar`
- Style: `clean-boardgame`
- Variant: `b`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/topbar/clean-boardgame/b/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create an alternate Clean Boardgame TopBar strip with warmer premium tabletop material.
Scene/backdrop: matte ivory stone, subtle slate rail, thin bronze edge trim.
Style/medium: clean board-game UI strip, practical and restrained.
Composition/framing: ultra-wide horizontal strip; keep 25%, 50%, and 75% overlay zones quiet. Decoration only along border rails and far corners.
Lighting/mood: calm neutral light, readable without bright wash.
Constraints: React renders all labels, score, crown, turn state, buttons, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, central emblem, busy patterns.
```

### clean-boardgame-player-zone-a

- Slot: `player-zone`
- Style: `clean-boardgame`
- Variant: `a`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/player-zone/clean-boardgame/a/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Clean Boardgame ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: matte stone player rail, satin metal dividers, restrained brass or ivory material trim.
Style/medium: modern practical game UI rail, low noise, readable.
Composition/framing: ultra-wide band with quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration limited to edges, corners, and top/bottom trim.
Lighting/mood: soft neutral lighting, no glare, high foreground readability.
Constraints: React renders all cards, labels, counters, inventory gems, badges, controls, rings, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels.
```

### clean-boardgame-player-zone-b

- Slot: `player-zone`
- Style: `clean-boardgame`
- Variant: `b`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/player-zone/clean-boardgame/b/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create an alternate Clean Boardgame player rail with warm tabletop material and very clear overlay bands.
Scene/backdrop: matte ivory and slate rail, thin bronze trim, practical tabletop surface.
Style/medium: clean modern board-game UI asset, minimal and polished.
Composition/framing: ultra-wide band compatible with left and right anchoring. Keep functional center areas flat and quiet; edge and corner details only.
Lighting/mood: calm neutral brightness, no white wash, readable under dark and light UI.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked card frames, card slots, deck silhouettes, controls, labels, placeholder rectangles.
```

### clean-boardgame-gem-panel-a

- Slot: `gem-panel`
- Style: `clean-boardgame`
- Variant: `a`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/gem-panel/clean-boardgame/a/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Clean Boardgame square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: premium matte stone and satin metal board component, restrained brass or ivory trim.
Style/medium: modern board-game UI panel, low-noise, highly readable.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact frame.
Lighting/mood: soft studio light, subtle bevel shadows, practical contrast.
Constraints: React renders all gems, labels, counts, levels, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked gems, cell icons, click markers, selection rings, oversized frame, busy center.
```

### clean-boardgame-gem-panel-b

- Slot: `gem-panel`
- Style: `clean-boardgame`
- Variant: `b`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/gem-panel/clean-boardgame/b/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create an alternate Clean Boardgame square 5x5 gem board panel with warmer materials and exact cell alignment.
Scene/backdrop: matte ivory stone wells, subtle slate separators, thin bronze edge trim.
Style/medium: clean modern board-game component, practical UI readability, low noise.
Composition/framing: orthographic square board. Align dividers to x=100,305,515,726,938,1141 and y=104,308,512,717,917,1132. The 5x5 cells must remain empty and readable.
Lighting/mood: calm neutral light, subtle shadows, no dramatic glare.
Constraints: React renders all gems, labels, counts, hover rings, click markers, and selection states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked gems, cell symbols, selection markers, oversized border, busy center.
```

### clean-boardgame-market-card-back-l1-a

- Slot: `market-card-back-l1`
- Style: `clean-boardgame`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l1/clean-boardgame/a/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier Clean Boardgame market card back. It must belong to the same L1/L2/L3 set but look simpler than L2 and L3.
Scene/backdrop: matte tabletop card back, simple stone and satin metal frame, restrained trim.
Style/medium: clean premium card-back illustration, practical and symmetrical.
Composition/framing: vertical card back with shared set silhouette, readable blank center, minimal ornament. No text or level marks; tier is shown only by simpler material richness.
Lighting/mood: calm neutral contrast, readable after downsampling to 150x200.
Constraints: React renders market deck labels, levels, counts, and UI overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, controls, noisy center.
```

### clean-boardgame-market-card-back-l1-b

- Slot: `market-card-back-l1`
- Style: `clean-boardgame`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l1/clean-boardgame/b/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create an alternate lowest-tier Clean Boardgame market card back, simple and low-noise, coherent with richer L2/L3 siblings.
Scene/backdrop: clean slate card back, thin bronze or ivory border, matte material center.
Style/medium: modern board-game card back, symmetrical, restrained.
Composition/framing: full vertical card back, shared silhouette and frame language, open center, fewer accents than higher tiers.
Lighting/mood: neutral, readable, low glare.
Constraints: React renders all level labels, counts, text, and UI states. Source canvas downscales into a 150x200 display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI elements, baked gems, busy center.
```

### clean-boardgame-market-card-back-l2-a

- Slot: `market-card-back-l2`
- Style: `clean-boardgame`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l2/clean-boardgame/a/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier Clean Boardgame market card back. It must match the L1/L3 set while showing more ornament than L1 and less than L3.
Scene/backdrop: premium matte stone card back, satin metal border, medium brass or ivory trim.
Style/medium: modern premium card-back illustration, symmetrical and practical.
Composition/framing: vertical card back with shared set silhouette, readable center, moderate ornament density. No text or numeric level indicators.
Lighting/mood: soft neutral contrast, slight prestige highlight, not overbright.
Constraints: React renders all market labels, levels, counts, and overlays. Must remain readable at 150x200.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, controls, noisy center.
```

### clean-boardgame-market-card-back-l2-b

- Slot: `market-card-back-l2`
- Style: `clean-boardgame`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l2/clean-boardgame/b/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create an alternate mid-tier Clean Boardgame market card back, visibly medium prestige within the L1/L2/L3 set.
Scene/backdrop: matte ivory and slate materials, medium bronze trim, refined board-game frame.
Style/medium: clean premium card-back art, symmetrical, readable.
Composition/framing: same set silhouette as L1/L3; moderate border detail, calm center, no textual tier indicator.
Lighting/mood: calm neutral light, low glare.
Constraints: React renders all labels, counts, levels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, over-busy center.
```

### clean-boardgame-market-card-back-l3-a

- Slot: `market-card-back-l3`
- Style: `clean-boardgame`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l3/clean-boardgame/a/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier Clean Boardgame market card back. It must match the L1/L2 set while looking most luxurious.
Scene/backdrop: premium modern tabletop card back, rich satin metal, refined brass trim, polished matte stone.
Style/medium: high-tier clean board-game card back, symmetrical, practical.
Composition/framing: shared card-back silhouette and frame language; richest border detail and accents; readable center; no text or level marks.
Lighting/mood: controlled premium highlight, not white-washed.
Constraints: React renders labels, counts, level text, and overlays. Must remain readable at 150x200.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, controls, illegible clutter.
```

### clean-boardgame-market-card-back-l3-b

- Slot: `market-card-back-l3`
- Style: `clean-boardgame`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l3/clean-boardgame/b/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create an alternate highest-tier Clean Boardgame market card back, most premium in the L1/L2/L3 set.
Scene/backdrop: polished slate and ivory card back, rich bronze trim, refined premium tabletop material.
Style/medium: clean ornate card-back art, symmetrical and readable.
Composition/framing: full vertical card back, same set silhouette, highest trim density and material richness, calm center, no textual tier indicator.
Lighting/mood: premium controlled light, readable after downsampling.
Constraints: React renders all labels, counts, levels, and UI states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, excessive clutter.
```

### clean-boardgame-royal-card-back-a

- Slot: `royal-card-back`
- Style: `clean-boardgame`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/royal-card-back/clean-boardgame/a/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create a Clean Boardgame sovereign card back for RoyalCourt previews, more prestigious than market backs while staying practical.
Scene/backdrop: premium matte stone, refined satin metal, restrained royal-court material language without text.
Style/medium: clean premium royal card-back illustration, symmetrical and polished.
Composition/framing: full vertical prestige card back with ornate frame and readable calm center, stronger identity than market backs.
Lighting/mood: neutral premium contrast, subtle highlight, no glare.
Constraints: React renders all RoyalCourt labels, card data, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, level marks, baked gems, controls, illegible detail.
```

### clean-boardgame-royal-card-back-b

- Slot: `royal-card-back`
- Style: `clean-boardgame`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/royal-card-back/clean-boardgame/b/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create an alternate Clean Boardgame royal card back with clear sovereign identity and practical readability.
Scene/backdrop: matte ivory stone, polished slate, refined bronze trim, subtle court prestige materials.
Style/medium: premium board-game royal card back, symmetrical, restrained.
Composition/framing: full vertical card back, ornate but clean frame, calm center, no text or level marks.
Lighting/mood: calm premium light, readable at 150x200 display.
Constraints: React renders all UI labels, card details, counts, and overlay states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, baked gems, controls, high-noise center.
```

### crystal-anime-shell-background-a

- Slot: `shell-background`
- Style: `crystal-anime`
- Variant: `a`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/crystal-anime/a/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Crystal Anime full-board table surface for GemDuel. This is the only large shell background behind the centered gameplay stage.
Scene/backdrop: dark gemstone tabletop, translucent crystal edge materials, prismatic glass accents around perimeter.
Style/medium: controlled anime UI illustration, crisp crystal facets, premium game surface.
Composition/framing: 16:9 full-board background. Center remains subdued and low-noise for gameplay; stronger crystal atmosphere may sit near edges and corners. No separate playmat or central panel.
Lighting/mood: cyan, pearl, and violet highlights over a readable dark base; no overexposure.
Constraints: React renders all gameplay UI, cards, labels, counts, gems, buttons, hover rings, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, card slots, controls, baked gems, noisy center, separate playmat rectangle.
```

### crystal-anime-shell-background-b

- Slot: `shell-background`
- Style: `crystal-anime`
- Variant: `b`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/crystal-anime/b/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create an alternate Crystal Anime full-board surface with darker transparent facets and an especially calm center.
Scene/backdrop: smoky crystal table, frosted glass edge structures, delicate prismatic perimeter light.
Style/medium: anime-inspired premium UI background, refined and readable.
Composition/framing: full 16:9 tabletop surface; low-noise center for the game shell; facets and glow concentrated at edges and corners.
Lighting/mood: controlled violet-cyan glow, dark readable middle, no central haze.
Constraints: React renders all gameplay pieces, labels, buttons, counts, cards, gems, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, card slots, controls, baked gems, playmat rectangle, bright center flare.
```

### crystal-anime-topbar-a

- Slot: `topbar`
- Style: `crystal-anime`
- Variant: `a`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/topbar/crystal-anime/a/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Crystal Anime panoramic header strip for the 120px logical TopBar.
Scene/backdrop: translucent gemstone rail, prismatic glass, crisp crystal facets, readable dark base.
Style/medium: anime game UI header strip, energetic but controlled.
Composition/framing: ultra-wide strip with quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Crystal detail belongs at edges, corners, and thin borders.
Lighting/mood: controlled cyan and violet highlights, no central glare.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, central object, bright wash over overlay zones.
```

### crystal-anime-topbar-b

- Slot: `topbar`
- Style: `crystal-anime`
- Variant: `b`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/topbar/crystal-anime/b/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create an alternate Crystal Anime TopBar strip with darker crystal facets and clean overlay lanes.
Scene/backdrop: smoky translucent crystal, frosted prismatic border, dark glass base.
Style/medium: controlled anime UI strip, refined and readable.
Composition/framing: ultra-wide header; keep 25%, 50%, and 75% zones quiet for React overlays; detail only in border rails and far corners.
Lighting/mood: subtle violet-cyan rim glow, readable center zones.
Constraints: React renders all labels, score, crown, turn state, buttons, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, central emblem, bright flare.
```

### crystal-anime-player-zone-a

- Slot: `player-zone`
- Style: `crystal-anime`
- Variant: `a`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/player-zone/crystal-anime/a/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Crystal Anime ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: dark crystal rail, translucent facets, prismatic edge trim, subtle anime glow.
Style/medium: premium anime game UI environment rail, vivid but practical.
Composition/framing: ultra-wide band with quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration only near extreme edges, corners, and thin top/bottom borders.
Lighting/mood: controlled cyan and pearl glow, no white wash.
Constraints: React renders all cards, labels, counters, inventory gems, badges, controls, rings, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels.
```

### crystal-anime-player-zone-b

- Slot: `player-zone`
- Style: `crystal-anime`
- Variant: `b`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/player-zone/crystal-anime/b/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create an alternate Crystal Anime player rail with darker transparent facets and very clean functional lanes.
Scene/backdrop: smoky crystal rail, frosted glass surface, prismatic edge decoration.
Style/medium: anime-inspired UI rail, polished, low visual noise.
Composition/framing: ultra-wide band compatible with left and right anchoring; calm center areas for React-rendered gameplay items; edge/corner detail only.
Lighting/mood: restrained violet-cyan glow, readable dark base.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked card frames, card slots, deck silhouettes, controls, labels, placeholder rectangles, bright center flares.
```

### crystal-anime-gem-panel-a

- Slot: `gem-panel`
- Style: `crystal-anime`
- Variant: `a`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/gem-panel/crystal-anime/a/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Crystal Anime square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: translucent crystal board substrate, glassy facets in the outer frame, subtle gem-like refractions around edges only.
Style/medium: controlled anime UI light effects, crisp crystal facets, premium game board illustration.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only.
Lighting/mood: soft cyan and pearl highlights, controlled glow, not overexposed.
Constraints: React renders all gems, labels, counts, levels, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked gems, cell icons, click markers, selection rings, bright cell-center flares, noisy center, oversized border.
```

### crystal-anime-gem-panel-b

- Slot: `gem-panel`
- Style: `crystal-anime`
- Variant: `b`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/gem-panel/crystal-anime/b/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create an alternate Crystal Anime square 5x5 gem board panel with darker transparent facets and exact cell alignment.
Scene/backdrop: cool smoky crystal frame, frosted empty wells, delicate prismatic edges outside the cells.
Style/medium: anime-inspired crystal UI, refined and readable, low visual noise.
Composition/framing: orthographic square board. Align dividers to x=100,305,515,726,938,1141 and y=104,308,512,717,917,1132. The 5x5 cells must remain empty and calm.
Lighting/mood: controlled violet-cyan glow, subdued center.
Constraints: React renders all gems, labels, counts, hover rings, click markers, and selection states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked gems, cell symbols, selection markers, intense glow in cell centers, large empty margins.
```

### crystal-anime-market-card-back-l1-a

- Slot: `market-card-back-l1`
- Style: `crystal-anime`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l1/crystal-anime/a/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier Crystal Anime market card back. It must belong to the same L1/L2/L3 set but look simpler than L2 and L3.
Scene/backdrop: dark crystal card back, simple translucent frame, subtle prismatic edge accents.
Style/medium: anime gemstone card-back illustration, clean symmetrical frame.
Composition/framing: full vertical card back with shared set silhouette, readable blank center, modest ornament density. No text or level marks; tier is communicated only through simpler material richness.
Lighting/mood: controlled cyan and pearl glow, readable after downsampling to 150x200.
Constraints: React renders market deck labels, levels, counts, and UI overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, controls, noisy center.
```

### crystal-anime-market-card-back-l1-b

- Slot: `market-card-back-l1`
- Style: `crystal-anime`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l1/crystal-anime/b/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create an alternate lowest-tier Crystal Anime market card back, simple and restrained, coherent with richer L2/L3 siblings.
Scene/backdrop: smoky crystal card back, plain glass border, subtle prismatic material hints without symbols or labels.
Style/medium: premium anime game card back, symmetrical, low ornament.
Composition/framing: vertical card back, shared set silhouette and frame language, open calm center, fewer facets and weaker glow than higher tiers.
Lighting/mood: dark crystal, soft edge highlights, readable after downsampling to 150x200.
Constraints: React renders all market deck labels, level text, counts, and UI states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI elements, baked gems, busy center.
```

### crystal-anime-market-card-back-l2-a

- Slot: `market-card-back-l2`
- Style: `crystal-anime`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l2/crystal-anime/a/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier Crystal Anime market card back. It must match the L1/L3 set while showing more ornament than L1 and less than L3.
Scene/backdrop: dark gemstone card back, medium prismatic trim, translucent crystal frame.
Style/medium: anime gemstone vertical card-back illustration, symmetrical and polished.
Composition/framing: shared card-back silhouette and frame language; readable center; moderate facet density and glow. No text or numeric level indicators.
Lighting/mood: controlled cyan-violet prestige, not overbright.
Constraints: React renders all market labels, counts, levels, and overlays. Must remain legible at 150x200 display size.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, controls, noisy center.
```

### crystal-anime-market-card-back-l2-b

- Slot: `market-card-back-l2`
- Style: `crystal-anime`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l2/crystal-anime/b/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create an alternate mid-tier Crystal Anime market card back, visibly medium prestige within the L1/L2/L3 set.
Scene/backdrop: smoky translucent crystal, medium frame facets, refined prismatic border.
Style/medium: anime crystal card-back art, symmetrical and readable.
Composition/framing: same set silhouette as L1/L3; moderate border detail, calm center, no textual tier indicator.
Lighting/mood: restrained violet-cyan glow, low glare.
Constraints: React renders all labels, counts, levels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, over-busy center.
```

### crystal-anime-market-card-back-l3-a

- Slot: `market-card-back-l3`
- Style: `crystal-anime`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l3/crystal-anime/a/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier Crystal Anime market card back. It must match the L1/L2 set while looking most luxurious.
Scene/backdrop: deep jewel card back, rich crystal facets, prismatic glass, high-tier indigo and violet accents.
Style/medium: premium anime card-back illustration, ornate but readable.
Composition/framing: shared card-back silhouette and frame language; strongest ornament at border and corners, readable center, no text or level marks. Tier progression comes from richer facets, glow strength, and jewel density.
Lighting/mood: controlled indigo-violet prestige glow, no white wash.
Constraints: React renders labels, counts, level text, and overlays. Must remain readable at 150x200 display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, controls, illegible clutter.
```

### crystal-anime-market-card-back-l3-b

- Slot: `market-card-back-l3`
- Style: `crystal-anime`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l3/crystal-anime/b/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create an alternate highest-tier Crystal Anime market card back, most premium in the L1/L2/L3 set.
Scene/backdrop: smoky dark crystal, rich violet-indigo facets, dense prismatic border, jewel-corner accents.
Style/medium: ornate anime card-back art, symmetrical and polished.
Composition/framing: full vertical card back, same set silhouette, highest trim density and material richness, calm center, no textual tier indicator.
Lighting/mood: premium controlled crystal glow, readable after downsampling.
Constraints: React renders all labels, counts, levels, and UI states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, excessive clutter.
```

### crystal-anime-royal-card-back-a

- Slot: `royal-card-back`
- Style: `crystal-anime`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/royal-card-back/crystal-anime/a/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create a Crystal Anime sovereign card back for RoyalCourt previews, more prestigious than market backs.
Scene/backdrop: dark gemstone sovereignty, prismatic crystal crown-like material language, rich jewel accents without text.
Style/medium: premium anime royal card-back illustration, ornate symmetrical frame.
Composition/framing: full vertical prestige card back with powerful royal identity, ornate frame, readable calm center.
Lighting/mood: deep jewel prestige, controlled glow, not washed out.
Constraints: React renders all RoyalCourt labels, card data, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, level marks, baked gems, controls, illegible detail.
```

### crystal-anime-royal-card-back-b

- Slot: `royal-card-back`
- Style: `crystal-anime`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/royal-card-back/crystal-anime/b/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create an alternate Crystal Anime royal card back with clear sovereign identity and stronger prestige than market backs.
Scene/backdrop: smoky jewel glass, violet-indigo crystal frame, ceremonial prismatic material language.
Style/medium: premium anime royal card back, symmetrical, luminous but readable.
Composition/framing: full vertical card back, ornate crystal frame and calm center, no text or level marks.
Lighting/mood: controlled crystal prestige glow, readable at 150x200 display.
Constraints: React renders all UI labels, card details, counts, and overlay states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, baked gems, controls, high-noise center.
```

### dark-arcane-shell-background-a

- Slot: `shell-background`
- Style: `dark-arcane`
- Variant: `a`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/dark-arcane/a/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Dark Arcane full-board table surface for GemDuel. This is the only large shell background behind the centered gameplay stage.
Scene/backdrop: dark magical card table, obsidian stone, dark brass, restrained non-linguistic geometry around perimeter only.
Style/medium: premium fantasy game UI background, arcane but practical.
Composition/framing: 16:9 full-board table surface with subdued low-noise center; stronger atmosphere may sit near edges and corners. No separate playmat or central panel.
Lighting/mood: deep shadow, muted violet and ember edge light, no central haze.
Constraints: React renders all gameplay UI, cards, labels, counts, gems, buttons, hover rings, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, UI labels, card slots, controls, baked gems, busy center, separate playmat rectangle.
```

### dark-arcane-shell-background-b

- Slot: `shell-background`
- Style: `dark-arcane`
- Variant: `b`
- Target: `3840x2160`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/dark-arcane/b/shell-background.png`

```text
Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create an alternate Dark Arcane full-board surface with cleaner dark tabletop materials and a quiet center.
Scene/backdrop: charcoal stone table, dark brass edge rails, subtle magical aura outside the central gameplay area.
Style/medium: restrained arcane board-game UI background, polished and readable.
Composition/framing: full 16:9 tabletop surface; center stays low-contrast for the game stage; abstract non-text geometry only near perimeter.
Lighting/mood: quiet dark ambience, subtle rim glow, no central fog.
Constraints: React renders all gameplay pieces, labels, buttons, counts, cards, gems, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, UI labels, card slots, controls, baked gems, playmat rectangle, excessive glow.
```

### dark-arcane-topbar-a

- Slot: `topbar`
- Style: `dark-arcane`
- Variant: `a`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/topbar/dark-arcane/a/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Dark Arcane panoramic header strip for the 120px logical TopBar.
Scene/backdrop: obsidian header rail, dark brass trim, subtle abstract non-linguistic geometry at border only.
Style/medium: premium fantasy game UI header, arcane but readable.
Composition/framing: ultra-wide strip with quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Detail belongs at edges, corners, and thin borders.
Lighting/mood: dim violet and ember edge glow, no central haze.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, UI labels, counters, central object, bright overlay zones.
```

### dark-arcane-topbar-b

- Slot: `topbar`
- Style: `dark-arcane`
- Variant: `b`
- Target: `3840x360`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/topbar/dark-arcane/b/topbar.png`

```text
Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create an alternate Dark Arcane TopBar strip with cleaner dark stone and strong readable overlay lanes.
Scene/backdrop: charcoal stone rail, dark brass separators, subtle magical edge aura.
Style/medium: restrained arcane UI strip, practical and polished.
Composition/framing: ultra-wide header; keep 25%, 50%, and 75% zones quiet for React overlays; abstract geometry only in border rails and far corners.
Lighting/mood: subtle violet and ember rim glow, no overbright center.
Constraints: React renders all labels, score, crown, turn state, buttons, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, UI labels, counters, central emblem, busy patterns.
```

### dark-arcane-player-zone-a

- Slot: `player-zone`
- Style: `dark-arcane`
- Variant: `a`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/player-zone/dark-arcane/a/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Dark Arcane ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: obsidian player rail, charcoal stone, dark brass trim, restrained magical edge aura.
Style/medium: premium fantasy game UI environment rail, dark and practical.
Composition/framing: ultra-wide band with quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration only near extreme edges, corners, and thin top/bottom borders.
Lighting/mood: deep shadow, subtle violet and ember rim glow, readable center.
Constraints: React renders all cards, labels, counters, inventory gems, badges, controls, rings, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels.
```

### dark-arcane-player-zone-b

- Slot: `player-zone`
- Style: `dark-arcane`
- Variant: `b`
- Target: `3840x520`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/player-zone/dark-arcane/b/player-zone.png`

```text
Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create an alternate Dark Arcane player rail with cleaner dark tabletop material and very calm functional lanes.
Scene/backdrop: charcoal stone rail, dark brass separators, subtle magical aura outside gameplay lanes.
Style/medium: restrained arcane UI rail, polished, low visual noise.
Composition/framing: ultra-wide band compatible with left and right anchoring; calm center areas for React-rendered gameplay items; edge/corner detail only.
Lighting/mood: quiet dark ambience, subtle rim glow, strong readability.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, baked card frames, card slots, deck silhouettes, controls, labels, placeholder rectangles, excessive glow.
```

### dark-arcane-gem-panel-a

- Slot: `gem-panel`
- Style: `dark-arcane`
- Variant: `a`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/gem-panel/dark-arcane/a/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Dark Arcane square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: dark magical table panel, obsidian stone, muted metal dividers, very subtle non-linguistic geometric accents only on the outer frame.
Style/medium: premium fantasy UI panel, arcane but practical, low-noise center.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only.
Lighting/mood: deep shadow, restrained violet and ember edge light, no central haze.
Constraints: React renders all gems, labels, counts, levels, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, baked gems, symbols inside cells, click markers, busy center, oversized border.
```

### dark-arcane-gem-panel-b

- Slot: `gem-panel`
- Style: `dark-arcane`
- Variant: `b`
- Target: `1254x1254`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/gem-panel/dark-arcane/b/gem-panel.png`

```text
Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create an alternate Dark Arcane square 5x5 gem board panel with cleaner dark tabletop and exact cell geometry.
Scene/backdrop: charcoal stone, dark brass separators, subtle magical aura outside the 5x5 grid, abstract non-text geometry on the rim only.
Style/medium: restrained arcane board-game UI asset, polished but not ornate.
Composition/framing: orthographic square board. Align dividers to x=100,305,515,726,938,1141 and y=104,308,512,717,917,1132. Keep the 5x5 cells empty and readable.
Lighting/mood: quiet dark ambience, subtle rim glow, strong readability.
Constraints: React renders all gems, labels, counts, hover rings, click markers, and selection states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, baked gems, symbols in cells, selection markers, excessive glow, large dead edges.
```

### dark-arcane-market-card-back-l1-a

- Slot: `market-card-back-l1`
- Style: `dark-arcane`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l1/dark-arcane/a/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier Dark Arcane market card back. It must belong to the same L1/L2/L3 set but look simpler than L2 and L3.
Scene/backdrop: dark obsidian card back, simple brass border, subtle non-linguistic geometry as material texture only.
Style/medium: premium fantasy card-back illustration, clean symmetrical frame.
Composition/framing: full vertical card back with shared set silhouette, readable blank center, modest ornament density. No text or level marks; tier is communicated only through simpler material richness.
Lighting/mood: controlled violet and ember edge glow, readable after downsampling to 150x200.
Constraints: React renders market deck labels, levels, counts, and UI overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, level marks, UI labels, baked gems, controls, noisy center.
```

### dark-arcane-market-card-back-l1-b

- Slot: `market-card-back-l1`
- Style: `dark-arcane`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l1/dark-arcane/b/market-card-back-l1.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create an alternate lowest-tier Dark Arcane market card back, simple and restrained, coherent with richer L2/L3 siblings.
Scene/backdrop: charcoal stone card back, plain dark brass border, subtle magical material hints without symbols or labels.
Style/medium: premium fantasy game card back, symmetrical, low ornament.
Composition/framing: vertical card back, shared set silhouette and frame language, open calm center, fewer details and weaker glow than higher tiers.
Lighting/mood: dark arcane, soft edge highlights, readable after downsampling.
Constraints: React renders all market deck labels, level text, counts, and UI states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, level marks, UI elements, baked gems, busy center.
```

### dark-arcane-market-card-back-l2-a

- Slot: `market-card-back-l2`
- Style: `dark-arcane`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l2/dark-arcane/a/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier Dark Arcane market card back. It must match the L1/L3 set while showing more ornament than L1 and less than L3.
Scene/backdrop: obsidian card back, medium dark brass trim, restrained non-linguistic geometric material pattern.
Style/medium: premium fantasy vertical card-back illustration, symmetrical and polished.
Composition/framing: shared card-back silhouette and frame language; readable center; moderate ornament density and glow. No text or numeric level indicators.
Lighting/mood: controlled violet-ember prestige, not overbright.
Constraints: React renders all market labels, counts, levels, and overlays. Must remain legible at 150x200 display size.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, level marks, UI labels, baked gems, controls, noisy center.
```

### dark-arcane-market-card-back-l2-b

- Slot: `market-card-back-l2`
- Style: `dark-arcane`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l2/dark-arcane/b/market-card-back-l2.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create an alternate mid-tier Dark Arcane market card back, visibly medium prestige within the L1/L2/L3 set.
Scene/backdrop: charcoal stone and dark brass card back, medium frame detail, subtle magical aura without writing.
Style/medium: restrained arcane card-back art, symmetrical and readable.
Composition/framing: same set silhouette as L1/L3; moderate border detail, calm center, no textual tier indicator.
Lighting/mood: subdued violet and ember rim glow, low glare.
Constraints: React renders all labels, counts, levels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, level marks, UI labels, baked gems, over-busy center.
```

### dark-arcane-market-card-back-l3-a

- Slot: `market-card-back-l3`
- Style: `dark-arcane`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l3/dark-arcane/a/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier Dark Arcane market card back. It must match the L1/L2 set while looking most luxurious.
Scene/backdrop: sovereign obsidian card back, rich dark brass filigree, jewel-like indigo/violet accents, arcane material depth without writing.
Style/medium: premium fantasy card-back illustration, ornate but readable.
Composition/framing: shared card-back silhouette and frame language; strongest ornament at border and corners, readable center, no text or level marks. Tier progression comes from richer trim, glow strength, and accent material.
Lighting/mood: deep violet and ember prestige glow, no white wash.
Constraints: React renders labels, counts, level text, and overlays. Must remain readable at 150x200 display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, level marks, UI labels, baked gems, controls, illegible clutter.
```

### dark-arcane-market-card-back-l3-b

- Slot: `market-card-back-l3`
- Style: `dark-arcane`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l3/dark-arcane/b/market-card-back-l3.png`

```text
Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create an alternate highest-tier Dark Arcane market card back, most premium in the L1/L2/L3 set.
Scene/backdrop: dark obsidian, dense dark brass border, violet-indigo jewel accents, subtle magical edge glow.
Style/medium: ornate arcane card-back art, symmetrical and polished.
Composition/framing: full vertical card back, same set silhouette, highest trim density and material richness, calm center, no textual tier indicator.
Lighting/mood: premium controlled dark glow, readable after downsampling.
Constraints: React renders all labels, counts, levels, and UI states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, level marks, UI labels, baked gems, excessive clutter.
```

### dark-arcane-royal-card-back-a

- Slot: `royal-card-back`
- Style: `dark-arcane`
- Variant: `a`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/royal-card-back/dark-arcane/a/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create a Dark Arcane sovereign card back for RoyalCourt previews, more prestigious than market backs.
Scene/backdrop: dark obsidian sovereignty, dark brass ceremonial frame, jewel-like violet/ember accents, non-linguistic material geometry.
Style/medium: premium fantasy royal card-back illustration, ornate symmetrical frame.
Composition/framing: full vertical prestige card back with powerful sovereign identity, ornate frame, readable calm center.
Lighting/mood: deep arcane prestige, controlled glow, not washed out.
Constraints: React renders all RoyalCourt labels, card data, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, UI labels, level marks, baked gems, controls, illegible detail.
```

### dark-arcane-royal-card-back-b

- Slot: `royal-card-back`
- Style: `dark-arcane`
- Variant: `b`
- Target: `1086x1448`
- Planned archive: `assets/art-library/surface-autonomous-candidates/2026-04-27/royal-card-back/dark-arcane/b/royal-card-back.png`

```text
Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create an alternate Dark Arcane royal card back with clear sovereign identity and stronger prestige than market backs.
Scene/backdrop: charcoal obsidian, ceremonial dark brass frame, controlled violet-indigo jewel light.
Style/medium: premium arcane royal card back, symmetrical, powerful but readable.
Composition/framing: full vertical card back, ornate frame and calm center, no text or level marks.
Lighting/mood: controlled dark prestige glow, readable at 150x200 display.
Constraints: React renders all UI labels, card details, counts, and overlay states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, UI labels, baked gems, controls, high-noise center.
```
