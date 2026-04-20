# Engineering Governance Phase B Reassessment

Audit date: `2026-04-19`

Scope: reassessment for Phase B in `ENGINEERING_GOVERNANCE_9_5_OF_10_AUDIT_PLAN_2026-04-19.md`

Conclusion: Phase B is complete. Boundary governance is now machine-readable, fail-closed boundary failures share explicit contracts across the main external inputs, and the desktop runtime now prefers governed relay profiles before legacy ICE fallback. The project moves from `9.4/10` to `9.45/10`.

## Phase B Delivered

- Added a machine-readable boundary source of truth in `governance/boundary-registry.snapshot.json`, covering all ten governed external entry surfaces with owners, validators, reason codes, runtime signals, and test references.
- Added `scripts/boundaryGovernance.js`, `scripts/check-boundary-governance.mjs`, and `scripts/__tests__/boundaryGovernance.test.ts`, so boundary drift is now CI-enforced instead of remaining a document-only convention.
- Added explicit shared contracts in `src/types/boundary.ts` and `src/types/runtime.ts`, and exported them through `src/types.ts`.
- Reworked `src/app/io/safeReplayImport.ts` to return governed `BoundaryFailure` results with explicit `boundaryId`, `code`, and runtime signal metadata for local-file and replay-schema rejection paths.
- Reworked `src/logic/networkMessageValidation.ts` to expose `parseNetworkMessageBoundary`, making malformed network payload rejection a typed boundary contract instead of a nullable-only drop path.
- Tightened guest dispatch reason contracts in `src/logic/networkDispatchPolicy.ts`, so multiplayer dispatch blocks now reuse explicit governed reason codes.
- Added the governed relay-profile path across `electron/runtimeConfig.js`, `electron/main.js`, `electron/preloadContract.cjs`, `src/app/runtime/useRuntimeAppConfig.ts`, `src/config/webrtc.ts`, and `src/types/desktop.ts`.
- Extended desktop governance assets with `getRuntimeRelayProfile` in `ELECTRON_IPC_ALLOWLIST.md`, `electron/governance/desktop-policy.snapshot.json`, and the Electron governance tests.
- Updated `BOUNDARY_INVENTORY.md`, `DEPENDENCY_RUNTIME_GOVERNANCE.md`, `.github/workflows/governance.yml`, `.github/workflows/build.yml`, and `package.json` so the new registry, relay-profile contract, and CI gate are all part of the audited release path.

## Verification Evidence

| Check                      | Result | Notes                                                                                          |
| -------------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| `npm run boundaries:check` | Passed | Boundary registry snapshot, file refs, and inventory doc stayed aligned across `10` boundaries |
| `npm run lint`             | Passed | New contracts, scripts, docs, and tests are lint-clean                                         |
| `npm run deps:check`       | Passed | Production audit summary remained `0/0/0/0/0`                                                  |
| `npm run desktop:check`    | Passed | Electron allowlist, bridge surface, and audited desktop snapshot stayed aligned                |
| `npm run release:check`    | Passed | Release-health checklist and operations assets remained green                                  |
| `npm run test:security`    | Passed | `13` governance/security-focused files, `58` tests                                             |
| `npm test`                 | Passed | `50` files, `286` tests                                                                        |
| `npm run test:coverage`    | Passed | `Statements 89.47% / Branches 82.45% / Functions 92.25% / Lines 89.47%`                        |
| `npm run build`            | Passed | Production build succeeded; main chunk warning remains and moved to `740.11 kB`                |

## Evidence Delta

| Evidence area                    | Phase A baseline                | After Phase B                   | Audit reading                                                                 |
| -------------------------------- | ------------------------------- | ------------------------------- | ----------------------------------------------------------------------------- |
| Boundary registry posture        | Documented only                 | Machine-readable + CI-enforced  | Boundary governance is now auditably drift-checked                            |
| Replay / network rejection paths | Mixed ad hoc return contracts   | Shared `BoundaryFailure` model  | The two highest-value non-Electron input boundaries now fail closed uniformly |
| Desktop relay runtime contract   | Legacy ICE list only            | Governed relay profile bridge   | Runtime relay policy can now prefer ephemeral TURN bundles before legacy ICE  |
| Desktop IPC governance surface   | No relay-profile bridge audit   | Allowlist + snapshot + tests    | New Electron capability cannot land without governance asset updates          |
| Overall audited coverage         | `89.58 / 82.61 / 92.46 / 89.58` | `89.47 / 82.45 / 92.25 / 89.47` | Coverage stayed in the governance band while boundary and runtime scope grew  |

