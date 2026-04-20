# ADR-0005: Use Structured Release-health Events Across Main and Renderer

Status: Accepted  
Date: 2026-04-20

## Context

P2 replaced scattered renderer logging with governed release-health events, but those events only stay useful if the schema remains stable across renderer, preload, and main.

## Decision

Keep release-health as a structured event schema with category, severity, name, message, and optional context, and forward renderer events through the governed preload bridge into the main-process monitor.

## Consequences

- New observability paths should use structured events instead of raw `console.*`.
- The bridge and monitor tests are part of the release-health contract, not just implementation detail.
