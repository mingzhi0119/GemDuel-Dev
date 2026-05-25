Below is a stronger, truth-preserving system you can paste into Codex and then use with ChatGPT Pro as the reviewer/editor. I checked current OpenAI guidance while shaping this: Codex is described as an agent for writing, reviewing, and shipping code, and OpenAI’s Codex docs recommend giving it a goal, context, constraints, and explicit “done when” criteria, plus verification through tests/lint/review. ([OpenAI Help Center][1]) ([OpenAI Developers][2])

---

## 1. Stronger Codex master prompt

```text
# Codex Master Prompt: Truthful Evidence-Backed Job-Search Portfolio for GemDuel

You are helping me prepare a truthful US software engineering job-search portfolio from this repository.

## Candidate context

I am a University of Rochester master’s student in AI in Business at Simon Business School, graduating in December 2026.

My strongest project is GemDuel. The project may include TypeScript, Electron, Unity migration work, CI/testing, replay parity, repo governance, and agentic coding workflows.

Target roles:
- Early-career Software Engineer
- DevTools Engineer
- QA Automation Engineer
- Build/Release Engineer
- Game Tools Engineer
- AI-assisted Engineering / Developer Productivity roles

Target audience:
- Recruiters: need clear, credible, skimmable project value.
- Senior engineers: need concrete technical proof, tradeoffs, test evidence, and repo-level details.

## Non-negotiable truth rules

Do not invent or imply any of the following unless directly supported by evidence in this repository or linked project artifacts:
- impact metrics
- user counts
- production deployment
- revenue
- external adoption
- performance improvements
- company/team ownership
- security/compliance maturity
- “production-grade” status
- “full migration” status
- “end-to-end” status
- “scalable” or “robust” claims without evidence

Every resume bullet must be backed by at least one of:
- code path and line references
- commit hash
- test file and test output
- CI workflow/log
- docs or design notes
- screenshots
- demo script or recorded demo
- issue/PR discussion
- reproducible command output

If evidence is missing, say “insufficient evidence” and either:
1. downgrade the claim to something supported, or
2. create a TODO for the exact proof needed.

Never use vague AI-fluffy language such as:
- “leveraged AI”
- “revolutionized”
- “seamlessly”
- “cutting-edge”
- “highly scalable”
- “production-ready”
- “robust solution”
unless the sentence gives concrete implementation details and proof.

## Operating instructions

First, inspect the repository. Do not draft final bullets until you have built an evidence ledger.

Run only safe read/test/build commands unless the repo instructions say otherwise. Before making changes, check:
- git status
- repo structure
- package scripts / build scripts
- test scripts
- CI workflows
- documentation
- commit history relevant to GemDuel

Use commands such as these when applicable:
- git status --short
- git log --oneline --decorate --graph --all -n 60
- git ls-files
- find . -maxdepth 3 -type f | sort
- cat package.json
- npm test / npm run test / npm run lint / npm run typecheck / npm run build
- ls .github/workflows
- grep / rg for replay, parity, electron, unity, ci, test, governance, agent, codex, playwright, vitest, jest, typescript

Adapt commands to the repo. If commands fail because dependencies are missing, record the failure honestly and explain what would be needed to reproduce.

## Phase 1: Evidence inventory

Create `portfolio/evidence-ledger.md`.

For each meaningful technical contribution, record:

- Evidence ID: E001, E002, etc.
- Claim category:
  - TypeScript/Electron
  - Unity migration
  - CI/testing
  - replay parity
  - repo governance
  - agentic coding workflow
  - game tooling
  - build/release
  - QA automation
  - architecture/design
- What the evidence proves
- What it does NOT prove
- Relevant files with line references
- Relevant commits, if identifiable
- Relevant tests and latest result
- Relevant CI workflow/log, if available
- Screenshots/demos, if available
- Confidence:
  - High: code + passing test/CI or demo
  - Medium: code + docs, but no current test run
  - Low: docs or commit message only
  - Reject: unsupported or contradicted

Important: distinguish between “implemented,” “prototyped,” “configured,” “documented,” “planned,” and “experimented with.”

## Phase 2: Claim extraction

From the evidence ledger, extract only claims that are safe for a resume or portfolio.

Create `portfolio/claim-bank.md` with this table:

| Claim ID | Safe claim | Stronger claim rejected? | Why rejected | Evidence IDs | Target roles | Confidence |

Examples of safe claim wording:
- “Implemented [specific module/tool] using [specific technologies] to support [specific project behavior], verified by [test/demo/CI evidence].”
- “Added/maintained [test type] coverage for [behavior], including [specific edge case], with [command or CI workflow] as verification.”
- “Documented [repo governance/process] through [specific file], clarifying [specific workflow].”

Do not include claims that require unsupported assumptions.

## Phase 3: Resume bullets

Create `portfolio/resume-bullets.md`.

For each target role family, draft 3–5 bullets:
- SWE
- DevTools
- QA Automation
- Build/Release
- Game Tools
- AI-assisted Engineering

Each bullet must include:
- action verb
- technical object
- implementation detail
- purpose or outcome
- evidence IDs
- confidence level
- interview expansion notes

Bullet format:

### Target role: [Role family]

#### Bullet candidate
- [Bullet text]

Evidence:
- Evidence IDs:
- Files/commits/tests:
- Confidence:
- Safe because:
- Do not say:
- Interview expansion:

Rules:
- No unsupported metrics.
- No “users,” “production,” or “revenue” unless directly proven.
- Prefer “built,” “implemented,” “added,” “configured,” “migrated,” “tested,” “documented,” “refactored,” “validated,” “instrumented.”
- Avoid “owned,” “led,” “architected,” “launched,” “scaled,” unless the evidence proves that level of scope.
- For early-career roles, make the bullet concrete rather than grand.

Create two versions of each good bullet:
1. Recruiter version: readable, concise, keyword-aware.
2. Engineer version: more technical, with specific files/tests/tools.

## Phase 4: Portfolio artifacts

Create or update these files under `portfolio/`:

1. `portfolio/recruiter-project-summary.md`
   - 150–250 word GemDuel project summary
   - plain English
   - no unsupported impact
   - emphasizes role fit and technical stack

2. `portfolio/engineering-case-study.md`
   - Problem
   - Constraints
   - Architecture / tools
   - What I implemented
   - Testing / CI / validation
   - Tradeoffs
   - What I would improve next
   - Evidence links

3. `portfolio/demo-script.md`
   - 2-minute demo script
   - 5-minute technical walkthrough script
   - exact screens/files/features to show
   - do not claim anything not visible or reproducible

4. `portfolio/screenshot-plan.md`
   - list of screenshots needed
   - what each screenshot proves
   - where to capture it
   - related evidence ID

5. `portfolio/interview-stories.md`
   - 4 STAR stories:
     - debugging/replay parity
     - testing/CI
     - migration/tooling
     - AI-assisted workflow/governance
   - each story must cite evidence IDs
   - include “what I would do differently”

6. `portfolio/linkedin-github-readme-snippets.md`
   - GitHub README project section
   - LinkedIn project description
   - resume project block
   - portfolio website project block

## Phase 5: Adversarial truth audit

Create `portfolio/truth-audit.md`.

For each bullet and artifact claim, check:

- Could a senior engineer ask “show me the code” and receive a specific answer?
- Does the bullet imply production use?
- Does it imply users or adoption?
- Does it imply business impact?
- Does it imply team leadership?
- Does it imply the Unity migration is complete?
- Does it imply CI is comprehensive?
- Does it imply AI did the work instead of me?
- Is there a passing test, demo, screenshot, or log?
- Is the claim understandable without hype?

Flag each claim as:
- PASS
- PASS WITH WEAKER WORDING
- NEEDS MORE EVIDENCE
- REMOVE

For every flagged claim, propose a safer replacement.

## Phase 6: Final output summary

At the end, summarize:

1. Best 6 resume bullets overall
2. Best 3 bullets for SWE
3. Best 3 bullets for QA automation
4. Best 3 bullets for DevTools / Build / Release
5. Best 3 bullets for Game Tools
6. Best 3 bullets for AI-assisted engineering
7. Claims removed for lack of evidence
8. Missing evidence that would strengthen the portfolio
9. Commands run and results
10. Files created or updated

## Quality bar

The final output should feel like it was written by a careful early-career engineer, not a marketer.

Specific beats impressive.
Verifiable beats dramatic.
Evidence beats adjectives.
```

