# ADR-0011: Exempt Rulebook Content from the UI File-size Hard Stop

Status: Accepted  
Date: 2026-04-29

## Context

`packages/ui/src/components/RulebookContent.ts` is a localized rulebook data catalog. It is intentionally dense static content with lightweight search helpers, not a renderer composition surface or gameplay logic module.

The file can exceed the normal UI hard line budget when player-facing rules, diagrams, and localized copy are expanded. Splitting it only to satisfy the generic UI component budget would make copy review harder without reducing runtime coupling.

## Decision

Grant `packages/ui/src/components/RulebookContent.ts` an ADR-backed architecture budget exception with an approved ceiling of 650 lines.

The exception is limited to static rulebook content and its local text extraction helpers. New interactive UI, domain logic, or cross-layer imports must not be added under this exception.

## Consequences

- Architecture budget checks can stay green while the rulebook remains reviewable as a single localized content artifact.
- The file should still be split if it approaches 650 lines or starts mixing in interactive rendering behavior.
- This exception must remain recorded in `docs/governance/architecture-layer-map.md`.
