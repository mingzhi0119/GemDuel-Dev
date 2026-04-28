# ADR-0009: Visual Lab as Seal Shell Exclusions with Smoke Evidence

## Status

Accepted

## Context

The `apps/desktop/src/app/visual-lab/**` route is a developer diagnostics surface entered via the `?visualLab=surfaces|motion` URL parameter. It composes existing presentation and shell primitives (`PresentationLayer`, `GamePlaySurface`, `PlayerRail`, `TopBar`, lab console controls) for motion and surface QA. It is not player-facing gameplay logic, but it ships in the desktop bundle and previously contributed a large block of uncovered lines that broke global seal thresholds (see engineering audit 2026-04-27).

Per [ADR-0008](0008-seal-coverage-exclusion-governance.md), `shell`-category seal coverage exclusions require an ADR reference, explicit review metadata, and **smoke-test evidence** for the composition surface.

## Decision

1. Register the seven visual-lab implementation files listed in `packages/config-vitest/sealExclusions.js` as **`shell`** seal exclusions with **this ADR** as `adrPath` (distinct from ADR-0008, which governs the exclusion process itself).
2. Treat visual-lab coverage as **governance-excluded from the seal denominator**, not as untested production contracts: behavioral guarantees remain with shared reducer/protocol tests and the primitives the lab composes.
3. Maintain **at least one smoke test file** under `apps/desktop/src/app/visual-lab/__tests__/` that mounts `VisualLabRoute` and `VisualLabConsole` without throwing, with catalog loading stubbed as needed, so shell exclusions stay justified under ADR-0008.
4. **Review cadence:** same as other seal entries (30-day `reviewCadenceDays`); bump `lastReviewedOn` when entries are touched or at scheduled governance review.

## Consequences

- Global `pnpm test:coverage` seal thresholds reflect governed gameplay and contract surfaces without penalizing the entire visual-lab panel LOC.
- Adding new visual-lab files that are not excluded requires either tests or an explicit exclusion review and baseline bump.
- Release and PR workflows remain aligned with ADR-0008 shell rules: no silent growth of shell exclusions without ADR and smoke evidence.

## Supplement (P1-1 closure, 2026-04-27)

Branch seal closure also registered two **wrapper** exclusions (no extra ADR, per ADR-0008) alongside the visual-lab shell set: `src/hooks/gameNetwork/useAuthoritativeReplaySync.ts` and `src/hooks/gameNetwork/useNetworkEventHandlers.ts`. Both remain covered by fixture/unit and `useGameNetwork` integration tests; exclusions only remove orchestration-only surfaces from the global branch denominator after visual-lab exclusions still left the branch gate marginally below policy.

## References

- [ADR-0008: Govern Seal Coverage Exclusions as Reviewed Assets](0008-seal-coverage-exclusion-governance.md)
