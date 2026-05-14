# Current Unity Migration Task Plan

Last updated: 2026-05-14 Local PVP product-surface Complete evidence

## Goal

Execute the full Unity migration governed by `docs/migration/unity-migration-governance.md`, with
Electron and `packages/shared` remaining the current gameplay and UX oracle until every mandatory
parity gate passes.

This continuation records the built Windows player Local PVP migration as complete for the declared
Local PVP product surface. The retained final evidence includes the packaged-runtime 100-game
deterministic built-player suite, replay export/import/review hash coverage, legal and illegal action
families, phase edges, settings and recovery matrices, visual/layout/perf evidence, and release
runtime rules packaging. LAN, Online, and Visual Lab remain the only user-approved exclusions.

Status note: any earlier `Incomplete` or `Blocked` status retained below is a historical
pre-completion snapshot unless the paragraph explicitly says otherwise. The current Local PVP status
is governed by the 2026-05-14 product-surface report recorded in
`docs/migration/unity-full-migration-completion-report.md`.

## Non-Goals

- Do not use any historical vertical-slice, scoped-parity, or 90-percent parity document as the
  active execution contract.
- Do not claim full migration completion while live Unity gameplay still depends on replay
  checkpoints, fixture stepping, mock-only data, or future work.
- Do not add Steamworks, Epic Online Services, app IDs, product IDs, partner files, credentials,
  upload outputs, Unity cache, or build artifacts.
- Do not change Electron behavior or shared contracts merely to make Unity pass.
- Do not replace the authoritative Electron/shared TypeScript rules with a different runtime, SDK,
  or server. The Windows release runtime may package the governed TypeScript bridge and catalog as
  built-player evidence, but it must not change Electron behavior or shared contracts.
- Do not treat `GameReducer` checkpoint-derived helpers as live gameplay; they remain replay/audit
  helpers only.
- Do not add unbounded seed-sweep claims or fixture-backed product UI claims as replacement
  evidence.

## Files Allowed To Change

- `docs/migration/**`
- `docs/adr/**`
- `docs/archive/README.md`
- `docs/archive/unity-next-run-audit-note-2026-05-11.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-11.md`
- `docs/governance/dependency-runtime-governance.md`
- `docs/README.md`
- `apps/desktop/electron/__tests__/runtimeConfig.test.ts` only to keep the runtime-config policy key list aligned with governed LocalDev bridge env additions; no Electron gameplay or UX behavior may change.
- `packages/shared/src/replay/**`
- `packages/shared/src/logic/actions/__tests__/**`
- `packages/shared/src/runtimeConfigPolicy.js`
- `tools/governance/contract-registry.snapshot.json`
- `tools/migration/**`
- `tools/scripts/**/__tests__/**`
- `fixtures/replay-golden/**`
- `clients/unity/Assets/GemDuel/Scripts/**`
- `clients/unity/Assets/GemDuel/Scenes/**`
- Unity `.meta` files paired with renamed Unity source or scene files

## Files Forbidden To Change

- Steam/Epic SDK files, partner-only files, credentials, product IDs, app IDs, or upload artifacts.
- Unity generated cache/output directories such as `Library/`, `Temp/`, `Obj/`, `Logs/`,
  `UserSettings/`, `Builds/`, and committed build outputs.
- Electron gameplay, desktop UX, shared contracts, or parity runner expectations unless the change
  is documentation-only or explicitly records Electron as the unchanged oracle.
- `apps/desktop/**` unless a later task gives explicit parity-test-only or build-only
  justification.
- `packages/shared/src/logic/actions/**` runtime files unless the bug exists in the
  TypeScript/Electron oracle, the fix is product-correct independent of Unity, tests cover the
  shared behavior, and migration docs record the rationale.
- Generated governance snapshots unless the owning script is intentionally run and the output is
  reviewed.

## 2026-05-12 Joker Reserved-Source Rejection Follow-Up

Allowed source scope for this follow-up is intentionally narrow: `tools/migration/**`,
`fixtures/replay-golden/**`, and
`clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`. Documentation updates
may touch the migration docs and the 2026-05-12 next-run audit note. The only intended coverage
addition is the TypeScript-oracle-derived `edge:INITIATE_BUY_JOKER:reserved-not-owned` rejection
case, proving that a visible market Joker cannot be misrouted through the reserved-card source
boundary. This does not authorize shared gameplay runtime or Electron gameplay/UX changes.

## 2026-05-12 Joker Wrong-Actor Live Bridge Follow-Up

Allowed source scope for this follow-up is test-only:
`clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`. Documentation updates
may touch the migration docs and the 2026-05-12 next-run audit note. The intended coverage addition
is a Unity live-bridge no-mutation/no-recording guard for a wrong-actor `INITIATE_BUY_JOKER`
command against a visible market Joker. This closes one named Joker actor evidence gap at the bridge
envelope boundary; it is not a replay-oracle manifest case because actor ownership is carried by the
bridge command envelope, not by the `GameAction` payload. This does not authorize shared gameplay
runtime, Electron gameplay/UX, bridge runtime behavior, or manifest inflation.

## Mandatory Gate Map

| Gate | Required result                                                           | Planned evidence                                                          |
| ---- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 0    | Supersede old slice-era docs and remove active old prompt authority       | Superseded banners, `docs/README.md`, anti-slice grep review              |
| 1    | Unity rules-engine boundary ADR                                           | `docs/adr/0012-unity-rules-engine-boundary.md`                            |
| 2    | Product scope map and action/FSM coverage matrix                          | `unity-product-scope-map.md`, `unity-action-fsm-coverage-matrix.md`       |
| 3    | Rules engine or bridge applies commands from live state                   | TypeScript oracle bridge and Unity boundary wiring, with checkpoint audit |
| 4    | Replay corpus covers required actions, phases, rejections, and edge cases | Manifest coverage status and `verify-replay-parity` result                |
| 5    | Unity product UI covers supported Electron scope                          | Unity controller, semantic targets, parity matrix evidence                |
| 6    | Replay, settings, persistence, restart, and recovery                      | Unity persistence/recovery state plus replay import/export status         |
| 7    | LocalDev platform services remain adapters                                | LocalDev interface/status, secrets/cache hygiene                          |
| 8    | Electron/Unity full parity matrix                                         | `unity-full-parity-matrix.md` plus runner artifacts                       |
| 9    | Repo, replay, Unity editor, and build validation                          | Command log in `unity-full-migration-completion-report.md`                |

## Acceptance Criteria

- Every mandatory work-inventory document exists.
- Every non-debug `GameAction` and FSM phase is mapped.
- Unity live gameplay uses a governed rules boundary, not production checkpoint replacement.
- Unity replay import/export/review uses real Replay vNext JSON round trips and hash checks instead
  of fixture-only presentation playback.
- Unity exposes LocalDev replay import/export through visible controls, not only automation helpers,
  and records the LocalDev replay file persistence status in automation evidence.
- Unity records successfully applied bridge-backed live gameplay commands into a Replay vNext stream
  that can be exported, reimported, and reviewed without relying on a preauthored fixture.
- Unity LocalDev recovery restores live bridge-backed game state after close/reopen and can continue
  applying rules-engine commands from the restored state.
- Unity LocalDev recovery preserves the in-progress live Replay vNext stream and appends later
  bridge-backed commands after restore.
- Unity settings persist locale, surface theme, sound, and LAN opponent card/gem visibility
  preferences, then reload those values on a reopened controller.
- Unity rejects empty, gold-cell, gapped, and wrong-phase take-gems commands without changing state
  hashes or appending live replay events.
- Unity rejects empty-bag and wrong-phase replenish commands without changing state hashes or
  appending live replay events.
- Unity rejects wrong-color, empty-cell, and wrong-phase bonus-gem commands without changing state
  hashes or appending live replay events.
- Unity rejects discard-gem not-owned and wrong-phase commands without changing state hashes or
  appending live replay events.
- Unity rejects steal-gem gold, not-owned, and wrong-phase commands without changing state hashes or
  appending live replay events.
- Unity rejects unavailable and wrong-phase draft buff selections without changing state hashes or
  appending live replay events.
- Unity rejects wrong-phase reserve cancel, privilege cancel, and draft reroll commands without
  changing state hashes or appending live replay events.
- Unity rejects direct Joker `BUY_CARD` bypass commands before bonus-color selection without
  changing state hashes or appending live replay events.
- Unity rejects wrong-actor Joker initiation and color-follow-up commands through the live bridge command envelope
  without changing state hashes or appending live replay events.
- Unity rejects missing-pending and pending-mismatched Joker color-selection `BUY_CARD` commands
  without changing state hashes or appending live replay events.
- Unity completes an affordable Joker market buy through visible bonus-color controls, records
  `initiate_buy_joker` plus `buy_card` in Replay vNext, exports the live replay, and reimports it
  for review without changing the reviewed final hash.
- Unity completes an affordable reserved-card preview buy, records `buy_card` with `source:
reserved` in Replay vNext, exports the live replay, and reimports it for review without changing
  the reviewed final hash.
- The committed replay/hash oracle verifies `joker-buy` coverage against an actual
  `initiate_buy_joker` followed by a matching `buy_card`, and verifies `reserved-buy` coverage
  against an actual Replay vNext `buy_card` event with `source: reserved`.
- The committed replay/hash oracle verifies `reserve-cancel`, `reserve-deck`,
  `discard-reserved`, `privilege`, `peek-modal`, `draft-reroll`, and `draft-p2-reroll` coverage
  tags against actual Replay vNext event sequences. `draft-p2-reroll` requires the P1 selection,
  P2 reroll, and P2 selection ordering.
- The committed replay/hash oracle verifies both royal handoff and royal extra-turn semantics:
  `royal-handoff` requires the event after `select_royal` to belong to the next player, while
  `extra-turn` requires the event after `select_royal` to remain with the same actor.
- The committed replay/hash oracle verifies `fixtures/replay-golden/rejection-manifest.json` with
  65 hash-locked wrong-phase, resource, ownership, mismatch, follow-up, modal, coordinate-boundary,
  game-over, Joker missing-color, Joker reserved-source, and reproducible derived-state rejection cases that preserve
  source or derived-state revision hashes.
- Unity EditMode verifies every committed rejection-manifest case through the live
  `IGameRulesEngine` bridge by priming the TypeScript replay-state oracle revision, applying the
  invalid command, and checking unchanged replay-state hashes plus unchanged live replay recording
  counts.
- The TypeScript Unity rules bridge applies every committed golden replay event plus one freshly
  simulated deterministic Local PvP game-over replay as commands with per-step replay-state hash
  checks. This is rules-boundary evidence, not full Unity product UI completion.
- Unity EditMode now drives three seeded fresh product-surface Local PvP games from semantic start
  to game over, verifies live replay recording hashes, exports Replay vNext JSON, imports each
  replay into a separate controller, and reviews to the same final hash. This strengthens the
  product-surface proof, but does not close the broader arbitrary full-scope product UI gate.
- LocalDev recovery restores a pending Joker color-selection state with the bridge session and live
  replay stream intact, then continues the recovered buy through `SELECT_CARD_COLOR`.
- Unity rejects privilege activation with no charge or no valid board target without changing state
  hashes or appending live replay events.
- Unity rejects privilege use with no charge or an invalid board target without changing state hashes
  or appending live replay events.
- Unity rejects unavailable, wrong-actor, and wrong-phase royal selections without changing state
  hashes or appending live replay events.
- Unity rejects deck-reserve empty-deck, missing-Gold, and full-reserve-row commands without
  changing state hashes or appending live replay events.
- Unity rejects reserve-card missing-Gold, non-Gold, pending-mismatch, and full-reserve-row
  commands without changing state hashes or appending live replay events.
- Unity rejects unaffordable reserved-card buy commands without changing state hashes or appending
  live replay events.
- Unity rejects discard-reserved not-owned and wrong-phase commands without changing state hashes or
  appending live replay events.
- Unity routes the player-facing deck-peek active buff and modal close through the rules bridge
  with visible targets and EditMode evidence.
- Unity rejects invalid deck-peek and modal-close live rules commands without changing state hashes
  or appending live replay events.
- Unity rejects wrong-phase deck-peek commands without changing state hashes or appending live
  replay events.
- Unity rejects blocked peek-modal close commands without changing state hashes or appending live
  replay events.
- Replay/hash parity passes for committed coverage, and uncovered required paths are recorded as
  blockers rather than completion.
- Electron/Unity semantic, click, hover, state-transition, screenshot, and viewport parity is run
  when the required tools are available.
- The final migration report status is `Complete` only if every mandatory gate passes; otherwise it
  is `Incomplete` or `Blocked` with exact remaining blockers.
- Built Windows player proof starts the freshly built executable under
  `artifacts/unity/build/windows/`, enters Local PvP through the product surface or a documented
  LocalDev automation entrypoint, applies real `IGameRulesEngine` commands, records stdout/log path,
  exit code, product state summary, replay hash summary, and failure reason in ignored
  machine-readable artifacts.
- Bounded product-surface Local PvP coverage uses deterministic representative seeds and action
  families. Each successful run proves fresh Local PvP start through `GemDuelGameController` and
  `IGameRulesEngine`, no fixture replay as gameplay driver, live replay recording,
  export/import/review hash preservation, and no checkpoint state replacement.
- Release-path replay behavior covers invalid JSON, unsupported schema version, missing file,
  corrupted replay summary, replay hash mismatch, overwrite/reload behavior, and clean recovery
  without gameplay-state mutation.
- LocalDev bridge runtime hardening covers bridge availability checks, `pnpm`/`vite-node` missing
  dependency messages, timeout handling, temp-file cleanup, repository-root resolution, structured
  bridge errors, and exclusion of platform/user IDs from gameplay hashes.
- LAN, online, and Visual Lab remain `Incomplete` or `Blocked` unless implemented with validation
  or explicitly excluded by user-approved policy.

## 2026-05-11 Continuation Result

- Built Windows player smoke now has a governed LocalDev automation entrypoint and launcher:
  `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs` and
  `tools/migration/run-unity-built-player-smoke.mjs`. Direct child-process launch from the Windows
  player failed for both `cmd.exe`/`pnpm.CMD` and direct `node.exe` with `Native error= Success`, so
  this run added a governed LocalDev request/response mailbox transport. A follow-up smoke exposed
  a Windows response-file sharing race, so response publication is now atomic and Unity mailbox
  response read/delete uses bounded retry and best-effort cleanup. The first passing report
  `artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json` is `ok: true`:
  the Windows player starts fresh, enters Local PvP through the documented automation entrypoint,
  applies 12 real bridge-backed commands, records live replay events, exports/reimports/reviews the
  replay, covers `take_gems`, `buy_card`, and `replenish`, and preserves final hash `7d3f696c`.
- Bounded product-surface Local PvP evidence passed for five deterministic scenarios in
  `artifacts/unity/product-surface-local-pvp-matrix-20260511.json`, with live replay
  export/import/review hash preservation and no fixture gameplay driver or checkpoint state
  replacement. The covered action families are `buy_card`, `cancel_gem_selection`, `discard_gem`,
  `replenish`, `reserve_card`, and `take_gems`, so the report remains `incomplete-evidence`.
- Replay release-path error recovery passed in
  `clients/unity/artifacts/unity/editmode-replay-release-path-20260511-results.xml`, covering
  invalid JSON, missing file, unsupported schema version, corrupted summary, hash mismatch,
  overwrite/reload, and clean recovery without gameplay-state mutation.
- LocalDev bridge hardening now covers repository-root walking from built-player data paths,
  explicit `GEMDUEL_PNPM_PATH`, missing `pnpm`/`vite-node` messages, timeout/error wrapping,
  output-file bridge responses, atomic mailbox response publication, retrying mailbox response
  reads, best-effort response cleanup, the built-player mailbox transport, and policy documentation
  for the new local tooling env surface.

## 2026-05-11 Product-Surface Breadth Follow-Up

Before additional source changes, this follow-up is limited to the existing LocalDev/evidence
automation boundary:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevProductSurfaceSmoke.cs`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- migration documentation and the next-run audit note

The intended change is to broaden the bounded fresh Local PvP matrix with a market reserve/cancel
product-surface path and catalog-aware market-buy/resource targeting, while preserving the same
requirements: fresh live Local PvP start, no fixture replay as gameplay driver, no checkpoint state
replacement, live Replay vNext recording, export/import/review hash preservation, and `Incomplete`
status until remaining product-scope and release-runtime blockers are closed.

## 2026-05-12 Replay Review Navigation Follow-Up

Before additional source changes, this follow-up is limited to a built-player release-path replay
review navigation proof. The additional allowed files for this slice are:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReplayReviewReleasePathSmoke.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReplayReviewReleasePathSmoke.cs.meta`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelGameController.cs` only if the smoke
  needs an automation wrapper over existing replay-review visible controls; no gameplay reducer or
  Electron behavior may change.
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- Required migration docs and the next-run audit note.

The intended change is to export a live bridge-backed Local PvP replay from a fresh start, import it
into a separate review controller, drive replay undo/redo review navigation through the existing
review path, prove final-hash stability, and prove the source live game state and live replay stream
are not mutated by review navigation. This is release-path evidence only; it does not close LAN,
online, Visual Lab, broad arbitrary product-surface, or final runtime-packaging blockers.

Result: the focused EditMode guard
`clients/unity/artifacts/unity/editmode-replay-review-release-path-smoke-20260512-results.xml`
passed 1/1, the rebuilt Windows player passed
`artifacts/unity/build-replay-review-release-path-smoke-20260512.log`, and
`artifacts/unity/built-player-smoke/smoke-2026-05-12T03-32-18-999Z.launcher.json` passed with exit
code 0 and no timeout. The nested replay-review release-path report exports a live bridge-backed
replay from a fresh LocalDev game, imports it into a separate review controller, drives visible
redo/undo replay controls through revisions `0 -> 1 -> 2 -> 1 -> final -> final-1 -> final`,
restores the first redo hash after undo, preserves final hash `db7fb1b7`, and verifies the source
live game hash and live replay event count remain unchanged. The refreshed matrix
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-replay-review.json`
validates 14/14 reports, 525 product-surface commands, 552 mailbox events, one replay release-path
report, one recovery release-path report, one settings release-path report, one chrome
release-path report, one replay-review release-path report, and status `incomplete-evidence`.
The first full Unity EditMode rerun exposed only default NUnit timeout limits in two existing long
deterministic evidence tests; after adding explicit timeouts, the rerun
`clients/unity/artifacts/unity/editmode-replay-review-full-rerun-20260512-results.xml` passed
70/70. Status remains `Incomplete`.

## 2026-05-12 Completion Audit Refresh

Before any further implementation work, this follow-up is limited to the existing archive audit:

- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-11.md`

The intended change is to refresh the prompt-to-artifact checklist after the built-player
replay-review release-path follow-up so the audit matches the actual 14-report aggregate, the
70/70 Unity EditMode rerun, the current Windows build evidence, and the still-open blockers. This is
documentation-only and must not convert bounded LocalDev mailbox evidence into replacement-candidate
completion.

## 2026-05-12 Bridge Failure Boundary Test Follow-Up

Before source changes, this follow-up is limited to LocalDev bridge hardening tests:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`

The intended change is to add focused EditMode coverage for structured bridge timeout/execution
failure mapping and mailbox unavailable/timeout temp-file cleanup. It must not change bridge runtime
behavior, shared gameplay logic, Electron behavior, or release-runtime packaging strategy.

Result: the focused EditMode guards
`clients/unity/artifacts/unity/editmode-bridge-exception-mapping-20260512-results.xml` and
`clients/unity/artifacts/unity/editmode-bridge-mailbox-failures-20260512-results.xml` each passed
1/1. They verify `BRIDGE_TIMEOUT`/`BRIDGE_EXECUTION_FAILED` mapping from the Unity rules-engine
boundary, clear missing-mailbox failure messaging, mailbox timeout failure messaging, and cleanup of
partial mailbox temp/response files.

## 2026-05-11 Built-Player Breadth Follow-Up

Before additional source changes, this follow-up remains limited to the existing LocalDev/evidence
automation boundary:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevProductSurfaceSmoke.cs`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- migration documentation and the next-run audit note

The intended change is to expose the existing `IdleActionPreference` smoke option through the
built-player automation entrypoint, then run a reserve-focused Windows-player smoke that still proves
fresh Local PvP start through `GemDuelGameController` and `IGameRulesEngine`, no fixture replay
gameplay driver, no checkpoint state replacement, live replay recording, export/import/review hash
preservation, stdout/log/report capture, and `Incomplete` status until product-scope and
release-runtime blockers are closed.

Result: the built-player launcher now accepts `--idle-action-preference`, passes it into
`BuiltPlayerSmokeRunner`, and preserves the preference in the machine-readable report. The rebuilt
Windows player passed `artifacts/unity/build-built-player-preference-20260511.log`. Two additional
Windows-player fresh-launch reports passed:

- `artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json`: 30 real
  bridge-backed commands, live replay export/import/review, action families `buy_card`,
  `click_board_cell`, `discard_gem`, `replenish`, and `take_gems`, final hash `5c804aa7`.
- `artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json`: reserve-focused
  run with 14 real bridge-backed commands, live replay export/import/review, action families
  `reserve_card` and `cancel_gem_selection`, final hash `9704183f`.

This broadens built-player LocalDev evidence but remains bounded smoke evidence, not arbitrary full
product-surface play or a final release-runtime packaging decision.

Follow-up result: `tools/migration/summarize-unity-built-player-smokes.mjs` now validates and
aggregates the three successful built-player launcher reports into
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260511.json`. The matrix check
passed with 3/3 reports, 56 bridge-backed commands, 59 mailbox events, action families `buy_card`,
`cancel_gem_selection`, `click_board_cell`, `discard_gem`, `replenish`, `reserve_card`, and
`take_gems`, and hashes `7d3f696c`, `5c804aa7`, and `9704183f`. The matrix status remains
`incomplete-evidence`.

## 2026-05-11 Built-Player Replay Release-Path Follow-Up

Before additional source changes, this follow-up is limited to built-player replay path evidence:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReplayReleasePathSmoke.cs`
- the paired Unity `.meta` file
- `tools/migration/run-unity-built-player-smoke.mjs`
- migration documentation and the next-run audit note

The intended change is to make the existing Windows-player smoke optionally run the replay
release-path error/recovery matrix inside the built player after fresh Local PvP live replay
recording exists. This must reuse `GemDuelGameController` and the current LocalDev TypeScript bridge,
write ignored file-path artifacts under `artifacts/unity/`, and keep status `Incomplete` until
broader product-scope and release-runtime blockers are closed.

Result: `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReplayReleasePathSmoke.cs` now
runs the release-path replay file matrix inside the built player when
`tools/migration/run-unity-built-player-smoke.mjs --include-replay-release-path` is used. The rebuilt
Windows player passed `artifacts/unity/build-replay-release-path-smoke-20260511.log`. The report
`artifacts/unity/built-player-smoke/smoke-2026-05-11T23-50-03-972Z.launcher.json` passed with a
fresh Local PvP live replay, 8 bridge-backed commands, replay hash `95c8a06c`, invalid JSON,
missing file, unsupported schema, corrupted summary, final hash mismatch, failed overwrite load,
and valid overwrite/reload/review coverage. The aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260511.json` now validates 4/4
reports, 64 bridge-backed commands, 68 mailbox events, action families `buy_card`,
`cancel_gem_selection`, `click_board_cell`, `discard_gem`, `replenish`, `reserve_card`,
`select_joker_color`, and `take_gems`, one replay release-path report, and status
`incomplete-evidence`.

## 2026-05-11 Completion Audit Follow-Up

Before final reporting, this follow-up is limited to migration documentation:

- `docs/migration/current-migration-task-plan.md`
- `docs/archive/README.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-11.md`
- migration documentation already changed in this run

The intended change is to preserve a prompt-to-evidence audit that maps the governed work packages,
validation commands, ignored artifacts, and remaining blockers to the final `Incomplete` status.
This is a reporting artifact only; it does not broaden scope, weaken gates, or convert bounded
smoke evidence into replacement-candidate completion.

## 2026-05-12 Built-Player Follow-Up Breadth Evidence

Before additional source changes, this follow-up is limited to running the existing built-player
smoke tool and updating migration evidence documents:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-11.md`

Result: the existing Windows player at `artifacts/unity/build/windows/GemDuelUnity.exe` passed an
additional fresh-launch LocalDev smoke:
`artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json`. The run used
seed `unity-built-player-followup-breadth-20260512`, applied 80 live bridge-backed commands, wrote
stdout/player logs, exported/imported/reviewed the live replay, and preserved final hash
`94560a25`. It adds built-player smoke evidence for `choose_royal` and `steal_gem` in addition to
the prior families. Later bonus-label, privilege, and game-over follow-ups refreshed the aggregate
to 10/10
reports. The refreshed aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json` now validates 515
bridge-backed commands, 525 mailbox events, action families `activate_privilege`, `buy_card`,
`cancel_gem_selection`, `choose_royal`, `click_board_cell`, `discard_gem`, `replenish`,
`reserve_card`, `select_joker_color`, `steal_gem`, `take_bonus_gem`, `take_gems`, and
`use_privilege`, one replay release-path report, and status `incomplete-evidence`.

## 2026-05-12 Built-Player Bonus Family Label Follow-Up

Before source changes, this follow-up is limited to evidence-label clarity:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevProductSurfaceSmoke.cs`
- `docs/migration/current-migration-task-plan.md`
- migration evidence documents and audit notes

The intended change is to report bonus follow-up board clicks as the named gameplay family
`take_bonus_gem` when the smoke is already in `BONUS_ACTION`. This does not change gameplay,
bridge commands, Electron behavior, shared contracts, or replay semantics; it only prevents the
machine-readable built-player smoke matrix from hiding a named follow-up action behind the generic
`click_board_cell` surface event label.

Result: `LocalDevProductSurfaceSmoke.TryTakeBonusGem` still drives the same `click_board_cell`
semantic operation in `BONUS_ACTION`, but records the successful action detail as
`take_bonus_gem`. The rebuilt Windows player passed
`artifacts/unity/build-bonus-family-label-20260512.log`, then
`artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json` passed with 80
live bridge-backed commands, explicit `take_bonus_gem` events, replay export/import/review, and
hash `cecbc068`.

## 2026-05-12 Built-Player Privilege Family Follow-Up

Before additional source changes, this follow-up is limited to built-player privilege evidence
inside the existing LocalDev/evidence bridge boundary:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevProductSurfaceSmoke.cs`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `docs/migration/current-migration-task-plan.md`
- migration evidence documents and audit notes

The intended change is to add a bounded `privilege-first` smoke preference that starts fresh Local
PvP through `GemDuelGameController` and `IGameRulesEngine`, uses a one-gem take to create a normal
rules-engine privilege opportunity, then routes `activate_privilege` and board-target
`USE_PRIVILEGE` through the existing visible semantic targets. This must not mutate shared rules,
Electron UX, replay contracts, or introduce a new runtime. The resulting evidence remains bounded
LocalDev smoke coverage and does not close arbitrary full product-surface or release-runtime
packaging blockers.

Result: `LocalDevProductSurfaceSmoke` now supports `privilege-first`. The focused EditMode test
`PrivilegeFirstProductSurfaceSmokeRoutesPrivilegeThroughLiveBridge` passed in
`clients/unity/artifacts/unity/editmode-privilege-smoke-20260512-results.xml` with 1/1 passed,
then the rebuilt Windows player passed `artifacts/unity/build-privilege-smoke-20260512.log`. The
built-player smoke
`artifacts/unity/built-player-smoke/smoke-2026-05-12T00-24-16-298Z.launcher.json` passed with a
fresh LocalDev launch, 3 live bridge-backed commands, action families `take_gems`,
`activate_privilege`, and `use_privilege`, replay export/import/review, and hash `9e3b6f7c`. The
refreshed aggregate `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json`
validates 7/7 reports, 227 commands, 234 mailbox events, thirteen action families, one replay
release-path report, and status `incomplete-evidence`. The full Unity EditMode suite then passed in
`clients/unity/artifacts/unity/editmode-privilege-full-20260512-results.xml` with 66/66 tests.

## 2026-05-12 Built-Player Game-Over Depth Follow-Up

No source change was needed for this follow-up. It uses the existing Windows-player smoke entrypoint
to test whether the built executable can advance beyond bounded action-family smoke depth and reach
a fresh LocalDev game-over through the product-surface automation path.

Result: three deterministic Windows-player game-over runs passed using
`artifacts/unity/build/windows/GemDuelUnity.exe`:

- `artifacts/unity/built-player-smoke/smoke-2026-05-12T00-52-54-303Z.launcher.json`: 98 live
  bridge-backed commands, winner `p1`, replay export/import/review, final hash `d6dbea7a`.
- `artifacts/unity/built-player-smoke/smoke-2026-05-12T01-01-37-234Z.launcher.json`: 98 live
  bridge-backed commands, winner `p2`, replay export/import/review, final hash `411262df`.
- `artifacts/unity/built-player-smoke/smoke-2026-05-12T01-04-20-176Z.launcher.json`: 92 live
  bridge-backed commands, winner `p2`, replay export/import/review, final hash `5f3bf567`.

All three reports recorded exit code 0, no timeout, no fixture replay gameplay driver, and no
checkpoint state replacement. The refreshed aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json` validates 10/10
reports, 515 commands, 525 mailbox events, thirteen action families, one replay release-path report,
hashes including `d6dbea7a`, `411262df`, and `5f3bf567`, and status `incomplete-evidence`. This is
now a three-seed built-player game-over proof set, but it remains deterministic LocalDev evidence and
does not close arbitrary player-driven Local PvP, LAN, online, Visual Lab, or release-runtime
packaging blockers.

## 2026-05-12 Built-Player Recovery Release-Path Follow-Up

Before additional source changes, this follow-up is limited to release-path recovery evidence inside
the existing LocalDev/evidence bridge boundary. Allowed source files for this slice:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevRecoveryReleasePathSmoke.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevRecoveryReleasePathSmoke.cs.meta`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`

Goal: prove in the built Windows player that a fresh LocalDev Local PvP game can persist a live
rules-engine recovery save, reload that save through a fresh controller, continue with a real
`IGameRulesEngine` command, export/review the continued live Replay vNext stream, and report the
state/replay hashes under ignored `artifacts/unity/`. This must not use a fixture replay as gameplay
driver, must not replace checkpoint state, must not change the TypeScript bridge runtime strategy,
and still leaves the final migration status `Incomplete` while LAN, online, Visual Lab, arbitrary
product-surface breadth, and release-runtime packaging remain unresolved.

Result: the focused EditMode guard
`clients/unity/artifacts/unity/editmode-recovery-release-path-smoke-20260512-results.xml` passed 1/1,
the full Unity EditMode suite
`clients/unity/artifacts/unity/editmode-recovery-full-20260512-results.xml` then passed 67/67, the
rebuilt Windows player passed `artifacts/unity/build-recovery-release-path-smoke-20260512.log`, and
`artifacts/unity/built-player-smoke/smoke-2026-05-12T01-20-54-336Z.launcher.json` passed with exit
code 0 and no timeout. The nested recovery report starts a fresh LocalDev game, applies one live
`take_gems` command, saves recovery at hash `208a752`, loads recovery in a fresh controller,
continues another live `take_gems` command, exports/reviews the continued live replay at hash
`8d4178f7`, and records no fixture replay gameplay driver or checkpoint state replacement. The
refreshed matrix `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json`
validates 11/11 reports, 517 product-surface commands, 531 mailbox events, thirteen action
families, one replay release-path report, one recovery release-path report, recovery final hash
`8d4178f7`, and status `incomplete-evidence`.

## 2026-05-12 Built-Player Settings Release-Path Follow-Up

Before additional source changes, this follow-up is limited to settings persistence evidence inside
the existing LocalDev/evidence boundary. Allowed source files for this slice:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevSettingsReleasePathSmoke.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevSettingsReleasePathSmoke.cs.meta`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`

Goal: prove in the built Windows player that visible LocalDev settings controls can persist locale,
surface theme, sound, and LAN opponent visibility preferences, then reload those values in a fresh
controller without mutating gameplay state. This is a settings/release-path smoke only; it does not
implement LAN matchmaking, online, Visual Lab, or release-runtime packaging for the TypeScript
bridge, and the final migration status remains `Incomplete`.

Result: the focused EditMode guard
`clients/unity/artifacts/unity/editmode-settings-release-path-smoke-20260512-results.xml` passed
1/1, the rebuilt Windows player passed `artifacts/unity/build-settings-release-path-smoke-20260512.log`,
and `artifacts/unity/built-player-smoke/smoke-2026-05-12T02-00-40-648Z.launcher.json` passed with
exit code 0 and no timeout. The nested settings report starts a fresh LocalDev game, saves
settings through visible controls, persists locale `en`, surface theme `pearl-opaline`, sound off,
LAN opponent card visibility off, and LAN opponent gem visibility off, reloads those preferences in
a fresh live-game controller, and verifies gameplay hashes and live replay event counts remain
unchanged. The refreshed matrix `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json`
validates 12/12 reports, 519 product-surface commands, 536 mailbox events, thirteen action
families, one replay release-path report, one recovery release-path report, one settings
release-path report, settings path `artifacts/unity/settings/gemduel.preferences.v1.json`, and
status `incomplete-evidence`. The full Unity EditMode suite
`clients/unity/artifacts/unity/editmode-settings-full-20260512-results.xml` then passed 68/68.

## 2026-05-12 Built-Player Chrome Release-Path Follow-Up

Before additional source changes, this follow-up is limited to rulebook/restart chrome-control
evidence inside the existing LocalDev/evidence boundary. Allowed source files for this slice:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevChromeReleasePathSmoke.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevChromeReleasePathSmoke.cs.meta`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelGameController.cs`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`

Goal: prove in the built Windows player that visible top-bar rulebook and restart controls can be
opened/closed or invoked from a fresh LocalDev game without mutating gameplay state or recording
spurious replay events, and that restart returns to the shell before a fresh LocalDev game can be
started again through `GemDuelGameController` / `IGameRulesEngine`. This is a chrome
release-path smoke only; it does not implement LAN matchmaking, online, Visual Lab, arbitrary
full-surface Local PvP, or release-runtime packaging for the TypeScript bridge, and the final
migration status remains `Incomplete`.

Result: the focused EditMode guard
`clients/unity/artifacts/unity/editmode-chrome-release-path-smoke-20260512-results.xml` passed
1/1, the full Unity EditMode suite
`clients/unity/artifacts/unity/editmode-chrome-full-20260512-results.xml` passed 69/69, and the
rebuilt Windows player passed `artifacts/unity/build-chrome-release-path-smoke-20260512.log`.
The built-player launcher report
`artifacts/unity/built-player-smoke/smoke-2026-05-12T03-13-11-728Z.launcher.json` passed with exit
code 0 and no timeout. Its nested chrome report starts a fresh LocalDev game, opens and closes the
visible rulebook overlay without changing gameplay hash `8fa33a3f` or live replay event count,
restarts to the shell, starts a fresh LocalDev game again through the bridge, applies one live
`take_gems` command, and records restarted command hash `5304b037` with one live replay event.
The refreshed matrix
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-chrome.json` validates 13/13
reports, 521 product-surface commands, 542 mailbox events, thirteen action families, one replay
release-path report, one recovery release-path report, one settings release-path report, one chrome
release-path report, chrome restart hash `5304b037`, and status `incomplete-evidence`.

## 2026-05-12 Malformed Replay Bootstrap Guard Follow-Up

Before source changes for this slice, the allowed files are narrowed to the replay review validation
path and matching evidence updates:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelGameController.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReplayReleasePathSmoke.cs`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-action-fsm-coverage-matrix.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-11.md`

Goal: close the named `INIT` replay-validation gap without adding redundant gameplay fixtures by
rejecting malformed Replay vNext bootstrap snapshots on import/review before `ReplayBootstrapper`
can synthesize a replacement state. Evidence must prove rejected malformed bootstrap files do not
mutate current gameplay state or append live replay records, and the built-player replay
release-path smoke must report the same rejection under ignored `artifacts/unity/` output. This does
not broaden product-surface Local PvP, LAN/online/Visual Lab, or release-runtime TypeScript bridge
packaging; final migration status remains `Incomplete`.

Result: `GemDuelGameController` now validates Replay vNext init shape before replay review
bootstrap, including board dimensions, gem tokens, market/deck level arrays, card-instance
references, and draft bootstrap shape. The focused EditMode release-path guard
`clients/unity/artifacts/unity/editmode-malformed-bootstrap-release-path-20260512-results.xml`
passed 1/1, and the full EditMode suite
`clients/unity/artifacts/unity/editmode-malformed-bootstrap-full-20260512-results.xml` passed 72/72.
The rebuilt Windows player passed
`artifacts/unity/build-malformed-bootstrap-release-path-20260512.log`. The built-player replay
release-path smoke
`artifacts/unity/built-player-smoke/smoke-2026-05-12T05-04-23-684Z.launcher.json` now records a
`malformed_bootstrap` case rejected with `Replay init board must contain 5 rows.` while preserving
live state hash `ecaf5a49` and eight recorded live replay events. The refreshed aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-malformed-bootstrap.json`
validates 14/14 reports, 525 commands, 552 mailbox events, replay release-path coverage including
`malformed_bootstrap`, recovery/settings/chrome/replay-review release-path reports, and status
`incomplete-evidence`.

## 2026-05-12 Malformed Draft Bootstrap Guard Follow-Up

