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
| Global chrome    | `apps/desktop/src/App.tsx`, `packages/ui/src/components/TopBar.tsx`               | Header, floating controls, watermark, debug affordances                      |
| Overlay layer    | `apps/desktop/src/App.tsx`                                                        | Rulebook, winner modal, restart confirm, update prompts                      |
| Center playfield | `Market`, `StatusBar`, `GameBoard`, `GameActions`, `RoyalCourt`, `ReplayControls` | Three-column game layout                                                     |
| Player rail      | `apps/desktop/src/App.tsx`, `packages/ui/src/components/PlayerZone.tsx`           | Outer shell handles active-player framing; `PlayerZone` owns internal layout |

## Layout Ownership

- Major placement changes start in `apps/desktop/src/App.tsx`.
- Scaling and shell sizing live in `apps/desktop/src/hooks/useResponsiveLayout.ts`.
- `TopBar.tsx` owns the fixed header.
- `PlayerZone.tsx` owns internal player-panel composition.

## Card Artwork Sizing

- Market and royal gameplay cards share the same featured display size in `packages/ui/src/components/Card.tsx`.
- Featured cards must render from the high-resolution runtime card artwork source and be downsampled into the display slot. Do not make market-only scale-factor adjustments that upscale a lower-resolution card face or let royal cards drift from market card dimensions.

## Safe Refactor Rule

Keep shell changes in `apps/desktop/src/App.tsx` and `useResponsiveLayout.ts`; keep component-specific visual changes inside the owning component. That separation avoids accidental layout drift.
