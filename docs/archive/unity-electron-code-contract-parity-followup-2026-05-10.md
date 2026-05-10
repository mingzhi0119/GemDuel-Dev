# Unity/Electron Code-Contract Parity Follow-Up - 2026-05-10

## Verdict

Unity has reached Electron-equivalent release-candidate behavior at the code-contract level for the covered local PvP scope.

This follow-up did not treat visual similarity as sufficient. The comparison was made across action boundaries, visible input paths, state snapshots, settings mutation feedback, error lifetime, card-preview orchestration, hover semantics, and parity evidence. Where Unity already had a stronger native abstraction, it was preserved. Where Unity was weaker or the harness was too permissive, the behavior was fixed and covered.

## Code-Level Parity Map

| Electron source / boundary                                                                                                                  | Unity source / boundary                                                                                                                                                       | Shared contract or behavior                                                                                       | Classification                                     | Evidence                                                                                                                                               | Required action                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/shared/src/logic/*`, replay fixture loading through `@gemduel/shared/replay`                                                      | `clients/unity/Assets/GemDuel/Scripts/Core/*`, `ReplayBootstrapper`, `ReplayStateHasher`                                                                                      | Replay-backed state shape, action sequence, final-state hash                                                      | Equivalent, intentionally different implementation | Parity matrix has 26 `Equivalent`; Unity EditMode 15/15 passed                                                                                         | Preserve Unity-native reducer/bootstrap shape; keep TS replay oracle as comparison source                                                 |
| `packages/ui/src/components/DraftScreen.tsx`, `apps/desktop/src/app/parity/electronUnityParityClickActions.ts` `choose_boon` / `hover_boon` | `GemDuelVerticalSlice.RenderDraftPhase`, `RenderDraftCard`, `ClickVisibleBuffForAutomation`, `SetHoveredTarget`                                                               | Draft/boon selection and hover without selection                                                                  | Equivalent                                         | `level-3-boon-selection` and `draft-hover-feedback` are equivalent at both viewports                                                                   | No Unity change beyond evidence protection                                                                                                |
| `packages/ui` card preview components and desktop preview controller                                                                        | `GemDuelVerticalSlice.PreviewMarketCard`, `RenderPreviewOverlay`, `RunPreviewAction`, `ConfirmPreviewAction`, `GetSingleCardPreviewRect`                                      | Card preview opens without state mutation; buy/reserve route through preview action; blank dismiss closes overlay | Equivalent after fix                               | `market-card-preview`, `preview-blank-dismiss`, `buy-card`, `reserve-card` equivalent at both viewports                                                | Fixed Unity preview display-box sizing to match Electron viewport contract                                                                |
| `apps/desktop/src/app/chrome/*`, `packages/ui/src/components/LocaleSwitch.tsx`, `electronUnityParityClickActions.changeSetting`             | `GemDuelVerticalSlice.RenderSettingsOverlay`, `CreateSettingsControlTarget`, `ClickSettingForAutomation`, `HandleSettingsControl`, `BuildSettingsSnapshot`, `PersistSettings` | Settings panel opens; locale and sound mutate through visible controls; persistence feedback is observable        | Weaker before, equivalent after fix                | `settings-theme-equivalent` equivalent at both viewports; Editor Play Mode settings evidence shows `soundEnabled=false` and `persistence.status=saved` | Added Unity settings state, visible settings controls, persistence snapshot, Electron locale DOM target, and real-click parity assertions |
| Electron error banner from invalid semantic action                                                                                          | `GemDuelVerticalSlice` invalid-action branch and `RenderErrorBanner`                                                                                                          | Invalid action is rejected, does not mutate gameplay state, and exposes the same player-facing error text         | Weaker before, equivalent after fix                | `invalid-action-state` equivalent at both viewports                                                                                                    | Changed Unity error text to `Invalid semantic action` and made the runner compare error banner text                                       |
| Electron DOM semantic dump / parity APIs                                                                                                    | `CaptureUnityParityScenarios`, `BuildAutomationStateSnapshot`, `VisibleTarget` list                                                                                           | Semantic evidence includes visible boxes, action results, enabled state, settings, and error text                 | Stronger after harness fix                         | Runner summary: 26 `Equivalent`; settings/error diffs now fail on semantic mismatch                                                                    | Removed `change_setting` from accepted non-click actions and added scenario-specific state assertions                                     |
| React DOM click path for settings and preview controls                                                                                      | `GemDuelInputController.TryDispatchScreenPointForEvidence` and Unity visible targets                                                                                          | Live input must route through visible/pointer targets, not capture-only state injection                           | Unity stronger                                     | Editor Play Mode sound-toggle evidence uses screen-point dispatch to `SettingsControl settings-sound-toggle`                                           | Preserve Unity input abstraction                                                                                                          |
| Desktop Vitest gate configuration                                                                                                           | `packages/config-vitest/desktop.js`, `apps/desktop/src/__tests__/replayRoundtrip.test.tsx`                                                                                    | Local full-suite gate should be reproducible on Windows                                                           | Verification hardening                             | Final `pnpm test` and `pnpm test:coverage` pass                                                                                                        | Capped desktop Vitest workers at 4 and raised the one long replay roundtrip timeout to 60s                                                |

## Unity-Better Differences Preserved

- Unity retains a native `VisibleTarget` and `GemDuelInputController` path. This is stronger than a WebView or direct state mutation because Editor Play Mode can prove screen-point input, clickability, and target kind.
- Unity keeps native scene/render orchestration instead of copying React component ownership. The contract is state, input, and evidence parity, not React structural parity.
- Unity snapshots now carry settings persistence status, path, and error in addition to gameplay state. This is stronger evidence than screenshot-only settings parity.
- Unity continues to use replay/bootstrap comparison against shared Electron-generated fixtures rather than duplicating React UI control flow.

## Weaker Or Missing Differences Fixed

| Drift                                                                                           | Root cause                                                                 | Fix                                                                                                                                       | Regression evidence                                                                                                                   |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Unity settings could open visually but did not expose comparable locale/sound/persistence state | No Unity equivalent existed for settings mutation and persistence feedback | Added settings fields, visible settings controls, click routing, JSON persistence, and settings snapshot fields in `GemDuelVerticalSlice` | `SettingsMutationsUseVisibleHitTargetsAndPersistFeedback`; parity `settings-theme-equivalent`; Editor Play Mode sound-toggle evidence |
| Electron settings parity action could mutate through harness setters                            | Parity harness allowed `change_setting` as accepted non-click action       | Added DOM preference for locale/sound/surface controls and removed `change_setting` from accepted non-click actions                       | `electronUnityParityHarness` DOM settings-control test; parity `settings-theme-equivalent` action behavior equivalent                 |
| Electron locale buttons lacked a stable semantic target                                         | Electron UI had no locale option data hook                                 | Added `data-locale-option` on `LocaleSwitch` buttons                                                                                      | Focused parity harness test and full coverage                                                                                         |
| Unity invalid action text did not match Electron                                                | Stale Unity local error message and runner did not compare error text      | Changed Unity error to `Invalid semantic action`; runner compares `error.banner`                                                          | `InvalidActionExposesElectronEquivalentErrorBanner`; parity `invalid-action-state`                                                    |
| Unity preview card display box drifted at smaller viewport                                      | Unity preview had a stale local layout calculation                         | Matched the Electron single-card preview layout formula in Unity                                                                          | Parity `market-card-preview` and `preview-blank-dismiss` at `1366x768`                                                                |
| New real-click branches were undercovered                                                       | Coverage caught untested Electron parity click branches                    | Added a focused DOM settings-control harness test                                                                                         | `pnpm test:coverage` passes at branches `88.09%`                                                                                      |

## Remaining Electron-Only Behavior

No blocker remains inside the covered local PvP release-candidate scope.

Two Electron behaviors remain outside this release-candidate coverage:

- Full Electron replay import/export menu workflow is not implemented in Unity. This remains acceptable for this scope because the Unity candidate consumes deterministic replay fixtures for parity and the covered local PvP contract is gameplay/input/render/settings parity, not Electron file-picker parity. Evidence: replay-backed gameplay scenarios are equivalent in the parity matrix and Unity EditMode replay tests pass.
- Electron exposes a broader surface-theme menu than Unity. Unity currently preserves the `royal-luxury` surface for the local PvP release candidate. This remains acceptable because the replacement candidate scope requires the covered release-candidate experience, not all Electron theme variants. Evidence: `settings-theme-equivalent` verifies the current Unity surface theme and settings snapshot at both viewports.

If either behavior becomes part of a future Unity release-candidate scope, it should be treated as a blocker until implemented or explicitly reclassified.

## Evidence

### Parity Harness

- Command: `pnpm parity:electron-unity -- --out artifacts/electron-unity-parity/2026-05-10T-code-contract-final-clean --viewports "1920x1080,1366x768"`
- Summary: `artifacts/electron-unity-parity/2026-05-10T-code-contract-final-clean/runner-summary.json`
- Result: `counts.Equivalent = 26`
- Matrix: `artifacts/electron-unity-parity/2026-05-10T-code-contract-final-clean/parity-matrix.md`

### Unity Evidence

- Unity EditMode command: `Unity.exe -batchmode -nographics -projectPath clients/unity -runTests -testPlatform editmode -testResults artifacts/unity/editmode-code-contract-results-2.xml`
- Result: `15` total, `15` passed, `0` failed
- Editor Play Mode evidence command: `Unity.exe -batchmode -projectPath clients/unity -executeMethod GemDuel.Editor.CaptureUnityEditorPlayModeEvidence.CaptureSettingsSoundToggle -gemduelPlayModeEvidenceOut artifacts/unity/editor-playmode-settings-sound-code-contract`
- Result: `editor-playmode-settings-sound-evidence.json` shows `settingsOpenDispatchOk=true`, `soundDispatchOk=true`, `soundEnabled=false`, `persistence.status=saved`

### Local Gates

Final gate evidence:

- `pnpm lint` - passed
- `pnpm typecheck` - passed
- `pnpm test` - passed, `177` files and `1102` tests
- `pnpm test:coverage` - passed, `177` files and `1103` tests, global branches `88.09%`, per-file key modules passed
- `pnpm boundaries:check` - passed
- `pnpm architecture:check` - passed
- `pnpm deps:check` - passed
- `pnpm desktop:check` - passed
- `pnpm release:check` - passed
- Unity EditMode tests - passed, `15/15`

## Stop Condition

The covered local PvP replacement-candidate contract now has:

- equivalent gameplay state and action application through replay-backed scenarios,
- equivalent card preview open/dismiss/action contracts,
- equivalent draft selection and hover behavior,
- equivalent invalid-action rejection and error text,
- equivalent settings open/mutate/persist feedback for the covered release-candidate settings,
- Unity-native live input evidence for settings interaction,
- strengthened Electron and Unity parity harness assertions,
- local gate evidence with no remaining blocker in the covered scope.