Before source changes for this slice, the allowed files are narrowed to the Replay vNext draft
bootstrap validation path and matching evidence updates:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReplayReleasePathSmoke.cs`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-action-fsm-coverage-matrix.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-11.md`

Goal: close the named `INIT_DRAFT` malformed draft fixture gap by proving Replay vNext imports reject
an `INIT_DRAFT` bootstrap with an empty `draftPool` before replay review bootstrap. This reuses the
existing LocalDev/evidence bridge and file-path replay release path; it must preserve current live
gameplay state and live replay recording counts after the rejected import. It does not implement
broader draft gameplay, LAN, online, Visual Lab, arbitrary Local PvP, or release-runtime TypeScript
bridge packaging, so final migration status remains `Incomplete`.

Result: the focused EditMode release-path guard
`clients/unity/artifacts/unity/editmode-malformed-draft-bootstrap-release-path-20260512-results.xml`
passed 1/1 after adding an `INIT_DRAFT` replay import with an empty `draftPool`; the rejected import
preserves the live gameplay hash and live replay event count. The follow-up full EditMode suite
`clients/unity/artifacts/unity/editmode-malformed-draft-bootstrap-full-20260512-results.xml`
passed 72/72 after the malformed draft bootstrap guard. The rebuilt Windows player passed
`artifacts/unity/build-malformed-draft-bootstrap-release-path-20260512.log`, and the built-player
release-path smoke
`artifacts/unity/built-player-smoke/smoke-2026-05-12T05-16-44-409Z.launcher.json` records
`malformed_draft_bootstrap` rejected with `Replay init draftPool must not be empty for INIT_DRAFT.`
while preserving live hash `e5374467` and eight recorded replay events. The refreshed aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-malformed-draft-bootstrap.json`
validates 14/14 reports, 525 commands, 552 mailbox events, replay release-path coverage including
`malformed_bootstrap` and `malformed_draft_bootstrap`, recovery/settings/chrome/replay-review
release-path reports, and status `incomplete-evidence`.

## 2026-05-12 Built-Player Draft Release-Path Follow-Up

Before source changes for this slice, the allowed files are narrowed to built-player draft
product-surface smoke configuration and matching evidence updates:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevProductSurfaceSmoke.cs`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-action-fsm-coverage-matrix.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-11.md`

Goal: close part of the draft/buff release-path gap by proving the built Windows player can fresh
launch into roguelike LocalDev draft through `GemDuelGameController` and `IGameRulesEngine`, reroll
and select draft buffs through the product surface, record the live Replay vNext stream, export,
import, and review the replay with hash preservation, and avoid fixture replay or checkpoint
state replacement. This does not implement LAN, online, Visual Lab, arbitrary Local PvP, or release
runtime TypeScript bridge packaging, so final migration status remains `Incomplete`.

Result: the focused EditMode product-surface guard
`clients/unity/artifacts/unity/editmode-draft-release-path-smoke-20260512-results.xml` passed 1/1
for a roguelike LocalDev start that rerolls and selects draft buffs for both players, then reviews
the exported replay. The follow-up full EditMode suite
`clients/unity/artifacts/unity/editmode-draft-release-path-full-20260512-results.xml` passed 73/73
after the draft release-path smoke guard. The rebuilt Windows player passed
`artifacts/unity/build-draft-release-path-smoke-20260512.log`, and
`artifacts/unity/built-player-smoke/smoke-2026-05-12T05-44-04-969Z.launcher.json` passed with
`startMode: roguelike`, `draftActionPreference: reroll-each-player-first`, exit code 0, no timeout,
eight live bridge-backed commands, `choose_boon`, `reroll_draft_pool`, and `take_gems` action
families, no fixture replay gameplay driver, no checkpoint state replacement, live replay export,
import, and review, and final/review hash `851b6356`. The draft-only aggregate before the
invalid-action follow-up
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-draft-release-path.json`
validates 15/15 reports, 533 commands, 561 mailbox events, replay release-path coverage including
`malformed_bootstrap` and `malformed_draft_bootstrap`, recovery/settings/chrome/replay-review
release-path reports, draft families `choose_boon` and `reroll_draft_pool`, and status
`incomplete-evidence`.

## 2026-05-12 Built-Player Invalid-Action Release-Path Follow-Up

Before source changes for this slice, the allowed files are narrowed to built-player invalid-action
release-path smoke wiring and matching evidence updates:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelGameController.cs` only to expose a
  governed LocalDev automation wrapper over the existing live rules command path; no gameplay
  reducer, product UX, Electron, or shared contract behavior may change.
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevInvalidActionReleasePathSmoke.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevInvalidActionReleasePathSmoke.cs.meta`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-action-fsm-coverage-matrix.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-11.md`

Goal: add release-path built Windows player evidence that representative invalid product-surface
commands are rejected through the live `GemDuelGameController` / `IGameRulesEngine` boundary
without mutating the gameplay state hash or appending live Replay vNext events. This follow-up must
not inflate `fixtures/replay-golden/rejection-manifest.json`; it is release-path evidence for
already named invalid-action blockers. It remains LocalDev/evidence-only and does not close LAN,
online, Visual Lab, arbitrary full-surface Local PvP, or release runtime TypeScript bridge packaging
blockers.

Result: the focused EditMode guard
`clients/unity/artifacts/unity/editmode-invalid-action-release-path-smoke-20260512-results.xml`
passed 1/1 for a fresh LocalDev invalid-action release-path smoke. The follow-up full EditMode suite
`clients/unity/artifacts/unity/editmode-invalid-action-release-path-full-20260512-results.xml`
passed 74/74 after the invalid-action guard. The rebuilt Windows player passed
`artifacts/unity/build-invalid-action-release-path-smoke-20260512.log`, and
`artifacts/unity/built-player-smoke/smoke-2026-05-12T06-34-40-146Z.launcher.json` passed with exit
code 0, no timeout, eight live bridge-backed product commands, and the nested
`unity-localdev-invalid-action-release-path-smoke`. That nested proof rejects
`SELECT_BUFF`, `REROLL_DRAFT_POOL`, empty `TAKE_GEMS`, `CANCEL_RESERVE`, `CLOSE_MODAL`, and inactive
actor `TAKE_GEMS` through the live rules boundary, keeps state and summary hashes unchanged at
`1a6afd3f`, keeps live replay event count at 0, exports a zero-event replay, and reviews it back to
hash `1a6afd3f`. The refreshed aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-invalid-action-release-path.json`
validates 16/16 reports, 541 commands, 577 mailbox events, the previous replay/recovery/settings/
chrome/replay-review/draft release-path reports, one invalid-action release-path report, and status
`incomplete-evidence`.

## 2026-05-12 Built-Player Peek-Modal Release-Path Follow-Up

Before source changes for this slice, the allowed files are narrowed to a built-player release-path
proof for the existing deck-peek/modal close product path:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevPeekModalReleasePathSmoke.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevPeekModalReleasePathSmoke.cs.meta`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- required migration docs and the next-run audit note.

Goal: add a deterministic fresh roguelike LocalDev release-path smoke that selects the `intelligence`
buff through visible draft cards, opens the deck-peek modal through the visible `peek_deck` control,
closes it through the visible modal control, records `select_buff`, `peek_deck`, and `close_modal`
Replay vNext events, exports/imports/reviews the replay with stable hashes, and proves no fixture
replay gameplay driver or checkpoint state replacement. The seed `unity-peek-modal-seed-17` was
verified through the TypeScript bridge to expose an initial `intelligence,deep_pockets,privilege_favor`
draft pool.

This is release-path evidence for a named `PEEK_DECK` / `CLOSE_MODAL` gap. It does not change LAN,
online, Visual Lab, arbitrary full-surface Local PvP, or release runtime TypeScript bridge
packaging blockers.

Result: the focused EditMode guard
`clients/unity/artifacts/unity/editmode-peek-modal-release-path-smoke-20260512-results.xml` passed
1/1. The follow-up full EditMode suite
`clients/unity/artifacts/unity/editmode-peek-modal-release-path-full-20260512-results.xml` passed
75/75. The rebuilt Windows player passed
`artifacts/unity/build-peek-modal-release-path-smoke-20260512.log`, and
`artifacts/unity/built-player-smoke/smoke-2026-05-12T07-56-40-905Z.launcher.json` passed with exit
code 0, no timeout, four primary live commands, and the nested
`unity-localdev-peek-modal-release-path-smoke`. That nested proof starts a fresh roguelike
LocalDev run, selects `intelligence`, opens and closes the peek modal through visible controls,
records `select_buff`, `peek_deck`, and `close_modal`, exports/imports/reviews the live replay, and
preserves final hash `8399eadd` without fixture replay gameplay driver or checkpoint state
replacement. The refreshed aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-peek-modal-release-path.json`
validates 17/17 reports, 545 commands, 587 mailbox events, the previous
replay/recovery/settings/chrome/replay-review/draft/invalid-action release-path reports, one
peek-modal release-path report, and status `incomplete-evidence`.

## 2026-05-12 Built-Player Recovery Invalid-Action Release-Path Follow-Up

Before source changes for this slice, the allowed files are narrowed to a built-player release-path
proof for invalid live commands after LocalDev recovery has loaded a saved bridge-backed game:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevRecoveryInvalidActionReleasePathSmoke.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevRecoveryInvalidActionReleasePathSmoke.cs.meta`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- required migration docs and the next-run audit note.

Goal: add a deterministic fresh LocalDev release-path smoke that starts Local PvP through
`GemDuelGameController` / `IGameRulesEngine`, records one live command, saves recovery state,
loads it into a new controller, rejects representative invalid live commands after recovery without
changing the recovered state hash or appending Replay vNext events, then applies a valid
post-recovery command and exports/imports/reviews the continued replay with stable hashes. This is
release-path evidence for the named broader invalid-action recovery blocker. It does not change
LAN, online, Visual Lab, arbitrary full-surface Local PvP, or release runtime TypeScript bridge
packaging blockers.

Result: the focused EditMode guard
`clients/unity/artifacts/unity/editmode-recovery-invalid-action-release-path-smoke-20260512-results.xml`
passed 1/1, the full EditMode rerun
`clients/unity/artifacts/unity/editmode-recovery-invalid-action-release-path-full-20260512-results.xml`
passed 76/76, and the rebuilt Windows player log
`artifacts/unity/build-recovery-invalid-action-release-path-smoke-20260512.log` reports build
success. The built-player proof
`artifacts/unity/built-player-smoke/smoke-2026-05-12T09-33-52-882Z.launcher.json` passed with exit
code 0 and no timeout. Its nested recovery invalid-action report saves and reloads hash `24a87497`,
rejects `CANCEL_RESERVE`, `CLOSE_MODAL`, and inactive actor `TAKE_GEMS` through the live bridge
without changing the recovered/replay/summary hash or appending beyond one recorded event, then
continues a valid `take_gems` command and reviews final hash `d2b51b3f`. The refreshed aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-recovery-invalid-action-release-path.json`
validates 18/18 launcher reports, 547 bridge-backed commands, 596 mailbox events, one recovery
invalid-action release-path report, the previous replay/recovery/settings/chrome/replay-review/
draft/invalid-action/peek-modal release-path reports, and status `incomplete-evidence`.

## 2026-05-12 Built-Player Privilege-Cancel Release-Path Follow-Up

Before source changes for this slice, the allowed files are narrowed to a built-player release-path
proof for the named `CANCEL_PRIVILEGE` / `PRIVILEGE_ACTION` gap:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevPrivilegeCancelReleasePathSmoke.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevPrivilegeCancelReleasePathSmoke.cs.meta`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- required migration docs and the next-run audit note.

Goal: add a deterministic fresh LocalDev release-path smoke that starts Local PvP through
`GemDuelGameController` / `IGameRulesEngine`, reaches `PRIVILEGE_ACTION` through live product
commands, cancels the privilege through the visible cancel control, records `activate_privilege`
and `cancel_privilege` Replay vNext events, exports/imports/reviews the replay with stable hashes,
and proves no fixture replay gameplay driver or checkpoint state replacement. This closes one
named `CANCEL_PRIVILEGE` release-path evidence gap only; it does not change LAN, online,
Visual Lab, arbitrary full-surface Local PvP, or release runtime TypeScript bridge packaging
blockers.

Result: the focused EditMode guard
`clients/unity/artifacts/unity/editmode-privilege-cancel-release-path-smoke-20260512-results.xml`
passed 1/1, the full EditMode rerun
`clients/unity/artifacts/unity/editmode-privilege-cancel-release-path-full-20260512-results.xml`
passed 77/77, and the rebuilt Windows player log
`artifacts/unity/build-privilege-cancel-release-path-smoke-20260512.log` reports build success.
The built-player proof
`artifacts/unity/built-player-smoke/smoke-2026-05-12T10-51-01-649Z.launcher.json` passed with exit
code 0 and no timeout. Its nested privilege-cancel report starts fresh LocalDev, records
`take_gems`, `activate_privilege`, and `cancel_privilege`, reaches `PRIVILEGE_ACTION`, cancels back
to `IDLE`, exports/imports/reviews final hash `efe66377`, and records no fixture replay gameplay
driver or checkpoint state replacement. The refreshed aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-privilege-cancel-release-path.json`
validates 19/19 launcher reports, 550 bridge-backed primary smoke commands, 604 mailbox events, one
privilege-cancel release-path report, the previous replay/recovery/settings/chrome/replay-review/
draft/invalid-action/peek-modal/recovery-invalid-action release-path reports, and status
`incomplete-evidence`.

## 2026-05-12 Built-Player Reserved-Discard Release-Path Follow-Up

Before source changes for this slice, the allowed files are narrowed to a built-player release-path
proof for the named `DISCARD_RESERVED` reserved-card preview gap:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReservedDiscardReleasePathSmoke.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReservedDiscardReleasePathSmoke.cs.meta`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- required migration docs and the next-run audit note.

Goal: add a deterministic fresh roguelike LocalDev release-path smoke that starts through
`GemDuelGameController` / `IGameRulesEngine`, selects the level-3 `puppet_master` active buff
through visible draft cards, reserves a live market card through the visible preview path, opens
the active player's reserved-card preview, discards the card through the visible preview discard
control, records `select_buff`, `reserve_card`, and `discard_reserved` Replay vNext events,
exports/imports/reviews the replay with stable hashes, and proves no fixture replay gameplay
driver or checkpoint state replacement. The seed `unity-reserved-discard-seed-10` was verified
through the TypeScript start action to expose an initial `puppet_master,royal_envoy,minimalist`
level-3 draft pool.

This closes one named `DISCARD_RESERVED` release-path evidence gap only. It does not change LAN,
online, Visual Lab, arbitrary full-surface Local PvP, shared gameplay runtime logic, Electron
behavior, or release runtime TypeScript bridge packaging blockers.

Result: the focused EditMode guard
`clients/unity/artifacts/unity/editmode-reserved-discard-release-path-smoke-20260512-results.xml`
passed 1/1, and the rebuilt Windows player log
`artifacts/unity/build-reserved-discard-release-path-smoke-20260512.log` reports build success. The
built-player proof
`artifacts/unity/built-player-smoke/smoke-2026-05-12T11-39-09-986Z.launcher.json` passed with exit
code 0 and no timeout. Its nested reserved-discard report starts fresh roguelike LocalDev, selects
`puppet_master`, reserves `c:125-gr#0`, records `select_buff`, `initiate_reserve`, `reserve_card`,
`take_gems`, and `discard_reserved`, exports/imports/reviews final hash `33909286`, and records no
fixture replay gameplay driver or checkpoint state replacement. The refreshed aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserved-discard-release-path.json`
validates 20/20 launcher reports, 556 bridge-backed primary smoke commands, 618 mailbox events, one
reserved-discard release-path report, the previous replay/recovery/settings/chrome/replay-review/
draft/invalid-action/peek-modal/recovery-invalid-action/privilege-cancel release-path reports, and
status `incomplete-evidence`.

## 2026-05-12 Built-Player Reserved-Buy Release-Path Follow-Up

Before source changes for this slice, the allowed files are narrowed to a built-player release-path
proof for the named reserved-card preview buy gap:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReservedBuyReleasePathSmoke.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReservedBuyReleasePathSmoke.cs.meta`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- required migration docs and the next-run audit note.

Goal: add a deterministic fresh LocalDev release-path smoke that starts through
`GemDuelGameController` / `IGameRulesEngine`, reserves a live market card through the visible
preview path, acquires any needed resources through real bridge-backed player turns, opens the
active player's reserved-card preview, buys the reserved card through the visible preview buy
control, records `reserve_card`, setup `take_gems`, and `buy_card` with `source: reserved` in
Replay vNext, exports/imports/reviews the replay with stable hashes, and proves no fixture replay
gameplay driver or checkpoint state replacement.

This closes one named reserved-buy release-path evidence gap only. It does not change LAN, online,
Visual Lab, arbitrary full-surface Local PvP, shared gameplay runtime logic, Electron behavior, or
release runtime TypeScript bridge packaging blockers.

Result: the focused EditMode guard
`clients/unity/artifacts/unity/editmode-reserved-buy-release-path-smoke-20260512-results.xml`
passed 1/1, and the rebuilt Windows player log
`artifacts/unity/build-reserved-buy-release-path-smoke-20260512.log` reports build success. The
built-player proof
`artifacts/unity/built-player-smoke/smoke-2026-05-12T12-29-42-881Z.launcher.json` passed with exit
code 0 and no timeout. Its nested reserved-buy report starts fresh LocalDev, reserves `c:155-bk#0`
through the visible market preview path, collects five setup `take_gems` turns through the bridge,
opens the visible reserved-card preview, buys through the visible preview buy control, records
`initiate_reserve`, `reserve_card`, `take_gems`, and `buy_card` with `source: reserved`,
exports/imports/reviews final hash `47c0e9db`, and records no fixture replay gameplay driver or
checkpoint state replacement. The refreshed aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserved-buy-release-path.json`
validates 21/21 launcher reports, 562 bridge-backed primary smoke commands, 634 mailbox events, one
reserved-buy release-path report, the previous replay/recovery/settings/chrome/replay-review/
draft/invalid-action/peek-modal/recovery-invalid-action/privilege-cancel/reserved-discard
release-path reports, and status `incomplete-evidence`.

## 2026-05-12 Built-Player Reserve-Cancel Release-Path Follow-Up

Allowed files for this follow-up:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReserveCancelReleasePathSmoke.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReserveCancelReleasePathSmoke.cs.meta`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- required migration docs and the next-run audit note.

Goal: add a deterministic fresh LocalDev release-path smoke that starts through
`GemDuelGameController` / `IGameRulesEngine`, opens a live market card preview, initiates a reserve
that enters `RESERVE_WAITING_GEM`, uses the visible cancel control to route `CANCEL_RESERVE`, and
proves the cancel returns to `IDLE` without reserving the card, using fixture replay gameplay, or
replacing checkpoint state. Because the TypeScript oracle records valid reserve/cancel transitions,
the replay export/review proof must preserve the unchanged fresh-start final hash while containing
ordered `initiate_reserve` and `cancel_reserve` live events.

This closes one named reserve-cancel release-path evidence gap only. It does not change LAN, online,
Visual Lab, arbitrary full-surface Local PvP, shared gameplay runtime logic, Electron behavior, or
release runtime TypeScript bridge packaging blockers.

Result: the focused EditMode guard
`clients/unity/artifacts/unity/editmode-reserve-cancel-release-path-smoke-20260512-results.xml`
passed 1/1, and the rebuilt Windows player log
`artifacts/unity/build-reserve-cancel-release-path-smoke-20260512.log` reports build success. The
built-player proof
`artifacts/unity/built-player-smoke/smoke-2026-05-12T13-21-32-993Z.launcher.json` passed with exit
code 0 and no timeout. Its nested reserve-cancel report starts fresh LocalDev, opens visible market
reserve controls, enters `RESERVE_WAITING_GEM`, routes the visible cancel control through
`CANCEL_RESERVE`, returns to `IDLE` with no pending reserve and no reserved card, records ordered
`initiate_reserve` and `cancel_reserve` events, exports/imports/reviews final hash `40bdddbf`, and
records no fixture replay gameplay driver or checkpoint state replacement. The refreshed aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-cancel-release-path.json`
validates 22/22 launcher reports, 568 bridge-backed primary smoke commands, 644 mailbox events, one
reserve-cancel release-path report, the previous replay/recovery/settings/chrome/replay-review/
draft/invalid-action/peek-modal/recovery-invalid-action/privilege-cancel/reserved-discard/
reserved-buy release-path reports, and status `incomplete-evidence`.

## Validation Commands

```powershell
pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts
pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts
pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts
pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts --check
pnpm parity:electron-unity
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm release:check
pnpm boundaries:check
pnpm architecture:check
pnpm deps:check
pnpm desktop:check
pnpm secrets:check
git grep -nE "vertical slice|VerticalSlice|prototype|scoped parity|90% parity|guided fixture|remaining 10%" docs/migration clients/unity/Assets/GemDuel/Scripts
git grep -n "ReplaceSnapshot" clients/unity/Assets/GemDuel/Scripts/Core clients/unity/Assets/GemDuel/Scripts/Presentation
git diff --check
git status --short
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testResults artifacts/unity/editmode-mailbox-response-hardening-20260511-results.xml -logFile artifacts/unity/editmode-mailbox-response-hardening-20260511.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testResults artifacts/unity/editmode-privilege-full-20260512-results.xml -logFile artifacts/unity/editmode-privilege-full-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testFilter GemDuel.Tests.EditMode.ReplayParityEditModeTests.UnityBridgeRejectsRejectionManifestWithoutMutatingOrRecording -testResults artifacts/unity/editmode-rejection-manifest-20260511-results.xml -logFile artifacts/unity/editmode-rejection-manifest-20260511.log
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-fresh-launch-breadth-20260511 --max-steps 12 --timeout-ms 240000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-reserve-breadth-20260511 --max-steps 14 --idle-action-preference reserve-first --timeout-ms 300000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-replay-release-path-20260511 --max-steps 8 --include-replay-release-path --timeout-ms 300000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-followup-breadth-20260512 --max-steps 80 --idle-action-preference balanced --timeout-ms 600000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-bonus-family-20260512 --max-steps 80 --idle-action-preference balanced --timeout-ms 600000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-privilege-family-20260512 --max-steps 3 --idle-action-preference privilege-first --timeout-ms 300000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-game-over-20260512 --max-steps 240 --idle-action-preference balanced --timeout-ms 900000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-game-over-alt-1-20260512 --max-steps 240 --idle-action-preference balanced --timeout-ms 900000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-game-over-alt-2-20260512 --max-steps 240 --idle-action-preference balanced --timeout-ms 900000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-recovery-release-path-20260512 --max-steps 2 --include-recovery-release-path --timeout-ms 420000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-settings-release-path-20260512 --max-steps 2 --include-settings-release-path --timeout-ms 420000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-chrome-release-path-20260512 --max-steps 2 --include-chrome-release-path --timeout-ms 420000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-replay-review-release-path-20260512 --max-steps 4 --include-replay-review-release-path --timeout-ms 420000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-malformed-draft-bootstrap-release-path-20260512 --max-steps 8 --include-replay-release-path --timeout-ms 420000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-draft-release-path-20260512 --start-mode roguelike --draft-action-preference reroll-each-player-first --max-steps 8 --timeout-ms 420000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-invalid-action-release-path-20260512-rerun --max-steps 8 --include-invalid-action-release-path --timeout-ms 420000
node --check tools/migration/run-unity-built-player-smoke.mjs
node --check tools/migration/summarize-unity-built-player-smokes.mjs
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-peek-modal-seed-17 --start-mode roguelike --max-steps 4 --include-peek-modal-release-path --timeout-ms 420000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-reserved-buy-seed-20260512 --max-steps 6 --include-reserved-buy-release-path --timeout-ms 420000
node tools/migration/run-unity-built-player-smoke.mjs --seed unity-editmode-live-reserve-deck --max-steps 6 --include-reserve-deck-release-path --timeout-ms 420000
node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-peek-modal-release-path.json --require-family take_gems,buy_card,reserve_card,cancel_gem_selection,activate_privilege,use_privilege,choose_boon,reroll_draft_pool --require-recovery-release-path --require-settings-release-path --require-chrome-release-path --require-replay-review-release-path --require-invalid-action-release-path --require-peek-modal-release-path artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-24-16-298Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-52-54-303Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-01-37-234Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-04-20-176Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-20-54-336Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T02-00-40-648Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T03-13-11-728Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T03-32-18-999Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T05-16-44-409Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T05-44-04-969Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T06-34-40-146Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T07-56-40-905Z.launcher.json
node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260511.json --require-family buy_card --require-family cancel_gem_selection --require-family click_board_cell --require-family discard_gem --require-family replenish --require-family reserve_card --require-family select_joker_color --require-family take_gems artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-50-03-972Z.launcher.json
node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json --require-family buy_card --require-family cancel_gem_selection --require-family choose_royal --require-family click_board_cell --require-family discard_gem --require-family replenish --require-family reserve_card --require-family select_joker_color --require-family steal_gem --require-family take_bonus_gem --require-family take_gems artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-50-03-972Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json
node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json --require-family activate_privilege --require-family buy_card --require-family cancel_gem_selection --require-family choose_royal --require-family click_board_cell --require-family discard_gem --require-family replenish --require-family reserve_card --require-family select_joker_color --require-family steal_gem --require-family take_bonus_gem --require-family take_gems --require-family use_privilege artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-50-03-972Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-24-16-298Z.launcher.json
node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json --require-family activate_privilege --require-family buy_card --require-family cancel_gem_selection --require-family choose_royal --require-family click_board_cell --require-family discard_gem --require-family replenish --require-family reserve_card --require-family select_joker_color --require-family steal_gem --require-family take_bonus_gem --require-family take_gems --require-family use_privilege artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-50-03-972Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-24-16-298Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-52-54-303Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-01-37-234Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-04-20-176Z.launcher.json
node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json --require-recovery-release-path --require-family activate_privilege --require-family buy_card --require-family cancel_gem_selection --require-family choose_royal --require-family click_board_cell --require-family discard_gem --require-family replenish --require-family reserve_card --require-family select_joker_color --require-family steal_gem --require-family take_bonus_gem --require-family take_gems --require-family use_privilege artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-50-03-972Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-24-16-298Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-52-54-303Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-01-37-234Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-04-20-176Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-20-54-336Z.launcher.json
node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json --require-recovery-release-path --require-settings-release-path --require-family activate_privilege --require-family buy_card --require-family cancel_gem_selection --require-family choose_royal --require-family click_board_cell --require-family discard_gem --require-family replenish --require-family reserve_card --require-family select_joker_color --require-family steal_gem --require-family take_bonus_gem --require-family take_gems --require-family use_privilege artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-50-03-972Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-24-16-298Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-52-54-303Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-01-37-234Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-04-20-176Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-20-54-336Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T02-00-40-648Z.launcher.json
node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-chrome.json --require-family take_gems,buy_card,reserve_card,cancel_gem_selection,activate_privilege,use_privilege --require-recovery-release-path --require-settings-release-path --require-chrome-release-path artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-50-03-972Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-24-16-298Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-52-54-303Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-01-37-234Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-04-20-176Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-20-54-336Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T02-00-40-648Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T03-13-11-728Z.launcher.json
node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-replay-review.json --require-family take_gems,buy_card,reserve_card,cancel_gem_selection,activate_privilege,use_privilege --require-recovery-release-path --require-settings-release-path --require-chrome-release-path --require-replay-review-release-path artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-50-03-972Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-24-16-298Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-52-54-303Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-01-37-234Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-04-20-176Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-20-54-336Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T02-00-40-648Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T03-13-11-728Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T03-32-18-999Z.launcher.json
node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-malformed-draft-bootstrap.json --require-family take_gems,buy_card,reserve_card,cancel_gem_selection,activate_privilege,use_privilege --require-recovery-release-path --require-settings-release-path --require-chrome-release-path --require-replay-review-release-path artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-24-16-298Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-52-54-303Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-01-37-234Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-04-20-176Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-20-54-336Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T02-00-40-648Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T03-13-11-728Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T03-32-18-999Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T05-16-44-409Z.launcher.json
node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-draft-release-path.json --require-family take_gems,buy_card,reserve_card,cancel_gem_selection,activate_privilege,use_privilege,choose_boon,reroll_draft_pool --require-recovery-release-path --require-settings-release-path --require-chrome-release-path --require-replay-review-release-path artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-24-16-298Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-52-54-303Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-01-37-234Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-04-20-176Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-20-54-336Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T02-00-40-648Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T03-13-11-728Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T03-32-18-999Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T05-16-44-409Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T05-44-04-969Z.launcher.json
node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-invalid-action-release-path.json --require-family take_gems,buy_card,reserve_card,cancel_gem_selection,activate_privilege,use_privilege,choose_boon,reroll_draft_pool --require-recovery-release-path --require-settings-release-path --require-chrome-release-path --require-replay-review-release-path --require-invalid-action-release-path artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-24-16-298Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T00-52-54-303Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-01-37-234Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-04-20-176Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T01-20-54-336Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T02-00-40-648Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T03-13-11-728Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T03-32-18-999Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T05-16-44-409Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T05-44-04-969Z.launcher.json artifacts/unity/built-player-smoke/smoke-2026-05-12T06-34-40-146Z.launcher.json
```

Unity editor/build commands are required when the local Unity executable is available:

```powershell
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testResults artifacts/unity/editmode-mailbox-response-hardening-20260511-results.xml -logFile artifacts/unity/editmode-mailbox-response-hardening-20260511.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testFilter GemDuel.Tests.EditMode.ReplayParityEditModeTests.LocalDevRecoveryReleasePathSmokeReloadsAndContinuesLiveReplay -testResults artifacts/unity/editmode-recovery-release-path-smoke-20260512-results.xml -logFile artifacts/unity/editmode-recovery-release-path-smoke-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testResults artifacts/unity/editmode-recovery-full-20260512-results.xml -logFile artifacts/unity/editmode-recovery-full-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testResults artifacts/unity/editmode-settings-full-20260512-results.xml -logFile artifacts/unity/editmode-settings-full-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testFilter GemDuel.Tests.EditMode.ReplayParityEditModeTests.LocalDevChromeReleasePathSmokeOpensRulebookRestartsAndRestartsLiveGame -testResults artifacts/unity/editmode-chrome-release-path-smoke-20260512-results.xml -logFile artifacts/unity/editmode-chrome-release-path-smoke-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testResults artifacts/unity/editmode-chrome-full-20260512-results.xml -logFile artifacts/unity/editmode-chrome-full-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testFilter GemDuel.Tests.EditMode.ReplayParityEditModeTests.LocalDevReplayReviewReleasePathSmokeNavigatesImportedReplayWithoutMutatingLiveState -testResults artifacts/unity/editmode-replay-review-release-path-smoke-20260512-results.xml -logFile artifacts/unity/editmode-replay-review-release-path-smoke-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testResults artifacts/unity/editmode-replay-review-full-rerun-20260512-results.xml -logFile artifacts/unity/editmode-replay-review-full-rerun-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testFilter GemDuel.Tests.EditMode.ReplayParityEditModeTests.ReplayReleasePathErrorsRecoverWithoutMutatingGameplayState -testResults artifacts/unity/editmode-malformed-draft-bootstrap-release-path-20260512-results.xml -logFile artifacts/unity/editmode-malformed-draft-bootstrap-release-path-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testFilter GemDuel.Tests.EditMode.ReplayParityEditModeTests.RoguelikeDraftProductSurfaceSmokeRerollsSelectsAndReviewsLiveReplay -testResults artifacts/unity/editmode-draft-release-path-smoke-20260512-results.xml -logFile artifacts/unity/editmode-draft-release-path-smoke-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testResults artifacts/unity/editmode-malformed-draft-bootstrap-full-20260512-results.xml -logFile artifacts/unity/editmode-malformed-draft-bootstrap-full-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testResults artifacts/unity/editmode-draft-release-path-full-20260512-results.xml -logFile artifacts/unity/editmode-draft-release-path-full-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testFilter GemDuel.Tests.EditMode.ReplayParityEditModeTests.LocalDevInvalidActionReleasePathSmokeRejectsWithoutMutatingOrRecording -testResults artifacts/unity/editmode-invalid-action-release-path-smoke-20260512-results.xml -logFile artifacts/unity/editmode-invalid-action-release-path-smoke-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testResults artifacts/unity/editmode-invalid-action-release-path-full-20260512-results.xml -logFile artifacts/unity/editmode-invalid-action-release-path-full-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testFilter GemDuel.Tests.EditMode.ReplayParityEditModeTests.LocalDevPeekModalReleasePathSmokeOpensClosesAndReviewsReplay -testResults artifacts/unity/editmode-peek-modal-release-path-smoke-20260512-results.xml -logFile artifacts/unity/editmode-peek-modal-release-path-smoke-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testResults artifacts/unity/editmode-peek-modal-release-path-full-20260512-results.xml -logFile artifacts/unity/editmode-peek-modal-release-path-full-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testFilter GemDuel.Tests.EditMode.ReplayParityEditModeTests.LocalDevReservedBuyReleasePathSmokeBuysAndReviewsReplay -testResults artifacts/unity/editmode-reserved-buy-release-path-smoke-20260512-results.xml -logFile artifacts/unity/editmode-reserved-buy-release-path-smoke-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testFilter GemDuel.Tests.EditMode.ReplayParityEditModeTests.LocalDevReserveDeckReleasePathSmokeReservesAndReviewsReplay -testResults artifacts/unity/editmode-reserve-deck-release-path-smoke-20260512-results.xml -logFile artifacts/unity/editmode-reserve-deck-release-path-smoke-20260512.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -projectPath clients/unity -executeMethod GemDuel.Editor.BuildWindows.Build -logFile artifacts/unity/build-replay-release-path-smoke-20260511.log -quit
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -projectPath clients/unity -executeMethod GemDuel.Editor.BuildWindows.Build -logFile artifacts/unity/build-recovery-release-path-smoke-20260512.log -quit
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -projectPath clients/unity -executeMethod GemDuel.Editor.BuildWindows.Build -logFile artifacts/unity/build-settings-release-path-smoke-20260512.log -quit
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -projectPath clients/unity -executeMethod GemDuel.Editor.BuildWindows.Build -logFile artifacts/unity/build-chrome-release-path-smoke-20260512.log -quit
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -projectPath clients/unity -executeMethod GemDuel.Editor.BuildWindows.Build -logFile artifacts/unity/build-replay-review-release-path-smoke-20260512.log -quit
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -projectPath clients/unity -executeMethod GemDuel.Editor.BuildWindows.Build -logFile artifacts/unity/build-malformed-draft-bootstrap-release-path-20260512.log -quit
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -projectPath clients/unity -executeMethod GemDuel.Editor.BuildWindows.Build -logFile artifacts/unity/build-draft-release-path-smoke-20260512.log -quit
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -projectPath clients/unity -executeMethod GemDuel.Editor.BuildWindows.Build -logFile artifacts/unity/build-invalid-action-release-path-smoke-20260512.log -quit
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -projectPath clients/unity -executeMethod GemDuel.Editor.BuildWindows.Build -logFile artifacts/unity/build-peek-modal-release-path-smoke-20260512.log -quit
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -projectPath clients/unity -executeMethod GemDuel.Editor.BuildWindows.Build -logFile artifacts/unity/build-reserved-buy-release-path-smoke-20260512.log -quit
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -projectPath clients/unity -executeMethod GemDuel.Editor.BuildWindows.Build -logFile artifacts/unity/build-reserve-deck-release-path-smoke-20260512.log -quit
```

## 2026-05-12 Reserve-Deck Release-Path Follow-Up

Before additional source changes, this follow-up is limited to the remaining named reserve-deck
release-path evidence gap. The additional allowed files for this slice are:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReserveDeckReleasePathSmoke.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReserveDeckReleasePathSmoke.cs.meta`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- Required migration docs and the date-appropriate audit note.

The intended change is to start fresh Local PvP through `GemDuelGameController` and
`IGameRulesEngine`, open a visible market deck preview, initiate deck reserve through the preview
reserve control, complete the Gold follow-up through a visible board target, record ordered
`initiate_reserve_deck` and `reserve_deck` Replay vNext events, prove live replay
export/import/review hash preservation, and keep `Incomplete` status because LAN, online, Visual
Lab, arbitrary product-surface play, and final release-runtime packaging remain blockers.

Result: the focused EditMode guard
`clients/unity/artifacts/unity/editmode-reserve-deck-release-path-smoke-20260512-results.xml`
passed 1/1, and the rebuilt Windows player log
`artifacts/unity/build-reserve-deck-release-path-smoke-20260512.log` reports build success. The
built-player proof
`artifacts/unity/built-player-smoke/smoke-2026-05-12T13-59-30-560Z.launcher.json` passed with exit
code 0 and no timeout. Its nested reserve-deck report starts fresh LocalDev, opens a visible market
deck preview, initiates deck reserve through the visible preview reserve control, completes the Gold
follow-up through a visible board target, records ordered `initiate_reserve_deck` and
`reserve_deck` events, reduces the level-1 deck count from 25 to 24, increases P1 reserved cards
from 0 to 1, consumes the selected Gold cell, exports/imports/reviews final hash `da89d9e5`, and
records no fixture replay gameplay driver or checkpoint state replacement. The refreshed aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-deck-release-path.json`
validates 23/23 launcher reports, 574 bridge-backed primary smoke commands, 654 mailbox events, one
reserve-deck release-path report, the previous replay/recovery/settings/chrome/replay-review/draft/
invalid-action/peek-modal/recovery-invalid-action/privilege-cancel/reserved-discard/reserved-buy/
reserve-cancel release-path reports, and status `incomplete-evidence`.

## 2026-05-12 Joker Release-Path Follow-Up

Before additional source changes, this follow-up is limited to the remaining named Joker market-buy
release-path evidence gap. The additional allowed files for this slice are:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevJokerReleasePathSmoke.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevJokerReleasePathSmoke.cs.meta`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- Required migration docs and the date-appropriate audit note.

