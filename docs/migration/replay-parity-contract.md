# Replay Parity Contract

Last updated: 2026-05-09

Replay parity is the acceptance path for Unity migration. The TypeScript implementation is the
oracle; Unity must replay the same fixture events and produce the expected final state hash.

## Existing Oracle

- Replay schema version: `Replay vNext 1.0`
- Replay schema: `packages/shared/src/replay/schema.ts`
- Replay reader: `packages/shared/src/replay/reader.ts`
- Replay loader: `packages/shared/src/replay/loader.ts`
- Replay audit: `packages/shared/src/replay/audit.ts`
- State hash: `packages/shared/src/replay/stateHash.ts`

No new hash was added for this migration pass. The current `generateReplayStateHash` output is the
Unity parity target.

## Fixture Corpus

The committed golden corpus lives in `fixtures/replay-golden/`.

Required scenario tags:

- `local-pvp-opening`
- `reserve`
- `buy`
- `royal-selection`
- `extra-turn`
- `buff`
- `game-over`

The corpus is intentionally small. It must stay reviewable and deterministic. Do not commit large
historical outputs from `tools/artifacts/replay-audit` or local `Replay/` batch exports as the
Unity contract.

## Manifest Fields

`fixtures/replay-golden/manifest.json` records:

- `schemaVersion`: manifest schema version.
- `rulesVersion`: GemDuel package/rules version used for export.
- `replaySchemaVersion`: Replay vNext schema version.
- `hashContract`: current hash contract metadata.
- `requiredCoverage`: scenario tags the corpus must cover.
- `fixtures`: fixture file names, tags, expected final hash, winner, end reason, event count, and
  source note.

## Verification

Run:

```sh
pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts
```

The verifier:

- reads the manifest;
- verifies every referenced fixture exists;
- validates Replay vNext schema and summary integrity;
- reloads the replay through the TypeScript oracle;
- compares expected final state hash, winner, end reason, and event count;
- verifies required coverage tags are present.

Unity should implement an equivalent verifier that reads the same manifest, applies fixture events
with the C# reducer, serializes the final state using the documented contract, and compares the
same final hash.

## Export

Regenerate the corpus only when the rules contract intentionally changes:

```sh
pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-fixtures.ts
```

After regeneration, inspect the diff and rerun the verifier. Hash changes must be treated as rule
contract changes unless the migration is explicitly updating `replay-state-hash-v1`.

## Unity Acceptance Gate

Unity parity is not complete until:

- fixture reader loads `manifest.json`;
- Replay vNext 1.0 bootstrap state is reconstructed;
- every event stream applies without command-gate divergence;
- final Unity state hashes match every manifest `expectedFinalStateHash`;
- Unity reports unsupported event types explicitly rather than silently skipping them;
- fixture report is retained in the migration evidence for the Unity vertical slice.
