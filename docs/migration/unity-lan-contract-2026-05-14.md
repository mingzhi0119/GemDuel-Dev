# Unity LAN Contract - 2026-05-14

Status: audit, contract, implementation, and regression evidence for the Unity LAN vertical slice baseline.

This slice adds a transport-neutral Unity LAN service layer, loopback/fake protocol tests, a minimal
TCP transport, and Unity menu/presentation wiring for Host LAN / Join LAN / manual IP and port.
It does not add public Online, account identity, relay matchmaking, or Electron/shared contract
changes.

## Goal

Migrate Unity from the Local PVP and vsAI baselines to LAN two-player play on a local network.
LAN is the protocol trial surface for future Online work, but this slice does not add public Online,
accounts, relay matchmaking, or matchmaking services.

The authoritative gameplay rule remains unchanged:

- Electron/shared remains the product oracle for gameplay semantics, visibility, and UX.
- The LAN host is authoritative.
- Only the LAN host may apply `GameAction` through the TypeScript rules bridge.
- The LAN client sends intent commands only. It must not apply rules locally and guess host state.
- Every accepted command must be accompanied by an authoritative `replayRevision` and `stateHash`.
- Hidden information must follow the shared multiplayer visibility contract.
- Any hash or replay mismatch on Unity must trigger resync from the host.

## Implementation Slice Delivered

Implemented Unity files:

- `clients/unity/Assets/GemDuel/Scripts/Lan/LanProtocol.cs`
- `clients/unity/Assets/GemDuel/Tests/EditMode/Lan/LanProtocolEditModeTests.cs`
- `clients/unity/Assets/GemDuel/Scripts/Core/GameRulesEngineBoundary.cs`
- `clients/unity/Assets/GemDuel/Scripts/Core/TypeScriptGameRulesEngine.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelGameController.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/BuiltPlayerSmokeRunner.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/LocalDevLanBuiltPlayerSmoke.cs`
- `tools/migration/check-unity-lan-visibility-parity.ts`
- `tools/migration/run-unity-lan-built-player-smoke.mjs`
- `package.json`

The service layer defines `ILanTransport`, `ILanSession`, `LanMessage`, `LanHostSession`,
`LanClientSession`, `LoopbackLanTransport`, `TcpLanTransport`, and `LanVisibilityFilter` under the
`GemDuel.Lan` namespace. `GemDuelGameController` remains a presentation adapter: menu hit targets
open Host LAN / Join LAN, gameplay hit targets are converted into LAN client intents or host rules
bridge commands, and LAN snapshots/results are rendered at the edge.

Current evidence:

- `pnpm unity:rules-runtime:package` passed on 2026-05-15T00:14:06Z. The package report
  confirms packaged Node ESM runtime mode, bridge smoke `responseOk: true`, `stateHash:
40763f3f`, and `replayRevision: 0`.
- Unity Editor 6000.4.6f1 focused EditMode LAN protocol suite passed 9/9:
  `artifacts/unity/lan-focused-results.xml`.
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/check-unity-lan-visibility-parity.ts`
  passed and wrote `artifacts/unity/lan-visibility/unity-lan-visibility-parity-report.json`
  with `ok: true` and no differences against the shared visibility reference.
- Unity Windows build passed with Unity Editor 6000.4.6f1 and wrote:
  `artifacts/unity/build/windows-build-lan.log`.
- `pnpm unity:lan-built-player-smoke -- --timeout-ms 120000 --lan-timeout-ms 60000`
  passed and wrote:
  `artifacts/unity/lan-built-player-smoke/2026-05-15T00-11-15-032Z/unity-lan-built-player-smoke-launcher.json`.
  The host/client final state matched at `replayRevision: 2`, `stateHash: 9d74d991`;
  both players exited with code 0; and every interaction step used Unity hit targets.
- `pnpm parity:local-pvp-sim100` passed 100/100 with no Local PVP state-hash divergence and
  wrote:
  `artifacts/electron-unity-parity/local-pvp-simulation-100/local-pvp-simulation-parity-suite-report.json`.
- `pnpm parity:electron-unity --viewports "1920x1080,1366x768"` passed and wrote:
  `artifacts/electron-unity-parity/2026-05-15T00-14-14-468Z/`.
- `pnpm unity:product-surface:coverage:check` passed with verdict `Complete` and wrote:
  `artifacts/unity/product-surface-coverage/unity-product-surface-coverage-report.json`.

## Electron LAN Audit

### Host / Join Flow

Electron LAN has a pregame LAN discovery layer and then reuses the existing online gameplay protocol.
The current flow is:

1. The renderer enters the LAN route through `GameConfigMenu` / `LanMenu`.
2. `useLanMatchmaking` calls the preload bridge methods `startLanMatchmaking`,
   `cancelLanMatchmaking`, `selectLanPregameMode`, `confirmLanPregameStart`, and
   `reportLanPeerReady`.
3. Electron main owns the LAN discovery service and emits `lan-matchmaking-event` updates back to
   the renderer.
4. Electron main starts a local PeerJS signaling server on `0.0.0.0`, defaulting to port `9000`,
   path `/gemduel`.
5. Discovery produces a `LanLaunchPayload` with `targetIP`, `targetPort`, `hostPeerId`,
   `transportHost`, `hostPlayer`, and `mode`.
6. The renderer passes those target values into `useGameLogic` / `useOnlineManager`.
7. The guest connects to the host peer id. When the host data connection is connected, the host
   starts an `ONLINE_MULTIPLAYER` game with the selected mode and randomized host player.

Primary source paths:

- `packages/shared/src/types/lan.ts`
- `apps/desktop/electron/lanDiscoveryService.js`
- `apps/desktop/electron/lanDiscoveryServiceHandlers.js`
- `apps/desktop/electron/lanDiscoverySession.js`
- `apps/desktop/electron/peerSignalingServer.js`
- `apps/desktop/src/hooks/useLanMatchmaking.ts`
- `apps/desktop/src/App.tsx`
- `apps/desktop/src/hooks/useOnlineManager.ts`

### Discovery And Manual IP

The Electron LAN flow currently uses UDP broadcast discovery, not a visible manual IP form.

Discovery constants:

- LAN discovery protocol version: `1`
- UDP discovery port: `41234`
- Broadcast address: `255.255.255.255`
- Heartbeat interval: `1000ms`
- Peer stale threshold: `4500ms`

Discovery packet kinds:

- `SEARCH`
- `MATCH_ASSIGN`
- `MATCH_ACK`
- `SESSION_HEARTBEAT`
- `SELECT_MODE`
- `START_REQUEST`
- `START_READY`
- `CANCEL`

Manual IP / port is therefore a Unity-specific required entry point for this LAN migration. It must
remain a transport configuration path only. It must not change shared gameplay contracts, grant
authority to the client, or bypass the same host/client protocol used by discovery.

### Message Types

Electron LAN has two message layers:

1. LAN discovery / pregame packets in `packages/shared/src/types/lan.ts`.
2. Gameplay network messages in `packages/shared/src/types/network.ts`.

Current gameplay protocol version: `NETWORK_PROTOCOL_VERSION = 3`.

Current gameplay message types:

- `BOOTSTRAP_STATE`
- `GUEST_INTENT`
- `HOST_DECISION`
- `SYNC_STATE`
- `RECOVERY_REQUEST`
- `HEARTBEAT_PING`
- `HEARTBEAT_PONG`

Role direction is enforced by `getInboundMessageCheck`:

- Host accepts `GUEST_INTENT`, `RECOVERY_REQUEST`, and heartbeat messages.
- Guest accepts `BOOTSTRAP_STATE`, `HOST_DECISION`, `SYNC_STATE`, and heartbeat messages.

### Player Assignment

Pregame discovery distinguishes transport host from player seat.

- `transportHost` means the peer that hosts the local signaling target.
- `hostPlayer` is randomized by hashing the room id, both instance ids, and both nonces.
- `localSeat` is derived from `hostPlayer` and whether the local instance is `transportHost`.
- P1 alone can select the LAN mode and start the match.

This means Unity must not assume the transport host is always P1.

### TURN Credential And Actor Validation

Electron still owns TURN credential IPC for the online relay profile, but LAN authority does not
come from TURN credentials, accounts, or identity services. LAN uses local PeerJS signaling for
connection setup and shared protocol validation for gameplay authority.

Actor validation lives in shared gameplay/network logic:

- `reviewHostIntent` validates guest intent on the host.
- `validateGuestIntentCommand` rejects non-guest turns and non-protocol commands.
- `GUEST_INTENT_PERMISSION_TABLE` defines which guest intents are legal.
- `resolveNetworkDispatchPlan` blocks guest local mutation and emits `GUEST_INTENT` instead.

Unity LAN must preserve this model. The client UI may block out-of-turn clicks, but the host must
still reject invalid actors and wrong-turn commands.

### Hidden Information Visibility

The shared visibility contract lives in `packages/shared/src/logic/multiplayerVisibility.ts`.

Current behavior:

- `createMultiplayerViewForPlayer(state, receiver)` builds a receiver-specific view.
- Opponent reserved cards are replaced with hidden placeholders.
- `getReservedCardVisibilityForViewer(owner, receiver)` returns `backs` for opponent reserved cards.
- `createRemoteMultiplayerViewForHost(state)` redacts the host state for the remote player before
  sending it.

Electron UI settings for LAN visibility can hide allowed public information, such as opponent
tableau cards or gems, but they do not reveal hidden reserved cards or private modal information.
Unity must keep the same boundary: visibility toggles may only hide public information, never
unredact private information.

### Reconnect / Resync

Current Electron recovery is checksum and snapshot based:

- Bootstrap checksum mismatch requests recovery.
- Approved host decision checksum mismatch requests recovery.
- Stale or mismatched host decisions request recovery.
- Heartbeat timeout requests recovery.
- Host responds to `RECOVERY_REQUEST` with a redacted authoritative `SYNC_STATE`.

Current reconnect is limited:

- Peer signaling reconnect attempts exist.
- Data connection close reports disconnection and asks for a fresh match id.
- LAN discovery detects stale peers and can return to searching.

Unity LAN should implement a minimal reconnect handshake, but it must treat reconnect as
authoritative resync from host, not as client-side state continuation.

## Unity LAN Protocol Contract

Unity should introduce a transport-neutral LAN envelope rather than binding gameplay semantics to
UDP, TCP, WebRTC, or loopback transport details.

Required envelope fields:

```json
{
    "lanProtocolVersion": 1,
    "networkProtocolVersion": 3,
    "sessionId": "room-or-manual-session-id",
    "messageId": "monotonic-or-guid",
    "senderInstanceId": "instance-id",
    "senderPlayer": "p1-or-p2",
    "senderRole": "host-or-client",
    "sentAtMs": 0,
    "payload": {}
}
```

### Minimal Messages

`hello/version`

- Purpose: negotiate LAN protocol version, shared network protocol version, app/build identity, and
  transport capabilities.
- Required fields: `lanProtocolVersion`, `networkProtocolVersion`, `appVersion`,
  `unityBuildVersion`, `instanceId`, `supportedTransports`.
- Rejection rule: incompatible protocol versions fail before gameplay starts.

`host_snapshot`

- Purpose: initial authoritative snapshot from host to client.
- Required fields: `viewerPlayer`, `snapshot`, `replayRevision`, `stateHash`, `reason`.
- Visibility rule: `snapshot` must already be redacted for `viewerPlayer`.
- Allowed reasons: `initial`, `reconnect`, `manual_resync`.

`client_command`

- Purpose: client intent to host.
- Required fields: `requestId`, `actor`, `command`, `baseReplayRevision`, `baseStateHash`.
- Authority rule: client does not apply the command locally.
- Host rule: host rejects if `actor` is not the remote player, it is not that player's turn, the
  command is not in the allowed guest intent set, or the base revision/hash is stale.

`command_result`

- Purpose: authoritative acceptance or rejection for a client command.
- Required fields: `requestId`, `intentKind`, `accepted`, `replayRevision`, `stateHash`.
- Accepted result: includes the post-action `replayRevision` and `stateHash`.
- Rejected result: includes unchanged host `replayRevision` and `stateHash`, plus `reasonCode` and
  `reason`.

`replay_event`

- Purpose: optional delta replay proof for committed host actions.
- Required fields: `fromRevision`, `toRevision`, `stateHashAfter`, `event` or `replaySync`.
- Rule: if replay delta application fails or produces a different hash, the receiver requests
  resync.

`state_hash`

- Purpose: lightweight integrity proof.
- Required fields: `replayRevision`, `stateHash`, `reason`.
- Rule: mismatch triggers `resync_request`.

`resync_request`

- Purpose: client asks host for a fresh authoritative view.
- Required fields: `reason`, `clientReplayRevision`, `clientStateHash`.
- Allowed reasons include `CHECKSUM_MISMATCH`, `STALE_PACKET`, `HEARTBEAT_TIMEOUT`,
  `RECONNECT`, and `LOCAL_VIEW_REJECTED`.

`resync_snapshot`

- Purpose: host sends authoritative receiver-specific recovery state.
- Required fields: `viewerPlayer`, `snapshot`, `replayRevision`, `stateHash`, `reason`.
- Visibility rule: same redaction as `host_snapshot`.

`disconnect/reconnect`

- Purpose: minimal lifecycle handling.
- Required fields: `sessionId`, `player`, `lastReplayRevision`, `lastStateHash`, `reason`.
- Rule: reconnect cannot resume from client state alone. Host must send `resync_snapshot` before
  client interaction is enabled again.

## Unity Service Layer Contract

Do not put LAN transport or session state into `GemDuelGameController`.

Introduce a dedicated LAN layer under a new Unity namespace. Current slice keeps the contract and
runtime classes in one file for reviewability:

- `clients/unity/Assets/GemDuel/Scripts/Lan/LanProtocol.cs`

Future cleanup may split it into `Contracts/`, `Loopback/`, `Runtime/`, and `Transport/` files
without changing the protocol contract.

### Required Interfaces

`ILanTransport`

- Connects, listens, sends, receives, and closes.
- Has no gameplay knowledge.
- Must support loopback/fake transport first.
- Real LAN transport can later be UDP discovery plus TCP/WebRTC data channel, but the session layer
  must not depend on that choice.

`ILanSession`

- Owns role, player assignment, connection status, and current authoritative metadata.
- Exposes received snapshots and command results to the Unity presentation adapter.
- Does not directly mutate Unity presentation state outside a snapshot/result boundary.

`LanMessage`

- Represents the protocol envelope and typed payload.
- Carries `replayRevision` and `stateHash` wherever the message commits or proves state.

### Host Session

Host responsibilities:

- Start the LAN game through the existing TypeScript rules bridge.
- Broadcast initial receiver-specific snapshot with `replayRevision` and `stateHash`.
- Receive `client_command`.
- Validate actor, turn, allowed command kind, base revision/hash, and payload shape.
- Apply accepted commands through the TypeScript rules bridge only.
- Broadcast accepted/rejected `command_result`.
- Send replay delta or authoritative resync snapshot after accepted commands.

The existing Unity rules boundary already exposes `StateHash` and `ReplayRevision` through
`GameRulesResult`, so the host can satisfy this contract without changing Electron/shared.

### Client Session

Client responsibilities:

- Render host snapshots only.
- Enable real Unity hit targets only when the current visible state says it is the local player's
  turn.
- Convert clicks into `client_command` intent messages.
- Wait for host `command_result` and host snapshot/replay proof before updating state.
- Request resync on stale result, replay gap, hash mismatch, heartbeat timeout, or reconnect.

The client must not call `IGameRulesEngine.ApplyCommand` for live LAN actions.

### Presentation Adapter

Unity presentation should be adapted at the edge:

- Main menu exposes `Host LAN`, `Join LAN`, manual IP/port, connection status, and player role.
- Gameplay clicks still come from real Unity hit targets.
- Hit targets produce intent commands when running as LAN client.
- Hit targets may apply through the rules bridge only when running as LAN host.
- Presentation receives snapshots/results from the LAN service and renders them; it does not own
  transport, protocol validation, or reconnect logic.

## Hidden Information Contract For Unity

Unity must mirror shared visibility behavior, not local UI guesses.

Host snapshot rules:

- Host keeps the full authoritative state locally.
- Host sends receiver-specific snapshots to each client.
- Opponent reserved cards, private hand/modal data, and any private future fields must be redacted
  before the snapshot leaves the host.

Client rules:

- Client never accepts a full hidden host state if the viewer is not allowed to see it.
- Client visibility settings may hide public opponent cards/gems.
- Client visibility settings may not reveal hidden reserved cards or private state.

Validation rule:

- Hidden-info tests should compare Unity snapshots against `createMultiplayerViewForPlayer` /
  `createRemoteMultiplayerViewForHost` outputs from shared.

## Required Tests

Current implementation slice covers:

- deterministic protocol handshake over loopback/fake transport
- deterministic protocol smoke over local TCP loopback transport
- host starts game through rules bridge and emits `host_snapshot`
- client click command is sent as intent and not applied locally
- accepted command includes `replayRevision` and `stateHash`
- invalid actor / wrong turn command is rejected before rules bridge apply
- hash mismatch triggers `resync_request`
- host responds with `resync_snapshot`
- disconnect/reconnect performs authoritative resync before interaction resumes
- hidden reserved-card redaction mirrors the shared visibility contract shape
- direct hidden-info parity against the shared visibility output fixture
- two-instance Windows built-player LAN smoke on one machine
- real Unity hit-target evidence for LAN menu, Host LAN, Join LAN, board-gem click, and command
  confirmation
- host/client final state convergence after committed LAN commands

The built-player smoke proves:

- one machine launches host and join Unity players
- host listens on the manual port and client joins by manual IP / port
- both render the same committed `replayRevision` and `stateHash` after accepted commands
- the host is authoritative and the client is intent-only
- no Online relay or matchmaking flag is active
- gameplay evidence is collected through Unity hit targets rather than direct state mutation

## Known Gaps After This Slice

- Electron LAN has no visible manual IP / port join form today. Unity adds it as a transport
  configuration path, but protocol semantics must remain identical to discovery launch.
- Current shared network message v3 uses `checksum` and replay sync types, but it does not expose
  top-level `replayRevision` and `stateHash` on every gameplay message. Unity LAN should carry
  those in its LAN envelope or in a future shared protocol revision; do not change shared until a
  concrete shared-contract defect is proven.
- Current Electron gameplay reconnect is recovery-snapshot based and limited after data-channel
  close. Unity implements protocol-level resync/reconnect coverage, but production reconnect UX
  remains minimal.
- Current Electron LAN transport is PeerJS/WebRTC data over local signaling. Unity now has TCP
  manual IP as the first real transport, while keeping the session layer transport-neutral.
- Player assignment is fixed to host `p1` / client `p2` in this first Unity slice. Electron's
  randomized `hostPlayer` assignment remains a future parity task.
- UDP discovery is not implemented in Unity yet; manual IP / port is the current LAN join path.
- Unity Online, public relay, accounts, matchmaking, and TURN/service credential handling are
  intentionally absent.
- Unity vsAI and VisualLab are not part of this LAN migration and remain unchanged.
- `pnpm parity:local-pvp-built-player-fullgame100` was not completed as part of this LAN close-out.
  A prior attempt timed out, so that long Local PVP gate should be restored separately before using
  this branch as the broader Local PVP migration baseline.

## Implementation Sequence

1. Done: add Unity LAN contracts and loopback/fake transport tests.
2. Done: add `LanHostSession` and `LanClientSession` over loopback, with host-only rules bridge
   mutation.
3. Done: add Unity menu entry points and presentation adapter wiring.
4. Done: add real local TCP transport behind `ILanTransport`.
5. Done: add direct hidden-info parity evidence against shared visibility outputs.
6. Done: run two Unity built-player instances on one machine and complete a LAN smoke duel.

Stop condition for the Unity LAN vertical slice is met: focused fake/TCP transport protocol tests,
shared visibility parity, packaged rules-runtime smoke, Windows build, two-instance built-player LAN
smoke, Local PVP simulation parity, Electron-Unity viewport parity, and product-surface coverage all
pass. This is a LAN baseline only; it is not an Online, account, relay, matchmaking, vsAI, or
VisualLab implementation.
