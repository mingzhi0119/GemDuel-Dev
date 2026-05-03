import crypto from 'node:crypto';
import { z } from 'zod';
import {
    isPrivateLanAddress,
    LAN_DISCOVERY_PROTOCOL_VERSION,
    PEER_STALE_AFTER_MS,
    pickLanHostAddress,
} from './lanDiscoveryProtocol.js';
import {
    applySeatAssignment,
    applySessionHeartbeat,
    createGuestRoomSession,
    createHostRoomSession,
} from './lanDiscoverySession.js';
import {
    applyIncomingStartReady,
    applyRemoteModeSelection,
    canHandleRemotePregamePacket,
    isRemotePlayerP1,
} from './lanDiscoveryPregame.js';
import { createMatchAckPacket, createMatchAssignPacket } from './lanDiscoveryPackets.js';

const NON_EMPTY_STRING = z.string().min(1);
const LAN_MODE_SCHEMA = z.enum(['classic', 'roguelike']);
const LAN_PLAYER_SCHEMA = z.enum(['p1', 'p2']);
const LAN_HOST_PORT_SCHEMA = z.number().int().min(1).max(65535);
const LAN_HOST_ADDRESS_SCHEMA = z.string().refine((address) => isPrivateLanAddress(address));

const createLanPacketSchema = (kind, shape) =>
    z
        .object({
            kind: z.literal(kind),
            protocolVersion: z.literal(LAN_DISCOVERY_PROTOCOL_VERSION),
            appVersion: NON_EMPTY_STRING,
            instanceId: NON_EMPTY_STRING,
            ...shape,
        })
        .strict();

const roomBindingShape = {
    roomId: NON_EMPTY_STRING,
    hostInstanceId: NON_EMPTY_STRING,
    guestInstanceId: NON_EMPTY_STRING,
};

const nonceBindingShape = {
    ...roomBindingShape,
    hostNonce: NON_EMPTY_STRING,
    guestNonce: NON_EMPTY_STRING,
};

const LAN_PACKET_SCHEMA = z.discriminatedUnion('kind', [
    createLanPacketSchema('SEARCH', {}),
    createLanPacketSchema('MATCH_ASSIGN', {
        ...roomBindingShape,
        hostAddress: LAN_HOST_ADDRESS_SCHEMA,
        hostPort: LAN_HOST_PORT_SCHEMA,
        hostNonce: NON_EMPTY_STRING,
    }),
    createLanPacketSchema('MATCH_ACK', {
        ...roomBindingShape,
        hostNonce: NON_EMPTY_STRING,
        guestNonce: NON_EMPTY_STRING,
    }),
    createLanPacketSchema('SESSION_HEARTBEAT', {
        ...roomBindingShape,
        hostAddress: LAN_HOST_ADDRESS_SCHEMA,
        hostPort: LAN_HOST_PORT_SCHEMA,
        hostNonce: NON_EMPTY_STRING,
        guestNonce: NON_EMPTY_STRING.optional(),
        hostPlayer: LAN_PLAYER_SCHEMA.optional(),
        hostPeerId: NON_EMPTY_STRING.optional(),
        selectedMode: LAN_MODE_SCHEMA.optional(),
    }),
    createLanPacketSchema('SELECT_MODE', {
        ...nonceBindingShape,
        mode: LAN_MODE_SCHEMA,
    }),
    createLanPacketSchema('START_REQUEST', {
        ...nonceBindingShape,
    }),
    createLanPacketSchema('START_READY', {
        ...nonceBindingShape,
        hostAddress: LAN_HOST_ADDRESS_SCHEMA,
        hostPort: LAN_HOST_PORT_SCHEMA,
        hostPeerId: NON_EMPTY_STRING,
        hostPlayer: LAN_PLAYER_SCHEMA,
        mode: LAN_MODE_SCHEMA,
    }),
    createLanPacketSchema('CANCEL', {
        ...nonceBindingShape,
    }),
]);

