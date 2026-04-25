# Joker Regeneration Prompt Index - 2026-04-24

## Summary

This index records the 2026-04-24 Joker card-face regeneration pass. The goal
was to move Joker cards away from a gold identity and toward a wildcard,
no-color-preference identity: pearl, silver, clear crystal, mirror, glass, and
black-white neutral interiors with only small gold accents.

All image generation used the `imagegen` skill with the built-in `image_gen`
tool. No CLI fallback was used.

## Renderer Changes

- Joker final renders use `pearl` TopCloth.
- Joker final renders keep the existing `gold` PointRibbon.
- Joker right-side discount badge now uses the integrated overlay
  `assets/card/overlays/BonusGemBadges/bonus-gem-badge-back-joker.png`.
- The renderer treats the Joker badge as a complete overlay and does not add a
  separate gem fill or inner symbol.

## Prompt Logs

| Worker log | Cards |
| --- | --- |
| `joker-regeneration-2026-04-24-worker-1.md` | `l1-jo-26`, `l1-jo-27`, `l1-jo-28` |
| `joker-regeneration-2026-04-24-worker-2.md` | `l1-jo-29`, `l2-jo-54`, `l2-jo-55` |
| `joker-regeneration-2026-04-24-worker-3.md` | `l2-jo-56`, `l3-jo-69`, `l3-jo-70`, `l3-jo-76` |

Each worker log includes the final prompt, selected generated source path,
project output path, generation method, and aesthetic intent for each assigned
card.

## Output Assets

The regenerated Joker source face PNGs are now stored under `assets/card/faces/source/`:

- `assets/card/faces/source/l1-jo-26.png`
- `assets/card/faces/source/l1-jo-27.png`
- `assets/card/faces/source/l1-jo-28.png`
- `assets/card/faces/source/l1-jo-29.png`
- `assets/card/faces/source/l2-jo-54.png`
- `assets/card/faces/source/l2-jo-55.png`
- `assets/card/faces/source/l2-jo-56.png`
- `assets/card/faces/source/l3-jo-69.png`
- `assets/card/faces/source/l3-jo-70.png`
- `assets/card/faces/source/l3-jo-76.png`

All project outputs were normalized to `1086x1448` RGBA PNGs before the final
batch render was regenerated.
