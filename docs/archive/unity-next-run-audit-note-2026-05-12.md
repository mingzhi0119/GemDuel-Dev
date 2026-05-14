# Unity Next Run Audit Note - 2026-05-12

Status: Incomplete.

This follow-up used the existing built Windows player and governed LocalDev mailbox smoke path to
add broader fresh-launch product-surface evidence, made one evidence-label-only source change so
bonus follow-ups report as `take_bonus_gem` instead of generic `click_board_cell`, and added a
bounded `privilege-first` smoke preference. The result strengthens bounded built-player evidence for
royal, steal, bonus, privilege activation/use follow-ups, and three deterministic built-player
game-over paths, then adds one built-player recovery save/load/continue proof, one built-player
settings save/load proof, one built-player rulebook/restart chrome proof, one built-player
replay-review visible undo/redo proof, malformed replay/draft bootstrap release-path rejection
proofs, one roguelike draft reroll/select proof, one representative invalid-action
no-mutation/no-recording release-path proof, one peek-modal open/close release-path proof, one
recovered invalid-action no-mutation/no-recording release-path proof, and one privilege-cancel
release-path proof, one reserved-discard release-path proof, one reserved-buy release-path proof,
one reserve-cancel release-path proof, one reserve-deck release-path proof, one Joker release-path
proof, one deck-reserve cancel release-path proof, and one no-pending cancel-reserve live-bridge
rejection proof, one P2 draft-select ordering rejection proof, and one no-take-3 board-selection
rejection proof, one coordinate-boundary rejection proof, one game-over action-after-winner
rejection proof, one Joker missing-color rejection proof, one Joker reserved-source rejection
proof, one Joker wrong-actor live-bridge rejection proof, one reserve wrong-actor live-bridge
rejection proof, one deck-reserve wrong-actor live-bridge rejection proof, one reserved-card
wrong-actor live-bridge rejection proof, one market-buy wrong-actor live-bridge rejection proof,
one privilege wrong-actor live-bridge rejection proof, one cancel-privilege wrong-actor
live-bridge rejection proof, one follow-up wrong-actor live-bridge rejection proof, and one
reserve-cancel wrong-actor live-bridge rejection proof, and one Joker color wrong-actor
live-bridge rejection proof, one discard phase-resolution live-bridge proof, one bonus/steal
phase-resolution live-bridge proof, and one royal phase-resolution live-bridge proof, but it does
not close replacement-candidate readiness.

## Evidence Added

- Built-player smoke:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-followup-breadth-20260512 --max-steps 80 --idle-action-preference balanced --timeout-ms 600000`
  passed using `artifacts/unity/build/windows/GemDuelUnity.exe`.
- Launcher report:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json`.
- The run passed with exit code 0, no timeout, 80 live bridge-backed commands, 81 mailbox events,
  stdout/player logs, replay export/import/review, final hash `94560a25`, and no fixture replay or
  checkpoint state replacement.
- Covered families in the new report: `buy_card`, `choose_royal`, `click_board_cell`,
  `discard_gem`, `replenish`, `select_joker_color`, `steal_gem`, and `take_gems`.
- The new report reaches `SELECT_ROYAL` and resolves `choose_royal`, and reaches `STEAL_ACTION`
  twice and resolves `steal_gem`.
- Evidence-label source change:
  `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevProductSurfaceSmoke.cs` now records a
  successful `BONUS_ACTION` board click as `take_bonus_gem` after the semantic click succeeds. This
  does not change gameplay or bridge commands.
- Windows rebuild:
  `artifacts/unity/build-bonus-family-label-20260512.log` reports `Build Successful` and
  `Build Finished, Result: Success.`.
- Bonus-family smoke:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-bonus-family-20260512 --max-steps 80 --idle-action-preference balanced --timeout-ms 600000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json`.
- The bonus-family smoke passed with exit code 0, no timeout, 80 live bridge-backed commands,
  explicit `take_bonus_gem` family events, replay export/import/review, final hash `cecbc068`, and
  no fixture replay or checkpoint state replacement.
- Intermediate aggregate after the bonus follow-up:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json` validates 6/6
  launcher reports, 224 bridge-backed commands, 230 mailbox events, eleven required action
  families, one replay release-path report, hashes `7d3f696c`, `5c804aa7`, `95c8a06c`, `9704183f`,
  `94560a25`, and `cecbc068`, and status `incomplete-evidence`.
- Privilege-first source change:
  `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevProductSurfaceSmoke.cs` now supports a
  `privilege-first` preference that uses a one-gem take to create a normal rules-engine privilege
  opportunity, then routes `activate_privilege` and board-target `USE_PRIVILEGE` through existing
  semantic targets. This does not change shared rules, Electron behavior, or replay contracts.
- Focused EditMode privilege proof:
  `clients/unity/artifacts/unity/editmode-privilege-smoke-20260512-results.xml` reports 1/1
  passed for `PrivilegeFirstProductSurfaceSmokeRoutesPrivilegeThroughLiveBridge`.
- Windows rebuild:
  `artifacts/unity/build-privilege-smoke-20260512.log` reports `Build Successful` and
  `Build Finished, Result: Success.`.
- Privilege-family smoke:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-privilege-family-20260512 --max-steps 3 --idle-action-preference privilege-first --timeout-ms 300000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T00-24-16-298Z.launcher.json`.
- The privilege-family smoke passed with exit code 0, no timeout, 3 live bridge-backed commands,
  action families `take_gems`, `activate_privilege`, and `use_privilege`, replay
  export/import/review, final hash `9e3b6f7c`, and no fixture replay or checkpoint state
  replacement.
- Refreshed aggregate after privilege:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json` validates 7/7
  launcher reports, 227 bridge-backed commands, 234 mailbox events, thirteen required action
  families, one replay release-path report, hashes `7d3f696c`, `5c804aa7`, `95c8a06c`, `9704183f`,
  `94560a25`, `cecbc068`, and `9e3b6f7c`, and status `incomplete-evidence`.
- Built-player game-over depth proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-game-over-20260512 --max-steps 240 --idle-action-preference balanced --timeout-ms 900000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T00-52-54-303Z.launcher.json`.
- The game-over smoke passed with exit code 0, no timeout, 98 live bridge-backed commands, winner
  `p1`, action families `buy_card`, `choose_royal`, `discard_gem`, `replenish`,
  `select_joker_color`, `steal_gem`, `take_bonus_gem`, and `take_gems`, replay
  export/import/review, final hash `d6dbea7a`, and no fixture replay or checkpoint state
  replacement.
- Additional built-player game-over depth proofs:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-game-over-alt-1-20260512 --max-steps 240 --idle-action-preference balanced --timeout-ms 900000`
  and
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-game-over-alt-2-20260512 --max-steps 240 --idle-action-preference balanced --timeout-ms 900000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T01-01-37-234Z.launcher.json` and
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T01-04-20-176Z.launcher.json`.
- The additional game-over smokes passed with exit code 0, no timeout, 98 and 92 live
  bridge-backed commands, winners `p2` and `p2`, replay export/import/review, final hashes
  `411262df` and `5f3bf567`, and no fixture replay or checkpoint state replacement.
- Final refreshed aggregate after game-over:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json` validates 10/10
  launcher reports, 515 bridge-backed commands, 525 mailbox events, thirteen required action
  families, one replay release-path report, hashes `7d3f696c`, `5c804aa7`, `95c8a06c`, `9704183f`,
  `94560a25`, `cecbc068`, `9e3b6f7c`, `d6dbea7a`, `411262df`, and `5f3bf567`, and status
  `incomplete-evidence`.
- Built-player recovery release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-recovery-release-path-20260512 --max-steps 2 --include-recovery-release-path --timeout-ms 420000`
  passed and wrote `artifacts/unity/built-player-smoke/smoke-2026-05-12T01-20-54-336Z.launcher.json`.
- The nested recovery report starts a fresh LocalDev game, saves recovery after one live command at
  hash `208a752`, loads recovery in a fresh controller, continues another live command to hash
  `8d4178f7`, exports/reviews the continued replay, and records no fixture replay gameplay driver or
  checkpoint state replacement.
- Final refreshed aggregate after recovery:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json` validates 11/11
  launcher reports, 517 bridge-backed commands, 531 mailbox events, thirteen required action
  families, one replay release-path report, one recovery release-path report, product hash
  `6b43d0c6`, recovery continuation hash `8d4178f7`, and status `incomplete-evidence`.
- Full EditMode suite:
  `clients/unity/artifacts/unity/editmode-recovery-full-20260512-results.xml` reports 67/67
  passed, start `2026-05-12 01:29:05Z`, end `2026-05-12 01:45:12Z`, duration `966.7110929`
  seconds.
- Built-player settings release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-settings-release-path-20260512 --max-steps 2 --include-settings-release-path --timeout-ms 420000`
  passed and wrote `artifacts/unity/built-player-smoke/smoke-2026-05-12T02-00-40-648Z.launcher.json`.
- The nested settings report starts a fresh LocalDev game, saves locale `en`, surface theme
  `pearl-opaline`, sound off, and LAN opponent visibility preferences off through visible controls,
  reloads those values in a fresh live-game controller, and preserves gameplay hashes plus zero
  settings-path replay events.
- Final refreshed aggregate after settings:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json` validates 12/12
  launcher reports, 519 bridge-backed commands, 536 mailbox events, thirteen required action
  families, one replay release-path report, one recovery release-path report, one settings
  release-path report, settings path `artifacts/unity/settings/gemduel.preferences.v1.json`, and
  status `incomplete-evidence`.
- Full EditMode suite after settings:
  `clients/unity/artifacts/unity/editmode-settings-full-20260512-results.xml` reports 68/68
  passed, start `2026-05-12 02:01:23Z`, end `2026-05-12 02:21:06Z`, duration `1182.6181857`
  seconds.
- Windows build after settings smoke:
  `artifacts/unity/build-settings-release-path-smoke-20260512.log` reports `Build Successful` and
  `Build Finished, Result: Success.`.
- Built-player chrome release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-chrome-release-path-20260512 --max-steps 2 --include-chrome-release-path --timeout-ms 420000`
  passed and wrote `artifacts/unity/built-player-smoke/smoke-2026-05-12T03-13-11-728Z.launcher.json`.
