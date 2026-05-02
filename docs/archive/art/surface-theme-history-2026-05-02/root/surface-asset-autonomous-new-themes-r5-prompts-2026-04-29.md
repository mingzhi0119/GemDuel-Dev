# Surface Asset Autonomous New Theme R5 Prompt Manifest - 2026-04-29

This manifest is the required pre-generation prompt contract for a fifth full Image Gen candidate-library pass. It follows `C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md` and keeps runtime resources untouched.

## Inspected Source Constraints

- Runtime Surface Styles are `crystal-anime`, `royal-luxury`, `dark-arcane`, `clean-boardgame`, and `pearl-opaline`; this R5 pass creates candidate-only new Theme groups and does not add runtime enums.
- Runtime surface art is loaded from `apps/desktop/public/assets/surfaces/anime-themes/<style>/dark/`; this pass does not promote or overwrite runtime assets.
- PlayerZone primary candidate contract is side-specific: `player-zone-p1.png` and `player-zone-p2.png`, both `1920x520`; `player-zone.png` remains legacy fallback only.
- Featured market and royal card backs use `FEATURED_CARD_SAMPLE_SIZE` `1086x1448` and are downsampled by the app to `FEATURED_CARD_SIZE` `150x200`.
- Gem panels use a `1254x1254` substrate with future per-surface grid calibration; generated panels must have straight 5x5 empty wells.
- React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances.

## Output Contract

- Batch/archive root: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/`.
- Prompt manifest: `docs/art/surface-asset-autonomous-new-themes-r5-prompts-2026-04-29.md`.
- Scoring report: `docs/art/surface-asset-autonomous-new-themes-r5-library-2026-04-29.md`.
- Visual Lab manifest: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/contact-sheets/preview-manifest.json`.
- Candidate count target: `72` PNGs = `4 themes x 9 slots x 2 variants`.
- Workers must use the `imagegen` skill and built-in `image_gen`; workers must not edit repo files or copy files into the workspace.

## R5 Candidate Themes

- `cobalt-embercourt` (Cobalt Embercourt): cool cobalt court surface with ember accents and restrained high-contrast UI readability.
- `moonstone-verdigris` (Moonstone Verdigris): refined moonlit patina theme with pale material kept readable and not over-bright.
- `ruby-tidevault` (Ruby Tidevault): luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones.
- `silver-pineforge` (Silver Pineforge): cool forged woodland material language with disciplined silver ornament and dark readable fields.

## Prompt Records

