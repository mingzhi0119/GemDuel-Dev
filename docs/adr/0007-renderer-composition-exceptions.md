# ADR-0007: Allow a Temporary Oversized Renderer Composition Surface

Status: Accepted  
Date: 2026-04-20

## Context

Some renderer components still carry too much orchestration and presentation in one file, especially the main player surface.

## Decision

Treat the current oversized renderer surface as temporary technical debt and require explicit ADR-backed exceptions for any file that crosses the hard architecture budget before it is decomposed.

## Consequences

- The architecture budget gate permits `src/components/PlayerZone.tsx` up to `800` lines during the staged UI split.
- The architecture budget gate permits `src/components/CardAnatomyPage.tsx` up to `600` lines while its anatomy and documentation surface is extracted.
- Warning-level components such as `Card.tsx`, `CardAnatomyPage.tsx`, `GameBoard.tsx`, and `TopBar.tsx` remain on the refactor backlog even when they are below the hard stop.
