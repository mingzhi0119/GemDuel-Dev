# OMX Workflow for WSL Codex

This document defines the project-level workflow for using the WSL CLI runtime of
oh-my-codex (OMX) with Gem Duel. It is intentionally conservative: OMX should
make the existing `pnpm` + Turborepo workflow easier to operate, not expand the
scope of changes or replace the repository's current governance rules.

## Current Integration State

- Repository path: `/home/sange/projects/GemDuel-Dev`
- Runtime surface: WSL2, not PowerShell-native Codex execution.
- Codex CLI: `/home/sange/.local/bin/codex`, verified as `codex-cli 0.125.0`.
- OMX CLI: `/home/sange/.local/bin/omx`, verified as `oh-my-codex v0.15.2`.
- OMX setup scope: `user`.
- OMX install mode: `legacy`.
- OMX health after setup: `omx doctor` passed with `14 passed, 0 warnings, 0 failed`.
- Local OMX state: `.omx/` contains run state such as `setup-scope.json`, `hud-config.json`, `logs/`, `plans/`, and `state/`.
- Git policy: `.omx/` is local machine state and should not be committed. It is currently ignored through local `.git/info/exclude`.

## Why Use OMX Here

Gem Duel is a multi-workspace Electron game repo with shared domain logic,
desktop runtime code, reusable UI, governance scripts, and a large docs/archive
surface. OMX is useful here because it can keep long-running Codex work organized
around phases, prompts, local state, and verification steps while still using the
repo's existing commands.

OMX does not change the package manager, architecture boundaries, or release
targets. The source of truth remains:

- `package.json` for root scripts.
- `pnpm-workspace.yaml` for workspace membership.
- `turbo.json` for task orchestration.
- `AGENTS.md` for repository-specific Codex rules.
- `docs/` for durable project workflow and governance documentation.

## Recommended Startup

Use the WSL checkout as the working directory:

```bash
cd /home/sange/projects/GemDuel-Dev
```

For normal Codex CLI work through OMX:

```bash
omx
```

For a direct Codex launch without detached tmux/HUD management:

```bash
omx --direct
```

For non-interactive, read-only checks:

```bash
omx exec "Summarize the repository structure. Do not modify files, install dependencies, or commit."
```

Run health checks after OMX updates or machine moves:

```bash
omx doctor
```

Do not run `omx update`, `omx setup --force`, `omx uninstall`, hook changes, or
global configuration changes inside a task unless the user explicitly authorizes
that environment-level change.

## Codex App Usage

The Codex App remains suitable for normal repository edits, code review,
documentation work, browser-assisted UI checks, and small implementation phases.
When using the app:

- Work from `/home/sange/projects/GemDuel-Dev`.
- Use `pnpm` from the repo root.
- Keep changes inside the relevant workspace boundary.
- Use Browser Use at `http://localhost:5173/` for frontend, layout, and motion review when visual verification is requested.
- Do not treat the Codex App plugin surface as equivalent to the full WSL CLI OMX runtime.

## WSL CLI OMX Usage

Use the WSL CLI runtime when the task benefits from structured phase execution,
project memory, native prompts, team-style orchestration, or long-running local
work. Keep it conservative:

- Prefer `omx --direct` for ordinary single-agent work.
- Use `omx` when detached tmux/HUD management is helpful.
- Use `omx exec` only for bounded, clearly worded tasks.
- Use `omx explore` for read-only repository exploration.
- Use `omx doctor` after setup, update, or runtime issues.
- Do not use `--madmax`, `--yolo`, broad hooks, team workers, or global updates unless the prompt explicitly authorizes that risk.

## Managed Prompt Templates

Active OMX-managed prompt templates live in `docs/prompts/`. Historical prompts,
batch records, scoring libraries, and generation evidence stay in `docs/archive/`
or `docs/art/` and should not be rewritten as live templates unless the user asks
for a template refresh.

- `docs/prompts/omx-independent-audit-template.md` - evidence-based read-only engineering audit.
- `docs/prompts/omx-long-surface-asset-generation-template.md` - long-running surface asset candidate-library generation.
- `docs/prompts/omx-visual-lab-cleanup-template.md` - Visual Lab cleanup/replacement generation.

Any OMX-managed prompt that generates images or project assets must explicitly
bind to `/mnt/c/Users/sange/.codex/skills/imagegen-asset-library-flow/SKILL.md`
before planning, generation, collection, archive copying, scoring, or
replacement. Workers may call only the `imagegen` skill and built-in `image_gen`
tool for those tasks; the main agent owns repo writes, normalization, scoring,
and validation.

## Common Commands

Install dependencies only when needed:

```bash
pnpm install
```

Daily renderer/Electron development:

```bash
pnpm electron:dev
```

Renderer-only development:

```bash
pnpm dev
```

Open Electron against an existing renderer:

```bash
pnpm electron:open
```

Production build validation:

```bash
pnpm build
```

Windows desktop packaging validation, only when release packaging is in scope:

```bash
pnpm electron:build
```

Visual Lab surface review commands:

