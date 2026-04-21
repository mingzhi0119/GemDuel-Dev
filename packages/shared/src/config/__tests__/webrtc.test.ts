import { afterEach, describe, expect, it } from 'vitest';
import {
    createPeerConfig,
    getIceServers,
    getRuntimeRelayProfile,
    resetRuntimeIceServers,
    setRuntimeIceServers,
    setRuntimeRelayProfile,
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
        expect(peerConfig.config.iceServers[0]).toMatchObject({
            username: 'runtime-user',
            credential: 'runtime-pass',
        });
    });

    it('drops malformed runtime ICE server entries', () => {
        setRuntimeIceServers([
            { urls: 'turn:valid.example.com:80', username: 'user', credential: 'pass' },
            { urls: 42 },
            { urls: 'stun:invalid.example.com:80', username: 'user', credential: 'pass' },
            null,
        ]);

        expect(getIceServers()).toHaveLength(3);
    });

    it('prefers an ephemeral relay profile while preserving the STUN baseline as fallback', () => {
        setRuntimeRelayProfile({
            policyVersion: 1,
            source: 'ephemeral-turn-bundle',
            iceServers: [
                {
                    urls: 'turns:relay.example.com:443',
                    username: 'bundle-user',
                    credential: 'bundle-pass',
                },
            ],
            issuedAt: '2026-04-19T00:00:00.000Z',
            expiresAt: '2026-04-19T01:00:00.000Z',
        });

        expect(getRuntimeRelayProfile()).toMatchObject({
            source: 'ephemeral-turn-bundle',
            expiresAt: '2026-04-19T01:00:00.000Z',
        });
        expect(getIceServers()[0]).toMatchObject({
            urls: 'turns:relay.example.com:443',
            username: 'bundle-user',
            credential: 'bundle-pass',
        });
        expect(getIceServers()).toHaveLength(3);
    });

    it('clears short-lived relay state when the runtime profile is reset', () => {
        setRuntimeRelayProfile({
            policyVersion: 1,
            source: 'online-turn-service',
            iceServers: [
                {
                    urls: 'turns:relay.example.com:443',
                    username: 'bundle-user',
                    credential: 'bundle-pass',
                },
            ],
            issuedAt: '2026-04-20T12:00:00.000Z',
            expiresAt: '2026-04-20T12:05:00.000Z',
        });

        resetRuntimeIceServers();

        expect(getRuntimeRelayProfile()).toEqual({
            policyVersion: 1,
            source: 'default-stun',
            iceServers: [],
            issuedAt: null,
            expiresAt: null,
        });
        expect(getIceServers()).toHaveLength(2);
    });
});
