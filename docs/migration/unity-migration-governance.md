# Unity Migration Governance

Last updated: 2026-05-11

This document is binding for Codex agents working on GemDuel Unity migration tasks. The current
phase is **migration preparation only**. Success is not "Unity looks playable"; success is
"future Unity work can be judged equivalent by the existing TypeScript rules, replay corpus, state
hash, contract docs, and verification scripts."

Codex can read repository files, edit files, and run local commands in a workspace, so repo rules,
acceptance commands, and explicit non-goals must be treated as enforceable controls rather than
soft preferences. Reference: [OpenAI Codex Help Center](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan).

## Current Phase

Migration preparation only.

The agent must not implement Unity gameplay, a playable Unity demo, a vertical slice, a fake game
scene, or parallel C# gameplay rules unless the user explicitly says:

```text
implement Unity vertical slice
```

or

```text
implement Unity gameplay
```

Any weaker wording such as "prepare Unity migration", "set up Unity", "make migration possible",
"prove parity", or "fix migration foundation" does not authorize gameplay implementation.

## Binding Non-Goals

- Do not create a playable demo.
- Do not create a fake Unity scene.
- Do not create a visual-only board or gem demo.
- Do not bypass `packages/shared`.
- Do not reinvent gameplay rules in Unity or C#.
- Do not use mock data to claim migration progress.
- Do not change Electron gameplay behavior to make Unity easier.
- Do not add Steamworks.NET, Epic Online Services, app IDs, secrets, tokens, credentials, or large
  binary assets unless the user explicitly authorizes that scope.

## Allowed Work

- Document the current TypeScript `GameState` contract.
- Document the current TypeScript `GameAction` contract.
- Document card, gem, royal, buff, replay, FSM, and state-hash contracts.
- Export deterministic fixtures from `packages/shared`.
- Maintain a small replay golden corpus.
- Verify fixtures with the existing TypeScript reducer and deterministic state hash.
- Design Unity fixture-reader behavior.
- Design the platform abstraction layer.
- Prepare Steam/Epic release checklists and platform feature matrices.
- Create a Unity project skeleton only when explicitly requested.
- Add docs, fixtures, tests, or verification scripts that prove migration readiness.

## Forbidden Work Without Explicit Authorization

- Unity gameplay implementation.
- Unity scene gameplay wiring.
- Fake board, fake market, fake gem interaction, or mock-only visual flows.
- C# reducers that claim to replace `packages/shared` without replay/hash parity.
- Parallel card, gem, royal, buff, FSM, or scoring rules.
- Runtime behavior changes in Electron made only for Unity parity.
- New platform SDK binaries or credential-bearing files.
- Large generated Unity folders such as `Library/`, `Temp/`, `Obj/`, `Logs/`, `UserSettings/`, or
  `Builds/`.

## Required Evidence Artifacts

Every migration-preparation task must produce or preserve at least one of these evidence artifacts:

- Rule contract documentation.
- Replay golden fixture.
- Deterministic state hash validation.
- Unity-readable fixture format.
- Verification script.
- Validation report.
- Migration risk table.
- Platform abstraction design.
- Release checklist.

Work that only produces a visible Unity surface is not migration evidence.

## Gate Order

Gate 1: Rule Contracts

- `GameState` contract.
- `GameAction` contract.
- Card, gem, royal, and buff data contracts.
- FSM phase and command policy.
- Schema strictness policy.

Unity gameplay is forbidden in this gate.

Gate 2: Replay Corpus

- Golden replay fixtures.
- Deterministic state hash.
- Fixture validator.
- Parity report.

Unity gameplay is forbidden in this gate.

Gate 3: Release Preparation

- Steam checklist.
- Epic checklist.
- Platform feature matrix.
- SteamPipe or upload-template docs.
- Asset inventory.
- License and provenance notes.

Unity gameplay is forbidden in this gate.

Gate 4: Unity Skeleton

- `clients/unity` project skeleton.
- Unity `.gitignore` and repository hygiene.
- Unity version lock.
- Fixture-reader design.
- Platform-service interface draft.

Playable gameplay is still forbidden in this gate.

Gate 5: Unity Vertical Slice

