# GemDuel Animation and Motion Plan

## Purpose

This plan defines where GemDuel should add gameplay animation, how those effects should be implemented in the current codebase, and which implementation order keeps the game readable without changing rules.

The goal is not to make every surface constantly animated. The goal is to make important state changes visible: royal unlocks, card movement, gem movement, ability resolution, turn handoff, and victory pressure.

## Current Project Reality

- The app is an Electron + React 19 desktop game shell.
- Shared gameplay rules live in `packages/shared`; that layer must stay pure and should not own React, DOM, or animation state.
- Presentation components live mostly in `packages/ui`, with shell composition and overlays in `apps/desktop`.
- The project already uses `framer-motion`, `tailwindcss-animate`, lucide icons, and `canvas-confetti`.
- Existing motion primitives include:
    - `packages/ui/src/hoc/withGameAnimation.tsx`
    - `packages/ui/src/components/VisualFeedback.tsx`
    - `packages/ui/src/components/gameBoard/AnimatedGemButton.tsx`
    - `packages/ui/src/components/topBar/AnimatedScore.tsx`
    - `packages/ui/src/components/playerZone/usePlayerZoneFeedback.ts`
    - `packages/ui/src/components/WinnerModal.tsx`
- The main gameplay surface is split between `Market`, `GameBoard`, `GameActions`, `RoyalCourt`, `ReplayControls`, `TopBar`, and `PlayerZone`.
- The FSM exposes useful phase signals: `IDLE`, `SELECT_ROYAL`, `SELECT_CARD_COLOR`, `BONUS_ACTION`, `STEAL_ACTION`, `PRIVILEGE_ACTION`, `RESERVE_WAITING_GEM`, `DISCARD_EXCESS_GEMS`, `DRAFT_PHASE`, plus synthetic review/game-over display states.

## Core Rule

Gameplay logic should settle first. Animation should interpret state transitions after the fact.

Do not delay or reorder `finalizeTurn`, `abilityResolution`, royal selection, bonus gem selection, steal resolution, or discard resolution inside `packages/shared` just to play an effect. If an interaction must be blocked during an intro, gate the UI surface in `apps/desktop` or `packages/ui` while the already-settled game state remains authoritative.

## Recommended Motion Architecture

### 1. Presentation Event Queue

Add a UI-only event queue in the desktop renderer.

Candidate owner:

- `apps/desktop/src/app/presentation/usePresentationEvents.ts`
- `apps/desktop/src/app/presentation/PresentationLayer.tsx`

Inputs:

- previous `GameState`
- next `GameState`
- current history index
- review/live mode

Outputs:

- short-lived presentation events such as `royal-unlock`, `gem-flight`, `card-acquire`, `market-refill`, `ability-callout`, `turn-handoff`, `victory-burst`

This avoids putting animation bookkeeping into `packages/shared` and keeps replay/network contracts stable.

### 2. Anchor-Based Overlay Layer

Use DOM anchors for source and target positions.

Existing anchors already available:

- `data-market-slot`
- `data-market-deck`
- `data-board-cell`
- `data-player-zone`
- `data-topbar-crowns`
- `data-topbar-score`
- `data-surface-slot`

Add new anchors only where needed:

- `data-player-gem`
- `data-tableau-stack`
- `data-reserved-slot`
- `data-royal-card`
- `data-royal-selection-surface`

The overlay layer should render animated clones above the board using `position: fixed` or an absolute stage overlay, measure anchors with `getBoundingClientRect`, then animate `transform` and `opacity`.

### 3. Motion Technology Defaults

Use current dependencies first:

- `framer-motion` for React enter/exit, layout-independent clones, numeric counters, modal sequencing, and spring transitions.
- SVG stroke animation for drawn borders, especially royal unlock lines.
- Tailwind keyframes for small repeating emphasis such as target rings.
- `canvas-confetti` only for victory or rare celebratory bursts.
- Canvas/WebGL particle layers only if SVG/CSS cannot handle a later effect cleanly.

