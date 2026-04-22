// @vitest-environment node

import crypto from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    createLanDiscoveryService,
    isPrivateLanAddress,
    LAN_DISCOVERY_CONSTANTS,
} from '../lanDiscoveryService.js';

type MessageListener = (message: Buffer, remoteInfo: { address: string }) => void;
type TestEvent = { type: string; [key: string]: unknown };

const HOST_INSTANCE_ID = '11111111-1111-1111-1111-111111111111';
const GUEST_INSTANCE_ID = '99999999-9999-9999-9999-999999999999';
const ROOM_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class FakeUdpBus {
    sockets = new Set<FakeSocket>();

    register(socket: FakeSocket) {
        this.sockets.add(socket);
    }

    unregister(socket: FakeSocket) {
        this.sockets.delete(socket);
    }

    deliver(sender: FakeSocket, payload: Buffer, port: number) {
        for (const socket of this.sockets) {
            if (socket === sender || socket.boundPort !== port) {
                continue;
            }

            socket.emit('message', Buffer.from(payload), {
                address: sender.address,
            });
        }
    }
}

class FakeSocket {
    boundPort: number | null = null;
    private listeners = new Map<string, MessageListener[]>();

    constructor(
        private readonly bus: FakeUdpBus,
        readonly address: string
    ) {}

    on(event: string, listener: MessageListener) {
        const existing = this.listeners.get(event) ?? [];
        existing.push(listener);
        this.listeners.set(event, existing);
        return this;
    }

    bind(port: number, callback?: () => void) {
        this.boundPort = port;
        this.bus.register(this);
        callback?.();
        return this;
    }

    setBroadcast() {
        return undefined;
    }

    send(payload: Buffer, port: number) {
        this.bus.deliver(this, payload, port);
        return undefined;
    }

    close() {
        this.bus.unregister(this);
        return undefined;
    }

    emit(event: string, ...args: Parameters<MessageListener>) {
        for (const listener of this.listeners.get(event) ?? []) {
            listener(...args);
        }
    }
}

const createDgramModule = (bus: FakeUdpBus, address: string) =>
    ({
        createSocket: () => new FakeSocket(bus, address),
    }) as unknown as typeof import('node:dgram');

const createNetworkInterfaces = (address: string) => () => ({
    ethernet: [
        {
            family: 'IPv4',
            internal: false,
            address,
        },
    ],
});

const createLogger = () =>
    ({
        warn: vi.fn(),
        error: vi.fn(),
    }) as unknown as Console;

const createService = (options: unknown) =>
    createLanDiscoveryService(options as Parameters<typeof createLanDiscoveryService>[0]);

