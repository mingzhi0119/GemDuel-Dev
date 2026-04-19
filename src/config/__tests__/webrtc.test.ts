import { afterEach, describe, expect, it } from 'vitest';
import {
    createPeerConfig,
    getIceServers,
    resetRuntimeIceServers,
    setRuntimeIceServers,
} from '../webrtc';

describe('WebRTC runtime ICE configuration', () => {
    afterEach(() => {
        resetRuntimeIceServers();
    });

    it('keeps the default STUN servers when no runtime config is provided', () => {
        expect(getIceServers()).toHaveLength(2);
    });

    it('adds valid runtime ICE servers without replacing the baseline STUN fallback', () => {
        setRuntimeIceServers([
            {
                urls: ['turn:relay.example.com:80', 'turn:relay.example.com:443'],
                username: 'runtime-user',
                credential: 'runtime-pass',
            },
        ]);

        const peerConfig = createPeerConfig(true, 'cloud');

        expect(peerConfig.config.iceServers).toHaveLength(3);
        expect(peerConfig.config.iceServers[2]).toMatchObject({
            username: 'runtime-user',
            credential: 'runtime-pass',
        });
    });

    it('drops malformed runtime ICE server entries', () => {
        setRuntimeIceServers([
            { urls: 'turn:valid.example.com:80', username: 'user', credential: 'pass' },
            { urls: 42 },
            null,
        ]);

        expect(getIceServers()).toHaveLength(3);
    });
});
