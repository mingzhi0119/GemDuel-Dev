import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PresentationLayer } from '../presentation/PresentationLayer';
import type { PresentationController } from '../presentation/usePresentationEvents';
import type { PresentationEvent } from '../presentation/presentationTypes';
import { GamePlaySurface } from '../shell/GamePlaySurface';
import { PlayerRail } from '../shell/PlayerRail';
import { TopBar } from '@gemduel/ui/components/TopBar';
import type { AppRouteProps, ThemeName } from '@app/types/ui';
import { useSurfaceLabCatalog } from './useSurfaceLabCatalog';
import { createVisualLabShellStyles } from './visualLabStyles';
import {
    SURFACE_LAB_SLOTS,
    type SurfaceLabAssetSet,
    type SurfaceLabCandidate,
    type SurfaceLabSlot,
    type VisualLabMode,
} from './surfaceLabTypes';
import {
    createSurfaceLabPresentationEvent,
    type SurfaceLabMotionEventType,
    type SurfaceLabMotionOptions,
} from './motionLabEvents';
import { VisualLabConsole } from './VisualLabConsole';

interface VisualLabRouteProps extends AppRouteProps {
    mode: VisualLabMode;
}

const getAssetSlots = (
    selectedSet: SurfaceLabAssetSet,
    assetSets: readonly SurfaceLabAssetSet[],
    slotOverrides: Partial<Record<SurfaceLabSlot, string>>
): Record<SurfaceLabSlot, SurfaceLabCandidate> =>
    SURFACE_LAB_SLOTS.reduce<Record<SurfaceLabSlot, SurfaceLabCandidate>>(
        (acc, slot) => {
            const overrideSet = assetSets.find((set) => set.id === slotOverrides[slot]);
            acc[slot] = (overrideSet ?? selectedSet).slots[slot];
            return acc;
        },
        {} as Record<SurfaceLabSlot, SurfaceLabCandidate>
    );

const createInitialMotionOptions = (): SurfaceLabMotionOptions => ({
    player: 'p1',
    marketLevel: 1,
    marketIndex: 0,
    deckLevel: 1,
    gemColor: 'blue',
    row: 2,
    col: 2,
    callout: 'ability-resolution',
    message: 'Preview',
    milestone: 'forced',
    nonce: 0,
});

const getVisualLabEventTimeoutMs = (event: PresentationEvent, mode: VisualLabMode): number => {
    if (mode !== 'motion') {
        return event.type === 'turn-handoff' ? 3400 : event.type === 'market-refill' ? 1600 : 1400;
    }

    switch (event.type) {
        case 'turn-handoff':
            return 9800;
        case 'market-refill':
            return 3800;
        case 'ability-callout':
            return 4200;
        case 'card-acquire':
        case 'card-reserve':
            return 3200;
        case 'gem-flight':
        case 'gem-drop':
        case 'gem-steal':
        case 'gem-discard':
            return 2800;
        default:
            return 1800;
    }
};

