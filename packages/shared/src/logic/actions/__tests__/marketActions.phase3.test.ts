import { afterEach, describe, expect, it, vi } from 'vitest';
import { BUFFS, GAME_PHASES, GEM_TYPES } from '../../../constants';
import { applyAction } from '../../gameReducer';
import { processGemClick } from '../../interactionManager';
import { createMockState } from '../../__tests__/testHelpers';
import { handleDiscardGem, handleStealGem } from '../boardActions';
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

const getBasicGemTotal = (inventory: GameState['inventories']['p1']) =>
    inventory.red + inventory.green + inventory.blue + inventory.white + inventory.black;

const getBasicExtraAllocationTotal = (allocation: GameState['extraAllocation']['p1']) =>
    allocation.red + allocation.green + allocation.blue + allocation.white + allocation.black;

const createEchoReservoirBuff = (state?: Buff['state']): Buff => ({
    ...BUFFS.ECHO_RESERVOIR,
    state: state ? { ...state } : undefined,
});

const buyFromMarket = (state: GameState, card: Card): GameState =>
    handleBuyCard(state, {
        card,
        source: 'market',
        marketInfo: { level: card.level, idx: 0 },
    });

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
        state.pendingBuy = {
            card: createCard({ id: 'pending-joker', bonusColor: 'gold' }),
            source: 'market',
            marketInfo: { level: 1, idx: 0 },
        };

        const nextState = handleBuyCard(state, {
            card: createCard({ id: 'expensive' }),
            source: 'market',
            marketInfo: { level: 1, idx: 0 },
        });

        expect(nextState.toastMessage).toBe('Cannot afford this card!');
        expect(nextState.playerTableau.p1).toHaveLength(0);
        expect(nextState.market[1][0]?.id).toBe('expensive');
        expect(nextState.pendingBuy).toEqual(state.pendingBuy);
        expect(nextState.phase).toBe(state.phase);
    });

    it('removes reserved purchases from hand and grants speculator bonus gems', () => {
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
        expect(getBasicGemTotal(nextState.inventories.p1)).toBe(2);
        expect(getBasicExtraAllocationTotal(nextState.extraAllocation.p1)).toBe(2);
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
        expect(afterBuy.nextPlayerAfterRoyal).toBe('p2');
        expect(afterBuy.pendingExtraTurn).toBe(true);

        const afterRoyal = handleSelectRoyalCard(afterBuy, {
            card: afterBuy.royalDeck[0],
        });

        expect(afterRoyal.phase).toBe(GAME_PHASES.DISCARD_EXCESS_GEMS);
        expect(afterRoyal.turn).toBe('p1');
        expect(afterRoyal.nextPlayerAfterRoyal).toBe('p2');
        expect(afterRoyal.pendingExtraTurn).toBe(true);

        const afterDiscard = handleDiscardGem(afterRoyal, 'blue');
        expect(afterDiscard.phase).toBe(GAME_PHASES.IDLE);
        expect(afterDiscard.turn).toBe('p1');
        expect(afterDiscard.pendingExtraTurn).toBe(false);
    });

    it('stores an opponent steal ability, echoes it once on your purchase, and clears the ammo', () => {
        const stealCard = createCard({ id: 'echo-source-steal', ability: 'steal' });
        const vanillaCard = createCard({ id: 'echo-consumer-vanilla' });
        const state = createState({
            turn: 'p2',
            inventories: {
                p1: { blue: 1, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 1, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
            },
            playerBuffs: { p1: createEchoReservoirBuff(), p2: BUFFS.NONE },
        });

        const afterOpponentBuy = buyFromMarket(state, stealCard);
        expect(afterOpponentBuy.phase).toBe(GAME_PHASES.STEAL_ACTION);
        expect(afterOpponentBuy.playerBuffs.p1.state?.echoReservoirStoredAbilities).toBeUndefined();

        const afterOpponentSteal = handleStealGem(afterOpponentBuy, { gemId: 'blue' });
        expect(afterOpponentSteal.turn).toBe('p1');
        expect(afterOpponentSteal.playerBuffs.p1.state?.echoReservoirStoredAbilities).toEqual([
            'steal',
        ]);

        const afterHolderBuy = buyFromMarket(afterOpponentSteal, vanillaCard);
        expect(afterHolderBuy.phase).toBe(GAME_PHASES.STEAL_ACTION);
        expect(afterHolderBuy.playerBuffs.p1.state?.echoReservoirStoredAbilities).toBeUndefined();

        const afterEchoSteal = handleStealGem(afterHolderBuy, { gemId: 'blue' });
        expect(afterEchoSteal.turn).toBe('p2');
        expect(afterEchoSteal.inventories.p1.blue).toBe(1);
        expect(afterEchoSteal.inventories.p2.blue).toBe(1);
        expect(afterEchoSteal.playerBuffs.p1.state?.echoReservoirStoredAbilities).toBeUndefined();
    });

    it('dedupes AGAIN between card face and echo so only one extra turn window is created', () => {
        const againCard = createCard({ id: 'echo-again', ability: 'again' });
        const vanillaCard = createCard({ id: 'plain-follow-up' });
        const state = createState({
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 2, gold: 0, pearl: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 2, gold: 0, pearl: 0 },
            },
            playerBuffs: { p1: BUFFS.NONE, p2: createEchoReservoirBuff() },
        });

        const afterFeed = buyFromMarket(state, againCard);
        expect(afterFeed.turn).toBe('p1');
        expect(afterFeed.playerBuffs.p2.state?.echoReservoirStoredAbilities).toEqual(['again']);

        const afterP1ExtraTurn = buyFromMarket(afterFeed, vanillaCard);
        expect(afterP1ExtraTurn.turn).toBe('p2');

        const afterEchoAgain = buyFromMarket(afterP1ExtraTurn, againCard);
        expect(afterEchoAgain.turn).toBe('p2');
        expect(afterEchoAgain.pendingExtraTurn).toBe(false);
        expect(afterEchoAgain.playerBuffs.p2.state?.echoReservoirStoredAbilities).toBeUndefined();

        const afterOnlyExtraTurn = buyFromMarket(afterEchoAgain, vanillaCard);
        expect(afterOnlyExtraTurn.turn).toBe('p1');
    });

    it('keeps existing stored ammo when the opponent later buys a vanilla card', () => {
        const vanillaCard = createCard({ id: 'vanilla-overwrite-check' });
        const state = createState({
            turn: 'p2',
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
            },
            playerBuffs: {
                p1: createEchoReservoirBuff({
                    echoReservoirStoredAbilities: ['steal'],
                }),
                p2: BUFFS.NONE,
            },
        });

        const nextState = buyFromMarket(state, vanillaCard);
        expect(nextState.turn).toBe('p1');
        expect(nextState.playerBuffs.p1.state?.echoReservoirStoredAbilities).toEqual(['steal']);
    });

    it('records multiple printed abilities together and resolves each type once in the same purchase', () => {
        const dualAbilityCard = createCard({
            id: 'dual-print-source',
            ability: ['steal', 'scroll'],
        });
        const vanillaCard = createCard({ id: 'dual-consumer' });
        const state = createState({
            turn: 'p2',
            inventories: {
                p1: { blue: 1, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 1, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
            },
            privileges: { p1: 1, p2: 2 },
            playerBuffs: { p1: createEchoReservoirBuff(), p2: BUFFS.NONE },
        });

        const afterOpponentBuy = buyFromMarket(state, dualAbilityCard);
        const afterOpponentSteal = handleStealGem(afterOpponentBuy, { gemId: 'blue' });

        expect(afterOpponentSteal.playerBuffs.p1.state?.echoReservoirStoredAbilities).toEqual([
            'steal',
            'scroll',
        ]);

        const afterHolderBuy = buyFromMarket(afterOpponentSteal, vanillaCard);
        expect(afterHolderBuy.phase).toBe(GAME_PHASES.STEAL_ACTION);

        const afterEchoResolution = handleStealGem(afterHolderBuy, { gemId: 'blue' });
        expect(afterEchoResolution.turn).toBe('p2');
        expect(afterEchoResolution.inventories.p1.blue).toBe(1);
        expect(afterEchoResolution.privileges).toEqual({ p1: 1, p2: 2 });
        expect(
            afterEchoResolution.playerBuffs.p1.state?.echoReservoirStoredAbilities
        ).toBeUndefined();
    });

    it('consumes echoed ability types even when the purchased card already has the same printed ability', () => {
        const overlappingStealCard = createCard({ id: 'overlap-steal', ability: 'steal' });
        const state = createState({
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 1, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            },
            playerBuffs: {
                p1: createEchoReservoirBuff({
                    echoReservoirStoredAbilities: ['steal'],
                }),
                p2: BUFFS.NONE,
            },
        });

        const afterBuy = buyFromMarket(state, overlappingStealCard);
        expect(afterBuy.phase).toBe(GAME_PHASES.STEAL_ACTION);
        expect(afterBuy.playerBuffs.p1.state?.echoReservoirStoredAbilities).toBeUndefined();

        const afterSteal = handleStealGem(afterBuy, { gemId: 'blue' });
        expect(afterSteal.inventories.p1.blue).toBe(1);
        expect(afterSteal.inventories.p2.blue).toBe(0);
        expect(afterSteal.playerBuffs.p1.state?.echoReservoirStoredAbilities).toBeUndefined();
    });

    it('does not echo bonus_gem without a stored color and still clears the spent memory', () => {
        const vanillaCard = createCard({ id: 'echo-bonus-no-color' });
        const state = createState({
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            },
            playerBuffs: {
                p1: createEchoReservoirBuff({
                    echoReservoirStoredAbilities: ['bonus_gem'],
                }),
                p2: BUFFS.NONE,
            },
        });

        const nextState = buyFromMarket(state, vanillaCard);
        expect(nextState.phase).toBe(GAME_PHASES.IDLE);
        expect(nextState.turn).toBe('p2');
        expect(nextState.bonusGemTarget).toBeNull();
        expect(nextState.playerBuffs.p1.state?.echoReservoirStoredAbilities).toBeUndefined();
    });

    it('only stores printed abilities when both players have Echo Reservoir', () => {
        const stealCard = createCard({ id: 'both-buffs-feed', ability: 'steal' });
        const againCard = createCard({ id: 'both-buffs-consume', ability: 'again' });
        const state = createState({
            turn: 'p2',
            inventories: {
                p1: { blue: 1, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 1, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
            },
            playerBuffs: {
                p1: createEchoReservoirBuff(),
                p2: createEchoReservoirBuff(),
            },
        });

        const afterP2Buy = buyFromMarket(state, stealCard);
        const afterP2Steal = handleStealGem(afterP2Buy, { gemId: 'blue' });

        expect(afterP2Steal.playerBuffs.p1.state?.echoReservoirStoredAbilities).toEqual(['steal']);

        const afterP1Buy = buyFromMarket(afterP2Steal, againCard);
        expect(afterP1Buy.phase).toBe(GAME_PHASES.STEAL_ACTION);
        expect(afterP1Buy.playerBuffs.p1.state?.echoReservoirStoredAbilities).toBeUndefined();

        const afterP1Steal = handleStealGem(afterP1Buy, { gemId: 'blue' });
        expect(afterP1Steal.turn).toBe('p1');
        expect(afterP1Steal.playerBuffs.p2.state?.echoReservoirStoredAbilities).toEqual(['again']);
    });

    it('echoes and consumes stored memory when buying a reserved card', () => {
        const reservedCard = createCard({ id: 'reserved-echo-consumer' });
        const state = createState({
            inventories: {
                p1: { blue: 1, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 1, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            },
            playerReserved: {
                p1: [reservedCard],
                p2: [],
            },
            playerBuffs: {
                p1: createEchoReservoirBuff({
                    echoReservoirStoredAbilities: ['steal'],
                }),
                p2: BUFFS.NONE,
            },
            turn: 'p1',
        });

        const afterReservedBuy = handleBuyCard(state, {
            card: reservedCard,
            source: 'reserved',
        });

        expect(afterReservedBuy.phase).toBe(GAME_PHASES.STEAL_ACTION);
        expect(afterReservedBuy.playerBuffs.p1.state?.echoReservoirStoredAbilities).toBeUndefined();

        const afterReservedSteal = handleStealGem(afterReservedBuy, {
            gemId: 'blue',
        });

        expect(afterReservedSteal.turn).toBe('p2');
        expect(afterReservedSteal.inventories.p1.blue).toBe(2);
        expect(afterReservedSteal.inventories.p2.blue).toBe(0);
    });

    it('does not trigger stored extra-turn memory when reserving a market card for gold', () => {
        const reserveCard = createCard({ id: 'reserve-no-echo', level: 1, ability: 'none' });
        const state = createState({
            turn: 'p1',
            playerBuffs: {
                p1: createEchoReservoirBuff({
                    echoReservoirStoredAbilities: ['again'],
                }),
                p2: BUFFS.NONE,
            },
            market: {
                1: [reserveCard, null, null, null],
                2: [],
                3: [],
            },
            decks: { 1: [], 2: [], 3: [] },
        });

        state.board[0][0] = { type: GEM_TYPES.GOLD, uid: 'reserve-gold' };

        const nextState = handleReserveCard(state, {
            card: reserveCard,
            level: 1,
            idx: 0,
            goldCoords: { r: 0, c: 0 },
        });

        expect(nextState.turn).toBe('p2');
        expect(nextState.phase).toBe(GAME_PHASES.IDLE);
        expect(nextState.pendingExtraTurn).toBe(false);
        expect(nextState.inventories.p1.gold).toBe(1);
        expect(nextState.playerReserved.p1).toContainEqual(
            expect.objectContaining({ id: 'reserve-no-echo' })
        );
        expect(nextState.playerBuffs.p1.state?.echoReservoirStoredAbilities).toEqual(['again']);
    });

    it('keeps stored again memory dormant across the full reserve-gold reducer flow', () => {
        const reserveCard = createCard({ id: 'reserve-flow-no-echo', level: 1, ability: 'none' });
        const state = createState({
            turn: 'p1',
            playerBuffs: {
                p1: createEchoReservoirBuff({
                    echoReservoirStoredAbilities: ['again'],
                }),
                p2: BUFFS.NONE,
            },
            market: {
                1: [reserveCard, null, null, null],
                2: [],
                3: [],
            },
            decks: { 1: [], 2: [], 3: [] },
        });

        state.board[1][1] = { type: GEM_TYPES.GOLD, uid: 'reserve-flow-gold' };

        const reservingState = applyAction(state, {
            type: 'INITIATE_RESERVE',
            payload: {
                card: reserveCard,
                level: 1,
                idx: 0,
            },
        });

        expect(reservingState?.phase).toBe(GAME_PHASES.RESERVE_WAITING_GEM);

        const reserveResolution = processGemClick(reservingState ?? null, 1, 1);
        expect(reserveResolution.error).toBeUndefined();
        expect(reserveResolution.action?.type).toBe('RESERVE_CARD');

        const resolvedState = reserveResolution.action
            ? applyAction(reservingState, reserveResolution.action)
            : reservingState;

        expect(resolvedState?.turn).toBe('p2');
        expect(resolvedState?.phase).toBe(GAME_PHASES.IDLE);
        expect(resolvedState?.pendingExtraTurn).toBe(false);
        expect(resolvedState?.inventories.p1.gold).toBe(1);
        expect(resolvedState?.playerBuffs.p1.state?.echoReservoirStoredAbilities).toEqual([
            'again',
        ]);
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

    it('resolves a purchased bonus-gem card through the reducer and board-click path', () => {
        const bonusCard = createCard({
            id: 'bonus-full-flow',
            ability: 'bonus_gem',
            bonusColor: 'red',
        });
        const state = createState({
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            },
            market: { 1: [bonusCard], 2: [], 3: [] },
        });
        state.board[0][0] = { type: GEM_TYPES.RED, uid: 'bonus-red-full-flow' };

        const afterBuy = applyAction(state, {
            type: 'BUY_CARD',
            payload: {
                card: bonusCard,
                source: 'market',
                marketInfo: { level: 1, idx: 0 },
            },
        });

        expect(afterBuy?.phase).toBe(GAME_PHASES.BONUS_ACTION);
        expect(afterBuy?.turn).toBe('p1');
        expect(afterBuy?.bonusGemTarget).toBe(GEM_TYPES.RED);

        const bonusSelection = processGemClick(afterBuy, 0, 0);
        expect(bonusSelection.action).toEqual({
            type: 'TAKE_BONUS_GEM',
            payload: { r: 0, c: 0 },
        });

        const afterBonusGem = applyAction(afterBuy, bonusSelection.action!);

        expect(afterBonusGem?.phase).toBe(GAME_PHASES.IDLE);
        expect(afterBonusGem?.turn).toBe('p2');
        expect(afterBonusGem?.bonusGemTarget).toBeNull();
        expect(afterBonusGem?.abilityResolution).toBeNull();
        expect(afterBonusGem?.board[0][0].type.id).toBe('empty');
        expect(afterBonusGem?.inventories.p1.red).toBe(1);
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
        expect(getBasicGemTotal(nextState.inventories.p1)).toBe(1);
        expect(getBasicExtraAllocationTotal(nextState.extraAllocation.p1)).toBe(1);
        expect(nextState.phase).toBe(GAME_PHASES.IDLE);
        expect(nextState.turn).toBe('p2');
        expect(nextState.pendingReserve).toBeNull();
    });

    it('lets Insight reserve and buy the revealed top Level 1 card', () => {
        const visibleTop = createCard({ id: 'insight-top', level: 1 });
        const hiddenBottom = createCard({ id: 'insight-bottom', level: 1 });
        const reserveState = createState({
            decks: { 1: [hiddenBottom, visibleTop], 2: [], 3: [] },
            playerBuffs: { p1: BUFFS.INSIGHT, p2: BUFFS.NONE },
        });

        const afterReserve = handleReserveCard(reserveState, {
            card: visibleTop,
            level: 1,
            idx: 0,
            isExtra: true,
            extraIdx: 0,
        });

        expect(afterReserve.playerReserved.p1).toContainEqual(
            expect.objectContaining({ id: 'insight-top' })
        );
        expect(afterReserve.decks[1]).toEqual([hiddenBottom]);

        const buyState = createState({
            inventories: {
                p1: { blue: 0, white: 0, green: 0, black: 0, red: 1, gold: 0, pearl: 0 },
                p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            },
            decks: { 1: [hiddenBottom, visibleTop], 2: [], 3: [] },
            playerBuffs: { p1: BUFFS.INSIGHT, p2: BUFFS.NONE },
        });

        const afterBuy = handleBuyCard(buyState, {
            card: visibleTop,
            source: 'market',
            marketInfo: { level: 1, idx: 0, isExtra: true, extraIdx: 0 },
        });

        expect(afterBuy.playerTableau.p1).toContainEqual(
            expect.objectContaining({ id: 'insight-top' })
        );
        expect(afterBuy.decks[1]).toEqual([hiddenBottom]);
    });

    it('lets All-Seeing Eye reserve the revealed extra Level 3 cards', () => {
        const hiddenA = createCard({ id: 'l3-bottom', level: 3 });
        const visibleExtra = createCard({ id: 'l3-visible-extra', level: 3 });
        const hiddenTop = createCard({ id: 'l3-top', level: 3 });
        const state = createState({
            decks: { 1: [], 2: [], 3: [hiddenA, visibleExtra, hiddenTop] },
            playerBuffs: { p1: BUFFS.ALL_SEEING_EYE, p2: BUFFS.NONE },
        });

        const nextState = handleReserveCard(state, {
            card: visibleExtra,
            level: 3,
            idx: 0,
            isExtra: true,
            extraIdx: 1,
        });

        expect(nextState.playerReserved.p1).toContainEqual(
            expect.objectContaining({ id: 'l3-visible-extra' })
        );
        expect(nextState.decks[3].map((card) => card.id)).toEqual(['l3-bottom', 'l3-top']);
    });

    it('steals reserved cards with collector authority and applies reserve bonuses on the first take', () => {
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
        expect(getBasicGemTotal(nextState.inventories.p1)).toBe(1);
        expect(getBasicExtraAllocationTotal(nextState.extraAllocation.p1)).toBe(1);
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
        expect(getBasicGemTotal(nextState.inventories.p1)).toBe(1);
        expect(getBasicExtraAllocationTotal(nextState.extraAllocation.p1)).toBe(1);
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
        expect(nextState.playerReserved.p1.map((card) => (card as Card).id)).toEqual([
            'res-1',
            'res-2',
            'res-3',
        ]);
        expect(nextState.decks[2]).toHaveLength(1);
    });
});
