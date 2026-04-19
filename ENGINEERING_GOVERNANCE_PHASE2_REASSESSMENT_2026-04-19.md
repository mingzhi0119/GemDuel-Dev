# Engineering Governance Phase 2 Reassessment

Reassessment date: `2026-04-19`

Scope: boundary hardening from `ENGINEERING_GOVERNANCE_9_OF_10_AUDIT_PLAN_2026-04-19.md`

## Delivered in Phase 2

- Added `BOUNDARY_INVENTORY.md` to map each external entry surface to an owner, validator, fail-closed behavior, and evidence file.
- Added `src/app/io/safeReplayImport.ts` and moved replay upload handling in `src/app/io/useReplayIO.ts` onto a unified safe local-file boundary with structured error codes for size, type, read, JSON, and schema failures.
- Landed `src/logic/fsmPolicy.ts` as the declarative phase/state policy source and reduced `src/logic/fsm.ts` to a compatibility facade.
- Added matrix coverage in `src/logic/__tests__/fsmPolicyMatrix.test.ts` for phase-sensitive action routing and state integrity preconditions.
- Added `src/logic/hostApproval.ts` to move host approval into a pure service with structured `outcomeCode` / `reasonCode` taxonomy, then wired `src/hooks/useGameNetwork.ts` onto that service.
- Added hook-level deterministic tests in `src/hooks/__tests__/useGameNetwork.test.tsx` and `src/hooks/__tests__/useConnectionHealth.test.tsx` for bootstrap mismatch, stale decisions, checksum mismatch, authority rejection, heartbeat timeout, and heartbeat restore.
- Added machine-readable Electron governance snapshot auditing through `electron/governance/desktop-policy.snapshot.json`, `electron/desktopGovernance.js`, and `scripts/check-electron-governance.mjs`.
- Added `scripts/releaseHealthChecklist.js`, `scripts/check-release-health.mjs`, and PR governance workflow wiring so `test:security`, `release:check`, and `desktop:check` are all auditable CI gates.

## Verification Evidence

| Check                   | Result | Notes                                                                   |
| ----------------------- | ------ | ----------------------------------------------------------------------- |
| `npm run lint`          | Passed | No lint or formatting violations                                        |
| `npm run deps:check`    | Passed | Production audit summary stayed `0/0/0/0/0`                             |
| `npm run test:security` | Passed | `9` governance/security-focused files, `40` tests                       |
| `npm test`              | Passed | `40` test files / `220` tests passed                                    |
| `npm run release:check` | Passed | Checklist command gate and indicator inventory matched live contract    |
| `npm run desktop:check` | Passed | Electron static governance + snapshot drift audit green                 |
| `npm run test:coverage` | Passed | `Statements 81.07% / Branches 68.57% / Functions 88.88% / Lines 81.07%` |
| `npm run build`         | Passed | Production build succeeded; bundle-size warning remains non-blocking    |

Coverage delta vs. Phase 1 reassessment:

- Statements: `79.14% -> 81.07%`
- Branches: `68.69% -> 68.57%`
- Functions: `84.78% -> 88.88%`
- Lines: `79.14% -> 81.07%`

## Updated Engineering Scores

| Dimension                             | Before   | After    | Rationale                                                                                                                                   |
| ------------------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Correctness                           | `8.5/10` | `8.6/10` | Replay import and approval decisions now fail with structured reasons, but hotspot reducer/rule coverage is still the main gap              |
| Boundary Security                     | `8.0/10` | `8.8/10` | Boundary inventory, safe replay IO wrapper, PR security suite, and stricter network reason-code parsing materially improved hardening       |
| State Machine Consistency             | `8.0/10` | `8.8/10` | `fsmPolicy.ts` is now the auditable policy source and phase-sensitive matrix tests are in place, though some handler-level coupling remains |
| Online Authority                      | `8.5/10` | `8.9/10` | Host approval is now pure and structured, with hook-level recovery tests covering the most important deterministic failure paths            |
| Electron Security                     | `8.0/10` | `8.7/10` | Snapshot drift auditing and checklist scripting strengthen governance, but a fuller runtime fault-injection harness is still missing        |
| Architecture Layering                 | `8.5/10` | `8.7/10` | Replay IO, FSM policy, and host approval responsibilities are cleaner and more isolated than in Phase 1                                     |
| Type Contracts                        | `8.5/10` | `8.7/10` | Approval/recovery taxonomy is now explicitly modeled, but remaining handwritten domain guards still block a true schema-first score         |
| Test Coverage                         | `8.5/10` | `8.8/10` | Hooks, governance scripts, and new policy modules are now covered, and total statements crossed `80%`, though branches remain sub-`70%`     |
| Observability / Operations            | `7.0/10` | `7.6/10` | Release-health checklist is now machine-checked and CI-enforced, but SLOs, alerts, and drill artifacts are still pending                    |
| Dependency / Configuration Governance | `8.0/10` | `8.3/10` | Governance gates are now exercised in PR CI alongside release gates, but SBOM/license/secret scanning remains future work                   |

### Reassessed total

`8.5/10 -> 8.8/10`

## Phase 2 Status

| Plan Item                                                    | Status        | Notes                                                                  |
| ------------------------------------------------------------ | ------------- | ---------------------------------------------------------------------- |
| `2.1` Boundary inventory                                     | `Completed`   | `BOUNDARY_INVENTORY.md` added                                          |
| `2.2` Safe replay / local file boundary                      | `Completed`   | `safeReplayImport.ts` and replay IO wrapper landed                     |
| `2.3` PR security regression gate                            | `Completed`   | `.github/workflows/governance.yml` plus `npm run test:security` added  |
| `3.1` Declarative phase/action policy                        | `Completed`   | `src/logic/fsmPolicy.ts` is the main policy source                     |
| `3.2` Lift scattered phase assumptions into the policy layer | `In Progress` | Core phase/state invariants moved, but some handlers still own detail  |
| `3.3` Phase-sensitive matrix tests                           | `Completed`   | `fsmPolicyMatrix.test.ts` added                                        |
| `4.1` Pure host approval service                             | `Completed`   | `src/logic/hostApproval.ts` added                                      |
| `4.2` Hook-level recovery / heartbeat tests                  | `Completed`   | `useGameNetwork` and `useConnectionHealth` coverage added              |
| `4.3` Structured approval log and recovery taxonomy          | `Completed`   | `outcomeCode` / `reasonCode` modeled in `src/types/network.ts`         |
| `5.1` Runtime fault-injection harness                        | `In Progress` | Snapshot/runtime drift evidence improved, but not yet full E2E harness |
| `5.2` Scripted release-health checklist gate                 | `Completed`   | `release:check` added and wired into CI                                |
| `5.3` Machine-readable preload / allowlist drift audit       | `Completed`   | Snapshot artifact added under `electron/governance/`                   |

## Recommended Next Steps

1. Start Phase 3 by lifting `gameReducer.ts`, `marketActions.ts`, and `networkProtocol.ts` to the new hotspot coverage targets, because those now dominate the gap to `9/10`.
2. Finish `5.1` with an Electron runtime harness that exercises fail-load and update-edge paths instead of relying primarily on static/config drift checks.
3. Continue `3.2` by moving the remaining handler-owned phase assumptions into domain policy helpers so `useGameNetwork` and action handlers keep slimming down.
