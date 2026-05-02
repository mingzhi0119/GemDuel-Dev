# Surface Asset Autonomous Follow-Up Prompt Manifest - 2026-04-27

## Scope

This manifest follows
`docs/art/long-autonomous-surface-asset-generation-codex-prompt-2026-04-27.md`
for two sequential generation rounds. Each round is one complete GemDuel
Surface Theme family with the current 9-slot contract:

- `shell-background.png` at `3840x2160`
- `topbar.png` at `3840x360`
- `player-zone-p1.png` at `1920x520`
- `player-zone-p2.png` at `1920x520`
- `gem-panel.png` at `1254x1254`
- `market-card-back-l1.png` at `1086x1448`
- `market-card-back-l2.png` at `1086x1448`
- `market-card-back-l3.png` at `1086x1448`
- `royal-card-back.png` at `1086x1448`

React renders all gameplay text, labels, counts, cards, gems, hover rings,
selection states, controls, active-player rings, and affordances. All prompts
forbid baked text, numbers, logos, watermarks, fake writing, UI controls, and
slot placeholders.

## Archive Plan

- Round 1 archive root:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-01/`
- Round 2 archive root:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-02/`
- Scoring report:
  `docs/art/surface-asset-autonomous-followup-library-2026-04-27.md`
- Preview manifests:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-01/contact-sheets/preview-manifest.json`
  and
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-02/contact-sheets/preview-manifest.json`

## Shared Geometry And Usability Constraints

- Gem panel hard grid lines: vertical `x=100,305,515,726,938,1141`;
  horizontal `y=104,308,512,717,917,1132`.
- PlayerZone P1 and P2 are side-specific `1920x520` rail substrates. They may
  differ, but the same Theme must read as one style language. P2 may mirror P1.
- PlayerZone art must avoid card frames, card slots, reserved-card silhouettes,
  deck silhouettes, placeholder rectangles, fake controls, labels, and numbers.
- TopBar must preserve quiet readability zones around 25%, 50%, and 75% width.
- Shell background must keep the gameplay center subdued and low-noise.
- L1/L2/L3 card backs must share one family and progress from simple to ornate
  without text, numerals, roman numerals, or level marks.
- Royal card back must read more sovereign/prestige than market backs.

## Round 1: Aurora Porcelain Court

Style slug: `aurora-porcelain-court`

Style direction: moonlit porcelain, jade glass, brushed silver, subtle rose-gold
pins, and restrained aurora refractions. It should feel clear, premium, and
usable in both light and dark UI contexts without becoming a one-note blue or
purple palette.

### APC-SHELL-A

- Slot: `shell-background`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-01/shell-background/aurora-porcelain-court/a/shell-background.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background, exact 3840x2160 PNG. Create a full-board tabletop surface for the Aurora Porcelain Court style: moonlit porcelain slab, jade glass seams, brushed silver rails, subtle rose-gold pins, and faint aurora reflections near the far edges. Composition is a single wide game-table background behind a centered gameplay stage. Keep the center low-noise, matte, and readable for the market, gem board, royal area, and player rails; stronger atmosphere may live at corners and outer edges only. No separate playmat or tablecloth slot. React renders all gameplay UI later. Avoid text, numbers, Chinese, English, roman numerals, logos, watermarks, fake glyphs, readable writing, UI panels, card slots, gem tokens, player markers, and high-glare center wash.
```

### APC-TOPBAR-A

- Slot: `topbar`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-01/topbar/aurora-porcelain-court/a/topbar.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin, exact 3840x360 PNG panoramic strip. Aurora Porcelain Court style: moonlit porcelain, jade glass edging, brushed silver filigree, soft rose-gold pin accents, restrained aurora refractions. Keep the 25%, 50%, and 75% width zones quiet for React score, crown, and turn UI. Ornament belongs at edges, corners, and thin upper/lower trim only; no dominant central object. React renders all labels, counters, icons, and buttons. Avoid text, numbers, Chinese, English, roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked UI controls, and high-glare strips.
```

