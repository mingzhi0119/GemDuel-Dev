import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPIRAL_ORDER } from '@gemduel/shared/constants';
import { getFsmPhaseSurfacePolicy } from '@gemduel/shared/logic/fsm';
import { validateGemSelection } from '@gemduel/shared/logic/validators';
import type {
    BoardCell,
    GamePhase,
    GemCoord,
    GemPanelSkin,
    GemTypeObject,
} from '@gemduel/shared/types';
import { AnimatedGemButton } from './gameBoard/AnimatedGemButton';
import {
    calculateGemPanelFootprintPx,
    GEM_BOARD_DIMENSION,
    GEM_BOARD_GEM_SIZE_PX,
    getGemPanelCellCentersNormalized,
} from './gameBoard/gemPanelLayout';

interface GameBoardProps {
    board: BoardCell[][];
    handleGemClick: (r: number, c: number) => void;
    handleGemDragSelection: (coords: GemCoord[]) => void;
    selectedGems: GemCoord[];
    phase: GamePhase | string;
    bonusGemTarget: GemTypeObject | null;
    theme: 'light' | 'dark';
    canInteract?: boolean;
    surfaceStyle?: React.CSSProperties;
    panelSkin: GemPanelSkin;
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
        surfaceStyle,
        panelSkin,
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
        const panelFootprint = calculateGemPanelFootprintPx(panelSkin);
        const cellCenters = getGemPanelCellCentersNormalized(panelSkin);
        const playfieldRectStyle = {
            left: `${panelSkin.playfieldRectNormalized.left * 100}%`,
            top: `${panelSkin.playfieldRectNormalized.top * 100}%`,
            width: `${(panelSkin.playfieldRectNormalized.right - panelSkin.playfieldRectNormalized.left) * 100}%`,
            height: `${(panelSkin.playfieldRectNormalized.bottom - panelSkin.playfieldRectNormalized.top) * 100}%`,
        } as const;

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
                data-surface-slot="gem-panel"
                data-gem-panel-skin={panelSkin.id}
                className={`relative overflow-hidden transition-all duration-500 ${
                    phase === 'DISCARD_EXCESS_GEMS' ? 'ring-2 ring-red-500/20' : ''
                }`}
                style={{
                    width: `${panelFootprint.widthPx}px`,
                    height: `${panelFootprint.heightPx}px`,
                }}
            >
                <div
                    aria-hidden="true"
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{ ...surfaceStyle, width: '100%', height: '100%' }}
                />
                <div
                    aria-hidden="true"
                    className="absolute z-[1] pointer-events-none rounded-[2rem]"
                    style={{
                        ...playfieldRectStyle,
                        ...(theme === 'light'
                            ? {
                                  background:
                                      'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
                                  boxShadow:
                                      'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -12px 24px rgba(15,23,42,0.06)',
                              }
                            : {
                                  background:
                                      'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(2,6,23,0.10) 100%)',
                                  boxShadow:
                                      'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -14px 24px rgba(0,0,0,0.18)',
                              }),
                    }}
                />

                <div
                    className={`relative z-10 h-full w-full ${!canInteract ? 'pointer-events-none' : ''}`}
                >
                    {board.map((row, r) =>
                        row.map((gem, c) => {
                            const center = cellCenters[r * GEM_BOARD_DIMENSION + c]!;
                            const isSelectedGem = displayedSelection.some(
                                (selection) => selection.r === r && selection.c === c
                            );
                            const isGold = gem?.type?.id === 'gold';
                            const isEmpty = !gem || gem.type.id === 'empty';

                            let isTarget = false;
                            if (surfacePolicy.boardInteractionMode === 'reserve-gold') {
                                isTarget = isGold;
                            } else if (surfacePolicy.boardInteractionMode === 'privilege-target') {
                                isTarget = !isGold && !isEmpty;
                            } else if (surfacePolicy.boardInteractionMode === 'bonus-target') {
                                isTarget = gem.type.id === bonusGemTarget?.id;
                            }

                            const isTargetSelectionMode =
                                surfacePolicy.boardInteractionMode !== 'selection' &&
                                surfacePolicy.boardInteractionMode !== 'disabled';
                            const shouldDim = isTargetSelectionMode && !isTarget && !isEmpty;

                            const isReviewOrOver = phase === 'REVIEW' || phase === 'GAME_OVER';
                            const isInteractive = !isEmpty && !isReviewOrOver;
                            const orderIndex = SPIRAL_ORDER.findIndex(
                                ([sr, sc]) => sr === r && sc === c
                            );

                            return (
                                <div
                                    key={`${r}-${c}`}
                                    data-board-cell={`${r}-${c}`}
                                    data-gem-id={isEmpty ? 'empty' : gem.type.id}
                                    className="absolute flex items-center justify-center"
                                    style={{
                                        left: `${(center.x * 100).toFixed(3)}%`,
                                        top: `${(center.y * 100).toFixed(3)}%`,
                                        width: `${GEM_BOARD_GEM_SIZE_PX}px`,
                                        height: `${GEM_BOARD_GEM_SIZE_PX}px`,
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                >
                                    <AnimatePresence mode="wait">
                                        {!isEmpty ? (
                                            <AnimatedGemButton
                                                key={gem.uid}
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
                                                    className: 'h-full w-full',
                                                    delay: orderIndex * 0.05,
                                                }}
                                            />
                                        ) : (
                                            <motion.div
                                                key="empty"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={`h-2 w-2 rounded-full ${
                                                    theme === 'dark'
                                                        ? 'bg-slate-700/30'
                                                        : 'bg-slate-300/50'
                                                }`}
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
