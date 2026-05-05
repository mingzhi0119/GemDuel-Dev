# Multiplayer Hidden Information Implementation Record (2026-05-05)

## Status

Implemented and verified. This artifact records the requirements, landed implementation phases, verification evidence, known limits, and rollback boundaries for multiplayer hidden-information handling.

## Goal

Implement hidden-information rules for multiplayer GemDuel without changing gameplay rules.

Required player-facing behavior:

1. In all multiplayer matches, including LAN and Online, each player's reserved cards are private.
2. A player can see their own reserved card faces.
3. The opponent can see only reserved-card backs/counts.
4. In LAN matches only, each local client can independently choose whether to hide the opponent PlayerZone cards/tableau and gems.

## Product Requirements

- Reserved-card privacy is mandatory in LAN and Online.
- Own reserved cards remain fully visible and interactive when rules allow preview, purchase, or discard.
- Opponent reserved cards must not expose card face, card ID, cost, points, ability, bonus color, crowns, preview content, or action buttons.
- Opponent reserved cards should preserve only public layout metadata: count, slot position, and card-back display.
- LAN adds two local-only visibility settings:
    - `Show opponent PlayerZone cards`
    - `Show opponent gems`
- LAN settings are asymmetric. If Player A hides Player B's PlayerZone, Player B's local view is unchanged.
- Online mode does not expose optional opponent-visibility toggles. Online reserved-card privacy is always enforced.

## Current Code Evidence

- `apps/desktop/src/hooks/useSettings.ts` owns persisted renderer preferences under `gemduel.preferences.v1`.
- `apps/desktop/src/app/chrome/AppChrome.tsx` owns the current settings menu where LAN-only visibility controls should live.
- `apps/desktop/src/app/shell/GameShell.tsx` has access to `state.mode`, `state.localPlayer`, route UI state, and settings-derived UI props.
- `apps/desktop/src/app/shell/PlayerRail.tsx` passes each player's inventory, tableau, reserved cards, royals, and interaction handlers into `PlayerZone`.
- `packages/ui/src/components/PlayerZone.tsx` composes identity, resource/tableau, and reserved-card columns.
- `packages/ui/src/components/playerZone/PlayerZoneReservedColumn.tsx` currently renders reserved card faces and opens a collection preview.
- `packages/ui/src/components/market/MarketDeckBack.tsx` already demonstrates themed card-back rendering that can be reused or mirrored for back-only reserved slots.
- `apps/desktop/src/hooks/gameNetwork/useHostStateSync.ts` currently sends full `GameState` snapshots through `online.sendState`.
- `apps/desktop/src/hooks/useOnlineManager.ts` serializes `SYNC_STATE` with a full `snapshot`.
- `packages/shared/src/logic/networkChecksums.ts` and `packages/shared/src/utils/checksum.ts` include reserved-card data in deterministic checksum flows.

## Architecture Requirements

Use an authority-compatible hidden-information model:

- Host may keep full authoritative state for validation, replay, recovery, and checksums.
- Remote-facing sync payloads must be receiver-redacted.
- Do not attempt cryptographic secrecy from the authoritative Host process in this task.
- Keep canonical reducer state full and unredacted.
- Add a shared pure helper that derives a receiver-facing `GameState` view without mutating canonical state.
- Redact only opponent reserved-card identity data in remote payloads.
- Ensure bootstrap, recovery, replay full sync, and replay delta sync do not leak opponent reserved-card faces through normal remote transport.
- Keep `packages/shared` pure: no React, DOM, Electron, or renderer dependencies.

## Proposed Data Model

Add shared visibility concepts in `packages/shared`:

- `ReservedCardVisibility = 'faces' | 'backs'`
- `LanOpponentVisibilityPreferences`
    - `showOpponentPlayerZoneCards: boolean`
    - `showOpponentGems: boolean`

Add a redacted reserved-card shape that is safe to pass through existing card-list UI without identity leakage. The placeholder must preserve only:

- stable anonymous slot key, such as `reserved-back-p2-0`
- level if needed for card-back selection, otherwise omit it
- a marker such as `isHiddenReservedCard: true`

The placeholder must not contain the original card ID, cost, points, ability, bonus color, crowns, prestige, image path, or UID.

## Landed Implementation

### Phase 1: Visibility Model

- Added shared types for reserved-card visibility and LAN opponent visibility preferences.
- Added pure shared visibility helpers, including `createMultiplayerViewForPlayer(state, receiver)`.
- The helper returns a cloned receiver-facing view:
    - receiver's own `playerReserved[receiver]` remains complete;
    - opponent `playerReserved[opponent]` becomes back-only placeholders;
    - source `GameState` is not mutated.
- Added shared unit tests proving:
    - owner reserved cards stay complete;
    - opponent reserved cards become placeholders;
    - redacted placeholders contain no card identity data;
    - the original state remains unchanged.

### Phase 2: Network Redaction

