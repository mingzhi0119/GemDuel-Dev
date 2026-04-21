# Gem Duel

Gem Duel is a React + TypeScript + Electron strategy game with local play, online play, and a governed desktop release workflow.

Desktop release packaging is currently governed for Windows only. `electron-builder` publishes a Windows NSIS installer; web and Vite development stay cross-platform, but non-Windows desktop packaging is not a supported release target yet.

## Start

```bash
npm install
npm run dev
npm run electron:dev
```

## Core Commands

```bash
npm run build
npm test
npm run lint
npm run seal-exclusions:check
npm run boundaries:check
npm run deps:check
npm run desktop:check
npm run release:check
```

## Docs

- Project docs index: [`docs/README.md`](docs/README.md)
- Quick start: [`docs/guides/quick-start.md`](docs/guides/quick-start.md)
- Testing: [`docs/guides/testing.md`](docs/guides/testing.md)
- Governance: [`docs/governance/`](docs/governance/)
- Archived governance timeline: [`docs/archive/engineering-governance-archive.md`](docs/archive/engineering-governance-archive.md)
