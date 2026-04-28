# Architecture Layer Map

Last updated: `2026-04-21`
Machine-readable budget contract: this document (`architecture-budget-contract`)

## Layers

| Layer                   | Responsibility                                                                                                                                                                                                               | Representative Paths                                                                   | Warning LOC | Hard LOC | Allowed Dependencies                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------- | -------- | ----------------------------------------------------------- |
| `UI / App Shell`        | Screen selection, overlays, layout shell (includes **Visual Lab**: motion/surface dev tooling under `apps/desktop/src/app/visual-lab/`, gated from production unless `GEMDUEL_ALLOW_VISUAL_LAB` is set at build and runtime) | `apps/desktop/src/App.tsx`, `apps/desktop/src/app/**`, `packages/ui/src/components/**` | `400`       | `500`    | Hooks, domain selectors/types, desktop contract             |
| `Hooks / Orchestration` | Runtime coordination, multiplayer side effects                                                                                                                                                                               | `apps/desktop/src/hooks/**`                                                            | `300`       | `400`    | Domain logic, network protocol, desktop observability/types |
| `Network Contract`      | DTOs, message parsing, checksums, direction rules                                                                                                                                                                            | `packages/shared/src/types/network.ts`, `packages/shared/src/logic/network*.ts`        | `300`       | `400`    | Domain types and validation guards                          |
| `Domain Logic`          | Rules, reducer transitions, replay validation, FSM policy                                                                                                                                                                    | `packages/shared/src/logic/**`                                                         | `400`       | `500`    | Domain types, runtime schemas, pure utilities               |
| `Reference Data`        | Card catalogs, constants, and static rule data                                                                                                                                                                               | `packages/shared/src/data/**`, `packages/shared/src/constants.ts`                      | `400`       | `500`    | Domain logic and shared contracts                           |
| `Shared Contracts`      | Renderer-main bridge and shared policy contracts                                                                                                                                                                             | `packages/shared/src/types/**`, `packages/shared/src/runtimeConfigPolicy.js`           | `400`       | `500`    | Runtime schemas and pure utilities                          |
| `Desktop Platform`      | Electron main/preload/runtime config and gates                                                                                                                                                                               | `apps/desktop/electron/**`                                                             | `400`       | `500`    | Shared runtime policy, observability                        |
| `Governance / Scripts`  | CI gates, artifact export, and offline governance checks                                                                                                                                                                     | `tools/scripts/**`, `tools/governance/**`                                              | `400`       | `500`    | Node-only governance helpers                                |

## Hard Rules

1. Phase-sensitive action ownership lives in `packages/shared/src/logic/fsmPolicy.ts`.
2. `apps/desktop/src/app/**`, `apps/desktop/src/components/**`, and `packages/ui/src/components/**` may consume FSM-derived state, but must not become a second phase source of truth.
3. Protocol parsing belongs in `packages/shared/src/logic/networkMessageValidation.ts`, not in hooks or UI.
4. `packages/shared/src/types/desktop.ts` is the only renderer-side bridge contract file.

## Temporary ADR-backed Hard-limit Exceptions

No active temporary hard-limit exceptions remain. Warnings between the review budget and the hard limit are expected refactor candidates. Hard-limit breaches must be backed by an ADR entry or the governance gate fails.

## Machine-readable Budget Contract

<!-- architecture-budget-contract:start -->

```json
{
    "schemaVersion": 1,
    "layers": [
        {
            "id": "ui-app-shell",
            "label": "UI / App Shell",
            "paths": [
                "apps/desktop/src/App.tsx",
                "apps/desktop/src/app/",
                "packages/ui/src/components/"
            ],
            "warningMaxLines": 400,
            "incidentMaxLines": 500,
            "forbiddenImportPaths": [
                "apps/desktop/electron/",
                "packages/shared/src/logic/networkMessageValidation.ts",
                "packages/shared/src/logic/networkProtocol.ts"
            ]
        },
        {
            "id": "hooks-orchestration",
            "label": "Hooks / Orchestration",
            "paths": ["apps/desktop/src/hooks/"],
            "warningMaxLines": 300,
            "incidentMaxLines": 400,
            "forbiddenImportPaths": ["apps/desktop/electron/"]
        },
        {
            "id": "network-contract",
            "label": "Network Contract",
            "paths": [
                "packages/shared/src/types/network.ts",
                "packages/shared/src/logic/networkChecksums.ts",
                "packages/shared/src/logic/networkDispatchPolicy.ts",
                "packages/shared/src/logic/networkMessageValidation.ts",
                "packages/shared/src/logic/networkProtocol.ts",
                "packages/shared/src/logic/networkRecovery.ts"
            ],
            "warningMaxLines": 300,
            "incidentMaxLines": 400,
            "forbiddenImportPaths": [
                "apps/desktop/src/app/",
                "packages/ui/src/components/",
                "apps/desktop/src/hooks/",
                "apps/desktop/electron/"
            ]
        },
        {
            "id": "domain-logic",
            "label": "Domain Logic",
            "paths": ["packages/shared/src/logic/"],
            "warningMaxLines": 400,
            "incidentMaxLines": 500,
            "forbiddenImportPaths": [
                "apps/desktop/src/app/",
                "packages/ui/src/components/",
                "apps/desktop/src/hooks/",
                "apps/desktop/electron/"
            ]
        },
        {
            "id": "reference-data",
            "label": "Reference Data",
            "paths": ["packages/shared/src/data/", "packages/shared/src/constants.ts"],
            "warningMaxLines": 400,
            "incidentMaxLines": 500,
            "forbiddenImportPaths": ["apps/desktop/electron/"]
        },
        {
            "id": "shared-contracts",
            "label": "Shared Contracts",
            "paths": ["packages/shared/src/types/", "packages/shared/src/runtimeConfigPolicy.js"],
            "warningMaxLines": 400,
            "incidentMaxLines": 500,
            "forbiddenImportPaths": ["apps/desktop/electron/"]
        },
        {
            "id": "desktop-platform",
            "label": "Desktop Platform",
            "paths": ["apps/desktop/electron/"],
            "warningMaxLines": 400,
            "incidentMaxLines": 500,
            "forbiddenImportPaths": [
                "apps/desktop/src/app/",
                "packages/ui/src/components/",
                "apps/desktop/src/hooks/"
            ]
        },
        {
            "id": "governance-scripts",
            "label": "Governance / Scripts",
            "paths": ["tools/scripts/", "tools/governance/"],
            "warningMaxLines": 400,
            "incidentMaxLines": 500,
            "forbiddenImportPaths": []
        }
    ],
    "approvedExceptions": []
}
```

<!-- architecture-budget-contract:end -->

## Current Governance Note

Architecture budgets are now defined here so CI can enforce file-size ceilings and the highest-risk cross-layer import violations. The warning band is intentionally tighter than the hard band so P3 refactors can land incrementally without hiding structural debt.
