# Market Card Preview-First Interaction Archive (2026-04-28)

## Status

**Completed and archived.** The preview-first market-card interaction was implemented after this proposal. This file is retained only as the compact audit record for the original UI decision.

## Completed Scope

- Market card left-click opens `CardPreviewOverlay` instead of buying immediately.
- Market preview actions use the stable two-action layout: left `buy`, right `reserve`.
- Buy and reserve actions stay visible but independently disabled when unavailable.
- Reserved-card purchase and deck-reserve preview paths reuse the shared preview-action model.
- The old "select gold, then click market card to reserve immediately" shortcut was retired.
- Regression coverage exists in `apps/desktop/src/__tests__/surfaceStyling.test.tsx` and phase-aware interaction tests.

## Cancelled Scope

**Phase 2 right-click / drag direct-buy is cancelled.**

The old proposal reserved right-click and drag-to-buy for a later phase. That feature is no longer planned because the accepted interaction model is preview-first for market cards. Keeping only left-click preview avoids two parallel purchase semantics and reduces accidental buys.

## Remaining Work

None in this file. Any future interaction change should be opened as a new proposal rather than reopening this archived plan.