- The nested chrome report starts a fresh LocalDev game, opens and closes the rulebook without
  changing gameplay hash `8fa33a3f` or live replay event count, restarts to the shell, starts
  another fresh LocalDev game through the bridge, applies one live `take_gems` command, records
  restarted command hash `5304b037`, and records no fixture replay gameplay driver or checkpoint
  state replacement.
- Final refreshed aggregate after chrome:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-chrome.json` validates
  13/13 launcher reports, 521 bridge-backed commands, 542 mailbox events, thirteen required action
  families, one replay release-path report, one recovery release-path report, one settings
  release-path report, one chrome release-path report, settings path
  `artifacts/unity/settings/gemduel.preferences.v1.json`, chrome restart hash `5304b037`, and status
  `incomplete-evidence`.
- Full EditMode suite after chrome:
  `clients/unity/artifacts/unity/editmode-chrome-full-20260512-results.xml` reports 69/69 passed.
- Windows build after chrome smoke:
  `artifacts/unity/build-chrome-release-path-smoke-20260512.log` reports build success.
- Built-player replay-review release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-replay-review-release-path-20260512 --max-steps 4 --include-replay-review-release-path --timeout-ms 420000`
  passed and wrote `artifacts/unity/built-player-smoke/smoke-2026-05-12T03-32-18-999Z.launcher.json`.
- The nested replay-review report starts a fresh LocalDev game, exports a four-event live
  bridge-backed replay, imports it into a separate review controller, drives visible redo/undo
  controls through revisions `0 -> 1 -> 2 -> 1 -> final -> final-1 -> final`, restores first-redo
  hash `de4507f0` after undo, returns to final hash `db7fb1b7`, and verifies the source live game
  hash plus source live replay event count remain unchanged.
- Final refreshed aggregate after replay review:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-replay-review.json`
  validates 14/14 launcher reports, 525 bridge-backed commands, 552 mailbox events, thirteen
  required action families, one replay release-path report, one recovery release-path report, one
  settings release-path report, one chrome release-path report, one replay-review release-path
  report, replay-review final hash `db7fb1b7`, and status `incomplete-evidence`.
- Full EditMode suite after replay review:
  `clients/unity/artifacts/unity/editmode-replay-review-full-rerun-20260512-results.xml` reports
  70/70 passed, start `2026-05-12 03:54:21Z`, end `2026-05-12 04:12:23Z`, duration
  `1081.5809406` seconds.
- Windows build after replay-review smoke:
  `artifacts/unity/build-replay-review-release-path-smoke-20260512.log` reports build success.
- Focused bridge-failure boundary tests:
  `clients/unity/artifacts/unity/editmode-bridge-exception-mapping-20260512-results.xml` and
  `clients/unity/artifacts/unity/editmode-bridge-mailbox-failures-20260512-results.xml` each report
  1/1 passed. They cover `BRIDGE_TIMEOUT`/`BRIDGE_EXECUTION_FAILED` mapping, missing-mailbox
  messaging, mailbox timeout messaging, and mailbox temp/response cleanup.
- Malformed replay bootstrap release-path guard:
  `GemDuelGameController` now validates Replay vNext init shape before review bootstrap instead of
  letting `ReplayBootstrapper` synthesize state from malformed init data. The focused EditMode guard
  `clients/unity/artifacts/unity/editmode-malformed-bootstrap-release-path-20260512-results.xml`
  reports 1/1 passed, and the full EditMode suite
  `clients/unity/artifacts/unity/editmode-malformed-bootstrap-full-20260512-results.xml` reports
  72/72 passed.
- Built-player malformed-bootstrap proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-malformed-bootstrap-release-path-20260512 --max-steps 8 --include-replay-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T05-04-23-684Z.launcher.json`. The nested
  replay release-path report rejects `malformed_bootstrap` with `Replay init board must contain 5 rows.`,
  preserves live hash `ecaf5a49`, and preserves eight recorded live replay events.
- Final refreshed aggregate after malformed-bootstrap:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-malformed-bootstrap.json`
  validates 14/14 launcher reports, 525 bridge-backed commands, 552 mailbox events, thirteen
  required action families, one replay release-path report with `malformed_bootstrap`, one recovery
  release-path report, one settings release-path report, one chrome release-path report, one
  replay-review release-path report, and status `incomplete-evidence`.
- Windows build after malformed-bootstrap guard:
  `artifacts/unity/build-malformed-bootstrap-release-path-20260512.log` reports build success.
- Malformed draft bootstrap release-path guard:
  `ReplayReleasePathErrorsRecoverWithoutMutatingGameplayState` now imports an `INIT_DRAFT` replay
  with an empty `draftPool` and verifies rejection before review bootstrap without mutating live state
  or live replay recording. The focused EditMode result
  `clients/unity/artifacts/unity/editmode-malformed-draft-bootstrap-release-path-20260512-results.xml`
  reports 1/1 passed, and the follow-up full EditMode result
  `clients/unity/artifacts/unity/editmode-malformed-draft-bootstrap-full-20260512-results.xml`
  reports 72/72 passed.
- Built-player malformed draft bootstrap proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-malformed-draft-bootstrap-release-path-20260512 --max-steps 8 --include-replay-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T05-16-44-409Z.launcher.json`. The nested
  replay release-path report rejects `malformed_draft_bootstrap` with
  `Replay init draftPool must not be empty for INIT_DRAFT.`, preserves live hash `e5374467`, and
  preserves eight recorded live replay events.
- Final refreshed aggregate after malformed draft bootstrap:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-malformed-draft-bootstrap.json`
  validates 14/14 launcher reports, 525 bridge-backed commands, 552 mailbox events, thirteen
  required action families, one replay release-path report with `malformed_bootstrap` and
  `malformed_draft_bootstrap`, one recovery release-path report, one settings release-path report,
  one chrome release-path report, one replay-review release-path report, and status
  `incomplete-evidence`.
- Replay release-path evidence consistency audit:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-replay-release-path-audit.json`
  validates the same 14 built-player launcher reports, 525 commands, 552 mailbox events, one replay
  release-path report, and the full built-player replay release-path coverage set:
  `invalid_json`, `missing_file`, `unsupported_schema`, `malformed_bootstrap`,
  `malformed_draft_bootstrap`, `corrupted_summary`, `hash_mismatch`, `failed_overwrite_load`, and
  `valid_overwrite_reload_review`.
- Replay release-path summarizer guard:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now accepts
  `--require-replay-release-path`. `node --check` passed, the positive audit above passed with the
  flag enabled and full replay release-path coverage enforced, the historical 12-report
  `built-player-smoke-matrix-20260512.json` rebuilt without the opt-in guard, and a negative audit
  against a launcher report without replay release-path evidence failed as expected with
  `Required replay release-path proof was not covered.`.
- Windows build after malformed draft bootstrap guard:
  `artifacts/unity/build-malformed-draft-bootstrap-release-path-20260512.log` reports build success.
- Built-player draft release-path guard:
  `RoguelikeDraftProductSurfaceSmokeRerollsSelectsAndReviewsLiveReplay` starts roguelike LocalDev
  through `GemDuelGameController`/`IGameRulesEngine`, rerolls and selects for both draft players,
  exports/imports/reviews the live replay, and verifies no fixture replay gameplay driver or
  checkpoint state replacement. The focused EditMode result
  `clients/unity/artifacts/unity/editmode-draft-release-path-smoke-20260512-results.xml` reports
  1/1 passed, and the follow-up full EditMode result
  `clients/unity/artifacts/unity/editmode-draft-release-path-full-20260512-results.xml` reports
  73/73 passed.
- Built-player draft release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-draft-release-path-20260512 --start-mode roguelike --draft-action-preference reroll-each-player-first --max-steps 8 --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T05-44-04-969Z.launcher.json`. The smoke
  records `startMode: roguelike`, `draftActionPreference: reroll-each-player-first`, exit code 0,
  no timeout, eight live bridge-backed commands, action families `reroll_draft_pool`,
  `choose_boon`, and `take_gems`, replay export/import/review, and final hash `851b6356`.
- Draft-only aggregate before the invalid-action release-path follow-up:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-draft-release-path.json`
  validates 15/15 launcher reports, 533 bridge-backed commands, 561 mailbox events, required draft
  families `choose_boon` and `reroll_draft_pool`, the replay/recovery/settings/chrome/replay-review
  release-path reports, and status `incomplete-evidence`.
- Windows build after draft release-path smoke:
  `artifacts/unity/build-draft-release-path-smoke-20260512.log` reports build success.
- Built-player invalid-action release-path guard:
  `LocalDevInvalidActionReleasePathSmokeRejectsWithoutMutatingOrRecording` starts fresh LocalDev
  through `GemDuelGameController`/`IGameRulesEngine`, sends representative invalid commands through
  the live rules path, and verifies no state-hash mutation, no replay recording, and zero-event
  export/review hash preservation. The focused EditMode result
  `clients/unity/artifacts/unity/editmode-invalid-action-release-path-smoke-20260512-results.xml`
  reports 1/1 passed, and the follow-up full EditMode result
  `clients/unity/artifacts/unity/editmode-invalid-action-release-path-full-20260512-results.xml`
  reports 74/74 passed.
- Built-player invalid-action release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-invalid-action-release-path-20260512-rerun --max-steps 8 --include-invalid-action-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T06-34-40-146Z.launcher.json`. The nested
  report rejects `SELECT_BUFF`, `REROLL_DRAFT_POOL`, empty `TAKE_GEMS`, `CANCEL_RESERVE`,
  `CLOSE_MODAL`, and inactive actor `TAKE_GEMS` through the live bridge, keeps state and summary
  hashes at `1a6afd3f`, keeps recorded events at 0, exports a zero-event replay, and reviews it back
  to hash `1a6afd3f`.
- Final refreshed aggregate after invalid-action release-path:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-invalid-action-release-path.json`
  validates 16/16 launcher reports, 541 bridge-backed commands, 577 mailbox events, the previous
  replay/recovery/settings/chrome/replay-review/draft release-path reports, one invalid-action
  release-path report, and status `incomplete-evidence`.
