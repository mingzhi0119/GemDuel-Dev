# Unity Product Scope Map

Last updated: 2026-05-13

Source of truth: `apps/desktop/src/app/routes/GemDuelRoutes.tsx`,
`apps/desktop/src/App.tsx`, `apps/desktop/src/types/ui.ts`, and the shell/chrome/replay files
referenced below. Electron remains the player-facing oracle.

## Route And Surface Inventory

| Electron route or surface         | Current Electron evidence                                         | Unity migration status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Required parity evidence                                                                                                                                                 | Completion status |
| --------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| Start/config menu                 | `GameConfigMenu`, `setup=classic`, `setup=roguelike`              | Main menu shell exists and visible Local PvP start now enters the rules bridge; fixture loading is explicit in parity setup                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Fresh local game starts through the rules boundary without fixture state                                                                                                 | Incomplete        |
| Local PvP setup                   | `startGame('LOCAL_PVP')` in `App.tsx`                             | TypeScript bridge can apply commands; Unity UI wiring now covers start, board, market/reserved reserve/buy/discard/cancel, and core follow-ups; a five-scenario bounded product-surface matrix plus built-player LocalDev smoke reports prove live replay/review for bounded action-family coverage, including royal, steal, bonus, privilege activation/use/cancel, draft reroll/select, post-no-take-3 rebuilt-player draft replay hash `857c3e58`, invalid-action no-mutation/no-recording, peek-modal open/close, recovered invalid-action no-mutation/no-recording, reserved discard, reserved buy, reserve cancel, reserve deck, Joker buy/color selection, deck-reserve cancel, three deterministic built-player game-over proofs, one recovery save/load/continue proof, one settings save/load proof, one rulebook/restart chrome proof, and one replay-review visible undo/redo proof in the 2026-05-12 evidence, but not arbitrary full-surface play                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Arbitrary Local PvP from fresh game start to game over                                                                                                                   | Blocked           |
| Roguelike/buff setup              | `GameConfigMenu` plus `DraftScreen`                               | Live roguelike start and draft-level reroll now route through the rules bridge; the built Windows player has fresh roguelike LocalDev smokes that start in draft, reroll and select for both players, record live replay events, export/import/review the replay, and preserve final hashes `851b6356` and post-no-take-3 `857c3e58`; committed oracle coverage includes P1 select, P2 reroll/select ordering, online reroll rejection, and stale-pool P2 select rejection before P1 locks a buff                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Real draft select/release paths and broader rejection paths through rules boundary                                                                                       | Incomplete        |
| Draft/buff selection              | `DraftScreen`, `SELECT_BUFF`, `REROLL_DRAFT_POOL`                 | P1/P2 fixture draft and hover/click evidence exists; live P1 reroll has bridge and EditMode target proof; unavailable and wrong-phase `SELECT_BUFF` plus wrong-phase `REROLL_DRAFT_POOL` reject without state/replay mutation; `local-pvp-draft-reroll` hash-locks P1 reroll, P1 select, P2 reroll, and P2 select; built-player smoke `smoke-2026-05-12T05-44-04-969Z.launcher.json` covers `reroll_draft_pool` and `choose_boon` for both players from a fresh roguelike start; built-player invalid-action smoke `smoke-2026-05-12T06-34-40-146Z.launcher.json` rejects wrong-phase `SELECT_BUFF` and `REROLL_DRAFT_POOL` without mutation or recording                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Both players can select and reroll from live state with broader release-path coverage                                                                                    | Incomplete        |
| Main gameplay shell               | `GameShell`, `GamePlaySurface`, `DesktopStage`                    | Unity presentation shell exists                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Semantic keys, click rectangles, state transitions, screenshots at required viewports                                                                                    | Incomplete        |
| Board take-gems flow              | `useBoardInteractionHandlers`, `TAKE_GEMS`                        | Unity visible selection can now route through the bridge for live play; empty, gold-cell, gapped, no-take-3 buff, out-of-bounds, and wrong-phase selections reject without state/replay mutation, including no-take-3 hash `8e546f4c` and out-of-bounds hash `e1b5e1bf`; built-player invalid-action release-path proof rejects empty and inactive-player `TAKE_GEMS` without mutation or recording, and recovered invalid-action release-path proof rejects inactive-player `TAKE_GEMS` after recovery while preserving hash `24a87497` and recorded event count 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Broader legal board-selection sequences and full UI parity                                                                                                               | Incomplete        |
| Replenish/end-turn                | `REPLENISH` action and parity scenario                            | Visible live replenish routes through the bridge; empty-bag and wrong-phase replenish reject without state/replay mutation; configured parity still uses replay fixture revisions                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Full-game live replenish from current state without replay event lookup                                                                                                  | Incomplete        |
| Bonus gem follow-up               | `TAKE_BONUS_GEM`                                                  | Unity live bonus-gem target now routes through the bridge; focused `editmode-bonus-steal-phase-resolution-20260512-results.xml` starts fresh LocalDev, applies a valid live `TAKE_BONUS_GEM` from controlled `BONUS_ACTION`, records one Replay vNext event, clears the selected board cell, increments inventory, resolves to `IDLE`, hands turn to `p2`, and keeps the live replay summary hash aligned; wrong-color, empty-cell, out-of-bounds, wrong-phase, and wrong-actor rejection preserve state/replay, including out-of-bounds hash `329600a9`; focused `editmode-follow-up-wrong-actor-rejection-20260512-results.xml` rejects actor-envelope bonus commands without state or replay mutation; fixture parity also exists; the 2026-05-12 built-player bonus-family smoke records successful `take_bonus_gem` follow-ups from `BONUS_ACTION` with replay hash preservation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Remaining release-path and broader order behavior                                                                                                                        | Incomplete        |
| Steal follow-up                   | `STEAL_GEM`                                                       | Unity live steal target now routes through the bridge; focused `editmode-bonus-steal-phase-resolution-20260512-results.xml` starts fresh LocalDev, applies a valid live `STEAL_GEM` from controlled `STEAL_ACTION`, records one Replay vNext event, transfers the opponent gem, resolves to `IDLE`, hands turn to `p2`, and keeps the live replay summary hash aligned; gold, not-owned, wrong-phase, and wrong-actor rejection preserve state/replay; focused `editmode-follow-up-wrong-actor-rejection-20260512-results.xml` rejects actor-envelope steal commands without state or replay mutation; fixture parity also exists; the 2026-05-12 built-player smoke reaches `STEAL_ACTION` from a fresh LocalDev game and resolves two `steal_gem` commands with replay hash preservation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Remaining release-path and broader order behavior                                                                                                                        | Incomplete        |
| Discard excess gems               | `DISCARD_GEM`                                                     | Unity live discard target now routes through the bridge, including object-payload bridge normalization; focused `editmode-discard-phase-resolution-20260512-results.xml` starts fresh LocalDev, applies two live `DISCARD_GEM` commands from a controlled over-limit `DISCARD_EXCESS_GEMS` state, records two Replay vNext events, stays in discard after the first discard, then resolves to `IDLE` and hands turn to `p2` after the second; not-owned, wrong-phase, and wrong-actor rejection preserve state/replay; focused `editmode-follow-up-wrong-actor-rejection-20260512-results.xml` rejects actor-envelope discard commands without state or replay mutation; fixture parity also exists                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Release-path behavior and broader product-surface discard coverage                                                                                                       | Incomplete        |
| Market preview/buy/reserve        | `MarketLevelRow`, `CardPreviewOverlay`, market handlers           | Preview surface exists; live market buy/reserve/deck-reserve with Gold follow-up, affordable Joker color-selection plus replay review, pending Joker recovery continuation, reserve-gold, and visible reserve cancel route through bridge; replay manifest now has verifier-enforced `joker-buy`, `reserve-cancel`, and `reserve-deck` oracle coverage; built-player Joker release-path proof opens the visible market preview, buys through the visible preview primary action, selects visible color `red`, records ordered `initiate_buy_joker` and `buy_card`, and preserves hash `95c8a06c`; built-player reserve-cancel release-path proof opens visible market reserve controls, enters `RESERVE_WAITING_GEM`, cancels through the visible control, records `initiate_reserve` and `cancel_reserve`, and preserves hash `40bdddbf`; built-player reserve-deck proof opens visible market deck preview, initiates through the visible preview reserve control, completes the Gold follow-up through a visible board target, records `initiate_reserve_deck` and `reserve_deck`, and preserves hash `da89d9e5`; built-player deck-reserve cancel proof opens visible market deck preview, initiates deck reserve, cancels before Gold selection through the visible cancel control, records `initiate_reserve_deck` and `cancel_reserve`, leaves deck/reserved/Gold state unchanged, and preserves hash `62fa027f`; plain market `BUY_CARD` wrong-actor, direct Joker bypass, Joker wrong-actor initiation/color-follow-up, Joker missing-pending/pending-mismatch/missing-color/reserved-source selection, reserve-card wrong-actor initiation/resolution, reserve-cancel wrong-actor, missing-Gold/non-Gold/out-of-bounds/pending-mismatch/full-row, deck-reserve wrong-actor initiation/resolution plus empty-deck/missing-Gold/non-Gold/out-of-bounds/full-row, and wrong-phase reserve-cancel commands reject without state/replay mutation; Joker missing-color rejection preserves hash `d0a0e459`, Joker reserved-source rejection preserves hash `b5d9cbbf`, and the missing-color case caught/fixed the LocalDev bridge's prior implicit `red` fallback | Remaining broader market actor/order fixtures beyond the covered market-buy/Joker/reserve/deck-reserve/cancel guards, initiation mismatch, and remaining rejection paths | Incomplete        |
| Reserved-card preview/buy/discard | `PlayerZoneReservedColumn`, `DISCARD_RESERVED`                    | Live owned-card preview buy and discard dispatch routes through bridge; replay manifest now has verifier-enforced `reserved-buy` and `discard-reserved` oracle coverage; affordable reserved buy records/exports/reimports for replay review; built-player reserved-discard release-path proof reserves `c:125-gr#0`, opens the visible reserved preview, records `discard_reserved`, exports/imports/reviews the replay, and preserves hash `33909286`; built-player reserved-buy release-path proof reserves `c:155-bk#0`, opens the visible reserved preview, records reserved-source `buy_card`, exports/imports/reviews the replay, and preserves hash `47c0e9db`; unaffordable reserved buy, wrong-actor reserved-buy ownership-envelope, wrong-actor discard-reserved, discard-reserved not-owned, and wrong-phase rejections preserve state/replay                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Remaining reserved-buy edge fixtures and remaining discard-reserved edge fixtures                                                                                        | Incomplete        |
| Royal area                        | `SELECT_ROYAL_CARD`                                               | Unity live royal selection now routes through the bridge; focused `editmode-royal-phase-resolution-20260512-results.xml` starts fresh LocalDev, applies valid live `SELECT_ROYAL_CARD` from controlled `SELECT_ROYAL`, records one Replay vNext `select_royal` event, moves `r91-ro` from the royal deck to P1, resolves to `IDLE`, hands turn to `p2`, and keeps the live replay summary hash aligned; fixture verifier distinguishes next-player handoff from same-actor extra-turn; unavailable, wrong-actor, and wrong-phase royal selections reject without state/replay mutation; the 2026-05-12 built-player smoke reaches `SELECT_ROYAL` and resolves `choose_royal` from a fresh LocalDev run                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Broader actor-ordering, recovery breadth, and release-path behavior                                                                                                      | Incomplete        |
| Privilege activation/use/cancel   | `ACTIVATE_PRIVILEGE`, `USE_PRIVILEGE`, `CANCEL_PRIVILEGE`         | Unity live privilege activation/use/cancel can route through the bridge; activation no-charge/no-valid-board-target/wrong-actor, use no-charge/invalid-target/out-of-bounds/wrong-actor, and wrong-phase/wrong-actor cancel commands reject without state/replay mutation, including out-of-bounds hash `d8141986`; the 2026-05-12 built-player privilege smoke creates a normal rules-engine privilege from a fresh LocalDev launch, records `activate_privilege` and `use_privilege`, and the privilege-cancel release-path smoke records `activate_privilege` then visible-control `cancel_privilege` with replay review hash `efe66377`; focused `editmode-privilege-wrong-actor-rejection-20260512-results.xml` and `editmode-cancel-privilege-wrong-actor-rejection-20260512-results.xml` reject actor-envelope activation/use/cancel commands without state or replay mutation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Broader privilege recovery, ordering evidence, and release-path behavior                                                                                                 | Incomplete        |
| Active buff deck peek/modal       | `PEEK_DECK`, `CLOSE_MODAL`, active buff modal state               | Unity live deck peek opens a visible modal through the bridge and modal close records/reviews the cleared state; built-player smoke `smoke-2026-05-12T07-56-40-905Z.launcher.json` starts fresh roguelike LocalDev, selects `intelligence`, opens and closes the visible modal, records `select_buff`, `peek_deck`, and `close_modal`, and preserves replay review hash `8399eadd`; no-ability peek, wrong-phase peek, no-modal close, and blocked-modal close reject without state/replay mutation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Broader peek/modal edge and release-path coverage                                                                                                                        | Incomplete        |
| Replay import/export/review       | `useReplayIO`, `safeReplayImport`, `ReplayControls`, review state | Unity has visible LocalDev import/export controls, Replay vNext JSON file round trip, hash-checked undo/redo review navigation, baseline bridge-backed live command recording evidence, deck-peek modal recording/review proof, three seeded fresh product-surface game-to-game-over export/import/review proofs, five-scenario product-surface matrix export/import/review proof, EditMode and built-player release-path invalid/corrupt/hash-mismatch/overwrite recovery proof, a current audited replay release-path built-player proof with 9 retained mailbox responses and hash `f9eb9e83`, built-player smoke replay review proof including three built-player game-over replay reviews, built-player recovery replay continuation hash `8d4178f7`, built-player replay-review release-path final hash `db7fb1b7`, built-player draft reroll/select replay-review final hash `851b6356`, built-player invalid-action zero-event export/review hash `1a6afd3f`, built-player peek-modal export/import/review hash `8399eadd`, built-player recovered invalid-action continuation/review hash `d2b51b3f`, built-player privilege-cancel export/import/review hash `efe66377`, built-player reserved-discard export/import/review hash `33909286`, built-player reserved-buy export/import/review hash `47c0e9db`, built-player reserve-cancel export/import/review hash `40bdddbf`, built-player reserve-deck export/import/review hash `da89d9e5`, built-player Joker export/import/review hash `95c8a06c`, built-player deck-reserve cancel export/import/review hash `62fa027f`, and 65-case invalid-action no-recording manifest proof including no-pending cancel hash `3b87795f`, stale-pool P2 draft select hash `5c903209`, no-take-3 hash `8e546f4c`, coordinate-boundary hashes `e1b5e1bf`, `329600a9`, `fd6d5832`, `6173696c`, and `d8141986`, game-over action-after-winner hash `4b6ab7ec`, Joker missing-color hash `d0a0e459`, and Joker reserved-source hash `b5d9cbbf`                                                                                                                                                                           | Broader release-path file handling and arbitrary product-surface replay coverage                                                                                         | Incomplete        |
| Settings locale                   | `LocaleProvider`, `LocaleSwitch`                                  | Unity locale setting persists locally and reloads on a reopened controller; built-player settings release-path proof saves `en` through visible controls and reloads it in a fresh live-game controller without mutating gameplay state                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Broader Electron/Unity operation parity and release-path startup evidence                                                                                                | Incomplete        |
| Settings theme/surface            | `AppChromeSurfaceMenu`, `surfaceTheme.ts`                         | Unity surface variant setting persists locally and reloads on a reopened controller; built-player settings release-path proof saves `pearl-opaline` and reloads it in a fresh live-game controller without mutating gameplay state                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | All supported variants mapped or explicitly excluded                                                                                                                     | Incomplete        |
| Settings sound                    | `useGameSoundEffects`, `soundEnabled`                             | Unity local setting persists locally and reloads on a reopened controller; built-player settings release-path proof saves sound off and reloads it in a fresh live-game controller without mutating gameplay state                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Broader Electron/Unity operation parity and release-path startup evidence                                                                                                | Incomplete        |
| LAN visibility toggles            | `AppChromeLanVisibilityControls`                                  | Unity settings panel now exposes visible LAN opponent card and gem visibility toggles, persists both values to LocalDev preferences, reloads them on a reopened controller, and covers the same preference reload in the built Windows player; the preferences still have no migrated LAN gameplay surface to affect                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Apply the preferences inside migrated LAN gameplay once the LAN route exists                                                                                             | Incomplete        |
| LAN route                         | `matchmaking=lan`, `LanMenu`, `useLanMatchmaking`                 | Not implemented in Unity                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Implement LocalDev/LAN equivalent or user-approved exclusion                                                                                                             | Blocked           |
| Online route                      | `matchmaking=online`, `OnlineMenu`, `useOnlineManager`            | Not implemented in Unity                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Implement online equivalent or user-approved exclusion                                                                                                                   | Blocked           |
| Restart/new game/recovery         | App restart handlers, history reset, autosave/replay import       | Unity restart returns to main menu; LocalDev autosave restores bridge init, live state, and the in-progress live replay stream, then continues a command after close/reopen in EditMode; built-player smoke saves recovery at hash `208a752`, loads it in a fresh controller, continues a live command to hash `8d4178f7`, and reviews the continued replay; built-player recovered invalid-action release-path proof loads hash `24a87497`, rejects `CANCEL_RESERVE`, `CLOSE_MODAL`, and inactive actor `TAKE_GEMS` without mutation or replay append, then continues and reviews hash `d2b51b3f`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Fresh restart, broader product recovery, broader invalid-action recovery breadth                                                                                         | Incomplete        |
| Rulebook/chrome overlays          | `AppChrome`, `AppOverlayStack`                                    | Unity rulebook/settings/restart targets exist; built-player chrome release-path proof opens and closes the rulebook without gameplay hash or replay-event mutation, restarts to the shell, and starts another fresh LocalDev game through the bridge before recording one live command                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Broader same-semantic-key parity across all chrome/review surfaces                                                                                                       | Incomplete        |
| Visual Lab surfaces               | `visualLab=surfaces`, motion/readability tooling                  | Not implemented in Unity                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | User-approved exclusion as dev-only tooling or Unity implementation                                                                                                      | Blocked           |
| Debug/dev controls                | Debug panel, force royal, add resources                           | Should not be player-facing completion evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Exclude from player scope while preserving test fixture use                                                                                                              | Incomplete        |

