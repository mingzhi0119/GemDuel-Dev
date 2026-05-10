# Unity Electron Parity Live UX Follow-Up - 2026-05-10

## Short Goal Prompt

```text
/goal

Repo: E:\simonbb\GemDuel-Dev.

Continue the Unity-to-Electron replacement candidate work until Unity is behaviorally equivalent to Electron for the covered local PvP release-candidate experience. Do not accept the previous 22 Equivalent / 0 Failing / 0 Blocker run as completion evidence. Manual Unity Editor Play Mode validation found that the level-3 boon selection screen cannot be clicked, and the live Unity UI still visibly diverges from Electron. Use docs/archive/unity-electron-parity-live-ux-followup-2026-05-10.md as the binding scope contract and treat any weaker "90% parity", screenshot-only parity, or semantic-injection-only result as incomplete.

First reproduce the real Unity Editor interaction failure, then fix the actual Unity input/UI/layout/gameplay path. The target is strict Electron equivalence: for the same player intent, Unity must produce the same accepted or rejected action, visible feedback, state transition, enabled/disabled affordances, confirmation/cancel flow, error text and lifetime, settings mutation/persistence feedback, next available actions, recovery behavior, timing-stable result, semantic evidence, and visual evidence as Electron. Do not solve this by weakening the parity harness, using capture-only state injection, wrapping Electron in WebView, bypassing the Unity click path, mutating final state directly from automation, or marking visual-only presentation as equivalent. Completion requires a strengthened real-action parity harness, manual Unity Editor evidence, local gate evidence, a committed branch, and an explicit final statement that Unity has reached Electron-equivalent release-candidate behavior. If any listed category remains unmatched, the final answer must say `Unity migration is not complete`.
```

## Problem Statement

The previous parity run reported `22 Equivalent / 0 Failing / 0 Blocker`, but a manual Unity Editor check exposed two release-blocking gaps:

- The Unity level-3 boon selection screen is not clickable in Play Mode.
- The live Unity surface still has a large visual and interaction gap versus Electron.

This means the prior parity result must be treated as a harness false positive or an insufficient acceptance signal. The next Codex run must repair the real Unity client and strengthen the parity harness so the same class of issue cannot pass again.

The goal is not "close enough visual parity" or "the fixture can be advanced." The goal is that a player can use the Unity client in the same way they use Electron, receive the same operation feedback, recover from the same mistakes, and continue from every supported post-action state without falling into a dead, visual-only, or automation-only surface.

## Source Of Truth

- Repository: `E:\simonbb\GemDuel-Dev`
- Current branch: `codex/unity-electron-parity-candidate`
- Existing parity archive: `docs/archive/electron-unity-sync-parity-2026-05-09.md`
- Existing final artifact from the prior run: `artifacts/electron-unity-parity/2026-05-10T-keyfix-final`
- User manual finding: in Unity Editor Play Mode, the visible `肉鸽选增益` / `P1: 3 选 1` boon cards do not respond to clicks.

## Non-Negotiable Constraints

- Use `pnpm` from the repo root.
- Use `pnpm run dev` for browser/Electron-side renderer verification, not `electron:dev`, to avoid spawning desktop windows repeatedly.
- Do not introduce `npm` or `package-lock.json`.
- Do not use Unity WebView to wrap the Electron page.
- Do not fix this by changing only screenshots, fixture output, or final captured state.
- Do not weaken parity thresholds or delete scenarios to make results green.
- Do not sacrifice Electron behavior to make Unity pass unless Electron is proven buggy and covered by Electron-side tests.
- `packages/shared` remains the gameplay authority.
- Unity may use dev-only automation hooks only if they drive the same business path as real user intent.
- Preserve user or prior uncommitted work. Inspect before editing and do not revert unrelated changes.
- Do not claim "scoped parity", "90% parity", "candidate parity", or "covered by screenshot parity" as completion unless every strict completion condition below is also satisfied.
- Do not leave known interaction gaps as follow-up work while claiming Unity is Electron-equivalent.
- Do not count an automation-only semantic action as equivalent unless manual Unity Play Mode can perform the same intent through the same UI/business path and produce the same feedback.

