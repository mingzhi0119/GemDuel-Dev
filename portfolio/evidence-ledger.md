# GemDuel Portfolio Evidence Ledger

Generated: 2026-05-25

Scope: repository-grounded evidence for truthful US early-career software engineering portfolio material. This ledger does not claim production use, external adoption, revenue, users, completed Unity migration on `main`, or quantified impact unless directly stated.

## Evidence Summary

| Evidence ID | Category                      | What the evidence proves                                                                                                                                                                    | What it does not prove                                                                                                      | Confidence                                                         |
| ----------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| E001        | TypeScript/Electron           | GemDuel is a pnpm + Turborepo monorepo with a React + TypeScript + Electron desktop app and separated shared/UI/tools workspaces.                                                           | It does not prove deployment, users, or production adoption.                                                                | High                                                               |
| E002        | TypeScript/Electron           | The Electron bridge has a documented IPC allowlist, shared renderer contract types, and passing desktop governance checks.                                                                  | It does not prove complete security hardening or external security review.                                                  | High                                                               |
| E003        | Replay parity / QA automation | Replay vNext has schema, reader/writer, simulation, audit, and AI replay generation surfaces.                                                                                               | It does not prove every historical replay format is migrated; docs explicitly say old replays cannot be migrated in-app.    | High                                                               |
| E004        | Replay parity / frontend QA   | The desktop UI has a replay roundtrip test for import, step navigation, and re-export of valid replay JSON.                                                                                 | It does not prove all replay UI states are covered by screenshots or manual demos.                                          | High                                                               |
| E005        | Networking / replay sync      | Authoritative replay sync uses full and delta sync, revision checks, and state-hash validation in desktop networking hooks.                                                                 | It does not prove real-world network reliability or live multiplayer uptime.                                                | High                                                               |
| E006        | CI/testing / governance       | CI workflows and local scripts run dependency, boundary, architecture, coverage, desktop, release, and governance evidence gates.                                                           | Current full lifecycle certification is not passing because seal-exclusion reviews are overdue.                             | Medium                                                             |
| E007        | Game tooling                  | Visual Lab is a dev-only visual review tool with candidate asset loading, review-state persistence, ratings, comments, and tests.                                                           | It does not prove release-facing art readiness or IP/provenance clearance.                                                  | High                                                               |
| E008        | Current verification          | Direct workspace typechecks passed; architecture, boundary, desktop, dependency, and release checks passed; full tests currently fail on governance lifecycle review staleness.             | It does not prove full `pnpm test` or `pnpm test:coverage` is green today.                                                  | High                                                               |
| E009        | Unity migration               | Main branch contains staged Unity migration assessment/roadmap docs; remote branch `origin/codex/unity-electron-parity-candidate` contains Unity client/parity candidate files and commits. | It does not prove the Unity migration is merged to `main`, complete, release-ready, or currently verified in this worktree. | Medium for branch existence; Low for resume wording until verified |

## Evidence Details

### E001 - Monorepo, React/TypeScript/Electron, and workspace boundaries

- Claim category: TypeScript/Electron, architecture/design.
- What it proves: The repository is organized as a pnpm + Turborepo workspace with desktop, shared, UI, TURN service, and tools areas.
- What it does not prove: Production usage, external users, or business impact.
- Relevant files:
    - `README.md:3` says the repo is a pnpm + Turborepo monorepo for a React + TypeScript + Electron strategy game.
    - `README.md:54-59` lists `apps/desktop`, `packages/shared`, `packages/ui`, `packages/turn-service`, `tools/scripts`, and `tools/governance`.
    - `package.json:12`, `package.json:17`, `package.json:36`, `package.json:47`, `package.json:55` define root architecture, build, lint, test, and typecheck scripts.
    - `apps/desktop/package.json:15`, `apps/desktop/package.json:18`, `apps/desktop/package.json:22-23` define Vite build, Electron build, Vitest, and coverage scripts.
