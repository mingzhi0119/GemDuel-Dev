import { describe, expect, it } from 'vitest';
import { INITIAL_STATE_SKELETON } from '../initialState';
import { createGameSetupPayload } from '../gameSetup';
import { reviewBootstrapReceipt, reviewGuestHostDecision } from '../networkRecovery';
import {
    NETWORK_PROTOCOL_VERSION,
    type HostDecisionMessage,
    type PendingGuestIntent,
} from '../../types/network';
import type { GameState } from '../../types';

const cloneState = (): GameState => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

describe('networkRecovery', () => {
    it('requests recovery when bootstrap checksums diverge', () => {
        const command = {
            kind: 'INIT' as const,
            setup: createGameSetupPayload('ONLINE_MULTIPLAYER', {
                useBuffs: false,
                isHost: true,
            }),
        };

        expect(
            reviewBootstrapReceipt(command, 'remote-checksum', {
                computeChecksum: () => 'local-checksum',
            })
        ).toEqual({
            outcome: 'REQUEST_RECOVERY',
            reason: 'CHECKSUM_MISMATCH',
            localChecksum: 'local-checksum',
            remoteChecksum: 'remote-checksum',
        });
    });

    it('converts accepted bootstrap commands into guest-safe init actions', () => {
        const setup = createGameSetupPayload('ONLINE_MULTIPLAYER', {
            useBuffs: false,
            isHost: true,
        });

        expect(
            reviewBootstrapReceipt({ kind: 'INIT', setup }, 'checksum-ok', {
                computeChecksum: () => 'checksum-ok',
            })
        ).toEqual({
            outcome: 'APPLY',
            action: {
                type: 'INIT',
                payload: {
                    ...setup,
                    isHost: false,
                },
            },
        });
    });

    it('ignores late host decisions after the pending intent has been cleared', () => {
        const decision: HostDecisionMessage = {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'HOST_DECISION',
            requestId: 'req-late',
            intentKind: 'CLOSE_MODAL',
            approved: false,
            reasonCode: 'AUTHORITY_REJECTED',
        };

        expect(reviewGuestHostDecision(cloneState(), null, decision)).toEqual({
            outcome: 'IGNORE_LATE',
            clearPendingIntent: false,
        });
    });

    it('requests recovery for stale host decisions that no longer match the pending guest intent', () => {
        const pendingIntent: PendingGuestIntent = {
            requestId: 'req-pending',
            command: { kind: 'CLOSE_MODAL' },
        };
        const decision: HostDecisionMessage = {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'HOST_DECISION',
            requestId: 'req-other',
            intentKind: 'CLOSE_MODAL',
            approved: false,
            reasonCode: 'AUTHORITY_REJECTED',
        };

        expect(reviewGuestHostDecision(cloneState(), pendingIntent, decision)).toEqual({
            outcome: 'REQUEST_RECOVERY',
            clearPendingIntent: false,
            reason: 'STALE_PACKET',
            requestId: 'req-other',
        });
    });

    it('surfaces structured rejection codes for matching host rejections', () => {
        const pendingIntent: PendingGuestIntent = {
            requestId: 'req-reject',
            command: { kind: 'CLOSE_MODAL' },
        };
        const decision: HostDecisionMessage = {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'HOST_DECISION',
            requestId: 'req-reject',
            intentKind: 'CLOSE_MODAL',
            approved: false,
            reasonCode: 'AUTHORITY_REJECTED',
            reason: 'Rejected by the host.',
        };

        expect(reviewGuestHostDecision(cloneState(), pendingIntent, decision)).toEqual({
            outcome: 'REJECTED',
            clearPendingIntent: true,
            reasonCode: 'AUTHORITY_REJECTED',
            reason: 'Rejected by the host.',
        });
    });

    it('requests recovery when approved host decisions fail verification', () => {
        const pendingIntent: PendingGuestIntent = {
            requestId: 'req-verify',
            command: { kind: 'CLOSE_MODAL' },
        };
        const decision: HostDecisionMessage = {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'HOST_DECISION',
            requestId: 'req-verify',
            intentKind: 'CLOSE_MODAL',
            approved: true,
            command: { kind: 'CLOSE_MODAL' },
            checksum: 'wrong-checksum',
        };

        expect(
            reviewGuestHostDecision(cloneState(), pendingIntent, decision, {
                verifyDecision: () => ({
                    valid: false,
                    reason: 'CHECKSUM_MISMATCH',
                }),
            })
        ).toEqual({
            outcome: 'REQUEST_RECOVERY',
            clearPendingIntent: true,
            reason: 'CHECKSUM_MISMATCH',
            requestId: 'req-verify',
        });
    });

    it('accepts verified host decisions once checksum verification succeeds', () => {
        const pendingIntent: PendingGuestIntent = {
            requestId: 'req-ok',
            command: { kind: 'CLOSE_MODAL' },
        };
        const decision: HostDecisionMessage = {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'HOST_DECISION',
            requestId: 'req-ok',
            intentKind: 'CLOSE_MODAL',
            approved: true,
            command: { kind: 'CLOSE_MODAL' },
            checksum: 'checksum-ok',
        };

        expect(
            reviewGuestHostDecision(cloneState(), pendingIntent, decision, {
                verifyDecision: () => ({ valid: true }),
            })
        ).toEqual({
            outcome: 'VERIFIED',
            clearPendingIntent: true,
        });
    });
});
