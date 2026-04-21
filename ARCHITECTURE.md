# Architecture

Gem Duel is now organized as a production monorepo. The root owns the control plane, while the app, shared contracts, UI, TURN service, scripts, and retained governance evidence live in workspaces.

## Main Areas

- `apps/desktop/**` handles Electron main/preload, renderer shell, routing, hooks, and desktop runtime orchestration.
- `packages/shared/**` contains domain logic, validation, protocol handling, runtime policy, data, and pure utilities.
- `packages/ui/**` contains reusable UI, styling, and view helpers.
- `packages/turn-service/**` contains the TURN credential service and its tests.
- `tools/scripts/**` contains governance checks, exports, and maintenance scripts.
- `tools/governance/**` contains retained snapshots and machine-readable evidence.

## Governance Sources Of Truth

- [`docs/governance/architecture-layer-map.md`](docs/governance/architecture-layer-map.md)
- [`docs/governance/boundary-inventory.md`](docs/governance/boundary-inventory.md)
- [`docs/governance/dependency-runtime-governance.md`](docs/governance/dependency-runtime-governance.md)
- [`docs/governance/release-health-checklist.md`](docs/governance/release-health-checklist.md)
- [`docs/governance/operations-slo.md`](docs/governance/operations-slo.md)
- [`docs/adr/README.md`](docs/adr/README.md)

## Working Rules

- UI consumes domain state; it should not become a second source of truth for game rules.
- Protocol parsing belongs in `packages/shared`, not in hooks or components.
- Electron policy belongs in `apps/desktop/electron` and the matching governance scripts.
- Release and dependency policy belongs in `tools/scripts`, `tools/governance`, and the CI workflows.

## Audit Context

The 2026-04-20 independent audit called out a P1 closure path around lint, type checking, and SBOM enforcement, then a P2 follow-up around boundary drift detection and renderer observability. The current monorepo migration now focuses on making that governance visible at the workspace level without changing game rules or release scope.
