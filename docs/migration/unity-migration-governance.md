# Unity Full Migration Governance

Last updated: 2026-05-11

This document is binding for Codex agents working on GemDuel Unity migration tasks. It supersedes
all migration-preparation-only, vertical-slice, sidecar-prototype, guided-fixture, and scoped-parity
execution contracts.

Codex can read repository files, edit files, and run local commands in a workspace, so repo rules,
acceptance commands, and explicit non-goals must be treated as enforceable controls rather than
soft preferences. Reference: [OpenAI Codex Help Center](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan).

## Current Phase

Full Unity migration execution.

This run is explicitly authorized to implement Unity gameplay, Unity UI wiring, replay/import/export,
settings persistence, recovery behavior, platform-service abstraction, build automation, and parity
validation required for Unity to become a replacement candidate for the Electron client.

The agent must not stop at migration preparation, Unity skeleton, vertical slice, guided fixture
playback, scoped parity, 90% parity, prototype, demo, readiness-only documentation, or a post-slice
roadmap.

Success means Unity can run the supported product scope from a fresh launch through real gameplay,
replay/persistence flows, recovery flows, and release-candidate validation, with Electron/TypeScript
remaining the oracle until parity evidence passes.

## Authority And Source Of Truth

- Electron is the only player-facing standard during migration.
- `packages/shared` and the current Electron product behavior remain the rules and UX oracle until
  explicit user approval changes that contract.
- Do not change Electron gameplay, semantics, UI behavior, or tests merely to make Unity pass.
- Unity may implement gameplay only by honoring the current TypeScript contracts, replay corpus,
  deterministic state hash, Electron semantic keys, click rectangles, hover/click results, and FSM
  state transitions.
- Any Unity-engine-specific improvement is allowed only when it improves the Unity implementation
  without weakening Electron parity evidence.

## Supersession Policy

The current execution contract is this file:

```text
docs/migration/unity-migration-governance.md
```

Any active migration document that still describes a sidecar prototype, vertical slice, scoped 90%
parity, guided replay playback, or post-slice roadmap must be archived or marked with a superseded
banner before full migration work is claimed complete.

The following documents are historical context only unless rewritten under this governance file:

```text
docs/migration/unity-goal-mode-implementation-plan.md
docs/migration/unity-vertical-slice-scope.md
docs/migration/unity-vertical-slice-implementation-report.md
docs/migration/unity-electron-90-parity-report.md
```

They must not be used as the current `/goal` execution contract, completion criteria, or parity
success proof.

## Product Scope To Migrate

Unity migration is complete only when every currently supported Electron product surface is either:

1. implemented in Unity with parity evidence, or
2. explicitly excluded by this document with a reason and user-approved replacement or fallback
   policy.

At minimum, inspect and map:

- start/config menu;
- local PvP setup;
- draft/buff selection;
- main gameplay shell;
- board, market, reserve, royal, gem rail, preview, discard, bonus, steal, and privilege flows;
- replay review/import/export;
- settings: locale, theme/surface, sound, and LAN visibility toggles if still supported;
- restart, new game, and recovery;
- LAN and online routes if they remain supported product scope;
- visual lab and dev-only routes, either migrated or explicitly excluded as non-product tooling.

Any unmapped Electron route or user-visible surface blocks full migration completion.

## Completion Standard

Unity is complete only when it is a replacement candidate, not a slice.

The final result must support arbitrary legal local PvP gameplay from a fresh launch through game
over. It must not depend on replay checkpoints, pre-authored fixture paths, debug shortcuts, mock
state, or a manually stepped presentation script to advance normal gameplay.

## Non-Negotiable Anti-Theater Rules

Forbidden:

- claiming a demo, prototype, guided replay, sidecar slice, or visual-only surface as migration
  completion;
- using mock-only data as migration evidence;
- using replay checkpoints to advance live gameplay state;
- bypassing the TypeScript oracle before parity is proven;
- changing Electron behavior merely to make Unity pass;
- committing Steamworks SDKs, Epic SDKs, app IDs, product IDs, partner files, credentials, secrets,
  Unity cache, build outputs, upload artifacts, or large generated assets without explicit user
  authorization;
- creating C# gameplay rules that cannot be checked against TypeScript replay/hash fixtures.

Allowed full-migration work:

- real Unity gameplay implementation;
- Unity UI wiring and interaction state;
- replay import/export/review behavior;
- settings persistence;
- restart, recovery, and invalid-action handling;
- LocalDev platform-service abstraction;
- Unity editor tests, smoke validation, and Windows build automation;
- parity scripts and evidence reports.

