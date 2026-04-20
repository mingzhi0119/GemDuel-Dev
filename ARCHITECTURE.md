# Architecture

Gem Duel is a TypeScript game client with a React renderer, Electron desktop shell, and a governance layer that treats contracts as first-class artifacts.

## Main Areas

- `src/app/**` handles page composition, routing, and shell-level UI.
- `src/components/**` contains reusable UI.
- `src/hooks/**` coordinates runtime behavior, multiplayer state, and side effects.
- `src/logic/**` owns rules, validation, protocol handling, and reducer transitions.
- `src/types/**`, `shared/**`, and `server/**` hold shared contracts and local service code.
- `electron/**` owns the desktop runtime, preload bridge, and security-sensitive platform policy.
- `scripts/**`, `governance/**`, and `.github/workflows/**` enforce the repo's process gates.

## Governance Sources Of Truth

- [`docs/governance/architecture-layer-map.md`](docs/governance/architecture-layer-map.md)
- [`docs/governance/boundary-inventory.md`](docs/governance/boundary-inventory.md)
- [`docs/governance/dependency-runtime-governance.md`](docs/governance/dependency-runtime-governance.md)
- [`docs/governance/release-health-checklist.md`](docs/governance/release-health-checklist.md)
- [`docs/governance/operations-slo.md`](docs/governance/operations-slo.md)
- [`docs/adr/README.md`](docs/adr/README.md)

## Working Rules

- UI consumes domain state; it should not become a second source of truth for game rules.
- Protocol parsing belongs in `src/logic/`, not in hooks or components.
- Electron policy belongs in `electron/` and the matching governance scripts.
- Release and dependency policy belongs in `scripts/`, `governance/`, and the CI workflows.

## Audit Context

The 2026-04-20 independent audit called out a P1 closure path around lint, type checking, and SBOM enforcement, then a P2 follow-up around boundary drift detection and renderer observability. P3 hardening now centers on architecture budgets, bundle-size assertions, and ADR-backed irreversible decisions. This document stays intentionally short so those controls can remain anchored in the dedicated governance docs above.
