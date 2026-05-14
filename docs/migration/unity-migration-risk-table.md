# Unity Migration Risk Table

Last updated: 2026-05-13

| Risk                                                                 | Severity | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Mitigation                                                                                                                                                                     | Current status |
| -------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| Live Unity product UI still depends on replay fixture setup          | Critical | Visible/semantic Local PvP start plus board, market, reserve, royal, deck-peek/modal, and follow-up commands route through `IGameRulesEngine`; bridge tests apply every golden replay event and one freshly simulated Local PvP game-over replay as commands with per-step hash checks; Unity EditMode now drives three seeded fresh product-surface Local PvP games to game over plus a bounded five-scenario product-surface matrix from semantic start through live replay export/import/review without fixture or checkpoint gameplay drivers; the built Windows player now has three deterministic fresh LocalDev game-over proofs with 98/98/92 live bridge-backed commands and hashes `d6dbea7a`, `411262df`, and `5f3bf567`, plus a resource-first 120-command smoke with hash `7669d935`, an audited 24-command balanced breadth smoke with hash `f934c91b`, and audited reserve-first/privilege-first preference smokes with hashes `38d97b7f` and `62b67ebe`; configured parity still uses fixture revisions for most UI scenarios                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Route every product command through `IGameRulesEngine`, expand bounded product-surface action families, and keep replay fixtures audit-only                                    | Open           |
| Built Windows player LocalDev smoke depends on an automation mailbox | High     | Direct child-process launch from the Windows player failed for both `cmd.exe`/`pnpm.CMD` and direct `node.exe`, so the continuation uses the ignored `GEMDUEL_RULES_BRIDGE_MAILBOX_DIR` request/response path for LocalDev evidence. The strict 2026-05-13 winner-release aggregate `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-game-over-winner-release-path.json` validates the retained 27-report post-no-take-3 set with all 21 required action families, every current release-path proof flag, replay export/import/review evidence, at least 3 game-over reports, required winners `p1`/`p2`, game-over hashes `d6dbea7a`, `411262df`, and `5f3bf567`, and status `incomplete-evidence`. The mailbox response audit hardening now preserves each bridge response in `responses/audit/` before Unity consumes the delivered response; `artifacts/unity/built-player-smoke/smoke-2026-05-13Tmailbox-audit.launcher.json` passed with 2 audited `responseOk=true` mailbox responses for `INIT` and `TAKE_GEMS`, one live recorded command, no fixture/checkpoint driver, and hash `ec648e6c`. The new `--require-audited-mailbox-responses` aggregate guard passes against that audited smoke and fails closed against the older post-no-take-3 draft report that lacks audit response copies; the rejection-path aggregate `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-rejection-audit.json` also passes with `--require-invalid-action-release-path`, 9 audited mailbox responses, 3 successful responses, 6 expected rejections, and structured `COMMAND_REJECTED`/`INVALID_ACTOR` rejection codes. The audited breadth aggregate `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-breadth.json` passes with 25 audited successful responses and five required action families; the audited preference aggregate `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-preferences.json` passes with 38 audited successful responses and reserve/privilege families; the combined audited aggregate `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined.json` passes across 5 audited launcher reports with 74 audited mailbox responses, 68 successful responses, one invalid-action release-path report, and nine required audited action families. The older all-release-path aggregate `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-all-release-paths-audit.json` remains retained evidence for the earlier 25-report subset, including `--require-replay-release-path`, but it is no longer the latest built-player count. This is evidence automation, not a final packaged release-runtime decision. | Preserve the mailbox path as LocalDev/evidence-only, keep the release-runtime packaging decision open, and do not claim shipping runtime completion from this automation proof | Mitigating     |
| Production reducer can use replay checkpoints                        | Critical | `GameReducer.ApplyReplayEvent` no longer calls `ReplaceSnapshot`; audit checkpoint loading is isolated to replay tooling                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Keep checkpoint loading out of Core and Presentation paths                                                                                                                     | Mitigated      |
| Full GameAction coverage is missing                                  | Critical | Manifest covers 11 fixtures and now verifier-enforces baseline plus `joker-buy`, `reserved-buy`, `reserve-cancel`, `reserve-deck`, `discard-reserved`, `privilege`, `peek-modal`, `draft-reroll`, `draft-p2-reroll`, and `royal-handoff` tags. `joker-buy` requires `initiate_buy_joker` followed by matching `buy_card`; `draft-p2-reroll` requires P1 select, P2 reroll, then P2 select; `royal-handoff` requires the next event after `select_royal` to belong to the next player; `rejection-manifest.json` adds 65 hash-locked wrong-phase, resource, ownership, mismatch, follow-up, modal, coordinate-boundary, end-state, and derived-state rejection oracle cases, including no-pending cancel-reserve, stale-pool P2 draft select before P1 locks a buff, no-take-3 board selection hash `8e546f4c`, out-of-bounds coordinate cases for take-gems, bonus-gem, reserve-card, reserve-deck, and privilege use, game-over action-after-winner hash `4b6ab7ec`, Joker missing-color hash `d0a0e459`, and Joker reserved-source hash `b5d9cbbf`. Unity EditMode now replays all 65 through the live bridge with no state or replay-recording mutation, and focused bridge-envelope guards reject wrong-actor market buy, Joker initiation/color-follow-up, reserve/deck-reserve initiation/resolution, reserve cancel, reserved-buy ownership-envelope, reserved discard, privilege activation/use/cancel, and follow-up bonus/discard/steal without mutation. Focused phase-resolution proofs record valid `TAKE_BONUS_GEM`, `STEAL_GEM`, `SELECT_ROYAL_CARD`, and repeated `DISCARD_GEM` commands until their controlled follow-up phases resolve. Broader actor-ordering, online, remaining release-path, and remaining edge fixtures are still incomplete                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Expand fixtures and matrix for every non-debug action and FSM phase                                                                                                            | Open           |
| LAN, online, and Visual Lab scope has no Unity implementation        | High     | Electron routes exist in `GemDuelRoutes.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Implement or get explicit user-approved exclusions                                                                                                                             | Open           |
| Replay import/export/review is incomplete                            | High     | Unity now has visible LocalDev import/export controls, Replay vNext JSON file round trip, hash checks, review undo/redo proof, baseline bridge-backed live command recording/export/import proof, deck-peek modal recording/review proof, three seeded fresh product-surface game-to-game-over export/import/review proofs, a bounded five-scenario product-surface export/import/review matrix, 65-case invalid-action no-recording manifest proof including no-pending cancel hash `3b87795f`, stale-pool P2 draft select hash `5c903209`, no-take-3 hash `8e546f4c`, coordinate-boundary hashes `e1b5e1bf`, `329600a9`, `fd6d5832`, `6173696c`, and `d8141986`, game-over action-after-winner hash `4b6ab7ec`, Joker missing-color hash `d0a0e459`, and Joker reserved-source hash `b5d9cbbf`, release-path invalid/corrupt/hash-mismatch/overwrite recovery proof, built-player replay release-path proof for `invalid_json`, `missing_file`, `unsupported_schema`, `malformed_bootstrap`, `malformed_draft_bootstrap`, `corrupted_summary`, `hash_mismatch`, `failed_overwrite_load`, and `valid_overwrite_reload_review`, built-player game-over export/import/review hashes `d6dbea7a`, `411262df`, and `5f3bf567`, built-player recovery continuation hash `8d4178f7`, replay-review hash `db7fb1b7`, draft hash `851b6356`, invalid-action zero-event hash `1a6afd3f`, privilege-cancel hash `efe66377`, reserved-discard hash `33909286`, reserved-buy hash `47c0e9db`, reserve-cancel hash `40bdddbf`, reserve-deck hash `da89d9e5`, Joker hash `95c8a06c`, and deck-reserve cancel hash `62fa027f`. Broader release-runtime packaging and product-surface breadth remain incomplete.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Expand broader release-path file handling and solve release-runtime packaging scope                                                                                            | Mitigating     |
| Settings/recovery/chrome persistence is partial                      | High     | Unity settings persist locally, reload on a reopened controller, and the built Windows player now saves locale `en`, surface theme `pearl-opaline`, sound off, and LAN opponent visibility preferences off through visible controls, reloads them in a fresh live-game controller, and preserves gameplay hashes plus zero settings-path replay events. LocalDev gameplay recovery restores bridge init, state, pending Joker color selection, and live replay stream before continuing a live command, affordable Joker and reserved-buy replay export/reimport review passes, built-player smoke now saves LocalDev recovery at hash `208a752`, loads it in a fresh controller, continues a live bridge-backed command to hash `8d4178f7`, and reviews the continued replay. Built-player chrome smoke now opens/closes the rulebook without gameplay or replay mutation, restarts to the shell, starts a fresh LocalDev game through the bridge, and records one live command at hash `5304b037`. All 65 committed rejection-manifest invalid, pending-mismatch, wrong-actor, wrong-phase, follow-up, resource, ownership, modal, coordinate-boundary, end-state, and derived-state commands reject through the live bridge without state or replay mutation, including no-pending cancel-reserve at hash `3b87795f`, stale-pool P2 draft select at hash `5c903209`, no-take-3 at hash `8e546f4c`, coordinate-boundary hashes `e1b5e1bf`, `329600a9`, `fd6d5832`, `6173696c`, and `d8141986`, game-over action-after-winner hash `4b6ab7ec`, Joker missing-color hash `d0a0e459`, and Joker reserved-source hash `b5d9cbbf`; the focused market-buy/Joker-initiation/Joker-color/reserve/reserve-cancel/deck-reserve/reserved-card/privilege activation-use-cancel/follow-up wrong-actor bridge guards reject without state/replay mutation; built-player invalid-action release-path proof rejects six representative commands without state or replay mutation; built-player recovery-invalid release-path proof rejects three representative commands after recovery without state/replay mutation; broader invalid-action recovery breadth beyond these covered LocalDev paths remains open                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Add broader recovery-path, invalid-action, chrome, and release-startup validation                                                                                              | Mitigating     |
| C# port drift from TypeScript                                        | High     | Partial C# reducer duplicates selected behavior; TypeScript bridge and C# LocalDev adapter are now used for visible/semantic start plus many live commands; the bridge corpus applies every golden replay event and one freshly simulated game-over replay as commands and hash-checks each result; Unity rejection-manifest setup now primes arbitrary revisions from the TypeScript replay-state oracle instead of relying on the C# presentation reducer. Full UI coverage remains unwired                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Use TypeScript adapter first; require hash parity for any C# port                                                                                                              | Mitigating     |
| Repo release gates can regress under migration pressure              | Medium   | Latest 2026-05-13 continuation-run local gates passed for `pnpm typecheck`, `pnpm lint`, `pnpm test` (177 files, 1112 tests), `pnpm test:coverage` (177 files, 1112 tests, key-module coverage report passed), `pnpm build`, `pnpm release:check`, `pnpm boundaries:check`, `pnpm architecture:check`, `pnpm deps:check`, `pnpm desktop:check`, and `pnpm secrets:check`; earlier same-day retained lifecycle evidence also covers `pnpm bundle:check`, `pnpm release:artifacts:check`, `bench`, `lifecycle:certify`, governance artifacts/evidence/dashboard.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Keep the full local gate set in the release-candidate checklist and rerun after any migration code                                                                             | Mitigated      |
| Platform SDK leakage                                                 | High     | Full migration may tempt Steam/Epic work                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Keep LocalDev only; run secrets/cache/build-output hygiene                                                                                                                     | Mitigating     |
| Parity runner scenario scope is narrower than full migration         | Medium   | Latest configured parity refresh inspected `artifacts/electron-unity-parity/2026-05-13T00-04-32-249Z/` after the 600-second shell wrapper timed out while the child runner was still alive; `runner-summary.json` and `parity-matrix.json` recorded 54/54 configured rows as `Equivalent` across the required viewports. The earlier direct command-pass evidence remains `artifacts/electron-unity-parity/2026-05-12T08-18-40-709Z/`. The bridge proves one fresh simulated game-over replay, Unity EditMode proves three seeded fresh product-surface game-over replays, the five-scenario bounded matrix proves fresh starts plus live replay export/import/review for six action families, the 2026-05-12 built-player follow-ups add royal, steal, bonus, privilege activation/use/cancel, reserved discard, reserved buy, reserve cancel, reserve deck, Joker buy/color selection, three deterministic game-over proofs, one recovery save/load/continue proof, one settings save/load proof, one rulebook/restart chrome proof, one replay-review visible undo/redo proof, one roguelike draft reroll/select proof, one invalid-action no-mutation/no-recording proof, one peek-modal proof, and one recovered invalid-action proof through fresh LocalDev smoke, and the 2026-05-13 audited breadth/preference smokes add fresh response-audited `take_gems`, `buy_card`, `take_bonus_gem`, `discard_gem`, `replenish`, `reserve_card`, `cancel_gem_selection`, `activate_privilege`, and `use_privilege` samples. Fixture-backed UI scenarios still do not prove broad arbitrary local PvP through the full Unity product surface                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Keep runner evidence, then add broader full-game product UI scenarios                                                                                                          | Open           |
| Parity runner tool availability                                      | Medium   | Unity Editor and agent-browser were available locally on 2026-05-11                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Preserve command evidence and rerun after any migration code change                                                                                                            | Mitigated      |
| Large generated artifacts entering git                               | Medium   | Unity and parity commands write under `artifacts/`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Keep ignored outputs untracked and review `git status --short`                                                                                                                 | Mitigating     |

The table rows preserve the broader risk framing for the migration. For configured parity, the
latest full retained run is now
`artifacts/electron-unity-parity/2026-05-13T14-15-37-411Z`: `runner-summary.json` records
`unity.ok: true`, no Unity blocker, 54 equivalent rows, viewports `1920x1080` and `1366x768`, and
browser process guard counts inside budget. The earlier 604-second parity wrapper timeout is
retained only as superseded timeout evidence; the active risk is that configured parity scenario
scope remains narrower than full replacement-candidate readiness. The strict 2026-05-13 unique
log-path aggregate is now the strongest all-release-path built-player set:
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-log-path-guard.json`
passes with explicit `--require-report-count 27`, `--require-unique-report-paths`,
`--require-unique-smoke-report-paths`, `--require-unique-log-paths`, 27/27 reports, 716 commands,
812 mailbox events, `requireUniqueReportPaths=true`, an empty `duplicateReportPaths` list,
`requireUniqueSmokeReportPaths=true`, an empty `duplicateSmokeReportPaths` list,
`requireUniqueLogPaths=true`, empty `duplicateStdoutLogPaths`, `duplicateStderrLogPaths`, and
`duplicatePlayerLogPaths` lists, and `incomplete-evidence` status. It requires all 21 currently
required action families, every current release-path proof flag, at least three built-player
game-over reports, and required winners `p1,p2`. The prior strict winner-release, report-count,
unique-report-path, and unique nested smoke-report aggregates remain retained evidence for the same
requirement set without the retained log duplicate guard. Later audited breadth/preference
aggregates and the combined audited aggregate improve mailbox-response evidence for focused fresh
product-surface samples. The audited strict unique-path aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-strict-unique-paths.json`
is now the strongest audited-mailbox subset: it passes with 8/8 reports, 350 commands, 365 mailbox
events, 365 valid retained audit response files, `requiredReportCount: 8`, unique launcher,
nested-smoke, stdout, stderr, and player-log path guards, one invalid-action release-path report,
three game-over reports, winners `p1,p2`, and status `incomplete-evidence`. These audited subsets
do not change the open replacement-candidate blockers.
The audited replay plus game-over strict aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-strict-unique-paths.json`
adds the file-backed audited replay release-path proof to that same strict audited subset and
passes with 9/9 reports, 358 commands, 374 mailbox events, 374 valid retained audit response files,
one replay release-path report, one invalid-action release-path report, three game-over reports,
winners `p1,p2`, unique launcher/nested-smoke/stdout/stderr/player-log path guards, no failures,
and `incomplete-evidence` status. This reduces the risk that replay release-path evidence is only
reviewed beside audited game-over evidence, but it does not solve arbitrary product-surface play,
LAN/online/Visual Lab scope, or release-runtime TypeScript bridge packaging.
The audited digest-count strict aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-digest-count-strict.json`
adds the digest-bearing mailbox smoke to that strict replay/game-over subset and requires at least
three valid audit-response digest matches plus launcher-argument validation. It passes with 10/10
reports, 360 commands, 377 mailbox events, 377 valid retained audit response files, 3 valid audit
response digests, 371 successful responses, two replay release-path reports, one invalid-action
release-path report, three game-over reports, winners `p1,p2`, unique evidence-path guards, no
failures, and `incomplete-evidence` status. This further reduces retained-evidence integrity risk
for the LocalDev mailbox path, but it does not change the open risks for arbitrary product-surface
play, LAN/online/Visual Lab, or release-runtime TypeScript bridge packaging.
The all-release plus audited-digest strict union
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-all-release-plus-audited-digest-strict-union.json`
combines the 27-report all-release-path retained set with the 10-report audited replay/game-over/
digest set under exact count and unique evidence-path guards. It passes with 37/37 reports, 1076
commands, 1189 mailbox events, every current release-path proof family, all 21 required action
families, six game-over reports, winners `p1,p2`, 377 valid retained audit response files, 3 valid
audit response digests, no failures, and `incomplete-evidence` status. The stricter launcher-args
attempt failed closed because two earliest 2026-05-11 retained launchers predate later
idle-action-preference argument metadata. This union reduces duplicate-evidence and composition
risk across the retained ledgers, but it does not reduce the product-scope or release-runtime
blockers.
The launcher-args refreshed union
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-launcher-args-refreshed-union.json`
replaces the two oldest no-preference-arg baseline reports with current-format built-player smokes
and then requires launcher-argument validation across the broad union. It passes with 37/37
reports, 1076 commands, 1189 mailbox events, every current release-path proof family, all 21
required action families, six game-over reports, winners `p1,p2`, 421 valid retained audit
response files, 47 valid audit response digests, no duplicate evidence paths, no failures, and
`incomplete-evidence` status. This removes the retained launcher-args limitation from the broad
evidence ledger while keeping the LocalDev mailbox and product-scope risks open.

The audited 2026-05-13 game-over follow-up
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over.json`
adds one completed built-player game to the audited mailbox subset: 98 live commands, 99 mailbox
events, 99 audited successful responses, winner `p1`, and final/review hash `d6dbea7a`. This
mitigates auditability risk for the LocalDev mailbox path, but it does not change the open risks for
arbitrary broad product-surface play, LAN/online/Visual Lab, or release-runtime bridge packaging.
The audited winner-breadth follow-up
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over-winner-breadth.json`
adds the two deterministic `p2` winner seeds to the audited mailbox subset and passes with 3/3
completed game-over reports, 288 commands, 291 audited successful responses, winners `p1` and
`p2`, and game-over hashes `d6dbea7a`, `411262df`, and `5f3bf567`. The stricter combined
cross-check
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-breadth.json`
requires audited mailbox responses, invalid-action release-path proof, and three game-over proofs
together, and passes with 8/8 reports, 350 commands, 365 audited responses, and status
`incomplete-evidence`.
The enforced winner guard
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over-winner-guard.json`
adds `--require-game-over-winner p1,p2` and passes with the same 3/3 audited game-over reports,
288 commands, 291 audited successful responses, and winners `p1` and `p2`; the p2-only negative
check fails closed with `Required built-player game-over winner was not covered: p1`. The stricter
enforced combined guard
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-guard.json`
also requires invalid-action release-path proof and passes with 8/8 audited reports, 350 commands,
365 audited responses, and status `incomplete-evidence`. This hardens the evidence guard only; it
does not close arbitrary broad product-surface play, LAN/online/Visual Lab, or release-runtime
bridge packaging risks.

