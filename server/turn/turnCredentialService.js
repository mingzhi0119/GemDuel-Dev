import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';

export const TURN_CREDENTIAL_SERVICE_POLICY_VERSION = 1;
const DEFAULT_TTL_MS = 5 * 60 * 1000;

const TURN_SERVICE_REQUEST_SCHEMA = z
    .object({
        subject: z.string().min(1).default('desktop-shell'),
        client: z.string().min(1).default('electron-main'),
    })
    .passthrough();

const TURN_SERVICE_REFRESH_REQUEST_SCHEMA = z
    .object({
        leaseId: z.string().min(1),
        client: z.string().min(1).default('electron-main'),
    })
    .passthrough();

const TURN_SERVICE_REVOKE_REQUEST_SCHEMA = z
    .object({
        leaseId: z.string().min(1),
        client: z.string().min(1).default('electron-main'),
        reason: z.string().min(1).max(120).optional(),
    })
    .passthrough();

const formatIso = (value) => new Date(value).toISOString();

const jsonResponse = (status, payload) =>
    new Response(JSON.stringify(payload), {
        status,
        headers: {
            'content-type': 'application/json',
        },
    });

const parseBearerToken = (authorization) => {
    if (typeof authorization !== 'string') {
        return '';
    }

    const match = authorization.match(/^Bearer\s+(.+)$/i);
    return match ? match[1] : authorization.trim();
};

