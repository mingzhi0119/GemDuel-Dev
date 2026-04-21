# Release Health Checklist

Use this list before packaging a desktop release or cutting a release candidate.

## Required Gates

- `pnpm lint`
- `pnpm test`
- `pnpm test:security`
- `pnpm test:coverage`
- `pnpm desktop:check`
- `pnpm release:check`
- `pnpm release:provenance:check`
- `pnpm governance:evidence:check`
- `tools/scripts/export-release-health-report.mjs`
- `tools/scripts/export-governance-artifacts.mjs`

## Required Indicators

- `startupFailures`
- `runtimeConfigFailures`
- `updaterFailures`
- `peerFailures`
- `recoveryRequests`
- `ipcRejected`

## Operator Notes

- Use `window.electron.getReleaseHealthSnapshot()` to fetch the sanitized runtime snapshot.
- Keep `docs/governance/operations-slo.md` and `docs/governance/operations-fault-drills.md` aligned with telemetry changes.
- Keep `docs/governance/repo-settings-checklist.md` aligned with required checks, artifact retention, and release-tag rules.
- Clean smoke tests should keep all indicators at `0`, except `recoveryRequests`, which must stay explained if non-zero.
- Export retained evidence when release-health behavior or governance assets change.
