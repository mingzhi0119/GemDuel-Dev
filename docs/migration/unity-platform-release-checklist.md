# Unity Platform Release Checklist

Last updated: 2026-05-11

This checklist is documentation only for release-candidate readiness. It does not authorize Steam,
Epic, app IDs, product IDs, partner files, SDK binaries, credentials, upload artifacts, or live
platform callbacks.

## LocalDev Release Candidate

| Item                                               | Required evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Status             |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Windows target remains the only Unity build target | `BuildWindows.Build` uses `StandaloneWindows64`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Present            |
| Build output stays ignored                         | Output path under `artifacts/unity/build/windows/`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Present            |
| LocalDev platform adapter initializes without SDKs | `LocalDevPlatformServices.Init()`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Present            |
| Platform state excluded from gameplay hash         | Replay hash uses replay-state snapshot only                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Present            |
| Fresh local PvP start through rules boundary       | Visible/semantic Local PvP start and semantic roguelike draft start now call `IGameRulesEngine`; the bridge applies every committed golden replay event and one freshly simulated Local PvP game-over replay as commands with per-step hash checks; fresh product-surface EditMode tests drive three seeded Unity Local PvP games from semantic start to game over; broader arbitrary product UI and full Electron-scope coverage remain incomplete                                                                                                                                                                                                                                                            | Incomplete         |
| Replay import/export round trip                    | Visible LocalDev import/export controls, Replay vNext JSON file round trip, review undo/redo, final game-over fixture hash `4b6ab7ec`, baseline bridge-backed live command recording/export/import, affordable Joker live recording/export/import review, affordable reserved-buy live recording/export/import review, pending Joker recovery continuation, deck-peek modal recording/review, three seeded fresh product-surface game-to-game-over export/import/review proofs, and peek/modal invalid no-recording proof passed in EditMode                                                                                                                                                            | Incomplete         |
| Settings survive restart                           | LocalDev settings save/load plus reopened-controller reload evidence, including locale, surface theme, sound, and LAN opponent card/gem visibility preferences                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Passed             |
| Recovery after close/reopen                        | LocalDev autosave restores bridge init, live game state, pending Joker color selection, and live Replay vNext stream, then continues a bridge-backed command after restore in EditMode                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Passed             |
| Invalid actions do not mutate gameplay state       | Bridge invalid-actor, no-replay-state-change, direct Joker bypass, Joker missing-pending/pending-mismatch, unaffordable reserved-buy no-replay-state-change, take-gems empty/gold/gap/wrong-phase, replenish empty-bag/wrong-phase, bonus wrong-color/empty/wrong-phase, discard not-owned/wrong-phase, steal gold/not-owned/wrong-phase, draft buff unavailable/wrong-phase, royal unavailable/wrong-actor/wrong-phase, reserve-card missing-Gold/non-Gold/pending-mismatch/full-row, deck-reserve empty-deck/missing-Gold/full-row, discard-reserved ability/not-owned/wrong-phase, privilege activation no-charge/no-target, privilege use no-charge/invalid-target, wrong-phase draft reroll, wrong-phase privilege cancel, wrong-phase reserve cancel, no-ability peek, wrong-phase peek, no-modal close, and blocked-modal close proofs pass; Unity also replays all 54 committed rejection-manifest cases through the live bridge with unchanged replay-state hashes and unchanged live recording counts; broader release/online edge matrix pending | Incomplete         |
| Unity EditMode tests pass                          | `artifacts/unity/editmode-final-after-lan-settings-20260511-results.xml` reported 62/62 passed against the 11-fixture manifest, expanded rejection coverage, LAN visibility settings persistence, manifest-driven Unity bridge rejection proof, and three seeded fresh product-surface game-over proofs                                                                                                                                                                                                                                                                                                                                                                                          | Passed             |
| Windows build succeeds                             | `artifacts/unity/build-after-lan-settings-20260511.log` reports `Build Successful`, `Build Finished, Result: Success.`, and batchmode exit code 0                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Passed             |
| Repo gates pass                                    | Coverage, bundle budget, benchmarks, lifecycle certification, governance artifacts, and governance evidence checks passed in the latest run                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Passed             |
| Secrets/cache/build-output hygiene passes          | `pnpm secrets:check`, `pnpm release:artifacts:check`, and generated-output review passed for local evidence paths                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Passed             |

## Deferred Platform Work

| Platform area                 | Status  | Reason                                                                    |
| ----------------------------- | ------- | ------------------------------------------------------------------------- |
| Steamworks SDK                | Blocked | Requires explicit user authorization and official account/app context     |
| Epic Online Services SDK      | Blocked | Requires explicit user authorization and official product context         |
| App IDs/product IDs           | Blocked | Partner-only metadata must not be committed                               |
| Platform upload tooling       | Blocked | Upload outputs and credentials are forbidden in this repo                 |
| Live achievements/cloud saves | Blocked | Must map game-defined keys/schema after LocalDev release candidate passes |
| Crossplay/invites/presence    | Blocked | Requires product decision and platform-account authorization              |

## Latest Local Gate Evidence

- `pnpm parity:electron-unity`: passed, 54 equivalent rows in
  `artifacts/electron-unity-parity/2026-05-11T15-31-10-143Z/parity-matrix.md`.
