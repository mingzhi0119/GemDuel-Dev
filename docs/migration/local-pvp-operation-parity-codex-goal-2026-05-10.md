# Superseded: Local PVP Operation Parity Closure

Last updated: 2026-05-11

This document is historical evidence only. It must not be used as the active migration goal,
completion criteria, or a narrower replacement for `docs/migration/unity-migration-governance.md`.
The current target is full Unity migration across the supported Electron product scope.

## Historical Document

# Codex Goal: Local PVP Operation Parity Closure

Objective: make Local PVP behavior operation-equivalent between Electron and Unity. For the same
viewport, both clients must expose the same `semanticKey`, a comparable clickable rectangle,
the same hover/click result, and the same state transition. Electron is the source of truth.

## Scope

- Local PVP only.
- Top-right shell controls visible during Local PVP: rulebook, restart, settings.
- Settings menu behavior: open, close, language, sound, save replay, load replay, surface theme.
- Gameplay board operations: take gems, confirm/cancel selection, replenish, bonus gem,
  steal gem, discard gem, privilege activation/cancel.
- Market operations: card preview, deck preview, buy, reserve, deck reserve gold follow-up,
  reserved-card preview, buy reserved, discard reserved.
- Royal and draft operations: boon hover/click, reroll if visible, royal selection follow-up.
- Hover stability across board cells, market items, player-zone items, preview actions, and shell
  controls.

## Non-goals

- Online multiplayer.
- PVE-only behavior.
- Broad visual restyling unrelated to parity.
- Replacing Electron logic with Unity-specific behavior.

## Required Implementation Shape

- Add semantic keys to Electron surfaces when a Local PVP operation lacks a stable key.
- Add matching Unity `GemDuelViewTarget` keys and hit-tested actions.
- Extend `ParityAction` only with named semantic operations that represent real user operations.
- Add runner scenarios with `operationContract` entries for every Local PVP operation class.
- Keep `reset` as a harness setup action, but add a separate top-right restart click contract.
- Keep browser lifecycle/process guard protections enabled.

## Priority Order

1. Top-right controls and settings parity.
2. Board/take-gems/follow-up phase parity.
3. Market reserve-deck and reserved-card parity.
4. Hover stability parity, especially board cells and player-zone gems.
5. Draft reroll and remaining setup transitions.
6. Resolve the existing `market-deck-reserve-preview` visual diff.

## Acceptance Criteria

- `pnpm --dir apps/desktop test src/app/parity/__tests__/electronUnityParityHarness.test.tsx src/app/parity/__tests__/electronUnityParityState.test.ts`
  passes.
- Unity EditMode parity tests pass and include new Local PVP operation scenarios.
- `pnpm parity:electron-unity -- --skip-unity --viewports "1366x768"` has no operation-contract
  failures.
- Full `pnpm parity:electron-unity -- --viewports "1920x1080,1366x768"` has:
    - no Local PVP operation-contract failures,
    - no action behavior failures,
    - no state diff failures,
    - no `market-deck-reserve-preview` visual failure,
    - browser process count returns to the pre-run count, allowing at most one terminating orphan.
- Normal Chrome and Edge are not touched by any cleanup script.

## Short Prompt

Implement Local PVP Operation Parity closure: make Electron and Unity expose matching semantic
keys, clickable rects, hover/click results, and state transitions for top-right restart/settings,
settings save/load/surface, board/take-gems/follow-up phases, market/reserved-card flows, and hover
stability; then make the two-viewport parity matrix pass with the browser process guard intact.
