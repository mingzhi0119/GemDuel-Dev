import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import type { ConnectionStatus } from '../types';
import { createManagedPeer, destroyManagedPeer } from '../peerLifecycle';

const createPeerConfig = vi.fn();
const logRendererMessage = vi.fn();
const reportRendererEvent = vi.fn();

const harness = vi.hoisted(() => {
    type Listener = (...args: unknown[]) => void;

    class FakeConnection {
        constructor(public peer: string) {}
    }

    class FakePeer {
        destroyed = false;
        reconnect = vi.fn();
        destroy = vi.fn(() => {
            this.destroyed = true;
        });
        private listeners = new Map<string, Listener[]>();

        constructor(public config: unknown) {}

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

    return { FakeConnection, FakePeer };
});

vi.mock('peerjs', () => ({
    Peer: harness.FakePeer,
    DataConnection: harness.FakeConnection,
}));

vi.mock('@gemduel/shared/config/webrtc', () => ({
    createPeerConfig: (...args: unknown[]) => createPeerConfig(...args),
}));

vi.mock('../../../observability/rendererLogger', () => ({
    logRendererMessage: (...args: unknown[]) => logRendererMessage(...args),
    reportRendererEvent: (...args: unknown[]) => reportRendererEvent(...args),
}));

const createRef = <T>(value: T) => ({ current: value }) as MutableRefObject<T>;
const createDispatch = <T>() =>
    vi.fn<(value: SetStateAction<T>) => void>() as Dispatch<SetStateAction<T>>;

describe('peer lifecycle helpers', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        createPeerConfig.mockReset();
        logRendererMessage.mockReset();
        reportRendererEvent.mockReset();
        createPeerConfig.mockReturnValue({ host: '127.0.0.1', secure: true });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('creates a managed peer, logs initialization, and handles open and incoming connection events', () => {
        const setupConnection = vi.fn();
        const setPeerId = vi.fn();
        const setIsHost = vi.fn();
        const peer = createManagedPeer({
            targetIP: '127.0.0.1',
            maxReconnectAttempts: 3,
            isHostRef: createRef(false),
            reconnectAttempts: createRef(0),
            reconnectTimeoutRef: createRef<ReturnType<typeof setTimeout> | null>(null),
            setupConnection,
            setPeerId,
            setIsHost,
            setConnectionStatus: createDispatch<ConnectionStatus>(),
            setRemotePeerId: createDispatch<string>(),
        }) as unknown as InstanceType<typeof harness.FakePeer>;

        expect(createPeerConfig).toHaveBeenCalledWith(true, '127.0.0.1');
        expect(peer.config).toEqual({ host: '127.0.0.1', secure: true });
        expect(logRendererMessage).toHaveBeenCalledWith('info', '[NET] Initializing Peer...');
        expect(logRendererMessage).toHaveBeenCalledWith('info', '[NET] Target IP: 127.0.0.1');
        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'peer',
                name: 'PEER_INITIALIZING',
                severity: 'info',
            })
        );

        peer.emit('open', 'peer-local');
        expect(setPeerId).toHaveBeenCalledWith('peer-local');
        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'peer',
                name: 'PEER_READY',
                severity: 'info',
                context: expect.objectContaining({ peerId: 'peer-local' }),
            }),
            expect.objectContaining({
                consoleMessage: '[NET] My peer ID is: peer-local',
            })
        );

        const incoming = new harness.FakeConnection('peer-guest');
        peer.emit('connection', incoming);
        expect(setupConnection).toHaveBeenCalledWith(incoming);
        expect(setIsHost).toHaveBeenCalledWith(true);
        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'peer',
                name: 'PEER_INCOMING_CONNECTION',
                severity: 'info',
                context: expect.objectContaining({ remotePeerId: 'peer-guest' }),
            }),
            expect.objectContaining({
                consoleMessage: '[NET] Incoming connection from:',
                consoleDetails: 'peer-guest',
            })
        );
    });

    it('schedules reconnects while attempts remain and reports exhaustion once the cap is reached', () => {
        const reconnectAttempts = createRef(0);
        const reconnectTimeoutRef = createRef<ReturnType<typeof setTimeout> | null>(
            setTimeout(() => undefined, 50)
        );
        const peer = createManagedPeer({
            targetIP: '127.0.0.1',
            maxReconnectAttempts: 2,
            isHostRef: createRef(false),
            reconnectAttempts,
            reconnectTimeoutRef,
            setupConnection: vi.fn(),
            setPeerId: vi.fn(),
            setIsHost: vi.fn(),
            setConnectionStatus: createDispatch<ConnectionStatus>(),
            setRemotePeerId: createDispatch<string>(),
        }) as unknown as InstanceType<typeof harness.FakePeer>;

        peer.emit('disconnected');

        expect(logRendererMessage).toHaveBeenCalledWith(
            'info',
            '[NET] Attempting reconnect (1/2)...'
        );
        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'peer',
                name: 'PEER_SIGNALING_DISCONNECTED',
                severity: 'warn',
            }),
            expect.objectContaining({
                consoleMessage: '[NET] Peer disconnected from signaling server.',
            })
        );

        vi.runOnlyPendingTimers();
        expect(peer.reconnect).toHaveBeenCalledTimes(1);
        expect(reconnectAttempts.current).toBe(1);
        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'peer',
                name: 'PEER_RECONNECT_SCHEDULED',
                severity: 'info',
                context: expect.objectContaining({
                    attempt: 1,
                    maxAttempts: 2,
                }),
            })
        );

        reconnectAttempts.current = 2;
        peer.emit('disconnected');
        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'peer',
                name: 'PEER_RECONNECT_EXHAUSTED',
                severity: 'error',
                context: expect.objectContaining({
                    maxAttempts: 2,
                }),
            })
        );
    });

    it('reports peer errors and destroys managed peers during cleanup', () => {
        const peer = createManagedPeer({
            targetIP: '127.0.0.1',
            maxReconnectAttempts: 1,
            isHostRef: createRef(false),
            reconnectAttempts: createRef(0),
            reconnectTimeoutRef: createRef<ReturnType<typeof setTimeout> | null>(null),
            setupConnection: vi.fn(),
            setPeerId: vi.fn(),
            setIsHost: vi.fn(),
            setConnectionStatus: createDispatch<ConnectionStatus>(),
            setRemotePeerId: createDispatch<string>(),
        }) as unknown as InstanceType<typeof harness.FakePeer>;

        const error = new Error('signaling exploded');
        peer.emit('error', error);
        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'peer',
                name: 'PEER_ERROR',
                severity: 'error',
            }),
            expect.objectContaining({
                consoleMessage: '[NET] Peer Error:',
                consoleDetails: error,
            })
        );

        const reconnectTimeoutRef = createRef<ReturnType<typeof setTimeout> | null>(
            setTimeout(() => undefined, 100)
        );
        const setPeer = vi.fn();
        const setPeerId = vi.fn();
        const setConnectionStatus = createDispatch<ConnectionStatus>();
        const setRemotePeerId = createDispatch<string>();

        destroyManagedPeer(
            peer as never,
            reconnectTimeoutRef,
            setPeer,
            setPeerId,
            setConnectionStatus,
            setRemotePeerId
        );

        expect(peer.destroy).toHaveBeenCalledTimes(1);
        expect(reconnectTimeoutRef.current).toBeNull();
        expect(setPeer).toHaveBeenCalledWith(null);
        expect(setPeerId).toHaveBeenCalledWith('');
        expect(setConnectionStatus).toHaveBeenCalledWith('disconnected');
        expect(setRemotePeerId).toHaveBeenCalledWith('');
        expect(reportRendererEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'peer',
                name: 'PEER_DESTROYED',
                severity: 'info',
            }),
            expect.objectContaining({
                consoleMessage: '[NET] Destroying Peer instance.',
            })
        );
    });
});