- Windows build after invalid-action release-path smoke:
  `artifacts/unity/build-invalid-action-release-path-smoke-20260512.log` reports build success.
- Built-player peek-modal release-path guard:
  `LocalDevPeekModalReleasePathSmokeOpensClosesAndReviewsReplay` starts fresh roguelike LocalDev
  through `GemDuelGameController`/`IGameRulesEngine`, selects `intelligence`, opens the visible
  `peek_deck` control, closes the visible modal close control, records `select_buff`, `peek_deck`,
  and `close_modal`, exports/imports/reviews the live replay, and verifies no fixture replay
  gameplay driver or checkpoint state replacement. The focused EditMode result
  `clients/unity/artifacts/unity/editmode-peek-modal-release-path-smoke-20260512-results.xml`
  reports 1/1 passed, and the follow-up full EditMode result
  `clients/unity/artifacts/unity/editmode-peek-modal-release-path-full-20260512-results.xml`
  reports 75/75 passed.
- Built-player peek-modal release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-peek-modal-seed-17 --start-mode roguelike --max-steps 4 --include-peek-modal-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T07-56-40-905Z.launcher.json`. The primary
  smoke records exit code 0, no timeout, four live bridge-backed product commands, and final hash
  `26aa66c6`. The nested peek-modal report records event types `select_buff`, `select_buff`,
  `peek_deck`, and `close_modal`, preserves exported/controller/review final hash `8399eadd`, and
  records no fixture replay gameplay driver or checkpoint state replacement.
- Final refreshed aggregate after peek-modal release-path:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-peek-modal-release-path.json`
  validates 17/17 launcher reports, 545 bridge-backed commands, 587 mailbox events, the previous
  replay/recovery/settings/chrome/replay-review/draft/invalid-action release-path reports, one
  peek-modal release-path report, `peekModalFinalHashes: ["8399eadd"]`, and status
  `incomplete-evidence`.
- Windows build after peek-modal release-path smoke:
  `artifacts/unity/build-peek-modal-release-path-smoke-20260512.log` reports build success.
- Built-player recovery invalid-action release-path guard:
  `LocalDevRecoveryInvalidActionReleasePathSmokeRejectsAfterRestoreThenContinues` starts fresh
  LocalDev through `GemDuelGameController`/`IGameRulesEngine`, saves and reloads recovery, rejects
  representative invalid commands through the live rules path after restore, and verifies no state
  hash mutation, no replay recording append, and continued replay hash preservation. The focused
  EditMode result
  `clients/unity/artifacts/unity/editmode-recovery-invalid-action-release-path-smoke-20260512-results.xml`
  reports 1/1 passed, and the follow-up full EditMode result
  `clients/unity/artifacts/unity/editmode-recovery-invalid-action-release-path-full-20260512-results.xml`
  reports 76/76 passed.
- Built-player recovery invalid-action release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-recovery-invalid-action-release-path-20260512 --max-steps 2 --include-recovery-invalid-action-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T09-33-52-882Z.launcher.json`. The primary
  smoke records exit code 0, no timeout, two live bridge-backed product commands, and final hash
  `d2fd26e1`. The nested recovery invalid-action report saves and reloads hash `24a87497`, rejects
  `CANCEL_RESERVE`, `CLOSE_MODAL`, and inactive actor `TAKE_GEMS` through the live bridge without
  changing recovered/replay/summary hashes or increasing recorded events beyond 1, then continues
  a valid `take_gems`, exports/imports/reviews the replay, and preserves final hash `d2b51b3f`.
- Final refreshed aggregate after recovery invalid-action release-path:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-recovery-invalid-action-release-path.json`
  validates 18/18 launcher reports, 547 bridge-backed commands, 596 mailbox events, the previous
  replay/recovery/settings/chrome/replay-review/draft/invalid-action/peek-modal release-path
  reports, one recovery invalid-action release-path report, recovery-invalid final hash `d2b51b3f`,
  and status `incomplete-evidence`.
- Windows build after recovery invalid-action release-path smoke:
  `artifacts/unity/build-recovery-invalid-action-release-path-smoke-20260512.log` reports build
  success.
- Built-player privilege-cancel release-path guard:
  `LocalDevPrivilegeCancelReleasePathSmokeCancelsAndReviewsReplay` starts fresh LocalDev through
  `GemDuelGameController`/`IGameRulesEngine`, creates a normal privilege opportunity, enters
  `PRIVILEGE_ACTION`, cancels through the visible cancel control, and verifies live replay
  export/import/review hash preservation. The focused EditMode result
  `clients/unity/artifacts/unity/editmode-privilege-cancel-release-path-smoke-20260512-results.xml`
  reports 1/1 passed, and the follow-up full EditMode result
  `clients/unity/artifacts/unity/editmode-privilege-cancel-release-path-full-20260512-results.xml`
  reports 77/77 passed.
- Built-player privilege-cancel release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-privilege-family-20260512 --max-steps 3 --idle-action-preference privilege-first --include-privilege-cancel-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T10-51-01-649Z.launcher.json`. The primary
  smoke records exit code 0, no timeout, three live bridge-backed product commands, and final hash
  `9e3b6f7c`. The nested privilege-cancel report records `take_gems`, `activate_privilege`, and
  `cancel_privilege`, enters `PRIVILEGE_ACTION`, returns to `IDLE`, exports/imports/reviews the
  replay, and preserves final hash `efe66377`.
- Refreshed aggregate after privilege-cancel release-path:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-privilege-cancel-release-path.json`
  validates 19/19 launcher reports, 550 bridge-backed commands, 604 mailbox events, the previous
  replay/recovery/settings/chrome/replay-review/draft/invalid-action/peek-modal/recovery-invalid-action
  release-path reports, one privilege-cancel release-path report, privilege-cancel final hash
  `efe66377`, and status `incomplete-evidence`.
- Windows build after privilege-cancel release-path smoke:
  `artifacts/unity/build-privilege-cancel-release-path-smoke-20260512.log` reports build success.
- Built-player reserved-discard release-path guard:
  `LocalDevReservedDiscardReleasePathSmokeDiscardsAndReviewsReplay` starts fresh roguelike LocalDev
  through `GemDuelGameController`/`IGameRulesEngine`, selects `puppet_master`, reserves a live
  market card through visible preview controls, opens the visible reserved-card preview, discards
  through the visible discard control, and verifies live replay export/import/review hash
  preservation. The focused EditMode result
  `clients/unity/artifacts/unity/editmode-reserved-discard-release-path-smoke-20260512-results.xml`
  reports 1/1 passed. The full EditMode suite was not rerun after this focused guard.
- Built-player reserved-discard release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-reserved-discard-seed-10 --start-mode roguelike --max-steps 6 --include-reserved-discard-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T11-39-09-986Z.launcher.json`. The primary
  smoke records exit code 0, no timeout, six live bridge-backed product commands, and final hash
  `fb772d70`. The nested reserved-discard report records `select_buff`, `initiate_reserve`,
  `reserve_card`, `take_gems`, and `discard_reserved`, exports/imports/reviews the replay, and
  preserves final hash `33909286`.
- Final refreshed aggregate after reserved-discard release-path:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserved-discard-release-path.json`
  validates 20/20 launcher reports, 556 bridge-backed commands, 618 mailbox events, the previous
  replay/recovery/settings/chrome/replay-review/draft/invalid-action/peek-modal/recovery-invalid-action/
  privilege-cancel release-path reports, one reserved-discard release-path report,
  reserved-discard final hash `33909286`, and status `incomplete-evidence`.
- Windows build after reserved-discard release-path smoke:
  `artifacts/unity/build-reserved-discard-release-path-smoke-20260512.log` reports build success.
- Built-player reserved-buy release-path guard:
  `LocalDevReservedBuyReleasePathSmokeBuysAndReviewsReplay` starts fresh LocalDev through
  `GemDuelGameController`/`IGameRulesEngine`, reserves a live market card through visible preview
  controls, opens the visible reserved-card preview, buys through the visible preview primary
  action, and verifies ordered `reserve_card` then reserved-source `buy_card` plus live replay
  export/import/review hash preservation. The focused EditMode result
  `clients/unity/artifacts/unity/editmode-reserved-buy-release-path-smoke-20260512-results.xml`
  reports 1/1 passed. The full EditMode suite was not rerun after this focused guard.
- Built-player reserved-buy release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-reserved-buy-seed-20260512 --max-steps 6 --include-reserved-buy-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T12-29-42-881Z.launcher.json`. The primary
  smoke records exit code 0, no timeout, six live bridge-backed product commands, and final hash
  `8ea252da`. The nested reserved-buy report reserves `c:155-bk#0`, records `initiate_reserve`,
  `reserve_card`, five setup `take_gems` turns, and reserved-source `buy_card`,
  exports/imports/reviews the replay, and preserves final hash `47c0e9db`.
- Final refreshed aggregate after reserved-buy release-path:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserved-buy-release-path.json`
  validates 21/21 launcher reports, 562 bridge-backed commands, 634 mailbox events, the previous
  replay/recovery/settings/chrome/replay-review/draft/invalid-action/peek-modal/recovery-invalid-action/
  privilege-cancel/reserved-discard release-path reports, one reserved-buy release-path report,
  reserved-buy final hash `47c0e9db`, and status `incomplete-evidence`.
- Windows build after reserved-buy release-path smoke:
  `artifacts/unity/build-reserved-buy-release-path-smoke-20260512.log` reports build success.
- Built-player reserve-cancel release-path guard:
  `LocalDevReserveCancelReleasePathSmokeCancelsAndReviewsReplay` starts fresh LocalDev through
  `GemDuelGameController`/`IGameRulesEngine`, opens a visible market card preview, enters
  `RESERVE_WAITING_GEM`, cancels through the visible reserve cancel control, returns to `IDLE`
  without a pending reserve or reserved card, records ordered `initiate_reserve` and
  `cancel_reserve`, and preserves live replay export/import/review hash `40bdddbf`. The focused
  EditMode result
  `clients/unity/artifacts/unity/editmode-reserve-cancel-release-path-smoke-20260512-results.xml`
  reports 1/1 passed. The full EditMode suite was not rerun after this focused guard.
- Built-player reserve-cancel release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-editmode-live-reserve-cancel --max-steps 6 --include-reserve-cancel-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T13-21-32-993Z.launcher.json`. The primary
  smoke records exit code 0, no timeout, six live bridge-backed product commands, and final hash
  `bdbabdbb`. The nested reserve-cancel report records `initiate_reserve`, `cancel_reserve`, and
  final hash `40bdddbf`.
