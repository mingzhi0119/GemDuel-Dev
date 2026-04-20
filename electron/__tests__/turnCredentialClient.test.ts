// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import { createTurnCredentialClient } from '../turnCredentialClient.js';

const createJsonResponse = (status: number, payload: unknown) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
});

const createLeasePayload = ({
    leaseId = 'lease-1',
    issuedAt = '2026-04-20T12:00:00.000Z',
    expiresAt = '2026-04-20T12:05:00.000Z',
    refreshAfterAt = '2026-04-20T12:03:00.000Z',
} = {}) => ({
    policyVersion: 1,
    leaseId,
    bundle: {
        policyVersion: 1,
        iceServers: [
            {
                urls: ['turns:relay.example.com:443?transport=tcp'],
                username: 'lease-user',
                credential: 'lease-pass',
            },
        ],
        issuedAt,
        expiresAt,
    },
    refreshAfterAt,
});

describe('turn credential client', () => {
    it('prefers the online TURN service and caches the active lease', async () => {
        const fetchImpl = vi.fn(async () => createJsonResponse(200, createLeasePayload()));
        const setTimeoutImpl = vi.fn(() => 7);
        const recordMainHealth = vi.fn();
        const client = createTurnCredentialClient({
            bundleConfig: '',
            rawIceConfig: JSON.stringify([{ urls: 'stun:legacy.example.com' }]),
            serviceUrlEnv: 'https://relay.example.com/turn',
            serviceTokenEnv: 'service-token',
            fallbackModeEnv: 'allow-runtime-ice',
            fetchImpl,
            now: () => Date.parse('2026-04-20T12:00:00.000Z'),
            setTimeoutImpl,
            clearTimeoutImpl: vi.fn(),
            recordMainHealth,
        });

        const profile = await client.getRuntimeRelayProfile();
        const cachedProfile = await client.getRuntimeRelayProfile();

        expect(profile).toMatchObject({
            source: 'online-turn-service',
            expiresAt: '2026-04-20T12:05:00.000Z',
        });
        expect(cachedProfile).toEqual(profile);
        expect(fetchImpl).toHaveBeenCalledTimes(1);
        expect(fetchImpl).toHaveBeenCalledWith(
            'https://relay.example.com/turn/issue',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    authorization: 'Bearer service-token',
                }),
            })
        );
        expect(setTimeoutImpl).toHaveBeenCalledTimes(1);
        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'TURN_CREDENTIAL_FETCHED',
                category: 'runtime',
            })
        );
    });

    it('fails over to the next governed relay source when the fetched bundle is already expired', async () => {
        const recordMainHealth = vi.fn();
        const client = createTurnCredentialClient({
            bundleConfig: '',
            rawIceConfig: JSON.stringify([{ urls: 'stun:legacy.example.com' }]),
            serviceUrlEnv: 'https://relay.example.com/turn',
            serviceTokenEnv: 'service-token',
            fallbackModeEnv: 'allow-runtime-ice',
            fetchImpl: vi.fn(async () =>
                createJsonResponse(
                    200,
                    createLeasePayload({
                        expiresAt: '2026-04-20T11:59:00.000Z',
                    })
                )
            ),
            now: () => Date.parse('2026-04-20T12:00:00.000Z'),
            setTimeoutImpl: vi.fn(),
            clearTimeoutImpl: vi.fn(),
            recordMainHealth,
        });

        await expect(client.getRuntimeRelayProfile()).resolves.toMatchObject({
            source: 'runtime-ice-fallback',
        });
        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'TURN_CREDENTIAL_FETCH_FAILED',
                context: expect.objectContaining({
                    reasonCode: 'TURN_CREDENTIAL_BUNDLE_EXPIRED',
                }),
            })
        );
    });

    it('falls back when refresh fails after a lease was already issued', async () => {
        const recordMainHealth = vi.fn();
        const fetchImpl = vi.fn(async (url: string) => {
            if (url.endsWith('/issue')) {
                return createJsonResponse(200, createLeasePayload());
            }

            return createJsonResponse(503, {
                reasonCode: 'TURN_CREDENTIAL_REFRESH_FAILED',
                message: 'refresh failed',
            });
        });
        const clearTimeoutImpl = vi.fn();
        const client = createTurnCredentialClient({
            bundleConfig: '',
            rawIceConfig: JSON.stringify([{ urls: 'stun:legacy.example.com' }]),
            serviceUrlEnv: 'https://relay.example.com/turn',
            serviceTokenEnv: 'service-token',
            fallbackModeEnv: 'allow-runtime-ice',
            fetchImpl,
            now: () => Date.parse('2026-04-20T12:00:00.000Z'),
            setTimeoutImpl: vi.fn(() => 7),
            clearTimeoutImpl,
            recordMainHealth,
        });

        await client.getRuntimeRelayProfile();
        await expect(client.refreshRuntimeRelayProfile()).resolves.toMatchObject({
            source: 'runtime-ice-fallback',
        });
        expect(clearTimeoutImpl).toHaveBeenCalled();
        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'TURN_CREDENTIAL_REFRESH_FAILED',
                context: expect.objectContaining({
                    reasonCode: 'TURN_CREDENTIAL_REFRESH_FAILED',
                }),
            })
        );
    });

    it('returns the fail-closed STUN baseline when fallback deny is enabled', async () => {
        const recordMainHealth = vi.fn();
        const client = createTurnCredentialClient({
            bundleConfig: JSON.stringify({
                policyVersion: 1,
                iceServers: [
                    {
                        urls: ['turns:legacy.example.com:443?transport=tcp'],
                        username: 'legacy-user',
                        credential: 'legacy-pass',
                    },
                ],
                issuedAt: '2026-04-20T11:50:00.000Z',
                expiresAt: '2026-04-20T12:50:00.000Z',
            }),
            rawIceConfig: JSON.stringify([{ urls: 'stun:legacy.example.com' }]),
            serviceUrlEnv: 'https://relay.example.com/turn',
            serviceTokenEnv: 'service-token',
            fallbackModeEnv: 'deny-runtime-ice',
            fetchImpl: vi.fn(async () => {
                throw new Error('network down');
            }),
            now: () => Date.parse('2026-04-20T12:00:00.000Z'),
            setTimeoutImpl: vi.fn(),
            clearTimeoutImpl: vi.fn(),
            recordMainHealth,
        });

        await expect(client.getRuntimeRelayProfile()).resolves.toEqual({
            policyVersion: 1,
            source: 'default-stun',
            iceServers: [],
            issuedAt: null,
            expiresAt: null,
        });
        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'TURN_CREDENTIAL_FALLBACK_DENIED',
                severity: 'error',
                context: expect.objectContaining({
                    reasonCode: 'TURN_CREDENTIAL_FALLBACK_DENIED',
                }),
            })
        );
    });

    it('revokes the active lease and clears the runtime relay profile', async () => {
        const recordMainHealth = vi.fn();
        const fetchImpl = vi.fn(async (url: string) => {
            if (url.endsWith('/issue')) {
                return createJsonResponse(200, createLeasePayload());
            }

            return createJsonResponse(200, {
                policyVersion: 1,
                leaseId: 'lease-1',
                revoked: true,
                revokedAt: '2026-04-20T12:01:00.000Z',
            });
        });
        const client = createTurnCredentialClient({
            bundleConfig: '',
            rawIceConfig: JSON.stringify([{ urls: 'stun:legacy.example.com' }]),
            serviceUrlEnv: 'https://relay.example.com/turn',
            serviceTokenEnv: 'service-token',
            fallbackModeEnv: 'allow-runtime-ice',
            fetchImpl,
            now: () => Date.parse('2026-04-20T12:00:00.000Z'),
            setTimeoutImpl: vi.fn(() => 7),
            clearTimeoutImpl: vi.fn(),
            recordMainHealth,
        });

        await client.getRuntimeRelayProfile();
        await expect(client.revokeRuntimeRelayProfile()).resolves.toEqual({
            policyVersion: 1,
            source: 'default-stun',
            iceServers: [],
            issuedAt: null,
            expiresAt: null,
        });
        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'TURN_CREDENTIAL_REVOKED',
                context: expect.objectContaining({
                    reasonCode: 'TURN_CREDENTIAL_REVOKED',
                }),
            })
        );
    });
});
