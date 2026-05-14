# Unity Full Migration Completion Report

Date: 2026-05-11, updated through 2026-05-12 deck-reserve cancel, P2 draft-select ordering, no-take-3, coordinate-boundary, game-over, Joker missing-color, Joker reserved-source, Joker wrong-actor, Joker color wrong-actor, discard phase-resolution, bonus/steal phase-resolution, royal phase-resolution, reserve wrong-actor, reserve-cancel wrong-actor, deck-reserve wrong-actor, reserved-card wrong-actor, market-buy wrong-actor, privilege wrong-actor, cancel-privilege wrong-actor, follow-up wrong-actor rejection evidence, 2026-05-13 configured parity artifact refresh, 2026-05-13 built-player game-over aggregate guard, 2026-05-13 audited mailbox aggregate refresh, 2026-05-13 audited built-player game-over proof, 2026-05-13 audited built-player p2 game-over winner-breadth proof, 2026-05-13 built-player game-over winner guard, 2026-05-13 strict built-player winner-release aggregate, 2026-05-13 audited replay release-path proof, 2026-05-13 mailbox audit-file hardening, 2026-05-13 TypeScript bridge output temp cleanup hardening, 2026-05-13 built-player stdout byte hardening, 2026-05-13 built-player stderr byte hardening, 2026-05-13 built-player nested smoke-report hardening, 2026-05-13 built-player artifact path hardening, 2026-05-13 built-player mailbox audit-path hardening, 2026-05-13 built-player mailbox audit request-name hardening, 2026-05-13 built-player mailbox audit digest hardening, 2026-05-13 built-player launcher args hardening, 2026-05-13 TypeScript bridge structured error output hardening, 2026-05-13 built-player failure reason coherence hardening, 2026-05-13 replacement-candidate completion audit refresh, 2026-05-13 TypeScript bridge availability negative-case EditMode coverage, 2026-05-13 TypeScript bridge mailbox corrupt-response cleanup EditMode coverage, 2026-05-13 TypeScript bridge mailbox request cleanup hardening, 2026-05-13 built-player peek-modal summary guard, 2026-05-13 built-player recovery invalid-action summary guard, 2026-05-13 built-player privilege-cancel summary guard, 2026-05-13 built-player reserved-discard summary guard, 2026-05-13 built-player reserved-buy summary guard, 2026-05-13 built-player reserve-cancel summary guard, 2026-05-13 built-player reserve-deck summary guard, 2026-05-13 built-player reserve-deck-cancel summary guard, 2026-05-13 built-player Joker summary guard, 2026-05-13 built-player draft summary guard, 2026-05-13 TypeScript bridge CLI rejected-command output guard, 2026-05-13 built-player aggregate report-count guard, 2026-05-13 built-player aggregate unique-report-path guard, 2026-05-13 built-player aggregate unique-nested-smoke-report guard, 2026-05-13 built-player aggregate unique-log-path guard, 2026-05-13 audited built-player aggregate strict unique-path guard, 2026-05-13 audited replay plus game-over strict aggregate, 2026-05-13 audited digest-count aggregate guard, 2026-05-13 all-release plus audited-digest strict union, 2026-05-13 launcher-args refreshed union, and 2026-05-13 TypeScript bridge apply metadata hash guard

Status: Complete for the 2026-05-14 Local PVP migration scope

This report closes the current full-migration run governed by
`docs/migration/unity-migration-governance.md`. The 2026-05-14 product-surface coverage report is
the authoritative completion claim for Local PVP. It marks the built Windows player Local PVP
migration `Complete` with zero remaining product-surface failures after retaining packaged-runtime
100-game UI proof, replay export/import/review hash proof, legal and illegal action-family proof,
phase-edge coverage, recovery and settings matrices, visual/layout/perf evidence, and
release-runtime rules packaging.

The final machine-readable and HTML completion artifacts are:

- `artifacts/unity/product-surface-coverage/unity-product-surface-coverage-report.json`
- `artifacts/unity/product-surface-coverage/unity-product-surface-coverage-report.html`
- `artifacts/electron-unity-parity/local-pvp-built-player-full-game-packaged-runtime/2026-05-14T06-39-55-332Z/local-pvp-built-player-full-game-suite-report.json`
- `artifacts/unity/rules-runtime-package/unity-rules-runtime-package-report.json`

The final product-surface report records 6/6 entrypoints, 15/15 action families, 11/11 phase
edges, 13/13 recovery cases, 62/62 settings tuples, 5/5 visual contracts, 3,610 oracle events,
1,001 rejected oracle events, and zero failures. LAN, Online, and Visual Lab remain user-approved
exclusions from this Local PVP completion scope.

Earlier dated audits, including
`docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md` and
`docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`, are retained as historical
pre-completion snapshots. Their `Incomplete` verdicts are superseded by the 2026-05-14
product-surface report.

## Objective Restatement

The requested outcome is a full Unity migration, not preparation work. Completion requires a Unity
product that can replace the Electron-supported scope, including fresh arbitrary Local PvP from game
start to game over, replay/import/export/review, recovery behavior, LocalDev services, complete
TypeScript oracle coverage for required actions and FSM paths, Electron/Unity parity, Unity
editor/build evidence, and passing repo gates.

## 2026-05-13 Shared Action Oracle Follow-Up

The prompt-requested re-audit of commit `6e8af1b9513cab7ab8a6713b0b7d1786a1ff676c` found the three
shared gameplay action changes are covered as TypeScript oracle/determinism behavior, not
Unity-only accommodations. `boardActions.test.ts` covers deterministic empty board-cell UIDs from
state/context plus coordinates, `buffActions.branch.test.ts` covers offline draft reroll
determinism and P1/P2 draft-level separation, and `marketActions.phase3.test.ts` covers
unaffordable buy rejection preserving market/tableau/phase plus the existing `pendingBuy`.
Focused validation
`pnpm exec vitest run packages/shared/src/logic/actions/__tests__/boardActions.test.ts packages/shared/src/logic/actions/__tests__/buffActions.branch.test.ts packages/shared/src/logic/actions/__tests__/marketActions.phase3.test.ts`
passed 3 files and 57 tests. No shared action runtime or Electron gameplay changes were made in
this refresh.

## 2026-05-13 Replay-Review Summary Guard

The built-player smoke summarizer now has focused test coverage for its existing replay-review
release-path navigation guard. The new tests prove complete retained navigation evidence passes and
that a replay-review section missing visible undo/redo control evidence fails closed.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file and
25 tests. The retained replay-review launcher report also passed a concrete matrix check:
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-review-navigation-guard.json`
records 1/1 report, 4 commands, 10 mailbox events, replay-review final hash `db7fb1b7`, and status
`incomplete-evidence`. This is evidence hardening only, not replacement-candidate completion.

## 2026-05-13 Replay Release-Path Summary Guard

The built-player smoke summarizer now also has focused test coverage for its existing replay
release-path coverage guard. The new tests prove complete retained coverage, case records, baseline
hash/event count, and reviewed final hash pass, and that a required `hash_mismatch` coverage gap
fails closed under `--require-replay-release-path`.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file and
27 tests. The retained audited replay release-path launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-release-path-summary-guard.json`
with 1/1 report, 8 commands, 9 mailbox events, 9/9 retained audit response files, full replay
release-path coverage, final hash `f9eb9e83`, and status `incomplete-evidence`. This hardens
retained release-path evidence only; it does not close product-scope or release-runtime blockers.

## 2026-05-13 Invalid-Action Summary Guard

The built-player smoke summarizer now has focused test coverage for its existing invalid-action
release-path guard. The new tests prove complete retained rejection case IDs, rejected mailbox
process results, zero recorded events, and export/review hash preservation pass, and that a retained
case mutating state after rejection fails closed.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file and
29 tests. The retained audited invalid-action launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-invalid-action-summary-guard.json`
with 1/1 report, 1 product-surface command, 9 mailbox events, 9/9 retained audit response files, one
invalid-action release-path report, invalid-action hash `f2780c3f`, and status
`incomplete-evidence`. This hardens retained invalid-action release-path evidence only; it does not
close product-scope or release-runtime blockers.

## 2026-05-13 Recovery Summary Guard

The built-player smoke summarizer now has focused test coverage for its existing recovery
release-path guard. The new tests prove complete retained save/load/continue status,
saved/restored/continued hashes, recorded event counts, and export/review hash preservation pass,
and that a recovery proof failing to append the expected live replay event fails closed.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file and
31 tests. The retained recovery launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-recovery-summary-guard.json`
with 1/1 report, 2 product-surface commands, 6 mailbox events, one recovery release-path report,
recovery continuation hash `8d4178f7`, and status `incomplete-evidence`. This hardens retained
recovery release-path evidence only; it does not close product-scope or release-runtime blockers.

## 2026-05-13 Settings Summary Guard

The built-player smoke summarizer now has focused test coverage for its existing settings
release-path guard. The new tests prove complete retained save/reload status, persistence file
existence, no gameplay hash/event mutation, and expected saved/persisted/reloaded settings values
pass, and that settings evidence recording gameplay events fails closed.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file and
33 tests. The retained settings launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-settings-summary-guard.json`
with 1/1 report, 2 product-surface commands, 5 mailbox events, one settings release-path report,
settings path `artifacts/unity/settings/gemduel.preferences.v1.json`, final hash `8668e7ab`, and
status `incomplete-evidence`. This hardens retained settings release-path evidence only; it does
not close product-scope or release-runtime blockers.

## 2026-05-13 Chrome Summary Guard

The built-player smoke summarizer now has focused test coverage for its existing chrome/rulebook/
restart release-path guard. The new tests prove complete retained rulebook open/close,
no-gameplay-mutation, shell restart, Local PvP start visibility, and restarted live-command evidence
pass, and that rulebook evidence changing live replay event count fails closed.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file and
35 tests. The retained chrome launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-chrome-summary-guard.json`
with 1/1 report, 2 product-surface commands, 6 mailbox events, one chrome release-path report,
chrome restart hash `5304b037`, final hash `e3a47e84`, and status `incomplete-evidence`. This
hardens retained chrome release-path evidence only; it does not close product-scope or
release-runtime blockers.

## 2026-05-13 Peek-Modal Summary Guard

The built-player smoke summarizer now has focused test coverage for its existing peek-modal
release-path guard. The new tests prove complete retained `intelligence` buff selection,
`select_buff`/`peek_deck`/`close_modal` event export, visible peek/modal controls,
recorded/exported event preservation, and review hash preservation pass, and that missing
`close_modal` evidence fails closed. `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`
passed 1 file and 37 tests. The retained peek-modal launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-peek-modal-summary-guard.json`
with 1/1 report, 4 product-surface commands, 10 mailbox events, one peek-modal release-path report,
peek-modal review hash `8399eadd`, final hash `26aa66c6`, and status `incomplete-evidence`. This
hardens retained peek-modal release-path evidence only; it does not close product-scope or
release-runtime blockers.

## 2026-05-13 Recovery Invalid-Action Summary Guard

The built-player smoke summarizer now has focused test coverage for its existing recovered
invalid-action release-path guard. The new tests prove complete retained recovered cancel-reserve,
close-modal, and inactive-player take-gems rejections, bridge rejection exits, unchanged recovered
state/hash/event counts, valid continuation, and export/review hash preservation pass, and that
recording an event during rejection fails closed.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file and
39 tests. The retained recovery invalid-action launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-recovery-invalid-action-summary-guard.json`
with 1/1 report, 2 product-surface commands, 9 mailbox events, one recovery invalid-action
release-path report, recovery invalid-action continuation hash `d2b51b3f`, final hash `d2fd26e1`,
and status `incomplete-evidence`. This hardens retained recovered invalid-action release-path
evidence only; it does not close product-scope or release-runtime blockers.

## 2026-05-13 Privilege-Cancel Summary Guard

The built-player smoke summarizer now has focused test coverage for its existing privilege-cancel
release-path guard. The new tests prove complete retained `PRIVILEGE_ACTION` activation, return to
`IDLE`, ordered `activate_privilege`/`cancel_privilege` export, recorded/exported event count
preservation, and review hash preservation pass, and that reversed activation/cancel event ordering
fails closed. `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`
passed 1 file and 41 tests. The retained privilege-cancel launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-privilege-cancel-summary-guard.json`
with 1/1 report, 3 product-surface commands, 8 mailbox events, one privilege-cancel release-path
report, action families `activate_privilege`, `cancel_privilege`, `take_gems`, and `use_privilege`,
privilege-cancel hash `efe66377`, final hash `9e3b6f7c`, and status `incomplete-evidence`. This
hardens retained privilege-cancel release-path evidence only; it does not close product-scope or
release-runtime blockers.

## Prompt-To-Artifact Audit

| Requirement                                         | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Verdict                                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Ignore superseded historical `/goal` prompts        | Active source remains `docs/migration/unity-migration-governance.md`; slice-era docs are evidence only                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Passed                                                                               |
| Create missing governance files instead of blocking | Task plan, ADR, product-scope map, action/FSM matrix, parity matrix, risk table, release checklist, and this report exist                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Passed                                                                               |
| Supersede active slice-era docs first               | Historical migration docs carry superseded framing and `docs/README.md` separates historical evidence from the active target                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Passed                                                                               |
| 1. Unity rules-engine boundary ADR                  | `docs/adr/0012-unity-rules-engine-boundary.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Passed                                                                               |
| 2. Product-scope map from Electron routes/surfaces  | `docs/migration/unity-product-scope-map.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Passed for mapping; implementation incomplete                                        |
| 3. GameAction/FSM coverage matrix                   | `docs/migration/unity-action-fsm-coverage-matrix.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Passed for mapping; broader coverage incomplete                                      |
| 4. Unity live rules boundary                        | `tools/migration/unity-rules-engine-bridge.ts`, `GameRulesEngineBoundary.cs`, `TypeScriptGameRulesEngine.cs`, and `GemDuelGameController.cs` route live commands through `IGameRulesEngine`; bridge tests apply every golden replay event and one freshly simulated Local PvP game-over replay as commands, then hash-check each resulting state                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Passed for covered command corpus; product UI proof incomplete                       |
| 5. Replay/hash fixture expansion                    | 11 golden fixtures and 65 rejection cases pass with empty declared verifier gaps; Unity EditMode also replays all 65 rejection-manifest cases through the live bridge with no replay-state hash or live-recording mutation, including stale-pool P2 draft select hash `5c903209`, no-take-3 board selection hash `8e546f4c`, coordinate-boundary hashes `e1b5e1bf`, `329600a9`, `fd6d5832`, `6173696c`, and `d8141986`, game-over action-after-winner hash `4b6ab7ec`, Joker missing-color hash `d0a0e459`, and Joker reserved-source hash `b5d9cbbf`; focused bridge-envelope guards also reject wrong-actor market buy, wrong-actor Joker initiation/color-follow-up, reserve initiation/resolution/cancel, deck-reserve initiation/resolution, reserved-buy ownership-envelope, reserved discard, privilege activation/use/cancel, and follow-up bonus/discard/steal without mutation; focused phase-resolution proofs record valid live `TAKE_BONUS_GEM`, `STEAL_GEM`, `SELECT_ROYAL_CARD`, and repeated `DISCARD_GEM` events until the controlled follow-up phases resolve                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Passed for declared oracle tags; broader edge/release coverage incomplete            |
| 6. Unity product UI for supported Electron scope    | `pnpm parity:electron-unity` proves 54 configured rows; Unity has expanded bridge-backed dispatch and visible LocalDev controls; fresh product-surface EditMode tests passed for three seeded Unity Local PvP game-over paths plus a five-scenario bounded matrix, and the built Windows player now has three deterministic fresh LocalDev game-over proofs plus recovery, settings, chrome, replay-review, roguelike draft reroll/select, invalid-action release-path, peek-modal release-path, recovered invalid-action release-path, privilege-cancel release-path, reserved-discard release-path, reserved-buy release-path, reserve-cancel release-path, reserve-deck release-path, Joker release-path, deck-reserve cancel release-path, resource-first 120-command product-surface breadth proofs, audited breadth/preference samples, and a post-no-take-3 rebuilt-player roguelike draft proof for the failing seed; the strict unique-log-path 2026-05-13 aggregate validates 27/27 reports with explicit `--require-report-count 27`, `--require-unique-report-paths`, `--require-unique-smoke-report-paths`, `--require-unique-log-paths`, 716 commands, 812 mailbox events, every current release-path proof flag, all 21 required action families, `--require-game-over-count 3`, and `--require-game-over-winner p1,p2`; the audited game-over winner-breadth aggregate validates three audited completed games with winners `p1` and `p2`, 288 commands, 291 retained mailbox responses, and the same three game-over hashes; the newer audited winner guard revalidates that breadth with `--require-game-over-winner p1,p2`; the stricter audited combined winner-guard aggregate validates 8 audited reports with 365 retained mailbox responses, one invalid-action release-path report, required winners `p1,p2`, and three game-over reports                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Incomplete: not full Electron scope and not broad arbitrary UI coverage              |
| 7. Replay/settings/recovery/LocalDev                | Visible LocalDev replay controls, settings persistence including LAN opponent card/gem visibility preferences, recovery, 65-case invalid-action no-mutation/no-recording proof, replay review round trips, three seeded full live-game export/import/review passes, five bounded matrix runs, EditMode release-path invalid file recovery including malformed bootstrap and malformed draft bootstrap rejection, built-player replay release-path recovery including malformed bootstrap and malformed draft bootstrap rejection, built-player replay-review visible undo/redo navigation proof, built-player roguelike draft reroll/select export/import/review proofs with hashes `851b6356` and post-fix `857c3e58`, built-player invalid-action no-mutation/no-recording release-path proof, built-player peek-modal export/import/review proof, built-player recovered invalid-action no-mutation/no-recording proof, built-player privilege-cancel export/import/review proof, built-player reserved-discard export/import/review proof, built-player reserved-buy export/import/review proof, built-player reserve-cancel release-path proof, built-player reserve-deck release-path proof, built-player Joker export/import/review proof, built-player deck-reserve cancel export/import/review proof, built-player resource-first 120-event export/import/review proof, audited built-player 24-event product-surface breadth proof with 25 retained response copies, audited reserve-first and privilege-first preference proofs with 38 retained response copies, audited game-over winner-breadth proof with 291 retained response copies and stable review hashes, audited replay release-path proof with 9 retained response copies plus invalid/corrupt/hash-mismatch/overwrite coverage and hash `f9eb9e83`, audited combined winner-guard aggregate with 365 retained response copies plus invalid-action, required winners `p1,p2`, and three-game-over proof, built-player recovery save/load/continue replay review, built-player settings save/reload proof, built-player rulebook/restart chrome proof, three built-player game-over replay export/import/review proofs, and a strict unique-log-path aggregate with every current release-path proof flag, replay-release coverage, explicit retained-report cardinality, duplicate launcher-path rejection, duplicate nested-smoke-report rejection, and duplicate stdout/stderr/player-log rejection enabled | Incomplete: final release-runtime packaging and broader edge coverage remain missing |
| 8. Electron/Unity parity                            | Latest inspected runner artifact `artifacts/electron-unity-parity/2026-05-13T00-04-32-249Z/` has 54/54 `Equivalent` configured rows across both required viewports; the shell wrapper timed out at 600 seconds before returning, but the child parity runner completed and wrote the summary/matrix artifacts.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Passed for configured runner scope only                                              |
| 9. Repo/replay/Unity/build validation               | Local repo gates, replay verifier, catalog check, Unity EditMode, Unity Windows build, and release/governance checks passed. The 2026-05-13 refresh passed `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`, `pnpm build`, `pnpm release:check`, `pnpm boundaries:check`, `pnpm architecture:check`, `pnpm deps:check`, `pnpm desktop:check`, and `pnpm secrets:check`; test and coverage each reported 177 files and 1112 tests, and key-module coverage had 0 violations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Passed for available local gates                                                     |
| 10. Completion report                               | This document                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Passed                                                                               |

