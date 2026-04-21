# ADR-0008: Govern Seal Coverage Exclusions as Reviewed Assets

## Status

Accepted

## Context

The seal coverage gate now uses `apps/desktop/vitest.config.ts` and whole-repo coverage, but a reviewed exclusion list still exists for visual leaves, static data, and thin CLI/bootstrap wrappers. The 2026-04-21 independent audit called out that these exclusions remained process debt because they had no periodic review cadence and no shell-specific exception rule.

## Decision

Treat `packages/config-vitest/sealExclusions.ts` as a governed asset with these rules:

- Every exclusion entry must stay explicit and machine-readable.
- Every exclusion entry must record `category`, `lastReviewedOn`, and `reviewCadenceDays`.
- Exclusion review cadence is capped at 30 days.
- Only `shell` exclusions may carry an ADR reference.
- Shell exclusions must keep smoke-test coverage for their composition surfaces.
- Any increase above the reviewed baseline exclusion count must fail the governance gate until it is explicitly re-reviewed.

## Consequences

- Visual leaves, static catalogs, and thin wrappers may remain excluded without pretending they are fully covered contracts.
- Composition-shell exclusions stay possible, but only as deliberate, time-bounded governance debt with an ADR and smoke-test evidence.
- The daily governance patrol and PR/release workflows can fail when exclusion metadata goes stale, forcing periodic review instead of silent drift.