Allowed work must still produce verifiable evidence tied back to Electron, `packages/shared`, replay
fixtures, deterministic hashes, and validation commands.

## No Checkpoint-Driven Gameplay

Replay checkpoints may be used only as validation or audit evidence.

Production Unity gameplay must not advance state by copying checkpoint snapshots, replacing live
state from replay snapshots, or following a pre-authored guided fixture path.

The Unity rules layer must apply normalized gameplay commands from the current state and produce the
next state independently. After applying commands, replay checkpoints and TypeScript hashes may be
used to assert parity.

Any code path equivalent to `ReplaceSnapshot(checkpoint.State)` inside live gameplay or production
reducer code blocks completion.

Required audit command:

```sh
git grep -n "ReplaceSnapshot" clients/unity/Assets/GemDuel/Scripts/Core clients/unity/Assets/GemDuel/Scripts/Presentation
```

Allowed occurrences are limited to test-only validators or replay audit tooling. Live reducer,
presentation, and input flows must not use checkpoint replacement as gameplay.

## Required Replay Coverage For Full Migration

The golden corpus must cover every non-debug gameplay action in
`packages/shared/src/types/domain-actions.ts` and every phase transition in
`packages/shared/src/logic/fsmPolicy.ts`.

Coverage must include:

- normal valid command paths;
- invalid phase rejection paths;
- invalid actor or ownership rejection paths;
- insufficient gem, invalid gem, and empty board rejection paths;
- buy, reserve, cancel, and choose-color flows;
- privilege activation, use, and cancel flows;
- reserve deck and discard reserved flows;
- royal selection and next-player recovery;
- bonus, steal, discard excess, replenish, and buff effects;
- replay import/export round trip;
- undo, redo, and review behavior if supported by the migrated product scope.

The action matrix must include every non-debug `GameAction`, including but not limited to:

```text
INITIATE_BUY_JOKER
INITIATE_RESERVE_DECK
CANCEL_RESERVE
RESERVE_DECK
DISCARD_RESERVED
ACTIVATE_PRIVILEGE
USE_PRIVILEGE
CANCEL_PRIVILEGE
UNDO
REDO
PEEK_DECK
REROLL_DRAFT_POOL
```

A single long fixture may provide smoke coverage, but it is not sufficient as proof of full
migration.

## Completion Claim Policy

The final report must not claim success using any of these terms:

- vertical slice
- prototype
- sidecar demo
- scoped parity
- 90% parity
- guided fixture playback
- remaining 10%
- post-slice roadmap

If any of those terms are still accurate, the migration is incomplete.

## Plan Lock

Before changing files for any full migration task, create or update:

```text
docs/migration/current-migration-task-plan.md
```

The plan must include:

```md
## Goal

## Non-Goals

## Files Allowed To Change

## Files Forbidden To Change

## Mandatory Gate Map

## Acceptance Criteria

## Validation Commands

## Blocker Handling

## Rollback Plan
```

If a blocker is found, continue all independent migration work that does not depend on the blocker.
The final status may be `Complete` only if every mandatory gate passes. Otherwise the final status
must be `Incomplete` or `Blocked`, with exact remaining blockers.

## Mandatory Work Inventory

Foundational contracts and planning artifacts that must exist during full migration. If absent,
create them before claiming Gate 0 or final completion:

```text
docs/migration/current-migration-task-plan.md
docs/migration/game-state-contract.md
docs/migration/game-action-contract.md
docs/migration/replay-parity-contract.md
docs/migration/unity-fixture-reader-design.md
docs/migration/platform-services-abstraction.md
docs/migration/unity-migration-risk-table.md
docs/migration/unity-platform-release-checklist.md
```

Active docs that must exist or be updated during full migration:

```text
docs/migration/unity-migration-governance.md
docs/migration/unity-product-scope-map.md
docs/migration/unity-action-fsm-coverage-matrix.md
docs/migration/unity-full-parity-matrix.md
docs/migration/unity-full-migration-completion-report.md
docs/adr/<next-id>-unity-rules-engine-boundary.md
```

Historical docs that must be archived or marked superseded before completion:

```text
docs/migration/unity-goal-mode-implementation-plan.md
docs/migration/unity-vertical-slice-scope.md
docs/migration/unity-vertical-slice-implementation-report.md
docs/migration/unity-electron-90-parity-report.md
```

Unity code and scene surfaces that must be upgraded away from slice naming and behavior:

```text
clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs
clients/unity/Assets/GemDuel/Scenes/GemDuelVerticalSlice.unity
clients/unity/Assets/GemDuel/Scripts/Core/GameReducer.cs
clients/unity/Assets/GemDuel/Scripts/Replay/ReplayParityRunner.cs
clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs
```

