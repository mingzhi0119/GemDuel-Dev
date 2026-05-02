# Long Autonomous Character-Theme Surface Asset Generation Prompt - 2026-05-01

Use the following prompt with Codex when you want a long-running autonomous pass
that generates a GemDuel Visual Lab candidate library for character-faithful
surface art.

```text
You are Codex working in E:\simonbb\GemDuel-Dev.

Goal: perform a long autonomous Image Gen asset-library pass for GemDuel surface
art. Generate, archive, score, and document candidate bitmap assets for Visual
Lab review. This pass is character-theme driven: the generated style groups must
faithfully match the requested original characters and use abundant, recognizable
character-related elements. Do not turn the themes into generic mood boards,
generic anime portraits, generic carnival masks, generic fantasy crystals, or
loosely inspired original characters.

Hard requirement: before planning or generating any art, you MUST open and use
C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md. Follow that
skill's workflow exactly: inspect project reality, write a prompt manifest,
generate with the built-in image_gen path through workers when useful, collect
outputs from C:\Users\sange\.codex\generated_images or $CODEX_HOME/generated_images,
archive project-bound candidates into this repo, score them, and validate
dimensions. Do not use CLI/API image-generation fallbacks unless the user
explicitly confirms that fallback in this thread.

You are authorized to use worker subagents for this asset-generation task.
Workers may call the imagegen skill and built-in image_gen tool only. Workers
must not edit repo files, copy files into the workspace, or make code changes.
The main agent owns prompt manifests, archive copying, normalization, scoring,
Visual Lab manifest writing, and validation.

If a worker cannot make a theme recognizably match the original character from
text prompting alone, the worker MUST search for reference images first and then
use image-to-image / reference-guided generation when the available tool path
supports it. Prefer official character art, official character pages, official
trailers, official social posts, or high-confidence wiki pages only when official
art is unavailable. Record the reference URLs or local reference-image paths in
the prompt manifest and scoring report. If a theme cannot be identified from
reliable references, stop that theme and report it instead of inventing a new
character.

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
- apps/desktop/src/app/visual-lab/surfaceLabTypes.ts
- apps/desktop/src/app/visual-lab/visualLabStyles.ts
- apps/desktop/vite.config.ts
- packages/ui/src/components/card/cardSizing.ts
- packages/ui/src/components/Card.tsx
- packages/ui/src/components/market/MarketDeckBack.tsx
- docs/art/Asset_Art_Gen_0429.md
- docs/art/2026-05-01T044050Z/prompt-manifest.md
- docs/art/2026-05-01T044050Z/scorecard.md

Treat the 2026-05-01T044050Z batch as a failure-mode reference: it allowed
portrait motifs too broadly, used `Use case: stylized-concept`, accepted generic
mask/carnival drift for Sparkle, and normalized many wrong-size outputs into
target dimensions. Do not repeat those mistakes.

## Output Locations

Create a new dated candidate archive. Use the current UTC timestamp in paths.

- Prompt manifest:
  docs/art/surface-character-theme-prompts-YYYY-MM-DDTHHMMSSZ.md
- Scoring and selection report:
  docs/art/surface-character-theme-library-YYYY-MM-DDTHHMMSSZ.md
- Candidate archive root:
  assets/art-library/surface-character-theme-candidates/YYYY-MM-DDTHHMMSSZ/
- Visual Lab manifest:
  assets/art-library/surface-character-theme-candidates/YYYY-MM-DDTHHMMSSZ/contact-sheets/preview-manifest.json

Never leave final project candidates only under C:\Users\sange\.codex\generated_images.
Every generated source used in the report must have a copied archive path in the
repo, and the report must record both source and archive paths.

Do not overwrite runtime assets under apps/desktop/public/assets/surfaces. This
pass is candidate-library generation for Visual Lab scoring, not runtime
promotion or replacement.

## Required Character Themes

Generate these exact theme groups. Each style group must be clearly labeled with
the original character name and a filesystem-safe slug.

| Theme | Suggested slug | Faithfulness requirement |
| --- | --- | --- |
| 原神 甘雨 | genshin-ganyu | Must read as Ganyu: original character identity, palette, hairstyle/silhouette, outfit language, horn/adornment cues, cryo/qilin motifs, and Liyue adeptus elegance. |
| 原神 刻晴 | genshin-keqing | Must read as Keqing: original character identity, purple twin-tail silhouette, electro/jade hair ornament language, Liyue elegance, sharp lightning motif, and refined sword-bearing aristocratic energy. |
| 少女哥伦比亚 | damselette-columbina | Must first verify the intended character from references. If this means Columbina / Damselette, it must read as that original character, not a generic angel, nun, singer, or white-clad girl. Preserve her recognizable character identity and related motifs. |
| 星铁 火花 | hsr-huohua | Must first verify the intended Honkai: Star Rail character from references. It must read as the original 火花 character requested by the user, with faithful hairstyle/silhouette, palette, outfit language, props, faction/world visual cues, and related motifs. Do not silently substitute 花火/Sparkle unless reference search proves the user-intended character is the same. Do not drift into generic red-haired joker, clown, Venetian mask carnival, or unrelated red-black jester. |
| 风堇 | fengjin | Must first verify the intended character from references. It must match the original character exactly enough for a fan to identify it. Do not invent a new wind-themed anime character. |
| 昔涟 | xilian | Must first verify the intended character from references. It must match the original character exactly enough for a fan to identify it. Do not invent a new water/nostalgia-themed anime character. |

For ambiguous Chinese names, workers must search first and report the resolved
official English/Japanese/Chinese name and source. If the name cannot be resolved
reliably, skip that theme and report the blocker.

## Character Placement Rules

This batch intentionally allows character material, but placement differs by
slot:

- Shell background: character may appear. The character must resemble the
  original character, may be prominent at the far left/right/perimeter, and may
  include abundant related elements, but the gameplay center and TopBar readable
  zones must stay usable. No central foreground body blocking the board.
- PlayerZone P1/P2: character may appear. Use cropped side portraits, hands,
  costume fabric, hair silhouette, weapon/prop details, or character-related
  environmental details at the ends and non-critical rail zones. Keep reserved
  card, stack, gem, counter, badge, and active-ring overlay lanes quiet.
- Gem panel: characters are NOT allowed. No face, head, body, hand, eye, mask
  face, portrait, silhouette, or character figure. Use only character-related
  materials and motifs: colors, costume textile patterns, elemental VFX, props,
  ornaments, flowers, fan/ribbon/sword/cryo/electro/etc. details, and abstract
  non-readable geometry. It must remain an empty 5x5 gameplay board substrate.
- Market card backs and royal card back: characters are NOT allowed. No face,
  head, body, hand, eye, portrait, silhouette, or character figure. Use only
  character-related elements from the original design: outfit trim, props,
  weapons, ornaments, elemental motifs, symbolic materials, and palette. Card
  backs must feel like official-character-themed backs without showing the
  character.

The phrase "character-related elements" means real elements from the original
character design or official visual language, not invented unrelated decoration.
If the model produces generic decoration that no longer points to the character,
mark it as a failure even if it is beautiful.

## Target Slots And Resolutions

Use exact PNG dimensions unless current code proves a newer target.

| Slot | Required archive filename | Target | Key constraints |
| --- | --- | ---: | --- |
| Shell background | shell-background.png | 3840x1640 | One continuous shell-fill background covering TopBar plus center gameplay area. Character art is allowed, but only if the original character is recognizable and positioned so the center gameplay overlays remain readable. No playmat, tablecloth, framed panel, card slots, counters, buttons, labels, app chrome, or baked UI. |
| PlayerZone P1 skin | player-zone-p1.png | 1920x520 | Side-specific P1 rail substrate. Character art is allowed at ends or low-risk lanes only. Quiet zones for React-rendered reserved cards, stacks, gems, counters, badges, and active-player rings. No baked card frames, card slots, deck silhouettes, controls, labels, or numbers. |
| PlayerZone P2 skin | player-zone-p2.png | 1920x520 | Side-specific P2 rail substrate. It may mirror P1 or use complementary character elements while staying in the same style language. Character art is allowed at ends or low-risk lanes only. No baked gameplay UI. |
| Gem panel | gem-panel.png | 1254x1254 | Front-facing square 5x5 board substrate. No character portrait or body. Empty readable wells only; no baked gems, click markers, labels, numerals, or strong UI symbols. Use character-related materials and motifs around the border or subtle seams. Require straight, aligned, evenly spaced grid seams. Record approximate 6 vertical and 6 horizontal grid-line coordinates in normalized 0..1 coordinates. |
| Market card back L1 | market-card-back-l1.png | 1086x1448 | Lowest-tier card back. No character portrait or body. Include a restrained but complete center ornament using character-related elements; no empty center. No text, numerals, pips, UI badges, or logos. |
| Market card back L2 | market-card-back-l2.png | 1086x1448 | Mid-tier card back. No character portrait or body. Same family as L1/L3, richer than L1, with more character-related ornament and material depth. No text, numerals, pips, UI badges, or logos. |
| Market card back L3 | market-card-back-l3.png | 1086x1448 | Highest-tier market card back. No character portrait or body. Same family as L1/L2, most luxurious, with the strongest character-related motif. No text, numerals, pips, UI badges, or logos. |
| Royal card back | royal-card-back.png | 1086x1448 | Prestige card back. No character portrait or body. Use sovereign/prestige character-related elements, not generic crowns unless the original character design justifies them. Complete center composition, no empty center. No text, numerals, UI badges, or logos. |

Do not generate a standalone TopBar asset for this batch unless current code or
the user explicitly asks for it. The current runtime surface contract uses
`shell-background.png` for the TopBar plus center shell-fill area.

Card-back rule: L1, L2, and L3 must clearly read as one family when placed next
to each other, but they must progress from plain to luxurious by tier. Use shared
silhouette, frame language, material family, and motif; escalate richness through
trim, jewel density, glow strength, and accent material. Do not use text or
numerals to communicate the level.

Featured-card rule: 1086x1448 is the design/sampling canvas
FEATURED_CARD_SAMPLE_SIZE. Runtime displays these inside FEATURED_CARD_SIZE
150x200 boxes. Do not change card sizing constants, do not enlarge
low-resolution card faces, and do not add a market-only scale factor.

## Reference Search And Image-To-Image Rules

Before writing final prompts for each character theme:

1. Search for official or high-confidence reference images for the character.
2. Record each reference source in the prompt manifest.
3. Identify the character's must-preserve visual anchors: hairstyle/silhouette,
   palette, outfit trim, props, weapons, elemental effects, symbols, flowers,
   accessories, and signature mood.
4. Write a per-theme "do not drift" list. Example: Sparkle must not become a
   generic red-haired joker, generic clown, or Venetian carnival mask scene.
5. If text-only prompting fails to keep identity, assign a worker to use
   reference-guided image generation / image-to-image with the selected reference
   image, while still obeying the slot rules above.

Do not use fan art as the primary reference unless official/high-confidence
references are unavailable and the user explicitly approves it. Never include
logos, game titles, readable UI screenshots, captions, or watermarks in the
generated output.

## Global Visual Constraints

- No text, no numbers, no Chinese, no English, no Roman numerals.
- No logo, game logo, game title, watermark, fake alphabet, readable script,
  fake glyph writing, or UI labels.
- No baked React UI: the app renders all labels, counts, levels, gems, buttons,
  hover rings, selection states, score/crown/turn UI, and gameplay affordances.
- No screenshots, mockups, app chrome, caption boxes, speech bubbles, visible
  prompt text, or reference-sheet layout.
- No baked gem tokens inside gem-panel cells.
- No baked card frames, placeholder rectangles, card slots, or deck silhouettes
  inside PlayerZone art.
- Avoid high-glare or white-wash surfaces that erase foreground contrast.
- Avoid one-note palettes across the whole library. Even within a style, keep
  useful material and contrast variation.
- No runtime overwrite. No finalize. No delete/apply phase. No git commit/push
  unless the user asks after review.

## Required Workflow

1. Inspect the source files listed above and confirm current slot dimensions.
2. Search/resolve all requested character references before writing final
   prompts. For ambiguous names, resolve first or stop that theme.
3. Write the prompt manifest before generating any images. Include reference
   sources, prompt ids, slot rules, target dimensions, and archive filenames.
4. Generate all required slots for each theme. Prefer A/B variants per slot:
   A = conservative/runtime-readable, B = stronger character-directed.
5. Assign workers by character theme or slot group. Worker instructions must
   include: use imagegen and built-in image_gen, search/reference when needed,
   generate only assigned prompts, do not edit repo files, return prompt id,
   prompt text, reference sources used, generated source absolute path, and
   failures.
6. Reject or retry once for hard failures: wrong character identity, generic
   unrelated theme, text/logos/watermark, baked UI, character shown in gem panel
   or card back, missing/irregular 5x5 gem grid, wrong card-back focus, unusable
   crop, or badly wrong source dimensions.
7. Collect sources from C:\Users\sange\.codex\generated_images or
   $CODEX_HOME/generated_images.
8. Normalize only when minor dimension correction is unavoidable. Do not treat
   severe aspect-ratio mismatch, half-size shell backgrounds, or heavily cropped
   PlayerZone outputs as acceptable winners. Record every resize, crop, or
   aspect correction as a risk in the report.
9. Archive candidates under:
   assets/art-library/surface-character-theme-candidates/YYYY-MM-DDTHHMMSSZ/<slot>/<style>/<variant>/
10. Write `contact-sheets/preview-manifest.json` using records accepted by
    Visual Lab. Use slots: shell-background, player-zone-p1, player-zone-p2,
    gem-panel, market-card-back-l1, market-card-back-l2, market-card-back-l3,
    and royal-card-back.
11. Create contact sheets or preview pages when useful for human selection.
12. Score every archived asset from 1 to 10.
13. Validate file counts, exact dimensions, source-path recording, archive
    paths, preview-manifest records, and git status.

## Scoring Criteria

Score each candidate against these criteria:

- Original-character faithfulness. This is a hard requirement, not a bonus.
- Correct slot-specific character placement: Shell/PlayerZone may contain the
  character; gem panel/card backs must not contain any character body or face.
- Quantity and accuracy of character-related elements from the original design.
- Exact dimensions and low normalization risk.
- Slot usability with current React overlays.
- Style identity and cohesion inside the character theme group.
- Gem-panel 5x5 geometry regularity, readable empty wells, and recorded
  normalized grid-line calibration evidence.
- Card-back L1/L2/L3 family cohesion and tier progression, with no empty center.
- Absence of baked text, numbers, fake glyphs, logos, watermarks, and UI.
- Readability at runtime display size, especially card backs at 150x200.

Automatic failure conditions:

- The theme reads as a generic anime character instead of the requested original
  character.
- Sparkle reads as generic red-haired joker/clown/carnival instead of Honkai:
  Star Rail Sparkle.
- Gem panel or any card back contains a character face, portrait, body, eye,
  hand, head, or obvious character silhouette.
- Missing 5x5 gem-panel grid, crooked/irregular grid, or baked gems in cells.
- Text, logos, watermarks, readable glyphs, fake UI, card slots, or buttons.
- Severe source-to-target aspect correction hidden by normalization.

## Optional Browser Preview

If you only generate and archive assets, do not add frontend tests. If you wire
any preview routes, replace runtime assets, or touch code, start the app with
pnpm from the repo root and verify representative styles in Browser Use at
http://localhost:5173/?visualLab=surfaces. Use existing Visual Lab candidate
manifest support and do not treat this pass as runtime promotion.

## Final Deliverables

End with:

- Prompt manifest path.
- Scoring report path.
- Archive root path.
- Visual Lab preview manifest path.
- Contact sheet path if created.
- A short reject/watchlist summary by character theme.
- Git status summary.

```
