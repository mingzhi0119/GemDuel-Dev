import { LAN_DISCOVERY_PROTOCOL_VERSION } from './lanDiscoveryProtocol.js';

const createBasePacket = ({ appVersion, instanceId, kind }) => ({
    kind,
    protocolVersion: LAN_DISCOVERY_PROTOCOL_VERSION,
    appVersion,
    instanceId,
});

export const createSearchPacket = ({ appVersion, instanceId }) =>
    createBasePacket({ appVersion, instanceId, kind: 'SEARCH' });

export const createSessionHeartbeatPacket = ({ appVersion, instanceId, roomSession }) => ({
    ...createBasePacket({ appVersion, instanceId, kind: 'SESSION_HEARTBEAT' }),
    roomId: roomSession.roomId,
    hostInstanceId: roomSession.hostInstanceId,
    guestInstanceId: roomSession.guestInstanceId,
    hostAddress: roomSession.hostAddress,
    hostPort: roomSession.hostPort,
    hostNonce: roomSession.hostNonce,
    ...(roomSession.guestNonce ? { guestNonce: roomSession.guestNonce } : {}),
    ...(roomSession.hostPlayer ? { hostPlayer: roomSession.hostPlayer } : {}),
    ...(roomSession.hostPeerId ? { hostPeerId: roomSession.hostPeerId } : {}),
    ...(roomSession.selectedMode ? { selectedMode: roomSession.selectedMode } : {}),
});

export const createMatchAssignPacket = ({ appVersion, instanceId, roomSession }) => ({
    ...createBasePacket({ appVersion, instanceId, kind: 'MATCH_ASSIGN' }),
    roomId: roomSession.roomId,
    hostInstanceId: roomSession.hostInstanceId,
    guestInstanceId: roomSession.guestInstanceId,
    hostAddress: roomSession.hostAddress,
    hostPort: roomSession.hostPort,
    hostNonce: roomSession.hostNonce,
});

export const createMatchAckPacket = ({ appVersion, instanceId, roomSession }) => ({
    ...createBasePacket({ appVersion, instanceId, kind: 'MATCH_ACK' }),
    roomId: roomSession.roomId,
    hostInstanceId: roomSession.hostInstanceId,
    guestInstanceId: roomSession.guestInstanceId,
    guestNonce: roomSession.guestNonce,
});

export const createStartReadyPacket = ({ appVersion, instanceId, mode, roomSession }) => ({
    ...createBasePacket({ appVersion, instanceId, kind: 'START_READY' }),
    roomId: roomSession.roomId,
    hostInstanceId: roomSession.hostInstanceId,
    guestInstanceId: roomSession.guestInstanceId,
    hostAddress: roomSession.hostAddress,
    hostPort: roomSession.hostPort,
    hostPeerId: roomSession.hostPeerId,
    hostPlayer: roomSession.hostPlayer,
    mode,
});

export const createSelectModePacket = ({ appVersion, instanceId, mode, roomSession }) => ({
    ...createBasePacket({ appVersion, instanceId, kind: 'SELECT_MODE' }),
    roomId: roomSession.roomId,
    hostInstanceId: roomSession.hostInstanceId,
    guestInstanceId: roomSession.guestInstanceId,
    mode,
});

export const createStartRequestPacket = ({ appVersion, instanceId, roomSession }) => ({
    ...createBasePacket({ appVersion, instanceId, kind: 'START_REQUEST' }),
    roomId: roomSession.roomId,
    hostInstanceId: roomSession.hostInstanceId,
    guestInstanceId: roomSession.guestInstanceId,
});

export const createCancelPacket = ({ appVersion, instanceId, roomSession }) => ({
    ...createBasePacket({ appVersion, instanceId, kind: 'CANCEL' }),
    roomId: roomSession.roomId,
    ...(roomSession.hostInstanceId
        ? {
              hostInstanceId: roomSession.hostInstanceId,
              guestInstanceId: roomSession.guestInstanceId,
          }
        : {}),
});
