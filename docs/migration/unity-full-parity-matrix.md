# Unity Full Parity Matrix

Last updated: 2026-05-14 Local PVP completion reconciliation

This matrix is the required full-migration parity ledger. It is not a completion claim. Electron is
the reference implementation until every row passes with evidence.

Current status: the declared Local PVP product surface is `Complete` as of the 2026-05-14
product-surface coverage report. Older `Incomplete` and `Blocked` row notes below are retained as
historical full-migration parity snapshots unless the row explicitly describes a non-Local-PVP
surface. LAN, Online, and Visual Lab are user-approved exclusions from the Local PVP completion
scope.

## Evidence Inputs

- Electron route/product scope: `docs/migration/unity-product-scope-map.md`
- Operation contract: `docs/migration/electron-unity-operation-parity-contract.md`
- Parity runner: `tools/migration/electron-unity-parity-runner.mjs`
- Replay/hash oracle: `fixtures/replay-golden/manifest.json`,
  `fixtures/replay-golden/rejection-manifest.json`, and `tools/migration/verify-replay-parity.ts`
- Required viewports: `1920x1080` and `1366x768`

## 2026-05-13 Shared Oracle Follow-Up

The shared action diff from commit `6e8af1b9513cab7ab8a6713b0b7d1786a1ff676c` was re-audited
against the current TypeScript oracle tests. Existing focused tests cover deterministic empty
board-cell UIDs, deterministic offline draft rerolls with P1/P2 draft ownership separation, and
unaffordable buy rejection that preserves `pendingBuy` plus market/tableau/phase state. Focused
validation passed with 3 shared action test files and 57 tests:

`pnpm exec vitest run packages/shared/src/logic/actions/__tests__/boardActions.test.ts packages/shared/src/logic/actions/__tests__/buffActions.branch.test.ts packages/shared/src/logic/actions/__tests__/marketActions.phase3.test.ts`

This confirms the prior shared changes remain product-correct TypeScript oracle behavior, not
Unity-only parity accommodations. Its 2026-05-13 `Incomplete` status is superseded for the declared
Local PVP product surface by the 2026-05-14 packaged-runtime product-surface report; LAN, Online,
and Visual Lab remain explicit Local PVP exclusions.

## 2026-05-13 Replay-Review Summary Guard

The built-player smoke summarizer's replay-review release-path guard now has focused regression
tests. It accepts a retained report only when the nested release-path proof records a live source
replay, visible redo/undo controls, expected revision movement, final hash preservation, and no
source live-state or replay-stream mutation. The negative test fails closed when visible review
control evidence is missing.

Focused validation passed with 25 summarizer tests:

`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`

The retained replay-review launcher report also passes the concrete navigation guard matrix at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-review-navigation-guard.json`
with 1/1 report, 4 commands, 10 mailbox events, replay-review final hash `db7fb1b7`, and status
`incomplete-evidence`. This strengthens replay-review release-path evidence but leaves full product
scope and release-runtime status incomplete.

## 2026-05-13 Replay Release-Path Summary Guard

The built-player smoke summarizer's replay release-path guard now has focused regression tests. It
accepts a retained report only when the nested replay release-path proof preserves the baseline
state hash and event count, records the reviewed final hash, carries enough passing case records,
and includes all required coverage labels. The negative test fails closed when the required
`hash_mismatch` coverage label is missing.

Focused validation passed with 27 summarizer tests:

`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`

The retained audited replay release-path launcher report also passes the concrete summary guard
matrix at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-release-path-summary-guard.json`
with 1/1 report, 8 commands, 9 mailbox events, 9/9 retained audit response files, full replay
release-path coverage, final hash `f9eb9e83`, and status `incomplete-evidence`. This strengthens
replay release-path evidence but leaves full product scope and release-runtime status incomplete.

## 2026-05-13 Invalid-Action Summary Guard

The built-player smoke summarizer's invalid-action release-path guard now has focused regression
tests. It accepts a retained report only when the nested invalid-action proof records the required
case IDs, one rejected bridge process result per case, unchanged state/replay hashes, zero recorded
events, and export/review hash preservation. The negative test fails closed when a retained
invalid-action case mutates state.

Focused validation passed with 29 summarizer tests:

`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`

The retained audited invalid-action launcher report also passes the concrete summary guard matrix at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-invalid-action-summary-guard.json`
with 1/1 report, 1 product-surface command, 9 mailbox events, 9/9 retained audit response files,
invalid-action hash `f2780c3f`, and status `incomplete-evidence`. This strengthens invalid-action
release-path evidence but leaves full product scope and release-runtime status incomplete.

## 2026-05-13 Recovery Summary Guard

The built-player smoke summarizer's recovery release-path guard now has focused regression tests.
It accepts a retained report only when the nested recovery proof records save/load/continue status,
matching saved/restored hashes, a distinct continued hash, preserved-then-appended live replay event
counts, state-summary hash alignment, and export/review hash preservation. The negative test fails
closed when the continued proof does not append the expected replay event.

Focused validation passed with 31 summarizer tests:

`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`

The retained recovery launcher report also passes the concrete summary guard matrix at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-recovery-summary-guard.json`
with 1/1 report, 2 product-surface commands, 6 mailbox events, recovery continuation hash
`8d4178f7`, and status `incomplete-evidence`. This strengthens recovery release-path evidence but
leaves full product scope and release-runtime status incomplete.

## 2026-05-13 Settings Summary Guard

The built-player smoke summarizer's settings release-path guard now has focused regression tests.
It accepts a retained report only when the nested settings proof records save/reload status, a real
persistence file, unchanged gameplay hashes, zero recorded gameplay events, and expected
saved/persisted/reloaded settings values. The negative test fails closed when settings persistence
records gameplay events.

Focused validation passed with 33 summarizer tests:

`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`

The retained settings launcher report also passes the concrete summary guard matrix at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-settings-summary-guard.json`
with 1/1 report, 2 product-surface commands, 5 mailbox events, settings path
`artifacts/unity/settings/gemduel.preferences.v1.json`, final hash `8668e7ab`, and status
`incomplete-evidence`. This strengthens settings release-path evidence but leaves full product scope
and release-runtime status incomplete.

## 2026-05-13 Chrome Summary Guard

The built-player smoke summarizer's chrome release-path guard now has focused regression tests. It
accepts a retained report only when the nested chrome proof records rulebook open/close, unchanged
gameplay hash/event count, return to shell after restart, Local PvP start visibility, and a
restarted live command with a new hash and one recorded event. The negative test fails closed when
rulebook controls change the live replay event count.

Focused validation passed with 35 summarizer tests:

`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`

The retained chrome launcher report also passes the concrete summary guard matrix at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-chrome-summary-guard.json`
with 1/1 report, 2 product-surface commands, 6 mailbox events, chrome restart hash `5304b037`,
final hash `e3a47e84`, and status `incomplete-evidence`. This strengthens chrome release-path
evidence but leaves full product scope and release-runtime status incomplete.

## 2026-05-13 Peek-Modal Summary Guard

The built-player smoke summarizer's peek-modal release-path guard now has focused regression tests.
It accepts a retained report only when the nested peek-modal proof records buff selection, visible
peek/modal controls, ordered `select_buff`/`peek_deck`/`close_modal` export, recorded/exported event
preservation, and review hash preservation. The negative test fails closed when the required
`close_modal` event evidence is missing.

Focused validation passed with 37 summarizer tests:

`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`

The retained peek-modal launcher report also passes the concrete summary guard matrix at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-peek-modal-summary-guard.json`
with 1/1 report, 4 product-surface commands, 10 mailbox events, peek-modal review hash `8399eadd`,
final hash `26aa66c6`, and status `incomplete-evidence`. This strengthens peek-modal release-path
evidence but leaves full product scope and release-runtime status incomplete.

## 2026-05-13 Recovery Invalid-Action Summary Guard

The built-player smoke summarizer's recovery invalid-action release-path guard now has focused
regression tests. It accepts a retained report only when the nested recovered invalid-action proof
records the required recovered rejection case IDs, one rejected bridge process result per case,
unchanged recovered state/replay/summary hashes, unchanged recovered recorded event counts, a valid
post-rejection continuation, and export/review hash preservation. The negative test fails closed
when a rejected recovered action records a replay event.

Focused validation passed with 39 summarizer tests:

`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`

The retained recovery invalid-action launcher report also passes the concrete summary guard matrix
at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-recovery-invalid-action-summary-guard.json`
with 1/1 report, 2 product-surface commands, 9 mailbox events, recovery invalid-action continuation
hash `d2b51b3f`, final hash `d2fd26e1`, and status `incomplete-evidence`. This strengthens
recovered invalid-action release-path evidence but leaves full product scope and release-runtime
status incomplete.

## 2026-05-13 Privilege-Cancel Summary Guard

The built-player smoke summarizer's privilege-cancel release-path guard now has focused regression
tests. It accepts a retained report only when the nested privilege-cancel proof records the
`PRIVILEGE_ACTION` phase, returns to `IDLE`, exports ordered `activate_privilege` then
`cancel_privilege` events, preserves recorded/exported event counts, and preserves export/review
hashes. The negative test fails closed when the activation/cancel event order is reversed.

Focused validation passed with 41 summarizer tests:

`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`

The retained privilege-cancel launcher report also passes the concrete summary guard matrix at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-privilege-cancel-summary-guard.json`
with 1/1 report, 3 product-surface commands, 8 mailbox events, action families
`activate_privilege`, `cancel_privilege`, `take_gems`, and `use_privilege`, privilege-cancel hash
`efe66377`, final hash `9e3b6f7c`, and status `incomplete-evidence`. This strengthens
privilege-cancel release-path evidence but leaves full product scope and release-runtime status
incomplete.

## 2026-05-13 Reserved-Discard Summary Guard

The built-player smoke summarizer's reserved-discard release-path guard now has focused regression
tests. It accepts a retained report only when the nested reserved-discard proof records
`puppet_master` selection, visible reserved-card discard controls, ordered
`select_buff`/`reserve_card`/`discard_reserved` export, recorded/exported event preservation, and
export/review hash preservation. The negative test fails closed when the discard-control evidence
is hidden.

Focused validation passed with 43 summarizer tests:

`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`

The retained reserved-discard launcher report also passes the concrete summary guard matrix at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserved-discard-summary-guard.json`
with 1/1 report, 6 product-surface commands, 14 mailbox events, action families `choose_boon`,
`discard_reserved`, `reserve_card`, and `take_gems`, reserved-discard hash `33909286`, final hash
`fb772d70`, and status `incomplete-evidence`. This strengthens reserved-discard release-path
evidence but leaves full product scope and release-runtime status incomplete.

