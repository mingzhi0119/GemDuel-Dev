// @vitest-environment node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const stageAnchoredFiles = [
    'apps/desktop/src/app/chrome/AppChrome.tsx',
    'apps/desktop/src/app/overlays/AppOverlayStack.tsx',
    'apps/desktop/src/app/shell/GameShell.tsx',
    'packages/ui/src/components/DeckPeekModal.tsx',
    'packages/ui/src/components/OnlineMenu.tsx',
    'packages/ui/src/components/Rulebook.tsx',
    'packages/ui/src/components/TopBar.tsx',
    'packages/ui/src/components/UpdateNotification.tsx',
    'packages/ui/src/components/WinnerModal.tsx',
];

const stageRootFiles = [
    'packages/ui/src/components/DraftScreen.tsx',
    'packages/ui/src/components/GameConfigMenu.tsx',
    'packages/ui/src/components/OnlineMenu.tsx',
    'apps/desktop/src/app/shell/GameShell.tsx',
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../../');

const readRepoFile = (relativePath: string) =>
    fs.readFileSync(path.resolve(repoRoot, relativePath), 'utf8');

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

        expect(readRepoFile('packages/ui/src/components/Rulebook.tsx')).not.toMatch(/\d+vh/);
        expect(readRepoFile('packages/ui/src/components/DeckPeekModal.tsx')).not.toMatch(/\d+vh/);
    });
});
