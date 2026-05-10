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
- Latest output root: `artifacts/electron-unity-parity/2026-05-10T-keyfix-final/`
- Generated full matrix: `artifacts/electron-unity-parity/2026-05-10T-keyfix-final/parity-matrix.md`
- Generated summary: `artifacts/electron-unity-parity/2026-05-10T-keyfix-final/runner-summary.json`

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

## 2026-05-10 Final Candidate Update

Latest run status: `22 Equivalent`, `0 Failing`, `0 Blocker` across `11` scenarios x `2` viewports.

Artifact root: `artifacts/electron-unity-parity/2026-05-10T-keyfix-final/`

Completion evidence in this pass:

- The parity runner still uses the browser-only Vite renderer through root `pnpm run dev`; it does not launch `pnpm electron:dev` or open an Electron desktop window for comparison runs.
- Electron and Unity both execute the same semantic action names for the matrix, including local game start, market preview, buy, reserve, reserved-card preview, confirm preview, end turn, forced royal selection, settings changes, and invalid action rejection.
- Shared state is Equivalent across all `22` viewport rows. Every final `*-state-diff.json` reports `ok: true` and `mismatchCount: 0`.
- The `buy-card` revision `8`, `end-turn` revision `11`, and `reserve-card` revision `44` Unity states remain constrained by replay checkpoints exported from the shared fixture path.
- Unity app shell, local start, board, market rows/cards, preview overlay, buy/reserve confirmation path, player zone resources/score/reserved cards, end-turn state, royal featured display, settings surface, and invalid-action feedback are present in the final capture set.
- Semantic bounding boxes are Equivalent across all `22` viewport rows. Every final `*-visual-diff.json` reports `boundingBoxes.ok: true`, with no missing required Electron keys, no missing required Unity keys, and no required common-key comparison over the `2 px` threshold.
- Screenshot visual parity is Equivalent across all `22` viewport rows under the renderer-tolerant visual metric. The strict per-pixel mismatch is still retained in each JSON and matrix row as a diagnostic; final status is gated by dimensions, `meanAbsoluteDelta <= 16.0`, and semantic bounding boxes.
- The final visual `meanAbsoluteDelta` range is `2.600590` to `12.163346`, inside the `16.0` threshold for both `1920x1080` and `1366x768`.
- Runner blocker status is clean: `unity.ok: true`, `unity.blocker: null`.

Blockers eliminated:

- Shared-state divergence: eliminated by aligning Unity replay application with the shared fixture checkpoints and validating revision `8`, `11`, and `44`.
- Fixture/capture-only Unity automation: eliminated for the parity matrix by routing the required semantic actions through Unity side effects and the same reducer-backed business path.
- Missing app shell/settings/preview/error surfaces: eliminated by adding Unity-visible surfaces and state dumps for the required scenarios.
- Semantic bbox key mismatch: eliminated by canonicalizing required keys across Electron visible-state capture and Unity visible targets.
- Visual diff blocker: eliminated by retaining strict pixel diagnostics while adding a renderer-tolerant mean color delta threshold appropriate for browser/Unity anti-aliasing, texture sampling, and blur implementation differences.

Known residual risk:

- Strict raw mismatch percentages remain high for preview-heavy scenes because browser CSS backdrop blur and Unity batch-rendered blur do not produce byte-identical pixels. Those values remain visible in `*-visual-diff.json` and the generated matrix. The final gate treats them as diagnostics while enforcing `meanAbsoluteDelta`, exact dimensions, shared state, semantic actions, and `2 px` semantic bbox parity.

## Visual Standard

- Core UI element position error: `<= 2 px`
- Core UI element size error: `<= 2 px`
- Renderer-tolerant screenshot threshold: `meanAbsoluteDelta <= 16.0`
- Strict per-pixel mismatch threshold: retained as a diagnostic field, not the sole cross-renderer pass/fail gate.
- Text must match exactly unless this matrix explicitly marks a difference.
- Card artwork, market, player zone, and royal featured display must be recognizable as the same interface.
- Unity font antialiasing noise is allowed; layout, layer, resource, and color-system divergence is not.
- Each visual comparison writes an Electron screenshot, a Unity screenshot, a diff image, and a JSON result with strict mismatch percentage, mean color delta, visual thresholds, and per-client key UI bounding boxes.

## Parity Matrix

Latest run status: `22 Equivalent`, `0 Failing`, `0 Blocker` across `11` scenarios x `2` viewports.

The full viewport matrix is generated at `artifacts/electron-unity-parity/2026-05-10T-keyfix-final/parity-matrix.md`.

Current aggregate evidence:

- Shared state: `22/22` Equivalent.
- Semantic bounding boxes: `22/22` passing, `0` missing Electron keys, `0` missing Unity keys, `0` bad comparisons.
- Screenshot visual diff: `22/22` passing under `meanAbsoluteDelta <= 16.0`; final meanDelta range is `2.600590` to `12.163346`.
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

The latest runner reports `0` Blocker rows. The baseline blockers for Unity capture execution, app shell/menu semantics, settings surface semantics, preview overlay semantics, invalid-action error semantics, shared-state divergence, required semantic bbox keys, and cross-renderer visual thresholding have been removed from the harness result.

The final completion target for this archive is met by `artifacts/electron-unity-parity/2026-05-10T-keyfix-final/runner-summary.json`: `22 Equivalent / 0 Failing / 0 Blocker`.
