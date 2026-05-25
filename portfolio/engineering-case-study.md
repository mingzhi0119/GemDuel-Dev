# Engineering Case Study

## Problem

GemDuel is a local desktop board/card strategy game with enough rules, UI state, replay behavior, and networking surface that casual manual testing is fragile. The project needed reusable domain logic, deterministic replay evidence, Electron runtime boundaries, and internal tooling for visual iteration without turning every change into a release-risk guess.

## Constraints

- Keep `packages/shared` pure and free of React/Electron/DOM dependencies.
- Keep Electron bridge APIs explicit and governed.
- Do not claim production use, external adoption, or release readiness without evidence.
- Keep generated replay outputs local unless policy changes.
- Treat Unity migration as staged and evidence-gated, not complete.

## Architecture / Tools

- `apps/desktop`: Electron main/preload, Vite renderer, routes, hooks, runtime config, replay IO, Visual Lab.
- `packages/shared`: domain logic, network protocol, replay schema/reader/writer/audit/simulation.
- `packages/ui`: reusable React UI components and view helpers.
- `tools/scripts`: architecture, boundary, dependency, desktop, release, governance, replay, and Visual Lab tooling.
- CI: GitHub workflows run governance/build/release gates on Windows.

## What I Implemented

- Replay VNext infrastructure with schema validation, replay summaries, state hashes, AI replay generation, and audit tooling. Evidence: E003.
- Replay UI roundtrip tests covering import, step navigation, and re-export of valid replay JSON. Evidence: E004.
- Authoritative replay sync safeguards for full/delta sync, revision checks, stale packets, and state-hash mismatches. Evidence: E005.
- Visual Lab dev tooling for candidate asset review, ratings, comments, shared review state, and test coverage. Evidence: E007.
- Governance scripts and docs for architecture budgets, boundary registry validation, Electron IPC allowlists, dependency gates, and release health checks. Evidence: E002, E006.

## Testing / CI / Validation

Current local validation on 2026-05-25:

- Direct workspace typechecks passed for desktop, shared, UI, tools/scripts, and turn-service.
- `architecture:check`, `boundaries:check`, `desktop:check`, `deps:check`, and `release:check` passed through direct workspace scripts.
- Full `apps/desktop` and `tools/scripts` Vitest runs failed because lifecycle/seal-exclusion reviews are overdue; many functional test files passed, including replay, Visual Lab, networking, and governance-unit tests.

## Tradeoffs

- Replay and governance systems add process overhead, but they make claims and regressions easier to verify.
- Visual Lab is intentionally dev-only; keeping it out of normal release bundles reduces accidental release surface but requires explicit dev tooling.
- Unity migration documentation is valuable planning evidence, but resume wording must stay conservative until branch code is merged and verified.

## What I Would Improve Next

- Renew seal-exclusion review metadata so lifecycle certification can pass again.
- Re-run full `pnpm test`, `pnpm test:coverage`, and `pnpm governance:artifacts`.
- Capture screenshots/videos for replay roundtrip, Visual Lab surface review, and desktop runtime flows.
- Check out the Unity parity candidate branch in a separate worktree and run its migration verification commands before using implementation claims.

## Evidence Links

- E001: monorepo and workspace structure.
- E002: governed Electron bridge.
- E003: Replay VNext infrastructure.
- E004: replay UI roundtrip.
- E005: authoritative replay sync.
- E006: CI/governance gates.
- E007: Visual Lab tooling.
- E008: current verification.
- E009: Unity migration docs/branch evidence.
