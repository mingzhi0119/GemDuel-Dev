# Operations SLO

This document defines the release-health objectives for desktop startup, updater behavior, peer networking, and recovery handling.

The machine-readable contract lives in [electron/governance/release-health-operations.snapshot.json](E:/simonbb/GemDuel-Dev/electron/governance/release-health-operations.snapshot.json).

## SLO Targets

| Indicator               | Healthy Target | Warning Threshold | Incident Threshold | Operational Meaning                                                              |
| ----------------------- | -------------- | ----------------- | ------------------ | -------------------------------------------------------------------------------- |
| `startupFailures`       | `0`            | `> 0`             | `> 0`              | Any failed desktop boot or renderer load is page-worthy.                         |
| `runtimeConfigFailures` | `0`            | `> 0`             | `> 0`              | Runtime config fallback should not reach users in a clean release.               |
| `updaterFailures`       | `0`            | `> 0`             | `> 0`              | Update checks and downloads should not fail during smoke validation.             |
| `peerFailures`          | `0`            | `> 0`             | `> 0`              | Multiplayer peer lifecycle errors are treated as release regressions.            |
| `recoveryRequests`      | `0`            | `> 0`             | `> 1`              | A single recovery request is a warning; repeated recovery indicates instability. |
| `ipcRejected`           | `0`            | `> 0`             | `> 0`              | Unexpected IPC requests must stay at zero outside fault drills.                  |

## Alert Routing

- `startupFailures`, `runtimeConfigFailures`, `updaterFailures`, `peerFailures`, and `ipcRejected` route to paging review immediately.
- `recoveryRequests` is a warning signal on the first request and escalates if the count crosses the incident threshold.
- All thresholds are reflected in the machine-readable snapshot so `scripts/export-release-health-report.mjs` can classify a report without manual interpretation.

## Reporting Rules

- A healthy release-health report should show zero incidents and only the expected counters for the scenario being exercised.
- During a fault drill, note the expected exception and the exact event name that proves the failure was captured.
- When a report is generated from raw logs, the exporter should still emit the same indicator names, threshold values, and alert routing as the summary-based path.
