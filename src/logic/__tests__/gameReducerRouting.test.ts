import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameAction, GameState } from '../../types';
import { createGameSetupPayload } from '../gameSetup';
import { createMockState } from './testHelpers';

const reducerControls = vi.hoisted(() => ({
    commandValidation: { valid: true } as { valid: boolean; reason?: string },
    snapshotValidation: { valid: true } as { valid: boolean; reason?: string },
    postValidation: { valid: true } as { valid: boolean; reason?: string },
    bootstrapState: null as GameState | null,
}));

const handlerSpies = vi.hoisted(() => ({
    handleTakeGems: vi.fn(),
    handleReplenish: vi.fn(),
    handleTakeBonusGem: vi.fn(),
    handleDiscardGem: vi.fn(),
    handleStealGem: vi.fn(),
    handleBuyCard: vi.fn(),
    handleInitiateBuyJoker: vi.fn(),
    handleInitiateReserve: vi.fn(),
    handleInitiateReserveDeck: vi.fn(),
    handleCancelReserve: vi.fn(),
    handleReserveCard: vi.fn(),
    handleReserveDeck: vi.fn(),
    handleDiscardReserved: vi.fn(),
    handleSelectRoyalCard: vi.fn(),
    handleForceRoyalSelection: vi.fn(),
    handleUsePrivilege: vi.fn(),
    handleActivatePrivilege: vi.fn(),
    handleCancelPrivilege: vi.fn(),
    handleSelectBuff: vi.fn(),
    handleInit: vi.fn(() => reducerControls.bootstrapState),
    handleInitDraft: vi.fn(() => reducerControls.bootstrapState),
    handleRerollBuffs: vi.fn(),
    handleDebugAddCrowns: vi.fn(),
    handleDebugAddPoints: vi.fn(),
    handleDebugAddPrivilege: vi.fn(),
    handlePeekDeck: vi.fn(),
    handleCloseModal: vi.fn(),
}));

vi.mock('../commandGate', () => ({
    validateCommand: vi.fn(() => reducerControls.commandValidation),
    validatePostActionState: vi.fn(() => reducerControls.postValidation),
    validateStateSnapshot: vi.fn(() => reducerControls.snapshotValidation),
}));

vi.mock('../actions/boardActions', () => ({
    handleTakeGems: handlerSpies.handleTakeGems,
    handleReplenish: handlerSpies.handleReplenish,
    handleTakeBonusGem: handlerSpies.handleTakeBonusGem,
    handleDiscardGem: handlerSpies.handleDiscardGem,
    handleStealGem: handlerSpies.handleStealGem,
}));

vi.mock('../actions/marketActions', () => ({
    handleBuyCard: handlerSpies.handleBuyCard,
    handleInitiateBuyJoker: handlerSpies.handleInitiateBuyJoker,
    handleInitiateReserve: handlerSpies.handleInitiateReserve,
    handleInitiateReserveDeck: handlerSpies.handleInitiateReserveDeck,
    handleCancelReserve: handlerSpies.handleCancelReserve,
    handleReserveCard: handlerSpies.handleReserveCard,
    handleReserveDeck: handlerSpies.handleReserveDeck,
    handleDiscardReserved: handlerSpies.handleDiscardReserved,
}));

vi.mock('../actions/royalActions', () => ({
    handleSelectRoyalCard: handlerSpies.handleSelectRoyalCard,
    handleForceRoyalSelection: handlerSpies.handleForceRoyalSelection,
}));

vi.mock('../actions/privilegeActions', () => ({
    handleUsePrivilege: handlerSpies.handleUsePrivilege,
    handleActivatePrivilege: handlerSpies.handleActivatePrivilege,
    handleCancelPrivilege: handlerSpies.handleCancelPrivilege,
}));

vi.mock('../actions/buffActions', () => ({
    handleSelectBuff: handlerSpies.handleSelectBuff,
    handleInit: handlerSpies.handleInit,
    handleInitDraft: handlerSpies.handleInitDraft,
    handleRerollBuffs: handlerSpies.handleRerollBuffs,
}));

vi.mock('../actions/miscActions', () => ({
    handleDebugAddCrowns: handlerSpies.handleDebugAddCrowns,
    handleDebugAddPoints: handlerSpies.handleDebugAddPoints,
    handleDebugAddPrivilege: handlerSpies.handleDebugAddPrivilege,
    handlePeekDeck: handlerSpies.handlePeekDeck,
    handleCloseModal: handlerSpies.handleCloseModal,
}));

import { applyAction } from '../gameReducer';

const createState = (overrides: Partial<GameState> = {}) =>
    createMockState({
        mode: 'LOCAL_PVP',
        turn: 'p1',
        phase: 'IDLE',
        lastFeedback: {
            uid: 'feedback-1',
            items: [{ player: 'p1', type: 'gold', diff: 1 }],
        },
        toastMessage: 'stale toast',
        ...overrides,
    });

const setupPayload = createGameSetupPayload('LOCAL_PVP');
const draftPayload = {
    ...createGameSetupPayload('LOCAL_PVP'),
    draftPool: ['privilege_favor', 'deep_pockets', 'backup_supply'],
    buffLevel: 1 as const,
};

