import { BUFFS, GEM_TYPES, ROYAL_CARDS } from '../constants';
import { INITIAL_STATE_SKELETON } from '../logic/initialState';
import { CLASSIC_CARDS, ROGUE_CARDS } from '../data/realCards';
import type {
    BoardCell,
    Buff,
    Card,
    GameAction,
    GameSetupPayload,
    GameState,
    GemColor,
    InitDraftPayload,
    PlayerKey,
    RoyalCard,
} from '../types';
import type {
    ReplayBuffRef,
    ReplayCardInstanceId,
    ReplayCardInstances,
    ReplayCardTemplateId,
    ReplayCheckpoint,
    ReplayEvent,
    ReplayInitSnapshot,
    ReplayMarketRef,
    ReplayPlayers,
    ReplayStateSnapshot,
    ReplayTableauCard,
} from './types';

const CARD_TEMPLATE_MAP = new Map<string, Card>();
for (const template of [...CLASSIC_CARDS, ...ROGUE_CARDS]) {
    if (!CARD_TEMPLATE_MAP.has(template.id)) {
        CARD_TEMPLATE_MAP.set(template.id, template);
    }
}

const ROYAL_TEMPLATE_MAP = new Map<string, RoyalCard>(ROYAL_CARDS.map((card) => [card.id, card]));
const BUFF_MAP = new Map<string, Buff>(Object.values(BUFFS).map((buff) => [buff.id, buff as Buff]));
const INSTANCE_ID_PATTERN = /^c:(.+)#(\d+)$/;
const RUNTIME_CARD_SUFFIX_PATTERN = /-\d{13}-[a-z0-9]+$/i;

export interface ReplayCardRegistry {
    cardInstances: ReplayCardInstances;
    runtimeToInstance: Map<string, ReplayCardInstanceId>;
}

const cloneJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const stripRuntimeCardId = (cardId: string): string =>
    cardId.startsWith('c:') ? cardId : cardId.replace(RUNTIME_CARD_SUFFIX_PATTERN, '');

export const parseReplayCardInstanceId = (
    instanceId: ReplayCardInstanceId
): { templateId: ReplayCardTemplateId; seq: number } => {
    const match = INSTANCE_ID_PATTERN.exec(instanceId);
    if (!match) {
        throw new Error(`Invalid replay card instance id: ${instanceId}`);
    }

    return {
        templateId: match[1] as ReplayCardTemplateId,
        seq: Number(match[2]),
    };
};

const createBoardCell = (gemId: string, uid: string): BoardCell => ({
    type:
        gemId === 'empty'
            ? GEM_TYPES.EMPTY
            : GEM_TYPES[gemId.toUpperCase() as keyof typeof GEM_TYPES],
    uid,
});

export const buildReplayCardRegistryFromSetup = (
    setup: Pick<GameSetupPayload, 'market' | 'decks'>
): ReplayCardRegistry => {
    const cardInstances: ReplayCardInstances = {};
    const runtimeToInstance = new Map<string, ReplayCardInstanceId>();
    const templateCounters = new Map<string, number>();

    const registerCard = (card: Card | null | undefined) => {
        if (!card) {
            return;
        }

        const templateId = stripRuntimeCardId(card.id);
        const nextSeq = templateCounters.get(templateId) ?? 0;
        templateCounters.set(templateId, nextSeq + 1);

        const instanceId = `c:${templateId}#${nextSeq}` as ReplayCardInstanceId;
        cardInstances[instanceId] = templateId;
        runtimeToInstance.set(card.id, instanceId);
    };

    [1, 2, 3].forEach((level) => {
        setup.market[level as 1 | 2 | 3].forEach((card) => registerCard(card));
    });

    [1, 2, 3].forEach((level) => {
        setup.decks[level as 1 | 2 | 3].forEach((card) => registerCard(card));
    });

    return { cardInstances, runtimeToInstance };
};

