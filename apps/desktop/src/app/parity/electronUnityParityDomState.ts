import type { GameState } from '@gemduel/shared/types';
import {
    BOX_SELECTORS,
    playerRole,
    semanticKeyForElement,
} from './electronUnityParityDomSemantics';
import type { DomBox } from './electronUnityParityTypes';

const getDataset = (element: HTMLElement) =>
    Object.fromEntries(
        Object.entries(element.dataset).flatMap(([key, value]) =>
            value === undefined ? [] : [[key, value]]
        )
    ) as Record<string, string>;

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

const appendRulebookControlSyntheticBoxes = (boxes: DomBox[]) => {
    const panel = boxes.find((box) => box.semanticKey === 'rulebook.panel');
    if (!panel) {
        return;
    }

    const panelScale = panel.rect.width / 940;
    const scaled = (value: number) => value * panelScale;

    if (!hasSemanticBox(boxes, 'rulebook.prev')) {
        boxes.push(
            syntheticBox(
                'rulebook.prev',
                new DOMRect(
                    panel.rect.x + scaled(12),
                    panel.rect.y + panel.rect.height - scaled(38),
                    scaled(92),
                    scaled(28)
                ),
                'synthetic:rulebook.prev'
            )
        );
    }

    if (!hasSemanticBox(boxes, 'rulebook.next')) {
        boxes.push(
            syntheticBox(
                'rulebook.next',
                new DOMRect(
                    panel.rect.x + panel.rect.width - scaled(104),
                    panel.rect.y + panel.rect.height - scaled(38),
                    scaled(92),
                    scaled(28)
                ),
                'synthetic:rulebook.next'
            )
        );
    }

    if (!hasSemanticBox(boxes, 'rulebook.close')) {
        boxes.push(
            syntheticBox(
                'rulebook.close',
                new DOMRect(
                    panel.rect.x + panel.rect.width - scaled(36),
                    panel.rect.y + scaled(16),
                    scaled(24),
                    scaled(24)
                ),
                'synthetic:rulebook.close'
            )
        );
    }
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

    if (!hasSemanticBox(boxes, 'mode.local')) {
        boxes.push(
            syntheticBox(
                'mode.local',
                new DOMRect(
                    rect.x + rect.width * 0.290625,
                    rect.y + rect.height * 0.4205,
                    rect.width * 0.2,
                    rect.height * 0.222222
                ),
                'synthetic:mode.local'
            )
        );
    }
};

const appendReservedVisualSyntheticBoxes = (
    boxes: DomBox[],
    state: GameState & { errorMsg?: string | null }
) => {
    for (const box of [...boxes]) {
        if (box.selector !== '[data-reserved-slot]' || !box.dataset.reservedSlot) {
            continue;
        }

        const [player, index] = box.dataset.reservedSlot.split('-');
        const role = playerRole(player, state);
        if (!role || !index) {
            continue;
        }

        const semanticKey = `player.${role}.reserved.${index}.visual`;
        if (hasSemanticBox(boxes, semanticKey)) {
            continue;
        }

        boxes.push(
            syntheticBox(
                semanticKey,
                new DOMRect(box.rect.x, box.rect.y, box.rect.width, box.rect.height),
                `synthetic:${semanticKey}`
            )
        );
    }
};

const appendCurrentPlayerColumnAliasSyntheticBoxes = (boxes: DomBox[]) => {
    const aliasPairs: Array<[sourceKey: string, aliasKey: string]> = [
        ['player.resources', 'player.current.resourcesColumn'],
        ['player.score', 'player.current.identityColumn'],
    ];

    for (const [sourceKey, aliasKey] of aliasPairs) {
        if (hasSemanticBox(boxes, aliasKey)) {
            continue;
        }

        const source = boxes.find((box) => box.semanticKey === sourceKey);
        if (!source) {
            continue;
        }

        boxes.push(
            syntheticBox(
                aliasKey,
                new DOMRect(source.rect.x, source.rect.y, source.rect.width, source.rect.height),
                `synthetic:${aliasKey}`
            )
        );
    }
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
    appendRulebookControlSyntheticBoxes(boxes);
    appendPreviewActionSyntheticBox(boxes);
    appendTurnEndSyntheticBox(boxes);
    appendReservedVisualSyntheticBoxes(boxes, state);
    appendCurrentPlayerColumnAliasSyntheticBoxes(boxes);

    return boxes;
};