## Strict Electron-Equivalence Definition

Unity is Electron-equivalent only when every player-facing operation in the release-candidate local PvP scope matches Electron across these dimensions:

- **Click/input equivalence:** the same visible surfaces are clickable or intentionally disabled; mouse, hover, pressed, selected, disabled, close, cancel, confirm, and keyboard-equivalent behavior match Electron where Electron exposes them.
- **Gameplay equivalence:** the same shared gameplay action is accepted or rejected for the same reason, mutates the same shared state, and reaches the same phase/turn/resource/card/score outcome.
- **Operation feedback equivalence:** the same visible text, highlight, overlay, selected state, animation-relevant state, enabled/disabled affordance, and next-action hint appear after each action.
- **Error feedback equivalence:** invalid actions show the same user-facing reason, do not mutate state, clear or persist with the same lifetime rules, and leave the same recovery path available.
- **Confirmation-flow equivalence:** preview, buy, reserve, royal, boon, end-turn, save/load/settings, close, cancel, Escape/backdrop, and disabled-action reasons match Electron behavior instead of silently disappearing or bypassing the flow.
- **Settings feedback equivalence:** locale, sound, theme/surface, save/load, and any exposed settings mutate real state, persist or fail the same way Electron does, and show equivalent visible feedback.
- **Follow-up state equivalence:** after each accepted, rejected, canceled, or recovered action, Unity exposes the same next legal actions as Electron and does not leave synthetic-only or dead controls.
- **Recovery equivalence:** Unity can recover from invalid clicks, canceled overlays, failed confirmations, settings changes, route/state reloads covered by the scope, and replay/fixture transitions without requiring hidden debug keys or direct state injection.
- **Evidence equivalence:** screenshots, state JSON, semantic boxes, action results, manual Play Mode notes, and test output all prove the same behavior path; final-state equality alone is insufficient.

## Required Acceptance Criteria

The next run may only claim completion when Unity is a fully Electron-equivalent release candidate under the definition above. Passing screenshots, replay-state dumps, or a green matrix produced by semantic injection is not enough; Unity must behave like Electron when a player clicks, plays, makes mistakes, confirms actions, cancels actions, changes settings, recovers, and moves through the game.

- Manual Unity Editor Play Mode can click one of the three level-3 boon cards and the selection advances through the same gameplay path used by automation.
- Unity has a real clickable UI path for the relevant surfaces, not only rendered/captured card presentation.
- Unity click and play behavior matches Electron for all covered scenarios: hover/pressed/disabled affordances, selected/preview states, confirmation flows, invalid-action feedback, settings feedback, end-turn feedback, royal/boon selection feedback, and post-action recovery.
- Every supported player operation produces the same outcome and user-facing feedback in Unity and Electron: shared state, visible state, text, enabled/disabled controls, error banners, overlays, selected card state, resource/score changes, and next available actions.
- Every supported reject/cancel/recovery path produces the same outcome and user-facing feedback in Unity and Electron: no state mutation on rejected actions, same error reason and lifetime, same close/cancel behavior, same selected-state cleanup, and same next available actions.
- Every settings operation exposed by Unity either matches Electron exactly or is removed/hidden from the release-candidate scope; visual-only settings rows are not acceptable.
- Every visible control that appears actionable in Unity must either execute the same behavior as Electron or expose the same disabled state/reason as Electron.
- The Electron/Unity parity harness is strengthened so semantic actions verify clickable hit targets, input dispatch, action feedback, and resulting UI transitions, not only final state dumps.
- Automation must exercise the same Unity interaction/business path as manual Play Mode usage. Dev-only hooks are allowed only to express player intent; they must not mutate final state directly or skip the UI/action feedback path.
- Final parity run is exactly `22 Equivalent / 0 Failing / 0 Blocker` only after the harness has been strengthened for real-action behavior. Reusing the previous artifact without stronger behavioral assertions is not completion.
- Each scene passes shared state, visible state, semantic action result, visual diff, and semantic bounding box parity.
- Each interactive scenario must prove behavior parity, not just visual parity: the action must be accepted or rejected for the same reason as Electron and must leave the same follow-up affordances available.
- The final artifact must include explicit per-scenario evidence for click/input, gameplay result, operation feedback, error feedback when relevant, confirmation/cancel behavior when relevant, settings mutation when relevant, follow-up actionable state, and recovery behavior when relevant.
- Core semantic bounding boxes are present on both sides and have position/size error `<= 2px`.
- Fixed viewports remain `1920x1080` and `1366x768`.
- Visual diff JSON and diff PNG files are generated for every scenario.
- Local gates pass:
    - `pnpm lint`
    - `pnpm typecheck`
    - `pnpm test`
    - `pnpm test:coverage`
    - `pnpm boundaries:check`
    - `pnpm architecture:check`
    - `pnpm deps:check`
    - `pnpm desktop:check`
    - `pnpm release:check`
    - Unity CLI EditMode tests
    - Unity CLI build/test command, if present in the repo
