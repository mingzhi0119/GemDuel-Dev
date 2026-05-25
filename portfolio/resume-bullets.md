# GemDuel Resume Bullet Candidates

Rules followed: no unsupported metrics, no production/user/revenue claims, no completed Unity migration claim, and no "comprehensive CI/CD" wording while lifecycle verification is currently failing.

## Target role: SWE

### Bullet candidate 1

Recruiter version:

- Built a React, TypeScript, and Electron desktop game monorepo with separated domain logic, UI components, desktop runtime code, and governance tooling.

Engineer version:

- Maintained a pnpm/Turborepo workspace for GemDuel, separating Electron runtime code in `apps/desktop`, pure game/domain logic in `packages/shared`, reusable React UI in `packages/ui`, and governance scripts in `tools/scripts`.

Evidence:

- Evidence IDs: E001, E008
- Files/commits/tests: `README.md:3`, `README.md:54-59`, direct workspace typechecks passed
- Confidence: High
- Safe because: It describes repository structure and verified TypeScript checks.
- Do not say: production-ready, launched, user-facing production platform
- Interview expansion: Explain workspace boundaries and why shared logic stays UI-free.

### Bullet candidate 2

Recruiter version:

- Implemented replay infrastructure for GemDuel gameplay review, including schema validation, state hashing, replay summaries, and audit tooling.

Engineer version:

- Added Replay vNext save/read/load/audit surfaces with final-state hashing and schema validation, plus backend AI replay generation and audit scripts for repeatable QA samples.

Evidence:

- Evidence IDs: E003, E008
- Files/commits/tests: `docs/guides/replay-vnext.md:55-71`, `packages/shared/src/replay/writer.ts:50-109`, replay tests passed inside the desktop run
- Confidence: High
- Safe because: It cites concrete modules and tests.
- Do not say: guaranteed replay correctness, full legacy migration
- Interview expansion: Walk through how replay state hash and summary validation catch drift.

### Bullet candidate 3

Recruiter version:

- Built network replay synchronization safeguards that compare revisions and state hashes before accepting authoritative replay updates.

Engineer version:

- Implemented authoritative replay sync logic with full/delta sync handling, stale packet detection, revision guards, and `STATE_HASH_MISMATCH` recovery paths.

Evidence:

- Evidence IDs: E005, E008
- Files/commits/tests: `apps/desktop/src/hooks/gameNetwork/useAuthoritativeReplaySync.ts:28-84`, test file lines `89-168`
- Confidence: High
- Safe because: It limits the claim to implemented logic and tests.
- Do not say: reliable multiplayer, production network stability
- Interview expansion: Explain the difference between full sync and delta sync, and why stale revisions are rejected.

## Target role: DevTools

### Bullet candidate 1

Recruiter version:

- Built Visual Lab dev tooling for reviewing GemDuel surface themes with candidate loading, ratings, comments, and persisted review state.

Engineer version:

- Implemented dev-only Visual Lab support through Vite `/__surface-lab/*` endpoints and React review controls for candidate assets, ratings, comments, and shared review-state hydration.

Evidence:

- Evidence IDs: E007, E008
- Files/commits/tests: `apps/desktop/vite.config.ts:223-412`, `apps/desktop/src/app/visual-lab/__tests__/visualLabRouteSmoke.test.tsx:328-1189`
- Confidence: High
- Safe because: It is scoped to dev tooling and tested flows.
- Do not say: production art pipeline
- Interview expansion: Discuss why the tool is gated from stock production bundles.

### Bullet candidate 2

Recruiter version:

- Added repo governance scripts that check architecture budgets, package boundaries, desktop policies, dependency rules, and release health.

Engineer version:

- Maintained Node-based governance checks for architecture budget contracts, boundary registry drift, Electron preload policy, dependency snapshots, and release-health checklists.

Evidence:

- Evidence IDs: E006, E008
- Files/commits/tests: `docs/governance/architecture-layer-map.md:10-17`, `tools/scripts/architectureBudgets.js:187-292`, `tools/scripts/boundaryGovernance.js:42-168`
- Confidence: Medium
- Safe because: Checks exist and most direct checks passed.
- Do not say: CI is fully green today
- Interview expansion: Explain how generated snapshots and human-readable docs stay aligned.

### Bullet candidate 3

Recruiter version:

- Documented agent-assisted workflows for scoped repository work, visual asset review, and governance-oriented handoffs.

Engineer version:

- Used Codex/OMX workflow docs and Visual Lab cleanup templates to define scope, verification commands, artifact ownership, and stop conditions for long-running engineering tasks.