## Validation Evidence

2026-05-11 continuation evidence added after the prior final audit note:

- Built-player smoke path now passes for a bounded LocalDev automation proof.
  `tools/migration/run-unity-built-player-smoke.mjs` launches
  `artifacts/unity/build/windows/GemDuelUnity.exe`, creates an ignored
  `GEMDUEL_RULES_BRIDGE_MAILBOX_DIR` request/response bridge, writes stdout/stderr/player
  log/report paths under `artifacts/unity/built-player-smoke/`, and services player requests through
  the same TypeScript bridge. A later rebuilt-player attempt exposed a Windows response-file
  sharing race, so response publication is now atomic and Unity mailbox response read/delete uses
  bounded retry and best-effort cleanup. The launcher now exposes the existing smoke
  `IdleActionPreference` option so built-player evidence can cover both balanced and reserve-focused
  paths. Passing reports include
  `artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json` with 12 commands
  and hash `7d3f696c`,
  `artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json` with 30 commands,
  `buy_card`, `click_board_cell`, `discard_gem`, `replenish`, `take_gems`, and hash `5c804aa7`, and
  `artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json` with 14
  reserve-focused commands, `reserve_card`, `cancel_gem_selection`, and hash `9704183f`. This is
  broader built-player evidence for bounded smoke paths. A fourth report,
  `artifacts/unity/built-player-smoke/smoke-2026-05-11T23-50-03-972Z.launcher.json`, passed after the
  rebuilt player `artifacts/unity/build-replay-release-path-smoke-20260511.log`: it covers 8 live
  commands, `take_gems`, `buy_card`, `select_joker_color`, hash `95c8a06c`, invalid JSON, missing
  file, unsupported schema, corrupted summary, final hash mismatch, failed overwrite load, and
  valid overwrite/reload/review inside the Windows player. The aggregate matrix artifact
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260511.json` validates the four
  reports together with 64 commands, 68 mailbox events, eight required action families, one replay
  release-path report, and status `incomplete-evidence`; it is not arbitrary Local PvP or a final
  release-runtime packaging decision. A 2026-05-12 follow-up report,
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json`, then passed
  with seed `unity-built-player-followup-breadth-20260512`, 80 live bridge-backed commands, stdout
  and player logs, `buy_card`, `choose_royal`, `click_board_cell`, `discard_gem`, `replenish`,
  `select_joker_color`, `steal_gem`, and `take_gems` families, replay export/import/review, and
  final hash `94560a25`. After the bonus-family report label was made explicit, a rebuilt player
  passed `artifacts/unity/build-bonus-family-label-20260512.log` and
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json` passed with 80
  live bridge-backed commands, `take_bonus_gem`, replay export/import/review, and final hash
  `cecbc068`. A privilege-focused follow-up added `privilege-first` smoke preference coverage:
  `clients/unity/artifacts/unity/editmode-privilege-smoke-20260512-results.xml` reported 1/1
  passed, `artifacts/unity/build-privilege-smoke-20260512.log` reports build success, and
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T00-24-16-298Z.launcher.json` passed with a
  fresh LocalDev launch, 3 live bridge-backed commands, `take_gems`, `activate_privilege`,
  `use_privilege`, replay export/import/review, and final hash `9e3b6f7c`. Game-over depth
  follow-ups reused the existing Windows player and passed
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T00-52-54-303Z.launcher.json`,
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T01-01-37-234Z.launcher.json`, and
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T01-04-20-176Z.launcher.json` with 98, 98,
  and 92 live bridge-backed commands; winners `p1`, `p2`, and `p2`; replay export/import/review;
  and final hashes `d6dbea7a`, `411262df`, and `5f3bf567`. A recovery release-path follow-up then
  passed the focused EditMode guard
  `clients/unity/artifacts/unity/editmode-recovery-release-path-smoke-20260512-results.xml`, rebuilt
  the Windows player with `artifacts/unity/build-recovery-release-path-smoke-20260512.log`, and
  passed `artifacts/unity/built-player-smoke/smoke-2026-05-12T01-20-54-336Z.launcher.json`. That
  report starts a fresh LocalDev game, applies one live command, saves recovery at hash `208a752`,
  loads recovery in a fresh controller, continues another live command, exports/reviews the
  continued live replay at hash `8d4178f7`, and records no fixture replay gameplay driver or
  checkpoint state replacement. A settings release-path follow-up then passed the focused EditMode
  guard `clients/unity/artifacts/unity/editmode-settings-release-path-smoke-20260512-results.xml`,
  rebuilt the Windows player with `artifacts/unity/build-settings-release-path-smoke-20260512.log`,
  and passed `artifacts/unity/built-player-smoke/smoke-2026-05-12T02-00-40-648Z.launcher.json`.
  The nested settings report starts a fresh LocalDev game, saves locale `en`, surface theme
  `pearl-opaline`, sound off, and LAN opponent card/gem visibility off through visible settings
  controls, reloads those preferences in a fresh live-game controller, and verifies gameplay hashes
  plus live replay event counts remain unchanged. A chrome release-path follow-up then passed the
  focused EditMode guard
  `clients/unity/artifacts/unity/editmode-chrome-release-path-smoke-20260512-results.xml`, the
  full EditMode suite `clients/unity/artifacts/unity/editmode-chrome-full-20260512-results.xml`,
  rebuilt the Windows player with `artifacts/unity/build-chrome-release-path-smoke-20260512.log`,
  and passed `artifacts/unity/built-player-smoke/smoke-2026-05-12T03-13-11-728Z.launcher.json`.
  The nested chrome report starts a fresh LocalDev game, opens and closes the rulebook without
  changing hash `8fa33a3f` or replay event count, restarts to the shell, starts another fresh
  LocalDev game through the bridge, and records a live `take_gems` command at hash `5304b037`. The
  refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-chrome.json` validates
  13/13 reports, 521 commands, 542 mailbox events, thirteen action families, one replay
  release-path report, one recovery release-path report, one settings release-path report, one
  chrome release-path report, hashes including `d6dbea7a`, `411262df`, `5f3bf567`, `6b43d0c6`,
  `8668e7ab`, `e3a47e84`, recovery continuation hash `8d4178f7`, settings path
  `artifacts/unity/settings/gemduel.preferences.v1.json`, chrome restart hash `5304b037`, and
  status `incomplete-evidence`. A replay-review release-path follow-up then passed the focused
  EditMode guard
  `clients/unity/artifacts/unity/editmode-replay-review-release-path-smoke-20260512-results.xml`,
  rebuilt the Windows player with
  `artifacts/unity/build-replay-review-release-path-smoke-20260512.log`, and passed
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T03-32-18-999Z.launcher.json`. The nested
  report exports a live bridge-backed replay, imports it into a separate review controller, drives
  visible replay redo/undo controls through revisions `0 -> 1 -> 2 -> 1 -> final -> final-1 -> final`,
  preserves first-redo hash `de4507f0` after undo and final hash `db7fb1b7`, and leaves the
  source live game hash plus source live replay event count unchanged. The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-replay-review.json`
  validates 14/14 reports, 525 commands, 552 mailbox events, one replay release-path report, one
  recovery release-path report, one settings release-path report, one chrome release-path report,
  one replay-review release-path report, replay-review final hash `db7fb1b7`, and status
  `incomplete-evidence`. A malformed-bootstrap follow-up then added explicit Replay vNext init
  shape validation before review bootstrap. The focused EditMode guard
  `clients/unity/artifacts/unity/editmode-malformed-bootstrap-release-path-20260512-results.xml`
  passed 1/1, the full EditMode suite
  `clients/unity/artifacts/unity/editmode-malformed-bootstrap-full-20260512-results.xml` passed
  72/72, the rebuilt Windows player
  `artifacts/unity/build-malformed-bootstrap-release-path-20260512.log` succeeded, and
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T05-04-23-684Z.launcher.json` rejected
  `malformed_bootstrap` with `Replay init board must contain 5 rows.` while preserving live hash
  `ecaf5a49` and eight recorded replay events. The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-malformed-bootstrap.json`
  validates 14/14 reports, 525 commands, 552 mailbox events, replay release-path coverage
  `invalid_json`, `missing_file`, `unsupported_schema`, `malformed_bootstrap`,
  `corrupted_summary`, `hash_mismatch`, `failed_overwrite_load`, and
  `valid_overwrite_reload_review`, plus recovery/settings/chrome/replay-review release-path reports;
  it remains `incomplete-evidence`. A later evidence-consistency audit
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-replay-release-path-audit.json`
  rechecked the existing built-player reports and again validated 14/14 reports, 525 commands, 552
  mailbox events, one replay release-path report, and the full replay release-path coverage set
  including unsupported schema and hash mismatch. The built-player smoke summarizer now also has an
  explicit `--require-replay-release-path` guard; when that flag is enabled, it requires a replay
  release-path report and the full replay coverage set while older summary matrices remain
  reproducible without the opt-in guard. A negative audit without replay release-path evidence fails
  with `Required replay release-path proof was not covered.`. The malformed draft bootstrap follow-up then reused the same
  release-path import matrix to reject `INIT_DRAFT` with an empty `draftPool`: the focused EditMode
  guard
  `clients/unity/artifacts/unity/editmode-malformed-draft-bootstrap-release-path-20260512-results.xml`
  passed 1/1, the follow-up full EditMode suite
  `clients/unity/artifacts/unity/editmode-malformed-draft-bootstrap-full-20260512-results.xml`
  passed 72/72, the rebuilt Windows player
  `artifacts/unity/build-malformed-draft-bootstrap-release-path-20260512.log` succeeded, and
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T05-16-44-409Z.launcher.json` rejected
  `malformed_draft_bootstrap` with `Replay init draftPool must not be empty for INIT_DRAFT.` while
  preserving live hash `e5374467` and eight recorded replay events. The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-malformed-draft-bootstrap.json`
  validates 14/14 reports, 525 commands, 552 mailbox events, replay release-path coverage including
  `malformed_bootstrap` and `malformed_draft_bootstrap`, plus recovery/settings/chrome/replay-review
  release-path reports; it remains `incomplete-evidence`.
  The draft release-path follow-up then added a fresh roguelike LocalDev draft path to the built
  Windows player: the focused EditMode guard
  `clients/unity/artifacts/unity/editmode-draft-release-path-smoke-20260512-results.xml` passed
  1/1, the rebuilt Windows player `artifacts/unity/build-draft-release-path-smoke-20260512.log`
  succeeded, and
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T05-44-04-969Z.launcher.json` passed with
  `startMode: roguelike`, `draftActionPreference: reroll-each-player-first`, `choose_boon`,
  `reroll_draft_pool`, and `take_gems` families, no fixture replay gameplay driver, no checkpoint
  state replacement, eight live replay events, and export/import/review hash `851b6356`. The
  follow-up full EditMode suite
  `clients/unity/artifacts/unity/editmode-draft-release-path-full-20260512-results.xml` passed
  73/73. The draft-only aggregate before the invalid-action follow-up
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-draft-release-path.json`
  validates 15/15 reports, 533 commands, 561 mailbox events, the previous release-path reports, and
  draft families `choose_boon` and `reroll_draft_pool`; it remains `incomplete-evidence`.
  The invalid-action release-path follow-up then added a representative built-player rejection proof:
  the focused EditMode guard
  `clients/unity/artifacts/unity/editmode-invalid-action-release-path-smoke-20260512-results.xml`
  passed 1/1, the follow-up full EditMode suite
  `clients/unity/artifacts/unity/editmode-invalid-action-release-path-full-20260512-results.xml`
  passed 74/74, the rebuilt Windows player
  `artifacts/unity/build-invalid-action-release-path-smoke-20260512.log` succeeded, and
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T06-34-40-146Z.launcher.json` rejected
  `SELECT_BUFF`, `REROLL_DRAFT_POOL`, empty `TAKE_GEMS`, `CANCEL_RESERVE`, `CLOSE_MODAL`, and inactive
  actor `TAKE_GEMS` through the live rules boundary without changing hash `1a6afd3f` or appending
  live replay events. The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-invalid-action-release-path.json`
  validates 16/16 reports, 541 commands, 577 mailbox events, one invalid-action release-path report,
  and the previous replay/recovery/settings/chrome/replay-review/draft release-path reports; it
  remains `incomplete-evidence`. A reserved-buy release-path follow-up then passed the focused
  EditMode guard
  `clients/unity/artifacts/unity/editmode-reserved-buy-release-path-smoke-20260512-results.xml`,
  rebuilt the Windows player with
  `artifacts/unity/build-reserved-buy-release-path-smoke-20260512.log`, and passed
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T12-29-42-881Z.launcher.json`. The nested
  reserved-buy report starts fresh LocalDev, reserves `c:155-bk#0`, collects five bridge-backed
  setup turns, buys through the visible reserved-card preview control, exports/reviews final hash
  `47c0e9db`, and records no fixture replay gameplay driver or checkpoint state replacement. The
  aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserved-buy-release-path.json`
  validates 21/21 reports, 562 commands, 634 mailbox events, one reserved-buy release-path report,
  and status `incomplete-evidence`.
  A reserve-cancel release-path follow-up then passed the focused EditMode guard
  `clients/unity/artifacts/unity/editmode-reserve-cancel-release-path-smoke-20260512-results.xml`,
  rebuilt the Windows player with
  `artifacts/unity/build-reserve-cancel-release-path-smoke-20260512.log`, and passed
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T13-21-32-993Z.launcher.json`. The nested
  reserve-cancel report starts fresh LocalDev, opens visible market reserve controls, enters
  `RESERVE_WAITING_GEM`, cancels through the visible reserve cancel control, returns to `IDLE`
  without a pending reserve or reserved card, records ordered `initiate_reserve` and
  `cancel_reserve`, exports/reviews final hash `40bdddbf`, and records no fixture replay gameplay
  driver or checkpoint state replacement. The aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-cancel-release-path.json`
  validates 22/22 reports, 568 commands, 644 mailbox events, one reserve-cancel release-path report,
  and status `incomplete-evidence`.
  A reserve-deck release-path follow-up then passed the focused EditMode guard
  `clients/unity/artifacts/unity/editmode-reserve-deck-release-path-smoke-20260512-results.xml`,
  rebuilt the Windows player with
  `artifacts/unity/build-reserve-deck-release-path-smoke-20260512.log`, and passed
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T13-59-30-560Z.launcher.json`. The nested
  reserve-deck report starts fresh LocalDev, opens a visible market deck preview, initiates deck
  reserve through the visible preview reserve control, completes the Gold follow-up through a
  visible board target, records ordered `initiate_reserve_deck` and `reserve_deck`, reduces the
  level-1 deck count from 25 to 24, increases P1 reserved cards from 0 to 1, consumes the selected
  Gold cell, exports/reviews final hash `da89d9e5`, and records no fixture replay gameplay driver or
  checkpoint state replacement. The aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-deck-release-path.json`
  validates 23/23 reports, 574 commands, 654 mailbox events, one reserve-deck release-path report,
  and status `incomplete-evidence`.
  A Joker release-path follow-up then passed the focused EditMode guard
  `clients/unity/artifacts/unity/editmode-joker-release-path-smoke-20260512-results.xml`, rebuilt
  the Windows player with `artifacts/unity/build-joker-release-path-smoke-20260512.log`, and passed
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T14-52-59-171Z.launcher.json`. The nested
  Joker report starts fresh LocalDev, drives six live setup `take_gems` commands until visible Joker
  `c:174-jo#0` is affordable, opens the visible market preview, buys through the visible preview
  primary action, selects visible color `red`, records ordered `initiate_buy_joker` and `buy_card`,
  clears pending buy, adds the Joker to P1 tableau, exports/reviews final hash `95c8a06c`, and
  records no fixture replay gameplay driver or checkpoint state replacement. The aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-joker-release-path.json`
  validates 24/24 reports, 582 commands, 672 mailbox events, one Joker release-path report, and
  status `incomplete-evidence`.
  A deck-reserve cancel release-path follow-up then passed the focused EditMode guard
  `clients/unity/artifacts/unity/editmode-reserve-deck-cancel-release-path-smoke-20260512-results.xml`,
  rebuilt the Windows player with
  `artifacts/unity/build-reserve-deck-cancel-release-path-smoke-20260512.log`, and passed
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T15-27-57-407Z.launcher.json`. The nested
  deck-reserve cancel report starts fresh LocalDev, opens the visible market deck preview, initiates
  deck reserve through the visible preview reserve control, cancels before Gold selection through the
  visible cancel control, records ordered `initiate_reserve_deck` and `cancel_reserve`, leaves deck,
  reserved-card, and Gold-cell state unchanged, exports/reviews final hash `62fa027f`, and records no
  fixture replay gameplay driver or checkpoint state replacement. The aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-deck-cancel-release-path.json`
  validates 25/25 reports, 590 commands, 684 mailbox events, one deck-reserve cancel release-path
  report, and status `incomplete-evidence`.
- Bounded Local PvP product-surface evidence passed in
  `artifacts/unity/editmode-product-surface-breadth-20260511-results.xml` with 1/1 passed, start
  `2026-05-11 22:19:02Z`, end `2026-05-11 22:21:27Z`, duration `145.3544516` seconds. The report
  `artifacts/unity/product-surface-local-pvp-matrix-20260511.json` covers five deterministic fresh
  Local PvP starts through `GemDuelGameController`/`IGameRulesEngine`, live replay recording,
  export/import/review hash preservation, and no fixture gameplay driver or checkpoint
  replacement. Covered action families are `buy_card`, `cancel_gem_selection`, `discard_gem`,
  `replenish`, `reserve_card`, and `take_gems`, so the evidence is explicitly bounded and not a
  broad arbitrary-play claim.
- Replay release-path error recovery passed in
  `clients/unity/artifacts/unity/editmode-replay-release-path-20260511-results.xml` with 1/1
  passed, start `2026-05-11 20:08:39Z`, end `2026-05-11 20:08:55Z`, duration `15.5230171`
  seconds. It covers invalid JSON, unsupported schema version, missing file, corrupted replay
  summary, replay hash mismatch, overwrite/reload, and clean error recovery without mutating live
  gameplay state. The malformed-bootstrap and malformed draft bootstrap follow-ups extend this
  release-path recovery proof to reject malformed Replay vNext init snapshots before review bootstrap
  in both EditMode and the built Windows player.
- LocalDev TypeScript bridge hardening added explicit repository-root walking from built-player data
  paths, `GEMDUEL_PNPM_PATH`, governed `PATH`/`GEMDUEL_PNPM_PATH`/mailbox policy docs, dependency
  availability messages, timeout/error wrapping, output-file bridge responses, atomic mailbox
  response publication, retrying mailbox response reads, best-effort response cleanup,
  built-player mailbox transport, CLI `--out` temp response cleanup on failed publication, a
  no-platform/user-ID gameplay hash tests for deterministic start and metadata-decorated live
  `apply` requests, CLI `--out` structured response coverage for both
  malformed request JSON and valid rejected gameplay commands, and focused Unity EditMode guards for
  structured timeout/execution failure mapping plus mailbox unavailable/timeout temp-file cleanup,
  missing
  `tools/scripts`, missing bridge-script diagnostics, malformed mailbox response cleanup, and
  best-effort stale request cleanup from the Unity mailbox client.
- Current full Unity EditMode evidence:
  `artifacts/unity/editmode-mailbox-request-cleanup-20260513-results.xml` reports 91/91 passed from
  `2026-05-13 07:59:18Z` to `08:26:21Z` after the mailbox request cleanup hardening. Earlier
  `artifacts/unity/editmode-mailbox-corrupt-response-timeout-fixed-20260513-results.xml` reported
  91/91 passed from `2026-05-13 07:15:27Z` to `07:43:28Z` after the mailbox corrupt-response
  cleanup guard and product-surface timeout adjustment, and
  `clients/unity/artifacts/unity/editmode-full-20260512-post-notake3-fix-results.xml` reported
  91/91 passed from `2026-05-12 23:02:38Z` to `23:28:37Z` after the LocalDev product-surface smoke
  driver was fixed to avoid illegal three-gem takes under an active `passive.noTake3` buff. The
  pre-fix full rerun `clients/unity/artifacts/unity/editmode-full-20260512-post-royal-results.xml`
  reported 90/91; the only failing test was
  `RoguelikeDraftProductSurfaceSmokeRerollsSelectsAndReviewsLiveReplay`, which correctly exposed the
  smoke driver attempting a TypeScript-oracle-rejected `take_gems` action. The focused rerun
  `clients/unity/artifacts/unity/editmode-draft-smoke-notake3-rerun-20260512-results.xml` then
  passed 1/1. Earlier full reruns include
  `clients/unity/artifacts/unity/editmode-privilege-cancel-release-path-full-20260512-results.xml`
  with 77/77 after the privilege-cancel release-path smoke guard,
  `clients/unity/artifacts/unity/editmode-recovery-invalid-action-release-path-full-20260512-results.xml`
  with 76/76 after the recovery invalid-action release-path smoke guard,
  `clients/unity/artifacts/unity/editmode-peek-modal-release-path-full-20260512-results.xml`
  with 75/75 after the peek-modal release-path smoke guard,
  `clients/unity/artifacts/unity/editmode-invalid-action-release-path-full-20260512-results.xml`
  with 74/74 after the invalid-action release-path smoke guard,
  `clients/unity/artifacts/unity/editmode-draft-release-path-full-20260512-results.xml` with
  73/73 after the roguelike draft release-path smoke guard,
  `clients/unity/artifacts/unity/editmode-malformed-draft-bootstrap-full-20260512-results.xml` with
  72/72 after the malformed draft bootstrap guard, and
  `clients/unity/artifacts/unity/editmode-replay-review-full-rerun-20260512-results.xml` with 70/70
  after the replay-review release-path smoke update. The focused reserved-buy release-path guard
  `clients/unity/artifacts/unity/editmode-reserved-buy-release-path-smoke-20260512-results.xml`
  also passed 1/1 after the reserved-buy source change. Focused reserve-cancel, reserve-deck, Joker,
  deck-reserve cancel, wrong-actor, follow-up phase-resolution, bridge-failure, and mailbox-failure
  guards passed 1/1 or 2/2 for their narrow proof slices before the latest full 91/91 rerun.
- Current Unity Windows build evidence:
  `artifacts/unity/build-reserve-deck-cancel-release-path-smoke-20260512.log` reports build success
  and batchmode exit code 0 after the deck-reserve cancel built-player smoke update.
- Current configured parity-runner evidence: `pnpm parity:electron-unity` passed with 54/54
  `Equivalent` rows in
  `artifacts/electron-unity-parity/2026-05-12T08-18-40-709Z/parity-matrix.md`.
- Current repo gates passed after the P2 draft-select ordering follow-up: `pnpm typecheck`, `pnpm lint`,
  `pnpm test` (177 files, 1112 tests), `pnpm test:coverage` (177 files, 1112 tests, key-module
  coverage report passed), `pnpm build`, `pnpm release:check`,
  `pnpm boundaries:check`, `pnpm architecture:check`, `pnpm deps:check`, `pnpm desktop:check`,
  `pnpm secrets:check`, `pnpm bundle:check`, and `pnpm release:artifacts:check`.

Latest passing commands and artifacts:

- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-fixtures.ts`:
  regenerated the 11-fixture replay corpus.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`:
  passed with 11 fixtures, 65 rejection oracle cases, and empty declared coverage gaps. Final
  fixture hashes were `e1b5e1bf`, `e0f3316a`, `4b6ab7ec`, `2648a9b6`, `56188c9b`, `d418205f`,
  `df284305`, `63991d2`, `33285b45`, `dcaaa5b8`, and `a8eeefc9`.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts`: passed 35 bridge
  tests, including the fresh deterministic Local PvP game-over simulation replay applied through
  bridge commands with per-step replay-state hash checks, live-bridge rejection of
  infrastructure/debug commands without state mutation, missing Joker bonus-color rejection without
  the prior implicit `red` fallback, output-file temp cleanup, malformed CLI request structured
  output, and valid rejected CLI command structured output.
