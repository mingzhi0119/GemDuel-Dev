// @vitest-environment node

import { describe, expect, it } from 'vitest';
import {
    TurnCredentialServiceError,
    createTurnCredentialService,
    handleTurnCredentialServiceRequest,
} from '../turnCredentialService.js';

describe('turn credential service', () => {
    it('issues authenticated short-lived leases and rotates them on refresh', () => {
        let nowMs = Date.parse('2026-04-20T12:00:00.000Z');
        const service = createTurnCredentialService({
            authTokens: ['service-token'],
            relayUrls: ['turns:relay.example.com:443?transport=tcp'],
            sharedSecret: 'shared-secret',
            ttlMs: 60_000,
            now: () => nowMs,
            randomId: () => '00000000-0000-4000-8000-000000000001',
        });

        const issued = service.issue({
            authorization: 'Bearer service-token',
            body: {
                subject: 'player-1',
                client: 'vitest',
            },
        });

        expect(issued).toMatchObject({
            policyVersion: 1,
            leaseId: expect.stringContaining('.'),
            bundle: {
                policyVersion: 1,
                issuedAt: '2026-04-20T12:00:00.000Z',
                expiresAt: '2026-04-20T12:01:00.000Z',
            },
        });
        expect(issued.bundle.iceServers[0]).toMatchObject({
            urls: 'turns:relay.example.com:443?transport=tcp',
        });

        nowMs += 20_000;
        const refreshed = service.refresh({
            authorization: 'Bearer service-token',
            body: {
                leaseId: issued.leaseId,
                client: 'vitest',
            },
        });

        expect(refreshed.leaseId).not.toBe(issued.leaseId);
        expect(refreshed.bundle.issuedAt).toBe('2026-04-20T12:00:20.000Z');
        expect(refreshed.bundle.expiresAt).toBe('2026-04-20T12:01:20.000Z');
        expect(refreshed.bundle.iceServers[0]?.credential).not.toBe(
            issued.bundle.iceServers[0]?.credential
        );
    });

    it('fails closed once a lease is revoked or expires', () => {
        let nowMs = Date.parse('2026-04-20T12:00:00.000Z');
        const service = createTurnCredentialService({
            authTokens: ['service-token'],
            relayUrls: ['turn:relay.example.com:3478'],
            sharedSecret: 'shared-secret',
            ttlMs: 60_000,
            now: () => nowMs,
            randomId: () => '00000000-0000-4000-8000-000000000001',
        });

        const issued = service.issue({
            authorization: 'Bearer service-token',
            body: {
                subject: 'player-1',
                client: 'vitest',
            },
        });
        service.revoke({
            authorization: 'Bearer service-token',
            body: {
                leaseId: issued.leaseId,
                client: 'vitest',
            },
        });

        expect(() =>
            service.refresh({
                authorization: 'Bearer service-token',
                body: {
                    leaseId: issued.leaseId,
                    client: 'vitest',
                },
            })
        ).toThrowError(TurnCredentialServiceError);

        const revokedError = (() => {
            try {
                service.refresh({
                    authorization: 'Bearer service-token',
                    body: {
                        leaseId: issued.leaseId,
                        client: 'vitest',
                    },
                });
                return null;
            } catch (error) {
                return error as TurnCredentialServiceError;
            }
        })();

        expect(revokedError?.reasonCode).toBe('TURN_CREDENTIAL_REVOKED');

        const expiringService = createTurnCredentialService({
            authTokens: ['service-token'],
            relayUrls: ['turn:relay.example.com:3478'],
            sharedSecret: 'shared-secret',
            ttlMs: 60_000,
            now: () => nowMs,
            randomId: () => '00000000-0000-4000-8000-000000000002',
        });

        const expiringLease = expiringService.issue({
            authorization: 'Bearer service-token',
            body: {
                subject: 'player-2',
                client: 'vitest',
            },
        });
        nowMs += 61_000;

        const expiredError = (() => {
            try {
                expiringService.refresh({
                    authorization: 'Bearer service-token',
                    body: {
                        leaseId: expiringLease.leaseId,
                        client: 'vitest',
                    },
                });
                return null;
            } catch (error) {
                return error as TurnCredentialServiceError;
            }
        })();

        expect(expiredError?.reasonCode).toBe('TURN_CREDENTIAL_BUNDLE_EXPIRED');
    });

    it('serves issue, refresh, and revoke over the governed HTTP handler', async () => {
        let nowMs = Date.parse('2026-04-20T12:00:00.000Z');
        const service = createTurnCredentialService({
            authTokens: ['service-token'],
            relayUrls: ['turns:relay.example.com:443?transport=tcp'],
            sharedSecret: 'shared-secret',
            ttlMs: 60_000,
            now: () => nowMs,
            randomId: () => '00000000-0000-4000-8000-000000000001',
        });

        const unauthorized = await handleTurnCredentialServiceRequest({
            request: new Request('https://relay.example.com/turn/issue', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    subject: 'player-1',
                    client: 'vitest',
                }),
            }),
            service,
        });

        expect(unauthorized.status).toBe(401);
        await expect(unauthorized.json()).resolves.toMatchObject({
            reasonCode: 'TURN_CREDENTIAL_FETCH_FAILED',
        });

        const issued = await handleTurnCredentialServiceRequest({
            request: new Request('https://relay.example.com/turn/issue', {
                method: 'POST',
                headers: {
                    authorization: 'Bearer service-token',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    subject: 'player-1',
                    client: 'vitest',
                }),
            }),
            service,
        });

        expect(issued.status).toBe(200);
        const issuedBody = await issued.json();
        expect(issuedBody).toMatchObject({
            leaseId: expect.stringContaining('.'),
        });

        nowMs += 10_000;
        const revoked = await handleTurnCredentialServiceRequest({
            request: new Request('https://relay.example.com/turn/revoke', {
                method: 'POST',
                headers: {
                    authorization: 'Bearer service-token',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    leaseId: issuedBody.leaseId,
                    client: 'vitest',
                }),
            }),
            service,
        });

        expect(revoked.status).toBe(200);
        await expect(revoked.json()).resolves.toMatchObject({
            leaseId: issuedBody.leaseId,
            revoked: true,
        });
    });

    it('requires Bearer auth, exact /turn routes, and governed JSON body size', async () => {
        const service = createTurnCredentialService({
            authTokens: ['service-token'],
            relayUrls: ['turns:relay.example.com:443?transport=tcp'],
            sharedSecret: 'shared-secret',
            maxRequestBodyBytes: 64,
        });

        const nonBearer = await handleTurnCredentialServiceRequest({
            request: new Request('https://relay.example.com/turn/issue', {
                method: 'POST',
                headers: {
                    authorization: 'service-token',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({}),
            }),
            service,
        });
        expect(nonBearer.status).toBe(401);

        const suffixRoute = await handleTurnCredentialServiceRequest({
            request: new Request('https://relay.example.com/api/turn/issue', {
                method: 'POST',
                headers: {
                    authorization: 'Bearer service-token',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({}),
            }),
            service,
        });
        expect(suffixRoute.status).toBe(404);

        const oversizedBody = await handleTurnCredentialServiceRequest({
            request: new Request('https://relay.example.com/turn/issue', {
                method: 'POST',
                headers: {
                    authorization: 'Bearer service-token',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    subject: 'x'.repeat(120),
                }),
            }),
            service,
        });
        expect(oversizedBody.status).toBe(413);
        await expect(oversizedBody.json()).resolves.toMatchObject({
            reasonCode: 'TURN_CREDENTIAL_BODY_TOO_LARGE',
        });
    });

    it('rate-limits repeated credential requests before issuing more leases', () => {
        const service = createTurnCredentialService({
            authTokens: ['service-token'],
            relayUrls: ['turns:relay.example.com:443?transport=tcp'],
            sharedSecret: 'shared-secret',
            rateLimitWindowMs: 60_000,
            rateLimitMaxRequests: 1,
        });

        service.issue({
            authorization: 'Bearer service-token',
            body: {
                subject: 'player-1',
                client: 'vitest',
            },
        });

        const limitedError = (() => {
            try {
                service.issue({
                    authorization: 'Bearer service-token',
                    body: {
                        subject: 'player-2',
                        client: 'vitest',
                    },
                });
                return null;
            } catch (error) {
                return error as TurnCredentialServiceError;
            }
        })();

        expect(limitedError?.status).toBe(429);
        expect(limitedError?.reasonCode).toBe('TURN_CREDENTIAL_RATE_LIMITED');
    });
});