## 2026-05-13 Reserved-Buy Summary Guard

The built-player smoke summarizer's reserved-buy release-path guard now has focused regression
tests. It accepts a retained report only when the nested reserved-buy proof records visible
reserved-card buy controls, ordered `reserve_card` and reserved-source `buy_card` export,
recorded/exported event preservation, and export/review hash preservation. The negative test fails
closed when the `buy_card` event source is not reserved.

Focused validation passed with 45 summarizer tests:

`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`

The retained reserved-buy launcher report also passes the concrete summary guard matrix at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserved-buy-summary-guard.json`
with 1/1 report, 6 product-surface commands, 16 mailbox events, action families `buy_card`,
`reserve_card`, and `take_gems`, reserved-buy hash `47c0e9db`, final hash `8ea252da`, and status
`incomplete-evidence`. This strengthens reserved-buy release-path evidence but leaves full product
scope and release-runtime status incomplete.

## 2026-05-13 Reserve-Cancel Summary Guard

The built-player smoke summarizer's reserve-cancel release-path guard now has focused regression
tests. It accepts a retained report only when the nested reserve-cancel proof records visible market
reserve/cancel controls, `RESERVE_WAITING_GEM` to `IDLE` transition evidence, cleared pending-reserve
state, ordered `initiate_reserve`/`cancel_reserve` export, recorded/exported event preservation, and
initial/export/review hash preservation. The negative test fails closed when cancel leaves pending
reserve state behind.

Focused validation passed with 47 summarizer tests:

`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`

The retained reserve-cancel launcher report also passes the concrete summary guard matrix at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-cancel-summary-guard.json`
with 1/1 report, 6 product-surface commands, 10 mailbox events, action families `cancel_reserve`,
`reserve_card`, and `take_gems`, reserve-cancel hash `40bdddbf`, final hash `bdbabdbb`, and status
`incomplete-evidence`. This strengthens reserve-cancel release-path evidence but leaves full product
scope and release-runtime status incomplete.

## 2026-05-13 Reserve-Deck Summary Guard

The built-player smoke summarizer's reserve-deck release-path guard now has focused regression
tests. It accepts a retained report only when the nested reserve-deck proof records visible
deck/gold reserve controls, deck-pending phase evidence, deck/reserved/gold-cell mutation, ordered
`initiate_reserve_deck`/`reserve_deck` export, recorded/exported event preservation, and
export/review hash preservation. The negative test fails closed when the deck does not decrement and
Gold is not consumed.

Focused validation passed with 49 summarizer tests:

`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`

The retained reserve-deck launcher report also passes the concrete summary guard matrix at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-deck-summary-guard.json`
with 1/1 report, 6 product-surface commands, 10 mailbox events, action families `buy_card`,
`initiate_reserve_deck`, `reserve_deck`, `take_bonus_gem`, and `take_gems`, reserve-deck hash
`da89d9e5`, final hash `63df431c`, and status `incomplete-evidence`. This strengthens reserve-deck
release-path evidence but leaves full product scope and release-runtime status incomplete.

## 2026-05-13 Reserve-Deck-Cancel Summary Guard

The built-player smoke summarizer's reserve-deck-cancel release-path guard now has focused
regression tests. It accepts a retained report only when the nested deck-reserve cancel proof
records visible deck/gold reserve/cancel controls, deck-pending cancel phase evidence, restored
deck/reserved/gold-cell state, ordered `initiate_reserve_deck`/`cancel_reserve` export,
recorded/exported event preservation, and initial/export/review hash preservation. The negative test
fails closed when cancel mutates deck/reserve row/pending reserve/Gold state.

Focused validation passed with 51 summarizer tests:

`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`

The retained reserve-deck-cancel launcher report also passes the concrete summary guard matrix at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-deck-cancel-summary-guard.json`
with 1/1 report, 8 product-surface commands, 12 mailbox events, action families `buy_card`,
`cancel_reserve`, `initiate_reserve_deck`, `select_joker_color`, and `take_gems`, deck-reserve
cancel hash `62fa027f`, final hash `95c8a06c`, and status `incomplete-evidence`. This strengthens
deck-reserve cancel release-path evidence but leaves full product scope and release-runtime status
incomplete.

## 2026-05-13 Joker Summary Guard

The built-player smoke summarizer's Joker release-path guard now has focused regression tests. It
accepts a retained report only when the nested Joker proof records visible market preview/buy/color
controls, `SELECT_CARD_COLOR` to `IDLE` transition evidence, Joker tableau placement, pending-buy
clearing, ordered `initiate_buy_joker`/`buy_card` export, recorded/exported event preservation, and
export/review hash preservation. The negative test fails closed when pending buy is not cleared
after buy.

Focused validation passed with 53 summarizer tests:

`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`

