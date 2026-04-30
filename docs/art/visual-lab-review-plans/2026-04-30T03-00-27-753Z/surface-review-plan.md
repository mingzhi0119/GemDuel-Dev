# Visual Lab Surface Review Plan - 2026-04-30T03:00:27.753Z

## Summary

- Schema: `gemduel.visualLab.surfaceReviewPlan.v1`
- Origin: `http://127.0.0.1:5173`
- Candidate complete sets: 43
- Runtime sets observed: 5
- Delete rating-1 sets: 0
- Kept rated sets: 0
- Regenerate marked slots: 0
- Warnings: 0

## Delete Sets

| Set id | Rating | Assets |
| ------ | -----: | -----: |

## Keep Sets

| Set id | Rating |
| ------ | -----: |

## Regenerate Slots

| Prompt id | Slot | Rating | Targets |
| --------- | ---- | -----: | ------: |

## Warnings

- None

## Execution

- Validate: `pnpm visual-lab:surface:review:validate -- --plan <this-json>`
- Delete rating-1 sets: `pnpm visual-lab:surface:review:apply -- --plan <this-json> --phase delete-rating1 --confirm-delete-rating1`
- Prepare replacement prompts: `pnpm visual-lab:surface:review:prepare-replacements -- --plan <this-json>`
- Finalize replacements: `pnpm visual-lab:surface:review:finalize-replacements -- --plan <this-json> --sources <generated-source-map.json>`
