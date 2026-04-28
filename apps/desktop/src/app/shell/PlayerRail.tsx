import type { CSSProperties } from 'react';
import { PlayerZone } from '@gemduel/ui/components/PlayerZone';
import type {
    PlayerZoneBuffPreviewAction,
    PlayerZoneStackState,
    PlayerZoneSurfaceArtwork,
} from '@gemduel/ui/components/playerZone/types';
import { getFsmPhaseSurfacePolicy } from '@gemduel/shared/logic/fsm';
import type { AppRouteProps } from '@app/types/ui';
import type { GamePhase, PlayerKey } from '@gemduel/shared/types';
import {
    createPlayerZoneSurfaceStyle,
    createPlayerZoneSurfaceArtwork,
    getPlayerZoneSurfaceVariant,
    type PlayerZoneSurfaceVariant,
} from './playerZoneSurfaceStyles';

type EffectiveGameMode = GamePhase | 'REVIEW' | 'GAME_OVER';

interface PlayerRailProps {
    game: AppRouteProps['game'];
    theme: AppRouteProps['theme'];
    effectiveGameMode: EffectiveGameMode;
    scaledZoneWrapperStyle: CSSProperties;
    playerRailStyle: CSSProperties;
    isP1ZoneActive: boolean;
    isP2ZoneActive: boolean;
    playerZoneSurfaceVariant?: PlayerZoneSurfaceVariant;
    playerZoneSurfaceStyleOverride?: (player: PlayerKey) => CSSProperties | undefined;
    playerZoneSurfaceArtworkOverride?: (player: PlayerKey) => PlayerZoneSurfaceArtwork | undefined;
    pendingReservedCardIds?: string[];
    onPreviewStack?: (stack: PlayerZoneStackState & { player: PlayerKey }) => void;
    buffPreviewActions?: Partial<Record<PlayerKey, PlayerZoneBuffPreviewAction>>;
}

export function PlayerRail({
    game,
    theme,
    effectiveGameMode,
    scaledZoneWrapperStyle,
    playerRailStyle,
    isP1ZoneActive,
    isP2ZoneActive,
    playerZoneSurfaceVariant,
    playerZoneSurfaceStyleOverride,
    playerZoneSurfaceArtworkOverride,
    pendingReservedCardIds = [],
    onPreviewStack,
    buffPreviewActions,
}: PlayerRailProps) {
    const { state, handlers, getters } = game;
    const {
        turn,
        inventories,
        privileges,
        playerTableau,
        playerReserved,
        playerRoyals,
        lastFeedback,
        playerBuffs,
        extraPrivileges,
    } = state;
    const {
        handleSelfGemClick,
        handleOpponentGemClick,
        handleDiscardReserved,
        activatePrivilegeMode,
        checkAndInitiateBuyReserved,
    } = handlers;
    const { getPlayerScore, getCrownCount } = getters;
    const surfacePolicy = getFsmPhaseSurfacePolicy(effectiveGameMode);
    const previewPlayerZoneSurfaceVariant = getPlayerZoneSurfaceVariant();
    const resolvedPlayerZoneSurfaceVariant =
        previewPlayerZoneSurfaceVariant !== 'none'
            ? previewPlayerZoneSurfaceVariant
            : (playerZoneSurfaceVariant ?? 'none');

    return (
        <div
            data-player-rail="true"
            className="shrink-0 flex w-full relative z-20 transition-all duration-500"
            style={playerRailStyle}
        >
            <div
                className={`flex-1 relative transition-all duration-500 border-2
                    overflow-hidden flex items-center justify-center
                    ${
                        isP1ZoneActive
                            ? theme === 'dark'
                                ? 'animate-breathe-emerald border-emerald-400/45'
                                : 'animate-breathe-emerald border-emerald-500/45'
                            : theme === 'dark'
                              ? 'border-slate-400/18'
                              : 'border-slate-500/24'
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
                        phase={effectiveGameMode}
                        onBuyReserved={checkAndInitiateBuyReserved}
                        onDiscardReserved={handleDiscardReserved}
                        onUsePrivilege={activatePrivilegeMode}
                        isPrivilegeMode={surfacePolicy.boardInteractionMode === 'privilege-target'}
                        isStealMode={
                            surfacePolicy.opponentGemRailMode === 'steal-target' && turn !== 'p1'
                        }
                        isDiscardMode={
                            surfacePolicy.selfGemRailMode === 'discard-self' && turn === 'p1'
                        }
                        onGemClick={turn === 'p1' ? handleSelfGemClick : handleOpponentGemClick}
                        buff={playerBuffs?.p1}
                        theme={theme}
                        surfaceStyle={
                            playerZoneSurfaceStyleOverride?.('p1') ??
                            createPlayerZoneSurfaceStyle(
                                theme,
                                resolvedPlayerZoneSurfaceVariant,
                                'p1'
                            )
                        }
                        surfaceArtwork={
                            playerZoneSurfaceArtworkOverride?.('p1') ??
                            createPlayerZoneSurfaceArtwork(
                                theme,
                                resolvedPlayerZoneSurfaceVariant,
                                'p1'
                            )
                        }
                        surfaceVariant={resolvedPlayerZoneSurfaceVariant}
                        pendingReservedCardIds={pendingReservedCardIds}
                        onPreviewStack={onPreviewStack}
                        buffPreviewAction={buffPreviewActions?.p1}
                    />
                </div>
            </div>

            <div
                className={`flex-1 relative transition-all duration-500 border-2
                    overflow-hidden flex items-center justify-center
                    ${
                        isP2ZoneActive
                            ? theme === 'dark'
                                ? 'animate-breathe-blue border-blue-400/45'
                                : 'animate-breathe-blue border-blue-500/45'
                            : theme === 'dark'
                              ? 'border-slate-400/18'
                              : 'border-slate-500/24'
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
                        phase={effectiveGameMode}
                        onBuyReserved={checkAndInitiateBuyReserved}
                        onDiscardReserved={handleDiscardReserved}
                        onUsePrivilege={activatePrivilegeMode}
                        isPrivilegeMode={surfacePolicy.boardInteractionMode === 'privilege-target'}
                        isStealMode={
                            surfacePolicy.opponentGemRailMode === 'steal-target' && turn !== 'p2'
                        }
                        isDiscardMode={
                            surfacePolicy.selfGemRailMode === 'discard-self' && turn === 'p2'
                        }
                        onGemClick={turn === 'p2' ? handleSelfGemClick : handleOpponentGemClick}
                        buff={playerBuffs?.p2}
                        theme={theme}
                        surfaceStyle={
                            playerZoneSurfaceStyleOverride?.('p2') ??
                            createPlayerZoneSurfaceStyle(
                                theme,
                                resolvedPlayerZoneSurfaceVariant,
                                'p2'
                            )
                        }
                        surfaceArtwork={
                            playerZoneSurfaceArtworkOverride?.('p2') ??
                            createPlayerZoneSurfaceArtwork(
                                theme,
                                resolvedPlayerZoneSurfaceVariant,
                                'p2'
                            )
                        }
                        surfaceVariant={resolvedPlayerZoneSurfaceVariant}
                        pendingReservedCardIds={pendingReservedCardIds}
                        onPreviewStack={onPreviewStack}
                        buffPreviewAction={buffPreviewActions?.p2}
                    />
                </div>
            </div>
        </div>
    );
}