OpenAI’s Codex docs specifically recommend durable repo guidance through `AGENTS.md`, including repo layout, build/test/lint commands, conventions, constraints, and “what done means.” For your use case, I’d put the “truth rules” above into a repo-level `AGENTS.md` too, so Codex keeps applying them across sessions. ([OpenAI Developers][3]) ([OpenAI Developers][2])

---

## 2. Stricter resume bullet rubric

Use this as a hard gate. A bullet should not go on your resume unless it passes **all gates** and scores at least **12/15**.

| Criterion                 |                    0 |                       1 |                           2 |                                               3 |
| ------------------------- | -------------------: | ----------------------: | --------------------------: | ----------------------------------------------: |
| **Evidence**              |             No proof |               Docs only |        Code or commit proof |                       Code + test/CI/demo proof |
| **Technical specificity** |              Generic |   Names broad tech only |        Names component/tool |         Names component + implementation detail |
| **Truthfulness**          |     Overstates scope |               Ambiguous |             Mostly accurate |                Carefully scoped and falsifiable |
| **Role relevance**        |              Unclear |       Somewhat relevant | Relevant to one target role |               Relevant to multiple target roles |
| **Interviewability**      | You cannot defend it | You can explain broadly |   You can walk through code | You can walk through code, tradeoffs, and tests |

