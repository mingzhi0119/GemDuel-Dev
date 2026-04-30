# Surface Asset Autonomous New Theme R3 Prompt Manifest - 2026-04-29

This manifest is the required pre-generation prompt contract for a third full Image Gen candidate-library pass. It follows `C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md` and keeps runtime resources untouched.

## Inspected Source Constraints

- Runtime Surface Styles are `crystal-anime`, `royal-luxury`, `dark-arcane`, `clean-boardgame`, and `pearl-opaline`; this R3 pass creates candidate-only new Theme groups and does not add runtime enums.
- Runtime surface art is loaded from `apps/desktop/public/assets/surfaces/anime-themes/<style>/dark/`; this pass does not promote or overwrite runtime assets.
- PlayerZone primary candidate contract is side-specific: `player-zone-p1.png` and `player-zone-p2.png`, both `1920x520`; `player-zone.png` remains legacy fallback only.
- Featured market and royal card backs use `FEATURED_CARD_SAMPLE_SIZE` `1086x1448` and are downsampled by the app to `FEATURED_CARD_SIZE` `150x200`.
- Gem panels use a `1254x1254` substrate with future per-surface grid calibration; generated panels must have straight 5x5 empty wells.
- React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances.

## Output Contract

- Batch/archive root: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/`.
- Prompt manifest: `docs/art/surface-asset-autonomous-new-themes-r3-prompts-2026-04-29.md`.
- Scoring report: `docs/art/surface-asset-autonomous-new-themes-r3-library-2026-04-29.md`.
- Visual Lab manifest: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/contact-sheets/preview-manifest.json`.
- Candidate count target: `72` PNGs = `4 themes x 9 slots x 2 variants`.
- Workers must use the `imagegen` skill and built-in `image_gen`; workers must not edit repo files or copy files into the workspace.

## R3 Candidate Themes

- `sapphire-clockcourt` (Sapphire Clockcourt): elegant mechanical court surface with cool sapphire highlights and clean readable UI zones.
- `coral-moonforge` (Coral Moonforge): warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast.
- `ivory-rainharbor` (Ivory Rainharbor): light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters.
- `obsidian-goldleaf` (Obsidian Goldleaf): high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields.

## Prompt Records

