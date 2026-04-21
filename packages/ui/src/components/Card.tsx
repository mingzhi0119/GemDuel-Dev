import React from 'react';
import { Crown, Download } from 'lucide-react';
import { GEM_TYPES } from '@gemduel/shared/constants';
import { GemIcon } from './GemIcon';
import { Card as CardType, CardInteractionContext, GemColor } from '@gemduel/shared/types';
import { CardAbilityBadges } from './card/CardAbilityBadges';
import { CardFacePattern } from './card/CardFacePattern';

interface CardProps {
    card: CardType | null;
    canBuy?: boolean;
    onClick?: (card: CardType, context?: CardInteractionContext) => void;
    onReserve?: (card: CardType, context?: CardInteractionContext) => void;
    context?: CardInteractionContext;
    isReservedView?: boolean;
    isRoyal?: boolean;
    className?: string;
    size?: 'default' | 'small';
    theme?: 'light' | 'dark';
    isDeckPreview?: boolean;
}

const BASE_CARD_SIZE = Object.freeze({
    width: 96,
    height: 128,
});

export const STANDARD_CARD_SIZE = Object.freeze({
    width: 120,
    height: 160,
});

export const SMALL_CARD_SCALE = 0.75;

export const SMALL_CARD_SIZE = Object.freeze({
    width: Math.round(STANDARD_CARD_SIZE.width * SMALL_CARD_SCALE),
    height: Math.round(STANDARD_CARD_SIZE.height * SMALL_CARD_SCALE),
});

const getCardDimensions = (size: CardProps['size']) =>
    size === 'small' ? SMALL_CARD_SIZE : STANDARD_CARD_SIZE;

const scaleCardMetric = (value: number, cardScale: number) =>
    Math.max(1, Math.round(value * cardScale));

const WildBonusDisc = ({ diameter, theme }: { diameter: number; theme: 'light' | 'dark' }) => (
    <div
        className={`relative overflow-hidden rounded-full border ${
            theme === 'dark'
                ? 'border-white/35 shadow-[0_2px_8px_rgba(0,0,0,0.45)]'
                : 'border-slate-400/80 shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
        }`}
        style={{
            width: `${diameter}px`,
            height: `${diameter}px`,
            background:
                'conic-gradient(from -90deg, #2563eb 0deg 72deg, #f8fafc 72deg 144deg, #10b981 144deg 216deg, #0f172a 216deg 288deg, #ef4444 288deg 360deg)',
        }}
        title="Wild bonus"
    >
        <div
            className={`absolute inset-[22%] rounded-full ${
                theme === 'dark'
                    ? 'border border-white/30 bg-white/10'
                    : 'border border-white/80 bg-white/35'
            }`}
        />
    </div>
);

