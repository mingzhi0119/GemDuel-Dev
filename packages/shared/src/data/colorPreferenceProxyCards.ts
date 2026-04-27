import type { BasicGemColor, Card } from '../types';
import { LEVEL_1_CARDS } from './realCardsLevel1';

export const COLOR_PREFERENCE_LEGACY_DUMMY_PREFIX = 'buff-color-pref-';

export const COLOR_PREFERENCE_PROXY_CARD_IDS: Record<BasicGemColor, string> = {
    red: '111-re',
    green: '121-gr',
    blue: '131-bl',
    white: '141-wh',
    black: '151-bk',
};

const COLOR_PREFERENCE_PROXY_CARD_ID_SET = new Set<string>(
    Object.values(COLOR_PREFERENCE_PROXY_CARD_IDS)
);

export const isColorPreferenceProxyCardId = (id?: string | null): boolean =>
    Boolean(id && COLOR_PREFERENCE_PROXY_CARD_ID_SET.has(id));

export const isColorPreferenceBonusCardId = (id?: string | null): boolean =>
    Boolean(
        id &&
        (id.startsWith(COLOR_PREFERENCE_LEGACY_DUMMY_PREFIX) || isColorPreferenceProxyCardId(id))
    );

export const getColorPreferenceProxyCard = (discountColor: BasicGemColor): Card => {
    const proxyCardId = COLOR_PREFERENCE_PROXY_CARD_IDS[discountColor];
    const proxyCard = LEVEL_1_CARDS.find((card) => card.id === proxyCardId);

    if (!proxyCard) {
        throw new Error(`Missing Color Preference proxy card for ${discountColor}.`);
    }

    return { ...proxyCard };
};
