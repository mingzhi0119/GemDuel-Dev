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
const RUNTIME_CARD_ID_SUFFIX_PATTERN = /-\d{13}-[a-z0-9]+$/i;

export const getRuntimeCardArtworkId = (cardId: string): string => {
    const replayInstanceMatch = REPLAY_INSTANCE_CARD_ID_PATTERN.exec(cardId);
    const candidateId = replayInstanceMatch ? replayInstanceMatch[1]! : cardId;
    return candidateId.replace(RUNTIME_CARD_ID_SUFFIX_PATTERN, '');
};

export const getCardArtworkPath = (cardId: string): string | null => {
    const artworkId = getRuntimeCardArtworkId(cardId);
    return RUNTIME_CARD_IDS.has(artworkId) ? `/assets/cards/${artworkId}.png` : null;
};

export const hasCardArtwork = (cardId: string): boolean =>
    RUNTIME_CARD_IDS.has(getRuntimeCardArtworkId(cardId));
