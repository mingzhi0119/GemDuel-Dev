// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { applyAction } from '@gemduel/shared/logic/gameReducer';
import { buildStartGameAction } from '@gemduel/shared/logic/gameSetup';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import {
    buildReplayDeltaSync,
    buildReplayFullSync,
    buildReplayRecorderFromHistory,
    createReplayRecorderInternalState,
} from '@gemduel/shared/replay';
import type { GameAction, GameState } from '@gemduel/shared/types';
import { createCompletedReplayFixture } from '../../../__tests__/fixtures/replayRoundtripFixtures';
import { useAuthoritativeReplaySync } from '../useAuthoritativeReplaySync';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const cloneSkeleton = () =>
    JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as typeof INITIAL_STATE_SKELETON;

describe('useAuthoritativeReplaySync', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    const renderHook = (
        gameState: GameState,
        localReplayRecorder: ReturnType<typeof buildReplayRecorderFromHistory>
    ) => {
        let latest = null as null | ReturnType<typeof useAuthoritativeReplaySync>;
        const Probe = () => {
            latest = useAuthoritativeReplaySync({ gameState, localReplayRecorder });
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(<Probe />);
        });

        if (!latest) {
            throw new Error('Hook did not assign API');
        }

        return latest;
    };

    it('exposes null full sync helper when local recorder is not initialized', () => {
        const local = createReplayRecorderInternalState('5.2.11');
        const gameState = cloneSkeleton();
        const api = renderHook(gameState, local);

        expect(api.getCurrentReplayFullSync()).toBeNull();
    });

    it('returns STALE_PACKET for delta sync before any authoritative recorder exists', () => {
        const initAction = buildStartGameAction('LOCAL_PVP', { useBuffs: false });
        const gameState = applyAction(cloneSkeleton(), initAction)!;
        const local = buildReplayRecorderFromHistory([initAction], '5.2.11');
        const api = renderHook(gameState, local);

        const delta = buildReplayDeltaSync(local, gameState, 0);

        expect(delta.kind).toBe('delta');
        let reason: ReturnType<typeof api.syncAuthoritativeReplay> = null;
        act(() => {
            reason = api.syncAuthoritativeReplay(delta, gameState);
        });
        expect(reason).toBe('STALE_PACKET');
    });

    it('applies full authoritative replay sync for a completed fixture history', () => {
        const { history, states, replay } = createCompletedReplayFixture();
        const gameState = states.at(-1);
        if (!gameState) {
            throw new Error('Fixture must include terminal state');
        }

        const local = buildReplayRecorderFromHistory(history, replay.gameVersion);
        const full = buildReplayFullSync(local, gameState);
        const api = renderHook(gameState, local);

        act(() => {
            expect(api.syncAuthoritativeReplay(full, gameState)).toBeNull();
        });
    });

    it('replaceAuthoritativeReplay skips when replay revision is not newer than current', () => {
        const initAction = buildStartGameAction('LOCAL_PVP', { useBuffs: false });
        const gameState = applyAction(cloneSkeleton(), initAction)!;
        const local = buildReplayRecorderFromHistory([initAction], '5.2.11');
        const full = buildReplayFullSync(local, gameState);
        const api = renderHook(gameState, local);

        act(() => {
            api.replaceAuthoritativeReplay(full);
        });

        act(() => {
            api.replaceAuthoritativeReplay(full);
        });
    });

    it('replaceAuthoritativeReplay keeps newer revision when offered an older full replay', () => {
        const { history, replay } = createCompletedReplayFixture();
        if (history.length < 8) {
            throw new Error('Fixture history too short for revision split');
        }

        const shortHistory = history.slice(0, 4);
        const longHistory = history.slice(0, 8);

        const reduceStates = (actions: GameAction[]) => {
            let state: GameState | null = null;
            for (const action of actions) {
                const next = applyAction(state, action);
                if (!next) {
                    throw new Error(`Fixture action ${action.type} failed to apply`);
                }
                state = next;
            }
            return state!;
        };

        const s1 = reduceStates(shortHistory);
        const s2 = reduceStates(longHistory);

        const localShort = buildReplayRecorderFromHistory(shortHistory, replay.gameVersion);
        const localLong = buildReplayRecorderFromHistory(longHistory, replay.gameVersion);
        const fullShort = buildReplayFullSync(localShort, s1);
        const fullLong = buildReplayFullSync(localLong, s2);

        expect(fullLong.replayRevision).toBeGreaterThan(fullShort.replayRevision);

        const api = renderHook(s2, localLong);

        act(() => {
            api.replaceAuthoritativeReplay(fullLong);
        });

        act(() => {
            api.replaceAuthoritativeReplay(fullShort);
        });

        act(() => {
            expect(api.syncAuthoritativeReplay(fullLong, s2)).toBeNull();
        });

        const delta = buildReplayDeltaSync(localLong, s2, fullShort.replayRevision);
        if (delta.kind !== 'delta') {
            throw new Error('Expected delta replay sync');
        }
        act(() => {
            expect(api.syncAuthoritativeReplay(delta, s2)).toBeNull();
        });
    });
});
