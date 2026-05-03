import React from 'react';
import { Crown } from 'lucide-react';
import { GEM_TYPES } from '@gemduel/shared/constants';
import { GemIcon } from './GemIcon';
import { GemColor } from '@gemduel/shared/types';
import { CardAbilityBadges } from './card/CardAbilityBadges';
import { CardEmptyPlaceholder } from './card/CardEmptyPlaceholder';
import { CardFacePattern } from './card/CardFacePattern';
import type { CardProps } from './card/CardProps';
import { CardReserveActionButton } from './card/CardReserveActionButton';
import { JokerBonusBadge } from './card/JokerBonusBadge';
import { getCardArtworkPath, getRuntimeCardArtworkId } from './card/cardArtwork';
import { getCardCostCountStyle } from './card/cardCostStyles';
import { getCardScoreColorClass } from './card/cardScoreColor';
import {
    BASE_CARD_SIZE,
    FEATURED_CARD_SAMPLE_SIZE,
    FEATURED_CARD_SIZE,
    getCardSampleDimensions,
    getCardDimensions,
    scaleCardMetric,
} from './card/cardSizing';
import { useT } from '../i18n/LocaleProvider';

export {
    FEATURED_CARD_SAMPLE_SIZE,
    FEATURED_CARD_SIZE,
    LARGE_CARD_SIZE,
    SMALL_CARD_SIZE,
    STANDARD_CARD_SIZE,
} from './card/cardSizing';