- Final refreshed aggregate after reserve-cancel release-path:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-cancel-release-path.json`
  validates 22/22 launcher reports, 568 bridge-backed commands, 644 mailbox events, the previous
  replay/recovery/settings/chrome/replay-review/draft/invalid-action/peek-modal/recovery-invalid-action/
  privilege-cancel/reserved-discard/reserved-buy release-path reports, one reserve-cancel
  release-path report, reserve-cancel final hash `40bdddbf`, and status `incomplete-evidence`.
- Windows build after reserve-cancel release-path smoke:
  `artifacts/unity/build-reserve-cancel-release-path-smoke-20260512.log` reports build success.
- Built-player reserve-deck release-path guard:
  `LocalDevReserveDeckReleasePathSmokeReservesAndReviewsReplay` starts fresh LocalDev through
  `GemDuelGameController`/`IGameRulesEngine`, opens a visible market deck preview, initiates deck
  reserve through the visible preview reserve control, completes the Gold follow-up through a visible
  board target, records ordered `initiate_reserve_deck` and `reserve_deck`, reduces the level-1 deck
  count from 25 to 24, increases P1 reserved cards from 0 to 1, consumes the selected Gold cell, and
  preserves live replay export/import/review hash `da89d9e5`. The focused EditMode result
  `clients/unity/artifacts/unity/editmode-reserve-deck-release-path-smoke-20260512-results.xml`
  reports 1/1 passed. The full EditMode suite was not rerun after this focused guard.
- Built-player reserve-deck release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-editmode-live-reserve-deck --max-steps 6 --include-reserve-deck-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T13-59-30-560Z.launcher.json`. The primary
  smoke records exit code 0, no timeout, six live bridge-backed product commands, and final hash
  `63df431c`. The nested reserve-deck report records `initiate_reserve_deck`, `reserve_deck`, and
  final hash `da89d9e5`.
- Final refreshed aggregate after reserve-deck release-path:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-deck-release-path.json`
  validates 23/23 launcher reports, 574 bridge-backed commands, 654 mailbox events, the previous
  replay/recovery/settings/chrome/replay-review/draft/invalid-action/peek-modal/recovery-invalid-action/
  privilege-cancel/reserved-discard/reserved-buy/reserve-cancel release-path reports, one reserve-deck
  release-path report, reserve-deck final hash `da89d9e5`, and status `incomplete-evidence`.
- Windows build after reserve-deck release-path smoke:
  `artifacts/unity/build-reserve-deck-release-path-smoke-20260512.log` reports build success.
- Built-player Joker release-path guard:
  `LocalDevJokerReleasePathSmokeBuysAndReviewsReplay` starts fresh LocalDev through
  `GemDuelGameController`/`IGameRulesEngine`, drives six live setup `take_gems` commands until
  visible Joker `c:174-jo#0` is affordable, opens the visible market preview, buys through the
  visible preview primary action, selects visible color `red`, records ordered
  `initiate_buy_joker` and `buy_card`, leaves `SELECT_CARD_COLOR` for `IDLE`, clears pending buy,
  adds the Joker to P1 tableau, and preserves live replay export/import/review hash `95c8a06c`.
  The focused EditMode result
  `clients/unity/artifacts/unity/editmode-joker-release-path-smoke-20260512-results.xml` reports
  1/1 passed. The full EditMode suite was not rerun after this focused guard.
- Built-player Joker release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-replay-release-path-20260511 --max-steps 8 --include-joker-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T14-52-59-171Z.launcher.json`. The primary
  smoke records exit code 0, no timeout, eight live bridge-backed product commands, and final hash
  `95c8a06c`. The nested Joker report records `initiate_buy_joker`, `buy_card`, and final hash
  `95c8a06c`.
- Final refreshed aggregate after Joker release-path:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-joker-release-path.json`
  validates 24/24 launcher reports, 582 bridge-backed commands, 672 mailbox events, the previous
  replay/recovery/settings/chrome/replay-review/draft/invalid-action/peek-modal/recovery-invalid-action/
  privilege-cancel/reserved-discard/reserved-buy/reserve-cancel/reserve-deck release-path reports,
  one Joker release-path report, Joker final hash `95c8a06c`, and status `incomplete-evidence`.
- Windows build after Joker release-path smoke:
  `artifacts/unity/build-joker-release-path-smoke-20260512.log` reports build success.
- Built-player deck-reserve cancel release-path guard:
  `LocalDevReserveDeckCancelReleasePathSmokeCancelsAndReviewsReplay` starts fresh LocalDev through
  `GemDuelGameController`/`IGameRulesEngine`, opens a visible market deck preview, initiates deck
  reserve through the visible preview reserve control, enters `RESERVE_WAITING_GEM`, cancels through
  the visible cancel control before selecting Gold, records ordered `initiate_reserve_deck` and
  `cancel_reserve`, returns to `IDLE`, leaves deck, reserved-card, and Gold-cell state unchanged, and
  preserves live replay export/import/review hash `62fa027f`. The focused EditMode result
  `clients/unity/artifacts/unity/editmode-reserve-deck-cancel-release-path-smoke-20260512-results.xml`
  reports 1/1 passed. The full EditMode suite was not rerun after this focused guard.
- Built-player deck-reserve cancel release-path proof:
  `node tools/migration/run-unity-built-player-smoke.mjs --seed unity-built-player-replay-release-path-20260511 --max-steps 8 --include-reserve-deck-cancel-release-path --timeout-ms 420000`
  passed and wrote
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T15-27-57-407Z.launcher.json`. The primary
  smoke records exit code 0, no timeout, eight live bridge-backed product commands, and final hash
  `95c8a06c`. The nested deck-reserve cancel report records `initiate_reserve_deck`,
  `cancel_reserve`, and final hash `62fa027f`.
- Final refreshed aggregate after deck-reserve cancel release-path:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-deck-cancel-release-path.json`
  validates 25/25 launcher reports, 590 bridge-backed commands, 684 mailbox events, the previous
  replay/recovery/settings/chrome/replay-review/draft/invalid-action/peek-modal/recovery-invalid-action/
  privilege-cancel/reserved-discard/reserved-buy/reserve-cancel/reserve-deck/Joker release-path
  reports, one deck-reserve cancel release-path report, deck-reserve cancel final hash `62fa027f`,
  and status `incomplete-evidence`.