- Unity targeted rejection-manifest proof:
  `artifacts/unity/editmode-rejection-manifest-20260511-results.xml` reported 1/1 passed,
  start `2026-05-11 15:17:13Z`, end `2026-05-11 15:18:53Z`, duration `100.5986919`
  seconds. The test loads every case in `fixtures/replay-golden/rejection-manifest.json`, primes
  Unity from the TypeScript replay-state oracle at the requested revision, sends the invalid action
  through the live `IGameRulesEngine` bridge, and verifies the rejection reason, unchanged
  replay-state hash, and unchanged live replay recording count.
- Unity focused cancel-reserve no-pending proof:
  `clients/unity/artifacts/unity/editmode-rejection-manifest-no-pending-20260512-results.xml`
  reported 1/1 passed for the then-current manifest path. The new case
  `reject-cancel-reserve-no-pending` clears pending reserve from a TypeScript-oracle
  `RESERVE_WAITING_GEM` snapshot and verifies `CANCEL_RESERVE` rejects without hash or live
  recording mutation.
- Unity focused P2 draft select ordering proof:
  `clients/unity/artifacts/unity/editmode-rejection-manifest-p2-select-order-20260512-results.xml`
  reported 1/1 passed for the refreshed 56-case manifest path. The new case
  `reject-select-buff-p2-before-p1-selection` derives a stale-pool P2 draft state before P1 locks a
  buff and verifies `SELECT_BUFF` rejects without hash or live recording mutation.
- Unity focused no-take-3 board-selection proof:
  `clients/unity/artifacts/unity/editmode-rejection-manifest-no-take-3-20260512-results.xml`
  reported 1/1 passed for the then-current no-take-3 manifest path. The new case
  `reject-take-gems-no-take-3-buff` applies the existing `DESPERATE_GAMBLE` no-take-3 buff to a
  normal Local PvP `IDLE` state, attempts a valid three-gem board selection, and verifies
  `TAKE_GEMS` rejects without hash or live recording mutation at hash `8e546f4c`.
- Unity focused coordinate-boundary proof:
  `clients/unity/artifacts/unity/editmode-rejection-manifest-coordinate-boundary-20260512-rerun-results.xml`
  reported 1/1 passed for the refreshed 62-case manifest path from `2026-05-12 17:58:49Z` to
  `18:01:13Z`. The five new cases cover out-of-bounds coordinates for `TAKE_GEMS`,
  `TAKE_BONUS_GEM`, `RESERVE_CARD`, `RESERVE_DECK`, and `USE_PRIVILEGE`; the first attempt hit the
  old 180-second timeout after the manifest grew, so the manifest guard now uses a 360-second
  timeout and the rerun passed.
- Unity focused game-over rejection proof:
  `clients/unity/artifacts/unity/editmode-rejection-manifest-game-over-20260512-results.xml`
  reported 1/1 passed for the refreshed 63-case manifest path from `2026-05-12 18:30:46Z` to
  `18:33:41Z`. The new case `reject-action-after-game-over` primes completed replay revision 95,
  sends `REPLENISH` through the live bridge, and preserves replay-state hash `4b6ab7ec` while
  rejecting with `The game has already ended.`.
- Unity focused Joker missing-color rejection proof:
  `clients/unity/artifacts/unity/editmode-rejection-manifest-joker-color-20260512-results.xml`
  first failed because the LocalDev bridge normalized a missing Joker bonus color to `red` and
  accepted the command. The bridge now leaves missing or invalid Joker color payloads as `gold`, so
  the TypeScript oracle rejects them. The rerun
  `clients/unity/artifacts/unity/editmode-rejection-manifest-joker-color-20260512-rerun-results.xml`
  reported 1/1 passed for the refreshed 64-case manifest path from `2026-05-12 19:08:07Z` to
  `19:11:04Z`. The new case `reject-buy-card-joker-without-color` primes
  `local-pvp-joker-color-selection` revision 5, sends `BUY_CARD` through the live bridge without a
  concrete color, rejects with `A concrete bonus color is required before buying this card.`, and
  preserves replay-state hash `d0a0e459`.
- Unity focused Joker reserved-source rejection proof:
  `clients/unity/artifacts/unity/editmode-rejection-manifest-joker-reserved-source-20260512-results.xml`
  reported 1/1 passed for the refreshed 65-case manifest path from `2026-05-12 20:18:45Z` to
  `20:21:52Z`. The new case `reject-initiate-buy-joker-reserved-not-owned` primes
  `local-pvp-joker-color-selection` revision 0, sends `INITIATE_BUY_JOKER` through the live bridge
  with a visible market Joker misrouted as `reserved`, rejects with
  `Reserved card does not belong to the active player.`, and preserves replay-state hash
  `b5d9cbbf`.
- Unity focused Joker wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-joker-wrong-actor-rejection-20260512-results.xml`
  reported 1/1 passed from `2026-05-12 20:35:02Z` to `20:35:11Z`. The live bridge test starts a
  fresh LocalDev game with a visible market Joker, sends `INITIATE_BUY_JOKER` with actor override
  `p2` while the state turn is `p1`, rejects with
  `Command actor p2 does not match active player p1.`, preserves the live state hash, leaves
  `pendingBuy` empty, and appends no Replay vNext event.
- Unity focused reserve wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-reserve-wrong-actor-rejection-20260512-results.xml`
  reported 1/1 passed from `2026-05-12 20:43:18Z` to `20:43:38Z`. The live bridge test starts a
  fresh LocalDev game, rejects wrong-actor `INITIATE_RESERVE` from `IDLE` without state or replay
  mutation, then rejects wrong-actor `RESERVE_CARD` after a valid pending reserve while preserving
  the pending reserve state, the live replay-state hash, and the one recorded initiate event.
- Unity focused deck-reserve wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-deck-reserve-wrong-actor-rejection-20260512-results.xml`
  reported 1/1 passed from `2026-05-12 20:50:22Z` to `20:50:39Z`. The live bridge test starts a
  fresh LocalDev game, rejects wrong-actor `INITIATE_RESERVE_DECK` from `IDLE` without state or
  replay mutation, then rejects wrong-actor `RESERVE_DECK` after a valid pending deck reserve while
  preserving `pendingReserve.isDeck`, the live replay-state hash, and the one recorded initiate
  event.
- Unity focused reserved-card wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-reserved-card-wrong-actor-rejection-20260512-results.xml`
  reported 2/2 passed from `2026-05-12 21:01:22Z` to `21:01:36Z`. The live bridge tests start
  fresh LocalDev games, reject wrong-actor `BUY_RESERVED_CARD` as an ownership-envelope failure
  without state or replay mutation, and reject wrong-actor `DISCARD_RESERVED` without state or
  replay mutation while preserving the reserved-card ownership state.
- Unity focused market-buy wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-market-buy-wrong-actor-rejection-20260512-results.xml`
  reported 1/1 passed from `2026-05-12 21:10:50Z` to `21:10:55Z`. The live bridge test starts a
  fresh LocalDev game with a visible non-Joker market card, sends plain market `BUY_CARD` with
  actor override `p2` while the state turn is `p1`, rejects with
  `Command actor p2 does not match active player p1.`, preserves the live state hash, keeps the
  card in market and out of both tableaus, and appends no Replay vNext event.
- Unity focused privilege wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-privilege-wrong-actor-rejection-20260512-results.xml`
  reported 2/2 passed from `2026-05-12 21:20:10Z` to `21:20:23Z`. The live bridge tests start
  fresh LocalDev games, reject wrong-actor `ACTIVATE_PRIVILEGE` from `IDLE` and wrong-actor
  `USE_PRIVILEGE` from `PRIVILEGE_ACTION` with
  `Command actor p2 does not match active player p1.`, preserve replay-state hashes, privilege
  charges, board, and inventory state, and append no Replay vNext events.
- Unity focused cancel-privilege wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-cancel-privilege-wrong-actor-rejection-20260512-results.xml`
  reported 1/1 passed from `2026-05-12 21:28:16Z` to `21:28:21Z`. The live bridge test starts a
  fresh LocalDev game, rejects wrong-actor `CANCEL_PRIVILEGE` from `PRIVILEGE_ACTION` with
  `Command actor p2 does not match active player p1.`, preserves replay-state hash, phase, turn,
  privilege charge, board, and inventory state, and appends no Replay vNext event.
- Unity focused follow-up wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-follow-up-wrong-actor-rejection-20260512-results.xml`
  reported 1/1 passed from `2026-05-12 21:39:45Z` to `21:39:53Z`. The live bridge test starts a
  fresh LocalDev game, rejects wrong-actor `TAKE_BONUS_GEM`, `DISCARD_GEM`, and `STEAL_GEM` from
  valid follow-up phase setups with `Command actor p2 does not match active player p1.`, preserves
  replay-state hashes, phase, turn, board, and relevant inventory state, and appends no Replay
  vNext events.
