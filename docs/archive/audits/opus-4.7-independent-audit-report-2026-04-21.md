# Independent Engineering Audit — Gem Duel

**Auditor:** Independent reviewer (no delivery ownership)
**Repository:** `GemDuel-Dev` (package version `5.2.11`)
**Audit date:** 2026-04-21
**Method:** Static inspection of repository, governance artifacts, and live execution of `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:security`, `npm run test:coverage`, `npm run build`, and every governance gate declared in `.github/workflows/governance.yml`, `build.yml`, `dependency-governance.yml`, `governance-evidence.yml`.

---

## 1) Executive Findings

Gem Duel has matured into a **late-stage, hardened engineering baseline**. Every P1 and P2 item from the 2026-04-20 audit has been closed in code: `npm run lint`, `npm run typecheck`, `npm run sbom:check`, `npm run boundaries:check`, `npm run architecture:check`, `npm run bundle:check`, `npm run desktop:check`, `npm run release:check`, `npm test`, `npm run test:security`, and `npm run test:coverage` all pass locally; the three CI workflows (`governance`, `build`, `governance-evidence`, plus the scheduled `dependency-governance`) now gate Type Check, Architecture Budget, Bundle Budget, Release Tag Provenance, and Governance Evidence Health in addition to the previously existing nine gates. Production `npm audit --omit=dev` reports `info=0, low=0, moderate=0, high=0, critical=0`. The Vitest suite has grown from 367 to **532 tests across 94 files** (plus 91 security-regression tests) and completes in ~6 seconds with seal-coverage thresholds raised to `92/92/95/88` over a whole-repo `include` list; aggregate observed coverage is `94.87 / 88.23 / 95.89 / 94.87`.

Structural quality has also advanced. The previous >700 LOC hotspots (`src/components/PlayerZone.tsx`, `src/data/realCards.ts`, `src/logic/contractSchemas.ts`, `src/components/CardAnatomyPage.tsx`) have been decomposed back under the per-layer hard budgets (largest current file is `src/logic/actionValidation/guards.ts` at 372 LOC, well below the 500 hard ceiling). Architecture budgets are machine-enforced via `scripts/architectureBudgets.js`, which also checks forbidden cross-layer imports. Boundary governance finally performs a real drift check: `scripts/buildBoundaryRegistryFromSource.js` produces the "actual" registry from code and compares it to `governance/boundary-registry.snapshot.json`. Standard project documents (`ARCHITECTURE.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODEOWNERS`, `CHANGELOG.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/dependabot.yml`) and seven ADRs are now committed. Renderer observability has a dedicated `src/observability/rendererLogger.ts` facade and an ESLint `no-console` rule enforced across `src/**`, `electron/**`, and `scripts/**`.

The remaining deductions are **process and polish**, not code or safety: `CHANGELOG.md` is a stub with no released version entries; `CODEOWNERS` routes every path to a single GitHub user (`@mingzhi0119`) rather than the four owner roles named in the boundary registry; `SECURITY.md` does not publish a concrete disclosure channel; branch protection is only documented in a manual checklist; the desktop build targets Windows NSIS only; `vitest.config.ts` (legacy, 85/85/90/80) still ships alongside the new seal config; and the `.gitignore` does not cover the `tmp-release-health-*` scratch directories that drill fixtures leave in the working tree.

- **Overall average score:** `9.17 / 10`
- **Risk posture:** `Low` (all audited gates are green, all P1/P2 debt has been paid down, residual items are governance-process polish).

---

## 2) Scorecard Table