export const Card: React.FC<CardProps> = React.memo(
    ({
        card,
        canBuy,
        onClick,
        onReserve,
        context,
        isReservedView = false,
        isRoyal = false,
        className = '',
        size = 'default',
        theme = 'dark',
    }) => {
        const dimensions = getCardDimensions(size);
        const cardScale = dimensions.width / BASE_CARD_SIZE.width;
        const cornerRadiusPx = scaleCardMetric(8, cardScale);
        const topInsetPx = scaleCardMetric(4, cardScale);
        const sideInsetPx = scaleCardMetric(6, cardScale);
        const bottomInsetPx = scaleCardMetric(6, cardScale);
        const topRightInsetPx = scaleCardMetric(4, cardScale);
        const topClusterGapPx = scaleCardMetric(4, cardScale);
        const stackedGapPx = scaleCardMetric(2, cardScale);
        const pointFontSizePx = scaleCardMetric(18, cardScale);
        const abilityIconSizePx = scaleCardMetric(12, cardScale);
        const abilityBadgePaddingPx = scaleCardMetric(2, cardScale);
        const abilityBadgeRadiusPx = scaleCardMetric(6, cardScale);
        const bonusGemSizePx = scaleCardMetric(20, cardScale);
        const costContainerSizePx = scaleCardMetric(18, cardScale);
        const costTextSizePx = scaleCardMetric(9, cardScale);
        const crownIconSizePx = scaleCardMetric(12, cardScale);
        const royalBadgeSizePx = scaleCardMetric(24, cardScale);
        const reserveButtonIconSizePx = scaleCardMetric(16, cardScale);
        const reserveButtonPaddingPx = scaleCardMetric(6, cardScale);

        // Empty State
        if (!card)
            return (
                <div
                    className="bg-slate-800/50 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-slate-600 text-xs"
                    style={{
                        width: `${dimensions.width}px`,
                        height: `${dimensions.height}px`,
                        borderRadius: `${cornerRadiusPx}px`,
                    }}
                >
                    Empty
                </div>
            );

        // Size-dependent styles
        // Background Gradient
        const bgGradient = isRoyal
            ? 'from-yellow-600 to-amber-800 ring-2 ring-yellow-400/50'
            : card.level === 1
              ? 'from-slate-700 to-slate-800'
              : card.level === 2
                ? 'from-yellow-900/40 to-slate-800'
                : 'from-blue-900/40 to-slate-800';

        const handleCardClick = () => {
            if ((canBuy || isRoyal) && onClick) {
                onClick(card, context);
            }
        };

        const getScoreColor = (color: string | undefined | null) => {
            switch (color) {
                case 'blue':
                    return 'text-blue-300';
                case 'green':
                    return theme === 'dark' ? 'text-emerald-300' : 'text-emerald-400';
                case 'red':
                    return theme === 'dark' ? 'text-rose-300' : 'text-rose-500';
                case 'black':
                    return theme === 'dark' ? 'text-slate-500' : 'text-black';
                case 'white':
                    return 'text-white';
                case 'gold':
                    return theme === 'dark' ? 'text-amber-300' : 'text-amber-500';
                case 'null':
                case null:
                case undefined:
                    return theme === 'dark' ? 'text-gray-200' : 'text-gray-400';
                default:
                    return 'text-white';
            }
        };

        return (
            <div
                onClick={handleCardClick}
                className={`relative rounded-lg border transition-colors duration-200 bg-gradient-to-b ${bgGradient} overflow-hidden group ${className}
        ${
            canBuy && !isRoyal
                ? (theme === 'dark'
                      ? 'border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
                      : 'border-emerald-500 shadow-[0_4px_12px_rgba(0,0,0,0.05),0_0_10px_rgba(16,185,129,0.28)]') +
                  ' cursor-pointer'
                : isRoyal
                  ? theme === 'dark'
                      ? 'border-yellow-700/50'
                      : 'border-yellow-600/60 shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
                  : (theme === 'dark'
                        ? 'border-slate-600'
                        : 'border-slate-300 shadow-[0_4px_12px_rgba(0,0,0,0.05)]') +
                    ' opacity-90 cursor-default'
        }
    `}
                style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    borderRadius: `${cornerRadiusPx}px`,
                }}
            >
                <CardFacePattern cardId={card.id} bonusColor={card.bonusColor} />
                {/* 1. Top Left: Points & Ability */}
                <div
                    className="absolute flex flex-row items-center pointer-events-none z-10"
                    style={{
                        top: `${topInsetPx}px`,
                        left: `${sideInsetPx}px`,
                        gap: `${topClusterGapPx}px`,
                    }}
                >
                    {Number(card.points) > 0 && (
                        <span
                            className={`font-bold leading-none drop-shadow-md ${getScoreColor(card.bonusColor)}`}
                            style={{ fontSize: `${pointFontSizePx}px` }}
                        >
                            {card.points}
                        </span>
                    )}
                    <CardAbilityBadges
                        ability={card.ability}
                        stackedGapPx={stackedGapPx}
                        abilityIconSizePx={abilityIconSizePx}
                        abilityBadgePaddingPx={abilityBadgePaddingPx}
                        abilityBadgeRadiusPx={abilityBadgeRadiusPx}
                    />
                </div>

                {/* 2. Top Right: Bonus Gem */}
                <div
                    className="absolute pointer-events-none flex flex-col z-10"
                    style={{
                        top: `${topInsetPx}px`,
                        right: `${topRightInsetPx}px`,
                        gap: `${stackedGapPx}px`,
                    }}
                >
                    {card.bonusColor &&
                        card.bonusColor !== 'null' &&
                        Array.from({
                            length: card.bonusCount ?? (isRoyal ? 0 : 1),
                        }).map((_, i) =>
                            card.bonusColor === 'gold' ? (
                                <WildBonusDisc
                                    key={`wild-${i}`}
                                    diameter={bonusGemSizePx}
                                    theme={theme}
                                />
                            ) : (
                                <div
                                    key={i}
                                    style={{
                                        width: `${bonusGemSizePx}px`,
                                        height: `${bonusGemSizePx}px`,
                                    }}
                                >
                                    <GemIcon
                                        type={
                                            GEM_TYPES[
                                                card.bonusColor!.toUpperCase() as keyof typeof GEM_TYPES
                                            ]
                                        }
                                        size="w-full h-full"
                                        theme={theme}
                                        className="shadow-md"
                                    />
                                </div>
                            )
                        )}
                </div>

                {/* 3. Bottom Left: Cost */}
                {card.cost && (
                    <div
                        className="absolute pointer-events-none z-10"
                        style={{
                            bottom: `${bottomInsetPx}px`,
                            left: `${sideInsetPx}px`,
                        }}
                    >
                        <div className="flex flex-col" style={{ gap: `${stackedGapPx}px` }}>
                            {Object.entries(card.cost)
                                .filter(([, amt]) => Number(amt) > 0)
                                .map(([color, amt]) => (
                                    <div
                                        key={color}
                                        className={`
                    relative flex items-center justify-center rounded-full shrink-0
                    bg-gradient-to-br ${GEM_TYPES[color.toUpperCase() as keyof typeof GEM_TYPES].color} 
                    shadow-[0_1px_2px_rgba(0,0,0,0.5)] border border-white/10
                `}
                                        style={{
                                            width: `${costContainerSizePx}px`,
                                            height: `${costContainerSizePx}px`,
                                        }}
                                    >
                                        <span
                                            className="font-black text-white z-10 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] leading-none"
                                            style={{ fontSize: `${costTextSizePx}px` }}
                                        >
                                            {amt}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* 4. Bottom Right: Crowns */}
                <div
                    className="absolute pointer-events-none flex flex-col items-center z-10"
                    style={{
                        bottom: `${bottomInsetPx}px`,
                        right: `${sideInsetPx}px`,
                        gap: `${stackedGapPx}px`,
                    }}
                >
                    {Number(card.crowns) > 0 &&
                        Array.from({ length: Number(card.crowns) }).map((_, i) => (
                            <Crown
                                key={i}
                                size={crownIconSizePx}
                                className="text-yellow-400 drop-shadow-md"
                                fill="currentColor"
                            />
                        ))}
                </div>

                {/* 5. Royal Badge */}
                {isRoyal && (
                    <>
                        <div className="absolute inset-0 bg-yellow-500/10 animate-pulse pointer-events-none z-0" />
                        <div
                            className="absolute pointer-events-none z-10"
                            style={{
                                bottom: `${scaleCardMetric(8, cardScale)}px`,
                                left: `${scaleCardMetric(8, cardScale)}px`,
                            }}
                        >
                            <Crown size={royalBadgeSizePx} className="text-white/20 -rotate-12" />
                        </div>
                    </>
                )}

                {/* 6. Reserve Button */}
                {!isReservedView && !isRoyal && onReserve && (
                    <div
                        className="absolute inset-x-0 flex items-start justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        style={{ top: `${scaleCardMetric(8, cardScale)}px` }}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onReserve(card, context);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-400 rounded-full text-white shadow-lg transition-transform hover:scale-110 active:scale-90"
                            title="Reserve"
                            style={{ padding: `${reserveButtonPaddingPx}px` }}
                        >
                            <Download size={reserveButtonIconSizePx} />
                        </button>
                    </div>
                )}
            </div>
        );
    }
);
