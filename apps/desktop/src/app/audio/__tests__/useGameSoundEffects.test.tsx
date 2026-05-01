// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import { ROYAL_CARDS } from '@gemduel/shared/constants';
import type { Card, GameState } from '@gemduel/shared/types';
import {
    GAME_SOUND_EFFECT_PATHS,
    useGameSoundEffects,
    type GameSoundEffectId,
} from '../useGameSoundEffects';
import type { PresentationHistorySource } from '../../presentation/presentationTypes';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

class FakeAudio {
    src: string;
    muted = false;
    preload = '';
    volume = 1;
    currentTime = 0;
    play = vi.fn(() => Promise.resolve());
    pause = vi.fn();

    constructor(src: string) {
        this.src = src;
        fakeAudioInstances.push(this);
    }
}

const fakeAudioInstances: FakeAudio[] = [];

const cloneState = (): GameState => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

const createCard = (id: string): Card => ({
    id,
    level: 1,
    cost: {
        blue: 0,
        white: 0,
        green: 0,
        black: 0,
        red: 0,
        pearl: 0,
        gold: 0,
    },
    points: 1,
    ability: 'none',
    bonusColor: 'red',
    crowns: 0,
    bonusCount: 1,
});

const getPlayCount = (effect: GameSoundEffectId) =>
    fakeAudioInstances
        .filter((instance) => instance.src === GAME_SOUND_EFFECT_PATHS[effect])
        .reduce((count, instance) => count + instance.play.mock.calls.length, 0);

describe('useGameSoundEffects', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const Harness = ({
        state,
        currentIndex,
        enabled = true,
        historySource = 'live',
        isReviewing = false,
    }: {
        state: GameState;
        currentIndex: number;
        enabled?: boolean;
        historySource?: PresentationHistorySource;
        isReviewing?: boolean;
    }) => {
        useGameSoundEffects({
            state,
            currentIndex,
            historySource,
            isReviewing,
            enabled,
        });
        return null;
    };

    const renderHarness = async (
        state: GameState,
        currentIndex: number,
        options: {
            enabled?: boolean;
            historySource?: PresentationHistorySource;
            isReviewing?: boolean;
        } = {}
    ) => {
        if (!container) {
            container = document.createElement('div');
            document.body.appendChild(container);
            root = createRoot(container);
        }

        await act(async () => {
            root?.render(<Harness state={state} currentIndex={currentIndex} {...options} />);
            await Promise.resolve();
        });
    };

    beforeEach(() => {
        fakeAudioInstances.length = 0;
        vi.stubGlobal('Audio', FakeAudio);
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('does not play on first render', async () => {
        await renderHarness(cloneState(), 0);

        expect(getPlayCount('gem-basic')).toBe(0);
        expect(getPlayCount('gem-pearl')).toBe(0);
        expect(getPlayCount('card-market')).toBe(0);
        expect(getPlayCount('card-royal')).toBe(0);
    });

    it('unlocks audio elements on the first user gesture', async () => {
        await renderHarness(cloneState(), 0);

        await act(async () => {
            window.dispatchEvent(new PointerEvent('pointerdown'));
            await Promise.resolve();
        });

        expect(getPlayCount('gem-basic')).toBe(1);
        expect(getPlayCount('gem-pearl')).toBe(1);
        expect(getPlayCount('card-market')).toBe(1);
        expect(getPlayCount('card-royal')).toBe(1);
        expect(fakeAudioInstances.every((instance) => instance.pause.mock.calls.length === 1)).toBe(
            true
        );
        expect(fakeAudioInstances.every((instance) => instance.muted === false)).toBe(true);
        expect(fakeAudioInstances.every((instance) => instance.volume === 0.45)).toBe(true);
    });

    it('plays the basic gem sound for positive non-pearl gem deltas', async () => {
        const previousState = cloneState();
        const nextState = cloneState();
        nextState.inventories.p1.blue = 1;

        await renderHarness(previousState, 0);
        await renderHarness(nextState, 1);

        expect(getPlayCount('gem-basic')).toBe(1);
        expect(getPlayCount('gem-pearl')).toBe(0);
    });

    it('prioritizes the pearl sound when a gem pickup includes pearl', async () => {
        const previousState = cloneState();
        const nextState = cloneState();
        nextState.inventories.p1.blue = 1;
        nextState.inventories.p1.pearl = 1;

        await renderHarness(previousState, 0);
        await renderHarness(nextState, 1);

        expect(getPlayCount('gem-pearl')).toBe(1);
        expect(getPlayCount('gem-basic')).toBe(0);
    });

    it('plays the market card sound only for market-sourced card acquisition', async () => {
        const marketCard = createCard('market-card');
        const reservedCard = createCard('reserved-card');
        const previousState = cloneState();
        const nextState = cloneState();
        previousState.market[1] = [marketCard];
        previousState.playerReserved.p1 = [reservedCard];
        nextState.playerTableau.p1 = [marketCard, reservedCard];

        await renderHarness(previousState, 0);
        await renderHarness(nextState, 1);

        expect(getPlayCount('card-market')).toBe(1);
    });

    it('does not play a card sound when a reserved card moves to tableau', async () => {
        const reservedCard = createCard('reserved-card');
        const previousState = cloneState();
        const nextState = cloneState();
        previousState.playerReserved.p1 = [reservedCard];
        nextState.playerTableau.p1 = [reservedCard];

        await renderHarness(previousState, 0);
        await renderHarness(nextState, 1);

        expect(getPlayCount('card-market')).toBe(0);
    });

    it('plays the royal card sound when player royals increase', async () => {
        const previousState = cloneState();
        const nextState = cloneState();
        nextState.playerRoyals.p1 = [ROYAL_CARDS[0]!];

        await renderHarness(previousState, 0);
        await renderHarness(nextState, 1);

        expect(getPlayCount('card-royal')).toBe(1);
    });

    it('stays silent when disabled, reviewing, or replay-importing', async () => {
        const previousState = cloneState();
        const nextState = cloneState();
        nextState.inventories.p1.blue = 1;

        await renderHarness(previousState, 0, { enabled: false });
        await renderHarness(nextState, 1, { enabled: false });
        expect(getPlayCount('gem-basic')).toBe(0);

        const reviewState = cloneState();
        reviewState.inventories.p1.blue = 2;
        await renderHarness(reviewState, 2, { enabled: true, isReviewing: true });
        expect(getPlayCount('gem-basic')).toBe(0);

        const replayState = cloneState();
        replayState.inventories.p1.blue = 3;
        await renderHarness(replayState, 3, { enabled: true, historySource: 'replay-import' });
        expect(getPlayCount('gem-basic')).toBe(0);
    });

    it('dedupes repeated state transitions for the same index and event', async () => {
        const previousState = cloneState();
        const nextState = cloneState();
        nextState.inventories.p1.blue = 1;

        await renderHarness(previousState, 0);
        await renderHarness(nextState, 1);
        await renderHarness(nextState, 1);

        expect(getPlayCount('gem-basic')).toBe(1);
    });
});
