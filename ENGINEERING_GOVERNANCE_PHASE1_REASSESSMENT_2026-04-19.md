# Engineering Governance Phase 1 Reassessment

Reassessment date: `2026-04-19`

Scope: structural convergence from `ENGINEERING_GOVERNANCE_9_OF_10_AUDIT_PLAN_2026-04-19.md`

## Delivered in Phase 1

- `src/App.tsx` reduced from `744` lines to `81` lines and now acts as an assembly root.
- New app shell modules added under `src/app/**` for runtime config, replay IO, route branching, chrome, overlays, and main shell layout.
- `src/hooks/useOnlineManager.ts` reduced from `454` lines to `232` lines, with peer lifecycle and message routing extracted into `src/hooks/onlineManager/**`.
- `src/logic/actionValidation.ts` reduced from `834` lines to a `3` line facade over dedicated guard, rule, and network validation modules.
- `src/types.ts` reduced from `560` lines to a `2` line barrel re-exporting `src/types/domain.ts` and `src/types/desktop.ts`.
- Added `ARCHITECTURE_LAYER_MAP.md` as an auditable layer boundary artifact.

## Verification Evidence

| Check                   | Result | Notes                                                                      |
| ----------------------- | ------ | -------------------------------------------------------------------------- |
| `npm run lint`          | Passed | No lint or formatting violations after refactor                            |
| `npm test`              | Passed | `34` test files / `197` tests passed                                       |
| `npm run desktop:check` | Passed | Electron governance gate still green                                       |
| `npm run test:coverage` | Passed | `Statements 79.14% / Branches 68.69% / Functions 84.78% / Lines 79.14%`    |
| `npm run build`         | Passed | Production build succeeded; chunk-size warning remains but is non-blocking |

Coverage delta vs. audit baseline:

- Statements: `75.07% -> 79.14%`
- Branches: `64.65% -> 68.69%`
- Functions: `83.10% -> 84.78%`
- Lines: `75.07% -> 79.14%`

## Updated Engineering Scores

| Dimension                             | Before | After    | Rationale                                                                                                                                                               |
| ------------------------------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Correctness                           | `8/10` | `8.5/10` | Rule rejection logic is now isolated from protocol parsing and easier to reason about, but a dedicated domain-rules service is still not fully separate from validation |
| Boundary Security                     | `8/10` | `8/10`   | Protocol parsing boundaries are cleaner, but boundary inventory and secure replay/file wrappers are still pending                                                       |
| State Machine Consistency             | `8/10` | `8/10`   | Existing FSM gate remains intact; Phase 1 did not yet land the single declarative transition matrix                                                                     |
| Online Authority                      | `8/10` | `8.5/10` | Multiplayer orchestration is less coupled after splitting peer lifecycle and connection routing, but hook-level recovery tests are still missing                        |
| Electron Security                     | `8/10` | `8/10`   | Governance gate remains healthy; no new runtime fault-injection evidence was added in this phase                                                                        |
| Architecture Layering                 | `7/10` | `8.5/10` | App root, online manager, validation facade, and type barrel are now layered with explicit module boundaries and a layer map                                            |
| Type Contracts                        | `8/10` | `8.5/10` | Domain and desktop contracts are now separated, but schema-first migration of remaining handwritten guards is incomplete                                                |
| Test Coverage                         | `8/10` | `8.5/10` | Overall coverage improved materially, but hotspot goals for `gameReducer.ts`, `marketActions.ts`, and `networkProtocol.ts` are not yet met                              |
| Observability / Operations            | `7/10` | `7/10`   | Existing observability remains intact; Phase 1 did not add SLOs, exports, or drills                                                                                     |
| Dependency / Configuration Governance | `8/10` | `8/10`   | Governance baseline remains stable; SBOM/license/secret gates are still future work                                                                                     |

### Reassessed total

`8.2/10 -> 8.5/10`

## Phase 1 Status

| Plan Item                                                              | Status        | Notes                                                                                          |
| ---------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------- |
| `6.1` Split `src/App.tsx`                                              | `Completed`   | App root moved to `src/app/**` shell modules                                                   |
| `6.2` Split `actionValidation.ts` / `useOnlineManager.ts` / `types.ts` | `Completed`   | New `actionValidation`, `onlineManager`, and `types` submodules landed                         |
| `6.3` Produce architecture layer map                                   | `Completed`   | `ARCHITECTURE_LAYER_MAP.md` added                                                              |
| `7.1` Split `src/types.ts` into layered contracts                      | `Completed`   | Domain and desktop contracts separated                                                         |
| `1.1` Extract unified rule layer                                       | `In Progress` | Rule validation is isolated, but a dedicated domain rules service is still the next refinement |

## Recommended Next Steps

1. Start Phase 2 with the declarative FSM policy and boundary inventory work, because those are now easier to place cleanly in the new structure.
2. Use Phase 3 to add hook tests for `src/hooks/onlineManager/**` and hotspot coverage for `gameReducer.ts`, `marketActions.ts`, and `networkProtocol.ts`.
3. Consider one more `GameShell` split in a follow-up to separate the play surface from the player rail composition.
