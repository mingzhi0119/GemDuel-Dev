# Electron vs Unity Sync Parity Baseline

Date: 2026-05-09

## Goal

Establish a repeatable comparison harness that drives the Electron renderer and the Unity sidecar from the same replay fixture, captures screenshots and visible/game state after each semantic step, and records whether Unity is equivalent, failing, deferred, or blocked for each replacement-critical player flow.

## Harness

- Root command: `pnpm parity:electron-unity`
- Electron entry: `http://127.0.0.1:5173/?parityHarness=1`
- Electron driver: `agent-browser` against the Vite renderer after root `pnpm run dev`
- Unity entry: `GemDuel.Editor.CaptureUnityParityScenarios.CaptureAll`
- Unity fixture: `fixtures/replay-golden/local-pvp-royal-extra-turn-game-over.replay.json`
- Viewports: `1920x1080`, `1366x768`
- Baseline output root: `artifacts/electron-unity-parity/2026-05-09-baseline/`
- Latest output root: `artifacts/electron-unity-parity/2026-05-09T18-current-final-incomplete/`
- Generated full matrix: `artifacts/electron-unity-parity/2026-05-09T18-current-final-incomplete/parity-matrix.md`
- Generated summary: `artifacts/electron-unity-parity/2026-05-09T18-current-final-incomplete/runner-summary.json`

The Electron hook is development-only and query-gated by `parityHarness=1`. It exposes semantic actions through `window.__GEMDUEL_PARITY__`, including:

- `start_local_game`
- `choose_mode`
- `click_market_card(level, index)`
- `buy_card(level, index)`
- `reserve_card(level, index)`
- `click_player_reserved(index)`
- `confirm_preview_action`
- `end_turn`
- `force_royal_selection`
- `choose_royal(index)`
- `open_settings`
- `change_setting(name, value)`
- `invalid_action`
- `load_replay_fixture(revision)`

Unity currently uses the committed replay fixture plus the Unity editor parity capture entry as its deterministic entry. The capture path now accepts the same semantic action names as the Electron parity hook for the scenario set under test. This keeps `packages/shared` as the gameplay oracle while Unity remains a sidecar client under test.

## 2026-05-09 Migration Pass Update

Latest run status: `0 Equivalent`, `22 Failing`, `0 Blocker` across `11` scenarios x `2` viewports.

Artifact root: `artifacts/electron-unity-parity/2026-05-09T18-current-final-incomplete/`

Progress achieved in this pass:

- Electron and Unity now both execute semantic parity actions for the current scenario set instead of relying only on direct revision capture.
- The parity runner now starts the browser-only Vite renderer with root `pnpm run dev`; it no longer launches `pnpm electron:dev` or opens an Electron desktop window for comparison runs.
- The previous hard blockers for Unity app shell, semantic action execution, settings surface, preview overlay plumbing, and semantic bbox export have been converted into concrete failing parity evidence instead of harness blockers.
- Shared-state parity is now clean across all `22` viewport rows. Every `*-state-diff.json` in the latest artifact reports `ok: true` and `mismatchCount: 0`.
- The `buy-card` revision `8`, `end-turn` revision `11`, and `reserve-card` revision `44` Unity states are now constrained by TypeScript-authored replay checkpoints exported from `packages/shared` fixtures.
- Unity EditMode tests passed with `9/9` tests, including parity-critical checkpoint assertions and semantic local PvP interaction coverage.
- Semantic bounding boxes are now clean across all `22` viewport rows. Every latest `*-visual-diff.json` reports `boundingBoxes.ok: true`, with `0` missing Electron keys, `0` missing Unity keys, and `0` bad comparisons over required common keys.
- Unity now loads the Electron public card, gem, and royal-luxury surface PNG assets through `Resources/GemDuelPublicAssets` with uncompressed, no-mipmap import settings for parity captures.
- Unity draft/start, board, player-zone, and preview surfaces have moved from fixture-only placeholder presentation toward Electron-aligned visible UI, but they are still not visually equivalent.

Remaining replacement gaps:

- Unity migration is not complete.
- All `22` rows still fail screenshot visual parity. Pixel mismatch remains far outside the `0.75%` threshold, ranging from `8.62%` to `89.04%` in the latest run.
- Unity now exposes the required semantic surfaces for this matrix, but those surfaces are still visually primitive compared with Electron. Board, market, player-zone, royal featured, preview, settings, draft/setup, menu, and error surfaces need real visual parity work until screenshot diffs pass.
- The final completion target remains `22 Equivalent / 0 Failing / 0 Blocker`; this run is not an Electron replacement candidate.

## Visual Standard

- Core UI element position error: `<= 2 px`
- Core UI element size error: `<= 2 px`
- Text must match exactly unless this matrix explicitly marks a difference.
- Card artwork, market, player zone, and royal featured display must be recognizable as the same interface.
- Unity font antialiasing noise is allowed; layout, layer, resource, and color-system divergence is not.
- Each visual comparison writes an Electron screenshot, a Unity screenshot, a diff image, and a JSON result with mismatch percentage plus per-client key UI bounding boxes.

## Parity Matrix

Latest run status: `0 Equivalent`, `22 Failing`, `0 Blocker` across `11` scenarios x `2` viewports.

The full viewport matrix is generated at `artifacts/electron-unity-parity/2026-05-09T18-current-final-incomplete/parity-matrix.md`.

Current aggregate evidence:

- Shared state: `22/22` Equivalent.
- Semantic bounding boxes: `22/22` passing, `0` missing Electron keys, `0` missing Unity keys, `0` bad comparisons.
- Screenshot visual diff: `0/22` passing; mismatch range is `8.62%` to `89.04%`.
- Runner blocker status: `unity.ok: true`, `unity.blocker: null`.

## Failure Classification

When a row fails, classify it as one or more of:

- `state mismatch`: replay/shared state fields differ.
- `interaction mismatch`: one side cannot perform the semantic action.
- `layout mismatch`: bounding boxes exceed the 2 px threshold.
- `asset mismatch`: card art, icons, market resources, or player-zone resources differ.
- `timing mismatch`: screenshot was captured before a stable frame.
- `test harness mismatch`: driver, viewport, fixture, or capture plumbing caused the failure.

## Current Blockers

The latest runner reports `0` Blocker rows. The baseline blockers for Unity capture execution, app shell/menu semantics, settings surface semantics, preview overlay semantics, invalid-action error semantics, shared-state divergence, and required semantic bbox keys have been removed from the harness result.

The migration is still not complete because screenshot visual parity fails all rows. The remaining work is to replace the Unity primitive parity presentation with Electron-equivalent rendering for every required surface without regressing shared state, semantic actions, or bbox keys.
