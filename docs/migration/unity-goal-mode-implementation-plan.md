# Superseded: Vertical Slice Plan

Last updated: 2026-05-11

This document is archived historical context only. It must not be used as the current `/goal`
execution contract.

The current execution contract is `docs/migration/unity-migration-governance.md`, whose target is
full Unity migration completion, not a prototype, sidecar slice, scoped parity pass, or 90% demo.

## Historical Document

# GemDuel Unity Goal Mode Implementation Plan

## Goal

Build a Unity sidecar vertical slice under `clients/unity/` without replacing the current
Electron/TypeScript game. The TypeScript implementation remains the gameplay oracle. Unity must
prove it can read the committed replay fixtures, reproduce the replay parity hashes, render a
minimal 5x5 local PvP board, and keep platform services behind non-SDK LocalDev stubs.

This is not a full production migration. It is a gated prototype for deciding whether Unity is
worth continuing.

## Hard Constraints

- Do not modify gameplay logic in `packages/shared`.
- Do not replace the Electron/React desktop client.
- Do not add Steamworks.NET, Epic Online Services, Unity SDK binaries, app IDs, product IDs,
  tokens, secrets, branch passwords, account files, upload logs, or generated platform manifests.
- Do not commit Unity-generated cache or local output directories: `Library/`, `Temp/`, `Obj/`,
  `Logs/`, `UserSettings/`, `Builds/`, or `artifacts/unity/`.
- Keep all build/test outputs ignored.
- If Unity Editor `6000.4.6f1` is unavailable, complete source/docs/TS validation and report Unity
  editor test/build as a blocker. Do not fake Unity gate success.
- Windows Unity does not support opening this project directly from a WSL ext4 case-sensitive path.
  If the active checkout is under `/home/...`, validate through a temporary NTFS mirror such as
  `C:\Users\sange\.codex\unity-workspaces\GemDuel-Dev`; keep the mirror and all Unity outputs
  untracked.

## Source Documents

- `docs/migration/unity-vertical-slice-scope.md`
- `docs/migration/replay-parity-contract.md`
- `docs/migration/game-state-contract.md`
- `docs/migration/game-action-contract.md`
- `docs/migration/unity-fixture-reader-design.md`
- `docs/migration/platform-services-abstraction.md`
- `fixtures/replay-golden/manifest.json`
- `clients/unity/ProjectSettings/ProjectVersion.txt`

## Implementation Table