Evidence:

- Evidence IDs: E006, E007, E009
- Files/commits/tests: `docs/omx-workflow.md:22-35`, `docs/omx-workflow.md:376-430`, `docs/prompts/omx-visual-lab-cleanup-template.md:14-16`
- Confidence: Medium
- Safe because: It claims documented workflow artifacts, not productivity metrics.
- Do not say: AI automated development
- Interview expansion: Discuss how agent work is constrained by repo rules and verification gates.

## Target role: QA Automation

### Bullet candidate 1

Recruiter version:

- Added replay roundtrip tests that import a completed replay, navigate through replay history, and re-export valid replay JSON.

Engineer version:

- Covered a UI-level Replay vNext roundtrip path in Vitest: import a completed fixture, sweep undo/redo across each replay step, and verify exported replay JSON through the same import boundary.

Evidence:

- Evidence IDs: E004, E008
- Files/commits/tests: `apps/desktop/src/__tests__/replayRoundtrip.test.tsx:518-592`
- Confidence: High
- Safe because: It names the exact tested path.
- Do not say: end-to-end replay parity
- Interview expansion: Show the harness, fixture, and export assertion.

### Bullet candidate 2

Recruiter version:

- Added backend replay simulation and audit tests for AI-generated gameplay samples, including buff-enabled replay stability checks.

Engineer version:

- Tested `simulateAiVsAiReplay` and `simulateAiVsAiReplayBatch` against schema validation, final-state hashes, and command/FSM warning expectations for buff-enabled runs.

Evidence:

- Evidence IDs: E003, E008
- Files/commits/tests: `packages/shared/src/replay/__tests__/simulation.test.ts:15-120`
- Confidence: High
- Safe because: It is specific to backend simulation tests.
- Do not say: exhaustive gameplay coverage
- Interview expansion: Explain how generated replay samples can become regression fixtures.

### Bullet candidate 3

Recruiter version:

- Maintained tests for network authority and replay recovery behavior, including stale revision and state-hash mismatch handling.

Engineer version:

- Covered authoritative replay sync with full replay replacement, stale full replay skipping, newer revision retention, and delta sync revision checks.

Evidence:

- Evidence IDs: E005, E008
- Files/commits/tests: `apps/desktop/src/hooks/gameNetwork/__tests__/useAuthoritativeReplaySync.test.tsx:89-168`
- Confidence: High
- Safe because: It cites narrow behavioral tests.
- Do not say: guaranteed multiplayer reliability
- Interview expansion: Discuss failure modes that trigger recovery instead of accepting bad state.

## Target role: Build/Release

### Bullet candidate 1

Recruiter version:

- Configured Windows desktop release checks around Electron build settings, release health, dependency governance, and artifact evidence.

Engineer version:

- Maintained Windows NSIS Electron packaging configuration and local/CI release gates for dependency, desktop, release-health, provenance, and governance evidence checks.

Evidence:

- Evidence IDs: E001, E002, E006, E008
- Files/commits/tests: `README.md:5`, `apps/desktop/package.json:66-92`, `.github/workflows/build.yml:13-14`, `153-169`
- Confidence: Medium
- Safe because: It names configuration and checks without claiming a shipped release.
- Do not say: deployed, published, production release
- Interview expansion: Explain why the repo limits desktop packaging to Windows NSIS.

### Bullet candidate 2

Recruiter version:

- Added architecture and boundary gates that fail when cross-layer imports or governed boundary snapshots drift.

Engineer version:

- Implemented architecture-budget parsing and boundary registry validation against machine-readable governance snapshots and human-readable docs.

Evidence:

- Evidence IDs: E006, E008
- Files/commits/tests: `docs/governance/architecture-layer-map.md:32-146`, `tools/scripts/check-boundary-governance.mjs:5-40`
- Confidence: High for direct checks; Medium for CI status
- Safe because: Direct checks passed in this run.
- Do not say: comprehensive architecture governance
- Interview expansion: Walk through a forbidden import example and a missing boundary-ref failure.

### Bullet candidate 3

Recruiter version:

- Kept release evidence honest by recording current lifecycle certification failures instead of treating partially passing checks as green.

Engineer version:

- Ran direct governance checks and documented that `tools/scripts` and `desktop` test suites currently fail lifecycle/seal-exclusion review tests, while architecture, boundary, desktop, dependency, and release checks pass.

Evidence:

