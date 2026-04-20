// @vitest-environment node

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const stageAnchoredFiles = [
    'src/app/chrome/AppChrome.tsx',
    'src/app/overlays/AppOverlayStack.tsx',
    'src/app/shell/GameShell.tsx',
    'src/components/DeckPeekModal.tsx',
    'src/components/OnlineMenu.tsx',
    'src/components/Rulebook.tsx',
    'src/components/TopBar.tsx',
    'src/components/UpdateNotification.tsx',
    'src/components/WinnerModal.tsx',
];

const stageRootFiles = [
    'src/components/DraftScreen.tsx',
    'src/components/GameConfigMenu.tsx',
    'src/components/OnlineMenu.tsx',
    'src/app/shell/GameShell.tsx',
];

const readRepoFile = (relativePath: string) =>
    fs.readFileSync(path.resolve(process.cwd(), relativePath), 'utf8');

describe('desktop stage anchoring regression', () => {
    it('keeps desktop chrome and overlays off viewport-fixed positioning', () => {
        for (const relativePath of stageAnchoredFiles) {
            expect(readRepoFile(relativePath)).not.toMatch(/\bfixed\b/);
        }
    });

    it('keeps desktop route roots off raw screen and viewport-height sizing', () => {
        for (const relativePath of stageRootFiles) {
            expect(readRepoFile(relativePath)).not.toMatch(/\bw-screen\b/);
            expect(readRepoFile(relativePath)).not.toMatch(/\bh-screen\b/);
            expect(readRepoFile(relativePath)).not.toMatch(/\bmin-h-screen\b/);
        }

        expect(readRepoFile('src/components/Rulebook.tsx')).not.toMatch(/\d+vh/);
        expect(readRepoFile('src/components/DeckPeekModal.tsx')).not.toMatch(/\d+vh/);
    });
});
