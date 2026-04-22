import { describe, expect, it } from 'vitest';
import { INITIAL_STATE_SKELETON } from '../initialState';
import { createGameSetupPayload } from '../gameSetup';
import {
    createGuestIntentRequestId,
    resolveNetworkDispatchPlan,
    shouldSendHostStateSync,
} from '../networkDispatchPolicy';
import type { GameState } from '../../types';

const cloneState = (): GameState => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

const createOnlineState = (overrides: Partial<GameState> = {}): GameState => {
    const isHost = overrides.isHost ?? false;
    const hostPlayer = overrides.hostPlayer ?? 'p1';
    const localPlayer =
        overrides.localPlayer ?? (isHost ? hostPlayer : hostPlayer === 'p1' ? 'p2' : 'p1');

    return {
        ...cloneState(),
        mode: 'ONLINE_MULTIPLAYER',
        isHost,
        hostPlayer,
        localPlayer,
        turn: overrides.turn ?? localPlayer,
        ...overrides,
    };
};

describe('networkDispatchPolicy', () => {
    it('builds deterministic guest request ids from the clock and counter', () => {
        expect(
            createGuestIntentRequestId({
                now: 12345,
                requestCounter: 7,
            })
        ).toBe('guest-12345-7');
    });

    it('routes guest protocol actions into pending guest intents', () => {
        const plan = resolveNetworkDispatchPlan(
            createOnlineState(),
            { type: 'CLOSE_MODAL' },
            false,
            {
                nextGuestRequestId: () => 'guest-req-1',
            }
        );

        expect(plan).toEqual({
            pendingGuestIntent: {
                requestId: 'guest-req-1',
                command: { kind: 'CLOSE_MODAL' },
            },
            shouldSkipNextHostSync: false,
        });
    });

    it('blocks non-protocol guest actions from leaving the renderer', () => {
        const plan = resolveNetworkDispatchPlan(createOnlineState(), { type: 'UNDO' }, false);

        expect(plan).toEqual({
            blockedGuestIntentReason: 'NON_PROTOCOL_ACTION',
            shouldSkipNextHostSync: false,
        });
    });

    it('blocks guest protocol actions when it is not the guest turn', () => {
        const plan = resolveNetworkDispatchPlan(
            createOnlineState({
                turn: 'p1',
            }),
            { type: 'CLOSE_MODAL' },
            false,
            {
                nextGuestRequestId: () => 'guest-req-2',
            }
        );

        expect(plan).toEqual({
            blockedGuestIntentReason: 'NOT_GUEST_TURN',
            shouldSkipNextHostSync: false,
        });
    });

    it('lets hosts apply actions locally and broadcast bootstrap syncs', () => {
        const initAction = {
            type: 'INIT' as const,
            payload: createGameSetupPayload('ONLINE_MULTIPLAYER', {
                useBuffs: false,
                isHost: true,
            }),
        };

        const plan = resolveNetworkDispatchPlan(
            createOnlineState({
                isHost: true,
                turn: 'p1',
            }),
            initAction,
            false,
            {
                computeChecksum: () => 'bootstrap-checksum',
            }
        );

        expect(plan).toEqual({
            localAction: initAction,
            bootstrapSync: {
                command: {
                    kind: 'INIT',
                    setup: initAction.payload,
                },
                checksum: 'bootstrap-checksum',
            },
            shouldSkipNextHostSync: true,
        });
    });

    it('keeps local bootstrap sync active when offline setup should connect peers', () => {
        const initAction = {
            type: 'INIT' as const,
            payload: createGameSetupPayload('LOCAL_PVP', {
                useBuffs: false,
                isHost: true,
            }),
        };

        const plan = resolveNetworkDispatchPlan(cloneState(), initAction, true, {
            computeChecksum: () => 'bootstrap-checksum',
        });

        expect(plan).toEqual({
            localAction: initAction,
            bootstrapSync: {
                command: {
                    kind: 'INIT',
                    setup: initAction.payload,
                },
                checksum: 'bootstrap-checksum',
            },
            shouldSkipNextHostSync: true,
        });
    });

    it('only emits authoritative turn syncs for hosts when the skip flag is clear', () => {
        expect(shouldSendHostStateSync(createOnlineState({ isHost: true }), false)).toBe(true);
        expect(shouldSendHostStateSync(createOnlineState({ isHost: true }), true)).toBe(false);
        expect(shouldSendHostStateSync(createOnlineState({ isHost: false }), false)).toBe(false);
    });
});
