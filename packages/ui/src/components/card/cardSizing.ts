export type CardSize = 'default' | 'small' | 'featured' | 'large';

export const BASE_CARD_SIZE = Object.freeze({
    width: 96,
    height: 128,
});

export const STANDARD_CARD_SIZE = Object.freeze({
    width: 120,
    height: 160,
});

export const FEATURED_CARD_SIZE = Object.freeze({
    width: 150,
    height: 200,
});

export const FEATURED_CARD_SAMPLE_SIZE = Object.freeze({
    width: 1086,
    height: 1448,
});

export const LARGE_CARD_SIZE = Object.freeze({
    width: 180,
    height: 240,
});

export const SMALL_CARD_SCALE = 0.75;

export const SMALL_CARD_SIZE = Object.freeze({
    width: Math.round(STANDARD_CARD_SIZE.width * SMALL_CARD_SCALE),
    height: Math.round(STANDARD_CARD_SIZE.height * SMALL_CARD_SCALE),
});

export const getCardDimensions = (size: CardSize) => {
    if (size === 'small') {
        return SMALL_CARD_SIZE;
    }

    if (size === 'featured') {
        return FEATURED_CARD_SIZE;
    }

    if (size === 'large') {
        return LARGE_CARD_SIZE;
    }

    return STANDARD_CARD_SIZE;
};

export const getCardSampleDimensions = (size: CardSize) =>
    size === 'featured' ? FEATURED_CARD_SAMPLE_SIZE : getCardDimensions(size);

export const scaleCardMetric = (value: number, cardScale: number) =>
    Math.max(1, Math.round(value * cardScale));
