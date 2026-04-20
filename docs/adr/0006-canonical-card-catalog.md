# ADR-0006: Keep the Canonical Card Catalog as a Generated-in-repo Data File

Status: Accepted  
Date: 2026-04-20

## Context

`src/data/realCards.ts` is large because it is the canonical in-repo card catalog, not because it mixes unrelated runtime behavior.

## Decision

Keep the canonical card catalog in a single checked-in data module until there is a generator or external content pipeline that can split it without creating multiple competing sources of truth.

## Consequences

- The architecture budget gate permits `src/data/realCards.ts` up to `900` lines while the catalog remains authoritative in-repo data.
- Refactoring this file should prioritize generation or data-pipeline extraction, not arbitrary manual fragmentation.
