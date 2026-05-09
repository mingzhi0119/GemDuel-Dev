// @vitest-environment node

import { describe, expect, it } from 'vitest';
import {
    buildLanMatchState,
    createEmptyLanMatchState,
    deriveHostPlayer,
    isPrivateLanAddress,
    pickLanHostAddress,
} from '../lanDiscoveryProtocol.js';
import {
    applySeatAssignment,
    applySessionHeartbeat,
    buildLanCancelState,
    buildLanLaunch,
    createGuestRoomSession,
} from '../lanDiscoverySession.js';
import {
    applyIncomingStartReady,
    applyRemoteModeSelection,
    canHandleRemotePregamePacket,
    isRemotePlayerP1,
} from '../lanDiscoveryPregame.js';
import {
    createCancelPacket,
    createMatchAckPacket,
    createMatchAssignPacket,
    createSearchPacket,
    createSelectModePacket,
    createSessionHeartbeatPacket,
    createStartReadyPacket,
    createStartRequestPacket,
} from '../lanDiscoveryPackets.js';

const ROOM_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const HOST_INSTANCE_ID = '11111111-1111-1111-1111-111111111111';
const GUEST_INSTANCE_ID = '99999999-9999-9999-9999-999999999999';
const createIpv4Interface = (address: string) => ({
    family: 'IPv4' as const,
    internal: false,
    address,
    netmask: '255.255.255.0',
    mac: '00:11:22:33:44:55',
    cidr: `${address}/24`,
});

