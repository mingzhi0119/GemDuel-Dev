# Unity Replacement Candidate Completion Audit - 2026-05-13

Status: Incomplete.

This audit refresh maps the active Unity replacement-candidate prompt to the current repo and
retained evidence. It is not a completion claim. The strongest retained evidence now includes
audited built-player LocalDev mailbox runs, release-path replay checks, game-over winner guards,
mailbox response file/digest/argument/failure-reason hardening, peek-modal, recovery
invalid-action, privilege-cancel, reserved-discard, reserved-buy, and reserve-cancel summary guard
hardening, reserve-deck, reserve-deck-cancel, Joker, draft summary guard hardening, strict
aggregate report-count hardening, strict aggregate unique-report-path hardening, strict aggregate
unique nested smoke-report hardening, strict aggregate unique log-path hardening, and strict
audited aggregate unique-path hardening, built-player launcher process, success-flag,
required-flag metadata, and replay release-path no-mutation guard testing, audited replay/game-over
strict aggregate composition, and
audited digest-count aggregate hardening, all-release plus audited-digest strict union composition,
launcher-args refreshed union evidence, and the retained full Electron/Unity configured parity pass
at `artifacts/electron-unity-parity/2026-05-13T14-15-37-411Z`,
plus
structured TypeScript bridge error handling for malformed CLI requests and valid rejected CLI
gameplay commands plus bridge availability, corrupt-response cleanup, and stale request cleanup
EditMode coverage. The replacement-candidate gate still fails because product-scope and
release-runtime blockers remain.

## Objective Restated

Advance Unity from Editor/EditMode evidence toward replacement-candidate readiness without changing
Electron or shared gameplay merely for Unity. Completion requires every mandatory governance gate in
`docs/migration/unity-migration-governance.md` to pass, including fresh arbitrary Local PvP through
the product surface, complete supported product scope or explicit user-approved exclusions,
release-path replay/recovery, hardened LocalDev services, resolved release-runtime rules packaging,
Unity editor/build/player evidence, repo gates, and clean artifact hygiene.

Current result: bounded LocalDev/evidence readiness advanced; replacement-candidate readiness is not
achieved.

## Baseline Checked

| Required baseline item        | Evidence checked in this refresh                                                                                                                                                                                       | Verdict  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `git status --short --branch` | Branch is `codex/unity-electron-parity-candidate...origin/codex/unity-electron-parity-candidate` with the existing migration docs/source/tooling diff and untracked Unity smoke helpers.                               | Recorded |
| `git log --oneline -5`        | Latest commits are `5f6a179`, `6e8af1b`, `95a85b7`, `e9f8807`, and `9090fc2`.                                                                                                                                          | Recorded |
| `git diff --name-only`        | Current tracked diff remains the migration source/docs/tooling set, including Unity bridge/controller files, migration docs, rejection manifest, shared oracle tests, bridge tooling, and runtime config policy tests. | Recorded |
| Ignored artifacts boundary    | `git check-ignore -v` confirms key retained built-player aggregate JSON files are ignored by `.gitignore:31:/artifacts/`.                                                                                              | Passed   |

## Prompt-To-Artifact Checklist