- Unity focused reserve-cancel wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-reserve-cancel-wrong-actor-rejection-20260512-results.xml`
  reported 1/1 passed from `2026-05-12 21:46:29Z` to `21:46:35Z`. The live bridge test starts a
  fresh LocalDev game, records a valid active-player `INITIATE_RESERVE`, rejects wrong-actor
  `CANCEL_RESERVE` from `RESERVE_WAITING_GEM` with
  `Command actor p2 does not match active player p1.`, preserves replay-state hash, phase, turn,
  pending reserve, market card, and reserved-card count, and appends no additional Replay vNext
  event.
- Unity focused Joker color wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-joker-color-wrong-actor-rejection-20260512-results.xml`
  reported 1/1 passed from `2026-05-12 21:54:12Z` to `21:54:20Z`. The live bridge test starts a
  fresh LocalDev game, records a valid active-player Joker initiation into `SELECT_CARD_COLOR`,
  rejects wrong-actor color-follow-up `BUY_CARD` with
  `Command actor p2 does not match active player p1.`, preserves replay-state hash, phase, turn,
  pending buy, market card, and player tableau state, and appends no additional Replay vNext event.
- Unity focused discard phase-resolution bridge proof:
  `clients/unity/artifacts/unity/editmode-discard-phase-resolution-20260512-results.xml` reported
  1/1 passed from `2026-05-12 22:03:41Z` to `22:03:48Z`. The live bridge test starts fresh
  LocalDev, enters a controlled over-limit `DISCARD_EXCESS_GEMS` phase, applies two live
  `DISCARD_GEM` commands through `IGameRulesEngine`, records two Replay vNext events, keeps
  `DISCARD_EXCESS_GEMS` at 11 gems, resolves to `IDLE` and hands turn to `p2` at 10 gems, and keeps
  the live replay summary hash aligned with the controller state hash.
- Unity focused bonus/steal phase-resolution bridge proof:
  `clients/unity/artifacts/unity/editmode-bonus-steal-phase-resolution-20260512-results.xml`
  reported 1/1 passed from `2026-05-12 22:13:19Z` to `22:13:28Z`. The live bridge test starts
  fresh LocalDev controllers, enters controlled `BONUS_ACTION` and `STEAL_ACTION` phases, applies
  valid live `TAKE_BONUS_GEM` and `STEAL_GEM` commands through `IGameRulesEngine`, records one
  Replay vNext event per command, verifies the expected board/inventory mutation, resolves both
  follow-up phases to `IDLE` with turn handoff to `p2`, and keeps each live replay summary hash
  aligned with the controller state hash.
- Unity focused royal phase-resolution bridge proof:
  `clients/unity/artifacts/unity/editmode-royal-phase-resolution-20260512-results.xml` reported
  1/1 passed from `2026-05-12 22:19:13Z` to `22:19:17Z`. The live bridge test starts fresh
  LocalDev, enters a controlled `SELECT_ROYAL` phase with `r91-ro` available, applies valid live
  `SELECT_ROYAL_CARD` through `IGameRulesEngine`, records one Replay vNext `select_royal` event,
  moves `r91-ro` from the royal deck to P1, resolves to `IDLE` with turn handoff to `p2`, and keeps
  the live replay summary hash aligned with the controller state hash.
- Post-royal focused validation:
  `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed with 11 fixtures, 65 rejection cases, and no coverage gaps;
  `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed 32/32;
  `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts --check`
  passed; and `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` passed. The latest
  `pnpm test` run reported 177 files and 1112 tests passed. `pnpm release:check`,
  `pnpm boundaries:check`, `pnpm architecture:check`, `pnpm deps:check`, `pnpm desktop:check`, and
  `pnpm secrets:check` also passed after the focused royal proof.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts`:
  updated `fixtures/unity-catalog/manifest.json` after replay references expanded to all 79 cards.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts --check`:
  passed.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm release:check`,
  `pnpm boundaries:check`, `pnpm architecture:check`, `pnpm deps:check`, `pnpm desktop:check`,
  and `pnpm secrets:check`: passed. `pnpm test` reported 177 files and 1112 tests passed.
- `pnpm test:coverage`: passed; coverage ran 177 files and 1112 tests, and
  `tools/scripts/check-coverage-perfile-key-modules.mjs` wrote a passed key-module coverage report
  with 0 violations.
- `pnpm parity:electron-unity`: passed with 54/54 `Equivalent` rows in
  `artifacts/electron-unity-parity/2026-05-12T08-18-40-709Z/parity-matrix.md`.
- Unity targeted LAN visibility settings proof:
  `artifacts/unity/editmode-settings-lan-visibility-20260511-results.xml` reported 1/1 passed,
  start `2026-05-11 16:39:57Z`, end `2026-05-11 16:39:58Z`, duration `1.086457`
  seconds. The settings test clicks visible LAN opponent card and gem visibility controls, persists
  both values, and reloads them on a reopened controller.
- Earlier Unity EditMode before the privilege-cancel follow-up:
  `clients/unity/artifacts/unity/editmode-recovery-invalid-action-release-path-full-20260512-results.xml`
  reported 76/76 passed, including the recovery invalid-action release-path smoke, peek-modal
  release-path smoke, malformed draft bootstrap guard, roguelike draft release-path smoke,
  invalid-action release-path smoke, mailbox response-file hardening, bounded
  product-surface matrix, replay release-path recovery, bridge availability/root checks,
  mailbox-compatible bridge changes, the manifest-driven Unity bridge rejection proof, LAN
  visibility settings persistence, the earlier seeded fresh product-surface game-over proofs, the
  privilege-first product-surface smoke proof, the recovery/settings/chrome release-path smoke
  guards, and the replay-review release-path and malformed-bootstrap release-path guards.
- Unity focused bridge-failure guards:
  `clients/unity/artifacts/unity/editmode-bridge-exception-mapping-20260512-results.xml` and
  `clients/unity/artifacts/unity/editmode-bridge-mailbox-failures-20260512-results.xml` each
  reported 1/1 passed. These tests verify `BRIDGE_TIMEOUT`/`BRIDGE_EXECUTION_FAILED` mapping and
  mailbox unavailable/timeout cleanup behavior without changing runtime bridge behavior.
- Earlier Unity targeted fresh product game-over proof:
  `artifacts/unity/editmode-fresh-product-game-over-20260511-results.xml` reported 1/1 passed,
  start `2026-05-11 14:45:57Z`, end `2026-05-11 14:48:06Z`, duration `128.8797443`
  seconds. The test starts a fresh Local PvP game through the Unity semantic product surface,
  drives visible product commands until game over, verifies each live replay recording hash, exports
  Replay vNext JSON, imports it into a separate controller, and reviews it to the final hash.
- Earlier Unity targeted seeded product game-over proof:
  `artifacts/unity/editmode-fresh-product-seeded-20260511-results.xml` reported 2/2 passed,
  start `2026-05-11 15:45:25Z`, end `2026-05-11 15:49:56Z`, duration `270.6502468`
  seconds. The parameterized test drives two additional fresh Local PvP seeds through the same
  Unity semantic product surface, export/import, and replay-review path.
- Unity Windows build: `artifacts/unity/build-malformed-draft-bootstrap-release-path-20260512.log`
  reports build success and batchmode exit code 0 after the malformed draft bootstrap guard. The
  current Windows build for this continuation is
  `artifacts/unity/build-reserve-deck-cancel-release-path-smoke-20260512.log`, which reports
  build success and batchmode exit code 0 after the deck-reserve cancel smoke update.
- Built-player matrix summary:
  `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed, and
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260511.json --require-family buy_card --require-family cancel_gem_selection --require-family click_board_cell --require-family discard_gem --require-family replenish --require-family reserve_card --require-family select_joker_color --require-family take_gems artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-50-03-972Z.launcher.json`
  passed and wrote `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260511.json`.
  The follow-up command
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json --require-family buy_card --require-family cancel_gem_selection --require-family choose_royal --require-family click_board_cell --require-family discard_gem --require-family replenish --require-family reserve_card --require-family select_joker_color --require-family steal_gem --require-family take_bonus_gem --require-family take_gems artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-50-03-972Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json`
  passed and wrote `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json`.
  The privilege follow-up command
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json --require-family activate_privilege --require-family buy_card --require-family cancel_gem_selection --require-family choose_royal --require-family click_board_cell --require-family discard_gem --require-family replenish --require-family reserve_card --require-family select_joker_color --require-family steal_gem --require-family take_bonus_gem --require-family take_gems --require-family use_privilege artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-50-03-972Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-24-16-298Z.launcher.json`
  passed and refreshed the 20260512 matrix.
  The malformed draft bootstrap follow-up command
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-malformed-draft-bootstrap.json --require-family take_gems,buy_card,reserve_card,cancel_gem_selection,activate_privilege,use_privilege --require-recovery-release-path --require-settings-release-path --require-chrome-release-path --require-replay-review-release-path ...`
  passed for fourteen launcher reports and records replay release-path coverage including
  `malformed_bootstrap` and `malformed_draft_bootstrap`.
  The draft release-path aggregate command
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-draft-release-path.json --require-family take_gems,buy_card,reserve_card,cancel_gem_selection,activate_privilege,use_privilege,choose_boon,reroll_draft_pool --require-recovery-release-path --require-settings-release-path --require-chrome-release-path --require-replay-review-release-path ...`
  passed for fifteen launcher reports and records built-player `choose_boon` plus
  `reroll_draft_pool` draft coverage.
  The invalid-action release-path aggregate command
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-invalid-action-release-path.json --require-family take_gems,buy_card,reserve_card,cancel_gem_selection,activate_privilege,use_privilege,choose_boon,reroll_draft_pool --require-recovery-release-path --require-settings-release-path --require-chrome-release-path --require-replay-review-release-path --require-invalid-action-release-path ...`
  passed for sixteen launcher reports and records one built-player invalid-action release-path proof.
  The recovery invalid-action release-path aggregate command
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-recovery-invalid-action-release-path.json --require-family take_gems,buy_card,reserve_card,cancel_gem_selection,activate_privilege,use_privilege,choose_boon,reroll_draft_pool --require-recovery-release-path --require-settings-release-path --require-chrome-release-path --require-replay-review-release-path --require-invalid-action-release-path --require-peek-modal-release-path --require-recovery-invalid-action-release-path ...`
  passed for eighteen launcher reports and records one built-player recovered invalid-action
  release-path proof.
- Built-player game-over depth proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-game-over-20260512 --max-steps 240 --idle-action-preference balanced --timeout-ms 900000`,
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-game-over-alt-1-20260512 --max-steps 240 --idle-action-preference balanced --timeout-ms 900000`,
  and
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-game-over-alt-2-20260512 --max-steps 240 --idle-action-preference balanced --timeout-ms 900000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T00-52-54-303Z.launcher.json`,
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T01-01-37-234Z.launcher.json`, and
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T01-04-20-176Z.launcher.json`; the players
  reached winners `p1`, `p2`, and `p2`, exported/reviewed 98-, 98-, and 92-event replays, and
  preserved hashes `d6dbea7a`, `411262df`, and `5f3bf567`.
  The game-over aggregate command including those reports passed and refreshed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json` with 10/10 reports,
  515 bridge-backed commands, and 525 mailbox events.
- Built-player recovery release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-recovery-release-path-20260512 --max-steps 2 --include-recovery-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T01-20-54-336Z.launcher.json`. The nested
  recovery report saved LocalDev recovery at hash `208a752`, loaded it in a fresh controller,
  continued another live bridge-backed command to hash `8d4178f7`, exported/reviewed the continued
  replay, and recorded no fixture replay gameplay driver or checkpoint state replacement. The
  final aggregate command with `--require-recovery-release-path` passed and refreshed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json` with 11/11 reports,
  517 bridge-backed commands, 531 mailbox events, one replay release-path report, one recovery
  release-path report, and status `incomplete-evidence`.
- Built-player settings release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-settings-release-path-20260512 --max-steps 2 --include-settings-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T02-00-40-648Z.launcher.json`. The nested
  settings report saved locale `en`, surface theme `pearl-opaline`, sound off, and LAN opponent
  card/gem visibility off to `artifacts/unity/settings/gemduel.preferences.v1.json`, loaded those
  values in a fresh live-game controller, and kept gameplay hashes plus live replay event counts
  unchanged. The final aggregate command with `--require-recovery-release-path` and
  `--require-settings-release-path` passed and refreshed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json` with 12/12 reports,
  519 bridge-backed commands, 536 mailbox events, one replay release-path report, one recovery
  release-path report, one settings release-path report, and status `incomplete-evidence`.
- Built-player chrome release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-chrome-release-path-20260512 --max-steps 2 --include-chrome-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T03-13-11-728Z.launcher.json`. The nested
  chrome report opened and closed the rulebook without changing gameplay hash `8fa33a3f` or live
  replay event count, restarted to the shell, started another fresh LocalDev game through the
  bridge, and recorded a live `take_gems` command at hash `5304b037`. The final aggregate command
  with `--require-recovery-release-path`, `--require-settings-release-path`, and
  `--require-chrome-release-path` passed and wrote
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-chrome.json` with 13/13
  reports, 521 bridge-backed commands, 542 mailbox events, one replay release-path report, one
  recovery release-path report, one settings release-path report, one chrome release-path report,
  and status `incomplete-evidence`.
- Built-player replay-review release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-replay-review-release-path-20260512 --max-steps 4 --include-replay-review-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T03-32-18-999Z.launcher.json`. The nested
  replay-review report exported a four-event live replay, imported it into a separate review
  controller, used visible redo/undo controls, preserved first-redo hash `de4507f0` after undo,
  returned to final revision 4 at hash `db7fb1b7`, and left the source live game hash plus source
  live replay event count unchanged. The final aggregate command with
  `--require-recovery-release-path`, `--require-settings-release-path`,
  `--require-chrome-release-path`, and `--require-replay-review-release-path` passed and wrote
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-replay-review.json` with
  14/14 reports, 525 bridge-backed commands, 552 mailbox events, one replay release-path report,
  one recovery release-path report, one settings release-path report, one chrome release-path
  report, one replay-review release-path report, replay-review final hash `db7fb1b7`, and status
  `incomplete-evidence`.
- Built-player malformed draft bootstrap release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-malformed-draft-bootstrap-release-path-20260512 --max-steps 8 --include-replay-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T05-16-44-409Z.launcher.json`. The nested
  replay release-path report rejects invalid JSON, missing file, unsupported schema,
  `malformed_bootstrap`, `malformed_draft_bootstrap`, corrupted summary, hash mismatch, failed
  overwrite load, and then successfully overwrites/reloads/reviews a valid replay without changing
  live state hash `e5374467` or its eight recorded live replay events. The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-malformed-draft-bootstrap.json`
  passes 14/14 reports with 525 bridge-backed commands, 552 mailbox events, the same
  recovery/settings/chrome/replay-review release-path proofs, and replay release-path coverage
  including `malformed_bootstrap` and `malformed_draft_bootstrap`.
- Built-player draft release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-draft-release-path-20260512 --start-mode roguelike --draft-action-preference reroll-each-player-first --max-steps 8 --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T05-44-04-969Z.launcher.json`. The smoke
  starts a fresh roguelike LocalDev draft, rerolls and selects for both players through
  `reroll_draft_pool` and `choose_boon`, records eight live replay events, exports/imports/reviews
  the replay, and preserves final hash `851b6356`. The draft-only aggregate before the invalid-action follow-up
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-draft-release-path.json`
  passes 15/15 reports with 533 bridge-backed commands, 561 mailbox events, draft families
  `choose_boon` and `reroll_draft_pool`, the same recovery/settings/chrome/replay-review
  release-path proofs, and status `incomplete-evidence`.
- Built-player invalid-action release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-invalid-action-release-path-20260512-rerun --max-steps 8 --include-invalid-action-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T06-34-40-146Z.launcher.json`. The nested
  invalid-action report starts a fresh LocalDev game, rejects `SELECT_BUFF`, `REROLL_DRAFT_POOL`,
  empty `TAKE_GEMS`, `CANCEL_RESERVE`, `CLOSE_MODAL`, and inactive actor `TAKE_GEMS` through the
  live rules boundary, keeps hash `1a6afd3f` plus recorded event count 0 unchanged, exports a
  zero-event replay, and reviews it back to hash `1a6afd3f`. The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-invalid-action-release-path.json`
  passes 16/16 reports with 541 bridge-backed commands, 577 mailbox events, one invalid-action
  release-path report, the previous release-path reports, and status `incomplete-evidence`.
- Additional hygiene evidence after the final build: `pnpm bundle:check` passed with
  `assets/presentation-layer-6vzmD0IT.js` observed at 569.52 KiB, and
  `pnpm release:artifacts:check` passed. Current coverage evidence also passed 177 files and 1112
  tests with 0 key-module coverage violations. Earlier same-day full release evidence also passed:
  `pnpm bench`, `pnpm lifecycle:certify`,
  `pnpm governance:artifacts -- --out-dir artifacts/governance`,
  `pnpm governance:evidence:check -- --artifacts-dir artifacts/governance`, and
  `pnpm governance:dashboard`.
- Checkpoint audit:
  `git grep -n "ReplaceSnapshot" clients/unity/Assets/GemDuel/Scripts/Core clients/unity/Assets/GemDuel/Scripts/Presentation`
  returned no live Core or Presentation hits.
- Anti-slice audit:
  the configured grep still finds historical/supersession wording in migration docs, but no active
  Unity production script or scene remains named `GemDuelVerticalSlice`.

No latest local validation command remains red.

## 2026-05-12 Peek-Modal Release-Path Follow-Up

- Built-player peek-modal release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-peek-modal-seed-17 --start-mode roguelike --max-steps 4 --include-peek-modal-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T07-56-40-905Z.launcher.json`.
- The nested peek-modal report starts a fresh roguelike LocalDev game through
  `GemDuelGameController` / `IGameRulesEngine`, selects `intelligence`, opens the visible
  `peek_deck` control, closes the visible modal control, records `select_buff`, `peek_deck`, and
  `close_modal`, exports/imports/reviews the live replay, and preserves final hash `8399eadd`.
