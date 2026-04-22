import crypto from 'node:crypto';
import dgram from 'node:dgram';
import {
    buildLanMatchState,
    createEmptyLanMatchState,
    HEARTBEAT_INTERVAL_MS,
    isPrivateLanAddress,
    LAN_DISCOVERY_BROADCAST_ADDRESS,
    LAN_DISCOVERY_PORT,
    LAN_DISCOVERY_PROTOCOL_VERSION,
    PEER_STALE_AFTER_MS,
    pickLanHostAddress,
} from './lanDiscoveryProtocol.js';
import {
    applySeatAssignment,
    applySessionHeartbeat,
    buildLanLaunch,
    createGuestRoomSession,
    createHostRoomSession,
} from './lanDiscoverySession.js';
import {
    applyIncomingStartReady,
    applyRemoteModeSelection,
    canHandleRemotePregamePacket,
    isRemotePlayerP1,
} from './lanDiscoveryPregame.js';
import {
    createCancelPacket,
    createMatchAckPacket,
    createMatchAssignPacket,
    createSearchPacket,
    createSelectModePacket,
    createSessionHeartbeatPacket,
    createStartReadyPacket,
    createStartRequestPacket,
} from './lanDiscoveryPackets.js';

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
    const handlePeerStale = () => {
        if (
            !roomSession?.remoteLastSeenAt ||
            now() - roomSession.remoteLastSeenAt <= PEER_STALE_AFTER_MS
        )
            return;
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
        candidates.set(packet.instanceId, {
            address,
            lastSeenAt: now(),
        });
        if (
            !wantsSearch ||
            roomSession?.phase !== 'searching' ||
            instanceId >= packet.instanceId ||
            !hostPort
        )
            return;
        roomSession = createHostRoomSession({
            candidateAddress: address,
            candidateId: packet.instanceId,
            hostAddress: pickLanHostAddress(networkInterfaces?.()),
            hostPort,
            hostNonce: crypto.randomBytes(8).toString('hex'),
            instanceId,
            now: now(),
            roomId: crypto.randomUUID(),
        });
        emitState();
        sendPacket(
            createMatchAssignPacket({
                appVersion: appVersionString,
                instanceId,
                roomSession,
            })
        );
    };
    const handleMatchAssignPacket = (packet, address) => {
        if (
            !wantsSearch ||
            roomSession?.phase !== 'searching' ||
            packet.guestInstanceId !== instanceId
        )
            return;
        roomSession = createGuestRoomSession({
            address,
            guestNonce: crypto.randomBytes(8).toString('hex'),
            instanceId,
            now: now(),
            packet,
        });
        sendPacket(
            createMatchAckPacket({
                appVersion: appVersionString,
                instanceId,
                roomSession,
            })
        );
        applySeatAssignment(roomSession);
        emitState();
    };
    const handleMatchAckPacket = (packet, address) => {
        if (
            !roomSession?.transportHost ||
            roomSession.roomId !== packet.roomId ||
            packet.hostInstanceId !== instanceId ||
            packet.guestInstanceId !== roomSession.guestInstanceId
        )
            return;
        roomSession.remoteAddress = address;
        roomSession.remoteLastSeenAt = now();
        roomSession.guestNonce = packet.guestNonce;
        applySeatAssignment(roomSession);
        emitState();
    };
    const handleSessionHeartbeatPacket = (packet, address) => {
        if (!applySessionHeartbeat({ address, nowValue: now(), packet, roomSession })) return;
        emitState();
    };
    const handleSelectModePacket = (packet) => {
        if (!canHandleRemotePregamePacket(roomSession, packet) || !isRemotePlayerP1(roomSession))
            return;
        applyRemoteModeSelection(roomSession, packet.mode);
        emitState();
    };
    const handleStartRequestPacket = (packet) => {
        if (!canHandleRemotePregamePacket(roomSession, packet) || !isRemotePlayerP1(roomSession))
            return;
        if (!roomSession.selectedMode || !roomSession.hostPeerId) {
            roomSession.statusMessage = 'Waiting for transport host to finish setup...';
            emitState();
            return;
        }
        broadcastStartReady(roomSession.selectedMode);
    };
    const handleStartReadyPacket = (packet) => {
        const launch = applyIncomingStartReady(roomSession, packet);
        if (!launch) return;
        emitState();
        emit({ type: 'launch', launch });
    };
    const handleCancelPacket = (packet) => {
        if (!roomSession?.roomId) return;
        const matchesRoom = roomSession.roomId === packet.roomId;
        const targetsLocal =
            !packet.hostInstanceId ||
            packet.hostInstanceId === roomSession.hostInstanceId ||
            packet.guestInstanceId === roomSession.guestInstanceId;
        if (!matchesRoom || !targetsLocal) return;
        resetSession({
            phase: wantsSearch ? 'searching' : 'idle',
            statusMessage: wantsSearch ? 'Opponent left. Searching again...' : 'LAN duel is ready.',
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
        )
            return;
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
    const tick = () => {
        const nowValue = now();
        for (const [candidateId, candidate] of candidates) {
            if (nowValue - candidate.lastSeenAt > PEER_STALE_AFTER_MS) {
                candidates.delete(candidateId);
            }
        }

        if (wantsSearch && roomSession?.phase === 'searching') {
            sendSearchHeartbeat();
        } else if (roomSession?.phase === 'matched' || roomSession?.phase === 'starting') {
            sendSessionHeartbeat();
        }

        handlePeerStale();
    };
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
            socket.on('message', handleIncomingPacket);
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
