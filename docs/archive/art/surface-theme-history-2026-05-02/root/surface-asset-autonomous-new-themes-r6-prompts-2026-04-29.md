# Surface Asset Autonomous New Theme R6 Prompt Manifest - 2026-04-29

This manifest is the required pre-generation prompt contract for a sixth full Image Gen candidate-library pass. It follows `C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md` and keeps runtime resources untouched.

## Inspected Source Constraints

- Runtime Surface Styles are `crystal-anime`, `royal-luxury`, `dark-arcane`, `clean-boardgame`, and `pearl-opaline`; this R6 pass creates candidate-only new Theme groups and does not add runtime enums.
- Runtime surface art is loaded from `apps/desktop/public/assets/surfaces/anime-themes/<style>/dark/`; this pass does not promote or overwrite runtime assets.
- PlayerZone primary candidate contract is side-specific: `player-zone-p1.png` and `player-zone-p2.png`, both `1920x520`; `player-zone.png` remains legacy fallback only.
- Featured market and royal card backs use `FEATURED_CARD_SAMPLE_SIZE` `1086x1448` and are downsampled by the app to `FEATURED_CARD_SIZE` `150x200`.
- Gem panels use a `1254x1254` substrate with future per-surface grid calibration; generated panels must have straight 5x5 empty wells.
- React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances.

## Output Contract

- Batch/archive root: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/`.
- Prompt manifest: `docs/art/surface-asset-autonomous-new-themes-r6-prompts-2026-04-29.md`.
- Scoring report: `docs/art/surface-asset-autonomous-new-themes-r6-library-2026-04-29.md`.
- Visual Lab manifest: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/contact-sheets/preview-manifest.json`.
- Candidate count target: `72` PNGs = `4 themes x 9 slots x 2 variants`.
- Workers must use the `imagegen` skill and built-in `image_gen`; workers must not edit repo files or copy files into the workspace.

## R6 Candidate Themes

- `platinum-stormcourt` (Platinum Stormcourt): cool storm court surface with polished platinum contrast and quiet gameplay readability.
- `teal-embergrove` (Teal Embergrove): forest-forge material set balancing teal calm with ember warmth and low-noise UI zones.
- `crimson-moonarchive` (Crimson Moonarchive): ceremonial archive table with red moon accents and strong foreground contrast.
- `opal-nightforge` (Opal Nightforge): dark forge-luxury surface with controlled opal highlights and readable dark fields.

## Prompt Records

