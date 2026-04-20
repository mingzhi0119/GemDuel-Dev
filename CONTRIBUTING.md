# Contributing

Start with [`README.md`](README.md) and [`docs/README.md`](docs/README.md). This repo is governed by the current CI gates, so keep changes small and make sure the affected checks stay green.

## Local setup

```bash
npm install
npm run dev
npm run electron:dev
```

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
```

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
