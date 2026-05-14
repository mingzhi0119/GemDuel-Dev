import { clickElement, waitForCondition, waitForStableFrame } from './electronUnityParityDom';
import type { UseElectronUnityParityHarnessParams } from './electronUnityParityTypes';

type CurrentParams = () => UseElectronUnityParityHarnessParams;
type GameState = ReturnType<CurrentParams>['game']['state'];

type BoardSelectionMatcher = (state: GameState, row: number, column: number) => boolean;

export const getBoardCoord = (
    payload: Record<string, unknown>,
    fallback?: { r?: number; c?: number }
) => ({
    row: Number(payload.row ?? payload.r ?? fallback?.r),
    column: Number(payload.column ?? payload.c ?? fallback?.c),
});

export const hasSelectedGem = (state: GameState, row: number, column: number) =>
    Boolean(state.selectedGems?.some((selection) => selection.r === row && selection.c === column));

export const hasReserveGoldSelection = (state: GameState, row: number, column: number) =>
    state.reserveGoldSelection?.r === row && state.reserveGoldSelection?.c === column;

const getTopmostClickableElement = (selector: string): HTMLElement | null => {
    const candidates = Array.from(document.querySelectorAll<HTMLElement>(selector));
    return (
        candidates.find((candidate) => {
            const rect = candidate.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) {
                return false;
            }

            const target = document.elementFromPoint(
                rect.x + rect.width / 2,
                rect.y + rect.height / 2
            );
            return Boolean(target && candidate.contains(target));
        }) ??
        candidates.find((candidate) => {
            const rect = candidate.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        }) ??
        candidates[0] ??
        null
    );
};

const observeSelectionChange = async ({
    currentParams,
    row,
    column,
    wasSelected,
    isSelected,
    allowPhaseExit,
}: {
    currentParams: CurrentParams;
    row: number;
    column: number;
    wasSelected: boolean;
    isSelected: BoardSelectionMatcher;
    allowPhaseExit: boolean;
}) =>
    waitForCondition(() => {
        const { state } = currentParams().game;
        if (allowPhaseExit && state.phase !== 'IDLE') {
            return true;
        }

        const selected = isSelected(state, row, column);
        return wasSelected ? !selected : selected;
    }, 120);

export const clickBoardCellUntilSelectionChange = async ({
    selector,
    row,
    column,
    wasSelected,
    currentParams,
    isSelected,
    allowPhaseExit = false,
}: {
    selector: string;
    row: number;
    column: number;
    wasSelected: boolean;
    currentParams: CurrentParams;
    isSelected: BoardSelectionMatcher;
    allowPhaseExit?: boolean;
}) => {
    const observe = () =>
        observeSelectionChange({
            currentParams,
            row,
            column,
            wasSelected,
            isSelected,
            allowPhaseExit,
        });
    const ok = clickElement(selector, { pointerSequence: false });
    let selectionObserved = ok && (await observe());

    if (ok && !selectionObserved) {
        getTopmostClickableElement(selector)?.click();
        selectionObserved = await observe();
    }
    if (ok && !selectionObserved) {
        currentParams().game.handlers.handleGemClick(row, column);
        selectionObserved = await observe();
    }

    await waitForStableFrame();
    return { ok, selectionObserved };
};

export const clickBoardCellUntilCommitted = async ({
    selector,
    row,
    column,
    currentParams,
    observeCommitted,
}: {
    selector: string;
    row: number;
    column: number;
    currentParams: CurrentParams;
    observeCommitted: () => Promise<boolean>;
}) => {
    const ok = clickElement(selector, { pointerSequence: false });
    let committed = ok && (await observeCommitted());

    if (ok && !committed) {
        getTopmostClickableElement(selector)?.click();
        committed = await observeCommitted();
    }
    if (ok && !committed) {
        currentParams().game.handlers.handleGemClick(row, column);
        committed = await observeCommitted();
    }

    await waitForStableFrame();
    return { ok, committed };
};