Do not add GSAP, Spine, Rive, or a WebGL scene library for V1. The current stack is already enough for the proposed effects.

## Priority Backlog

### P0. Royal Unlock Intro

Problem:

When a player reaches the 3-crown or 6-crown royal milestone, the current `RoyalCourt` pick badge is easy to miss.

Trigger:

- previous phase was not `SELECT_ROYAL`
- next phase is `SELECT_ROYAL`
- `royalDeck.length > 0`

Implementation:

- Add a `royal-unlock` presentation event when the phase enters `SELECT_ROYAL`.
- Temporarily pass `canInteract={false}` to `RoyalCourt` while the intro is playing.
- Render a `RoyalUnlockIntro` overlay anchored to the center playfield.
- Use an SVG `rect` or rounded path that traces a gold line around the middle zone using `stroke-dasharray` and `stroke-dashoffset`.
- Show three crown icons in sequence near the center of the framed area.
- After the line and crowns finish, open a proper royal selection overlay/modal.
- Keep the authoritative state in `SELECT_ROYAL` during the whole sequence.

Recommended timing:

- 0.0s: dim non-center surfaces slightly
- 0.1s: gold line starts drawing around the center zone
- 0.45s, 0.60s, 0.75s: three crowns appear one by one
- 1.0s: frame flashes once
- 1.15s: royal card selection modal appears

Files likely touched in implementation:

- `apps/desktop/src/app/shell/GameShell.tsx`
- `apps/desktop/src/app/shell/GamePlaySurface.tsx`
- `apps/desktop/src/app/overlays/AppOverlayStack.tsx`
- `packages/ui/src/components/RoyalCourt.tsx`
- new `packages/ui/src/components/animation/RoyalUnlockIntro.tsx`
- new `packages/ui/src/components/animation/RoyalSelectionOverlay.tsx`

Validation:

- Unit test that `RoyalCourt` is not clickable while the intro is active.
- Unit test that entering `SELECT_ROYAL` enqueues one intro event.
- Visual/browser check in dark and light themes.
- Reduced-motion path skips the drawn line and shows a short static frame before opening selection.

### P0. Card Acquisition and Reserve Flights

Problem:

Buying or reserving a card changes zones instantly. The player has to infer whether the card moved to tableau, reserved hand, or disappeared into a refill.

Triggers:

- market slot card id changes after `BUY_CARD`
- player tableau length changes
- player reserved length changes
- reserved card id disappears after buying from reserved

Implementation:

- Add `card-acquire`, `card-reserve`, and `market-refill` presentation events.
- Clone the source card at its current anchor and animate the clone to the target player area.
- For market buys, source is `data-market-slot`; target is the relevant `data-tableau-stack`.
- For reserved buys, source is `data-reserved-slot`; target is the relevant `data-tableau-stack`.
- For reserves, source is `data-market-slot` or `data-market-deck`; target is `data-reserved-slot`.
- After the flight starts, show the real state immediately underneath; the clone carries player attention.
- Market refill should use a short flip/fade on the new card rather than a large motion.

Files likely touched:

- `packages/ui/src/components/Market.tsx`
- `packages/ui/src/components/PlayerZone.tsx`
- `packages/ui/src/components/playerZone/PlayerZoneReservedColumn.tsx`
- `packages/ui/src/components/playerZone/PlayerZoneResourcesColumn.tsx`
- new `packages/ui/src/components/animation/CardFlightLayer.tsx`

Validation:

- Component tests for anchor attributes.
- Event tests for buy, reserve, and buy-reserved transitions.
- Ensure card movement is disabled or simplified during replay review scrubbing.

### P0. Gem Take, Replenish, Bonus, Steal, and Discard Motion

Problem:

Gem count and board changes already have some feedback, but the relationship between board cells and player inventory is still weak.

Triggers:

- `TAKE_GEMS`
- `REPLENISH`
- `TAKE_BONUS_GEM`
- `STEAL_GEM`
- `DISCARD_GEM`
- board cell `uid` changes
- `lastFeedback.items`

Implementation:

- Add `gem-flight` events from board cells to player inventory for taken gems.
- Add `gem-drop` events from bag/replenish origin into board cells for replenish.
- Add `gem-steal` events from opponent inventory to active player inventory.
- Add `gem-discard` events from player inventory to a small discard/bag sink.
- Reuse `GemArtwork` or `GemIcon` for clones.
- Add `data-player-gem={player-color}` anchors in `PlayerZoneResourcesColumn`.
- Keep the current floating `+1/-1` feedback, but coordinate it with the flight ending.

Files likely touched:

- `packages/ui/src/components/GameBoard.tsx`
- `packages/ui/src/components/gameBoard/AnimatedGemButton.tsx`
- `packages/ui/src/components/playerZone/PlayerZoneResourcesColumn.tsx`
- `packages/ui/src/components/VisualFeedback.tsx`
- new `packages/ui/src/components/animation/GemFlightLayer.tsx`

Validation:

- Unit test anchor attributes for board cells and inventory gems.
- Tests for `lastFeedback` mapping to the correct player.
- Reduced-motion path uses count pulse and floating text only.

### P0. Ability and Buff Callouts

Problem:

Card abilities and buff effects can change phase or grant resources, but the player often only sees the resulting state.

Triggers:

- phase enters `BONUS_ACTION`
- phase enters `STEAL_ACTION`
- phase enters `PRIVILEGE_ACTION`
- `pendingExtraTurn` becomes true
- player privileges increase
- `toastMessage` is set
- `lastFeedback` contains non-gem entries such as `crown`, `privilege`, or `extortion`

Implementation:

- Add a compact `AbilityCalloutStack` near the center-top of the playfield.
- Use icons already used by card ability badges: plus, hand, scroll, rotate, crown.
- Show one callout per resolved effect: `Again`, `Steal`, `Bonus Gem`, `Privilege`, `Extortion`, `Echo Reservoir`.
- Keep callouts short, 0.9-1.4s.
- Do not block interaction except when the underlying FSM phase already requires a selection.

Files likely touched:

- `packages/ui/src/components/card/CardAbilityBadges.tsx`
- `packages/ui/src/components/VisualFeedback.tsx`
- `packages/ui/src/components/playerZone/PlayerZoneIdentityColumn.tsx`
- new `packages/ui/src/components/animation/AbilityCalloutStack.tsx`

Validation:

- Unit test phase transitions enqueue expected callout categories.
- Ensure duplicate events are not replayed when a component re-renders.

### P1. Top Bar Crown and Score Milestones

Problem:

Scores animate through `AnimatedScore`, but crowns render as a plain number and the royal milestone pressure is underplayed.

Triggers:

- score value changes
- crown value changes
- crown value reaches 2, 3, 5, 6, or one-away from the crown win condition
- score reaches 75% or one-away from the point goal

Implementation:

- Reuse or generalize `AnimatedScore` for crowns.
- Add `AnimatedCrownScore` with a short crown icon burst when crowns increase.
- Use one-time milestone pulses instead of infinite `animate-pulse` for clearer feedback.
- Keep the current near-win emphasis but make it less noisy by using a slower glow.

Files likely touched:

- `packages/ui/src/components/TopBar.tsx`
- `packages/ui/src/components/topBar/AnimatedScore.tsx`
- new `packages/ui/src/components/topBar/AnimatedCrownScore.tsx`

Validation:

- Existing TopBar tests updated for stable `data-value`.
- Visual check at default, near-win, and milestone values.

### P1. Turn Handoff

Problem:

Active-player changes are visible but understated, especially in local PvP where both players share the same screen.

Trigger:

- `turn` changes while not reviewing and no winner is present

Implementation:

- Add a short `TurnHandoffBanner` or playfield sweep from outgoing player color to incoming player color.
- Use emerald for P1 and blue for P2, matching existing player identity colors.
- For online mode, keep the existing "Your Turn" banner but make it part of the same event family.
- Do not obscure the board longer than 0.7s.

Files likely touched:

- `packages/ui/src/components/TopBar.tsx`
- `apps/desktop/src/app/shell/GameShell.tsx`
- new `packages/ui/src/components/animation/TurnHandoffBanner.tsx`

Validation:

- Test that no banner appears during replay review scrubbing.
- Test that online local-player-only text remains correct.

### P1. Bonus Color Selection and Deck Peek Polish

Problem:

`SELECT_CARD_COLOR` and deck peek already use overlays, but they can be made more connected to the triggering card/deck.

Triggers:

- phase enters `SELECT_CARD_COLOR`
- active modal type is `PEEK`

Implementation:

- For color selection, show a clone of the pending joker/pure-points card above the color choices.
- Animate the selected color gem into the card before dispatch completion.
- For deck peek, stagger large cards with clearer depth and add a short deck-to-modal fan motion.
- Keep both overlays in `AppOverlayStack`, but extract reusable modal motion primitives.

Files likely touched:

- `apps/desktop/src/app/overlays/AppOverlayStack.tsx`
- `packages/ui/src/components/DeckPeekModal.tsx`
- `packages/ui/src/components/Card.tsx`

Validation:

- Overlay smoke tests for close/selection behavior.
- Reduced-motion path keeps static modal transitions.

### P1. Draft Screen Pick and Reroll Motion

Problem:

The draft screen has hover movement and entrance classes, but selection and reroll do not strongly communicate "this buff is now owned".

Triggers:

- draft pool changes after reroll
- player selects a buff
- active draft player changes

Implementation:

- On reroll, flip out old buff cards and deal in the new pool.
- On selection, selected buff lifts and flies to the matching player identity area or fades into a player badge.
- Add a short player color sweep when draft control changes from P1 to P2.
- Keep local PvP L1/L2/L3 controls stable and avoid layout shift.

Files likely touched:

- `packages/ui/src/components/DraftScreen.tsx`
- `packages/ui/src/components/topBar/TopBarBuff.tsx`

Validation:

- Existing DraftScreen tests should assert control availability remains unchanged.
- Visual check for long Chinese buff text.

### P2. Reserve, Privilege, and Discard Mode Guidance

Problem:

Special modes rely on rings and cursor changes. They work, but the player can still miss the required next target.

Triggers:

- phase enters `RESERVE_WAITING_GEM`
- phase enters `PRIVILEGE_ACTION`
- phase enters `DISCARD_EXCESS_GEMS`
- selected reserve gold changes

Implementation:

- Use path highlights from instruction source to valid targets.
- For reserve mode, pulse eligible gold gems and draw a thin gold trail from the selected gold to market/decks.
- For privilege mode, show a scroll sigil over valid non-gold gems.
- For discard mode, add a red inventory shake only on gems that can be discarded.

Files likely touched:

- `packages/ui/src/components/GameBoard.tsx`
- `packages/ui/src/components/PlayerZone.tsx`
- `packages/ui/src/components/playerZone/PlayerZoneResourcesColumn.tsx`

Validation:

- Phase surface policy tests remain the behavioral source of truth.
- UI tests confirm disabled cells stay disabled.

### P2. Victory and Replay Review

Problem:

Victory already uses `canvas-confetti`, but the end-state can better explain why the player won. Replay review can also benefit from subtle event stepping.

Triggers:

- `winner` becomes non-null
- review mode starts or stops
- replay index changes

Implementation:

- Add a win-reason prelude: points, crowns, or single-color threshold.
- Keep confetti, but reduce continuous particle duration if performance drops.
- In review mode, disable large gameplay flights by default and use small highlights on changed anchors instead.

Files likely touched:

