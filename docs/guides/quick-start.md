# Quick Start

## Setup

```bash
npm install
```

## Core Commands

```bash
npm run dev           # Vite web app
npm run electron:dev  # Vite + Electron
npm run build         # Web build
npm test              # Test suite
npm run lint          # ESLint
```

## Release-Gate Commands

```bash
npm run test:security
npm run test:coverage
npm run boundaries:check
npm run deps:check
npm run desktop:check
npm run release:check
```

## Where To Look

- App shell: `src/App.tsx`, `src/app/**`
- Game logic: `src/logic/**`
- Network and hooks: `src/hooks/**`
- Electron shell: `electron/**`
- Governance docs: [`docs/governance/`](../governance/)

## Suggested Reading Order

1. `README.md`
2. [`docs/guides/testing.md`](testing.md)
3. [`docs/guides/frontend-layout-guide.md`](frontend-layout-guide.md)
4. [`docs/governance/architecture-layer-map.md`](../governance/architecture-layer-map.md)
