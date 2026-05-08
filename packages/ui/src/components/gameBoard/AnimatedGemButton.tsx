import React from 'react';
import { cn } from '../../utils';
import { withGameAnimation } from '../../hoc/withGameAnimation';
import { getGemLabel } from '@gemduel/shared';
import { BoardCell, GemColor } from '@gemduel/shared/types';
import { GemArtwork } from '../GemArtwork';
import { useLocale } from '../../i18n/LocaleProvider';

interface GemButtonProps {
    r: number;
    c: number;
    gem: BoardCell;
    theme: 'light' | 'dark';
    isSelectedGem: boolean;
    isReserveGoldSelected?: boolean;
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
        isReserveGoldSelected = false,
        isTarget,
        shouldDim,
        isInteractive,
        selectionIndex,
        onGemClick,
        onGemPointerDown,
        onGemPointerEnter,
    }) => {
        const { locale } = useLocale();
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
        const gemLabel = getGemLabel(gem.type.id as GemColor, locale);
        const stateLabel = [
            isSelectedGem ? `selected ${selectionIndex + 1}` : null,
            isTarget ? 'selectable target' : null,
            isReserveGoldSelected ? 'reserved gold target selected' : null,
            !isInteractive ? 'not available' : null,
        ]
            .filter(Boolean)
            .join(', ');
        const ariaLabel = `${gemLabel} gem at row ${r + 1}, column ${c + 1}${
            stateLabel ? `, ${stateLabel}` : ''
        }`;

        return (
            <button
                onClick={handleClick}
                onPointerDown={handlePointerDown}
                onPointerEnter={handlePointerEnter}
                disabled={!isInteractive}
                aria-label={ariaLabel}
                className={`relative w-full h-full rounded-full flex items-center justify-center ${!isInteractive ? 'cursor-default' : 'cursor-pointer'}`}
            >
                <div
                    aria-hidden="true"
                    className={cn(
                        'absolute inset-[2%] rounded-[18%] pointer-events-none transition-all duration-300',
                        isSelectedGem &&
                            !isReserveGoldSelected &&
                            'rounded-full ring-2 ring-white shadow-[0_0_10px_white]',
                        (isTarget || isReserveGoldSelected) &&
                            'border-2 border-sky-200/90 animate-gem-reserve-target z-10',
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
                        (isTarget || isReserveGoldSelected) && 'z-20'
                    )}
                />
                {isSelectedGem && !isReserveGoldSelected && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center font-bold text-white drop-shadow-md text-lg">
                        {selectionIndex + 1}
                    </div>
                )}
            </button>
        );
    }
);

export const AnimatedGemButton = withGameAnimation(GemButton);
