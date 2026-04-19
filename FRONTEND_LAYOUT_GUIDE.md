# Frontend Layout Guide

This document explains how the current frontend is partitioned, which component owns each screen area, and where developers should make changes when adjusting layout or visual behavior.

The goal is to make the UI structure readable to humans before they dive into the code.

## 1. High-Level Mental Model

The frontend is not a route-driven app. It is a single-screen game shell whose root is [src/App.tsx](./src/App.tsx).

`App.tsx` chooses one of several top-level UI states:

1. `GameConfigMenu`
   Shown before any game history exists.

2. `OnlineMenu`
   Shown instead of the config menu when the user enters online setup.

3. `DraftScreen`
   Shown when the game has started but the phase is still `DRAFT_PHASE`.

4. Main gameplay shell
   Shown for all normal in-match phases after draft.

So the app is best understood as:

- one root shell
- several mutually exclusive top-level screen modes
- one primary gameplay layout once the actual match begins

## 2. Main Gameplay Shell Partition

Once the app enters the normal gameplay shell, the screen is divided into four major layers.

### A. Global chrome

Owned mainly by [src/App.tsx](./src/App.tsx) and [src/components/TopBar.tsx](./src/components/TopBar.tsx).

This includes:

- the app background and theme surface
- the top status/header bar
- the floating right-side action rail
- the floating debug toggle and debug panels
- the bottom-right version watermark

Think of this as the non-game-board chrome that stays around the match.

### B. Overlay layer

Also orchestrated by [src/App.tsx](./src/App.tsx).

This includes:

- update notification
- rulebook modal
- deck peek modal
- winner modal
- restart confirmation modal
- joker color selection overlay
- review-mode return button

These are conditional overlays that sit above the main board shell.

### C. Middle gameplay area

This is the central playfield. It is the most important horizontal partition in the app.

It contains three columns:

1. Left column
   `Market`

2. Center column
   `StatusBar` + `GameBoard` + `GameActions`

3. Right column
   `RoyalCourt` + `ReplayControls`

This block is centered and scaled as one visual unit.

### D. Bottom player rail

This is the full-width lower band containing two player zones:

1. left half = Player 1 zone
2. right half = Player 2 zone

Each half is an outer shell controlled by `App.tsx`, with the detailed internal layout owned by [src/components/PlayerZone.tsx](./src/components/PlayerZone.tsx).

## 3. Layout Ownership by File

### `src/App.tsx`

This file is the frontend layout orchestrator.

It owns:

- top-level screen switching
- all modal / overlay mounting
- theme shell classes
- placement of top chrome
- placement of the middle gameplay area
- placement of the bottom player rail
- responsive scaling application

If you want to change:

- where a major section lives
- the vertical split between main board and player zones
- which panel appears left / center / right
- the overall shell spacing

start in `App.tsx`.

### `src/hooks/useResponsiveLayout.ts`

This hook is the single source of truth for shell-level sizing.

It computes:

- `boardScale`
- `deckScale`
- `zoneScale`
- `zoneHeightPx`
- `mainGapPx`
- viewport width / height / aspect ratio

Important rule:

- component internals are mostly fixed-size
- the shell adapts by scaling containers around them

So if a 16:9 or 16:10 screen does not fit well, the first place to inspect is `useResponsiveLayout`, not every leaf component.

### `src/components/TopBar.tsx`

This component owns the fixed top bar.

Internally it is partitioned into:

1. left player summary
2. center turn-count panel
3. right player summary
4. two absolute-positioned buff badges near the quarter points
5. optional online-only “Your Turn” badge below the bar

This component is a compact dashboard, not part of the center playfield.

### `src/components/Market.tsx`

This is the left-side gameplay column.

It owns:

- the market title
- deck stacks for levels 3 / 2 / 1
- visible market cards for each level
- intelligence / reveal side previews

Its internal structure is vertical by level, but the entire component is treated as one left-side module by `App.tsx`.

### `src/components/GameBoard.tsx`

This is the center visual board only.

It owns:

- the 5x5 gem grid
- bag count label
- selection highlighting
- target highlighting for special phases
- gem entry/update animation wrappers

It does not own action buttons or error messaging.

### `src/components/StatusBar.tsx`

This lives above the board in a fixed-height slot.

It owns:

- transient error message pill
- online connection state pill

Because it sits in a reserved container above the board, the board does not jump vertically when these messages appear.

### `src/components/GameActions.tsx`

This lives below the board in another fixed-height slot.

It owns:

- confirm selection action
- refill action
- cancel action for reserve / privilege flows

Again, `App.tsx` gives it reserved height so the board does not shift when buttons appear or disappear.

### `src/components/RoyalCourt.tsx`

This is part of the right-side gameplay column.

It owns:

- royal court title
- royal card grid
- pick affordance during `SELECT_ROYAL`

### `src/components/ReplayControls.tsx`

Also part of the right-side gameplay column.

It owns:

- undo
- redo
- action index display

It is deliberately grouped with `RoyalCourt` rather than the center column.

### `src/components/PlayerZone.tsx`

This is the detailed internal layout for each player panel.

The outer active/inactive shell belongs to `App.tsx`.
The internal content partition belongs to `PlayerZone.tsx`.

Internally, each player zone is split into three modules:

1. Identity and privileges
   Player badge, player label, privilege icons

