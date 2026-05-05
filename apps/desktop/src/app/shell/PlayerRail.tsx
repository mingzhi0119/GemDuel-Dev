import type { CSSProperties } from 'react';
import { PlayerZone } from '@gemduel/ui/components/PlayerZone';
import { getReservedCardVisibilityForViewer } from '@gemduel/shared/logic/multiplayerVisibility';
import type {
    PlayerZoneBuffPreviewAction,
    PlayerZoneStackState,
    PlayerZoneSurfaceArtwork,
} from '@gemduel/ui/components/playerZone/types';
import { getFsmPhaseSurfacePolicy } from '@gemduel/shared/logic/fsm';
import type { AppRouteProps } from '@app/types/ui';
import type {
    GamePhase,
    LanOpponentVisibilityPreferences,
    PlayerKey,
    ReservedCardVisibility,
} from '@gemduel/shared/types';
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
    readabilityTreatment?: boolean;
    lanOpponentVisibilityPreferences?: LanOpponentVisibilityPreferences;
}

const shouldHideLanOpponentSurface = (
    player: PlayerKey,
    localPlayer: PlayerKey,
    preferences: LanOpponentVisibilityPreferences | undefined
): boolean =>
    Boolean(preferences && player !== localPlayer && !preferences.showOpponentPlayerZoneCards);

const shouldHideLanOpponentGems = (
    player: PlayerKey,
    localPlayer: PlayerKey,
    preferences: LanOpponentVisibilityPreferences | undefined
): boolean => Boolean(preferences && player !== localPlayer && !preferences.showOpponentGems);

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
    readabilityTreatment = false,
    lanOpponentVisibilityPreferences,
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
        localPlayer,
        mode,
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
    const getReservedVisibility = (player: PlayerKey): ReservedCardVisibility =>
        mode === 'ONLINE_MULTIPLAYER'
            ? getReservedCardVisibilityForViewer(player, localPlayer)
            : 'faces';
    const getTableauVisibility = (player: PlayerKey): ReservedCardVisibility =>
        shouldHideLanOpponentSurface(player, localPlayer, lanOpponentVisibilityPreferences)
            ? 'backs'
            : 'faces';
    const getGemVisibility = (player: PlayerKey): 'visible' | 'hidden' =>
        shouldHideLanOpponentGems(player, localPlayer, lanOpponentVisibilityPreferences)
            ? 'hidden'
            : 'visible';

    return (
        <div
            data-player-rail="true"
            className="shrink-0 flex w-full relative z-20 transition-all duration-500"
            style={playerRailStyle}
        >
            <div
                data-player-zone-frame="p1"
                data-player-zone-frame-active={isP1ZoneActive ? 'true' : 'false'}
                className={`flex-1 relative transition-all duration-500 border-[3px]
                    overflow-hidden flex items-center justify-center
                    ${
                        isP1ZoneActive
                            ? 'animate-breathe-gold border-amber-200/95'
                            : 'border-transparent'
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
                        reservedVisibility={getReservedVisibility('p1')}
                        tableauVisibility={getTableauVisibility('p1')}
                        gemVisibility={getGemVisibility('p1')}
                        pendingReservedCardIds={pendingReservedCardIds}
                        onPreviewStack={onPreviewStack}
                        buffPreviewAction={buffPreviewActions?.p1}
                        readabilityTreatment={readabilityTreatment}
                    />
                </div>
            </div>

            <div
                data-player-zone-frame="p2"
                data-player-zone-frame-active={isP2ZoneActive ? 'true' : 'false'}
                className={`flex-1 relative transition-all duration-500 border-[3px]
                    overflow-hidden flex items-center justify-center
                    ${
                        isP2ZoneActive
                            ? 'animate-breathe-gold border-amber-200/95'
                            : 'border-transparent'
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
                        reservedVisibility={getReservedVisibility('p2')}
                        tableauVisibility={getTableauVisibility('p2')}
                        gemVisibility={getGemVisibility('p2')}
                        pendingReservedCardIds={pendingReservedCardIds}
                        onPreviewStack={onPreviewStack}
                        buffPreviewAction={buffPreviewActions?.p2}
                        readabilityTreatment={readabilityTreatment}
                    />
                </div>
            </div>
        </div>
    );
}
