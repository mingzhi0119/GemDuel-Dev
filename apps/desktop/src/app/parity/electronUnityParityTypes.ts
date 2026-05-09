import type { GameMode, PlayerKey, ThemeName } from '@gemduel/shared/types';
import type { SurfaceThemeVariant } from '../shell/surfaceTheme';
import type {
    GameLogicController,
    MatchmakingRoute,
    ResponsiveLayout,
    StartSetupRoute,
} from '../../types/ui';

export type ParityAction =
    | 'start_local_game'
    | 'choose_mode'
    | 'click_market_card'
    | 'buy_card'
    | 'reserve_card'
    | 'click_player_reserved'
    | 'confirm_preview_action'
    | 'end_turn'
    | 'force_royal_selection'
    | 'choose_royal'
    | 'open_settings'
    | 'change_setting'
    | 'invalid_action'
    | 'load_replay_fixture'
    | 'reset';

export interface ParityActionResult {
    ok: boolean;
    action: ParityAction;
    detail?: string;
    debt?: string;
    state?: ElectronParityStateDump;
}

export interface ElectronParityStateDump {
    source: 'electron';
    timestamp: string;
    route: {
        setupRoute: StartSetupRoute;
        matchmakingRoute: MatchmakingRoute;
    };
    settings: {
        locale: string;
        theme: ThemeName;
        soundEnabled: boolean;
    };
    viewport: Pick<
        ResponsiveLayout,
        'viewportWidth' | 'viewportHeight' | 'stageCanvasWidthPx' | 'stageCanvasHeightPx'
    >;
    history: {
        currentIndex: number;
        historyLength: number;
        historySource: string;
    };
    game: Record<string, unknown>;
    visible: {
        title: string;
        textDigest: string;
        boxes: DomBox[];
    };
}

export interface DomBox {
    key: string;
    semanticKey?: string;
    selector: string;
    text: string;
    dataset: Record<string, string>;
    rect: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

export interface UseElectronUnityParityHarnessParams {
    game: GameLogicController;
    layout: ResponsiveLayout;
    locale: string;
    theme: ThemeName;
    soundEnabled: boolean;
    setupRoute: StartSetupRoute;
    matchmakingRoute: MatchmakingRoute;
    setLocale: (locale: 'en' | 'zh') => void;
    setSoundEnabled: (value: boolean) => void;
    setStartSetupRoute: (route: StartSetupRoute) => void;
    startGame: (
        mode: GameMode,
        config: { useBuffs: boolean; isHost?: boolean; hostPlayer?: PlayerKey; seed?: string }
    ) => void;
    selectSurfaceTheme: (variant: SurfaceThemeVariant) => void;
    reset: () => void;
}

export interface ElectronUnityParityApi {
    version: 1;
    isReady: () => boolean;
    actions: ParityAction[];
    dumpState: () => ElectronParityStateDump;
    dispatch: (
        action: ParityAction,
        payload?: Record<string, unknown>
    ) => Promise<ParityActionResult>;
    runSteps: (
        steps: Array<{ action: ParityAction; payload?: Record<string, unknown> }>
    ) => Promise<ParityActionResult[]>;
}

declare global {
    interface Window {
        __GEMDUEL_PARITY__?: ElectronUnityParityApi;
    }
}

export const ACTIONS: ParityAction[] = [
    'start_local_game',
    'choose_mode',
    'click_market_card',
    'buy_card',
    'reserve_card',
    'click_player_reserved',
    'confirm_preview_action',
    'end_turn',
    'force_royal_selection',
    'choose_royal',
    'open_settings',
    'change_setting',
    'invalid_action',
    'load_replay_fixture',
    'reset',
];