- Final work is committed on the branch with a clear evidence trail.

## Mandatory Scenario Coverage

The strengthened parity run must fail if any of these categories are missing, direct-injected, or only visually rendered:

- **Boon/draft selection:** click a visible boon card, prove the card receives input, dispatches the same selection intent as Electron, advances gameplay, and exposes the same next state.
- **Market preview and confirmation:** click market cards/decks, show preview, confirm buy/reserve when legal, show disabled reasons when illegal, close/cancel without mutation, and continue with the same follow-up actions.
- **Board and gem operations:** legal gem selection, illegal gold/direct take, invalid line/gap, confirm/cancel cleanup, reserve-gold preselection, and post-action recovery.
- **Royal selection:** click/preview/select royal cards with the same enabled/disabled and follow-up behavior as Electron.
- **End-turn/replenish:** confirm or reject end-turn/replenish according to the same phase rules and expose the same next player/phase state.
- **Settings:** open settings, change each exposed setting, verify visible feedback, persisted state where Electron persists it, and recovery/close behavior.
- **Error paths:** trigger real illegal player actions, not only a synthetic `invalid_action`, and verify same error reason, lifetime, non-mutation, and recovery.
- **Post-action continuity:** after every accepted, rejected, and canceled action, click the next legal action in Unity and Electron and prove both clients remain operable.

## Immediate Reproduction Steps

1. Open the Unity project under `clients/unity`.
2. Enter Unity Editor Play Mode with the current `GemDuel Vertical Slice` scene.
3. Navigate to the level-3 boon selection screen if it is not already loaded.
4. Click each visible boon card body and title area.
5. Record whether the click is received by:
    - Unity EventSystem / Input System
    - `GemDuelInputController`
    - `GemDuelVerticalSlice`
    - gameplay state transition
    - visible screen transition
6. Confirm whether the issue is one of:
    - no `EventSystem` or incompatible input module
    - canvas or camera raycast configuration
    - card visuals not backed by interactive controls
    - raycast target disabled or blocked by overlay
    - click handler exists but bypasses gameplay path
    - automation hook mutates state while real UI has no path

## Implementation Plan

### Phase 1 - Real Input Path

- Inspect Unity scene hierarchy, UI canvas, input modules, and card prefab/construction path.
- Add a minimal but production-valid click target for boon selection cards.
- Ensure click handling routes through the same intent/action path used by semantic automation.
- Add Unity EditMode or PlayMode-style coverage that proves a boon card click changes state through the intended path.
- Do not add a test-only state mutation shortcut as the fix.

### Phase 2 - Harness Hardening

