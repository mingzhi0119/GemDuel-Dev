import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MutableRefObject } from 'react';
import type { DataConnection } from 'peerjs';
import type { GameState } from '@gemduel/shared/types';
import { createGameSetupPayload } from '@gemduel/shared/logic/gameSetup';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import {
    NETWORK_PROTOCOL_VERSION,
    type BootstrapCommand,
    type GuestIntentCommand,
} from '@gemduel/shared/types/network';
import type { ConnectionStatus, OnlineManagerHandlers } from '../types';
import { registerConnectionHandlers } from '../connectionHandlers';

const reportRendererEvent = vi.fn();

vi.mock('../../../observability/rendererLogger', () => ({
    reportRendererEvent: (...args: unknown[]) => reportRendererEvent(...args),
}));

type Listener = (...args: unknown[]) => void;

class FakeConnection {
    peer: string;
    private listeners = new Map<string, Listener[]>();

    constructor(peer = 'remote-peer') {
        this.peer = peer;
    }

    on(event: string, listener: Listener) {
        const listeners = this.listeners.get(event) ?? [];
        listeners.push(listener);
        this.listeners.set(event, listeners);
        return this;
    }

    emit(event: string, ...args: unknown[]) {
        this.listeners.get(event)?.forEach((listener) => listener(...args));
    }
}

const createHandlers = (): OnlineManagerHandlers => ({
    onBootstrapReceived: vi.fn(),
    onStateReceived: vi.fn(),
    onGuestIntentReceived: vi.fn(),
    onHostDecisionReceived: vi.fn(),
});

const createRef = <T>(value: T) => ({ current: value }) as MutableRefObject<T>;
const asConnection = (connection: FakeConnection) => connection as unknown as DataConnection;

const createState = (): GameState =>
    JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