### APC-PZ1-A

- Slot: `player-zone-p1`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-01/player-zone-p1/aurora-porcelain-court/a/player-zone-p1.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 rail substrate, exact 1920x520 PNG. Aurora Porcelain Court style: porcelain and jade rail with silver trim, subtle rose-gold pin accents, soft aurora edge light. Design for P1's current order: reserved area on the left, resources/tableau in the middle, identity area on the right. Keep all three zones quiet and usable; decorate only outer corners and thin trim. The bitmap is only an environment background behind React content. Avoid text, numbers, Chinese, English, roman numerals, logos, watermarks, fake writing, fake glyphs, card frames, card slots, reserved-card silhouettes, deck silhouettes, gem tokens, counters, labels, active-player rings, buttons, and placeholder rectangles.
```

### APC-PZ2-A

- Slot: `player-zone-p2`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-01/player-zone-p2/aurora-porcelain-court/a/player-zone-p2.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 rail substrate, exact 1920x520 PNG. Same Aurora Porcelain Court family as P1: moonlit porcelain, jade glass, brushed silver, rose-gold pins, restrained aurora glow. Design for P2's current order: identity area on the left, resources/tableau in the middle, reserved area on the right. It may feel like a mirrored companion to P1 but not an identical copy; keep the same style language. Keep React overlay zones calm and readable. Avoid text, numbers, Chinese, English, roman numerals, logos, watermarks, fake writing, fake glyphs, card frames, card slots, reserved-card silhouettes, deck silhouettes, gem tokens, counters, labels, active-player rings, buttons, and placeholder rectangles.
```

### APC-GEM-A

- Slot: `gem-panel`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-01/gem-panel/aurora-porcelain-court/a/gem-panel.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG, front-facing orthographic square. Aurora Porcelain Court style: porcelain empty wells, jade glass divider grooves, brushed silver compact frame, tiny rose-gold accents only on the outer rim. The 5x5 playable grid must visually align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Cells must remain empty, readable, and low-noise for React-rendered gems. Avoid perspective skew, text, numbers, Chinese, English, roman numerals, logos, watermarks, fake glyphs, writing, baked gem tokens, cell icons, click markers, selection rings, oversized borders, and bright flares in cell centers.
```

### APC-L1-A

- Slot: `market-card-back-l1`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-01/market-card-back-l1/aurora-porcelain-court/a/market-card-back-l1.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1, exact 1086x1448 PNG vertical featured-card sample canvas. Aurora Porcelain Court family, visibly lowest tier: simple porcelain card field, thin jade-glass rim, sparse silver trim, very quiet center, minimal rose-gold pin accents. It must share silhouette and material language with L2 and L3 but read as the simplest tier without text or symbols. React renders deck count, level label, hover, and UI. Avoid text, numbers, Chinese, English, roman numerals, level marks, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, badges, card faces, and over-ornate center detail.
```

### APC-L2-A

- Slot: `market-card-back-l2`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-01/market-card-back-l2/aurora-porcelain-court/a/market-card-back-l2.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2, exact 1086x1448 PNG vertical featured-card sample canvas. Aurora Porcelain Court family, visibly mid tier: same silhouette as L1, richer jade glass inner rails, layered brushed silver frame, moderate rose-gold pins, restrained aurora sheen, quiet readable center. More ornament than L1 and clearly less luxurious than L3. React renders all level/count UI. Avoid text, numbers, Chinese, English, roman numerals, level marks, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, badges, card faces, and noisy center detail.
```

### APC-L3-A

- Slot: `market-card-back-l3`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-01/market-card-back-l3/aurora-porcelain-court/a/market-card-back-l3.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3, exact 1086x1448 PNG vertical featured-card sample canvas. Aurora Porcelain Court family, visibly highest market tier: same silhouette as L1 and L2, most luxurious jade glass layering, polished silver frame, controlled aurora halo, tasteful rose-gold pinwork, jewel density highest at borders while the center remains readable. No text-based tier marks. React renders all UI later. Avoid text, numbers, Chinese, English, roman numerals, level marks, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, badges, card faces, and bright center wash.
```