| Prompt requirement                                             | Evidence checked                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Verdict                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Follow `docs/migration/unity-migration-governance.md`.         | Current completion report and scope docs keep governance as the active contract and reject completion from proxy evidence.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Passed for governance framing     |
| Read required starting docs.                                   | Active references remain `current-migration-task-plan.md`, completion report, prior final audit note, product scope map, full parity matrix, release checklist, and ADR-0012.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Passed for audit scope            |
| Update `current-migration-task-plan.md` before source changes. | This audit refresh added a dated plan section before tooling/source edits and kept the allowed file list explicit.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Passed                            |
| Treat prior final audit boundary as binding.                   | ADR-0012 and migration docs still identify `TypeScriptGameRulesEngine` as LocalDev/evidence-only; checkpoint-derived helpers remain replay/audit-only; Electron/shared gameplay changes require oracle justification and tests.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Passed, blockers remain           |
| A. Built Windows player fresh-launch proof.                    | Retained strict aggregate `built-player-smoke-matrix-20260513-strict-unique-log-path-guard.json` parses with `passed=true`, `requiredReportCount: 27`, `requireUniqueReportPaths: true`, no duplicate report paths, `requireUniqueSmokeReportPaths: true`, no duplicate nested smoke-report paths, `requireUniqueLogPaths: true`, no duplicate stdout/stderr/player log paths, 27 reports, 716 commands, 812 mailbox events, required winners covered, one report for every current release-path proof family, and status `incomplete-evidence`. The audited replay/game-over strict aggregate `built-player-smoke-matrix-20260513-audited-replay-gameover-strict-unique-paths.json` also parses with 9/9 reports, 374 valid audit response files, exact report-count, unique launcher/nested/log paths, replay release-path coverage, one invalid-action release-path report, and winners `p1,p2`. The audited digest-count strict aggregate `built-player-smoke-matrix-20260513-audited-replay-gameover-digest-count-strict.json` parses with 10/10 reports, 377 valid audit response files, 3 valid response digests, launcher-argument validation, exact report-count, unique launcher/nested/log paths, replay release-path coverage, one invalid-action release-path report, and winners `p1,p2`. The refreshed broad union `built-player-smoke-matrix-20260513-launcher-args-refreshed-union.json` parses with 37/37 reports, every current release-path proof family, all 21 action families, six game-over reports, winners `p1,p2`, 421 valid audit response files, 47 valid response digests, `--require-launcher-args`, and unique launcher/nested/log paths. | Advanced, incomplete              |
| B. Broader arbitrary Local PvP product-surface coverage.       | Retained aggregates cover deterministic representative seeds and action families only; docs explicitly reject unbounded or arbitrary product-surface completion.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Incomplete                        |
| C. Replay import/export/review release-path coverage.          | Audited replay release-path aggregate parses with `passed=true`, one report, 8 commands, 9 mailbox events, final hash `f9eb9e83`, and status `incomplete-evidence`; docs list invalid JSON, missing file, unsupported schema, corrupt summary, hash mismatch, overwrite/reload, and review checks.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Advanced, incomplete              |
| D. Recovery and invalid-action coverage.                       | Rejection manifest and Unity bridge tests are recorded for 65 oracle cases; audited combined guard covers one invalid-action release-path report while retaining status `incomplete-evidence`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Advanced, incomplete              |
| E. TypeScriptGameRulesEngine LocalDev bridge hardening.        | Bridge docs/tests record availability checks, missing pnpm/vite-node messaging, missing `tools/scripts`, missing bridge-script messaging, timeouts, temp cleanup, stale request cleanup, repo-root behavior, structured CLI error output for malformed requests and valid rejected commands, mailbox audit response retention, malformed mailbox response cleanup, and platform/user hash exclusion for deterministic start plus metadata-decorated live `apply` requests. Release-runtime packaging remains open.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Advanced, release blocker remains |
| F. LAN / online / Visual Lab decision path.                    | Product-scope map and completion report list LAN, online, and Visual Lab as not implemented and not user-approved excluded.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Blocking                          |
| G. Shared gameplay action diffs follow-up.                     | Shared tests and docs record deterministic empty board UID, draft reroll determinism with P1/P2 draft ownership separation, and unaffordable buy `pendingBuy` preservation as TypeScript oracle fixes. Focused validation passed 3 files and 57 tests. No new shared gameplay logic was changed in this audit refresh.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Followed                          |

## Named Files And Deliverables

