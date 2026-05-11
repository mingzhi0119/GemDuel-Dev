# Local PVP Operation Parity Gap Report

Date: 2026-05-10

Scope: Local PVP only, with Electron as the behavioral source of truth. This includes in-match
operations, previews, follow-up phases, hover behavior, and the top-right shell controls such as
settings, restart, and rulebook.

## Evidence Snapshot

- The Operation Parity Contract currently requires same semantic target, same pointer operation,
  matching rectangle tolerance, and same gameplay result.
- Current explicitly contracted operations are only `draft-hover-feedback`,
  `market-card-preview`, and `market-deck-reserve-preview`.
- Latest full run artifact:
  `artifacts/electron-unity-parity/2026-05-10T19-39-02-289Z/parity-matrix.md`.
- Latest full run covered both `1920x1080` and `1366x768`.
- Browser process guard was stable in that run: `beforeCount=1`, `peakCount=14`,
  `afterCount=1`, `orphanCount=1`.

## Current Result

The newly contracted operations pass:

- `draft-hover-feedback`: equivalent operation contract at both viewports.
- `market-card-preview`: equivalent operation contract at both viewports.
- `market-deck-reserve-preview`: equivalent operation contract at both viewports.

The full parity matrix still has one repeated red scenario:

- `market-deck-reserve-preview` is visually failing at both viewports.
- The semantic operation is correct: clicking `market.level.1` opens a deck preview, exposes
  `card.preview.card` and `card.preview.action.reserve`, and does not mutate gameplay state.
- The remaining mismatch is visual/geometry around `card.preview.action.reserve`:
    - `1920x1080`: reserve action rectangle is offset by `100px` on x.
    - `1366x768`: reserve action rectangle differs by about `97.69px` x, `16.17px` y,
      `53.09px` width, and `16.18px` height.

## Gap Classes

- Confirmed mismatch: the current evidence shows a concrete Electron/Unity difference.
- Contract gap: Electron behavior exists, but the Operation Parity Contract does not yet prove
  Unity matches it.
- Implementation gap: Unity renders a visual placeholder or partial path, but does not expose the
  matching semantic operation.

## Findings

### P0 - Top-right restart and rulebook are not operation-equivalent

Electron exposes three top-right controls: rulebook, restart, and settings. Restart is a real
button using `data-app-restart-button="true"` and calls `onRequestRestart()`, which clears the
current game through `handleRestart`.

Unity renders three topbar glyphs, `II`, rewind, and gear, but only the gear receives a semantic
target and `open_settings` event. The pause/rewind glyphs have no semantic keys and no click
behavior. The parity harness also has a programmatic `reset` action, but it is not a real click
on the top-right restart button.

Required contract:

- `chrome.rulebook`: same clickable rectangle and opens/closes the same rulebook surface, or is
  explicitly removed from Local PVP parity scope.
- `chrome.restart`: same clickable rectangle and same state transition as Electron restart:
  history cleared, route reset, active Local PVP match exited.
- `settings.control`: keep the existing settings gear coverage.

Evidence:

- `apps/desktop/src/app/chrome/AppChrome.tsx:130` rulebook button.
- `apps/desktop/src/app/chrome/AppChrome.tsx:154-157` restart button calls
  `onRequestRestart()`.
- `apps/desktop/src/App.tsx:251-258` restart clears route/history and restart state.
- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs:2041-2043`
  renders the three topbar glyphs.
- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs:2048-2060`
  assigns a semantic target only to the gear.

### P0 - Settings menu is only partially implemented in Unity

Electron settings includes language, sound, replay save, replay load, and a surface-theme
dropdown. The surface theme list has six variants: `crystal-anime`, `royal-luxury`,
`dark-arcane`, `clean-boardgame`, `pearl-opaline`, and `lotus-porcelain`.

Unity currently exposes settings targets for language, sound, and one hard-coded surface row
(`settings-surface-royal-luxury`). Save and load rows are rendered but do not pass an event type,
so they do not create clickable targets. Unity also lacks an equivalent close/dismiss contract for
outside click or Escape.

Required contract:

- `settings.locale.en`, `settings.locale.zh`.
- `settings.sound`.
- `settings.save`, `settings.load`.
- `settings.surface.<variant>` for every Electron variant, or a documented Local PVP subset.
- `settings.close` or backdrop/Escape close behavior.
- Persistence result must be compared on both sides, not only whether the panel is visible.

Evidence:

- `apps/desktop/src/app/chrome/AppChrome.tsx:202` settings panel marker.
- `apps/desktop/src/app/chrome/AppChrome.tsx:252` sound toggle.
- `apps/desktop/src/app/chrome/AppChrome.tsx:290-306` save/load controls.
- `apps/desktop/src/app/shell/surfaceTheme.ts:28-34` Electron surface variants.
- `apps/desktop/src/app/chrome/AppChromeSurfaceMenu.tsx:99` surface dropdown control.
- `apps/desktop/src/app/chrome/AppChromeSurfaceMenu.tsx:133-143` per-variant options.
- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs:1924-1934`
  Unity settings rows.
- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs:1949-1951`
  only rows with an event type become clickable settings controls.

### P1 - Market deck reserve preview is semantically fixed but still visually off

This is the only confirmed red row in the latest full matrix. It is no longer the user's original
"clicking deck does nothing" bug: deck click now opens preview and exposes the reserve action.
The remaining issue is the reserve action layout/visual alignment.

Required contract:

- Keep `market.level.1` click state-stable.
- Align `card.preview.action.reserve` rectangle and visual treatment with Electron at both
  required viewports.

Evidence:

- `artifacts/electron-unity-parity/2026-05-10T19-39-02-289Z/parity-matrix.md:12`
  failing at `1920x1080`.
- `artifacts/electron-unity-parity/2026-05-10T19-39-02-289Z/parity-matrix.md:26`
  failing at `1366x768`.

### P1 - Board and follow-up phase operations are not yet fully contracted

Electron has Local PVP behavior for illegal-action inertness, take-gems confirmation, reserve
gold follow-up, bonus gem, steal, privilege, discard excess, wild-card color selection, and royal
selection follow-up. Unity can replay several corresponding event types, but the Operation
Parity Contract does not yet drive them all by same-name semantic operations.

Important uncovered operations:

- `take_gems`: select board gems, validate selection, confirm, cancel.
- `take_bonus_gem`: click the required board gem in bonus phase.
- `reserve_deck`: preview deck reserve, click reserve, choose required gold.
- `steal_gem`: click opponent gem.
- `discard_gem`: click own excess gem.
- `use_privilege` / `activate_privilege` and `cancel_privilege`.
- `select_card_color`: wild-card color follow-up.
- `select_royal` follow-up after a market buy unlocks a royal.

Evidence:

- `apps/desktop/src/__tests__/phaseInteractionMonkey.test.tsx:355-410` phase-aware inertness
  and preview action routing.
- `apps/desktop/src/__tests__/phaseInteractionMonkey.test.tsx:435-534` bonus, steal,
  privilege, discard, reserve-waiting smoke paths.
- `apps/desktop/src/__tests__/phaseInteractionMonkey.test.tsx:610-841` preview follow-up
  paths for reserve, wild color, bonus, steal, discard, and royal selection.
- `clients/unity/Assets/GemDuel/Scripts/Core/GameReducer.cs:33-44` Unity replay reducer only
  supports a limited replay-event set.
- `apps/desktop/src/app/parity/electronUnityParityTypes.ts:137-156` parity API lacks explicit
  Local PVP actions for several of the operations above.

### P1 - Hover parity is currently too narrow

The current contract validates only `draft.buff.1` hover. The reported random yellow hover on the
gem board needs a board/player-zone/market hover contract, because the current pass does not prove
that moving the pointer across board cells leaves unrelated targets unhighlighted.

Required contract:

- Hovering `board.cell.r.c` exposes only that semantic key and does not mutate state.
- Moving from a board cell to blank space clears hover.
- Hovering market deck/card, reserved card, player-zone gem, and topbar controls exposes only the
  intended semantic key.
- Repeated hover movement must be deterministic across both clients.

Evidence:

- `docs/migration/electron-unity-operation-parity-contract.md:31-37` current contract covers
  only draft hover plus market preview clicks.
- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs:336-355`
  Unity hover snapshot shape.
- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs:2586-2616`
  Unity board cell semantic keys and hover frame.

### P2 - Draft and mode-selection coverage is incomplete

The matrix covers starting Local PVP, choosing one level-3 boon, and hovering one draft card. It
does not yet cover draft reroll behavior, all buff slots, mode setup toggles, or route transitions
back from a running Local PVP game to setup.

Required contract:

- `draft.buff.<index>` click/hover for all visible slots.
- `draft.reroll` if visible in Local PVP.
- Local PVP setup controls: classic/roguelike, PVP/PVE boundary, and start/back transitions.

## Next Codex Goal File

Use this target file for the next implementation goal:

`docs/migration/local-pvp-operation-parity-codex-goal-2026-05-10.md`

## Short Prompt

Implement the Local PVP Operation Parity closure from
`docs/migration/local-pvp-operation-parity-codex-goal-2026-05-10.md`: add missing Electron/Unity
semantic keys and operation-contract scenarios for top-right restart/settings, settings save/load
and surface options, board/take-gems/follow-up phases, player-zone interactions, and hover
stability; keep Electron as source of truth and require the full two-viewport parity matrix to pass.
