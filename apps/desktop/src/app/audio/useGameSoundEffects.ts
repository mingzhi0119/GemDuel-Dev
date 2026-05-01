import { useEffect, useRef } from 'react';
import type { GameState, PlayerKey } from '@gemduel/shared/types';
import { derivePresentationEvents } from '../presentation/presentationEvents';
import type { PresentationHistorySource } from '../presentation/presentationTypes';

export const GAME_SOUND_EFFECT_PATHS = {
    'card-market': '/assets/audio/classic/card-market.ogg',
    'card-royal': '/assets/audio/classic/card-royal.ogg',
    'gem-basic': '/assets/audio/classic/gem-basic.ogg',
    'gem-pearl': '/assets/audio/classic/gem-pearl.ogg',
} as const;

export type GameSoundEffectId = keyof typeof GAME_SOUND_EFFECT_PATHS;

export interface GameSoundEffectEvent {
    id: string;
    effect: GameSoundEffectId;
}

interface UseGameSoundEffectsParams {
    state: GameState;
    currentIndex: number;
    historySource: PresentationHistorySource;
    isReviewing: boolean;
    enabled: boolean;
}

const PLAYER_KEYS = ['p1', 'p2'] as const satisfies readonly PlayerKey[];
const SOUND_VOLUME = 0.45;

const getNewRoyalIds = (
    previousState: GameState,
    nextState: GameState,
    player: PlayerKey
): string[] => {
    const previousRoyalIds = new Set(previousState.playerRoyals[player].map((card) => card.id));
    return nextState.playerRoyals[player]
        .map((card) => card.id)
        .filter((cardId) => !previousRoyalIds.has(cardId));
};

const deriveRoyalSoundEvents = (
    previousState: GameState,
    nextState: GameState,
    currentIndex: number
): GameSoundEffectEvent[] =>
    PLAYER_KEYS.flatMap((player) => {
        const royalIds = getNewRoyalIds(previousState, nextState, player);

        return royalIds.length > 0
            ? [
                  {
                      id: `sound:card-royal:${currentIndex}:${player}:${royalIds.join(',')}`,
                      effect: 'card-royal' as const,
                  },
              ]
            : [];
    });

export const deriveGameSoundEffectEvents = (
    previousState: GameState | null,
    nextState: GameState,
    currentIndex: number,
    historySource: PresentationHistorySource,
    isReviewing: boolean
): GameSoundEffectEvent[] => {
    if (!previousState || isReviewing || historySource !== 'live') {
        return [];
    }

    const events: GameSoundEffectEvent[] = [];
    const presentationEvents = derivePresentationEvents(
        previousState,
        nextState,
        currentIndex,
        historySource,
        isReviewing
    );

    for (const event of presentationEvents) {
        if (event.type === 'gem-flight') {
            const effect = (event.deltas.pearl ?? 0) > 0 ? 'gem-pearl' : 'gem-basic';
            events.push({
                id: `sound:${event.id}:${effect}`,
                effect,
            });
        }

        if (
            event.type === 'card-acquire' &&
            event.cards.some((item) => item.source.kind === 'market')
        ) {
            events.push({
                id: `sound:${event.id}:card-market`,
                effect: 'card-market',
            });
        }
    }

    events.push(...deriveRoyalSoundEvents(previousState, nextState, currentIndex));
    return events;
};

const createAudioElements = (): Partial<Record<GameSoundEffectId, HTMLAudioElement>> => {
    if (typeof Audio === 'undefined') {
        return {};
    }

    return Object.fromEntries(
        Object.entries(GAME_SOUND_EFFECT_PATHS).map(([effect, path]) => {
            const audio = new Audio(path);
            audio.preload = 'auto';
            audio.volume = SOUND_VOLUME;
            return [effect, audio];
        })
    ) as Partial<Record<GameSoundEffectId, HTMLAudioElement>>;
};

