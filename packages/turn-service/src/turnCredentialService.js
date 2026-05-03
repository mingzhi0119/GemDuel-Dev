import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';

export const TURN_CREDENTIAL_SERVICE_POLICY_VERSION = 1;
const DEFAULT_TTL_MS = 5 * 60 * 1000;
const DEFAULT_REQUEST_BODY_LIMIT_BYTES = 8 * 1024;
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const DEFAULT_RATE_LIMIT_MAX_REQUESTS = 60;
const TURN_SERVICE_ROUTES = Object.freeze({
    '/turn/issue': 'issue',
    '/turn/refresh': 'refresh',
    '/turn/revoke': 'revoke',
});

const TURN_SERVICE_REQUEST_SCHEMA = z
    .object({
        subject: z.string().min(1).default('desktop-shell'),
        client: z.string().min(1).default('electron-main'),
    })
    .strict();

const TURN_SERVICE_REFRESH_REQUEST_SCHEMA = z
    .object({
        leaseId: z.string().min(1),
        client: z.string().min(1).default('electron-main'),
    })
    .strict();

const TURN_SERVICE_REVOKE_REQUEST_SCHEMA = z
    .object({
        leaseId: z.string().min(1),
        client: z.string().min(1).default('electron-main'),
        reason: z.string().min(1).max(120).optional(),
    })
    .strict();

const TURN_SERVICE_LEASE_PAYLOAD_SCHEMA = z.object({
    policyVersion: z.literal(TURN_CREDENTIAL_SERVICE_POLICY_VERSION),
    principal: z.string().min(1).default('default'),
    subject: z.string().min(1),
    client: z.string().min(1),
    issuedAtMs: z.number().int().nonnegative(),
    expiresAtMs: z.number().int().positive(),
    nonce: z.string().min(1),
});

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
        return null;
    }

    const match = authorization.match(/^Bearer\s+(\S+)$/i);
    return match ? match[1] : null;
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

