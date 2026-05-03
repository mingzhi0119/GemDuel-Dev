import { getOpposingPlayer, isPrivateLanAddress } from './lanDiscoveryProtocol.js';

export const canHandleRemotePregamePacket = (roomSession, packet) =>
    Boolean(
        roomSession?.transportHost &&
        roomSession.roomId === packet.roomId &&
        roomSession.hostInstanceId === packet.hostInstanceId &&
        packet.guestInstanceId === roomSession.guestInstanceId &&
        packet.instanceId === roomSession.guestInstanceId &&
        packet.hostNonce === roomSession.hostNonce &&
        packet.guestNonce === roomSession.guestNonce &&
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
    if (
        !roomSession?.roomId ||
        roomSession.roomId !== packet.roomId ||
        roomSession.hostInstanceId !== packet.hostInstanceId ||
        roomSession.guestInstanceId !== packet.guestInstanceId ||
        packet.instanceId !== roomSession.hostInstanceId ||
        packet.hostNonce !== roomSession.hostNonce ||
        packet.guestNonce !== roomSession.guestNonce ||
        !isPrivateLanAddress(packet.hostAddress) ||
        !Number.isInteger(packet.hostPort) ||
        packet.hostPort < 1 ||
        packet.hostPort > 65535 ||
        !packet.hostPeerId ||
        (packet.hostPlayer !== 'p1' && packet.hostPlayer !== 'p2')
    ) {
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