export const buildIdentityRuntimeToInstanceMap = (
    cardInstances: ReplayCardInstances
): Map<string, ReplayCardInstanceId> =>
    new Map(
        Object.keys(cardInstances).map((instanceId) => [
            instanceId,
            instanceId as ReplayCardInstanceId,
        ])
    );

export const serializeReplayBuffRef = (buff: Buff | null | undefined): ReplayBuffRef => {
    if (!buff) {
        return {
            id: 'none',
            level: 0,
        };
    }

    const state = buff.state ? cloneJson(buff.state as Record<string, unknown>) : undefined;
    return state && Object.keys(state).length > 0
        ? {
              id: buff.id,
              level: buff.level,
              state,
          }
        : {
              id: buff.id,
              level: buff.level,
          };
};

export const inflateReplayBuffRef = (buffRef: ReplayBuffRef): Buff => {
    const template = BUFF_MAP.get(buffRef.id) ?? (BUFFS.NONE as unknown as Buff);
    const inflated = cloneJson(template);
    inflated.state = buffRef.state ? cloneJson(buffRef.state) : {};
    return inflated;
};

export const inflateRoyalCard = (royalId: string): RoyalCard => {
    const template = ROYAL_TEMPLATE_MAP.get(royalId);
    if (!template) {
        throw new Error(`Unknown replay royal card template: ${royalId}`);
    }
    return cloneJson(template);
};

export const inflateCardFromInstance = (
    instanceId: ReplayCardInstanceId,
    cardInstances: ReplayCardInstances,
    overrides: Partial<Card> = {}
): Card => {
    const templateId = cardInstances[instanceId] ?? parseReplayCardInstanceId(instanceId).templateId;
    const template = CARD_TEMPLATE_MAP.get(templateId);

    if (!template) {
        throw new Error(`Unknown replay card template: ${templateId}`);
    }

    return {
        ...cloneJson(template),
        ...cloneJson(overrides),
        id: instanceId,
    };
};

const resolveInstanceId = (
    card: Card,
    runtimeToInstance: Map<string, ReplayCardInstanceId>
): ReplayCardInstanceId => {
    if (card.id.startsWith('c:')) {
        return card.id as ReplayCardInstanceId;
    }

    const known = runtimeToInstance.get(card.id);
    if (!known) {
        throw new Error(`Replay recorder could not resolve a stable instance id for ${card.id}`);
    }

    return known;
};

export const resolveRuntimeCardIdToInstanceId = (
    cardId: string,
    runtimeToInstance: Map<string, ReplayCardInstanceId>
): ReplayCardInstanceId => {
    if (cardId.startsWith('c:')) {
        return cardId as ReplayCardInstanceId;
    }

    const known = runtimeToInstance.get(cardId);
    if (!known) {
        throw new Error(`Replay recorder could not resolve a stable instance id for ${cardId}`);
    }

    return known;
};

const serializeReplayTableauCard = (
    card: Card,
    runtimeToInstance: Map<string, ReplayCardInstanceId>
): ReplayTableauCard =>
    card.isBuff
        ? {
              kind: 'buff_dummy',
              cardId: card.id,
              bonusColor: (card.bonusColor ?? 'red') as GemColor,
              bonusCount: card.bonusCount ?? 1,
          }
        : {
              kind: 'instance',
              instanceId: resolveInstanceId(card, runtimeToInstance),
          };

const inflateReplayTableauCard = (
    card: ReplayTableauCard,
    cardInstances: ReplayCardInstances
): Card =>
    card.kind === 'buff_dummy'
        ? {
              id: card.cardId,
              level: 1,
              points: 0,
              crowns: 0,
              bonusColor: card.bonusColor,
              bonusCount: card.bonusCount,
              cost: { red: 0, green: 0, blue: 0, white: 0, black: 0, pearl: 0, gold: 0 },
              isBuff: true,
          }
        : inflateCardFromInstance(card.instanceId, cardInstances);