- The focused EditMode result
  `clients/unity/artifacts/unity/editmode-peek-modal-release-path-smoke-20260512-results.xml`
  reports 1/1 passed, and the follow-up full EditMode result
  `clients/unity/artifacts/unity/editmode-peek-modal-release-path-full-20260512-results.xml`
  reports 75/75 passed.
- The rebuilt Windows player log
  `artifacts/unity/build-peek-modal-release-path-smoke-20260512.log` reports build success.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-peek-modal-release-path.json`
  validates 17/17 launcher reports, 545 bridge-backed commands, 587 mailbox events, one
  peek-modal release-path report, the previous replay/recovery/settings/chrome/replay-review/draft
  and invalid-action release-path reports, and status `incomplete-evidence`.

## 2026-05-12 Recovery Invalid-Action Release-Path Follow-Up

- Built-player recovery invalid-action release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-recovery-invalid-action-release-path-20260512 --max-steps 2 --include-recovery-invalid-action-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T09-33-52-882Z.launcher.json`.
- The nested recovery invalid-action report starts a fresh LocalDev game through
  `GemDuelGameController` / `IGameRulesEngine`, records a live `take_gems`, saves recovery, loads it
  in a fresh controller, rejects `CANCEL_RESERVE`, `CLOSE_MODAL`, and inactive actor `TAKE_GEMS`
  through the live bridge, keeps recovered/replay/summary hash `24a87497` unchanged, and keeps
  recorded events at 1.
- After the rejected commands, the smoke applies a valid continuation `take_gems`, exports/imports/
  reviews the continued replay, and preserves final hash `d2b51b3f`.
- The focused EditMode result
  `clients/unity/artifacts/unity/editmode-recovery-invalid-action-release-path-smoke-20260512-results.xml`
  reports 1/1 passed, and the follow-up full EditMode result
  `clients/unity/artifacts/unity/editmode-recovery-invalid-action-release-path-full-20260512-results.xml`
  reports 76/76 passed.
- The rebuilt Windows player log
  `artifacts/unity/build-recovery-invalid-action-release-path-smoke-20260512.log` reports build
  success.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-recovery-invalid-action-release-path.json`
  validates 18/18 launcher reports, 547 bridge-backed commands, 596 mailbox events, one recovery
  invalid-action release-path report, the previous replay/recovery/settings/chrome/replay-review/
  draft/invalid-action/peek-modal release-path reports, and status `incomplete-evidence`.

## 2026-05-12 Privilege-Cancel Release-Path Follow-Up

- Built-player privilege-cancel release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-privilege-family-20260512 --max-steps 3 --idle-action-preference privilege-first --include-privilege-cancel-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T10-51-01-649Z.launcher.json`.
- The nested privilege-cancel report starts a fresh LocalDev game through
  `GemDuelGameController` / `IGameRulesEngine`, takes one gem to create a normal privilege
  opportunity, activates privilege into `PRIVILEGE_ACTION`, uses the visible cancel control to
  route `CANCEL_PRIVILEGE`, records `take_gems`, `activate_privilege`, and `cancel_privilege`,
  returns to `IDLE`, exports/imports/reviews the replay, and preserves final hash `efe66377`.
- The focused EditMode result
  `clients/unity/artifacts/unity/editmode-privilege-cancel-release-path-smoke-20260512-results.xml`
  reports 1/1 passed, and the follow-up full EditMode result
  `clients/unity/artifacts/unity/editmode-privilege-cancel-release-path-full-20260512-results.xml`
  reports 77/77 passed.
- The rebuilt Windows player log
  `artifacts/unity/build-privilege-cancel-release-path-smoke-20260512.log` reports build success.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-privilege-cancel-release-path.json`
  validates 19/19 launcher reports, 550 bridge-backed primary smoke commands, 604 mailbox events,
  one privilege-cancel release-path report, the previous replay/recovery/settings/chrome/
  replay-review/draft/invalid-action/peek-modal/recovery-invalid-action release-path reports, and
  status `incomplete-evidence`.

## 2026-05-12 Reserved-Discard Release-Path Follow-Up

- Built-player reserved-discard release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-reserved-discard-seed-10 --start-mode roguelike --max-steps 6 --include-reserved-discard-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T11-39-09-986Z.launcher.json`.
- The nested reserved-discard report starts a fresh roguelike LocalDev game through
  `GemDuelGameController` / `IGameRulesEngine`, selects the `puppet_master` active buff through
  visible draft cards, reserves `c:125-gr#0` through the visible preview/reserve path, returns the
  turn, opens the active player's reserved-card preview, discards through the visible discard
  control, records `select_buff`, `initiate_reserve`, `reserve_card`, `take_gems`, and
  `discard_reserved`, exports/imports/reviews the replay, and preserves final hash `33909286`.
- The focused EditMode result
  `clients/unity/artifacts/unity/editmode-reserved-discard-release-path-smoke-20260512-results.xml`
  reports 1/1 passed. The latest full EditMode rerun remains the privilege-cancel result
  `clients/unity/artifacts/unity/editmode-privilege-cancel-release-path-full-20260512-results.xml`
  with 77/77 passed; a full suite was not rerun after the reserved-discard follow-up.
- The rebuilt Windows player log
  `artifacts/unity/build-reserved-discard-release-path-smoke-20260512.log` reports build success.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserved-discard-release-path.json`
  validates 20/20 launcher reports, 556 bridge-backed primary smoke commands, 618 mailbox events,
  one reserved-discard release-path report, the previous replay/recovery/settings/chrome/
  replay-review/draft/invalid-action/peek-modal/recovery-invalid-action/privilege-cancel
  release-path reports, and status `incomplete-evidence`.

## 2026-05-12 Reserved-Buy Release-Path Follow-Up

- Built-player reserved-buy release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-reserved-buy-seed-20260512 --max-steps 6 --include-reserved-buy-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T12-29-42-881Z.launcher.json`.
- The nested reserved-buy report starts a fresh LocalDev game through
  `GemDuelGameController` / `IGameRulesEngine`, reserves `c:155-bk#0` through the visible
  preview/reserve path, opens the active player's reserved-card preview, buys through the visible
  preview primary action, records ordered `reserve_card` then reserved-source `buy_card`,
  exports/imports/reviews the replay, and preserves final hash `47c0e9db`.
- The focused EditMode result
  `clients/unity/artifacts/unity/editmode-reserved-buy-release-path-smoke-20260512-results.xml`
  reports 1/1 passed. The latest full EditMode rerun remains the privilege-cancel result
  `clients/unity/artifacts/unity/editmode-privilege-cancel-release-path-full-20260512-results.xml`
  with 77/77 passed; a full suite was not rerun after the reserved-card focused follow-ups.
- The rebuilt Windows player log
  `artifacts/unity/build-reserved-buy-release-path-smoke-20260512.log` reports build success.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserved-buy-release-path.json`
  validates 21/21 launcher reports, 562 bridge-backed primary smoke commands, 634 mailbox events,
  one reserved-buy release-path report, the previous replay/recovery/settings/chrome/
  replay-review/draft/invalid-action/peek-modal/recovery-invalid-action/privilege-cancel/
  reserved-discard release-path reports, and status `incomplete-evidence`.

## 2026-05-12 Reserve-Cancel Release-Path Follow-Up

- Built-player reserve-cancel release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-editmode-live-reserve-cancel --max-steps 6 --include-reserve-cancel-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T13-21-32-993Z.launcher.json`.
- The nested reserve-cancel report starts a fresh LocalDev game through
  `GemDuelGameController` / `IGameRulesEngine`, opens visible market reserve controls, enters
  `RESERVE_WAITING_GEM`, uses the visible cancel control, records ordered `initiate_reserve` and
  `cancel_reserve`, returns to `IDLE` without a pending reserve or reserved card, exports/imports/
  reviews the replay, and preserves final hash `40bdddbf`.
- The focused EditMode result
  `clients/unity/artifacts/unity/editmode-reserve-cancel-release-path-smoke-20260512-results.xml`
  reports 1/1 passed. The latest full EditMode rerun remains the privilege-cancel result
  `clients/unity/artifacts/unity/editmode-privilege-cancel-release-path-full-20260512-results.xml`
  with 77/77 passed; a full suite was not rerun after the focused reserve-cancel follow-up.
- The rebuilt Windows player log
  `artifacts/unity/build-reserve-cancel-release-path-smoke-20260512.log` reports build success.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-cancel-release-path.json`
  validates 22/22 launcher reports, 568 bridge-backed primary smoke commands, 644 mailbox events,
  one reserve-cancel release-path report, the previous replay/recovery/settings/chrome/
  replay-review/draft/invalid-action/peek-modal/recovery-invalid-action/privilege-cancel/
  reserved-discard/reserved-buy release-path reports, and status `incomplete-evidence`.

## 2026-05-12 Reserve-Deck Release-Path Follow-Up

- Built-player reserve-deck release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-editmode-live-reserve-deck --max-steps 6 --include-reserve-deck-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T13-59-30-560Z.launcher.json`.
- The nested reserve-deck report starts a fresh LocalDev game through
  `GemDuelGameController` / `IGameRulesEngine`, opens a visible market deck preview, initiates deck
  reserve through the visible preview reserve control, completes the Gold follow-up through a visible
  board target, records ordered `initiate_reserve_deck` and `reserve_deck`, reduces the level-1 deck
  count from 25 to 24, increases P1 reserved cards from 0 to 1, consumes the selected Gold cell,
  exports/imports/reviews the replay, and preserves final hash `da89d9e5`.
- The focused EditMode result
  `clients/unity/artifacts/unity/editmode-reserve-deck-release-path-smoke-20260512-results.xml`
  reports 1/1 passed. The latest full EditMode rerun remains the privilege-cancel result
  `clients/unity/artifacts/unity/editmode-privilege-cancel-release-path-full-20260512-results.xml`
  with 77/77 passed; a full suite was not rerun after the focused reserve-deck follow-up.
- The rebuilt Windows player log
  `artifacts/unity/build-reserve-deck-release-path-smoke-20260512.log` reports build success.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-deck-release-path.json`
  validates 23/23 launcher reports, 574 bridge-backed primary smoke commands, 654 mailbox events,
  one reserve-deck release-path report, the previous replay/recovery/settings/chrome/
  replay-review/draft/invalid-action/peek-modal/recovery-invalid-action/privilege-cancel/
  reserved-discard/reserved-buy/reserve-cancel release-path reports, and status
  `incomplete-evidence`.

## 2026-05-12 Joker Release-Path Follow-Up

- Built-player Joker release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-replay-release-path-20260511 --max-steps 8 --include-joker-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T14-52-59-171Z.launcher.json`.
- The nested Joker report starts a fresh LocalDev game through
  `GemDuelGameController` / `IGameRulesEngine`, drives six live setup `take_gems` commands until
  visible Joker `c:174-jo#0` is affordable, opens the visible market preview, buys through the
  visible preview primary action, selects visible color `red`, records ordered
  `initiate_buy_joker` and `buy_card`, leaves `SELECT_CARD_COLOR` for `IDLE`, clears pending buy,
  adds the Joker to P1 tableau, exports/imports/reviews the replay, and preserves final hash
  `95c8a06c`.
- The focused EditMode result
  `clients/unity/artifacts/unity/editmode-joker-release-path-smoke-20260512-results.xml` reports
  1/1 passed. The latest full EditMode rerun remains the privilege-cancel result
  `clients/unity/artifacts/unity/editmode-privilege-cancel-release-path-full-20260512-results.xml`
  with 77/77 passed; a full suite was not rerun after the focused Joker follow-up.
- The rebuilt Windows player log
  `artifacts/unity/build-joker-release-path-smoke-20260512.log` reports build success.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-joker-release-path.json`
  validates 24/24 launcher reports, 582 bridge-backed primary smoke commands, 672 mailbox events,
  one Joker release-path report, the previous replay/recovery/settings/chrome/replay-review/draft/
  invalid-action/peek-modal/recovery-invalid-action/privilege-cancel/reserved-discard/reserved-buy/
  reserve-cancel/reserve-deck release-path reports, and status `incomplete-evidence`.

## 2026-05-12 Deck-Reserve Cancel Release-Path Follow-Up

- Built-player deck-reserve cancel release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-replay-release-path-20260511 --max-steps 8 --include-reserve-deck-cancel-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T15-27-57-407Z.launcher.json`.
- The nested deck-reserve cancel report starts a fresh LocalDev game through
  `GemDuelGameController` / `IGameRulesEngine`, opens a visible level-1 market deck preview,
  initiates deck reserve through the visible preview reserve control, enters `RESERVE_WAITING_GEM`,
  cancels through the visible cancel control before selecting Gold, records ordered
  `initiate_reserve_deck` and `cancel_reserve`, returns to `IDLE`, leaves the level-1 deck count at
  25, leaves P1 reserved-card count at 0, leaves the candidate Gold cell unchanged, exports/imports/
  reviews the replay, and preserves final hash `62fa027f`.
- The focused EditMode result
  `clients/unity/artifacts/unity/editmode-reserve-deck-cancel-release-path-smoke-20260512-results.xml`
  reports 1/1 passed. The latest full EditMode rerun remains the privilege-cancel result
  `clients/unity/artifacts/unity/editmode-privilege-cancel-release-path-full-20260512-results.xml`
  with 77/77 passed; a full suite was not rerun after the focused deck-reserve cancel follow-up.
- The rebuilt Windows player log
  `artifacts/unity/build-reserve-deck-cancel-release-path-smoke-20260512.log` reports build success.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-deck-cancel-release-path.json`
  validates 25/25 launcher reports, 590 bridge-backed primary smoke commands, 684 mailbox events,
  one deck-reserve cancel release-path report, the previous replay/recovery/settings/chrome/
  replay-review/draft/invalid-action/peek-modal/recovery-invalid-action/privilege-cancel/
  reserved-discard/reserved-buy/reserve-cancel/reserve-deck/Joker release-path reports, and status
  `incomplete-evidence`.
- The stricter aggregate audit
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-all-release-paths-audit.json`
  revalidates the same 25 launcher reports with every currently available release-path requirement
  flag enabled, including `--require-replay-release-path`, and passes with 590 commands, 684 mailbox
  events, all release-path report counts present, and status `incomplete-evidence`.
- The resource-first built-player breadth report
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T20-12-00-000Z.resource-first.launcher.json`
  passed with exit code 0 and no timeout, recorded 120 live `take_gems` / `discard_gem` /
  `replenish` product-surface commands from a fresh LocalDev launch, exported/imported/reviewed the
  live replay, and preserved final hash `7669d935`. The refreshed resource-first aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-resource-first-breadth.json`
  validates 26/26 reports, 710 commands, 805 mailbox events, all currently observed action families,
  every available release-path requirement flag, and status `incomplete-evidence`.
- The post-no-take-3 combined built-player aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-post-notake3-combined.json`
  revalidates the same 26-report curated set plus the post-fix draft launcher with every required
  action family and every current release-path requirement flag enabled. It validates 27/27 reports,
  716 commands, 812 mailbox events, all 21 required action families, final hash `857c3e58`, and
  status `incomplete-evidence`.
- The 2026-05-13 built-player game-over aggregate guard adds
  `--require-game-over-count <count>` to `tools/migration/summarize-unity-built-player-smokes.mjs`.
  The positive check
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-game-over-guard.json`
  revalidates the retained 27-report post-no-take-3 set with `--require-game-over-count 3`,
  records 3 game-over reports, winners `p1` and `p2`, and game-over hashes `d6dbea7a`,
  `411262df`, and `5f3bf567`. The intentional negative check
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-game-over-negative.json`
  fails with `Required built-player game-over report count was not met: expected at least 4, found
3.`. This hardens aggregate evidence only; it remains `incomplete-evidence`.
- The strict 2026-05-13 built-player aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-game-over-release-path.json`
  combines all current built-player audit requirements in one artifact: 21 required action
  families, every current release-path proof flag, and `--require-game-over-count 3`. It passes
  with 27/27 reports, 716 commands, 812 mailbox events, no missing required families, 3 game-over
  reports, winners `p1` and `p2`, game-over hashes `d6dbea7a`, `411262df`, and `5f3bf567`, and one
  report for each required release-path proof family. This is the strongest retained built-player
  aggregate for this run, but it remains `incomplete-evidence`.
