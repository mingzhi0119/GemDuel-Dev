import {
    buildLanMatchState,
    createEmptyLanMatchState,
    deriveHostPlayer,
    getOpposingPlayer,
} from './lanDiscoveryProtocol.js';

export const applySeatAssignment = (roomSession) => {
    if (!roomSession?.hostNonce || !roomSession.guestNonce) {
        return roomSession;
    }

    roomSession.hostPlayer = deriveHostPlayer({
        roomId: roomSession.roomId,
        hostInstanceId: roomSession.hostInstanceId,
        guestInstanceId: roomSession.guestInstanceId,
        hostNonce: roomSession.hostNonce,
        guestNonce: roomSession.guestNonce,
    });
    roomSession.localSeat = roomSession.transportHost
        ? roomSession.hostPlayer
        : getOpposingPlayer(roomSession.hostPlayer);
    roomSession.statusMessage =
        roomSession.phase === 'starting'
            ? 'Connecting LAN duel...'
            : 'Opponent matched. Randomized seats are ready.';

    return roomSession;
};

export const buildLanLaunch = (roomSession, mode) => {
    if (
        !roomSession?.roomId ||
        !roomSession.hostPeerId ||
        !roomSession.hostPlayer ||
        !roomSession.hostPort
    ) {
        return null;
    }

    return {
        roomId: roomSession.roomId,
        targetIP: roomSession.transportHost ? 'localhost' : roomSession.hostAddress,
        targetPort: roomSession.hostPort,
        hostPeerId: roomSession.hostPeerId,
        transportHost: roomSession.transportHost,
        hostPlayer: roomSession.hostPlayer,
        mode,
    };
};

export const createHostRoomSession = ({
    candidateAddress,
    candidateId,
    hostAddress,
    hostPort,
    hostNonce,
    instanceId,
    now,
    roomId,
}) => ({
    ...createEmptyLanMatchState(),
    phase: 'matched',
    roomId,
    hostInstanceId: instanceId,
    guestInstanceId: candidateId,
    remoteInstanceId: candidateId,
    remoteAddress: candidateAddress,
    transportHost: true,
    hostAddress,
    hostPort,
    hostNonce,
    guestNonce: null,
    hostPlayer: null,
    remoteLastSeenAt: now,
    selectedMode: null,
    statusMessage: 'Opponent found. Waiting for seat draw...',
});

export const createGuestRoomSession = ({ address, guestNonce, now, packet }) => {
    const hostAddress = packet.hostAddress || address;

    return {
        ...createEmptyLanMatchState(),
        phase: 'matched',
        roomId: packet.roomId,
        hostInstanceId: packet.hostInstanceId,
        guestInstanceId: packet.guestInstanceId,
        remoteInstanceId: packet.hostInstanceId,
        remoteAddress: hostAddress,
        transportHost: false,
        hostAddress,
        hostPort: packet.hostPort,
        hostNonce: packet.hostNonce,
        guestNonce,
        hostPlayer: null,
        remoteLastSeenAt: now,
        selectedMode: null,
        statusMessage: 'Opponent found. Waiting for seat draw...',
    };
};

export const applySessionHeartbeat = ({ address, nowValue, packet, roomSession }) => {
    if (!roomSession?.roomId || roomSession.roomId !== packet.roomId) {
        return false;
    }

    const belongsToSession =
        packet.hostInstanceId === roomSession.hostInstanceId &&
        packet.guestInstanceId === roomSession.guestInstanceId;

    if (!belongsToSession) {
        return false;
    }

    roomSession.remoteLastSeenAt = nowValue;
    roomSession.remoteAddress = roomSession.transportHost ? address : packet.hostAddress || address;
    roomSession.hostPort = packet.hostPort;

    if (packet.guestNonce && !roomSession.guestNonce) {
        roomSession.guestNonce = packet.guestNonce;
    }

    if (packet.hostPeerId) {
        roomSession.hostPeerId = packet.hostPeerId;
    }

    if (packet.hostPlayer) {
        roomSession.hostPlayer = packet.hostPlayer;
        roomSession.localSeat = roomSession.transportHost
            ? packet.hostPlayer
            : getOpposingPlayer(packet.hostPlayer);
    }

    if (packet.selectedMode) {
        roomSession.selectedMode = packet.selectedMode;
    }

    applySeatAssignment(roomSession);
    return true;
};

export const buildLanCancelState = ({ wantsSearch }) =>
    buildLanMatchState({
        ...createEmptyLanMatchState(),
        phase: wantsSearch ? 'searching' : 'idle',
        statusMessage: wantsSearch ? 'Opponent left. Searching again...' : 'LAN duel is ready.',
    });
