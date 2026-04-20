export type RuntimeRelayProfileSource =
    | 'online-turn-service'
    | 'ephemeral-turn-bundle'
    | 'runtime-ice-fallback'
    | 'default-stun';

export interface RuntimeRelayProfile {
    policyVersion: 1;
    source: RuntimeRelayProfileSource;
    iceServers: RTCIceServer[];
    issuedAt?: string | null;
    expiresAt?: string | null;
}