export function VisualLabRoute(props: VisualLabRouteProps) {
    const { mode, game, layout, appVersion } = props;
    const { state, handlers, getters, historyControls } = game;
    const didStartFixtureRef = useRef(false);
    const motionNonceRef = useRef(0);
    const lastMotionTypeRef = useRef<SurfaceLabMotionEventType>('royal-unlock');
    const labTheme: ThemeName = props.theme;
    const catalog = useSurfaceLabCatalog(labTheme);
    const [selectedSetId, setSelectedSetId] = useState('');
    const [slotOverrides, setSlotOverrides] = useState<Partial<Record<SurfaceLabSlot, string>>>({});
    const [activeEvent, setActiveEvent] = useState<PresentationEvent | null>(null);
    const [royalStage, setRoyalStage] = useState<'intro' | 'selection' | 'pulse'>('pulse');
    const [holdRoyalIntro, setHoldRoyalIntro] = useState(false);
    const [motionType, setMotionType] = useState<SurfaceLabMotionEventType>('royal-unlock');
    const [motionOptions, setMotionOptions] = useState<SurfaceLabMotionOptions>(
        createInitialMotionOptions
    );

    useEffect(() => {
        if (didStartFixtureRef.current || historyControls.historyLength > 0) {
            return;
        }

        didStartFixtureRef.current = true;
        handlers.startGame('LOCAL_PVP', { useBuffs: false });
    }, [handlers, historyControls.historyLength]);

    useEffect(() => {
        if (
            catalog.assetSets.length > 0 &&
            !catalog.assetSets.some((set) => set.id === selectedSetId)
        ) {
            setSelectedSetId(catalog.assetSets[0].id);
        }
    }, [catalog.assetSets, selectedSetId]);

    const selectedSet =
        catalog.assetSets.find((set) => set.id === selectedSetId) ?? catalog.assetSets[0];
    const assetSlots = useMemo(
        () => getAssetSlots(selectedSet, catalog.assetSets, slotOverrides),
        [catalog.assetSets, selectedSet, slotOverrides]
    );
    const playerZoneSideSlots = useMemo(() => {
        const playerZoneSet =
            catalog.assetSets.find((set) => set.id === slotOverrides['player-zone']) ?? selectedSet;

        return playerZoneSet?.playerZoneSideSlots ?? {};
    }, [catalog.assetSets, selectedSet, slotOverrides]);
    const styles = useMemo(
        () => createVisualLabShellStyles(labTheme, layout, assetSlots, playerZoneSideSlots),
        [assetSlots, labTheme, layout, playerZoneSideSlots]
    );
    const triggerMotion = useCallback(
        (type: SurfaceLabMotionEventType = motionType) => {
            motionNonceRef.current += 1;
            const event = createSurfaceLabPresentationEvent(type, state, {
                ...motionOptions,
                nonce: motionNonceRef.current,
            });

            if (!event) {
                return;
            }

            lastMotionTypeRef.current = type;
            setActiveEvent(event);
            setRoyalStage(event.type === 'royal-unlock' ? 'intro' : 'pulse');
        },
        [motionOptions, motionType, state]
    );

    useEffect(() => {
        if (!activeEvent || activeEvent.type === 'royal-unlock') {
            return undefined;
        }

        const timeoutMs = getVisualLabEventTimeoutMs(activeEvent, mode);
        const timeout = window.setTimeout(() => {
            setActiveEvent((current) => (current?.id === activeEvent.id ? null : current));
        }, timeoutMs);

        return () => window.clearTimeout(timeout);
    }, [activeEvent, mode]);

    const presentation = useMemo<PresentationController>(
        () => ({
            activeEvent:
                activeEvent &&
                activeEvent.type !== 'market-refill' &&
                activeEvent.type !== 'turn-handoff'
                    ? activeEvent
                    : null,
            activeMarketRefillEvent: activeEvent?.type === 'market-refill' ? activeEvent : null,
            activeTurnHandoffEvent: activeEvent?.type === 'turn-handoff' ? activeEvent : null,
            activeStage: activeEvent?.type === 'royal-unlock' ? royalStage : 'pulse',
            queuedEventCount: 0,
            isBlockingRoyalSelection: activeEvent?.type === 'royal-unlock',
            pendingReservedCardIds: activeEvent?.type === 'card-reserve' ? activeEvent.cardIds : [],
            pendingMarketRefillSlots:
                activeEvent?.type === 'market-refill'
                    ? activeEvent.slots.map((slot) => ({
                          level: slot.level,
                          index: slot.index,
                          nextCardId: slot.nextCardId,
                      }))
                    : [],
            completeIntro: () => {
                if (!holdRoyalIntro) {
                    setRoyalStage('selection');
                }
            },
            completeEvent: (eventId) => {
                setActiveEvent((current) => (current?.id === eventId ? null : current));
            },
            cancelEvent: () => setActiveEvent(null),
        }),
        [activeEvent, holdRoyalIntro, royalStage]
    );

    if (!selectedSet) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-slate-950 text-slate-100">
                Loading Visual Lab
            </div>
        );
    }

    return (
        <div
            data-testid="visual-lab-route"
            data-visual-lab-mode={mode}
            className="relative grid h-full w-full grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden font-sans text-slate-200"
            style={styles.shellStyle}
        >
            <div className="absolute bottom-2 right-3 z-[100] pointer-events-none select-none font-mono text-[10px] opacity-60 text-slate-300">
                v{appVersion} / Visual Lab
            </div>

            <TopBar
                p1Score={getters.getPlayerScore('p1')}
                p1Crowns={getters.getCrownCount('p1')}
                p2Score={getters.getPlayerScore('p2')}
                p2Crowns={getters.getCrownCount('p2')}
                playerTurnCounts={state.playerTurnCounts ?? { p1: 0, p2: 0 }}
                activePlayer={state.turn}
                playerBuffs={state.playerBuffs}
                theme={labTheme}
                surfaceStyle={styles.topBarSurfaceStyle}
                surfaceVariant={styles.topBarSurfaceVariant}
                localPlayer={state.localPlayer}
                isOnline={false}
            />

            <div className="min-h-0">
                <GamePlaySurface
                    game={game}
                    layout={layout}
                    theme={labTheme}
                    effectiveGameMode={state.phase}
                    localPlayer={state.localPlayer}
                    gemBoardSurfaceStyle={styles.gemBoardSurfaceStyle}
                    gemPanelSkin={styles.gemPanelSkin}
                    marketSurfaceStyle={styles.marketSurfaceStyle}
                    marketDeckBackArtwork={styles.marketDeckBackArtwork}
                    isRoyalSelectionBlocked={presentation.isBlockingRoyalSelection}
                    pendingMarketRefillSlots={presentation.pendingMarketRefillSlots}
                />
            </div>

            <PlayerRail
                game={game}
                theme={labTheme}
                effectiveGameMode={state.phase}
                scaledZoneWrapperStyle={styles.scaledZoneWrapperStyle}
                playerRailStyle={styles.playerRailStyle}
                isP1ZoneActive={state.turn === 'p1'}
                isP2ZoneActive={state.turn === 'p2'}
                playerZoneSurfaceVariant="none"
                playerZoneSurfaceStyleOverride={styles.playerZoneSurfaceStyle}
                playerZoneSurfaceArtworkOverride={styles.playerZoneSurfaceArtwork}
                pendingReservedCardIds={presentation.pendingReservedCardIds}
            />

            <PresentationLayer
                presentation={presentation}
                royalDeck={state.royalDeck}
                theme={labTheme}
                onSelectRoyal={() => setActiveEvent(null)}
                marketDeckBackArtwork={styles.marketDeckBackArtwork}
                previewMode={mode === 'motion' ? 'slow' : undefined}
            />

            <VisualLabConsole
                mode={mode}
                catalogStatus={catalog.status}
                catalogError={catalog.error}
                assetSets={catalog.assetSets}
                selectedSet={selectedSet}
                selectedSetId={selectedSet.id}
                setSelectedSetId={setSelectedSetId}
                slotOverrides={slotOverrides}
                setSlotOverrides={setSlotOverrides}
                assetSlots={assetSlots}
                styles={styles}
                activeEvent={activeEvent}
                motionType={motionType}
                setMotionType={setMotionType}
                motionOptions={motionOptions}
                setMotionOptions={setMotionOptions}
                holdRoyalIntro={holdRoyalIntro}
                setHoldRoyalIntro={setHoldRoyalIntro}
                onTriggerMotion={() => triggerMotion()}
                onRepeatMotion={() => triggerMotion(lastMotionTypeRef.current)}
                onClearMotion={() => setActiveEvent(null)}
            />
        </div>
    );
}