This gate starts only after explicit user authorization. Before implementation, the agent must
write a task plan that names exact files allowed to change and the verification commands that will
prove parity.

Allowed only in Gate 5:

- 5x5 GemBoard implementation.
- Local PvP interaction implementation.
- Fixture reader.
- State-hash comparison in Unity.
- SteamAPI init concept checks.
- Overlay availability concept checks.
- Test achievement concept checks.

## Plan Lock

Before changing files for any migration task, create or update:

```text
docs/migration/current-migration-task-plan.md
```

The plan must include:

```md
## Goal

## Non-Goals

## Files Allowed To Change

## Files Forbidden To Change

## Acceptance Criteria

## Validation Commands

## Rollback Plan
```

If the actual work would exceed the plan, the agent must stop and report the scope change. It must
not silently expand from "fixture export" into "Unity demo" or "visual slice".

## Definition Of Done

- Every changed file is listed in the final report.
- Every fixture or contract artifact is tied back to `packages/shared`.
- Every migration claim has a validation command or a documented manual validation path.
- Final report includes commands run and results.
- If any command cannot run, final report explains why and gives the next safest validation command.
- Final report includes the self-audit below.

## Required Self-Audit

Every final report for a Unity migration task must answer:

1. Did I create any demo, slice, playable scene, or visual-only Unity surface? If yes, cite the
   explicit user authorization.
2. Did I duplicate gameplay rules outside `packages/shared`? If yes, explain why and name the
   replay/hash parity proof.
3. Did every migration artifact connect back to existing rule contracts?
4. Did I add or run validation commands?
5. Did I leave any mock-only path that could be mistaken for real migration progress?

## Independent Audit Prompt

Use this prompt to review a migration PR:

```text
You are an independent code auditor. Review this PR for Unity migration theater.

Check:
1. Whether a demo, mock, fake scene, or visual-only slice replaced real migration preparation.
2. Whether the PR bypasses packages/shared as the rules authority.
3. Whether Unity code was added without replay/state-hash verification.
4. Whether a parallel gameplay rule implementation was introduced.
5. Whether large assets, SDKs, secrets, Unity Library/Temp/Builds, or credentials were committed.
6. Whether every migration artifact has an acceptance command or validation path.

Return:
- Pass/Fail
- Blocking issues
- Suspicious demo/slice behavior
- Required fixes before merge
```

## Short Codex Prompt

Use this short prompt for future Codex runs:

```text
Follow docs/migration/unity-migration-governance.md as the binding scope contract.

This is Unity migration preparation, not a demo task. Do not implement Unity gameplay, playable
scenes, fake board demos, mock-only flows, or parallel C# rules unless I explicitly say
"implement Unity vertical slice" or "implement Unity gameplay".

Deliver only verifiable migration evidence: rule contracts, replay golden corpus, deterministic
state hash, Unity-readable fixtures, platform abstraction docs, migration risk table, release
checklists, validation scripts, and validation results.

Before changing files, write/update docs/migration/current-migration-task-plan.md with goal,
non-goals, allowed files, forbidden files, acceptance criteria, validation commands, and rollback
plan. If the work would exceed that plan, stop and report instead of expanding scope.
```

## After Migration Preparation

Migration preparation ends only when the repository can prove, without a Unity gameplay demo, that
Unity has a governed path to consume the same rules, data, replay events, and release contracts as
the current Electron/TypeScript product.

After preparation, the next task is not "make a playable scene." The next task is to run a
**Migration Readiness Review** and decide whether the project is allowed to enter Gate 5. The review
must be documented before any Unity gameplay implementation starts.

Create or update:

```text
docs/migration/unity-migration-readiness-review.md
```

The review must include:

- Contract status: whether `GameState`, `GameAction`, replay schema, catalog data, FSM policy, and
  deterministic hash contracts are complete enough to drive Unity work.
- Fixture status: whether `fixtures/replay-golden/manifest.json` covers the required scenarios and
  whether every fixture validates against the TypeScript oracle.
- Unity consumption status: whether Unity can read the committed fixture shape or has a precise
  fixture-reader implementation plan with known gaps.
- Risk status: whether all high-risk migration items have an owner, acceptance proof, and rollback
  path.
