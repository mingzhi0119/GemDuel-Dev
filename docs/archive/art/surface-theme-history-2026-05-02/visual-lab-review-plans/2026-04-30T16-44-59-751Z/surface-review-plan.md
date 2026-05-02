# Visual Lab Surface Review Plan - 2026-04-30T16:44:59.751Z

## Summary

- Schema: `gemduel.visualLab.surfaceReviewPlan.v1`
- Origin: `http://localhost:5173`
- Candidate complete sets: 43
- Runtime sets observed: 5
- Delete rating-1 sets: 0
- Kept rated sets: 0
- Regenerate marked slots: 11
- Warnings: 0

## Delete Sets

| Set id | Rating | Assets |
| ------ | -----: | -----: |

## Keep Sets

| Set id | Rating |
| ------ | -----: |

## Regenerate Slots

| Prompt id                                                              | Slot               | Rating  | Targets |
| ---------------------------------------------------------------------- | ------------------ | ------- | ------: |
| `SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-shell-background`   | `shell-background` | runtime |       1 |
| `SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-topbar`             | `topbar`           | runtime |       1 |
| `SURFACE-RUNTIME-REVIEW-current-crystal-anime-DARK-gem-panel`          | `gem-panel`        | runtime |       1 |
| `SURFACE-RUNTIME-REVIEW-current-royal-luxury-DARK-shell-background`    | `shell-background` | runtime |       1 |
| `SURFACE-RUNTIME-REVIEW-current-royal-luxury-DARK-player-zone`         | `player-zone`      | runtime |       1 |
| `SURFACE-RUNTIME-REVIEW-current-royal-luxury-DARK-royal-card-back`     | `royal-card-back`  | runtime |       1 |
| `SURFACE-RUNTIME-REVIEW-current-dark-arcane-DARK-shell-background`     | `shell-background` | runtime |       1 |
| `SURFACE-RUNTIME-REVIEW-current-clean-boardgame-DARK-shell-background` | `shell-background` | runtime |       1 |
| `SURFACE-RUNTIME-REVIEW-current-clean-boardgame-DARK-player-zone`      | `player-zone`      | runtime |       1 |
| `SURFACE-RUNTIME-REVIEW-current-pearl-opaline-DARK-shell-background`   | `shell-background` | runtime |       1 |
| `SURFACE-RUNTIME-REVIEW-current-pearl-opaline-DARK-player-zone`        | `player-zone`      | runtime |       1 |

## Warnings

- None

## Execution

- Validate: `pnpm visual-lab:surface:review:validate -- --plan <this-json>`
- Delete rating-1 sets: `pnpm visual-lab:surface:review:apply -- --plan <this-json> --phase delete-rating1 --confirm-delete-rating1`
- Prepare replacement prompts: `pnpm visual-lab:surface:review:prepare-replacements -- --plan <this-json>`
- Finalize replacements: `pnpm visual-lab:surface:review:finalize-replacements -- --plan <this-json> --sources <generated-source-map.json>`
