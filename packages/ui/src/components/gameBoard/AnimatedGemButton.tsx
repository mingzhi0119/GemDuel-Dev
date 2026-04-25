import React from 'react';
import { cn } from '@gemduel/shared/utils';
import { withGameAnimation } from '../../hoc/withGameAnimation';
import { BoardCell } from '@gemduel/shared/types';
import { GemArtwork } from '../GemArtwork';

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
                className={`relative w-full h-full rounded-full flex items-center justify-center ${!isInteractive ? 'cursor-default' : 'cursor-pointer'}`}
            >
                <div
                    aria-hidden="true"
                    className={cn(
                        'absolute inset-[7%] rounded-full transition-all duration-150',
                        theme === 'dark'
                            ? 'bg-white/5 shadow-[0_10px_20px_rgba(0,0,0,0.28)]'
                            : 'bg-transparent shadow-none',
                        isSelectedGem && 'ring-2 ring-white shadow-[0_0_10px_white]',
                        isTarget && 'ring-4 ring-white animate-pulse z-10',
                        shouldDim && 'opacity-20'
                    )}
                />
                <GemArtwork
                    gemId={gem.type.id}
                    theme={theme}
                    variant="board"
                    className={cn(
                        'h-full w-full transition-all duration-150',
                        isSelectedGem ? 'scale-105' : 'opacity-95',
                        shouldDim && 'opacity-20 grayscale',
                        isTarget && 'z-20'
                    )}
                />
                {isSelectedGem && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center font-bold text-white drop-shadow-md text-lg">
                        {selectionIndex + 1}
                    </div>
                )}
            </button>
        );
    }
);

export const AnimatedGemButton = withGameAnimation(GemButton);