- Release status: whether Steam/Epic/platform preparation is documented as planning evidence, not
  mixed into gameplay implementation.
- Authorization status: whether the user explicitly approved entering Gate 5.

The readiness review must end with one of these outcomes:

- `Preparation complete - Gate 5 may start`
- `Preparation incomplete - continue evidence work`
- `Blocked - contract or product decision required`

If the outcome is not `Preparation complete - Gate 5 may start`, Unity gameplay implementation
remains forbidden.

## Verifying Migration Preparation Completion

Preparation is complete only when every item in this section is satisfied. A green visual demo,
Unity Play Mode screenshot, or hand-clicked scene is not sufficient.

### Required Files

The repository must contain current, reviewed versions of:

- `docs/migration/unity-migration-governance.md`
- `docs/migration/current-migration-task-plan.md`
- `docs/migration/game-state-contract.md`
- `docs/migration/game-action-contract.md`
- `docs/migration/replay-parity-contract.md`
- `docs/migration/unity-fixture-reader-design.md`
- `docs/migration/platform-services-abstraction.md`
- `docs/migration/unity-migration-risk-table.md`
- `docs/migration/unity-migration-readiness-review.md`
- `fixtures/replay-golden/manifest.json`
- `tools/migration/export-unity-fixtures.ts`
- `tools/migration/verify-replay-parity.ts`

If any file is intentionally absent, the readiness review must explain why and name the replacement
evidence.

### Contract Acceptance

The contracts must prove:

- `packages/shared` remains the only gameplay rule authority during preparation.
- `GamePhase` and FSM command policies are documented from
  `packages/shared/src/logic/fsmPolicy.ts`.
- All gameplay action names and payloads are traceable to
  `packages/shared/src/types/domain-actions.ts`.
- The canonical state shape is traceable to `packages/shared/src/types/domain-core.ts` and replay
  snapshots.
- Runtime-only UI fields are excluded from the deterministic hash.
- Platform services cannot mutate gameplay state directly.
- Electron remains the product standard during migration unless the user explicitly approves a
  contract change.

### Replay And Hash Acceptance

The golden corpus must prove:

- `fixtures/replay-golden/manifest.json` has a stable schema version.
- The manifest records `rulesVersion`, `replaySchemaVersion`, and `hashContract`.
- The required coverage includes:
    - local PvP opening
    - reserve
    - buy
    - royal selection
    - extra turn
    - buff
    - game over
- Every fixture is deterministic and reviewable.
- Every fixture has an expected final state hash.
- The hash uses the current `replay-state-hash-v1` contract unless a dedicated hash migration is
  approved.
- The verifier loads fixtures through the TypeScript replay reader and reducer rather than trusting
  fixture metadata.

### Unity-Readable Fixture Acceptance

Unity readiness does not require playable Unity gameplay, but it must prove one of these:

- Unity already has a fixture reader that loads the committed manifest and fixture JSON, or
- `docs/migration/unity-fixture-reader-design.md` specifies the exact DTOs, bootstrap path,
  unsupported-event behavior, hash comparison behavior, and report artifact shape required before
  gameplay work starts.

The reader plan or implementation must reject:

- Missing manifest files.
- Unsupported replay schema versions.
- Unknown event types.
- Illegal command/phase combinations.
- Hash mismatches.
- Silent fixture skips.

### Release And Platform Acceptance

Release preparation is complete for migration purposes when:

- Steam/Epic checklist work is documented as planning evidence.
- No platform SDK, app ID, credential, token, or partner-only file is committed.
- Platform services are modeled as adapters.
- Platform user IDs, cloud paths, overlay state, achievements, and store metadata are excluded from
  gameplay state and replay hashes.
- Any external platform rule is marked as requiring official documentation recheck before real
  implementation.

### Validation Commands

Run the strongest applicable local gate set for the files changed. For a full preparation-complete
review, the minimum command list is:

```sh
pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts
pnpm typecheck
pnpm test
pnpm boundaries:check
pnpm secrets:check
```

If migration scripts changed, also run:

```sh
pnpm --dir tools/scripts run typecheck
pnpm --dir tools/scripts run test
```

