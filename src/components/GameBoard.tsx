import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPIRAL_ORDER } from '../constants';
import { getFsmPhaseSurfacePolicy } from '../logic/fsm';
import { validateGemSelection } from '../logic/validators';
import { BoardCell, GamePhase, GemCoord, GemTypeObject } from '../types';
import { AnimatedGemButton } from './gameBoard/AnimatedGemButton';

export const GEM_BOARD_SIZE_PX = 375;
export const GEM_BOARD_GAP_PX = 8;
export const GEM_BOARD_GEM_SIZE_PX = Math.round((GEM_BOARD_SIZE_PX - GEM_BOARD_GAP_PX * 4) / 5);

interface GameBoardProps {
    board: BoardCell[][];
    handleGemClick: (r: number, c: number) => void;
    handleGemDragSelection: (coords: GemCoord[]) => void;
    selectedGems: GemCoord[];
    phase: GamePhase | string;
    bonusGemTarget: GemTypeObject | null;
    theme: 'light' | 'dark';
    canInteract?: boolean;
}

const areSameCoord = (left: GemCoord, right: GemCoord) => left.r === right.r && left.c === right.c;

const isSelectableDragCell = (cell: BoardCell | undefined) =>
    Boolean(cell && cell.type.id !== 'empty' && cell.type.id !== 'gold');

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