The intended change is to start fresh Local PvP through `GemDuelGameController` and
`IGameRulesEngine`, use live product-surface setup commands until a visible Joker is affordable,
open the visible market-card preview, buy through the visible preview primary action, complete the
explicit visible bonus-color selection, record ordered `initiate_buy_joker` and `buy_card` Replay
vNext events, prove live replay export/import/review hash preservation, and keep `Incomplete`
status because LAN, online, Visual Lab, arbitrary product-surface play, and final release-runtime
packaging remain blockers.

Result: the focused EditMode guard
`clients/unity/artifacts/unity/editmode-joker-release-path-smoke-20260512-results.xml` passed 1/1,
and the rebuilt Windows player log `artifacts/unity/build-joker-release-path-smoke-20260512.log`
reports build success. The built-player proof
`artifacts/unity/built-player-smoke/smoke-2026-05-12T14-52-59-171Z.launcher.json` passed with exit
code 0 and no timeout. Its nested Joker report starts fresh LocalDev, drives six live setup
`take_gems` commands until visible Joker `c:174-jo#0` is affordable, opens the visible market
preview, buys through the visible preview primary action, selects visible color `red`, records
ordered `initiate_buy_joker` and `buy_card` events, leaves `SELECT_CARD_COLOR` for `IDLE`, clears
pending buy, adds the Joker to P1 tableau, exports/imports/reviews final hash `95c8a06c`, and
records no fixture replay gameplay driver or checkpoint state replacement. The refreshed aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-joker-release-path.json`
validates 24/24 launcher reports, 582 bridge-backed primary smoke commands, 672 mailbox events, one
Joker release-path report, the previous replay/recovery/settings/chrome/replay-review/draft/
invalid-action/peek-modal/recovery-invalid-action/privilege-cancel/reserved-discard/reserved-buy/
reserve-cancel/reserve-deck release-path reports, and status `incomplete-evidence`.

## 2026-05-12 Deck-Reserve Cancel Release-Path Follow-Up

Before additional source changes, this follow-up is limited to the remaining named deck-reserve
cancel release-path evidence gap. The additional allowed files for this slice are:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReserveDeckCancelReleasePathSmoke.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReserveDeckCancelReleasePathSmoke.cs.meta`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- Required migration docs and the date-appropriate audit note.

The intended change is to start fresh Local PvP through `GemDuelGameController` and
`IGameRulesEngine`, open a visible market deck preview, initiate deck reserve through the visible
preview reserve control, cancel from the visible reserve-waiting control before selecting Gold,
record ordered `initiate_reserve_deck` and `cancel_reserve` Replay vNext events, prove live replay
export/import/review hash preservation, and keep `Incomplete` status because LAN, online, Visual
Lab, arbitrary product-surface play, and final release-runtime packaging remain blockers.

Result: the focused EditMode guard
`clients/unity/artifacts/unity/editmode-reserve-deck-cancel-release-path-smoke-20260512-results.xml`
passed 1/1, and the rebuilt Windows player log
`artifacts/unity/build-reserve-deck-cancel-release-path-smoke-20260512.log` reports build success.
The built-player proof
`artifacts/unity/built-player-smoke/smoke-2026-05-12T15-27-57-407Z.launcher.json` passed with exit
code 0 and no timeout. Its nested deck-reserve cancel report starts fresh LocalDev, opens the
visible level-1 market deck preview, initiates deck reserve through the visible preview reserve
control, enters `RESERVE_WAITING_GEM`, cancels through the visible cancel control before selecting
Gold, records ordered `initiate_reserve_deck` and `cancel_reserve` events, returns to `IDLE`, leaves
the level-1 deck count at 25, leaves P1 reserved-card count at 0, leaves the candidate Gold cell
unchanged, exports/imports/reviews final hash `62fa027f`, and records no fixture replay gameplay
driver or checkpoint state replacement. The refreshed aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-deck-cancel-release-path.json`
validates 25/25 launcher reports, 590 bridge-backed primary smoke commands, 684 mailbox events, one
deck-reserve cancel release-path report, the previous replay/recovery/settings/chrome/replay-review/
draft/invalid-action/peek-modal/recovery-invalid-action/privilege-cancel/reserved-discard/
reserved-buy/reserve-cancel/reserve-deck/Joker release-path reports, and status
`incomplete-evidence`.

## 2026-05-12 Cancel-Reserve No-Pending Rejection Follow-Up

Before additional source changes, this follow-up is limited to one meaningful oracle-generated
rejection case for the remaining `CANCEL_RESERVE` edge coverage. The additional allowed files for
this slice are:

- `tools/migration/export-unity-fixtures.ts`
- `tools/migration/verify-replay-parity.ts`
- `fixtures/replay-golden/rejection-manifest.json`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- Required migration docs and the date-appropriate audit note.

The intended change is to add `edge:CANCEL_RESERVE:no-pending` by deriving a
`RESERVE_WAITING_GEM` replay state from the TypeScript oracle, clearing the pending reserve snapshot
as a corrupt/recovered-state boundary, proving `CANCEL_RESERVE` rejects with no replay-state hash
mutation, and proving Unity's live bridge does not append a Replay vNext event. This is rejection
boundary coverage only; it does not change shared gameplay logic, Electron behavior, product-surface
Local PvP breadth, LAN, online, Visual Lab, or release-runtime TypeScript bridge packaging, so final
migration status remains `Incomplete`.

Result: the exporter regenerated `fixtures/replay-golden/rejection-manifest.json` with 55 rejection
cases, including `reject-cancel-reserve-no-pending` and required tag
`edge:CANCEL_RESERVE:no-pending`. `verify-replay-parity.ts` passed with 11 fixtures, 55 rejection
cases, and no declared coverage gaps; `tools/migration/unity-rules-engine-bridge.test.ts` passed 32
tests; and focused Unity EditMode
`clients/unity/artifacts/unity/editmode-rejection-manifest-no-pending-20260512-results.xml`
reported 1/1 passed for the live-bridge no-mutation/no-recording manifest proof. This closes one
named `CANCEL_RESERVE` corrupt/recovered-state rejection gap, but does not change the final
replacement-candidate status.

## 2026-05-12 Completion-Audit Consistency Follow-Up

Before additional edits, this follow-up is limited to reconciling active migration documentation
with the evidence already produced in this run. The additional allowed files for this docs-only
slice are:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-action-fsm-coverage-matrix.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-11.md`

The intended change is to remove stale active-doc evidence counts and blocker wording after the
55-case cancel-reserve no-pending follow-up. This is not a new implementation slice and must not
move the migration to `Complete`; it only keeps the blocker record accurate for the next run.

Result: active migration docs then consistently referred to 55 committed rejection-manifest cases where
they discuss the current no-mutation/no-recording bridge proof. The FSM matrix no longer lists
online draft reroll and P2-before-P1 draft reroll as missing coverage, because those are covered by
the manifest; it keeps broader P2 ordering, recovery breadth, and online release behavior open.
The audit note validation wording now distinguishes the latest no-pending follow-up gates from
earlier same-day retained evidence. Status remains `Incomplete`.

## 2026-05-12 P2 Draft Select Ordering Follow-Up

Before source changes, this follow-up is limited to one TypeScript-oracle draft actor/order guard
and its Unity bridge rejection evidence. The additional allowed files for this slice are:

- `packages/shared/src/logic/actionValidation/rules.ts`
- `packages/shared/src/logic/actions/__tests__/buffActions.branch.test.ts`
- `tools/migration/export-unity-fixtures.ts`
- `tools/migration/verify-replay-parity.ts`
- `fixtures/replay-golden/rejection-manifest.json`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- Required migration docs and the date-appropriate audit note.

The intended change is to close one named `DRAFT_PHASE` broader P2 ordering gap by ensuring a
recovered/corrupt Local PvP draft state cannot let P2 `SELECT_BUFF` before P1 has a locked buff
selection, even if a stale `p2DraftPool` is present. This is a TypeScript/Electron oracle
validation fix, not a Unity accommodation; tests must prove the shared command gate rejects the
action without mutating state, and the rejection manifest must prove Unity's live bridge rejects the
same oracle-derived case without appending replay events. Status remains `Incomplete` because LAN,
online, Visual Lab, product-surface breadth, and release-runtime packaging remain open.

Result: `packages/shared/src/logic/actionValidation/rules.ts` now rejects stale-pool P2 draft
selection before P1 locks a buff with
`P2 draft selections require a locked-in P1 buff selection.` The focused shared test
`pnpm exec vitest run packages/shared/src/logic/actions/__tests__/buffActions.branch.test.ts`
passed 6/6 and proves `validateCommand` rejects while `applyAction` returns the same state. The
exporter regenerated `fixtures/replay-golden/rejection-manifest.json` with 56 rejection cases,
including `reject-select-buff-p2-before-p1-selection`, required tag
`edge:SELECT_BUFF:p2-before-p1`, and unchanged replay-state hash `5c903209`. `verify-replay-parity`
passed with 11 fixtures, 56 rejection cases, and no declared gaps;
`tools/migration/unity-rules-engine-bridge.test.ts` passed 32/32; and focused Unity EditMode
`clients/unity/artifacts/unity/editmode-rejection-manifest-p2-select-order-20260512-results.xml`
reported 1/1 passed from `2026-05-12 16:48:00Z` to `16:50:19Z`. This closes one corrupt/recovered
draft-order rejection gap but does not change final status.

## 2026-05-12 Take-Gems No-Take-3 Rejection Follow-Up

Before source changes, this follow-up is limited to one existing TypeScript-oracle board-selection
rejection case and its Unity bridge no-mutation/no-recording evidence. The additional allowed files
for this slice are:

- `tools/migration/export-unity-fixtures.ts`
- `tools/migration/verify-replay-parity.ts`
- `fixtures/replay-golden/rejection-manifest.json`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- Required migration docs and the date-appropriate audit note.

The intended change is to add verifier-enforced `edge:TAKE_GEMS:no-take-3` coverage by deriving a
normal Local PvP `IDLE` replay state, applying the existing `DESPERATE_GAMBLE` no-take-3 buff to
the active player as an oracle setup, attempting a valid three-gem board selection, and proving the
TypeScript oracle plus Unity live bridge reject the command without replay-state hash mutation or
Replay vNext event append. This is rejection boundary coverage only; it does not change shared
gameplay logic, Electron behavior, product-surface Local PvP breadth, LAN, online, Visual Lab, or
release-runtime TypeScript bridge packaging, so final migration status remains `Incomplete`.

Result: Implemented. At this point in the run, `fixtures/replay-golden/rejection-manifest.json`
verifier-enforced `edge:TAKE_GEMS:no-take-3`. The new
`reject-take-gems-no-take-3-buff` case uses a normal Local PvP `IDLE` replay state, applies the
existing `DESPERATE_GAMBLE` no-take-3 buff to the active player, attempts a valid three-gem board
selection, and rejects with `The active buff blocks taking three gems.` while preserving hash
`8e546f4c`.

Validation for this follow-up:

- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-fixtures.ts`
  regenerated the oracle manifest.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed with 11 fixtures, the then-current rejection manifest, and no declared gaps.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed 32/32.
- `clients/unity/artifacts/unity/editmode-rejection-manifest-no-take-3-20260512-results.xml`
  passed 1/1 from `2026-05-12 17:27:24Z` to `17:30:10Z`, proving the refreshed Unity live-bridge
  manifest path rejects without replay-state hash mutation or live replay recording append.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` passed after the source changes.

## 2026-05-12 Coordinate Boundary Rejection Follow-Up

Before source changes, this follow-up is limited to TypeScript-oracle coordinate-boundary rejection
coverage for existing validation branches and Unity live-bridge no-mutation/no-recording evidence.
The additional allowed files for this slice are:

- `tools/migration/export-unity-fixtures.ts`
- `tools/migration/verify-replay-parity.ts`
- `fixtures/replay-golden/rejection-manifest.json`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- Required migration docs and the date-appropriate audit note.

The intended change is to add verifier-enforced out-of-bounds coordinate coverage for board
selection, bonus-target selection, privilege-target selection, card reserve Gold resolution, and
deck reserve Gold resolution. Each case must be derived from the existing TypeScript oracle and
must preserve replay-state hashes and live Replay vNext recording counts when replayed through
Unity's `IGameRulesEngine` bridge. This is rejection boundary coverage only; it does not change
shared gameplay logic, Electron behavior, product-surface Local PvP breadth, LAN, online, Visual
Lab, or release-runtime TypeScript bridge packaging, so final migration status remains
`Incomplete`.

Result: Implemented. `fixtures/replay-golden/rejection-manifest.json` now contains 62 rejection
cases and verifier-enforces `edge:TAKE_GEMS:out-of-bounds`,
`edge:TAKE_BONUS_GEM:out-of-bounds`, `edge:RESERVE_CARD:gold-out-of-bounds`,
`edge:RESERVE_DECK:gold-out-of-bounds`, and `edge:USE_PRIVILEGE:out-of-bounds`. The new cases use
existing TypeScript oracle validation branches and reject with the expected coordinate-boundary
reasons while preserving source replay-state hashes.

Validation for this follow-up:

- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-fixtures.ts`
  regenerated the oracle manifest.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed with 11 fixtures, 62 rejection cases, and no declared gaps.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed 32/32.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` passed after this follow-up;
  `pnpm test` covered 177 files and 1112 tests.
- `clients/unity/artifacts/unity/editmode-rejection-manifest-coordinate-boundary-20260512-rerun-results.xml`
  passed 1/1 from `2026-05-12 17:58:49Z` to `18:01:13Z`, proving the refreshed Unity live-bridge
  manifest path rejects all 62 committed cases without replay-state hash mutation or live replay
  recording append. The first focused attempt hit the old 180-second test timeout after the
  manifest grew; the manifest guard now uses a 360-second timeout and the rerun passed.

## 2026-05-12 Game-Over Rejection Follow-Up

Before source changes, this follow-up is limited to TypeScript-oracle end-state rejection coverage
for the existing `The game has already ended.` validation branch and Unity live-bridge
no-mutation/no-recording evidence. The additional allowed files for this slice are:

- `tools/migration/export-unity-fixtures.ts`
- `tools/migration/verify-replay-parity.ts`
- `fixtures/replay-golden/rejection-manifest.json`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs` only if manifest-size
  timing or focused guard metadata must be adjusted.
- Required migration docs and the date-appropriate audit note.

The intended change is to derive a completed Local PvP replay state from the TypeScript oracle,
attempt a normal player action after `winner` is set, require a deterministic rejection without
replay-state hash mutation, and replay the enlarged rejection manifest through Unity's live
`IGameRulesEngine` bridge without appending live Replay vNext events. This is end-state recovery
coverage only; it does not change shared gameplay logic, Electron behavior, product-surface Local
PvP breadth, LAN, online, Visual Lab, or release-runtime TypeScript bridge packaging, so final
migration status remains `Incomplete`.

Result: Implemented. `fixtures/replay-golden/rejection-manifest.json` now contains 63 rejection
cases and verifier-enforces `edge:GAME_OVER:action-after-winner`. The new
`reject-action-after-game-over` case derives revision 95 from
`local-pvp-royal-extra-turn-game-over`, confirms the TypeScript oracle state is completed `IDLE`
with `winner` set, attempts `REPLENISH`, and rejects with `The game has already ended.` while
preserving replay-state hash `4b6ab7ec`.

Validation for this follow-up:

- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-fixtures.ts`
  regenerated the oracle manifest.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed with 11 fixtures, 63 rejection cases, and no declared gaps.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed 32/32.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` passed after this follow-up;
  `pnpm test` covered 177 files and 1112 tests.
- `clients/unity/artifacts/unity/editmode-rejection-manifest-game-over-20260512-results.xml`
  passed 1/1 from `2026-05-12 18:30:46Z` to `18:33:41Z`, proving the refreshed Unity live-bridge
  manifest path rejects all 63 committed cases without replay-state hash mutation or live replay
  recording append.

## 2026-05-12 Joker Color Rejection Follow-Up

Before source changes, this follow-up is limited to the TypeScript-oracle `BUY_CARD` rejection
branch for a pending Joker bonus-color selection that still carries a non-concrete `gold` bonus
color. The additional allowed files for this slice are:

- `tools/migration/export-unity-fixtures.ts`
- `tools/migration/verify-replay-parity.ts`
- `fixtures/replay-golden/rejection-manifest.json`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs` only for the
  manifest-size assertion.
- Required migration docs and the date-appropriate audit note.

The intended change is to derive the pending `SELECT_CARD_COLOR` state from
`local-pvp-joker-color-selection`, attempt `BUY_CARD` against the pending Joker without replacing
its `gold` bonus color, require the TypeScript oracle rejection
`A concrete bonus color is required before buying this card.`, and replay the enlarged rejection
manifest through Unity's live `IGameRulesEngine` bridge without appending live Replay vNext events.
This is rejection-boundary evidence only; it does not change shared gameplay logic, Electron
behavior, product-surface Local PvP breadth, LAN, online, Visual Lab, or release-runtime TypeScript
bridge packaging, so final migration status remains `Incomplete`.

Result: Implemented. `fixtures/replay-golden/rejection-manifest.json` now contains 64 rejection
cases and verifier-enforces `edge:BUY_CARD:joker-without-color`. The new
`reject-buy-card-joker-without-color` case derives revision 5 from
`local-pvp-joker-color-selection`, attempts the pending market Joker `BUY_CARD` without a concrete
bonus color, rejects with `A concrete bonus color is required before buying this card.`, and
preserves replay-state hash `d0a0e459`.

The first Unity focused rerun caught a LocalDev bridge-boundary bug:
`clients/unity/artifacts/unity/editmode-rejection-manifest-joker-color-20260512-results.xml`
failed because the bridge normalized a missing Joker color to `red` and accepted the command. The
fix removes that implicit fallback in `tools/migration/unity-rules-engine-bridge.ts`, so missing or
invalid Joker bonus-color payloads remain `gold` and are rejected by the TypeScript oracle. The
bridge unit test now proves the missing-color command rejects with the same oracle reason while
preserving the initiated state and hash.

Validation for this follow-up:

- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-fixtures.ts`
  regenerated the oracle manifest.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed with 11 fixtures, 64 rejection cases, and no declared gaps.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed 32/32 after the
  missing-color bridge-boundary assertion was added.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` passed after this follow-up;
  `pnpm test` covered 177 files and 1112 tests.
- `clients/unity/artifacts/unity/editmode-rejection-manifest-joker-color-20260512-rerun-results.xml`
  passed 1/1 from `2026-05-12 19:08:07Z` to `19:11:04Z`, proving the refreshed Unity live-bridge
  manifest path rejects all 64 committed cases without replay-state hash mutation or live replay
  recording append.

## 2026-05-12 Replay Release-Path Evidence Consistency Follow-Up

Before additional changes, this follow-up is documentation-only:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

The intended change is to align the active readiness summaries with the already-validated built
Windows player replay release-path matrix. No source, shared runtime, Electron, Unity scene, or
bridge behavior changes are in scope. The evidence remains `Incomplete` because release-runtime
packaging, arbitrary product-surface breadth, LAN, online, and Visual Lab blockers remain open.

Result: Implemented. A fresh summarizer audit passed and wrote
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-replay-release-path-audit.json`.
It validates 14/14 existing built-player launcher reports, 525 commands, 552 mailbox events, one
replay release-path report, and coverage for `invalid_json`, `missing_file`,
`unsupported_schema`, `malformed_bootstrap`, `malformed_draft_bootstrap`, `corrupted_summary`,
`hash_mismatch`, `failed_overwrite_load`, and `valid_overwrite_reload_review`. This is an evidence
consistency check only; no new built player run or source behavior change was introduced.

## 2026-05-12 Replay Release-Path Summarizer Guard Follow-Up

Before source changes, this follow-up is limited to the built-player smoke summarizer CLI:

- `tools/migration/summarize-unity-built-player-smokes.mjs`
- migration documentation and the date-appropriate audit note

The intended change is to add an explicit `--require-replay-release-path` matrix guard. Historical
matrices still need to be reproducible when they only summarize an older replay release-path proof;
the new flag is the opt-in check that both requires a supplied replay release-path report and
enforces the full replay release-path coverage set. This is LocalDev evidence tooling only; it does
not change Unity runtime behavior, Electron behavior, shared gameplay logic, or release-runtime
packaging status.

Result: Implemented. `tools/migration/summarize-unity-built-player-smokes.mjs` now accepts
`--require-replay-release-path` and fails the matrix when no supplied launcher report includes a
replay release-path proof. Validation:

- `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed.
- Positive audit with `--require-replay-release-path` passed and rewrote
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-replay-release-path-audit.json`
  with 14/14 reports, one replay release-path report, and the full replay release-path coverage set.
- Negative audit against a single non-replay-release launcher report failed as expected with
  `Required replay release-path proof was not covered.` and exit code 1.
- The historical `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json`
  matrix was restored without the new opt-in guard and passed with 12/12 reports, 519 commands, 536
  mailbox events, and status `incomplete-evidence`.

## 2026-05-12 Aggregate Built-Player Release-Path Guard Audit

Before additional work, this follow-up is limited to a stricter aggregate audit over the existing
built-player launcher reports:

- `docs/migration/current-migration-task-plan.md`
- migration summary/checklist/risk documentation and the date-appropriate audit note
- ignored `artifacts/unity/built-player-smoke/` aggregate output

No Unity runtime behavior, Electron behavior, shared gameplay logic, bridge behavior, or release
packaging behavior is in scope. The intended change is to prove that the latest 25-report
built-player matrix can be checked with every currently available release-path requirement flag,
including the newer `--require-replay-release-path` coverage gate. This remains LocalDev/evidence
tooling only and must keep final migration status `Incomplete` because LAN, online, Visual Lab,
broader arbitrary product-surface play, and release-runtime TypeScript bridge packaging remain
open.

Result: Implemented. The aggregate audit
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-all-release-paths-audit.json`
passed with 25/25 launcher reports, 590 bridge-backed primary smoke commands, 684 mailbox events,
all currently available release-path requirement flags enabled, replay release-path coverage for
`invalid_json`, `missing_file`, `unsupported_schema`, `malformed_bootstrap`,
`malformed_draft_bootstrap`, `corrupted_summary`, `hash_mismatch`, `failed_overwrite_load`, and
`valid_overwrite_reload_review`, and status `incomplete-evidence`. This is a stricter evidence
audit over existing ignored launcher reports, not a new built-player run or completion claim.

## 2026-05-12 Resource-First Built-Player Breadth Follow-Up

Before additional work, this follow-up is limited to one new deterministic built Windows player
LocalDev smoke using the existing product-surface automation entrypoint:

- ignored `artifacts/unity/built-player-smoke/` launcher, stdout, stderr, player-log, and smoke
  report outputs
- migration summary/checklist/risk documentation and the date-appropriate audit note

No Unity source, Electron source, shared gameplay logic, bridge behavior, or release packaging
behavior is in scope. The intended change is to add one fresh `resource-first` LocalDev built-player
run that starts from the built Windows player, enters Local PvP through `GemDuelGameController` and
`IGameRulesEngine`, applies real rules-engine commands, records live Replay vNext events,
exports/imports/reviews the replay, and records stdout/player-log/report evidence. This is bounded
deterministic product-surface breadth only; it must not be described as arbitrary Local PvP or
replacement-candidate completion.

Result: Implemented. The built-player smoke
`artifacts/unity/built-player-smoke/smoke-2026-05-12T20-12-00-000Z.resource-first.launcher.json`
passed with exit code 0 and no timeout. It starts a fresh classic LocalDev game from the built
Windows player, uses the existing mailbox-backed `IGameRulesEngine` bridge, applies 120 live
product-surface commands under `resource-first` preference, records/export/import/reviews 120 live
Replay vNext events, covers `take_gems`, `discard_gem`, and `replenish`, and preserves final hash
`7669d935`. The refreshed aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-resource-first-breadth.json`
validates 26/26 launcher reports, 710 commands, 805 mailbox events, all currently observed action
families, every available release-path requirement flag, and status `incomplete-evidence`.

## 2026-05-12 Joker Reserved-Source Rejection Follow-Up Result

Result: Implemented. `fixtures/replay-golden/rejection-manifest.json` now contains 65 rejection
cases and verifier-enforces `edge:INITIATE_BUY_JOKER:reserved-not-owned`. The new
`reject-initiate-buy-joker-reserved-not-owned` case derives revision 0 from
`local-pvp-joker-color-selection`, attempts to initiate a visible market Joker through the
reserved-card source boundary, rejects with
`Reserved card does not belong to the active player.`, and preserves replay-state hash
`b5d9cbbf`.

Validation for this follow-up:

- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-fixtures.ts`
  regenerated the oracle manifest.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed with 11 fixtures, 65 rejection cases, and no declared gaps.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed 32/32.
- `pnpm typecheck` passed.
- `clients/unity/artifacts/unity/editmode-rejection-manifest-joker-reserved-source-20260512-results.xml`
  passed 1/1 from `2026-05-12 20:18:45Z` to `20:21:52Z`, proving the refreshed Unity live-bridge
  manifest path rejects all 65 committed cases without replay-state hash mutation or live replay
  recording append.

## 2026-05-12 Joker Wrong-Actor Live Bridge Follow-Up Result

Result: Implemented. `LiveDirectJokerBuyBypassDoesNotMutateStateOrReplayRecording` now also sends
`INITIATE_BUY_JOKER` against a visible market Joker with actor override `p2` while the live state
turn is `p1`. The LocalDev bridge rejects the command with
`Command actor p2 does not match active player p1.`, preserves the live replay-state hash, keeps the
phase at `IDLE`, leaves `pendingBuy` empty, and appends no live Replay vNext events. This is
bridge-envelope evidence only; it does not add a replay-oracle manifest case because actor ownership
is not encoded in the `GameAction` payload.

Validation for this follow-up:

- `clients/unity/artifacts/unity/editmode-joker-wrong-actor-rejection-20260512-results.xml`
  passed 1/1 from `2026-05-12 20:35:02Z` to `20:35:11Z`.

## 2026-05-12 Reserve Wrong-Actor Live Bridge Follow-Up

Before additional source changes, this follow-up is limited to one live-bridge reserve actor guard:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- migration summary/checklist/risk documentation and the date-appropriate audit note

The intended change is to strengthen `LiveMarketReserveRejectionsDoNotMutateStateOrReplayRecording`
with wrong-actor `INITIATE_RESERVE` and wrong-actor `RESERVE_CARD` assertions. The proof must start
from a fresh LocalDev game through `GemDuelGameController` / `IGameRulesEngine`, avoid fixture replay
as a gameplay driver, reject actor override `p2` while the active turn is `p1`, preserve the live
replay-state hash, avoid appending live Replay vNext events, and keep the relevant phase/pending
reserve state stable. This is bridge-envelope evidence only; it must not be added to the replay
oracle manifest because command actor ownership is carried by the bridge envelope, not the
`GameAction` payload. Final migration status remains `Incomplete` because broader arbitrary
product-surface play, LAN, online, Visual Lab, and release-runtime TypeScript bridge packaging remain
open.

Result: Implemented. `LiveMarketReserveRejectionsDoNotMutateStateOrReplayRecording` now sends
`INITIATE_RESERVE` with actor override `p2` from a fresh `IDLE` LocalDev state, verifies the bridge
rejects `Command actor p2 does not match active player p1.`, preserves the live replay-state hash,
and appends zero events. After a valid `INITIATE_RESERVE`, the same test sends `RESERVE_CARD` with a
valid Gold coordinate but actor override `p2`, verifies the same rejection, preserves the pending
reserve hash and one recorded initiate event, and keeps the phase at `RESERVE_WAITING_GEM`.

Validation for this follow-up:

- `clients/unity/artifacts/unity/editmode-reserve-wrong-actor-rejection-20260512-results.xml`
  passed 1/1 from `2026-05-12 20:43:18Z` to `20:43:38Z`.
- `artifacts/unity/editmode-reserve-wrong-actor-rejection-20260512.log` ends with
  `Test run completed. Exiting with code 0 (Ok). Run completed.`

## 2026-05-12 Deck-Reserve Wrong-Actor Live Bridge Follow-Up

Before additional source changes, this follow-up is limited to one live-bridge deck-reserve actor
guard:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- migration summary/checklist/risk documentation and the date-appropriate audit note

The intended change is to strengthen
`LiveMarketDeckReserveRejectionsDoNotMutateStateOrReplayRecording` with wrong-actor
`INITIATE_RESERVE_DECK` and wrong-actor `RESERVE_DECK` assertions. The proof must start from a fresh
LocalDev game through `GemDuelGameController` / `IGameRulesEngine`, avoid fixture replay as a
gameplay driver, reject actor override `p2` while the active turn is `p1`, preserve the live
replay-state hash, avoid appending live Replay vNext events, and keep the relevant phase/pending
deck-reserve state stable. This is bridge-envelope evidence only; it must not be added to the replay
oracle manifest because command actor ownership is carried by the bridge envelope, not the
`GameAction` payload. Final migration status remains `Incomplete` because broader arbitrary
product-surface play, LAN, online, Visual Lab, and release-runtime TypeScript bridge packaging remain
open.

Result: Implemented. `LiveMarketDeckReserveRejectionsDoNotMutateStateOrReplayRecording` now sends
`INITIATE_RESERVE_DECK` with actor override `p2` from a fresh `IDLE` LocalDev state, verifies the
bridge rejects `Command actor p2 does not match active player p1.`, preserves the live replay-state
hash, and appends zero events. After a valid `INITIATE_RESERVE_DECK`, the same test sends
`RESERVE_DECK` with a valid Gold coordinate but actor override `p2`, verifies the same rejection,
preserves the pending deck-reserve hash and one recorded initiate event, keeps the phase at
`RESERVE_WAITING_GEM`, and keeps `pendingReserve.isDeck`.

Validation for this follow-up:

- `clients/unity/artifacts/unity/editmode-deck-reserve-wrong-actor-rejection-20260512-results.xml`
  passed 1/1 from `2026-05-12 20:50:22Z` to `20:50:39Z`.
- `artifacts/unity/editmode-deck-reserve-wrong-actor-rejection-20260512.log` ends with
  `Test run completed. Exiting with code 0 (Ok). Run completed.`

## 2026-05-12 Reserved-Card Wrong-Actor Live Bridge Follow-Up

Before additional source changes, this follow-up is limited to reserved-card actor-envelope
rejections:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- migration summary/checklist/risk documentation and the date-appropriate audit note

The intended change is to strengthen reserved-card live bridge rejection coverage with a wrong-actor
reserved-buy ownership-envelope rejection against an active player's reserved card and a wrong-actor
`DISCARD_RESERVED` rejection against an active player's reserved card. `BUY_RESERVED_CARD` resolves
reserved-card ownership before actor mismatch, so the expected product-correct rejection is ownership
rather than a turn-actor mismatch. The proof must use fresh LocalDev starts through
`GemDuelGameController` / `IGameRulesEngine`, avoid fixture replay as a gameplay driver, reject
actor override `p2` while the active turn is `p1`, preserve the live replay-state hash, avoid
appending live Replay vNext events, and keep the reserved-card ownership state stable. This is
bridge-envelope evidence only; it must not be added to the replay oracle manifest because command
actor ownership is carried by the bridge envelope, not the `GameAction` payload. Final migration
status remains `Incomplete` because broader arbitrary product-surface play, LAN, online, Visual Lab,
and release-runtime TypeScript bridge packaging remain open.

Result: `clients/unity/artifacts/unity/editmode-reserved-card-wrong-actor-rejection-20260512-results.xml`
reported 2/2 passed from `2026-05-12 21:01:22Z` to `21:01:36Z`. The focused proof rejects
wrong-actor `BUY_RESERVED_CARD` as an ownership-envelope failure without state/replay mutation, then
rejects wrong-actor `DISCARD_RESERVED` without state/replay mutation. The paired Unity log
`artifacts/unity/editmode-reserved-card-wrong-actor-rejection-20260512.log` exits code 0.

## 2026-05-12 Market-Buy Wrong-Actor Live Bridge Follow-Up

Before source changes, this follow-up is limited to a plain market-buy actor-envelope guard:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- migration summary/checklist/risk documentation and the date-appropriate audit note

The intended change is to strengthen `BUY_CARD` market actor/order coverage with a wrong-actor
plain market-card buy rejection. The proof must start a fresh LocalDev game through
`GemDuelGameController` / `IGameRulesEngine`, use a visible non-Joker market card, avoid fixture
replay as a gameplay driver, send actor override `p2` while the active turn is `p1`, preserve the
live replay-state hash, avoid appending live Replay vNext events, and keep the market card out of
both players' tableaus. This is bridge-envelope evidence only and must not be added to the replay
oracle manifest because command actor ownership is carried by the LocalDev bridge envelope. Final
migration status remains `Incomplete` because broader arbitrary product-surface play, LAN, online,
Visual Lab, and release-runtime TypeScript bridge packaging remain open.

Result: `clients/unity/artifacts/unity/editmode-market-buy-wrong-actor-rejection-20260512-results.xml`
reported 1/1 passed from `2026-05-12 21:10:50Z` to `21:10:55Z`. The focused proof rejects
wrong-actor plain market-card `BUY_CARD` with `Command actor p2 does not match active player p1.`,
preserves the live replay-state hash, keeps the card in market and out of both tableaus, and
records no live Replay vNext event. The paired Unity log
`artifacts/unity/editmode-market-buy-wrong-actor-rejection-20260512.log` exits code 0.

## 2026-05-12 Privilege Wrong-Actor Live Bridge Follow-Up

Before source changes, this follow-up is limited to privilege actor-envelope guards:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- migration summary/checklist/risk documentation and the date-appropriate audit note

The intended change is to strengthen `ACTIVATE_PRIVILEGE` and `USE_PRIVILEGE` coverage with
wrong-actor live bridge assertions. The proof must start fresh LocalDev games through
`GemDuelGameController` / `IGameRulesEngine`, avoid fixture replay as a gameplay driver, reject
actor override `p2` while the active turn is `p1`, preserve the live replay-state hash, avoid
appending live Replay vNext events, and keep privilege charges, phase, board, and inventory state
stable. This is bridge-envelope evidence only and must not be added to the replay oracle manifest
because command actor ownership is carried by the LocalDev bridge envelope. Final migration status
remains `Incomplete` because broader arbitrary product-surface play, LAN, online, Visual Lab, and
release-runtime TypeScript bridge packaging remain open.

Result: `clients/unity/artifacts/unity/editmode-privilege-wrong-actor-rejection-20260512-results.xml`
reported 2/2 passed from `2026-05-12 21:20:10Z` to `21:20:23Z`. The focused proof rejects
wrong-actor `ACTIVATE_PRIVILEGE` from `IDLE` and wrong-actor `USE_PRIVILEGE` from
`PRIVILEGE_ACTION` with `Command actor p2 does not match active player p1.`, preserves the live
replay-state hash, keeps privilege charge, board, and inventory state stable, and records no live
Replay vNext event. The paired Unity log
`artifacts/unity/editmode-privilege-wrong-actor-rejection-20260512.log` exits code 0.

## 2026-05-12 Cancel-Privilege Wrong-Actor Live Bridge Follow-Up

Before source changes, this follow-up is limited to the remaining privilege cancel actor-envelope
guard:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- migration summary/checklist/risk documentation and the date-appropriate audit note

The intended change is to strengthen `CANCEL_PRIVILEGE` coverage with a wrong-actor live bridge
assertion from `PRIVILEGE_ACTION`. The proof must start a fresh LocalDev game through
`GemDuelGameController` / `IGameRulesEngine`, avoid fixture replay as a gameplay driver, reject
actor override `p2` while the active turn is `p1`, preserve the live replay-state hash, avoid
appending live Replay vNext events, and keep phase, turn, privilege charge, board, and inventory
state stable. This is bridge-envelope evidence only and must not be added to the replay oracle
manifest because command actor ownership is carried by the LocalDev bridge envelope. Final
migration status remains `Incomplete` because broader arbitrary product-surface play, LAN, online,
Visual Lab, and release-runtime TypeScript bridge packaging remain open.

Result: `clients/unity/artifacts/unity/editmode-cancel-privilege-wrong-actor-rejection-20260512-results.xml`
reported 1/1 passed from `2026-05-12 21:28:16Z` to `21:28:21Z`. The focused proof rejects
wrong-actor `CANCEL_PRIVILEGE` from `PRIVILEGE_ACTION` with
`Command actor p2 does not match active player p1.`, preserves the live replay-state hash, keeps
phase, turn, privilege charge, board, and inventory state stable, and records no live Replay vNext
event. The paired Unity log
`artifacts/unity/editmode-cancel-privilege-wrong-actor-rejection-20260512.log` exits code 0.

## 2026-05-12 Follow-Up Wrong-Actor Live Bridge Follow-Up

Before source changes, this follow-up is limited to follow-up phase actor-envelope guards for the
current player-only follow-up actions:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- migration summary/checklist/risk documentation and the date-appropriate audit note

