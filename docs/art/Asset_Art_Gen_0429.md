# Long Autonomous Surface Asset Generation Prompt - 2026-04-27

Use the following prompt with Codex when you want a long-running autonomous pass
that generates a complete GemDuel surface-art candidate library.

```text
You are Codex working in E:\simonbb\GemDuel-Dev.

Goal: perform a long autonomous Image Gen asset-library pass for GemDuel surface
art. Generate, archive, score, and document candidate bitmap assets for card
backs, gem panels, shell backgrounds, TopBar skins, and PlayerZone skins.
As of 2026-04-29, the current runtime exposes five Surface Style variants:
crystal-anime, royal-luxury, dark-arcane, clean-boardgame, and pearl-opaline.
Runtime surface art is read from each variant's dark asset directory; Light/Dark
runtime asset directories are no longer separate integration targets. The
runtime default style is royal-luxury, and pearl-opaline is a first-class
runtime style rather than a candidate-only theme. However, this autonomous
generation prompt is now for new-theme candidate libraries by default. Do not
generate updated versions of all five runtime styles unless the user explicitly
requests a runtime replacement or promotion pass.

Hard requirement: before planning or generating any art, you MUST open and use
C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md. Follow that
skill's workflow exactly: inspect project reality, write a prompt manifest,
generate with the built-in image_gen path through workers when useful, collect
outputs from C:\Users\sange\.codex\generated_images, archive project-bound
candidates into this repo, score them, and validate dimensions. Do not use
CLI/API image-generation fallbacks unless the user explicitly confirms that
fallback in this thread.

You are authorized to use worker subagents for this asset-generation task.
Workers may call the imagegen skill and built-in image_gen tool only. Workers
must not edit repo files, copy files into the workspace, or make code changes.
The main agent owns prompt manifests, archive copying, normalization, scoring,
and validation.

## First Read These Files

Read the current repo files before writing prompts. If docs and code disagree,
prefer current code constants and the most specific art docs.

- AGENTS.md
- docs/guides/frontend-layout-guide.md
- apps/desktop/public/assets/surfaces/README.md
- apps/desktop/src/app/shell/surfaceArtwork.ts
- apps/desktop/src/app/shell/playerZoneSurfaceStyles.ts
- apps/desktop/src/app/shell/surfaceTheme.ts
- apps/desktop/src/app/shell/surfacePreviewQuery.ts
- apps/desktop/src/app/visual-lab/surfaceLabCatalog.ts
- apps/desktop/vite.config.ts
- packages/ui/src/components/card/cardSizing.ts
- packages/ui/src/components/Card.tsx
- packages/ui/src/components/market/MarketDeckBack.tsx
- docs/art/surface-anime-asset-library-2026-04-26.md
- docs/art/surface-anime-gem-panel-refined-prompts-2026-04-26.md
- docs/art/surface-anime-player-zone-refined-2026-04-26.md
- docs/art/surface-shell-background-continuous-runtime-replacement-library-2026-04-29.md
- docs/art/surface-runtime-style-promotion-and-l1-regeneration-2026-04-29.md

Treat the 2026-04-26 anime docs as historical reference. If those docs mention
old player-zone archive paths, `playerZoneBgVariant`, light asset directories,
or single-file PlayerZone-only candidates, update the new prompt manifest to the
current side-specific runtime contract instead of copying the old wording. Treat
the 2026-04-29 docs as the current failure-mode record for shell backgrounds,
L1 card backs, Pearl-Opaline promotion, and the crystal gem-panel regeneration.

## Output Locations

Create a new dated candidate archive. Use today's date in paths.

- Prompt manifest:
  docs/art/surface-asset-autonomous-prompts-YYYY-MM-DD.md
- Scoring and selection report:
  docs/art/surface-asset-autonomous-library-YYYY-MM-DD.md
- Candidate archive root:
  assets/art-library/surface-autonomous-candidates/YYYY-MM-DD/
- Visual Lab manifest, written under the candidate archive:
  assets/art-library/surface-autonomous-candidates/YYYY-MM-DD/contact-sheets/preview-manifest.json

Never leave final project candidates only under
C:\Users\sange\.codex\generated_images. Every generated source used in the
report must have a copied archive path in the repo, and the report must record
both source and archive paths.

Do not overwrite runtime assets under apps/desktop/public/assets/surfaces unless
the user explicitly asks you to promote winners. This pass is a new-theme
candidate library and scoring pass by default, not a five-runtime-style update
pass.

When candidates are ready for local review, make them consumable by the existing
Surface Lab development middleware. The `preview-manifest.json` records must use
slots accepted by the app: shell-background, topbar, player-zone-p1,
player-zone-p2, gem-panel, market-card-back-l1, market-card-back-l2,
market-card-back-l3, and royal-card-back. Each record should include batch,
date, promptId, slot, style, variant, score, source path, archive path, target
dimensions, archive dimensions, and risk/normalization notes.

## Style Groups

Each generated group must have a clear style display name and a filesystem-safe
slug. Existing style names are allowed.

Generate at least four complete style groups unless blocked. A complete group
contains the slots listed below.
For normal new generation, create new theme slugs and use new theme material
directions. Do not output "updated runtime" versions of crystal-anime,
royal-luxury, dark-arcane, clean-boardgame, or pearl-opaline as the default
batch. The five runtime styles are reference material and integration examples,
not the default generation target. Only use exactly the runtime style slugs when
the user explicitly asks for runtime replacement, runtime refresh, or winner
promotion into existing runtime paths. New candidate slugs must not be described
as runtime-selectable until code promotion is explicitly requested.

Background, TopBar, and PlayerZone may be visually linked as one environment
set. It is acceptable to generate them from one coherent master concept or even
from one combined concept image, but the archived deliverables must still include
separate normalized PNG files at the exact target dimensions for each slot.

## Target Slots And Resolutions

Use exact PNG dimensions unless the current repo source proves a newer target.

| Slot | Required archive filename | Target | Key constraints |
| --- | --- | ---: | --- |
| Shell background | shell-background.png | 3840x2160 | One continuous full-board tabletop background for the whole game shell. This is a passive environment surface only: not a gameplay stage, not a playmat, not a tablecloth, and not a framed panel. Keep the whole image low-noise and readable through subtle continuous material texture; do not create a central rectangle, inset area, platform, mat, border, vignette box, gray overlay, or center/edge split. |
| TopBar skin | topbar.png | 3840x360 | Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. |
| PlayerZone P1 skin | player-zone-p1.png | 1920x520 | Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. |
| PlayerZone P2 skin | player-zone-p2.png | 1920x520 | Side-specific P2 player rail substrate. It may differ from P1 while staying in the same Theme style language, or it may be a mirrored P1 composition. No baked gameplay UI. |
| Gem panel | gem-panel.png | 1254x1254 | Front-facing square 5x5 board substrate. Empty readable wells only; no baked gems or click markers. The app now supports per-surface calibrated grid geometry, so do not reuse one old absolute lattice as universal. Prefer a regular 5x5 lattice with stable margins, then record the detected 6 vertical and 6 horizontal grid lines in normalized 0..1 coordinates for future calibration. Use existing runtime surfaces in `surfaceArtwork.ts` as alignment references. For any crystal-like new theme, use mechanically straight, aligned, evenly spaced grid seams; reject candidates with wavy seams, irregular row heights, diagonal drift, or crooked cell boundaries. |
| Market card back L1 | market-card-back-l1.png | 1086x1448 | Same family as L2/L3, visibly lowest tier, but the center must not be empty, blank, flat, or a large void. Include a restrained integrated central ornament, material emblem, medallion, crystal core, or equivalent motif that reads as a complete card back without becoming as ornate as L2/L3. No text, numerals, Roman numerals, level marks, labels, or UI elements. |
| Market card back L2 | market-card-back-l2.png | 1086x1448 | Same family as L1/L3, visibly mid tier. More ornament than L1, mid-tier accent, and clearly more luxurious than the promoted L1 for the same style. No baked UI. |
| Market card back L3 | market-card-back-l3.png | 1086x1448 | Same family as L1/L2, visibly most luxurious. Highest-prestige ornament, indigo/violet/deep jewel accent or equivalent. No baked UI. |
| Royal card back | royal-card-back.png | 1086x1448 | Sovereign/prestige card back for royal-card previews. Stronger royal identity than market backs. No baked UI. |

Card-back rule: L1, L2, and L3 must clearly read as a single set when placed
next to each other, but they must progress from plain to luxurious by tier. Use
shared silhouette, frame language, material family, and motif; escalate richness
through trim, jewel density, glow strength, and accent material. Do not use text
or numerals to communicate the level. Do not solve L1 simplicity by leaving a
plain empty center. For every style, L1 must be decorated but restrained: center
complete, lower-tier, and readable at runtime display size. During review, if a
generated L1 is visually more luxurious than the existing or generated L2, either
swap L1/L2 when both assets remain valid and dimension-correct, or regenerate L2
with a stricter mid-tier prompt. Record that decision in the report.

Pale-material hierarchy note: Pearl-Opaline is now a runtime reference style,
and its 2026-04-29 review showed that pale opaline material can make L1 look
more luxurious than L2. Apply that lesson to any new light, pearl, opal, ivory,
glass, or crystal theme: prefer a restrained L1 and a more ornate jeweled or
medallion-forward L2, while keeping L3 as the most prestigious.

Featured-card rule: 1086x1448 is the design/sampling canvas
FEATURED_CARD_SAMPLE_SIZE. Runtime displays these inside FEATURED_CARD_SIZE
150x200 boxes. Do not change card sizing constants, do not enlarge low-resolution
card faces, and do not add a market-only scale factor.

## Global Visual Constraints

- No text, no numbers, no Chinese, no English, no Roman numerals.
- No logo, watermark, fake alphabet, readable script, fake glyph writing, or UI
  labels.
- React renders all labels, counts, levels, gems, buttons, hover rings, selection
  states, and gameplay affordances.
- Surface bitmap paths are runtime dark paths: promoted files live under
  `apps/desktop/public/assets/surfaces/anime-themes/<style>/dark/`. Do not
  generate or promote separate light-directory runtime assets.
- Keep overlays readable. For shell backgrounds, readability must come from
  low-noise whole-image material texture, not from drawing a localized
  functional zone, stage, edge frame, or center-vs-edge composition split.
  For TopBar, PlayerZone, gem panels, and card backs, avoid busy functional
  areas that sit under React-rendered UI.
- For L1 market card backs, avoid blank or low-effort centers. The center must
  contain an integrated style-appropriate ornament or material motif, but no
  readable content or gameplay UI.
- Avoid baked card frames or placeholder rectangles in PlayerZone art.
- Generate PlayerZone as `1920x520` side-specific art. Prefer both
  `player-zone-p1.png` and `player-zone-p2.png`; `player-zone.png` is only a
  legacy fallback for older candidate batches.
- Avoid baked gem tokens inside the gem-panel cells.
- For gem panels, reject visually attractive candidates if the grid is not
  suitable for gameplay alignment. Straight, aligned, evenly spaced 5x5 seams
  are more important than decorative crystal irregularity. Record approximate
  grid-line coordinates for any promoted panel.
- Avoid high-glare or white-wash surfaces that erase foreground contrast.
- Avoid one-note palettes across the whole library. Even within a style, keep
  useful material and contrast variation.

## Required Workflow

1. Inspect the source files listed above.
2. Write the prompt manifest before generating any images.
3. For each new style group, generate all required slots. Prefer A/B variants
   for high-risk slots if time allows, especially PlayerZone, gem-panel, and
   card backs. For L1 backs in any new style, generate at least one complete
   center-decorated candidate and reject any candidate with an empty center.
4. Assign workers by style group or slot group. Worker instructions must include:
   use imagegen and built-in image_gen, generate only assigned prompts, do not
   edit repo files, return prompt id, prompt text, generated source absolute
   path, and failures.
5. Collect sources from C:\Users\sange\.codex\generated_images.
6. Normalize only when needed to meet exact dimensions. Record every resize,
   crop, or aspect correction as a risk in the report.
7. Archive candidates under:
   assets/art-library/surface-autonomous-candidates/YYYY-MM-DD/<slot>/<style>/
8. Create contact sheets or preview pages when useful for human selection.
9. Write or update `contact-sheets/preview-manifest.json` so Visual Lab can load
   the candidates during Vite development.
10. Score every archived asset from 1 to 10.
11. Validate file counts, exact dimensions, source-path recording, archive
    paths, preview-manifest records, and git status.

## Scoring Criteria

Score each candidate against these criteria:

- Exact dimensions and low normalization risk.
- Slot usability with current React overlays.
- Style identity and cohesion inside the style group.
- Background/TopBar/PlayerZone environmental linkage.
- Gem-panel 5x5 geometry regularity, readable empty wells, and the quality of
  recorded normalized grid-line calibration evidence.
- Card-back L1/L2/L3 set coherence and tier progression, including the specific
  requirement that L1 is not center-empty and L2 is not visually weaker than L1.
- Absence of baked text, numbers, fake glyphs, logos, watermarks, and UI.
- Readability against current React foreground chrome and overlays; do not treat
  this as a requirement to generate separate light runtime assets.
- Risk at final runtime display size, especially card backs at 150x200.

## Optional Browser Preview

If you only generate and archive assets, do not add frontend tests. If you wire
any preview routes, replace runtime assets, or touch code, then start the app
with pnpm from the repo root and verify representative styles in Browser Use.
Use existing preview parameters when available. Current broad style previews use
surfacePreviewStart plus surfaceTheme, surfaceAnime, or surfaceStyle. Per-slot
preview keys include topBarBg, shellBg, playerZoneBg, gemPanelBg,
cardBackStyle, marketCardBackL1, marketCardBackL2, marketCardBackL3, and
royalCardBack. `surfacePreviewTheme` may still be useful for app chrome
contrast checks if the local build supports it, but it must not be treated as a
separate light-asset runtime path.

## Final Deliverables

End with:

- Prompt manifest path.
- Scoring report path.
- Archive root path.
- Candidate count by style and slot.
- Top 1-2 picks per slot.
- Any rejected/watchlist assets and why.
- Validation commands/results.

Do not stop after drafting prompts. Continue through generation, archival,
scoring, and validation unless a hard tool or policy blocker prevents it.
```