- Relevant commits: evidence collection originally referenced `main` at `5532a0b`; GPT Pro portfolio integration was reviewed at `1158341f4ac3d15d98a9513f7c4ad6e3f2acd047`.
- Latest verification:
    - `corepack pnpm --dir apps/desktop typecheck` passed.
    - `corepack pnpm --dir packages/shared typecheck` passed.
    - `corepack pnpm --dir packages/ui typecheck` passed.
    - `corepack pnpm --dir tools/scripts typecheck` passed.
    - `corepack pnpm --dir packages/turn-service typecheck` passed.
- Confidence: High.

### E002 - Governed Electron bridge and desktop runtime checks

- Claim category: TypeScript/Electron, build/release, desktop runtime.
- What it proves: Electron renderer-visible APIs are documented in an allowlist and checked by governance scripts.
- What it does not prove: Complete security/compliance maturity or third-party security review.
- Relevant files:
    - `docs/governance/electron-ipc-allowlist.md:3` defines renderer-visible capabilities crossing the Electron boundary.
    - `docs/governance/electron-ipc-allowlist.md:13-16` lists LAN matchmaking and replay export bridge methods.
    - `docs/governance/electron-ipc-allowlist.md:22` lists peer-ready reporting.
    - `docs/governance/electron-ipc-allowlist.md:26` lists LAN matchmaking events.
    - `docs/governance/electron-ipc-allowlist.md:44` says `pnpm desktop:check` verifies BrowserWindow flags, preload API drift, and the allowlist.
    - `docs/governance/boundary-inventory.md:16-17` maps IPC bridge and desktop-window security to files, signals, and checks.
    - `packages/shared/src/types/desktop.ts:64` defines `ElectronBridge`; `packages/shared/src/types/desktop.ts:74` includes `saveReplayToFolder`.
    - `tools/scripts/check-electron-governance.mjs:12-38` reads the preload contract and Electron policy files.
- Latest verification:
    - `pnpm --dir tools/scripts desktop:check` passed with a temporary local `pnpm.cmd` shim: "Desktop governance check passed" and "Runtime drill governance check passed for 6 governed scenarios."
- Confidence: High.

### E003 - Replay vNext schema, simulation, audit, and AI replay generation

- Claim category: replay parity, QA automation, game tooling.
- What it proves: Replay vNext is a supported format with public APIs for save/read/load/summary/evaluation/simulation/audit, and backend-only AI simulation can produce replay samples.
- What it does not prove: Legacy replay migration or comprehensive user-facing replay UX coverage.
- Relevant files:
    - `docs/guides/replay-vnext.md:5` states Replay vNext 1.0 is the only supported replay format in current builds.
    - `docs/guides/replay-vnext.md:55-63` lists replay APIs including save/read/load/evaluate/simulate/audit.
    - `docs/guides/replay-vnext.md:67-71` describes backend-only AI replay generation and audit usage.
    - `docs/guides/replay-vnext.md:75` says finished desktop matches auto-save Replay vNext JSON locally.
    - `docs/guides/replay-vnext.md:81` says old replays cannot be migrated in-app.
    - `packages/shared/src/replay/writer.ts:50-55` builds replay summary data.
    - `packages/shared/src/replay/writer.ts:78-109` saves Replay vNext with schema version, revision, players, and final state hash.
    - `packages/shared/src/replay/__tests__/replayVNext.test.ts:112-240` covers schema validation, summary integrity, legacy rejection, and full/delta sync behavior.
    - `packages/shared/src/replay/__tests__/simulation.test.ts:15-120` covers backend AI replay simulation and buff-enabled stability.
    - `tools/scripts/generate-ai-replays.mjs:38-45`, `tools/scripts/generate-ai-replays.mjs:146-164` define and run the CLI replay generation path.
    - `tools/scripts/audit-ai-replays.mjs:78-86`, `tools/scripts/audit-ai-replays.mjs:267-362` define and run replay audit output.
- Latest verification:
    - Replay-related tests passed inside the `apps/desktop` Vitest run, including `packages/shared/src/replay/__tests__/simulation.test.ts`, `replayVNext.test.ts`, and `audit.test.ts`.
    - The overall `apps/desktop` test command still failed due E008 lifecycle governance failures, not due replay tests.
