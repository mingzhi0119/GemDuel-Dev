const normalizeServiceUrl = (serviceUrl) => serviceUrl.replace(/\/+$/, '');

export const createTurnClientError = (reasonCode, message, cause) => ({
    reasonCode,
    message,
    cause,
});

export const sendTurnCredentialRequest = async ({
    serviceConfig,
    fetchImpl,
    requestTimeoutMs,
    requestSetTimeoutImpl,
    requestClearTimeoutImpl,
    path,
    body,
    schema,
    failureReasonCode,
}) => {
    if (!serviceConfig.enabled || typeof fetchImpl !== 'function') {
        throw createTurnClientError(
            failureReasonCode,
            'TURN credential service is not enabled for this desktop runtime.'
        );
    }

    let response;
    let timeoutId = null;
    const abortController =
        typeof AbortController === 'function' && requestTimeoutMs > 0
            ? new AbortController()
            : null;
    const requestOptions = {
        method: 'POST',
        headers: {
            authorization: `Bearer ${serviceConfig.serviceToken}`,
            'content-type': 'application/json',
        },
        body: JSON.stringify(body),
        ...(abortController ? { signal: abortController.signal } : {}),
    };
    const timeoutPromise =
        requestTimeoutMs > 0
            ? new Promise((_, reject) => {
                  timeoutId = requestSetTimeoutImpl(() => {
                      abortController?.abort();
                      reject(
                          createTurnClientError(
                              failureReasonCode,
                              'TURN credential request timed out before the online service responded.'
                          )
                      );
                  }, requestTimeoutMs);
              })
            : null;

    try {
        const fetchPromise = fetchImpl(
            `${normalizeServiceUrl(serviceConfig.serviceUrl)}/${path}`,
            requestOptions
        );
        response = timeoutPromise
            ? await Promise.race([fetchPromise, timeoutPromise])
            : await fetchPromise;
    } catch (error) {
        if (error?.reasonCode) {
            throw error;
        }

        throw createTurnClientError(
            failureReasonCode,
            'TURN credential request could not reach the online service.',
            error
        );
    } finally {
        if (timeoutId !== null && typeof requestClearTimeoutImpl === 'function') {
            requestClearTimeoutImpl(timeoutId);
        }
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
