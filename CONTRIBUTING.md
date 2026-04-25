# Contributing

Start with [`README.md`](README.md), [`docs/README.md`](docs/README.md), [`docs/architecture/overview.md`](docs/architecture/overview.md), and [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). This repository is governed by the current CI gates, so keep changes small and make sure the affected checks stay green.

## Local Setup

```bash
pnpm install
pnpm dev
pnpm electron:dev
```

Web and Vite development are cross-platform. Desktop release packaging is currently governed only for Windows NSIS builds, so do not treat `pnpm electron:build` as a supported macOS/Linux release path.

## 10-Minute Green Path

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm test:coverage
pnpm build
pnpm bundle:check
pnpm bench
pnpm audit:gates
pnpm governance:report
pnpm lifecycle:certify
```

Use this path when preparing governance, release, or lifecycle changes. If the change only touches a narrow feature area, run the targeted tests first and then finish with the full path before marking the branch ready.

## Before Opening a PR

Run the checks that match this repo's workflows:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:security
pnpm desktop:check
pnpm release:check
pnpm repo-settings:check
pnpm codeowners:check
pnpm changelog:check
pnpm audit:gates
pnpm bench
pnpm governance:report
pnpm lifecycle:certify
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
- Reviewer routing is checked by `pnpm codeowners:check`.
- Keep `tools/governance/codeowners-role-map.snapshot.json` aligned with `.github/CODEOWNERS` and boundary owner roles.
- Keep `tools/governance/repo-settings.snapshot.json` aligned with `docs/governance/repo-settings-checklist.md`; live GitHub settings are checked read-only with `pnpm repo-settings:check -- --live`.
- If a change crosses `docs/governance/`, `.github/workflows/`, `apps/desktop/electron/`, or `tools/scripts/`, call that out in the PR summary.

## Review Checklist

- The diff explains the user-visible behavior change.
- The PR includes tests for new or changed logic.
- The PR notes any audit, governance, or release-health impact.
- The branch is ready only when the required gates pass locally or in CI.