The retained Joker launcher report also passes the concrete summary guard matrix at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-joker-summary-guard.json`
with 1/1 report, 8 product-surface commands, 18 mailbox events, action families `buy_card`,
`initiate_buy_joker`, `select_joker_color`, and `take_gems`, Joker hash `95c8a06c`, final hash
`95c8a06c`, and status `incomplete-evidence`. This strengthens Joker release-path evidence but
leaves full product scope and release-runtime status incomplete.

## 2026-05-13 Draft Summary Guard

The built-player smoke summarizer's draft release-path guard now has focused regression tests. It
accepts a retained report only when the product-surface smoke starts fresh roguelike LocalDev with
`reroll-each-player-first`, records ordered P1/P2 `reroll_draft_pool` and `choose_boon` actions,
resolves `DRAFT_PHASE` to `IDLE`, preserves live replay event counts, and preserves export/review
hashes. The negative test fails closed when both players' draft selections do not finish in `IDLE`.

Focused validation passed with 55 summarizer tests:

`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`

The retained draft launcher report also passes the concrete summary guard matrix at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-draft-summary-guard.json`
with 1/1 report, 8 product-surface commands, 9 mailbox events, action families `choose_boon`,
`reroll_draft_pool`, and `take_gems`, draft hash `851b6356`, final hash `851b6356`, and status
`incomplete-evidence`. The newer post-no-take-3 retained draft launcher also passes
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-draft-post-notake3-summary-guard.json`
with 1/1 report, 6 product-surface commands, 7 mailbox events, draft hash `857c3e58`, final hash
`857c3e58`, and status `incomplete-evidence`. This strengthens draft release-path evidence but
leaves full product scope and release-runtime status incomplete.

## Required Product Parity

The row-level statuses in this table are retained as the full-migration parity ledger. For the
current declared Local PVP completion status, use the 2026-05-14 product-surface coverage report;
historical `Incomplete` rows below do not override that Local PVP `Complete` verdict.

| Area                           | Semantic keys                         | Click rectangles                      | Hover results                 | Click/state result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Screenshot/viewport evidence                                                                                                                                                                                                                                          | Status                             |
| ------------------------------ | ------------------------------------- | ------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| App launch/main menu           | Runner scenario passed                | Runner scenario passed                | Not applicable                | Shell visible                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `2026-05-12T06-57-43-164Z`                                                                                                                                                                                                                                            | Passed for configured runner scope |
| Start/config menu              | Partial                               | Partial                               | Incomplete                    | Visible Local PvP start now uses rules boundary by default                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Build/EditMode evidence                                                                                                                                                                                                                                               | Incomplete                         |
| Draft/boon selection           | Runner select/hover passed            | Runner select/hover passed            | Runner hover passed           | Fixture P1/P2 select works; live draft reroll target now routes through the bridge; built-player roguelike LocalDev smoke rerolls and selects draft buffs for both players, records eight live replay events, exports/imports/reviews the replay, and preserves hash `851b6356`; oracle and Unity live-bridge proof now reject stale-pool P2 draft select before P1 locks a buff at hash `5c903209`; full select/rejection breadth remains incomplete                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Runner, EditMode proof, and built-player draft smoke `2026-05-12T05-44-04-969Z`                                                                                                                                                                                       | Incomplete                         |
| Main gameplay board            | Runner board scenarios passed         | Runner board scenarios passed         | Runner board hover passed     | Fixture path and expanded live board/follow-up commands exist                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `2026-05-12T06-57-43-164Z`                                                                                                                                                                                                                                            | Incomplete                         |
| Board take-gems confirm/cancel | Runner take-gems confirm passed       | Runner take-gems confirm passed       | Runner board hover passed     | Basic live take-gems command bridged; empty, gold-cell, gapped, no-take-3 buff, and wrong-phase selections reject without state/replay mutation; the built-player invalid-action and recovery-invalid-action release-path smokes also reject empty and inactive-player `TAKE_GEMS` without mutation or recording; broader board parity still incomplete                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `2026-05-12T06-57-43-164Z`                                                                                                                                                                                                                                            | Incomplete                         |
| Replenish/end-turn             | Runner end-turn scenario passed       | Runner end-turn scenario passed       | Not applicable                | Basic live replenish command bridged; full edge coverage missing                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `2026-05-12T06-57-43-164Z`                                                                                                                                                                                                                                            | Incomplete                         |
| Bonus/steal/discard follow-ups | Runner follow-up scenarios passed     | Runner follow-up scenarios passed     | Partial                       | Live follow-up dispatch routes through bridge; focused bonus/steal phase-resolution proof records valid `TAKE_BONUS_GEM` and `STEAL_GEM` events, verifies board/inventory mutation, resolves both controlled follow-up phases to `IDLE`, and keeps live replay summary hashes aligned; wrong-color/empty/out-of-bounds/wrong-phase/wrong-actor bonus, not-owned/wrong-phase/wrong-actor discard, and gold/not-owned/wrong-phase/wrong-actor steal rejections preserve state/replay; the focused follow-up wrong-actor proof rejects `TAKE_BONUS_GEM`, `DISCARD_GEM`, and `STEAL_GEM` with actor override `p2` while keeping phase, turn, board, inventory, hash, and live recording stable; the 2026-05-12 built-player smokes include live `STEAL_ACTION` resolution through `steal_gem`, explicit `take_bonus_gem` family evidence from `BONUS_ACTION`, and resource-first discard breadth; broader oracle/release coverage still missing                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | EditMode proof including `editmode-bonus-steal-phase-resolution-20260512-results.xml` and `editmode-follow-up-wrong-actor-rejection-20260512-results.xml` plus built-player smokes `2026-05-12T00-01-24-013Z`, `2026-05-12T00-11-24-743Z`, and resource-first breadth | Incomplete                         |
| Market card preview            | Runner scenario passed                | Runner scenario passed                | Runner market hover passed    | Preview does not mutate state in configured runner                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `2026-05-12T06-57-43-164Z`                                                                                                                                                                                                                                            | Incomplete                         |
| Market buy/reserve/cancel      | Runner buy/reserve passed             | Runner buy/reserve passed             | Partial                       | Live buy/reserve/deck reserve, affordable Joker color-selection with replay review, pending Joker recovery continuation, reserve-gold follow-up, and visible reserve cancel bridge routes exist; replay manifest now has verifier-enforced `joker-buy` oracle coverage; built-player Joker proof opens the visible market preview, buys through the visible preview primary action, selects visible color `red`, records ordered `initiate_buy_joker` and `buy_card`, and preserves hash `95c8a06c`; built-player reserve-cancel proof opens visible market reserve controls, enters `RESERVE_WAITING_GEM`, cancels through the visible control, and preserves hash `40bdddbf`; built-player deck-reserve cancel proof opens the visible deck preview, initiates deck reserve, cancels through the visible control before Gold selection, records `initiate_reserve_deck` and `cancel_reserve`, leaves deck/reserved/Gold state unchanged, and preserves hash `62fa027f`; plain market `BUY_CARD` wrong-actor, direct Joker bypass, wrong-actor Joker initiation/color-follow-up, Joker missing-pending/pending-mismatch/missing-color/reserved-source selection, reserve-card wrong-actor initiation/resolution, reserve-cancel wrong-actor, missing-Gold/non-Gold/pending-mismatch/full-row, and deck-reserve wrong-actor initiation/resolution plus empty-deck/missing-Gold/full-row commands reject without mutation; full edge/rejection coverage still missing                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Runner plus EditMode including `editmode-market-buy-wrong-actor-rejection-20260512-results.xml`, `editmode-joker-color-wrong-actor-rejection-20260512-results.xml`, `editmode-reserve-cancel-wrong-actor-rejection-20260512-results.xml`, and built-player proof      | Incomplete                         |
| Reserve deck                   | Partial preview only                  | Partial                               | Partial                       | Live deck preview and Gold follow-up route through the bridge; built-player reserve-deck proof opens a visible market deck preview, initiates through the visible preview reserve control, completes the Gold follow-up through a visible board target, records ordered `initiate_reserve_deck` and `reserve_deck`, and preserves hash `da89d9e5`; built-player deck-reserve cancel proof initiates the same visible deck reserve path then cancels before Gold selection and preserves hash `62fa027f`; empty-deck, missing-Gold, full-row, and wrong-actor initiation/resolution rejections have bridge plus live Unity proof; broader oracle/order fixtures remain missing                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | EditMode deck-reserve proof and built-player reserve-deck/cancel smokes `2026-05-12T13-59-30-560Z` / `2026-05-12T15-27-57-407Z`                                                                                                                                       | Incomplete                         |
| Reserved cards                 | Runner preview passed                 | Runner preview passed                 | Partial                       | Preview plus live reserved-buy and discard dispatch exist; replay manifest now has verifier-enforced `reserved-buy` oracle coverage; affordable reserved buy records/exports/reimports for replay review; the built Windows player reserved-discard release-path smoke reserves `c:125-gr#0`, opens the visible reserved preview, records `discard_reserved`, exports/imports/reviews the replay, and preserves hash `33909286`; the built Windows player reserved-buy release-path smoke reserves `c:155-bk#0`, opens the visible reserved preview, records reserved-source `buy_card`, exports/imports/reviews the replay, and preserves hash `47c0e9db`; unaffordable reserved-buy rejects without state/replay mutation; focused reserved-card wrong-actor proof rejects reserved-buy ownership-envelope and reserved discard without state/replay mutation; remaining release/edge and full rejection fixtures incomplete                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | EditMode reserved-card proofs including `editmode-reserved-card-wrong-actor-rejection-20260512-results.xml` and built-player reserved-card smokes `2026-05-12T11-39-09-986Z` / `2026-05-12T12-29-42-881Z`                                                             | Incomplete                         |
| Royal area                     | Runner royal selection passed         | Runner royal selection passed         | Partial                       | Fixture select and live bridge selection exist; focused royal phase-resolution proof records valid `SELECT_ROYAL_CARD`, moves `r91-ro` from the royal deck to P1, resolves to `IDLE`, hands turn to `p2`, and keeps the live replay summary hash aligned; replay verifier distinguishes next-player royal handoff from same-actor extra-turn; unavailable, wrong-actor, and wrong-phase selections reject without mutation; the 2026-05-12 built-player smoke reaches `SELECT_ROYAL` from a fresh LocalDev game and resolves it through `choose_royal`; broader recovery incomplete                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `2026-05-12T06-57-43-164Z`; `editmode-royal-phase-resolution-20260512-results.xml`; built-player smoke `2026-05-12T00-01-24-013Z`                                                                                                                                     | Incomplete                         |
| Privilege flow                 | Partial                               | Partial                               | Partial                       | Live privilege-scroll activation, use, and cancel route through bridge; `local-pvp-privilege` covers activation, cancel, and use in the golden oracle; activation no-charge/no-valid-board-target/wrong-actor, use no-charge/invalid-target/out-of-bounds/wrong-actor, and cancel wrong-actor commands reject without mutation; the 2026-05-12 built-player privilege smoke creates a normal rules-engine privilege opportunity from a fresh LocalDev launch, then resolves `activate_privilege` and `use_privilege`; the privilege-cancel release-path smoke enters `PRIVILEGE_ACTION`, cancels through the visible control, records `cancel_privilege`, and preserves review hash `efe66377`; focused privilege wrong-actor proofs reject `ACTIVATE_PRIVILEGE`, `USE_PRIVILEGE`, and `CANCEL_PRIVILEGE` with actor override `p2` without state/replay mutation; broader edge fixtures still missing                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | EditMode live privilege proof including `editmode-privilege-wrong-actor-rejection-20260512-results.xml` and `editmode-cancel-privilege-wrong-actor-rejection-20260512-results.xml` plus built-player smokes `2026-05-12T00-24-16-298Z` and `2026-05-12T10-51-01-649Z` | Incomplete                         |
| Active buff deck peek/modal    | Partial                               | Partial                               | Partial                       | Live deck peek opens a visible modal through the bridge and modal close records/reviews the cleared state; built-player peek-modal release-path proof starts fresh roguelike LocalDev, selects `intelligence`, records `select_buff`, `peek_deck`, and `close_modal`, and preserves review hash `8399eadd`; broader edge coverage remains incomplete                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | EditMode proof plus built-player smoke `2026-05-12T07-56-40-905Z`                                                                                                                                                                                                     | Incomplete                         |
| Replay import/export/review    | Partial reader only                   | Partial                               | Partial                       | Visible LocalDev import/export controls, Replay vNext JSON file round trip, hash preservation, undo/redo review navigation, baseline bridge-backed live command recording/export/import, affordable Joker and reserved-buy live recording/export/import, pending Joker recovery replay continuation, deck-peek modal recording/review, audited built-player replay release-path coverage with 9 retained mailbox responses and hash `f9eb9e83`, built-player recovery replay continuation hash `8d4178f7`, built-player replay-review release-path visible undo/redo navigation hash `db7fb1b7`, built-player draft reroll/select export/import/review hash `851b6356`, built-player peek-modal export/import/review hash `8399eadd`, built-player recovered invalid-action continuation/review hash `d2b51b3f`, built-player privilege-cancel export/import/review hash `efe66377`, built-player reserved-discard export/import/review hash `33909286`, and built-player reserved-buy export/import/review hash `47c0e9db` pass in evidence runs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | EditMode and built-player replay IO proof                                                                                                                                                                                                                             | Incomplete                         |
| Settings locale/theme/sound    | Runner settings scenarios passed      | Runner settings scenarios passed      | Partial                       | Local preferences persist and reload on a reopened controller; LAN opponent card and gem visibility preferences now have visible Unity settings controls and LocalDev persistence; built-player settings release-path proof saves and reloads locale `en`, surface theme `pearl-opaline`, sound off, and LAN opponent visibility preferences off without mutating gameplay hash or replay events; full release-path parity still pending                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | EditMode and built-player settings proof                                                                                                                                                                                                                              | Incomplete                         |
| LAN visibility toggles         | Partial                               | Partial                               | Partial                       | Unity settings panel exposes LAN opponent card and gem visibility toggles, persists both values, and reloads them on a reopened controller; built-player settings release-path proof covers the same persisted preference values; application to migrated LAN gameplay remains blocked until the LAN route exists                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | EditMode and built-player settings proof                                                                                                                                                                                                                              | Incomplete                         |
| LAN route                      | Missing                               | Missing                               | Missing                       | No Unity equivalent                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Missing                                                                                                                                                                                                                                                               | Blocked                            |
| Online route                   | Missing                               | Missing                               | Missing                       | No Unity equivalent                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Missing                                                                                                                                                                                                                                                               | Blocked                            |
| Restart/new game/recovery      | Runner restart scenario passed        | Runner restart scenario passed        | Not applicable                | Main-menu restart exists; LocalDev autosave restores bridge init, live state, pending Joker color selection, and live replay stream, then continues a command after close/reopen; built-player recovery smoke saves hash `208a752`, loads it in a fresh controller, continues to hash `8d4178f7`, and reviews the continued replay; built-player recovered invalid-action smoke saves and reloads hash `24a87497`, rejects `CANCEL_RESERVE`, `CLOSE_MODAL`, and inactive actor `TAKE_GEMS` without mutation or recording, then continues/reviews hash `d2b51b3f`; broader product recovery breadth remains incomplete                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Runner plus EditMode and built-player proof                                                                                                                                                                                                                           | Incomplete                         |
| Rulebook/chrome controls       | Runner chrome scenarios passed        | Runner chrome scenarios passed        | Partial                       | Rulebook/restart/settings targets exist; built-player chrome release-path proof opens and closes the rulebook without mutating gameplay hash or replay events, restarts to the shell, starts another fresh LocalDev game through the bridge, and records one live command after restart                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `2026-05-12T06-57-43-164Z`; built-player chrome proof `2026-05-12T03-13-11-728Z`                                                                                                                                                                                      | Incomplete                         |
| Visual Lab routes              | Excluded from Local PVP scope         | Excluded from Local PVP scope         | Excluded from Local PVP scope | No Unity equivalent is required for the declared Local PVP completion scope. Visual Lab remains a user-approved exclusion rather than an active Local PVP blocker.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Exclusion recorded in 2026-05-14 product-surface report                                                                                                                                                                                                               | Excluded from Local PVP scope      |
| Error/rejection states         | Runner invalid-action scenario passed | Runner invalid-action scenario passed | Not applicable                | Invalid semantic action, bridge no-replay-state-change rejection, wrong-actor market buy, direct Joker bypass, wrong-actor Joker initiation/color-follow-up, wrong-actor reserve initiation/resolution, wrong-actor deck-reserve initiation/resolution, wrong-actor reserved-buy ownership-envelope, wrong-actor reserved discard, wrong-actor privilege activation/use/cancel, Joker missing-pending/pending-mismatch/missing-color/reserved-source selection, take-gems empty/gold/gap/no-take-3/out-of-bounds/wrong-phase, replenish empty-bag/wrong-phase/post-game, bonus wrong-color/empty/out-of-bounds/wrong-phase, discard not-owned/wrong-phase, steal gold/not-owned/wrong-phase, draft buff unavailable/wrong-phase, stale-pool P2 draft select before P1 locks a buff, royal unavailable/wrong-phase, reserve-card missing-Gold/non-Gold/out-of-bounds/pending-mismatch/full-row, deck-reserve empty-deck/missing-Gold/non-Gold/out-of-bounds/full-row, cancel-reserve no-pending, discard-reserved ability/not-owned/wrong-phase, privilege activation no-charge/no-target, privilege use no-charge/invalid-target/out-of-bounds, wrong-phase draft-reroll/privilege-cancel/reserve-cancel, no-ability peek, wrong-phase peek, no-modal close, and blocked-modal close rejection proofs exist; the TypeScript oracle verifies 65 hash-locked wrong-phase, resource, ownership, mismatch, follow-up, modal, coordinate-boundary, end-state, and derived-state rejection cases in `rejection-manifest.json`; Unity EditMode now replays all 65 through the live bridge with unchanged state hashes and live recording counts, including no-take-3 hash `8e546f4c`, coordinate-boundary hashes `e1b5e1bf`, `329600a9`, `fd6d5832`, `6173696c`, and `d8141986`, game-over action-after-winner hash `4b6ab7ec`, Joker missing-color hash `d0a0e459`, and Joker reserved-source hash `b5d9cbbf`; focused market-buy, Joker, reserve, deck-reserve, reserved-card, and privilege wrong-actor bridge proofs `editmode-market-buy-wrong-actor-rejection-20260512-results.xml`, `editmode-joker-wrong-actor-rejection-20260512-results.xml`, `editmode-joker-color-wrong-actor-rejection-20260512-results.xml`, `editmode-reserve-wrong-actor-rejection-20260512-results.xml`, `editmode-deck-reserve-wrong-actor-rejection-20260512-results.xml`, `editmode-reserved-card-wrong-actor-rejection-20260512-results.xml`, `editmode-privilege-wrong-actor-rejection-20260512-results.xml`, and `editmode-cancel-privilege-wrong-actor-rejection-20260512-results.xml` pass without state/replay mutation; built-player invalid-action release-path smoke rejects six representative live commands without mutation or recording; built-player recovered invalid-action smoke rejects three representative commands after recovery without mutation or recording; broader online edge matrix missing | Bridge, EditMode, oracle, and built-player invalid-action proof                                                                                                                                                                                                       | Incomplete                         |

