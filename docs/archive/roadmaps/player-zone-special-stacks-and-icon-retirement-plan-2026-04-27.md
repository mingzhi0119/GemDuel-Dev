# PlayerZone Special Stacks and Icon Retirement Plan (2026-04-27)

## Status

Proposal only. This document responds to the three browser diff comments from the 2026-04-27 visual review. It does not prescribe any code change for this pass.

## Source Observations

- `PlayerZone` currently renders three internal columns: reserved cards, resources/tableau summary, and identity/privilege controls.
- The tableau summary only iterates `PLAYER_ZONE_DISPLAY_COLORS`, which maps to the five basic bonus colors: red, green, blue, white, and black.
- Pure-points cards exist as runtime card assets such as `181-po.png`, `281-po.png`, and `381-po.png`, and use `bonusColor: 'null'` in shared card data.
- `PlayerRail` already passes `playerRoyals.p1` and `playerRoyals.p2` into `PlayerZone`, but `PlayerZone` does not currently render the `royals` prop.
- The current PlayerZone is already dense: gem inventory, five card stacks, reserved cards, player identity, buff/privilege controls, and active-player framing all compete for the same 440px rail.
- `PlayerZoneReservedColumn` currently reserves a large horizontal column (`flex: 42`) for up to three reserved cards rendered side by side.
- `CardPreviewOverlay` already supports large card inspection, but it is preview-only today and does not expose a buy action.
- The current TopBar and reserve affordance still use inline/lucide icons for crown, trophy/points, replay/chrome actions, and the reserve/download action.
- Crown raster material already exists under `assets/card/overlays/CrownBadges/`, so crown replacement can start from existing art rather than a new generation task.

## Recommendation Summary

Use six PlayerZone tableau stacks, not seven and not two separate special chips.

The five colored stacks should remain the first five stacks. Pure-points cards and owned royal cards should share one sixth "special" stack. That keeps the stack grammar consistent with the current UI while avoiding the severe compression of a seven-stack row.

To make room, shrink the reserved-card area. Reserved cards are capped at three, so they can move from a side-by-side row into a diagonal mini-stack. Clicking a reserved card opens a large card view; if the reserved card is buyable, the large view should expose the buy action there. This shifts precision interaction out of the cramped rail and into the preview surface.

For icon retirement, replace gameplay-critical SVG/lucide icons in phases. Start with the high-visibility TopBar crown and card reserve/download affordance, then move to secondary chrome/replay icons. Do not replace all lucide icons in one pass; each replacement should prove visual fit, hit target, contrast, and disabled/hover states.

## Comment 1: Add Pure-Points and Royal Card Positions

### Feasibility Decision

The proposed six-stack design is feasible and is now the preferred plan.

The main reason is space economics. Combining pure-points and royal cards into one sixth stack adds only one stack to the current five-color tableau, while shrinking the reserved column can recover enough horizontal room to keep the six stack cards readable.

The main implementation risk is interaction clarity in the reserved area. Once reserved cards are stacked diagonally, direct buy-on-card-click becomes too ambiguous. The reserved-card click should consistently mean "inspect"; buying should happen from the large preview surface, where the affordance can be explicit and large enough.

### Recommended Layout

Use one six-stack tableau row:

```text
gem inventory row
six tableau stacks: [Red] [Green] [Blue] [White] [Black] [Pure/Royal]
```

The sixth stack should be a normal stack slot, not a small chip:

- It combines cards with `bonusColor: 'null'` and owned royal cards.
- It should use a neutral/royal mixed identity: silver base with a subtle crown accent.
- It should show count first, then a compact total value indicator if space allows.
- It should open a collection preview showing pure-points cards and royal cards together, grouped or ordered with pure-points first and royal cards second.
- It should remain visually subordinate to the five color stacks, because color stacks are still the main discount/economy readout.

### Reserved Area Compression

Replace the current side-by-side reserved-card row with a diagonal mini-stack:

```text
reserved cards, max three:
card 1 at origin
card 2 offset right/down
card 3 offset further right/down
```

The stack must preserve important card information:

- Top information remains visible: points, crowns, discount/bonus markers, and level/banner information.
- Left-side cost remains visible enough for quick affordability judgment.
- The offset should move each later card right and down, not only down, so the left cost column and top metadata do not fully cover each other.
- If overlap still hides cost on small scales, prefer a slightly larger diagonal fan and a smaller reserved-card scale over hiding cost.
- Empty reserved slots should disappear or become very faint; do not reserve the old three-card footprint.

Click behavior:

- Any click on a reserved-card mini-stack card opens a large reserved-card preview.
- The large preview should include a buy action when `onBuyReserved(card)` is true and the player is active.
- Puppet Master discard can remain as a small destructive control on the rail stack or move into the large preview; if kept on the rail, it must not steal the main click target.
- Pending presentation cards should keep the existing hidden/pointer-disabled behavior.

### Visual Treatment

Pure/royal stack:

- Use neutral silver/gray material language.
- Use the top card crop from the pure-points stack when pure-points cards exist; otherwise use existing royal card back or latest owned royal card crop.
- Use a crown badge from `assets/card/overlays/CrownBadges/` when feasible.
- Avoid separate text labels inside the rail; use tooltips/preview title for full naming.
- If both pure-points and royal cards exist, show the most gameplay-relevant card on top and expose the mixed contents through count/preview.

Reserved mini-stack:

- Use actual card thumbnails, not abstract slots.
- Keep diagonal offsets stable across 1, 2, and 3 reserved cards so the PlayerZone does not shift.
- Use a subtle gold hover ring for the selected/hovered card rather than the current flat yellow reserve/download language.

### Implementation Shape For A Future Code Pass

- Extend `PlayerZoneResourcesColumn` props with one `specialStackStats` payload.
- Derive `purePointStats` from `cards.filter((card) => card.bonusColor === 'null')`.
- Pass `royals` through from `PlayerZone` into the resources column instead of leaving it unused.
- Build `specialStackCards` from pure-points cards plus royal cards normalized to a previewable card shape where needed.
- Keep `PLAYER_ZONE_DISPLAY_COLORS` as the five basic colors and append one explicit special stack in render code; do not mutate the shared color list to include `null` or `royal`.
- Revisit the `tableauSummaryScale` calculation so it divides available width across six stacks rather than five.
- Reduce `PlayerZoneReservedColumn` horizontal flex and render reserved cards as an absolutely positioned diagonal stack within a fixed mini-stack footprint.
- Extend `CardPreviewOverlay` or introduce a reserved-card preview variant that can show a buy button for active, affordable reserved cards.
- Add stable anchors such as `data-tableau-special-stack="p1-pure-royal"` and `data-reserved-mini-stack="p1"` for later visual verification.

### Rejected Alternatives

Seven equal card slots in the existing tableau row:

- Simple, but it shrinks the most important five-color readout.
- Worse on narrow desktop clamps and dense late-game states.

Separate pure-points and royal chips above the tableau row:

- Saves horizontal width, but creates a second visual grammar inside the already dense resource column.
- Less consistent than a sixth stack now that reserved-column compression can recover room.

Move pure/royal into the identity column:

- Saves horizontal space, but mixes collection state with player identity and privilege controls.
- It also hides card ownership near the buff/identity area rather than near the other tableau stacks.

Use only TopBar counters:

- TopBar is already score/turn/chrome territory.
- It would not show ownership or stack preview affordances.

## Comment 2: Retire TopBar SVG/Lucide Icons

### Scope

The selected TopBar score cluster includes a crown metric and points/trophy metric. The issue is not only the SVG source; the current glyphs read flatter than the new card and surface artwork.

### Recommended Phases

Phase 1: Crown metric

- Replace the lucide crown in `AnimatedCrownMetric` with an image-backed crown component.
- Start from `assets/card/overlays/CrownBadges/crown-badge-gold-one-crown.png` or a derived transparent crop.
- Preserve the existing animation timing and reduced-motion behavior.
- Keep `data-topbar-crowns` and current numeric text unchanged.

Phase 2: Points metric

- Replace the lucide `Trophy` in `TopBar` with either a prestige/trophy raster emblem or a dedicated point-medal asset.
- Do not reuse the royal crown for points; crowns and points must remain visually distinct.
- Verify that `/20` remains legible when the icon has richer highlights.

Phase 3: Secondary chrome

