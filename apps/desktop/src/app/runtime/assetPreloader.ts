import { GEM_ARTWORK_ASSETS } from '@gemduel/ui/components/gemArtworkAssets';
import {
    BONUS_GEM_BADGE_BACK_ARTWORK,
    CARD_NUMBER_ARTWORK,
    POINT_RIBBON_ARTWORK,
    UI_ICON_ARTWORK,
} from '@gemduel/ui/components/uiIconArtwork';

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

const DEFAULT_THEME = 'royal-luxury';
const SURFACE_BASE_PATH = `/assets/surfaces/anime-themes/${DEFAULT_THEME}/dark`;

const DEFAULT_SURFACE_ASSET_PATHS = [
    `${SURFACE_BASE_PATH}/shell-background.png`,
    `${SURFACE_BASE_PATH}/gem-panel.png`,
    `${SURFACE_BASE_PATH}/player-zone.png`,
    `${SURFACE_BASE_PATH}/player-zone-p1.png`,
    `${SURFACE_BASE_PATH}/player-zone-p2.png`,
    `${SURFACE_BASE_PATH}/market-card-back-l1.png`,
    `${SURFACE_BASE_PATH}/market-card-back-l2.png`,
    `${SURFACE_BASE_PATH}/market-card-back-l3.png`,
    `${SURFACE_BASE_PATH}/royal-card-back.png`,
] as const;

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

export const CRITICAL_STARTUP_ASSET_PATHS = uniquePaths([
    ...DEFAULT_SURFACE_ASSET_PATHS,
    ...LEGACY_SURFACE_FALLBACK_ASSET_PATHS,
    ...CORE_GEM_ASSET_PATHS,
    ...CORE_UI_ICON_ASSET_PATHS,
]);

const preloadImageAsset = (path: string): Promise<void> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.decoding = 'async';
        (image as HTMLImageElement & { fetchPriority?: 'high' | 'low' | 'auto' }).fetchPriority =
            'low';
        image.onload = () => resolve();
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
