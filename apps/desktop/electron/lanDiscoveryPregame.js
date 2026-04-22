import { getOpposingPlayer } from './lanDiscoveryProtocol.js';

export const canHandleRemotePregamePacket = (roomSession, packet) =>
    Boolean(
        roomSession?.transportHost &&
        roomSession.roomId === packet.roomId &&
        packet.guestInstanceId === roomSession.guestInstanceId &&
        roomSession.hostPlayer
    );

export const isRemotePlayerP1 = (roomSession) =>
    Boolean(roomSession?.hostPlayer && getOpposingPlayer(roomSession.hostPlayer) === 'p1');

export const applyRemoteModeSelection = (roomSession, mode) => {
    roomSession.selectedMode = mode;
    roomSession.statusMessage = 'P1 selected a mode. Ready to start.';
    return roomSession;
};

export const applyIncomingStartReady = (roomSession, packet) => {
    if (!roomSession?.roomId || roomSession.roomId !== packet.roomId) {
        return null;
    }

    roomSession.phase = 'starting';
    roomSession.hostPort = packet.hostPort;
    roomSession.hostPeerId = packet.hostPeerId;
    roomSession.hostPlayer = packet.hostPlayer;
    roomSession.localSeat = roomSession.transportHost
        ? packet.hostPlayer
        : getOpposingPlayer(packet.hostPlayer);
    roomSession.selectedMode = packet.mode;
    roomSession.statusMessage = 'Connecting LAN duel...';

    return {
        roomId: packet.roomId,
        targetIP: roomSession.transportHost ? 'localhost' : packet.hostAddress,
        targetPort: packet.hostPort,
        hostPeerId: packet.hostPeerId,
        transportHost: roomSession.transportHost,
        hostPlayer: packet.hostPlayer,
        mode: packet.mode,
    };
};
