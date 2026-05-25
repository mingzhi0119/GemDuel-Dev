# Interview Stories

## Story 1: Debugging / Replay Parity

Situation: GemDuel has complex game-state transitions, so manual regression testing is not enough to defend replay behavior.

Task: Make replay behavior inspectable and testable without relying on vague "it works on my machine" claims.

Action: I worked around Replay vNext APIs for save/read/load, final-state hashing, replay summaries, backend simulation, audit tooling, and a UI replay roundtrip test that imports, navigates, and re-exports a completed replay.

Result: The repo has concrete replay evidence in shared replay tests and desktop UI tests. Current replay tests passed in the latest desktop run, though the full command failed for unrelated lifecycle governance staleness.

Evidence IDs: E003, E004, E008.

What I would do differently: Add a small screenshot/video demo and maintain a curated golden replay corpus for interviews.

## Story 2: Testing / CI

Situation: The repo has many areas that can drift: package boundaries, Electron bridge policy, release checks, dependency evidence, and lifecycle governance.

Task: Keep local and CI checks explicit enough that a future change can fail with a clear reason.

Action: I used architecture-budget checks, boundary registry validation, desktop governance checks, dependency governance, and release-health checks. I also recorded the current failure honestly: lifecycle seal-exclusion reviews are overdue.

Result: Direct architecture, boundary, desktop, dependency, and release checks passed locally. Full test suites currently fail 8 lifecycle/governance tests, which is useful missing-evidence signal rather than something to hide.

Evidence IDs: E006, E008.

What I would do differently: Renew seal-exclusion reviews on a predictable calendar before they block certification.

## Story 3: Migration / Tooling

Situation: Unity might be a better long-term client path for Steam/mobile/console-style distribution, but a rewrite can easily erase working TypeScript rules and tests.

Task: Make the migration path evidence-based rather than treating Unity as a shortcut.

Action: The repo documents a staged approach: keep TypeScript as the rules oracle, build a limited vertical slice, and require replay/action parity before a full migration. I also inspected the remote Unity parity candidate branch without claiming it is merged or verified on `main`.

Result: Unity claims can be safely framed as documented migration planning and branch evidence pending verification, not completed migration.

Evidence IDs: E009.

What I would do differently: Use a separate worktree to verify the Unity branch and capture command logs before mentioning implementation details on a resume.

## Story 4: AI-assisted Workflow / Governance

Situation: AI-assisted coding can produce convincing but unsupported claims if the process starts with polished bullets instead of evidence.

Task: Build portfolio material that is useful for recruiters and senior engineers without inventing metrics or overclaiming.

Action: I created an evidence ledger first, then extracted a claim bank, resume bullets, portfolio artifacts, and a truth audit. Every strong claim has evidence IDs, rejected wording, and confidence.

Result: The portfolio now has defensible language for SWE, QA automation, DevTools, Build/Release, Game Tools, and AI-assisted engineering roles, plus a GPT Pro handoff for editorial review.

Evidence IDs: E001-E009.

What I would do differently: After GPT Pro edits wording, run a second Codex verification pass before copying any bullet into a resume.