The audited replay release-path follow-up
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path.json`
adds a fresh built-player replay file-handling proof to the audited mailbox subset. It passes with
9/9 retained mailbox responses and hash `f9eb9e83`.

The 2026-05-13 shared action oracle validation refresh rechecked the prior shared action changes
from commit `6e8af1b9513cab7ab8a6713b0b7d1786a1ff676c`. Existing TypeScript tests cover
deterministic empty board-cell UIDs, deterministic offline draft reroll behavior with P1/P2 draft
ownership separation, and unaffordable buy rejection preserving `pendingBuy`, market, tableau, and
phase state. The focused command passed 3 shared action files and 57 tests. This keeps those shared
changes documented as product-correct oracle/determinism fixes, but it does not reduce the open
risks for arbitrary product-surface breadth, LAN/online/Visual Lab, or release-runtime TypeScript
bridge packaging.

The 2026-05-13 replay-review summary guard refresh adds focused test coverage for the existing
built-player summarizer replay-review release-path validations. The guard now has a passing fixture
for complete visible redo/undo navigation evidence and a fail-closed fixture when visible review
control evidence is missing. `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`
passed 25/25, and the retained replay-review launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-review-navigation-guard.json`
with 1/1 report, 4 commands, 10 mailbox events, replay-review hash `db7fb1b7`, and status
`incomplete-evidence`. This reduces replay-review evidence drift risk but does not close arbitrary
product-surface breadth, LAN/online/Visual Lab, or release-runtime packaging risks.