- The strict 2026-05-13 winner-release aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-game-over-winner-release-path.json`
  supersedes that strict aggregate as the strongest all-release-path built-player ledger. It uses
  the same 27 retained launcher reports while requiring all 21 action families, every current
  release-path proof flag, `--require-game-over-count 3`, and
  `--require-game-over-winner p1,p2`. It passes with 27/27 reports, 716 commands, 812 mailbox
  events, 3 game-over reports, winners `p1` and `p2`, no missing required families, no missing
  required winners, one report for each required release-path proof family, and status
  `incomplete-evidence`.
- The 2026-05-13 mailbox response audit hardening updates
  `tools/migration/run-unity-built-player-smoke.mjs` so each bridge response is first written to a
  private `responses/audit/` copy and then delivered to the Unity mailbox response path. The
  minimal validation report
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Tmailbox-audit.launcher.json` passed with
  exit code 0, 2 audited mailbox responses, `responseOk=true` for `INIT` and `TAKE_GEMS`, one live
  recorded `take_gems` event, no fixture gameplay driver, no checkpoint state replacement, and
  final hash `ec648e6c`. The aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-audit.json`
  validates that report and remains `incomplete-evidence`.
- The 2026-05-13 audited mailbox aggregate guard adds
  `--require-audited-mailbox-responses` to
  `tools/migration/summarize-unity-built-player-smokes.mjs`. The positive aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-audit-guard.json`
  passes against the mailbox-audited smoke with 2 audited successful mailbox responses. The
  negative aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-audit-negative.json`
  fails as expected against an older retained launcher report with
  `Bridge mailbox did not record successful request handling.` This remains LocalDev evidence
  hardening only.
- The 2026-05-13 audited mailbox rejection guard then validates the rejection side of the same
  boundary. `artifacts/unity/built-player-smoke/smoke-2026-05-13Tmailbox-rejection-audit.launcher.json`
  starts the built Windows player fresh with the invalid-action release path enabled, records 9
  audited mailbox responses, and preserves audit copies for 3 successful bridge calls plus 6
  expected rejections. The rejected bridge responses include 5 `COMMAND_REJECTED` codes and 1
  `INVALID_ACTOR` code. The aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-rejection-audit.json`
  passes with `--require-audited-mailbox-responses` and `--require-invalid-action-release-path`,
  final invalid-action hash `f2780c3f`, zero invalid-action replay events, and status
  `incomplete-evidence`.
- The 2026-05-13 audited product-surface breadth smoke
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-breadth.launcher.json` starts the
  built Windows player fresh with seed `unity-built-player-audited-breadth-20260513`, applies 24
  live product-surface commands, retains 25 audited successful mailbox responses, covers
  `take_gems`, `buy_card`, `take_bonus_gem`, `discard_gem`, and `replenish`, exports/imports/reviews
  24 live replay events, and preserves final hash `f934c91b` without fixture gameplay or checkpoint
  replacement. The aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-breadth.json`
  passes with `--require-audited-mailbox-responses` and those five required families. This is
  bounded product-surface breadth evidence only; it does not close broad arbitrary Local PvP.
- The 2026-05-13 audited preference breadth smokes add non-balanced product-surface samples.
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-reserve-first.launcher.json` starts
  fresh with `reserve-first`, records 12 live `reserve_card` / `cancel_gem_selection` commands,
  retains 13 audited successful mailbox responses, and preserves final/reviewed hash `38d97b7f`.
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-privilege-first.launcher.json`
  starts fresh with `privilege-first`, records 24 live commands including `activate_privilege` and
  `use_privilege`, retains 25 audited successful mailbox responses, and preserves final/reviewed
  hash `62b67ebe`. The aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-preferences.json`
  passes with `--require-audited-mailbox-responses`, 2/2 reports, 36 commands, 38 audited
  successful mailbox responses, and required families `reserve_card`, `cancel_gem_selection`,
  `activate_privilege`, `use_privilege`, `take_gems`, and `discard_gem`. This is still bounded
  preference evidence, not arbitrary product-surface completion.
- The combined audited mailbox aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined.json`
  validates the audited mailbox success, rejection, balanced breadth, reserve-first, and
  privilege-first launcher reports together. It passes with audited mailbox responses required,
  invalid-action release-path proof required, and the covered action families required: 5/5 reports,
  62 commands, 74 mailbox events, 74 audited mailbox responses, 68 successful bridge responses, one
  invalid-action release-path report, final hashes `38d97b7f`, `3b479090`, `62b67ebe`, `ec648e6c`,
  and `f934c91b`, invalid-action hash `f2780c3f`, and status `incomplete-evidence`. This improves
  auditability of the audited-mailbox subset only; it does not change the final `Incomplete`
  verdict.
- The audited built-player game-over proof
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-game-over-1.launcher.json` reruns
  deterministic seed `unity-built-player-game-over-20260512` through the current audited mailbox
  launcher. It passes from a fresh built Windows player process with exit code 0, no timeout, 98
  live product-surface commands, 99 mailbox events, 99 audited successful mailbox responses, winner
  `p1`, final state hash `d6dbea7a`, and reviewed replay hash `d6dbea7a`. The paired aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over.json`
  passes with `--require-audited-mailbox-responses`, `--require-game-over-count 1`, eight observed
  action families, one game-over report, and status `incomplete-evidence`. This closes an
  auditability gap in the audited subset only; it does not change the final `Incomplete` verdict.
- The audited built-player p2 game-over follow-up adds
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-game-over-p2-1.launcher.json` and
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-game-over-p2-2.launcher.json`.
  They rerun deterministic seeds `unity-built-player-game-over-alt-1-20260512` and
  `unity-built-player-game-over-alt-2-20260512` through fresh built Windows player processes with
  exit code 0, no timeout, winners `p2` and `p2`, final/review hashes `411262df` and `5f3bf567`,
  98 and 92 live commands, and 99 plus 93 audited successful mailbox responses. The winner-breadth
  aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over-winner-breadth.json`
  combines those reports with the audited `p1` game-over proof and passes with audited mailbox
  responses required, `--require-game-over-count 3`, 3/3 reports, 288 commands, 291 audited
  successful mailbox responses, winners `p1` and `p2`, game-over hashes `d6dbea7a`, `411262df`,
  and `5f3bf567`, and status `incomplete-evidence`.
- The stricter audited-subset aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-breadth.json`
  combines eight audited launcher reports with audited mailbox responses, invalid-action
  release-path proof, and three game-over proofs all required. It passes with 8/8 reports, 350
  commands, 365 mailbox events, 365 audited mailbox responses, 359 successful responses, one
  invalid-action release-path report, three game-over reports, winners `p1` and `p2`, game-over
  hashes `d6dbea7a`, `411262df`, and `5f3bf567`, invalid-action hash `f2780c3f`, twelve observed
  action families, and status `incomplete-evidence`.
- The 2026-05-13 built-player game-over winner guard adds
  `--require-game-over-winner <winner[,winner...]>` to
  `tools/migration/summarize-unity-built-player-smokes.mjs`. The enforced winner-breadth aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over-winner-guard.json`
  passes with audited mailbox responses, `--require-game-over-count 3`,
  `--require-game-over-winner p1,p2`, 3/3 audited game-over reports, 288 commands, 291 audited
  successful mailbox responses, winners `p1` and `p2`, and status `incomplete-evidence`. The
  stricter combined enforced aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-guard.json`
  passes with audited mailbox responses, invalid-action release-path proof, at least three game-over
  reports, and winners `p1,p2` all required: 8/8 reports, 350 commands, 365 audited mailbox
  responses, one invalid-action release-path report, and status `incomplete-evidence`. An
  intentional p2-only negative check failed closed with
  `Required built-player game-over winner was not covered: p1`.
- The 2026-05-13 audited replay release-path proof
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-replay-release-path.launcher.json`
  starts the built Windows player fresh with seed
  `unity-built-player-audited-replay-release-path-20260513`, records 8 live commands and 9 audited
  successful mailbox responses, covers `discard_gem` and `take_gems`, exports/imports/reviews the
  live replay at hash `f9eb9e83`, and then exercises invalid JSON, missing file, unsupported
  schema, malformed bootstrap, malformed draft bootstrap, corrupted summary, hash mismatch, failed
  overwrite load, and valid overwrite/reload/review. The aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path.json`
  passes with `--require-audited-mailbox-responses`, `--require-replay-release-path`, the observed
  action families, 9 retained audited responses, full replay release-path coverage, and status
  `incomplete-evidence`.
- The 2026-05-13 mailbox audit-file hardening updates
  `tools/migration/summarize-unity-built-player-smokes.mjs` so
  `--require-audited-mailbox-responses` proves each retained audit response file exists, parses,
  and matches the launcher event's `ok`/`actionType`/rejection summary. The focused test
  `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 18/18, including fail-closed
  missing-file, invalid-JSON, mismatched-summary, missing-executable, outside-executable,
  empty-stdout, mismatched-stdout-byte, missing-stderr-file, mismatched-stderr-byte,
  empty-player-log, mismatched-player-log-byte, missing nested smoke-report, invalid nested
  smoke-report JSON, mismatched nested smoke-report, outside-artifacts evidence path, and escaped
  audit-response path plus mismatched audit-response request-name cases.
  The file-backed replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-filebacked.json`
  passes with 9/9 valid parsed audit response files, and the file-backed combined audited
  game-over/invalid-action aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-filebacked.json`
  passes with 365/365 valid parsed audit response files, one invalid-action release-path report,
  three game-over reports, winners `p1`/`p2`, and status `incomplete-evidence`.
- The 2026-05-13 audited built-player aggregate strict unique-path guard re-runs that same
  file-backed combined audited report set through exact cardinality and duplicate-evidence guards.
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-strict-unique-paths.json`
  passes with `--require-audited-mailbox-responses`, `--require-report-count 8`,
  `--require-unique-report-paths`, `--require-unique-smoke-report-paths`,
  `--require-unique-log-paths`, `--require-invalid-action-release-path`,
  `--require-game-over-count 3`, and `--require-game-over-winner p1,p2`: 8/8 reports, 350
  commands, 365 mailbox events, 365 valid retained audit response files, 359 successful responses,
  one invalid-action release-path report, three game-over reports, winners `p1`/`p2`, empty
  duplicate launcher/nested-smoke/stdout/stderr/player-log path lists, no failures, and status
  `incomplete-evidence`. This is the strongest audited-mailbox subset proof; it does not replace
  the 27-report all-release-path aggregate or close replacement-candidate blockers.
- The 2026-05-13 audited replay plus game-over strict aggregate composes the audited replay
  release-path proof with the audited game-over/invalid-action strict unique-path subset.
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-strict-unique-paths.json`
  passes with `--require-audited-mailbox-responses`, `--require-report-count 9`,
  `--require-unique-report-paths`, `--require-unique-smoke-report-paths`,
  `--require-unique-log-paths`, `--require-replay-release-path`,
  `--require-invalid-action-release-path`, `--require-game-over-count 3`, and
  `--require-game-over-winner p1,p2`: 9/9 reports, 358 commands, 374 mailbox events, 374 valid
  retained audit response files, 368 successful responses, twelve required audited action
  families, one replay release-path report, one invalid-action release-path report, three
  game-over reports, winners `p1`/`p2`, replay release-path coverage for invalid/missing/
  unsupported/malformed/corrupt/hash-mismatch/overwrite/review cases, empty duplicate
  launcher/nested-smoke/stdout/stderr/player-log path lists, no failures, and status
  `incomplete-evidence`. This is stronger audited evidence composition only; it still does not
  solve arbitrary product-surface play, LAN/online/Visual Lab, or release-runtime packaging.
- The 2026-05-13 audited digest-count aggregate guard adds
  `--require-audited-mailbox-response-digest-count <count>` for mixed retained evidence ledgers
  where only newer audited reports carry response digest metadata. The 10-report aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-digest-count-strict.json`
  composes the audited replay/game-over strict set with the digest-bearing mailbox report and
  passes with `--require-audited-mailbox-responses`,
  `--require-audited-mailbox-response-digest-count 3`, `--require-report-count 10`,
  `--require-unique-report-paths`, `--require-unique-smoke-report-paths`,
  `--require-unique-log-paths`, `--require-launcher-args`, `--require-replay-release-path`,
  `--require-invalid-action-release-path`, `--require-game-over-count 3`, and
  `--require-game-over-winner p1,p2`: 10/10 reports, 360 commands, 377 mailbox events, 377 valid
  retained audit response files, 3 valid audit response digests, 371 successful responses, twelve
  required audited action families, two replay release-path reports, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, full replay release-path
  coverage, empty duplicate launcher/nested-smoke/stdout/stderr/player-log path lists,
  launcher-argument validation, no failures, and status `incomplete-evidence`. This proves the
  digest-bearing mailbox smoke can be audited beside the strict replay/game-over subset, but it
  remains LocalDev evidence and does not close replacement-candidate blockers.
- The 2026-05-13 all-release plus audited-digest strict union composes the 27-report all-release
  path retained built-player set with the 10-report audited replay/game-over/digest set. The first
  attempt with `--require-launcher-args` failed closed because two earliest 2026-05-11 launcher
  reports predate the later idle-action-preference argument metadata. The accepted union aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-all-release-plus-audited-digest-strict-union.json`
  passes without launcher-args validation but with `--require-report-count 37`,
  `--require-unique-report-paths`, `--require-unique-smoke-report-paths`,
  `--require-unique-log-paths`, every current release-path flag, the full 21-family action union,
  `--require-game-over-count 6`, and `--require-game-over-winner p1,p2`: 37/37 reports, 1076
  commands, 1189 mailbox events, 377 valid retained audit response files, 3 valid audit response
  digests, 371 successful responses, every current release-path proof family, six game-over
  reports, winners `p1`/`p2`, empty duplicate launcher/nested-smoke/stdout/stderr/player-log path
  lists, no failures, and status `incomplete-evidence`. This is the broadest retained
  evidence-composition ledger, but it remains bounded LocalDev evidence and includes older
  non-audited reports.
- The 2026-05-13 launcher-args refreshed union replaces the two oldest no-preference-arg baseline
  reports from that union with fresh current-format built-player smokes. The refreshed 12-step
  breadth run records families `take_gems`, `buy_card`, and `replenish`, 13 valid retained audit
  response files/digests, and final/review hash `69747be4`. The refreshed 30-step long run records
  families `take_gems`, `buy_card`, `replenish`, `discard_gem`, and `select_joker_color`, 31 valid
  retained audit response files/digests, and final/review hash `414e3342`. The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-launcher-args-refreshed-union.json`
  passes with `--require-report-count 37`, `--require-unique-report-paths`,
  `--require-unique-smoke-report-paths`, `--require-unique-log-paths`, `--require-launcher-args`,
  every current release-path flag, all 21 required action families, `--require-game-over-count 6`,
  and `--require-game-over-winner p1,p2`: 37/37 reports, 1076 commands, 1189 mailbox events, 421
  valid retained audit response files, 47 valid audit response digests, 415 successful responses,
  every current release-path proof family, six game-over reports, winners `p1`/`p2`, empty
  duplicate evidence-path lists, launcher args matching smoke metadata, no failures, and status
  `incomplete-evidence`. This supersedes the prior non-launcher-args union as the strongest broad
  evidence-composition ledger.
- The 2026-05-13 executable path guard updates the same summarizer so retained built-player launcher
  reports must point to an existing executable under `artifacts/unity/build/windows/`. The
  executable-guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-exe-guard.json`
  passes with 1/1 report, and the executable-guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-exe-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, and status
  `incomplete-evidence`.
- The 2026-05-13 player-log byte guard updates the same summarizer so retained built-player
  launcher reports must include a non-empty Unity player log whose size matches
  `playerLogBytes`. The player-log-guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-playerlog-guard.json`
  passes with 1/1 report, and the player-log-guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-playerlog-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, and status
  `incomplete-evidence`.
- The 2026-05-13 stdout byte guard updates the same summarizer so retained built-player launcher
  reports must include a non-empty stdout capture whose size matches `stdoutBytes`. The
  stdout-byte-guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stdout-byte-guard.json`
  passes with 1/1 report, and the stdout-byte-guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stdout-byte-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, and status
  `incomplete-evidence`.
- The 2026-05-13 stderr byte guard updates the same summarizer so retained built-player launcher
  reports must include a stderr capture whose size matches `stderrBytes`; empty stderr remains
  valid for successful runs. The stderr-byte-guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stderr-byte-guard.json`
  passes with 1/1 report, and the stderr-byte-guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stderr-byte-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, retained stdout/stderr/player-log
  paths, and status `incomplete-evidence`.
- The 2026-05-13 nested smoke-report guard updates the same summarizer so retained built-player
  launcher reports must include a nested smoke report file that parses as JSON and matches the
  launcher-embedded smoke report. The nested-smoke-report-guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-nested-smoke-report-guard.json`
  passes with 1/1 report, and the nested-smoke-report-guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-nested-smoke-report-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, retained stdout/stderr/player-log
  paths, and status `incomplete-evidence`.
- The 2026-05-13 artifact path guard updates the same summarizer so retained built-player launcher
  reports, stdout/stderr/player logs, nested smoke reports, and bridge mailbox directories must
  resolve under `artifacts/unity/built-player-smoke/`. The artifact-path-guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-artifact-path-guard.json`
  passes with 1/1 report, and the artifact-path-guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-artifact-path-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, retained stdout/stderr/player-log
  paths, and status `incomplete-evidence`.
- The 2026-05-13 mailbox audit-path guard updates the same summarizer so each retained mailbox
  `auditResponse` file must resolve inside the built-player smoke's bridge mailbox directory. The
  mailbox-audit-path-guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-mailbox-audit-path-guard.json`
  passes with 1/1 report, and the mailbox-audit-path-guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-mailbox-audit-path-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, retained stdout/stderr/player-log
  paths, and status `incomplete-evidence`.
- The 2026-05-13 mailbox audit request-name guard updates the same summarizer so each retained
  mailbox `auditResponse` file name must match the launcher event's request file name. The
  mailbox-audit-request-name-guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-mailbox-audit-request-name-guard.json`
  passes with 1/1 report, and the mailbox-audit-request-name-guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-mailbox-audit-request-name-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, retained stdout/stderr/player-log
  paths, and status `incomplete-evidence`.