- Evidence IDs: E008
- Files/commits/tests: current command results in `portfolio/evidence-ledger.md`
- Confidence: High
- Safe because: It is a truth-audit/process claim, not a success claim.
- Do not say: all CI checks pass
- Interview expansion: Explain how stale seal-exclusion reviews should be renewed before claiming certification.

## Target role: Game Tools

### Bullet candidate 1

Recruiter version:

- Built developer tools for reviewing board-game surface assets with ratings, comments, and candidate preview data.

Engineer version:

- Implemented Visual Lab candidate discovery and review-state persistence for surface/theme candidates through Vite middleware and React controls.

Evidence:

- Evidence IDs: E007, E008
- Files/commits/tests: `apps/desktop/vite.config.ts:223-412`, Visual Lab route smoke tests
- Confidence: High
- Safe because: It claims internal tooling only.
- Do not say: release asset pipeline
- Interview expansion: Show how candidates are loaded and how review state is written.

### Bullet candidate 2

Recruiter version:

- Built replay tooling that can generate, audit, and inspect gameplay samples without adding a frontend AI-vs-AI mode.

Engineer version:

- Added backend-only AI replay generation and audit scripts that call shared replay APIs, write Replay vNext JSON, and summarize winner/hash/evaluation fields.

Evidence:

- Evidence IDs: E003, E008
- Files/commits/tests: `README.md:37-49`, `tools/scripts/generate-ai-replays.mjs:38-45`, `146-164`, `tools/scripts/audit-ai-replays.mjs:267-362`
- Confidence: High
- Safe because: It describes scripts and outputs, not model quality.
- Do not say: AI gameplay mode shipped
- Interview expansion: Explain why backend-only replay generation helps testing without changing UX.

### Bullet candidate 3

Recruiter version:

- Documented a staged Unity migration path that preserves the TypeScript game as the rules oracle until replay parity is proven.

Engineer version:

- Wrote or maintained Unity migration docs that require a vertical slice, replay/action parity gates, and TypeScript rules-oracle validation before full client migration.

Evidence:

- Evidence IDs: E009
- Files/commits/tests: `docs/archive/audits/unity-migration-suitability-assessment-2026-05-04.md:12-14`, `73-85`, roadmap lines `140-158`
- Confidence: Medium for docs, Low for implementation wording
- Safe because: It is explicitly documented/staged, not claimed complete.
- Do not say: migrated GemDuel to Unity
- Interview expansion: Explain what would need to pass before a Unity claim becomes resume-ready.

## Target role: AI-assisted Engineering

### Bullet candidate 1

Recruiter version:

- Used evidence-ledger workflows to keep AI-assisted portfolio claims tied to repository files, tests, and current command results.

Engineer version:

- Created an evidence-first portfolio workflow that maps each resume claim to code paths, line references, latest command results, and rejected stronger wording.

Evidence:

- Evidence IDs: E008 plus this portfolio set
- Files/commits/tests: `portfolio/evidence-ledger.md`, `portfolio/claim-bank.md`, `portfolio/truth-audit.md`
- Confidence: High after these files are created
- Safe because: It describes this audit artifact.
- Do not say: AI wrote or verified everything independently
- Interview expansion: Explain why evidence-first wording prevents overclaiming.

### Bullet candidate 2

Recruiter version:

- Documented Codex/OMX operating guidance for scoped repo changes, verification commands, and workspace-boundary discipline.

Engineer version:

- Maintained Codex workflow documentation that defines repository context gathering, workspace targets, verification scope, rollback instructions, and stop conditions.

Evidence:

- Evidence IDs: E006, E007
- Files/commits/tests: `docs/omx-workflow.md:349-358`, `376-430`, `465-497`
- Confidence: Medium
- Safe because: It claims workflow documentation, not measured productivity.
- Do not say: autonomous AI engineering platform
- Interview expansion: Discuss how human judgment remains responsible for scope and verification.

### Bullet candidate 3

Recruiter version:

- Built review prompts and tooling around Visual Lab so generated visual assets remain tied to human ratings, comments, and runtime constraints.

Engineer version:

- Used Visual Lab cleanup templates and review-state tooling to preserve human ratings/comments, generate replacement prompts, and verify the review route loads.

Evidence:

- Evidence IDs: E007
- Files/commits/tests: `docs/prompts/omx-visual-lab-cleanup-template.md:14-16`, `62-64`, `99-103`, `129`
- Confidence: Medium
- Safe because: It is scoped to review workflow, not release asset approval.
- Do not say: AI-generated production art pipeline
- Interview expansion: Explain how comments and ratings inform replacement prompts.