### APC-ROYAL-A

- Slot: `royal-card-back`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-01/royal-card-back/aurora-porcelain-court/a/royal-card-back.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back, exact 1086x1448 PNG vertical featured-card sample canvas. Aurora Porcelain Court sovereign back: porcelain palace material, jade glass crown-like geometry that is abstract and non-text, brushed silver ceremonial frame, rose-gold accents, controlled aurora glow. It should read more prestigious and royal than L1/L2/L3 while remaining usable at 150x200 runtime size. React renders all UI later. Avoid text, numbers, Chinese, English, roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyph writing, baked level marks, badges, labels, and card-face details.
```

## Round 2: Verdant Brass Observatory

Style slug: `verdant-brass-observatory`

Style direction: deep green enamel, aged brass, black walnut, smoky glass,
star-map geometry treated as non-linguistic ornament, and warm lamplight. It
should feel different from the existing anime/crystal/arcane sets while still
staying readable and production-safe.

### VBO-SHELL-A

- Slot: `shell-background`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-02/shell-background/verdant-brass-observatory/a/shell-background.png`

```text
Use case: stylized-concept. Asset type: GemDuel shell background, exact 3840x2160 PNG. Create a full-board tabletop surface for Verdant Brass Observatory: deep green enamel, aged brass seams, black walnut tabletop, smoky glass inlays, and abstract star-map geometry only as non-linguistic material ornament. Keep the center subdued and low-noise for gameplay; stronger brass and observatory atmosphere stays near outer edges and corners. No separate playmat or tablecloth. React renders all game UI later. Avoid text, numbers, Chinese, English, roman numerals, logos, watermarks, readable writing, fake glyphs, UI panels, card slots, gem tokens, player markers, and busy center diagrams.
```

### VBO-TOPBAR-A

- Slot: `topbar`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-02/topbar/verdant-brass-observatory/a/topbar.png`

```text
Use case: stylized-concept. Asset type: GemDuel TopBar skin, exact 3840x360 PNG panoramic strip. Verdant Brass Observatory style: deep green enamel strip, aged brass rails, black walnut edges, smoky glass, warm lamplight, abstract non-text star geometry kept to corners and thin trim. Preserve quiet readable zones around 25%, 50%, and 75% width for React score/crown/turn UI. No dominant central object. React renders all labels, counters, icons, buttons, and text. Avoid text, numbers, Chinese, English, roman numerals, logos, watermarks, readable script, fake glyph writing, baked UI controls, and over-busy center decoration.
```

### VBO-PZ1-A

- Slot: `player-zone-p1`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-02/player-zone-p1/verdant-brass-observatory/a/player-zone-p1.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P1 rail substrate, exact 1920x520 PNG. Verdant Brass Observatory style: green enamel and black walnut rail, aged brass edge trim, smoky glass panels, warm lamplight accents. Design for P1 order: reserved area left, resources/tableau middle, identity area right. Keep those overlay zones calm and readable; use ornament only in thin trims and outer corners. The bitmap is only the background behind React UI. Avoid text, numbers, Chinese, English, roman numerals, logos, watermarks, fake writing, fake glyphs, card frames, card slots, reserved-card silhouettes, deck silhouettes, gem tokens, counters, labels, active-player rings, buttons, and placeholder rectangles.
```

### VBO-PZ2-A