| Named file or deliverable                                      | Current evidence                                                                                                                                                            | Verdict                         |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `docs/migration/current-migration-task-plan.md`                | Contains dated May 13 plan/result sections and this audit-refresh scope.                                                                                                    | Updated                         |
| `docs/migration/unity-full-migration-completion-report.md`     | Status remains `Incomplete`; report separates repo gates, Unity editor/build, built-player evidence, and blockers.                                                          | Updated to reference this audit |
| `docs/migration/unity-full-parity-matrix.md`                   | Records the successful full configured parity rerun at `artifacts/electron-unity-parity/2026-05-13T14-15-37-411Z` while preserving incomplete replacement-candidate status. | Updated                         |
| `docs/migration/unity-product-scope-map.md`                    | Contains LAN / Online / Visual Lab decision table and blocked scope conclusion.                                                                                             | Updated                         |
| `docs/migration/unity-platform-release-checklist.md`           | Records platform/release checklist status, latest full EditMode pass, and LocalDev bridge/release-runtime distinction.                                                      | Updated                         |
| `docs/migration/unity-migration-risk-table.md`                 | Keeps product-scope and release-runtime risks open or mitigating, not closed.                                                                                               | Updated                         |
| `docs/archive/unity-next-run-audit-note-2026-05-13.md`         | Concise handoff preserves `Incomplete` status and blocker set.                                                                                                              | Updated                         |
| Built-player machine-readable reports under `artifacts/unity/` | Key aggregate JSON files parse successfully and remain ignored.                                                                                                             | Passed for retained evidence    |

## Suggested Command Checklist

| Command or gate from prompt                                                                                    | Current evidence status                                                                                                                                                                                                                                                                                                                          | Completion impact                          |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ | ---------- | -------------- | --------------- | ---------------------------------------------------------------- | ------------------------------ |
| `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`               | Retained prior pass is recorded in migration docs.                                                                                                                                                                                                                                                                                               | Useful evidence, not sufficient alone      |
| `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts`                                       | Passed 35/35 after adding structured CLI `--out` response-file coverage for valid rejected gameplay commands, alongside the existing malformed request JSON guard.                                                                                                                                                                               | Useful bridge evidence                     |
| `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts --check`      | Retained prior pass is recorded.                                                                                                                                                                                                                                                                                                                 | Useful catalog evidence                    |
| `pnpm parity:electron-unity`                                                                                   | The first attempt timed out after about 604 seconds, but the longer full rerun passed at `artifacts/electron-unity-parity/2026-05-13T14-15-37-411Z` with `unity.ok: true`, 54 equivalent rows, and browser process counts inside budget; configured parity still does not prove arbitrary product-surface Local PvP or excluded-scope decisions. | Not sufficient for completion              |
| `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`, `pnpm build`                                 | Retained May 13 continuation gates are recorded in the risk table and completion report.                                                                                                                                                                                                                                                         | Repo gate evidence, not product completion |
| `pnpm release:check`, `boundaries:check`, `architecture:check`, `deps:check`, `desktop:check`, `secrets:check` | Retained May 13 continuation gates are recorded.                                                                                                                                                                                                                                                                                                 | Release hygiene evidence                   |
| Unity EditMode command                                                                                         | Latest final full EditMode evidence `artifacts/unity/editmode-final-validation-fixed-20260513-results.xml` reports 91/91 passed after the no-take-3 smoke-driver fix; earlier mailbox cleanup, corrupt-response, and availability negative-case reruns remain retained evidence.                                                                 | Editor evidence only                       |
| Unity Windows build command                                                                                    | Retained post-fix Windows build success is recorded.                                                                                                                                                                                                                                                                                             | Build evidence only                        |
| Built-player proof command/tooling                                                                             | Retained launcher reports and aggregate JSON files prove bounded LocalDev player evidence.                                                                                                                                                                                                                                                       | Still incomplete because scope is bounded  |
| `git grep -n "ReplaceSnapshot"`                                                                                | Latest docs record no live Core/Presentation matches in the hygiene pass.                                                                                                                                                                                                                                                                        | Supports checkpoint boundary               |
| `git grep -nE "GemDuelVerticalSlice                                                                            | vertical slice                                                                                                                                                                                                                                                                                                                                   | scoped parity                              | 90% parity | guided fixture | remaining 10%"` | Latest docs record the vertical-slice language hygiene boundary. | Supports naming/scope boundary |
| `git diff --check` and `git status --short`                                                                    | Re-run as part of this audit-refresh validation.                                                                                                                                                                                                                                                                                                 | Hygiene evidence only                      |

