import crypto from 'node:crypto';
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
            packet.guestInstanceId !== roomSession.guestInstanceId
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
        const targetsLocal =
            !packet.hostInstanceId ||
            packet.hostInstanceId === roomSession.hostInstanceId ||
            packet.guestInstanceId === roomSession.guestInstanceId;
        if (roomSession.roomId !== packet.roomId || !targetsLocal) {
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
        let packet;
        try {
            packet = JSON.parse(message.toString());
        } catch {
            return;
        }
        if (
            !packet ||
            typeof packet !== 'object' ||
            packet.protocolVersion !== LAN_DISCOVERY_PROTOCOL_VERSION ||
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
