# Contributing

Start with [`README.md`](README.md) and [`docs/README.md`](docs/README.md). This repository is governed by the current CI gates, so keep changes small and make sure the affected checks stay green.

## Local Setup

```bash
pnpm install
pnpm dev
pnpm electron:dev
```

Web and Vite development are cross-platform. Desktop release packaging is currently governed only for Windows NSIS builds, so do not treat `pnpm electron:build` as a supported macOS/Linux release path.

## Before Opening a PR

Run the checks that match this repo's workflows:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:security
pnpm desktop:check
pnpm release:check
pnpm sbom:check
pnpm deps:check
pnpm boundaries:check
pnpm run seal-exclusions:check
```

## Local Git Hooks

- `pre-commit` stays fast and only runs `lint-staged`.
- `pre-push` is the heavy local safety net and runs `pnpm typecheck`, `pnpm lint`, and `pnpm test -- --run`.
- Set `SKIP_GIT_GATES=1` if you need to bypass the local `pre-push` hook temporarily. CI is still the final release gate.

## Change Rules

- Keep renderer, networking, desktop, and release changes in the correct layer.
- Update the matching document or snapshot when behavior changes a governance contract.
- Regenerate `tools/governance/*.snapshot.json` artifacts from the owning script, not by hand.
- If a change crosses `docs/governance/`, `.github/workflows/`, `apps/desktop/electron/`, or `tools/scripts/`, call that out in the PR summary.

## Review Checklist

- The diff explains the user-visible behavior change.
- The PR includes tests for new or changed logic.
- The PR notes any audit, governance, or release-health impact.
- The branch is ready only when the required gates pass locally or in CI.
