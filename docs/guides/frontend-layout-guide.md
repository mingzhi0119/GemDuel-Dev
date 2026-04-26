# Frontend Layout Guide

## Screen Model

The app is a single game shell with four top-level states:

1. `GameConfigMenu`
2. `OnlineMenu`
3. `DraftScreen`
4. Main gameplay shell

## Main Gameplay Shell

| Area             | Owner                                                                               | Notes                                                                        |
| ---------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Global chrome    | `apps/desktop/src/app/shell/GameShell.tsx`, `packages/ui/src/components/TopBar.tsx` | Header, floating controls, watermark, debug affordances                      |
| Overlay layer    | `apps/desktop/src/App.tsx`                                                          | Rulebook, winner modal, restart confirm, update prompts                      |
| Center playfield | `Market`, `StatusBar`, `GameBoard`, `GameActions`, `RoyalCourt`, `ReplayControls`   | Three-column game layout                                                     |
| Player rail      | `apps/desktop/src/App.tsx`, `packages/ui/src/components/PlayerZone.tsx`             | Outer shell handles active-player framing; `PlayerZone` owns internal layout |

## Layout Ownership

- Major gameplay shell placement changes start in `apps/desktop/src/app/shell/GameShell.tsx`.
- Scaling and shell sizing live in `apps/desktop/src/hooks/useResponsiveLayout.ts`.
- Desktop stage composition is aspect-driven. The supported desktop envelope is `16:10` through the common ultrawide `12:5` family; wider or taller desktop viewports clamp to the nearest supported aspect and center the stage over the app background.
- Same-aspect desktop viewports must produce the same logical canvas and differ only by `stageScale`.
- `GameShell.tsx` owns the three-row gameplay structure: `TopBar`, bounded play surface, and player rail. On the desktop stage, the header uses a `120px` logical height, the player rail uses `440px`, and the center play surface scales until it hits either the row height or the logical stage width, whichever comes first.
- `TopBar.tsx` owns the header content and must stay in normal shell flow.
- `PlayerZone.tsx` owns internal player-panel composition.

## Card Artwork Sizing

- Market and royal gameplay cards share the same featured display box in `packages/ui/src/components/Card.tsx`.
- Featured cards split rendering into a `1086x1448` design/sampling canvas (`FEATURED_CARD_SAMPLE_SIZE`) and a layout-controlled display box (`FEATURED_CARD_SIZE`). `Card` renders the artwork and any fallback overlays on the high-resolution internal canvas, then downscales that canvas into the display box.
- Layout scaling belongs to the shell (`useResponsiveLayout.ts`, `GamePlaySurface.tsx`) and parent transforms. Do not resize featured cards by changing a market-only scale factor, upscaling low-resolution faces, or letting royal cards drift from market card dimensions.

## Tooltip Standard

- Gameplay tooltips must use the shared classes in `packages/ui/src/components/tooltipStyles.ts`; do not hand-code one-off tooltip text sizes in feature components.
- Plain label tooltips use `TOOLTIP_LABEL_CLASS`: minimum `16px` text, compact padding, and theme-specific surfaces from `getTooltipLabelThemeClass`.
- Rich or interactive tooltips use `TOOLTIP_PANEL_CLASS` plus `TOOLTIP_PANEL_WIDTH_CLASS`: minimum `16px` body text, `380px` max logical width, and readable `13px` metadata/caption text.
- Use `role="tooltip"` only for passive labels. If tooltip content is interactive or contains nested controls/popovers, keep the accessible role as `dialog` but still apply the shared tooltip visual standard.
- Icon-only controls that expose a tooltip should keep at least a `56px` logical hit target and a `32px` glyph on desktop-stage UI.
- Do not rely on the browser's native `title` tooltip for gameplay-critical visible help; native `title` may remain only as non-primary metadata when no visible tooltip is required.

## Safe Refactor Rule

Keep shell changes in `apps/desktop/src/app/shell/GameShell.tsx`, `apps/desktop/src/app/layout/DesktopStage.tsx`, and `useResponsiveLayout.ts`; keep component-specific visual changes inside the owning component. That separation avoids accidental layout drift.
