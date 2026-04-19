import { describe, expect, it } from 'vitest';
import { INITIAL_STATE_SKELETON } from '../initialState';
import { reviewHostIntent } from '../hostApproval';
import type { GameState } from '../../types';

const createOnlineGuestTurnState = (): GameState => ({
    ...(JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState),
    mode: 'ONLINE_MULTIPLAYER',
    isHost: true,
    turn: 'p2',
});

describe('reviewHostIntent', () => {
    it('approves valid guest intents with a structured approval log', () => {
        const review = reviewHostIntent(
            createOnlineGuestTurnState(),
            'req-approve',
            { kind: 'CLOSE_MODAL' },
            {
                computeChecksum: () => 'checksum-1',
                now: () => 1234,
                validateIntent: () => ({ valid: true }),
            }
        );

        expect(review.outcomeCode).toBe('APPROVED');
        expect(review.decision).toEqual({
            requestId: 'req-approve',
            intentKind: 'CLOSE_MODAL',
            approved: true,
            command: { kind: 'CLOSE_MODAL' },
            checksum: 'checksum-1',
        });
        expect(review.logEntry).toMatchObject({
            requestId: 'req-approve',
            intentKind: 'CLOSE_MODAL',
            approved: true,
            outcomeCode: 'APPROVED',
            checksum: 'checksum-1',
            createdAt: 1234,
        });
    });

    it('returns structured rejection codes for authority failures', () => {
        const review = reviewHostIntent(
            createOnlineGuestTurnState(),
            'req-reject',
            { kind: 'CLOSE_MODAL' },
            {
                now: () => 99,
                validateIntent: () => ({
                    valid: false,
                    reason: "Host rejected CLOSE_MODAL because it is currently p1's turn.",
                }),
            }
        );

        expect(review.outcomeCode).toBe('AUTHORITY_REJECTED');
        expect(review.decision).toEqual({
            requestId: 'req-reject',
            intentKind: 'CLOSE_MODAL',
            approved: false,
            reasonCode: 'AUTHORITY_REJECTED',
            reason: "Host rejected CLOSE_MODAL because it is currently p1's turn.",
        });
        expect(review.logEntry).toMatchObject({
            approved: false,
            outcomeCode: 'AUTHORITY_REJECTED',
            reasonCode: 'AUTHORITY_REJECTED',
            createdAt: 99,
        });
    });

    it('returns checksum-unavailable codes when deterministic state hashing fails', () => {
        const review = reviewHostIntent(
            createOnlineGuestTurnState(),
            'req-checksum',
            { kind: 'CLOSE_MODAL' },
            {
                computeChecksum: () => null,
                validateIntent: () => ({ valid: true }),
            }
        );

        expect(review.outcomeCode).toBe('CHECKSUM_UNAVAILABLE');
        expect(review.decision).toEqual({
            requestId: 'req-checksum',
            intentKind: 'CLOSE_MODAL',
            approved: false,
            reasonCode: 'CHECKSUM_UNAVAILABLE',
            reason: 'Host could not derive a deterministic checksum for the request.',
        });
        expect(review.logEntry).toMatchObject({
            approved: false,
            outcomeCode: 'CHECKSUM_UNAVAILABLE',
            reasonCode: 'CHECKSUM_UNAVAILABLE',
        });
    });
});
