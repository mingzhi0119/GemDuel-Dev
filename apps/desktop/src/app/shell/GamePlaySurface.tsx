import { Scroll } from 'lucide-react';
import type { CSSProperties } from 'react';
import { GameActions } from '@gemduel/ui/components/GameActions';
import { GameBoard } from '@gemduel/ui/components/GameBoard';
import { calculateGemPanelFootprintPx } from '@gemduel/ui/components/gameBoard/gemPanelLayout';
import { Market } from '@gemduel/ui/components/Market';
import { ReplayControls } from '@gemduel/ui/components/ReplayControls';
import { RoyalCourt } from '@gemduel/ui/components/RoyalCourt';
import { StatusBar } from '@gemduel/ui/components/StatusBar';
import type { MarketDeckBackArtworkMap } from '@gemduel/ui/components/card/cardBackArtwork';
import { SHARED_PRIVILEGE_SUPPLY_SIZE } from '@gemduel/shared/logic/stateHelpers';
import type { AppRouteProps } from '@app/types/ui';
import type {
    DeckState,
    GamePhase,
    GemPanelSkin,
    MarketState,
    PlayerKey,
} from '@gemduel/shared/types';

type EffectiveGameMode = GamePhase | 'REVIEW' | 'GAME_OVER';

interface GamePlaySurfaceProps {
    game: AppRouteProps['game'];
    layout: AppRouteProps['layout'];
    theme: AppRouteProps['theme'];
    effectiveGameMode: EffectiveGameMode;
    localPlayer: PlayerKey;
    gemBoardSurfaceStyle: CSSProperties;
    gemPanelSkin: GemPanelSkin;
    marketSurfaceStyle: CSSProperties;
    marketDeckBackArtwork?: MarketDeckBackArtworkMap;
    isRoyalSelectionBlocked?: boolean;
}

export function GamePlaySurface({
    game,
    layout,
    theme,
    effectiveGameMode,
    localPlayer,
    gemBoardSurfaceStyle,
    gemPanelSkin,
    marketSurfaceStyle,
    marketDeckBackArtwork,
    isRoyalSelectionBlocked = false,
}: GamePlaySurfaceProps) {
    const { state, handlers, getters, historyControls, online } = game;
    const {
        board,
        bag,
        turn,
        selectedGems,
        reserveGoldSelection,
        errorMsg,
        bonusGemTarget,
        decks,
        market,
        inventories,
        privileges,
        playerTableau,
        playerBuffs,
        royalDeck,
    } = state;
    const {
        handleGemClick,
        handleGemDragSelection,
        handleConfirmTake,
        handleReplenish,
        handleReserveCard,
        handleReserveDeck,
        initiateBuy,
        handleSelectRoyal,
        handleCancelReserve,
        handleCancelPrivilege,
        handlePeekDeck,
    } = handlers;
    const { isMyTurn } = getters;
    const marketState: MarketState = market;
    const deckState: DeckState = decks;
    const gemPanelFootprint = calculateGemPanelFootprintPx(gemPanelSkin);
    const remainingPrivilegeSupply = Math.max(
        0,
        SHARED_PRIVILEGE_SUPPLY_SIZE - (privileges.p1 + privileges.p2)
    );

    return (
        <div className="min-h-0 h-full w-full overflow-hidden flex items-center justify-center relative z-30 px-4 py-4 lg:py-6 transition-colors duration-500">
            <div
                data-presentation-anchor="middle-zone"
                className="relative shrink-0 transition-transform duration-500"
                style={{
                    transform: `scale(${layout.boardScale})`,
                    transformOrigin: 'center center',
                }}
            >
                <div
                    className="relative z-10 flex flex-col lg:flex-row items-center justify-center px-5 py-4 lg:px-6 lg:py-5 transition-[gap] duration-500"
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
                            market={marketState}
                            decks={deckState}
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
                            reserveModeActive={Boolean(reserveGoldSelection)}
                            isOnline={state.mode === 'ONLINE_MULTIPLAYER'}
                            localPlayer={localPlayer}
                            surfaceStyle={marketSurfaceStyle}
                            deckBackArtwork={marketDeckBackArtwork}
                        />
                    </div>

                    <div
                        data-presentation-anchor="center-playfield"
                        className="relative z-10 flex flex-col items-center shrink-0"
                        style={{
                            width: `${gemPanelFootprint.widthPx}px`,
                        }}
                    >
                        <div className="h-5 w-full flex items-center justify-center">
                            <StatusBar
                                errorMsg={errorMsg}
                                isOnline={state.mode === 'ONLINE_MULTIPLAYER'}
                                connectionStatus={online.connectionStatus}
                            />
                        </div>

                        <div
                            className="-mt-3 mb-2 w-full min-h-[32px] flex items-center justify-center gap-2"
                            title="Shared Privilege Scroll supply"
                        >
                            {Array.from({ length: remainingPrivilegeSupply }).map((_, index) => (
                                <Scroll
                                    key={`supply-scroll-${index}`}
                                    size={32}
                                    fill="#fcd34d"
                                    className={
                                        theme === 'dark'
                                            ? 'text-amber-200 drop-shadow-[0_0_8px_rgba(252,211,77,0.2)]'
                                            : 'text-amber-500 drop-shadow-sm'
                                    }
                                />
                            ))}
                        </div>

                        <GameBoard
                            board={board}
                            handleGemClick={handleGemClick}
                            handleGemDragSelection={handleGemDragSelection}
                            selectedGems={selectedGems}
                            reserveGoldSelection={reserveGoldSelection}
                            phase={effectiveGameMode}
                            bonusGemTarget={bonusGemTarget}
                            theme={theme}
                            canInteract={isMyTurn}
                            surfaceStyle={gemBoardSurfaceStyle}
                            panelSkin={gemPanelSkin}
                        />

                        <div className="mt-3 h-14 w-full flex items-start justify-center pt-1">
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
                            canInteract={isMyTurn && !isRoyalSelectionBlocked}
                        />
                        <div className="flex flex-col gap-3 items-center p-2 lg:p-3 transition-colors duration-500">
                            <ReplayControls
                                undo={historyControls.undo}
                                redo={historyControls.redo}
                                canUndo={
                                    state.mode !== 'ONLINE_MULTIPLAYER' && historyControls.canUndo
                                }
                                canRedo={
                                    state.mode !== 'ONLINE_MULTIPLAYER' && historyControls.canRedo
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
    );
}
