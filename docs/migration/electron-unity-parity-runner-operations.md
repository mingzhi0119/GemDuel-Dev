# Electron/Unity Parity Runner Operations

Date: 2026-05-10

## Purpose

`pnpm parity:electron-unity` is the heavyweight cross-renderer evidence gate. It drives the
Electron renderer through `agent-browser`, captures Unity evidence through the Unity Editor, and
writes the parity matrix under `artifacts/electron-unity-parity/`.

Use it for UI/interaction parity closeout and release-candidate evidence. Do not use it as the
default gate for every small Unity iteration.

## Default Migration Workflow

For normal Unity migration iterations, prefer these source and Unity gates first:

```powershell
pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts
pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts --check
pnpm typecheck
pnpm lint
```

When Unity Editor validation is required and available, run the current EditMode or capture command
for the specific Unity surface under review. Use the full browser-backed parity matrix only when the
change needs Electron/Unity visual, semantic, or interaction equivalence evidence.

## Browser Process Safety

The parity runner now treats each `agent-browser` session as a scoped resource:

- each Electron scenario opens a unique `gemduel-parity-<viewport>-<scenario>` session;
- each scenario records a guard sample immediately before closing its session, so `peakCount`
  reflects the largest single active session rather than a full-run accumulation;
- that session is closed in `finally` immediately after the scenario screenshot/state artifacts are
  written;
- the final `agent-browser close --all` remains as a last-resort cleanup step;
- a lock at `artifacts/electron-unity-parity/.runner.lock` prevents two parity runners from running
  at the same time.

The runner records a Windows-specific browser process guard in `runner-summary.json`:

```json
{
    "browserProcessGuard": {
        "beforeCount": 1,
        "peakCount": 14,
        "afterCount": 1,
        "orphanCount": 1,
        "cleanupActions": []
    }
}
```

The guard only matches Chrome for Testing processes owned by `agent-browser`:

- `ExecutablePath` under `%USERPROFILE%\.agent-browser\browsers\chrome-*\chrome.exe`;
- or `CommandLine` containing `.agent-browser` / `agent-browser-chrome-`.

Normal Google Chrome and Microsoft Edge are excluded by construction.

## Process Inspection Script

Use the dry-run guard when CPU is high or before starting a long parity run:

```powershell
pnpm parity:browser-guard -- --pretty
```

To fail when too many matched `agent-browser` Chrome processes are present:

```powershell
pnpm parity:browser-guard -- --max 24 --pretty
```

The script defaults to dry-run. If manual cleanup is needed, the destructive mode is explicit:

```powershell
pnpm parity:browser-guard -- --kill --pretty
```

`--kill` still uses the same narrow matcher and does not target normal Chrome or Edge.

## Acceptance Check

For lifecycle verification, run:

```powershell
pnpm parity:electron-unity -- --skip-unity --viewports "1366x768"
```

The run should finish with `browserProcessGuard.afterCount` back at the pre-run baseline, allowing at
most one extra Windows `STATUS_PROCESS_IS_TERMINATING` style orphan. A full parity run should satisfy
the same process convergence rule:

```powershell
pnpm parity:electron-unity -- --viewports "1920x1080,1366x768"
```

If the guard fails, inspect the emitted PID, executable path, and command line before retrying. A
single stuck terminating GPU subprocess can require Windows sign-out or reboot to fully disappear.
