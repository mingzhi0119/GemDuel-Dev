import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPIRAL_ORDER } from '@gemduel/shared/constants';
import { getFsmPhaseSurfacePolicy } from '@gemduel/shared/logic/fsm';
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
import {
    useGemBoardDragSelection,
    type GemDragSelectionIntent,
} from './gameBoard/useGemBoardDragSelection';

interface GameBoardProps {
    board: BoardCell[][];
    handleGemClick: (r: number, c: number) => void;
    handleGemDragSelection: (coords: GemCoord[], intent?: GemDragSelectionIntent) => void;
    selectedGems: GemCoord[];
    reserveGoldSelection?: GemCoord | null;
    phase: GamePhase | string;
    bonusGemTarget: GemTypeObject | null;
    theme: 'light' | 'dark';
    canInteract?: boolean;
    surfaceStyle?: React.CSSProperties;
    panelSkin: GemPanelSkin;
}

export const GameBoard: React.FC<GameBoardProps> = React.memo(
    ({
        board,
        handleGemClick,
        handleGemDragSelection,
        selectedGems,
        reserveGoldSelection = null,
        phase,
        bonusGemTarget,
        theme,
        canInteract = true,
        surfaceStyle,
        panelSkin,
    }) => {
        const surfacePolicy = getFsmPhaseSurfacePolicy(phase);
        const panelFootprint = calculateGemPanelFootprintPx(panelSkin);
        const cellCenters = getGemPanelCellCentersNormalized(panelSkin);
        const playfieldRectStyle = {
            left: `${panelSkin.playfieldRectNormalized.left * 100}%`,
            top: `${panelSkin.playfieldRectNormalized.top * 100}%`,
            width: `${(panelSkin.playfieldRectNormalized.right - panelSkin.playfieldRectNormalized.left) * 100}%`,
            height: `${(panelSkin.playfieldRectNormalized.bottom - panelSkin.playfieldRectNormalized.top) * 100}%`,
        } as const;
        const {
            displayedSelection,
            handleBoardGemClick,
            handleBoardGemPointerDown,
            handleBoardGemPointerEnter,
            handleBoardPointerMove,
        } = useGemBoardDragSelection({
            board,
            selectedGems,
            canInteract,
            boardInteractionMode: surfacePolicy.boardInteractionMode,
            panelFootprint,
            cellCenters,
            handleGemClick,
            handleGemDragSelection,
        });

        return (
            <div
                data-surface-slot="gem-panel"
                data-gem-panel-skin={panelSkin.id}
                className={`relative overflow-hidden transition-[box-shadow,filter,opacity] duration-500 ${
                    phase === 'DISCARD_EXCESS_GEMS' ? 'ring-2 ring-red-500/20' : ''
                }`}
                style={{
                    width: `${panelFootprint.widthPx}px`,
                    height: `${panelFootprint.heightPx}px`,
                }}
                onPointerMove={handleBoardPointerMove}
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
                            const isReserveGoldSelected =
                                reserveGoldSelection?.r === r && reserveGoldSelection?.c === c;
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
                            const shouldDim =
                                isTargetSelectionMode &&
                                surfacePolicy.boardInteractionMode !== 'reserve-gold' &&
                                !isTarget &&
                                !isEmpty;

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
                                                isReserveGoldSelected={isReserveGoldSelected}
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
