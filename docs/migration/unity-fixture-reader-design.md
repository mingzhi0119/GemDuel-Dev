# Unity Fixture Reader Design

Last updated: 2026-05-09

Unity fixture reading is the first integration point between the sidecar client and the TypeScript
rules oracle.

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
- Apply commands through the C# reducer.
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

This is a design stub only. Do not add runtime C# implementation until Unity work starts.

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
4. C# reducer parity for the fixture subset.
5. Stable serializer and hash implementation.
6. Editor/playmode parity test runner.
7. Human-readable parity report artifact.
