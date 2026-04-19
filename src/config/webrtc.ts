const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
];

let runtimeIceServers: RTCIceServer[] = [];

const isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((entry) => typeof entry === 'string');

const normalizeIceServer = (value: unknown): RTCIceServer | null => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return null;
    }

    const candidate = value as Record<string, unknown>;
    if (typeof candidate.urls !== 'string' && !isStringArray(candidate.urls)) {
        return null;
    }

    const normalized: RTCIceServer = { urls: candidate.urls };

    if (candidate.username !== undefined) {
        if (typeof candidate.username !== 'string') return null;
        normalized.username = candidate.username;
    }

    if (candidate.credential !== undefined) {
        if (typeof candidate.credential !== 'string') return null;
        normalized.credential = candidate.credential;
    }

    return normalized;
};

export const setRuntimeIceServers = (servers: unknown): RTCIceServer[] => {
    if (!Array.isArray(servers)) {
        runtimeIceServers = [];
        return runtimeIceServers;
    }

    runtimeIceServers = servers
        .map((server) => normalizeIceServer(server))
        .filter((server): server is RTCIceServer => server !== null);

    return runtimeIceServers;
};

export const resetRuntimeIceServers = () => {
    runtimeIceServers = [];
};

export const getIceServers = (): RTCIceServer[] => [...DEFAULT_ICE_SERVERS, ...runtimeIceServers];

/**
 * Creates PeerJS configuration.
 * Defaults to PeerJS public cloud if targetIP is not specified or is 'cloud'.
 */
export const createPeerConfig = (_isHost: boolean, targetIP?: string) => {
    const isLocal =
        targetIP === 'localhost' || targetIP?.startsWith('192') || targetIP?.startsWith('10.');
    const baseConfig = {
        debug: import.meta.env.DEV ? 2 : 1,
        config: {
            iceServers: getIceServers(),
            iceTransportPolicy: 'all' as RTCIceTransportPolicy,
        },
    };

    if (isLocal && targetIP) {
        return {
            ...baseConfig,
            host: targetIP,
            port: 9000,
            path: '/gemduel',
            secure: false,
        };
    }

    return {
        ...baseConfig,
        secure: true,
    };
};

export const PEER_CONFIG = createPeerConfig(true);
