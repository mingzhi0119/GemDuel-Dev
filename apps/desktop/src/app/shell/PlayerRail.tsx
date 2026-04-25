import type { CSSProperties } from 'react';
import { PlayerZone } from '@gemduel/ui/components/PlayerZone';
import { getFsmPhaseSurfacePolicy } from '@gemduel/shared/logic/fsm';
import type { AppRouteProps } from '@app/types/ui';
import type { GamePhase } from '@gemduel/shared/types';
import {
    createPlayerZoneSurfaceStyle,
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
        playerZoneSurfaceVariant ?? previewPlayerZoneSurfaceVariant;

    return (
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
                        surfaceStyle={createPlayerZoneSurfaceStyle(
                            theme,
                            resolvedPlayerZoneSurfaceVariant,
                            'p1'
                        )}
                        surfaceVariant={resolvedPlayerZoneSurfaceVariant}
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
                        surfaceStyle={createPlayerZoneSurfaceStyle(
                            theme,
                            resolvedPlayerZoneSurfaceVariant,
                            'p2'
                        )}
                        surfaceVariant={resolvedPlayerZoneSurfaceVariant}
                    />
                </div>
            </div>
        </div>
    );
}
