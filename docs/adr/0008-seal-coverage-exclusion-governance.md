# ADR-0008: Govern Seal Coverage Exclusions as Reviewed Assets

## Status

Accepted

## Context

The seal coverage gate now uses `apps/desktop/vitest.config.ts` and whole-repo coverage, but a reviewed exclusion list still exists for visual leaves, static data, and thin CLI/bootstrap wrappers. The 2026-04-21 independent audit called out that these exclusions remained process debt because they had no periodic review cadence and no shell-specific exception rule.

## Decision

Treat `packages/config-vitest/sealExclusions.js` as a governed asset with these rules:

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

## Monthly ledger and per-entry ownerRole (P3-2)

Each seal exclusion entry in `packages/config-vitest/sealExclusions.js` carries an explicit **`ownerRole`** (one of: Frontend Platform, Domain Logic, Networking, Desktop Platform, Release Engineering) so debt can be rolled up by owning team, not only by `category`. The review snapshot (`tools/governance/seal-exclusions-review.snapshot.json`) still documents category-level reviewer defaults via `ownerRolesByCategory`; `reviewPolicy.requiredEntryFields` includes `ownerRole` so the contract stays machine-readable.

`tools/governance/seal-exclusions-monthly.snapshot.json` freezes **`totals.byOwnerRole`** and **`totals.byCategory`** for a given `month` (YYYY-MM). When exclusions or inferred roles change, `pnpm seal-exclusions:check` fails until maintainers run **`pnpm seal-exclusions:refresh-monthly`** (optionally `--month YYYY-MM`) and commit the updated snapshot—typically as part of a monthly governance PR.
