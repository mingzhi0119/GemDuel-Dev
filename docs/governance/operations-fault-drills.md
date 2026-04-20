# Operations Fault Drills

Machine-readable drill contract: `electron/governance/release-health-operations.snapshot.json`

## Required Drills

| Drill ID           | Goal                                             | Trigger                                                  | Expected Evidence                           | Recovery                                                          |
| ------------------ | ------------------------------------------------ | -------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------- |
| `updater-fail`     | Prove updater failures are captured              | Force updater check failure                              | `UPDATER_CHECK_FAILED`, `updaterFailures`   | Remove the injection and verify a healthy updater run             |
| `ipc-reject`       | Prove bad or untrusted IPC is rejected           | Send an invalid payload or call from an untrusted sender | `IPC_REQUEST_REJECTED`, `ipcRejected`       | Restore trusted sender context and resend a valid request         |
| `network-recovery` | Prove peer disruption enters controlled recovery | Break the peer link or inject a bad packet               | `RECOVERY_REQUEST_SENT`, `recoveryRequests` | Host resends an authoritative snapshot and the session stabilizes |

## Drill Rule

Keep drills reproducible and keep the exported report alongside the drill result.
