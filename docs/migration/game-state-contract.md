# Game State Contract

Last updated: 2026-05-09

The current TypeScript rules engine remains the gameplay oracle for Unity migration work. Unity
must reproduce this contract rather than inventing scene-local gameplay state.

## Source Of Truth

- Domain types: `packages/shared/src/types/domain-core.ts`
- Runtime schemas: `packages/shared/src/logic/contractSchemasGameState.ts`
- Replay state snapshots: `packages/shared/src/replay/schema.ts`
- Replay state serialization: `packages/shared/src/replay/runtime.ts`
- State hash: `packages/shared/src/replay/stateHash.ts`

`packages/shared` must stay pure. Do not add React, Electron, DOM, Steamworks, EOS, or Unity
dependencies to the shared package.

## Canonical Shape

Unity parity should treat the Replay vNext state snapshot as the engine-neutral state contract:

- `board`: 5x5 rows of gem IDs or `empty`.
- `bag`: ordered gem IDs.
- `turn`: `p1` or `p2`.
- `phase`: one of the governed `GamePhase` values.
- `mode`: `LOCAL_PVP`, `PVE`, or `ONLINE_MULTIPLAYER`.
- `winner`: `p1`, `p2`, or `null`.
- `market`: levels `1`, `2`, and `3` with stable replay card instance IDs or `null`.
- `decks`: ordered stable replay card instance IDs by level.
- `playerTableau`: ordered purchased cards, including explicit buff dummy cards.
- `playerReserved`: visible reserved card instance IDs per player.
- `playerRoyals`: royal card IDs per player.
- `inventories`: gem counts per player, including `gold` and `pearl`.
- `privileges`: privilege counts per player.
- `royalDeck` and `royalMilestones`: royal availability and threshold state.
- `extraPoints`, `extraCrowns`, `extraAllocation`, and `extraPrivileges`: buff/bonus state.
- `playerBuffs`, `draftPool`, `p2DraftPool`, `p1SelectedBuffId`, `draftOrder`,
  `buffLevel`, and `p2DraftLevel`: draft and buff state.
- `pendingReserve`, `pendingBuy`, `bonusGemTarget`, `nextPlayerAfterRoyal`,
  `pendingExtraTurn`, `playerTurnCounts`, and `abilityResolution`: in-progress interaction state.

Runtime-only UI fields such as active modals, toast messages, feedback animation data, and local
renderer preferences are not part of the Unity parity hash.

## Stable Identity Rules

- Runtime card IDs are normalized into replay card instance IDs using `c:<template>#<seq>`.
- Replay state snapshots must not depend on Electron, React component IDs, DOM order, texture
  import IDs, Unity scene instance IDs, or local filesystem paths.
- Unity should keep a local mapping from replay instance ID to C# card model and prefab view. That
  mapping is adapter state, not gameplay state.

## Hash Contract

The current parity hash is:

1. Serialize a `GameState` through `serializeReplayStateSnapshot`.
2. Stable-sort JSON object keys through `stableJsonStringify`.
3. Hash the resulting string with the current DJB2-style `hashString` implementation in
   `packages/shared/src/replay/stateHash.ts`.

The hash contract version for this migration plan is `replay-state-hash-v1`. Do not replace it
unless a targeted migration proves the existing hash cannot be reproduced in Unity. If the hash
changes, version the new contract, retain compatibility notes, update fixtures, and add targeted
tests.

## Unity Implementation Notes

- C# models should mirror the replay snapshot first, then expose scene-friendly view models.
- Keep reducer state transitions separate from MonoBehaviour presentation code.
- Treat unknown fields as schema failures until an intentional replay schema migration is planned.
- Use deterministic ordering for dictionaries before hashing.
- Use invariant culture for number/string formatting.
- Keep platform IDs, save paths, and account IDs outside state snapshots and hashes.
