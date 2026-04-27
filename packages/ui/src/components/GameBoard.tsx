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
import { GEM_BOARD_DIMENSION, resolveGemPanelGeometry } from './gameBoard/gemPanelLayout';
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
    showCalibrationOverlay?: boolean;
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
        showCalibrationOverlay = false,
    }) => {
        const surfacePolicy = getFsmPhaseSurfacePolicy(phase);
        const { panelFootprint, cellCenters, cellGridLines, gemDiameterPx } =
            resolveGemPanelGeometry(panelSkin);
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
                        background: 'transparent',
                        boxShadow: 'none',
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
                                        width: `${gemDiameterPx}px`,
                                        height: `${gemDiameterPx}px`,
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
                {showCalibrationOverlay && (
                    <div
                        data-gem-panel-calibration-overlay="true"
                        className="pointer-events-none absolute inset-0 z-40"
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            className="absolute inset-0 h-full w-full"
                        >
                            <rect
                                x={panelSkin.playfieldRectNormalized.left * 100}
                                y={panelSkin.playfieldRectNormalized.top * 100}
                                width={
                                    (panelSkin.playfieldRectNormalized.right -
                                        panelSkin.playfieldRectNormalized.left) *
                                    100
                                }
                                height={
                                    (panelSkin.playfieldRectNormalized.bottom -
                                        panelSkin.playfieldRectNormalized.top) *
                                    100
                                }
                                fill="rgba(6,182,212,0.04)"
                                stroke="rgba(125,211,252,0.74)"
                                strokeWidth="0.18"
                            />
                            {cellGridLines.x.map((x) => (
                                <line
                                    key={`calibration-x-${x}`}
                                    x1={x * 100}
                                    y1={panelSkin.playfieldRectNormalized.top * 100}
                                    x2={x * 100}
                                    y2={panelSkin.playfieldRectNormalized.bottom * 100}
                                    stroke="rgba(250,204,21,0.72)"
                                    strokeWidth="0.12"
                                />
                            ))}
                            {cellGridLines.y.map((y) => (
                                <line
                                    key={`calibration-y-${y}`}
                                    x1={panelSkin.playfieldRectNormalized.left * 100}
                                    y1={y * 100}
                                    x2={panelSkin.playfieldRectNormalized.right * 100}
                                    y2={y * 100}
                                    stroke="rgba(250,204,21,0.72)"
                                    strokeWidth="0.12"
                                />
                            ))}
                            {Array.from({
                                length: GEM_BOARD_DIMENSION * GEM_BOARD_DIMENSION,
                            }).map((_, index) => {
                                const row = Math.floor(index / GEM_BOARD_DIMENSION);
                                const col = index % GEM_BOARD_DIMENSION;
                                const left = cellGridLines.x[col] ?? 0;
                                const right = cellGridLines.x[col + 1] ?? left;
                                const top = cellGridLines.y[row] ?? 0;
                                const bottom = cellGridLines.y[row + 1] ?? top;

                                return (
                                    <React.Fragment key={`calibration-diagonal-${index}`}>
                                        <line
                                            x1={left * 100}
                                            y1={top * 100}
                                            x2={right * 100}
                                            y2={bottom * 100}
                                            stroke="rgba(34,211,238,0.45)"
                                            strokeWidth="0.1"
                                        />
                                        <line
                                            x1={right * 100}
                                            y1={top * 100}
                                            x2={left * 100}
                                            y2={bottom * 100}
                                            stroke="rgba(34,211,238,0.45)"
                                            strokeWidth="0.1"
                                        />
                                    </React.Fragment>
                                );
                            })}
                            {cellGridLines.x.flatMap((x) =>
                                cellGridLines.y.map((y) => (
                                    <circle
                                        key={`calibration-intersection-${x}-${y}`}
                                        cx={x * 100}
                                        cy={y * 100}
                                        r="0.32"
                                        fill="rgba(251,191,36,0.92)"
                                        stroke="rgba(0,0,0,0.65)"
                                        strokeWidth="0.08"
                                    />
                                ))
                            )}
                        </svg>
                        {cellCenters.map((center, index) => (
                            <div
                                key={`calibration-${index}`}
                                data-gem-panel-calibration-cell={index}
                                className="absolute rounded-full border border-white/80 bg-cyan-300/10 shadow-[0_0_8px_rgba(6,182,212,0.7)]"
                                style={{
                                    left: `${(center.x * 100).toFixed(3)}%`,
                                    top: `${(center.y * 100).toFixed(3)}%`,
                                    width: `${gemDiameterPx}px`,
                                    height: `${gemDiameterPx}px`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }
);
