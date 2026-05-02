# GemDuel Runtime Surface Promotion and L1 Regeneration - 2026-04-29

## Summary

This run used `C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md`.
The main agent owned repository integration, archive, scoring, runtime promotion, and validation. Worker subagents generated raster images with Image Gen only and did not edit the workspace.

Runtime changes:

- Regenerated runtime `market-card-back-l1.png` for `crystal-anime`, `royal-luxury`, `dark-arcane`, `clean-boardgame`, and `pearl-opaline`.
- Promoted `pearl-opaline` candidate A as the fifth runtime surface style.
- Replaced `crystal-anime/dark/gem-panel.png` with a darker purple crystal board.
- Set runtime default surface style to `royal-luxury`.
- Swapped Pearl runtime L1/L2 after review because the generated Pearl L1 was visually more luxurious than the copied Pearl L2.

Archive root:

`assets/art-library/surface-runtime-style-promotion-and-l1-regeneration/2026-04-29/`

## Prompt Contract

L1 card backs:

- Exact target: `1086x1448` PNG.
- Center must not be empty, blank, flat, or a large void.
- Include a complete low-tier card-back design with an integrated central ornament.
- No text, numbers, fake glyph writing, UI labels, counters, controls, card face content, card slots, or deck silhouettes.
- React renders all labels, levels, costs, gems, buttons, hover rings, card faces, counts, and UI.

Crystal gem panel:

- Exact target: `1254x1254` PNG.
- Darker purple diamond/crystal style.
- Front-facing orthographic 5x5 board.
- Grid seams must be straight, readable, and aligned.
- No baked gems, tokens, labels, numbers, buttons, click markers, or UI.

## Generated Sources and Promotions

| Slot      | Style             | Prompt id                                                | Source path                                                                                                                             | Runtime path                                                                                    | Result                                                                                    |
| --------- | ----------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| L1 back   | `crystal-anime`   | `runtime-l1-crystal-anime-20260429-a`                    | `C:\Users\sange\.codex\generated_images\019dda71-e790-75e2-83f1-71512375cb03\ig_0518b7196f33de650169f24a47a8bc819094d5e23ecb6cb55b.png` | `apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/market-card-back-l1.png`   | Promoted after normalization to `1086x1448`; score 8.4.                                   |
| L1 back   | `royal-luxury`    | `runtime-l1-royal-luxury-20260429-a`                     | `C:\Users\sange\.codex\generated_images\019dda72-2f3c-7e81-9b60-c63624aeb4e0\ig_0cd7f7e98259c2300169f24a55aa6c819595e2e8cf3bca2220.png` | `apps/desktop/public/assets/surfaces/anime-themes/royal-luxury/dark/market-card-back-l1.png`    | Promoted after normalization to `1086x1448`; score 8.3.                                   |
| L1 back   | `dark-arcane`     | `runtime-l1-dark-arcane-20260429-a`                      | `C:\Users\sange\.codex\generated_images\019dda72-6aa0-72b3-8606-57924f543473\ig_043255edba8ad29e0169f24a678800819698c2fb6787620075.png` | `apps/desktop/public/assets/surfaces/anime-themes/dark-arcane/dark/market-card-back-l1.png`     | Promoted after normalization to `1086x1448`; score 8.2.                                   |
| L1 back   | `clean-boardgame` | `runtime-l1-clean-boardgame-20260429-a`                  | `C:\Users\sange\.codex\generated_images\019dda72-6aa0-72b3-8606-57924f543473\ig_043255edba8ad29e0169f24a8f466c8196813e01a18f31bad3.png` | `apps/desktop/public/assets/surfaces/anime-themes/clean-boardgame/dark/market-card-back-l1.png` | Promoted after normalization to `1086x1448`; score 8.4.                                   |
| L1 back   | `pearl-opaline`   | copied from Pearl candidate A L2 after swap              | `assets/art-library/surface-autonomous-new-styles-candidates/2026-04-27/market-card-back-l2/pearl-opaline/a/market-card-back-l2.png`    | `apps/desktop/public/assets/surfaces/anime-themes/pearl-opaline/dark/market-card-back-l1.png`   | Promoted by swap; score 8.0.                                                              |
| L2 back   | `pearl-opaline`   | `runtime-l1-pearl-opaline-20260429-a`                    | `C:\Users\sange\.codex\generated_images\019dda72-2f3c-7e81-9b60-c63624aeb4e0\ig_0cd7f7e98259c2300169f24a97d5e08195880f5002d247303f.png` | `apps/desktop/public/assets/surfaces/anime-themes/pearl-opaline/dark/market-card-back-l2.png`   | Generated as L1, promoted to L2 by visual hierarchy swap; score 8.6.                      |
| Gem panel | `crystal-anime`   | `runtime-gem-panel-crystal-anime-purple-20260429-a`      | `C:\Users\sange\.codex\generated_images\019dda71-e790-75e2-83f1-71512375cb03\ig_0518b7196f33de650169f24a8b2a40819080476b4800e150bf.png` | not promoted                                                                                    | Rejected: purple style was acceptable, but grid lines were visibly misaligned; score 5.8. |
| Gem panel | `crystal-anime`   | `runtime-gem-panel-crystal-anime-purple-grid-20260429-b` | `C:\Users\sange\.codex\generated_images\019dda77-a730-7580-8ceb-efd419cef8d5\ig_0c7185d43cc6ba920169f24bc0aa9c8196bbd6baf5cd88b59f.png` | `apps/desktop/public/assets/surfaces/anime-themes/crystal-anime/dark/gem-panel.png`             | Promoted: darker purple crystal style with much straighter grid; score 8.5.               |

