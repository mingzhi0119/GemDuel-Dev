# ADR 0010: Engineering audit draft from governance artifacts

## Status

Accepted

## Context

Lifecycle certification (`pnpm lifecycle:certify`) aggregates dashboard, audit gates, governance report, and certification scorecard JSON under `artifacts/governance/`. When certification fails in CI, maintainers need a fast, repeatable scaffold to start a remediation write-up without implying a formal audit.

## Decision

1. **`tools/scripts/draft-audit-report.mjs`** reads the same four JSON blobs written during certification:
    - `lifecycle-governance.dashboard.json`
    - `lifecycle-certification.report.json`
    - `audit-gates.report.json`
    - `lifecycle-governance.report.json`

2. **Default output path** is `artifacts/governance/engineering-audit-draft-<UTC-YYYY-MM-DD>.md` so the file is picked up by the governance evidence artifact upload (`.gitignore` already ignores `artifacts/governance`).

3. **Equivalence to `docs/archive/` drafts:** A manually curated draft may still live under `docs/archive/` (e.g. `engineering-audit-draft-<date>.md`). The generated file is a **non-authoritative sibling** for CI triage only; it is not a substitute for archived engineering narrative unless promoted explicitly in a PR.

4. **CI wiring:** `.github/workflows/governance-evidence.yml` runs the draft generator **only** when the `Lifecycle Certification` step fails (`failure() && steps.certify.outcome == 'failure'`), so unrelated job failures do not emit misleading drafts.

5. **Naming and claims:** The markdown banner states that the document is **not** a formal audit and must not be cited as independent assurance.

## Consequences

- Release Engineering owns the script and workflow step.
- Consumers must treat the draft as governance-derived notes; scores and tables mirror JSON at failure time and may be incomplete for human narrative.
