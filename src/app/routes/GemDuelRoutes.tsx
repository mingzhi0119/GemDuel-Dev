import React, { Suspense } from 'react';
import { isDraftSelectionPhase } from '../../logic/fsm';
import type { AppRouteProps, ThemeName } from '../../types';
import { DesktopStage } from '../layout/DesktopStage';

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

type RouteKind = 'config' | 'online' | 'draft' | 'game';

const LIGHT_GAME_VIEWPORT_STYLE: React.CSSProperties = {
    backgroundColor: '#F4F7F6',
    backgroundImage: 'radial-gradient(circle at 50% 42%, #FBFCFC 0%, #F4F7F6 58%, #EEF2F1 100%)',
};

const getDesktopViewportPresentation = (routeKind: RouteKind, theme: ThemeName) => {
    if (routeKind === 'game') {
        if (theme === 'dark') {
            return {
                viewportClassName:
                    'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f111a] to-black text-slate-200 transition-colors duration-500',
            };
        }

        return {
            viewportClassName: 'text-stone-800 transition-colors duration-500',
            viewportStyle: LIGHT_GAME_VIEWPORT_STYLE,
        };
    }

    if (routeKind === 'online') {
        return {
            viewportClassName:
                theme === 'dark'
                    ? 'bg-slate-950 text-slate-100 transition-colors duration-500'
                    : 'bg-slate-50 text-slate-900 transition-colors duration-500',
        };
    }

    return {
        viewportClassName:
            theme === 'dark'
                ? 'bg-slate-950 text-slate-100 transition-colors duration-500'
                : 'bg-slate-100 text-slate-900 transition-colors duration-500',
    };
};

const getRouteFallback = (routeKind: RouteKind, theme: ThemeName) => {
    if (routeKind === 'game' && theme === 'light') {
        return <div className="h-full w-full" style={LIGHT_GAME_VIEWPORT_STYLE} />;
    }

    const fallbackClassName =
        routeKind === 'game'
            ? theme === 'dark'
                ? 'h-full w-full bg-slate-950/95'
                : 'h-full w-full bg-[#F4F7F6]'
            : routeKind === 'online'
              ? theme === 'dark'
                  ? 'h-full w-full bg-slate-950'
                  : 'h-full w-full bg-slate-50'
              : theme === 'dark'
                ? 'h-full w-full bg-slate-950'
                : 'h-full w-full bg-slate-100';

    return <div className={fallbackClassName} />;
};

export function GemDuelRoutes(props: AppRouteProps) {
    const { game, theme, ui, setters } = props;
    const { state, handlers, historyControls, online } = game;
    let routeContent: React.ReactNode;
    let routeKind: RouteKind;

    if (historyControls.historyLength === 0) {
        if (ui.onlineSetup) {
            routeKind = 'online';
            routeContent = (
                <OnlineMenu
                    onBack={() => setters.setOnlineSetup(false)}
                    online={online}
                    startGame={handlers.startGame}
                    theme={theme}
                />
            );
        } else {
            routeKind = 'config';
            routeContent = (
                <GameConfigMenu
                    onOnlineSetup={() => setters.setOnlineSetup(true)}
                    onStartGame={handlers.startGame}
                    theme={theme}
                />
            );
        }
    } else if (isDraftSelectionPhase(state.phase)) {
        routeKind = 'draft';
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
        routeKind = 'game';
        routeContent = <GameShell {...props} />;
    }

    const suspenseContent = (
        <Suspense fallback={getRouteFallback(routeKind, theme)}>{routeContent}</Suspense>
    );

    if (props.layout.layoutMode === 'desktop-4k') {
        return (
            <DesktopStage
                layout={props.layout}
                {...getDesktopViewportPresentation(routeKind, theme)}
            >
                {suspenseContent}
            </DesktopStage>
        );
    }

    return suspenseContent;
}
