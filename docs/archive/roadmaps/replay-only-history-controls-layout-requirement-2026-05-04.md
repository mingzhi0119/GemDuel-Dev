# Replay-Only History Controls Layout Requirement (2026-05-04)

## Status

Implemented on 2026-05-04. The runtime now hides the replay/history controls during live gameplay and shows them only while review mode is active.

## Request

Hide the forward/backward replay buttons and the central `Action X / Y` counter during normal gameplay. Show that controls panel only in replay/review mode. When the panel is hidden, the Royal Area should move downward accordingly instead of leaving an empty reserved gap.

## Current Code Evidence

- `apps/desktop/src/app/shell/GamePlaySurface.tsx` renders `ReplayControls` directly under `RoyalCourt` in the right-side royal frame.
- `packages/ui/src/components/ReplayControls.tsx` contains the backward button, forward button, and `replay.action` counter label.
- `apps/desktop/src/app/shell/GameShell.tsx` already computes `effectiveGameMode` from `ui.isReviewing`, so the shell has a stable replay/review-mode signal.
- `apps/desktop/src/App.tsx` auto-enters review mode after replay import and also supports post-game review through the existing overlay flow.

## Feasibility

Feasibility: high.

The controls are already isolated as `ReplayControls`, and the surrounding layout is in one shell component. The implementation does not need gameplay-rule changes, replay-schema changes, networking changes, or shared-domain changes.

The recommended mode gate is `ui.isReviewing === true`, passed from `GameShell` into `GamePlaySurface`. Treat this as the player-facing replay/review mode. It covers imported replay review and post-game result review. Do not use only `historySource === 'replay-import'`, because that would hide controls during live-match post-game review.

## Code Size Estimate

Expected production code: small, about 15-35 lines.

Expected test updates: moderate, about 40-90 lines.

Likely touched files:

- `apps/desktop/src/app/shell/GameShell.tsx`: pass a `showReplayControls` or `isReplayReviewMode` prop to `GamePlaySurface`.
- `apps/desktop/src/app/shell/GamePlaySurface.tsx`: conditionally render the `ReplayControls` wrapper only when replay/review mode is active.
- `apps/desktop/src/__tests__/shellSmoke.test.tsx` or `apps/desktop/src/__tests__/surfaceStyling.test.tsx`: assert controls are absent during live gameplay and present during review mode.
- `apps/desktop/src/__tests__/replayRoundtrip.test.tsx`: only if existing replay tests depend on always-visible controls; update expectations to enter/import replay mode before using them.

## Implementation Record

- `GameShell` passes `ui.isReviewing` into `GamePlaySurface` as the replay-controls visibility gate.
- `GamePlaySurface` removes the `ReplayControls` wrapper from the DOM when the gate is false, so the Royal Area re-centers through the existing right-column flex layout.
- `shellSmoke.test.tsx` covers live-hidden and review-visible rendering.
- Existing replay roundtrip coverage confirms imported replay review still exposes usable forward/backward controls.

## Player Impact

Positive impact:

- Normal gameplay becomes cleaner and less like a debugging/replay surface.
- Players are less likely to confuse live gameplay with time-travel controls.
- Online games already block undo/redo actions; hiding the disabled panel removes visual noise.
- The Royal Area gets more natural vertical placement after the replay panel is removed from the normal layout.

Tradeoffs:

- Players lose visible live undo/redo affordances during normal local games.
- If live undo was being used as an informal mistake-correction feature, this change removes discoverability for that behavior.
- Any future "take back move" feature should be designed as a separate explicit gameplay action, not reused from replay controls.

Suitability: recommended if the target is a cleaner product/gameplay presentation. Not recommended only if local live undo/redo is intentionally a player-facing feature.

## Functional Requirements

1. In normal live gameplay, the right-side replay controls panel must not render.
2. In replay/review mode, the replay controls panel must render with the existing backward button, forward button, long-press fast-forward behavior, and `Action X / Y` counter.
3. Replay/review mode means `ui.isReviewing === true`.
4. Imported replay review must still show the controls immediately after successful replay import.
5. Post-game review started from the winner/results overlay must still show the controls.
6. Hiding the controls must remove the panel from layout flow, not merely make it transparent.
7. When the controls are absent, the Royal Area should move downward through the existing right-column centering behavior, with no empty gap left below it.
8. The center-board `GameActions` control area is out of scope. Confirm, refill, and cancel buttons should keep their current live-game behavior.

## Layout Requirements

- The right-side royal frame should continue using the existing market / board / royal three-column grammar.
- The `RoyalCourt` component should not receive artificial top padding solely to compensate for hidden replay controls.
- Prefer conditional rendering of the `ReplayControls` wrapper in `GamePlaySurface` so the existing `flex-col` centering naturally repositions the Royal Area downward.
- The hidden state must be stable across light/dark themes and surface themes.
- The hidden state must not affect royal-card click/preview/selection behavior.

## Acceptance Criteria

- Live local game: no `[data-replay-control="undo"]`, no `[data-replay-control="redo"]`, and no `[data-replay-step-counter]` in the DOM.
- Live online game: same hidden behavior as local live gameplay.
- Imported replay: replay controls are present and usable.
- Post-game review: replay controls are present and usable.
- Royal Area has no reserved empty block where replay controls used to be.
- Royal selection phase still allows choosing a royal card when the game requires it.
- Existing replay roundtrip tests still pass.

## Suggested Verification

- Focused shell test for live vs review rendering.
- Existing replay roundtrip test to cover imported replay controls.
- `pnpm test` after implementation.
- Browser visual check at `http://127.0.0.1:5173/` for live gameplay and replay review, because the main risk is layout feel rather than domain logic.

## Rollback

Rollback is low risk. Revert the conditional rendering prop and always render the existing `ReplayControls` wrapper again. No replay data migration or saved-game compatibility change is involved.
