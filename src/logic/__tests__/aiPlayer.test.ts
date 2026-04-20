import { describe, expect, it, vi } from 'vitest';
import { computeAiAction } from '../ai/aiPlayer';
import { createMockState } from './testHelpers';

describe('AI player phase routing', () => {
    it('uses the draft surface policy to select a buff during draft selection', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        const action = computeAiAction(
            createMockState({
                phase: 'DRAFT_PHASE',
                turn: 'p2',
                draftPool: ['privilege_favor'],
                p2DraftPool: ['privilege_favor'],
            })
        );

        expect(action).toMatchObject({
            type: 'SELECT_BUFF',
            payload: { buffId: 'privilege_favor' },
        });

        vi.restoreAllMocks();
    });

    it('uses the FSM steal surface policy before choosing a gem to steal', () => {
        const action = computeAiAction(
            createMockState({
                phase: 'STEAL_ACTION',
                turn: 'p1',
                inventories: {
                    p1: {
                        blue: 0,
                        white: 0,
                        green: 0,
                        black: 0,
                        red: 0,
                        gold: 0,
                        pearl: 0,
                    },
                    p2: {
                        blue: 0,
                        white: 0,
                        green: 0,
                        black: 0,
                        red: 2,
                        gold: 0,
                        pearl: 0,
                    },
                },
            })
        );

        expect(action).toEqual({
            type: 'STEAL_GEM',
            payload: { gemId: 'red' },
        });
    });
});