- Replace top-right app chrome icons (`BookOpen`, replay save/import, restart, settings) only after the primary score metrics are stable.
- Keep hit targets and tooltips; this is an art swap plus state styling, not a behavior change.

### Acceptance Criteria

- TopBar still reads at a glance: crown count, crown goal, point score, point goal, P1/P2 turn core.
- Icon assets do not include baked numbers, text, labels, or UI counters.
- Active/near-victory animation remains visible but does not introduce new layout shift.
- Icons are readable over every selected `topbar.png` surface candidate.

## Comment 3: Retire The Reserve Download Icon

### Problem

The card reserve action currently uses a yellow circular button with a download glyph. Functionally it means reserve, but visually it reads as file download and does not match the card-table fantasy language.

### Recommended Replacement

Replace the reserve/download affordance with a reserve-token or hand-slot icon:

- Preferred symbol: small gilded bookmark, clasp, or card-slot token.
- Secondary option: compact chest/sideboard token.
- Avoid arrows, file-download metaphors, or generic app chrome symbols.
- Keep the hover-only behavior on market cards unless future user testing shows the reserve action needs to be permanently visible.

### Visual Requirements

- Minimum clickable area should remain equivalent to the current button.
- The icon should still look actionable on bright white cards and dark cards.
- Hover and active states should use the card frame's gold language, not a flat yellow fill.
- The button should not obscure card cost, crown badges, or ability badges.

### Future Implementation Shape

- Introduce a small `ReserveActionIcon` or `CardActionGlyph` component in `packages/ui`.
- Use image-backed artwork for the glyph, but preserve accessible label text through `aria-label` or the existing localized title path.
- Keep the reserve action inside `Card`; do not move reservation behavior into market layout code.

## Icon Retirement Inventory

Priority order:

1. TopBar crown metric: highest visibility, existing crown art available.
2. Card reserve/download action: currently semantically misleading.
3. TopBar points/trophy metric: high visibility, needs a distinct points asset.
4. RoyalCourt and royal unlock crowns: related to crown asset system, but more animation-sensitive.
5. App chrome and replay controls: lower visual priority; keep lucide until core gameplay icons are coherent.
6. Debug/admin icons: lowest priority unless they leak into normal player-facing flow.

## Asset Guidance

- Use existing crown badge art before generating more crown assets.
- If new reserve or points icons are generated, route through `C:\Users\sange\.codex\skills\imagegen-asset-library-flow\SKILL.md`.
- Runtime React should render counts, labels, hover states, disabled states, and tooltips; icon bitmaps should not include text or numbers.
- Prefer transparent PNG/WebP icon assets at multiple source sizes rather than baking icons into `topbar.png` or `player-zone.png`.

## Validation Plan For A Future Implementation

- Run `pnpm typecheck` and targeted component tests if props/components change.
- Use browser visual review at the same viewport family shown in the comments.
- Check both players, empty special stack, pure-points-only special stack, royal-only special stack, mixed pure/royal special stack, and late-game dense states.
- Check reserved states with 0, 1, 2, and 3 reserved cards; each card's top metadata and left-side cost must remain recognizable in the diagonal stack.
- Check that reserved-card large preview supports inspect-only, buyable, unbuyable, and Puppet Master discard states without ambiguous click behavior.
- Verify every active/hover/disabled state for the reserve action.
- Verify TopBar crown/points readability over current surface styles, especially `royal-luxury`, `crystal-anime`, `dark-arcane`, and `clean-boardgame`.

## Proposed Next PR Slice

PR 1: PlayerZone six-stack tableau and reserved mini-stack

- Render the sixth mixed pure/royal stack.
- Compress reserved cards into a diagonal mini-stack.
- Add anchors for browser verification.

PR 2: Reserved-card large preview actions

- Extend the large reserved-card preview with buy action support.
- Preserve inspect behavior for unbuyable cards.
- Keep destructive discard behavior explicit.

PR 3: Crown metric asset replacement

- Replace `AnimatedCrownMetric` glyph with existing crown material.
- Keep animation behavior and data anchors.

PR 4: Reserve action glyph replacement

- Replace the download metaphor with a reserve-token glyph.
- Preserve action behavior and accessibility.

PR 5: Points and secondary chrome icons

- Replace the TopBar points icon after choosing a point-specific asset.
- Then retire lower-priority chrome/replay icons selectively.