- Confidence: High.

### E004 - Replay import, navigation, and re-export through the desktop UI

- Claim category: replay parity, frontend QA.
- What it proves: A UI-level roundtrip test imports a completed replay, sweeps backward and forward through replay steps, and exports valid replay JSON.
- What it does not prove: Full visual replay regression coverage or all edge-case replay interactions.
- Relevant files:
    - `apps/desktop/src/__tests__/replayRoundtrip.test.tsx:518` names the completed replay import/sweep/re-export scenario.
    - `apps/desktop/src/__tests__/replayRoundtrip.test.tsx:524-591` imports the fixture, navigates replay controls, and exports replay JSON.
    - `apps/desktop/src/__tests__/fixtures/replayRoundtripFixtures.ts:109-110` requires a completed replay fixture.
    - `apps/desktop/src/app/io/safeReplayImport.ts` is the replay file import boundary listed in `tools/governance/boundary-registry.snapshot.json:111-142`.
- Latest verification:
    - `apps/desktop/src/__tests__/replayRoundtrip.test.tsx` passed all 3 tests in the `apps/desktop` test run; the completed replay scenario took about 19.9s.
    - The overall `apps/desktop` command failed due E008 lifecycle governance failures.
- Confidence: High.

### E005 - Authoritative replay synchronization in networked play

- Claim category: replay parity, networking, QA automation.
- What it proves: Desktop networking maintains authoritative replay state with full sync, delta sync, revision checks, and state-hash mismatch recovery signals.
- What it does not prove: Real production network uptime, low latency, or deployed multiplayer reliability.
- Relevant files:
    - `apps/desktop/src/hooks/gameNetwork/useAuthoritativeReplaySync.ts:28-33` builds current full replay sync from the local recorder.
    - `apps/desktop/src/hooks/gameNetwork/useAuthoritativeReplaySync.ts:36-43` replaces authoritative replay only when a newer revision arrives.
    - `apps/desktop/src/hooks/gameNetwork/useAuthoritativeReplaySync.ts:46-84` handles full/delta sync, stale packet detection, replay application, and state-hash mismatch.
    - `apps/desktop/src/hooks/gameNetwork/__tests__/useAuthoritativeReplaySync.test.tsx:89-168` covers completed fixture sync, stale full replay rejection, newer revision retention, and delta sync behavior.
- Latest verification:
    - `apps/desktop/src/hooks/gameNetwork/__tests__/useAuthoritativeReplaySync.test.tsx` passed 5 tests in the `apps/desktop` run.
- Confidence: High.

### E006 - CI and governance gates

- Claim category: CI/testing, repo governance, build/release.
- What it proves: Local scripts and GitHub workflows encode architecture, boundary, dependency, coverage, desktop, release, build, and governance-evidence gates.
- What it does not prove: Current lifecycle certification is green, or that CI is comprehensive for every possible runtime path.
- Relevant files:
    - `.github/workflows/build.yml:13-14` runs release gates on Windows.
    - `.github/workflows/build.yml:57`, `69`, `72`, `84`, `93`, `96`, `99`, `108`, `153`, `155`, `165`, `169` show dependency, boundary, architecture, coverage, desktop, release, provenance, governance, build, Electron build, artifact export, and evidence checks.
    - `.github/workflows/governance.yml:51`, `63`, `66`, `85`, `119`, `122`, `125`, `137`, `144`, `148` repeat governance checks.
    - `tools/scripts/package.json:9`, `14`, `18`, `20`, `22-23`, `27`, `36-37` define governance scripts and tests.
    - `docs/governance/architecture-layer-map.md:10-17` maps architecture layers and budgets.
    - `docs/governance/boundary-inventory.md:11-20` maps governed external boundaries.
    - `tools/scripts/architectureBudgets.js:187-292` parses and enforces architecture budget contracts.
    - `tools/scripts/boundaryGovernance.js:42-168` validates boundary registry shape, references, signals, and drift.
