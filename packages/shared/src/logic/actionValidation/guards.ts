import { GAME_PHASES, GRID_SIZE } from '../../constants';
import type {
    BonusGemPayload,
    BuffInitPayload,
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
    MarketCardRef,
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
} from '../../types';
import {
    cardActionSourceSchema,
    marketCardRefSchema,
    rerollDraftPoolPayloadSchema,
    selectBuffPayloadSchema,
} from '../runtimeSchemas';

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
const GAME_PHASE_VALUES = new Set<string>(Object.values(GAME_PHASES));
const GAME_MODE_VALUES = new Set(['LOCAL_PVP', 'PVE', 'ONLINE_MULTIPLAYER']);

export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

export const isInteger = (value: unknown): value is number =>
    typeof value === 'number' && Number.isInteger(value);

export const isLevel = (value: unknown): value is 1 | 2 | 3 =>
    value === 1 || value === 2 || value === 3;

export const isDraftLevel = (value: unknown): value is 0 | 1 | 2 | 3 =>
    value === 0 || isLevel(value);

export const isPlayerKey = (value: unknown): value is PlayerKey =>
    typeof value === 'string' && PLAYER_KEYS.has(value as PlayerKey);

export const isGemColor = (value: unknown): value is GemColor =>
    typeof value === 'string' && GEM_COLORS.has(value as GemColor);

const isBasicGemColor = (value: unknown): value is PlayerInitRandoms['preferenceColor'] =>
    typeof value === 'string' && BASIC_GEM_COLORS.has(value);

const isBonusColor = (value: unknown): value is GemColor | 'null' =>
    typeof value === 'string' && BASIC_BONUS_COLORS.has(value as GemColor | 'null');

export const isCoord = (value: unknown): value is GemCoord =>
    isPlainObject(value) && isInteger(value.r) && isInteger(value.c);

export const isWithinBoard = ({ r, c }: GemCoord): boolean =>
    r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE;

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

const isMarketInfo = (value: unknown): value is MarketCardRef =>
    marketCardRefSchema.safeParse(value).success;

export const isTakeGemsPayload = (
    value: unknown
): value is BonusGemPayload | { coords: GemCoord[] } =>
    isPlainObject(value) && isGemCoordsArray(value.coords);

export const isBonusGemPayload = (value: unknown): value is BonusGemPayload =>
    isPlainObject(value) && isInteger(value.r) && isInteger(value.c);

export const isReplenishPayload = (value: unknown): value is ReplenishPayload => {
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

export const isStealGemPayload = (value: unknown): value is StealGemPayload =>
    isPlainObject(value) && isGemColor(value.gemId);

export const isUsePrivilegePayload = (value: unknown): value is UsePrivilegePayload =>
    isPlainObject(value) && isInteger(value.r) && isInteger(value.c);

export const isBuyCardPayload = (value: unknown): value is BuyCardPayload => {
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

export const isInitiateBuyJokerPayload = (value: unknown): value is InitiateBuyJokerPayload =>
    isPlainObject(value) &&
    isCardLike(value.card) &&
    cardActionSourceSchema.safeParse(value.source).success &&
    (value.marketInfo === undefined || isMarketInfo(value.marketInfo));

export const isInitiateReservePayload = (value: unknown): value is InitiateReservePayload =>
    isPlainObject(value) && isCardLike(value.card) && isLevel(value.level) && isInteger(value.idx);

export const isInitiateReserveDeckPayload = (value: unknown): value is InitiateReserveDeckPayload =>
    isPlainObject(value) && isLevel(value.level);

export const isReserveCardPayload = (value: unknown): value is ReserveCardPayload => {
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

export const isReserveDeckPayload = (value: unknown): value is ReserveDeckPayload =>
    isPlainObject(value) &&
    isLevel(value.level) &&
    (value.goldCoords === undefined || isCoord(value.goldCoords));

export const isSelectRoyalPayload = (value: unknown): value is SelectRoyalPayload =>
    isPlainObject(value) && isRoyalCardLike(value.card);

export const isPeekDeckPayload = (value: unknown): value is PeekDeckPayload =>
    isPlainObject(value) && isLevel(value.level);

export const isSelectBuffPayload = (value: unknown): value is SelectBuffPayload =>
    selectBuffPayloadSchema.safeParse(value).success;

export const isRerollDraftPoolPayload = (value: unknown): value is { level?: 1 | 2 | 3 } =>
    rerollDraftPoolPayloadSchema.safeParse(value).success;

export const isGameSetupPayload = (value: unknown): value is BuffInitPayload =>
    isPlainObject(value) &&
    typeof value.mode === 'string' &&
    GAME_MODE_VALUES.has(value.mode) &&
    typeof value.isHost === 'boolean' &&
    isPlayerKey(value.hostPlayer) &&
    isBoardLike(value.board) &&
    isBagLike(value.bag) &&
    isMarketStateLike(value.market) &&
    isDeckStateLike(value.decks) &&
    isInitRandomsLike(value.initRandoms);

export const isInitDraftPayload = (value: unknown): value is InitDraftPayload =>
    isGameSetupPayload(value) &&
    Array.isArray((value as InitDraftPayload).draftPool) &&
    (value as InitDraftPayload).draftPool.every((entry: unknown) => typeof entry === 'string') &&
    isLevel((value as InitDraftPayload).buffLevel);

export const isLikelyGameState = (value: unknown): value is GameState => {
    if (!isPlainObject(value)) return false;
    if (!isBoardLike(value.board) || !isBagLike(value.bag)) return false;
    if (
        !isPlayerKey(value.turn) ||
        typeof value.isHost !== 'boolean' ||
        !isPlayerKey(value.hostPlayer) ||
        !isPlayerKey(value.localPlayer)
    )
        return false;
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
        (value.buffLevel === undefined || isDraftLevel(value.buffLevel)) &&
        (value.p2DraftLevel === undefined || isDraftLevel(value.p2DraftLevel)) &&
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
        case 'REROLL_DRAFT_POOL':
            return isRerollDraftPoolPayload(action.payload);
        default:
            return false;
    }
};