describe('gameReducer phase 3 routing', () => {
    beforeEach(() => {
        reducerControls.commandValidation = { valid: true };
        reducerControls.snapshotValidation = { valid: true };
        reducerControls.postValidation = { valid: true };
        reducerControls.bootstrapState = createState();

        for (const spy of Object.values(handlerSpies)) {
            spy.mockClear();
        }
    });

    it('rejects invalid commands before any reducer routing executes', () => {
        const state = createState();
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        reducerControls.commandValidation = {
            valid: false,
            reason: 'Command blocked by policy.',
        };

        const nextState = applyAction(state, {
            type: 'TAKE_GEMS',
            payload: { coords: [{ r: 0, c: 0 }] },
        });

        expect(nextState).toBe(state);
        expect(handlerSpies.handleTakeGems).not.toHaveBeenCalled();
        expect(warnSpy).toHaveBeenCalledWith(
            '[COMMAND_GATE] Rejected action TAKE_GEMS: Command blocked by policy.'
        );
        warnSpy.mockRestore();
    });

    it('accepts INIT and INIT_DRAFT only when bootstrap snapshots pass validation', () => {
        const state = createState({ turn: 'p2' });
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        reducerControls.bootstrapState = createState({ phase: 'DRAFT_PHASE' });
        expect(applyAction(state, { type: 'INIT', payload: setupPayload })).toBe(
            reducerControls.bootstrapState
        );
        expect(applyAction(state, { type: 'INIT_DRAFT', payload: draftPayload })).toBe(
            reducerControls.bootstrapState
        );

        reducerControls.snapshotValidation = {
            valid: false,
            reason: 'Broken snapshot',
        };
        reducerControls.bootstrapState = createState({ phase: 'SELECT_ROYAL' });

        expect(applyAction(state, { type: 'INIT', payload: setupPayload })).toBe(state);
        expect(warnSpy).toHaveBeenCalledWith(
            '[FSM] Rejected bootstrap action INIT: Broken snapshot'
        );
        warnSpy.mockRestore();
    });

    it('passes FORCE_SYNC and FLATTEN through as atomic state replacements', () => {
        const forcedState = createState({ phase: 'STEAL_ACTION', turn: 'p2' });
        const flattenedState = createState({ phase: 'BONUS_ACTION', turn: 'p2' });

        expect(applyAction(createState(), { type: 'FORCE_SYNC', payload: forcedState })).toBe(
            forcedState
        );
        expect(applyAction(createState(), { type: 'FLATTEN', payload: flattenedState })).toBe(
            flattenedState
        );
    });

    it('returns null for mutation actions when no initialized state exists', () => {
        expect(
            applyAction(null, {
                type: 'BUY_CARD',
                payload: {
                    card: {
                        id: 'null-state-card',
                        level: 1,
                        cost: {
                            blue: 0,
                            white: 0,
                            green: 0,
                            black: 0,
                            red: 1,
                            pearl: 0,
                            gold: 0,
                        },
                        points: 1,
                    },
                    source: 'market',
                },
            })
        ).toBeNull();
    });

    it('routes every action branch to the correct handler and clears transient feedback', () => {
        const routingCases: Array<{ action: GameAction; spy: keyof typeof handlerSpies }> = [
            {
                action: { type: 'SELECT_BUFF', payload: { buffId: 'privilege_favor' } },
                spy: 'handleSelectBuff',
            },
            {
                action: { type: 'TAKE_GEMS', payload: { coords: [{ r: 0, c: 0 }] } },
                spy: 'handleTakeGems',
            },
            { action: { type: 'REPLENISH' }, spy: 'handleReplenish' },
            {
                action: { type: 'TAKE_BONUS_GEM', payload: { r: 0, c: 0 } },
                spy: 'handleTakeBonusGem',
            },
            { action: { type: 'DISCARD_GEM', payload: 'red' }, spy: 'handleDiscardGem' },
            { action: { type: 'STEAL_GEM', payload: { gemId: 'blue' } }, spy: 'handleStealGem' },
            {
                action: {
                    type: 'INITIATE_BUY_JOKER',
                    payload: {
                        card: {
                            id: 'joker',
                            level: 2,
                            cost: {
                                blue: 1,
                                white: 0,
                                green: 0,
                                black: 0,
                                red: 0,
                                pearl: 0,
                                gold: 0,
                            },
                            points: 1,
                        },
                        source: 'market',
                    },
                },
                spy: 'handleInitiateBuyJoker',
            },
            {
                action: {
                    type: 'BUY_CARD',
                    payload: {
                        card: {
                            id: 'buy-card',
                            level: 1,
                            cost: {
                                blue: 0,
                                white: 0,
                                green: 1,
                                black: 0,
                                red: 0,
                                pearl: 0,
                                gold: 0,
                            },
                            points: 1,
                            bonusColor: 'green',
                        },
                        source: 'market',
                    },
                },
                spy: 'handleBuyCard',
            },
            {
                action: {
                    type: 'INITIATE_RESERVE',
                    payload: {
                        card: {
                            id: 'reserve',
                            level: 1,
                            cost: {
                                blue: 0,
                                white: 1,
                                green: 0,
                                black: 0,
                                red: 0,
                                pearl: 0,
                                gold: 0,
                            },
                            points: 0,
                            bonusColor: 'white',
                        },
                        level: 1,
                        idx: 0,
                    },
                },
                spy: 'handleInitiateReserve',
            },
            {
                action: { type: 'INITIATE_RESERVE_DECK', payload: { level: 3 } },
                spy: 'handleInitiateReserveDeck',
            },
            { action: { type: 'CANCEL_RESERVE' }, spy: 'handleCancelReserve' },
            {
                action: {
                    type: 'RESERVE_CARD',
                    payload: {
                        card: {
                            id: 'reserve-card',
                            level: 2,
                            cost: {
                                blue: 0,
                                white: 0,
                                green: 0,
                                black: 1,
                                red: 0,
                                pearl: 0,
                                gold: 0,
                            },
                            points: 2,
                            bonusColor: 'black',
                        },
                        level: 2,
                        idx: 1,
                    },
                },
                spy: 'handleReserveCard',
            },
            { action: { type: 'RESERVE_DECK', payload: { level: 2 } }, spy: 'handleReserveDeck' },
            {
                action: { type: 'DISCARD_RESERVED', payload: { cardId: 'discard-1' } },
                spy: 'handleDiscardReserved',
            },
            { action: { type: 'ACTIVATE_PRIVILEGE' }, spy: 'handleActivatePrivilege' },
            {
                action: { type: 'USE_PRIVILEGE', payload: { r: 1, c: 1 } },
                spy: 'handleUsePrivilege',
            },
            { action: { type: 'CANCEL_PRIVILEGE' }, spy: 'handleCancelPrivilege' },
            { action: { type: 'FORCE_ROYAL_SELECTION' }, spy: 'handleForceRoyalSelection' },
            {
                action: {
                    type: 'SELECT_ROYAL_CARD',
                    payload: {
                        card: {
                            id: 'royal',
                            points: 2,
                            bonusColor: 'gold',
                            ability: 'scroll',
                            label: 'The Judge',
                        },
                    },
                },
                spy: 'handleSelectRoyalCard',
            },
            { action: { type: 'DEBUG_ADD_CROWNS', payload: 'p2' }, spy: 'handleDebugAddCrowns' },
            { action: { type: 'DEBUG_ADD_POINTS', payload: 'p2' }, spy: 'handleDebugAddPoints' },
            {
                action: { type: 'DEBUG_ADD_PRIVILEGE', payload: 'p2' },
                spy: 'handleDebugAddPrivilege',
            },
            {
                action: { type: 'DEBUG_REROLL_BUFFS', payload: { level: 3 } },
                spy: 'handleRerollBuffs',
            },
            { action: { type: 'PEEK_DECK', payload: { level: 1 } }, spy: 'handlePeekDeck' },
            { action: { type: 'CLOSE_MODAL' }, spy: 'handleCloseModal' },
        ];

        for (const { action, spy } of routingCases) {
            const nextState = applyAction(createState(), action);

            expect(handlerSpies[spy]).toHaveBeenCalledTimes(1);
            expect(nextState).not.toBeNull();
            expect(nextState?.lastFeedback).toBeNull();
            expect(nextState?.toastMessage).toBeNull();

            handlerSpies[spy].mockClear();
        }
    });

    it('blocks undo and redo in online mode but allows offline no-op transitions', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const onlineState = createState({ mode: 'ONLINE_MULTIPLAYER' });
        const offlineState = createState({ mode: 'LOCAL_PVP' });

        const onlineNext = applyAction(onlineState, { type: 'UNDO' });
        const offlineNext = applyAction(offlineState, { type: 'REDO' });

        expect(onlineNext?.mode).toBe('ONLINE_MULTIPLAYER');
        expect(offlineNext?.mode).toBe('LOCAL_PVP');
        expect(warnSpy).toHaveBeenCalledWith('Undo/Redo blocked in Online Mode');
        warnSpy.mockRestore();
    });

    it('rolls back reducer output when post-action validation fails', () => {
        const state = createState();
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        reducerControls.postValidation = {
            valid: false,
            reason: 'Transition integrity failed',
        };

        const nextState = applyAction(state, {
            type: 'DEBUG_ADD_POINTS',
            payload: 'p1',
        });

        expect(nextState).toBe(state);
        expect(warnSpy).toHaveBeenCalledWith(
            '[FSM] Rolled back action DEBUG_ADD_POINTS: Transition integrity failed'
        );
        warnSpy.mockRestore();
    });

    it('falls back safely for unknown runtime actions', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const nextState = applyAction(createState(), {
            type: 'UNKNOWN_RUNTIME_ACTION',
        } as unknown as GameAction);

        expect(nextState?.lastFeedback).toBeNull();
        expect(nextState?.toastMessage).toBeNull();
        expect(warnSpy).toHaveBeenCalledWith('Unknown action type:', 'UNKNOWN_RUNTIME_ACTION');
        warnSpy.mockRestore();
    });
});