const serializeReplayMarket = (
    market: GameState['market'],
    runtimeToInstance: Map<string, ReplayCardInstanceId>
): ReplayInitSnapshot['market'] => ({
    1: market[1].map((card) => (card ? resolveInstanceId(card, runtimeToInstance) : null)),
    2: market[2].map((card) => (card ? resolveInstanceId(card, runtimeToInstance) : null)),
    3: market[3].map((card) => (card ? resolveInstanceId(card, runtimeToInstance) : null)),
});

const serializeReplayDecks = (
    decks: GameState['decks'],
    runtimeToInstance: Map<string, ReplayCardInstanceId>
): ReplayInitSnapshot['decks'] => ({
    1: decks[1].map((card) => resolveInstanceId(card, runtimeToInstance)),
    2: decks[2].map((card) => resolveInstanceId(card, runtimeToInstance)),
    3: decks[3].map((card) => resolveInstanceId(card, runtimeToInstance)),
});

export const buildReplayInitSnapshot = (
    action: Extract<GameAction, { type: 'INIT' | 'INIT_DRAFT' }>,
    nextState: GameState
): { init: ReplayInitSnapshot; runtimeToInstance: Map<string, ReplayCardInstanceId> } => {
    const { cardInstances, runtimeToInstance } = buildReplayCardRegistryFromSetup(action.payload);

    const init: ReplayInitSnapshot = {
        actionType: action.type,
        mode: action.payload.mode,
        hostPlayer: action.payload.hostPlayer,
        board: action.payload.board.map((row) => row.map((cell) => cell.type.id)),
        bag: action.payload.bag.map((cell) => (typeof cell === 'string' ? cell : cell.type.id)) as ReplayInitSnapshot['bag'],
        market: serializeReplayMarket(nextState.market, runtimeToInstance),
        decks: serializeReplayDecks(nextState.decks, runtimeToInstance),
        cardInstances,
        initRandoms: cloneJson(action.payload.initRandoms),
        royalDeck: nextState.royalDeck.map((card) => card.id),
        ...(action.type === 'INIT_DRAFT'
            ? {
                  buffLevel: action.payload.buffLevel,
                  draftPool: cloneJson(action.payload.draftPool),
              }
            : {}),
    };

    return { init, runtimeToInstance };
};

const buildPendingSetupFromInit = (init: ReplayInitSnapshot): GameSetupPayload => ({
    mode: init.mode,
    board: init.board.map((row, rowIndex) =>
        row.map((gemId, columnIndex) =>
            createBoardCell(gemId, `replay-board-${rowIndex}-${columnIndex}-${gemId}`)
        )
    ),
    bag: init.bag.map((gemId, index) => createBoardCell(gemId, `replay-bag-${index}-${gemId}`)),
    market: {
        1: init.market[1].map((instanceId) =>
            instanceId ? inflateCardFromInstance(instanceId, init.cardInstances) : null
        ),
        2: init.market[2].map((instanceId) =>
            instanceId ? inflateCardFromInstance(instanceId, init.cardInstances) : null
        ),
        3: init.market[3].map((instanceId) =>
            instanceId ? inflateCardFromInstance(instanceId, init.cardInstances) : null
        ),
    },
    decks: {
        1: init.decks[1].map((instanceId) => inflateCardFromInstance(instanceId, init.cardInstances)),
        2: init.decks[2].map((instanceId) => inflateCardFromInstance(instanceId, init.cardInstances)),
        3: init.decks[3].map((instanceId) => inflateCardFromInstance(instanceId, init.cardInstances)),
    },
    initRandoms: cloneJson(init.initRandoms),
    isHost: true,
    hostPlayer: init.hostPlayer,
});

