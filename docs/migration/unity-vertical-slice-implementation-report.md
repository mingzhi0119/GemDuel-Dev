# Unity Vertical Slice Implementation Report

Last updated: 2026-05-09

## Scope

Implemented the source-side Unity vertical slice described in
`docs/migration/unity-goal-mode-implementation-plan.md`. The Electron/TypeScript implementation
remains the gameplay oracle. `packages/shared` gameplay logic was not modified.

Version-lock update after implementation:

- Current target Unity Editor: `6000.4.6f1`
- Revision/changeset: `0b051c2e5d54`
- Official release page verified: 2026-05-09
- Local Unity executable found:
  `C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe`
- Local .NET executable found: `C:\Program Files\dotnet\dotnet.exe` with SDK `10.0.203`.
- Visual Studio IDE/MSBuild/C# compiler found under
  `C:\Program Files\Microsoft Visual Studio\18\Community`.
- Visual Studio Build Tools 2022/MSVC found under `C:\BuildTools`; `cl.exe` was found at
  `C:\BuildTools\VC\Tools\MSVC\14.44.35207\bin\Hostx64\x64\cl.exe`.
- Windows Unity cannot open this WSL `/home/...` checkout directly because it is on a
  case-sensitive filesystem. Unity validation was run from the temporary NTFS mirror
  `C:\Users\sange\.codex\unity-workspaces\GemDuel-Dev`.

## Boundary Note

Start-state command: `git status --short --branch`

Observed unrelated existing work before implementation:

- `D docs/prompts/User-asset-regeneration.txt`
- `?? docs/prompts/User-asset-regeneration.md`
- pre-existing untracked migration/release/Unity prompt artifacts from the previous prompt set

This pass changed the allowed Unity/migration/fixtures/tools areas plus one root `.gitignore`
exception. The exception is required because the existing root `Replay/` ignore rule also hid the
required Unity source folder `clients/unity/Assets/GemDuel/Scripts/Replay/`; the root generated
`Replay/` artifact policy remains intact.

## Implemented Artifacts

Unity package minimum:

- `clients/unity/Packages/manifest.json`
- `clients/unity/Packages/packages-lock.json`
- Dependencies added: Unity official `com.unity.nuget.newtonsoft-json` and
  `com.unity.test-framework`
- No Steamworks, Epic Online Services, analytics, app IDs, product IDs, secrets, tokens, or SDK
  binaries were added.

Catalog export:

- `tools/migration/export-unity-catalogs.ts`
- `fixtures/unity-catalog/manifest.json`
- `fixtures/unity-catalog/cards.json`
- `fixtures/unity-catalog/royals.json`
- `fixtures/unity-catalog/buffs.json`
- `fixtures/unity-catalog/gems.json`

Replay fixtures:

- `tools/migration/export-unity-fixtures.ts` now writes a revision-0 checkpoint for
  `local-pvp-opening` so Unity can hash the bootstrap state directly.
- Existing deterministic fixture hashes remain:
    - `local-pvp-opening`: `e1b5e1bf`
    - `buff-draft-opening`: `e0f3316a`
    - `local-pvp-royal-extra-turn-game-over`: `d161e8c`

C# source surfaces:

- `clients/unity/Assets/GemDuel/Scripts/Core/DomainTypes.cs`
- `clients/unity/Assets/GemDuel/Scripts/Core/GameReducer.cs`
- `clients/unity/Assets/GemDuel/Scripts/Catalog/CatalogLoader.cs`
- `clients/unity/Assets/GemDuel/Scripts/Replay/ReplayDtos.cs`
- `clients/unity/Assets/GemDuel/Scripts/Replay/ReplayBootstrapper.cs`
- `clients/unity/Assets/GemDuel/Scripts/Replay/ReplayStateHasher.cs`
- `clients/unity/Assets/GemDuel/Scripts/Replay/ReplayParityRunner.cs`
- `clients/unity/Assets/GemDuel/Scripts/Platform/PlatformServices.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelInputController.cs`
- `clients/unity/Assets/GemDuel/Scripts/Editor/BuildWindows.cs`

Scene and tests:

- `clients/unity/Assets/GemDuel/Scenes/GemDuelVerticalSlice.unity`
- `clients/unity/Assets/GemDuel/Tests/EditMode/ReplayParityEditModeTests.cs`
- `clients/unity/Assets/GemDuel/Scripts/GemDuel.asmdef`
- `clients/unity/Assets/GemDuel/Scripts/Editor/GemDuel.Editor.asmdef`
- `clients/unity/Assets/GemDuel/Tests/EditMode/GemDuel.Tests.EditMode.asmdef`

## Architecture

- Catalog data is generated from TypeScript constants into JSON under `fixtures/unity-catalog`.
- Unity catalog loading builds explicit card, royal, buff, and gem lookup maps and fails on missing
  replay references.
