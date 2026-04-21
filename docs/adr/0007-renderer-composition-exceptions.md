# ADR-0007: Allow a Temporary Oversized Renderer Composition Surface

Status: Accepted (Historical Record)  
Date: 2026-04-20

## Context

This ADR recorded a temporary period where a small set of renderer files exceeded the normal hard architecture budget while staged decomposition work was in progress.

## Decision

Treat oversized renderer surfaces as temporary technical debt and require explicit ADR-backed exceptions for any file that crosses the hard architecture budget before it is decomposed. Those exceptions must be removed once the decomposition work lands.

## Consequences

- `src/components/PlayerZone.tsx` and `src/components/CardAnatomyPage.tsx` have both been decomposed back under the baseline budget, so this ADR no longer grants any active exception.
- The architecture budget contract now carries zero approved exceptions, and future hard-limit breaches must be re-approved explicitly instead of reusing this historical allowance.
- Warning-level components such as `Card.tsx`, `GameBoard.tsx`, and `TopBar.tsx` remain ordinary refactor candidates even though they are below the hard stop.
