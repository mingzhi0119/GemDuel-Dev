import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import { isHiddenReservedCard } from '@gemduel/shared/logic/multiplayerVisibility';
import type { Card, GameState } from '@gemduel/shared/types';
import type {
    BootstrapCommand,
    GuestIntentCommand,
    HostDecisionMessage,
    NetworkMessage,
} from '@gemduel/shared/types/network';
import { NETWORK_PROTOCOL_VERSION } from '@gemduel/shared/types/network';
import type { OnlineManagerHandlers } from '../onlineManager/types';
import { useOnlineManager } from '../useOnlineManager';

type Listener = (...args: unknown[]) => void;
type FakeConnectionLike = {
    peer: string;
    open: boolean;
    sent: NetworkMessage[];
    emit: (event: string, ...args: unknown[]) => void;
};

const reportReleaseHealth = vi.fn();
const handleHeartbeat = vi.fn();

const harness = vi.hoisted(() => {
    const peers: FakePeer[] = [];
    const connections: FakeConnection[] = [];

    class FakeConnection {
        peer: string;
        open = false;
        sent: NetworkMessage[] = [];
        private listeners = new Map<string, Listener[]>();

        constructor(peer: string) {
            this.peer = peer;
            connections.push(this);
        }

        on(event: string, listener: Listener) {
            const existing = this.listeners.get(event) ?? [];
            existing.push(listener);
            this.listeners.set(event, existing);
            return this;
        }

        emit(event: string, ...args: unknown[]) {
            if (event === 'open') {
                this.open = true;
            }
            if (event === 'close') {
                this.open = false;
            }
            this.listeners.get(event)?.forEach((listener) => listener(...args));
        }

        send(message: NetworkMessage) {
            this.sent.push(message);
        }
    }

    class FakePeer {
        config: unknown;
        destroyed = false;
        private listeners = new Map<string, Listener[]>();
        connectCalls: string[] = [];
        lastConnection: FakeConnection | null = null;

        constructor(config: unknown) {
            this.config = config;
            peers.push(this);
        }

        on(event: string, listener: Listener) {
            const existing = this.listeners.get(event) ?? [];
            existing.push(listener);
            this.listeners.set(event, existing);
            return this;
        }

        emit(event: string, ...args: unknown[]) {
            this.listeners.get(event)?.forEach((listener) => listener(...args));
        }

        connect(peerId: string) {
            this.connectCalls.push(peerId);
            this.lastConnection = new FakeConnection(peerId);
            return this.lastConnection;
        }

        destroy() {
            this.destroyed = true;
        }

        reconnect() {
            return undefined;
        }
    }

    const reset = () => {
        peers.length = 0;
        connections.length = 0;
    };

    return {
        peers,
        connections,
        reset,
        FakePeer,
        FakeConnection,
    };
});

vi.mock('peerjs', () => ({
    Peer: harness.FakePeer,
    DataConnection: harness.FakeConnection,
}));

vi.mock('../useConnectionHealth', () => ({
    useConnectionHealth: () => ({
        latency: 17,
        isUnstable: false,
        handleHeartbeat,
    }),
}));