| Prompt ID                                                    | Batch                                         | Date         | Slot                  | Theme                 | Variant |      Target | Planned Archive Path                                                                                                                          |
| ------------------------------------------------------------ | --------------------------------------------- | ------------ | --------------------- | --------------------- | ------- | ----------: | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `SA-R5-2026-04-29-cobalt-embercourt-shell-background-b`      | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `shell-background`    | `cobalt-embercourt`   | `B`     | `3840x2160` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/shell-background/cobalt-embercourt/shell-background-b.png`         |
| `SA-R5-2026-04-29-cobalt-embercourt-topbar-b`                | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `topbar`              | `cobalt-embercourt`   | `B`     |  `3840x360` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/topbar/cobalt-embercourt/topbar-b.png`                             |
| `SA-R5-2026-04-29-cobalt-embercourt-player-zone-p1-b`        | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `player-zone-p1`      | `cobalt-embercourt`   | `B`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p1/cobalt-embercourt/player-zone-p1-b.png`             |
| `SA-R5-2026-04-29-cobalt-embercourt-player-zone-p2-b`        | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `player-zone-p2`      | `cobalt-embercourt`   | `B`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p2/cobalt-embercourt/player-zone-p2-b.png`             |
| `SA-R5-2026-04-29-cobalt-embercourt-gem-panel-b`             | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `gem-panel`           | `cobalt-embercourt`   | `B`     | `1254x1254` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/gem-panel/cobalt-embercourt/gem-panel-b.png`                       |
| `SA-R5-2026-04-29-cobalt-embercourt-market-card-back-l1-b`   | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `market-card-back-l1` | `cobalt-embercourt`   | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l1/cobalt-embercourt/market-card-back-l1-b.png`   |
| `SA-R5-2026-04-29-cobalt-embercourt-market-card-back-l2-b`   | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `market-card-back-l2` | `cobalt-embercourt`   | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l2/cobalt-embercourt/market-card-back-l2-b.png`   |
| `SA-R5-2026-04-29-cobalt-embercourt-market-card-back-l3-b`   | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `market-card-back-l3` | `cobalt-embercourt`   | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l3/cobalt-embercourt/market-card-back-l3-b.png`   |
| `SA-R5-2026-04-29-cobalt-embercourt-royal-card-back-b`       | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `royal-card-back`     | `cobalt-embercourt`   | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/royal-card-back/cobalt-embercourt/royal-card-back-b.png`           |
| `SA-R5-2026-04-29-moonstone-verdigris-shell-background-a`    | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `shell-background`    | `moonstone-verdigris` | `A`     | `3840x2160` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/shell-background/moonstone-verdigris/shell-background-a.png`       |
| `SA-R5-2026-04-29-moonstone-verdigris-topbar-a`              | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `topbar`              | `moonstone-verdigris` | `A`     |  `3840x360` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/topbar/moonstone-verdigris/topbar-a.png`                           |
| `SA-R5-2026-04-29-moonstone-verdigris-player-zone-p1-a`      | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `player-zone-p1`      | `moonstone-verdigris` | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p1/moonstone-verdigris/player-zone-p1-a.png`           |
| `SA-R5-2026-04-29-moonstone-verdigris-player-zone-p2-a`      | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `player-zone-p2`      | `moonstone-verdigris` | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p2/moonstone-verdigris/player-zone-p2-a.png`           |
| `SA-R5-2026-04-29-moonstone-verdigris-gem-panel-a`           | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `gem-panel`           | `moonstone-verdigris` | `A`     | `1254x1254` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/gem-panel/moonstone-verdigris/gem-panel-a.png`                     |
| `SA-R5-2026-04-29-moonstone-verdigris-market-card-back-l1-a` | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `market-card-back-l1` | `moonstone-verdigris` | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l1/moonstone-verdigris/market-card-back-l1-a.png` |
| `SA-R5-2026-04-29-moonstone-verdigris-market-card-back-l2-a` | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `market-card-back-l2` | `moonstone-verdigris` | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l2/moonstone-verdigris/market-card-back-l2-a.png` |
| `SA-R5-2026-04-29-moonstone-verdigris-market-card-back-l3-a` | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `market-card-back-l3` | `moonstone-verdigris` | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l3/moonstone-verdigris/market-card-back-l3-a.png` |
| `SA-R5-2026-04-29-moonstone-verdigris-royal-card-back-a`     | `surface-autonomous-new-themes-r5-candidates` | `2026-04-29` | `royal-card-back`     | `moonstone-verdigris` | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/royal-card-back/moonstone-verdigris/royal-card-back-a.png`         |

## Full Prompts