Focused shared action oracle validation:
`pnpm exec vitest run packages/shared/src/logic/actions/__tests__/boardActions.test.ts packages/shared/src/logic/actions/__tests__/buffActions.branch.test.ts packages/shared/src/logic/actions/__tests__/marketActions.phase3.test.ts`
passed 3 files and 57 tests. This covers the prompt-named deterministic empty UID, draft reroll,
and unaffordable buy `pendingBuy` behaviors without shared runtime or Electron gameplay changes.

Focused replay-review summary guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 25/25,
including complete replay-review navigation evidence and missing visible review-control fail-closed
cases. Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-review-navigation-guard.json`
passed with 1/1 report, 4 commands, 10 mailbox events, replay-review hash `db7fb1b7`, and status
`incomplete-evidence`.

Focused replay release-path summary guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 27/27,
including complete replay release-path coverage/case/hash evidence and missing coverage
fail-closed cases. Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-release-path-summary-guard.json`
passed with 1/1 report, 8 commands, 9 mailbox events, 9/9 retained audit response files, full
replay release-path coverage, final hash `f9eb9e83`, and status `incomplete-evidence`.

Focused invalid-action summary guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 29/29,
including complete invalid-action no-mutation/no-recording evidence and retained rejected-case
mutation fail-closed cases. Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-invalid-action-summary-guard.json`
passed with 1/1 report, 1 product-surface command, 9 mailbox events, 9/9 retained audit response
files, invalid-action hash `f2780c3f`, and status `incomplete-evidence`.

Focused recovery summary guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 31/31,
including complete recovery save/load/continue evidence and missing continuation-event fail-closed
cases. Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-recovery-summary-guard.json`
passed with 1/1 report, 2 product-surface commands, 6 mailbox events, recovery continuation hash
`8d4178f7`, and status `incomplete-evidence`.

Focused settings summary guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 33/33,
including complete settings save/reload no-mutation evidence and gameplay-event-recording
fail-closed cases. Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-settings-summary-guard.json`
passed with 1/1 report, 2 product-surface commands, 5 mailbox events, settings path
`artifacts/unity/settings/gemduel.preferences.v1.json`, final hash `8668e7ab`, and status
`incomplete-evidence`.

Focused chrome summary guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 35/35,
including complete rulebook/restart evidence and rulebook replay-event mutation fail-closed cases.
Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-chrome-summary-guard.json`
passed with 1/1 report, 2 product-surface commands, 6 mailbox events, chrome restart hash
`5304b037`, final hash `e3a47e84`, and status `incomplete-evidence`.

Focused peek-modal summary guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 37/37,
including complete peek-modal open/close evidence and missing `close_modal` fail-closed cases.
Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-peek-modal-summary-guard.json`
passed with 1/1 report, 4 product-surface commands, 10 mailbox events, peek-modal review hash
`8399eadd`, final hash `26aa66c6`, and status `incomplete-evidence`.

Focused recovery invalid-action summary guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 39/39,
including complete recovered invalid-action no-mutation/no-recording and continuation evidence plus
rejected-event-recording fail-closed cases. Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-recovery-invalid-action-summary-guard.json`
passed with 1/1 report, 2 product-surface commands, 9 mailbox events, continuation hash `d2b51b3f`,
final hash `d2fd26e1`, and status `incomplete-evidence`.

