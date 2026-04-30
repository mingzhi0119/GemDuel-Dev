# Surface Asset Autonomous New Theme R4 Prompt Manifest - 2026-04-29

This manifest is the required pre-generation prompt contract for a fourth full Image Gen candidate-library pass. It follows `C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md` and keeps runtime resources untouched.

## Inspected Source Constraints

- Runtime Surface Styles are `crystal-anime`, `royal-luxury`, `dark-arcane`, `clean-boardgame`, and `pearl-opaline`; this R4 pass creates candidate-only new Theme groups and does not add runtime enums.
- Runtime surface art is loaded from `apps/desktop/public/assets/surfaces/anime-themes/<style>/dark/`; this pass does not promote or overwrite runtime assets.
- PlayerZone primary candidate contract is side-specific: `player-zone-p1.png` and `player-zone-p2.png`, both `1920x520`; `player-zone.png` remains legacy fallback only.
- Featured market and royal card backs use `FEATURED_CARD_SAMPLE_SIZE` `1086x1448` and are downsampled by the app to `FEATURED_CARD_SIZE` `150x200`.
- Gem panels use a `1254x1254` substrate with future per-surface grid calibration; generated panels must have straight 5x5 empty wells.
- React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances.

## Output Contract

- Batch/archive root: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/`.
- Prompt manifest: `docs/art/surface-asset-autonomous-new-themes-r4-prompts-2026-04-29.md`.
- Scoring report: `docs/art/surface-asset-autonomous-new-themes-r4-library-2026-04-29.md`.
- Visual Lab manifest: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/contact-sheets/preview-manifest.json`.
- Candidate count target: `72` PNGs = `4 themes x 9 slots x 2 variants`.
- Workers must use the `imagegen` skill and built-in `image_gen`; workers must not edit repo files or copy files into the workspace.

## R4 Candidate Themes

- `amber-icecourt` (Amber Icecourt): cool royal ice court balanced by warm amber material and readable quiet UI zones.
- `jade-starforge` (Jade Starforge): celestial forge surface with jade contrast, controlled highlights, and strong foreground readability.
- `velvet-sunharbor` (Velvet Sunharbor): warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability.
- `onyx-silvergrove` (Onyx Silvergrove): dark refined grove surface with silver botanical ornament and clear UI overlay zones.

## Prompt Records

