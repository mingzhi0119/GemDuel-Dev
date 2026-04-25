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

| Worker log                                  | Cards                                  |
| ------------------------------------------- | -------------------------------------- |
| `joker-regeneration-2026-04-24-worker-1.md` | `171-jo`, `172-jo`, `173-jo`           |
| `joker-regeneration-2026-04-24-worker-2.md` | `174-jo`, `271-jo`, `272-jo`           |
| `joker-regeneration-2026-04-24-worker-3.md` | `273-jo`, `371-jo`, `372-jo`, `373-jo` |

Each worker log includes the final prompt, selected generated source path,
project output path, generation method, and aesthetic intent for each assigned
card.

## Output Assets

The regenerated Joker source face PNGs are now stored under `assets/card/faces/source/`:

- `assets/card/faces/source/171-jo.png`
- `assets/card/faces/source/172-jo.png`
- `assets/card/faces/source/173-jo.png`
- `assets/card/faces/source/174-jo.png`
- `assets/card/faces/source/271-jo.png`
- `assets/card/faces/source/272-jo.png`
- `assets/card/faces/source/273-jo.png`
- `assets/card/faces/source/371-jo.png`
- `assets/card/faces/source/372-jo.png`
- `assets/card/faces/source/373-jo.png`

All project outputs were normalized to `1086x1448` RGBA PNGs before the final
batch render was regenerated.
