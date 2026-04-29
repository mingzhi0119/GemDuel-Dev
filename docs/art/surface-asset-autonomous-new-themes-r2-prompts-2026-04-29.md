# GemDuel Surface Asset Autonomous New Themes R2 Prompt Manifest - 2026-04-29

## Batch

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `archiveRoot`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29`
- Scope: candidate-library exploration only; no runtime enum, code, or `apps/desktop/public/assets/surfaces/**` promotion.
- Generation path: workers must use the `imagegen` skill and built-in `image_gen` only.
- React-renders-UI note: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

## Theme Groups

- `sunken-opal` (Sunken Opal): underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers.
- `clockwork-garden` (Clockwork Garden): botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights.
- `storm-temple` (Storm Temple): monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks.
- `velvet-noir` (Velvet Noir): luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish.

## Slot Targets

| slot                  | required filename         | target dimensions | overlay constraints                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------- | ------------------------- | ----------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shell-background`    | `shell-background.png`    |       `3840x2160` | Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome.                                                                                                                                                                                                                                              |
| `topbar`              | `topbar.png`              |        `3840x360` | Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.                                                                                                                                                                                                                                                                                    |
| `player-zone-p1`      | `player-zone-p1.png`      |        `1920x520` | Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.                                                                                                             |
| `player-zone-p2`      | `player-zone-p2.png`      |        `1920x520` | Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.                                                                                                         |
| `gem-panel`           | `gem-panel.png`           |       `1254x1254` | Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration.                           |
| `market-card-back-l1` | `market-card-back-l1.png` |       `1086x1448` | Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.                            |
| `market-card-back-l2` | `market-card-back-l2.png` |       `1086x1448` | Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.                                      |
| `market-card-back-l3` | `market-card-back-l3.png` |       `1086x1448` | Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. |
| `royal-card-back`     | `royal-card-back.png`     |       `1086x1448` | Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family.                                                                                                                                       |

## Avoid List

text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers

## Prompt Records

### SA-NEW-R2-2026-04-29-sunken-opal-shell-background-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `shell-background`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `a`
- `targetDimensions`: `3840x2160`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/shell-background/sunken-opal/shell-background-a.png`
- `overlayConstraints`: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-shell-background-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `shell-background`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `b`
- `targetDimensions`: `3840x2160`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/shell-background/sunken-opal/shell-background-b.png`
- `overlayConstraints`: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-topbar-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `topbar`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `a`
- `targetDimensions`: `3840x360`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/topbar/sunken-opal/topbar-a.png`
- `overlayConstraints`: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar background UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-topbar-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `topbar`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `b`
- `targetDimensions`: `3840x360`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/topbar/sunken-opal/topbar-b.png`
- `overlayConstraints`: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar background UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-player-zone-p1-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `player-zone-p1`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `a`
- `targetDimensions`: `1920x520`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p1/sunken-opal/player-zone-p1-a.png`
- `overlayConstraints`: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P1 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-player-zone-p1-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `player-zone-p1`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `b`
- `targetDimensions`: `1920x520`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p1/sunken-opal/player-zone-p1-b.png`
- `overlayConstraints`: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P1 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-player-zone-p2-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `player-zone-p2`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `a`
- `targetDimensions`: `1920x520`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p2/sunken-opal/player-zone-p2-a.png`
- `overlayConstraints`: Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P2 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-player-zone-p2-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `player-zone-p2`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `b`
- `targetDimensions`: `1920x520`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p2/sunken-opal/player-zone-p2-b.png`
- `overlayConstraints`: Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P2 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-gem-panel-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `gem-panel`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `a`
- `targetDimensions`: `1254x1254`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/gem-panel/sunken-opal/gem-panel-a.png`
- `overlayConstraints`: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel gem board panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-gem-panel-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `gem-panel`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `b`
- `targetDimensions`: `1254x1254`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/gem-panel/sunken-opal/gem-panel-b.png`
- `overlayConstraints`: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel gem board panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-market-card-back-l1-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l1`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `a`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l1/sunken-opal/market-card-back-l1-a.png`
- `overlayConstraints`: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-market-card-back-l1-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l1`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `b`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l1/sunken-opal/market-card-back-l1-b.png`
- `overlayConstraints`: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-market-card-back-l2-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l2`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `a`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l2/sunken-opal/market-card-back-l2-a.png`
- `overlayConstraints`: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-market-card-back-l2-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l2`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `b`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l2/sunken-opal/market-card-back-l2-b.png`
- `overlayConstraints`: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-market-card-back-l3-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l3`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `a`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l3/sunken-opal/market-card-back-l3-a.png`
- `overlayConstraints`: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-market-card-back-l3-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l3`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `b`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l3/sunken-opal/market-card-back-l3-b.png`
- `overlayConstraints`: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-royal-card-back-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `royal-card-back`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `a`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/royal-card-back/sunken-opal/royal-card-back-a.png`
- `overlayConstraints`: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-sunken-opal-royal-card-back-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `royal-card-back`
- `style`: `sunken-opal`
- `themeDisplayName`: `Sunken Opal`
- `variant`: `b`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/royal-card-back/sunken-opal/royal-card-back-b.png`
- `overlayConstraints`: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `sunken-opal` (Sunken Opal). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: submerged palace stone, opal shell inlay, deep aqua glass, pearl mist, coral-gold edge trim, soft caustic light kept away from overlay centers. Style identity: underwater royal-table atmosphere with luminous opal materials and calm readable surfaces. Slot constraints: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-shell-background-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `shell-background`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `a`
- `targetDimensions`: `3840x2160`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/shell-background/clockwork-garden/shell-background-a.png`
- `overlayConstraints`: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-shell-background-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `shell-background`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `b`
- `targetDimensions`: `3840x2160`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/shell-background/clockwork-garden/shell-background-b.png`
- `overlayConstraints`: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-topbar-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `topbar`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `a`
- `targetDimensions`: `3840x360`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/topbar/clockwork-garden/topbar-a.png`
- `overlayConstraints`: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar background UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-topbar-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `topbar`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `b`
- `targetDimensions`: `3840x360`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/topbar/clockwork-garden/topbar-b.png`
- `overlayConstraints`: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar background UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-player-zone-p1-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `player-zone-p1`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `a`
- `targetDimensions`: `1920x520`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p1/clockwork-garden/player-zone-p1-a.png`
- `overlayConstraints`: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P1 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-player-zone-p1-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `player-zone-p1`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `b`
- `targetDimensions`: `1920x520`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p1/clockwork-garden/player-zone-p1-b.png`
- `overlayConstraints`: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P1 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-player-zone-p2-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `player-zone-p2`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `a`
- `targetDimensions`: `1920x520`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p2/clockwork-garden/player-zone-p2-a.png`
- `overlayConstraints`: Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P2 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-player-zone-p2-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `player-zone-p2`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `b`
- `targetDimensions`: `1920x520`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p2/clockwork-garden/player-zone-p2-b.png`
- `overlayConstraints`: Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P2 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-gem-panel-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `gem-panel`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `a`
- `targetDimensions`: `1254x1254`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/gem-panel/clockwork-garden/gem-panel-a.png`
- `overlayConstraints`: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel gem board panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-gem-panel-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `gem-panel`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `b`
- `targetDimensions`: `1254x1254`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/gem-panel/clockwork-garden/gem-panel-b.png`
- `overlayConstraints`: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel gem board panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-market-card-back-l1-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l1`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `a`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l1/clockwork-garden/market-card-back-l1-a.png`
- `overlayConstraints`: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-market-card-back-l1-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l1`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `b`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l1/clockwork-garden/market-card-back-l1-b.png`
- `overlayConstraints`: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-market-card-back-l2-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l2`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `a`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l2/clockwork-garden/market-card-back-l2-a.png`
- `overlayConstraints`: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-market-card-back-l2-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l2`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `b`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l2/clockwork-garden/market-card-back-l2-b.png`
- `overlayConstraints`: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-market-card-back-l3-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l3`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `a`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l3/clockwork-garden/market-card-back-l3-a.png`
- `overlayConstraints`: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-market-card-back-l3-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l3`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `b`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l3/clockwork-garden/market-card-back-l3-b.png`
- `overlayConstraints`: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-royal-card-back-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `royal-card-back`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `a`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/royal-card-back/clockwork-garden/royal-card-back-a.png`
- `overlayConstraints`: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-clockwork-garden-royal-card-back-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `royal-card-back`
- `style`: `clockwork-garden`
- `themeDisplayName`: `Clockwork Garden`
- `variant`: `b`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/royal-card-back/clockwork-garden/royal-card-back-b.png`
- `overlayConstraints`: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `clockwork-garden` (Clockwork Garden). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: antique brass, emerald glasshouse vines, dark walnut, pale mechanical flowers, subtle gearwork as abstract ornament only, warm controlled highlights. Style identity: botanical clockwork table surfaces with elegant brass-and-greenhouse prestige, no numerals or marks. Slot constraints: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-shell-background-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `shell-background`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `a`
- `targetDimensions`: `3840x2160`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/shell-background/storm-temple/shell-background-a.png`
- `overlayConstraints`: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-shell-background-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `shell-background`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `b`
- `targetDimensions`: `3840x2160`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/shell-background/storm-temple/shell-background-b.png`
- `overlayConstraints`: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-topbar-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `topbar`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `a`
- `targetDimensions`: `3840x360`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/topbar/storm-temple/topbar-a.png`
- `overlayConstraints`: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar background UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-topbar-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `topbar`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `b`
- `targetDimensions`: `3840x360`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/topbar/storm-temple/topbar-b.png`
- `overlayConstraints`: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar background UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-player-zone-p1-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `player-zone-p1`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `a`
- `targetDimensions`: `1920x520`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p1/storm-temple/player-zone-p1-a.png`
- `overlayConstraints`: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P1 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-player-zone-p1-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `player-zone-p1`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `b`
- `targetDimensions`: `1920x520`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p1/storm-temple/player-zone-p1-b.png`
- `overlayConstraints`: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P1 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-player-zone-p2-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `player-zone-p2`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `a`
- `targetDimensions`: `1920x520`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p2/storm-temple/player-zone-p2-a.png`
- `overlayConstraints`: Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P2 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-player-zone-p2-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `player-zone-p2`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `b`
- `targetDimensions`: `1920x520`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p2/storm-temple/player-zone-p2-b.png`
- `overlayConstraints`: Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P2 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-gem-panel-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `gem-panel`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `a`
- `targetDimensions`: `1254x1254`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/gem-panel/storm-temple/gem-panel-a.png`
- `overlayConstraints`: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel gem board panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-gem-panel-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `gem-panel`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `b`
- `targetDimensions`: `1254x1254`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/gem-panel/storm-temple/gem-panel-b.png`
- `overlayConstraints`: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel gem board panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-market-card-back-l1-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l1`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `a`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l1/storm-temple/market-card-back-l1-a.png`
- `overlayConstraints`: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-market-card-back-l1-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l1`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `b`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l1/storm-temple/market-card-back-l1-b.png`
- `overlayConstraints`: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-market-card-back-l2-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l2`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `a`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l2/storm-temple/market-card-back-l2-a.png`
- `overlayConstraints`: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-market-card-back-l2-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l2`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `b`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l2/storm-temple/market-card-back-l2-b.png`
- `overlayConstraints`: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-market-card-back-l3-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l3`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `a`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l3/storm-temple/market-card-back-l3-a.png`
- `overlayConstraints`: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-market-card-back-l3-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l3`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `b`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l3/storm-temple/market-card-back-l3-b.png`
- `overlayConstraints`: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-royal-card-back-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `royal-card-back`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `a`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/royal-card-back/storm-temple/royal-card-back-a.png`
- `overlayConstraints`: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-storm-temple-royal-card-back-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `royal-card-back`
- `style`: `storm-temple`
- `themeDisplayName`: `Storm Temple`
- `variant`: `b`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/royal-card-back/storm-temple/royal-card-back-b.png`
- `overlayConstraints`: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `storm-temple` (Storm Temple). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: storm-polished basalt, rain-dark jade, silver lightning trapped in bevels, sacred stone relief without symbols, cool vapor and gold edge sparks. Style identity: monumental storm shrine surfaces with strong contrast and quiet practical gameplay centers. Slot constraints: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-shell-background-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `shell-background`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `a`
- `targetDimensions`: `3840x2160`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/shell-background/velvet-noir/shell-background-a.png`
- `overlayConstraints`: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-shell-background-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `shell-background`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `b`
- `targetDimensions`: `3840x2160`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/shell-background/velvet-noir/shell-background-b.png`
- `overlayConstraints`: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel shell background UI asset. Create an exact 3840x2160 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise for the game stage; edges may carry stronger atmosphere. No separate playmat, tablecloth, center panel, labels, logos, or UI chrome. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-topbar-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `topbar`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `a`
- `targetDimensions`: `3840x360`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/topbar/velvet-noir/topbar-a.png`
- `overlayConstraints`: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar background UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-topbar-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `topbar`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `b`
- `targetDimensions`: `3840x360`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/topbar/velvet-noir/topbar-b.png`
- `overlayConstraints`: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel TopBar background UI asset. Create an exact 3840x360 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Panoramic 120px logical header strip. Keep quiet readable zones near 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-player-zone-p1-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `player-zone-p1`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `a`
- `targetDimensions`: `1920x520`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p1/velvet-noir/player-zone-p1-a.png`
- `overlayConstraints`: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P1 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-player-zone-p1-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `player-zone-p1`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `b`
- `targetDimensions`: `1920x520`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p1/velvet-noir/player-zone-p1-b.png`
- `overlayConstraints`: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P1 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Side-specific P1 player rail background. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-player-zone-p2-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `player-zone-p2`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `a`
- `targetDimensions`: `1920x520`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p2/velvet-noir/player-zone-p2-a.png`
- `overlayConstraints`: Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P2 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-player-zone-p2-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `player-zone-p2`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `b`
- `targetDimensions`: `1920x520`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/player-zone-p2/velvet-noir/player-zone-p2-b.png`
- `overlayConstraints`: Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel P2 PlayerZone rail substrate. Create an exact 1920x520 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Side-specific P2 player rail background in the same Theme style language as P1. It may mirror P1 or differ subtly. Quiet overlay zones. No baked gameplay UI, card frames, card slots, deck silhouettes, controls, labels, numbers, or placeholder rectangles. PlayerZone art is substrate only; React renders every card, gem, counter, badge, ring, tooltip, and control. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-gem-panel-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `gem-panel`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `a`
- `targetDimensions`: `1254x1254`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/gem-panel/velvet-noir/gem-panel-a.png`
- `overlayConstraints`: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel gem board panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-gem-panel-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `gem-panel`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `b`
- `targetDimensions`: `1254x1254`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/gem-panel/velvet-noir/gem-panel-b.png`
- `overlayConstraints`: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel gem board panel UI asset. Create an exact 1254x1254 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Front-facing orthographic square 5x5 board substrate. Empty readable wells only; no baked gems, click markers, labels, or icons. Prefer a regular 5x5 lattice with stable margins and visually clear 6 vertical and 6 horizontal grid lines suitable for future normalized calibration. Do not copy one old absolute lattice as universal. Keep the 5x5 wells empty and regular; the report will record normalized 6x6 grid lines for future calibration. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-market-card-back-l1-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l1`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `a`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l1/velvet-noir/market-card-back-l1-a.png`
- `overlayConstraints`: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-market-card-back-l1-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l1`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `b`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l1/velvet-noir/market-card-back-l1-b.png`
- `overlayConstraints`: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Lowest-tier market card back. Same family as L2 and L3 but visibly simpler. Complete vertical card back, readable blank center, shared silhouette/frame language. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-market-card-back-l2-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l2`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `a`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l2/velvet-noir/market-card-back-l2-a.png`
- `overlayConstraints`: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-market-card-back-l2-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l2`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `b`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l2/velvet-noir/market-card-back-l2-b.png`
- `overlayConstraints`: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Mid-tier market card back. Same family as L1 and L3 with more ornament than L1 and mid-tier accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-market-card-back-l3-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l3`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `a`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l3/velvet-noir/market-card-back-l3-a.png`
- `overlayConstraints`: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-market-card-back-l3-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `market-card-back-l3`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `b`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/market-card-back-l3/velvet-noir/market-card-back-l3-b.png`
- `overlayConstraints`: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3 UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Highest-tier market card back. Same family as L1 and L2 with most luxurious ornament, jewel density, glow strength, and prestige accent. Complete vertical card back, readable blank center. No text, numerals, Roman numerals, level marks, labels, or UI elements. The market L1/L2/L3 backs must read as one coherent set when placed side by side; communicate tier only through material richness, trim density, glow, and ornament complexity, never through text or symbols. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-royal-card-back-a

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `royal-card-back`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `a`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/royal-card-back/velvet-noir/royal-card-back-a.png`
- `overlayConstraints`: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family. Variant A should emphasize the primary slot identity and clearest readable composition. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```

### SA-NEW-R2-2026-04-29-velvet-noir-royal-card-back-b

- `batch`: `surface-autonomous-new-themes-r2-candidates`
- `date`: `2026-04-29`
- `slot`: `royal-card-back`
- `style`: `velvet-noir`
- `themeDisplayName`: `Velvet Noir`
- `variant`: `b`
- `targetDimensions`: `1086x1448`
- `plannedArchiveFilename`: `assets/art-library/surface-autonomous-new-themes-r2-candidates/2026-04-29/royal-card-back/velvet-noir/royal-card-back-b.png`
- `overlayConstraints`: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family.
- `avoid`: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers
- `React-renders-UI`: React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances.

```text
Use case: stylized-concept. Asset type: GemDuel royal card back UI asset. Create an exact 1086x1448 PNG candidate for a new GemDuel candidate Theme `velvet-noir` (Velvet Noir). This is a candidate-library exploration Theme, not a runtime-selectable style until code promotion is explicitly requested. Style recipe: black velvet, smoked mirror, champagne gold trim, ruby pinlights, lacquered art-deco geometry without writing, low glare premium finish. Style identity: luxury noir casino-board atmosphere with restrained jewel accents and high foreground readability. Slot constraints: Sovereign/prestige royal card back, stronger royal identity than market backs. Complete vertical card back with ornate prestige frame and readable blank center. No baked labels, numerals, Roman numerals, level marks, or UI elements. It should feel more sovereign and ceremonial than market backs while still sharing the Theme family. Variant B should be a distinct alternate composition with the same constraints, not a minor color-only duplicate. Composition must be directly usable as a UI bitmap at the target aspect ratio without baked gameplay affordances. React renders all labels, counts, levels, cards, gems, buttons, hover rings, selection states, and gameplay affordances. Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabet, readable script, fake glyph writing, UI labels, baked icons, baked counters, high glare, white-wash, noisy overlay centers.
```
