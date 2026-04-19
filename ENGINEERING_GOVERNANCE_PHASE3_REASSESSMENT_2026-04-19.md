# Engineering Governance Phase 3 Reassessment

Reassessment date: `2026-04-19`

Scope: hotspot evidence, hook orchestration coverage, and Electron runtime fault-injection from `ENGINEERING_GOVERNANCE_9_OF_10_AUDIT_PLAN_2026-04-19.md`

## Delivered in Phase 3

- Added `src/logic/__tests__/gameReducerRouting.test.ts` to exercise bootstrap validation, reducer routing, undo/redo online guardrails, rollback behavior, and fallback handling inside `src/logic/gameReducer.ts`.
- Added `src/logic/actions/__tests__/marketActions.phase3.test.ts` to cover the previously weakest market branches: instant-win joker auto-buy, pending joker flow, unaffordable buys, reserved cleanup, extra level-3 removal, blocked ability branches, and reserve-deck success / limit rejection.
- Added `src/logic/__tests__/networkProtocolMatrix.test.ts` to round-trip every guest-safe command shape, both bootstrap command kinds, both `REPLENISH` payload forms, and role-direction inbound message checks in `src/logic/networkProtocol.ts`.
- Added `src/hooks/__tests__/useOnlineManager.test.tsx` to cover manager composition, peer lifecycle, connection lifecycle, outbound protocol helpers, and recovery-request emission for `src/hooks/useOnlineManager.ts`.
- Extracted `electron/runtimeHarness.js` from `electron/main.js` so IPC authorization, updater wiring, renderer send guards, and window lifecycle instrumentation are dependency-injected and testable.
- Added `electron/__tests__/runtimeHarness.test.ts` to exercise `WINDOW_LOAD_FAILED`, unauthorized IPC rejection, updater check failure, updater failure threshold reset, and guarded `restart_app` installation flow.
- Expanded `npm run test:security` so the runtime harness and `useOnlineManager` are part of the governance regression suite rather than living only in broad test coverage.
- Raised `vitest.config.ts` governance scope to include `src/hooks/useOnlineManager.ts` and `electron/runtimeHarness.js`, then raised global thresholds from `70/70/75/60` to `85/85/90/80` for statements / lines / functions / branches.

## Verification Evidence

| Check                   | Result | Notes                                                                   |
| ----------------------- | ------ | ----------------------------------------------------------------------- |
| `npm run lint`          | Passed | No lint or formatting violations                                        |
| `npm run deps:check`    | Passed | Production audit summary stayed `0/0/0/0/0`                             |
| `npm run test:security` | Passed | `11` governance/security-focused files, `49` tests                      |
| `npm test`              | Passed | `45` test files / `250` tests passed                                    |
| `npm run release:check` | Passed | Release-health checklist gate still matched live contract               |
| `npm run desktop:check` | Passed | Electron governance drift audit green after runtime harness extraction  |
| `npm run test:coverage` | Passed | `Statements 87.56% / Branches 80.80% / Functions 90.98% / Lines 87.56%` |
| `npm run build`         | Passed | Production build succeeded; bundle-size warning remains non-blocking    |

Coverage delta vs. Phase 2 reassessment:

- Statements: `81.07% -> 87.56%`
- Branches: `68.57% -> 80.80%`
- Functions: `88.88% -> 90.98%`
- Lines: `81.07% -> 87.56%`

## Updated Engineering Scores

| Dimension                             | Before   | After    | Rationale                                                                                                                                             |
| ------------------------------------- | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Correctness                           | `8.6/10` | `9.0/10` | Reducer routing, market edge cases, and protocol matrices now cover the previously under-tested failure paths that most directly affected correctness |
| Boundary Security                     | `8.8/10` | `9.0/10` | Runtime IPC rejection and recovery paths are now exercised in tests, not just documented and statically gated                                         |
| State Machine Consistency             | `8.8/10` | `9.0/10` | `gameReducer.ts` now has branch-level proof for bootstrap rejection, rollback, and online-mode restrictions                                           |
| Online Authority                      | `8.9/10` | `9.1/10` | `useOnlineManager` now has deterministic tests for peer readiness, outbound protocol emission, and connection lifecycle                               |
| Electron Security                     | `8.7/10` | `9.0/10` | The runtime harness closes the biggest remaining gap from Phase 2 by proving runtime fail-load / updater / sender-authorization behavior              |
| Architecture Layering                 | `8.7/10` | `8.9/10` | `electron/main.js` is thinner and more testable, but the broader App / domain / type layering backlog still exists                                    |
| Type Contracts                        | `8.7/10` | `8.8/10` | Protocol command round-tripping is now much stronger, though schema-first migration and deeper contract splits are still incomplete                   |
| Test Coverage                         | `8.8/10` | `9.3/10` | Coverage gates are materially higher and now backed by hotspot, hook, and runtime harness evidence rather than broad averages alone                   |
| Observability / Operations            | `7.6/10` | `7.9/10` | Runtime harness assertions strengthen release-health evidence, but SLOs, alert thresholds, and drill artifacts remain future work                     |
| Dependency / Configuration Governance | `8.3/10` | `8.4/10` | Governance checks remain green and broader security tests now run, but SBOM/license/secret scanning is still outside the active scope                 |

### Reassessed total

`8.8/10 -> 9.0/10`

## Phase 3 Status

| Plan Item                                             | Status      | Notes                                                                                           |
| ----------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| `5.1` Runtime fault-injection harness                 | `Completed` | `electron/runtimeHarness.js` and `electron/__tests__/runtimeHarness.test.ts` landed             |
| `8.1` Hotspot coverage uplift                         | `Completed` | `gameReducer.ts`, `marketActions.ts`, and `networkProtocol.ts` now have dedicated Phase 3 tests |
| `8.2` Hook orchestration coverage                     | `Completed` | `src/hooks/__tests__/useOnlineManager.test.tsx` added                                           |
| `8.3` Higher governance thresholds + runtime coverage | `Completed` | `vitest.config.ts` thresholds raised to `85/85/90/80`; security suite expanded                  |

## Residual Risks

1. `electron/runtimeHarness.js` now exists and is exercised for the highest-risk runtime paths, but its file-level statement coverage is still only `61.53%`, so there is room to add more updater/window lifecycle scenarios.
2. `src/hooks/useGameNetwork.ts` remains the lowest-covered included hook at `68.70%` statements / `48.27%` branches, even though its most critical recovery paths are already protected.
3. `electron/main.js` runtime hardening improved, but bundle governance is still carrying a non-blocking Vite warning for the main chunk (`733.73 kB`), which should be treated as the next operational cleanup item.
4. Architecture and contract splitting work from Phase 1 is not fully finished, so the repo is now at `9.0/10` through evidence strength rather than through complete structural simplification.

## Recommended Next Steps

1. Start Phase 4 by adding release-health export artifacts and SLO / alert threshold documents so Observability can stop being the lowest-scoring dimension.
2. Extend runtime harness scenarios to cover updater progress / downloaded flows and renderer-unavailable branches, which should lift `electron/runtimeHarness.js` from partial to strong file-level coverage.
3. Keep trimming `useGameNetwork.ts` and broader type contracts so the `9.0/10` score becomes easier to sustain without relying on ever-larger test matrices.
