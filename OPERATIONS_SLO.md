# Operations SLO

This document defines the release-health objectives for desktop startup, updater behavior, peer networking, recovery handling, and the retained governance artifacts that operators use after CI or release runs.

The machine-readable contract lives in [electron/governance/release-health-operations.snapshot.json](E:/simonbb/GemDuel-Dev/electron/governance/release-health-operations.snapshot.json).

## SLO Targets

| Indicator               | Healthy Target | Warning Threshold | Incident Threshold | Owner               | Runbook / Drill              | Operational Meaning                                                              |
| ----------------------- | -------------- | ----------------- | ------------------ | ------------------- | ---------------------------- | -------------------------------------------------------------------------------- |
| `startupFailures`       | `0`            | `> 0`             | `> 0`              | Desktop Platform    | `OPERATIONS_FAULT_DRILLS.md` | Any failed desktop boot or renderer load is page-worthy.                         |
| `runtimeConfigFailures` | `0`            | `> 0`             | `> 0`              | Desktop Platform    | `OPERATIONS_FAULT_DRILLS.md` | Runtime config fallback should not reach users in a clean release.               |
| `updaterFailures`       | `0`            | `> 0`             | `> 0`              | Release Engineering | `updater-fail`               | Update checks and downloads should not fail during smoke validation.             |
| `peerFailures`          | `0`            | `> 0`             | `> 0`              | Networking          | `OPERATIONS_FAULT_DRILLS.md` | Multiplayer peer lifecycle errors are treated as release regressions.            |
| `recoveryRequests`      | `0`            | `> 0`             | `> 1`              | Networking          | `network-recovery`           | A single recovery request is a warning; repeated recovery indicates instability. |
| `ipcRejected`           | `0`            | `> 0`             | `> 0`              | Desktop Platform    | `ipc-reject`                 | Unexpected IPC requests must stay at zero outside fault drills.                  |

## Operational Budgets

| Budget Metric | Healthy Target | Warning Threshold | Incident Threshold | Owner             | Operational Meaning                                                                    |
| ------------- | -------------- | ----------------- | ------------------ | ----------------- | -------------------------------------------------------------------------------------- |
| `mainChunkKb` | `<= 700`       | `> 700`           | `> 850`            | Frontend Platform | Main renderer chunk growth is tracked as a release artifact even before Phase D split. |

## Alert Routing

- `startupFailures`, `runtimeConfigFailures`, `updaterFailures`, `peerFailures`, and `ipcRejected` route to paging review immediately.
- `recoveryRequests` is a warning signal on the first request and escalates if the count crosses the incident threshold.
- All thresholds are reflected in the machine-readable snapshot so `scripts/export-release-health-report.mjs` can classify a report without manual interpretation.
- `mainChunkKb` is emitted through the governance artifact export and should remain below the warning budget until Phase D removes the large-chunk warning entirely.

## Reporting Rules

- A healthy release-health report should show zero incidents and only the expected counters for the scenario being exercised.
- During a fault drill, note the expected exception and the exact event name that proves the failure was captured.
- When a report is generated from raw logs, the exporter should still emit the same indicator names, threshold values, and alert routing as the summary-based path.

## Artifact Retention

- CI and release workflows upload the retained governance artifact named `governance-evidence`.
- The retained artifact window is `14` days.
- The exported artifact bundle must include governed release-health reports, the governance evidence manifest, and the bundle budget report whenever `dist/` exists.
- The governance evidence manifest must also point at the version-matched dependency, secret, runtime, boundary, and contract assets that were audited in the same release batch.
- Operators should treat the retained JSON reports as the first audit trail before reading ad hoc logs.
