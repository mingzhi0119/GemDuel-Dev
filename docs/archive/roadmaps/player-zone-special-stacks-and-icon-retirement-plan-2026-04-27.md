# PlayerZone Special Stacks and Icon Retirement Archive (2026-04-27)

## Status

**Mostly completed and archived.** The original PlayerZone layout slice was implemented. This document is retained only as a compact record of the accepted design and the small optional visual tail that was not part of the completed slice.

## Completed Scope

- PlayerZone gained the sixth mixed pure/royal tableau stack.
- Reserved cards were compressed into a diagonal mini-stack.
- Reserved-card clicks open a large preview, and buyable reserved cards expose purchase from that preview.
- Stable visual anchors were added, including `data-tableau-special-stack` and `data-reserved-mini-stack`.
- TopBar crown and market reserve/download affordances moved to image-backed UI artwork.

## Archived Design Decisions

- Keep the five color stacks as the primary tableau grammar.
- Combine pure-points cards and owned royal cards into one sixth special stack instead of adding a seventh stack.
- Reserved-card rail clicks mean inspect first; explicit buy happens in the preview surface.
- Do not replace every lucide/app chrome icon in one large pass.

## Remaining Optional Tail

The only residual item from this archived proposal is non-blocking visual polish: secondary lucide icon retirement in lower-priority surfaces such as RoyalCourt, royal selection, ability badges, WinnerModal, and app chrome. Track it in the short backlog if it becomes desirable; it is not a release blocker.
