import crypto from 'node:crypto';
import dgram from 'node:dgram';
import {
    buildLanMatchState,
    createEmptyLanMatchState,
    HEARTBEAT_INTERVAL_MS,
    LAN_DISCOVERY_BROADCAST_ADDRESS,
    LAN_DISCOVERY_PORT,
    PEER_STALE_AFTER_MS,
} from './lanDiscoveryProtocol.js';
import { buildLanLaunch } from './lanDiscoverySession.js';
import {
    createCancelPacket,
    createSearchPacket,
    createSelectModePacket,
    createSessionHeartbeatPacket,
    createStartRequestPacket,
    createStartReadyPacket,
} from './lanDiscoveryPackets.js';
import { createLanDiscoveryPacketHandlers } from './lanDiscoveryServiceHandlers.js';

export const createLanDiscoveryService = ({
    appVersion,
    bindPort = LAN_DISCOVERY_PORT,
    dgramModule = dgram,
    getHostSignalPort = () => 9000,
    logger = console,
    networkInterfaces,
    now = () => Date.now(),
    onEvent = () => undefined,
} = {}) => {
    const instanceId = crypto.randomUUID();
    const appVersionString = appVersion ?? 'dev';
    const candidates = new Map();
    let socket = null;
    let heartbeatTimer = null;
    let roomSession = null;
    let wantsSearch = false;
    const emit = (event) => onEvent(event);
    const snapshot = () => buildLanMatchState(roomSession);
    const emitState = () => emit({ type: 'state', state: snapshot() });
    const resetSession = ({
        phase = wantsSearch ? 'searching' : 'idle',
        statusMessage,
        errorMessage = null,
    } = {}) => {
        roomSession = {
            ...createEmptyLanMatchState(),
            phase,
            statusMessage:
                statusMessage ??
                (phase === 'searching'
                    ? 'Searching for opponent on local network...'
                    : 'LAN duel is ready.'),
            errorMessage,
        };
        emitState();
        return snapshot();
    };
    const sendPacket = (packet) => {
        if (!socket) return;
        try {
            socket.send(
                Buffer.from(JSON.stringify(packet)),
                bindPort,
                LAN_DISCOVERY_BROADCAST_ADDRESS
            );
        } catch (error) {
            logger.warn?.('[LAN] Failed to send packet.', error);
        }
    };
    const sendSearchHeartbeat = () =>
        sendPacket(createSearchPacket({ appVersion: appVersionString, instanceId }));
    const sendSessionHeartbeat = () => {
        if (!roomSession?.roomId) return;
        sendPacket(
            createSessionHeartbeatPacket({
                appVersion: appVersionString,
                instanceId,
                roomSession,
            })
        );
    };
    const launchMatch = (mode) => {
        const launch = buildLanLaunch(roomSession, mode);
        if (!launch) return null;
        roomSession.phase = 'starting';
        roomSession.statusMessage = 'Connecting LAN duel...';
        roomSession.errorMessage = null;
        emitState();
        emit({ type: 'launch', launch });
        return launch;
    };
    const broadcastStartReady = (mode) => {
        const launch = launchMatch(mode);
        if (!launch || !roomSession) return;
        sendPacket(
            createStartReadyPacket({
                appVersion: appVersionString,
                instanceId,
                mode,
                roomSession,
            })
        );
    };
    const packetHandlers = createLanDiscoveryPacketHandlers({
        appVersionString,
        broadcastStartReady,
        candidates,
        emit,
        emitState,
        getHostSignalPort,
        getRoomSession: () => roomSession,
        getWantsSearch: () => wantsSearch,
        instanceId,
        networkInterfaces,
        now,
        resetSession,
        sendPacket,
        setRoomSession: (nextSession) => {
            roomSession = nextSession;
        },
    });
    const tick = () =>
        packetHandlers.tick({
            sendSearchHeartbeat,
            sendSessionHeartbeat,
        });
    return {
        start: () => {
            if (socket) return;
            socket = dgramModule.createSocket({
                type: 'udp4',
                reuseAddr: true,
            });
            socket.on('error', (error) => {
                logger.error?.('[LAN] Discovery socket error.', error);
                roomSession = {
                    ...createEmptyLanMatchState(),
                    phase: 'error',
                    statusMessage: 'LAN discovery failed to start.',
                    errorMessage: 'LAN discovery failed to start.',
                };
                emitState();
            });
            socket.on('message', packetHandlers.handleIncomingPacket);
            socket.bind(bindPort, () => socket?.setBroadcast(true));
            heartbeatTimer = setInterval(tick, HEARTBEAT_INTERVAL_MS);
            resetSession();
        },
        stop: () => {
            wantsSearch = false;
            if (heartbeatTimer) clearInterval(heartbeatTimer);
            heartbeatTimer = null;
            if (socket) socket.close();
            socket = null;
            candidates.clear();
            roomSession = null;
        },
        getState: () => snapshot(),
        startMatchmaking: () => {
            const hostPort = getHostSignalPort();
            if (!hostPort) {
                return resetSession({
                    phase: 'error',
                    statusMessage: 'LAN transport is unavailable.',
                    errorMessage: 'LAN transport is unavailable.',
                });
            }
            wantsSearch = true;
            candidates.clear();
            resetSession({
                phase: 'searching',
                statusMessage: 'Searching for opponent on local network...',
            });
            sendSearchHeartbeat();
            return snapshot();
        },
        cancelMatchmaking: () => {
            if (roomSession?.roomId) {
                sendPacket(
                    createCancelPacket({
                        appVersion: appVersionString,
                        instanceId,
                        roomSession,
                    })
                );
            }

            wantsSearch = false;
            candidates.clear();
            return resetSession({
                phase: 'idle',
                statusMessage: 'LAN duel is ready.',
            });
        },
        reportPeerReady: ({ roomId, peerId }) => {
            if (!roomSession?.transportHost || roomSession.roomId !== roomId) return snapshot();
            roomSession.hostPeerId = peerId;
            if (roomSession.selectedMode && roomSession.localSeat === 'p1') {
                roomSession.statusMessage = 'Ready to start LAN duel.';
            }
            emitState();
            return snapshot();
        },
        selectPregameMode: ({ roomId, mode }) => {
            if (!roomSession?.roomId || roomSession.roomId !== roomId) return snapshot();
            if (roomSession.localSeat !== 'p1') {
                roomSession.errorMessage = 'Only P1 can choose the match mode.';
                emitState();
                return snapshot();
            }
            roomSession.selectedMode = mode;
            roomSession.errorMessage = null;
            roomSession.statusMessage = 'Mode selected. Ready to start.';
            emitState();
            if (!roomSession.transportHost) {
                sendPacket(
                    createSelectModePacket({
                        appVersion: appVersionString,
                        instanceId,
                        mode,
                        roomSession,
                    })
                );
            }
            return snapshot();
        },
        confirmPregameStart: ({ roomId }) => {
            if (!roomSession?.roomId || roomSession.roomId !== roomId) return snapshot();
            if (roomSession.localSeat !== 'p1') {
                roomSession.errorMessage = 'Only P1 can start the LAN duel.';
                emitState();
                return snapshot();
            }
            if (!roomSession.selectedMode) {
                roomSession.errorMessage = 'Choose Classic or Roguelike before starting.';
                emitState();
                return snapshot();
            }
            if (roomSession.transportHost) {
                if (!roomSession.hostPeerId) {
                    roomSession.statusMessage = 'Preparing host transport...';
                    roomSession.errorMessage = null;
                    emitState();
                    return snapshot();
                }
                broadcastStartReady(roomSession.selectedMode);
                return snapshot();
            }
            roomSession.phase = 'starting';
            roomSession.errorMessage = null;
            roomSession.statusMessage = 'Waiting for transport host to begin...';
            emitState();
            sendPacket(
                createStartRequestPacket({
                    appVersion: appVersionString,
                    instanceId,
                    roomSession,
                })
            );
            return snapshot();
        },
    };
};

export {
    deriveHostPlayer,
    isPrivateLanAddress,
    pickLanHostAddress,
} from './lanDiscoveryProtocol.js';

export const LAN_DISCOVERY_CONSTANTS = {
    LAN_DISCOVERY_BROADCAST_ADDRESS,
    LAN_DISCOVERY_PORT,
    HEARTBEAT_INTERVAL_MS,
    PEER_STALE_AFTER_MS,
};
