import { ROYAL_CARDS } from '@gemduel/shared/constants';
import { CLASSIC_CARDS, ROGUE_CARDS } from '@gemduel/shared/data/realCards';

export const CARD_ARTWORK_SOURCE_SIZE = Object.freeze({
    width: 1086,
    height: 1448,
});

const RUNTIME_CARD_IDS = new Set(
    [...CLASSIC_CARDS, ...ROGUE_CARDS, ...ROYAL_CARDS].map((card) => card.id)
);

const REPLAY_INSTANCE_CARD_ID_PATTERN = /^c:(.+)#\d+$/;
const LEGACY_LEVEL_CARD_ID_PATTERN = /^l([123])-[a-z]+-(\d+)$/i;
const RUNTIME_CARD_ID_SUFFIX_PATTERNS = [
    /-\d{13}-[a-z0-9]+$/i,
    /-[123]-\d{13}$/i,
    /-[123]-\d+-[a-z0-9]+$/i,
] as const;

const LEGACY_CARD_SEQUENCE_TO_RUNTIME_ID: Readonly<Record<string, string>> = Object.freeze({
    '1:0': '151-bk',
    '1:1': '152-bk',
    '1:2': '153-bk',
    '1:3': '154-bk',
    '1:4': '155-bk',
    '1:5': '111-re',
    '1:6': '112-re',
    '1:7': '113-re',
    '1:8': '114-re',
    '1:9': '115-re',
    '1:10': '121-gr',
    '1:11': '122-gr',
    '1:12': '123-gr',
    '1:13': '124-gr',
    '1:14': '125-gr',
    '1:15': '131-bl',
    '1:16': '132-bl',
    '1:17': '133-bl',
    '1:18': '134-bl',
    '1:19': '135-bl',
    '1:20': '141-wh',
    '1:21': '142-wh',
    '1:22': '143-wh',
    '1:23': '144-wh',
    '1:24': '145-wh',
    '1:25': '181-po',
    '1:26': '171-jo',
    '1:27': '172-jo',
    '1:28': '173-jo',
    '1:29': '174-jo',
    '2:32': '251-bk',
    '2:33': '252-bk',
    '2:34': '253-bk',
    '2:35': '254-bk',
    '2:36': '211-re',
    '2:37': '212-re',
    '2:38': '213-re',
    '2:39': '214-re',
    '2:40': '221-gr',
    '2:41': '222-gr',
    '2:42': '223-gr',
    '2:43': '224-gr',
    '2:44': '231-bl',
    '2:45': '232-bl',
    '2:46': '233-bl',
    '2:47': '234-bl',
    '2:48': '241-wh',
    '2:49': '242-wh',
    '2:50': '243-wh',
    '2:51': '244-wh',
    '2:53': '281-po',
    '2:54': '271-jo',
    '2:55': '272-jo',
    '2:56': '273-jo',
    '2:71': '215-re',
    '2:72': '225-gr',
    '2:73': '245-wh',
    '2:74': '235-bl',
    '2:82': '255-bk',
    '3:58': '351-bk',
    '3:59': '352-bk',
    '3:60': '311-re',
    '3:61': '312-re',
    '3:62': '321-gr',
    '3:63': '322-gr',
    '3:64': '331-bl',
    '3:65': '332-bl',
    '3:66': '341-wh',
    '3:67': '342-wh',
    '3:68': '381-po',
    '3:69': '371-jo',
    '3:70': '372-jo',
    '3:75': '343-wh',
    '3:76': '373-jo',
    '3:77': '323-gr',
    '3:78': '333-bl',
    '3:79': '313-re',
    '3:80': '353-bk',
    '3:81': '374-jo',
});

const LEGACY_ROYAL_CARD_ID_MAP: Readonly<Record<string, string>> = Object.freeze({
    'royal-3pts': 'r91-ro',
    'royal-again': 'r92-ro',
    'royal-scroll': 'r93-ro',
    'royal-steal': 'r94-ro',
});

const stripGeneratedRuntimeSuffix = (cardId: string): string => {
    for (const pattern of RUNTIME_CARD_ID_SUFFIX_PATTERNS) {
        const strippedId = cardId.replace(pattern, '');
        if (strippedId !== cardId) {
            return strippedId;
        }
    }

    return cardId;
};

const migrateLegacyArtworkId = (cardId: string): string => {
    const royalArtworkId = LEGACY_ROYAL_CARD_ID_MAP[cardId];
    if (royalArtworkId) {
        return royalArtworkId;
    }

    const legacyLevelMatch = LEGACY_LEVEL_CARD_ID_PATTERN.exec(cardId);
    if (!legacyLevelMatch) {
        return cardId;
    }

    const [, level, sequence] = legacyLevelMatch;
    return LEGACY_CARD_SEQUENCE_TO_RUNTIME_ID[`${level}:${sequence}`] ?? cardId;
};

export const getRuntimeCardArtworkId = (cardId: string): string => {
    const replayInstanceMatch = REPLAY_INSTANCE_CARD_ID_PATTERN.exec(cardId);
    const candidateId = replayInstanceMatch ? replayInstanceMatch[1]! : cardId;
    return migrateLegacyArtworkId(stripGeneratedRuntimeSuffix(candidateId));
};

export const getCardArtworkPath = (cardId: string): string | null => {
    const artworkId = getRuntimeCardArtworkId(cardId);
    return RUNTIME_CARD_IDS.has(artworkId) ? `/assets/cards/${artworkId}.png` : null;
};

export const hasCardArtwork = (cardId: string): boolean =>
    RUNTIME_CARD_IDS.has(getRuntimeCardArtworkId(cardId));