| Dimension                                   | Score (0-10) | Evidence Snapshot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Impact                                                                                                                                          | Confidence |
| ------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Architecture & Domain Boundaries            | 9.5          | `docs/governance/architecture-layer-map.md` ships a machine-readable `architecture-budget-contract` with per-layer `warningMaxLines`, `incidentMaxLines`, and `forbiddenImportPaths`; `scripts/check-architecture-budgets.mjs` walks the code, enforces ceilings, and denies illegal imports; `approvedExceptions` is empty. Largest source file is `src/logic/actionValidation/guards.ts` at 372 LOC (layer hard limit 500). `scripts/buildBoundaryRegistryFromSource.js` + `scripts/boundaryGovernance.js` compare the in-source registry against `governance/boundary-registry.snapshot.json`.                                                                                             | Layering is both declared and mechanically enforced; only residual: CODEOWNERS does not mirror the four owner roles named in the registry.      | High       |
| Code Quality & Consistency                  | 9.2          | `npm run lint` exits 0. Zero `TODO`/`FIXME` across `src/**`. Zero `as any` and zero `@ts-ignore`/`@ts-nocheck` in `src/**`. No bare `console.*` outside `src/observability/**` and `__tests__/**` (enforced by per-layer `no-console` blocks in `eslint.config.js`). Prettier + `lint-staged` + Husky `pre-commit` run before every commit.                                                                                                                                                                                                                                                                                                                                                   | One `any` remains in `src/logic/networkMessageValidation.ts:1` (narrow helper cast), and the legacy `vitest.config.ts` is still in the tree.    | High       |
| Type Safety & Static Correctness            | 9.5          | `tsconfig.json` has `strict: true`, `noFallthroughCasesInSwitch: true`, `isolatedModules: true`. `npm run typecheck` (`tsc --noEmit`) exits 0 with zero errors. `Type Check` is a required step in `.github/workflows/governance.yml`, `build.yml`, and `governance-evidence.yml`. Zod contracts at every network/IPC/replay/runtime boundary (`src/logic/networkMessageValidation.ts`, `electron/preloadContract.cjs`, `src/app/io/safeReplayImport.ts`, `src/logic/runtimeSchemas.ts`).                                                                                                                                                                                                     | Type-layer debt from the prior audit (34 errors) is fully paid.                                                                                 | High       |
| Testing Coverage & Quality                  | 9.0          | 94 test files, 532 passing tests in 6.06s; security suite: 14 files / 91 tests / 3.50s. `vitest.seal.config.ts` include is `src/**, electron/**, scripts/**, shared/**` with thresholds `92/92/95/88`; observed aggregate `94.87 / 88.23 / 95.89 / 94.87`. Property-based tests via `fast-check` in `src/logic/__tests__/propertyBoundaries.test.ts` and `protocolRecoveryMatrix.test.ts`. Seal exclusions are individually justified in `vitest.seal.exclusions.ts`.                                                                                                                                                                                                                         | Per-file weak spots remain: `src/logic/ai/aiPlayer.ts` = 80.93% lines; legacy `vitest.config.ts` with 85/85/90/80 still bundled.                | High       |
| Security & Data Protection                  | 9.4          | Electron main enforces `contextIsolation: true`, `nodeIntegration: false`, `webSecurity: true` (`electron/desktopGovernance.js`); zod-validated IPC allowlist + trusted-sender check in `electron/preloadContract.cjs`; `SECURITY.md`, `governance/dependency-license-allowlist.json`, `scripts/check-secret-governance.mjs` gate supply chain; `npm audit --omit=dev` returns 0 vulns. Release-tag provenance gate in `scripts/releaseTagProvenance.js` requires the tag SHA to be reachable from `origin/<default-branch>` before publish.                                                                                                                                                  | `SECURITY.md` lacks a concrete contact email/advisory URL; `CODE_OF_CONDUCT.md` is absent.                                                      | High       |
| Performance & Scalability                   | 8.8          | `vite build` emits `runtime-core-*.js` at 225.95 kB (gzip 63.31 kB), largest chunk reported as 220.66 kB under the `warningMax: 600 / incidentMax: 700` contract in `electron/governance/release-health-operations.snapshot.json`; `scripts/check-build-budget.mjs` is a hard CI gate and persists `bundle-budget.report.json`. Manual chunking in `vite.config.ts` splits `react-vendor`, `motion-vendor`, `network-vendor`, `ui-vendor`, `runtime-core`.                                                                                                                                                                                                                                    | No benchmark/profile harness for hot paths; only Windows NSIS target declared under `package.json#build.win`.                                   | Medium     |
| Reliability, Observability & Error Handling | 9.3          | Structured `electron/releaseHealth.js` + `src/observability/releaseHealth.ts` expose categories `startup/updater/peer/network/recovery/runtime/security`; `src/observability/rendererLogger.ts` is the enforced renderer telemetry facade; drill fixtures in `governance/release-health-fixtures/*.jsonl` (`healthy-baseline`, `ipc-reject`, `network-recovery`, `updater-fail`) replayed by `scripts/check-runtime-drill-governance.mjs` for 6 scenarios. `governance-evidence.yml` runs every morning at 10:00 UTC against `main` and uploads a 30-day retention artifact.                                                                                                                  | Telemetry and drills are comprehensive; no additional on-call runbooks beyond `docs/governance/operations-fault-drills.md`.                     | High       |
| Maintainability & Technical Debt            | 8.9          | Zero `TODO`/`FIXME` markers in `src/**`. Every source file is under its layer hard ceiling with no ADR-backed exceptions active (`docs/adr/0007-renderer-composition-exceptions.md` is now a historical record). `package.json` scripts and CI gates are enumerated in `CONTRIBUTING.md`. Dependabot is configured for both `npm` and `github-actions` on a weekly cadence.                                                                                                                                                                                                                                                                                                                   | `CHANGELOG.md` holds only an "Unreleased" stub; `CODEOWNERS` routes every path to `@mingzhi0119` instead of the four boundary-registry owners.  | High       |
| Documentation & Onboarding Experience       | 8.7          | `README.md`, `docs/README.md`, `docs/guides/quick-start.md`, `docs/guides/testing.md`, `docs/guides/frontend-layout-guide.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, eight governance docs, seven ADRs, PR template. `docs/archive/audits/opus-4.7-independent-audit-report-2026-04-20.md` is the referenced baseline.                                                                                                                                                                                                                                                                                                                                         | `CHANGELOG.md` has no released-version entries; setup guidance still targets Windows only; no `CODE_OF_CONDUCT.md`; SECURITY contact is vague.  | High       |
| Governance, Process & Delivery Maturity     | 9.4          | Four workflows: `governance.yml` (PR, 14 gates), `build.yml` (tagged releases, 13 gates + provenance), `dependency-governance.yml` (weekly cron + PR), `governance-evidence.yml` (daily 10:00 UTC on `main`). `npm run boundaries:check` now performs real source-vs-snapshot drift detection. `npm run governance:evidence:check` validates artifact retention (≥ 30 days) and recomputes alert drift. Husky + `lint-staged` on pre-commit. `eslint.config.js` ignores `dist` only (electron is now linted); `no-console` enforced across `src/**`, `electron/**`, `scripts/**` with documented exceptions. `docs/governance/repo-settings-checklist.md` enumerates branch-protection rules. | Branch protection itself is not stored as an auditable repo artifact; `.gitignore` does not cover `tmp-release-health-*` temp dirs in worktree. | High       |

**Arithmetic mean:** `(9.5 + 9.2 + 9.5 + 9.0 + 9.4 + 8.8 + 9.3 + 8.9 + 8.7 + 9.4) / 10 = 9.17`

---

## 3) Priority Defect Register (Top 10)

### 1. `CHANGELOG.md` has no released-version history

- **Affected files:** `CHANGELOG.md`
- **Why it matters:** `electron-builder` publishes to GitHub Releases on every `v*` tag, and the repo's own `docs/governance/repo-settings-checklist.md` requires tag-gated releases, but the only section currently in `CHANGELOG.md` is "Unreleased". Consumers of packaged Windows builds cannot reconstruct what shipped in any prior `5.x` release.
- **Severity:** `Medium`
- **Risk scenario:** A field incident on `v5.2.11` cannot be traced back to the behavioral delta from the last shipped version because there is no written record of what that delta was.
- **Fix complexity:** `Low` (backfill entries from `git log --grep='^feat:\|^fix:\|governance:'`; add a "release notes" step to `build.yml`).

### 2. `CODEOWNERS` does not reflect the four owner roles named in the boundary registry

- **Affected files:** `CODEOWNERS`, `scripts/buildBoundaryRegistryFromSource.js:8,36,61,95,114,136,155,181,213,247`
- **Why it matters:** The boundary registry declares four distinct owners (Frontend + Domain Logic, Networking, Desktop Platform, Release Engineering), and `docs/governance/architecture-layer-map.md` assumes layer-level accountability. `CODEOWNERS` routes every single path to the same user (`@mingzhi0119`), so the "ownership" dimension of the governance contract is symbolic.
- **Severity:** `Medium`
- **Risk scenario:** On a multi-contributor team, a PR that changes `src/logic/network*.ts` gets the same reviewer routing as `src/components/Card.tsx`, defeating the boundary inventory's stated ownership model.
- **Fix complexity:** `Low` (define team handles or multiple users per boundary; if the project is intentionally single-maintainer, record that in an ADR and note it as a documentation alignment rather than a governance gap).

### 3. `SECURITY.md` lacks a concrete disclosure channel

- **Affected files:** `SECURITY.md:8`
- **Why it matters:** The file says "use the repo owner's private maintainer channel rather than a public issue," but gives no email, PGP key, or GitHub Security Advisory URL. External researchers who cannot enable a private advisory have no fallback path.
- **Severity:** `Medium`
- **Risk scenario:** A CVE reporter posts publicly instead of privately because the intended channel is ambiguous.
- **Fix complexity:** `Low` (add a dedicated security email alias and/or link to `github.com/<org>/<repo>/security/advisories/new`).

### 4. Branch protection is only documented, not enforced as a repo-visible artifact

- **Affected files:** `docs/governance/repo-settings-checklist.md:6-12`
- **Why it matters:** The checklist requires the default branch to be protected, require PRs, require `governance` + `production-audit` status checks, and require review conversation resolution. None of this is encoded as a rulesets file, CODEOWNERS-driven approval rule, or checked-in repo configuration, so the audit cannot verify it from the repo alone.
- **Severity:** `Medium`
- **Risk scenario:** Protection is silently relaxed through the UI; the CI gates still pass, but direct pushes to `main` become possible.
- **Fix complexity:** `Medium` (use GitHub Rulesets export to JSON and commit as `governance/repo-ruleset.snapshot.json`, or automate via Terraform/`gh api`; add a CI check comparing against the current API response).

### 5. Legacy `vitest.config.ts` still present alongside the sealed config

- **Affected files:** `vitest.config.ts:7-55`, `package.json:29` (`test:coverage:legacy`)
- **Why it matters:** `npm run test:coverage` points at `vitest.seal.config.ts` (thresholds `92/92/95/88`, whole-repo include), but `vitest.config.ts` still ships with thresholds `85/85/90/80` and a narrow allowlist. Anyone running `vitest --coverage` directly, or reading the repo for examples, gets the older, weaker numbers and the stale include list.
- **Severity:** `Medium`
- **Risk scenario:** A new contributor or tool that auto-detects `vitest.config.ts` sees 85% as the target and regresses coverage there.
- **Fix complexity:** `Low` (replace `vitest.config.ts` with a re-export of the seal config or delete it in favor of the seal file; drop the `test:coverage:legacy` alias).

### 6. `tmp-release-health-*` directories are not in `.gitignore`

- **Affected files:** `.gitignore`, `tmp-release-health-0q50hH/`, `tmp-release-health-KmhN5o/`, `tmp-release-health-lhYYKq/`
- **Why it matters:** The drill fixtures produce scratch directories on every run (three are currently in the working tree). They are untracked but show up in `git status`, clutter local audits, and could accidentally be added with `git add .`.
- **Severity:** `Low`
- **Risk scenario:** Accidental commit of a release-health scratch directory with timestamped PIIs to the main branch.
- **Fix complexity:** `Low` (add `tmp-release-health-*/` to `.gitignore`; make the drill harness clean up in `finally`).

### 7. Single desktop target — no macOS/Linux packaging or engines pin

- **Affected files:** `package.json:52-62` (only `win.target: nsis`), absent `engines` field
- **Why it matters:** `README.md` and `docs/guides/quick-start.md` describe a cross-platform React + Electron client, but `electron-builder` is only configured to produce an NSIS installer; `engines` is empty, so Node/npm minimums rely on the CI-pinned `24.12.0`.
- **Severity:** `Medium`
- **Risk scenario:** macOS/Linux contributors hit signature or target errors on `npm run electron:build`; Node 20 users can't tell whether the repo supports them.
- **Fix complexity:** `Medium` (add `mac` and `linux` build targets with appropriate signing configs, and set `engines.node` to match CI; may need entitlement plists for macOS notarization).

### 8. `src/logic/ai/aiPlayer.ts` coverage is below the seal target per file

- **Affected files:** `src/logic/ai/aiPlayer.ts` (80.93% lines / 80.48% branches reported by `v8` coverage; see `test:coverage` output for lines `274-279,283-295`)
- **Why it matters:** The aggregate coverage clears the 92/92/95/88 seal thresholds, but the AI decision module — which drives solo-mode play and is less trivially testable — is the weakest coverage point and is not on the individual `include` in `vitest.config.ts`. Regressions in AI strategy branches could ship undetected.
- **Severity:** `Low`
- **Risk scenario:** Stealth regression in AI gem-picking heuristic during a refactor of `privilegeActions.ts` or `marketActions.ts`.
- **Fix complexity:** `Medium` (add scenario-driven tests in `src/logic/__tests__/aiPlayer.test.ts` or a new `aiPlayerBranches.test.ts` covering the currently uncovered decision paths).

### 9. Pre-commit hook only runs `lint-staged`

- **Affected files:** `.husky/pre-commit`, `package.json:64-71` (lint-staged config)
- **Why it matters:** Husky runs Prettier + ESLint on staged files only. `typecheck`, `test`, and governance gates are enforced in CI, but a developer working offline or force-pushing can land type errors or broken boundary snapshots into a branch before CI rejects it.
- **Severity:** `Low`
- **Risk scenario:** A developer commits a broken snapshot, opens a PR, and only learns at CI time (a preventable trip).
- **Fix complexity:** `Low` (add a `pre-push` hook that runs `typecheck` and fast gates; keep `pre-commit` minimal for speed).

### 10. Seal coverage still excludes ~48 renderer and CLI-wrapper files

- **Affected files:** `vitest.seal.exclusions.ts:1-294`
- **Why it matters:** Every exclusion is individually justified, but the aggregate effect is that nearly all `src/components/**` presentational surfaces, `src/app/shell/**` composition shells, and every `scripts/check-*.mjs` CLI wrapper are excluded from the seal denominator. The numbers are accurate for governed logic, but the project's "whole repo coverage" framing in the archive glosses over this list.
- **Severity:** `Low`
- **Risk scenario:** A composition shell (`AppChrome`, `GameShell`, `PlayerRail`) grows non-trivial prop-wiring logic that breaks silently because it is exempt from seal coverage.
- **Fix complexity:** `Medium` (add a periodic audit of the exclusion list, require a test or an ADR-backed rationale when a new entry is added, and add a lightweight snapshot test that renders each shell without throwing).

---

## 4) Remediation Plan by Phase (Target: 10.0/10 for each dimension)

### P1 — 0-2 weeks (must-fix; close the last audit-visible process gaps)

| Item                                                  | Owner Role          | Files / Components                                             | Acceptance Criteria                                                                                                                                                                | Verification                                                                                 |
| ----------------------------------------------------- | ------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Backfill `CHANGELOG.md` with released-version entries | Engineering Lead    | `CHANGELOG.md`                                                 | Every shipped `v5.x` tag has a dated section summarizing added/changed/fixed/governance deltas                                                                                     | Manual review plus a CI check that the newest git tag appears in `CHANGELOG.md`              |
| Publish a concrete `SECURITY.md` disclosure channel   | Engineering Lead    | `SECURITY.md`                                                  | A dedicated security email (or GitHub Security Advisory URL) is listed and validated                                                                                               | Manual review + `scripts/check-secret-governance.mjs` noting the address is referenced       |
| Remove legacy `vitest.config.ts` drift                | Frontend Platform   | `vitest.config.ts`, `package.json`                             | Either delete the legacy file or replace it with `export { default } from './vitest.seal.config';`                                                                                 | `npx vitest --coverage` uses the seal thresholds; `test:coverage:legacy` alias removed       |
| Add `tmp-release-health-*/` to `.gitignore`           | Release Engineering | `.gitignore`, drill harness cleanup in `scripts/` if needed    | `git status` is clean after any gate run                                                                                                                                           | `npm run release:check && git status --porcelain` is empty                                   |
| Encode the CODEOWNERS–boundary mapping decision       | Engineering Lead    | `CODEOWNERS`, new ADR (e.g. `docs/adr/0008-solo-ownership.md`) | Either split `CODEOWNERS` into the four owner roles named in the boundary registry, or record single-maintainer ownership as an explicit ADR and cross-link from `CONTRIBUTING.md` | Manual review; PR routing shows the right reviewer alias, or ADR is linked from the registry |

### P2 — 2-6 weeks (important, measurable improvements)

| Item                                                             | Owner Role          | Files / Components                                                                 | Acceptance Criteria                                                                                                                                                                                 | Verification                                                                                 |
| ---------------------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Capture branch-protection rules as an auditable repo artifact    | Release Engineering | new `governance/repo-ruleset.snapshot.json`, new `scripts/check-repo-settings.mjs` | A ruleset snapshot is committed; a new gate fails the build if the live GitHub ruleset does not match the snapshot (via `gh api` in CI with a read-only token)                                      | New unit tests in `scripts/__tests__/repoSettings.test.ts`; gate wired into `governance.yml` |
| Raise per-file test depth for `aiPlayer.ts` and other weak files | Domain Logic        | `src/logic/ai/aiPlayer.ts`, `src/logic/__tests__/aiPlayer.test.ts`                 | `aiPlayer.ts` lines ≥ 92, branches ≥ 88; add branch tests for gem/reserve/steal decisions on lines `274-295`                                                                                        | `npm run test:coverage` per-file report; a new CI `coverage:perFileFloor` check              |
| Add `pre-push` hook with `typecheck` and fast gates              | Frontend Platform   | `.husky/pre-push` (new), README update                                             | `git push` runs `npm run typecheck && npm run lint && npm run test -- --run`                                                                                                                        | Local dry run; documented opt-out instructions for machines that cannot install Husky        |
| Broaden desktop packaging to macOS and Linux, declare `engines`  | Desktop Platform    | `package.json`, `build.yml`, notarization config                                   | `build.yml` produces macOS (`.dmg`) and Linux (`.AppImage` or `.deb`) artifacts; `engines.node` and `engines.npm` match CI                                                                          | Matrix build in `build.yml`; `npm run electron:build` success on all three platforms         |
| Document seal exclusion policy and add shell smoke tests         | Frontend Platform   | `vitest.seal.exclusions.ts`, new `src/__tests__/shellSmoke.test.tsx`               | Each composition shell under `src/app/shell/**` and `src/app/chrome/**` has a "renders without throwing" smoke test; the exclusion list has an in-file policy comment explaining the review process | `npm run test:coverage` still green; new smoke tests pass                                    |

### P3 — 6-12 weeks (structural hardening)

| Item                                                               | Owner Role          | Files / Components                                                                              | Acceptance Criteria                                                                                                                                                              | Verification                                                                                 |
| ------------------------------------------------------------------ | ------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Add a performance / regression benchmark harness                   | Frontend Platform   | new `scripts/benchmark/*`, `vitest` benchmarks for `gameReducer`, `networkProtocol`, `aiPlayer` | Hot paths carry a reproducible micro-benchmark; CI records the median run and flags >10% regressions                                                                             | `npm run bench` emits a JSON report; optional CI gate in a separate `benchmark.yml` workflow |
| Publish a signed-release provenance chain                          | Release Engineering | `build.yml`, `scripts/releaseTagProvenance.js`, optional SLSA v1 attestation                    | Each published release carries a provenance attestation linking tag, SHA, SBOM, and governance-evidence artifact IDs                                                             | Consumer can verify the attestation via `gh attestation verify` or `cosign`                  |
| Decompose remaining warning-band components under ADR              | Frontend Platform   | `src/components/Card.tsx`, `src/components/GameBoard.tsx`, `src/components/TopBar.tsx`          | Each file is below its layer's warning threshold, or an ADR in `docs/adr/` records why it stays                                                                                  | `npm run architecture:check` with stricter warning thresholds                                |
| Automate `CODE_OF_CONDUCT.md` and contributor onboarding materials | Engineering Lead    | `CODE_OF_CONDUCT.md`, `docs/guides/onboarding.md`                                               | A contributor can go from `git clone` to a green local `npm run lint && npm run typecheck && npm test` in under 10 minutes using only these documents                            | Manual walkthrough with a new developer; link validation via `markdown-link-check` in CI     |
| Close the loop on governance metrics dashboards                    | Release Engineering | `scripts/releaseHealthReport.js`, new dashboard exporter                                        | The daily `governance-evidence` artifact is transformed into a single HTML/JSON dashboard that exposes 30-day indicator trends; zero regressions visible for 30 consecutive days | `npm run release:report` produces the dashboard; artifacts workflow uploads it               |

---

## 5) Governance Alignment Check

| Governance Requirement                                                                                 | Status             | Evidence / Violation                                                                                                                                     | Score Impact                             |
| ------------------------------------------------------------------------------------------------------ | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `npm run lint` mandatory gate                                                                          | Met                | `npm run lint` → exit 0; required step in `governance.yml:42`, `build.yml:50`, `governance-evidence.yml:44`                                              | —                                        |
| `npm run typecheck` mandatory gate                                                                     | Met                | `tsc --noEmit` → exit 0; required step in `governance.yml:45`, `build.yml:53`, `governance-evidence.yml:47`                                              | —                                        |
| `npm run sbom:check` must pass                                                                         | Met                | "Dependency SBOM gate passed. Components=883, licenses=13"                                                                                               | —                                        |
| `npm test` must pass                                                                                   | Met                | 532/532 pass in 6.06s                                                                                                                                    | —                                        |
| `npm run test:security` must pass                                                                      | Met                | 14 files / 91 tests / 3.50s                                                                                                                              | —                                        |
| `npm run test:coverage` (seal) must pass                                                               | Met                | Aggregate `94.87 / 88.23 / 95.89 / 94.87` vs thresholds `92/92/95/88`                                                                                    | —                                        |
| `npm run desktop:check` must pass                                                                      | Met                | "Desktop governance check passed"; 6 runtime drills passed                                                                                               | —                                        |
| `npm run release:check` must pass                                                                      | Met                | Release health checklist check + operations SLO passed                                                                                                   | —                                        |
| `npm run boundaries:check` must pass with real drift detection                                         | Met                | `scripts/buildBoundaryRegistryFromSource.js` now produces the "actual" registry and `scripts/boundaryGovernance.js:150-171` compares it to the snapshot  | —                                        |
| `npm run architecture:check` must pass                                                                 | Met                | Architecture budget check passed; no exceptions required; forbidden-import rules enforced                                                                | —                                        |
| `npm run bundle:check` must pass                                                                       | Met                | "Build budget check passed: assets/runtime-core-\*.js observed 220.66 kB (warning ≥ 600, incident > 700)"                                                | —                                        |
| `npm run governance:evidence:check` must pass                                                          | Met (after export) | Passes when run after `npm run governance:artifacts` (which is how CI sequences it); manifest retention `30` matches policy                              | —                                        |
| `npm run release:provenance:check` on tag builds                                                       | Met                | `scripts/releaseTagProvenance.js` requires `refs/tags/*`, commit SHA, default branch; gated in `build.yml:71`                                            | —                                        |
| Production dependency audit = 0 vulns                                                                  | Met                | `info=0, low=0, moderate=0, high=0, critical=0`                                                                                                          | —                                        |
| Approved security overrides documented                                                                 | Met                | `package.json:123-139` overrides match `docs/governance/dependency-runtime-governance.md`                                                                | —                                        |
| `docs/governance/electron-ipc-allowlist.md` matches code                                               | Met                | Every `IPC_ALLOWLIST` entry in `electron/preloadContract.cjs` is reflected in the doc, validated by `scripts/check-electron-governance.mjs`              | —                                        |
| `docs/governance/architecture-layer-map.md` ceilings are CI-enforced                                   | Met                | Machine-readable contract embedded in the markdown and consumed by `scripts/architectureBudgets.js`; `approvedExceptions` is empty                       | —                                        |
| `SECURITY.md`, `CODEOWNERS`, `CONTRIBUTING.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, PR template present | Partially met      | All files exist; `CHANGELOG.md` has no released-version entries; `CODEOWNERS` uses a single maintainer; `SECURITY.md` has no concrete disclosure channel | Maintainability, Documentation, Security |
| ADR index covers irreversible architecture decisions                                                   | Met                | 7 ADRs in `docs/adr/`, each aligned with one of the 10 governed boundaries or the audit's P3 items                                                       | —                                        |
| `docs/governance/repo-settings-checklist.md` enforced                                                  | Partially met      | Required checks and retention are documented, but there is no committed ruleset snapshot or automated check against the live repo configuration          | Governance                               |
| Dependabot enabled for both `npm` and `github-actions`                                                 | Met                | `.github/dependabot.yml` declares weekly schedules for both ecosystems                                                                                   | —                                        |
| `patch-peer.js` must not return                                                                        | Met                | No match in repo (legacy compliance retained)                                                                                                            | —                                        |
| `CODE_OF_CONDUCT.md` disclosure                                                                        | **Missing**        | Not present                                                                                                                                              | Documentation                            |

---

## 6) Next-review Milestones

### 30-day follow-up checklist

- [ ] `CHANGELOG.md` backfilled with every published `v5.x` entry and automated on new tags
- [ ] `SECURITY.md` lists a concrete disclosure channel
- [ ] `vitest.config.ts` either deleted or converted to a thin re-export of the seal config
- [ ] `.gitignore` covers `tmp-release-health-*` (and drill harnesses clean up after themselves)
- [ ] `CODEOWNERS` mapping to boundary-registry owners decided (split or recorded in an ADR)
- [ ] `CODE_OF_CONDUCT.md` present and linked from `README.md` / `CONTRIBUTING.md`

### Metrics to track monthly

- TypeScript error count (`npx tsc --noEmit` — target: 0)
- ESLint errors + warnings (target: 0/0)
- Test count, pass rate, flake rate over the month (target: 100% pass / 0 flakes)
- Seal coverage (target: meet or exceed `92/92/95/88`, per-file floor `90/80` for governed files)
- `runtime-core` chunk size in kB (target: ≤ 700, warn ≥ 600 — current `220.66`)
- Release-health indicator counts from the retained `governance-evidence` artifact: `startupFailures`, `runtimeConfigFailures`, `updaterFailures`, `peerFailures`, `recoveryRequests`, `ipcRejected` (target: 0 except explained `recoveryRequests`)
- `npm audit --omit=dev` severity histogram (target: all zero)
- Number of files above each layer's warning threshold (target: trending toward 0 via P3 decomposition)
- `governance-evidence` artifact retention in days (target: ≥ 30)

### Exit criteria

**P1 → P2**

- `CHANGELOG.md` has a dated, governance-tagged entry for `v5.2.11` and any new tag merged since
- `SECURITY.md` references a verifiable disclosure channel
- Legacy `vitest.config.ts` drift is resolved; `npm run test:coverage:legacy` is gone or re-points at the seal config
- `CODEOWNERS` either mirrors the boundary-registry owners or an ADR-backed single-maintainer record is in place
- `.gitignore` no longer leaves `tmp-release-health-*` pseudo-files in `git status`

**P2 → P3**

- `governance/repo-ruleset.snapshot.json` committed; `scripts/check-repo-settings.mjs` gates PRs
- Per-file coverage floor enforced; `src/logic/ai/aiPlayer.ts` above 92% lines / 88% branches
- `build.yml` produces macOS and Linux artifacts; `package.json#engines` declares the supported Node range
- `pre-push` hook runs `typecheck`, `lint`, and `test` with a documented opt-out
- Seal exclusion policy is codified; renderer composition shells have smoke tests

**P3 → "10.0/10 seal"**

- Benchmark harness in CI with ≤ 10% regression tolerance on reducer, protocol, and AI hot paths
- Signed-release provenance chain (SLSA v1 or cosign) published on every tag
- 30 consecutive days of clean `governance-evidence` artifacts (all indicators at healthy thresholds)
- Zero files above their layer's warning threshold, or each exception has an ADR-backed rationale
- `CODE_OF_CONDUCT.md`, onboarding docs, and governance dashboard all committed and cross-linked

---

**End of report.**
