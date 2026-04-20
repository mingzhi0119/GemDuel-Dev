# Test Governance Matrix

This matrix tracks the negative-path and gate coverage we rely on during release work.

| Area                      | Failure Mode                                                    | Expected Outcome                           | Evidence                                                                                                | Status      |
| ------------------------- | --------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ----------- |
| Reducer command gate      | Invalid coordinates, duplicate selections, out-of-bounds inputs | Reject before mutation                     | `src/logic/__tests__/propertyBoundaries.test.ts`                                                        | `Completed` |
| FSM / phase policy        | Action issued in the wrong phase                                | Deterministic rejection reason             | `src/logic/__tests__/fsmCommandGate.test.ts`, `src/logic/__tests__/securityBoundaries.test.ts`          | `Completed` |
| Protocol parser           | Bad protocol version or malformed message                       | Parse or inbound check fails closed        | `src/logic/__tests__/protocolRecoveryMatrix.test.ts`                                                    | `Completed` |
| Replay import             | Invalid replay file or bad action history                       | Replay import is rejected                  | `src/app/io/__tests__/safeReplayImport.test.ts`, `src/logic/__tests__/replayImport.test.ts`             | `Completed` |
| Desktop governance        | BrowserWindow or preload contract drift                         | `npm run desktop:check` fails              | `electron/__tests__/desktopGovernance.test.ts`, `scripts/check-electron-governance.mjs`                 | `Completed` |
| Release-health governance | Telemetry, docs, or drill drift                                 | `npm run release:check` fails              | `scripts/__tests__/releaseHealthChecklist.test.ts`, `scripts/__tests__/releaseHealthOperations.test.ts` | `Completed` |
| Dependency governance     | Vulnerability, override, SBOM, secret, or env drift             | `npm run deps:check` fails                 | `scripts/__tests__/dependencyGovernance.test.ts`                                                        | `Completed` |
| Multiplayer hook recovery | Heartbeat timeout, reconnect, stale host decisions              | Deterministic hook-level recovery behavior | `src/hooks/__tests__/useConnectionHealth.test.tsx`, `src/hooks/__tests__/useGameNetwork.test.tsx`       | `Completed` |