## LAN / Online / Visual Lab Decision Path

| Surface      | Implement now                                                                                                                        | Explicitly defer as blocker                                                                             | User-approved exclusion needed                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| LAN route    | No Unity LAN route implementation was added in this continuation. LocalDev settings persistence exists only as preparatory evidence. | Yes. LAN remains a replacement-candidate blocker because matchmaking and LAN gameplay are not migrated. | Yes, if LAN should be excluded from the Unity replacement candidate.    |
| Online route | No online Unity route or platform SDK work was added. Steam/Epic/platform SDK work remains prohibited.                               | Yes. Online remains a blocker because the Electron online route has no Unity equivalent.                | Yes, if online should be excluded from the Unity replacement candidate. |
| Visual Lab   | No broad Unity Visual Lab implementation was added.                                                                                  | Yes. Visual Lab remains a blocker unless classified as dev-only and excluded.                           | Yes, if Visual Lab is outside replacement-candidate product scope.      |

## Current Scope Conclusion

No Electron player-facing surface is yet user-approved for exclusion. Full migration completion is
therefore blocked until LAN, online, Visual Lab, full live gameplay replay coverage, remaining Joker
actor coverage, remaining reserved-buy edge coverage, remaining reserve-deck edge coverage,
remaining reserve-cancel edge fixtures, remaining discard-reserved edge fixtures beyond the new
wrong-actor guard, draft reroll, remaining
privilege oracle/rejection fixtures, remaining peek/modal edge fixtures, broader invalid-action recovery, and arbitrary Local
PvP are either implemented with parity evidence or explicitly excluded by the user. LAN opponent
visibility preferences now have Unity setting and persistence evidence, but cannot be applied to
real LAN gameplay until the LAN route exists.

