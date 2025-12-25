import React, { useState } from 'react';

import { PlayerZone } from './components/PlayerZone';
import { DebugPanel } from './components/DebugPanel';
import { ResolutionSwitcher } from './components/ResolutionSwitcher';
import { WinnerModal } from './components/WinnerModal';
import { Market } from './components/Market';
import { GameBoard } from './components/GameBoard';
import { StatusBar } from './components/StatusBar';
import { GameActions } from './components/GameActions';
import { RoyalCourt } from './components/RoyalCourt';

import { useGameLogic } from './hooks/useGameLogic';
import { useSettings } from './hooks/useSettings';

export default function GemDuelBoard() {
  const [showDebug, setShowDebug] = useState(false);
  const { resolution, setResolution, settings, RESOLUTION_SETTINGS } = useSettings();

  const { state, handlers, getters, historyStack } = useGameLogic();

  const {
    board, bag, turn, selectedGems, errorMsg, winner, gameMode,
    bonusGemTarget, decks, market, inventories, privileges, playerTableau,
    playerReserved, royalDeck, playerRoyals
  } = state;

  const {
    handleSelfGemClick, handleGemClick, handleOpponentGemClick, handleConfirmTake,
    handleReplenish, handleReserveCard, handleReserveDeck, initiateBuy,
    handleSelectRoyal, handleCancelReserve, activatePrivilegeMode,
    checkAndInitiateBuyReserved, handleDebugAddCrowns, handleDebugAddPoints,
    handleUndo, setGameMode, setNextPlayerAfterRoyal, handleSkipAction
  } = handlers;
  
  const { getPlayerScore, isSelected } = getters;
  
  const opponent = turn === 'p1' ? 'p2' : 'p1';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center overflow-hidden">
      
      <button 
        onClick={() => setShowDebug(!showDebug)}
        className="fixed top-2 left-2 z-[100] bg-slate-800/80 hover:bg-red-900/60 text-slate-400 p-2 rounded border border-slate-700 text-[10px] transition-colors"
      >
        {showDebug ? 'CLOSE DEBUG' : 'OPEN DEBUG'}
      </button>

      {showDebug && (
        <div className="fixed left-4 top-16 z-[90] flex flex-col gap-4 animate-in slide-in-from-left duration-300">
          <DebugPanel 
            player="p1" 
            onAddCrowns={() => handleDebugAddCrowns('p1')}
            onAddPoints={() => handleDebugAddPoints('p1')}
            onForceRoyal={() => { setGameMode('SELECT_ROYAL'); setNextPlayerAfterRoyal(turn === 'p1' ? 'p2' : 'p1'); }}
          />
          <DebugPanel 
            player="p2" 
            onAddCrowns={() => handleDebugAddCrowns('p2')}
            onAddPoints={() => handleDebugAddPoints('p2')}
            onForceRoyal={() => { setGameMode('SELECT_ROYAL'); setNextPlayerAfterRoyal(turn === 'p1' ? 'p2' : 'p1'); }}
          />
        </div>
      )}

      <ResolutionSwitcher 
        settings={settings}
        resolution={resolution}
        setResolution={setResolution}
        RESOLUTION_SETTINGS={RESOLUTION_SETTINGS}
      />

      <WinnerModal winner={winner} />

      <div className="w-full h-screen flex flex-col p-0">

        {/* Opponent Zone */}
        <div className={`w-full ${settings.zoneHeight} shrink-0 z-30 flex justify-center items-start pt-4 overflow-visible bg-slate-950/50 backdrop-blur-sm relative border-b border-slate-800/30 transition-all duration-500`}>
          <div className={`w-[98%] max-w-[1800px] transform ${settings.zoneScale} origin-top transition-transform duration-500`}>
            <PlayerZone 
                player={opponent}
                inventory={inventories[opponent]} 
                cards={playerTableau[opponent]} 
                reserved={playerReserved[opponent]} 
                royals={playerRoyals[opponent]}
                privileges={privileges[opponent]}
                score={getPlayerScore(opponent)} 
                isActive={false} 
                onBuyReserved={() => false}
                onUsePrivilege={() => {}}
                isPrivilegeMode={false}
                isStealMode={gameMode === 'STEAL_ACTION' && turn !== opponent}
                isDiscardMode={false} 
                onGemClick={handleOpponentGemClick}
            />
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex-1 flex items-center justify-center min-h-0 relative z-10 px-6">
             <div className={`flex flex-row gap-8 xl:gap-12 items-center justify-center transform ${settings.boardScale} origin-center transition-all duration-500`}>
                
                <Market 
                    market={market}
                    decks={decks}
                    gameMode={gameMode}
                    turn={turn}
                    inventories={inventories}
                    playerTableau={playerTableau}
                    handleReserveDeck={handleReserveDeck}
                    initiateBuy={initiateBuy}
                    handleReserveCard={handleReserveCard}
                />

                <div className="relative flex flex-col items-center shrink-0">
                    <StatusBar errorMsg={errorMsg} />

                    <GameBoard 
                        board={board}
                        bag={bag}
                        handleGemClick={handleGemClick}
                        isSelected={isSelected}
                        selectedGems={selectedGems}
                        gameMode={gameMode}
                        bonusGemTarget={bonusGemTarget}
                    />

                    <GameActions 
                        handleUndo={handleUndo}
                        historyStack={historyStack}
                        handleReplenish={handleReplenish}
                        bag={bag}
                        gameMode={gameMode}
                        handleConfirmTake={handleConfirmTake}
                        selectedGems={selectedGems}
                        handleCancelReserve={handleCancelReserve}
                        handleSkipAction={handleSkipAction}
                    />
                </div>

                <RoyalCourt
                    royalDeck={royalDeck}
                    gameMode={gameMode}
                    handleSelectRoyal={handleSelectRoyal}
                />
             </div>
        </div>

        {/* Current Player Zone */}
        <div className={`w-full ${settings.zoneHeight} shrink-0 z-30 flex justify-center items-end pb-4 overflow-visible bg-slate-950/50 backdrop-blur-sm relative border-t border-slate-800/30 transition-all duration-500`}>
             <div className={`w-[98%] max-w-[1800px] transform ${settings.zoneScale} origin-bottom transition-transform duration-500`}>
                <PlayerZone 
                    player={turn} 
                    inventory={inventories[turn]} 
                    cards={playerTableau[turn]} 
                    reserved={playerReserved[turn]} 
                    royals={playerRoyals[turn]}
                    privileges={privileges[turn]}
                    score={getPlayerScore(turn)} 
                    isActive={true} 
                    onBuyReserved={checkAndInitiateBuyReserved}
                    onUsePrivilege={activatePrivilegeMode}
                    isPrivilegeMode={gameMode === 'PRIVILEGE_ACTION'}
                    isStealMode={gameMode === 'STEAL_ACTION' && turn === turn}
                    isDiscardMode={gameMode === 'DISCARD_EXCESS_GEMS'}
                    onGemClick={handleSelfGemClick}
                />
             </div>
        </div>
      </div>
    </div>
  );
}