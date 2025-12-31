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
export const createPeerConfig = (isHost: boolean, targetIP: string = 'localhost') => {
    const host = isHost ? 'localhost' : targetIP;

    return {
        host,
        port: 9000,
        path: '/gemduel',
        secure: false, // IMPORTANT: Local connections use HTTP not HTTPS
        debug: 2, // 0=None, 1=Errors, 2=Warnings, 3=All
        config: {
            iceServers: GET_ICE_SERVERS(),
            iceTransportPolicy: 'all' as RTCIceTransportPolicy,
        },
    };
};

// Legacy export for backwards compatibility (defaults to host mode with localhost)
export const PEER_CONFIG = createPeerConfig(true, 'localhost');
