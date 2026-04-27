import React from 'react';
import { GEM_TYPES } from '@gemduel/shared/constants';
import { Card as CardType } from '@gemduel/shared/types';
import { CARD_ARTWORK_SOURCE_SIZE } from './cardArtwork';

interface CardFacePatternProps {
    cardId: string;
    bonusColor?: CardType['bonusColor'];
    artworkPath?: string | null;
}

export const CardFacePattern: React.FC<CardFacePatternProps> = ({
    cardId,
    bonusColor,
    artworkPath,
}) => {
    const [failedArtworkPath, setFailedArtworkPath] = React.useState<string | null>(null);
    const artworkFailed = Boolean(artworkPath && failedArtworkPath === artworkPath);

    if (artworkPath && !artworkFailed) {
        return (
            <>
                <div
                    aria-hidden="true"
                    data-card-artwork-placeholder={cardId}
                    className="absolute inset-0 pointer-events-none bg-slate-800"
                />
                <img
                    src={artworkPath}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    width={CARD_ARTWORK_SOURCE_SIZE.width}
                    height={CARD_ARTWORK_SOURCE_SIZE.height}
                    loading="eager"
                    decoding="sync"
                    data-card-artwork={cardId}
                    className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
                    onError={() => setFailedArtworkPath(artworkPath)}
                />
            </>
        );
    }

    const isGray = bonusColor === 'null';
    const themeColor =
        !isGray && bonusColor
            ? GEM_TYPES[bonusColor.toUpperCase() as keyof typeof GEM_TYPES].color
                  .split(' ')[0]
                  .replace('from-', '')
            : 'slate-600';

    const seed = cardId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const patternType = seed % 3;

    return (
        <div
            data-card-face-pattern="true"
            className={`absolute inset-0 overflow-hidden pointer-events-none opacity-30 mix-blend-overlay ${isGray ? 'brightness-50 grayscale' : ''}`}
        >
            <svg width="100%" height="100%" className="w-full h-full">
                <defs>
                    <pattern
                        id={`pattern-${cardId}`}
                        x="0"
                        y="0"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                    >
                        {patternType === 0 && (
                            <circle
                                cx="20"
                                cy="20"
                                r={10 + (seed % 10)}
                                fill="currentColor"
                                className={`text-${themeColor}`}
                            />
                        )}
                        {patternType === 1 && (
                            <rect
                                width="2"
                                height="40"
                                x="19"
                                fill="currentColor"
                                className={`text-${themeColor}`}
                                transform={`rotate(${seed % 90} 20 20)`}
                            />
                        )}
                        {patternType === 2 && (
                            <path
                                d="M20 5 L35 35 L5 35 Z"
                                fill="currentColor"
                                className={`text-${themeColor}`}
                                transform={`rotate(${seed % 360} 20 20)`}
                            />
                        )}
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#pattern-${cardId})`} />
                <radialGradient id={`glow-${cardId}`}>
                    <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="black" stopOpacity="0" />
                </radialGradient>
                <rect width="100%" height="100%" fill={`url(#glow-${cardId})`} />
            </svg>
        </div>
    );
};
