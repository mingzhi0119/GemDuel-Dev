import { describe, expect, it } from 'vitest';
import { INITIAL_STATE_SKELETON } from '../initialState';
import {
    ALL_PHASES,
    FSM_STATE_REQUIREMENTS,
    createFsmCommandMatrixRows,
    createFsmPhaseMatrixRows,
    getCommandPhaseRejectionReason,
    getFsmPhaseSurfacePolicy,
    getStateIntegrityError,
    getTransitionIntegrityError,
} from '../fsmPolicy';
import type { GameAction, GamePhase, GameState } from '../../types';

const cloneState = (): GameState => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

type MatrixAction = Exclude<GameAction, { type: 'INIT' | 'INIT_DRAFT' | 'FORCE_SYNC' | 'FLATTEN' }>;

const buildAction = (type: MatrixAction['type']): MatrixAction => {
    switch (type) {
        case 'SELECT_BUFF':
            return { type, payload: { buffId: 'privilege_favor', randomColor: 'red' } };
        case 'TAKE_GEMS':
            return { type, payload: { coords: [{ r: 0, c: 0 }] } };
        case 'REPLENISH':
            return { type, payload: undefined };
        case 'TAKE_BONUS_GEM':
            return { type, payload: { r: 0, c: 0 } };
        case 'DISCARD_GEM':
            return { type, payload: 'red' };
        case 'STEAL_GEM':
            return { type, payload: { gemId: 'red' } };
        case 'INITIATE_BUY_JOKER':
            return {
                type,
                payload: {
                    card: {
                        id: 'joker-card',
                        level: 1,
                        cost: {
                            blue: 0,
                            white: 0,
                            green: 0,
                            black: 0,
                            red: 0,
                            pearl: 0,
                            gold: 0,
                        },
                        points: 1,
                        bonusColor: 'gold',
                    },
                    source: 'market',
                    marketInfo: { level: 1, idx: 0 },
                },
            };
        case 'BUY_CARD':
            return {
                type,
                payload: {
                    card: {
                        id: 'market-card',
                        level: 1,
                        cost: {
                            blue: 0,
                            white: 0,
                            green: 0,
                            black: 0,
                            red: 0,
                            pearl: 0,
                            gold: 0,
                        },
                        points: 1,
                        bonusColor: 'blue',
                    },
                    source: 'market',
                    marketInfo: { level: 1, idx: 0 },
                },
            };
        case 'INITIATE_RESERVE':
            return {
                type,
                payload: {
                    card: {
                        id: 'reserve-card',
                        level: 1,
                        cost: {
                            blue: 0,
                            white: 0,
                            green: 0,
                            black: 0,
                            red: 0,
                            pearl: 0,
                            gold: 0,
                        },
                        points: 0,
                        bonusColor: 'blue',
                    },
                    level: 1,
                    idx: 0,
                },
            };
        case 'INITIATE_RESERVE_DECK':
            return { type, payload: { level: 1 } };
        case 'CANCEL_RESERVE':
            return { type };
        case 'RESERVE_CARD':
            return {
                type,
                payload: {
                    card: {
                        id: 'reserve-card',
                        level: 1,
                        cost: {
                            blue: 0,
                            white: 0,
                            green: 0,
                            black: 0,
                            red: 0,
                            pearl: 0,
                            gold: 0,
                        },
                        points: 0,
                        bonusColor: 'blue',
                    },
                    level: 1,
                    idx: 0,
                    goldCoords: { r: 0, c: 0 },
                },
            };
        case 'RESERVE_DECK':
            return { type, payload: { level: 1, goldCoords: { r: 0, c: 0 } } };
        case 'DISCARD_RESERVED':
            return { type, payload: { cardId: 'reserve-card' } };
        case 'ACTIVATE_PRIVILEGE':
        case 'CANCEL_PRIVILEGE':
        case 'FORCE_ROYAL_SELECTION':
        case 'UNDO':
        case 'REDO':
        case 'CLOSE_MODAL':
            return { type };
        case 'USE_PRIVILEGE':
            return { type, payload: { r: 0, c: 0 } };
        case 'SELECT_ROYAL_CARD':
            return {
                type,
                payload: {
                    card: {
                        id: 'royal-card',
                        points: 3,
                        bonusColor: 'gold',
                        ability: 'none',
                        label: 'The Queen',
                    },
                },
            };
        case 'DEBUG_ADD_CROWNS':
        case 'DEBUG_ADD_POINTS':
        case 'DEBUG_ADD_PRIVILEGE':
            return { type, payload: 'p1' };
        case 'PEEK_DECK':
            return { type, payload: { level: 1 } };
        case 'REROLL_DRAFT_POOL':
            return { type, payload: { level: 1 } };
    }
};