## Required Command Parity

| Command class            | Electron oracle                              | Unity status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Status     |
| ------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Bootstrap/fresh game     | `buildStartGameAction`, `INIT`, `INIT_DRAFT` | Visible Local PvP start, semantic default start, and semantic roguelike draft start use TypeScript bridge; EditMode has three seeded product-surface game-over proofs and the Windows player now has three deterministic fresh LocalDev game-over proofs plus one fresh roguelike draft reroll/select proof; broad arbitrary game-to-game-over coverage remains incomplete                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Incomplete |
| Gameplay mutation        | `applyAction` in `packages/shared`           | Live `TAKE_GEMS`, `REPLENISH`, market/reserved buy, reserved discard, Joker initiate/color follow-up, market/deck reserve with Gold follow-up, reserve-gold/cancel, bonus and steal phase resolution, repeated discard until phase resolution, royal, privilege activation/use, deck peek/modal close, draft reroll, and draft select routes exist; full surface/rejection coverage remains incomplete                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Incomplete |
| Illegal command recovery | `getActionRejectionReason`, command gate     | Bridge invalid-actor proof, no-replay-state-change rejection proof, wrong-actor market buy proof, direct Joker bypass proof, wrong-actor Joker initiation/color-follow-up proof, wrong-actor reserve initiation/resolution proof, wrong-actor deck-reserve initiation/resolution proof, wrong-actor reserved-buy ownership-envelope proof, wrong-actor reserved discard proof, wrong-actor privilege activation/use/cancel proof, Joker missing-pending/pending-mismatch/missing-color/reserved-source proof, unaffordable reserved-buy no-replay-state-change proof, take-gems empty/gold/gap/no-take-3/out-of-bounds/wrong-phase, replenish empty-bag/wrong-phase/post-game, bonus wrong-color/empty/out-of-bounds/wrong-phase, discard not-owned/wrong-phase, steal gold/not-owned/wrong-phase, draft buff unavailable/wrong-phase, stale-pool P2 draft select before P1 locks a buff, royal unavailable/wrong-phase, reserve-card missing-Gold/non-Gold/out-of-bounds/pending-mismatch/full-row, deck-reserve empty-deck/missing-Gold/non-Gold/out-of-bounds/full-row, cancel-reserve no-pending, discard-reserved ability/not-owned/wrong-phase, privilege activation no-charge/no-target, privilege use no-charge/invalid-target/out-of-bounds, wrong-phase draft reroll, privilege-cancel, reserve-cancel, no-ability peek, wrong-phase peek, no-modal close, and blocked-modal close rejection proofs, plus partial invalid semantic action; the full 65-case committed rejection manifest now has Unity no-mutation/no-recording proof through the live bridge, the built Windows player has a six-case invalid-action release-path no-mutation/no-recording proof, and recovered built-player state rejects three invalid commands without state/replay mutation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Incomplete |
| Deterministic hash       | `generateReplayStateHash`                    | Unity fixture hashes exist for committed fixtures; live replay hashes are preserved in the bounded product-surface matrix, release-path replay recovery tests, and the built-player mailbox smoke final hashes `7d3f696c`, `5c804aa7`, `9704183f`, `94560a25`, `cecbc068`, `9e3b6f7c`, `d6dbea7a`, `411262df`, `5f3bf567`, `6b43d0c6`, `8668e7ab`, `e3a47e84`, `e5374467`, `851b6356`, `3f7290e`, replay-review final hash `db7fb1b7`, invalid-action no-mutation hash `1a6afd3f`, peek-modal final hash `8399eadd`, recovered invalid-action unchanged hash `24a87497`, recovered continuation hash `d2b51b3f`, privilege-cancel final hash `efe66377`, reserved-discard final hash `33909286`, reserved-buy final hash `47c0e9db`, reserve-cancel final hash `40bdddbf`, reserve-deck final hash `da89d9e5`, Joker release-path final hash `95c8a06c`, deck-reserve cancel final hash `62fa027f`, recovery continuation hash `8d4178f7`, and chrome restart hash `5304b037`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Incomplete |
| Replay round trip        | Replay reader/writer/audit                   | Unity imports and exports Replay vNext JSON through visible LocalDev controls with deterministic hash preservation, review undo/redo, baseline bridge-backed live command recording/export/import, affordable Joker and reserved-buy live recording/export/import, pending Joker recovery replay continuation, deck-peek modal recording/review, three seeded fresh product-surface game-to-game-over export/import/review proofs, a five-scenario bounded product-surface matrix, 65-case invalid-action no-recording manifest proof including stale-pool P2 draft select hash `5c903209`, no-take-3 hash `8e546f4c`, coordinate-boundary hashes `e1b5e1bf`, `329600a9`, `fd6d5832`, `6173696c`, and `d8141986`, game-over action-after-winner hash `4b6ab7ec`, Joker missing-color hash `d0a0e459`, and Joker reserved-source hash `b5d9cbbf`, release-path invalid JSON/version/missing/malformed-bootstrap/malformed-draft-bootstrap/corrupt/hash-mismatch/overwrite recovery checks in EditMode, built-player mailbox-smoke export/import/review hash preservation, built-player replay release-path proof for `invalid_json`, `missing_file`, `unsupported_schema`, `malformed_bootstrap`, `malformed_draft_bootstrap`, `corrupted_summary`, `hash_mismatch`, `failed_overwrite_load`, and `valid_overwrite_reload_review`, three built-player fresh LocalDev game-over replay export/import/review proofs, built-player recovery save/load/continue export/review proof, built-player replay-review visible undo/redo navigation proof, built-player draft reroll/select export/import/review proof, built-player invalid-action zero-event export/review proof, built-player peek-modal export/import/review proof, built-player recovered invalid-action continuation export/review proof, built-player privilege-cancel export/import/review proof, built-player reserved-discard export/import/review proof, built-player reserved-buy export/import/review proof, built-player reserve-cancel export/import/review proof, built-player reserve-deck export/import/review proof, built-player Joker export/import/review proof, and built-player deck-reserve cancel export/import/review proof; broader release-runtime packaging and product-surface breadth remain incomplete | Incomplete |