## Reassessed Engineering Scores

| Dimension                             | Phase A baseline | Phase B  | Reassessment rationale                                                                                                   |
| ------------------------------------- | ---------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| Correctness                           | `9.2/10`         | `9.2/10` | Correctness did not regress, but Phase B was primarily about contracts and governance rather than logic hotspots         |
| Boundary Security                     | `9.1/10`         | `9.4/10` | The project now has a registry-backed, CI-enforced mapping from boundary to validator, owner, tests, and runtime signals |
| State Machine Consistency             | `9.2/10`         | `9.2/10` | Phase-sensitive ownership is still primarily a Phase C concern                                                           |
| Online Authority                      | `9.3/10`         | `9.4/10` | Multiplayer runtime bootstrap now prefers governed relay profiles and records fallback posture explicitly                |
| Electron Security                     | `9.2/10`         | `9.3/10` | The new relay-profile bridge is now allowlisted, snapshotted, and checked like the rest of the preload surface           |
| Architecture Layering                 | `9.3/10`         | `9.3/10` | Boundary and runtime contracts improved, but the remaining large hotspots are still the next layering target             |
| Type Contracts                        | `9.2/10`         | `9.4/10` | Replay, network-message, guest-dispatch, relay-profile, and desktop bridge contracts are now more explicit and shareable |
| Test Coverage                         | `9.4/10`         | `9.4/10` | Coverage stayed above the governance threshold, but runtime harness and action hotspots still cap the next jump          |
| Observability / Operations            | `9.2/10`         | `9.3/10` | Boundary/runtime failures now map more cleanly to governed runtime signals and release-health evidence                   |
| Dependency / Configuration Governance | `9.3/10`         | `9.4/10` | TURN bundle ownership, fallback policy, and bridge exposure are now documented and enforced end-to-end                   |

### Reassessed total

`9.4/10 -> 9.45/10`

## Phase B Seal Review

| Seal criterion                                                               | Status      | Evidence                                                                      |
| ---------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------- |
| Every governed external boundary has a machine-readable registry entry       | `Completed` | `governance/boundary-registry.snapshot.json`                                  |
| Boundary registry drift fails CI and local governance checks                 | `Completed` | `scripts/check-boundary-governance.mjs`, workflow updates, package scripts    |
| Replay and network-message rejection paths share explicit boundary contracts | `Completed` | `src/types/boundary.ts`, `safeReplayImport.ts`, `networkMessageValidation.ts` |
| Runtime relay bootstrap prefers the governed relay profile before legacy ICE | `Completed` | `electron/runtimeConfig.js`, `src/app/runtime/useRuntimeAppConfig.ts`         |
| Electron governance assets cover the new relay-profile bridge surface        | `Completed` | `ELECTRON_IPC_ALLOWLIST.md`, desktop snapshot, preload/desktop tests          |
| Independent reassessment artifact exists                                     | `Completed` | This document                                                                 |

## Residual Risks

1. `electron/runtimeHarness.js` remains a low-coverage operational hotspot at `61.53%` statements and is still the largest Electron evidence gap.
2. `src/logic/actions/boardActions.ts` and `src/logic/actions/marketActions.ts` remain the next correctness/test-governance hotspots at `66.66%` and `75.00%` branch coverage.
3. The short-lived TURN program is still blocked on a backend that can mint, rotate, and revoke authenticated credentials; Phase B only completed the in-repo client contract and integration plan.
4. The production build still emits a large-chunk warning at `740.11 kB`, so Phase D bundle-budget closure remains necessary.

## Recommended Next Steps

1. Move to Phase C and expand runtime drill evidence plus release-health artifact retention.
2. Queue `electron/runtimeHarness.js`, `boardActions.ts`, and `marketActions.ts` as the next hotspot bundle for test-governance closure.
3. Keep the TURN credential backend project and `scripts/patch-peer.js` exception retirement on the dependency-governance track.
