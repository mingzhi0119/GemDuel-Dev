import { BUFFS, ROYAL_CARDS } from '@gemduel/shared/constants';
import { CLASSIC_CARDS, ROGUE_CARDS } from '@gemduel/shared/data/realCards';
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
    ok: boolean;
}

interface AssetWarmupOptions {
    concurrency?: number;
    fetchPriority?: 'high' | 'low' | 'auto';
    onProgress?: (progress: AssetWarmupProgress) => void;
}

interface AssetPrefetchOptions {
    intervalMs?: number;
}

interface AssetLoadRecord {
    decoded: boolean;
    fetchPriority: 'high' | 'low' | 'auto';
    promise: Promise<boolean>;
    status: 'loading' | 'loaded' | 'failed';
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

const getCardFaceAssetPaths = (useBuffs: boolean): string[] =>
    uniquePaths(
        [...CLASSIC_CARDS, ...(useBuffs ? ROGUE_CARDS : []), ...ROYAL_CARDS].map(
            (card) => `/assets/cards/${card.id}.png`
        )
    );

const ROGUE_BUFF_ASSET_PATHS = uniquePaths(
    Object.values(BUFFS).map((buff) =>
        buff.id === 'none' ? null : `/assets/rogue-buffs/rogue-buff-${buff.id}.png`
    )
);

interface GameStartAssetOptions {
    useBuffs: boolean;
    surfaceTheme?: SurfaceThemeSelections;
    theme?: ThemeName;
    includeCardFaces?: boolean;
}

export const getGameStartAssetPaths = ({
    useBuffs,
    surfaceTheme,
    theme = 'dark',
    includeCardFaces = false,
}: GameStartAssetOptions): string[] =>
    uniquePaths([
        ...getSurfaceThemeAssetPaths(surfaceTheme, theme),
        ...CORE_GAME_ASSET_PATHS,
        ...(includeCardFaces ? getCardFaceAssetPaths(useBuffs) : []),
        ...(useBuffs ? ROGUE_BUFF_ASSET_PATHS : []),
    ]);

const assetLoadCache = new Map<string, AssetLoadRecord>();

export const prefetchAssetPaths = (
    paths: readonly string[],
    { intervalMs = 120 }: AssetPrefetchOptions = {}
): (() => void) => {
    const queue = uniquePaths(paths);
    let nextIndex = 0;
    let timeoutId: number | undefined;
    let cancelled = false;

    const enqueueNext = () => {
        if (cancelled || nextIndex >= queue.length) {
            return;
        }

        const path = queue[nextIndex]!;
        nextIndex += 1;
        const cachedLoad = assetLoadCache.get(path);

        if (cachedLoad?.status === 'loaded') {
            timeoutId = window.setTimeout(enqueueNext, intervalMs);
            return;
        }

        if (!cachedLoad) {
            const record: AssetLoadRecord = {
                decoded: false,
                fetchPriority: 'low',
                status: 'loading',
                promise: Promise.resolve(false),
            };
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.as = 'image';
            link.href = path;
            record.promise = new Promise((resolve) => {
                link.onload = () => {
                    record.status = 'loaded';
                    resolve(true);
                };
                link.onerror = () => {
                    if (record.status !== 'loaded') {
                        record.status = 'failed';
                    }

                    resolve(false);
                };
            });
            assetLoadCache.set(path, record);
            document.head.appendChild(link);
        }

        timeoutId = window.setTimeout(enqueueNext, intervalMs);
    };

    timeoutId = window.setTimeout(enqueueNext, 0);

    return () => {
        cancelled = true;
        if (timeoutId !== undefined) {
            window.clearTimeout(timeoutId);
        }
    };
};

export const getAssetWarmupProgress = (
    paths: readonly string[]
): { loaded: number; failed: number; total: number } => {
    const queue = uniquePaths(paths);
    let loaded = 0;
    let failed = 0;

    for (const path of queue) {
        const record = assetLoadCache.get(path);
        if (record?.status === 'loaded' || record?.status === 'failed') {
            loaded += 1;
        }

        if (record?.status === 'failed') {
            failed += 1;
        }
    }

    return {
        loaded,
        failed,
        total: queue.length,
    };
};

const preloadImageAsset = (
    path: string,
    fetchPriority: 'high' | 'low' | 'auto',
    decodeAfterLoad: boolean
): Promise<void> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.decoding = 'async';
        (image as HTMLImageElement & { fetchPriority?: 'high' | 'low' | 'auto' }).fetchPriority =
            fetchPriority;
        image.onload = () => {
            if (!decodeAfterLoad) {
                resolve();
                return;
            }

            void image.decode().then(resolve).catch(resolve);
        };
        image.onerror = () => reject(new Error(`Failed to preload ${path}`));
        image.src = path;
    });

