// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { resolveManualChunk } from '@gemduel/shared/build/viteManualChunks';

describe('resolveManualChunk', () => {
    it('keeps cross-dependent gameplay and networking modules in the same runtime chunk', () => {
        expect(resolveManualChunk('E:/GemDuel-Dev/apps/desktop/src/hooks/useGameNetwork.ts')).toBe(
            'runtime-core'
        );
        expect(resolveManualChunk('E:/GemDuel-Dev/packages/shared/src/logic/gameReducer.ts')).toBe(
            'runtime-core'
        );
        expect(
            resolveManualChunk('E:/GemDuel-Dev/packages/shared/src/logic/networkDispatchPolicy.ts')
        ).toBe('runtime-core');
    });

    it('preserves vendor chunking for third-party dependencies', () => {
        expect(resolveManualChunk('E:/GemDuel-Dev/node_modules/react/index.js')).toBe(
            'react-vendor'
        );
        expect(resolveManualChunk('E:/GemDuel-Dev/node_modules/peerjs/dist/index.js')).toBe(
            'network-vendor'
        );
    });
});