```bash
pnpm visual-lab:surface:review:validate
pnpm visual-lab:surface:review:prepare-replacements
pnpm visual-lab:surface:review:apply
pnpm visual-lab:surface:review:finalize-replacements
```

## Verification Commands

Use the smallest command set that proves the changed surface.

Default gates:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Governance and architecture gates:

```bash
pnpm boundaries:check
pnpm architecture:check
pnpm deps:check
pnpm desktop:check
pnpm release:check
```

Coverage gate:

```bash
pnpm test:coverage
```

Full lifecycle evidence, only when requested:

```bash
pnpm lifecycle:certify
pnpm governance:artifacts
pnpm governance:dashboard
```

Use `pnpm electron:build` only when validating Windows NSIS desktop packaging.

## Good OMX Tasks

OMX is a good fit for:

- Read-only repo audits with explicit evidence.
- Phased implementation plans that must stay inside one workspace boundary.
- Single-phase docs or governance updates.
- Focused bug fixes driven by a concrete failing command or log.
- Long-running verification loops with clear stop conditions.
- Browser-assisted UI work when the prompt explicitly asks for visual verification.
- Prompt-library or workflow documentation that must match current repo commands.

## Poor OMX Tasks

OMX is not a good fit for:

- Unbounded refactors across `apps/`, `packages/`, and `tools/`.
- Deleting files or generated artifacts without a written rollback plan.
- Replacing `pnpm` with another package manager.
- Adding dependencies because a template expects them.
- Moving governance snapshots without updating their owning scripts.
- Expanding desktop release targets beyond Windows NSIS.
- Running `--madmax`, `--yolo`, broad hooks, or global setup changes without explicit approval.
- Committing dirty worktrees that already contain unrelated user changes.

## Single Phase Rules

Every OMX task should name exactly one phase unless the user explicitly asks for
multi-phase execution. A single phase must include:

- Scope: files, workspaces, and behavior allowed to change.
- Non-goals: what must not be touched.
- Commands: exact validation commands to run.
- Stop condition: when the agent must stop and report.
- Rollback: how to revert only the agent's changes.

When the task is docs-only, do not modify source code, generated snapshots, tests,
or package metadata. When the task is implementation, avoid opportunistic cleanup
outside the named phase.

## Commit Rules

Default: do not commit.

Only commit when the user explicitly asks for it and the relevant gates pass.
Before committing:

```bash
git status --short
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Use additional gates when the touched surface requires them:

```bash
pnpm boundaries:check
pnpm architecture:check
pnpm deps:check
pnpm desktop:check
pnpm release:check
pnpm test:coverage
```

A focused OMX workflow commit message for this document would be:

```text
chore: document OMX workflow for WSL Codex
```

Never include unrelated formatting, unrelated refactors, generated local OMX
state, or user-authored dirty worktree changes in the same commit.

## Rollback Rules

For repo changes:

```bash
git diff -- docs/omx-workflow.md
rm docs/omx-workflow.md
```

Only remove the file if this task created it and the user wants this OMX workflow
document removed. Do not use `git reset --hard` or `git checkout --` unless the
user explicitly asks.

For local OMX state:

```bash
rm -rf .omx
```

This deletes local OMX run state only. Confirm first if `.omx/` contains active
plans or logs that should be kept.

For user-level OMX setup, prefer OMX's own uninstall flow:

```bash
omx uninstall
```

Use this only after confirming the user wants to remove user-level OMX/Codex
configuration. The setup touched `/mnt/c/Users/sange/.codex/config.toml`,
`hooks.json`, `AGENTS.md`, `prompts/`, `skills/`, and `agents/`.

## Keep The Project Small

- Use existing scripts before adding new scripts.
- Use existing workspace packages before adding dependencies.
- Keep `packages/shared` pure: no React, Electron, or DOM dependencies.
- Keep `packages/ui` independent from `apps/desktop`.
- Import shared code through workspace packages, not cross-directory app paths.
- Keep generated replay outputs under `Replay/` untracked.
- Keep `.omx/` local and untracked unless a future team policy explicitly changes this.
- For art generation, follow the repository rule requiring the `imagegen-asset-library-flow` skill.
- Update docs only when workflow expectations, commands, or boundaries actually change.

## Prompt Templates

### A. Requirement Clarification

Use when the task needs clearer scope and no files should be changed.

```text
You are working in /home/sange/projects/GemDuel-Dev on WSL. This is a pnpm@10.33.0 + Turborepo monorepo for a React/TypeScript/Electron game.

Clarify the requirement only. Do not modify files, install dependencies, run setup commands, or commit.

First inspect the relevant repo context with read-only commands only. Then ask only the minimum questions needed to define:
- target workspace: apps/desktop, packages/shared, packages/ui, packages/turn-service, tools/scripts, or docs
- exact behavior or document expected
- non-goals
- validation commands
- rollback expectation

Respect AGENTS.md. Use pnpm from the repo root. Do not broaden the task.
```

### B. Plan Creation

Use when a phased implementation plan is needed and no files should be changed.

```text
You are working in /home/sange/projects/GemDuel-Dev on WSL. Create a phased implementation plan for this repository. Do not modify files, install dependencies, or commit.

