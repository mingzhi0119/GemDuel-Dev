import { describe, expect, it } from 'vitest';
import { GEM_TYPES } from '../../constants';
import {
    BUFF_NONE,
    type GameAction,
    type GameState,
    type GemTypeObject,
    type RoyalCard,
} from '../../types';
import { getActionRejectionReason } from '../actionValidation/rules';
import { createMockState } from './testHelpers';

const createState = (overrides: Partial<GameState> = {}): GameState =>
    JSON.parse(JSON.stringify(createMockState(overrides))) as GameState;

const placeGem = (
    state: GameState,
    r: number,
    c: number,
    gemType: GemTypeObject = GEM_TYPES.RED
) => {
    state.board[r][c] = { type: gemType, uid: `cell-${r}-${c}` };
};

const redRoyal: RoyalCard = {
    id: 'royal-red',
    points: 3,
    bonusColor: 'red' as const,
    ability: 'again' as const,
    label: 'Royal Red',
};

describe('actionValidation rules', () => {
    it('rejects malformed actions before any phase or win-condition logic runs', () => {
        const state = createState();

        expect(
            getActionRejectionReason(state, { type: 'RESERVE_CARD' } as unknown as GameAction)
        ).toBe('Malformed action payload.');
    });

    it('applies the command-phase matrix before evaluating action-specific rules', () => {
        const state = createState({ phase: 'STEAL_ACTION' });
        const action: GameAction = {
            type: 'TAKE_GEMS',
            payload: { coords: [{ r: 0, c: 0 }] },
        };

        expect(getActionRejectionReason(state, action)).toContain('TAKE_GEMS');
    });

    it('allows close-modal cleanup when the game is already won', () => {
        const state = createState({
            winner: 'p1',
            activeModal: {
                type: 'PEEK',
                data: {
                    cards: [],
                    initiator: 'p1',
                },
            },
        });

        expect(getActionRejectionReason(state, { type: 'CLOSE_MODAL' })).toBeNull();
    });

    it('rejects bad gem selections and blocked 3-gem pickups', () => {
        const state = createState();
        placeGem(state, 0, 0);
        placeGem(state, 0, 1);
        placeGem(state, 0, 2);
        state.playerBuffs.p1 = {
            ...BUFF_NONE,
            effects: { passive: { noTake3: true } },
        } as typeof BUFF_NONE;

        expect(
            getActionRejectionReason(state, {
                type: 'TAKE_GEMS',
                payload: {
                    coords: [
                        { r: 0, c: 0 },
                        { r: 0, c: 2 },
                    ],
                },
            })
        ).toBe('Gap detected.');
        expect(
            getActionRejectionReason(state, {
                type: 'TAKE_GEMS',
                payload: {
                    coords: [
                        { r: 0, c: 0 },
                        { r: 0, c: 1 },
                        { r: 0, c: 2 },
                    ],
                },
            })
        ).toBe('The active buff blocks taking three gems.');
    });

    it('rejects empty, oversized, out-of-bounds, and unavailable gem selections', () => {
        const state = createState();
        placeGem(state, 0, 0);
        state.board[0][1] = { type: GEM_TYPES.GOLD, uid: 'gold-cell' };

        expect(
            getActionRejectionReason(state, {
                type: 'TAKE_GEMS',
                payload: { coords: [] },
            })
        ).toBe('Gem selection must contain between one and three coordinates.');
        expect(
            getActionRejectionReason(state, {
                type: 'TAKE_GEMS',
                payload: {
                    coords: [
                        { r: 0, c: 0 },
                        { r: 0, c: 1 },
                        { r: 0, c: 2 },
                        { r: 0, c: 3 },
                    ],
                },
            })
        ).toBe('Gem selection must contain between one and three coordinates.');
        expect(
            getActionRejectionReason(state, {
                type: 'TAKE_GEMS',
                payload: { coords: [{ r: -1, c: 0 }] },
            })
        ).toBe('Gem selection contains an out-of-bounds coordinate.');
        expect(
            getActionRejectionReason(state, {
                type: 'TAKE_GEMS',
                payload: {
                    coords: [
                        { r: 0, c: 0 },
                        { r: 0, c: 1 },
                    ],
                },
            })
        ).toBe('Gem selection includes an empty or gold cell.');
    });

    it('covers bonus, discard, steal, and privilege guards', () => {
        const bonusState = createState({ phase: 'BONUS_ACTION' });
        placeGem(bonusState, 0, 0);
        bonusState.bonusGemTarget = GEM_TYPES.BLUE;
        expect(
            getActionRejectionReason(bonusState, {
                type: 'TAKE_BONUS_GEM',
                payload: { r: 5, c: 5 },
            })
        ).toBe('Bonus gem coordinate is out of bounds.');
        expect(
            getActionRejectionReason(bonusState, {
                type: 'TAKE_BONUS_GEM',
                payload: { r: 0, c: 0 },
            })
        ).toBe('Selected bonus gem does not match the required color.');
        bonusState.board[0][0] = { type: GEM_TYPES.EMPTY, uid: 'empty-bonus' };
        expect(
            getActionRejectionReason(bonusState, {
                type: 'TAKE_BONUS_GEM',
                payload: { r: 0, c: 0 },
            })
        ).toBe('Selected bonus gem is not available.');

        const discardState = createState({ phase: 'DISCARD_EXCESS_GEMS' });
        expect(
            getActionRejectionReason(discardState, {
                type: 'DISCARD_GEM',
                payload: 'red',
            })
        ).toBe('The active player does not own that gem.');

        const stealState = createState({
            phase: 'STEAL_ACTION',
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
            },
        });
        expect(
            getActionRejectionReason(stealState, {
                type: 'STEAL_GEM',
                payload: { gemId: 'gold' },
            })
        ).toBe('Gold cannot be stolen.');
        expect(
            getActionRejectionReason(stealState, {
                type: 'STEAL_GEM',
                payload: { gemId: 'red' },
            })
        ).toBe('The opponent does not own the requested gem.');

        const privilegeState = createState();
        expect(getActionRejectionReason(privilegeState, { type: 'ACTIVATE_PRIVILEGE' })).toBe(
            'The active player has no privilege to spend.'
        );
        privilegeState.privileges.p1 = 1;
        privilegeState.board = privilegeState.board.map((row) =>
            row.map((cell) => ({ ...cell, type: GEM_TYPES.EMPTY }))
        );
        expect(getActionRejectionReason(privilegeState, { type: 'ACTIVATE_PRIVILEGE' })).toBe(
            'There are no valid gems available for a privilege action.'
        );

        const privilegeUseState = createState({
            phase: 'PRIVILEGE_ACTION',
            extraPrivileges: { p1: 1, p2: 0 },
        });
        expect(
            getActionRejectionReason(privilegeUseState, {
                type: 'USE_PRIVILEGE',
                payload: { r: 9, c: 9 },
            })
        ).toBe('Privilege coordinate is out of bounds.');
        privilegeUseState.board[0][0] = { type: GEM_TYPES.GOLD, uid: 'gold-privilege' };
        expect(
            getActionRejectionReason(privilegeUseState, {
                type: 'USE_PRIVILEGE',
                payload: { r: 0, c: 0 },
            })
        ).toBe('Selected privilege gem is not available.');
    });

    it('covers buy, reserve, royal, peek, and modal guards', () => {
        const buyState = createState({
            phase: 'SELECT_CARD_COLOR',
            pendingBuy: {
                card: {
                    id: 'pending',
                    level: 1,
                    cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                    points: 1,
                    bonusColor: 'gold',
                },
                source: 'market',
                marketInfo: { level: 1, idx: 0 },
            },
        });
        const matchingMarketCard = {
            id: 'market-match',
            level: 1 as const,
            cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
            points: 1,
            bonusColor: 'gold' as const,
        };
        buyState.market[1][0] = matchingMarketCard;
        expect(
            getActionRejectionReason(buyState, {
                type: 'BUY_CARD',
                payload: {
                    card: matchingMarketCard,
                    source: 'market',
                    marketInfo: { level: 1, idx: 0 },
                },
            })
        ).toBe('Selected card does not match the pending bonus-color choice.');
        buyState.pendingBuy = {
            card: matchingMarketCard,
            source: 'market',
            marketInfo: { level: 1, idx: 0 },
        };
        expect(
            getActionRejectionReason(buyState, {
                type: 'BUY_CARD',
                payload: {
                    card: matchingMarketCard,
                    source: 'market',
                    marketInfo: { level: 1, idx: 0 },
                },
            })
        ).toBe('A concrete bonus color is required before buying this card.');
        expect(
            getActionRejectionReason(createState(), {
                type: 'INITIATE_BUY_JOKER',
                payload: {
                    card: { ...matchingMarketCard, bonusColor: 'blue' },
                    source: 'market',
                    marketInfo: { level: 1, idx: 0 },
                },
            })
        ).toBe('Only joker cards require bonus-color selection.');
        const jokerState = createState();
        jokerState.market[1][0] = { ...matchingMarketCard, bonusColor: 'gold' };
        expect(
            getActionRejectionReason(jokerState, {
                type: 'BUY_CARD',
                payload: {
                    card: { ...matchingMarketCard, bonusColor: 'gold' },
                    source: 'market',
                    marketInfo: { level: 1, idx: 0 },
                },
            })
        ).toBe('Joker cards must be routed through the bonus-color selection flow.');

        const reserveState = createState({
            phase: 'IDLE',
            decks: {
                1: [],
                2: [],
                3: [],
            },
            market: {
                1: [],
                2: [],
                3: [],
            },
        });
        expect(
            getActionRejectionReason(reserveState, {
                type: 'INITIATE_RESERVE',
                payload: {
                    card: {
                        id: 'market-card',
                        level: 1,
                        cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                        points: 1,
                        bonusColor: 'blue',
                    },
                    level: 1,
                    idx: 0,
                },
            })
        ).toBe('Selected reserve card does not match the market.');
        expect(
            getActionRejectionReason(reserveState, {
                type: 'INITIATE_RESERVE_DECK',
                payload: { level: 1 },
            })
        ).toBe('Selected deck is empty.');
        const cancelReserveState = createState({
            phase: 'RESERVE_WAITING_GEM',
        });
        expect(
            getActionRejectionReason(cancelReserveState, {
                type: 'CANCEL_RESERVE',
            })
        ).toBe('There is no pending reserve action to cancel.');

        const reserveGoldState = createState({
            phase: 'RESERVE_WAITING_GEM',
            pendingReserve: {
                card: matchingMarketCard,
                level: 1,
                idx: 0,
                isDeck: false,
            },
        });
        reserveGoldState.market[1][0] = matchingMarketCard;
        expect(
            getActionRejectionReason(reserveGoldState, {
                type: 'RESERVE_CARD',
                payload: {
                    card: matchingMarketCard,
                    level: 1,
                    idx: 0,
                },
            })
        ).toBe('A gold coordinate is required for this action.');
        expect(
            getActionRejectionReason(reserveGoldState, {
                type: 'RESERVE_CARD',
                payload: {
                    card: matchingMarketCard,
                    level: 1,
                    idx: 0,
                    goldCoords: { r: 9, c: 9 },
                },
            })
        ).toBe('Gold coordinate is out of bounds.');
        expect(
            getActionRejectionReason(reserveGoldState, {
                type: 'RESERVE_CARD',
                payload: {
                    card: matchingMarketCard,
                    level: 1,
                    idx: 0,
                    goldCoords: { r: 0, c: 0 },
                },
            })
        ).toBe('Selected coordinate does not contain a gold gem.');
        reserveGoldState.board[0][0] = { type: GEM_TYPES.GOLD, uid: 'reserve-gold' };
        expect(
            getActionRejectionReason(reserveGoldState, {
                type: 'RESERVE_CARD',
                payload: {
                    card: matchingMarketCard,
                    level: 1,
                    idx: 1,
                    goldCoords: { r: 0, c: 0 },
                },
            })
        ).toBe('Reserve resolution does not match the pending reserve action.');

        const discardReservedState = createState();
        expect(
            getActionRejectionReason(discardReservedState, {
                type: 'DISCARD_RESERVED',
                payload: { cardId: 'reserved-1' },
            })
        ).toBe('The active player cannot discard reserved cards.');
        discardReservedState.playerBuffs.p1 = {
            ...BUFF_NONE,
            effects: { active: 'discard_reserved' },
        } as typeof BUFF_NONE;
        expect(
            getActionRejectionReason(discardReservedState, {
                type: 'DISCARD_RESERVED',
                payload: { cardId: 'reserved-1' },
            })
        ).toBe('Selected reserved card does not exist.');

        const royalState = createState({ phase: 'SELECT_ROYAL' });
        expect(
            getActionRejectionReason(royalState, {
                type: 'SELECT_ROYAL_CARD',
                payload: { card: redRoyal },
            })
        ).toBe('Selected royal card is no longer available.');
        const peekState = createState();
        expect(
            getActionRejectionReason(peekState, { type: 'PEEK_DECK', payload: { level: 1 } })
        ).toBe('The active player does not have a deck-peek ability.');
        const blockedModalState = createState({
            winner: 'p1',
            activeModal: {
                type: 'PEEK',
                data: {
                    cards: [],
                    initiator: 'p2',
                },
            },
        });
        expect(getActionRejectionReason(blockedModalState, { type: 'CLOSE_MODAL' })).toBe(
            'The active player cannot close this modal.'
        );
        expect(getActionRejectionReason(royalState, { type: 'CLOSE_MODAL' })).toBe(
            'There is no active modal to close.'
        );
    });

    it('accepts governed happy paths for setup-time and inventory-affecting actions', () => {
        const selectBuffState = createState({
            phase: 'DRAFT_PHASE',
            draftPool: ['buff-a'],
        });
        expect(
            getActionRejectionReason(selectBuffState, {
                type: 'SELECT_BUFF',
                payload: { buffId: 'buff-a', randomColor: 'red' },
            })
        ).toBeNull();

        const replenishState = createState();
        replenishState.bag = [{ type: GEM_TYPES.BLUE, uid: 'bag-blue' }];
        expect(getActionRejectionReason(replenishState, { type: 'REPLENISH' })).toBeNull();

        const discardState = createState({ phase: 'DISCARD_EXCESS_GEMS' });
        discardState.inventories.p1.red = 1;
        expect(
            getActionRejectionReason(discardState, {
                type: 'DISCARD_GEM',
                payload: 'red',
            })
        ).toBeNull();

        const stealState = createState({ phase: 'STEAL_ACTION' });
        stealState.inventories.p2.blue = 1;
        expect(
            getActionRejectionReason(stealState, {
                type: 'STEAL_GEM',
                payload: { gemId: 'blue' },
            })
        ).toBeNull();

        const activatePrivilegeState = createState();
        activatePrivilegeState.privileges.p1 = 1;
        placeGem(activatePrivilegeState, 0, 0, GEM_TYPES.BLUE);
        expect(
            getActionRejectionReason(activatePrivilegeState, { type: 'ACTIVATE_PRIVILEGE' })
        ).toBeNull();

        const usePrivilegeState = createState({
            phase: 'PRIVILEGE_ACTION',
            extraPrivileges: { p1: 1, p2: 0 },
        });
        placeGem(usePrivilegeState, 0, 0, GEM_TYPES.RED);
        expect(
            getActionRejectionReason(usePrivilegeState, {
                type: 'USE_PRIVILEGE',
                payload: { r: 0, c: 0 },
            })
        ).toBeNull();
    });

    it('accepts governed happy paths for buy, reserve, royal, peek, and modal actions', () => {
        const card = {
            id: 'happy-card',
            level: 1 as const,
            cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
            points: 1,
            bonusColor: 'blue' as const,
        };

        const initiateBuyState = createState();
        initiateBuyState.market[1][0] = { ...card, bonusColor: 'gold' };
        expect(
            getActionRejectionReason(initiateBuyState, {
                type: 'INITIATE_BUY_JOKER',
                payload: {
                    card: { ...card, bonusColor: 'gold' },
                    source: 'market',
                    marketInfo: { level: 1, idx: 0 },
                },
            })
        ).toBeNull();

        const buyState = createState();
        buyState.market[1][0] = card;
        expect(
            getActionRejectionReason(buyState, {
                type: 'BUY_CARD',
                payload: {
                    card,
                    source: 'market',
                    marketInfo: { level: 1, idx: 0 },
                },
            })
        ).toBeNull();

        const initiateReserveState = createState();
        initiateReserveState.market[1][0] = card;
        expect(
            getActionRejectionReason(initiateReserveState, {
                type: 'INITIATE_RESERVE',
                payload: { card, level: 1, idx: 0 },
            })
        ).toBeNull();
        initiateReserveState.decks[1] = [card];
        expect(
            getActionRejectionReason(initiateReserveState, {
                type: 'INITIATE_RESERVE_DECK',
                payload: { level: 1 },
            })
        ).toBeNull();

        const reserveCardState = createState({
            phase: 'RESERVE_WAITING_GEM',
            pendingReserve: {
                card,
                level: 1,
                idx: 0,
                isDeck: false,
            },
        });
        reserveCardState.market[1][0] = card;
        reserveCardState.board[0][0] = { type: GEM_TYPES.GOLD, uid: 'reserve-gold' };
        expect(
            getActionRejectionReason(reserveCardState, {
                type: 'RESERVE_CARD',
                payload: {
                    card,
                    level: 1,
                    idx: 0,
                    goldCoords: { r: 0, c: 0 },
                },
            })
        ).toBeNull();

        const reserveDeckState = createState({
            phase: 'RESERVE_WAITING_GEM',
            pendingReserve: {
                level: 1,
                isDeck: true,
            },
        });
        reserveDeckState.decks[1] = [card];
        reserveDeckState.board[0][0] = { type: GEM_TYPES.GOLD, uid: 'deck-gold' };
        expect(
            getActionRejectionReason(reserveDeckState, {
                type: 'RESERVE_DECK',
                payload: {
                    level: 1,
                    goldCoords: { r: 0, c: 0 },
                },
            })
        ).toBeNull();

        const discardReservedState = createState();
        discardReservedState.playerBuffs.p1 = {
            ...BUFF_NONE,
            effects: { active: 'discard_reserved' },
        } as typeof BUFF_NONE;
        discardReservedState.playerReserved.p1 = [card];
        expect(
            getActionRejectionReason(discardReservedState, {
                type: 'DISCARD_RESERVED',
                payload: { cardId: card.id },
            })
        ).toBeNull();

        const royalState = createState({ phase: 'SELECT_ROYAL' });
        royalState.royalDeck = [redRoyal as never];
        expect(
            getActionRejectionReason(royalState, {
                type: 'SELECT_ROYAL_CARD',
                payload: { card: redRoyal },
            })
        ).toBeNull();

        const peekState = createState();
        peekState.playerBuffs.p1 = {
            ...BUFF_NONE,
            effects: { active: 'peek_deck' },
        } as typeof BUFF_NONE;
        expect(
            getActionRejectionReason(peekState, {
                type: 'PEEK_DECK',
                payload: { level: 1 },
            })
        ).toBeNull();

        const modalState = createState({
            activeModal: {
                type: 'PEEK',
                data: {
                    cards: [],
                    initiator: 'p1',
                },
            },
        });
        expect(getActionRejectionReason(modalState, { type: 'CLOSE_MODAL' })).toBeNull();
    });
});
