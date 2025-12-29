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

// PeerJS Config Wrapper
export const PEER_CONFIG = {
    debug: 2, // 0=None, 1=Errors, 2=Warnings, 3=All
    config: {
        iceServers: GET_ICE_SERVERS(),
        iceTransportPolicy: 'all' as RTCIceTransportPolicy, // 'relay' forces TURN (good for debugging)
    },
};
