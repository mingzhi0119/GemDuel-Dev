import { describe, expect, it } from 'vitest';
import { INITIAL_STATE_SKELETON } from '../initialState';
import { parseNetworkMessageBoundary } from '../networkMessageValidation';
import { NETWORK_PROTOCOL_VERSION } from '../../types/network';

describe('network message boundary contracts', () => {
    it('returns a structured boundary failure for malformed envelopes', () => {
        expect(parseNetworkMessageBoundary({ type: 'SYNC_STATE' })).toEqual({
            ok: false,
            boundaryId: 'network-message-parsing',
            code: 'NETWORK_MESSAGE_INVALID_ENVELOPE',
            message: 'Inbound network payload did not match the protocol envelope.',
            runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
        });
    });

    it('returns a structured boundary failure for malformed host decisions', () => {
        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: 'req-invalid',
                intentKind: 'CLOSE_MODAL',
                approved: false,
                reasonCode: 'NOT_A_REAL_CODE',
            })
        ).toEqual({
            ok: false,
            boundaryId: 'network-message-parsing',
            code: 'NETWORK_MESSAGE_INVALID_HOST_DECISION',
            message: 'Inbound host decision carried an unknown structured reason code.',
            runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
        });
    });

    it('returns parsed messages when the payload satisfies the governed schema', () => {
        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'SYNC_STATE',
                snapshot: INITIAL_STATE_SKELETON,
                reason: 'RECOVERY',
            })
        ).toEqual({
            ok: true,
            value: {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'SYNC_STATE',
                snapshot: INITIAL_STATE_SKELETON,
                reason: 'RECOVERY',
            },
        });
    });

    it('accepts host decisions that use shared boundary-level reason codes', () => {
        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: 'req-turn',
                intentKind: 'CLOSE_MODAL',
                approved: false,
                reasonCode: 'NOT_GUEST_TURN',
            })
        ).toEqual({
            ok: true,
            value: {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: 'req-turn',
                intentKind: 'CLOSE_MODAL',
                approved: false,
                reasonCode: 'NOT_GUEST_TURN',
                reason: undefined,
                command: undefined,
                checksum: undefined,
            },
        });
    });
});
