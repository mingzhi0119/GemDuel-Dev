// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import {
    getAutoUpdaterPolicy,
    getRuntimeIceServersFromEnv,
    normalizeIceServer,
} from '../runtimeConfig.js';

describe('electron runtime config', () => {
    it('normalizes valid ICE servers and rejects malformed entries', () => {
        expect(normalizeIceServer({ urls: 'stun:example.org' })).toEqual({
            urls: 'stun:example.org',
            username: undefined,
            credential: undefined,
        });
        expect(normalizeIceServer({ urls: ['turn:example.org'], username: 'u' })).toEqual({
            urls: ['turn:example.org'],
            username: 'u',
            credential: undefined,
        });
        expect(normalizeIceServer({ urls: 42 })).toBeNull();
        expect(normalizeIceServer({ urls: 'turn:example.org', credential: 1 })).toBeNull();
    });

    it('fails closed for malformed runtime ICE config input', () => {
        const logger = { warn: vi.fn() };

        expect(getRuntimeIceServersFromEnv('', logger)).toEqual([]);
        expect(getRuntimeIceServersFromEnv('{"bad":true}', logger)).toEqual([]);
        expect(getRuntimeIceServersFromEnv('not-json', logger)).toEqual([]);
        expect(logger.warn).toHaveBeenCalled();
    });

    it('filters invalid ICE server entries while preserving valid ones', () => {
        const logger = { warn: vi.fn() };
        const servers = getRuntimeIceServersFromEnv(
            JSON.stringify([
                { urls: 'stun:valid.example.org' },
                { urls: ['turn:valid.example.org'], username: 'user', credential: 'pass' },
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
        expect(
            getAutoUpdaterPolicy({
                disableUpdatesEnv: 'false',
                allowPrereleaseEnv: 'false',
                appVersion: '5.2.11',
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
            })
        ).toEqual({
            enabled: false,
            autoDownload: true,
            allowPrerelease: true,
        });
    });
});
