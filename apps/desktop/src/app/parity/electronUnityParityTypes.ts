import type { GameMode, PlayerKey, ThemeName } from '@gemduel/shared/types';
import type { SurfaceThemeSelections, SurfaceThemeVariant } from '../shell/surfaceTheme';
import type {
    GameLogicController,
    MatchmakingRoute,
    ResponsiveLayout,
    StartSetupRoute,
} from '../../types/ui';

export type ParityAction =
    | 'start_local_game'
    | 'choose_mode'
    | 'choose_boon'
    | 'hover_boon'
    | 'click_chrome_rulebook'
    | 'click_chrome_restart'
    | 'hover_chrome_control'
    | 'click_market_card'
    | 'click_market_deck'
    | 'hover_market_card'
    | 'hover_market_deck'
    | 'click_preview_blank'
    | 'buy_card'
    | 'reserve_card'
    | 'click_player_reserved'
    | 'hover_player_reserved'
    | 'confirm_preview_action'
    | 'click_board_cell'
    | 'hover_board_cell'
    | 'confirm_gem_selection'
    | 'cancel_gem_selection'
    | 'take_bonus_gem'
    | 'steal_gem'
    | 'discard_gem'
    | 'hover_player_gem'
    | 'end_turn'
    | 'force_royal_selection'
    | 'choose_royal'
    | 'open_settings'
    | 'change_setting'
    | 'settings_save'
    | 'settings_load'
    | 'close_settings'
    | 'invalid_action'
    | 'load_replay_fixture'
    | 'reset';

export interface ParityActionResult {
    ok: boolean;
    action: ParityAction;
    detail?: string;
    debt?: string;
    driver?: string;
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
        surfaceTheme: SurfaceThemeVariant;
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
        typography: DomTypographySample[];
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

export interface DomTypographySample {
    key: string;
    selector: string;
    text: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    textAlign: string;
    padding: string;
}

export interface UseElectronUnityParityHarnessParams {
    game: GameLogicController;
    layout: ResponsiveLayout;
    locale: string;
    theme: ThemeName;
    surfaceTheme: SurfaceThemeSelections;
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
    setReplayReviewing?: (value: boolean) => void;
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
    'choose_boon',
    'hover_boon',
    'click_chrome_rulebook',
    'click_chrome_restart',
    'hover_chrome_control',
    'click_market_card',
    'click_market_deck',
    'hover_market_card',
    'hover_market_deck',
    'click_preview_blank',
    'buy_card',
    'reserve_card',
    'click_player_reserved',
    'hover_player_reserved',
    'confirm_preview_action',
    'click_board_cell',
    'hover_board_cell',
    'confirm_gem_selection',
    'cancel_gem_selection',
    'take_bonus_gem',
    'steal_gem',
    'discard_gem',
    'hover_player_gem',
    'end_turn',
    'force_royal_selection',
    'choose_royal',
    'open_settings',
    'change_setting',
    'settings_save',
    'settings_load',
    'close_settings',
    'invalid_action',
    'load_replay_fixture',
    'reset',
];
