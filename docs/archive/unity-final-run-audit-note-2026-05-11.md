# Unity Final Run Audit Note - 2026-05-11

Status: Incomplete.

The run cycle was stopped without expanding scope further. The only retained code diff is the
rollback of an unverified Unity EditMode seed-sweep expansion in
`clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`; it removes additional
coverage scaffolding and does not add product runtime behavior.

## Recent Non-Unity / Non-Doc Diff Audit

The current uncommitted diff no longer touches `apps/desktop/**` or
`packages/shared/src/logic/actions/**`. The recent committed migration change set at
`6e8af1b9513cab7ab8a6713b0b7d1786a1ff676c` did touch those areas:

- `apps/desktop/src/app/parity/__tests__/electronUnityParityHarness.test.tsx`: test-only Electron
  parity harness coverage for replay setup variants, mismatch recovery, dispatch errors, DOM paths,
  hover state, board/gem/settings controls, missing DOM paths, and replay fallback. Electron runtime
  behavior and shared gameplay logic are not changed by this file.
- `apps/desktop/src/app/parity/__tests__/electronUnityParityState.test.ts`: test-only parity state
  capture coverage for chrome, settings, player-gem, and contextual action semantics. Electron
  runtime behavior and shared gameplay logic are not changed by this file.
- `apps/desktop/viteManualChunks.ts`: build-bundling change that groups route-owned UI, shared game
  UI, and desktop presentation modules into explicit Vite chunks. This can affect packaged asset
  chunking/loading, but it does not intentionally change Electron gameplay semantics or shared game
  logic.
- `packages/shared/src/logic/actions/__tests__/marketActions.phase3.test.ts`: test-only coverage
  asserting that an unaffordable buy rejection preserves `pendingBuy`. Shared runtime behavior is
  not changed by the test itself.
- `packages/shared/src/logic/actions/boardActions.ts`: shared runtime state-output change to make
  empty-cell UIDs deterministic from a state-scoped prefix and coordinates. This can affect shared
  state identity/hash output and therefore Electron-observed replay/hash behavior, but it is not an
  Electron-only UI change.
- `packages/shared/src/logic/actions/buffActions.ts`: shared runtime draft-reroll change to seed the
  random source from current draft/game context. This affects shared gameplay outcomes for draft
  rerolls by making them deterministic for replay/hash parity.
- `packages/shared/src/logic/actions/marketActions.ts`: shared runtime rejection-path change that
  keeps `pendingBuy` intact when an attempted buy is unaffordable. This affects shared logic and
  Electron-observed invalid-action behavior for that rejection path.

## Runtime Boundary Confirmations

`TypeScriptGameRulesEngine` is confirmed as LocalDev / evidence-bridge infrastructure only. It is
not certified as the final release runtime because the `pnpm` / `vite-node` / runtime packaging
concerns have not been fully closed in this run.

Checkpoint-derived helpers in `GameReducer` remain replay/audit helpers only. The final
`ReplaceSnapshot` grep over Unity Core and Presentation scripts produced no live runtime matches.

## Command Evidence

`git diff --name-only`

```text
clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs
```

`git status --short`

```text
 M clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs
?? docs/archive/unity-final-run-audit-note-2026-05-11.md
```

`git grep -n "ReplaceSnapshot" -- clients/unity/Assets/GemDuel/Scripts/Core clients/unity/Assets/GemDuel/Scripts/Presentation`

```text
NO_MATCHES
```

`git grep -nE "[anti-slice gate pattern]" -- docs/migration clients/unity/Assets/GemDuel/Scripts`

