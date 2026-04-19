import { GAME_PHASES, GRID_SIZE } from '../constants';
import type {
    BonusGemPayload,
    BuffInitPayload,
    Buff,
    BuyCardPayload,
    Card,
    GameAction,
    GameState,
    GemColor,
    GemCoord,
    InitDraftPayload,
    InitiateBuyJokerPayload,
    InitiateReserveDeckPayload,
    InitiateReservePayload,
    PeekDeckPayload,
    PlayerKey,
    PlayerInitRandoms,
    ReplenishPayload,
    ReserveCardPayload,
    ReserveDeckPayload,
    RoyalCard,
    SelectBuffPayload,
    SelectRoyalPayload,
    StealGemPayload,
    UsePrivilegePayload,
} from '../types';
import type { NetworkMessage } from '../types/network';
import { getCommandPhaseRejectionReason } from './fsm';
import { validateGemSelection } from './validators';

const PLAYER_KEYS = new Set<PlayerKey>(['p1', 'p2']);
const GEM_COLORS = new Set<GemColor>(['blue', 'white', 'green', 'black', 'red', 'pearl', 'gold']);
const BASIC_GEM_COLORS = new Set(['blue', 'white', 'green', 'black', 'red']);
const BASIC_BONUS_COLORS = new Set<GemColor | 'null'>([
    'blue',
    'white',
    'green',
    'black',
    'red',
    'pearl',
    'gold',
    'null',
]);
const GAME_PHASE_VALUES = new Set(Object.values(GAME_PHASES));
const GAME_MODE_VALUES = new Set(['LOCAL_PVP', 'PVE', 'ONLINE_MULTIPLAYER']);

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const isInteger = (value: unknown): value is number =>
    typeof value === 'number' && Number.isInteger(value);

const isLevel = (value: unknown): value is 1 | 2 | 3 => value === 1 || value === 2 || value === 3;

const isPlayerKey = (value: unknown): value is PlayerKey =>
    typeof value === 'string' && PLAYER_KEYS.has(value as PlayerKey);

const isGemColor = (value: unknown): value is GemColor =>
    typeof value === 'string' && GEM_COLORS.has(value as GemColor);

const isBasicGemColor = (value: unknown): value is PlayerInitRandoms['preferenceColor'] =>
    typeof value === 'string' && BASIC_GEM_COLORS.has(value);

const isBonusColor = (value: unknown): value is GemColor | 'null' =>
    typeof value === 'string' && BASIC_BONUS_COLORS.has(value as GemColor | 'null');

const isCoord = (value: unknown): value is GemCoord =>
    isPlainObject(value) && isInteger(value.r) && isInteger(value.c);

const isGemCoordsArray = (value: unknown): value is GemCoord[] =>
    Array.isArray(value) && value.every(isCoord);

const isGemInventoryLike = (value: unknown): boolean => {
    if (!isPlainObject(value)) return false;
    return ['blue', 'white', 'green', 'black', 'red', 'pearl', 'gold'].every(
        (key) => typeof value[key] === 'number'
    );
};

const isGemTypeObjectLike = (value: unknown): boolean =>
    isPlainObject(value) &&
    typeof value.id === 'string' &&
    typeof value.color === 'string' &&
    typeof value.border === 'string' &&
    typeof value.label === 'string';

const isBoardCellLike = (value: unknown): boolean =>
    isPlainObject(value) && typeof value.uid === 'string' && isGemTypeObjectLike(value.type);

const isBoardLike = (value: unknown): boolean =>
    Array.isArray(value) &&
    value.length === GRID_SIZE &&
    value.every(
        (row) =>
            Array.isArray(row) &&
            row.length === GRID_SIZE &&
            row.every((cell) => isBoardCellLike(cell))
    );

const isBagLike = (value: unknown): boolean =>
    Array.isArray(value) &&
    value.every((entry) => typeof entry === 'string' || isBoardCellLike(entry));

const isDeckStateLike = (value: unknown): boolean =>
    isPlainObject(value) &&
    Array.isArray(value[1]) &&
    value[1].every((card) => isCardLike(card)) &&
    Array.isArray(value[2]) &&
    value[2].every((card) => isCardLike(card)) &&
    Array.isArray(value[3]) &&
    value[3].every((card) => isCardLike(card));