- Latest verification:
    - `pnpm --dir tools/scripts architecture:check` passed.
    - `pnpm --dir tools/scripts boundaries:check` passed for 10 governed boundaries.
    - `pnpm --dir tools/scripts deps:check` passed, with audit summary info=0, low=0, moderate=3, high=0, critical=0.
    - `pnpm --dir tools/scripts release:check` passed.
    - `pnpm --dir tools/scripts test` failed 8 tests because lifecycle seal-exclusion reviews are overdue by 34 > 30 days.
- Confidence: Medium because strong gates exist, but current lifecycle tests are not green.

### E007 - Visual Lab game-tooling workflow

- Claim category: game tooling, agentic coding workflow, frontend tools.
- What it proves: Visual Lab supports dev-only asset review with candidate loading, local/shared review state, ratings, comments, and regression tests.
- What it does not prove: Release asset approval, legal/IP clearance, or polished production art readiness.
- Relevant files:
    - `docs/governance/operations-fault-drills.md:19` says Visual Lab is dev-tooling only and gated out of stock production bundles unless explicitly allowed.
    - `apps/desktop/vite.config.ts:223-289` exposes `/__surface-lab/candidates.json` for candidate discovery in development.
    - `apps/desktop/vite.config.ts:302-412` exposes review state and completion endpoints.
    - `apps/desktop/vite.config.ts:477-482` controls inclusion of the Visual Lab bundle.
    - `apps/desktop/src/app/visual-lab/useSurfaceLabRatings.ts:4-22`, `42-50`, `103-117` define rating storage and updates.
    - `apps/desktop/src/app/visual-lab/useSurfaceLabComments.ts:3-23`, `44-52`, `67-86` define comment storage and updates.
    - `apps/desktop/src/app/visual-lab/__tests__/visualLabRouteSmoke.test.tsx:328-590` covers persistent shared review state and clearing marks/comments.
    - `apps/desktop/src/app/visual-lab/__tests__/visualLabRouteSmoke.test.tsx:743-786` covers hydration from shared review state.
    - `apps/desktop/src/app/visual-lab/__tests__/visualLabRouteSmoke.test.tsx:1074-1189` covers rating and comment persistence.
    - `docs/prompts/omx-visual-lab-cleanup-template.md:14-16`, `62-64`, `99-103`, `109`, `129` document a reviewed cleanup flow and verification path.
- Latest verification:
    - `apps/desktop/src/app/visual-lab/__tests__/visualLabRouteSmoke.test.tsx` passed 17 tests in the `apps/desktop` run.
    - `tools/scripts/__tests__/visualLabSurfaceReviewPlan.test.ts` passed 10 tests in the `tools/scripts` run.
- Confidence: High.

### E008 - Current verification status and gaps

- Claim category: verification, truth audit.
- What it proves: TypeScript and several governance checks pass in the current local environment; full tests currently fail because lifecycle governance has overdue seal-exclusion reviews.
- What it does not prove: Current full CI readiness.
- Commands run and results:
    - `git status --short`: only `docs/GPT-Pro-Prompt.md` was untracked before portfolio files were created.
    - `pnpm typecheck`: failed immediately because `pnpm` was not on PATH.
    - `corepack pnpm --version`: passed, version `10.33.0`.
    - `corepack pnpm typecheck`: failed because Turbo could not find the package-manager binary from the current PATH.
    - `corepack enable`: failed with `EPERM` while trying to write Corepack shims under `E:\NodeJS`.
    - Direct workspace typechecks passed for `apps/desktop`, `packages/shared`, `packages/ui`, `tools/scripts`, and `packages/turn-service`.
    - `corepack pnpm --dir apps/desktop test`: failed 8 tests out of 1087 because governance lifecycle checks reported overdue seal-exclusion reviews.
    - `corepack pnpm --dir tools/scripts test`: first failed on missing bare `pnpm`; after a temporary local `pnpm.cmd` shim, it still failed 8 tests out of 122 due overdue seal-exclusion reviews.
    - `pnpm --dir tools/scripts architecture:check`: passed.
    - `pnpm --dir tools/scripts boundaries:check`: passed.
    - `pnpm --dir tools/scripts desktop:check`: passed.
    - `pnpm --dir tools/scripts deps:check`: passed with 3 moderate production audit findings and no high/critical findings.
    - `pnpm --dir tools/scripts release:check`: passed.