## Pearl Runtime Promotion

Pearl-Opaline candidate A was copied into:

`apps/desktop/public/assets/surfaces/anime-themes/pearl-opaline/dark/`

Copied slots:

- `shell-background.png`
- `topbar.png`
- `player-zone.png`
- `gem-panel.png`
- `market-card-back-l3.png`
- `royal-card-back.png`

The runtime L1/L2 backs were then adjusted:

- `market-card-back-l1.png`: copied from candidate A L2 because it is more restrained and center-complete.
- `market-card-back-l2.png`: generated Pearl card back promoted to L2 because it is visibly more luxurious than the copied L2.

## Review Notes

- All five runtime L1 backs have non-empty centers.
- No promoted L1/L2/gem-panel winner contains readable text, numbers, UI labels, card face content, or baked gems.
- Crystal gem-panel A was rejected after manual review because the grid was not aligned enough for runtime use.
- Crystal gem-panel B is darker purple and materially clearer, with significantly straighter seams.
- Pearl L1/L2 swap was chosen over regenerating L2 because it fixed the luxury progression with lower generation risk.

## Validation

- Dimension check passed:
    - Five runtime L1 backs: `1086x1448`.
    - Pearl runtime L2/L3 and royal back: `1086x1448`.
    - Pearl runtime shell/topbar/player-zone/gem-panel: `3840x2160`, `3840x360`, `3840x520`, `1254x1254`.
    - Crystal runtime gem panel: `1254x1254`.
- Focused desktop tests passed:
    - `pnpm --dir apps/desktop test -- src/hooks/__tests__/useSettings.test.tsx src/app/shell/__tests__/gameShellStyles.test.ts src/app/shell/__tests__/gemPanelSkin.test.ts src/app/visual-lab/__tests__/surfaceLabCatalog.test.ts src/app/chrome/__tests__/AppChrome.test.tsx src/app/chrome/__tests__/AppChromeSurfaceMenu.test.tsx src/__tests__/surfaceStyling.test.tsx`
- Typecheck passed:
    - `pnpm typecheck`
- Local Visual Lab URL responded with HTTP 200:
    - `http://127.0.0.1:5173/?surfacePreviewStart=local&surfaceStyle=clean-boardgame&_shellRefresh=1777484069514&visualLab=surfaces`
- Browser automation was not available in this run, so final Visual Lab inspection used generated contact sheets plus metadata/test validation.

Contact sheets:

- `assets/art-library/surface-runtime-style-promotion-and-l1-regeneration/2026-04-29/contact-sheets/runtime-l1-and-crystal-panel-contact-sheet.png`
- `assets/art-library/surface-runtime-style-promotion-and-l1-regeneration/2026-04-29/contact-sheets/runtime-l1-pearl-swap-crystal-panel-b-contact-sheet.png`
