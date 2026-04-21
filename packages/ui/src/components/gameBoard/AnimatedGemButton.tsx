import React from 'react';
import { withGameAnimation } from '../../hoc/withGameAnimation';
import { BoardCell } from '@gemduel/shared/types';

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
    onGemPointerDown: (event: React.PointerEvent<HTMLButtonElement>, r: number, c: number) => void;
    onGemPointerEnter: (r: number, c: number) => void;
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
        onGemPointerDown,
        onGemPointerEnter,
    }) => {
        const handleClick = React.useCallback(() => {
            onGemClick(r, c);
        }, [r, c, onGemClick]);

        const handlePointerDown = React.useCallback(
            (event: React.PointerEvent<HTMLButtonElement>) => {
                onGemPointerDown(event, r, c);
            },
            [c, onGemPointerDown, r]
        );

        const handlePointerEnter = React.useCallback(() => {
            onGemPointerEnter(r, c);
        }, [c, onGemPointerEnter, r]);

        return (
            <button
                onClick={handleClick}
                onPointerDown={handlePointerDown}
                onPointerEnter={handlePointerEnter}
                disabled={!isInteractive}
                className={`w-full h-full rounded-full flex items-center justify-center ${!isInteractive ? 'cursor-default' : 'cursor-pointer'}`}
            >
                <div
                    className={`w-full h-full rounded-full shadow-inner bg-gradient-to-br ${gem.type.color} border ${gem.type.border} 
                    ${isSelectedGem ? 'ring-2 ring-white scale-105 shadow-[0_0_10px_white]' : 'opacity-90'} 
                    ${isTarget ? 'ring-4 ring-white animate-pulse z-20' : ''}
                    ${shouldDim ? 'opacity-20 grayscale' : ''}`}
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

export const AnimatedGemButton = withGameAnimation(GemButton);