export const GameBoard: React.FC<GameBoardProps> = React.memo(
    ({
        board,
        handleGemClick,
        handleGemDragSelection,
        selectedGems,
        phase,
        bonusGemTarget,
        theme,
        canInteract = true,
    }) => {
        const surfacePolicy = getFsmPhaseSurfacePolicy(phase);
        const [dragPreview, setDragPreview] = React.useState<GemCoord[]>([]);
        const dragPreviewRef = React.useRef<GemCoord[]>([]);
        const dragStateRef = React.useRef({
            active: false,
            moved: false,
            suppressClick: false,
            anchor: null as GemCoord | null,
        });
        const suppressClickTimeoutRef = React.useRef<number | null>(null);

        const updateDragPreview = React.useCallback((coords: GemCoord[]) => {
            dragPreviewRef.current = coords;
            setDragPreview(coords);
        }, []);

        const clearDragPreview = React.useCallback(() => {
            dragPreviewRef.current = [];
            setDragPreview([]);
        }, []);

        const endDragSelection = React.useCallback(() => {
            if (!dragStateRef.current.active) {
                return;
            }

            const shouldCommit = dragStateRef.current.moved && dragPreviewRef.current.length > 1;
            dragStateRef.current.active = false;
            dragStateRef.current.moved = false;
            dragStateRef.current.anchor = null;

            if (shouldCommit) {
                handleGemDragSelection(dragPreviewRef.current);
                dragStateRef.current.suppressClick = true;

                if (suppressClickTimeoutRef.current !== null) {
                    window.clearTimeout(suppressClickTimeoutRef.current);
                }

                suppressClickTimeoutRef.current = window.setTimeout(() => {
                    dragStateRef.current.suppressClick = false;
                    suppressClickTimeoutRef.current = null;
                }, 0);
            }

            clearDragPreview();
        }, [clearDragPreview, handleGemDragSelection]);

        const cancelDragSelection = React.useCallback(() => {
            dragStateRef.current.active = false;
            dragStateRef.current.moved = false;
            dragStateRef.current.anchor = null;
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
            if (surfacePolicy.boardInteractionMode !== 'selection' || !canInteract) {
                cancelDragSelection();
            }
        }, [canInteract, cancelDragSelection, surfacePolicy.boardInteractionMode]);

        const displayedSelection = dragPreview.length > 0 ? dragPreview : selectedGems;

        const handleBoardGemClick = React.useCallback(
            (r: number, c: number) => {
                if (dragStateRef.current.suppressClick) {
                    return;
                }

                handleGemClick(r, c);
            },
            [handleGemClick]
        );

        const handleBoardGemPointerDown = React.useCallback(
            (event: React.PointerEvent<HTMLButtonElement>, r: number, c: number) => {
                if (
                    event.button !== 0 ||
                    !canInteract ||
                    surfacePolicy.boardInteractionMode !== 'selection'
                ) {
                    return;
                }

                if (!isSelectableDragCell(board[r]?.[c])) {
                    return;
                }

                dragStateRef.current.active = true;
                dragStateRef.current.moved = false;
                dragStateRef.current.anchor = { r, c };
                clearDragPreview();
            },
            [board, canInteract, clearDragPreview, surfacePolicy.boardInteractionMode]
        );

        const handleBoardGemPointerEnter = React.useCallback(
            (r: number, c: number) => {
                if (
                    !dragStateRef.current.active ||
                    surfacePolicy.boardInteractionMode !== 'selection'
                ) {
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

                const nextSelection = buildDragSelectionCandidate(basePath, { r, c }, board);

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
            [board, surfacePolicy.boardInteractionMode, updateDragPreview]
        );

        return (
            <div
                className={`p-4 rounded-[2rem] border transition-all duration-500 backdrop-blur-md
            ${
                theme === 'dark'
                    ? 'bg-slate-800/70 border-slate-600 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.07)]'
                    : 'bg-white border-stone-300/80'
            }
            ${phase === 'DISCARD_EXCESS_GEMS' ? 'border-red-500/50 ring-2 ring-red-500/10' : ''}
        `}
            >
                <div
                    className={`grid grid-cols-5 grid-rows-5 gap-2 ${!canInteract ? 'pointer-events-none' : ''}`}
                    style={{
                        width: `${GEM_BOARD_SIZE_PX}px`,
                        height: `${GEM_BOARD_SIZE_PX}px`,
                    }}
                >
                    {board.map((row, r) =>
                        row.map((gem, c) => {
                            const isSelectedGem = displayedSelection.some(
                                (selection) => selection.r === r && selection.c === c
                            );
                            const isGold = gem?.type?.id === 'gold';
                            const isEmpty = !gem || gem.type.id === 'empty';

                            // Target Logic
                            let isTarget = false;
                            if (surfacePolicy.boardInteractionMode === 'reserve-gold')
                                isTarget = isGold;
                            else if (surfacePolicy.boardInteractionMode === 'privilege-target')
                                isTarget = !isGold && !isEmpty;
                            else if (surfacePolicy.boardInteractionMode === 'bonus-target')
                                isTarget = gem.type.id === bonusGemTarget?.id;

                            const isTargetSelectionMode =
                                surfacePolicy.boardInteractionMode !== 'selection' &&
                                surfacePolicy.boardInteractionMode !== 'disabled';
                            const shouldDim = isTargetSelectionMode && !isTarget && !isEmpty;

                            const isReviewOrOver = phase === 'REVIEW' || phase === 'GAME_OVER';
                            const isInteractive = !isEmpty && !isReviewOrOver;

                            // Find index in spiral order for sequential entry animation
                            const orderIndex = SPIRAL_ORDER.findIndex(
                                ([sr, sc]) => sr === r && sc === c
                            );

                            return (
                                <div
                                    key={`${r}-${c}`} // Stable Grid Key
                                    className="relative w-full h-full flex items-center justify-center"
                                >
                                    <AnimatePresence mode="wait">
                                        {!isEmpty ? (
                                            <AnimatedGemButton
                                                key={gem.uid} // Dynamic Gem Key triggers animation on change
                                                r={r}
                                                c={c}
                                                gem={gem}
                                                theme={theme}
                                                isSelectedGem={isSelectedGem}
                                                isTarget={isTarget}
                                                shouldDim={shouldDim}
                                                isInteractive={isInteractive}
                                                selectionIndex={displayedSelection.findIndex(
                                                    (s) => s.r === r && s.c === c
                                                )}
                                                onGemClick={handleBoardGemClick}
                                                onGemPointerDown={handleBoardGemPointerDown}
                                                onGemPointerEnter={handleBoardGemPointerEnter}
                                                animationConfig={{
                                                    mode: 'scale',
                                                    hoverScale: 1.1,
                                                    tapScale: 0.95,
                                                    layout: false,
                                                    className: 'w-full h-full',
                                                    delay: orderIndex * 0.05,
                                                }}
                                            />
                                        ) : (
                                            <motion.div
                                                key="empty" // Dynamic Empty Key
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-slate-700/30' : 'bg-slate-300/50'}`}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        );
    }
);
