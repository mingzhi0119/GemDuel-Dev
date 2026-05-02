# Six-Subagent Engineering Audit Prompt 2026-05-02

Use this prompt to run a new independent engineering audit of the current `GemDuel-Dev` repository. The audit must be evidence-based, read-only, and split across six specialist subagents before the main agent writes the final report.

```text
You are the main agent for an independent engineering audit of /home/sange/projects/GemDuel-Dev.

Role:
- Main Agent: audit coordinator, evidence reconciler, final report author.
- Six Subagents: specialist auditors assigned to different repository surfaces.

Hard limits:
- Do not modify files.
- Do not install dependencies.
- Do not delete files.
- Do not commit.
- Do not contact production systems.
- Do not inspect remote CI unless explicitly authorized.
- Treat local repository evidence as primary.

Repository facts to respect:
- This is a pnpm@10.33.0 + Turborepo monorepo.
- Use pnpm from the repo root.
- apps/desktop owns Electron main/preload, renderer shell, routes, hooks, and desktop runtime.
- packages/shared must stay pure: no React, Electron, or DOM dependencies.
- packages/ui may depend on @gemduel/shared but never on apps/desktop.
- apps/desktop should import shared code through workspace packages, not cross-directory relative paths.
- tools/scripts owns governance checks and snapshot generation.
- Desktop release packaging is Windows NSIS only. Do not recommend macOS/Linux packaging expansion unless requested.
- Canonical player-facing gameplay terms live in packages/shared/src/lexicon/index.ts.
- Runtime card IDs must follow the repository's AGENTS.md card-id policy.
- Replay/ outputs are local artifacts and must stay untracked unless policy changes are explicitly requested.

Read first:
- AGENTS.md
- README.md
- package.json
- pnpm-workspace.yaml
- turbo.json
- docs/README.md
- docs/architecture/overview.md
- docs/governance/
- docs/adr/
- docs/archive/audits/
- docs/archive/roadmaps/remaining-unstarted-backlog-2026-05-02.md
- .github/workflows/
- .github/CODEOWNERS

Initial evidence commands:
- pwd
- git status --short
- git branch --show-current
- node -v
- pnpm -v
- rg --files

Optional local validation commands, only if useful and affordable for the audit:
- pnpm lint
- pnpm typecheck
- pnpm test
- pnpm test:coverage
- pnpm architecture:check
- pnpm boundaries:check
- pnpm deps:check
- pnpm desktop:check
- pnpm release:check
- pnpm build
- pnpm bundle:check
- pnpm test:security
- pnpm governance:artifacts
- pnpm governance:evidence:check
- pnpm lifecycle:certify

## Mandatory six-subagent split

Spawn exactly six subagents. Each subagent must audit only its assigned primary surface, while reading shared governance docs as needed. Each subagent must return a concise markdown report with:

- Scope audited
- Evidence files and commands
- Top confirmed findings
- Hypotheses or uncertain risks, clearly marked
- PN rating for every finding
- Remediation advice
- Concrete implementation steps
- Acceptance criteria and verification commands
- Residual risk after remediation
- Confidence: Low / Medium / High

PN rating scale:
- P0: release blocker, security-critical, data-loss, build cannot ship, or severe correctness break.
- P1: high-risk issue that should be fixed before the next serious release or certification cycle.
- P2: important maintainability, reliability, test, UX, or governance improvement with measurable value.
- P3: structural refactor, cleanup, hardening, or documentation improvement that is not urgent.
- P4: optional polish, low-risk cleanup, or future investigation.

Subagent A: Desktop Runtime, Electron, and Packaging
- Primary scope: apps/desktop/electron, apps/desktop/preload if present, Electron IPC, desktop bootstrap, native window behavior, app startup, safe file IO, packaging assumptions, installer/release integration.
- Also inspect: apps/desktop/package.json, desktop-related tools/scripts checks, release health docs.
- Focus risks: preload/main/renderer trust boundary, IPC validation, startup failure handling, Windows NSIS release readiness, logs and diagnostics.

Subagent B: Renderer App, Routes, Hooks, and Networked App State
- Primary scope: apps/desktop/src, especially app shell, routes, hooks, IO adapters, online/LAN UI flows, replay import, settings, local state, and runtime error handling.
- Also inspect: renderer tests and browser-facing docs.
- Focus risks: state synchronization, stale UI flows, error boundaries, unsafe assumptions in hooks, local-vs-online mode behavior, recoverability.

Subagent C: Shared Domain Logic, Protocol, Data, and Lexicon
- Primary scope: packages/shared/src.
- Also inspect: shared tests, game-rule data, protocol validation, runtime policy, lexicon tests, card/buff data contracts.
- Focus risks: purity boundary violations, rule correctness, protocol/schema validation, deterministic simulation, canonical terminology, card-id migration adherence.

Subagent D: Reusable UI Package, Visual Surfaces, and Component Contracts
- Primary scope: packages/ui/src.
- Also inspect: UI tests, frontend layout docs, visual surface docs, card sizing contracts, reusable components consumed by apps/desktop.
- Focus risks: app dependency leaks, reusable component API drift, accessibility, responsive layout correctness, duplicated UI logic, card display sizing consistency.

Subagent E: TURN Service, Networking Security, and Boundary Enforcement
- Primary scope: packages/turn-service/src plus online/LAN boundary files referenced from apps/desktop and packages/shared.
- Also inspect: security tests, IPC allowlist, dependency/runtime governance, environment variable handling, credential lifetime policy.
- Focus risks: credential exposure, authn/authz gaps, input validation, network message validation, timeout/retry behavior, secret scanning coverage.

Subagent F: Governance Tooling, CI, Monorepo Config, and Release Gates
- Primary scope: tools/scripts, tools/governance, packages/config-*, .github/workflows, root package scripts, turbo config, governance artifacts.
- Also inspect: docs/governance, docs/adr, CODEOWNERS, SECURITY.md, CHANGELOG.md.
- Focus risks: governance scripts drifting from docs, generated snapshot ownership, coverage seal integrity, CODEOWNERS mismatch, dependency/license/SBOM/secrets checks, lifecycle certification reliability.

## Main Agent synthesis requirements

After all six subagents finish:

1. Reconcile duplicate findings and conflicts.
2. Separate confirmed evidence from hypotheses.
3. Preserve each subagent's PN rating, but normalize inconsistent ratings with a short explanation.
4. Produce a single final English markdown audit report.
5. Include a 10-dimension scorecard with scores from 0 to 10.
6. Include a phased remediation plan grouped by P0/P1/P2/P3/P4.
7. Include exact implementation steps for each confirmed remediation item.
8. Include verification commands and acceptance criteria for each item.
9. Include rollback notes for any future code or governance change.
10. Include a "Do Not Do" section for cancelled or out-of-scope recommendations.

Final report scoring dimensions:
1. Architecture and domain boundaries
2. Code quality and maintainability
3. Type safety and static correctness
4. Test coverage and test quality
5. Build, release, and desktop packaging readiness
6. Security, dependency, and secret-governance posture
7. Runtime reliability and failure handling
8. Documentation and onboarding quality
9. Governance automation and evidence quality
10. Product/UI implementation risk visible from source and docs

Final report format:

# GemDuel-Dev Independent Engineering Audit YYYY-MM-DD

## Executive Summary
- Overall score: N.N / 10
- Risk posture: Critical / High / Medium / Low
- One-paragraph summary

## Subagent Coverage Map
| Subagent | Surface | Evidence Count | Highest PN | Confidence |

## Top Findings
Order by PN rating and real-world risk. For each finding include:
- ID
- Title
- PN rating
- Affected files/directories
- Evidence
- Impact
- Recommended remediation
- Concrete steps
- Acceptance criteria
- Verification command(s)
- Rollback note
- Confidence

## Ten-Dimension Scorecard
| Dimension | Score | Evidence Snapshot | Deductions | Confidence |

## Remediation Plan
Group by P0, P1, P2, P3, P4.

For each item include:
- Owner role
- Files/components
- Steps
- Expected output
- Verification
- Rollback

## Governance Alignment Check
- List matching and violated governance requirements.
- Cite docs/governance, docs/adr, AGENTS.md, package scripts, and tool scripts where relevant.

## Subagent Reports
Summarize each subagent report in one short subsection.

## Do Not Do
Include cancelled, stale, or out-of-scope recommendations. At minimum:
- Do not revive Phase 2 right-click / drag direct-buy for market cards; it is cancelled.
- Do not recommend macOS/Linux desktop packaging expansion unless explicitly requested; current release scope is Windows NSIS only.
- Do not propose code changes inside generated governance snapshots unless the owning script requires it.

## Next Review Milestones
- 7-day triage
- 30-day follow-up
- Exit criteria for P0/P1 closure
- Metrics to track monthly

Quality bar:
- Every score below 8 must cite at least one concrete file, directory, command, or missing artifact.
- Every P0/P1/P2 finding must include concrete steps and verification.
- Do not invent files, commands, test results, or CI status.
- If a validation command was not run, say so explicitly.
- Keep the final report concise enough to execute, but detailed enough for another agent to implement from it.
```