If replay fixtures changed, also run:

```sh
pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-fixtures.ts --out-dir artifacts/replay-golden-dry-run
pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts --manifest artifacts/replay-golden-dry-run/manifest.json
```

The dry-run fixture export must not be committed unless the task explicitly says to regenerate the
golden corpus.

### No-Theater Diff Check

Before marking preparation complete, inspect the diff and prove the task did not sneak in demo work:

```sh
git diff --name-only -- clients/unity/Assets clients/unity/ProjectSettings clients/unity/Packages
git diff --name-only -- packages/shared apps/desktop packages/ui
git status --short
```

The readiness review must explain any Unity file changes. Allowed preparation changes are limited
to skeleton hygiene, fixture-reader design/DTOs when explicitly scoped, tests, and documentation.
Unexpected scene, prefab, MonoBehaviour gameplay, or visual demo changes block preparation
completion.

### Completion Report

The final preparation report must include:

- Changed files.
- Added or regenerated fixtures.
- Contract files reviewed.
- Validation commands and results.
- Known gaps.
- Explicit statement that no playable Unity demo, fake scene, visual-only flow, or parallel C#
  rules were introduced.
- Recommendation for the next gate.

## Full Migration After Preparation

Full migration starts only after the readiness review says:

```text
Preparation complete - Gate 5 may start
```

Full migration must be executed as a sequence of evidence gates. Do not jump directly to a polished
Unity UI.

### Full Migration Gate A: Engine Boundary Decision

Write an ADR before implementing gameplay:

```text
docs/adr/<next-id>-unity-rules-engine-boundary.md
```

The ADR must choose one rules-engine strategy:

- Keep TypeScript as the authoritative rules engine and call it from Unity through a governed
  adapter.
- Port the rules to C# behind the same action/replay/hash contracts while TypeScript remains the
  oracle until parity is proven.
- Generate or share a portable rules artifact if a later toolchain makes that safer than a manual
  port.

The ADR must reject:

- MonoBehaviour-owned gameplay state.
- UI-driven state mutation.
- Platform SDK callbacks mutating gameplay directly.
- C# rules that cannot be replay/hash compared against the TypeScript oracle.

Acceptance evidence:

- ADR merged.
- `IGameRulesEngine` or equivalent boundary documented.
- No Unity presentation code owns rule transitions.

### Full Migration Gate B: Rule Engine Adapter

Implement the smallest rule-engine adapter that can:

- Load a replay fixture.
- Bootstrap the initial state.
- Apply one normalized gameplay command.
- Return the next canonical state.
- Return deterministic hash evidence.
- Return structured rejection reasons for illegal commands.

The adapter must expose commands, not clicks. Unity input may create intents, but only the adapter
may apply gameplay commands.

Acceptance evidence:

- A fixture applies from revision `0` to at least the first command.
- Illegal command in the wrong phase is rejected.
- State hash matches the TypeScript oracle for the covered step.
- No scene or visual demo is required for this gate.

### Full Migration Gate C: Replay Parity Expansion

Move from one-step proof to complete fixture proof:

- Apply all committed golden fixtures in Unity.
- Compare final state hash, winner, end reason, event count, and turn count.
- Report unsupported event types explicitly.
- Preserve fixture order and deterministic randoms.
- Add missing fixtures only through TypeScript export tooling.

Acceptance evidence:

- Unity parity report artifact under `artifacts/unity/` or equivalent local evidence path.
- TypeScript `verify-replay-parity.ts` remains green.
- Unity fixture runner has no silent skips.

### Full Migration Gate D: Domain Slice Porting

Only after replay proof starts passing, port or bridge domains in this order:

1. Core state model and immutable command application.
2. Board actions: take gems, replenish, bonus gem, discard excess, steal.
3. Market actions: buy, reserve, reserve deck, discard reserved, joker color selection.
4. Royal actions: eligibility, selection, extra turn, next-player recovery.
5. Buff actions: draft, deterministic random choices, per-buff state.
6. Privilege actions.
7. Replay writer/import/export.
8. Save/settings contracts.

Each domain slice must include:

- Source-of-truth TypeScript references.
- C# or adapter files changed.
- Fixture coverage added or reused.
- Hash parity evidence.
- Illegal-action rejection evidence.
- Rollback plan.

### Full Migration Gate E: Unity Interaction Layer

Only after the rule adapter can pass replay/hash gates should Unity input and UI be connected.

Unity UI must translate player intent into contract commands:

- Board clicks and drags produce `TAKE_GEMS`, `TAKE_BONUS_GEM`, `USE_PRIVILEGE`, or reserve-gold
  commands only when the FSM permits them.
- Market preview buttons produce buy/reserve commands only through the adapter.
- Inventory gem clicks produce discard/steal commands only in the matching phase.
- Royal clicks produce selection commands only in `SELECT_ROYAL`.
- Settings buttons mutate settings state only, never gameplay state.

Acceptance evidence:

- Every visible actionable control has a semantic key.
- Every clickable control has a hit target.
- Rejected clicks preserve state and show an Electron-equivalent reason.
- Accepted clicks mutate state only through the rule adapter.
- Hover behavior is stable and cannot randomly switch panels from pointer jitter.

### Full Migration Gate F: Electron Parity Matrix

After Unity has real interaction paths, restore strict Electron comparison:

- Compare semantic keys.
- Compare clickable rects.
- Compare hover results.
- Compare click results.
- Compare state transitions.
- Compare error and recovery behavior.
- Compare settings save/load/surface behavior.
- Compare board, take-gems, discard, follow-up, market, reserved, royal, and preview flows.
- Compare both required viewports.

Electron is still the product standard. Unity must change unless Electron is proven wrong and the
user approves a contract change.

Acceptance evidence:

- Two-viewport parity matrix passes.
- Browser process guard remains intact.
- Manual Unity Play Mode smoke confirms the same actions work without semantic injection.

### Full Migration Gate G: Persistence, Replay, And Recovery

Before Unity can be considered a replacement candidate, it must support:

- Replay import/export compatible with Replay vNext or a documented successor schema.
- Settings persistence with Electron-equivalent user feedback.
- Save path policy.
- Invalid-action recovery.
- Restart/new game recovery.
- Fixture reload recovery.
- Crash-safe or corruption-safe handling for local settings/replay files.

Acceptance evidence:

- Replay round-trip proof.
- Settings save/load proof.
- Recovery smoke report.
- No platform-specific IDs in replay/state hashes.

### Full Migration Gate H: Platform Services

Platform services come after gameplay parity, not before it.

Implement LocalDev first:

- Init.
- Capability flags.
- User ID placeholder.
- Save read/write.
- Achievement no-op/test double.
- Store-page fallback.

Steam/Epic adapters require separate explicit authorization and current official documentation
review before implementation.

Acceptance evidence:

- Adapter contract tests.
- No SDK secrets or account files in git.
- Platform failures cannot break gameplay reducer state.

### Full Migration Gate I: Release Candidate Cutover

Unity becomes a release candidate only when:

- Replay/hash parity is green.
- Interaction parity is green.
- Visual parity is good enough under the product standard.
- Local gates pass.
- Migration risk table has no unresolved blockers.
- Electron remains available as rollback until the user approves cutover.
- Release/governance docs name Unity as the candidate and Electron as fallback.

Cutover requires a final migration report:

```text
docs/migration/unity-full-migration-completion-report.md
```

The report must include:

- Final rule strategy.
- Final fixture corpus.
- Final state-hash evidence.
- Final parity matrix.
- Manual smoke evidence.
- Release gate results.
- Remaining known limitations.
- Rollback instructions.
- Explicit user-approved cutover decision.

## Short /goal Prompt

Use this prompt to start a controlled migration-preparation run:

```text
/goal Follow docs/migration/unity-migration-governance.md as the binding scope contract. Do not implement Unity gameplay, playable scenes, fake board demos, mock-only flows, or parallel C# rules. First update docs/migration/current-migration-task-plan.md, then deliver only verifiable migration evidence for the current gate: contracts, replay golden corpus, deterministic state hash, Unity-readable fixtures, platform abstraction, risk table, release checklist, validation scripts, and validation results. Stop and report if the work would exceed the plan.
```