- Replay DTOs read the committed Replay vNext fixtures.
- `ReplayBootstrapper` builds Unity `GameState` from replay init data or a committed checkpoint.
- `GameReducer` supports the committed replay event subset and fails unknown events explicitly.
- `ReplayStateHasher` implements `replay-state-hash-v1` with stable object-key ordering and the
  DJB2-style hash used by `packages/shared/src/replay/stateHash.ts`.
- `ReplayParityRunner` reads `fixtures/replay-golden/manifest.json`, checks coverage, applies
  replay events, compares expected hash/winner/end reason/event count/turn count, and can write
  JSON/Markdown reports under ignored `artifacts/unity/`.
- `LocalDevPlatformServices` implements non-SDK local platform behavior only. Platform state stays
  out of replay state and hashes.
- The presentation scene is a minimal orthographic sidecar view that renders a 5x5 board and
  zones from the committed local PvP fixture using generated primitives/materials.
- The input controller emits reducer events only: mouse-selected gem lines, buy/reserve keys,
  royal selection, bonus/steal/discard keys, and a Space-driven committed fixture event path that
  can advance to the game-over checkpoint without mutating debug state.

## Validation Evidence

Passed:

- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/verify-replay-parity.ts`
    - `ok: true`
    - `fixtureCount: 3`
    - `coverageGaps: []`
    - hashes: `e1b5e1bf`, `e0f3316a`, `d161e8c`
- `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts --check`
    - Unity catalog check passed.
- `pnpm exec prettier --check docs/migration tools/migration fixtures clients/unity`
    - All matched files use Prettier code style.
- `pnpm secrets:check`
    - Secret and env drift gate passed.
- `pnpm typecheck`
    - 5 package typecheck tasks passed from cache.
- `pnpm lint`
    - 5 package lint tasks passed from cache.
- `pnpm test`
    - 174 test files passed.
    - 1087 tests passed.
- `pnpm release:check`
    - Release health checklist and operations drill checks passed.
- `pnpm boundaries:check`
    - Boundary governance check passed for 10 governed boundaries.
- Unity EditMode tests through local Unity `6000.4.6f1`: passed with result XML
  `result="Passed"`, `total="5"`, `passed="5"`, `failed="0"`.
- Unity EditMode command used from the NTFS mirror:

```text
C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe -batchmode -nographics -projectPath C:\Users\sange\.codex\unity-workspaces\GemDuel-Dev\clients\unity -runTests -testPlatform editmode -testResults C:\Users\sange\.codex\unity-workspaces\GemDuel-Dev\artifacts\unity\editmode-results.xml -logFile C:\Users\sange\.codex\unity-workspaces\GemDuel-Dev\artifacts\unity\editmode.log
```

- Unity Windows IL2CPP build through local Unity `6000.4.6f1`: passed.
- Unity Windows IL2CPP command used from the NTFS mirror:

```text
C:\Program Files\Unity\Hub\Editor\6000.4.6f1\Editor\Unity.exe -batchmode -projectPath C:\Users\sange\.codex\unity-workspaces\GemDuel-Dev\clients\unity -executeMethod GemDuel.Editor.BuildWindows.Build -logFile C:\Users\sange\.codex\unity-workspaces\GemDuel-Dev\artifacts\unity\build-il2cpp.log -quit
```

- `GemDuel.Editor.BuildWindows` forces `StandaloneWindows64` and
  `ScriptingImplementation.IL2CPP`.
- Build log includes `C_Win_x64_VS2022`, `GameAssembly.dll`, `Build Finished, Result: Success`,
  and complete build size `494.1 mb`.
- Build output was written to the ignored mirror path
  `C:\Users\sange\.codex\unity-workspaces\GemDuel-Dev\artifacts\unity\build\windows\GemDuelUnitySlice.exe`.

Environment notes:

- Direct validation against `/home/sange/projects/GemDuel-Dev/clients/unity` fails before project
  load with Unity's case-sensitive filesystem error. Use an NTFS checkout or the documented
  temporary mirror for Windows Unity validation.
- For command-line EditMode tests, omit `-quit`; Unity Test Framework exits after the run and writes
  the XML result. Adding `-quit` can terminate before the result file is produced.

## Safety Checks

- `packages/shared` gameplay logic was not changed.
- No Unity cache/output directories were produced inside the source checkout: no
  `clients/unity/Library`, `Temp`, `Obj`, `Logs`, `UserSettings`, or `Builds` directories were
  present after validation.
- Unity cache/build outputs were produced only in the temporary NTFS mirror and ignored
  `artifacts/unity/` tree; no output is intended for commit.
- No Steamworks/EOS SDKs, app IDs, product IDs, secrets, tokens, credentials, upload logs, or
  platform manifests were added.

## Next Steps

1. For day-to-day Unity Editor work, use an NTFS checkout or mirror rather than the WSL ext4
   `/home/...` path.
2. Open `clients/unity` from that NTFS location and let Unity generate local cache only.
3. Keep rerunning the EditMode and IL2CPP batch build commands above after C# or fixture changes.
4. If C# parity tests fail, fix Unity source against the committed replay fixtures without changing
   `packages/shared` gameplay logic.
5. Only after green Unity parity, decide whether to expand beyond the sidecar slice.
