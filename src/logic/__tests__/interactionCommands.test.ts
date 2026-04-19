import { describe, expect, it } from 'vitest';
import { BUFFS } from '../../constants';
import {
    buildBuyAction,
    buildReserveCardFlow,
    buildReserveDeckFlow,
    buildSelectBonusColorAction,
    buildSelectBuffAction,
} from '../interactionCommands';

describe('Interaction Commands', () => {
    const card = {
        id: 'market-card',
        level: 1 as const,
        cost: { blue: 0, white: 0, green: 0, black: 0, red: 0, pearl: 0, gold: 0 },
        points: 1,
        bonusColor: 'blue' as const,
    };

    it('builds reserve flows without React state branching', () => {
        const withGold = buildReserveCardFlow(card, 1, 0, true);
        const withoutGold = buildReserveDeckFlow(2, false);

        expect(withGold.action.type).toBe('INITIATE_RESERVE');
        expect(withGold.prompt).toBe('Select a Gold gem.');
        expect(withoutGold.action.type).toBe('RESERVE_DECK');
        expect(withoutGold.prompt).toBeUndefined();
    });

    it('routes gold-card purchases through the joker flow and normal cards through BUY_CARD', () => {
        const jokerAction = buildBuyAction(
            { ...card, bonusColor: 'gold' },
            'market',
            { level: 1, idx: 0 },
            'red'
        );
        const buyAction = buildBuyAction(card, 'reserved', undefined, 'green');

        expect(jokerAction.type).toBe('INITIATE_BUY_JOKER');
        expect(buyAction.type).toBe('BUY_CARD');
        if (buyAction.type === 'BUY_CARD') {
            expect(buyAction.payload.randoms?.bountyHunterColor).toBe('green');
        }
    });

    it('adds draft-pool indices only for the first draft pick and builds bonus-color selections deterministically', () => {
        const selectBuffAction = buildSelectBuffAction(
            BUFFS.PRIVILEGE_FAVOR.id,
            'red',
            'p1',
            'DRAFT_PHASE',
            1
        );
        const selectBuffOutsideDraft = buildSelectBuffAction(
            BUFFS.PRIVILEGE_FAVOR.id,
            'blue',
            'p2',
            'IDLE',
            1
        );
        const bonusColorAction = buildSelectBonusColorAction(
            {
                card: { ...card, bonusColor: 'gold' },
                source: 'market',
                marketInfo: { level: 1, idx: 2 },
            },
            'green',
            'black'
        );

        expect(selectBuffAction.payload).toMatchObject({
            buffId: BUFFS.PRIVILEGE_FAVOR.id,
            randomColor: 'red',
        });
        expect(selectBuffAction.payload).toHaveProperty('p2DraftPoolIndices');
        expect(selectBuffOutsideDraft.payload).not.toHaveProperty('p2DraftPoolIndices');
        expect(bonusColorAction.payload.card.bonusColor).toBe('green');
        expect(bonusColorAction.payload.randoms?.bountyHunterColor).toBe('black');
    });
});
