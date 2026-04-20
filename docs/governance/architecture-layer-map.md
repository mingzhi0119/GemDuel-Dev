# Architecture Layer Map

Last updated: `2026-04-20`
Machine-readable budget contract: this document (`architecture-budget-contract`)

## Layers

| Layer                   | Responsibility                                            | Representative Paths                             | Warning LOC | Hard LOC | Allowed Dependencies                                        |
| ----------------------- | --------------------------------------------------------- | ------------------------------------------------ | ----------- | -------- | ----------------------------------------------------------- |
| `UI / App Shell`        | Screen selection, overlays, layout shell                  | `src/App.tsx`, `src/app/**`, `src/components/**` | `400`       | `500`    | Hooks, domain selectors/types, desktop contract             |
| `Hooks / Orchestration` | Runtime coordination, multiplayer side effects            | `src/hooks/**`                                   | `300`       | `400`    | Domain logic, network protocol, desktop observability/types |
| `Network Contract`      | DTOs, message parsing, checksums, direction rules         | `src/types/network.ts`, `src/logic/network*.ts`  | `300`       | `400`    | Domain types and validation guards                          |
| `Domain Logic`          | Rules, reducer transitions, replay validation, FSM policy | `src/logic/**`                                   | `400`       | `500`    | Domain types, runtime schemas, pure utilities               |
| `Reference Data`        | Card catalogs, constants, and static rule data            | `src/data/**`, `src/constants.ts`                | `400`       | `500`    | Domain logic and shared contracts                           |
| `Shared Contracts`      | Renderer-main bridge and shared policy contracts          | `src/types/**`, `shared/**`                      | `400`       | `500`    | Runtime schemas and pure utilities                          |
| `Desktop Platform`      | Electron main/preload/runtime config and gates            | `electron/**`                                    | `400`       | `500`    | Shared runtime policy, observability                        |
| `Governance / Scripts`  | CI gates, artifact export, and offline governance checks  | `scripts/**`                                     | `400`       | `500`    | Node-only governance helpers                                |

## Hard Rules

1. Phase-sensitive action ownership lives in `src/logic/fsmPolicy.ts`.
2. `src/app/**` and `src/components/**` may consume FSM-derived state, but must not become a second phase source of truth.
3. Protocol parsing belongs in `src/logic/networkMessageValidation.ts`, not in hooks or UI.
4. `src/types/desktop.ts` is the only renderer-side bridge contract file.

## Temporary ADR-backed Hard-limit Exceptions

| File                                 | Approved Ceiling | ADR                                                                                         |
| ------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------- |
| `src/logic/contractSchemas.ts`       | `800`            | [`0002-zod-contract-boundary-strategy.md`](../adr/0002-zod-contract-boundary-strategy.md)   |
| `src/data/realCards.ts`              | `900`            | [`0006-canonical-card-catalog.md`](../adr/0006-canonical-card-catalog.md)                   |
| `src/components/PlayerZone.tsx`      | `800`            | [`0007-renderer-composition-exceptions.md`](../adr/0007-renderer-composition-exceptions.md) |
| `src/components/CardAnatomyPage.tsx` | `600`            | [`0007-renderer-composition-exceptions.md`](../adr/0007-renderer-composition-exceptions.md) |

Warnings between the review budget and the hard limit are expected refactor candidates. Hard-limit breaches must be backed by an ADR entry or the governance gate fails.

## Machine-readable Budget Contract

<!-- architecture-budget-contract:start -->

```json
{
    "schemaVersion": 1,
    "layers": [
        {
            "id": "ui-app-shell",
            "label": "UI / App Shell",
            "paths": ["src/App.tsx", "src/app/", "src/components/"],
            "warningMaxLines": 400,
            "incidentMaxLines": 500,
            "forbiddenImportPaths": [
                "electron/",
                "src/logic/networkMessageValidation.ts",
                "src/logic/networkProtocol.ts"
            ]
        },
        {
            "id": "hooks-orchestration",
            "label": "Hooks / Orchestration",
            "paths": ["src/hooks/"],
            "warningMaxLines": 300,
            "incidentMaxLines": 400,
            "forbiddenImportPaths": ["electron/"]
        },
        {
            "id": "network-contract",
            "label": "Network Contract",
            "paths": [
                "src/types/network.ts",
                "src/logic/networkChecksums.ts",
                "src/logic/networkDispatchPolicy.ts",
                "src/logic/networkMessageValidation.ts",
                "src/logic/networkProtocol.ts",
                "src/logic/networkRecovery.ts"
            ],
            "warningMaxLines": 300,
            "incidentMaxLines": 400,
            "forbiddenImportPaths": ["src/app/", "src/components/", "src/hooks/", "electron/"]
        },
        {
            "id": "domain-logic",
            "label": "Domain Logic",
            "paths": ["src/logic/"],
            "warningMaxLines": 400,
            "incidentMaxLines": 500,
            "forbiddenImportPaths": ["src/app/", "src/components/", "src/hooks/", "electron/"]
        },
        {
            "id": "reference-data",
            "label": "Reference Data",
            "paths": ["src/data/", "src/constants.ts"],
            "warningMaxLines": 400,
            "incidentMaxLines": 500,
            "forbiddenImportPaths": ["electron/"]
        },
        {
            "id": "shared-contracts",
            "label": "Shared Contracts",
            "paths": ["src/types/", "shared/"],
            "warningMaxLines": 400,
            "incidentMaxLines": 500,
            "forbiddenImportPaths": ["electron/"]
        },
        {
            "id": "desktop-platform",
            "label": "Desktop Platform",
            "paths": ["electron/"],
            "warningMaxLines": 400,
            "incidentMaxLines": 500,
            "forbiddenImportPaths": ["src/app/", "src/components/", "src/hooks/"]
        },
        {
            "id": "governance-scripts",
            "label": "Governance / Scripts",
            "paths": ["scripts/"],
            "warningMaxLines": 400,
            "incidentMaxLines": 500,
            "forbiddenImportPaths": []
        }
    ],
    "approvedExceptions": [
        {
            "path": "src/logic/contractSchemas.ts",
            "approvedMaxLines": 800,
            "adrPath": "docs/adr/0002-zod-contract-boundary-strategy.md"
        },
        {
            "path": "src/data/realCards.ts",
            "approvedMaxLines": 900,
            "adrPath": "docs/adr/0006-canonical-card-catalog.md"
        },
        {
            "path": "src/components/PlayerZone.tsx",
            "approvedMaxLines": 800,
            "adrPath": "docs/adr/0007-renderer-composition-exceptions.md"
        },
        {
            "path": "src/components/CardAnatomyPage.tsx",
            "approvedMaxLines": 600,
            "adrPath": "docs/adr/0007-renderer-composition-exceptions.md"
        }
    ]
}
```

<!-- architecture-budget-contract:end -->

## Current Governance Note

Architecture budgets are now defined here so CI can enforce file-size ceilings and the highest-risk cross-layer import violations. The warning band is intentionally tighter than the hard band so P3 refactors can land incrementally without hiding structural debt.
