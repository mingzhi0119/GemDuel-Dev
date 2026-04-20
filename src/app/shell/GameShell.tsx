import { TopBar } from '../../components/TopBar';
import { UpdateNotification } from '../../components/UpdateNotification';
import { AppChrome } from '../chrome/AppChrome';
import { AppOverlayStack } from '../overlays/AppOverlayStack';
import type { AppRouteProps } from '../../types';
import { GamePlaySurface } from './GamePlaySurface';
import { PlayerRail } from './PlayerRail';
import { createGameShellStyles } from './gameShellStyles';

export function GameShell({
    appVersion,
    game,
    layout,
    theme,
    ui,
    setters,
    callbacks,
}: AppRouteProps) {
    const { state, handlers, getters, historyControls, online } = game;
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
    const localPlayer = online.isHost ? 'p1' : 'p2';
    const canShowDebug =
        state.mode !== 'ONLINE_MULTIPLAYER' &&
        (state.mode === 'PVE' || historyControls.historyLength === 0 || ui.showDebug);

    const {
        lightShellStyle,
        scaledZoneWrapperStyle,
        playMatSurfaceStyle,
        playMatDividerStyle,
        playerRailStyle,
    } = createGameShellStyles(theme, layout);

    return (
        <div
            className={`relative h-full w-full font-sans flex flex-col overflow-hidden transition-colors duration-500 pt-safe pb-safe pl-safe pr-safe
            ${theme === 'dark' ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f111a] to-black text-slate-200' : 'text-stone-800'}
        `}
            style={theme === 'light' ? lightShellStyle : undefined}
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
            />

            <PlayerRail
                game={game}
                theme={theme}
                effectiveGameMode={effectiveGameMode}
                scaledZoneWrapperStyle={scaledZoneWrapperStyle}
                playerRailStyle={playerRailStyle}
                isP1ZoneActive={isP1ZoneActive}
                isP2ZoneActive={isP2ZoneActive}
            />
        </div>
    );
}
