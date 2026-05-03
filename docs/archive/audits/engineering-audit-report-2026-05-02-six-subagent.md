# GemDuel-Dev Independent Engineering Audit 2026-05-02

## Completion Status

- Status: **Completed and remediated**
- Completion date: **2026-05-02**
- Closure basis: confirmed P1/P2 findings `F-001` through `F-016` were remediated in the follow-up engineering pass, with local validation rerun from the repository root.
- Closure evidence: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:coverage`, `pnpm test:security`, `pnpm boundaries:check`, `pnpm architecture:check`, `pnpm deps:check`, `pnpm desktop:check`, `pnpm release:check`, `pnpm build`, `pnpm bundle:check`, `pnpm licenses:check`, `pnpm sbom:check`, `pnpm secrets:check`, `pnpm seal-exclusions:check`, `pnpm repo-settings:check`, `pnpm codeowners:check`, `pnpm changelog:check`, `pnpm audit:gates --out-dir artifacts/governance`, `pnpm bench`, `pnpm governance:report`, `pnpm lifecycle:certify`, `pnpm governance:artifacts --out-dir artifacts/governance`, `pnpm governance:evidence:check --artifacts-dir artifacts/governance`, and `pnpm governance:dashboard --artifacts-dir artifacts/governance` passed.
- Not a packaging certification: `pnpm electron:build` was not run from WSL/Linux because the release target remains Windows NSIS only. `pnpm release:provenance:check` requires tag/CI provenance context and is not a local non-tag gate.
- Scope boundary retained: cancelled Phase 2 right-click / drag direct-buy stayed cancelled; desktop packaging scope stayed Windows NSIS only.

## Executive Summary

- Overall score: **8.1 / 10**
- Risk posture: **High** for public/LAN release readiness until the P1 items below are triaged; **Medium** for local development because local gates are broadly green.
- Summary: This audit launched exactly six specialist subagents across desktop runtime, renderer state, shared domain logic, UI, TURN/networking, and governance tooling, then reconciled their reports with main-agent local validation. The repository has strong pnpm/Turborepo governance, green local quality gates, high coverage, Windows NSIS release discipline, and substantial boundary documentation. The main confirmed risks are not build failures: they are boundary-trust issues in shared purity, LAN packet validation, TURN transport security, online/replay mode teardown, LAN IPC rejection handling, and governance evidence semantics that can overstate assurance.

## Local Evidence Run

Initial evidence:

- `pwd` -> `/home/sange/projects/GemDuel-Dev`
- `git branch --show-current` -> `main`
- `git status --short` before report -> pre-existing `M docs/archive/README.md` and untracked prompt doc
- `node -v` -> `v24.14.1`
- `pnpm -v` -> `10.33.0`
- `rg --files | wc -l` -> `1682`

Validation commands run by the main agent:

- `pnpm lint` -> passed
- `pnpm typecheck` -> passed
- `pnpm test` -> passed, 157 files / 988 tests
- `pnpm test:coverage` -> passed, 157 files / 988 tests, all files 94.97 statements / 88.42 branches / 97.10 functions / 94.97 lines, key-module per-file report passed with 0 violations
- `pnpm architecture:check` -> passed
- `pnpm boundaries:check` -> passed for 10 governed boundaries
- `pnpm deps:check` -> passed, production audit summary 0 vulnerabilities across severities
- `pnpm desktop:check` -> passed, runtime drill governance passed for 6 scenarios
- `pnpm release:check` -> passed
- `pnpm build` -> passed, Vite production build emitted desktop renderer assets
- `pnpm bundle:check` -> passed, main runtime chunk 276.7 kB below 600 kB warning threshold
- `pnpm test:security` -> passed, 12 files / 72 tests
- `pnpm bench` -> passed, wrote lifecycle benchmark report
- `pnpm governance:report` -> passed
- `pnpm lifecycle:certify` -> passed, local score 10/10
- `pnpm governance:artifacts --out-dir artifacts/governance` -> passed after benchmark evidence was collected
- `pnpm governance:evidence:check --artifacts-dir artifacts/governance` -> passed
- `pnpm licenses:check` -> passed, 13 allowed licenses
- `pnpm sbom:check` -> passed, 704 components
- `pnpm secrets:check` -> passed, scanned 1136 text files and 21 governed env names
- `pnpm seal-exclusions:check` -> passed for 97 reviewed exclusions
- `pnpm repo-settings:check` -> passed desired-state snapshot
- `pnpm codeowners:check` -> passed
- `pnpm changelog:check` -> passed
- `pnpm audit:gates --out-dir artifacts/governance` -> passed
- `pnpm release:artifacts:check` -> completed as `skipped-no-artifacts`

Commands not run:

- `pnpm electron:build` was not run because this audit is read-only and the current environment is WSL/Linux while desktop packaging scope is Windows NSIS only.
- Remote CI / GitHub live settings were not inspected, per prompt limits.
- Browser visual verification was not run because this was a source/governance engineering audit, not a rendered UI review.
- Production systems and external TURN deployments were not contacted.

Important command note: the first `pnpm governance:artifacts -- --out-dir artifacts/governance` invocation failed with lifecycle benchmark evidence not yet collected. After `pnpm bench` and `pnpm governance:report`, the corrected `pnpm governance:artifacts --out-dir artifacts/governance` and evidence health check passed.

## Subagent Coverage Map

| Subagent | Surface                                                 | Evidence Count | Highest PN | Confidence                    |
| -------- | ------------------------------------------------------- | -------------: | ---------- | ----------------------------- |
| A        | Desktop runtime, Electron, packaging                    |             24 | P2         | High source, Medium packaging |
| B        | Renderer app, routes, hooks, networked state            |             18 | P1         | High                          |
| C        | Shared domain logic, protocol, data, lexicon            |             20 | P1         | High                          |
| D        | Reusable UI package and component contracts             |             18 | P2         | High                          |
| E        | TURN service, networking security, boundary enforcement |             26 | P1         | High                          |
| F        | Governance tooling, CI, monorepo config, release gates  |             28 | P2         | High                          |

## Top Findings

### F-001: `packages/shared` violates the pure-domain boundary

- PN rating: **P1**
- Affected files/directories: `packages/shared/src/constants.ts`, `packages/shared/src/utils.ts`, `packages/shared/src/observability/releaseHealth.ts`, `packages/shared/package.json`
- Evidence: `constants.ts:1` imports `lucide-react`; `constants.ts:117-124` stores React icon components in `ABILITIES`; `utils.ts:142-146` imports `clsx` and `tailwind-merge`; `releaseHealth.ts:19-30` references `window.electron`; `packages/shared/package.json:15-18` depends on UI/runtime helper packages.
- Impact: This conflicts with AGENTS.md and architecture docs requiring `packages/shared` to stay pure. It also makes domain reuse, test isolation, and boundary reasoning weaker.
- Recommended remediation: Move icon maps, class merging, and renderer health forwarding out of `packages/shared`; keep shared metadata serializable and framework-neutral.
- Concrete steps: create UI-side ability icon mapping; move `cn` to `packages/ui`; keep `ReleaseHealthEvent` type in shared but move `window.electron` forwarding to `apps/desktop`; remove `lucide-react`, `clsx`, and `tailwind-merge` from shared if no remaining imports exist.
- Acceptance criteria: `rg "lucide-react|from 'react'|window|document|tailwind-merge|clsx" packages/shared/src packages/shared/package.json` finds no unapproved runtime coupling; shared typecheck and boundary gates pass.
- Verification command(s): `pnpm --filter @gemduel/shared typecheck`; `pnpm boundaries:check`; `pnpm architecture:check`; `pnpm deps:check`.
- Rollback note: revert the extraction in one commit if UI icon rendering or release-health forwarding regresses; shared data shape should remain backward-compatible.
- Confidence: High.

### F-002: LAN pregame packets can be spoofed after discovery

- PN rating: **P1**
- Affected files/directories: `apps/desktop/electron/lanDiscoveryServiceHandlers.js`, `apps/desktop/electron/lanDiscoveryPregame.js`, `apps/desktop/electron/lanDiscoverySession.js`
- Evidence: `lanDiscoveryServiceHandlers.js:173-179` emits launch from `applyIncomingStartReady`; `lanDiscoveryPregame.js:20-43` accepts `START_READY` using only `roomId` before trusting host address, port, peer id, host player, and mode; `lanDiscoverySession.js:103-126` has stronger heartbeat identity checks but `START_READY` lacks equivalent nonce/session binding.
- Impact: A same-LAN attacker can race or inject a launch packet for a visible room and redirect the client toward attacker-controlled connection metadata or disrupt the mode.
- Recommended remediation: Add strict packet schemas and bind all pregame packets to host/guest instance ids and nonces.
- Concrete steps: add per-kind Zod schemas; include host/guest nonces on `SELECT_MODE`, `START_REQUEST`, `START_READY`, and `CANCEL`; validate private host address and port range; add forged/stale/wrong-instance negative tests.
- Acceptance criteria: forged `START_READY` cannot mutate session state or emit `launch`.
- Verification command(s): `pnpm --dir apps/desktop exec vitest run electron/__tests__/lanDiscoveryServiceHandlers.test.ts electron/__tests__/lanDiscoveryService.test.ts`; `pnpm test:security`; `pnpm desktop:check`.
- Rollback note: keep the previous packet shape behind a temporary compatibility shim only for tests if needed; do not weaken nonce validation once added.
- Confidence: High.

### F-003: TURN service bearer token can be sent over non-loopback HTTP

- PN rating: **P1**
- Affected files/directories: `apps/desktop/electron/runtimeConfig.js`, `apps/desktop/electron/turnCredentialClient.js`, `docs/governance/dependency-runtime-governance.md`
- Evidence: `runtimeConfig.js:188-197` accepts both `http:` and `https:` service URLs; `turnCredentialClient.js:153-157` sends `Authorization: Bearer ...` to the configured URL; governance docs currently allow absolute `http` or `https`.
- Impact: Public deployments can leak TURN service bearer tokens over plaintext transport unless an external layer silently enforces TLS.
- Recommended remediation: Require `https:` for non-loopback URLs; allow `http://localhost`, `127.0.0.1`, or `::1` only for explicit local development.
- Concrete steps: update `getTurnCredentialServiceConfig`; add runtime-config tests for rejected `http://relay.example.com` and accepted loopback if retained; update governance docs to require TLS and deployment-layer rate limiting.
- Acceptance criteria: non-loopback HTTP disables TURN fetch and records governed fallback/health evidence.
- Verification command(s): `pnpm --dir apps/desktop exec vitest run electron/__tests__/runtimeConfig.test.ts electron/__tests__/turnCredentialClient.test.ts`; `pnpm test:security`.
- Rollback note: if local dev needs HTTP, keep a loopback-only exception rather than returning to broad HTTP acceptance.
- Confidence: High.