Focused privilege-cancel summary guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 41/41,
including complete privilege phase/event/review evidence and reversed event-order fail-closed cases.
Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-privilege-cancel-summary-guard.json`
passed with 1/1 report, 3 product-surface commands, 8 mailbox events, privilege-cancel hash
`efe66377`, final hash `9e3b6f7c`, and status `incomplete-evidence`.

Focused reserved-discard summary guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 43/43,
including complete `puppet_master` selection, visible discard-control, event-order, count, and
review-hash evidence plus hidden discard-control fail-closed cases. Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserved-discard-summary-guard.json`
passed with 1/1 report, 6 product-surface commands, 14 mailbox events, reserved-discard hash
`33909286`, final hash `fb772d70`, and status `incomplete-evidence`.

Focused reserved-buy summary guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 45/45,
including complete visible reserved-card buy controls, reserved-source event, count, and review-hash
evidence plus non-reserved buy-source fail-closed cases. Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserved-buy-summary-guard.json`
passed with 1/1 report, 6 product-surface commands, 16 mailbox events, reserved-buy hash
`47c0e9db`, final hash `8ea252da`, and status `incomplete-evidence`.

Focused reserve-cancel summary guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 47/47,
including complete visible reserve/cancel controls, phase-reset, cleared pending-reserve,
event-order, count, and review-hash evidence plus pending-state fail-closed cases. Retained
built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-cancel-summary-guard.json`
passed with 1/1 report, 6 product-surface commands, 10 mailbox events, reserve-cancel hash
`40bdddbf`, final hash `bdbabdbb`, and status `incomplete-evidence`.

Focused reserve-deck summary guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 49/49,
including complete deck/gold control, deck-pending phase, deck/reserved/gold-cell mutation,
event-order, count, and review-hash evidence plus no-deck-decrement fail-closed cases. Retained
built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-deck-summary-guard.json`
passed with 1/1 report, 6 product-surface commands, 10 mailbox events, reserve-deck hash
`da89d9e5`, final hash `63df431c`, and status `incomplete-evidence`.

Focused reserve-deck-cancel summary guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 51/51,
including complete deck/gold reserve/cancel controls, deck-pending cancel phase, restored
deck/reserved/gold-cell state, event-order, count, and review-hash evidence plus mutated-state
fail-closed cases. Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-deck-cancel-summary-guard.json`
passed with 1/1 report, 8 product-surface commands, 12 mailbox events, deck-reserve cancel hash
`62fa027f`, final hash `95c8a06c`, and status `incomplete-evidence`.

Focused Joker summary guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 53/53,
including complete visible market preview/buy/color controls, color-selection phase transition,
pending-buy clearing, Joker tableau placement, event-order, count, and review-hash evidence plus
pending-buy fail-closed cases. Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-joker-summary-guard.json`
passed with 1/1 report, 8 product-surface commands, 18 mailbox events, Joker hash `95c8a06c`, final
hash `95c8a06c`, and status `incomplete-evidence`.

Focused draft summary guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 55/55,
including fresh roguelike start, ordered P1/P2 `reroll_draft_pool` and `choose_boon` actions,
`DRAFT_PHASE` to `IDLE` completion, live replay event counts, and review-hash evidence plus
draft-phase fail-closed cases. Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-draft-summary-guard.json`
passed with 1/1 report, 8 product-surface commands, 9 mailbox events, draft hash `851b6356`, final
hash `851b6356`, and status `incomplete-evidence`. The newer post-no-take-3 retained draft
aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-draft-post-notake3-summary-guard.json`
also passed with 1/1 report, 6 product-surface commands, 7 mailbox events, draft hash `857c3e58`,
final hash `857c3e58`, and status `incomplete-evidence`.

Focused strict report-count aggregate guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 57/57,
including exact retained count and too-high-count fail-closed cases. Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-report-count-guard.json`
passed with `requiredReportCount: 27`, 27/27 reports, 716 commands, 812 mailbox events, all 21
required action families, three game-over reports, winners `p1`/`p2`, every current release-path
proof family, no failures, and status `incomplete-evidence`.