const isMarketStateLike = (value: unknown): boolean =>
    isPlainObject(value) &&
    Array.isArray(value[1]) &&
    value[1].every((card) => card === null || isCardLike(card)) &&
    Array.isArray(value[2]) &&
    value[2].every((card) => card === null || isCardLike(card)) &&
    Array.isArray(value[3]) &&
    value[3].every((card) => card === null || isCardLike(card));

const isPlayerInitRandomsLike = (value: unknown): value is PlayerInitRandoms =>
    isPlainObject(value) &&
    Array.isArray(value.randomGems) &&
    value.randomGems.length === 5 &&
    value.randomGems.every((color) => isBasicGemColor(color)) &&
    isLevel(value.reserveCardLevel) &&
    isBasicGemColor(value.preferenceColor);

const isInitRandomsLike = (value: unknown): value is BuffInitPayload['initRandoms'] =>
    isPlainObject(value) && isPlayerInitRandomsLike(value.p1) && isPlayerInitRandomsLike(value.p2);

const isCardLike = (value: unknown): value is Card => {
    if (!isPlainObject(value)) return false;
    return (
        typeof value.id === 'string' &&
        isLevel(value.level) &&
        typeof value.points === 'number' &&
        isPlainObject(value.cost) &&
        (value.bonusColor === undefined || isBonusColor(value.bonusColor))
    );
};

const isRoyalCardLike = (value: unknown): value is RoyalCard => {
    if (!isPlainObject(value)) return false;
    const ability = value.ability;
    const hasValidAbility =
        typeof ability === 'string' ||
        (Array.isArray(ability) && ability.every((entry) => typeof entry === 'string'));

    return (
        typeof value.id === 'string' &&
        typeof value.points === 'number' &&
        isGemColor(value.bonusColor) &&
        typeof value.label === 'string' &&
        hasValidAbility
    );
};

const isMarketInfo = (
    value: unknown
): value is { level: 1 | 2 | 3; idx: number; isExtra?: boolean; extraIdx?: number } => {
    if (!isPlainObject(value) || !isLevel(value.level) || !isInteger(value.idx)) return false;
    if (value.isExtra !== undefined && typeof value.isExtra !== 'boolean') return false;
    if (value.extraIdx !== undefined && !isInteger(value.extraIdx)) return false;
    return true;
};

const isTakeGemsPayload = (value: unknown): value is BonusGemPayload | { coords: GemCoord[] } =>
    isPlainObject(value) && isGemCoordsArray(value.coords);

const isBonusGemPayload = (value: unknown): value is BonusGemPayload =>
    isPlainObject(value) && isInteger(value.r) && isInteger(value.c);

const isReplenishPayload = (value: unknown): value is ReplenishPayload => {
    if (value === undefined) return true;
    if (!isPlainObject(value)) return false;
    if (value.randoms === undefined) return true;
    if (!isPlainObject(value.randoms)) return false;

    const { extortionColor, expansionColor } = value.randoms;
    return (
        (extortionColor === undefined || isGemColor(extortionColor)) &&
        (expansionColor === undefined || isGemColor(expansionColor))
    );
};

const isStealGemPayload = (value: unknown): value is StealGemPayload =>
    isPlainObject(value) && isGemColor(value.gemId);

const isUsePrivilegePayload = (value: unknown): value is UsePrivilegePayload =>
    isPlainObject(value) && isInteger(value.r) && isInteger(value.c);

const isBuyCardPayload = (value: unknown): value is BuyCardPayload => {
    if (!isPlainObject(value) || !isCardLike(value.card)) return false;
    if (value.source !== 'market' && value.source !== 'reserved') return false;
    if (value.marketInfo !== undefined && !isMarketInfo(value.marketInfo)) return false;
    if (value.randoms !== undefined) {
        if (!isPlainObject(value.randoms)) return false;
        if (
            value.randoms.bountyHunterColor !== undefined &&
            !isGemColor(value.randoms.bountyHunterColor)
        ) {
            return false;
        }
    }
    return true;
};

