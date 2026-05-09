# Dependency and Runtime Governance

This file is the human-readable contract for dependency risk, runtime environment ownership, and secret handling.

## Production Dependency Policy

- `pnpm audit --prod --json` must report zero production vulnerabilities.
- Release builds use the lockfile that passed governance checks.
- Security overrides in `package.json` are governed policy, not ad hoc local fixes.

## License Allowlist Policy

- Source of truth: `tools/governance/dependency-license-allowlist.json`
- Every resolved package license must be allowlisted.
- Missing license metadata fails the gate.

## SBOM Policy

- Source of truth: `tools/governance/dependency-sbom.snapshot.json`
- The SBOM snapshot is generated from `package.json` and the normalized `pnpm licenses` inventory.
- Platform-scoped optional binary packages are excluded from the governed snapshot so Windows development and Ubuntu CI compare the same bill of materials.
- Canonical component ids replace raw `.pnpm` install paths so peer-suffix encoding differences do not create false drift between platforms.
- Snapshot drift fails the gate.

## Dependency Baseline And Cache Hygiene

- `.vite/deps` is a local dependency cache and must not be tracked; `pnpm deps:check` fails on tracked `.vite/deps` files.
- `apps/desktop/package.json` owns the app-owned Electron baseline for `electron` and `electron-builder`; the root workspace manifest mirrors that baseline so packaging and governance resolve the same toolchain.
- `apps/desktop/package.json` `build.electronVersion` must match the app Electron exact version after removing the semver range prefix.

## CI Coverage

- `dependency-governance.yml` covers scheduled and manual dependency review.
- `governance.yml` covers pull-request governance gates.
- `build.yml` reruns dependency governance before release packaging.

## Approved Security Overrides

- `path-to-regexp -> 0.1.13`
- `qs -> 6.14.2`
- `yaml -> 2.8.3`
- `anymatch -> picomatch 2.3.2`
- `micromatch -> picomatch 2.3.2`
- `readdirp -> picomatch 2.3.2`
- `tinyglobby -> picomatch 4.0.4`

## Runtime Configuration Ownership

