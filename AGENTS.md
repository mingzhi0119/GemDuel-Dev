# AGENTS

## Scope

This repository is a `pnpm` + Turborepo monorepo.

- `apps/desktop`: Electron main/preload, renderer shell, routes, hooks, desktop runtime
- `packages/shared`: domain logic, protocol, validation, data, runtime policy, pure utilities
- `packages/ui`: reusable React UI and view helpers
- `packages/turn-service`: TURN credential service
- `tools/scripts`: governance, release, export, and maintenance scripts
- `tools/governance`: machine-readable snapshots and retained evidence

## Rules

- Use `pnpm` from the repo root. Do not introduce `npm` or `package-lock.json`.
- Keep `packages/shared` pure: no React, Electron, or DOM dependencies.
- `packages/ui` may depend on `@gemduel/shared`, but never on `apps/desktop`.
- `apps/desktop` should import shared code through workspace packages, not cross-directory relative paths.
- `tools/scripts` owns governance checks and snapshot generation. Do not hand-edit generated snapshots unless the owning script requires it.
- Desktop release packaging is Windows NSIS only. Do not expand release targets unless explicitly asked.
- Canonical player-facing gameplay terms live in `packages/shared/src/lexicon/index.ts`. Do not hand-maintain a second glossary in i18n catalogs.
- Use `getLexiconLabel(termId, locale)` for non-React labels, `<LexiconTerm />` for explicit interactive terms, and `<LexiconText />` only on designated long-form instructional prose.
- Legacy phrases such as `Royal Court` or `Select Joker Color` may remain only as lexicon aliases or regression-test fixtures, never as live player-facing copy.
- Generated replay outputs under `Replay/` are local artifacts and must stay untracked unless a task explicitly changes that policy.
- Market and royal gameplay cards must share the same featured display box. Featured cards use a `1086x1448` design/sampling canvas (`FEATURED_CARD_SAMPLE_SIZE`) rendered inside the card and downsampled into the layout-controlled display box (`FEATURED_CARD_SIZE`); do not enlarge low-resolution card faces or change a market-only scale factor.
- Runtime card IDs must use `XYZ-cc`: `X` is `1/2/3` for standard levels or `r` for royal, `Y` is `1 red`, `2 green`, `3 blue`, `4 white`, `5 black`, `6 pearl/pink`, `7 gold/JOKER`, `8 pure-points/gray`, `9 royal`, `Z` is the level+color sequence (`1..9,a,b...`), and `cc` is one of `re/gr/bl/wh/bk/pe/jo/po/ro`. The authoritative old-to-new audit table is `assets/card/manifests/card-id-migration.csv`.

## Default Commands

Run these from the repo root:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:coverage`
- `pnpm boundaries:check`
- `pnpm architecture:check`
- `pnpm deps:check`
- `pnpm desktop:check`
- `pnpm release:check`

Use `pnpm build` for normal build validation and `pnpm electron:build` only when desktop packaging must be verified.

## Change Discipline

- Keep changes inside the correct workspace boundary.
- Add or update tests when behavior changes.
- Update docs when commands, workflow expectations, or architecture boundaries change.
- If a change affects governance behavior, also update the matching script, snapshot, and documentation together.
- Prefer small, targeted edits over broad refactors unless the task explicitly asks for structural work.
- When canonical terms, buff prose, rulebook prose, or glossary interactions change, update the lexicon tests and regression checks together.
