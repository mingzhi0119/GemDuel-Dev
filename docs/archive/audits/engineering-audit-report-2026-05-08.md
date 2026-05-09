# GemDuel-Dev Independent Engineering Audit 2026-05-08

## Completion Status

- Status: **Completed, remediated**
- Completion date: **2026-05-08**
- Scope: repository-contained engineering audit of architecture, code quality, type safety, tests, release readiness, security/dependency posture, runtime reliability, documentation, governance evidence, and source-visible product/UI risk.
- Standard used: `docs/prompts/omx-independent-audit-template.md`, with the current `AGENTS.md` repository rules and the latest archived engineering audit format as references.
- Source changes made by this audit: initial audit created this Markdown report only; remediation then changed focused tests, governance scripts/docs, and shared runtime logic to close confirmed findings.
- Local evidence logs: `/tmp/gemduel-audit-2026-05-08/`

## Executive Summary

- Original audit score: **8.7 / 10**
- Remediation closure score: **10 / 10 local lifecycle certification**
- Risk posture after remediation: **low for local release certification evidence**. The original branch-coverage and governance-evidence blockers are closed; remaining release scope that was not certified here is Windows NSIS packaging and remote GitHub/CI live settings.
- Main conclusion after remediation: the repository now has green type/lint/unit/security/build/dependency gates, branch coverage above the mandatory seal, complete local lifecycle certification, exported governance evidence, and explicit dashboard/provenance semantics.
- Previously most serious 3 issues:
    1. `pnpm test:coverage` fails because branch coverage is **87.47%**, below the required **88%** threshold.
    2. `pnpm lifecycle:certify`, `pnpm governance:artifacts`, and `pnpm governance:evidence:check` fail as a direct consequence, so the repo cannot currently produce a complete local governance evidence bundle.
    3. `pnpm governance:dashboard` still writes an HTML dashboard even when the governance evidence manifest is missing, which can make partial evidence look more complete than it is.

## Remediation Closure Evidence

Environment evidence:

- `pwd` -> `/home/sange/projects/GemDuel-Dev`
- `git branch --show-current` -> `main`
- `node -v` -> `v24.14.1`
- `pnpm -v` -> `10.33.0`

Passed remediation validation commands:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test` -> 169 test files / 1073 tests passed
- `pnpm test:coverage` -> branch coverage **89.93%**, above the **88%** threshold
- `pnpm test:security` -> 12 files / 74 tests passed
- `pnpm architecture:check`
- `pnpm boundaries:check` -> 10 governed boundaries passed
- `pnpm deps:check` -> production audit reported zero vulnerabilities
- `pnpm licenses:check` -> 13 allowed licenses
- `pnpm sbom:check` -> 704 components
- `pnpm secrets:check` -> scanned 1227 text files and 22 governed env names
- `pnpm seal-exclusions:check` -> 97 reviewed exclusions passed governance
- `pnpm desktop:check`
- `pnpm runtime:drills:check`
- `pnpm release:check`
- `pnpm release:artifacts:check` -> `skipped-no-artifacts`
- `pnpm release:provenance:check` -> `skipped-non-tag-context` in local non-tag mode
- `pnpm repo-settings:check`
- `pnpm codeowners:check`
- `pnpm changelog:check`
- `pnpm build`
- `pnpm bundle:check` -> runtime core observed 253.81 kB, below 600 kB warning threshold
- `pnpm bench`
- `pnpm audit:gates --out-dir artifacts/governance`
- `pnpm governance:report`
- `pnpm lifecycle:certify` -> local score **10/10**
- `pnpm governance:artifacts --out-dir artifacts/governance`
- `pnpm governance:evidence:check --artifacts-dir artifacts/governance`
- `pnpm governance:dashboard --artifacts-dir artifacts/governance`

Remediated issue mapping:

- F-001/F-005/F-006: added focused branch coverage for route state, Visual Lab, TURN, PeerJS, and LAN negative paths; global branch coverage is now green.
- F-002: restored lifecycle certification and governance evidence export after coverage recovery.
- F-003: dashboard now fails by default when the evidence manifest is missing and requires explicit `--allow-partial` for diagnostic output.
- F-004: release provenance now distinguishes local non-tag context from CI/tag enforcement, and documentation reflects that policy.
- F-007: shared gameplay setup, AI draft choices, buff fallback draft selection, feedback IDs, board empty-cell IDs, returned-gem IDs, and discard IDs now route through deterministic seams; casual unseeded setup remains explicit.
- F-008: live network inbound parsing now rejects unsupported top-level fields after envelope type dispatch, while documented game-state passthrough remains for replay/snapshot compatibility.
- F-009: seal exclusion governance still passes; no exclusion ledger reduction was required for this remediation slice.

Commands still not run:

- `pnpm electron:build` was not run. The project release target is Windows NSIS, while this remediation ran from WSL/Linux and did not perform packaging certification.
- Remote CI, live GitHub rulesets, branch protection, vulnerability alerts, and production services were not inspected.
- Browser visual QA was outside this engineering-audit remediation scope.

## Original Local Evidence Run

Environment evidence:

- `pwd` -> `/home/sange/projects/GemDuel-Dev`
- `git branch --show-current` -> `main`
- `git status --short --branch` before report -> `## main...origin/main`
- `node -v` -> `v24.14.1`
- `pnpm -v` -> `10.33.0`
- `rg --files | wc -l` -> `1754`

