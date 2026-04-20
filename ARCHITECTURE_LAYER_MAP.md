# Gem Duel Architecture Layer Map

Last updated: `2026-04-19`

## Layer Boundaries

| Layer                   | Responsibility                                                               | Representative Paths                                                                                                             | Allowed Downstream Dependencies                                   |
| ----------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `UI / App Shell`        | Route selection, layout composition, overlays, desktop-facing shell behavior | `src/App.tsx`, `src/app/**`, `src/components/**`, `src/types/ui.ts`                                                              | `Hooks`, `Domain selectors/types`, `Desktop contract`             |
| `Hooks / Orchestration` | React state orchestration, multiplayer coordination, runtime side effects    | `src/hooks/**`                                                                                                                   | `Domain logic`, `Network protocol`, `Desktop observability/types` |
| `Domain Logic`          | Rules, reducer transitions, replay validation, FSM and authority checks      | `src/logic/**`                                                                                                                   | `Domain types`, `runtimeSchemas`, pure utilities                  |
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

## Follow-on Work

1. Continue shrinking `src/hooks/useGameNetwork.ts` so protocol translation and recovery reporting move further toward helper modules.
2. Continue moving high-risk action rules from handler-adjacent logic into dedicated domain services.
3. Add hook-level tests for `src/app/io/useReplayIO.ts` and any new shell-level composition helpers.
