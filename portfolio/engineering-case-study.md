# Engineering Case Study

## GPT Pro Polished Opening

GemDuel started as a game project, but the most interesting engineering work became the verification layer around it: replay correctness, desktop boundaries, developer review tooling, and repository governance. The project is a pnpm/Turborepo monorepo built around a React + TypeScript + Electron desktop app, with shared game logic separated from UI/runtime code and additional workspaces for reusable UI, TURN service code, and governance scripts. That structure made it possible to test game behavior and repo boundaries without treating the Electron app as one large unstructured surface. `[E001, E008]`

The core technical thread is Replay VNext. Instead of treating replay files as informal debug output, I worked around a replay format with schema validation, read/write APIs, replay summaries, final-state hashing, simulation, and audit tooling. This supports repeatable QA workflows: completed replay fixtures can be imported into the desktop UI, stepped through, and re-exported as valid Replay VNext JSON; backend simulation can generate AI-vs-AI replay samples for audit; and network replay sync code uses full/delta sync, revision guards, stale packet checks, and state-hash mismatch handling before accepting authoritative replay updates. `[E003, E004, E005, E008]`

A second thread is developer tooling. Visual Lab is scoped as a dev-only surface/theme review workflow, not a release asset approval system. It supports candidate asset discovery, persistent ratings, comments, shared review state, and regression-tested route behavior. This gives the project a concrete review loop for visual candidates while keeping provenance and release-readiness claims out of scope. `[E007, E008]`

The repo also includes governance checks for architecture budgets, package boundaries, Electron IPC policy, dependency health, release checks, and evidence artifacts. I do not claim every check is green: current records show direct workspace typechecks and several governance checks passing, while full lifecycle certification still needs seal-exclusion review renewal. Unity is also intentionally framed as staged migration planning and remote parity-candidate evidence, not a completed migration. `[E002, E006, E008, E009]`

## Detailed Case Study Body

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
