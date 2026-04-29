import React from 'react';
import { validateGemSelection } from '@gemduel/shared/logic/validators';
import type { BoardCell, GemCoord } from '@gemduel/shared/types';
import type { GemPanelFootprint } from './gemPanelLayout';
import { findNearestGemCoordFromPointer } from './gemBoardPointerHitTest';
export type GemDragSelectionIntent = 'select' | 'deselect';
interface NormalizedCellCenter {
    x: number;
    y: number;
}
interface DragSelectionState {
    active: boolean;
    moved: boolean;
    suppressClick: boolean;
    anchor: GemCoord | null;
    intent: GemDragSelectionIntent;
}
interface UseGemBoardDragSelectionParams {
    board: BoardCell[][];
    selectedGems: GemCoord[];
    canInteract: boolean;
    boardInteractionMode: string;
    panelFootprint: GemPanelFootprint;
    cellCenters: NormalizedCellCenter[];
    handleGemClick: (r: number, c: number) => void;
    handleGemDragSelection: (coords: GemCoord[], intent?: GemDragSelectionIntent) => void;
}
const areSameCoord = (left: GemCoord, right: GemCoord) => left.r === right.r && left.c === right.c;
const hasCoord = (coords: GemCoord[], target: GemCoord) =>
    coords.some((coord) => areSameCoord(coord, target));
const isSelectableDragCell = (cell: BoardCell | undefined) =>
    Boolean(cell && cell.type.id !== 'empty' && cell.type.id !== 'gold');
const canClickBoardGem = (boardInteractionMode: string) =>
    boardInteractionMode === 'selection' ||
    boardInteractionMode === 'bonus-target' ||
    boardInteractionMode === 'reserve-gold' ||
    boardInteractionMode === 'privilege-target';
const shouldResolveOnPointerDown = (boardInteractionMode: string) =>
    boardInteractionMode === 'bonus-target' ||
    boardInteractionMode === 'reserve-gold' ||
    boardInteractionMode === 'privilege-target';

const suppressNextBoardClick = (
    dragStateRef: React.MutableRefObject<DragSelectionState>,
    suppressClickTimeoutRef: React.MutableRefObject<number | null>
) => {
    dragStateRef.current.suppressClick = true;

    if (suppressClickTimeoutRef.current !== null) {
        window.clearTimeout(suppressClickTimeoutRef.current);
    }

    suppressClickTimeoutRef.current = window.setTimeout(() => {
        dragStateRef.current.suppressClick = false;
        suppressClickTimeoutRef.current = null;
    }, 0);
};

const buildDragSelectionCandidate = (
    currentPath: GemCoord[],
    nextCoord: GemCoord,
    board: BoardCell[][]
): GemCoord[] | null => {
    if (currentPath.some((coord) => areSameCoord(coord, nextCoord))) {
        return currentPath;
    }

    if (currentPath.length >= 3) {
        return null;
    }

    if (currentPath.length === 0) {
        return [nextCoord];
    }

    const start = currentPath[0];
    const dr = nextCoord.r - start.r;
    const dc = nextCoord.c - start.c;
    const span = Math.max(Math.abs(dr), Math.abs(dc));
    const isStraight = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);

    let candidate = [...currentPath, nextCoord];

    if (currentPath.length === 1 && isStraight && span === 2) {
        const midpoint: GemCoord = {
            r: start.r + (dr === 0 ? 0 : dr / 2),
            c: start.c + (dc === 0 ? 0 : dc / 2),
        };

        if (!Number.isInteger(midpoint.r) || !Number.isInteger(midpoint.c)) {
            return null;
        }

        if (!isSelectableDragCell(board[midpoint.r]?.[midpoint.c])) {
            return null;
        }

        candidate = [start, midpoint, nextCoord];
    }

    const validation = validateGemSelection(candidate);
    if (!validation.valid || validation.hasGap) {
        return null;
    }

    return candidate;
};

