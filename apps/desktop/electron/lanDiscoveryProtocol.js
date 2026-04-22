import crypto from 'node:crypto';
import os from 'node:os';

export const LAN_DISCOVERY_PROTOCOL_VERSION = 1;
export const LAN_DISCOVERY_PORT = 41234;
export const LAN_DISCOVERY_BROADCAST_ADDRESS = '255.255.255.255';
export const HEARTBEAT_INTERVAL_MS = 1000;
export const PEER_STALE_AFTER_MS = 4500;

export const getOpposingPlayer = (player) => (player === 'p1' ? 'p2' : 'p1');

export const isPrivateLanAddress = (address) => {
    if (typeof address !== 'string') {
        return false;
    }

    if (address === '127.0.0.1' || address === '::1') {
        return true;
    }

    if (address.startsWith('10.') || address.startsWith('192.168.')) {
        return true;
    }

    const octets = address.split('.');
    if (octets.length !== 4) {
        return false;
    }

    return octets[0] === '172' && Number(octets[1]) >= 16 && Number(octets[1]) <= 31;
};

export const pickLanHostAddress = (interfaces = os.networkInterfaces()) => {
    for (const entries of Object.values(interfaces)) {
        for (const entry of entries ?? []) {
            if (
                entry?.family === 'IPv4' &&
                !entry.internal &&
                typeof entry.address === 'string' &&
                isPrivateLanAddress(entry.address)
            ) {
                return entry.address;
            }
        }
    }

    return '127.0.0.1';
};

export const deriveHostPlayer = ({
    roomId,
    hostInstanceId,
    guestInstanceId,
    hostNonce,
    guestNonce,
}) => {
    const hash = crypto
        .createHash('sha256')
        .update([roomId, hostInstanceId, guestInstanceId, hostNonce, guestNonce].join(':'))
        .digest('hex');

    return parseInt(hash.slice(0, 2), 16) % 2 === 0 ? 'p1' : 'p2';
};

export const createEmptyLanMatchState = () => ({
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

export const buildLanMatchState = (session) =>
    Object.freeze({
        phase: session?.phase ?? 'idle',
        roomId: session?.roomId ?? null,
        remoteInstanceId: session?.remoteInstanceId ?? null,
        remoteAddress: session?.remoteAddress ?? null,
        hostPort: session?.hostPort ?? null,
        transportHost: session?.transportHost ?? false,
        localSeat: session?.localSeat ?? null,
        selectedMode: session?.selectedMode ?? null,
        hostPeerId: session?.hostPeerId ?? null,
        errorMessage: session?.errorMessage ?? null,
        statusMessage: session?.statusMessage ?? 'LAN duel is ready.',
    });
