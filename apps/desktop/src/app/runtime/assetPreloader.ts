import { BUFFS } from '@gemduel/shared/constants';
import type { ThemeName } from '@gemduel/shared/types';
import { GEM_ARTWORK_ASSETS } from '@gemduel/ui/components/gemArtworkAssets';
import {
    BONUS_GEM_BADGE_BACK_ARTWORK,
    CARD_NUMBER_ARTWORK,
    POINT_RIBBON_ARTWORK,
    UI_ICON_ARTWORK,
} from '@gemduel/ui/components/uiIconArtwork';
import {
    DEFAULT_SURFACE_THEME_SELECTIONS,
    normalizeSurfaceThemeSelections,
    type SurfaceThemeSelections,
    type SurfaceThemeVariant,
} from '../shell/surfaceTheme';

interface AssetWarmupProgress {
    loaded: number;
    total: number;
    failed: number;
    path: string;
}

interface AssetWarmupOptions {
    concurrency?: number;
    onProgress?: (progress: AssetWarmupProgress) => void;
}

const LEGACY_SURFACE_FALLBACK_ASSET_PATHS = [
    '/assets/surfaces/dark/background-shell.png',
    '/assets/surfaces/dark/background-market.png',
    '/assets/surfaces/dark/panel-gem-board-square.png',
] as const;

const CORE_GEM_ASSET_PATHS = Object.values(GEM_ARTWORK_ASSETS).map((asset) => asset.path);

const CORE_UI_ICON_ASSET_PATHS = [
    ...Object.values(UI_ICON_ARTWORK),
    ...Object.values(BONUS_GEM_BADGE_BACK_ARTWORK),
    ...Object.values(POINT_RIBBON_ARTWORK),
    ...Object.values(CARD_NUMBER_ARTWORK),
];

const uniquePaths = (paths: ReadonlyArray<string | null | undefined>): string[] =>
    Array.from(new Set(paths.filter((path): path is string => Boolean(path))));

const SURFACE_THEME_RUNTIME_BASE_PATH = '/assets/surfaces/anime-themes';

const getSurfaceThemeBasePath = (variant: SurfaceThemeVariant, theme: ThemeName): string =>
    `${SURFACE_THEME_RUNTIME_BASE_PATH}/${variant}/${theme}`;

const getSurfaceThemeAssetPaths = (
    surfaceTheme: SurfaceThemeSelections | undefined,
    theme: ThemeName
): string[] => {
    const resolvedTheme = normalizeSurfaceThemeSelections(
        surfaceTheme ?? DEFAULT_SURFACE_THEME_SELECTIONS
    );
    const backgroundBasePath = getSurfaceThemeBasePath(resolvedTheme.background, theme);
    const gemPanelBasePath = getSurfaceThemeBasePath(resolvedTheme.gemPanel, theme);
    const playerZoneBasePath = getSurfaceThemeBasePath(resolvedTheme.playerZone, theme);

    return uniquePaths([
        `${backgroundBasePath}/shell-background.png`,
        `${backgroundBasePath}/market-card-back-l1.png`,
        `${backgroundBasePath}/market-card-back-l2.png`,
        `${backgroundBasePath}/market-card-back-l3.png`,
        `${backgroundBasePath}/royal-card-back.png`,
        `${gemPanelBasePath}/gem-panel.png`,
        `${playerZoneBasePath}/player-zone.png`,
        `${playerZoneBasePath}/player-zone-p1.png`,
        `${playerZoneBasePath}/player-zone-p2.png`,
        ...LEGACY_SURFACE_FALLBACK_ASSET_PATHS,
    ]);
};

const CORE_GAME_ASSET_PATHS = uniquePaths([...CORE_GEM_ASSET_PATHS, ...CORE_UI_ICON_ASSET_PATHS]);

const ROGUE_BUFF_ASSET_PATHS = uniquePaths(
    Object.values(BUFFS).map((buff) =>
        buff.id === 'none' ? null : `/assets/rogue-buffs/rogue-buff-${buff.id}.png`
    )
);

interface GameStartAssetOptions {
    useBuffs: boolean;
    surfaceTheme?: SurfaceThemeSelections;
    theme?: ThemeName;
}

export const getGameStartAssetPaths = ({
    useBuffs,
    surfaceTheme,
    theme = 'dark',
}: GameStartAssetOptions): string[] =>
    uniquePaths([
        ...getSurfaceThemeAssetPaths(surfaceTheme, theme),
        ...CORE_GAME_ASSET_PATHS,
        ...(useBuffs ? ROGUE_BUFF_ASSET_PATHS : []),
    ]);

const preloadImageAsset = (path: string): Promise<void> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.decoding = 'async';
        (image as HTMLImageElement & { fetchPriority?: 'high' | 'low' | 'auto' }).fetchPriority =
            'high';
        image.onload = () => {
            void image.decode().then(resolve).catch(resolve);
        };
        image.onerror = () => reject(new Error(`Failed to preload ${path}`));
        image.src = path;
    });

export const warmAssetCache = async (
    paths: readonly string[],
    { concurrency = 4, onProgress }: AssetWarmupOptions = {}
): Promise<{ loaded: number; failed: number; total: number }> => {
    const queue = uniquePaths(paths);
    let nextIndex = 0;
    let loaded = 0;
    let failed = 0;

    const report = (path: string) => {
        onProgress?.({
            loaded: loaded + failed,
            total: queue.length,
            failed,
            path,
        });
    };

    const worker = async () => {
        while (nextIndex < queue.length) {
            const path = queue[nextIndex]!;
            nextIndex += 1;

            try {
                await preloadImageAsset(path);
                loaded += 1;
            } catch {
                failed += 1;
            }

            report(path);
        }
    };

    await Promise.all(
        Array.from({ length: Math.max(1, Math.min(concurrency, queue.length)) }, () => worker())
    );

    return {
        loaded,
        failed,
        total: queue.length,
    };
};
