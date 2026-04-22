# ADR-0003: Treat Replay Import as a Governed Trust Boundary

Status: Accepted  
Date: 2026-04-20

## Context

Replay import ingests externally supplied files and now rehydrates only the governed `ReplayVNext` format into a replay session.

## Decision

Keep replay import behind schema validation, bounded parsing, deterministic loader checks, and dedicated negative-path tests before any imported replay session is allowed into the reducer.

Replay vNext 1.0 is the only supported format. Legacy `{ version, timestamp, history }` envelopes are rejected with `UNSUPPORTED_REPLAY_VERSION` and must be re-recorded by a current build.

## Consequences

- Replay import remains a first-class governance boundary with dedicated tests and release checks.
- Future replay features must preserve the reject-first behavior on malformed, legacy, or untrusted input.
- Replay metadata is now split between schema validation, summary integrity checks, and canonical state hashing.
