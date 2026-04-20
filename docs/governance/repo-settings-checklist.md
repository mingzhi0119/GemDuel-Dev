# Repo Settings Checklist

Use this list when reviewing GitHub repository settings for release governance.

## Required Checks

- Protect the default branch and require pull requests before merge.
- Require these status checks before merge:
    - `governance`
    - `production-audit`
- Require review conversations to be resolved before merge.
- Restrict direct pushes to the default branch to repository administrators or automation owners.

## Tag And Release Rules

- Only publish desktop releases from annotated or lightweight tags that match `v*`.
- The `Build and Release` workflow must run `npm run release:provenance:check` before `electron-builder -p always`.
- Release tags must point to commits reachable from `origin/<default-branch>`.
- Do not cut release tags from feature branches or detached local-only commits.

## Artifact Retention

- `governance.yml`, `build.yml`, and `governance-evidence.yml` must retain `governance-evidence` for `30` days.
- `electron/governance/release-health-operations.snapshot.json` must keep the same `30` day retention contract.
- The retained bundle must include:
    - release-health reports
    - `governance-evidence.manifest.json`
    - bundle budget output when `dist/` exists
