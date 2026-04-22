import type {
    Card,
    GameAction,
    GameState,
    GemCoord,
    GemColor,
    MarketCardRef,
    ReserveCardPayload,
    ReserveDeckPayload,
} from '../../types';
import { getCommandPhaseRejectionReason } from '../fsm';
import { getFsmPhaseSurfacePolicy, isBonusColorSelectionPhase } from '../fsm';
import { validateGemSelection } from '../validators';
import { isRuntimeActionShapeValid, isWithinBoard } from './guards';

const sameMarketInfo = (
    left: MarketCardRef | undefined,
    right: MarketCardRef | undefined
): boolean => JSON.stringify(left ?? null) === JSON.stringify(right ?? null);

const getMarketCard = (state: GameState, marketInfo: MarketCardRef | undefined): Card | null => {
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
    marketInfo?: MarketCardRef
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
            const buffId = action.payload.buffId;
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
        case 'DISCARD_GEM': {
            const gemId = action.payload as GemColor;
            return state.inventories[state.turn][gemId] > 0
                ? null
                : 'The active player does not own that gem.';
        }
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

            if (isBonusColorSelectionPhase(state.phase)) {
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

            if (getFsmPhaseSurfacePolicy(state.phase).boardInteractionMode === 'reserve-gold') {
                if (!matchesPendingReserve(state, action.payload)) {
                    return 'Reserve resolution does not match the pending reserve action.';
                }
                const goldError = validateGoldCoord(state, action.payload.goldCoords);
                if (goldError) return goldError;
            }

            const sourceCard = getMarketCard(
                state,
                action.payload.isExtra &&
                    action.payload.extraIdx !== undefined &&
                    action.payload.level === 3
                    ? {
                          level: 3,
                          idx: action.payload.idx,
                          isExtra: true,
                          extraIdx: action.payload.extraIdx,
                      }
                    : {
                          level: action.payload.level,
                          idx: action.payload.idx,
                      }
            );
            return sourceCard?.id === action.payload.card.id
                ? null
                : 'Selected reserve card does not match the current market.';
        }
        case 'RESERVE_DECK':
            if (state.playerReserved[state.turn].length >= 3)
                return 'The reserve limit has already been reached.';
            if (getFsmPhaseSurfacePolicy(state.phase).boardInteractionMode === 'reserve-gold') {
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
        case 'REROLL_DRAFT_POOL':
            if (state.mode !== 'LOCAL_PVP') {
                return 'Draft rerolls are only available in local PvP.';
            }
            if (state.turn === 'p2' && !state.p1SelectedBuff?.id) {
                return 'P2 draft rerolls require a locked-in P1 buff selection.';
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
