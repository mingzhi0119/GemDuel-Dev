# ADR-0001: Govern Electron IPC Through an Allowlist

Status: Accepted  
Date: 2026-04-20

## Context

The renderer must not talk to Electron internals directly. The desktop shell already treats preload as the only safe bridge.

## Decision

Keep the renderer-visible API surface constrained to the governed preload allowlist and validate every governed channel in main before handling it.

## Consequences

- Renderer code depends on `src/types/desktop.ts` instead of `electron/**`.
- New IPC capabilities require allowlist, preload, and governance updates in the same change.