Passed validation commands:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test` -> 164 test files / 1045 tests passed
- `pnpm test:security` -> 12 files / 74 tests passed
- `pnpm architecture:check`
- `pnpm boundaries:check` -> 10 governed boundaries passed
- `pnpm deps:check` -> production audit reported zero vulnerabilities
- `pnpm licenses:check` -> 13 allowed licenses
- `pnpm sbom:check` -> 704 components
- `pnpm secrets:check` -> scanned 1209 text files and 21 governed env names
- `pnpm seal-exclusions:check` -> 97 reviewed exclusions passed governance
- `pnpm desktop:check`
- `pnpm runtime:drills:check`
- `pnpm release:check`
- `pnpm release:artifacts:check` -> `skipped-no-artifacts`
- `pnpm repo-settings:check`
- `pnpm codeowners:check`
- `pnpm changelog:check`
- `pnpm build`
- `pnpm bundle:check` -> runtime core observed 252.65 kB, below 600 kB warning threshold
- `pnpm bench`
- `pnpm audit:gates --out-dir artifacts/governance`
- `pnpm governance:report`
- `pnpm governance:dashboard --artifacts-dir artifacts/governance`

Original failed validation commands:

- `pnpm test:coverage` -> failed because branch coverage was 87.47%, below the 88% global threshold.
- `pnpm lifecycle:certify` -> failed because the dashboard metric `coverage-branch` was 87.48% / minimum 88.00%.
- `pnpm governance:artifacts --out-dir artifacts/governance` -> failed because lifecycle governance dashboard failed 1 check.
- `pnpm governance:evidence:check --artifacts-dir artifacts/governance` -> failed because `artifacts/governance/governance-evidence.manifest.json` was missing after export failed.
- `pnpm release:provenance:check` -> failed in this non-tag local context because no tag ref, commit SHA, or default branch environment was supplied.

Commands not run:

- `pnpm electron:build` was not run. The project release target is Windows NSIS, while this audit ran from WSL/Linux and did not perform packaging certification.
- Remote CI, live GitHub rulesets, branch protection, vulnerability alerts, and production services were not inspected.
- Browser visual verification was not run because this request was for the project engineering audit standard, not a rendered frontend human-expectation audit.

## Confirmed Findings

### F-001: Branch coverage is below the mandatory seal threshold

- PN rating: **P1**
- Remediation status: **Closed**. `pnpm test:coverage` now passes with 89.93% branch coverage.
- Affected files/directories:
    - `packages/config-vitest/desktop.js:39-44`
    - `tools/scripts/check-lifecycle-certification.mjs:151-154`
    - `apps/desktop/coverage/coverage-final.json`
- Evidence:
    - `packages/config-vitest/desktop.js:39-44` sets global coverage thresholds to 92 statements, 92 lines, 95 functions, and **88 branches**.
    - `pnpm test:coverage` failed with `ERROR: Coverage for branches (87.47%) does not meet global threshold (88%)`.
    - `pnpm lifecycle:certify` independently reported `coverage-branch | 87.48% / minimum 88.00%`.
    - Lowest branch-coverage contributors include:
        - `apps/desktop/src/app/visual-lab/VisualLabRestartButton.tsx` -> 20.00%, 1/5 branches
        - `apps/desktop/src/app/visual-lab/useVisualLabExitReset.ts` -> 33.33%, 2/6 branches
        - `apps/desktop/src/app/routes/searchRouteState.ts` -> 46.67%, 7/15 branches
        - `apps/desktop/src/app/visual-lab/motionLabEvents.ts` -> 62.50%, 15/24 branches
        - `apps/desktop/src/app/visual-lab/visualLabMode.ts` -> 62.50%, 5/8 branches
        - `apps/desktop/electron/turnCredentialHttp.js` -> 64.00%, 16/25 branches
        - `apps/desktop/electron/peerSignalingServer.js` -> 68.42%, 13/19 branches
- Impact:
    - This is currently a release/lifecycle blocker. The core unit suite passes, but the project seal requires coverage to pass before lifecycle certification and governance evidence can be treated as complete.
- Suggested remediation phase: **P1**
- Recommended remediation:
    - Add targeted branch tests instead of lowering the threshold.
    - Prioritize route-state and Visual Lab tests first because they provide the largest immediate branch delta with low behavioral risk.
    - Then cover Electron network negative paths that are runtime-risk surfaces.
- Acceptance criteria:
    - `pnpm test:coverage` passes with branch coverage >= 88%.
    - `pnpm lifecycle:certify` no longer reports `coverage-branch` failure.
- Validation commands:
    - `pnpm test:coverage`
    - `pnpm lifecycle:certify`
    - `pnpm governance:artifacts --out-dir artifacts/governance`
- Rollback note:
    - Test-only remediation is rollback-safe. If a new test exposes a real bug, fix the bug separately and keep the test focused on the observed branch.
- Confidence: **High**

### F-002: Complete governance evidence cannot currently be exported

- PN rating: **P1**
- Remediation status: **Closed**. `pnpm lifecycle:certify`, `pnpm governance:artifacts --out-dir artifacts/governance`, and `pnpm governance:evidence:check --artifacts-dir artifacts/governance` now pass.
- Affected files/directories:
    - `package.json:30-35`
    - `tools/scripts/export-governance-artifacts.mjs:205-242`
    - `tools/scripts/governanceEvidenceHealth.js:21-29`
    - `artifacts/governance/governance-evidence.manifest.json`
- Evidence:
    - `package.json:30-35` exposes `governance:artifacts`, `governance:dashboard`, `governance:evidence:check`, and `lifecycle:certify` as first-class repository gates.
    - `tools/scripts/export-governance-artifacts.mjs:205-242` intentionally throws before manifest construction when audit, lifecycle, dashboard, or certification status is not passed.
    - `pnpm governance:artifacts --out-dir artifacts/governance` failed with `Lifecycle governance dashboard failed 1 check(s)`.
    - `tools/scripts/governanceEvidenceHealth.js:21-29` requires `governance-evidence.manifest.json`.
    - `pnpm governance:evidence:check --artifacts-dir artifacts/governance` failed with `Governance evidence manifest is missing at /home/sange/projects/GemDuel-Dev/artifacts/governance/governance-evidence.manifest.json`.
- Impact:
    - The repository cannot currently produce a complete local governance evidence bundle. This is expected while F-001 is open, but it is still a certification failure that blocks a clean release closure story.
- Suggested remediation phase: **P1**
- Recommended remediation:
    - Treat this as a downstream gate failure from F-001.
    - After coverage passes, rerun the lifecycle and evidence chain in order.
    - Do not weaken manifest requirements unless the team explicitly wants a separate partial-evidence mode.
- Acceptance criteria:
    - `pnpm lifecycle:certify` passes.
    - `pnpm governance:artifacts --out-dir artifacts/governance` writes a manifest.
    - `pnpm governance:evidence:check --artifacts-dir artifacts/governance` passes.
- Validation commands:
    - `pnpm test:coverage`
    - `pnpm lifecycle:certify`
    - `pnpm governance:artifacts --out-dir artifacts/governance`
    - `pnpm governance:evidence:check --artifacts-dir artifacts/governance`
- Rollback note:
    - No product code rollback should be needed if this is resolved through tests and existing governance flow.
- Confidence: **High**

### F-003: Governance dashboard can render successfully without a manifest

- PN rating: **P2**
- Remediation status: **Closed**. Dashboard rendering now fails by default without a manifest and requires explicit `--allow-partial` for diagnostic output.
- Affected files/directories:
    - `tools/scripts/render-governance-dashboard.mjs:39-49`
    - `tools/scripts/render-governance-dashboard.mjs:70-85`
    - `tools/scripts/render-governance-dashboard.mjs:94-113`
- Evidence:
    - `readOptionalJson` returns `null` when a report file is missing or unparsable at `tools/scripts/render-governance-dashboard.mjs:39-49`.
    - The dashboard reads `governance-evidence.manifest.json` through that optional path at `tools/scripts/render-governance-dashboard.mjs:85`.
    - The renderer then passes the nullable manifest into `buildGovernanceDashboardHtml` and writes `governance-dashboard.html` at `tools/scripts/render-governance-dashboard.mjs:94-113`.
    - In this audit, `pnpm governance:evidence:check` failed because the manifest was missing, but `pnpm governance:dashboard --artifacts-dir artifacts/governance` still succeeded and wrote the HTML dashboard.
- Impact:
    - Operators can get a successful dashboard command after a failed evidence export. The HTML may still be useful for diagnosis, but the command success can be misread as evidence completeness.
- Suggested remediation phase: **P2**
- Recommended remediation:
    - Add an explicit dashboard completeness status when the manifest is missing.
    - Prefer one of two modes:
        - fail by default when `governance-evidence.manifest.json` is absent, or
        - require an explicit `--allow-partial` flag for diagnostic dashboards.
- Acceptance criteria:
    - A missing manifest cannot silently produce a successful "complete" dashboard.
    - The dashboard UI and CLI output distinguish diagnostic partial output from certified evidence.
- Validation commands:
    - `pnpm governance:dashboard --artifacts-dir artifacts/governance`
    - `pnpm governance:evidence:check --artifacts-dir artifacts/governance`
    - Targeted tests for `render-governance-dashboard.mjs` or `governanceDashboardHtml.js`.
- Rollback note:
    - Keep a diagnostic partial mode if operators rely on dashboard output during failure triage.
- Confidence: **High**

### F-004: Release provenance command is listed as a required gate but fails in ordinary local non-tag runs

- PN rating: **P2**
- Remediation status: **Closed**. Local non-tag runs now report `skipped-non-tag-context`; CI/tag and `--strict` contexts remain enforcing.
- Affected files/directories:
    - `docs/governance/release-health-checklist.md:5-15`
    - `package.json:38-40`
    - `tools/scripts/check-release-tag-provenance.mjs:9-15`
    - `tools/scripts/check-release-tag-provenance.mjs:47-67`
- Evidence:
    - `docs/governance/release-health-checklist.md:5-15` lists `pnpm release:provenance:check` among required release gates.
    - `package.json:38-40` exposes `release:artifacts:check`, `release:check`, and `release:provenance:check` as root scripts.
    - `tools/scripts/check-release-tag-provenance.mjs:9-15` defaults to `GITHUB_SHA`, `GITHUB_DEFAULT_BRANCH`, and `GITHUB_REF`.
    - `tools/scripts/check-release-tag-provenance.mjs:47-67` exits nonzero when required provenance inputs are missing.
    - In this local audit, the command failed with:
        - `Release provenance check requires a tag ref (refs/tags/*).`
        - `Release provenance check requires a commit SHA.`
        - `Release provenance check requires a default branch name.`
- Impact:
    - The command is valid for tag/CI provenance, but its placement in the required checklist creates local audit ambiguity. A developer following the checklist literally will see a red gate even when not cutting a tag.
- Suggested remediation phase: **P2**
- Recommended remediation:
    - Clarify the checklist so `release:provenance:check` is explicitly tag/CI-only unless arguments are provided.
    - Optionally add a local diagnostic mode that prints "skipped-non-tag-context" with a nonzero or zero policy chosen deliberately.
- Acceptance criteria:
    - Local non-tag audits do not have to guess whether this failure is expected.
    - Tag release checks remain strict.
- Validation commands:
    - `pnpm release:provenance:check`
    - `pnpm release:provenance:check -- --release-ref refs/tags/<tag> --commit-sha <sha> --default-branch main`
    - `pnpm release:check`
- Rollback note:
    - If a script-mode change is risky, fix the documentation first and leave the strict tag script unchanged.
- Confidence: **High**

### F-005: Visual Lab and query-route state have the weakest branch coverage in active renderer code

- PN rating: **P2**
- Remediation status: **Closed**. Focused route-state and Visual Lab branch tests were added; the named modules no longer dominate the branch shortfall.
- Affected files/directories:
    - `apps/desktop/src/app/routes/searchRouteState.ts:16-90`
    - `apps/desktop/src/app/visual-lab/useVisualLabExitReset.ts:18-32`
    - `apps/desktop/src/app/visual-lab/VisualLabRestartButton.tsx:27-60`
    - `apps/desktop/src/app/visual-lab/motionLabEvents.ts:41-62`
    - `apps/desktop/src/app/visual-lab/visualLabMode.ts:4-24`
- Evidence:
    - `searchRouteState.ts` owns URL-derived setup, matchmaking, and Visual Lab state. Its branch coverage is 46.67%.
    - `useVisualLabExitReset.ts` controls Visual Lab exit reset behavior based on `visualLabMode` and `historyLength`. Its branch coverage is 33.33%.
    - `VisualLabRestartButton.tsx` contains theme/readability branches for the close/back control. Its branch coverage is 20.00%.
    - `motionLabEvents.ts` maps Visual Lab motion event requests to presentation events and returns `null` when market/deck state is not available. Its branch coverage is 62.50%.
    - `visualLabMode.ts` gates Visual Lab route availability behind runtime unlock and query parsing. Its branch coverage is 62.50%.
- Impact:
    - These files sit on recently expanded URL/history and Visual Lab QA surfaces. Under-covered branches are exactly the paths most likely to regress browser Back behavior, invalid query handling, dev/prod Visual Lab gating, and empty-state motion previews.
- Suggested remediation phase: **P1/P2**
- Recommended remediation:
    - Add focused tests for:
        - no `window` / SSR guard branches,
        - invalid query values,
        - `setup`, `matchmaking`, and `visualLab` query precedence,
        - push vs replace vs no-op history writes,
        - Visual Lab entered directly vs entered through app history,
        - motion lab event creation when preferred market/deck cards are missing.
- Acceptance criteria:
    - These targeted files no longer dominate the branch shortfall.
    - Route-state behavior is test-described instead of only browser-observed.
- Validation commands:
    - `pnpm --dir apps/desktop exec vitest run src/app/routes/__tests__/searchRouteState.test.ts src/app/visual-lab/__tests__/visualLabMode.test.ts src/app/visual-lab/__tests__/motionLabEvents.test.ts`
    - `pnpm test:coverage`
- Rollback note:
    - Keep tests deterministic and fixture-based. If a route behavior needs to change, update tests in the same small patch.
- Confidence: **High**

### F-006: Runtime-risk Electron and LAN/TURN branches remain under-covered

- PN rating: **P2**
- Remediation status: **Closed**. TURN, peer signaling, LAN helper, and LAN renderer-hook negative paths now have focused branch tests.
- Affected files/directories:
    - `apps/desktop/electron/turnCredentialHttp.js:9-110`
    - `apps/desktop/electron/peerSignalingServer.js:9-36`
    - `apps/desktop/electron/peerSignalingServer.js:163-205`
    - `apps/desktop/electron/lanDiscoverySession.js:31-50`
    - `apps/desktop/src/hooks/useLanMatchmaking.ts:64-188`
- Evidence:
    - Coverage data shows `turnCredentialHttp.js` at 64.00% branch coverage.
    - Coverage data shows `peerSignalingServer.js` at 68.42% branch coverage.
    - Coverage data shows `lanDiscoverySession.js` at 80.00% branch coverage.
    - Coverage data shows `useLanMatchmaking.ts` at 79.41% branch coverage.
    - These modules are not currently failing tests, but they are below the global branch seal and sit on network, timeout, IPC, and local discovery behavior.
- Impact:
    - Negative-path runtime behavior can regress without being caught. The already-present implementation has meaningful failure handling, but the evidence does not cover enough branches for release-level confidence.
- Suggested remediation phase: **P2**
- Recommended remediation:
    - Add tests for:
        - TURN service disabled, timeout, non-JSON, non-OK, and schema-invalid payloads,
        - port scan failure paths and shutdown exceptions in the peer server,
        - LAN launch builder missing fields,
        - LAN bridge absence and rejection paths in the renderer hook.
- Acceptance criteria:
    - Network/runtime edge-path tests raise branch coverage without reducing existing strictness.
    - Runtime failure messages remain user-visible where the renderer owns UI state.
- Validation commands:
    - `pnpm --dir apps/desktop exec vitest run electron/__tests__/turnCredentialClient.test.ts electron/__tests__/peerSignalingServer.test.ts src/hooks/__tests__/useLanMatchmaking.test.tsx`
    - `pnpm test:security`
    - `pnpm test:coverage`
- Rollback note:
    - Test-only changes are safe to revert. If tests reveal runtime bugs, split the bug fix from pure coverage additions.
- Confidence: **High**

### F-007: Some deterministic gameplay surfaces still fall back to ambient randomness and time

- PN rating: **P2**
- Remediation status: **Closed for shared gameplay decision paths**. Setup, AI, draft fallback, feedback, board-empty, discard, and returned-gem paths now use deterministic seams; the remaining ambient fallback is the explicitly documented casual unseeded random source and replay simulation timestamp default.
- Affected files/directories:
    - `packages/shared/src/utils.ts:23-27`
    - `packages/shared/src/utils.ts:69-83`
    - `packages/shared/src/utils.ts:97-115`
    - `packages/shared/src/logic/gameSetup.ts:26-35`
    - `packages/shared/src/logic/gameSetup.ts:54-58`
    - `packages/shared/src/logic/gameSetup.ts:205-227`
    - `packages/shared/src/logic/ai/aiPlayer.ts:31-37`
    - `packages/shared/src/logic/actions/buffActions.ts:240-253`
- Evidence:
    - `utils.ts:23-27` defaults to `Math.random` and `Date.now()` when no `RandomSource` is supplied.
    - `generateGemPool` and `generateDeck` can still generate IDs from `Date.now()` fallback paths at `utils.ts:75-77` and `utils.ts:109-111`.
    - `gameSetup.ts:26-35` supports seeded setup, but `getRandomBasicGemColor` falls back to `Math.random`.
    - `gameSetup.ts:216` still uses `(randomSource?.next ?? Math.random)()` for buff level choice.
    - AI draft selection uses `Math.random()` directly at `aiPlayer.ts:34-36`.
    - P2 draft fallback shuffles with `sort(() => Math.random() - 0.5)` at `buffActions.ts:251-252`.
- Impact:
    - The project now has seeded helpers, so this is not the old full determinism gap. The remaining risk is that any caller path that omits a seed/random source can still produce non-reproducible setup or AI/draft outcomes, which weakens replay/debug reproducibility.
- Suggested remediation phase: **P2**
- Recommended remediation:
    - Inventory all gameplay setup and AI call sites that can run without a `RandomSource`.
    - Move direct AI and buff fallback randomness behind the same seeded/random-source seam.
    - Preserve convenience defaults for casual local play, but ensure replayable/tested paths explicitly provide a random source or capture generated randoms in action payloads.
- Acceptance criteria:
    - Same-seed setup and AI/draft test cases are reproducible.
    - No direct `Math.random()` remains in shared gameplay decision paths unless explicitly documented as non-replayable convenience behavior.
- Validation commands:
    - `rg "Math\\.random|Date\\.now\\(" packages/shared/src`
    - `pnpm --filter @gemduel/shared typecheck`
    - Targeted shared setup / AI determinism tests
    - `pnpm test`
- Rollback note:
    - Keep public helper signatures backward-compatible by defaulting options while routing internals through `RandomSource`.
- Confidence: **Medium-high**

### F-008: Unknown-field policy is still broad in game-state schemas

- PN rating: **P3**
- Remediation status: **Closed for live network inbound scope**. Network messages now reject unsupported top-level fields after type dispatch; game-state passthrough remains documented for replay/snapshot compatibility.
- Affected files/directories:
    - `packages/shared/src/logic/contractSchemasNetwork.ts:104-117`
    - `packages/shared/src/logic/contractSchemasGameState.ts:14-31`
    - `packages/shared/src/logic/contractSchemasGameState.ts:52-60`
    - `packages/shared/src/logic/contractSchemasGameState.ts:110-145`
    - `packages/shared/src/logic/contractSchemasGameState.ts:175-221`
- Evidence:
    - `networkEnvelopeSchema` uses `.passthrough()` at `contractSchemasNetwork.ts:104-117`; final discriminated network message schemas are stricter, but the envelope probe itself preserves unknown fields.
    - Many game-state, setup, and action payload schemas in `contractSchemasGameState.ts` use `.passthrough()`, including gem coordinates, inventories, cards, setup payloads, selected buffs, buy payloads, and reserve payloads.
- Impact:
    - This is not a proven command bypass. The reducer and final network message schemas still provide important validation. The risk is contract ambiguity: compatibility fields, replay fields, and accidental unknown fields currently share the same permissive mechanism.
- Suggested remediation phase: **P3**
- Recommended remediation:
    - Classify schemas into:
        - strict external inbound live protocol,
        - replay/backward-compatibility parse,
        - internal snapshot compatibility.
    - Use `.strict()` or `.strip()` for live inbound boundaries where compatibility is not required.
    - Keep `.passthrough()` only where replay compatibility is intentional and documented.
- Acceptance criteria:
    - Contract tests explicitly describe whether extra keys are rejected, stripped, or preserved.
    - Live network inbound behavior cannot silently retain unexpected fields unless a compatibility rule says so.
- Validation commands:
    - `pnpm test:security`
    - Targeted contract schema tests
    - `pnpm boundaries:check`
- Rollback note:
    - Tighten one schema family at a time. If legacy replay compatibility breaks, isolate permissive parsing in replay import rather than live network schemas.
- Confidence: **Medium**

### F-009: Seal exclusion ledger is governed but remains a large recurring review surface

- PN rating: **P3**
- Remediation status: **Accepted for scheduled governance review**. `pnpm seal-exclusions:check` passes for the current 97 reviewed exclusions; reducing the ledger remains a future review-cadence item.
- Affected files/directories:
    - `packages/config-vitest/sealExclusions.js:3-20`
    - `packages/config-vitest/sealExclusions.js:99-214`
- Evidence:
    - `sealExclusions.js:3-20` defines `LAST_REVIEWED_ON = '2026-04-21'`, a 30-day review cadence, and a baseline count of 97 exclusions.
    - `pnpm seal-exclusions:check` passed for 97 reviewed exclusions.
    - The ledger distribution is concentrated in Frontend Platform: 65 exclusions. Category distribution: 36 leaf, 14 shell, 15 static, 32 wrapper.
- Impact:
    - This is not a gate failure. It is a recurring governance load. The ledger is explicit and audited, but the count is high enough that coverage debt can reaccumulate if monthly review becomes mechanical.
- Suggested remediation phase: **P3**
- Recommended remediation:
    - Before the next review deadline, retire exclusions for files that now own meaningful branch behavior or route state.
    - Prioritize Visual Lab and route-state exclusions against the current branch-coverage failure.
- Acceptance criteria:
    - The next exclusion review records which entries stayed excluded, which gained tests, and why the baseline count did or did not change.
- Validation commands:
    - `pnpm seal-exclusions:check`
    - `pnpm test:coverage`
- Rollback note:
    - If removing an exclusion creates noisy low-value tests, restore it with a specific ADR-backed rationale.
- Confidence: **High**

## Positive Controls Observed

- Architecture boundaries are currently strong:
    - `pnpm architecture:check` passed.
    - `pnpm boundaries:check` passed for 10 governed boundaries.
    - A targeted shared-purity search found no React, Electron, DOM, `lucide-react`, `clsx`, or `tailwind-merge` imports in `packages/shared/src` or `packages/shared/package.json`.
- Static and local quality gates are healthy:
    - `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:security`, and `pnpm build` passed.
- Dependency and supply-chain controls are healthy locally:
    - `pnpm deps:check`, `pnpm licenses:check`, `pnpm sbom:check`, and `pnpm secrets:check` passed.
- Desktop runtime controls are significantly better than older audit baselines:
    - `pnpm desktop:check` and `pnpm runtime:drills:check` passed.
    - LAN renderer hook now exposes browser fallback and IPC rejection handling.
    - TURN request code now has timeout/abort behavior.
    - Preload and privileged update paths appear governed by current tests and desktop checks.

## 10-Dimension Scorecard

| Dimension                                              | Score | Evidence Basis                                                                                                                                                                    |
| ------------------------------------------------------ | ----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Architecture and domain boundaries                  |   9.4 | `architecture:check` and `boundaries:check` passed; shared package purity search was clean.                                                                                       |
| 2. Code quality and maintainability                    |   9.0 | `lint` passed; architecture budget reported no current warnings; remaining concern is concentrated under-tested branch behavior.                                                  |
| 3. Type safety and static correctness                  |   9.6 | `typecheck` passed across the Turborepo.                                                                                                                                          |
| 4. Test coverage and test quality                      |   7.6 | 1045 tests passed, but `test:coverage` failed on branches: 87.47% / 88%.                                                                                                          |
| 5. Build, release, and desktop packaging readiness     |   8.3 | `build`, `bundle:check`, `release:check`, and `release:artifacts:check` passed/skipped as expected locally; tag provenance and Windows NSIS packaging were not locally certified. |
| 6. Security, dependency, and secret-governance posture |   9.2 | security tests, deps, SBOM, license, and secrets gates passed; TURN/LAN negative-path branch coverage remains below seal.                                                         |
| 7. Runtime reliability and failure handling            |   8.8 | desktop and runtime drills passed; remaining risk is branch evidence for IPC/network failure paths.                                                                               |
| 8. Documentation and onboarding quality                |   9.0 | governance docs, release checklist, repo settings, CODEOWNERS, and changelog checks passed; local-vs-tag provenance wording needs clarification.                                  |
| 9. Governance automation and evidence quality          |   7.8 | audit gates/report passed, but lifecycle certification and evidence export are red; dashboard partial-output semantics need tightening.                                           |
| 10. Product/UI risk visible from source/docs           |   8.2 | frontend human-expectation audit exists separately; source-visible risk is now mainly route/Visual Lab branch coverage and seal-exclusion concentration.                          |

Overall score: **8.7 / 10**

## Confirmed Issues vs Hypotheses

Confirmed issues:

- F-001 through F-006 are confirmed by command failures, coverage data, or direct source evidence.
- F-009 is confirmed as a governance-load issue, not a failing gate.

Evidence-backed risks, not proven runtime bugs:

- F-007 is a confirmed source pattern with a reproducibility risk. This audit did not prove a user-visible replay desync.
- F-008 is a confirmed schema-policy pattern. This audit did not prove a command bypass or exploit.

## Phased Remediation Plan

### P0

No P0 issue was confirmed in this audit.

### P1

1. Restore coverage seal.
    - Target F-001 and F-005 first.
    - Add focused branch tests for `searchRouteState`, `useVisualLabExitReset`, `VisualLabRestartButton`, `visualLabMode`, and `motionLabEvents`.
    - Then rerun the coverage and lifecycle chain.

2. Restore complete governance evidence export.
    - Target F-002 after coverage is green.
    - Do not change evidence semantics until the coverage root cause is fixed.

Validation:

- `pnpm test:coverage`
- `pnpm lifecycle:certify`
- `pnpm governance:artifacts --out-dir artifacts/governance`
- `pnpm governance:evidence:check --artifacts-dir artifacts/governance`

Rollback:

- Revert test-only changes file by file if they prove brittle.
- If a new test exposes a product bug, separate the bug fix from the coverage patch.

### P2

1. Make dashboard partial evidence explicit.
    - Target F-003.
    - Decide whether missing manifest should fail by default or require `--allow-partial`.

2. Clarify release provenance local-vs-tag behavior.
    - Target F-004.
    - Start with documentation if script changes are too broad.

3. Raise runtime-risk negative-path branch coverage.
    - Target F-006.
    - Cover TURN, peer signaling, LAN launch, and LAN renderer rejection/absence branches.

4. Finish deterministic randomness governance.
    - Target F-007.
    - Route AI and fallback draft randomness through `RandomSource` or captured action randoms.

Validation:

- `pnpm test:security`
- `pnpm desktop:check`
- `pnpm runtime:drills:check`
- `pnpm test:coverage`
- `pnpm release:check`

Rollback:

- Keep behavior changes isolated behind small adapters or helpers.
- Preserve existing public helper signatures unless a versioned contract update is intentionally approved.

### P3

1. Document strict/strip/passthrough schema policy.
    - Target F-008.
    - Do not break replay compatibility without a fixture migration plan.

2. Review and reduce seal exclusions before the next cadence deadline.
    - Target F-009.
    - Prioritize route, Visual Lab, and runtime shells that now contain enough branching behavior to deserve direct tests.

Validation:

- `pnpm seal-exclusions:check`
- `pnpm test:coverage`
- `pnpm boundaries:check`
- `pnpm architecture:check`

Rollback:

- Restore intentional exclusions with a more precise ADR-backed reason if removal produces low-value tests.

## Exact Validation Command Set For Closure

Minimum closure for the current red audit:

```bash
pnpm test:coverage
pnpm lifecycle:certify
pnpm governance:artifacts --out-dir artifacts/governance
pnpm governance:evidence:check --artifacts-dir artifacts/governance
```

Full local closure after remediation:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm test:security
pnpm architecture:check
pnpm boundaries:check
pnpm deps:check
pnpm licenses:check
pnpm sbom:check
pnpm secrets:check
pnpm seal-exclusions:check
pnpm desktop:check
pnpm runtime:drills:check
pnpm release:check
pnpm release:artifacts:check
pnpm repo-settings:check
pnpm codeowners:check
pnpm changelog:check
pnpm build
pnpm bundle:check
pnpm bench
pnpm audit:gates --out-dir artifacts/governance
pnpm governance:report
pnpm lifecycle:certify
pnpm governance:artifacts --out-dir artifacts/governance
pnpm governance:evidence:check --artifacts-dir artifacts/governance
pnpm governance:dashboard --artifacts-dir artifacts/governance
```

Release/tag-only validation:

```bash
pnpm release:provenance:check -- --release-ref refs/tags/<tag> --commit-sha <sha> --default-branch main
```

Windows packaging validation, outside this WSL audit:

```bash
pnpm electron:build
```

## Audit Limits

- This audit did not inspect live GitHub branch protection, rulesets, vulnerability-alert settings, or remote CI state.
- This audit did not run Windows NSIS packaging.
- This audit did not perform browser visual QA. The current report uses source, tests, governance scripts, and local command evidence.
- Generated artifacts under `artifacts/governance/` and `apps/desktop/coverage/` were used as local evidence outputs and are not part of this report's intended tracked change set.