| Phase | Objective                  | Implementation detail                                                                                                                                                                                                                                                                                             | Deliverable                                                      | Acceptance                                                                                     |
| ----- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 0     | Boundary guard             | Record `git status --short --branch`; preserve unrelated existing work; only touch `clients/unity/`, `docs/migration/`, `fixtures/`, and `tools/migration/` unless a validation command forces a docs-only correction.                                                                                            | Start-state note in final report                                 | No unrelated tracked files changed.                                                            |
| 1     | Unity package minimum      | Update `clients/unity/Packages/manifest.json` to include only Unity official JSON support and Unity official EditMode test support: `com.unity.nuget.newtonsoft-json` plus `com.unity.test-framework`. Do not add Steam/EOS/analytics packages.                                                                   | Unity package manifest and package lock                          | Manifest contains no third-party platform SDKs.                                                |
| 2     | Export Unity catalogs      | Add `tools/migration/export-unity-catalogs.ts`. Export cards, royals, buffs, gem types, replay/rules metadata from TS constants into `fixtures/unity-catalog/`. Include `--check` mode that fails if committed catalog JSON differs from generated output.                                                        | `fixtures/unity-catalog/{manifest,cards,royals,buffs,gems}.json` | Catalog includes every card template, royal ID, and buff ID referenced by replay fixtures.     |
| 3     | C# folder structure        | Create `clients/unity/Assets/GemDuel/Scripts/{Core,Catalog,Replay,Platform,Presentation,Editor}` and `Assets/GemDuel/Tests/EditMode`.                                                                                                                                                                             | Unity script folders                                             | Folder layout is clean and reviewable.                                                         |
| 4     | Core DTOs                  | Implement C# records/classes for `GameState`, `GemInventory`, `CardDef`, `RoyalDef`, `BuffDef`, `BoardCell`, `PlayerKey`, `GamePhase`, `GemColor`, and replay card instance IDs. Keep gameplay state free of Unity scene object references.                                                                       | `GemDuel.Core` types                                             | Fields cover the hash-relevant state in `game-state-contract.md`.                              |
| 5     | Catalog loader             | Implement Newtonsoft-based catalog loading from `fixtures/unity-catalog`. Build lookup maps by card ID, royal ID, and buff ID. Missing IDs must fail explicitly.                                                                                                                                                  | `GemDuel.Catalog.CatalogLoader`                                  | All `init.cardInstances`, royal IDs, and buff IDs in golden fixtures resolve.                  |
| 6     | Replay DTOs                | Implement manifest, Replay vNext, init snapshot, summary, and event DTOs. Support current fixture events: `select_buff`, `take_gems`, `buy_card`, `take_bonus_gem`, `replenish`, `select_royal`, `steal_gem`, `reserve_card`, `discard_gem`.                                                                      | `GemDuel.Replay` DTOs                                            | Unknown event type produces a failed parity result, not a silent skip.                         |
| 7     | Bootstrap loader           | Build Unity `GameState` from replay `init`: board, bag, market, decks, card instance map, royal deck, players, turn, phase, draft/buff state.                                                                                                                                                                     | `ReplayBootstrapper`                                             | `local-pvp-opening` loads and can be serialized for hashing.                                   |
| 8     | Reducer parity subset      | Implement a C# reducer only for commands required by committed fixtures. Preserve turn/phase progression, actor ownership, market references, card instance IDs, reserve, buy, bonus gem, replenish, royal selection, steal, discard, and buff-draft effects used by fixtures. Unsupported commands fail clearly. | `GemDuel.Core.GameReducer`                                       | The reducer can process all committed fixture events without platform or Unity input coupling. |
| 9     | Hash parity                | Implement `ReplayStateSerializer` and `ReplayStateHasher` for `replay-state-hash-v1`: replay snapshot serialization, stable JSON key ordering, invariant formatting, and the same DJB2-style hash as TS `stateHash.ts`.                                                                                           | `GemDuel.Replay.ReplayStateHasher`                               | Fixture hashes equal `e1b5e1bf`, `e0f3316a`, and `d161e8c`.                                    |
| 10    | Parity runner              | Implement `ReplayParityRunner` to read `fixtures/replay-golden/manifest.json`, verify coverage tags, apply every fixture event, compare hash/winner/end reason/event count/turn count, and write JSON plus Markdown reports under ignored `artifacts/unity/`.                                                     | Parity report generator                                          | Report shows 3 passed fixtures and no coverage gaps.                                           |
| 11    | EditMode tests             | Add Unity EditMode tests for catalog loading, manifest loading, bootstrap hash, full fixture parity, and unknown event failure.                                                                                                                                                                                   | `Assets/GemDuel/Tests/EditMode/*`                                | Unity EditMode tests pass when Unity Editor is available.                                      |
| 12    | Presentation MVP           | Create a minimal `GemDuelVerticalSlice` scene with orthographic camera, 16:9 layout, 5x5 board, placeholder gems/cards/royals, player zones, market rows, reserved area, royal area, and status/topbar text.                                                                                                      | Scene and presentation scripts                                   | Scene can render fixture or initial local PvP state.                                           |
| 13    | Local PvP input            | Add input layer for selecting gems, buying/reserving market cards, selecting royals, and handling bonus/steal/discard states. Input emits reducer commands only.                                                                                                                                                  | Presentation controllers                                         | One local PvP match can reach game over without debug actions.                                 |
| 14    | Placeholder art            | Use simple generated Unity primitives, colors, or programmatic sprites/materials. Do not import commercial or archived reference art.                                                                                                                                                                             | Basic placeholders                                               | All assets are safe to commit and provenance is obvious.                                       |
| 15    | LocalDev platform services | Implement `IPlatformServices`, `PlatformCapabilities`, `PlatformLaunchSource`, and `LocalDevPlatformServices`. Include init, opaque local user, overlay flag, achievement no-op, local save read/write, launch source, store page fallback, and capability flags.                                                 | `GemDuel.Platform`                                               | Platform state does not enter replay state or hash.                                            |
| 16    | Save concept               | Implement LocalDev JSON save/read for prototype settings/progress only. Do not enable cloud save.                                                                                                                                                                                                                 | Local save adapter                                               | Read/write failures surface as UI status and do not mutate game rules.                         |
| 17    | Achievement concept        | Define game-owned achievement keys such as `FIRST_LOCAL_WIN`; LocalDev unlock writes memory/log state only.                                                                                                                                                                                                       | Achievement registry/stub                                        | No Steam/Epic achievement IDs appear in git.                                                   |
| 18    | Build automation           | Add Unity Editor build method that outputs Windows build to ignored `artifacts/unity/build/windows/`. Do not commit build products.                                                                                                                                                                               | `GemDuel.Editor.BuildWindows`                                    | Unity batchmode can create a Windows build if Unity is installed.                              |
| 19    | Implementation report      | Add or update `docs/migration/unity-vertical-slice-implementation-report.md` with architecture, changed files, commands, passed gates, skipped/blocker gates, and next full-migration steps.                                                                                                                      | Implementation report                                            | Report matches real execution evidence.                                                        |
| 20    | Validation loop            | Run all TS/repo gates, Unity parity checks, and Unity editor gates when available. Fix failures or report real blockers.                                                                                                                                                                                          | Final evidence                                                   | All runnable gates pass; Unity-only unavailable gates are clearly marked.                      |