describe('lanDiscoveryService', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('recognizes private LAN ranges including 172.16/12', () => {
        expect(isPrivateLanAddress('127.0.0.1')).toBe(true);
        expect(isPrivateLanAddress('10.0.0.42')).toBe(true);
        expect(isPrivateLanAddress('192.168.1.7')).toBe(true);
        expect(isPrivateLanAddress('172.16.9.1')).toBe(true);
        expect(isPrivateLanAddress('172.31.255.10')).toBe(true);
        expect(isPrivateLanAddress('172.32.0.1')).toBe(false);
        expect(isPrivateLanAddress('8.8.8.8')).toBe(false);
    });

    it('pairs searching peers, randomizes seats independently from the transport host, and launches after P1 starts', () => {
        const bus = new FakeUdpBus();
        const hostEvents: Array<{ type: string; [key: string]: unknown }> = [];
        const guestEvents: Array<{ type: string; [key: string]: unknown }> = [];
        const randomUuidSpy = vi.spyOn(crypto, 'randomUUID');
        const randomBytesSpy = vi.spyOn(crypto, 'randomBytes');

        randomUuidSpy
            .mockReturnValueOnce(HOST_INSTANCE_ID)
            .mockReturnValueOnce(GUEST_INSTANCE_ID)
            .mockReturnValueOnce(ROOM_ID);
        randomBytesSpy
            .mockImplementationOnce((() =>
                Buffer.from('aaaa', 'hex')) as unknown as typeof crypto.randomBytes)
            .mockImplementationOnce((() =>
                Buffer.from('1111', 'hex')) as unknown as typeof crypto.randomBytes);

        const hostService = createService({
            appVersion: '5.2.11',
            dgramModule: createDgramModule(bus, '192.168.1.10'),
            logger: createLogger(),
            networkInterfaces: createNetworkInterfaces('192.168.1.10'),
            onEvent: ((event: TestEvent) => {
                hostEvents.push(event as TestEvent);
            }) as unknown as () => undefined,
        });
        const guestService = createService({
            appVersion: '5.2.11',
            dgramModule: createDgramModule(bus, '192.168.1.20'),
            logger: createLogger(),
            networkInterfaces: createNetworkInterfaces('192.168.1.20'),
            onEvent: ((event: TestEvent) => {
                guestEvents.push(event as TestEvent);
            }) as unknown as () => undefined,
        });

        hostService.start();
        guestService.start();

        hostService.startMatchmaking();
        guestService.startMatchmaking();

        expect(hostService.getState()).toMatchObject({
            phase: 'matched',
            roomId: ROOM_ID,
            remoteInstanceId: GUEST_INSTANCE_ID,
            remoteAddress: '192.168.1.20',
            transportHost: true,
            localSeat: 'p2',
            selectedMode: null,
        });
        expect(guestService.getState()).toMatchObject({
            phase: 'matched',
            roomId: ROOM_ID,
            remoteInstanceId: HOST_INSTANCE_ID,
            remoteAddress: '192.168.1.10',
            transportHost: false,
            localSeat: 'p1',
            selectedMode: null,
        });

        hostService.reportPeerReady({
            roomId: ROOM_ID,
            peerId: 'peer-host',
        });
        guestService.selectPregameMode({
            roomId: ROOM_ID,
            mode: 'roguelike',
        });

        expect(hostService.getState().selectedMode).toBe('roguelike');
        expect(guestService.getState().selectedMode).toBe('roguelike');

        guestService.confirmPregameStart({
            roomId: ROOM_ID,
        });

        const hostLaunch = hostEvents.find((event) => event.type === 'launch') as
            | {
                  launch?: {
                      transportHost: boolean;
                      targetIP: string;
                      hostPlayer: string;
                      mode: string;
                  };
              }
            | undefined;
        const guestLaunch = guestEvents.find((event) => event.type === 'launch') as
            | {
                  launch?: {
                      transportHost: boolean;
                      targetIP: string;
                      hostPlayer: string;
                      mode: string;
                  };
              }
            | undefined;

        expect(hostLaunch?.launch).toMatchObject({
            transportHost: true,
            targetIP: 'localhost',
            hostPlayer: 'p2',
            mode: 'roguelike',
        });
        expect(guestLaunch?.launch).toMatchObject({
            transportHost: false,
            targetIP: '192.168.1.10',
            hostPlayer: 'p2',
            mode: 'roguelike',
        });
        expect(hostService.getState().phase).toBe('starting');
        expect(guestService.getState().phase).toBe('starting');

        hostService.stop();
        guestService.stop();
    });

    it('ignores peers with a mismatched app version', () => {
        const bus = new FakeUdpBus();
        const randomUuidSpy = vi.spyOn(crypto, 'randomUUID');

        randomUuidSpy.mockReturnValueOnce(HOST_INSTANCE_ID).mockReturnValueOnce(GUEST_INSTANCE_ID);

        const hostService = createService({
            appVersion: '5.2.11',
            dgramModule: createDgramModule(bus, '192.168.1.10'),
            logger: createLogger(),
            networkInterfaces: createNetworkInterfaces('192.168.1.10'),
        });
        const guestService = createService({
            appVersion: '5.2.12',
            dgramModule: createDgramModule(bus, '192.168.1.20'),
            logger: createLogger(),
            networkInterfaces: createNetworkInterfaces('192.168.1.20'),
        });

        hostService.start();
        guestService.start();
        hostService.startMatchmaking();
        guestService.startMatchmaking();

        expect(hostService.getState().phase).toBe('searching');
        expect(guestService.getState().phase).toBe('searching');

        hostService.stop();
        guestService.stop();
    });

    it('lets a transport-host P1 select a mode locally, mirror it by heartbeat, and wait for peer readiness before launch', () => {
        const bus = new FakeUdpBus();
        const hostEvents: TestEvent[] = [];
        const guestEvents: TestEvent[] = [];
        const randomUuidSpy = vi.spyOn(crypto, 'randomUUID');
        const randomBytesSpy = vi.spyOn(crypto, 'randomBytes');

        randomUuidSpy
            .mockReturnValueOnce(HOST_INSTANCE_ID)
            .mockReturnValueOnce(GUEST_INSTANCE_ID)
            .mockReturnValueOnce(ROOM_ID);
        randomBytesSpy
            .mockImplementationOnce((() =>
                Buffer.from('aaaa', 'hex')) as unknown as typeof crypto.randomBytes)
            .mockImplementationOnce((() =>
                Buffer.from('bbbb', 'hex')) as unknown as typeof crypto.randomBytes);

        const hostService = createService({
            appVersion: '5.2.11',
            dgramModule: createDgramModule(bus, '192.168.1.10'),
            logger: createLogger(),
            networkInterfaces: createNetworkInterfaces('192.168.1.10'),
            onEvent: ((event: TestEvent) => {
                hostEvents.push(event);
            }) as unknown as () => undefined,
        });
        const guestService = createService({
            appVersion: '5.2.11',
            dgramModule: createDgramModule(bus, '192.168.1.20'),
            logger: createLogger(),
            networkInterfaces: createNetworkInterfaces('192.168.1.20'),
            onEvent: ((event: TestEvent) => {
                guestEvents.push(event);
            }) as unknown as () => undefined,
        });

        hostService.start();
        guestService.start();
        hostService.startMatchmaking();
        guestService.startMatchmaking();

        expect(hostService.getState().localSeat).toBe('p1');
        expect(guestService.getState().localSeat).toBe('p2');

        hostService.selectPregameMode({
            roomId: ROOM_ID,
            mode: 'classic',
        });
        expect(guestService.getState().selectedMode).toBeNull();

        vi.advanceTimersByTime(LAN_DISCOVERY_CONSTANTS.HEARTBEAT_INTERVAL_MS);

        expect(guestService.getState().selectedMode).toBe('classic');

        hostService.confirmPregameStart({
            roomId: ROOM_ID,
        });
        expect(hostService.getState()).toMatchObject({
            phase: 'matched',
            statusMessage: 'Preparing host transport...',
        });
        expect(hostEvents.find((event) => event.type === 'launch')).toBeUndefined();

        hostService.reportPeerReady({
            roomId: ROOM_ID,
            peerId: 'peer-host',
        });
        hostService.confirmPregameStart({
            roomId: ROOM_ID,
        });

        expect(hostEvents.find((event) => event.type === 'launch')).toBeDefined();
        expect(guestEvents.find((event) => event.type === 'launch')).toBeDefined();

        hostService.stop();
        guestService.stop();
    });

    it('fails closed when the discovery socket reports an error', () => {
        const bus = new FakeUdpBus();
        const randomUuidSpy = vi.spyOn(crypto, 'randomUUID');
        const logger = createLogger();

        randomUuidSpy.mockReturnValueOnce(HOST_INSTANCE_ID);

        const service = createService({
            appVersion: '5.2.11',
            dgramModule: createDgramModule(bus, '192.168.1.10'),
            logger,
            networkInterfaces: createNetworkInterfaces('192.168.1.10'),
        });

        service.start();
        const socket = Array.from(bus.sockets)[0];
        socket?.emit(
            'error',
            new Error('socket failed') as never,
            { address: '127.0.0.1' } as never
        );

        expect(service.getState()).toMatchObject({
            phase: 'error',
            errorMessage: 'LAN discovery failed to start.',
        });
        expect(logger.error).toHaveBeenCalled();

        service.stop();
    });

    it('guards invalid local pregame actions and ignores malformed discovery packets', () => {
        const bus = new FakeUdpBus();
        const randomUuidSpy = vi.spyOn(crypto, 'randomUUID');
        const randomBytesSpy = vi.spyOn(crypto, 'randomBytes');

        randomUuidSpy
            .mockReturnValueOnce(HOST_INSTANCE_ID)
            .mockReturnValueOnce(GUEST_INSTANCE_ID)
            .mockReturnValueOnce(ROOM_ID);
        randomBytesSpy
            .mockImplementationOnce((() =>
                Buffer.from('aaaa', 'hex')) as unknown as typeof crypto.randomBytes)
            .mockImplementationOnce((() =>
                Buffer.from('bbbb', 'hex')) as unknown as typeof crypto.randomBytes);

        const hostService = createService({
            appVersion: '5.2.11',
            dgramModule: createDgramModule(bus, '192.168.1.10'),
            logger: createLogger(),
            networkInterfaces: createNetworkInterfaces('192.168.1.10'),
        });
        const guestService = createService({
            appVersion: '5.2.11',
            dgramModule: createDgramModule(bus, '192.168.1.20'),
            logger: createLogger(),
            networkInterfaces: createNetworkInterfaces('192.168.1.20'),
        });

        hostService.start();
        guestService.start();
        hostService.startMatchmaking();
        guestService.startMatchmaking();

        expect(hostService.getState().localSeat).toBe('p1');
        expect(guestService.getState().localSeat).toBe('p2');

        hostService.reportPeerReady({
            roomId: 'wrong-room',
            peerId: 'peer-ignored',
        });
        expect(hostService.getState().hostPeerId).toBeNull();

        guestService.selectPregameMode({
            roomId: ROOM_ID,
            mode: 'classic',
        });
        expect(guestService.getState().errorMessage).toBe('Only P1 can choose the match mode.');

        guestService.confirmPregameStart({
            roomId: ROOM_ID,
        });
        expect(guestService.getState().errorMessage).toBe('Only P1 can start the LAN duel.');

        hostService.confirmPregameStart({
            roomId: ROOM_ID,
        });
        expect(hostService.getState().errorMessage).toBe(
            'Choose Classic or Roguelike before starting.'
        );

        const hostSocket = Array.from(bus.sockets).find(
            (socket) => socket.address === '192.168.1.10'
        );
        hostSocket?.emit('message', Buffer.from('{not-json'), {
            address: '192.168.1.99',
        });
        hostSocket?.emit(
            'message',
            Buffer.from(
                JSON.stringify({
                    kind: 'UNKNOWN',
                    protocolVersion: 1,
                    appVersion: '5.2.11',
                    instanceId: GUEST_INSTANCE_ID,
                })
            ),
            {
                address: '192.168.1.99',
            }
        );

        expect(hostService.getState().phase).toBe('matched');

        hostService.stop();
        guestService.stop();
    });

    it('supports pre-start search state, duplicate starts, and matched-room cancellation', () => {
        const bus = new FakeUdpBus();
        const randomUuidSpy = vi.spyOn(crypto, 'randomUUID');
        const randomBytesSpy = vi.spyOn(crypto, 'randomBytes');

        randomUuidSpy
            .mockReturnValueOnce(HOST_INSTANCE_ID)
            .mockReturnValueOnce(GUEST_INSTANCE_ID)
            .mockReturnValueOnce(ROOM_ID);
        randomBytesSpy
            .mockImplementationOnce((() =>
                Buffer.from('1111', 'hex')) as unknown as typeof crypto.randomBytes)
            .mockImplementationOnce((() =>
                Buffer.from('2222', 'hex')) as unknown as typeof crypto.randomBytes);

        const hostService = createService({
            appVersion: '5.2.11',
            dgramModule: createDgramModule(bus, '192.168.1.10'),
            logger: createLogger(),
            networkInterfaces: createNetworkInterfaces('192.168.1.10'),
        });
        const guestService = createService({
            appVersion: '5.2.11',
            dgramModule: createDgramModule(bus, '192.168.1.20'),
            logger: createLogger(),
            networkInterfaces: createNetworkInterfaces('192.168.1.20'),
        });

        expect(hostService.startMatchmaking()).toMatchObject({
            phase: 'searching',
            statusMessage: 'Searching for opponent on local network...',
        });

        hostService.start();
        hostService.start();
        guestService.start();
        guestService.startMatchmaking();

        expect(hostService.getState().phase).toBe('matched');
        expect(guestService.getState().phase).toBe('matched');

        hostService.cancelMatchmaking();

        expect(hostService.getState()).toMatchObject({
            phase: 'idle',
            statusMessage: 'LAN duel is ready.',
        });
        expect(guestService.getState()).toMatchObject({
            phase: 'searching',
            statusMessage: 'Opponent left. Searching again...',
        });

        hostService.stop();
        guestService.stop();
    });

    it('returns the survivor to searching when the matched peer disappears', () => {
        const bus = new FakeUdpBus();
        const randomUuidSpy = vi.spyOn(crypto, 'randomUUID');
        const randomBytesSpy = vi.spyOn(crypto, 'randomBytes');

        randomUuidSpy
            .mockReturnValueOnce(HOST_INSTANCE_ID)
            .mockReturnValueOnce(GUEST_INSTANCE_ID)
            .mockReturnValueOnce(ROOM_ID);
        randomBytesSpy
            .mockImplementationOnce((() =>
                Buffer.from('1111', 'hex')) as unknown as typeof crypto.randomBytes)
            .mockImplementationOnce((() =>
                Buffer.from('2222', 'hex')) as unknown as typeof crypto.randomBytes);

        const hostService = createService({
            appVersion: '5.2.11',
            dgramModule: createDgramModule(bus, '192.168.1.10'),
            logger: createLogger(),
            networkInterfaces: createNetworkInterfaces('192.168.1.10'),
        });
        const guestService = createService({
            appVersion: '5.2.11',
            dgramModule: createDgramModule(bus, '192.168.1.20'),
            logger: createLogger(),
            networkInterfaces: createNetworkInterfaces('192.168.1.20'),
        });

        hostService.start();
        guestService.start();
        hostService.startMatchmaking();
        guestService.startMatchmaking();

        expect(hostService.getState().phase).toBe('matched');
        guestService.stop();

        vi.advanceTimersByTime(
            LAN_DISCOVERY_CONSTANTS.PEER_STALE_AFTER_MS +
                LAN_DISCOVERY_CONSTANTS.HEARTBEAT_INTERVAL_MS
        );

        expect(hostService.getState()).toMatchObject({
            phase: 'searching',
            statusMessage: 'Opponent disconnected. Searching again...',
        });

        hostService.stop();
    });
});