export const buildBootstrapActionFromReplayInit = (
    init: ReplayInitSnapshot
): Extract<GameAction, { type: 'INIT' | 'INIT_DRAFT' }> =>
    init.actionType === 'INIT_DRAFT'
        ? {
              type: 'INIT_DRAFT',
              payload: {
                  ...buildPendingSetupFromInit(init),
                  draftPool: cloneJson(init.draftPool ?? []),
                  buffLevel: init.buffLevel ?? 1,
              } satisfies InitDraftPayload,
          }
        : {
              type: 'INIT',
              payload: buildPendingSetupFromInit(init),
          };

export const serializeReplayPlayers = (state: GameState): ReplayPlayers => ({
    p1: { buff: serializeReplayBuffRef(state.playerBuffs?.p1) },
    p2: { buff: serializeReplayBuffRef(state.playerBuffs?.p2) },
});

export const serializeReplayStateSnapshot = (
    state: GameState,
    runtimeToInstance: Map<string, ReplayCardInstanceId>
): ReplayStateSnapshot => ({
    board: state.board.map((row) => row.map((cell) => cell.type.id)),
    bag: state.bag.map((cell) => (typeof cell === 'string' ? cell : cell.type.id)) as ReplayStateSnapshot['bag'],
    turn: state.turn,
    phase: state.phase,
    mode: state.mode,
    winner: state.winner,
    market: serializeReplayMarket(state.market, runtimeToInstance),
    decks: serializeReplayDecks(state.decks, runtimeToInstance),
    playerTableau: {
        p1: state.playerTableau.p1.map((card) => serializeReplayTableauCard(card, runtimeToInstance)),
        p2: state.playerTableau.p2.map((card) => serializeReplayTableauCard(card, runtimeToInstance)),
    },
    playerReserved: {
        p1: state.playerReserved.p1.map((card) => resolveInstanceId(card, runtimeToInstance)),
        p2: state.playerReserved.p2.map((card) => resolveInstanceId(card, runtimeToInstance)),
    },
    playerRoyals: {
        p1: state.playerRoyals.p1.map((card) => card.id),
        p2: state.playerRoyals.p2.map((card) => card.id),
    },
    inventories: cloneJson(state.inventories),
    privileges: cloneJson(state.privileges),
    royalDeck: state.royalDeck.map((card) => card.id),
    royalMilestones: cloneJson(state.royalMilestones),
    extraPoints: cloneJson(state.extraPoints),
    extraCrowns: cloneJson(state.extraCrowns),
    extraAllocation: cloneJson(state.extraAllocation),
    extraPrivileges: cloneJson(state.extraPrivileges),
    playerBuffs: serializeReplayPlayers(state),
    draftPool: cloneJson(state.draftPool),
    ...(state.p2DraftPool ? { p2DraftPool: cloneJson(state.p2DraftPool) } : {}),
    p1SelectedBuffId: state.p1SelectedBuff?.id ?? null,
    draftOrder: cloneJson(state.draftOrder),
    buffLevel: state.buffLevel,
    p2DraftLevel: state.p2DraftLevel,
    privilegeGemCount: state.privilegeGemCount,
    pendingReserve: state.pendingReserve
        ? {
              ...(state.pendingReserve.card
                  ? { instanceId: resolveInstanceId(state.pendingReserve.card, runtimeToInstance) }
                  : {}),
              level: state.pendingReserve.level,
              ...(state.pendingReserve.idx !== undefined ? { idx: state.pendingReserve.idx } : {}),
              ...(state.pendingReserve.isDeck ? { isDeck: true } : {}),
          }
        : null,
    pendingBuy: state.pendingBuy
        ? {
              instanceId: resolveInstanceId(state.pendingBuy.card, runtimeToInstance),
              source: state.pendingBuy.source,
              ...(state.pendingBuy.marketInfo ? { marketRef: cloneJson(state.pendingBuy.marketInfo) } : {}),
          }
        : null,
    bonusGemTarget: state.bonusGemTarget?.id ?? null,
    nextPlayerAfterRoyal: state.nextPlayerAfterRoyal,
    pendingExtraTurn: state.pendingExtraTurn,
    playerTurnCounts: cloneJson(state.playerTurnCounts),
    abilityResolution: state.abilityResolution
        ? cloneJson({
              nextPlayer: state.abilityResolution.nextPlayer,
              pending: state.abilityResolution.pending,
              resolved: state.abilityResolution.resolved,
              ...(state.abilityResolution.bonusGemColor
                  && state.abilityResolution.bonusGemColor !== 'null'
                  ? { bonusGemColor: state.abilityResolution.bonusGemColor }
                  : {}),
              ...(state.abilityResolution.deferredEchoWrite
                  ? {
                        deferredEchoWrite: {
                            holder: state.abilityResolution.deferredEchoWrite.holder,
                            abilities: state.abilityResolution.deferredEchoWrite.abilities,
                            ...(state.abilityResolution.deferredEchoWrite.bonusColor
                                && state.abilityResolution.deferredEchoWrite.bonusColor !== 'null'
                                ? {
                                      bonusColor:
                                          state.abilityResolution.deferredEchoWrite.bonusColor,
                                  }
                                : {}),
                        },
                    }
                  : {}),
          })
        : null,
});