const isInitiateBuyJokerPayload = (value: unknown): value is InitiateBuyJokerPayload =>
    isPlainObject(value) &&
    isCardLike(value.card) &&
    typeof value.source === 'string' &&
    (value.marketInfo === undefined || isMarketInfo(value.marketInfo));

const isInitiateReservePayload = (value: unknown): value is InitiateReservePayload =>
    isPlainObject(value) && isCardLike(value.card) && isLevel(value.level) && isInteger(value.idx);

const isInitiateReserveDeckPayload = (value: unknown): value is InitiateReserveDeckPayload =>
    isPlainObject(value) && isLevel(value.level);

const isReserveCardPayload = (value: unknown): value is ReserveCardPayload => {
    if (
        !isPlainObject(value) ||
        !isCardLike(value.card) ||
        !isLevel(value.level) ||
        !isInteger(value.idx)
    ) {
        return false;
    }
    if (value.goldCoords !== undefined && !isCoord(value.goldCoords)) return false;
    if (value.isExtra !== undefined && typeof value.isExtra !== 'boolean') return false;
    if (value.extraIdx !== undefined && !isInteger(value.extraIdx)) return false;
    if (value.isSteal !== undefined && typeof value.isSteal !== 'boolean') return false;
    return true;
};

const isReserveDeckPayload = (value: unknown): value is ReserveDeckPayload =>
    isPlainObject(value) &&
    isLevel(value.level) &&
    (value.goldCoords === undefined || isCoord(value.goldCoords));

const isSelectRoyalPayload = (value: unknown): value is SelectRoyalPayload =>
    isPlainObject(value) && isRoyalCardLike(value.card);

const isPeekDeckPayload = (value: unknown): value is PeekDeckPayload =>
    isPlainObject(value) && isLevel(value.level);

const isSelectBuffPayload = (value: unknown): value is SelectBuffPayload | string => {
    if (typeof value === 'string') return true;
    if (!isPlainObject(value) || typeof value.buffId !== 'string') return false;
    if (value.randomColor !== undefined && !isGemColor(value.randomColor)) return false;
    if (value.initRandoms !== undefined) {
        if (!isPlainObject(value.initRandoms)) return false;
        if (value.initRandoms.p1 !== undefined && !isPlayerInitRandomsLike(value.initRandoms.p1)) {
            return false;
        }
        if (value.initRandoms.p2 !== undefined && !isPlayerInitRandomsLike(value.initRandoms.p2)) {
            return false;
        }
    }
    if (value.p2DraftPoolIndices !== undefined) {
        if (
            !Array.isArray(value.p2DraftPoolIndices) ||
            !value.p2DraftPoolIndices.every((entry) => isInteger(entry))
        ) {
            return false;
        }
    }
    return true;
};

const isGameSetupPayload = (value: unknown): value is BuffInitPayload =>
    isPlainObject(value) &&
    typeof value.mode === 'string' &&
    GAME_MODE_VALUES.has(value.mode) &&
    typeof value.isHost === 'boolean' &&
    isBoardLike(value.board) &&
    isBagLike(value.bag) &&
    isMarketStateLike(value.market) &&
    isDeckStateLike(value.decks) &&
    isInitRandomsLike(value.initRandoms);

const isInitDraftPayload = (value: unknown): value is InitDraftPayload =>
    isGameSetupPayload(value) &&
    Array.isArray(value.draftPool) &&
    value.draftPool.every((entry) => typeof entry === 'string') &&
    isLevel(value.buffLevel);

const isLikelyGameState = (value: unknown): value is GameState => {
    if (!isPlainObject(value)) return false;
    if (!isBoardLike(value.board) || !isBagLike(value.bag)) return false;
    if (!isPlayerKey(value.turn) || typeof value.isHost !== 'boolean') return false;
    if (
        typeof value.phase !== 'string' ||
        !GAME_PHASE_VALUES.has(value.phase) ||
        typeof value.mode !== 'string' ||
        !GAME_MODE_VALUES.has(value.mode)
    ) {
        return false;
    }
    if (
        !isPlainObject(value.inventories) ||
        !isPlainObject(value.privileges) ||
        !isDeckStateLike(value.decks) ||
        !isMarketStateLike(value.market)
    ) {
        return false;
    }
    return (
        isGemInventoryLike(value.inventories.p1) &&
        isGemInventoryLike(value.inventories.p2) &&
        typeof value.privileges.p1 === 'number' &&
        typeof value.privileges.p2 === 'number'
    );
};

