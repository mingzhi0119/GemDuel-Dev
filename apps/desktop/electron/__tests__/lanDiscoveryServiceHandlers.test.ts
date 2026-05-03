// @vitest-environment node

import crypto from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LAN_DISCOVERY_PROTOCOL_VERSION, PEER_STALE_AFTER_MS } from '../lanDiscoveryProtocol.js';
import { createLanDiscoveryPacketHandlers } from '../lanDiscoveryServiceHandlers.js';

const LOCAL_INSTANCE_ID = '11111111-1111-1111-1111-111111111111';
const REMOTE_INSTANCE_ID = '99999999-9999-9999-9999-999999999999';
const ROOM_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

interface PacketHarnessOptions {
    roomSession?: Record<string, unknown> | null;
    wantsSearch?: boolean;
    hostSignalPort?: number;
    nowValue?: number;
}

const createPacketHarness = ({
    roomSession = null,
    wantsSearch = true,
    hostSignalPort = 9000,
    nowValue = 1000,
}: PacketHarnessOptions = {}) => {
    let currentRoomSession = roomSession as Record<string, unknown> | null;
    let currentWantsSearch = wantsSearch;
    const candidates = new Map();
    const emitted: unknown[] = [];
    const sentPackets: unknown[] = [];
    const resets: unknown[] = [];
    const handler = createLanDiscoveryPacketHandlers({
        appVersionString: '5.2.11',
        broadcastStartReady: vi.fn(),
        candidates,
        emit: (event: unknown) => emitted.push(event),
        emitState: vi.fn(),
        getHostSignalPort: () => hostSignalPort,
        getRoomSession: () => currentRoomSession,
        getWantsSearch: () => currentWantsSearch,
        instanceId: LOCAL_INSTANCE_ID,
        networkInterfaces: () => ({
            ethernet: [{ family: 'IPv4', internal: false, address: '192.168.1.10' }],
        }),
        now: () => nowValue,
        resetSession: (input: unknown) => {
            resets.push(input);
            return input;
        },
        sendPacket: (packet: unknown) => sentPackets.push(packet),
        setRoomSession: (nextSession: Record<string, unknown>) => {
            currentRoomSession = nextSession;
        },
    });

    return {
        candidates,
        emitted,
        getRoomSession: () => currentRoomSession,
        handler,
        resets,
        sentPackets,
        setWantsSearch: (value: boolean) => {
            currentWantsSearch = value;
        },
    };
};

const dispatchPacket = (
    handler: ReturnType<typeof createLanDiscoveryPacketHandlers>,
    packet: Record<string, unknown>,
    address = '192.168.1.20'
) => {
    handler.handleIncomingPacket(Buffer.from(JSON.stringify(packet)), { address });
};

