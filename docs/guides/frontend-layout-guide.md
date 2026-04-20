# Frontend Layout Guide

## Screen Model

The app is a single game shell with four top-level states:

1. `GameConfigMenu`
2. `OnlineMenu`
3. `DraftScreen`
4. Main gameplay shell

## Main Gameplay Shell

| Area             | Owner                                                                             | Notes                                                                        |
| ---------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Global chrome    | `src/App.tsx`, `src/components/TopBar.tsx`                                        | Header, floating controls, watermark, debug affordances                      |
| Overlay layer    | `src/App.tsx`                                                                     | Rulebook, winner modal, restart confirm, update prompts                      |
| Center playfield | `Market`, `StatusBar`, `GameBoard`, `GameActions`, `RoyalCourt`, `ReplayControls` | Three-column game layout                                                     |
| Player rail      | `src/App.tsx`, `src/components/PlayerZone.tsx`                                    | Outer shell handles active-player framing; `PlayerZone` owns internal layout |

## Layout Ownership

- Major placement changes start in `src/App.tsx`.
- Scaling and shell sizing live in `src/hooks/useResponsiveLayout.ts`.
- `TopBar.tsx` owns the fixed header.
- `PlayerZone.tsx` owns internal player-panel composition.

## Safe Refactor Rule

Keep shell changes in `src/App.tsx` and `useResponsiveLayout.ts`; keep component-specific visual changes inside the owning component. That separation avoids accidental layout drift.