export const isBootstrapAction = (
    action: unknown
): action is Extract<GameAction, { type: 'INIT' | 'INIT_DRAFT' }> => {
    if (!isPlainObject(action) || typeof action.type !== 'string') return false;
    if (action.type === 'INIT') return isGameSetupPayload(action.payload);
    if (action.type === 'INIT_DRAFT') return isInitDraftPayload(action.payload);
    return false;
};

export const isRuntimeActionShapeValid = (action: unknown): action is GameAction => {
    if (!isPlainObject(action) || typeof action.type !== 'string') return false;

    switch (action.type) {
        case 'INIT':
            return isGameSetupPayload(action.payload);
        case 'INIT_DRAFT':
            return isInitDraftPayload(action.payload);
        case 'FORCE_SYNC':
        case 'FLATTEN':
            return isLikelyGameState(action.payload);
        case 'SELECT_BUFF':
            return isSelectBuffPayload(action.payload);
        case 'TAKE_GEMS':
            return isTakeGemsPayload(action.payload);
        case 'REPLENISH':
            return isReplenishPayload(action.payload);
        case 'TAKE_BONUS_GEM':
            return isBonusGemPayload(action.payload);
        case 'DISCARD_GEM':
            return typeof action.payload === 'string' && isGemColor(action.payload);
        case 'STEAL_GEM':
            return isStealGemPayload(action.payload);
        case 'INITIATE_BUY_JOKER':
            return isInitiateBuyJokerPayload(action.payload);
        case 'BUY_CARD':
            return isBuyCardPayload(action.payload);
        case 'INITIATE_RESERVE':
            return isInitiateReservePayload(action.payload);
        case 'INITIATE_RESERVE_DECK':
            return isInitiateReserveDeckPayload(action.payload);
        case 'CANCEL_RESERVE':
        case 'ACTIVATE_PRIVILEGE':
        case 'CANCEL_PRIVILEGE':
        case 'FORCE_ROYAL_SELECTION':
        case 'UNDO':
        case 'REDO':
        case 'CLOSE_MODAL':
            return action.payload === undefined;
        case 'RESERVE_CARD':
            return isReserveCardPayload(action.payload);
        case 'RESERVE_DECK':
            return isReserveDeckPayload(action.payload);
        case 'DISCARD_RESERVED':
            return isPlainObject(action.payload) && typeof action.payload.cardId === 'string';
        case 'USE_PRIVILEGE':
            return isUsePrivilegePayload(action.payload);
        case 'SELECT_ROYAL_CARD':
            return isSelectRoyalPayload(action.payload);
        case 'DEBUG_ADD_CROWNS':
        case 'DEBUG_ADD_POINTS':
        case 'DEBUG_ADD_PRIVILEGE':
            return isPlayerKey(action.payload);
        case 'PEEK_DECK':
            return isPeekDeckPayload(action.payload);
        case 'DEBUG_REROLL_BUFFS':
            return (
                isPlainObject(action.payload) &&
                (action.payload.level === undefined || isLevel(action.payload.level))
            );
        default:
            return false;
    }
};

export const parseNetworkMessage = (value: unknown): NetworkMessage | null => {
    if (!isPlainObject(value) || typeof value.type !== 'string') return null;

    switch (value.type) {
        case 'HEARTBEAT_PING':
        case 'HEARTBEAT_PONG':
            return typeof value.timestamp === 'number'
                ? ({ type: value.type, timestamp: value.timestamp } as NetworkMessage)
                : null;
        case 'REQUEST_FULL_SYNC':
            return { type: 'REQUEST_FULL_SYNC' };
        case 'GAME_ACTION':
            if (!isBootstrapAction(value.action)) return null;
            if (value.checksum !== undefined && typeof value.checksum !== 'string') return null;
            return {
                type: 'GAME_ACTION',
                action: value.action,
                checksum: value.checksum,
            };
        case 'GUEST_REQUEST':
            return isRuntimeActionShapeValid(value.action)
                ? { type: 'GUEST_REQUEST', action: value.action }
                : null;
        case 'SYNC_STATE':
            return isLikelyGameState(value.state)
                ? {
                      type: 'SYNC_STATE',
                      state: value.state,
                      reason:
                          value.reason === 'INITIAL' || value.reason === 'RECOVERY'
                              ? value.reason
                              : undefined,
                  }
                : null;
        default:
            return null;
    }
};

