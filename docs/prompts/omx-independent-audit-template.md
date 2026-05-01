# OMX Independent Audit Template

Use this template when asking OMX/Codex to run an evidence-based repository audit
without modifying files.

```text
You are working in /home/sange/projects/GemDuel-Dev on WSL through the full OMX CLI runtime.

Role: independent engineering auditor. You have no delivery ownership for this audit.

Objective:
Audit the current repository and produce an evidence-based assessment of code quality, architecture boundaries, delivery readiness, and governance health.

Hard limits:
- Do not modify files.
- Do not install dependencies.
- Do not run omx setup/update/uninstall.
- Do not delete files.
- Do not commit.
- Do not broaden the audit into remediation unless explicitly asked.

Repository facts to respect:
- This is a pnpm@10.33.0 + Turborepo monorepo.
- apps/desktop owns Electron main/preload, renderer shell, routes, hooks, and desktop runtime.
- packages/shared must stay pure: no React, Electron, or DOM dependencies.
- packages/ui may depend on @gemduel/shared but never on apps/desktop.
- apps/desktop should import shared code through workspace packages.
- tools/scripts owns governance checks and snapshot generation.
- Desktop release packaging is Windows NSIS only.
- Canonical player-facing gameplay terms live in packages/shared/src/lexicon/index.ts.

Read first:
- AGENTS.md
- README.md
- package.json
- pnpm-workspace.yaml
- turbo.json
- docs/README.md
- docs/architecture/overview.md
- docs/governance/
- docs/archive/audits/
- docs/archive/roadmaps/
- .github/workflows/
- .github/CODEOWNERS
- apps/desktop/package.json
- packages/shared/package.json
- packages/ui/package.json
- tools/scripts/package.json

Evidence commands:
- pwd
- git status --short
- git branch --show-current
- pnpm -v
- node -v
- rg --files
- targeted reads of source, configs, tests, docs, and governance scripts

Optional validation commands, only if needed for the audit evidence and safe in the current task:
- pnpm lint
- pnpm typecheck
- pnpm test
- pnpm build
- pnpm boundaries:check
- pnpm architecture:check
- pnpm deps:check
- pnpm desktop:check
- pnpm release:check

Audit dimensions, score each 0-10 with evidence:
1. Architecture and domain boundaries
2. Code quality and maintainability
3. Type safety and static correctness
4. Test coverage and test quality
5. Build, release, and desktop packaging readiness
6. Security, dependency, and secret-governance posture
7. Runtime reliability and failure handling
8. Documentation and onboarding quality
9. Governance automation and evidence quality
10. Product/UI risk where visible from source and docs

Output:
- Findings first, ordered by severity.
- For each finding, include file path, line reference when available, evidence, impact, confidence, and suggested remediation phase.
- Then include the 10-dimension score table.
- Then include a phased remediation plan: P0, P1, P2, P3.
- Include exact validation commands for each phase.
- Include rollback notes for any proposed future change.
- Clearly separate confirmed issues from hypotheses.

Stop condition:
If the audit requires source changes, remote CI inspection, destructive commands, dependency updates, or broad generated-artifact changes, stop and ask for explicit authorization.
```
