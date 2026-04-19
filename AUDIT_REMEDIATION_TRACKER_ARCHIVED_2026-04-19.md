# Audit Remediation Tracker

This document tracks every issue found in the independent code audit and records the current remediation state.

Allowed status values:

- `Completed`
- `In Progress`
- `Unstarted`

## P0

### 1. Remote messages could overwrite the authoritative game state

- Priority: `P0`
- Status: `Completed`
- Area: `src/hooks/useOnlineManager.ts`, `src/hooks/useGameNetwork.ts`, `src/logic/gameReducer.ts`
- Summary: Incoming network data was trusted too early. A malicious peer could send crafted packets that reached the application state layer and bypassed the host authority model.
- Remediation: Added runtime network-message parsing, blocked invalid message roles, and restricted remote `GAME_ACTION` handling to bootstrap actions only.

## P1

### 2. Guest requests had no action allowlist

- Priority: `P1`
- Status: `Completed`
- Area: `src/logic/authority.ts`, `src/logic/actionValidation.ts`
- Summary: The host previously accepted any guest action as long as it was `p2`'s turn.
- Remediation: Added an explicit guest-action allowlist plus reducer-side validation for phase, payload, and ownership checks.

### 3. Reducer did not enforce phase and turn constraints

- Priority: `P1`
- Status: `Completed`
- Area: `src/logic/gameReducer.ts`, `src/logic/actionValidation.ts`
- Summary: Sensitive actions such as `BUY_CARD`, `STEAL_GEM`, `TAKE_BONUS_GEM`, and `USE_PRIVILEGE` could execute outside their intended state-machine phase.
- Remediation: Added centralized reducer-side rejection rules before mutation handlers run.

### 4. `TAKE_GEMS` lacked reducer-side boundary validation

- Priority: `P1`
- Status: `Completed`
- Area: `src/logic/actions/boardActions.ts`, `src/logic/actionValidation.ts`
- Summary: Duplicate coordinates, non-linear selections, empty cells, gold cells, and out-of-bounds coordinates were not revalidated in the logic layer.
- Remediation: Added reducer-side coordinate, shape, and board-cell validation; updated tests to lock in the new behavior.

### 5. Electron preload exposed raw IPC primitives

- Priority: `P1`
- Status: `Completed`
- Area: `electron/preload.js`, `src/types.ts`, `src/components/UpdateNotification.tsx`
- Summary: The renderer had direct access to generic `ipcRenderer.send/on/removeAllListeners`, which widened the desktop attack surface.
- Remediation: Replaced the raw IPC bridge with a narrow, explicit Electron API surface for version lookup, updater events, and app restart.

### 6. Windows production shell loading path was fragile

- Priority: `P1`
- Status: `Completed`
- Area: `electron/main.js`
- Summary: The production window used a manually concatenated `file://` URL, which is brittle on Windows.
- Remediation: Switched production loading to `BrowserWindow.loadFile(...)`.

## P2

### 7. Network input lacked runtime schema validation

- Priority: `P2`
- Status: `Completed`
- Area: `src/hooks/useOnlineManager.ts`, `src/logic/actionValidation.ts`
- Summary: Malformed network packets could reach protocol handlers without shape checks.
- Remediation: Added runtime parsing for network messages and payload validation before dispatch.

### 8. Update notification subscriptions leaked listeners

- Priority: `P2`
- Status: `Completed`
- Area: `src/components/UpdateNotification.tsx`
- Summary: Update event listeners were registered on mount without cleanup.
- Remediation: Added explicit unsubscribe handling through the new preload event API.

### 9. Production updater and logging policy are too permissive

- Priority: `P2`
- Status: `Completed`
- Area: `electron/main.js`
- Summary: Production logging is still very verbose and prerelease updates are still enabled by default.
- Remediation: Split development and production log levels, capped file log size, gated prerelease updates behind an explicit opt-in or prerelease build, and added runtime updater disable handling for controlled environments.

### 10. TURN credentials are still bundled into the client

- Priority: `P2`
- Status: `Completed`
- Area: `src/config/webrtc.ts`, `src/vite-env.d.ts`, `src/App.tsx`, `electron/main.js`, `electron/preload.js`
- Summary: `VITE_TURN_*` variables are still exposed in the frontend bundle, so they cannot be treated as secrets.
- Remediation: Removed bundled `VITE_TURN_*` usage, switched to runtime ICE-server injection through the Electron bridge, and preserved a STUN-only fallback when no runtime relay config is supplied.
- Follow-up: A server-issued short-lived TURN credential flow would still be stronger than static desktop runtime configuration.

## P3

### 11. Core hooks are still too tightly coupled

- Priority: `P3`
- Status: `In Progress`
- Area: `src/hooks/useGameLogic.ts`, `src/hooks/useGameInteractions.ts`
- Summary: State management, networking, AI control, history flattening, and UI intent translation are still concentrated in a small number of large hooks.
- Current progress: Extracted history flattening into a dedicated hook and moved start-game and draft-pool construction into a dedicated setup factory.
- Recommended next step: Continue splitting intent construction and replay concerns out of `useGameInteractions`.

### 12. Type boundaries remain too loose in setup and draft flows

- Priority: `P3`
- Status: `Completed`
- Area: `src/types.ts`, `src/logic/actions/buffActions.ts`, `src/hooks/useGameInteractions.ts`
- Summary: Several setup and draft payloads still rely on broad `Record<string, unknown>` shapes.
- Remediation: Introduced dedicated setup and draft DTOs, narrowed `pendingSetup`, updated reducers and helpers to use typed payloads, and aligned runtime validators with the new contract.

### 13. Negative-path test coverage is still incomplete

- Priority: `P3`
- Status: `In Progress`
- Area: `src/logic/__tests__`
- Summary: The suite was strong on happy paths but weaker on malformed inputs, invalid phases, and hostile network data.
- Current progress: Added reducer-boundary and protocol-security tests, stricter bootstrap-payload rejection coverage, runtime ICE-config tests, and updated online integration coverage for the typed setup path.
- Recommended next step: Extend coverage for online desync recovery and Electron bridge behavior under malformed runtime config.