Focused strict unique-report-path aggregate guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 59/59,
including unique-path and duplicate-path fail-closed cases. Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-report-path-guard.json`
passed with `requiredReportCount: 27`, `requireUniqueReportPaths: true`, an empty
`duplicateReportPaths` list, 27/27 reports, 716 commands, 812 mailbox events, all 21 required action
families, three game-over reports, winners `p1`/`p2`, every current release-path proof family, no
failures, and status `incomplete-evidence`.

Focused strict unique nested smoke-report aggregate guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 61/61,
including unique nested smoke-report path and duplicate nested smoke-report path fail-closed cases.
Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-nested-smoke-report-guard.json`
passed with `requiredReportCount: 27`, `requireUniqueReportPaths: true`, an empty
`duplicateReportPaths` list, `requireUniqueSmokeReportPaths: true`, an empty
`duplicateSmokeReportPaths` list, 27/27 reports, 716 commands, 812 mailbox events, all 21 required
action families, three game-over reports, winners `p1`/`p2`, every current release-path proof
family, no failures, and status `incomplete-evidence`.

Focused strict unique log-path aggregate guard validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 63/63,
including unique retained stdout/stderr/player-log paths and duplicate retained log path fail-closed
cases. Retained built-player evidence
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-log-path-guard.json`
passed with `requiredReportCount: 27`, `requireUniqueReportPaths: true`, an empty
`duplicateReportPaths` list, `requireUniqueSmokeReportPaths: true`, an empty
`duplicateSmokeReportPaths` list, `requireUniqueLogPaths: true`, empty `duplicateStdoutLogPaths`,
`duplicateStderrLogPaths`, and `duplicatePlayerLogPaths` lists, 27/27 reports, 716 commands, 812
mailbox events, all 21 required action families, three game-over reports, winners `p1`/`p2`, every
current release-path proof family, no failures, and status `incomplete-evidence`.

Focused audited strict unique-path aggregate validation:
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-strict-unique-paths.json`
passed with `--require-audited-mailbox-responses`, `--require-report-count 8`,
`--require-unique-report-paths`, `--require-unique-smoke-report-paths`,
`--require-unique-log-paths`, `--require-invalid-action-release-path`,
`--require-game-over-count 3`, and `--require-game-over-winner p1,p2`. The retained evidence
records 8/8 reports, 350 commands, 365 mailbox events, 365 valid audit response files, 359
successful responses, twelve required audited action families, one invalid-action release-path
report, three game-over reports, winners `p1`/`p2`, empty duplicate report, nested smoke-report,
stdout log, stderr log, and player-log lists, no failures, and status `incomplete-evidence`.

Focused audited replay plus game-over strict aggregate validation:
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-strict-unique-paths.json`
passed with `--require-audited-mailbox-responses`, `--require-report-count 9`,
`--require-unique-report-paths`, `--require-unique-smoke-report-paths`,
`--require-unique-log-paths`, `--require-replay-release-path`,
`--require-invalid-action-release-path`, `--require-game-over-count 3`, and
`--require-game-over-winner p1,p2`. The retained evidence records 9/9 reports, 358 commands, 374
mailbox events, 374 valid audit response files, 368 successful responses, twelve required audited
action families, one replay release-path report, one invalid-action release-path report, three
game-over reports, winners `p1`/`p2`, replay release-path coverage for invalid/missing/unsupported/
malformed/corrupt/hash-mismatch/overwrite/review cases, empty duplicate report, nested
smoke-report, stdout log, stderr log, and player-log lists, no failures, and status
`incomplete-evidence`.

Focused audited digest-count strict aggregate validation:
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 65/65,
including aggregate digest-count pass and missing-digest fail-closed cases.
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-digest-count-strict.json`
passed with `--require-audited-mailbox-responses`,
`--require-audited-mailbox-response-digest-count 3`, `--require-report-count 10`,
`--require-unique-report-paths`, `--require-unique-smoke-report-paths`,
`--require-unique-log-paths`, `--require-launcher-args`, `--require-replay-release-path`,
`--require-invalid-action-release-path`, `--require-game-over-count 3`, and
`--require-game-over-winner p1,p2`. The retained evidence records 10/10 reports, 360 commands, 377
mailbox events, 377 valid audit response files, 3 valid audit response digests, 371 successful
responses, twelve required audited action families, two replay release-path reports, one
invalid-action release-path report, three game-over reports, winners `p1`/`p2`, replay release-path
coverage for invalid/missing/unsupported/malformed/corrupt/hash-mismatch/overwrite/review cases,
empty duplicate report, nested smoke-report, stdout log, stderr log, and player-log lists,
launcher-argument validation, no failures, and status `incomplete-evidence`.

