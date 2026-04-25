# Royal Layered Imported Card Assets

This folder archives the normalized loose image-generation sources used for the royal layered-card pass.

The reusable UI overlay cutouts and their source sheets from this pass are shared card assets, not royal-card-specific assets, and now live under `assets/card/overlays/`.

## Source Archive

Original loose files were moved into `source/` and renamed by role:

- `royal-trophy-3pts-base-source.png`
- `royal-scepter-2pts-extra-turn-base-source.png`
- `royal-scroll-2pts-privilege-base-source.png`
- `royal-saber-2pts-steal-base-source.png`
- `ig-source-index.png`

The shared overlay source sheets live under `assets/card/overlays/Source/`.

## Processed Outputs

- `base/`: four cropped/resized base card faces, all `1086x1448`.
- `apps/desktop/public/assets/cards/royal-*.png`: four composed runtime royal full-card renders, all `1086x1448`.
- `assets/archive/previews/royal-layered-from-pic/`: royal base contact sheet and a sample layered card for visual QA.
- `assets/card/overlays/`: transparent shared card overlay cutouts split from the sprite sheets, plus the shared overlay source sheets.

Overlay processing uses chroma-key removal for flat green or magenta backgrounds, connected-component cleanup for adjacent sprite fragments, and green-fringe cleanup on non-green variants. Top cloth overlays use `1100x310` PNG canvases; their visible subject width is `1086px`, placed at `x=7`, with top margin `10px` and source aspect ratio preserved.

Royal full-card rendering uses `tools/art/render-royal-cards.py`, which writes runtime PNGs to `apps/desktop/public/assets/cards/` by default. It reuses the standard card layout and shared overlays with gold point ribbons, while omitting top cloths, cost tokens, and bonus gem badges. The 3-point royal score is shifted down 20px on the ribbon; the other royal scores and ability medallions are shifted down 10px.