The 2026-05-13 replay release-path summary guard refresh adds focused test coverage for the
existing built-player summarizer replay release-path validations. The guard now has a passing
fixture for complete coverage/case/hash evidence and a fail-closed fixture when the required
`hash_mismatch` coverage label is missing.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 27/27,
and the retained audited replay release-path launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-release-path-summary-guard.json`
with 1/1 report, 8 commands, 9 mailbox events, 9/9 retained audit response files, full replay
release-path coverage, final hash `f9eb9e83`, and status `incomplete-evidence`. This reduces
replay release-path evidence drift risk but does not close arbitrary product-surface breadth,
LAN/online/Visual Lab, or release-runtime packaging risks. The retained audited replay
release-path smoke still passes with `--require-audited-mailbox-responses`,
`--require-replay-release-path`, 8 live commands, 9 audited successful mailbox responses, full
invalid/corrupt/hash-mismatch/overwrite replay coverage, and hash `f9eb9e83`. This mitigates
release-path auditability risk, but it does not resolve the release-runtime packaging decision or
the broader product-scope blockers.

The 2026-05-13 invalid-action summary guard refresh adds focused test coverage for the existing
built-player summarizer invalid-action release-path validations. The guard now has a passing fixture
for the required rejected case IDs, rejected mailbox exits, zero recorded events, and export/review
hash preservation, plus a fail-closed fixture when a rejected case mutates state.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 29/29,
and the retained audited invalid-action launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-invalid-action-summary-guard.json`
with 1/1 report, 1 product-surface command, 9 mailbox events, 9/9 retained audit response files, one
invalid-action release-path report, invalid-action hash `f2780c3f`, and status
`incomplete-evidence`. This reduces invalid-action evidence drift risk but does not close arbitrary
product-surface breadth, LAN/online/Visual Lab, or release-runtime packaging risks.

The 2026-05-13 recovery summary guard refresh adds focused test coverage for the existing
built-player summarizer recovery release-path validations. The guard now has a passing fixture for
save/load/continue status, saved/restored/continued hashes, recorded event counts, and export/review
hash preservation, plus a fail-closed fixture when the continuation does not append the expected
live replay event.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 31/31,
and the retained recovery launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-recovery-summary-guard.json`
with 1/1 report, 2 product-surface commands, 6 mailbox events, one recovery release-path report,
recovery continuation hash `8d4178f7`, and status `incomplete-evidence`. This reduces recovery
evidence drift risk but does not close arbitrary product-surface breadth, LAN/online/Visual Lab, or
release-runtime packaging risks.

The 2026-05-13 settings summary guard refresh adds focused test coverage for the existing
built-player summarizer settings release-path validations. The guard now has a passing fixture for
save/reload status, persistence file existence, gameplay hash/event stability, and expected
saved/persisted/reloaded settings values, plus a fail-closed fixture when settings evidence records
gameplay events.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 33/33,
and the retained settings launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-settings-summary-guard.json`
with 1/1 report, 2 product-surface commands, 5 mailbox events, one settings release-path report,
settings path `artifacts/unity/settings/gemduel.preferences.v1.json`, final hash `8668e7ab`, and
status `incomplete-evidence`. This reduces settings evidence drift risk but does not close
arbitrary product-surface breadth, LAN/online/Visual Lab, or release-runtime packaging risks.

The 2026-05-13 chrome summary guard refresh adds focused test coverage for the existing
built-player summarizer chrome/rulebook/restart release-path validations. The guard now has a
passing fixture for rulebook open/close, unchanged gameplay hash/event count, shell restart, Local
PvP start visibility, and restarted live-command evidence, plus a fail-closed fixture when rulebook
controls change the live replay event count.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 35/35,
and the retained chrome launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-chrome-summary-guard.json`
with 1/1 report, 2 product-surface commands, 6 mailbox events, one chrome release-path report,
chrome restart hash `5304b037`, final hash `e3a47e84`, and status `incomplete-evidence`. This
reduces chrome/restart evidence drift risk but does not close arbitrary product-surface breadth,
LAN/online/Visual Lab, or release-runtime packaging risks.

The 2026-05-13 peek-modal summary guard refresh adds focused test coverage for the existing
built-player summarizer peek-modal release-path validations. The guard now has a passing fixture for
buff selection, visible peek/modal controls, `select_buff`/`peek_deck`/`close_modal` event export,
recorded/exported event preservation, and review hash preservation, plus a fail-closed fixture when
`close_modal` event evidence is missing.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 37/37,
and the retained peek-modal launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-peek-modal-summary-guard.json`
with 1/1 report, 4 product-surface commands, 10 mailbox events, one peek-modal release-path report,
peek-modal review hash `8399eadd`, final hash `26aa66c6`, and status `incomplete-evidence`. This
reduces peek-modal release-path evidence drift risk but does not close arbitrary product-surface
breadth, LAN/online/Visual Lab, or release-runtime packaging risks.

The 2026-05-13 recovery invalid-action summary guard refresh adds focused test coverage for the
existing built-player summarizer recovered invalid-action release-path validations. The guard now has
a passing fixture for recovered cancel-reserve, close-modal, and inactive-player take-gems
rejections, rejected bridge process exits, unchanged recovered state/hash/event counts, valid
continuation, and export/review hash preservation, plus a fail-closed fixture when rejection records
a replay event. `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`
passed 39/39, and the retained recovery invalid-action launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-recovery-invalid-action-summary-guard.json`
with 1/1 report, 2 product-surface commands, 9 mailbox events, one recovery invalid-action
release-path report, continuation hash `d2b51b3f`, final hash `d2fd26e1`, and status
`incomplete-evidence`. This reduces recovered invalid-action release-path evidence drift risk but
does not close arbitrary product-surface breadth, LAN/online/Visual Lab, or release-runtime
packaging risks.

The 2026-05-13 privilege-cancel summary guard refresh adds focused test coverage for the existing
built-player summarizer privilege-cancel release-path validations. The guard now has a passing
fixture for `PRIVILEGE_ACTION` activation, return to `IDLE`, ordered
`activate_privilege`/`cancel_privilege` export, recorded/exported event preservation, and review hash
preservation, plus a fail-closed fixture when activation/cancel event ordering is reversed.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 41/41,
and the retained privilege-cancel launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-privilege-cancel-summary-guard.json`
with 1/1 report, 3 product-surface commands, 8 mailbox events, one privilege-cancel release-path
report, privilege-cancel hash `efe66377`, final hash `9e3b6f7c`, and status `incomplete-evidence`.
This reduces privilege-cancel release-path evidence drift risk but does not close arbitrary
product-surface breadth, LAN/online/Visual Lab, or release-runtime packaging risks.

