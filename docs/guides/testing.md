# Testing

## Commands

```bash
pnpm test
pnpm test:security
pnpm test:coverage
pnpm test:coverage:seal
pnpm run seal-exclusions:check
pnpm test:ui
pnpm boundaries:check
pnpm deps:check
pnpm desktop:check
pnpm release:check
```

## What We Verify

| Layer               | Goal                                                 | Main Evidence                                                                                        |
| ------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Domain logic        | Reject invalid actions before mutation               | `packages/shared/src/logic/__tests__/**`                                                             |
| Network / authority | Fail closed on malformed packets and stale decisions | `packages/shared/src/logic/__tests__/**`, `apps/desktop/src/hooks/__tests__/useGameNetwork.test.tsx` |
| Replay import       | Reject bad files and invalid history                 | `apps/desktop/src/app/io/__tests__/**`, `packages/shared/src/logic/__tests__/replayImport.test.ts`   |
| Desktop shell       | Freeze BrowserWindow, preload, and IPC policy        | `apps/desktop/electron/__tests__/**`, `tools/scripts/check-electron-governance.mjs`                  |
| Release governance  | Keep docs, thresholds, artifacts, and drills aligned | `tools/scripts/__tests__/**`, `pnpm release:check`                                                   |

## Default Workflow

1. Run `pnpm test` while changing gameplay logic.
2. Run `pnpm test:coverage` before merging larger refactors. This now aliases the seal gate and uses `apps/desktop/vitest.config.ts` as the seal baseline.
3. Run `pnpm boundaries:check`, `pnpm deps:check`, `pnpm run seal-exclusions:check`, and `pnpm desktop:check` before release work.
4. Run `pnpm release:check` whenever release-health docs or telemetry change.

## Test Writing Rules

- Put tests next to the code they govern.
- Prefer deterministic negative-path cases over prose-only explanations.
- Add property or matrix coverage when a rule has many combinations.
- Keep seal-coverage exclusions explicit in `packages/config-vitest/sealExclusions.ts`; do not add broad implicit ignores.
- Every seal exclusion entry must record `category`, `lastReviewedOn`, and `reviewCadenceDays`.
- Shell-category seal exclusions must link to an ADR and carry smoke-test coverage for their composition surface.
- `pnpm run seal-exclusions:check` is the governance gate that enforces review cadence and shell-only ADR usage.
- Update the related governance doc in `docs/governance/` if a new boundary or runtime contract is introduced.
