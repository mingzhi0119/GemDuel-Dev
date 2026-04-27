# Long Autonomous Surface Asset Generation Prompt - 2026-04-27

Use the following prompt with Codex when you want a long-running autonomous pass
that generates a complete GemDuel surface-art candidate library.

```text
You are Codex working in E:\simonbb\GemDuel-Dev.

Goal: perform a long autonomous Image Gen asset-library pass for GemDuel surface
art. Generate, archive, score, and document candidate bitmap assets for card
backs, gem panels, shell backgrounds, TopBar skins, and PlayerZone skins.

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
- packages/ui/src/components/card/cardSizing.ts
- packages/ui/src/components/Card.tsx
- packages/ui/src/components/market/MarketDeckBack.tsx
- docs/art/surface-anime-asset-library-2026-04-26.md
- docs/art/surface-anime-gem-panel-refined-prompts-2026-04-26.md
- docs/art/surface-anime-player-zone-refined-2026-04-26.md

## Output Locations

Create a new dated candidate archive. Use today's date in paths.

- Prompt manifest:
  docs/art/surface-asset-autonomous-prompts-YYYY-MM-DD.md
- Scoring and selection report:
  docs/art/surface-asset-autonomous-library-YYYY-MM-DD.md
- Candidate archive root:
  assets/art-library/surface-autonomous-candidates/YYYY-MM-DD/

Never leave final project candidates only under
C:\Users\sange\.codex\generated_images. Every generated source used in the
report must have a copied archive path in the repo, and the report must record
both source and archive paths.

Do not overwrite runtime assets under apps/desktop/public/assets/surfaces unless
the user explicitly asks you to promote winners. This pass is a candidate library
and scoring pass by default.

## Style Groups

Each generated group must have a clear style display name and a filesystem-safe
slug. Existing style names are allowed.

Generate at least four complete style groups unless blocked. A complete group
contains the slots listed below.

Background, TopBar, and PlayerZone may be visually linked as one environment
set. It is acceptable to generate them from one coherent master concept or even
from one combined concept image, but the archived deliverables must still include
separate normalized PNG files at the exact target dimensions for each slot.

## Target Slots And Resolutions

Use exact PNG dimensions unless the current repo source proves a newer target.

| Slot | Required archive filename | Target | Key constraints |
| --- | --- | ---: | --- |
| Shell background | shell-background.png | 3840x2160 | Single full-board table surface behind centered gameplay stage. Keep center subdued and low-noise. Edges may carry stronger atmosphere. No separate playmat/tablecloth slot. |
| TopBar skin | topbar.png | 3840x360 | Panoramic strip for the 120px logical header. Keep quiet readable zones around 25%, 50%, and 75% width for React-rendered score/crown/turn UI. Ornament belongs at edges, corners, and thin borders. |
| PlayerZone P1 skin | player-zone-p1.png | 1920x520 | Side-specific P1 player rail substrate. Quiet zones for reserved cards, card stacks, inventory gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. |
| PlayerZone P2 skin | player-zone-p2.png | 1920x520 | Side-specific P2 player rail substrate. It may differ from P1 while staying in the same Theme style language, or it may be a mirrored P1 composition. No baked gameplay UI. |
| Gem panel | gem-panel.png | 1254x1254 | Front-facing square 5x5 board substrate. Use the refined grid requirement: vertical lines x=100,305,515,726,938,1141 and horizontal lines y=104,308,512,717,917,1132. Empty readable wells only; no baked gems or click markers. |
| Market card back L1 | market-card-back-l1.png | 1086x1448 | Same family as L2/L3, visibly lowest tier. Simpler composition. No text, numerals, Roman numerals, level marks, labels, or UI elements. |
| Market card back L2 | market-card-back-l2.png | 1086x1448 | Same family as L1/L3, visibly mid tier. More ornament than L1, mid-tier accent. No baked UI. |
| Market card back L3 | market-card-back-l3.png | 1086x1448 | Same family as L1/L2, visibly most luxurious. Highest-prestige ornament, indigo/violet/deep jewel accent or equivalent. No baked UI. |
| Royal card back | royal-card-back.png | 1086x1448 | Sovereign/prestige card back for RoyalCourt previews. Stronger royal identity than market backs. No baked UI. |

Card-back rule: L1, L2, and L3 must clearly read as a single set when placed
next to each other, but they must progress from plain to luxurious by tier. Use
shared silhouette, frame language, material family, and motif; escalate richness
through trim, jewel density, glow strength, and accent material. Do not use text
or numerals to communicate the level.

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
- Keep overlays readable. Avoid busy centers in shell backgrounds, TopBar,
  PlayerZone, gem panels, and card backs.
- Avoid baked card frames or placeholder rectangles in PlayerZone art.
- Generate PlayerZone as `1920x520` side-specific art. Prefer both
  `player-zone-p1.png` and `player-zone-p2.png`; `player-zone.png` is only a
  legacy fallback for older candidate batches.
- Avoid baked gem tokens inside the gem-panel cells.
- Avoid high-glare or white-wash surfaces that erase foreground contrast.
- Avoid one-note palettes across the whole library. Even within a style, keep
  useful material and contrast variation.

## Required Workflow

1. Inspect the source files listed above.
2. Write the prompt manifest before generating any images.
3. For each style group, generate all required slots. Prefer A/B variants for
   high-risk slots if time allows, especially PlayerZone, gem-panel, and card
   backs.
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
9. Score every archived asset from 1 to 10.
10. Validate file counts, exact dimensions, source-path recording, archive paths,
    and git status.

## Scoring Criteria

Score each candidate against these criteria:

- Exact dimensions and low normalization risk.
- Slot usability with current React overlays.
- Style identity and cohesion inside the style group.
- Background/TopBar/PlayerZone environmental linkage.
- Gem-panel 5x5 geometry alignment and readable empty wells.
- Card-back L1/L2/L3 set coherence and tier progression.
- Absence of baked text, numbers, fake glyphs, logos, watermarks, and UI.
- Readability in both dark and light app contexts where applicable.
- Risk at final runtime display size, especially card backs at 150x200.

## Optional Browser Preview

If you only generate and archive assets, do not add frontend tests. If you wire
any preview routes, replace runtime assets, or touch code, then start the app
with pnpm from the repo root and verify representative styles in Browser Use.
Use existing preview parameters when available, such as surfacePreviewStart,
surfacePreviewTheme, surfaceAnime, playerZoneBg, gemPanelBg, cardBackStyle,
marketCardBackL1, marketCardBackL2, marketCardBackL3, and royalCardBack.

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
