# Game Action Contract

Last updated: 2026-05-09

Unity must consume the same action semantics as the TypeScript rules oracle. Do not bind gameplay
commands to Unity input events, Steam overlay callbacks, or Epic callbacks directly.

## Source Of Truth

- Domain action types: `packages/shared/src/types/domain-actions.ts`
- Runtime action schemas: `packages/shared/src/logic/contractSchemasGameActions.ts`
- Reducer dispatch: `packages/shared/src/logic/gameReducer.ts`
- Phase gate and command policy: `packages/shared/src/logic/fsm.ts` and
  `packages/shared/src/logic/fsmPolicy.ts`
- Replay event contract: `packages/shared/src/replay/schema.ts`
- Replay event inflation: `packages/shared/src/replay/runtime.ts`

## Bootstrap Actions

- `INIT`: starts a non-draft game from a deterministic setup payload.
- `INIT_DRAFT`: starts a draft-enabled game and includes draft pool metadata.

Unity should load golden replay fixtures through Replay vNext bootstrap data instead of creating a
parallel Unity-only setup path.

## Gameplay Actions Covered By Replay Parity

- `SELECT_BUFF`
- `TAKE_GEMS`
- `REPLENISH`
- `TAKE_BONUS_GEM`
- `DISCARD_GEM`
- `STEAL_GEM`
- `BUY_CARD`
- `RESERVE_CARD`
- `RESERVE_DECK`
- `DISCARD_RESERVED`
- `USE_PRIVILEGE`
- `SELECT_ROYAL_CARD`

These actions map to Replay vNext event names such as `select_buff`, `take_gems`, `buy_card`,
`reserve_card`, and `select_royal`. Unity should replay event streams by inflating them to the
equivalent C# commands and applying the C# reducer.

## UI-Only And Debug Actions

The following TypeScript actions are not first-class Unity parity commands unless a future contract
explicitly adds them:

- `INITIATE_BUY_JOKER`
- `INITIATE_RESERVE`
- `INITIATE_RESERVE_DECK`
- `CANCEL_RESERVE`
- `ACTIVATE_PRIVILEGE`
- `CANCEL_PRIVILEGE`
- `FORCE_ROYAL_SELECTION`
- `DEBUG_ADD_CROWNS`
- `DEBUG_ADD_POINTS`
- `DEBUG_ADD_PRIVILEGE`
- `UNDO`
- `REDO`
- `PEEK_DECK`
- `REROLL_DRAFT_POOL`
- `CLOSE_MODAL`
- `FORCE_SYNC`
- `FLATTEN`

Unity may implement local UI flows around these concepts, but parity should be proven with the
normalized gameplay events that mutate the shared game state.

## Command Rules

- Validate command legality before mutation.
- Preserve the current phase gate behavior.
- Preserve actor ownership. Replay events include `actor`; Unity must reject event streams where
  the current turn and actor diverge.
- Preserve deterministic random choices by storing explicit replay randoms such as expansion,
  extortion, bounty hunter, and buff random colors.
- Preserve market references and card instance IDs exactly.
- Keep platform input, controller prompts, overlay callbacks, and store events as adapters that
  emit gameplay commands only after local validation.

## Unity Implementation Notes

- Build an input-to-command layer above the C# reducer.
- Keep reducer commands serializable for replay capture.
- Do not store Unity object references inside command payloads.
- Use replay card instance IDs to resolve cards; do not hash Unity prefab instance IDs.
- Keep platform-service actions such as achievements and cloud saves outside gameplay commands.