- Strict aggregate release-path guard audit:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-all-release-paths-audit.json`
  revalidates the same 25 launcher reports with every current release-path requirement flag enabled,
  including `--require-replay-release-path`; it passed with 590 commands, 684 mailbox events, and
  status `incomplete-evidence`.
- Built-player resource-first breadth proof:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T20-12-00-000Z.resource-first.launcher.json`
  passed with exit code 0 and no timeout. It starts a fresh classic LocalDev built Windows player
  run, applies 120 live `take_gems`, `discard_gem`, and `replenish` commands through the mailbox
  bridge, exports/imports/reviews the replay, and preserves final hash `7669d935`. The aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-resource-first-breadth.json`
  validates 26/26 launcher reports, 710 commands, 805 mailbox events, all currently observed action
  families, every available release-path requirement flag, and status `incomplete-evidence`.
- Windows build after deck-reserve cancel release-path smoke:
  `artifacts/unity/build-reserve-deck-cancel-release-path-smoke-20260512.log` reports build success.
- Cancel-reserve no-pending rejection proof:
  `fixtures/replay-golden/rejection-manifest.json` now has 55 cases, including
  `reject-cancel-reserve-no-pending` with tag `edge:CANCEL_RESERVE:no-pending`. The case derives a
  `RESERVE_WAITING_GEM` replay state, clears pending reserve as a corrupt/recovered-state boundary,
  and expects `CANCEL_RESERVE` to reject while preserving replay-state hash `3b87795f`.
- Focused Unity EditMode cancel-reserve no-pending proof:
  `clients/unity/artifacts/unity/editmode-rejection-manifest-no-pending-20260512-results.xml`
  reports 1/1 passed. Unity primes the case from the TypeScript replay-state oracle, sends the
  invalid action through the live `IGameRulesEngine` bridge, and verifies unchanged hash plus
  unchanged live replay recording count.
- P2 draft select ordering rejection proof:
  `fixtures/replay-golden/rejection-manifest.json` now has 56 cases, including
  `reject-select-buff-p2-before-p1-selection` with tag `edge:SELECT_BUFF:p2-before-p1`. The case
  derives a stale-pool P2 draft state before P1 locks a buff and expects `SELECT_BUFF` to reject
  while preserving replay-state hash `5c903209`.
- Focused Unity EditMode P2 draft select ordering proof:
  `clients/unity/artifacts/unity/editmode-rejection-manifest-p2-select-order-20260512-results.xml`
  reports 1/1 passed. Unity primes the case from the TypeScript replay-state oracle, sends the
  invalid action through the live `IGameRulesEngine` bridge, and verifies unchanged hash plus
  unchanged live replay recording count.
- Take-gems no-take-3 rejection proof:
  At that point in the run, `fixtures/replay-golden/rejection-manifest.json` included
  `reject-take-gems-no-take-3-buff` with tag `edge:TAKE_GEMS:no-take-3`. The case derives a
  normal Local PvP `IDLE` replay state, applies the existing `DESPERATE_GAMBLE` no-take-3 buff to
  the active player, attempts a valid three-gem board selection, and expects `TAKE_GEMS` to reject
  while preserving replay-state hash `8e546f4c`.
- Focused Unity EditMode no-take-3 proof:
  `clients/unity/artifacts/unity/editmode-rejection-manifest-no-take-3-20260512-results.xml`
  reports 1/1 passed. Unity primes the case from the TypeScript replay-state oracle, sends the
  invalid action through the live `IGameRulesEngine` bridge, and verifies unchanged hash plus
  unchanged live replay recording count.
- Coordinate-boundary rejection proof:
  `fixtures/replay-golden/rejection-manifest.json` now has 62 cases, adding
  `reject-take-gems-out-of-bounds`, `reject-take-bonus-gem-out-of-bounds`,
  `reject-reserve-card-gold-out-of-bounds`, `reject-reserve-deck-gold-out-of-bounds`, and
  `reject-use-privilege-out-of-bounds`. The cases close explicit TypeScript oracle validation
  branches for board selection, bonus target, reserve Gold follow-up, deck-reserve Gold follow-up,
  and privilege target coordinates while preserving replay-state hashes `e1b5e1bf`, `329600a9`,
  `fd6d5832`, `6173696c`, and `d8141986`.
- Focused Unity EditMode coordinate-boundary proof:
  `clients/unity/artifacts/unity/editmode-rejection-manifest-coordinate-boundary-20260512-rerun-results.xml`
  reports 1/1 passed from `2026-05-12 17:58:49Z` to `18:01:13Z`. Unity primes the
  62-case manifest from the TypeScript replay-state oracle, sends each invalid action through the
  live `IGameRulesEngine` bridge, and verifies unchanged hash plus unchanged live replay recording
  count. The first coordinate-boundary attempt timed out at the previous 180 second guard while
  processing the enlarged manifest, so the retained passing guard uses a 360 second timeout.
- Game-over action-after-winner rejection proof:
  `fixtures/replay-golden/rejection-manifest.json` now has 63 cases, adding
  `reject-action-after-game-over` with tag `edge:GAME_OVER:action-after-winner`. The case primes
  completed revision 95 from `local-pvp-royal-extra-turn-game-over`, attempts `REPLENISH`, expects
  `The game has already ended.`, and preserves replay-state hash `4b6ab7ec`.
- Focused Unity EditMode game-over proof:
  `clients/unity/artifacts/unity/editmode-rejection-manifest-game-over-20260512-results.xml`
  reports 1/1 passed from `2026-05-12 18:30:46Z` to `18:33:41Z`. Unity primes the 63-case manifest
  from the TypeScript replay-state oracle, sends each invalid action through the live
  `IGameRulesEngine` bridge, and verifies unchanged hash plus unchanged live replay recording count.
- Joker reserved-source rejection proof:
  `fixtures/replay-golden/rejection-manifest.json` now has 65 cases, adding
  `reject-initiate-buy-joker-reserved-not-owned` with tag
  `edge:INITIATE_BUY_JOKER:reserved-not-owned`. The case primes revision 0 from
  `local-pvp-joker-color-selection`, attempts to initiate a visible market Joker through the
  reserved-card source boundary, expects
  `Reserved card does not belong to the active player.`, and preserves replay-state hash
  `b5d9cbbf`.
- Focused Unity EditMode Joker reserved-source proof:
  `clients/unity/artifacts/unity/editmode-rejection-manifest-joker-reserved-source-20260512-results.xml`
  reports 1/1 passed from `2026-05-12 20:18:45Z` to `20:21:52Z`. Unity primes the 65-case manifest
  from the TypeScript replay-state oracle, sends each invalid action through the live
  `IGameRulesEngine` bridge, and verifies unchanged hash plus unchanged live replay recording count.
- Focused Unity EditMode Joker wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-joker-wrong-actor-rejection-20260512-results.xml`
  reports 1/1 passed from `2026-05-12 20:35:02Z` to `20:35:11Z`. Unity starts a fresh LocalDev game
  with a visible market Joker, sends `INITIATE_BUY_JOKER` with actor override `p2` while the live
  state turn is `p1`, and verifies the command rejects without changing the replay-state hash,
  setting `pendingBuy`, or appending a live replay event.
- Focused Unity EditMode reserve wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-reserve-wrong-actor-rejection-20260512-results.xml`
  reports 1/1 passed from `2026-05-12 20:43:18Z` to `20:43:38Z`. Unity starts a fresh LocalDev game,
  rejects wrong-actor `INITIATE_RESERVE` from `IDLE` without state or replay mutation, then rejects
  wrong-actor `RESERVE_CARD` after a valid pending reserve while preserving the pending reserve
  state, replay-state hash, and one recorded initiate event.
- Focused Unity EditMode deck-reserve wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-deck-reserve-wrong-actor-rejection-20260512-results.xml`
  reports 1/1 passed from `2026-05-12 20:50:22Z` to `20:50:39Z`. Unity starts a fresh LocalDev game,
  rejects wrong-actor `INITIATE_RESERVE_DECK` from `IDLE` without state or replay mutation, then
  rejects wrong-actor `RESERVE_DECK` after a valid pending deck reserve while preserving
  `pendingReserve.isDeck`, replay-state hash, and one recorded initiate event.
- Focused Unity EditMode privilege wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-privilege-wrong-actor-rejection-20260512-results.xml`
  reports 2/2 passed from `2026-05-12 21:20:10Z` to `21:20:23Z`. Unity starts fresh LocalDev games,
  rejects wrong-actor `ACTIVATE_PRIVILEGE` from `IDLE` and wrong-actor `USE_PRIVILEGE` from
  `PRIVILEGE_ACTION`, preserves replay-state hashes, privilege charges, board, and inventory state,
  and appends no live Replay vNext events.
- Focused Unity EditMode cancel-privilege wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-cancel-privilege-wrong-actor-rejection-20260512-results.xml`
  reports 1/1 passed from `2026-05-12 21:28:16Z` to `21:28:21Z`. Unity starts a fresh LocalDev game,
  rejects wrong-actor `CANCEL_PRIVILEGE` from `PRIVILEGE_ACTION`, preserves replay-state hash,
  phase, turn, privilege charge, board, and inventory state, and appends no live Replay vNext event.
- Focused Unity EditMode follow-up wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-follow-up-wrong-actor-rejection-20260512-results.xml`
  reports 1/1 passed from `2026-05-12 21:39:45Z` to `21:39:53Z`. Unity starts a fresh LocalDev game,
  rejects wrong-actor `TAKE_BONUS_GEM`, `DISCARD_GEM`, and `STEAL_GEM` from valid follow-up phase
  setups, preserves replay-state hashes, phase, turn, board, and relevant inventory state, and
  appends no live Replay vNext events.
- Focused Unity EditMode reserve-cancel wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-reserve-cancel-wrong-actor-rejection-20260512-results.xml`
  reports 1/1 passed from `2026-05-12 21:46:29Z` to `21:46:35Z`. Unity starts a fresh LocalDev game,
  records valid active-player `INITIATE_RESERVE`, rejects wrong-actor `CANCEL_RESERVE` from
  `RESERVE_WAITING_GEM`, preserves replay-state hash, phase, turn, pending reserve, market card,
  and reserved-card count, and appends no additional live Replay vNext event.
- Focused Unity EditMode Joker color wrong-actor bridge proof:
  `clients/unity/artifacts/unity/editmode-joker-color-wrong-actor-rejection-20260512-results.xml`
  reports 1/1 passed from `2026-05-12 21:54:12Z` to `21:54:20Z`. Unity starts a fresh LocalDev game,
  records valid active-player Joker initiation into `SELECT_CARD_COLOR`, rejects wrong-actor
  color-follow-up `BUY_CARD`, preserves replay-state hash, phase, turn, pending buy, market card,
  and player tableau state, and appends no additional live Replay vNext event.
- Focused Unity EditMode discard phase-resolution bridge proof:
  `clients/unity/artifacts/unity/editmode-discard-phase-resolution-20260512-results.xml`
  reports 1/1 passed from `2026-05-12 22:03:41Z` to `22:03:48Z`. Unity starts a fresh LocalDev game,
  uses a controlled over-limit `DISCARD_EXCESS_GEMS` state, applies two live `DISCARD_GEM` commands
  through `GemDuelGameController` and `IGameRulesEngine`, records two Replay vNext events, stays in
  `DISCARD_EXCESS_GEMS` at 11 gems, then resolves to `IDLE` and hands the turn to `p2` at 10 gems
  with the exported replay summary hash aligned to the current state hash.
- Focused Unity EditMode bonus/steal phase-resolution bridge proof:
  `clients/unity/artifacts/unity/editmode-bonus-steal-phase-resolution-20260512-results.xml`
  reports 1/1 passed from `2026-05-12 22:13:19Z` to `22:13:28Z`. Unity starts fresh LocalDev
  controllers, uses controlled `BONUS_ACTION` and `STEAL_ACTION` states, applies valid live
  `TAKE_BONUS_GEM` and `STEAL_GEM` commands through `GemDuelGameController` and
  `IGameRulesEngine`, records one Replay vNext event per command, verifies the expected
  board/inventory mutation, resolves both follow-up phases to `IDLE`, hands turn to `p2`, and keeps
  each exported replay summary hash aligned to the current state hash.
- Focused Unity EditMode royal phase-resolution bridge proof:
  `clients/unity/artifacts/unity/editmode-royal-phase-resolution-20260512-results.xml` reports 1/1
  passed from `2026-05-12 22:19:13Z` to `22:19:17Z`. Unity starts fresh LocalDev, uses a controlled
  `SELECT_ROYAL` state with `r91-ro` available, applies valid live `SELECT_ROYAL_CARD` through
  `GemDuelGameController` and `IGameRulesEngine`, records one Replay vNext `select_royal` event,
  moves `r91-ro` from the royal deck to P1, resolves to `IDLE`, hands turn to `p2`, and keeps the
  exported replay summary hash aligned to the current state hash.

## Validation

- `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-replay-review.json ...`
  passed for the fourteen launcher reports with `--require-recovery-release-path`,
  `--require-settings-release-path`, `--require-chrome-release-path`, and
  `--require-replay-review-release-path`.
- `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-malformed-bootstrap.json ...`
  passed for the refreshed fourteen launcher reports and includes `malformed_bootstrap` replay
  release-path coverage.