Focused all-release plus audited-digest strict union validation:
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-all-release-plus-audited-digest-strict-union.json`
passed with `--require-report-count 37`, `--require-unique-report-paths`,
`--require-unique-smoke-report-paths`, `--require-unique-log-paths`, every current release-path
flag, all 21 required action families, `--require-game-over-count 6`, and
`--require-game-over-winner p1,p2`. The retained evidence records 37/37 reports, 1076 commands,
1189 mailbox events, 377 valid audit response files, 3 valid audit response digests, 371 successful
responses, two draft release-path reports, three replay release-path reports, one each for
recovery/settings/chrome/replay-review/peek-modal/recovery-invalid-action/privilege-cancel/
reserved-discard/reserved-buy/reserve-cancel/reserve-deck/reserve-deck-cancel/Joker release-path
families, two invalid-action release-path reports, six game-over reports, winners `p1`/`p2`, empty
duplicate report, nested smoke-report, stdout log, stderr log, and player-log lists, no failures,
and status `incomplete-evidence`. The stricter `--require-launcher-args` attempt failed closed
because two earliest 2026-05-11 retained launchers predate idle-action-preference argument
metadata; that remains a retained-evidence limitation rather than a completion blocker by itself.

Focused launcher-args refreshed union validation:
`artifacts/unity/built-player-smoke/smoke-2026-05-13Targs-refresh-breadth.launcher.json` passed
with 12 commands, 13 valid audit response files/digests, action families `take_gems`, `buy_card`,
and `replenish`, final/review hash `69747be4`, and no failure reason.
`artifacts/unity/built-player-smoke/smoke-2026-05-13Targs-refresh-long.launcher.json` passed with
30 commands, 31 valid audit response files/digests, action families `take_gems`, `buy_card`,
`replenish`, `discard_gem`, and `select_joker_color`, final/review hash `414e3342`, and no failure
reason.
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-launcher-args-refreshed-union.json`
then passed with `--require-report-count 37`, `--require-unique-report-paths`,
`--require-unique-smoke-report-paths`, `--require-unique-log-paths`, `--require-launcher-args`,
every current release-path flag, all 21 required action families, `--require-game-over-count 6`,
and `--require-game-over-winner p1,p2`. The retained evidence records 37/37 reports, 1076
commands, 1189 mailbox events, 421 valid audit response files, 47 valid audit response digests, 415
successful responses, every current release-path proof family, six game-over reports, winners
`p1`/`p2`, empty duplicate report, nested smoke-report, stdout log, stderr log, and player-log
lists, launcher-argument validation, no failures, and status `incomplete-evidence`.

## Hard Prohibition Check

No Steamworks.NET, Epic Online Services, platform SDKs, app IDs, product IDs, partner files,
credentials, upload tooling, upload artifacts, tokens, branch passwords, Electron gameplay easing,
shared-contract weakening, or replay-checkpoint live gameplay changes were introduced by this
audit/tooling refresh.