## Latest Runner Result

`pnpm parity:electron-unity` was refreshed on 2026-05-13 UTC from the current tree. The shell
wrapper reached its 600-second timeout before returning, but the child runner process completed and
wrote `artifacts/electron-unity-parity/2026-05-13T00-04-32-249Z/`. Direct inspection of
`runner-summary.json` and `parity-matrix.json` found 54 configured rows, all with status
`Equivalent`, across `1920x1080` and `1366x768`. The previous direct command-pass artifact
`artifacts/electron-unity-parity/2026-05-12T08-18-40-709Z/` remains retained evidence.

This is evidence for the configured runner scenarios only. The full migration remains `Incomplete`
because the runner still exercises fixture revisions for most gameplay states and does not prove a
fresh arbitrary local PvP match from game start to game over through the Unity product UI. Separate
Unity EditMode evidence now proves three seeded fresh product-surface matches and a five-scenario
bounded product-surface matrix, but not broad arbitrary player-driven coverage. The reserve-card
rows now use replay revision 44 and pass at both required viewports.

The strongest retained built-player aggregate before the winner guard was
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-game-over-release-path.json`.
It revalidates the retained 27-report LocalDev Windows-player smoke set with all 21 required action
families, every current release-path proof flag, and `--require-game-over-count 3`. It passed with
27/27 reports, 716 commands, 812 mailbox events, 3 game-over reports, winners `p1` and `p2`, no
missing required families, and one report for each required release-path proof family. This remains
`incomplete-evidence` and does not prove broad arbitrary Local PvP or final release-runtime
packaging.

The current strongest retained built-player aggregate is
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-log-path-guard.json`.
It revalidates the same 27 reports with all 21 required action families, every current release-path
proof flag, `--require-report-count 27`, `--require-unique-report-paths`,
`--require-unique-smoke-report-paths`, `--require-unique-log-paths`,
`--require-game-over-count 3`, and `--require-game-over-winner p1,p2`. It passes with 27/27
reports, 716 commands, 812 mailbox events, 3 game-over reports, winners `p1` and `p2`, no missing
required families, no missing required winners, no duplicate launcher/nested smoke-report/log paths,
replay-release coverage for invalid JSON, missing file, unsupported schema, malformed bootstrap,
malformed draft bootstrap, corrupted summary, hash mismatch, failed overwrite load, and valid
overwrite/reload/review, plus one report for each current release-path proof family. This remains
`incomplete-evidence`.

The latest audited product-surface breadth sample is
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-breadth.json`. It
validates one fresh built Windows player LocalDev run with 24 live commands, 25 audited successful
mailbox responses, required families `take_gems`, `buy_card`, `take_bonus_gem`, `discard_gem`, and
`replenish`, no fixture gameplay driver, no checkpoint replacement, replay export/import/review,
and final hash `f934c91b`. This is bounded audited breadth evidence only and does not change the
matrix status.

The latest audited preference samples are summarized in
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-preferences.json`.
It validates fresh `reserve-first` and `privilege-first` built-player runs with 36 total live
commands, 38 audited successful mailbox responses, required families `reserve_card`,
`cancel_gem_selection`, `activate_privilege`, `use_privilege`, `take_gems`, and `discard_gem`, replay
export/import/review preservation, and final hashes `38d97b7f` and `62b67ebe`. This remains bounded
LocalDev evidence and does not change the matrix status.

The combined audited mailbox aggregate is
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined.json`. It
validates the audited mailbox success, rejection, balanced breadth, reserve-first, and
privilege-first launcher reports together with audited mailbox responses and invalid-action
release-path proof required. It passes with 5/5 reports, 62 commands, 74 mailbox events, 74 audited
mailbox responses, 68 successful responses, the covered action families required, final hashes
`38d97b7f`, `3b479090`, `62b67ebe`, `ec648e6c`, and `f934c91b`, invalid-action hash `f2780c3f`,
and status `incomplete-evidence`. This is an auditability improvement for the audited subset only.

The audited game-over aggregate is
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over.json`. It
validates one fresh built Windows player game-over run with audited mailbox responses required. It
passes with 1/1 reports, 98 live commands, 99 mailbox events, 99 audited successful mailbox
responses, winner `p1`, required families `buy_card`, `choose_royal`, `discard_gem`, `replenish`,
`select_joker_color`, `steal_gem`, `take_bonus_gem`, and `take_gems`, final/review hash
`d6dbea7a`, and status `incomplete-evidence`. This closes an auditability gap in the audited subset
only and does not change the matrix status.

The audited game-over winner-breadth aggregate is
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over-winner-breadth.json`.
It validates the existing audited `p1` game-over report plus two fresh audited `p2` game-over
reports, all with audited mailbox responses required. It passes with 3/3 reports, 288 live
commands, 291 audited successful mailbox responses, winners `p1` and `p2`, the same eight required
game-over action families, final/review hashes `d6dbea7a`, `411262df`, and `5f3bf567`, and status
`incomplete-evidence`. This improves winner breadth in the audited subset only and does not change
the matrix status.

The stricter audited-subset cross-check is
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-breadth.json`.
It combines eight audited launcher reports and requires audited mailbox responses, invalid-action
release-path proof, and at least three game-over reports in the same matrix. It passes with 8/8
reports, 350 live commands, 365 audited mailbox responses, 359 successful responses, one
invalid-action release-path report, three game-over reports, winners `p1` and `p2`, game-over hashes
`d6dbea7a`, `411262df`, and `5f3bf567`, invalid-action hash `f2780c3f`, twelve observed action
families, and status `incomplete-evidence`.

The latest winner-guarded audited game-over aggregate is
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over-winner-guard.json`.
It requires audited mailbox responses, at least three game-over reports, and
`--require-game-over-winner p1,p2`. It passes with 3/3 reports, 288 live commands, 291 audited
successful mailbox responses, winners `p1` and `p2`, and game-over hashes `d6dbea7a`, `411262df`,
and `5f3bf567`. The p2-only negative check failed closed with
`Required built-player game-over winner was not covered: p1`.

The latest winner-guarded audited-subset cross-check is
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-guard.json`.
It requires audited mailbox responses, invalid-action release-path proof, at least three game-over
reports, required winners `p1,p2`, and the twelve observed action families. It passes with 8/8
reports, 350 live commands, 365 audited mailbox responses, 359 successful responses, one
invalid-action release-path report, three game-over reports, winners `p1` and `p2`, and status
`incomplete-evidence`. This hardens the audited subset only and does not change the matrix status.

The audited replay release-path aggregate is
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path.json`.
It requires audited mailbox responses and replay release-path coverage. It passes with 1/1 fresh
built-player report, 8 live commands, 9 audited successful mailbox responses, coverage for invalid
JSON, missing file, unsupported schema, malformed bootstrap, malformed draft bootstrap, corrupted
summary, hash mismatch, failed overwrite load, valid overwrite/reload/review, final/review hash
`f9eb9e83`, and status `incomplete-evidence`. This hardens replay release-path auditability only
and does not change the matrix status.

## 2026-05-11 Continuation Evidence

- Built Windows player proof now passes for bounded LocalDev mailbox smoke paths. The reports
  `artifacts/unity/built-player-smoke/smoke-2026-05-11T22-24-33-783Z.launcher.json`,
  `artifacts/unity/built-player-smoke/smoke-2026-05-11T23-32-01-688Z.launcher.json`, and
  `artifacts/unity/built-player-smoke/smoke-2026-05-11T23-34-28-626Z.launcher.json` start the
  executable, enter fresh Local PvP through the documented automation entrypoint, service mailbox
  bridge requests through the existing TypeScript bridge, apply real commands, record live replay
  events, export/import/review the replay, cover `take_gems`, `buy_card`, `click_board_cell`,
  `discard_gem`, `replenish`, `reserve_card`, `select_joker_color`, and `cancel_gem_selection`, and
  preserve final hashes `7d3f696c`, `5c804aa7`, `95c8a06c`, and `9704183f`. The aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260511.json` validates all four
  reports together with 64 commands, 68 mailbox events, one built-player replay release-path report,
  and status `incomplete-evidence`. This is not broad arbitrary product-surface coverage or a final
  release-runtime packaging decision.
