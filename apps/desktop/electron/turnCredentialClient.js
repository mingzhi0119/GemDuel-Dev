import {
    TURN_CREDENTIAL_LEASE_SCHEMA,
    TURN_CREDENTIAL_REVOKE_RESULT_SCHEMA,
    buildRuntimeRelayProfile,
    getRuntimeRelayProfileFromEnv,
    getTurnCredentialServiceConfig,
} from './runtimeConfig.js';

const REFRESH_BUFFER_MS = 30_000;

const hasExpired = (isoTimestamp, nowMs) =>
    typeof isoTimestamp !== 'string' || Number.isNaN(Date.parse(isoTimestamp))
        ? true
        : Date.parse(isoTimestamp) <= nowMs;

const normalizeServiceUrl = (serviceUrl) => serviceUrl.replace(/\/+$/, '');

const buildDefaultRelayProfile = () =>
    buildRuntimeRelayProfile({
        source: 'default-stun',
        iceServers: [],
    });

const createTurnClientError = (reasonCode, message, cause) => ({
    reasonCode,
    message,
    cause,
});

export const createTurnCredentialClient = ({
    bundleConfig,
    rawIceConfig,
    serviceUrlEnv,
    serviceTokenEnv,
    fallbackModeEnv,
    logger = console,
    fetchImpl = globalThis.fetch,
    now = () => Date.now(),
    recordMainHealth = () => undefined,
    setTimeoutImpl = globalThis.setTimeout,
    clearTimeoutImpl = globalThis.clearTimeout,
}) => {
    const serviceConfig = getTurnCredentialServiceConfig({
        serviceUrlEnv,
        serviceTokenEnv,
        fallbackModeEnv,
        logger,
    });

    let activeLease = null;
    let pendingRequest = null;
    let refreshTimeout = null;

    const recordRuntimeHealth = ({ name, severity, message, reasonCode, context = {} }) =>
        recordMainHealth({
            category: 'runtime',
            name,
            severity,
            message,
            context: {
                ...(reasonCode ? { reasonCode } : {}),
                ...context,
            },
        });

    const clearRefreshTimer = () => {
        if (refreshTimeout !== null && typeof clearTimeoutImpl === 'function') {
            clearTimeoutImpl(refreshTimeout);
        }
        refreshTimeout = null;
    };

    const fallbackProfile = () =>
        getRuntimeRelayProfileFromEnv(bundleConfig, rawIceConfig, logger, now);

    const handleFailure = ({ operation, failure }) => {
        activeLease = null;
        clearRefreshTimer();

        if (serviceConfig.fallbackMode === 'deny-runtime-ice') {
            recordRuntimeHealth({
                name: 'TURN_CREDENTIAL_FALLBACK_DENIED',
                severity: 'error',
                message:
                    'Online TURN credential acquisition failed and the governed runtime denied legacy relay fallback.',
                reasonCode: 'TURN_CREDENTIAL_FALLBACK_DENIED',
                context: {
                    operation,
                    upstreamReasonCode: failure.reasonCode ?? null,
                },
            });
            return buildDefaultRelayProfile();
        }

        const profile = fallbackProfile();
        recordRuntimeHealth({
            name:
                operation === 'refresh'
                    ? 'TURN_CREDENTIAL_REFRESH_FAILED'
                    : 'TURN_CREDENTIAL_FETCH_FAILED',
            severity: 'warn',
            message:
                operation === 'refresh'
                    ? 'Online TURN credential refresh failed; runtime relay policy fell back to the next governed source.'
                    : 'Online TURN credential fetch failed; runtime relay policy fell back to the next governed source.',
            reasonCode:
                failure.reasonCode ??
                (operation === 'refresh'
                    ? 'TURN_CREDENTIAL_REFRESH_FAILED'
                    : 'TURN_CREDENTIAL_FETCH_FAILED'),
            context: {
                operation,
                fallbackSource: profile.source,
            },
        });
        return profile;
    };

    const toRuntimeRelayProfile = (lease) =>
        buildRuntimeRelayProfile({
            source: 'online-turn-service',
            iceServers: lease.bundle.iceServers,
            issuedAt: lease.bundle.issuedAt,
            expiresAt: lease.bundle.expiresAt,
        });

    const scheduleRefresh = (lease) => {
        clearRefreshTimer();
        if (typeof setTimeoutImpl !== 'function') {
            return;
        }

        const refreshAtMs = Date.parse(lease.refreshAfterAt);
        const expiresAtMs = Date.parse(lease.bundle.expiresAt);
        const targetAtMs = Math.min(refreshAtMs, expiresAtMs - REFRESH_BUFFER_MS);
        const delayMs = Math.max(0, targetAtMs - now());

        refreshTimeout = setTimeoutImpl(() => {
            void refreshRuntimeRelayProfile();
        }, delayMs);
    };

    const sendRequest = async ({ path, body, schema, failureReasonCode }) => {
        if (!serviceConfig.enabled || typeof fetchImpl !== 'function') {
            throw createTurnClientError(
                failureReasonCode,
                'TURN credential service is not enabled for this desktop runtime.'
            );
        }

        let response;
        try {
            response = await fetchImpl(`${normalizeServiceUrl(serviceConfig.serviceUrl)}/${path}`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${serviceConfig.serviceToken}`,
                    'content-type': 'application/json',
                },
                body: JSON.stringify(body),
            });
        } catch (error) {
            throw createTurnClientError(
                failureReasonCode,
                'TURN credential request could not reach the online service.',
                error
            );
        }

        let payload = null;
        try {
            payload = await response.json();
        } catch (error) {
            throw createTurnClientError(
                'TURN_CREDENTIAL_BUNDLE_INVALID',
                'TURN credential service returned a non-JSON payload.',
                error
            );
        }

        if (!response.ok) {
            throw createTurnClientError(
                typeof payload?.reasonCode === 'string' ? payload.reasonCode : failureReasonCode,
                typeof payload?.message === 'string'
                    ? payload.message
                    : 'TURN credential service rejected the request.'
            );
        }

        const parsed = schema.safeParse(payload);
        if (!parsed.success) {
            throw createTurnClientError(
                'TURN_CREDENTIAL_BUNDLE_INVALID',
                'TURN credential service returned a payload outside the governed contract.'
            );
        }

        return parsed.data;
    };

    const issueRuntimeRelayProfile = async () => {
        const lease = await sendRequest({
            path: 'issue',
            body: {
                subject: 'desktop-shell',
                client: 'electron-main',
            },
            schema: TURN_CREDENTIAL_LEASE_SCHEMA,
            failureReasonCode: 'TURN_CREDENTIAL_FETCH_FAILED',
        });

        if (hasExpired(lease.bundle.expiresAt, now())) {
            throw createTurnClientError(
                'TURN_CREDENTIAL_BUNDLE_EXPIRED',
                'TURN credential bundle arrived already expired.'
            );
        }

        activeLease = lease;
        scheduleRefresh(lease);
        recordRuntimeHealth({
            name: 'TURN_CREDENTIAL_FETCHED',
            severity: 'info',
            message: 'Desktop runtime fetched an online short-lived TURN credential lease.',
            context: {
                source: 'online-turn-service',
                expiresAt: lease.bundle.expiresAt,
            },
        });
        return toRuntimeRelayProfile(lease);
    };

    const refreshRuntimeRelayProfile = async () => {
        if (!serviceConfig.enabled) {
            return fallbackProfile();
        }

        if (!activeLease) {
            return getRuntimeRelayProfile();
        }

        if (pendingRequest) {
            return pendingRequest;
        }

        pendingRequest = sendRequest({
            path: 'refresh',
            body: {
                leaseId: activeLease.leaseId,
                client: 'electron-main',
            },
            schema: TURN_CREDENTIAL_LEASE_SCHEMA,
            failureReasonCode: 'TURN_CREDENTIAL_REFRESH_FAILED',
        })
            .then((lease) => {
                if (hasExpired(lease.bundle.expiresAt, now())) {
                    throw createTurnClientError(
                        'TURN_CREDENTIAL_BUNDLE_EXPIRED',
                        'TURN credential bundle expired during refresh.'
                    );
                }

                activeLease = lease;
                scheduleRefresh(lease);
                recordRuntimeHealth({
                    name: 'TURN_CREDENTIAL_REFRESHED',
                    severity: 'info',
                    message: 'Desktop runtime refreshed the online TURN credential lease.',
                    context: {
                        source: 'online-turn-service',
                        expiresAt: lease.bundle.expiresAt,
                    },
                });
                return toRuntimeRelayProfile(lease);
            })
            .catch((failure) =>
                handleFailure({
                    operation: 'refresh',
                    failure,
                })
            )
            .finally(() => {
                pendingRequest = null;
            });

        return pendingRequest;
    };

    const getRuntimeRelayProfile = async () => {
        if (!serviceConfig.enabled) {
            return fallbackProfile();
        }

        if (activeLease && !hasExpired(activeLease.bundle.expiresAt, now() + REFRESH_BUFFER_MS)) {
            return toRuntimeRelayProfile(activeLease);
        }

        if (activeLease) {
            return refreshRuntimeRelayProfile();
        }

        if (pendingRequest) {
            return pendingRequest;
        }

        pendingRequest = issueRuntimeRelayProfile()
            .catch((failure) =>
                handleFailure({
                    operation: 'fetch',
                    failure,
                })
            )
            .finally(() => {
                pendingRequest = null;
            });

        return pendingRequest;
    };

    const revokeRuntimeRelayProfile = async ({ reason = 'renderer-dispose' } = {}) => {
        clearRefreshTimer();

        if (!serviceConfig.enabled || !activeLease) {
            activeLease = null;
            return buildDefaultRelayProfile();
        }

        const leaseId = activeLease.leaseId;
        activeLease = null;

        try {
            const revoked = await sendRequest({
                path: 'revoke',
                body: {
                    leaseId,
                    client: 'electron-main',
                    reason,
                },
                schema: TURN_CREDENTIAL_REVOKE_RESULT_SCHEMA,
                failureReasonCode: 'TURN_CREDENTIAL_REVOKE_FAILED',
            });

            recordRuntimeHealth({
                name: 'TURN_CREDENTIAL_REVOKED',
                severity: 'info',
                message: 'Desktop runtime revoked the active online TURN credential lease.',
                reasonCode: 'TURN_CREDENTIAL_REVOKED',
                context: {
                    revokedAt: revoked.revokedAt,
                },
            });
        } catch (failure) {
            recordRuntimeHealth({
                name: 'TURN_CREDENTIAL_REVOKE_FAILED',
                severity: 'warn',
                message: 'Desktop runtime could not confirm TURN credential revocation.',
                reasonCode: failure.reasonCode ?? 'TURN_CREDENTIAL_REVOKE_FAILED',
            });
        }

        return buildDefaultRelayProfile();
    };

    return {
        getRuntimeRelayProfile,
        refreshRuntimeRelayProfile,
        revokeRuntimeRelayProfile,
    };
};