- The 2026-05-13 mailbox audit digest guard updates
  `tools/migration/run-unity-built-player-smoke.mjs` to record each retained mailbox audit response
  file's byte count and SHA-256 before Unity consumes the delivered response, and updates
  `tools/migration/summarize-unity-built-player-smokes.mjs` with
  `--require-audited-mailbox-response-digests`. The focused summarizer test now passes 20/20,
  including fail-closed digest mismatch and missing digest metadata cases. Fresh built-player smoke
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Tmailbox-digest.launcher.json` starts
  `artifacts/unity/build/windows/GemDuelUnity.exe` with seed
  `unity-built-player-mailbox-digest-20260513`, runs two live `take_gems` commands through the
  LocalDev mailbox bridge, records three audited response digests, covers replay release-path
  invalid/corrupt/hash-mismatch/overwrite handling, and preserves final/review hash `bd4c4bd0`.
  Digest-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-guard.json`
  passes 1/1 with 3/3 valid parsed audit response files, 3/3 valid audit response digests, replay
  release-path coverage, and status `incomplete-evidence`.
- The 2026-05-13 launcher args guard updates the same summarizer with `--require-launcher-args`.
  It validates that retained launcher `args` include the built-player smoke flag and match the
  retained player-log path, nested smoke-report path, seed, max steps, start mode, action
  preferences, release-path include flags, and replay/replay-review release directories. The
  focused summarizer test now passes 22/22, including a fail-closed seed-argument mismatch. The
  launcher-args digest aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-launcher-args-guard.json`
  passes 1/1 with `--require-launcher-args`, 3/3 valid audit response digests,
  `launcherArgsMatchSmoke=true`, replay release-path coverage, hash `bd4c4bd0`, and status
  `incomplete-evidence`.
- The 2026-05-13 TypeScript bridge structured error-output hardening updates
  `tools/migration/unity-rules-engine-bridge.ts` so `--out` callers receive an atomic structured
  `ok=false` JSON response with rejection code `BRIDGE_EXECUTION_FAILED` when the CLI hits an
  unhandled infrastructure error after argument parsing, such as malformed request JSON. The
  original stderr diagnostics and non-zero exit status remain intact. The adjacent CLI
  rejected-command guard now proves a valid wrong-actor gameplay command also writes structured
  `ok=false` JSON to `--out`, exits with status `2`, preserves the supplied state/hash, and leaves
  no temp response file. The focused bridge file now passes 35/35. This is LocalDev/evidence bridge
  hardening only and does not resolve release-runtime packaging.
- The 2026-05-13 TypeScript bridge availability negative-case coverage extends Unity EditMode
  `TypeScriptBridgeAvailabilityAndRepositoryRootChecksAreStructured` with explicit missing
  `tools/scripts` and missing `tools/migration/unity-rules-engine-bridge.ts` diagnostics. The
  focused `-testFilter` batchmode attempt executed zero tests and is not counted. The follow-up
  `-testNames` run was ignored by this Unity Test Framework version and became unfiltered, but
  `artifacts/unity/editmode-bridge-availability-negative-20260513-testnames-results.xml` reports
  91/91 passed and includes the updated bridge availability test. This is LocalDev/evidence bridge
  hardening only and does not resolve release-runtime packaging.
- The 2026-05-13 TypeScript bridge mailbox corrupt-response cleanup coverage extends Unity EditMode
  `TypeScriptBridgeMailboxFailuresAreStructuredAndCleanTempFiles` with malformed mailbox response
  JSON after a Unity request is published, then verifies `JsonReaderException` and cleanup of the
  response path. The first two full EditMode attempts failed inside the new guard and are retained
  as negative evidence; a third run proved the guard passed but exposed a slow product-surface
  timeout. After aligning that timeout with the existing 600-second bounded matrix timeout,
  `artifacts/unity/editmode-mailbox-corrupt-response-timeout-fixed-20260513-results.xml` reports
  91/91 passed and includes the corrupt-response cleanup guard. This is LocalDev/evidence bridge
  hardening only and does not resolve release-runtime packaging.
- The 2026-05-13 TypeScript bridge mailbox request cleanup hardening updates
  `TypeScriptRulesBridgeMailboxClient.Execute` so timeout or response-parse failure best-effort
  removes the already-published request `.json` path as well as the temp request and response path.
  `TypeScriptBridgeMailboxFailuresAreStructuredAndCleanTempFiles` now verifies timeout and corrupt
  response paths leave no stale request files. The full EditMode rerun
  `artifacts/unity/editmode-mailbox-request-cleanup-20260513-results.xml` reports 91/91 passed and
  includes the updated mailbox cleanup guard. This is LocalDev/evidence bridge hardening only and
  does not resolve release-runtime packaging.
- The 2026-05-13 built-player failure reason coherence guard updates
  `tools/migration/summarize-unity-built-player-smokes.mjs` so passing retained launcher reports
  fail closed if the launcher, wrapper, nested product-surface smoke, or any known release-path
  section carries a non-empty `failureReason`. The focused summarizer test passes 23/23, including
  a stale nested product-surface failure reason case. The failure-reason digest aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-failure-reason-guard.json`
  passes 1/1 with zero retained failure reasons, hash `bd4c4bd0`, and status
  `incomplete-evidence`.
- The 2026-05-13 stdout capture guard updates the same summarizer so retained built-player launcher
  reports must include a non-empty stdout capture. The stdout-guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stdout-guard.json`
  passes with 1/1 report, and the stdout-guard combined aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stdout-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, and status
  `incomplete-evidence`.
- The 2026-05-13 reserved-discard summary guard refresh adds focused test coverage for retained
  built-player reserved-discard release-path evidence. The summarizer now proves
  `--require-reserved-discard-release-path` accepts only evidence with `puppet_master` selection,
  visible reserved-card discard controls, ordered `select_buff`/`reserve_card`/`discard_reserved`
  export, recorded/exported count preservation, and export/review hash preservation, and fails
  closed when the discard control evidence is hidden. The retained launcher report
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T11-39-09-986Z.launcher.json` passed the
  concrete matrix
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserved-discard-summary-guard.json`
  with 1/1 report, 6 product-surface commands, 14 mailbox events, reserved-discard hash
  `33909286`, final hash `fb772d70`, and status `incomplete-evidence`.
- The 2026-05-13 reserved-buy summary guard refresh adds focused test coverage for retained
  built-player reserved-buy release-path evidence. The summarizer now proves
  `--require-reserved-buy-release-path` accepts only evidence with visible reserved-card buy
  controls, ordered `reserve_card` and reserved-source `buy_card` export, recorded/exported count
  preservation, and export/review hash preservation, and fails closed when the buy event source is
  not reserved. The retained launcher report
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T12-29-42-881Z.launcher.json` passed the
  concrete matrix
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserved-buy-summary-guard.json`
  with 1/1 report, 6 product-surface commands, 16 mailbox events, reserved-buy hash `47c0e9db`,
  final hash `8ea252da`, and status `incomplete-evidence`.
- The 2026-05-13 reserve-cancel summary guard refresh adds focused test coverage for retained
  built-player reserve-cancel release-path evidence. The summarizer now proves
  `--require-reserve-cancel-release-path` accepts only evidence with visible market reserve/cancel
  controls, `RESERVE_WAITING_GEM` to `IDLE` transition, cleared pending-reserve state, ordered
  `initiate_reserve`/`cancel_reserve` export, recorded/exported count preservation, and
  initial/export/review hash preservation, and fails closed when pending reserve state remains after
  cancel. The retained launcher report
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T13-21-32-993Z.launcher.json` passed the
  concrete matrix
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-cancel-summary-guard.json`
  with 1/1 report, 6 product-surface commands, 10 mailbox events, reserve-cancel hash `40bdddbf`,
  final hash `bdbabdbb`, and status `incomplete-evidence`.
- The 2026-05-13 reserve-deck summary guard refresh adds focused test coverage for retained
  built-player reserve-deck release-path evidence. The summarizer now proves
  `--require-reserve-deck-release-path` accepts only evidence with visible deck/gold reserve
  controls, deck-pending phase evidence, deck/reserved/gold-cell mutation, ordered
  `initiate_reserve_deck`/`reserve_deck` export, recorded/exported count preservation, and
  export/review hash preservation, and fails closed when the deck does not decrement. The retained
  launcher report
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T13-59-30-560Z.launcher.json` passed the
  concrete matrix
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-deck-summary-guard.json`
  with 1/1 report, 6 product-surface commands, 10 mailbox events, reserve-deck hash `da89d9e5`,
  final hash `63df431c`, and status `incomplete-evidence`.
- The 2026-05-13 reserve-deck-cancel summary guard refresh adds focused test coverage for retained
  built-player deck-reserve cancel release-path evidence. The summarizer now proves
  `--require-reserve-deck-cancel-release-path` accepts only evidence with visible deck/gold
  reserve/cancel controls, deck-pending cancel phase evidence, restored deck/reserved/gold-cell
  state, ordered `initiate_reserve_deck`/`cancel_reserve` export, recorded/exported count
  preservation, and initial/export/review hash preservation, and fails closed when cancel mutates
  deck/reserve row/pending reserve/Gold state. The retained launcher report
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T15-27-57-407Z.launcher.json` passed the
  concrete matrix
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-deck-cancel-summary-guard.json`
  with 1/1 report, 8 product-surface commands, 12 mailbox events, deck-reserve cancel hash
  `62fa027f`, final hash `95c8a06c`, and status `incomplete-evidence`.
- The 2026-05-13 Joker summary guard refresh adds focused test coverage for retained built-player
  Joker release-path evidence. The summarizer now proves `--require-joker-release-path` accepts only
  evidence with visible market preview/buy/color controls, `SELECT_CARD_COLOR` to `IDLE` transition,
  Joker tableau placement, pending-buy clearing, ordered `initiate_buy_joker`/`buy_card` export,
  recorded/exported count preservation, and export/review hash preservation, and fails closed when
  pending buy is not cleared. The retained launcher report
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T14-52-59-171Z.launcher.json` passed the
  concrete matrix
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-joker-summary-guard.json`
  with 1/1 report, 8 product-surface commands, 18 mailbox events, Joker hash `95c8a06c`, final hash
  `95c8a06c`, and status `incomplete-evidence`.
- The 2026-05-13 draft summary guard refresh adds focused test coverage for retained built-player
  roguelike draft release-path evidence. The summarizer now proves `--require-draft-release-path`
  accepts only evidence with fresh roguelike `reroll-each-player-first` start, ordered P1/P2
  `reroll_draft_pool` and `choose_boon` actions, `DRAFT_PHASE` to `IDLE` completion, live replay
  event counts, and export/review hash preservation, and fails closed when both players' draft
  selections do not resolve to `IDLE`. The retained launcher report
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T05-44-04-969Z.launcher.json` passed the
  concrete matrix
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-draft-summary-guard.json`
  with 1/1 report, 8 product-surface commands, 9 mailbox events, draft hash `851b6356`, final hash
  `851b6356`, and status `incomplete-evidence`.
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-draft-post-notake3-summary-guard.json`
  also passed against the newer post-no-take-3 retained draft launcher with 1/1 report, 6
  product-surface commands, 7 mailbox events, draft hash `857c3e58`, final hash `857c3e58`, and
  status `incomplete-evidence`.
- The 2026-05-13 built-player aggregate report-count guard updates the summarizer with
  `--require-report-count <count>` so retained aggregate checks fail closed if a later rerun drops
  launcher reports while still satisfying action-family, winner, and release-path flags. The
  focused summarizer test passes 57/57, including exact-count and too-high-count cases. The strict
  report-count aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-report-count-guard.json`
  revalidates the 27-report winner-release set with `--require-report-count 27`, all 21 required
  action families, every current release-path proof flag, `--require-game-over-count 3`, and
  `--require-game-over-winner p1,p2`. It passes with 27/27 reports, 716 product-surface commands,
  812 mailbox events, three game-over reports, winners `p1`/`p2`, one report for every current
  release-path proof family, no failures, and status `incomplete-evidence`.
- The 2026-05-13 built-player aggregate unique-report-path guard updates the summarizer with
  `--require-unique-report-paths` so retained aggregate checks fail closed if a later rerun pads the
  expected report count with duplicate launcher report paths. The focused summarizer test passes
  59/59, including unique-path and duplicate-path cases. The strict unique-report-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-report-path-guard.json`
  revalidates the same 27-report winner-release set with `--require-report-count 27`,
  `--require-unique-report-paths`, all 21 required action families, every current release-path proof
  flag, `--require-game-over-count 3`, and `--require-game-over-winner p1,p2`. It passes with 27/27
  reports, 716 product-surface commands, 812 mailbox events, `requireUniqueReportPaths: true`, an
  empty `duplicateReportPaths` list, three game-over reports, winners `p1`/`p2`, one report for
  every current release-path proof family, no failures, and status `incomplete-evidence`.
- The 2026-05-13 built-player aggregate unique-nested-smoke-report guard updates the summarizer with
  `--require-unique-smoke-report-paths` so retained aggregate checks fail closed if distinct
  launcher reports point at the same nested product-surface smoke report file. The focused
  summarizer test passes 61/61, including unique nested smoke-report and duplicate nested
  smoke-report cases. The strict unique-nested-smoke-report aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-nested-smoke-report-guard.json`
  revalidates the same 27-report winner-release set with `--require-report-count 27`,
  `--require-unique-report-paths`, `--require-unique-smoke-report-paths`, all 21 required action
  families, every current release-path proof flag, `--require-game-over-count 3`, and
  `--require-game-over-winner p1,p2`. It passes with 27/27 reports, 716 product-surface commands,
  812 mailbox events, `requireUniqueReportPaths: true`, an empty `duplicateReportPaths` list,
  `requireUniqueSmokeReportPaths: true`, an empty `duplicateSmokeReportPaths` list, three game-over
  reports, winners `p1`/`p2`, one report for every current release-path proof family, no failures,
  and status `incomplete-evidence`.
- The 2026-05-13 built-player aggregate unique-log-path guard updates the summarizer with
  `--require-unique-log-paths` so retained aggregate checks fail closed if distinct launcher reports
  reuse stdout, stderr, or Unity player log files. The focused summarizer test passes 63/63,
  including unique retained log paths and duplicate retained log path cases. The strict
  unique-log-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-log-path-guard.json`
  revalidates the same 27-report winner-release set with `--require-report-count 27`,
  `--require-unique-report-paths`, `--require-unique-smoke-report-paths`,
  `--require-unique-log-paths`, all 21 required action families, every current release-path proof
  flag, `--require-game-over-count 3`, and `--require-game-over-winner p1,p2`. It passes with 27/27
  reports, 716 product-surface commands, 812 mailbox events, `requireUniqueReportPaths: true`, an
  empty `duplicateReportPaths` list, `requireUniqueSmokeReportPaths: true`, an empty
  `duplicateSmokeReportPaths` list, `requireUniqueLogPaths: true`, empty
  `duplicateStdoutLogPaths`, `duplicateStderrLogPaths`, and `duplicatePlayerLogPaths` lists, three
  game-over reports, winners `p1`/`p2`, one report for every current release-path proof family, no
  failures, and status `incomplete-evidence`.

## LAN / Online / Visual Lab Decision Path

| Surface      | Implement now                                                                            | Explicitly defer as blocker                                                                                        | User-approved exclusion needed                                                     |
| ------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| LAN route    | No implementation in this run beyond LocalDev settings persistence.                      | Yes. Unity has no migrated LAN route, matchmaking flow, or LAN gameplay application of the visibility preferences. | Required if LAN is not part of the Unity replacement candidate.                    |
| Online route | No. Steam/Epic/platform SDK work remains prohibited and no online Unity route was added. | Yes. Unity has no migrated online route or online lifecycle evidence.                                              | Required if online is excluded from replacement-candidate scope.                   |
| Visual Lab   | No broad Visual Lab implementation in Unity.                                             | Yes. No Unity equivalent exists for the Electron Visual Lab surfaces.                                              | Required if Visual Lab is considered dev-only and excluded from replacement scope. |

This table is the 2026-05-13 decision snapshot. The 2026-05-14 Local PVP completion objective
explicitly keeps LAN, online, and Visual Lab excluded from this Local PVP audit; see the later
`2026-05-14 Built-Player Local PVP Full-Game 100/100 Refresh` section for the current
product-surface verdict.

## Superseded 2026-05-13 Blocker Snapshot

This is the pre-2026-05-14 blocker snapshot. The blocker list in this section is retained only as
historical evidence and is superseded by the 2026-05-14 product-surface report, which records
`Complete` for the declared Local PVP scope with recovery 13/13, settings 62/62, release-runtime
rules packaging covered, and zero failures.