const isWithinBoard = ({ r, c }: GemCoord): boolean =>
    r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE;

const sameMarketInfo = (
    left: { level: 1 | 2 | 3; idx: number; isExtra?: boolean; extraIdx?: number } | undefined,
    right: { level: 1 | 2 | 3; idx: number; isExtra?: boolean; extraIdx?: number } | undefined
): boolean => JSON.stringify(left ?? null) === JSON.stringify(right ?? null);

const getMarketCard = (
    state: GameState,
    marketInfo:
        | {
              level: 1 | 2 | 3;
              idx: number;
              isExtra?: boolean;
              extraIdx?: number;
          }
        | undefined
): Card | null => {
    if (!marketInfo) return null;
    const { level, idx, isExtra, extraIdx } = marketInfo;

    if (isExtra) {
        if (level !== 3 || extraIdx === undefined) return null;
        const deck = state.decks[level];
        const targetIdx = deck.length - (extraIdx + 1);
        return targetIdx >= 0 ? deck[targetIdx] || null : null;
    }

    return state.market[level][idx] || null;
};

const hasPrivilegeAvailable = (state: GameState): boolean =>
    (state.extraPrivileges?.[state.turn] || 0) > 0 || state.privileges[state.turn] > 0;

const canUsePrivilegeCharge = (state: GameState): boolean => {
    const buff = state.playerBuffs?.[state.turn];
    const isSecondDoubleAgentPick =
        buff?.effects?.passive?.privilegeBuff === 2 && state.privilegeGemCount === 1;
    return hasPrivilegeAvailable(state) || isSecondDoubleAgentPick;
};

const getSelectBuffPool = (state: GameState): string[] =>
    state.turn === 'p1' ? state.draftPool : state.p2DraftPool || [];

const matchesPendingReserve = (
    state: GameState,
    payload: ReserveCardPayload | ReserveDeckPayload
): boolean => {
    if (!state.pendingReserve) return false;
    if (state.pendingReserve.level !== payload.level) return false;
    if ('card' in payload) {
        return (
            !state.pendingReserve.isDeck &&
            state.pendingReserve.card?.id === payload.card.id &&
            state.pendingReserve.idx === payload.idx
        );
    }
    return state.pendingReserve.isDeck === true;
};

const validateGoldCoord = (state: GameState, coord: GemCoord | undefined): string | null => {
    if (!coord) return 'A gold coordinate is required for this action.';
    if (!isWithinBoard(coord)) return 'Gold coordinate is out of bounds.';
    return state.board[coord.r][coord.c]?.type?.id === 'gold'
        ? null
        : 'Selected coordinate does not contain a gold gem.';
};

const validateCardSource = (
    state: GameState,
    source: 'market' | 'reserved',
    card: Card,
    marketInfo?:
        | {
              level: 1 | 2 | 3;
              idx: number;
              isExtra?: boolean;
              extraIdx?: number;
          }
        | undefined
): string | null => {
    if (source === 'reserved') {
        return state.playerReserved[state.turn].some((entry) => entry.id === card.id)
            ? null
            : 'Reserved card does not belong to the active player.';
    }

    const marketCard = getMarketCard(state, marketInfo);
    return marketCard?.id === card.id
        ? null
        : 'Selected market card does not match the current state.';
};

const isWinningModalCloseAllowed = (state: GameState): boolean =>
    state.activeModal?.type !== 'PEEK' || state.activeModal.data.initiator === state.turn;