export const createLanDiscoveryPacketHandlers = ({
    appVersionString,
    broadcastStartReady,
    candidates,
    emit,
    emitState,
    getHostSignalPort,
    getRoomSession,
    getWantsSearch,
    instanceId,
    networkInterfaces,
    now,
    resetSession,
    sendPacket,
    setRoomSession,
}) => {
    const handlePeerStale = () => {
        const roomSession = getRoomSession();
        if (
            !roomSession?.remoteLastSeenAt ||
            now() - roomSession.remoteLastSeenAt <= PEER_STALE_AFTER_MS
        ) {
            return;
        }
        const wantsSearch = getWantsSearch();
        resetSession({
            phase: wantsSearch ? 'searching' : 'error',
            statusMessage: wantsSearch
                ? 'Opponent disconnected. Searching again...'
                : 'Opponent disconnected.',
            errorMessage: wantsSearch ? null : 'Opponent disconnected.',
        });
    };

    const handleSearchPacket = (packet, address) => {
        const hostPort = getHostSignalPort();
        candidates.set(packet.instanceId, { address, lastSeenAt: now() });
        const roomSession = getRoomSession();
        if (
            !getWantsSearch() ||
            roomSession?.phase !== 'searching' ||
            instanceId >= packet.instanceId ||
            !hostPort
        ) {
            return;
        }

        const nextSession = createHostRoomSession({
            candidateAddress: address,
            candidateId: packet.instanceId,
            hostAddress: pickLanHostAddress(networkInterfaces?.()),
            hostPort,
            hostNonce: crypto.randomBytes(8).toString('hex'),
            instanceId,
            now: now(),
            roomId: crypto.randomUUID(),
        });
        setRoomSession(nextSession);
        emitState();
        sendPacket(
            createMatchAssignPacket({
                appVersion: appVersionString,
                instanceId,
                roomSession: nextSession,
            })
        );
    };

    const handleMatchAssignPacket = (packet, address) => {
        const roomSession = getRoomSession();
        if (
            !getWantsSearch() ||
            roomSession?.phase !== 'searching' ||
            packet.hostInstanceId !== packet.instanceId ||
            packet.guestInstanceId !== instanceId
        ) {
            return;
        }

        const nextSession = createGuestRoomSession({
            address,
            guestNonce: crypto.randomBytes(8).toString('hex'),
            instanceId,
            now: now(),
            packet,
        });
        setRoomSession(nextSession);
        sendPacket(
            createMatchAckPacket({
                appVersion: appVersionString,
                instanceId,
                roomSession: nextSession,
            })
        );
        applySeatAssignment(nextSession);
        emitState();
    };

    const handleMatchAckPacket = (packet, address) => {
        const roomSession = getRoomSession();
        if (
            !roomSession?.transportHost ||
            roomSession.roomId !== packet.roomId ||
            packet.hostInstanceId !== instanceId ||
            packet.guestInstanceId !== roomSession.guestInstanceId ||
            packet.guestInstanceId !== packet.instanceId ||
            packet.hostNonce !== roomSession.hostNonce
        ) {
            return;
        }

        roomSession.remoteAddress = address;
        roomSession.remoteLastSeenAt = now();
        roomSession.guestNonce = packet.guestNonce;
        applySeatAssignment(roomSession);
        emitState();
    };

    const handleSessionHeartbeatPacket = (packet, address) => {
        if (
            !applySessionHeartbeat({
                address,
                nowValue: now(),
                packet,
                roomSession: getRoomSession(),
            })
        ) {
            return;
        }
        emitState();
    };

    const handleSelectModePacket = (packet) => {
        const roomSession = getRoomSession();
        if (!canHandleRemotePregamePacket(roomSession, packet) || !isRemotePlayerP1(roomSession)) {
            return;
        }
        applyRemoteModeSelection(roomSession, packet.mode);
        emitState();
    };

    const handleStartRequestPacket = (packet) => {
        const roomSession = getRoomSession();
        if (!canHandleRemotePregamePacket(roomSession, packet) || !isRemotePlayerP1(roomSession)) {
            return;
        }
        if (!roomSession.selectedMode || !roomSession.hostPeerId) {
            roomSession.statusMessage = 'Waiting for transport host to finish setup...';
            emitState();
            return;
        }
        broadcastStartReady(roomSession.selectedMode);
    };

    const handleStartReadyPacket = (packet) => {
        const launch = applyIncomingStartReady(getRoomSession(), packet);
        if (!launch) {
            return;
        }
        emitState();
        emit({ type: 'launch', launch });
    };

    const handleCancelPacket = (packet) => {
        const roomSession = getRoomSession();
        if (!roomSession?.roomId) {
            return;
        }
        const expectedRemoteInstanceId = roomSession.transportHost
            ? roomSession.guestInstanceId
            : roomSession.hostInstanceId;
        const targetsLocal =
            roomSession.roomId === packet.roomId &&
            packet.hostInstanceId === roomSession.hostInstanceId &&
            packet.guestInstanceId === roomSession.guestInstanceId &&
            packet.hostNonce === roomSession.hostNonce &&
            packet.guestNonce === roomSession.guestNonce &&
            packet.instanceId === expectedRemoteInstanceId;
        if (!targetsLocal) {
            return;
        }
        resetSession({
            phase: getWantsSearch() ? 'searching' : 'idle',
            statusMessage: getWantsSearch()
                ? 'Opponent left. Searching again...'
                : 'LAN duel is ready.',
        });
    };

    const handleIncomingPacket = (message, remoteInfo) => {
        let rawPacket;
        try {
            rawPacket = JSON.parse(message.toString());
        } catch {
            return;
        }

        const parsedPacket = LAN_PACKET_SCHEMA.safeParse(rawPacket);
        if (!parsedPacket.success) {
            return;
        }

        const packet = parsedPacket.data;
        if (
            !packet ||
            typeof packet !== 'object' ||
            packet.appVersion !== appVersionString ||
            packet.instanceId === instanceId
        ) {
            return;
        }
        const address =
            typeof packet.hostAddress === 'string' && isPrivateLanAddress(packet.hostAddress)
                ? packet.hostAddress
                : remoteInfo.address;

        switch (packet.kind) {
            case 'SEARCH':
                handleSearchPacket(packet, address);
                break;
            case 'MATCH_ASSIGN':
                handleMatchAssignPacket(packet, address);
                break;
            case 'MATCH_ACK':
                handleMatchAckPacket(packet, address);
                break;
            case 'SESSION_HEARTBEAT':
                handleSessionHeartbeatPacket(packet, address);
                break;
            case 'SELECT_MODE':
                handleSelectModePacket(packet);
                break;
            case 'START_REQUEST':
                handleStartRequestPacket(packet);
                break;
            case 'START_READY':
                handleStartReadyPacket(packet);
                break;
            case 'CANCEL':
                handleCancelPacket(packet);
                break;
        }
    };

    const tick = ({ sendSearchHeartbeat, sendSessionHeartbeat }) => {
        const nowValue = now();
        for (const [candidateId, candidate] of candidates) {
            if (nowValue - candidate.lastSeenAt > PEER_STALE_AFTER_MS) {
                candidates.delete(candidateId);
            }
        }

        const roomSession = getRoomSession();
        if (getWantsSearch() && roomSession?.phase === 'searching') {
            sendSearchHeartbeat();
        } else if (roomSession?.phase === 'matched' || roomSession?.phase === 'starting') {
            sendSessionHeartbeat();
        }

        handlePeerStale();
    };

    return {
        handleIncomingPacket,
        tick,
    };
};