### F-004: Replay import does not exit live online/LAN context

- PN rating: **P1**
- Affected files/directories: `apps/desktop/src/App.tsx`, `apps/desktop/src/app/io/useReplayIO.ts`, `apps/desktop/src/hooks/useActionHistory.ts`
- Evidence: `App.tsx:29` stores `matchmakingRoute` independently of replay import; `App.tsx:61-78` keeps networking enabled for online/LAN routes; `useReplayIO.ts:118-132` imports replay data without a callback to clear online/LAN state.
- Impact: Importing a replay while online or in LAN context can leave peer/network sync active against replay review state, causing stale packets and confusing recovery behavior.
- Recommended remediation: On successful replay import, cancel LAN search, clear launch refs, set route to `none`, and disable online connection before entering review mode.
- Concrete steps: add `onReplayImportSuccess`; wire App-level cleanup; add regression test for online route + replay import -> no network connection.
- Acceptance criteria: imported replay always enters local/review mode with no active network manager.
- Verification command(s): `pnpm --dir apps/desktop exec vitest run src/__tests__/App.test.tsx src/app/io/__tests__/useReplayIO.test.ts`; `pnpm --dir apps/desktop run typecheck`; `pnpm test:security`.
- Rollback note: keep cleanup isolated behind the replay import success callback so it can be reverted without touching replay parsing.
- Confidence: High.