- Key failure:
    - `tools/scripts test` reported lifecycle seal-exclusion review failures: 97 reviewed exclusions were overdue at 34 > 30 days.
- Confidence: High.

### E009 - Unity migration evidence and limits

- Claim category: Unity migration, migration/tooling.
- What it proves: Main branch has migration planning docs; remote branch `origin/codex/unity-electron-parity-candidate` contains a Unity client/parity candidate, migration docs, golden replay fixtures, and tooling.
- What it does not prove: Unity migration is complete on `main`, release-ready, or currently verified by this worktree.
- Relevant files and commits:
    - `docs/archive/audits/unity-migration-suitability-assessment-2026-05-04.md:7` states Unity is suitable only for a long-term native release client and not an immediate full rewrite.
    - `docs/archive/audits/unity-migration-suitability-assessment-2026-05-04.md:12-14` recommends a limited vertical slice, keeping TypeScript as rules oracle, and not treating Unity migration as release readiness.
    - `docs/archive/audits/unity-migration-suitability-assessment-2026-05-04.md:73-85` frames replay/action tests as the migration acceptance corpus.
    - `docs/archive/roadmaps/unity-migration-preparation-plan-2026-05-08.md:20`, `27-28`, `140`, `144`, `158`, `568-577` recommend a staged Unity/Steam vertical slice and replay/state-hash gates.
    - `git log --oneline --decorate --graph --all -n 60` showed `origin/codex/unity-electron-parity-candidate` at `1e28cf5 feat: align Unity parity candidate surfaces`, plus preceding Unity parity/migration commits.
    - `git show --stat --oneline --decorate --max-count=1 origin/codex/unity-electron-parity-candidate` showed `263 files changed, 27034 insertions(+), 3686 deletions(-)`, including `clients/unity/**`, `tools/migration/**`, and `docs/migration/**`.
    - `git ls-tree -r --name-only origin/codex/unity-electron-parity-candidate` showed Unity assets/scripts, parity tests, `tools/migration/electron-unity-parity-runner.mjs`, `tools/migration/verify-replay-parity.ts`, and docs under `docs/migration/`.
- Latest verification:
    - The branch was inspected read-only via Git object commands. It was not checked out, built, or tested during this run.
- Confidence: Medium for "remote branch contains Unity parity candidate work"; Low for resume-ready Unity implementation wording until branch checkout and verification are performed.

## Commands Run

Successful:

- `git status --short`
- `git log --oneline --decorate --graph --all -n 60`
- `corepack pnpm --version`
- `corepack pnpm --dir apps/desktop typecheck`
- `corepack pnpm --dir packages/shared typecheck`
- `corepack pnpm --dir packages/ui typecheck`
- `corepack pnpm --dir tools/scripts typecheck`
- `corepack pnpm --dir packages/turn-service typecheck`
- `pnpm --dir tools/scripts architecture:check` with temporary local shim
- `pnpm --dir tools/scripts boundaries:check` with temporary local shim
- `pnpm --dir tools/scripts desktop:check` with temporary local shim
- `pnpm --dir tools/scripts deps:check` with temporary local shim
- `pnpm --dir tools/scripts release:check` with temporary local shim

Failed or partially failed:

- `pnpm typecheck`: `pnpm` not recognized in the current PowerShell PATH.
- `corepack pnpm typecheck`: Turbo could not find package-manager binary.
- `corepack enable`: failed with `EPERM` writing to `E:\NodeJS`.
- `corepack pnpm --dir apps/desktop test`: 1079 passed, 8 failed; failures were governance lifecycle/seal-exclusion review staleness.
- `pnpm --dir tools/scripts test` with temporary local shim: 114 passed, 8 failed; failures were governance lifecycle/seal-exclusion review staleness.
