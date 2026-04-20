# Engineering Governance Archive

This file replaces the previous pile of roadmap, phase, reassessment, and audit markdown files.

## Current Carry-Forward State

- Latest archived score: `9.9/10`
- Latest archived date: `2026-04-20`
- Current conclusion: the repo already has strong machine-checked governance, but the archive stopped short of a full `10.0/10` seal because two hard gates were still softer than the ideal bar:
    - architecture ownership and budget rules are documented, but not enforced by a dedicated CI gate
    - coverage posture is strong, but the irreversible thresholds in `vitest.config.ts` are still below the stricter `10.0/10` target

## Timeline

| Stage                                  | Archived Outcome                                                                                                                                                                                                                             |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `8/10` roadmap                         | Governance moved from issue tracker style work into a broader engineering scorecard covering correctness, boundaries, Electron, testing, operations, and dependency policy.                                                                  |
| `9/10` roadmap and Phase 1-5 reviews   | The repo crossed the `9.0/10` line by separating major contracts, hardening trust boundaries, adding runtime fault coverage, and closing the biggest governance hotspots.                                                                    |
| `9.5/10` roadmap and Phase A-D reviews | Governance became machine-readable and release-coupled: boundary registry, release-health snapshots, retained artifacts, and stronger hotspot coverage pushed all ten dimensions to `>= 9.5/10`, with the working score landing at `9.6/10`. |
| `10.0/10` roadmap and final audit      | A later independent review moved the repo from `9.6/10` to `9.9/10`. Earlier blockers such as `patch-peer`, missing short-lived TURN lifecycle governance, and weak contract traceability were considered closed.                            |

## What Actually Stuck

- Boundary, dependency, desktop, and release-health governance are now backed by scripts and snapshots, not prose alone.
- The Electron surface is governed through an allowlist, BrowserWindow policy checks, and runtime drill evidence.
- Release artifacts now retain governance evidence as a first-class batch output.
- The remaining archive gap is now about tightening irreversible gates, not about missing baseline governance.

## Archived Sources

This archive condenses the following files:

- `AUDIT_REMEDIATION_TRACKER_ARCHIVED_2026-04-19.md`
- `archive/governance/ENGINEERING_GOVERNANCE_ROADMAP_8_OF_10_ARCHIVED_2026-04-19.md`
- `ENGINEERING_GOVERNANCE_9_OF_10_AUDIT_PLAN_2026-04-19.md`
- `ENGINEERING_GOVERNANCE_PHASE1_REASSESSMENT_2026-04-19.md`
- `ENGINEERING_GOVERNANCE_PHASE2_REASSESSMENT_2026-04-19.md`
- `ENGINEERING_GOVERNANCE_PHASE3_REASSESSMENT_2026-04-19.md`
- `ENGINEERING_GOVERNANCE_PHASE4_REASSESSMENT_2026-04-19.md`
- `ENGINEERING_GOVERNANCE_PHASE5_FINAL_AUDIT_2026-04-19.md`
- `ENGINEERING_GOVERNANCE_9_5_OF_10_AUDIT_PLAN_2026-04-19.md`
- `ENGINEERING_GOVERNANCE_PHASE_A_REASSESSMENT_2026-04-19.md`
- `ENGINEERING_GOVERNANCE_PHASE_B_REASSESSMENT_2026-04-19.md`
- `ENGINEERING_GOVERNANCE_PHASE_C_REASSESSMENT_2026-04-19.md`
- `ENGINEERING_GOVERNANCE_PHASE_D_REASSESSMENT_2026-04-19.md`
- `ENGINEERING_GOVERNANCE_10_0_OF_10_AUDIT_PLAN_2026-04-20.md`
- `ENGINEERING_GOVERNANCE_PHASE5_FINAL_AUDIT_2026-04-20.md`
