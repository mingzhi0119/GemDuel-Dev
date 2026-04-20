import { describe, expect, it } from 'vitest';
import { INITIAL_STATE_SKELETON } from '../initialState';
import { parseNetworkMessage } from '../actionValidation';
import { getInboundMessageCheck } from '../networkProtocol';
import { computeGuestIntentChecksum, verifyApprovedHostDecision } from '../networkChecksums';
import {
    NETWORK_PROTOCOL_VERSION,
    type HostDecisionMessage,
    type NetworkMessage,
} from '../../types/network';
import type { GameState } from '../../types';

const cloneState = (): GameState => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

describe('Protocol recovery matrix', () => {
    it('rejects approved host decisions whose command kind does not match the declared intent', () => {
        expect(
            parseNetworkMessage({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: 'req-1',
                intentKind: 'CLOSE_MODAL',
                approved: true,
                command: { kind: 'PEEK_DECK', payload: { level: 1 } },
                checksum: 'abc',
            } as unknown)
        ).toBeNull();
    });

    it('rejects host decisions with unknown structured rejection codes', () => {
        expect(
            parseNetworkMessage({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: 'req-invalid-code',
                intentKind: 'CLOSE_MODAL',
                approved: false,
                reasonCode: 'NOT_A_REAL_CODE',
                reason: 'Unknown',
            } as unknown)
        ).toBeNull();
    });

    it('enforces inbound direction checks for host and guest roles', () => {
        const guestIntent = {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'GUEST_INTENT',
            requestId: 'guest-1',
            command: { kind: 'CLOSE_MODAL' as const },
        } satisfies Extract<NetworkMessage, { type: 'GUEST_INTENT' }>;
        const syncState = {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'SYNC_STATE',
            snapshot: cloneState(),
            reason: 'TURN_SYNC' as const,
        } satisfies Extract<NetworkMessage, { type: 'SYNC_STATE' }>;

        expect(getInboundMessageCheck('host', guestIntent).accepted).toBe(true);
        expect(getInboundMessageCheck('host', syncState).accepted).toBe(false);
        expect(getInboundMessageCheck('guest', syncState).accepted).toBe(true);
        expect(getInboundMessageCheck('guest', guestIntent).accepted).toBe(false);
    });

    it('marks incomplete or missing approval data as stale packets', () => {
        const state = cloneState();
        const staleDecisions: HostDecisionMessage[] = [
            {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: 'req-1',
                intentKind: 'CLOSE_MODAL',
                approved: false,
            },
            {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: 'req-2',
                intentKind: 'CLOSE_MODAL',
                approved: true,
                checksum: 'abc',
            },
            {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: 'req-3',
                intentKind: 'CLOSE_MODAL',
                approved: true,
                command: { kind: 'CLOSE_MODAL' },
            },
        ];

        for (const decision of staleDecisions) {
            expect(verifyApprovedHostDecision(state, decision)).toEqual({
                valid: false,
                reason: 'STALE_PACKET',
            });
        }
    });

    it('accepts a matching approved host decision checksum', () => {
        const state = cloneState();
        const command = { kind: 'CLOSE_MODAL' } as const;
        const checksum = computeGuestIntentChecksum(state, command);
        const decision: HostDecisionMessage = {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'HOST_DECISION',
            requestId: 'req-ok',
            intentKind: 'CLOSE_MODAL',
            approved: true,
            command,
            checksum: checksum || 'missing',
        };

        expect(verifyApprovedHostDecision(state, decision)).toEqual({ valid: true });
    });
});
