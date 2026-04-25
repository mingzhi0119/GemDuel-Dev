# Quick Start

## Setup

```bash
pnpm install
```

Desktop release packaging is currently supported for Windows NSIS only. Web development commands are cross-platform, but `pnpm electron:build` is not a supported macOS/Linux release path.

## Core Commands

```bash
pnpm dev              # Vite web app
pnpm electron:dev     # Vite + Electron
pnpm build            # Workspace build
pnpm test             # Test suite
pnpm lint             # ESLint
pnpm run seal-exclusions:check
```

## Release-Gate Commands

```bash
pnpm test:security
pnpm test:coverage
pnpm boundaries:check
pnpm deps:check
pnpm desktop:check
pnpm release:check
pnpm bench
pnpm audit:gates
pnpm governance:report
pnpm lifecycle:certify
```

## Where To Look

- App shell: `apps/desktop/src/App.tsx`, `apps/desktop/src/app/**`
- Game logic: `packages/shared/src/logic/**`
- Network and hooks: `apps/desktop/src/hooks/**`, `packages/shared/src/logic/network**`
- Electron shell: `apps/desktop/electron/**`
- Reusable UI: `packages/ui/src/**`
- Canonical player copy and term system: `packages/shared/src/lexicon/index.ts`, `packages/ui/src/lexicon/**`
- Governance docs: [`docs/governance/`](../governance/)
- Governance snapshots and retained evidence: `tools/governance/**`
- Conduct rules: [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md)

## Suggested Reading Order

1. `README.md`
2. [`docs/guides/testing.md`](testing.md)
3. [`docs/guides/lexicon-copy-system.md`](lexicon-copy-system.md)
4. [`docs/guides/frontend-layout-guide.md`](frontend-layout-guide.md)
5. [`docs/governance/architecture-layer-map.md`](../governance/architecture-layer-map.md)
6. [`docs/archive/engineering-governance-certification-2026-04-25.md`](../archive/engineering-governance-certification-2026-04-25.md)
