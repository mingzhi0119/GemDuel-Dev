import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ROYAL_CARDS } from '@gemduel/shared/constants';
import { CLASSIC_CARDS, ROGUE_CARDS } from '@gemduel/shared/data/realCards';
import { CARD_ARTWORK_SOURCE_SIZE } from '@gemduel/ui/components/card/cardArtwork';

const CARD_ASSET_DIR = path.resolve('public/assets/cards');
const BONUS_COLOR_ID_PREFIXES = Object.freeze({
    black: 'bk',
    blue: 'bl',
    gold: 'jo',
    green: 'gr',
    null: 'po',
    red: 're',
    white: 'wh',
});

const getUniqueCardIds = () =>
    [...new Set([...CLASSIC_CARDS, ...ROGUE_CARDS, ...ROYAL_CARDS].map((card) => card.id))].sort();

const readPngDimensions = (filePath: string) => {
    const bytes = fs.readFileSync(filePath);

    return {
        width: bytes.readUInt32BE(16),
        height: bytes.readUInt32BE(20),
    };
};

describe('card artwork assets', () => {
    it('covers every runtime card id with a 3:4 PNG', () => {
        const expectedIds = getUniqueCardIds();
        const actualIds = fs
            .readdirSync(CARD_ASSET_DIR)
            .filter((fileName) => fileName.endsWith('.png'))
            .map((fileName) => path.basename(fileName, '.png'))
            .sort();

        expect(expectedIds).toHaveLength(78);
        expect(actualIds).toEqual(expectedIds);

        for (const cardId of expectedIds) {
            expect(readPngDimensions(path.join(CARD_ASSET_DIR, `${cardId}.png`))).toEqual(
                CARD_ARTWORK_SOURCE_SIZE
            );
        }
    });

    it('keeps black and level-3 card ids aligned with bonus-color filename prefixes', () => {
        for (const card of [...CLASSIC_CARDS, ...ROGUE_CARDS]) {
            if (card.bonusColor !== 'black' && card.level !== 3) {
                continue;
            }

            const expectedPrefix =
                BONUS_COLOR_ID_PREFIXES[card.bonusColor as keyof typeof BONUS_COLOR_ID_PREFIXES];

            expect(card.id).toMatch(new RegExp(`^l${card.level}-${expectedPrefix}-\\d+$`));
        }
    });
});
