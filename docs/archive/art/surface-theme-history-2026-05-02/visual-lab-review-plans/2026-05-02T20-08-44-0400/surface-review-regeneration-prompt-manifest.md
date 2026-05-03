# Visual Lab Surface Review Regeneration Prompt Manifest

Batch: `surface-autonomous-review-regen-candidates`
Date: `2026-05-02T20-08-44-0400`
Source review state: `tmp/visual-lab/surface-review-state.json`

## Scope

Generate only the four marked Visual Lab replacement candidates. Do not overwrite runtime assets and do not replace the accepted unmarked 10-rated Theme slots.

## Global Constraints

- Output clean standalone PNG game assets, not screenshots, mockups, or contact sheets.
- No text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake glyphs, readable script, UI labels, buttons, controls, hover rings, selection states, baked cards, baked gems, or gameplay counters.
- React renders every label, count, icon, level, gem, card, button, hover state, selection ring, and gameplay affordance.
- Preserve each source Theme's material language and palette while replacing only the marked slot.
- Card backs use the `1086x1448` FEATURED_CARD_SAMPLE_SIZE design canvas and must remain readable when downsampled by the app.

## Prompts

### VL-REGEN-2026-05-02-astral-navigator-1-gem-panel

- Style set: `astral-navigator-1`
- Variant: `main`
- Slot: `gem-panel`
- Target: `1254x1254`
- Archive path: `assets/art-library/surface-autonomous-review-regen-candidates/2026-05-02T20-08-44-0400/gem-panel/astral-navigator-1/main/gem-panel.png`
- User review note: the gem panel has a black frame.

Prompt:

Create one exact `1254x1254` PNG replacement candidate for GemDuel Visual Lab. Style set `astral-navigator-1`, variant `main`: polished celestial navigator, luminous astrolabe geometry, blue-white star glass, refined gold linework, clean premium board-game finish. Slot: gem-panel. Replace only this marked slot. Remove the heavy black frame from the current panel; use a lighter integrated celestial metal or blue-white glass border instead. Keep a front-facing orthographic square empty 5x5 board substrate with straight, aligned, evenly spaced grid seams and readable empty wells. No baked gems, click markers, labels, numerals, icons, controls, card slots, or UI. Keep the center calm and gameplay-readable. React renders all labels, counts, levels, gems, buttons, hover rings, selection states, cards, and gameplay affordances. Output a clean single PNG asset only.

### VL-REGEN-2026-05-02-astral-navigator-1-market-card-back-l1

- Style set: `astral-navigator-1`
- Variant: `main`
- Slot: `market-card-back-l1`
- Target: `1086x1448`
- Archive path: `assets/art-library/surface-autonomous-review-regen-candidates/2026-05-02T20-08-44-0400/market-card-back-l1/astral-navigator-1/main/market-card-back-l1.png`
- User review note: L1 is too plain.

Prompt:

Create one exact `1086x1448` PNG replacement candidate for GemDuel Visual Lab. Style set `astral-navigator-1`, variant `main`: polished celestial navigator, luminous astrolabe geometry, blue-white star glass, refined gold linework, clean premium board-game finish. Slot: market card back L1. Replace only this marked slot. The L1 back should remain the lowest tier but must no longer be too plain: include a complete restrained central ornament, subtle astrolabe ring structure, star-glass material, and modest gold trim. It must still be visibly simpler than L2 and L3. No text, numerals, Roman numerals, pips, labels, UI badges, icons, logos, fake glyphs, or readable script. React renders all labels, counts, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Output a clean single PNG asset only.

### VL-REGEN-2026-05-02-aurora-porcelain-court-market-card-back-l2

- Style set: `aurora-porcelain-court`
- Variant: `main`
- Slot: `market-card-back-l2`
- Target: `1086x1448`
- Archive path: `assets/art-library/surface-autonomous-review-regen-candidates/2026-05-02T20-08-44-0400/market-card-back-l2/aurora-porcelain-court/main/market-card-back-l2.png`
- User review note: L2/L3 card backs are too plain; make them slightly more ornate.

Prompt:

Create one exact `1086x1448` PNG replacement candidate for GemDuel Visual Lab. Style set `aurora-porcelain-court`, variant `main`: luminous porcelain court, aurora glass, pale jade and blue-white glaze, refined gold trim, delicate palace ornament, premium board-game finish. Slot: market card back L2. Replace only this marked slot. Make L2 moderately more ornate than the current version while keeping it a mid-tier card back: complete center ornament, richer porcelain-jade trim, aurora glass inlay, more depth and polish than L1, but clearly less luxurious than L3. No text, numerals, Roman numerals, pips, labels, UI badges, icons, logos, fake glyphs, or readable script. L1/L2/L3 should read as one family, with tier shown only through material richness, trim density, glow, and ornament complexity. React renders all labels, counts, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Output a clean single PNG asset only.

### VL-REGEN-2026-05-02-aurora-porcelain-court-market-card-back-l3

- Style set: `aurora-porcelain-court`
- Variant: `main`
- Slot: `market-card-back-l3`
- Target: `1086x1448`
- Archive path: `assets/art-library/surface-autonomous-review-regen-candidates/2026-05-02T20-08-44-0400/market-card-back-l3/aurora-porcelain-court/main/market-card-back-l3.png`
- User review note: L2/L3 card backs are too plain; make them slightly more ornate.

Prompt:

Create one exact `1086x1448` PNG replacement candidate for GemDuel Visual Lab. Style set `aurora-porcelain-court`, variant `main`: luminous porcelain court, aurora glass, pale jade and blue-white glaze, refined gold trim, delicate palace ornament, premium board-game finish. Slot: market card back L3. Replace only this marked slot. Make L3 the highest-tier market card back in this family: complete prestigious center ornament, richer porcelain court frame, aurora glass inlay, stronger jewel density, glow, depth, and gold trim than L2 while staying gameplay-readable. No text, numerals, Roman numerals, pips, labels, UI badges, icons, logos, fake glyphs, or readable script. L1/L2/L3 should read as one family, with tier shown only through material richness, trim density, glow, and ornament complexity. React renders all labels, counts, levels, gems, cards, buttons, hover rings, selection states, and gameplay affordances. Output a clean single PNG asset only.