The intended change is to strengthen `TAKE_BONUS_GEM`, `DISCARD_GEM`, and `STEAL_GEM` coverage
with wrong-actor live bridge assertions from valid `BONUS_ACTION`, `DISCARD_EXCESS_GEMS`, and
`STEAL_ACTION` setups. The proof must start fresh LocalDev through `GemDuelGameController` /
`IGameRulesEngine`, avoid fixture replay as a gameplay driver, reject actor override `p2` while the
active turn is `p1`, preserve the live replay-state hash, avoid appending live Replay vNext events,
and keep phase, turn, board, and relevant inventory state stable. This is bridge-envelope evidence
only and must not be added to the replay oracle manifest because command actor ownership is carried
by the LocalDev bridge envelope. Final migration status remains `Incomplete` because broader
arbitrary product-surface play, LAN, online, Visual Lab, and release-runtime TypeScript bridge
packaging remain open.

Result: `clients/unity/artifacts/unity/editmode-follow-up-wrong-actor-rejection-20260512-results.xml`
reported 1/1 passed from `2026-05-12 21:39:45Z` to `21:39:53Z`. The focused proof rejects
wrong-actor `TAKE_BONUS_GEM`, `DISCARD_GEM`, and `STEAL_GEM` with
`Command actor p2 does not match active player p1.`, preserves the live replay-state hash, keeps
phase, turn, board, and relevant inventory state stable, and records no live Replay vNext event.
The paired Unity log `artifacts/unity/editmode-follow-up-wrong-actor-rejection-20260512.log` exits
code 0.

## 2026-05-12 Reserve-Cancel Wrong-Actor Live Bridge Follow-Up

Before source changes, this follow-up is limited to the remaining reserve cancel actor-envelope
guard:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- migration summary/checklist/risk documentation and the date-appropriate audit note

The intended change is to strengthen `CANCEL_RESERVE` coverage with a wrong-actor live bridge
assertion from a valid `RESERVE_WAITING_GEM` pending reserve. The proof must start fresh LocalDev
through `GemDuelGameController` / `IGameRulesEngine`, avoid fixture replay as a gameplay driver,
record the valid active-player `INITIATE_RESERVE`, reject actor override `p2` for
`CANCEL_RESERVE`, preserve the live replay-state hash, avoid appending an additional Replay vNext
event, and keep phase, turn, pending reserve, market card, and reserved-card state stable. This is
bridge-envelope evidence only and must not be added to the replay oracle manifest because command
actor ownership is carried by the LocalDev bridge envelope. Final migration status remains
`Incomplete` because broader arbitrary product-surface play, LAN, online, Visual Lab, and
release-runtime TypeScript bridge packaging remain open.

Result: `clients/unity/artifacts/unity/editmode-reserve-cancel-wrong-actor-rejection-20260512-results.xml`
reported 1/1 passed from `2026-05-12 21:46:29Z` to `21:46:35Z`. The focused proof records the
valid active-player `INITIATE_RESERVE`, rejects wrong-actor `CANCEL_RESERVE` from
`RESERVE_WAITING_GEM` with `Command actor p2 does not match active player p1.`, preserves the live
replay-state hash, keeps phase, turn, pending reserve, market card, and reserved-card count stable,
and records no additional live Replay vNext event. The paired Unity log
`artifacts/unity/editmode-reserve-cancel-wrong-actor-rejection-20260512.log` exits code 0.

## 2026-05-12 Joker Color Wrong-Actor Live Bridge Follow-Up

Before source changes, this follow-up is limited to the remaining Joker color-selection
actor-envelope guard:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- migration summary/checklist/risk documentation and the date-appropriate audit note

The intended change is to strengthen `SELECT_CARD_COLOR` / color-follow-up `BUY_CARD` coverage with
a wrong-actor live bridge assertion from a valid pending Joker bonus-color selection. The proof must
start fresh LocalDev through `GemDuelGameController` / `IGameRulesEngine`, avoid fixture replay as a
gameplay driver, record the valid active-player Joker initiation, reject actor override `p2` for the
color-follow-up `BUY_CARD`, preserve the live replay-state hash, avoid appending an additional Replay
vNext event, and keep phase, turn, pending buy, market card, and player tableau state stable. This is
bridge-envelope evidence only and must not be added to the replay oracle manifest because command
actor ownership is carried by the LocalDev bridge envelope. Final migration status remains
`Incomplete` because broader arbitrary product-surface play, LAN, online, Visual Lab, and
release-runtime TypeScript bridge packaging remain open.

Result: `clients/unity/artifacts/unity/editmode-joker-color-wrong-actor-rejection-20260512-results.xml`
reported 1/1 passed from `2026-05-12 21:54:12Z` to `21:54:20Z`. The focused proof records the
valid active-player Joker initiation, rejects wrong-actor color-follow-up `BUY_CARD` from
`SELECT_CARD_COLOR` with `Command actor p2 does not match active player p1.`, preserves the live
replay-state hash, keeps phase, turn, pending buy, market card, and player tableau state stable, and
records no additional live Replay vNext event. The paired Unity log
`artifacts/unity/editmode-joker-color-wrong-actor-rejection-20260512.log` exits code 0.

## 2026-05-12 Discard Phase-Resolution Live Bridge Follow-Up

Before source changes, this follow-up is limited to a focused `DISCARD_EXCESS_GEMS` phase-resolution
guard:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- migration summary/checklist/risk documentation and the date-appropriate audit note

The intended change is to strengthen the named discard follow-up gap by proving repeated live
`DISCARD_GEM` commands continue to route through `GemDuelGameController` / `IGameRulesEngine`, append
Replay vNext events, decrement the active player's inventory, keep `DISCARD_EXCESS_GEMS` while the
active player still exceeds the gem limit, and then resolve back to `IDLE` once the inventory is
legal. This is focused LocalDev bridge evidence from a controlled follow-up phase setup, not a claim
of broad arbitrary product-surface release readiness. Final migration status remains `Incomplete`
because broader arbitrary product-surface play, LAN, online, Visual Lab, and release-runtime
TypeScript bridge packaging remain open.

Result: `clients/unity/artifacts/unity/editmode-discard-phase-resolution-20260512-results.xml`
reported 1/1 passed from `2026-05-12 22:03:41Z` to `22:03:48Z`. The focused proof starts fresh
LocalDev, enters a controlled `DISCARD_EXCESS_GEMS` follow-up phase with 12 active-player red gems,
applies two live `DISCARD_GEM` commands through `IGameRulesEngine`, records two Replay vNext events,
keeps `DISCARD_EXCESS_GEMS` after the first discard at 11 gems, resolves to `IDLE` and hands turn to
`p2` after the second discard at 10 gems, and keeps the live replay summary hash aligned with the
controller state hash. The paired Unity log
`artifacts/unity/editmode-discard-phase-resolution-20260512.log` exits code 0.

## 2026-05-12 Bonus/Steal Phase-Resolution Live Bridge Follow-Up

Before source changes, this follow-up is limited to focused `BONUS_ACTION` and `STEAL_ACTION`
phase-resolution guards:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- migration summary/checklist/risk documentation and the date-appropriate audit note

The intended change is to strengthen the named bonus and steal follow-up ordering gaps by proving
valid live `TAKE_BONUS_GEM` and `STEAL_GEM` commands route through `GemDuelGameController` /
`IGameRulesEngine`, append Replay vNext events, mutate the expected board/inventory state, resolve
out of their follow-up phases, and keep the live replay summary hash aligned with the controller
state hash. This is focused LocalDev bridge evidence from controlled follow-up phase setups, not a
claim of broad arbitrary product-surface release readiness. Final migration status remains
`Incomplete` because broader arbitrary product-surface play, LAN, online, Visual Lab, and
release-runtime TypeScript bridge packaging remain open.

Result: `clients/unity/artifacts/unity/editmode-bonus-steal-phase-resolution-20260512-results.xml`
reported 1/1 passed from `2026-05-12 22:13:19Z` to `22:13:28Z`. The focused proof starts fresh
LocalDev controllers for bonus and steal, enters controlled `BONUS_ACTION` and `STEAL_ACTION`
follow-up phases, applies valid live `TAKE_BONUS_GEM` and `STEAL_GEM` commands through
`IGameRulesEngine`, records one Replay vNext event for each command, resolves both follow-up phases
to `IDLE` with turn handoff to `p2`, verifies the expected board/inventory mutation, and keeps each
live replay summary hash aligned with the controller state hash. The paired Unity log
`artifacts/unity/editmode-bonus-steal-phase-resolution-20260512.log` exits code 0.

## 2026-05-12 Royal Phase-Resolution Live Bridge Follow-Up

Before source changes, this follow-up is limited to a focused `SELECT_ROYAL` valid-selection guard:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- migration summary/checklist/risk documentation and the date-appropriate audit note

The intended change is to strengthen the named royal ordering gap by proving a valid live
`SELECT_ROYAL_CARD` command routes through `GemDuelGameController` / `IGameRulesEngine`, appends a
Replay vNext event, moves the selected royal from the deck to the active player, resolves out of
`SELECT_ROYAL`, and keeps the live replay summary hash aligned with the controller state hash. This
is focused LocalDev bridge evidence from a controlled royal-selection phase setup, not a claim of
broad arbitrary product-surface release readiness. Final migration status remains `Incomplete`
because broader arbitrary product-surface play, LAN, online, Visual Lab, and release-runtime
TypeScript bridge packaging remain open.

Result: `clients/unity/artifacts/unity/editmode-royal-phase-resolution-20260512-results.xml`
reported 1/1 passed from `2026-05-12 22:19:13Z` to `22:19:17Z`. The focused proof starts fresh
LocalDev, enters a controlled `SELECT_ROYAL` phase with `r91-ro` available, applies valid live
`SELECT_ROYAL_CARD` through `IGameRulesEngine`, records one Replay vNext `select_royal` event, moves
`r91-ro` from the royal deck to P1's royal row, resolves to `IDLE` with turn handoff to `p2`, and
keeps the live replay summary hash aligned with the controller state hash. The paired Unity log
`artifacts/unity/editmode-royal-phase-resolution-20260512.log` exits code 0.

Post-proof validation:

- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed with 11 fixtures, 65 rejection cases, and no coverage gaps.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed 32/32.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts --check`
  passed.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` passed after the focused royal proof;
  `pnpm test` reported 177 files and 1112 tests passed.
- `pnpm release:check`, `pnpm boundaries:check`, `pnpm architecture:check`, `pnpm deps:check`,
  `pnpm desktop:check`, and `pnpm secrets:check` passed after the focused royal proof.

## 2026-05-12 Replacement-Candidate Completion Audit Refresh

Before any further source changes, this continuation is limited to documentation-only completion
audit consolidation:

- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `docs/archive/README.md`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`

Goal: reconcile the active completion-audit artifact with the later 2026-05-12 evidence already
recorded in the task plan, completion report, parity matrix, product-scope map, platform checklist,
risk table, and next-run audit note. The audit refresh must not claim replacement-candidate
completion. It must explicitly separate repo/local gates, Unity Editor/EditMode/build evidence,
built Windows player fresh-launch product-surface evidence, and remaining blockers. Final migration
status remains `Incomplete` because LAN, online, Visual Lab, arbitrary broad product-surface play,
and release-runtime TypeScript bridge packaging are still unresolved or not user-approved excluded.

Result: `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md` now maps work
packages A-G to the current evidence and blockers. It records the same `Incomplete` status, links
the audit from `docs/archive/README.md`, and adds a completion-report pointer without changing
Unity, Electron, or shared gameplay source.

## 2026-05-12 Full EditMode No-Take-3 Smoke Fix

During the post-royal full Unity EditMode rerun, the suite exposed a narrow product-surface smoke
driver bug. Allowed source for the fix:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevProductSurfaceSmoke.cs`
- migration status/checklist/report/audit documentation

Evidence: `clients/unity/artifacts/unity/editmode-full-20260512-post-royal-results.xml` reported
90/91 passed from `2026-05-12 22:34:57Z` to `23:00:14Z`. The single failing test was
`RoguelikeDraftProductSurfaceSmokeRerollsSelectsAndReviewsLiveReplay`. The roguelike smoke selected
a valid active buff with `passive.noTake3`, then the smoke driver's balanced idle action attempted
a three-gem `take_gems`; the TypeScript oracle correctly rejected it with
`The active buff blocks taking three gems.`, so no live replay event was appended.

Fix: `LocalDevProductSurfaceSmoke.TryTakeUsefulGemLine` now detects the active player's
`passive.noTake3` buff and skips three-gem candidate lines. This changes only LocalDev evidence
automation. It preserves the TypeScript/Electron oracle rejection and does not change shared
gameplay, Electron UX, or Unity production rules.

Validation:

- `clients/unity/artifacts/unity/editmode-draft-smoke-notake3-rerun-20260512-results.xml` passed
  1/1 from `2026-05-12 23:02:00Z` to `23:02:15Z`.
- `clients/unity/artifacts/unity/editmode-full-20260512-post-notake3-fix-results.xml` passed 91/91
  from `2026-05-12 23:02:38Z` to `23:28:37Z`; paired log
  `artifacts/unity/editmode-full-20260512-post-notake3-fix.log` exits code 0.

Final migration status remains `Incomplete` because this refresh only strengthens Unity EditMode
evidence; LAN, online, Visual Lab, arbitrary broad product-surface play, and release-runtime
TypeScript bridge packaging remain unresolved or not user-approved excluded.

## 2026-05-12 Prompt Requirement Checklist Audit Refresh

This continuation is documentation-only. Allowed files are narrowed to:

- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `docs/migration/current-migration-task-plan.md`

Goal: harden the archived completion audit with a prompt-to-artifact checklist that maps the active
user requirements, mandatory starting artifacts, work packages, required documentation updates,
validation commands, final-report constraints, prohibitions, and stop conditions to concrete
evidence or explicit gaps. This must not claim replacement-candidate completion and must not use
bounded LocalDev smoke, configured parity rows, or the full EditMode pass as proxy completion.

Expected result: the audit remains `Incomplete`, but the next run can distinguish completed evidence
from remaining blockers without rereading the whole task prompt.

## 2026-05-12 Post-No-Take-3 Windows Build And Built-Player Smoke Refresh

This continuation is validation plus documentation. No source files are allowed for this slice.
Allowed documentation files are the migration checklist/report/matrix/risk/audit artifacts already
used for current evidence tracking.

Goal: rebuild the Windows player from the current tree after the LocalDev no-take-3 smoke-driver
fix, then run a targeted built-player roguelike draft smoke with the same seed and draft preference
that exposed the EditMode failure. The proof must start the built Windows player, use the LocalDev
mailbox bridge, reroll/select both draft players, continue into live Local PvP actions without
fixture replay or checkpoint replacement, export/import/review the live replay, and remain
`incomplete-evidence` rather than replacement-candidate completion.

Result:

- `artifacts/unity/build-post-notake3-20260512.log` reports Windows player build exit code 0 from
  the current post-fix tree.
- `artifacts/unity/built-player-smoke/smoke-2026-05-12Tpost-notake3-draft.launcher.json` passed
  with exit code 0 and no timeout. It starts `GemDuelUnity.exe` as `WindowsPlayer`, uses seed
  `unity-product-surface-draft-release-path-20260512`, `startMode=roguelike`, and
  `draftActionPreference=reroll-each-player-first`, records `reroll_draft_pool`, `choose_boon`,
  and `take_gems`, exports/imports/reviews six live Replay vNext events, and preserves final hash
  `857c3e58`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-post-notake3-draft.json`
  validates 1/1 launcher report, six commands, seven mailbox events, action families
  `choose_boon`, `reroll_draft_pool`, and `take_gems`, and status `incomplete-evidence`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-post-notake3-combined.json`
  revalidates the prior 26-report curated aggregate plus the post-fix draft launcher with every
  required action family and every current release-path requirement flag enabled. It validates 27/27
  reports, 716 commands, 812 mailbox events, 21 required action families, replay release-path
  coverage for invalid/corrupt/hash-mismatch/overwrite cases, final hash `857c3e58`, and status
  `incomplete-evidence`.

Final migration status remains `Incomplete` because this is a targeted post-fix built-player smoke,
not arbitrary full product-surface Local PvP, LAN, online, Visual Lab, or final release-runtime
TypeScript bridge packaging.

## 2026-05-12 Completion Audit Count Consistency Refresh

This continuation is documentation-only. No source files are allowed for this slice.

Goal: reconcile the prompt-to-artifact checklist in
`docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md` with the already-recorded
post-no-take-3 combined built-player aggregate. The checklist must not retain stale 26-report
language after the combined aggregate validated 27/27 reports, 716 commands, 812 mailbox events,
all 21 required action families, and final hash `857c3e58`.

Result:

- Updated the completion-audit prompt checklist to say 27 built-player reports and to reference the
  post-no-take-3 combined aggregate.
- Confirmed the audit still reports `Advanced, incomplete` / `Incomplete`; this cleanup does not
  change the blocker set or claim replacement-candidate completion.
- A stale-count search over the active migration/audit docs found no remaining 26-report
  prompt-checklist claims; existing 26/26 references are historical resource-first aggregate
  evidence, not the latest combined built-player aggregate.
- Direct trailing-whitespace scan of the touched audit and current-plan docs returned no matches;
  `git diff --check` also passed for tracked changes, with only the existing CRLF normalization
  warnings on unrelated migration docs.

## 2026-05-12 Risk Table Latest Aggregate Consistency Refresh

This continuation is documentation-only. No source files are allowed for this slice.

Goal: keep `docs/migration/unity-migration-risk-table.md` aligned with the latest built-player
aggregate. The risk table already states that the latest built-player count is the post-no-take-3
combined aggregate, but the automation-mailbox row still described the older 25-report
deck-reserve-cancel aggregate as current. This cleanup must preserve the risk framing: the mailbox
bridge remains LocalDev/evidence-only and does not solve release-runtime packaging.

Result:

- The risk-table automation-mailbox row now references
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-post-notake3-combined.json`
  as the latest aggregate with 27/27 reports, 716 commands, 812 mailbox events, all 21 required
  action families, every current release-path requirement flag, final hash `857c3e58`, and
  `incomplete-evidence` status.
- The older 25-report all-release-path audit is explicitly retained as earlier subset evidence only.
- Direct JSON inspection of the post-no-take-3 combined aggregate confirmed status
  `incomplete-evidence`, `check.passed=true`, 27/27 reports, 716 commands, 812 mailbox events,
  21 required families, zero missing required families, and final hash `857c3e58`.
- A stale wording search found no remaining claim that the older deck-reserve-cancel aggregate is
  the current built-player aggregate.
- Direct trailing-whitespace scan of the touched current-plan and risk-table docs returned no
  matches; scoped `git diff --check` passed with the existing CRLF normalization warning on the risk
  table.

## 2026-05-12 Next-Run Audit Note Consistency Closeout

This continuation is documentation-only. No source files are allowed for this slice.

Goal: update `docs/archive/unity-next-run-audit-note-2026-05-12.md` so the handoff note includes the
latest documentation consistency cleanup. The note should record that the completion audit checklist
and risk table now use the post-no-take-3 27-report aggregate as the latest built-player evidence,
while preserving `Incomplete` status and the remaining blockers.

Result:

- `docs/archive/unity-next-run-audit-note-2026-05-12.md` now records that the completion audit
  prompt checklist and migration risk table use the post-no-take-3 combined aggregate as the latest
  built-player evidence.
- The note keeps the older 25-report all-release-path audit and 26-report resource-first aggregate
  as retained subset evidence only.
- The note explicitly preserves `Incomplete` status: the combined aggregate remains
  `incomplete-evidence`, not a release-runtime packaging decision or broad product-surface
  completion.

## 2026-05-12 Unity Artifact Path Consistency Audit

This continuation is documentation-only. No source files are allowed for this slice.

Goal: verify that active migration/audit docs do not point to missing Unity evidence artifacts after
the latest completion-audit and risk-table consistency refresh. The audit must distinguish
repository-relative evidence links from Unity CLI output arguments: commands run from the repo root
with `-projectPath clients/unity`, so `-testResults artifacts/unity/...` and
`-logFile artifacts/unity/...` are Unity-project-relative arguments whose files land under
`clients/unity/artifacts/unity/...`.

Result:

- A repository-relative artifact-path scan across the active migration/audit docs found 195 unique
  artifact paths.
- The only 18 paths that did not exist from the repo root were Unity CLI `-testResults` command
  arguments already paired with `-projectPath clients/unity`; each corresponding
  `clients/unity/<artifact-path>` file exists.
- No evidence links needed rewriting. Existing evidence references that cite concrete Unity result
  XML files use `clients/unity/artifacts/unity/...`; command examples keep the Unity CLI arguments
  that generated those files.

## 2026-05-13 Electron-Unity Parity Artifact Refresh

This continuation is validation plus documentation. No source files are allowed for this slice.

Goal: refresh the configured Electron/Unity parity runner evidence from the current dirty tree
without treating runner equivalence as replacement-candidate completion. If the command wrapper
times out before the child process returns, inspect the generated artifact directly and keep the
result honest.

Result:

- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed with 11 golden fixtures, 65 rejection cases, and no declared coverage gaps.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed 32/32 bridge
  tests.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts --check`
  passed.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`, and `pnpm build` passed on
  the current tree. `pnpm test` and `pnpm test:coverage` each reported 177 files and 1112 tests;
  `pnpm test:coverage` also wrote `artifacts/governance/coverage-perfile-key-modules.report.json`
  with 0 key-module coverage violations.
- `pnpm release:check`, `pnpm boundaries:check`, `pnpm architecture:check`, `pnpm deps:check`,
  `pnpm desktop:check`, and `pnpm secrets:check` passed on the current tree.
- `pnpm parity:electron-unity` reached the 600-second shell wrapper timeout, but the child
  `tools/migration/electron-unity-parity-runner.mjs` process was still running. Waiting on the
  process showed it exited, then direct artifact inspection of
  `artifacts/electron-unity-parity/2026-05-13T00-04-32-249Z/runner-summary.json` and
  `artifacts/electron-unity-parity/2026-05-13T00-04-32-249Z/parity-matrix.json` found 54/54
  configured rows with status `Equivalent` across the two required viewports.
- This is fresh configured-runner evidence only. It does not close broad arbitrary Local PvP,
  LAN/online/Visual Lab, or release-runtime TypeScript bridge packaging blockers.

## 2026-05-13 Risk Table Parity Artifact Consistency Refresh

This continuation is documentation-only. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

Goal: align the risk table's current configured-parity evidence with the 2026-05-13 artifact
inspection while preserving the distinction between a shell wrapper timeout, completed child-runner
artifacts, retained earlier direct command-pass evidence, and unresolved replacement-candidate
blockers.

Result:

- `docs/migration/unity-migration-risk-table.md` now uses 2026-05-13 as the update date.
- The parity-runner scenario risk now cites
  `artifacts/electron-unity-parity/2026-05-13T00-04-32-249Z/` as inspected artifact evidence,
  records the 600-second shell wrapper timeout versus completed child-runner artifacts, and keeps
  `artifacts/electron-unity-parity/2026-05-12T08-18-40-709Z/` as retained direct command-pass
  evidence.
- The repo-release-gate risk now separates the commands passed in the 2026-05-13 refresh from
  earlier same-day retained lifecycle evidence, instead of implying `pnpm bundle:check` and
  `pnpm release:artifacts:check` were part of the latest refresh.
- `docs/archive/unity-next-run-audit-note-2026-05-12.md` now records this docs-only evidence
  consistency refresh for the next run.
- The risk remains `Open`; configured parity equivalence still does not prove broad arbitrary
  product-surface Local PvP or close LAN/online/Visual Lab and release-runtime packaging blockers.

Validation:

- Check the touched docs for stale "current evidence" wording.
- Run `git diff --check`.
- Review `git status --short --branch`.

## 2026-05-13 Built-Player Game-Over Aggregate Guard

This continuation is tooling plus documentation only. No Unity gameplay, Electron gameplay, shared
action logic, or production runtime contract changes are allowed for this slice. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

Goal: make retained built-player game-over evidence machine-checkable in the aggregate summarizer
instead of relying only on prose claims. The new guard must still report `incomplete-evidence` and
must not weaken the remaining blockers for arbitrary Local PvP, LAN/online/Visual Lab, or
release-runtime TypeScript bridge packaging.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now accepts
  `--require-game-over-count <count>`.
- Aggregate summaries now expose `gameOverReportCount`, `winners`, and
  `gameOverFinalStateHashes`.
- Positive validation wrote
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-game-over-guard.json`
  from the retained 27-report post-no-take-3 set. It passed with 27/27 reports, 716 commands,
  812 mailbox events, 3 game-over reports, winners `p1` and `p2`, and game-over hashes
  `d6dbea7a`, `411262df`, and `5f3bf567`.
- Negative validation wrote
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-game-over-negative.json`
  and failed as expected with
  `Required built-player game-over report count was not met: expected at least 4, found 3.`
- This is aggregate evidence hardening only. It does not change `incomplete-evidence` status or
  close the open arbitrary Local PvP, LAN/online/Visual Lab, or release-runtime TypeScript bridge
  packaging blockers.

Validation:

- `node --check tools/migration/summarize-unity-built-player-smokes.mjs`
- Positive aggregate check against the retained post-no-take-3 report set with a minimum of three
  game-over reports.
- Negative aggregate check against the same retained report set with an intentionally higher
  minimum to prove the guard fails closed.
- `git diff --check`
- `git status --short --branch`

## 2026-05-13 Strict Built-Player Aggregate Guard

This continuation is evidence and documentation only. No gameplay, Unity runtime, Electron,
shared-action, or bridge implementation changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

Goal: produce one retained built-player aggregate that simultaneously requires the existing
21 action families, every current release-path proof flag, and at least three built-player
game-over reports. This should make the strongest retained built-player evidence easier to audit
without changing its `incomplete-evidence` status.

Result:

- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-game-over-release-path.json`
  revalidates the retained 27-report post-no-take-3 set with all 21 required action families,
  every current release-path requirement flag, and `--require-game-over-count 3`.
- The strict aggregate passed with 27/27 reports, 716 commands, 812 mailbox events, no missing
  required families, 3 game-over reports, winners `p1` and `p2`, game-over hashes `d6dbea7a`,
  `411262df`, and `5f3bf567`, and one report for each required release-path proof family.
- `git check-ignore -v` confirmed the generated strict aggregate remains ignored under
  `.gitignore:31:/artifacts/`.
- This is the strongest retained built-player aggregate for this run, but its status remains
  `incomplete-evidence`; it does not close arbitrary product-surface Local PvP, LAN/online/Visual
  Lab, or release-runtime TypeScript bridge packaging.

Validation:

- Strict positive aggregate command writing under ignored `artifacts/unity/built-player-smoke/`.
- `git check-ignore -v` for the generated strict aggregate.
- Touched-doc whitespace check.
- `git diff --check`.
- `git status --short --branch`.

## 2026-05-13 Strict Aggregate Scope/Parity Ledger Consistency Refresh

This continuation is documentation only. No gameplay, Unity runtime, Electron, shared-action,
bridge implementation, or generated artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

Goal: align the product scope map and full parity matrix with the strict 2026-05-13 built-player
aggregate as the latest retained built-player evidence, while keeping the status
`incomplete-evidence` and preserving the LAN, online, Visual Lab, arbitrary Local PvP, and
release-runtime TypeScript bridge packaging blockers.

Result:

- `docs/migration/unity-product-scope-map.md` now uses 2026-05-13 as the update date and cites
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-game-over-release-path.json`
  as the strongest retained built-player evidence for the run.
- `docs/migration/unity-full-parity-matrix.md` now lists the same strict aggregate in the latest
  evidence summary and 2026-05-11/12 continuation ledger.
- `docs/archive/unity-next-run-audit-note-2026-05-12.md` records this as a scope/parity ledger
  consistency refresh.
- The status remains `incomplete-evidence` because the strict aggregate is bounded LocalDev
  Windows-player evidence and does not close LAN, online, Visual Lab, arbitrary full
  product-surface Local PvP, or release-runtime TypeScript bridge packaging.

Validation:

- Search the touched migration docs for the strict aggregate path.
- Check touched docs for trailing whitespace.
- `git diff --check`.
- `git status --short --branch`.

## 2026-05-13 Strict Aggregate Checklist/Audit Consistency Refresh

This continuation is documentation only. No gameplay, Unity runtime, Electron, shared-action,
bridge implementation, or generated artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

Goal: remove remaining checklist/audit wording that treats the 2026-05-12 post-no-take-3 combined
aggregate as the latest built-player aggregate. The older aggregate remains retained evidence, but
the strict 2026-05-13 aggregate is now the strongest retained built-player evidence. This must not
change `Incomplete` or `incomplete-evidence` status.

Result:

- `docs/migration/unity-platform-release-checklist.md` now keeps the post-no-take-3 combined
  aggregate as retained evidence and names the strict 2026-05-13 aggregate as the strongest retained
  built-player aggregate.
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md` now includes the strict
  2026-05-13 aggregate in the prompt-to-artifact checklist, work-package audit, and required status
  separation.
- `docs/archive/unity-next-run-audit-note-2026-05-12.md` now marks the earlier post-no-take-3
  checklist/risk-table closeout as a historical step and points to the later strict aggregate.
- Status remains `Incomplete`; this was an evidence-ledger consistency refresh only.

Validation:

- Search the touched checklist and audit note for the strict aggregate path and stale "latest
  post-no-take-3" wording.
- Check touched docs for trailing whitespace.
- `git diff --check`.
- `git status --short --branch`.

## 2026-05-13 Built-Player Mailbox Response Audit Hardening

This continuation is tooling plus documentation only. No Unity gameplay, Electron gameplay,
shared-action, or bridge TypeScript contract changes are allowed for this slice. Allowed files:

- `tools/migration/run-unity-built-player-smoke.mjs`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

Goal: harden future built-player mailbox evidence so the launcher records the actual structured
bridge response before Unity consumes the response file. The current retained reports remain valid
bounded LocalDev evidence, but their mailbox event summaries can show `responseOk=false` after Unity
has already read and deleted the response. The launcher should keep a private audit response copy,
deliver the same JSON to Unity, and report structured `responseOk`, `responseActionType`, and
`rejectionCode` from the audit copy. This must not change gameplay behavior or upgrade
`incomplete-evidence` status.

Result:

- `tools/migration/run-unity-built-player-smoke.mjs` now runs the TypeScript bridge into
  `responses/audit/<request>.json`, reads that structured response for launcher evidence, then
  writes the same JSON to Unity's mailbox response path.
- `artifacts/unity/built-player-smoke/smoke-2026-05-13Tmailbox-audit.launcher.json` passed a
  minimal built Windows player smoke with exit code 0, no timeout, 2 audited mailbox responses,
  `responseOk=true` for `INIT` and `TAKE_GEMS`, one live recorded `take_gems` command, no fixture
  gameplay driver, no checkpoint state replacement, and final hash `ec648e6c`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-audit.json`
  validates the new report with status `incomplete-evidence`.
- The release checklist, completion report, risk table, and next-run audit note now record this as
  LocalDev mailbox evidence hardening only, not a release-runtime packaging decision.

Validation:

- `node --check tools/migration/run-unity-built-player-smoke.mjs`
- Run one small built-player smoke with the hardened launcher under ignored `artifacts/`.
- Inspect the new launcher report for audited mailbox response fields.
- `git check-ignore -v` for generated smoke artifacts.
- `git diff --check`.
- `git status --short --branch`.

## 2026-05-13 Built-Player Mailbox Audit Aggregate Guard

This continuation is tooling plus documentation only. No Unity gameplay, Electron gameplay,
shared-action, bridge TypeScript contract, or built-player automation entrypoint changes are allowed
for this slice. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

Goal: add an explicit aggregate verifier guard for the new audited mailbox response evidence. The
guard should be opt-in so older retained aggregates remain inspectable, but future mailbox-audited
reports can be checked for `auditResponse` paths and structured `responseOk` / rejection fields.
This must not change gameplay behavior or upgrade `incomplete-evidence` status.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now accepts
  `--require-audited-mailbox-responses`.
- Aggregate summaries now expose `totalAuditedMailboxResponseCount` and
  `totalSuccessfulMailboxResponseCount`.
- Positive validation wrote
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-audit-guard.json`
  from `smoke-2026-05-13Tmailbox-audit.launcher.json`; it passed with 2/2 audited successful
  mailbox responses and final hash `ec648e6c`.
- Negative validation wrote
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-audit-negative.json`
  from the older post-no-take-3 draft report and failed as expected with
  `Bridge mailbox did not record successful request handling.`
- This is aggregate evidence hardening only. It does not change `incomplete-evidence` status or
  close arbitrary product-surface Local PvP, LAN/online/Visual Lab, or release-runtime TypeScript
  bridge packaging.

Validation:

- `node --check tools/migration/summarize-unity-built-player-smokes.mjs`
- Positive aggregate check using `--require-audited-mailbox-responses` against
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Tmailbox-audit.launcher.json`.
- Negative aggregate check using `--require-audited-mailbox-responses` against an older retained
  launcher report that lacks audited mailbox response copies.
- `git check-ignore -v` for generated aggregate artifacts.
- `git diff --check`.
- `git status --short --branch`.

## 2026-05-13 Risk Table Consistency Refresh

This continuation is documentation-only. No Unity gameplay, Electron gameplay, shared-action,
bridge implementation, built-player automation, aggregate-tool, or generated artifact changes are
allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

Goal: align the migration risk table with the audited built-player breadth and preference evidence
added after the mailbox/rejection guard. The risk table must still preserve the same blockers:
bounded LocalDev evidence is not broad arbitrary Local PvP, the mailbox bridge is not release
runtime packaging, and LAN/online/Visual Lab remain open or blocked.

Result:

- `docs/migration/unity-migration-risk-table.md` now cites the audited breadth aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-breadth.json` and
  audited preference aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-preferences.json`
  in the live-product, mailbox-automation, and parity-scope risk rows.
- The same rows continue to distinguish bounded LocalDev evidence from broad arbitrary Local PvP
  and final release-runtime packaging.
- `docs/archive/unity-next-run-audit-note-2026-05-12.md` records the risk-table refresh as a docs
  consistency update only.

Validation:

- Search the risk table and audit note for `audited-breadth`, `audited-preferences`, and the
  unchanged blocker wording.
- Check touched docs for trailing whitespace.
- `git diff --check`.
- `git status --short --branch`.

## 2026-05-13 Audited Preference Breadth Smokes

This continuation is validation plus documentation only. No Unity gameplay, Electron gameplay,
shared-action, bridge TypeScript contract, built-player automation entrypoint, or aggregate-tool
source changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

Goal: add deterministic audited built Windows player breadth samples for non-balanced product-surface
preferences. The `reserve-first` sample should cover the visible reserve/cancel path through live
rules-engine commands; the `privilege-first` sample should cover privilege activation/use if the
seed produces a valid privilege opportunity. If a preference sample cannot cover the intended
family, record the exact observed families and keep the status incomplete rather than inflating the
claim.

Result:

- `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-reserve-first.launcher.json` passed
  a fresh built Windows player `reserve-first` smoke with seed
  `unity-built-player-audited-reserve-first-20260513`, 12 live commands, 13 audited successful
  mailbox responses, `reserve_card` and `cancel_gem_selection` families, no fixture gameplay
  driver, no checkpoint replacement, and final/reviewed hash `38d97b7f`.
- `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-privilege-first.launcher.json`
  passed a fresh built Windows player `privilege-first` smoke with seed
  `unity-built-player-audited-privilege-first-20260513`, 24 live commands, 25 audited successful
  mailbox responses, `take_gems`, `activate_privilege`, `use_privilege`, and `discard_gem`
  families, no fixture gameplay driver, no checkpoint replacement, and final/reviewed hash
  `62b67ebe`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-preferences.json`
  passed with `--require-audited-mailbox-responses` and required families
  `reserve_card,cancel_gem_selection,activate_privilege,use_privilege,take_gems,discard_gem`, 2/2
  reports, 36 commands, 38 audited successful mailbox responses, and status `incomplete-evidence`.

Validation:

- Run one `reserve-first` built Windows player smoke under ignored `artifacts/`.
- Run one `privilege-first` built Windows player smoke under ignored `artifacts/`.
- Aggregate successful samples with `--require-audited-mailbox-responses` and only the action
  families actually covered by the reports.
- Inspect report flags for fresh launch, no fixture driver, no checkpoint replacement, replay
  export/import/review hash preservation, and audited mailbox response counts.
- `git check-ignore -v` for generated smoke and aggregate artifacts.
- `git diff --check`.
- `git status --short --branch`.

## 2026-05-13 Audited Product-Surface Breadth Smoke

This continuation is validation plus documentation only. No Unity gameplay, Electron gameplay,
shared-action, bridge TypeScript contract, built-player automation entrypoint, or aggregate-tool
source changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

Goal: add one explicitly named fresh built Windows player product-surface breadth run after mailbox
audit hardening, so the audited response-copy path covers more than the minimal success smoke. The
run should remain bounded evidence, not arbitrary full Local PvP proof. It must start fresh through
`GemDuelGameController` / `IGameRulesEngine`, avoid fixture replay and checkpoint replacement,
record live replay events, export/import/review the replay, retain audited mailbox responses, and
aggregate with explicit required action families.

Result:

- `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-breadth.launcher.json` passed a
  fresh built Windows player `balanced` smoke with seed
  `unity-built-player-audited-breadth-20260513`, 24 live product-surface commands, 25 audited
  successful mailbox responses, no fixture gameplay driver, no checkpoint state replacement, and
  final replay hash `f934c91b`.
- The run covered `take_gems`, `buy_card`, `take_bonus_gem`, `discard_gem`, and `replenish`,
  exported/imported/reviewed 24 live replay events, and preserved reviewed final hash `f934c91b`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-breadth.json`
  passed with `--require-audited-mailbox-responses` and required families
  `take_gems,buy_card,take_bonus_gem,discard_gem,replenish`, 1/1 reports, 24 commands, 25 audited
  mailbox responses, and status `incomplete-evidence`.

