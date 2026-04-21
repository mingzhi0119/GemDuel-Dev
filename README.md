# Gem Duel

Gem Duel is a pnpm + Turborepo monorepo for a React + TypeScript + Electron strategy game. The root now acts as a control tower while the app, shared logic, UI, TURN service, scripts, and governance assets live in dedicated workspaces.

Desktop release packaging is governed for Windows only. `electron-builder` publishes a Windows NSIS installer; web and Vite development stay cross-platform, but non-Windows desktop packaging is not a supported release target.

## Start

```bash
pnpm install
pnpm dev
pnpm electron:dev
```

## Core Commands

The command names stay the same, but they are now executed through pnpm and dispatched by Turborepo.

```bash
pnpm build
pnpm test
pnpm lint
pnpm run seal-exclusions:check
pnpm boundaries:check
pnpm deps:check
pnpm desktop:check
pnpm release:check
```

## Workspace Layout

- `apps/desktop` - Electron main process, preload bridge, renderer shell, and app runtime
- `packages/shared` - domain logic, contracts, runtime policy, and pure utilities
- `packages/ui` - reusable UI components, styles, and view helpers
- `packages/turn-service` - TURN credential service and related tests
- `tools/scripts` - governance, export, and maintenance scripts
- `tools/governance` - machine-readable snapshots and retained evidence

## Docs

- Project docs index: [`docs/README.md`](docs/README.md)
- Architecture overview: [`docs/architecture/overview.md`](docs/architecture/overview.md)
- Quick start: [`docs/guides/quick-start.md`](docs/guides/quick-start.md)
- Testing: [`docs/guides/testing.md`](docs/guides/testing.md)
- Governance: [`docs/governance/`](docs/governance/)
- Archived governance timeline: [`docs/archive/engineering-governance-archive.md`](docs/archive/engineering-governance-archive.md)
