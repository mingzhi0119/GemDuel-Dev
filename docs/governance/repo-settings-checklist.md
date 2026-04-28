# Repo Settings Checklist

Use this list when reviewing GitHub repository settings for release governance.

The desired state is machine-readable in `tools/governance/repo-settings.snapshot.json` and
validated locally by `pnpm repo-settings:check`. The default command is code-only and does not
mutate GitHub settings. Use `pnpm repo-settings:check -- --live` when an administrator wants a
read-only drift report against the current GitHub repository.

## Required Checks

- Protect the default branch and require pull requests before merge.
- Require these status checks before merge:
    - `governance`
    - `production-audit`
- Require review conversations to be resolved before merge.
- Restrict direct pushes to the default branch to repository administrators or automation owners.
- Keep `tools/governance/audit-gates.snapshot.json` aligned with workflow gate additions.

## Tag And Release Rules

- Only publish desktop releases from annotated or lightweight tags that match `v*`.
- The `Build and Release` workflow must run `pnpm release:provenance:check` before desktop packaging, then `pnpm release:artifacts:check` before GitHub release upload.
- Release tags must point to commits reachable from `origin/<default-branch>`.
- Do not cut release tags from feature branches or detached local-only commits.

## Artifact Retention

- `governance.yml`, `build.yml`, and `governance-evidence.yml` must retain `governance-evidence` for `30` days.
- `tools/governance/release-health-operations.snapshot.json` must keep the same `30` day retention contract.
- The retained bundle must include:
    - release-health reports
    - `governance-evidence.manifest.json`
    - `audit-gates.report.json`
    - `audit-gates.report.md`
    - `lifecycle-governance.report.json`
    - `lifecycle-governance.report.md`
    - `lifecycle-governance.dashboard.json`
    - `lifecycle-governance.dashboard.md`
    - `lifecycle-certification.report.json`
    - `lifecycle-certification.report.md`
    - `release-artifact-evidence.report.json`
    - `release-artifact-evidence.report.md`
    - bundle budget output when `dist/` exists
