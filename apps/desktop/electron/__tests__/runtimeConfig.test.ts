// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import {
    RUNTIME_CONFIG_POLICY,
    getAutoUpdaterPolicy,
    getRuntimeLogLevel,
    getRuntimeIceServersFromEnv,
    getRuntimeRelayProfileFromEnv,
    getTurnCredentialServiceConfig,
    normalizeBooleanEnv,
    normalizeIceServer,
} from '../runtimeConfig.js';

const createLogger = () =>
    ({
        warn: vi.fn(),
    }) as Console & { warn: ReturnType<typeof vi.fn> };

describe('electron runtime config', () => {
    it('normalizes valid ICE servers and rejects malformed entries', () => {
        expect(normalizeIceServer({ urls: 'stun:example.org' })).toEqual({
            urls: 'stun:example.org',
            username: undefined,
            credential: undefined,
        });
        expect(
            normalizeIceServer({
                urls: ['turn:example.org'],
                username: 'u',
                credential: 'p',
            })
        ).toEqual({
            urls: ['turn:example.org'],
            username: 'u',
            credential: 'p',
        });
        expect(normalizeIceServer({ urls: 42 })).toBeNull();
        expect(normalizeIceServer({ urls: 'turn:example.org', credential: 1 })).toBeNull();
        expect(
            normalizeIceServer({
                urls: 'stun:example.org',
                username: 'u',
                credential: 'p',
            })
        ).toBeNull();
        expect(normalizeIceServer({ urls: 'turn:example.org', username: 'u' })).toBeNull();
        expect(normalizeIceServer({ urls: 'https://relay.example.org' })).toBeNull();
    });

    it('fails closed for malformed runtime ICE config input', () => {
        const logger = createLogger();

        expect(getRuntimeIceServersFromEnv('', logger)).toEqual([]);
        expect(getRuntimeIceServersFromEnv('{"bad":true}', logger)).toEqual([]);
        expect(getRuntimeIceServersFromEnv('not-json', logger)).toEqual([]);
        expect(logger.warn).toHaveBeenCalled();
    });

    it('filters invalid ICE server entries while preserving valid ones', () => {
        const logger = createLogger();
        const servers = getRuntimeIceServersFromEnv(
            JSON.stringify([
                { urls: 'stun:valid.example.org' },
                { urls: ['turn:valid.example.org'], username: 'user', credential: 'pass' },
                { urls: 'stun:invalid.example.org', username: 'user', credential: 'pass' },
                { urls: 99 },
            ]),
            logger
        );

        expect(servers).toEqual([
            { urls: 'stun:valid.example.org', username: undefined, credential: undefined },
            {
                urls: ['turn:valid.example.org'],
                username: 'user',
                credential: 'pass',
            },
        ]);
        expect(logger.warn).toHaveBeenCalledWith(
            '[RTC] Ignored one or more invalid runtime ICE server entries.'
        );
    });

    it('derives updater policy from version and env toggles', () => {
        const logger = createLogger();

        expect(
            getAutoUpdaterPolicy({
                disableUpdatesEnv: 'false',
                allowPrereleaseEnv: 'false',
                appVersion: '5.2.11',
                logger,
            })
        ).toEqual({
            enabled: true,
            autoDownload: true,
            allowPrerelease: false,
        });

        expect(
            getAutoUpdaterPolicy({
                disableUpdatesEnv: 'true',
                allowPrereleaseEnv: 'false',
                appVersion: '5.2.11-beta.1',
                logger,
            })
        ).toEqual({
            enabled: false,
            autoDownload: true,
            allowPrerelease: true,
        });
    });

    it('fails closed for malformed boolean env toggles', () => {
        const logger = createLogger();

        expect(
            normalizeBooleanEnv({
                envName: 'GEMDUEL_DISABLE_UPDATES',
                rawValue: 'sometimes',
                defaultValue: false,
                logger,
            })
        ).toBe(false);

        expect(
            getAutoUpdaterPolicy({
                disableUpdatesEnv: 'sometimes',
                allowPrereleaseEnv: 'nope',
                appVersion: '5.2.11',
                logger,
            })
        ).toEqual({
            enabled: true,
            autoDownload: true,
            allowPrerelease: false,
        });
        expect(logger.warn).toHaveBeenCalled();
    });

    it('normalizes runtime log level to an allowlisted value', () => {
        const logger = createLogger();

        expect(
            getRuntimeLogLevel({
                rawLevel: 'debug',
                fallbackLevel: 'info',
                logger,
            })
        ).toBe('debug');
        expect(
            getRuntimeLogLevel({
                rawLevel: 'trace',
                fallbackLevel: 'info',
                logger,
            })
        ).toBe('info');
        expect(logger.warn).toHaveBeenCalled();
    });

    it('declares ownership and secret handling for every governed env var', () => {
        expect(Object.keys(RUNTIME_CONFIG_POLICY).sort()).toEqual([
            'CI',
            'CSC_KEY_PASSWORD',
            'CSC_LINK',
            'GEMDUEL_ALLOW_PRERELEASE',
            'GEMDUEL_ALLOW_VISUAL_LAB',
            'GEMDUEL_DEV_SERVER_URL',
            'GEMDUEL_DISABLE_UPDATES',
            'GEMDUEL_ICE_SERVERS_JSON',
            'GEMDUEL_LOG_LEVEL',
            'GEMDUEL_PEER_SERVER_PORT',
            'GEMDUEL_TURN_CREDENTIAL_BUNDLE_JSON',
            'GEMDUEL_TURN_SERVICE_FALLBACK_MODE',
            'GEMDUEL_TURN_SERVICE_TOKEN',
            'GEMDUEL_TURN_SERVICE_URL',
            'GEMDUEL_USER_DATA_SUFFIX',
            'GITHUB_DEFAULT_BRANCH',
            'GITHUB_JOB',
            'GITHUB_REF',
            'GITHUB_REPOSITORY',
            'GITHUB_RUN_ATTEMPT',
            'GITHUB_RUN_ID',
            'GITHUB_SHA',
            'GITHUB_STEP_SUMMARY',
            'GITHUB_WORKFLOW',
            'UNITY_EXE',
            'WIN_CSC_KEY_PASSWORD',
            'WIN_CSC_LINK',
        ]);
        expect(RUNTIME_CONFIG_POLICY.GEMDUEL_ICE_SERVERS_JSON.secretHandling).toContain(
            'TURN credentials'
        );
    });

    it('normalizes TURN service config and defaults malformed fallback policy', () => {
        const logger = createLogger();

        expect(
            getTurnCredentialServiceConfig({
                serviceUrlEnv: 'https://relay.example.com/turn/',
                serviceTokenEnv: 'service-token',
                fallbackModeEnv: 'deny-runtime-ice',
                logger,
            })
        ).toEqual({
            enabled: true,
            serviceUrl: 'https://relay.example.com/turn',
            serviceToken: 'service-token',
            fallbackMode: 'deny-runtime-ice',
        });

        expect(
            getTurnCredentialServiceConfig({
                serviceUrlEnv: 'not-a-url',
                serviceTokenEnv: 'service-token',
                fallbackModeEnv: 'bad-mode',
                logger,
            })
        ).toEqual({
            enabled: false,
            serviceUrl: null,
            serviceToken: null,
            fallbackMode: 'allow-runtime-ice',
        });
        expect(logger.warn).toHaveBeenCalled();
    });

    it('rejects non-loopback HTTP TURN service URLs while allowing loopback development URLs', () => {
        const logger = createLogger();

        expect(
            getTurnCredentialServiceConfig({
                serviceUrlEnv: 'http://relay.example.com/turn',
                serviceTokenEnv: 'service-token',
                fallbackModeEnv: 'deny-runtime-ice',
                logger,
            })
        ).toEqual({
            enabled: false,
            serviceUrl: null,
            serviceToken: null,
            fallbackMode: 'deny-runtime-ice',
        });

        expect(
            getTurnCredentialServiceConfig({
                serviceUrlEnv: 'http://localhost:8787/turn/',
                serviceTokenEnv: 'service-token',
                fallbackModeEnv: 'allow-runtime-ice',
                logger,
            })
        ).toEqual({
            enabled: true,
            serviceUrl: 'http://localhost:8787/turn',
            serviceToken: 'service-token',
            fallbackMode: 'allow-runtime-ice',
        });

        expect(
            getTurnCredentialServiceConfig({
                serviceUrlEnv: 'http://127.0.0.1:8787/turn',
                serviceTokenEnv: 'service-token',
                fallbackModeEnv: 'allow-runtime-ice',
                logger,
            }).enabled
        ).toBe(true);

        expect(
            getTurnCredentialServiceConfig({
                serviceUrlEnv: 'http://[::1]:8787/turn',
                serviceTokenEnv: 'service-token',
                fallbackModeEnv: 'allow-runtime-ice',
                logger,
            }).enabled
        ).toBe(true);

        expect(logger.warn).toHaveBeenCalled();
    });

    it('prefers a valid ephemeral TURN bundle over the legacy runtime ICE list', () => {
        const logger = createLogger();

        expect(
            getRuntimeRelayProfileFromEnv(
                JSON.stringify({
                    policyVersion: 1,
                    iceServers: [
                        {
                            urls: ['turns:relay.example.com:443?transport=tcp'],
                            username: 'bundle-user',
                            credential: 'bundle-pass',
                        },
                    ],
                    issuedAt: '2026-04-19T00:00:00.000Z',
                    expiresAt: '2026-04-19T01:00:00.000Z',
                }),
                JSON.stringify([{ urls: 'stun:legacy.example.com' }]),
                logger,
                () => Date.parse('2026-04-19T00:30:00.000Z')
            )
        ).toEqual({
            policyVersion: 1,
            source: 'ephemeral-turn-bundle',
            iceServers: [
                {
                    urls: ['turns:relay.example.com:443?transport=tcp'],
                    username: 'bundle-user',
                    credential: 'bundle-pass',
                },
            ],
            issuedAt: '2026-04-19T00:00:00.000Z',
            expiresAt: '2026-04-19T01:00:00.000Z',
        });
        expect(logger.warn).not.toHaveBeenCalled();
    });

    it('falls back to the legacy runtime ICE list when the TURN bundle is expired', () => {
        const logger = createLogger();

        expect(
            getRuntimeRelayProfileFromEnv(
                JSON.stringify({
                    policyVersion: 1,
                    iceServers: [
                        {
                            urls: ['turn:expired.example.com:80'],
                            username: 'bundle-user',
                            credential: 'bundle-pass',
                        },
                    ],
                    issuedAt: '2026-04-19T00:00:00.000Z',
                    expiresAt: '2026-04-19T00:05:00.000Z',
                }),
                JSON.stringify([{ urls: 'stun:legacy.example.com' }]),
                logger,
                () => Date.parse('2026-04-19T00:10:00.000Z')
            )
        ).toEqual({
            policyVersion: 1,
            source: 'runtime-ice-fallback',
            iceServers: [
                {
                    urls: 'stun:legacy.example.com',
                    username: undefined,
                    credential: undefined,
                },
            ],
            issuedAt: null,
            expiresAt: null,
        });
        expect(logger.warn).toHaveBeenCalled();
    });

    it('falls back to the default STUN profile when bundle parsing fails and no runtime ICE list remains', () => {
        const logger = createLogger();

        expect(
            getRuntimeRelayProfileFromEnv('{not-valid-json', '', logger, () =>
                Date.parse('2026-04-19T00:10:00.000Z')
            )
        ).toEqual({
            policyVersion: 1,
            source: 'default-stun',
            iceServers: [],
            issuedAt: null,
            expiresAt: null,
        });
        expect(logger.warn).toHaveBeenCalledWith(
            '[RTC] Failed to parse GEMDUEL_TURN_CREDENTIAL_BUNDLE_JSON. Falling back to the next relay source.',
            expect.any(SyntaxError)
        );
    });
});
