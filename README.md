# Gem Duel

Gem Duel is a pnpm + Turborepo monorepo for a React + TypeScript + Electron strategy game. The root now acts as a control tower while the app, shared logic, UI, TURN service, scripts, and governance assets live in dedicated workspaces.

Desktop release packaging is governed for Windows only. `electron-builder` publishes a Windows NSIS installer; web and Vite development stay cross-platform, but non-Windows desktop packaging is not a supported release target.

## Start

```bash
pnpm install
pnpm electron:dev
```

- `pnpm electron:dev` 会从仓库根目录同时启动 Vite renderer 和 Electron 壳子，是日常本地开发的默认启动命令。
- 如果你已经单独跑着 renderer dev server，再开一个 shell 即可：

```bash
pnpm dev
pnpm electron:open
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

## AI Replay Generation

Use the backend-only AI simulation script to generate Replay vNext samples for testing, evaluation, and scoring without adding an AI vs AI mode to the frontend.

```bash
pnpm --dir tools/scripts run ai:replays -- --count 10 --use-buffs
```

- `--count 10` runs ten AI vs AI matches in a batch.
- `--use-buffs` enables buff draft during those simulations, so the exported replays cover more gameplay branches.
- By default the script writes compact Replay vNext JSON files plus a `manifest.json` summary into `Replay/ai-batches/<timestamp>/`.
- `Replay/` is a local artifact directory and is gitignored by default.
- `manifest.json` records which matches completed or aborted, along with each replay's winner, final hash, and evaluation confidence.
- Add `--no-write` if you only want the batch summary and evaluation output printed to the terminal.

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
- Contributor conduct: [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)
- Lexicon and player copy: [`docs/guides/lexicon-copy-system.md`](docs/guides/lexicon-copy-system.md)
- Governance: [`docs/governance/`](docs/governance/)
- Governance certification: [`docs/archive/engineering-governance-certification-2026-04-25.md`](docs/archive/engineering-governance-certification-2026-04-25.md)
- Archived governance timeline: [`docs/archive/engineering-governance-archive.md`](docs/archive/engineering-governance-archive.md)
