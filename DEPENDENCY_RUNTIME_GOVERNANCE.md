# Dependency and Runtime Governance

This document defines the enforced governance policy for production dependency risk and Electron runtime configuration.

Allowed status values:

- `Completed`
- `In Progress`
- `Unstarted`

## Scope

- Status: `Completed`
- Covered areas:
- Production dependency audits and release gates.
- Dependency license allowlists and SBOM snapshots.
- Runtime Electron environment variables and their ownership.
- Secret-handling rules for ICE and TURN configuration.
- Temporary package exceptions that still require follow-up ownership.

## Production Dependency Policy

- Status: `Completed`
- Release gates:
- `node scripts/check-dependency-governance.mjs`
- `node scripts/check-license-governance.mjs`
- `node scripts/check-sbom-governance.mjs`
- `node scripts/check-secret-governance.mjs`
- CI coverage:
- The dependency governance workflow runs on pull requests, weekly schedule, and manual dispatch.
- The governance workflow runs on pull requests and manual dispatch.
- The release workflow runs the dependency gates before lint, test, security, desktop, and build.
- Enforcement rules:
- `npm audit --omit=dev --json` must report zero production vulnerabilities.
- Security overrides in `package.json` are treated as governed policy, not ad hoc local fixes.
- Release builds must use `npm ci` so the audited lockfile is the shipped lockfile.

## License Allowlist Policy

- Status: `Completed`
- Source of truth: `governance/dependency-license-allowlist.json`
- Allowed license expressions:
- `0BSD`
- `Apache-2.0`
- `BlueOak-1.0.0`
- `BSD-2-Clause`
- `BSD-3-Clause`
- `CC-BY-4.0`
- `ISC`
- `MIT`
- `Python-2.0`
- `WTFPL`
- `WTFPL OR ISC`
- `(MIT OR CC0-1.0)`
- `(WTFPL OR MIT)`
- Enforcement rules:
- Every package in `package-lock.json` must resolve to one of the allowlisted license expressions.
- Any package with a missing license declaration fails the gate.

## SBOM Policy

- Status: `Completed`
- Source of truth: `governance/dependency-sbom.snapshot.json`
- The SBOM is generated from `package.json` and `package-lock.json` and captures the root package, component count, license inventory, and every resolved package entry.
- The snapshot is deterministic and machine-readable so it can be compared in CI or uploaded as an artifact without parsing console logs.
- Any drift between the regenerated SBOM and the committed snapshot fails the gate.

## CI Coverage

- Status: `Completed`
- Scheduled coverage:
- `dependency-governance.yml` runs weekly and on manual dispatch.
- PR coverage:
- `dependency-governance.yml` runs on pull requests.
- `governance.yml` runs the dependency gates, lint, security suite, unit tests, release health check, and desktop governance on pull requests.
- Release coverage:
- `build.yml` runs the dependency gates again before the release build and publish step on tagged releases.

## Approved Security Overrides

- Status: `Completed`
- `path-to-regexp -> 0.1.13`
- `qs -> 6.14.2`
- `yaml -> 2.8.3`
- `anymatch -> picomatch 2.3.2`
- `micromatch -> picomatch 2.3.2`
- `readdirp -> picomatch 2.3.2`
- `tinyglobby -> picomatch 4.0.4`

## Runtime Configuration Ownership

| Environment variable       | Status      | Owner               | Default | Validation                                                                                                                                                                                                | Secret handling                                                                                                                                           | Failure mode                                                              |
| -------------------------- | ----------- | ------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `GEMDUEL_DISABLE_UPDATES`  | `Completed` | Desktop Platform    | `false` | Must be `true` or `false`.                                                                                                                                                                                | Operational flag only. Never store secrets here.                                                                                                          | Falls back to `false`, which keeps updates enabled.                       |
| `GEMDUEL_ALLOW_PRERELEASE` | `Completed` | Release Engineering | `false` | Must be `true` or `false`.                                                                                                                                                                                | Operational flag only. Never store secrets here.                                                                                                          | Falls back to `false` unless the shipped version is already a prerelease. |
| `GEMDUEL_LOG_LEVEL`        | `Completed` | Desktop Platform    | `info`  | Must be one of `error`, `warn`, `info`, `verbose`, `debug`, or `silly`.                                                                                                                                   | Operational flag only. Never store secrets here.                                                                                                          | Falls back to the release default log level.                              |
| `GEMDUEL_ICE_SERVERS_JSON` | `Completed` | Networking          | `[]`    | Must be a JSON array of ICE server objects using `stun:`, `turn:`, or `turns:` URLs. Credential-bearing entries must provide both `username` and `credential`, and may only use `turn:` or `turns:` URLs. | Treat TURN credentials as sensitive runtime material. They must not be committed to source control, emitted to logs, or bundled into the packaged client. | Falls back to the built-in STUN baseline if parsing or validation fails.  |

## Secret Boundary Policy

- Status: `Completed`
- Static relay credentials are forbidden in source-controlled config, packaged renderer bundles, and markdown examples.
- Credential-bearing TURN entries may only be injected at runtime through the governed Electron bridge.
- Release-health logging must redact peer identifiers, checksums, URLs, tokens, passwords, and TURN credential fields before persistence.

## Secret Scanning and Env Drift Policy

- Status: `Completed`
- Secret scan gate: `node scripts/check-secret-governance.mjs`
- The secret scan covers source, workflow, configuration, and documentation files while ignoring test fixtures and generated artifacts.
- Credential-like literals, embedded auth URLs, private key blocks, and high-confidence token patterns must not be committed to source-controlled files.
- Every `process.env.GEMDUEL_*` usage in tracked runtime source must map to `RUNTIME_CONFIG_POLICY`.
- Every governed runtime env must be documented in this file before it is merged.
- New runtime env usage requires a policy update and a doc update in the same change.

## Short-Lived TURN Credential Roadmap

- Status: `In Progress`
- Current state: the desktop app accepts runtime-injected TURN credentials, but there is no in-repo backend that can mint authenticated short-lived credentials yet.
- Required end state:
- Client authentication must happen before TURN credentials are issued.
- TURN username and credential should be short-lived and server-issued.
- The desktop runtime should prefer fetching ephemeral TURN credentials over reading long-lived relay secrets from the host environment.

## Temporary Governance Exceptions

- Status: `In Progress`
- `scripts/patch-peer.js` is still a governed workaround because the `peer` package ships a `binary` field that breaks the Electron build chain.
- This patch must remain visible during dependency review until the project either replaces `peer` or upgrades to a version that no longer requires mutation in `node_modules`.

## Operator Checklist

- Status: `Completed`
- Run the dependency gates before release-tag builds.
- Review `package-lock.json` whenever `package.json` overrides change.
- Re-run `npm audit --omit=dev` after dependency updates, even when the update looked tooling-only.
- Treat every new `process.env.GEMDUEL_*` usage as a governance event that requires policy and doc updates.
- Keep the SBOM snapshot and license allowlist in sync with `package-lock.json`.
