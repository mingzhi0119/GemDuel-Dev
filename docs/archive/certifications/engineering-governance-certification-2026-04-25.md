# Engineering Governance Certification 2026-04-25

## Summary

This certification records the post-remediation lifecycle governance target for GemDuel-Dev. It uses `docs/archive/audits/engineering-audit-report-2026-04-25.md` as the original audit scope anchor and certifies repo-contained governance only.

Live GitHub repository settings are excluded from this local score for now. Branch protection, rulesets, and vulnerability-alert drift remain documented by `tools/governance/repo-settings.snapshot.json` and the optional read-only `pnpm repo-settings:check -- --live` command, but they are not blockers for this 10/10 local certification.

## Local Score

Target score: `10/10`

The authoritative generated evidence is:

- `artifacts/governance/lifecycle-certification.report.json`
- `artifacts/governance/lifecycle-certification.report.md`
- `artifacts/governance/lifecycle-governance.dashboard.json`
- `artifacts/governance/lifecycle-governance.dashboard.md`
- `artifacts/governance/governance-evidence.manifest.json`

## Certification Gate

Run the certification after the lifecycle evidence producers have run:

```bash
pnpm test:coverage
pnpm build
pnpm bundle:check
pnpm bench
pnpm audit:gates
pnpm governance:report
pnpm lifecycle:certify
```

`pnpm lifecycle:certify` fails when local evidence is missing, branch coverage drops below the seal threshold, architecture warnings return, seal-exclusion review metadata is incomplete, benchmark reports are absent, or the lifecycle dashboard is not complete.

## Remote Settings Exclusion

Remote GitHub settings remain external follow-up work. The repository keeps desired-state and live drift tooling, but this certification intentionally scores only the code, docs, snapshots, workflows, and generated local evidence committed to the repo.
