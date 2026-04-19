# Release Health Checklist

Use this checklist before shipping a desktop release or cutting a release candidate.

## Required Gates

- `npm run lint`
- `npm test`
- `npm run test:coverage`
- `npm run desktop:check`
- GitHub release workflow green on the tagged build

## Release-Health Indicators

These indicators are tracked in the structured release-health snapshot and logs:

- `startupFailures`
- `runtimeConfigFailures`
- `updaterFailures`
- `peerFailures`
- `recoveryRequests`
- `ipcRejected`

Target baseline for a clean release smoke test:

- `startupFailures = 0`
- `runtimeConfigFailures = 0`
- `updaterFailures = 0`
- `peerFailures = 0`
- `ipcRejected = 0`
- `recoveryRequests` should be `0` during a normal smoke test and explained if non-zero

## Smoke Scenarios

- Launch the packaged app and verify the renderer finishes loading.
- Confirm runtime config loads without an `APP_RUNTIME_CONFIG_FAILED` event.
- Confirm updater flow logs one of `UPDATER_NOT_AVAILABLE`, `UPDATER_AVAILABLE`, or `UPDATER_DISABLED`.
- Start a local multiplayer session and verify peer initialization plus connection-open events.
- Force a disconnect or invalid packet in a controlled test run and verify a structured recovery event appears.

## Redaction Review

- Peer IDs, request IDs, checksums, URLs, target IPs, and credential-like keys must remain redacted.
- Only short operational strings, booleans, and numeric counters should appear in release-health context.
- If a new release-health event needs richer context, update the redaction policy in [ELECTRON_IPC_ALLOWLIST.md](/E:/simonbb/GemDuel-Dev/ELECTRON_IPC_ALLOWLIST.md) before shipping.

## Operator Notes

- Release-health logs are structured JSON lines prefixed with `[RELEASE_HEALTH]`.
- The desktop process emits a final `[RELEASE_HEALTH_SUMMARY]` snapshot before quit.
- The renderer can fetch the current sanitized snapshot through `window.electron.getReleaseHealthSnapshot()` for support diagnostics.
