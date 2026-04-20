# ADR-0003: Treat Replay Import as a Governed Trust Boundary

Status: Accepted  
Date: 2026-04-20

## Context

Replay import ingests externally supplied files and can rehydrate action history into live game state.

## Decision

Keep replay import behind schema validation, bounded parsing, and dedicated negative-path tests before any imported action history is allowed into the reducer.

## Consequences

- Replay import remains a first-class governance boundary with dedicated tests and release checks.
- Future replay features must preserve the reject-first behavior on malformed or untrusted input.
