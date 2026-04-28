# Independent Engineering Audit — Gem Duel

**Auditor:** Independent reviewer (no delivery ownership)
**Repository:** `GemDuel-Dev` (package version `5.2.11`)
**Audit date:** 2026-04-20
**Method:** Static inspection of repository, governance artifacts, and live execution of `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, and the governance gate scripts in `scripts/`.

---

## 1) Executive Findings

Gem Duel is in a **strong mid-to-late engineering maturity** state. The team has clearly invested in machine-checked governance: 10 formally registered boundaries, a zod-based Electron IPC allowlist, structured release-health telemetry, SBOM and license gates, and a 62-file / 367-test Vitest suite that runs clean in under three seconds. CI (`.github/workflows/governance.yml`, `build.yml`, `dependency-governance.yml`) runs nine governance gates on every pull request and before every release build, and `npm audit --omit=dev` reports zero production vulnerabilities.

However, three hard problems downgrade the archived `9.9/10` self-assessment. First, the **TypeScript project does not compile**: `npx tsc --noEmit` produces **34 errors** across source, hooks, validators, and tests. Because `vite build` only transpiles and the CI pipeline never runs `tsc`, the project ships with real static-typing debt (implicit `any` indexing of `GemInventory`, a stale `GameSetupPayload` contract in `src/logic/actionValidation/guards.ts`, a missing `.d.ts` for `shared/runtimeIcePolicy.js`, and drift between `MarketState`/`DeckState` and their consumers). Second, **`npm run lint` fails today** with 6 Prettier errors and 2 React-hooks warnings, which means the Governance Checks workflow would block every current PR. Third, **`npm run sbom:check` fails** locally because `governance/dependency-sbom.snapshot.json` has drifted from `package-lock.json`, so the release workflow is currently red.

- **Overall average score:** `7.95 / 10`
- **Risk posture:** `High` (type-safety gap and red CI gates are blocking for a desktop release right now, even though gameplay and runtime behavior look solid).

---

## 2) Scorecard Table

| Dimension                                   | Score (0-10) | Evidence Snapshot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Impact                                                                                                 | Confidence                                           |
| ------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | ---- |
| Architecture & Domain Boundaries            | 8.5          | `docs/governance/architecture-layer-map.md`, `docs/governance/boundary-inventory.md`, `governance/boundary-registry.snapshot.json` enumerate 10 named boundaries with owners and validator refs; `src/app/**`, `src/hooks/**`, `src/logic/**`, `electron/**` layering is respected. Weakness: no enforced size/ownership budget (`src/components/PlayerZone.tsx` 711 LOC, `src/data/realCards.ts` 764 LOC, `src/logic/contractSchemas.ts` 697 LOC).                                                                                                                                                                                                                                       | Clear contracts but no mechanical ceiling on coupling/size                                             | High                                                 |
| Code Quality & Consistency                  | 6.5          | `npm run lint` → **6 Prettier errors** in `scripts/__tests__/releaseHealthOperations.test.ts` and `scripts/dependencyGovernance.js`, plus 2 `react-hooks/exhaustive-deps` warnings in `src/hooks/useBoardInteractionHandlers.ts` (wrong dependency list on two `useCallback` hooks). Husky + lint-staged configured, but committed state is not clean.                                                                                                                                                                                                                                                                                                                                    | CI `Lint` step currently fails                                                                         | High                                                 |
| Type Safety & Static Correctness            | 5.5          | `npx tsc --noEmit` → **34 errors**. Source-side: `src/logic/actions/boardActions.ts:115`, `src/logic/actions/privilegeActions.ts:47`, `src/utils.ts:122` index `GemInventory` by `string` (implicit any); `src/logic/actionValidation/guards.ts:268-278` references non-existent `draftPool`, `buffLevel` fields; `src/logic/runtimeSchemas.ts:3` imports `shared/runtimeIcePolicy.js` with no declaration file; `src/app/shell/GamePlaySurface.tsx:93-94` returns `MarketState`/`DeckState` where `Record<number, …>` is expected; `src/hooks/onlineManager/connectionHandlers.ts:87` widens a `string                                                                                   | undefined`. `tsconfig.json`has`strict: true`but`tsc`is not in`package.json` scripts nor in any CI job. | Regressions can ship silently despite zod validation | High |
| Testing Coverage & Quality                  | 8.5          | 62 test files, 367 tests, all passing; property tests via `fast-check` in `src/logic/__tests__/propertyBoundaries.test.ts`; dedicated `test:security` suite; negative-path matrix documented in `docs/governance/test-governance-matrix.md`. `vitest.config.ts` coverage thresholds are `85/85/90/80` — below the aspirational `10.0/10` bar the archive calls out, and coverage scope is an explicit allowlist instead of whole-repo.                                                                                                                                                                                                                                                    | Strong depth but thresholds are not at the project's own stated target                                 | High                                                 |
| Security & Data Protection                  | 8.8          | Electron main uses `contextIsolation: true`, `nodeIntegration: false`, `webSecurity: true` enforced at runtime via zod (`electron/desktopGovernance.js`), IPC allowlist with per-channel argument schemas, trusted-sender check (`authorizeIpcSender`), redacted release-health events, secret/env-drift gate, `npm audit --omit=dev` = 0 vulns across info/low/moderate/high/critical. Gap: no `SECURITY.md`, no documented CVE disclosure path, `eslint.config.js` ignores `electron/` (security-critical code), and the renderer still has 22 ad-hoc `console.log/warn/error` call sites.                                                                                              | Near-excellent security posture with small process gaps                                                | High                                                 |
| Performance & Scalability                   | 8.0          | `vite build` → main `runtime-core` chunk 224.49 kB (gzip 63 kB), well under the 700 kB `mainChunkKb` budget in `docs/governance/operations-slo.md`; manual chunking in `vite.config.ts` splits vendor/UI/network; Immer used for state updates; local PeerJS signaling on port 9000. No profile harness or benchmark suite, no bundle-size assertion in CI beyond the documented budget.                                                                                                                                                                                                                                                                                                  | Good defaults, no performance regression gate                                                          | Medium                                               |
| Reliability, Observability & Error Handling | 8.6          | Structured `createReleaseHealthMonitor` (`electron/releaseHealth.js`) with categories `startup/updater/peer/network/recovery/runtime/security`; fault-drill fixtures in `governance/release-health-fixtures/*.jsonl` (`healthy-baseline`, `ipc-reject`, `network-recovery`, `updater-fail`); reducer rollback in `gameReducer.ts` on post-action validation failure; network recovery with heartbeat/snapshot flow. Gap: some renderer error paths still fall back to `console.*` rather than `reportReleaseHealth`.                                                                                                                                                                      | Enterprise-grade runtime telemetry, minor renderer drift                                               | High                                                 |
| Maintainability & Technical Debt            | 6.8          | Low TODO/FIXME debt (0 in `src/**`). Husky `prepare` + `lint-staged` present, but lint gate is red so local pre-commit is effectively the only defender. Several large files (>500 LOC): `src/data/realCards.ts` 764, `src/components/PlayerZone.tsx` 711, `src/logic/contractSchemas.ts` 697, `src/components/CardAnatomyPage.tsx` 495, `src/components/Card.tsx` 454. Absent: `CONTRIBUTING.md`, `CODEOWNERS`, `CHANGELOG.md`, `ARCHITECTURE.md`, `CODE_OF_CONDUCT.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/dependabot.yml`.                                                                                                                                                   | Maintainability depends heavily on tribal knowledge; debt is latent but real                           | High                                                 |
| Documentation & Onboarding Experience       | 8.0          | `docs/README.md` as index, `docs/guides/quick-start.md`, `docs/guides/testing.md`, `docs/guides/frontend-layout-guide.md`, and 8 governance docs. `README.md` has a 6-command quick start. Missing: architecture decision records (ADRs), `ARCHITECTURE.md`, `CONTRIBUTING.md`, release-note template, contributor setup for macOS/Linux (only `win` NSIS target is configured).                                                                                                                                                                                                                                                                                                          | Operators and release engineers are covered; first-time contributors less so                           | High                                                 |
| Governance, Process & Delivery Maturity     | 7.8          | Three CI workflows (PR, dependency, release); 10 governance scripts under `scripts/`; `check-release-health.mjs`, `check-electron-governance.mjs`, `check-boundary-governance.mjs` all include unit-test coverage in `scripts/__tests__/`. **But** three gates are currently red on `main`: `npm run lint` (6 Prettier errors), `npm run sbom:check` (snapshot drift vs `package-lock.json`), and `npx tsc --noEmit` (not gated at all). `scripts/check-boundary-governance.mjs` feeds the same registry as both `actualRegistry` and `expectedRegistry`, so "drift" is symbolic. `build.yml` publishes with `-p always` on tag push without a protected-branch rule visible in the repo. | Governance _framework_ is excellent; enforcement _state_ has regressed                                 | High                                                 |

---

## 3) Priority Defect Register (Top 10)

### 1. CI `Lint` gate is red — Prettier drift and React-hook warnings

- **Affected files:** `scripts/__tests__/releaseHealthOperations.test.ts:53`, `scripts/dependencyGovernance.js:197-201`, `src/hooks/useBoardInteractionHandlers.ts:71,112`
- **Why it matters:** `.github/workflows/governance.yml` runs `npm run lint`; every current PR would fail. The React-hooks warnings indicate a stale/missing `gameState.phase` dependency that could cause stale-closure bugs during `TAKE_GEMS` flows.
- **Severity:** `High`
- **Risk scenario:** No PR can merge via the protected workflow; once the hook dependency is wrong, board interaction can desynchronize from phase changes.
- **Fix complexity:** `Low` (prettier --write; correct the `useCallback` deps, then add tests around phase transitions).

### 2. `tsc --noEmit` produces 34 errors and is not gated

- **Affected files:** `src/logic/actions/boardActions.ts:115`, `src/logic/actions/privilegeActions.ts:47`, `src/utils.ts:122`, `src/logic/actionValidation/guards.ts:268-278`, `src/logic/runtimeSchemas.ts:3`, `src/app/shell/GamePlaySurface.tsx:93-94`, `src/hooks/onlineManager/connectionHandlers.ts:87`, plus 23 more in tests
- **Why it matters:** Strict mode is on in `tsconfig.json`, but neither `package.json` scripts nor any workflow invokes `tsc`. Implicit `any` on `GemInventory` indexing bypasses the core type contract used by reducer, privilege, and cost calculation. `guards.ts` validates a payload shape that no longer matches the `GameSetupPayload` interface — meaning the runtime guard is partially validating ghost fields.
- **Severity:** `Critical`
- **Risk scenario:** A future refactor silently breaks the domain model; zod validation in the network path is the only remaining safety net.
- **Fix complexity:** `Medium` (fix the source-side ten errors; add `"typecheck": "tsc --noEmit"` script; add a `Type Check` step to `governance.yml` and `build.yml`).

### 3. SBOM governance snapshot drifted from `package-lock.json`

- **Affected files:** `governance/dependency-sbom.snapshot.json`, `package-lock.json`
- **Why it matters:** `npm run sbom:check` → exit code 1 locally with "Dependency SBOM snapshot drifted from package-lock.json". `dependency-governance.yml` and `build.yml` both run this gate; release packaging would fail today.
- **Severity:** `High`
- **Risk scenario:** The release workflow cannot produce a signed desktop artifact; a stale SBOM misrepresents shipped transitive dependencies to downstream consumers.
- **Fix complexity:** `Low` (regenerate the snapshot via the same builder `buildDependencySbomSnapshot` in `scripts/dependencyGovernance.js`, commit the delta).

### 4. `eslint.config.js` ignores the entire `electron/` directory

- **Affected files:** `eslint.config.js:9` (`{ ignores: ['dist', 'electron'] }`), which excludes `electron/main.js`, `electron/desktopGovernance.js`, `electron/releaseHealth.js`, `electron/runtimeHarness.js`, `electron/turnCredentialClient.js`, `electron/preloadContract.cjs`, `electron/preload.js`
- **Why it matters:** The most security-critical code — IPC guards, preload bridge, auto-updater handling — receives no lint discipline. The `electron/__tests__/` suite tests it but styling and dead-code drift go unchecked.
- **Severity:** `High`
- **Risk scenario:** Silent formatting/logic drift in IPC or BrowserWindow policy code; inconsistent style makes security review harder.
- **Fix complexity:** `Low` (remove `'electron'` from `ignores`; run `prettier --write electron/**` once; add a targeted ruleset if needed for `.cjs`).

### 5. `scripts/check-boundary-governance.mjs` uses the snapshot as its own "expected" reference

- **Affected files:** `scripts/check-boundary-governance.mjs:15-21`
- **Why it matters:** Both `actualRegistry` and `expectedRegistry` read from the same file, so the "snapshot drifted" branch in `scripts/boundaryGovernance.js:167` can never fire. The structural checks inside `collectBoundaryRegistryErrors` still run, but drift detection is symbolic rather than real.
- **Severity:** `Medium`
- **Risk scenario:** If boundaries are added in code without updating `governance/boundary-registry.snapshot.json`, CI will silently pass because the snapshot is the only source.
- **Fix complexity:** `Medium` (derive the "actual" registry from code or from `docs/governance/boundary-inventory.md` markdown parsing and compare against the snapshot).

### 6. Coverage thresholds are below the project's own stated 10/10 target

- **Affected files:** `vitest.config.ts:49-54` (`statements: 85, lines: 85, functions: 90, branches: 80`), `docs/archive/timeline/engineering-governance-archive.md`
- **Why it matters:** The archive explicitly calls out that thresholds are still below the `10.0/10` bar. Coverage is also narrowed to a hand-picked `include` list, so unlisted code (e.g. `src/hooks/useAIController.ts`, most components) can regress without moving the coverage number.
- **Severity:** `Medium`
- **Risk scenario:** Coverage numbers overstate protection; regressions in UI/AI code pass the gate.
- **Fix complexity:** `Medium` (expand `include` or adopt whole-repo coverage with per-file exclusions; raise thresholds in stepped increments with CI enforcement).

### 7. No file-size / ownership gate to match the architecture layer map

- **Affected files:** `src/data/realCards.ts` 764 LOC, `src/components/PlayerZone.tsx` 711 LOC, `src/logic/contractSchemas.ts` 697 LOC, `src/components/CardAnatomyPage.tsx` 495 LOC, `src/components/Card.tsx` 454 LOC
- **Why it matters:** `docs/archive/timeline/engineering-governance-archive.md` lists this as the last blocker to `10.0/10`. Without a mechanical ceiling, large files accumulate mixed responsibilities that are hard to review under the boundary contract.
- **Severity:** `Medium`
- **Risk scenario:** Cross-layer leaks (e.g. UI holding domain logic) re-appear as the codebase grows.
- **Fix complexity:** `Medium` (a small `scripts/check-architecture-budgets.mjs` that walks the layer map and fails on size or owner rule breaches; wire into `governance.yml`).

### 8. Missing standard project documents and protections

- **Affected files:** no `CONTRIBUTING.md`, `SECURITY.md`, `CODEOWNERS`, `CODE_OF_CONDUCT.md`, `ARCHITECTURE.md`, `CHANGELOG.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/dependabot.yml`
- **Why it matters:** Governance is code-level excellent but process hygiene is thin. No disclosure path for vulnerabilities, no dependabot cadence, no branch-protection artifact visible in the repo, no release-note discipline despite `electron-builder` publishing to GitHub Releases on `v*` tag push.
- **Severity:** `Medium`
- **Risk scenario:** External contributors and security researchers have no published channel; release quality depends on the lead developer's memory.
- **Fix complexity:** `Low` (templates; dependabot two-file setup; branch protection via repo settings out of scope for code).

### 9. `src/hooks/useBoardInteractionHandlers.ts` hook dependency warnings

- **Affected files:** `src/hooks/useBoardInteractionHandlers.ts:71, 112`
- **Why it matters:** One `useCallback` lists `gameState.phase` redundantly; another omits it. Both callbacks are on the TAKE_GEMS hot path and can stale-close over `gameState.phase`, producing actions that `validatePostActionState` then rolls back (visible in test logs as `[COMMAND_GATE] Rejected action TAKE_GEMS: …`).
- **Severity:** `Medium`
- **Risk scenario:** Silent user-facing rejections on phase boundaries; harder to reproduce bugs in AI/online play.
- **Fix complexity:** `Low` (fix dep arrays; add a test that asserts callback freshness across phase transitions).

### 10. Renderer observability uses `console.*` alongside the release-health channel

- **Affected files:** `src/logic/gameReducer.ts` (6), `src/hooks/onlineManager/peerLifecycle.ts` (8), `src/hooks/gameNetwork/useNetworkEventHandlers.ts` (7), `src/hooks/onlineManager/connectionHandlers.ts` (5), plus 7 more files
- **Why it matters:** Structured telemetry via `src/observability/releaseHealth.ts` exists and is what CI, drills, and the packaged app consume. Mixed `console.*` usage means some renderer failures never reach `getReleaseHealthSnapshot()`, weakening production diagnosis.
- **Severity:** `Low`
- **Risk scenario:** Field incidents are harder to diagnose post-mortem because key warnings never enter the audited event stream.
- **Fix complexity:** `Medium` (introduce a renderer logger facade; migrate the 40-odd sites; add a lint rule forbidding bare `console.*` outside dev utilities).

---

## 4) Remediation Plan by Phase (Target: 10.0/10 for each dimension)

### P1 — 0-2 weeks (must-fix; unblock CI and core safety)

| Item                                                 | Owner Role                 | Files / Components                                                                                                                                                                                                                                                                                                                                                                                                                          | Acceptance Criteria                                                 | Verification                                                                   |
| ---------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Fix Prettier + hook-deps to make `npm run lint` pass | Frontend Platform          | `scripts/__tests__/releaseHealthOperations.test.ts`, `scripts/dependencyGovernance.js`, `src/hooks/useBoardInteractionHandlers.ts`                                                                                                                                                                                                                                                                                                          | `npm run lint` → exit 0 with no warnings                            | `npm run lint` and `governance.yml` run green                                  |
| Restore SBOM snapshot                                | Release Engineering        | `governance/dependency-sbom.snapshot.json`                                                                                                                                                                                                                                                                                                                                                                                                  | `npm run sbom:check` → "gate passed" with matching `componentCount` | `npm run sbom:check`, `npm run licenses:check`, `npm run deps:check` all green |
| Add `typecheck` script and gate TS errors            | Domain + Frontend Platform | add `package.json` script `"typecheck": "tsc --noEmit"`; fix `src/logic/actions/boardActions.ts`, `src/logic/actions/privilegeActions.ts`, `src/utils.ts` (cast or narrow `GemInventoryKey`), `src/logic/actionValidation/guards.ts` (align `isInitDraftPayload` with `InitDraftPayload` interface), add `shared/runtimeIcePolicy.d.ts`, fix `src/app/shell/GamePlaySurface.tsx` props, fix `src/hooks/onlineManager/connectionHandlers.ts` | `npm run typecheck` → exit 0                                        | Add step to `governance.yml` and `build.yml`; new CI job must be green         |
| Stop ignoring `electron/` in ESLint                  | Desktop Platform           | `eslint.config.js`                                                                                                                                                                                                                                                                                                                                                                                                                          | `electron/**` lint-clean under a dedicated override block           | `npm run lint` and `npm run desktop:check` green                               |

### P2 — 2-6 weeks (important, measurable improvements)

| Item                                                  | Owner Role                     | Files / Components                                                                                                                                  | Acceptance Criteria                                                                                                                                | Verification                                                                      |
| ----------------------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Make boundary governance detect real drift            | Release Engineering            | `scripts/check-boundary-governance.mjs`, new `scripts/buildBoundaryRegistryFromSource.js`                                                           | Snapshot is derived from code/docs and compared against the committed one; injecting a fake boundary into code fails the gate                      | Unit tests in `scripts/__tests__/boundaryGovernance.test.ts` cover the drift path |
| Raise and broaden coverage thresholds                 | Domain + Frontend Platform     | `vitest.config.ts`, new tests for uncovered modules                                                                                                 | Thresholds `statements: 92, lines: 92, functions: 95, branches: 88`; coverage `include` covers all of `src/**` minus `.tsx` visual-only components | `npm run test:coverage` green under new thresholds                                |
| Publish standard project documents                    | Engineering Lead               | new `SECURITY.md`, `CONTRIBUTING.md`, `CODEOWNERS`, `ARCHITECTURE.md`, `CHANGELOG.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/dependabot.yml` | All files present; dependabot PRs land on schedule; CODEOWNERS routes the four owner roles named in the boundary registry                          | Manual review + dependabot dry run                                                |
| Migrate renderer `console.*` to `reportReleaseHealth` | Frontend Platform + Networking | `src/logic/gameReducer.ts`, `src/hooks/onlineManager/*`, `src/hooks/gameNetwork/*`, `src/logic/authority.ts`                                        | No bare `console.*` outside `**/__tests__/**` and dev tooling; add an eslint `no-console` rule with exceptions                                     | `npm run lint`; drill fixtures verify events reach `getReleaseHealthSnapshot()`   |

### P3 — 6-12 weeks (structural hardening)

| Item                        | Owner Role        | Files / Components                                                                                                                                        | Acceptance Criteria                                                                                                                      | Verification                                                                    |
| --------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Architecture budget gate    | Engineering Lead  | new `scripts/check-architecture-budgets.mjs`, `docs/governance/architecture-layer-map.md`                                                                 | Per-layer max LOC/file; per-layer forbidden imports derived from the layer map                                                           | New `scripts/__tests__/architectureBudgets.test.ts`; wire into `governance.yml` |
| Break up files over 500 LOC | Layer owners      | `src/data/realCards.ts`, `src/components/PlayerZone.tsx`, `src/logic/contractSchemas.ts`, `src/components/CardAnatomyPage.tsx`, `src/components/Card.tsx` | Each file ≤ 400 LOC or justified in an ADR                                                                                               | Architecture budget gate green                                                  |
| Bundle-size CI assertion    | Frontend Platform | `scripts/buildBudgetReport.js`, `.github/workflows/build.yml`                                                                                             | Fail build if `mainChunkKb > 700`; warn at `>= 600`                                                                                      | `npm run build` + new assertion in CI; retained artifact includes bundle report |
| ADRs and decision log       | Engineering Lead  | new `docs/adr/`                                                                                                                                           | At least 5 ADRs covering: Electron IPC allowlist, zod contract strategy, replay import, TURN credential lifecycle, release-health schema | PR review + linked from `ARCHITECTURE.md`                                       |

---

## 5) Governance Alignment Check

| Governance Requirement                                                                              | Status                    | Evidence / Violation                                                                                                                              | Score Impact                  |
| --------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `npm run lint` mandatory gate (`docs/governance/release-health-checklist.md`)                       | **Violated**              | Exit 1 with 6 Prettier errors + 2 warnings                                                                                                        | Code Quality, Governance      |
| `npm run sbom:check` must pass (`docs/governance/dependency-runtime-governance.md` → "SBOM Policy") | **Violated**              | Snapshot drifted vs `package-lock.json`                                                                                                           | Security, Governance          |
| `npm test` must pass (`release-health-checklist.md`)                                                | Met                       | 367/367 pass                                                                                                                                      | —                             |
| `npm run test:security` must pass (checklist)                                                       | Met                       | 14 files, all green                                                                                                                               | —                             |
| `npm run desktop:check` must pass (checklist)                                                       | Met                       | "Desktop governance check passed"; runtime drills passed for 6 scenarios                                                                          | —                             |
| `npm run release:check` must pass (checklist)                                                       | Met                       | Checklist and operations SLO passed                                                                                                               | —                             |
| `npm run boundaries:check` must pass (PR workflow)                                                  | Passes, **contract weak** | Check compares snapshot to itself (`scripts/check-boundary-governance.mjs:15-21`); structural validation only                                     | Governance                    |
| Strict TypeScript ("Type Safety & Static Correctness" in audit prompt)                              | **Violated**              | `tsconfig.json` has `strict: true`, but no `tsc` step anywhere in `package.json` or CI; 34 real errors                                            | Type Safety, Governance       |
| `docs/governance/electron-ipc-allowlist.md` matches code                                            | Met                       | Every `IPC_ALLOWLIST` entry in `electron/preloadContract.cjs` is reflected in the doc table, validated by `scripts/check-electron-governance.mjs` | —                             |
| `docs/governance/architecture-layer-map.md` ownership & size rules                                  | **Partially met**         | Layer map documented; archive explicitly flags the missing CI budget gate                                                                         | Architecture, Maintainability |
| Production dependency audit = 0 vulns                                                               | Met                       | `info=0, low=0, moderate=0, high=0, critical=0`                                                                                                   | —                             |
| Approved security overrides documented                                                              | Met                       | `package.json:116-133` overrides match `docs/governance/dependency-runtime-governance.md` "Approved Security Overrides"                           | —                             |
| `patch-peer.js` must not return                                                                     | Met                       | No match in repo                                                                                                                                  | —                             |
| `SECURITY.md` disclosure path                                                                       | **Missing**               | No `SECURITY.md` present                                                                                                                          | Security, Documentation       |
| `CODEOWNERS` for the four owner roles named in boundary registry                                    | **Missing**               | No `CODEOWNERS` file                                                                                                                              | Governance, Maintainability   |

---

## 6) Next-review Milestones

### 30-day follow-up checklist

- [ ] `npm run lint` exits 0 on `main` (no Prettier drift, no hook warnings)
- [ ] `npm run sbom:check` exits 0 with regenerated snapshot
- [ ] `npm run typecheck` (new) exits 0 and is a required step in `governance.yml` and `build.yml`
- [ ] `eslint.config.js` no longer ignores `electron/`
- [ ] `SECURITY.md`, `CONTRIBUTING.md`, `CODEOWNERS`, `.github/dependabot.yml` present
- [ ] `src/hooks/useBoardInteractionHandlers.ts` callback deps correct and unit-tested across phase transitions
- [ ] `governance/dependency-sbom.snapshot.json` regenerated and committed in the same PR as any dependency change

### Metrics to track monthly

- TypeScript error count (`npx tsc --noEmit` — target: 0)
- ESLint errors + warnings (target: 0 errors, ≤ 5 warnings)
- Test count, pass rate, flake rate (target: 100% pass, 0 flakes over the month)
- Vitest coverage (target: meet raised P2 thresholds)
- Main renderer chunk size in kB (target: ≤ 700, alert ≥ 600)
- Release-health indicator counts from retained `governance-evidence` artifact (`startupFailures`, `runtimeConfigFailures`, `updaterFailures`, `peerFailures`, `recoveryRequests`, `ipcRejected`) — target: 0 except explained `recoveryRequests`
- `npm audit --omit=dev` severity histogram (target: all zero)
- File count > 500 LOC (target: trending toward 0 as P3 refactors land)

### Exit criteria

**P1 → P2**

- All three current CI gates (`lint`, `sbom:check`, new `typecheck`) green on `main` for at least two consecutive PR merges
- Zero `tsc` errors; ESLint passes across `src/**`, `electron/**`, `scripts/**`, `shared/**`, `server/**`
- `eslint.config.js` no longer ignores `electron/`

**P2 → P3**

- `scripts/check-boundary-governance.mjs` detects an artificially injected boundary drift in a test fixture
- Coverage thresholds raised to at least `92/92/95/88` with `src/**` fully included and green
- Standard project docs (`SECURITY.md`, `CONTRIBUTING.md`, `CODEOWNERS`, `CHANGELOG.md`, `ARCHITECTURE.md`, PR template, dependabot) live on `main`
- Renderer no longer emits bare `console.*` on the multiplayer path

**P3 → "10.0/10 seal"**

- Architecture budget gate enforced in CI; zero files above the per-layer ceiling without an ADR
- Bundle-size assertion in CI with `mainChunkKb ≤ 700` enforced on every release build
- At least five ADRs cover the irreversible architecture decisions
- 30 days of clean retained `governance-evidence` artifacts (all indicators at healthy thresholds)

---

**End of report.**
