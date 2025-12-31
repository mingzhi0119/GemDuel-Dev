// src/config/webrtc.ts

/**
 * Generates the ICE Server configuration for WebRTC.
 * Includes public STUN servers and optional private TURN servers.
 */
export const GET_ICE_SERVERS = (): RTCIceServer[] => {
    // 1. Always include free STUN servers as baseline
    const servers: RTCIceServer[] = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' },
    ];

    // 2. Inject TURN credentials from Environment Variables (Security Best Practice)
    // NEVER commit hardcoded TURN credentials to Git.
    if (import.meta.env.VITE_TURN_USER && import.meta.env.VITE_TURN_PASS) {
        servers.push({
            urls: 'turn:global.turn.metered.ca:80', // Example Provider
            username: import.meta.env.VITE_TURN_USER,
            credential: import.meta.env.VITE_TURN_PASS,
        });
        servers.push({
            urls: 'turn:global.turn.metered.ca:443',
            username: import.meta.env.VITE_TURN_USER,
            credential: import.meta.env.VITE_TURN_PASS,
        });
    }

    return servers;
};

/**
 * Creates PeerJS configuration for local host-as-server architecture.
 * @param isHost - Whether this peer is the host (runs local server)
 * @param targetIP - IP address to connect to (for guests). Defaults to 'localhost'
 */
/**
 * Creates PeerJS configuration.
 * Defaults to PeerJS public cloud if targetIP is not specified or is 'cloud'.
 * @param isHost - whether this peer identifies as host (not relevant for cloud config usually, but kept for interface)
 * @param targetIP - Optional: custom signaling server Host/IP. Pass 'localhost' for local dev.
 */
export const createPeerConfig = (isHost: boolean, targetIP?: string) => {
    const isLocal =
        targetIP === 'localhost' || targetIP?.startsWith('192') || targetIP?.startsWith('10.');

    if (isLocal && targetIP) {
        return {
            host: targetIP,
            port: 9000,
            path: '/gemduel',
            secure: false,
            debug: 2,
            config: {
                iceServers: GET_ICE_SERVERS(),
                iceTransportPolicy: 'all' as RTCIceTransportPolicy,
            },
        };
    }

    // PeerJS Cloud Config (Default)
    return {
        secure: true, // Cloud requires SSL
        debug: 2,
        config: {
            iceServers: GET_ICE_SERVERS(),
            iceTransportPolicy: 'all' as RTCIceTransportPolicy,
        },
    };
};

export const PEER_CONFIG = createPeerConfig(true);
