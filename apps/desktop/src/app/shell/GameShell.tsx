import { useMemo, useState } from 'react';
import { CardPreviewOverlay } from '@gemduel/ui/components/CardPreviewOverlay';
import { TopBar } from '@gemduel/ui/components/TopBar';
import { UpdateNotification } from '@gemduel/ui/components/UpdateNotification';
import { READABILITY_HUD_TREATMENT } from '@gemduel/ui/components/readabilityHudStyles';
import { useLocale, useT } from '@gemduel/ui/i18n/LocaleProvider';
import type { AppRouteProps } from '@app/types/ui';
import { useGameSoundEffects } from '../audio/useGameSoundEffects';
import { AppChrome } from '../chrome/AppChrome';
import { AppOverlayStack } from '../overlays/AppOverlayStack';
import { PresentationLayer } from '../presentation/PresentationLayer';
import {
    usePresentationEvents,
    type PresentationController,
} from '../presentation/usePresentationEvents';
import { GamePlaySurface } from './GamePlaySurface';
import { PlayerRail } from './PlayerRail';
import { createGameShellStyles } from './gameShellStyles';
import {
    createPreviewPresentationEvent,
    getPresentationPreviewMode,
    getShouldHoldPresentationPreviewIntro,
    type PresentationPreviewStage,
} from './presentationPreview';
import { getShouldShowGemPanelCalibrationOverlay } from './surfacePreviewQuery';
import { useGameShellPreviewController } from './useGameShellPreviewController';
import { createMultiplayerViewForPlayer } from '@gemduel/shared/logic/multiplayerVisibility';