## Required Public Surfaces

Add these Unity-side public interfaces/types:

- `IPlatformServices`
- `PlatformCapabilities`
- `PlatformLaunchSource`
- `ReplayParityRunner`
- `ReplayManifest`
- `ReplayVNext`
- `GameState`
- `GameReducer`
- `ReplayStateHasher`

Add these repo-facing JSON artifacts:

- `fixtures/unity-catalog/manifest.json`
- `fixtures/unity-catalog/cards.json`
- `fixtures/unity-catalog/royals.json`
- `fixtures/unity-catalog/buffs.json`
- `fixtures/unity-catalog/gems.json`

## Required Validation Commands

Run from repository root:

```sh
pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts
pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts --check
pnpm exec prettier --check docs/migration tools/migration fixtures clients/unity
pnpm secrets:check
pnpm typecheck
pnpm lint
pnpm test
pnpm release:check
pnpm boundaries:check
```

If Unity Editor `6000.4.6f1` is available, also run:

```sh
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testResults artifacts/unity/editmode-results.xml -logFile artifacts/unity/editmode.log
"C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe" -batchmode -projectPath clients/unity -executeMethod GemDuel.Editor.BuildWindows.Build -logFile artifacts/unity/build.log -quit
```

If the Unity executable path differs, locate it and record the exact command used. For EditMode
tests, do not add `-quit`; the Unity Test Framework exits after completing the run, while `-quit`
can terminate before the XML result is written. If Unity is installed on Windows but the active repo
is on WSL ext4, mirror the source to an NTFS path and run the same commands there. If Unity is not
installed or cannot run, mark Unity EditMode/build validation as blocked and provide the source-level
evidence that was completed.

## Manual Acceptance

- Open the Unity scene and confirm board, market, player zones, royal area, and status/topbar are
  visible.
- Play a local PvP match through take gems, reserve, buy, royal selection, extra turn, and game
  over.
- Close and reopen Unity without needing to commit `Library/` or local settings.
- Confirm `git status` does not show Unity cache, SDK binaries, platform credentials, upload
  artifacts, or build output.

## Post-Slice Roadmap

| Stage                     | Entry condition                            | Work                                                                                       |
| ------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| M1 full rules parity      | Vertical slice hashes are green            | Expand C# reducer to all `GameAction`, full buff catalog, larger replay corpus.            |
| M2 full UI                | M1 passes                                  | Rebuild settings, tutorial, rulebook, replay viewer, AI/PVE, themes, audio, accessibility. |
| M3 online/LAN decision    | M1/M2 stable                               | Decide existing protocol vs Steam/Epic relay vs new transport; design crossplay first.     |
| M4 platform SDK smoke     | Official docs and account setup complete   | Private Steam adapter smoke first, then Epic adapter if dual-store remains required.       |
| M5 store hardening        | SDK smoke passes                           | Store metadata, assets, privacy/EULA, notices, provenance, build upload.                   |
| M6 production replacement | Unity rules/UI/platform/release gates pass | Decide Electron retirement, dual-track maintenance, or Unity as Steam-only client.         |

## Historical Prompt Removed

The executable `/goal` prompt that originally targeted this vertical-slice plan has been removed.
This file is retained only as historical context and must not provide runnable migration instructions.