export const useGemBoardDragSelection = ({
    board,
    selectedGems,
    canInteract,
    boardInteractionMode,
    panelFootprint,
    cellCenters,
    handleGemClick,
    handleGemDragSelection,
}: UseGemBoardDragSelectionParams) => {
    const [dragPreview, setDragPreview] = React.useState<GemCoord[]>([]);
    const dragPreviewRef = React.useRef<GemCoord[]>([]);
    const dragDeselectPathRef = React.useRef<GemCoord[]>([]);
    const dragStateRef = React.useRef<DragSelectionState>({
        active: false,
        moved: false,
        suppressClick: false,
        anchor: null as GemCoord | null,
        intent: 'select' as GemDragSelectionIntent,
    });
    const suppressClickTimeoutRef = React.useRef<number | null>(null);

    const updateDragPreview = React.useCallback((coords: GemCoord[]) => {
        dragPreviewRef.current = coords;
        setDragPreview(coords);
    }, []);

    const clearDragPreview = React.useCallback(() => {
        dragPreviewRef.current = [];
        dragDeselectPathRef.current = [];
        setDragPreview([]);
    }, []);

    const endDragSelection = React.useCallback(() => {
        if (!dragStateRef.current.active) {
            return;
        }

        const dragIntent = dragStateRef.current.intent;
        const dragAnchor = dragStateRef.current.anchor;
        const didMove = dragStateRef.current.moved;
        const shouldCommit =
            dragIntent === 'select'
                ? didMove && dragPreviewRef.current.length > 1
                : didMove && dragDeselectPathRef.current.length > 0;
        const shouldCommitTap = !didMove && dragAnchor !== null;
        dragStateRef.current.active = false;
        dragStateRef.current.moved = false;
        dragStateRef.current.anchor = null;
        dragStateRef.current.intent = 'select';

        if (shouldCommit) {
            const committedCoords =
                dragIntent === 'select' ? dragPreviewRef.current : dragDeselectPathRef.current;
            handleGemDragSelection(committedCoords, dragIntent);
            suppressNextBoardClick(dragStateRef, suppressClickTimeoutRef);
        } else if (shouldCommitTap) {
            handleGemClick(dragAnchor.r, dragAnchor.c);
            suppressNextBoardClick(dragStateRef, suppressClickTimeoutRef);
        }

        clearDragPreview();
    }, [clearDragPreview, handleGemClick, handleGemDragSelection]);

    const cancelDragSelection = React.useCallback(() => {
        dragStateRef.current.active = false;
        dragStateRef.current.moved = false;
        dragStateRef.current.anchor = null;
        dragStateRef.current.intent = 'select';
        clearDragPreview();
    }, [clearDragPreview]);

    React.useEffect(() => {
        const handleWindowPointerUp = () => endDragSelection();
        const handleWindowPointerCancel = () => cancelDragSelection();

        window.addEventListener('pointerup', handleWindowPointerUp);
        window.addEventListener('pointercancel', handleWindowPointerCancel);

        return () => {
            window.removeEventListener('pointerup', handleWindowPointerUp);
            window.removeEventListener('pointercancel', handleWindowPointerCancel);
            if (suppressClickTimeoutRef.current !== null) {
                window.clearTimeout(suppressClickTimeoutRef.current);
            }
        };
    }, [cancelDragSelection, endDragSelection]);

    React.useEffect(() => {
        if (boardInteractionMode !== 'selection' || !canInteract) {
            cancelDragSelection();
        }
    }, [boardInteractionMode, canInteract, cancelDragSelection]);

    const displayedSelection =
        dragStateRef.current.active && dragStateRef.current.intent === 'deselect'
            ? dragPreview
            : dragPreview.length > 0
              ? dragPreview
              : selectedGems;

    const handleBoardGemClick = React.useCallback(
        (r: number, c: number) => {
            if (
                !canInteract ||
                !canClickBoardGem(boardInteractionMode) ||
                dragStateRef.current.suppressClick
            ) {
                return;
            }

            handleGemClick(r, c);
        },
        [boardInteractionMode, canInteract, handleGemClick]
    );

    const handleBoardGemPointerDown = React.useCallback(
        (event: React.PointerEvent<HTMLButtonElement>, r: number, c: number) => {
            if (event.button !== 0 || !canInteract) {
                return;
            }

            if (shouldResolveOnPointerDown(boardInteractionMode)) {
                handleGemClick(r, c);
                suppressNextBoardClick(dragStateRef, suppressClickTimeoutRef);
                return;
            }

            if (boardInteractionMode !== 'selection') {
                return;
            }

            const startPointerCapture = () => {
                if (typeof event.currentTarget.setPointerCapture !== 'function') {
                    return;
                }

                try {
                    event.currentTarget.setPointerCapture(event.pointerId);
                } catch {
                    // Some synthetic/browser automation paths do not expose pointer capture.
                }
            };

            const coord = { r, c };
            if (board[r]?.[c]?.type.id === 'gold') {
                handleGemClick(r, c);
                suppressNextBoardClick(dragStateRef, suppressClickTimeoutRef);
                return;
            }

            if (hasCoord(selectedGems, coord)) {
                startPointerCapture();
                dragStateRef.current.active = true;
                dragStateRef.current.moved = false;
                dragStateRef.current.anchor = coord;
                dragStateRef.current.intent = 'deselect';
                dragDeselectPathRef.current = [coord];
                updateDragPreview(
                    selectedGems.filter((selection) => !areSameCoord(selection, coord))
                );
                return;
            }

            if (!isSelectableDragCell(board[r]?.[c])) {
                return;
            }

            startPointerCapture();
            dragStateRef.current.active = true;
            dragStateRef.current.moved = false;
            dragStateRef.current.anchor = coord;
            dragStateRef.current.intent = 'select';
            dragDeselectPathRef.current = [];
            clearDragPreview();
        },
        [
            board,
            boardInteractionMode,
            canInteract,
            clearDragPreview,
            handleGemClick,
            selectedGems,
            updateDragPreview,
        ]
    );

    const handleBoardGemPointerEnter = React.useCallback(
        (r: number, c: number) => {
            if (!dragStateRef.current.active || boardInteractionMode !== 'selection') {
                return;
            }

            const nextCoord = { r, c };

            if (dragStateRef.current.intent === 'deselect') {
                if (!hasCoord(selectedGems, nextCoord)) {
                    return;
                }

                const basePath =
                    dragDeselectPathRef.current.length > 0
                        ? dragDeselectPathRef.current
                        : dragStateRef.current.anchor
                          ? [dragStateRef.current.anchor]
                          : [];

                if (basePath.length === 0 || hasCoord(basePath, nextCoord)) {
                    return;
                }

                const nextDeselectPath = [...basePath, nextCoord];
                dragDeselectPathRef.current = nextDeselectPath;
                dragStateRef.current.moved = nextDeselectPath.length > 1;
                updateDragPreview(
                    selectedGems.filter((selection) => !hasCoord(nextDeselectPath, selection))
                );
                return;
            }

            if (!isSelectableDragCell(board[r]?.[c])) {
                return;
            }

            const basePath =
                dragPreviewRef.current.length > 0
                    ? dragPreviewRef.current
                    : dragStateRef.current.anchor
                      ? [dragStateRef.current.anchor]
                      : [];

            if (basePath.length === 0) {
                return;
            }

            const nextSelection = buildDragSelectionCandidate(basePath, nextCoord, board);

            if (!nextSelection) {
                return;
            }

            if (
                nextSelection.length !== dragPreviewRef.current.length ||
                nextSelection.some(
                    (coord, index) => !areSameCoord(coord, dragPreviewRef.current[index]!)
                )
            ) {
                dragStateRef.current.moved = nextSelection.length > 1;
                updateDragPreview(nextSelection);
            }
        },
        [board, boardInteractionMode, selectedGems, updateDragPreview]
    );

    const handleBoardPointerMove = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            if (!dragStateRef.current.active || boardInteractionMode !== 'selection') {
                return;
            }

            const coord = findNearestGemCoordFromPointer({
                clientX: event.clientX,
                clientY: event.clientY,
                rect: event.currentTarget.getBoundingClientRect(),
                panelFootprint,
                cellCenters,
            });

            if (!coord) {
                return;
            }

            handleBoardGemPointerEnter(coord.r, coord.c);
        },
        [
            boardInteractionMode,
            cellCenters,
            handleBoardGemPointerEnter,
            panelFootprint.heightPx,
            panelFootprint.widthPx,
        ]
    );

    return {
        displayedSelection,
        handleBoardGemClick,
        handleBoardGemPointerDown,
        handleBoardGemPointerEnter,
        handleBoardPointerMove,
    };
};