```text
docs/migration/current-migration-task-plan.md:174:git grep -nE "vertical slice|VerticalSlice|prototype|scoped parity|90% parity|guided fixture|remaining 10%" docs/migration clients/unity/Assets/GemDuel/Scripts
docs/migration/local-pvp-operation-parity-gap-report-2026-05-10.md:84:- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs:2041-2043`
docs/migration/local-pvp-operation-parity-gap-report-2026-05-10.md:86:- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs:2048-2060`
docs/migration/local-pvp-operation-parity-gap-report-2026-05-10.md:117:- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs:1924-1934`
docs/migration/local-pvp-operation-parity-gap-report-2026-05-10.md:119:- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs:1949-1951`
docs/migration/local-pvp-operation-parity-gap-report-2026-05-10.md:190:- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs:336-355`
docs/migration/local-pvp-operation-parity-gap-report-2026-05-10.md:192:- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs:2586-2616`
docs/migration/unity-electron-90-parity-report.md:9:full Unity migration completion. If "90% parity", "scoped parity", "guided fixture playback", or
docs/migration/unity-electron-90-parity-report.md:10:"remaining 10%" are still accurate descriptions of the result, migration is incomplete.
docs/migration/unity-electron-90-parity-report.md:20:This report defines the current Unity target as 90% scoped parity with the Electron local PvP
docs/migration/unity-electron-90-parity-report.md:90:1. Replace guided fixture progression with arbitrary local PvP reducer behavior that does not depend
docs/migration/unity-full-migration-completion-report.md:104:  Unity production script or scene remains named `GemDuelVerticalSlice`.
docs/migration/unity-full-migration-completion-report.md:138:1. Did this report claim a demo, prototype, sidecar slice, vertical slice, guided replay, scoped
docs/migration/unity-full-migration-completion-report.md:139:   parity, or 90% parity as completion? No. Status is `Incomplete`.
docs/migration/unity-goal-mode-implementation-plan.md:9:full Unity migration completion, not a prototype, sidecar slice, scoped parity pass, or 90% demo.
docs/migration/unity-goal-mode-implementation-plan.md:17:Build a Unity sidecar vertical slice under `clients/unity/` without replacing the current
docs/migration/unity-goal-mode-implementation-plan.md:22:This is not a full production migration. It is a gated prototype for deciding whether Unity is
docs/migration/unity-goal-mode-implementation-plan.md:68:| 12    | Presentation MVP           | Create a minimal `GemDuelVerticalSlice` scene with orthographic camera, 16:9 layout, 5x5 board, placeholder gems/cards/royals, player zones, market rows, reserved area, royal area, and status/topbar text.                                                                                                      | Scene and presentation scripts                                   | Scene can render fixture or initial local PvP state.                                           |
docs/migration/unity-goal-mode-implementation-plan.md:72:| 16    | Save concept               | Implement LocalDev JSON save/read for prototype settings/progress only. Do not enable cloud save.                                                                                                                                                                                                                 | Local save adapter                                               | Read/write failures surface as UI status and do not mutate game rules.                         |
docs/migration/unity-migration-governance.md:6:all migration-preparation-only, vertical-slice, sidecar-prototype, guided-fixture, and scoped-parity
docs/migration/unity-migration-governance.md:21:The agent must not stop at migration preparation, Unity skeleton, vertical slice, guided fixture
docs/migration/unity-migration-governance.md:22:playback, scoped parity, 90% parity, prototype, demo, readiness-only documentation, or a post-slice
docs/migration/unity-migration-governance.md:49:Any active migration document that still describes a sidecar prototype, vertical slice, scoped 90%
docs/migration/unity-migration-governance.md:100:- claiming a demo, prototype, guided replay, sidecar slice, or visual-only surface as migration
docs/migration/unity-migration-governance.md:130:state from replay snapshots, or following a pre-authored guided fixture path.
docs/migration/unity-migration-governance.md:192:- vertical slice
docs/migration/unity-migration-governance.md:193:- prototype
docs/migration/unity-migration-governance.md:195:- scoped parity
docs/migration/unity-migration-governance.md:196:- 90% parity
docs/migration/unity-migration-governance.md:197:- guided fixture playback
docs/migration/unity-migration-governance.md:198:- remaining 10%
docs/migration/unity-migration-governance.md:276:clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs
docs/migration/unity-migration-governance.md:277:clients/unity/Assets/GemDuel/Scenes/GemDuelVerticalSlice.unity
docs/migration/unity-migration-governance.md:286:GemDuelVerticalSlice.cs -> GemDuelGameController.cs
docs/migration/unity-migration-governance.md:287:GemDuelVerticalSlice.unity -> GemDuelGame.unity
docs/migration/unity-migration-governance.md:290:The rename is a governance requirement because `VerticalSlice` keeps signaling that slice work is a
docs/migration/unity-migration-governance.md:299:- update `docs/README.md` so historical 90% parity evidence is not presented as the active
docs/migration/unity-migration-governance.md:301:- remove any active `/goal` prompt that asks for a vertical slice, scoped parity, sidecar demo, or
docs/migration/unity-migration-governance.md:397:- missing coverage is listed as a blocker, not a "remaining 10%" roadmap.
docs/migration/unity-migration-governance.md:518:- Final report does not describe the result as a demo, prototype, vertical slice, scoped parity,
docs/migration/unity-migration-governance.md:519:  90% parity, or post-slice roadmap.
docs/migration/unity-migration-governance.md:550:git grep -nE "vertical slice|VerticalSlice|prototype|scoped parity|90% parity|guided fixture|remaining 10%" docs/migration clients/unity/Assets/GemDuel/Scripts
docs/migration/unity-migration-governance.md:588:1. Did I claim any demo, prototype, sidecar slice, vertical slice, guided replay, scoped parity, or
docs/migration/unity-migration-governance.md:589:   90% parity as completion?
docs/migration/unity-migration-governance.md:608:1. Whether a demo, mock, fake scene, sidecar slice, scoped parity report, or visual-only surface was
docs/migration/unity-migration-governance.md:636:Do not deliver a demo, prototype, sidecar slice, vertical slice, guided replay playback,
docs/migration/unity-migration-governance.md:637:migration-preparation-only report, scoped 90% parity report, or visual-only surface as success.
docs/migration/unity-migration-governance.md:659:claim completion while any result still depends on guided fixtures, checkpoint state replacement,
docs/migration/unity-migration-governance.md:660:mock-only data, scoped parity, or future post-slice work.
docs/migration/unity-version-lock.md:6:all target the same project state. Previous sidecar-prototype language is superseded by
docs/migration/unity-vertical-slice-implementation-report.md:9:full Unity migration completion. Any remaining guided fixture, checkpoint-driven, or slice-only path
docs/migration/unity-vertical-slice-implementation-report.md:18:Implemented the source-side Unity vertical slice described in
docs/migration/unity-vertical-slice-implementation-report.md:92:- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs`
docs/migration/unity-vertical-slice-implementation-report.md:98:- `clients/unity/Assets/GemDuel/Scenes/GemDuelVerticalSlice.unity`
docs/migration/unity-vertical-slice-implementation-report.md:258:3. Replace guided fixture progression with arbitrary local PvP reducer behavior that does not depend
docs/migration/unity-vertical-slice-scope.md:9:full Unity migration completion. A sidecar slice or prototype is not a valid endpoint.
docs/migration/unity-vertical-slice-scope.md:15:The Unity vertical slice is a sidecar prototype. It must prove whether a native game client is worth
```

`git diff --check`

```text

