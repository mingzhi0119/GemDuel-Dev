# LinkedIn / GitHub / Resume Snippets

## GitHub README Project Section

GemDuel is a React, TypeScript, and Electron desktop strategy-game project organized as a pnpm/Turborepo monorepo. The repository separates Electron runtime code, shared game/domain logic, reusable UI, TURN credential service code, and governance scripts into dedicated workspaces.

My strongest technical work in this repo is around verification and tooling: Replay vNext schema/read/write/audit paths, backend AI replay generation, replay roundtrip UI tests, authoritative replay sync safeguards, Electron IPC governance, and Visual Lab tooling for reviewing surface/theme candidates. Current local verification is honest rather than inflated: workspace typechecks and several governance checks pass, while full test runs currently need lifecycle seal-exclusion review renewal before I would claim green certification.

## LinkedIn Project Description

Built GemDuel, a React + TypeScript + Electron strategy-game desktop project, as a monorepo with shared domain logic, reusable UI, desktop runtime code, and governance scripts. Focused on replay validation, testable game-state transitions, Electron boundary checks, Visual Lab game-tooling workflows, and evidence-based build/release governance. Current portfolio claims are backed by code paths, tests, and command results rather than production or user-count claims.

## Resume Project Block

GemDuel - React/TypeScript/Electron desktop strategy game

- Built a pnpm/Turborepo monorepo separating Electron runtime code, shared domain logic, reusable UI, TURN service code, and governance tooling. Evidence: E001.
- Implemented Replay vNext infrastructure with schema validation, state hashing, read/write/audit APIs, and backend AI replay generation for QA samples. Evidence: E003.
- Added replay roundtrip and authoritative replay sync coverage for import/navigation/export flows, full/delta sync, stale revision checks, and state-hash mismatch handling. Evidence: E004, E005.
- Configured governance checks for architecture budgets, package boundaries, Electron IPC policy, dependency health, release checks, and evidence artifacts; current lifecycle certification needs seal-exclusion review renewal. Evidence: E006, E008.
- Built Visual Lab dev tooling for surface/theme candidate review with ratings, comments, shared review state, and regression coverage. Evidence: E007.

## Portfolio Website Project Block

GemDuel is the project I would use to discuss engineering depth rather than launch metrics. It is a desktop game codebase with replay infrastructure, deterministic state validation, UI regression tests, desktop runtime boundaries, and game-tooling workflows. The project is especially relevant to early-career SWE, QA automation, DevTools, Build/Release, Game Tools, and AI-assisted engineering roles because it shows how I turn a complex hobby/product codebase into verifiable engineering evidence.

Key proof points:

- Replay VNext schema/read/write/audit infrastructure.
- UI replay roundtrip tests for import, history navigation, and export.
- Authoritative replay sync with revision and state-hash safeguards.
- Visual Lab dev tooling for reviewing surface/theme candidates.
- Architecture, boundary, dependency, desktop, and release governance checks.
- Truth audit that records current failing lifecycle checks instead of hiding them.
