# Dependency and Runtime Governance

This file is the human-readable contract for dependency risk, runtime environment ownership, and secret handling.

## Production Dependency Policy

- `npm audit --omit=dev --json` must report zero production vulnerabilities.
- Release builds use the lockfile that passed governance checks.
- Security overrides in `package.json` are governed policy, not ad hoc local fixes.

## License Allowlist Policy

- Source of truth: `governance/dependency-license-allowlist.json`
- Every resolved package license must be allowlisted.
- Missing license metadata fails the gate.

## SBOM Policy

- Source of truth: `governance/dependency-sbom.snapshot.json`
- The SBOM snapshot is generated from `package.json` and `package-lock.json`.
- Snapshot drift fails the gate.

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

| Env                                   | Owner               | Default             | Validation                                                              | Secret Handling                         | Failure Mode                                               |
| ------------------------------------- | ------------------- | ------------------- | ----------------------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------- |
| `GEMDUEL_DISABLE_UPDATES`             | Desktop Platform    | `false`             | Boolean string                                                          | Operational flag only                   | Falls back to `false`                                      |
| `GEMDUEL_ALLOW_PRERELEASE`            | Release Engineering | `false`             | Boolean string                                                          | Operational flag only                   | Falls back to `false`                                      |
| `GEMDUEL_LOG_LEVEL`                   | Desktop Platform    | `info`              | `error`, `warn`, `info`, `verbose`, `debug`, `silly`                    | Operational flag only                   | Falls back to release default                              |
| `GEMDUEL_ICE_SERVERS_JSON`            | Networking          | `[]`                | JSON array of governed ICE entries                                      | TURN credentials are sensitive          | Falls back to built-in STUN baseline                       |
| `GEMDUEL_TURN_CREDENTIAL_BUNDLE_JSON` | Networking          | `unset`             | JSON object with `policyVersion`, `iceServers`, `issuedAt`, `expiresAt` | Treat as sensitive short-lived material | Falls back to runtime ICE, then STUN baseline              |
| `GEMDUEL_TURN_SERVICE_URL`            | Networking          | `unset`             | Absolute `http` or `https` URL                                          | Endpoint metadata only                  | Disables online TURN fetch and falls back                  |
| `GEMDUEL_TURN_SERVICE_TOKEN`          | Networking          | `unset`             | Opaque bearer token                                                     | Secret, never commit or log             | Disables online TURN fetch unless deny-fallback is enabled |
| `GEMDUEL_TURN_SERVICE_FALLBACK_MODE`  | Networking          | `allow-runtime-ice` | `allow-runtime-ice` or `deny-runtime-ice`                               | Operational policy only                 | Falls back to `allow-runtime-ice`                          |
| `GITHUB_REPOSITORY`                   | Release Engineering | `unset`             | GitHub Actions repository slug                                          | CI metadata only                        | Provenance falls back to `null`                            |
| `GITHUB_SHA`                          | Release Engineering | `unset`             | GitHub Actions commit SHA                                               | CI metadata only                        | Provenance falls back to `null`                            |
| `GITHUB_REF`                          | Release Engineering | `unset`             | GitHub Actions ref                                                      | CI metadata only                        | Provenance falls back to `null`                            |
| `GITHUB_WORKFLOW`                     | Release Engineering | `unset`             | GitHub Actions workflow name                                            | CI metadata only                        | Provenance falls back to `null`                            |
| `GITHUB_RUN_ID`                       | Release Engineering | `unset`             | GitHub Actions run id                                                   | CI metadata only                        | Provenance falls back to `null`                            |
| `GITHUB_RUN_ATTEMPT`                  | Release Engineering | `unset`             | GitHub Actions run attempt                                              | CI metadata only                        | Provenance falls back to `null`                            |
| `GITHUB_JOB`                          | Release Engineering | `unset`             | GitHub Actions job name                                                 | CI metadata only                        | Provenance falls back to `null`                            |

## Secret Scanning and Env Drift Policy

- Gate: `node scripts/check-secret-governance.mjs`
- Credential-like literals, embedded auth URLs, and private keys must not be committed.
- Every `process.env.*` usage in governed source must map to `RUNTIME_CONFIG_POLICY`.
- Every governed env name must be documented here before merge.

## TURN Credential State

- The desktop runtime now supports issue, refresh, and revoke for short-lived TURN credentials.
- Runtime ICE and STUN remain governed fallback paths.
- `scripts/patch-peer.js` is retired and must not return.

## Operator Checklist

1. Run dependency gates before release builds.
2. Review `package-lock.json` when overrides change.
3. Keep the allowlist and SBOM snapshots aligned with dependency updates.
