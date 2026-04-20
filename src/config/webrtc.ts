import { parseRuntimeIceServers } from '../logic/runtimeSchemas';
import type { RuntimeRelayProfile } from '../types';

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
];

const DEFAULT_RELAY_PROFILE: RuntimeRelayProfile = {
    policyVersion: 1,
    source: 'default-stun',
    iceServers: [],
    issuedAt: null,
    expiresAt: null,
};

let runtimeRelayProfile: RuntimeRelayProfile = DEFAULT_RELAY_PROFILE;

const normalizeRuntimeRelayProfile = (value: RuntimeRelayProfile): RuntimeRelayProfile => ({
    policyVersion: 1,
    source: value.source,
    iceServers: parseRuntimeIceServers(value.iceServers),
    issuedAt: value.issuedAt ?? null,
    expiresAt: value.expiresAt ?? null,
});

export const setRuntimeRelayProfile = (profile: RuntimeRelayProfile): RuntimeRelayProfile => {
    runtimeRelayProfile = normalizeRuntimeRelayProfile(profile);
    return runtimeRelayProfile;
};

export const getRuntimeRelayProfile = (): RuntimeRelayProfile => ({
    ...runtimeRelayProfile,
    iceServers: [...runtimeRelayProfile.iceServers],
});

export const setRuntimeIceServers = (servers: unknown): RTCIceServer[] => {
    const profile = setRuntimeRelayProfile({
        policyVersion: 1,
        source: 'runtime-ice-fallback',
        iceServers: parseRuntimeIceServers(servers),
        issuedAt: null,
        expiresAt: null,
    });
    return [...profile.iceServers];
};

export const resetRuntimeIceServers = () => {
    runtimeRelayProfile = DEFAULT_RELAY_PROFILE;
};

export const getIceServers = (): RTCIceServer[] => [
    ...runtimeRelayProfile.iceServers,
    ...DEFAULT_ICE_SERVERS,
];

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