describe('lanDiscovery helpers', () => {
    it('derives deterministic seats and selects a private host address with loopback fallback', () => {
        expect(
            deriveHostPlayer({
                roomId: ROOM_ID,
                hostInstanceId: HOST_INSTANCE_ID,
                guestInstanceId: GUEST_INSTANCE_ID,
                hostNonce: 'aaaa',
                guestNonce: '1111',
            })
        ).toBe('p2');
        expect(
            pickLanHostAddress({
                ethernet: [createIpv4Interface('192.168.1.9')],
            })
        ).toBe('192.168.1.9');
        expect(
            pickLanHostAddress({
                wifi: [createIpv4Interface('8.8.8.8')],
            })
        ).toBe('127.0.0.1');
        expect(isPrivateLanAddress('172.20.10.5')).toBe(true);
    });

    it('builds LAN state snapshots with stable defaults', () => {
        expect(createEmptyLanMatchState()).toEqual({
            phase: 'idle',
            roomId: null,
            remoteInstanceId: null,
            remoteAddress: null,
            hostPort: null,
            transportHost: false,
            localSeat: null,
            selectedMode: null,
            hostPeerId: null,
            errorMessage: null,
            statusMessage: 'LAN duel is ready.',
        });
        expect(buildLanMatchState(null)).toEqual(createEmptyLanMatchState());
    });

    it('applies seat assignment, launches sessions, and derives cancel states', () => {
        const incompleteSession = {
            ...createEmptyLanMatchState(),
            roomId: ROOM_ID,
        };
        expect(applySeatAssignment(incompleteSession)).toBe(incompleteSession);

        const hostSession = {
            ...createEmptyLanMatchState(),
            roomId: ROOM_ID,
            hostInstanceId: HOST_INSTANCE_ID,
            guestInstanceId: GUEST_INSTANCE_ID,
            hostAddress: '192.168.1.10',
            hostNonce: 'aaaa',
            guestNonce: '1111',
            transportHost: true,
            phase: 'matched',
            hostPeerId: 'peer-host',
            hostPort: 9001,
        };

        applySeatAssignment(hostSession);
        expect(hostSession.localSeat).toBe('p2');
        expect(hostSession.statusMessage).toBe('Opponent matched. Randomized seats are ready.');
        expect(buildLanLaunch(hostSession, 'classic')).toMatchObject({
            roomId: ROOM_ID,
            targetIP: 'localhost',
            targetPort: 9001,
            hostPeerId: 'peer-host',
            transportHost: true,
            hostPlayer: 'p2',
            mode: 'classic',
        });

        const guestLaunchSession = {
            ...hostSession,
            transportHost: false,
        };
        expect(buildLanLaunch(guestLaunchSession, 'roguelike')).toMatchObject({
            targetIP: '192.168.1.10',
            transportHost: false,
            mode: 'roguelike',
        });

        hostSession.phase = 'starting';
        applySeatAssignment(hostSession);
        expect(hostSession.statusMessage).toBe('Connecting LAN duel...');

        expect(buildLanLaunch({ roomId: ROOM_ID }, 'classic')).toBeNull();
        expect(buildLanCancelState({ wantsSearch: true })).toMatchObject({
            phase: 'searching',
        });
        expect(buildLanCancelState({ wantsSearch: false })).toMatchObject({
            phase: 'idle',
        });
    });

    it('creates guest sessions and applies matching heartbeats only to the active room', () => {
        const guestSession = createGuestRoomSession({
            address: '192.168.1.10',
            guestNonce: '1111',
            now: 99,
            packet: {
                roomId: ROOM_ID,
                hostInstanceId: HOST_INSTANCE_ID,
                guestInstanceId: GUEST_INSTANCE_ID,
                hostAddress: '192.168.1.10',
                hostPort: 9001,
                hostNonce: 'aaaa',
            },
        });

        expect(guestSession.transportHost).toBe(false);
        expect(guestSession.remoteAddress).toBe('192.168.1.10');

        const addressFallbackSession = createGuestRoomSession({
            address: '192.168.1.11',
            guestNonce: '2222',
            now: 100,
            packet: {
                roomId: ROOM_ID,
                hostInstanceId: HOST_INSTANCE_ID,
                guestInstanceId: GUEST_INSTANCE_ID,
                hostPort: 9001,
                hostNonce: 'aaaa',
            },
        });
        expect(addressFallbackSession.hostAddress).toBe('192.168.1.11');

        expect(
            applySessionHeartbeat({
                address: '192.168.1.10',
                nowValue: 100,
                packet: {
                    roomId: 'wrong-room',
                    hostInstanceId: HOST_INSTANCE_ID,
                    guestInstanceId: GUEST_INSTANCE_ID,
                    hostAddress: '192.168.1.10',
                    hostNonce: 'aaaa',
                },
                roomSession: guestSession,
            })
        ).toBe(false);

        expect(
            applySessionHeartbeat({
                address: '192.168.1.10',
                nowValue: 100,
                packet: {
                    roomId: ROOM_ID,
                    hostInstanceId: 'wrong-host',
                    guestInstanceId: GUEST_INSTANCE_ID,
                    hostAddress: '192.168.1.10',
                    hostNonce: 'aaaa',
                },
                roomSession: guestSession,
            })
        ).toBe(false);

        expect(
            applySessionHeartbeat({
                address: '192.168.1.10',
                nowValue: 101,
                packet: {
                    roomId: ROOM_ID,
                    hostInstanceId: HOST_INSTANCE_ID,
                    guestInstanceId: GUEST_INSTANCE_ID,
                    hostAddress: '192.168.1.10',
                    hostNonce: 'aaaa',
                    guestNonce: '1111',
                    hostPeerId: 'peer-host',
                    hostPlayer: 'p2',
                    hostPort: 9001,
                    selectedMode: 'roguelike',
                },
                roomSession: guestSession,
            })
        ).toBe(true);

        expect(guestSession).toMatchObject({
            hostPeerId: 'peer-host',
            hostPlayer: 'p2',
            localSeat: 'p1',
            selectedMode: 'roguelike',
            remoteLastSeenAt: 101,
            hostPort: 9001,
        });
    });

    it('guards remote pregame packets and syncs start-ready launches', () => {
        const hostRoom = {
            ...createEmptyLanMatchState(),
            roomId: ROOM_ID,
            hostInstanceId: HOST_INSTANCE_ID,
            guestInstanceId: GUEST_INSTANCE_ID,
            transportHost: true,
            hostPlayer: 'p2',
            hostAddress: '192.168.1.10',
            hostNonce: 'aaaa',
            guestNonce: '1111',
        };

        expect(
            canHandleRemotePregamePacket(hostRoom, {
                roomId: ROOM_ID,
                instanceId: GUEST_INSTANCE_ID,
                hostInstanceId: HOST_INSTANCE_ID,
                guestInstanceId: GUEST_INSTANCE_ID,
                hostNonce: 'aaaa',
                guestNonce: '1111',
            })
        ).toBe(true);
        expect(
            canHandleRemotePregamePacket(hostRoom, {
                roomId: 'wrong-room',
                instanceId: GUEST_INSTANCE_ID,
                hostInstanceId: HOST_INSTANCE_ID,
                guestInstanceId: GUEST_INSTANCE_ID,
                hostNonce: 'aaaa',
                guestNonce: '1111',
            })
        ).toBe(false);
        expect(
            canHandleRemotePregamePacket(hostRoom, {
                roomId: ROOM_ID,
                instanceId: GUEST_INSTANCE_ID,
                hostInstanceId: HOST_INSTANCE_ID,
                guestInstanceId: GUEST_INSTANCE_ID,
                hostNonce: 'aaaa',
                guestNonce: 'stale',
            })
        ).toBe(false);
        expect(isRemotePlayerP1(hostRoom)).toBe(true);
        expect(applyRemoteModeSelection(hostRoom, 'classic').selectedMode).toBe('classic');
        expect(applyIncomingStartReady(hostRoom, { roomId: 'wrong-room' })).toBeNull();

        const guestRoom = {
            ...createEmptyLanMatchState(),
            roomId: ROOM_ID,
            hostInstanceId: HOST_INSTANCE_ID,
            guestInstanceId: GUEST_INSTANCE_ID,
            transportHost: false,
            hostAddress: '192.168.1.10',
            hostNonce: 'aaaa',
            guestNonce: '1111',
        };

        expect(
            applyIncomingStartReady(guestRoom, {
                roomId: ROOM_ID,
                instanceId: HOST_INSTANCE_ID,
                hostInstanceId: HOST_INSTANCE_ID,
                guestInstanceId: GUEST_INSTANCE_ID,
                hostNonce: 'aaaa',
                guestNonce: 'stale',
                hostAddress: '192.168.1.10',
                hostPeerId: 'peer-host',
                hostPlayer: 'p2',
                hostPort: 9001,
                mode: 'roguelike',
            })
        ).toBeNull();

        expect(
            applyIncomingStartReady(guestRoom, {
                roomId: ROOM_ID,
                instanceId: HOST_INSTANCE_ID,
                hostInstanceId: HOST_INSTANCE_ID,
                guestInstanceId: GUEST_INSTANCE_ID,
                hostNonce: 'aaaa',
                guestNonce: '1111',
                hostAddress: '192.168.1.10',
                hostPeerId: 'peer-host',
                hostPlayer: 'p2',
                hostPort: 9001,
                mode: 'roguelike',
            })
        ).toMatchObject({
            roomId: ROOM_ID,
            targetIP: '192.168.1.10',
            targetPort: 9001,
            hostPeerId: 'peer-host',
            hostPlayer: 'p2',
            mode: 'roguelike',
        });
    });

    it('builds LAN discovery packets while omitting optional fields until they exist', () => {
        const roomSession = {
            roomId: ROOM_ID,
            hostInstanceId: HOST_INSTANCE_ID,
            guestInstanceId: GUEST_INSTANCE_ID,
            hostAddress: '192.168.1.10',
            hostPort: 9001,
            hostNonce: 'aaaa',
            guestNonce: '1111',
        };

        expect(
            createSearchPacket({
                appVersion: '5.2.11',
                instanceId: HOST_INSTANCE_ID,
            })
        ).toMatchObject({
            kind: 'SEARCH',
            appVersion: '5.2.11',
            instanceId: HOST_INSTANCE_ID,
        });
        expect(
            createMatchAssignPacket({
                appVersion: '5.2.11',
                instanceId: HOST_INSTANCE_ID,
                roomSession,
            })
        ).toMatchObject({
            kind: 'MATCH_ASSIGN',
            roomId: ROOM_ID,
            hostPort: 9001,
        });
        expect(
            createMatchAckPacket({
                appVersion: '5.2.11',
                instanceId: GUEST_INSTANCE_ID,
                roomSession,
            })
        ).toMatchObject({
            kind: 'MATCH_ACK',
            hostNonce: 'aaaa',
            guestNonce: '1111',
        });

        const heartbeat = createSessionHeartbeatPacket({
            appVersion: '5.2.11',
            instanceId: HOST_INSTANCE_ID,
            roomSession,
        });
        expect(heartbeat).not.toHaveProperty('hostPlayer');
        expect(heartbeat).not.toHaveProperty('hostPeerId');
        expect(heartbeat).not.toHaveProperty('selectedMode');
        expect(heartbeat).toMatchObject({
            hostPort: 9001,
        });

        expect(
            createSelectModePacket({
                appVersion: '5.2.11',
                instanceId: GUEST_INSTANCE_ID,
                mode: 'classic',
                roomSession,
            })
        ).toMatchObject({
            kind: 'SELECT_MODE',
            hostNonce: 'aaaa',
            guestNonce: '1111',
            mode: 'classic',
        });
        expect(
            createStartRequestPacket({
                appVersion: '5.2.11',
                instanceId: GUEST_INSTANCE_ID,
                roomSession,
            })
        ).toMatchObject({
            kind: 'START_REQUEST',
            roomId: ROOM_ID,
            hostNonce: 'aaaa',
            guestNonce: '1111',
        });
        expect(
            createStartReadyPacket({
                appVersion: '5.2.11',
                instanceId: HOST_INSTANCE_ID,
                mode: 'roguelike',
                roomSession: {
                    ...roomSession,
                    hostPeerId: 'peer-host',
                    hostPlayer: 'p2',
                },
            })
        ).toMatchObject({
            kind: 'START_READY',
            hostNonce: 'aaaa',
            guestNonce: '1111',
            hostPeerId: 'peer-host',
            hostPlayer: 'p2',
            hostPort: 9001,
            mode: 'roguelike',
        });

        const cancelPacket = createCancelPacket({
            appVersion: '5.2.11',
            instanceId: HOST_INSTANCE_ID,
            roomSession,
        });
        expect(cancelPacket).toMatchObject({
            hostInstanceId: HOST_INSTANCE_ID,
            guestInstanceId: GUEST_INSTANCE_ID,
            hostNonce: 'aaaa',
            guestNonce: '1111',
        });
    });
});