The 2026-05-13 reserved-discard summary guard refresh adds focused test coverage for the existing
built-player summarizer reserved-discard release-path validations. The guard now has a passing
fixture for `puppet_master` selection, visible reserved-card discard controls, ordered
`select_buff`/`reserve_card`/`discard_reserved` export, recorded/exported event preservation, and
review hash preservation, plus a fail-closed fixture when discard-control evidence is hidden.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 43/43,
and the retained reserved-discard launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserved-discard-summary-guard.json`
with 1/1 report, 6 product-surface commands, 14 mailbox events, one reserved-discard release-path
report, reserved-discard hash `33909286`, final hash `fb772d70`, and status
`incomplete-evidence`. This reduces reserved-discard release-path evidence drift risk but does not
close arbitrary product-surface breadth, LAN/online/Visual Lab, or release-runtime packaging risks.

The 2026-05-13 reserved-buy summary guard refresh adds focused test coverage for the existing
built-player summarizer reserved-buy release-path validations. The guard now has a passing fixture
for visible reserved-card buy controls, ordered `reserve_card` and reserved-source `buy_card`
export, recorded/exported event preservation, and review hash preservation, plus a fail-closed
fixture when the buy event source is not reserved.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 45/45,
and the retained reserved-buy launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserved-buy-summary-guard.json`
with 1/1 report, 6 product-surface commands, 16 mailbox events, one reserved-buy release-path
report, reserved-buy hash `47c0e9db`, final hash `8ea252da`, and status `incomplete-evidence`.
This reduces reserved-buy release-path evidence drift risk but does not close arbitrary
product-surface breadth, LAN/online/Visual Lab, or release-runtime packaging risks.

The 2026-05-13 reserve-cancel summary guard refresh adds focused test coverage for the existing
built-player summarizer reserve-cancel release-path validations. The guard now has a passing fixture
for visible market reserve/cancel controls, `RESERVE_WAITING_GEM` to `IDLE` transition, cleared
pending-reserve state, ordered `initiate_reserve`/`cancel_reserve` export, recorded/exported event
preservation, and initial/export/review hash preservation, plus a fail-closed fixture when pending
reserve state remains after cancel.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 47/47,
and the retained reserve-cancel launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-cancel-summary-guard.json`
with 1/1 report, 6 product-surface commands, 10 mailbox events, one reserve-cancel release-path
report, reserve-cancel hash `40bdddbf`, final hash `bdbabdbb`, and status `incomplete-evidence`.
This reduces reserve-cancel release-path evidence drift risk but does not close arbitrary
product-surface breadth, LAN/online/Visual Lab, or release-runtime packaging risks.

The 2026-05-13 reserve-deck summary guard refresh adds focused test coverage for the existing
built-player summarizer reserve-deck release-path validations. The guard now has a passing fixture
for visible deck/gold reserve controls, deck-pending phase evidence, deck/reserved/gold-cell
mutation, ordered `initiate_reserve_deck`/`reserve_deck` export, recorded/exported event
preservation, and export/review hash preservation, plus a fail-closed fixture when the deck does not
decrement and Gold is not consumed.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 49/49,
and the retained reserve-deck launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-deck-summary-guard.json`
with 1/1 report, 6 product-surface commands, 10 mailbox events, one reserve-deck release-path
report, reserve-deck hash `da89d9e5`, final hash `63df431c`, and status `incomplete-evidence`.
This reduces reserve-deck release-path evidence drift risk but does not close arbitrary
product-surface breadth, LAN/online/Visual Lab, or release-runtime packaging risks.

The 2026-05-13 reserve-deck-cancel summary guard refresh adds focused test coverage for the existing
built-player summarizer deck-reserve cancel release-path validations. The guard now has a passing
fixture for visible deck/gold reserve/cancel controls, deck-pending cancel phase evidence, restored
deck/reserved/gold-cell state, ordered `initiate_reserve_deck`/`cancel_reserve` export,
recorded/exported event preservation, and initial/export/review hash preservation, plus a
fail-closed fixture when cancel mutates deck/reserve row/pending-reserve/Gold state.
`pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed 51/51,
and the retained reserve-deck-cancel launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-reserve-deck-cancel-summary-guard.json`
with 1/1 report, 8 product-surface commands, 12 mailbox events, one deck-reserve cancel
release-path report, deck-reserve cancel hash `62fa027f`, final hash `95c8a06c`, and status
`incomplete-evidence`. This reduces deck-reserve cancel release-path evidence drift risk but does
not close arbitrary product-surface breadth, LAN/online/Visual Lab, or release-runtime packaging
risks.