Validation:

- Run one deterministic built Windows player breadth smoke under ignored `artifacts/`.
- Aggregate it with `--require-audited-mailbox-responses` and representative required action
  families.
- Inspect the launcher report and aggregate for audited response counts, action families, replay
  hash preservation, no fixture driver, and no checkpoint replacement.
- `git check-ignore -v` for generated smoke and aggregate artifacts.
- `git diff --check`.
- `git status --short --branch`.

## 2026-05-13 Audited Mailbox Rejection Guard Proof

This continuation is validation plus documentation only. No Unity gameplay, Electron gameplay,
shared-action, bridge TypeScript contract, built-player automation entrypoint, or aggregate-tool
source changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

Goal: prove the audited mailbox aggregate guard covers expected rejection-path bridge responses, not
only successful commands. Run a fresh built Windows player invalid-action smoke with the hardened
launcher, then aggregate it with both `--require-audited-mailbox-responses` and
`--require-invalid-action-release-path`. The launcher report must retain audit response paths and
structured rejection codes for expected invalid commands while preserving `incomplete-evidence`
status.

Result:

- `artifacts/unity/built-player-smoke/smoke-2026-05-13Tmailbox-rejection-audit.launcher.json`
  passed a fresh built Windows player invalid-action smoke with exit code 0, no timeout, 9 audited
  mailbox responses, 3 successful bridge calls, and 6 expected rejection responses.
- The rejection mailbox responses retained `auditResponse` paths and structured rejection codes:
  5 `COMMAND_REJECTED` responses and 1 `INVALID_ACTOR` response.
- The invalid-action release-path report rejected `SELECT_BUFF`, `REROLL_DRAFT_POOL`, empty
  `TAKE_GEMS`, `CANCEL_RESERVE`, `CLOSE_MODAL`, and inactive-actor `TAKE_GEMS` without state hash
  mutation or replay event recording; final invalid-action hash remained `f2780c3f`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-rejection-audit.json`
  passed with `--require-audited-mailbox-responses` and `--require-invalid-action-release-path`,
  1/1 reports, 9 audited mailbox responses, 3 successful responses, and status
  `incomplete-evidence`.

Validation:

- Run one built Windows player invalid-action smoke under ignored `artifacts/`.
- Aggregate the new launcher report with `--require-audited-mailbox-responses` and
  `--require-invalid-action-release-path`.
- Inspect mailbox events for successful `responseOk=true` events and expected rejection events with
  retained `auditResponse` paths plus structured rejection codes.
- `git check-ignore -v` for generated smoke and aggregate artifacts.
- `git diff --check`.
- `git status --short --branch`.

## 2026-05-13 Completion Audit Audited-Evidence Ledger Refresh

This continuation is documentation-only. No Unity gameplay, Electron gameplay, shared-action,
bridge implementation, built-player automation, aggregate-tool, or generated artifact changes are
allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`
- `docs/archive/README.md`

Goal: align the replacement-candidate completion audit with the latest audited built-player
breadth and preference evidence already recorded in the migration docs. The refresh must preserve
`Incomplete` status because the new evidence remains bounded LocalDev mailbox evidence and does not
solve arbitrary product-surface Local PvP, LAN/online/Visual Lab, or final release-runtime
packaging.

Planned validation:

- Search the completion audit and archive index for the audited breadth/preference evidence names.
- Check touched docs for trailing whitespace.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md` now cites the
  audited 2026-05-13 mailbox success, rejection, balanced breadth, reserve-first, and
  privilege-first launcher reports alongside the strict aggregate.
- The completion audit now records audited breadth/preference replay hashes `f934c91b`,
  `38d97b7f`, and `62b67ebe`, plus mailbox audit hashes `ec648e6c` and `f2780c3f`, while
  preserving the same `Incomplete` status and blocker set.
- `docs/archive/unity-next-run-audit-note-2026-05-12.md` and `docs/archive/README.md` now label
  the 2026-05-12 completion audit as updated through audited breadth/preference evidence.

## 2026-05-13 Combined Audited Mailbox Aggregate

This continuation is validation plus documentation only. No Unity gameplay, Electron gameplay,
shared-action, bridge TypeScript contract, built-player automation entrypoint, aggregate-tool source,
or generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

Goal: produce one ignored machine-readable aggregate over the audited mailbox success, rejection,
balanced breadth, reserve-first, and privilege-first built-player launcher reports. The aggregate
must require audited mailbox responses, the invalid-action release-path proof, and only the action
families actually present in these audited reports. It remains bounded LocalDev evidence and must
not change `Incomplete` or `incomplete-evidence` status.

Planned validation:

- Run `tools/migration/summarize-unity-built-player-smokes.mjs` with
  `--require-audited-mailbox-responses`, `--require-invalid-action-release-path`, and the audited
  action-family set.
- Inspect the aggregate summary for report count, audited response count, successful response count,
  action families, and final hashes.
- `git check-ignore -v` for the generated aggregate.
- Search updated docs for the aggregate path and unchanged blocker language.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined.json`
  passed with `--require-audited-mailbox-responses`, `--require-invalid-action-release-path`, and
  required families `activate_privilege`, `buy_card`, `cancel_gem_selection`, `discard_gem`,
  `replenish`, `reserve_card`, `take_bonus_gem`, `take_gems`, and `use_privilege`.
- The aggregate validates 5/5 audited launcher reports, 62 live commands, 74 mailbox events, 74
  audited mailbox responses, 68 successful mailbox responses, one invalid-action release-path
  report, final hashes `38d97b7f`, `3b479090`, `62b67ebe`, `ec648e6c`, and `f934c91b`, and
  invalid-action hash `f2780c3f`.
- `git check-ignore -v` confirmed the generated aggregate is ignored under `.gitignore:31:/artifacts/`.
- The release checklist, completion report, full parity matrix, risk table, completion audit, and
  next-run audit note now record the combined aggregate as bounded LocalDev evidence only.

## 2026-05-13 Audited Built-Player Game-Over Proof

This continuation is validation plus documentation only. No Unity gameplay, Electron gameplay,
shared-action, bridge TypeScript contract, built-player automation entrypoint, aggregate-tool source,
or generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

Goal: close the auditability gap where the earlier audited mailbox subset had bounded breadth and
preference samples but no completed-game proof. Rerun one deterministic built Windows player
game-over seed through the current audited mailbox launcher, then aggregate it with both
`--require-audited-mailbox-responses` and `--require-game-over-count 1`. This remains bounded
LocalDev evidence and must not change `Incomplete` or `incomplete-evidence` status.

Planned validation:

- Run the deterministic built Windows player game-over smoke from a fresh process with the current
  mailbox-audit launcher.
- Aggregate the launcher report with `--require-audited-mailbox-responses`,
  `--require-game-over-count 1`, and the action families observed in the completed run.
- Inspect the launcher report and aggregate for exit code, timeout, audited response count, winner,
  live command count, replay hash preservation, no fixture driver, and no checkpoint replacement.
- `git check-ignore -v` for the generated smoke and aggregate artifacts.
- Search updated docs for the aggregate path and unchanged blocker language.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-game-over-1.launcher.json` passed a
  fresh built Windows player `balanced` game-over smoke with seed
  `unity-built-player-game-over-20260512`, exit code 0, no timeout, 98 live product-surface
  commands, 99 mailbox events, 99 audited successful mailbox responses, winner `p1`, final state
  hash `d6dbea7a`, and reviewed replay hash `d6dbea7a`.
- The run covered `buy_card`, `choose_royal`, `discard_gem`, `replenish`,
  `select_joker_color`, `steal_gem`, `take_bonus_gem`, and `take_gems`, exported/reviewed 98 live
  replay events, and recorded no failure reason.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over.json`
  passed with `--require-audited-mailbox-responses`, `--require-game-over-count 1`, and the eight
  observed action families: 1/1 reports, 98 commands, 99 mailbox events, 99 audited mailbox
  responses, one game-over report, winner `p1`, game-over hash `d6dbea7a`, and status
  `incomplete-evidence`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over.json`
  then combined the audited mailbox success, rejection, balanced breadth, reserve-first,
  privilege-first, and audited game-over launcher reports in one stricter audit. It passed with
  `--require-audited-mailbox-responses`, `--require-invalid-action-release-path`,
  `--require-game-over-count 1`, and twelve observed action families: 6/6 reports, 160 commands,
  173 mailbox events, 173 audited mailbox responses, 167 successful mailbox responses, one
  invalid-action release-path report, one game-over report, winner `p1`, game-over hash
  `d6dbea7a`, invalid-action hash `f2780c3f`, and status `incomplete-evidence`.
- `git check-ignore -v` confirmed the generated launcher report, nested smoke report, and aggregate
  are ignored under `.gitignore:31:/artifacts/`.
- The accidental default launcher report from the earlier option-inspection mistake is not used as
  migration evidence.

## 2026-05-13 Audited Built-Player P2 Game-Over Proof

This continuation is validation plus documentation only. No Unity gameplay, Electron gameplay,
shared-action, bridge TypeScript contract, built-player automation entrypoint, aggregate-tool source,
or generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

Goal: close the remaining audited game-over winner-breadth gap by rerunning the two deterministic
`p2` winner seeds through the current audited mailbox launcher. Aggregate the existing audited `p1`
game-over report plus the two new audited `p2` reports with `--require-audited-mailbox-responses`
and `--require-game-over-count 3`. This remains bounded LocalDev evidence and must not change
`Incomplete` or `incomplete-evidence` status.

Planned validation:

- Run deterministic built Windows player game-over smokes for
  `unity-built-player-game-over-alt-1-20260512` and
  `unity-built-player-game-over-alt-2-20260512` from fresh processes with the current mailbox-audit
  launcher.
- Aggregate the existing audited `p1` game-over launcher report and the two new audited `p2`
  launcher reports with `--require-audited-mailbox-responses`, `--require-game-over-count 3`, and
  the observed action-family set.
- Inspect launcher reports and aggregate for exit code, timeout, audited response counts, winners,
  live command counts, replay hash preservation, no fixture driver, and no checkpoint replacement.
- `git check-ignore -v` for generated smoke and aggregate artifacts.
- Search updated docs for the aggregate path and unchanged blocker language.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-game-over-p2-1.launcher.json`
  passed a fresh built Windows player `balanced` game-over smoke with seed
  `unity-built-player-game-over-alt-1-20260512`, exit code 0, no timeout, 98 live product-surface
  commands, 99 mailbox events, 99 audited successful mailbox responses, winner `p2`, final state
  hash `411262df`, and reviewed replay hash `411262df`.
- `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-game-over-p2-2.launcher.json`
  passed a fresh built Windows player `balanced` game-over smoke with seed
  `unity-built-player-game-over-alt-2-20260512`, exit code 0, no timeout, 92 live product-surface
  commands, 93 mailbox events, 93 audited successful mailbox responses, winner `p2`, final state
  hash `5f3bf567`, and reviewed replay hash `5f3bf567`.
- Both runs covered `buy_card`, `choose_royal`, `discard_gem`, `replenish`,
  `select_joker_color`, `steal_gem`, `take_bonus_gem`, and `take_gems`, exported/reviewed live
  Replay vNext events, and recorded no failure reason.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over-winner-breadth.json`
  passed with `--require-audited-mailbox-responses`, `--require-game-over-count 3`, and the eight
  observed action families across the existing audited `p1` game-over report plus the two new
  audited `p2` reports: 3/3 reports, 288 commands, 291 mailbox events, 291 audited successful
  mailbox responses, winners `p1` and `p2`, game-over hashes `d6dbea7a`, `411262df`, and
  `5f3bf567`, and status `incomplete-evidence`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-breadth.json`
  then combined the audited mailbox success, rejection, balanced breadth, reserve-first,
  privilege-first, audited `p1` game-over, and the two audited `p2` game-over launcher reports. It
  passed with `--require-audited-mailbox-responses`, `--require-invalid-action-release-path`,
  `--require-game-over-count 3`, and twelve observed action families: 8/8 reports, 350 commands,
  365 mailbox events, 365 audited mailbox responses, 359 successful mailbox responses, one
  invalid-action release-path report, three game-over reports, winners `p1` and `p2`, game-over
  hashes `d6dbea7a`, `411262df`, and `5f3bf567`, invalid-action hash `f2780c3f`, and status
  `incomplete-evidence`.
- `git check-ignore -v` confirmed the two new launcher reports, nested smoke reports, and both
  aggregate reports are ignored under `.gitignore:31:/artifacts/`.

## 2026-05-13 Built-Player Game-Over Winner Guard

This continuation is aggregate-tool hardening plus documentation only. No Unity gameplay, Electron
gameplay, shared-action, bridge TypeScript contract, built-player launcher, or generated tracked
artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

Goal: make audited game-over winner breadth machine-enforced by extending the built-player smoke
matrix summarizer with a required-winner option. Re-run the audited game-over winner-breadth and
combined audited aggregates with required winners `p1,p2`; also prove the guard fails closed when
only the audited `p2` reports are supplied. This remains bounded LocalDev evidence and must not
change `Incomplete` or `incomplete-evidence` status.

Planned validation:

- Add `--require-game-over-winner <winner[,winner...]>` to
  `tools/migration/summarize-unity-built-player-smokes.mjs`.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs`.
- Positive aggregate: audited `p1` plus two audited `p2` game-over reports with
  `--require-audited-mailbox-responses`, `--require-game-over-count 3`, and
  `--require-game-over-winner p1,p2`.
- Positive combined aggregate: audited success, rejection, breadth, reserve-first,
  privilege-first, and three audited game-over reports with required winners `p1,p2`.
- Negative guard check: only the two audited `p2` launcher reports must fail when requiring
  `--require-game-over-winner p1,p2`.
- Search updated docs for the new required-winner option and unchanged blocker language.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now accepts
  `--require-game-over-winner <winner[,winner...]>`, stores required winners in the matrix `check`
  object, and fails closed when a required winner is not present among completed game-over reports.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed.
- `pnpm exec prettier --write tools/migration/summarize-unity-built-player-smokes.mjs` formatted
  the summarizer, and `pnpm exec eslint tools/migration/summarize-unity-built-player-smokes.mjs`
  passed after formatting.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over-winner-guard.json`
  passed with `--require-audited-mailbox-responses`, `--require-game-over-count 3`,
  `--require-game-over-winner p1,p2`, and the eight observed game-over action families. It
  validates 3/3 audited game-over reports, 288 live commands, 291 audited successful mailbox
  responses, winners `p1` and `p2`, game-over hashes `d6dbea7a`, `411262df`, and `5f3bf567`, and
  status `incomplete-evidence`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-guard.json`
  passed with audited mailbox responses, invalid-action release-path proof, at least three
  game-over reports, and winners `p1,p2` all required. It validates 8/8 reports, 350 commands, 365
  mailbox events, 365 audited mailbox responses, 359 successful responses, one invalid-action
  release-path report, three game-over reports, winners `p1` and `p2`, game-over hashes
  `d6dbea7a`, `411262df`, and `5f3bf567`, invalid-action hash `f2780c3f`, and status
  `incomplete-evidence`.
- The intentional negative guard
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over-winner-guard-negative.json`
  failed as expected against only the two audited `p2` launcher reports with
  `Required built-player game-over winner was not covered: p1`.

## 2026-05-13 Strict Built-Player Winner Guard Aggregate

This continuation is aggregate validation plus documentation only. No Unity gameplay, Electron
gameplay, shared-action, bridge TypeScript contract, built-player launcher, aggregate-tool source,
or generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `docs/archive/unity-next-run-audit-note-2026-05-12.md`

Goal: re-run the strongest retained 27-report built-player strict aggregate with the new
`--require-game-over-winner p1,p2` guard, while preserving all 21 action-family requirements,
every current release-path proof flag, and `--require-game-over-count 3`. This should produce a
single strict built-player aggregate that requires release-path breadth and winner breadth together.
It remains bounded LocalDev evidence and must not change `Incomplete` or `incomplete-evidence`
status.

Planned validation:

- Extract the 27 retained launcher report inputs from
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-game-over-release-path.json`.
- Run `tools/migration/summarize-unity-built-player-smokes.mjs` with all strict release-path flags,
  all 21 required action families, `--require-game-over-count 3`, and
  `--require-game-over-winner p1,p2`.
- Verify the generated aggregate is ignored under `.gitignore:31:/artifacts/`.
- Search updated docs for the new aggregate path and unchanged blocker language.
- `git diff --check`.
- `git status --short --branch`.

Result:

- Extracted the 27 retained launcher report paths from
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-game-over-release-path.json`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-game-over-winner-release-path.json`
  passed with all strict requirements plus `--require-game-over-winner p1,p2`: 27/27 reports, 716
  live commands, 812 mailbox events, all 21 required action families, every current release-path
  proof flag, 3 game-over reports, winners `p1` and `p2`, game-over hashes `d6dbea7a`,
  `411262df`, and `5f3bf567`, no missing required families, no missing required winners, and
  status `incomplete-evidence`.
- The generated matrix retains the standard blocker list: bounded built-player LocalDev smoke is
  not arbitrary full product-surface Local PvP, `TypeScriptGameRulesEngine` release-runtime
  packaging is unresolved, and LAN, online, and Visual Lab are not migrated or user-approved
  excluded.
- `git check-ignore -v` confirmed
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-game-over-winner-release-path.json`
  is ignored under `.gitignore:31:/artifacts/`.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs` and
  `pnpm exec eslint tools/migration/summarize-unity-built-player-smokes.mjs` passed.
- `git diff --check` passed with the existing CRLF warnings only for migration markdown files.
- `Get-Process Unity,GemDuelUnity -ErrorAction SilentlyContinue` returned no running Unity player
  or editor process.

## 2026-05-13 Date-Appropriate Next-Run Audit Note

This continuation is documentation-only. No Unity gameplay, Electron gameplay, shared-action,
bridge TypeScript contract, built-player launcher, aggregate-tool source, or generated tracked
artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/README.md`

Goal: create a concise date-appropriate next-run audit note for the current May 13 continuation, so
future runs do not have to treat the long May 12 note as the only handoff artifact. The note must
preserve `Incomplete` status, cite the strongest retained built-player evidence, and name the
remaining blockers.

Planned validation:

- Create `docs/archive/unity-next-run-audit-note-2026-05-13.md`.
- Link the note from `docs/archive/README.md`.
- Search the archive index and note for the new path, `Incomplete`, and blocker language.
- `git diff --check`.
- `git status --short --branch`.

Result:

- Created `docs/archive/unity-next-run-audit-note-2026-05-13.md` with concise handoff evidence,
  latest lightweight validation, and remaining blockers.
- Linked the note from `docs/archive/README.md`.

## 2026-05-13 Audited Replay Release-Path Built-Player Proof

This continuation is validation plus documentation only. No Unity gameplay, Electron gameplay,
shared-action, bridge TypeScript contract, built-player launcher, aggregate-tool source, or
generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`

Goal: rerun the built Windows player replay release-path proof through the current mailbox-audited
launcher, then aggregate it with both `--require-audited-mailbox-responses` and
`--require-replay-release-path`. This closes one auditability gap in the release-path subset only.
It remains bounded LocalDev evidence and must not change `Incomplete` or `incomplete-evidence`
status.

Planned validation:

- Run a deterministic built Windows player replay release-path smoke from a fresh process with the
  current mailbox-audit launcher.
- Aggregate the new launcher report with `--require-audited-mailbox-responses`,
  `--require-replay-release-path`, and the observed action-family set.
- Inspect the launcher report and aggregate for exit code, timeout, audited response count, replay
  release-path coverage, replay hash preservation, no fixture driver, and no checkpoint
  replacement.
- `git check-ignore -v` for generated smoke and aggregate artifacts.
- Search updated docs for the aggregate path and unchanged blocker language.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-replay-release-path.launcher.json`
  passed from a fresh built Windows player process with seed
  `unity-built-player-audited-replay-release-path-20260513`, exit code 0, no timeout, 8 live
  product-surface commands, 9 mailbox events, 9 audited successful mailbox responses, final state
  hash `f9eb9e83`, and reviewed replay hash `f9eb9e83`.
- The nested replay release-path report covered `invalid_json`, `missing_file`,
  `unsupported_schema`, `malformed_bootstrap`, `malformed_draft_bootstrap`, `corrupted_summary`,
  `hash_mismatch`, `failed_overwrite_load`, and `valid_overwrite_reload_review` without fixture
  gameplay or checkpoint state replacement.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path.json`
  passed with `--require-audited-mailbox-responses`, `--require-replay-release-path`, and required
  families `discard_gem` and `take_gems`: 1/1 report, 8 commands, 9 mailbox events, 9 audited
  successful mailbox responses, full replay release-path coverage, final hash `f9eb9e83`, and
  status `incomplete-evidence`.
- `git check-ignore -v` confirmed the generated launcher report, nested report, aggregate, and
  replay release-path files remain ignored under `.gitignore:31:/artifacts/`.
- `git diff --check` passed with the existing CRLF warnings only for migration markdown files.
- `Get-Process Unity,GemDuelUnity -ErrorAction SilentlyContinue` returned no running Unity player
  or editor process.

## 2026-05-13 Mailbox Audit-File Hardening

This continuation is aggregate-tool hardening plus focused tests and documentation. No Unity
gameplay, Electron gameplay, shared-action, bridge TypeScript contract, built-player launcher, or
generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`

Goal: make `--require-audited-mailbox-responses` prove that every retained mailbox audit-response
path in a launcher report still exists, parses as JSON, and matches the event's response summary.
This hardens built-player evidence auditability only. It remains bounded LocalDev evidence and must
not change `Incomplete` or `incomplete-evidence` status.

Planned validation:

- Add focused tests proving the summarizer fails closed when an audited response path is missing or
  mismatched.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Re-run the audited replay release-path aggregate with `--require-audited-mailbox-responses`.
- Re-run the strict winner-release aggregate with `--require-audited-mailbox-responses` where
  retained audit files are present.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs`.
- `pnpm exec prettier --check tools/migration/summarize-unity-built-player-smokes.mjs
tools/migration/summarize-unity-built-player-smokes.test.ts`.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now resolves every retained mailbox
  `auditResponse` path against the launcher's mailbox directory, verifies the file exists, parses
  JSON, and checks that `ok`, `actionType`, and rejection code match the launcher event summary
  whenever `--require-audited-mailbox-responses` is enabled.
- Added `tools/migration/summarize-unity-built-player-smokes.test.ts`, covering the passing
  file-backed case plus fail-closed missing-file, invalid-JSON, and mismatched-summary cases.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed with
  4/4 tests.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed.
- `pnpm exec eslint tools/migration/summarize-unity-built-player-smokes.mjs` passed. Running ESLint
  against the focused `.test.ts` path returned exit 0 with the existing "File ignored because no
  matching configuration was supplied" warning, so the Vitest target is the active test evidence.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-filebacked.json`
  passed with `--require-audited-mailbox-responses`, `--require-replay-release-path`, required
  families `discard_gem,take_gems`, 1/1 report, 8 commands, 9 mailbox events, 9 audited mailbox
  responses, 9 valid parsed audit response files, final/review hash `f9eb9e83`, and status
  `incomplete-evidence`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-filebacked.json`
  passed with `--require-audited-mailbox-responses`, `--require-invalid-action-release-path`,
  `--require-game-over-count 3`, `--require-game-over-winner p1,p2`, the twelve observed audited
  action families, 8/8 reports, 350 commands, 365 mailbox events, 365 valid parsed audit response
  files, one invalid-action release-path report, winners `p1` and `p2`, and status
  `incomplete-evidence`.

## 2026-05-13 Mailbox Audit Invalid-JSON Negative Test

This continuation is focused test hardening plus evidence wording only. No Unity gameplay, Electron
gameplay, shared-action, bridge contract, built-player launcher, aggregate-tool source, or generated
tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`

Goal: prove the file-backed mailbox audit guard also fails closed when a retained audit response
file exists but is not valid JSON. The implementation already reports this failure; the test suite
must cover it because the evidence docs state that retained audit responses must parse. This remains
bounded LocalDev evidence hardening and must not change `Incomplete` or `incomplete-evidence`
status.

Planned validation:

- Add a focused invalid-JSON negative test to
  `tools/migration/summarize-unity-built-player-smokes.test.ts`.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`.
- `pnpm exec prettier --check tools/migration/summarize-unity-built-player-smokes.test.ts`.
- `git diff --check`.
- `git status --short --branch`.

Result:

- Added the invalid-JSON negative test to the focused summarizer suite.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed with
  4/4 tests, including missing-file, invalid-JSON, and mismatched-summary fail-closed cases.
- Updated the release checklist, completion report, risk table, next-run audit note, and completion
  audit to cite 4/4 focused tests and the invalid-JSON failure path.
- `pnpm exec prettier --write` normalized markdown wrapping after the evidence refresh.
- This is mailbox evidence hardening only; status remains `Incomplete`.

## 2026-05-13 Built-Player Executable Path Guard

This continuation is aggregate-tool hardening plus focused tests and evidence wording only. No
Unity gameplay, Electron gameplay, shared-action, bridge contract, built-player launcher, or
generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`

Goal: make the built-player aggregate proof fail closed unless the launcher report references an
existing executable under the governed ignored Windows build output
`artifacts/unity/build/windows/`. This prevents path-only or editor/temporary executable claims
from satisfying the built-player proof. It remains bounded LocalDev evidence hardening and must not
change `Incomplete` or `incomplete-evidence` status.

Planned validation:

- Add executable existence and build-output path assertions to
  `tools/migration/summarize-unity-built-player-smokes.mjs`.
- Extend `tools/migration/summarize-unity-built-player-smokes.test.ts` to keep its passing fixture
  under ignored `artifacts/unity/build/windows/` and to fail closed for missing/outside executable
  paths.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Re-run at least one retained file-backed audited aggregate through the new executable-path guard.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs`.
- `pnpm exec prettier --check tools/migration/summarize-unity-built-player-smokes.mjs
tools/migration/summarize-unity-built-player-smokes.test.ts`.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now resolves `launcher.exe`, requires
  it to exist as a file, and requires it to be under `artifacts/unity/build/windows/`.
- The focused test fixture now creates its passing fake executable under ignored
  `artifacts/unity/build/windows/`, and the test suite covers fail-closed missing-executable and
  outside-build-path cases.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed with
  6/6 tests.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-exe-guard.json`
  passed with 1/1 report, 9 mailbox events, 9 valid parsed audit response files, and hash
  `f9eb9e83`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-exe-guard.json`
  passed with 8/8 reports, 350 commands, 365 mailbox events, 365 valid parsed audit response files,
  one invalid-action release-path report, three game-over reports, winners `p1`/`p2`, and status
  `incomplete-evidence`.
- `git check-ignore -v` confirmed both generated executable-guard aggregate artifacts remain
  ignored under `.gitignore:31:/artifacts/`.
- This is built-player evidence hardening only; status remains `Incomplete`.

## 2026-05-13 Built-Player Stdout Capture Guard

This continuation is aggregate-tool hardening plus focused tests and evidence wording only. No
Unity gameplay, Electron gameplay, shared-action, bridge contract, built-player launcher, or
generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`

Goal: make the built-player aggregate proof fail closed unless the captured stdout log exists and is
non-empty. The original prompt requires stdout/log evidence, and path existence alone is a weak
proxy. This remains bounded LocalDev evidence hardening and must not change `Incomplete` or
`incomplete-evidence` status.

Planned validation:

- Add stdout byte-size validation to `tools/migration/summarize-unity-built-player-smokes.mjs`.
- Extend `tools/migration/summarize-unity-built-player-smokes.test.ts` with a fail-closed empty
  stdout case.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Re-run retained replay and combined executable-guard aggregates.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs`.
- `pnpm exec prettier --check tools/migration/summarize-unity-built-player-smokes.mjs
tools/migration/summarize-unity-built-player-smokes.test.ts`.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now records `stdoutBytes` and fails
  closed when the retained stdout path is missing or empty.
- The focused test suite now covers a fail-closed empty-stdout case.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed with
  7/7 tests.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stdout-guard.json`
  passed with 1/1 report, 9 mailbox events, 9 valid parsed audit response files, non-empty stdout,
  and hash `f9eb9e83`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stdout-guard.json`
  passed with 8/8 reports, 350 commands, 365 mailbox events, 365 valid parsed audit response files,
  non-empty stdout logs, one invalid-action release-path report, three game-over reports, winners
  `p1`/`p2`, and status `incomplete-evidence`.
- This is stdout evidence hardening only; status remains `Incomplete`.

## 2026-05-13 Built-Player Player-Log Byte Guard

This continuation is aggregate-tool hardening plus focused tests and evidence wording only. No
Unity gameplay, Electron gameplay, shared-action, bridge contract, built-player launcher, or
generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`

Goal: make the built-player aggregate proof fail closed unless the captured Unity player log exists,
is non-empty, and matches the launcher's reported byte count. This keeps stdout/player-log evidence
file-backed instead of trusting metadata alone. It remains bounded LocalDev evidence hardening and
must not change `Incomplete` or `incomplete-evidence` status.

Planned validation:

- Add actual player-log byte-size validation to
  `tools/migration/summarize-unity-built-player-smokes.mjs`.
- Extend `tools/migration/summarize-unity-built-player-smokes.test.ts` with fail-closed empty-log
  and mismatched-byte-count cases.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Re-run retained replay and combined player-log-guard aggregates.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs`.
- `pnpm exec prettier --check tools/migration/summarize-unity-built-player-smokes.mjs
tools/migration/summarize-unity-built-player-smokes.test.ts`.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now records actual retained Unity
  player-log byte size as `playerLogBytes`, records the launcher-reported byte count as
  `reportedPlayerLogBytes`, and fails closed when the retained player log is missing, empty, or
  does not match the launcher's reported byte count.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 9/9, including the existing
  file-backed mailbox, executable-path, and stdout guards plus new empty-player-log and
  mismatched-player-log-byte negative cases.
- The player-log-guard replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-playerlog-guard.json`
  passed 1/1 with 9/9 valid parsed audit response files and replay hash `f9eb9e83`.
- The combined player-log-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-playerlog-guard.json`
  passed 8/8 with 350 commands, 365 mailbox events, 365/365 valid parsed audit response files,
  one invalid-action release-path report, three game-over reports, winners `p1`/`p2`, and status
  `incomplete-evidence`.
- This is player-log evidence hardening only; status remains `Incomplete`.

## 2026-05-13 TypeScript Bridge Output Temp Cleanup Guard

This continuation is LocalDev bridge-boundary hardening only. It must not change Unity gameplay,
Electron gameplay, shared gameplay contracts, product-scope status, or release-runtime packaging
status. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `tools/migration/unity-rules-engine-bridge.ts`
- `tools/migration/unity-rules-engine-bridge.test.ts`

Goal: make the TypeScript bridge CLI clean up its atomic `--out` temp response file if response
publication fails. The built-player mailbox path depends on output-file responses, and a failed
rename/write must not leave stale response-like temp files that can confuse later evidence. This is
not a new runtime, SDK, server, or packaging strategy.

Planned validation:

- Add best-effort temp-output cleanup around the bridge CLI `--out` write/rename path.
- Add a focused Vitest case that forces `--out` publication failure and asserts the temp output
  file is removed.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts`.
- `pnpm exec prettier --check tools/migration/unity-rules-engine-bridge.ts
tools/migration/unity-rules-engine-bridge.test.ts docs/migration/current-migration-task-plan.md`.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `tools/migration/unity-rules-engine-bridge.ts` now wraps the CLI `--out` atomic write/rename path
  in best-effort temp-file cleanup. If response publication fails after the temp file is written,
  the `.tmp` response file is removed before the original error is rethrown.
- `tools/migration/unity-rules-engine-bridge.test.ts` now forces `--out` publication failure by
  targeting an existing directory and asserts that no `response.json.*.tmp` file remains.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed 33/33.
- This is LocalDev/evidence bridge hardening only; status remains `Incomplete`, and the
  release-runtime packaging decision remains unresolved.

## 2026-05-13 Built-Player Stdout Byte Guard

This continuation is aggregate-tool hardening plus focused tests and evidence wording only. No
Unity gameplay, Electron gameplay, shared-action, bridge contract, built-player launcher, or
generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`

Goal: make the built-player aggregate proof fail closed unless the retained stdout file exists, is
non-empty, and matches the launcher's reported `stdoutBytes` value. This mirrors the player-log
byte guard and prevents metadata-only stdout claims. It remains bounded LocalDev evidence hardening
and must not change `Incomplete` or `incomplete-evidence` status.

Planned validation:

- Add reported stdout byte-size validation to
  `tools/migration/summarize-unity-built-player-smokes.mjs`.
- Extend `tools/migration/summarize-unity-built-player-smokes.test.ts` with a mismatched stdout
  byte-count case.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Re-run retained replay and combined stdout-byte-guard aggregates.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs`.
- `pnpm exec prettier --check tools/migration/summarize-unity-built-player-smokes.mjs
tools/migration/summarize-unity-built-player-smokes.test.ts docs/migration/current-migration-task-plan.md`.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now records
  `reportedStdoutBytes` and fails closed when the launcher-reported `stdoutBytes` value is missing
  or does not match the retained stdout file size.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 10/10, adding the
  mismatched-stdout-byte negative case to the existing file-backed mailbox, executable-path,
  stdout, and player-log guards.
- The stdout-byte-guard replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stdout-byte-guard.json`
  passed 1/1 with 9/9 valid parsed audit response files and replay hash `f9eb9e83`.
- The combined stdout-byte-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stdout-byte-guard.json`
  passed 8/8 with 350 commands, 365 mailbox events, 365/365 valid parsed audit response files,
  one invalid-action release-path report, three game-over reports, winners `p1`/`p2`, and status
  `incomplete-evidence`.
- This is stdout evidence hardening only; status remains `Incomplete`.

## 2026-05-13 Built-Player Stderr Byte Guard

This continuation is aggregate-tool hardening plus focused tests and evidence wording only. No
Unity gameplay, Electron gameplay, shared-action, bridge contract, built-player launcher, or
generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`

Goal: make the built-player aggregate proof fail closed unless the retained stderr file exists and
matches the launcher's reported `stderrBytes` value. Stderr is allowed to be empty for successful
runs, so this guard verifies file-backed metadata without imposing a non-empty stderr requirement.
It remains bounded LocalDev evidence hardening and must not change `Incomplete` or
`incomplete-evidence` status.

Planned validation:

- Add stderr path and reported byte-size validation to
  `tools/migration/summarize-unity-built-player-smokes.mjs`.
- Extend `tools/migration/summarize-unity-built-player-smokes.test.ts` with missing-stderr-file and
  mismatched-stderr-byte cases.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Re-run retained replay and combined stderr-byte-guard aggregates.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs`.
- `pnpm exec prettier --check tools/migration/summarize-unity-built-player-smokes.mjs
tools/migration/summarize-unity-built-player-smokes.test.ts docs/migration/current-migration-task-plan.md`.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now records `stderrBytes`,
  `reportedStderrBytes`, and aggregate `stderrLogs`, and fails closed when the retained stderr file
  is missing or does not match the launcher's reported `stderrBytes` value. Empty stderr remains
  valid for successful runs.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 12/12, adding missing-stderr
  and mismatched-stderr-byte negative cases to the existing file-backed mailbox, executable-path,
  stdout, stdout-byte, and player-log guards.
- The stderr-byte-guard replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stderr-byte-guard.json`
  passed 1/1 with 9/9 valid parsed audit response files, replay hash `f9eb9e83`, and retained
  stdout/stderr/player-log paths in the summary.
- The combined stderr-byte-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stderr-byte-guard.json`
  passed 8/8 with 350 commands, 365 mailbox events, 365/365 valid parsed audit response files,
  one invalid-action release-path report, three game-over reports, winners `p1`/`p2`, retained
  stdout/stderr/player-log paths, and status `incomplete-evidence`.
- This is stderr evidence hardening only; status remains `Incomplete`.

## 2026-05-13 Built-Player Nested Smoke Report Guard

This continuation is aggregate-tool hardening plus focused tests and evidence wording only. No
Unity gameplay, Electron gameplay, shared-action, bridge contract, built-player launcher, or
generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`

Goal: make the built-player aggregate proof fail closed unless the retained nested smoke report
file exists, parses as JSON, and matches the smoke report embedded in the launcher JSON. The
launcher report already records the nested report path; this guard prevents path-only or stale
nested report evidence from satisfying built-player proof. It remains bounded LocalDev evidence
hardening and must not change `Incomplete` or `incomplete-evidence` status.

Planned validation:

- Add nested smoke-report JSON parsing and launcher-embedded report comparison to
  `tools/migration/summarize-unity-built-player-smokes.mjs`.
- Extend `tools/migration/summarize-unity-built-player-smokes.test.ts` with invalid nested report
  JSON and mismatched nested report cases.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Re-run retained replay and combined nested-smoke-report-guard aggregates.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs`.