- `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-malformed-draft-bootstrap.json ...`
  passed for the refreshed fourteen launcher reports and includes `malformed_bootstrap` plus
  `malformed_draft_bootstrap` replay release-path coverage.
- `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-draft-release-path.json ...`
  passed for the refreshed fifteen launcher reports and includes `choose_boon` plus
  `reroll_draft_pool` draft release-path coverage.
- `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-invalid-action-release-path.json ...`
  passed for the refreshed sixteen launcher reports and includes one invalid-action release-path
  report.
- `node --check tools/migration/run-unity-built-player-smoke.mjs` and
  `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed after the
  reserved-buy release-path script changes.
- `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-peek-modal-release-path.json ...`
  passed for the refreshed seventeen launcher reports and includes one peek-modal release-path
  report.
- `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-recovery-invalid-action-release-path.json ...`
  passed for the refreshed eighteen launcher reports and includes one recovery invalid-action
  release-path report.
- `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-privilege-cancel-release-path.json ...`
  passed for the refreshed nineteen launcher reports and includes one privilege-cancel
  release-path report.
- `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserved-discard-release-path.json ...`
  passed for the refreshed twenty launcher reports and includes one reserved-discard release-path
  report.
- `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserved-buy-release-path.json ...`
  passed for the refreshed twenty-one launcher reports and includes one reserved-buy release-path
  report.
- `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-cancel-release-path.json ...`
  passed for the refreshed twenty-two launcher reports and includes one reserve-cancel release-path
  report.
- `node --check tools/migration/run-unity-built-player-smoke.mjs` and
  `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed after the
  reserve-cancel release-path script changes.
- `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-deck-release-path.json ...`
  passed for the refreshed twenty-three launcher reports and includes one reserve-deck release-path
  report.
- `node --check tools/migration/run-unity-built-player-smoke.mjs` and
  `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed after the
  reserve-deck release-path script changes.
- `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-joker-release-path.json ...`
  passed for the refreshed twenty-four launcher reports and includes one Joker release-path report.
- `node --check tools/migration/run-unity-built-player-smoke.mjs` and
  `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed after the Joker
  release-path script changes.
- `node tools/migration/summarize-unity-built-player-smokes.mjs --check --out artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-deck-cancel-release-path.json ...`
  passed for the refreshed twenty-five launcher reports and includes one deck-reserve cancel
  release-path report.
- `node --check tools/migration/run-unity-built-player-smoke.mjs` and
  `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed after the
  deck-reserve cancel release-path script changes.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed after the cancel-reserve no-pending follow-up with 11 fixtures, the then-current rejection
  manifest, and no declared coverage gaps.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed after the P2 draft select ordering follow-up with 11 fixtures, 56 rejection cases, and no
  declared coverage gaps.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-fixtures.ts`
  regenerated the replay-golden corpus after the no-take-3 follow-up.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed after the no-take-3 follow-up with 11 fixtures, the then-current rejection manifest, and
  no declared coverage gaps.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-fixtures.ts`
  regenerated the replay-golden corpus after the coordinate-boundary follow-up.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed after the coordinate-boundary follow-up with 11 fixtures, 62 rejection cases, and no
  declared coverage gaps.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-fixtures.ts`
  regenerated the replay-golden corpus after the game-over follow-up.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed after the game-over follow-up with 11 fixtures, 63 rejection cases, and no declared
  coverage gaps.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-fixtures.ts`
  regenerated the replay-golden corpus after the Joker missing-color follow-up.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed after the Joker missing-color follow-up with 11 fixtures, 64 rejection cases, and no
  declared coverage gaps. The new case is `reject-buy-card-joker-without-color`, revision 5 from
  `local-pvp-joker-color-selection`, rejection reason
  `A concrete bonus color is required before buying this card.`, and unchanged hash `d0a0e459`.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-fixtures.ts`
  regenerated the replay-golden corpus after the Joker reserved-source follow-up.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed after the Joker reserved-source follow-up with 11 fixtures, 65 rejection cases, and no
  declared coverage gaps. The new case is `reject-initiate-buy-joker-reserved-not-owned`, revision
  0 from `local-pvp-joker-color-selection`, rejection reason
  `Reserved card does not belong to the active player.`, and unchanged hash `b5d9cbbf`.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed after the
  game-over follow-up with 32 tests.
- `pnpm exec vitest run packages/shared/src/logic/actions/__tests__/buffActions.branch.test.ts`
  passed after the P2 draft select ordering follow-up with six focused shared action/validation
  tests.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed after the
  P2 draft select ordering follow-up with 32 tests.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed after the
  no-take-3 follow-up with 32 tests.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed after the
  coordinate-boundary follow-up with 32 tests.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed after the Joker
  missing-color follow-up with 32 tests. This includes the LocalDev bridge hardening that removes
  the prior implicit `red` fallback for missing Joker bonus-color payloads.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed after the Joker
  reserved-source follow-up with 32 tests.
- `clients/unity/artifacts/unity/editmode-rejection-manifest-no-take-3-20260512-results.xml`
  passed 1/1 from `2026-05-12 17:27:24Z` to `17:30:10Z`.
- `clients/unity/artifacts/unity/editmode-rejection-manifest-coordinate-boundary-20260512-rerun-results.xml`
  passed 1/1 from `2026-05-12 17:58:49Z` to `18:01:13Z`.
- `clients/unity/artifacts/unity/editmode-rejection-manifest-game-over-20260512-results.xml`
  passed 1/1 from `2026-05-12 18:30:46Z` to `18:33:41Z`.
- `clients/unity/artifacts/unity/editmode-rejection-manifest-joker-color-20260512-results.xml`
  first failed because the LocalDev bridge accepted the missing-color Joker command after
  normalizing it to `red`; the fixed rerun
  `clients/unity/artifacts/unity/editmode-rejection-manifest-joker-color-20260512-rerun-results.xml`
  passed 1/1 from `2026-05-12 19:08:07Z` to `19:11:04Z`.
- `clients/unity/artifacts/unity/editmode-rejection-manifest-joker-reserved-source-20260512-results.xml`
  passed 1/1 from `2026-05-12 20:18:45Z` to `20:21:52Z`.
- `clients/unity/artifacts/unity/editmode-joker-wrong-actor-rejection-20260512-results.xml`
  passed 1/1 from `2026-05-12 20:35:02Z` to `20:35:11Z`, proving a visible market Joker
  `INITIATE_BUY_JOKER` command with actor override `p2` rejects without state hash or live replay
  recording mutation while the active state turn is `p1`.
- `clients/unity/artifacts/unity/editmode-reserve-wrong-actor-rejection-20260512-results.xml`
  passed 1/1 from `2026-05-12 20:43:18Z` to `20:43:38Z`, proving wrong-actor `INITIATE_RESERVE`
  and wrong-actor `RESERVE_CARD` reject without state hash or live replay recording mutation while
  preserving the appropriate `IDLE` or pending-reserve phase.
- `clients/unity/artifacts/unity/editmode-deck-reserve-wrong-actor-rejection-20260512-results.xml`
  passed 1/1 from `2026-05-12 20:50:22Z` to `20:50:39Z`, proving wrong-actor
  `INITIATE_RESERVE_DECK` and wrong-actor `RESERVE_DECK` reject without state hash or live replay
  recording mutation while preserving the appropriate `IDLE` or pending deck-reserve phase.
- `clients/unity/artifacts/unity/editmode-reserved-card-wrong-actor-rejection-20260512-results.xml`
  passed 2/2 from `2026-05-12 21:01:22Z` to `21:01:36Z`, proving wrong-actor
  `BUY_RESERVED_CARD` rejects as an ownership-envelope failure and wrong-actor
  `DISCARD_RESERVED` rejects without state hash or live replay recording mutation while preserving
  reserved-card ownership state.
- `clients/unity/artifacts/unity/editmode-market-buy-wrong-actor-rejection-20260512-results.xml`
  passed 1/1 from `2026-05-12 21:10:50Z` to `21:10:55Z`, proving wrong-actor plain market
  `BUY_CARD` rejects without state hash or live replay recording mutation while keeping the visible
  non-Joker market card out of both players' tableaus.
- `clients/unity/artifacts/unity/editmode-privilege-wrong-actor-rejection-20260512-results.xml`
  passed 2/2 from `2026-05-12 21:20:10Z` to `21:20:23Z`, proving wrong-actor
  `ACTIVATE_PRIVILEGE` and wrong-actor `USE_PRIVILEGE` reject without state hash or live replay
  recording mutation while preserving privilege charge, phase, board, and inventory state.
- `clients/unity/artifacts/unity/editmode-cancel-privilege-wrong-actor-rejection-20260512-results.xml`
  passed 1/1 from `2026-05-12 21:28:16Z` to `21:28:21Z`, proving wrong-actor
  `CANCEL_PRIVILEGE` rejects without state hash or live replay recording mutation while preserving
  phase, turn, privilege charge, board, and inventory state.
- `clients/unity/artifacts/unity/editmode-follow-up-wrong-actor-rejection-20260512-results.xml`
  passed 1/1 from `2026-05-12 21:39:45Z` to `21:39:53Z`, proving wrong-actor
  `TAKE_BONUS_GEM`, `DISCARD_GEM`, and `STEAL_GEM` reject without state hash or live replay
  recording mutation while preserving phase, turn, board, and relevant inventory state.
- `clients/unity/artifacts/unity/editmode-reserve-cancel-wrong-actor-rejection-20260512-results.xml`
  passed 1/1 from `2026-05-12 21:46:29Z` to `21:46:35Z`, proving wrong-actor
  `CANCEL_RESERVE` rejects after a valid pending reserve without state hash or additional live
  replay recording mutation while preserving phase, turn, pending reserve, market card, and
  reserved-card state.
- `clients/unity/artifacts/unity/editmode-joker-color-wrong-actor-rejection-20260512-results.xml`
  passed 1/1 from `2026-05-12 21:54:12Z` to `21:54:20Z`, proving wrong-actor color-follow-up
  `BUY_CARD` rejects from `SELECT_CARD_COLOR` without state hash or additional live replay
  recording mutation while preserving phase, turn, pending buy, market card, and player tableau
  state.