### F-005: LAN renderer hook does not handle rejected Electron IPC promises

- PN rating: **P1**
- Affected files/directories: `apps/desktop/src/hooks/useLanMatchmaking.ts`, `apps/desktop/src/app/routes/GemDuelRoutes.tsx`
- Evidence: `useLanMatchmaking.ts:39`, `74`, `86`, `99`, and `115` await bridge calls without `try/catch`; route callbacks discard promises with `void`.
- Impact: Main-process LAN rejection can leave stale UI state and create unhandled promise rejections instead of recoverable error state.
- Recommended remediation: Add a shared guarded bridge executor and convert failures into explicit LAN error state plus release-health events.
- Concrete steps: wrap refresh/start/cancel/select/confirm; set safe phase/error message; clear launch when appropriate; add rejection-path tests.
- Acceptance criteria: bridge rejection never leaves an unhandled promise and UI returns to a safe state.
- Verification command(s): `pnpm --dir apps/desktop exec vitest run src/hooks/__tests__/useLanMatchmaking.test.tsx src/hooks/__tests__/useLanDevVerification.test.tsx`; `pnpm test:security`.
- Rollback note: the guarded executor can be reverted without changing LAN service protocol.
- Confidence: High.

### F-006: Preload implementation duplicates the governed IPC contract

- PN rating: **P2**
- Affected files/directories: `apps/desktop/electron/preload.js`, `apps/desktop/electron/preloadContract.cjs`, `tools/scripts/check-electron-governance.mjs`
- Evidence: `preload.js:3-30` defines channel maps and `preload.js:44-90` exposes the bridge separately from `preloadContract.cjs:177-205`; governance checks inspect the contract module rather than proving the actual preload uses it.
- Impact: IPC governance can pass while the real preload drifts from the audited contract.
- Recommended remediation: Make `preload.js` create its bridge from `preloadContract.cjs` and test the actual preload module with mocked `contextBridge` and `ipcRenderer`.
- Concrete steps: export/reuse bridge factory; centralize callback validation; add actual-preload test.
- Acceptance criteria: changing a channel in either contract or preload without the other fails tests or `desktop:check`.
- Verification command(s): `pnpm --dir apps/desktop exec vitest run electron/__tests__/preloadContract.test.ts`; `pnpm desktop:check`.
- Rollback note: keep API shape unchanged for renderer callers.
- Confidence: High.

### F-007: `restartApp` is not gated by verified updater state

- PN rating: **P2**
- Affected files/directories: `apps/desktop/electron/main.js`, `apps/desktop/electron/runtimeHarness.js`, `apps/desktop/electron/preloadContract.cjs`
- Evidence: `main.js:241-249` calls `autoUpdater.quitAndInstall()` on renderer request; `runtimeHarness.js:276-288` records `update-downloaded` but no state check gates the send handler.
- Impact: A compromised renderer or renderer bug can trigger the privileged updater install path outside the expected downloaded-update state.
- Recommended remediation: Track downloaded-update state in main/runtime harness and reject restart-install when false.
- Concrete steps: add `canQuitAndInstall()` state; emit `UPDATER_INSTALL_REJECTED`; test allowed and rejected paths.
- Acceptance criteria: `restartApp` only installs after verified update download.
- Verification command(s): `pnpm --dir apps/desktop exec vitest run electron/__tests__/runtimeHarness.test.ts`; `pnpm desktop:check`.
- Rollback note: keep notification UI unchanged; only the main-process guard changes.
- Confidence: High.