The 2026-05-11 continuation adds a built-player smoke entrypoint, five-scenario bounded Local PvP
product-surface evidence, release-path replay recovery checks, and a governed LocalDev mailbox
transport for the Windows player. Built-player smoke now passes for balanced, longer, and
reserve-focused bounded fresh-launch Local PvP paths with live replay export/import/review, covered
`take_gems`, `buy_card`, `click_board_cell`, `discard_gem`, `replenish`, `reserve_card`, and
`cancel_gem_selection`. A fourth built-player report adds `select_joker_color` plus replay
release-path invalid-file and overwrite/reload/review coverage. The final hashes are `7d3f696c`,
`5c804aa7`, `95c8a06c`, and `9704183f`. The aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260511.json` validates 4/4 reports,
64 commands, 68 mailbox events, and one replay release-path report, but it does not change the scope
verdict because the evidence is still not arbitrary full product-surface play and the final
release-runtime packaging decision remains unresolved.

A 2026-05-12 reserve-cancel follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T13-21-32-993Z.launcher.json`, which starts a
fresh LocalDev game through the built Windows player, opens visible market reserve controls, enters
`RESERVE_WAITING_GEM`, cancels through the visible control, records `initiate_reserve` and
`cancel_reserve`, exports/imports/reviews the replay, and preserves final hash `40bdddbf`. The
aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-cancel-release-path.json`
validates 22/22 reports, 568 bridge-backed commands, 644 mailbox events, and the previous release
path proof set plus one reserve-cancel release-path proof. This closes one deterministic
reserve-cancel release-path evidence gap only; the scope verdict remains blocked by LAN, online,
Visual Lab, arbitrary full product-surface play, and release-runtime packaging.

A 2026-05-12 reserve-deck follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T13-59-30-560Z.launcher.json`, which starts a
fresh LocalDev game through the built Windows player, opens a visible market deck preview, initiates
deck reserve through the visible preview reserve control, completes the Gold follow-up through a
visible board target, records `initiate_reserve_deck` and `reserve_deck`, exports/imports/reviews the
replay, and preserves final hash `da89d9e5`. The aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-deck-release-path.json`
validates 23/23 reports, 574 bridge-backed commands, 654 mailbox events, and the previous release
path proof set plus one reserve-deck release-path proof. This closes one deterministic reserve-deck
happy-path release evidence gap only; the scope verdict remains blocked by LAN, online, Visual Lab,
arbitrary full product-surface play, and release-runtime packaging.

A 2026-05-12 Joker follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T14-52-59-171Z.launcher.json`, which starts a
fresh LocalDev game through the built Windows player, drives live setup until visible Joker
`c:174-jo#0` is affordable, opens the visible market preview, buys through the visible preview
primary action, selects visible color `red`, records `initiate_buy_joker` and `buy_card`,
exports/imports/reviews the replay, and preserves final hash `95c8a06c`. The aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-joker-release-path.json`
validates 24/24 reports, 582 bridge-backed commands, 672 mailbox events, and the previous release
path proof set plus one Joker release-path proof. This closes one deterministic Joker happy-path
release evidence gap only; the scope verdict remains blocked by LAN, online, Visual Lab, arbitrary
full product-surface play, and release-runtime packaging.

A 2026-05-12 deck-reserve cancel follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T15-27-57-407Z.launcher.json`, which starts a
fresh LocalDev game through the built Windows player, opens a visible market deck preview, initiates
deck reserve through the visible preview reserve control, cancels before Gold selection through the
visible cancel control, records `initiate_reserve_deck` and `cancel_reserve`, leaves deck, reserved
card, and Gold-cell state unchanged, exports/imports/reviews the replay, and preserves final hash
`62fa027f`. The aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserve-deck-cancel-release-path.json`
validates 25/25 reports, 590 bridge-backed commands, 684 mailbox events, and the previous release
path proof set plus one deck-reserve cancel release-path proof. This closes one deterministic
deck-reserve cancel release evidence gap only; the scope verdict remains blocked by LAN, online,
Visual Lab, arbitrary full product-surface play, and release-runtime packaging.

A stricter 2026-05-12 aggregate audit
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-all-release-paths-audit.json`
revalidates those same 25 reports with every currently available built-player release-path
requirement flag enabled, including replay release-path coverage. This strengthens evidence
consistency only; it does not remove any product-scope blocker.

