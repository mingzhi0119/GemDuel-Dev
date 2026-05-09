// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { createTurnClientError, sendTurnCredentialRequest } from '../turnCredentialHttp.js';

const schema = z.object({ ok: z.literal(true) }).strict();

const createResponse = (status: number, payload: unknown) =>
    ({
        ok: status >= 200 && status < 300,
        status,
        json: async () => payload,
    }) as Response;

describe('turn credential HTTP request helper', () => {
    it('rejects disabled service configs before attempting fetch', async () => {
        const fetchImpl = vi.fn();

        await expect(
            sendTurnCredentialRequest({
                serviceConfig: { enabled: false, serviceUrl: '', serviceToken: '' },
                fetchImpl,
                requestTimeoutMs: 100,
                requestSetTimeoutImpl: vi.fn(),
                requestClearTimeoutImpl: vi.fn(),
                path: 'issue',
                body: {},
                schema,
                failureReasonCode: 'TURN_CREDENTIAL_FETCH_FAILED',
            })
        ).rejects.toMatchObject({
            reasonCode: 'TURN_CREDENTIAL_FETCH_FAILED',
            message: 'TURN credential service is not enabled for this desktop runtime.',
        });
        expect(fetchImpl).not.toHaveBeenCalled();
    });

    it('sends bearer JSON requests without timeout plumbing when timeout is disabled', async () => {
        const fetchImpl = vi.fn(async () => createResponse(200, { ok: true }));
        const requestSetTimeoutImpl = vi.fn();
        const requestClearTimeoutImpl = vi.fn();

        await expect(
            sendTurnCredentialRequest({
                serviceConfig: {
                    enabled: true,
                    serviceUrl: 'https://relay.example.com/turn///',
                    serviceToken: 'service-token',
                },
                fetchImpl,
                requestTimeoutMs: 0,
                requestSetTimeoutImpl,
                requestClearTimeoutImpl,
                path: 'issue',
                body: { roomId: 'room-1' },
                schema,
                failureReasonCode: 'TURN_CREDENTIAL_FETCH_FAILED',
            })
        ).resolves.toEqual({ ok: true });

        expect(fetchImpl).toHaveBeenCalledWith(
            'https://relay.example.com/turn/issue',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    authorization: 'Bearer service-token',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ roomId: 'room-1' }),
            })
        );
        expect(requestSetTimeoutImpl).not.toHaveBeenCalled();
        expect(requestClearTimeoutImpl).not.toHaveBeenCalled();
    });

    it('preserves governed request errors and wraps unknown fetch failures', async () => {
        const governedError = createTurnClientError(
            'TURN_CREDENTIAL_FETCH_FAILED',
            'service timed out'
        );

        await expect(
            sendTurnCredentialRequest({
                serviceConfig: {
                    enabled: true,
                    serviceUrl: 'https://relay.example.com/turn',
                    serviceToken: 'service-token',
                },
                fetchImpl: vi.fn(async () => {
                    throw governedError;
                }),
                requestTimeoutMs: 0,
                requestSetTimeoutImpl: vi.fn(),
                requestClearTimeoutImpl: vi.fn(),
                path: 'issue',
                body: {},
                schema,
                failureReasonCode: 'TURN_CREDENTIAL_FETCH_FAILED',
            })
        ).rejects.toBe(governedError);

        await expect(
            sendTurnCredentialRequest({
                serviceConfig: {
                    enabled: true,
                    serviceUrl: 'https://relay.example.com/turn',
                    serviceToken: 'service-token',
                },
                fetchImpl: vi.fn(async () => {
                    throw new Error('network down');
                }),
                requestTimeoutMs: 0,
                requestSetTimeoutImpl: vi.fn(),
                requestClearTimeoutImpl: vi.fn(),
                path: 'issue',
                body: {},
                schema,
                failureReasonCode: 'TURN_CREDENTIAL_FETCH_FAILED',
            })
        ).rejects.toMatchObject({
            reasonCode: 'TURN_CREDENTIAL_FETCH_FAILED',
            message: 'TURN credential request could not reach the online service.',
        });
    });

    it('normalizes non-JSON, rejected, and schema-invalid responses into governed errors', async () => {
        const baseOptions = {
            serviceConfig: {
                enabled: true,
                serviceUrl: 'https://relay.example.com/turn',
                serviceToken: 'service-token',
            },
            requestTimeoutMs: 0,
            requestSetTimeoutImpl: vi.fn(),
            requestClearTimeoutImpl: vi.fn(),
            path: 'issue',
            body: {},
            schema,
            failureReasonCode: 'TURN_CREDENTIAL_FETCH_FAILED',
        };

        await expect(
            sendTurnCredentialRequest({
                ...baseOptions,
                fetchImpl: vi.fn(
                    async () =>
                        ({
                            ok: true,
                            json: async () => {
                                throw new Error('invalid json');
                            },
                        }) as unknown as Response
                ),
            })
        ).rejects.toMatchObject({
            reasonCode: 'TURN_CREDENTIAL_BUNDLE_INVALID',
        });

        await expect(
            sendTurnCredentialRequest({
                ...baseOptions,
                fetchImpl: vi.fn(async () =>
                    createResponse(503, {
                        reasonCode: 'TURN_CREDENTIAL_REFRESH_FAILED',
                        message: 'refresh rejected',
                    })
                ),
            })
        ).rejects.toMatchObject({
            reasonCode: 'TURN_CREDENTIAL_REFRESH_FAILED',
            message: 'refresh rejected',
        });

        await expect(
            sendTurnCredentialRequest({
                ...baseOptions,
                fetchImpl: vi.fn(async () => createResponse(200, { ok: false })),
            })
        ).rejects.toMatchObject({
            reasonCode: 'TURN_CREDENTIAL_BUNDLE_INVALID',
            message: 'TURN credential service returned a payload outside the governed contract.',
        });
    });
});
