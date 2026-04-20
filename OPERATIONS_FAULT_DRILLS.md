# Operations Fault Drills

Use these drills to prove that release-health exports, alert thresholds, and recovery behavior remain actionable.

The machine-readable drill metadata lives in [electron/governance/release-health-operations.snapshot.json](E:/simonbb/GemDuel-Dev/electron/governance/release-health-operations.snapshot.json).
The deterministic desktop runtime drill baseline lives in [electron/governance/runtime-drill.snapshot.json](E:/simonbb/GemDuel-Dev/electron/governance/runtime-drill.snapshot.json).

## Drill Template

- Objective: describe the operational failure being simulated.
- Trigger: the exact action or injection used to produce the failure.
- Expected release-health evidence: the event names, severity, and indicator that should change.
- Recovery expectation: the next safe operator action or automatic fallback.
- Exit criteria: what must be true before the drill is considered complete.

## Required Drills

### Updater Fail

- Drill ID: `updater-fail`
- Retained report ID: `updater-fail`
- Objective: confirm updater failures are recorded and visible in the exported report.
- Trigger: force `checkForUpdatesAndNotify()` to reject or emit repeated `error` events.
- Expected release-health evidence: `UPDATER_CHECK_FAILED` or `UPDATER_ERROR`, plus the `updaterFailures` indicator incrementing.
- Recovery expectation: clear the injection, rerun the updater path, and verify the next report returns to healthy.

### IPC Reject

- Drill ID: `ipc-reject`
- Retained report ID: `ipc-reject`
- Objective: confirm unauthorized renderer calls are rejected and counted.
- Trigger: invoke a governed IPC channel from an untrusted sender or with a payload that fails validation.
- Expected release-health evidence: `IPC_REQUEST_REJECTED` plus the `ipcRejected` indicator incrementing.
- Recovery expectation: restore the trusted sender context or fix the payload and verify normal IPC flow resumes.

### Network Recovery

- Drill ID: `network-recovery`
- Retained report ID: `network-recovery`
- Objective: confirm peer/network disruption triggers an observable recovery path.
- Trigger: sever the peer connection, inject an invalid packet, or request a recovery snapshot from the guest side.
- Expected release-health evidence: `RECOVERY_REQUEST_SENT` or `RECOVERY_REQUEST_RECEIVED` plus the `recoveryRequests` indicator incrementing.
- Recovery expectation: host should resend an authoritative snapshot and the session should return to a clean state.

## Notes

- Keep drills short and reproducible.
- Record the release-health report generated from the drill so the operator can compare it to the `healthy-baseline` retained artifact.
- If a drill produces new structured fields, update the snapshot and SLO document together.