export function GameShell({
    appVersion,
    game,
    layout,
    theme,
    surfaceTheme,
    ui,
    setters,
    callbacks,
}: AppRouteProps) {
    const { state, handlers, getters, historyControls } = game;
    const { turn, winner, phase, playerTurnCounts = { p1: 0, p2: 0 }, playerBuffs } = state;
    const {
        handleDebugAddCrowns,
        handleDebugAddPoints,
        handleDebugAddPrivilege,
        handleForceRoyal,
        handleSelectBonusColor,
    } = handlers;
    const { getPlayerScore, getCrownCount, canAfford, isMyTurn } = getters;
    const { locale } = useLocale();
    const t = useT();
    const readabilityTreatment = true;

    const isP1ZoneActive = turn === 'p1' && !ui.isReviewing && !winner;
    const isP2ZoneActive = turn === 'p2' && !ui.isReviewing && !winner;
    const effectiveGameMode = ui.isReviewing ? 'REVIEW' : winner ? 'GAME_OVER' : phase;
    const localPlayer = state.localPlayer;
    const playerRailState = useMemo<typeof state>(() => {
        if (state.mode !== 'ONLINE_MULTIPLAYER') {
            return state;
        }

        return {
            ...state,
            ...createMultiplayerViewForPlayer(state, localPlayer),
        };
    }, [localPlayer, state]);
    const playerRailGame = useMemo(
        () => ({
            ...game,
            state: playerRailState,
        }),
        [game, playerRailState]
    );
    const showLanVisibilitySettings =
        ui.matchmakingRoute === 'lan' && state.mode === 'ONLINE_MULTIPLAYER';
    const presentation = usePresentationEvents({
        state,
        currentIndex: historyControls.currentIndex,
        historySource: historyControls.historySource,
        isReviewing: ui.isReviewing,
    });
    useGameSoundEffects({
        state,
        currentIndex: historyControls.currentIndex,
        historySource: historyControls.historySource,
        isReviewing: ui.isReviewing,
        enabled: ui.soundEnabled,
    });
    const presentationPreviewMode = useMemo(getPresentationPreviewMode, []);
    const shouldHoldPresentationPreviewIntro = useMemo(getShouldHoldPresentationPreviewIntro, []);
    const showGemPanelCalibrationOverlay = useMemo(getShouldShowGemPanelCalibrationOverlay, []);
    const [presentationPreviewStage, setPresentationPreviewStage] =
        useState<PresentationPreviewStage>(
            presentationPreviewMode === 'royal-unlock' ? 'intro' : null
        );
    const previewPresentation = useMemo<PresentationController | null>(() => {
        if (!presentationPreviewMode) {
            return null;
        }

        if (presentationPreviewMode !== 'royal-unlock') {
            const activeEvent = createPreviewPresentationEvent(
                presentationPreviewMode,
                state,
                historyControls.currentIndex
            );

            if (!activeEvent) {
                return null;
            }

            return {
                activeEvent:
                    activeEvent.type === 'market-refill' || activeEvent.type === 'turn-handoff'
                        ? null
                        : activeEvent,
                activeMarketRefillEvent: activeEvent.type === 'market-refill' ? activeEvent : null,
                activeTurnHandoffEvent: activeEvent.type === 'turn-handoff' ? activeEvent : null,
                activeStage: 'pulse',
                queuedEventCount: 0,
                isBlockingRoyalSelection: false,
                pendingReservedCardIds: [],
                pendingMarketRefillSlots:
                    activeEvent.type === 'market-refill'
                        ? activeEvent.slots.slice(0, 1).map((slot) => ({
                              level: slot.level,
                              index: slot.index,
                              nextCardId: slot.nextCardId,
                          }))
                        : [],
                completeIntro: () => {},
                completeEvent: () => setPresentationPreviewStage(null),
                cancelEvent: () => setPresentationPreviewStage(null),
            };
        }

        if (!presentationPreviewStage) {
            return null;
        }

        return {
            activeEvent: {
                id: `royal-unlock:preview:${state.turn}:forced`,
                type: 'royal-unlock',
                player: state.turn,
                milestone: 'forced',
                createdAtIndex: historyControls.currentIndex,
            },
            activeMarketRefillEvent: null,
            activeTurnHandoffEvent: null,
            activeStage: presentationPreviewStage,
            queuedEventCount: 0,
            isBlockingRoyalSelection: true,
            pendingReservedCardIds: [],
            pendingMarketRefillSlots: [],
            completeIntro: () => {
                if (!shouldHoldPresentationPreviewIntro) {
                    setPresentationPreviewStage('selection');
                }
            },
            completeEvent: () => setPresentationPreviewStage(null),
            cancelEvent: () => setPresentationPreviewStage(null),
        };
    }, [
        historyControls.currentIndex,
        presentationPreviewMode,
        presentationPreviewStage,
        shouldHoldPresentationPreviewIntro,
        state,
    ]);
    const effectivePresentation = previewPresentation ?? presentation;
    const canShowDebug =
        state.mode !== 'ONLINE_MULTIPLAYER' &&
        (state.mode === 'PVE' || historyControls.historyLength === 0 || ui.showDebug);

    const {
        shellStyle,
        topBarSurfaceStyle,
        scaledZoneWrapperStyle,
        playerRailStyle,
        gemBoardSurfaceStyle,
        gemPanelSkin,
        marketSurfaceStyle,
        marketDeckBackArtwork,
        shellSurfaceVariant,
        topBarSurfaceVariant,
    } = createGameShellStyles(theme, layout, surfaceTheme);
    const {
        buffPreviewActions,
        closeCardPreview,
        handleClosePeekPreview,
        isCardPreviewOpen,
        peekPreviewModel,
        previewDeckReserve,
        previewMarketCard,
        previewModel,
        previewPlayerStack,
        previewRoyalCard,
    } = useGameShellPreviewController({
        state,
        handlers,
        canAfford,
        effectiveGameMode,
        localPlayer,
        locale,
        t,
        theme,
        marketDeckBackArtwork,
        isReviewing: ui.isReviewing,
        canInteract: isMyTurn,
    });

    return (
        <div
            data-surface-slot="app-background"
            data-surface-variant={shellSurfaceVariant}
            data-main-game-readability={
                readabilityTreatment ? READABILITY_HUD_TREATMENT : undefined
            }
            className={`relative h-full w-full font-sans grid grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden transition-colors duration-500 ${
                theme === 'dark' ? 'text-slate-200' : 'text-stone-800'
            }`}
            style={shellStyle}
        >
            <UpdateNotification />

            <div
                className={`absolute bottom-2 right-3 z-[100] pointer-events-none select-none font-mono text-[10px] opacity-60 whitespace-nowrap ${
                    theme === 'dark' ? 'text-slate-400' : 'text-stone-600'
                }`}
            >
                v{appVersion}
            </div>

            <TopBar
                p1Score={getPlayerScore('p1')}
                p1Crowns={getCrownCount('p1')}
                p2Score={getPlayerScore('p2')}
                p2Crowns={getCrownCount('p2')}
                playerTurnCounts={playerTurnCounts}
                activePlayer={turn}
                playerBuffs={playerBuffs}
                theme={theme}
                surfaceStyle={topBarSurfaceStyle}
                surfaceVariant={topBarSurfaceVariant}
                localPlayer={localPlayer}
                isOnline={state.mode === 'ONLINE_MULTIPLAYER'}
                readabilityTreatment={readabilityTreatment}
            />

            <AppChrome
                theme={theme}
                showDebug={ui.showDebug}
                canShowDebug={canShowDebug}
                onToggleDebug={() => setters.setShowDebug((current) => !current)}
                onDownloadReplay={callbacks.handleDownloadReplay}
                onUploadReplay={callbacks.handleUploadReplay}
                onRequestRestart={() => setters.setShowRestartConfirm(true)}
                onShowRulebook={() => setters.setShowRulebook(true)}
                onAddCrowns={handleDebugAddCrowns}
                onAddPoints={handleDebugAddPoints}
                onAddPrivilege={handleDebugAddPrivilege}
                onForceRoyal={handleForceRoyal}
                showDebugPanels={ui.showDebug && state.mode !== 'ONLINE_MULTIPLAYER'}
                surfaceTheme={surfaceTheme}
                onSelectSurfaceTheme={callbacks.selectSurfaceTheme}
                soundEnabled={ui.soundEnabled}
                onToggleSound={() => setters.setSoundEnabled((current) => !current)}
                showLanVisibilitySettings={showLanVisibilitySettings}
                lanShowOpponentPlayerZoneCards={ui.lanShowOpponentPlayerZoneCards ?? true}
                lanShowOpponentGems={ui.lanShowOpponentGems ?? true}
                onSetLanShowOpponentPlayerZoneCards={setters.setLanShowOpponentPlayerZoneCards}
                onSetLanShowOpponentGems={setters.setLanShowOpponentGems}
            />

            <AppOverlayStack
                theme={theme}
                showRulebook={ui.showRulebook}
                persistentWinner={ui.persistentWinner}
                isReviewing={ui.isReviewing}
                showRestartConfirm={ui.showRestartConfirm}
                phase={phase}
                isPeekingBoard={ui.isPeekingBoard}
                onCloseRulebook={() => setters.setShowRulebook(false)}
                onStartReview={() => setters.setIsReviewing(true)}
                onStopReview={() => setters.setIsReviewing(false)}
                onCancelRestart={() => setters.setShowRestartConfirm(false)}
                onConfirmRestart={callbacks.handleRestart}
                onStartBoardPeek={() => setters.setIsPeekingBoard(true)}
                onStopBoardPeek={() => setters.setIsPeekingBoard(false)}
                onSelectBonusColor={handleSelectBonusColor}
            />

            <CardPreviewOverlay
                isOpen={isCardPreviewOpen}
                mode={previewModel.mode}
                cards={previewModel.cards}
                theme={theme}
                player={previewModel.player}
                color={previewModel.color}
                title={previewModel.title}
                previewContent={previewModel.previewContent}
                actions={previewModel.actions}
                cardActions={previewModel.cardActions}
                onClose={closeCardPreview}
            />

            <CardPreviewOverlay
                isOpen={peekPreviewModel.isOpen}
                mode="collection"
                cards={peekPreviewModel.cards}
                theme={theme}
                title={peekPreviewModel.title}
                previewContent={peekPreviewModel.previewContent}
                actions={[]}
                collectionLayout={peekPreviewModel.collectionLayout}
                deckBackArtwork={marketDeckBackArtwork}
                onClose={handleClosePeekPreview}
            />

            <PresentationLayer
                presentation={effectivePresentation}
                royalDeck={state.royalDeck}
                theme={theme}
                onSelectRoyal={
                    previewPresentation
                        ? () => setPresentationPreviewStage(null)
                        : handlers.handleSelectRoyal
                }
                marketDeckBackArtwork={marketDeckBackArtwork}
            />

            <GamePlaySurface
                game={game}
                layout={layout}
                theme={theme}
                effectiveGameMode={effectiveGameMode}
                localPlayer={localPlayer}
                gemBoardSurfaceStyle={gemBoardSurfaceStyle}
                gemPanelSkin={gemPanelSkin}
                marketSurfaceStyle={marketSurfaceStyle}
                marketDeckBackArtwork={marketDeckBackArtwork}
                isRoyalSelectionBlocked={effectivePresentation.isBlockingRoyalSelection}
                showGemPanelCalibrationOverlay={showGemPanelCalibrationOverlay}
                pendingMarketRefillSlots={effectivePresentation.pendingMarketRefillSlots}
                onPreviewCard={previewMarketCard}
                onPreviewDeckReserve={previewDeckReserve}
                onPreviewRoyal={previewRoyalCard}
                readabilityTreatment={readabilityTreatment}
                showReplayControls={ui.isReviewing}
            />

            <PlayerRail
                game={playerRailGame}
                theme={theme}
                effectiveGameMode={effectiveGameMode}
                scaledZoneWrapperStyle={scaledZoneWrapperStyle}
                playerRailStyle={playerRailStyle}
                isP1ZoneActive={isP1ZoneActive}
                isP2ZoneActive={isP2ZoneActive}
                playerZoneSurfaceVariant={surfaceTheme?.playerZone}
                pendingReservedCardIds={effectivePresentation.pendingReservedCardIds}
                onPreviewStack={previewPlayerStack}
                buffPreviewActions={buffPreviewActions}
                readabilityTreatment={readabilityTreatment}
                lanOpponentVisibilityPreferences={
                    showLanVisibilitySettings
                        ? {
                              showOpponentPlayerZoneCards:
                                  ui.lanShowOpponentPlayerZoneCards ?? true,
                              showOpponentGems: ui.lanShowOpponentGems ?? true,
                          }
                        : undefined
                }
            />
        </div>
    );
}
