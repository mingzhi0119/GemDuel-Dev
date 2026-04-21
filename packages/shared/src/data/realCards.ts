import type { Card } from '../types';
import { LEVEL_1_CARDS } from './realCardsLevel1';
import { LEVEL_2_CARDS } from './realCardsLevel2';
import { LEVEL_3_CARDS } from './realCardsLevel3';
import { ROGUE_ONLY_CARDS } from './realCardsRogue';

export const CLASSIC_CARDS: Card[] = [...LEVEL_1_CARDS, ...LEVEL_2_CARDS, ...LEVEL_3_CARDS];
export const ROGUE_CARDS: Card[] = [
    ...LEVEL_1_CARDS,
    ...LEVEL_2_CARDS,
    ...ROGUE_ONLY_CARDS.filter((card) => card.level === 2),
    ...LEVEL_3_CARDS,
    ...ROGUE_ONLY_CARDS.filter((card) => card.level === 3),
];
export const REAL_CARDS = CLASSIC_CARDS;
