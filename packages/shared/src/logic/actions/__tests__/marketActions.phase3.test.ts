import { afterEach, describe, expect, it, vi } from 'vitest';
import { BUFFS, GAME_PHASES, GEM_TYPES } from '../../../constants';
import { createMockState } from '../../__tests__/testHelpers';
import { handleDiscardGem } from '../boardActions';
import {
    handleBuyCard,
    handleCancelReserve,
    handleDiscardReserved,
    handleInitiateBuyJoker,
    handleInitiateReserve,
    handleInitiateReserveDeck,
    handleReserveCard,
    handleReserveDeck,
} from '../marketActions';
import { handleSelectRoyalCard } from '../royalActions';
import type { Buff, Card, GameState } from '../../../types';

const createCard = (overrides: Partial<Card> = {}): Card => ({
    id: 'phase3-card',
    level: 1,
    cost: {
        blue: 0,
        white: 0,
        green: 0,
        black: 0,
        red: 1,
        pearl: 0,
        gold: 0,
    },
    points: 1,
    bonusColor: 'red',
    crowns: 0,
    ability: 'none',
    ...overrides,
});

const createState = (overrides: Partial<GameState> = {}): GameState =>
    JSON.parse(
        JSON.stringify(
            createMockState({
                turn: 'p1',
                phase: GAME_PHASES.IDLE,
                mode: 'LOCAL_PVP',
                ...overrides,
            })
        )
    ) as GameState;