- A 2026-05-12 built-player follow-up,
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json`, passed with
  80 live bridge-backed commands, `choose_royal`, `steal_gem`, bonus-phase `click_board_cell`,
  replay export/import/review, and final hash `94560a25`. The refreshed aggregate
  was later expanded by
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json`, which passed
  with explicit `take_bonus_gem` family labeling, replay export/import/review, and final hash
  `cecbc068`. A privilege-focused smoke,
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T00-24-16-298Z.launcher.json`, then passed
  with 3 live bridge-backed commands, `take_gems`, `activate_privilege`, `use_privilege`, replay
  export/import/review, and final hash `9e3b6f7c`. Game-over depth smokes,
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T00-52-54-303Z.launcher.json`,
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T01-01-37-234Z.launcher.json`, and
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T01-04-20-176Z.launcher.json`, then passed
  with 98, 98, and 92 live bridge-backed commands; winners `p1`, `p2`, and `p2`; replay
  export/import/review; and final hashes `d6dbea7a`, `411262df`, and `5f3bf567`.
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json` validates 7/7
  reports after the privilege step, 10/10 reports after the game-over step, 11/11 reports after the
  recovery release-path step, 12/12 reports after the settings release-path step, and 13/13 reports
  after the chrome release-path step. The replay-review follow-up
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T03-32-18-999Z.launcher.json` then passed
  with a live four-event export, separate review-controller import, visible redo/undo navigation,
  restored first-redo hash `de4507f0`, final hash `db7fb1b7`, and unchanged source live hash plus
  source live replay event count. The final aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-replay-review.json`
  records 14/14 reports, 525 commands, 552 mailbox events, thirteen required action families, one
  replay release-path report, one recovery release-path report, one settings release-path report,
  one chrome release-path report, one replay-review release-path report, product hash `e3a47e84`,
  recovery continuation hash `8d4178f7`, settings path
  `artifacts/unity/settings/gemduel.preferences.v1.json`, chrome restart hash `5304b037`,
  replay-review final hash `db7fb1b7`, and status `incomplete-evidence`. A later
  malformed-draft-bootstrap release-path refresh replaced the older replay release-path report with
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T05-16-44-409Z.launcher.json` and wrote
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-malformed-draft-bootstrap.json`;
  it still validates 14/14 reports, 525 commands, 552 mailbox events, and now records
  `malformed_bootstrap` and `malformed_draft_bootstrap` in replay release-path coverage while
  preserving hash `e5374467`.
  The draft release-path follow-up adds
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T05-44-04-969Z.launcher.json`, which starts a
  fresh roguelike LocalDev draft in the built Windows player, rerolls and selects for both players,
  records eight live replay events, exports/imports/reviews the replay, and preserves hash
  `851b6356`. The draft-only aggregate before the invalid-action follow-up
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-draft-release-path.json`
  validates 15/15 reports, 533 commands, 561 mailbox events, and action families including
  `choose_boon` and `reroll_draft_pool`.
  After the LocalDev no-take-3 smoke-driver fix, the rebuilt-player targeted draft report
  `artifacts/unity/built-player-smoke/smoke-2026-05-12Tpost-notake3-draft.launcher.json` passed
  with exit code 0. It reuses seed `unity-product-surface-draft-release-path-20260512`, starts
  `WindowsPlayer` in roguelike mode, rerolls and selects both draft players, records two legal
  `take_gems` actions after draft, exports/imports/reviews six live Replay vNext events, and
  preserves final hash `857c3e58`. The paired aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-post-notake3-draft.json`
  validates 1/1 report, six commands, seven mailbox events, and status `incomplete-evidence`.
- Built-player invalid-action release-path:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T06-34-40-146Z.launcher.json` passed with exit
  code 0 and no timeout. Its nested invalid-action report rejects `SELECT_BUFF`,
  `REROLL_DRAFT_POOL`, empty `TAKE_GEMS`, `CANCEL_RESERVE`, `CLOSE_MODAL`, and inactive actor
  `TAKE_GEMS` through the live bridge, preserves hash `1a6afd3f`, records zero live events, exports a
  zero-event replay, and reviews it back to hash `1a6afd3f`. The invalid-action aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-invalid-action-release-path.json`
  validates 16/16 reports, 541 commands, 577 mailbox events, and one invalid-action release-path
  report.
- Built-player peek-modal release-path:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T07-56-40-905Z.launcher.json` passed with exit
  code 0 and no timeout. Its nested peek-modal report starts a fresh roguelike LocalDev game,
  selects `intelligence`, opens and closes the visible peek modal, records `select_buff`,
  `peek_deck`, and `close_modal`, exports/imports/reviews the live replay, and preserves hash
  `8399eadd`. The peek-modal aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-peek-modal-release-path.json`
  validates 17/17 reports, 545 commands, 587 mailbox events, and one peek-modal release-path
  report.
- Built-player recovery invalid-action release-path:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T09-33-52-882Z.launcher.json` passed with exit
  code 0 and no timeout. Its nested recovery invalid-action report saves and reloads hash
  `24a87497`, rejects `CANCEL_RESERVE`, `CLOSE_MODAL`, and inactive actor `TAKE_GEMS` through the
  live bridge without mutation or recording, continues a valid `take_gems`, and reviews hash
  `d2b51b3f`. The recovery invalid-action aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-recovery-invalid-action-release-path.json`
  validates 18/18 reports, 547 commands, 596 mailbox events, and one recovery invalid-action
  release-path report.
- Product-surface Local PvP matrix:
  `artifacts/unity/product-surface-local-pvp-matrix-20260511.json` covers five deterministic fresh
  starts with live replay recording, export/import/review hash preservation, and no fixture gameplay
  driver or checkpoint replacement. It covers `buy_card`, `cancel_gem_selection`, `discard_gem`,
  `replenish`, `reserve_card`, and `take_gems` action families and is intentionally marked
  `incomplete-evidence`.
- Replay release-path recovery:
  `clients/unity/artifacts/unity/editmode-replay-release-path-20260511-results.xml` passed invalid
  JSON, unsupported schema version, missing file, corrupted summary, hash mismatch, overwrite/reload,
  and clean recovery checks without mutating live gameplay state.
- Built-player replay release-path recovery:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T05-16-44-409Z.launcher.json` passed invalid
  JSON, missing file, unsupported schema, malformed bootstrap, malformed draft bootstrap, corrupted
  summary, final hash mismatch, failed overwrite load, and valid overwrite/reload/review checks
  inside the Windows player, preserving hash `e5374467`.
- Built-player recovery release-path:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T01-20-54-336Z.launcher.json` passed with exit
  code 0 and no timeout. It starts a fresh LocalDev game, persists recovery after one live command at
  hash `208a752`, loads recovery in a fresh controller, continues another live bridge-backed command
  to hash `8d4178f7`, and exports/reviews the continued live replay.
- Built-player settings release-path:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T02-00-40-648Z.launcher.json` passed with exit
  code 0 and no timeout. It starts a fresh LocalDev game, saves locale `en`, surface theme
  `pearl-opaline`, sound off, and LAN opponent visibility preferences off through visible settings
  controls, reloads them in a fresh live-game controller, and preserves gameplay hashes plus zero
  live replay events for the settings path.
- Built-player chrome release-path:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T03-13-11-728Z.launcher.json` passed with exit
  code 0 and no timeout. It starts a fresh LocalDev game, opens and closes the rulebook without
  changing hash `8fa33a3f` or replay event count, restarts to the shell, starts another fresh
  LocalDev game through the bridge, applies one live `take_gems` command, and records restarted
  command hash `5304b037`.
- Earlier Unity EditMode after recovery invalid-action:
  `clients/unity/artifacts/unity/editmode-recovery-invalid-action-release-path-full-20260512-results.xml`
  reported 76/76 passed after the recovery invalid-action release-path smoke update.
- Built-player privilege-cancel release-path:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T10-51-01-649Z.launcher.json` passed with exit
  code 0 and no timeout. Its nested privilege-cancel report starts a fresh LocalDev game, records
  `take_gems`, `activate_privilege`, and `cancel_privilege`, enters `PRIVILEGE_ACTION`, cancels back
  to `IDLE`, exports/imports/reviews the replay, and preserves hash `efe66377`. That aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-privilege-cancel-release-path.json`
  validates 19/19 reports, 550 commands, 604 mailbox events, and one privilege-cancel release-path
  report while keeping status `incomplete-evidence`.
- Built-player reserved-discard release-path:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T11-39-09-986Z.launcher.json` passed with exit
  code 0 and no timeout. Its nested reserved-discard report starts a fresh roguelike LocalDev game,
  selects `puppet_master`, reserves `c:125-gr#0`, opens the visible reserved-card preview, records
  `select_buff`, `initiate_reserve`, `reserve_card`, `take_gems`, and `discard_reserved`,
  exports/imports/reviews the replay, and preserves hash `33909286`. That aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserved-discard-release-path.json`
  validates 20/20 reports, 556 commands, 618 mailbox events, and one reserved-discard release-path
  report while keeping status `incomplete-evidence`.
- Built-player reserved-buy release-path:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T12-29-42-881Z.launcher.json` passed with exit
  code 0 and no timeout. Its nested reserved-buy report starts a fresh LocalDev game, reserves
  `c:155-bk#0`, opens the visible reserved-card preview, buys through the visible preview primary
  action, records ordered `reserve_card` then reserved-source `buy_card`, exports/imports/reviews
  the replay, and preserves hash `47c0e9db`. That aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserved-buy-release-path.json`
  validates 21/21 reports, 562 commands, 634 mailbox events, and one reserved-buy release-path
  report while keeping status `incomplete-evidence`.
- Built-player reserve-cancel release-path:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T13-21-32-993Z.launcher.json` passed with
  exit code 0 and no timeout. Its nested reserve-cancel report starts a fresh LocalDev game, opens
  visible market reserve controls, enters `RESERVE_WAITING_GEM`, cancels through the visible
  control, records ordered `initiate_reserve` and `cancel_reserve`, exports/imports/reviews the
  replay, and preserves hash `40bdddbf`. That aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-cancel-release-path.json`
  validates 22/22 reports, 568 commands, 644 mailbox events, and one reserve-cancel release-path
  report while keeping status `incomplete-evidence`.
- Built-player reserve-deck release-path:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T13-59-30-560Z.launcher.json` passed with
  exit code 0 and no timeout. Its nested reserve-deck report starts a fresh LocalDev game, opens a
  visible market deck preview, initiates deck reserve through the visible preview reserve control,
  completes the Gold follow-up through a visible board target, records ordered
  `initiate_reserve_deck` and `reserve_deck`, exports/imports/reviews the replay, and preserves hash
  `da89d9e5`. That aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-deck-release-path.json`
  validates 23/23 reports, 574 commands, 654 mailbox events, and one reserve-deck release-path report
  while keeping status `incomplete-evidence`.
- Built-player Joker release-path:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T14-52-59-171Z.launcher.json` passed with
  exit code 0 and no timeout. Its nested Joker report starts a fresh LocalDev game, drives live setup
  until visible Joker `c:174-jo#0` is affordable, opens the visible market preview, buys through the
  visible preview primary action, selects visible color `red`, records ordered `initiate_buy_joker`
  and `buy_card`, exports/imports/reviews the replay, and preserves hash `95c8a06c`. The Joker
  aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-joker-release-path.json`
  validates 24/24 reports, 582 commands, 672 mailbox events, and one Joker release-path report while
  keeping status `incomplete-evidence`.
- Built-player deck-reserve cancel release-path:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T15-27-57-407Z.launcher.json` passed with
  exit code 0 and no timeout. Its nested deck-reserve cancel report starts a fresh LocalDev game,
  opens a visible market deck preview, initiates deck reserve through the visible preview reserve
  control, cancels through the visible cancel control before selecting Gold, records ordered
  `initiate_reserve_deck` and `cancel_reserve`, leaves deck, reserved-card, and Gold-cell state
  unchanged, exports/imports/reviews the replay, and preserves hash `62fa027f`. The latest aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-deck-cancel-release-path.json`
  validates 25/25 reports, 590 commands, 684 mailbox events, and one deck-reserve cancel release-path
  report while keeping status `incomplete-evidence`.
- Built-player all-release-path guard audit:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-all-release-paths-audit.json`
  revalidates the same 25 launcher reports with all currently available release-path requirement
  flags enabled, including the replay release-path coverage gate. It passes with 590 commands, 684
  mailbox events, every required release-path report count present, and status
  `incomplete-evidence`.