Recommended replacements:

```text
GemDuelVerticalSlice.cs -> GemDuelGameController.cs
GemDuelVerticalSlice.unity -> GemDuelGame.unity
```

The rename is a governance requirement because `VerticalSlice` keeps signaling that slice work is a
valid endpoint.

## Mandatory Gate 0: Supersede Vertical-Slice Era Docs

Before claiming any migration progress, the agent must:

- mark active vertical-slice and 90%-parity migration documents as superseded or move them under
  `docs/archive/roadmaps/`;
- update `docs/README.md` so historical 90% parity evidence is not presented as the active
  migration target;
- remove any active `/goal` prompt that asks for a vertical slice, scoped parity, sidecar demo, or
  migration-preparation-only output;
- keep historical facts intact while making clear that they are not current completion evidence.

Acceptance evidence:

- every old slice/scoped-parity document has a superseded banner or archive path;
- the active `/goal` prompt references only this governance file;
- the anti-slice grep is reviewed.

## Mandatory Gate 1: Rules Engine Boundary ADR

Write an ADR before implementing or expanding gameplay:

```text
docs/adr/<next-id>-unity-rules-engine-boundary.md
```

The ADR must choose one rules-engine strategy:

- keep TypeScript as the authoritative rules engine and call it from Unity through a governed
  adapter;
- port the rules to C# behind the same action/replay/hash contracts while TypeScript remains the
  oracle until parity is proven;
- generate or share a portable rules artifact if a later toolchain makes that safer than a manual
  port.

The ADR must reject:

- MonoBehaviour-owned gameplay state;
- UI-driven state mutation;
- platform SDK callbacks mutating gameplay directly;
- C# rules that cannot be replay/hash compared against the TypeScript oracle.

Acceptance evidence:

- ADR merged;
- `IGameRulesEngine` or equivalent boundary documented;
- no Unity presentation code owns rule transitions.

## Mandatory Gate 2: Action/FSM Coverage Matrix

Create:

```text
docs/migration/unity-action-fsm-coverage-matrix.md
```

The matrix must map every `GameAction` from `packages/shared/src/types/domain-actions.ts` and every
FSM policy row from `packages/shared/src/logic/fsmPolicy.ts` to:

- Unity implementation or bridge status;
- valid fixture coverage;
- invalid/rejection fixture coverage;
- expected phase transitions;
- deterministic hash evidence;
- missing gaps and owners;
- user-approved exclusions, if any.

Completion is blocked while any non-debug action or FSM phase is unmapped.

## Mandatory Gate 3: Rule Engine Implementation

Unity must apply real commands from live state. It must not advance production gameplay through
checkpoint replacement.

The rule engine or bridge must:

- load a fresh supported game without using a replay fixture as the gameplay driver;
- apply normalized gameplay commands;
- return the next canonical state;
- return deterministic hash evidence;
- reject illegal commands without mutating state;
- preserve actor, ownership, phase, and resource invariants.

Acceptance evidence:

- arbitrary legal local PvP can proceed beyond the first turn without replay checkpoints;
- invalid phase and invalid actor commands are rejected with structured reasons;
- TypeScript replay/hash parity remains green for covered actions;
- `ReplaceSnapshot(checkpoint.State)` or equivalent is absent from live gameplay paths.

## Mandatory Gate 4: Replay Corpus Expansion

Expand replay/hash fixtures until every required action, phase, rejection path, and edge case has
TypeScript oracle coverage.

The corpus must include action-by-action, phase-by-phase, and edge-case fixtures. One long local PvP
fixture is smoke evidence only.

Acceptance evidence:

- `fixtures/replay-golden/manifest.json` records complete required coverage;
- `tools/migration/verify-replay-parity.ts` passes;
- Unity can read the fixture shape;
- TypeScript and Unity report the same deterministic hashes for migrated coverage;
- missing coverage is listed as a blocker, not a "remaining 10%" roadmap.

## Mandatory Gate 5: Unity UI/Product Surface Migration

Implement the supported Electron product scope in Unity, not only the local board.

Unity UI must translate player intent into contract commands:

- board clicks and drags produce `TAKE_GEMS`, `TAKE_BONUS_GEM`, `USE_PRIVILEGE`, or reserve-gold
  commands only when the FSM permits them;
- market preview buttons produce buy/reserve commands only through the rules adapter;
- inventory gem clicks produce discard/steal commands only in the matching phase;
- royal clicks produce selection commands only in `SELECT_ROYAL`;
- settings buttons mutate settings state only, never gameplay state.