### F-008: Shared setup still uses ambient randomness/time in deterministic surfaces

- PN rating: **P2**
- Affected files/directories: `packages/shared/src/utils.ts`, `packages/shared/src/logic/gameSetup.ts`
- Evidence: `utils.ts:8-29` uses `Math.random()` and `Date.now()` for shuffle/gem ids; `gameSetup.ts:25-49` and `151-199` use ambient random for setup, init randoms, and draft level while deterministic helpers exist separately.
- Impact: Replay reproducibility and deterministic simulation assurance depend on paths that still use ambient entropy.
- Recommended remediation: Introduce seeded `RandomSource` and a deterministic UID/setup factory for gameplay setup.
- Concrete steps: pass random source through setup builders; separate runtime instance ids from deterministic template ids; add same-seed/different-seed tests.
- Acceptance criteria: setup payloads are reproducible under identical seed.
- Verification command(s): `pnpm --filter @gemduel/shared typecheck`; targeted shared setup tests; `pnpm test`; `pnpm test:coverage`.
- Rollback note: preserve existing public setup helper signatures via defaults while adding seedable overloads.
- Confidence: High.

### F-009: Protocol/domain Zod schemas broadly passthrough unknown fields

- PN rating: **P2**
- Affected files/directories: `packages/shared/src/logic/contractSchemasNetwork.ts`, `contractSchemasGameActions.ts`, `contractSchemasGameState.ts`
- Evidence: `rg ".passthrough()"` found broad passthrough use in network schemas, game action schemas, and game state/card schemas.
- Impact: Unknown fields survive parsing. This is not a proven command bypass because reducer and authority gates still validate actions, but it weakens boundary contracts and snapshot clarity.
- Recommended remediation: Use `.strict()` for inbound external envelopes where compatibility is not needed, or `.strip()` with documented compatibility fields.
- Concrete steps: classify schemas by external inbound, replay compatibility, or internal snapshot; add extra-key tests; update contract snapshots intentionally.
- Acceptance criteria: unknown inbound network fields are rejected or stripped according to documented policy.
- Verification command(s): targeted network validation tests; `pnpm test:security`; `pnpm boundaries:check`.
- Rollback note: if legacy replay compatibility requires extra fields, keep that behavior isolated to replay loaders, not live network envelopes.
- Confidence: High.

### F-010: Heartbeat timeout records instability but does not request bounded recovery

- PN rating: **P2**
- Affected files/directories: `apps/desktop/src/hooks/useConnectionHealth.ts`, `apps/desktop/src/hooks/useOnlineManager.ts`, `docs/governance/operations-fault-drills.md`
- Evidence: `useConnectionHealth.ts:34-53` sets `isUnstable` and records `HEARTBEAT_TIMEOUT`, with a comment leaving active reconnection optional; `useOnlineManager` has a separate recovery request path; governance docs expect network disruption to emit recovery events.
- Impact: A degraded peer link can be observed without entering the documented recovery path.
- Recommended remediation: Either wire timeout to bounded `requestRecovery` or revise governance wording if observe-only is intentional.
- Concrete steps: add one-shot recovery request on timeout; prevent spam; add hook tests.
- Acceptance criteria: heartbeat timeout emits recovery once and remains stable under repeated missed pongs.
- Verification command(s): `pnpm --dir apps/desktop exec vitest run src/hooks/__tests__/useConnectionHealth.test.tsx src/hooks/__tests__/useGameNetwork.test.tsx`.
- Rollback note: keep recovery trigger behind a bounded guard so it can be disabled if real LAN play shows false positives.
- Confidence: Medium.

### F-011: Renderer lacks an error boundary around lazy routes

- PN rating: **P2**
- Affected files/directories: `apps/desktop/src/main.tsx`, `apps/desktop/src/app/routes/GemDuelRoutes.tsx`
- Evidence: `main.tsx:8-11` mounts `<App />` directly; `GemDuelRoutes.tsx:8-23` lazy-loads route components and `151-153` wraps them in `Suspense` without an error boundary.
- Impact: route chunk or render failures can blank the renderer without an in-app recovery affordance.
- Recommended remediation: Add a small renderer error boundary around App or route content, report release-health, and offer reload/restart controls.
- Concrete steps: implement boundary component; wrap route shell; add throwing-child test.
- Acceptance criteria: lazy route failure renders recovery UI and emits a release-health event.
- Verification command(s): `pnpm --dir apps/desktop exec vitest run src/app/routes/__tests__/GemDuelRoutes.test.tsx`; `pnpm test`.
- Rollback note: route boundary can be removed independently if it masks actionable developer errors.
- Confidence: High.