- Update Unity semantic automation so `choose_boon` or the existing equivalent action performs the same hit-target path used by manual clicks.
- If the current scenario uses only fixture/capture state, make it fail when no clickable target exists.
- Add a parity assertion that every interactive semantic key has:
    - visible bounds
    - enabled/clickable state
    - equivalent hover/pressed/disabled or selected feedback where Electron exposes it
    - an action result
    - expected post-click state or visible transition
- Add or extend parity scenarios so click/play/operation feedback mismatches fail the run even when the final shared state happens to match.
- Preserve the required canonical semantic keys from the previous parity work.
- Remove or quarantine synthetic semantic boxes that can mask missing real Unity targets, or mark them as synthetic and fail interactive scenarios when a real target is absent.
- Require parity scenario reports to state whether each action was driven by real click/input, semantic intent routed through the real click/business path, or direct state injection; direct state injection is allowed only for setup, never for the action being verified.
- Add negative-path assertions for illegal clicks, disabled controls, canceled confirmations, settings changes, and recovery after rejection.

### Phase 3 - Visual Gap Closure

- Compare live Unity screenshots against Electron at the same viewport and theme.
- Align actual layout, scale, typography, spacing, card chrome, topbar, and button placement instead of relying on broad visual thresholds.
- Keep the featured card sampling/display contract intact: `FEATURED_CARD_SAMPLE_SIZE` is `1086x1448`, rendered into the layout-controlled `FEATURED_CARD_SIZE`.
- Avoid low-resolution card stretching or Unity-only scale factors that hide mismatch.

### Phase 4 - Manual And Automated Evidence

- Capture before/after screenshots for the failing Unity Editor screen.
- Run the full parity harness to a new final artifact.
- Inspect representative state JSON and visual JSON manually for:
    - boon click action result
    - semantic box presence
    - visual diff threshold
    - no blocker reason
- Run all local gates listed above.
- Commit after verification.

## Suggested Files To Inspect First

- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelVerticalSlice.cs`
- `clients/unity/Assets/GemDuel/Scripts/Presentation/GemDuelInputController.cs`
- `apps/desktop/src/app/parity/electronUnityParityHarness.ts`
- `apps/desktop/src/app/parity/electronUnityParityState.ts`
- `tools/migration/electron-unity-parity-runner.mjs`
- `tools/migration/compare-png.ps1`
- `docs/archive/electron-unity-sync-parity-2026-05-09.md`

## Evidence Format For Final Response

The final response for the next run must include:

- Whether final parity is exactly `22 Equivalent / 0 Failing / 0 Blocker`.
- The new final artifact path.
- Manual Unity Editor Play Mode click evidence.
- Manual Unity play/operation feedback evidence showing Unity behavior is Electron-equivalent for the covered release-candidate flows.
- A category-by-category equivalence table covering click/input, gameplay, operation feedback, error feedback, confirmation/cancel flow, settings feedback, follow-up actionable state, and recovery behavior.
- Which root cause made the cards unclickable.
- How the harness was strengthened to catch this failure.
- Which scenarios were driven by real Unity click/input and which setup steps used automation.
- Evidence that no interactive scenario depends on direct final-state injection for the action under test.
- Visual gap fixes made.
- Modified file summary.
- Commands run and results.
- Commit SHA.
- If any failing or blocker remains, explicitly say: `Unity migration is not complete`.
- If any Electron-equivalence category remains unimplemented, untested, manually unverified, or only covered by screenshot/state parity, explicitly say: `Unity migration is not complete`.

## Stop Condition

Stop only after Unity click, play, operation feedback, error feedback, confirmation/cancel flow, settings feedback, follow-up actionable state, and recovery behavior are all equivalent to Electron for the covered local PvP release-candidate flows; the live Unity click path works in manual Play Mode; the strengthened real-action parity harness passes at `22 Equivalent / 0 Failing / 0 Blocker`; all local gates pass; and the branch has a commit containing the fix and evidence updates. If any condition is not met, stop with the explicit status `Unity migration is not complete` and list the remaining blockers.
