import { cn } from '../../utils';
import {
    BONUS_GEM_BADGE_BACK_ARTWORK,
    CARD_NUMBER_ARTWORK,
    POINT_RIBBON_ARTWORK,
} from '../uiIconArtwork';

type BonusBadgeArtworkColor = keyof typeof BONUS_GEM_BADGE_BACK_ARTWORK;
type PointRibbonArtworkColor = keyof typeof POINT_RIBBON_ARTWORK;
type CardNumberDigit = keyof typeof CARD_NUMBER_ARTWORK;

interface CardNumberValueProps {
    value: number;
    heightPx: number;
    color: string;
    type: 'point' | 'bonus';
    className?: string;
}

export const getBonusBadgeBackPath = (color: string) =>
    BONUS_GEM_BADGE_BACK_ARTWORK[color as BonusBadgeArtworkColor] ??
    BONUS_GEM_BADGE_BACK_ARTWORK.black;

export const getPointRibbonPath = (color: string, isSpecial: boolean) =>
    isSpecial
        ? POINT_RIBBON_ARTWORK.silver
        : (POINT_RIBBON_ARTWORK[color as PointRibbonArtworkColor] ?? POINT_RIBBON_ARTWORK.silver);

const getCardNumberDigits = (value: number): CardNumberDigit[] => {
    const normalizedValue = Math.max(0, Math.trunc(Number.isFinite(value) ? value : 0));

    return String(normalizedValue)
        .split('')
        .filter((digit): digit is CardNumberDigit => digit in CARD_NUMBER_ARTWORK);
};

export const CardNumberValue = ({
    value,
    heightPx,
    color,
    type,
    className,
}: CardNumberValueProps) => {
    const digits = getCardNumberDigits(value);

    return (
        <span
            role="img"
            aria-label={String(value)}
            data-tableau-point-summary={type === 'point' ? color : undefined}
            data-tableau-bonus-number={type === 'bonus' ? color : undefined}
            data-card-number-value={type}
            data-value={value}
            className={cn('relative z-10 flex items-center justify-center', className)}
            style={{ height: `${heightPx}px` }}
        >
            {digits.map((digit, index) => (
                <img
                    key={`${digit}-${index}`}
                    src={CARD_NUMBER_ARTWORK[digit]}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    data-card-number-digit={digit}
                    data-card-number-index={index}
                    className="-mx-[0.08em] h-full w-auto object-contain"
                />
            ))}
        </span>
    );
};
