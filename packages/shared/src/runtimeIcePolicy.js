export const ALLOWED_ICE_URL_PROTOCOLS = Object.freeze(['stun:', 'turn:', 'turns:']);

const TURN_URL_PROTOCOLS = new Set(['turn:', 'turns:']);

export const toIceUrlList = (urls) => {
    if (typeof urls === 'string') {
        return [urls];
    }

    if (
        Array.isArray(urls) &&
        urls.length > 0 &&
        urls.every((entry) => typeof entry === 'string')
    ) {
        return urls;
    }

    return null;
};

export const isAllowedIceUrl = (url) =>
    ALLOWED_ICE_URL_PROTOCOLS.some((protocol) => url.startsWith(protocol));

export const isTurnIceUrl = (url) =>
    TURN_URL_PROTOCOLS.has(ALLOWED_ICE_URL_PROTOCOLS.find((protocol) => url.startsWith(protocol)));

export const collectIceServerPolicyViolations = (value) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return ['ICE servers must be objects.'];
    }

    const { urls, username, credential } = value;
    const urlList = toIceUrlList(urls);

    if (!urlList) {
        return ['ICE server urls must be a string or a non-empty string array.'];
    }

    if (urlList.some((url) => !isAllowedIceUrl(url))) {
        return ['ICE server urls must start with stun:, turn:, or turns:.'];
    }

    const hasUsername = username !== undefined;
    const hasCredential = credential !== undefined;

    if (hasUsername !== hasCredential) {
        return ['TURN credentials must provide both username and credential.'];
    }

    if (hasUsername && (typeof username !== 'string' || username.length === 0)) {
        return ['TURN username must be a non-empty string.'];
    }

    if (hasCredential && (typeof credential !== 'string' || credential.length === 0)) {
        return ['TURN credential must be a non-empty string.'];
    }

    if (hasUsername && urlList.some((url) => !isTurnIceUrl(url))) {
        return ['Credential-bearing ICE servers may only use turn: or turns: urls.'];
    }

    return [];
};