- `clients/unity/artifacts/unity/editmode-discard-phase-resolution-20260512-results.xml`
  passed 1/1 from `2026-05-12 22:03:41Z` to `22:03:48Z`, proving repeated live
  `DISCARD_GEM` commands from a controlled over-limit state record Replay vNext events, keep
  `DISCARD_EXCESS_GEMS` while still over the legal inventory limit, then resolve to `IDLE` and
  hand the turn to `p2` once the inventory reaches 10 gems.
- `clients/unity/artifacts/unity/editmode-bonus-steal-phase-resolution-20260512-results.xml`
  passed 1/1 from `2026-05-12 22:13:19Z` to `22:13:28Z`, proving valid live
  `TAKE_BONUS_GEM` and `STEAL_GEM` commands from controlled follow-up states record Replay vNext
  events, mutate the expected board/inventory state, resolve to `IDLE`, and hand turn to `p2`.
- `clients/unity/artifacts/unity/editmode-royal-phase-resolution-20260512-results.xml` passed 1/1
  from `2026-05-12 22:19:13Z` to `22:19:17Z`, proving valid live `SELECT_ROYAL_CARD` from a
  controlled royal-selection state records Replay vNext `select_royal`, moves `r91-ro` to P1,
  resolves to `IDLE`, and hands turn to `p2`.
- `clients/unity/artifacts/unity/editmode-full-20260512-post-royal-results.xml` reported 90/91
  from `2026-05-12 22:34:57Z` to `23:00:14Z`. The single failing test was
  `RoguelikeDraftProductSurfaceSmokeRerollsSelectsAndReviewsLiveReplay`: the LocalDev smoke driver
  selected a valid `passive.noTake3` buff and then attempted a three-gem `take_gems`, which the
  TypeScript oracle correctly rejected with `The active buff blocks taking three gems.`.
- `clients/unity/artifacts/unity/editmode-draft-smoke-notake3-rerun-20260512-results.xml` passed
  1/1 from `2026-05-12 23:02:00Z` to `23:02:15Z` after
  `LocalDevProductSurfaceSmoke.TryTakeUsefulGemLine` skipped three-gem candidate lines when the
  active buff has `passive.noTake3`.
- `clients/unity/artifacts/unity/editmode-full-20260512-post-notake3-fix-results.xml` passed 91/91
  from `2026-05-12 23:02:38Z` to `23:28:37Z`; paired log
  `artifacts/unity/editmode-full-20260512-post-notake3-fix.log` exited code 0.
- `artifacts/unity/build-post-notake3-20260512.log` rebuilt the Windows player from the post-fix
  tree with exit code 0.
- `artifacts/unity/built-player-smoke/smoke-2026-05-12Tpost-notake3-draft.launcher.json` passed
  from the rebuilt Windows player with seed `unity-product-surface-draft-release-path-20260512`,
  `startMode=roguelike`, and `draftActionPreference=reroll-each-player-first`. It records
  `reroll_draft_pool`, `choose_boon`, and two legal post-draft `take_gems` actions, exports and
  reviews six live Replay vNext events, and preserves final hash `857c3e58`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-post-notake3-draft.json`
  validates 1/1 launcher report, six commands, seven mailbox events, and status
  `incomplete-evidence`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-post-notake3-combined.json`
  revalidates the prior 26-report curated set plus the post-fix draft launcher with every required
  action family and every current release-path requirement flag enabled. It validates 27/27 reports,
  716 commands, 812 mailbox events, all 21 required action families, final hash `857c3e58`, and
  status `incomplete-evidence`.
- Documentation consistency closeout at that step: the completion audit prompt checklist and
  migration risk table were aligned to the post-no-take-3 combined aggregate. The later
  2026-05-13 strict aggregate superseded it, and the later strict winner-release aggregate now
  supersedes both as the strongest retained built-player evidence.
  The older 25-report all-release-path audit and 26-report resource-first aggregate remain retained
  subset evidence only. This cleanup does not change status: the built-player aggregate is still
  `incomplete-evidence`, not a release-runtime packaging decision or broad product-surface
  completion.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
  passed after the royal phase-resolution proof with 11 fixtures, 65 rejection cases, and no
  coverage gaps.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed after the royal
  phase-resolution proof with 32 tests.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts --check`
  passed after the royal phase-resolution proof.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` passed after the royal
  phase-resolution proof; `pnpm test` reported 177 files and 1112 tests passed.
- `pnpm release:check`, `pnpm boundaries:check`, `pnpm architecture:check`, `pnpm deps:check`,
  `pnpm desktop:check`, and `pnpm secrets:check` passed after the royal phase-resolution proof.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts --check`
  passed after the cancel-reserve no-pending follow-up.
- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:coverage`, `pnpm build`,
  `pnpm release:check`, `pnpm boundaries:check`, `pnpm architecture:check`, `pnpm deps:check`,
  `pnpm desktop:check`, `pnpm secrets:check`, `pnpm bundle:check`, and
  `pnpm release:artifacts:check` passed in this run; after the P2 draft select ordering follow-up,
  `pnpm test` and `pnpm test:coverage` each covered 177 files and 1112 tests, and the key-module
  coverage report passed with 0 violations. After the no-take-3 follow-up, `pnpm typecheck`,
  `pnpm lint`, `pnpm test`, and `pnpm build` passed again; `pnpm test` covered 177 files and 1112
  tests. After the coordinate-boundary follow-up, `pnpm typecheck`, `pnpm lint`, `pnpm test`, and
  `pnpm build` passed again; `pnpm test` covered 177 files and 1112 tests. After the game-over
  rejection follow-up, `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` passed again;
  `pnpm test` covered 177 files and 1112 tests. After the Joker missing-color bridge hardening
  follow-up, `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` passed again; `pnpm test`
  covered 177 files and 1112 tests.
- Focused Unity EditMode bridge-failure tests passed after the audit refresh:
  `TypeScriptRulesEngineMapsBridgeExceptionsToStructuredResults` and
  `TypeScriptBridgeMailboxFailuresAreStructuredAndCleanTempFiles`.
- `git check-ignore -v` confirmed the 2026-05-12 launcher report, player log, and aggregate matrix
  remain ignored under `/artifacts/`.
- `git diff --check` passed; Git reported only existing CRLF normalization warnings on four
  migration docs.
- 2026-05-13 configured parity refresh: `pnpm parity:electron-unity` hit the 600-second shell
  wrapper timeout, but the child runner completed after the wrapper returned. Direct inspection of
  `artifacts/electron-unity-parity/2026-05-13T00-04-32-249Z/runner-summary.json` and
  `artifacts/electron-unity-parity/2026-05-13T00-04-32-249Z/parity-matrix.json` found 54/54
  configured rows with status `Equivalent` across the required viewports. This is configured-runner
  evidence only, not a completion claim.
- The same 2026-05-13 validation refresh passed `pnpm typecheck`, `pnpm lint`, `pnpm test`,
  `pnpm test:coverage`, `pnpm build`, `pnpm release:check`, `pnpm boundaries:check`,
  `pnpm architecture:check`, `pnpm deps:check`, `pnpm desktop:check`, and `pnpm secrets:check`.
  Test and coverage each reported 177 files and 1112 tests, and the key-module coverage report
  passed with 0 violations.
- 2026-05-13 risk-table consistency refresh: `docs/migration/unity-migration-risk-table.md` now
  cites `artifacts/electron-unity-parity/2026-05-13T00-04-32-249Z/` as inspected configured-parity
  artifact evidence, keeps `artifacts/electron-unity-parity/2026-05-12T08-18-40-709Z/` as retained
  direct command-pass evidence, and separates the latest gate refresh from earlier retained
  `pnpm bundle:check` / `pnpm release:artifacts:check` evidence.
- 2026-05-13 built-player game-over aggregate guard:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now accepts
  `--require-game-over-count <count>` and exposes `gameOverReportCount`, `winners`, and
  `gameOverFinalStateHashes` in the aggregate summary. `node --check` passed. The positive retained
  27-report aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-game-over-guard.json`
  passed with `--require-game-over-count 3`, 3 game-over reports, winners `p1` and `p2`, and hashes
  `d6dbea7a`, `411262df`, and `5f3bf567`. The negative aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-game-over-negative.json`
  failed as expected with `Required built-player game-over report count was not met: expected at
least 4, found 3.`.
- 2026-05-13 strict built-player aggregate:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-game-over-release-path.json`
  passed with all 21 required action families, every current release-path proof flag,
  `--require-game-over-count 3`, 27/27 reports, 716 commands, 812 mailbox events, 3 game-over
  reports, winners `p1` and `p2`, no missing required families, and one report for each required
  release-path proof family. `git check-ignore -v` confirmed the artifact is ignored under
  `.gitignore:31:/artifacts/`.
- 2026-05-13 strict built-player winner-release aggregate:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-game-over-winner-release-path.json`
  revalidates the same 27 retained launcher reports with all 21 required action families, every
  current release-path proof flag, `--require-game-over-count 3`, and
  `--require-game-over-winner p1,p2`. It passed with 27/27 reports, 716 commands, 812 mailbox
  events, 3 game-over reports, winners `p1` and `p2`, no missing required families, no missing
  required winners, one report for each required release-path proof family, and status
  `incomplete-evidence`.
- 2026-05-13 scope/parity ledger consistency refresh: `docs/migration/unity-product-scope-map.md`
  and `docs/migration/unity-full-parity-matrix.md` now cite the strict 2026-05-13 winner-release
  aggregate as the strongest retained built-player evidence while preserving `incomplete-evidence`
  and the remaining blockers.
- 2026-05-13 mailbox response audit hardening: `tools/migration/run-unity-built-player-smoke.mjs`
  now writes bridge responses to a private `responses/audit/` copy before delivering the same JSON
  to the Unity mailbox response path. The minimal validation smoke
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Tmailbox-audit.launcher.json` passed with
  exit code 0, no timeout, 2 audited `responseOk=true` mailbox responses for `INIT` and
  `TAKE_GEMS`, one live recorded `take_gems` command, no fixture gameplay driver, no checkpoint
  state replacement, and final hash `ec648e6c`; the aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-audit.json`
  passed and remains `incomplete-evidence`.