The 2026-05-13 Joker summary guard refresh adds focused test coverage for the existing built-player
summarizer Joker release-path validations. The guard now has a passing fixture for visible market
preview/buy/color controls, `SELECT_CARD_COLOR` to `IDLE` phase transition, Joker tableau
placement, pending-buy clearing, ordered `initiate_buy_joker`/`buy_card` export, recorded/exported
event preservation, and export/review hash preservation, plus a fail-closed fixture when pending buy
remains after buy. `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`
passed 53/53, and the retained Joker launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-joker-summary-guard.json`
with 1/1 report, 8 product-surface commands, 18 mailbox events, one Joker release-path report,
Joker hash `95c8a06c`, final hash `95c8a06c`, and status `incomplete-evidence`. This reduces Joker
release-path evidence drift risk but does not close arbitrary product-surface breadth, LAN/online/
Visual Lab, or release-runtime packaging risks.

The 2026-05-13 draft summary guard refresh adds focused test coverage for the existing built-player
summarizer roguelike draft release-path validations. The guard now has a passing fixture for fresh
roguelike `reroll-each-player-first` start, ordered P1/P2 `reroll_draft_pool` and `choose_boon`
actions, `DRAFT_PHASE` to `IDLE` completion, live replay event counts, and export/review hash
preservation, plus a fail-closed fixture when both players' draft selections do not resolve to
`IDLE`. `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts` passed
55/55, and the retained draft launcher report passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-draft-summary-guard.json`
with 1/1 report, 8 product-surface commands, 9 mailbox events, one draft release-path report, draft
hash `851b6356`, final hash `851b6356`, and status `incomplete-evidence`. The same guard also
passed
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-draft-post-notake3-summary-guard.json`
against the newer post-no-take-3 retained draft launcher with 1/1 report, 6 product-surface
commands, 7 mailbox events, draft hash `857c3e58`, final hash `857c3e58`, and status
`incomplete-evidence`. This reduces draft release-path evidence drift risk but does not close
arbitrary product-surface breadth, LAN/online/Visual Lab, or release-runtime packaging risks.

## 2026-05-12 Peek-Modal Risk Update

- Built-player LocalDev smoke evidence now includes
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T07-56-40-905Z.launcher.json`, which starts
  fresh roguelike LocalDev in the built Windows player, selects `intelligence`, opens and closes
  the visible peek modal, records `select_buff`, `peek_deck`, and `close_modal`, and preserves
  export/import/review hash `8399eadd`.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-peek-modal-release-path.json`
  validates 17/17 reports, 545 commands, 587 mailbox events, one peek-modal release-path report,
  and the previous replay/recovery/settings/chrome/replay-review/draft/invalid-action release-path
  reports. This mitigates one named `PEEK_DECK` / `CLOSE_MODAL` release-path gap, but the mailbox
  bridge remains LocalDev/evidence-only and the release-runtime packaging decision remains open.
- Current parity runner evidence is the inspected
  `artifacts/electron-unity-parity/2026-05-13T00-04-32-249Z/` artifact, where
  `runner-summary.json` and `parity-matrix.json` recorded 54/54 configured rows as
  `Equivalent` after the shell wrapper hit the 600-second timeout while the child runner was still
  alive. The earlier direct command-pass evidence remains
  `artifacts/electron-unity-parity/2026-05-12T08-18-40-709Z/`. This is configured runner evidence
  only, not broad arbitrary product-surface completion.

## 2026-05-12 Recovery Invalid-Action Risk Update

- Built-player LocalDev smoke evidence now includes
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T09-33-52-882Z.launcher.json`, which starts
  fresh LocalDev in the built Windows player, saves and reloads recovered hash `24a87497`, rejects
  `CANCEL_RESERVE`, `CLOSE_MODAL`, and inactive actor `TAKE_GEMS` without mutating recovered state,
  replay state, summary hash, or recorded event count, then continues and reviews hash `d2b51b3f`.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-recovery-invalid-action-release-path.json`
  validates 18/18 reports, 547 commands, 596 mailbox events, one recovery invalid-action
  release-path report, and the previous replay/recovery/settings/chrome/replay-review/draft/
  invalid-action/peek-modal release-path reports. This mitigates one recovered invalid-action
  no-mutation/no-recording gap, but the mailbox bridge remains LocalDev/evidence-only and the
  release-runtime packaging decision remains open.

## 2026-05-12 Privilege-Cancel Risk Update

- Built-player LocalDev smoke evidence now includes
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T10-51-01-649Z.launcher.json`, which starts
  fresh LocalDev in the built Windows player, creates a normal privilege opportunity, enters
  `PRIVILEGE_ACTION`, cancels through the visible cancel control, records `take_gems`,
  `activate_privilege`, and `cancel_privilege`, and preserves export/import/review hash
  `efe66377`.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-privilege-cancel-release-path.json`
  validates 19/19 reports, 550 commands, 604 mailbox events, one privilege-cancel release-path
  report, and the previous replay/recovery/settings/chrome/replay-review/draft/invalid-action/
  peek-modal/recovery-invalid-action release-path reports. This mitigates one deterministic
  `CANCEL_PRIVILEGE` release-path gap, but the mailbox bridge remains LocalDev/evidence-only and
  the release-runtime packaging decision remains open.

## 2026-05-12 Reserved-Discard Risk Update

- Built-player LocalDev smoke evidence now includes
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T11-39-09-986Z.launcher.json`, which starts
  fresh roguelike LocalDev in the built Windows player, selects `puppet_master`, reserves
  `c:125-gr#0`, opens the visible reserved-card preview, records `select_buff`,
  `initiate_reserve`, `reserve_card`, `take_gems`, and `discard_reserved`, and preserves
  export/import/review hash `33909286`.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserved-discard-release-path.json`
  validates 20/20 reports, 556 commands, 618 mailbox events, one reserved-discard release-path
  report, and the previous replay/recovery/settings/chrome/replay-review/draft/invalid-action/
  peek-modal/recovery-invalid-action/privilege-cancel release-path reports. This mitigates one
  deterministic `DISCARD_RESERVED` release-path gap, but the mailbox bridge remains
  LocalDev/evidence-only and the release-runtime packaging decision remains open.

## 2026-05-12 Reserved-Buy Risk Update

- Built-player LocalDev smoke evidence now includes
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T12-29-42-881Z.launcher.json`, which starts
  fresh LocalDev in the built Windows player, reserves `c:155-bk#0`, opens the visible reserved-card
  preview, records ordered `reserve_card` then reserved-source `buy_card`, and preserves
  export/import/review hash `47c0e9db`.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserved-buy-release-path.json`
  validates 21/21 reports, 562 commands, 634 mailbox events, one reserved-buy release-path report,
  and the previous replay/recovery/settings/chrome/replay-review/draft/invalid-action/
  peek-modal/recovery-invalid-action/privilege-cancel/reserved-discard release-path reports. This
  mitigates one deterministic reserved-card `BUY_CARD` happy-path gap, but the mailbox bridge
  remains LocalDev/evidence-only and the release-runtime packaging decision remains open.

## 2026-05-12 Reserve-Cancel Risk Update

- Built-player LocalDev smoke evidence now includes
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T13-21-32-993Z.launcher.json`, which starts
  fresh LocalDev in the built Windows player, opens visible market reserve controls, enters
  `RESERVE_WAITING_GEM`, cancels through the visible cancel control, records ordered
  `initiate_reserve` and `cancel_reserve`, returns to `IDLE` without a pending reserve or reserved
  card, and preserves export/import/review hash `40bdddbf`.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-cancel-release-path.json`
  validates 22/22 reports, 568 commands, 644 mailbox events, one reserve-cancel release-path
  report, and the previous replay/recovery/settings/chrome/replay-review/draft/invalid-action/
  peek-modal/recovery-invalid-action/privilege-cancel/reserved-discard/reserved-buy release-path
  reports. This mitigates one deterministic `CANCEL_RESERVE` release-path gap, but the mailbox
  bridge remains LocalDev/evidence-only and the release-runtime packaging decision remains open.

## 2026-05-12 Reserve-Deck Risk Update

- Built-player LocalDev smoke evidence now includes
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T13-59-30-560Z.launcher.json`, which starts
  fresh LocalDev in the built Windows player, opens a visible market deck preview, initiates deck
  reserve through the visible preview reserve control, completes the Gold follow-up through a visible
  board target, records ordered `initiate_reserve_deck` and `reserve_deck`, consumes the selected
  Gold cell, and preserves export/import/review hash `da89d9e5`.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-deck-release-path.json`
  validates 23/23 reports, 574 commands, 654 mailbox events, one reserve-deck release-path report,
  and the previous replay/recovery/settings/chrome/replay-review/draft/invalid-action/peek-modal/
  recovery-invalid-action/privilege-cancel/reserved-discard/reserved-buy/reserve-cancel release-path
  reports. This mitigates one deterministic `RESERVE_DECK` release-path happy-path gap, but the
  mailbox bridge remains LocalDev/evidence-only and the release-runtime packaging decision remains
  open.

## 2026-05-12 Joker Risk Update

- Built-player LocalDev smoke evidence now includes
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T14-52-59-171Z.launcher.json`, which starts
  fresh LocalDev in the built Windows player, drives six live setup `take_gems` commands until
  visible Joker `c:174-jo#0` is affordable, opens the visible market preview, buys through the
  visible preview primary action, selects visible color `red`, records ordered `initiate_buy_joker`
  and `buy_card`, clears pending buy, adds the Joker to P1 tableau, and preserves
  export/import/review hash `95c8a06c`.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-joker-release-path.json`
  validates 24/24 reports, 582 commands, 672 mailbox events, one Joker release-path report, and the
  previous replay/recovery/settings/chrome/replay-review/draft/invalid-action/peek-modal/
  recovery-invalid-action/privilege-cancel/reserved-discard/reserved-buy/reserve-cancel/
  reserve-deck release-path reports. This mitigates one deterministic Joker happy-path release
  evidence gap, but the mailbox bridge remains LocalDev/evidence-only and the release-runtime
  packaging decision remains open.

## 2026-05-12 Deck-Reserve Cancel Risk Update

- Built-player LocalDev smoke evidence now includes
  `artifacts/unity/built-player-smoke/smoke-2026-05-12T15-27-57-407Z.launcher.json`, which starts
  fresh LocalDev in the built Windows player, opens a visible market deck preview, initiates deck
  reserve through the visible preview reserve control, cancels through the visible cancel control
  before selecting Gold, records ordered `initiate_reserve_deck` and `cancel_reserve`, leaves deck,
  reserved-card, and Gold-cell state unchanged, and preserves export/import/review hash `62fa027f`.
- The refreshed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-deck-cancel-release-path.json`
  validates 25/25 reports, 590 commands, 684 mailbox events, one deck-reserve cancel release-path
  report, and the previous replay/recovery/settings/chrome/replay-review/draft/invalid-action/
  peek-modal/recovery-invalid-action/privilege-cancel/reserved-discard/reserved-buy/reserve-cancel/
  reserve-deck/Joker release-path reports. This mitigates one deterministic deck-reserve cancel
  release evidence gap, but the mailbox bridge remains LocalDev/evidence-only and the release-runtime
  packaging decision remains open.

## 2026-05-12 Reserved-Card Wrong-Actor Risk Update

- Focused Unity EditMode evidence now includes
  `clients/unity/artifacts/unity/editmode-reserved-card-wrong-actor-rejection-20260512-results.xml`,
  which reports 2/2 passed from `2026-05-12 21:01:22Z` to `21:01:36Z`. The proof starts fresh
  LocalDev games through `GemDuelGameController` / `IGameRulesEngine`, rejects wrong-actor
  `BUY_RESERVED_CARD` as a reserved-card ownership-envelope failure, rejects wrong-actor
  `DISCARD_RESERVED`, preserves replay-state hashes and reserved ownership state, and appends no
  extra Replay vNext events.
- This mitigates one reserved-card actor-envelope edge gap, but it is EditMode LocalDev bridge
  evidence only. Broader release-path reserved-card edge coverage and the final TypeScript bridge
  release-runtime packaging decision remain open.

## 2026-05-12 Market-Buy Wrong-Actor Risk Update

- Focused Unity EditMode evidence now includes
  `clients/unity/artifacts/unity/editmode-market-buy-wrong-actor-rejection-20260512-results.xml`,
  which reports 1/1 passed from `2026-05-12 21:10:50Z` to `21:10:55Z`. The proof starts a fresh
  LocalDev game through `GemDuelGameController` / `IGameRulesEngine`, targets a visible non-Joker
  market card, rejects plain market `BUY_CARD` with actor override `p2`, preserves the replay-state
  hash, keeps the card in market and out of both tableaus, and appends no Replay vNext event.
- This mitigates one plain market-buy actor-envelope edge gap, but it is EditMode LocalDev bridge
  evidence only. Broader market actor/order coverage and the final TypeScript bridge
  release-runtime packaging decision remain open.

## 2026-05-12 Privilege Wrong-Actor Risk Update

- Focused Unity EditMode evidence now includes
  `clients/unity/artifacts/unity/editmode-privilege-wrong-actor-rejection-20260512-results.xml`,
  which reports 2/2 passed from `2026-05-12 21:20:10Z` to `21:20:23Z`. The proof starts fresh
  LocalDev games through `GemDuelGameController` / `IGameRulesEngine`, rejects wrong-actor
  `ACTIVATE_PRIVILEGE` from `IDLE`, rejects wrong-actor `USE_PRIVILEGE` from
  `PRIVILEGE_ACTION`, preserves replay-state hashes, privilege charges, board, and inventory
  state, and appends no Replay vNext events.
- This mitigates one privilege actor-envelope edge gap, but it is EditMode LocalDev bridge
  evidence only. Broader privilege release-path/recovery ordering coverage and the final
  TypeScript bridge release-runtime packaging decision remain open.

## 2026-05-12 Cancel-Privilege Wrong-Actor Risk Update

- Focused Unity EditMode evidence now includes
  `clients/unity/artifacts/unity/editmode-cancel-privilege-wrong-actor-rejection-20260512-results.xml`,
  which reports 1/1 passed from `2026-05-12 21:28:16Z` to `21:28:21Z`. The proof starts a fresh
  LocalDev game through `GemDuelGameController` / `IGameRulesEngine`, rejects wrong-actor
  `CANCEL_PRIVILEGE` from `PRIVILEGE_ACTION`, preserves replay-state hash, phase, turn, privilege
  charge, board, and inventory state, and appends no Replay vNext event.
