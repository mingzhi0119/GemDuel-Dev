import type { CardAbility, GemColor, PlayerKey } from '../types';
import type { AppReasonCode } from '../types/reason';
import { enLabelMessages, zhLabelMessages } from './catalogs/labels';
import { enLooseMessages, zhLooseMessages } from './catalogs/loose';
import { REASON_UI_KEYS, enReasonMessages, zhReasonMessages } from './catalogs/reasons';
import { enUiMessages, zhUiMessages } from './catalogs/ui';

export type AppLocale = 'en' | 'zh';
export const DEFAULT_APP_LOCALE: AppLocale = 'en';
export const SUPPORTED_APP_LOCALES = ['en', 'zh'] as const;

const enMessages = {
    ...enUiMessages,
    ...enLabelMessages,
    ...enReasonMessages,
    ...enLooseMessages,
} as const;

type EnglishCatalog = typeof enMessages;
type MessageShape = { [K in keyof EnglishCatalog]: string };

const zhMessages: MessageShape = {
    ...zhUiMessages,
    ...zhLabelMessages,
    ...zhReasonMessages,
    ...zhLooseMessages,
};

const MESSAGE_CATALOG = {
    en: enMessages,
    zh: zhMessages,
} as const;

export type TranslationKey = keyof EnglishCatalog;

type ExtractPlaceholders<Message extends string> =
    Message extends `${string}{{${infer Placeholder}}}${infer Rest}`
        ? Placeholder | ExtractPlaceholders<Rest>
        : never;

type TranslationValue = string | number;
export type TranslationParams<K extends TranslationKey> = [
    ExtractPlaceholders<EnglishCatalog[K]>,
] extends [never]
    ? never
    : Record<ExtractPlaceholders<EnglishCatalog[K]>, TranslationValue>;

type TranslationArgs<K extends TranslationKey> =
    TranslationParams<K> extends never ? [] : [params: TranslationParams<K>];

type TranslationKeyWithoutParams = {
    [K in TranslationKey]: TranslationParams<K> extends never ? K : never;
}[TranslationKey];

const interpolateMessage = (template: string, params?: Record<string, TranslationValue>) =>
    template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
        params && key in params ? String(params[key]) : `{{${key}}}`
    );

export function translate<K extends TranslationKey>(
    locale: AppLocale,
    key: K,
    ...args: TranslationArgs<K>
): string {
    const params = (args[0] as Record<string, TranslationValue> | undefined) ?? undefined;
    const template = MESSAGE_CATALOG[locale][key] ?? MESSAGE_CATALOG.en[key];
    return interpolateMessage(template, params);
}

export const isSupportedAppLocale = (value: string | null | undefined): value is AppLocale =>
    value === 'en' || value === 'zh';

export const resolveSystemAppLocale = (language: string | null | undefined): AppLocale =>
    typeof language === 'string' && language.toLowerCase().startsWith('zh') ? 'zh' : 'en';

export const getDocumentLanguage = (locale: AppLocale) => (locale === 'zh' ? 'zh-CN' : 'en');

export const getReasonUiMessage = (code: AppReasonCode, locale: AppLocale) =>
    translate(locale, REASON_UI_KEYS[code]);

const GEM_LABEL_KEYS = {
    blue: 'gem.blue',
    white: 'gem.white',
    green: 'gem.green',
    black: 'gem.black',
    red: 'gem.red',
    pearl: 'gem.pearl',
    gold: 'gem.gold',
    empty: 'gem.empty',
    null: 'gem.neutral',
    neutral: 'gem.neutral',
} as const satisfies Record<string, TranslationKey>;

export const getGemLabel = (gem: GemColor | 'empty' | 'null' | 'neutral', locale: AppLocale) =>
    translate(locale, GEM_LABEL_KEYS[gem]);