describe('registerConnectionHandlers', () => {
    beforeEach(() => {
        reportRendererEvent.mockReset();
    });

    it('tracks open and close lifecycle events for the active connection', () => {
        const connection = new FakeConnection();
        const handlersRef = createRef(createHandlers());
        const reconnectAttempts = createRef(3);
        const setConn = vi.fn();
        const setRemotePeerId = vi.fn();
        const setConnectionStatus = vi.fn();

        registerConnectionHandlers({
            connection: asConnection(connection),
            handlersRef,
            isHostRef: createRef(true),
            reconnectAttempts,
            handleHeartbeat: vi.fn(),
            sendMessage: vi.fn(),
            setConn,
            setRemotePeerId,
            setConnectionStatus,
        });

        connection.emit('open');

        expect(reconnectAttempts.current).toBe(0);
        expect(setConnectionStatus).toHaveBeenCalledWith('connected');
        expect(setConn).toHaveBeenCalledWith(connection);
        expect(setRemotePeerId).toHaveBeenCalledWith('remote-peer');
        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'peer',
                name: 'PEER_CONNECTION_OPENED',
                severity: 'info',
            })
        );

        connection.emit('close');

        const closeUpdater = setConn.mock.calls[setConn.mock.calls.length - 1]?.[0] as
            | ((current: FakeConnection | null) => FakeConnection | null)
            | undefined;
        expect(closeUpdater).toBeTypeOf('function');
        expect(closeUpdater?.(connection)).toBeNull();
        expect(setConnectionStatus).toHaveBeenCalledWith('disconnected');
        expect(setRemotePeerId).toHaveBeenCalledWith('');

        const unrelated = new FakeConnection('other-peer');
        expect(closeUpdater?.(unrelated)).toBe(unrelated);
    });

    it('rejects malformed payloads, routes heartbeats, and blocks invalid message directions', () => {
        const connection = new FakeConnection();
        const handlersRef = createRef(createHandlers());
        const handleHeartbeat = vi.fn();

        registerConnectionHandlers({
            connection: asConnection(connection),
            handlersRef,
            isHostRef: createRef(false),
            reconnectAttempts: createRef(0),
            handleHeartbeat,
            sendMessage: vi.fn(),
            setConn: vi.fn(),
            setRemotePeerId: vi.fn(),
            setConnectionStatus: vi.fn(),
        });

        connection.emit('data', { nope: true });
        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'network',
                name: 'NETWORK_MESSAGE_REJECTED',
                severity: 'warn',
            }),
            expect.objectContaining({
                consoleMessage: expect.stringContaining('Rejected malformed network message'),
            })
        );

        connection.emit('data', {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'HEARTBEAT_PING',
            timestamp: 42,
        });
        expect(handleHeartbeat).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'HEARTBEAT_PING',
                timestamp: 42,
            })
        );

        const guestIntent: GuestIntentCommand = { kind: 'CLOSE_MODAL' };
        connection.emit('data', {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'GUEST_INTENT',
            requestId: 'req-1',
            command: guestIntent,
        });
        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'network',
                name: 'NETWORK_DIRECTION_REJECTED',
                severity: 'warn',
            }),
            expect.objectContaining({
                consoleMessage: expect.stringContaining(
                    'Guest rejected inbound GUEST_INTENT message'
                ),
            })
        );
        expect(handlersRef.current.onGuestIntentReceived).not.toHaveBeenCalled();
    });

    it('dispatches guest-facing inbound protocol messages to the appropriate handlers', () => {
        const connection = new FakeConnection();
        const handlersRef = createRef(createHandlers());
        const state = createState();
        const bootstrapCommand = {
            kind: 'INIT',
            setup: createGameSetupPayload('ONLINE_MULTIPLAYER', {
                useBuffs: false,
                isHost: true,
            }),
        } as BootstrapCommand;
        const guestIntent: GuestIntentCommand = { kind: 'CLOSE_MODAL' };

        registerConnectionHandlers({
            connection: asConnection(connection),
            handlersRef,
            isHostRef: createRef(false),
            reconnectAttempts: createRef(0),
            handleHeartbeat: vi.fn(),
            sendMessage: vi.fn(),
            setConn: vi.fn(),
            setRemotePeerId: vi.fn(),
            setConnectionStatus: vi.fn(),
        });

        connection.emit('data', {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'BOOTSTRAP_STATE',
            command: bootstrapCommand,
            checksum: 'bootstrap-checksum',
        });
        connection.emit('data', {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'SYNC_STATE',
            snapshot: state,
            reason: 'RECOVERY',
        });
        connection.emit('data', {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'HOST_DECISION',
            requestId: 'guest-1',
            intentKind: 'CLOSE_MODAL',
            approved: true,
            command: guestIntent,
            checksum: 'decision-checksum',
        });

        expect(handlersRef.current.onBootstrapReceived).toHaveBeenCalledWith(
            bootstrapCommand,
            'bootstrap-checksum'
        );
        expect(handlersRef.current.onStateReceived).toHaveBeenCalledWith(state, 'RECOVERY');
        expect(handlersRef.current.onHostDecisionReceived).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'HOST_DECISION',
                requestId: 'guest-1',
            })
        );
    });

    it('dispatches host-facing guest intents and responds to recovery requests with an authoritative sync', () => {
        const connection = new FakeConnection();
        const handlersRef = createRef(createHandlers());
        const sendMessage = vi.fn();
        const state = createState();
        const guestIntent: GuestIntentCommand = { kind: 'CLOSE_MODAL' };

        registerConnectionHandlers({
            connection: asConnection(connection),
            handlersRef,
            isHostRef: createRef(true),
            reconnectAttempts: createRef(0),
            getCurrentStateRef: () => state,
            handleHeartbeat: vi.fn(),
            sendMessage,
            setConn: vi.fn(),
            setRemotePeerId: vi.fn(),
            setConnectionStatus: vi.fn(),
        });

        connection.emit('data', {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'GUEST_INTENT',
            requestId: 'guest-1',
            command: guestIntent,
        });
        connection.emit('data', {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'RECOVERY_REQUEST',
            reason: 'STALE_PACKET',
            requestId: 'recover-1',
        });

        expect(handlersRef.current.onGuestIntentReceived).toHaveBeenCalledWith(
            'guest-1',
            guestIntent
        );
        expect(sendMessage).toHaveBeenCalledWith({
            version: NETWORK_PROTOCOL_VERSION,
            type: 'SYNC_STATE',
            snapshot: state,
            reason: 'RECOVERY',
        });
        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'recovery',
                name: 'RECOVERY_REQUEST_RECEIVED',
                severity: 'warn',
            }),
            expect.objectContaining({
                consoleMessage: expect.stringContaining('Guest requested recovery'),
            })
        );
    });

    it('surfaces connection errors through structured telemetry', () => {
        const connection = new FakeConnection();
        const error = new Error('boom');

        registerConnectionHandlers({
            connection: asConnection(connection),
            handlersRef: createRef(createHandlers()),
            isHostRef: createRef(true),
            reconnectAttempts: createRef(0),
            handleHeartbeat: vi.fn(),
            sendMessage: vi.fn(),
            setConn: vi.fn(),
            setRemotePeerId: vi.fn(),
            setConnectionStatus: vi.fn(),
        });

        connection.emit('error', error);

        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'peer',
                name: 'PEER_CONNECTION_ERROR',
                severity: 'error',
            }),
            expect.objectContaining({
                consoleMessage: '[NET] Connection Error:',
                consoleDetails: error,
            })
        );
    });
});
