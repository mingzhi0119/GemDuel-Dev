const DEFAULT_DEV_RENDERER_URL = 'http://localhost:5173';
const DEFAULT_PACKAGED_RENDERER_URL = new URL('../dist/index.html', import.meta.url).href;

const parseTrustedRendererUrl = (value) => {
    try {
        return new URL(value);
    } catch {
        return null;
    }
};

const getEffectivePort = (parsedUrl) => {
    if (parsedUrl.port) {
        return parsedUrl.port;
    }
    if (parsedUrl.protocol === 'http:') {
        return '80';
    }
    if (parsedUrl.protocol === 'https:') {
        return '443';
    }
    return '';
};

const hasEncodedPathSeparator = (parsedUrl) => /%2f|%5c/i.test(parsedUrl.pathname);

const matchesStructuredHttpUrl = (candidate, expected) =>
    ['http:', 'https:'].includes(candidate.protocol) &&
    candidate.protocol === expected.protocol &&
    candidate.hostname.toLowerCase() === expected.hostname.toLowerCase() &&
    getEffectivePort(candidate) === getEffectivePort(expected) &&
    !hasEncodedPathSeparator(candidate) &&
    candidate.pathname === expected.pathname &&
    candidate.search === expected.search &&
    candidate.hash === expected.hash;

const matchesPackagedRendererUrl = (candidate, expected) =>
    candidate.protocol === 'file:' &&
    expected.protocol === 'file:' &&
    !hasEncodedPathSeparator(candidate) &&
    candidate.hostname === expected.hostname &&
    candidate.pathname === expected.pathname &&
    candidate.search === expected.search &&
    candidate.hash === expected.hash;

export const buildRendererTrustPolicySnapshot = () => ({
    dev: {
        defaultUrl: DEFAULT_DEV_RENDERER_URL,
        requiresExactProtocolHostPortPath: true,
        unexpectedQueryRejected: true,
    },
    production: {
        protocol: 'file:',
        entrypoint: '../dist/index.html',
        arbitraryFileUrlRejected: true,
    },
});

export const isAllowedRendererUrl = (
    url,
    isDev,
    {
        devServerUrl = process.env.GEMDUEL_DEV_SERVER_URL ?? DEFAULT_DEV_RENDERER_URL,
        packagedRendererUrl = DEFAULT_PACKAGED_RENDERER_URL,
    } = {}
) => {
    if (typeof url !== 'string') {
        return false;
    }

    const candidate = parseTrustedRendererUrl(url);
    if (!candidate) {
        return false;
    }

    if (isDev) {
        const expectedDevUrl =
            parseTrustedRendererUrl(devServerUrl) ??
            parseTrustedRendererUrl(DEFAULT_DEV_RENDERER_URL);
        return expectedDevUrl ? matchesStructuredHttpUrl(candidate, expectedDevUrl) : false;
    }

    const expectedPackagedUrl = parseTrustedRendererUrl(packagedRendererUrl);
    return expectedPackagedUrl ? matchesPackagedRendererUrl(candidate, expectedPackagedUrl) : false;
};