describe('marketActions phase 3 coverage', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('auto-buys joker cards on instant-win thresholds and assigns a concrete color', () => {
        const state = createState({
            extraPoints: { p1: 19, p2: 0 },
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            },
        });
        const joker = createCard({
            id: 'joker-win',
            level: 2,
            points: 2,
            bonusColor: undefined,
        });

        const nextState = handleInitiateBuyJoker(state, {
            card: joker,
            source: 'market',
            marketInfo: { level: 2, idx: 0 },
        });

        expect(nextState.pendingBuy).toBeNull();
        expect(nextState.phase).toBe(GAME_PHASES.IDLE);
        expect(nextState.turn).toBe('p1');
        expect(nextState.winner).toBe('p1');
        expect(nextState.playerTableau.p1).toHaveLength(1);
        expect(nextState.playerTableau.p1[0].bonusColor).toBe('red');
    });

    it('auto-buys joker cards when a crown threshold win is available', () => {
        const state = createState({
            extraCrowns: { p1: 9, p2: 0 },
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            },
        });
        const joker = createCard({
            id: 'joker-crown-win',
            level: 2,
            crowns: 1,
            bonusColor: undefined,
        });

        const nextState = handleInitiateBuyJoker(state, {
            card: joker,
            source: 'market',
            marketInfo: { level: 2, idx: 0 },
        });

        expect(nextState.pendingBuy).toBeNull();
        expect(nextState.winner).toBe('p1');
        expect(nextState.playerTableau.p1[0]).toEqual(expect.objectContaining({ id: joker.id }));
    });

    it('stores joker purchases as pending when the instant-win shortcut does not apply', () => {
        const state = createState();
        const joker = createCard({
            id: 'joker-pending',
            level: 2,
            bonusColor: undefined,
        });

        const nextState = handleInitiateBuyJoker(state, {
            card: joker,
            source: 'market',
            marketInfo: { level: 2, idx: 1 },
        });

        expect(nextState.pendingBuy).toEqual({
            card: joker,
            source: 'market',
            marketInfo: { level: 2, idx: 1 },
        });
        expect(nextState.phase).toBe(GAME_PHASES.SELECT_CARD_COLOR);
        expect(nextState.playerTableau.p1).toHaveLength(0);
    });

    it('rejects unaffordable purchases before mutating market or tableau state', () => {
        const state = createState({
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            },
            market: { 1: [createCard({ id: 'expensive' })], 2: [], 3: [] },
        });

        const nextState = handleBuyCard(state, {
            card: createCard({ id: 'expensive' }),
            source: 'market',
            marketInfo: { level: 1, idx: 0 },
        });

        expect(nextState.toastMessage).toBe('Cannot afford this card!');
        expect(nextState.playerTableau.p1).toHaveLength(0);
        expect(nextState.market[1][0]?.id).toBe('expensive');
    });

    it('removes reserved purchases from hand and grants speculator bonus gems', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        const reservedCard = createCard({ id: 'reserved-speculator' });
        const state = createState({
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            },
            playerBuffs: { p1: BUFFS.SPECULATOR, p2: BUFFS.NONE },
            playerReserved: { p1: [reservedCard], p2: [] },
        });

        const nextState = handleBuyCard(state, {
            card: reservedCard,
            source: 'reserved',
        });

        expect(nextState.playerReserved.p1).toHaveLength(0);
        expect(nextState.playerTableau.p1).toContainEqual(
            expect.objectContaining({ id: 'reserved-speculator' })
        );
        expect(nextState.inventories.p1.red).toBe(2);
        expect(nextState.extraAllocation.p1.red).toBe(2);
        expect(nextState.toastMessage).toBe('Speculator: Recycled 2 gems!');
    });

    it('removes extra level-3 cards from the hidden deck and skips steal when Pacifist blocks it', () => {
        const hiddenA = createCard({ id: 'l3-hidden-a', level: 3 });
        const hiddenB = createCard({ id: 'l3-hidden-b', level: 3 });
        const hiddenC = createCard({ id: 'l3-hidden-c', level: 3 });
        const stealCard = createCard({
            id: 'steal-extra',
            level: 3,
            ability: 'steal',
        });
        const state = createState({
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 1, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            },
            playerBuffs: { p1: BUFFS.NONE, p2: BUFFS.PACIFIST },
            decks: { 1: [], 2: [], 3: [hiddenA, hiddenB, hiddenC] },
        });

        const nextState = handleBuyCard(state, {
            card: stealCard,
            source: 'market',
            marketInfo: { level: 3, idx: 0, isExtra: true, extraIdx: 1 },
        });

        expect(nextState.decks[3].map((card) => card.id)).toEqual(['l3-hidden-a', 'l3-hidden-c']);
        expect(nextState.phase).toBe(GAME_PHASES.IDLE);
        expect(nextState.turn).toBe('p2');
        expect(nextState.toastMessage).toBe('Steal blocked by Pacifist!');
    });

    it('keeps the turn with the current player when AGAIN resolves without another branch taking over', () => {
        const againCard = createCard({
            id: 'again-card',
            ability: 'again',
        });
        const state = createState({
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            },
        });

        const nextState = handleBuyCard(state, {
            card: againCard,
            source: 'market',
            marketInfo: { level: 1, idx: 0 },
        });

        expect(nextState.phase).toBe(GAME_PHASES.IDLE);
        expect(nextState.turn).toBe('p1');
        expect(nextState.pendingExtraTurn).toBe(false);
    });

    it('defers AGAIN until royal selection and forced discard fully resolve', () => {
        const crownAgainCard = createCard({
            id: 'crown-again-card',
            ability: 'again',
            crowns: 3,
        });
        const state = createState({
            inventories: {
                p1: { blue: 11, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            },
            royalDeck: [
                {
                    id: 'royal-plain',
                    points: 3,
                    bonusColor: 'gold',
                    ability: 'none',
                    label: 'Royal Plain',
                },
            ],
        });

        const afterBuy = handleBuyCard(state, {
            card: crownAgainCard,
            source: 'market',
            marketInfo: { level: 1, idx: 0 },
        });

        expect(afterBuy.phase).toBe(GAME_PHASES.SELECT_ROYAL);
        expect(afterBuy.turn).toBe('p1');
        expect(afterBuy.nextPlayerAfterRoyal).toBe('p1');
        expect(afterBuy.pendingExtraTurn).toBe(true);

        const afterRoyal = handleSelectRoyalCard(afterBuy, {
            card: afterBuy.royalDeck[0],
        });

        expect(afterRoyal.phase).toBe(GAME_PHASES.DISCARD_EXCESS_GEMS);
        expect(afterRoyal.turn).toBe('p1');
        expect(afterRoyal.nextPlayerAfterRoyal).toBe('p1');
        expect(afterRoyal.pendingExtraTurn).toBe(true);

        const afterDiscard = handleDiscardGem(afterRoyal, 'blue');
        expect(afterDiscard.phase).toBe(GAME_PHASES.IDLE);
        expect(afterDiscard.turn).toBe('p1');
        expect(afterDiscard.pendingExtraTurn).toBe(false);
    });

    it('skips bonus-gem cards cleanly when no matching gem exists on the board', () => {
        const bonusCard = createCard({
            id: 'bonus-skip',
            ability: 'bonus_gem',
            bonusColor: 'red',
        });
        const state = createState({
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            },
        });

        const nextState = handleBuyCard(state, {
            card: bonusCard,
            source: 'market',
            marketInfo: { level: 1, idx: 0 },
        });

        expect(nextState.phase).toBe(GAME_PHASES.IDLE);
        expect(nextState.bonusGemTarget).toBeNull();
        expect(nextState.toastMessage).toBe('No matching gem available - Skill skipped');
    });

    it('opens the bonus-action phase when a matching gem exists on the board', () => {
        const bonusCard = createCard({
            id: 'bonus-hit',
            ability: 'bonus_gem',
            bonusColor: 'red',
        });
        const state = createState({
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            },
        });
        state.board[0][0] = { type: GEM_TYPES.RED, uid: 'bonus-red' };

        const nextState = handleBuyCard(state, {
            card: bonusCard,
            source: 'market',
            marketInfo: { level: 1, idx: 0 },
        });

        expect(nextState.phase).toBe(GAME_PHASES.BONUS_ACTION);
        expect(nextState.turn).toBe('p1');
        expect(nextState.bonusGemTarget).toBe(GEM_TYPES.RED);
    });

    it('steals a privilege from the opponent when scroll resolves against a capped pool', () => {
        const scrollCard = createCard({
            id: 'scroll-transfer',
            ability: 'scroll',
        });
        const state = createState({
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            },
            privileges: { p1: 1, p2: 2 },
        });

        const nextState = handleBuyCard(state, {
            card: scrollCard,
            source: 'market',
            marketInfo: { level: 1, idx: 0 },
        });

        expect(nextState.privileges).toEqual({ p1: 2, p2: 1 });
        expect(nextState.turn).toBe('p2');
    });

    it('does not steal a standard privilege from Pacifist when the board supply is empty', () => {
        const scrollCard = createCard({
            id: 'scroll-pacifist-safe',
            ability: 'scroll',
        });
        const state = createState({
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            },
            privileges: { p1: 1, p2: 2 },
            playerBuffs: { p1: BUFFS.NONE, p2: BUFFS.PACIFIST },
        });

        const nextState = handleBuyCard(state, {
            card: scrollCard,
            source: 'market',
            marketInfo: { level: 1, idx: 0 },
        });

        expect(nextState.privileges).toEqual({ p1: 1, p2: 2 });
        expect(nextState.turn).toBe('p2');
    });

    it('drives reserve initiation and cancellation through the waiting-for-gem phase', () => {
        const card = createCard({ id: 'reserve-flow' });
        const state = createState();

        const reserveState = handleInitiateReserve(state, {
            card,
            level: 1,
            idx: 0,
        });
        expect(reserveState.pendingReserve).toEqual({ card, level: 1, idx: 0 });
        expect(reserveState.phase).toBe(GAME_PHASES.RESERVE_WAITING_GEM);

        const reserveDeckState = handleInitiateReserveDeck(state, { level: 3 });
        expect(reserveDeckState.pendingReserve).toEqual({ level: 3, isDeck: true });
        expect(reserveDeckState.phase).toBe(GAME_PHASES.RESERVE_WAITING_GEM);

        const cancelledState = handleCancelReserve(state);
        expect(cancelledState.pendingReserve).toBeNull();
        expect(cancelledState.phase).toBe(GAME_PHASES.IDLE);
    });

    it('reserves from the deck, picks up gold, and applies first-reserve plus reserve-bonus buffs', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        const reserveBuff: Buff = {
            id: 'reserve-suite',
            level: 1,
            label: 'Reserve Suite',
            desc: 'Combined reserve bonuses for testing.',
            effects: {
                passive: {
                    firstReserveBonus: 1,
                    reserveBonusGem: true,
                },
            },
        };
        const hiddenCard = createCard({ id: 'deck-hidden', level: 2 });
        const state = createState({
            decks: { 1: [], 2: [hiddenCard], 3: [] },
            playerBuffs: { p1: reserveBuff, p2: BUFFS.NONE },
        });
        state.board[0][0] = { type: GEM_TYPES.GOLD, uid: 'gold-0-0' };

        const nextState = handleReserveDeck(state, {
            level: 2,
            goldCoords: { r: 0, c: 0 },
        });

        expect(nextState.playerReserved.p1).toEqual([hiddenCard]);
        expect(nextState.inventories.p1.gold).toBe(2);
        expect(nextState.extraAllocation.p1.gold).toBe(1);
        expect(nextState.inventories.p1.red).toBe(1);
        expect(nextState.phase).toBe(GAME_PHASES.IDLE);
        expect(nextState.turn).toBe('p2');
        expect(nextState.pendingReserve).toBeNull();
    });

    it('steals reserved cards with collector authority and applies reserve bonuses on the first take', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        const collectorSuite: Buff = {
            id: 'collector-suite',
            level: 1,
            label: 'Collector Suite',
            desc: 'Combined reserve authority and bonuses for testing.',
            effects: {
                passive: {
                    stealReserved: true,
                    firstReserveBonus: 1,
                    reserveBonusGem: true,
                },
            },
        };
        const reservedCard = createCard({ id: 'opponent-reserved' });
        const state = createState({
            playerBuffs: { p1: collectorSuite, p2: BUFFS.NONE },
            playerReserved: { p1: [], p2: [reservedCard] },
        });
        state.board[0][0] = { type: GEM_TYPES.GOLD, uid: 'gold-0-0' };

        const nextState = handleReserveCard(state, {
            card: reservedCard,
            level: 1,
            idx: 0,
            isSteal: true,
            goldCoords: { r: 0, c: 0 },
        });

        expect(nextState.playerReserved.p1).toEqual([reservedCard]);
        expect(nextState.playerReserved.p2).toEqual([]);
        expect(nextState.inventories.p1.gold).toBe(2);
        expect(nextState.extraAllocation.p1.gold).toBe(1);
        expect(nextState.inventories.p1.red).toBe(1);
        expect(nextState.toastMessage).toBe('Nimble Fingers: +1 Gem!');
        expect(nextState.turn).toBe('p2');
    });

    it('rejects reserve-card steals when the acting player lacks Collector authority', () => {
        const reservedCard = createCard({ id: 'opponent-reserved-no-collector' });
        const state = createState({
            playerReserved: { p1: [], p2: [reservedCard] },
        });

        const nextState = handleReserveCard(state, {
            card: reservedCard,
            level: 1,
            idx: 0,
            isSteal: true,
        });

        expect(nextState.toastMessage).toBe('Requires Collector buff!');
        expect(nextState.playerReserved.p1).toEqual([]);
        expect(nextState.playerReserved.p2).toEqual([reservedCard]);
    });

    it('recycles discarded reserved cards back into their deck when Puppet Master is active', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        const puppetMaster: Buff = {
            id: 'puppet_master',
            level: 1,
            label: 'Puppet Master',
            desc: 'Discard a reserved card to recycle it.',
            effects: {
                active: 'discard_reserved',
            },
        };
        const reservedCard = createCard({ id: 'reserved-recycle', level: 2 });
        const state = createState({
            playerBuffs: { p1: puppetMaster, p2: BUFFS.NONE },
            playerReserved: { p1: [reservedCard], p2: [] },
            decks: { 1: [], 2: [], 3: [] },
        });

        const nextState = handleDiscardReserved(state, { cardId: reservedCard.id });

        expect(nextState.playerReserved.p1).toEqual([]);
        expect(nextState.decks[2][0]).toEqual(reservedCard);
        expect(nextState.inventories.p1.red).toBe(1);
        expect(nextState.toastMessage).toBe('Puppet Master: Card recycled!');
    });

    it('refuses reserve-deck requests once the player is already holding three reserved cards', () => {
        const state = createState({
            playerReserved: {
                p1: [
                    createCard({ id: 'res-1' }),
                    createCard({ id: 'res-2' }),
                    createCard({ id: 'res-3' }),
                ],
                p2: [],
            },
            decks: { 1: [], 2: [createCard({ id: 'top-deck', level: 2 })], 3: [] },
        });

        const nextState = handleReserveDeck(state, { level: 2 });

        expect(nextState.toastMessage).toBe('Reserve limit reached!');
        expect(nextState.playerReserved.p1.map((card) => card.id)).toEqual([
            'res-1',
            'res-2',
            'res-3',
        ]);
        expect(nextState.decks[2]).toHaveLength(1);
    });
});
