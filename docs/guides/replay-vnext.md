# Replay vNext 1.0

## Status

Replay vNext 1.0 is the only supported replay format in current builds.

Legacy replay envelopes shaped like `{ version, timestamp, history }` are no longer supported and now fail with `UNSUPPORTED_REPLAY_VERSION`.

## Goals

- Smaller files
- Faster parsing
- Deterministic replay loading
- Direct analysis without UI-only noise

## Top-level shape

```json
{
  "schemaVersion": "1.0",
  "replayRevision": 12,
  "gameVersion": "5.2.11",
  "createdAt": "2026-04-22T00:00:00.000Z",
  "match": {
    "mode": "LOCAL_PVP",
    "seed": null,
    "started": true,
    "ended": false,
    "winner": null,
    "endReason": null
  },
  "players": {
    "p1": { "buff": { "id": "none", "level": 0 } },
    "p2": { "buff": { "id": "none", "level": 0 } }
  },
  "init": {},
  "events": [],
  "checkpoints": [],
  "summary": {}
}
```

## Rules

- Replay files store gameplay data only.
- UI fields such as `color`, `border`, `label`, images, class names, modals, and toast text are excluded.
- Cards are recorded by stable `instanceId` plus a single `cardInstances` template map.
- Replay sync over the network uses `replayFull` only for bootstrap, recovery, and resync.
- Normal authoritative sync uses `replayDelta`.

## Tooling

Shared replay APIs live in `packages/shared/src/replay/`:

- `saveReplayVNext(...)`
- `readReplayVNext(...)`
- `loadReplaySession(...)`
- `getReplaySummary(...)`
- `evaluateReplayPerformance(...)`

## Desktop runtime behavior

- In local desktop runtime, finished matches auto-save Replay vNext JSON into the repo-root `Replay/` folder.
- The folder is created on demand.
- Imported replay sessions do not auto-save again.

## Breaking change

Old replays cannot be migrated in-app. Re-record them with a Replay vNext build if you still need them.