- This completes the focused privilege actor-envelope trio for activation/use/cancel, but it is
  EditMode LocalDev bridge evidence only. Broader privilege release-path/recovery ordering coverage
  and the final TypeScript bridge release-runtime packaging decision remain open.

## 2026-05-12 Follow-Up Wrong-Actor Risk Update

- Focused Unity EditMode evidence now includes
  `clients/unity/artifacts/unity/editmode-follow-up-wrong-actor-rejection-20260512-results.xml`,
  which reports 1/1 passed from `2026-05-12 21:39:45Z` to `21:39:53Z`. The proof starts a fresh
  LocalDev game through `GemDuelGameController` / `IGameRulesEngine`, rejects wrong-actor
  `TAKE_BONUS_GEM`, `DISCARD_GEM`, and `STEAL_GEM` from valid follow-up phase setups, preserves
  replay-state hashes, phase, turn, board, and relevant inventory state, and appends no Replay
  vNext events.
- This mitigates one follow-up actor-envelope edge gap, but it is EditMode LocalDev bridge evidence
  only. Broader bonus/discard/steal release-path ordering coverage, LAN/online scope, and the final
  TypeScript bridge release-runtime packaging decision remain open.

## 2026-05-12 Reserve-Cancel Wrong-Actor Risk Update

- Focused Unity EditMode evidence now includes
  `clients/unity/artifacts/unity/editmode-reserve-cancel-wrong-actor-rejection-20260512-results.xml`,
  which reports 1/1 passed from `2026-05-12 21:46:29Z` to `21:46:35Z`. The proof starts a fresh
  LocalDev game through `GemDuelGameController` / `IGameRulesEngine`, records a valid active-player
  `INITIATE_RESERVE`, rejects wrong-actor `CANCEL_RESERVE` from `RESERVE_WAITING_GEM`, preserves
  replay-state hash, phase, turn, pending reserve, market card, and reserved-card count, and appends
  no additional Replay vNext event.
- This mitigates one reserve-cancel actor-envelope edge gap, but it is EditMode LocalDev bridge
  evidence only. Broader reserve/recovery ordering coverage, LAN/online scope, and the final
  TypeScript bridge release-runtime packaging decision remain open.

## 2026-05-12 Joker Color Wrong-Actor Risk Update

- Focused Unity EditMode evidence now includes
  `clients/unity/artifacts/unity/editmode-joker-color-wrong-actor-rejection-20260512-results.xml`,
  which reports 1/1 passed from `2026-05-12 21:54:12Z` to `21:54:20Z`. The proof starts a fresh
  LocalDev game through `GemDuelGameController` / `IGameRulesEngine`, records a valid active-player
  Joker initiation into `SELECT_CARD_COLOR`, rejects wrong-actor color-follow-up `BUY_CARD`,
  preserves replay-state hash, phase, turn, pending buy, market card, and player tableau state, and
  appends no additional Replay vNext event.
- This mitigates one Joker color-selection actor-envelope edge gap, but it is EditMode LocalDev
  bridge evidence only. Broader Joker actor/order release-path coverage, LAN/online scope, and the
  final TypeScript bridge release-runtime packaging decision remain open.

## 2026-05-12 Discard Phase-Resolution Risk Update

- Focused Unity EditMode evidence now includes
  `clients/unity/artifacts/unity/editmode-discard-phase-resolution-20260512-results.xml`, which
  reports 1/1 passed from `2026-05-12 22:03:41Z` to `22:03:48Z`. The proof starts fresh LocalDev,
  enters a controlled over-limit `DISCARD_EXCESS_GEMS` phase, applies two live `DISCARD_GEM`
  commands through `IGameRulesEngine`, records two Replay vNext events, keeps the discard phase
  active at 11 gems, resolves to `IDLE` and hands turn to `p2` at 10 gems, and keeps the live replay
  summary hash aligned with the controller state hash.
- This mitigates one discard follow-up phase-resolution gap, but it is EditMode LocalDev bridge
  evidence only. Broader release-path discard behavior, LAN/online scope, and the final TypeScript
  bridge release-runtime packaging decision remain open.

## 2026-05-12 Bonus/Steal Phase-Resolution Risk Update

- Focused Unity EditMode evidence now includes
  `clients/unity/artifacts/unity/editmode-bonus-steal-phase-resolution-20260512-results.xml`, which
  reports 1/1 passed from `2026-05-12 22:13:19Z` to `22:13:28Z`. The proof starts fresh LocalDev
  controllers, enters controlled `BONUS_ACTION` and `STEAL_ACTION` phases, applies valid live
  `TAKE_BONUS_GEM` and `STEAL_GEM` commands through `IGameRulesEngine`, records one Replay vNext
  event per command, verifies the expected board/inventory mutation, resolves both follow-up phases
  to `IDLE` with turn handoff to `p2`, and keeps each live replay summary hash aligned with the
  controller state hash.
- This mitigates one bonus/steal follow-up phase-resolution gap, but it is EditMode LocalDev bridge
  evidence only. Broader release-path bonus/steal behavior, LAN/online scope, and the final
  TypeScript bridge release-runtime packaging decision remain open.

## 2026-05-12 Royal Phase-Resolution Risk Update

- Focused Unity EditMode evidence now includes
  `clients/unity/artifacts/unity/editmode-royal-phase-resolution-20260512-results.xml`, which
  reports 1/1 passed from `2026-05-12 22:19:13Z` to `22:19:17Z`. The proof starts fresh LocalDev,
  enters a controlled `SELECT_ROYAL` phase with `r91-ro` available, applies valid live
  `SELECT_ROYAL_CARD` through `IGameRulesEngine`, records one Replay vNext `select_royal` event,
  moves `r91-ro` from the royal deck to P1, resolves to `IDLE` with turn handoff to `p2`, and keeps
  the live replay summary hash aligned with the controller state hash.
- This mitigates one royal phase-resolution gap, but it is EditMode LocalDev bridge evidence only.
  Broader royal release-path/recovery ordering, LAN/online scope, and the final TypeScript bridge
  release-runtime packaging decision remain open.

## 2026-05-12 Full EditMode No-Take-3 Smoke Update

- Full Unity EditMode rerun
  `clients/unity/artifacts/unity/editmode-full-20260512-post-royal-results.xml` reported 90/91
  from `2026-05-12 22:34:57Z` to `23:00:14Z`. The single failure was the roguelike draft
  product-surface smoke driver attempting a three-gem `take_gems` after selecting a
  `passive.noTake3` buff; the TypeScript oracle correctly rejected the command.
- `LocalDevProductSurfaceSmoke.TryTakeUsefulGemLine` now skips three-gem candidate lines when the
  active player's buff has `passive.noTake3`. This is LocalDev evidence automation only and does
  not change shared gameplay, Electron UX, or Unity production rules.
- Focused rerun `clients/unity/artifacts/unity/editmode-draft-smoke-notake3-rerun-20260512-results.xml`
  passed 1/1 from `2026-05-12 23:02:00Z` to `23:02:15Z`; full rerun
  `clients/unity/artifacts/unity/editmode-full-20260512-post-notake3-fix-results.xml` passed 91/91
  from `2026-05-12 23:02:38Z` to `23:28:37Z`.
- This refresh strengthens current EditMode evidence but does not change the open
  replacement-candidate risks for arbitrary broad product-surface play, LAN, online, Visual Lab, or
  release-runtime TypeScript bridge packaging.

## 2026-05-12 Post-No-Take-3 Built-Player Smoke Update

- `artifacts/unity/build-post-notake3-20260512.log` reports Windows player build exit code 0 from
  the current post-no-take-3 smoke-driver tree.
- `artifacts/unity/built-player-smoke/smoke-2026-05-12Tpost-notake3-draft.launcher.json` passed
  with exit code 0 and no timeout. It starts the rebuilt `WindowsPlayer` with seed
  `unity-product-surface-draft-release-path-20260512`, uses
  `draftActionPreference=reroll-each-player-first`, records `reroll_draft_pool`, `choose_boon`,
  and two legal post-draft `take_gems` events, exports/imports/reviews six live Replay vNext
  events, and preserves final hash `857c3e58`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-post-notake3-draft.json`
  validates 1/1 report, six commands, seven mailbox events, action families `choose_boon`,
  `reroll_draft_pool`, and `take_gems`, and status `incomplete-evidence`.
- `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-post-notake3-combined.json`
  revalidates the prior 26-report curated aggregate plus the post-fix draft launcher with every
  required action family and every current release-path requirement flag enabled. It validates
  27/27 reports, 716 commands, 812 mailbox events, all 21 required action families, replay
  release-path coverage for invalid/corrupt/hash-mismatch/overwrite cases, and status
  `incomplete-evidence`.
- This reduces the risk that the latest EditMode-only smoke fix is unrepresented in the built
  Windows player, but it does not reduce the replacement-candidate risks for arbitrary broad
  product-surface play, LAN, online, Visual Lab, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Mailbox Audit-File Risk Update

- `tools/migration/summarize-unity-built-player-smokes.mjs` now treats
  `--require-audited-mailbox-responses` as a file-backed guard: every retained mailbox
  `auditResponse` path must resolve under the launcher's mailbox directory, exist, parse as JSON,
  and match the launcher event's `ok`, `actionType`, and rejection code summary.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` now passed 16/16, including
  fail-closed cases for a missing retained audit file, invalid JSON, a mismatched retained response
  summary, a missing executable, an executable outside the governed build path, and an empty
  stdout log, a mismatched stdout byte count, a missing stderr log, a mismatched stderr byte count,
  an empty player log, a mismatched player-log byte count, a missing nested smoke report, invalid
  nested smoke-report JSON, a mismatched nested smoke report, and outside-artifacts evidence paths.