const ABILITY_LABEL_KEYS = {
    again: 'ability.again',
    steal: 'ability.steal',
    scroll: 'ability.scroll',
    bonus_gem: 'ability.bonus_gem',
    none: 'ability.none',
} as const satisfies Record<CardAbility, TranslationKey>;

export const getAbilityLabel = (ability: CardAbility, locale: AppLocale) =>
    translate(locale, ABILITY_LABEL_KEYS[ability]);

const ROYAL_LABEL_KEYS = {
    'r91-ro': 'royal.r91-ro',
    'r92-ro': 'royal.r92-ro',
    'r93-ro': 'royal.r93-ro',
    'r94-ro': 'royal.r94-ro',
} as const satisfies Record<string, TranslationKey>;

export const getRoyalLabel = (royalId: string, locale: AppLocale) => {
    const key = ROYAL_LABEL_KEYS[royalId as keyof typeof ROYAL_LABEL_KEYS];
    return key ? translate(locale, key) : royalId;
};

const PLAYER_NAME_KEYS = {
    p1: 'player.name.p1',
    p2: 'player.name.p2',
} as const satisfies Record<PlayerKey, TranslationKey>;

export const getPlayerDisplayName = (player: PlayerKey, locale: AppLocale) =>
    translate(locale, PLAYER_NAME_KEYS[player]);

const BUFF_CATEGORY_KEYS = {
    economy: 'buff.category.economy',
    discount: 'buff.category.discount',
    control: 'buff.category.control',
    intel: 'buff.category.intel',
    victory: 'buff.category.victory',
} as const satisfies Record<string, TranslationKey>;

export const getBuffCategoryLabel = (category: string | undefined, locale: AppLocale) => {
    if (!category) {
        return '';
    }

    const key = BUFF_CATEGORY_KEYS[category as keyof typeof BUFF_CATEGORY_KEYS];
    return key ? translate(locale, key) : category;
};

const FEEDBACK_LABEL_KEYS = {
    extortion: 'feedback.extortion',
    privilege: 'feedback.privilege',
} as const satisfies Record<string, TranslationKey>;

export const getFeedbackLabel = (label: string, locale: AppLocale) => {
    const normalized = label.trim().toLowerCase();
    if (normalized in GEM_LABEL_KEYS) {
        return getGemLabel(normalized as GemColor | 'empty' | 'null' | 'neutral', locale);
    }

    const key = FEEDBACK_LABEL_KEYS[normalized as keyof typeof FEEDBACK_LABEL_KEYS];
    return key ? translate(locale, key) : label;
};

const localizeColorName = (value: string, locale: AppLocale) => {
    const normalized = value.trim().toLowerCase();
    if (normalized in GEM_LABEL_KEYS) {
        return getGemLabel(normalized as GemColor | 'empty' | 'null' | 'neutral', locale);
    }

    return value;
};

