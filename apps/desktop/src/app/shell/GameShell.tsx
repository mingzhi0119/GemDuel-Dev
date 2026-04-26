import { TopBar } from '@gemduel/ui/components/TopBar';
import { UpdateNotification } from '@gemduel/ui/components/UpdateNotification';
import type { AppRouteProps } from '@app/types/ui';
import { AppChrome } from '../chrome/AppChrome';
import { AppOverlayStack } from '../overlays/AppOverlayStack';
import { GamePlaySurface } from './GamePlaySurface';
import { PlayerRail } from './PlayerRail';
import { createGameShellStyles } from './gameShellStyles';

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
    const {
        turn,
        winner,
        phase,
        playerTurnCounts = { p1: 0, p2: 0 },
        playerBuffs,
        activeModal,
    } = state;
    const {
        handleDebugAddCrowns,
        handleDebugAddPoints,
        handleDebugAddPrivilege,
        handleForceRoyal,
        handleSelectBonusColor,
        handleCloseModal,
    } = handlers;
    const { getPlayerScore, getCrownCount } = getters;

    const isP1ZoneActive = turn === 'p1' && !ui.isReviewing && !winner;
    const isP2ZoneActive = turn === 'p2' && !ui.isReviewing && !winner;
    const effectiveGameMode = ui.isReviewing ? 'REVIEW' : winner ? 'GAME_OVER' : phase;
    const localPlayer = state.localPlayer;
    const canShowDebug =
        state.mode !== 'ONLINE_MULTIPLAYER' &&
        (state.mode === 'PVE' || historyControls.historyLength === 0 || ui.showDebug);

    const {
        shellStyle,
        scaledZoneWrapperStyle,
        playMatSurfaceStyle,
        playMatDividerStyle,
        playerRailStyle,
        gemBoardSurfaceStyle,
        gemPanelSkin,
        marketSurfaceStyle,
    } = createGameShellStyles(theme, layout, surfaceTheme);

    return (
        <div
            data-surface-slot="app-background"
            className={`relative h-full w-full font-sans grid grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden transition-colors duration-500 pt-safe pb-safe pl-safe pr-safe ${
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
                localPlayer={localPlayer}
                isOnline={state.mode === 'ONLINE_MULTIPLAYER'}
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
                onToggleTheme={callbacks.toggleTheme}
                onAddCrowns={handleDebugAddCrowns}
                onAddPoints={handleDebugAddPoints}
                onAddPrivilege={handleDebugAddPrivilege}
                onForceRoyal={handleForceRoyal}
                showDebugPanels={ui.showDebug && state.mode !== 'ONLINE_MULTIPLAYER'}
                surfaceTheme={surfaceTheme}
                onSurfaceThemeChange={callbacks.setSurfaceThemeSlot}
                onResetSurfaceTheme={callbacks.resetSurfaceTheme}
            />

            <AppOverlayStack
                theme={theme}
                showRulebook={ui.showRulebook}
                activeModal={activeModal}
                mode={state.mode}
                localPlayer={localPlayer}
                persistentWinner={ui.persistentWinner}
                isReviewing={ui.isReviewing}
                showRestartConfirm={ui.showRestartConfirm}
                phase={phase}
                isPeekingBoard={ui.isPeekingBoard}
                onCloseRulebook={() => setters.setShowRulebook(false)}
                onCloseModal={handleCloseModal}
                onStartReview={() => setters.setIsReviewing(true)}
                onStopReview={() => setters.setIsReviewing(false)}
                onCancelRestart={() => setters.setShowRestartConfirm(false)}
                onConfirmRestart={callbacks.handleRestart}
                onStartBoardPeek={() => setters.setIsPeekingBoard(true)}
                onStopBoardPeek={() => setters.setIsPeekingBoard(false)}
                onSelectBonusColor={handleSelectBonusColor}
            />

            <GamePlaySurface
                game={game}
                layout={layout}
                theme={theme}
                effectiveGameMode={effectiveGameMode}
                localPlayer={localPlayer}
                playMatSurfaceStyle={playMatSurfaceStyle}
                playMatDividerStyle={playMatDividerStyle}
                gemBoardSurfaceStyle={gemBoardSurfaceStyle}
                gemPanelSkin={gemPanelSkin}
                marketSurfaceStyle={marketSurfaceStyle}
            />

            <PlayerRail
                game={game}
                theme={theme}
                effectiveGameMode={effectiveGameMode}
                scaledZoneWrapperStyle={scaledZoneWrapperStyle}
                playerRailStyle={playerRailStyle}
                isP1ZoneActive={isP1ZoneActive}
                isP2ZoneActive={isP2ZoneActive}
                playerZoneSurfaceVariant={surfaceTheme?.playerZone}
            />
        </div>
    );
}
