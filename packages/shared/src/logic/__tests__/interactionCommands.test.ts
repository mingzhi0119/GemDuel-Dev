import { describe, expect, it } from 'vitest';
import { BUFFS } from '../../constants';
import {
    buildDebugAction,
    buildGameStartAction,
    buildPeekDeckAction,
    buildBuyAction,
    buildRerollDraftPoolAction,
    buildReplenishAction,
    buildReserveCardFlow,
    buildReserveDeckFlow,
    buildSelectRoyalAction,
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
        const withGold = buildReserveCardFlow(card, { level: 1, idx: 0 }, true);
        const withoutGold = buildReserveDeckFlow(2, false);

        expect(withGold.action.type).toBe('INITIATE_RESERVE');
        expect(withGold.prompt).toBe('Select a Gold gem.');
        expect(withoutGold.action.type).toBe('RESERVE_DECK');
        expect(withoutGold.prompt).toBeUndefined();
    });

    it('preserves extra-card market references when building reserve flows', () => {
        const reserveExtra = buildReserveCardFlow(
            card,
            { level: 1, idx: 0, isExtra: true, extraIdx: 0 },
            false
        );

        expect(reserveExtra).toEqual({
            action: {
                type: 'RESERVE_CARD',
                payload: {
                    card,
                    level: 1,
                    idx: 0,
                    isExtra: true,
                    extraIdx: 0,
                },
            },
        });
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

    it('builds top-level interaction commands without relying on UI state', () => {
        expect(buildGameStartAction('PVE', { useBuffs: false, isHost: true })).toMatchObject({
            type: 'INIT',
        });
        expect(buildReplenishAction('red', 'blue')).toEqual({
            type: 'REPLENISH',
            payload: {
                randoms: {
                    expansionColor: 'red',
                    extortionColor: 'blue',
                },
            },
        });
        expect(
            buildSelectRoyalAction({
                id: 'royal-1',
                points: 3,
                bonusColor: 'red',
                label: 'Royal One',
                ability: [],
            })
        ).toEqual({
            type: 'SELECT_ROYAL_CARD',
            payload: {
                card: {
                    id: 'royal-1',
                    points: 3,
                    bonusColor: 'red',
                    label: 'Royal One',
                    ability: [],
                },
            },
        });
        expect(buildPeekDeckAction(3)).toEqual({
            type: 'PEEK_DECK',
            payload: { level: 3 },
        });
        expect(buildPeekDeckAction('all')).toEqual({
            type: 'PEEK_DECK',
            payload: { levels: [3, 2, 1] },
        });
        expect(buildRerollDraftPoolAction(2)).toEqual({
            type: 'REROLL_DRAFT_POOL',
            payload: { level: 2 },
        });
    });

    it('builds each debug action variant with the expected payload shape', () => {
        expect(buildDebugAction('FORCE_ROYAL_SELECTION')).toEqual({
            type: 'FORCE_ROYAL_SELECTION',
        });
        expect(buildDebugAction('DEBUG_ADD_CROWNS', 'p2')).toEqual({
            type: 'DEBUG_ADD_CROWNS',
            payload: 'p2',
        });
        expect(buildDebugAction('DEBUG_ADD_POINTS')).toEqual({
            type: 'DEBUG_ADD_POINTS',
            payload: 'p1',
        });
        expect(buildDebugAction('DEBUG_ADD_PRIVILEGE', 'p1')).toEqual({
            type: 'DEBUG_ADD_PRIVILEGE',
            payload: 'p1',
        });
    });
});