A 2026-05-12 resource-first breadth follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T20-12-00-000Z.resource-first.launcher.json`,
which starts a fresh classic LocalDev game through the built Windows player, uses the existing
mailbox bridge, records 120 live `take_gems`, `discard_gem`, and `replenish` commands,
exports/imports/reviews the live replay, and preserves final hash `7669d935`. The aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-resource-first-breadth.json`
validates 26/26 reports, 710 commands, 805 mailbox events, all currently observed action families,
every available release-path requirement flag, and status `incomplete-evidence`. This is bounded
deterministic breadth only; the scope verdict remains blocked by LAN, online, Visual Lab,
arbitrary full product-surface play, and release-runtime packaging.

The post-no-take-3 combined aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-post-notake3-combined.json`
revalidates the prior 26-report curated set plus the rebuilt-player draft launcher. It validates
27/27 reports, 716 commands, 812 mailbox events, all 21 required action families, every current
release-path requirement flag, and final hash `857c3e58` while retaining status
`incomplete-evidence`. This strengthens evidence consistency only; it does not change the blocked
scope verdict.

The strict 2026-05-13 aggregate before the winner guard
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-game-over-release-path.json`
revalidates the same 27-report set with all 21 required action families, every current release-path
proof flag, and
`--require-game-over-count 3`. It passed with 27/27 reports, 716 commands, 812 mailbox events,
3 game-over reports, winners `p1` and `p2`, game-over hashes `d6dbea7a`, `411262df`, and
`5f3bf567`, no missing required families, and one report for each required release-path proof
family. Its status remains `incomplete-evidence`; it does not change the blocked scope verdict for
LAN, online, Visual Lab, arbitrary full product-surface Local PvP, or release-runtime TypeScript
bridge packaging.

The strict 2026-05-13 winner-release aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-game-over-winner-release-path.json`
is retained built-player evidence for this run. It revalidates the same 27-report set with all
21 required action families, every current release-path proof flag,
`--require-game-over-count 3`, and `--require-game-over-winner p1,p2`. It passes with 27/27
reports, 716 commands, 812 mailbox events, 3 game-over reports, winners `p1` and `p2`, no missing
required families, no missing required winners, and one report for each required release-path proof
family. Its status remains `incomplete-evidence`; it does not change the blocked scope verdict for
LAN, online, Visual Lab, arbitrary full product-surface Local PvP, or release-runtime TypeScript
bridge packaging.

The strict 2026-05-13 report-count aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-report-count-guard.json`
is retained 27-report built-player evidence for this run. It revalidates the same winner-release
set with explicit `--require-report-count 27`, all 21 required action families, every current
release-path proof flag, `--require-game-over-count 3`, and `--require-game-over-winner p1,p2`. It
passes with 27/27 reports, 716 commands, 812 mailbox events, 3 game-over reports, winners `p1` and
`p2`, `requiredReportCount: 27`, no failures, and one report for every current release-path proof
family. Its status remains `incomplete-evidence`; it prevents silent aggregate shrinkage but does
not change the blocked scope verdict for LAN, online, Visual Lab, arbitrary full product-surface
Local PvP, or release-runtime TypeScript bridge packaging.

The strict 2026-05-13 unique-report-path aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-report-path-guard.json`
is retained 27-report built-player evidence for this run. It revalidates the same report-count set
with explicit `--require-unique-report-paths`. It passes with 27/27 reports, 716
commands, 812 mailbox events, 3 game-over reports, winners `p1` and `p2`,
`requiredReportCount: 27`, `requireUniqueReportPaths: true`, an empty `duplicateReportPaths` list,
no failures, and one report for every current release-path proof family. Its status remains
`incomplete-evidence`; it prevents duplicate-report padding but does not change the blocked scope
verdict for LAN, online, Visual Lab, arbitrary full product-surface Local PvP, or release-runtime
TypeScript bridge packaging.

The strict 2026-05-13 unique-log-path aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-strict-unique-log-path-guard.json`
is now the strongest retained 27-report built-player evidence for this run. It revalidates the same
unique nested smoke-report set with explicit `--require-unique-log-paths`. It passes with 27/27
reports, 716 commands, 812 mailbox events, 3 game-over reports, winners `p1` and `p2`,
`requiredReportCount: 27`, `requireUniqueReportPaths: true`, an empty `duplicateReportPaths` list,
`requireUniqueSmokeReportPaths: true`, an empty `duplicateSmokeReportPaths` list,
`requireUniqueLogPaths: true`, empty `duplicateStdoutLogPaths`, `duplicateStderrLogPaths`, and
`duplicatePlayerLogPaths` lists, no failures, and one report for every current release-path proof
family. Its status remains `incomplete-evidence`; it prevents duplicated launcher, nested
product-surface smoke-report, and process-output log evidence but does not change the blocked scope
verdict for LAN, online, Visual Lab, arbitrary full product-surface Local PvP, or release-runtime
TypeScript bridge packaging.

