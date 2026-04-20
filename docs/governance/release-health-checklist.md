# Release Health Checklist

Use this list before packaging a desktop release or cutting a release candidate.

## Required Gates

- `npm run lint`
- `npm test`
- `npm run test:security`
- `npm run test:coverage`
- `npm run desktop:check`
- `npm run release:check`
- `scripts/export-release-health-report.mjs`
- `scripts/export-governance-artifacts.mjs`

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
- Clean smoke tests should keep all indicators at `0`, except `recoveryRequests`, which must stay explained if non-zero.
- Export retained evidence when release-health behavior or governance assets change.
