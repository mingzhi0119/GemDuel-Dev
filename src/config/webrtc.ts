import { parseRuntimeIceServers } from '../logic/runtimeSchemas';

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
];

let runtimeIceServers: RTCIceServer[] = [];

export const setRuntimeIceServers = (servers: unknown): RTCIceServer[] => {
    runtimeIceServers = parseRuntimeIceServers(servers);
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