describe('lan discovery packet handlers', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('creates host assignment packets using trusted private host addresses', () => {
        vi.spyOn(crypto, 'randomUUID').mockReturnValueOnce(ROOM_ID);
        vi.spyOn(crypto, 'randomBytes').mockImplementationOnce((() =>
            Buffer.from('aaaa', 'hex')) as unknown as typeof crypto.randomBytes);
        const harness = createPacketHarness({
            roomSession: { phase: 'searching' },
        });

        dispatchPacket(harness.handler, {
            kind: 'SEARCH',
            protocolVersion: LAN_DISCOVERY_PROTOCOL_VERSION,
            appVersion: '5.2.11',
            instanceId: REMOTE_INSTANCE_ID,
        });

        expect(harness.getRoomSession()).toMatchObject({
            phase: 'matched',
            remoteAddress: '192.168.1.20',
            hostAddress: '192.168.1.10',
            roomId: ROOM_ID,
            transportHost: true,
        });
        expect(harness.sentPackets[0]).toMatchObject({
            kind: 'MATCH_ASSIGN',
            roomId: ROOM_ID,
        });
    });

    it('ignores malformed, same-instance, and non-searchable packets', () => {
        const harness = createPacketHarness({
            roomSession: { phase: 'idle' },
            wantsSearch: false,
        });

        harness.handler.handleIncomingPacket(Buffer.from('{not-json'), {
            address: '192.168.1.20',
        });
        dispatchPacket(harness.handler, {
            kind: 'SEARCH',
            protocolVersion: LAN_DISCOVERY_PROTOCOL_VERSION,
            appVersion: '5.2.11',
            instanceId: LOCAL_INSTANCE_ID,
        });
        dispatchPacket(harness.handler, {
            kind: 'SEARCH',
            protocolVersion: LAN_DISCOVERY_PROTOCOL_VERSION + 1,
            appVersion: '5.2.11',
            instanceId: REMOTE_INSTANCE_ID,
        });
        dispatchPacket(harness.handler, {
            kind: 'SEARCH',
            protocolVersion: LAN_DISCOVERY_PROTOCOL_VERSION,
            appVersion: '5.2.11',
            instanceId: REMOTE_INSTANCE_ID,
        });

        expect(harness.sentPackets).toEqual([]);
        expect(harness.getRoomSession()).toMatchObject({ phase: 'idle' });
    });

    it('resets stale matched sessions to error when the user is not searching', () => {
        const harness = createPacketHarness({
            roomSession: {
                phase: 'matched',
                roomId: ROOM_ID,
                remoteLastSeenAt: 1,
            },
            wantsSearch: false,
            nowValue: PEER_STALE_AFTER_MS + 2,
        });

        harness.handler.tick({
            sendSearchHeartbeat: vi.fn(),
            sendSessionHeartbeat: vi.fn(),
        });

        expect(harness.resets).toContainEqual({
            phase: 'error',
            statusMessage: 'Opponent disconnected.',
            errorMessage: 'Opponent disconnected.',
        });
    });

    it('ignores unrelated cancel packets and resets matched rooms to idle on local cancel', () => {
        const harness = createPacketHarness({
            roomSession: {
                phase: 'matched',
                roomId: ROOM_ID,
                hostInstanceId: LOCAL_INSTANCE_ID,
                guestInstanceId: REMOTE_INSTANCE_ID,
                transportHost: true,
                hostNonce: 'host-nonce',
                guestNonce: 'guest-nonce',
            },
            wantsSearch: false,
        });

        dispatchPacket(harness.handler, {
            kind: 'CANCEL',
            protocolVersion: LAN_DISCOVERY_PROTOCOL_VERSION,
            appVersion: '5.2.11',
            instanceId: REMOTE_INSTANCE_ID,
            roomId: 'other-room',
        });
        expect(harness.resets).toEqual([]);

        dispatchPacket(harness.handler, {
            kind: 'CANCEL',
            protocolVersion: LAN_DISCOVERY_PROTOCOL_VERSION,
            appVersion: '5.2.11',
            instanceId: REMOTE_INSTANCE_ID,
            roomId: ROOM_ID,
            hostInstanceId: LOCAL_INSTANCE_ID,
            guestInstanceId: REMOTE_INSTANCE_ID,
            hostNonce: 'host-nonce',
            guestNonce: 'wrong-nonce',
        });
        expect(harness.resets).toEqual([]);

        dispatchPacket(harness.handler, {
            kind: 'CANCEL',
            protocolVersion: LAN_DISCOVERY_PROTOCOL_VERSION,
            appVersion: '5.2.11',
            instanceId: REMOTE_INSTANCE_ID,
            roomId: ROOM_ID,
            hostInstanceId: LOCAL_INSTANCE_ID,
            guestInstanceId: REMOTE_INSTANCE_ID,
            hostNonce: 'host-nonce',
            guestNonce: 'guest-nonce',
        });

        expect(harness.resets).toContainEqual({
            phase: 'idle',
            statusMessage: 'LAN duel is ready.',
        });
    });

    it('rejects forged start-ready packets before mutating launch state', () => {
        const roomSession = {
            phase: 'matched',
            roomId: ROOM_ID,
            hostInstanceId: REMOTE_INSTANCE_ID,
            guestInstanceId: LOCAL_INSTANCE_ID,
            transportHost: false,
            hostAddress: '192.168.1.20',
            hostPort: 9001,
            hostNonce: 'host-nonce',
            guestNonce: 'guest-nonce',
            localSeat: 'p1',
        };
        const harness = createPacketHarness({
            roomSession,
            wantsSearch: true,
        });

        dispatchPacket(harness.handler, {
            kind: 'START_READY',
            protocolVersion: LAN_DISCOVERY_PROTOCOL_VERSION,
            appVersion: '5.2.11',
            instanceId: REMOTE_INSTANCE_ID,
            roomId: ROOM_ID,
            hostInstanceId: REMOTE_INSTANCE_ID,
            guestInstanceId: LOCAL_INSTANCE_ID,
            hostNonce: 'host-nonce',
            guestNonce: 'stale-nonce',
            hostAddress: '192.168.1.20',
            hostPort: 9001,
            hostPeerId: 'peer-host',
            hostPlayer: 'p2',
            mode: 'classic',
        });

        expect(harness.emitted).toEqual([]);
        expect(harness.getRoomSession()).toMatchObject({
            phase: 'matched',
        });
        expect(harness.getRoomSession()?.selectedMode).toBeUndefined();

        dispatchPacket(harness.handler, {
            kind: 'START_READY',
            protocolVersion: LAN_DISCOVERY_PROTOCOL_VERSION,
            appVersion: '5.2.11',
            instanceId: REMOTE_INSTANCE_ID,
            roomId: ROOM_ID,
            hostInstanceId: REMOTE_INSTANCE_ID,
            guestInstanceId: LOCAL_INSTANCE_ID,
            hostNonce: 'host-nonce',
            guestNonce: 'guest-nonce',
            hostAddress: '203.0.113.10',
            hostPort: 9001,
            hostPeerId: 'peer-host',
            hostPlayer: 'p2',
            mode: 'classic',
        });

        expect(harness.emitted).toEqual([]);

        dispatchPacket(harness.handler, {
            kind: 'START_READY',
            protocolVersion: LAN_DISCOVERY_PROTOCOL_VERSION,
            appVersion: '5.2.11',
            instanceId: REMOTE_INSTANCE_ID,
            roomId: ROOM_ID,
            hostInstanceId: REMOTE_INSTANCE_ID,
            guestInstanceId: LOCAL_INSTANCE_ID,
            hostNonce: 'host-nonce',
            guestNonce: 'guest-nonce',
            hostAddress: '192.168.1.20',
            hostPort: 9001,
            hostPeerId: 'peer-host',
            hostPlayer: 'p2',
            mode: 'classic',
        });

        expect(harness.emitted).toContainEqual({
            type: 'launch',
            launch: expect.objectContaining({
                roomId: ROOM_ID,
                targetIP: '192.168.1.20',
                hostPeerId: 'peer-host',
                mode: 'classic',
            }),
        });
    });
});