export const Card: React.FC<CardProps> = React.memo(
    ({
        card,
        canBuy,
        onClick,
        onReserve,
        context,
        isReservedView = false,
        isRoyal = false,
        reserveOnClick = false,
        allowUnavailableClick = false,
        className = '',
        size = 'default',
        theme = 'dark',
        cardBackArtwork,
    }) => {
        const t = useT();
        const dimensions = getCardDimensions(size);
        const sampleDimensions = getCardSampleDimensions(size);
        const cardScale = sampleDimensions.width / BASE_CARD_SIZE.width;
        const displayCardScale = dimensions.width / BASE_CARD_SIZE.width;
        const sampleToDisplayScale = dimensions.width / sampleDimensions.width;
        const cornerRadiusPx = scaleCardMetric(8, displayCardScale);
        const sampleCornerRadiusPx = scaleCardMetric(8, cardScale);
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
        const costRowGapPx = scaleCardMetric(3, cardScale);
        const crownIconSizePx = scaleCardMetric(12, cardScale);
        const royalBadgeSizePx = scaleCardMetric(24, cardScale);
        const reserveButtonIconSizePx = scaleCardMetric(16, cardScale);
        const reserveButtonPaddingPx = scaleCardMetric(6, cardScale);
        const usesSampleCanvas = sampleDimensions.width !== dimensions.width;

        if (!card) {
            return (
                <CardEmptyPlaceholder
                    dimensions={dimensions}
                    cornerRadiusPx={cornerRadiusPx}
                    label={t('card.empty')}
                />
            );
        }

        const bgGradient = isRoyal
            ? 'from-yellow-600 to-amber-800 ring-2 ring-yellow-400/50'
            : card.level === 1
              ? 'from-slate-700 to-slate-800'
              : card.level === 2
                ? 'from-yellow-900/40 to-slate-800'
                : 'from-blue-900/40 to-slate-800';
        const runtimeArtworkPath = getCardArtworkPath(card.id);
        const artworkPath = cardBackArtwork?.path ?? runtimeArtworkPath;
        const hasRuntimeArtwork = Boolean(artworkPath);
        const artworkCardId = cardBackArtwork
            ? cardBackArtwork.variant
            : hasRuntimeArtwork
              ? getRuntimeCardArtworkId(card.id)
              : card.id;

        const handleCardClick = () => {
            if (reserveOnClick && onReserve) {
                onReserve(card, context);
                return;
            }

            if ((canBuy || isRoyal || allowUnavailableClick) && onClick) {
                onClick(card, context);
            }
        };
        const isInteractive = Boolean(
            (reserveOnClick && onReserve) ||
            ((canBuy || isRoyal || allowUnavailableClick) && onClick)
        );
        const handleCardKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
            if (!isInteractive || (event.key !== 'Enter' && event.key !== ' ')) {
                return;
            }

            event.preventDefault();
            handleCardClick();
        };
        const rootAriaLabel = isRoyal
            ? `Select royal card ${card.id}`
            : reserveOnClick
              ? `Reserve card ${card.id}`
              : allowUnavailableClick
                ? `Preview card ${card.id}`
                : `Select card ${card.id}`;

        const affordableClassName =
            canBuy && !isRoyal
                ? theme === 'dark'
                    ? 'border-emerald-300 ring-2 ring-emerald-400/30 shadow-[0_0_0_1px_rgba(110,231,183,0.20),0_0_20px_rgba(16,185,129,0.22)]'
                    : 'border-emerald-700 ring-2 ring-emerald-500/45 ring-offset-2 ring-offset-white shadow-[0_0_0_1px_rgba(5,150,105,0.16),0_12px_28px_rgba(5,150,105,0.18),0_0_0_6px_rgba(236,253,245,0.92)]'
                : '';
        const runtimeArtworkAffordableClassName =
            canBuy && !isRoyal ? 'outline outline-2 outline-emerald-500 outline-offset-2' : '';
        const runtimeArtworkShellClassName = `relative overflow-hidden group ${className} ${
            canBuy || isRoyal || reserveOnClick || allowUnavailableClick
                ? 'cursor-pointer'
                : 'cursor-default'
        } ${runtimeArtworkAffordableClassName}`;
        const fallbackShellClassName = `relative rounded-lg border transition-colors duration-200 bg-gradient-to-b ${bgGradient} overflow-hidden group ${className}
        ${
            canBuy && !isRoyal
                ? `${affordableClassName} cursor-pointer`
                : isRoyal
                  ? theme === 'dark'
                      ? 'border-yellow-700/50'
                      : 'border-yellow-600/60 shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
                  : (theme === 'dark'
                        ? 'border-slate-600'
                        : 'border-slate-300 shadow-[0_4px_12px_rgba(0,0,0,0.05)]') +
                    ` opacity-90 ${
                        reserveOnClick || allowUnavailableClick
                            ? 'cursor-pointer'
                            : 'cursor-default'
                    }`
        }
    `;

        return (
            <div
                onClick={handleCardClick}
                onKeyDown={handleCardKeyDown}
                role={isInteractive ? 'button' : undefined}
                tabIndex={isInteractive ? 0 : undefined}
                aria-label={isInteractive ? rootAriaLabel : undefined}
                data-card-affordable={canBuy && !isRoyal ? 'true' : 'false'}
                data-card-reserve-on-click={reserveOnClick ? 'true' : 'false'}
                data-card-preview-click={allowUnavailableClick ? 'true' : 'false'}
                data-card-back-preview={cardBackArtwork?.variant}
                className={
                    hasRuntimeArtwork ? runtimeArtworkShellClassName : fallbackShellClassName
                }
                style={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    borderRadius: `${cornerRadiusPx}px`,
                }}
            >
                <div
                    data-card-sample-canvas={usesSampleCanvas ? size : undefined}
                    data-card-sample-width={usesSampleCanvas ? sampleDimensions.width : undefined}
                    data-card-sample-height={usesSampleCanvas ? sampleDimensions.height : undefined}
                    className="absolute left-0 top-0 overflow-hidden"
                    style={{
                        width: `${sampleDimensions.width}px`,
                        height: `${sampleDimensions.height}px`,
                        borderRadius: `${sampleCornerRadiusPx}px`,
                        transform: `scale(${sampleToDisplayScale})`,
                        transformOrigin: 'top left',
                    }}
                >
                    <CardFacePattern
                        cardId={artworkCardId}
                        bonusColor={card.bonusColor}
                        artworkPath={artworkPath}
                    />
                    {!hasRuntimeArtwork && (
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
                                    className={`font-bold leading-none drop-shadow-md ${getCardScoreColorClass(card.bonusColor, theme)}`}
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
                    )}

                    {!hasRuntimeArtwork && (
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
                                }).map((_, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: `${bonusGemSizePx}px`,
                                            height: `${bonusGemSizePx}px`,
                                        }}
                                        title={
                                            card.bonusColor === 'gold'
                                                ? t('card.wildBonus')
                                                : undefined
                                        }
                                    >
                                        {card.bonusColor === 'gold' ? (
                                            <JokerBonusBadge theme={theme} className="shadow-md" />
                                        ) : (
                                            <GemIcon
                                                type={
                                                    GEM_TYPES[
                                                        card.bonusColor!.toUpperCase() as keyof typeof GEM_TYPES
                                                    ]
                                                }
                                                size="w-full h-full"
                                                theme={theme}
                                                variant="card-bonus"
                                                className="shadow-md"
                                            />
                                        )}
                                    </div>
                                ))}
                        </div>
                    )}

                    {!hasRuntimeArtwork && card.cost && (
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
                                            data-card-cost-row={color}
                                            data-card-cost-gem={color}
                                            className="flex items-center shrink-0"
                                            style={{ gap: `${costRowGapPx}px` }}
                                        >
                                            <div
                                                className="relative shrink-0"
                                                style={{
                                                    width: `${costContainerSizePx}px`,
                                                    height: `${costContainerSizePx}px`,
                                                }}
                                            >
                                                <GemIcon
                                                    type={
                                                        GEM_TYPES[
                                                            color.toUpperCase() as keyof typeof GEM_TYPES
                                                        ]
                                                    }
                                                    size="w-full h-full"
                                                    theme={theme}
                                                    variant="card-cost"
                                                />
                                            </div>
                                            <span
                                                data-card-cost-count={color}
                                                className="font-black leading-none whitespace-nowrap"
                                                style={{
                                                    fontSize: `${costTextSizePx}px`,
                                                    ...getCardCostCountStyle(
                                                        color as GemColor,
                                                        theme
                                                    ),
                                                }}
                                            >
                                                {amt}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {!hasRuntimeArtwork && (
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
                    )}

                    {isRoyal && !hasRuntimeArtwork && (
                        <>
                            <div className="absolute inset-0 bg-yellow-500/10 animate-pulse pointer-events-none z-0" />
                            <div
                                className="absolute pointer-events-none z-10"
                                style={{
                                    bottom: `${scaleCardMetric(8, cardScale)}px`,
                                    left: `${scaleCardMetric(8, cardScale)}px`,
                                }}
                            >
                                <Crown
                                    size={royalBadgeSizePx}
                                    className="text-white/20 -rotate-12"
                                />
                            </div>
                        </>
                    )}

                    {!isReservedView && !isRoyal && onReserve && (
                        <div
                            className="absolute inset-x-0 flex items-start justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                            style={{ top: `${scaleCardMetric(28, cardScale)}px` }}
                        >
                            <CardReserveActionButton
                                card={card}
                                context={context}
                                iconSizePx={reserveButtonIconSizePx}
                                label={t('card.reserve')}
                                onReserve={onReserve}
                                paddingPx={reserveButtonPaddingPx}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
);
