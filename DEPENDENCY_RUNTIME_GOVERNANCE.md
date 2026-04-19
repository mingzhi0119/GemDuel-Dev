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
- Runtime Electron environment variables and their ownership.
- Secret-handling rules for ICE and TURN configuration.
- Temporary package exceptions that still require follow-up ownership.

## Production Dependency Policy

- Status: `Completed`
- Release gate: `npm run deps:check`
- CI coverage:
- The release workflow runs the dependency governance check before lint, test, and build.
- The scheduled dependency workflow runs the same check on a weekly cadence and on manual dispatch.
- Enforcement rules:
- `npm audit --omit=dev --json` must report zero production vulnerabilities.
- Security overrides in `package.json` are treated as governed policy, not ad hoc local fixes.
- Release builds must use `npm ci` so the audited lockfile is the shipped lockfile.

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
- Run `npm run deps:check` before release-tag builds.
- Review `package-lock.json` whenever `package.json` overrides change.
- Re-run `npm audit --omit=dev` after dependency updates, even when the update looked tooling-only.
- Treat every new `process.env.GEMDUEL_*` usage in `electron/main.js` as a governance event that requires policy and doc updates.