Base the plan on the current repo, not a generic template. Read package.json, pnpm-workspace.yaml, turbo.json, AGENTS.md, and the relevant source/docs files.

For each phase, include:
- scope and files likely to change
- non-goals
- exact pnpm validation commands
- rollback steps
- stop condition

Use the repo's commands: pnpm lint, pnpm typecheck, pnpm test, pnpm build, and add boundaries/governance gates only when the touched surface requires them.
```

### C. Single Phase Execution

Use when only one approved phase should be implemented.

```text
You are working in /home/sange/projects/GemDuel-Dev on WSL. Execute only Phase <N> from the approved plan.

Hard limits:
- Do not implement other phases.
- Do not add dependencies.
- Do not run omx setup/update/uninstall.
- Do not delete files.
- Do not commit.
- Do not touch unrelated dirty worktree files.

Use pnpm from the repo root. Keep changes inside the named workspace boundary. Run the smallest relevant verification set, usually:
pnpm lint
pnpm typecheck
pnpm test

Add pnpm build, pnpm boundaries:check, pnpm architecture:check, pnpm deps:check, pnpm desktop:check, or pnpm release:check only if Phase <N> touches that surface.

Stop and report if the phase requires broader changes than the approved scope.
```

### D. Review

Use to review recent changes and report risks.

```text
You are reviewing recent changes in /home/sange/projects/GemDuel-Dev on WSL.

Act as a code reviewer. Prioritize bugs, regressions, boundary violations, missing tests, and missing validation. Do not modify files.

Inspect:
git status --short
git diff --stat
git diff
package.json
AGENTS.md

Report findings first with file and line references. Then summarize:
- changed surfaces
- validation already run
- validation still needed
- risks before commit

Use GemDuel's rules: pnpm only, packages/shared stays pure, packages/ui cannot depend on apps/desktop, and desktop packaging remains Windows NSIS only.
```

### E. Fix Failure

Use when a command or app flow failed and the fix must stay minimal.

```text
You are fixing a failure in /home/sange/projects/GemDuel-Dev on WSL.

Failure log:
<paste log here>

Goal: identify the root cause and apply the smallest fix. Do not refactor unrelated code, add dependencies, delete files, or commit.

Start by reproducing or narrowing with the closest command. Prefer focused commands before full gates. Use pnpm from the repo root.

After the fix, rerun the failing command. If it passes, run the nearest relevant gate:
- pnpm typecheck for TypeScript/API failures
- pnpm test for test/runtime behavior failures
- pnpm lint for lint failures
- pnpm build for bundling/build failures
- governance commands only for tools/scripts or governance changes

Stop and report if the failure points to unrelated dirty worktree changes or needs a broader design decision.
```

### F. Rollback

Use to remove only the current OMX/Codex task's changes while preserving user work.

```text
You are rolling back only the current OMX/Codex task in /home/sange/projects/GemDuel-Dev on WSL.

Do not use git reset --hard. Do not revert user changes. Do not delete unrelated files.

First inspect:
git status --short
git diff --stat
git diff

Identify files changed by this task only. Propose the exact rollback patch before applying it if any file also contains user changes.

For this OMX workflow document, rollback is:
rm docs/omx-workflow.md

For local OMX state, rollback may be:
rm -rf .omx

Only remove .omx after confirming there are no active logs/plans/state that should be kept. Do not run omx uninstall unless the user explicitly wants to remove user-level OMX setup.
```

### G. Long Autonomous Run

Use when OMX is allowed to make longer progress with explicit stop conditions.

```text
You are running a long but bounded OMX/Codex task in /home/sange/projects/GemDuel-Dev on WSL.

Mission:
<state mission here>

Allowed scope:
<list files/workspaces allowed>

Forbidden:
- no package manager changes; use pnpm only
- no dependency additions unless explicitly approved
- no omx setup/update/uninstall
- no broad formatting
- no unrelated refactors
- no deleting files
- no commits unless explicitly requested after gates pass
- no touching unrelated dirty worktree files

Stop conditions:
- required scope exceeds the allowed files/workspaces
- a command fails twice for different reasons
- a fix requires architecture or gameplay rule decisions
- tests indicate a real product bug outside this mission
- user approval is needed for browser verification, global config, deletion, or commit

Verification plan:
1. Run the closest focused command while developing.
2. Before reporting completion, run:
   pnpm lint
   pnpm typecheck
   pnpm test
3. Add pnpm build when runtime/bundling is touched.
4. Add pnpm boundaries:check, pnpm architecture:check, pnpm deps:check, pnpm desktop:check, or pnpm release:check when governance, boundaries, dependency policy, desktop policy, or release behavior is touched.

Commit rule:
Do not commit by default. If the user later asks for commit, first show git status, run the agreed gates, stage only task-owned files, and use a focused message such as:
chore: document OMX workflow for WSL Codex

Final report must include changed files, commands run, command results, risks, rollback steps, and remaining recommendations.
```
