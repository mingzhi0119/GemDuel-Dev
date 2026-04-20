import React, { Suspense } from 'react';
import { isDraftSelectionPhase } from '../../logic/fsm';
import type { AppRouteProps } from '../../types';

const DraftScreen = React.lazy(() =>
    import('../../components/DraftScreen').then((module) => ({ default: module.DraftScreen }))
);
const GameConfigMenu = React.lazy(() =>
    import('../../components/GameConfigMenu').then((module) => ({
        default: module.GameConfigMenu,
    }))
);
const OnlineMenu = React.lazy(() =>
    import('../../components/OnlineMenu').then((module) => ({ default: module.OnlineMenu }))
);
const GameShell = React.lazy(() =>
    import('../shell/GameShell').then((module) => ({ default: module.GameShell }))
);

export function GemDuelRoutes(props: AppRouteProps) {
    const { game, theme, ui, setters } = props;
    const { state, handlers, historyControls, online } = game;
    let routeContent: React.ReactNode;

    if (historyControls.historyLength === 0) {
        if (ui.onlineSetup) {
            routeContent = (
                <OnlineMenu
                    onBack={() => setters.setOnlineSetup(false)}
                    online={online}
                    startGame={handlers.startGame}
                    theme={theme}
                />
            );
        } else {
            routeContent = (
                <GameConfigMenu
                    onOnlineSetup={() => setters.setOnlineSetup(true)}
                    onStartGame={handlers.startGame}
                    theme={theme}
                />
            );
        }
    } else if (isDraftSelectionPhase(state.phase)) {
        routeContent = (
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
    } else {
        routeContent = <GameShell {...props} />;
    }

    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-950/95" />}>
            {routeContent}
        </Suspense>
    );
}