describe('FSM policy matrix', () => {
    it('uses a single policy source for phase-sensitive commands', () => {
        for (const row of createFsmCommandMatrixRows()) {
            if (row.allowedFrom.length === 0) {
                continue;
            }

            const action = buildAction(row.actionType as MatrixAction['type']);
            const allowedPhase = row.allowedFrom[0];
            const rejectedPhase = ALL_PHASES.find((phase) => !row.allowedFrom.includes(phase));
            const allowedState = cloneState();
            allowedState.phase = allowedPhase;

            expect(getCommandPhaseRejectionReason(allowedState, action)).toBeNull();

            if (rejectedPhase) {
                const rejectedState = cloneState();
                rejectedState.phase = rejectedPhase;
                expect(getCommandPhaseRejectionReason(rejectedState, action)).toContain(
                    row.actionType
                );
            }
        }
    });

    it('enumerates phase-specific state requirements as explicit invariants', () => {
        for (const requirement of FSM_STATE_REQUIREMENTS) {
            const state = cloneState();
            state.phase = requirement.phase;

            switch (requirement.description) {
                case 'SELECT_CARD_COLOR requires a pendingBuy snapshot.':
                    state.pendingBuy = null;
                    break;
                case 'RESERVE_WAITING_GEM requires a pendingReserve snapshot.':
                    state.pendingReserve = null;
                    break;
                case 'BONUS_ACTION requires a bonusGemTarget.':
                    state.bonusGemTarget = null;
                    break;
                case 'SELECT_ROYAL requires at least one royal card.':
                    state.royalDeck = [];
                    state.nextPlayerAfterRoyal = 'p1';
                    break;
                case 'SELECT_ROYAL requires a nextPlayerAfterRoyal pointer.':
                    state.royalDeck = [
                        {
                            id: 'royal-card',
                            points: 3,
                            bonusColor: 'gold',
                            ability: 'none',
                            label: 'The Queen',
                        },
                    ];
                    state.nextPlayerAfterRoyal = null;
                    break;
            }

            expect(getStateIntegrityError(state)).toBe(requirement.description);
        }
    });

    it('rejects post-action phases that fall outside the transition matrix', () => {
        for (const row of createFsmCommandMatrixRows()) {
            if (row.allowedTo.length === 0 || row.allowedFrom.length === 0) {
                continue;
            }

            const actionType = row.actionType as Exclude<
                GameAction['type'],
                'INIT' | 'INIT_DRAFT' | 'FORCE_SYNC' | 'FLATTEN'
            >;
            const action = buildAction(actionType);
            const previousState = cloneState();
            previousState.phase = (row.allowedFrom[0] ?? 'IDLE') as GamePhase;

            const invalidNextPhase = ALL_PHASES.find((phase) => !row.allowedTo.includes(phase));
            if (!invalidNextPhase) {
                continue;
            }

            const nextState = cloneState();
            nextState.phase = invalidNextPhase;

            expect(getTransitionIntegrityError(previousState, action, nextState)).toContain(
                'unexpected'
            );
        }
    });

    it('derives phase ownership rows from the centralized FSM matrix', () => {
        for (const row of createFsmPhaseMatrixRows()) {
            const surfacePolicy = getFsmPhaseSurfacePolicy(row.phase);

            expect(row.surfacePolicy).toEqual(surfacePolicy);
            expect(row.stateRequirements).toEqual(
                FSM_STATE_REQUIREMENTS.filter((requirement) => requirement.phase === row.phase).map(
                    (requirement) => requirement.description
                )
            );

            if (surfacePolicy.boardInteractionMode === 'selection') {
                expect(row.allowedActions).toEqual(
                    expect.arrayContaining(['TAKE_GEMS', 'REPLENISH'])
                );
            }

            if (surfacePolicy.boardInteractionMode === 'bonus-target') {
                expect(row.allowedActions).toContain('TAKE_BONUS_GEM');
            }

            if (surfacePolicy.boardInteractionMode === 'reserve-gold') {
                expect(row.allowedActions).toEqual(
                    expect.arrayContaining(['RESERVE_CARD', 'RESERVE_DECK', 'CANCEL_RESERVE'])
                );
            }

            if (surfacePolicy.boardInteractionMode === 'privilege-target') {
                expect(row.allowedActions).toEqual(
                    expect.arrayContaining(['USE_PRIVILEGE', 'CANCEL_PRIVILEGE'])
                );
            }

            if (surfacePolicy.selfGemRailMode === 'discard-self') {
                expect(row.allowedActions).toContain('DISCARD_GEM');
            }

            if (surfacePolicy.opponentGemRailMode === 'steal-target') {
                expect(row.allowedActions).toContain('STEAL_GEM');
            }

            if (surfacePolicy.marketInteraction) {
                expect(row.allowedActions).toEqual(
                    expect.arrayContaining([
                        'INITIATE_BUY_JOKER',
                        'INITIATE_RESERVE',
                        'INITIATE_RESERVE_DECK',
                        'PEEK_DECK',
                    ])
                );
            }

            if (surfacePolicy.draftSelection) {
                expect(row.allowedActions).toEqual(
                    expect.arrayContaining(['SELECT_BUFF', 'REROLL_DRAFT_POOL'])
                );
            }

            if (surfacePolicy.royalSelection) {
                expect(row.allowedActions).toContain('SELECT_ROYAL_CARD');
            }

            if (surfacePolicy.bonusColorSelection) {
                expect(row.allowedActions).toContain('BUY_CARD');
            }
        }
    });
});