- Replay parity: passed for the 11 committed fixtures, with verifier-enforced `joker-buy`,
  `reserved-buy`, `reserve-cancel`, `reserve-deck`, `discard-reserved`, `privilege`, `peek-modal`,
  `draft-reroll`, `draft-p2-reroll`, and `royal-handoff` coverage tags, plus 54 hash-locked wrong-phase, resource, ownership,
  mismatch, follow-up, modal, and derived-state rejection oracle cases in
  `fixtures/replay-golden/rejection-manifest.json`. New hashes are `2648a9b6` for two-step
  Joker color selection/buy, `56188c9b` for Joker reserved buy, `df284305` for reserve-deck,
  `dcaaa5b8` for discard-reserved, `63991d2` for privilege, `33285b45` for peek-modal, and
  `a8eeefc9` for draft-reroll with
  ordered P2 reroll.
- Bridge regression: `pnpm exec vitest run tools/migration/unity-rules-engine-bridge.test.ts`
  passed 30 tests, including one freshly simulated deterministic Local PvP game-over replay applied
  as bridge commands with per-step replay-state hash checks, plus live-bridge rejection of
  infrastructure/debug commands without state mutation.
- Unity targeted rejection-manifest proof:
  `artifacts/unity/editmode-rejection-manifest-20260511-results.xml` passed 1/1. The test loads
  every committed rejection-manifest case, primes Unity from the TypeScript replay-state oracle,
  applies the invalid action through the live `IGameRulesEngine` bridge, and checks unchanged
  replay-state hash plus unchanged live recording count.
- Unity targeted fresh product game-over proof:
  `artifacts/unity/editmode-fresh-product-game-over-20260511-results.xml` passed 1/1. The test
  starts a fresh Local PvP game through the Unity product semantic surface, drives visible product
  commands to game over, verifies live replay recording hashes, exports Replay vNext JSON, imports
  it into a separate controller, and reviews to the same final hash.
- Unity targeted seeded product game-over proof:
  `artifacts/unity/editmode-fresh-product-seeded-20260511-results.xml` passed 2/2. The
  parameterized test drives two additional fresh Local PvP seeds through the same Unity semantic
  product surface, export/import, and replay-review path.
- Unity targeted LAN visibility settings proof:
  `artifacts/unity/editmode-settings-lan-visibility-20260511-results.xml` passed 1/1. The settings
  test clicks visible LAN opponent card and gem visibility controls, persists both values, and
  reloads them on a reopened controller.
- Unity catalog export/check: `fixtures/unity-catalog/manifest.json` was regenerated and
  `pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-catalogs.ts --check`
  passed.
- Unity EditMode: passed, 62/62 tests in
  `artifacts/unity/editmode-final-after-lan-settings-20260511-results.xml` after live bridge routing for semantic start, roguelike draft
  start/reroll, market reserve,
  reserved-buy preview dispatch, unaffordable reserved-buy rejection, direct Joker buy bypass
  rejection, affordable Joker color-selection export/reimport review, affordable reserved-buy export/reimport review, Joker missing-pending/pending-mismatch color-selection rejection, discard-reserved preview dispatch, Joker color-selection dispatch, settings reopen
  persistence including LAN visibility controls, LocalDev bridge-backed gameplay recovery including live replay
  stream preservation after reopen, follow-up phases, privilege activation/use/cancel, reserve
  cancel, deck reserve, and Replay vNext import/export/review round trip through visible LocalDev
  controls plus bridge-backed live command recording/export/import, deck-peek modal review proof,
  take-gems empty/gold/gap/wrong-phase rejection proof, replenish empty-bag/wrong-phase rejection
  proof, bonus wrong-color/empty/wrong-phase rejection proof, discard not-owned/wrong-phase
  rejection proof, steal gold/not-owned/wrong-phase rejection proof, draft buff
  invalid/wrong-phase rejection proof, royal unavailable/wrong-actor/wrong-phase rejection proof,
  reserve-card missing-Gold/non-Gold/pending-mismatch/full-row rejection proof, deck-reserve
  empty-deck/missing-Gold/full-row rejection proof, discard-reserved not-owned/wrong-phase
  rejection proof, privilege activation no-charge/no-target, privilege use
  no-charge/invalid-target rejection proof, wrong-phase draft-reroll/privilege-cancel/reserve-cancel
  rejection proof, direct Joker bypass rejection proof, affordable Joker replay review proof, affordable reserved-buy replay review proof, pending Joker recovery proof, Joker missing-pending/pending-mismatch
  rejection proof, unaffordable reserved-buy no-mutation/no-recording proof, peek/modal
  invalid, wrong-phase peek, blocked-modal no-mutation/no-recording proof, and the 54-case
  manifest-driven Unity bridge rejection proof in
  `artifacts/unity/editmode-final-after-lan-settings-20260511-results.xml`.
- Unity Windows build: `artifacts/unity/build-after-lan-settings-20260511.log` reports success and
  batchmode exit code 0.
- `pnpm build` and `pnpm bundle:check`: passed; Vite reported
  `assets/presentation-layer-BkkJxzOE.js` at 583.19 kB, and the bundle budget script observed
  569.52 KiB against the 600 KiB warning threshold.
- `pnpm test:coverage`: passed, 177 files and 1108 tests; lifecycle dashboard branch coverage was
  89.47% against the 88% minimum.
- `pnpm bench`: passed; `apply-action-take-gems` median was 6.091 ms and p95 was 6.905 ms.
- `pnpm lifecycle:certify`, `pnpm governance:artifacts -- --out-dir artifacts/governance`,
  `pnpm governance:evidence:check -- --artifacts-dir artifacts/governance`, and
  `pnpm governance:dashboard`: passed.
