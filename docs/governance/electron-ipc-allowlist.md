# Electron IPC Allowlist

Only the following renderer-visible capabilities may cross the Electron boundary.

| Renderer API                                   | Channel                         | Direction | Owner                        | Payload              | Notes                                               |
| ---------------------------------------------- | ------------------------------- | --------- | ---------------------------- | -------------------- | --------------------------------------------------- |
| `window.electron.getAppVersion()`              | `get-app-version`               | `invoke`  | Desktop shell                | None                 | Read-only version metadata                          |
| `window.electron.getRuntimeIceServers()`       | `get-runtime-ice-servers`       | `invoke`  | Desktop shell                | None                 | Sanitized runtime ICE config only                   |
| `window.electron.getRuntimeRelayProfile()`     | `get-runtime-relay-profile`     | `invoke`  | Desktop shell                | None                 | Governed relay profile, may prefer short-lived TURN |
| `window.electron.refreshRuntimeRelayProfile()` | `refresh-runtime-relay-profile` | `invoke`  | Desktop shell                | None                 | Refresh short-lived TURN lease in main process      |
| `window.electron.revokeRuntimeRelayProfile()`  | `revoke-runtime-relay-profile`  | `invoke`  | Desktop shell                | None                 | Revoke active lease during cleanup                  |
| `window.electron.getReleaseHealthSnapshot()`   | `get-release-health-snapshot`   | `invoke`  | Release health monitor       | None                 | Sanitized release-health snapshot                   |
| `window.electron.restartApp()`                 | `restart_app`                   | `send`    | Desktop shell / Auto-updater | None                 | Privileged restart and install                      |
| `window.electron.reportReleaseHealth(event)`   | `report-release-health`         | `send`    | Renderer observability       | `ReleaseHealthEvent` | Validated and redacted before persistence           |
| `window.electron.onUpdateAvailable(callback)`  | `update_available`              | event     | Auto-updater                 | None                 | Notification only                                   |
| `window.electron.onDownloadProgress(callback)` | `download_progress`             | event     | Auto-updater                 | `number` percent     | Notification only                                   |
| `window.electron.onUpdateDownloaded(callback)` | `update_downloaded`             | event     | Auto-updater                 | None                 | Notification only                                   |

## Trusted Sender Policy

- Only the trusted main BrowserWindow may call renderer-to-main channels.
- Development origin: `http://localhost:5173`
- Production origin: `file://...`
- Zero-argument channels must stay zero-argument.
- `report-release-health` is the only structured-payload renderer-to-main channel.

## Release Gate

`npm run desktop:check` verifies BrowserWindow security flags, preload API drift, and this allowlist.