- The replay release-path file-backed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-filebacked.json`
  passes with 9/9 valid parsed audit response files and hash `f9eb9e83`. The combined audited
  game-over/invalid-action file-backed aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-filebacked.json`
  passes with 365/365 valid parsed audit response files, one invalid-action release-path report,
  three game-over reports, winners `p1`/`p2`, and status `incomplete-evidence`.
- This reduces the risk that audited built-player mailbox evidence degrades into path-only claims,
  but it does not solve the release-runtime TypeScript bridge packaging decision or the remaining
  product-scope blockers.

## 2026-05-13 Built-Player Executable Path Risk Update

- `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless the launcher
  report's executable exists and resolves under the governed ignored Windows build output
  `artifacts/unity/build/windows/`.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 6/6, including fail-closed
  cases for a missing executable and an executable outside the governed build path.
- The executable-guard replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-exe-guard.json`
  passes with 1/1 report, 9/9 valid parsed audit response files, and hash `f9eb9e83`. The combined
  executable-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-exe-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, and status
  `incomplete-evidence`.
- This reduces the risk that retained launcher reports claim a built player without proving the
  governed Windows build output, but it does not solve arbitrary product-surface breadth,
  LAN/online/Visual Lab scope, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Stdout Capture Risk Update

- `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless the retained
  launcher report's captured stdout file exists and is non-empty.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` now passed 16/16, retaining the
  fail-closed empty-stdout case and adding the later mismatched-stdout-byte, empty-player-log, and
  mismatched-player-log-byte cases plus stderr file/byte-count, nested smoke-report, and artifact
  path cases.
- The stdout-guard replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stdout-guard.json`
  passes with 1/1 report, 9/9 valid parsed audit response files, and hash `f9eb9e83`. The combined
  stdout-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stdout-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, and status
  `incomplete-evidence`.
- This reduces the risk that retained launcher reports claim stdout evidence from an empty file,
  but it does not solve arbitrary product-surface breadth, LAN/online/Visual Lab scope, or
  release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Stdout Byte Risk Update

- `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless the retained
  stdout file exists, is non-empty, and matches the launcher's reported `stdoutBytes` value.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 16/16, including the
  fail-closed mismatched-stdout-byte case.
- The stdout-byte-guard replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stdout-byte-guard.json`
  passes with 1/1 report, 9/9 valid parsed audit response files, and hash `f9eb9e83`. The combined
  stdout-byte-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stdout-byte-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, and status
  `incomplete-evidence`.
- This reduces the risk that retained launcher reports claim stdout evidence from mismatched
  metadata, but it does not solve arbitrary product-surface breadth, LAN/online/Visual Lab scope, or
  release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Stderr Byte Risk Update

- `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless the retained
  stderr file exists and matches the launcher's reported `stderrBytes` value. Empty stderr remains
  valid for successful runs.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 16/16, including
  fail-closed missing-stderr-file and mismatched-stderr-byte cases.
- The stderr-byte-guard replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stderr-byte-guard.json`
  passes with 1/1 report, 9/9 valid parsed audit response files, hash `f9eb9e83`, and retained
  stdout/stderr/player-log paths in the summary. The combined stderr-byte-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stderr-byte-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, retained stdout/stderr/player-log
  paths, and status `incomplete-evidence`.
- This reduces the risk that retained launcher reports claim stderr evidence from missing files or
  mismatched metadata, but it does not solve arbitrary product-surface breadth, LAN/online/Visual
  Lab scope, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Nested Smoke-Report Risk Update

- `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless the retained
  nested smoke report file exists, parses as JSON, and matches the launcher-embedded smoke report.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 16/16, including
  fail-closed missing nested smoke-report, invalid nested smoke-report JSON, and mismatched nested
  smoke-report cases.
- The nested-smoke-report-guard replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-nested-smoke-report-guard.json`
  passes with 1/1 report, 9/9 valid parsed audit response files, hash `f9eb9e83`, and retained
  stdout/stderr/player-log paths in the summary. The combined nested-smoke-report-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-nested-smoke-report-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, retained stdout/stderr/player-log
  paths, and status `incomplete-evidence`.
- This reduces the risk that retained launcher reports claim built-player proof from path-only or
  stale nested smoke reports, but it does not solve arbitrary product-surface breadth,
  LAN/online/Visual Lab scope, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Artifact Path Risk Update

- `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless retained
  launcher reports, stdout/stderr/player logs, nested smoke reports, and bridge mailbox directories
  resolve under `artifacts/unity/built-player-smoke/`.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 16/16, including a
  fail-closed outside-artifacts evidence path case.
- The artifact-path-guard replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-artifact-path-guard.json`
  passes with 1/1 report, 9/9 valid parsed audit response files, hash `f9eb9e83`, and retained
  stdout/stderr/player-log paths in the summary. The combined artifact-path-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-artifact-path-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, retained stdout/stderr/player-log
  paths, and status `incomplete-evidence`.
- This reduces the risk that retained launcher reports claim built-player evidence from outside the
  ignored built-player smoke artifact boundary, but it does not solve arbitrary product-surface
  breadth, LAN/online/Visual Lab scope, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Mailbox Audit Path Risk Update

- `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless retained
  mailbox `auditResponse` files resolve inside the built-player smoke's bridge mailbox directory.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 17/17, including a
  fail-closed escaped audit-response path case.
- The mailbox-audit-path-guard replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-mailbox-audit-path-guard.json`
  passes with 1/1 report, 9/9 valid parsed audit response files, hash `f9eb9e83`, and retained
  stdout/stderr/player-log paths in the summary. The combined mailbox-audit-path-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-mailbox-audit-path-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, retained stdout/stderr/player-log
  paths, and status `incomplete-evidence`.
- This reduces the risk that retained audited bridge responses are read from outside the retained
  mailbox evidence tree, but it does not solve arbitrary product-surface breadth, LAN/online/Visual
  Lab scope, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Mailbox Audit Request-Name Risk Update

- `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless retained
  mailbox `auditResponse` file names match the launcher event request names.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 18/18, including a
  fail-closed mismatched audit-response request-name case.
- The mailbox-audit-request-name-guard replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-mailbox-audit-request-name-guard.json`
  passes with 1/1 report, 9/9 valid parsed audit response files, hash `f9eb9e83`, and retained
  stdout/stderr/player-log paths in the summary. The combined
  mailbox-audit-request-name-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-mailbox-audit-request-name-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, retained stdout/stderr/player-log
  paths, and status `incomplete-evidence`.
- This reduces the risk that one retained audited bridge response is reused as another request's
  evidence, but it does not solve arbitrary product-surface breadth, LAN/online/Visual Lab scope,
  or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Player-Log Byte Risk Update

- `tools/migration/summarize-unity-built-player-smokes.mjs` now fails closed unless the retained
  Unity player log exists, is non-empty, and matches the launcher's reported byte count.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 16/16, including fail-closed
  mismatched-stdout-byte, missing-stderr-file, mismatched-stderr-byte, empty-player-log, and
  mismatched-byte-count plus nested smoke-report and artifact path cases.
- The player-log-guard replay release-path aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-playerlog-guard.json`
  passes with 1/1 report, 9/9 valid parsed audit response files, and hash `f9eb9e83`. The combined
  player-log-guard aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-playerlog-guard.json`
  passes with 8/8 reports, 365/365 valid parsed audit response files, one invalid-action
  release-path report, three game-over reports, winners `p1`/`p2`, and status
  `incomplete-evidence`.
- This reduces the risk that retained launcher reports claim Unity player-log evidence from empty
  or mismatched metadata, but it does not solve arbitrary product-surface breadth, LAN/online/Visual
  Lab scope, or release-runtime TypeScript bridge packaging.

## 2026-05-13 TypeScript Bridge Output Temp Cleanup Risk Update

- `tools/migration/unity-rules-engine-bridge.ts` now removes the CLI `--out` temp response file
  when atomic response publication fails after writing the temp file.
- `tools/migration/unity-rules-engine-bridge.test.ts` now forces output publication failure by
  targeting an existing directory and asserts that no `response.json.*.tmp` file remains.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed 33/33.
- This reduces stale response-temp-file risk in the LocalDev/built-player mailbox bridge boundary,
  but it does not solve arbitrary product-surface breadth, LAN/online/Visual Lab scope, or
  release-runtime TypeScript bridge packaging.

## 2026-05-13 TypeScript Bridge Structured Error Output Risk Update

- `tools/migration/unity-rules-engine-bridge.ts` now writes a structured `ok=false`
  `BRIDGE_EXECUTION_FAILED` JSON response to `--out` when request parsing or another unhandled CLI
  infrastructure error occurs after argument parsing.
- The original stderr diagnostics and non-zero process exit remain intact, so automation can retain
  both machine-readable response evidence and process-failure evidence.
- `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts` passed 34/34, including
  malformed request JSON with `--out`.
- This reduces mailbox timeout ambiguity for malformed LocalDev bridge requests, but it does not
  solve arbitrary product-surface breadth, LAN/online/Visual Lab scope, or release-runtime
  TypeScript bridge packaging.

## 2026-05-13 TypeScript Bridge CLI Rejected-Command Output Risk Update

- `tools/migration/unity-rules-engine-bridge.test.ts` now covers the adjacent valid-request path:
  a CLI-spawned wrong-actor `TAKE_GEMS` request writes structured `ok=false` rejection JSON to
  `--out`, exits with status `2`, preserves the supplied state/hash, leaves stdout empty, and
  leaves no temp response file.
- Targeted validation
  `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts -t "structured output-file rejection"`
  passed 2/2 targeted tests.
- Full bridge validation `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts`
  passed 35/35 after the rejected-command output guard.
- This reduces the risk that built-player mailbox callers treat rejected gameplay commands as
  missing-response timeouts, but it does not solve arbitrary product-surface breadth,
  LAN/online/Visual Lab scope, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Failure Reason Coherence Risk Update

- `tools/migration/summarize-unity-built-player-smokes.mjs` now collects `failureReason` values
  from the retained launcher, wrapper, nested product-surface smoke, and every known release-path
  section.
- Passing retained reports now fail closed when any collected failure reason is non-empty.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 23/23, including a stale
  nested product-surface `failureReason` negative case.
- The failure-reason digest aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-failure-reason-guard.json`
  passed 1/1 with zero retained failure reasons, replay release-path coverage, hash `bd4c4bd0`, and
  status `incomplete-evidence`.