const preloadFetchAsset = async (path: string): Promise<void> => {
    const response = await fetch(path, { cache: 'force-cache' });
    if (!response.ok) {
        throw new Error(`Failed to preload ${path}`);
    }

    await response.arrayBuffer();
};

const preloadAsset = (
    path: string,
    fetchPriority: 'high' | 'low' | 'auto',
    decodeAfterLoad: boolean
): Promise<void> => {
    if (fetchPriority === 'low' && !decodeAfterLoad && typeof fetch === 'function') {
        return preloadFetchAsset(path);
    }

    return preloadImageAsset(path, fetchPriority, decodeAfterLoad);
};

const runAssetLoad = (
    record: AssetLoadRecord,
    path: string,
    fetchPriority: 'high' | 'low' | 'auto',
    decodeAfterLoad: boolean
): Promise<boolean> =>
    preloadAsset(path, fetchPriority, decodeAfterLoad)
        .then(() => {
            record.status = 'loaded';
            record.decoded = record.decoded || decodeAfterLoad;
            return true;
        })
        .catch(() => {
            if (record.status !== 'loaded') {
                record.status = 'failed';
            }

            return false;
        });

const getOrCreateAssetLoad = (
    path: string,
    fetchPriority: 'high' | 'low' | 'auto'
): Promise<boolean> => {
    const cachedLoad = assetLoadCache.get(path);
    if (cachedLoad) {
        if (cachedLoad.status === 'loaded' && (cachedLoad.decoded || fetchPriority !== 'high')) {
            return Promise.resolve(true);
        }

        if (cachedLoad.status === 'failed') {
            return Promise.resolve(false);
        }

        if (cachedLoad.status === 'loaded' && fetchPriority === 'high' && !cachedLoad.decoded) {
            cachedLoad.fetchPriority = 'high';
            cachedLoad.promise = runAssetLoad(cachedLoad, path, 'high', true);
            return cachedLoad.promise;
        }

        if (
            cachedLoad.status === 'loading' &&
            fetchPriority === 'high' &&
            cachedLoad.fetchPriority !== 'high'
        ) {
            cachedLoad.fetchPriority = 'high';
            cachedLoad.promise = runAssetLoad(cachedLoad, path, 'high', true);
        }

        return cachedLoad.promise;
    }

    const record: AssetLoadRecord = {
        decoded: false,
        fetchPriority,
        status: 'loading',
        promise: Promise.resolve(false),
    };
    record.promise = runAssetLoad(record, path, fetchPriority, fetchPriority !== 'low');
    assetLoadCache.set(path, record);

    return record.promise;
};

export const warmAssetCache = async (
    paths: readonly string[],
    { concurrency = 4, fetchPriority = 'high', onProgress }: AssetWarmupOptions = {}
): Promise<{ loaded: number; failed: number; total: number }> => {
    const queue = uniquePaths(paths);
    let nextIndex = 0;
    let loaded = 0;
    let failed = 0;

    const report = (path: string, ok: boolean) => {
        onProgress?.({
            loaded: loaded + failed,
            total: queue.length,
            failed,
            path,
            ok,
        });
    };

    const worker = async () => {
        while (nextIndex < queue.length) {
            const path = queue[nextIndex]!;
            nextIndex += 1;

            const ok = await getOrCreateAssetLoad(path, fetchPriority);
            if (ok) {
                loaded += 1;
            } else {
                failed += 1;
            }

            report(path, ok);
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
