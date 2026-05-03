const normalizeModuleId = (id: string) => id.replace(/\\/g, '/');
const matchesAny = (id: string, tokens: string[]) => tokens.some((token) => id.includes(token));

const runtimeCoreTokens = [
    '/packages/shared/src/config/webrtc.ts',
    '/packages/shared/src/data/realCards.ts',
    '/apps/desktop/src/hooks/useGameNetwork.ts',
    '/apps/desktop/src/hooks/useOnlineManager.ts',
    '/apps/desktop/src/hooks/gameNetwork/',
    '/apps/desktop/src/hooks/onlineManager/',
    '/packages/shared/src/logic/actions/',
    '/packages/shared/src/logic/gameReducer.ts',
    '/packages/shared/src/logic/turnManager.ts',
    '/packages/shared/src/logic/selectors.ts',
    '/packages/shared/src/logic/stateHelpers.ts',
    '/packages/shared/src/logic/network',
    '/packages/shared/src/utils.ts',
];

export const resolveManualChunk = (id: string) => {
    const normalizedId = normalizeModuleId(id);

    if (normalizedId.includes('/node_modules/')) {
        if (matchesAny(normalizedId, ['/react/', '/react-dom/', '/scheduler/'])) {
            return 'react-vendor';
        }

        if (matchesAny(normalizedId, ['/framer-motion/'])) {
            return 'motion-vendor';
        }

        if (matchesAny(normalizedId, ['/peerjs/', '/peer/'])) {
            return 'network-vendor';
        }

        if (matchesAny(normalizedId, ['/lucide-react/', '/canvas-confetti/'])) {
            return 'ui-vendor';
        }
    }

    if (matchesAny(normalizedId, runtimeCoreTokens)) {
        return 'runtime-core';
    }

    return undefined;
};