2. Resources and tableau
   Gem row plus color-based card stacks

3. Reserved cards
   Horizontal scrolling full-size reserved cards

This means changes to:

- player badge area
- tableau stack arrangement
- reserved/royal mini-card area

should usually happen inside `PlayerZone.tsx`, not in `App.tsx`.

## 4. The Main Gameplay Area in Plain English

If you ignore overlays, the live match screen looks like this:

```text
TopBar

Right-side floating controls
Left-side debug tools (optional)

Centered gameplay block:
  [ Market ] [ Status + Board + Actions ] [ Royal Court + Replay ]

Bottom full-width player rail:
  [ Player 1 Zone ] [ Player 2 Zone ]
```

That is the most useful mental model for day-to-day frontend work.

## 5. Responsive Strategy

The frontend currently uses shell scaling, not fully fluid layout.

That means:

- the board keeps its intrinsic size
- card components largely keep their intrinsic size
- player-zone internals largely keep their intrinsic size
- the app adapts by scaling major regions

The middle gameplay cluster uses:

- `layout.boardScale` for the whole center block
- `layout.deckScale` for left/right side columns

The player rail uses:

- `layout.zoneHeightPx` for band height
- `layout.zoneScale` for each player-zone content wrapper

There is also a size-compensation wrapper in `App.tsx` so scaled player content still visually fills the parent shell.

Practical implication:

- if something is proportionally too large or too small across the whole match UI, tune `useResponsiveLayout`
- if one subsection looks wrong only inside a player zone or market card area, tune that component directly

## 6. Why Some Areas Have Fixed Height Slots

In the center column, `StatusBar` and `GameActions` are each mounted inside fixed-height wrappers.

This is intentional.

Without those wrappers:

- transient status messages would push the board down
- appearing action buttons would move the board up and down

So when editing the center stack, preserve the idea of:

- status slot
- board
- action slot

even if the exact heights change.

## 7. Active Player Highlighting

The active player highlight is not owned by `PlayerZone.tsx`.

It is owned by the outer half-width player shells in `App.tsx`.

This is important because:

- the player zone content is scaled
- the outer shell is not
- if active highlighting is drawn on the inner scaled content, the border and breathing effect will not align with the true player panel bounds

So:

- outer shell = active border, breathing effect, active panel surface
- inner `PlayerZone` = content layout

Keep that separation.

## 8. What to Edit for Common Tasks

### “I want more space between the center board and side columns”

Edit `mainGapPx` logic in [src/hooks/useResponsiveLayout.ts](./src/hooks/useResponsiveLayout.ts).

### “I want the player rail taller or shorter”

Edit `zoneHeightPx` logic in `useResponsiveLayout`.

### “I want the whole board cluster to shrink more on laptops”

Edit `boardScale` and possibly `deckScale` in `useResponsiveLayout`.

### “I want PlayerZone internals rearranged”

Edit [src/components/PlayerZone.tsx](./src/components/PlayerZone.tsx).

### “I want the header stats redesigned”

Edit [src/components/TopBar.tsx](./src/components/TopBar.tsx).

### “I want action buttons moved away from below the board”

That is an `App.tsx` layout decision first, then a `GameActions.tsx` refinement second.

### “I want a new modal or full-screen overlay”

Mount it from `App.tsx`, because that file already coordinates the overlay stack.

## 9. Safe Refactor Boundaries

These are the safest current boundaries for future cleanup:

### Shell-level orchestration

- `App.tsx`
- `useResponsiveLayout`

### Match chrome

- `TopBar`
- floating control rail in `App.tsx`

### Middle gameplay cluster

- `Market`
- `GameBoard`
- `StatusBar`
- `GameActions`
- `RoyalCourt`
- `ReplayControls`

### Bottom player rail

- outer player shells in `App.tsx`
- inner player content in `PlayerZone.tsx`

If you keep edits inside these boundaries, the chance of accidental layout breakage is much lower.

## 10. Current Architectural Tradeoff

The current UI is intentionally practical rather than perfectly pure.

Strengths:

- major zones are easy to identify
- responsive behavior is centralized
- overlays are coordinated in one place
- the gameplay shell is predictable

Tradeoff:

- `App.tsx` is still the central conductor and knows a lot
- some visual behavior depends on shell-level transforms rather than fully fluid child components

That is acceptable for now, but it means layout changes should be made deliberately:

- shell changes in `App.tsx` and `useResponsiveLayout`
- local visual changes inside the owning component

## 11. Recommended Reading Order for New Developers

If you are new to this frontend, read files in this order:

1. [src/App.tsx](./src/App.tsx)
2. [src/hooks/useResponsiveLayout.ts](./src/hooks/useResponsiveLayout.ts)
3. [src/components/TopBar.tsx](./src/components/TopBar.tsx)
4. [src/components/Market.tsx](./src/components/Market.tsx)
5. [src/components/GameBoard.tsx](./src/components/GameBoard.tsx)
6. [src/components/GameActions.tsx](./src/components/GameActions.tsx)
7. [src/components/RoyalCourt.tsx](./src/components/RoyalCourt.tsx)
8. [src/components/ReplayControls.tsx](./src/components/ReplayControls.tsx)
9. [src/components/PlayerZone.tsx](./src/components/PlayerZone.tsx)

After that, the live screen should feel much easier to reason about.
