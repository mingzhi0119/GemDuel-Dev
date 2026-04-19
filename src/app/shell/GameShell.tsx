import type { CSSProperties } from 'react';
import { ReplayControls } from '../../components/ReplayControls';
import { RoyalCourt } from '../../components/RoyalCourt';
import { Market } from '../../components/Market';
import { StatusBar } from '../../components/StatusBar';
import { GameBoard } from '../../components/GameBoard';
import { GameActions } from '../../components/GameActions';
import { PlayerZone } from '../../components/PlayerZone';
import { TopBar } from '../../components/TopBar';
import { UpdateNotification } from '../../components/UpdateNotification';
import { AppChrome } from '../chrome/AppChrome';
import { AppOverlayStack } from '../overlays/AppOverlayStack';
import type { AppRouteProps } from '../types';

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
        board,
        bag,
        turn,
        selectedGems,
        errorMsg,
        winner,
        phase,
        bonusGemTarget,
        decks,
        market,
        inventories,
        privileges,
        playerTableau,
        playerReserved,
        playerTurnCounts = { p1: 0, p2: 0 },
        royalDeck,
        playerRoyals,
        lastFeedback,
        playerBuffs,
        activeModal,
        extraPrivileges,
    } = state;
    const {
        handleSelfGemClick,
        handleGemClick,
        handleOpponentGemClick,
        handleConfirmTake,
        handleReplenish,
        handleReserveCard,
        handleReserveDeck,
        handleDiscardReserved,
        initiateBuy,
        handleSelectRoyal,
        handleCancelReserve,
        handleCancelPrivilege,
        activatePrivilegeMode,
        checkAndInitiateBuyReserved,
        handleDebugAddCrowns,
        handleDebugAddPoints,
        handleDebugAddPrivilege,
        handleForceRoyal,
        handleSelectBonusColor,
        handleCloseModal,
        handlePeekDeck,
    } = handlers;
    const { getPlayerScore, isSelected, getCrownCount, isMyTurn } = getters;

    const isP1ZoneActive = turn === 'p1' && !ui.isReviewing && !winner;
    const isP2ZoneActive = turn === 'p2' && !ui.isReviewing && !winner;
    const effectiveGameMode = ui.isReviewing ? 'REVIEW' : winner ? 'GAME_OVER' : phase;
    const localPlayer = online.isHost ? 'p1' : 'p2';
    const canShowDebug =
        state.mode !== 'ONLINE_MULTIPLAYER' &&
        (state.mode === 'PVE' || historyControls.historyLength === 0 || ui.showDebug);

    const lightShellStyle = {
        '--surface-base': '#F4F7F6',
        '--surface-base-edge': '#EEF2F1',
        '--surface-subtle': 'rgba(255,255,255,0.44)',
        '--surface-divider': 'rgba(15,23,42,0.06)',
        '--surface-shadow': '0 12px 30px rgba(15,23,42,0.06)',
        '--surface-inset':
            'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -8px 16px rgba(15,23,42,0.03)',
        backgroundColor: 'var(--surface-base)',
        backgroundImage:
            'radial-gradient(circle at 50% 42%, #FBFCFC 0%, #F4F7F6 58%, #EEF2F1 100%)',
    } as CSSProperties;
    const scaledZoneWrapperStyle = {
        width: `${100 / layout.zoneScale}%`,
        height: `${100 / layout.zoneScale}%`,
        transform: `scale(${layout.zoneScale})`,
        transformOrigin: 'center center',
    } as const;
    const playMatSurfaceStyle =
        theme === 'light'
            ? ({
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--surface-divider)',
                  boxShadow: 'var(--surface-shadow), var(--surface-inset)',
              } as CSSProperties)
            : ({
                  background: 'rgba(15,23,42,0.18)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 18px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.03)',
              } as CSSProperties);
    const playMatDividerStyle =
        theme === 'light'
            ? ({ backgroundColor: 'rgba(15,23,42,0.06)' } as CSSProperties)
            : ({ backgroundColor: 'rgba(148,163,184,0.12)' } as CSSProperties);
    const playerRailStyle = {
        height: `${layout.zoneHeightPx}px`,
        ...(theme === 'light'
            ? {
                  background:
                      'linear-gradient(180deg, rgba(251,252,252,0.78) 0%, rgba(244,247,246,0.92) 100%)',
                  borderTop: '1px solid rgba(15,23,42,0.08)',
                  boxShadow: '0 -10px 20px rgba(15,23,42,0.04)',
              }
            : {
                  borderTop: '1px solid rgba(255,255,255,0.06)',
              }),
    } as CSSProperties;

    return (
        <div
            className={`h-screen w-screen font-sans flex flex-col overflow-hidden transition-colors duration-500 pt-safe pb-safe pl-safe pr-safe 
            ${theme === 'dark' ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f111a] to-black text-slate-200' : 'text-stone-800'}
        `}
            style={theme === 'light' ? lightShellStyle : undefined}
        >
            <UpdateNotification />

            <div
                className={`fixed bottom-2 right-3 z-[100] pointer-events-none select-none font-mono text-[10px] opacity-60 whitespace-nowrap ${
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

            <div className="flex-1 flex items-center justify-center min-h-0 relative z-30 px-4 pt-20 lg:pt-24 pb-6 lg:pb-8 transition-all duration-500">
                <div
                    className="relative shrink-0 transition-all duration-500"
                    style={{
                        transform: `scale(${layout.boardScale})`,
                        transformOrigin: 'center center',
                    }}
                >
                    <div
                        className="absolute inset-0 rounded-[24px] pointer-events-none"
                        style={playMatSurfaceStyle}
                    />
                    <div
                        className="relative z-10 flex flex-col lg:flex-row items-center justify-center px-5 py-4 lg:px-6 lg:py-5 transition-all duration-500"
                        style={{ gap: `${layout.mainGapPx}px` }}
                    >
                        <div
                            className="relative z-10 flex flex-row lg:flex-col items-center gap-4 shrink-0"
                            style={{
                                transform: `scale(${layout.deckScale})`,
                                transformOrigin: 'center center',
                            }}
                        >
                            <Market
                                market={market}
                                decks={decks}
                                phase={effectiveGameMode}
                                turn={turn}
                                inventories={inventories}
                                playerTableau={playerTableau}
                                playerBuffs={playerBuffs}
                                handleReserveDeck={handleReserveDeck}
                                initiateBuy={initiateBuy}
                                handleReserveCard={handleReserveCard}
                                onPeekDeck={handlePeekDeck}
                                theme={theme}
                                isOnline={state.mode === 'ONLINE_MULTIPLAYER'}
                                localPlayer={localPlayer}
                            />
                        </div>

                        <div
                            className="hidden lg:block self-stretch w-px my-6 rounded-full"
                            style={playMatDividerStyle}
                        />

                        <div className="relative z-10 flex flex-col items-center shrink-0">
                            <div className="h-12 w-full flex items-center justify-center">
                                <StatusBar
                                    errorMsg={errorMsg}
                                    isOnline={state.mode === 'ONLINE_MULTIPLAYER'}
                                    connectionStatus={online.connectionStatus}
                                />
                            </div>

                            <GameBoard
                                board={board}
                                handleGemClick={handleGemClick}
                                isSelected={isSelected}
                                selectedGems={selectedGems}
                                phase={effectiveGameMode}
                                bonusGemTarget={bonusGemTarget}
                                theme={theme}
                                canInteract={isMyTurn}
                            />

                            <div className="h-24 w-full flex items-start justify-center pt-4">
                                <GameActions
                                    handleReplenish={handleReplenish}
                                    bag={bag}
                                    phase={effectiveGameMode}
                                    handleConfirmTake={handleConfirmTake}
                                    selectedGems={selectedGems}
                                    handleCancelReserve={handleCancelReserve}
                                    handleCancelPrivilege={handleCancelPrivilege}
                                    theme={theme}
                                    canInteract={isMyTurn}
                                />
                            </div>
                        </div>

                        <div
                            className="hidden lg:block self-stretch w-px my-6 rounded-full"
                            style={playMatDividerStyle}
                        />

                        <div
                            className="relative z-10 flex flex-row lg:flex-col gap-4 items-center shrink-0"
                            style={{
                                transform: `scale(${layout.deckScale})`,
                                transformOrigin: 'center center',
                            }}
                        >
                            <RoyalCourt
                                royalDeck={royalDeck}
                                phase={effectiveGameMode}
                                handleSelectRoyal={handleSelectRoyal}
                                theme={theme}
                                canInteract={isMyTurn}
                            />
                            <div className="flex flex-col gap-3 items-center p-2 lg:p-3 transition-all duration-500">
                                <ReplayControls
                                    undo={historyControls.undo}
                                    redo={historyControls.redo}
                                    canUndo={
                                        state.mode !== 'ONLINE_MULTIPLAYER' &&
                                        historyControls.canUndo
                                    }
                                    canRedo={
                                        state.mode !== 'ONLINE_MULTIPLAYER' &&
                                        historyControls.canRedo
                                    }
                                    currentIndex={historyControls.currentIndex}
                                    historyLength={historyControls.historyLength}
                                    theme={theme}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={`shrink-0 flex w-full backdrop-blur-xl relative z-20 transition-all duration-500 
                ${theme === 'dark' ? 'bg-black/30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]' : ''}`}
                style={playerRailStyle}
            >
                <div
                    className={`flex-1 relative transition-all duration-500 border-2
                    overflow-hidden flex items-center justify-center
                    ${
                        isP1ZoneActive
                            ? theme === 'dark'
                                ? 'animate-breathe-emerald border-emerald-500/40 bg-emerald-900/20'
                                : 'animate-breathe-emerald border-emerald-200 bg-emerald-50/30'
                            : theme === 'dark'
                              ? 'border-emerald-950/70 bg-emerald-950/10'
                              : 'border-emerald-50 bg-emerald-50/30'
                    }`}
                >
                    <div className="shrink-0" style={scaledZoneWrapperStyle}>
                        <PlayerZone
                            player="p1"
                            inventory={inventories.p1}
                            cards={playerTableau.p1}
                            reserved={playerReserved.p1}
                            royals={playerRoyals.p1}
                            privileges={privileges.p1}
                            extraPrivileges={extraPrivileges?.p1}
                            score={getPlayerScore('p1')}
                            crowns={getCrownCount('p1')}
                            lastFeedback={lastFeedback}
                            isActive={isP1ZoneActive}
                            onBuyReserved={checkAndInitiateBuyReserved}
                            onDiscardReserved={handleDiscardReserved}
                            onUsePrivilege={activatePrivilegeMode}
                            isPrivilegeMode={effectiveGameMode === 'PRIVILEGE_ACTION'}
                            isStealMode={effectiveGameMode === 'STEAL_ACTION' && turn !== 'p1'}
                            isDiscardMode={
                                effectiveGameMode === 'DISCARD_EXCESS_GEMS' && turn === 'p1'
                            }
                            onGemClick={turn === 'p1' ? handleSelfGemClick : handleOpponentGemClick}
                            buff={playerBuffs?.p1}
                            theme={theme}
                        />
                    </div>
                </div>

                <div
                    className={`flex-1 relative transition-all duration-500 border-2
                    overflow-hidden flex items-center justify-center
                    ${
                        isP2ZoneActive
                            ? theme === 'dark'
                                ? 'animate-breathe-blue border-blue-500/40 bg-blue-900/20'
                                : 'animate-breathe-blue border-blue-200 bg-slate-50/30'
                            : theme === 'dark'
                              ? 'border-blue-950/70 bg-blue-950/10'
                              : 'border-blue-50 bg-slate-50/30'
                    }`}
                >
                    <div className="shrink-0" style={scaledZoneWrapperStyle}>
                        <PlayerZone
                            player="p2"
                            inventory={inventories.p2}
                            cards={playerTableau.p2}
                            reserved={playerReserved.p2}
                            royals={playerRoyals.p2}
                            privileges={privileges.p2}
                            extraPrivileges={extraPrivileges?.p2}
                            score={getPlayerScore('p2')}
                            crowns={getCrownCount('p2')}
                            lastFeedback={lastFeedback}
                            isActive={isP2ZoneActive}
                            onBuyReserved={checkAndInitiateBuyReserved}
                            onDiscardReserved={handleDiscardReserved}
                            onUsePrivilege={activatePrivilegeMode}
                            isPrivilegeMode={effectiveGameMode === 'PRIVILEGE_ACTION'}
                            isStealMode={effectiveGameMode === 'STEAL_ACTION' && turn !== 'p2'}
                            isDiscardMode={
                                effectiveGameMode === 'DISCARD_EXCESS_GEMS' && turn === 'p2'
                            }
                            onGemClick={turn === 'p2' ? handleSelfGemClick : handleOpponentGemClick}
                            buff={playerBuffs?.p2}
                            theme={theme}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