vi.mock('../../observability/releaseHealth', () => ({
    reportReleaseHealth: (...args: unknown[]) => reportReleaseHealth(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const createHandlers = (): OnlineManagerHandlers => ({
    onBootstrapReceived: vi.fn(),
    onStateReceived: vi.fn(),
    onGuestIntentReceived: vi.fn(),
    onHostDecisionReceived: vi.fn(),
});

const createGameState = (): GameState =>
    ({
        mode: 'LOCAL_PVP',
        turn: 'p1',
        phase: 'IDLE',
        activeModal: null,
        lastFeedback: null,
        isHost: false,
    }) as GameState;

const createOnlineHostState = (): GameState => ({
    ...(JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState),
    mode: 'ONLINE_MULTIPLAYER',
    isHost: true,
    hostPlayer: 'p1',
    localPlayer: 'p1',
    playerReserved: {
        p1: [
            {
                id: 'host-private-reserved',
                level: 1,
                cost: {
                    blue: 0,
                    white: 0,
                    green: 0,
                    black: 0,
                    red: 2,
                    pearl: 0,
                    gold: 0,
                },
                points: 1,
                ability: 'steal',
                bonusColor: 'red',
            },
        ],
        p2: [
            {
                id: 'guest-own-reserved',
                level: 1,
                cost: {
                    blue: 0,
                    white: 0,
                    green: 0,
                    black: 0,
                    red: 0,
                    pearl: 0,
                    gold: 0,
                },
                points: 0,
            },
        ],
    },
});

describe('useOnlineManager', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof useOnlineManager> | null = null;
    let handlers: OnlineManagerHandlers;

    const renderHarness = (enabled: boolean) => {
        const Harness = () => {
            currentResult = useOnlineManager(handlers, enabled, () => createGameState());
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
        });
    };

    beforeEach(() => {
        handlers = createHandlers();
        currentResult = null;
        reportReleaseHealth.mockReset();
        handleHeartbeat.mockReset();
        harness.reset();
        vi.spyOn(console, 'info').mockImplementation(() => undefined);
        vi.spyOn(console, 'log').mockImplementation(() => undefined);
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
        vi.restoreAllMocks();
    });

    it('skips peer initialization when disabled and rejects connect attempts before the peer is ready', () => {
        renderHarness(false);

        expect(harness.peers).toHaveLength(0);

        act(() => {
            currentResult?.connectToPeer('remote-peer');
        });

        expect(reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'peer',
                name: 'PEER_CONNECT_ATTEMPT_REJECTED',
                severity: 'error',
            })
        );
        expect(currentResult?.connectionStatus).toBe('disconnected');
    });

    it('initializes a managed peer when enabled and destroys it during cleanup', () => {
        renderHarness(true);

        expect(harness.peers).toHaveLength(1);
        const peer = harness.peers[0];
        expect(peer.destroyed).toBe(false);

        act(() => {
            root?.unmount();
        });
        root = null;

        expect(peer.destroyed).toBe(true);
        expect(reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'peer',
                name: 'PEER_DESTROYED',
                severity: 'info',
            })
        );
    });

    it('connectToPeer calls peer.connect and switches to connecting while the connection is pending', () => {
        renderHarness(true);
        const peer = harness.peers[0];

        act(() => {
            currentResult?.connectToPeer('peer-remote');
        });

        expect(peer.connectCalls).toEqual(['peer-remote']);
        expect(peer.lastConnection?.peer).toBe('peer-remote');
        expect(currentResult?.connectionStatus).toBe('connecting');
    });

    it('updates peerId, remotePeerId, and connectionStatus from peer and data-connection lifecycle events', () => {
        renderHarness(true);
        const peer = harness.peers[0];

        act(() => {
            peer.emit('open', 'peer-local');
        });

        expect(currentResult?.peerId).toBe('peer-local');

        act(() => {
            currentResult?.connectToPeer('peer-remote');
        });

        const connection = peer.lastConnection as FakeConnectionLike;

        act(() => {
            connection.emit('open');
        });

        expect(currentResult?.connectionStatus).toBe('connected');
        expect(currentResult?.remotePeerId).toBe('peer-remote');

        const bootstrapCommand = {
            kind: 'INIT',
            setup: { mode: 'LOCAL_PVP' } as unknown as BootstrapCommand['setup'],
        } as BootstrapCommand;
        const guestIntent: GuestIntentCommand = { kind: 'CLOSE_MODAL' };
        const hostDecision: Omit<HostDecisionMessage, 'type' | 'version'> = {
            requestId: 'req-1',
            intentKind: 'CLOSE_MODAL',
            approved: true,
            command: guestIntent,
        };
        const state = createGameState();

        act(() => {
            currentResult?.sendBootstrap(bootstrapCommand, 'checksum-123', {
                leak: 'unsafe-replay-full',
            } as never);
            currentResult?.sendGuestIntent('guest-req', guestIntent);
            currentResult?.sendHostDecision(hostDecision);
            currentResult?.sendState(state, 'RECOVERY');
            currentResult?.requestRecovery('STALE_PACKET', 'recover-1');
        });

        expect(connection.sent).toEqual([
            {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'BOOTSTRAP_STATE',
                command: bootstrapCommand,
                checksum: 'checksum-123',
            },
            {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'GUEST_INTENT',
                requestId: 'guest-req',
                command: guestIntent,
            },
            {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                ...hostDecision,
            },
            {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'SYNC_STATE',
                snapshot: state,
                reason: 'RECOVERY',
            },
            {
                version: NETWORK_PROTOCOL_VERSION,
                type: 'RECOVERY_REQUEST',
                reason: 'STALE_PACKET',
                requestId: 'recover-1',
            },
        ]);
        expect(connection.sent[0]).not.toHaveProperty('replayFull');

        expect(reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'recovery',
                name: 'RECOVERY_REQUEST_SENT',
                severity: 'warn',
            })
        );

        act(() => {
            connection.emit('close');
        });

        expect(currentResult?.connectionStatus).toBe('disconnected');
        expect(currentResult?.remotePeerId).toBe('');
        expect(currentResult?.peerId).toBe('peer-local');
    });

    it('marks the renderer as host when an incoming connection is accepted', () => {
        renderHarness(true);
        const peer = harness.peers[0];
        const incomingConnection = new harness.FakeConnection('peer-guest');

        act(() => {
            peer.emit('connection', incomingConnection);
        });

        expect(currentResult?.isHost).toBe(true);
        expect(reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                category: 'peer',
                name: 'PEER_INCOMING_CONNECTION',
                severity: 'info',
                context: expect.objectContaining({
                    remotePeerId: 'peer-guest',
                }),
            })
        );

        act(() => {
            incomingConnection.emit('open');
        });

        expect(currentResult?.remotePeerId).toBe('peer-guest');
        expect(currentResult?.connectionStatus).toBe('connected');
    });

    it('redacts host state snapshots before sending them to the guest', () => {
        renderHarness(true);
        const peer = harness.peers[0];

        act(() => {
            currentResult?.connectToPeer('peer-guest');
        });

        const connection = peer.lastConnection as FakeConnectionLike;

        act(() => {
            connection.emit('open');
        });

        act(() => {
            currentResult?.sendState(createOnlineHostState(), 'TURN_SYNC', {
                leak: 'unsafe-replay-sync',
            } as never);
        });

        const syncState = connection.sent.find((message) => message.type === 'SYNC_STATE');

        expect(syncState).toMatchObject({
            version: NETWORK_PROTOCOL_VERSION,
            type: 'SYNC_STATE',
            reason: 'TURN_SYNC',
        });
        if (syncState?.type !== 'SYNC_STATE') {
            throw new Error('Expected SYNC_STATE payload.');
        }

        expect(syncState.snapshot.isHost).toBe(false);
        expect(syncState.snapshot.localPlayer).toBe('p2');
        expect(isHiddenReservedCard(syncState.snapshot.playerReserved.p1[0])).toBe(true);
        expect((syncState.snapshot.playerReserved.p2[0] as Card | undefined)?.id).toBe(
            'guest-own-reserved'
        );
        expect(JSON.stringify(syncState.snapshot)).not.toContain('host-private-reserved');
        const hiddenReserved = JSON.stringify(syncState.snapshot.playerReserved.p1[0]);
        expect(hiddenReserved).not.toContain('steal');
        expect(hiddenReserved).not.toContain('bonusColor');
        expect(hiddenReserved).not.toContain('cost');
        expect(hiddenReserved).not.toContain('points');
        expect(syncState).not.toHaveProperty('replaySync');
        expect(JSON.stringify(syncState)).not.toContain('unsafe-replay-sync');
    });
});
