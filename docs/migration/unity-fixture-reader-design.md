# Unity Fixture Reader Design

Last updated: 2026-05-11

Unity fixture reading is validation and audit infrastructure for the full migration. It is not a
live-gameplay driver. Production Unity gameplay must apply normalized commands from current state
through the governed rules boundary, then use fixtures and hashes only as parity evidence.

## Inputs

- `fixtures/replay-golden/manifest.json`
- Replay files referenced by the manifest
- `docs/migration/game-state-contract.md`
- `docs/migration/game-action-contract.md`
- `docs/migration/replay-parity-contract.md`

## Reader Responsibilities

- Load manifest schema version `1`.
- Reject missing fixture files.
- Reject unsupported Replay vNext schema versions.
- Parse `init`, `events`, optional `checkpoints`, and `summary`.
- Build a stable card instance registry from `init.cardInstances`.
- Apply bootstrap state from `init`.
- Inflate each replay event to the equivalent C# gameplay command.
- Apply commands through the governed rules boundary.
- Serialize final state with the documented replay state snapshot order.
- Compute `replay-state-hash-v1`.
- Compare final hash, winner, end reason, turn count, and event count against manifest
  expectations.

## Minimal C# Shape

```csharp
public interface IReplayFixtureReader
{
    ReplayManifest LoadManifest(string manifestPath);
    ReplayFixture LoadFixture(ReplayManifestEntry entry);
    ReplayParityResult VerifyFixture(ReplayManifestEntry entry);
}

public sealed record ReplayParityResult(
    string FixtureId,
    bool Passed,
    string ExpectedFinalStateHash,
    string ActualFinalStateHash,
    string? Error
);
```

This fixture reader is replay-audit tooling. It may use committed checkpoints to verify parity, but
live Unity gameplay and presentation flows must not replace current state from checkpoints.

## Failure Modes

| Failure                      | Required Behavior                                                          |
| ---------------------------- | -------------------------------------------------------------------------- |
| Missing manifest             | Fail before scene start and report path.                                   |
| Unsupported manifest schema  | Fail before reading fixtures.                                              |
| Unsupported replay schema    | Mark fixture failed; do not skip silently.                                 |
| Unknown event type           | Mark fixture failed with event index and type.                             |
| Illegal command              | Mark fixture failed with phase, actor, and action.                         |
| Hash mismatch                | Mark fixture failed with expected and actual hash.                         |
| Platform service unavailable | Do not affect replay parity; platform services are outside gameplay state. |

## First Implementation Order

1. JSON DTOs for manifest and Replay vNext.
2. Bootstrap state loader.
3. Event DTOs and command inflation.
4. Rules-boundary parity for the fixture subset.
5. Stable serializer and hash implementation.
6. Editor/playmode parity test runner.
7. Human-readable parity report artifact.