const matchesToken = (candidate, expected) => {
    if (typeof candidate !== 'string' || candidate.length === 0) {
        return false;
    }

    const candidateBuffer = Buffer.from(candidate);
    const expectedBuffer = Buffer.from(expected);
    if (candidateBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return timingSafeEqual(candidateBuffer, expectedBuffer);
};

export class TurnCredentialServiceError extends Error {
    constructor({ status = 500, reasonCode, message }) {
        super(message);
        this.name = 'TurnCredentialServiceError';
        this.status = status;
        this.reasonCode = reasonCode;
    }
}

const createTurnUsername = ({ subject, expiresAtMs }) =>
    `${Math.floor(expiresAtMs / 1000)}:${subject}`;

const createTurnCredential = ({ username, sharedSecret }) =>
    createHmac('sha1', sharedSecret).update(username).digest('base64');

const buildTurnBundle = ({ relayUrls, sharedSecret, subject, issuedAtMs, expiresAtMs }) => {
    const username = createTurnUsername({
        subject,
        expiresAtMs,
    });

    return {
        policyVersion: TURN_CREDENTIAL_SERVICE_POLICY_VERSION,
        iceServers: [
            {
                urls: relayUrls.length === 1 ? relayUrls[0] : relayUrls,
                username,
                credential: createTurnCredential({
                    username,
                    sharedSecret,
                }),
            },
        ],
        issuedAt: formatIso(issuedAtMs),
        expiresAt: formatIso(expiresAtMs),
    };
};

const buildLeaseSnapshot = ({ leaseId, bundle, refreshAfterAt }) => ({
    policyVersion: TURN_CREDENTIAL_SERVICE_POLICY_VERSION,
    leaseId,
    bundle,
    refreshAfterAt,
});

export const createTurnCredentialService = ({
    authTokens,
    relayUrls,
    sharedSecret,
    ttlMs = DEFAULT_TTL_MS,
    now = () => Date.now(),
    randomId = randomUUID,
}) => {
    if (!Array.isArray(authTokens) || authTokens.length === 0) {
        throw new Error('TURN credential service requires at least one auth token.');
    }

    if (!Array.isArray(relayUrls) || relayUrls.length === 0) {
        throw new Error('TURN credential service requires at least one relay URL.');
    }

    if (typeof sharedSecret !== 'string' || sharedSecret.length === 0) {
        throw new Error('TURN credential service requires a shared secret.');
    }

    const normalizedTtlMs = Math.max(60_000, ttlMs);
    const leases = new Map();

    const authorize = (authorization) => {
        const token = parseBearerToken(authorization);
        if (!authTokens.some((expectedToken) => matchesToken(token, expectedToken))) {
            throw new TurnCredentialServiceError({
                status: 401,
                reasonCode: 'TURN_CREDENTIAL_FETCH_FAILED',
                message: 'TURN credential request did not satisfy the authorization policy.',
            });
        }
    };

    const createLease = ({ leaseId, subject, client }) => {
        const issuedAtMs = now();
        const expiresAtMs = issuedAtMs + normalizedTtlMs;
        const refreshAfterAtMs = issuedAtMs + Math.max(30_000, Math.floor(normalizedTtlMs * 0.6));
        const bundle = buildTurnBundle({
            relayUrls,
            sharedSecret,
            subject,
            issuedAtMs,
            expiresAtMs,
        });
        const lease = {
            leaseId,
            subject,
            client,
            bundle,
            issuedAt: bundle.issuedAt,
            expiresAt: bundle.expiresAt,
            refreshAfterAt: formatIso(refreshAfterAtMs),
            revokedAt: null,
            revokeReason: null,
        };

        leases.set(leaseId, lease);
        return lease;
    };

    const issue = ({ authorization, body = {} }) => {
        authorize(authorization);
        const request = TURN_SERVICE_REQUEST_SCHEMA.parse(body);
        return buildLeaseSnapshot(
            createLease({
                leaseId: randomId(),
                subject: request.subject,
                client: request.client,
            })
        );
    };

    const refresh = ({ authorization, body = {} }) => {
        authorize(authorization);
        const request = TURN_SERVICE_REFRESH_REQUEST_SCHEMA.parse(body);
        const existingLease = leases.get(request.leaseId);

        if (!existingLease) {
            throw new TurnCredentialServiceError({
                status: 404,
                reasonCode: 'TURN_CREDENTIAL_REFRESH_FAILED',
                message: 'TURN credential lease was not found.',
            });
        }

        if (existingLease.revokedAt) {
            throw new TurnCredentialServiceError({
                status: 410,
                reasonCode: 'TURN_CREDENTIAL_REVOKED',
                message: 'TURN credential lease was already revoked.',
            });
        }

        if (Date.parse(existingLease.expiresAt) <= now()) {
            throw new TurnCredentialServiceError({
                status: 410,
                reasonCode: 'TURN_CREDENTIAL_BUNDLE_EXPIRED',
                message: 'TURN credential lease expired before it could be refreshed.',
            });
        }

        return buildLeaseSnapshot(
            createLease({
                leaseId: existingLease.leaseId,
                subject: existingLease.subject,
                client: request.client,
            })
        );
    };

    const revoke = ({ authorization, body = {} }) => {
        authorize(authorization);
        const request = TURN_SERVICE_REVOKE_REQUEST_SCHEMA.parse(body);
        const revokedAt = formatIso(now());
        const existingLease = leases.get(request.leaseId);

        if (existingLease) {
            leases.set(request.leaseId, {
                ...existingLease,
                revokedAt,
                revokeReason: request.reason ?? 'client-dispose',
            });
        }

        return {
            policyVersion: TURN_CREDENTIAL_SERVICE_POLICY_VERSION,
            leaseId: request.leaseId,
            revoked: true,
            revokedAt,
        };
    };

    return {
        issue,
        refresh,
        revoke,
        getLease(leaseId) {
            return leases.get(leaseId) ?? null;
        },
    };
};

const readJsonBody = async (request) => {
    try {
        return await request.json();
    } catch {
        throw new TurnCredentialServiceError({
            status: 400,
            reasonCode: 'TURN_CREDENTIAL_BUNDLE_INVALID',
            message: 'TURN credential request body must be valid JSON.',
        });
    }
};

export const handleTurnCredentialServiceRequest = async ({ request, service }) => {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, '');

    if (request.method !== 'POST') {
        return jsonResponse(405, {
            policyVersion: TURN_CREDENTIAL_SERVICE_POLICY_VERSION,
            reasonCode: 'TURN_CREDENTIAL_FETCH_FAILED',
            message: 'TURN credential service only accepts POST requests.',
        });
    }

    try {
        if (pathname.endsWith('/issue')) {
            return jsonResponse(
                200,
                service.issue({
                    authorization: request.headers.get('authorization'),
                    body: await readJsonBody(request),
                })
            );
        }

        if (pathname.endsWith('/refresh')) {
            return jsonResponse(
                200,
                service.refresh({
                    authorization: request.headers.get('authorization'),
                    body: await readJsonBody(request),
                })
            );
        }

        if (pathname.endsWith('/revoke')) {
            return jsonResponse(
                200,
                service.revoke({
                    authorization: request.headers.get('authorization'),
                    body: await readJsonBody(request),
                })
            );
        }

        return jsonResponse(404, {
            policyVersion: TURN_CREDENTIAL_SERVICE_POLICY_VERSION,
            reasonCode: 'TURN_CREDENTIAL_FETCH_FAILED',
            message: 'TURN credential endpoint was not found.',
        });
    } catch (error) {
        if (error instanceof TurnCredentialServiceError) {
            return jsonResponse(error.status, {
                policyVersion: TURN_CREDENTIAL_SERVICE_POLICY_VERSION,
                reasonCode: error.reasonCode,
                message: error.message,
            });
        }

        throw error;
    }
};
