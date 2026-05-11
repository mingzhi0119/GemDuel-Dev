// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { resolveManualChunk } from '../../../apps/desktop/viteManualChunks';

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

    it('splits main game UI and presentation code out of the GameShell route chunk', () => {
        expect(resolveManualChunk('E:/GemDuel-Dev/packages/ui/src/components/GameBoard.tsx')).toBe(
            'game-ui'
        );
        expect(
            resolveManualChunk(
                'E:/GemDuel-Dev/apps/desktop/src/app/presentation/PresentationLayer.tsx'
            )
        ).toBe('presentation-layer');
        expect(
            resolveManualChunk('E:/GemDuel-Dev/packages/ui/src/components/Rulebook.tsx')
        ).toBeUndefined();
    });
});
