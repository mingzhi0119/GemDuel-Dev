# Changelog

All notable changes to Gem Duel should be recorded here.

Release coverage is governed by `pnpm changelog:check` and
`tools/governance/release-changelog.snapshot.json`.

## Unreleased

### Added

- Seal coverage exclusions carry a per-entry `ownerRole`, print an owner/category ledger during `pnpm seal-exclusions:check`, and drift-check against `tools/governance/seal-exclusions-monthly.snapshot.json` (`pnpm seal-exclusions:refresh-monthly` to refresh).
- Lifecycle microbenchmarks cover `applyAction` hot paths (`BUY_CARD`, `TAKE_GEMS`, `STEAL_GEM`, `CLOSE_MODAL`) and `simulateAiVsAiReplay` at 100/500/1000 actions; baselines live in `tools/governance/benchmark-baselines.snapshot.json`.
- `pnpm audit:draft` (and CI on certification failure only) writes `artifacts/governance/engineering-audit-draft-<UTC-date>.md` from governance JSON; see ADR `docs/adr/0010-engineering-audit-draft-from-governance.md`.
- Lifecycle certification and governance artifact export failures now print a markdown summary (dimension, metric, evidence paths, suggested `pnpm` reruns) and write `artifacts/governance/lifecycle-failure-summary.md`.
- Visual Lab query routing is gated for production desktop builds (`GEMDUEL_ALLOW_VISUAL_LAB` / `__GEMDUEL_RUNTIME_CONFIG__.allowVisualLab`); default release bundles omit the visual-lab chunk.
- Visual Lab includes a **Back to Start Page** action that clears `?visualLab=` and returns to the start/config shell.
- `pnpm governance:dashboard` writes `artifacts/governance/governance-dashboard.html` from exported governance JSON; the governance evidence workflow runs it after artifact export.
- Repo-specific governance docs for security, contribution flow, architecture, PR review, and dependency automation.
- CODEOWNERS routing for the frontend/domain, networking, desktop, and release areas.
- Lifecycle pipeline checks for repo settings, CODEOWNERS role mapping, release changelog coverage, gate summaries, governance reports, and deterministic microbenchmarks.

### Notes

- The 2026-04-25 audit in `docs/archive/engineering-audit-report-2026-04-25.md` is the current lifecycle remediation anchor.
- Release notes should call out any change to `electron/`, networking contracts, `governance/` snapshots, `.github/workflows/`, lifecycle gate scripts, or published release coverage.

## v5.2.11 - 2025-12-31

### Added

- Published global online multiplayer improvements with visual polish and stability fixes.

### Fixed

- Included cumulative public Online Mode and Light Mode stability refinements from the GitHub release.

## v5.2.9 - 2025-12-31

### Fixed

- Published online-mode fixes.

## v5.2.7 - 2025-12-30

### Changed

- Published UI update release.

## v5.2.6 - 2025-12-30

### Fixed

- Published stability patch for the online initialization error around `online` access before initialization.

## v5.2.5 - 2025-12-30

### Fixed

- Published color picker conclusion cleanup and AI pause behavior while undo is active.

## v5.2.4 - 2025-12-30

### Changed

- Published Electron shell update and window-title release polish.

## v5.2.2 - 2025-12-30

### Changed

- Published official-rule alignment, high-level UI readability improvements, and stability test work.

## v5.2.1 - 2025-12-30

### Fixed

- Published buff bug fixes.

## v5.2.0 - 2025-12-29

### Added

- Published procedural card faces with unique generated background patterns.

## v5.1.0 - 2025-12-29

### Changed

- Published documentation and workflow overhaul release.

## v5.0.7 - 2025-12-29

### Fixed

- Published refill logic fix so replenishing no longer incorrectly ends the player's turn.

## v5.0.6 - 2025-12-29

### Added

- Published colorless card support and neutral tableau stack display.

## v5.0.5 - 2025-12-29

### Fixed

- Published additional buff fixes.

## v5.0.4 - 2025-12-29

### Changed

- Published strict TypeScript cleanup and core update work.

## v5.0.0 - 2025-12-28

### Changed

- Published the authoritative networking synchronization milestone for robust multiplayer.
