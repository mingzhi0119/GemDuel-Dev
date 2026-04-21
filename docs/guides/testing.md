# Testing

## Commands

```bash
npm test
npm run test:security
npm run test:coverage
npm run test:coverage:seal
npm run seal-exclusions:check
npm run test:ui
npm run boundaries:check
npm run deps:check
npm run desktop:check
npm run release:check
```

## What We Verify

| Layer               | Goal                                                 | Main Evidence                                                           |
| ------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------- |
| Domain logic        | Reject invalid actions before mutation               | `src/logic/__tests__/**`                                                |
| Network / authority | Fail closed on malformed packets and stale decisions | `src/logic/__tests__/**`, `src/hooks/__tests__/useGameNetwork.test.tsx` |
| Replay import       | Reject bad files and invalid history                 | `src/app/io/__tests__/**`, `src/logic/__tests__/replayImport.test.ts`   |
| Desktop shell       | Freeze BrowserWindow, preload, and IPC policy        | `electron/__tests__/**`, `scripts/check-electron-governance.mjs`        |
| Release governance  | Keep docs, thresholds, artifacts, and drills aligned | `scripts/__tests__/**`, `npm run release:check`                         |

## Default Workflow

1. Run `npm test` while changing gameplay logic.
2. Run `npm run test:coverage` before merging larger refactors. This now aliases the seal gate and uses the default `vitest.config.ts`.
3. Run `npm run boundaries:check`, `npm run deps:check`, `npm run seal-exclusions:check`, and `npm run desktop:check` before release work.
4. Run `npm run release:check` whenever release-health docs or telemetry change.

## Test Writing Rules

- Put tests next to the code they govern.
- Prefer deterministic negative-path cases over prose-only explanations.
- Add property or matrix coverage when a rule has many combinations.
- Keep seal-coverage exclusions explicit in `vitest.seal.exclusions.ts`; do not add broad implicit ignores.
- Every seal exclusion entry must record `category`, `lastReviewedOn`, and `reviewCadenceDays`.
- Shell-category seal exclusions must link to an ADR and carry smoke-test coverage for their composition surface.
- `npm run seal-exclusions:check` is the governance gate that enforces review cadence and shell-only ADR usage.
- Update the related governance doc in `docs/governance/` if a new boundary or runtime contract is introduced.