Hard reject the bullet if it contains unsupported claims about production, users, revenue, adoption, leadership, quantified impact, or completed migration.

A strong bullet structure for you:

> **Action verb + technical artifact + implementation detail + verification/purpose**

Examples of safe forms, not claims:

> Implemented replay-parity validation for GemDuel by comparing `[specific old behavior]` against `[specific new behavior]`, with regression coverage in `[test file]`.

> Configured CI checks for `[lint/test/typecheck/build command]` to catch `[specific failure class]` before merge.

> Built Electron/TypeScript tooling for `[specific GemDuel workflow]`, including `[specific module or IPC/API detail]`.

Notice these do not say “improved reliability by 40%,” “served users,” or “productionized” unless that proof exists.

---

## 3. Checklist for verifying each bullet

For every bullet, make a mini proof packet:

| Check                      | Question                                     | Pass condition                                                                            |
| -------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Claim subject**          | What exactly did you build/change?           | A named file, module, workflow, test, CI job, or doc exists.                              |
| **Your role**              | Did you personally do it?                    | Commit history, authorship, or clear project ownership supports it.                       |
| **Scope**                  | Does the wording match reality?              | “Prototype,” “implemented,” “configured,” “documented,” or “migrated” is used accurately. |
| **Evidence**               | Can you point to proof?                      | Code path, commit, test, CI log, screenshot, or demo exists.                              |
| **Verification**           | Does it run?                                 | Latest command result is recorded, or failure is honestly documented.                     |
| **Metric**                 | Is any number real?                          | It comes from test output, benchmark, commit count, CI log, or reproducible script.       |
| **Production implication** | Does it imply deployed users?                | Remove unless deployment/adoption is proven.                                              |
| **Recruiter clarity**      | Would a recruiter understand why it matters? | The bullet names a recognizable role-relevant skill.                                      |
| **Engineer credibility**   | Would a senior engineer believe it?          | The bullet is specific enough to discuss in code review.                                  |
| **Interview readiness**    | Can you explain tradeoffs?                   | You can explain what you changed, why, what failed, and what you would improve.           |

A bullet is resume-ready only when you can answer: “Show me where that lives in the repo.”

---

## 4. Warning signs that a bullet sounds exaggerated

These are the danger smells—the résumé equivalent of a function named `doEverything()`.

| Warning phrase          | Why it’s risky                                     | Safer alternative                                                                                             |
| ----------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| “Production-ready”      | Implies deployment, hardening, monitoring, support | “Implemented a working prototype” or “added test-covered implementation”                                      |
| “Scaled”                | Implies load, users, infra, performance proof      | “Structured,” “modularized,” “prepared,” or remove                                                            |
| “End-to-end”            | Often overclaims completeness                      | Name the exact path: “from replay fixture loading to parity assertion”                                        |
| “Led development”       | Implies team leadership                            | “Built,” “implemented,” “coordinated,” or “documented”                                                        |
| “Architected”           | Senior-sounding and easy to challenge              | “Designed and implemented” only if design docs/code prove it                                                  |
| “Optimized performance” | Needs measurement                                  | “Refactored,” unless benchmark proof exists                                                                   |
| “Improved reliability”  | Needs failure-rate or test evidence                | “Added regression tests for…”                                                                                 |
| “Automated CI/CD”       | CD means deployment                                | “Configured CI checks for lint/test/build”                                                                    |
| “Migrated to Unity”     | Implies completion                                 | “Prototyped Unity migration,” “ported selected systems,” or “documented migration path”                       |
| “AI-powered workflow”   | Can sound fluffy                                   | “Used Codex/ChatGPT to generate review checklists, test plans, or implementation drafts, then validated via…” |
| “Users” / “players”     | Implies adoption                                   | “local demo,” “project demo,” or omit                                                                         |
| “Business impact”       | Usually not provable in a student project          | “engineering outcome,” “maintainability,” “testability,” only with evidence                                   |