```

`Get-CimInstance Win32_Process -Filter "name = 'Unity.exe'" | Where-Object { $_.CommandLine -like '*E:\simonbb\GemDuel-Dev*' } | Select-Object ProcessId,CommandLine`

```text

```

`git show --name-only --format=short HEAD -- apps/desktop packages/shared/src/logic/actions`

```text
commit 6e8af1b9513cab7ab8a6713b0b7d1786a1ff676c
Author: Mingzhi Hu <mingzhi0119@gmail.com>

    Advance Unity migration evidence and bridge coverage

apps/desktop/src/app/parity/__tests__/electronUnityParityHarness.test.tsx
apps/desktop/src/app/parity/__tests__/electronUnityParityState.test.ts
apps/desktop/viteManualChunks.ts
packages/shared/src/logic/actions/__tests__/marketActions.phase3.test.ts
packages/shared/src/logic/actions/boardActions.ts
packages/shared/src/logic/actions/buffActions.ts
packages/shared/src/logic/actions/marketActions.ts
```

`git show --stat --format=short HEAD -- apps/desktop packages/shared/src/logic/actions`

```text
commit 6e8af1b9513cab7ab8a6713b0b7d1786a1ff676c
Author: Mingzhi Hu <mingzhi0119@gmail.com>

    Advance Unity migration evidence and bridge coverage

 .../__tests__/electronUnityParityHarness.test.tsx  | 395 +++++++++++++++++++++
 .../__tests__/electronUnityParityState.test.ts     |  76 ++++
 apps/desktop/viteManualChunks.ts                   |  26 ++
 .../actions/__tests__/marketActions.phase3.test.ts |   6 +
 packages/shared/src/logic/actions/boardActions.ts  |   3 +-
 packages/shared/src/logic/actions/buffActions.ts   |  15 +-
 packages/shared/src/logic/actions/marketActions.ts |   4 +-
 7 files changed, 520 insertions(+), 5 deletions(-)
```