- `pnpm exec prettier --check tools/migration/summarize-unity-built-player-smokes.mjs
tools/migration/summarize-unity-built-player-smokes.test.ts docs/migration/current-migration-task-plan.md`.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now parses the retained nested smoke
  report file and fails closed when the file is missing, invalid JSON, or does not match the
  launcher-embedded smoke report.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 15/15, adding missing,
  invalid-JSON, and mismatched nested-smoke-report negative cases to the existing file-backed
  mailbox, executable-path, stdout, stdout-byte, stderr-byte, and player-log guards.
- The nested-smoke-report-guard replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-nested-smoke-report-guard.json`
  passed 1/1 with 9/9 valid parsed audit response files, replay hash `f9eb9e83`, and retained
  stdout/stderr/player-log paths in the summary.
- The combined nested-smoke-report-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-nested-smoke-report-guard.json`
  passed 8/8 with 350 commands, 365 mailbox events, 365/365 valid parsed audit response files,
  one invalid-action release-path report, three game-over reports, winners `p1`/`p2`, retained
  stdout/stderr/player-log paths, and status `incomplete-evidence`.
- This is nested smoke-report evidence hardening only; status remains `Incomplete`.

## 2026-05-13 Built-Player Evidence Artifact Path Guard

This continuation is aggregate-tool hardening plus focused tests and evidence wording only. No
Unity gameplay, Electron gameplay, shared-action, bridge contract, built-player launcher, or
generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`

Goal: make the built-player aggregate proof fail closed unless the launcher report and retained
stdout, stderr, player log, nested smoke report, and mailbox directories resolve under the ignored
`artifacts/unity/built-player-smoke/` evidence directory. The original prompt requires
machine-readable reports and logs under ignored artifacts; this guard prevents outside-workspace or
path-only evidence from satisfying built-player proof. It remains bounded LocalDev evidence
hardening and must not change `Incomplete` or `incomplete-evidence` status.

Planned validation:

- Add retained evidence path-boundary validation to
  `tools/migration/summarize-unity-built-player-smokes.mjs`.
- Extend `tools/migration/summarize-unity-built-player-smokes.test.ts` with an outside evidence path
  negative case.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Re-run retained replay and combined artifact-path-guard aggregates.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs`.
- `pnpm exec prettier --check tools/migration/summarize-unity-built-player-smokes.mjs
tools/migration/summarize-unity-built-player-smokes.test.ts docs/migration/current-migration-task-plan.md`.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless the launcher
  report, retained stdout/stderr/player-log files, nested smoke report, and bridge mailbox
  directory resolve under `artifacts/unity/built-player-smoke/`.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 16/16, adding an
  outside-artifacts negative case to the existing file-backed mailbox, executable-path, stdout,
  stdout-byte, stderr-byte, nested-smoke-report, and player-log guards.
- The artifact-path-guard replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-artifact-path-guard.json`
  passed 1/1 with 9/9 valid parsed audit response files, replay hash `f9eb9e83`, and retained
  stdout/stderr/player-log paths in the summary.
- The combined artifact-path-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-artifact-path-guard.json`
  passed 8/8 with 350 commands, 365 mailbox events, 365/365 valid parsed audit response files,
  one invalid-action release-path report, three game-over reports, winners `p1`/`p2`, retained
  stdout/stderr/player-log paths, and status `incomplete-evidence`.
- This is retained artifact path hardening only; status remains `Incomplete`.

## 2026-05-13 Built-Player Mailbox Audit Path Guard

This continuation is aggregate-tool hardening plus focused tests and evidence wording only. No
Unity gameplay, Electron gameplay, shared-action, bridge contract, built-player launcher, or
generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`

Goal: make the built-player aggregate proof fail closed unless each retained mailbox
`auditResponse` file resolves inside the built-player smoke's bridge mailbox directory. The previous
artifact-path guard proves that the mailbox directory itself is retained under
`artifacts/unity/built-player-smoke/`; this follow-up prevents an individual audited response path
from escaping that mailbox directory while still matching the copied launcher event. It remains
bounded LocalDev evidence hardening and must not change `Incomplete` or `incomplete-evidence`
status.

Planned validation:

- Add retained mailbox audit-response path-boundary validation to
  `tools/migration/summarize-unity-built-player-smokes.mjs`.
- Extend `tools/migration/summarize-unity-built-player-smokes.test.ts` with an escaped
  audit-response path negative case.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Re-run retained replay and combined mailbox-audit-path-guard aggregates.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs`.
- `pnpm exec prettier --check tools/migration/summarize-unity-built-player-smokes.mjs
tools/migration/summarize-unity-built-player-smokes.test.ts docs/migration/current-migration-task-plan.md`.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed when a retained
  mailbox `auditResponse` path resolves outside the built-player smoke's bridge mailbox directory,
  even if the referenced JSON file exists and matches the launcher event summary.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 17/17, adding an escaped
  audit-response path negative case to the existing file-backed mailbox, executable-path, stdout,
  stdout-byte, stderr-byte, nested-smoke-report, artifact-path, and player-log guards.
- The mailbox-audit-path-guard replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-mailbox-audit-path-guard.json`
  passed 1/1 with 9/9 valid parsed audit response files, replay hash `f9eb9e83`, and retained
  stdout/stderr/player-log paths in the summary.
- The combined mailbox-audit-path-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-mailbox-audit-path-guard.json`
  passed 8/8 with 350 commands, 365 mailbox events, 365/365 valid parsed audit response files,
  one invalid-action release-path report, three game-over reports, winners `p1`/`p2`, retained
  stdout/stderr/player-log paths, and status `incomplete-evidence`.
- This is retained mailbox audit path hardening only; status remains `Incomplete`.

## 2026-05-13 Built-Player Mailbox Audit Request-Name Guard

This continuation is aggregate-tool hardening plus focused tests and evidence wording only. No
Unity gameplay, Electron gameplay, shared-action, bridge contract, built-player launcher, or
generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`

Goal: make the built-player aggregate proof fail closed unless each retained mailbox
`auditResponse` file name matches the launcher event's request file name. The previous mailbox
audit-path guard proves that the response file is inside the mailbox directory; this follow-up
prevents one retained response file from being reused as another request's audit evidence when the
high-level `ok`/`actionType`/rejection summary happens to match. It remains bounded LocalDev
evidence hardening and must not change `Incomplete` or `incomplete-evidence` status.

Planned validation:

- Add retained mailbox audit-response request-name validation to
  `tools/migration/summarize-unity-built-player-smokes.mjs`.
- Extend `tools/migration/summarize-unity-built-player-smokes.test.ts` with a mismatched
  request-name negative case.
- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Re-run retained replay and combined mailbox-audit-request-name-guard aggregates.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs`.
- `pnpm exec prettier --check tools/migration/summarize-unity-built-player-smokes.mjs
tools/migration/summarize-unity-built-player-smokes.test.ts docs/migration/current-migration-task-plan.md`.
- `git diff --check`.
- `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed when a retained
  mailbox `auditResponse` file name does not match the launcher event's request file name, even if
  the referenced JSON file exists, stays inside the bridge mailbox, and matches the high-level event
  summary.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 18/18, adding a mismatched
  audit-response request-name negative case to the existing file-backed mailbox, mailbox-audit-path,
  executable-path, stdout, stdout-byte, stderr-byte, nested-smoke-report, artifact-path, and
  player-log guards.
- The mailbox-audit-request-name-guard replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-mailbox-audit-request-name-guard.json`
  passed 1/1 with 9/9 valid parsed audit response files, replay hash `f9eb9e83`, and retained
  stdout/stderr/player-log paths in the summary.
- The combined mailbox-audit-request-name-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-mailbox-audit-request-name-guard.json`
  passed 8/8 with 350 commands, 365 mailbox events, 365/365 valid parsed audit response files,
  one invalid-action release-path report, three game-over reports, winners `p1`/`p2`, retained
  stdout/stderr/player-log paths, and status `incomplete-evidence`.
- This is retained mailbox audit request-name hardening only; status remains `Incomplete`.

## 2026-05-13 Built-Player Mailbox Audit Digest Guard

This continuation is built-player launcher and aggregate-tool hardening plus focused tests and
evidence wording only. No Unity gameplay, Electron gameplay, shared-action, bridge contract, or
generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`

Goal: make newly retained built-player mailbox audit evidence prove that the parsed
`auditResponse` file is the same bytes the launcher observed when it handed the response back to
Unity. The request-name guard prevents response-file reuse; this digest guard prevents post-launch
audit JSON drift while preserving the LocalDev/evidence-only boundary. It must not change
`Incomplete` or `incomplete-evidence` status.

Planned validation:

- Add `auditResponseBytes` and `auditResponseSha256` to new launcher mailbox events.
- Add aggregate validation that passes when retained audit response bytes and SHA-256 match the
  launcher event and fails closed when `--require-audited-mailbox-response-digests` is set.
- Extend `tools/migration/summarize-unity-built-player-smokes.test.ts` with digest-positive and
  digest-mismatch negative coverage.
- Run a small fresh built-player smoke with the updated launcher so the new digest fields are
  produced by real Windows player automation, then summarize it with the digest requirement.
- Focused checks: `node --check` for both migration scripts,
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`, formatter,
  and `git diff --check`.

Result:

- `tools/migration/run-unity-built-player-smoke.mjs` now records `auditResponseBytes` and
  `auditResponseSha256` for each retained mailbox audit response before delivering the same JSON to
  the Unity mailbox response path.
- `tools/migration/summarize-unity-built-player-smokes.mjs` adds
  `--require-audited-mailbox-response-digests` and fails closed when retained audit response bytes
  or SHA-256 no longer match launcher metadata.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 20/20, adding fail-closed
  digest-mismatch and missing-digest-metadata cases.
- Fresh built-player smoke
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Tmailbox-digest.launcher.json` passed from
  `artifacts/unity/build/windows/GemDuelUnity.exe` with seed
  `unity-built-player-mailbox-digest-20260513`, two live `take_gems` commands, three audited bridge
  responses with byte/SHA-256 metadata, replay release-path coverage, final/review hash
  `bd4c4bd0`, stdout/player-log capture, and no failure reason.
- Digest-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-guard.json`
  passed 1/1 with 3/3 valid parsed audit responses, 3/3 valid audit response digests, replay
  release-path coverage, final hash `bd4c4bd0`, and status `incomplete-evidence`.
- This is retained mailbox audit digest hardening only; status remains `Incomplete`.

## 2026-05-13 Built-Player Launcher Args Guard

This continuation is aggregate-tool hardening plus focused tests and evidence wording only. No Unity
gameplay, Electron gameplay, shared-action, bridge contract, built-player launcher, or generated
tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`

Goal: make retained built-player aggregate evidence fail closed when requested unless the launcher
`args` prove the player was started with `--gemduel-built-player-smoke`, the retained smoke report
path, seed, max steps, start mode, action preferences, and release-path flags that match the
launcher-embedded wrapper report. This closes a command-line coherence gap in fresh-launch evidence
without changing gameplay, bridge behavior, or `Incomplete` status.

Planned validation:

- Add `--require-launcher-args` to `tools/migration/summarize-unity-built-player-smokes.mjs`.
- Validate required smoke flags and values against `launcher.paths` plus wrapper seed/mode/count
  fields.
- Extend `tools/migration/summarize-unity-built-player-smokes.test.ts` with positive and
  fail-closed mismatched-args coverage.
- Re-run the digest launcher report through the new args guard, alongside digest and replay
  release-path requirements.
- Focused checks: `node --check`, summarizer Vitest, ESLint, Prettier, and `git diff --check`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now supports
  `--require-launcher-args` and validates retained launcher `args` against the smoke flag, player
  log path, nested smoke report path, seed, max steps, start mode, idle/draft action preferences,
  release-path include flags, and replay/replay-review release directories when present.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 22/22, adding
  `--require-launcher-args` positive coverage and a fail-closed retained seed-argument mismatch.
- The launcher-args digest aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-launcher-args-guard.json`
  passed 1/1 with `--require-launcher-args`,
  `--require-audited-mailbox-response-digests`, replay release-path coverage, 3/3 valid parsed
  audit responses, 3/3 valid audit response digests, `launcherArgsMatchSmoke=true`, final hash
  `bd4c4bd0`, and status `incomplete-evidence`.
- This is retained launcher command-line evidence hardening only; status remains `Incomplete`.

## 2026-05-13 TypeScript Bridge CLI Structured Error Output

This continuation is LocalDev bridge-boundary hardening only. No Unity gameplay, Electron gameplay,
shared action logic, built-player launcher behavior, generated tracked artifacts, or product-scope
claims are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `docs/adr/0012-unity-rules-engine-boundary.md`
- `tools/migration/unity-rules-engine-bridge.ts`
- `tools/migration/unity-rules-engine-bridge.test.ts`

Goal: make the TypeScript bridge CLI emit a structured JSON rejection to `--out` when the CLI hits
an unhandled infrastructure error after argument parsing, such as malformed request JSON. Built
Windows player mailbox callers should get a deterministic `BRIDGE_EXECUTION_FAILED` response file
instead of a missing response that can collapse into a timeout. This is LocalDev/evidence bridge
hardening only and must not change gameplay semantics or `Incomplete` status.

Planned validation:

- Refactor the bridge CLI so `--out` publication is available to the top-level error path.
- Preserve stderr diagnostics and non-zero exit status for infrastructure failures.
- Add a focused Vitest case proving malformed request JSON with `--out` writes structured
  `ok=false` JSON and exits non-zero.
- Re-run `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts`, `node --check`
  or equivalent syntax validation where applicable, Prettier, and relevant docs/source grep.

Result:

- `tools/migration/unity-rules-engine-bridge.ts` now parses CLI `--out` before request execution and
  writes a structured `ok=false` response with rejection code `BRIDGE_EXECUTION_FAILED` when
  unhandled CLI errors occur after argument parsing.
- The original stderr diagnostics and non-zero exit behavior are preserved; the structured response
  file is best-effort and uses the existing atomic `--out` writer.
- `tools/migration/unity-rules-engine-bridge.test.ts` now covers malformed request JSON with
  `--out`, asserting exit status 1, stderr `SyntaxError`, and a retained structured response file.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed 34/34.
- This is LocalDev/evidence bridge hardening only; status remains `Incomplete` and the unresolved
  release-runtime packaging decision is unchanged.

## 2026-05-13 Built-Player Failure Reason Coherence Guard

This continuation is retained built-player aggregate hardening plus evidence wording only. No Unity
gameplay, Electron gameplay, shared action logic, bridge runtime behavior, built-player launcher
behavior, or generated tracked artifact changes are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`

Goal: make passing built-player aggregate evidence fail closed when any retained launcher, wrapper,
nested product-surface smoke, or release-path section carries a non-empty `failureReason`. The
original prompt requires machine-readable failure reasons; this guard prevents a report from
claiming pass while hiding a retained failure reason in nested evidence. It remains bounded
LocalDev evidence hardening and must not change `Incomplete` status.

Planned validation:

- Collect failure reasons from launcher, wrapper, nested smoke, and each known release-path section.
- Fail `validateReport` when a passed launcher retains any failure reason.
- Extend `tools/migration/summarize-unity-built-player-smokes.test.ts` with a fail-closed nested
  failure-reason case.
- Re-run focused summarizer tests, syntax check, Prettier, and a retained digest aggregate through
  the new guard surface.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now collects failure reasons from the
  launcher, wrapper, nested product-surface smoke, and every known release-path section, exposes
  them as `failureReasons`, and fails passing reports that retain any non-empty failure reason.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 23/23, adding a fail-closed
  stale nested product-surface `failureReason` case.
- The failure-reason digest aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-failure-reason-guard.json`
  passed 1/1 with `--require-launcher-args`, `--require-audited-mailbox-response-digests`, replay
  release-path coverage, 3/3 valid audit response digests, zero retained failure reasons, final
  hash `bd4c4bd0`, and status `incomplete-evidence`.
- This is retained built-player evidence hardening only; status remains `Incomplete`.

## 2026-05-13 Replacement-Candidate Completion Audit Refresh

This continuation is documentation-only completion-audit refresh. No Unity gameplay, Electron
gameplay, shared action logic, bridge runtime behavior, built-player launcher behavior, generated
tracked artifact changes, or ignored artifact rewrites are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/archive/README.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: add a dated prompt-to-artifact completion audit for the current May 13 state, separating
actual evidence from blockers before any completion claim. The audit must map the active prompt's
required files, work packages, validation commands, final-report categories, prohibitions, and stop
conditions to concrete evidence or explicit gaps. This refresh must preserve `Incomplete` status.

Planned validation:

- Create `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`.
- Update the completion report, archive index, and next-run audit note to point at the dated audit.
- Check key retained aggregate JSON files for status/hash evidence without regenerating ignored
  artifacts.
- Run Prettier on the touched markdown files, grep for the new audit references, and run
  `git diff --check` plus `git status --short --branch`.

Result:

- Added `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md` with a dated
  prompt-to-artifact checklist covering the active objective, starting docs, baseline commands,
  work packages A-G, required documentation, suggested validation commands, hard prohibitions,
  final-report status separation, and stop-condition result.
- Updated `docs/migration/unity-full-migration-completion-report.md`,
  `docs/archive/README.md`, and `docs/archive/unity-next-run-audit-note-2026-05-13.md` to point at
  the new completion audit while preserving `Incomplete` status.
- Parsed the retained strict winner-release, audited combined winner guard, audited replay
  release-path, and mailbox digest failure-reason guard aggregate JSON files. All reported
  `passed=true` and `status=incomplete-evidence`; the checked summaries included 27/27 strict
  reports with 716 commands and 812 mailbox events, 8/8 audited combined reports with 350 commands
  and 365 mailbox events, the audited replay hash `f9eb9e83`, and the failure-reason digest hash
  `bd4c4bd0` with zero retained failure reasons.
- `git check-ignore -v` confirmed those retained aggregate JSON files remain ignored under
  `.gitignore:31:/artifacts/`.
- `pnpm exec prettier --check` passed for the touched markdown files, `rg` found the new audit
  references, and `git diff --check` passed with only the existing CRLF warnings on migration
  markdown files.
- This is documentation-only audit hardening; status remains `Incomplete`.

## 2026-05-13 TypeScript Bridge Availability Negative-Cases

This continuation is Unity EditMode test coverage plus evidence wording only. No Unity gameplay,
Electron gameplay, shared action logic, bridge runtime behavior, built-player launcher behavior,
or generated tracked artifact changes are allowed for this slice. Allowed files:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: strengthen the LocalDev TypeScript bridge boundary proof for availability failures by adding
explicit EditMode coverage for missing `tools/scripts` and missing
`tools/migration/unity-rules-engine-bridge.ts`. Existing checks already cover repository-root
resolution, missing root, missing `GEMDUEL_PNPM_PATH`, missing `vite-node`, timeout mapping, and
mailbox temp cleanup; this slice closes the intermediate availability-message gap only and must not
change `Incomplete` status.

Planned validation:

- Extend `TypeScriptBridgeAvailabilityAndRepositoryRootChecksAreStructured`.
- Run the focused Unity EditMode test through batchmode if available.
- Run `git diff --check`, `git status --short --branch`, and focused doc/source greps.

Result:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs` now extends
  `TypeScriptBridgeAvailabilityAndRepositoryRootChecksAreStructured` with explicit missing
  `tools/scripts` and missing `tools/migration/unity-rules-engine-bridge.ts` availability checks,
  including the expected diagnostic path in each structured message.
- The first Unity batchmode attempt with `-testFilter` wrote
  `clients/unity/artifacts/unity/editmode-bridge-availability-negative-20260513-results.xml` but
  executed zero tests because this Unity Test Framework version treated the selector as a group
  filter; that artifact is not counted as evidence.
- The rerun with `-testNames` was ignored by this Unity Test Framework version and became an
  unfiltered EditMode run, but it produced valid evidence:
  `artifacts/unity/editmode-bridge-availability-negative-20260513-testnames-results.xml` reports
  91/91 passed from `2026-05-13 04:43:43Z` to `2026-05-13 05:14:23Z`, and includes
  `TypeScriptBridgeAvailabilityAndRepositoryRootChecksAreStructured` passed.
- This is LocalDev bridge availability negative-case coverage only; status remains `Incomplete`
  and the unresolved release-runtime packaging decision is unchanged.

## 2026-05-13 TypeScript Bridge Mailbox Corrupt-Response Cleanup

This continuation is Unity EditMode test coverage plus evidence wording only. No Unity gameplay,
Electron gameplay, shared action logic, bridge runtime behavior, built-player launcher behavior,
or generated tracked artifact changes are allowed for this slice. Allowed files:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: strengthen the LocalDev built-player mailbox boundary proof by covering a corrupted mailbox
response file. The test should create a request/response mailbox, write malformed JSON to the
expected response path after the Unity client publishes a request, assert a deterministic parse
failure, and verify the mailbox response file is cleaned up. This closes a corrupt-response cleanup
gap only and must not change `Incomplete` status.

Planned validation:

- Extend `TypeScriptBridgeMailboxFailuresAreStructuredAndCleanTempFiles`.
- Run Unity EditMode batchmode evidence, using the full EditMode suite if focused selectors remain
  unsupported.
- Run `git diff --check`, `git status --short --branch`, and focused doc/source greps.

Result:

- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs` now extends
  `TypeScriptBridgeMailboxFailuresAreStructuredAndCleanTempFiles` with a corrupt mailbox response
  case: after the Unity client publishes a request, the fake mailbox host writes malformed JSON to
  the matching response path, deletes the consumed request like the built-player mailbox host, and
  asserts `JsonReaderException` plus cleaned response files.
- The first full EditMode attempt
  `artifacts/unity/editmode-mailbox-corrupt-response-20260513-results.xml` reported 90/91 because
  the initial corrupt-response test raced a short responder window and timed out. The follow-up
  `artifacts/unity/editmode-mailbox-corrupt-response-rerun-20260513-results.xml` also reported
  90/91 because the timeout phase left a stale request file and the corrupt responder answered the
  stale filename. Both are retained as failed evidence, not pass evidence.
- After isolating the stale timeout request and aligning the fake host with request cleanup, the
  next full EditMode run
  `artifacts/unity/editmode-mailbox-corrupt-response-fixed-20260513-results.xml` proved the mailbox
  corrupt-response test itself passed but exposed an unrelated product-surface proof timeout at
  308.7 seconds. The harness timeout for the slow seeded product-surface proofs now matches the
  existing 600-second bounded matrix timeout.
- The final full EditMode rerun
  `artifacts/unity/editmode-mailbox-corrupt-response-timeout-fixed-20260513-results.xml` reports
  91/91 passed from `2026-05-13 07:15:27Z` to `2026-05-13 07:43:28Z`, including
  `TypeScriptBridgeMailboxFailuresAreStructuredAndCleanTempFiles` passed in 0.141 seconds.
- This is LocalDev mailbox boundary hardening only; status remains `Incomplete`, and the unresolved
  release-runtime packaging decision is unchanged.

## 2026-05-13 TypeScript Bridge Mailbox Request Cleanup Hardening

This continuation is a narrow LocalDev bridge runtime cleanup fix plus test/docs evidence. Allowed
files:

- `clients/unity/Assets/GemDuel/Scripts/Core/TypeScriptGameRulesEngine.cs`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: harden `TypeScriptRulesBridgeMailboxClient` so request `.json` files are best-effort cleaned
up when the Unity client times out or fails while parsing a mailbox response. The previous
corrupt-response test exposed that timeout requests could remain in the request directory and
confuse later mailbox responders. This is LocalDev/evidence bridge cleanup only: do not introduce a
new runtime, packaging strategy, server, SDK, Electron behavior change, shared gameplay change, or
completion claim.

Planned validation:

- Update the mailbox client `finally` cleanup to include the published request path.
- Strengthen `TypeScriptBridgeMailboxFailuresAreStructuredAndCleanTempFiles` so timeout and corrupt
  response paths both assert no stale request files remain.
- Run Unity EditMode batchmode evidence, using the full suite if focused selectors remain
  unreliable.
- Run focused doc/source greps, Markdown Prettier check, `git diff --check`, and
  `git status --short --branch`.

Result:

- `TypeScriptRulesBridgeMailboxClient.Execute` now best-effort deletes the published request `.json`
  path in its `finally` cleanup alongside the temp request and response path.
- `TypeScriptBridgeMailboxFailuresAreStructuredAndCleanTempFiles` now asserts timeout cleanup leaves
  no request files at all, and the corrupt-response fake host no longer deletes the request on
  behalf of the client. The corrupt-response assertion therefore proves the Unity client cleans the
  request and response paths after the parse failure.
- Full Unity EditMode evidence
  `artifacts/unity/editmode-mailbox-request-cleanup-20260513-results.xml` reports 91/91 passed from
  `2026-05-13 07:59:18Z` to `2026-05-13 08:26:21Z`, including
  `TypeScriptBridgeMailboxFailuresAreStructuredAndCleanTempFiles` passed in 0.134 seconds.
- This is LocalDev/evidence bridge request cleanup only; status remains `Incomplete`, and the
  unresolved release-runtime packaging decision is unchanged.

## 2026-05-13 Shared Action Oracle Fix Validation Refresh

This continuation is a documentation/evidence refresh for the prompt's shared gameplay action diff
follow-up. No shared action runtime, Electron gameplay/UX, Unity runtime, bridge behavior, fixtures,
or generated tracked artifacts are allowed for this slice. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: re-audit commit `6e8af1b9513cab7ab8a6713b0b7d1786a1ff676c` for the three shared action
follow-ups called out by the active prompt: deterministic empty board-cell UIDs in `boardActions`,
offline draft reroll determinism and player-specific level ownership in `buffActions`, and
unaffordable market buy preservation of `pendingBuy` in `marketActions`. If existing TypeScript
oracle tests already cover the behavior, record that evidence and avoid runtime changes. Only
strengthen tests if a real oracle coverage gap is found.

Planned validation:

- Inspect the original shared action diff from commit `6e8af1b9513cab7ab8a6713b0b7d1786a1ff676c`.
- Inspect the current shared tests for the three behavior points.
- Run focused shared Vitest coverage for board, buff, and market action suites.
- Run Markdown formatting checks, `git diff --check`, and `git status --short --branch`.

Result:

- `packages/shared/src/logic/actions/__tests__/boardActions.test.ts` already covers deterministic
  empty-cell UIDs by applying the same `TAKE_GEMS` payload to cloned states and asserting matching
  coordinate/context-derived UID fragments.
- `packages/shared/src/logic/actions/__tests__/buffActions.branch.test.ts` already covers offline
  draft reroll behavior by blocking online rerolls, rerolling PVE and Local PvP draft pools,
  preserving P2 draft ownership while P1 rerolls, and proving repeated Local PvP rerolls with the
  same state are deterministic.
- `packages/shared/src/logic/actions/__tests__/marketActions.phase3.test.ts` already covers
  unaffordable market buys by asserting the market card, tableau, phase, and existing `pendingBuy`
  remain unchanged after rejection.
- Focused validation
  `pnpm exec vitest run packages/shared/src/logic/actions/__tests__/boardActions.test.ts packages/shared/src/logic/actions/__tests__/buffActions.branch.test.ts packages/shared/src/logic/actions/__tests__/marketActions.phase3.test.ts`
  passed 3 files and 57 tests.
- No shared gameplay runtime changes were made in this refresh; the three behaviors remain recorded
  as TypeScript oracle/determinism fixes independent of Unity. Status remains `Incomplete`.

## 2026-05-13 Built-Player Replay-Review Summary Guard Test

This continuation is a test/docs hardening slice for existing built-player replay-review release
path evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, bridge behavior,
fixtures, or generated tracked artifacts are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the built-player smoke summarizer fails closed when `--require-replay-review-release-path`
is satisfied only by a passing nested section that lacks the visible redo/undo navigation details
required by the migration governance. The summarizer already validates the nested navigation
summary; this slice adds regression coverage so future changes cannot weaken the existing guard
without a test failure.

Planned validation:

- Add a reusable replay-review release-path fixture to
  `tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Add one passing test for a complete replay-review navigation summary.
- Add one fail-closed test for a missing visible undo/redo navigation signal.
- Run the focused summarizer Vitest file, Markdown Prettier check, `git diff --check`, and
  `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has a replay-review
  release-path fixture that models a live source replay, visible redo/redo/undo navigation, final
  undo/redo navigation, source live-state preservation, and source replay-stream preservation.
- The new passing guard proves `--require-replay-review-release-path` accepts complete retained
  navigation evidence and records final replay-review hash `review-final`.
- The new negative guard proves the same requirement fails closed when the retained replay-review
  proof skipped a visible undo/redo control signal.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 25 tests.
- Retained evidence validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-review-navigation-guard.json --require-replay-review-release-path --require-family take_gems artifacts/unity/built-player-smoke/smoke-2026-05-12T03-32-18-999Z.launcher.json`
  passed with 1/1 report, 4 commands, 10 mailbox events, replay-review final hash `db7fb1b7`, and
  status `incomplete-evidence`.
- This hardens retained built-player replay-review evidence only. Status remains `Incomplete`,
  because this does not solve arbitrary product-surface Local PvP, LAN/online/Visual Lab, or
  release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Replay Release-Path Summary Guard Test

This continuation is a test/docs hardening slice for existing built-player replay release-path
evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, bridge behavior, fixtures,
or generated tracked artifacts are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the built-player smoke summarizer fails closed when `--require-replay-release-path`
is satisfied by a passing nested section that does not retain the full replay import/export/review
release-path coverage set required by the migration governance. The summarizer already validates
the nested replay release-path section; this slice adds regression coverage so future changes cannot
weaken the existing guard without a test failure.

Planned validation:

- Add a reusable replay release-path fixture to
  `tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Add one passing test for complete replay release-path coverage, case records, and final hash
  preservation.
- Add one fail-closed test for missing retained replay release-path coverage.
- Run the focused summarizer Vitest file, retained replay release-path aggregate check,
  Markdown Prettier check, `git diff --check`, and `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has a replay release-path
  fixture that models the retained built-player proof's coverage set, case records, baseline
  state hash, baseline recorded event count, and reviewed final hash.
- The new passing guard proves `--require-replay-release-path` accepts complete replay
  release-path evidence for `corrupted_summary`, `failed_overwrite_load`, `hash_mismatch`,
  `invalid_json`, `malformed_bootstrap`, `malformed_draft_bootstrap`, `missing_file`,
  `unsupported_schema`, and `valid_overwrite_reload_review`.
- The new negative guard proves the same requirement fails closed when retained coverage is missing
  a required `hash_mismatch` case.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 27 tests.
- Retained evidence validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-release-path-summary-guard.json --require-audited-mailbox-responses --require-replay-release-path --require-family take_gems artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-replay-release-path.launcher.json`
  passed with 1/1 report, 8 commands, 9 mailbox events, 9/9 retained audit response files, full
  replay release-path coverage, final hash `f9eb9e83`, and status `incomplete-evidence`.
- This hardens retained built-player replay release-path evidence only. Status remains
  `Incomplete`, because this does not solve arbitrary product-surface Local PvP, LAN/online/Visual
  Lab, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Invalid-Action Summary Guard Test

This continuation is a test/docs hardening slice for existing built-player invalid-action
release-path evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, bridge
behavior, fixtures, or generated tracked artifacts are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the built-player smoke summarizer fails closed when
`--require-invalid-action-release-path` is satisfied by a passing nested section that does not
retain the required no-mutation/no-recording rejection evidence. The summarizer already validates
the nested invalid-action release-path section; this slice adds regression coverage so future
changes cannot weaken the existing guard without a test failure.

Planned validation:

- Add a reusable invalid-action release-path fixture to
  `tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Add one passing test for the required invalid-action case IDs, rejected bridge process results,
  zero recorded events, and export/review hash preservation.
- Add one fail-closed test for a retained invalid-action case that mutates state.
- Run the focused summarizer Vitest file, retained invalid-action aggregate check, Markdown
  Prettier check, `git diff --check`, and `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has an invalid-action
  release-path fixture that models the required six rejected case IDs, retained rejection audit
  response files, rejected mailbox process exits, zero recorded events, and export/review hash
  preservation.
- The new passing guard proves `--require-invalid-action-release-path` accepts complete retained
  invalid-action no-mutation/no-recording evidence.
- The new negative guard proves the same requirement fails closed when a retained invalid-action
  case mutates state after rejection.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 29 tests.
- Retained evidence validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-invalid-action-summary-guard.json --require-audited-mailbox-responses --require-invalid-action-release-path --require-family take_gems artifacts/unity/built-player-smoke/smoke-2026-05-13Tmailbox-rejection-audit.launcher.json`
  passed with 1/1 report, 1 live product-surface command, 9 mailbox events, 9/9 retained audit
  response files, one invalid-action release-path report, invalid-action hash `f2780c3f`, and
  status `incomplete-evidence`.
- This hardens retained built-player invalid-action release-path evidence only. Status remains
  `Incomplete`, because this does not solve arbitrary product-surface Local PvP, LAN/online/Visual
  Lab, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Recovery Summary Guard Test

This continuation is a test/docs hardening slice for existing built-player recovery release-path
evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, bridge behavior, fixtures,
or generated tracked artifacts are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the built-player smoke summarizer fails closed when
`--require-recovery-release-path` is satisfied by a passing nested section that does not retain the
required save/load/continue, live replay preservation, and export/review hash evidence. The
summarizer already validates the nested recovery release-path section; this slice adds regression
coverage so future changes cannot weaken the existing guard without a test failure.

Planned validation:

- Add a reusable recovery release-path fixture to
  `tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Add one passing test for save/load/continue status, saved/restored/continued hashes, recorded
  event counts, and export/review hash preservation.
- Add one fail-closed test for a retained recovery proof whose continuation does not append replay
  events.
- Run the focused summarizer Vitest file, retained recovery aggregate check, Markdown Prettier
  check, `git diff --check`, and `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has a recovery release-path
  fixture that models save/load/continue status, saved/restored/continued hashes, recorded event
  counts, state summaries, replay export hashes, and replay review hash preservation.
- The new passing guard proves `--require-recovery-release-path` accepts complete retained
  save/load/continue evidence.
- The new negative guard proves the same requirement fails closed when a retained recovery proof
  does not append the expected live replay event after recovery.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 31 tests.
- Retained evidence validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-recovery-summary-guard.json --require-recovery-release-path --require-family take_gems artifacts/unity/built-player-smoke/smoke-2026-05-12T01-20-54-336Z.launcher.json`
  passed with 1/1 report, 2 live product-surface commands, 6 mailbox events, one recovery
  release-path report, recovery continuation hash `8d4178f7`, and status `incomplete-evidence`.
- This hardens retained built-player recovery release-path evidence only. Status remains
  `Incomplete`, because this does not solve arbitrary product-surface Local PvP, LAN/online/Visual
  Lab, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Settings Summary Guard Test

This continuation is a test/docs hardening slice for existing built-player settings release-path
evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, bridge behavior, fixtures,
or generated tracked artifacts are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the built-player smoke summarizer fails closed when
`--require-settings-release-path` is satisfied by a passing nested section that does not retain
settings save/reload, no-gameplay-mutation, and expected persisted-settings evidence. The summarizer
already validates the nested settings release-path section; this slice adds regression coverage so
future changes cannot weaken the existing guard without a test failure.

Planned validation:

- Add a reusable settings release-path fixture to
  `tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Add one passing test for saved/reloaded status, persistence file existence, gameplay hash/event
  stability, and expected saved/persisted/reloaded settings values.
- Add one fail-closed test for retained settings evidence that records gameplay events.
- Run the focused summarizer Vitest file, retained settings aggregate check, Markdown Prettier
  check, `git diff --check`, and `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has a settings release-path
  fixture that writes a real retained settings JSON file and models saved/reloaded status, gameplay
  hash stability, zero recorded gameplay events, and expected saved/persisted/reloaded settings
  values.
- The new passing guard proves `--require-settings-release-path` accepts complete retained settings
  save/reload evidence.
- The new negative guard proves the same requirement fails closed when retained settings evidence
  records gameplay events.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 33 tests.
- Retained evidence validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-settings-summary-guard.json --require-settings-release-path --require-family take_gems artifacts/unity/built-player-smoke/smoke-2026-05-12T02-00-40-648Z.launcher.json`
  passed with 1/1 report, 2 live product-surface commands, 5 mailbox events, one settings
  release-path report, settings persistence path `artifacts/unity/settings/gemduel.preferences.v1.json`,
  final hash `8668e7ab`, and status `incomplete-evidence`.
- This hardens retained built-player settings release-path evidence only. Status remains
  `Incomplete`, because this does not solve arbitrary product-surface Local PvP, LAN/online/Visual
  Lab, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Chrome Summary Guard Test

This continuation is a test/docs hardening slice for existing built-player chrome/rulebook/restart
release-path evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, bridge
behavior, fixtures, or generated tracked artifacts are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the built-player smoke summarizer fails closed when `--require-chrome-release-path` is
satisfied by a passing nested section that does not retain rulebook open/close, no-gameplay-mutation,
shell restart, Local PvP start visibility, and restarted live-command evidence. The summarizer
already validates the nested chrome release-path section; this slice adds regression coverage so
future changes cannot weaken the existing guard without a test failure.

Planned validation:

- Add a reusable chrome release-path fixture to
  `tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Add one passing test for rulebook open/close, unchanged gameplay hash/event count, shell restart,
  Local PvP start visibility, and restarted command hash/event evidence.
- Add one fail-closed test for retained chrome evidence that changes live replay event count while
  opening the rulebook.
- Run the focused summarizer Vitest file, retained chrome aggregate check, Markdown Prettier check,
  `git diff --check`, and `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has a chrome release-path
  fixture that models rulebook open/close, unchanged gameplay hash/event count, shell restart, Local
  PvP start visibility, and restarted live-command hash/event evidence.
- The new passing guard proves `--require-chrome-release-path` accepts complete retained
  chrome/rulebook/restart evidence.
- The new negative guard proves the same requirement fails closed when retained rulebook evidence
  changes the live replay event count.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 35 tests.
- Retained evidence validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-chrome-summary-guard.json --require-chrome-release-path --require-family take_gems artifacts/unity/built-player-smoke/smoke-2026-05-12T03-13-11-728Z.launcher.json`
  passed with 1/1 report, 2 live product-surface commands, 6 mailbox events, one chrome
  release-path report, chrome restart hash `5304b037`, final hash `e3a47e84`, and status
  `incomplete-evidence`.
- This hardens retained built-player chrome/rulebook/restart release-path evidence only. Status
  remains `Incomplete`, because this does not solve arbitrary product-surface Local PvP, LAN/online/
  Visual Lab, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Peek-Modal Summary Guard Test

This continuation is a test/docs hardening slice for existing built-player peek-modal release-path
evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, bridge behavior, fixtures,
or generated tracked artifacts are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the built-player smoke summarizer fails closed when
`--require-peek-modal-release-path` is satisfied by a passing nested section that does not retain
the required visible peek/modal control, exported event, and replay-review hash evidence. The
summarizer already validates the nested peek-modal release-path section; this slice adds regression
coverage so future changes cannot weaken the existing guard without a test failure.

Planned validation:

- Add a reusable peek-modal release-path fixture to
  `tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Add one passing test for `intelligence` buff selection, `select_buff`/`peek_deck`/`close_modal`
  event export, visible peek/modal controls, recorded/exported event preservation, and review hash
  preservation.
- Add one fail-closed test for retained peek-modal evidence missing the required close-modal event.
- Run the focused summarizer Vitest file, retained peek-modal aggregate check, Markdown Prettier
  check, `git diff --check`, and `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has a peek-modal release-path
  fixture that models `intelligence` buff selection, `select_buff`/`peek_deck`/`close_modal` event
  export, visible peek/modal controls, recorded/exported event preservation, and review hash
  preservation.
- The new passing guard proves `--require-peek-modal-release-path` accepts complete retained
  peek-modal open/close evidence.
- The new negative guard proves the same requirement fails closed when retained peek-modal evidence
  misses the required `close_modal` event.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 37 tests.
- Retained evidence validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-peek-modal-summary-guard.json --require-peek-modal-release-path --require-family take_gems artifacts/unity/built-player-smoke/smoke-2026-05-12T07-56-40-905Z.launcher.json`
  passed with 1/1 report, 4 live product-surface commands, 10 mailbox events, one peek-modal
  release-path report, peek-modal review hash `8399eadd`, final hash `26aa66c6`, and status
  `incomplete-evidence`.
- This hardens retained built-player peek-modal release-path evidence only. Status remains
  `Incomplete`, because this does not solve arbitrary product-surface Local PvP, LAN/online/Visual
  Lab, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Recovery Invalid-Action Summary Guard Test

This continuation is a test/docs hardening slice for existing built-player recovered invalid-action
release-path evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, bridge
behavior, fixtures, or generated tracked artifacts are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the built-player smoke summarizer fails closed when
`--require-recovery-invalid-action-release-path` is satisfied by a passing nested section that does
not retain the required recovered invalid-action no-mutation/no-recording and continuation replay
evidence. The retained real launcher is
`artifacts/unity/built-player-smoke/smoke-2026-05-12T09-33-52-882Z.launcher.json`.

Planned validation:

- Add a reusable recovery invalid-action release-path fixture to
  `tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Add one passing test for recovered cancel-reserve, close-modal, and inactive-player take-gems
  rejections, bridge rejection exits, unchanged recovered state/hash/event counts, valid
  continuation, and export/review hash preservation.
- Add one fail-closed test for retained recovered invalid-action evidence that records a replay event
  during rejection.
- Run the focused summarizer Vitest file, retained recovery invalid-action aggregate check,
  Markdown Prettier check, `git diff --check`, and `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has a recovery invalid-action
  release-path fixture that models recovered cancel-reserve, close-modal, and inactive-player
  take-gems rejections, rejected bridge process exits, unchanged recovered state/hash/event counts,
  valid continuation, and export/review hash preservation.
- The new passing guard proves `--require-recovery-invalid-action-release-path` accepts complete
  retained recovered invalid-action evidence.
- The new negative guard proves the same requirement fails closed when retained recovered
  invalid-action evidence records an event during rejection.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 39 tests.
- Retained evidence validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-recovery-invalid-action-summary-guard.json --require-recovery-invalid-action-release-path --require-family take_gems artifacts/unity/built-player-smoke/smoke-2026-05-12T09-33-52-882Z.launcher.json`
  passed with 1/1 report, 2 live product-surface commands, 9 mailbox events, one recovery
  invalid-action release-path report, recovery invalid-action continuation hash `d2b51b3f`, final
  hash `d2fd26e1`, and status `incomplete-evidence`.
- This hardens retained built-player recovered invalid-action release-path evidence only. Status
  remains `Incomplete`, because this does not solve arbitrary product-surface Local PvP, LAN/online/
  Visual Lab, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Privilege-Cancel Summary Guard Test

This continuation is a test/docs hardening slice for existing built-player privilege-cancel
release-path evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, bridge
behavior, fixtures, or generated tracked artifacts are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the built-player smoke summarizer fails closed when
`--require-privilege-cancel-release-path` is satisfied by a passing nested section that does not
retain ordered privilege activation/cancel events, phase transition evidence, recorded/exported event
counts, and export/review hash preservation. The retained real launcher is
`artifacts/unity/built-player-smoke/smoke-2026-05-12T10-51-01-649Z.launcher.json`.

Planned validation:

- Add a reusable privilege-cancel release-path fixture to
  `tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Add one passing test for `PRIVILEGE_ACTION` activation, return to `IDLE`,
  `activate_privilege`/`cancel_privilege` ordering, recorded/exported event preservation, and
  review hash preservation.
- Add one fail-closed test for retained privilege-cancel evidence with reversed cancel/activation
  ordering.
- Run the focused summarizer Vitest file, retained privilege-cancel aggregate check, Markdown
  Prettier check, `git diff --check`, and `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has a privilege-cancel
  release-path fixture that models `PRIVILEGE_ACTION` activation, return to `IDLE`,
  `activate_privilege`/`cancel_privilege` ordering, recorded/exported event preservation, and review
  hash preservation.
- The new passing guard proves `--require-privilege-cancel-release-path` accepts complete retained
  privilege activation/cancel evidence.
- The new negative guard proves the same requirement fails closed when retained privilege-cancel
  evidence reverses activation/cancel event ordering.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 41 tests.
- Retained evidence validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-privilege-cancel-summary-guard.json --require-privilege-cancel-release-path --require-family take_gems artifacts/unity/built-player-smoke/smoke-2026-05-12T10-51-01-649Z.launcher.json`
  passed with 1/1 report, 3 live product-surface commands, 8 mailbox events, one privilege-cancel
  release-path report, action families `activate_privilege`, `cancel_privilege`, `take_gems`, and
  `use_privilege`, privilege-cancel hash `efe66377`, final hash `9e3b6f7c`, and status
  `incomplete-evidence`.
- This hardens retained built-player privilege-cancel release-path evidence only. Status remains
  `Incomplete`, because this does not solve arbitrary product-surface Local PvP, LAN/online/Visual
  Lab, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Reserved-Discard Summary Guard Test

This continuation is a test/docs hardening slice for existing built-player reserved-discard
release-path evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, bridge
behavior, fixtures, or generated tracked artifacts are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the built-player smoke summarizer fails closed when
`--require-reserved-discard-release-path` is satisfied by a passing nested section that does not
retain visible reserved-card discard controls, ordered `select_buff`/`reserve_card`/
`discard_reserved` events, recorded/exported event counts, and export/review hash preservation. The
retained real launcher is
`artifacts/unity/built-player-smoke/smoke-2026-05-12T11-39-09-986Z.launcher.json`.

Planned validation:

- Add a reusable reserved-discard release-path fixture to
  `tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Add one passing test for `puppet_master` selection, visible reserved-card discard controls,
  ordered `select_buff`/`reserve_card`/`discard_reserved` export, recorded/exported event
  preservation, and review hash preservation.
- Add one fail-closed test for retained reserved-discard evidence with hidden discard controls.
- Run the focused summarizer Vitest file, retained reserved-discard aggregate check, Markdown
  Prettier check, `git diff --check`, and `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has a reserved-discard
  release-path fixture that models `puppet_master` selection, visible reserve and discard controls,
  ordered `select_buff`/`reserve_card`/`discard_reserved` replay export, recorded/exported event
  preservation, and review hash preservation.
- The new passing guard proves `--require-reserved-discard-release-path` accepts complete retained
  reserved-card discard evidence.
- The new negative guard proves the same requirement fails closed when retained reserved-discard
  evidence hides the reserved-card discard control.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 43 tests.
- Retained evidence validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserved-discard-summary-guard.json --require-reserved-discard-release-path --require-family take_gems artifacts/unity/built-player-smoke/smoke-2026-05-12T11-39-09-986Z.launcher.json`
  passed with 1/1 report, 6 live product-surface commands, 14 mailbox events, one reserved-discard
  release-path report, action families `choose_boon`, `discard_reserved`, `reserve_card`, and
  `take_gems`, reserved-discard hash `33909286`, final hash `fb772d70`, and status
  `incomplete-evidence`.
- This hardens retained built-player reserved-discard release-path evidence only. Status remains
  `Incomplete`, because this does not solve arbitrary product-surface Local PvP, LAN/online/Visual
  Lab, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Reserved-Buy Summary Guard Test

This continuation is a test/docs hardening slice for existing built-player reserved-buy release-path
evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, bridge behavior, fixtures,
or generated tracked artifacts are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the built-player smoke summarizer fails closed when
`--require-reserved-buy-release-path` is satisfied by a passing nested section that does not retain
visible reserved-card buy controls, ordered `reserve_card`/reserved-source `buy_card` events,
recorded/exported event counts, and export/review hash preservation. The retained real launcher is
`artifacts/unity/built-player-smoke/smoke-2026-05-12T12-29-42-881Z.launcher.json`.

Planned validation:

- Add a reusable reserved-buy release-path fixture to
  `tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Add one passing test for visible reserved-card buy controls, ordered `reserve_card` and
  reserved-source `buy_card` export, recorded/exported event preservation, and review hash
  preservation.
- Add one fail-closed test for retained reserved-buy evidence with non-reserved `buy_card` source.
- Run the focused summarizer Vitest file, retained reserved-buy aggregate check, Markdown Prettier
  check, `git diff --check`, and `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has a reserved-buy release-path
  fixture that models visible reserved-card buy controls, ordered `reserve_card` and reserved-source
  `buy_card` export, recorded/exported event preservation, and review hash preservation.
- The new passing guard proves `--require-reserved-buy-release-path` accepts complete retained
  reserved-card buy evidence.
- The new negative guard proves the same requirement fails closed when retained reserved-buy
  evidence records a non-reserved `buy_card` source.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 45 tests.
- Retained evidence validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserved-buy-summary-guard.json --require-reserved-buy-release-path --require-family take_gems artifacts/unity/built-player-smoke/smoke-2026-05-12T12-29-42-881Z.launcher.json`
  passed with 1/1 report, 6 live product-surface commands, 16 mailbox events, one reserved-buy
  release-path report, action families `buy_card`, `reserve_card`, and `take_gems`, reserved-buy
  hash `47c0e9db`, final hash `8ea252da`, and status `incomplete-evidence`.
- This hardens retained built-player reserved-buy release-path evidence only. Status remains
  `Incomplete`, because this does not solve arbitrary product-surface Local PvP, LAN/online/Visual
  Lab, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Reserve-Cancel Summary Guard Test

This continuation is a test/docs hardening slice for existing built-player reserve-cancel
release-path evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, bridge
behavior, fixtures, or generated tracked artifacts are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the built-player smoke summarizer fails closed when
`--require-reserve-cancel-release-path` is satisfied by a passing nested section that does not retain
visible market reserve/cancel controls, `RESERVE_WAITING_GEM` to `IDLE` transition evidence,
cleared pending-reserve state, ordered `initiate_reserve`/`cancel_reserve` events,
recorded/exported event counts, and initial/export/review hash preservation. The retained real
launcher is `artifacts/unity/built-player-smoke/smoke-2026-05-12T13-21-32-993Z.launcher.json`.

Planned validation:

- Add a reusable reserve-cancel release-path fixture to
  `tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Add one passing test for visible reserve/cancel controls, phase transition, cleared
  pending-reserve state, ordered events, recorded/exported event preservation, and review hash
  preservation.
- Add one fail-closed test for retained reserve-cancel evidence that leaves pending reserve state
  after cancel.
- Run the focused summarizer Vitest file, retained reserve-cancel aggregate check, Markdown
  Prettier check, `git diff --check`, and `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has a reserve-cancel
  release-path fixture that models visible reserve/cancel controls, `RESERVE_WAITING_GEM` to `IDLE`
  transition, cleared pending-reserve state, ordered `initiate_reserve`/`cancel_reserve` export,
  recorded/exported event preservation, and initial/export/review hash preservation.
- The new passing guard proves `--require-reserve-cancel-release-path` accepts complete retained
  reserve-cancel evidence.
- The new negative guard proves the same requirement fails closed when retained reserve-cancel
  evidence leaves pending reserve state after cancel.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 47 tests.
- Retained evidence validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-cancel-summary-guard.json --require-reserve-cancel-release-path --require-family reserve_card artifacts/unity/built-player-smoke/smoke-2026-05-12T13-21-32-993Z.launcher.json`
  passed with 1/1 report, 6 live product-surface commands, 10 mailbox events, one reserve-cancel
  release-path report, action families `cancel_reserve`, `reserve_card`, and `take_gems`,
  reserve-cancel hash `40bdddbf`, final hash `bdbabdbb`, and status `incomplete-evidence`.
- This hardens retained built-player reserve-cancel release-path evidence only. Status remains
  `Incomplete`, because this does not solve arbitrary product-surface Local PvP, LAN/online/Visual
  Lab, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Reserve-Deck Summary Guard Test

This continuation is a test/docs hardening slice for existing built-player reserve-deck release-path
evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, bridge behavior, fixtures,
or generated tracked artifacts are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the built-player smoke summarizer fails closed when
`--require-reserve-deck-release-path` is satisfied by a passing nested section that does not retain
visible deck/gold reserve controls, deck-pending phase evidence, deck/reserved/gold-cell mutation
evidence, ordered `initiate_reserve_deck`/`reserve_deck` events, recorded/exported event counts, and
export/review hash preservation. The retained real launcher is
`artifacts/unity/built-player-smoke/smoke-2026-05-12T13-59-30-560Z.launcher.json`.

Planned validation:

- Add a reusable reserve-deck release-path fixture to
  `tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Add one passing test for visible deck/gold reserve controls, phase/pending evidence, deck and
  reserved-card count mutation, ordered events, recorded/exported event preservation, and review
  hash preservation.
- Add one fail-closed test for retained reserve-deck evidence that does not decrement the deck.
- Run the focused summarizer Vitest file, retained reserve-deck aggregate check, Markdown Prettier
  check, `git diff --check`, and `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has a reserve-deck release-path
  fixture that models visible deck/gold reserve controls, `RESERVE_WAITING_GEM` deck-pending
  evidence, deck/reserved/gold-cell mutation, ordered `initiate_reserve_deck`/`reserve_deck` export,
  recorded/exported event preservation, and export/review hash preservation.
- The new passing guard proves `--require-reserve-deck-release-path` accepts complete retained
  reserve-deck evidence.
- The new negative guard proves the same requirement fails closed when retained reserve-deck
  evidence does not decrement the deck and consume Gold.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 49 tests after aligning the negative assertion with the summarizer's actual failure text.
- Retained evidence validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-deck-summary-guard.json --require-reserve-deck-release-path artifacts/unity/built-player-smoke/smoke-2026-05-12T13-59-30-560Z.launcher.json`
  passed with 1/1 report, 6 live product-surface commands, 10 mailbox events, one reserve-deck
  release-path report, action families `buy_card`, `initiate_reserve_deck`, `reserve_deck`,
  `take_bonus_gem`, and `take_gems`, reserve-deck hash `da89d9e5`, final hash `63df431c`, and
  status `incomplete-evidence`.
- This hardens retained built-player reserve-deck release-path evidence only. Status remains
  `Incomplete`, because this does not solve arbitrary product-surface Local PvP, LAN/online/Visual
  Lab, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Reserve-Deck-Cancel Summary Guard Test

This continuation is a test/docs hardening slice for existing built-player reserve-deck-cancel
release-path evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, bridge
behavior, fixtures, or generated tracked artifacts are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the built-player smoke summarizer fails closed when
`--require-reserve-deck-cancel-release-path` is satisfied by a passing nested section that does not
retain visible deck/gold reserve and cancel controls, deck-pending cancel phase evidence, restored
deck/reserved/gold-cell state, ordered `initiate_reserve_deck`/`cancel_reserve` events,
recorded/exported event counts, and initial/export/review hash preservation. The retained real
launcher is `artifacts/unity/built-player-smoke/smoke-2026-05-12T15-27-57-407Z.launcher.json`.

Planned validation:

- Add a reusable reserve-deck-cancel release-path fixture to
  `tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Add one passing test for visible deck/gold reserve/cancel controls, phase/pending evidence,
  restored deck/reserved/gold-cell state, ordered events, recorded/exported event preservation, and
  review hash preservation.
- Add one fail-closed test for retained reserve-deck-cancel evidence that consumes the Gold cell or
  changes deck/reserved counts after cancel.
- Run the focused summarizer Vitest file, retained reserve-deck-cancel aggregate check, Markdown
  Prettier check, `git diff --check`, and `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has a reserve-deck-cancel
  release-path fixture that models visible deck/gold reserve/cancel controls, deck-pending cancel
  phase evidence, restored deck/reserved/gold-cell state, ordered `initiate_reserve_deck`/
  `cancel_reserve` export, recorded/exported event preservation, and initial/export/review hash
  preservation.
- The new passing guard proves `--require-reserve-deck-cancel-release-path` accepts complete
  retained deck-reserve cancel evidence.
- The new negative guard proves the same requirement fails closed when retained deck-reserve cancel
  evidence mutates deck/reserve row/pending-reserve/Gold state after cancel.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 51 tests after aligning the negative assertion with the summarizer's actual failure text.
- Retained evidence validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-deck-cancel-summary-guard.json --require-reserve-deck-cancel-release-path artifacts/unity/built-player-smoke/smoke-2026-05-12T15-27-57-407Z.launcher.json`
  passed with 1/1 report, 8 live product-surface commands, 12 mailbox events, one
  reserve-deck-cancel release-path report, action families `buy_card`, `cancel_reserve`,
  `initiate_reserve_deck`, `select_joker_color`, and `take_gems`, deck-reserve cancel hash
  `62fa027f`, final hash `95c8a06c`, and status `incomplete-evidence`.
- This hardens retained built-player deck-reserve cancel release-path evidence only. Status remains
  `Incomplete`, because this does not solve arbitrary product-surface Local PvP, LAN/online/Visual
  Lab, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Joker Summary Guard Test

This continuation is a test/docs hardening slice for existing built-player Joker release-path
evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, bridge behavior, fixtures,
or generated tracked artifacts are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the built-player smoke summarizer fails closed when
`--require-joker-release-path` is satisfied by a passing nested section that does not retain visible
market preview/buy/color controls, `SELECT_CARD_COLOR` to `IDLE` transition evidence, Joker tableau
placement and pending-buy clearing, ordered `initiate_buy_joker`/`buy_card` events,
recorded/exported event counts, and export/review hash preservation. The retained real launcher is
`artifacts/unity/built-player-smoke/smoke-2026-05-12T14-52-59-171Z.launcher.json`.

Planned validation:

- Add a reusable Joker release-path fixture to
  `tools/migration/summarize-unity-built-player-smokes.test.ts`.
- Add one passing test for visible market preview/buy/color controls, color-selection phase,
  pending-buy clearing, tableau placement, ordered events, recorded/exported event preservation, and
  review hash preservation.
- Add one fail-closed test for retained Joker evidence that leaves pending-buy uncleared after buy.
- Run the focused summarizer Vitest file, retained Joker aggregate check, Markdown Prettier check,
  `git diff --check`, and `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has a Joker release-path
  fixture that models visible market preview/buy/color controls, `SELECT_CARD_COLOR` to `IDLE`
  transition, Joker tableau placement, pending-buy clearing, ordered `initiate_buy_joker`/
  `buy_card` export, recorded/exported event preservation, and export/review hash preservation.
- The new passing guard proves `--require-joker-release-path` accepts complete retained Joker
  market-buy evidence.
- The new negative guard proves the same requirement fails closed when retained Joker evidence
  leaves pending-buy uncleared after buy.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 53 tests.
- Retained evidence validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-joker-summary-guard.json --require-joker-release-path --require-family select_joker_color artifacts/unity/built-player-smoke/smoke-2026-05-12T14-52-59-171Z.launcher.json`
  passed with 1/1 report, 8 live product-surface commands, 18 mailbox events, one Joker release-path
  report, action families `buy_card`, `initiate_buy_joker`, `select_joker_color`, and `take_gems`,
  Joker hash `95c8a06c`, final hash `95c8a06c`, and status `incomplete-evidence`.
- This hardens retained built-player Joker release-path evidence only. Status remains `Incomplete`,
  because this does not solve arbitrary product-surface Local PvP, LAN/online/Visual Lab, or
  release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Draft Summary Guard Test

This continuation is a tooling/test/docs hardening slice for existing built-player roguelike draft
release-path evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, bridge
behavior, fixtures, or generated tracked artifacts are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: add a narrow `--require-draft-release-path` built-player smoke summarizer guard that accepts
the retained fresh roguelike draft launcher only when it proves no fixture/checkpoint gameplay
driver, `reroll-each-player-first` draft preference, ordered P1/P2 `reroll_draft_pool` and
`choose_boon` actions, `DRAFT_PHASE` to `IDLE` transition, live replay event counts, and
export/review hash preservation. The retained real launcher is
`artifacts/unity/built-player-smoke/smoke-2026-05-12T05-44-04-969Z.launcher.json`.

Planned validation:

- Add the `--require-draft-release-path` summarizer option and matrix output fields.
- Add one passing test for complete retained draft release-path evidence.
- Add one fail-closed test for draft evidence that does not leave `DRAFT_PHASE` after both players
  select.
- Run the focused summarizer Vitest file, retained draft aggregate check, Prettier check,
  `git diff --check`, and `git status --short --branch`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now supports
  `--require-draft-release-path`, records `draftReleasePathReportCount`, and summarizes draft final
  hashes from matching roguelike `reroll-each-player-first` retained launcher reports.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has a draft release-path
  fixture that models ordered P1/P2 `reroll_draft_pool` and `choose_boon` actions, `DRAFT_PHASE` to
  `IDLE` completion, live event counts, and export/review hash preservation.
- The new passing guard proves complete retained draft evidence is accepted. The new negative guard
  proves the same requirement fails closed when both players' draft selections do not resolve to
  `IDLE`.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 55 tests.
- Retained evidence validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-draft-summary-guard.json --require-draft-release-path --require-family reroll_draft_pool --require-family choose_boon artifacts/unity/built-player-smoke/smoke-2026-05-12T05-44-04-969Z.launcher.json`
  passed with 1/1 report, 8 live product-surface commands, 9 mailbox events, one draft release-path
  report, action families `choose_boon`, `reroll_draft_pool`, and `take_gems`, draft hash
  `851b6356`, final hash `851b6356`, and status `incomplete-evidence`.
- The same guard also passed the newer post-no-take-3 draft launcher:
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-draft-post-notake3-summary-guard.json --require-draft-release-path --require-family reroll_draft_pool --require-family choose_boon artifacts/unity/built-player-smoke/smoke-2026-05-12Tpost-notake3-draft.launcher.json`
  passed with 1/1 report, 6 live product-surface commands, 7 mailbox events, one draft release-path
  report, draft hash `857c3e58`, final hash `857c3e58`, and status `incomplete-evidence`.
- This hardens retained built-player draft release-path evidence only. Status remains `Incomplete`,
  because this does not solve arbitrary product-surface Local PvP, LAN/online/Visual Lab, or
  release-runtime TypeScript bridge packaging.

## 2026-05-13 TypeScript Bridge CLI Rejection Output Guard

This continuation is a focused LocalDev/evidence bridge test/docs hardening slice. No Unity runtime,
Electron gameplay/UX, shared gameplay logic, fixtures, generated tracked artifacts, or bridge
runtime behavior changes are allowed unless the existing CLI behavior proves incomplete. Allowed
files:

- `tools/migration/unity-rules-engine-bridge.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the TypeScript bridge CLI used by the built-player mailbox path writes a structured
`ok=false` response to `--out` for a valid but rejected gameplay command before exiting non-zero.
Malformed request JSON is already covered; this closes the adjacent rejected-command mailbox
evidence gap without adding a runtime, SDK, server, or packaging strategy.

Planned validation:

- Add one CLI-spawned Vitest case that starts a deterministic Local PvP state, sends a wrong-actor
  command through `vite-node --script tools/migration/unity-rules-engine-bridge.ts <request>
--out <response>`, and asserts status `2`, empty stdout, structured rejection JSON, preserved
  input state hash, and no leftover temporary response files.
- Run the focused bridge Vitest file or a targeted test pattern, `node --check` where applicable,
  Prettier check for changed docs/tests, `git diff --check`, and `git status --short --branch`.

Result:

- `tools/migration/unity-rules-engine-bridge.test.ts` now covers a valid CLI `apply` request that
  is rejected at the live bridge boundary for wrong actor, writes a structured `ok=false` response
  to `--out`, exits with status `2`, preserves the supplied state/hash, leaves stdout empty for the
  mailbox response-file path, and leaves no `response.json.*.tmp` file behind.
- Targeted validation
  `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts -t "structured output-file rejection"`
  passed 1 file with 2 passed tests and 33 skipped tests.
- Full bridge validation `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts`
  passed 1 file with 35 passed tests.
- Repo validation `pnpm typecheck` and `pnpm lint` passed from Turbo cache after the test/docs
  slice.
- This is LocalDev/evidence bridge CLI rejection-output hardening only. Status remains
  `Incomplete`, because it does not solve arbitrary product-surface Local PvP, LAN/online/Visual
  Lab, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Aggregate Report-Count Guard

This continuation is a tooling/test/docs hardening slice for retained built-player aggregate
evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, fixtures, generated
tracked artifacts, or bridge behavior changes are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: add a narrow built-player smoke summarizer guard that fails closed if a retained aggregate is
missing expected launcher reports. The existing strict aggregate records 27/27 reports, but the CLI
does not yet have a `--require-report-count` guard; requiring count prevents a later rerun from
silently dropping bounded evidence while still satisfying action-family and winner checks.

Planned validation:

- Add `--require-report-count <count>` to the summarizer usage, argument parser, matrix `check`
  output, and failure list.
- Add one passing test for the exact report count and one fail-closed test for a too-high report
  count.
- Re-run the retained strict 27-report aggregate with `--require-report-count 27`, all strict
  release-path flags, all required action families, `--require-game-over-count 3`, and
  `--require-game-over-winner p1,p2`.
- Run the focused summarizer Vitest file, Prettier check, `git diff --check`, and status/hygiene
  checks.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now supports
  `--require-report-count <count>`, records the requirement in `matrix.check.requiredReportCount`,
  and fails closed when the retained launcher report count differs from the required count.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` now covers both the exact-count
  pass case and a too-high required count that fails with
  `Required built-player report count was not met: expected 2, found 1.`.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 57 tests.
- Retained strict aggregate validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-report-count-guard.json --require-report-count 27 --require-game-over-count 3 --require-game-over-winner p1,p2 --require-draft-release-path --require-replay-release-path --require-recovery-release-path --require-settings-release-path --require-chrome-release-path --require-replay-review-release-path --require-invalid-action-release-path --require-peek-modal-release-path --require-recovery-invalid-action-release-path --require-privilege-cancel-release-path --require-reserved-discard-release-path --require-reserved-buy-release-path --require-reserve-cancel-release-path --require-reserve-deck-release-path --require-reserve-deck-cancel-release-path --require-joker-release-path ...retained reports`
  passed with 27/27 reports, 716 live product-surface commands, 812 mailbox events, all 21
  required action families, three game-over reports, winners `p1`/`p2`, one report for every
  current release-path proof family, `requiredReportCount: 27`, no failures, and status
  `incomplete-evidence`.
- `git check-ignore -v` confirmed the generated aggregate remains ignored under
  `.gitignore:31:/artifacts/`.
- This is retained built-player aggregate hardening only. Status remains `Incomplete`, because it
  does not solve arbitrary product-surface Local PvP, LAN/online/Visual Lab, or release-runtime
  TypeScript bridge packaging.

## 2026-05-13 Built-Player Aggregate Unique-Report-Path Guard

This continuation is a tooling/test/docs hardening slice for retained built-player aggregate
evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, fixtures, generated
tracked artifacts, or bridge behavior changes are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: add a narrow built-player smoke summarizer guard that fails closed if a retained aggregate is
padded with duplicate launcher report paths. The report-count guard proves the expected count is
present, but it does not by itself prove those count entries are unique evidence files.

Planned validation:

- Add `--require-unique-report-paths` to the summarizer usage, argument parser, matrix `check`
  output, and failure list.
- Add one passing test for unique retained launcher paths and one fail-closed test for duplicate
  launcher paths.
- Re-run the retained strict 27-report aggregate with `--require-report-count 27`,
  `--require-unique-report-paths`, all strict release-path flags, all required action families,
  `--require-game-over-count 3`, and `--require-game-over-winner p1,p2`.
- Run the focused summarizer Vitest file, Prettier check, `git diff --check`, and status/hygiene
  checks.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now supports
  `--require-unique-report-paths`, records `requireUniqueReportPaths` and `duplicateReportPaths`
  in the matrix `check` block, and fails closed when duplicate launcher report paths are supplied.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` now covers both unique retained
  launcher paths and a duplicate launcher path that fails with
  `Duplicate built-player launcher report path supplied:`.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 59 tests.
- Retained strict aggregate validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-report-path-guard.json --require-report-count 27 --require-unique-report-paths --require-game-over-count 3 --require-game-over-winner p1,p2 --require-draft-release-path --require-replay-release-path --require-recovery-release-path --require-settings-release-path --require-chrome-release-path --require-replay-review-release-path --require-invalid-action-release-path --require-peek-modal-release-path --require-recovery-invalid-action-release-path --require-privilege-cancel-release-path --require-reserved-discard-release-path --require-reserved-buy-release-path --require-reserve-cancel-release-path --require-reserve-deck-release-path --require-reserve-deck-cancel-release-path --require-joker-release-path ...retained reports`
  passed with 27/27 reports, 716 live product-surface commands, 812 mailbox events, all 21
  required action families, three game-over reports, winners `p1`/`p2`, one report for every
  current release-path proof family, `requiredReportCount: 27`, `requireUniqueReportPaths: true`,
  empty `duplicateReportPaths`, no failures, and status `incomplete-evidence`.
- `git check-ignore -v` confirmed the generated aggregate remains ignored under
  `.gitignore:31:/artifacts/`.
- This is retained built-player aggregate hardening only. Status remains `Incomplete`, because it
  does not solve arbitrary product-surface Local PvP, LAN/online/Visual Lab, or release-runtime
  TypeScript bridge packaging.

## 2026-05-13 Built-Player Aggregate Unique-Nested-Smoke-Report Guard

This continuation is a tooling/test/docs hardening slice for retained built-player aggregate
evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, fixtures, generated
tracked artifacts, or bridge behavior changes are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: add a narrow built-player smoke summarizer guard that fails closed if distinct retained
launcher reports point at the same nested smoke report file. The unique launcher path guard proves
the launcher JSON paths are unique, but it does not by itself prove the nested product-surface
smoke-report files are unique evidence files.

Planned validation:

- Add `--require-unique-smoke-report-paths` to the summarizer usage, argument parser, matrix
  `check` output, and failure list.
- Add one passing test for unique nested smoke-report paths and one fail-closed test for duplicate
  nested smoke-report paths.
- Re-run the retained strict 27-report aggregate with `--require-report-count 27`,
  `--require-unique-report-paths`, `--require-unique-smoke-report-paths`, all strict release-path
  flags, all required action families, `--require-game-over-count 3`, and
  `--require-game-over-winner p1,p2`.
- Run the focused summarizer Vitest file, Prettier check, `git diff --check`, and status/hygiene
  checks.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now supports
  `--require-unique-smoke-report-paths`, records `requireUniqueSmokeReportPaths` and
  `duplicateSmokeReportPaths` in the matrix `check` block, and fails closed when distinct launcher
  reports point at the same nested smoke-report file.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` now covers both unique nested
  smoke-report paths and a duplicate nested smoke-report path that fails with
  `Duplicate built-player nested smoke report path supplied:`.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 61 tests.
- Retained strict aggregate validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-nested-smoke-report-guard.json --require-report-count 27 --require-unique-report-paths --require-unique-smoke-report-paths --require-game-over-count 3 --require-game-over-winner p1,p2 --require-draft-release-path --require-replay-release-path --require-recovery-release-path --require-settings-release-path --require-chrome-release-path --require-replay-review-release-path --require-invalid-action-release-path --require-peek-modal-release-path --require-recovery-invalid-action-release-path --require-privilege-cancel-release-path --require-reserved-discard-release-path --require-reserved-buy-release-path --require-reserve-cancel-release-path --require-reserve-deck-release-path --require-reserve-deck-cancel-release-path --require-joker-release-path ...retained reports`
  passed with 27/27 reports, 716 live product-surface commands, 812 mailbox events, all 21
  required action families, three game-over reports, winners `p1`/`p2`, one report for every
  current release-path proof family, `requiredReportCount: 27`, `requireUniqueReportPaths: true`,
  empty `duplicateReportPaths`, `requireUniqueSmokeReportPaths: true`, empty
  `duplicateSmokeReportPaths`, no failures, and status `incomplete-evidence`.
- `git check-ignore -v` confirmed the generated aggregate remains ignored under
  `.gitignore:31:/artifacts/`.
- This is retained built-player aggregate hardening only. Status remains `Incomplete`, because it
  does not solve arbitrary product-surface Local PvP, LAN/online/Visual Lab, or release-runtime
  TypeScript bridge packaging.

## 2026-05-13 Built-Player Aggregate Unique-Log-Path Guard

This continuation is a tooling/test/docs hardening slice for retained built-player aggregate
evidence. No Unity runtime, Electron gameplay/UX, shared gameplay logic, fixtures, generated
tracked artifacts, or bridge behavior changes are allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: add a narrow built-player smoke summarizer guard that fails closed if distinct retained
launcher reports reuse stdout, stderr, or Unity player log files. The unique launcher and nested
smoke-report guards prove the JSON evidence files are unique, but they do not by themselves prove
the retained process-output logs are unique evidence files.

Planned validation:

- Add `--require-unique-log-paths` to the summarizer usage, argument parser, matrix `check` output,
  and failure list.
- Add one passing test for unique retained stdout/stderr/player log paths and one fail-closed test
  for reused log paths.
- Re-run the retained strict 27-report aggregate with `--require-report-count 27`,
  `--require-unique-report-paths`, `--require-unique-smoke-report-paths`,
  `--require-unique-log-paths`, all strict release-path flags, all required action families,
  `--require-game-over-count 3`, and `--require-game-over-winner p1,p2`.
- Run the focused summarizer Vitest file, Prettier check, ESLint, `git diff --check`, and
  status/hygiene checks.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now supports
  `--require-unique-log-paths`, records `requireUniqueLogPaths`, `duplicateStdoutLogPaths`,
  `duplicateStderrLogPaths`, and `duplicatePlayerLogPaths` in the matrix `check` block, and fails
  closed when distinct launcher reports reuse retained stdout, stderr, or Unity player log files.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` now covers both unique retained log
  paths and duplicate retained log paths that fail with `Duplicate built-player stdout log path