| Prompt ID                                                 | Batch                                         | Date         | Slot                  | Theme              | Variant |      Target | Planned Archive Path                                                                                                                       |
| --------------------------------------------------------- | --------------------------------------------- | ------------ | --------------------- | ------------------ | ------- | ----------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `SA-R4-2026-04-29-amber-icecourt-shell-background-a`      | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `shell-background`    | `amber-icecourt`   | `A`     | `3840x2160` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/shell-background/amber-icecourt/shell-background-a.png`         |
| `SA-R4-2026-04-29-amber-icecourt-shell-background-b`      | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `shell-background`    | `amber-icecourt`   | `B`     | `3840x2160` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/shell-background/amber-icecourt/shell-background-b.png`         |
| `SA-R4-2026-04-29-amber-icecourt-topbar-a`                | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `topbar`              | `amber-icecourt`   | `A`     |  `3840x360` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/topbar/amber-icecourt/topbar-a.png`                             |
| `SA-R4-2026-04-29-amber-icecourt-topbar-b`                | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `topbar`              | `amber-icecourt`   | `B`     |  `3840x360` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/topbar/amber-icecourt/topbar-b.png`                             |
| `SA-R4-2026-04-29-amber-icecourt-player-zone-p1-a`        | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `player-zone-p1`      | `amber-icecourt`   | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p1/amber-icecourt/player-zone-p1-a.png`             |
| `SA-R4-2026-04-29-amber-icecourt-player-zone-p1-b`        | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `player-zone-p1`      | `amber-icecourt`   | `B`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p1/amber-icecourt/player-zone-p1-b.png`             |
| `SA-R4-2026-04-29-amber-icecourt-player-zone-p2-a`        | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `player-zone-p2`      | `amber-icecourt`   | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p2/amber-icecourt/player-zone-p2-a.png`             |
| `SA-R4-2026-04-29-amber-icecourt-player-zone-p2-b`        | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `player-zone-p2`      | `amber-icecourt`   | `B`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p2/amber-icecourt/player-zone-p2-b.png`             |
| `SA-R4-2026-04-29-amber-icecourt-gem-panel-a`             | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `gem-panel`           | `amber-icecourt`   | `A`     | `1254x1254` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/gem-panel/amber-icecourt/gem-panel-a.png`                       |
| `SA-R4-2026-04-29-amber-icecourt-gem-panel-b`             | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `gem-panel`           | `amber-icecourt`   | `B`     | `1254x1254` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/gem-panel/amber-icecourt/gem-panel-b.png`                       |
| `SA-R4-2026-04-29-amber-icecourt-market-card-back-l1-a`   | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `market-card-back-l1` | `amber-icecourt`   | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l1/amber-icecourt/market-card-back-l1-a.png`   |
| `SA-R4-2026-04-29-amber-icecourt-market-card-back-l1-b`   | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `market-card-back-l1` | `amber-icecourt`   | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l1/amber-icecourt/market-card-back-l1-b.png`   |
| `SA-R4-2026-04-29-amber-icecourt-market-card-back-l2-a`   | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `market-card-back-l2` | `amber-icecourt`   | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l2/amber-icecourt/market-card-back-l2-a.png`   |
| `SA-R4-2026-04-29-amber-icecourt-market-card-back-l2-b`   | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `market-card-back-l2` | `amber-icecourt`   | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l2/amber-icecourt/market-card-back-l2-b.png`   |
| `SA-R4-2026-04-29-amber-icecourt-market-card-back-l3-a`   | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `market-card-back-l3` | `amber-icecourt`   | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l3/amber-icecourt/market-card-back-l3-a.png`   |
| `SA-R4-2026-04-29-amber-icecourt-market-card-back-l3-b`   | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `market-card-back-l3` | `amber-icecourt`   | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l3/amber-icecourt/market-card-back-l3-b.png`   |
| `SA-R4-2026-04-29-amber-icecourt-royal-card-back-a`       | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `royal-card-back`     | `amber-icecourt`   | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/royal-card-back/amber-icecourt/royal-card-back-a.png`           |
| `SA-R4-2026-04-29-amber-icecourt-royal-card-back-b`       | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `royal-card-back`     | `amber-icecourt`   | `B`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/royal-card-back/amber-icecourt/royal-card-back-b.png`           |
| `SA-R4-2026-04-29-velvet-sunharbor-shell-background-a`    | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `shell-background`    | `velvet-sunharbor` | `A`     | `3840x2160` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/shell-background/velvet-sunharbor/shell-background-a.png`       |
| `SA-R4-2026-04-29-velvet-sunharbor-topbar-a`              | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `topbar`              | `velvet-sunharbor` | `A`     |  `3840x360` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/topbar/velvet-sunharbor/topbar-a.png`                           |
| `SA-R4-2026-04-29-velvet-sunharbor-player-zone-p1-a`      | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `player-zone-p1`      | `velvet-sunharbor` | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p1/velvet-sunharbor/player-zone-p1-a.png`           |
| `SA-R4-2026-04-29-velvet-sunharbor-player-zone-p2-a`      | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `player-zone-p2`      | `velvet-sunharbor` | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p2/velvet-sunharbor/player-zone-p2-a.png`           |
| `SA-R4-2026-04-29-velvet-sunharbor-gem-panel-a`           | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `gem-panel`           | `velvet-sunharbor` | `A`     | `1254x1254` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/gem-panel/velvet-sunharbor/gem-panel-a.png`                     |
| `SA-R4-2026-04-29-velvet-sunharbor-market-card-back-l1-a` | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `market-card-back-l1` | `velvet-sunharbor` | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l1/velvet-sunharbor/market-card-back-l1-a.png` |
| `SA-R4-2026-04-29-velvet-sunharbor-market-card-back-l2-a` | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `market-card-back-l2` | `velvet-sunharbor` | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l2/velvet-sunharbor/market-card-back-l2-a.png` |
| `SA-R4-2026-04-29-velvet-sunharbor-market-card-back-l3-a` | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `market-card-back-l3` | `velvet-sunharbor` | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l3/velvet-sunharbor/market-card-back-l3-a.png` |
| `SA-R4-2026-04-29-velvet-sunharbor-royal-card-back-a`     | `surface-autonomous-new-themes-r4-candidates` | `2026-04-29` | `royal-card-back`     | `velvet-sunharbor` | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/royal-card-back/velvet-sunharbor/royal-card-back-a.png`         |

## Full Prompts

### SA-R4-2026-04-29-amber-icecourt-shell-background-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/shell-background/amber-icecourt/shell-background-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-shell-background-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/shell-background/amber-icecourt/shell-background-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-topbar-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/topbar/amber-icecourt/topbar-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-topbar-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/topbar/amber-icecourt/topbar-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-player-zone-p1-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p1/amber-icecourt/player-zone-p1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-player-zone-p1-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p1/amber-icecourt/player-zone-p1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-player-zone-p2-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p2/amber-icecourt/player-zone-p2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-player-zone-p2-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p2/amber-icecourt/player-zone-p2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-gem-panel-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/gem-panel/amber-icecourt/gem-panel-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-gem-panel-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/gem-panel/amber-icecourt/gem-panel-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-market-card-back-l1-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l1/amber-icecourt/market-card-back-l1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-market-card-back-l1-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l1/amber-icecourt/market-card-back-l1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-market-card-back-l2-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l2/amber-icecourt/market-card-back-l2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-market-card-back-l2-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l2/amber-icecourt/market-card-back-l2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-market-card-back-l3-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l3/amber-icecourt/market-card-back-l3-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-market-card-back-l3-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l3/amber-icecourt/market-card-back-l3-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-royal-card-back-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/royal-card-back/amber-icecourt/royal-card-back-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-amber-icecourt-royal-card-back-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `amber-icecourt` (Amber Icecourt)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/royal-card-back/amber-icecourt/royal-card-back-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `amber-icecourt` (Amber Icecourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: transparent amber resin, blue-white ice glass, pale silver court inlay, restrained frost glow, crystalline bevels without script or symbols. Style identity: cool royal ice court balanced by warm amber material and readable quiet UI zones. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-shell-background-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/shell-background/jade-starforge/shell-background-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-shell-background-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/shell-background/jade-starforge/shell-background-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-topbar-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/topbar/jade-starforge/topbar-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-topbar-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/topbar/jade-starforge/topbar-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-player-zone-p1-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p1/jade-starforge/player-zone-p1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-player-zone-p1-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p1/jade-starforge/player-zone-p1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-player-zone-p2-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p2/jade-starforge/player-zone-p2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-player-zone-p2-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p2/jade-starforge/player-zone-p2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-gem-panel-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/gem-panel/jade-starforge/gem-panel-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-gem-panel-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/gem-panel/jade-starforge/gem-panel-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-market-card-back-l1-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l1/jade-starforge/market-card-back-l1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-market-card-back-l1-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l1/jade-starforge/market-card-back-l1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-market-card-back-l2-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l2/jade-starforge/market-card-back-l2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-market-card-back-l2-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l2/jade-starforge/market-card-back-l2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-market-card-back-l3-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l3/jade-starforge/market-card-back-l3-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-market-card-back-l3-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l3/jade-starforge/market-card-back-l3-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-royal-card-back-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/royal-card-back/jade-starforge/royal-card-back-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-jade-starforge-royal-card-back-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `jade-starforge` (Jade Starforge)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/royal-card-back/jade-starforge/royal-card-back-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `jade-starforge` (Jade Starforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep jade stone, star-fired bronze, subtle meteoric sparkle, blackened celestial metal, forge geometry without maps or letters. Style identity: celestial forge surface with jade contrast, controlled highlights, and strong foreground readability. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-shell-background-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/shell-background/velvet-sunharbor/shell-background-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-shell-background-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/shell-background/velvet-sunharbor/shell-background-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-topbar-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/topbar/velvet-sunharbor/topbar-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-topbar-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/topbar/velvet-sunharbor/topbar-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-player-zone-p1-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p1/velvet-sunharbor/player-zone-p1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-player-zone-p1-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p1/velvet-sunharbor/player-zone-p1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-player-zone-p2-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p2/velvet-sunharbor/player-zone-p2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-player-zone-p2-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p2/velvet-sunharbor/player-zone-p2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-gem-panel-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/gem-panel/velvet-sunharbor/gem-panel-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-gem-panel-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/gem-panel/velvet-sunharbor/gem-panel-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-market-card-back-l1-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l1/velvet-sunharbor/market-card-back-l1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-market-card-back-l1-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l1/velvet-sunharbor/market-card-back-l1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-market-card-back-l2-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l2/velvet-sunharbor/market-card-back-l2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-market-card-back-l2-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l2/velvet-sunharbor/market-card-back-l2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-market-card-back-l3-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l3/velvet-sunharbor/market-card-back-l3-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-market-card-back-l3-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l3/velvet-sunharbor/market-card-back-l3-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-royal-card-back-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/royal-card-back/velvet-sunharbor/royal-card-back-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-velvet-sunharbor-royal-card-back-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `velvet-sunharbor` (Velvet Sunharbor)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/royal-card-back/velvet-sunharbor/royal-card-back-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `velvet-sunharbor` (Velvet Sunharbor). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: wine velvet lacquer, sunlit brass, warm harbor tile, muted coral enamel, elegant maritime arcs without emblems or text. Style identity: warm harbor-luxury tabletop with soft brass ornament and restrained gameplay readability. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-shell-background-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/shell-background/onyx-silvergrove/shell-background-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-shell-background-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/shell-background/onyx-silvergrove/shell-background-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-topbar-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/topbar/onyx-silvergrove/topbar-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-topbar-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/topbar/onyx-silvergrove/topbar-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-player-zone-p1-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p1/onyx-silvergrove/player-zone-p1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-player-zone-p1-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p1/onyx-silvergrove/player-zone-p1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-player-zone-p2-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p2/onyx-silvergrove/player-zone-p2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-player-zone-p2-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/player-zone-p2/onyx-silvergrove/player-zone-p2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-gem-panel-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/gem-panel/onyx-silvergrove/gem-panel-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-gem-panel-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/gem-panel/onyx-silvergrove/gem-panel-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-market-card-back-l1-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l1/onyx-silvergrove/market-card-back-l1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-market-card-back-l1-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l1/onyx-silvergrove/market-card-back-l1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-market-card-back-l2-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l2/onyx-silvergrove/market-card-back-l2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-market-card-back-l2-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l2/onyx-silvergrove/market-card-back-l2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-market-card-back-l3-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l3/onyx-silvergrove/market-card-back-l3-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-market-card-back-l3-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/market-card-back-l3/onyx-silvergrove/market-card-back-l3-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-royal-card-back-a

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/royal-card-back/onyx-silvergrove/royal-card-back-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R4-2026-04-29-onyx-silvergrove-royal-card-back-b

- Batch: `surface-autonomous-new-themes-r4-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `onyx-silvergrove` (Onyx Silvergrove)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r4-candidates/2026-04-29/royal-card-back/onyx-silvergrove/royal-card-back-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `onyx-silvergrove` (Onyx Silvergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black onyx, moon-silver leaf filigree, dark green woodland lacquer, polished stone, botanical geometry without readable glyphs. Style identity: dark refined grove surface with silver botanical ornament and clear UI overlay zones. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```