export const localizeLooseUiMessage = (message: string | null | undefined, locale: AppLocale) => {
    if (!message) {
        return message ?? null;
    }

    const fixedMap: Partial<Record<string, TranslationKeyWithoutParams>> = {
        'Select a Gold gem.': 'message.selectGold',
        'Must select a Gold gem!': 'message.mustSelectGold',
        'Cannot use Privilege on Gold.': 'message.cannotPrivilegeGold',
        'Cannot take Gold directly!': 'message.cannotTakeGoldDirectly',
        'Cannot steal Gold!': 'message.cannotStealGold',
        'Opponent does not have this gem.': 'message.opponentMissingGem',
        'Game not initialized.': 'message.gameNotInitialized',
        'Game Over': 'message.gameOver',
        'Empty cell': 'message.emptyCell',
        'Max 3 gems.': 'message.maxThreeGems',
        'Invalid selection': 'message.invalidSelection',
        'Not in Steal Mode': 'message.notInStealMode',
        'Cannot take 3 gems!': 'message.cannotTakeThreeGems',
        'Invalid!': 'message.invalidShort',
        'Gap detected!': 'message.gapDetected',
        'No gems.': 'message.noGems',
        'Deck empty!': 'message.deckEmpty',
        'Cannot afford!': 'message.cannotAffordShort',
        'Searching for opponent on local network...': 'message.lan.searching',
        'LAN duel is ready.': 'message.lan.ready',
        'Connecting LAN duel...': 'message.lan.connecting',
        'Opponent matched. Randomized seats are ready.': 'message.lan.matched',
        'Mode selected. Ready to start.': 'message.lan.modeReady',
        'Preparing host transport...': 'message.lan.preparingHost',
        'Waiting for transport host to begin...': 'message.lan.waitingForHost',
        'Opponent left. Searching again...': 'message.lan.opponentLeft',
        'Opponent disconnected. Searching again...': 'message.lan.opponentDisconnectedRetry',
        'Opponent disconnected.': 'message.lan.opponentDisconnected',
        'LAN discovery failed to start.': 'message.lan.discoveryFailed',
        'LAN transport is unavailable.': 'message.lan.transportUnavailable',
        'Only P1 can choose the match mode.': 'message.lan.onlyP1Choose',
        'Only P1 can start the LAN duel.': 'message.lan.onlyP1Start',
        'Choose Classic or Roguelike before starting.': 'message.lan.chooseModeFirst',
        'Replay import only accepts JSON files.': 'reason.REPLAY_FILE_UNSUPPORTED_TYPE',
        'The replay file could not be read safely.': 'reason.REPLAY_FILE_READ_FAILED',
        'The replay file could not be parsed as JSON.': 'reason.REPLAY_FILE_INVALID_JSON',
        'The replay file did not match the governed replay contract.':
            'reason.REPLAY_FILE_INVALID_SCHEMA',
        'The replay file exceeded the governed size limit.': 'reason.REPLAY_FILE_TOO_LARGE',
        'This replay was recorded with an unsupported legacy format.':
            'reason.UNSUPPORTED_REPLAY_VERSION',
    };

    const fixedKey = fixedMap[message];
    if (fixedKey) {
        return translate(locale, fixedKey);
    }

    const selectColorMatch = message.match(/^Must select a (.+) gem!$/);
    if (selectColorMatch) {
        return translate(locale, 'message.mustSelectColorGem', {
            color: localizeColorName(selectColorMatch[1], locale),
        });
    }

    const extortionMatch = message.match(/^Extortion! Stole 1 (.+)!$/);
    if (extortionMatch) {
        return translate(locale, 'message.extortionStole', {
            color: localizeColorName(extortionMatch[1], locale),
        });
    }

    const hoarderMatch = message.match(/^Hoarder: \+1 Gem for (Player 1|Player 2)!$/);
    if (hoarderMatch) {
        const player = hoarderMatch[1] === 'Player 1' ? 'p1' : 'p2';
        return translate(locale, 'message.hoarderGem', {
            player: getPlayerDisplayName(player, locale),
        });
    }

    const desperateMatch = message.match(
        /^Desperate Gamble: Gained Special Privilege for Turn (\d+)!$/
    );
    if (desperateMatch) {
        return translate(locale, 'message.desperateGamble', {
            turn: desperateMatch[1],
        });
    }

    const speculatorMatch = message.match(/^Speculator: Recycled (\d+) gems!$/);
    if (speculatorMatch) {
        return translate(locale, 'message.speculatorRecycled', {
            count: speculatorMatch[1],
        });
    }

    const refundMatch = message.match(/^Recycled 1 ([A-Z]+)!$/);
    if (refundMatch) {
        return translate(locale, 'message.recycledOneColor', {
            color: localizeColorName(refundMatch[1], locale),
        });
    }

    const replayLimitMatch = message.match(/^Replay file exceeded the (\d+)-byte safety limit\.$/);
    if (replayLimitMatch) {
        return translate(locale, 'message.replayTooLarge', {
            bytes: replayLimitMatch[1],
        });
    }

    return message;
};