export const getActionRejectionReason = (state: GameState, action: GameAction): string | null => {
    if (!isRuntimeActionShapeValid(action)) {
        return 'Malformed action payload.';
    }

    if (
        action.type !== 'INIT' &&
        action.type !== 'INIT_DRAFT' &&
        action.type !== 'FORCE_SYNC' &&
        action.type !== 'FLATTEN'
    ) {
        const fsmRejectionReason = getCommandPhaseRejectionReason(state, action);
        if (fsmRejectionReason) {
            return fsmRejectionReason;
        }
    }

    if (state.winner && action.type !== 'CLOSE_MODAL') {
        return 'The game has already ended.';
    }

    switch (action.type) {
        case 'SELECT_BUFF': {
            const buffId =
                typeof action.payload === 'string' ? action.payload : action.payload.buffId;
            return getSelectBuffPool(state).includes(buffId)
                ? null
                : 'Selected buff is not available to the active player.';
        }
        case 'TAKE_GEMS': {
            if (action.payload.coords.length === 0 || action.payload.coords.length > 3) {
                return 'Gem selection must contain between one and three coordinates.';
            }
            if (!action.payload.coords.every(isWithinBoard))
                return 'Gem selection contains an out-of-bounds coordinate.';
            const selectionCheck = validateGemSelection(action.payload.coords);
            if (!selectionCheck.valid || selectionCheck.hasGap) {
                return selectionCheck.error || 'Gem selection is invalid.';
            }
            const activeBuff = state.playerBuffs?.[state.turn];
            if (activeBuff?.effects?.passive?.noTake3 && action.payload.coords.length === 3) {
                return 'The active buff blocks taking three gems.';
            }
            const invalidCell = action.payload.coords.find(({ r, c }) => {
                const cell = state.board[r][c];
                return !cell || cell.type.id === 'empty' || cell.type.id === 'gold';
            });
            return invalidCell ? 'Gem selection includes an empty or gold cell.' : null;
        }
        case 'REPLENISH':
            return state.bag.length > 0 ? null : 'The bag is empty.';
        case 'TAKE_BONUS_GEM': {
            const coord = action.payload;
            if (!isWithinBoard(coord)) return 'Bonus gem coordinate is out of bounds.';
            const cell = state.board[coord.r][coord.c];
            if (!cell || cell.type.id === 'empty' || cell.type.id === 'gold') {
                return 'Selected bonus gem is not available.';
            }
            return cell.type.id === state.bonusGemTarget?.id
                ? null
                : 'Selected bonus gem does not match the required color.';
        }
        case 'DISCARD_GEM':
            return state.inventories[state.turn][action.payload] > 0
                ? null
                : 'The active player does not own that gem.';
        case 'STEAL_GEM': {
            if (action.payload.gemId === 'gold') return 'Gold cannot be stolen.';
            const opponent = state.turn === 'p1' ? 'p2' : 'p1';
            return state.inventories[opponent][action.payload.gemId] > 0
                ? null
                : 'The opponent does not own the requested gem.';
        }
        case 'INITIATE_BUY_JOKER':
            if (action.payload.card.bonusColor !== 'gold')
                return 'Only joker cards require bonus-color selection.';
            return validateCardSource(
                state,
                action.payload.source === 'reserved' ? 'reserved' : 'market',
                action.payload.card,
                action.payload.marketInfo
            );
        case 'BUY_CARD': {
            const sourceError = validateCardSource(
                state,
                action.payload.source,
                action.payload.card,
                action.payload.marketInfo
            );
            if (sourceError) return sourceError;

            if (state.phase === GAME_PHASES.SELECT_CARD_COLOR) {
                if (!state.pendingBuy)
                    return 'No pending card is waiting for a bonus-color selection.';
                if (
                    state.pendingBuy.card.id !== action.payload.card.id ||
                    state.pendingBuy.source !== action.payload.source ||
                    !sameMarketInfo(state.pendingBuy.marketInfo, action.payload.marketInfo)
                ) {
                    return 'Selected card does not match the pending bonus-color choice.';
                }
                return action.payload.card.bonusColor === 'gold'
                    ? 'A concrete bonus color is required before buying this card.'
                    : null;
            }

            return action.payload.card.bonusColor === 'gold'
                ? 'Joker cards must be routed through the bonus-color selection flow.'
                : null;
        }
        case 'INITIATE_RESERVE':
            return getMarketCard(state, { level: action.payload.level, idx: action.payload.idx })
                ?.id === action.payload.card.id
                ? null
                : 'Selected reserve card does not match the market.';
        case 'INITIATE_RESERVE_DECK':
            return state.decks[action.payload.level].length > 0 ? null : 'Selected deck is empty.';
        case 'CANCEL_RESERVE':
            return state.pendingReserve ? null : 'There is no pending reserve action to cancel.';
        case 'RESERVE_CARD': {
            if (state.playerReserved[state.turn].length >= 3)
                return 'The reserve limit has already been reached.';
            if (action.payload.isSteal) {
                const opponent = state.turn === 'p1' ? 'p2' : 'p1';
                if (!state.playerBuffs?.[state.turn]?.effects?.passive?.stealReserved) {
                    return 'The active player cannot steal reserved cards.';
                }
                return state.playerReserved[opponent].some(
                    (card) => card.id === action.payload.card.id
                )
                    ? null
                    : 'The target reserved card does not exist.';
            }

            if (state.phase === GAME_PHASES.RESERVE_WAITING_GEM) {
                if (!matchesPendingReserve(state, action.payload)) {
                    return 'Reserve resolution does not match the pending reserve action.';
                }
                const goldError = validateGoldCoord(state, action.payload.goldCoords);
                if (goldError) return goldError;
            }

            const sourceCard = getMarketCard(state, {
                level: action.payload.level,
                idx: action.payload.idx,
                isExtra: action.payload.isExtra,
                extraIdx: action.payload.extraIdx,
            });
            return sourceCard?.id === action.payload.card.id
                ? null
                : 'Selected reserve card does not match the current market.';
        }
        case 'RESERVE_DECK':
            if (state.playerReserved[state.turn].length >= 3)
                return 'The reserve limit has already been reached.';
            if (state.phase === GAME_PHASES.RESERVE_WAITING_GEM) {
                if (!matchesPendingReserve(state, action.payload)) {
                    return 'Deck reserve resolution does not match the pending reserve action.';
                }
                const goldError = validateGoldCoord(state, action.payload.goldCoords);
                if (goldError) return goldError;
            }
            return state.decks[action.payload.level].length > 0 ? null : 'Selected deck is empty.';
        case 'DISCARD_RESERVED': {
            if (
                state.playerBuffs?.[state.turn]?.effects?.active !== 'discard_reserved' &&
                state.playerBuffs?.[state.turn]?.id !== 'puppet_master'
            ) {
                return 'The active player cannot discard reserved cards.';
            }
            return state.playerReserved[state.turn].some(
                (card) => card.id === action.payload.cardId
            )
                ? null
                : 'Selected reserved card does not exist.';
        }
        case 'ACTIVATE_PRIVILEGE':
            if (!hasPrivilegeAvailable(state))
                return 'The active player has no privilege to spend.';
            return state.board.some((row) =>
                row.some((cell) => cell.type.id !== 'empty' && cell.type.id !== 'gold')
            )
                ? null
                : 'There are no valid gems available for a privilege action.';
        case 'USE_PRIVILEGE': {
            if (!canUsePrivilegeCharge(state))
                return 'The active player has no privilege charge available.';
            if (!isWithinBoard(action.payload)) return 'Privilege coordinate is out of bounds.';
            const cell = state.board[action.payload.r][action.payload.c];
            return cell && cell.type.id !== 'empty' && cell.type.id !== 'gold'
                ? null
                : 'Selected privilege gem is not available.';
        }
        case 'CANCEL_PRIVILEGE':
            return null;
        case 'SELECT_ROYAL_CARD':
            return state.royalDeck.some((card) => card.id === action.payload.card.id)
                ? null
                : 'Selected royal card is no longer available.';
        case 'PEEK_DECK':
            if (state.playerBuffs?.[state.turn]?.effects?.active !== 'peek_deck') {
                return 'The active player does not have a deck-peek ability.';
            }
            return null;
        case 'CLOSE_MODAL':
            return state.activeModal && isWinningModalCloseAllowed(state)
                ? null
                : state.activeModal
                  ? 'The active player cannot close this modal.'
                  : 'There is no active modal to close.';
        default:
            return null;
    }
};
