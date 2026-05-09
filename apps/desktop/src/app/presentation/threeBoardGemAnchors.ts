import type { GemColor } from '@gemduel/shared/types';

export interface BoardGemAnchorSnapshot {
    key: string;
    row: number;
    col: number;
    uid: string;
    color: GemColor;
    selected: boolean;
    reserveSelected: boolean;
    target: boolean;
    dimmed: boolean;
    interactive: boolean;
    selectionIndex: number;
    element: HTMLElement;
    rect: DOMRect;
}

const GEM_COLORS: readonly GemColor[] = [
    'blue',
    'white',
    'green',
    'black',
    'red',
    'pearl',
    'gold',
] as const;

const isGemColor = (value: string | undefined): value is GemColor =>
    Boolean(value && (GEM_COLORS as readonly string[]).includes(value));

const readBooleanDataset = (value: string | undefined): boolean => value === 'true';

const readNumberDataset = (value: string | undefined, fallback: number): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

export const collectBoardGemAnchors = (root: ParentNode): BoardGemAnchorSnapshot[] =>
    Array.from(root.querySelectorAll<HTMLElement>('[data-board-cell][data-board-gem-color]'))
        .map((element) => {
            const color = element.dataset.boardGemColor;
            if (!isGemColor(color)) {
                return null;
            }

            const row = readNumberDataset(element.dataset.boardRow, -1);
            const col = readNumberDataset(element.dataset.boardCol, -1);
            const rect = element.getBoundingClientRect();

            if (row < 0 || col < 0 || rect.width <= 0 || rect.height <= 0) {
                return null;
            }

            return {
                key: `${row}-${col}`,
                row,
                col,
                uid: element.dataset.boardGemUid ?? `${row}-${col}`,
                color,
                selected: readBooleanDataset(element.dataset.boardGemSelected),
                reserveSelected: readBooleanDataset(element.dataset.boardGemReserveSelected),
                target: readBooleanDataset(element.dataset.boardGemTarget),
                dimmed: readBooleanDataset(element.dataset.boardGemDimmed),
                interactive: element.dataset.boardGemInteractive !== 'false',
                selectionIndex: readNumberDataset(element.dataset.boardGemSelectionIndex, -1),
                element,
                rect,
            } satisfies BoardGemAnchorSnapshot;
        })
        .filter((anchor): anchor is BoardGemAnchorSnapshot => anchor !== null);
