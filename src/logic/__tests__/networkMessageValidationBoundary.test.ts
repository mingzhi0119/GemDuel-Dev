import { describe, expect, it } from 'vitest';
import { INITIAL_STATE_SKELETON } from '../initialState';
import { createGameSetupPayload } from '../gameSetup';
import { parseNetworkMessage, parseNetworkMessageBoundary } from '../networkMessageValidation';
import { NETWORK_PROTOCOL_VERSION } from '../../types/network';

const setupPayload = createGameSetupPayload('ONLINE_MULTIPLAYER', {
    useBuffs: false,
    isHost: true,
});

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

    it('exposes the nullable wrapper API for invalid and valid messages', () => {
        expect(parseNetworkMessage({ type: 'SYNC_STATE' })).toBeNull();
        expect(
            parseNetworkMessage({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HEARTBEAT_PING',
                timestamp: 123,
            })
        ).toEqual({
            version: NETWORK_PROTOCOL_VERSION,
            type: 'HEARTBEAT_PING',
            timestamp: 123,
        });
    });

    it('accepts and rejects heartbeat payloads with explicit timestamp validation messages', () => {
        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HEARTBEAT_PING',
                timestamp: 123,
            })
        ).toEqual({
            ok: true,
            value: {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HEARTBEAT_PING',
                timestamp: 123,
            },
        });

        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HEARTBEAT_PING',
                timestamp: '123',
            })
        ).toEqual({
            ok: false,
            boundaryId: 'network-message-parsing',
            code: 'NETWORK_MESSAGE_INVALID_ENVELOPE',
            message: 'HEARTBEAT_PING requires a numeric timestamp payload.',
            runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
        });

        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HEARTBEAT_PONG',
                timestamp: 456,
            })
        ).toEqual({
            ok: true,
            value: {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HEARTBEAT_PONG',
                timestamp: 456,
            },
        });

        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HEARTBEAT_PONG',
                timestamp: '456',
            })
        ).toEqual({
            ok: false,
            boundaryId: 'network-message-parsing',
            code: 'NETWORK_MESSAGE_INVALID_ENVELOPE',
            message: 'HEARTBEAT_PONG requires a numeric timestamp payload.',
            runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
        });
    });

    it('validates bootstrap and guest-intent payload contracts', () => {
        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'BOOTSTRAP_STATE',
                command: {
                    kind: 'INIT',
                    setup: setupPayload,
                },
                checksum: 'bootstrap-checksum',
            })
        ).toEqual({
            ok: true,
            value: {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'BOOTSTRAP_STATE',
                command: {
                    kind: 'INIT',
                    setup: setupPayload,
                },
                checksum: 'bootstrap-checksum',
            },
        });

        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'BOOTSTRAP_STATE',
                command: {
                    kind: 'INIT',
                },
            })
        ).toEqual({
            ok: false,
            boundaryId: 'network-message-parsing',
            code: 'NETWORK_MESSAGE_INVALID_BOOTSTRAP',
            message: 'Inbound bootstrap payload failed schema validation.',
            runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
        });

        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'GUEST_INTENT',
                requestId: 'req-close',
                command: {
                    kind: 'CLOSE_MODAL',
                },
            })
        ).toEqual({
            ok: true,
            value: {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'GUEST_INTENT',
                requestId: 'req-close',
                command: {
                    kind: 'CLOSE_MODAL',
                },
            },
        });

        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'GUEST_INTENT',
                requestId: '',
                command: {
                    kind: 'CLOSE_MODAL',
                },
            })
        ).toEqual({
            ok: false,
            boundaryId: 'network-message-parsing',
            code: 'NETWORK_MESSAGE_INVALID_GUEST_INTENT',
            message: 'Inbound guest intent failed schema validation.',
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

    it('surfaces each governed host-decision validation message and accepts valid approved decisions', () => {
        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: 'req-mismatch',
                intentKind: 'CLOSE_MODAL',
                approved: true,
                command: {
                    kind: 'PEEK_DECK',
                    payload: { level: 1 },
                },
                checksum: 'checksum-ok',
            })
        ).toEqual({
            ok: false,
            boundaryId: 'network-message-parsing',
            code: 'NETWORK_MESSAGE_INVALID_HOST_DECISION',
            message: 'Inbound host decision command payload did not match the declared intent.',
            runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
        });

        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: 'req-approved',
                intentKind: 'CLOSE_MODAL',
                approved: true,
            })
        ).toEqual({
            ok: false,
            boundaryId: 'network-message-parsing',
            code: 'NETWORK_MESSAGE_INVALID_HOST_DECISION',
            message: 'Approved host decisions must include both a command payload and checksum.',
            runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
        });

        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: 'req-checksum',
                intentKind: 'CLOSE_MODAL',
                approved: false,
                checksum: 42,
            })
        ).toEqual({
            ok: false,
            boundaryId: 'network-message-parsing',
            code: 'NETWORK_MESSAGE_INVALID_HOST_DECISION',
            message: 'Inbound host decision carried a non-string checksum.',
            runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
        });

        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: 'req-reason',
                intentKind: 'CLOSE_MODAL',
                approved: false,
                reason: 42,
            })
        ).toEqual({
            ok: false,
            boundaryId: 'network-message-parsing',
            code: 'NETWORK_MESSAGE_INVALID_HOST_DECISION',
            message: 'Inbound host decision carried a non-string rejection reason.',
            runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
        });

        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: '',
                intentKind: 'CLOSE_MODAL',
                approved: false,
            })
        ).toEqual({
            ok: false,
            boundaryId: 'network-message-parsing',
            code: 'NETWORK_MESSAGE_INVALID_HOST_DECISION',
            message: 'Inbound host decision did not satisfy the base contract.',
            runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
        });

        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: 'req-ok',
                intentKind: 'CLOSE_MODAL',
                approved: true,
                command: {
                    kind: 'CLOSE_MODAL',
                },
                checksum: 'checksum-ok',
            })
        ).toEqual({
            ok: true,
            value: {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId: 'req-ok',
                intentKind: 'CLOSE_MODAL',
                approved: true,
                command: {
                    kind: 'CLOSE_MODAL',
                },
                checksum: 'checksum-ok',
                reasonCode: undefined,
                reason: undefined,
            },
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

    it('rejects malformed sync-state payloads and validates recovery requests', () => {
        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'SYNC_STATE',
                snapshot: {},
                reason: 'RECOVERY',
            })
        ).toEqual({
            ok: false,
            boundaryId: 'network-message-parsing',
            code: 'NETWORK_MESSAGE_INVALID_SYNC_STATE',
            message: 'Inbound sync-state payload did not satisfy the GameState boundary.',
            runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
        });

        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'RECOVERY_REQUEST',
                reason: 'MANUAL',
                requestId: 'recover-1',
            })
        ).toEqual({
            ok: true,
            value: {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'RECOVERY_REQUEST',
                reason: 'MANUAL',
                requestId: 'recover-1',
            },
        });

        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'RECOVERY_REQUEST',
                reason: 'NOT_A_REASON',
                requestId: 'recover-2',
            })
        ).toEqual({
            ok: false,
            boundaryId: 'network-message-parsing',
            code: 'NETWORK_MESSAGE_INVALID_RECOVERY_REQUEST',
            message: 'Inbound recovery request failed schema validation.',
            runtimeSignal: 'NETWORK_MESSAGE_REJECTED',
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

    it('normalizes unknown sync-state reasons back to TURN_SYNC while preserving the snapshot', () => {
        expect(
            parseNetworkMessageBoundary({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'SYNC_STATE',
                snapshot: INITIAL_STATE_SKELETON,
                reason: 'UNRECOGNIZED_SYNC_REASON',
            })
        ).toEqual({
            ok: true,
            value: {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'SYNC_STATE',
                snapshot: INITIAL_STATE_SKELETON,
                reason: 'TURN_SYNC',
            },
        });
    });
});
