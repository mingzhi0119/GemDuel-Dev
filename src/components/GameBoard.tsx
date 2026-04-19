import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { withGameAnimation } from '../hoc/withGameAnimation';
import { SPIRAL_ORDER } from '../constants';
import { BoardCell, GamePhase, GemCoord, GemTypeObject } from '../types';

export const GEM_BOARD_SIZE_PX = 375;
export const GEM_BOARD_GAP_PX = 8;
export const GEM_BOARD_GEM_SIZE_PX = Math.round((GEM_BOARD_SIZE_PX - GEM_BOARD_GAP_PX * 4) / 5);

interface GemButtonProps {
    r: number;
    c: number;
    gem: BoardCell;
    theme: 'light' | 'dark';
    isSelectedGem: boolean;
    isTarget: boolean;
    shouldDim: boolean;
    isInteractive: boolean;
    selectionIndex: number;
    onGemClick: (r: number, c: number) => void;
}

const GemButton: React.FC<GemButtonProps> = React.memo(
    ({
        r,
        c,
        gem,
        theme,
        isSelectedGem,
        isTarget,
        shouldDim,
        isInteractive,
        selectionIndex,
        onGemClick,
    }) => {
        const handleClick = React.useCallback(() => {
            onGemClick(r, c);
        }, [r, c, onGemClick]);

        return (
            <button
                onClick={handleClick}
                disabled={!isInteractive}
                className={`w-full h-full rounded-full flex items-center justify-center ${!isInteractive ? 'cursor-default' : 'cursor-pointer'}`}
            >
                <div
                    className={`w-full h-full rounded-full shadow-inner bg-gradient-to-br ${gem.type.color} border ${gem.type.border} 
                    ${isSelectedGem ? 'ring-2 ring-white scale-105 shadow-[0_0_10px_white]' : 'opacity-90'} 
                    ${isTarget ? 'ring-4 ring-white animate-pulse z-20' : ''}
                    ${shouldDim ? 'opacity-20 grayscale' : ''}
                `}
                    style={
                        theme === 'light'
                            ? {
                                  boxShadow: [
                                      '0 4px 12px rgba(0,0,0,0.05)',
                                      'inset 0 1px 2px rgba(255,255,255,0.35)',
                                      isSelectedGem ? '0 0 10px rgba(255,255,255,0.9)' : '',
                                      isTarget ? '0 0 18px rgba(255,255,255,0.9)' : '',
                                  ]
                                      .filter(Boolean)
                                      .join(', '),
                              }
                            : undefined
                    }
                >
                    {isSelectedGem && (
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-white drop-shadow-md text-lg">
                            {selectionIndex + 1}
                        </div>
                    )}
                </div>
            </button>
        );
    }
);

const AnimatedGem = withGameAnimation(GemButton);

interface GameBoardProps {
    board: BoardCell[][];
    handleGemClick: (r: number, c: number) => void;
    isSelected: (r: number, c: number) => boolean;
    selectedGems: GemCoord[];
    phase: GamePhase | string;
    bonusGemTarget: GemTypeObject | null;
    theme: 'light' | 'dark';
    canInteract?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = React.memo(
    ({
        board,
        handleGemClick,
        isSelected,
        selectedGems,
        phase,
        bonusGemTarget,
        theme,
        canInteract = true,
    }) => {
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
                            const isSelectedGem = isSelected(r, c);
                            const isGold = gem?.type?.id === 'gold';
                            const isEmpty = !gem || gem.type.id === 'empty';

                            // Target Logic
                            let isTarget = false;
                            if (phase === 'RESERVE_WAITING_GEM') isTarget = isGold;
                            else if (phase === 'PRIVILEGE_ACTION') isTarget = !isGold && !isEmpty;
                            else if (phase === 'BONUS_ACTION')
                                isTarget = gem.type.id === bonusGemTarget?.id;

                            const isTargetSelectionMode = [
                                'RESERVE_WAITING_GEM',
                                'PRIVILEGE_ACTION',
                                'BONUS_ACTION',
                            ].includes(phase);
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
                                            <AnimatedGem
                                                key={gem.uid} // Dynamic Gem Key triggers animation on change
                                                r={r}
                                                c={c}
                                                gem={gem}
                                                theme={theme}
                                                isSelectedGem={isSelectedGem}
                                                isTarget={isTarget}
                                                shouldDim={shouldDim}
                                                isInteractive={isInteractive}
                                                selectionIndex={selectedGems.findIndex(
                                                    (s) => s.r === r && s.c === c
                                                )}
                                                onGemClick={handleGemClick}
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
