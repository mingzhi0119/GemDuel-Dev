# Engineering Governance Phase 4 Reassessment

Reassessment date: `2026-04-19`

Scope: observability / operations closure and dependency / configuration governance hardening from `ENGINEERING_GOVERNANCE_9_OF_10_AUDIT_PLAN_2026-04-19.md`

## Delivered in Phase 4

- Added `OPERATIONS_SLO.md`, `OPERATIONS_FAULT_DRILLS.md`, and `electron/governance/release-health-operations.snapshot.json` so desktop release-health now has explicit thresholds, alert routing, drill expectations, and a machine-readable operations contract.
- Added `scripts/releaseHealthReport.js` and `scripts/export-release-health-report.mjs` so raw `[RELEASE_HEALTH]` event logs and summary lines can be exported into a deterministic report artifact with thresholds, alerts, summaries, and drill metadata.
- Expanded `scripts/check-release-health.mjs`, `scripts/releaseHealthChecklist.js`, and `scripts/__tests__/releaseHealthOperations.test.ts` so release-health governance verifies the exporter path, asset alignment, threshold drift, and drill coverage instead of checking only a static checklist.
- Added `governance/dependency-license-allowlist.json` and `governance/dependency-sbom.snapshot.json` so the shipped lockfile now has both a governed license policy and a deterministic SBOM snapshot.
- Added `scripts/check-license-governance.mjs`, `scripts/check-sbom-governance.mjs`, and `scripts/check-secret-governance.mjs`, then extended `scripts/dependencyGovernance.js` to enforce allowlisted licenses, SBOM drift detection, high-confidence secret scanning, and `process.env.GEMDUEL_*` ownership/documentation drift checks.
- Updated `DEPENDENCY_RUNTIME_GOVERNANCE.md`, `.github/workflows/dependency-governance.yml`, `.github/workflows/governance.yml`, `.github/workflows/build.yml`, and `package.json` so the new governance gates run through first-class `npm run` entrypoints in PR, schedule, and release paths, with the SBOM uploaded as a CI artifact.

## Verification Evidence

| Check                    | Result | Notes                                                                             |
| ------------------------ | ------ | --------------------------------------------------------------------------------- |
| `npm run licenses:check` | Passed | License allowlist gate green with `13` governed expressions                       |
| `npm run sbom:check`     | Passed | SBOM snapshot matched live lockfile, `891` components / `13` license buckets      |
| `npm run secrets:check`  | Passed | Secret/env drift gate scanned `148` text files and found `4` governed env names   |
| `npm run release:check`  | Passed | Release-health checklist plus SLO/drill contract both matched live assets         |
| `npm run lint`           | Passed | No lint violations                                                                |
| `npm run deps:check`     | Passed | Production audit summary stayed `0/0/0/0/0`                                       |
| `npm run desktop:check`  | Passed | Electron governance drift audit remained green                                    |
| `npm run test:security`  | Passed | `11` governance/security-focused files, `49` tests                                |
| `npm test`               | Passed | `46` test files / `260` tests passed                                              |
| `npm run test:coverage`  | Passed | `Statements 88.29% / Branches 81.50% / Functions 92.08% / Lines 88.29%`           |
| `npm run build`          | Passed | Production build succeeded; main chunk warning (`733.73 kB`) remains non-blocking |

Coverage delta vs. Phase 3 reassessment:

- Statements: `87.56% -> 88.29%`
- Branches: `80.80% -> 81.50%`
- Functions: `90.98% -> 92.08%`
- Lines: `87.56% -> 88.29%`

## Updated Engineering Scores

| Dimension                             | Before   | After    | Rationale                                                                                                                                    |
| ------------------------------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Correctness                           | `9.0/10` | `9.0/10` | Phase 4 focused on operational closure and supply-chain governance rather than changing core domain correctness                              |
| Boundary Security                     | `9.0/10` | `9.1/10` | Secret scanning and governed runtime-env drift checks now protect repo, workflow, and doc boundaries in addition to code-time validators     |
| State Machine Consistency             | `9.0/10` | `9.0/10` | No material Phase 4 change to the FSM policy or phase/action matrix single-source-of-truth                                                   |
| Online Authority                      | `9.1/10` | `9.1/10` | Authority and recovery paths stayed strong, but short-lived TURN credentials are still not implemented                                       |
| Electron Security                     | `9.0/10` | `9.1/10` | Release-health governance is now machine-auditable through exportable reports, threshold snapshots, and drill-backed checklist checks        |
| Architecture Layering                 | `8.9/10` | `8.9/10` | Phase 4 preserved the earlier modular gains but did not materially simplify remaining architectural hot spots                                |
| Type Contracts                        | `8.8/10` | `8.8/10` | Contract quality held, but this phase did not advance the schema-first/type-split backlog                                                    |
| Test Coverage                         | `9.3/10` | `9.4/10` | New governance suites for release-health operations and dependency governance lifted already-strong coverage above the Phase 3 baseline      |
| Observability / Operations            | `7.9/10` | `9.2/10` | The repo now has exportable health artifacts, SLO thresholds, alert routing, drill definitions, and automated verification for drift         |
| Dependency / Configuration Governance | `8.4/10` | `9.3/10` | Vulnerability checks are now backed by license allowlists, deterministic SBOMs, secret scanning, env-drift audits, and CI artifact retention |

### Reassessed total

`9.0/10 -> 9.2/10`

## Phase 4 Status

| Plan Item                                         | Status      | Notes                                                                                                |
| ------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `9.1` Release-health export artifact              | `Completed` | `scripts/export-release-health-report.mjs` and `scripts/releaseHealthReport.js` landed               |
| `9.2` SLO and alert threshold policy              | `Completed` | `OPERATIONS_SLO.md` plus `release-health-operations.snapshot.json` now define healthy/warn/incident  |
| `9.3` Monthly fault-drill checklist               | `Completed` | `OPERATIONS_FAULT_DRILLS.md` captures updater, IPC reject, and network recovery drills               |
| `10.1` SBOM and license governance workflow       | `Completed` | Allowlist + SBOM gates are wired into CI and release paths                                           |
| `10.2` Secret scanning and env change audit rules | `Completed` | Secret/env drift checks now fail the gate when repo or docs drift from runtime policy                |
| `10.3` Short-lived TURN credential delivery       | `Blocked`   | Runtime injection is governed, but there is still no in-repo authenticated issuer for ephemeral TURN |

## Residual Risks

1. `GEMDUEL_ICE_SERVERS_JSON` is now governed and secret-scanned, but TURN credentials are still runtime-injected rather than server-issued and short-lived.
2. `src/hooks/useGameNetwork.ts` remains the weakest included hook for file-level coverage at `68.70%` statements / `48.27%` branches, even though its critical recovery paths are tested.
3. The main Vite application chunk is still `733.73 kB`, so bundle-size governance remains an operational cleanup item even though the build is green.
4. Architecture and contract cleanup from earlier phases still cap how far the overall score can move without a structural follow-on pass.

## Recommended Next Steps

1. Treat short-lived TURN credential issuance as the next governance blocker so `Dependency / Configuration Governance` and `Online Authority` can both move higher without caveats.
2. Keep reducing `useGameNetwork.ts` complexity or add more branch-focused hook tests so the lowest remaining coverage hotspot stops pulling down evidence quality.
3. Address the non-blocking bundle-size warning with targeted code-splitting or chunk strategy work, since Phase 4 has already closed the larger observability and supply-chain gaps.