- 2026-05-13 audited mailbox aggregate guard:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now accepts
  `--require-audited-mailbox-responses`. The positive aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-audit-guard.json`
  passed with 2 audited successful mailbox responses. The negative aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-audit-negative.json`
  failed as expected against the older post-no-take-3 draft launcher with
  `Bridge mailbox did not record successful request handling.`
- 2026-05-13 audited mailbox rejection guard:
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Tmailbox-rejection-audit.launcher.json`
  starts the built Windows player fresh with the invalid-action release path enabled and records 9
  audited mailbox responses: 3 successful bridge calls and 6 expected rejections. The rejected
  bridge responses retain `auditResponse` paths plus 5 `COMMAND_REJECTED` codes and 1
  `INVALID_ACTOR` code. The aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-rejection-audit.json`
  passed with `--require-audited-mailbox-responses` and `--require-invalid-action-release-path`,
  final invalid-action hash `f2780c3f`, zero invalid-action replay events, and status
  `incomplete-evidence`.
- 2026-05-13 audited product-surface breadth smoke:
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-breadth.launcher.json` starts the
  built Windows player fresh with seed `unity-built-player-audited-breadth-20260513`, records 24
  live product-surface commands, retains 25 audited successful mailbox responses, covers
  `take_gems`, `buy_card`, `take_bonus_gem`, `discard_gem`, and `replenish`, exports/imports/reviews
  24 live replay events, avoids fixture gameplay and checkpoint replacement, and preserves final
  hash `f934c91b`. The aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-breadth.json`
  passed with `--require-audited-mailbox-responses` and those five required families while keeping
  status `incomplete-evidence`.
- 2026-05-13 audited preference breadth smokes:
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-reserve-first.launcher.json` starts
  fresh with `reserve-first`, records 12 live reserve/cancel commands, retains 13 audited successful
  mailbox responses, and preserves final/reviewed hash `38d97b7f`.
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-privilege-first.launcher.json` starts
  fresh with `privilege-first`, records 24 live commands including `activate_privilege` and
  `use_privilege`, retains 25 audited successful mailbox responses, and preserves final/reviewed
  hash `62b67ebe`. The aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-preferences.json`
  passed with `--require-audited-mailbox-responses`, 2/2 reports, 36 commands, 38 audited
  successful mailbox responses, and required families `reserve_card`, `cancel_gem_selection`,
  `activate_privilege`, `use_privilege`, `take_gems`, and `discard_gem`, while keeping status
  `incomplete-evidence`.
- 2026-05-13 risk-table audited breadth/preference refresh:
  `docs/migration/unity-migration-risk-table.md` now
  cites the audited breadth aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-breadth.json`
  and audited preference aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-preferences.json`
  in the live-product, mailbox-automation, and parity-scope risk rows while preserving the same
  `Open`/`Mitigating` statuses and remaining blocker language.
- 2026-05-13 completion-audit audited-evidence ledger refresh:
  `docs/archive/unity-replacement-candidate-completion-audit-2026-05-12.md` now cites the audited
  mailbox success, rejection, balanced breadth, reserve-first, and privilege-first launcher reports
  alongside the strict aggregate lineage. The audit still reports `Incomplete`, because the new
  evidence is bounded LocalDev mailbox evidence and does not close arbitrary product-surface Local
  PvP, LAN/online/Visual Lab, or final release-runtime packaging.
- 2026-05-13 combined audited mailbox aggregate:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined.json`
  validates the five audited launcher reports together with `--require-audited-mailbox-responses`,
  `--require-invalid-action-release-path`, and the observed audited action-family set. It passes
  with 5/5 reports, 62 commands, 74 mailbox events, 74 audited responses, 68 successful responses,
  one invalid-action release-path report, final hashes `38d97b7f`, `3b479090`, `62b67ebe`,
  `ec648e6c`, and `f934c91b`, invalid-action hash `f2780c3f`, and status
  `incomplete-evidence`.
- 2026-05-13 audited built-player game-over proof:
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-game-over-1.launcher.json` reruns
  seed `unity-built-player-game-over-20260512` through the current audited mailbox launcher from a
  fresh built Windows player process. It passed with exit code 0, no timeout, 98 live
  product-surface commands, 99 mailbox events, 99 audited successful mailbox responses, winner
  `p1`, final state hash `d6dbea7a`, and reviewed replay hash `d6dbea7a`. The aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over.json`
  passed with `--require-audited-mailbox-responses`, `--require-game-over-count 1`, eight observed
  action families, one game-over report, and status `incomplete-evidence`.
- 2026-05-13 audited built-player `p2` game-over proof:
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-game-over-p2-1.launcher.json` and
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-game-over-p2-2.launcher.json`
  rerun seeds `unity-built-player-game-over-alt-1-20260512` and
  `unity-built-player-game-over-alt-2-20260512` through fresh built Windows player processes. They
  passed with exit code 0, no timeout, 98 and 92 live product-surface commands, 99 and 93 audited
  successful mailbox responses, winners `p2` and `p2`, final/review hashes `411262df` and
  `5f3bf567`, and the same eight game-over action families as the audited `p1` proof. The
  winner-breadth aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over-winner-breadth.json`
  passed with audited mailbox responses required and `--require-game-over-count 3`: 3/3 reports,
  288 commands, 291 audited responses, winners `p1` and `p2`, hashes `d6dbea7a`, `411262df`, and
  `5f3bf567`, and status `incomplete-evidence`.
- 2026-05-13 audited combined game-over winner-breadth aggregate:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-breadth.json`
  combines the audited mailbox success, rejection, balanced breadth, reserve-first,
  privilege-first, audited `p1` game-over, and two audited `p2` game-over launcher reports. It
  passed with audited mailbox responses, invalid-action release-path, and game-over count all
  required: 8/8 reports, 350 commands, 365 mailbox events, 365 audited mailbox responses, 359
  successful responses, one invalid-action release-path report, three game-over reports, winners
  `p1` and `p2`, game-over hashes `d6dbea7a`, `411262df`, and `5f3bf567`, invalid-action hash
  `f2780c3f`, and status `incomplete-evidence`.
- 2026-05-13 built-player game-over winner guard:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now supports
  `--require-game-over-winner <winner[,winner...]>`. The enforced winner-breadth aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over-winner-guard.json`
  passed with audited mailbox responses, `--require-game-over-count 3`, and
  `--require-game-over-winner p1,p2`: 3/3 reports, 288 commands, 291 audited successful responses,
  winners `p1` and `p2`, and hashes `d6dbea7a`, `411262df`, and `5f3bf567`. The stricter combined
  winner guard
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-guard.json`
  passed with 8/8 audited reports, 350 commands, 365 audited responses, one invalid-action
  release-path report, required winners `p1,p2`, and status `incomplete-evidence`. The p2-only
  negative check failed closed with `Required built-player game-over winner was not covered: p1`.
- `Get-Process Unity,GemDuelUnity -ErrorAction SilentlyContinue` returned no running Unity player
  or editor process.

## Remaining Blockers

- Built-player evidence now includes three deterministic game-over paths, one recovery
  save/load/continue path, one settings save/load path, one rulebook/restart chrome path, one
  replay-review visible undo/redo path, one roguelike draft reroll/select path, one
  invalid-action no-mutation/no-recording release-path proof, one peek-modal open/close
  release-path proof, one recovered invalid-action no-mutation/no-recording proof, and one
  privilege-cancel release-path proof, one reserved-discard release-path proof, one reserved-buy
  release-path proof, one reserve-cancel release-path proof, one reserve-deck release-path proof,
  one Joker release-path proof, one deck-reserve cancel release-path proof, and one no-pending
  cancel-reserve live-bridge rejection proof, one P2 draft-select ordering rejection proof, one
  no-take-3 board-selection rejection proof, one coordinate-boundary rejection proof, and one
  game-over action-after-winner rejection proof, one Joker missing-color rejection proof, one
  Joker reserved-source rejection proof, one Joker wrong-actor bridge-envelope rejection proof, one
  market-buy wrong-actor bridge-envelope rejection proof, one reserve wrong-actor bridge-envelope
  rejection proof, one deck-reserve wrong-actor
  bridge-envelope rejection proof, and one reserved-card wrong-actor bridge-envelope rejection
  proof, one privilege wrong-actor bridge-envelope rejection proof, and one cancel-privilege
  wrong-actor bridge-envelope rejection proof, and one follow-up wrong-actor bridge-envelope
  rejection proof, one reserve-cancel wrong-actor bridge-envelope rejection proof, one Joker
  color wrong-actor bridge-envelope rejection proof, one discard phase-resolution bridge proof, one
  bonus/steal phase-resolution bridge proof, one royal phase-resolution bridge proof, and one
  audited mailbox rejection-guard proof, one audited product-surface breadth proof, and two audited
  preference breadth proofs, plus an enforced audited game-over winner guard, but it is still
  LocalDev mailbox smoke and focused manifest evidence, not broad arbitrary product-surface play.
- LAN route, online route, and Visual Lab remain unmigrated or not user-approved excluded.
- Final release-runtime packaging for the TypeScript rules boundary is unresolved.
- Broader release-path replay/recovery and full product-scope parity remain incomplete despite the
  new covered recovery, replay-review, draft, invalid-action, peek-modal, recovered
  invalid-action, privilege-cancel, reserved-discard, reserved-buy, reserve-cancel, reserve-deck,
  Joker, deck-reserve cancel, no-pending cancel-reserve, P2 draft-select ordering, no-take-3,
  coordinate-boundary, game-over action-after-winner, Joker missing-color, Joker
  reserved-source, Joker wrong-actor, reserve wrong-actor, deck-reserve wrong-actor,
  reserved-card wrong-actor, market-buy wrong-actor, privilege wrong-actor, and
  cancel-privilege wrong-actor, follow-up wrong-actor, reserve-cancel wrong-actor, Joker
  color wrong-actor, discard phase-resolution, bonus/steal phase-resolution, and royal
  phase-resolution
  release/rejection
  paths.

The correct status remains `Incomplete`.