export const inflateReplayStateSnapshot = (
    snapshot: ReplayStateSnapshot,
    init: ReplayInitSnapshot
): GameState => {
    const base = cloneJson(INITIAL_STATE_SKELETON);
    base.board = snapshot.board.map((row, rowIndex) =>
        row.map((gemId, columnIndex) => createBoardCell(gemId, `replay-board-${rowIndex}-${columnIndex}-${gemId}`))
    );
    base.bag = snapshot.bag.map((gemId, index) => createBoardCell(gemId, `replay-bag-${index}-${gemId}`));
    base.turn = snapshot.turn;
    base.phase = snapshot.phase;
    base.mode = snapshot.mode;
    base.isHost = true;
    base.hostPlayer = init.hostPlayer;
    base.localPlayer = init.hostPlayer;
    base.winner = snapshot.winner;
    base.market = {
        1: snapshot.market[1].map((instanceId) =>
            instanceId ? inflateCardFromInstance(instanceId, init.cardInstances) : null
        ),
        2: snapshot.market[2].map((instanceId) =>
            instanceId ? inflateCardFromInstance(instanceId, init.cardInstances) : null
        ),
        3: snapshot.market[3].map((instanceId) =>
            instanceId ? inflateCardFromInstance(instanceId, init.cardInstances) : null
        ),
    };
    base.decks = {
        1: snapshot.decks[1].map((instanceId) => inflateCardFromInstance(instanceId, init.cardInstances)),
        2: snapshot.decks[2].map((instanceId) => inflateCardFromInstance(instanceId, init.cardInstances)),
        3: snapshot.decks[3].map((instanceId) => inflateCardFromInstance(instanceId, init.cardInstances)),
    };
    base.playerTableau = {
        p1: snapshot.playerTableau.p1.map((card) => inflateReplayTableauCard(card, init.cardInstances)),
        p2: snapshot.playerTableau.p2.map((card) => inflateReplayTableauCard(card, init.cardInstances)),
    };
    base.playerReserved = {
        p1: snapshot.playerReserved.p1.map((instanceId) =>
            inflateCardFromInstance(instanceId, init.cardInstances)
        ),
        p2: snapshot.playerReserved.p2.map((instanceId) =>
            inflateCardFromInstance(instanceId, init.cardInstances)
        ),
    };
    base.playerRoyals = {
        p1: snapshot.playerRoyals.p1.map((royalId) => inflateRoyalCard(royalId)),
        p2: snapshot.playerRoyals.p2.map((royalId) => inflateRoyalCard(royalId)),
    };
    base.inventories = cloneJson(snapshot.inventories);
    base.privileges = cloneJson(snapshot.privileges);
    base.royalDeck = snapshot.royalDeck.map((royalId) => inflateRoyalCard(royalId));
    base.royalMilestones = cloneJson(snapshot.royalMilestones);
    base.extraPoints = cloneJson(snapshot.extraPoints);
    base.extraCrowns = cloneJson(snapshot.extraCrowns);
    base.extraAllocation = cloneJson(snapshot.extraAllocation);
    base.extraPrivileges = cloneJson(snapshot.extraPrivileges);
    base.playerBuffs = {
        p1: inflateReplayBuffRef(snapshot.playerBuffs.p1.buff),
        p2: inflateReplayBuffRef(snapshot.playerBuffs.p2.buff),
    };
    base.draftPool = cloneJson(snapshot.draftPool);
    base.p2DraftPool = snapshot.p2DraftPool ? cloneJson(snapshot.p2DraftPool) : undefined;
    base.p1SelectedBuff = snapshot.p1SelectedBuffId
        ? inflateReplayBuffRef({
              id: snapshot.p1SelectedBuffId,
              level: (BUFF_MAP.get(snapshot.p1SelectedBuffId)?.level ?? 0) as ReplayBuffRef['level'],
          })
        : null;
    base.draftOrder = cloneJson(snapshot.draftOrder);
    base.buffLevel = snapshot.buffLevel;
    base.p2DraftLevel = snapshot.p2DraftLevel;
    base.privilegeGemCount = snapshot.privilegeGemCount;
    base.pendingSetup =
        snapshot.phase === 'DRAFT_PHASE' || snapshot.draftOrder.length > 0
            ? buildPendingSetupFromInit(init)
            : null;
    base.pendingReserve = snapshot.pendingReserve
        ? {
              ...(snapshot.pendingReserve.instanceId
                  ? {
                        card: inflateCardFromInstance(
                            snapshot.pendingReserve.instanceId,
                            init.cardInstances
                        ),
                    }
                  : {}),
              level: snapshot.pendingReserve.level,
              ...(snapshot.pendingReserve.idx !== undefined ? { idx: snapshot.pendingReserve.idx } : {}),
              ...(snapshot.pendingReserve.isDeck ? { isDeck: true } : {}),
          }
        : null;
    base.bonusGemTarget =
        snapshot.bonusGemTarget && snapshot.bonusGemTarget !== 'empty'
            ? GEM_TYPES[snapshot.bonusGemTarget.toUpperCase() as keyof typeof GEM_TYPES]
            : null;
    base.pendingBuy = snapshot.pendingBuy
        ? {
              card: inflateCardFromInstance(snapshot.pendingBuy.instanceId, init.cardInstances),
              source: snapshot.pendingBuy.source,
              ...(snapshot.pendingBuy.marketRef
                  ? { marketInfo: cloneJson(snapshot.pendingBuy.marketRef) }
                  : {}),
          }
        : null;
    base.nextPlayerAfterRoyal = snapshot.nextPlayerAfterRoyal;
    base.pendingExtraTurn = snapshot.pendingExtraTurn;
    base.playerTurnCounts = cloneJson(snapshot.playerTurnCounts);
    base.activeModal = null;
    base.lastFeedback = null;
    base.toastMessage = null;
    base.abilityResolution = snapshot.abilityResolution
        ? (cloneJson(snapshot.abilityResolution) as NonNullable<GameState['abilityResolution']>)
        : null;
    return base;
};