- This reduces hidden failure-reason risk in retained LocalDev built-player evidence, but it does
  not solve arbitrary product-surface breadth, LAN/online/Visual Lab scope, or release-runtime
  TypeScript bridge packaging.

## 2026-05-13 Built-Player Mailbox Audit Digest Risk Update

- `tools/migration/run-unity-built-player-smoke.mjs` now records `auditResponseBytes` and
  `auditResponseSha256` for each retained mailbox audit response before delivering the same JSON to
  the Unity mailbox response path.
- `tools/migration/summarize-unity-built-player-smokes.mjs` now supports
  `--require-audited-mailbox-response-digests` and fails closed when the retained audit response
  file's current bytes or SHA-256 do not match the launcher event metadata.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 20/20, including
  fail-closed digest-mismatch and missing digest metadata cases.
- Fresh built-player smoke
  `artifacts/unity/built-player-smoke/smoke-2026-05-13Tmailbox-digest.launcher.json` passed with
  two live `take_gems` commands, three digest-bearing audited mailbox responses, replay release-path
  coverage, hash `bd4c4bd0`, stdout/player-log capture, and no failure reason. Digest aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-guard.json`
  passed 1/1 with 3/3 valid parsed audit responses, 3/3 valid audit response digests, replay
  release-path coverage, and status `incomplete-evidence`.
- This reduces retained audit-response drift risk in built-player LocalDev evidence, but it does
  not solve arbitrary product-surface breadth, LAN/online/Visual Lab scope, or release-runtime
  TypeScript bridge packaging.

## 2026-05-13 Built-Player Launcher Args Risk Update

- `tools/migration/summarize-unity-built-player-smokes.mjs` now supports `--require-launcher-args`
  and fails closed when retained launcher command-line arguments do not match the embedded smoke
  wrapper metadata.
- The guard validates `--gemduel-built-player-smoke`, retained player-log and smoke-report paths,
  seed, max steps, start mode, idle/draft action preferences, release-path include flags, and
  replay/replay-review release directories when present.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` passed 22/22, including
  fail-closed retained seed-argument mismatch coverage.
- The launcher-args digest aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-launcher-args-guard.json`
  passed 1/1 with `launcherArgsMatchSmoke=true`, 3/3 valid audit response digests, replay
  release-path coverage, hash `bd4c4bd0`, and status `incomplete-evidence`.
- This reduces retained launcher command-line drift risk, but it does not solve arbitrary
  product-surface breadth, LAN/online/Visual Lab scope, or release-runtime TypeScript bridge
  packaging.

## 2026-05-13 Built-Player Launcher Process Guard Test Update

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now proves the existing retained
  launcher process guards fail closed when an otherwise-valid launcher report records `exitCode: 1`
  or `timedOut: true`.
- Focused validation `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`
  passed 67/67.
- This reduces the risk that retained built-player evidence silently accepts failed or timed-out
  Windows player launches, but it does not solve arbitrary product-surface breadth, LAN/online/
  Visual Lab scope, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Success-Flag Guard Test Update

- `tools/migration/summarize-unity-built-player-smokes.test.ts` now proves the existing retained
  success-flag guards fail closed when an otherwise-valid launcher report records `launcher.ok:
false`, nested wrapper `ok: false`, or nested product-surface smoke `ok: false`.
- Focused validation `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`
  passed 70/70.
- This reduces the risk that retained built-player evidence silently accepts failed launcher,
  wrapper, or product-surface smoke status flags, but it does not solve arbitrary product-surface
  breadth, LAN/online/Visual Lab scope, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Built-Player Required-Flag Matrix Metadata Update

- `tools/migration/summarize-unity-built-player-smokes.mjs` now records every required
  release-path switch in the aggregate matrix `check` metadata instead of only recording the draft
  requirement.
- `tools/migration/summarize-unity-built-player-smokes.test.ts` now proves that a failed aggregate
  still exposes all required release-path flags in machine-readable form.
- Focused validation `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`
  passed 71/71, and `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed.
- The retained aggregate refresh
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-required-flag-metadata-refresh.json`
  passed 37/37 reports with all required release-path metadata flags set to `true`, six game-over
  reports, winners `p1`/`p2`, and status `incomplete-evidence`.
- This reduces audit ambiguity around which retained release-path gates were requested, but it does
  not solve arbitrary product-surface breadth, LAN/online/Visual Lab scope, or release-runtime
  TypeScript bridge packaging.

## 2026-05-13 Replay Release-Path No-Mutation Evidence Update

- `LocalDevReplayReleasePathSmoke` now retains explicit rejected-import no-mutation fields for replay
  release-path cases: accepted status, expected error fragment, before/after state hashes,
  before/after recorded-event counts, and `liveReplayStateUnchanged`.
- `tools/migration/summarize-unity-built-player-smokes.mjs` now supports
  `--require-replay-release-path-no-mutation`, which fails closed if rejected import cases mutate
  state, record replay events, or omit explicit no-mutation evidence.
- Focused validation `pnpm exec vitest run tools/migration/summarize-unity-built-player-smokes.test.ts`
  passed 73/73, and `node --check tools/migration/summarize-unity-built-player-smokes.mjs` passed.
- Windows player build validation `artifacts/unity/build-replay-nomutation-20260513.log` reports
  `Build Finished, Result: Success.`.
- Focused built-player strict aggregate
  `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-replay-nomutation.json`
  passed one fresh LocalDev Windows-player report with `--require-replay-release-path-no-mutation`,
  audited mailbox response/digest checks, all replay release-path cases, eight rejected-import
  no-mutation case records, final hash `1acd96c`, and status `incomplete-evidence`.
- This improves replay release-path auditability, but it does not solve arbitrary product-surface
  breadth, LAN/online/Visual Lab scope, or release-runtime TypeScript bridge packaging.

## 2026-05-13 TypeScript Bridge Apply Metadata Hash Guard Update

- `tools/migration/unity-rules-engine-bridge.test.ts` now proves a live bridge `apply` request
  carrying extra LocalDev platform/user metadata produces the same replay-state hash as the
  undecorated legal `TAKE_GEMS` command and keeps those identifiers out of serialized gameplay
  state.
- Focused validation `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts`
  passed 36/36; `pnpm typecheck` and `pnpm lint` also passed from Turbo cache.
- This reduces LocalDev/evidence bridge boundary risk around accidental platform/user identity
  leakage into gameplay hashes, but it does not solve arbitrary product-surface breadth,
  LAN/online/Visual Lab scope, or release-runtime TypeScript bridge packaging.

## 2026-05-13 Final Gate Timeout Risk Update

- The first full `pnpm parity:electron-unity` attempt timed out after about 604 seconds and only
  partial artifacts were retained under
  `artifacts/electron-unity-parity/2026-05-13T12-14-12-995Z`. The longer rerun passed after about
  805 seconds and wrote `artifacts/electron-unity-parity/2026-05-13T14-15-37-411Z` with
  `unity.ok: true` and `counts.Equivalent: 54`. The remaining risk is timeout-budget fragility for
  long parity commands, not a current configured parity failure.
- Fresh full Unity EditMode timeout risk was reduced in this continuation. The first timestamped
  run hit a too-short 22-minute guard, the longer rerun produced real 90/91 evidence, and the
  smoke-driver fix rerun `artifacts/unity/editmode-final-validation-fixed-20260513-results.xml`
  passed 91/91.
- Windows player build risk is lower for this run because
  `artifacts/unity/build-final-validation-fixed-20260513.log` records
  `Build Finished, Result: Success.` and batchmode return code 0.
- The refreshed repo/local gates and passing configured parity reduce regression risk, but they do
  not remove product-scope blockers. LAN, online, Visual Lab, arbitrary broad Local PvP, broader
  release-path/recovery coverage, and release-runtime TypeScript bridge packaging remain open.