### F-012: Settings persistence write can throw without recovery

- PN rating: **P2**
- Affected files/directories: `apps/desktop/src/hooks/useSettings.ts`
- Evidence: `useSettings.ts:60-82` catches read failures, but `useSettings.ts:111-124` writes directly to `localStorage.setItem`.
- Impact: quota or storage security failures can throw from a non-critical preference effect.
- Recommended remediation: wrap persistence writes in `try/catch`, report warning, and continue with in-memory settings.
- Concrete steps: add safe write helper and regression test for throwing `setItem`.
- Acceptance criteria: preference write failure does not crash or blank the app.
- Verification command(s): `pnpm --dir apps/desktop exec vitest run src/hooks/__tests__/useSettings.test.tsx`.
- Rollback note: safe write helper is isolated to settings persistence.
- Confidence: High.

### F-013: Pointer-only clickable UI surfaces

- PN rating: **P2**
- Affected files/directories: `packages/ui/src/components/Card.tsx`, `RoyalCourt.tsx`, `playerZone/PlayerZoneTableauStack.tsx`, `playerZone/PlayerZoneResourcesColumn.tsx`
- Evidence: `Card.tsx:168-182`, `RoyalCourt.tsx:81-94`, `PlayerZoneTableauStack.tsx:173-184`, and `PlayerZoneResourcesColumn.tsx:80-87` use clickable `div` surfaces.
- Impact: keyboard and screen-reader users can miss card preview, royal selection/preview, stack preview, steal, and discard targets.
- Recommended remediation: use real buttons where possible; otherwise add `role`, `tabIndex`, keyboard activation, labels, and disabled semantics.
- Concrete steps: update the four component groups; preserve `data-*` selectors; add keyboard tests with role queries.
- Acceptance criteria: Enter/Space triggers the same callbacks as click; unavailable controls expose correct disabled behavior.
- Verification command(s): targeted UI tests; `pnpm --dir packages/ui typecheck`; `pnpm architecture:check`; `pnpm test`.
- Rollback note: convert one component group at a time to isolate layout regressions.
- Confidence: High.

### F-014: TURN fetch/refresh has no deadline

- PN rating: **P2**
- Affected files/directories: `apps/desktop/electron/turnCredentialClient.js`
- Evidence: `turnCredentialClient.js:143-160` awaits `fetchImpl` without `AbortSignal` or timeout; `turnCredentialClient.js:241-248` reuses `pendingRequest`.
- Impact: a hung credential endpoint can stall fallback/refresh recovery indefinitely.
- Recommended remediation: add configurable timeout and abort hung fetches, then fall back by policy.
- Concrete steps: inject timeout implementation for tests; classify timeout as governed fetch/refresh failure; add never-resolving fetch test.
- Acceptance criteria: a hung request resolves to governed fallback after timeout.
- Verification command(s): `pnpm --dir apps/desktop exec vitest run electron/__tests__/turnCredentialClient.test.ts`; `pnpm test:security`.
- Rollback note: keep timeout default conservative and configurable.
- Confidence: High.

### F-015: TURN lease authorization is token-only, not principal-bound

- PN rating: **P2**
- Affected files/directories: `packages/turn-service/src/turnCredentialService.js`
- Evidence: `turnCredentialService.js:277-286` authorizes only bearer-token membership; `338-347`, `350-380`, and `383-390` issue/refresh/revoke without binding lease subject/client to token principal.
- Impact: if a valid token is shared or leaked, it can refresh or revoke any signed lease id it knows.
- Recommended remediation: map tokens to principals/scopes and enforce principal binding on issue, refresh, and revoke.
- Concrete steps: replace `authTokens: string[]` with token records or verifier callback; bind lease payload to principal; reject cross-principal refresh/revoke.
- Acceptance criteria: principal A cannot refresh or revoke principal B's lease with a valid token.
- Verification command(s): `pnpm --dir packages/turn-service exec vitest run src/__tests__/turnCredentialService.test.ts`; `pnpm test:security`.
- Rollback note: preserve existing token-list API behind a default principal for local development if needed.
- Confidence: High.

### F-016: Lifecycle and audit governance can overstate assurance

- PN rating: **P2**
- Affected files/directories: `tools/governance/audit-gates.snapshot.json`, `tools/governance/lifecycle-certification.snapshot.json`, `tools/scripts/lifecycleDashboard.js`, root `package.json`
- Evidence: `audit-gates.snapshot.json:7-55` omits several gates that workflows run; `lifecycle-certification.snapshot.json:5-10` explicitly excludes live GitHub settings from score; `lifecycleDashboard.js:155-166` checks dependency SBOM snapshot shape rather than fresh gate result; root `electron:build` in `package.json:26` runs certification/artifact export before package artifact evidence, while CI runs artifact evidence after packaging.
- Impact: local 10/10 is useful but can be read as stronger than the evidence actually proves.
- Recommended remediation: align audit-gates and lifecycle artifacts with the full release checklist, make live external settings evidence visibly partial, feed actual license/SBOM/secret gate results into lifecycle artifacts, and reorder local packaging flow.
- Concrete steps: expand or derive audit gate snapshot; add external settings artifact status; write dependency gate results into lifecycle dashboard; run post-package artifact evidence before final certification/export in local packaging.
- Acceptance criteria: deleting a required workflow gate or stale SBOM snapshot fails lifecycle/audit evidence; local package flow mirrors CI sequence.
- Verification command(s): `pnpm audit:gates --out-dir artifacts/governance`; `pnpm lifecycle:certify`; `pnpm governance:artifacts --out-dir artifacts/governance`; `pnpm governance:evidence:check --artifacts-dir artifacts/governance`.
- Rollback note: keep current snapshots until generated replacements are produced by their owning scripts.
- Confidence: High.