Required UI parity includes:

- semantic keys;
- clickable rectangles;
- hover results;
- click results;
- state transitions;
- error/rejection states;
- two required viewports;
- screenshot and visual evidence.

## Mandatory Gate 6: Replay, Persistence, Settings, Recovery

Implement or explicitly exclude with user approval:

- replay import/export/review;
- autosave and settings persistence;
- restart/new game;
- invalid-action recovery;
- close/reopen recovery;
- settings locale, theme/surface, sound, and LAN visibility toggles if still supported.

Acceptance evidence:

- replay round trip preserves deterministic hash;
- settings survive restart;
- invalid actions do not mutate gameplay state;
- recovery does not require `Library/`, local Unity cache, or mock fixture state.

## Mandatory Gate 7: Platform Services

LocalDev platform services are allowed first. Steam/Epic SDKs, app IDs, product IDs, partner files,
credentials, upload output, and live platform callbacks require explicit user authorization.

Platform services must remain adapters. They must not enter deterministic gameplay state or replay
hashes.

Acceptance evidence:

- LocalDev platform-service interface is implemented;
- platform state is excluded from gameplay hash;
- no SDK binaries, secrets, partner files, or upload artifacts are committed;
- Steam/Epic production work is documented as blocked until official account and SDK authorization.

## Mandatory Gate 8: Electron/Unity Parity Matrix

Create:

```text
docs/migration/unity-full-parity-matrix.md
```

The matrix must compare Electron and Unity across the required product scope:

- semantic keys;
- clickable rectangles;
- hover stability;
- click results;
- state transitions;
- settings save/load/surface behavior;
- board/take-gems/follow-up phases;
- market and reserved-card flows;
- royal area behavior;
- preview, buy, reserve, cancel, discard, bonus, steal, privilege flows;
- screenshots for the two required viewports;
- browser process guard status.

Electron remains the standard. Do not modify Electron to hide a Unity mismatch.

## Mandatory Gate 9: Build And Release Candidate Validation

Run all repo, replay, Unity editor, and build validations that are available.

Unity migration is not complete until:

- Steam/Epic release checklists are current as documentation and contain no SDK secrets, app IDs, or
  partner-only files;
- Unity EditMode tests pass when Unity is available;
- Unity PlayMode or smoke validation covers fresh launch and arbitrary legal local PvP;
- Windows build succeeds when Unity is available;
- repo gates pass;
- release gates pass;
- no generated Unity cache, build outputs, SDK binaries, partner files, app IDs, or credentials are
  committed.

## Definition Of Done For Full Migration

The migration is complete only when all are true:

- Unity can start a fresh supported game without loading a replay fixture as the gameplay driver.
- Unity can play an arbitrary legal local PvP match from start through game over.
- Unity gameplay state is advanced by the rules engine, not by replay checkpoints.
- Every non-debug `GameAction` has Unity coverage or an explicit user-approved exclusion.
- Every FSM phase has allowed-action and rejected-action tests.
- Every Electron-supported product route/surface is implemented or explicitly excluded with
  approval.
- Replay import/export and review behavior are implemented or explicitly excluded with approval.
- Settings persistence and recovery behavior are implemented.
- Invalid actions are rejected without mutating state.
- TypeScript replay/hash parity passes.
- Unity replay/hash parity passes.
- Electron/Unity semantic/click/hover/state parity passes for required viewports.
- Unity Editor tests pass when Unity is available.
- Windows build succeeds when Unity is available.
- No Steam/Epic SDK, app ID, credential, partner file, upload artifact, Unity cache, or build output
  is committed.
- Final report does not describe the result as a demo, prototype, vertical slice, scoped parity,
  90% parity, or post-slice roadmap.

## Validation Commands

Run the strongest applicable local gate set for the files changed. For full migration completion,
the minimum command list is:

```sh
pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts
pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts --check
pnpm parity:electron-unity
pnpm typecheck
pnpm lint
pnpm test
pnpm release:check
pnpm boundaries:check
pnpm secrets:check
git diff --check
git status --short
```

Unity available:

```sh
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testResults artifacts/unity/editmode-results.xml -logFile artifacts/unity/editmode.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -projectPath clients/unity -executeMethod GemDuel.Editor.BuildWindows.Build -logFile artifacts/unity/build.log -quit
```

Anti-slice review:

```sh
git grep -nE "vertical slice|VerticalSlice|prototype|scoped parity|90% parity|guided fixture|remaining 10%" docs/migration clients/unity/Assets/GemDuel/Scripts
git grep -n "ReplaceSnapshot" clients/unity/Assets/GemDuel/Scripts/Core clients/unity/Assets/GemDuel/Scripts/Presentation
```