The audited 2026-05-13 strict unique-path aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-strict-unique-paths.json`
is the strongest audited-mailbox subset proof. It revalidates the eight file-backed audited
launcher reports with `--require-report-count 8`, unique launcher reports, unique nested smoke
reports, unique stdout/stderr/player-log files, 365 valid retained audit response files, one
invalid-action release-path report, three game-over reports, required winners `p1,p2`, and status
`incomplete-evidence`. This strengthens mailbox evidence integrity only; it does not change the
blocked scope verdict for LAN, online, Visual Lab, arbitrary full product-surface Local PvP, or
release-runtime TypeScript bridge packaging.

The audited replay plus game-over strict aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-strict-unique-paths.json`
adds the audited replay release-path report to that strict audited subset. It passes with 9/9
reports, 358 commands, 374 mailbox events, 374 valid retained audit response files, exact count and
unique evidence-path guards, one replay release-path report, one invalid-action release-path
report, three game-over reports, winners `p1,p2`, and status `incomplete-evidence`. This improves
release-path composition evidence only; it does not change the blocked scope verdict for LAN,
online, Visual Lab, arbitrary full product-surface Local PvP, or release-runtime TypeScript bridge
packaging.

The audited digest-count strict aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-gameover-digest-count-strict.json`
adds the digest-bearing mailbox report to that replay/game-over strict set. It passes with 10/10
reports, 360 commands, 377 mailbox events, 377 valid retained audit response files, 3 valid audit
response digests, launcher-argument validation, exact count and unique evidence-path guards, two
replay release-path reports, one invalid-action release-path report, three game-over reports,
winners `p1,p2`, and status `incomplete-evidence`. This improves retained LocalDev evidence
integrity only; it does not change the blocked scope verdict for LAN, online, Visual Lab,
arbitrary full product-surface Local PvP, or release-runtime TypeScript bridge packaging.

The all-release plus audited-digest strict union
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-all-release-plus-audited-digest-strict-union.json`
combines the 27-report all-release-path retained set with the 10-report audited replay/game-over/
digest set. It passes with 37/37 reports, 1076 commands, 1189 mailbox events, every current
release-path proof family, all 21 required action families, six game-over reports, winners
`p1,p2`, 377 valid retained audit response files, 3 valid audit response digests, strict unique
evidence-path guards, and status `incomplete-evidence`. A stricter launcher-args attempt failed
closed because two earliest 2026-05-11 launchers predate idle-action-preference argument metadata.
This is the broadest retained LocalDev evidence ledger, but it does not change the blocked scope
verdict for LAN, online, Visual Lab, arbitrary full product-surface Local PvP, or release-runtime
TypeScript bridge packaging.

The launcher-args refreshed union
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-launcher-args-refreshed-union.json`
replaces the two oldest no-preference-arg baseline reports with fresh current-format built-player
runs and now passes `--require-launcher-args` across the broad union. It records 37/37 reports,
1076 commands, 1189 mailbox events, every current release-path proof family, all 21 required action
families, six game-over reports, winners `p1,p2`, 421 valid retained audit response files, 47 valid
audit response digests, and status `incomplete-evidence`. This is the strongest retained LocalDev
evidence ledger, but it does not change the blocked scope verdict for LAN, online, Visual Lab,
arbitrary full product-surface Local PvP, or release-runtime TypeScript bridge packaging.

The 2026-05-13 audited product-surface breadth follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-breadth.launcher.json`, which starts a
fresh classic LocalDev game through the built Windows player, records 24 live product-surface
commands, retains 25 audited successful mailbox responses, covers `take_gems`, `buy_card`,
`take_bonus_gem`, `discard_gem`, and `replenish`, exports/imports/reviews the live replay, and
preserves final hash `f934c91b`. The aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-breadth.json`
passes with `--require-audited-mailbox-responses` and those five required action families. This is
bounded audited breadth evidence only; it does not change the blocked scope verdict for LAN, online,
Visual Lab, arbitrary full product-surface Local PvP, or release-runtime packaging.

The 2026-05-13 audited preference breadth follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-reserve-first.launcher.json` and
`artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-privilege-first.launcher.json`. The
reserve-first run starts fresh, records 12 live `reserve_card` / `cancel_gem_selection` commands,
retains 13 audited successful mailbox responses, and preserves hash `38d97b7f`. The privilege-first
run starts fresh, records 24 live commands including `activate_privilege` and `use_privilege`,
retains 25 audited successful mailbox responses, and preserves hash `62b67ebe`. The aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-preferences.json`
passes with `--require-audited-mailbox-responses`, 2/2 reports, 36 commands, 38 audited successful
mailbox responses, and the observed required families. This is bounded preference evidence only; it
does not change the blocked scope verdict for LAN, online, Visual Lab, arbitrary full
product-surface Local PvP, or release-runtime packaging.

The 2026-05-13 audited game-over follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-game-over-1.launcher.json`, which
reruns deterministic seed `unity-built-player-game-over-20260512` through the current audited
mailbox launcher. The built Windows player starts fresh, applies 98 live product-surface commands,
retains 99 audited successful mailbox responses, reaches winner `p1`, exports/reviews 98 live
Replay vNext events, and preserves final/review hash `d6dbea7a`. The aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over.json`
passes with `--require-audited-mailbox-responses`, `--require-game-over-count 1`, and the observed
eight action families. This strengthens the audited subset only; it does not change the blocked
scope verdict for LAN, online, Visual Lab, arbitrary full product-surface Local PvP, or
release-runtime packaging.

The 2026-05-13 audited `p2` game-over follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-game-over-p2-1.launcher.json` and
`artifacts/unity/built-player-smoke/smoke-2026-05-13Taudited-game-over-p2-2.launcher.json`. They
rerun deterministic seeds `unity-built-player-game-over-alt-1-20260512` and
`unity-built-player-game-over-alt-2-20260512` through fresh built Windows player processes, retain
99 and 93 audited successful mailbox responses, reach winners `p2` and `p2`, export/review 98 and
92 live Replay vNext events, and preserve final/review hashes `411262df` and `5f3bf567`. The
winner-breadth aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over-winner-breadth.json`
passes with `--require-audited-mailbox-responses`, `--require-game-over-count 3`, 3/3 reports,
288 live commands, 291 audited mailbox responses, winners `p1` and `p2`, and status
`incomplete-evidence`. This strengthens the audited subset only; it does not change the blocked
scope verdict for LAN, online, Visual Lab, arbitrary full product-surface Local PvP, or
release-runtime packaging.

`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-breadth.json`
is the stricter audited-subset cross-check: it combines eight audited reports with audited mailbox
responses, invalid-action release-path proof, and three game-over proofs all required. It passes
with 8/8 reports, 350 commands, 365 audited mailbox responses, one invalid-action release-path
report, three game-over reports, winners `p1` and `p2`, and status `incomplete-evidence`.

The enforced winner-guard aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-game-over-winner-guard.json`
adds `--require-game-over-winner p1,p2` on top of audited mailbox responses and
`--require-game-over-count 3`. It passes with 3/3 audited game-over reports, 288 commands, 291
audited successful mailbox responses, winners `p1` and `p2`, and status `incomplete-evidence`.
The stricter combined winner-guard aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-guard.json`
also requires invalid-action release-path proof and the twelve observed action families; it passes
with 8/8 audited reports, 350 commands, 365 audited mailbox responses, one invalid-action
release-path report, three game-over reports, winners `p1` and `p2`, and status
`incomplete-evidence`. This hardens bounded audited evidence only; it does not change the blocked
scope verdict for LAN, online, Visual Lab, arbitrary full product-surface Local PvP, or
release-runtime packaging.

The audited replay release-path aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path.json`
passes with `--require-audited-mailbox-responses`, `--require-replay-release-path`, 8 live
commands, 9 audited successful mailbox responses, full replay release-path coverage, final/review
hash `f9eb9e83`, and status `incomplete-evidence`. This strengthens replay release-path
auditability only; it does not change the blocked scope verdict for LAN, online, Visual Lab,
arbitrary full product-surface Local PvP, or release-runtime packaging.