### SA-R5-2026-04-29-cobalt-embercourt-shell-background-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/shell-background/cobalt-embercourt/shell-background-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-shell-background-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/shell-background/cobalt-embercourt/shell-background-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-topbar-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/topbar/cobalt-embercourt/topbar-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-topbar-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/topbar/cobalt-embercourt/topbar-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-player-zone-p1-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p1/cobalt-embercourt/player-zone-p1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-player-zone-p1-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p1/cobalt-embercourt/player-zone-p1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-player-zone-p2-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p2/cobalt-embercourt/player-zone-p2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-player-zone-p2-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p2/cobalt-embercourt/player-zone-p2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-gem-panel-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/gem-panel/cobalt-embercourt/gem-panel-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-gem-panel-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/gem-panel/cobalt-embercourt/gem-panel-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-market-card-back-l1-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l1/cobalt-embercourt/market-card-back-l1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-market-card-back-l1-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l1/cobalt-embercourt/market-card-back-l1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-market-card-back-l2-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l2/cobalt-embercourt/market-card-back-l2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-market-card-back-l2-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l2/cobalt-embercourt/market-card-back-l2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-market-card-back-l3-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l3/cobalt-embercourt/market-card-back-l3-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-market-card-back-l3-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l3/cobalt-embercourt/market-card-back-l3-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-royal-card-back-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/royal-card-back/cobalt-embercourt/royal-card-back-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-cobalt-embercourt-royal-card-back-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `cobalt-embercourt` (Cobalt Embercourt)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/royal-card-back/cobalt-embercourt/royal-card-back-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `cobalt-embercourt` (Cobalt Embercourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep cobalt ceramic, muted ember copper, black glass court inlay, controlled warm glow, precise enamel ornament without script or symbols. Style identity: cool cobalt court surface with ember accents and restrained high-contrast UI readability. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-shell-background-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/shell-background/moonstone-verdigris/shell-background-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-shell-background-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/shell-background/moonstone-verdigris/shell-background-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-topbar-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/topbar/moonstone-verdigris/topbar-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-topbar-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/topbar/moonstone-verdigris/topbar-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-player-zone-p1-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p1/moonstone-verdigris/player-zone-p1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-player-zone-p1-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p1/moonstone-verdigris/player-zone-p1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-player-zone-p2-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p2/moonstone-verdigris/player-zone-p2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-player-zone-p2-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p2/moonstone-verdigris/player-zone-p2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-gem-panel-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/gem-panel/moonstone-verdigris/gem-panel-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-gem-panel-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/gem-panel/moonstone-verdigris/gem-panel-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-market-card-back-l1-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l1/moonstone-verdigris/market-card-back-l1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-market-card-back-l1-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l1/moonstone-verdigris/market-card-back-l1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-market-card-back-l2-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l2/moonstone-verdigris/market-card-back-l2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-market-card-back-l2-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l2/moonstone-verdigris/market-card-back-l2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-market-card-back-l3-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l3/moonstone-verdigris/market-card-back-l3-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-market-card-back-l3-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l3/moonstone-verdigris/market-card-back-l3-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-royal-card-back-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/royal-card-back/moonstone-verdigris/royal-card-back-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-moonstone-verdigris-royal-card-back-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `moonstone-verdigris` (Moonstone Verdigris)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/royal-card-back/moonstone-verdigris/royal-card-back-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `moonstone-verdigris` (Moonstone Verdigris). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: milky moonstone, oxidized verdigris brass, pale sea-green patina, lunar polished stone, abstract inlay without maps, icons, or letters. Style identity: refined moonlit patina theme with pale material kept readable and not over-bright. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-shell-background-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/shell-background/ruby-tidevault/shell-background-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-shell-background-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/shell-background/ruby-tidevault/shell-background-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-topbar-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/topbar/ruby-tidevault/topbar-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-topbar-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/topbar/ruby-tidevault/topbar-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-player-zone-p1-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p1/ruby-tidevault/player-zone-p1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-player-zone-p1-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p1/ruby-tidevault/player-zone-p1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-player-zone-p2-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p2/ruby-tidevault/player-zone-p2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-player-zone-p2-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p2/ruby-tidevault/player-zone-p2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-gem-panel-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/gem-panel/ruby-tidevault/gem-panel-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-gem-panel-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/gem-panel/ruby-tidevault/gem-panel-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-market-card-back-l1-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l1/ruby-tidevault/market-card-back-l1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-market-card-back-l1-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l1/ruby-tidevault/market-card-back-l1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-market-card-back-l2-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l2/ruby-tidevault/market-card-back-l2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-market-card-back-l2-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l2/ruby-tidevault/market-card-back-l2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-market-card-back-l3-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l3/ruby-tidevault/market-card-back-l3-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-market-card-back-l3-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l3/ruby-tidevault/market-card-back-l3-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-royal-card-back-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/royal-card-back/ruby-tidevault/royal-card-back-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-ruby-tidevault-royal-card-back-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `ruby-tidevault` (Ruby Tidevault)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/royal-card-back/ruby-tidevault/royal-card-back-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `ruby-tidevault` (Ruby Tidevault). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: dark ruby lacquer, tide-worn bronze, deep ocean slate, jewel vault geometry, wave-polished trim without readable marks or emblems. Style identity: luxury sea-vault tabletop with dark red accents, strong material contrast, and quiet overlay zones. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-shell-background-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/shell-background/silver-pineforge/shell-background-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-shell-background-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/shell-background/silver-pineforge/shell-background-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-topbar-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/topbar/silver-pineforge/topbar-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-topbar-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/topbar/silver-pineforge/topbar-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-player-zone-p1-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p1/silver-pineforge/player-zone-p1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-player-zone-p1-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p1/silver-pineforge/player-zone-p1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-player-zone-p2-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p2/silver-pineforge/player-zone-p2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-player-zone-p2-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/player-zone-p2/silver-pineforge/player-zone-p2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-gem-panel-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/gem-panel/silver-pineforge/gem-panel-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-gem-panel-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/gem-panel/silver-pineforge/gem-panel-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-market-card-back-l1-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l1/silver-pineforge/market-card-back-l1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-market-card-back-l1-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l1/silver-pineforge/market-card-back-l1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-market-card-back-l2-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l2/silver-pineforge/market-card-back-l2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-market-card-back-l2-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l2/silver-pineforge/market-card-back-l2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-market-card-back-l3-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l3/silver-pineforge/market-card-back-l3-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-market-card-back-l3-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/market-card-back-l3/silver-pineforge/market-card-back-l3-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-royal-card-back-a

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/royal-card-back/silver-pineforge/royal-card-back-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R5-2026-04-29-silver-pineforge-royal-card-back-b

- Batch: `surface-autonomous-new-themes-r5-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `silver-pineforge` (Silver Pineforge)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r5-candidates/2026-04-29/royal-card-back/silver-pineforge/royal-card-back-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `silver-pineforge` (Silver Pineforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed silver, pine-green enamel, cold forged iron, subtle needle-like botanical geometry, smoky quartz accents without glyphs or logos. Style identity: cool forged woodland material language with disciplined silver ornament and dark readable fields. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```
