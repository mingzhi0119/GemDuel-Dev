# Release Health Checklist

Use this list before packaging a desktop release or cutting a release candidate.

## Required Gates

- `pnpm lint`
- `pnpm test`
- `pnpm test:security`
- `pnpm test:coverage`
- `pnpm desktop:check`
- `pnpm release:check`
- `pnpm release:artifacts:check`
- `pnpm release:provenance:check` (strict for CI/tag context; local non-tag runs report `skipped-non-tag-context` unless `--strict` is passed)
- `pnpm repo-settings:check`
- `pnpm codeowners:check`
- `pnpm changelog:check`
- `pnpm audit:gates`
- `pnpm bench`
- `pnpm governance:report`
- `pnpm lifecycle:certify`
- `pnpm governance:evidence:check`
- `tools/scripts/check-release-artifacts.mjs`
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
- Public Windows release tags must retain `artifacts/governance/release-artifact-evidence.report.json` and `.md`, with SHA256 checksums and valid Authenticode status for NSIS installers.
- Local non-tag validation does not require `CSC_LINK`, `WIN_CSC_LINK`, `CSC_KEY_PASSWORD`, or `WIN_CSC_KEY_PASSWORD`; missing local signing secrets are ignored as long as `pnpm release:artifacts:check` passes in non-tag mode.
- Release-health context must not retain raw `clientId`, `peerId`, `outputPath`, `filePath`, or `localPath`; use short hashes, `fileName`, `replayBytes`, and short `replayArtifactId` evidence instead.
- Export retained evidence when release-health behavior or governance assets change.
