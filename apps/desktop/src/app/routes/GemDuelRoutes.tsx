import React, { Suspense } from 'react';
import { isDraftSelectionPhase } from '@gemduel/shared/logic/fsm';
import type { AppRouteProps } from '@app/types/ui';
import type { ThemeName } from '@gemduel/shared/types';
import { DesktopStage } from '../layout/DesktopStage';

const DraftScreen = React.lazy(() =>
    import('@gemduel/ui/components/DraftScreen').then((module) => ({ default: module.DraftScreen }))
);
const GameConfigMenu = React.lazy(() =>
    import('@gemduel/ui/components/GameConfigMenu').then((module) => ({
        default: module.GameConfigMenu,
    }))
);
const OnlineMenu = React.lazy(() =>
    import('@gemduel/ui/components/OnlineMenu').then((module) => ({ default: module.OnlineMenu }))
);
const LanMenu = React.lazy(() =>
    import('@gemduel/ui/components/LanMenu').then((module) => ({ default: module.LanMenu }))
);
const GameShell = React.lazy(() =>
    import('../shell/GameShell').then((module) => ({ default: module.GameShell }))
);

type RouteKind = 'config' | 'online' | 'lan' | 'draft' | 'game';

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

    if (routeKind === 'online' || routeKind === 'lan') {
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
        if (ui.matchmakingRoute === 'online') {
            routeKind = 'online';
            routeContent = (
                <OnlineMenu
                    onBack={() => setters.setMatchmakingRoute('none')}
                    online={online}
                    startGame={handlers.startGame}
                    theme={theme}
                />
            );
        } else if (ui.matchmakingRoute === 'lan') {
            routeKind = 'lan';
            routeContent = (
                <LanMenu
                    onBack={() => {
                        void props.lan.cancelSearch();
                        setters.setMatchmakingRoute('none');
                    }}
                    onRetry={() => {
                        void props.lan.startSearch();
                    }}
                    onSelectMode={(mode) => {
                        void props.lan.selectMode(mode);
                    }}
                    onConfirmStart={() => {
                        void props.lan.confirmStart();
                    }}
                    lan={props.lan.state}
                    theme={theme}
                />
            );
        } else {
            routeKind = 'config';
            routeContent = (
                <GameConfigMenu
                    onOnlineSetup={() => setters.setMatchmakingRoute('online')}
                    onLanSetup={() => setters.setMatchmakingRoute('lan')}
                    onStartGame={handlers.startGame}
                    theme={theme}
                />
            );
        }
    } else if (isDraftSelectionPhase(state.phase)) {
        routeKind = 'draft';
        const activeDraftLevel =
            state.turn === 'p2' ? state.p2DraftLevel || state.buffLevel : state.buffLevel;
        routeContent = (
            <DraftScreen
                draftPool={state.draftPool}
                p2DraftPool={state.p2DraftPool}
                activeDraftLevel={activeDraftLevel}
                mode={state.mode}
                activePlayer={state.turn}
                onSelectBuff={handlers.handleSelectBuff}
                onReroll={state.mode === 'LOCAL_PVP' ? handlers.handleRerollBuffs : undefined}
                theme={theme}
                localPlayer={state.localPlayer}
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
