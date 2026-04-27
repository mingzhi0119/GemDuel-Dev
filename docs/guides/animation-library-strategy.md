# Animation Library Strategy

## Purpose

This document defines the animation-library strategy for Gem Duel after the product goal shifted from "clear state feedback" toward a more beautiful, cinematic, and surprising tabletop presentation.

The recommendation is not to replace the current animation stack. The recommendation is to layer tools by responsibility:

- Handwritten React owns modal structure, interaction, focus, and game-state wiring.
- Motion for React / Framer Motion owns normal React UI transitions.
- CSS and SVG keyframes own deterministic anchor-based gameplay motion.
- GSAP is reserved for rare cinematic timelines.
- Rive React is reserved for authored animated art assets.

## Current Baseline

The existing architecture already has the right foundation:

- `apps/desktop/src/app/presentation/*` derives UI-only presentation events from settled `GameState` transitions.
- `PresentationLayer` renders temporary overlays for royal unlocks, card flights, gem flights, ability callouts, and turn handoff.
- `packages/ui/src/components/animation/*` owns reusable animation helpers such as royal unlock and royal selection overlays.
- The gameplay rules in `packages/shared` stay pure and should not wait for animations.

Future visual work should extend this presentation path instead of adding animation state to shared gameplay logic.

## Decision Summary

Use a hybrid stack:

| Layer                             | Primary tool                                | Use for                                                                               | Do not use for                                     |
| --------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------- |
| React modal and overlay structure | Handwritten React                           | Dialog layout, selection flow, input shields, focus behavior, player-facing state     | Reusable animation timing by itself                |
| Normal React UI motion            | Motion for React / Framer Motion            | Modal enter/exit, staggered cards, buttons, score/crown changes, callout entry        | Long multi-element cinematic timelines             |
| Deterministic gameplay flights    | CSS/SVG keyframes plus presentation anchors | Card clones, gem clones, royal line draw, market refill transforms                    | Complex authored character/crest animation         |
| Cinematic timeline layer          | GSAP                                        | Rare high-impact sequences such as victory, major ability burst, premium royal unlock | Every modal, every card hover, ordinary refill     |
| Authored animated assets          | Rive React                                  | `.riv` royal crests, animated card backs, buff emblems, mascot/UI ornaments           | Generic layout motion or state-transition plumbing |

## Handwritten React

Keep modal and overlay components handwritten.

Reasons:

- Game modals are tightly coupled to current game phase, review mode, local/online input ownership, and board-peek states.
- A generic modal library would not remove much complexity because the hard part is game-state control, not the shell.
- Handwritten components make it easy to keep `packages/shared` pure and keep presentation behavior local to `apps/desktop` and `packages/ui`.

Use handwritten React for:

- Royal selection overlay structure.
- Bonus color selection flow.
- Board-peek input shield.
- Restart confirmation.
- Deck peek and reserved-card preview structure.

## Motion For React / Framer Motion

Keep Motion for React / Framer Motion as the default React animation library.

Use it for:

- Dialog enter and exit.
- Card row stagger.
- Button hover/tap and selected-state polish.
- Score and crown increments.
- Ability callout appearance.
- Draft card hover and selection lift.

Why:

- It maps cleanly to React component lifecycles.
- `AnimatePresence` fits conditional overlays.
- Springs and transform animations cover most UI needs without an imperative timeline.
- It is already in the project and does not introduce a second default UI-motion mental model.

## CSS And SVG Keyframes

Keep CSS and SVG keyframes for exact, short-lived gameplay effects.

Use them when an effect is already described by:

- A source DOM anchor.
- A target DOM anchor.
- A temporary clone above the board.
- A fixed transform and opacity timeline.

Good examples:

- Gem flight from board cell to player inventory.
- Gem steal from one player inventory to the other.
- Card acquire from market or reserved slot to player tableau.
- Royal unlock SVG stroke drawing a gold frame.
- Market refill flip/fade.

This keeps the event queue simple and avoids over-fitting every one-shot clone animation into a React layout animation model.

## GSAP

Adopt GSAP only for cinematic sequences that need timeline-level choreography.

Use GSAP when an effect needs several of these at once:

- Multiple elements with precise relative timing.
- Timeline labels and scrubbing during development.
- SVG path, glow, particle, and camera-like screen sweep coordination.
- A sequence that is rare enough to justify higher implementation cost.
- A clear reduced-motion fallback.

Good candidates:

- A premium Royal Unlock V2 with crown burst, line trace, deck glow, and selection reveal.
- Victory prelude explaining the win condition before confetti.
- A high-impact ability or buff trigger that should feel like a special move.
- A full-board transition for an event that happens rarely.

Do not use GSAP for:

- Ordinary modal enter/exit.
- Hover and tap feedback.
- Every card refill.
- Every gem movement.
- Any animation that can be expressed as a simple source-to-target clone.

## Rive React

Use Rive React only when the project has `.riv` art assets worth running at runtime.

Good candidates:

- Animated royal crest.
- Animated card backs.
- Buff emblems with idle and trigger states.
- Victory badge.
- Lightweight mascot or mode-specific ornament.

Do not use Rive React as a general replacement for React UI motion. Rive is an asset runtime, not a layout or game-state animation system.

Adoption requirements:

- Source `.riv` files must be retained in the asset library.
- Runtime files must be versioned and mapped to their owning feature.
- Reduced-motion behavior must pause, replace, or simplify animated assets.
- Rive usage should be isolated behind small React wrapper components.

## Market Refill After Buy Or Reserve

Question: when a player buys or reserves a card and the market pulls a new card from the deck, should the refill animation use GSAP or Framer Motion?

Recommendation: use Motion for React / Framer Motion or the current CSS-keyframe presentation layer, not GSAP, for the normal refill path.

Reason:

- Market refill is frequent, so it should be fast, readable, and cheap.
- The effect is a single source-to-target card reveal from `data-market-deck` to `data-market-slot`.
- It fits the existing presentation event model as `market-refill`.
- It does not require complex multi-element cinematic choreography.
- A GSAP timeline would add imperative complexity without enough visual benefit for a frequent action.

Preferred V1/V2 behavior:

1. The real game state updates immediately.
2. A temporary card-back clone starts from the deck anchor.
3. The clone moves or snaps toward the emptied market slot.
4. The card flips from back to face near the destination.
5. The real market card underneath fades or scales into its final static state.
6. Reduced motion skips the travel and uses a short fade/scale at the destination.

Use GSAP only if refill becomes part of a rarer cinematic sequence, for example a full market sweep, a special buff that deals multiple cards, or a victory/royal sequence that happens to refill the market as one beat in a larger timeline.

## Recommended Build Order

1. Keep the existing presentation queue as the source of animation events.
2. Improve frequent refill/card/gem effects with Motion or CSS first.
3. Add GSAP only for one flagship cinematic slice, preferably Royal Unlock V2 or Victory Prelude.
4. Add Rive only after at least one production-quality `.riv` asset exists.
5. Standardize reduced-motion behavior across all animation layers before broad rollout.

## References

- Motion for React: https://motion.dev/docs/react
- AnimatePresence: https://motion.dev/motion/animate-presence/
- GSAP documentation: https://gsap.com/docs/v3/
- GSAP installation and React integration: https://gsap.com/docs/v3/Installation/
- Rive React runtime: https://rive.app/docs/runtimes/react
