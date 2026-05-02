# Visual Lab Surface Review Plan - 2026-04-30T22:06:31.791Z

## Summary

- Schema: `gemduel.visualLab.surfaceReviewPlan.v1`
- Origin: `http://localhost:5173`
- Candidate complete sets: 43
- Runtime sets observed: 5
- Delete rating-1 sets: 0
- Kept rated sets: 4
- Regenerate marked slots: 7
- Style comments: 4
- Warnings: 0

## Delete Sets

| Set id | Rating | Assets | Comment |
| ------ | -----: | -----: | ------- |

## Keep Sets

| Set id                                                                   | Rating | Comment |
| ------------------------------------------------------------------------ | -----: | ------- |
| `surface-autonomous-new-themes-candidates:2026-04-29:aurora-citadel:A`   |      7 | -       |
| `surface-autonomous-new-themes-candidates:2026-04-29:aurora-citadel:B`   |      7 | -       |
| `surface-autonomous-new-themes-candidates:2026-04-29:astral-navigator:A` |     10 | -       |
| `surface-autonomous-new-themes-candidates:2026-04-29:astral-navigator:B` |      7 | -       |

## Style Comments

| Set id                               | Comment                                          |
| ------------------------------------ | ------------------------------------------------ |
| `runtime:current:pearl-opaline:DARK` | 替换素材时 以珍珠白为主要配色，去掉城堡          |
| `runtime:current:crystal-anime:DARK` | 背景太亮，皇室卡卡背中心空                       |
| `runtime:current:royal-luxury:DARK`  | 背景要夜间的金碧辉煌的皇宫，目前宫殿黑色元素太多 |
| `runtime:current:dark-arcane:DARK`   | 背景不要城堡                                     |

## Regenerate Slots

| Prompt id                                                            | Slot               | Rating  | Targets |
| -------------------------------------------------------------------- | ------------------ | ------- | ------: |
| `SURFACE-REVIEW-2026-04-29-aurora-citadel-B-gem-panel`               | `gem-panel`        | 7       |       1 |
| `SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-shell-background` | `shell-background` | runtime |       1 |
| `SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-royal-card-back`  | `royal-card-back`  | runtime |       1 |
| `SURFACE-RUNTIME-REVIEW-current-royal-luxury-DARK-shell-background`  | `shell-background` | runtime |       1 |
| `SURFACE-RUNTIME-REVIEW-current-dark-arcane-DARK-shell-background`   | `shell-background` | runtime |       1 |
| `SURFACE-RUNTIME-REVIEW-current-pearl-opaline-DARK-shell-background` | `shell-background` | runtime |       1 |
| `SURFACE-RUNTIME-REVIEW-current-pearl-opaline-DARK-player-zone`      | `player-zone`      | runtime |       1 |

## Warnings

- None

## Execution

- Validate: `pnpm visual-lab:surface:review:validate -- --plan <this-json>`
- Delete rating-1 sets: `pnpm visual-lab:surface:review:apply -- --plan <this-json> --phase delete-rating1 --confirm-delete-rating1`
- Prepare replacement prompts: `pnpm visual-lab:surface:review:prepare-replacements -- --plan <this-json>`
- Finalize replacements: `pnpm visual-lab:surface:review:finalize-replacements -- --plan <this-json> --sources <generated-source-map.json>`