Words to treat as suspicious until proven: **launched, shipped, deployed, production, enterprise, scalable, robust, optimized, reduced, increased, accelerated, owned, led, architected, end-to-end, real-time, secure, reliable, comprehensive.**

---

## 5. Recommended workflow for using Codex + ChatGPT Pro together

Use **Codex as the repo-grounded evidence collector and verifier**. Use **ChatGPT Pro as the portfolio strategist, editor, and adversarial reviewer**.

### Step 1: Set repo rules once

Create `AGENTS.md` in the GemDuel repo with the truth rules, test commands, and “do not invent claims” policy. Codex docs explicitly support `AGENTS.md` as persistent repo guidance and recommend including build/test/lint commands, conventions, constraints, and verification criteria. ([OpenAI Developers][3])

### Step 2: Run Codex in audit mode first

Do not ask for résumé bullets first. Ask Codex to inspect the repo and produce only:

- evidence ledger
- claim bank
- missing proof list
- commands run
- test/CI status

This prevents the classic “pretty résumé first, truth later” trap.

### Step 3: Strengthen the evidence before wording

For weak but valuable claims, use Codex to add proof:

- add or improve tests
- create replay fixtures
- add CI workflow documentation
- add a demo script
- create screenshots
- document Unity migration status honestly
- add a project architecture note

OpenAI’s Codex guidance recommends asking it to create tests, run checks, confirm results, and review the diff before accepting work. ([OpenAI Developers][2])

### Step 4: Bring only the evidence ledger to ChatGPT Pro

Paste the ledger and ask ChatGPT Pro:

> Rewrite these claims into early-career US resume bullets for SWE, DevTools, QA Automation, Build/Release, Game Tools, and AI-assisted engineering roles. Do not introduce any claim not present in the ledger. For every bullet, include evidence IDs and a weaker fallback version.

This is where ChatGPT Pro is useful: tone, role targeting, ATS phrasing, recruiter clarity, and removing weird AI-ish language.

### Step 5: Send ChatGPT’s bullets back to Codex for verification

Ask Codex:

> Verify every bullet against the repository. Mark PASS, WEAKEN, or REMOVE. For each PASS, cite exact files/tests/commits. For each WEAKEN, propose safer wording. For each REMOVE, explain the unsupported claim.

This keeps the final resume tied to reality.

### Step 6: Build two portfolio surfaces

You want two versions of the same truth:

**Recruiter surface**

- concise project summary
- 4–6 bullets
- tech stack
- demo link / GitHub link
- “what I built” in plain language

**Senior engineer surface**

- architecture notes
- test strategy
- CI workflow
- replay parity explanation
- migration tradeoffs
- what failed / what changed
- evidence links

The same claim can appear differently:

Recruiter version:

> Built TypeScript/Electron tooling for GemDuel gameplay workflows, with test-backed validation for replay behavior.

Engineer version:

> Implemented replay validation around `[specific module]`, using `[test framework]` fixtures to compare expected game-state transitions across `[specific runtime/tooling boundary]`.

### Step 7: Keep a private “claim ledger”

Maintain a simple file:

```text
Claim:
Resume wording:
Evidence:
Last verified:
Command run:
Result:
Safe stronger version:
Unsafe version to avoid:
```

Update it whenever GemDuel changes. This makes interviews easier because you are not memorizing hype—you are remembering proof.

### Step 8: Privacy note

For ChatGPT Pro/Codex work involving private repos, review your data controls. OpenAI’s help page says Pro and Plus conversations may be used to improve models unless training is turned off in ChatGPT data controls; Business, Enterprise, and Edu have different defaults. ([OpenAI Help Center][1])

---

The key move: make Codex produce an **evidence ledger before bullets**. That one design choice will keep the portfolio sharp, believable, and engineer-proof.

[1]: https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan 'Using Codex with your ChatGPT plan | OpenAI Help Center'
[2]: https://developers.openai.com/codex/learn/best-practices 'Best practices – Codex | OpenAI Developers'
[3]: https://developers.openai.com/codex/guides/agents-md 'Custom instructions with AGENTS.md – Codex | OpenAI Developers'