supplied:`, `Duplicate built-player stderr log path supplied:`, and
  `Duplicate built-player player log path supplied:`.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 1 file
  and 63 tests.
- Retained strict aggregate validation
  `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-log-path-guard.json --require-report-count 27 --require-unique-report-paths --require-unique-smoke-report-paths --require-unique-log-paths --require-game-over-count 3 --require-game-over-winner p1,p2 --require-draft-release-path --require-replay-release-path --require-recovery-release-path --require-settings-release-path --require-chrome-release-path --require-replay-review-release-path --require-invalid-action-release-path --require-peek-modal-release-path --require-recovery-invalid-action-release-path --require-privilege-cancel-release-path --require-reserved-discard-release-path --require-reserved-buy-release-path --require-reserve-cancel-release-path --require-reserve-deck-release-path --require-reserve-deck-cancel-release-path --require-joker-release-path ...retained reports`
  passed with 27/27 reports, 716 live product-surface commands, 812 mailbox events, all 21 required
  action families, three game-over reports, winners `p1`/`p2`, one report for every current
  release-path proof family, `requiredReportCount: 27`, `requireUniqueReportPaths: true`, empty
  `duplicateReportPaths`, `requireUniqueSmokeReportPaths: true`, empty `duplicateSmokeReportPaths`,
  `requireUniqueLogPaths: true`, empty `duplicateStdoutLogPaths`, empty
  `duplicateStderrLogPaths`, empty `duplicatePlayerLogPaths`, no failures, and status
  `incomplete-evidence`.
- `git check-ignore -v` confirmed the generated aggregate remains ignored under
  `.gitignore:31:/artifacts/`.
- This is retained built-player aggregate hardening only. Status remains `Incomplete`, because it
  does not solve arbitrary product-surface Local PvP, LAN/online/Visual Lab, or release-runtime
  TypeScript bridge packaging.

## 2026-05-13 Audited Built-Player Aggregate Strict Path Guard

This continuation is a docs/artifact-only evidence hardening slice for the audited mailbox subset.
No Unity runtime, Electron gameplay/UX, shared gameplay logic, fixtures, generated tracked
artifacts, bridge behavior, or migration tooling source changes are allowed. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: re-run the existing 8-report audited mailbox combined aggregate with the now-available exact
report-count and unique launcher/nested-smoke/log-path guards. The prior file-backed audited
aggregate proves 365 retained audit response files, but it does not combine that proof with the
newer duplicate-evidence guards.

Planned validation:

- Use
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-filebacked.json`
  as the source report list.
- Re-run `tools/migration/summarize-unity-built-player-smokes.mjs` with
  `--require-audited-mailbox-responses`, `--require-report-count 8`,
  `--require-unique-report-paths`, `--require-unique-smoke-report-paths`,
  `--require-unique-log-paths`, `--require-invalid-action-release-path`,
  `--require-game-over-count 3`, `--require-game-over-winner p1,p2`, and the existing 12 required
  audited action families.
- Write the ignored aggregate to
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-strict-unique-paths.json`.
- Update migration docs to record this as the strongest audited-mailbox subset evidence, while
  keeping the overall replacement-candidate status `Incomplete`.
- Run focused Prettier/docs hygiene, `git diff --check`, ignored-artifact proof, and status checks.

Result:

- The ignored aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-strict-unique-paths.json`
  was generated from the retained file-backed audited combined report list.
- It passed with 8/8 reports, 350 commands, 365 mailbox events, 365 valid retained audit response
  files, 359 successful mailbox responses, twelve required audited action families, one
  invalid-action release-path report, three game-over reports, winners `p1`/`p2`, and final hashes
  `38d97b7f`, `3b479090`, `411262df`, `5f3bf567`, `62b67ebe`, `d6dbea7a`, `ec648e6c`, and
  `f934c91b`.
- The `check` block records `requiredReportCount: 8`, `requireUniqueReportPaths: true`,
  `requireUniqueSmokeReportPaths: true`, `requireUniqueLogPaths: true`, empty duplicate lists for
  launcher reports, nested smoke reports, stdout logs, stderr logs, and Unity player logs, no
  failures, and `status: incomplete-evidence`.
- This is the strongest audited-mailbox subset evidence because it combines retained audit response
  files with exact report-count and unique evidence-path guards. It is still bounded LocalDev
  evidence and does not change the overall replacement-candidate status from `Incomplete`.

## 2026-05-13 Audited Replay Plus Game-Over Strict Aggregate

This continuation is a docs/artifact-only evidence-composition slice. No Unity runtime, Electron
gameplay/UX, shared gameplay logic, fixtures, generated tracked artifacts, bridge behavior, or
migration tooling source changes are allowed. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: combine the separate file-backed audited replay release-path proof with the audited
game-over/invalid-action strict unique-path subset, so one retained audited aggregate requires
replay release-path coverage, invalid-action release-path coverage, three game-over reports, both
winners, exact report count, and unique launcher/nested-smoke/log evidence paths.

Planned validation:

- Use the source report list from
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-filebacked.json`
  plus the source report list from
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-strict-unique-paths.json`.
- Re-run `tools/migration/summarize-unity-built-player-smokes.mjs` with
  `--require-audited-mailbox-responses`, `--require-report-count 9`,
  `--require-unique-report-paths`, `--require-unique-smoke-report-paths`,
  `--require-unique-log-paths`, `--require-replay-release-path`,
  `--require-invalid-action-release-path`, `--require-game-over-count 3`,
  `--require-game-over-winner p1,p2`, and the audited action-family union.
- Write the ignored aggregate to
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-strict-unique-paths.json`.
- Update migration docs to record this as stronger audited release-path composition while keeping
  the overall replacement-candidate status `Incomplete`.
- Run focused Prettier/docs hygiene, ignored-artifact proof, `git diff --check`, Unity-process
  hygiene, and status checks.

Result:

- The ignored aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-strict-unique-paths.json`
  was generated from the retained file-backed audited replay release-path report plus the eight
  audited game-over/invalid-action strict unique-path reports.
- It passed with 9/9 reports, 358 commands, 374 mailbox events, 374 valid retained audit response
  files, 368 successful mailbox responses, twelve required audited action families, one replay
  release-path report, one invalid-action release-path report, three game-over reports, winners
  `p1`/`p2`, and final hashes `38d97b7f`, `3b479090`, `411262df`, `5f3bf567`, `62b67ebe`,
  `d6dbea7a`, `ec648e6c`, `f934c91b`, and `f9eb9e83`.
- The replay release-path coverage in the combined aggregate is `invalid_json`, `missing_file`,
  `unsupported_schema`, `malformed_bootstrap`, `malformed_draft_bootstrap`, `corrupted_summary`,
  `hash_mismatch`, `failed_overwrite_load`, and `valid_overwrite_reload_review`.
- The `check` block records `requiredReportCount: 9`, `requireUniqueReportPaths: true`,
  `requireUniqueSmokeReportPaths: true`, `requireUniqueLogPaths: true`, empty duplicate lists for
  launcher reports, nested smoke reports, stdout logs, stderr logs, and Unity player logs, no
  failures, and `status: incomplete-evidence`.
- This is stronger audited release-path composition evidence because replay release-path,
  invalid-action, game-over, winner, retained audit-response, and unique evidence-path requirements
  pass together. It is still bounded LocalDev evidence and does not change the overall
  replacement-candidate status from `Incomplete`.

## 2026-05-13 Audited Digest Count Aggregate Guard

This continuation is a narrow migration-tooling evidence hardening slice. No Unity runtime,
Electron gameplay/UX, shared gameplay logic, fixtures, generated tracked artifacts, bridge runtime
behavior, or product-scope docs weakening is allowed. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: allow a broader audited aggregate to require at least one digest-bearing audited mailbox
response proof without requiring every older audited response to have digest metadata. The existing
`--require-audited-mailbox-response-digests` flag remains the strict all-events guard for digest
smokes; this slice adds an aggregate minimum-count guard for mixed audited evidence ledgers.

Planned validation:

- Add a `--require-audited-mailbox-response-digest-count <count>` summarizer option that implies
  audited mailbox response validation and fails closed if the aggregate has fewer valid digest
  matches than requested.
- Add focused passing and failing Vitest coverage for the new aggregate-count guard.
- Generate a 10-report audited aggregate that includes the audited replay/game-over strict set plus
  the digest-bearing mailbox report, requiring exact report count, unique evidence paths, replay
  release-path, invalid-action release-path, game-over winners, and at least three digest-validated
  audit responses.
- Keep all generated output under ignored `artifacts/` and status `incomplete-evidence`.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now supports
  `--require-audited-mailbox-response-digest-count <count>`. The option implies
  `--require-audited-mailbox-responses` and fails closed if the aggregate contains fewer valid
  retained audit-response digest matches than requested.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` now covers both the passing
  aggregate-count case and the missing-digest fail-closed case:
  `Required audited mailbox response digest count was not met: expected at least 1, found 0.`.
- Focused validation `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`
  passed 1 file and 65 tests before documentation formatting.
- Syntax validation `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed.
- The 10-report aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-digest-count-strict.json`
  passed with `--require-audited-mailbox-responses`,
  `--require-audited-mailbox-response-digest-count 3`, `--require-report-count 10`,
  `--require-unique-report-paths`, `--require-unique-smoke-report-paths`,
  `--require-unique-log-paths`, `--require-launcher-args`, `--require-replay-release-path`,
  `--require-invalid-action-release-path`, `--require-game-over-count 3`, and
  `--require-game-over-winner p1,p2`.
- The retained aggregate records 10/10 reports, 360 commands, 377 mailbox events, 377 valid
  retained audit response files, 3 valid audit response digests, 371 successful responses, twelve
  required audited action families, two replay release-path reports, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, replay release-path coverage for
  invalid/missing/unsupported/malformed/corrupt/hash-mismatch/overwrite/review cases, empty
  duplicate launcher/nested-smoke/stdout/stderr/player-log path lists, launcher args matching smoke
  metadata, no failures, and status `incomplete-evidence`.
- This strengthens retained audited-mailbox composition evidence only. It does not change the
  overall replacement-candidate status from `Incomplete`, because arbitrary broad product-surface
  Local PvP, LAN/online/Visual Lab scope, broader release-path/recovery breadth, and final
  release-runtime TypeScript bridge packaging remain unresolved.

## 2026-05-13 All-Release Plus Audited-Digest Strict Union

This continuation is a docs/artifact-only evidence-composition slice. No Unity runtime, Electron
gameplay/UX, shared gameplay logic, fixtures, bridge behavior, migration tooling source, or
generated tracked artifacts are allowed. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: compose the strict 27-report all-release-path retained built-player set with the 10-report
audited replay/game-over/digest set, proving the two evidence ledgers are non-overlapping and can
be checked together for exact report count, unique launcher/nested-smoke/log paths, all current
release-path proof families, all required action families, and six completed built-player game-over
reports.

Planned validation:

- Use source report lists from
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-log-path-guard.json`
  and
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-digest-count-strict.json`.
- First try the strictest union with `--require-launcher-args`; if retained older launchers lack
  newer argument metadata, keep that as an evidence limitation rather than weakening the existing
  launcher-args guard.
- Generate the ignored union aggregate at
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-all-release-plus-audited-digest-strict-union.json`.
- Require `--require-report-count 37`, unique report/nested-smoke/log paths, every current
  release-path flag, the full action-family union, `--require-game-over-count 6`, and
  `--require-game-over-winner p1,p2`.
- Keep status `incomplete-evidence` and the overall replacement-candidate status `Incomplete`.

Result:

- The first strictest attempt with `--require-launcher-args` failed closed. The aggregate still
  parsed 37 reports, 1076 commands, 1189 mailbox events, 377 valid retained audit response files,
  3 valid audit response digests, every release-path family, and six game-over reports, but two
  earliest 2026-05-11 launcher reports failed launcher-argument validation because their retained
  args predate the later idle-action-preference metadata:
  `Launcher args idle action preference mismatch: expected balanced, got null.`
- The accepted union aggregate was regenerated without `--require-launcher-args`:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-all-release-plus-audited-digest-strict-union.json`.
- It passed with `--require-report-count 37`, `--require-unique-report-paths`,
  `--require-unique-smoke-report-paths`, `--require-unique-log-paths`, all current release-path
  flags, the full 21-family action union, `--require-game-over-count 6`, and
  `--require-game-over-winner p1,p2`.
- The retained aggregate records 37/37 reports, 1076 commands, 1189 mailbox events, 377 valid
  retained audit response files, 3 valid audit response digests, 371 successful mailbox responses,
  all 21 required action families, two draft release-path reports, three replay release-path
  reports, one each for recovery/settings/chrome/replay-review/peek-modal/recovery-invalid-action/
  privilege-cancel/reserved-discard/reserved-buy/reserve-cancel/reserve-deck/reserve-deck-cancel/
  Joker release-path families, two invalid-action release-path reports, six game-over reports,
  winners `p1`/`p2`, no duplicate launcher/nested-smoke/stdout/stderr/player-log paths, no
  failures, and status `incomplete-evidence`.
- This is the broadest retained evidence-composition ledger for this run. It still does not claim
  complete replacement-candidate readiness because the union includes older non-audited reports and
  does not solve arbitrary product-surface Local PvP, LAN/online/Visual Lab scope, broader
  release-path/recovery breadth, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Launcher-Args Refreshed Union Attempt

This continuation is an artifact/docs-only evidence refresh. No Unity runtime source, Electron
gameplay/UX, shared gameplay logic, fixtures, bridge behavior, migration tooling source, or
generated tracked artifacts are allowed. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: remove the retained launcher-argument limitation from the broad all-release plus
audited-digest union by replacing only the two earliest 2026-05-11 baseline/breadth launchers that
predate `--gemduel-smoke-idle-action-preference` with fresh current-format built-player runs using
the same start mode, idle preference, and max-step shape.

Planned validation:

- Run `tools/migration/run-unity-built-player-smoke.mjs` twice against the existing ignored Windows
  player:
    - `unity-built-player-fresh-launch-breadth-20260513-args-refresh`, 12 steps, classic,
      balanced.
    - `unity-built-player-fresh-launch-long-20260513-args-refresh`, 30 steps, classic, balanced.
- Generate a refreshed 37-report union that uses those two current-format launcher reports, the
  remaining 25 reports from the strict all-release set, and the 10 audited replay/game-over/digest
  reports.
- Require exact report count, unique launcher/nested-smoke/log paths, `--require-launcher-args`,
  every current release-path flag, the 21-family action union, six game-over reports, and winners
  `p1,p2`.
- Keep all generated outputs ignored under `artifacts/` and keep status `incomplete-evidence`.

Result:

- Fresh built-player launcher reports
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Targs-refresh-breadth.launcher.json` and
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Targs-refresh-long.launcher.json` passed from
  `artifacts/unity/build/windows/GemDuelUnity.exe` with current launcher args, fresh LocalDev
  starts, live replay recording, export/review hash preservation, retained audit response files,
  and audit response digests.
- The 12-step refreshed breadth run records 12 live commands, action families `take_gems`,
  `buy_card`, and `replenish`, 13 valid retained audit response files/digests, final/review hash
  `69747be4`, and no failure reason.
- The 30-step refreshed long run records 30 live commands, action families `take_gems`, `buy_card`,
  `replenish`, `discard_gem`, and `select_joker_color`, 31 valid retained audit response
  files/digests, final/review hash `414e3342`, and no failure reason.
- The refreshed union aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-launcher-args-refreshed-union.json`
  replaces only the two oldest no-preference-arg launcher reports in the 37-report union and passes
  with `--require-report-count 37`, `--require-unique-report-paths`,
  `--require-unique-smoke-report-paths`, `--require-unique-log-paths`, `--require-launcher-args`,
  every current release-path flag, all 21 required action families, `--require-game-over-count 6`,
  and `--require-game-over-winner p1,p2`.
- The retained aggregate records 37/37 reports, 1076 commands, 1189 mailbox events, 421 valid
  retained audit response files, 47 valid audit response digests, 415 successful mailbox
  responses, every current release-path proof family, six game-over reports, winners `p1`/`p2`, no
  duplicate launcher/nested-smoke/stdout/stderr/player-log paths, launcher args matching smoke
  metadata, no failures, and status `incomplete-evidence`.
- This supersedes the non-launcher-args union as the strongest retained broad evidence-composition
  ledger. It still does not claim complete replacement-candidate readiness because it remains
  bounded LocalDev evidence and does not solve arbitrary product-surface Local PvP, LAN/online/
  Visual Lab scope, broader release-path/recovery breadth, or release-runtime TypeScript bridge
  packaging.

## 2026-05-13 Final Gate and Timeout Evidence Refresh

This continuation is a docs-only validation refresh after the launcher-args refreshed built-player
union. No Unity runtime source, Electron gameplay/UX, shared gameplay logic, fixtures, bridge
behavior, migration tooling source, or generated tracked artifacts are allowed. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-product-scope-map.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: record the final local gate refresh and current-run blockers without changing the migration
scope or weakening replacement-candidate requirements.

Validation and evidence results:

- `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 65/65.
- `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed 35/35.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed with `fixtureCount: 11`, `rejectionCaseCount: 65`, and no replay or rejection coverage
  gaps.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts --check`
  passed.
- `git grep -n "ReplaceSnapshot" -- clients/unity/Assets/GemDuel/Scripts/Core clients/unity/Assets/GemDuel/Scripts/Presentation`
  returned no matches.
- `git grep -nE "GemDuelVerticalSlice|vertical slice|scoped parity|90% parity|guided fixture|remaining 10%" -- clients/unity/Assets/GemDuel/Scripts`
  returned no matches.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`, `pnpm build`,
  `pnpm release:check`, `pnpm boundaries:check`, `pnpm architecture:check`, `pnpm deps:check`,
  `pnpm desktop:check`, and `pnpm secrets:check` passed in this continuation.
- `git diff --check` exited 0 with line-ending warnings for existing edited markdown files only.
- `git check-ignore -v` confirmed the launcher-args refreshed union and new Electron/Unity parity
  artifacts remain ignored under `/artifacts/`.
- The Windows player build command completed after stopping the earlier no-quit EditMode Unity
  process. `artifacts/unity/build-next-run.log` reports `Build Finished, Result: Success.` and
  batchmode return code 0.

Superseded non-passing evidence from this continuation:

- The first full `pnpm parity:electron-unity` attempt timed out after about 604 seconds. Partial artifacts were left
  under `artifacts/electron-unity-parity/2026-05-13T12-14-12-995Z`; the timed-out runner child
  processes were killed and the stale `.runner.lock` was removed. This attempt is not passing
  parity evidence and was superseded by the longer successful rerun recorded below.
- `pnpm parity:electron-unity -- --skip-unity --viewports "1366x768"` passed only as browser-runner
  cleanup evidence at `artifacts/electron-unity-parity/2026-05-13T12-26-01-458Z`. Its
  `runner-summary.json` records `unity.ok: false`, `Unity capture skipped by --skip-unity.`, and
  27 blocker rows, so it is not replacement evidence.
- The first fresh timestamped EditMode attempt
  `artifacts/unity/editmode-20260513T1242-final.log` reached the Unity test runner but produced no
  result file before the 22-minute guard expired. PID 75824 was stopped. A later longer rerun
  produced real 90/91 evidence and is handled by the no-take-3 smoke-driver fix section below.

Status remains `Incomplete`. The launcher-args refreshed built-player union is the strongest
retained built-player evidence ledger, but arbitrary product-surface Local PvP, LAN/online/Visual
Lab scope, broader release-path/recovery breadth, and final release-runtime TypeScript bridge
packaging remain unresolved.

## 2026-05-13 Final EditMode Draft No-Take-3 Smoke-Driver Fix

This continuation is a narrow Unity LocalDev smoke-driver fix after the fresh full EditMode rerun
produced real 90/91 evidence. No Electron gameplay/UX, shared gameplay logic, fixtures, bridge
runtime strategy, product-scope docs weakening, or generated tracked artifacts are allowed. Allowed
files:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevProductSurfaceSmoke.cs`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-full-parity-matrix.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Observed blocker:

- Fresh full EditMode rerun
  `clients/unity/artifacts/unity/editmode-final-validation-20260513-results.xml` reported 90/91.
- The single failing test was
  `RoguelikeDraftProductSurfaceSmokeRerollsSelectsAndReviewsLiveReplay`.
- The failure report shows the smoke selected both draft buffs, entered `IDLE`, then attempted
  `take_gems` with the status/error banner `The active buff blocks taking three gems.`.
- This is a Unity smoke-driver legality issue: replay snapshots carry active buffs as id/level
  entries, so the driver must resolve the active buff through the catalog before deciding whether
  three-gem lines are legal. It is not a shared oracle change and does not weaken the no-take-3
  rule.

Planned validation:

- Rerun the focused draft smoke EditMode test.
- If focused validation passes, rerun full EditMode with a long enough process wait for the
  91-test suite.
- Keep status `Incomplete` unless the remaining product-scope and parity blockers are also closed.

Result:

- `LocalDevProductSurfaceSmoke` now resolves the active buff id through the Unity catalog before
  filtering candidate gem lines, so `passive.noTake3` is honored even when snapshots carry only
  buff id/level rather than inline effects.
- Focused validation
  `artifacts/unity/editmode-draft-smoke-final-fix-20260513-results.xml` passed 1/1.
- Full Unity EditMode validation
  `artifacts/unity/editmode-final-validation-fixed-20260513-results.xml` passed 91/91 from
  `2026-05-13 13:40:44Z` to `14:08:55Z`.
- Windows player build validation
  `artifacts/unity/build-final-validation-fixed-20260513.log` reports
  `Build Finished, Result: Success.` and batchmode return code 0.
- Status remains `Incomplete` because arbitrary product-surface Local PvP, LAN/online/Visual Lab
  scope, broader release-path/recovery breadth, and release-runtime TypeScript bridge packaging
  remain unresolved.

## 2026-05-13 Full Electron/Unity Parity Rerun Result

After the Unity no-take-3 smoke-driver fix and the fresh 91/91 EditMode pass, full parity was rerun
with a longer process timeout:

- `pnpm parity:browser-guard -- --kill --pretty` still reported the known old browser orphan, but
  kept process counts inside the runner guard budget.
- `pnpm parity:electron-unity` passed after about 805 seconds and wrote
  `artifacts/electron-unity-parity/2026-05-13T14-15-37-411Z`.
- `runner-summary.json` records `unity.ok: true`, no Unity blocker, viewports `1920x1080` and
  `1366x768`, and `counts.Equivalent: 54`.
- The browser process guard in the passing run recorded before/peak/after counts of `1/14/1`,
  `orphanCount: 1`, `maxAllowedCount: 24`, and `maxFinalExtraProcesses: 1`. The post-run
  `pnpm parity:browser-guard -- --pretty` check still reported only the same pre-existing orphan.
- No `Unity` or `GemDuelUnity` process remained after the passing parity run.

This supersedes the earlier 604-second timeout as a wrapper-timeout artifact, not the latest parity
state. Replacement-candidate status remains `Incomplete` because LAN, online, Visual Lab, arbitrary
broad Local PvP, broader release-path/recovery breadth, and release-runtime TypeScript bridge
packaging are still not closed or user-excluded.

## 2026-05-13 Risk Table Parity Evidence Refresh

This continuation is documentation-only and does not authorize Unity runtime, Electron gameplay/UX,
shared gameplay, fixture, bridge, migration tooling, generated snapshot, or generated artifact
changes. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-migration-risk-table.md`

Goal: align the risk table with the latest retained full parity evidence after the longer
`pnpm parity:electron-unity` rerun passed at
`artifacts/electron-unity-parity/2026-05-13T14-15-37-411Z`. This must preserve the risk status:
configured parity is green, but parity scenario scope is still narrower than full replacement
readiness because LAN, online, Visual Lab, arbitrary full Local PvP, broader release-path/recovery,
and release-runtime TypeScript bridge packaging remain open.

## 2026-05-13 Completion Audit Parity Evidence Refresh

This continuation is documentation-only and does not authorize Unity runtime, Electron gameplay/UX,
shared gameplay, fixture, bridge, migration tooling, generated snapshot, or generated artifact
changes. Allowed files:

- `docs/migration/current-migration-task-plan.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: align the prompt-to-artifact completion audit with the retained successful full parity rerun
at `artifacts/electron-unity-parity/2026-05-13T14-15-37-411Z`, while preserving the `Incomplete`
verdict because product-scope and release-runtime blockers remain.

## 2026-05-13 Built-Player Launcher Process Guard Test Refresh

This continuation is test-only plus docs. It does not authorize Unity runtime, Electron gameplay/UX,
shared gameplay, fixture, bridge runtime, generated snapshot, generated artifact, or migration
tooling behavior changes. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the existing built-player summarizer fails closed when a retained launcher report claims
otherwise-valid evidence but records a non-zero player exit code or a timeout. This hardens evidence
validation only; it does not close arbitrary product-surface Local PvP, LAN/online/Visual Lab, or
release-runtime TypeScript bridge packaging.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has fail-closed coverage for a
  retained launcher report with `exitCode: 1` and for a retained launcher report with
  `timedOut: true`.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 67/67.
- Status remains `Incomplete` because this is evidence-hardening only and does not close
  product-scope or release-runtime blockers.

## 2026-05-13 Built-Player Success-Flag Guard Test Refresh

This continuation is test-only plus docs. It does not authorize Unity runtime, Electron gameplay/UX,
shared gameplay, fixture, bridge runtime, generated snapshot, generated artifact, or migration
tooling behavior changes. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: prove the existing built-player summarizer fails closed when retained evidence has otherwise
valid paths/logs/mailbox metadata but `launcher.ok`, nested wrapper `ok`, or nested product-surface
smoke `ok` is false. This hardens evidence validation only; it does not close arbitrary
product-surface Local PvP, LAN/online/Visual Lab, or release-runtime TypeScript bridge packaging.

Result:

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now has fail-closed coverage for a
  retained launcher report with `ok: false`, a nested wrapper report with `ok: false`, and a nested
  product-surface smoke report with `ok: false`.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 70/70.
- Status remains `Incomplete` because this is evidence-hardening only and does not close
  product-scope or release-runtime blockers.

## 2026-05-13 Built-Player Required-Flag Matrix Metadata Refresh

This continuation is migration-tooling metadata plus focused tests and docs. It does not authorize
Unity runtime, Electron gameplay/UX, shared gameplay, fixture, bridge runtime strategy, generated
snapshot, or generated artifact changes. Allowed files:

- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: make the retained built-player aggregate matrix explicitly record every required release-path
option in its machine-readable `check` section, not only the draft requirement. The summarizer
already validates these options; this slice hardens audit readability so retained artifacts can show
which release-path gates were actually requested. This does not close arbitrary product-surface
Local PvP, LAN/online/Visual Lab, broader release-runtime packaging, or final replacement-candidate
status.

Result:

- `tools/migration/summarize-unity-built-player-smokes.mjs` now writes every release-path
  requirement switch into the aggregate matrix `check` metadata, covering replay, recovery,
  settings, chrome, replay-review, invalid-action, peek-modal, recovered invalid-action,
  privilege-cancel, reserved-discard, reserved-buy, reserve-cancel, reserve-deck,
  reserve-deck-cancel, Joker, and draft.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` now proves a failed aggregate still
  records all required release-path flags in machine-readable form.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 71/71.
- Syntax validation `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed.
- Retained aggregate validation wrote
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-required-flag-metadata-refresh.json`
  with 37/37 reports, all required release-path metadata flags set to `true`, every current
  release-path proof family covered, six game-over reports, winners `p1`/`p2`, and status
  `incomplete-evidence`.
- Status remains `Incomplete` because this is evidence metadata hardening only and does not close
  product-scope or release-runtime blockers.

## 2026-05-13 Replay Release-Path No-Mutation Evidence Refresh

This continuation is a narrow LocalDev replay release-path evidence hardening slice. It does not
authorize Electron gameplay/UX changes, shared gameplay logic changes, fixture count inflation, a
new runtime strategy, product-scope weakening, or generated tracked artifact changes. Allowed files:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevReplayReleasePathSmoke.cs`
- `tools/migration/summarize-unity-built-player-smokes.mjs`
- `tools/migration/summarize-unity-built-player-smokes.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: make replay release-path rejected-import no-mutation proof explicit in retained machine-readable
evidence. The existing Unity smoke rejects invalid JSON, missing file, unsupported schema, malformed
bootstrap, malformed draft bootstrap, corrupted summary, hash mismatch, and failed overwrite load
without mutating the live replay state, but each retained case currently records only `ok`, `path`,
and `detail`. This slice will add explicit before/after state hash and recorded-event fields, plus a
strict summarizer option/test that fails closed if rejected import evidence mutates or omits those
fields. If a rebuilt Windows player smoke is blocked, record the blocker instead of claiming release
evidence.

Result:

- `LocalDevReplayReleasePathSmoke` now writes explicit rejected-import no-mutation fields for each
  replay release-path rejection case: `accepted: false`, expected error fragment, before/after
  state hashes, before/after recorded-event counts, and `liveReplayStateUnchanged`.
- `tools/migration/summarize-unity-built-player-smokes.mjs` now supports
  `--require-replay-release-path-no-mutation`, which implies `--require-replay-release-path` and
  fails closed if rejected import cases mutate state, record events, or omit explicit no-mutation
  fields.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` now covers the passing strict
  no-mutation path and a fail-closed mutated-state case.
- Focused validation
  `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 73/73.
- Syntax validation `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed.
- Windows player build validation `artifacts/unity/build-replay-nomutation-20260513.log` reports
  `Build Finished, Result: Success.` after recompiling player scripts.
- Focused built Windows player smoke
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Treplay-nomutation.launcher.json` passed
  from a fresh LocalDev launch with two live `take_gems` commands, three audited bridge mailbox
  responses, replay release-path coverage, and final hash `1acd96c`.
- Strict aggregate validation
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-nomutation.json`
  passed with `--require-replay-release-path-no-mutation`, `--require-launcher-args`, audited
  mailbox response/digest checks, one retained report, all replay release-path cases, eight
  rejected-import no-mutation case records, and status `incomplete-evidence`.
- `git check-ignore -v` confirmed the build log, launcher report, and strict aggregate remain
  ignored under `/artifacts/`.
- Status remains `Incomplete` because this strengthens replay release-path evidence only and does
  not close arbitrary product-surface Local PvP, LAN/online/Visual Lab, or release-runtime
  TypeScript bridge packaging.

## 2026-05-13 TypeScript Bridge Apply Metadata Hash Guard

This continuation is a focused LocalDev/evidence bridge test/docs hardening slice. No Unity runtime,
Electron gameplay/UX, shared gameplay logic, fixtures, migration tooling behavior, generated
tracked artifacts, or bridge runtime behavior changes are allowed. Allowed files:

- `tools/migration/unity-rules-engine-bridge.test.ts`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/unity-full-migration-completion-report.md`
- `docs/migration/unity-platform-release-checklist.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/archive/unity-next-run-audit-note-2026-05-13.md`
- `docs/archive/unity-replacement-candidate-completion-audit-2026-05-13.md`

Goal: strengthen the LocalDev/evidence bridge boundary by proving platform/user metadata carried
beside a live `apply` request is ignored by gameplay normalization, produces the same replay-state
hash as the undecorated request, and does not enter serialized gameplay state. This is evidence
boundary hardening only and does not add a runtime, SDK, server, or Node packaging strategy.

Planned validation:

- Add one Vitest case that starts a deterministic Local PvP game, applies the same legal
  `TAKE_GEMS` command with and without extra LocalDev platform/user metadata, and asserts matching
  action type, matching state hash, and no serialized platform/user identifiers in the resulting
  replay-state snapshot.
- Run `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts`, `pnpm typecheck`
  if the focused test changes type surface, `git diff --check`, and status/hygiene checks.

Result:

- `tools/migration/unity-rules-engine-bridge.test.ts` now covers an `apply` request decorated with
  request-level and payload-level LocalDev platform/user metadata. It compares that request against
  the same undecorated live `TAKE_GEMS` command and proves the action type and replay-state hash
  match while the serialized replay-state snapshot excludes those identifiers.
- Focused bridge validation `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts`
  passed 36/36.
- Repo validation `pnpm typecheck` and `pnpm lint` passed from Turbo cache after the test/docs
  slice.
- Replay/catalog guard validation
  `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed with 11 fixtures, 65 rejection cases, and no coverage gaps; catalog validation
  `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts --check`
  passed.
- Hygiene checks `git diff --check`, the `ReplaceSnapshot` grep, and the superseded vertical-slice
  terminology grep passed; `git diff --check` reported only existing CRLF normalization warnings in
  migration markdown.
- Status remains `Incomplete` because this is LocalDev/evidence bridge boundary hardening only and
  does not solve arbitrary product-surface Local PvP, LAN/online/Visual Lab, or release-runtime
  TypeScript bridge packaging.

## 2026-05-13 Built-Player Local PVP Full-Game Plan Runner

This continuation is authorized by the new `/goal` prompt to move from the existing single Electron
full-game report and bridge-only 100-game simulation into built Windows Unity Player full-game UI
evidence. Electron and `packages/shared` remain the oracle; Unity must consume the same generated
Local PVP plan and click the visible Unity targets with the matching semantic keys and normalized
viewport coordinates. LAN, online, and Visual Lab remain explicitly exempt for this Local PVP
completion attempt.

Allowed files for this slice:

- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelGameController.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevFullGamePlanSmoke.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevFullGamePlanSmoke.cs.meta`
- `tools/migration/run-unity-built-player-smoke.mjs`
- `tools/migration/run-local-pvp-built-player-full-game-suite.mjs`
- `package.json`
- required migration docs and final reports under `docs/migration/**`

Planned evidence:

- Generate at least 100 deterministic Classic Local PVP plan files from
  `tools/migration/local-pvp-full-game-plan.ts`.
- Run the built Windows Unity Player against those plans through `GemDuelGameController` semantic
  target hit testing, not fixture replay playback.
- For every UI step, record visible state digest, target geometry, normalized click point, phase,
  actor, action family, state hash, live replay event count, legality, failure reason, and replay
  hash fields.
- Export each completed live replay, import/review it in a separate controller, and compare final
  review hash against the oracle plan hash.
- If the built-player run cannot reach 100/100 or if release-runtime packaging remains a LocalDev
  bridge dependency, write `Incomplete` with exact blockers rather than `Complete`.

Validation commands:

- `pnpm parity:local-pvp-built-player-fullgame100`
- focused Unity build or existing Windows player freshness check when Unity is available
- `pnpm exec vitest run tools/migration/run-unity-product-surface-coverage.test.ts` if coverage
  report semantics change
- `pnpm typecheck`
- `pnpm lint`
- `git diff --check`

Result:

- The built Windows player was rebuilt with the full-game plan runner. Build evidence is retained at
  `artifacts/unity/build-local-pvp-fullgame-runner-20260514-reservedjoker-player.log`, which reports
  `Build Finished, Result: Success.`.
- The final retained 100-game built-player UI suite passed:
  `artifacts/electron-unity-parity/local-pvp-built-player-full-game/2026-05-14T04-11-55-678Z/local-pvp-built-player-full-game-suite-report.json`.
  The paired HTML report is
  `artifacts/electron-unity-parity/local-pvp-built-player-full-game/2026-05-14T04-11-55-678Z/local-pvp-built-player-full-game-suite-report.html`.
- The suite generated 100 deterministic Electron-legal Local PVP plans and executed all 100 through
  the built Windows Unity player in 13 batches. The aggregate records `ok: true`,
  `verdict: BuiltPlayerUiComplete`, `executedMatches: 100`, `passed: 100`, `failed: 0`, and
  `suiteTraceHash: 3f6904c25c7c1632970cab956b2b2aba5e7b09b2f31860841004c955d69977d1`.
- Per-step evidence records visible state, target geometry, normalized point, phase, actor, action
  family, state hash, replay event count, legality, failure reason, and replay hash fields. Replay
  export/import/review final-hash checks are included for every completed match:
  `replayExport.ok`, `replayReview.ok`, final-state hash, and replay-event-count checks are all
  100/100.
- Covered built-player action families are `INIT`, `TAKE_GEMS`, `BUY_CARD`,
  `INITIATE_BUY_JOKER`, `INITIATE_RESERVE`, `RESERVE_CARD`, `REPLENISH`, `TAKE_BONUS_GEM`,
  `SELECT_ROYAL_CARD`, `STEAL_GEM`, and `DISCARD_GEM`. The aggregate covers 18 observed FSM
  phase edges and records `recordedUiSteps: 20746`, `averageStepDurationMs: 92`,
  `p95StepDurationMs: 190`, and `maxStepDurationMs: 1064`.
- Unity mismatches fixed during this run included canonical board-gem target routing, current versus
  opponent inventory-gem role targeting, reserved mini-stack hit ordering, royal selection target
  identity/actionability, reserved Joker preview-buy routing, and reserved Joker command
  normalization in the TypeScript bridge.
- The regenerated product-surface coverage report imports the retained full-game suite and the later
  packaged-runtime suite as first-class evidence:
  `artifacts/unity/product-surface-coverage/unity-product-surface-coverage-report.json` and
  `artifacts/unity/product-surface-coverage/unity-product-surface-coverage-report.html`. It records
  `verdict: Complete`, required entrypoints 6/6, required action families 15/15, required phase
  edges 11/11, visual contracts 5/5, recovery 13/13, settings tuples 62/62, release-runtime rules
  packaging covered, and zero failures. LAN, online, and Visual Lab are recorded as user-approved
  exclusions for this Local PVP completion attempt.
- Superseded status: this 04:11 100-game UI run originally left recovery, settings, and
  release-runtime rules packaging incomplete. The later 2026-05-14 packaged-runtime product-surface
  refresh closes those gaps, so the current declared Local PVP status is `Complete`.

## Blocker Handling

If a blocker appears, continue all independent gates that do not depend on it. The final report must
name the blocker, the exact file or command evidence, and whether the blocker prevents `Complete`,
`Incomplete`, or `Blocked` status.

## Rollback Plan

- Revert documentation-only migration artifacts as one docs rollback if they prove inaccurate.
- Revert Unity source renames and boundary changes as a separate source rollback.
- Keep generated artifacts under ignored `artifacts/` paths so failed validation can be discarded
  without changing tracked source.
- Do not roll back unrelated user work.