## Required Final Status Separation

| Required report category                                   | Current status                                                                                                                                                                                               |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Repo/local gates pass                                      | Retained May 13 gate evidence is recorded, but not rerun by this docs-only refresh.                                                                                                                          |
| Unity Editor/EditMode/build pass                           | Latest full EditMode 91/91 pass and retained Windows build evidence are recorded.                                                                                                                            |
| Built Windows player fresh-launch/product-surface evidence | Advanced as bounded LocalDev mailbox evidence; strongest retained all-release-path aggregate and strongest audited-mailbox subset both remain `incomplete-evidence` with strict unique evidence-path checks. |
| Remaining replacement-candidate blockers                   | LAN, online, Visual Lab, arbitrary broad product-surface Local PvP, broader product UI parity, broader release-path/recovery breadth, and final release-runtime TypeScript bridge packaging.                 |

## Stop-Condition Result

The goal is not complete. Completion would still depend on prohibited proxy signals: Editor/EditMode
pass, Windows build success, configured parity rows, seeded smoke runs, and bounded built-player
LocalDev evidence. Because product-scope blockers and the release-runtime bridge decision remain,
the only honest status is `Incomplete`.

## Final Validation Addendum

The final refresh keeps the audit verdict at `Incomplete`.

| Required report category                                   | Final refresh result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repo/local gates pass                                      | Passed: summarizer Vitest 73/73 after adding launcher exit-code, timeout, success-flag fail-closed, required-flag metadata, and replay release-path no-mutation tests, bridge Vitest 35/35, replay parity verifier with 11 fixtures and 65 rejection cases, Unity catalog export/check, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`, `pnpm build`, `pnpm release:check`, `pnpm boundaries:check`, `pnpm architecture:check`, `pnpm deps:check`, `pnpm desktop:check`, `pnpm secrets:check`, and `git diff --check`.                                                                                                                                                                                                                                    |
| Unity Editor/EditMode/build pass                           | Focused draft smoke validation `artifacts/unity/editmode-draft-smoke-final-fix-20260513-results.xml` passed 1/1, full EditMode `artifacts/unity/editmode-final-validation-fixed-20260513-results.xml` passed 91/91, and Windows build `artifacts/unity/build-final-validation-fixed-20260513.log` reports success.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Electron/Unity configured parity                           | The first full parity attempt timed out at `artifacts/electron-unity-parity/2026-05-13T12-14-12-995Z`, but the longer full `pnpm parity:electron-unity` rerun passed at `artifacts/electron-unity-parity/2026-05-13T14-15-37-411Z` with `unity.ok: true`, 54 equivalent rows, and browser process counts inside budget.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Built Windows player fresh-launch/product-surface evidence | Strongest retained ledger is refreshed at `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-required-flag-metadata-refresh.json`, with 37/37 reports, all 21 required action families, every current release-path proof family, every required release-path metadata flag set to `true`, six game-over reports, launcher-argument validation, and status `incomplete-evidence`. Focused replay no-mutation evidence is refreshed at `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-nomutation.json`, with one fresh built-player report, audited mailbox response/digest checks, all replay release-path cases, eight rejected-import no-mutation case records, final hash `1acd96c`, and status `incomplete-evidence`. |
| Remaining replacement-candidate blockers                   | LAN/online/Visual Lab remain unmigrated or unexcluded, arbitrary broad Local PvP remains incomplete, broader release-path/recovery coverage remains incomplete, and release-runtime TypeScript bridge packaging is unresolved.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

The `--skip-unity` parity run is cleanup evidence only. It exited 0 at
`artifacts/electron-unity-parity/2026-05-13T12-26-01-458Z`, but its summary records skipped Unity
capture and 27 blocker rows. The later full parity rerun supersedes the earlier timeout as the
latest configured-parity state, but it does not close product-scope or release-runtime blockers.