## Ten-Dimension Scorecard

| Dimension                                                   | Score | Evidence Snapshot                                                                                                                          | Deductions                                                                                                              | Confidence |
| ----------------------------------------------------------- | ----: | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ---------- |
| Architecture and domain boundaries                          |   7.6 | `pnpm boundaries:check` passed; `AGENTS.md`; `packages/shared/src/constants.ts:1`; `packages/shared/src/observability/releaseHealth.ts:19` | Shared imports UI/runtime concepts; UI public API is loose                                                              | High       |
| Code quality and maintainability                            |   8.0 | `pnpm lint`, `pnpm typecheck`, `pnpm architecture:check` passed                                                                            | Some duplicated contracts and indirect APIs remain                                                                      | High       |
| Type safety and static correctness                          |   9.1 | full repo typecheck passed                                                                                                                 | Runtime schemas are permissive even when TypeScript is green                                                            | High       |
| Test coverage and test quality                              |   8.2 | `pnpm test` and `pnpm test:coverage` passed; 88.42 branch coverage                                                                         | UI seal exclusions and missing negative-path tests reduce assurance                                                     | High       |
| Build, release, and desktop packaging readiness             |   8.4 | `pnpm build`, `pnpm bundle:check`, `pnpm release:check` passed; Windows workflow is pinned and Windows-only                                | `release:artifacts:check` skipped no artifacts; `electron:build` not run in WSL; local package sequence needs alignment | Medium     |
| Security, dependency, and secret-governance posture         |   7.7 | `pnpm deps:check`, `licenses:check`, `sbom:check`, `secrets:check`, `test:security` passed                                                 | LAN spoofing, TURN HTTP, token-only lease auth, no history/archive secret coverage                                      | High       |
| Runtime reliability and failure handling                    |   7.5 | security/runtime tests passed; release-health docs/gates present                                                                           | replay import/network teardown, LAN IPC rejection, heartbeat recovery, error boundary, settings write gaps              | High       |
| Documentation and onboarding quality                        |   8.4 | `docs/README.md`, `docs/governance`, `docs/adr`, backlog doc are current                                                                   | compact onboarding remains optional backlog; some governance semantics need clearer partial-evidence wording            | High       |
| Governance automation and evidence quality                  |   8.0 | lifecycle certification 10/10, governance artifacts/evidence passed after bench                                                            | audit-gates/lifecycle dashboard coverage semantics can overstate assurance                                              | High       |
| Product/UI implementation risk visible from source and docs |   7.9 | UI typecheck and targeted tests pass; card sizing contract aligned                                                                         | pointer-only controls and lack of browser visual/focus audit                                                            | High       |

Average: **8.1 / 10**.

## Remediation Plan

### P0

No P0 release blocker was confirmed in this audit.

### P1

| ID    | Owner role                           | Files/components                                 | Steps                                               | Expected output                                | Verification                                                                          | Rollback                                                 |
| ----- | ------------------------------------ | ------------------------------------------------ | --------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| F-001 | Domain Logic + Frontend Platform     | `packages/shared`, `packages/ui`, `apps/desktop` | Extract UI/runtime helpers from shared; prune deps  | shared becomes pure and framework-neutral      | `pnpm --filter @gemduel/shared typecheck`; `pnpm boundaries:check`; `pnpm deps:check` | revert extraction commit                                 |
| F-002 | Networking + Desktop Platform        | LAN discovery Electron files                     | Add strict packet schemas and nonce/session binding | forged LAN packets rejected                    | targeted LAN tests; `pnpm test:security`; `pnpm desktop:check`                        | keep old packet reader only as tested compatibility shim |
| F-003 | Networking + Desktop Platform        | TURN runtime config/client/docs                  | require HTTPS outside loopback                      | bearer token never sent over non-loopback HTTP | runtime config/client tests; `pnpm test:security`                                     | restore only loopback exception if too strict            |
| F-004 | Frontend Platform + Networking       | `App.tsx`, replay IO, network hooks              | clear online/LAN state on successful import         | replay import enters local review mode         | App/replay IO tests; `pnpm test:security`                                             | revert import-success cleanup only                       |
| F-005 | Frontend Platform + Desktop Platform | `useLanMatchmaking`, routes                      | guard IPC promises and set safe error state         | no unhandled LAN bridge rejection              | LAN hook tests; `pnpm test:security`                                                  | revert guarded executor                                  |

### P2