| Prompt ID                                                 | Batch                                         | Date         | Slot                  | Theme              | Variant |      Target | Planned Archive Path                                                                                                                       |
| --------------------------------------------------------- | --------------------------------------------- | ------------ | --------------------- | ------------------ | ------- | ----------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `SA-R3-2026-04-29-ivory-rainharbor-shell-background-b`    | `surface-autonomous-new-themes-r3-candidates` | `2026-04-29` | `shell-background`    | `ivory-rainharbor` | `B`     | `3840x2160` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/shell-background/ivory-rainharbor/shell-background-b.png`       |
| `SA-R3-2026-04-29-ivory-rainharbor-topbar-b`              | `surface-autonomous-new-themes-r3-candidates` | `2026-04-29` | `topbar`              | `ivory-rainharbor` | `B`     |  `3840x360` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/topbar/ivory-rainharbor/topbar-b.png`                           |
| `SA-R3-2026-04-29-ivory-rainharbor-player-zone-p1-b`      | `surface-autonomous-new-themes-r3-candidates` | `2026-04-29` | `player-zone-p1`      | `ivory-rainharbor` | `B`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p1/ivory-rainharbor/player-zone-p1-b.png`           |
| `SA-R3-2026-04-29-ivory-rainharbor-player-zone-p2-b`      | `surface-autonomous-new-themes-r3-candidates` | `2026-04-29` | `player-zone-p2`      | `ivory-rainharbor` | `B`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p2/ivory-rainharbor/player-zone-p2-b.png`           |
| `SA-R3-2026-04-29-ivory-rainharbor-gem-panel-b`           | `surface-autonomous-new-themes-r3-candidates` | `2026-04-29` | `gem-panel`           | `ivory-rainharbor` | `B`     | `1254x1254` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/gem-panel/ivory-rainharbor/gem-panel-b.png`                     |
| `SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l1-b` | `surface-autonomous-new-themes-r3-candidates` | `2026-04-29` | `market-card-back-l1` | `ivory-rainharbor` | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l1/ivory-rainharbor/market-card-back-l1-b.png` |
| `SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l2-b` | `surface-autonomous-new-themes-r3-candidates` | `2026-04-29` | `market-card-back-l2` | `ivory-rainharbor` | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l2/ivory-rainharbor/market-card-back-l2-b.png` |
| `SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l3-b` | `surface-autonomous-new-themes-r3-candidates` | `2026-04-29` | `market-card-back-l3` | `ivory-rainharbor` | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l3/ivory-rainharbor/market-card-back-l3-b.png` |
| `SA-R3-2026-04-29-ivory-rainharbor-royal-card-back-b`     | `surface-autonomous-new-themes-r3-candidates` | `2026-04-29` | `royal-card-back`     | `ivory-rainharbor` | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/royal-card-back/ivory-rainharbor/royal-card-back-b.png`         |

## Full Prompts

### SA-R3-2026-04-29-sapphire-clockcourt-shell-background-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/shell-background/sapphire-clockcourt/shell-background-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-shell-background-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/shell-background/sapphire-clockcourt/shell-background-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-topbar-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/topbar/sapphire-clockcourt/topbar-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-topbar-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/topbar/sapphire-clockcourt/topbar-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-player-zone-p1-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p1/sapphire-clockcourt/player-zone-p1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-player-zone-p1-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p1/sapphire-clockcourt/player-zone-p1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-player-zone-p2-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p2/sapphire-clockcourt/player-zone-p2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-player-zone-p2-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p2/sapphire-clockcourt/player-zone-p2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-gem-panel-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/gem-panel/sapphire-clockcourt/gem-panel-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-gem-panel-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/gem-panel/sapphire-clockcourt/gem-panel-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-market-card-back-l1-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l1/sapphire-clockcourt/market-card-back-l1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-market-card-back-l1-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l1/sapphire-clockcourt/market-card-back-l1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-market-card-back-l2-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l2/sapphire-clockcourt/market-card-back-l2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-market-card-back-l2-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l2/sapphire-clockcourt/market-card-back-l2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-market-card-back-l3-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l3/sapphire-clockcourt/market-card-back-l3-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-market-card-back-l3-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l3/sapphire-clockcourt/market-card-back-l3-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-royal-card-back-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/royal-card-back/sapphire-clockcourt/royal-card-back-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-sapphire-clockcourt-royal-card-back-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `sapphire-clockcourt` (Sapphire Clockcourt)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/royal-card-back/sapphire-clockcourt/royal-card-back-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `sapphire-clockcourt` (Sapphire Clockcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: precise sapphire enamel, brushed silver, clockwork court geometry, quiet midnight glass, fine gear-like ornament without numerals or glyphs. Style identity: elegant mechanical court surface with cool sapphire highlights and clean readable UI zones. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-shell-background-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/shell-background/coral-moonforge/shell-background-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-shell-background-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/shell-background/coral-moonforge/shell-background-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-topbar-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/topbar/coral-moonforge/topbar-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-topbar-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/topbar/coral-moonforge/topbar-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-player-zone-p1-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p1/coral-moonforge/player-zone-p1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-player-zone-p1-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p1/coral-moonforge/player-zone-p1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-player-zone-p2-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p2/coral-moonforge/player-zone-p2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-player-zone-p2-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p2/coral-moonforge/player-zone-p2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-gem-panel-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/gem-panel/coral-moonforge/gem-panel-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-gem-panel-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/gem-panel/coral-moonforge/gem-panel-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-market-card-back-l1-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l1/coral-moonforge/market-card-back-l1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-market-card-back-l1-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l1/coral-moonforge/market-card-back-l1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-market-card-back-l2-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l2/coral-moonforge/market-card-back-l2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-market-card-back-l2-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l2/coral-moonforge/market-card-back-l2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-market-card-back-l3-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l3/coral-moonforge/market-card-back-l3-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-market-card-back-l3-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l3/coral-moonforge/market-card-back-l3-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-royal-card-back-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/royal-card-back/coral-moonforge/royal-card-back-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-coral-moonforge-royal-card-back-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `coral-moonforge` (Coral Moonforge)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/royal-card-back/coral-moonforge/royal-card-back-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `coral-moonforge` (Coral Moonforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: warm coral metal, moonlit black steel, soft forge glow, pearl ash, hammered lunar ornament without symbols or text. Style identity: warm fantasy forge surface balanced by moonlit cool shadows and strong foreground contrast. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-shell-background-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/shell-background/ivory-rainharbor/shell-background-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-shell-background-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/shell-background/ivory-rainharbor/shell-background-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-topbar-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/topbar/ivory-rainharbor/topbar-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-topbar-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/topbar/ivory-rainharbor/topbar-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-player-zone-p1-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p1/ivory-rainharbor/player-zone-p1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-player-zone-p1-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p1/ivory-rainharbor/player-zone-p1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-player-zone-p2-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p2/ivory-rainharbor/player-zone-p2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-player-zone-p2-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p2/ivory-rainharbor/player-zone-p2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-gem-panel-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/gem-panel/ivory-rainharbor/gem-panel-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-gem-panel-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/gem-panel/ivory-rainharbor/gem-panel-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l1-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l1/ivory-rainharbor/market-card-back-l1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l1-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l1/ivory-rainharbor/market-card-back-l1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l2-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l2/ivory-rainharbor/market-card-back-l2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l2-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l2/ivory-rainharbor/market-card-back-l2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l3-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l3/ivory-rainharbor/market-card-back-l3-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-market-card-back-l3-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l3/ivory-rainharbor/market-card-back-l3-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-royal-card-back-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/royal-card-back/ivory-rainharbor/royal-card-back-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-ivory-rainharbor-royal-card-back-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `ivory-rainharbor` (Ivory Rainharbor)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/royal-card-back/ivory-rainharbor/royal-card-back-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `ivory-rainharbor` (Ivory Rainharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: ivory lacquer, rain-polished stone, sea-glass teal, misted brass, harbor canopy geometry without maps, letters, or emblems. Style identity: light refined harbor-table material, restrained so pale surfaces do not overpower cards and counters. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-shell-background-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/shell-background/obsidian-goldleaf/shell-background-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-shell-background-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/shell-background/obsidian-goldleaf/shell-background-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-topbar-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/topbar/obsidian-goldleaf/topbar-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-topbar-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/topbar/obsidian-goldleaf/topbar-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-player-zone-p1-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p1/obsidian-goldleaf/player-zone-p1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-player-zone-p1-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p1/obsidian-goldleaf/player-zone-p1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-player-zone-p2-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p2/obsidian-goldleaf/player-zone-p2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-player-zone-p2-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/player-zone-p2/obsidian-goldleaf/player-zone-p2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-gem-panel-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/gem-panel/obsidian-goldleaf/gem-panel-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-gem-panel-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/gem-panel/obsidian-goldleaf/gem-panel-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-market-card-back-l1-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l1/obsidian-goldleaf/market-card-back-l1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-market-card-back-l1-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l1/obsidian-goldleaf/market-card-back-l1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-market-card-back-l2-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l2/obsidian-goldleaf/market-card-back-l2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-market-card-back-l2-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l2/obsidian-goldleaf/market-card-back-l2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-market-card-back-l3-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l3/obsidian-goldleaf/market-card-back-l3-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-market-card-back-l3-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/market-card-back-l3/obsidian-goldleaf/market-card-back-l3-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-royal-card-back-a

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/royal-card-back/obsidian-goldleaf/royal-card-back-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R3-2026-04-29-obsidian-goldleaf-royal-card-back-b

- Batch: `surface-autonomous-new-themes-r3-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `obsidian-goldleaf` (Obsidian Goldleaf)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r3-candidates/2026-04-29/royal-card-back/obsidian-goldleaf/royal-card-back-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `obsidian-goldleaf` (Obsidian Goldleaf). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep obsidian lacquer, aged gold leaf, emerald undertone, ceremonial inlay, quiet prestige ornament without heraldic text or readable marks. Style identity: high-contrast luxury tabletop with restrained gold ornament and dark readable UI fields. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```
