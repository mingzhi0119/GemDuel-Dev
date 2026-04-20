# ADR-0002: Keep Zod Contracts as the Boundary Schema Source

Status: Accepted  
Date: 2026-04-20

## Context

Runtime contracts span replay import, release-health payloads, relay profiles, and desktop bridge messages. The project already centralizes those contracts in Zod-backed schemas.

## Decision

Keep Zod schemas as the runtime contract source of truth and continue deriving validation and contract snapshots from that boundary layer.

## Consequences

- `src/logic/contractSchemas.ts` remains the consolidated contract registry until the schema catalog is split by concern.
- The architecture budget gate permits `src/logic/contractSchemas.ts` up to `800` lines while that extraction is planned.
