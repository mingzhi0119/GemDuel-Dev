# Contributing

Start with [`README.md`](README.md) and [`docs/README.md`](docs/README.md). This repo is governed by the current CI gates, so keep changes small and make sure the affected checks stay green.

## Local setup

```bash
npm install
npm run dev
npm run electron:dev
```

Web and Vite development are cross-platform. Desktop release packaging is currently governed only for Windows NSIS builds, so do not treat `npm run electron:build` as a supported macOS/Linux release path.

## Before opening a PR

Run the checks that match this repo's workflows:

```bash
npm run lint
npm run typecheck
npm test
npm run test:security
npm run desktop:check
npm run release:check
npm run sbom:check
npm run deps:check
npm run boundaries:check
npm run seal-exclusions:check
```

## Local git hooks

- `pre-commit` stays fast and only runs `npx lint-staged`.
- `pre-push` is the heavy local safety net and runs `npm run typecheck`, `npm run lint`, and `npm test -- --run`.
- Set `SKIP_GIT_GATES=1` if you need to bypass the local `pre-push` hook temporarily. CI is still the final release gate.

## Change rules

- Keep renderer, networking, desktop, and release changes in the correct layer.
- Update the matching document or snapshot when behavior changes a governance contract.
- Regenerate `governance/*.snapshot.json` artifacts from the owning script, not by hand.
- If a change crosses `docs/governance/`, `.github/workflows/`, `electron/`, or `scripts/`, call that out in the PR summary.

## Review checklist

- The diff explains the user-visible behavior change.
- The PR includes tests for new or changed logic.
- The PR notes any audit, governance, or release-health impact.
- The branch is ready only when the required gates pass locally or in CI.