- `packages/ui/src/components/WinnerModal.tsx`
- `apps/desktop/src/app/runtime/replayReviewState.ts`
- `apps/desktop/src/app/overlays/AppOverlayStack.tsx`

Validation:

- Winner modal tests keep latest-live-state behavior.
- Replay roundtrip tests should not depend on animation state.

## Implementation Phases

### Phase 1: Animation Foundation

Deliverables:

- UI-only presentation event queue.
- Shared overlay measurement helper.
- Reduced-motion hook.
- Stable anchor attributes for market slots, board cells, player inventory gems, reserved slots, tableau stacks, and royal cards.
- First component tests for event dedupe and anchor rendering.

Suggested validation:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm --dir apps/desktop test src/app/shell/__tests__ src/__tests__/surfaceStyling.test.tsx`

### Phase 2: Royal Unlock V1

Deliverables:

- Gold line center-frame intro.
- Three-crown reveal.
- Royal selection overlay/modal after intro.
- Interaction gate while intro plays.
- Reduced-motion fallback.

Suggested validation:

- Royal action and turn-manager tests unchanged.
- App overlay and RoyalCourt tests updated.
- Manual local PvP check using debug crown controls.

### Phase 3: Resource and Card Motion

Deliverables:

- Gem flight layer.
- Card acquisition/reserve layer.
- Market refill flip.
- Player inventory/count feedback synchronization.

Suggested validation:

- Interaction handler tests unchanged except new anchor assertions.
- Visual check for both player zones, light/dark themes, and desktop 4K scaling.

### Phase 4: Ability, Buff, and Turn Readability

Deliverables:

- Ability callout stack.
- Turn handoff effect.
- Animated crowns and milestone pulses.
- Draft pick/reroll motion.

Suggested validation:

- Unit tests for callout events by phase transition.
- TopBar tests for score/crown values.
- DraftScreen tests for local PvP controls and online restrictions.

### Phase 5: Polish and Performance Gate

Deliverables:

- Victory reason prelude.
- Replay-friendly reduced motion behavior.
- Performance pass to remove excessive filters or repeated pulses.
- Accessibility pass for reduced motion and focus order.

Suggested validation:

- `pnpm build`
- `pnpm test:coverage` only if implementation touches tested branches.
- Manual visual pass on common desktop sizes.

## Accessibility and Performance Requirements

- Respect `prefers-reduced-motion`.
- Use transforms and opacity for moving clones; avoid layout-affecting animation.
- Avoid infinite pulse effects for important state. Prefer one-shot event pulses.
- Do not put gameplay-critical information only in motion; the final static state must remain clear.
- Keep blocking intro sequences under 1.3s.
- Keep overlays pointer-events-safe: decorative layers should be `pointer-events: none`, selection overlays should own focus and keyboard behavior.
- Preserve existing contrast rules, especially in light theme.

## Dependencies Policy

V1 should not add a new animation dependency.

Use:

- `framer-motion`
- SVG
- Tailwind keyframes and `tailwindcss-animate`
- `canvas-confetti` for win-only celebration

Reconsider dependencies only if later requirements demand authored character animation or high-volume particles:

- Rive or Spine for artist-authored skeletal/card character motion.
- Canvas/WebGL particle helper for many simultaneous particles.
- GSAP only if sequencing complexity becomes hard to maintain with `framer-motion`.

## First Recommended Build Slice

Start with Royal Unlock V1 because it solves the clearest current usability problem and establishes the reusable sequence model.

Concrete first slice:

1. Add presentation event queue for `SELECT_ROYAL` entry.
2. Add center playfield anchor and `RoyalUnlockIntro`.
3. Gate `RoyalCourt` interaction while the intro plays.
4. Add `RoyalSelectionOverlay` after the intro.
5. Add reduced-motion fallback.
6. Add tests for event enqueue, interaction gate, and overlay rendering.

This produces a visible improvement without changing shared gameplay rules.
