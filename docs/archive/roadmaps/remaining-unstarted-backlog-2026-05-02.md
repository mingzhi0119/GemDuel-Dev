# Remaining Unstarted Backlog (2026-05-02)

## Status

**Active short backlog.** This file contains only the residual items that were not already completed, superseded, or cancelled while compressing old audit and implementation documents.

## Backlog

| ID                | Item                                                                                                                                       | Status                | Owner area             | Acceptance                                                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DOC-OWNERS-001`  | Decide whether `.github/CODEOWNERS` should intentionally remain single-maintainer or map paths to the owner roles used by governance docs. | Not started           | Engineering governance | Either split CODEOWNERS by owner role, or add a short ADR documenting single-maintainer ownership and link it from contributor/governance docs.              |
| `DOC-ONBOARD-001` | Add a compact contributor onboarding guide only if outside contributors are expected.                                                      | Not started           | Documentation          | `docs/guides/onboarding.md` exists, links to setup/gate commands, and can get a new contributor from clone to local verification without reading old audits. |
| `VIS-ICON-001`    | Optional secondary icon-retirement tail for lower-priority lucide surfaces.                                                                | Not started, optional | UI visual polish       | If pursued, replace only one surface group per PR and verify accessibility, hover/disabled states, and visual fit. Not a release blocker.                    |

## Cancelled

| ID                    | Item                                           | Decision                                                                                                                        |
| --------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `MARKET-SHORTCUT-001` | Right-click / drag direct-buy for market cards | Cancelled. Market cards stay preview-first; direct-buy shortcuts are not planned.                                               |
| `RELEASE-XPLAT-001`   | macOS/Linux desktop packaging from old audits  | Cancelled for now. Current project policy is Windows NSIS only unless a future user request explicitly changes release targets. |

## Not Backlog

- GPT-5.5 Pro runtime/security remediation: completed or superseded by current governance.
- Opus 4.7 coverage/lifecycle roadmap: completed.
- PlayerZone six-stack and reserved mini-stack: completed.
- Market preview-first left-click flow: completed.
