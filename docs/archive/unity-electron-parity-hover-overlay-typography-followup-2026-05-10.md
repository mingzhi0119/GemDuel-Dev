# Unity/Electron Hover, Overlay, Typography Parity Follow-Up

Date: 2026-05-10

## Binding Scope

Continue the Unity-to-Electron replacement candidate work. Treat the prior Unity parity result as incomplete because manual Unity Editor Play Mode validation found live UX divergences:

1. All hover interactions appear to have no visible effect in Unity.
2. After clicking a card to open the large-card preview, clicking the blank/background area does not dismiss the preview and return to the game; the user must click the top-right X.
3. Unity typography still visibly diverges from Electron, including font face, font size, spacing, and layout density.

The target remains strict Electron equivalence for the covered local PvP release-candidate experience. Screenshot-only parity, semantic-injection-only parity, and "close enough" visual similarity are incomplete.

## Required Reproduction

First reproduce each issue in real Unity Editor Play Mode:

- real hover over cards/buttons/interactive affordances,
- real click to open large card preview,
- real blank/background click to dismiss preview,
- real comparison against the Electron baseline for font, size, spacing, and density.

## Required Fix

Fix the actual Unity input, UI, layout, and rendering path. Unity must match Electron for the same player intent:

- hover feedback presence, timing, target selection, visual state, cursor/affordance behavior, and recovery when hover leaves,
- large-card preview open/close behavior, including blank/background dismiss and X-button dismiss,
- typography: font family, fallback behavior, font weight, font size, line height, spacing, padding, card text layout, button labels, status text, and modal/overlay density,
- accepted/rejected actions, enabled/disabled states, visible feedback, state transition, next available actions, and error/recovery behavior.

Do not solve this by weakening the parity harness, using capture-only state injection, bypassing Unity pointer/mouse paths, mutating final state directly from automation, wrapping Electron in WebView, or marking visual-only presentation as equivalent.

## Required Evidence

- Manual Unity Editor Play Mode evidence for hover working on relevant interactive targets.
- Manual Unity Editor Play Mode evidence that clicking blank/background area closes large-card preview and returns to the game.
- Electron baseline screenshots/state evidence for the same flows.
- Unity screenshots/state/semantic evidence for the same flows.
- Strengthened parity harness output proving the flows are real-action equivalent.
- Local gate evidence, including the repo default checks that are relevant to this change.
- A committed branch with a clear commit message.
- Final answer must explicitly state whether Unity has reached Electron-equivalent release-candidate behavior for hover, preview-dismiss, and typography within this covered scope.