The anti-slice grep is an audit input, not a blanket ban on historical words. Occurrences inside
superseded historical documents are allowed only when those documents are clearly not current
execution contracts. Occurrences in production Unity gameplay code or active completion criteria
block completion.

## Final Completion Report

Create:

```text
docs/migration/unity-full-migration-completion-report.md
```

The final report must include:

- final status: `Complete`, `Incomplete`, or `Blocked`;
- changed files;
- product surfaces mapped, implemented, or excluded;
- `GameAction` and FSM coverage status;
- replay corpus and hash coverage status;
- Unity rules-engine boundary and implementation status;
- checkpoint-driven gameplay audit result;
- Electron/Unity parity matrix result;
- validation commands and results;
- Unity editor/build availability and evidence;
- secrets/cache/build-output hygiene result;
- exact remaining blockers if not complete.

The final status may be `Complete` only if every mandatory gate passes.

## Required Self-Audit

Every final report for a Unity migration task must answer:

1. Did I claim any demo, prototype, sidecar slice, vertical slice, guided replay, scoped parity, or
   90% parity as completion?
2. Did I duplicate gameplay rules outside `packages/shared`? If yes, explain the selected
   rules-engine boundary and name the replay/hash parity proof.
3. Did live Unity gameplay advance by replay checkpoints or snapshot replacement?
4. Did every migration artifact connect back to Electron, `packages/shared`, replay fixtures, or
   deterministic hashes?
5. Did I add or run validation commands?
6. Did I leave any mock-only path that could be mistaken for real migration progress?
7. Did I modify Electron behavior to make Unity pass?
8. Did I commit any SDK binary, app ID, credential, partner file, Unity cache, or build output?

## Independent Audit Prompt

Use this prompt to review a migration PR:

```text
You are an independent code auditor. Review this PR for Unity migration theater.

Check:
1. Whether a demo, mock, fake scene, sidecar slice, scoped parity report, or visual-only surface was
   claimed as full migration.
2. Whether the PR bypasses packages/shared or Electron as the current rules/UX oracle.
3. Whether Unity live gameplay advances state by replay checkpoint replacement.
4. Whether every non-debug GameAction and FSM phase is covered or explicitly excluded with approval.
5. Whether Unity code was added without replay/state-hash verification.
6. Whether a parallel gameplay rule implementation was introduced without an ADR and parity proof.
7. Whether active vertical-slice-era docs remain usable as execution contracts.
8. Whether large assets, SDKs, secrets, Unity Library/Temp/Builds, upload artifacts, or credentials
   were committed.
9. Whether every migration artifact has an acceptance command or validation path.

Return:
- Pass/Fail
- Blocking issues
- Suspicious demo/slice behavior
- Required fixes before merge
```

## Short `/goal` Prompt

```text
/goal Execute the full Unity migration defined by docs/migration/unity-migration-governance.md.

This is explicit authorization for Unity gameplay, Unity UI wiring, replay/import/export,
settings persistence, recovery behavior, platform-service abstraction, Unity validation, and
release-candidate build work.

Do not deliver a demo, prototype, sidecar slice, vertical slice, guided replay playback,
migration-preparation-only report, scoped 90% parity report, or visual-only surface as success.

First mark all active vertical-slice-era migration docs as superseded or archive them. Then complete
the full migration gates in this run:

1. Write the Unity rules-engine boundary ADR.
2. Create the product-scope map from the current Electron routes and surfaces.
3. Create the GameAction/FSM coverage matrix from packages/shared.
4. Implement or bridge the Unity rules engine so live gameplay advances from commands, not replay
   checkpoints.
5. Expand replay/hash fixtures until every required action, phase, rejection path, and edge case has
   TypeScript oracle coverage.
6. Implement Unity product UI for the supported Electron scope, including real arbitrary local PvP
   from fresh game start to game over.
7. Implement replay import/export/review, settings persistence, restart/recovery, invalid-action
   recovery, and LocalDev platform services.
8. Run Electron/Unity semantic, click, hover, state-transition, screenshot, and viewport parity.
9. Run all repo, replay, Unity editor, and build validations that are available.
10. Write docs/migration/unity-full-migration-completion-report.md.

The final status may be Complete only if every mandatory gate passes. If a blocker exists, continue
all independent work first, then report Incomplete or Blocked with exact remaining blockers. Never
claim completion while any result still depends on guided fixtures, checkpoint state replacement,
mock-only data, scoped parity, or future post-slice work.
```
