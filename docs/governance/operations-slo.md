# Operations SLO

Machine-readable contract: `electron/governance/release-health-operations.snapshot.json`

## Indicators

| Indicator               | Healthy | Warning | Incident | Owner               | Runbook                                      |
| ----------------------- | ------- | ------- | -------- | ------------------- | -------------------------------------------- |
| `startupFailures`       | `0`     | `> 0`   | `> 0`    | Desktop Platform    | `docs/governance/operations-fault-drills.md` |
| `runtimeConfigFailures` | `0`     | `> 0`   | `> 0`    | Desktop Platform    | `docs/governance/operations-fault-drills.md` |
| `updaterFailures`       | `0`     | `> 0`   | `> 0`    | Release Engineering | `updater-fail`                               |
| `peerFailures`          | `0`     | `> 0`   | `> 0`    | Networking          | `docs/governance/operations-fault-drills.md` |
| `recoveryRequests`      | `0`     | `> 0`   | `> 1`    | Networking          | `network-recovery`                           |
| `ipcRejected`           | `0`     | `> 0`   | `> 0`    | Desktop Platform    | `ipc-reject`                                 |

Each indicator uses the same words in the snapshot and this doc: `warning` and `incident`.

## Bundle Budget

| Metric        | Healthy  | Warning | Incident | Owner             |
| ------------- | -------- | ------- | -------- | ----------------- |
| `mainChunkKb` | `<= 700` | `> 700` | `> 850`  | Frontend Platform |

## Retained Evidence

- CI uploads the retained artifact `governance-evidence`.
- Retention window: `14` days.
- The retained bundle includes release-health reports, a governance manifest, and bundle budget output when `dist/` exists.

## Alert Handling

- `startupFailures`, `runtimeConfigFailures`, `updaterFailures`, `peerFailures`, and `ipcRejected` are page-worthy incident signals.
- `recoveryRequests` is a warning on the first hit and an incident when repeated.