- Slot: `player-zone-p2`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-02/player-zone-p2/verdant-brass-observatory/a/player-zone-p2.png`

```text
Use case: stylized-concept. Asset type: GemDuel PlayerZone P2 rail substrate, exact 1920x520 PNG. Same Verdant Brass Observatory style as P1: green enamel, aged brass, black walnut, smoky glass, warm lamplight. Design for P2 order: identity area left, resources/tableau middle, reserved area right. It may be a mirrored companion to P1 but must preserve the same style language. Keep React overlay zones quiet. Avoid text, numbers, Chinese, English, roman numerals, logos, watermarks, fake writing, fake glyphs, card frames, card slots, reserved-card silhouettes, deck silhouettes, gem tokens, counters, labels, active-player rings, buttons, and placeholder rectangles.
```

### VBO-GEM-A

- Slot: `gem-panel`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-02/gem-panel/verdant-brass-observatory/a/gem-panel.png`

```text
Use case: stylized-concept. Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG, front-facing orthographic square. Verdant Brass Observatory style: dark green enamel empty wells, aged brass divider grooves, compact black walnut outer frame, smoky glass shine only at the rim. The 5x5 grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Cells remain empty and readable for React-rendered gems. Avoid perspective skew, text, numbers, Chinese, English, roman numerals, logos, watermarks, fake glyphs, readable writing, baked gem tokens, cell icons, click markers, selection rings, oversized borders, and busy star charts inside cells.
```

### VBO-L1-A

- Slot: `market-card-back-l1`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-02/market-card-back-l1/verdant-brass-observatory/a/market-card-back-l1.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L1, exact 1086x1448 PNG vertical featured-card sample canvas. Verdant Brass Observatory family, visibly lowest tier: simple deep green enamel field, thin aged brass border, black walnut edge, sparse smoky glass detail, quiet center. It must share the same silhouette and material language with L2 and L3 but remain plainly lowest tier without text or symbols. React renders all level/count UI later. Avoid text, numbers, Chinese, English, roman numerals, level marks, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, badges, card faces, and busy celestial diagrams.
```

### VBO-L2-A

- Slot: `market-card-back-l2`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-02/market-card-back-l2/verdant-brass-observatory/a/market-card-back-l2.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L2, exact 1086x1448 PNG vertical featured-card sample canvas. Verdant Brass Observatory family, visibly mid tier: same silhouette as L1, richer aged brass rails, layered green enamel, moderate smoky glass inlays, subtle non-text star geometry on border only, quiet center. More ornament than L1 and clearly less luxurious than L3. React renders all UI later. Avoid text, numbers, Chinese, English, roman numerals, level marks, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, badges, card faces, and cluttered center.
```

### VBO-L3-A

- Slot: `market-card-back-l3`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-02/market-card-back-l3/verdant-brass-observatory/a/market-card-back-l3.png`

```text
Use case: stylized-concept. Asset type: GemDuel market card back L3, exact 1086x1448 PNG vertical featured-card sample canvas. Verdant Brass Observatory family, visibly highest market tier: same silhouette as L1 and L2, most layered aged brass frame, deep green enamel, smoky glass windows, warm lamplight halo, highest border ornament density while center remains readable. No text-based tier marks. React renders all UI later. Avoid text, numbers, Chinese, English, roman numerals, level marks, logos, watermarks, fake alphabets, readable scripts, fake glyphs, baked UI, badges, card faces, and busy center charts.
```

### VBO-ROYAL-A

- Slot: `royal-card-back`
- Planned archive path:
  `assets/art-library/surface-autonomous-followup-candidates/2026-04-27-round-02/royal-card-back/verdant-brass-observatory/a/royal-card-back.png`

```text
Use case: stylized-concept. Asset type: GemDuel royal card back, exact 1086x1448 PNG vertical featured-card sample canvas. Verdant Brass Observatory sovereign back: deep green enamel, aged brass ceremonial observatory frame, black walnut edge, smoky glass crown-like geometry that is abstract and non-text, warm lamplight and subtle star-map ornament only as decorative material. It must read more prestigious than L1/L2/L3 and remain readable at 150x200 runtime size. React renders all UI later. Avoid text, numbers, Chinese, English, roman numerals, logos, watermarks, fake alphabets, readable scripts, fake glyph writing, baked level marks, badges, labels, and card-face details.
```
