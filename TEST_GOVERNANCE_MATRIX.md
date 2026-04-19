# Test Governance Matrix

This matrix is the Priority 5 source of truth for negative-path coverage.

Allowed status values:

- `Completed`
- `In Progress`
- `Unstarted`

| Boundary                         | Failure Case                                                                              | Expected Outcome                                              | Covered By                                                                                                | Status        |
| -------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------- |
| Reducer command gate             | Invalid gem line, duplicate coords, out-of-bounds coords                                  | Reject before mutation                                        | `src/logic/actions/__tests__/boardActions.edge.test.ts`, `src/logic/__tests__/propertyBoundaries.test.ts` | `Completed`   |
| FSM / phase policy               | Action issued in illegal phase                                                            | Reject with deterministic reason                              | `src/logic/__tests__/fsmCommandGate.test.ts`, `src/logic/__tests__/securityBoundaries.test.ts`            | `Completed`   |
| Protocol parser                  | Wrong protocol version, malformed host decision, role-direction mismatch                  | Parse fails or inbound check rejects                          | `src/logic/__tests__/propertyBoundaries.test.ts`, `src/logic/__tests__/protocolRecoveryMatrix.test.ts`    | `Completed`   |
| Host decision recovery           | Missing command/checksum, checksum mismatch, stale approvals                              | Trigger `STALE_PACKET` or `CHECKSUM_MISMATCH` recovery reason | `src/logic/__tests__/networkProtocol.test.ts`, `src/logic/__tests__/protocolRecoveryMatrix.test.ts`       | `Completed`   |
| Replay import                    | Non-bootstrap first action, malformed action payload, oversized/invalid envelope          | Import rejected before replacing history                      | `src/logic/__tests__/replayImport.test.ts`                                                                | `Completed`   |
| Runtime schema ingress           | Invalid market refs, invalid select-buff payload, malformed ICE config                    | Schema parse fails closed                                     | `src/logic/__tests__/runtimeSchemas.test.ts`, `src/config/__tests__/webrtc.test.ts`                       | `Completed`   |
| Electron preload bridge          | Unexpected API exposure, wrong channel wiring, unsubscribe failure                        | Contract test fails                                           | `electron/__tests__/preloadContract.test.ts`                                                              | `Completed`   |
| Electron runtime config          | Invalid env JSON, invalid ICE entries, updater policy env toggles                         | Config parser falls back safely                               | `electron/__tests__/runtimeConfig.test.ts`                                                                | `Completed`   |
| Randomized coordinate robustness | Generated valid lines stay valid; malformed selections are rejected                       | Property holds with shrinking                                 | `src/logic/__tests__/propertyBoundaries.test.ts`                                                          | `Completed`   |
| Coverage governance              | Branch coverage tracked for critical reducers/protocol/runtime files                      | `npm run test:coverage` passes with thresholds                | `vitest.config.ts`                                                                                        | `Completed`   |
| Multiplayer hook recovery        | Heartbeat timeout, reconnect, late host decisions, checksum-triggered recovery in hooks   | Deterministic hook-level tests                                | Not yet implemented                                                                                       | `In Progress` |
| Desktop end-to-end failure flows | IPC failure, updater notification flow, network interruption in a running Electron window | Desktop harness test                                          | Not yet implemented                                                                                       | `In Progress` |
