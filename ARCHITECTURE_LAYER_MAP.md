# Gem Duel Architecture Layer Map

Last updated: `2026-04-19`

## Layer Boundaries

| Layer                   | Responsibility                                                               | Representative Paths                                                                                                             | Allowed Downstream Dependencies                                   |
| ----------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `UI / App Shell`        | Route selection, layout composition, overlays, desktop-facing shell behavior | `src/App.tsx`, `src/app/**`, `src/components/**`, `src/types/ui.ts`                                                              | `Hooks`, `Domain selectors/types`, `Desktop contract`             |
| `Hooks / Orchestration` | React state orchestration, multiplayer coordination, runtime side effects    | `src/hooks/**`                                                                                                                   | `Domain logic`, `Network protocol`, `Desktop observability/types` |
| `Domain Logic`          | Rules, reducer transitions, replay validation, FSM and authority checks      | `src/logic/**`                                                                                                                   | `Domain types`, `runtimeSchemas`, `pure utilities`                |
| `Network Contract`      | Protocol DTOs, message parsing, online direction checks, checksums           | `src/types/network.ts`, `src/logic/networkProtocol.ts`, `src/logic/networkMessageValidation.ts`, `src/logic/networkChecksums.ts` | `Domain types`, `Domain validation guards`                        |
| `Desktop Platform`      | Electron main/preload/runtime config and governance checks                   | `electron/**`, `scripts/check-electron-governance.mjs`, `src/types/desktop.ts`                                                   | Shared runtime policy, observability                              |

## Phase 1 Refactor Outcome

| Concern              | Before                                                                                 | After                                                                                                                                                                       | Impact                                                              |
| -------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| App root             | `src/App.tsx` mixed runtime init, replay IO, route branching, overlays, layout shell   | `src/App.tsx` is a small assembly root; `src/app/**` owns runtime/app shell concerns, and `GameShell` now composes `GamePlaySurface` + `PlayerRail`                         | UI boundary is now explicit and auditable                           |
| Online orchestration | `src/hooks/useOnlineManager.ts` mixed peer lifecycle, message routing, transport API   | `src/hooks/useOnlineManager.ts` is a thin facade over `src/hooks/onlineManager/**`                                                                                          | Hook responsibilities are narrower and easier to test               |
| Runtime validation   | `src/logic/actionValidation.ts` mixed payload guards, network parsing, rejection rules | Guards live in `src/logic/actionValidation/guards.ts`, rejection rules in `src/logic/actionValidation/rules.ts`, network parsing in `src/logic/networkMessageValidation.ts` | Validation paths now align with domain vs. protocol boundaries      |
| Type contracts       | `src/types.ts` mixed domain state and `window.electron` bridge                         | `src/types/domain.ts`, `src/types/network.ts`, `src/types/desktop.ts`, `src/types/ui.ts`, root barrel `src/types.ts`                                                        | Domain, network, desktop, and UI contracts now evolve independently |

## Dependency Rules

1. `src/app/**` should not implement domain validation directly; it consumes hooks and domain APIs.
2. `src/hooks/**` may orchestrate side effects, but protocol parsing belongs in `src/logic/networkMessageValidation.ts`.
3. `src/logic/**` should depend on `src/types/domain.ts` contracts rather than renderer-only concerns.
4. `src/types/desktop.ts` is the only place that declares the `window.electron` bridge contract.
5. New multiplayer message shapes should update both `src/types/network.ts` and `src/logic/networkMessageValidation.ts`.
6. Phase-sensitive action ownership lives in `src/logic/fsmPolicy.ts`; hooks, handlers, routes, overlays, and components may only consume FSM-derived helpers and must not re-interpret phase rules inline.

## Phase Ownership

- `src/logic/fsmPolicy.ts` is the single source of truth for phase-sensitive action gates, state requirements, and UI-facing phase surface policy.
- `src/logic/actionValidation/rules.ts`, `src/logic/interactionManager.ts`, and `src/hooks/**` may enforce payload or board-state constraints, but any phase predicate must come from the FSM layer.
- `src/app/**` and `src/components/**` may branch on FSM-derived view models such as board interaction mode, market interaction, draft selection, bonus-color selection, and royal selection; they must not hard-code phase strings as an ownership source.
- Every new phase/action/recovery rule must update the FSM matrix and its generated evidence rows before UI or hook code consumes it.

## Evidence

- Matrix source: `src/logic/fsmPolicy.ts`
- Public FSM entry: `src/logic/fsm.ts`
- Command gate enforcement: `src/logic/commandGate.ts`
- Matrix/table-driven evidence: `src/logic/__tests__/fsmPolicyMatrix.test.ts`
- Boundary/property evidence: `src/logic/__tests__/fsmCommandGate.test.ts`, `src/logic/__tests__/propertyBoundaries.test.ts`

## Follow-on Work

1. Continue shrinking `src/hooks/useGameNetwork.ts` so protocol translation and recovery reporting move further toward helper modules.
2. Keep `fsmPolicy` as the ownership layer for phase transitions and surface modes; new phase logic should land as matrix updates plus table/property evidence before it reaches hooks or UI.
3. Add hook-level tests for `src/app/io/useReplayIO.ts` and any new shell-level composition helpers.