const normalizeAuthTokenRecord = (entry, index) => {
    if (typeof entry === 'string') {
        return {
            token: entry,
            principal: 'default',
        };
    }

    if (entry && typeof entry === 'object') {
        return {
            token: entry.token,
            principal: entry.principal ?? entry.subject ?? `principal-${index + 1}`,
        };
    }

    return null;
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

const signLeasePayload = ({ encodedPayload, sharedSecret }) =>
    createHmac('sha256', sharedSecret).update(encodedPayload).digest('base64url');

const createSignedLeaseId = ({ payload, sharedSecret }) => {
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = signLeasePayload({
        encodedPayload,
        sharedSecret,
    });

    return `${encodedPayload}.${signature}`;
};

const verifyLeaseSignature = ({ encodedPayload, signature, sharedSecret }) => {
    const expectedSignature = signLeasePayload({
        encodedPayload,
        sharedSecret,
    });
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    return (
        signatureBuffer.length === expectedBuffer.length &&
        timingSafeEqual(signatureBuffer, expectedBuffer)
    );
};

const parseSignedLeaseId = ({ leaseId, sharedSecret, reasonCode }) => {
    const [encodedPayload, signature, extra] =
        typeof leaseId === 'string' ? leaseId.split('.') : [];

    if (!encodedPayload || !signature || extra) {
        throw new TurnCredentialServiceError({
            status: 404,
            reasonCode,
            message: 'TURN credential lease was not found.',
        });
    }

    if (
        !verifyLeaseSignature({
            encodedPayload,
            signature,
            sharedSecret,
        })
    ) {
        throw new TurnCredentialServiceError({
            status: 404,
            reasonCode,
            message: 'TURN credential lease was not found.',
        });
    }

    try {
        return TURN_SERVICE_LEASE_PAYLOAD_SCHEMA.parse(
            JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'))
        );
    } catch {
        throw new TurnCredentialServiceError({
            status: 404,
            reasonCode,
            message: 'TURN credential lease was not found.',
        });
    }
};

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

const parseServiceBody = (schema, body) => {
    try {
        return schema.parse(body);
    } catch {
        throw new TurnCredentialServiceError({
            status: 400,
            reasonCode: 'TURN_CREDENTIAL_BUNDLE_INVALID',
            message: 'TURN credential request body did not match the governed contract.',
        });
    }
};

export const createTurnCredentialService = ({
    authTokens,
    relayUrls,
    sharedSecret,
    ttlMs = DEFAULT_TTL_MS,
    maxRequestBodyBytes = DEFAULT_REQUEST_BODY_LIMIT_BYTES,
    rateLimitWindowMs = DEFAULT_RATE_LIMIT_WINDOW_MS,
    rateLimitMaxRequests = DEFAULT_RATE_LIMIT_MAX_REQUESTS,
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

    const normalizedAuthTokens = authTokens.map(normalizeAuthTokenRecord).filter(Boolean);
    if (
        normalizedAuthTokens.length !== authTokens.length ||
        normalizedAuthTokens.some(
            (entry) =>
                typeof entry.token !== 'string' ||
                entry.token.length === 0 ||
                typeof entry.principal !== 'string' ||
                entry.principal.length === 0
        )
    ) {
        throw new Error('TURN credential service requires auth tokens with non-empty principals.');
    }

    const normalizedTtlMs = Math.max(60_000, ttlMs);
    const revokedLeases = new Map();
    const rateLimitBuckets = new Map();

    const cleanupRevocations = () => {
        const nowMs = now();
        for (const [leaseId, revokedLease] of revokedLeases.entries()) {
            if (revokedLease.expiresAtMs <= nowMs) {
                revokedLeases.delete(leaseId);
            }
        }
    };

    const buildRateLimitKey = ({ authorization, route }) => {
        const bearerToken = parseBearerToken(authorization) ?? 'anonymous';
        const tokenHash = createHmac('sha256', sharedSecret)
            .update(bearerToken)
            .digest('base64url');
        return `${route}:${tokenHash}`;
    };

    const enforceRateLimit = ({ authorization, route }) => {
        if (rateLimitMaxRequests <= 0) {
            return;
        }

        const windowMs = Math.max(1_000, rateLimitWindowMs);
        const nowMs = now();
        const bucketKey = buildRateLimitKey({
            authorization,
            route,
        });
        const currentBucket = rateLimitBuckets.get(bucketKey);

        if (!currentBucket || currentBucket.resetAtMs <= nowMs) {
            rateLimitBuckets.set(bucketKey, {
                count: 1,
                resetAtMs: nowMs + windowMs,
            });
            return;
        }

        currentBucket.count += 1;
        if (currentBucket.count > rateLimitMaxRequests) {
            throw new TurnCredentialServiceError({
                status: 429,
                reasonCode: 'TURN_CREDENTIAL_RATE_LIMITED',
                message: 'TURN credential request rate limit was exceeded.',
            });
        }
    };

    const authorize = (authorization, reasonCode = 'TURN_CREDENTIAL_FETCH_FAILED') => {
        const token = parseBearerToken(authorization);
        const record = normalizedAuthTokens.find((expectedToken) =>
            matchesToken(token, expectedToken.token)
        );

        if (!record) {
            throw new TurnCredentialServiceError({
                status: 401,
                reasonCode,
                message: 'TURN credential request did not satisfy the authorization policy.',
            });
        }

        return record;
    };

    const readLease = ({ leaseId, reasonCode }) =>
        parseSignedLeaseId({
            leaseId,
            sharedSecret,
            reasonCode,
        });

    const isLeaseRevoked = (leaseId) => {
        cleanupRevocations();
        return revokedLeases.has(leaseId);
    };

    const assertLeasePrincipal = ({ lease, principal, reasonCode }) => {
        if (lease.principal !== principal) {
            throw new TurnCredentialServiceError({
                status: 403,
                reasonCode,
                message: 'TURN credential lease is not owned by the authenticated principal.',
            });
        }
    };

    const createLease = ({ principal, subject, client }) => {
        const issuedAtMs = now();
        const expiresAtMs = issuedAtMs + normalizedTtlMs;
        const refreshAfterAtMs = issuedAtMs + Math.max(30_000, Math.floor(normalizedTtlMs * 0.6));
        const payload = {
            policyVersion: TURN_CREDENTIAL_SERVICE_POLICY_VERSION,
            principal,
            subject,
            client,
            issuedAtMs,
            expiresAtMs,
            nonce: randomId(),
        };
        const leaseId = createSignedLeaseId({
            payload,
            sharedSecret,
        });
        const bundle = buildTurnBundle({
            relayUrls,
            sharedSecret,
            subject,
            issuedAtMs,
            expiresAtMs,
        });
        const lease = {
            leaseId,
            principal,
            subject,
            client,
            bundle,
            issuedAt: bundle.issuedAt,
            expiresAt: bundle.expiresAt,
            refreshAfterAt: formatIso(refreshAfterAtMs),
            revokedAt: null,
            revokeReason: null,
        };

        return lease;
    };

    const issue = ({ authorization, body = {}, route = 'issue' }) => {
        enforceRateLimit({ authorization, route });
        const { principal } = authorize(authorization, 'TURN_CREDENTIAL_FETCH_FAILED');
        const request = parseServiceBody(TURN_SERVICE_REQUEST_SCHEMA, body);
        return buildLeaseSnapshot(
            createLease({
                principal,
                subject: request.subject,
                client: request.client,
            })
        );
    };

    const refresh = ({ authorization, body = {}, route = 'refresh' }) => {
        enforceRateLimit({ authorization, route });
        const { principal } = authorize(authorization, 'TURN_CREDENTIAL_REFRESH_FAILED');
        const request = parseServiceBody(TURN_SERVICE_REFRESH_REQUEST_SCHEMA, body);
        const existingLease = readLease({
            leaseId: request.leaseId,
            reasonCode: 'TURN_CREDENTIAL_REFRESH_FAILED',
        });
        assertLeasePrincipal({
            lease: existingLease,
            principal,
            reasonCode: 'TURN_CREDENTIAL_REFRESH_FAILED',
        });

        if (isLeaseRevoked(request.leaseId)) {
            throw new TurnCredentialServiceError({
                status: 410,
                reasonCode: 'TURN_CREDENTIAL_REVOKED',
                message: 'TURN credential lease was already revoked.',
            });
        }

        if (existingLease.expiresAtMs <= now()) {
            throw new TurnCredentialServiceError({
                status: 410,
                reasonCode: 'TURN_CREDENTIAL_BUNDLE_EXPIRED',
                message: 'TURN credential lease expired before it could be refreshed.',
            });
        }

        return buildLeaseSnapshot(
            createLease({
                principal,
                subject: existingLease.subject,
                client: request.client,
            })
        );
    };

    const revoke = ({ authorization, body = {}, route = 'revoke' }) => {
        enforceRateLimit({ authorization, route });
        const { principal } = authorize(authorization, 'TURN_CREDENTIAL_REVOKE_FAILED');
        const request = parseServiceBody(TURN_SERVICE_REVOKE_REQUEST_SCHEMA, body);
        const existingLease = readLease({
            leaseId: request.leaseId,
            reasonCode: 'TURN_CREDENTIAL_REVOKE_FAILED',
        });
        assertLeasePrincipal({
            lease: existingLease,
            principal,
            reasonCode: 'TURN_CREDENTIAL_REVOKE_FAILED',
        });
        const revokedAt = formatIso(now());
        revokedLeases.set(request.leaseId, {
            ...existingLease,
            revokedAt,
            revokeReason: request.reason ?? 'client-dispose',
        });

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
        maxRequestBodyBytes,
        getLease(leaseId) {
            try {
                const lease = readLease({
                    leaseId,
                    reasonCode: 'TURN_CREDENTIAL_REFRESH_FAILED',
                });
                return {
                    ...lease,
                    revokedAt: revokedLeases.get(leaseId)?.revokedAt ?? null,
                    revokeReason: revokedLeases.get(leaseId)?.revokeReason ?? null,
                };
            } catch {
                return null;
            }
        },
    };
};

const readJsonBody = async (request, maxBodyBytes = DEFAULT_REQUEST_BODY_LIMIT_BYTES) => {
    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (Number.isFinite(contentLength) && contentLength > maxBodyBytes) {
        throw new TurnCredentialServiceError({
            status: 413,
            reasonCode: 'TURN_CREDENTIAL_BODY_TOO_LARGE',
            message: 'TURN credential request body exceeded the governed size limit.',
        });
    }

    const text = await request.text();
    if (Buffer.byteLength(text, 'utf8') > maxBodyBytes) {
        throw new TurnCredentialServiceError({
            status: 413,
            reasonCode: 'TURN_CREDENTIAL_BODY_TOO_LARGE',
            message: 'TURN credential request body exceeded the governed size limit.',
        });
    }

    if (text.trim().length === 0) {
        return {};
    }

    try {
        return JSON.parse(text);
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
    const pathname = url.pathname.replace(/\/+$/, '') || '/';
    const route = TURN_SERVICE_ROUTES[pathname] ?? null;

    if (request.method !== 'POST') {
        return jsonResponse(405, {
            policyVersion: TURN_CREDENTIAL_SERVICE_POLICY_VERSION,
            reasonCode: 'TURN_CREDENTIAL_FETCH_FAILED',
            message: 'TURN credential service only accepts POST requests.',
        });
    }

    try {
        if (route === 'issue') {
            return jsonResponse(
                200,
                service.issue({
                    authorization: request.headers.get('authorization'),
                    body: await readJsonBody(request, service.maxRequestBodyBytes),
                    route,
                })
            );
        }

        if (route === 'refresh') {
            return jsonResponse(
                200,
                service.refresh({
                    authorization: request.headers.get('authorization'),
                    body: await readJsonBody(request, service.maxRequestBodyBytes),
                    route,
                })
            );
        }

        if (route === 'revoke') {
            return jsonResponse(
                200,
                service.revoke({
                    authorization: request.headers.get('authorization'),
                    body: await readJsonBody(request, service.maxRequestBodyBytes),
                    route,
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