- Built-player resource-first breadth:
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T20-12-00-000Z.resource-first.launcher.json`
  starts a fresh classic LocalDev game from the built Windows player with `resource-first`
  preference, records 120 live `take_gems`, `discard_gem`, and `replenish` commands,
  exports/imports/reviews the 120-event replay, and preserves final hash `7669d935`. The refreshed
  aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-resource-first-breadth.json`
  validates 26/26 reports, 710 commands, 805 mailbox events, all currently observed action
  families, every available release-path requirement flag, and status `incomplete-evidence`.
- Built-player post-no-take-3 combined aggregate:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-post-notake3-combined.json`
  revalidates the prior 26-report curated aggregate plus the rebuilt-player draft launcher with
  every required action family and every current release-path requirement flag enabled. It validates
  27/27 reports, 716 commands, 812 mailbox events, all 21 required action families, replay
  release-path coverage for invalid/corrupt/hash-mismatch/overwrite cases, final hash `857c3e58`,
  and status `incomplete-evidence`.
- Strict built-player aggregate:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-game-over-release-path.json`
  revalidates the same 27-report built-player smoke set with all 21 required action families,
  every current release-path proof flag, and `--require-game-over-count 3`. It validates 27/27
  reports, 716 commands, 812 mailbox events, 3 game-over reports, winners `p1` and `p2`, game-over
  hashes `d6dbea7a`, `411262df`, and `5f3bf567`, no missing required families, and one report for
  each required release-path proof family while retaining status `incomplete-evidence`.
- Strict built-player winner-release aggregate:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-game-over-winner-release-path.json`
  revalidates the same 27-report built-player smoke set with all 21 required action families,
  every current release-path proof flag, `--require-game-over-count 3`, and
  `--require-game-over-winner p1,p2`. It validates 27/27 reports, 716 commands, 812 mailbox events,
  3 game-over reports, winners `p1` and `p2`, no missing required families, no missing required
  winners, and one report for each required release-path proof family while retaining status
  `incomplete-evidence`.
- Strict built-player report-count aggregate:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-report-count-guard.json`
  revalidates the same winner-release set with explicit `--require-report-count 27` in addition to
  the 21 required action families, every current release-path proof flag,
  `--require-game-over-count 3`, and `--require-game-over-winner p1,p2`. It validates 27/27
  reports, 716 commands, 812 mailbox events, 3 game-over reports, winners `p1` and `p2`,
  `requiredReportCount: 27`, no failures, and one report for each required release-path proof family
  while retaining status `incomplete-evidence`.
- Strict built-player unique-report-path aggregate:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-report-path-guard.json`
  revalidates the same report-count set with explicit `--require-unique-report-paths`. It validates
  27/27 reports, 716 commands, 812 mailbox events, 3 game-over reports, winners `p1` and `p2`,
  `requiredReportCount: 27`, `requireUniqueReportPaths: true`, an empty `duplicateReportPaths`
  list, no failures, and one report for each required release-path proof family while retaining
  status `incomplete-evidence`.
- Strict built-player unique-nested-smoke-report aggregate:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-nested-smoke-report-guard.json`
  revalidates the same unique-report-path set with explicit `--require-unique-smoke-report-paths`.
  It validates 27/27 reports, 716 commands, 812 mailbox events, 3 game-over reports, winners `p1`
  and `p2`, `requiredReportCount: 27`, `requireUniqueReportPaths: true`, an empty
  `duplicateReportPaths` list, `requireUniqueSmokeReportPaths: true`, an empty
  `duplicateSmokeReportPaths` list, no failures, and one report for each required release-path proof
  family while retaining status `incomplete-evidence`.
- Strict built-player unique-log-path aggregate:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-log-path-guard.json`
  revalidates the same unique nested smoke-report set with explicit `--require-unique-log-paths`.
  It validates 27/27 reports, 716 commands, 812 mailbox events, 3 game-over reports, winners `p1`
  and `p2`, `requiredReportCount: 27`, `requireUniqueReportPaths: true`, an empty
  `duplicateReportPaths` list, `requireUniqueSmokeReportPaths: true`, an empty
  `duplicateSmokeReportPaths` list, `requireUniqueLogPaths: true`, empty
  `duplicateStdoutLogPaths`, `duplicateStderrLogPaths`, and `duplicatePlayerLogPaths` lists, no
  failures, and one report for each required release-path proof family while retaining status
  `incomplete-evidence`.
- File-backed audited mailbox aggregate:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now resolves retained mailbox
  `auditResponse` paths and verifies the response JSON matches launcher event summaries under
  `--require-audited-mailbox-responses`. The replay release-path file-backed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-filebacked.json`
  passes with 9/9 valid audit response files and hash `f9eb9e83`; the combined audited
  game-over/invalid-action file-backed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-filebacked.json`
  passes with 365/365 valid audit response files, one invalid-action release-path report, three
  game-over reports, winners `p1` and `p2`, and status `incomplete-evidence`.
- Strict audited built-player unique-path aggregate:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-strict-unique-paths.json`
  revalidates the same eight file-backed audited launcher reports with
  `--require-audited-mailbox-responses`, `--require-report-count 8`,
  `--require-unique-report-paths`, `--require-unique-smoke-report-paths`,
  `--require-unique-log-paths`, one invalid-action release-path report, at least three game-over
  reports, and winners `p1`/`p2` required. It passes with 8/8 reports, 350 commands, 365 mailbox
  events, 365/365 valid audit response files, 359 successful responses, twelve required audited
  action families, empty duplicate launcher/nested-smoke/stdout/stderr/player-log path lists, no
  failures, and status `incomplete-evidence`. This is the strongest audited-mailbox subset, while
  the strict unique-log-path 27-report aggregate remains the strongest all-release-path retained
  set.
- Audited replay plus game-over strict aggregate:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-strict-unique-paths.json`
  combines the audited replay release-path report with the eight audited game-over/invalid-action
  strict unique-path reports. It passes with 9/9 reports, 358 commands, 374 mailbox events, 374/374
  valid audit response files, 368 successful responses, twelve required audited action families,
  one replay release-path report, one invalid-action release-path report, three game-over reports,
  winners `p1`/`p2`, full replay release-path coverage for invalid/missing/unsupported/malformed/
  corrupt/hash-mismatch/overwrite/review cases, empty duplicate launcher/nested-smoke/stdout/
  stderr/player-log path lists, no failures, and status `incomplete-evidence`.
- Built-player executable path guard:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless the retained
  launcher report's executable exists under `artifacts/unity/build/windows/`. The executable-guard
  replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-exe-guard.json`
  passes with 1/1 report, 9/9 valid audit response files, and hash `f9eb9e83`; the combined
  executable-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-exe-guard.json`
  passes with 8/8 reports, 365/365 valid audit response files, three game-over reports, winners
  `p1`/`p2`, and status `incomplete-evidence`.
- Built-player stdout capture guard:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless the retained
  launcher report's stdout capture exists and is non-empty. The stdout-guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stdout-guard.json`
  passes with 1/1 report, 9/9 valid audit response files, and hash `f9eb9e83`; the combined
  stdout-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stdout-guard.json`
  passes with 8/8 reports, 365/365 valid audit response files, three game-over reports, winners
  `p1`/`p2`, and status `incomplete-evidence`.
- Built-player stdout byte guard:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless the retained
  stdout capture exists, is non-empty, and matches the launcher-reported byte count. The
  stdout-byte-guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stdout-byte-guard.json`
  passes with 1/1 report, 9/9 valid audit response files, and hash `f9eb9e83`; the combined
  stdout-byte-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stdout-byte-guard.json`
  passes with 8/8 reports, 365/365 valid audit response files, three game-over reports, winners
  `p1`/`p2`, and status `incomplete-evidence`.
- Built-player stderr byte guard:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless the retained
  stderr capture exists and matches the launcher-reported byte count; empty stderr remains valid.
  The stderr-byte-guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stderr-byte-guard.json`
  passes with 1/1 report, 9/9 valid audit response files, and hash `f9eb9e83`; the combined
  stderr-byte-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stderr-byte-guard.json`
  passes with 8/8 reports, 365/365 valid audit response files, three game-over reports, winners
  `p1`/`p2`, retained stdout/stderr/player-log paths, and status `incomplete-evidence`.
- Built-player nested smoke-report guard:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless the retained
  nested smoke report parses as JSON and matches the launcher-embedded smoke report. The
  nested-smoke-report-guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-nested-smoke-report-guard.json`
  passes with 1/1 report, 9/9 valid audit response files, and hash `f9eb9e83`; the combined
  nested-smoke-report-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-nested-smoke-report-guard.json`
  passes with 8/8 reports, 365/365 valid audit response files, three game-over reports, winners
  `p1`/`p2`, retained stdout/stderr/player-log paths, and status `incomplete-evidence`.
- Built-player artifact path guard:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless retained
  launcher reports, stdout/stderr/player logs, nested smoke reports, and bridge mailbox
  directories resolve under `artifacts/unity/built-player-smoke/`. The artifact-path-guard replay
  aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-artifact-path-guard.json`
  passes with 1/1 report, 9/9 valid audit response files, and hash `f9eb9e83`; the combined
  artifact-path-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-artifact-path-guard.json`
  passes with 8/8 reports, 365/365 valid audit response files, three game-over reports, winners
  `p1`/`p2`, retained stdout/stderr/player-log paths, and status `incomplete-evidence`.
- Built-player mailbox audit-path guard:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless retained
  mailbox `auditResponse` files resolve inside the bridge mailbox directory. The
  mailbox-audit-path-guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-mailbox-audit-path-guard.json`
  passes with 1/1 report, 9/9 valid audit response files, and hash `f9eb9e83`; the combined
  mailbox-audit-path-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-mailbox-audit-path-guard.json`
  passes with 8/8 reports, 365/365 valid audit response files, three game-over reports, winners
  `p1`/`p2`, retained stdout/stderr/player-log paths, and status `incomplete-evidence`.
- Built-player mailbox audit request-name guard:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless retained
  mailbox `auditResponse` file names match the launcher event request names. The
  mailbox-audit-request-name-guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-mailbox-audit-request-name-guard.json`
  passes with 1/1 report, 9/9 valid audit response files, and hash `f9eb9e83`; the combined
  mailbox-audit-request-name-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-mailbox-audit-request-name-guard.json`
  passes with 8/8 reports, 365/365 valid audit response files, three game-over reports, winners
  `p1`/`p2`, retained stdout/stderr/player-log paths, and status `incomplete-evidence`.
- Built-player mailbox audit digest guard:
  `tools/migration/run-unity-built-player-smoke.mjs` now records byte counts and SHA-256 values for
  retained mailbox audit response files before Unity consumes the delivered response, and
  `tools/migration/summarize-unity-built-player-smokes.mjs` verifies those bytes with
  `--require-audited-mailbox-response-digests`. Fresh smoke
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Tmailbox-digest.launcher.json` passes from
  the built Windows player with two live `take_gems` commands, three digest-bearing audited
  responses, replay release-path coverage, final/review hash `bd4c4bd0`, and no failure reason.
  Digest aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-guard.json`
  passes with 1/1 report, 3/3 valid audit response digests, and status `incomplete-evidence`.
- Built-player launcher args guard:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed under
  `--require-launcher-args` unless retained launcher `args` include the built-player smoke flag and
  match retained path, seed, max-step, mode, preference, and release-path flag metadata. The
  launcher-args digest aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-launcher-args-guard.json`
  passes with 1/1 report, `launcherArgsMatchSmoke=true`, 3/3 valid audit response digests, replay
  release-path coverage, hash `bd4c4bd0`, and status `incomplete-evidence`.
