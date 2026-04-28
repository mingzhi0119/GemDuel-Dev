# Operations Fault Drills

Machine-readable drill contract: `tools/governance/release-health-operations.snapshot.json`

## Required Drills

| Drill ID           | Goal                                             | Trigger                                                  | Expected Evidence                           | Recovery                                                          |
| ------------------ | ------------------------------------------------ | -------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------- |
| `updater-fail`     | Prove updater failures are captured              | Force updater check failure                              | `UPDATER_CHECK_FAILED`, `updaterFailures`   | Remove the injection and verify a healthy updater run             |
| `ipc-reject`       | Prove bad or untrusted IPC is rejected           | Send an invalid payload or call from an untrusted sender | `IPC_REQUEST_REJECTED`, `ipcRejected`       | Restore trusted sender context and resend a valid request         |
| `network-recovery` | Prove peer disruption enters controlled recovery | Break the peer link or inject a bad packet               | `RECOVERY_REQUEST_SENT`, `recoveryRequests` | Host resends an authoritative snapshot and the session stabilizes |

## Drill Rule

Keep drills reproducible and keep the exported report alongside the drill result.

## Visual Lab route bypass

The desktop `?visualLab=surfaces|motion` route is **dev-tooling only**: it is gated by `import.meta.env.DEV` and, outside dev, by `window.__GEMDUEL_RUNTIME_CONFIG__.allowVisualLab` (set from `GEMDUEL_ALLOW_VISUAL_LAB` in the Electron preload). Release builds omit the visual-lab lazy chunk unless `GEMDUEL_ALLOW_VISUAL_LAB=true` at **Vite build** time, so the query string cannot load lab UI in a stock production bundle.

This path is **not** part of normal player flows and is excluded from release-health drill denominators and operational SLOs. Operational drills should not treat visual-lab navigation as a gameplay or shell regression signal.
