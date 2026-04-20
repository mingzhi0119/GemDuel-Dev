# Engineering Governance Phase A Reassessment

Audit date: `2026-04-19`

Scope: reassessment for Phase A in `ENGINEERING_GOVERNANCE_9_5_OF_10_AUDIT_PLAN_2026-04-19.md`

Conclusion: Phase A is complete. The multiplayer orchestration hotspot is now split across pure policy/recovery modules, and the project moves from `9.3/10` to `9.4/10`.

## Phase A Delivered

- Extracted guest/host dispatch planning into `src/logic/networkDispatchPolicy.ts`, including `resolveNetworkDispatchPlan`, `createGuestIntentRequestId`, and `shouldSendHostStateSync`.
- Extracted bootstrap verification and host-decision recovery review into `src/logic/networkRecovery.ts`, so checksum and stale-packet decisions are no longer embedded only inside the React hook.
- Added `PendingGuestIntent` to `src/types/network.ts`, making the pending intent queue an explicit shared contract instead of a hook-local anonymous shape.
- Reworked `src/hooks/useGameNetwork.ts` so it now delegates bootstrap review, host-decision review, and guest dispatch branching to pure logic modules while keeping React-specific refs and side effects local.
- Added `src/logic/__tests__/networkDispatchPolicy.test.ts` and `src/logic/__tests__/networkRecovery.test.ts`, and expanded `src/hooks/__tests__/useGameNetwork.test.tsx` to cover host approval, authoritative sync clearing, and bootstrap broadcast routing.
- Extended `vitest.config.ts` coverage governance so the new Phase A logic modules are included in the audited coverage surface.

## Verification Evidence

| Check                   | Result | Notes                                                                                     |
| ----------------------- | ------ | ----------------------------------------------------------------------------------------- |
| `npm run lint`          | Passed | Refactor and new tests are lint-clean                                                     |
| `npm run deps:check`    | Passed | Production audit summary remained `0/0/0/0/0`                                             |
| `npm run desktop:check` | Passed | Electron desktop governance snapshot still matches policy                                 |
| `npm run release:check` | Passed | Release-health checklist, SLO snapshot, and drill assets stayed aligned                   |
| `npm run test:security` | Passed | `11` governance/security-focused files, `52` tests                                        |
| `npm run test:coverage` | Passed | `Statements 89.58% / Branches 82.61% / Functions 92.46% / Lines 89.58%`                   |
| `npm run build`         | Passed | Production build succeeded; large-chunk warning remains and moved slightly to `736.18 kB` |

## Evidence Delta

| Evidence area                        | Baseline before Phase A         | After Phase A                   | Audit reading                                                            |
| ------------------------------------ | ------------------------------- | ------------------------------- | ------------------------------------------------------------------------ |
| Overall audited coverage             | `88.29 / 81.65 / 92.08 / 88.29` | `89.58 / 82.61 / 92.46 / 89.58` | Coverage improved without relaxing thresholds                            |
| `src/hooks/useGameNetwork.ts`        | `68.70 / 48.27 / 100 / 68.70`   | `80.40 / 74.19 / 100 / 80.40`   | Phase A materially reduced the weakest multiplayer hotspot               |
| `src/logic/networkRecovery.ts`       | New file                        | `100 / 89.47 / 100 / 100`       | Recovery review is now independently testable and strongly covered       |
| `src/logic/networkDispatchPolicy.ts` | New file                        | `98.36 / 78.94 / 100 / 98.36`   | Dispatch routing is now explicit policy instead of buried hook branching |

## Reassessed Engineering Scores

| Dimension                             | 9.5 plan baseline | Phase A  | Reassessment rationale                                                                                                        |
| ------------------------------------- | ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Correctness                           | `9.0/10`          | `9.2/10` | Bootstrap review and host-decision recovery are now pure, directly tested decision layers                                     |
| Boundary Security                     | `9.1/10`          | `9.1/10` | Boundary posture stayed strong, but Phase A did not yet add boundary registry drift enforcement                               |
| State Machine Consistency             | `9.0/10`          | `9.2/10` | Guest dispatch and host-decision routing now rely less on ad hoc hook branching and more on pure policy                       |
| Online Authority                      | `9.1/10`          | `9.3/10` | Multiplayer authority review, pending intent lifecycle, and recovery handling now have stronger direct evidence               |
| Electron Security                     | `9.2/10`          | `9.2/10` | No regression, but the runtime harness hotspot remains the next desktop proof gap                                             |
| Architecture Layering                 | `9.1/10`          | `9.3/10` | `useGameNetwork` no longer owns the full orchestration decision tree by itself                                                |
| Type Contracts                        | `9.1/10`          | `9.2/10` | Pending intent state and recovery-review outputs are now explicit, shareable contracts                                        |
| Test Coverage                         | `9.4/10`          | `9.4/10` | The weakest Phase A hotspot improved sharply, but `runtimeHarness.js` and action hotspots still hold this below the next band |
| Observability / Operations            | `9.2/10`          | `9.2/10` | Existing release-health instrumentation survived the refactor intact                                                          |
| Dependency / Configuration Governance | `9.3/10`          | `9.3/10` | Governance gates remain green, but short-lived TURN credentials are still unfinished                                          |

### Reassessed total

`9.3/10 -> 9.4/10`

## Phase A Seal Review

| Seal criterion                                                              | Status      | Evidence                                                             |
| --------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------- |
| `useGameNetwork` no longer owns the full bootstrap + recovery decision tree | `Completed` | `src/logic/networkDispatchPolicy.ts`, `src/logic/networkRecovery.ts` |
| Recovery review exists as a pure service layer                              | `Completed` | `reviewBootstrapReceipt`, `reviewGuestHostDecision`                  |
| Hook-level multiplayer evidence increased                                   | `Completed` | Expanded `src/hooks/__tests__/useGameNetwork.test.tsx`               |
| The weakest Phase A hotspot no longer sits at `48.27%` branch coverage      | `Completed` | `src/hooks/useGameNetwork.ts` branch coverage improved to `74.19%`   |
| Independent reassessment artifact exists                                    | `Completed` | This document                                                        |

## Residual Risks

1. `electron/runtimeHarness.js` remains a low-coverage operational hotspot at `61.53%` statements and is still the biggest Electron proof gap.
2. `src/logic/actions/boardActions.ts` and `src/logic/actions/marketActions.ts` remain the next correctness/test-governance hotspots.
3. TURN credentials are still runtime-injected rather than short-lived authenticated credentials.
4. The main bundle warning remains and slightly increased to `736.18 kB`, so Phase D performance closure is still required.

## Recommended Next Steps

1. Move to Phase B and formalize boundary registry drift checks plus structured reason-code contracts across boundary failures.
2. Queue `runtimeHarness.js`, `boardActions.ts`, and `marketActions.ts` as the next hotspot set once Phase B is stable.
3. Keep the short-lived TURN credential project as the highest-value unfinished governance item outside the current codebase.