- Built-player audited digest-count aggregate guard:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now also supports
  `--require-audited-mailbox-response-digest-count <count>` for broader audited aggregates that
  include older retained reports without digest metadata. The guard implies audited mailbox
  response validation and fails closed when the aggregate has fewer valid digest matches than
  requested. The 10-report aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-digest-count-strict.json`
  passes with exact report count, unique launcher/nested-smoke/stdout/stderr/player-log path
  guards, launcher-argument validation, replay release-path coverage, invalid-action release-path
  coverage, three game-over reports, winners `p1`/`p2`, 377/377 valid retained audit response
  files, 3 valid audit response digests, 371 successful responses, and status
  `incomplete-evidence`. This strengthens evidence integrity for a mixed audited ledger but does
  not change parity status.
- Built-player all-release plus audited-digest strict union:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-all-release-plus-audited-digest-strict-union.json`
  combines the strict 27-report all-release-path retained set with the 10-report audited
  replay/game-over/digest set. It passes with 37/37 reports, 1076 commands, 1189 mailbox events,
  all 21 required action families, every current release-path proof family, six game-over reports,
  winners `p1`/`p2`, 377 valid retained audit response files, 3 valid audit response digests,
  unique launcher/nested-smoke/stdout/stderr/player-log path guards, no failures, and status
  `incomplete-evidence`. A stricter attempt with `--require-launcher-args` failed closed because
  two earliest 2026-05-11 retained launcher reports predate idle-action-preference argument
  metadata. This union improves evidence composition but leaves product-scope and release-runtime
  parity incomplete.
- Built-player launcher-args refreshed union:
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-launcher-args-refreshed-union.json`
  supersedes the prior broad union by replacing only those two oldest no-preference-arg baseline
  reports with current-format fresh built-player runs. It passes with 37/37 reports, 1076 commands,
  1189 mailbox events, all 21 required action families, every current release-path proof family,
  six game-over reports, winners `p1`/`p2`, 421 valid retained audit response files, 47 valid audit
  response digests, unique launcher/nested-smoke/stdout/stderr/player-log path guards,
  `--require-launcher-args`, no failures, and status `incomplete-evidence`. This improves retained
  evidence integrity but still does not prove arbitrary product-surface parity.
- TypeScript bridge structured error-output guard:
  `tools/migration/unity-rules-engine-bridge.ts` now gives `--out` callers a structured
  `BRIDGE_EXECUTION_FAILED` JSON response when request parsing or another CLI infrastructure error
  occurs after argument parsing. The CLI rejected-command output guard also proves valid rejected
  gameplay commands publish structured `ok=false` JSON to `--out`, exit non-zero, preserve the input
  state/hash, and leave no temp response file. `tools/migration/unity-rules-engine-bridge.test.ts`
  passes 35/35, including malformed request JSON and wrong-actor gameplay rejection with `--out`.
  This improves the LocalDev evidence bridge only; it does not close release-runtime packaging or
  product-scope parity.
- Built-player failure reason coherence guard:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now fails passing retained reports when
  any launcher, wrapper, nested product-surface smoke, or known release-path section retains a
  non-empty `failureReason`. The failure-reason digest aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-failure-reason-guard.json`
  passes with 1/1 report, zero retained failure reasons, 3/3 valid audit response digests, hash
  `bd4c4bd0`, and status `incomplete-evidence`.
- Built-player player-log byte guard:
  `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless the retained
  Unity player log exists, is non-empty, and matches the launcher-reported byte count. The
  player-log-guard replay aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-playerlog-guard.json`
  passes with 1/1 report, 9/9 valid audit response files, and hash `f9eb9e83`; the combined
  player-log-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-playerlog-guard.json`
  passes with 8/8 reports, 365/365 valid audit response files, three game-over reports, winners
  `p1`/`p2`, and status `incomplete-evidence`.
- Final current Unity EditMode:
  `clients/unity/artifacts/unity/editmode-full-20260512-post-notake3-fix-results.xml` reported
  91/91 passed from `2026-05-12 23:02:38Z` to `23:28:37Z`. The immediately preceding full run
  `clients/unity/artifacts/unity/editmode-full-20260512-post-royal-results.xml` reported 90/91 and
  exposed one LocalDev smoke-driver bug: after selecting a `passive.noTake3` buff, the roguelike
  draft smoke attempted a three-gem `take_gems` that the TypeScript oracle correctly rejected. The
  smoke driver now skips illegal three-gem candidate lines under that buff, and the focused rerun
  `clients/unity/artifacts/unity/editmode-draft-smoke-notake3-rerun-20260512-results.xml` reported
  1/1 passed before the full 91/91 rerun.

## 2026-05-13 Final Parity Refresh

- The first full `pnpm parity:electron-unity` attempt timed out after about 604 seconds and left
  partial artifacts under `artifacts/electron-unity-parity/2026-05-13T12-14-12-995Z`. The
  interrupted runner child processes were stopped and the stale `.runner.lock` was removed. That
  attempt is not passing parity evidence and is retained only as superseded timeout evidence.
- The browser-runner cleanup check
  `pnpm parity:electron-unity -- --skip-unity --viewports "1366x768"` exited 0 and wrote
  `artifacts/electron-unity-parity/2026-05-13T12-26-01-458Z`, but its summary records
  `unity.ok: false`, `Unity capture skipped by --skip-unity.`, and 27 blocker rows. This proves the
  browser runner can clean up after the interrupted run; it does not prove Electron/Unity
  equivalence.
- The longer full `pnpm parity:electron-unity` rerun passed after about 805 seconds and wrote
  `artifacts/electron-unity-parity/2026-05-13T14-15-37-411Z`. Its `runner-summary.json` records
  `unity.ok: true`, no Unity blocker, `counts.Equivalent: 54`, viewports `1920x1080` and
  `1366x768`, and browser process guard counts of `1/14/1` with the same pre-existing single
  browser orphan inside the configured budget. Post-run process checks found no remaining `Unity`
  or `GemDuelUnity` process.
- The first fresh timestamped Unity EditMode attempt
  `artifacts/unity/editmode-20260513T1242-final.log` reached the test runner but produced no result
  file before the 22-minute guard expired. PID 75824 was stopped.
- The longer rerun
  `clients/unity/artifacts/unity/editmode-final-validation-20260513-results.xml` produced real
  90/91 evidence and exposed one smoke-driver legality bug: the roguelike draft smoke tried a
  three-gem `take_gems` under an active no-take-3 buff after both draft buffs were selected.
- After resolving active buff ids through the Unity catalog in `LocalDevProductSurfaceSmoke`,
  focused validation `artifacts/unity/editmode-draft-smoke-final-fix-20260513-results.xml` passed
  1/1 and full validation `artifacts/unity/editmode-final-validation-fixed-20260513-results.xml`
  passed 91/91 from `2026-05-13 13:40:44Z` to `14:08:55Z`.
- Windows player build evidence passed for this continuation:
  `artifacts/unity/build-final-validation-fixed-20260513.log` reports
  `Build Finished, Result: Success.` and batchmode return code 0.
- The configured Electron/Unity parity matrix is passing at 54/54 equivalent rows in the retained
  artifact above. This 2026-05-13 replacement-candidate status is superseded for the declared Local
  PVP product surface by the 2026-05-14 packaged-runtime coverage report, which closes broad Local
  PVP, recovery, settings, and release-runtime packaging. LAN, Online, and Visual Lab remain
  user-approved exclusions rather than Local PVP blockers.
