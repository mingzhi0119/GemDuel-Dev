// @vitest-environment happy-dom
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GEM_TYPES } from '@gemduel/shared/constants';
import type { BoardCell, GemPanelSkin } from '@gemduel/shared/types';
import { GameBoard } from '../GameBoard';
import { getGemArtworkAssetPath } from '../gemArtworkAssets';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const panelSkin: GemPanelSkin = {
    id: 'test-panel',
    artworkPath: '',
    intrinsicWidthPx: 500,
    intrinsicHeightPx: 500,
    playfieldRectNormalized: { left: 0.1, top: 0.1, right: 0.9, bottom: 0.9 },
};

const createBoard = (): BoardCell[][] =>
    Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => ({
            type: row === 0 && col === 1 ? GEM_TYPES.GOLD : GEM_TYPES.RED,
            uid: `gem-${row}-${col}`,
        }))
    );

let root: Root | null = null;
let container: HTMLDivElement | null = null;

const render = async (node: React.ReactNode) => {
    container = document.createElement('div');
    document.body.appendChild(container);

    await act(async () => {
        root = createRoot(container!);
        root.render(node);
    });

    return container;
};

afterEach(() => {
    act(() => {
        root?.unmount();
    });
    container?.remove();
    root = null;
    container = null;
});

describe('GameBoard Three presentation hooks', () => {
    it('shares the existing board artwork assets with Three presentation', () => {
        expect(getGemArtworkAssetPath('blue')).toBe('/assets/gems/blue.png');
        expect(getGemArtworkAssetPath('gold')).toBe('/assets/gems/gold.png');
    });

    it('can hide board gem artwork while preserving buttons, labels, and state anchors', async () => {
        const view = await render(
            <GameBoard
                board={createBoard()}
                handleGemClick={vi.fn()}
                handleGemDragSelection={vi.fn()}
                selectedGems={[{ r: 0, c: 0 }]}
                reserveGoldSelection={{ r: 0, c: 1 }}
                phase="RESERVE_WAITING_GEM"
                bonusGemTarget={null}
                theme="dark"
                panelSkin={panelSkin}
                renderGemArtwork={false}
            />
        );

        expect(view.querySelector('[data-gem-artwork][data-gem-variant="board"]')).toBeNull();

        const selectedCell = view.querySelector<HTMLElement>('[data-board-cell="0-0"]');
        const reservedGoldCell = view.querySelector<HTMLElement>('[data-board-cell="0-1"]');
        const selectedButton = selectedCell?.querySelector<HTMLButtonElement>('button');

        expect(selectedButton?.getAttribute('aria-label')).toContain('selected 1');
        expect(selectedCell?.dataset.boardGemColor).toBe('red');
        expect(selectedCell?.dataset.boardGemUid).toBe('gem-0-0');
        expect(selectedCell?.dataset.boardGemSelected).toBe('true');
        expect(selectedCell?.dataset.boardGemSelectionIndex).toBe('0');
        expect(selectedCell?.dataset.boardGemInteractive).toBe('true');
        expect(reservedGoldCell?.dataset.boardGemColor).toBe('gold');
        expect(reservedGoldCell?.dataset.boardGemTarget).toBe('true');
        expect(reservedGoldCell?.dataset.boardGemReserveSelected).toBe('true');
    });
});
