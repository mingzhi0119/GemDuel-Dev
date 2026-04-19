import { describe, expect, it } from 'vitest';
import { INITIAL_STATE_SKELETON } from '../initialState';
import {
    actionToGuestIntentCommand,
    bootstrapCommandToAction,
    guestIntentToAction,
} from '../networkProtocol';
import {
    computeBootstrapChecksum,
    computeGuestIntentChecksum,
    verifyApprovedHostDecision,
} from '../networkChecksums';
import type { GameAction, GameState } from '../../types';
import type { BootstrapCommand, HostDecisionMessage } from '../../types/network';
import { NETWORK_PROTOCOL_VERSION } from '../../types/network';

const cloneState = (): GameState => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

describe('Network Protocol Helpers', () => {
    it('maps guest-safe reducer actions into explicit guest intents only', () => {
        const buyAction: GameAction = {
            type: 'CLOSE_MODAL',
        };
        const debugAction: GameAction = {
            type: 'DEBUG_ADD_POINTS',
            payload: 'p2',
        };

        expect(actionToGuestIntentCommand(buyAction)).toEqual({ kind: 'CLOSE_MODAL' });
        expect(actionToGuestIntentCommand(debugAction)).toBeNull();
    });

    it('rebuilds guest bootstrap actions without leaking host identity', () => {
        const state = cloneState();
        const command: BootstrapCommand = {
            kind: 'INIT',
            setup: {
                mode: state.mode,
                board: state.board,
                bag: state.bag,
                market: state.market,
                decks: state.decks,
                initRandoms: state.pendingSetup?.initRandoms || {
                    p1: {
                        randomGems: ['red', 'green', 'blue', 'white', 'black'],
                        reserveCardLevel: 1,
                        preferenceColor: 'red',
                    },
                    p2: {
                        randomGems: ['red', 'green', 'blue', 'white', 'black'],
                        reserveCardLevel: 1,
                        preferenceColor: 'blue',
                    },
                },
                isHost: true,
            },
        };

        const guestAction = bootstrapCommandToAction(command, false);
        const guestChecksum = computeBootstrapChecksum(command, false);

        expect(guestAction.type).toBe('INIT');
        expect(guestAction.payload.isHost).toBe(false);
        expect(guestChecksum).toBeTypeOf('string');
    });

    it('flags checksum mismatches on approved host decisions so recovery can start', () => {
        const hostState = cloneState();
        hostState.mode = 'ONLINE_MULTIPLAYER';
        hostState.turn = 'p2';
        hostState.board[0][0] = {
            type: { id: 'red', color: '', border: '', label: '' },
            uid: 'host-red',
        };

        const command = {
            kind: 'TAKE_GEMS',
            payload: { coords: [{ r: 0, c: 0 }] },
        } as const;
        const checksum = computeGuestIntentChecksum(hostState, command);
        const decision: HostDecisionMessage = {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'HOST_DECISION',
            requestId: 'guest-1',
            intentKind: command.kind,
            approved: true,
            command,
            checksum: checksum || 'missing',
        };

        const divergedGuestState = cloneState();
        divergedGuestState.mode = 'ONLINE_MULTIPLAYER';
        divergedGuestState.turn = 'p2';
        divergedGuestState.board[0][0] = {
            type: { id: 'blue', color: '', border: '', label: '' },
            uid: 'guest-blue',
        };

        const verification = verifyApprovedHostDecision(divergedGuestState, decision);
        const rebuiltAction = guestIntentToAction(command);

        expect(rebuiltAction.type).toBe('TAKE_GEMS');
        expect(verification.valid).toBe(false);
        expect(verification.reason).toBe('CHECKSUM_MISMATCH');
    });
});
