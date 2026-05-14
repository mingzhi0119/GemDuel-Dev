# ADR-0012: Keep TypeScript Rules Authoritative Through a Unity Rules Adapter

Status: Accepted

Date: 2026-05-11

## Context

The Unity migration must preserve the current Electron and `packages/shared` gameplay behavior while
Unity becomes a replacement candidate. The existing Unity client still contains fixture-driven
paths and a partial C# reducer. That is useful migration evidence, but it is not a safe production
rules boundary because it can drift from the TypeScript reducer and replay/hash oracle.

The full migration governance requires Unity live gameplay to advance from normalized commands and
current state, not replay checkpoints or MonoBehaviour-owned state.

## Decision

Use `packages/shared` as the authoritative rules engine for Unity migration by placing an
`IGameRulesEngine` boundary between Unity presentation code and gameplay state transitions.

The first accepted implementation is a governed TypeScript oracle adapter:

- Unity presentation emits normalized commands.
- The adapter validates actor, phase, ownership, resources, and payload shape through
  `packages/shared`.
- The adapter applies `applyAction` to the current canonical replay state.
- The adapter returns the next replay-state snapshot, deterministic state hash, and structured
  rejection reason.
- Unity presentation renders the returned snapshot and never mutates gameplay state directly.

A future manual C# port is allowed only after it implements the same `IGameRulesEngine` contract and
passes replay/hash parity against the TypeScript oracle for every required action and FSM phase.

## Rejected Alternatives

- MonoBehaviour-owned gameplay state: rejected because it makes Unity scene state the rules source
  and cannot be audited against replay/hash fixtures.
- UI-driven state mutation: rejected because click handlers must express intent, not mutate board,
  inventory, market, or player ownership directly.
- Platform SDK callbacks mutating gameplay directly: rejected because platform services are
  adapters and must stay outside deterministic gameplay state and replay hashes.
- Standalone C# rules without replay/hash comparison: rejected because it would create an
  unverifiable second rules source.
- Replay checkpoint replacement as live gameplay: rejected because checkpoints are validation
  evidence only.

## Boundary

The Unity-side boundary is:

```csharp
public interface IGameRulesEngine
{
    GameRulesResult StartLocalGame(string seed);
    GameRulesResult ApplyCommand(GameState state, GameRulesCommand command);
}
```

The C# contract lives in
`clients/unity/Assets/GemDuel/Scripts/Core/GameRulesEngineBoundary.cs`. The TypeScript LocalDev
adapter lives in `tools/migration/unity-rules-engine-bridge.ts`.

The bridge-level request and response are engine-neutral JSON:

- `start`: build a deterministic `INIT` or `INIT_DRAFT` state.
- `apply`: apply a normalized command to a supplied replay-state snapshot and `Replay vNext` init
  snapshot.
- `ok`: whether the command produced a new state.
- `rejection`: structured rejection reason when the command is illegal.
- `state`: canonical replay-state snapshot.
- `stateHash`: `replay-state-hash-v1` hash computed by `packages/shared`.

For LocalDev and built-player evidence, the TypeScript bridge CLI must also produce a structured
`ok=false` response through its `--out` file path when infrastructure failures occur after argument
parsing. This keeps mailbox callers from treating malformed requests as silent timeouts while still
preserving stderr diagnostics and non-zero process status. It does not make the TypeScript bridge a
final release-runtime packaging decision.

## Consequences

- Unity can migrate UI and platform surfaces without duplicating gameplay rules.
- TypeScript remains the oracle until full parity is proven.
- Any later C# port has a clear acceptance target: same command contract, same replay-state shape,
  same deterministic hashes, same rejection semantics.
- The current fixture-driven Unity reducer is not sufficient for full migration completion until
  production gameplay is routed through this boundary and checkpoint replacement is absent from live
  paths.
