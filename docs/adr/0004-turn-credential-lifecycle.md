# ADR-0004: Issue TURN Credentials as Ephemeral Runtime Bundles

Status: Accepted  
Date: 2026-04-20

## Context

Multiplayer relay credentials are sensitive and time-bound. Shipping long-lived credentials in renderer state would widen the exposure window.

## Decision

Resolve TURN credentials as ephemeral runtime bundles, refresh them through governed desktop and service paths, and revoke them when a session no longer needs them.

## Consequences

- TURN bundle validation stays shared between `apps/desktop/electron` runtime and `packages/turn-service`.
- Relay lifecycle changes must update both runtime governance and the credential service path together.