The file-backed mailbox audit guard now requires retained audited response files to exist, parse,
and match launcher event summaries. The file-backed replay release-path aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-filebacked.json`
passes with 9/9 valid audit response files, while the file-backed combined audited aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-filebacked.json`
passes with 365/365 valid audit response files, one invalid-action release-path report, three
game-over reports, and winners `p1`/`p2`. This hardens auditability only; it does not change the
blocked scope verdict.

The built-player executable path guard now requires retained launcher reports to reference an
existing executable under `artifacts/unity/build/windows/`. The executable-guard replay release-path
aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-exe-guard.json`
passes with 1/1 report, while the executable-guard combined audited aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-exe-guard.json`
passes with 8/8 reports, 365/365 valid audit response files, one invalid-action release-path
report, three game-over reports, and winners `p1`/`p2`. This prevents executable path-only claims
from satisfying built-player evidence, but it does not change the blocked scope verdict.

The built-player stdout capture guard now requires retained launcher reports to include a non-empty
stdout file. The stdout-guard replay release-path aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stdout-guard.json`
passes with 1/1 report, while the stdout-guard combined audited aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stdout-guard.json`
passes with 8/8 reports, 365/365 valid audit response files, one invalid-action release-path
report, three game-over reports, and winners `p1`/`p2`. This prevents empty stdout files from
satisfying built-player evidence, but it does not change the blocked scope verdict.

The built-player stdout byte guard now also requires retained launcher reports to include a stdout
file whose actual size matches the launcher's reported `stdoutBytes` value. The stdout-byte-guard
replay release-path aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stdout-byte-guard.json`
passes with 1/1 report, while the stdout-byte-guard combined audited aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stdout-byte-guard.json`
passes with 8/8 reports, 365/365 valid audit response files, one invalid-action release-path
report, three game-over reports, and winners `p1`/`p2`. This prevents mismatched stdout metadata
from satisfying built-player evidence, but it does not change the blocked scope verdict.

The built-player stderr byte guard now requires retained launcher reports to include a stderr file
whose actual size matches the launcher's reported `stderrBytes` value. Empty stderr remains valid
for successful runs. The stderr-byte-guard replay release-path aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-stderr-byte-guard.json`
passes with 1/1 report, while the stderr-byte-guard combined audited aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-stderr-byte-guard.json`
passes with 8/8 reports, 365/365 valid audit response files, one invalid-action release-path
report, three game-over reports, winners `p1`/`p2`, and retained stdout/stderr/player-log paths in
the matrix summary. This prevents missing or mismatched stderr metadata from satisfying
built-player evidence, but it does not change the blocked scope verdict.

The built-player nested smoke-report guard now requires retained launcher reports to include a
nested smoke report file that parses as JSON and matches the launcher-embedded smoke report. The
nested-smoke-report-guard replay release-path aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-nested-smoke-report-guard.json`
passes with 1/1 report, while the nested-smoke-report-guard combined audited aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-nested-smoke-report-guard.json`
passes with 8/8 reports, 365/365 valid audit response files, one invalid-action release-path
report, three game-over reports, winners `p1`/`p2`, and retained stdout/stderr/player-log paths in
the matrix summary. This prevents path-only or stale nested smoke reports from satisfying
built-player evidence, but it does not change the blocked scope verdict.

The built-player artifact path guard now requires retained launcher reports, stdout/stderr/player
logs, nested smoke reports, and bridge mailbox directories to resolve under
`artifacts/unity/built-player-smoke/`. The artifact-path-guard replay release-path aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-artifact-path-guard.json`
passes with 1/1 report, while the artifact-path-guard combined audited aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-artifact-path-guard.json`
passes with 8/8 reports, 365/365 valid audit response files, one invalid-action release-path
report, three game-over reports, winners `p1`/`p2`, and retained stdout/stderr/player-log paths in
the matrix summary. This prevents outside-artifacts evidence paths from satisfying built-player
evidence, but it does not change the blocked scope verdict.

The built-player mailbox audit-path guard now requires retained mailbox `auditResponse` files to
resolve inside the bridge mailbox directory. The mailbox-audit-path-guard replay release-path
aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-mailbox-audit-path-guard.json`
passes with 1/1 report, while the mailbox-audit-path-guard combined audited aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-mailbox-audit-path-guard.json`
passes with 8/8 reports, 365/365 valid audit response files, one invalid-action release-path
report, three game-over reports, winners `p1`/`p2`, and retained stdout/stderr/player-log paths in
the matrix summary. This prevents escaped audit-response paths from satisfying built-player
evidence, but it does not change the blocked scope verdict.

The built-player mailbox audit request-name guard now requires retained mailbox `auditResponse`
file names to match the launcher event request names. The mailbox-audit-request-name-guard replay
release-path aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-mailbox-audit-request-name-guard.json`
passes with 1/1 report, while the mailbox-audit-request-name-guard combined audited aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-mailbox-audit-request-name-guard.json`
passes with 8/8 reports, 365/365 valid audit response files, one invalid-action release-path
report, three game-over reports, winners `p1`/`p2`, and retained stdout/stderr/player-log paths in
the matrix summary. This prevents one retained response file from being reused as another request's
audit evidence, but it does not change the blocked scope verdict.

The built-player mailbox audit digest guard now records and validates byte counts plus SHA-256
digests for retained mailbox `auditResponse` files. Fresh smoke
`artifacts/unity/built-player-smoke/smoke-2026-05-13Tmailbox-digest.launcher.json` starts the
built Windows player with seed `unity-built-player-mailbox-digest-20260513`, applies two live
`take_gems` commands, captures three digest-bearing audited bridge responses, covers replay
release-path invalid/corrupt/hash-mismatch/overwrite recovery, and preserves final/review hash
`bd4c4bd0`. The digest aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-guard.json`
passes with 1/1 report and 3/3 valid audit response digests. This reduces retained-evidence drift
risk only; it does not migrate LAN, online, or Visual Lab and does not resolve release-runtime
bridge packaging.

The built-player launcher args guard now validates retained launcher command-line metadata when
`--require-launcher-args` is set. The launcher-args digest aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-launcher-args-guard.json`
passes with 1/1 report, `launcherArgsMatchSmoke=true`, 3/3 valid audit response digests, replay
release-path coverage, and hash `bd4c4bd0`. This proves the retained digest smoke's command line
matches the embedded smoke wrapper metadata, but it remains bounded LocalDev evidence and does not
resolve the blocked product-scope decisions.

