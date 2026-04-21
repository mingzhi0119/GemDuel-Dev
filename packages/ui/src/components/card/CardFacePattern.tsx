import React from 'react';
import { GEM_TYPES } from '@gemduel/shared/constants';
import { Card as CardType } from '@gemduel/shared/types';

interface CardFacePatternProps {
    cardId: string;
    bonusColor?: CardType['bonusColor'];
}

export const CardFacePattern: React.FC<CardFacePatternProps> = ({ cardId, bonusColor }) => {
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
