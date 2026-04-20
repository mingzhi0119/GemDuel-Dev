# Electron IPC Allowlist

This document is the governed allowlist for every Electron capability that crosses the renderer and main-process boundary.

Change rules:

- Any new channel must be added here before it is exposed.
- Any preload API surface change must update this file, the preload contract tests, and the desktop governance check.
- All renderer-to-main channels require an authorized sender from the trusted main window.

| Renderer API                                   | Channel                       | Direction                          | Owner                        | Payload              | Threat Notes                                                                                                  | Status      |
| ---------------------------------------------- | ----------------------------- | ---------------------------------- | ---------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------- | ----------- |
| `window.electron.getAppVersion()`              | `get-app-version`             | Renderer `invoke` -> Main `handle` | Desktop shell                | None                 | Read-only version metadata. The sender must be the trusted main window.                                       | `Completed` |
| `window.electron.getRuntimeIceServers()`       | `get-runtime-ice-servers`     | Renderer `invoke` -> Main `handle` | Desktop shell                | None                 | Returns only sanitized runtime relay config. The sender must be the trusted main window.                      | `Completed` |
| `window.electron.getRuntimeRelayProfile()`     | `get-runtime-relay-profile`   | Renderer `invoke` -> Main `handle` | Desktop shell                | None                 | Returns the governed relay profile and may prefer ephemeral TURN bundles before legacy runtime ICE fallback.  | `Completed` |
| `window.electron.getReleaseHealthSnapshot()`   | `get-release-health-snapshot` | Renderer `invoke` -> Main `handle` | Release health monitor       | None                 | Returns only sanitized release-health counters and recent events.                                             | `Completed` |
| `window.electron.restartApp()`                 | `restart_app`                 | Renderer `send` -> Main `on`       | Desktop shell / Auto-updater | None                 | Privileged restart-and-install capability. The sender must be the trusted main window.                        | `Completed` |
| `window.electron.reportReleaseHealth(event)`   | `report-release-health`       | Renderer `send` -> Main `on`       | Renderer observability       | `ReleaseHealthEvent` | Structured health event only. Payload is schema-validated and sensitive keys are redacted before persistence. | `Completed` |
| `window.electron.onUpdateAvailable(callback)`  | `update_available`            | Main `send` -> Renderer `on`       | Auto-updater                 | None                 | Notification only. No writable capability is exposed back to the renderer.                                    | `Completed` |
| `window.electron.onDownloadProgress(callback)` | `download_progress`           | Main `send` -> Renderer `on`       | Auto-updater                 | `number` percent     | Notification only. The payload is numeric progress for the update UI.                                         | `Completed` |
| `window.electron.onUpdateDownloaded(callback)` | `update_downloaded`           | Main `send` -> Renderer `on`       | Auto-updater                 | None                 | Notification only. Enables the renderer to offer a restart button.                                            | `Completed` |

## Trusted Sender Policy

- Authorized sender: only the current main BrowserWindow webContents may call renderer-to-main channels.
- Allowed origins:
- Development: `http://localhost:5173`
- Production: `file://...`
- Payload policy:
- Zero-argument channels: `get-app-version`, `get-runtime-ice-servers`, `get-runtime-relay-profile`, `get-release-health-snapshot`, and `restart_app`.
- Structured-payload channel: `report-release-health` accepts only the governed `ReleaseHealthEvent` schema.
- Any unexpected payload shape is rejected in the main process and logged as an IPC governance warning.

## Redaction Policy

- Allowed in structured logs: category, severity, event name, numeric counters, booleans, and short operational context.
- Redacted before persistence: peer identifiers, request identifiers, checksums, URLs, target IPs, tokens, secrets, passwords, and credential-like keys.
- Long string context values are truncated before they enter the persisted release-health stream.

## Release Gate

`npm run desktop:check` verifies the following before a desktop release:

- BrowserWindow security flags stay locked to the approved policy.
- The preload bridge API surface matches the allowlisted contract.
- Every allowlisted channel is documented in this file.