const getPlayableAudioElements = (
    audioElements: Partial<Record<GameSoundEffectId, HTMLAudioElement>>
): HTMLAudioElement[] =>
    Object.values(audioElements).filter((audio): audio is HTMLAudioElement => Boolean(audio));

const restoreUnlockedAudio = (audio: HTMLAudioElement, muted: boolean, volume: number) => {
    audio.pause();
    audio.currentTime = 0;
    audio.muted = muted;
    audio.volume = volume;
};

const unlockAudioElements = (
    audioElements: Partial<Record<GameSoundEffectId, HTMLAudioElement>>
): Promise<void> => {
    const elements = getPlayableAudioElements(audioElements);

    if (elements.length === 0) {
        return Promise.resolve();
    }

    return Promise.all(
        elements.map((audio) => {
            const previousMuted = audio.muted;
            const previousVolume = audio.volume;

            audio.muted = true;
            audio.volume = 0;
            audio.currentTime = 0;

            const playResult = audio.play();
            return playResult
                .then(() => {
                    restoreUnlockedAudio(audio, previousMuted, previousVolume);
                })
                .catch(() => {
                    restoreUnlockedAudio(audio, previousMuted, previousVolume);
                });
        })
    ).then(() => undefined);
};

const playSound = (
    audioElements: Partial<Record<GameSoundEffectId, HTMLAudioElement>>,
    effect: GameSoundEffectId
) => {
    const audio = audioElements[effect];

    if (!audio) {
        return;
    }

    audio.currentTime = 0;
    audio.volume = SOUND_VOLUME;
    void audio.play().catch(() => undefined);
};

export const useGameSoundEffects = ({
    state,
    currentIndex,
    historySource,
    isReviewing,
    enabled,
}: UseGameSoundEffectsParams) => {
    const previousStateRef = useRef<GameState | null>(null);
    const seenEventIdsRef = useRef(new Set<string>());
    const audioElementsRef = useRef<Partial<Record<GameSoundEffectId, HTMLAudioElement>>>({});
    const audioUnlockedRef = useRef(false);
    const unlockInFlightRef = useRef(false);

    useEffect(() => {
        audioElementsRef.current = createAudioElements();
        return () => {
            audioElementsRef.current = {};
            audioUnlockedRef.current = false;
            unlockInFlightRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (!enabled || typeof window === 'undefined') {
            return undefined;
        }

        const unlockOnUserGesture = () => {
            if (audioUnlockedRef.current || unlockInFlightRef.current) {
                return;
            }

            unlockInFlightRef.current = true;
            void unlockAudioElements(audioElementsRef.current).then(() => {
                audioUnlockedRef.current = true;
                unlockInFlightRef.current = false;
                window.removeEventListener('pointerdown', unlockOnUserGesture, true);
                window.removeEventListener('keydown', unlockOnUserGesture, true);
                window.removeEventListener('touchstart', unlockOnUserGesture, true);
            });
        };

        window.addEventListener('pointerdown', unlockOnUserGesture, true);
        window.addEventListener('keydown', unlockOnUserGesture, true);
        window.addEventListener('touchstart', unlockOnUserGesture, true);

        return () => {
            window.removeEventListener('pointerdown', unlockOnUserGesture, true);
            window.removeEventListener('keydown', unlockOnUserGesture, true);
            window.removeEventListener('touchstart', unlockOnUserGesture, true);
        };
    }, [enabled]);

    useEffect(() => {
        const previousState = previousStateRef.current;
        const nextEvents = deriveGameSoundEffectEvents(
            previousState,
            state,
            currentIndex,
            historySource,
            isReviewing
        );
        previousStateRef.current = state;

        if (!enabled || nextEvents.length === 0) {
            return;
        }

        for (const event of nextEvents) {
            const dedupeKey = `${historySource}:${currentIndex}:${event.id}`;
            if (seenEventIdsRef.current.has(dedupeKey)) {
                continue;
            }

            seenEventIdsRef.current.add(dedupeKey);
            playSound(audioElementsRef.current, event.effect);
        }
    }, [currentIndex, enabled, historySource, isReviewing, state]);
};