| ID    | Owner role                    | Files/components                          | Steps                                                      | Expected output                                 | Verification                                    | Rollback                                      |
| ----- | ----------------------------- | ----------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------- | --------------------------------------------- |
| F-006 | Desktop Platform              | preload/IPC contract                      | reuse `preloadContract.cjs` from actual preload            | no preload/contract drift                       | preload tests; `pnpm desktop:check`             | preserve bridge API while reverting internals |
| F-007 | Desktop Platform              | updater handler/runtime harness           | gate install by downloaded-update state                    | renderer cannot trigger install early           | runtime harness tests; `pnpm desktop:check`     | remove state gate if updater API breaks       |
| F-008 | Domain Logic                  | setup/random helpers                      | inject seeded random and UID factory                       | setup reproducible under same seed              | shared setup tests; `pnpm test`                 | keep legacy default random path temporarily   |
| F-009 | Domain Logic + Networking     | Zod schemas                               | strict/strip unknown fields per boundary                   | clearer protocol contract                       | network/security tests; `pnpm boundaries:check` | isolate compatibility to replay loaders       |
| F-010 | Networking                    | connection health hooks                   | wire timeout to bounded recovery or revise docs            | documented recovery behavior matches code       | connection/network hook tests                   | feature-flag recovery trigger                 |
| F-011 | Frontend Platform             | renderer shell/routes                     | add error boundary and health event                        | recoverable route failures                      | route tests; `pnpm test`                        | remove boundary if it hides dev errors        |
| F-012 | Frontend Platform             | settings hook                             | catch storage writes                                       | preferences remain in-memory on storage failure | settings tests                                  | revert helper                                 |
| F-013 | Frontend Platform             | UI interactive surfaces                   | add semantic buttons/keyboard paths                        | accessible card/gem interactions                | targeted UI tests; `pnpm test`                  | migrate one surface at a time                 |
| F-014 | Networking + Desktop Platform | TURN client                               | add request timeout and fallback                           | hung endpoint does not stall                    | TURN client tests; `pnpm test:security`         | adjust timeout default                        |
| F-015 | Networking                    | TURN service                              | bind tokens to principals/scopes                           | cross-principal refresh/revoke rejected         | TURN service tests; `pnpm test:security`        | keep single default principal for local dev   |
| F-016 | Release Engineering           | governance snapshots/scripts/package flow | align audit/lifecycle evidence with full release checklist | certification language matches evidence         | audit/lifecycle/artifact/evidence commands      | regenerate snapshots only via owning scripts  |

### P3

| ID   | Owner role             | Files/components                          | Steps                                                          | Expected output                         | Verification                                       | Rollback                                      |
| ---- | ---------------------- | ----------------------------------------- | -------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------- | --------------------------------------------- |
| C-04 | Domain Logic           | `buffs_comprehensive.test.ts`             | remove duplicate Patient Investor reserve execution            | clearer buff test                       | targeted shared test                               | revert test rewrite                           |
| D-02 | Frontend Platform      | `packages/ui` exports and desktop imports | create explicit UI barrels                                     | stable public UI API                    | typecheck; import scan                             | keep wildcard export until migration complete |
| D-03 | Frontend Platform + QA | UI seal exclusions                        | add focused a11y/interaction tests before narrowing exclusions | better UI behavior evidence             | `pnpm test:coverage`; `pnpm seal-exclusions:check` | do not remove exclusions wholesale            |
| F-05 | Release Engineering    | governance artifact manifest              | correct source/producer metadata                               | agents know owning script/source        | governance artifact tests/checks                   | regenerate from previous manifest             |
| F-06 | Engineering Governance | CODEOWNERS and role map                   | document single-maintainer model or map roles to teams         | ownership model becomes intentional     | `pnpm codeowners:check`                            | keep current single owner with ADR            |
| F-07 | Security Governance    | secret scan policy                        | add history/archive scan or document external scanner          | archived secrets/history coverage clear | `pnpm secrets:check` plus chosen scanner           | keep current fast scan as PR gate             |
| H-01 | Domain Logic           | card data tests                           | enforce `XYZ-cc` IDs and manifest coverage                     | card-id policy regression test          | targeted data-contract test                        | test-only rollback                            |

### P4

| ID   | Owner role              | Files/components           | Steps                                                                | Expected output            | Verification                    | Rollback                                       |
| ---- | ----------------------- | -------------------------- | -------------------------------------------------------------------- | -------------------------- | ------------------------------- | ---------------------------------------------- |
| D-04 | Frontend Platform       | `packages/ui/package.json` | confirm and remove unused `class-variance-authority` if still unused | smaller dependency surface | `pnpm deps:check`; UI typecheck | restore dependency if planned UI code needs it |
| H-02 | Documentation + Lexicon | lexicon docs/tests         | continue monitoring legacy aliases                                   | no live legacy copy drift  | lexicon tests                   | n/a                                            |

## Governance Alignment Check

Aligned requirements:

- pnpm/Turborepo control plane is active: `package.json`, `pnpm-workspace.yaml`, and `turbo.json` match the monorepo model.
- Local gates are broad and green: lint, typecheck, tests, coverage, architecture, boundaries, deps, desktop, release, build, bundle, security, lifecycle, and governance evidence all passed in this run.
- `packages/ui` did not show app dependency leaks; `pnpm boundaries:check` passed.
- Windows NSIS-only release scope is respected by docs and CI; no macOS/Linux packaging expansion is recommended.
- Canonical lexicon looked healthy in audited surfaces; no confirmed live `Royal Court`/legacy-copy violation was found.
- Replay outputs remain local artifacts; no policy change is proposed.
- Generated governance snapshots are treated as script-owned assets; this report does not propose hand-editing snapshots.

Violations or partial alignments:

- `packages/shared` is not pure because it imports UI/runtime concepts, conflicting with AGENTS.md and architecture rules.
- LAN discovery has stronger session checks for heartbeat than for `START_READY`, leaving a boundary enforcement gap.
- TURN service URL policy allows non-loopback HTTP despite bearer-token transport sensitivity.
- Lifecycle certification intentionally excludes live GitHub settings; local 10/10 must be read as repo-contained, not live branch-protection proof.
- `audit:gates` and lifecycle dashboard evidence do not fully represent every gate required by release docs and workflows.
- CODEOWNERS passes the current check but remains single-maintainer while governance docs describe multiple owner roles.

## Subagent Reports

### Subagent A - Desktop Runtime, Electron, Packaging

No P0/P1 desktop blocker was confirmed. A found P2 issues around preload/contract duplication, updater install state gating, and all-interface PeerServer exposure. Main validation confirmed `pnpm desktop:check`, `pnpm release:check`, build, bundle, security, and release-health gates are green. Installer packaging was not run in WSL.

### Subagent B - Renderer App, Routes, Hooks, Networked State

B found two P1 recoverability issues: replay import does not exit online/LAN context, and LAN IPC rejections are unhandled in the renderer hook. It also found P2 reliability gaps around heartbeat recovery, error boundaries, and storage write failures. Main validation ran the full unit/security/coverage suite after B's source audit.

### Subagent C - Shared Domain Logic, Protocol, Data, Lexicon

C found the strongest architecture violation: shared imports UI/runtime concepts. It also found deterministic setup debt, broad Zod passthrough contracts, and a lower-risk duplicated Patient Investor test path. Lexicon and current card data looked broadly healthy, but card-id policy lacks an obvious dedicated shared regression test.

### Subagent D - Reusable UI Package, Visual Surfaces, Component Contracts

D found P2 accessibility risk from pointer-only clickable surfaces, plus P3 API-contract and coverage-exclusion debt. It confirmed no UI-to-app dependency leak, confirmed card sizing alignment, and explicitly preserved the cancelled market direct-buy shortcut decision.

### Subagent E - TURN Service, Networking Security, Boundary Enforcement

E found two P1 security findings: spoofable LAN pregame launch packets and non-loopback HTTP TURN service URLs carrying bearer tokens. It also found P2 TURN timeout and token-principal binding gaps. Positive evidence included passing security tests, dependency/secret gates, and strong shared network message validation.

### Subagent F - Governance Tooling, CI, Monorepo Config, Release Gates

F found that local governance is broad but can overstate assurance: audit-gates omit some workflow/release checks, lifecycle excludes live GitHub settings from score, dependency dashboard metrics inspect snapshot shape, and local `electron:build` sequencing differs from CI. Main validation ran the artifact-writing lifecycle/evidence commands and confirmed they pass after benchmark evidence is collected.

## Do Not Do

- Do not revive Phase 2 right-click / drag direct-buy for market cards; it is cancelled.
- Do not recommend macOS/Linux desktop packaging expansion unless explicitly requested; current release scope is Windows NSIS only.
- Do not propose code changes inside generated governance snapshots unless the owning script requires it.
- Do not remove UI seal exclusions wholesale before adding meaningful interaction/a11y tests.
- Do not weaken TURN or LAN checks for convenience once P1 remediation begins.
- Do not treat repo-contained local lifecycle 10/10 as proof of live GitHub branch protection or production deployment posture.

## Next Review Milestones

7-day triage:

- Assign owners for all P1 items.
- Decide whether `packages/shared` purity or LAN/TURN security ships first; both are high-value.
- Add regression tests before changing runtime behavior.

30-day follow-up:

- Re-run full local gate sequence, including lifecycle and governance evidence.
- Produce a short P1 closure note with before/after evidence.
- Decide CODEOWNERS single-maintainer vs role-mapped ownership.

Exit criteria for P0/P1 closure:

- No P0 items open.
- F-001 through F-005 implemented, reviewed, and verified by targeted tests plus `pnpm test:security`, `pnpm boundaries:check`, `pnpm architecture:check`, and `pnpm lifecycle:certify`.
- No regression in Windows NSIS-only release policy.

Metrics to track monthly:

- P1/P2 open count and age.
- Branch coverage and key-module per-file coverage.
- Seal exclusion count by owner role and category.
- Dependency SBOM component count and license allowlist drift.
- Release-health runtime drill pass count.
- Governance evidence completeness and any skipped artifact evidence.
