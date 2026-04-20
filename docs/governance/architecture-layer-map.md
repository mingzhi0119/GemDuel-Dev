# Architecture Layer Map

Last updated: `2026-04-20`

## Layers

| Layer                   | Responsibility                                            | Representative Paths                                   | Allowed Dependencies                                        |
| ----------------------- | --------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| `UI / App Shell`        | Screen selection, overlays, layout shell                  | `src/App.tsx`, `src/app/**`, `src/components/**`       | Hooks, domain selectors/types, desktop contract             |
| `Hooks / Orchestration` | Runtime coordination, multiplayer side effects            | `src/hooks/**`                                         | Domain logic, network protocol, desktop observability/types |
| `Domain Logic`          | Rules, reducer transitions, replay validation, FSM policy | `src/logic/**`                                         | Domain types, runtime schemas, pure utilities               |
| `Network Contract`      | DTOs, message parsing, checksums, direction rules         | `src/types/network.ts`, `src/logic/network*.ts`        | Domain types and validation guards                          |
| `Desktop Platform`      | Electron main/preload/runtime config and gates            | `electron/**`, `scripts/check-electron-governance.mjs` | Shared runtime policy, observability                        |

## Hard Rules

1. Phase-sensitive action ownership lives in `src/logic/fsmPolicy.ts`.
2. `src/app/**` and `src/components/**` may consume FSM-derived state, but must not become a second phase source of truth.
3. Protocol parsing belongs in `src/logic/networkMessageValidation.ts`, not in hooks or UI.
4. `src/types/desktop.ts` is the only renderer-side bridge contract file.

## Current Governance Note

The architecture is documented clearly enough for daily work, but the repo still lacks a dedicated CI gate that enforces size and ownership budgets automatically. That is the last major gap called out in the governance archive.
