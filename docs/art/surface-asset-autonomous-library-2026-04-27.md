# Surface Asset Autonomous Library - 2026-04-27

## Summary

- Scope: candidate archive and scoring report only; no runtime asset replacement and no code changes.
- Generation method: four worker subagents used the built-in Codex `image_gen` tool only. No CLI/API fallback was used.
- Prompt manifest: `docs/art/surface-asset-autonomous-prompts-2026-04-27.md`.
- Archive root: `assets/art-library/surface-autonomous-candidates/2026-04-27/`.
- Candidate count: 64 archived PNGs, covering 8 slots, 4 styles, and A/B variants.
- Dimension result: all archived PNGs match target dimensions; 51 source outputs were resized or center-cropped into the archive copy.
- Source files remain under `C:\Users\sange\.codex\generated_images`; every candidate row records both source and archive path.

## Top Picks By Slot

| Slot                  | First pick                                       | Backup                                           | Notes                                                                                                                                                                                     |
| --------------------- | ------------------------------------------------ | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shell-background`    | `dark-arcane-shell-background-a` (8.8/10)        | `dark-arcane-shell-background-b` (8.7/10)        | Keep as a strong backup candidate. Archive copy upscaled from 1672x941 to 3840x2160; no crop expected.                                                                                    |
| `topbar`              | `crystal-anime-topbar-a` (7.5/10)                | `crystal-anime-topbar-b` (7.4/10)                | Watchlist; inspect crop/readability before using. Archive copy center-cropped/resized from 1295x1215 to 3840x360; inspect crop before promotion.                                          |
| `player-zone`         | `dark-arcane-player-zone-a` (7.4/10)             | `dark-arcane-player-zone-b` (7.3/10)             | Watchlist; inspect crop/readability before using. Archive copy center-cropped/resized from 1942x809 to 3840x520; inspect crop before promotion.                                           |
| `gem-panel`           | `clean-boardgame-gem-panel-a` (9.0/10)           | `clean-boardgame-gem-panel-b` (8.9/10)           | Shortlist for human review. Use as GemPanel substrate candidate; verify 5x5 grid alignment against live gem centers.                                                                      |
| `market-card-back-l1` | `clean-boardgame-market-card-back-l1-b` (8.5/10) | `dark-arcane-market-card-back-l1-a` (8.3/10)     | Keep as a strong backup candidate. Use as L1 market card-back candidate; compare set coherence with L2/L3 at 150x200 display.                                                             |
| `market-card-back-l2` | `clean-boardgame-market-card-back-l2-a` (8.2/10) | `clean-boardgame-market-card-back-l2-b` (8.2/10) | Watchlist; inspect crop/readability before using. Archive copy resized from 1086x1449 to 1086x1448; no crop expected. Worker reported source dimension mismatch; archive copy normalized. |
| `market-card-back-l3` | `crystal-anime-market-card-back-l3-a` (8.8/10)   | `crystal-anime-market-card-back-l3-b` (8.6/10)   | Shortlist for human review. Archive copy resized from 1086x1449 to 1086x1448; no crop expected.                                                                                           |
| `royal-card-back`     | `royal-luxury-royal-card-back-b` (9.0/10)        | `royal-luxury-royal-card-back-a` (8.9/10)        | Shortlist for human review. Use as RoyalCourt card-back candidate; verify sovereign read without overpowering Royal UI.                                                                   |

## Candidate Counts

| Group                      | Count |
| -------------------------- | ----: |
| Style `royal-luxury`       |    16 |
| Style `clean-boardgame`    |    16 |
| Style `crystal-anime`      |    16 |
| Style `dark-arcane`        |    16 |
| Slot `shell-background`    |     8 |
| Slot `topbar`              |     8 |
| Slot `player-zone`         |     8 |
| Slot `gem-panel`           |     8 |
| Slot `market-card-back-l1` |     8 |
| Slot `market-card-back-l2` |     8 |
| Slot `market-card-back-l3` |     8 |
| Slot `royal-card-back`     |     8 |

## Contact Sheets And Preview

- HTML preview page: `assets/art-library/surface-autonomous-candidates/2026-04-27/contact-sheets/index.html`
- Preview manifest: `assets/art-library/surface-autonomous-candidates/2026-04-27/contact-sheets/preview-manifest.json`
- Contact sheet: `assets/art-library/surface-autonomous-candidates/2026-04-27/contact-sheets/style-royal-luxury.png`
- Contact sheet: `assets/art-library/surface-autonomous-candidates/2026-04-27/contact-sheets/style-clean-boardgame.png`
- Contact sheet: `assets/art-library/surface-autonomous-candidates/2026-04-27/contact-sheets/style-crystal-anime.png`
- Contact sheet: `assets/art-library/surface-autonomous-candidates/2026-04-27/contact-sheets/style-dark-arcane.png`
- Contact sheet: `assets/art-library/surface-autonomous-candidates/2026-04-27/contact-sheets/slot-shell-background.png`
- Contact sheet: `assets/art-library/surface-autonomous-candidates/2026-04-27/contact-sheets/slot-topbar.png`
- Contact sheet: `assets/art-library/surface-autonomous-candidates/2026-04-27/contact-sheets/slot-player-zone.png`
- Contact sheet: `assets/art-library/surface-autonomous-candidates/2026-04-27/contact-sheets/slot-gem-panel.png`
- Contact sheet: `assets/art-library/surface-autonomous-candidates/2026-04-27/contact-sheets/slot-market-card-back-l1.png`
- Contact sheet: `assets/art-library/surface-autonomous-candidates/2026-04-27/contact-sheets/slot-market-card-back-l2.png`
- Contact sheet: `assets/art-library/surface-autonomous-candidates/2026-04-27/contact-sheets/slot-market-card-back-l3.png`
- Contact sheet: `assets/art-library/surface-autonomous-candidates/2026-04-27/contact-sheets/slot-royal-card-back.png`

## Watchlist

| Candidate                            | Reason                                                                                                                                                            |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `royal-luxury-topbar-a`              | Archive copy center-cropped/resized from 1295x1214 to 3840x360; inspect crop before promotion.                                                                    |
| `royal-luxury-topbar-b`              | Archive copy center-cropped/resized from 1295x1215 to 3840x360; inspect crop before promotion.                                                                    |
| `royal-luxury-player-zone-a`         | Archive copy center-cropped/resized from 2084x754 to 3840x520; inspect crop before promotion.                                                                     |
| `royal-luxury-player-zone-b`         | Archive copy center-cropped/resized from 2069x760 to 3840x520; inspect crop before promotion.                                                                     |
| `royal-luxury-market-card-back-l1-a` | Archive copy upscaled from 1085x1449 to 1086x1448; no crop expected.                                                                                              |
| `royal-luxury-market-card-back-l1-b` | Archive copy upscaled from 1085x1449 to 1086x1448; no crop expected.                                                                                              |
| `clean-boardgame-topbar-a`           | Archive copy center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Worker reported source dimension mismatch; archive copy normalized. |
| `clean-boardgame-topbar-b`           | Archive copy center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Worker reported source dimension mismatch; archive copy normalized. |
| `clean-boardgame-player-zone-a`      | Archive copy center-cropped/resized from 2149x732 to 3840x520; inspect crop before promotion. Worker reported source dimension mismatch; archive copy normalized. |
| `clean-boardgame-player-zone-b`      | Archive copy center-cropped/resized from 2086x754 to 3840x520; inspect crop before promotion. Worker reported source dimension mismatch; archive copy normalized. |
| `crystal-anime-topbar-a`             | Archive copy center-cropped/resized from 1295x1215 to 3840x360; inspect crop before promotion.                                                                    |
| `crystal-anime-topbar-b`             | Archive copy center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion.                                                                     |
| `crystal-anime-player-zone-a`        | Archive copy center-cropped/resized from 1971x798 to 3840x520; inspect crop before promotion.                                                                     |
| `crystal-anime-player-zone-b`        | Archive copy center-cropped/resized from 1942x809 to 3840x520; inspect crop before promotion.                                                                     |
| `dark-arcane-topbar-a`               | Archive copy center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion.                                                                     |
| `dark-arcane-topbar-b`               | Archive copy center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion.                                                                     |
| `dark-arcane-player-zone-a`          | Archive copy center-cropped/resized from 1942x809 to 3840x520; inspect crop before promotion.                                                                     |
| `dark-arcane-player-zone-b`          | Archive copy center-cropped/resized from 2087x753 to 3840x520; inspect crop before promotion.                                                                     |
| `dark-arcane-market-card-back-l1-b`  | Archive copy upscaled from 1085x1449 to 1086x1448; no crop expected.                                                                                              |

## Candidate Index

| Slot               | Style          | Variant | Prompt ID                         | Prompt                                                                 | Source file | Archive path | Source dimensions | Target dimensions | Normalization | Score | Recommended use | Risk | Pick advice |
| ------------------ | -------------- | ------- | --------------------------------- | ---------------------------------------------------------------------- | ----------- | ------------ | ----------------- | ----------------- | ------------- | ----: | --------------- | ---- | ----------- |
| `shell-background` | `royal-luxury` | `a`     | `royal-luxury-shell-background-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept |

Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Royal Luxury full-board table surface for GemDuel. This is the only large shell background behind the centered gameplay stage, not a separate playmat or tablecloth.
Scene/backdrop: deep palace tabletop made from blackened metal, burnished gold trim, dark lacquer, and restrained crown-court materials.
Style/medium: premium game UI illustration, high-end tabletop surface, polished but low-noise.
Composition/framing: 16:9 full-board background, centered gameplay area remains subdued and readable; stronger atmosphere and ornament may sit near edges, corners, and outer border only.
Lighting/mood: controlled dark royal contrast, soft edge highlights, no high-glare wash.
Constraints: React renders all gameplay UI, cards, labels, counts, gems, buttons, hover rings, and overlays. Keep the center calm enough for the scaled gameplay shell.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, card slots, deck silhouettes, baked controls, busy center, separate playmat rectangle.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b0e2-7801-9369-cfbb604d5a3b\ig_08e6a74ae3fc15200169eef2ceaaa0819191d34ee6e1a40f68.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/royal-luxury/a/shell-background.png` | 1672x941 | 3840x2160 | resized from 1672x941 to 3840x2160 | 8.3 | Use as full-board shell background candidate; review center calmness before runtime promotion. | Archive copy upscaled from 1672x941 to 3840x2160; no crop expected. | Keep as a strong backup candidate. |
| `shell-background` | `royal-luxury` | `b` | `royal-luxury-shell-background-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create an alternate Royal Luxury full-board table surface for GemDuel with a quieter middle and more ceremonial edge framing.
Scene/backdrop: black palace table, antique gold inlay, subtle crown-court motifs on the perimeter, dark velvet-metal material depth.
Style/medium: premium fantasy board-game UI background, restrained royal ornament.
Composition/framing: 16:9 front-facing table surface, low-noise center for the gameplay stage; edge and corner decoration only, no separate panel shape in the middle.
Lighting/mood: dark, legible, refined, controlled gold rim light.
Constraints: React renders all labels, counts, icons, cards, gameplay affordances, and overlays. The bitmap must remain a background surface only.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, card slots, deck silhouettes, controls, high-glare center, fake playmat border.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b0e2-7801-9369-cfbb604d5a3b\ig_08e6a74ae3fc15200169eef33522b48191bab2e0aa50a60f16.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/royal-luxury/b/shell-background.png` | 1672x941 | 3840x2160 | resized from 1672x941 to 3840x2160 | 8.2 | Use as full-board shell background candidate; review center calmness before runtime promotion. | Archive copy upscaled from 1672x941 to 3840x2160; no crop expected. | Watchlist; inspect crop/readability before using. |
| `topbar` | `royal-luxury` | `a` | `royal-luxury-topbar-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Royal Luxury panoramic header strip for the 120px logical TopBar.
Scene/backdrop: burnished gold palace trim, dark lacquered metal, subtle crown-court accents.
Style/medium: premium game UI strip, sharp material polish, restrained ornament.
Composition/framing: ultra-wide header strip with quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament belongs at edges, corners, and thin borders.
Lighting/mood: controlled dark gold contrast, no central glare.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, badge shapes, central object blocking overlay zones.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b0e2-7801-9369-cfbb604d5a3b\ig_08e6a74ae3fc15200169eef37fa0748191b30767ce5a2b766c.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/topbar/royal-luxury/a/topbar.png` | 1295x1214 | 3840x360 | center-cropped and resized from 1295x1214 to 3840x360 | 7.1 | Use as TopBar skin candidate; verify React score/crown/turn readability over 25%, 50%, and 75% zones. | Archive copy center-cropped/resized from 1295x1214 to 3840x360; inspect crop before promotion. | Watchlist; inspect crop/readability before using. |
| `topbar` | `royal-luxury` | `b` | `royal-luxury-topbar-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create an alternate Royal Luxury panoramic header strip with darker court-metal materials and very quiet overlay bands.
Scene/backdrop: blackened steel, antique gold filigree on the border, subtle crown material language at far edges.
Style/medium: premium tabletop UI header, clean and readable.
Composition/framing: ultra-wide strip; keep score/crown/turn readable zones at 25%, 50%, and 75% width subdued. Decoration stays at extreme edges and thin border rails.
Lighting/mood: low-glare dark royal mood, crisp gold edge light.
Constraints: React renders all labels, counts, scores, icons, controls, and turn UI later.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, central medallion, bright wash.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b0e2-7801-9369-cfbb604d5a3b\ig_08e6a74ae3fc15200169eef3bcd9348191862125dad505005b.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/topbar/royal-luxury/b/topbar.png` | 1295x1215 | 3840x360 | center-cropped and resized from 1295x1215 to 3840x360 | 7.0 | Use as TopBar skin candidate; verify React score/crown/turn readability over 25%, 50%, and 75% zones. | Archive copy center-cropped/resized from 1295x1215 to 3840x360; inspect crop before promotion. | Watchlist; inspect crop/readability before using. |
| `player-zone` | `royal-luxury` | `a` | `royal-luxury-player-zone-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Royal Luxury ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: dark palace rail, black lacquer, burnished gold trim, subtle crown-court materials.
Style/medium: premium game UI environment rail, elegant and restrained.
Composition/framing: ultra-wide horizontal band with quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration only near extreme edges, corners, and thin top/bottom borders.
Lighting/mood: dark readable gold accents, no bright wash.
Constraints: React renders all cards, labels, counters, inventory gems, badges, controls, rings, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels, counters.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b0e2-7801-9369-cfbb604d5a3b\ig_08e6a74ae3fc15200169eef3f306a08191b261e5b6acd73f3a.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/player-zone/royal-luxury/a/player-zone.png` | 2084x754 | 3840x520 | center-cropped and resized from 2084x754 to 3840x520 | 7.0 | Use as PlayerZone skin candidate; verify no baked card-slot reads and both P1/P2 anchoring. | Archive copy center-cropped/resized from 2084x754 to 3840x520; inspect crop before promotion. | Watchlist; inspect crop/readability before using. |
| `player-zone` | `royal-luxury` | `b` | `royal-luxury-player-zone-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create an alternate Royal Luxury player rail with a cleaner center and stronger ceremonial outer edge trim.
Scene/backdrop: blackened court-metal rail, antique gold edge inlay, dark premium tabletop material.
Style/medium: polished board-game UI rail, luxurious but practical.
Composition/framing: ultra-wide band, left and right anchoring compatible. Keep all functional center bands calm; push detail to corners, edge trim, and far side ornaments.
Lighting/mood: controlled gold rim light, dark readable center.
Constraints: React renders player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked card frames, card slots, deck silhouettes, UI controls, labels, numbers, placeholder rectangles.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b0e2-7801-9369-cfbb604d5a3b\ig_08e6a74ae3fc15200169eef42548548191a4fc0f0cfb6be208.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/player-zone/royal-luxury/b/player-zone.png` | 2069x760 | 3840x520 | center-cropped and resized from 2069x760 to 3840x520 | 7.0 | Use as PlayerZone skin candidate; verify no baked card-slot reads and both P1/P2 anchoring. | Archive copy center-cropped/resized from 2069x760 to 3840x520; inspect crop before promotion. | Watchlist; inspect crop/readability before using. |
| `gem-panel` | `royal-luxury` | `a` | `royal-luxury-gem-panel-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Royal Luxury square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: dark palace tabletop panel, burnished gold trim, blackened metal, restrained crown-court materials on the outer frame.
Style/medium: premium board-game UI panel, high-contrast royal metal, polished bevels.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact outer frame.
Lighting/mood: controlled edge highlights, readable center, no overexposure.
Constraints: React renders all gems, labels, counts, levels, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked gems, cell icons, click markers, selection rings, oversized border, noisy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b0e2-7801-9369-cfbb604d5a3b\ig_08e6a74ae3fc15200169eef4579e6c8191b74207048728e9b0.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/gem-panel/royal-luxury/a/gem-panel.png` | 1254x1254 | 1254x1254 | none | 8.7 | Use as GemPanel substrate candidate; verify 5x5 grid alignment against live gem centers. | No dimension normalization risk recorded. | Keep as a strong backup candidate. |
| `gem-panel` | `royal-luxury` | `b` | `royal-luxury-gem-panel-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create an alternate Royal Luxury square 5x5 gem board panel with darker court-metal frame and very low-noise cell wells.
Scene/backdrop: black steel, antique gold inlay, subtle crown-court accents in corners and outer rim only.
Style/medium: premium fantasy board-game component, crisp bevels and material depth.
Composition/framing: orthographic square panel. Align dividers to x=100,305,515,726,938,1141 and y=104,308,512,717,917,1132. Keep the 5x5 cells empty and readable, with no large border drift.
Lighting/mood: dark high contrast, soft gold edge light, calm center.
Constraints: React renders all gameplay gems, labels, counts, click states, and selection effects.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked gems, symbols inside cells, click markers, oversized margins, busy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b0e2-7801-9369-cfbb604d5a3b\ig_08e6a74ae3fc15200169eef4a0430c8191b0d2776b2190c873.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/gem-panel/royal-luxury/b/gem-panel.png` | 1254x1254 | 1254x1254 | none | 8.6 | Use as GemPanel substrate candidate; verify 5x5 grid alignment against live gem centers. | No dimension normalization risk recorded. | Keep as a strong backup candidate. |
| `market-card-back-l1` | `royal-luxury` | `a` | `royal-luxury-market-card-back-l1-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier Royal Luxury market card back. It must belong to the same L1/L2/L3 set but look simpler than L2 and L3.
Scene/backdrop: dark royal card back with modest black lacquer, restrained gold trim, simple court-material motif.
Style/medium: premium vertical card-back illustration, clean symmetrical frame.
Composition/framing: full vertical card back with shared set silhouette, readable blank center, modest ornament density. No text or level marks; tier is communicated only through simpler material richness.
Lighting/mood: controlled dark gold, low glare, readable at 150x200 runtime display.
Constraints: React renders all labels, counts, levels, card UI, and deck count overlays. This is a 1086x1448 source canvas for downsampled display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, gems, controls, high-noise center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b0e2-7801-9369-cfbb604d5a3b\ig_08e6a74ae3fc15200169eef4e7c9308191a18dbfaa11e48d3d.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l1/royal-luxury/a/market-card-back-l1.png` | 1085x1449 | 1086x1448 | resized from 1085x1449 to 1086x1448 | 7.9 | Use as L1 market card-back candidate; compare set coherence with L2/L3 at 150x200 display. | Archive copy upscaled from 1085x1449 to 1086x1448; no crop expected. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l1` | `royal-luxury` | `b` | `royal-luxury-market-card-back-l1-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create an alternate lowest-tier Royal Luxury market card back, simple and restrained, coherent with richer L2/L3 siblings.
Scene/backdrop: blackened court metal, plain gold border, subtle crown-court material hints without symbols or labels.
Style/medium: premium game card back, symmetrical, low ornament.
Composition/framing: vertical card back, shared set silhouette and frame language, open calm center, fewer jewels and weaker glow than higher tiers.
Lighting/mood: dark royal, soft edge highlights, readable after downsampling to 150x200.
Constraints: React renders all market deck labels, level text, counts, and UI states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI elements, baked gems, busy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b0e2-7801-9369-cfbb604d5a3b\ig_08e6a74ae3fc15200169eef537a7648191a06d892a46dbddfd.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l1/royal-luxury/b/market-card-back-l1.png` | 1085x1449 | 1086x1448 | resized from 1085x1449 to 1086x1448 | 7.8 | Use as L1 market card-back candidate; compare set coherence with L2/L3 at 150x200 display. | Archive copy upscaled from 1085x1449 to 1086x1448; no crop expected. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l2` | `royal-luxury` | `a` | `royal-luxury-market-card-back-l2-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier Royal Luxury market card back. It must match the L1/L3 set while showing more ornament and prestige than L1 but less than L3.
Scene/backdrop: dark palace card back, richer gold trim, medium jewel inlay, polished court-metal frame.
Style/medium: premium vertical card-back illustration, symmetrical fantasy board-game asset.
Composition/framing: shared card-back silhouette and frame language; readable center; moderate ornament density and glow. No text or numeric level indicators.
Lighting/mood: controlled amber-gold prestige, not overbright.
Constraints: React renders all market labels, counts, levels, and overlays. Candidate must remain legible at 150x200 display size.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, controls, noisy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b0e2-7801-9369-cfbb604d5a3b\ig_08e6a74ae3fc15200169eef578f5508191bd3e486de4963f5a.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l2/royal-luxury/a/market-card-back-l2.png` | 1085x1449 | 1086x1448 | resized from 1085x1449 to 1086x1448 | 8.1 | Use as L2 market card-back candidate; compare mid-tier progression without text or numerals. | Archive copy upscaled from 1085x1449 to 1086x1448; no crop expected. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l2` | `royal-luxury` | `b` | `royal-luxury-market-card-back-l2-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create an alternate mid-tier Royal Luxury market card back, coherent with L1/L3 and visibly medium prestige.
Scene/backdrop: antique gold and black steel card back, medium court ornament, refined inlay without writing.
Style/medium: premium game-card back, symmetrical, polished.
Composition/framing: vertical card back, shared set silhouette, modestly ornate border, readable center. More detailed than L1 and clearly less luxurious than L3.
Lighting/mood: warm controlled gold light, low glare.
Constraints: React renders all text, level labels, counts, and hover states. Image is source art for a 150x200 display box.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI elements, card labels, baked gems, over-busy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b0e2-7801-9369-cfbb604d5a3b\ig_08e6a74ae3fc15200169eef5cbb1d08191a1e8ff09b02579e7.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l2/royal-luxury/b/market-card-back-l2.png` | 1086x1449 | 1086x1448 | resized from 1086x1449 to 1086x1448 | 8.2 | Use as L2 market card-back candidate; compare mid-tier progression without text or numerals. | Archive copy resized from 1086x1449 to 1086x1448; no crop expected. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l3` | `royal-luxury` | `a` | `royal-luxury-market-card-back-l3-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier Royal Luxury market card back. It must match the L1/L2 set while looking most luxurious.
Scene/backdrop: sovereign dark palace card back, rich gold filigree, jewel accents, prestigious court-metal frame.
Style/medium: premium vertical card-back illustration, ornate but readable, high-tier fantasy board-game asset.
Composition/framing: shared card-back silhouette and frame language; strongest ornament at border and corners, readable center, no text or level marks. Tier progression comes from trim richness, jewel density, and stronger glow.
Lighting/mood: deep royal gold with controlled prestige glow, no white wash.
Constraints: React renders all labels, counts, levels, and UI overlays. Must remain legible at 150x200 runtime display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, controls, illegible clutter.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b0e2-7801-9369-cfbb604d5a3b\ig_08e6a74ae3fc15200169eef6266518819198a3d7bb3ed640b3.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l3/royal-luxury/a/market-card-back-l3.png` | 1086x1449 | 1086x1448 | resized from 1086x1449 to 1086x1448 | 8.6 | Use as L3 market card-back candidate; compare highest-tier prestige at 150x200 display. | Archive copy resized from 1086x1449 to 1086x1448; no crop expected. | Keep as a strong backup candidate. |
| `market-card-back-l3` | `royal-luxury` | `b` | `royal-luxury-market-card-back-l3-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create an alternate highest-tier Royal Luxury market card back, most prestigious in the L1/L2/L3 set.
Scene/backdrop: black lacquer, antique gold, dense royal inlay, jewel-like corner accents, sovereign court materials.
Style/medium: ornate premium card-back art, symmetrical and polished.
Composition/framing: vertical card back, same set silhouette as lower tiers, richest trim and glow, readable blank center, no textual tier indicator.
Lighting/mood: controlled dramatic royal glow, high prestige but not overexposed.
Constraints: React renders all labels, counts, level text, and deck UI. Source canvas is 1086x1448 and downsampled into 150x200 display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, excessive clutter.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b0e2-7801-9369-cfbb604d5a3b\ig_08e6a74ae3fc15200169eef675742c8191a29a8849696629c3.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l3/royal-luxury/b/market-card-back-l3.png` | 1086x1449 | 1086x1448 | resized from 1086x1449 to 1086x1448 | 8.5 | Use as L3 market card-back candidate; compare highest-tier prestige at 150x200 display. | Archive copy resized from 1086x1449 to 1086x1448; no crop expected. | Keep as a strong backup candidate. |
| `royal-card-back` | `royal-luxury` | `a` | `royal-luxury-royal-card-back-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create a sovereign Royal Luxury card back for RoyalCourt previews, stronger royal identity than market backs.
Scene/backdrop: dark palace sovereignty, crown-court materials, burnished gold, blackened steel, jewel-like prestige accents.
Style/medium: premium royal card-back illustration, ornate symmetrical frame.
Composition/framing: full vertical card back with a powerful sovereign identity, ornate frame, readable center, no baked gameplay UI.
Lighting/mood: deep royal prestige, controlled glow, not washed out.
Constraints: React renders all RoyalCourt labels, card data, UI states, and overlays. This is source art for featured-card downsampling.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, level marks, baked gems, controls, illegible detail.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b0e2-7801-9369-cfbb604d5a3b\ig_08e6a74ae3fc15200169eef6d2ad488191be6a44407fd41559.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/royal-card-back/royal-luxury/a/royal-card-back.png` | 1086x1449 | 1086x1448 | resized from 1086x1449 to 1086x1448 | 8.9 | Use as RoyalCourt card-back candidate; verify sovereign read without overpowering Royal UI. | Archive copy resized from 1086x1449 to 1086x1448; no crop expected. | Shortlist for human review. |
| `royal-card-back` | `royal-luxury` | `b` | `royal-luxury-royal-card-back-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create an alternate sovereign Royal Luxury card back with the clearest premium RoyalCourt identity.
Scene/backdrop: black palace metal, antique gold frame, ceremonial crown-court motifs as material design, jewel-accented border.
Style/medium: premium fantasy card back, polished, symmetrical, more prestigious than market backs.
Composition/framing: full vertical card back, powerful royal frame and calm center, no text or level marks.
Lighting/mood: controlled dark gold, regal and readable at 150x200 display.
Constraints: React renders all UI labels, card details, counts, and overlay states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, baked gems, controls, high-noise center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b0e2-7801-9369-cfbb604d5a3b\ig_08e6a74ae3fc15200169eef72da0088191b6b50a4f52eb6878.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/royal-card-back/royal-luxury/b/royal-card-back.png` | 1086x1448 | 1086x1448 | none | 9.0 | Use as RoyalCourt card-back candidate; verify sovereign read without overpowering Royal UI. | No dimension normalization risk recorded. | Shortlist for human review. |
| `shell-background` | `clean-boardgame` | `a` | `clean-boardgame-shell-background-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Clean Boardgame full-board table surface for GemDuel. This is the only large shell background behind the centered gameplay stage.
Scene/backdrop: modern premium tabletop, matte stone, satin metal, restrained brass or ivory trim.
Style/medium: practical board-game UI illustration, low noise, production-readable.
Composition/framing: 16:9 full-board table surface with subdued center for the gameplay shell and slightly stronger material detail around edges and corners. No separate playmat or center panel.
Lighting/mood: calm studio lighting, readable in both dark and light app contexts, no glare.
Constraints: React renders all gameplay UI, cards, labels, counts, gems, controls, hover rings, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, card slots, baked controls, gray overlay panels, busy center, separate playmat rectangle.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b123-79d1-95fe-ae8bb8deaa23\ig_09779cdb37432f460169eef2cd984c8191a18ef401134a17a3.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/clean-boardgame/a/shell-background.png` | 1672x941 | 3840x2160 | resized from 1672x941 to 3840x2160 | 8.5 | Use as full-board shell background candidate; review center calmness before runtime promotion. | Archive copy upscaled from 1672x941 to 3840x2160; no crop expected. Worker reported source dimension mismatch; archive copy normalized. | Keep as a strong backup candidate. |
| `shell-background` | `clean-boardgame` | `b` | `clean-boardgame-shell-background-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create an alternate Clean Boardgame full-board surface with warmer tabletop materials and a quiet center.
Scene/backdrop: premium matte stone table, subtle slate separators, thin bronze or ivory material accents.
Style/medium: modern board-game UI background, restrained and useful.
Composition/framing: full 16:9 tabletop surface; center stays low-contrast for the game stage; edge trim and material variation around perimeter only.
Lighting/mood: calm neutral light, subtle shadows, no high-glare or white wash.
Constraints: React renders all gameplay pieces, cards, labels, buttons, counts, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, card slots, baked controls, playmat rectangle, noisy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b123-79d1-95fe-ae8bb8deaa23\ig_09779cdb37432f460169eef31b598881919e65ef1c86a75fbc.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/clean-boardgame/b/shell-background.png` | 1672x941 | 3840x2160 | resized from 1672x941 to 3840x2160 | 8.4 | Use as full-board shell background candidate; review center calmness before runtime promotion. | Archive copy upscaled from 1672x941 to 3840x2160; no crop expected. Worker reported source dimension mismatch; archive copy normalized. | Keep as a strong backup candidate. |
| `topbar` | `clean-boardgame` | `a` | `clean-boardgame-topbar-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Clean Boardgame panoramic header strip for the 120px logical TopBar.
Scene/backdrop: matte stone and satin metal UI strip, restrained brass trim, neutral tabletop materials.
Style/medium: modern premium board-game UI header, low-noise and readable.
Composition/framing: ultra-wide strip with quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Ornament remains at edges, corners, and thin borders.
Lighting/mood: practical neutral contrast, soft shadows, no glare.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, central badge, noisy overlay zones.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b123-79d1-95fe-ae8bb8deaa23\ig_09779cdb37432f460169eef33fec088191b9bd59f37345ae1d.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/topbar/clean-boardgame/a/topbar.png` | 2048x768 | 3840x360 | center-cropped and resized from 2048x768 to 3840x360 | 7.1 | Use as TopBar skin candidate; verify React score/crown/turn readability over 25%, 50%, and 75% zones. | Archive copy center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Worker reported source dimension mismatch; archive copy normalized. | Watchlist; inspect crop/readability before using. |
| `topbar` | `clean-boardgame` | `b` | `clean-boardgame-topbar-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create an alternate Clean Boardgame TopBar strip with warmer premium tabletop material.
Scene/backdrop: matte ivory stone, subtle slate rail, thin bronze edge trim.
Style/medium: clean board-game UI strip, practical and restrained.
Composition/framing: ultra-wide horizontal strip; keep 25%, 50%, and 75% overlay zones quiet. Decoration only along border rails and far corners.
Lighting/mood: calm neutral light, readable without bright wash.
Constraints: React renders all labels, score, crown, turn state, buttons, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, central emblem, busy patterns.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b123-79d1-95fe-ae8bb8deaa23\ig_09779cdb37432f460169eef3655578819199a5a448f149e9c2.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/topbar/clean-boardgame/b/topbar.png` | 2048x768 | 3840x360 | center-cropped and resized from 2048x768 to 3840x360 | 7.0 | Use as TopBar skin candidate; verify React score/crown/turn readability over 25%, 50%, and 75% zones. | Archive copy center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. Worker reported source dimension mismatch; archive copy normalized. | Watchlist; inspect crop/readability before using. |
| `player-zone` | `clean-boardgame` | `a` | `clean-boardgame-player-zone-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Clean Boardgame ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: matte stone player rail, satin metal dividers, restrained brass or ivory material trim.
Style/medium: modern practical game UI rail, low noise, readable.
Composition/framing: ultra-wide band with quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration limited to edges, corners, and top/bottom trim.
Lighting/mood: soft neutral lighting, no glare, high foreground readability.
Constraints: React renders all cards, labels, counters, inventory gems, badges, controls, rings, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b123-79d1-95fe-ae8bb8deaa23\ig_09779cdb37432f460169eef38ee18481919eaa833238506398.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/player-zone/clean-boardgame/a/player-zone.png` | 2149x732 | 3840x520 | center-cropped and resized from 2149x732 to 3840x520 | 7.0 | Use as PlayerZone skin candidate; verify no baked card-slot reads and both P1/P2 anchoring. | Archive copy center-cropped/resized from 2149x732 to 3840x520; inspect crop before promotion. Worker reported source dimension mismatch; archive copy normalized. | Watchlist; inspect crop/readability before using. |
| `player-zone` | `clean-boardgame` | `b` | `clean-boardgame-player-zone-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create an alternate Clean Boardgame player rail with warm tabletop material and very clear overlay bands.
Scene/backdrop: matte ivory and slate rail, thin bronze trim, practical tabletop surface.
Style/medium: clean modern board-game UI asset, minimal and polished.
Composition/framing: ultra-wide band compatible with left and right anchoring. Keep functional center areas flat and quiet; edge and corner details only.
Lighting/mood: calm neutral brightness, no white wash, readable under dark and light UI.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked card frames, card slots, deck silhouettes, controls, labels, placeholder rectangles.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b123-79d1-95fe-ae8bb8deaa23\ig_09779cdb37432f460169eef3bce39c8191b6fcc3ff37989f4e.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/player-zone/clean-boardgame/b/player-zone.png` | 2086x754 | 3840x520 | center-cropped and resized from 2086x754 to 3840x520 | 7.0 | Use as PlayerZone skin candidate; verify no baked card-slot reads and both P1/P2 anchoring. | Archive copy center-cropped/resized from 2086x754 to 3840x520; inspect crop before promotion. Worker reported source dimension mismatch; archive copy normalized. | Watchlist; inspect crop/readability before using. |
| `gem-panel` | `clean-boardgame` | `a` | `clean-boardgame-gem-panel-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Clean Boardgame square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: premium matte stone and satin metal board component, restrained brass or ivory trim.
Style/medium: modern board-game UI panel, low-noise, highly readable.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; compact frame.
Lighting/mood: soft studio light, subtle bevel shadows, practical contrast.
Constraints: React renders all gems, labels, counts, levels, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked gems, cell icons, click markers, selection rings, oversized frame, busy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b123-79d1-95fe-ae8bb8deaa23\ig_09779cdb37432f460169eef3e709d08191b24fa520ec498774.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/gem-panel/clean-boardgame/a/gem-panel.png` | 1254x1254 | 1254x1254 | none | 9.0 | Use as GemPanel substrate candidate; verify 5x5 grid alignment against live gem centers. | No dimension normalization risk recorded. | Shortlist for human review. |
| `gem-panel` | `clean-boardgame` | `b` | `clean-boardgame-gem-panel-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create an alternate Clean Boardgame square 5x5 gem board panel with warmer materials and exact cell alignment.
Scene/backdrop: matte ivory stone wells, subtle slate separators, thin bronze edge trim.
Style/medium: clean modern board-game component, practical UI readability, low noise.
Composition/framing: orthographic square board. Align dividers to x=100,305,515,726,938,1141 and y=104,308,512,717,917,1132. The 5x5 cells must remain empty and readable.
Lighting/mood: calm neutral light, subtle shadows, no dramatic glare.
Constraints: React renders all gems, labels, counts, hover rings, click markers, and selection states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked gems, cell symbols, selection markers, oversized border, busy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b123-79d1-95fe-ae8bb8deaa23\ig_09779cdb37432f460169eef420a3708191b51a3003a5e823d4.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/gem-panel/clean-boardgame/b/gem-panel.png` | 1254x1254 | 1254x1254 | none | 8.9 | Use as GemPanel substrate candidate; verify 5x5 grid alignment against live gem centers. | No dimension normalization risk recorded. | Shortlist for human review. |
| `market-card-back-l1` | `clean-boardgame` | `a` | `clean-boardgame-market-card-back-l1-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier Clean Boardgame market card back. It must belong to the same L1/L2/L3 set but look simpler than L2 and L3.
Scene/backdrop: matte tabletop card back, simple stone and satin metal frame, restrained trim.
Style/medium: clean premium card-back illustration, practical and symmetrical.
Composition/framing: vertical card back with shared set silhouette, readable blank center, minimal ornament. No text or level marks; tier is shown only by simpler material richness.
Lighting/mood: calm neutral contrast, readable after downsampling to 150x200.
Constraints: React renders market deck labels, levels, counts, and UI overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, controls, noisy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b123-79d1-95fe-ae8bb8deaa23\ig_09779cdb37432f460169eef44e23f4819197aa31bee0cbe053.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l1/clean-boardgame/a/market-card-back-l1.png` | 1085x1449 | 1086x1448 | resized from 1085x1449 to 1086x1448 | 8.2 | Use as L1 market card-back candidate; compare set coherence with L2/L3 at 150x200 display. | Archive copy upscaled from 1085x1449 to 1086x1448; no crop expected. Worker reported source dimension mismatch; archive copy normalized. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l1` | `clean-boardgame` | `b` | `clean-boardgame-market-card-back-l1-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create an alternate lowest-tier Clean Boardgame market card back, simple and low-noise, coherent with richer L2/L3 siblings.
Scene/backdrop: clean slate card back, thin bronze or ivory border, matte material center.
Style/medium: modern board-game card back, symmetrical, restrained.
Composition/framing: full vertical card back, shared silhouette and frame language, open center, fewer accents than higher tiers.
Lighting/mood: neutral, readable, low glare.
Constraints: React renders all level labels, counts, text, and UI states. Source canvas downscales into a 150x200 display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI elements, baked gems, busy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b123-79d1-95fe-ae8bb8deaa23\ig_09779cdb37432f460169eef474b824819183c38daa6c614d4f.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l1/clean-boardgame/b/market-card-back-l1.png` | 1086x1448 | 1086x1448 | none | 8.5 | Use as L1 market card-back candidate; compare set coherence with L2/L3 at 150x200 display. | No dimension normalization risk recorded. | Keep as a strong backup candidate. |
| `market-card-back-l2` | `clean-boardgame` | `a` | `clean-boardgame-market-card-back-l2-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier Clean Boardgame market card back. It must match the L1/L3 set while showing more ornament than L1 and less than L3.
Scene/backdrop: premium matte stone card back, satin metal border, medium brass or ivory trim.
Style/medium: modern premium card-back illustration, symmetrical and practical.
Composition/framing: vertical card back with shared set silhouette, readable center, moderate ornament density. No text or numeric level indicators.
Lighting/mood: soft neutral contrast, slight prestige highlight, not overbright.
Constraints: React renders all market labels, levels, counts, and overlays. Must remain readable at 150x200.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, controls, noisy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b123-79d1-95fe-ae8bb8deaa23\ig_09779cdb37432f460169eef4bebd4c8191a2bd76649e9aa51b.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l2/clean-boardgame/a/market-card-back-l2.png` | 1086x1449 | 1086x1448 | resized from 1086x1449 to 1086x1448 | 8.2 | Use as L2 market card-back candidate; compare mid-tier progression without text or numerals. | Archive copy resized from 1086x1449 to 1086x1448; no crop expected. Worker reported source dimension mismatch; archive copy normalized. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l2` | `clean-boardgame` | `b` | `clean-boardgame-market-card-back-l2-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create an alternate mid-tier Clean Boardgame market card back, visibly medium prestige within the L1/L2/L3 set.
Scene/backdrop: matte ivory and slate materials, medium bronze trim, refined board-game frame.
Style/medium: clean premium card-back art, symmetrical, readable.
Composition/framing: same set silhouette as L1/L3; moderate border detail, calm center, no textual tier indicator.
Lighting/mood: calm neutral light, low glare.
Constraints: React renders all labels, counts, levels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, over-busy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b123-79d1-95fe-ae8bb8deaa23\ig_09779cdb37432f460169eef4f7706c8191a7c529e07968d875.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l2/clean-boardgame/b/market-card-back-l2.png` | 1086x1449 | 1086x1448 | resized from 1086x1449 to 1086x1448 | 8.2 | Use as L2 market card-back candidate; compare mid-tier progression without text or numerals. | Archive copy resized from 1086x1449 to 1086x1448; no crop expected. Worker reported source dimension mismatch; archive copy normalized. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l3` | `clean-boardgame` | `a` | `clean-boardgame-market-card-back-l3-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier Clean Boardgame market card back. It must match the L1/L2 set while looking most luxurious.
Scene/backdrop: premium modern tabletop card back, rich satin metal, refined brass trim, polished matte stone.
Style/medium: high-tier clean board-game card back, symmetrical, practical.
Composition/framing: shared card-back silhouette and frame language; richest border detail and accents; readable center; no text or level marks.
Lighting/mood: controlled premium highlight, not white-washed.
Constraints: React renders labels, counts, level text, and overlays. Must remain readable at 150x200.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, controls, illegible clutter.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b123-79d1-95fe-ae8bb8deaa23\ig_09779cdb37432f460169eef52eafa081918d5a3218dc1c04ca.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l3/clean-boardgame/a/market-card-back-l3.png` | 1085x1449 | 1086x1448 | resized from 1085x1449 to 1086x1448 | 8.2 | Use as L3 market card-back candidate; compare highest-tier prestige at 150x200 display. | Archive copy upscaled from 1085x1449 to 1086x1448; no crop expected. Worker reported source dimension mismatch; archive copy normalized. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l3` | `clean-boardgame` | `b` | `clean-boardgame-market-card-back-l3-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create an alternate highest-tier Clean Boardgame market card back, most premium in the L1/L2/L3 set.
Scene/backdrop: polished slate and ivory card back, rich bronze trim, refined premium tabletop material.
Style/medium: clean ornate card-back art, symmetrical and readable.
Composition/framing: full vertical card back, same set silhouette, highest trim density and material richness, calm center, no textual tier indicator.
Lighting/mood: premium controlled light, readable after downsampling.
Constraints: React renders all labels, counts, levels, and UI states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, excessive clutter.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b123-79d1-95fe-ae8bb8deaa23\ig_09779cdb37432f460169eef57f2d3c8191a3f3722b0407cec5.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l3/clean-boardgame/b/market-card-back-l3.png` | 1086x1449 | 1086x1448 | resized from 1086x1449 to 1086x1448 | 8.3 | Use as L3 market card-back candidate; compare highest-tier prestige at 150x200 display. | Archive copy resized from 1086x1449 to 1086x1448; no crop expected. Worker reported source dimension mismatch; archive copy normalized. | Keep as a strong backup candidate. |
| `royal-card-back` | `clean-boardgame` | `a` | `clean-boardgame-royal-card-back-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create a Clean Boardgame sovereign card back for RoyalCourt previews, more prestigious than market backs while staying practical.
Scene/backdrop: premium matte stone, refined satin metal, restrained royal-court material language without text.
Style/medium: clean premium royal card-back illustration, symmetrical and polished.
Composition/framing: full vertical prestige card back with ornate frame and readable calm center, stronger identity than market backs.
Lighting/mood: neutral premium contrast, subtle highlight, no glare.
Constraints: React renders all RoyalCourt labels, card data, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, level marks, baked gems, controls, illegible detail.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b123-79d1-95fe-ae8bb8deaa23\ig_09779cdb37432f460169eef5d018188191bc37f39f8d040f34.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/royal-card-back/clean-boardgame/a/royal-card-back.png` | 1085x1449 | 1086x1448 | resized from 1085x1449 to 1086x1448 | 8.3 | Use as RoyalCourt card-back candidate; verify sovereign read without overpowering Royal UI. | Archive copy upscaled from 1085x1449 to 1086x1448; no crop expected. Worker reported source dimension mismatch; archive copy normalized. | Keep as a strong backup candidate. |
| `royal-card-back` | `clean-boardgame` | `b` | `clean-boardgame-royal-card-back-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create an alternate Clean Boardgame royal card back with clear sovereign identity and practical readability.
Scene/backdrop: matte ivory stone, polished slate, refined bronze trim, subtle court prestige materials.
Style/medium: premium board-game royal card back, symmetrical, restrained.
Composition/framing: full vertical card back, ornate but clean frame, calm center, no text or level marks.
Lighting/mood: calm premium light, readable at 150x200 display.
Constraints: React renders all UI labels, card details, counts, and overlay states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, baked gems, controls, high-noise center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b123-79d1-95fe-ae8bb8deaa23\ig_09779cdb37432f460169eef628c92081918de17865ed11e616.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/royal-card-back/clean-boardgame/b/royal-card-back.png` | 1085x1449 | 1086x1448 | resized from 1085x1449 to 1086x1448 | 8.2 | Use as RoyalCourt card-back candidate; verify sovereign read without overpowering Royal UI. | Archive copy upscaled from 1085x1449 to 1086x1448; no crop expected. Worker reported source dimension mismatch; archive copy normalized. | Watchlist; inspect crop/readability before using. |
| `shell-background` | `crystal-anime` | `a` | `crystal-anime-shell-background-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Crystal Anime full-board table surface for GemDuel. This is the only large shell background behind the centered gameplay stage.
Scene/backdrop: dark gemstone tabletop, translucent crystal edge materials, prismatic glass accents around perimeter.
Style/medium: controlled anime UI illustration, crisp crystal facets, premium game surface.
Composition/framing: 16:9 full-board background. Center remains subdued and low-noise for gameplay; stronger crystal atmosphere may sit near edges and corners. No separate playmat or central panel.
Lighting/mood: cyan, pearl, and violet highlights over a readable dark base; no overexposure.
Constraints: React renders all gameplay UI, cards, labels, counts, gems, buttons, hover rings, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, card slots, controls, baked gems, noisy center, separate playmat rectangle.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b16d-78c3-b34e-ed57bcaa23e1\ig_0fe01881605a1ba20169eef2cec36481918e7a4f644a1877d5.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/crystal-anime/a/shell-background.png` | 1672x941 | 3840x2160 | resized from 1672x941 to 3840x2160 | 8.3 | Use as full-board shell background candidate; review center calmness before runtime promotion. | Archive copy upscaled from 1672x941 to 3840x2160; no crop expected. | Keep as a strong backup candidate. |
| `shell-background` | `crystal-anime` | `b` | `crystal-anime-shell-background-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create an alternate Crystal Anime full-board surface with darker transparent facets and an especially calm center.
Scene/backdrop: smoky crystal table, frosted glass edge structures, delicate prismatic perimeter light.
Style/medium: anime-inspired premium UI background, refined and readable.
Composition/framing: full 16:9 tabletop surface; low-noise center for the game shell; facets and glow concentrated at edges and corners.
Lighting/mood: controlled violet-cyan glow, dark readable middle, no central haze.
Constraints: React renders all gameplay pieces, labels, buttons, counts, cards, gems, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, card slots, controls, baked gems, playmat rectangle, bright center flare.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b16d-78c3-b34e-ed57bcaa23e1\ig_0fe01881605a1ba20169eef31f5c4081918d1fabfae0207208.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/crystal-anime/b/shell-background.png` | 1672x941 | 3840x2160 | resized from 1672x941 to 3840x2160 | 8.2 | Use as full-board shell background candidate; review center calmness before runtime promotion. | Archive copy upscaled from 1672x941 to 3840x2160; no crop expected. | Watchlist; inspect crop/readability before using. |
| `topbar` | `crystal-anime` | `a` | `crystal-anime-topbar-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Crystal Anime panoramic header strip for the 120px logical TopBar.
Scene/backdrop: translucent gemstone rail, prismatic glass, crisp crystal facets, readable dark base.
Style/medium: anime game UI header strip, energetic but controlled.
Composition/framing: ultra-wide strip with quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Crystal detail belongs at edges, corners, and thin borders.
Lighting/mood: controlled cyan and violet highlights, no central glare.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, central object, bright wash over overlay zones.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b16d-78c3-b34e-ed57bcaa23e1\ig_0fe01881605a1ba20169eef34d3d808191a15a5f167cfda151.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/topbar/crystal-anime/a/topbar.png` | 1295x1215 | 3840x360 | center-cropped and resized from 1295x1215 to 3840x360 | 7.5 | Use as TopBar skin candidate; verify React score/crown/turn readability over 25%, 50%, and 75% zones. | Archive copy center-cropped/resized from 1295x1215 to 3840x360; inspect crop before promotion. | Watchlist; inspect crop/readability before using. |
| `topbar` | `crystal-anime` | `b` | `crystal-anime-topbar-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create an alternate Crystal Anime TopBar strip with darker crystal facets and clean overlay lanes.
Scene/backdrop: smoky translucent crystal, frosted prismatic border, dark glass base.
Style/medium: controlled anime UI strip, refined and readable.
Composition/framing: ultra-wide header; keep 25%, 50%, and 75% zones quiet for React overlays; detail only in border rails and far corners.
Lighting/mood: subtle violet-cyan rim glow, readable center zones.
Constraints: React renders all labels, score, crown, turn state, buttons, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, counters, central emblem, bright flare.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b16d-78c3-b34e-ed57bcaa23e1\ig_0fe01881605a1ba20169eef38fc7c48191ab9a8076b940d5fa.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/topbar/crystal-anime/b/topbar.png` | 2048x768 | 3840x360 | center-cropped and resized from 2048x768 to 3840x360 | 7.4 | Use as TopBar skin candidate; verify React score/crown/turn readability over 25%, 50%, and 75% zones. | Archive copy center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. | Watchlist; inspect crop/readability before using. |
| `player-zone` | `crystal-anime` | `a` | `crystal-anime-player-zone-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Crystal Anime ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: dark crystal rail, translucent facets, prismatic edge trim, subtle anime glow.
Style/medium: premium anime game UI environment rail, vivid but practical.
Composition/framing: ultra-wide band with quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration only near extreme edges, corners, and thin top/bottom borders.
Lighting/mood: controlled cyan and pearl glow, no white wash.
Constraints: React renders all cards, labels, counters, inventory gems, badges, controls, rings, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b16d-78c3-b34e-ed57bcaa23e1\ig_0fe01881605a1ba20169eef3ae4c2c8191bbd3c0b5faf91110.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/player-zone/crystal-anime/a/player-zone.png` | 1971x798 | 3840x520 | center-cropped and resized from 1971x798 to 3840x520 | 7.0 | Use as PlayerZone skin candidate; verify no baked card-slot reads and both P1/P2 anchoring. | Archive copy center-cropped/resized from 1971x798 to 3840x520; inspect crop before promotion. | Watchlist; inspect crop/readability before using. |
| `player-zone` | `crystal-anime` | `b` | `crystal-anime-player-zone-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create an alternate Crystal Anime player rail with darker transparent facets and very clean functional lanes.
Scene/backdrop: smoky crystal rail, frosted glass surface, prismatic edge decoration.
Style/medium: anime-inspired UI rail, polished, low visual noise.
Composition/framing: ultra-wide band compatible with left and right anchoring; calm center areas for React-rendered gameplay items; edge/corner detail only.
Lighting/mood: restrained violet-cyan glow, readable dark base.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked card frames, card slots, deck silhouettes, controls, labels, placeholder rectangles, bright center flares.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b16d-78c3-b34e-ed57bcaa23e1\ig_0fe01881605a1ba20169eef3dd1f488191aff0acc702bd7e8e.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/player-zone/crystal-anime/b/player-zone.png` | 1942x809 | 3840x520 | center-cropped and resized from 1942x809 to 3840x520 | 7.0 | Use as PlayerZone skin candidate; verify no baked card-slot reads and both P1/P2 anchoring. | Archive copy center-cropped/resized from 1942x809 to 3840x520; inspect crop before promotion. | Watchlist; inspect crop/readability before using. |
| `gem-panel` | `crystal-anime` | `a` | `crystal-anime-gem-panel-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Crystal Anime square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: translucent crystal board substrate, glassy facets in the outer frame, subtle gem-like refractions around edges only.
Style/medium: controlled anime UI light effects, crisp crystal facets, premium game board illustration.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only.
Lighting/mood: soft cyan and pearl highlights, controlled glow, not overexposed.
Constraints: React renders all gems, labels, counts, levels, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked gems, cell icons, click markers, selection rings, bright cell-center flares, noisy center, oversized border.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b16d-78c3-b34e-ed57bcaa23e1\ig_0fe01881605a1ba20169eef407fbc48191839fc9863f315666.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/gem-panel/crystal-anime/a/gem-panel.png` | 1254x1254 | 1254x1254 | none | 8.6 | Use as GemPanel substrate candidate; verify 5x5 grid alignment against live gem centers. | No dimension normalization risk recorded. | Keep as a strong backup candidate. |
| `gem-panel` | `crystal-anime` | `b` | `crystal-anime-gem-panel-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create an alternate Crystal Anime square 5x5 gem board panel with darker transparent facets and exact cell alignment.
Scene/backdrop: cool smoky crystal frame, frosted empty wells, delicate prismatic edges outside the cells.
Style/medium: anime-inspired crystal UI, refined and readable, low visual noise.
Composition/framing: orthographic square board. Align dividers to x=100,305,515,726,938,1141 and y=104,308,512,717,917,1132. The 5x5 cells must remain empty and calm.
Lighting/mood: controlled violet-cyan glow, subdued center.
Constraints: React renders all gems, labels, counts, hover rings, click markers, and selection states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, baked gems, cell symbols, selection markers, intense glow in cell centers, large empty margins.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b16d-78c3-b34e-ed57bcaa23e1\ig_0fe01881605a1ba20169eef45262408191aa45cb9141e7c3d5.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/gem-panel/crystal-anime/b/gem-panel.png` | 1254x1254 | 1254x1254 | none | 8.5 | Use as GemPanel substrate candidate; verify 5x5 grid alignment against live gem centers. | No dimension normalization risk recorded. | Keep as a strong backup candidate. |
| `market-card-back-l1` | `crystal-anime` | `a` | `crystal-anime-market-card-back-l1-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier Crystal Anime market card back. It must belong to the same L1/L2/L3 set but look simpler than L2 and L3.
Scene/backdrop: dark crystal card back, simple translucent frame, subtle prismatic edge accents.
Style/medium: anime gemstone card-back illustration, clean symmetrical frame.
Composition/framing: full vertical card back with shared set silhouette, readable blank center, modest ornament density. No text or level marks; tier is communicated only through simpler material richness.
Lighting/mood: controlled cyan and pearl glow, readable after downsampling to 150x200.
Constraints: React renders market deck labels, levels, counts, and UI overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, controls, noisy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b16d-78c3-b34e-ed57bcaa23e1\ig_0fe01881605a1ba20169eef49cf7c08191b9b06928d8c44515.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l1/crystal-anime/a/market-card-back-l1.png` | 1086x1449 | 1086x1448 | resized from 1086x1449 to 1086x1448 | 8.1 | Use as L1 market card-back candidate; compare set coherence with L2/L3 at 150x200 display. | Archive copy resized from 1086x1449 to 1086x1448; no crop expected. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l1` | `crystal-anime` | `b` | `crystal-anime-market-card-back-l1-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create an alternate lowest-tier Crystal Anime market card back, simple and restrained, coherent with richer L2/L3 siblings.
Scene/backdrop: smoky crystal card back, plain glass border, subtle prismatic material hints without symbols or labels.
Style/medium: premium anime game card back, symmetrical, low ornament.
Composition/framing: vertical card back, shared set silhouette and frame language, open calm center, fewer facets and weaker glow than higher tiers.
Lighting/mood: dark crystal, soft edge highlights, readable after downsampling to 150x200.
Constraints: React renders all market deck labels, level text, counts, and UI states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI elements, baked gems, busy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b16d-78c3-b34e-ed57bcaa23e1\ig_0fe01881605a1ba20169eef4c843c88191a27b96ab667ed027.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l1/crystal-anime/b/market-card-back-l1.png` | 1086x1448 | 1086x1448 | none | 8.2 | Use as L1 market card-back candidate; compare set coherence with L2/L3 at 150x200 display. | No dimension normalization risk recorded. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l2` | `crystal-anime` | `a` | `crystal-anime-market-card-back-l2-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier Crystal Anime market card back. It must match the L1/L3 set while showing more ornament than L1 and less than L3.
Scene/backdrop: dark gemstone card back, medium prismatic trim, translucent crystal frame.
Style/medium: anime gemstone vertical card-back illustration, symmetrical and polished.
Composition/framing: shared card-back silhouette and frame language; readable center; moderate facet density and glow. No text or numeric level indicators.
Lighting/mood: controlled cyan-violet prestige, not overbright.
Constraints: React renders all market labels, counts, levels, and overlays. Must remain legible at 150x200 display size.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, controls, noisy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b16d-78c3-b34e-ed57bcaa23e1\ig_0fe01881605a1ba20169eef50636fc8191a0907c823857ec4c.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l2/crystal-anime/a/market-card-back-l2.png` | 1085x1449 | 1086x1448 | resized from 1085x1449 to 1086x1448 | 8.1 | Use as L2 market card-back candidate; compare mid-tier progression without text or numerals. | Archive copy upscaled from 1085x1449 to 1086x1448; no crop expected. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l2` | `crystal-anime` | `b` | `crystal-anime-market-card-back-l2-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create an alternate mid-tier Crystal Anime market card back, visibly medium prestige within the L1/L2/L3 set.
Scene/backdrop: smoky translucent crystal, medium frame facets, refined prismatic border.
Style/medium: anime crystal card-back art, symmetrical and readable.
Composition/framing: same set silhouette as L1/L3; moderate border detail, calm center, no textual tier indicator.
Lighting/mood: restrained violet-cyan glow, low glare.
Constraints: React renders all labels, counts, levels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, over-busy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b16d-78c3-b34e-ed57bcaa23e1\ig_0fe01881605a1ba20169eef54f71548191b6a9fa15983e8aee.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l2/crystal-anime/b/market-card-back-l2.png` | 1086x1449 | 1086x1448 | resized from 1086x1449 to 1086x1448 | 8.2 | Use as L2 market card-back candidate; compare mid-tier progression without text or numerals. | Archive copy resized from 1086x1449 to 1086x1448; no crop expected. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l3` | `crystal-anime` | `a` | `crystal-anime-market-card-back-l3-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier Crystal Anime market card back. It must match the L1/L2 set while looking most luxurious.
Scene/backdrop: deep jewel card back, rich crystal facets, prismatic glass, high-tier indigo and violet accents.
Style/medium: premium anime card-back illustration, ornate but readable.
Composition/framing: shared card-back silhouette and frame language; strongest ornament at border and corners, readable center, no text or level marks. Tier progression comes from richer facets, glow strength, and jewel density.
Lighting/mood: controlled indigo-violet prestige glow, no white wash.
Constraints: React renders labels, counts, level text, and overlays. Must remain readable at 150x200 display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, controls, illegible clutter.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b16d-78c3-b34e-ed57bcaa23e1\ig_0fe01881605a1ba20169eef594ed04819188fc49dfff93d40d.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l3/crystal-anime/a/market-card-back-l3.png` | 1086x1449 | 1086x1448 | resized from 1086x1449 to 1086x1448 | 8.8 | Use as L3 market card-back candidate; compare highest-tier prestige at 150x200 display. | Archive copy resized from 1086x1449 to 1086x1448; no crop expected. | Shortlist for human review. |
| `market-card-back-l3` | `crystal-anime` | `b` | `crystal-anime-market-card-back-l3-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create an alternate highest-tier Crystal Anime market card back, most premium in the L1/L2/L3 set.
Scene/backdrop: smoky dark crystal, rich violet-indigo facets, dense prismatic border, jewel-corner accents.
Style/medium: ornate anime card-back art, symmetrical and polished.
Composition/framing: full vertical card back, same set silhouette, highest trim density and material richness, calm center, no textual tier indicator.
Lighting/mood: premium controlled crystal glow, readable after downsampling.
Constraints: React renders all labels, counts, levels, and UI states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, level marks, UI labels, baked gems, excessive clutter.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b16d-78c3-b34e-ed57bcaa23e1\ig_0fe01881605a1ba20169eef5d7212881919638dd34658a7654.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l3/crystal-anime/b/market-card-back-l3.png` | 1085x1449 | 1086x1448 | resized from 1085x1449 to 1086x1448 | 8.6 | Use as L3 market card-back candidate; compare highest-tier prestige at 150x200 display. | Archive copy upscaled from 1085x1449 to 1086x1448; no crop expected. | Keep as a strong backup candidate. |
| `royal-card-back` | `crystal-anime` | `a` | `crystal-anime-royal-card-back-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create a Crystal Anime sovereign card back for RoyalCourt previews, more prestigious than market backs.
Scene/backdrop: dark gemstone sovereignty, prismatic crystal crown-like material language, rich jewel accents without text.
Style/medium: premium anime royal card-back illustration, ornate symmetrical frame.
Composition/framing: full vertical prestige card back with powerful royal identity, ornate frame, readable calm center.
Lighting/mood: deep jewel prestige, controlled glow, not washed out.
Constraints: React renders all RoyalCourt labels, card data, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, level marks, baked gems, controls, illegible detail.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b16d-78c3-b34e-ed57bcaa23e1\ig_0fe01881605a1ba20169eef6150b708191b1823a118eaa2707.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/royal-card-back/crystal-anime/a/royal-card-back.png` | 1086x1449 | 1086x1448 | resized from 1086x1449 to 1086x1448 | 8.7 | Use as RoyalCourt card-back candidate; verify sovereign read without overpowering Royal UI. | Archive copy resized from 1086x1449 to 1086x1448; no crop expected. | Keep as a strong backup candidate. |
| `royal-card-back` | `crystal-anime` | `b` | `crystal-anime-royal-card-back-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create an alternate Crystal Anime royal card back with clear sovereign identity and stronger prestige than market backs.
Scene/backdrop: smoky jewel glass, violet-indigo crystal frame, ceremonial prismatic material language.
Style/medium: premium anime royal card back, symmetrical, luminous but readable.
Composition/framing: full vertical card back, ornate crystal frame and calm center, no text or level marks.
Lighting/mood: controlled crystal prestige glow, readable at 150x200 display.
Constraints: React renders all UI labels, card details, counts, and overlay states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, UI labels, baked gems, controls, high-noise center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b16d-78c3-b34e-ed57bcaa23e1\ig_0fe01881605a1ba20169eef65e478481918503f51724332bec.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/royal-card-back/crystal-anime/b/royal-card-back.png` | 1086x1448 | 1086x1448 | none | 8.8 | Use as RoyalCourt card-back candidate; verify sovereign read without overpowering Royal UI. | No dimension normalization risk recorded. | Keep as a strong backup candidate. |
| `shell-background` | `dark-arcane` | `a` | `dark-arcane-shell-background-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create a Dark Arcane full-board table surface for GemDuel. This is the only large shell background behind the centered gameplay stage.
Scene/backdrop: dark magical card table, obsidian stone, dark brass, restrained non-linguistic geometry around perimeter only.
Style/medium: premium fantasy game UI background, arcane but practical.
Composition/framing: 16:9 full-board table surface with subdued low-noise center; stronger atmosphere may sit near edges and corners. No separate playmat or central panel.
Lighting/mood: deep shadow, muted violet and ember edge light, no central haze.
Constraints: React renders all gameplay UI, cards, labels, counts, gems, buttons, hover rings, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, UI labels, card slots, controls, baked gems, busy center, separate playmat rectangle.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b1b1-7922-a576-be8eea30b7c2\ig_06ad108dbab82e610169eef2d213dc8191a9b5e1259bb4d633.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/dark-arcane/a/shell-background.png` | 1672x941 | 3840x2160 | resized from 1672x941 to 3840x2160 | 8.8 | Use as full-board shell background candidate; review center calmness before runtime promotion. | Archive copy upscaled from 1672x941 to 3840x2160; no crop expected. | Keep as a strong backup candidate. |
| `shell-background` | `dark-arcane` | `b` | `dark-arcane-shell-background-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel shell background UI asset, exact 3840x2160 PNG.
Primary request: create an alternate Dark Arcane full-board surface with cleaner dark tabletop materials and a quiet center.
Scene/backdrop: charcoal stone table, dark brass edge rails, subtle magical aura outside the central gameplay area.
Style/medium: restrained arcane board-game UI background, polished and readable.
Composition/framing: full 16:9 tabletop surface; center stays low-contrast for the game stage; abstract non-text geometry only near perimeter.
Lighting/mood: quiet dark ambience, subtle rim glow, no central fog.
Constraints: React renders all gameplay pieces, labels, buttons, counts, cards, gems, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, UI labels, card slots, controls, baked gems, playmat rectangle, excessive glow.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b1b1-7922-a576-be8eea30b7c2\ig_06ad108dbab82e610169eef32c82b88191a05a440fcd957d8f.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/shell-background/dark-arcane/b/shell-background.png` | 1672x941 | 3840x2160 | resized from 1672x941 to 3840x2160 | 8.7 | Use as full-board shell background candidate; review center calmness before runtime promotion. | Archive copy upscaled from 1672x941 to 3840x2160; no crop expected. | Keep as a strong backup candidate. |
| `topbar` | `dark-arcane` | `a` | `dark-arcane-topbar-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create a Dark Arcane panoramic header strip for the 120px logical TopBar.
Scene/backdrop: obsidian header rail, dark brass trim, subtle abstract non-linguistic geometry at border only.
Style/medium: premium fantasy game UI header, arcane but readable.
Composition/framing: ultra-wide strip with quiet readable zones around 25%, 50%, and 75% width for React-rendered score, crown, and turn UI. Detail belongs at edges, corners, and thin borders.
Lighting/mood: dim violet and ember edge glow, no central haze.
Constraints: React renders all TopBar text, scores, crowns, buttons, turn counts, labels, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, UI labels, counters, central object, bright overlay zones.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b1b1-7922-a576-be8eea30b7c2\ig_06ad108dbab82e610169eef35f15548191ba881423765e8681.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/topbar/dark-arcane/a/topbar.png` | 2048x768 | 3840x360 | center-cropped and resized from 2048x768 to 3840x360 | 7.1 | Use as TopBar skin candidate; verify React score/crown/turn readability over 25%, 50%, and 75% zones. | Archive copy center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. | Watchlist; inspect crop/readability before using. |
| `topbar` | `dark-arcane` | `b` | `dark-arcane-topbar-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel TopBar skin UI asset, exact 3840x360 PNG.
Primary request: create an alternate Dark Arcane TopBar strip with cleaner dark stone and strong readable overlay lanes.
Scene/backdrop: charcoal stone rail, dark brass separators, subtle magical edge aura.
Style/medium: restrained arcane UI strip, practical and polished.
Composition/framing: ultra-wide header; keep 25%, 50%, and 75% zones quiet for React overlays; abstract geometry only in border rails and far corners.
Lighting/mood: subtle violet and ember rim glow, no overbright center.
Constraints: React renders all labels, score, crown, turn state, buttons, and icons.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, UI labels, counters, central emblem, busy patterns.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b1b1-7922-a576-be8eea30b7c2\ig_06ad108dbab82e610169eef3885810819187f731296a8c76e1.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/topbar/dark-arcane/b/topbar.png` | 2048x768 | 3840x360 | center-cropped and resized from 2048x768 to 3840x360 | 7.0 | Use as TopBar skin candidate; verify React score/crown/turn readability over 25%, 50%, and 75% zones. | Archive copy center-cropped/resized from 2048x768 to 3840x360; inspect crop before promotion. | Watchlist; inspect crop/readability before using. |
| `player-zone` | `dark-arcane` | `a` | `dark-arcane-player-zone-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create a Dark Arcane ultra-wide player rail that works when anchored left for P1 or right for P2.
Scene/backdrop: obsidian player rail, charcoal stone, dark brass trim, restrained magical edge aura.
Style/medium: premium fantasy game UI environment rail, dark and practical.
Composition/framing: ultra-wide band with quiet center lanes for card stacks, reserved cards, inventory gems, counters, badges, and active-player rings. Decoration only near extreme edges, corners, and thin top/bottom borders.
Lighting/mood: deep shadow, subtle violet and ember rim glow, readable center.
Constraints: React renders all cards, labels, counters, inventory gems, badges, controls, rings, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, baked card frames, card slots, deck silhouettes, placeholder rectangles, controls, labels.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b1b1-7922-a576-be8eea30b7c2\ig_06ad108dbab82e610169eef3b37fac819188fef9aa4adb757f.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/player-zone/dark-arcane/a/player-zone.png` | 1942x809 | 3840x520 | center-cropped and resized from 1942x809 to 3840x520 | 7.4 | Use as PlayerZone skin candidate; verify no baked card-slot reads and both P1/P2 anchoring. | Archive copy center-cropped/resized from 1942x809 to 3840x520; inspect crop before promotion. | Watchlist; inspect crop/readability before using. |
| `player-zone` | `dark-arcane` | `b` | `dark-arcane-player-zone-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel PlayerZone rail UI asset, exact 3840x520 PNG.
Primary request: create an alternate Dark Arcane player rail with cleaner dark tabletop material and very calm functional lanes.
Scene/backdrop: charcoal stone rail, dark brass separators, subtle magical aura outside gameplay lanes.
Style/medium: restrained arcane UI rail, polished, low visual noise.
Composition/framing: ultra-wide band compatible with left and right anchoring; calm center areas for React-rendered gameplay items; edge/corner detail only.
Lighting/mood: quiet dark ambience, subtle rim glow, strong readability.
Constraints: React renders all player cards, reserved cards, gems, counts, badges, controls, active rings, labels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, baked card frames, card slots, deck silhouettes, controls, labels, placeholder rectangles, excessive glow.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b1b1-7922-a576-be8eea30b7c2\ig_06ad108dbab82e610169eef3e4b3f48191b8dc2fcc942cad64.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/player-zone/dark-arcane/b/player-zone.png` | 2087x753 | 3840x520 | center-cropped and resized from 2087x753 to 3840x520 | 7.3 | Use as PlayerZone skin candidate; verify no baked card-slot reads and both P1/P2 anchoring. | Archive copy center-cropped/resized from 2087x753 to 3840x520; inspect crop before promotion. | Watchlist; inspect crop/readability before using. |
| `gem-panel` | `dark-arcane` | `a` | `dark-arcane-gem-panel-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create a Dark Arcane square 5x5 gem board panel with strict GemDuel geometry.
Scene/backdrop: dark magical table panel, obsidian stone, muted metal dividers, very subtle non-linguistic geometric accents only on the outer frame.
Style/medium: premium fantasy UI panel, arcane but practical, low-noise center.
Composition/framing: perfectly front-facing orthographic square board. The 5x5 playable grid must visibly align to vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only.
Lighting/mood: deep shadow, restrained violet and ember edge light, no central haze.
Constraints: React renders all gems, labels, counts, levels, hover effects, click affordances, and selection highlights.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, baked gems, symbols inside cells, click markers, busy center, oversized border.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b1b1-7922-a576-be8eea30b7c2\ig_06ad108dbab82e610169eef40453008191843496c8a5eba421.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/gem-panel/dark-arcane/a/gem-panel.png` | 1254x1254 | 1254x1254 | none | 8.6 | Use as GemPanel substrate candidate; verify 5x5 grid alignment against live gem centers. | No dimension normalization risk recorded. | Keep as a strong backup candidate. |
| `gem-panel` | `dark-arcane` | `b` | `dark-arcane-gem-panel-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel gem-panel board substrate, exact 1254x1254 PNG.
Primary request: create an alternate Dark Arcane square 5x5 gem board panel with cleaner dark tabletop and exact cell geometry.
Scene/backdrop: charcoal stone, dark brass separators, subtle magical aura outside the 5x5 grid, abstract non-text geometry on the rim only.
Style/medium: restrained arcane board-game UI asset, polished but not ornate.
Composition/framing: orthographic square board. Align dividers to x=100,305,515,726,938,1141 and y=104,308,512,717,917,1132. Keep the 5x5 cells empty and readable.
Lighting/mood: quiet dark ambience, subtle rim glow, strong readability.
Constraints: React renders all gems, labels, counts, hover rings, click markers, and selection states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, baked gems, symbols in cells, selection markers, excessive glow, large dead edges.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b1b1-7922-a576-be8eea30b7c2\ig_06ad108dbab82e610169eef45144148191a10d55380a7ea042.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/gem-panel/dark-arcane/b/gem-panel.png` | 1254x1254 | 1254x1254 | none | 8.5 | Use as GemPanel substrate candidate; verify 5x5 grid alignment against live gem centers. | No dimension normalization risk recorded. | Keep as a strong backup candidate. |
| `market-card-back-l1` | `dark-arcane` | `a` | `dark-arcane-market-card-back-l1-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create the lowest-tier Dark Arcane market card back. It must belong to the same L1/L2/L3 set but look simpler than L2 and L3.
Scene/backdrop: dark obsidian card back, simple brass border, subtle non-linguistic geometry as material texture only.
Style/medium: premium fantasy card-back illustration, clean symmetrical frame.
Composition/framing: full vertical card back with shared set silhouette, readable blank center, modest ornament density. No text or level marks; tier is communicated only through simpler material richness.
Lighting/mood: controlled violet and ember edge glow, readable after downsampling to 150x200.
Constraints: React renders market deck labels, levels, counts, and UI overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, level marks, UI labels, baked gems, controls, noisy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b1b1-7922-a576-be8eea30b7c2\ig_06ad108dbab82e610169eef49f6fa48191965b5c772cd21f96.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l1/dark-arcane/a/market-card-back-l1.png` | 1086x1448 | 1086x1448 | none | 8.3 | Use as L1 market card-back candidate; compare set coherence with L2/L3 at 150x200 display. | No dimension normalization risk recorded. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l1` | `dark-arcane` | `b` | `dark-arcane-market-card-back-l1-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L1, exact 1086x1448 PNG.
Primary request: create an alternate lowest-tier Dark Arcane market card back, simple and restrained, coherent with richer L2/L3 siblings.
Scene/backdrop: charcoal stone card back, plain dark brass border, subtle magical material hints without symbols or labels.
Style/medium: premium fantasy game card back, symmetrical, low ornament.
Composition/framing: vertical card back, shared set silhouette and frame language, open calm center, fewer details and weaker glow than higher tiers.
Lighting/mood: dark arcane, soft edge highlights, readable after downsampling.
Constraints: React renders all market deck labels, level text, counts, and UI states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, level marks, UI elements, baked gems, busy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b1b1-7922-a576-be8eea30b7c2\ig_06ad108dbab82e610169eef4cf1bfc8191a65cd9b2bb6b11bd.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l1/dark-arcane/b/market-card-back-l1.png` | 1085x1449 | 1086x1448 | resized from 1085x1449 to 1086x1448 | 7.8 | Use as L1 market card-back candidate; compare set coherence with L2/L3 at 150x200 display. | Archive copy upscaled from 1085x1449 to 1086x1448; no crop expected. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l2` | `dark-arcane` | `a` | `dark-arcane-market-card-back-l2-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create the mid-tier Dark Arcane market card back. It must match the L1/L3 set while showing more ornament than L1 and less than L3.
Scene/backdrop: obsidian card back, medium dark brass trim, restrained non-linguistic geometric material pattern.
Style/medium: premium fantasy vertical card-back illustration, symmetrical and polished.
Composition/framing: shared card-back silhouette and frame language; readable center; moderate ornament density and glow. No text or numeric level indicators.
Lighting/mood: controlled violet-ember prestige, not overbright.
Constraints: React renders all market labels, counts, levels, and overlays. Must remain legible at 150x200 display size.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, level marks, UI labels, baked gems, controls, noisy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b1b1-7922-a576-be8eea30b7c2\ig_06ad108dbab82e610169eef50ceab88191843a1bdde054f5a5.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l2/dark-arcane/a/market-card-back-l2.png` | 1086x1449 | 1086x1448 | resized from 1086x1449 to 1086x1448 | 8.2 | Use as L2 market card-back candidate; compare mid-tier progression without text or numerals. | Archive copy resized from 1086x1449 to 1086x1448; no crop expected. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l2` | `dark-arcane` | `b` | `dark-arcane-market-card-back-l2-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L2, exact 1086x1448 PNG.
Primary request: create an alternate mid-tier Dark Arcane market card back, visibly medium prestige within the L1/L2/L3 set.
Scene/backdrop: charcoal stone and dark brass card back, medium frame detail, subtle magical aura without writing.
Style/medium: restrained arcane card-back art, symmetrical and readable.
Composition/framing: same set silhouette as L1/L3; moderate border detail, calm center, no textual tier indicator.
Lighting/mood: subdued violet and ember rim glow, low glare.
Constraints: React renders all labels, counts, levels, and hover states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, level marks, UI labels, baked gems, over-busy center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b1b1-7922-a576-be8eea30b7c2\ig_06ad108dbab82e610169eef559836881918ce533d5908b5305.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l2/dark-arcane/b/market-card-back-l2.png` | 1086x1449 | 1086x1448 | resized from 1086x1449 to 1086x1448 | 8.2 | Use as L2 market card-back candidate; compare mid-tier progression without text or numerals. | Archive copy resized from 1086x1449 to 1086x1448; no crop expected. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l3` | `dark-arcane` | `a` | `dark-arcane-market-card-back-l3-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create the highest-tier Dark Arcane market card back. It must match the L1/L2 set while looking most luxurious.
Scene/backdrop: sovereign obsidian card back, rich dark brass filigree, jewel-like indigo/violet accents, arcane material depth without writing.
Style/medium: premium fantasy card-back illustration, ornate but readable.
Composition/framing: shared card-back silhouette and frame language; strongest ornament at border and corners, readable center, no text or level marks. Tier progression comes from richer trim, glow strength, and accent material.
Lighting/mood: deep violet and ember prestige glow, no white wash.
Constraints: React renders labels, counts, level text, and overlays. Must remain readable at 150x200 display.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, level marks, UI labels, baked gems, controls, illegible clutter.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b1b1-7922-a576-be8eea30b7c2\ig_06ad108dbab82e610169eef5ae084c8191844d37779444f6e0.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l3/dark-arcane/a/market-card-back-l3.png` | 1085x1449 | 1086x1448 | resized from 1085x1449 to 1086x1448 | 8.2 | Use as L3 market card-back candidate; compare highest-tier prestige at 150x200 display. | Archive copy upscaled from 1085x1449 to 1086x1448; no crop expected. | Watchlist; inspect crop/readability before using. |
| `market-card-back-l3` | `dark-arcane` | `b` | `dark-arcane-market-card-back-l3-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel market card back L3, exact 1086x1448 PNG.
Primary request: create an alternate highest-tier Dark Arcane market card back, most premium in the L1/L2/L3 set.
Scene/backdrop: dark obsidian, dense dark brass border, violet-indigo jewel accents, subtle magical edge glow.
Style/medium: ornate arcane card-back art, symmetrical and polished.
Composition/framing: full vertical card back, same set silhouette, highest trim density and material richness, calm center, no textual tier indicator.
Lighting/mood: premium controlled dark glow, readable after downsampling.
Constraints: React renders all labels, counts, levels, and UI states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, level marks, UI labels, baked gems, excessive clutter.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b1b1-7922-a576-be8eea30b7c2\ig_06ad108dbab82e610169eef5ff2a788191874127bb97ad10df.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/market-card-back-l3/dark-arcane/b/market-card-back-l3.png` | 1085x1449 | 1086x1448 | resized from 1085x1449 to 1086x1448 | 8.2 | Use as L3 market card-back candidate; compare highest-tier prestige at 150x200 display. | Archive copy upscaled from 1085x1449 to 1086x1448; no crop expected. | Watchlist; inspect crop/readability before using. |
| `royal-card-back` | `dark-arcane` | `a` | `dark-arcane-royal-card-back-a` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create a Dark Arcane sovereign card back for RoyalCourt previews, more prestigious than market backs.
Scene/backdrop: dark obsidian sovereignty, dark brass ceremonial frame, jewel-like violet/ember accents, non-linguistic material geometry.
Style/medium: premium fantasy royal card-back illustration, ornate symmetrical frame.
Composition/framing: full vertical prestige card back with powerful sovereign identity, ornate frame, readable calm center.
Lighting/mood: deep arcane prestige, controlled glow, not washed out.
Constraints: React renders all RoyalCourt labels, card data, UI states, and overlays.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, UI labels, level marks, baked gems, controls, illegible detail.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b1b1-7922-a576-be8eea30b7c2\ig_06ad108dbab82e610169eef656e7ac8191a23f608a0bdb6825.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/royal-card-back/dark-arcane/a/royal-card-back.png` | 1085x1450 | 1086x1448 | resized from 1085x1450 to 1086x1448 | 8.7 | Use as RoyalCourt card-back candidate; verify sovereign read without overpowering Royal UI. | Archive copy upscaled from 1085x1450 to 1086x1448; no crop expected. | Keep as a strong backup candidate. |
| `royal-card-back` | `dark-arcane` | `b` | `dark-arcane-royal-card-back-b` | <details><summary>Full prompt</summary><pre>Use case: stylized-concept
Asset type: GemDuel royal card back, exact 1086x1448 PNG.
Primary request: create an alternate Dark Arcane royal card back with clear sovereign identity and stronger prestige than market backs.
Scene/backdrop: charcoal obsidian, ceremonial dark brass frame, controlled violet-indigo jewel light.
Style/medium: premium arcane royal card back, symmetrical, powerful but readable.
Composition/framing: full vertical card back, ornate frame and calm center, no text or level marks.
Lighting/mood: controlled dark prestige glow, readable at 150x200 display.
Constraints: React renders all UI labels, card details, counts, and overlay states.
Avoid: text, numbers, Chinese, English, Roman numerals, logos, watermarks, fake alphabets, readable script, fake glyph writing, readable runes, UI labels, baked gems, controls, high-noise center.</pre></details> | `C:\Users\sange\.codex\generated_images\019dcd63-b1b1-7922-a576-be8eea30b7c2\ig_06ad108dbab82e610169eef6bd3c30819181be4bb0413172fb.png` | `assets/art-library/surface-autonomous-candidates/2026-04-27/royal-card-back/dark-arcane/b/royal-card-back.png` | 1085x1450 | 1086x1448 | resized from 1085x1450 to 1086x1448 | 8.6 | Use as RoyalCourt card-back candidate; verify sovereign read without overpowering Royal UI. | Archive copy upscaled from 1085x1450 to 1086x1448; no crop expected. | Keep as a strong backup candidate. |

## Validation Notes

- Archived candidate PNG count expected: 64.
- All archive PNG dimensions were opened with Pillow and verified against target dimensions during generation of this report.
- This pass intentionally did not run frontend tests or Browser Use because no runtime assets or code paths were changed.
