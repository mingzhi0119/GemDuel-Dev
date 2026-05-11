# Current Unity Migration Task Plan

Last updated: 2026-05-11

## Goal

Execute the full Unity migration governed by `docs/migration/unity-migration-governance.md`, with
Electron and `packages/shared` remaining the current gameplay and UX oracle until every mandatory
parity gate passes.

## Non-Goals

- Do not use any historical vertical-slice, scoped-parity, or 90-percent parity document as the
  active execution contract.
- Do not claim full migration completion while live Unity gameplay still depends on replay
  checkpoints, fixture stepping, mock-only data, or future work.
- Do not add Steamworks, Epic Online Services, app IDs, product IDs, partner files, credentials,
  upload outputs, Unity cache, or build artifacts.
- Do not change Electron behavior or shared contracts merely to make Unity pass.

## Files Allowed To Change

- `docs/migration/**`
- `docs/adr/**`
- `docs/README.md`
- `packages/shared/src/replay/**`
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
- Generated governance snapshots unless the owning script is intentionally run and the output is
  reviewed.

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
  54 hash-locked wrong-phase, resource, ownership, mismatch, follow-up, modal, and reproducible
  derived-state rejection cases that preserve source or derived-state revision hashes.
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
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testResults artifacts/unity/editmode-final-after-lan-settings-20260511-results.xml -logFile artifacts/unity/editmode-final-after-lan-settings-20260511.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testFilter GemDuel.Tests.EditMode.ReplayParityEditModeTests.UnityBridgeRejectsRejectionManifestWithoutMutatingOrRecording -testResults artifacts/unity/editmode-rejection-manifest-20260511-results.xml -logFile artifacts/unity/editmode-rejection-manifest-20260511.log
```

Unity editor/build commands are required when the local Unity executable is available:

```powershell
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testResults artifacts/unity/editmode-final-after-lan-settings-20260511-results.xml -logFile artifacts/unity/editmode-final-after-lan-settings-20260511.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -projectPath clients/unity -executeMethod GemDuel.Editor.BuildWindows.Build -logFile artifacts/unity/build-after-lan-settings-20260511.log -quit
```

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
