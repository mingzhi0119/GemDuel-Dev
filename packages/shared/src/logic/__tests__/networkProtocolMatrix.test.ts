import { describe, expect, it } from 'vitest';
import { createGameSetupPayload } from '../gameSetup';
import {
    actionToBootstrapCommand,
    actionToGuestIntentCommand,
    bootstrapCommandToAction,
    getInboundMessageCheck,
    guestIntentToAction,
} from '../networkProtocol';
import { createMockState } from './testHelpers';
import type { GameAction } from '../../types';
import type { GuestIntentCommand, NetworkMessage } from '../../types/network';
import { NETWORK_PROTOCOL_VERSION } from '../../types/network';

const setupPayload = createGameSetupPayload('ONLINE_MULTIPLAYER');

const draftPayload = {
    ...createGameSetupPayload('ONLINE_MULTIPLAYER'),
    draftPool: ['privilege_favor', 'deep_pockets', 'backup_supply'],
    buffLevel: 1 as const,
};

const guestIntentMatrix: Array<{ action: GameAction; command: GuestIntentCommand }> = [
    {
        action: { type: 'SELECT_BUFF', payload: { buffId: 'privilege_favor' } },
        command: { kind: 'SELECT_BUFF', payload: { buffId: 'privilege_favor' } },
    },
    {
        action: { type: 'TAKE_GEMS', payload: { coords: [{ r: 0, c: 0 }] } },
        command: { kind: 'TAKE_GEMS', payload: { coords: [{ r: 0, c: 0 }] } },
    },
    {
        action: { type: 'REPLENISH' },
        command: { kind: 'REPLENISH' },
    },
    {
        action: {
            type: 'REPLENISH',
            payload: { randoms: { extortionColor: 'blue', expansionColor: 'red' } },
        },
        command: {
            kind: 'REPLENISH',
            payload: { randoms: { extortionColor: 'blue', expansionColor: 'red' } },
        },
    },
    {
        action: { type: 'TAKE_BONUS_GEM', payload: { r: 1, c: 2 } },
        command: { kind: 'TAKE_BONUS_GEM', payload: { r: 1, c: 2 } },
    },
    {
        action: { type: 'DISCARD_GEM', payload: 'red' },
        command: { kind: 'DISCARD_GEM', payload: 'red' },
    },
    {
        action: { type: 'STEAL_GEM', payload: { gemId: 'blue' } },
        command: { kind: 'STEAL_GEM', payload: { gemId: 'blue' } },
    },
    {
        action: {
            type: 'INITIATE_BUY_JOKER',
            payload: {
                card: {
                    id: 'joker',
                    level: 2,
                    cost: { blue: 1, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                    points: 3,
                },
                source: 'market',
                marketInfo: { level: 2, idx: 1 },
            },
        },
        command: {
            kind: 'INITIATE_BUY_JOKER',
            payload: {
                card: {
                    id: 'joker',
                    level: 2,
                    cost: { blue: 1, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                    points: 3,
                },
                source: 'market',
                marketInfo: { level: 2, idx: 1 },
            },
        },
    },
    {
        action: {
            type: 'BUY_CARD',
            payload: {
                card: {
                    id: 'card-buy',
                    level: 1,
                    cost: { blue: 0, white: 0, green: 1, black: 0, red: 0, pearl: 0, gold: 0 },
                    points: 1,
                    bonusColor: 'green',
                },
                source: 'reserved',
            },
        },
        command: {
            kind: 'BUY_CARD',
            payload: {
                card: {
                    id: 'card-buy',
                    level: 1,
                    cost: { blue: 0, white: 0, green: 1, black: 0, red: 0, pearl: 0, gold: 0 },
                    points: 1,
                    bonusColor: 'green',
                },
                source: 'reserved',
            },
        },
    },
    {
        action: {
            type: 'INITIATE_RESERVE',
            payload: {
                card: {
                    id: 'reserve-source',
                    level: 1,
                    cost: { blue: 0, white: 1, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                    points: 0,
                    bonusColor: 'white',
                },
                level: 1,
                idx: 0,
            },
        },
        command: {
            kind: 'INITIATE_RESERVE',
            payload: {
                card: {
                    id: 'reserve-source',
                    level: 1,
                    cost: { blue: 0, white: 1, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
                    points: 0,
                    bonusColor: 'white',
                },
                level: 1,
                idx: 0,
            },
        },
    },
    {
        action: { type: 'INITIATE_RESERVE_DECK', payload: { level: 3 } },
        command: { kind: 'INITIATE_RESERVE_DECK', payload: { level: 3 } },
    },
    {
        action: { type: 'CANCEL_RESERVE' },
        command: { kind: 'CANCEL_RESERVE' },
    },
    {
        action: {
            type: 'RESERVE_CARD',
            payload: {
                card: {
                    id: 'reserved-card',
                    level: 3,
                    cost: { blue: 0, white: 0, green: 0, black: 2, red: 0, pearl: 0, gold: 0 },
                    points: 4,
                    bonusColor: 'black',
                },
                level: 3,
                idx: 2,
                goldCoords: { r: 2, c: 2 },
            },
        },
        command: {
            kind: 'RESERVE_CARD',
            payload: {
                card: {
                    id: 'reserved-card',
                    level: 3,
                    cost: { blue: 0, white: 0, green: 0, black: 2, red: 0, pearl: 0, gold: 0 },
                    points: 4,
                    bonusColor: 'black',
                },
                level: 3,
                idx: 2,
                goldCoords: { r: 2, c: 2 },
            },
        },
    },
    {
        action: { type: 'RESERVE_DECK', payload: { level: 2, goldCoords: { r: 4, c: 4 } } },
        command: { kind: 'RESERVE_DECK', payload: { level: 2, goldCoords: { r: 4, c: 4 } } },
    },
    {
        action: { type: 'DISCARD_RESERVED', payload: { cardId: 'discard-me' } },
        command: { kind: 'DISCARD_RESERVED', payload: { cardId: 'discard-me' } },
    },
    {
        action: { type: 'ACTIVATE_PRIVILEGE' },
        command: { kind: 'ACTIVATE_PRIVILEGE' },
    },
    {
        action: { type: 'USE_PRIVILEGE', payload: { r: 2, c: 1 } },
        command: { kind: 'USE_PRIVILEGE', payload: { r: 2, c: 1 } },
    },
    {
        action: { type: 'CANCEL_PRIVILEGE' },
        command: { kind: 'CANCEL_PRIVILEGE' },
    },
    {
        action: {
            type: 'SELECT_ROYAL_CARD',
            payload: {
                card: {
                    id: 'royal-judge',
                    points: 2,
                    bonusColor: 'gold',
                    ability: 'scroll',
                    label: 'Royal Judge',
                },
            },
        },
        command: {
            kind: 'SELECT_ROYAL_CARD',
            payload: {
                card: {
                    id: 'royal-judge',
                    points: 2,
                    bonusColor: 'gold',
                    ability: 'scroll',
                    label: 'Royal Judge',
                },
            },
        },
    },
    {
        action: { type: 'PEEK_DECK', payload: { level: 1 } },
        command: { kind: 'PEEK_DECK', payload: { level: 1 } },
    },
    {
        action: { type: 'CLOSE_MODAL' },
        command: { kind: 'CLOSE_MODAL' },
    },
];

describe('networkProtocol phase 3 matrix', () => {
    it('round-trips every guest intent command shape, including payload-less variants', () => {
        for (const { action, command } of guestIntentMatrix) {
            expect(actionToGuestIntentCommand(action)).toEqual(command);
            expect(guestIntentToAction(command)).toEqual(action);
        }
    });

    it('round-trips bootstrap commands for INIT and INIT_DRAFT without leaking host identity', () => {
        const initAction: GameAction = { type: 'INIT', payload: setupPayload };
        const initDraftAction: GameAction = { type: 'INIT_DRAFT', payload: draftPayload };

        expect(actionToBootstrapCommand(initAction)).toEqual({ kind: 'INIT', setup: setupPayload });
        expect(actionToBootstrapCommand(initDraftAction)).toEqual({
            kind: 'INIT_DRAFT',
            setup: draftPayload,
        });

        expect(
            bootstrapCommandToAction({ kind: 'INIT', setup: setupPayload }, false)
        ).toMatchObject({
            type: 'INIT',
            payload: expect.objectContaining({ isHost: false }),
        });
        expect(
            bootstrapCommandToAction({ kind: 'INIT_DRAFT', setup: draftPayload }, true)
        ).toMatchObject({
            type: 'INIT_DRAFT',
            payload: expect.objectContaining({ isHost: true, draftPool: draftPayload.draftPool }),
        });
    });

    it('enforces inbound message direction checks for host and guest roles', () => {
        const snapshot = createMockState({ mode: 'ONLINE_MULTIPLAYER' });
        const hostOnlyMessages: NetworkMessage[] = [
            {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'GUEST_INTENT',
                requestId: 'req-1',
                command: { kind: 'CLOSE_MODAL' },
            },
            {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'RECOVERY_REQUEST',
                reason: 'MANUAL',
                requestId: 'recover-1',
            },
        ];
        const guestOnlyMessages: NetworkMessage[] = [
            {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'BOOTSTRAP_STATE',
                command: { kind: 'INIT', setup: setupPayload },
            },
            {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: 'req-2',
                intentKind: 'CLOSE_MODAL',
                approved: true,
                command: { kind: 'CLOSE_MODAL' },
            },
            {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'SYNC_STATE',
                snapshot,
                reason: 'RECOVERY',
            },
        ];
        const sharedMessages: NetworkMessage[] = [
            {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HEARTBEAT_PING',
                timestamp: 1,
            },
            {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HEARTBEAT_PONG',
                timestamp: 2,
            },
        ];

        for (const msg of [...hostOnlyMessages, ...sharedMessages]) {
            expect(getInboundMessageCheck('host', msg)).toEqual({ accepted: true });
        }
        for (const msg of [...guestOnlyMessages, ...sharedMessages]) {
            expect(getInboundMessageCheck('guest', msg)).toEqual({ accepted: true });
        }

        for (const msg of guestOnlyMessages) {
            expect(getInboundMessageCheck('host', msg)).toEqual({
                accepted: false,
                reason: `Host rejected inbound ${msg.type} message.`,
            });
        }
        for (const msg of hostOnlyMessages) {
            expect(getInboundMessageCheck('guest', msg)).toEqual({
                accepted: false,
                reason: `Guest rejected inbound ${msg.type} message.`,
            });
        }
    });
});
