import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ROYAL_CARDS } from '@gemduel/shared/constants';
import { CLASSIC_CARDS, ROGUE_CARDS } from '@gemduel/shared/data/realCards';
import { CARD_ARTWORK_SOURCE_SIZE } from '@gemduel/ui/components/card/cardArtwork';

const CARD_ASSET_DIR = path.resolve('public/assets/cards');
const STANDARD_CARD_ID_PATTERN = /^[123][1-8][1-9a-z]-(?:re|gr|bl|wh|bk|pe|jo|po)$/;
const ROYAL_CARD_ID_PATTERN = /^r9[1-9a-z]-ro$/;
const BONUS_COLOR_ID_PARTS = Object.freeze({
    black: { code: '5', suffix: 'bk' },
    blue: { code: '3', suffix: 'bl' },
    gold: { code: '7', suffix: 'jo' },
    green: { code: '2', suffix: 'gr' },
    null: { code: '8', suffix: 'po' },
    pearl: { code: '6', suffix: 'pe' },
    red: { code: '1', suffix: 're' },
    white: { code: '4', suffix: 'wh' },
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

        expect(expectedIds).toHaveLength(83);
        expect(actualIds).toEqual(expectedIds);

        for (const cardId of expectedIds) {
            expect(readPngDimensions(path.join(CARD_ASSET_DIR, `${cardId}.png`))).toEqual(
                CARD_ARTWORK_SOURCE_SIZE
            );
        }
    });

    it('keeps runtime card ids aligned with the canonical XYZ-cc format', () => {
        for (const card of [...CLASSIC_CARDS, ...ROGUE_CARDS]) {
            const colorKey = String(card.bonusColor ?? 'null') as keyof typeof BONUS_COLOR_ID_PARTS;
            const expected = BONUS_COLOR_ID_PARTS[colorKey];

            expect(card.id).toMatch(STANDARD_CARD_ID_PATTERN);
            expect(card.id).toMatch(
                new RegExp(`^${card.level}${expected.code}[1-9a-z]-${expected.suffix}$`)
            );
        }

        for (const card of ROYAL_CARDS) {
            expect(card.id).toMatch(ROYAL_CARD_ID_PATTERN);
        }
    });
});
