// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import { createTurnCredentialClient } from '../turnCredentialClient.js';

const createJsonResponse = (status: number, payload: unknown) =>
    ({
        ok: status >= 200 && status < 300,
        status,
        json: async () => payload,
    }) as Response;

const asFetch = (mock: ReturnType<typeof vi.fn>) => mock as unknown as typeof fetch;
const asSetTimeout = (mock: ReturnType<typeof vi.fn>) => mock as unknown as typeof setTimeout;
const asClearTimeout = (mock: ReturnType<typeof vi.fn>) => mock as unknown as typeof clearTimeout;
const toRequestUrl = (input: RequestInfo | URL) =>
    typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

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
        const clearTimeoutImpl = vi.fn();
        const recordMainHealth = vi.fn();
        const client = createTurnCredentialClient({
            bundleConfig: '',
            rawIceConfig: JSON.stringify([{ urls: 'stun:legacy.example.com' }]),
            serviceUrlEnv: 'https://relay.example.com/turn',
            serviceTokenEnv: 'service-token',
            fallbackModeEnv: 'allow-runtime-ice',
            fetchImpl: asFetch(fetchImpl),
            now: () => Date.parse('2026-04-20T12:00:00.000Z'),
            setTimeoutImpl: asSetTimeout(setTimeoutImpl),
            clearTimeoutImpl: asClearTimeout(clearTimeoutImpl),
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
            fetchImpl: asFetch(
                vi.fn(async () =>
                    createJsonResponse(
                        200,
                        createLeasePayload({
                            expiresAt: '2026-04-20T11:59:00.000Z',
                        })
                    )
                )
            ),
            now: () => Date.parse('2026-04-20T12:00:00.000Z'),
            setTimeoutImpl: asSetTimeout(vi.fn()),
            clearTimeoutImpl: asClearTimeout(vi.fn()),
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
        const fetchImpl = vi.fn(async (url: RequestInfo | URL) => {
            if (toRequestUrl(url).endsWith('/issue')) {
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
            fetchImpl: asFetch(fetchImpl),
            now: () => Date.parse('2026-04-20T12:00:00.000Z'),
            setTimeoutImpl: asSetTimeout(vi.fn(() => 7)),
            clearTimeoutImpl: asClearTimeout(clearTimeoutImpl),
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

    it('reuses a pending issue request and trims trailing service slashes', async () => {
        let resolveLease!: (value: ReturnType<typeof createJsonResponse>) => void;
        const pendingLease = new Promise<ReturnType<typeof createJsonResponse>>((resolve) => {
            resolveLease = resolve;
        });
        const fetchImpl = vi.fn(() => pendingLease);
        const client = createTurnCredentialClient({
            bundleConfig: '',
            rawIceConfig: JSON.stringify([{ urls: 'stun:legacy.example.com' }]),
            serviceUrlEnv: 'https://relay.example.com/turn///',
            serviceTokenEnv: 'service-token',
            fallbackModeEnv: 'allow-runtime-ice',
            fetchImpl: asFetch(fetchImpl),
            now: () => Date.parse('2026-04-20T12:00:00.000Z'),
            setTimeoutImpl: asSetTimeout(vi.fn(() => 7)),
            clearTimeoutImpl: asClearTimeout(vi.fn()),
            recordMainHealth: vi.fn(),
        });

        const first = client.getRuntimeRelayProfile();
        const second = client.getRuntimeRelayProfile();
        resolveLease(createJsonResponse(200, createLeasePayload()));

        await expect(first).resolves.toMatchObject({ source: 'online-turn-service' });
        await expect(second).resolves.toMatchObject({ source: 'online-turn-service' });
        expect(fetchImpl).toHaveBeenCalledTimes(1);
        expect(fetchImpl).toHaveBeenCalledWith(
            'https://relay.example.com/turn/issue',
            expect.any(Object)
        );
    });

    it('falls back when the service returns invalid JSON or an invalid governed schema', async () => {
        const recordMainHealth = vi.fn();
        const invalidJsonClient = createTurnCredentialClient({
            bundleConfig: '',
            rawIceConfig: JSON.stringify([{ urls: 'stun:legacy.example.com' }]),
            serviceUrlEnv: 'https://relay.example.com/turn',
            serviceTokenEnv: 'service-token',
            fallbackModeEnv: 'allow-runtime-ice',
            fetchImpl: asFetch(
                vi.fn(
                    async () =>
                        ({
                            ok: true,
                            status: 200,
                            json: async () => {
                                throw new Error('not-json');
                            },
                        }) as unknown as Response
                )
            ),
            now: () => Date.parse('2026-04-20T12:00:00.000Z'),
            setTimeoutImpl: asSetTimeout(vi.fn()),
            clearTimeoutImpl: asClearTimeout(vi.fn()),
            recordMainHealth,
        });

        await expect(invalidJsonClient.getRuntimeRelayProfile()).resolves.toMatchObject({
            source: 'runtime-ice-fallback',
        });

        const invalidSchemaClient = createTurnCredentialClient({
            bundleConfig: '',
            rawIceConfig: JSON.stringify([{ urls: 'stun:legacy.example.com' }]),
            serviceUrlEnv: 'https://relay.example.com/turn',
            serviceTokenEnv: 'service-token',
            fallbackModeEnv: 'allow-runtime-ice',
            fetchImpl: asFetch(
                vi.fn(async () =>
                    createJsonResponse(200, {
                        leaseId: 'lease-1',
                        bundle: {
                            policyVersion: 1,
                            iceServers: [],
                            issuedAt: '2026-04-20T12:00:00.000Z',
                            expiresAt: '2026-04-20T12:05:00.000Z',
                        },
                    })
                )
            ),
            now: () => Date.parse('2026-04-20T12:00:00.000Z'),
            setTimeoutImpl: asSetTimeout(vi.fn()),
            clearTimeoutImpl: asClearTimeout(vi.fn()),
            recordMainHealth,
        });

        await expect(invalidSchemaClient.getRuntimeRelayProfile()).resolves.toMatchObject({
            source: 'runtime-ice-fallback',
        });
        expect(recordMainHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'TURN_CREDENTIAL_FETCH_FAILED',
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
            fetchImpl: asFetch(
                vi.fn(async () => {
                    throw new Error('network down');
                })
            ),
            now: () => Date.parse('2026-04-20T12:00:00.000Z'),
            setTimeoutImpl: asSetTimeout(vi.fn()),
            clearTimeoutImpl: asClearTimeout(vi.fn()),
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

    it('uses fallback behavior when refresh is invoked before any lease exists or the service is disabled', async () => {
        const allowRuntimeIceClient = createTurnCredentialClient({
            bundleConfig: '',
            rawIceConfig: JSON.stringify([{ urls: 'stun:legacy.example.com' }]),
            serviceUrlEnv: 'https://relay.example.com/turn',
            serviceTokenEnv: 'service-token',
            fallbackModeEnv: 'allow-runtime-ice',
            fetchImpl: asFetch(vi.fn(async () => createJsonResponse(200, createLeasePayload()))),
            now: () => Date.parse('2026-04-20T12:00:00.000Z'),
            setTimeoutImpl: asSetTimeout(vi.fn(() => 7)),
            clearTimeoutImpl: asClearTimeout(vi.fn()),
            recordMainHealth: vi.fn(),
        });

        await expect(allowRuntimeIceClient.refreshRuntimeRelayProfile()).resolves.toMatchObject({
            source: 'online-turn-service',
        });

        const disabledClient = createTurnCredentialClient({
            bundleConfig: '',
            rawIceConfig: JSON.stringify([{ urls: 'stun:legacy.example.com' }]),
            serviceUrlEnv: '',
            serviceTokenEnv: '',
            fallbackModeEnv: 'allow-runtime-ice',
            fetchImpl: asFetch(vi.fn()),
            now: () => Date.parse('2026-04-20T12:00:00.000Z'),
            setTimeoutImpl: asSetTimeout(vi.fn()),
            clearTimeoutImpl: asClearTimeout(vi.fn()),
            recordMainHealth: vi.fn(),
        });

        await expect(disabledClient.refreshRuntimeRelayProfile()).resolves.toMatchObject({
            source: 'runtime-ice-fallback',
        });
        await expect(disabledClient.revokeRuntimeRelayProfile()).resolves.toEqual({
            policyVersion: 1,
            source: 'default-stun',
            iceServers: [],
            issuedAt: null,
            expiresAt: null,
        });
    });

    it('revokes the active lease and clears the runtime relay profile', async () => {
        const recordMainHealth = vi.fn();
        const fetchImpl = vi.fn(async (url: RequestInfo | URL) => {
            if (toRequestUrl(url).endsWith('/issue')) {
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
            fetchImpl: asFetch(fetchImpl),
            now: () => Date.parse('2026-04-20T12:00:00.000Z'),
            setTimeoutImpl: asSetTimeout(vi.fn(() => 7)),
            clearTimeoutImpl: asClearTimeout(vi.fn()),
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