1. Built Windows player fresh-launch evidence now passes for bounded LocalDev mailbox smoke paths.
   It proves fresh launch, bridge-backed Local PvP commands, live replay recording,
   export/import/review, market buy, reserve/cancel, discard, replenish, take-gems, and hashes
   `7d3f696c`, `5c804aa7`, `9704183f`, `94560a25`, `cecbc068`, `9e3b6f7c`,
   `d6dbea7a`, `411262df`, `5f3bf567`, `6b43d0c6`, `8668e7ab`, `e3a47e84`, `e5374467`,
   `851b6356`, `3f7290e`, `1a6afd3f`, `db7fb1b7`, `8399eadd`, `d2b51b3f`, and
   `efe66377`, plus reserved-discard hash `33909286`, reserved-buy hash `47c0e9db`,
   reserve-cancel hash `40bdddbf`, reserve-deck hash `da89d9e5`, Joker release-path hash
   `95c8a06c`, deck-reserve cancel release-path hash `62fa027f`, and audited replay release-path
   hash `f9eb9e83`.
   The latest strict unique-log-path aggregate matrix validates
   27/27 reports, 716 commands, `choose_royal`, `steal_gem`, `take_bonus_gem`,
   `activate_privilege`, `use_privilege`, `choose_boon`, `reroll_draft_pool`, and
   `discard_reserved` follow-up breadth, one built-player Joker release-path proof,
   one built-player privilege-cancel release-path proof,
   one built-player reserved-discard release-path proof, one built-player reserved-buy
   release-path proof, one built-player reserve-cancel release-path proof,
   one built-player reserve-deck release-path proof, one built-player deck-reserve cancel
   release-path proof,
   three deterministic built-player
   game-over proofs, one built-player replay release-path proof, and one built-player recovery
   release-path proof with continuation hash `8d4178f7`, plus one built-player settings
   release-path proof, one rulebook/restart chrome release-path proof, and one replay-review
   visible undo/redo release-path proof, plus replay release-path malformed-bootstrap and
   malformed-draft-bootstrap rejection, plus audited replay release-path invalid/corrupt/
   hash-mismatch/overwrite coverage with 9 retained mailbox responses, plus six representative invalid-action no-mutation/
   no-recording release-path rejections, plus one peek-modal open/close release-path replay proof
   with hash `8399eadd`, plus one recovered invalid-action no-mutation/no-recording proof with
   continuation hash `d2b51b3f`, plus one privilege-cancel export/import/review proof with hash
   `efe66377`, plus one reserved-discard export/import/review proof with hash `33909286`, plus
   one reserved-buy export/import/review proof with hash `47c0e9db`, plus one reserve-cancel
   export/import/review proof with hash `40bdddbf`, plus one reserve-deck export/import/review proof
   with hash `da89d9e5`, plus one Joker export/import/review proof with hash `95c8a06c`, plus one
   deck-reserve cancel export/import/review proof with hash `62fa027f`, but
   it is still bounded smoke evidence and does not resolve
   the final release-runtime packaging decision for the TypeScript bridge.
2. Unity product UI now has three seeded fresh Local PvP product-surface game-over proofs and a
   five-scenario bounded product-surface matrix, but it still lacks broad arbitrary player-driven
   coverage. The TypeScript bridge applies every
   committed golden replay event and one freshly simulated deterministic Local PvP game-over replay
   as commands, and Unity EditMode now drives three seeded product-surface matches to game over with
   export/import/review hash checks. Configured UI parity still loads fixture revisions for many
   gameplay states and this small deterministic seed sweep is not enough to certify arbitrary Local
   PvP through the full Unity product surface.
3. Supported Electron product scope is not fully implemented or explicitly excluded. LAN route,
   online route, Visual Lab/dev surfaces, and remaining chrome/review surfaces need Unity equivalents or
   explicit user-approved exclusions under
   `docs/migration/unity-migration-governance.md`.
4. The replay oracle covers the declared manifest tags and 65 rejection cases, and Unity now proves
   those 65 cases reject through the live bridge without state or replay-recording mutation, including
   `edge:CANCEL_RESERVE:no-pending` at hash `3b87795f` and
   `edge:SELECT_BUFF:p2-before-p1` at hash `5c903209`, plus
   `edge:TAKE_GEMS:no-take-3` at hash `8e546f4c`, plus coordinate-boundary hashes
   `e1b5e1bf`, `329600a9`, `fd6d5832`, `6173696c`, and `d8141986`, plus
   `edge:GAME_OVER:action-after-winner` at hash `4b6ab7ec`, plus
   `edge:BUY_CARD:joker-without-color` at hash `d0a0e459`, plus
   `edge:INITIATE_BUY_JOKER:reserved-not-owned` at hash `b5d9cbbf`. Focused bridge-envelope guards
   now also reject wrong-actor market buy, wrong-actor Joker initiation/color-follow-up, wrong-actor reserve initiation/resolution/cancel,
   wrong-actor deck-reserve initiation/resolution, wrong-actor reserved-buy ownership-envelope,
   wrong-actor reserved discard, wrong-actor privilege activation/use/cancel, and wrong-actor
   follow-up bonus/discard/steal without state or replay mutation, repeated live discard now
   resolves from `DISCARD_EXCESS_GEMS` to `IDLE` after the inventory reaches the legal limit, and
   valid bonus/steal follow-ups now resolve from `BONUS_ACTION` / `STEAL_ACTION` to `IDLE` with
   expected board/inventory mutation and Replay vNext recording, and valid royal selection now
   resolves from `SELECT_ROYAL` to `IDLE` with `r91-ro` moved to P1. The governance
   gate still asks for every required action, phase, rejection path, and edge case, so broader
   actor-ordering, online-mode, remaining release-path, and remaining edge coverage are still
   missing.
5. Replay import/export/review is implemented for covered LocalDev JSON paths, live command
   recording, hash preservation, undo/redo review, Joker/reserved-buy review, deck-peek modal
   review, three seeded fresh product-surface game-to-game-over replays, the five-scenario bounded
   product-surface matrix, release-path invalid-file recovery cases in both EditMode and the built
   Windows player, built-player recovery save/load/continue replay review, built-player
   replay-review visible undo/redo navigation, built-player peek-modal export/import/review,
   built-player recovered invalid-action export/import/review, built-player privilege-cancel
   export/import/review, built-player reserved-discard export/import/review, built-player
   reserved-buy export/import/review, built-player deck-reserve cancel export/import/review, and the
   committed 65-case invalid-action
   no-recording manifest. Broader
   release-path and packaged-player replay handling beyond the covered LocalDev paths are not yet
   proven.
6. Settings, chrome, and recovery have covered-path evidence, including locale, surface, sound, LAN opponent
   card/gem visibility preference reload, built-player settings save/load proof without gameplay
   mutation, built-player rulebook/restart proof without gameplay mutation, live replay stream recovery after reopen, built-player recovery save/load/continue proof, and one recovered invalid-action no-mutation/no-recording proof, but broader release-startup recovery and invalid-action
   recovery breadth across the full product scope remain
   incomplete.

## Required Self-Audit Answers

1. Did this report claim a demo, prototype, sidecar slice, vertical slice, guided replay, scoped
   parity, or 90% parity as completion? No. Current status is `Complete` for the declared Local PVP
   product surface, based on the 2026-05-14 packaged-runtime product-surface report.
2. Did this run duplicate gameplay rules outside `packages/shared`? A partial C# reducer already
   exists as migration evidence, but this run uses a governed TypeScript bridge as the authoritative
   rules boundary for covered live paths. Bridge tests hash-check every golden replay event when
   applied as commands, plus one freshly simulated Local PvP game-over replay. Unity product tests
   also drive three seeded fresh Local PvP matches to game over through visible semantic commands.
3. Did live Unity gameplay advance by replay checkpoints or snapshot replacement? No live Core or
   Presentation `ReplaceSnapshot` hits remain. Replay fixtures are still retained as parity setup and
   audit evidence, but the final Local PVP completion claim rests on built-player product-surface and
   packaged-runtime evidence.
4. Did every migration artifact connect back to Electron, `packages/shared`, replay fixtures, or
   deterministic hashes? Yes for created artifacts. Historical gaps are either closed by the
   2026-05-14 product-surface report or explicitly recorded as LAN, Online, and Visual Lab
   user-approved exclusions from this Local PVP scope.
5. Did this run add or run validation commands? Yes; validation evidence is listed above.
6. Did this run leave any mock-only path that could be mistaken for real migration progress? The
   docs distinguish configured fixture-backed evidence from full-product completion.
7. Did this run modify Electron behavior to make Unity pass? No Electron gameplay or UX behavior was
   changed for Unity parity.
8. Did this run commit any SDK binary, app ID, credential, partner file, Unity cache, or build
   output? No such files were staged or committed; generated outputs remain under ignored artifact
   paths.

## Stop Condition

The correct final status for the declared Local PVP run is `Complete`. The stop condition is the
2026-05-14 product-surface report returning `Complete` with zero failures, recovery 13/13, settings
62/62, visual contracts 5/5, release-runtime rules packaging covered, and only LAN, Online, and
Visual Lab recorded as user-approved exclusions.

## Superseded 2026-05-13 Final Validation Refresh

Historical status at this checkpoint: `Incomplete`. This refresh is retained as pre-completion
evidence and is superseded by the 2026-05-14 packaged-runtime product-surface completion report.

Repo/local gates refreshed in this continuation:

- Passed: `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`
  (73/73 after launcher exit-code, timeout, success-flag, required-flag metadata, and replay
  release-path no-mutation tests),
  `node --check tools/migration/summarize-unity-built-player-smokes.mjs`,
  retained aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-required-flag-metadata-refresh.json`
  (37/37 reports with all required release-path metadata flags set),
  focused replay no-mutation aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-nomutation.json`
  (one fresh built-player report with `--require-replay-release-path-no-mutation`, audited mailbox
  response/digest checks, and eight rejected-import no-mutation case records),
  `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` (35/35),
  `verify-replay-parity.ts` (`fixtureCount: 11`, `rejectionCaseCount: 65`, no coverage gaps),
  Unity catalog export/check, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`,
  `pnpm build`, `pnpm release:check`, `pnpm boundaries:check`, `pnpm architecture:check`,
  `pnpm deps:check`, `pnpm desktop:check`, `pnpm secrets:check`, and `git diff --check`.
- No live `ReplaceSnapshot` hit remains under Unity Core/Presentation, and no
  `GemDuelVerticalSlice` or superseded vertical-slice completion wording remains under Unity
  production scripts.
- Ignored-artifact proof was refreshed for the launcher-args refreshed built-player union and the
  new Electron/Unity parity artifact directories.

Unity evidence refreshed in this continuation:

- The first timestamped EditMode attempt
  `artifacts/unity/editmode-20260513T1242-final.log` reached the Unity test runner but produced no
  result file before the 22-minute guard expired; PID 75824 was stopped.
- The longer rerun produced real 90/91 evidence at
  `clients/unity/artifacts/unity/editmode-final-validation-20260513-results.xml`. The single
  failing test was `RoguelikeDraftProductSurfaceSmokeRerollsSelectsAndReviewsLiveReplay`, where the
  smoke selected both draft buffs, entered `IDLE`, and then attempted a three-gem take under an
  active no-take-3 buff.
- `LocalDevProductSurfaceSmoke` now resolves the active buff id through the Unity catalog before
  filtering candidate gem lines, so the smoke driver honors `passive.noTake3` without changing the
  TypeScript oracle, Electron UX, or shared gameplay contracts.
- Focused validation
  `artifacts/unity/editmode-draft-smoke-final-fix-20260513-results.xml` passed 1/1.
- Full Unity EditMode validation
  `artifacts/unity/editmode-final-validation-fixed-20260513-results.xml` passed 91/91 from
  `2026-05-13 13:40:44Z` to `14:08:55Z`.
- Windows build evidence passed: `artifacts/unity/build-final-validation-fixed-20260513.log`
  records `Build Finished, Result: Success.` and batchmode return code 0.

Electron/Unity parity evidence refreshed in this continuation:

- The first full `pnpm parity:electron-unity` attempt timed out after about 604 seconds. Partial
  artifacts are under `artifacts/electron-unity-parity/2026-05-13T12-14-12-995Z`; the interrupted
  runner child processes were killed and the stale runner lock was removed. This attempt is not a
  passing parity gate and was superseded by the later longer rerun.
- `pnpm parity:electron-unity -- --skip-unity --viewports "1366x768"` passed only as
  browser-runner cleanup evidence at
  `artifacts/electron-unity-parity/2026-05-13T12-26-01-458Z`. Its summary records
  `unity.ok: false`, `Unity capture skipped by --skip-unity.`, and 27 blocker rows.
- The longer full `pnpm parity:electron-unity` rerun passed after about 805 seconds and wrote
  `artifacts/electron-unity-parity/2026-05-13T14-15-37-411Z`. The retained
  `runner-summary.json` records `unity.ok: true`, no Unity blocker, `counts.Equivalent: 54`,
  viewports `1920x1080` and `1366x768`, and browser process guard counts of `1/14/1` with the same
  pre-existing single orphan inside the configured budget.

Built Windows player evidence status:

- The strongest retained built-player ledger remains
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-launcher-args-refreshed-union.json`:
  37/37 reports, 1076 commands, 1189 mailbox events, 421 valid retained audit response files,
  47 valid audit response digests, all 21 required action families, every current release-path
  proof family, six game-over reports, winners `p1`/`p2`, unique evidence-path guards,
  launcher-argument validation, no failures, and status `incomplete-evidence`.
- This remains bounded LocalDev built-player evidence. It does not prove arbitrary full
  product-surface Local PvP and does not solve release-runtime TypeScript bridge packaging.

## Superseded 2026-05-14 Initial Built-Player Local PVP Full-Game 100/100 Refresh

Historical status for this initial 04:11 built-player UI refresh: `Incomplete`. This section is
retained because it records the first 100/100 built-player UI proof, but its blocker status is
superseded by the later 2026-05-14 packaged-runtime product-surface report.

The Local PVP built-player UI gate now has a retained 100-game full-game artifact:

- Windows player build evidence:
  `artifacts/unity/build-local-pvp-fullgame-runner-20260514-reservedjoker-player.log`, with
  `Build Finished, Result: Success.`.
- Machine-readable report:
  `artifacts/electron-unity-parity/local-pvp-built-player-full-game/2026-05-14T04-11-55-678Z/local-pvp-built-player-full-game-suite-report.json`.
- HTML report:
  `artifacts/electron-unity-parity/local-pvp-built-player-full-game/2026-05-14T04-11-55-678Z/local-pvp-built-player-full-game-suite-report.html`.
- Aggregate result: `ok: true`, `verdict: BuiltPlayerUiComplete`, `requestedMatches: 100`,
  `executedMatches: 100`, `passed: 100`, `failed: 0`, and
  `suiteTraceHash: 3f6904c25c7c1632970cab956b2b2aba5e7b09b2f31860841004c955d69977d1`.
- Covered action families: `INIT`, `TAKE_GEMS`, `BUY_CARD`, `INITIATE_BUY_JOKER`,
  `INITIATE_RESERVE`, `RESERVE_CARD`, `REPLENISH`, `TAKE_BONUS_GEM`, `SELECT_ROYAL_CARD`,
  `STEAL_GEM`, and `DISCARD_GEM`.
- Covered phase edges: 18 observed FSM edges, including Joker color selection, reserve waiting-gem,
  royal selection, steal action, bonus action, discard-excess-gems, and return-to-idle transitions.
- Performance summary: 20746 recorded UI steps, average step duration 92 ms, p95 190 ms, max
  1064 ms.
- Each match ran through the built Windows Unity player using deterministic Electron-legal plans and
  visible Unity target geometry, not fixture replay playback. Per-step evidence records visible
  state, target geometry, normalized click/drag point, phase, actor, action family, state hash,
  live replay event count, legality, failure reason, and replay hash fields. Replay
  export/import/review final-hash checks are included for every completed match:
  `replayExport.ok`, `replayReview.ok`, final-state hash, and replay-event-count checks are all
  100/100.

This closes the arbitrary 100-game built-player Local PVP UI evidence gap recorded in the previous
refresh. The regenerated product-surface coverage report imports that retained full-game suite as
first-class evidence:

- Machine-readable coverage report:
  `artifacts/unity/product-surface-coverage/unity-product-surface-coverage-report.json`.
- HTML coverage report:
  `artifacts/unity/product-surface-coverage/unity-product-surface-coverage-report.html`.
- Historical coverage verdict at this checkpoint: `Blocked`.
- Covered required product-surface rows at this checkpoint: entrypoints 6/6, action families 15/15,
  phase edges 11/11, and visual contracts 5/5.
- Remaining product-surface rows at this checkpoint: recovery 7/13 and settings tuples 10/62.
- LAN, online, and Visual Lab are recorded as user-approved exclusions for this Local PVP completion
  attempt.

This checkpoint did not close the Local PVP migration because the artifact set did not yet prove the
remaining recovery matrix, settings matrix, or release-runtime rules packaging gate.

Superseded replacement-candidate blockers from this checkpoint:

- At this checkpoint, recovery coverage remained incomplete against the final completion gate: 7/13
  required cases were covered; missing cases were mailbox timeout, malformed bridge response,
  corrupt mailbox, restart during pending phase, restart after replay export, and restart after
  settings change.
- At this checkpoint, settings pairwise/3-wise coverage remained incomplete against the final
  completion gate: 10/62 required tuples were covered.
- At this checkpoint, `TypeScriptGameRulesEngine` remained a LocalDev/evidence bridge and the final
  release-runtime packaging decision was unresolved.

## 2026-05-14 Final Packaged-Runtime Completion Refresh

The later packaged-runtime refresh supersedes the blocker snapshot above. The authoritative
completion artifacts are:

- `artifacts/electron-unity-parity/local-pvp-built-player-full-game-packaged-runtime/2026-05-14T06-39-55-332Z/local-pvp-built-player-full-game-suite-report.json`
- `artifacts/unity/rules-runtime-package/unity-rules-runtime-package-report.json`
- `artifacts/unity/product-surface-coverage/unity-product-surface-coverage-report.json`

Current verdict: `Complete` for the declared Local PVP product surface. The final coverage report
records entrypoints 6/6, action families 15/15, phase edges 11/11, recovery 13/13, settings 62/62,
visual contracts 5/5, release-runtime rules packaging covered, 3,610 oracle events, 1,001 rejected
oracle events, and zero failures. LAN, Online, and Visual Lab remain user-approved exclusions from
this Local PVP completion scope.