The TypeScript bridge structured error-output guard now writes a structured `ok=false`
`BRIDGE_EXECUTION_FAILED` JSON response for `--out` callers when request parsing or another
unhandled CLI infrastructure failure occurs after argument parsing. The adjacent CLI
rejected-command output guard proves a valid wrong-actor gameplay command also publishes structured
`ok=false` JSON to `--out`, exits non-zero, preserves the input state/hash, and leaves no temp
response file. The focused bridge test passes 35/35, including malformed request JSON and rejected
gameplay commands with `--out`. This reduces LocalDev mailbox timeout risk for malformed or
rejected bridge requests, but it does not migrate LAN, online, or Visual Lab and does not resolve
release-runtime bridge packaging.

The built-player failure reason coherence guard now rejects retained passing launcher reports when
any nested evidence layer still carries a non-empty `failureReason`. The failure-reason digest
aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-mailbox-digest-failure-reason-guard.json`
passes with zero retained failure reasons and hash `bd4c4bd0`. This reduces hidden-failure
evidence risk only; it does not migrate LAN, online, or Visual Lab and does not resolve
release-runtime bridge packaging.

The built-player player-log byte guard now requires retained launcher reports to include a
non-empty Unity player log whose actual file size matches the launcher's reported byte count. The
player-log-guard replay release-path aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-replay-release-path-playerlog-guard.json`
passes with 1/1 report, while the player-log-guard combined audited aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-audited-combined-game-over-winner-playerlog-guard.json`
passes with 8/8 reports, 365/365 valid audit response files, one invalid-action release-path
report, three game-over reports, and winners `p1`/`p2`. This prevents empty or metadata-only
player-log claims from satisfying built-player evidence, but it does not change the blocked scope
verdict.

A 2026-05-12 built-player follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T00-01-24-013Z.launcher.json`, with 80 live
bridge-backed commands, replay export/import/review, `choose_royal`, `steal_gem`, and final hash
`94560a25`. The bonus-family label follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T00-11-24-743Z.launcher.json`, with 80 live
bridge-backed commands, explicit `take_bonus_gem` evidence, replay export/import/review, and final
hash `cecbc068`. The privilege-family follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T00-24-16-298Z.launcher.json`, with a fresh
LocalDev launch, 3 live bridge-backed commands, `take_gems`, `activate_privilege`, `use_privilege`,
replay export/import/review, and final hash `9e3b6f7c`. The game-over depth follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T00-52-54-303Z.launcher.json`,
`artifacts/unity/built-player-smoke/smoke-2026-05-12T01-01-37-234Z.launcher.json`, and
`artifacts/unity/built-player-smoke/smoke-2026-05-12T01-04-20-176Z.launcher.json`, with fresh
LocalDev launches, 98/98/92 live bridge-backed commands, winners `p1`/`p2`/`p2`, replay
export/import/review, and final hashes `d6dbea7a`, `411262df`, and `5f3bf567`. The refreshed
aggregate `artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512.json` validates
10/10 reports after the game-over step. The recovery release-path follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T01-20-54-336Z.launcher.json`, which saves
recovery at hash `208a752`, loads it in a fresh controller, continues another live command to hash
`8d4178f7`, and exports/reviews the continued replay. The final refreshed aggregate validates 11/11
reports, 517 commands, 531 mailbox events, thirteen action families, one replay release-path report,
and one recovery release-path report. The settings release-path follow-up then adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T02-00-40-648Z.launcher.json`, which saves and
reloads locale `en`, surface theme `pearl-opaline`, sound off, and LAN visibility preferences off
without gameplay hash or replay-event mutation. The settings refreshed aggregate validates 12/12
reports, 519 commands, 536 mailbox events, one replay release-path report, one recovery
release-path report, and one settings release-path report. The chrome release-path follow-up then
adds `artifacts/unity/built-player-smoke/smoke-2026-05-12T03-13-11-728Z.launcher.json`, which opens
and closes the rulebook without gameplay mutation, restarts to the shell, starts another fresh
LocalDev game through the bridge, and records restarted command hash `5304b037`. The replay-review
release-path follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T03-32-18-999Z.launcher.json`, which exports a
live bridge-backed replay, imports it into a separate review controller, drives visible redo/undo
navigation, preserves final review hash `db7fb1b7`, and proves the source live game/replay stream is
unchanged. The latest malformed-draft replay release-path refresh replaces the prior replay
release-path report with
`artifacts/unity/built-player-smoke/smoke-2026-05-12T05-16-44-409Z.launcher.json`; the aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-malformed-draft-bootstrap.json`
validates 14/14 reports, 525 commands, 552 mailbox events, one replay release-path report with
`malformed_bootstrap` and `malformed_draft_bootstrap`, one recovery release-path report, one
settings release-path report, one chrome release-path report, and one replay-review release-path
report. The draft release-path follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T05-44-04-969Z.launcher.json`, which starts a
fresh roguelike LocalDev draft in the built Windows player, rerolls and selects for both players
through `reroll_draft_pool` and `choose_boon`, records eight live replay events, and preserves
export/import/review hash `851b6356`. The draft-only aggregate before the invalid-action follow-up
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-draft-release-path.json`
validates 15/15 reports, 533 commands, 561 mailbox events, and draft action families in addition
to the previous release-path reports. This is stronger deterministic built-player evidence,
including three game-over proofs, one recovery proof, one settings proof, one chrome proof, one
replay-review proof, malformed LocalDev replay import recovery, and draft reroll/select proof, not
a change to the `Blocked` status for arbitrary Local PvP, LAN, online, Visual Lab, or
release-runtime packaging.

The 2026-05-13 draft summary guard follow-up adds
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-draft-summary-guard.json`,
which validates the retained draft launcher with `--require-draft-release-path`, ordered
`reroll_draft_pool` / `choose_boon` coverage for both players, `DRAFT_PHASE` to `IDLE` completion,
8 live product-surface commands, 9 mailbox events, and preserved draft/final hash `851b6356`. The
same guard also validates the newer post-no-take-3 retained draft launcher at
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-draft-post-notake3-summary-guard.json`
with 6 live product-surface commands, 7 mailbox events, and preserved draft/final hash `857c3e58`.
This reduces retained draft evidence drift risk only; it does not change the `Blocked` status for
arbitrary Local PvP, LAN, online, Visual Lab, or release-runtime packaging.

The invalid-action release-path follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T06-34-40-146Z.launcher.json`, which starts the
built Windows player from a fresh launch, then runs a separate invalid-action LocalDev proof through
`GemDuelGameController` / `IGameRulesEngine`. It rejects `SELECT_BUFF`, `REROLL_DRAFT_POOL`, empty
`TAKE_GEMS`, `CANCEL_RESERVE`, `CLOSE_MODAL`, and inactive actor `TAKE_GEMS` without changing hash
`1a6afd3f` or appending live replay events, then exports/reviews a zero-event replay at the same
hash. The aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-invalid-action-release-path.json`
validates 16/16 reports, 541 commands, 577 mailbox events, one invalid-action release-path report,
and the previous replay/recovery/settings/chrome/replay-review/draft release-path reports. This
closes one representative built-player invalid-action release-path gap, but does not change the
`Blocked` status for arbitrary Local PvP, LAN, online, Visual Lab, or release-runtime packaging.

The peek-modal release-path follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T07-56-40-905Z.launcher.json`, which starts the
built Windows player from a fresh roguelike LocalDev launch, selects `intelligence`, opens the
visible `peek_deck` control, closes the visible modal close control, records `select_buff`,
`peek_deck`, and `close_modal`, exports/imports/reviews the live replay, and preserves final hash
`8399eadd`. The aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-peek-modal-release-path.json`
validates 17/17 reports, 545 commands, 587 mailbox events, one peek-modal release-path report, and
the previous replay/recovery/settings/chrome/replay-review/draft/invalid-action release-path
reports. This closes one representative built-player peek/modal release-path happy path, but does
not change the `Blocked` status for arbitrary Local PvP, LAN, online, Visual Lab, or release-runtime
packaging.

The recovery invalid-action release-path follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T09-33-52-882Z.launcher.json`, which starts the
built Windows player from a fresh LocalDev launch, saves and reloads recovered hash `24a87497`,
rejects `CANCEL_RESERVE`, `CLOSE_MODAL`, and inactive actor `TAKE_GEMS` without mutating recovered
state, replay state, summary hash, or recorded event count, then continues a valid `take_gems` and
reviews final hash `d2b51b3f`. The aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-recovery-invalid-action-release-path.json`
validates 18/18 reports, 547 commands, 596 mailbox events, one recovery invalid-action release-path
report, and the previous replay/recovery/settings/chrome/replay-review/draft/invalid-action/
peek-modal release-path reports. This closes one representative recovered invalid-action proof, but
does not change the `Blocked` status for arbitrary Local PvP, LAN, online, Visual Lab, or
release-runtime packaging.

The privilege-cancel release-path follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T10-51-01-649Z.launcher.json`, which starts the
built Windows player from a fresh LocalDev launch, creates a normal privilege opportunity, enters
`PRIVILEGE_ACTION`, cancels through the visible cancel control, records `take_gems`,
`activate_privilege`, and `cancel_privilege`, exports/imports/reviews the live replay, and preserves
hash `efe66377`. The aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-privilege-cancel-release-path.json`
validates 19/19 reports, 550 commands, 604 mailbox events, one privilege-cancel release-path report,
and the previous replay/recovery/settings/chrome/replay-review/draft/invalid-action/peek-modal/
recovery-invalid-action release-path reports. This closes one deterministic built-player
`CANCEL_PRIVILEGE` release-path evidence gap, but does not change the `Blocked` status for arbitrary
Local PvP, LAN, online, Visual Lab, or release-runtime packaging.

The reserved-discard release-path follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T11-39-09-986Z.launcher.json`, which starts the
built Windows player from a fresh roguelike LocalDev launch, selects `puppet_master`, reserves
`c:125-gr#0`, opens the visible reserved-card preview, discards through the visible control, records
`select_buff`, `initiate_reserve`, `reserve_card`, `take_gems`, and `discard_reserved`,
exports/imports/reviews the live replay, and preserves final hash `33909286`. The aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserved-discard-release-path.json`
validates 20/20 reports, 556 commands, 618 mailbox events, one reserved-discard release-path
report, and the previous replay/recovery/settings/chrome/replay-review/draft/invalid-action/
peek-modal/recovery-invalid-action/privilege-cancel release-path reports. This closes one
deterministic built-player `DISCARD_RESERVED` release-path evidence gap, but does not change the
`Blocked` status for arbitrary Local PvP, LAN, online, Visual Lab, or release-runtime packaging.

The reserved-buy release-path follow-up adds
`artifacts/unity/built-player-smoke/smoke-2026-05-12T12-29-42-881Z.launcher.json`, which starts the
built Windows player from a fresh LocalDev launch, reserves `c:155-bk#0`, opens the visible
reserved-card preview, buys through the visible primary action, records ordered `reserve_card` then
reserved-source `buy_card`, exports/imports/reviews the live replay, and preserves final hash
`47c0e9db`. The aggregate
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260512-reserved-buy-release-path.json`
validates 21/21 reports, 562 commands, 634 mailbox events, one reserved-buy release-path report,
and the previous release-path reports. This closes one deterministic built-player reserved-buy
happy-path evidence gap, but does not change the `Blocked` status for arbitrary Local PvP, LAN,
online, Visual Lab, or release-runtime packaging.

The cancel-reserve no-pending follow-up adds the TypeScript-oracle rejection case
`reject-cancel-reserve-no-pending` with tag `edge:CANCEL_RESERVE:no-pending`. It derives a
`RESERVE_WAITING_GEM` replay state, clears the pending reserve as a corrupt/recovered-state boundary,
and proves both the verifier and Unity live bridge preserve hash `3b87795f` without appending replay
events. This closes one deterministic `CANCEL_RESERVE` rejection gap, but does not change the
`Blocked` status for arbitrary Local PvP, LAN, online, Visual Lab, or release-runtime packaging.

The P2 draft select ordering follow-up adds the TypeScript-oracle rejection case
`reject-select-buff-p2-before-p1-selection` with tag `edge:SELECT_BUFF:p2-before-p1`. It derives a
stale-pool P2 draft state before P1 has locked a buff and proves both the verifier and Unity live
bridge preserve hash `5c903209` without appending replay events. This closes one deterministic P2
draft ordering rejection gap, but does not change the `Blocked` status for arbitrary Local PvP, LAN,
online, Visual Lab, or release-runtime packaging.

The 2026-05-13 shared action oracle validation refresh rechecked deterministic empty board-cell
UIDs, offline draft reroll determinism with P1/P2 ownership separation, and unaffordable buy
`pendingBuy` preservation against focused TypeScript tests. The focused command passed 3 shared
action test files and 57 tests. This validates prior shared oracle fixes only; it does not migrate
or exclude LAN, online, Visual Lab, arbitrary full product-surface Local PvP, or release-runtime
packaging.

The 2026-05-13 final validation refresh does not change the product-scope decision path. The
strongest retained built-player ledger
`artifacts/unity/built-player-smoke/built-player-smoke-matrix-20260513-launcher-args-refreshed-union.json`
passes as bounded LocalDev evidence with all current release-path proof families, but full
product-scope closure is still not proven. A later smoke-driver fix produced fresh full EditMode
evidence: `artifacts/unity/editmode-final-validation-fixed-20260513-results.xml` passed 91/91 and
`artifacts/unity/build-final-validation-fixed-20260513.log` reports Windows build success. The
longer full `pnpm parity:electron-unity` rerun also passed at
`artifacts/electron-unity-parity/2026-05-13T14-15-37-411Z` with 54 equivalent rows. No LAN, online,
or Visual Lab implementation or user-approved exclusion was added, and arbitrary broad Local PvP,
broader release-path/recovery coverage, and release-runtime TypeScript bridge packaging remain
open. Product-scope status therefore remains `Incomplete`.
