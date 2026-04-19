import { DraftScreen } from '../../components/DraftScreen';
import { GameConfigMenu } from '../../components/GameConfigMenu';
import { OnlineMenu } from '../../components/OnlineMenu';
import { GameShell } from '../shell/GameShell';
import type { AppRouteProps } from '../types';

export function GemDuelRoutes(props: AppRouteProps) {
    const { game, theme, ui, setters } = props;
    const { state, handlers, historyControls, online } = game;

    if (historyControls.historyLength === 0) {
        if (ui.onlineSetup) {
            return (
                <OnlineMenu
                    onBack={() => setters.setOnlineSetup(false)}
                    online={online}
                    startGame={handlers.startGame}
                    theme={theme}
                />
            );
        }

        return (
            <GameConfigMenu
                onOnlineSetup={() => setters.setOnlineSetup(true)}
                onStartGame={handlers.startGame}
                theme={theme}
            />
        );
    }

    if (state.phase === 'DRAFT_PHASE') {
        return (
            <DraftScreen
                draftPool={state.draftPool}
                p2DraftPool={state.p2DraftPool}
                buffLevel={state.buffLevel}
                activePlayer={state.turn}
                onSelectBuff={handlers.handleSelectBuff}
                onReroll={handlers.handleRerollBuffs}
                theme={theme}
                localPlayer={online.isHost ? 'p1' : 'p2'}
                isOnline={state.mode === 'ONLINE_MULTIPLAYER'}
                isPvE={state.mode === 'PVE'}
            />
        );
    }

    return <GameShell {...props} />;
}