| Env                                   | Owner               | Default                 | Validation                                                                | Secret Handling                                                                | Failure Mode                                               |
| ------------------------------------- | ------------------- | ----------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| `GEMDUEL_DISABLE_UPDATES`             | Desktop Platform    | `false`                 | Boolean string                                                            | Operational flag only                                                          | Falls back to `false`                                      |
| `GEMDUEL_DEV_SERVER_URL`              | Desktop Platform    | `http://localhost:5173` | Absolute `http`/`https` dev renderer URL, with optional query parameters  | Development endpoint metadata only                                             | Falls back to `http://localhost:5173`                      |
| `GEMDUEL_ALLOW_VISUAL_LAB`            | Desktop Platform    | `false`                 | Boolean string controlling visual-lab route exposure                      | Operational dev-tooling flag only                                              | Visual-lab route remains disabled                          |
| `GEMDUEL_ALLOW_PRERELEASE`            | Release Engineering | `false`                 | Boolean string                                                            | Operational flag only                                                          | Falls back to `false`                                      |
| `GEMDUEL_LOG_LEVEL`                   | Desktop Platform    | `info`                  | `error`, `warn`, `info`, `verbose`, `debug`, `silly`                      | Operational flag only                                                          | Falls back to release default                              |
| `GEMDUEL_PEER_SERVER_PORT`            | Networking          | `9000`                  | Integer TCP port `1-65535`; runtime may probe subsequent free local ports | Operational local-network setting only                                         | Falls back to the governed probe window starting at `9000` |
| `GEMDUEL_ICE_SERVERS_JSON`            | Networking          | `[]`                    | JSON array of governed ICE entries                                        | TURN credentials are sensitive                                                 | Falls back to built-in STUN baseline                       |
| `GEMDUEL_TURN_CREDENTIAL_BUNDLE_JSON` | Networking          | `unset`                 | JSON object with `policyVersion`, `iceServers`, `issuedAt`, `expiresAt`   | Treat as sensitive short-lived material                                        | Falls back to runtime ICE, then STUN baseline              |
| `GEMDUEL_TURN_SERVICE_URL`            | Networking          | `unset`                 | Absolute `https` URL; `http` only for loopback development hosts          | Endpoint metadata; bearer token requires transport protection outside loopback | Disables online TURN fetch and falls back                  |
| `GEMDUEL_TURN_SERVICE_TOKEN`          | Networking          | `unset`                 | Opaque bearer token                                                       | Secret, never commit or log                                                    | Disables online TURN fetch unless deny-fallback is enabled |
| `GEMDUEL_TURN_SERVICE_FALLBACK_MODE`  | Networking          | `allow-runtime-ice`     | `allow-runtime-ice` or `deny-runtime-ice`                                 | Operational policy only                                                        | Falls back to `allow-runtime-ice`                          |
| `GEMDUEL_USER_DATA_SUFFIX`            | Desktop Platform    | `unset`                 | Optional non-empty filesystem-safe suffix                                 | Operational local profile routing only                                         | Falls back to the default Electron userData directory      |
| `CSC_LINK`                            | Release Engineering | `unset`                 | Electron Builder signing certificate link or base64 payload               | Secret signing material                                                        | Tag-release artifact evidence fails if signing is absent   |
| `CSC_KEY_PASSWORD`                    | Release Engineering | `unset`                 | Password for `CSC_LINK` signing material                                  | Secret signing material                                                        | Tag-release artifact evidence fails if signing is absent   |
| `WIN_CSC_LINK`                        | Release Engineering | `unset`                 | Windows-specific signing certificate link or base64 payload               | Secret signing material                                                        | Tag-release artifact evidence fails if signing is absent   |
| `WIN_CSC_KEY_PASSWORD`                | Release Engineering | `unset`                 | Password for `WIN_CSC_LINK` signing material                              | Secret signing material                                                        | Tag-release artifact evidence fails if signing is absent   |
| `CI`                                  | Release Engineering | `unset`                 | GitHub Actions truthy CI marker                                           | CI metadata only                                                               | Release provenance falls back to explicit CLI strictness   |
| `GITHUB_REPOSITORY`                   | Release Engineering | `unset`                 | GitHub Actions repository slug                                            | CI metadata only                                                               | Provenance falls back to `null`                            |
| `GITHUB_SHA`                          | Release Engineering | `unset`                 | GitHub Actions commit SHA                                                 | CI metadata only                                                               | Provenance falls back to `null`                            |
| `GITHUB_REF`                          | Release Engineering | `unset`                 | GitHub Actions ref                                                        | CI metadata only                                                               | Provenance falls back to `null`                            |
| `GITHUB_DEFAULT_BRANCH`               | Release Engineering | `unset`                 | GitHub Actions default branch name                                        | CI metadata only                                                               | Release provenance falls back to local non-tag mode        |
| `GITHUB_WORKFLOW`                     | Release Engineering | `unset`                 | GitHub Actions workflow name                                              | CI metadata only                                                               | Provenance falls back to `null`                            |
| `GITHUB_RUN_ID`                       | Release Engineering | `unset`                 | GitHub Actions run id                                                     | CI metadata only                                                               | Provenance falls back to `null`                            |
| `GITHUB_RUN_ATTEMPT`                  | Release Engineering | `unset`                 | GitHub Actions run attempt                                                | CI metadata only                                                               | Provenance falls back to `null`                            |
| `GITHUB_JOB`                          | Release Engineering | `unset`                 | GitHub Actions job name                                                   | CI metadata only                                                               | Provenance falls back to `null`                            |
| `GITHUB_STEP_SUMMARY`                 | Release Engineering | `unset`                 | GitHub Actions step summary output file path                              | CI output path metadata only                                                   | Evidence still writes under `artifacts/governance`         |

## Secret Scanning and Env Drift Policy

- Gate: `pnpm run secrets:check`
- Credential-like literals, embedded auth URLs, and private keys must not be committed.
- Every `process.env.*` usage in governed source must map to `RUNTIME_CONFIG_POLICY`.
- Every governed env name must be documented here before merge.

## Release Signing Secrets

- Local non-tag governance validation treats absent `CSC_LINK`, `WIN_CSC_LINK`, `CSC_KEY_PASSWORD`, and `WIN_CSC_KEY_PASSWORD` as expected developer-machine state.
- Public Windows tag releases must still fail closed when signed NSIS installer evidence is missing or Authenticode verification is not valid.

## TURN Credential State

- The desktop runtime now supports issue, refresh, and revoke for short-lived TURN credentials.
- TURN credential service deployments must use HTTPS outside loopback development and retain deployment-layer rate limiting in front of bearer-token authenticated requests.
- The TURN service requires `Authorization: Bearer <token>`, exact `/turn/issue`, `/turn/refresh`, and `/turn/revoke` routes, governed JSON body size limits, and in-process abuse throttling.
- Public TURN deployments must add deployment-layer rate limiting in front of the service; the in-process limiter is a service fallback, not the only abuse-control boundary.
- Lease IDs are HMAC-verifiable stateless handles; revoke state is retained only as short-lived lifecycle evidence until the lease expires.
- Runtime ICE and STUN remain governed fallback paths.
- `tools/scripts/patch-peer.js` is retired and must not return.

## Peer Signaling State

- The desktop PeerServer binds explicitly to `0.0.0.0` so LAN matchmaking keeps working while the host policy remains visible in release-health evidence.
- Electron shutdown paths must close the captured PeerServer HTTP server before process exit.

## Operator Checklist

1. Run dependency gates before release builds.
2. Review `pnpm-lock.yaml` when overrides change.
3. Keep the allowlist and SBOM snapshots aligned with dependency updates.
