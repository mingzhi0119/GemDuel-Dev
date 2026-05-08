import { getGemLabel, type AppLocale } from '@gemduel/shared';
import type { GemColor } from '@gemduel/shared/types';
import type { useT } from '../../i18n/LocaleProvider';
import type { CardProps } from './CardProps';

type Translate = ReturnType<typeof useT>;
type ReadableCard = NonNullable<CardProps['card']> & {
    cost?: Partial<Record<GemColor, number>>;
    level?: number;
    points?: number;
};

interface GetCardAriaLabelOptions {
    card: NonNullable<CardProps['card']>;
    isRoyal: boolean;
    reserveOnClick: boolean;
    allowUnavailableClick: boolean;
    locale: AppLocale;
    t: Translate;
}

export const getCardAriaLabel = ({
    card,
    isRoyal,
    reserveOnClick,
    allowUnavailableClick,
    locale,
    t,
}: GetCardAriaLabelOptions) => {
    const readableCard = card as ReadableCard;
    const bonusLabel = card.bonusColor
        ? getGemLabel(card.bonusColor as GemColor, locale)
        : t('card.aria.noBonus');
    const costSummary = Object.entries(readableCard.cost ?? {})
        .filter(([, count]) => count > 0)
        .map(([color, count]) => `${count} ${getGemLabel(color as GemColor, locale)}`)
        .join(', ');
    const cardDescriptor = [
        isRoyal || typeof readableCard.level !== 'number'
            ? t('card.aria.royalCard')
            : t('card.aria.levelCard', { level: readableCard.level }),
        t('card.aria.points', { count: readableCard.points ?? 0 }),
        t('card.aria.bonus', { bonus: bonusLabel }),
        costSummary ? t('card.aria.cost', { cost: costSummary }) : t('card.aria.freeCost'),
    ].join(', ');

    if (isRoyal) {
        return t('card.aria.selectRoyal', { card: cardDescriptor });
    }
    if (reserveOnClick) {
        return t('card.aria.reserve', { card: cardDescriptor });
    }
    if (allowUnavailableClick) {
        return t('card.aria.preview', { card: cardDescriptor });
    }
    return t('card.aria.select', { card: cardDescriptor });
};