const findCardInMarket = (state: GameState, marketRef: ReplayMarketRef) => {
    if (marketRef.isExtra && marketRef.level === 3) {
        const indexFromTail = marketRef.extraIdx + 1;
        return state.decks[3][state.decks[3].length - indexFromTail] ?? null;
    }
    return state.market[marketRef.level][marketRef.idx] ?? null;
};

const findCardByInstance = (
    state: GameState,
    instanceId: ReplayCardInstanceId,
    owner: PlayerKey
) =>
    state.playerReserved[owner].find((card) => card.id === instanceId) ??
    state.playerTableau[owner].find((card) => card.id === instanceId && !card.isBuff) ??
    null;

export const inflateReplayEventToGameAction = (
    state: GameState,
    event: ReplayEvent,
    init: ReplayInitSnapshot
): GameAction => {
    switch (event.type) {
        case 'select_buff':
            return {
                type: 'SELECT_BUFF',
                payload: {
                    buffId: event.buffId,
                    ...(event.randomColor ? { randomColor: event.randomColor } : {}),
                    ...(event.initRandoms ? { initRandoms: cloneJson(event.initRandoms) } : {}),
                    ...(event.p2DraftPoolIndices
                        ? { p2DraftPoolIndices: cloneJson(event.p2DraftPoolIndices) }
                        : {}),
                },
            };
        case 'take_gems':
            return {
                type: 'TAKE_GEMS',
                payload: { coords: cloneJson(event.coords) },
            };
        case 'replenish':
            return event.randoms
                ? {
                      type: 'REPLENISH',
                      payload: { randoms: cloneJson(event.randoms) },
                  }
                : { type: 'REPLENISH' };
        case 'take_bonus_gem':
            return {
                type: 'TAKE_BONUS_GEM',
                payload: cloneJson(event.coord),
            };
        case 'discard_gem':
            return {
                type: 'DISCARD_GEM',
                payload: event.gemId,
            };
        case 'steal_gem':
            return {
                type: 'STEAL_GEM',
                payload: { gemId: event.gemId },
            };
        case 'buy_card': {
            const card =
                event.source === 'market' && event.marketRef
                    ? findCardInMarket(state, event.marketRef)
                    : findCardByInstance(state, event.instanceId, event.actor);
            const inflatedCard =
                card ?? inflateCardFromInstance(event.instanceId, init.cardInstances);

            return {
                type: 'BUY_CARD',
                payload: {
                    card: {
                        ...cloneJson(inflatedCard),
                        bonusColor: event.bonusColor,
                    },
                    source: event.source,
                    ...(event.marketRef ? { marketInfo: cloneJson(event.marketRef) } : {}),
                    ...(event.randoms ? { randoms: cloneJson(event.randoms) } : {}),
                },
            };
        }
        case 'reserve_card': {
            const card = event.isSteal
                ? findCardByInstance(
                      state,
                      event.instanceId,
                      event.actor === 'p1' ? 'p2' : 'p1'
                  )
                : findCardInMarket(state, event.marketRef);
            return {
                type: 'RESERVE_CARD',
                payload: {
                    card: cloneJson(card ?? inflateCardFromInstance(event.instanceId, init.cardInstances)),
                    level: event.level,
                    idx: event.marketRef.idx,
                    ...(event.goldCoord ? { goldCoords: cloneJson(event.goldCoord) } : {}),
                    ...(event.isExtra ? { isExtra: true } : {}),
                    ...(event.extraIdx !== undefined ? { extraIdx: event.extraIdx } : {}),
                    ...(event.isSteal ? { isSteal: true } : {}),
                },
            };
        }
        case 'reserve_deck':
            return {
                type: 'RESERVE_DECK',
                payload: {
                    level: event.level,
                    ...(event.goldCoord ? { goldCoords: cloneJson(event.goldCoord) } : {}),
                },
            };
        case 'discard_reserved':
            return {
                type: 'DISCARD_RESERVED',
                payload: { cardId: event.instanceId },
            };
        case 'use_privilege':
            return {
                type: 'USE_PRIVILEGE',
                payload: cloneJson(event.coord),
            };
        case 'select_royal': {
            const royal = state.royalDeck.find((card) => card.id === event.royalId) ?? inflateRoyalCard(event.royalId);
            return {
                type: 'SELECT_ROYAL_CARD',
                payload: { card: cloneJson(royal) },
            };
        }
    }
};

export const createReplayCheckpoint = (
    revision: number,
    state: GameState,
    runtimeToInstance: Map<string, ReplayCardInstanceId>
): ReplayCheckpoint => ({
    revision,
    state: serializeReplayStateSnapshot(state, runtimeToInstance),
});