| Prompt ID                                                    | Batch                                         | Date         | Slot                  | Theme                 | Variant |      Target | Planned Archive Path                                                                                                                          |
| ------------------------------------------------------------ | --------------------------------------------- | ------------ | --------------------- | --------------------- | ------- | ----------: | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `SA-R6-2026-04-29-platinum-stormcourt-shell-background-a`    | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `shell-background`    | `platinum-stormcourt` | `A`     | `3840x2160` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/shell-background/platinum-stormcourt/shell-background-a.png`       |
| `SA-R6-2026-04-29-platinum-stormcourt-topbar-a`              | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `topbar`              | `platinum-stormcourt` | `A`     |  `3840x360` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/topbar/platinum-stormcourt/topbar-a.png`                           |
| `SA-R6-2026-04-29-platinum-stormcourt-topbar-b`              | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `topbar`              | `platinum-stormcourt` | `B`     |  `3840x360` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/topbar/platinum-stormcourt/topbar-b.png`                           |
| `SA-R6-2026-04-29-platinum-stormcourt-player-zone-p1-a`      | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `player-zone-p1`      | `platinum-stormcourt` | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p1/platinum-stormcourt/player-zone-p1-a.png`           |
| `SA-R6-2026-04-29-platinum-stormcourt-player-zone-p2-a`      | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `player-zone-p2`      | `platinum-stormcourt` | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p2/platinum-stormcourt/player-zone-p2-a.png`           |
| `SA-R6-2026-04-29-platinum-stormcourt-gem-panel-a`           | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `gem-panel`           | `platinum-stormcourt` | `A`     | `1254x1254` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/gem-panel/platinum-stormcourt/gem-panel-a.png`                     |
| `SA-R6-2026-04-29-platinum-stormcourt-market-card-back-l1-a` | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `market-card-back-l1` | `platinum-stormcourt` | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l1/platinum-stormcourt/market-card-back-l1-a.png` |
| `SA-R6-2026-04-29-platinum-stormcourt-market-card-back-l2-a` | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `market-card-back-l2` | `platinum-stormcourt` | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l2/platinum-stormcourt/market-card-back-l2-a.png` |
| `SA-R6-2026-04-29-platinum-stormcourt-market-card-back-l3-a` | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `market-card-back-l3` | `platinum-stormcourt` | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l3/platinum-stormcourt/market-card-back-l3-a.png` |
| `SA-R6-2026-04-29-platinum-stormcourt-royal-card-back-a`     | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `royal-card-back`     | `platinum-stormcourt` | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/royal-card-back/platinum-stormcourt/royal-card-back-a.png`         |
| `SA-R6-2026-04-29-teal-embergrove-shell-background-a`        | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `shell-background`    | `teal-embergrove`     | `A`     | `3840x2160` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/shell-background/teal-embergrove/shell-background-a.png`           |
| `SA-R6-2026-04-29-teal-embergrove-topbar-a`                  | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `topbar`              | `teal-embergrove`     | `A`     |  `3840x360` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/topbar/teal-embergrove/topbar-a.png`                               |
| `SA-R6-2026-04-29-teal-embergrove-player-zone-p1-a`          | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `player-zone-p1`      | `teal-embergrove`     | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p1/teal-embergrove/player-zone-p1-a.png`               |
| `SA-R6-2026-04-29-teal-embergrove-player-zone-p2-a`          | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `player-zone-p2`      | `teal-embergrove`     | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p2/teal-embergrove/player-zone-p2-a.png`               |
| `SA-R6-2026-04-29-teal-embergrove-gem-panel-a`               | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `gem-panel`           | `teal-embergrove`     | `A`     | `1254x1254` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/gem-panel/teal-embergrove/gem-panel-a.png`                         |
| `SA-R6-2026-04-29-teal-embergrove-market-card-back-l1-a`     | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `market-card-back-l1` | `teal-embergrove`     | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l1/teal-embergrove/market-card-back-l1-a.png`     |
| `SA-R6-2026-04-29-teal-embergrove-market-card-back-l2-a`     | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `market-card-back-l2` | `teal-embergrove`     | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l2/teal-embergrove/market-card-back-l2-a.png`     |
| `SA-R6-2026-04-29-teal-embergrove-market-card-back-l3-a`     | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `market-card-back-l3` | `teal-embergrove`     | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l3/teal-embergrove/market-card-back-l3-a.png`     |
| `SA-R6-2026-04-29-teal-embergrove-royal-card-back-a`         | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `royal-card-back`     | `teal-embergrove`     | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/royal-card-back/teal-embergrove/royal-card-back-a.png`             |
| `SA-R6-2026-04-29-crimson-moonarchive-topbar-b`              | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `topbar`              | `crimson-moonarchive` | `B`     |  `3840x360` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/topbar/crimson-moonarchive/topbar-b.png`                           |
| `SA-R6-2026-04-29-opal-nightforge-shell-background-a`        | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `shell-background`    | `opal-nightforge`     | `A`     | `3840x2160` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/shell-background/opal-nightforge/shell-background-a.png`           |
| `SA-R6-2026-04-29-opal-nightforge-topbar-a`                  | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `topbar`              | `opal-nightforge`     | `A`     |  `3840x360` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/topbar/opal-nightforge/topbar-a.png`                               |
| `SA-R6-2026-04-29-opal-nightforge-topbar-b`                  | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `topbar`              | `opal-nightforge`     | `B`     |  `3840x360` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/topbar/opal-nightforge/topbar-b.png`                               |
| `SA-R6-2026-04-29-opal-nightforge-player-zone-p1-a`          | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `player-zone-p1`      | `opal-nightforge`     | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p1/opal-nightforge/player-zone-p1-a.png`               |
| `SA-R6-2026-04-29-opal-nightforge-player-zone-p2-a`          | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `player-zone-p2`      | `opal-nightforge`     | `A`     |  `1920x520` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p2/opal-nightforge/player-zone-p2-a.png`               |
| `SA-R6-2026-04-29-opal-nightforge-gem-panel-a`               | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `gem-panel`           | `opal-nightforge`     | `A`     | `1254x1254` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/gem-panel/opal-nightforge/gem-panel-a.png`                         |
| `SA-R6-2026-04-29-opal-nightforge-market-card-back-l1-a`     | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `market-card-back-l1` | `opal-nightforge`     | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l1/opal-nightforge/market-card-back-l1-a.png`     |
| `SA-R6-2026-04-29-opal-nightforge-market-card-back-l2-a`     | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `market-card-back-l2` | `opal-nightforge`     | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l2/opal-nightforge/market-card-back-l2-a.png`     |
| `SA-R6-2026-04-29-opal-nightforge-market-card-back-l3-a`     | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `market-card-back-l3` | `opal-nightforge`     | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l3/opal-nightforge/market-card-back-l3-a.png`     |
| `SA-R6-2026-04-29-opal-nightforge-royal-card-back-a`         | `surface-autonomous-new-themes-r6-candidates` | `2026-04-29` | `royal-card-back`     | `opal-nightforge`     | `A`     | `1086x1448` | `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/royal-card-back/opal-nightforge/royal-card-back-a.png`             |

## Full Prompts

### SA-R6-2026-04-29-platinum-stormcourt-shell-background-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/shell-background/platinum-stormcourt/shell-background-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-shell-background-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/shell-background/platinum-stormcourt/shell-background-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-topbar-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/topbar/platinum-stormcourt/topbar-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-topbar-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/topbar/platinum-stormcourt/topbar-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-player-zone-p1-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p1/platinum-stormcourt/player-zone-p1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-player-zone-p1-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p1/platinum-stormcourt/player-zone-p1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-player-zone-p2-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p2/platinum-stormcourt/player-zone-p2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-player-zone-p2-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p2/platinum-stormcourt/player-zone-p2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-gem-panel-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/gem-panel/platinum-stormcourt/gem-panel-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-gem-panel-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/gem-panel/platinum-stormcourt/gem-panel-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-market-card-back-l1-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l1/platinum-stormcourt/market-card-back-l1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-market-card-back-l1-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l1/platinum-stormcourt/market-card-back-l1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-market-card-back-l2-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l2/platinum-stormcourt/market-card-back-l2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-market-card-back-l2-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l2/platinum-stormcourt/market-card-back-l2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-market-card-back-l3-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l3/platinum-stormcourt/market-card-back-l3-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-market-card-back-l3-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l3/platinum-stormcourt/market-card-back-l3-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-royal-card-back-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/royal-card-back/platinum-stormcourt/royal-card-back-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-platinum-stormcourt-royal-card-back-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `platinum-stormcourt` (Platinum Stormcourt)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/royal-card-back/platinum-stormcourt/royal-card-back-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `platinum-stormcourt` (Platinum Stormcourt). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: brushed platinum, storm-blue enamel, dark cloud glass, precise court inlay, restrained lightning-like filigree without symbols or writing. Style identity: cool storm court surface with polished platinum contrast and quiet gameplay readability. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-shell-background-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/shell-background/teal-embergrove/shell-background-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-shell-background-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/shell-background/teal-embergrove/shell-background-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-topbar-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/topbar/teal-embergrove/topbar-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-topbar-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/topbar/teal-embergrove/topbar-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-player-zone-p1-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p1/teal-embergrove/player-zone-p1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-player-zone-p1-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p1/teal-embergrove/player-zone-p1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-player-zone-p2-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p2/teal-embergrove/player-zone-p2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-player-zone-p2-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p2/teal-embergrove/player-zone-p2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-gem-panel-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/gem-panel/teal-embergrove/gem-panel-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-gem-panel-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/gem-panel/teal-embergrove/gem-panel-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-market-card-back-l1-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l1/teal-embergrove/market-card-back-l1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-market-card-back-l1-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l1/teal-embergrove/market-card-back-l1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-market-card-back-l2-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l2/teal-embergrove/market-card-back-l2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-market-card-back-l2-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l2/teal-embergrove/market-card-back-l2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-market-card-back-l3-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l3/teal-embergrove/market-card-back-l3-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-market-card-back-l3-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l3/teal-embergrove/market-card-back-l3-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-royal-card-back-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/royal-card-back/teal-embergrove/royal-card-back-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-teal-embergrove-royal-card-back-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `teal-embergrove` (Teal Embergrove)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/royal-card-back/teal-embergrove/royal-card-back-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `teal-embergrove` (Teal Embergrove). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: deep teal lacquer, ember-lit copper, smoky woodland stone, warm botanical forge geometry without glyphs, logos, or readable marks. Style identity: forest-forge material set balancing teal calm with ember warmth and low-noise UI zones. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-shell-background-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/shell-background/crimson-moonarchive/shell-background-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-shell-background-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/shell-background/crimson-moonarchive/shell-background-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-topbar-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/topbar/crimson-moonarchive/topbar-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-topbar-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/topbar/crimson-moonarchive/topbar-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-player-zone-p1-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p1/crimson-moonarchive/player-zone-p1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-player-zone-p1-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p1/crimson-moonarchive/player-zone-p1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-player-zone-p2-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p2/crimson-moonarchive/player-zone-p2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-player-zone-p2-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p2/crimson-moonarchive/player-zone-p2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-gem-panel-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/gem-panel/crimson-moonarchive/gem-panel-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-gem-panel-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/gem-panel/crimson-moonarchive/gem-panel-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-market-card-back-l1-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l1/crimson-moonarchive/market-card-back-l1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-market-card-back-l1-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l1/crimson-moonarchive/market-card-back-l1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-market-card-back-l2-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l2/crimson-moonarchive/market-card-back-l2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-market-card-back-l2-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l2/crimson-moonarchive/market-card-back-l2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-market-card-back-l3-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l3/crimson-moonarchive/market-card-back-l3-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-market-card-back-l3-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l3/crimson-moonarchive/market-card-back-l3-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-royal-card-back-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/royal-card-back/crimson-moonarchive/royal-card-back-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-crimson-moonarchive-royal-card-back-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `crimson-moonarchive` (Crimson Moonarchive)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/royal-card-back/crimson-moonarchive/royal-card-back-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `crimson-moonarchive` (Crimson Moonarchive). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: crimson lacquer, moonlit ivory inlay, aged nickel, archive-table geometry, sealed ornamental panels without letters, numerals, maps, or emblems. Style identity: ceremonial archive table with red moon accents and strong foreground contrast. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-shell-background-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `A`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/shell-background/opal-nightforge/shell-background-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-shell-background-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `shell-background`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `B`
- Target dimensions: `3840x2160`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/shell-background/opal-nightforge/shell-background-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: One continuous full-board tabletop background for the whole game shell. Passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, not a framed panel. Keep low-noise continuous material texture across the whole image. Do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-topbar-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `A`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/topbar/opal-nightforge/topbar-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-topbar-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `topbar`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `B`
- Target dimensions: `3840x360`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/topbar/opal-nightforge/topbar-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-player-zone-p1-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p1/opal-nightforge/player-zone-p1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-player-zone-p1-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p1`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p1/opal-nightforge/player-zone-p1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-player-zone-p2-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `A`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p2/opal-nightforge/player-zone-p2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-player-zone-p2-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `player-zone-p2`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `B`
- Target dimensions: `1920x520`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/player-zone-p2/opal-nightforge/player-zone-p2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 skin UI asset. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: Side-specific P2 player rail substrate, coherent with P1 but allowed to differ or mirror composition. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-gem-panel-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `A`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/gem-panel/opal-nightforge/gem-panel-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-gem-panel-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `gem-panel`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `B`
- Target dimensions: `1254x1254`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/gem-panel/opal-nightforge/gem-panel-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel gem panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. Use straight, aligned, evenly spaced 5x5 seams with stable margins. Record intended normalized grid lines separately; avoid wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-market-card-back-l1-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l1/opal-nightforge/market-card-back-l1-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-market-card-back-l1-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l1`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l1/opal-nightforge/market-card-back-l1-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. The center must not be empty, blank, flat, or a large void; include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-market-card-back-l2-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l2/opal-nightforge/market-card-back-l2-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-market-card-back-l2-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l2`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l2/opal-nightforge/market-card-back-l2-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and a clearer mid-tier accent. It must be visibly more luxurious than L1 while not reaching L3 prestige. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-market-card-back-l3-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l3/opal-nightforge/market-card-back-l3-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-market-card-back-l3-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `market-card-back-l3`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/market-card-back-l3/opal-nightforge/market-card-back-l3-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with the most luxurious ornament, jewel density, glow strength, and prestige accent. No text, numerals, Roman numerals, level marks, labels, or UI elements. The L1/L2/L3 market backs for this Theme must read as one coherent tiered set when placed side by side; communicate tier only through material richness, trim density, glow strength, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-royal-card-back-a

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `A`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/royal-card-back/opal-nightforge/royal-card-back-a.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant A should prioritize the clearest, safest composition for runtime readability. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```

### SA-R6-2026-04-29-opal-nightforge-royal-card-back-b

- Batch: `surface-autonomous-new-themes-r6-candidates`
- Date: `2026-04-29`
- Slot: `royal-card-back`
- Theme: `opal-nightforge` (Opal Nightforge)
- Variant: `B`
- Target dimensions: `1086x1448`
- Planned archive path: `assets/art-library/surface-autonomous-new-themes-r6-candidates/2026-04-29/royal-card-back/opal-nightforge/royal-card-back-b.png`
- Avoid list: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `opal-nightforge` (Opal Nightforge). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black forged metal, restrained opal glow, blue-violet glass, dark silver trim, abstract kiln geometry without text or fake runes. Style identity: dark forge-luxury surface with controlled opal highlights and readable dark fields. Slot constraints: Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs while still sharing the Theme family. No baked labels, numerals, Roman numerals, level marks, or UI elements. Variant B should be a distinct alternate composition under the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, icons, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, baked cards, gameplay controls, high glare, white-wash, noisy overlay centers.
```