- Applied receiver-facing redaction before Host sends `SYNC_STATE` to Guest.
- Updated full recovery sync so recovery snapshots are also receiver-redacted.
- Deferred/dropped replay full and delta payloads on remote transport until a safe replay shape is defined.
- Kept Host validation against full authoritative state.
- Updated checksum policy so redacted Guest snapshots are not incorrectly compared against full Host snapshots.
- Added network tests for:
    - Host sync to Guest uses a receiver-redacted snapshot;
    - recovery/full sync does not leak opponent reserved-card faces;
    - Host can still validate Guest actions using full state;
    - checksum/recovery does not false-positive because one side stores a redacted view.

Checksum note: reserved-card faces are private in remote-facing views, so deterministic sync hashes intentionally compare the public reserved-slot shape only. The checksum detects count/slot-shape drift for reserved cards, not private reserved-card identity drift.

### Phase 3: UI Reserved-Card Rendering

- Extended `PlayerZoneReservedColumn` to support `reservedVisibility="faces" | "backs"`.
- Face mode keeps current behavior.
- Back mode renders themed card backs in the same featured reserved-card display box.
- Back mode disables:
    - preview overlay open;
    - buy action;
    - discard action;
    - hover-only action buttons;
    - data attributes that reveal original card IDs.
- Added UI tests proving opponent reserved-card back slots do not expose card identity in text, attributes, or preview interactions.

### Phase 4: LAN Local Visibility Settings

- Extended `useSettings` persisted payload with:
    - `lanShowOpponentPlayerZoneCards`
    - `lanShowOpponentGems`
- Defaults are `true` for both to preserve current LAN behavior.
- Added controls inside the existing settings menu.
- Show these controls only when the current route/mode is LAN multiplayer.
- Keep the settings local only; do not send them over LAN or Online transport.
- Applied the settings in `GameShell`/`PlayerRail`:
    - if opponent PlayerZone cards are hidden, render opponent tableau/royal/stack areas as back-only or collapsed public summaries;
    - if opponent gems are hidden, hide opponent inventory icons/counts;
    - own PlayerZone is never hidden by these settings.

### Phase 5: Verification

Focused tests:

- Shared redaction helper tests.
- Network sync/recovery tests.
- UI reserved-card visibility tests.
- Settings persistence and AppChrome settings-menu tests.

Full gates:

- `pnpm typecheck`
- `pnpm test`
- `pnpm --dir apps/desktop exec vitest run`

Browser verification should use the Vite renderer at `http://localhost:5173/`:

- Online-style view: each side sees own reserved faces and opponent reserved backs.
- LAN view: toggles hide opponent PlayerZone cards and gems locally without changing the other side's view.
- Confirm no opponent reserved-card identity appears in DOM text or data attributes.

### Verification Evidence

- `pnpm --dir apps/desktop exec vitest run ../../packages/shared/src/logic/__tests__/multiplayerVisibility.test.ts`: 1 file, 5 tests passed.
- `pnpm typecheck`: passed.
- `pnpm lint`: passed.
- `pnpm architecture:check`: passed.
- `pnpm boundaries:check`: passed.
- `pnpm test`: 161 files, 1035 tests passed.
- `git diff --check`: passed.
- Browser/Vite smoke at `http://127.0.0.1:5173/`: mounted the reserved-card column through Vite in a real browser. Back-only mode rendered one hidden reserved slot and one card back, exposed no `data-card-id`, opened no preview trigger, and did not leak the secret reserved ID, UID, image path, or ability text. Face mode for the local player's own reserved card still exposed its own card ID and preview trigger.

## Acceptance Criteria

- No opponent reserved-card identity appears in remote-facing multiplayer payloads.
- No opponent reserved-card identity appears in DOM text, alt text, titles, or data attributes in opponent view.
- Own reserved cards remain visible, previewable, and buyable when rules allow.
- Opponent reserved cards render as card backs/counts only.
- LAN opponent PlayerZone visibility and gem visibility toggles persist locally.
- LAN toggles affect only the local client and are not synchronized.
- Online mode keeps mandatory reserved-card privacy and exposes no visibility relaxation toggle.
- Existing gameplay rules, Host authority, action validation, and legal Collector/reserved-card interactions remain intact.

## Out Of Scope

- True cryptographic secrecy from the authoritative Host process.
- Gameplay rule changes.
- New multiplayer modes.
- New package manager or release target changes.
- Art generation or new card-back asset generation.

## Rollback

Rollback should be split by phase:

- Redaction helper rollback: remove the helper and tests, leaving canonical `GameState` unchanged.
- Network rollback: restore raw `SYNC_STATE`/recovery payloads only if the feature is backed out entirely.
- UI rollback: return reserved cards to face rendering by default and remove back-only mode props.
- Settings rollback: remove LAN visibility fields from `useSettings`; legacy persisted values can be ignored without migration because unknown JSON fields are harmless.

Do not partially roll back UI privacy while leaving protocol redaction active, or vice versa, unless tests explicitly cover that temporary state.
