import { Scroll } from 'lucide-react';
import type { CSSProperties } from 'react';
import { GameActions } from '@gemduel/ui/components/GameActions';
import { GameBoard } from '@gemduel/ui/components/GameBoard';
import { Market } from '@gemduel/ui/components/Market';
import { ReplayControls } from '@gemduel/ui/components/ReplayControls';
import { RoyalCourt } from '@gemduel/ui/components/RoyalCourt';
import { StatusBar } from '@gemduel/ui/components/StatusBar';
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
    playMatSurfaceStyle: CSSProperties;
    playMatDividerStyle: CSSProperties;
    gemBoardSurfaceStyle: CSSProperties;
    gemPanelSkin: GemPanelSkin;
    marketSurfaceStyle: CSSProperties;
}

export function GamePlaySurface({
    game,
    layout,
    theme,
    effectiveGameMode,
    localPlayer,
    playMatSurfaceStyle,
    playMatDividerStyle,
    gemBoardSurfaceStyle,
    gemPanelSkin,
    marketSurfaceStyle,
}: GamePlaySurfaceProps) {
    const { state, handlers, getters, historyControls, online } = game;
    const {
        board,
        bag,
        turn,
        selectedGems,
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
    const remainingPrivilegeSupply = Math.max(
        0,
        SHARED_PRIVILEGE_SUPPLY_SIZE - (privileges.p1 + privileges.p2)
    );

    return (
        <div className="flex-1 flex items-center justify-center min-h-0 relative z-30 px-4 pt-20 lg:pt-24 pb-6 lg:pb-8 transition-all duration-500">
            <div
                className="relative shrink-0 transition-all duration-500"
                style={{
                    transform: `scale(${layout.boardScale})`,
                    transformOrigin: 'center center',
                }}
            >
                <div
                    data-surface-slot="tablecloth"
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
                            isOnline={state.mode === 'ONLINE_MULTIPLAYER'}
                            localPlayer={localPlayer}
                            surfaceStyle={marketSurfaceStyle}
                        />
                    </div>

                    <div
                        className="hidden lg:block self-stretch w-px my-6 rounded-full"
                        style={playMatDividerStyle}
                    />

                    <div className="relative z-10 flex flex-col items-center shrink-0">
                        <div className="h-5 w-full flex items-center justify-center">
                            <StatusBar
                                errorMsg={errorMsg}
                                isOnline={state.mode === 'ONLINE_MULTIPLAYER'}
                                connectionStatus={online.connectionStatus}
                            />
                        </div>

                        <div
                            className="mb-1 w-full min-h-[42px] flex items-center justify-center gap-2.5"
                            title="Shared Privilege Scroll supply"
                        >
                            {Array.from({ length: remainingPrivilegeSupply }).map((_, index) => (
                                <Scroll
                                    key={`supply-scroll-${index}`}
                                    size={36}
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
                            phase={effectiveGameMode}
                            bonusGemTarget={bonusGemTarget}
                            theme={theme}
                            canInteract={isMyTurn}
                            surfaceStyle={gemBoardSurfaceStyle}
                            panelSkin={gemPanelSkin}
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
