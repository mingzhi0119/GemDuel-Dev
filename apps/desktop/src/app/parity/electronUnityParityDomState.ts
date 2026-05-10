import type { GameState } from '@gemduel/shared/types';
import type { DomBox } from './electronUnityParityTypes';

const BOX_SELECTORS = [
    '[data-testid="desktop-stage-viewport"]',
    '[data-testid="desktop-stage-canvas"]',
    '[data-draft-card-scale-reference]',
    '[data-draft-buff-id]',
    '[data-surface-slot]',
    '[data-market-deck]',
    '[data-market-slot]',
    '[data-board-cell]',
    '[data-player-zone]',
    '[data-player-zone-column]',
    '[data-player-zone-gem]',
    '[data-reserved-slot]',
    '[data-card-preview-overlay]',
    '[data-card-preview-backdrop]',
    '[data-card-preview-card]',
    '[data-card-preview-action]',
    '[data-settings-menu]',
    '[data-parity-error-banner]',
    '[data-game-action]',
    '[data-royal-court-grid]',
];

const getDataset = (element: HTMLElement) =>
    Object.fromEntries(
        Object.entries(element.dataset).flatMap(([key, value]) =>
            value === undefined ? [] : [[key, value]]
        )
    ) as Record<string, string>;

const semanticKeyForElement = (
    element: HTMLElement,
    selector: string,
    state: GameState & { errorMsg?: string | null },
    historyLength: number
): string | undefined => {
    const dataset = element.dataset;

    if (selector === '[data-testid="desktop-stage-viewport"]') {
        return 'app.shell';
    }
    if (selector === '[data-testid="desktop-stage-canvas"]' && historyLength === 0) {
        return 'main.menu';
    }
    if (dataset.draftCardScaleReference) {
        return 'draft.root';
    }
    if (dataset.draftBuffIndex) {
        return `draft.buff.${dataset.draftBuffIndex}`;
    }
    if (dataset.surfaceSlot === 'gem-panel') {
        return 'board.root';
    }
    if (dataset.marketDeck) {
        return `market.level.${dataset.marketDeck}`;
    }
    if (dataset.marketSlot) {
        const [level, index] = dataset.marketSlot.split('-');
        return level && index ? `market.card.${level}.${index}` : undefined;
    }
    if (dataset.boardCell) {
        const [row, column] = dataset.boardCell.split('-');
        return row && column ? `board.cell.${row}.${column}` : undefined;
    }
    if (dataset.playerZone) {
        return dataset.playerZone === state.turn && !state.winner
            ? 'player.current.zone'
            : 'player.opponent.zone';
    }
    if (dataset.playerZoneColumn) {
        const player = element.closest<HTMLElement>('[data-player-zone]')?.dataset.playerZone;
        if (player !== state.turn || state.winner) {
            return undefined;
        }

        return dataset.playerZoneColumn === 'resources'
            ? 'player.resources'
            : dataset.playerZoneColumn === 'identity'
              ? 'player.score'
              : undefined;
    }
    if (dataset.reservedSlot) {
        const [player, index] = dataset.reservedSlot.split('-');
        return player === state.turn && index ? `player.reserved.${index}` : undefined;
    }
    if (selector === '[data-card-preview-overlay]') {
        return 'card.preview.overlay';
    }
    if (selector === '[data-card-preview-backdrop]') {
        return 'card.preview.backdrop';
    }
    if (selector === '[data-card-preview-card]') {
        return 'card.preview.card';
    }
    if (dataset.cardPreviewAction === 'buy') {
        return 'card.preview.primaryAction';
    }
    if (selector === '[data-settings-menu]') {
        return 'settings.panel';
    }
    if (selector === '[data-parity-error-banner]') {
        return 'error.banner';
    }
    if (selector === '[data-game-action]') {
        return 'turn.end';
    }
    if (selector === '[data-royal-court-grid]') {
        return 'royal.featured';
    }

    return undefined;
};

const syntheticBox = (semanticKey: string, rect: DOMRect, selector: string): DomBox => ({
    key: `synthetic:${semanticKey}`,
    semanticKey,
    selector,
    text: '',
    dataset: {},
    rect: {
        x: Math.round(rect.x * 100) / 100,
        y: Math.round(rect.y * 100) / 100,
        width: Math.round(rect.width * 100) / 100,
        height: Math.round(rect.height * 100) / 100,
    },
});

const hasSemanticBox = (boxes: DomBox[], semanticKey: string) =>
    boxes.some((box) => box.semanticKey === semanticKey);

const appendPreviewActionSyntheticBox = (boxes: DomBox[]) => {
    if (hasSemanticBox(boxes, 'card.preview.primaryAction')) {
        return;
    }

    const overlay = boxes.find((box) => box.semanticKey === 'card.preview.overlay');
    if (!overlay) {
        return;
    }

    const actionWidth = 184;
    const actionHeight = 56;
    const actionGap = 16;
    const actionBandBottom = Math.min(150, Math.max(72, overlay.rect.height * 0.11));
    boxes.push(
        syntheticBox(
            'card.preview.primaryAction',
            new DOMRect(
                overlay.rect.x + overlay.rect.width / 2 - (actionWidth * 2 + actionGap) / 2,
                overlay.rect.y + overlay.rect.height - actionBandBottom - actionHeight,
                actionWidth,
                actionHeight
            ),
            'synthetic:card.preview.primaryAction'
        )
    );
};

const appendTurnEndSyntheticBox = (boxes: DomBox[]) => {
    if (hasSemanticBox(boxes, 'turn.end')) {
        return;
    }

    const board = boxes.find((box) => box.semanticKey === 'board.root');
    if (!board) {
        return;
    }

    const actionWidth = 184;
    const actionHeight = 44;
    boxes.push(
        syntheticBox(
            'turn.end',
            new DOMRect(
                board.rect.x + board.rect.width / 2 - actionWidth / 2,
                board.rect.y + board.rect.height + 16,
                actionWidth,
                actionHeight
            ),
            'synthetic:turn.end'
        )
    );
};

const appendShellSyntheticBoxes = (boxes: DomBox[], historyLength: number) => {
    if (historyLength !== 0) {
        return;
    }

    const canvas = document.querySelector<HTMLElement>('[data-testid="desktop-stage-canvas"]');
    const rect = canvas?.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) {
        return;
    }

    boxes.push(
        syntheticBox(
            'mode.local',
            new DOMRect(
                rect.x + rect.width * 0.38,
                rect.y + rect.height * 0.48,
                rect.width * 0.24,
                rect.height * 0.07
            ),
            'synthetic:mode.local'
        )
    );
};

export const getDomBoxes = (
    state: GameState & { errorMsg?: string | null },
    historyLength: number
): DomBox[] => {
    const boxes: DomBox[] = [];

    for (const selector of BOX_SELECTORS) {
        document.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) {
                return;
            }

            boxes.push({
                key: `${selector}:${index}`,
                semanticKey: semanticKeyForElement(element, selector, state, historyLength),
                selector,
                text: (element.innerText || element.textContent || '').replace(/\s+/g, ' ').trim(),
                dataset: getDataset(element),
                rect: {
                    x: Math.round(rect.x * 100) / 100,
                    y: Math.round(rect.y * 100) / 100,
                    width: Math.round(rect.width * 100) / 100,
                    height: Math.round(rect.height * 100) / 100,
                },
            });
        });
    }

    appendShellSyntheticBoxes(boxes, historyLength);
    appendPreviewActionSyntheticBox(boxes);
    appendTurnEndSyntheticBox(boxes);

    return boxes;
};
